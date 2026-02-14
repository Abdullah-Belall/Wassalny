import { BadRequestException, Injectable } from '@nestjs/common';
import { TravelsDBService } from 'src/travels/DB_Service/travels_db.service';
import { CarsDBService } from 'src/cars/DB_Service/cars_db.service';
import { ReviewsDBService } from 'src/reviews/DB_Service/reviews_db.service';
import { UsersDBService } from 'src/users/DB_Service/users_db.service';
import { TravelsPassengersDBService } from 'src/travels_passengers/DB_Service/travels_passengers_db.service';
import { ImagesDBService } from 'src/images/DB_Service/images_db.service';

@Injectable()
export class SearchEngineService {
  constructor(
    private readonly travelDBService: TravelsDBService,
    private readonly carsDBService: CarsDBService,
    private readonly reviewsDBService: ReviewsDBService,
    private readonly usersDBService: UsersDBService,
    private readonly travelsPassengersDBService: TravelsPassengersDBService,
    private readonly imagesDBService: ImagesDBService,
  ) {}

  async searchEngine(
    entity: string,
    query: string,
    add_select: string,
    order_by: {
      column?: string;
      order?: 'DESC' | 'ASC';
    },
  ) {
    const parsedQuery: {
      column: string;
      condition: string;
      key: string;
      value: string | number | boolean | string[];
    }[] = JSON.parse(query);
    const qb = this.getQB(entity);

    if (!qb) {
      throw new BadRequestException('Not found Entity');
    }
    const filteredQueries = parsedQuery.filter(
      (e) =>
        e.column &&
        e.condition &&
        e.key &&
        e.value !== undefined &&
        e.value !== `%%`,
    );
    if (add_select) {
      const parsedAddSelect: string[] = JSON.parse(add_select);
      qb.addSelect(parsedAddSelect);
    }
    for (const lev of filteredQueries) {
      qb.andWhere(`${lev?.column} ${lev?.condition}`, {
        [lev?.key]: lev.value,
      });
    }
    if (order_by?.column) {
      qb.orderBy(
        `length(${order_by.column}::text)`,
        order_by.order ?? 'ASC',
      ).addOrderBy(`${order_by.column}::text`, order_by.order ?? 'ASC');
    }
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
    };
  }

  getQB(entity: string) {
    switch (entity) {
      case 'travels':
        return this.travelDBService
          .QB('travel')
          .leftJoin('travel.car', 'car')
          .leftJoin('car.images', 'images')
          .leftJoin('car.driver', 'driver')
          .leftJoin('driver.user', 'driver_user')
          .leftJoin('travel.reviews', 'reviews')
          .leftJoin('travel.travel_passengers', 'travel_passengers')
          .leftJoin('travel_passengers.passenger', 'passenger')
          .leftJoin('passenger.user', 'passenger_user');

      case 'cars':
        return this.carsDBService
          .QB('car')
          .leftJoin('car.images', 'images')
          .leftJoin('car.driver', 'driver')
          .leftJoin('driver.user', 'driver_user')
          .leftJoin('car.travels', 'travels');

      case 'reviews':
        return this.reviewsDBService
          .QB('review')
          .leftJoin('review.travel', 'travel')
          .leftJoin('travel.car', 'car')
          .leftJoin('car.driver', 'driver')
          .leftJoin('driver.user', 'driver_user');

      case 'users':
        return this.usersDBService
          .QB('user')
          .leftJoin('user.driver_ext', 'driver_ext')
          .leftJoin('user.passenger_ext', 'passenger_ext');

      case 'travels_passengers':
        return this.travelsPassengersDBService
          .QB('travel_passenger')
          .leftJoin('travel_passenger.travel', 'travel')
          .leftJoin('travel_passenger.passenger', 'passenger')
          .leftJoin('passenger.user', 'passenger_user')
          .leftJoin('travel.car', 'car')
          .leftJoin('car.driver', 'driver')
          .leftJoin('driver.user', 'driver_user');

      case 'images':
        return this.imagesDBService
          .QB('image')
          .leftJoin('image.car', 'car')
          .leftJoin('car.driver', 'driver')
          .leftJoin('driver.user', 'driver_user');

      default:
        return null;
    }
  }
}
