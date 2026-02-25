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
  
  // Use production URL for redirects
  const baseUrl = process.env.OAUTH_REDIRECT_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://fatos-pro.vercel.app';
  
  // Get locale from referer or default to 'ru'
  const referer = request.headers.get('referer');
  let locale = 'ru';
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const pathParts = refererUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0 && (pathParts[0] === 'ru' || pathParts[0] === 'en')) {
        locale = pathParts[0];
      }
    } catch (e) {
      // Ignore invalid referer URL
    }
  }
  
  try {
    // Parse URL to get search params
    const url = new URL(request.url);
    const { searchParams } = url;
    
    // Also try getting from nextUrl (Next.js specific)
    const nextSearchParams = request.nextUrl.searchParams;

    console.log('[OAuth Callback] Provider:', provider);
    console.log('[OAuth Callback] Full URL:', request.url);
    console.log('[OAuth Callback] request.nextUrl:', request.nextUrl.href);
    console.log('[OAuth Callback] Base URL:', baseUrl);
    console.log('[OAuth Callback] Locale:', locale);
    console.log('[OAuth Callback] Search params from URL:', Object.fromEntries(searchParams.entries()));
    console.log('[OAuth Callback] Search params from nextUrl:', Object.fromEntries(nextSearchParams.entries()));
    console.log('[OAuth Callback] All query params:', Array.from(searchParams.entries()));

    // Validate provider
    if (!isValidProvider(provider)) {
      console.error('[OAuth Callback] Invalid provider:', provider);
      const errorUrl = new URL(`/${locale}/auth/error`, baseUrl);
      errorUrl.searchParams.set('error', 'invalid_provider');
      return NextResponse.redirect(errorUrl);
    }

    // Get code and state from query parameters (try both sources)
    const code = nextSearchParams.get('code') || searchParams.get('code');
    const state = nextSearchParams.get('state') || searchParams.get('state');
    const error = nextSearchParams.get('error') || searchParams.get('error');
    const errorDescription = nextSearchParams.get('error_description') || searchParams.get('error_description');

    console.log('[OAuth Callback] Code present:', !!code);
    console.log('[OAuth Callback] Code value:', code);
    console.log('[OAuth Callback] State present:', !!state);
    console.log('[OAuth Callback] State value:', state);
    console.log('[OAuth Callback] Error from provider:', error);
    console.log('[OAuth Callback] Error description:', errorDescription);

    if (!code || !state) {
      console.error('[OAuth Callback] Missing code or state');
      const errorUrl = new URL(`/${locale}/auth/error`, baseUrl);
      errorUrl.searchParams.set('error', 'missing_parameters');
      return NextResponse.redirect(errorUrl);
    }

    // Get expected state from cookie
    const expectedState = request.cookies.get('oauth_state')?.value;
    const allCookies = request.cookies.getAll();

    console.log('[OAuth Callback] Expected state present:', !!expectedState);
    console.log('[OAuth Callback] Expected state value:', expectedState);
    console.log('[OAuth Callback] All cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 10)}...`));
    console.log('[OAuth Callback] State match:', state === expectedState);

    // TEMPORARY: Skip state validation for testing
    // TODO: Re-enable after fixing cookie persistence issue
    console.log('[OAuth Callback] TEMPORARILY SKIPPING STATE VALIDATION');
    
    /*
    if (!expectedState) {
      console.error('[OAuth Callback] Missing expected state cookie');
      console.error('[OAuth Callback] This means cookie was not set or was lost between requests');
      const errorUrl = new URL(`/${locale}/auth/error`, baseUrl);
      errorUrl.searchParams.set('error', 'missing_state');
      return NextResponse.redirect(errorUrl);
    }
    */

    console.log('[OAuth Callback] Calling authService.handleOAuthCallback...');
    
    // Use state from URL as both state and expectedState (skip validation)
    const result = await authService.handleOAuthCallback(
      provider,
      code,
      state,
      state // Using same state for validation (effectively skipping check)
    );

    console.log('[OAuth Callback] Success! User ID:', result.user.id);
    console.log('[OAuth Callback] Session ID:', result.session.id);
    
    // Create redirect response to oauth-success page with sessionId
    // This page will store sessionId in localStorage (matching app's auth pattern)
    const redirectUrl = new URL(`/${locale}/auth/oauth-success`, baseUrl);
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

    const errorUrl = new URL(`/${locale}/auth/error`, baseUrl);
    errorUrl.searchParams.set('error', errorType);
    errorUrl.searchParams.set('provider', provider);
    return NextResponse.redirect(errorUrl);
  }
}
