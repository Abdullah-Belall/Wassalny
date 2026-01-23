import { Module } from '@nestjs/common';
import { TravelsPassengersService } from './travels_passengers.service';
import { TravelsPassengersController } from './travels_passengers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelsPassengerEntity } from './entities/travels_passenger.entity';
import { TravelsPassengersDBService } from './DB_Service/travels_passengers_db.service';
import { TravelsModule } from 'src/travels/travels.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelsPassengerEntity]),
    TravelsModule,
    UsersModule,
  ],
  controllers: [TravelsPassengersController],
  providers: [TravelsPassengersService, TravelsPassengersDBService],
  exports: [TravelsPassengersDBService],
})
export class TravelsPassengersModule { }
