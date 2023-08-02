import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Message as IMessage } from '../interfaces/interfaces';
export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ required: true })
  author: Types.ObjectId;
  @Prop({ required: true, default: new Date() })
  sentAt: Date;
  @Prop({ required: true })
  text: string;
  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
