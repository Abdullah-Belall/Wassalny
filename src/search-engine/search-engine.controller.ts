import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SearchEngineService } from './search-engine.service';
import { CreateSearchEngineDto } from './dto/create-search-engine.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import type { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';

@Controller('search-engine')
export class SearchEngineController {
  constructor(private readonly searchEngineService: SearchEngineService) {}

  @Post()
  @UseGuards(AuthGuard)
  async searchEngine(
    @Body()
    {
      entity,
      query,
      add_select,
      order_by_column,
      order_by_order,
    }: CreateSearchEngineDto,
  ) {
    return await this.searchEngineService.searchEngine(
      entity,
      query,
      add_select,
      {
        column: order_by_column,
        order: order_by_order,
      },
    );
  }
}
