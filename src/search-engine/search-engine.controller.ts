import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SearchEngineService } from './search-engine.service';
import { CreateSearchEngineDto } from './dto/create-search-engine.dto';
import { UpdateSearchEngineDto } from './dto/update-search-engine.dto';

@Controller('search-engine')
export class SearchEngineController {
  constructor(private readonly searchEngineService: SearchEngineService) {}

  @Post()
  create(@Body() createSearchEngineDto: CreateSearchEngineDto) {
    return this.searchEngineService.create(createSearchEngineDto);
  }

  @Get()
  findAll() {
    return this.searchEngineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.searchEngineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSearchEngineDto: UpdateSearchEngineDto) {
    return this.searchEngineService.update(+id, updateSearchEngineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.searchEngineService.remove(+id);
  }
}
