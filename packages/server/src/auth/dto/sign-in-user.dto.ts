import { User } from '../../users/interfaces/interfaces';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: User['email'];

  @IsString()
  @IsNotEmpty()
  password: User['password'];
}
