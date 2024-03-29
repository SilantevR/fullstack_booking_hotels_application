import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Param,
  ValidationPipe,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SupportRequestService } from './support.request.service';
import { SupportRequestClientService } from './support.request.client.service';
import { SupportRequestEmployeeService } from './support.request.employee.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/interfaces';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkMessagesAsReadDto } from './dto/mark-messages-as-read.dto';
import { Types } from 'mongoose';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('/api/')
export class ChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Client)
  @Post('/client/support-requests/')
  async supportRequests(
    @ActiveUser('sub') id: ActiveUserData['sub'],
    @Body(new ValidationPipe()) supportRequestDto: CreateSupportRequestDto,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      user: id,
      text: supportRequestDto.text,
    });
  }

  @Roles(Role.Client)
  @Get('/client/support-requests/')
  async getSupportRequests(
    @ActiveUser('sub') id: ActiveUserData['sub'],
    @Query('isActive') isActive?: boolean,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return await this.supportRequestService.findSupportRequests({
      user: id,
      activeUser: id,
      isActive: isActive,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Roles(Role.Manager)
  @Get('/manager/support-requests/')
  async getManagerSupportRequests(
    @ActiveUser('sub') id: ActiveUserData['sub'],
    @Query('isActive') isActive?: boolean,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return await this.supportRequestService.findSupportRequests({
      user: null,
      activeUser: id,
      isActive: isActive,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Roles(Role.Manager, Role.Client)
  @Get('/common/support-requests/:id/messages')
  async getSupportRequestsMessages(
    @ActiveUser('sub') userId: ActiveUserData['sub'],
    @ActiveUser('role') role: ActiveUserData['role'],
    @Param('id') id: Types.ObjectId,
  ) {
    /*Доступно только пользователям с ролью manager и 
   пользователю с ролью client, который создал обращение.*/
    try {
      const supportRequest =
        await this.supportRequestService.findSupportRequestById(id);

      if (role === 'manager' || userId === supportRequest.user.id.valueOf()) {
        return await this.supportRequestService.getMessages(id);
      } else {
        throw new ForbiddenException({
          status: 'Что-то пошло не так',
          description: 'Информация недоступна',
        });
      }
    } catch (err) {
      throw new ForbiddenException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Manager, Role.Client)
  @Post('/common/support-requests/:id/messages')
  async sendMessage(
    @ActiveUser('sub') userId: ActiveUserData['sub'],
    @ActiveUser('role') role: ActiveUserData['role'],
    @Body() sendMessageDto: SendMessageDto,
    @Param('id') id: Types.ObjectId,
  ) {
    const supportRequest =
      await this.supportRequestService.findSupportRequestById(id);

    if (role === 'manager' || userId === supportRequest.user.id.valueOf()) {
      return await this.supportRequestService.sendMessage({
        supportRequest: id,
        author: userId,
        text: sendMessageDto.text,
      });
    } else {
      throw new ForbiddenException({
        status: 'Что-то пошло не так',
        description: 'Информация недоступна',
      });
    }
  }
  catch(err) {
    throw new ForbiddenException({
      status: err.response.status,
      description: err.response.description,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Manager, Role.Client)
  @Post('/common/support-requests/:id/messages/read')
  async readMessages(
    @ActiveUser('sub') userId: ActiveUserData['sub'],
    @ActiveUser('role') role: ActiveUserData['role'],
    @Body(new ValidationPipe()) markMessagesAsReadDto: MarkMessagesAsReadDto,
    @Param('id') id: Types.ObjectId,
  ) {
    try {
      const supportRequest =
        await this.supportRequestService.findSupportRequestById(id);
      if (role === 'manager') {
        return await this.supportRequestEmployeeService.markMessagesAsRead({
          user: userId,
          supportRequest: id,
          createdBefore: markMessagesAsReadDto.createdBefore,
        });
      } else if (userId === supportRequest.user.id.valueOf()) {
        return await this.supportRequestClientService.markMessagesAsRead({
          user: userId,
          supportRequest: id,
          createdBefore: markMessagesAsReadDto.createdBefore,
        });
      } else {
        throw new ForbiddenException({
          status: 'Что-то пошло не так',
          description: 'Информация недоступна',
        });
      }
    } catch (err) {
      throw new ForbiddenException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Manager)
  @Post('/manager/support-requests/:id/close')
  async closeRequest(@Param('id') id: Types.ObjectId) {
    {
      return await this.supportRequestEmployeeService.closeRequest(id);
    }
  }
}
