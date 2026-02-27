import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { ImagesModule } from './images/images.module';
import { TravelsModule } from './travels/travels.module';
import { TravelsPassengersModule } from './travels_passengers/travels_passengers.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchEngineModule } from './search-engine/search-engine.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        migrations: [__dirname + '/migrations/*.{js,ts}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CarsModule,
    ImagesModule,
    TravelsModule,
    TravelsPassengersModule,
    ReviewsModule,
    SearchEngineModule,
    SmsModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
