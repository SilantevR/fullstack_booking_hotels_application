import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  hotelRoom: Types.ObjectId;
  @IsDateString()
  startDate: string;
  @IsDateString()
  endDate: string;
}
