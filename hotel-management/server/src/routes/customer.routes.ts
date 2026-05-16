import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const customerController = new CustomerController();

// Protected routes
router.get('/profile', authenticate, customerController.getProfile.bind(customerController));
router.put('/profile', authenticate, customerController.updateProfile.bind(customerController));
router.get('/bookings', authenticate, customerController.getBookingHistory.bind(customerController));
router.get('/saved-rooms', authenticate, customerController.getSavedRooms.bind(customerController));
router.post('/saved-rooms/:roomId', authenticate, customerController.saveRoom.bind(customerController));
router.delete('/saved-rooms/:roomId', authenticate, customerController.unsaveRoom.bind(customerController));

export default router;
