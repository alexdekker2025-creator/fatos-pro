# Design Document: Admin Panel Enhancements

## Overview

This design document specifies the technical architecture for enhancing the FATOS.pro admin panel with comprehensive user management capabilities and an improved statistics dashboard. The enhancements will transform the existing basic statistics view into a full-featured administrative interface with user CRUD operations, advanced filtering, interactive charts, and real-time updates.

### Goals

- Provide administrators with complete user management capabilities (view, search, edit, block, delete)
- Enhance the statistics dashboard with interactive visualizations using Chart.js
- Implement real-time data updates with polling mechanism
- Add data export functionality (CSV/Excel)
- Maintain the existing mystical theme (purple/indigo gradients)
- Ensure bilingual support (Russian/English)
- Optimize for responsive design across all device sizes

### Non-Goals

- User impersonation or session hijacking features
- Bulk user operations (bulk delete, bulk email)
- Advanced analytics or machine learning insights
- Integration with external analytics platforms
- Custom report builder interface

## Architecture

### High-Level Architecture

The admin panel enhancements follow Next.js 14 App Router architecture with clear separation between client and server components:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Admin Page (/ru/admin, /en/admin)                   │   │
│  │  - Tab Navigation (Users, Statistics, Articles, Logs)│   │
│  │  - Authentication Check                              │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                                    │              │
│           ▼                                    ▼              │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │ UserManagement   │              │ StatisticsDashboard│    │
│  │ Component        │              │ Component          │    │
│  │ - User List      │              │ - Charts (Chart.js)│    │
│  │ - Search/Filter  │              │ - Time Range Filter│    │
│  │ - User Modal     │              │ - Export Buttons   │    │
│  └──────────────────┘              └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/admin/users                                     │   │
│  │  - GET (list with pagination/filters)                │   │
│  │  - POST (create user)                                │   │
│  │  - PUT (update user)                                 │   │
│  │  - DELETE (delete user)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/admin/users/[id]                               │   │
│  │  - GET (user details)                                │   │
│  │  - PATCH (block/unblock)                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/admin/statistics                               │   │
│  │  - GET (enhanced with time range, charts data)       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/admin/export                                   │   │
│  │  - POST (generate CSV/Excel)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer (PostgreSQL)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  User Table (extended with isBlocked field)          │   │
│  │  AdminLog Table (audit trail)                        │   │
│  │  Calculation, Order, Purchase Tables (statistics)    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: React 18 with hooks
- **Styling**: Tailwind CSS with custom purple/indigo gradient theme
- **Charts**: Chart.js with react-chartjs-2 wrapper
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: Session-based with existing auth system
- **Internationalization**: next-intl for bilingual support
- **Export**: xlsx library for Excel, custom CSV generation

### Design Patterns

1. **Server Components for Data Fetching**: Use Next.js server components where possible for initial data loading
2. **Client Components for Interactivity**: User management and charts require client-side state
3. **API Route Handlers**: Centralized business logic in API routes with proper error handling
4. **Optimistic UI Updates**: Immediate UI feedback with rollback on error
5. **Polling for Real-time Updates**: 30-second polling interval for statistics dashboard
6. **Middleware for Authorization**: Verify admin status on every API request

## Components and Interfaces

### Frontend Components

#### 1. UserManagement Component

**Location**: `components/admin/UserManagement.tsx`

**Purpose**: Main component for user management with list, search, filter, and CRUD operations

**State Management**:
```typescript
interface UserManagementState {
  users: User[];
  totalUsers: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  searchQuery: string;
  filters: {
    emailVerified: boolean | null;
    twoFactorEnabled: boolean | null;
    isBlocked: boolean | null;
    dateFrom: Date | null;
    dateTo: Date | null;
  };
  selectedUser: User | null;
  modalOpen: boolean;
}
```

**Key Features**:
- Paginated user list (25 per page)
- Real-time search with 300ms debounce
- Multi-criteria filtering
- Inline edit capabilities
- Block/unblock toggle
- Delete with confirmation
- User details modal

**Props**:
```typescript
interface UserManagementProps {
  locale: 'ru' | 'en';
}
```

#### 2. UserDetailsModal Component

**Location**: `components/admin/UserDetailsModal.tsx`

**Purpose**: Display comprehensive user information in a modal dialog

**Props**:
```typescript
interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
  onBlock: (userId: string, blocked: boolean) => void;
  onDelete: (userId: string) => void;
  locale: 'ru' | 'en';
}
```

**Sections**:
- Profile information (email, name, registration date)
- Security status (email verified, 2FA enabled, OAuth providers)
- Activity metrics (calculations count, purchases count, last login)
- Activity timeline (recent calculations, purchases)
- Security events (from SecurityLog table)
- Quick actions (block, delete, reset password)

#### 3. StatisticsDashboard Component (Enhanced)

**Location**: `components/admin/StatisticsDashboard.tsx` (existing, to be enhanced)

**Purpose**: Display system statistics with interactive charts and time range filtering

**State Management**:
```typescript
interface StatisticsDashboardState {
  stats: Statistics;
  timeRange: TimeRange;
  customDateRange: { start: Date; end: Date } | null;
  loading: boolean;
  lastUpdated: Date;
  autoRefresh: boolean;
}

interface Statistics {
  // Existing metrics
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalArticles: number;
  recentUsers: number;
  recentCalculations: number;
  
  // New metrics
  activeUsers7Days: number;
  activeUsers30Days: number;
  emailVerificationRate: number;
  twoFactorAdoptionRate: number;
  
  // Chart data
  userGrowthData: ChartDataPoint[];
  calculationTrendsData: ChartDataPoint[];
  revenueTrendsData: ChartDataPoint[];
  oauthUsageData: { provider: string; count: number }[];
}

interface ChartDataPoint {
  date: string;
  value: number;
}

type TimeRange = '7d' | '30d' | '90d' | 'all' | 'custom';
```

**Charts**:
1. User Growth Line Chart (Chart.js Line)
2. Calculation Trends Line Chart (Chart.js Line)
3. Revenue Trends Line Chart (Chart.js Line)
4. OAuth Usage Pie Chart (Chart.js Pie)

#### 4. ChartWrapper Component

**Location**: `components/admin/ChartWrapper.tsx`

**Purpose**: Reusable wrapper for Chart.js charts with consistent styling

**Props**:
```typescript
interface ChartWrapperProps {
  title: string;
  type: 'line' | 'pie' | 'bar';
  data: any; // Chart.js data format
  options?: any; // Chart.js options
  loading?: boolean;
  height?: number;
}
```

#### 5. ExportButton Component

**Location**: `components/admin/ExportButton.tsx`

**Purpose**: Handle data export to CSV or Excel formats

**Props**:
```typescript
interface ExportButtonProps {
  data: any[];
  filename: string;
  format: 'csv' | 'excel';
  disabled?: boolean;
}
```

### API Endpoints

#### 1. GET /api/admin/users

**Purpose**: Retrieve paginated and filtered user list

**Query Parameters**:
```typescript
interface GetUsersQuery {
  page?: number;           // Default: 1
  pageSize?: number;       // Default: 25
  search?: string;         // Search by email or name
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  isBlocked?: boolean;
  dateFrom?: string;       // ISO date
  dateTo?: string;         // ISO date
  sortBy?: 'createdAt' | 'lastLogin' | 'email';
  sortOrder?: 'asc' | 'desc';
  sessionId: string;       // Required for auth
}
```

**Response**:
```typescript
interface GetUsersResponse {
  users: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UserListItem {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  isBlocked: boolean;
  createdAt: string;
  lastLogin: string | null;
  calculationsCount: number;
  purchasesCount: number;
  oauthProviders: string[];
}
```

**Authorization**: Verify admin status via sessionId

**Error Responses**:
- 401: Unauthorized (invalid session)
- 403: Forbidden (not admin)
- 400: Bad request (invalid parameters)

#### 2. GET /api/admin/users/[id]

**Purpose**: Retrieve detailed information for a specific user

**Query Parameters**:
```typescript
interface GetUserDetailsQuery {
  sessionId: string;
}
```

**Response**:
```typescript
interface GetUserDetailsResponse {
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    preferredLang: string;
  };
  activity: {
    calculationsCount: number;
    purchasesCount: number;
    lastLogin: string | null;
    recentCalculations: CalculationSummary[];
    recentPurchases: PurchaseSummary[];
  };
  security: {
    oauthProviders: OAuthProviderInfo[];
    securityEvents: SecurityEvent[];
  };
}
```

#### 3. PUT /api/admin/users/[id]

**Purpose**: Update user information

**Request Body**:
```typescript
interface UpdateUserRequest {
  sessionId: string;
  email?: string;
  name?: string;
  isAdmin?: boolean;
}
```

**Response**:
```typescript
interface UpdateUserResponse {
  success: boolean;
  user: UserListItem;
}
```

**Validation**:
- Email format validation
- Email uniqueness check
- Prevent self-demotion from admin

**Audit Logging**: Record action in AdminLog table

#### 4. PATCH /api/admin/users/[id]/block

**Purpose**: Block or unblock a user

**Request Body**:
```typescript
interface BlockUserRequest {
  sessionId: string;
  isBlocked: boolean;
}
```

**Response**:
```typescript
interface BlockUserResponse {
  success: boolean;
  user: UserListItem;
}
```

**Validation**:
- Prevent self-blocking

**Audit Logging**: Record action in AdminLog table

#### 5. DELETE /api/admin/users/[id]

**Purpose**: Permanently delete a user and all associated data

**Request Body**:
```typescript
interface DeleteUserRequest {
  sessionId: string;
  confirmation: string; // Must match user email
}
```

**Response**:
```typescript
interface DeleteUserResponse {
  success: boolean;
  deletedUserId: string;
}
```

**Cascade Deletion**:
- User record
- All calculations
- All orders and purchases
- All sessions
- All security logs
- All OAuth providers
- All 2FA data
- All tokens

**Validation**:
- Prevent self-deletion
- Require email confirmation

**Audit Logging**: Record action in AdminLog table

#### 6. GET /api/admin/statistics (Enhanced)

**Purpose**: Retrieve enhanced statistics with chart data

**Query Parameters**:
```typescript
interface GetStatisticsQuery {
  sessionId: string;
  timeRange?: '7d' | '30d' | '90d' | 'all' | 'custom';
  startDate?: string; // ISO date for custom range
  endDate?: string;   // ISO date for custom range
}
```

**Response**:
```typescript
interface GetStatisticsResponse {
  // Existing metrics (unchanged)
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalArticles: number;
  recentUsers: number;
  recentCalculations: number;
  
  // New metrics
  activeUsers7Days: number;
  activeUsers30Days: number;
  emailVerificationRate: number;
  twoFactorAdoptionRate: number;
  blockedUsersCount: number;
  
  // Chart data
  userGrowthData: { date: string; count: number }[];
  calculationTrendsData: { date: string; count: number }[];
  revenueTrendsData: { date: string; amount: number }[];
  oauthUsageData: { provider: string; count: number }[];
  
  // Metadata
  generatedAt: string;
  timeRange: string;
}
```

**Performance Optimization**:
- Use database aggregation queries
- Cache results for 30 seconds
- Use indexes on date fields

#### 7. POST /api/admin/export

**Purpose**: Generate and download statistics export

**Request Body**:
```typescript
interface ExportRequest {
  sessionId: string;
  format: 'csv' | 'excel';
  dataType: 'users' | 'statistics';
  timeRange?: string;
  filters?: any;
}
```

**Response**: File download (Content-Type: text/csv or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

**Filename Format**: `fatos-{dataType}-{timeRange}-{timestamp}.{ext}`

## Data Models

### Database Schema Changes

#### User Model Extension

Add `isBlocked` field to existing User model:

```prisma
model User {
  id              String        @id @default(cuid())
  email           String        @unique
  name            String
  passwordHash    String
  preferredLang   String        @default("ru")
  isAdmin         Boolean       @default(false)
  emailVerified   Boolean       @default(false)
  twoFactorEnabled Boolean      @default(false)
  isBlocked       Boolean       @default(false)  // NEW FIELD
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // ... existing relations
  
  @@index([email])
  @@index([emailVerified])
  @@index([twoFactorEnabled])
  @@index([isBlocked])  // NEW INDEX
}
```

**Migration Strategy**:
1. Add `isBlocked` column with default value `false`
2. Add index on `isBlocked` for query performance
3. No data migration needed (all existing users default to not blocked)

#### AdminLog Model (Existing)

No changes needed. Current structure supports audit logging:

```prisma
model AdminLog {
  id              String        @id @default(cuid())
  adminId         String
  action          String
  details         Json?
  createdAt       DateTime      @default(now())
  
  admin           User          @relation(fields: [adminId], references: [id])
  
  @@index([adminId])
  @@index([createdAt])
}
```

**Action Types** (stored in `action` field):
- `USER_CREATED`
- `USER_UPDATED`
- `USER_BLOCKED`
- `USER_UNBLOCKED`
- `USER_DELETED`
- `PASSWORD_RESET_INITIATED`

**Details JSON Structure**:
```typescript
interface AdminLogDetails {
  targetUserId?: string;
  targetUserEmail?: string;
  changes?: Record<string, { old: any; new: any }>;
  reason?: string;
}
```

### TypeScript Interfaces

#### User-Related Types

```typescript
// Extended user type with computed fields
interface UserWithActivity extends User {
  calculationsCount: number;
  purchasesCount: number;
  lastLogin: Date | null;
  oauthProviders: string[];
}

// User list item for table display
interface UserListItem {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  isBlocked: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  calculationsCount: number;
  purchasesCount: number;
  oauthProviders: string[];
}

// User filters
interface UserFilters {
  search: string;
  emailVerified: boolean | null;
  twoFactorEnabled: boolean | null;
  isBlocked: boolean | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}
```

#### Statistics Types

```typescript
interface Statistics {
  // Summary metrics
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalArticles: number;
  recentUsers: number;
  recentCalculations: number;
  activeUsers7Days: number;
  activeUsers30Days: number;
  emailVerificationRate: number;
  twoFactorAdoptionRate: number;
  blockedUsersCount: number;
  
  // Chart data
  userGrowthData: TimeSeriesDataPoint[];
  calculationTrendsData: TimeSeriesDataPoint[];
  revenueTrendsData: TimeSeriesDataPoint[];
  oauthUsageData: CategoryDataPoint[];
}

interface TimeSeriesDataPoint {
  date: string; // ISO date
  value: number;
}

interface CategoryDataPoint {
  category: string;
  value: number;
  percentage?: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: User List Pagination Consistency

*For any* user database with N users, when displaying the user list with page size 25, the total number of pages should equal ceil(N / 25) and each page (except possibly the last) should contain exactly 25 users.

**Validates: Requirements 1.3**

### Property 2: User Information Completeness

*For any* user in the displayed user list, the rendered output must contain all required fields: email, name, registration date, email verification status, 2FA status, OAuth provider information, calculations count, purchases count, and last login timestamp.

**Validates: Requirements 1.2, 6.1**

### Property 3: Search Filter Correctness

*For any* search query string and user database, all users in the filtered results must have either their email or name containing the search text (case-insensitive).

**Validates: Requirements 2.2**

### Property 4: Multi-Filter AND Logic

*For any* combination of active filters (email verified, 2FA enabled, blocked status, date range), all users in the filtered results must satisfy ALL active filter conditions simultaneously.

**Validates: Requirements 2.5**

### Property 5: Email Validation on Update

*For any* email string provided during user update, the system must validate the email format before saving, and reject invalid email formats with an error message.

**Validates: Requirements 3.2**

### Property 6: User Update Round-Trip

*For any* valid user update (name, email, or admin status), after saving the changes and retrieving the user record, the retrieved data must reflect the updated values.

**Validates: Requirements 3.3**

### Property 7: Email Uniqueness Enforcement

*For any* user update attempt where the new email already exists for a different user, the system must reject the update and display an error message without modifying the database.

**Validates: Requirements 3.5**

### Property 8: Block Status Persistence

*For any* user, after setting isBlocked to true (or false), retrieving the user record must show isBlocked as true (or false) respectively.

**Validates: Requirements 4.2, 4.4**

### Property 9: Blocked User Authentication Rejection

*For any* user with isBlocked=true, authentication attempts must be rejected with a descriptive error message regardless of correct credentials.

**Validates: Requirements 4.3**

### Property 10: User Deletion Cascade

*For any* user deletion operation, after successful deletion, the user record and all associated data (calculations, orders, purchases, sessions, security logs, OAuth providers, 2FA data, tokens) must be permanently removed from the database.

**Validates: Requirements 5.3**

### Property 11: Comprehensive Audit Logging

*For any* administrative action (user update, block, unblock, delete), an audit log entry must be created containing timestamp, admin user ID, action type, target user ID, and relevant details.

**Validates: Requirements 3.4, 4.5, 5.4, 12.4**

### Property 12: Active User Calculation Accuracy

*For any* time period (7 days or 30 days) and current timestamp, the active user count must equal the number of users whose last login timestamp falls within that period from the current timestamp.

**Validates: Requirements 6.2, 8.6**

### Property 13: Locale-Based Formatting

*For any* date, time, or number value displayed in the admin panel, the formatting must match the conventions of the selected locale (Russian for /ru/admin, English for /en/admin).

**Validates: Requirements 6.3, 14.3**

### Property 14: Sort Order Invariant

*For any* user list sorted by last login date (ascending or descending), each user in the list must have a last login timestamp that is less than or equal to (ascending) or greater than or equal to (descending) the next user's timestamp.

**Validates: Requirements 6.4**

### Property 15: User Details Modal Completeness

*For any* user selected for detailed view, the modal must display all required sections: profile information, activity timeline, calculation history, purchase history, and security events.

**Validates: Requirements 7.2, 7.3**

### Property 16: Statistics Percentage Calculation

*For any* statistics calculation (email verification rate, 2FA adoption rate), the percentage must equal (count of users with feature enabled / total users) * 100, rounded to appropriate precision.

**Validates: Requirements 8.5**

### Property 17: Date Range Validation

*For any* custom date range input, if the start date is after the end date, the system must reject the input and display a validation error.

**Validates: Requirements 9.4**

### Property 18: Time Range Filter Persistence

*For any* selected time range filter, after page reload or navigation away and back, the same time range filter must remain selected (session persistence).

**Validates: Requirements 9.5**

### Property 19: Export Data Completeness

*For any* export operation (CSV or Excel), the exported file must contain all visible statistics data that matches the currently applied time range filter.

**Validates: Requirements 10.3**

### Property 20: Export Filename Format

*For any* export operation, the generated filename must follow the format `fatos-{dataType}-{timeRange}-{timestamp}.{ext}` where dataType, timeRange, and timestamp are correctly populated.

**Validates: Requirements 10.4**

### Property 21: Non-Admin Access Denial

*For any* user with isAdmin=false attempting to access admin panel pages or API endpoints, the system must deny access and redirect to the home page (for pages) or return 403 Forbidden (for API).

**Validates: Requirements 12.1, 12.2**

### Property 22: Destructive Action Confirmation

*For any* destructive action (delete user, block user), the system must display a confirmation dialog before executing the action, and must not execute if confirmation is not provided.

**Validates: Requirements 12.3**

### Property 23: Operation Feedback Notifications

*For any* admin operation (create, update, delete, block), the system must display a success notification on successful completion or an error notification with descriptive message on failure.

**Validates: Requirements 13.4, 13.5**

### Property 24: Translation Completeness

*For any* UI text element (labels, buttons, error messages, notifications, confirmation dialogs), a translation must exist in both Russian and English translation files.

**Validates: Requirements 14.4**


## Error Handling

### Client-Side Error Handling

#### Network Errors

**Scenario**: API request fails due to network issues

**Handling**:
```typescript
try {
  const response = await fetch('/api/admin/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  // Display user-friendly error notification
  showNotification({
    type: 'error',
    message: t('errors.networkError'),
    duration: 5000
  });
  
  // Log error for debugging
  console.error('API request failed:', error);
  
  // Return fallback data or empty state
  return { users: [], total: 0 };
}
```

#### Validation Errors

**Scenario**: User input fails validation (invalid email, empty required field)

**Handling**:
- Display inline error messages next to form fields
- Prevent form submission until validation passes
- Use Zod or similar library for schema validation
- Provide clear, actionable error messages

```typescript
const userUpdateSchema = z.object({
  email: z.string().email({ message: t('validation.invalidEmail') }),
  name: z.string().min(1, { message: t('validation.required') }),
  isAdmin: z.boolean()
});

try {
  const validatedData = userUpdateSchema.parse(formData);
  await updateUser(validatedData);
} catch (error) {
  if (error instanceof z.ZodError) {
    setFormErrors(error.flatten().fieldErrors);
  }
}
```

#### State Management Errors

**Scenario**: Component state becomes inconsistent

**Handling**:
- Use React Error Boundaries to catch rendering errors
- Implement optimistic updates with rollback on failure
- Maintain previous state for rollback scenarios

```typescript
const [users, setUsers] = useState<User[]>([]);
const [previousUsers, setPreviousUsers] = useState<User[]>([]);

const blockUser = async (userId: string) => {
  // Optimistic update
  setPreviousUsers(users);
  setUsers(users.map(u => 
    u.id === userId ? { ...u, isBlocked: true } : u
  ));
  
  try {
    await fetch(`/api/admin/users/${userId}/block`, {
      method: 'PATCH',
      body: JSON.stringify({ isBlocked: true })
    });
  } catch (error) {
    // Rollback on error
    setUsers(previousUsers);
    showNotification({
      type: 'error',
      message: t('errors.blockFailed')
    });
  }
};
```

### Server-Side Error Handling

#### Authentication Errors

**Scenario**: Invalid or expired session

**Response**:
```typescript
// HTTP 401 Unauthorized
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired session",
  "code": "AUTH_001"
}
```

**Client Handling**: Redirect to login page, clear local session

#### Authorization Errors

**Scenario**: Non-admin user attempts admin operation

**Response**:
```typescript
// HTTP 403 Forbidden
{
  "error": "FORBIDDEN",
  "message": "Admin privileges required",
  "code": "AUTH_002"
}
```

**Client Handling**: Redirect to home page, show error notification

#### Validation Errors

**Scenario**: Invalid request data (duplicate email, invalid format)

**Response**:
```typescript
// HTTP 400 Bad Request
{
  "error": "VALIDATION_ERROR",
  "message": "Email already exists",
  "code": "VAL_001",
  "field": "email"
}
```

**Client Handling**: Display field-specific error message

#### Database Errors

**Scenario**: Database connection failure, constraint violation

**Response**:
```typescript
// HTTP 500 Internal Server Error
{
  "error": "DATABASE_ERROR",
  "message": "An unexpected error occurred",
  "code": "DB_001"
}
```

**Handling**:
- Log full error details server-side
- Return generic error message to client (don't expose internals)
- Implement retry logic for transient failures
- Use database transactions for multi-step operations

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin status
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid session' },
        { status: 401 }
      );
    }
    
    // Prevent self-deletion
    if (params.id === session.userId) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Cannot delete your own account' },
        { status: 403 }
      );
    }
    
    // Use transaction for cascade deletion
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.calculation.deleteMany({ where: { userId: params.id } });
      await tx.order.deleteMany({ where: { userId: params.id } });
      await tx.session.deleteMany({ where: { userId: params.id } });
      // ... other related records
      
      // Delete user
      await tx.user.delete({ where: { id: params.id } });
      
      // Create audit log
      await tx.adminLog.create({
        data: {
          adminId: session.userId,
          action: 'USER_DELETED',
          details: { targetUserId: params.id }
        }
      });
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('User deletion failed:', error);
    
    if (error.code === 'P2025') {
      // Record not found
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'DATABASE_ERROR', message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
```

#### Rate Limiting

**Scenario**: Too many requests from same IP/session

**Response**:
```typescript
// HTTP 429 Too Many Requests
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "code": "RATE_001",
  "retryAfter": 60
}
```

**Implementation**: Use middleware or API route wrapper

### Error Codes Reference

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| AUTH_001 | 401 | Invalid/expired session | Re-login |
| AUTH_002 | 403 | Insufficient privileges | Contact admin |
| VAL_001 | 400 | Duplicate email | Use different email |
| VAL_002 | 400 | Invalid email format | Correct email format |
| VAL_003 | 400 | Invalid date range | Adjust date range |
| VAL_004 | 400 | Self-operation forbidden | Select different user |
| DB_001 | 500 | Database error | Retry or contact support |
| NOT_FOUND | 404 | Resource not found | Refresh page |
| RATE_001 | 429 | Rate limit exceeded | Wait and retry |

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for comprehensive coverage of universal properties. This ensures both concrete bug detection and general correctness verification.

### Testing Tools

- **Unit Testing**: Jest with React Testing Library
- **Property-Based Testing**: fast-check library
- **E2E Testing**: Playwright (optional, for critical user flows)
- **API Testing**: Supertest with Next.js API routes
- **Database Testing**: Prisma with test database

### Unit Testing Approach

Unit tests focus on:
- Specific examples demonstrating correct behavior
- Edge cases (empty lists, boundary values, self-operations)
- Error conditions and error handling
- Component rendering and user interactions
- Integration between components

**Example Unit Tests**:

```typescript
// components/__tests__/UserManagement.test.tsx
describe('UserManagement Component', () => {
  it('should display user list with pagination controls', async () => {
    const mockUsers = generateMockUsers(50);
    render(<UserManagement locale="en" />);
    
    // Verify first page shows 25 users
    const userRows = await screen.findAllByRole('row');
    expect(userRows).toHaveLength(25);
    
    // Verify pagination controls exist
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });
  
  it('should prevent self-blocking', async () => {
    const currentUser = { id: '123', email: 'admin@test.com', isAdmin: true };
    render(<UserManagement locale="en" />, { user: currentUser });
    
    // Try to block self
    const blockButton = screen.getByTestId('block-button-123');
    fireEvent.click(blockButton);
    
    // Verify error message
    expect(await screen.findByText(/cannot block yourself/i)).toBeInTheDocument();
  });
  
  it('should show confirmation dialog before deletion', async () => {
    render(<UserManagement locale="en" />);
    
    const deleteButton = screen.getByTestId('delete-button-456');
    fireEvent.click(deleteButton);
    
    // Verify confirmation dialog appears
    expect(await screen.findByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
```

### Property-Based Testing Approach

Property tests verify universal properties across randomly generated inputs. Each test runs minimum 100 iterations to ensure comprehensive coverage.

**Configuration**:
```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.property.test.ts'],
};

// jest.setup.js
import fc from 'fast-check';

// Configure fast-check
fc.configureGlobal({
  numRuns: 100, // Minimum 100 iterations per property
  verbose: true,
  seed: Date.now()
});
```

**Example Property Tests**:

```typescript
// lib/admin/__tests__/userManagement.property.test.ts

/**
 * Feature: admin-panel-enhancements, Property 1: User List Pagination Consistency
 * 
 * For any user database with N users, when displaying the user list with page size 25,
 * the total number of pages should equal ceil(N / 25) and each page (except possibly
 * the last) should contain exactly 25 users.
 */
describe('Property 1: User List Pagination Consistency', () => {
  it('should maintain pagination consistency for any user count', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.uuid(),
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          isAdmin: fc.boolean(),
          emailVerified: fc.boolean(),
          twoFactorEnabled: fc.boolean(),
          isBlocked: fc.boolean(),
          createdAt: fc.date(),
        }), { minLength: 0, maxLength: 500 }),
        (users) => {
          const pageSize = 25;
          const totalPages = Math.ceil(users.length / pageSize);
          
          for (let page = 1; page <= totalPages; page++) {
            const paginatedUsers = paginateUsers(users, page, pageSize);
            
            if (page < totalPages) {
              // All pages except last should have exactly 25 users
              expect(paginatedUsers.length).toBe(pageSize);
            } else {
              // Last page should have remaining users
              const expectedCount = users.length % pageSize || pageSize;
              expect(paginatedUsers.length).toBe(expectedCount);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: admin-panel-enhancements, Property 3: Search Filter Correctness
 * 
 * For any search query string and user database, all users in the filtered results
 * must have either their email or name containing the search text (case-insensitive).
 */
describe('Property 3: Search Filter Correctness', () => {
  it('should only return users matching search query', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.uuid(),
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
        }), { minLength: 10, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (users, searchQuery) => {
          const filteredUsers = filterUsersBySearch(users, searchQuery);
          
          // Every filtered user must match the search query
          filteredUsers.forEach(user => {
            const matchesEmail = user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesName = user.name.toLowerCase().includes(searchQuery.toLowerCase());
            expect(matchesEmail || matchesName).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: admin-panel-enhancements, Property 6: User Update Round-Trip
 * 
 * For any valid user update (name, email, or admin status), after saving the changes
 * and retrieving the user record, the retrieved data must reflect the updated values.
 */
describe('Property 6: User Update Round-Trip', () => {
  it('should persist user updates correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          isAdmin: fc.boolean(),
        }),
        async (updates) => {
          // Create test user
          const user = await prisma.user.create({
            data: {
              email: 'original@test.com',
              name: 'Original Name',
              passwordHash: 'hash',
              isAdmin: false,
            }
          });
          
          // Update user
          await updateUser(user.id, updates);
          
          // Retrieve user
          const updatedUser = await prisma.user.findUnique({
            where: { id: user.id }
          });
          
          // Verify updates persisted
          expect(updatedUser.email).toBe(updates.email);
          expect(updatedUser.name).toBe(updates.name);
          expect(updatedUser.isAdmin).toBe(updates.isAdmin);
          
          // Cleanup
          await prisma.user.delete({ where: { id: user.id } });
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: admin-panel-enhancements, Property 9: Blocked User Authentication Rejection
 * 
 * For any user with isBlocked=true, authentication attempts must be rejected with
 * a descriptive error message regardless of correct credentials.
 */
describe('Property 9: Blocked User Authentication Rejection', () => {
  it('should reject authentication for all blocked users', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (credentials) => {
          // Create blocked user
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: 'Test User',
              passwordHash: await hashPassword(credentials.password),
              isBlocked: true,
            }
          });
          
          // Attempt authentication
          const result = await authenticateUser(
            credentials.email,
            credentials.password
          );
          
          // Verify rejection
          expect(result.success).toBe(false);
          expect(result.error).toContain('blocked');
          
          // Cleanup
          await prisma.user.delete({ where: { id: user.id } });
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: admin-panel-enhancements, Property 11: Comprehensive Audit Logging
 * 
 * For any administrative action (user update, block, unblock, delete), an audit log
 * entry must be created containing timestamp, admin user ID, action type, target user ID,
 * and relevant details.
 */
describe('Property 11: Comprehensive Audit Logging', () => {
  it('should create audit log for all admin actions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('USER_UPDATED', 'USER_BLOCKED', 'USER_UNBLOCKED', 'USER_DELETED'),
        fc.record({
          targetUserId: fc.uuid(),
          changes: fc.object(),
        }),
        async (actionType, details) => {
          const admin = await createTestAdmin();
          const targetUser = await createTestUser();
          
          // Perform admin action
          await performAdminAction(admin.id, actionType, targetUser.id, details);
          
          // Verify audit log created
          const auditLog = await prisma.adminLog.findFirst({
            where: {
              adminId: admin.id,
              action: actionType,
            },
            orderBy: { createdAt: 'desc' }
          });
          
          expect(auditLog).toBeDefined();
          expect(auditLog.adminId).toBe(admin.id);
          expect(auditLog.action).toBe(actionType);
          expect(auditLog.details).toMatchObject({
            targetUserId: targetUser.id
          });
          expect(auditLog.createdAt).toBeInstanceOf(Date);
          
          // Cleanup
          await cleanupTestData(admin.id, targetUser.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### API Testing

Test API endpoints with Supertest:

```typescript
// app/api/admin/__tests__/users.test.ts
describe('GET /api/admin/users', () => {
  it('should return 403 for non-admin users', async () => {
    const session = await createNonAdminSession();
    
    const response = await request(app)
      .get('/api/admin/users')
      .query({ sessionId: session.id });
    
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('FORBIDDEN');
  });
  
  it('should return paginated users for admin', async () => {
    const adminSession = await createAdminSession();
    await createTestUsers(50);
    
    const response = await request(app)
      .get('/api/admin/users')
      .query({ sessionId: adminSession.id, page: 1, pageSize: 25 });
    
    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(25);
    expect(response.body.total).toBe(50);
    expect(response.body.totalPages).toBe(2);
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 80% code coverage minimum
- **Property Tests**: All 24 correctness properties implemented
- **API Tests**: All endpoints covered
- **Integration Tests**: Critical user flows (user CRUD, statistics viewing)

### Continuous Integration

- Run all tests on every pull request
- Block merges if tests fail
- Generate coverage reports
- Run property tests with different random seeds


## Security Considerations

### Authentication and Authorization

#### Session Verification

All admin API endpoints must verify:
1. Valid session exists
2. Session has not expired
3. User associated with session has `isAdmin=true`

```typescript
// lib/auth/adminAuth.ts
export async function verifyAdminSession(request: Request): Promise<Session | null> {
  const sessionId = new URL(request.url).searchParams.get('sessionId');
  
  if (!sessionId) {
    return null;
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });
  
  if (!session) {
    return null;
  }
  
  // Check expiration
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return null;
  }
  
  // Check admin status
  if (!session.user.isAdmin) {
    return null;
  }
  
  return session;
}
```

#### Client-Side Protection

```typescript
// app/ru/admin/page.tsx
useEffect(() => {
  const checkAdminAccess = async () => {
    if (!user) {
      router.push('/ru');
      return;
    }
    
    // Verify admin status via API
    const response = await fetch('/api/admin/verify');
    if (!response.ok) {
      router.push('/ru');
      return;
    }
    
    setIsAdmin(true);
  };
  
  checkAdminAccess();
}, [user, router]);
```

### Input Validation and Sanitization

#### Server-Side Validation

All user inputs must be validated server-side:

```typescript
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  isAdmin: z.boolean()
});

export async function PUT(request: Request) {
  const body = await request.json();
  
  try {
    const validatedData = updateUserSchema.parse(body);
    // Proceed with update
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }
  }
}
```

#### SQL Injection Prevention

- Use Prisma ORM exclusively (parameterized queries)
- Never construct raw SQL with user input
- If raw SQL is necessary, use parameterized queries

```typescript
// GOOD: Prisma handles parameterization
await prisma.user.findMany({
  where: {
    email: { contains: searchQuery }
  }
});

// BAD: Never do this
await prisma.$queryRaw`SELECT * FROM User WHERE email LIKE '%${searchQuery}%'`;

// ACCEPTABLE: Use parameterized raw queries
await prisma.$queryRaw`SELECT * FROM User WHERE email LIKE ${`%${searchQuery}%`}`;
```

#### XSS Prevention

- React automatically escapes JSX content
- Sanitize HTML if rendering user-generated content
- Use Content Security Policy headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function rateLimit(identifier: string, limit: number = 100): boolean {
  const count = (rateLimitCache.get(identifier) as number) || 0;
  
  if (count >= limit) {
    return false; // Rate limit exceeded
  }
  
  rateLimitCache.set(identifier, count + 1);
  return true;
}

// Usage in API route
export async function GET(request: Request) {
  const session = await verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
  
  if (!rateLimit(session.userId, 100)) {
    return NextResponse.json(
      { error: 'RATE_LIMIT_EXCEEDED', retryAfter: 60 },
      { status: 429 }
    );
  }
  
  // Process request
}
```

### Audit Logging Security

- Audit logs are append-only (no updates or deletes)
- Store sensitive data hashes, not plaintext
- Implement log retention policy (90 days minimum)
- Restrict audit log access to super admins only

```typescript
// Create audit log entry
await prisma.adminLog.create({
  data: {
    adminId: session.userId,
    action: 'USER_DELETED',
    details: {
      targetUserId: userId,
      targetUserEmail: user.email, // OK to store
      // Don't store: passwords, tokens, sensitive personal data
    }
  }
});
```

### Data Privacy

#### GDPR Compliance

- User deletion must remove all personal data (cascade delete)
- Export functionality should include user's own data
- Audit logs should be anonymized after retention period

#### Sensitive Data Handling

- Never log passwords or tokens
- Encrypt OAuth tokens at rest (already implemented)
- Use HTTPS for all communications
- Implement proper session management

### Self-Operation Prevention

Prevent administrators from performing dangerous operations on themselves:

```typescript
// Prevent self-blocking
if (targetUserId === session.userId) {
  return NextResponse.json(
    { error: 'FORBIDDEN', message: 'Cannot block your own account' },
    { status: 403 }
  );
}

// Prevent self-deletion
if (targetUserId === session.userId) {
  return NextResponse.json(
    { error: 'FORBIDDEN', message: 'Cannot delete your own account' },
    { status: 403 }
  );
}

// Prevent self-demotion
if (targetUserId === session.userId && updates.isAdmin === false) {
  return NextResponse.json(
    { error: 'FORBIDDEN', message: 'Cannot remove your own admin privileges' },
    { status: 403 }
  );
}
```

## Performance Optimizations

### Database Query Optimization

#### Indexing Strategy

Ensure proper indexes exist for common queries:

```prisma
model User {
  // ... fields
  
  @@index([email])
  @@index([emailVerified])
  @@index([twoFactorEnabled])
  @@index([isBlocked])
  @@index([createdAt])
  @@index([isAdmin])
}

model AdminLog {
  // ... fields
  
  @@index([adminId])
  @@index([createdAt])
  @@index([action])
}

model Calculation {
  // ... fields
  
  @@index([userId])
  @@index([createdAt])
}
```

#### Efficient Pagination

Use cursor-based pagination for large datasets:

```typescript
// For initial page
const users = await prisma.user.findMany({
  take: 25,
  orderBy: { createdAt: 'desc' },
  include: {
    _count: {
      select: {
        calculations: true,
        purchases: true
      }
    }
  }
});

// For subsequent pages
const users = await prisma.user.findMany({
  take: 25,
  skip: 1, // Skip the cursor
  cursor: { id: lastUserId },
  orderBy: { createdAt: 'desc' },
  include: {
    _count: {
      select: {
        calculations: true,
        purchases: true
      }
    }
  }
});
```

#### Aggregation Queries

Use database aggregation for statistics:

```typescript
// Efficient: Single aggregation query
const stats = await prisma.user.aggregate({
  _count: { id: true },
  where: {
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  }
});

// Efficient: Group by for time series
const userGrowth = await prisma.$queryRaw`
  SELECT DATE(created_at) as date, COUNT(*) as count
  FROM "User"
  WHERE created_at >= ${startDate}
  GROUP BY DATE(created_at)
  ORDER BY date ASC
`;
```

### Caching Strategy

#### Server-Side Caching

Cache statistics data for 30 seconds:

```typescript
import { LRUCache } from 'lru-cache';

const statsCache = new LRUCache({
  max: 100,
  ttl: 30000, // 30 seconds
});

export async function GET(request: Request) {
  const timeRange = searchParams.get('timeRange') || '30d';
  const cacheKey = `stats:${timeRange}`;
  
  // Check cache
  const cached = statsCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }
  
  // Fetch fresh data
  const stats = await fetchStatistics(timeRange);
  
  // Cache result
  statsCache.set(cacheKey, stats);
  
  return NextResponse.json(stats);
}
```

#### Client-Side Caching

Use SWR or React Query for client-side caching:

```typescript
import useSWR from 'swr';

function StatisticsDashboard() {
  const { data, error, mutate } = useSWR(
    `/api/admin/statistics?timeRange=${timeRange}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );
  
  // ... component logic
}
```

### Frontend Performance

#### Code Splitting

Split admin components to reduce initial bundle size:

```typescript
// app/ru/admin/page.tsx
import dynamic from 'next/dynamic';

const UserManagement = dynamic(() => import('@/components/admin/UserManagement'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const StatisticsDashboard = dynamic(() => import('@/components/admin/StatisticsDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

#### Debouncing Search Input

Prevent excessive API calls during search:

```typescript
import { useDebouncedCallback } from 'use-debounce';

const handleSearchChange = useDebouncedCallback(
  (value: string) => {
    setSearchQuery(value);
    fetchUsers({ search: value });
  },
  300 // 300ms delay
);
```

#### Virtual Scrolling

For very large user lists, implement virtual scrolling:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Row height
    overscan: 5
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <UserRow
            key={users[virtualRow.index].id}
            user={users[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

#### Chart Performance

Optimize Chart.js rendering:

```typescript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300 // Reduce animation time
  },
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 10 // Limit number of x-axis labels
      }
    }
  },
  // Disable animations on data updates for better performance
  transitions: {
    active: {
      animation: {
        duration: 0
      }
    }
  }
};
```

### Network Optimization

#### Request Batching

Batch multiple API calls when possible:

```typescript
// Instead of multiple requests
const users = await fetch('/api/admin/users');
const stats = await fetch('/api/admin/statistics');
const logs = await fetch('/api/admin/logs');

// Use a single batch endpoint
const data = await fetch('/api/admin/batch', {
  method: 'POST',
  body: JSON.stringify({
    requests: ['users', 'statistics', 'logs']
  })
});
```

#### Compression

Enable gzip/brotli compression in Next.js:

```typescript
// next.config.js
module.exports = {
  compress: true,
  // ... other config
};
```

## Implementation Notes

### Migration Plan

#### Phase 1: Database Schema Update

1. Create migration file for `isBlocked` field
2. Run migration on development database
3. Test with existing data
4. Run migration on production (zero downtime)

```bash
npx prisma migrate dev --name add_user_blocked_field
npx prisma generate
```

#### Phase 2: API Endpoints

1. Implement `/api/admin/users` endpoints
2. Add authentication middleware
3. Implement audit logging
4. Add rate limiting
5. Write API tests

#### Phase 3: Frontend Components

1. Create `UserManagement` component
2. Create `UserDetailsModal` component
3. Enhance `StatisticsDashboard` component
4. Add Chart.js integration
5. Implement export functionality

#### Phase 4: Testing and QA

1. Write unit tests
2. Write property-based tests
3. Manual testing on staging
4. Performance testing
5. Security audit

#### Phase 5: Deployment

1. Deploy to staging environment
2. Run smoke tests
3. Deploy to production
4. Monitor for errors
5. Gather user feedback

### Dependencies to Add

```json
{
  "dependencies": {
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "xlsx": "^0.18.5",
    "lru-cache": "^10.0.0",
    "zod": "^3.22.0",
    "use-debounce": "^10.0.0",
    "@tanstack/react-virtual": "^3.0.0"
  },
  "devDependencies": {
    "fast-check": "^3.13.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "supertest": "^6.3.0"
  }
}
```

### Translation Keys to Add

#### Russian (messages/ru.json)

```json
{
  "admin": {
    "users": {
      "title": "Управление пользователями",
      "search": "Поиск по email или имени",
      "filters": "Фильтры",
      "emailVerified": "Email подтвержден",
      "twoFactorEnabled": "2FA включена",
      "isBlocked": "Заблокирован",
      "dateRange": "Диапазон дат",
      "actions": "Действия",
      "edit": "Редактировать",
      "block": "Заблокировать",
      "unblock": "Разблокировать",
      "delete": "Удалить",
      "confirmDelete": "Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.",
      "confirmBlock": "Вы уверены, что хотите заблокировать этого пользователя?",
      "cannotBlockSelf": "Вы не можете заблокировать свой собственный аккаунт",
      "cannotDeleteSelf": "Вы не можете удалить свой собственный аккаунт",
      "userBlocked": "Пользователь заблокирован",
      "userUnblocked": "Пользователь разблокирован",
      "userDeleted": "Пользователь удален",
      "userUpdated": "Пользователь обновлен"
    },
    "statistics": {
      "title": "Статистика",
      "timeRange": "Период",
      "last7Days": "Последние 7 дней",
      "last30Days": "Последние 30 дней",
      "last90Days": "Последние 90 дней",
      "allTime": "Все время",
      "custom": "Настроить",
      "export": "Экспорт",
      "exportCSV": "Экспорт в CSV",
      "exportExcel": "Экспорт в Excel",
      "userGrowth": "Рост пользователей",
      "calculationTrends": "Тренды расчетов",
      "revenueTrends": "Тренды доходов",
      "oauthUsage": "Использование OAuth",
      "activeUsers7d": "Активные пользователи (7 дней)",
      "activeUsers30d": "Активные пользователи (30 дней)",
      "emailVerificationRate": "Процент подтвержденных email",
      "twoFactorAdoptionRate": "Процент использования 2FA",
      "lastUpdated": "Последнее обновление"
    }
  }
}
```

#### English (messages/en.json)

```json
{
  "admin": {
    "users": {
      "title": "User Management",
      "search": "Search by email or name",
      "filters": "Filters",
      "emailVerified": "Email Verified",
      "twoFactorEnabled": "2FA Enabled",
      "isBlocked": "Blocked",
      "dateRange": "Date Range",
      "actions": "Actions",
      "edit": "Edit",
      "block": "Block",
      "unblock": "Unblock",
      "delete": "Delete",
      "confirmDelete": "Are you sure you want to delete this user? This action cannot be undone.",
      "confirmBlock": "Are you sure you want to block this user?",
      "cannotBlockSelf": "You cannot block your own account",
      "cannotDeleteSelf": "You cannot delete your own account",
      "userBlocked": "User blocked",
      "userUnblocked": "User unblocked",
      "userDeleted": "User deleted",
      "userUpdated": "User updated"
    },
    "statistics": {
      "title": "Statistics",
      "timeRange": "Time Range",
      "last7Days": "Last 7 Days",
      "last30Days": "Last 30 Days",
      "last90Days": "Last 90 Days",
      "allTime": "All Time",
      "custom": "Custom",
      "export": "Export",
      "exportCSV": "Export to CSV",
      "exportExcel": "Export to Excel",
      "userGrowth": "User Growth",
      "calculationTrends": "Calculation Trends",
      "revenueTrends": "Revenue Trends",
      "oauthUsage": "OAuth Usage",
      "activeUsers7d": "Active Users (7 days)",
      "activeUsers30d": "Active Users (30 days)",
      "emailVerificationRate": "Email Verification Rate",
      "twoFactorAdoptionRate": "2FA Adoption Rate",
      "lastUpdated": "Last Updated"
    }
  }
}
```

### File Structure

```
.kiro/specs/admin-panel-enhancements/
├── .config.kiro
├── requirements.md
├── design.md (this file)
└── tasks.md (to be created)

app/
├── api/
│   └── admin/
│       ├── users/
│       │   ├── route.ts (GET, POST)
│       │   └── [id]/
│       │       ├── route.ts (GET, PUT, DELETE)
│       │       └── block/
│       │           └── route.ts (PATCH)
│       ├── statistics/
│       │   └── route.ts (GET - enhanced)
│       ├── export/
│       │   └── route.ts (POST)
│       └── verify/
│           └── route.ts (GET)
├── [locale]/
│   └── admin/
│       └── page.tsx (enhanced with Users tab)

components/
└── admin/
    ├── UserManagement.tsx (new)
    ├── UserDetailsModal.tsx (new)
    ├── StatisticsDashboard.tsx (enhanced)
    ├── ChartWrapper.tsx (new)
    ├── ExportButton.tsx (new)
    ├── ArticleManager.tsx (existing)
    ├── AdminLogs.tsx (existing)
    └── ServiceManager.tsx (existing)

lib/
├── admin/
│   ├── userManagement.ts (business logic)
│   ├── statistics.ts (enhanced)
│   └── export.ts (new)
├── auth/
│   └── adminAuth.ts (admin verification)
└── utils/
    └── rateLimit.ts (new)

prisma/
├── schema.prisma (updated with isBlocked)
└── migrations/
    └── YYYYMMDDHHMMSS_add_user_blocked_field/
        └── migration.sql

__tests__/
├── components/
│   └── admin/
│       ├── UserManagement.test.tsx
│       ├── UserDetailsModal.test.tsx
│       └── StatisticsDashboard.test.tsx
├── api/
│   └── admin/
│       ├── users.test.ts
│       └── statistics.test.ts
└── lib/
    └── admin/
        ├── userManagement.property.test.ts
        └── statistics.property.test.ts
```

### Monitoring and Observability

#### Metrics to Track

- Admin panel page load time
- API endpoint response times
- User management operation success/failure rates
- Statistics dashboard refresh rate
- Export operation completion time
- Rate limit violations
- Authentication failures

#### Logging

```typescript
// Log admin actions
console.log({
  level: 'info',
  message: 'Admin action performed',
  adminId: session.userId,
  action: 'USER_BLOCKED',
  targetUserId: userId,
  timestamp: new Date().toISOString()
});

// Log errors
console.error({
  level: 'error',
  message: 'User deletion failed',
  adminId: session.userId,
  targetUserId: userId,
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
});
```

#### Alerts

Set up alerts for:
- High rate of authentication failures
- Unusual number of user deletions
- API error rate exceeds threshold
- Database query performance degradation

---

## Summary

This design document provides a comprehensive technical specification for enhancing the FATOS.pro admin panel with user management capabilities and improved statistics visualization. The implementation follows Next.js 14 best practices, maintains the existing mystical theme, ensures bilingual support, and prioritizes security, performance, and correctness through property-based testing.

Key architectural decisions:
- Chart.js for visualizations (lightweight, well-documented)
- Session-based authentication with admin verification on every request
- Prisma ORM for type-safe database operations
- Property-based testing with fast-check for comprehensive correctness validation
- LRU cache for statistics with 30-second TTL
- Responsive design with mobile-first approach
- Comprehensive audit logging for compliance

The design is ready for task breakdown and implementation.
