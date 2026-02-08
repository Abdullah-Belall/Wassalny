import { IsJSON, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCarDto {
  @IsJSON()
  images_json: string
  @IsString()
  @IsOptional()
  driver_id: string
  @IsString()
  car_type: string;
  @IsString()
  color: string;
  @IsString()
  licence: string;
  @IsNumber()
  seats_count: number;
}
