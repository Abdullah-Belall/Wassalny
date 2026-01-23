import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelEntity } from '../entities/travel.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class TravelsDBService {
  constructor(
    @InjectRepository(TravelEntity)
    private readonly travelsRepo: Repository<TravelEntity>,
  ) {}
  repo() {
    return this.travelsRepo;
  }
  QB(alias: string) {
    return this.travelsRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<TravelEntity>) {
    return this.travelsRepo.create(obj);
  }
  async save(travel: TravelEntity) {
    let saved: TravelEntity;
    try {
      saved = await this.travelsRepo.save(travel);
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
    where: FindOptionsWhere<TravelEntity>;
    select?: FindOptionsSelect<TravelEntity>;
    relations?: string[];
    order?: FindOptionsOrder<TravelEntity>;
  }) {
    const travel = await this.travelsRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return travel;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<TravelEntity>;
    select?: FindOptionsSelect<TravelEntity>;
    relations?: string[];
    order?: FindOptionsOrder<TravelEntity>;
  }) {
    const [travels, total] = await this.travelsRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { travels, total };
  }
}

