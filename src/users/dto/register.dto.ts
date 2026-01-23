import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserTypeEnum } from '../types/enums/user-type.enum';

export class RegisterDto {
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
