import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  Get,
  Query,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { Auth } from '../auth/decorator/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Post('/admin/users/')
  async createByAdmin(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        name: user.name,
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
      };
    } catch (err) {
      throw new ConflictException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  @Get('/admin/users/')
  async findAUsers(
    @Query('email') email?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    const params = {
      email,
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
      name,
      contactPhone,
    };
    return await this.usersService.findAll(params);
  }

  @Get('/manager/users/')
  async findMUsers(
    @Query('email') email?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    const params = {
      email,
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
      name,
      contactPhone,
    };
    return await this.usersService.findAll(params);
  }
}
