import { User } from '../interfaces/interfaces';

export class CreateUserDto {
  /*@IsString()
    @IsNotEmpty()
    @Length(3, 20, {
      message: 'Параметр должен содержать от 3 до 20 символов',
    })*/
  email: User['email'];
  /*@IsString()
    @IsNotEmpty()
    @Length(10, 250, {
      message: (args) => {
        //console.log(args);
        return 'Параметр должен содержать от 10 до 250 символов';
      },
    })*/
  name: User['name'];
  /*@IsEmail()
    @IsNotEmpty()*/
  phone: User['contactPhone'];

  /* @IsStrongPassword()
    @IsNotEmpty()*/
  password: User['passwordHash'];
}
