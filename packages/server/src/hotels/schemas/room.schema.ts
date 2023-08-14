import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Hotel } from './hotel.schema';
export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ required: true })
  title: string;
  @Prop()
  description: string;
  @Prop({ required: true, default: [] })
  images: string[];
  @Prop({ required: true, default: true })
  isEnabled: boolean;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Hotel', required: true })
  hotel: Hotel;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
