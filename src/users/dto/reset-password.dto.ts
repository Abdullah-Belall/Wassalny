import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  new_password: string;
}
