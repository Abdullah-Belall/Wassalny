import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverUserEntity } from '../entities/driver-user-ext.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  Brackets,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class DriverUserExtDBService {
  constructor(
    @InjectRepository(DriverUserEntity)
    private readonly driverUserExtRepo: Repository<DriverUserEntity>,
  ) {}
  repo() {
    return this.driverUserExtRepo;
  }
  QB(alias: string) {
    return this.driverUserExtRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<DriverUserEntity>) {
    return this.driverUserExtRepo.create(obj);
  }
  async save(driverUserExt: DriverUserEntity) {
    let saved: DriverUserEntity;
    try {
      saved = await this.driverUserExtRepo.save(driverUserExt);
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
    where: FindOptionsWhere<DriverUserEntity>;
    select?: FindOptionsSelect<DriverUserEntity>;
    relations?: string[];
    order?: FindOptionsOrder<DriverUserEntity>;
  }) {
    const driverUserExt = await this.driverUserExtRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return driverUserExt;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<DriverUserEntity>;
    select?: FindOptionsSelect<DriverUserEntity>;
    relations?: string[];
    order?: FindOptionsOrder<DriverUserEntity>;
  }) {
    const [driverUserExts, total] = await this.driverUserExtRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { driverUserExts, total };
  }
}

