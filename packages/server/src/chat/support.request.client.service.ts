import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
  Message as IMessage,
} from './interfaces/interfaces';
import { Types } from 'mongoose';
import {
  CreateSupportRequestDto,
  SupportRequest as ISupportRequest,
} from './interfaces/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest } from './schemas/support-request.schema';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { SupportRequestService } from './support.request.service';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    private readonly supportRequestService: SupportRequestService,
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<ISupportRequest> {
    try {
      const message = await this.messageModel.create({
        author: data.user,
        sentAt: new Date(),
        text: data.text,
        readAt: undefined,
      });
      const supportRequest = await this.supportRequestModel.create({
        user: data.user,
        createdAt: new Date(),
        isActive: true,
        messages: [message._id],
      });
      return {
        id: supportRequest._id,
        user: supportRequest.user,
        createdAt: supportRequest.createdAt,
        isActive: supportRequest.isActive,
        hasNewMessages: true,
      };
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    try {
      const unreadMessages = await this.getUnreadCount(
        params.supportRequest,
        params.user,
      );
      for (let message of unreadMessages) {
        await this.messageModel.findByIdAndUpdate(
          message._id,
          { readAt: new Date() },
          {
            returnDocument: 'after',
          },
        );
      }
      await this.supportRequestModel.findByIdAndUpdate();

      return {
        success: true,
      };
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
    /*должен выставлять текущую дату в поле readAt всем сообщениям, 
    которые не были прочитаны и были отправлены не пользователем.*/
  }
  async getUnreadCount(
    supportRequest: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IMessage[]> {
    try {
      const sRequest = await this.supportRequestService.findSupportRequestById(
        supportRequest,
      );
      /*await this.supportRequestModel
        .findById(supportRequest)
        .populate('messages')
        .select(['-__v'])
        .exec();*/
      const result = [];
      sRequest.messages.map((message) => {
        if (!message.readAt && message.author.id.valueOf() != userId) {
          result.push(message);
        }
      });
      return result;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
    /*должен возвращать количество сообщений, 
    которые были отправлены любым сотрудником поддержки и не отмечены прочитанным.*/
  }
}
