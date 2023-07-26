import { IsDateString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class MarkMessagesAsReadDto {
  @IsNotEmpty()
  @IsDateString()
  createdBefore: Date;
}
