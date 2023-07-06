import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoomSchema, Room } from 'src/hotels/schemas/room.schema';
import { UserSchema, User } from 'src/users/schemas/user.schema';
export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking {
  @Prop({ required: true })
  dateStart: Date;
  @Prop({ required: true })
  dateEnd: Date;
  @Prop({ required: true })
  roomId: Types.ObjectId;
  @Prop({ required: true })
  userId: Types.ObjectId;
  @Prop({ required: true })
  hotelId: Types.ObjectId;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
