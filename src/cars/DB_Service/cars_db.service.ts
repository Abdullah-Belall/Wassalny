import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarEntity } from '../entities/car.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  Brackets,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class CarsDBService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carsRepo: Repository<CarEntity>,
  ) {}
  repo() {
    return this.carsRepo;
  }
  QB(alias: string) {
    return this.carsRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<CarEntity>) {
    return this.carsRepo.create(obj);
  }
  async save(car: CarEntity) {
    let saved: CarEntity;
    try {
      saved = await this.carsRepo.save(car);
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
    where: FindOptionsWhere<CarEntity>;
    select?: FindOptionsSelect<CarEntity>;
    relations?: string[];
    order?: FindOptionsOrder<CarEntity>;
  }) {
    const car = await this.carsRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return car;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<CarEntity>;
    select?: FindOptionsSelect<CarEntity>;
    relations?: string[];
    order?: FindOptionsOrder<CarEntity>;
  }) {
    const [cars, total] = await this.carsRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { cars, total };
  }
}

