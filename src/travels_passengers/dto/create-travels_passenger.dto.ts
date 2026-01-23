import { IsNumber, IsUUID } from "class-validator";

export class CreateTravelsPassengerDto {
  @IsUUID()
  travel_id: string;
  @IsUUID()
  passenger_id: string;
  @IsNumber()
  deposit: number;
}
