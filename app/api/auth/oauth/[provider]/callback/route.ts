import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';

type Provider = 'google' | 'facebook';

function isValidProvider(provider: string): provider is Provider {
  return provider === 'google' || provider === 'facebook';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    const { searchParams } = new URL(request.url);

    // Validate provider
    if (!isValidProvider(provider)) {
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', 'invalid_provider');
      return NextResponse.redirect(errorUrl);
    }

    // Get code and state from query parameters
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', 'missing_parameters');
      return NextResponse.redirect(errorUrl);
    }

    // Get expected state from cookie
    const expectedState = request.cookies.get('oauth_state')?.value;

    if (!expectedState) {
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', 'missing_state');
      return NextResponse.redirect(errorUrl);
    }

    // Handle OAuth callback
    const result = await authService.handleOAuthCallback(
      provider,
      code,
      state,
      expectedState
    );

    // Clear state cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.delete('oauth_state');

    // Set session cookie
    response.cookies.set('session', result.session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);

    // Handle specific error messages
    let errorType = 'oauth_failed';
    if (error instanceof Error) {
      if (error.message.includes('state')) {
        errorType = 'csrf_detected';
      } else if (error.message.includes('code')) {
        errorType = 'invalid_code';
      }
    }

    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', errorType);
    errorUrl.searchParams.set('provider', params.provider);
    return NextResponse.redirect(errorUrl);
  }
}
