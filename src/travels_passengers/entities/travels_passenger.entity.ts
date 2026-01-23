import { TravelEntity } from "src/travels/entities/travel.entity";
import { PassengerUserEntity } from "src/users/entities/passenger-user-ext.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TravelPassengerStatusEnum } from "../types/enums/travel-passenger-status.enum";

@Entity({ name: 'travels_passengers' })
export class TravelsPassengerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TravelEntity, (trav) => trav.travel_passengers)
  travel: TravelEntity;

  @ManyToOne(() => PassengerUserEntity, (passenger) => passenger.passenger_travels)
  passenger: PassengerUserEntity;

  @Column({ type: 'enum', enum: TravelPassengerStatusEnum, default: TravelPassengerStatusEnum.PENDING })
  status: TravelPassengerStatusEnum
  @Column({ type: 'decimal' })
  total_price: number;
  @Column({ type: 'decimal' })
  deposit: number;
  @Column({ type: 'timestamptz' })
  start_time: string;
  @Column()
  start_location: string;
  @Column()
  end_location: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
