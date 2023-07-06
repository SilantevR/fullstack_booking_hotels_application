import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  'hotelRoom': Types.ObjectId;
  @IsNotEmpty()
  @IsDateString()
  'startDate': string;
  @IsNotEmpty()
  @IsDateString()
  'endDate': string;
}
