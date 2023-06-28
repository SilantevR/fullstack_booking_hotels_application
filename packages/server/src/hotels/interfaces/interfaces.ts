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
  _id?: Types.ObjectId;
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

export interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: string): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: string, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: Types.ObjectId;
  isEnabled?: boolean;
}

export interface HotelRoomService {
  create(data: Room): Promise<Room>;
  findById(id: string): Promise<Room>;
  search(params: SearchRoomsParams): Promise<Room[]>;
  update(id: string, data: UpdateRoomDto): Promise<Room>;
}
