import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTravelsPassengerDto } from './dto/create-travels_passenger.dto';
import { TravelsPassengersDBService } from './DB_Service/travels_passengers_db.service';
import { TravelsDBService } from 'src/travels/DB_Service/travels_db.service';
import { UpdateTravelPassengerStatusDto } from './dto/update-travel-passenger-status.dto';
import { TravelPassengerStatusEnum } from './types/enums/travel-passenger-status.enum';
import { TravelStatusEnum } from 'src/travels/types/enums/travel-status.enum';
import { PassengerUserExtDBService } from 'src/users/DB_Service/passenger-user-ext_db.service';
import { DriverUserExtDBService } from 'src/users/DB_Service/driver-user-ext_db.service';
import { UsersDBService } from 'src/users/DB_Service/users_db.service';
import { UserTypeEnum } from 'src/users/types/enums/user-type.enum';
import { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';

@Injectable()
export class TravelsPassengersService {
  constructor(
    private readonly travelsPassengersDBService: TravelsPassengersDBService,
    private readonly travelsDBService: TravelsDBService,
    private readonly passengerUserExtDBService: PassengerUserExtDBService,
    private readonly usersDBService: UsersDBService,
    private readonly driverUserExtDBService: DriverUserExtDBService,
  ) {}

  async create(createTravelsPassengerDto: CreateTravelsPassengerDto) {
    // Check if travel exists
    const travel = await this.travelsDBService.findOne({
      where: { id: createTravelsPassengerDto.travel_id },
      select: {
        travel_passengers: {
          id: true,
          status: true,
        },
      },
    });
    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    if (
      ![TravelStatusEnum.BOOKING, TravelStatusEnum.PENDING].includes(
        travel.status,
      )
    ) {
      throw new BadRequestException(
        `Can't book trip with status "${travel.status}"`,
      );
    }

    // Check if passenger exists
    const user = await this.usersDBService.findOne({
      where: {
        id: createTravelsPassengerDto.passenger_id,
      },
      relations: ['passenger_ext'],
    });
    if (!user || user.type !== UserTypeEnum.PASSENGER) {
      throw new NotFoundException('Passenger not found');
    }
    if (!user.passenger_ext)
      user.passenger_ext = await this.passengerUserExtDBService.save(
        this.passengerUserExtDBService.instance({
          user,
        }),
      );

    // Calculate total_price from travel price_per_seat
    const total_price = Number(travel.price_per_seat);

    // Create travel passenger with data from travel
    const travelPassenger = this.travelsPassengersDBService.instance({
      travel,
      passenger: user.passenger_ext,
      deposit: createTravelsPassengerDto.deposit,
      total_price,
      start_time: travel.start_time,
      start_location: travel.start_location,
      end_location: travel.end_location,
      status: TravelPassengerStatusEnum.PENDING,
    });

    if (travel.status === TravelStatusEnum.PENDING) {
      await this.travelsDBService.save({
        ...travel,
        status: TravelStatusEnum.BOOKING,
      });
    }

    await this.travelsPassengersDBService.save(travelPassenger);

    return {
      done: true,
    };
  }

  async passengerUpdateStatus(
    { id, type }: UserTokenInterface,
    travel_id: string,
    updateTravelPassengerStatusDto: UpdateTravelPassengerStatusDto,
  ) {
    if (type !== UserTypeEnum.PASSENGER)
      throw new BadRequestException(`Your are not a passenger user.`);
    const { status } = updateTravelPassengerStatusDto;

    const travelPassenger = await this.travelsPassengersDBService.findOne({
      where: {
        passenger: {
          user: {
            id,
          },
        },
        travel: {
          id: travel_id,
        },
      },
      relations: ['travel'],
    });

    if (!travelPassenger) {
      throw new NotFoundException('Travel passenger not found');
    }

    // Validate: Cannot change to PENDING, PAID, DRIVER_ACCEPT, DRIVER_REJECT
    const forbiddenStatuses = [
      TravelPassengerStatusEnum.PENDING,
      TravelPassengerStatusEnum.PAID,
      TravelPassengerStatusEnum.DRIVER_ACCEPT,
      TravelPassengerStatusEnum.DRIVER_REJECT,
    ];

    if (forbiddenStatuses.includes(status)) {
      throw new BadRequestException(
        `Cannot change status to "${status}". This status can only be set by the system.`,
      );
    }

    if (
      travelPassenger.status !== TravelPassengerStatusEnum.PENDING &&
      status === TravelPassengerStatusEnum.CANCELLED_AFTER_PAID
    ) {
      throw new BadRequestException(
        `You did't paid to update status to "${status}"`,
      );
    }

    // Validate: If changing to STARTED, IN_PROGRESS, ACCIDENT, MALFUNCTION, or FINISHED, must have current status as PAID
    const statusesRequiringPaid = [
      TravelPassengerStatusEnum.STARTED,
      TravelPassengerStatusEnum.IN_PROGRESS,
      TravelPassengerStatusEnum.ACCIDENT,
      TravelPassengerStatusEnum.MALFUNCTION,
      TravelPassengerStatusEnum.FINISHED,
      TravelPassengerStatusEnum.CANCELLED_AFTER_PAID,
    ];

    if (statusesRequiringPaid.includes(status)) {
      if (travelPassenger.status !== TravelPassengerStatusEnum.PAID) {
        throw new BadRequestException(
          `Cannot change status to "${status}". Current status must be "Paid".`,
        );
      }
    }

    const now = new Date();
    const travelStartTime = new Date(travelPassenger.travel.start_time);

    // Validate: If changing to STARTED, must be at least 10 minutes before travel start_time
    if (status === TravelPassengerStatusEnum.STARTED) {
      const tenMinutesBeforeTravel = new Date(
        travelStartTime.getTime() - 10 * 60 * 1000,
      );
      if (now >= tenMinutesBeforeTravel) {
        throw new BadRequestException(
          'Cannot change status to "Started". Must be at least 10 minutes before travel start time.',
        );
      }
    }

    // Validate: If changing to IN_PROGRESS, ACCIDENT, MALFUNCTION, or FINISHED, must be after travel start_time
    const afterTravelStatuses = [
      TravelPassengerStatusEnum.IN_PROGRESS,
      TravelPassengerStatusEnum.ACCIDENT,
      TravelPassengerStatusEnum.MALFUNCTION,
      TravelPassengerStatusEnum.FINISHED,
    ];

    if (afterTravelStatuses.includes(status)) {
      if (now < travelStartTime) {
        throw new BadRequestException(
          `Cannot change status to "${status}". Travel must have started first.`,
        );
      }
    }

    // Update status
    travelPassenger.status = status;
    await this.travelsPassengersDBService.save(travelPassenger);

    return {
      done: true,
    };
  }

  async driverUpdateStatus(
    user_id: string,
    travel_id: string,
    updateTravelPassengerStatusDto: UpdateTravelPassengerStatusDto,
  ) {
    const { status } = updateTravelPassengerStatusDto;

    // Validate: Only DRIVER_ACCEPT and DRIVER_REJECT are allowed
    if (
      status !== TravelPassengerStatusEnum.DRIVER_ACCEPT &&
      status !== TravelPassengerStatusEnum.DRIVER_REJECT
    ) {
      throw new BadRequestException(
        `Driver can only change status to "Driver Accept" or "Driver Reject".`,
      );
    }

    // Find travel passenger with travel and car relations
    const travelPassenger = await this.travelsPassengersDBService.findOne({
      where: {
        travel: {
          id: travel_id,
        },
      },
      relations: [
        'travel',
        'travel.car',
        'travel.car.driver',
        'travel.car.driver.user',
      ],
    });

    if (!travelPassenger) {
      throw new NotFoundException('Travel passenger not found');
    }

    // Validate: Current status must be PENDING
    if (travelPassenger.status !== TravelPassengerStatusEnum.PENDING) {
      throw new BadRequestException(
        `Cannot change status. Current status must be "Pending".`,
      );
    }

    // Validate: Driver owns the travel (through car)
    if (travelPassenger.travel.car.driver.user.id !== user_id) {
      throw new UnauthorizedException(
        'You are not authorized to update this travel passenger status.',
      );
    }

    // Update status
    travelPassenger.status = status;
    await this.travelsPassengersDBService.save(travelPassenger);

    return {
      done: true,
    };
  }

  async payToConfirm(user_id: string, travel_passenger_id: string) {
    // Find travel passenger with passenger relation
    const travelPassenger = await this.travelsPassengersDBService.findOne({
      where: { id: travel_passenger_id },
      relations: ['passenger', 'passenger.user', 'travel'],
    });

    if (!travelPassenger) {
      throw new NotFoundException('Travel passenger not found');
    }

    // Validate: Passenger owns this travel passenger
    if (travelPassenger.passenger.user.id !== user_id) {
      throw new UnauthorizedException(
        'You are not authorized to pay for this travel passenger.',
      );
    }

    // Validate: Current status must be DRIVER_ACCEPT
    if (travelPassenger.status !== TravelPassengerStatusEnum.DRIVER_ACCEPT) {
      throw new BadRequestException(
        `Cannot pay. Current status must be "${TravelPassengerStatusEnum.DRIVER_ACCEPT}".`,
      );
    }

    if (travelPassenger.travel.status !== TravelStatusEnum.BOOKING) {
      throw new BadRequestException(
        `Cannot pay. Current trip status must be "${TravelStatusEnum.BOOKING}".`,
      );
    }

    // Update status to PAID
    travelPassenger.status = TravelPassengerStatusEnum.PAID;
    const travelPassengersLength = await this.travelsPassengersDBService
      .repo()
      .count({
        where: {
          travel: {
            id: travelPassenger.travel.id,
          },
          status: TravelPassengerStatusEnum.PAID,
        },
      });
    if (
      Number(travelPassenger.travel.available_seats) ===
      Number(travelPassengersLength) + 1
    ) {
      await this.travelsDBService.save({
        ...travelPassenger.travel,
        status: TravelStatusEnum.FULLY_BOOKED,
      });
    }
    await this.travelsPassengersDBService.save(travelPassenger);

    return {
      done: true,
    };
  }

  async getPassengerTravels(userId: string) {
    const { travelsPassengers, total } =
      await this.travelsPassengersDBService.find({
        where: {
          passenger: {
            user: {
              id: userId,
            },
          },
        },
        relations: [
          'travel.car',
          'travel.car.driver',
          'travel.car.driver.user',
          'travel.car.images',
          'passenger',
          'passenger.user',
        ],
        order: { start_time: 'ASC' },
      });
    return { travelsPassengers, total };
  }

  async getBookingRequests(userId: string) {
    const driver = await this.driverUserExtDBService.findOne({
      where: { user: { id: userId } },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found for this user');
    }
    const { travelsPassengers, total } =
      await this.travelsPassengersDBService.find({
        where: {
          status: TravelPassengerStatusEnum.PENDING,
          travel: {
            car: {
              driver: { id: driver.id },
            },
          },
        },
        relations: ['travel', 'travel.car', 'passenger', 'passenger.user'],
        order: { created_at: 'DESC' },
      });
    return { travelsPassengers, total };
  }

  async removePassengerFromTravel(userId: string, travelPassengerId: string) {
    const travelPassenger = await this.travelsPassengersDBService.findOne({
      where: { id: travelPassengerId },
      relations: [
        'travel',
        'travel.car',
        'travel.car.driver',
        'travel.car.driver.user',
      ],
    });
    if (!travelPassenger) {
      throw new NotFoundException('Travel passenger not found');
    }
    if (travelPassenger.travel.car.driver.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to remove passengers from this travel.',
      );
    }
    if (travelPassenger.status !== TravelPassengerStatusEnum.PENDING) {
      throw new BadRequestException(
        'Can only remove passengers with PENDING status.',
      );
    }
    travelPassenger.status = TravelPassengerStatusEnum.DRIVER_REJECT;
    await this.travelsPassengersDBService.save(travelPassenger);
    return { done: true };
  }
}
