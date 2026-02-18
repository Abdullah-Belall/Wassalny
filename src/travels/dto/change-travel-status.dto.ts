import { IsIn } from 'class-validator';
import { TravelStatusEnum } from '../types/enums/travel-status.enum';

export class UpdateTravelStatusDto {
  @IsIn(
    Object.values(TravelStatusEnum).filter(
      (e) =>
        e !== TravelStatusEnum.PENDING &&
        e !== TravelStatusEnum.FULLY_BOOKED &&
        e !== TravelStatusEnum.BOOKING,
    ),
  )
  status:
    | TravelStatusEnum.ACCIDENT
    | TravelStatusEnum.CANCELLED
    | TravelStatusEnum.FINISHED
    | TravelStatusEnum.IN_PROGRESS
    | TravelStatusEnum.MALFUNCTION
    | TravelStatusEnum.STARTED;
}
