# Сервис аутентификации FATOS.pro

## Обзор

Сервис аутентификации обеспечивает безопасную регистрацию, вход и управление сессиями пользователей. Использует bcrypt для хеширования паролей и сессии в памяти для управления состоянием аутентификации.

## Архитектура

```
┌─────────────────────────────────────────┐
│         AuthService                     │
├─────────────────────────────────────────┤
│ + register(input)                       │
│ + login(input)                          │
│ + logout(sessionId)                     │
│ + verifySession(sessionId)              │
│ + hashPassword(password)                │
│ + verifyPassword(password, hash)        │
│                                         │
│ - createSession(userId)                 │
│ - generateSessionId()                   │
│ - saveSession(session)                  │
│ - getSession(sessionId)                 │
│ - invalidateSession(sessionId)          │
└─────────────────────────────────────────┘
```

## Использование

### Импорт

```typescript
import { authService } from '@/lib/services/auth';
// или
import { AuthService } from '@/lib/services/auth';
const auth = new AuthService();
```

### Регистрация пользователя

```typescript
try {
  const result = await authService.register({
    email: 'user@example.com',
    password: 'securePassword123',
    name: 'John Doe',
  });

  console.log('User registered:', result.user);
  console.log('Session ID:', result.session.id);
  console.log('Session expires:', result.session.expiresAt);
} catch (error) {
  console.error('Registration failed:', error.message);
  // "User with this email already exists"
}
```

**Возвращает:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    preferredLang: string;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}
```

### Вход пользователя

```typescript
try {
  const result = await authService.login({
    email: 'user@example.com',
    password: 'securePassword123',
  });

  console.log('User logged in:', result.user);
  console.log('Session ID:', result.session.id);
  
  // Сохраните session.id в cookie или localStorage
  document.cookie = `sessionId=${result.session.id}; path=/; max-age=2592000`;
} catch (error) {
  console.error('Login failed:', error.message);
  // "Invalid email or password"
}
```

### Верификация сессии

```typescript
// Получите sessionId из cookie или localStorage
const sessionId = getCookie('sessionId');

const user = await authService.verifySession(sessionId);

if (user) {
  console.log('User authenticated:', user);
  // Пользователь аутентифицирован
} else {
  console.log('Session invalid or expired');
  // Перенаправить на страницу входа
}
```

### Выход пользователя

```typescript
const sessionId = getCookie('sessionId');

await authService.logout(sessionId);

// Удалите sessionId из cookie
document.cookie = 'sessionId=; path=/; max-age=0';

console.log('User logged out');
```

## Валидация данных

### Схема регистрации

```typescript
import { UserRegistrationSchema } from '@/lib/validation/schemas';

// Валидация перед регистрацией
const result = UserRegistrationSchema.safeParse({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
});

if (!result.success) {
  console.error('Validation errors:', result.error.errors);
  // [
  //   { path: ['email'], message: 'Некорректный email адрес' },
  //   { path: ['password'], message: 'Пароль должен содержать минимум 8 символов' }
  // ]
}
```

**Правила валидации:**
- Email: валидный email адрес
- Пароль: минимум 8 символов, максимум 100
- Имя: минимум 2 символа, максимум 100

### Схема входа

```typescript
import { UserLoginSchema } from '@/lib/validation/schemas';

const result = UserLoginSchema.safeParse({
  email: 'user@example.com',
  password: 'password123',
});
```

**Правила валидации:**
- Email: валидный email адрес
- Пароль: обязательное поле

## API Endpoints (Будущая реализация)

### POST /api/auth/register

Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "preferredLang": "ru"
  },
  "session": {
    "id": "abc123xyz...",
    "userId": "clx123...",
    "expiresAt": "2024-03-15T10:30:00Z"
  }
}
```

**Response (400):**
```json
{
  "error": "User with this email already exists"
}
```

### POST /api/auth/login

Вход пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "preferredLang": "ru"
  },
  "session": {
    "id": "abc123xyz...",
    "userId": "clx123...",
    "expiresAt": "2024-03-15T10:30:00Z"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

### POST /api/auth/logout

Выход пользователя.

**Request:**
```json
{
  "sessionId": "abc123xyz..."
}
```

**Response (200):**
```json
{
  "success": true
}
```

### GET /api/auth/me

Получение текущего пользователя.

**Headers:**
```
Cookie: sessionId=abc123xyz...
```

**Response (200):**
```json
{
  "id": "clx123...",
  "email": "user@example.com",
  "name": "John Doe",
  "preferredLang": "ru"
}
```

**Response (401):**
```json
{
  "error": "Unauthorized"
}
```

## Безопасность

### Хеширование паролей

Пароли хешируются с использованием bcrypt с 10 раундами соли:

```typescript
const hash = await authService.hashPassword('password123');
// $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

const isValid = await authService.verifyPassword('password123', hash);
// true
```

**Преимущества bcrypt:**
- Медленный алгоритм (защита от brute-force)
- Автоматическая генерация соли
- Адаптивная сложность (можно увеличить раунды)

### Управление сессиями

**Текущая реализация (Development):**
- Сессии хранятся в памяти (Map)
- Срок действия: 30 дней
- ID сессии: случайная строка (36+ символов)

**Production рекомендации:**
- Использовать Redis для хранения сессий
- Использовать httpOnly cookies
- Использовать secure cookies (HTTPS only)
- Реализовать CSRF защиту
- Добавить rate limiting

### Пример с Redis (Production)

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

class AuthService {
  private async saveSession(session: Session): Promise<void> {
    const ttl = Math.floor(
      (session.expiresAt.getTime() - Date.now()) / 1000
    );
    await redis.setex(
      `session:${session.id}`,
      ttl,
      JSON.stringify(session)
    );
  }

  private async getSession(sessionId: string): Promise<Session | null> {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  private async invalidateSession(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`);
  }
}
```

## Middleware для защиты роутов

```typescript
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth';

export async function authMiddleware(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await authService.verifySession(sessionId);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Добавляем пользователя в request
  (request as any).user = user;

  return NextResponse.next();
}
```

**Использование:**

```typescript
// app/api/protected/route.ts
import { authMiddleware } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  const authResponse = await authMiddleware(request);
  if (authResponse.status === 401) {
    return authResponse;
  }

  const user = (request as any).user;
  
  return NextResponse.json({
    message: 'Protected data',
    user,
  });
}
```

## Тестирование

Все методы AuthService покрыты unit-тестами:

```bash
npm test -- __tests__/lib/services/auth/AuthService.test.ts
```

**Покрытие:**
- ✅ hashPassword - хеширование паролей
- ✅ verifyPassword - проверка паролей
- ✅ register - регистрация пользователей
- ✅ login - вход пользователей
- ✅ verifySession - верификация сессий
- ✅ logout - выход пользователей

**Результаты:**
```
Test Suites: 1 passed
Tests:       13 passed
```

## Лучшие практики

1. **Всегда валидируйте ввод** перед вызовом AuthService
2. **Используйте HTTPS** в production
3. **Храните sessionId в httpOnly cookies** (не в localStorage)
4. **Реализуйте rate limiting** для предотвращения brute-force
5. **Логируйте попытки входа** для мониторинга безопасности
6. **Используйте 2FA** для критических операций
7. **Регулярно обновляйте bcrypt** до последней версии
8. **Не возвращайте passwordHash** клиенту никогда

## Миграция на production

### Шаг 1: Настройка Redis

```bash
# Установка Redis
npm install ioredis

# .env
REDIS_URL="redis://localhost:6379"
```

### Шаг 2: Обновление AuthService

Замените методы `saveSession`, `getSession`, `invalidateSession` на версии с Redis (см. выше).

### Шаг 3: Настройка cookies

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const result = await authService.login(input);
  
  const response = NextResponse.json({ user: result.user });
  
  response.cookies.set('sessionId', result.session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
  
  return response;
}
```

### Шаг 4: CSRF защита

```bash
npm install csrf
```

```typescript
import { createCsrfProtect } from 'csrf';

const csrfProtect = createCsrfProtect({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});
```

## Troubleshooting

### "User with this email already exists"

**Проблема:** Попытка регистрации с существующим email.

**Решение:** Проверьте, что email уникален, или используйте функцию входа.

### "Invalid email or password"

**Проблема:** Неверные учётные данные при входе.

**Решение:** Проверьте правильность email и пароля.

### "Session invalid or expired"

**Проблема:** Сессия истекла или не существует.

**Решение:** Попросите пользователя войти заново.

## Дополнительные ресурсы

- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
