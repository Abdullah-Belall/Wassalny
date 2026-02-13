import { Module } from '@nestjs/common';
import { SearchEngineService } from './search-engine.service';
import { SearchEngineController } from './search-engine.controller';
import { TravelsModule } from 'src/travels/travels.module';

@Module({
  imports: [TravelsModule],
  controllers: [SearchEngineController],
  providers: [SearchEngineService],
})
export class SearchEngineModule {}
