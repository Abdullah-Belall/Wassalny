import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserTypeEnum } from '../types/enums/user-type.enum';

export class RegisterDto {
  @IsString()
  @IsOptional()
  image_id: string
  @IsString()
  user_name: string
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
  @IsString()
  @MinLength(10)
  phone: string;
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
