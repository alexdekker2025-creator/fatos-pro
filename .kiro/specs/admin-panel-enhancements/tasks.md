# Implementation Plan: Admin Panel Enhancements

## Overview

This implementation plan breaks down the admin panel enhancements into discrete, implementable tasks. The feature adds comprehensive user management capabilities and enhanced statistics visualization to the existing FATOS.pro admin panel. Implementation will use TypeScript with Next.js 14, Chart.js for visualizations, and Prisma for database operations.

## Tasks

- [x] 1. Database schema update and migration
  - Create Prisma migration for `isBlocked` field on User model
  - Add database index on `isBlocked` field for query performance
  - Run migration and verify existing data integrity
  - Update Prisma client types
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 2. Install required dependencies
  - Install Chart.js and react-chartjs-2 for visualizations
  - Install xlsx library for Excel export functionality
  - Install lru-cache for server-side caching
  - Install zod for input validation
  - Install use-debounce for search optimization
  - Install fast-check for property-based testing
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.2_

- [x] 3. Create admin authentication utilities
  - [x] 3.1 Implement admin session verification function
    - Create `lib/auth/adminAuth.ts` with `verifyAdminSession` function
    - Verify session exists, not expired, and user has `isAdmin=true`
    - Return session with user data or null
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 3.2 Write property test for admin session verification
    - **Property 21: Non-Admin Access Denial**
    - **Validates: Requirements 12.1, 12.2**
  
  - [x] 3.3 Create rate limiting utility
    - Create `lib/utils/rateLimit.ts` with LRU cache implementation
    - Implement rate limit check function (100 requests per minute default)
    - _Requirements: 12.2_

- [x] 4. Implement user management API endpoints
  - [x] 4.1 Create GET /api/admin/users endpoint
    - Implement pagination with page size 25
    - Add search by email or name (case-insensitive)
    - Add filters for emailVerified, twoFactorEnabled, isBlocked, date range
    - Include calculations count and purchases count for each user
    - Add sorting by createdAt, lastLogin, email
    - Verify admin session on every request
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 6.1_
  
  - [ ]* 4.2 Write property test for user list pagination
    - **Property 1: User List Pagination Consistency**
    - **Validates: Requirements 1.3**
  
  - [ ]* 4.3 Write property test for search filter correctness
    - **Property 3: Search Filter Correctness**
    - **Validates: Requirements 2.2**
  
  - [ ]* 4.4 Write property test for multi-filter AND logic
    - **Property 4: Multi-Filter AND Logic**
    - **Validates: Requirements 2.5**
  
  - [x] 4.5 Create GET /api/admin/users/[id] endpoint
    - Fetch user details with activity metrics
    - Include recent calculations and purchases
    - Include security events from SecurityLog table
    - Include OAuth provider information
    - _Requirements: 7.2, 7.3_
  
  - [ ]* 4.6 Write property test for user information completeness
    - **Property 2: User Information Completeness**
    - **Validates: Requirements 1.2, 6.1**
  
  - [x] 4.7 Create PUT /api/admin/users/[id] endpoint
    - Validate email format using Zod schema
    - Check email uniqueness before update
    - Prevent self-demotion from admin
    - Update user record in database
    - Create audit log entry
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 4.8 Write property test for email validation
    - **Property 5: Email Validation on Update**
    - **Validates: Requirements 3.2**
  
  - [ ]* 4.9 Write property test for user update round-trip
    - **Property 6: User Update Round-Trip**
    - **Validates: Requirements 3.3**
  
  - [ ]* 4.10 Write property test for email uniqueness enforcement
    - **Property 7: Email Uniqueness Enforcement**
    - **Validates: Requirements 3.5**
  
  - [x] 4.11 Create PATCH /api/admin/users/[id]/block endpoint
    - Accept isBlocked boolean in request body
    - Prevent self-blocking
    - Update user Block_Status
    - Create audit log entry
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_
  
  - [ ]* 4.12 Write property test for block status persistence
    - **Property 8: Block Status Persistence**
    - **Validates: Requirements 4.2, 4.4**
  
  - [x] 4.13 Create DELETE /api/admin/users/[id] endpoint
    - Require email confirmation in request body
    - Prevent self-deletion
    - Use Prisma transaction for cascade deletion
    - Delete user and all associated data (calculations, orders, purchases, sessions, security logs, OAuth providers, 2FA data, tokens)
    - Create audit log entry
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 4.14 Write property test for user deletion cascade
    - **Property 10: User Deletion Cascade**
    - **Validates: Requirements 5.3**
  
  - [ ]* 4.15 Write property test for comprehensive audit logging
    - **Property 11: Comprehensive Audit Logging**
    - **Validates: Requirements 3.4, 4.5, 5.4, 12.4**

- [ ] 5. Checkpoint - Verify API endpoints
  - Test all user management endpoints manually
  - Verify admin authentication works correctly
  - Verify audit logging is created for all actions
  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Update authentication system for blocked users
  - [x] 6.1 Modify login logic to check isBlocked field
    - Update authentication function to reject blocked users
    - Return descriptive error message for blocked users
    - _Requirements: 4.3_
  
  - [ ]* 6.2 Write property test for blocked user authentication rejection
    - **Property 9: Blocked User Authentication Rejection**
    - **Validates: Requirements 4.3**

- [x] 7. Enhance statistics API endpoint
  - [x] 7.1 Extend GET /api/admin/statistics endpoint
    - Add time range query parameter (7d, 30d, 90d, all, custom)
    - Add custom date range parameters (startDate, endDate)
    - Calculate active users for 7-day and 30-day periods
    - Calculate email verification rate and 2FA adoption rate
    - Generate user growth time series data
    - Generate calculation trends time series data
    - Generate revenue trends time series data
    - Generate OAuth usage breakdown data
    - Implement server-side caching with 30-second TTL
    - _Requirements: 6.2, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.1, 9.2, 9.3, 11.1_
  
  - [ ]* 7.2 Write property test for active user calculation accuracy
    - **Property 12: Active User Calculation Accuracy**
    - **Validates: Requirements 6.2, 8.6**
  
  - [ ]* 7.3 Write property test for statistics percentage calculation
    - **Property 16: Statistics Percentage Calculation**
    - **Validates: Requirements 8.5**

- [x] 8. Create export API endpoint
  - [x] 8.1 Create POST /api/admin/export endpoint
    - Accept format parameter (csv or excel)
    - Accept dataType parameter (users or statistics)
    - Accept timeRange and filters parameters
    - Generate CSV using custom logic
    - Generate Excel using xlsx library
    - Return file with proper Content-Type header
    - Use filename format: `fatos-{dataType}-{timeRange}-{timestamp}.{ext}`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 8.2 Write property test for export data completeness
    - **Property 19: Export Data Completeness**
    - **Validates: Requirements 10.3**
  
  - [ ]* 8.3 Write property test for export filename format
    - **Property 20: Export Filename Format**
    - **Validates: Requirements 10.4**

- [x] 9. Create UserManagement component
  - [x] 9.1 Implement UserManagement component structure
    - Create `components/admin/UserManagement.tsx`
    - Set up component state for users, pagination, filters, search
    - Implement data fetching with error handling
    - Add loading indicators
    - _Requirements: 1.1, 13.3_
  
  - [x] 9.2 Implement user list table
    - Display users in table format with 25 per page
    - Show email, name, registration date, verification status, 2FA status, blocked status
    - Show calculations count, purchases count, last login
    - Show OAuth provider badges
    - Format dates according to locale
    - _Requirements: 1.2, 1.3, 6.1, 6.3, 14.3_
  
  - [x] 9.3 Implement pagination controls
    - Add Previous/Next buttons
    - Add page number display
    - Add total user count display
    - Handle edge cases (first page, last page)
    - _Requirements: 1.4, 1.5_
  
  - [x] 9.4 Implement search functionality
    - Add search input field with 300ms debounce
    - Filter users by email or name on input change
    - Update results within 500ms
    - _Requirements: 2.1, 2.2, 2.6_
  
  - [x] 9.5 Implement filter controls
    - Add filter dropdowns for emailVerified, twoFactorEnabled, isBlocked
    - Add date range picker for registration date
    - Apply all filters with AND logic
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [x] 9.6 Implement sort functionality
    - Add sort dropdown for createdAt, lastLogin, email
    - Add sort order toggle (asc/desc)
    - _Requirements: 6.4_
  
  - [ ]* 9.7 Write property test for sort order invariant
    - **Property 14: Sort Order Invariant**
    - **Validates: Requirements 6.4**
  
  - [x] 9.8 Implement inline edit functionality
    - Add edit button for each user
    - Show inline edit form for name, email, isAdmin
    - Validate email format client-side
    - Call PUT API endpoint on save
    - Show success/error notifications
    - _Requirements: 3.1, 3.2, 13.4, 13.5_
  
  - [x] 9.9 Implement block/unblock toggle
    - Add block/unblock button for each user
    - Show confirmation dialog for block action
    - Prevent self-blocking with error message
    - Call PATCH API endpoint
    - Update UI optimistically with rollback on error
    - _Requirements: 4.1, 4.6, 12.3_
  
  - [x] 9.10 Implement delete functionality
    - Add delete button for each user
    - Show confirmation dialog requiring email confirmation
    - Prevent self-deletion with error message
    - Call DELETE API endpoint
    - Remove user from list on success
    - _Requirements: 5.1, 5.2, 5.5, 12.3_
  
  - [ ]* 9.11 Write property test for destructive action confirmation
    - **Property 22: Destructive Action Confirmation**
    - **Validates: Requirements 12.3**
  
  - [ ]* 9.12 Write property test for operation feedback notifications
    - **Property 23: Operation Feedback Notifications**
    - **Validates: Requirements 13.4, 13.5**

- [ ] 10. Create UserDetailsModal component
  - [ ] 10.1 Implement UserDetailsModal component structure
    - Create `components/admin/UserDetailsModal.tsx`
    - Accept user, isOpen, onClose, onUpdate, onBlock, onDelete props
    - Fetch detailed user data when opened
    - _Requirements: 7.1_
  
  - [ ] 10.2 Implement profile information section
    - Display email, name, registration date, last login
    - Display email verification status, 2FA status, blocked status
    - Display OAuth provider information
    - _Requirements: 7.2_
  
  - [ ] 10.3 Implement activity timeline section
    - Display calculations count and purchases count
    - Display recent calculations with dates
    - Display recent purchases with dates and amounts
    - _Requirements: 7.2_
  
  - [ ] 10.4 Implement security events section
    - Fetch and display security events from SecurityLog
    - Show login attempts, password changes, 2FA changes
    - Format timestamps according to locale
    - _Requirements: 7.3_
  
  - [ ] 10.5 Implement quick action buttons
    - Add block/unblock button
    - Add delete button
    - Add password reset button (if applicable)
    - Execute actions and update modal display
    - _Requirements: 7.4, 7.5_
  
  - [ ]* 10.6 Write property test for user details modal completeness
    - **Property 15: User Details Modal Completeness**
    - **Validates: Requirements 7.2, 7.3**

- [x] 11. Enhance StatisticsDashboard component
  - [x] 11.1 Update StatisticsDashboard component structure
    - Update `components/admin/StatisticsDashboard.tsx`
    - Add state for timeRange, customDateRange, autoRefresh
    - Implement data fetching with SWR or React Query
    - Add 30-second polling for real-time updates
    - Display last updated timestamp
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 11.2 Implement time range filter controls
    - Add time range selector (7d, 30d, 90d, all, custom)
    - Add custom date range picker
    - Validate custom date range (start before end)
    - Persist selected time range in session
    - Update charts within 1 second of selection
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 11.3 Write property test for date range validation
    - **Property 17: Date Range Validation**
    - **Validates: Requirements 9.4**
  
  - [ ]* 11.4 Write property test for time range filter persistence
    - **Property 18: Time Range Filter Persistence**
    - **Validates: Requirements 9.5**
  
  - [x] 11.5 Implement summary metrics display
    - Display total users, calculations, orders, revenue
    - Display active users (7d and 30d)
    - Display email verification rate and 2FA adoption rate
    - Format numbers according to locale
    - _Requirements: 8.5, 8.6, 14.3_
  
  - [x] 11.6 Create ChartWrapper component
    - Create `components/admin/ChartWrapper.tsx`
    - Accept title, type, data, options, loading props
    - Provide consistent styling for all charts
    - Show loading spinner during data fetch
    - _Requirements: 13.3_
  
  - [x] 11.7 Implement user growth line chart
    - Use Chart.js Line chart via ChartWrapper
    - Display user count over time
    - Apply mystical theme colors (purple/indigo gradients)
    - Add smooth transitions for data updates
    - _Requirements: 8.1, 13.6_
  
  - [x] 11.8 Implement calculation trends line chart
    - Use Chart.js Line chart via ChartWrapper
    - Display calculation count over time
    - Apply mystical theme colors
    - _Requirements: 8.2_
  
  - [x] 11.9 Implement revenue trends line chart
    - Use Chart.js Line chart via ChartWrapper
    - Display revenue amount over time
    - Apply mystical theme colors
    - _Requirements: 8.3_
  
  - [x] 11.10 Implement OAuth usage pie chart
    - Use Chart.js Pie chart via ChartWrapper
    - Display OAuth provider breakdown
    - Apply mystical theme colors
    - _Requirements: 8.4_
  
  - [x] 11.11 Implement export buttons
    - Create `components/admin/ExportButton.tsx`
    - Add CSV export button
    - Add Excel export button
    - Call POST /api/admin/export endpoint
    - Trigger file download on success
    - Show loading indicator during export
    - _Requirements: 10.1, 10.2_
  
  - [x] 11.12 Implement error handling for polling failures
    - Retry after 60 seconds on failure
    - Display warning indicator when data is stale
    - _Requirements: 11.4_

- [ ] 12. Checkpoint - Verify frontend components
  - Test UserManagement component with various filters and searches
  - Test UserDetailsModal with different user types
  - Test StatisticsDashboard with different time ranges
  - Verify charts render correctly with real data
  - Ensure all tests pass, ask the user if questions arise

- [x] 13. Implement responsive design
  - [x] 13.1 Add responsive styles to UserManagement
    - Use Tailwind responsive classes for mobile layout
    - Switch to card layout on screens < 768px
    - Ensure touch-friendly button sizes
    - _Requirements: 13.1, 13.2_
  
  - [x] 13.2 Add responsive styles to UserDetailsModal
    - Make modal full-screen on mobile devices
    - Adjust font sizes for readability
    - _Requirements: 13.1, 13.2_
  
  - [x] 13.3 Add responsive styles to StatisticsDashboard
    - Stack charts vertically on mobile
    - Adjust chart heights for mobile viewing
    - Make time range selector mobile-friendly
    - _Requirements: 13.1, 13.2_

- [ ] 14. Add bilingual translations
  - [ ] 14.1 Add Russian translations to messages/ru.json
    - Add all admin.users translation keys
    - Add all admin.statistics translation keys
    - Add error messages and notifications
    - Add confirmation dialog messages
    - _Requirements: 14.1, 14.4_
  
  - [ ] 14.2 Add English translations to messages/en.json
    - Add all admin.users translation keys
    - Add all admin.statistics translation keys
    - Add error messages and notifications
    - Add confirmation dialog messages
    - _Requirements: 14.2, 14.4_
  
  - [ ]* 14.3 Write property test for translation completeness
    - **Property 24: Translation Completeness**
    - **Validates: Requirements 14.4**
  
  - [ ] 14.4 Implement locale-based formatting
    - Format dates using locale-specific format
    - Format numbers using locale-specific format
    - Ensure consistent terminology across languages
    - _Requirements: 14.3, 14.5_
  
  - [ ]* 14.5 Write property test for locale-based formatting
    - **Property 13: Locale-Based Formatting**
    - **Validates: Requirements 6.3, 14.3**

- [x] 15. Update admin page to include Users tab
  - [x] 15.1 Update app/[locale]/admin/page.tsx
    - Add "Users" tab to existing tab navigation
    - Import and render UserManagement component
    - Maintain existing tabs (Statistics, Articles, Logs)
    - Ensure tab switching works correctly
    - _Requirements: 1.1_
  
  - [x] 15.2 Add client-side admin access verification
    - Check user.isAdmin on page load
    - Redirect to home page if not admin
    - Show loading state during verification
    - _Requirements: 12.1_

- [ ] 16. Write unit tests for components
  - [ ]* 16.1 Write unit tests for UserManagement component
    - Test user list rendering
    - Test pagination controls
    - Test search functionality
    - Test filter functionality
    - Test self-blocking prevention
    - Test self-deletion prevention
    - Test confirmation dialogs
  
  - [ ]* 16.2 Write unit tests for UserDetailsModal component
    - Test modal open/close
    - Test profile information display
    - Test activity timeline display
    - Test quick actions
  
  - [ ]* 16.3 Write unit tests for StatisticsDashboard component
    - Test time range filter
    - Test chart rendering
    - Test export functionality
    - Test polling mechanism
  
  - [ ]* 16.4 Write unit tests for API endpoints
    - Test GET /api/admin/users with various filters
    - Test PUT /api/admin/users/[id] validation
    - Test PATCH /api/admin/users/[id]/block self-prevention
    - Test DELETE /api/admin/users/[id] cascade deletion
    - Test GET /api/admin/statistics with time ranges
    - Test POST /api/admin/export file generation
СССССССССССССССССССССССССССССССССССССССССССССССС- [ ] 17. Performance optimization
  - [ ] 17.1 Implement code splitting for admin components
    - Use dynamic imports for UserManagement
    - Use dynamic imports for StatisticsDashboard
    - Add loading components
    - _Requirements: 13.3_
  
  - [ ] 17.2 Optimize database queries
    - Verify indexes exist on User table (email, emailVerified, twoFactorEnabled, isBlocked, createdAt, isAdmin)
    - Use cursor-based pagination for large datasets
    - Use database aggregation for statistics
    - _Requirements: 15.4_
  
  - [ ] 17.3 Optimize Chart.js performance
    - Reduce animation duration to 300ms
    - Limit x-axis tick count
    - Disable animations on data updates
    - _Requirements: 13.6_

- [ ] 18. Security hardening
  - [ ] 18.1 Add input validation to all API endpoints
    - Use Zod schemas for request validation
    - Validate email format, string lengths, boolean types
    - Return descriptive validation errors
    - _Requirements: 3.2_
  
  - [ ] 18.2 Implement rate limiting on API endpoints
    - Apply rate limit to all admin API endpoints
    - Use 100 requests per minute per user
    - Return 429 status code when exceeded
    - _Requirements: 12.2_
  
  - [ ] 18.3 Add Content Security Policy headers
    - Configure CSP in next.config.js
    - Add X-Frame-Options header
    - Add X-Content-Type-Options header
    - _Requirements: 12.2_

- [ ] 19. Final checkpoint and testing
  - Run all unit tests and property-based tests
  - Test complete user management workflow (create, edit, block, delete)
  - Test statistics dashboard with different time ranges
  - Test export functionality (CSV and Excel)
  - Test responsive design on mobile, tablet, desktop
  - Test bilingual support (Russian and English)
  - Verify audit logging for all actions
  - Verify performance (page load < 2s, API response < 500ms)
  - Ensure all tests pass, ask the user if questions arise

- [ ] 20. Documentation and deployment preparation
  - [ ] 20.1 Update README with new admin features
    - Document user management capabilities
    - Document statistics dashboard enhancements
    - Document export functionality
  
  - [ ] 20.2 Create migration guide
    - Document database migration steps
    - Document dependency installation
    - Document environment variable requirements (if any)
  
  - [ ] 20.3 Prepare deployment checklist
    - Verify all tests pass
    - Verify database migration is ready
    - Verify translations are complete
    - Verify security measures are in place

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across randomly generated inputs
- Unit tests validate specific examples and edge cases
- All code should be written in TypeScript with proper type safety
- Follow Next.js 14 App Router conventions
- Use Tailwind CSS for styling with mystical theme (purple/indigo gradients)
- Ensure all user-facing text is translatable via next-intl
