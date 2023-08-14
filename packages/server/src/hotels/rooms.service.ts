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

@Injectable()
export class RoomsService implements HotelRoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly hotelsService: HotelsService,
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
    const { limit, offset, hotel, isEnabled } = params;
    let query: QueryParams = {};
    if (hotel) {
      query.hotel = hotel;
    }
    if (isEnabled) {
      query.isEnabled = isEnabled;
    }

    try {
      return await this.roomModel
        .find(query)
        .skip(offset)
        .limit(limit)
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
