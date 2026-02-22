import { Resend } from 'resend';

/**
 * EmailService - Handles transactional email sending via Resend
 * Includes retry logic and bilingual templates
 */
export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private maxRetries = 3;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.EMAIL_FROM || 'FATOS.pro <noreply@fatos.pro>';
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
  }

  /**
   * Send email with retry logic
   */
  private async sendWithRetry(
    to: string,
    subject: string,
    html: string,
    attempt: number = 1
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`Email send attempt ${attempt} failed:`, error);

      if (attempt < this.maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.sendWithRetry(to, subject, html, attempt + 1);
      }

      throw new Error(`Failed to send email after ${this.maxRetries} attempts`);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    token: string,
    language: 'ru' | 'en' = 'ru'
  ): Promise<void> {
    const resetUrl = `${this.baseUrl}/${language}/auth/reset-password?token=${token}`;

    const subject = language === 'ru' 
      ? '🔐 Восстановление пароля - FATOS.pro'
      : '🔐 Password Reset - FATOS.pro';

    const html = language === 'ru' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Восстановление пароля</p>
          </div>
          <div class="content">
            <p>Здравствуйте!</p>
            <p>Вы запросили восстановление пароля для вашего аккаунта на FATOS.pro.</p>
            <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
            <center>
              <a href="${resetUrl}" class="button">Восстановить пароль</a>
            </center>
            <p>Или скопируйте эту ссылку в браузер:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p><strong>Важно:</strong> Ссылка действительна в течение 1 часа.</p>
            <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Нумерология и самопознание</p>
            <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Password Reset</p>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>You requested a password reset for your FATOS.pro account.</p>
            <p>Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy this link to your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p><strong>Important:</strong> This link is valid for 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Numerology and Self-Discovery</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendWithRetry(to, subject, html);
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(
    to: string,
    token: string,
    language: 'ru' | 'en' = 'ru'
  ): Promise<void> {
    const verifyUrl = `${this.baseUrl}/${language}/auth/verify-email?token=${token}`;

    const subject = language === 'ru'
      ? '✉️ Подтверждение email - FATOS.pro'
      : '✉️ Email Verification - FATOS.pro';

    const html = language === 'ru' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Добро пожаловать!</p>
          </div>
          <div class="content">
            <p>Здравствуйте!</p>
            <p>Спасибо за регистрацию на FATOS.pro!</p>
            <p>Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
            <center>
              <a href="${verifyUrl}" class="button">Подтвердить email</a>
            </center>
            <p>Или скопируйте эту ссылку в браузер:</p>
            <p style="word-break: break-all; color: #667eea;">${verifyUrl}</p>
            <p><strong>Важно:</strong> Ссылка действительна в течение 24 часов.</p>
            <p>После подтверждения вы получите полный доступ ко всем функциям платформы.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Нумерология и самопознание</p>
            <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Welcome!</p>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>Thank you for registering at FATOS.pro!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <center>
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </center>
            <p>Or copy this link to your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verifyUrl}</p>
            <p><strong>Important:</strong> This link is valid for 24 hours.</p>
            <p>After verification, you'll have full access to all platform features.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Numerology and Self-Discovery</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendWithRetry(to, subject, html);
  }

  /**
   * Send 2FA enabled notification
   */
  async send2FAEnabledEmail(
    to: string,
    language: 'ru' | 'en' = 'ru'
  ): Promise<void> {
    const subject = language === 'ru'
      ? '🔒 Двухфакторная аутентификация включена - FATOS.pro'
      : '🔒 Two-Factor Authentication Enabled - FATOS.pro';

    const html = language === 'ru' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Безопасность аккаунта</p>
          </div>
          <div class="content">
            <p>Здравствуйте!</p>
            <p>Двухфакторная аутентификация (2FA) была успешно включена для вашего аккаунта.</p>
            <p>Теперь при входе вам потребуется вводить код из приложения-аутентификатора.</p>
            <p><strong>Важно:</strong> Сохраните резервные коды в безопасном месте. Они понадобятся, если вы потеряете доступ к приложению-аутентификатору.</p>
            <p>Если вы не включали 2FA, немедленно свяжитесь с нами.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Нумерология и самопознание</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Account Security</p>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>Two-factor authentication (2FA) has been successfully enabled for your account.</p>
            <p>From now on, you'll need to enter a code from your authenticator app when logging in.</p>
            <p><strong>Important:</strong> Save your backup codes in a safe place. You'll need them if you lose access to your authenticator app.</p>
            <p>If you didn't enable 2FA, please contact us immediately.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Numerology and Self-Discovery</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendWithRetry(to, subject, html);
  }

  /**
   * Send 2FA disabled notification
   */
  async send2FADisabledEmail(
    to: string,
    language: 'ru' | 'en' = 'ru'
  ): Promise<void> {
    const subject = language === 'ru'
      ? '🔓 Двухфакторная аутентификация отключена - FATOS.pro'
      : '🔓 Two-Factor Authentication Disabled - FATOS.pro';

    const html = language === 'ru' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Безопасность аккаунта</p>
          </div>
          <div class="content">
            <p>Здравствуйте!</p>
            <p>Двухфакторная аутентификация (2FA) была отключена для вашего аккаунта.</p>
            <p>Теперь для входа потребуется только email и пароль.</p>
            <p>Если вы не отключали 2FA, немедленно свяжитесь с нами.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Нумерология и самопознание</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 FATOS.pro</h1>
            <p>Account Security</p>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>Two-factor authentication (2FA) has been disabled for your account.</p>
            <p>You'll now only need your email and password to log in.</p>
            <p>If you didn't disable 2FA, please contact us immediately.</p>
          </div>
          <div class="footer">
            <p>© 2024 FATOS.pro - Numerology and Self-Discovery</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendWithRetry(to, subject, html);
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
}
