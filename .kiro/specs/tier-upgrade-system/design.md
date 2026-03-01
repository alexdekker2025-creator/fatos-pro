# Design Document: Tier Upgrade System

## Overview

The tier upgrade system enables users who have purchased basic tier services to upgrade to full tier services by paying only the price difference (2000₽), rather than purchasing the full tier separately. This system integrates with the existing payment infrastructure (Stripe/YooKassa), purchase tracking system, and PDF generation capabilities.

### Key Design Goals

1. Seamless integration with existing payment and purchase systems
2. Automatic eligibility verification to prevent invalid upgrades
3. Immediate access grant upon successful upgrade payment
4. Consistent pricing across all user interfaces
5. Comprehensive transaction logging for audit and troubleshooting

### System Context

The upgrade system sits at the intersection of several existing subsystems:
- Payment processing (Stripe/YooKassa providers)
- Purchase tracking (Purchase model and usePurchases hook)
- Service definitions (PremiumService model)
- PDF generation (PythagoreanBasicPDF, future DestinyMatrix PDF)
- User interface (Calculator pages, Profile page)

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  User Interface │
│  - Calculator   │
│  - Profile      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│     Upgrade Eligibility Service         │
│  - Check basic tier ownership           │
│  - Check full tier non-ownership        │
│  - Return upgrade availability          │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      Payment Processing Layer           │
│  - Create upgrade payment session       │
│  - Validate eligibility before payment  │
│  - Route to Stripe/YooKassa             │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Webhook Handler                 │
│  - Verify payment completion            │
│  - Create full tier Purchase record     │
│  - Trigger PDF generation               │
│  - Log transaction                      │
└─────────────────────────────────────────┘
```

### Component Architecture

The system follows a layered architecture pattern:

1. **Presentation Layer**: UI components that display upgrade options
2. **Service Layer**: Business logic for eligibility checking and upgrade processing
3. **Data Access Layer**: Database operations for purchases and orders
4. **Integration Layer**: Payment provider and PDF generation integrations

### Database Schema Extensions

The existing schema requires minimal modifications. We'll leverage the existing `PremiumService` model to store upgrade product information:

```prisma
// Existing model - no changes needed
model PremiumService {
  id              String   @id @default(cuid())
  serviceId       String   @unique
  titleRu         String
  titleEn         String
  descriptionRu   String   @db.Text
  descriptionEn   String   @db.Text
  priceBasicRUB   Int
  priceBasicUSD   Int
  priceFullRUB    Int?
  priceFullUSD    Int?
  // ... other fields
}

// Existing model - no changes needed
model Purchase {
  id        String   @id @default(cuid())
  userId    String
  serviceId String
  orderId   String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime?
  
  user      User     @relation(fields: [userId], references: [id])
  order     Order    @relation(fields: [orderId], references: [id])
  
  @@index([userId])
  @@index([serviceId])
  @@unique([userId, serviceId])
}
```

### Upgrade Product Identification

Upgrade products will be identified by a naming convention:
- Basic tier: `pythagorean_full` (existing)
- Full tier: `pythagorean_full` (existing - same serviceId)
- Upgrade: Identified by checking if user owns basic but not full

The system will use the price difference calculation:
```
upgradePrice = priceFullRUB - priceBasicRUB
```

For Pythagorean: 4900₽ - 2900₽ = 2000₽
For Destiny Matrix: 5500₽ - 3500₽ = 2000₽

## Components and Interfaces

### 1. UpgradeEligibilityService

Service class responsible for determining upgrade eligibility.

```typescript
interface UpgradeEligibilityService {
  /**
   * Check if user is eligible for upgrade
   * @param userId - User identifier
   * @param serviceId - Service identifier (e.g., 'pythagorean_full')
   * @returns Eligibility status with reason
   */
  checkEligibility(
    userId: string, 
    serviceId: string
  ): Promise<UpgradeEligibilityResult>;
  
  /**
   * Get upgrade price for a service
   * @param serviceId - Service identifier
   * @param currency - Currency code (RUB, USD)
   * @returns Upgrade price in specified currency
   */
  getUpgradePrice(
    serviceId: string, 
    currency: 'RUB' | 'USD'
  ): Promise<number>;
  
  /**
   * Get all available upgrades for a user
   * @param userId - User identifier
   * @returns List of available upgrades
   */
  getAvailableUpgrades(userId: string): Promise<AvailableUpgrade[]>;
}

interface UpgradeEligibilityResult {
  eligible: boolean;
  reason?: 'no_basic_tier' | 'already_owns_full' | 'eligible';
  upgradePrice?: number;
  currency?: string;
}

interface AvailableUpgrade {
  serviceId: string;
  serviceName: string;
  currentTier: 'basic';
  upgradePrice: number;
  currency: string;
}
```

**Implementation Location**: `lib/services/upgrade/UpgradeEligibilityService.ts`

**Key Logic**:
1. Query user's purchases from database
2. Check if user owns basic tier (serviceId matches)
3. Check if user does NOT own full tier (no purchase with serviceId)
4. Calculate upgrade price from PremiumService table
5. Return eligibility result

### 2. useUpgradeEligibility Hook

React hook for checking upgrade eligibility in UI components.

```typescript
interface UseUpgradeEligibilityReturn {
  isEligible: boolean;
  upgradePrice: number | null;
  loading: boolean;
  error: string | null;
  checkEligibility: (serviceId: string) => Promise<void>;
}

function useUpgradeEligibility(serviceId: string): UseUpgradeEligibilityReturn;
```

**Implementation Location**: `lib/hooks/useUpgradeEligibility.ts`

**Usage Example**:
```typescript
const { isEligible, upgradePrice, loading } = useUpgradeEligibility('pythagorean_full');

if (isEligible) {
  return <UpgradeButton price={upgradePrice} />;
} else {
  return <PurchaseButton />;
}
```

### 3. API Endpoints

#### GET /api/upgrades/eligibility

Check upgrade eligibility for a specific service.

**Request**:
```typescript
GET /api/upgrades/eligibility?serviceId=pythagorean_full
Headers: {
  Authorization: Bearer <sessionId>
}
```

**Response**:
```typescript
{
  success: true,
  eligible: boolean,
  reason?: string,
  upgradePrice?: number,
  currency?: string
}
```

#### GET /api/upgrades/available

Get all available upgrades for the current user.

**Request**:
```typescript
GET /api/upgrades/available
Headers: {
  Authorization: Bearer <sessionId>
}
```

**Response**:
```typescript
{
  success: true,
  upgrades: [
    {
      serviceId: string,
      serviceName: string,
      currentTier: 'basic',
      upgradePrice: number,
      currency: string
    }
  ]
}
```

#### POST /api/payments/create (Extended)

Extend existing payment creation endpoint to handle upgrade payments.

**Request**:
```typescript
POST /api/payments/create
Headers: {
  Authorization: Bearer <sessionId>,
  Content-Type: application/json
}
Body: {
  amount: number,
  currency: string,
  countryCode: string,
  serviceId: string,
  isUpgrade: boolean  // NEW FIELD
}
```

**Changes**:
- Add `isUpgrade` boolean field to request body
- Validate upgrade eligibility before creating payment session
- Store upgrade flag in order metadata
- Calculate amount based on upgrade price if isUpgrade=true

### 4. UI Components

#### UpgradeButton Component

Display upgrade button on calculator pages when user is eligible.

```typescript
interface UpgradeButtonProps {
  serviceId: string;
  price: number;
  currency: string;
  locale: 'ru' | 'en';
  onUpgradeClick: () => void;
}

function UpgradeButton(props: UpgradeButtonProps): JSX.Element;
```

**Visual Design**:
- Distinct styling from regular purchase button (e.g., gradient background)
- Display upgrade price prominently
- Show benefit text: "Доплатить 2000₽ и получить полный доступ"
- Icon indicating upgrade (↑ arrow or similar)

**Implementation Location**: `components/UpgradeButton.tsx`

#### ProfileUpgradeSection Component

Display available upgrades in user profile.

```typescript
interface ProfileUpgradeSectionProps {
  userId: string;
  locale: 'ru' | 'en';
}

function ProfileUpgradeSection(props: ProfileUpgradeSectionProps): JSX.Element;
```

**Features**:
- List all services where user owns basic but not full
- Show current tier and upgrade price for each
- Click to open payment modal
- Empty state when no upgrades available

**Implementation Location**: `components/profile/ProfileUpgradeSection.tsx`

### 5. Webhook Handler Extensions

Extend existing webhook handlers to process upgrade payments.

**Changes to `/api/webhooks/stripe/route.ts` and `/api/webhooks/yukassa/route.ts`**:

1. Check if order has upgrade metadata
2. Verify user still eligible for upgrade (idempotency check)
3. Create Purchase record with full tier serviceId
4. Trigger PDF generation with full tier content
5. Log upgrade transaction
6. Handle retry logic for failures

**Pseudo-code**:
```typescript
// In webhook handler after payment verification
if (order.metadata?.isUpgrade) {
  // Verify eligibility (user might have purchased full tier elsewhere)
  const eligible = await upgradeService.checkEligibility(
    order.userId, 
    order.serviceId
  );
  
  if (!eligible.eligible) {
    // Log error and initiate refund
    await logUpgradeError(order.id, 'User no longer eligible');
    await initiateRefund(order.id);
    return;
  }
  
  // Create full tier purchase
  await prisma.purchase.create({
    data: {
      userId: order.userId,
      serviceId: order.serviceId, // Full tier serviceId
      orderId: order.id
    }
  });
  
  // Generate full tier PDF
  await generateFullTierPDF(order.userId, order.serviceId);
  
  // Log successful upgrade
  await logUpgradeTransaction(order.id, 'completed');
}
```

### 6. PDF Generation Integration

Extend PDF generation to support upgrade scenarios.

**Changes**:
- Retrieve original calculation data from user's basic tier purchase
- Generate full tier PDF using existing PDF components
- Store PDF reference in database or file system
- Make PDF available for immediate download

**Implementation**:
```typescript
async function generateUpgradePDF(
  userId: string,
  serviceId: string
): Promise<string> {
  // Get user's original calculation data
  const calculation = await getLatestCalculation(userId, serviceId);
  
  // Generate full tier PDF
  if (serviceId === 'pythagorean_full') {
    return await generatePythagoreanFullPDF(calculation);
  } else if (serviceId === 'destiny_matrix') {
    return await generateDestinyMatrixFullPDF(calculation);
  }
  
  throw new Error(`Unknown service: ${serviceId}`);
}
```

## Data Models

### Extended Order Metadata

Store upgrade information in order metadata:

```typescript
interface OrderMetadata {
  isUpgrade?: boolean;
  originalPurchaseId?: string;
  upgradePrice?: number;
}
```

This metadata will be stored in the existing `Order` model without schema changes, using JSON fields or external metadata storage.

### Upgrade Transaction Log

Create a new model for logging upgrade transactions:

```prisma
model UpgradeTransaction {
  id              String   @id @default(cuid())
  userId          String
  serviceId       String
  orderId         String
  status          String   // 'initiated', 'completed', 'failed', 'refunded'
  upgradePrice    Int
  currency        String
  errorMessage    String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([orderId])
  @@index([status])
  @@index([createdAt])
}
```

This model provides:
- Audit trail for all upgrade attempts
- Error tracking for failed upgrades
- Analytics data for upgrade conversion rates
- Support for troubleshooting and refunds


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Eligibility checking properties (2.1, 2.2, 2.3)** can be combined into a single comprehensive property about eligibility determination
2. **Price calculation properties (1.4, 10.1, 10.5)** are stating the same invariant in different ways - only one is needed
3. **UI display properties (3.1, 3.4)** can be combined into a single property about conditional rendering
4. **Logging properties (9.1, 9.2, 9.3)** can be combined into a single property about transaction logging
5. **Localization properties (11.1, 11.2, 11.3, 11.5)** can be combined into a single property about translation completeness
6. **Access verification properties (12.2, 12.3, 12.4, 12.5)** can be combined into a single property about post-upgrade state

The following properties represent the unique, non-redundant validation requirements:

### Property 1: Upgrade Price Calculation Invariant

*For any* service with both basic and full tier pricing, the upgrade price SHALL equal the full tier price minus the basic tier price.

**Validates: Requirements 1.4, 10.1, 10.2**

**Pattern**: Invariant

**Rationale**: This is a fundamental mathematical invariant that ensures pricing consistency. The upgrade price must always be calculated as the difference, never stored as a separate value that could drift out of sync.

### Property 2: Eligibility Determination

*For any* user and service combination, the user SHALL be eligible for upgrade if and only if they own the basic tier AND do not own the full tier.

**Validates: Requirements 2.1, 2.2, 2.3**

**Pattern**: Invariant

**Rationale**: This property captures the complete eligibility logic. A user is eligible only when they have basic but not full - all other states (no basic, has full, has neither) result in ineligibility.

### Property 3: Eligibility Verification Before Actions

*For any* upgrade-related action (UI display, payment initiation, webhook processing), the system SHALL verify eligibility before proceeding with that action.

**Validates: Requirements 2.4, 2.5, 8.4**

**Pattern**: Invariant (defense in depth)

**Rationale**: This ensures eligibility checks happen at every layer of the system, preventing invalid upgrades even if one layer fails.

### Property 4: Conditional UI Rendering

*For any* user viewing a calculator page, the system SHALL display an upgrade button if eligible, or a standard purchase button if not eligible, but never both simultaneously.

**Validates: Requirements 3.1, 3.4**

**Pattern**: Invariant (mutual exclusion)

**Rationale**: The UI must reflect the user's eligibility state consistently, showing exactly one purchase option.

### Property 5: Payment Modal Data Consistency

*For any* upgrade button click, the payment modal SHALL open with data matching the upgrade product (upgrade price, service ID, upgrade flag).

**Validates: Requirements 3.5, 4.3**

**Pattern**: Invariant

**Rationale**: When users initiate an upgrade, the payment modal must receive correct upgrade-specific data to create the proper payment session.

### Property 6: Profile Upgrade List Accuracy

*For any* user viewing their profile, the displayed upgrade list SHALL contain exactly those services where the user owns basic tier but not full tier.

**Validates: Requirements 4.1, 4.2**

**Pattern**: Invariant

**Rationale**: The profile must accurately reflect available upgrades based on the user's current purchases.

### Property 7: Payment Session Metadata Completeness

*For any* upgrade payment session creation, the session metadata SHALL include the upgrade flag, user ID, and service ID.

**Validates: Requirements 5.1, 5.2, 5.3**

**Pattern**: Invariant

**Rationale**: Complete metadata is essential for webhook processing to correctly identify and fulfill upgrade payments.

### Property 8: Payment Rejection for Ineligible Users

*For any* payment initiation attempt by an ineligible user, the system SHALL reject the payment and return an appropriate error message.

**Validates: Requirements 5.5, 8.1, 8.2, 8.3**

**Pattern**: Error condition validation

**Rationale**: The system must prevent invalid upgrade purchases at the payment initiation stage, providing clear feedback to users.

### Property 9: Webhook Upgrade Identification

*For any* webhook received, the system SHALL correctly identify whether it represents an upgrade payment based on the order metadata.

**Validates: Requirements 6.1**

**Pattern**: Invariant

**Rationale**: Webhooks must be properly classified to trigger the correct fulfillment logic (upgrade vs. direct purchase).

### Property 10: Purchase Record Creation After Upgrade

*For any* verified upgrade payment, the system SHALL create a purchase record granting full tier access to the user.

**Validates: Requirements 6.2**

**Pattern**: Invariant

**Rationale**: Successful upgrade payments must result in full tier access being granted through a purchase record.

### Property 11: Retry Logic for Failed Operations

*For any* purchase record creation failure, the system SHALL log the error and retry up to 3 times before marking the operation as failed.

**Validates: Requirements 6.5, 7.5**

**Pattern**: Error handling

**Rationale**: Transient failures should be retried automatically to maximize successful upgrade fulfillment.

### Property 12: PDF Generation After Upgrade

*For any* successful upgrade fulfillment, the system SHALL generate a full tier PDF report using the user's original calculation data.

**Validates: Requirements 6.4, 7.1, 7.2**

**Pattern**: Invariant

**Rationale**: Users who upgrade must receive the complete PDF report they paid for, using their existing calculation data.

### Property 13: PDF Content Equivalence

*For any* service, the PDF generated after an upgrade SHALL contain identical content to a PDF generated from a direct full tier purchase.

**Validates: Requirements 7.3**

**Pattern**: Equivalence

**Rationale**: Upgrade customers must receive the same value as direct purchase customers - the PDFs should be indistinguishable.

### Property 14: Webhook Refund for Ineligible Payments

*For any* webhook representing an upgrade payment for an ineligible user, the system SHALL log the error and initiate a refund.

**Validates: Requirements 8.5**

**Pattern**: Error condition handling

**Rationale**: If an invalid upgrade payment somehow completes (e.g., race condition), the system must automatically refund it.

### Property 15: Transaction Logging Completeness

*For any* upgrade transaction (initiated, completed, or failed), the system SHALL log the user ID, service ID, order ID, status, timestamp, and any error details.

**Validates: Requirements 9.1, 9.2, 9.3, 9.5**

**Pattern**: Invariant

**Rationale**: Complete logging is essential for auditing, troubleshooting, and analytics.

### Property 16: Price Display Consistency

*For any* service with upgrade capability, the upgrade price displayed SHALL be identical across calculator pages, profile pages, and payment modals.

**Validates: Requirements 10.3**

**Pattern**: Invariant

**Rationale**: Users must see consistent pricing regardless of where they view upgrade options.

### Property 17: Price Formatting

*For any* displayed upgrade price in Russian locale, the price SHALL be formatted with the ₽ symbol and proper number formatting.

**Validates: Requirements 10.4**

**Pattern**: Invariant

**Rationale**: Prices must be displayed in a user-friendly format with appropriate currency symbols.

### Property 18: Localization Completeness

*For any* supported locale, all upgrade-related text (button labels, descriptions, error messages) SHALL have translations in that locale.

**Validates: Requirements 11.1, 11.2, 11.3, 11.5**

**Pattern**: Invariant

**Rationale**: The upgrade system must be fully localized for all supported languages to provide a consistent user experience.

### Property 19: Post-Upgrade Access Verification

*For any* user who completes an upgrade, the system SHALL immediately grant full tier access, update the UI to reflect full tier ownership, remove upgrade buttons, and make the PDF available for download.

**Validates: Requirements 12.2, 12.3, 12.4, 12.5**

**Pattern**: State transition

**Rationale**: After a successful upgrade, all aspects of the system must reflect the user's new full tier status.

### Edge Cases

The following edge cases require special handling in property tests:

1. **Empty upgrade list** (Requirement 4.4): When a user owns full tier for all services, the profile upgrade section should display an empty state
2. **Concurrent purchase attempts**: If a user attempts to upgrade while simultaneously purchasing full tier directly, the system should handle the race condition gracefully
3. **Webhook replay**: If the same webhook is received multiple times, the system should be idempotent and not create duplicate purchases
4. **Price changes during checkout**: If service prices change while a user is in the payment flow, the system should use the price from when the session was created


## Error Handling

### Error Categories

The upgrade system must handle several categories of errors:

1. **Validation Errors**: User attempts invalid upgrade (not eligible)
2. **Payment Errors**: Payment provider failures or rejections
3. **Fulfillment Errors**: Database or PDF generation failures
4. **Race Condition Errors**: Concurrent purchase attempts
5. **External System Errors**: Payment gateway or webhook delivery failures

### Error Handling Strategies

#### 1. Validation Errors

**Strategy**: Fail fast with clear user feedback

**Implementation**:
```typescript
if (!eligibility.eligible) {
  return {
    success: false,
    error: 'UPGRADE_NOT_ELIGIBLE',
    message: eligibility.reason === 'no_basic_tier' 
      ? 'You must own the basic tier before upgrading'
      : 'You already own the full tier',
    code: 400
  };
}
```

**User Experience**:
- Display error message in payment modal
- Suggest alternative action (purchase basic tier or view full tier content)
- Log validation failure for analytics

#### 2. Payment Provider Errors

**Strategy**: Graceful degradation with retry options

**Implementation**:
```typescript
try {
  const session = await provider.createSession(...);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    return { error: 'Too many requests, please try again in a few minutes' };
  } else if (error.code === 'PROVIDER_DOWN') {
    return { error: 'Payment system temporarily unavailable' };
  }
  // Log error for monitoring
  await logPaymentError(error);
  return { error: 'Unable to process payment, please try again' };
}
```

**User Experience**:
- Show user-friendly error message
- Provide "Try Again" button
- Offer alternative payment method if available

#### 3. Fulfillment Errors

**Strategy**: Retry with exponential backoff, then manual intervention

**Implementation**:
```typescript
async function fulfillUpgrade(orderId: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await createPurchaseRecord(orderId);
      await generatePDF(orderId);
      return { success: true };
    } catch (error) {
      if (attempt === maxRetries) {
        await logFulfillmentFailure(orderId, error);
        await notifyAdmins(orderId, error);
        return { success: false, requiresManualIntervention: true };
      }
      // Exponential backoff: 1s, 2s, 4s
      await sleep(Math.pow(2, attempt - 1) * 1000);
    }
  }
}
```

**User Experience**:
- Show "Processing your upgrade..." message
- If retries fail, show "Your payment was successful, but we're still processing your upgrade. You'll receive an email when it's ready."
- Admin receives alert for manual intervention

#### 4. Race Condition Errors

**Strategy**: Database constraints and idempotency checks

**Implementation**:
```typescript
// Database constraint prevents duplicate purchases
@@unique([userId, serviceId])

// Idempotency check in webhook handler
const existingPurchase = await prisma.purchase.findUnique({
  where: { userId_serviceId: { userId, serviceId } }
});

if (existingPurchase) {
  // Already fulfilled, return success
  return { success: true, message: 'Already processed' };
}
```

**User Experience**:
- Transparent to user - system handles automatically
- No duplicate charges or access grants

#### 5. Webhook Delivery Failures

**Strategy**: Webhook retry with idempotency

**Implementation**:
```typescript
// Payment providers automatically retry webhooks
// Our handler must be idempotent

export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  // Check if already processed
  const order = await prisma.order.findUnique({
    where: { id: payload.orderId }
  });
  
  if (order.status !== 'PENDING') {
    // Already processed, return 200 OK
    return NextResponse.json({ success: true }, { status: 200 });
  }
  
  // Process webhook...
}
```

**User Experience**:
- Transparent to user
- System ensures exactly-once processing

### Error Logging

All errors must be logged with sufficient context for debugging:

```typescript
interface UpgradeErrorLog {
  timestamp: Date;
  userId: string;
  serviceId: string;
  orderId?: string;
  errorType: 'validation' | 'payment' | 'fulfillment' | 'race_condition' | 'webhook';
  errorMessage: string;
  errorStack?: string;
  metadata: Record<string, any>;
}
```

### Error Monitoring

Implement monitoring alerts for:
- High rate of validation errors (may indicate UI bug)
- Payment provider errors (may indicate integration issue)
- Fulfillment failures requiring manual intervention
- Webhook processing failures

### Refund Process

For errors requiring refunds:

1. **Automatic Refund Triggers**:
   - Webhook received for ineligible user
   - Duplicate payment detected
   - Fulfillment fails after max retries (optional, based on business policy)

2. **Refund Implementation**:
```typescript
async function initiateRefund(orderId: string, reason: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  
  // Call payment provider refund API
  const provider = PaymentFactory.getProvider(order.paymentProvider);
  await provider.refund(order.externalId, order.amount);
  
  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'REFUNDED' }
  });
  
  // Log refund
  await logRefund(orderId, reason);
  
  // Notify user
  await sendRefundEmail(order.userId, order.amount);
}
```

## Testing Strategy

### Dual Testing Approach

The upgrade system requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

### Unit Testing

Unit tests should focus on:

1. **Specific Examples**:
   - Pythagorean upgrade eligibility for user with basic tier
   - Destiny Matrix upgrade price calculation
   - Upgrade button rendering for eligible user
   - Profile upgrade list with 2 available upgrades

2. **Edge Cases**:
   - Empty upgrade list when user owns all full tiers
   - Concurrent purchase attempt handling
   - Webhook replay idempotency
   - Price change during checkout

3. **Error Conditions**:
   - Payment initiation rejection for ineligible user
   - Fulfillment retry after database failure
   - Refund initiation for invalid webhook
   - Error message display for validation failures

4. **Integration Points**:
   - Payment provider session creation
   - Webhook processing flow
   - PDF generation trigger
   - Purchase record creation

**Example Unit Test**:
```typescript
describe('UpgradeEligibilityService', () => {
  it('should mark user as eligible when they own basic but not full', async () => {
    // Arrange
    const userId = 'user123';
    const serviceId = 'pythagorean_full';
    await createPurchase(userId, 'pythagorean_basic');
    
    // Act
    const result = await eligibilityService.checkEligibility(userId, serviceId);
    
    // Assert
    expect(result.eligible).toBe(true);
    expect(result.upgradePrice).toBe(2000);
  });
});
```

### Property-Based Testing

Property tests should verify universal properties across randomized inputs. Each property test must:
- Run minimum 100 iterations
- Reference the design document property
- Use appropriate generators for test data

**Property Test Configuration**:
- Library: `fast-check` (JavaScript/TypeScript)
- Iterations: 100 minimum per test
- Tag format: `Feature: tier-upgrade-system, Property {number}: {property_text}`

**Example Property Test**:
```typescript
import fc from 'fast-check';

describe('Property 1: Upgrade Price Calculation Invariant', () => {
  it('upgrade price equals full price minus basic price for all services', () => {
    // Feature: tier-upgrade-system, Property 1: Upgrade price calculation invariant
    
    fc.assert(
      fc.property(
        fc.record({
          serviceId: fc.string(),
          priceBasicRUB: fc.integer({ min: 1000, max: 10000 }),
          priceFullRUB: fc.integer({ min: 2000, max: 20000 })
        }).filter(s => s.priceFullRUB > s.priceBasicRUB),
        async (service) => {
          // Arrange
          await seedService(service);
          
          // Act
          const upgradePrice = await upgradeService.getUpgradePrice(
            service.serviceId, 
            'RUB'
          );
          
          // Assert
          expect(upgradePrice).toBe(service.priceFullRUB - service.priceBasicRUB);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Generators**:

```typescript
// Generator for user purchase states
const userPurchaseStateGen = fc.record({
  userId: fc.uuid(),
  hasBasic: fc.boolean(),
  hasFull: fc.boolean()
});

// Generator for service definitions
const serviceGen = fc.record({
  serviceId: fc.constantFrom('pythagorean_full', 'destiny_matrix'),
  priceBasicRUB: fc.integer({ min: 2000, max: 5000 }),
  priceFullRUB: fc.integer({ min: 4000, max: 10000 })
}).filter(s => s.priceFullRUB > s.priceBasicRUB);

// Generator for upgrade transactions
const upgradeTransactionGen = fc.record({
  userId: fc.uuid(),
  serviceId: fc.constantFrom('pythagorean_full', 'destiny_matrix'),
  amount: fc.integer({ min: 1000, max: 5000 }),
  currency: fc.constantFrom('RUB', 'USD')
});
```

### Property Test Coverage

Each correctness property must have a corresponding property-based test:

| Property | Test Description | Generator |
|----------|------------------|-----------|
| Property 1 | Upgrade price calculation | serviceGen |
| Property 2 | Eligibility determination | userPurchaseStateGen + serviceGen |
| Property 3 | Eligibility verification | userPurchaseStateGen + actionGen |
| Property 4 | Conditional UI rendering | userPurchaseStateGen |
| Property 5 | Payment modal data | upgradeTransactionGen |
| Property 6 | Profile upgrade list | userPurchaseStateGen + serviceGen[] |
| Property 7 | Payment session metadata | upgradeTransactionGen |
| Property 8 | Payment rejection | userPurchaseStateGen (ineligible) |
| Property 9 | Webhook identification | webhookPayloadGen |
| Property 10 | Purchase record creation | upgradeTransactionGen |
| Property 11 | Retry logic | failureGen + retryCountGen |
| Property 12 | PDF generation | upgradeTransactionGen |
| Property 13 | PDF content equivalence | calculationDataGen |
| Property 14 | Webhook refund | webhookPayloadGen (ineligible) |
| Property 15 | Transaction logging | upgradeTransactionGen |
| Property 16 | Price display consistency | serviceGen + localeGen |
| Property 17 | Price formatting | priceGen + localeGen |
| Property 18 | Localization completeness | localeGen + textKeyGen |
| Property 19 | Post-upgrade access | upgradeTransactionGen |

### Test Environment

**Database**:
- Use test database with isolated transactions
- Reset database state between tests
- Seed test data for property tests

**Payment Providers**:
- Mock payment provider APIs in unit tests
- Use test mode credentials for integration tests
- Verify webhook signatures with test keys

**PDF Generation**:
- Mock PDF generation in unit tests
- Verify PDF content structure without full rendering
- Test with sample calculation data

### Continuous Integration

Tests should run automatically on:
- Every pull request
- Every commit to main branch
- Nightly for extended property test runs (1000+ iterations)

**CI Configuration**:
```yaml
test:
  unit:
    command: npm test -- --testPathPattern=unit
    coverage: 80%
  
  property:
    command: npm test -- --testPathPattern=property
    iterations: 100
    
  integration:
    command: npm test -- --testPathPattern=integration
    requires: test-database
```

### Test Metrics

Track the following metrics:
- Test coverage (target: 80%+ for upgrade system)
- Property test iterations (minimum: 100 per test)
- Test execution time (target: <5 minutes for full suite)
- Flaky test rate (target: <1%)

### Manual Testing Checklist

Before release, manually verify:

1. **Happy Path**:
   - [ ] User with basic tier sees upgrade button
   - [ ] Upgrade button shows correct price (2000₽)
   - [ ] Payment modal opens with upgrade details
   - [ ] Payment completes successfully
   - [ ] Full tier access granted immediately
   - [ ] PDF available for download
   - [ ] Upgrade button removed after purchase

2. **Error Cases**:
   - [ ] User without basic tier cannot initiate upgrade
   - [ ] User with full tier sees no upgrade option
   - [ ] Payment failure shows appropriate error
   - [ ] Fulfillment retry works after transient failure

3. **UI/UX**:
   - [ ] Upgrade button visually distinct from purchase button
   - [ ] Pricing consistent across all pages
   - [ ] Localization correct for Russian and English
   - [ ] Profile shows available upgrades
   - [ ] Empty state when no upgrades available

4. **Admin**:
   - [ ] Transaction logs accessible in admin panel
   - [ ] Failed upgrades flagged for manual intervention
   - [ ] Refund process works correctly

