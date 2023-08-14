import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Room } from '../../hotels/schemas/room.schema';
import { User } from '../../users/schemas/user.schema';
import { Hotel } from '../../hotels/schemas/hotel.schema';
export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking {
  @Prop({ required: true })
  dateStart: Date;
  @Prop({ required: true })
  dateEnd: Date;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Room', required: true })
  roomId: Room;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: User;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Hotel', required: true })
  hotelId: Hotel;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
