import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassengerUserEntity } from '../entities/passenger-user-ext.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  Brackets,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class PassengerUserExtDBService {
  constructor(
    @InjectRepository(PassengerUserEntity)
    private readonly passengerUserExtRepo: Repository<PassengerUserEntity>,
  ) { }
  repo() {
    return this.passengerUserExtRepo;
  }
  QB(alias: string) {
    return this.passengerUserExtRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<PassengerUserEntity>) {
    return this.passengerUserExtRepo.create(obj);
  }
  async save(passengerUserExt: PassengerUserEntity) {
    let saved: PassengerUserEntity;
    try {
      saved = await this.passengerUserExtRepo.save(passengerUserExt);
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
    where: FindOptionsWhere<PassengerUserEntity>;
    select?: FindOptionsSelect<PassengerUserEntity>;
    relations?: string[];
    order?: FindOptionsOrder<PassengerUserEntity>;
  }) {
    const passengerUserExt = await this.passengerUserExtRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return passengerUserExt;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<PassengerUserEntity>;
    select?: FindOptionsSelect<PassengerUserEntity>;
    relations?: string[];
    order?: FindOptionsOrder<PassengerUserEntity>;
  }) {
    const [passengerUserExts, total] = await this.passengerUserExtRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { passengerUserExts, total };
  }
}

