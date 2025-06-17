import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
