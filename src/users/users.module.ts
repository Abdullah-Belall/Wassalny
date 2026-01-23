import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersDBService } from './DB_Service/users_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { DriverUserEntity } from './entities/driver-user-ext.entity';
import { DriverUserExtDBService } from './DB_Service/driver-user-ext_db.service';
import { PassengerUserEntity } from './entities/passenger-user-ext.entity';
import { PassengerUserExtDBService } from './DB_Service/passenger-user-ext_db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DriverUserEntity, PassengerUserEntity]),
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersDBService, DriverUserExtDBService, PassengerUserExtDBService],
  exports: [UsersDBService, DriverUserExtDBService, PassengerUserExtDBService],
})
export class UsersModule {}
