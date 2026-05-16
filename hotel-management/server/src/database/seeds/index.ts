// Seed database with initial data for development
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Room } from '../entities/Room';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Seed Admin User
    const adminRepository = AppDataSource.getRepository(User);
    const adminExists = await adminRepository.findOne({ where: { email: 'admin@hotelmanagement.com' } });

    if (!adminExists) {
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const admin = adminRepository.create({
        email: 'admin@hotelmanagement.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isEmailVerified: true,
      });
      await adminRepository.save(admin);
      console.log('✓ Admin user created');
    }

    // Seed Sample Rooms
    const roomRepository = AppDataSource.getRepository(Room);
    const roomCount = await roomRepository.count();

    if (roomCount === 0) {
      const rooms = [
        {
          name: 'Deluxe Room',
          description: 'Spacious room with ocean view and modern amenities',
          category: 'deluxe',
          capacity: 2,
          pricePerNight: 250,
          amenities: ['WiFi', 'AC', 'TV', 'Balcony', 'Mini Bar'],
          isAvailable: true,
        },
        {
          name: 'Luxury Suite',
          description: 'Premium suite with jacuzzi and panoramic view',
          category: 'luxury',
          capacity: 3,
          pricePerNight: 450,
          amenities: ['WiFi', 'AC', 'TV', 'Jacuzzi', 'Mini Bar', 'Sauna'],
          isAvailable: true,
        },
        {
          name: 'Standard Room',
          description: 'Comfortable room with all basic amenities',
          category: 'standard',
          capacity: 2,
          pricePerNight: 150,
          amenities: ['WiFi', 'AC', 'TV'],
          isAvailable: true,
        },
      ];

      for (const roomData of rooms) {
        const room = roomRepository.create(roomData as any);
        await roomRepository.save(room);
      }
      console.log('✓ Sample rooms created');
    }

    console.log('✓ Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
