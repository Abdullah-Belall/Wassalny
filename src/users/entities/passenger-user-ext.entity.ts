import {
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TravelsPassengerEntity } from 'src/travels_passengers/entities/travels_passenger.entity';

@Entity({ name: 'passengers_users' })
export class PassengerUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.passenger_ext)
  user: UserEntity

  @OneToMany(() => TravelsPassengerEntity, (trav) => trav.passenger)
  passenger_travels: TravelsPassengerEntity[]

}
