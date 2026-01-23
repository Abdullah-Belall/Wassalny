import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './entities/car.entity';
import { CarsDBService } from './DB_Service/cars_db.service';
import { ImagesModule } from 'src/images/images.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity]), ImagesModule, UsersModule],
  controllers: [CarsController],
  providers: [CarsService, CarsDBService],
  exports: [CarsDBService],
})
export class CarsModule {}
