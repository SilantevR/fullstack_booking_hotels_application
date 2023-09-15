import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { HashingService } from '../auth/hashing.service';
import { IUserService } from './interfaces/interfaces';
import { SearchUserParams } from './interfaces/interfaces';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.findByEmail(createUserDto.email);
      //console.log(user);
      if (user) {
        throw new ConflictException({
          status: 'fail',
          description: 'пользователь с таким email уже существует.',
        });
      } else {
        const password = await this.hashingService.hash(createUserDto.password);
        return await this.userModel.create({
          ...createUserDto,
          password,
        });
      }
    } catch (err) {
      throw new ConflictException({
        status: err.response.status,
        message: err.response.description,
      });
    }
  }

  async findById(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id).select(['-__v']).exec();
      return user;
    } catch (err) {
      throw new InternalServerErrorException({
        status: err.response.status,
        message: err.response.description,
      });
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email }).select(['-__v']).exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: err.response.status,
        message: err.response.description,
      });
    }
  }

  async findAll(params: SearchUserParams) {
    try {
      let query = {};
      if (params.email) {
        query = { email: params.email };
      } else if (params.name && params.contactPhone) {
        query = {
          $and: [
            { name: { $regex: new RegExp(params.name, 'g') } },
            { phone: { $regex: new RegExp(params.contactPhone, 'g') } },
          ],
        };
      } else if (params.name) {
        query = { name: { $regex: new RegExp(params.name, 'g') } };
      } else if (params.contactPhone) {
        query = { phone: { $regex: new RegExp(params.contactPhone, 'g') } };
      }
      return this.userModel
        .find(query)
        .skip(params.offset)
        .limit(params.limit)
        .select(['-__v', '-password'])
        .exec();
    } catch (err) {
      throw new InternalServerErrorException({
        status: err.response.status,
        message: err.response.description,
      });
    }
  }
}
