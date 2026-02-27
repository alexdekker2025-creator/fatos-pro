# Requirements Document: Destiny Matrix Full Migration

## Introduction

This document specifies the requirements for migrating the complete Destiny Matrix (Матрица Судьбы) functionality from existing HTML/JavaScript scripts to a Next.js application. The migration includes visualization, health tables, arcana interpretations, images, and styling while maintaining all existing functionality and improving the user experience with modern React components and responsive design.

## Glossary

- **Destiny_Matrix**: A numerological analysis system based on birth date and Tarot arcana (22 major arcana)
- **Arcana**: Tarot cards numbered 1-22, each with specific meanings and interpretations
- **Chakra**: Energy centers in the body (7 total), each associated with specific health aspects
- **Matrix_Diagram**: Visual representation showing all calculated positions and their relationships
- **Calculator**: The existing TypeScript module that performs matrix calculations
- **Legacy_Scripts**: Original HTML/JS implementation in `scripts/matrix_new/`
- **Next_App**: Target Next.js application at `app/ru/matrix/page.tsx`
- **Interpretation_Text**: Detailed descriptions for each arcana (positive/negative aspects, gender-specific)
- **Health_Table**: Table showing 7 chakras with physical/energy/emotional columns
- **Responsive_Design**: UI that adapts to mobile, tablet, and desktop screen sizes
- **FATOS_Theme**: Purple/amber color scheme used throughout the application

## Requirements

### Requirement 1: Matrix Visualization Component

**User Story:** As a user, I want to see a visual diagram of my destiny matrix, so that I can understand the relationships between different positions.

#### Acceptance Criteria

1. WHEN the matrix is calculated, THE Matrix_Diagram SHALL display all calculated positions overlaid on the matrix image
2. THE Matrix_Diagram SHALL show numbers at correct positions matching the original layout
3. THE Matrix_Diagram SHALL be responsive and scale appropriately for mobile, tablet, and desktop viewports
4. THE Matrix_Diagram SHALL use the matrix image from `scripts/matrix_new/img/matrix.png`
5. THE Matrix_Diagram SHALL position numbers using CSS absolute positioning matching original coordinates
6. FOR ALL viewport sizes, THE Matrix_Diagram SHALL maintain proper aspect ratio and readability

### Requirement 2: Health Table (Chakras) Component

**User Story:** As a user, I want to see my health map with chakra information, so that I can understand health aspects related to my matrix.

#### Acceptance Criteria

1. WHEN the matrix is calculated, THE Health_Table SHALL display 7 chakras with their names in Russian
2. THE Health_Table SHALL show three columns: Physical (Физика), Energy (Энергия), and Emotions (Эмоции)
3. FOR EACH chakra row, THE Health_Table SHALL display the corresponding calculated values
4. WHEN a user hovers over a chakra info icon, THE Health_Table SHALL display a tooltip with detailed health information
5. THE Health_Table SHALL include an 8th row showing result totals (T1, T2, T3)
6. THE Health_Table SHALL be responsive and adapt layout for mobile devices
7. THE Health_Table SHALL use color coding matching the original (red, orange, yellow, green, blue, dark blue, purple)

### Requirement 3: Arcana Interpretations Data

**User Story:** As a user, I want to read detailed interpretations for each arcana in my matrix, so that I can understand their meanings.

#### Acceptance Criteria

1. THE Interpretation_Text SHALL include complete descriptions for all 22 arcana
2. FOR EACH arcana, THE Interpretation_Text SHALL include positive aspects section
3. FOR EACH arcana, THE Interpretation_Text SHALL include negative aspects section
4. WHERE gender-specific interpretations exist, THE Interpretation_Text SHALL include separate sections for men and women
5. THE Interpretation_Text SHALL be extracted from `scripts/matrix_new/scripts/calculate.js`
6. THE Interpretation_Text SHALL be stored in a TypeScript file with proper type definitions
7. THE Interpretation_Text SHALL preserve all HTML formatting from the original (line breaks, bold text)

### Requirement 4: Interpretations Display Component

**User Story:** As a user, I want to see interpretations for the arcana in my matrix, so that I can learn about my personality traits and life path.

#### Acceptance Criteria

1. WHEN the matrix is calculated, THE Interpretations_Display SHALL show relevant arcana interpretations
2. THE Interpretations_Display SHALL organize interpretations into collapsible sections (Personal Qualities, Talents, Health, Purpose, etc.)
3. WHEN a user clicks a section header, THE Interpretations_Display SHALL expand or collapse that section
4. THE Interpretations_Display SHALL display only unique arcana (no duplicates)
5. THE Interpretations_Display SHALL render HTML content from interpretation text
6. THE Interpretations_Display SHALL be scrollable and not overwhelm the page

### Requirement 5: Purpose Sections (Personal/Social/Spiritual)

**User Story:** As a user, I want to see my life purpose broken down by age periods, so that I can understand my path at different life stages.

#### Acceptance Criteria

1. THE Purpose_Display SHALL show three sections: Personal (20-40 years), Social (40-60 years), and Spiritual (60+ years)
2. FOR EACH purpose section, THE Purpose_Display SHALL display the relevant calculated values
3. THE Purpose_Display SHALL use the ellipse diagram image from original scripts
4. THE Purpose_Display SHALL position numbers correctly on the ellipse diagrams
5. THE Purpose_Display SHALL be responsive and adapt for mobile devices

### Requirement 6: Parents Section

**User Story:** As a user, I want to see the parental energy programs in my matrix, so that I can understand inherited patterns.

#### Acceptance Criteria

1. THE Parents_Display SHALL show two sections: Man (Муж) and Woman (Жен)
2. FOR EACH parent section, THE Parents_Display SHALL display three values (E/G/X for man, F/H/X for woman)
3. THE Parents_Display SHALL use circular badges for displaying values
4. THE Parents_Display SHALL be responsive and stack vertically on mobile

### Requirement 7: Image Asset Migration

**User Story:** As a developer, I want all images properly migrated to the Next.js public folder, so that they load correctly in the application.

#### Acceptance Criteria

1. THE Migration_Process SHALL copy all images from `scripts/matrix_new/img/` to `public/matrix/`
2. THE Migration_Process SHALL preserve image file names and formats
3. THE Next_App SHALL reference images using Next.js Image component where appropriate
4. THE Next_App SHALL use correct paths (`/matrix/filename.ext`) for all matrix images

### Requirement 8: Responsive Styling

**User Story:** As a user, I want the matrix page to work well on my device, so that I can view it on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Next_App SHALL be fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+) viewports
2. THE Next_App SHALL use Tailwind CSS for all styling
3. THE Next_App SHALL match the FATOS_Theme (purple/amber color scheme)
4. THE Next_App SHALL adapt the original CSS from `calculator.css` and `style-new.css` to Tailwind classes
5. WHEN viewport width is below 768px, THE Next_App SHALL stack components vertically
6. THE Next_App SHALL maintain readability and usability at all viewport sizes

### Requirement 9: Age Calculation Display

**User Story:** As a user, I want to see my current age calculated from my birth date, so that I know which life period applies to me.

#### Acceptance Criteria

1. WHEN a birth date is entered, THE Calculator SHALL compute the user's current age in years
2. THE Next_App SHALL display the calculated age alongside name and birth date
3. THE Age_Calculation SHALL account for whether the birthday has occurred this year
4. THE Age_Calculation SHALL update based on current date

### Requirement 10: Talents Display

**User Story:** As a user, I want to see my talents (T1, T2, T3) prominently displayed, so that I can quickly identify my key strengths.

#### Acceptance Criteria

1. THE Talents_Display SHALL show the three talent values (T1, T2, T3) in a highlighted section
2. THE Talents_Display SHALL use amber/gold styling to make it stand out
3. THE Talents_Display SHALL include interpretations for each talent value
4. THE Talents_Display SHALL be positioned prominently in the results layout

### Requirement 11: Component Architecture

**User Story:** As a developer, I want the code organized into reusable React components, so that the codebase is maintainable and testable.

#### Acceptance Criteria

1. THE Next_App SHALL create separate components for: MatrixDiagram, HealthTable, InterpretationsDisplay, PurposeSections, ParentsSection
2. EACH component SHALL be in its own file under `components/matrix/`
3. EACH component SHALL use TypeScript with proper type definitions
4. EACH component SHALL accept props for data and configuration
5. THE Next_App SHALL use the existing DestinyMatrixCalculator for all calculations

### Requirement 12: Interpretation Data Structure

**User Story:** As a developer, I want arcana interpretations stored in a structured format, so that they can be easily accessed and maintained.

#### Acceptance Criteria

1. THE Interpretation_Data SHALL be stored in `lib/interpretations/destinyMatrixInterpretations.ts`
2. THE Interpretation_Data SHALL use TypeScript interfaces defining the structure
3. THE Interpretation_Data SHALL organize interpretations by arcana number (1-22)
4. THE Interpretation_Data SHALL include fields for: positive, negative, communication, superpower, male, female
5. THE Interpretation_Data SHALL export a typed object or map for easy lookup

### Requirement 13: Accessibility

**User Story:** As a user with accessibility needs, I want the matrix page to be accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. THE Next_App SHALL use semantic HTML elements (table, section, article, etc.)
2. THE Next_App SHALL include proper ARIA labels for interactive elements
3. THE Next_App SHALL ensure sufficient color contrast for text readability
4. THE Next_App SHALL make tooltips keyboard accessible
5. THE Next_App SHALL include alt text for all images

### Requirement 14: Performance Optimization

**User Story:** As a user, I want the matrix page to load quickly, so that I have a smooth experience.

#### Acceptance Criteria

1. THE Next_App SHALL lazy load interpretation text until matrix is calculated
2. THE Next_App SHALL optimize images using Next.js Image component
3. THE Next_App SHALL minimize bundle size by code splitting where appropriate
4. WHEN the page loads, THE Next_App SHALL render within 2 seconds on 3G connection

### Requirement 15: Data Persistence

**User Story:** As a user, I want my calculation to persist during my session, so that I don't lose my results if I navigate away.

#### Acceptance Criteria

1. WHEN a matrix is calculated, THE Next_App SHALL store the result in component state
2. THE Next_App SHALL maintain the calculation result until the user enters a new date
3. THE Next_App SHALL allow users to recalculate with a new date without page reload

## Notes

- The existing calculator at `lib/calculators/destinyMatrix.ts` already handles all mathematical calculations correctly
- Focus on UI/UX migration and data presentation
- Maintain backward compatibility with existing calculation logic
- All Russian text should be preserved exactly as in original scripts
- Consider creating a separate interpretation extraction script to parse `calculate.js` and generate TypeScript data file
