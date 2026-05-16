export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'manager';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  category: 'economy' | 'standard' | 'deluxe' | 'luxury' | 'suite';
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: RoomImage[];
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomImage {
  id: string;
  roomId: string;
  url: string;
  type: '3d' | '2d' | '3d-360';
  alt: string;
  uploadedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  bookingReference: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  specialRequests?: string;
  room?: Room;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  method: 'razorpay' | 'stripe' | 'upi' | 'card';
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
