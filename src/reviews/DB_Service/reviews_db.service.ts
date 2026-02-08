import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from '../entities/review.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';
import { ReviewTypeEnum } from 'src/types/enums/review-type.enum';

@Injectable()
export class ReviewsDBService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepo: Repository<ReviewEntity>,
  ) {}
  repo() {
    return this.reviewsRepo;
  }
  QB(alias: string) {
    return this.reviewsRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<ReviewEntity>) {
    return this.reviewsRepo.create(obj);
  }
  async nextIndex(travel_id: string, type: ReviewTypeEnum) {
    return await this.reviewsRepo.count({
      where: {
        travel: {
          id: travel_id,
        },
        type
      }
    })
  }

  async findReviewByTravelAndType(travel_id: string, type: ReviewTypeEnum) {
    return await this.reviewsRepo.findOne({
      where: {
        travel: {
          id: travel_id,
        },
        type,
      },
      relations: ['travel', 'travel.car', 'travel.car.driver', 'travel.car.driver.user'],
    });
  }

  async findReviewsByTravelAndType(travel_id: string, type: ReviewTypeEnum) {
    return await this.reviewsRepo.find({
      where: {
        travel: {
          id: travel_id,
        },
        type,
      },
      relations: ['travel', 'travel.car', 'travel.car.driver', 'travel.car.driver.user'],
    });
  }
  async save(review: ReviewEntity) {
    let saved: ReviewEntity;
    try {
      saved = await this.reviewsRepo.save(review);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
    return saved;
  }

  async findOne({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<ReviewEntity>;
    select?: FindOptionsSelect<ReviewEntity>;
    relations?: string[];
    order?: FindOptionsOrder<ReviewEntity>;
  }) {
    const review = await this.reviewsRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return review;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<ReviewEntity>;
    select?: FindOptionsSelect<ReviewEntity>;
    relations?: string[];
    order?: FindOptionsOrder<ReviewEntity>;
  }) {
    const [reviews, total] = await this.reviewsRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { reviews, total };
  }
}

