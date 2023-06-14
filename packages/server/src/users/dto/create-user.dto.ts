import { User } from '../interfaces/interfaces';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: User['email'];
  @IsString()
  @IsNotEmpty()
  @Length(3, 25, {
    message: (args) => {
      return 'Параметр должен содержать от 10 до 25 символов';
    },
  })
  name: User['name'];
  @IsMobilePhone()
  phone: User['contactPhone'];
  @IsStrongPassword()
  @IsNotEmpty()
  password: User['password'];
}
