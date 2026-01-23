import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImagesDBService } from './DB_Service/images_db.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesDBService],
  exports: [ImagesDBService],
})
export class ImagesModule {}
