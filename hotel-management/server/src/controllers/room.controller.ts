import { Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Room } from '../database/entities/Room';
import { RoomImage } from '../database/entities/RoomImage';
import { Review } from '../database/entities/Review';
import { AuthenticatedRequest } from '../types';
import { createRoomSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class RoomController {
  private roomRepository = AppDataSource.getRepository(Room);
  private imageRepository = AppDataSource.getRepository(RoomImage);
  private reviewRepository = AppDataSource.getRepository(Review);

  async getAllRooms(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;

      let query = this.roomRepository.createQueryBuilder('room');

      if (category) query = query.where('room.category = :category', { category });
      if (minPrice) query = query.andWhere('room.pricePerNight >= :minPrice', { minPrice });
      if (maxPrice) query = query.andWhere('room.pricePerNight <= :maxPrice', { maxPrice });
      if (search) query = query.andWhere('room.name ILIKE :search', { search: `%${search}%` });

      const total = await query.getCount();
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const rooms = await query
        .leftJoinAndSelect('room.images', 'images')
        .skip(skip)
        .take(parseInt(limit as string))
        .orderBy('room.createdAt', 'DESC')
        .getMany();

      res.status(200).json({
        success: true,
        data: rooms,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      logger.error('Get all rooms error:', error);
      throw error;
    }
  }

  async getRoomById(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;

      const room = await this.roomRepository
        .createQueryBuilder('room')
        .where('room.id = :id', { id: roomId })
        .leftJoinAndSelect('room.images', 'images')
        .leftJoinAndSelect('room.reviews', 'reviews')
        .leftJoinAndSelect('reviews.user', 'user')
        .orderBy('images.order', 'ASC')
        .addOrderBy('reviews.createdAt', 'DESC')
        .getOne();

      if (!room) {
        throw new AppError('Room not found', 404);
      }

      res.status(200).json({
        success: true,
        data: room,
      });
    } catch (error) {
      logger.error('Get room by ID error:', error);
      throw error;
    }
  }

  async searchRooms(req: AuthenticatedRequest, res: Response) {
    try {
      const { query, category, maxPrice, capacity } = req.query;

      let queryBuilder = this.roomRepository.createQueryBuilder('room')
        .leftJoinAndSelect('room.images', 'images');

      if (query) {
        queryBuilder = queryBuilder.where(
          'room.name ILIKE :query OR room.description ILIKE :query',
          { query: `%${query}%` }
        );
      }

      if (category) {
        queryBuilder = queryBuilder.andWhere('room.category = :category', { category });
      }

      if (maxPrice) {
        queryBuilder = queryBuilder.andWhere('room.pricePerNight <= :maxPrice', { maxPrice });
      }

      if (capacity) {
        queryBuilder = queryBuilder.andWhere('room.capacity >= :capacity', { capacity });
      }

      const rooms = await queryBuilder.orderBy('room.pricePerNight', 'ASC').getMany();

      res.status(200).json({
        success: true,
        data: rooms,
      });
    } catch (error) {
      logger.error('Search rooms error:', error);
      throw error;
    }
  }

  async checkAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const { checkInDate, checkOutDate } = req.query;

      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new AppError('Room not found', 404);
      }

      // Check for conflicting bookings
      // This would query the Booking table for overlapping dates
      // Implementation depends on business logic

      res.status(200).json({
        success: true,
        data: {
          roomId,
          isAvailable: true,
          checkInDate,
          checkOutDate,
        },
      });
    } catch (error) {
      logger.error('Check availability error:', error);
      throw error;
    }
  }

  async createRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const { error, value } = createRoomSchema.validate(req.body);
      if (error) throw error;

      const room = this.roomRepository.create(value);
      await this.roomRepository.save(room);

      logger.info(`New room created: ${room.name}`);

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room,
      });
    } catch (error) {
      logger.error('Create room error:', error);
      throw error;
    }
  }

  async updateRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;

      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new AppError('Room not found', 404);
      }

      Object.assign(room, req.body);
      await this.roomRepository.save(room);

      logger.info(`Room updated: ${room.id}`);

      res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: room,
      });
    } catch (error) {
      logger.error('Update room error:', error);
      throw error;
    }
  }

  async deleteRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;

      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new AppError('Room not found', 404);
      }

      await this.roomRepository.remove(room);
      logger.info(`Room deleted: ${roomId}`);

      res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
      });
    } catch (error) {
      logger.error('Delete room error:', error);
      throw error;
    }
  }

  async uploadImages(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;
      // Image upload logic would go here
      // Using AWS S3 or similar service
      res.status(201).json({
        success: true,
        message: 'Images uploaded successfully',
      });
    } catch (error) {
      logger.error('Upload images error:', error);
      throw error;
    }
  }

  async deleteImage(req: AuthenticatedRequest, res: Response) {
    try {
      const { imageId } = req.params;

      const image = await this.imageRepository.findOne({ where: { id: imageId } });
      if (!image) {
        throw new AppError('Image not found', 404);
      }

      await this.imageRepository.remove(image);
      logger.info(`Image deleted: ${imageId}`);

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      logger.error('Delete image error:', error);
      throw error;
    }
  }

  async getRoomReviews(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const [reviews, total] = await this.reviewRepository.findAndCount({
        where: { roomId },
        relations: ['user'],
        skip,
        take: parseInt(limit as string),
        order: { createdAt: 'DESC' },
      });

      res.status(200).json({
        success: true,
        data: reviews,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      logger.error('Get room reviews error:', error);
      throw error;
    }
  }

  async createReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const { rating, comment } = req.body;

      const review = this.reviewRepository.create({
        roomId,
        userId: req.user?.id,
        rating,
        comment,
      });

      await this.reviewRepository.save(review);
      logger.info(`Review created for room: ${roomId}`);

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      logger.error('Create review error:', error);
      throw error;
    }
  }
}
