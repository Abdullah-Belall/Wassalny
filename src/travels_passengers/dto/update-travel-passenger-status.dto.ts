import { IsEnum } from "class-validator";
import { TravelPassengerStatusEnum } from "../types/enums/travel-passenger-status.enum";

export class UpdateTravelPassengerStatusDto {
  @IsEnum(TravelPassengerStatusEnum)
  status: TravelPassengerStatusEnum
}
