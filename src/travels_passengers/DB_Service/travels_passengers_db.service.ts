import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelsPassengerEntity } from '../entities/travels_passenger.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class TravelsPassengersDBService {
  constructor(
    @InjectRepository(TravelsPassengerEntity)
    private readonly travelsPassengersRepo: Repository<TravelsPassengerEntity>,
  ) {}
  repo() {
    return this.travelsPassengersRepo;
  }
  QB(alias: string) {
    return this.travelsPassengersRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<TravelsPassengerEntity>) {
    return this.travelsPassengersRepo.create(obj);
  }
  async save(travelPassenger: TravelsPassengerEntity) {
    let saved: TravelsPassengerEntity;
    try {
      saved = await this.travelsPassengersRepo.save(travelPassenger);
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
    where: FindOptionsWhere<TravelsPassengerEntity>;
    select?: FindOptionsSelect<TravelsPassengerEntity>;
    relations?: string[];
    order?: FindOptionsOrder<TravelsPassengerEntity>;
  }) {
    const travelPassenger = await this.travelsPassengersRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return travelPassenger;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<TravelsPassengerEntity>;
    select?: FindOptionsSelect<TravelsPassengerEntity>;
    relations?: string[];
    order?: FindOptionsOrder<TravelsPassengerEntity>;
  }) {
    const [travelsPassengers, total] = await this.travelsPassengersRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { travelsPassengers, total };
  }
}

