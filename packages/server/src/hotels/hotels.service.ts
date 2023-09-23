import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { RoomsService } from './rooms.service';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel } from './schemas/hotel.schema';
import { Model, Types } from 'mongoose';
import {
  IHotelService,
  QueryParams,
  SearchHotelParams,
} from './interfaces/interfaces';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<Hotel>) {}

  async create(createHotelDto: CreateHotelDto) {
    try {
      const hotel = await this.hotelModel.create({
        ...createHotelDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return {
        title: hotel.title,
        description: hotel.description,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
        id: hotel._id,
      };
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.response.description,
      });
    }
  }

  async findById(id: Types.ObjectId) {
    try {
      return await this.hotelModel.findById(id).select(['-__v']).exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: 'fail',
        description: err.message,
      });
    }
  }

  async search(params: SearchHotelParams) {
    const { limit, offset, title } = params;
    try {
      let query: QueryParams = {};
      if (title) {
        const regexp = new RegExp(title);
        query['title'] = { $regex: regexp, $options: 'ig' };
      }

      return await this.hotelModel
        .find(query)
        .skip(offset)
        .limit(limit)
        .select(['-__v'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  async update(id: Types.ObjectId, updateHotelDto: UpdateHotelDto) {
    try {
      return await this.hotelModel
        .findByIdAndUpdate(
          id,
          { ...updateHotelDto, updatedAt: new Date() },
          {
            returnDocument: 'after',
          },
        )
        .select(['-__v']);
    } catch (err) {
      throw new InternalServerErrorException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }
}
