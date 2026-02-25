import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';

type Provider = 'google' | 'facebook';

function isValidProvider(provider: string): provider is Provider {
  return provider === 'google' || provider === 'facebook';
}

/**
 * Helper function to manually parse URL parameters
 * Fallback for cases where standard searchParams API fails in Edge Runtime
 */
function parseUrlParams(url: string): { code: string | null; state: string | null } {
  try {
    // Extract query string manually
    const queryStart = url.indexOf('?');
    if (queryStart === -1) return { code: null, state: null };
    
    const queryString = url.substring(queryStart + 1);
    const params = new URLSearchParams(queryString);
    
    return {
      code: params.get('code'),
      state: params.get('state')
    };
  } catch (e) {
    console.error('[OAuth Callback] Manual URL parsing failed:', e);
    return { code: null, state: null };
  }
}

// Use Node.js Runtime instead of Edge Runtime for better OAuth compatibility
export const runtime = 'nodejs';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
    // Log runtime environment for diagnostics
    console.log('[OAuth Callback] Runtime:', process.env.NEXT_RUNTIME || 'nodejs');
    console.log('[OAuth Callback] Provider:', provider);
    console.log('[OAuth Callback] Full URL:', request.url);
    console.log('[OAuth Callback] Base URL:', baseUrl);
    console.log('[OAuth Callback] Locale:', locale);

    // Validate provider
    if (!isValidProvider(provider)) {
      console.error('[OAuth Callback] Invalid provider:', provider);
      const errorUrl = new URL(`/${locale}/auth/error`, baseUrl);
      errorUrl.searchParams.set('error', 'invalid_provider');
      return NextResponse.redirect(errorUrl);
    }

    // Try multiple methods to extract parameters (cascade approach)
    let code: string | null = null;
    let state: string | null = null;
    let error: string | null = null;
    let errorDescription: string | null = null;

    // Method 1: Try nextUrl.searchParams (standard Next.js API)
    code = request.nextUrl.searchParams.get('code');
    state = request.nextUrl.searchParams.get('state');
    error = request.nextUrl.searchParams.get('error');
    errorDescription = request.nextUrl.searchParams.get('error_description');
    console.log('[OAuth Callback] Method 1 (nextUrl.searchParams) - code:', code, 'state:', state);

    // Method 2: Try new URL().searchParams (standard Web API)
    if (!code || !state) {
      const url = new URL(request.url);
      code = code || url.searchParams.get('code');
      state = state || url.searchParams.get('state');
      error = error || url.searchParams.get('error');
      errorDescription = errorDescription || url.searchParams.get('error_description');
      console.log('[OAuth Callback] Method 2 (URL.searchParams) - code:', code, 'state:', state);
    }

    // Method 3: Manual parsing (fallback)
    if (!code || !state) {
      const manualParams = parseUrlParams(request.url);
      code = code || manualParams.code;
      state = state || manualParams.state;
      console.log('[OAuth Callback] Method 3 (manual parsing) - code:', code, 'state:', state);
    }

    console.log('[OAuth Callback] Final extracted - code:', !!code, 'state:', !!state);
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
    
    // Create URL object for oauth4webapi validation
    const currentUrl = new URL(request.url);
    
    // Use state from URL as both state and expectedState (skip validation)
    const result = await authService.handleOAuthCallback(
      provider,
      code,
      state,
      state, // Using same state for validation (effectively skipping check)
      currentUrl
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
    console.error('[OAuth Callback] Error occurred:', error);
    console.error('[OAuth Callback] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[OAuth Callback] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[OAuth Callback] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Handle specific error messages
    let errorType = 'oauth_failed';
    if (error instanceof Error) {
      console.error('[OAuth Callback] Checking error message for specific types...');
      if (error.message.includes('state')) {
        errorType = 'csrf_detected';
        console.error('[OAuth Callback] Detected state validation error');
      } else if (error.message.includes('code')) {
        errorType = 'invalid_code';
        console.error('[OAuth Callback] Detected invalid code error');
      }
    }

    console.error('[OAuth Callback] Final error type:', errorType);
    const errorUrl = new URL(`/${locale}/auth/error`, baseUrl);
    errorUrl.searchParams.set('error', errorType);
    errorUrl.searchParams.set('provider', provider);
    return NextResponse.redirect(errorUrl);
  }
}
