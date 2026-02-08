import { CarEntity } from "src/cars/entities/car.entity";
import { TravelsPassengerEntity } from "src/travels_passengers/entities/travels_passenger.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TravelStatusEnum } from "../types/enums/travel-status.enum";
import { ReviewEntity } from "src/reviews/entities/review.entity";

@Entity({ name: 'travels' })
export class TravelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CarEntity, (car) => car.travels)
  car: CarEntity;
  
  @OneToMany(() => ReviewEntity, (review) => review.travel)
  reviews: ReviewEntity[];
  
  @OneToMany(() => TravelsPassengerEntity, (trav) => trav.travel)
  travel_passengers: TravelsPassengerEntity[];

  @Column({ type: 'enum', enum: TravelStatusEnum, default: TravelStatusEnum.PENDING })
  status: TravelStatusEnum
  @Column({ nullable: true })
  details: string;
  @Column({ type: 'timestamptz' })
  start_time: string;
  @Column()
  start_location: string;
  @Column()
  end_location: string;
  @Column({ type: 'decimal' })
  duration_by_minutes: number;
  @Column({ type: 'int' })
  available_seats: number;
  @Column({ type: 'decimal' })
  price_per_seat: number;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
