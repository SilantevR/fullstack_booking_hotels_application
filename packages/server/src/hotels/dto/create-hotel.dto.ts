import { Hotel } from '../interfaces/interfaces';
import {
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 25, {
    message: (args) => {
      return 'Параметр должен содержать от 3 до 25 символов';
    },
  })
  title: Hotel['title'];
  @IsString()
  @Length(20, 250, {
    message: (args) => {
      return 'Параметр должен содержать от 20 до 250 символов';
    },
  })
  description: Hotel['description'];
}
