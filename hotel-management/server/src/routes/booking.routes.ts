import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const bookingController = new BookingController();

// Protected routes
router.post('/', authenticate, bookingController.createBooking.bind(bookingController));
router.get('/my-bookings', authenticate, bookingController.getMyBookings.bind(bookingController));
router.get('/:bookingId', authenticate, bookingController.getBookingById.bind(bookingController));
router.put('/:bookingId', authenticate, bookingController.updateBooking.bind(bookingController));
router.post('/:bookingId/cancel', authenticate, bookingController.cancelBooking.bind(bookingController));
router.post('/:bookingId/check-in', authenticate, bookingController.checkIn.bind(bookingController));
router.post('/:bookingId/check-out', authenticate, bookingController.checkOut.bind(bookingController));

// Admin routes
router.get('/', authenticate, authorize('admin'), bookingController.getAllBookings.bind(bookingController));

export default router;
