# Implementation Plan: Tier Upgrade System

## Overview

This plan implements a tier upgrade system that allows users with basic tier purchases to upgrade to full tier by paying only the price difference (2000₽). The implementation integrates with existing payment infrastructure, purchase tracking, and PDF generation systems.

## Tasks

- [x] 1. Set up database schema and upgrade transaction logging
  - Create UpgradeTransaction model in Prisma schema
  - Add migration for new table
  - Verify existing Purchase and Order models support upgrade metadata
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. Implement upgrade eligibility service
  - [x] 2.1 Create UpgradeEligibilityService class
    - Implement checkEligibility method to verify basic tier ownership and full tier non-ownership
    - Implement getUpgradePrice method to calculate price difference
    - Implement getAvailableUpgrades method to list all eligible upgrades for a user
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 1.4_
  
  - [ ]* 2.2 Write property test for eligibility determination
    - **Property 2: Eligibility Determination**
    - **Validates: Requirements 2.1, 2.2, 2.3**
  
  - [ ]* 2.3 Write property test for upgrade price calculation
    - **Property 1: Upgrade Price Calculation Invariant**
    - **Validates: Requirements 1.4, 10.1, 10.2**

- [x] 3. Create API endpoints for upgrade eligibility
  - [x] 3.1 Implement GET /api/upgrades/eligibility endpoint
    - Validate user authentication
    - Call UpgradeEligibilityService.checkEligibility
    - Return eligibility status with upgrade price
    - _Requirements: 2.4, 2.5_
  
  - [x] 3.2 Implement GET /api/upgrades/available endpoint
    - Validate user authentication
    - Call UpgradeEligibilityService.getAvailableUpgrades
    - Return list of available upgrades
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 3.3 Write unit tests for API endpoints
    - Test authentication validation
    - Test eligibility response format
    - Test error handling for invalid requests
    - _Requirements: 2.4, 8.1, 8.2, 8.3_

- [x] 4. Extend payment creation endpoint for upgrades
  - [x] 4.1 Modify POST /api/payments/create endpoint
    - Add isUpgrade boolean field to request body
    - Validate upgrade eligibility before creating payment session
    - Calculate amount based on upgrade price if isUpgrade=true
    - Store upgrade flag and metadata in order
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [ ]* 4.2 Write property test for payment rejection
    - **Property 8: Payment Rejection for Ineligible Users**
    - **Validates: Requirements 5.5, 8.1, 8.2, 8.3**
  
  - [ ]* 4.3 Write property test for payment session metadata
    - **Property 7: Payment Session Metadata Completeness**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ] 5. Checkpoint - Ensure backend services work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create React hook for upgrade eligibility
  - [x] 6.1 Implement useUpgradeEligibility hook
    - Fetch eligibility from /api/upgrades/eligibility
    - Handle loading and error states
    - Return isEligible, upgradePrice, loading, error
    - _Requirements: 2.4, 3.1_
  
  - [ ]* 6.2 Write unit tests for useUpgradeEligibility hook
    - Test loading state transitions
    - Test error handling
    - Test eligibility state updates
    - _Requirements: 2.4_

- [x] 7. Implement UpgradeButton component
  - [x] 7.1 Create UpgradeButton component
    - Display upgrade price with ₽ symbol
    - Show benefit text in Russian/English based on locale
    - Handle click to open payment modal with upgrade data
    - Style distinctly from standard purchase button
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 10.4, 11.1, 11.2_
  
  - [ ]* 7.2 Write property test for conditional UI rendering
    - **Property 4: Conditional UI Rendering**
    - **Validates: Requirements 3.1, 3.4**
  
  - [ ]* 7.3 Write property test for payment modal data consistency
    - **Property 5: Payment Modal Data Consistency**
    - **Validates: Requirements 3.5, 4.3**

- [x] 8. Integrate UpgradeButton into calculator pages
  - [x] 8.1 Update Pythagorean calculator pages (ru/en)
    - Add useUpgradeEligibility hook
    - Conditionally render UpgradeButton or standard purchase button
    - Pass correct serviceId and locale
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [x] 8.2 Update Destiny Matrix calculator pages (ru/en)
    - Add useUpgradeEligibility hook
    - Conditionally render UpgradeButton or standard purchase button
    - Pass correct serviceId and locale
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [ ]* 8.3 Write unit tests for calculator page integration
    - Test button rendering based on eligibility
    - Test payment modal opening with correct data
    - _Requirements: 3.1, 3.4, 3.5_

- [ ] 9. Implement ProfileUpgradeSection component
  - [ ] 9.1 Create ProfileUpgradeSection component
    - Fetch available upgrades from /api/upgrades/available
    - Display list of services with upgrade options
    - Show service name, current tier, and upgrade price
    - Handle click to open payment modal
    - Display empty state when no upgrades available
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 9.2 Write property test for profile upgrade list accuracy
    - **Property 6: Profile Upgrade List Accuracy**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ]* 9.3 Write unit tests for ProfileUpgradeSection
    - Test empty state rendering
    - Test upgrade list display
    - Test payment modal opening
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 10. Integrate ProfileUpgradeSection into profile page
  - Add ProfileUpgradeSection to user profile page
  - Position below purchased services section
  - Pass userId and locale props
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 11. Checkpoint - Ensure UI components work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Extend webhook handlers for upgrade fulfillment
  - [x] 12.1 Modify Stripe webhook handler
    - Check if order has upgrade metadata (isUpgrade flag)
    - Verify user still eligible for upgrade (idempotency check)
    - Create Purchase record with full tier serviceId
    - Log upgrade transaction with status
    - Handle errors with retry logic (up to 3 attempts)
    - Initiate refund if user no longer eligible
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 8.5, 9.1, 9.2, 9.3_
  
  - [x] 12.2 Modify YooKassa webhook handler
    - Check if order has upgrade metadata (isUpgrade flag)
    - Verify user still eligible for upgrade (idempotency check)
    - Create Purchase record with full tier serviceId
    - Log upgrade transaction with status
    - Handle errors with retry logic (up to 3 attempts)
    - Initiate refund if user no longer eligible
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 8.5, 9.1, 9.2, 9.3_
  
  - [ ]* 12.3 Write property test for webhook upgrade identification
    - **Property 9: Webhook Upgrade Identification**
    - **Validates: Requirements 6.1**
  
  - [ ]* 12.4 Write property test for purchase record creation
    - **Property 10: Purchase Record Creation After Upgrade**
    - **Validates: Requirements 6.2**
  
  - [ ]* 12.5 Write property test for retry logic
    - **Property 11: Retry Logic for Failed Operations**
    - **Validates: Requirements 6.5, 7.5**
  
  - [ ]* 12.6 Write property test for webhook refund
    - **Property 14: Webhook Refund for Ineligible Payments**
    - **Validates: Requirements 8.5**

- [ ] 13. Implement PDF generation for upgrades
  - [ ] 13.1 Create generateUpgradePDF function
    - Retrieve user's original calculation data from basic tier purchase
    - Determine service type (Pythagorean or Destiny Matrix)
    - Call appropriate full tier PDF generator
    - Store PDF reference in database or file system
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 13.2 Integrate PDF generation into webhook handlers
    - Call generateUpgradePDF after Purchase record creation
    - Handle PDF generation errors with retry logic
    - Log PDF generation status
    - _Requirements: 6.4, 7.4, 7.5_
  
  - [ ]* 13.3 Write property test for PDF generation after upgrade
    - **Property 12: PDF Generation After Upgrade**
    - **Validates: Requirements 6.4, 7.1, 7.2**
  
  - [ ]* 13.4 Write property test for PDF content equivalence
    - **Property 13: PDF Content Equivalence**
    - **Validates: Requirements 7.3**
  
  - [ ]* 13.5 Write unit tests for PDF generation
    - Test calculation data retrieval
    - Test service type determination
    - Test error handling
    - _Requirements: 7.1, 7.2, 7.5_

- [ ] 14. Implement transaction logging service
  - [ ] 14.1 Create UpgradeTransactionLogger class
    - Implement logInitiation method
    - Implement logCompletion method
    - Implement logFailure method with error details
    - Store logs in UpgradeTransaction table
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 14.2 Integrate logging into all upgrade operations
    - Log payment initiation in payment creation endpoint
    - Log completion in webhook handlers
    - Log failures with stack traces
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ]* 14.3 Write property test for transaction logging completeness
    - **Property 15: Transaction Logging Completeness**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.5**

- [ ] 15. Checkpoint - Ensure webhook and fulfillment work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement price consistency validation
  - [ ]* 16.1 Write property test for price display consistency
    - **Property 16: Price Display Consistency**
    - **Validates: Requirements 10.3**
  
  - [ ]* 16.2 Write property test for price formatting
    - **Property 17: Price Formatting**
    - **Validates: Requirements 10.4**
  
  - [ ]* 16.3 Write unit tests for price calculations
    - Test upgrade price equals full minus basic
    - Test price consistency across components
    - Test price formatting with ₽ symbol
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 17. Implement localization for upgrade UI
  - [ ] 17.1 Add upgrade translations to localization files
    - Add Russian translations for upgrade button, descriptions, errors
    - Add English translations for upgrade button, descriptions, errors
    - Ensure consistent terminology across all upgrade elements
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ]* 17.2 Write property test for localization completeness
    - **Property 18: Localization Completeness**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.5**
  
  - [ ]* 17.3 Write unit tests for localization
    - Test Russian text display
    - Test English text display
    - Test terminology consistency
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 18. Implement post-upgrade access verification
  - [ ] 18.1 Update usePurchases hook to refresh after upgrade
    - Add refresh method to usePurchases hook
    - Call refresh after successful upgrade payment
    - Update UI to reflect new purchase state
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ] 18.2 Update calculator pages to hide upgrade button after purchase
    - Check for full tier ownership in useEffect
    - Remove upgrade button when full tier detected
    - Display full tier content
    - _Requirements: 12.2, 12.4_
  
  - [ ] 18.3 Update profile page to show full tier ownership
    - Refresh purchases after upgrade
    - Display full tier badge
    - Remove from upgrade list
    - _Requirements: 12.3_
  
  - [ ] 18.4 Ensure PDF download available immediately
    - Add PDF download link to success message
    - Verify PDF accessible within 10 seconds
    - _Requirements: 12.5_
  
  - [ ]* 18.5 Write property test for post-upgrade access verification
    - **Property 19: Post-Upgrade Access Verification**
    - **Validates: Requirements 12.2, 12.3, 12.4, 12.5**
  
  - [ ]* 18.6 Write unit tests for access verification
    - Test UI updates after upgrade
    - Test upgrade button removal
    - Test PDF availability
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 19. Implement eligibility verification at all layers
  - [ ]* 19.1 Write property test for eligibility verification before actions
    - **Property 3: Eligibility Verification Before Actions**
    - **Validates: Requirements 2.4, 2.5, 8.4**
  
  - [ ]* 19.2 Write unit tests for defense in depth
    - Test eligibility check in UI layer
    - Test eligibility check in API layer
    - Test eligibility check in webhook layer
    - _Requirements: 2.4, 2.5, 8.4_

- [ ] 20. Final integration and wiring
  - [ ] 20.1 Verify all components integrated correctly
    - Test end-to-end upgrade flow from calculator page
    - Test end-to-end upgrade flow from profile page
    - Verify payment processing works with both Stripe and YooKassa
    - Verify PDF generation and download
    - _Requirements: All_
  
  - [ ]* 20.2 Write integration tests for complete upgrade flow
    - Test calculator page → payment → webhook → fulfillment
    - Test profile page → payment → webhook → fulfillment
    - Test error scenarios and refunds
    - _Requirements: All_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation uses TypeScript and integrates with existing Next.js infrastructure
- All upgrade operations include comprehensive logging for audit and troubleshooting
