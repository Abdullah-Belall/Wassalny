import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsController } from './travels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelEntity } from './entities/travel.entity';
import { TravelsDBService } from './DB_Service/travels_db.service';
import { CarsModule } from 'src/cars/cars.module';

@Module({
  imports: [TypeOrmModule.forFeature([TravelEntity]), CarsModule],
  controllers: [TravelsController],
  providers: [TravelsService, TravelsDBService],
  exports: [TravelsDBService],
})
export class TravelsModule {}
