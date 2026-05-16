import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

// All admin routes require admin role
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats.bind(adminController));
router.get('/dashboard/revenue', adminController.getRevenueAnalytics.bind(adminController));
router.get('/dashboard/bookings', adminController.getBookingAnalytics.bind(adminController));
router.get('/dashboard/occupancy', adminController.getOccupancyAnalytics.bind(adminController));

// Customer Management
router.get('/customers', adminController.getAllCustomers.bind(adminController));
router.get('/customers/:customerId', adminController.getCustomerDetails.bind(adminController));
router.delete('/customers/:customerId', adminController.deleteCustomer.bind(adminController));

// Reports
router.get('/reports/revenue', adminController.generateRevenueReport.bind(adminController));
router.get('/reports/bookings', adminController.generateBookingReport.bind(adminController));
router.get('/reports/occupancy', adminController.generateOccupancyReport.bind(adminController));
router.post('/reports/export', adminController.exportReport.bind(adminController));

export default router;
