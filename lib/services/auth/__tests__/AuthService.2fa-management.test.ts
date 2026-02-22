import { AuthService } from '../AuthService';
import { prisma } from '@/lib/prisma';
import { getTwoFactorService } from '../TwoFactorService';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    securityLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../TwoFactorService', () => ({
  getTwoFactorService: jest.fn(),
}));

describe('AuthService - 2FA Management', () => {
  let authService: AuthService;
  let mockTwoFactorService: any;

  beforeEach(() => {
    authService = new AuthService();
    mockTwoFactorService = {
      disable2FA: jest.fn(),
      verify2FACode: jest.fn(),
      regenerateBackupCodes: jest.fn(),
    };
    (getTwoFactorService as jest.Mock).mockReturnValue(mockTwoFactorService);
    jest.clearAllMocks();
  });

  describe('disable2FA', () => {
    it('should disable 2FA after password verification', async () => {
      // Arrange
      const userId = 'user-123';
      const password = 'correct-password';
      const passwordHash = await authService.hashPassword(password);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        passwordHash,
        twoFactorEnabled: true,
      });

      mockTwoFactorService.disable2FA.mockResolvedValue(undefined);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await authService.disable2FA(userId, password);

      // Assert
      expect(result).toEqual({ success: true });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          passwordHash: true,
          twoFactorEnabled: true,
        },
      });
      expect(mockTwoFactorService.disable2FA).toHaveBeenCalledWith(userId);
      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId,
          event: '2FA_DISABLED',
          metadata: expect.objectContaining({
            disabledAt: expect.any(String),
          }),
        },
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.disable2FA('user-123', 'password')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if 2FA not enabled', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        passwordHash: 'hash',
        twoFactorEnabled: false,
      });

      // Act & Assert
      await expect(
        authService.disable2FA('user-123', 'password')
      ).rejects.toThrow('Two-factor authentication is not enabled');
    });

    it('should throw error if password is invalid', async () => {
      // Arrange
      const correctPassword = 'correct-password';
      const passwordHash = await authService.hashPassword(correctPassword);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        passwordHash,
        twoFactorEnabled: true,
      });

      // Act & Assert
      await expect(
        authService.disable2FA('user-123', 'wrong-password')
      ).rejects.toThrow('Invalid password');
    });
  });

  describe('regenerateBackupCodes', () => {
    it('should regenerate backup codes after code verification', async () => {
      // Arrange
      const userId = 'user-123';
      const code = '123456';
      const newBackupCodes = ['CODE1-234', 'CODE2-567', 'CODE3-890'];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        twoFactorEnabled: true,
      });

      mockTwoFactorService.verify2FACode.mockResolvedValue({
        valid: true,
        isBackupCode: false,
      });

      mockTwoFactorService.regenerateBackupCodes.mockResolvedValue(newBackupCodes);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await authService.regenerateBackupCodes(userId, code);

      // Assert
      expect(result).toEqual({ backupCodes: newBackupCodes });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          twoFactorEnabled: true,
        },
      });
      expect(mockTwoFactorService.verify2FACode).toHaveBeenCalledWith(userId, code);
      expect(mockTwoFactorService.regenerateBackupCodes).toHaveBeenCalledWith(userId);
      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId,
          event: '2FA_BACKUP_CODES_REGENERATED',
          metadata: expect.objectContaining({
            regeneratedAt: expect.any(String),
          }),
        },
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.regenerateBackupCodes('user-123', '123456')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if 2FA not enabled', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        twoFactorEnabled: false,
      });

      // Act & Assert
      await expect(
        authService.regenerateBackupCodes('user-123', '123456')
      ).rejects.toThrow('Two-factor authentication is not enabled');
    });

    it('should throw error if code is invalid', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        twoFactorEnabled: true,
      });

      mockTwoFactorService.verify2FACode.mockResolvedValue({
        valid: false,
        isBackupCode: false,
      });

      // Act & Assert
      await expect(
        authService.regenerateBackupCodes('user-123', 'invalid-code')
      ).rejects.toThrow('Invalid two-factor authentication code');
    });

    it('should work with backup code verification', async () => {
      // Arrange
      const userId = 'user-123';
      const backupCode = 'ABCD-1234';
      const newBackupCodes = ['NEW1-234', 'NEW2-567'];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        twoFactorEnabled: true,
      });

      mockTwoFactorService.verify2FACode.mockResolvedValue({
        valid: true,
        isBackupCode: true,
      });

      mockTwoFactorService.regenerateBackupCodes.mockResolvedValue(newBackupCodes);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await authService.regenerateBackupCodes(userId, backupCode);

      // Assert
      expect(result).toEqual({ backupCodes: newBackupCodes });
      expect(mockTwoFactorService.verify2FACode).toHaveBeenCalledWith(userId, backupCode);
    });
  });
});
