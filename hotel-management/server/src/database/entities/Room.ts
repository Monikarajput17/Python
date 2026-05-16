import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RoomImage } from './RoomImage';
import { Booking } from './Booking';
import { Review } from './Review';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'enum', enum: ['economy', 'standard', 'deluxe', 'luxury', 'suite'] })
  category!: 'economy' | 'standard' | 'deluxe' | 'luxury' | 'suite';

  @Column()
  capacity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight!: number;

  @Column('simple-array')
  amenities!: string[];

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ default: 0, type: 'float' })
  averageRating!: number;

  @Column({ default: 0 })
  totalReviews!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => RoomImage, (image) => image.room, { cascade: true })
  images?: RoomImage[];

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings?: Booking[];

  @OneToMany(() => Review, (review) => review.room)
  reviews?: Review[];
}
