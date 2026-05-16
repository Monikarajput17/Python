import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createRoomSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid('economy', 'standard', 'deluxe', 'luxury', 'suite').required(),
  capacity: Joi.number().min(1).required(),
  pricePerNight: Joi.number().min(0).required(),
  amenities: Joi.array().items(Joi.string()).required(),
});

export const createBookingSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  checkInDate: Joi.date().required(),
  checkOutDate: Joi.date().min(Joi.ref('checkInDate')).required(),
  numberOfGuests: Joi.number().min(1).required(),
  specialRequests: Joi.string().optional(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
});
