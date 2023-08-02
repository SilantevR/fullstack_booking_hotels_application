import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
  Message as IMessage,
} from './interfaces/interfaces';
import { Types } from 'mongoose';
import { SupportRequestService } from './support.request.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportRequest } from './schemas/support-request.schema';
import { Message } from './schemas/message.schema';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    private readonly supportRequestService: SupportRequestService,
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

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
    которые не были прочитаны и были отправлены пользователем.*/
  }

  async getUnreadCount(
    supportRequest: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IMessage[]> {
    try {
      const sRequest = await this.supportRequestModel
        .findById(supportRequest)
        .populate('messages')
        .select(['-__v'])
        .exec();
      const result = [];
      sRequest.messages.map((message) => {
        if (!message.readAt && message.author != userId) {
          result.push(message);
        }
      });
      //console.log(result);
      return result;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }

    return;
    /*должен возвращать количество сообщений, 
    которые были отправлены пользователем и не отмечены прочитанными.*/
  }
  async closeRequest(supportRequest: Types.ObjectId): Promise<void> {
    try {
      await this.supportRequestModel
        .findByIdAndUpdate(
          supportRequest,
          { isActive: false },
          {
            returnDocument: 'after',
          },
        )
        .select(['-__v'])
        .exec();
      return;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }
}
