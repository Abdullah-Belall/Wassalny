import { BadRequestException, Injectable } from '@nestjs/common';
import { TravelsDBService } from 'src/travels/DB_Service/travels_db.service';

@Injectable()
export class SearchEngineService {
  constructor(private readonly travelDBService: TravelsDBService) {}

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
    }
  }
}
