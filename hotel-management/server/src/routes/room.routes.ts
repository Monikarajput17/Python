import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const roomController = new RoomController();

// Public routes
router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/search', roomController.searchRooms.bind(roomController));
router.get('/:roomId', roomController.getRoomById.bind(roomController));
router.get('/:roomId/availability', roomController.checkAvailability.bind(roomController));

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), roomController.createRoom.bind(roomController));
router.put('/:roomId', authenticate, authorize('admin'), roomController.updateRoom.bind(roomController));
router.delete('/:roomId', authenticate, authorize('admin'), roomController.deleteRoom.bind(roomController));
router.post('/:roomId/images', authenticate, authorize('admin'), roomController.uploadImages.bind(roomController));
router.delete('/:roomId/images/:imageId', authenticate, authorize('admin'), roomController.deleteImage.bind(roomController));

// Reviews
router.get('/:roomId/reviews', roomController.getRoomReviews.bind(roomController));
router.post('/:roomId/reviews', authenticate, roomController.createReview.bind(roomController));

export default router;
