import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';

type Provider = 'google' | 'facebook';

function isValidProvider(provider: string): provider is Provider {
  return provider === 'google' || provider === 'facebook';
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Generate static params for known providers
export async function generateStaticParams() {
  return [
    { provider: 'google' },
    { provider: 'facebook' },
  ];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const params = await context.params;
  const { provider } = params;
  
  try {
    console.log('[OAuth Authorize] Provider:', provider);
    console.log('[OAuth Authorize] Request URL:', request.url);
    
    // Validate provider
    if (!isValidProvider(provider)) {
      return NextResponse.json(
        { error: 'Invalid OAuth provider. Must be "google" or "facebook".' },
        { status: 400 }
      );
    }

    // Initiate OAuth login
    const result = await authService.initiateOAuthLogin(provider);

    console.log('[OAuth Authorize] Generated state:', result.state);
    console.log('[OAuth Authorize] Redirect URL:', result.redirectUrl);

    // Store state in database instead of cookie for reliability
    const { prisma } = await import('@/lib/prisma');
    await prisma.oAuthState.create({
      data: {
        state: result.state,
        provider,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    console.log('[OAuth Authorize] State saved to database');

    // Also set cookie as backup
    const response = NextResponse.redirect(result.redirectUrl);
    response.cookies.set('oauth_state', result.state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/',
    });

    console.log('[OAuth Authorize] Cookie set, redirecting to provider');

    return response;
  } catch (error) {
    console.error('OAuth authorize error:', error);
    
    // Redirect to error page
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', 'oauth_initiation_failed');
    return NextResponse.redirect(errorUrl);
  }
}
