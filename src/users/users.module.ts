import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersDBService } from './DB_Service/users_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersDBService],
  exports: [UsersDBService],
})
export class UsersModule {}
