/**
 * Tests for 2FA login verification in AuthService
 * Task 10.2: Add 2FA login verification to AuthService
 */

import { AuthService } from '../AuthService';
import { prisma } from '@/lib/prisma';
import { getTwoFactorService } from '../TwoFactorService';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    securityLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../TwoFactorService', () => ({
  getTwoFactorService: jest.fn(),
}));

describe('AuthService - 2FA Login Verification', () => {
  let authService: AuthService;
  let mockTwoFactorService: any;

  beforeEach(() => {
    authService = new AuthService();
    mockTwoFactorService = {
      verify2FACode: jest.fn(),
    };
    (getTwoFactorService as jest.Mock).mockReturnValue(mockTwoFactorService);
    jest.clearAllMocks();
  });

  describe('login() with 2FA enabled', () => {
    it('should return requiresTwoFactor when user has 2FA enabled', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: '$2b$10$hashedpassword',
        preferredLang: 'en',
        twoFactorEnabled: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock password verification
      jest.spyOn(authService as any, 'verifyPassword').mockResolvedValue(true);

      // Act
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      // Assert
      expect(result).toEqual({
        requiresTwoFactor: true,
        userId: 'user-123',
      });
      expect(prisma.session.create).not.toHaveBeenCalled();
    });

    it('should create session normally when user has 2FA disabled', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: '$2b$10$hashedpassword',
        preferredLang: 'en',
        twoFactorEnabled: false,
      };

      const mockSession = {
        id: 'session-123',
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);
      
      // Mock password verification
      jest.spyOn(authService as any, 'verifyPassword').mockResolvedValue(true);

      // Act
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect((result as any).user.id).toBe('user-123');
      expect(prisma.session.create).toHaveBeenCalled();
    });
  });

  describe('verify2FALogin()', () => {
    it('should create session after successful TOTP verification', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferredLang: 'en',
        twoFactorEnabled: true,
      };

      const mockSession = {
        id: 'session-123',
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);
      mockTwoFactorService.verify2FACode.mockResolvedValue({
        valid: true,
        isBackupCode: false,
      });

      // Act
      const result = await authService.verify2FALogin('user-123', '123456');

      // Assert
      expect(result).toEqual({
        success: true,
        session: mockSession,
      });
      expect(mockTwoFactorService.verify2FACode).toHaveBeenCalledWith('user-123', '123456');
      expect(prisma.session.create).toHaveBeenCalled();
      expect(prisma.securityLog.create).not.toHaveBeenCalled(); // No backup code used
    });

    it('should log security event when backup code is used', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferredLang: 'en',
        twoFactorEnabled: true,
      };

      const mockSession = {
        id: 'session-123',
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});
      mockTwoFactorService.verify2FACode.mockResolvedValue({
        valid: true,
        isBackupCode: true,
      });

      // Act
      const result = await authService.verify2FALogin('user-123', 'ABCD-1234');

      // Assert
      expect(result).toEqual({
        success: true,
        session: mockSession,
      });
      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          event: '2FA_BACKUP_CODE_USED',
          metadata: expect.objectContaining({
            usedAt: expect.any(String),
          }),
        },
      });
    });

    it('should throw error when 2FA code is invalid', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferredLang: 'en',
        twoFactorEnabled: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockTwoFactorService.verify2FACode.mockResolvedValue({
        valid: false,
        isBackupCode: false,
      });

      // Act & Assert
      await expect(
        authService.verify2FALogin('user-123', '000000')
      ).rejects.toThrow('Invalid two-factor authentication code');
      
      expect(prisma.session.create).not.toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.verify2FALogin('nonexistent-user', '123456')
      ).rejects.toThrow('User not found');
    });

    it('should throw error when user does not have 2FA enabled', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferredLang: 'en',
        twoFactorEnabled: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        authService.verify2FALogin('user-123', '123456')
      ).rejects.toThrow('Two-factor authentication is not enabled for this user');
    });
  });
});
