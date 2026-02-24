import * as oauth from 'oauth4webapi';
import { getEncryptionService } from './EncryptionService';
import { prisma } from '@/lib/prisma';

/**
 * OAuthService - Handles OAuth 2.0 flows for Google and Facebook
 * Uses oauth4webapi for standards-compliant OAuth implementation
 */

// OAuth provider configurations
interface OAuthConfig {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

type OAuthProvider = 'google' | 'facebook';

interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

interface OAuthUserProfile {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export class OAuthService {
  private encryptionService = getEncryptionService();
  private redirectBaseUrl: string;

  constructor() {
    this.redirectBaseUrl = process.env.OAUTH_REDIRECT_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Get OAuth provider configuration
   */
  private getProviderConfig(provider: OAuthProvider): OAuthConfig {
    switch (provider) {
      case 'google':
        return {
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
          userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
          clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
          clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
          scope: 'openid email profile',
        };
      case 'facebook':
        return {
          authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
          tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
          userInfoEndpoint: 'https://graph.facebook.com/me',
          clientId: process.env.FACEBOOK_OAUTH_CLIENT_ID || '',
          clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET || '',
          scope: 'email public_profile',
        };
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  /**
   * Get authorization URL for OAuth flow
   * Generates a redirect URL to the provider's authorization endpoint
   */
  getAuthorizationURL(provider: OAuthProvider, state: string): string {
    const config = this.getProviderConfig(provider);
    const redirectUri = `${this.redirectBaseUrl}/api/auth/oauth/${provider}/callback`;

    // Log for debugging
    console.log(`[OAuth] Provider: ${provider}`);
    console.log(`[OAuth] Redirect Base URL: ${this.redirectBaseUrl}`);
    console.log(`[OAuth] Full Redirect URI: ${redirectUri}`);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.scope,
      state: state,
    });

    // Add provider-specific parameters
    if (provider === 'google') {
      params.append('access_type', 'offline'); // Request refresh token
      params.append('prompt', 'consent'); // Force consent screen to get refresh token
    }

    return `${config.authorizationEndpoint}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access tokens
   * Uses oauth4webapi for standards-compliant token exchange
   */
  async exchangeCodeForTokens(
    provider: OAuthProvider,
    code: string
  ): Promise<OAuthTokens> {
    const config = this.getProviderConfig(provider);
    const redirectUri = `${this.redirectBaseUrl}/api/auth/oauth/${provider}/callback`;

    // Create oauth4webapi client and authorization server metadata
    const client: oauth.Client = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      token_endpoint_auth_method: 'client_secret_post',
    };

    const authServer: oauth.AuthorizationServer = {
      issuer: provider === 'google' ? 'https://accounts.google.com' : 'https://www.facebook.com',
      token_endpoint: config.tokenEndpoint,
    };

    // Validate and prepare parameters
    const params = new URLSearchParams();
    params.set('code', code);

    // Exchange code for tokens (without PKCE for simplicity)
    const response = await oauth.authorizationCodeGrantRequest(
      authServer,
      client,
      params,
      redirectUri,
      '' // code_verifier (empty string when not using PKCE)
    );

    const result = await oauth.processAuthorizationCodeOpenIDResponse(
      authServer,
      client,
      response
    );

    if (oauth.isOAuth2Error(result)) {
      throw new Error(`OAuth error: ${result.error} - ${result.error_description || ''}`);
    }

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in || 3600,
    };
  }

  /**
   * Get user profile from OAuth provider
   * Fetches user information using the access token
   */
  async getUserProfile(
    provider: OAuthProvider,
    accessToken: string
  ): Promise<OAuthUserProfile> {
    const config = this.getProviderConfig(provider);

    if (provider === 'google') {
      const response = await fetch(config.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Google user profile: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        emailVerified: data.verified_email || false,
      };
    } else if (provider === 'facebook') {
      const url = `${config.userInfoEndpoint}?fields=id,email,name&access_token=${accessToken}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch Facebook user profile: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        emailVerified: true, // Facebook emails are considered verified
      };
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }

  /**
   * Link OAuth account to existing user
   * Stores encrypted tokens in the database
   */
  async linkOAuthAccount(
    userId: string,
    provider: string,
    providerUserId: string,
    tokens: { accessToken: string; refreshToken?: string }
  ): Promise<void> {
    // Check if this OAuth account is already linked to another user
    const existing = await prisma.oAuthProvider.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
    });

    if (existing && existing.userId !== userId) {
      throw new Error(`This ${provider} account is already linked to another user`);
    }

    // Encrypt tokens
    const accessTokenEncrypted = this.encryptToken(tokens.accessToken);
    const refreshTokenEncrypted = tokens.refreshToken
      ? this.encryptToken(tokens.refreshToken)
      : null;

    // Calculate expiration (default 1 hour if not specified)
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    // Upsert OAuth provider record
    await prisma.oAuthProvider.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      create: {
        userId,
        provider,
        providerUserId,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        expiresAt,
      },
      update: {
        providerUserId,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        expiresAt,
      },
    });
  }

  /**
   * Unlink OAuth account from user
   * Deletes the OAuth provider record
   */
  async unlinkOAuthAccount(userId: string, provider: string): Promise<void> {
    await prisma.oAuthProvider.delete({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
    });
  }

  /**
   * Refresh OAuth access token using refresh token
   * Returns new access token and expiration
   */
  async refreshOAuthToken(
    provider: OAuthProvider,
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const config = this.getProviderConfig(provider);

    // Create oauth4webapi client and authorization server metadata
    const client: oauth.Client = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      token_endpoint_auth_method: 'client_secret_post',
    };

    const authServer: oauth.AuthorizationServer = {
      issuer: provider === 'google' ? 'https://accounts.google.com' : 'https://www.facebook.com',
      token_endpoint: config.tokenEndpoint,
    };

    // Refresh token
    const response = await oauth.refreshTokenGrantRequest(
      authServer,
      client,
      refreshToken
    );

    const result = await oauth.processRefreshTokenResponse(
      authServer,
      client,
      response
    );

    if (oauth.isOAuth2Error(result)) {
      throw new Error(`OAuth refresh error: ${result.error} - ${result.error_description || ''}`);
    }

    return {
      accessToken: result.access_token,
      expiresIn: result.expires_in || 3600,
    };
  }

  /**
   * Encrypt token for storage using EncryptionService
   */
  encryptToken(token: string): string {
    return this.encryptionService.encrypt(token);
  }

  /**
   * Decrypt token from storage using EncryptionService
   */
  decryptToken(encrypted: string): string {
    return this.encryptionService.decrypt(encrypted);
  }
}

// Singleton instance
let oauthServiceInstance: OAuthService | null = null;

export function getOAuthService(): OAuthService {
  if (!oauthServiceInstance) {
    oauthServiceInstance = new OAuthService();
  }
  return oauthServiceInstance;
}
