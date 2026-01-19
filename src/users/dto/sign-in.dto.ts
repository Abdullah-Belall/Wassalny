import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(10)
  phone: string;
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
