import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Message } from './message.schema';
import { User } from '../../users/schemas/user.schema';
export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema()
export class SupportRequest {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({ required: true, default: new Date() })
  createdAt: Date;
  @Prop()
  isActive: boolean;
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Message' })
  messages: Message[];
  @Prop()
  hasNewMessages: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
