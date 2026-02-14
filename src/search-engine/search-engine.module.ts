import { Module } from '@nestjs/common';
import { SearchEngineService } from './search-engine.service';
import { SearchEngineController } from './search-engine.controller';
import { TravelsModule } from 'src/travels/travels.module';
import { CarsModule } from 'src/cars/cars.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersModule } from 'src/users/users.module';
import { TravelsPassengersModule } from 'src/travels_passengers/travels_passengers.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TravelsModule,
    CarsModule,
    ReviewsModule,
    UsersModule,
    TravelsPassengersModule,
    ImagesModule,
  ],
  controllers: [SearchEngineController],
  providers: [SearchEngineService],
})
export class SearchEngineModule {}
