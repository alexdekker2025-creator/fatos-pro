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
  try {
    const params = await context.params;
    const { provider } = params;
    const { searchParams } = new URL(request.url);

    console.log('[OAuth Callback] Provider:', provider);
    console.log('[OAuth Callback] Full URL:', request.url);
    console.log('[OAuth Callback] Search params:', Object.fromEntries(searchParams.entries()));

    // Validate provider
    if (!isValidProvider(provider)) {
      console.error('[OAuth Callback] Invalid provider:', provider);
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', 'invalid_provider');
      return NextResponse.redirect(errorUrl);
    }

    // Get code and state from query parameters
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('[OAuth Callback] Code present:', !!code);
    console.log('[OAuth Callback] State present:', !!state);

    if (!code || !state) {
      console.error('[OAuth Callback] Missing code or state');
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', 'missing_parameters');
      return NextResponse.redirect(errorUrl);
    }

    // Get expected state from cookie
    const expectedState = request.cookies.get('oauth_state')?.value;

    console.log('[OAuth Callback] Expected state present:', !!expectedState);

    if (!expectedState) {
      console.error('[OAuth Callback] Missing expected state cookie');
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', 'missing_state');
      return NextResponse.redirect(errorUrl);
    }

    console.log('[OAuth Callback] Calling authService.handleOAuthCallback...');

    // Handle OAuth callback
    const result = await authService.handleOAuthCallback(
      provider,
      code,
      state,
      expectedState
    );

    console.log('[OAuth Callback] Success! User ID:', result.user.id);

    // Get locale from URL or default to 'ru'
    const url = new URL(request.url);
    const locale = url.pathname.split('/')[1] || 'ru';
    
    // Clear state cookie and redirect to profile
    const response = NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
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
