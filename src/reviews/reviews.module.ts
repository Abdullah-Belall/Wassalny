import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsDBService } from './DB_Service/reviews_db.service';
import { TravelsModule } from 'src/travels/travels.module';
import { TravelsPassengersModule } from 'src/travels_passengers/travels_passengers.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    TravelsModule,
    TravelsPassengersModule,
    UsersModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsDBService],
  exports: [ReviewsDBService],
})
export class ReviewsModule {}
