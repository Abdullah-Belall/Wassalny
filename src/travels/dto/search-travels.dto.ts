import { IsOptional, IsString, IsDateString } from 'class-validator';

export class SearchTravelsDto {
  @IsOptional()
  @IsString()
  start_location?: string;

  @IsOptional()
  @IsString()
  end_location?: string;

  @IsOptional()
  @IsDateString()
  start_time_from?: string;

  @IsOptional()
  @IsDateString()
  start_time_to?: string;
}
