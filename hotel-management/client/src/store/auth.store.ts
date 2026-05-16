import { create } from 'zustand';
import { User } from '@types/index';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
}));
