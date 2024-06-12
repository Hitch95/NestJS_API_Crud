import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  /**
   * Company that make the vehicle
   */
  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  /**
   * Longitude where the vehicle is sold
   */
  @Column()
  lng: number;

  /**
   * Latitude where the vehicle is sold
   */
  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
