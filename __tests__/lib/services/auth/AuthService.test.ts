import { AuthService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
    // Clear all sessions
    (authService as any).sessions.clear();
  });

  describe('hashPassword', () => {
    it('should hash password', async () => {
      const password = 'testpassword123';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testpassword123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword123';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
        preferredLang: 'ru',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.session).toBeDefined();
      expect(result.session.userId).toBe('user-123');
    });

    it('should throw error if email already exists', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Existing User',
        passwordHash: 'hashed',
        preferredLang: 'ru',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: hash,
        preferredLang: 'ru',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.session).toBeDefined();
      expect(result.session.userId).toBe('user-123');
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password is incorrect', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: hash,
        preferredLang: 'ru',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('verifySession', () => {
    it('should verify valid session', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
        preferredLang: 'ru',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // for register check
        .mockResolvedValueOnce(mockUser) // for register create
        .mockResolvedValueOnce(mockUser); // for verifySession

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const { session } = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const user = await authService.verifySession(session.id);

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null for invalid session', async () => {
      const user = await authService.verifySession('invalid-session-id');

      expect(user).toBeNull();
    });

    it('should return null for expired session', async () => {
      // Create a session manually with expired date
      const expiredSession = {
        id: 'expired-session-id',
        userId: 'user-123',
        expiresAt: new Date(Date.now() - 1000), // Already expired
      };

      // Manually add expired session to the service
      (authService as any).sessions.set(expiredSession.id, expiredSession);

      const user = await authService.verifySession(expiredSession.id);

      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      // Manually create a session
      const session = {
        id: 'test-session-id',
        userId: 'user-456',
        expiresAt: new Date(Date.now() + 86400000), // 1 day from now
      };

      const mockUser = {
        id: 'user-456',
        email: 'logout@example.com',
        name: 'Logout User',
        passwordHash: 'hashed',
        preferredLang: 'ru',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add session manually
      (authService as any).sessions.set(session.id, session);

      // Reset and mock user lookup for verifySession
      (prisma.user.findUnique as jest.Mock).mockReset();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Verify session exists before logout
      let user = await authService.verifySession(session.id);
      expect(user).toBeDefined();
      expect(user?.email).toBe('logout@example.com');

      // Logout
      await authService.logout(session.id);

      // Verify session is invalidated after logout
      // After logout, the session is removed from the Map, so verifySession returns null immediately
      user = await authService.verifySession(session.id);
      expect(user).toBeNull();
    });
  });
});
