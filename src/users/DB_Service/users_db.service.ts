import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  Brackets,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class UsersDBService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}
  repo() {
    return this.usersRepo;
  }
  QB(alias: string) {
    return this.usersRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<UserEntity>) {
    return this.usersRepo.create(obj);
  }
  async save(user: UserEntity) {
    let saved: UserEntity;
    try {
      saved = await this.usersRepo.save(user);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
    return saved;
  }

  async nextIndex() {
    return ((await this.usersRepo.findOne({
      where: {},
      order: {
        index: 'DESC'
      }
    }))?.index || 0) + 1
  }

  async findOne({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<UserEntity>;
    select?: FindOptionsSelect<UserEntity>;
    relations?: string[];
    order?: FindOptionsOrder<UserEntity>;
  }) {
    const user = await this.usersRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return user;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<UserEntity>;
    select?: FindOptionsSelect<UserEntity>;
    relations?: string[];
    order?: FindOptionsOrder<UserEntity>;
  }) {
    const [users, total] = await this.usersRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { users, total };
  }
}
