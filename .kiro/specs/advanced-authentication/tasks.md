# Implementation Plan: Advanced Authentication

## Overview

This implementation plan breaks down the advanced authentication feature into discrete coding tasks. The feature adds password recovery, email verification, two-factor authentication (TOTP-based), and OAuth integration (Google and Facebook) to the existing FATOS.pro authentication system.

The implementation follows a layered approach: database schema → core services → API endpoints → integration. Each task builds on previous work, with property-based tests placed close to implementation to catch errors early.

## Technology Stack

- Next.js 14 API routes
- TypeScript
- Prisma ORM with PostgreSQL (Neon)
- Resend for email delivery
- otplib for TOTP generation
- qrcode for QR code generation
- oauth4webapi for OAuth flows
- fast-check for property-based testing

## Tasks

- [x] 1. Set up database schema and migrations
  - [x] 1.1 Extend User model with emailVerified and twoFactorEnabled fields
    - Add boolean fields with default false
    - Create migration file
    - _Requirements: 3.7, 5.6, 8.1_
  
  - [x] 1.2 Create PasswordResetToken model
    - Define model with userId, tokenHash, expiresAt, createdAt
    - Add indexes on userId, tokenHash, expiresAt
    - Add cascade delete on user deletion
    - _Requirements: 1.1, 1.2, 20.1_
  
  - [x] 1.3 Create EmailVerificationToken model
    - Define model with userId, tokenHash, expiresAt, createdAt
    - Add indexes on userId, tokenHash, expiresAt
    - Add cascade delete on user deletion
    - _Requirements: 3.1, 3.2, 20.2_
  
  - [x] 1.4 Create TwoFactorAuth model
    - Define model with userId, secretEncrypted, backupCodes (JSON), createdAt, updatedAt
    - Add unique constraint on userId (one-to-one relationship)
    - Add cascade delete on user deletion
    - _Requirements: 5.6, 5.7, 20.3_
  
  - [x] 1.5 Create OAuthProvider model
    - Define model with userId, provider, providerUserId, accessTokenEncrypted, refreshTokenEncrypted, expiresAt
    - Add unique constraints on (provider, providerUserId) and (userId, provider)
    - Add indexes on userId and provider
    - Add cascade delete on user deletion
    - _Requirements: 9.7, 10.7, 12.1, 20.4_
  
  - [x] 1.6 Create SecurityLog model
    - Define model with userId (nullable), event, ipAddress, userAgent, metadata (JSON), createdAt
    - Add indexes on userId, event, createdAt
    - Add SetNull on user deletion
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_
  
  - [x] 1.7 Run database migration
    - Execute prisma migrate dev
    - Verify all tables and indexes created
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [x] 2. Implement EncryptionService
  - [x] 2.1 Create EncryptionService with AES-256-GCM encryption
    - Implement encrypt() method using crypto.randomBytes for IV
    - Implement decrypt() method with authentication tag verification
    - Implement deriveKey() using scrypt for key derivation from ENCRYPTION_SECRET
    - Store IV and auth tag with ciphertext (format: iv:authTag:ciphertext)
    - _Requirements: 5.6, 9.7, 10.7, 12.1_
  
  - [ ]*
 2.2 Write property test for EncryptionService
    - **Property 40: Encryption Round-Trip**
    - **Validates: Requirements 5.6, 9.7, 10.7, 12.1**
    - Test that encrypt(plaintext) → decrypt(ciphertext) returns original plaintext
    - Use fast-check with arbitrary strings (100 iterations)

- [x] 3. Implement TokenService
  - [x] 3.1 Create TokenService with token generation and validation
    - Implement generateToken() using crypto.randomBytes (32 bytes default)
    - Implement hashToken() using SHA-256
    - Implement verifyToken() with crypto.timingSafeEqual for constant-time comparison
    - Implement createPasswordResetToken() with 1-hour expiration
    - Implement validatePasswordResetToken() with expiration check
    - Implement createEmailVerificationToken() with 24-hour expiration
    - Implement validateEmailVerificationToken() with expiration check
    - Implement cleanupExpiredTokens() to delete expired tokens
    - _Requirements: 1.1, 1.2, 1.6, 2.1, 2.4, 3.1, 3.2, 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ]* 3.2 Write property tests for TokenService
    - **Property 1: Token Generation Security**
    - **Validates: Requirements 1.6, 14.1, 14.5**
    - Test that generated tokens are at least 32 bytes and URL-safe
    - **Property 2: Token Storage Security**
    - **Validates: Requirements 1.2, 3.2, 14.2**
    - Test that hashToken() never returns the original token
    - **Property 3: Token Expiration Validation**
    - **Validates: Requirements 2.1, 2.5, 14.4**
    - Test that expired tokens are always rejected
    - **Property 4: Token Single-Use Enforcement**
    - **Validates: Requirements 2.4, 2.6**
    - Test that used tokens are invalidated
    - **Property 29: Token Constant-Time Comparison**
    - **Validates: Requirements 14.3**
    - Test that verifyToken() uses constant-time comparison (timing analysis)
    - Use fast-check with arbitrary strings (100 iterations each)
  
  - [ ]* 3.3 Write unit tests for TokenService
    - Test token generation produces unique values
    - Test token hashing is deterministic
    - Test expired token rejection
    - Test cleanup removes only expired tokens

- [x] 4. Implement EmailService with Resend integration
  - [x] 4.1 Create EmailService with Resend client
    - Install resend package
    - Initialize Resend client with API key from environment
    - Implement sendPasswordResetEmail() with retry logic (3 attempts)
    - Implement sendEmailVerificationEmail() with retry logic
    - Implement send2FAEnabledEmail() notification
    - Implement send2FADisabledEmail() notification
    - Create email templates for both Russian and English
    - Include FATOS.pro branding in templates
    - _Requirements: 1.3, 3.3, 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 4.2 Write property test for EmailService
    - **Property 27: Email Retry Logic**
    - **Validates: Requirements 13.3**
    - Test that failed email sends retry up to 3 times
    - Mock Resend client to simulate failures
    - **Property 28: Transactional Email Unsubscribe Exclusion**
    - **Validates: Requirements 13.5**
    - Test that transactional emails do not include unsubscribe links
    - Use fast-check (100 iterations)
  
  - [ ]* 4.3 Write unit tests for EmailService
    - Test email templates render correctly for both languages
    - Test retry logic attempts exactly 3 times
    - Test failed emails are logged
    - Test email links contain valid tokens

- [x] 5. Implement TwoFactorService
  - [x] 5.1 Create TwoFactorService with TOTP functionality
    - Install otplib and qrcode packages
    - Implement generateSecret() using otplib.authenticator.generateSecret()
    - Implement generateQRCode() with otpauth:// URI format
    - Implement verifyTOTP() with ±1 time window for clock drift
    - Implement generateBackupCodes() creating 10 unique codes
    - Implement hashBackupCode() using bcrypt
    - Implement verifyBackupCode() with bcrypt comparison
    - Implement enable2FA() storing encrypted secret and hashed backup codes
    - Implement disable2FA() deleting TOTP secret and backup codes
    - Implement verify2FACode() checking TOTP or backup codes
    - Implement regenerateBackupCodes() invalidating old codes
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 5.8, 6.5, 6.6, 6.7, 7.2, 7.4_
  
  - [ ]* 5.2 Write property tests for TwoFactorService
    - **Property 9: TOTP Secret Uniqueness**
    - **Validates: Requirements 5.1**
    - Test that generated secrets are unique across multiple generations
    - **Property 10: TOTP Secret Encryption**
    - **Validates: Requirements 5.6**
    - Test that stored secrets are encrypted, not plaintext
    - **Property 11: Backup Code Generation**
    - **Validates: Requirements 5.4**
    - Test that exactly 10 unique backup codes are generated
    - **Property 12: Backup Code Storage Security**
    - **Validates: Requirements 5.7**
    - Test that backup codes are hashed before storage
    - **Property 13: TOTP Code Format**
    - **Validates: Requirements 5.8**
    - Test that TOTP codes are exactly 6 digits
    - **Property 14: TOTP Clock Drift Tolerance**
    - **Validates: Requirements 6.5**
    - Test that codes from current and previous time windows are accepted
    - **Property 16: Backup Code Consumption**
    - **Validates: Requirements 6.6, 6.7**
    - Test that used backup codes cannot be reused
    - **Property 17: 2FA Disable Cleanup**
    - **Validates: Requirements 7.2**
    - Test that disabling 2FA deletes all secrets and backup codes
    - **Property 18: Backup Code Regeneration Invalidation**
    - **Validates: Requirements 7.4**
    - Test that regenerating backup codes invalidates old ones
    - Use fast-check (100 iterations each)
  
  - [ ]* 5.3 Write unit tests for TwoFactorService
    - Test TOTP codes are 6 digits
    - Test QR codes contain correct URI format
    - Test backup codes are unique and properly formatted
    - Test clock drift tolerance (±1 time window)
    - Test backup code consumption prevents reuse

- [x] 6. Implement OAuthService
  - [x] 6.1 Create OAuthService with oauth4webapi
    - Install oauth4webapi package
    - Implement getAuthorizationURL() for Google and Facebook
    - Implement exchangeCodeForTokens() using oauth4webapi
    - Implement getUserProfile() for Google and Facebook APIs
    - Implement linkOAuthAccount() storing encrypted tokens
    - Implement unlinkOAuthAccount() deleting OAuth provider record
    - Implement refreshOAuthToken() for token refresh
    - Implement encryptToken() using EncryptionService
    - Implement decryptToken() using EncryptionService
    - Store OAuth client IDs and secrets in environment variables
    - _Requirements: 9.1, 9.2, 9.3, 9.7, 10.1, 10.2, 10.3, 10.7, 11.1, 11.2, 12.1, 12.4_
  
  - [ ]* 6.2 Write property tests for OAuthService
    - **Property 20: OAuth Provider Redirect**
    - **Validates: Requirements 9.1, 10.1, 12.4**
    - Test that authorization URLs contain state parameter
    - **Property 21: OAuth Token Exchange**
    - **Validates: Requirements 9.2, 10.2**
    - Test that valid codes are exchanged for tokens (mock provider)
    - **Property 24: OAuth Token Encryption**
    - **Validates: Requirements 9.7, 10.7, 12.1**
    - Test that stored tokens are encrypted
    - Use fast-check (100 iterations each)
  
  - [ ]* 6.3 Write unit tests for OAuthService
    - Test authorization URLs contain required parameters
    - Test state parameter prevents CSRF
    - Test token encryption/decryption round-trips correctly
    - Test provider-specific profile parsing
    - Test token refresh updates access token

- [ ] 7. Checkpoint - Ensure all service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Extend AuthService for password reset
  - [x] 8.1 Add password reset request method to AuthService
    - Implement requestPasswordReset() calling TokenService
    - Call EmailService to send reset email
    - Log security event to SecurityLog
    - Return generic success message (prevent email enumeration)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 16.1_
  
  - [x] 8.2 Add password reset confirmation method to AuthService
    - Implement confirmPasswordReset() validating token
    - Hash new password with bcrypt
    - Update user password in database
    - Invalidate all user sessions except current
    - Invalidate password reset token
    - Log security event to SecurityLog
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 16.2_
  
  - [ ]* 8.3 Write property tests for password reset
    - **Property 5: Password Reset Session Invalidation**
    - **Validates: Requirements 2.3, 18.2**
    - Test that all sessions are invalidated on password reset
    - **Property 6: Password Security Requirements**
    - **Validates: Requirements 2.7, 17.2**
    - Test that passwords under 8 characters are rejected
    - **Property 7: Email Enumeration Prevention**
    - **Validates: Requirements 1.4**
    - Test that same response is returned for existing and non-existing emails
    - Use fast-check (100 iterations each)

- [x] 9. Extend AuthService for email verification
  - [x] 9.1 Add email verification methods to AuthService
    - Implement sendEmailVerification() calling TokenService and EmailService
    - Implement verifyEmail() validating token and updating user
    - Implement resendEmailVerification() with rate limiting check
    - Log security events to SecurityLog
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 16.1_
  
  - [ ]* 9.2 Write property test for email verification
    - **Property 8: Email Verification Status Update**
    - **Validates: Requirements 3.4**
    - Test that valid token sets emailVerified to true
    - Use fast-check (100 iterations)

- [x] 10. Extend AuthService for 2FA
  - [x] 10.1 Add 2FA setup methods to AuthService
    - Implement setup2FA() generating secret and QR code
    - Implement confirm2FA() validating TOTP code and enabling 2FA
    - Invalidate all sessions on 2FA enable
    - Log security event to SecurityLog
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 16.3, 18.1_
  
  - [x] 10.2 Add 2FA login verification to AuthService
    - Modify login flow to check twoFactorEnabled
    - Implement verify2FALogin() validating TOTP or backup code
    - Create session only after successful 2FA verification
    - Log backup code usage to SecurityLog
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 16.5_
  
  - [x] 10.3 Add 2FA management methods to AuthService
    - Implement disable2FA() requiring password confirmation
    - Implement regenerateBackupCodes() requiring TOTP or backup code
    - Log security events to SecurityLog
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 16.3_
  
  - [ ]* 10.4 Write property tests for 2FA
    - **Property 15: 2FA Login Flow**
    - **Validates: Requirements 6.1**
    - Test that session is not created until 2FA code is verified
    - **Property 19: 2FA Enable Session Invalidation**
    - **Validates: Requirements 18.1**
    - Test that enabling 2FA invalidates all sessions
    - Use fast-check (100 iterations each)

- [x] 11. Extend AuthService for OAuth
  - [x] 11.1 Add OAuth login methods to AuthService
    - Implement initiateOAuthLogin() generating state and redirect URL
    - Implement handleOAuthCallback() exchanging code for tokens
    - Implement createOrLinkOAuthAccount() creating user or linking to existing
    - Create session after successful OAuth login
    - Set emailVerified to true for OAuth accounts
    - Log security events to SecurityLog
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.9, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.8, 16.4_
  
  - [x] 11.2 Add OAuth account management methods to AuthService
    - Implement linkOAuthProvider() for authenticated users
    - Implement unlinkOAuthProvider() requiring password or another provider
    - Log security events to SecurityLog
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 16.4_
  
  - [ ]* 11.3 Write property tests for OAuth
    - **Property 22: OAuth Account Creation**
    - **Validates: Requirements 9.4, 9.9, 10.4, 10.8**
    - Test that new OAuth login creates user with emailVerified=true
    - **Property 23: OAuth Account Linking**
    - **Validates: Requirements 9.5, 10.5, 11.2**
    - Test that matching email links to existing account
    - **Property 25: OAuth Duplicate Link Prevention**
    - **Validates: Requirements 11.3**
    - Test that linking already-linked OAuth account fails
    - **Property 26: OAuth Session Preservation**
    - **Validates: Requirements 18.3**
    - Test that linking OAuth does not invalidate sessions
    - Use fast-check (100 iterations each)

- [ ] 12. Checkpoint - Ensure all AuthService tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Create password reset API endpoints
  - [x] 13.1 Create POST /api/auth/password-reset/request endpoint
    - Validate email with Zod schema
    - Apply rate limiting (3 requests per 15 minutes per IP)
    - Call AuthService.requestPasswordReset()
    - Return generic success message
    - Handle errors with appropriate HTTP status codes
    - _Requirements: 1.1, 1.4, 1.5, 15.1, 17.1_
  
  - [x] 13.2 Create GET /api/auth/password-reset/verify endpoint
    - Validate token query parameter with Zod
    - Call TokenService.validatePasswordResetToken()
    - Return { valid: boolean, expired: boolean }
    - _Requirements: 2.1, 2.5_
  
  - [x] 13.3 Create POST /api/auth/password-reset/confirm endpoint
    - Validate token and newPassword with Zod schema
    - Call AuthService.confirmPasswordReset()
    - Return success response
    - Handle token errors with appropriate messages
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 17.2_
  
  - [ ]* 13.4 Write integration tests for password reset flow
    - Test complete flow: request → verify → confirm
    - Test expired token rejection
    - Test rate limiting enforcement
    - Test session invalidation

- [x] 14. Create email verification API endpoints
  - [x] 14.1 Create POST /api/auth/email/verify endpoint
    - Validate token with Zod schema
    - Call AuthService.verifyEmail()
    - Return success with updated user data
    - Handle token errors with appropriate messages
    - _Requirements: 3.4, 3.5, 17.1_
  
  - [x] 14.2 Create POST /api/auth/email/resend endpoint
    - Require authentication
    - Apply rate limiting (3 requests per hour per user)
    - Call AuthService.resendEmailVerification()
    - Return success message
    - _Requirements: 3.6, 15.2_
  
  - [ ]* 14.3 Write integration tests for email verification flow
    - Test complete flow: register → verify
    - Test resend with rate limiting
    - Test expired token handling

- [x] 15. Create 2FA API endpoints
  - [x] 15.1 Create POST /api/auth/2fa/setup endpoint
    - Require authentication
    - Call AuthService.setup2FA()
    - Return { secret, qrCode, backupCodes }
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 15.2 Create POST /api/auth/2fa/confirm endpoint
    - Require authentication
    - Validate code with Zod schema (6 digits)
    - Call AuthService.confirm2FA()
    - Return success with enabled status
    - _Requirements: 5.3, 17.3_
  
  - [x] 15.3 Create POST /api/auth/2fa/verify endpoint
    - Validate userId and code with Zod schema
    - Apply rate limiting (5 attempts per 15 minutes per user)
    - Call AuthService.verify2FALogin()
    - Return success with session
    - Handle invalid codes with appropriate errors
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 15.3, 17.3_
  
  - [x] 15.4 Create POST /api/auth/2fa/disable endpoint
    - Require authentication
    - Validate password with Zod schema
    - Call AuthService.disable2FA()
    - Return success response
    - _Requirements: 7.1, 7.2, 17.2_
  
  - [x] 15.5 Create POST /api/auth/2fa/backup-codes/regenerate endpoint
    - Require authentication
    - Validate code with Zod schema (TOTP or backup code)
    - Call AuthService.regenerateBackupCodes()
    - Return new backup codes
    - _Requirements: 7.3, 7.4, 17.3, 17.4_
  
  - [ ]* 15.6 Write integration tests for 2FA flow
    - Test complete setup flow: setup → confirm
    - Test login flow with 2FA enabled
    - Test backup code usage and consumption
    - Test backup code regeneration
    - Test 2FA disable
    - Test rate limiting on verification attempts

- [x] 16. Create OAuth API endpoints
  - [x] 16.1 Create GET /api/auth/oauth/[provider]/authorize endpoint
    - Validate provider parameter (google | facebook)
    - Call AuthService.initiateOAuthLogin()
    - Redirect to OAuth provider with state parameter
    - _Requirements: 9.1, 10.1, 12.4_
  
  - [x] 16.2 Create GET /api/auth/oauth/[provider]/callback endpoint
    - Validate code and state query parameters
    - Verify state parameter matches (CSRF protection)
    - Call AuthService.handleOAuthCallback()
    - Create session and redirect to dashboard
    - Handle OAuth errors with user-friendly messages
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 10.2, 10.3, 10.4, 10.5, 10.6, 12.3, 12.4_
  
  - [x] 16.3 Create POST /api/auth/oauth/link endpoint
    - Require authentication
    - Validate provider and code with Zod schema
    - Call AuthService.linkOAuthProvider()
    - Return success with linked providers list
    - Handle duplicate link errors
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 16.4 Create POST /api/auth/oauth/unlink endpoint
    - Require authentication
    - Validate provider with Zod schema
    - Validate password if no other auth method available
    - Call AuthService.unlinkOAuthProvider()
    - Return success response
    - _Requirements: 11.5_
  
  - [ ]* 16.5 Write integration tests for OAuth flow
    - Test complete Google OAuth flow (mock provider)
    - Test complete Facebook OAuth flow (mock provider)
    - Test account creation for new users
    - Test account linking for existing users
    - Test duplicate link prevention
    - Test OAuth account unlinking
    - Test CSRF protection with state parameter

- [ ] 17. Checkpoint - Ensure all API endpoint tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Implement rate limiting middleware
  - [ ] 18.1 Create rate limiting middleware for new endpoints
    - Implement sliding window rate limiter
    - Configure limits per endpoint (password reset: 3/15min, email resend: 3/hour, 2FA: 5/15min, OAuth: 10/15min)
    - Return HTTP 429 with Retry-After header when exceeded
    - Log rate limit violations to SecurityLog
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 16.6_
  
  - [ ]* 18.2 Write property tests for rate limiting
    - **Property 30: Rate Limit Response**
    - **Validates: Requirements 15.5**
    - Test that exceeded limits return 429 with Retry-After header
    - **Property 31: Rate Limit Sliding Window**
    - **Validates: Requirements 15.6**
    - Test that burst requests within window are blocked
    - Use fast-check (100 iterations each)
  
  - [ ]* 18.3 Write unit tests for rate limiting
    - Test each endpoint's specific rate limit
    - Test sliding window algorithm
    - Test Retry-After header calculation

- [ ] 19. Implement input validation schemas
  - [ ] 19.1 Create Zod validation schemas for all endpoints
    - Email schema with format validation
    - Password schema with minimum 8 characters
    - TOTP code schema (exactly 6 digits)
    - Backup code schema (format validation)
    - OAuth provider schema (enum: google | facebook)
    - Token schema (URL-safe string)
    - _Requirements: 17.1, 17.2, 17.3, 17.4_
  
  - [ ] 19.2 Add input sanitization for logging
    - Sanitize user inputs to remove newlines and control characters
    - Apply sanitization before logging
    - _Requirements: 17.5_
  
  - [ ]* 19.3 Write property tests for input validation
    - **Property 34: Input Validation**
    - **Validates: Requirements 17.1, 17.2, 17.3, 17.4**
    - Test that invalid inputs are rejected with descriptive errors
    - **Property 35: Log Injection Prevention**
    - **Validates: Requirements 17.5**
    - Test that sanitization removes dangerous characters
    - **Property 36: Validation Error Messages**
    - **Validates: Requirements 17.6**
    - Test that error messages don't expose system internals
    - Use fast-check (100 iterations each)

- [ ] 20. Implement security logging
  - [ ] 20.1 Add security event logging to all authentication operations
    - Log password reset requests and completions
    - Log email verification events
    - Log 2FA enable/disable events
    - Log OAuth link/unlink events
    - Log backup code usage
    - Log rate limit violations
    - Include timestamp, user ID, IP address, user agent, and metadata
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_
  
  - [ ]* 20.2 Write property test for security logging
    - **Property 32: Security Event Logging**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6**
    - Test that all security operations create log entries
    - Use fast-check (100 iterations)

- [x] 21. Implement token cleanup job
  - [x] 21.1 Create scheduled job for token cleanup
    - Implement cleanup function calling TokenService.cleanupExpiredTokens()
    - Schedule to run daily (e.g., via cron or Next.js API route)
    - Log cleanup statistics
    - _Requirements: 20.7_
  
  - [ ]* 21.2 Write property test for token cleanup
    - **Property 39: Token Cleanup**
    - **Validates: Requirements 20.7**
    - Test that expired tokens are removed, active tokens remain
    - Use fast-check (100 iterations)

- [x] 22. Implement audit log cleanup job
  - [x] 22.1 Create scheduled job for audit log cleanup
    - Implement cleanup function deleting logs older than 90 days
    - Schedule to run daily
    - Log cleanup statistics
    - _Requirements: 16.7_
  
  - [ ]* 22.2 Write property test for audit log cleanup
    - **Property 33: Audit Log Retention**
    - **Validates: Requirements 16.7**
    - Test that logs older than 90 days are removed
    - Use fast-check (100 iterations)

- [ ] 23. Implement session management enhancements
  - [ ] 23.1 Update session creation to include 2FA verification status
    - Add twoFactorVerified field to session data
    - Set field based on 2FA login completion
    - _Requirements: 18.4_
  
  - [ ] 23.2 Update session invalidation logic
    - Ensure password reset invalidates all sessions except current
    - Ensure 2FA enable invalidates all sessions
    - Ensure OAuth linking preserves sessions
    - _Requirements: 18.1, 18.2, 18.3_
  
  - [ ]* 23.3 Write property test for session management
    - **Property 37: Session Duration Consistency**
    - **Validates: Requirements 18.5**
    - Test that all auth methods create 30-day sessions
    - Use fast-check (100 iterations)

- [ ] 24. Implement user experience enhancements
  - [ ] 24.1 Create user-facing feedback messages
    - Password reset confirmation message
    - Email verification success page
    - 2FA setup completion with backup codes display
    - OAuth error messages with alternative login options
    - Token expiration messages with resend options
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ]* 24.2 Write property test for user feedback
    - **Property 38: User Feedback Completeness**
    - **Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5**
    - Test that all operations return clear feedback
    - Use fast-check (100 iterations)

- [x] 25. Add admin visibility features
  - [x] 25.1 Extend user profile API to include authentication status
    - Add emailVerified field to user profile response
    - Add twoFactorEnabled field to user profile response
    - Add linkedProviders array to user profile response
    - _Requirements: 4.1, 8.1_
  
  - [x] 25.2 Create admin endpoint for user authentication statistics
    - Implement GET /api/admin/auth/stats endpoint
    - Return counts: verified emails, 2FA enabled, OAuth linked
    - Require admin authentication
    - _Requirements: 4.3, 8.3_
  
  - [x] 25.3 Update admin user list to display authentication status
    - Show emailVerified status in user list
    - Show twoFactorEnabled status in user list
    - Show linked OAuth providers in user list
    - _Requirements: 4.2, 8.2_

- [x] 26. Create environment configuration documentation
  - [x] 26.1 Document required environment variables
    - ENCRYPTION_SECRET (for AES-256-GCM encryption)
    - RESEND_API_KEY (for email service)
    - GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET
    - FACEBOOK_OAUTH_CLIENT_ID and FACEBOOK_OAUTH_CLIENT_SECRET
    - OAUTH_REDIRECT_BASE_URL (for OAuth callbacks)
    - Create .env.example file with all variables

- [ ] 27. Final checkpoint - Run all tests and verify integration
  - Run all unit tests
  - Run all property-based tests (minimum 100 iterations each)
  - Run all integration tests
  - Verify all 40 correctness properties pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check with minimum 100 iterations
- All 40 correctness properties from the design document are covered
- Checkpoints ensure incremental validation
- Services are implemented before API endpoints for proper layering
- Rate limiting and security logging are integrated throughout
- OAuth implementation uses oauth4webapi for standards compliance
- Encryption uses AES-256-GCM for OAuth tokens and TOTP secrets
- All tokens use SHA-256 hashing and constant-time comparison
