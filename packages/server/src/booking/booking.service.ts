import { UsersService } from '../users/users.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  IReservation,
  Reservation,
  ReservationSearchOptions,
} from './interfaces/interfaces';
import { Types, Model } from 'mongoose';
import { RoomsService } from 'src/hotels/rooms.service';
import { Booking } from './schemas/booking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CheckBooking } from './check.booking';

@Injectable()
export class BookingService implements IReservation {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
    private readonly checkBooking: CheckBooking,
  ) {}

  async addReservation(
    userId: Types.ObjectId,
    createBokingDto: CreateBookingDto,
  ): Promise<Reservation | void> {
    try {
      const room = await this.roomsService.findById(createBokingDto.hotelRoom);
      if (room) {
        if (!room.isEnabled) {
          throw new ConflictException({
            status: 'fail',
            description: 'Номер не доступен',
          });
        }
        const bookings = await this.bookingModel
          .find({
            roomId: room._id,
          })
          .select(['-__v'])
          .exec();
        const IsRoomUnawailable = bookings.some((existBooking) => {
          return (
            this.checkBooking.check(createBokingDto.startDate, existBooking) ||
            this.checkBooking.check(createBokingDto.endDate, existBooking)
          );
        });
        if (IsRoomUnawailable) {
          throw new ConflictException({
            status: 'fail',
            description: 'Номер на выбранные даты забронирован',
          });
        }
        const newBooking = await this.bookingModel.create({
          dateStart: createBokingDto.startDate,
          dateEnd: createBokingDto.endDate,
          roomId: room._id,
          userId: userId,
          hotelId: room.hotel['_id'],
        });

        return {
          dateStart: newBooking.dateStart,
          dateEnd: newBooking.dateEnd,
          hotelRoom: {
            description: room.description,
            images: room.images,
          },
          hotel: {
            title: room.hotel.title,
            description: room.hotel.description,
          },
        };
      } else {
        throw new ConflictException({
          status: 'fail',
          description: 'Данные о номере не найдены',
        });
      }
    } catch (err) {
      throw new ConflictException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async removeReservation(id: Types.ObjectId): Promise<void> {
    try {
      await this.bookingModel.findByIdAndRemove(id).select(['-__v']).exec();
      return;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    let query = {};
    if (filter.dateStart && filter.dateEnd) {
      query = {
        userId: filter.userId,
        $and: [
          { dateStart: { $gte: new Date(filter.dateStart) } },
          { dateEnd: { $lte: new Date(filter.dateEnd) } },
        ],
      };
    } else if (filter.dateStart) {
      query = {
        userId: filter.userId,
        dateStart: { $gte: new Date(filter.dateStart) },
      };
    } else if (filter.dateEnd) {
      query = {
        userId: filter.userId,
        dateEnd: { $lte: new Date(filter.dateEnd) },
      };
    } else {
      query = {
        userId: filter.userId,
      };
    }
    try {
      const bookings = await this.bookingModel
        .find(query)
        .populate('roomId', ['description', 'images'])
        .populate('hotelId', ['title', 'description'])
        .select(['-__v'])
        .exec();

      const result = [];

      for (let booking of bookings) {
        //let room = await this.roomsService.findById(booking.roomId);
        result.push({
          id: booking.id,
          dateStart: booking.dateStart,
          dateEnd: booking.dateEnd,
          hotelRoom: booking.roomId,
          hotel: booking.hotelId,
        });
      }

      return result;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }
}
