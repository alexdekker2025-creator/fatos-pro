# Технический дизайн: FATOS.pro

## Обзор

FATOS.pro представляет собой современную веб-платформу для нумерологических расчетов, построенную на архитектуре Next.js 14 с использованием App Router. Платформа предоставляет три основных типа нумерологических расчетов: Квадрат Пифагора, Число Судьбы и Матрицу Судьбы.

Ключевые характеристики системы:
- Многоязычная поддержка (русский/английский) через next-intl
- Гибридная архитектура с клиентскими вычислениями и серверными API
- Интеграция с двумя платежными системами (ЮKassa для РФ, Stripe для международных платежей)
- Административная панель для управления контентом
- Адаптивный дизайн для всех типов устройств
- Деплой на Netlify с использованием серверных функций

Система спроектирована с учетом производительности (результаты расчетов < 500ms), безопасности (HTTPS, хеширование паролей, защита от CSRF) и масштабируемости.

## Архитектура

### Общая архитектура

Платформа использует трехуровневую архитектуру:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Next.js    │  │  React UI    │  │  TailwindCSS │  │
│  │  App Router  │  │  Components  │  │    Styles    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Calculation  │  │   Payment    │  │     i18n     │  │
│  │    Logic     │  │  Processing  │  │   (next-intl)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │     Auth     │  │    Admin     │                    │
│  │   Service    │  │   Service    │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Prisma    │  │  PostgreSQL  │  │    Cache     │  │
│  │     ORM      │  │   Database   │  │   (Memory)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   ЮKassa     │  │    Stripe    │                    │
│  │   Payment    │  │   Payment    │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Паттерны проектирования

1. **Repository Pattern**: Абстракция доступа к данным через Prisma
2. **Service Layer**: Бизнес-логика изолирована в сервисных модулях
3. **Strategy Pattern**: Выбор платежной системы на основе региона пользователя
4. **Factory Pattern**: Создание нумерологических калькуляторов
5. **Observer Pattern**: Обработка вебхуков от платежных систем

### Разделение ответственности

- **Client-side**: Нумерологические вычисления, UI взаимодействие, валидация форм
- **Server-side**: Аутентификация, работа с БД, обработка платежей, административные операции
- **Edge Functions (Netlify)**: API endpoints, вебхуки, серверные действия

## Компоненты и интерфейсы

### 1. Calculation Engine (Клиентская сторона)

Модуль для выполнения нумерологических расчетов.

```typescript
// types/numerology.ts
export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

export interface WorkingNumbers {
  first: number;
  second: number;
  third: number;
  fourth: number;
}

export interface PythagoreanSquare {
  cells: number[][]; // 3x3 grid
  digitCounts: Map<number, number>; // 1-9 -> count
}

export interface DestinyNumber {
  value: number; // 1-9, 11, 22, 33
  description: string;
}

export interface DestinyMatrix {
  positions: Map<string, number>;
  descriptions: Map<string, string>;
}

// lib/calculators/pythagorean.ts
export class PythagoreanCalculator {
  calculateWorkingNumbers(date: BirthDate): WorkingNumbers;
  buildSquare(date: BirthDate, working: WorkingNumbers): PythagoreanSquare;
}

// lib/calculators/destiny.ts
export class DestinyCalculator {
  calculateDestinyNumber(date: BirthDate): DestinyNumber;
  calculateDestinyMatrix(date: BirthDate): DestinyMatrix;
}
```

### 2. UI Components

Переиспользуемые компоненты интерфейса.

```typescript
// components/ui/Button.tsx
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// components/ui/Input.tsx
export interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

// components/ui/Card.tsx
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// components/ui/Modal.tsx
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

### 3. Calculator Component

Главный компонент для ввода даты и отображения результатов.

```typescript
// components/Calculator.tsx
export interface CalculatorProps {
  locale: string;
}

export interface CalculatorState {
  birthDate: BirthDate | null;
  results: {
    workingNumbers?: WorkingNumbers;
    square?: PythagoreanSquare;
    destinyNumber?: DestinyNumber;
    matrix?: DestinyMatrix;
  };
  errors: string[];
}

export class Calculator extends React.Component<CalculatorProps, CalculatorState> {
  validateDate(date: BirthDate): boolean;
  handleCalculate(): void;
  handleSave(): void;
}
```

### 4. Payment Service

Сервис для обработки платежей.

```typescript
// lib/services/payment.ts
export interface PaymentProvider {
  createSession(amount: number, currency: string, userId: string): Promise<PaymentSession>;
  verifyWebhook(payload: any, signature: string): boolean;
  processWebhook(payload: any): Promise<PaymentResult>;
}

export interface PaymentSession {
  id: string;
  url: string;
  expiresAt: Date;
}

export interface PaymentResult {
  orderId: string;
  status: 'completed' | 'failed';
  amount: number;
  currency: string;
}

// lib/services/payment/yukassa.ts
export class YuKassaProvider implements PaymentProvider {
  // Implementation
}

// lib/services/payment/stripe.ts
export class StripeProvider implements PaymentProvider {
  // Implementation
}

// lib/services/payment/factory.ts
export class PaymentFactory {
  static getProvider(region: string): PaymentProvider {
    return region === 'RU' ? new YuKassaProvider() : new StripeProvider();
  }
}
```

### 5. API Routes

Серверные эндпоинты для работы с данными.

```typescript
// app/api/calculations/route.ts
export async function POST(request: Request): Promise<Response>;
export async function GET(request: Request): Promise<Response>;

// app/api/payments/create/route.ts
export async function POST(request: Request): Promise<Response>;

// app/api/webhooks/yukassa/route.ts
export async function POST(request: Request): Promise<Response>;

// app/api/webhooks/stripe/route.ts
export async function POST(request: Request): Promise<Response>;

// app/api/admin/articles/route.ts
export async function GET(request: Request): Promise<Response>;
export async function POST(request: Request): Promise<Response>;
export async function PUT(request: Request): Promise<Response>;
export async function DELETE(request: Request): Promise<Response>;
```

### 6. Authentication Service

Сервис аутентификации и авторизации.

```typescript
// lib/services/auth.ts
export interface AuthService {
  register(email: string, password: string, name: string): Promise<User>;
  login(email: string, password: string): Promise<Session>;
  logout(sessionId: string): Promise<void>;
  verifySession(sessionId: string): Promise<User | null>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}
```

### 7. Admin Service

Сервис для административных операций.

```typescript
// lib/services/admin.ts
export interface AdminService {
  createArticle(data: ArticleInput): Promise<Article>;
  updateArticle(id: string, data: ArticleInput): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  getStatistics(): Promise<PlatformStatistics>;
  logAction(adminId: string, action: string, details: any): Promise<void>;
}

export interface ArticleInput {
  title: string;
  content: string;
  category: string;
  language: string;
}

export interface PlatformStatistics {
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  revenue: number;
}
```

## Модели данных

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String        @id @default(cuid())
  email           String        @unique
  name            String
  passwordHash    String
  preferredLang   String        @default("ru")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  calculations    Calculation[]
  orders          Order[]
  adminLogs       AdminLog[]
  
  @@index([email])
}

model Calculation {
  id              String        @id @default(cuid())
  userId          String?
  birthDay        Int
  birthMonth      Int
  birthYear       Int
  workingNumbers  Json          // WorkingNumbers
  square          Json          // PythagoreanSquare
  destinyNumber   Json          // DestinyNumber
  matrix          Json?         // DestinyMatrix (optional)
  createdAt       DateTime      @default(now())
  
  user            User?         @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([createdAt])
}

model Order {
  id              String        @id @default(cuid())
  userId          String
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @db.VarChar(3)
  status          OrderStatus   @default(PENDING)
  paymentProvider String        // 'yukassa' | 'stripe'
  externalId      String?       // ID from payment provider
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  user            User          @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@index([externalId])
}

enum OrderStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model Article {
  id              String        @id @default(cuid())
  title           String
  content         String        @db.Text
  category        String        // 'destiny_number' | 'matrix_position' | 'square_cell'
  language        String        @db.VarChar(2)
  relatedValue    String?       // e.g., "1", "11", "position_1"
  publishedAt     DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([category, language])
  @@index([relatedValue])
}

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

### Валидация данных

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const BirthDateSchema = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
}).refine((data) => {
  // Validate actual date exists
  const date = new Date(data.year, data.month - 1, data.day);
  return date.getDate() === data.day && 
         date.getMonth() === data.month - 1 && 
         date.getFullYear() === data.year;
}, {
  message: "Invalid date",
});

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
});

export const ArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(['destiny_number', 'matrix_position', 'square_cell']),
  language: z.enum(['ru', 'en']),
  relatedValue: z.string().optional(),
});
```



## Свойства корректности

*Свойство - это характеристика или поведение, которое должно быть истинным для всех допустимых выполнений системы - по сути, формальное утверждение о том, что система должна делать. Свойства служат мостом между человекочитаемыми спецификациями и машинно-проверяемыми гарантиями корректности.*

### Свойство 1: Переключение языка обновляет интерфейс

*Для любого* выбранного языка (русский или английский), после переключения языка все текстовые элементы интерфейса должны отображаться на выбранном языке.

**Валидирует: Требование 2.2**

### Свойство 2: Персистентность выбора языка

*Для любого* пользователя, выбравшего язык, после завершения сессии и повторного входа язык интерфейса должен оставаться тем же, что был выбран ранее.

**Валидирует: Требование 2.3**

### Свойство 3: Отклонение некорректных дат

*Для любой* некорректной даты (например, 31 февраля, 32 января), калькулятор должен отклонить ввод и отобразить сообщение об ошибке.

**Валидирует: Требование 3.2**

### Свойство 4: Инициация расчетов для корректных дат

*Для любой* корректной даты рождения в диапазоне от 1900 года до текущего года, калькулятор должен успешно инициировать все нумерологические расчеты.

**Валидирует: Требования 3.4, 3.5**

### Свойство 5: Идемпотентность вычисления рабочих чисел

*Для любой* корректной даты рождения, повторное вычисление рабочих чисел должно возвращать идентичные значения (первое, второе, третье и четвертое рабочие числа).

**Валидирует: Требования 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

### Свойство 6: Корректность построения квадрата Пифагора

*Для любой* даты рождения и вычисленных рабочих чисел, квадрат Пифагора должен содержать корректное количество каждой цифры от 1 до 9, подсчитанное из всех цифр даты и рабочих чисел.

**Валидирует: Требования 5.2, 5.3**

### Свойство 7: Идемпотентность вычисления числа судьбы

*Для любой* корректной даты рождения, повторное вычисление числа судьбы должно возвращать идентичное значение (от 1 до 9 или мастер-число 11, 22, 33).

**Валидирует: Требования 6.1, 6.2, 6.4**

### Свойство 8: Наличие описания для числа судьбы

*Для любого* вычисленного числа судьбы, система должна предоставить соответствующее текстовое описание на выбранном языке.

**Валидирует: Требование 6.3**

### Свойство 9: Вычисление матрицы судьбы

*Для любой* корректной даты рождения, система должна вычислить все ключевые позиции матрицы судьбы с соответствующими числовыми значениями.

**Валидирует: Требования 7.1, 7.2**

### Свойство 10: Наличие описаний для позиций матрицы

*Для любой* позиции в вычисленной матрице судьбы, система должна предоставить краткое описание на выбранном языке.

**Валидирует: Требование 7.4**

### Свойство 11: Создание пользователя при регистрации

*Для любых* корректных регистрационных данных (email, пароль, имя), система должна создать новую запись User в базе данных с хешированным паролем.

**Валидирует: Требования 9.2, 9.3, 20.2**

### Свойство 12: Уникальность email пользователей

*Для любой* попытки регистрации с уже существующим email, система должна отклонить регистрацию и вернуть ошибку о дублировании.

**Валидирует: Требование 9.4**

### Свойство 13: Сохранение расчетов зарегистрированных пользователей

*Для любого* зарегистрированного пользователя, выполнившего расчет, система должна сохранить результаты в базе данных со связью с userId.

**Валидирует: Требования 10.2, 10.3**

### Свойство 14: Создание заказа при инициации оплаты

*Для любого* пользователя, инициирующего оплату, система должна создать запись Order в базе данных со статусом PENDING.

**Валидирует: Требование 11.2**

### Свойство 15: Обновление статуса заказа при успешном платеже

*Для любого* подтвержденного платежа (через вебхук), система должна обновить соответствующий заказ на статус COMPLETED.

**Валидирует: Требования 11.3, 16.3**

### Свойство 16: Обновление статуса заказа при неудачном платеже

*Для любого* отклоненного платежа (через вебхук), система должна обновить соответствующий заказ на статус FAILED.

**Валидирует: Требования 11.4, 16.4**

### Свойство 17: Связывание статей с нумерологическими значениями

*Для любой* статьи с указанным relatedValue, система должна отображать эту статью при просмотре результатов расчетов, содержащих соответствующее значение.

**Валидирует: Требования 12.3, 12.4**

### Свойство 18: Логирование действий администратора

*Для любого* действия администратора (создание, редактирование, удаление статьи), система должна создать запись в AdminLog с деталями операции.

**Валидирует: Требование 13.5**

### Свойство 19: Создание платежной сессии

*Для любого* пользователя, инициирующего оплату, система должна создать платежную сессию в соответствующей платежной системе (ЮKassa для РФ, Stripe для остальных) и вернуть URL для перенаправления.

**Валидирует: Требования 14.2, 14.3, 15.2, 15.3**

### Свойство 20: Верификация подписи вебхуков ЮKassa

*Для любого* вебхука от ЮKassa, система должна верифицировать его подпись перед обработкой, и отклонить запрос если верификация не прошла.

**Валидирует: Требования 14.5, 16.1, 16.2**

### Свойство 21: Верификация подписи вебхуков Stripe

*Для любого* вебхука от Stripe, система должна верифицировать его подпись перед обработкой, и отклонить запрос если верификация не прошла.

**Валидирует: Требования 15.5, 16.1, 16.2**

### Свойство 22: Ответ 200 OK на успешно обработанные вебхуки

*Для любого* вебхука, успешно прошедшего верификацию и обработку, система должна вернуть HTTP статус 200 OK платежной системе.

**Валидирует: Требование 16.5**

### Свойство 23: Идемпотентность обработки вебхуков

*Для любого* вебхука, отправленного повторно с тем же идентификатором платежа, система должна обработать его идемпотентно, не создавая дублирующих изменений в базе данных.

**Валидирует: Требование 16.6**

### Свойство 24: Кеширование результатов расчетов

*Для любой* даты рождения, для которой уже выполнялся расчет, повторный запрос с той же датой должен возвращать результаты из кеша без повторного вычисления.

**Валидирует: Требование 19.2**

### Свойство 25: Валидация пользовательских вводов

*Для любого* пользовательского ввода (дата, email, текстовые поля), система должна валидировать и санитизировать данные перед обработкой, отклоняя потенциально опасные значения.

**Валидирует: Требование 20.4**

## Обработка ошибок

### Стратегия обработки ошибок

Платформа использует многоуровневую стратегию обработки ошибок:

1. **Валидация на клиенте**: Немедленная обратная связь для пользователя
2. **Валидация на сервере**: Защита от обхода клиентской валидации
3. **Обработка исключений**: Graceful degradation при системных ошибках
4. **Логирование**: Централизованное логирование для мониторинга и отладки

### Типы ошибок

```typescript
// lib/errors/types.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class PaymentError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
```

### Обработка ошибок в API

```typescript
// lib/middleware/errorHandler.ts
export function errorHandler(error: Error): Response {
  // Log error
  console.error('[Error]', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  // Return appropriate response
  if (error instanceof ValidationError) {
    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        field: error.field,
        code: error.code,
      }),
      { status: 400 }
    );
  }

  if (error instanceof AuthenticationError) {
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401 }
    );
  }

  if (error instanceof PaymentError) {
    return new Response(
      JSON.stringify({
        error: 'Payment processing failed',
        provider: error.provider,
      }),
      { status: 402 }
    );
  }

  if (error instanceof DatabaseError) {
    return new Response(
      JSON.stringify({ error: 'Database operation failed' }),
      { status: 500 }
    );
  }

  // Generic error
  return new Response(
    JSON.stringify({ error: 'Internal server error' }),
    { status: 500 }
  );
}
```

### Обработка ошибок платежных систем

```typescript
// lib/services/payment/errorHandling.ts
export function handlePaymentWebhookError(
  error: Error,
  provider: string
): void {
  // Log detailed error for monitoring
  console.error('[Payment Webhook Error]', {
    provider,
    error: error.message,
    timestamp: new Date().toISOString(),
  });

  // Send alert if critical
  if (error instanceof SignatureVerificationError) {
    sendSecurityAlert({
      type: 'webhook_signature_failed',
      provider,
      timestamp: new Date(),
    });
  }
}
```

### Retry механизм для внешних сервисов

```typescript
// lib/utils/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

## Стратегия тестирования

### Общий подход

Платформа использует двойной подход к тестированию:

1. **Unit-тесты**: Проверка конкретных примеров, граничных случаев и условий ошибок
2. **Property-based тесты**: Проверка универсальных свойств на множестве сгенерированных входных данных

Оба типа тестов дополняют друг друга: unit-тесты выявляют конкретные баги, property-based тесты проверяют общую корректность.

### Библиотеки для тестирования

- **Jest**: Основной фреймворк для unit-тестирования
- **fast-check**: Библиотека для property-based тестирования в TypeScript
- **React Testing Library**: Тестирование React компонентов
- **Prisma Test Environment**: Изолированная БД для тестов

### Конфигурация property-based тестов

Каждый property-based тест должен:
- Выполняться минимум 100 итераций (настройка fast-check)
- Иметь комментарий с ссылкой на свойство из дизайна
- Использовать формат тега: `Feature: fatos-pro-platform, Property {N}: {текст свойства}`

### Примеры тестов

#### Unit-тест для валидации даты

```typescript
// __tests__/lib/validation/date.test.ts
import { validateBirthDate } from '@/lib/validation/date';

describe('Birth Date Validation', () => {
  it('should accept valid date', () => {
    const result = validateBirthDate({ day: 15, month: 6, year: 1990 });
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid date (31 Feb)', () => {
    const result = validateBirthDate({ day: 31, month: 2, year: 2000 });
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject future date', () => {
    const futureYear = new Date().getFullYear() + 1;
    const result = validateBirthDate({ day: 1, month: 1, year: futureYear });
    expect(result.isValid).toBe(false);
  });

  it('should reject date before 1900', () => {
    const result = validateBirthDate({ day: 1, month: 1, year: 1899 });
    expect(result.isValid).toBe(false);
  });
});
```

#### Property-based тест для рабочих чисел

```typescript
// __tests__/lib/calculators/pythagorean.property.test.ts
import fc from 'fast-check';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { BirthDate } from '@/types/numerology';

// Feature: fatos-pro-platform, Property 5: Идемпотентность вычисления рабочих чисел
describe('Pythagorean Calculator Properties', () => {
  const calculator = new PythagoreanCalculator();

  it('should calculate identical working numbers for repeated calls', () => {
    fc.assert(
      fc.property(
        fc.record({
          day: fc.integer({ min: 1, max: 28 }), // Safe range for all months
          month: fc.integer({ min: 1, max: 12 }),
          year: fc.integer({ min: 1900, max: new Date().getFullYear() }),
        }),
        (date: BirthDate) => {
          const result1 = calculator.calculateWorkingNumbers(date);
          const result2 = calculator.calculateWorkingNumbers(date);
          
          expect(result1).toEqual(result2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property-based тест для квадрата Пифагора

```typescript
// __tests__/lib/calculators/pythagorean.square.property.test.ts
import fc from 'fast-check';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';

// Feature: fatos-pro-platform, Property 6: Корректность построения квадрата Пифагора
describe('Pythagorean Square Properties', () => {
  const calculator = new PythagoreanCalculator();

  it('should correctly count digit occurrences in square', () => {
    fc.assert(
      fc.property(
        fc.record({
          day: fc.integer({ min: 1, max: 28 }),
          month: fc.integer({ min: 1, max: 12 }),
          year: fc.integer({ min: 1900, max: new Date().getFullYear() }),
        }),
        (date) => {
          const working = calculator.calculateWorkingNumbers(date);
          const square = calculator.buildSquare(date, working);
          
          // Manually count digits from date and working numbers
          const allDigits = [
            ...String(date.day).split(''),
            ...String(date.month).split(''),
            ...String(date.year).split(''),
            ...String(working.first).split(''),
            ...String(working.second).split(''),
            ...String(working.third).split(''),
            ...String(working.fourth).split(''),
          ].map(Number);
          
          // Verify counts match
          for (let digit = 1; digit <= 9; digit++) {
            const expectedCount = allDigits.filter(d => d === digit).length;
            const actualCount = square.digitCounts.get(digit) || 0;
            expect(actualCount).toBe(expectedCount);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property-based тест для числа судьбы

```typescript
// __tests__/lib/calculators/destiny.property.test.ts
import fc from 'fast-check';
import { DestinyCalculator } from '@/lib/calculators/destiny';

// Feature: fatos-pro-platform, Property 7: Идемпотентность вычисления числа судьбы
describe('Destiny Number Properties', () => {
  const calculator = new DestinyCalculator();

  it('should calculate identical destiny number for repeated calls', () => {
    fc.assert(
      fc.property(
        fc.record({
          day: fc.integer({ min: 1, max: 28 }),
          month: fc.integer({ min: 1, max: 12 }),
          year: fc.integer({ min: 1900, max: new Date().getFullYear() }),
        }),
        (date) => {
          const result1 = calculator.calculateDestinyNumber(date);
          const result2 = calculator.calculateDestinyNumber(date);
          
          expect(result1.value).toBe(result2.value);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return valid destiny number (1-9, 11, 22, 33)', () => {
    fc.assert(
      fc.property(
        fc.record({
          day: fc.integer({ min: 1, max: 28 }),
          month: fc.integer({ min: 1, max: 12 }),
          year: fc.integer({ min: 1900, max: new Date().getFullYear() }),
        }),
        (date) => {
          const result = calculator.calculateDestinyNumber(date);
          const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
          
          expect(validNumbers).toContain(result.value);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property-based тест для вебхуков

```typescript
// __tests__/lib/services/payment/webhook.property.test.ts
import fc from 'fast-check';
import { processWebhook } from '@/lib/services/payment/webhook';
import { prisma } from '@/lib/prisma';

// Feature: fatos-pro-platform, Property 23: Идемпотентность обработки вебхуков
describe('Webhook Processing Properties', () => {
  it('should process webhook idempotently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          orderId: fc.uuid(),
          amount: fc.integer({ min: 100, max: 100000 }),
          status: fc.constantFrom('completed', 'failed'),
        }),
        async (webhookData) => {
          // Create order
          await prisma.order.create({
            data: {
              id: webhookData.orderId,
              userId: 'test-user',
              amount: webhookData.amount,
              currency: 'RUB',
              status: 'PENDING',
              paymentProvider: 'yukassa',
            },
          });

          // Process webhook twice
          await processWebhook(webhookData);
          await processWebhook(webhookData);

          // Check order was updated only once
          const order = await prisma.order.findUnique({
            where: { id: webhookData.orderId },
          });

          expect(order?.status).toBe(
            webhookData.status === 'completed' ? 'COMPLETED' : 'FAILED'
          );

          // Cleanup
          await prisma.order.delete({ where: { id: webhookData.orderId } });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Unit-тест для UI компонентов

```typescript
// __tests__/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button variant="primary" onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button variant="primary" disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Покрытие тестами

Целевые показатели покрытия:
- **Calculation Engine**: 100% (критическая бизнес-логика)
- **Payment Service**: 95% (высокая критичность)
- **API Routes**: 90%
- **UI Components**: 80%
- **Общее покрытие**: 85%

### Интеграционные тесты

```typescript
// __tests__/integration/calculation-flow.test.ts
describe('Complete Calculation Flow', () => {
  it('should perform full calculation and save results', async () => {
    // 1. User inputs date
    const date = { day: 15, month: 6, year: 1990 };
    
    // 2. Calculate all values
    const pythagorean = new PythagoreanCalculator();
    const destiny = new DestinyCalculator();
    
    const working = pythagorean.calculateWorkingNumbers(date);
    const square = pythagorean.buildSquare(date, working);
    const destinyNumber = destiny.calculateDestinyNumber(date);
    const matrix = destiny.calculateDestinyMatrix(date);
    
    // 3. Save to database
    const calculation = await prisma.calculation.create({
      data: {
        userId: 'test-user',
        birthDay: date.day,
        birthMonth: date.month,
        birthYear: date.year,
        workingNumbers: working,
        square: square,
        destinyNumber: destinyNumber,
        matrix: matrix,
      },
    });
    
    // 4. Verify saved data
    expect(calculation.id).toBeDefined();
    expect(calculation.birthDay).toBe(date.day);
    
    // Cleanup
    await prisma.calculation.delete({ where: { id: calculation.id } });
  });
});
```

### CI/CD интеграция

Тесты должны выполняться автоматически:
- При каждом push в feature branch
- При создании pull request
- Перед деплоем на production

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:property
      - run: npm run test:integration
      - run: npm run test:coverage
```

