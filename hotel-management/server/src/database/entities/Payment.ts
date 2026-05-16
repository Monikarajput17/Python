import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Booking } from './Booking';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  bookingId!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column()
  currency!: string;

  @Column({ type: 'enum', enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' })
  status!: 'pending' | 'success' | 'failed' | 'refunded';

  @Column({ type: 'enum', enum: ['razorpay', 'stripe', 'upi', 'card'] })
  method!: 'razorpay' | 'stripe' | 'upi' | 'card';

  @Column()
  transactionId!: string;

  @Column({ nullable: true, type: 'jsonb' })
  paymentDetails?: Record<string, any>;

  @Column({ nullable: true })
  invoiceUrl?: string;

  @Column({ nullable: true, type: 'text' })
  failureReason?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking?: Booking;
}
