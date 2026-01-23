import { CarEntity } from "src/cars/entities/car.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'images' })
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => CarEntity, (car)=> car.images)
  car: CarEntity

  @Column()
  image_url: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
