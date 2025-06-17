import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  online?: boolean;
}
