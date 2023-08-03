import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  author: User;
  @Prop({ required: true, default: new Date() })
  sentAt: Date;
  @Prop({ required: true })
  text: string;
  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
