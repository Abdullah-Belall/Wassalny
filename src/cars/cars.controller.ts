import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { User } from 'src/users/decorators/user.decorator';
import type { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('cars')
@UseGuards(AuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Post()
  async create(
    @User() {id} : UserTokenInterface,
    @Body() createCarDto: CreateCarDto) {
    return await this.carsService.create({...createCarDto, driver_id: id});
  }

  @Get()
  async findAll() {
    return await this.carsService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.carsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto) {
    return await this.carsService.update(id, updateCarDto);
  }
}
