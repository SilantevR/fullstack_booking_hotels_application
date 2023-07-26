import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MessageSchema, Message } from './message.schema';
import { SupportRequest as ISuportRequest } from '../interfaces/interfaces';
export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema()
export class SupportRequest {
  @Prop({ required: true })
  user: Types.ObjectId;
  @Prop({ required: true, default: new Date() })
  createdAt: Date;
  @Prop()
  isActive: boolean;
  @Prop({ type: [MessageSchema] })
  messages: Message[];
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
