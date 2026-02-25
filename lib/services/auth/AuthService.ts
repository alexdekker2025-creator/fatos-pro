import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import type { Session, RegisterInput, LoginInput, AuthResult, TwoFactorRequiredResult, TwoFactorVerificationResult } from './types';

/**
 * Сервис аутентификации и авторизации
 * Обрабатывает регистрацию, вход, выход и верификацию сессий
 */
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly SESSION_DURATION_DAYS = 30;

  /**
   * Регистрация нового пользователя
   * @param input - Данные для регистрации (email, password, name)
   * @returns Созданный пользователь и сессия
   * @throws Error если email уже существует
   */
  async register(input: RegisterInput): Promise<AuthResult> {
    const { email, password, name } = input;

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Хеширование пароля
    const passwordHash = await this.hashPassword(password);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        preferredLang: 'ru', // По умолчанию русский
      },
    });

    // Отправка письма с подтверждением email
    try {
      await this.sendEmailVerification(user.id);
    } catch (error) {
      // Логируем ошибку, но не прерываем регистрацию
      console.error('Failed to send verification email:', error);
    }

    // Создание сессии
    const session = await this.createSession(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLang: user.preferredLang,
      },
      session,
    };
  }

  /**
   * Вход пользователя
   * @param input - Данные для входа (email, password)
   * @returns Пользователь и сессия
   * @throws Error если учётные данные неверны
   */
  async login(input: LoginInput): Promise<AuthResult | TwoFactorRequiredResult> {
    const { email, password } = input;

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Проверка пароля
    const isPasswordValid = await this.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Проверка блокировки аккаунта
    if (user.isBlocked) {
      throw new Error('Account is blocked. Please contact support.');
    }

    // Проверка 2FA
    if (user.twoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id,
      };
    }

    // Создание сессии
    const session = await this.createSession(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLang: user.preferredLang,
      },
      session,
    };
  }

  /**
   * Выход пользователя (удаление сессии)
   * @param sessionId - ID сессии для удаления
   */
  async logout(sessionId: string): Promise<void> {
    // В текущей реализации сессии хранятся в памяти
    // Для production нужно использовать Redis или БД
    // Здесь просто помечаем сессию как истёкшую
    this.invalidateSession(sessionId);
  }

  /**
   * Верификация сессии
   * @param sessionId - ID сессии для проверки
   * @returns Пользователь если сессия валидна, null если нет
   */
  async verifySession(sessionId: string): Promise<{
    id: string;
    email: string;
    name: string;
    preferredLang: string;
    isAdmin: boolean;
  } | null> {
    const session = await this.getSession(sessionId);

    if (!session) {
      return null;
    }

    // Проверка срока действия
    if (new Date() > session.expiresAt) {
      await this.invalidateSession(sessionId);
      return null;
    }

    // Получение пользователя
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferredLang: true,
        isAdmin: true,
      },
    });

    return user;
  }

  /**
   * Хеширование пароля с использованием bcrypt
   * @param password - Пароль в открытом виде
   * @returns Хешированный пароль
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Проверка пароля
   * @param password - Пароль в открытом виде
   * @param hash - Хешированный пароль
   * @returns true если пароль совпадает, false если нет
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Создание новой сессии
   * @param userId - ID пользователя
   * @returns Созданная сессия
   */
  private async createSession(userId: string): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.SESSION_DURATION_DAYS);

    // Сохранение сессии в БД
    const session = await prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Генерация уникального ID сессии
   * @returns Случайный ID сессии
   */
  private generateSessionId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36)
    );
  }

  // Методы для работы с сессиями в БД
  private async saveSession(session: Session): Promise<void> {
    // Сессия уже сохранена в createSession
  }

  private async getSession(sessionId: string): Promise<Session | null> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    
    if (!session) {
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    };
  }

  private async invalidateSession(sessionId: string): Promise<void> {
    await prisma.session.delete({
      where: { id: sessionId },
    }).catch(() => {
      // Игнорируем ошибку если сессия уже удалена
    });
  }

  /**
   * Send email verification to user
   * @param userId - User ID
   * @returns Success response
   * @throws Error if user not found or email already verified
   */
  async sendEmailVerification(userId: string): Promise<{ success: true }> {
    // Import services at runtime to avoid circular dependencies
    const { getTokenService } = await import('./TokenService');
    const { getEmailService } = await import('./EmailService');
    const tokenService = getTokenService();
    const emailService = getEmailService();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        preferredLang: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    // Generate email verification token
    const { token } = await tokenService.createEmailVerificationToken(user.id);

    // Send email verification email
    await emailService.sendEmailVerificationEmail(
      user.email,
      token,
      user.preferredLang as 'ru' | 'en'
    );

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        event: 'EMAIL_VERIFICATION_SENT',
        metadata: {
          email: user.email,
        },
      },
    });

    return { success: true };
  }

  /**
   * Verify user email with token
   * @param token - Email verification token
   * @returns Success response with user data
   * @throws Error if token is invalid or expired
   */
  async verifyEmail(token: string): Promise<{ success: true; user: { emailVerified: boolean } }> {
    // Import TokenService at runtime
    const { getTokenService } = await import('./TokenService');
    const tokenService = getTokenService();

    // Validate token
    const validation = await tokenService.validateEmailVerificationToken(token);

    if (!validation.valid) {
      if (validation.expired) {
        throw new Error('Email verification token has expired');
      }
      throw new Error('Invalid email verification token');
    }

    const userId = validation.userId!;

    // Update user email verification status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
      select: { emailVerified: true },
    });

    // Invalidate the email verification token
    await tokenService.invalidateEmailVerificationToken(token);

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId,
        event: 'EMAIL_VERIFIED',
        metadata: {
          verifiedAt: new Date().toISOString(),
        },
      },
    });

    return { success: true, user };
  }

  /**
   * Resend email verification with rate limiting
   * @param userId - User ID
   * @returns Success response with message
   * @throws Error if rate limit exceeded or email already verified
   */
  async resendEmailVerification(userId: string): Promise<{ success: true; message: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        preferredLang: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    // Check rate limiting: 3 requests per hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentVerificationAttempts = await prisma.securityLog.count({
      where: {
        userId: user.id,
        event: 'EMAIL_VERIFICATION_SENT',
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentVerificationAttempts >= 3) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Send email verification
    await this.sendEmailVerification(userId);

    return {
      success: true,
      message: 'Verification email has been sent. Please check your inbox.',
    };
  }

  /**
   * Request password reset for user
   * @param email - User email address
   * @returns Generic success message (prevents email enumeration)
   */
  async requestPasswordReset(email: string): Promise<{ success: true; message: string }> {
    // Import services at runtime to avoid circular dependencies
    const { getTokenService } = await import('./TokenService');
    const { getEmailService } = await import('./EmailService');
    const tokenService = getTokenService();
    const emailService = getEmailService();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        preferredLang: true,
      },
    });

    // Always return success to prevent email enumeration
    // If user doesn't exist, we still return success but don't send email
    if (user) {
      try {
        // Generate password reset token
        const { token } = await tokenService.createPasswordResetToken(user.id);

        // Send password reset email
        await emailService.sendPasswordResetEmail(
          user.email,
          token,
          user.preferredLang as 'ru' | 'en'
        );

        // Log security event
        await prisma.securityLog.create({
          data: {
            userId: user.id,
            event: 'PASSWORD_RESET_REQUESTED',
            metadata: {
              email: user.email,
            },
          },
        });
      } catch (error) {
        // Log error but still return success to prevent enumeration
        console.error('Error sending password reset email:', error);
      }
    }

    // Generic success message (same for existing and non-existing emails)
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  /**
   * Confirm password reset with token and new password
   * @param token - Password reset token
   * @param newPassword - New password (must be at least 8 characters)
   * @param currentSessionId - Optional current session ID to preserve
   * @returns Success response
   * @throws Error if token is invalid, expired, or password doesn't meet requirements
   */
  async confirmPasswordReset(
    token: string,
    newPassword: string,
    currentSessionId?: string
  ): Promise<{ success: true }> {
    // Validate password length
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Import TokenService at runtime
    const { getTokenService } = await import('./TokenService');
    const tokenService = getTokenService();

    // Validate token
    const validation = await tokenService.validatePasswordResetToken(token);

    if (!validation.valid) {
      if (validation.expired) {
        throw new Error('Password reset token has expired');
      }
      throw new Error('Invalid password reset token');
    }

    const userId = validation.userId!;

    // Hash new password
    const passwordHash = await this.hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate all user sessions except current
    await prisma.session.deleteMany({
      where: {
        userId,
        ...(currentSessionId ? { id: { not: currentSessionId } } : {}),
      },
    });

    // Invalidate the password reset token
    await tokenService.invalidatePasswordResetToken(token);

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId,
        event: 'PASSWORD_RESET_COMPLETED',
        metadata: {
          sessionsInvalidated: true,
        },
      },
    });

    return { success: true };
  }

  /**
   * Setup 2FA for user - generates TOTP secret, QR code, and backup codes
   * @param userId - User ID
   * @returns TOTP secret, QR code data URL, and backup codes
   * @throws Error if user not found or 2FA already enabled
   */
  async setup2FA(userId: string): Promise<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  }> {
    // Import TwoFactorService at runtime
    const { getTwoFactorService } = await import('./TwoFactorService');
    const twoFactorService = getTwoFactorService();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled');
    }

    // Generate TOTP secret
    const secret = twoFactorService.generateSecret();

    // Generate QR code
    const qrCode = await twoFactorService.generateQRCode(secret, user.email);

    // Generate backup codes (but don't store yet - waiting for confirmation)
    const backupCodes = twoFactorService.generateBackupCodes();

    // Store the secret and backup codes temporarily in a pending state
    // We'll use a temporary storage mechanism or store with a pending flag
    // For now, we'll store in a session-like temporary storage
    // In production, this could be Redis or a temporary database table

    // Store temporarily (this is a simplified approach - in production use Redis)
    // We'll store the secret and backup codes in memory or a temp table
    // For this implementation, we'll return them and expect confirm2FA to be called

    return {
      secret,
      qrCode,
      backupCodes,
    };
  }

  /**
   * Confirm 2FA setup by validating TOTP code and enabling 2FA
   * @param userId - User ID
   * @param code - 6-digit TOTP code
   * @param secret - TOTP secret from setup2FA
   * @param backupCodes - Backup codes from setup2FA
   * @returns Success response with enabled status
   * @throws Error if code is invalid or user not found
   */
  async confirm2FA(
    userId: string,
    code: string,
    secret: string,
    backupCodes: string[]
  ): Promise<{ success: true; enabled: boolean }> {
    // Import TwoFactorService at runtime
    const { getTwoFactorService } = await import('./TwoFactorService');
    const twoFactorService = getTwoFactorService();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled');
    }

    // Verify TOTP code
    const isValid = twoFactorService.verifyTOTP(secret, code);

    if (!isValid) {
      throw new Error('Invalid two-factor authentication code');
    }

    // Hash backup codes for storage
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => twoFactorService.hashBackupCode(code))
    );

    // Encrypt TOTP secret
    const { getEncryptionService } = await import('./EncryptionService');
    const encryptionService = getEncryptionService();
    const secretEncrypted = encryptionService.encrypt(secret);

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

    // Invalidate ALL sessions when 2FA is enabled (security requirement 18.1)
    await prisma.session.deleteMany({
      where: { userId },
    });

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId,
        event: '2FA_ENABLED',
        metadata: {
          enabledAt: new Date().toISOString(),
          sessionsInvalidated: true,
        },
      },
    });

    return { success: true, enabled: true };
  }

  /**
   * Verify 2FA code during login and create session
   * @param userId - User ID
   * @param code - 6-digit TOTP code or backup code
   * @returns Success response with session
   * @throws Error if code is invalid or user not found
   */
  async verify2FALogin(
    userId: string,
    code: string
  ): Promise<TwoFactorVerificationResult> {
    // Import TwoFactorService at runtime
    const { getTwoFactorService } = await import('./TwoFactorService');
    const twoFactorService = getTwoFactorService();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferredLang: true,
        twoFactorEnabled: true,
        isBlocked: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isBlocked) {
      throw new Error('Account is blocked. Please contact support.');
    }

    if (!user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is not enabled for this user');
    }

    // Verify 2FA code (TOTP or backup code)
    const verificationResult = await twoFactorService.verify2FACode(userId, code);

    if (!verificationResult.valid) {
      throw new Error('Invalid two-factor authentication code');
    }

    // Log backup code usage if applicable
    if (verificationResult.isBackupCode) {
      await prisma.securityLog.create({
        data: {
          userId,
          event: '2FA_BACKUP_CODE_USED',
          metadata: {
            usedAt: new Date().toISOString(),
          },
        },
      });
    }

    // Create session after successful 2FA verification
    const session = await this.createSession(userId);

    return {
      success: true,
      session,
    };
  }

  /**
   * Disable 2FA for user with password confirmation
   * @param userId - User ID
   * @param password - User's password for confirmation
   * @returns Success response
   * @throws Error if password is invalid or user not found
   */
  async disable2FA(userId: string, password: string): Promise<{ success: true }> {
    // Import TwoFactorService at runtime
    const { getTwoFactorService } = await import('./TwoFactorService');
    const twoFactorService = getTwoFactorService();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is not enabled');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Disable 2FA (deletes TOTP secret and backup codes)
    await twoFactorService.disable2FA(userId);

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId,
        event: '2FA_DISABLED',
        metadata: {
          disabledAt: new Date().toISOString(),
        },
      },
    });

    return { success: true };
  }

  /**
   * Regenerate backup codes for user
   * @param userId - User ID
   * @param code - TOTP code or existing backup code for verification
   * @returns New backup codes
   * @throws Error if code is invalid or user not found
   */
  async regenerateBackupCodes(userId: string, code: string): Promise<{ backupCodes: string[] }> {
    // Import TwoFactorService at runtime
    const { getTwoFactorService } = await import('./TwoFactorService');
    const twoFactorService = getTwoFactorService();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is not enabled');
    }

    // Verify TOTP code or backup code
    const verificationResult = await twoFactorService.verify2FACode(userId, code);

    if (!verificationResult.valid) {
      throw new Error('Invalid two-factor authentication code');
    }

    // Regenerate backup codes (invalidates old ones)
    const backupCodes = await twoFactorService.regenerateBackupCodes(userId);

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId,
        event: '2FA_BACKUP_CODES_REGENERATED',
        metadata: {
          regeneratedAt: new Date().toISOString(),
        },
      },
    });

    return { backupCodes };
  }

  /**
   * Initiate OAuth login flow
   * Generates state parameter and returns redirect URL
   * @param provider - OAuth provider ('google' | 'facebook')
   * @returns Redirect URL and state parameter
   */
  async initiateOAuthLogin(
    provider: 'google' | 'facebook'
  ): Promise<{ redirectUrl: string; state: string }> {
    // Import OAuthService at runtime
    const { getOAuthService } = await import('./OAuthService');
    const oauthService = getOAuthService();

    // Generate cryptographically secure state parameter (32 bytes)
    const crypto = await import('crypto');
    const state = crypto.randomBytes(32).toString('base64url');

    // Get authorization URL from OAuthService
    const redirectUrl = oauthService.getAuthorizationURL(provider, state);

    return {
      redirectUrl,
      state,
    };
  }

  /**
   * Handle OAuth callback after user authorizes
   * Exchanges code for tokens, creates or links account, creates session
   * @param provider - OAuth provider ('google' | 'facebook')
   * @param code - Authorization code from provider
   * @param state - State parameter from callback
   * @param expectedState - Expected state parameter from initiation
   * @returns User and session
   * @throws Error if state mismatch or OAuth flow fails
   */
  async handleOAuthCallback(
    provider: 'google' | 'facebook',
    code: string,
    state: string,
    expectedState: string,
    currentUrl: URL
  ): Promise<AuthResult> {
    // Verify state parameter to prevent CSRF attacks
    if (state !== expectedState) {
      throw new Error('Invalid OAuth state parameter');
    }

    // Import OAuthService at runtime
    const { getOAuthService } = await import('./OAuthService');
    const oauthService = getOAuthService();

    // Exchange authorization code for tokens
    const tokens = await oauthService.exchangeCodeForTokens(provider, code, state, currentUrl);

    // Get user profile from provider
    const profile = await oauthService.getUserProfile(provider, tokens.accessToken);

    // Create or link OAuth account
    const { userId, isNewUser } = await this.createOrLinkOAuthAccount(
      provider,
      profile.id,
      profile.email,
      profile.name,
      tokens
    );

    // Create session after successful OAuth login
    const session = await this.createSession(userId);

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferredLang: true,
      },
    });

    if (!user) {
      throw new Error('User not found after OAuth login');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLang: user.preferredLang,
      },
      session,
    };
  }

  /**
   * Create new user or link OAuth account to existing user
   * @param provider - OAuth provider name
   * @param providerUserId - User ID from OAuth provider
   * @param email - User email from provider
   * @param name - User name from provider
   * @param tokens - Access and refresh tokens
   * @returns User ID and whether user is new
   */
  async createOrLinkOAuthAccount(
    provider: string,
    providerUserId: string,
    email: string,
    name: string,
    tokens: { accessToken: string; refreshToken?: string }
  ): Promise<{ userId: string; isNewUser: boolean }> {
    // Import OAuthService at runtime
    const { getOAuthService } = await import('./OAuthService');
    const oauthService = getOAuthService();

    // Check if OAuth account already exists (by provider + providerUserId)
    const existingOAuth = await prisma.oAuthProvider.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      include: {
        user: true,
      },
    });

    // If OAuth account exists, return existing user
    if (existingOAuth) {
      // Update tokens
      await oauthService.linkOAuthAccount(
        existingOAuth.userId,
        provider,
        providerUserId,
        tokens
      );

      return {
        userId: existingOAuth.userId,
        isNewUser: false,
      };
    }

    // Check if email matches existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let userId: string;
    let isNewUser: boolean;

    if (existingUser) {
      // Link OAuth to existing user
      userId = existingUser.id;
      isNewUser = false;
    } else {
      // Create new user with emailVerified=true
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: '', // No password for OAuth-only accounts
          emailVerified: true, // OAuth accounts are automatically verified
          preferredLang: 'ru', // Default language
        },
      });

      userId = newUser.id;
      isNewUser = true;
    }

    // Store encrypted tokens using OAuthService
    await oauthService.linkOAuthAccount(userId, provider, providerUserId, tokens);

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId,
        event: 'OAUTH_LINKED',
        metadata: {
          provider,
          providerUserId,
          isNewUser,
          linkedAt: new Date().toISOString(),
        },
      },
    });

    return {
      userId,
      isNewUser,
    };
  }


    /**
     * Link OAuth provider to authenticated user
     * Validates user is authenticated, exchanges OAuth code for tokens,
     * checks for duplicate links, and logs security event
     */
    async linkOAuthProvider(
      userId: string,
      provider: 'google' | 'facebook',
      code: string
    ): Promise<{ success: true; linkedProviders: string[] }> {
      // Import OAuthService at runtime
      const { getOAuthService } = await import('./OAuthService');
      const oauthService = getOAuthService();

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          oauthProviders: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Exchange OAuth code for tokens
      const tokens = await oauthService.exchangeCodeForTokens(provider, code);

      // Get user profile from provider
      const profile = await oauthService.getUserProfile(provider, tokens.accessToken);

      // Check if this OAuth account is already linked to another user
      const existingOAuth = await prisma.oAuthProvider.findUnique({
        where: {
          provider_providerUserId: {
            provider,
            providerUserId: profile.id,
          },
        },
      });

      if (existingOAuth && existingOAuth.userId !== userId) {
        throw new Error(`This ${provider} account is already linked to another user`);
      }

      // Link OAuth account to current user
      await oauthService.linkOAuthAccount(userId, provider, profile.id, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      // Log security event
      await prisma.securityLog.create({
        data: {
          userId,
          event: 'OAUTH_LINKED',
          metadata: {
            provider,
            providerUserId: profile.id,
            linkedAt: new Date().toISOString(),
          },
        },
      });

      // Get updated list of linked providers
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          oauthProviders: true,
        },
      });

      const linkedProviders = updatedUser?.oauthProviders.map((p) => p.provider) || [];

      return {
        success: true,
        linkedProviders,
      };
    }

    /**
     * Unlink OAuth provider from authenticated user
     * Requires password confirmation if no other auth method available
     * Ensures user has at least one way to authenticate
     */
    async unlinkOAuthProvider(
      userId: string,
      provider: string,
      password?: string
    ): Promise<{ success: true }> {
      // Import OAuthService at runtime
      const { getOAuthService } = await import('./OAuthService');
      const oauthService = getOAuthService();

      // Verify user exists and get auth methods
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          oauthProviders: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has password
      const hasPassword = user.passwordHash && user.passwordHash.length > 0;

      // Check if user has other OAuth providers
      const otherProviders = user.oauthProviders.filter((p) => p.provider !== provider);
      const hasOtherProvider = otherProviders.length > 0;

      // If no password and no other provider, require password confirmation
      if (!hasPassword && !hasOtherProvider) {
        if (!password) {
          throw new Error(
            'Cannot unlink the only authentication method. Please set a password first or link another provider.'
          );
        }

        // This shouldn't happen (no password but password provided), but handle it
        throw new Error('No password set on account. Please set a password first.');
      }

      // If user has password but no other provider, require password confirmation
      if (hasPassword && !hasOtherProvider) {
        if (!password) {
          throw new Error('Password confirmation required to unlink the only OAuth provider.');
        }

        // Verify password
        const isValidPassword = await this.verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }
      }

      // Delete OAuth provider record
      await oauthService.unlinkOAuthAccount(userId, provider);

      // Log security event
      await prisma.securityLog.create({
        data: {
          userId,
          event: 'OAUTH_UNLINKED',
          metadata: {
            provider,
            unlinkedAt: new Date().toISOString(),
          },
        },
      });

      return {
        success: true,
      };
    }


}

// Экспорт singleton instance
export const authService = new AuthService();
