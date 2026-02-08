import { IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateTravelDto {
  @IsUUID()
  car_id: string;
  @IsString()
  details: string;
  @IsDateString()
  start_time: string;
  @IsString()
  start_location: string;
  @IsString()
  end_location: string;
  @IsNumber()
  duration_by_minutes: number;
  @IsNumber()
  available_seats: number;
  @IsNumber()
  price_per_seat: number;
}
