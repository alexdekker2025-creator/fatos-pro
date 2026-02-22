/**
 * Unit tests for AuthService email verification methods
 * Tests: sendEmailVerification, verifyEmail, resendEmailVerification
 */

import { AuthService } from '../AuthService';
import { prisma } from '@/lib/prisma';
import { getTokenService } from '../TokenService';
import { getEmailService } from '../EmailService';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    securityLog: {
      create: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('../TokenService', () => ({
  getTokenService: jest.fn(),
}));

jest.mock('../EmailService', () => ({
  getEmailService: jest.fn(),
}));

describe('AuthService - Email Verification', () => {
  let authService: AuthService;
  let mockTokenService: any;
  let mockEmailService: any;

  beforeEach(() => {
    authService = new AuthService();
    
    // Setup mock services
    mockTokenService = {
      createEmailVerificationToken: jest.fn(),
      validateEmailVerificationToken: jest.fn(),
      invalidateEmailVerificationToken: jest.fn(),
    };
    
    mockEmailService = {
      sendEmailVerificationEmail: jest.fn(),
    };

    (getTokenService as jest.Mock).mockReturnValue(mockTokenService);
    (getEmailService as jest.Mock).mockReturnValue(mockEmailService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('sendEmailVerification', () => {
    it('should send verification email for unverified user', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        emailVerified: false,
        preferredLang: 'ru',
      };
      const mockToken = 'verification-token-123';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockTokenService.createEmailVerificationToken.mockResolvedValue({
        token: mockToken,
        expiresAt: new Date(),
      });
      mockEmailService.sendEmailVerificationEmail.mockResolvedValue(undefined);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await authService.sendEmailVerification(userId);

      // Assert
      expect(result).toEqual({ success: true });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          preferredLang: true,
        },
      });
      expect(mockTokenService.createEmailVerificationToken).toHaveBeenCalledWith(userId);
      expect(mockEmailService.sendEmailVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockToken,
        'ru'
      );
      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId,
          event: 'EMAIL_VERIFICATION_SENT',
          metadata: {
            email: mockUser.email,
          },
        },
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(authService.sendEmailVerification('nonexistent')).rejects.toThrow(
        'User not found'
      );
    });

    it('should throw error if email already verified', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        preferredLang: 'ru',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.sendEmailVerification('user-123')).rejects.toThrow(
        'Email is already verified'
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      // Arrange
      const token = 'valid-token';
      const userId = 'user-123';
      const mockUser = { emailVerified: true };

      mockTokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: true,
        userId,
      });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);
      mockTokenService.invalidateEmailVerificationToken.mockResolvedValue(undefined);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await authService.verifyEmail(token);

      // Assert
      expect(result).toEqual({ success: true, user: mockUser });
      expect(mockTokenService.validateEmailVerificationToken).toHaveBeenCalledWith(token);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { emailVerified: true },
        select: { emailVerified: true },
      });
      expect(mockTokenService.invalidateEmailVerificationToken).toHaveBeenCalledWith(token);
      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId,
          event: 'EMAIL_VERIFIED',
          metadata: expect.objectContaining({
            verifiedAt: expect.any(String),
          }),
        },
      });
    });

    it('should throw error for expired token', async () => {
      // Arrange
      mockTokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: false,
        expired: true,
      });

      // Act & Assert
      await expect(authService.verifyEmail('expired-token')).rejects.toThrow(
        'Email verification token has expired'
      );
    });

    it('should throw error for invalid token', async () => {
      // Arrange
      mockTokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: false,
      });

      // Act & Assert
      await expect(authService.verifyEmail('invalid-token')).rejects.toThrow(
        'Invalid email verification token'
      );
    });
  });

  describe('resendEmailVerification', () => {
    it('should resend verification email within rate limit', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        emailVerified: false,
        preferredLang: 'en',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.securityLog.count as jest.Mock).mockResolvedValue(2); // Under limit
      mockTokenService.createEmailVerificationToken.mockResolvedValue({
        token: 'new-token',
        expiresAt: new Date(),
      });
      mockEmailService.sendEmailVerificationEmail.mockResolvedValue(undefined);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await authService.resendEmailVerification(userId);

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Verification email has been sent. Please check your inbox.',
      });
      expect(prisma.securityLog.count).toHaveBeenCalledWith({
        where: {
          userId,
          event: 'EMAIL_VERIFICATION_SENT',
          createdAt: {
            gte: expect.any(Date),
          },
        },
      });
    });

    it('should throw error when rate limit exceeded', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        emailVerified: false,
        preferredLang: 'ru',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.securityLog.count as jest.Mock).mockResolvedValue(3); // At limit

      // Act & Assert
      await expect(authService.resendEmailVerification(userId)).rejects.toThrow(
        'Rate limit exceeded. Please try again later.'
      );
    });

    it('should throw error if user not found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(authService.resendEmailVerification('nonexistent')).rejects.toThrow(
        'User not found'
      );
    });

    it('should throw error if email already verified', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        preferredLang: 'ru',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.resendEmailVerification('user-123')).rejects.toThrow(
        'Email is already verified'
      );
    });
  });
});
