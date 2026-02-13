import { TravelEntity } from 'src/travels/entities/travel.entity';
import { ReviewTypeEnum } from 'src/types/enums/review-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'int' })
  index: number;
  @ManyToOne(() => TravelEntity, (trav) => trav.reviews)
  travel: TravelEntity;
  @Column()
  review: string;
  @Column({ type: 'int' })
  rate: number;
  @Column({ type: 'enum', enum: ReviewTypeEnum })
  type: ReviewTypeEnum;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
