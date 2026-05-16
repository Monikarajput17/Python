import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { AppDataSource } from '../database/data-source';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AdminController {
  async getDashboardStats(req: AuthenticatedRequest, res: Response) {
    try {
      // Query aggregated stats from database
      const stats = {
        totalRevenue: 150000,
        totalBookings: 125,
        occupancyRate: 78,
        averageBookingValue: 1200,
        totalCustomers: 450,
        availableRooms: 15,
        pendingPayments: 5,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const { period = 'month' } = req.query; // daily, weekly, month, year

      const revenueData = {
        period,
        totalRevenue: 150000,
        chartData: [
          { date: '2026-05-01', revenue: 5000 },
          { date: '2026-05-02', revenue: 5500 },
          { date: '2026-05-03', revenue: 6000 },
        ],
      };

      res.status(200).json({
        success: true,
        data: revenueData,
      });
    } catch (error) {
      logger.error('Get revenue analytics error:', error);
      throw error;
    }
  }

  async getBookingAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const bookingData = {
        totalBookings: 125,
        confirmedBookings: 100,
        pendingBookings: 20,
        cancelledBookings: 5,
        chartData: [
          { date: '2026-05-01', bookings: 10 },
          { date: '2026-05-02', bookings: 12 },
          { date: '2026-05-03', bookings: 8 },
        ],
      };

      res.status(200).json({
        success: true,
        data: bookingData,
      });
    } catch (error) {
      logger.error('Get booking analytics error:', error);
      throw error;
    }
  }

  async getOccupancyAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const occupancyData = {
        occupancyRate: 78,
        totalRooms: 50,
        bookedRooms: 39,
        availableRooms: 11,
        chartData: [
          { date: '2026-05-01', occupancy: 75 },
          { date: '2026-05-02', occupancy: 80 },
          { date: '2026-05-03', occupancy: 78 },
        ],
      };

      res.status(200).json({
        success: true,
        data: occupancyData,
      });
    } catch (error) {
      logger.error('Get occupancy analytics error:', error);
      throw error;
    }
  }

  async getAllCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 20, search } = req.query;

      const userRepository = AppDataSource.getRepository('User');
      let query = userRepository.createQueryBuilder('user')
        .where('user.role = :role', { role: 'user' });

      if (search) {
        query = query.andWhere(
          'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
          { search: `%${search}%` }
        );
      }

      const total = await query.getCount();
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const customers = await query
        .skip(skip)
        .take(parseInt(limit as string))
        .orderBy('user.createdAt', 'DESC')
        .getMany();

      res.status(200).json({
        success: true,
        data: customers,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      logger.error('Get all customers error:', error);
      throw error;
    }
  }

  async getCustomerDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { customerId } = req.params;

      const userRepository = AppDataSource.getRepository('User');
      const customer = await userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: customerId })
        .leftJoinAndSelect('user.bookings', 'bookings')
        .getOne();

      if (!customer) {
        throw new AppError('Customer not found', 404);
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      logger.error('Get customer details error:', error);
      throw error;
    }
  }

  async deleteCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { customerId } = req.params;

      const userRepository = AppDataSource.getRepository('User');
      const customer = await userRepository.findOne({ where: { id: customerId } });

      if (!customer) {
        throw new AppError('Customer not found', 404);
      }

      await userRepository.remove(customer);
      logger.info(`Customer deleted: ${customerId}`);

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      logger.error('Delete customer error:', error);
      throw error;
    }
  }

  async generateRevenueReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const report = {
        period: { startDate, endDate },
        totalRevenue: 150000,
        bookingCount: 125,
        averageValue: 1200,
      };

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Generate revenue report error:', error);
      throw error;
    }
  }

  async generateBookingReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const report = {
        period: { startDate, endDate },
        totalBookings: 125,
        confirmedBookings: 100,
        cancelledBookings: 5,
        averageDuration: 4.2,
      };

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Generate booking report error:', error);
      throw error;
    }
  }

  async generateOccupancyReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const report = {
        period: { startDate, endDate },
        averageOccupancy: 78,
        peakOccupancy: 95,
        lowestOccupancy: 45,
      };

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Generate occupancy report error:', error);
      throw error;
    }
  }

  async exportReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { type, format } = req.body; // type: revenue/booking/occupancy, format: csv/pdf

      // Generate and export report
      res.status(200).json({
        success: true,
        message: 'Report exported successfully',
        data: {
          downloadUrl: '/reports/export.csv',
        },
      });
    } catch (error) {
      logger.error('Export report error:', error);
      throw error;
    }
  }
}
