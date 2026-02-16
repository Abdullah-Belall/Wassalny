import { IsEnum, IsUUID } from 'class-validator';
import { TravelPassengerStatusEnum } from '../types/enums/travel-passenger-status.enum';

export class DriverUpdateStatusDto {
  @IsUUID()
  passenger_id: string;
  @IsEnum(TravelPassengerStatusEnum)
  status: TravelPassengerStatusEnum;
}
