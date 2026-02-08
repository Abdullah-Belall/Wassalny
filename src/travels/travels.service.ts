import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsDBService } from './DB_Service/travels_db.service';
import { CarsDBService } from 'src/cars/DB_Service/cars_db.service';
import { TravelStatusEnum } from './types/enums/travel-status.enum';
import { UpdateTravelStatusDto } from './dto/change-travel-status.dto';
import { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';
import { SearchTravelsDto } from './dto/search-travels.dto';
import { Like, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';

@Injectable()
export class TravelsService {
  constructor(
    private readonly travelsDBService: TravelsDBService,
    private readonly carsDBService: CarsDBService,
  ) { }

  async create(createTravelDto: CreateTravelDto) {
    // Check if car exists
    const car = await this.carsDBService.findOne({
      where: { id: createTravelDto.car_id },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const { car_id, ...travelInfo } = createTravelDto;
    // Create travel
    const travel = this.travelsDBService.instance({
      car,
      ...travelInfo,
    });
    await this.travelsDBService.save(travel);

    return {
      done: true
    }
  }

  async findAll() {
    return await this.travelsDBService.find({
      where: {},
      relations: ['car', 'car.driver', 'car.driver.user', 'travel_passengers'],
    });
  }

  async findByDriverUserId(driverUserId: string) {
    return await this.travelsDBService.find({
      where: {
        car: {
          driver: {
            user: { id: driverUserId },
          },
        },
      },
      relations: ['car', 'car.driver', 'travel_passengers'],
      order: { start_time: 'ASC' },
    });
  }

  async search(searchTravelsDto: SearchTravelsDto) {
    const where: any = {};
    if (searchTravelsDto.start_location) {
      where.start_location = Like(`%${searchTravelsDto.start_location}%`);
    }
    if (searchTravelsDto.end_location) {
      where.end_location = Like(`%${searchTravelsDto.end_location}%`);
    }
    if (searchTravelsDto.start_time_from && searchTravelsDto.start_time_to) {
      where.start_time = Between(
        searchTravelsDto.start_time_from,
        searchTravelsDto.start_time_to,
      );
    } else if (searchTravelsDto.start_time_from) {
      where.start_time = MoreThanOrEqual(searchTravelsDto.start_time_from);
    } else if (searchTravelsDto.start_time_to) {
      where.start_time = LessThanOrEqual(searchTravelsDto.start_time_to);
    }
    return await this.travelsDBService.find({
      where,
      relations: ['car', 'travel_passengers'],
      order: { start_time: 'ASC' },
    });
  }

  async findOne(id: string) {
    const travel = await this.travelsDBService.findOne({
      where: { id },
      relations: ['car', 'travel_passengers'],
    });
    if (!travel) {
      throw new NotFoundException('Travel not found');
    }
    return travel;
  }

  async update(user_id: string, travel_id: string, updateTravelDto: UpdateTravelDto) {
    const travel = await this.travelsDBService.findOne({
      where: {
        id: travel_id, car: {
          driver: {
            user: {
              id: user_id
            }
          }
        }
      },
    });
    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    if (travel.status !== TravelStatusEnum.PENDING) {
      throw new BadRequestException(`Can't update trip with status "${travel.status}"`)
    }

    if (new Date().getTime() > (new Date(travel.created_at).getTime() + 30 * 60 * 1000)) {
      throw new BadRequestException(`update not allowed after 30min from creation`)
    }

    // Update travel fields
    const updateData: any = {};
    if (updateTravelDto.details) updateData.details = updateTravelDto.details;
    if (updateTravelDto.start_time) updateData.start_time = updateTravelDto.start_time;
    if (updateTravelDto.start_location) updateData.start_location = updateTravelDto.start_location;
    if (updateTravelDto.end_location) updateData.end_location = updateTravelDto.end_location;
    if (updateTravelDto.duration_by_minutes) updateData.duration_by_minutes = Number(updateTravelDto.duration_by_minutes);
    if (updateTravelDto.available_seats) updateData.available_seats = Number(updateTravelDto.available_seats);
    if (updateTravelDto.price_per_seat) updateData.price_per_seat = Number(updateTravelDto.price_per_seat);

    Object.assign(travel, updateData);
    await this.travelsDBService.save(travel);

    return {
      done: true
    }
  }

  async updateStatus(user_id: string, travel_id: string, { status }: UpdateTravelStatusDto) {
    const travel = await this.travelsDBService.findOne({
      where: {
        id: travel_id,
        car: {
          driver: {
            user: {
              id: user_id
            }
          }
        }
      },
      relations: ['travel_passengers'],
      select: {
        travel_passengers: {
          id: true,
          status: true
        }
      }
    })
    if (!travel)
      throw new NotFoundException('Trip not found')
    if (status === TravelStatusEnum.CANCELLED) {
      await this.travelsDBService.save({ ...travel, status })
      return {
        done: true
      }
    }
    if (travel.travel_passengers.every((e) => e.status === status as any)) {
      throw new ConflictException(`Can't update status if passenger did't updated`)
    }
    await this.travelsDBService.save({ ...travel, status })
    return {
      done: true
    }
  }
}
