import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  online?: boolean;
}
