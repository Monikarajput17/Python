import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const paymentController = new PaymentController();

// Payment endpoints
router.post('/razorpay/create-order', authenticate, paymentController.createRazorpayOrder.bind(paymentController));
router.post('/razorpay/verify', paymentController.verifyRazorpayPayment.bind(paymentController));
router.post('/stripe/create-intent', authenticate, paymentController.createStripePaymentIntent.bind(paymentController));
router.post('/stripe/webhook', paymentController.handleStripeWebhook.bind(paymentController));

// Payment history
router.get('/history', authenticate, paymentController.getPaymentHistory.bind(paymentController));
router.get('/invoice/:paymentId', authenticate, paymentController.generateInvoice.bind(paymentController));

export default router;
