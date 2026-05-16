import apiClient from './api';
import { Booking, ApiResponse } from '@types/index';

export const bookingService = {
  createBooking: async (data: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
  }) => {
    const response = await apiClient.post('/bookings', data);
    return response.data.data;
  },

  getMyBookings: async (page = 1, limit = 10, status?: string) => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/my-bookings', {
      params: { page, limit, status },
    });
    return response.data;
  },

  getBookingById: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data.data;
  },

  cancelBooking: async (bookingId: string, reason: string) => {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
    return response.data.data;
  },

  checkIn: async (bookingId: string) => {
    const response = await apiClient.post(`/bookings/${bookingId}/check-in`);
    return response.data.data;
  },

  checkOut: async (bookingId: string) => {
    const response = await apiClient.post(`/bookings/${bookingId}/check-out`);
    return response.data.data;
  },
};
