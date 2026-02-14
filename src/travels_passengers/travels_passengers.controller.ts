import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { TravelsPassengersService } from './travels_passengers.service';
import { CreateTravelsPassengerDto } from './dto/create-travels_passenger.dto';
import { UpdateTravelPassengerStatusDto } from './dto/update-travel-passenger-status.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import type { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';

@Controller('travels-passengers')
export class TravelsPassengersController {
  constructor(
    private readonly travelsPassengersService: TravelsPassengersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTravelsPassengerDto: CreateTravelsPassengerDto) {
    return this.travelsPassengersService.create(createTravelsPassengerDto);
  }

  @Get('passenger/me')
  @UseGuards(AuthGuard)
  getPassengerTravels(@User() { id }: UserTokenInterface) {
    return this.travelsPassengersService.getPassengerTravels(id);
  }

  @Get('booking-requests')
  @UseGuards(AuthGuard)
  getBookingRequests(@User() { id }: UserTokenInterface) {
    return this.travelsPassengersService.getBookingRequests(id);
  }

  @Patch(':travel_id/status')
  @UseGuards(AuthGuard)
  passengerUpdateStatus(
    @Param('travel_id') travel_id: string,
    @User() user: UserTokenInterface,
    @Body() updateTravelPassengerStatusDto: UpdateTravelPassengerStatusDto,
  ) {
    return this.travelsPassengersService.passengerUpdateStatus(
      user,
      travel_id,
      updateTravelPassengerStatusDto,
    );
  }

  @Patch(':travel_id/status/driver')
  @UseGuards(AuthGuard)
  driverUpdateStatus(
    @User() { id: user_id }: UserTokenInterface,
    @Param('travel_id') travel_id: string,
    @Body() updateTravelPassengerStatusDto: UpdateTravelPassengerStatusDto,
  ) {
    return this.travelsPassengersService.driverUpdateStatus(
      user_id,
      travel_id,
      updateTravelPassengerStatusDto,
    );
  }

  @Patch(':id/pay-to-confirm')
  @UseGuards(AuthGuard)
  payToConfirm(
    @User() { id: user_id }: UserTokenInterface,
    @Param('id') travel_passenger_id: string,
  ) {
    return this.travelsPassengersService.payToConfirm(
      user_id,
      travel_passenger_id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removePassengerFromTravel(
    @User() { id: user_id }: UserTokenInterface,
    @Param('id') travel_passenger_id: string,
  ) {
    return this.travelsPassengersService.removePassengerFromTravel(
      user_id,
      travel_passenger_id,
    );
  }
}
