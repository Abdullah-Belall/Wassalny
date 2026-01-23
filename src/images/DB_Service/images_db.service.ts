import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../entities/image.entity';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  Brackets,
  FindOptionsOrder,
  DeepPartial,
} from 'typeorm';

@Injectable()
export class ImagesDBService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imagesRepo: Repository<ImageEntity>,
  ) {}
  repo() {
    return this.imagesRepo;
  }
  QB(alias: string) {
    return this.imagesRepo.createQueryBuilder(alias);
  }
  instance(obj: DeepPartial<ImageEntity>) {
    return this.imagesRepo.create(obj);
  }
  async save(image: ImageEntity) {
    let saved: ImageEntity;
    try {
      saved = await this.imagesRepo.save(image);
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
    where: FindOptionsWhere<ImageEntity>;
    select?: FindOptionsSelect<ImageEntity>;
    relations?: string[];
    order?: FindOptionsOrder<ImageEntity>;
  }) {
    const image = await this.imagesRepo.findOne({
      where,
      select,
      relations,
      order,
    });
    return image;
  }

  async find({
    where,
    select,
    relations,
    order,
  }: {
    where: FindOptionsWhere<ImageEntity>;
    select?: FindOptionsSelect<ImageEntity>;
    relations?: string[];
    order?: FindOptionsOrder<ImageEntity>;
  }) {
    const [images, total] = await this.imagesRepo.findAndCount({
      where,
      select,
      relations,
      order,
    });
    return { images, total };
  }
}

