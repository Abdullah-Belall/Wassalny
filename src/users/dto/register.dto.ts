import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserTypeEnum } from '../types/enums/user-type.enum';

export class RegisterDto {
  @IsString()
  @IsOptional()
  image_id: string;
  @IsString()
  @IsOptional()
  driving_license_id: string;
  @IsString()
  user_name: string;
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
  @IsString()
  @MinLength(10)
  phone: string;
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
  @IsString()
  @IsOptional()
  @Length(14, 14, { message: 'ssn must be exactly 14 characters' })
  ssn?: string;
}
