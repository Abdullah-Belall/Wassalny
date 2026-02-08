import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DriverUserEntity } from './driver-user-ext.entity';
import { UserTypeEnum } from '../types/enums/user-type.enum';
import { PassengerUserEntity } from './passenger-user-ext.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => DriverUserEntity, (driver) => driver.user)
  @JoinColumn()
  driver_ext: DriverUserEntity

  @OneToOne(() => PassengerUserEntity, (passenger) => passenger.user)
  @JoinColumn()
  passenger_ext: PassengerUserEntity

  @Column({ type: 'int' })
  index: number;
  @Column({ nullable: true })
  user_name: string
  @Column({ nullable: true })
  avatar: string
  @Column()
  phone: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.PASSENGER })
  type: UserTypeEnum;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
