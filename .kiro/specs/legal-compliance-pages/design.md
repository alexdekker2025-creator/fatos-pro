# Design Document: Legal Compliance Pages

## Overview

This design document outlines the technical implementation for adding legal compliance pages (Privacy Policy, Terms of Service) and a contact support system to FATOS.pro. The implementation follows Next.js 14 App Router conventions with TypeScript, integrates with the existing i18n infrastructure, and provides a robust contact form with email delivery and rate limiting.

### Key Design Goals

- Leverage existing Next.js 14 App Router structure with locale-based routing
- Integrate seamlessly with existing i18n system (Russian/English)
- Provide reliable email delivery using Resend API
- Implement serverless-friendly rate limiting with Upstash Redis
- Maintain consistent purple/amber theme design
- Ensure accessibility and SEO compliance
- Store contact submissions for audit trail

### Technology Stack

- **Frontend**: Next.js 14 App Router, React, TypeScript, Tailwind CSS
- **Email Service**: Resend (recommended for Next.js, excellent DX)
- **Rate Limiting**: Upstash Redis (serverless-compatible, edge-ready)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod for schema validation
- **Internationalization**: next-intl (existing setup)

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Privacy Policy Page]
        B[Terms of Service Page]
        C[Contact Form Page]
    end
    
    subgraph "API Layer"
        D[POST /api/contact]
        E[Rate Limiter Middleware]
    end
    
    subgraph "Service Layer"
        F[Email Service]
        G[Contact Service]
    end
    
    subgraph "External Services"
        H[Resend API]
        I[Upstash Redis]
    end
    
    subgraph "Data Layer"
        J[(PostgreSQL)]
    end
    
    C --> D
    D --> E
    E --> G
    G --> F
    G --> J
    F --> H
    E --> I
    
    style A fill:#9333ea
    style B fill:#9333ea
    style C fill:#9333ea
    style D fill:#d97706
    style H fill:#10b981
    style I fill:#10b981
```

### Directory Structure


```
app/
├── [locale]/
│   ├── privacy-policy/
│   │   └── page.tsx          # Privacy Policy page
│   ├── terms-of-service/
│   │   └── page.tsx          # Terms of Service page
│   └── contact/
│       └── page.tsx          # Contact form page
├── api/
│   └── contact/
│       └── route.ts          # Contact form submission endpoint
│
components/
├── Footer.tsx                # Updated with legal links
├── legal/
│   ├── PrivacyPolicyContent.tsx
│   ├── TermsOfServiceContent.tsx
│   └── ContactForm.tsx
│
lib/
├── services/
│   ├── emailService.ts       # Resend email integration
│   ├── contactService.ts     # Contact submission logic
│   └── rateLimiter.ts        # Upstash Redis rate limiting
├── validations/
│   └── contactSchema.ts      # Zod validation schemas
│
messages/
├── ru.json                   # Russian translations (updated)
└── en.json                   # English translations (updated)
```

### Routing Strategy

The application uses Next.js 14 App Router with locale-based routing:

- **Privacy Policy**: `/{locale}/privacy-policy`
- **Terms of Service**: `/{locale}/terms-of-service`
- **Contact Form**: `/{locale}/contact`
- **API Endpoint**: `/api/contact` (POST)

All pages follow the existing pattern where locale is part of the URL path (`/ru/...` or `/en/...`).

## Components and Interfaces

### 1. Privacy Policy Page

**Location**: `app/[locale]/privacy-policy/page.tsx`

**Purpose**: Display privacy policy content in the user's selected language.

**Implementation**:
```typescript
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'privacy' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <PrivacyPolicyContent locale={params.locale} />
    </div>
  );
}
```

**Key Features**:
- Server-side metadata generation for SEO
- Responsive container with max-width for readability
- Delegates content rendering to dedicated component

### 2. Terms of Service Page

**Location**: `app/[locale]/terms-of-service/page.tsx`

**Purpose**: Display terms of service content in the user's selected language.

**Implementation**: Similar structure to Privacy Policy page, using `TermsOfServiceContent` component.

### 3. Contact Form Page

**Location**: `app/[locale]/contact/page.tsx`

**Purpose**: Display contact form for user inquiries.

**Implementation**:
```typescript
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/legal/ContactForm';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <ContactForm locale={params.locale} />
    </div>
  );
}
```

### 4. Contact Form Component

**Location**: `components/legal/ContactForm.tsx`

**Purpose**: Client-side form with validation, submission handling, and user feedback.

**Interface**:
```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  locale: string;
}
```

**Key Features**:
- Client-side validation using Zod schema
- Real-time validation feedback
- Loading states during submission
- Success/error message display
- Form reset after successful submission
- Accessible form labels and ARIA attributes

**State Management**:
```typescript
const [formData, setFormData] = useState<ContactFormData>({
  name: '',
  email: '',
  subject: '',
  message: '',
});
const [errors, setErrors] = useState<Partial<ContactFormData>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
```

### 5. Legal Content Components

**Location**: `components/legal/PrivacyPolicyContent.tsx` and `TermsOfServiceContent.tsx`

**Purpose**: Render structured legal content with proper typography and sections.

**Design Pattern**:
- Use semantic HTML (`<article>`, `<section>`, `<h1>`, `<h2>`, etc.)
- Apply consistent Tailwind classes for typography
- Support both Russian and English content via translations
- Include table of contents for long documents

**Typography Classes**:
```typescript
const styles = {
  heading1: "text-4xl font-bold text-purple-700 mb-6",
  heading2: "text-2xl font-semibold text-purple-600 mt-8 mb-4",
  heading3: "text-xl font-semibold text-purple-500 mt-6 mb-3",
  paragraph: "text-gray-700 mb-4 leading-relaxed",
  list: "list-disc list-inside space-y-2 mb-4 text-gray-700",
  section: "mb-8",
};
```

### 6. Updated Footer Component

**Location**: `components/Footer.tsx` (existing, to be updated)

**Changes Required**:
- Add "Contact" link to appropriate section
- Update translation keys to include contact link
- Ensure links use correct locale-based routing

**Updated Structure**:
```typescript
{/* Legal & Support Section */}
<div>
  <h3 className="text-xl font-bold mb-4">{t('legal')}</h3>
  <ul className="space-y-2">
    <li>
      <Link href={`/${locale}/privacy-policy`} className="...">
        {t('privacy')}
      </Link>
    </li>
    <li>
      <Link href={`/${locale}/terms-of-service`} className="...">
        {t('terms')}
      </Link>
    </li>
    <li>
      <Link href={`/${locale}/contact`} className="...">
        {t('contact')}
      </Link>
    </li>
  </ul>
</div>
```

## Data Models

### ContactSubmission Model

**Location**: `prisma/schema.prisma`

**Purpose**: Store all contact form submissions for audit trail and follow-up.

**Schema Definition**:
```prisma
model ContactSubmission {
  id              String              @id @default(cuid())
  name            String
  email           String
  subject         String
  message         String              @db.Text
  locale          String              @db.VarChar(2)
  status          ContactStatus       @default(PENDING)
  emailSent       Boolean             @default(false)
  emailSentAt     DateTime?
  emailError      String?             @db.Text
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  
  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@index([emailSent])
}

enum ContactStatus {
  PENDING
  PROCESSED
  SPAM
  RESOLVED
}
```

**Field Descriptions**:
- `id`: Unique identifier (CUID)
- `name`: Submitter's name
- `email`: Submitter's email address
- `subject`: Message subject line
- `message`: Full message content (TEXT type for long messages)
- `locale`: Language used when submitting (ru/en)
- `status`: Processing status (for future admin panel integration)
- `emailSent`: Whether email was successfully sent to support
- `emailSentAt`: Timestamp of successful email delivery
- `emailError`: Error message if email delivery failed
- `ipAddress`: Submitter's IP (for rate limiting and spam detection)
- `userAgent`: Browser user agent (for analytics)
- `createdAt`: Submission timestamp
- `updatedAt`: Last update timestamp

**Indexes**:
- `email`: For looking up submissions by user
- `status`: For filtering by processing status
- `createdAt`: For chronological queries
- `emailSent`: For finding failed deliveries

## API Routes

### POST /api/contact

**Purpose**: Handle contact form submissions with validation, rate limiting, email delivery, and database storage.

**Request Schema**:
```typescript
interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}
```

**Response Schema**:
```typescript
interface ContactResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}
```

**Implementation Flow**:

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant RateLimiter
    participant Validator
    participant Database
    participant EmailService
    
    Client->>API: POST /api/contact
    API->>RateLimiter: Check rate limit
    alt Rate limit exceeded
        RateLimiter-->>API: Reject
        API-->>Client: 429 Too Many Requests
    else Rate limit OK
        RateLimiter-->>API: Allow
        API->>Validator: Validate input
        alt Validation fails
            Validator-->>API: Errors
            API-->>Client: 400 Bad Request
        else Validation passes
            Validator-->>API: Valid data
            API->>Database: Create ContactSubmission
            Database-->>API: Submission created
            API->>EmailService: Send email
            alt Email sent
                EmailService-->>API: Success
                API->>Database: Update emailSent=true
                API-->>Client: 200 Success
            else Email failed
                EmailService-->>API: Error
                API->>Database: Update emailError
                API-->>Client: 500 Email Error
            end
        end
    end
```

**Implementation**:
```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/services/rateLimiter';
import { contactSchema } from '@/lib/validations/contactSchema';
import { createContactSubmission } from '@/lib/services/contactService';
import { sendContactEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 3. Create database record
    const submission = await createContactSubmission({
      ...data,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // 4. Send email
    try {
      await sendContactEmail(data);
      
      // Update submission with success status
      await updateSubmissionEmailStatus(submission.id, true);
      
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
        submissionId: submission.id,
      });
    } catch (emailError) {
      // Update submission with error
      await updateSubmissionEmailStatus(
        submission.id, 
        false, 
        emailError.message
      );
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email. Your message was saved and we will respond soon.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Service Layer

### Email Service (Resend Integration)

**Location**: `lib/services/emailService.ts`

**Purpose**: Handle email delivery using Resend API.

**Why Resend?**
- Built specifically for Next.js and modern web apps
- Excellent developer experience with TypeScript support
- Reliable delivery with webhooks for tracking
- Generous free tier (100 emails/day)
- Simple API with React Email support
- Good reputation and deliverability

**Configuration**:
```typescript
// Environment variables required:
// RESEND_API_KEY=re_xxxxx
// CONTACT_EMAIL=support@fatos.pro
```

**Implementation**:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const { name, email, subject, message, locale } = data;
  
  const emailSubject = locale === 'ru' 
    ? `Новое сообщение от ${name}: ${subject}`
    : `New message from ${name}: ${subject}`;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Language:</strong> ${locale.toUpperCase()}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #7c3aed;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      
      <p style="color: #6b7280; font-size: 14px;">
        This email was sent from the FATOS.pro contact form.
      </p>
    </div>
  `;

  const result = await resend.emails.send({
    from: 'FATOS.pro Contact Form <noreply@fatos.pro>',
    to: process.env.CONTACT_EMAIL || 'support@fatos.pro',
    replyTo: email,
    subject: emailSubject,
    html: emailHtml,
  });

  if (!result.data) {
    throw new Error('Failed to send email via Resend');
  }
}
```

**Error Handling**:
- Throws errors for failed sends (caught by API route)
- Logs errors with Resend error details
- Gracefully handles API key issues

### Contact Service

**Location**: `lib/services/contactService.ts`

**Purpose**: Business logic for contact submissions and database operations.

**Implementation**:
```typescript
import { prisma } from '@/lib/prisma';
import { ContactStatus } from '@prisma/client';

interface CreateContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createContactSubmission(data: CreateContactSubmissionData) {
  return await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      locale: data.locale,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: ContactStatus.PENDING,
      emailSent: false,
    },
  });
}

export async function updateSubmissionEmailStatus(
  submissionId: string,
  sent: boolean,
  error?: string
) {
  return await prisma.contactSubmission.update({
    where: { id: submissionId },
    data: {
      emailSent: sent,
      emailSentAt: sent ? new Date() : null,
      emailError: error || null,
    },
  });
}

export async function getContactSubmissions(filters?: {
  email?: string;
  status?: ContactStatus;
  emailSent?: boolean;
  limit?: number;
}) {
  return await prisma.contactSubmission.findMany({
    where: {
      email: filters?.email,
      status: filters?.status,
      emailSent: filters?.emailSent,
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 50,
  });
}
```

### Rate Limiter Service

**Location**: `lib/services/rateLimiter.ts`

**Purpose**: Prevent spam and abuse using Upstash Redis.

**Why Upstash Redis?**
- Serverless-friendly (no persistent connections)
- Edge-compatible (works with Vercel Edge Functions)
- Built-in rate limiting algorithms
- Generous free tier (10,000 commands/day)
- Global replication for low latency
- REST API (no Redis client needed)

**Configuration**:
```typescript
// Environment variables required:
// UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
// UPSTASH_REDIS_REST_TOKEN=xxxxx
```

**Implementation**:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiter: 3 requests per hour per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: 'ratelimit:contact',
});

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  return {
    allowed: success,
    limit,
    remaining,
    reset,
    retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000),
  };
}

// For testing/development: bypass rate limiting
export async function resetRateLimit(identifier: string): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    await redis.del(`ratelimit:contact:${identifier}`);
  }
}
```

**Rate Limiting Strategy**:
- **Algorithm**: Sliding window (more accurate than fixed window)
- **Limit**: 3 submissions per hour per IP address
- **Identifier**: IP address from `x-forwarded-for` header
- **Response**: 429 status with retry-after information
- **Logging**: Track violations in SecurityLog table

**Alternative for Development**:
If Upstash is not available, implement simple in-memory rate limiting:

```typescript
// Simple in-memory rate limiter (development only)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimitSimple(ip: string): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return { allowed: true, limit: 3, remaining: 2, reset: now + 3600000 };
  }
  
  if (entry.count >= 3) {
    return { 
      allowed: false, 
      limit: 3, 
      remaining: 0, 
      reset: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000)
    };
  }
  
  entry.count++;
  return { 
    allowed: true, 
    limit: 3, 
    remaining: 3 - entry.count, 
    reset: entry.resetAt 
  };
}
```

## Validation Schemas

### Contact Form Schema

**Location**: `lib/validations/contactSchema.ts`

**Purpose**: Validate contact form input using Zod.

**Implementation**:
```typescript
import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  
  locale: z
    .enum(['ru', 'en'])
    .default('ru'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

**Validation Rules**:
- **Name**: Required, 1-100 characters, trimmed
- **Email**: Required, valid email format, lowercase, trimmed
- **Subject**: Required, 1-200 characters, trimmed
- **Message**: Required, 10-5000 characters, trimmed
- **Locale**: Must be 'ru' or 'en', defaults to 'ru'

## Internationalization

### Translation Structure

**Location**: `messages/ru.json` and `messages/en.json`

**New Namespaces Required**:

1. **privacy**: Privacy Policy page content
2. **terms**: Terms of Service page content
3. **contact**: Contact form labels and messages
4. **footer**: Updated footer links (add contact)

**Example Translation Keys**:

```json
{
  "privacy": {
    "metaTitle": "Privacy Policy - FATOS.pro",
    "metaDescription": "Learn how FATOS.pro collects, uses, and protects your personal data.",
    "title": "Privacy Policy",
    "lastUpdated": "Last updated: {date}",
    "sections": {
      "introduction": {
        "title": "Introduction",
        "content": "..."
      },
      "dataCollection": {
        "title": "Data Collection",
        "content": "..."
      }
    }
  },
  
  "terms": {
    "metaTitle": "Terms of Service - FATOS.pro",
    "metaDescription": "Read the terms and conditions for using FATOS.pro services.",
    "title": "Terms of Service",
    "lastUpdated": "Last updated: {date}",
    "sections": {
      "acceptance": {
        "title": "Acceptance of Terms",
        "content": "..."
      }
    }
  },
  
  "contact": {
    "metaTitle": "Contact Us - FATOS.pro",
    "metaDescription": "Get in touch with FATOS.pro support team.",
    "title": "Contact Us",
    "description": "Have a question or need help? Send us a message and we'll get back to you soon.",
    "form": {
      "name": "Name",
      "namePlaceholder": "Your name",
      "email": "Email",
      "emailPlaceholder": "your@email.com",
      "subject": "Subject",
      "subjectPlaceholder": "What is this about?",
      "message": "Message",
      "messagePlaceholder": "Tell us more...",
      "submit": "Send Message",
      "submitting": "Sending..."
    },
    "validation": {
      "nameRequired": "Name is required",
      "emailRequired": "Email is required",
      "emailInvalid": "Invalid email address",
      "subjectRequired": "Subject is required",
      "messageRequired": "Message is required",
      "messageMinLength": "Message must be at least 10 characters"
    },
    "success": {
      "title": "Message Sent!",
      "description": "Thank you for contacting us. We'll respond to your inquiry soon."
    },
    "error": {
      "title": "Error",
      "description": "Failed to send message. Please try again later.",
      "rateLimitExceeded": "Too many requests. Please try again in {minutes} minutes."
    }
  },
  
  "footer": {
    "description": "Numerology and destiny matrix calculations",
    "links": "Links",
    "about": "About",
    "faq": "FAQ",
    "legal": "Legal & Support",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "contact": "Contact Us",
    "copyright": "All rights reserved."
  }
}
```

### Content Management Strategy

For legal pages, there are two approaches:

**Option 1: Translations in JSON** (Recommended for shorter content)
- Store all content in translation files
- Easy to update and version control
- Good for content that changes infrequently

**Option 2: Database-backed Content** (For longer, frequently updated content)
- Use existing `ContentPage` model
- Create admin interface for editing
- Better for complex legal documents

**Recommendation**: Start with Option 1 (JSON translations) for MVP, migrate to Option 2 if legal team needs frequent updates.



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Locale-specific page rendering** (1.2, 1.3, 2.2, 2.3, 3.2, 3.3): These can be combined into a single property about locale-based content rendering across all pages.

2. **Database persistence** (5.4, 7.1): These are duplicate requirements and should be one property.

3. **Email content completeness** (6.1, 7.2): Both test that all form fields are included in their respective outputs (email and database).

4. **Translation completeness** (9.1-9.6): All test the same pattern (translation keys exist for both locales) and can be combined.

5. **Footer links** (8.1, 8.2, 8.3): All test the same pattern (link exists) and can be combined.

6. **Error logging** (10.4, 12.5): Both test that errors are logged, can be combined into one property about comprehensive error logging.

After reflection, the following properties provide unique validation value:

### Property 1: Form Validation Rejects Invalid Input

*For any* contact form submission with missing required fields (name, email, subject, or message), the system should reject the submission and display an error message indicating which field is required.

**Validates: Requirements 4.1**

### Property 2: Email Validation Rejects Invalid Formats

*For any* string that doesn't match valid email format (missing @, invalid domain, etc.), the email validation should reject it and display an appropriate error message.

**Validates: Requirements 4.2**

### Property 3: Message Length Validation

*For any* message string with fewer than 10 characters, the validation should reject it and display a minimum length error message.

**Validates: Requirements 4.3**

### Property 4: Validation Prevents Submission

*For any* form state that fails validation rules, the form submission should be blocked until all validation rules are satisfied.

**Validates: Requirements 4.4**

### Property 5: Validation Errors Are Localized

*For any* validation error and any locale (ru or en), the error message displayed should be in the user's selected locale.

**Validates: Requirements 4.5**

### Property 6: Valid Submissions Trigger Email Delivery

*For any* valid contact form submission (all fields valid, rate limit not exceeded), the system should send an email to the support address containing all submission details.

**Validates: Requirements 5.1, 6.1**

### Property 7: Successful Submission Shows Success Feedback

*For any* contact form submission that completes successfully (email sent, database saved), the system should display a success message to the user.

**Validates: Requirements 5.2**

### Property 8: Submissions Are Persisted to Database

*For any* contact form submission (regardless of email delivery status), the system should create a ContactSubmission record in the database with all form fields, locale, and timestamp.

**Validates: Requirements 5.4, 7.1, 7.2, 7.3**

### Property 9: Successful Submission Clears Form

*For any* contact form submission that completes successfully, the system should reset all form fields to empty values.

**Validates: Requirements 5.5**

### Property 10: Email Contains All Required Fields

*For any* contact form submission, the generated email should include the user's name, email, subject, message, locale, and submission timestamp with clear labels for each field.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 11: Database Records Track Email Status

*For any* contact submission, the database record should include an emailSent boolean field and emailSentAt timestamp that accurately reflect whether the email was delivered successfully.

**Validates: Requirements 7.4**

### Property 12: Unique Identifiers for Submissions

*For any* set of contact submissions, each submission should have a unique identifier (CUID) that distinguishes it from all other submissions.

**Validates: Requirements 7.5**

### Property 13: Footer Links Include Locale Prefix

*For any* locale (ru or en), all footer links to legal pages and contact form should include the correct locale prefix in their href attributes (e.g., /ru/privacy-policy, /en/contact).

**Validates: Requirements 8.6**

### Property 14: Form Labels Are Properly Associated

*For any* form input field in the contact form, there should be a properly associated label element (via htmlFor/id or wrapping) for accessibility.

**Validates: Requirements 11.3**

### Property 15: Rate Limit Rejection Includes Retry Information

*For any* contact form submission that is rejected due to rate limiting, the error response should include information about when the user can submit again (retry-after time).

**Validates: Requirements 12.2**

### Property 16: Error Logging Is Comprehensive

*For any* error that occurs during contact form processing (validation, email delivery, database, rate limiting), the system should create a log entry with sufficient detail for debugging (error type, message, stack trace, context).

**Validates: Requirements 10.4, 12.5**

### Property 17: Locale-Based Content Rendering

*For any* legal page (privacy-policy, terms-of-service, contact) and any locale (ru or en), navigating to /{locale}/{page} should render content in the specified locale.

**Validates: Requirements 1.2, 1.3, 2.2, 2.3, 3.2, 3.3**

## Error Handling

### Error Categories

The system handles four main categories of errors:

1. **Validation Errors** (400 Bad Request)
   - Missing required fields
   - Invalid email format
   - Message too short/long
   - Invalid locale

2. **Rate Limiting Errors** (429 Too Many Requests)
   - Too many submissions from same IP
   - Includes retry-after information

3. **Service Errors** (500 Internal Server Error)
   - Email service unavailable
   - Database connection failed
   - Unexpected exceptions

4. **Network Errors** (Client-side)
   - Request timeout
   - Connection refused
   - DNS resolution failed

### Error Response Format

All API errors follow a consistent format:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // For validation errors
  retryAfter?: number; // For rate limiting errors
  code?: string; // Error code for client-side handling
}
```

### Error Handling Strategy

**Client-Side**:
- Display user-friendly error messages in current locale
- Show field-specific validation errors inline
- Provide retry guidance for rate limiting
- Log errors to console for debugging

**Server-Side**:
- Log all errors with context (user, IP, timestamp)
- Sanitize error messages before sending to client
- Store failed submissions in database for follow-up
- Alert on critical errors (email service down)

**Graceful Degradation**:
- If email fails, still save to database
- If database fails, attempt email and log error
- If both fail, return error but don't lose user's message (client-side storage)

### Error Logging

All errors are logged to the `SecurityLog` table with:
- Event type (e.g., "contact_form_error")
- IP address
- User agent
- Error details in metadata JSON
- Timestamp

Example log entry:
```typescript
{
  event: "contact_form_email_failed",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  metadata: {
    submissionId: "clx123...",
    error: "Resend API error: Invalid API key",
    email: "user@example.com",
    locale: "ru"
  }
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples (e.g., submitting a valid form with known values)
- Edge cases (e.g., exactly 10 character message, empty fields)
- Error conditions (e.g., email service returns 500)
- Integration points (e.g., Resend API, Upstash Redis)
- UI rendering (e.g., form fields exist, footer links present)

**Property-Based Tests** focus on:
- Universal properties across all inputs (e.g., any valid submission creates database record)
- Validation rules (e.g., any invalid email is rejected)
- Localization (e.g., any error in any locale is translated)
- Data integrity (e.g., any submission has unique ID)

### Property-Based Testing Configuration

**Library Selection**:
- **JavaScript/TypeScript**: Use `fast-check` library
- **Installation**: `npm install --save-dev fast-check @types/fast-check`
- **Minimum iterations**: 100 runs per property test
- **Tag format**: `// Feature: legal-compliance-pages, Property {N}: {description}`

**Example Property Test**:
```typescript
import fc from 'fast-check';
import { contactSchema } from '@/lib/validations/contactSchema';

// Feature: legal-compliance-pages, Property 2: Email Validation Rejects Invalid Formats
describe('Email validation property', () => {
  it('should reject any invalid email format', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') || !s.includes('.')),
        (invalidEmail) => {
          const result = contactSchema.safeParse({
            name: 'Test',
            email: invalidEmail,
            subject: 'Test',
            message: 'Test message here',
            locale: 'ru'
          });
          
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues.some(i => i.path.includes('email'))).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

**Components**:
- `ContactForm.tsx`: Form rendering, validation, submission flow
- `PrivacyPolicyContent.tsx`: Content rendering, localization
- `TermsOfServiceContent.tsx`: Content rendering, localization
- `Footer.tsx`: Link rendering, locale handling

**API Routes**:
- `POST /api/contact`: Request handling, validation, rate limiting, email, database

**Services**:
- `emailService.ts`: Resend integration, email formatting
- `contactService.ts`: Database operations
- `rateLimiter.ts`: Rate limiting logic

**Validation**:
- `contactSchema.ts`: Zod schema validation rules

### Integration Tests

**Email Delivery**:
- Mock Resend API for testing
- Verify email content and formatting
- Test error handling for API failures

**Rate Limiting**:
- Mock Upstash Redis for testing
- Verify rate limit enforcement
- Test limit reset after time window

**Database**:
- Use test database or in-memory SQLite
- Verify record creation and updates
- Test transaction handling

### E2E Tests

**User Flows**:
1. Navigate to contact page → fill form → submit → see success message
2. Submit invalid form → see validation errors → correct → submit successfully
3. Submit 4 forms rapidly → see rate limit error on 4th
4. Navigate to privacy policy → verify content in Russian
5. Switch to English → navigate to terms → verify content in English

**Tools**:
- Playwright or Cypress for E2E testing
- Test both locales (ru and en)
- Test responsive design (mobile and desktop)

### Test Data Generators

For property-based tests, create generators for:

```typescript
// Valid contact form data generator
const validContactFormArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  email: fc.emailAddress(),
  subject: fc.string({ minLength: 1, maxLength: 200 }),
  message: fc.string({ minLength: 10, maxLength: 5000 }),
  locale: fc.constantFrom('ru', 'en'),
});

// Invalid email generator
const invalidEmailArb = fc.oneof(
  fc.string().filter(s => !s.includes('@')),
  fc.string().filter(s => !s.includes('.')),
  fc.constant(''),
  fc.constant('@'),
  fc.constant('user@'),
  fc.constant('@domain.com'),
);

// Short message generator (< 10 chars)
const shortMessageArb = fc.string({ maxLength: 9 });
```

### Mocking Strategy

**External Services**:
- Mock Resend API using `jest.mock()` or MSW (Mock Service Worker)
- Mock Upstash Redis using in-memory implementation
- Mock Prisma client for unit tests

**Example Mock**:
```typescript
jest.mock('@/lib/services/emailService', () => ({
  sendContactEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/services/rateLimiter', () => ({
  checkRateLimit: jest.fn().mockResolvedValue({
    allowed: true,
    limit: 3,
    remaining: 2,
    reset: Date.now() + 3600000,
  }),
}));
```

### Test Environment Setup

**Environment Variables**:
```bash
# .env.test
DATABASE_URL="postgresql://test:test@localhost:5432/fatos_test"
RESEND_API_KEY="test_key"
CONTACT_EMAIL="test@example.com"
UPSTASH_REDIS_REST_URL="http://localhost:8079"
UPSTASH_REDIS_REST_TOKEN="test_token"
```

**Test Database**:
- Use separate test database
- Run migrations before tests
- Clean database between test suites
- Use transactions for test isolation

### Performance Testing

**Load Testing**:
- Test contact form under load (100 concurrent submissions)
- Verify rate limiting works correctly under load
- Measure email delivery latency
- Monitor database connection pool

**Tools**:
- k6 or Artillery for load testing
- Monitor response times and error rates

## Security Considerations

### Input Sanitization

**XSS Prevention**:
- All user input is sanitized before rendering
- React automatically escapes JSX content
- Email HTML uses template literals with escaped values
- Database queries use parameterized statements (Prisma)

**SQL Injection Prevention**:
- Prisma ORM prevents SQL injection by design
- No raw SQL queries in contact form flow
- All queries use type-safe Prisma client

### Rate Limiting

**Protection Against**:
- Spam submissions
- DDoS attacks on contact endpoint
- Email bombing

**Implementation**:
- IP-based rate limiting (3 per hour)
- Sliding window algorithm (more accurate)
- Redis-backed (survives server restarts)
- Configurable limits per environment

### Email Security

**SPF/DKIM/DMARC**:
- Configure DNS records for email authentication
- Resend handles DKIM signing automatically
- Set up SPF record for sending domain
- Monitor DMARC reports for abuse

**Content Security**:
- Validate email addresses before sending
- Sanitize message content in email body
- Use reply-to header for user email (not from)
- Rate limit email sending to prevent abuse

### Data Privacy

**GDPR Compliance**:
- Store only necessary contact information
- Include data retention policy in privacy policy
- Provide mechanism for data deletion requests
- Log consent for data processing

**PII Protection**:
- Encrypt sensitive data at rest (database encryption)
- Use HTTPS for all communication
- Limit access to contact submissions (admin only)
- Anonymize IP addresses in logs (optional)

### API Security

**Authentication**:
- Contact endpoint is public (no auth required)
- Admin endpoints for viewing submissions require auth
- Use CSRF protection for form submissions

**Request Validation**:
- Validate content-type header (application/json)
- Limit request body size (prevent large payloads)
- Validate all input fields with Zod
- Reject requests with unexpected fields

## Deployment Considerations

### Environment Variables

Required environment variables for production:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=support@fatos.pro

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx

# Database (existing)
DATABASE_URL=postgresql://...

# Optional
NODE_ENV=production
```

### Database Migration

Run Prisma migration to add ContactSubmission model:

```bash
npx prisma migrate dev --name add_contact_submission
npx prisma generate
```

### DNS Configuration

For email delivery (if using custom domain):

```
# SPF Record
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM Record (provided by Resend)
TXT resend._domainkey "v=DKIM1; k=rsa; p=..."

# DMARC Record
TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@fatos.pro"
```

### Monitoring

**Metrics to Track**:
- Contact form submission rate
- Email delivery success rate
- Rate limit violations per hour
- Average response time for /api/contact
- Database query performance

**Alerting**:
- Alert if email delivery fails > 10% of time
- Alert if rate limit violations spike
- Alert if API response time > 2 seconds
- Alert if database connection pool exhausted

**Tools**:
- Vercel Analytics for frontend metrics
- Upstash Redis analytics for rate limiting
- Resend webhooks for email delivery tracking
- Prisma query logging for database performance

### Rollback Plan

If issues arise after deployment:

1. **Email Service Issues**:
   - Switch to fallback email service (SendGrid)
   - Or disable email, only save to database
   - Display message to users about delayed response

2. **Rate Limiting Issues**:
   - Temporarily disable rate limiting
   - Or increase limits (5 per hour instead of 3)
   - Monitor for abuse

3. **Database Issues**:
   - Rollback migration if schema issues
   - Restore from backup if data corruption
   - Use read replica if performance issues

## Future Enhancements

### Phase 2 Features

1. **Admin Panel for Contact Submissions**:
   - View all submissions in admin dashboard
   - Filter by status, date, email
   - Mark as resolved/spam
   - Reply directly from admin panel

2. **Email Templates**:
   - Use React Email for better email design
   - Create branded email templates
   - Support rich text formatting

3. **Auto-Reply**:
   - Send confirmation email to user
   - Include ticket number for tracking
   - Set expectations for response time

4. **Advanced Rate Limiting**:
   - Different limits for authenticated users
   - Captcha for suspicious activity
   - Honeypot fields for bot detection

5. **Analytics**:
   - Track most common subjects
   - Measure response times
   - User satisfaction surveys

### Scalability Considerations

**Current Design Supports**:
- ~1000 submissions per day
- ~100 concurrent users
- Single region deployment

**For Higher Scale**:
- Add queue for email sending (BullMQ + Redis)
- Use CDN for static legal pages
- Implement database read replicas
- Add caching layer (Redis) for translations
- Consider serverless email service (AWS SES)

## Appendix

### Technology Alternatives Considered

**Email Services**:
- ✅ **Resend**: Chosen for Next.js integration, DX, reliability
- ❌ SendGrid: More complex API, overkill for simple use case
- ❌ Nodemailer: Requires SMTP server, harder to configure
- ❌ AWS SES: More complex setup, better for high volume

**Rate Limiting**:
- ✅ **Upstash Redis**: Chosen for serverless compatibility, edge support
- ❌ Redis (self-hosted): Requires infrastructure management
- ❌ In-memory: Doesn't persist across deployments
- ❌ Database-based: Too slow, adds load to database

**Validation**:
- ✅ **Zod**: Chosen for TypeScript integration, type inference
- ❌ Yup: Less TypeScript support
- ❌ Joi: Node.js focused, not ideal for client-side
- ❌ Custom validation: Reinventing the wheel

### References

- [Next.js 14 App Router Documentation](https://nextjs.org/docs/app)
- [Resend Documentation](https://resend.com/docs)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Zod Documentation](https://zod.dev)
- [fast-check Documentation](https://fast-check.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GDPR Compliance Guide](https://gdpr.eu)

