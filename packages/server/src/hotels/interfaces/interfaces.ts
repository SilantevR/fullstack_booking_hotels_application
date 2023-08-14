import { Types } from 'mongoose';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';

export interface Hotel {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id?: Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  hotel: Hotel;
}

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title?: string;
}
export interface QueryParams {
  hotel?: Types.ObjectId;
  isEnabled?: boolean;
}

export interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: Types.ObjectId): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: Types.ObjectId, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: Types.ObjectId;
  isEnabled?: boolean;
}

export interface HotelRoomService {
  create(data: CreateRoomDto): Promise<Room>;
  findById(id: Types.ObjectId): Promise<Room>;
  search(params: SearchRoomsParams): Promise<Room[]>;
  update(id: Types.ObjectId, data: UpdateRoomDto): Promise<Room>;
}
