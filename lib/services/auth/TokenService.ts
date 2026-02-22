import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * TokenService - Handles cryptographically secure token generation and validation
 * Used for password reset and email verification tokens
 */
export class TokenService {
  private readonly PASSWORD_RESET_EXPIRY_HOURS = 1;
  private readonly EMAIL_VERIFICATION_EXPIRY_HOURS = 24;

  /**
   * Generate cryptographically secure random token
   * @param bytes - Number of random bytes (default: 32)
   * @returns URL-safe base64 encoded token
   */
  generateToken(bytes: number = 32): string {
    return crypto
      .randomBytes(bytes)
      .toString('base64url'); // URL-safe base64 encoding
  }

  /**
   * Hash token using SHA-256
   * @param token - Plain token to hash
   * @returns Hex-encoded hash
   */
  hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Verify token using constant-time comparison
   * @param token - Plain token to verify
   * @param hash - Stored hash to compare against
   * @returns True if token matches hash
   */
  verifyToken(token: string, hash: string): boolean {
    const tokenHash = this.hashToken(token);
    const tokenHashBuffer = Buffer.from(tokenHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');

    // Constant-time comparison to prevent timing attacks
    if (tokenHashBuffer.length !== hashBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(tokenHashBuffer, hashBuffer);
  }

  /**
   * Create password reset token for user
   * @param userId - User ID
   * @returns Token and expiration date
   */
  async createPasswordResetToken(userId: string): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.PASSWORD_RESET_EXPIRY_HOURS);

    // Store token hash in database
    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  /**
   * Validate password reset token
   * @param token - Plain token to validate
   * @returns Validation result with user ID if valid
   */
  async validatePasswordResetToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    expired?: boolean;
  }> {
    const tokenHash = this.hashToken(token);

    // Find token in database
    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken) {
      return { valid: false };
    }

    // Check if token has expired
    const now = new Date();
    if (now > storedToken.expiresAt) {
      return { valid: false, expired: true };
    }

    return { valid: true, userId: storedToken.userId };
  }

  /**
   * Invalidate password reset token after use
   * @param token - Plain token to invalidate
   */
  async invalidatePasswordResetToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await prisma.passwordResetToken.deleteMany({
      where: { tokenHash },
    });
  }

  /**
   * Create email verification token for user
   * @param userId - User ID
   * @returns Token and expiration date
   */
  async createEmailVerificationToken(userId: string): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.EMAIL_VERIFICATION_EXPIRY_HOURS);

    // Store token hash in database
    await prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  /**
   * Validate email verification token
   * @param token - Plain token to validate
   * @returns Validation result with user ID if valid
   */
  async validateEmailVerificationToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    expired?: boolean;
  }> {
    const tokenHash = this.hashToken(token);

    // Find token in database
    const storedToken = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken) {
      return { valid: false };
    }

    // Check if token has expired
    const now = new Date();
    if (now > storedToken.expiresAt) {
      return { valid: false, expired: true };
    }

    return { valid: true, userId: storedToken.userId };
  }

  /**
   * Invalidate email verification token after use
   * @param token - Plain token to invalidate
   */
  async invalidateEmailVerificationToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await prisma.emailVerificationToken.deleteMany({
      where: { tokenHash },
    });
  }

  /**
   * Cleanup expired tokens from database
   * Should be run periodically (e.g., daily cron job)
   */
  async cleanupExpiredTokens(): Promise<{
    passwordResetTokensDeleted: number;
    emailVerificationTokensDeleted: number;
  }> {
    const now = new Date();

    const [passwordResetResult, emailVerificationResult] = await Promise.all([
      prisma.passwordResetToken.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      }),
      prisma.emailVerificationToken.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      }),
    ]);

    return {
      passwordResetTokensDeleted: passwordResetResult.count,
      emailVerificationTokensDeleted: emailVerificationResult.count,
    };
  }
}

// Singleton instance
let tokenServiceInstance: TokenService | null = null;

export function getTokenService(): TokenService {
  if (!tokenServiceInstance) {
    tokenServiceInstance = new TokenService();
  }
  return tokenServiceInstance;
}
