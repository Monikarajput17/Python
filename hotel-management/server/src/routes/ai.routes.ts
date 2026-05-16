import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const aiController = new AIController();

// AI endpoints
router.post('/chat', authenticate, aiController.chat.bind(aiController));
router.get('/recommendations', authenticate, aiController.getRecommendations.bind(aiController));
router.post('/pricing-suggestion', authenticate, aiController.getPricingSuggestion.bind(aiController));
router.get('/chatbot-history', authenticate, aiController.getChatHistory.bind(aiController));

export default router;
