import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeKnownPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  current_password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  new_password: string;
}
