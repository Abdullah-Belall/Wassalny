import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverUserExtDBService } from './DB_Service/driver-user-ext_db.service';
import { PassengerUserExtDBService } from './DB_Service/passenger-user-ext_db.service';
import { UsersDBService } from './DB_Service/users_db.service';
import { DriverUserEntity } from './entities/driver-user-ext.entity';
import { PassengerUserEntity } from './entities/passenger-user-ext.entity';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DriverUserEntity, PassengerUserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersDBService, DriverUserExtDBService, PassengerUserExtDBService],
  exports: [UsersDBService, DriverUserExtDBService, PassengerUserExtDBService],
})
export class UsersModule { }
