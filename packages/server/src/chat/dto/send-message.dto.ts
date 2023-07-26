import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
