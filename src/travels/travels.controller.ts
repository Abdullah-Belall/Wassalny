import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { User } from 'src/users/decorators/user.decorator';
import type { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';
import { UpdateTravelStatusDto } from './dto/change-travel-status.dto';
import { SearchTravelsDto } from './dto/search-travels.dto';

@Controller('travels')
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) { }

  @Post()
  create(@Body() createTravelDto: CreateTravelDto) {
    return this.travelsService.create(createTravelDto);
  }

  @Get()
  findAll() {
    return this.travelsService.findAll();
  }

  @Get('search')
  search(@Query() searchTravelsDto: SearchTravelsDto) {
    return this.travelsService.search(searchTravelsDto);
  }

  @Get('driver/:driverUserId')
  findByDriver(@Param('driverUserId') driverUserId: string) {
    return this.travelsService.findByDriverUserId(driverUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelsService.findOne(id);
  }

  @Patch(':id')
  update(
    @User() { id }: UserTokenInterface,
    @Param('id') travel_id: string,
    @Body() updateTravelDto: UpdateTravelDto,
  ) {
    return this.travelsService.update(id, travel_id, updateTravelDto);
  }

  @Patch(':id/status')
  updateStatus(
    @User() { id }: UserTokenInterface,
    @Param('id') travel_id: string,
    @Body() updateTravelStatusDto: UpdateTravelStatusDto,
  ) {
    return this.travelsService.updateStatus(
      id,
      travel_id,
      updateTravelStatusDto,
    );
  }
}
