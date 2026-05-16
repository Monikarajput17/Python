import apiClient from './api';
import { Room, ApiResponse } from '@types/index';

export const roomService = {
  getAllRooms: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get<ApiResponse<Room[]>>('/rooms', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  getRoomById: async (roomId: string): Promise<Room> => {
    const response = await apiClient.get(`/rooms/${roomId}`);
    return response.data.data;
  },

  searchRooms: async (query: string, filters?: any) => {
    const response = await apiClient.get('/rooms/search', {
      params: { query, ...filters },
    });
    return response.data.data;
  },

  checkAvailability: async (roomId: string, checkInDate: string, checkOutDate: string) => {
    const response = await apiClient.get(`/rooms/${roomId}/availability`, {
      params: { checkInDate, checkOutDate },
    });
    return response.data.data;
  },
};
