import { Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { AuthenticatedRequest } from '../types';
import { User } from '../database/entities/User';
import { CustomerProfile } from '../database/entities/CustomerProfile';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { updateProfileSchema } from '../utils/validators';

export class CustomerController {
  private userRepository = AppDataSource.getRepository(User);
  private profileRepository = AppDataSource.getRepository(CustomerProfile);

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await this.userRepository.findOne({ where: { id: req.user?.id } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const profile = await this.profileRepository.findOne({ where: { userId: user.id } });

      res.status(200).json({
        success: true,
        data: {
          ...user,
          profile,
        },
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) throw error;

      const user = await this.userRepository.findOne({ where: { id: req.user?.id } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      Object.assign(user, value);
      await this.userRepository.save(user);

      logger.info(`Profile updated for user: ${user.id}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  async getBookingHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const bookingRepository = AppDataSource.getRepository('Booking');
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Query booking history
      const [bookings, total] = await bookingRepository.findAndCount({
        where: { userId: req.user?.id },
        relations: ['room'],
        skip,
        take: parseInt(limit as string),
        order: { createdAt: 'DESC' },
      });

      res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      logger.error('Get booking history error:', error);
      throw error;
    }
  }

  async getSavedRooms(req: AuthenticatedRequest, res: Response) {
    try {
      const profile = await this.profileRepository.findOne({ where: { userId: req.user?.id } });

      if (!profile) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      // Fetch rooms based on savedRoomIds
      const roomRepository = AppDataSource.getRepository('Room');
      const savedRooms = await roomRepository.findByIds(profile.savedRoomIds || []);

      res.status(200).json({
        success: true,
        data: savedRooms,
      });
    } catch (error) {
      logger.error('Get saved rooms error:', error);
      throw error;
    }
  }

  async saveRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;

      let profile = await this.profileRepository.findOne({ where: { userId: req.user?.id } });

      if (!profile) {
        profile = this.profileRepository.create({ userId: req.user?.id, savedRoomIds: [] });
      }

      if (!profile.savedRoomIds) {
        profile.savedRoomIds = [];
      }

      if (!profile.savedRoomIds.includes(roomId)) {
        profile.savedRoomIds.push(roomId);
        await this.profileRepository.save(profile);
      }

      logger.info(`Room saved: ${roomId}`);

      res.status(200).json({
        success: true,
        message: 'Room saved successfully',
      });
    } catch (error) {
      logger.error('Save room error:', error);
      throw error;
    }
  }

  async unsaveRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;

      const profile = await this.profileRepository.findOne({ where: { userId: req.user?.id } });

      if (profile && profile.savedRoomIds) {
        profile.savedRoomIds = profile.savedRoomIds.filter((id) => id !== roomId);
        await this.profileRepository.save(profile);
      }

      logger.info(`Room unsaved: ${roomId}`);

      res.status(200).json({
        success: true,
        message: 'Room unsaved successfully',
      });
    } catch (error) {
      logger.error('Unsave room error:', error);
      throw error;
    }
  }
}
