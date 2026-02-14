import { ImageEntity } from 'src/images/entities/image.entity';
import { TravelEntity } from 'src/travels/entities/travel.entity';
import { DriverUserEntity } from 'src/users/entities/driver-user-ext.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cars' })
export class CarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ImageEntity, (image) => image.car)
  images: ImageEntity[];

  @OneToMany(() => TravelEntity, (trav) => trav.car)
  travels: TravelEntity[];

  @ManyToOne(() => DriverUserEntity, (driv) => driv.cars)
  driver: DriverUserEntity;

  @Column({ type: 'int' })
  seats_count: number;
  @Column()
  car_type: string;
  @Column()
  color: string;
  @Column()
  licence: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
