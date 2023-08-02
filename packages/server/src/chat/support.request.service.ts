import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISupportRequestService } from './interfaces/interfaces';
import {
  GetChatListParams,
  SupportRequest as ISupportRequest,
  Message as IMessage,
  SendMessageDto,
} from './interfaces/interfaces';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest } from './schemas/support-request.schema';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageCreatedEvent } from './events/message-created.event';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<ISupportRequest[]> {
    try {
      let query = {};
      if (params.user) {
        query = { user: params.user, isActive: params.isActive };
      } else {
        query = { isActive: params.isActive };
      }
      return await this.supportRequestModel
        .find(query)
        .limit(params.limit)
        .skip(params.offset)
        .select(['-__v'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async findSupportRequestById(supportRequest: Types.ObjectId) {
    try {
      return await this.supportRequestModel
        .findById(supportRequest)
        .populate('messages', ['-__v'])
        .select(['-__v'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async sendMessage(data: SendMessageDto): Promise<IMessage> {
    try {
      const supportRequest = await this.findSupportRequestById(
        data.supportRequest,
      );
      const message = await this.messageModel.create({
        author: data.author,
        sentAt: new Date(),
        text: data.text,
        readAt: undefined,
      });
      supportRequest.messages.push(message.id);

      await this.supportRequestModel
        .findByIdAndUpdate(
          data.supportRequest,
          { messages: supportRequest.messages },
          {
            returnDocument: 'after',
          },
        )
        .select(['-__v'])
        .exec();

      const messageSendEvent = new MessageCreatedEvent();
      messageSendEvent.supportRequest = supportRequest.id;
      messageSendEvent.message = message;
      this.eventEmitter.emit('message.send', messageSendEvent);

      return message;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async getMessages(supportRequest: Types.ObjectId): Promise<IMessage[]> {
    try {
      const sRequest = await this.findSupportRequestById(supportRequest);
      return sRequest.messages;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }
}
