/**
 * Bug Condition Exploration Property Test
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3**
 * 
 * CRITICAL: This test is EXPECTED TO FAIL on unfixed code.
 * Failure confirms the bug exists in Edge Runtime.
 * 
 * Property 1: Fault Condition - OAuth Callback Parameters Extraction in Edge Runtime
 * 
 * For any HTTP request where an OAuth provider redirects to the callback endpoint
 * with `code` and `state` parameters in the URL, the callback handler SHALL
 * successfully extract these parameters and pass them to authService.handleOAuthCallback().
 */

import { NextRequest } from 'next/server';
import * as fc from 'fast-check';
import { GET } from '../route';

// Mock authService
jest.mock('@/lib/services/auth/AuthService', () => ({
  authService: {
    handleOAuthCallback: jest.fn(),
  },
}));

import { authService } from '@/lib/services/auth/AuthService';

describe('Property 1: Fault Condition - OAuth Callback Parameters Extraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup successful mock response
    (authService.handleOAuthCallback as jest.Mock).mockResolvedValue({
      user: { id: 'test-user-id' },
      session: { id: 'test-session-id' },
    });
  });

  /**
   * Property Test: OAuth callback parameters extraction
   * 
   * This test simulates the bug condition where OAuth providers redirect
   * with code and state parameters in the URL, but Edge Runtime fails to
   * extract them using standard Next.js APIs.
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - The test will fail because searchParams.get() returns null
   * - This confirms the bug exists
   * 
   * EXPECTED OUTCOME ON FIXED CODE: PASS
   * - The test will pass because parameters are extracted correctly
   */
  it('should extract code and state parameters from OAuth callback URL', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random OAuth parameters
        fc.record({
          provider: fc.constantFrom('google', 'facebook'),
          code: fc.string({ minLength: 10, maxLength: 100 }),
          state: fc.string({ minLength: 10, maxLength: 100 }),
          locale: fc.constantFrom('ru', 'en'),
        }),
        async ({ provider, code, state, locale }) => {
          // Construct OAuth callback URL with parameters
          const baseUrl = 'https://fatos-pro.vercel.app';
          const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
          
          // Create mock NextRequest simulating Edge Runtime behavior
          const mockRequest = new NextRequest(callbackUrl, {
            headers: {
              referer: `${baseUrl}/${locale}/auth/login`,
            },
          });

          // Mock cookies
          Object.defineProperty(mockRequest, 'cookies', {
            value: {
              get: jest.fn((name: string) => {
                if (name === 'oauth_state') {
                  return { value: state };
                }
                return undefined;
              }),
              getAll: jest.fn(() => [
                { name: 'oauth_state', value: state },
              ]),
            },
            writable: true,
          });

          // Execute the callback handler
          const context = {
            params: Promise.resolve({ provider }),
          };

          const response = await GET(mockRequest, context);

          // CRITICAL ASSERTIONS: These verify the bug condition
          // On unfixed code, these assertions will FAIL because:
          // 1. searchParams.get() returns null in Edge Runtime
          // 2. The handler redirects to error page with 'missing_parameters'
          // 3. authService.handleOAuthCallback is never called

          // Verify authService.handleOAuthCallback was called
          expect(authService.handleOAuthCallback).toHaveBeenCalled();

          // Verify it was called with the correct parameters
          const callArgs = (authService.handleOAuthCallback as jest.Mock).mock.calls[0];
          expect(callArgs[0]).toBe(provider);
          expect(callArgs[1]).toBe(code); // This will be null on unfixed code
          expect(callArgs[2]).toBe(state); // This will be null on unfixed code

          // Verify successful redirect (not error redirect)
          expect(response.status).toBe(307); // Redirect status
          const location = response.headers.get('location');
          expect(location).toContain('oauth-success');
          expect(location).not.toContain('error');
        }
      ),
      {
        numRuns: 20, // Run 20 test cases with different parameters
        verbose: true, // Show detailed output including counterexamples
      }
    );
  });

  /**
   * Edge Case: Parameters with special characters
   * 
   * OAuth providers may include special characters in code/state parameters.
   * This test verifies that URL encoding/decoding works correctly.
   */
  it('should handle OAuth parameters with special characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          provider: fc.constantFrom('google', 'facebook'),
          code: fc.string({ minLength: 10, maxLength: 50 }).map(s => s + '&=?#'),
          state: fc.string({ minLength: 10, maxLength: 50 }).map(s => s + '&=?#'),
        }),
        async ({ provider, code, state }) => {
          const baseUrl = 'https://fatos-pro.vercel.app';
          const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
          
          const mockRequest = new NextRequest(callbackUrl, {
            headers: {
              referer: `${baseUrl}/ru/auth/login`,
            },
          });

          Object.defineProperty(mockRequest, 'cookies', {
            value: {
              get: jest.fn((name: string) => {
                if (name === 'oauth_state') {
                  return { value: state };
                }
                return undefined;
              }),
              getAll: jest.fn(() => [
                { name: 'oauth_state', value: state },
              ]),
            },
            writable: true,
          });

          const context = {
            params: Promise.resolve({ provider }),
          };

          const response = await GET(mockRequest, context);

          // Verify parameters were extracted correctly despite special characters
          expect(authService.handleOAuthCallback).toHaveBeenCalled();
          const callArgs = (authService.handleOAuthCallback as jest.Mock).mock.calls[0];
          expect(callArgs[1]).toBe(code);
          expect(callArgs[2]).toBe(state);
        }
      ),
      {
        numRuns: 10,
        verbose: true,
      }
    );
  });

  /**
   * Edge Case: Empty or very long parameters
   * 
   * Test boundary conditions for parameter values.
   */
  it('should handle edge cases in parameter values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          provider: fc.constantFrom('google', 'facebook'),
          code: fc.oneof(
            fc.string({ minLength: 1, maxLength: 1 }), // Very short
            fc.string({ minLength: 200, maxLength: 500 }) // Very long
          ),
          state: fc.oneof(
            fc.string({ minLength: 1, maxLength: 1 }), // Very short
            fc.string({ minLength: 200, maxLength: 500 }) // Very long
          ),
        }),
        async ({ provider, code, state }) => {
          const baseUrl = 'https://fatos-pro.vercel.app';
          const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
          
          const mockRequest = new NextRequest(callbackUrl, {
            headers: {
              referer: `${baseUrl}/ru/auth/login`,
            },
          });

          Object.defineProperty(mockRequest, 'cookies', {
            value: {
              get: jest.fn((name: string) => {
                if (name === 'oauth_state') {
                  return { value: state };
                }
                return undefined;
              }),
              getAll: jest.fn(() => [
                { name: 'oauth_state', value: state },
              ]),
            },
            writable: true,
          });

          const context = {
            params: Promise.resolve({ provider }),
          };

          const response = await GET(mockRequest, context);

          // Verify parameters were extracted correctly regardless of length
          expect(authService.handleOAuthCallback).toHaveBeenCalled();
          const callArgs = (authService.handleOAuthCallback as jest.Mock).mock.calls[0];
          expect(callArgs[1]).toBe(code);
          expect(callArgs[2]).toBe(state);
        }
      ),
      {
        numRuns: 10,
        verbose: true,
      }
    );
  });
});
