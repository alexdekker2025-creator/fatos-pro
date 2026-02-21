# Руководство по применению мер безопасности

Это руководство поможет применить реализованные меры безопасности к существующим и новым API эндпоинтам.

## Быстрый старт

### 1. Применение CSRF защиты и Rate Limiting

Для большинства API эндпоинтов используйте комбинированный middleware:

```typescript
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

async function yourHandler(request: NextRequest) {
  // Ваша логика обработчика
}

// Применяем middleware
export const POST = withSecurityMiddleware(yourHandler, RATE_LIMIT_CONFIGS.api);
```

### 2. Выбор конфигурации Rate Limiting

Выберите подходящую конфигурацию в зависимости от типа эндпоинта:

```typescript
// Для аутентификации (строгий лимит)
RATE_LIMIT_CONFIGS.auth // 5 запросов за 15 минут

// Для обычных API эндпоинтов
RATE_LIMIT_CONFIGS.api // 100 запросов за 15 минут

// Для публичных эндпоинтов
RATE_LIMIT_CONFIGS.public // 200 запросов за 15 минут

// Для платежей (очень строгий)
RATE_LIMIT_CONFIGS.payment // 10 запросов за 1 час
```

### 3. Санитизация входных данных

Всегда санитизируйте пользовательские вводы перед валидацией:

```typescript
import { sanitizeEmail, sanitizeName, sanitizeContent } from '@/lib/validation/sanitization';

const body = await request.json();

const sanitizedData = {
  email: sanitizeEmail(body.email || ''),
  name: sanitizeName(body.name || ''),
  content: sanitizeContent(body.content || ''),
};

// Затем валидируйте с помощью Zod
const validatedData = YourSchema.parse(sanitizedData);
```

## Примеры миграции

### Пример 1: Простой API эндпоинт

**До:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  // Обработка...
}
```

**После:**
```typescript
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

async function handler(request: NextRequest) {
  const body = await request.json();
  // Обработка...
}

export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
```

### Пример 2: Эндпоинт с валидацией

**До:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedData = MySchema.parse(body);
  // Обработка...
}
```

**После:**
```typescript
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';
import { sanitizeEmail, sanitizeName } from '@/lib/validation/sanitization';

async function handler(request: NextRequest) {
  const body = await request.json();
  
  // Санитизация
  const sanitizedData = {
    email: sanitizeEmail(body.email || ''),
    name: sanitizeName(body.name || ''),
  };
  
  // Валидация
  const validatedData = MySchema.parse(sanitizedData);
  
  // Обработка...
}

export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
```

### Пример 3: Эндпоинт с аутентификацией

**До:**
```typescript
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const sessionId = authHeader?.substring(7);
  const user = await authService.verifySession(sessionId);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Обработка...
}
```

**После:**
```typescript
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

async function handler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Authorization header is required' },
      { status: 401 }
    );
  }
  
  const sessionId = authHeader.substring(7);
  const user = await authService.verifySession(sessionId);
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session' },
      { status: 401 }
    );
  }
  
  // Обработка...
}

export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
```

## Применение к конкретным эндпоинтам

### Аутентификация

```typescript
// app/api/auth/*/route.ts
export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.auth);
```

### Расчеты

```typescript
// app/api/calculations/route.ts
export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
export const GET = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.public);
```

### Платежи

```typescript
// app/api/payments/*/route.ts
export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.payment);
```

### Администрирование

```typescript
// app/api/admin/*/route.ts
export const POST = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
export const PUT = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
export const DELETE = withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
```

### Вебхуки

**Важно:** Вебхуки от платежных систем НЕ должны использовать CSRF защиту, так как они приходят от внешних сервисов. Используйте только rate limiting:

```typescript
// app/api/webhooks/*/route.ts
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

export const POST = withRateLimit(handler, RATE_LIMIT_CONFIGS.api);
```

## Санитизация данных

### Доступные функции

```typescript
import {
  escapeHtml,           // Экранирует HTML символы
  stripHtml,            // Удаляет HTML теги
  sanitizeEmail,        // Очищает email
  sanitizeName,         // Очищает имя
  sanitizeContent,      // Очищает контент от опасных скриптов
  sanitizeUrl,          // Проверяет и очищает URL
  sanitizeNumber,       // Валидирует числа
  containsMaliciousContent, // Проверяет на опасный контент
} from '@/lib/validation/sanitization';
```

### Когда использовать

| Тип данных | Функция | Пример использования |
|------------|---------|---------------------|
| Email | `sanitizeEmail` | Регистрация, вход |
| Имя пользователя | `sanitizeName` | Регистрация, профиль |
| Текстовый контент | `sanitizeContent` | Статьи, комментарии |
| URL | `sanitizeUrl` | Ссылки, редиректы |
| Числа | `sanitizeNumber` | Суммы, даты |
| HTML вывод | `escapeHtml` | Отображение пользовательского контента |

### Пример комплексной санитизации

```typescript
import { sanitizeObject } from '@/lib/validation/sanitization';

const body = await request.json();

const sanitized = sanitizeObject(body, {
  email: 'email',
  name: 'name',
  content: 'content',
  age: 'number',
  website: 'url',
});
```

## Кастомные конфигурации Rate Limiting

Если стандартные конфигурации не подходят, создайте свою:

```typescript
const customConfig = {
  maxRequests: 50,
  windowMs: 10 * 60 * 1000, // 10 минут
  message: 'Custom rate limit message',
};

export const POST = withSecurityMiddleware(handler, customConfig);
```

## Только CSRF защита (без Rate Limiting)

Если нужна только CSRF защита:

```typescript
import { withCsrfProtection } from '@/lib/middleware/csrf';

export const POST = withCsrfProtection(handler);
```

## Только Rate Limiting (без CSRF)

Если нужен только rate limiting (например, для вебхуков):

```typescript
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

export const POST = withRateLimit(handler, RATE_LIMIT_CONFIGS.api);
```

## Проверка безопасности

После применения мер безопасности, проверьте:

1. **CSRF защита работает:**
   ```bash
   curl -X POST https://yourdomain.com/api/your-endpoint \
     -H "Content-Type: application/json" \
     -d '{"data":"test"}'
   # Должен вернуть 403 Forbidden
   ```

2. **Rate limiting работает:**
   ```bash
   for i in {1..10}; do
     curl -X POST https://yourdomain.com/api/your-endpoint \
       -H "Origin: https://yourdomain.com" \
       -H "Content-Type: application/json" \
       -d '{"data":"test"}'
   done
   # После превышения лимита должен вернуть 429
   ```

3. **Санитизация работает:**
   - Попробуйте отправить `<script>alert('xss')</script>` в текстовое поле
   - Убедитесь, что скрипт не выполняется

## Чеклист для новых эндпоинтов

- [ ] Применен `withSecurityMiddleware` или `withCsrfProtection`
- [ ] Выбрана подходящая конфигурация rate limiting
- [ ] Все пользовательские вводы санитизируются
- [ ] Используются Zod схемы для валидации
- [ ] Секретные данные не возвращаются в ответе
- [ ] Ошибки обрабатываются корректно
- [ ] Добавлено логирование подозрительных действий
- [ ] Документация обновлена

## Troubleshooting

### CSRF ошибки в development

Если получаете CSRF ошибки при локальной разработке:

1. Убедитесь, что `NEXT_PUBLIC_APP_URL` в `.env` соответствует вашему локальному URL
2. Проверьте, что запросы отправляются с правильным Origin заголовком
3. В development режиме localhost автоматически разрешен

### Rate limiting слишком строгий

Если rate limiting мешает разработке:

1. Увеличьте `maxRequests` в конфигурации
2. Или временно отключите middleware в development:

```typescript
const handler = async (request: NextRequest) => {
  // Ваш код
};

export const POST = process.env.NODE_ENV === 'development'
  ? handler
  : withSecurityMiddleware(handler, RATE_LIMIT_CONFIGS.api);
```

### Санитизация удаляет нужные данные

Если санитизация слишком агрессивна:

1. Проверьте, используете ли правильную функцию санитизации
2. Для контента, который должен содержать HTML, используйте `sanitizeContent` вместо `stripHtml`
3. Создайте кастомную функцию санитизации если нужно

## Дополнительные ресурсы

- [Документация по безопасности](./security.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
