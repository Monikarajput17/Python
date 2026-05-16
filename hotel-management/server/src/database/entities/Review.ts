import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Room } from './Room';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  roomId!: string;

  @Column({ type: 'integer', default: 5 })
  rating!: number;

  @Column('text')
  comment!: string;

  @Column({ default: false })
  isVerifiedBooking!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Room, (room) => room.reviews)
  @JoinColumn({ name: 'roomId' })
  room?: Room;
}
