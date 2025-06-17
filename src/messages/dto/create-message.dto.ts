import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsInt()
  sender_id: number;

  @ApiProperty()
  @IsInt()
  receiver_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
