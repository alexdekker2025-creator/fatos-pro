import { AuthService } from '../AuthService';
import { prisma } from '@/lib/prisma';
import { getOAuthService } from '../OAuthService';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    oAuthProvider: {
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
    securityLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../OAuthService', () => ({
  getOAuthService: jest.fn(),
}));

describe('AuthService - OAuth Methods', () => {
  let authService: AuthService;
  let mockOAuthService: any;

  beforeEach(() => {
    authService = new AuthService();
    mockOAuthService = {
      getAuthorizationURL: jest.fn(),
      exchangeCodeForTokens: jest.fn(),
      getUserProfile: jest.fn(),
      linkOAuthAccount: jest.fn(),
    };
    (getOAuthService as jest.Mock).mockReturnValue(mockOAuthService);
    jest.clearAllMocks();
  });

  describe('initiateOAuthLogin', () => {
    it('should generate state parameter and return redirect URL', async () => {
      const provider = 'google';
      const mockRedirectUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...';
      mockOAuthService.getAuthorizationURL.mockReturnValue(mockRedirectUrl);

      const result = await authService.initiateOAuthLogin(provider);

      expect(result).toHaveProperty('redirectUrl', mockRedirectUrl);
      expect(result).toHaveProperty('state');
      expect(result.state).toHaveLength(43); // base64url encoded 32 bytes
      expect(mockOAuthService.getAuthorizationURL).toHaveBeenCalledWith(provider, result.state);
    });

    it('should work with Facebook provider', async () => {
      const provider = 'facebook';
      const mockRedirectUrl = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=...';
      mockOAuthService.getAuthorizationURL.mockReturnValue(mockRedirectUrl);

      const result = await authService.initiateOAuthLogin(provider);

      expect(result).toHaveProperty('redirectUrl', mockRedirectUrl);
      expect(result).toHaveProperty('state');
      expect(mockOAuthService.getAuthorizationURL).toHaveBeenCalledWith(provider, result.state);
    });

    it('should generate unique state parameters', async () => {
      mockOAuthService.getAuthorizationURL.mockReturnValue('https://example.com');

      const result1 = await authService.initiateOAuthLogin('google');
      const result2 = await authService.initiateOAuthLogin('google');

      expect(result1.state).not.toBe(result2.state);
    });
  });

  describe('handleOAuthCallback', () => {
    const mockTokens = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresIn: 3600,
    };

    const mockProfile = {
      id: 'google_user_123',
      email: 'user@example.com',
      name: 'Test User',
      emailVerified: true,
    };

    const mockUser = {
      id: 'user_123',
      email: 'user@example.com',
      name: 'Test User',
      preferredLang: 'ru',
    };

    const mockSession = {
      id: 'session_123',
      userId: 'user_123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    beforeEach(() => {
      mockOAuthService.exchangeCodeForTokens.mockResolvedValue(mockTokens);
      mockOAuthService.getUserProfile.mockResolvedValue(mockProfile);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);
    });

    it('should throw error if state parameter does not match', async () => {
      await expect(
        authService.handleOAuthCallback('google', 'code123', 'state1', 'state2')
      ).rejects.toThrow('Invalid OAuth state parameter');
    });

    it('should exchange code for tokens and create session for new user', async () => {
      const code = 'auth_code_123';
      const state = 'valid_state';
      
      // Mock new user creation
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // No existing user with email
        .mockResolvedValueOnce(mockUser); // Return user after creation
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.handleOAuthCallback('google', code, state, state);

      expect(mockOAuthService.exchangeCodeForTokens).toHaveBeenCalledWith('google', code);
      expect(mockOAuthService.getUserProfile).toHaveBeenCalledWith('google', mockTokens.accessToken);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect(result.user.email).toBe(mockProfile.email);
    });

    it('should link OAuth account to existing user with matching email', async () => {
      const code = 'auth_code_123';
      const state = 'valid_state';
      
      // Mock existing user with matching email
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.handleOAuthCallback('google', code, state, state);

      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalledWith(
        mockUser.id,
        'google',
        mockProfile.id,
        mockTokens
      );
      expect(result.user.id).toBe(mockUser.id);
    });

    it('should return existing user if OAuth account already linked', async () => {
      const code = 'auth_code_123';
      const state = 'valid_state';
      
      // Mock existing OAuth account
      const existingOAuth = {
        userId: mockUser.id,
        provider: 'google',
        providerUserId: mockProfile.id,
        user: mockUser,
      };
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(existingOAuth);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.handleOAuthCallback('google', code, state, state);

      expect(result.user.id).toBe(mockUser.id);
      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalled();
    });
  });

  describe('createOrLinkOAuthAccount', () => {
    const mockTokens = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
    };

    it('should create new user when no existing user or OAuth account', async () => {
      const newUser = {
        id: 'new_user_123',
        email: 'newuser@example.com',
        name: 'New User',
        passwordHash: '',
        emailVerified: true,
        preferredLang: 'ru',
      };

      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      const result = await authService.createOrLinkOAuthAccount(
        'google',
        'google_user_123',
        'newuser@example.com',
        'New User',
        mockTokens
      );

      expect(result.userId).toBe(newUser.id);
      expect(result.isNewUser).toBe(true);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          name: 'New User',
          passwordHash: '',
          emailVerified: true,
          preferredLang: 'ru',
        },
      });
      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalled();
      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId: newUser.id,
          event: 'OAUTH_LINKED',
          metadata: expect.objectContaining({
            provider: 'google',
            isNewUser: true,
          }),
        },
      });
    });

    it('should link OAuth to existing user with matching email', async () => {
      const existingUser = {
        id: 'existing_user_123',
        email: 'existing@example.com',
        name: 'Existing User',
      };

      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      const result = await authService.createOrLinkOAuthAccount(
        'facebook',
        'fb_user_456',
        'existing@example.com',
        'Existing User',
        mockTokens
      );

      expect(result.userId).toBe(existingUser.id);
      expect(result.isNewUser).toBe(false);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalledWith(
        existingUser.id,
        'facebook',
        'fb_user_456',
        mockTokens
      );
    });

    it('should return existing user if OAuth account already exists', async () => {
      const existingOAuth = {
        userId: 'user_123',
        provider: 'google',
        providerUserId: 'google_user_123',
        user: {
          id: 'user_123',
          email: 'user@example.com',
        },
      };

      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(existingOAuth);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      const result = await authService.createOrLinkOAuthAccount(
        'google',
        'google_user_123',
        'user@example.com',
        'User',
        mockTokens
      );

      expect(result.userId).toBe(existingOAuth.userId);
      expect(result.isNewUser).toBe(false);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalled();
    });

    it('should set emailVerified to true for new OAuth users', async () => {
      const newUser = {
        id: 'new_user_123',
        email: 'newuser@example.com',
        name: 'New User',
        passwordHash: '',
        emailVerified: true,
        preferredLang: 'ru',
      };

      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      await authService.createOrLinkOAuthAccount(
        'google',
        'google_user_123',
        'newuser@example.com',
        'New User',
        mockTokens
      );

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          emailVerified: true,
        }),
      });
    });

    it('should log OAUTH_LINKED security event', async () => {
      const newUser = {
        id: 'new_user_123',
        email: 'newuser@example.com',
        name: 'New User',
        passwordHash: '',
        emailVerified: true,
        preferredLang: 'ru',
      };

      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      await authService.createOrLinkOAuthAccount(
        'google',
        'google_user_123',
        'newuser@example.com',
        'New User',
        mockTokens
      );

      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId: newUser.id,
          event: 'OAUTH_LINKED',
          metadata: expect.objectContaining({
            provider: 'google',
            providerUserId: 'google_user_123',
            isNewUser: true,
          }),
        },
      });
    });
  });

  describe('linkOAuthProvider', () => {
    const mockTokens = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresIn: 3600,
    };

    const mockProfile = {
      id: 'google_user_123',
      email: 'user@example.com',
      name: 'Test User',
      emailVerified: true,
    };

    const mockUser = {
      id: 'user_123',
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: 'hashed_password',
      oauthProviders: [],
    };

    beforeEach(() => {
      mockOAuthService.exchangeCodeForTokens.mockResolvedValue(mockTokens);
      mockOAuthService.getUserProfile.mockResolvedValue(mockProfile);
      mockOAuthService.linkOAuthAccount = jest.fn();
      (getOAuthService as jest.Mock).mockReturnValue(mockOAuthService);
    });

    it('should link OAuth provider to authenticated user', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ ...mockUser, oauthProviders: [] })
        .mockResolvedValueOnce({ ...mockUser, oauthProviders: [{ provider: 'google' }] });
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      const result = await authService.linkOAuthProvider('user_123', 'google', 'auth_code');

      expect(result.success).toBe(true);
      expect(result.linkedProviders).toContain('google');
      expect(mockOAuthService.exchangeCodeForTokens).toHaveBeenCalledWith('google', 'auth_code');
      expect(mockOAuthService.getUserProfile).toHaveBeenCalledWith('google', mockTokens.accessToken);
      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalledWith(
        'user_123',
        'google',
        mockProfile.id,
        {
          accessToken: mockTokens.accessToken,
          refreshToken: mockTokens.refreshToken,
        }
      );
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.linkOAuthProvider('invalid_user', 'google', 'auth_code')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if OAuth account already linked to another user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue({
        userId: 'different_user_123',
        provider: 'google',
        providerUserId: mockProfile.id,
      });

      await expect(
        authService.linkOAuthProvider('user_123', 'google', 'auth_code')
      ).rejects.toThrow('This google account is already linked to another user');
    });

    it('should log OAUTH_LINKED security event', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ ...mockUser, oauthProviders: [] })
        .mockResolvedValueOnce({ ...mockUser, oauthProviders: [{ provider: 'google' }] });
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      await authService.linkOAuthProvider('user_123', 'google', 'auth_code');

      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user_123',
          event: 'OAUTH_LINKED',
          metadata: expect.objectContaining({
            provider: 'google',
            providerUserId: mockProfile.id,
          }),
        },
      });
    });

    it('should allow linking if OAuth account already linked to same user', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ ...mockUser, oauthProviders: [{ provider: 'google' }] })
        .mockResolvedValueOnce({ ...mockUser, oauthProviders: [{ provider: 'google' }] });
      (prisma.oAuthProvider.findUnique as jest.Mock).mockResolvedValue({
        userId: 'user_123',
        provider: 'google',
        providerUserId: mockProfile.id,
      });
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      const result = await authService.linkOAuthProvider('user_123', 'google', 'auth_code');

      expect(result.success).toBe(true);
      expect(mockOAuthService.linkOAuthAccount).toHaveBeenCalled();
    });
  });

  describe('unlinkOAuthProvider', () => {
    const mockUser = {
      id: 'user_123',
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: 'hashed_password',
      oauthProviders: [
        { provider: 'google' },
        { provider: 'facebook' },
      ],
    };

    beforeEach(() => {
      mockOAuthService.unlinkOAuthAccount = jest.fn();
      (getOAuthService as jest.Mock).mockReturnValue(mockOAuthService);
    });

    it('should unlink OAuth provider when user has other providers', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      const result = await authService.unlinkOAuthProvider('user_123', 'google');

      expect(result.success).toBe(true);
      expect(mockOAuthService.unlinkOAuthAccount).toHaveBeenCalledWith('user_123', 'google');
    });

    it('should unlink OAuth provider when user has password', async () => {
      const userWithPassword = {
        ...mockUser,
        oauthProviders: [{ provider: 'google' }],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithPassword);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});
      
      // Mock password verification
      jest.spyOn(authService, 'verifyPassword').mockResolvedValue(true);

      const result = await authService.unlinkOAuthProvider('user_123', 'google', 'correct_password');

      expect(result.success).toBe(true);
      expect(authService.verifyPassword).toHaveBeenCalledWith('correct_password', 'hashed_password');
      expect(mockOAuthService.unlinkOAuthAccount).toHaveBeenCalledWith('user_123', 'google');
    });

    it('should require password confirmation when unlinking only OAuth provider', async () => {
      const userWithOnlyOAuth = {
        ...mockUser,
        passwordHash: 'hashed_password',
        oauthProviders: [{ provider: 'google' }],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithOnlyOAuth);

      await expect(
        authService.unlinkOAuthProvider('user_123', 'google')
      ).rejects.toThrow('Password confirmation required');
    });

    it('should verify password when unlinking only OAuth provider', async () => {
      const userWithOnlyOAuth = {
        ...mockUser,
        passwordHash: 'hashed_password',
        oauthProviders: [{ provider: 'google' }],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithOnlyOAuth);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});
      
      // Mock password verification
      jest.spyOn(authService, 'verifyPassword').mockResolvedValue(true);

      const result = await authService.unlinkOAuthProvider('user_123', 'google', 'correct_password');

      expect(result.success).toBe(true);
      expect(authService.verifyPassword).toHaveBeenCalledWith('correct_password', 'hashed_password');
    });

    it('should throw error if password is incorrect', async () => {
      const userWithOnlyOAuth = {
        ...mockUser,
        passwordHash: 'hashed_password',
        oauthProviders: [{ provider: 'google' }],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithOnlyOAuth);
      
      // Mock password verification
      jest.spyOn(authService, 'verifyPassword').mockResolvedValue(false);

      await expect(
        authService.unlinkOAuthProvider('user_123', 'google', 'wrong_password')
      ).rejects.toThrow('Invalid password');
    });

    it('should throw error when trying to unlink only auth method', async () => {
      const userWithOnlyOAuth = {
        ...mockUser,
        passwordHash: '',
        oauthProviders: [{ provider: 'google' }],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithOnlyOAuth);

      await expect(
        authService.unlinkOAuthProvider('user_123', 'google')
      ).rejects.toThrow('Cannot unlink the only authentication method');
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.unlinkOAuthProvider('invalid_user', 'google')
      ).rejects.toThrow('User not found');
    });

    it('should log OAUTH_UNLINKED security event', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.securityLog.create as jest.Mock).mockResolvedValue({});

      await authService.unlinkOAuthProvider('user_123', 'google');

      expect(prisma.securityLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user_123',
          event: 'OAUTH_UNLINKED',
          metadata: expect.objectContaining({
            provider: 'google',
          }),
        },
      });
    });
  });
});
