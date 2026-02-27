import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CarEntity } from 'src/cars/entities/car.entity';
import { ImageEntity } from 'src/images/entities/image.entity';

@Entity({ name: 'drivers_users' })
export class DriverUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.driver_ext)
  user: UserEntity;

  @OneToMany(() => CarEntity, (car) => car.driver)
  cars: CarEntity[];

  @Column({ nullable: true })
  driving_license: string;
}
