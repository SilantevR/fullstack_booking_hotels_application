import { Types } from 'mongoose';

export class MessageCreatedEvent {
  author: Types.ObjectId;
  text: string;
  sentAt: Date;
}
