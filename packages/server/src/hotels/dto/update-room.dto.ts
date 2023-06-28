import { Room } from '../interfaces/interfaces';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateRoomDto {
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

  @IsArray()
  images: Room['images'];

  @IsBoolean()
  isEnabled: Room['isEnabled'];

  @IsDateString()
  createdAt: Room['createdAt'];

  @IsNotEmpty()
  hotel: Room['hotel'];
}
