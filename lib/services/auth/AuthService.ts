import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import type { Session, RegisterInput, LoginInput, AuthResult } from './types';

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
  async login(input: LoginInput): Promise<AuthResult> {
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
}

// Экспорт singleton instance
export const authService = new AuthService();
