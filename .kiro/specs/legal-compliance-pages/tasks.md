# Implementation Plan: Legal Compliance Pages

## Overview

This implementation plan breaks down the legal compliance pages feature into discrete coding tasks. The approach follows a bottom-up strategy: first establishing the data layer and core services, then building the API layer with validation and rate limiting, and finally implementing the UI components and pages. Each task builds incrementally on previous work, with checkpoints to validate functionality.

## Tasks

- [x] 1. Set up database schema and environment configuration
  - [x] 1.1 Create ContactSubmission model in Prisma schema
    - Add ContactSubmission model with all required fields (id, name, email, subject, message, locale, status, emailSent, emailSentAt, emailError, ipAddress, userAgent, createdAt, updatedAt)
    - Add ContactStatus enum (PENDING, PROCESSED, SPAM, RESOLVED)
    - Add indexes for email, status, createdAt, and emailSent fields
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 1.2 Run database migration
    - Generate Prisma migration with `npx prisma migrate dev --name add_contact_submission`
    - Generate Prisma client with `npx prisma generate`
    - _Requirements: 7.1_
  
  - [x] 1.3 Install required dependencies
    - Install Resend SDK: `npm install resend`
    - Install Upstash Redis SDK: `npm install @upstash/redis @upstash/ratelimit`
    - Install Zod (if not already installed): `npm install zod`
    - Install fast-check for property-based testing: `npm install --save-dev fast-check @types/fast-check`
    - _Requirements: 6.4, 12.1_

- [x] 2. Implement validation schemas
  - [x] 2.1 Create contact form validation schema
    - Create `lib/validations/contactSchema.ts`
    - Define Zod schema with validation rules for name (1-100 chars), email (valid format), subject (1-200 chars), message (10-5000 chars), and locale (ru/en)
    - Export TypeScript type from schema
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 2.2 Write property tests for validation schema
    - **Property 1: Form Validation Rejects Invalid Input**
    - **Property 2: Email Validation Rejects Invalid Formats**
    - **Property 3: Message Length Validation**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 3. Implement service layer
  - [x] 3.1 Create contact service for database operations
    - Create `lib/services/contactService.ts`
    - Implement `createContactSubmission()` function to create database records
    - Implement `updateSubmissionEmailStatus()` function to update email delivery status
    - Implement `getContactSubmissions()` function for querying submissions (for future admin panel)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 3.2 Write unit tests for contact service
    - Test database record creation with all fields
    - Test email status updates
    - Test query functions with filters
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 3.3 Create email service with Resend integration
    - Create `lib/services/emailService.ts`
    - Initialize Resend client with API key from environment
    - Implement `sendContactEmail()` function that formats and sends email with all submission details
    - Include proper error handling for Resend API failures
    - _Requirements: 5.1, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 3.4 Write unit tests for email service
    - Mock Resend API and test email formatting
    - Test error handling for API failures
    - Verify all required fields are included in email
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [x] 3.5 Create rate limiter service with Upstash Redis
    - Create `lib/services/rateLimiter.ts`
    - Initialize Upstash Redis client with environment variables
    - Implement `checkRateLimit()` function using sliding window algorithm (3 requests per hour)
    - Return rate limit status with remaining attempts and retry-after time
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 3.6 Write unit tests for rate limiter
    - Mock Upstash Redis and test rate limit enforcement
    - Test limit reset after time window
    - Test retry-after calculation
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 4. Checkpoint - Verify service layer
  - Ensure all service layer tests pass, ask the user if questions arise.

- [x] 5. Implement API route for contact form submission
  - [x] 5.1 Create POST /api/contact route handler
    - Create `app/api/contact/route.ts`
    - Implement request handling with rate limiting check
    - Validate request body using contactSchema
    - Create database record via contactService
    - Send email via emailService
    - Update database with email delivery status
    - Return appropriate responses for success/error cases
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.5, 7.1, 7.3, 7.4, 10.1, 10.2, 10.3, 10.4, 12.1, 12.2_
  
  - [ ]* 5.2 Write property tests for API route
    - **Property 4: Validation Prevents Submission**
    - **Property 6: Valid Submissions Trigger Email Delivery**
    - **Property 8: Submissions Are Persisted to Database**
    - **Property 15: Rate Limit Rejection Includes Retry Information**
    - **Validates: Requirements 4.4, 5.1, 5.4, 7.1, 12.2**
  
  - [ ]* 5.3 Write integration tests for API route
    - Test complete submission flow with mocked services
    - Test rate limiting enforcement
    - Test error handling for service failures
    - Test validation error responses
    - _Requirements: 5.1, 5.2, 5.3, 10.1, 10.2, 10.3, 12.1_

- [x] 6. Add internationalization translations
  - [x] 6.1 Add Russian translations for legal pages and contact form
    - Update `messages/ru.json` with privacy, terms, contact, and footer namespaces
    - Include all page content, form labels, validation messages, and success/error messages
    - _Requirements: 9.1, 9.3, 9.5_
  
  - [x] 6.2 Add English translations for legal pages and contact form
    - Update `messages/en.json` with privacy, terms, contact, and footer namespaces
    - Include all page content, form labels, validation messages, and success/error messages
    - _Requirements: 9.2, 9.4, 9.6_
  
  - [ ]* 6.3 Write property test for translation completeness
    - **Property 5: Validation Errors Are Localized**
    - **Property 17: Locale-Based Content Rendering**
    - **Validates: Requirements 4.5, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

- [x] 7. Implement legal content components
  - [x] 7.1 Create PrivacyPolicyContent component
    - Create `components/legal/PrivacyPolicyContent.tsx`
    - Use useTranslations hook to load privacy namespace
    - Render structured content with semantic HTML (article, section, h1, h2, h3)
    - Apply consistent Tailwind typography classes matching purple/amber theme
    - _Requirements: 1.2, 1.3, 1.4, 9.1, 9.2, 11.1_
  
  - [x] 7.2 Create TermsOfServiceContent component
    - Create `components/legal/TermsOfServiceContent.tsx`
    - Use useTranslations hook to load terms namespace
    - Render structured content with semantic HTML
    - Apply consistent Tailwind typography classes matching purple/amber theme
    - _Requirements: 2.2, 2.3, 2.4, 9.3, 9.4, 11.2_
  
  - [ ]* 7.3 Write unit tests for legal content components
    - Test content rendering in both locales
    - Test semantic HTML structure
    - Test responsive design classes
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5_

- [x] 8. Implement contact form component
  - [x] 8.1 Create ContactForm component with form state management
    - Create `components/legal/ContactForm.tsx` as client component
    - Set up form state with useState for formData, errors, isSubmitting, and submitStatus
    - Implement form field change handlers
    - _Requirements: 3.4, 3.5_
  
  - [x] 8.2 Add client-side validation to ContactForm
    - Implement real-time validation using contactSchema
    - Display field-specific error messages
    - Prevent submission when validation fails
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 8.3 Implement form submission handler
    - Create async submit handler that calls /api/contact
    - Handle loading states during submission
    - Display success message on successful submission
    - Display error messages on failure
    - Clear form fields after successful submission
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 10.1, 10.2, 10.3, 10.5_
  
  - [x] 8.4 Add accessibility features to ContactForm
    - Add proper label associations (htmlFor/id) for all form fields
    - Add ARIA labels where needed
    - Ensure keyboard navigation works correctly
    - Add focus management for error states
    - _Requirements: 11.3, 11.5, 11.6_
  
  - [ ]* 8.5 Write property tests for ContactForm
    - **Property 7: Successful Submission Shows Success Feedback**
    - **Property 9: Successful Submission Clears Form**
    - **Property 14: Form Labels Are Properly Associated**
    - **Validates: Requirements 5.2, 5.5, 11.3**
  
  - [ ]* 8.6 Write unit tests for ContactForm
    - Test form rendering with all fields
    - Test validation error display
    - Test submission flow with mocked API
    - Test success/error message display
    - Test form reset after success
    - Test accessibility attributes
    - _Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 5.2, 5.3, 5.5, 11.3, 11.5_

- [ ] 9. Checkpoint - Verify components
  - Ensure all component tests pass, ask the user if questions arise.

- [x] 10. Create page routes for legal pages
  - [x] 10.1 Create Privacy Policy page
    - Create `app/[locale]/privacy-policy/page.tsx`
    - Implement generateMetadata function for SEO
    - Render PrivacyPolicyContent component
    - Apply responsive container styling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 11.1, 11.4_
  
  - [x] 10.2 Create Terms of Service page
    - Create `app/[locale]/terms-of-service/page.tsx`
    - Implement generateMetadata function for SEO
    - Render TermsOfServiceContent component
    - Apply responsive container styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 11.2, 11.4_
  
  - [x] 10.3 Create Contact page
    - Create `app/[locale]/contact/page.tsx`
    - Implement generateMetadata function for SEO
    - Render ContactForm component
    - Apply responsive container styling
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 11.4_
  
  - [ ]* 10.4 Write E2E tests for page routes
    - Test navigation to all legal pages in both locales
    - Test page metadata and SEO tags
    - Test responsive design on mobile and desktop
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3_

- [x] 11. Update Footer component with legal links
  - [x] 11.1 Add legal links section to Footer
    - Update `components/Footer.tsx` to include links to privacy-policy, terms-of-service, and contact pages
    - Use locale-based routing (/{locale}/privacy-policy, etc.)
    - Apply existing Footer styling
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  
  - [x] 11.2 Update footer translations
    - Add footer translation keys to messages/ru.json and messages/en.json
    - Include labels for privacy, terms, and contact links
    - _Requirements: 8.4, 8.5_
  
  - [ ]* 11.3 Write property test for Footer links
    - **Property 13: Footer Links Include Locale Prefix**
    - **Validates: Requirements 8.6**
  
  - [ ]* 11.4 Write unit tests for Footer updates
    - Test link rendering in both locales
    - Test correct href attributes with locale prefix
    - Test link text translations
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 12. Add error logging and monitoring
  - [ ] 12.1 Implement comprehensive error logging
    - Add error logging to API route for all error types (validation, rate limiting, email, database)
    - Log errors with context (IP address, user agent, timestamp, error details)
    - Use existing SecurityLog table or console logging
    - _Requirements: 10.4, 12.5_
  
  - [ ]* 12.2 Write property test for error logging
    - **Property 16: Error Logging Is Comprehensive**
    - **Validates: Requirements 10.4, 12.5**

- [x] 13. Final integration and testing
  - [x] 13.1 Create environment variable documentation
    - Document required environment variables (RESEND_API_KEY, CONTACT_EMAIL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
    - Add example .env.local file
    - _Requirements: 6.4, 12.1_
  
  - [ ]* 13.2 Write end-to-end test for complete user flow
    - Test complete flow: navigate to contact page → fill form → submit → see success message
    - Test validation error flow: submit invalid form → see errors → correct → submit successfully
    - Test rate limiting: submit multiple forms → see rate limit error
    - Test locale switching: view pages in Russian → switch to English → verify content changes
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.5, 9.7, 12.1, 12.2_
  
  - [x] 13.3 Manual testing checklist
    - Test all pages in both locales (ru/en)
    - Test contact form submission with real email service
    - Test rate limiting with multiple submissions
    - Test responsive design on mobile and desktop
    - Test accessibility with keyboard navigation
    - Verify database records are created correctly
    - Verify emails are delivered successfully
    - _Requirements: All_

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration and E2E tests validate complete user flows
- The implementation follows a bottom-up approach: data layer → services → API → UI → pages
- All code uses TypeScript for type safety
- All components follow Next.js 14 App Router conventions
- All styling uses Tailwind CSS with purple/amber theme
