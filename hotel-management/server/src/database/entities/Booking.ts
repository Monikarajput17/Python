import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Room } from './Room';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  roomId!: string;

  @Column()
  bookingReference!: string;

  @Column('date')
  checkInDate!: Date;

  @Column('date')
  checkOutDate!: Date;

  @Column()
  numberOfGuests!: number;

  @Column()
  numberOfNights!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'], default: 'pending' })
  status!: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

  @Column({ nullable: true, type: 'text' })
  specialRequests?: string;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  refundAmount?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'roomId' })
  room?: Room;
}
