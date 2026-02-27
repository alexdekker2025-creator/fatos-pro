# Design Document: Destiny Matrix Full Migration

## Overview

This design document outlines the technical implementation for migrating the complete Destiny Matrix (Матрица Судьбы) functionality from legacy HTML/JavaScript scripts to a modern Next.js application. The migration encompasses visualization components, health tables, arcana interpretations, image assets, and responsive styling while maintaining all existing functionality and improving user experience.

### Goals

- Create a maintainable, type-safe React component architecture
- Migrate all visual elements (matrix diagram, health tables, purpose sections)
- Extract and structure arcana interpretation data
- Implement responsive design using Tailwind CSS
- Maintain calculation accuracy using existing DestinyMatrixCalculator
- Ensure accessibility compliance
- Optimize performance for fast page loads

### Non-Goals

- Modifying the calculation logic (already implemented in `lib/calculators/destinyMatrix.ts`)
- Creating new features beyond the original implementation
- Backend API development (client-side only)
- Multi-language support (Russian only for this phase)

## Architecture

### High-Level Structure

```
app/ru/matrix/page.tsx (Main page component)
├── components/matrix/
│   ├── MatrixDiagram.tsx (Visual matrix with positioned numbers)
│   ├── HealthTable.tsx (7 chakras health map)
│   ├── InterpretationsDisplay.tsx (Collapsible sections)
│   ├── PurposeSections.tsx (Personal/Social/Spiritual)
│   ├── ParentsSection.tsx (Parental programs)
│   └── TalentsDisplay.tsx (T1, T2, T3 highlighted)
├── lib/interpretations/
│   └── destinyMatrixInterpretations.ts (Structured interpretation data)
└── public/matrix/
    └── (migrated images)
```

### Data Flow

1. User inputs birth date → validation
2. DestinyMatrixCalculator computes all positions
3. Result passed to display components as props
4. Components look up interpretations from structured data
5. Responsive layout adapts to viewport size

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState (component-level)
- **Images**: Next.js Image component for optimization
- **Calculator**: Existing DestinyMatrixCalculator class

## Components and Interfaces

### 1. MatrixDiagram Component

**Purpose**: Display the visual matrix diagram with all calculated positions overlaid on the matrix image.

**Props Interface**:
```typescript
interface MatrixDiagramProps {
  matrix: DestinyMatrixResult;
  className?: string;
}
```

**Implementation Details**:
- Container with relative positioning
- Background image: `/matrix/matrix.png`
- Absolute positioned divs for each number
- Responsive scaling using CSS transforms or viewport units
- Breakpoints: mobile (375px), tablet (768px), desktop (1024px+)

**Position Mapping** (from calculator.css):
- Uses classes like `.number1`, `.number12`, etc.
- Each position has specific top/left coordinates
- Mobile coordinates differ significantly (see @media queries)

### 2. HealthTable Component

**Purpose**: Display 7 chakras with physical/energy/emotional columns and tooltips.

**Props Interface**:
```typescript
interface HealthTableProps {
  matrix: DestinyMatrixResult;
  className?: string;
}

interface ChakraRow {
  number: number;
  name: string;
  color: string;
  physical: number;
  energy: number;
  emotions: number;
  tooltip: string;
}
```

**Implementation Details**:
- 7 chakra rows + 1 totals row
- Color coding: red, orange, yellow, green, blue, dark blue, purple
- Tooltip on hover/focus (accessible)
- Responsive: stacks on mobile, table on desktop
- Uses Tailwind for shadows and rounded corners

**Chakra Data**:
```typescript
const chakras: ChakraRow[] = [
  {
    number: 1,
    name: 'Муладхара',
    color: '#D83A4E',
    physical: matrix.chakra1.C,
    energy: matrix.chakra1.D,
    emotions: matrix.chakra1.K1,
    tooltip: 'Отвечает за - Мочеполовая система...'
  },
  // ... 6 more chakras
];
```

### 3. InterpretationsDisplay Component

**Purpose**: Show arcana interpretations organized into collapsible sections.

**Props Interface**:
```typescript
interface InterpretationsDisplayProps {
  matrix: DestinyMatrixResult;
  sections: InterpretationSection[];
  className?: string;
}

interface InterpretationSection {
  id: string;
  title: string;
  arcanaKeys: (keyof DestinyMatrixResult)[];
  defaultOpen?: boolean;
}
```

**Sections**:
1. Личностные качества (Personal Qualities)
2. Таланты (Talents)
3. Прошлая жизнь (Past Lives)
4. Здоровье (Health)
5. Предназначение (Purpose)
6. Испытания (Tests)
7. Отношения и любовь (Relationships and Love)

**Implementation Details**:
- Accordion/collapsible UI pattern
- Unique arcana only (no duplicates)
- Renders HTML content from interpretations
- Smooth expand/collapse animations
- Scrollable content area

### 4. PurposeSections Component

**Purpose**: Display three life purpose periods with ellipse diagrams.

**Props Interface**:
```typescript
interface PurposeSectionsProps {
  matrix: DestinyMatrixResult;
  className?: string;
}

interface PurposeSection {
  title: string;
  ageRange: string;
  labels: [string, string];
  values: [number, number, number];
  image: string;
}
```

**Sections**:
1. Personal (20-40 years): LN, LZ, LP1
2. Social (40-60 years): LO, LM, Y
3. Spiritual (60+ years): LP1, Y, LP3

**Implementation Details**:
- Ellipse diagram image with positioned numbers
- Responsive grid layout
- Stacks vertically on mobile

### 5. ParentsSection Component

**Purpose**: Display parental energy programs.

**Props Interface**:
```typescript
interface ParentsSectionProps {
  matrix: DestinyMatrixResult;
  className?: string;
}
```

**Implementation Details**:
- Two columns: Man (Муж) and Woman (Жен)
- Circular badges for values
- Man: E, G, X
- Woman: F, H, X
- Responsive: stacks on mobile

### 6. TalentsDisplay Component

**Purpose**: Prominently display the three talent values.

**Props Interface**:
```typescript
interface TalentsDisplayProps {
  talents: { T1: number; T2: number; T3: number };
  className?: string;
}
```

**Implementation Details**:
- Amber/gold gradient background
- Large, bold numbers
- Centered layout
- Includes brief interpretation for each talent

## Data Models

### Arcana Interpretation Structure

```typescript
interface ArcanaInterpretation {
  number: number; // 1-22
  positive: string; // HTML string
  negative: string; // HTML string
  communication?: string; // HTML string
  superpower?: string; // HTML string
  male?: string; // HTML string (gender-specific)
  female?: string; // HTML string (gender-specific)
  health?: string; // HTML string
  purpose?: string; // HTML string
  tests?: string; // HTML string
  love?: string; // HTML string
}

// Export as map for O(1) lookup
export const destinyMatrixInterpretations: Map<number, ArcanaInterpretation>;
```

### Chakra Tooltip Data

```typescript
interface ChakraInfo {
  name: string;
  color: string;
  description: string;
}

export const chakraInfo: ChakraInfo[] = [
  {
    name: 'Муладхара',
    color: '#D83A4E',
    description: 'Отвечает за - Мочеполовая система, нижние конечности...'
  },
  // ... 6 more
];
```

### Position Coordinates

```typescript
interface MatrixPosition {
  id: string;
  desktop: { top: string; left: string };
  tablet: { top: string; left: string };
  mobile: { top: string; left: string };
  fontSize?: { desktop: string; tablet: string; mobile: string };
}

export const matrixPositions: Record<string, MatrixPosition>;
```

## Styling Approach

### Color Scheme (FATOS Theme)

```typescript
// Tailwind config extension
colors: {
  matrix: {
    chakra1: '#D83A4E', // Red
    chakra2: '#FF6B00', // Orange
    chakra3: '#FBC93B', // Yellow
    chakra4: '#1DBA08', // Green
    chakra5: '#27AAE1', // Blue
    chakra6: '#005791', // Dark Blue
    chakra7: '#9D2D9D', // Purple
    text: '#5A5A5A',    // Gray text
    accent: '#F95954',  // Red accent
  }
}
```

### Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### CSS Migration Strategy

1. Convert absolute positioning to Tailwind utilities
2. Use `@apply` for complex repeated patterns
3. Maintain exact pixel values for matrix positions
4. Use CSS Grid for health table
5. Flexbox for purpose sections
6. Responsive utilities: `sm:`, `md:`, `lg:`

### Key Tailwind Patterns

```typescript
// Glass effect (existing pattern)
className="glass-strong rounded-lg p-6 border border-purple-400/30"

// Matrix container
className="relative w-full max-w-[600px] mx-auto"

// Health table row
className="flex items-center justify-between bg-white shadow-md rounded-[20px] p-4"

// Chakra badge
className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
```

## Image Handling

### Migration Plan

1. Copy all images from `scripts/matrix_new/img/` to `public/matrix/`
2. Preserve filenames: `matrix.png`, `elipses.svg`, `i.svg`
3. Use Next.js Image component where beneficial
4. Direct `<img>` tags for positioned overlays

### Image References

```typescript
// Matrix diagram
<Image src="/matrix/matrix.png" alt="Матрица Судьбы" width={600} height={600} />

// Ellipse diagrams
<Image src="/matrix/elipses.svg" alt="Предназначение" width={95} height={120} />

// Info icon
<img src="/matrix/i.svg" alt="info" className="w-4 h-4" />
```

### Optimization

- Use WebP format for PNG images (Next.js automatic)
- Lazy load interpretation sections
- Preload matrix.png (critical)
- SVGs inline for small icons

## Visualization Strategy

### Matrix Diagram Positioning

**Approach**: Absolute positioning with responsive coordinates

**Rationale**: The original implementation uses precise pixel positioning that works well. We'll maintain this approach but make it responsive.

**Implementation**:
```typescript
// Desktop positions (from calculator.css)
const positions = {
  number1: { top: '52px', left: '320.5px' },
  number12: { top: '93px', left: '318.5px' },
  // ... all positions
};

// Component
<div className="relative">
  <img src="/matrix/matrix.png" className="w-full" />
  {Object.entries(positions).map(([key, pos]) => (
    <div
      key={key}
      className="absolute text-sm font-semibold text-gray-600"
      style={{ top: pos.top, left: pos.left }}
    >
      {matrix[key]}
    </div>
  ))}
</div>
```

**Responsive Strategy**:
- Use percentage-based positioning calculated from original pixels
- Or use CSS transforms with scale
- Or maintain three sets of coordinates (desktop/tablet/mobile)

**Chosen Approach**: Three coordinate sets for precision

### SVG vs PNG

- **Matrix diagram**: PNG (photographic quality, existing asset)
- **Ellipse diagrams**: SVG (scalable, small file size)
- **Icons**: SVG inline (flexibility, styling)

### Responsive Scaling

```typescript
// Container scales, positions adjust
<div className="w-full max-w-[600px] md:max-w-[600px] sm:max-w-[375px]">
  {/* Matrix content */}
</div>
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Responsive behavior properties** (1.3, 2.6, 5.5, 6.4, 8.1, 8.5) can be consolidated into comprehensive responsive layout properties
2. **Component rendering properties** (1.1, 2.1, 4.1) share the same pattern: "for any matrix, display correct data"
3. **Data structure properties** (3.2, 3.3) both verify field existence and can be combined
4. **Image path properties** (1.4, 5.3, 7.4) all verify correct image references
5. **Accessibility properties** (13.2, 13.3, 13.4, 13.5) can be grouped into comprehensive accessibility checks

### Property 1: Matrix Diagram Completeness

*For any* calculated DestinyMatrixResult, the MatrixDiagram component SHALL render all required positions (A, B, C, D, E, F, G, H, X, and all derived values) as visible DOM elements.

**Validates: Requirements 1.1**

### Property 2: Matrix Position Accuracy

*For any* matrix position, the rendered element SHALL have CSS coordinates (top, left) that match the reference coordinates from the original implementation within a tolerance of 2px.

**Validates: Requirements 1.2, 1.5**

### Property 3: Responsive Layout Adaptation

*For any* viewport width (mobile: 320-767px, tablet: 768-1023px, desktop: 1024px+), all components SHALL adapt their layout appropriately: matrix diagram scales, health table adjusts columns, purpose sections stack on mobile, and parents section stacks vertically on mobile.

**Validates: Requirements 1.3, 2.6, 5.5, 6.4, 8.1, 8.5**

### Property 4: Health Table Data Mapping

*For any* calculated DestinyMatrixResult, each of the 7 chakra rows SHALL display the correct values from the matrix: chakra N displays (chakraN.physical, chakraN.energy, chakraN.emotions), and the totals row displays (T2, T1, T3).

**Validates: Requirements 2.1, 2.3**

### Property 5: Chakra Color Consistency

*For any* chakra row (1-7), the color styling SHALL match the original color scheme: chakra 1 = #D83A4E (red), chakra 2 = #FF6B00 (orange), chakra 3 = #FBC93B (yellow), chakra 4 = #1DBA08 (green), chakra 5 = #27AAE1 (blue), chakra 6 = #005791 (dark blue), chakra 7 = #9D2D9D (purple).

**Validates: Requirements 2.7**

### Property 6: Tooltip Interaction

*For any* chakra info icon, hovering or focusing on the icon SHALL display a tooltip containing the chakra's health information, and moving away or blurring SHALL hide the tooltip.

**Validates: Requirements 2.4**

### Property 7: Interpretation Data Completeness

*For any* arcana number from 1 to 22, the interpretation data structure SHALL include both positive and negative aspects fields with non-empty HTML content.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 8: HTML Preservation in Interpretations

*For any* interpretation text field, the content SHALL preserve HTML formatting including `<br>`, `<b>`, and paragraph tags from the original source.

**Validates: Requirements 3.7**

### Property 9: Interpretation Display Uniqueness

*For any* calculated DestinyMatrixResult, if an arcana number appears multiple times in the matrix, the InterpretationsDisplay SHALL render that arcana's interpretation only once.

**Validates: Requirements 4.4**

### Property 10: Section Toggle Behavior

*For any* collapsible section in InterpretationsDisplay, clicking the section header SHALL toggle the visibility state: if collapsed, it expands; if expanded, it collapses.

**Validates: Requirements 4.3**

### Property 11: HTML Rendering in Interpretations

*For any* interpretation text containing HTML markup, the rendered output SHALL display the HTML as formatted elements (not escaped text), so `<br>` creates line breaks and `<b>` creates bold text.

**Validates: Requirements 4.5**

### Property 12: Purpose Section Data Mapping

*For any* calculated DestinyMatrixResult, the three purpose sections SHALL display the correct values: Personal shows (LN, LZ, LP1), Social shows (LO, LM, Y), and Spiritual shows (LP1, Y, LP3).

**Validates: Requirements 5.2**

### Property 13: Ellipse Number Positioning

*For any* purpose section, the three numbers SHALL be positioned at the correct coordinates on the ellipse diagram: top-left, top-right, and bottom-center positions.

**Validates: Requirements 5.4**

### Property 14: Parents Section Data Mapping

*For any* calculated DestinyMatrixResult, the Parents section SHALL display correct values: Man section shows (E, G, X) and Woman section shows (F, H, X) from the matrix.

**Validates: Requirements 6.2**

### Property 15: Circular Badge Styling

*For any* value displayed in the Parents section, the element SHALL have circular styling (border-radius: 50% or Tailwind rounded-full class).

**Validates: Requirements 6.3**

### Property 16: Image Path Correctness

*For any* image reference in matrix components, the src attribute SHALL use the correct path format: `/matrix/{filename}.{ext}` where filename matches the original asset name.

**Validates: Requirements 1.4, 5.3, 7.4**

### Property 17: Age Calculation Accuracy

*For any* birth date and current date, the calculated age SHALL equal the difference in years, minus 1 if the birthday hasn't occurred yet this calendar year.

**Validates: Requirements 9.1, 9.3, 9.4**

### Property 18: Talent Interpretation Display

*For any* talent value (T1, T2, or T3), the TalentsDisplay SHALL show an interpretation for that specific arcana number.

**Validates: Requirements 10.3**

### Property 19: Accessibility - Interactive Elements

*For any* interactive element (buttons, collapsible sections, tooltips), the element SHALL include appropriate ARIA attributes (aria-label, aria-expanded, aria-describedby) and be keyboard accessible (focusable and operable with Enter/Space keys).

**Validates: Requirements 13.2, 13.4**

### Property 20: Accessibility - Image Alt Text

*For any* image element in the application, the element SHALL include a descriptive alt attribute with Russian text describing the image purpose.

**Validates: Requirements 13.5**

### Property 21: Accessibility - Color Contrast

*For any* text element, the color contrast ratio between text and background SHALL meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 13.3**

### Property 22: Lazy Loading Behavior

*For any* page load, interpretation data SHALL NOT be rendered in the DOM until a matrix calculation has been performed (matrix state is not null).

**Validates: Requirements 14.1**

### Property 23: State Persistence

*For any* calculated matrix result, the result SHALL remain in component state and visible on screen until the user triggers a new calculation by clicking the calculate button.

**Validates: Requirements 15.2, 15.3**

## Error Handling

### Input Validation

**Birth Date Validation**:
- Reuse existing `validateBirthDate` function from `lib/validation/date.ts`
- Display error messages in Russian
- Prevent calculation with invalid dates

**Error States**:
```typescript
interface ValidationError {
  field: 'day' | 'month' | 'year' | 'general';
  message: string;
}
```

### Component Error Boundaries

**Strategy**: Wrap major sections in error boundaries to prevent full page crashes.

```typescript
// components/matrix/MatrixErrorBoundary.tsx
class MatrixErrorBoundary extends React.Component {
  // Catches rendering errors in matrix components
  // Displays fallback UI with error message
  // Logs error for debugging
}
```

### Missing Data Handling

**Interpretation Lookup**:
```typescript
function getInterpretation(arcana: number): ArcanaInterpretation {
  const interpretation = destinyMatrixInterpretations.get(arcana);
  if (!interpretation) {
    console.error(`Missing interpretation for arcana ${arcana}`);
    return {
      number: arcana,
      positive: 'Интерпретация временно недоступна',
      negative: 'Интерпретация временно недоступна',
    };
  }
  return interpretation;
}
```

### Image Loading Errors

**Fallback Strategy**:
- Use Next.js Image component's built-in error handling
- Provide fallback background color for matrix diagram
- Log missing images to console

### Responsive Breakpoint Edge Cases

**Handling**:
- Test at exact breakpoint values (767px, 1023px)
- Ensure no layout breaks at edge cases
- Use inclusive breakpoint ranges

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Specific birth date calculations (e.g., Feb 29 leap year)
- Component rendering with known matrix values
- Tooltip show/hide interactions
- Section collapse/expand behavior
- Error boundary activation
- Image loading fallback

**Property Tests**: Verify universal properties across all inputs
- Matrix position rendering for random birth dates
- Responsive layout at random viewport widths
- Data mapping accuracy for generated matrices
- Age calculation for random dates
- Interpretation uniqueness for any matrix

### Property-Based Testing Configuration

**Library**: `fast-check` (JavaScript/TypeScript property testing library)

**Configuration**:
```typescript
import fc from 'fast-check';

// Minimum 100 iterations per property test
fc.assert(
  fc.property(
    birthDateArbitrary,
    (birthDate) => {
      // Property test implementation
    }
  ),
  { numRuns: 100 }
);
```

**Generators (Arbitraries)**:
```typescript
// Generate valid birth dates
const birthDateArbitrary = fc.record({
  day: fc.integer({ min: 1, max: 31 }),
  month: fc.integer({ min: 1, max: 12 }),
  year: fc.integer({ min: 1900, max: new Date().getFullYear() }),
}).filter(validateBirthDate);

// Generate viewport widths
const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

// Generate arcana numbers
const arcanaArbitrary = fc.integer({ min: 1, max: 22 });
```

**Test Tagging**:
Each property test MUST include a comment referencing the design property:

```typescript
// Feature: destiny-matrix-full-migration, Property 1: Matrix Diagram Completeness
test('renders all matrix positions for any birth date', () => {
  fc.assert(
    fc.property(birthDateArbitrary, (birthDate) => {
      const calculator = new DestinyMatrixCalculator();
      const matrix = calculator.calculate(birthDate);
      const { container } = render(<MatrixDiagram matrix={matrix} />);
      
      // Verify all positions are rendered
      const positions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'X'];
      positions.forEach(pos => {
        expect(container.querySelector(`[data-position="${pos}"]`)).toBeInTheDocument();
      });
    }),
    { numRuns: 100 }
  );
});
```

### Unit Test Examples

**Component Rendering**:
```typescript
describe('MatrixDiagram', () => {
  it('displays matrix for specific birth date', () => {
    const matrix = new DestinyMatrixCalculator().calculate({
      day: 15,
      month: 6,
      year: 1990
    });
    const { getByText } = render(<MatrixDiagram matrix={matrix} />);
    expect(getByText(matrix.A.toString())).toBeInTheDocument();
  });
});
```

**Interaction Testing**:
```typescript
describe('HealthTable', () => {
  it('shows tooltip on hover', async () => {
    const { getByRole, getByText } = render(<HealthTable matrix={mockMatrix} />);
    const infoIcon = getByRole('button', { name: /информация/i });
    
    await userEvent.hover(infoIcon);
    expect(getByText(/Мочеполовая система/i)).toBeVisible();
    
    await userEvent.unhover(infoIcon);
    expect(getByText(/Мочеполовая система/i)).not.toBeVisible();
  });
});
```

**Responsive Testing**:
```typescript
describe('Responsive Layout', () => {
  it('stacks purpose sections on mobile', () => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    
    const { container } = render(<PurposeSections matrix={mockMatrix} />);
    const sections = container.querySelectorAll('.purpose-section');
    
    // Verify vertical stacking
    expect(sections[0].getBoundingClientRect().top)
      .toBeLessThan(sections[1].getBoundingClientRect().top);
  });
});
```

### Integration Testing

**Full Calculation Flow**:
```typescript
describe('Matrix Calculation Flow', () => {
  it('calculates and displays complete matrix', async () => {
    const { getByLabelText, getByRole, getByText } = render(<MatrixPage />);
    
    // Input birth date
    await userEvent.selectOptions(getByLabelText(/день/i), '15');
    await userEvent.selectOptions(getByLabelText(/месяц/i), '6');
    await userEvent.selectOptions(getByLabelText(/год/i), '1990');
    
    // Calculate
    await userEvent.click(getByRole('button', { name: /рассчитать/i }));
    
    // Verify results displayed
    expect(getByText(/Ваша Матрица Судьбы/i)).toBeInTheDocument();
    expect(getByText(/Таланты/i)).toBeInTheDocument();
  });
});
```

### Visual Regression Testing

**Tool**: Playwright or Chromatic

**Scenarios**:
- Matrix diagram at desktop/tablet/mobile
- Health table with all chakras
- Interpretations sections expanded/collapsed
- Purpose sections layout
- Talents display styling

### Accessibility Testing

**Tools**:
- jest-axe for automated a11y checks
- Manual keyboard navigation testing
- Screen reader testing (NVDA/JAWS)

**Tests**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('matrix page has no accessibility violations', async () => {
  const { container } = render(<MatrixPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Performance Testing

**Metrics**:
- Initial page load: < 2s on 3G
- Matrix calculation: < 100ms
- Component render: < 50ms
- Image loading: progressive/lazy

**Tools**:
- Lighthouse CI
- Chrome DevTools Performance tab
- React DevTools Profiler

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Property Tests**: All 23 properties implemented
- **Integration Tests**: Critical user flows
- **Accessibility**: Zero axe violations
- **Visual**: Key responsive breakpoints

