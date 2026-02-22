import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';

type Provider = 'google' | 'facebook';

function isValidProvider(provider: string): provider is Provider {
  return provider === 'google' || provider === 'facebook';
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;

    // Validate provider
    if (!isValidProvider(provider)) {
      return NextResponse.json(
        { error: 'Invalid OAuth provider. Must be "google" or "facebook".' },
        { status: 400 }
      );
    }

    // Initiate OAuth login
    const result = await authService.initiateOAuthLogin(provider);

    // Store state in cookie for CSRF protection
    const response = NextResponse.redirect(result.redirectUrl);
    response.cookies.set('oauth_state', result.state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OAuth authorize error:', error);
    
    // Redirect to error page
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', 'oauth_initiation_failed');
    return NextResponse.redirect(errorUrl);
  }
}
