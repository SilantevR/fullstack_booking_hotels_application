import { Types } from 'mongoose';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { User } from 'src/users/interfaces/interfaces';
import { Room } from 'src/hotels/interfaces/interfaces';

export interface ReservationDto {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  roomId: Types.ObjectId;
  hotelId: Types.ObjectId;
  dateStart: Date;
  dateEnd: Date;
}

export interface Reservation {
  _id?: Types.ObjectId;
  hotelRoom: {
    description: string;
    images: string[];
  };
  hotel: {
    title: string;
    description: string;
  };
  dateStart: Date;
  dateEnd: Date;
}

export interface ReservationSearchOptions {
  userId: Types.ObjectId;
  dateStart: Date;
  dateEnd: Date;
}
export interface IReservation {
  addReservation(
    userId: Types.ObjectId,
    data: CreateBookingDto,
  ): Promise<Reservation | void>;
  removeReservation(id: Types.ObjectId): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
