import apiClient from './api';

export const paymentService = {
  createRazorpayOrder: async (bookingId: string, amount: number) => {
    const response = await apiClient.post('/payments/razorpay/create-order', {
      bookingId,
      amount,
    });
    return response.data.data;
  },

  verifyRazorpayPayment: async (orderId: string, paymentId: string, signature: string) => {
    const response = await apiClient.post('/payments/razorpay/verify', {
      orderId,
      paymentId,
      signature,
    });
    return response.data.data;
  },

  createStripePaymentIntent: async (bookingId: string, amount: number) => {
    const response = await apiClient.post('/payments/stripe/create-intent', {
      bookingId,
      amount,
    });
    return response.data.data;
  },

  getPaymentHistory: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/payments/history', {
      params: { page, limit },
    });
    return response.data;
  },
};
