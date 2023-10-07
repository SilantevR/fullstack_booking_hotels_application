import { UpdateRoomParams } from '../interfaces/interfaces';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteRoomImageDto {
  @IsNotEmpty()
  room: UpdateRoomParams;
  @IsNotEmpty()
  @IsString()
  src: string;
}
