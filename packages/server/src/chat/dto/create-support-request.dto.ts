import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSupportRequestDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
