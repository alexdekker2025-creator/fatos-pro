# Implementation Plan: Destiny Matrix Full Migration

## Overview

This plan migrates the complete Destiny Matrix functionality from legacy HTML/JavaScript to Next.js with TypeScript and React components. The implementation focuses on creating reusable components, extracting interpretation data, migrating images, and ensuring responsive design while maintaining calculation accuracy using the existing DestinyMatrixCalculator.

## Tasks

- [x] 1. Set up data structures and interpretation extraction
  - [x] 1.1 Create arcana interpretations data file
    - Extract all 22 arcana interpretations from `scripts/matrix_new/scripts/calculate.js`
    - Create `lib/interpretations/destinyMatrixInterpretations.ts` with TypeScript interfaces
    - Structure data with fields: number, positive, negative, communication, superpower, male, female, health, purpose, tests, love
    - Preserve all HTML formatting (br, b tags) from original
    - Export as Map for O(1) lookup
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 1.2 Write property test for interpretation data completeness
    - **Property 7: Interpretation Data Completeness**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  
  - [x] 1.3 Create chakra information data file
    - Create `lib/data/chakraInfo.ts` with chakra names, colors, and tooltip descriptions
    - Include all 7 chakras with Russian names
    - Define color constants matching original (#D83A4E, #FF6B00, #FBC93B, #1DBA08, #27AAE1, #005791, #9D2D9D)
    - _Requirements: 2.1, 2.7_
  
  - [x] 1.4 Create matrix position coordinates data file
    - Create `lib/data/matrixPositions.ts` with position coordinates for all matrix numbers
    - Extract coordinates from `scripts/matrix_new/css/calculator.css`
    - Define three sets: desktop, tablet, mobile coordinates
    - Include font size variations per breakpoint
    - _Requirements: 1.2, 1.5_

- [x] 2. Migrate image assets
  - [x] 2.1 Copy images to public directory
    - Copy all images from `scripts/matrix_new/img/` to `public/matrix/`
    - Preserve filenames: matrix.png, elipses.svg, i.svg
    - Verify image integrity after copy
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 2.2 Write property test for image path correctness
    - **Property 16: Image Path Correctness**
    - **Validates: Requirements 1.4, 5.3, 7.4**

- [x] 3. Implement MatrixDiagram component
  - [x] 3.1 Create MatrixDiagram component with responsive positioning
    - Create `components/matrix/MatrixDiagram.tsx`
    - Implement relative container with matrix.png background
    - Add absolute positioned divs for all matrix positions (A, B, C, D, E, F, G, H, X, and derived values)
    - Use position coordinates from matrixPositions data
    - Implement responsive scaling for mobile/tablet/desktop
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ]* 3.2 Write property test for matrix diagram completeness
    - **Property 1: Matrix Diagram Completeness**
    - **Validates: Requirements 1.1**
  
  - [ ]* 3.3 Write property test for matrix position accuracy
    - **Property 2: Matrix Position Accuracy**
    - **Validates: Requirements 1.2, 1.5**
  
  - [ ]* 3.4 Write unit tests for MatrixDiagram component
    - Test rendering with specific birth date
    - Test responsive behavior at breakpoints
    - Test image loading fallback
    - _Requirements: 1.1, 1.3_

- [x] 4. Implement HealthTable component
  - [x] 4.1 Create HealthTable component with chakra rows
    - Create `components/matrix/HealthTable.tsx`
    - Render 7 chakra rows with names, colors, and three columns (Physical, Energy, Emotions)
    - Add 8th row for totals (T2, T1, T3)
    - Implement color-coded circular badges for each chakra
    - Add responsive layout (table on desktop, stacked on mobile)
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 2.7_
  
  - [x] 4.2 Add tooltip functionality to HealthTable
    - Implement info icon with hover/focus tooltip
    - Display chakra health information from chakraInfo data
    - Ensure keyboard accessibility (focusable, aria-describedby)
    - _Requirements: 2.4, 13.2, 13.4_
  
  - [ ]* 4.3 Write property test for health table data mapping
    - **Property 4: Health Table Data Mapping**
    - **Validates: Requirements 2.1, 2.3**
  
  - [ ]* 4.4 Write property test for chakra color consistency
    - **Property 5: Chakra Color Consistency**
    - **Validates: Requirements 2.7**
  
  - [ ]* 4.5 Write property test for tooltip interaction
    - **Property 6: Tooltip Interaction**
    - **Validates: Requirements 2.4**
  
  - [ ]* 4.6 Write unit tests for HealthTable component
    - Test tooltip show/hide on hover
    - Test responsive layout changes
    - Test totals row calculation
    - _Requirements: 2.4, 2.6_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement InterpretationsDisplay component
  - [x] 6.1 Create InterpretationsDisplay component with collapsible sections
    - Create `components/matrix/InterpretationsDisplay.tsx`
    - Implement 7 collapsible sections: Personal Qualities, Talents, Past Lives, Health, Purpose, Tests, Relationships
    - Add accordion UI with expand/collapse functionality
    - Filter duplicate arcana (show each only once)
    - Render HTML content from interpretation data using dangerouslySetInnerHTML
    - Make sections scrollable
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 6.2 Write property test for HTML preservation in interpretations
    - **Property 8: HTML Preservation in Interpretations**
    - **Validates: Requirements 3.7**
  
  - [ ]* 6.3 Write property test for interpretation display uniqueness
    - **Property 9: Interpretation Display Uniqueness**
    - **Validates: Requirements 4.4**
  
  - [ ]* 6.4 Write property test for section toggle behavior
    - **Property 10: Section Toggle Behavior**
    - **Validates: Requirements 4.3**
  
  - [ ]* 6.5 Write property test for HTML rendering in interpretations
    - **Property 11: HTML Rendering in Interpretations**
    - **Validates: Requirements 4.5**
  
  - [ ]* 6.6 Write unit tests for InterpretationsDisplay component
    - Test section expand/collapse
    - Test duplicate arcana filtering
    - Test HTML rendering
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 7. Implement PurposeSections component
  - [x] 7.1 Create PurposeSections component with ellipse diagrams
    - Create `components/matrix/PurposeSections.tsx`
    - Implement three sections: Personal (20-40), Social (40-60), Spiritual (60+)
    - Display values: Personal (LN, LZ, LP1), Social (LO, LM, Y), Spiritual (LP1, Y, LP3)
    - Use elipses.svg image with positioned numbers
    - Implement responsive grid layout (stacks on mobile)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 7.2 Write property test for purpose section data mapping
    - **Property 12: Purpose Section Data Mapping**
    - **Validates: Requirements 5.2**
  
  - [ ]* 7.3 Write property test for ellipse number positioning
    - **Property 13: Ellipse Number Positioning**
    - **Validates: Requirements 5.4**
  
  - [ ]* 7.4 Write unit tests for PurposeSections component
    - Test responsive stacking on mobile
    - Test correct value display
    - _Requirements: 5.2, 5.5_

- [x] 8. Implement ParentsSection component
  - [x] 8.1 Create ParentsSection component
    - Create `components/matrix/ParentsSection.tsx`
    - Implement two columns: Man (Муж) and Woman (Жен)
    - Display values: Man (E, G, X), Woman (F, H, X)
    - Use circular badges with rounded-full styling
    - Implement responsive layout (stacks on mobile)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 8.2 Write property test for parents section data mapping
    - **Property 14: Parents Section Data Mapping**
    - **Validates: Requirements 6.2**
  
  - [ ]* 8.3 Write property test for circular badge styling
    - **Property 15: Circular Badge Styling**
    - **Validates: Requirements 6.3**
  
  - [ ]* 8.4 Write unit tests for ParentsSection component
    - Test responsive stacking
    - Test circular badge rendering
    - _Requirements: 6.3, 6.4_

- [x] 9. Implement TalentsDisplay component
  - [x] 9.1 Create TalentsDisplay component
    - Create `components/matrix/TalentsDisplay.tsx`
    - Display T1, T2, T3 values in prominent layout
    - Use amber/gold gradient background styling
    - Include interpretation for each talent value
    - Center layout with large, bold numbers
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ]* 9.2 Write property test for talent interpretation display
    - **Property 18: Talent Interpretation Display**
    - **Validates: Requirements 10.3**
  
  - [ ]* 9.3 Write unit tests for TalentsDisplay component
    - Test styling (amber/gold background)
    - Test interpretation display
    - _Requirements: 10.2, 10.3_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement age calculation utility
  - [x] 11.1 Create age calculation function
    - Create `lib/utils/ageCalculation.ts`
    - Implement function to calculate age from birth date and current date
    - Account for whether birthday has occurred this year
    - Add TypeScript types for date parameters
    - _Requirements: 9.1, 9.3, 9.4_
  
  - [ ]* 11.2 Write property test for age calculation accuracy
    - **Property 17: Age Calculation Accuracy**
    - **Validates: Requirements 9.1, 9.3, 9.4**
  
  - [ ]* 11.3 Write unit tests for age calculation
    - Test with birthday before current date this year
    - Test with birthday after current date this year
    - Test leap year edge cases
    - _Requirements: 9.1, 9.3_

- [x] 12. Integrate components into main matrix page
  - [x] 12.1 Update matrix page with all components
    - Update `app/ru/matrix/page.tsx`
    - Import and integrate all matrix components
    - Add state management for matrix calculation result
    - Display age alongside name and birth date
    - Implement lazy loading for interpretations (only show after calculation)
    - Add responsive layout with Tailwind CSS
    - Apply FATOS theme (purple/amber colors)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.2, 11.1, 11.2, 11.3, 11.4, 11.5, 14.1, 15.1, 15.2, 15.3_
  
  - [ ]* 12.2 Write property test for responsive layout adaptation
    - **Property 3: Responsive Layout Adaptation**
    - **Validates: Requirements 1.3, 2.6, 5.5, 6.4, 8.1, 8.5**
  
  - [ ]* 12.3 Write property test for lazy loading behavior
    - **Property 22: Lazy Loading Behavior**
    - **Validates: Requirements 14.1**
  
  - [ ]* 12.4 Write property test for state persistence
    - **Property 23: State Persistence**
    - **Validates: Requirements 15.2, 15.3**
  
  - [ ]* 12.5 Write integration tests for full calculation flow
    - Test complete user flow: input date → calculate → display results
    - Test state persistence across interactions
    - Test recalculation with new date
    - _Requirements: 15.1, 15.2, 15.3_

- [ ] 13. Implement error handling and boundaries
  - [ ] 13.1 Create MatrixErrorBoundary component
    - Create `components/matrix/MatrixErrorBoundary.tsx`
    - Implement React error boundary to catch rendering errors
    - Display fallback UI with error message in Russian
    - Log errors for debugging
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 13.2 Add missing data handling
    - Implement fallback for missing interpretations
    - Add console warnings for missing data
    - Provide default messages in Russian
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 13.3 Write unit tests for error handling
    - Test error boundary activation
    - Test missing interpretation fallback
    - Test image loading errors
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 14. Implement accessibility features
  - [ ] 14.1 Add ARIA attributes and keyboard navigation
    - Add aria-label, aria-expanded, aria-describedby to interactive elements
    - Ensure all buttons and collapsible sections are keyboard accessible
    - Make tooltips keyboard accessible (show on focus)
    - Add proper focus management
    - _Requirements: 13.2, 13.4_
  
  - [ ] 14.2 Add semantic HTML and alt text
    - Use semantic HTML elements (table, section, article)
    - Add descriptive alt text in Russian for all images
    - Ensure proper heading hierarchy
    - _Requirements: 13.1, 13.5_
  
  - [ ] 14.3 Verify color contrast
    - Ensure all text meets WCAG AA contrast ratios (4.5:1 for normal, 3:1 for large)
    - Test with contrast checker tools
    - Adjust colors if needed while maintaining FATOS theme
    - _Requirements: 13.3_
  
  - [ ]* 14.4 Write property test for accessibility - interactive elements
    - **Property 19: Accessibility - Interactive Elements**
    - **Validates: Requirements 13.2, 13.4**
  
  - [ ]* 14.5 Write property test for accessibility - image alt text
    - **Property 20: Accessibility - Image Alt Text**
    - **Validates: Requirements 13.5**
  
  - [ ]* 14.6 Write property test for accessibility - color contrast
    - **Property 21: Accessibility - Color Contrast**
    - **Validates: Requirements 13.3**
  
  - [ ]* 14.7 Run automated accessibility tests
    - Use jest-axe to check for a11y violations
    - Test with keyboard navigation
    - Verify screen reader compatibility
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 15. Optimize performance
  - [ ] 15.1 Implement image optimization
    - Use Next.js Image component for matrix.png
    - Preload critical images (matrix.png)
    - Lazy load non-critical images
    - Inline small SVG icons
    - _Requirements: 14.2, 14.3_
  
  - [ ] 15.2 Optimize bundle size
    - Implement code splitting for interpretation data
    - Lazy load InterpretationsDisplay component
    - Minimize component re-renders with React.memo
    - _Requirements: 14.1, 14.3_
  
  - [ ]* 15.3 Run performance tests
    - Test page load time on simulated 3G connection
    - Verify load time < 2 seconds
    - Use Lighthouse CI for performance metrics
    - Profile with React DevTools
    - _Requirements: 14.4_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The existing DestinyMatrixCalculator handles all calculations - no changes needed
- All Russian text must be preserved exactly as in original scripts
- Property tests use fast-check library with minimum 100 iterations
- Focus on maintaining visual and functional parity with original implementation
