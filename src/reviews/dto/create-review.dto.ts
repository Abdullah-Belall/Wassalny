import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ReviewTypeEnum } from 'src/types/enums/review-type.enum';

export class CreateReviewDto {
  @IsUUID()
  travel_id: string;
  @IsString()
  review: string;
  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;
  @IsEnum(ReviewTypeEnum)
  type: ReviewTypeEnum;
  @IsUUID()
  @IsOptional()
  passenger_id?: string; // Required when driver reviews a passenger
}
