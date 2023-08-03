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
        //.populate('messages.author', ['-__v'])
        .populate({
          path: 'messages',
          select: ['-__v'],
          populate: {
            path: 'author',
            model: 'User',
            select: ['id', 'name'],
          },
        })
        .populate('user', ['id', 'name'])
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

  async findSupportRequestById(
    supportRequest: Types.ObjectId,
  ): Promise<ISupportRequest> {
    try {
      return await this.supportRequestModel
        .findById(supportRequest)
        //.populate('messages', ['-__v'])
        .populate({
          path: 'messages',
          select: ['-__v'],
          populate: {
            path: 'author',
            model: 'User',
            select: ['id', 'name'],
          },
        })
        .populate('user', ['id', 'name'])
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
      const supportRequest = await this.supportRequestModel
        .findById(data.supportRequest)
        .exec();
      const message = await this.messageModel.create({
        author: data.author,
        sentAt: new Date(),
        text: data.text,
        readAt: undefined,
      });

      supportRequest.messages.push(message.id);

      const updatedSR = await this.supportRequestModel
        .findByIdAndUpdate(
          data.supportRequest,
          { messages: supportRequest.messages },
          {
            returnDocument: 'after',
          },
        )
        .populate({
          path: 'messages',
          select: ['-__v'],
          populate: {
            path: 'author',
            model: 'User',
            select: ['id', 'name'],
          },
        })
        .populate('user', ['id', 'name'])
        .select(['-__v'])
        .exec();

      this.eventEmitter.emit('message.send', updatedSR);

      return updatedSR.messages[updatedSR.messages.length - 1];
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
