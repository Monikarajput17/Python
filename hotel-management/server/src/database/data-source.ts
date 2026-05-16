import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Room } from './entities/Room';
import { RoomImage } from './entities/RoomImage';
import { Booking } from './entities/Booking';
import { Payment } from './entities/Payment';
import { Review } from './entities/Review';
import { CustomerProfile } from './entities/CustomerProfile';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hotel_management',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Room, RoomImage, Booking, Payment, Review, CustomerProfile],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
