import { Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Booking } from '../database/entities/Booking';
import { Room } from '../database/entities/Room';
import { AuthenticatedRequest } from '../types';
import { createBookingSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class BookingController {
  private bookingRepository = AppDataSource.getRepository(Booking);
  private roomRepository = AppDataSource.getRepository(Room);

  async createBooking(req: AuthenticatedRequest, res: Response) {
    try {
      const { error, value } = createBookingSchema.validate(req.body);
      if (error) throw error;

      const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = value;

      // Verify room exists
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new AppError('Room not found', 404);
      }

      // Calculate nights
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      if (numberOfNights <= 0) {
        throw new AppError('Invalid dates', 400);
      }

      // Calculate total price
      const totalPrice = parseFloat(room.pricePerNight.toString()) * numberOfNights;

      // Create booking reference
      const bookingReference = `HM${Date.now()}`;

      const booking = this.bookingRepository.create({
        userId: req.user?.id,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests,
        numberOfNights,
        totalPrice,
        bookingReference,
        specialRequests,
        status: 'pending',
      });

      await this.bookingRepository.save(booking);
      logger.info(`Booking created: ${booking.id}`);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          ...booking,
          paymentUrl: '/api/v1/payments/razorpay/create-order',
        },
      });
    } catch (error) {
      logger.error('Create booking error:', error);
      throw error;
    }
  }

  async getMyBookings(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      let query = this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.userId = :userId', { userId: req.user?.id })
        .leftJoinAndSelect('booking.room', 'room')
        .leftJoinAndSelect('room.images', 'images');

      if (status) {
        query = query.andWhere('booking.status = :status', { status });
      }

      const total = await query.getCount();
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const bookings = await query
        .skip(skip)
        .take(parseInt(limit as string))
        .orderBy('booking.createdAt', 'DESC')
        .getMany();

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
      logger.error('Get my bookings error:', error);
      throw error;
    }
  }

  async getBookingById(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookingId } = req.params;

      const booking = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.id = :id', { id: bookingId })
        .andWhere('booking.userId = :userId', { userId: req.user?.id })
        .leftJoinAndSelect('booking.room', 'room')
        .leftJoinAndSelect('room.images', 'images')
        .getOne();

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      logger.error('Get booking by ID error:', error);
      throw error;
    }
  }

  async updateBooking(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookingId } = req.params;

      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.userId !== req.user?.id) {
        throw new AppError('Unauthorized', 403);
      }

      if (booking.status !== 'pending') {
        throw new AppError('Can only update pending bookings', 400);
      }

      Object.assign(booking, req.body);
      await this.bookingRepository.save(booking);

      logger.info(`Booking updated: ${booking.id}`);

      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error) {
      logger.error('Update booking error:', error);
      throw error;
    }
  }

  async cancelBooking(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;

      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.userId !== req.user?.id) {
        throw new AppError('Unauthorized', 403);
      }

      // Calculate refund (simplified logic)
      const refundPercentage = 80; // 80% refund
      const refundAmount = (booking.totalPrice * refundPercentage) / 100;

      booking.status = 'cancelled';
      booking.cancellationReason = reason;
      booking.refundAmount = refundAmount;

      await this.bookingRepository.save(booking);
      logger.info(`Booking cancelled: ${booking.id}`);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          refundAmount,
          refundStatus: 'pending',
        },
      });
    } catch (error) {
      logger.error('Cancel booking error:', error);
      throw error;
    }
  }

  async checkIn(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookingId } = req.params;

      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status !== 'confirmed') {
        throw new AppError('Booking must be confirmed for check-in', 400);
      }

      booking.status = 'checked-in';
      await this.bookingRepository.save(booking);

      logger.info(`Check-in: ${booking.id}`);

      res.status(200).json({
        success: true,
        message: 'Check-in successful',
        data: booking,
      });
    } catch (error) {
      logger.error('Check-in error:', error);
      throw error;
    }
  }

  async checkOut(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookingId } = req.params;

      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status !== 'checked-in') {
        throw new AppError('Booking must be checked-in for check-out', 400);
      }

      booking.status = 'checked-out';
      await this.bookingRepository.save(booking);

      logger.info(`Check-out: ${booking.id}`);

      res.status(200).json({
        success: true,
        message: 'Check-out successful',
        data: booking,
      });
    } catch (error) {
      logger.error('Check-out error:', error);
      throw error;
    }
  }

  async getAllBookings(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 20, status } = req.query;

      let query = this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.room', 'room');

      if (status) {
        query = query.where('booking.status = :status', { status });
      }

      const total = await query.getCount();
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const bookings = await query
        .skip(skip)
        .take(parseInt(limit as string))
        .orderBy('booking.createdAt', 'DESC')
        .getMany();

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
      logger.error('Get all bookings error:', error);
      throw error;
    }
  }
}
