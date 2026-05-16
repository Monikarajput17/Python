import { Response, Request } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { AuthenticatedRequest } from '../types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async register(req: Request, res: Response) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) throw error;

      const { email, password, firstName, lastName, phone } = value;

      // Check if user exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = this.userRepository.create({
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        isEmailVerified: false,
      });

      await this.userRepository.save(user);
      logger.info(`New user registered: ${email}`);

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || '',
        { expiresIn: process.env.JWT_EXPIRE || '15m' }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) throw error;

      const { email, password } = value;

      // Find user
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || '',
        { expiresIn: process.env.JWT_EXPIRE || '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET || '',
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }
      );

      logger.info(`User logged in: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          token,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(req: AuthenticatedRequest, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token required', 400);
      }

      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '') as any;
      const user = await this.userRepository.findOne({ where: { id: decoded.id } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const newToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || '',
        { expiresIn: process.env.JWT_EXPIRE || '15m' }
      );

      res.status(200).json({
        success: true,
        data: { token: newToken },
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      logger.info(`User logged out: ${req.user?.email}`);
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await this.userRepository.findOne({ where: { id: req.user?.id } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      logger.error('Get current user error:', error);
      throw error;
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        // Don't reveal if user exists
        return res.status(200).json({
          success: true,
          message: 'If email exists, password reset link will be sent',
        });
      }

      // Generate reset token (valid for 1 hour)
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', {
        expiresIn: '1h',
      });

      // Update user with reset token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
      await this.userRepository.save(user);

      logger.info(`Password reset requested for: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to email',
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password || password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
      const user = await this.userRepository.findOne({ where: { id: decoded.id } });

      if (!user || !user.resetPasswordToken || !user.resetPasswordExpire) {
        throw new AppError('Invalid reset token', 400);
      }

      if (new Date() > user.resetPasswordExpire) {
        throw new AppError('Reset token expired', 400);
      }

      // Update password
      user.passwordHash = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await this.userRepository.save(user);

      logger.info(`Password reset for user: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }
}
