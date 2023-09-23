import { HotelRoomService, QueryParams } from './interfaces/interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SearchRoomsParams } from './interfaces/interfaces';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room as IRoom } from './interfaces/interfaces';
import { HotelsService } from './hotels.service';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class RoomsService implements HotelRoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly hotelsService: HotelsService,
    private readonly bookingService: BookingService,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room = await this.roomModel.create({
        ...createRoomDto,
        hotel: createRoomDto.hotelId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await this.findById(room.id);
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async findById(id: Types.ObjectId) {
    try {
      return await this.roomModel
        .findById(id)
        .populate('hotel', ['id', 'title', 'description'])
        .select(['-__v'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async search(params: SearchRoomsParams) {
    try {
      const { limit, offset, hotel, isEnabled } = params;
      let query: QueryParams = {};
      if (isEnabled) {
        query.isEnabled = isEnabled;
      }

      let result = [];
      if (hotel) {
        const hotels = await this.hotelsService.search({
          title: hotel,
        });

        for (let item of hotels) {
          query.hotel = { _id: item._id.valueOf().toString() };
          const rooms = await this.roomModel
            .find(query)
            .populate('hotel', ['id', 'title', 'description'])
            .select(['-__v'])
            .exec();
          result = result.concat(rooms);
          if (result.length >= Number(limit) && !offset) {
            result = result.slice(0, Number(limit));
          } else if (result.length > Number(limit) && !offset) {
            result = result.slice(
              Number(offset),
              Number(offset) + Number(limit),
            );
          }
        }
      } else {
        const rooms = await this.roomModel
          .find(query)
          .skip(offset)
          .limit(limit)
          .populate('hotel', ['id', 'title', 'description'])
          .select(['-__v'])
          .exec();

        result = result.concat(rooms);
      }

      for (let [index, item] of result.entries()) {
        const IsRoomUnawailable = await this.bookingService.checkReservation(
          item.id,
          params.startDate,
          params.endDate,
        );

        if (IsRoomUnawailable) {
          result.splice(index, 1);
        }
      }

      return result;
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async update(id: Types.ObjectId, updateRoomDto: Room) {
    try {
      return await this.roomModel
        .findByIdAndUpdate(id, updateRoomDto, {
          returnDocument: 'after',
        })
        .populate('hotel', ['id', 'title', 'description'])
        .select(['-__v'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }
}
