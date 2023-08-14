import { Types } from 'mongoose';
import { Room } from '../interfaces/interfaces';
import { IsString, Length, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 25, {
    message: (args) => {
      return 'Параметр должен содержать от 3 до 25 символов';
    },
  })
  title: Room['title'];
  @IsString()
  @Length(20, 250, {
    message: (args) => {
      return 'Параметр должен содержать от 20 до 250 символов';
    },
  })
  description: Room['description'];

  @IsNotEmpty()
  @IsMongoId()
  hotelId: Types.ObjectId;

  images: string[];
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
