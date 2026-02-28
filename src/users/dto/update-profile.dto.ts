import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  user_name?: string;

  @IsString()
  @IsOptional()
  image_id?: string;

  @IsString()
  @IsOptional()
  @Length(14, 14, { message: 'ssn must be exactly 14 characters' })
  ssn?: string;

  @IsString()
  @IsOptional()
  driving_license_id: string;
}
