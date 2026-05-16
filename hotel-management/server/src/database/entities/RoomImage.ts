import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './Room';

@Entity('room_images')
export class RoomImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  roomId!: string;

  @Column()
  url!: string;

  @Column({ type: 'enum', enum: ['3d', '2d', '3d-360'], default: '3d' })
  type!: '3d' | '2d' | '3d-360';

  @Column()
  alt!: string;

  @Column({ default: 0 })
  order!: number;

  @CreateDateColumn()
  uploadedAt!: Date;

  @ManyToOne(() => Room, (room) => room.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room?: Room;
}
