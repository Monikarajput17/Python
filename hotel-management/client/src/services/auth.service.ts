import apiClient from './api';
import { User } from '@types/index';

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data;
  },
};
