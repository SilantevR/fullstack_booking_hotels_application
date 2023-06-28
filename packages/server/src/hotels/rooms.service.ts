import { HotelRoomService } from './interfaces/interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchRoomsParams } from './interfaces/interfaces';
import { UpdateRoomDto } from './dto/update-room.dto';
import { HotelsService } from './hotels.service';

@Injectable()
export class RoomsService implements HotelRoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly hotelsService: HotelsService,
  ) {}

  async create(createRoomDto: Room) {
    try {
      const room = await this.roomModel.create({
        ...createRoomDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return room;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.roomModel.findById(id).select(['-__v']).exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async search(params: SearchRoomsParams) {
    const { limit, offset, hotel, isEnabled } = params;
    try {
      return await this.roomModel
        .find({ 'hotel._id': hotel, isEnabled })
        .skip(offset)
        .limit(limit)
        .select(['-__v'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }
  async update(id: string, updateRoomDto: Room) {
    try {
      return await this.roomModel
        .findByIdAndUpdate(id, updateRoomDto, {
          returnDocument: 'after',
        })
        .select(['-__v']);
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }
}
