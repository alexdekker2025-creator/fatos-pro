# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - OAuth Callback Parameters Extraction in Edge Runtime
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists in production Edge Runtime
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - OAuth callback URLs with `code` and `state` parameters in Edge Runtime environment
  - Test that when OAuth provider redirects to callback endpoint with `code` and `state` in URL, these parameters are successfully extracted (from Fault Condition in design: `isBugCondition(input)` where `input.url` contains `?code=` and `&state=` but `searchParams.get()` returns `null` in Edge Runtime)
  - Test assertions should verify that `code` and `state` are NOT null and are passed to `authService.handleOAuthCallback()` (from Expected Behavior Properties in design)
  - Run test on UNFIXED code in Edge Runtime environment
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists in Edge Runtime)
  - Document counterexamples found (e.g., "searchParams.get('code') returns null despite URL containing ?code=xyz789")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Error Handling and Session Management
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - Invalid provider handling returns "invalid_provider" error
    - OAuth provider error parameter is handled correctly
    - Locale is determined from referer header
    - Session creation and cookie deletion work correctly
    - Error-specific redirects to error page work correctly
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - For all invalid providers, error handling remains unchanged
    - For all OAuth error responses, error processing remains unchanged
    - For all requests, locale detection logic remains unchanged
    - For all successful callbacks, session creation and cookie management remain unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for OAuth callback parameters not being read in Edge Runtime

  - [x] 3.1 Switch to Node.js Runtime
    - Add `export const runtime = 'nodejs'` at the top of `app/api/auth/oauth/[provider]/callback/route.ts`
    - Remove Edge Runtime configuration if present
    - _Bug_Condition: isBugCondition(input) where Edge Runtime fails to read URL parameters after OAuth redirect_
    - _Expected_Behavior: Callback handler successfully extracts `code` and `state` parameters and passes them to authService_
    - _Preservation: All error handling, provider validation, locale detection, and session management remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Add manual URL parsing helper function
    - Create `parseUrlParams(url: string)` function that manually extracts `code` and `state` from URL string
    - Use URLSearchParams on query string extracted from URL
    - Add error handling for parsing failures
    - Return object with `code` and `state` properties (nullable)
    - _Bug_Condition: Fallback for cases where standard searchParams API fails_
    - _Expected_Behavior: Manual parsing successfully extracts parameters from URL string_
    - _Preservation: No impact on existing logic, purely additive helper function_
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Implement cascade of parameter extraction methods
    - Method 1: Try `request.nextUrl.searchParams.get('code')` and `get('state')`
    - Method 2: If null, try `new URL(request.url).searchParams.get('code')` and `get('state')`
    - Method 3: If still null, try `parseUrlParams(request.url)` manual parsing
    - Use first successful result for `code` and `state`
    - _Bug_Condition: Ensures parameters are extracted even if one method fails_
    - _Expected_Behavior: At least one method successfully extracts parameters_
    - _Preservation: Existing parameter usage logic remains unchanged_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.4 Add enhanced logging for diagnostics
    - Log runtime environment: `process.env.NEXT_RUNTIME || 'unknown'`
    - Log raw URL string: `request.url`
    - Log results from each parsing method
    - Log final extracted `code` and `state` values
    - Add context prefix `[OAuth Callback]` to all logs
    - _Bug_Condition: Helps diagnose if issue persists or recurs_
    - _Expected_Behavior: Detailed logs show parameter extraction process_
    - _Preservation: Logging is additive, doesn't change behavior_
    - _Requirements: 2.3_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - OAuth Callback Parameters Extraction
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1 in Node.js Runtime
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify that `code` and `state` are successfully extracted and passed to `authService.handleOAuthCallback()`
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Error Handling and Session Management
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix:
      - Invalid provider handling unchanged
      - OAuth error handling unchanged
      - Locale detection unchanged
      - Session creation and cookie management unchanged
      - Error redirects unchanged

- [ ] 4. Add unit tests for parameter extraction methods
  - Test `parseUrlParams()` helper function with various URL formats
  - Test edge cases: missing parameters, empty values, special characters, malformed URLs
  - Test cascade logic: verify fallback to next method when previous fails
  - Test that each extraction method works independently
  - _Requirements: 2.1, 2.2_

- [ ] 5. Add integration tests for full OAuth flow
  - Test complete Google OAuth flow in Vercel preview deployment (production-like environment)
  - Test complete Facebook OAuth flow in Vercel preview deployment
  - Verify successful parameter extraction and callback completion
  - Verify redirect to oauth-success page after successful authentication
  - Test error scenarios: invalid provider, OAuth errors, missing parameters
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Run all integration tests and verify they pass
  - Verify no regressions in existing functionality
  - Ask the user if questions arise
