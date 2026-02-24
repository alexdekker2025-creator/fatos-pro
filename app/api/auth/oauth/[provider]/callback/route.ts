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

    // Get locale from request URL
    const url = new URL(request.url);
    console.log('[OAuth Callback] Request URL:', url.toString());
    
    // Try to get locale from referer or default to 'ru'
    const referer = request.headers.get('referer');
    console.log('[OAuth Callback] Referer:', referer);
    
    let locale = 'ru';
    if (referer) {
      const refererUrl = new URL(referer);
      const pathParts = refererUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0 && (pathParts[0] === 'ru' || pathParts[0] === 'en')) {
        locale = pathParts[0];
      }
    }
    
    console.log('[OAuth Callback] Detected locale:', locale);
    
    // Create redirect response to oauth-success page with sessionId
    // This page will store sessionId in localStorage (matching app's auth pattern)
    const redirectUrl = new URL(`/${locale}/auth/oauth-success`, url.origin);
    redirectUrl.searchParams.set('sessionId', result.session.id);
    redirectUrl.searchParams.set('locale', locale);
    
    console.log('[OAuth Callback] Redirect URL:', redirectUrl.toString());
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Clear state cookie
    response.cookies.delete('oauth_state');
    
    console.log('[OAuth Callback] Response created, returning redirect');

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
    errorUrl.searchParams.set('provider', provider);
    return NextResponse.redirect(errorUrl);
  }
}
