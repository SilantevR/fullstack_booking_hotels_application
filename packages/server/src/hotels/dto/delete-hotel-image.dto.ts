import { UpdateHotelParams } from '../interfaces/interfaces';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class DeleteHotelImageDto {
  @IsNotEmpty()
  hotel: UpdateHotelParams;
  @IsNotEmpty()
  @IsString()
  src: string;
}
