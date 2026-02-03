import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarsDBService } from './DB_Service/cars_db.service';
import { ImagesDBService } from 'src/images/DB_Service/images_db.service';
import { DriverUserExtDBService } from 'src/users/DB_Service/driver-user-ext_db.service';

@Injectable()
export class CarsService {
  constructor(
    private readonly carsDBService: CarsDBService,
    private readonly imagesDBService: ImagesDBService,
    private readonly driverUserExtDBService: DriverUserExtDBService,
  ) { }

  async create(createCarDto: CreateCarDto) {
    // Check if driver exists
    const driver = await this.findByUserId(createCarDto.driver_id);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Parse images JSON
    let imageUrls: string[] = [];
    try {
      imageUrls = JSON.parse(createCarDto.images_json);
      if (!Array.isArray(imageUrls)) {
        throw new BadRequestException('images_json must be a JSON array');
      }
    } catch (err) {
      throw new BadRequestException('Invalid images_json format');
    }

    const { driver_id, images_json, ...carInfo } = createCarDto
    // Create car
    const car = this.carsDBService.instance({
      driver,
      ...carInfo
    });
    const savedCar = await this.carsDBService.save(car);

    // Create images
    if (imageUrls.length > 0) {
      const images = imageUrls.map((url) =>
        this.imagesDBService.instance({
          car: savedCar,
          image_url: url,
        }),
      );
      await Promise.all(images.map((img) => this.imagesDBService.save(img)));
    }

    return await this.carsDBService.findOne({
      where: { id: savedCar.id },
      relations: ['images', 'driver'],
    });
  }

  async findAll() {
    const { cars, total } = await this.carsDBService.find({
      where: {},
      relations: ['images', 'driver'],
    });
    return { cars, total };
  }

  async findByUserId(userId: string) {
    const driver = await this.driverUserExtDBService.findOne({
      where: { user: { id: userId } },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found for this user');
    }
    const { cars, total } = await this.carsDBService.find({
      where: { driver: { id: driver.id } },
      relations: ['images', 'driver'],
    });
    return { cars, total };
  }

  async findOne(id: string) {
    const car = await this.carsDBService.findOne({
      where: { id },
      relations: ['images', 'driver'],
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.carsDBService.findOne({
      where: { id },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // If driver_id is being updated, check if driver exists
    if (updateCarDto.driver_id) {
      const driver = await this.driverUserExtDBService.findOne({
        where: { id: updateCarDto.driver_id },
      });
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }
    }

    // If images_json is being updated, handle images
    if (updateCarDto.images_json) {
      let imageUrls: string[] = [];
      try {
        imageUrls = JSON.parse(updateCarDto.images_json);
        if (!Array.isArray(imageUrls)) {
          throw new BadRequestException('images_json must be a JSON array');
        }
      } catch (err) {
        throw new BadRequestException('Invalid images_json format');
      }

      // Delete existing images
      const existingCar = await this.carsDBService.findOne({
        where: { id },
        relations: ['images'],
      });
      if (existingCar?.images && existingCar.images.length > 0) {
        await Promise.all(
          existingCar.images.map((img) =>
            this.imagesDBService.repo().remove(img),
          ),
        );
      }

      // Create new images
      if (imageUrls.length > 0) {
        const images = imageUrls.map((url) =>
          this.imagesDBService.instance({
            car: { id } as any,
            image_url: url,
          }),
        );
        await Promise.all(images.map((img) => this.imagesDBService.save(img)));
      }
    }

    // Update car fields
    const updateData: any = {};
    if (updateCarDto.seats_count) updateData.seats_count = Number(updateCarDto.seats_count);
    if (updateCarDto.car_type) updateData.car_type = updateCarDto.car_type;
    if (updateCarDto.color) updateData.color = updateCarDto.color;
    if (updateCarDto.licence) updateData.licence = updateCarDto.licence;
    if (updateCarDto.driver_id) {
      updateData.driver = { id: updateCarDto.driver_id } as any;
    }

    Object.assign(car, updateData);
    const updatedCar = await this.carsDBService.save(car);

    return await this.carsDBService.findOne({
      where: { id: updatedCar.id },
      relations: ['images', 'driver'],
    });
  }
}
