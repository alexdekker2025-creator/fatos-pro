/**
 * Интеграционный тест для регистрации и аутентификации
 * 
 * Валидирует: Требования 9, 20
 * 
 * Поток:
 * 1. Пользователь регистрируется с email/password
 * 2. Пароль хешируется
 * 3. Пользователь может войти в систему
 * 4. Создается сессия
 * 5. Пользователь может получить доступ к защищенным ресурсам
 * 6. Пользователь может выйти из системы
 */

import { AuthService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Мокируем Prisma и bcrypt
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');

describe('Integration: Authentication Flow', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe('Полный поток регистрации и входа', () => {
    it('должен зарегистрировать пользователя, войти и получить доступ к ресурсам', async () => {
      const email = 'test@example.com';
      const password = 'SecurePassword123';
      const name = 'Test User';
      const hashedPassword = '$2b$10$hashedpassword';

      // Шаг 1: Регистрация пользователя
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // Email не существует
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email,
        name,
        passwordHash: hashedPassword,
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register({ email, password, name });

      // Проверка регистрации
      expect(result).toBeDefined();
      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe(email);
      expect(result.user.name).toBe(name);
      expect(result.session).toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
          preferredLang: 'ru',
        },
      });

      // Шаг 2: Вход в систему
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email,
        name,
        passwordHash: hashedPassword,
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email, password });

      // Проверка сессии
      expect(result).toBeDefined();
      expect(result.session.id).toBeDefined();
      expect(result.session.userId).toBe('user-123');
      expect(result.session.expiresAt).toBeInstanceOf(Date);
      expect(result.session.expiresAt.getTime()).toBeGreaterThan(Date.now());

      // Шаг 3: Верификация сессии для доступа к защищенным ресурсам
      const verifiedUser = await authService.verifySession(result.session.id);

      expect(verifiedUser).toBeDefined();
      expect(verifiedUser?.id).toBe('user-123');
      expect(verifiedUser?.email).toBe(email);

      // Шаг 4: Выход из системы
      await authService.logout(result.session.id);

      // Проверка, что сессия больше не действительна
      const verifiedAfterLogout = await authService.verifySession(result.session.id);
      expect(verifiedAfterLogout).toBeNull();
    });

    it('должен отклонить регистрацию с существующим email', async () => {
      const email = 'existing@example.com';
      const password = 'Password123';
      const name = 'Test User';

      // Email уже существует
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email,
        name: 'Existing User',
        passwordHash: 'hash',
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register({ email, password, name })).rejects.toThrow(
        'User with this email already exists'
      );

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('должен отклонить вход с неверным паролем', async () => {
      const email = 'test@example.com';
      const password = 'WrongPassword';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email,
        name: 'Test User',
        passwordHash: '$2b$10$hashedpassword',
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login({ email, password })).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('должен отклонить вход с несуществующим email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'Password123';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login({ email, password })).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });

  describe('Безопасность паролей', () => {
    it('должен хешировать пароль при регистрации', async () => {
      const email = 'secure@example.com';
      const password = 'MySecurePassword123';
      const name = 'Secure User';
      const hashedPassword = '$2b$10$securehashedpassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-secure',
        email,
        name,
        passwordHash: hashedPassword,
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await authService.register({ email, password, name });

      // Проверка, что пароль был хеширован
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      
      // Проверка, что в БД сохранен хеш, а не оригинальный пароль
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
          preferredLang: 'ru',
        },
      });

      // Убедимся, что оригинальный пароль не сохранен
      const createCall = (prisma.user.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.passwordHash).not.toBe(password);
      expect(createCall.data.passwordHash).toBe(hashedPassword);
    });

    it('должен верифицировать пароль при входе', async () => {
      const email = 'verify@example.com';
      const password = 'CorrectPassword123';
      const hashedPassword = '$2b$10$hashedpassword';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-verify',
        email,
        name: 'Verify User',
        passwordHash: hashedPassword,
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await authService.login({ email, password });

      // Проверка, что пароль был верифицирован
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('должен отклонить короткий пароль', async () => {
      const email = 'short@example.com';
      const shortPassword = '123'; // Менее 8 символов
      const name = 'Short User';

      await expect(authService.register({ email, shortPassword, name })).rejects.toThrow();
    });
  });

  describe('Управление сессиями', () => {
    it('должен создать сессию с временем истечения', async () => {
      const email = 'session@example.com';
      const password = 'SessionPassword123';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-session',
        email,
        name: 'Session User',
        passwordHash: '$2b$10$hashedpassword',
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email, password });

      expect(result.session.id).toBeDefined();
      expect(result.session.userId).toBe('user-session');
      expect(result.session.expiresAt).toBeInstanceOf(Date);

      // Проверка, что сессия истекает в будущем (например, через 30 дней)
      const now = Date.now();
      const expiresAt = result.session.expiresAt.getTime();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      expect(expiresAt).toBeGreaterThan(now);
      expect(expiresAt).toBeLessThanOrEqual(now + thirtyDaysInMs + 1000); // +1s для погрешности
    });

    it('должен отклонить истекшую сессию', async () => {
      const expiredSessionId = 'expired-session-123';

      // Создаем истекшую сессию
      const expiredSession = {
        id: expiredSessionId,
        userId: 'user-123',
        expiresAt: new Date(Date.now() - 1000), // Истекла 1 секунду назад
      };

      // Мокируем внутреннее хранилище сессий
      (authService as any).sessions.set(expiredSessionId, expiredSession);

      const verifiedUser = await authService.verifySession(expiredSessionId);

      expect(verifiedUser).toBeNull();
    });

    it('должен удалить сессию при выходе', async () => {
      const email = 'logout@example.com';
      const password = 'LogoutPassword123';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-logout',
        email,
        name: 'Logout User',
        passwordHash: '$2b$10$hashedpassword',
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email, password });
      
      // Проверка, что сессия существует
      let verifiedUser = await authService.verifySession(result.session.id);
      expect(verifiedUser).toBeDefined();

      // Выход из системы
      await authService.logout(result.session.id);

      // Проверка, что сессия удалена
      verifiedUser = await authService.verifySession(result.session.id);
      expect(verifiedUser).toBeNull();
    });
  });

  describe('Уникальность email', () => {
    it('должен обеспечить уникальность email при регистрации', async () => {
      const email = 'unique@example.com';
      const password = 'Password123';
      const name1 = 'User One';
      const name2 = 'User Two';

      // Первая регистрация успешна
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hash1');
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: 'user-1',
        email,
        name: name1,
        passwordHash: '$2b$10$hash1',
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user1 = await authService.register({ email, password, name: name1 });
      expect(user1.user.id).toBe('user-1');

      // Вторая регистрация с тем же email должна быть отклонена
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'user-1',
        email,
        name: name1,
        passwordHash: '$2b$10$hash1',
        preferredLang: 'ru',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register({ email, password, name: name2 })).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });
});
