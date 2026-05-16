// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  iat?: number;
  exp?: number;
}

// User Types
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'manager';
  isEmailVerified: boolean;
  passwordHash: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Room Types
export interface IRoom {
  id: string;
  name: string;
  description: string;
  category: 'economy' | 'standard' | 'deluxe' | 'luxury' | 'suite';
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: IImage[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImage {
  id: string;
  roomId: string;
  url: string;
  type: '3d' | '2d' | '3d-360';
  alt: string;
  uploadedAt: Date;
}

// Booking Types
export interface IBooking {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfNights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface IPayment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  method: 'razorpay' | 'stripe' | 'upi' | 'card';
  transactionId: string;
  paymentDetails?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface IReview {
  id: string;
  userId: string;
  roomId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Request with User
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
