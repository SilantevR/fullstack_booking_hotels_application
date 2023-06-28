import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type HotelDocument = HydratedDocument<Hotel>;

@Schema()
export class Hotel {
  @Prop({ required: true })
  title: string;
  @Prop()
  description: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
