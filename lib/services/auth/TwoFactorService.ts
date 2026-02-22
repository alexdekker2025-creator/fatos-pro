import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { getEncryptionService } from './EncryptionService';

/**
 * TwoFactorService - Handles TOTP-based two-factor authentication
 * Includes QR code generation and backup codes management
 */
export class TwoFactorService {
  private encryptionService = getEncryptionService();
  private readonly BACKUP_CODE_COUNT = 10;
  private readonly BACKUP_CODE_LENGTH = 8;

  constructor() {
    // Configure otplib for 30-second time windows
    authenticator.options = {
      window: 1, // Accept codes from current and previous time window (±30 seconds)
    };
  }

  /**
   * Generate TOTP secret
   */
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  /**
   * Generate QR code data URL for authenticator app
   * @param secret - TOTP secret
   * @param email - User email for display in authenticator app
   */
  async generateQRCode(secret: string, email: string): Promise<string> {
    const otpauthUrl = authenticator.keyuri(
      email,
      'FATOS.pro',
      secret
    );
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  }

  /**
   * Verify TOTP code with clock drift tolerance
   * @param secret - TOTP secret
   * @param code - 6-digit TOTP code
   */
  verifyTOTP(secret: string, code: string): boolean {
    try {
      return authenticator.verify({ token: code, secret });
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate backup codes
   * @param count - Number of backup codes to generate (default: 10)
   */
  generateBackupCodes(count: number = this.BACKUP_CODE_COUNT): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate random alphanumeric code
      const code = this.generateRandomCode(this.BACKUP_CODE_LENGTH);
      codes.push(code);
    }
    
    return codes;
  }

  /**
   * Generate random alphanumeric code
   */
  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
      
      // Add dash after 4 characters for readability
      if (i === 3) {
        code += '-';
      }
    }
    
    return code;
  }

  /**
   * Hash backup code for storage
   */
  async hashBackupCode(code: string): Promise<string> {
    return bcrypt.hash(code, 10);
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(code: string, hash: string): Promise<boolean> {
    return bcrypt.compare(code, hash);
  }

  /**
   * Enable 2FA for user
   * @param userId - User ID
   * @param secret - TOTP secret
   */
  async enable2FA(userId: string, secret: string): Promise<{
    backupCodes: string[];
  }> {
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Hash backup codes for storage
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => this.hashBackupCode(code))
    );
    
    // Encrypt TOTP secret
    const secretEncrypted = this.encryptionService.encrypt(secret);
    
    // Store in database
    await prisma.twoFactorAuth.create({
      data: {
        userId,
        secretEncrypted,
        backupCodes: hashedBackupCodes,
      },
    });
    
    // Update user's twoFactorEnabled flag
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    
    return { backupCodes };
  }

  /**
   * Disable 2FA for user
   * @param userId - User ID
   */
  async disable2FA(userId: string): Promise<void> {
    // Delete 2FA data
    await prisma.twoFactorAuth.deleteMany({
      where: { userId },
    });
    
    // Update user's twoFactorEnabled flag
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false },
    });
  }

  /**
   * Verify 2FA code during login
   * @param userId - User ID
   * @param code - TOTP code or backup code
   */
  async verify2FACode(userId: string, code: string): Promise<{
    valid: boolean;
    isBackupCode: boolean;
  }> {
    // Get 2FA data
    const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
      where: { userId },
    });
    
    if (!twoFactorAuth) {
      return { valid: false, isBackupCode: false };
    }
    
    // Decrypt TOTP secret
    const secret = this.encryptionService.decrypt(twoFactorAuth.secretEncrypted);
    
    // Try TOTP verification first
    if (this.verifyTOTP(secret, code)) {
      return { valid: true, isBackupCode: false };
    }
    
    // Try backup codes
    const backupCodes = twoFactorAuth.backupCodes as string[];
    
    for (let i = 0; i < backupCodes.length; i++) {
      const isValid = await this.verifyBackupCode(code, backupCodes[i]);
      
      if (isValid) {
        // Mark backup code as used by removing it
        const updatedBackupCodes = backupCodes.filter((_, index) => index !== i);
        
        await prisma.twoFactorAuth.update({
          where: { userId },
          data: { backupCodes: updatedBackupCodes },
        });
        
        return { valid: true, isBackupCode: true };
      }
    }
    
    return { valid: false, isBackupCode: false };
  }

  /**
   * Regenerate backup codes
   * @param userId - User ID
   */
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    // Generate new backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Hash backup codes for storage
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => this.hashBackupCode(code))
    );
    
    // Update in database (invalidates old codes)
    await prisma.twoFactorAuth.update({
      where: { userId },
      data: { backupCodes: hashedBackupCodes },
    });
    
    return backupCodes;
  }

  /**
   * Get 2FA status for user
   */
  async get2FAStatus(userId: string): Promise<{
    enabled: boolean;
    backupCodesRemaining?: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });
    
    if (!user?.twoFactorEnabled) {
      return { enabled: false };
    }
    
    const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
      where: { userId },
    });
    
    const backupCodesRemaining = twoFactorAuth
      ? (twoFactorAuth.backupCodes as string[]).length
      : 0;
    
    return {
      enabled: true,
      backupCodesRemaining,
    };
  }
}

// Singleton instance
let twoFactorServiceInstance: TwoFactorService | null = null;

export function getTwoFactorService(): TwoFactorService {
  if (!twoFactorServiceInstance) {
    twoFactorServiceInstance = new TwoFactorService();
  }
  return twoFactorServiceInstance;
}
