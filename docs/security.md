# Безопасность платформы FATOS.pro

Документация по реализованным мерам безопасности в соответствии с Требованием 20.

## Обзор

Платформа FATOS.pro реализует многоуровневую систему безопасности для защиты данных пользователей и предотвращения различных типов атак.

## Реализованные меры безопасности

### 1. HTTPS для всех соединений (Требование 20.1)

**Статус:** ✅ Реализовано

**Описание:**
- Все соединения с платформой используют HTTPS протокол
- Настроено принудительное перенаправление с HTTP на HTTPS
- Включен HSTS (HTTP Strict Transport Security) с preload

**Конфигурация:**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"

[[redirects]]
  from = "http://*"
  to = "https://:splat"
  status = 301
  force = true
```

**Проверка:**
- Все запросы автоматически перенаправляются на HTTPS
- Браузер запоминает это требование на 2 года (max-age=63072000)

---

### 2. Хеширование паролей (Требование 20.2)

**Статус:** ✅ Реализовано

**Описание:**
- Пароли хешируются с использованием bcrypt
- Используется salt для каждого пароля
- Пароли никогда не хранятся в открытом виде

**Реализация:**
```typescript
// lib/services/auth/AuthService.ts
async hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

**Требования к паролям:**
- Минимум 8 символов
- Хотя бы одна буква
- Хотя бы одна цифра

---

### 3. Защита от CSRF-атак (Требование 20.3)

**Статус:** ✅ Реализовано

**Описание:**
- Проверка Origin и Referer заголовков для всех небезопасных методов (POST, PUT, DELETE)
- Whitelist разрешенных origins
- Автоматическое отклонение запросов с недоверенных источников

**Использование:**
```typescript
// Применение к API route
import { withCsrfProtection } from '@/lib/middleware/csrf';

export const POST = withCsrfProtection(async (request: NextRequest) => {
  // Ваш код обработчика
});
```

**Конфигурация:**
```env
# .env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

**Защита:**
- Проверяет Origin заголовок
- Если Origin отсутствует, проверяет Referer
- Отклоняет запросы без обоих заголовков
- Логирует все подозрительные попытки

---

### 4. Валидация и санитизация вводов (Требование 20.4)

**Статус:** ✅ Реализовано

**Описание:**
- Все пользовательские вводы валидируются с помощью Zod схем
- Санитизация для предотвращения XSS и injection атак
- Специализированные функции для разных типов данных

**Доступные функции санитизации:**

```typescript
import {
  escapeHtml,
  stripHtml,
  sanitizeEmail,
  sanitizeName,
  sanitizeContent,
  sanitizeUrl,
  sanitizeNumber,
  containsMaliciousContent,
} from '@/lib/validation/sanitization';

// Пример использования
const cleanEmail = sanitizeEmail(userInput.email);
const cleanName = sanitizeName(userInput.name);
const cleanContent = sanitizeContent(userInput.content);
```

**Защита от:**
- XSS (Cross-Site Scripting)
- SQL Injection (в дополнение к защите Prisma)
- HTML Injection
- JavaScript Injection
- Open Redirect атак

**Валидация:**
- Email адреса
- Даты рождения
- Имена пользователей
- Контент статей
- URL адреса
- Числовые значения

---

### 5. Rate Limiting (Требование 20.5)

**Статус:** ✅ Реализовано

**Описание:**
- Ограничение количества запросов от одного IP адреса
- Разные лимиты для разных типов эндпоинтов
- Защита от DDoS и brute-force атак

**Конфигурации:**

```typescript
import { RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

// Строгий лимит для аутентификации
auth: {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 минут
}

// Средний лимит для API
api: {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 минут
}

// Мягкий лимит для публичных эндпоинтов
public: {
  maxRequests: 200,
  windowMs: 15 * 60 * 1000, // 15 минут
}

// Очень строгий лимит для платежей
payment: {
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 час
}
```

**Использование:**

```typescript
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

export const POST = withRateLimit(
  async (request: NextRequest) => {
    // Ваш код обработчика
  },
  RATE_LIMIT_CONFIGS.auth
);
```

**Комбинированная защита (CSRF + Rate Limiting):**

```typescript
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';

export const POST = withSecurityMiddleware(
  async (request: NextRequest) => {
    // Ваш код обработчика
  },
  RATE_LIMIT_CONFIGS.api
);
```

**Особенности:**
- Отслеживание по IP адресу
- Поддержка заголовков от прокси/CDN (x-forwarded-for, x-real-ip)
- Автоматическая очистка устаревших записей
- Информативные заголовки ответа (Retry-After, X-RateLimit-*)

---

### 6. Защита секретных ключей (Требование 20.6)

**Статус:** ✅ Реализовано

**Описание:**
- Все секретные ключи хранятся в переменных окружения
- Ключи недоступны на клиентской стороне
- Разделение публичных и приватных переменных

**Переменные окружения:**

```env
# Секретные ключи (только на сервере)
DATABASE_URL="postgresql://..."
YUKASSA_SECRET_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
SESSION_SECRET="..."

# Публичные переменные (доступны на клиенте)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Правила:**
- Переменные без префикса `NEXT_PUBLIC_` доступны только на сервере
- Секретные ключи никогда не включаются в клиентский bundle
- Используйте `.env.local` для локальной разработки (не коммитится в git)
- Настройте переменные в Netlify Dashboard для production

---

## Дополнительные меры безопасности

### Security Headers

Настроены следующие заголовки безопасности:

```toml
# netlify.toml
[headers.values]
  # HTTPS enforcement
  Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
  
  # Clickjacking protection
  X-Frame-Options = "DENY"
  
  # MIME-type sniffing prevention
  X-Content-Type-Options = "nosniff"
  
  # Referrer policy
  Referrer-Policy = "strict-origin-when-cross-origin"
  
  # Browser permissions
  Permissions-Policy = "geolocation=(), microphone=(), camera=(), payment=()"
  
  # Content Security Policy
  Content-Security-Policy = "default-src 'self'; ..."
  
  # XSS Protection (legacy)
  X-XSS-Protection = "1; mode=block"
```

### Логирование безопасности

Все подозрительные действия логируются:

```typescript
// Примеры логирования
console.warn('CSRF: Untrusted origin', { origin, method, path, timestamp });
console.warn('Rate limit exceeded', { ip, path, count, limit, retryAfter });
console.error('Invalid webhook signature', { payload, signature, timestamp });
```

### Идемпотентность вебхуков

Защита от повторной обработки платежных вебхуков:

```typescript
// Проверка статуса заказа перед обработкой
if (existingOrder.status !== 'PENDING') {
  return NextResponse.json({ success: true, message: 'Order already processed' });
}
```

---

## Рекомендации по развертыванию

### Production Checklist

- [ ] Настроить все переменные окружения в Netlify Dashboard
- [ ] Сгенерировать сильный SESSION_SECRET (минимум 32 символа)
- [ ] Указать правильные ALLOWED_ORIGINS
- [ ] Проверить, что DATABASE_URL использует SSL соединение
- [ ] Настроить мониторинг логов безопасности
- [ ] Включить HSTS preload в браузерах (hstspreload.org)
- [ ] Настроить резервное копирование базы данных
- [ ] Проверить, что все API ключи платежных систем корректны

### Мониторинг

Рекомендуется настроить мониторинг для:
- Частых CSRF ошибок (возможная атака)
- Превышения rate limits (возможная DDoS атака)
- Неудачных попыток аутентификации (brute-force)
- Невалидных подписей вебхуков (попытка подделки)

### Обновления

- Регулярно обновляйте зависимости: `npm audit`
- Следите за уязвимостями в Next.js, Prisma, bcrypt
- Обновляйте Node.js до последней LTS версии

---

## Тестирование безопасности

### Ручное тестирование

1. **HTTPS:**
   ```bash
   curl -I http://yourdomain.com
   # Должен вернуть 301 редирект на https://
   ```

2. **CSRF Protection:**
   ```bash
   curl -X POST https://yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   # Должен вернуть 403 Forbidden
   ```

3. **Rate Limiting:**
   ```bash
   for i in {1..10}; do
     curl -X POST https://yourdomain.com/api/auth/login \
       -H "Origin: https://yourdomain.com" \
       -H "Content-Type: application/json" \
       -d '{"email":"test@test.com","password":"test123"}'
   done
   # После 5 запросов должен вернуть 429 Too Many Requests
   ```

### Автоматизированное тестирование

Рекомендуется использовать:
- OWASP ZAP для сканирования уязвимостей
- Burp Suite для тестирования API
- npm audit для проверки зависимостей

---

## Контакты

При обнаружении уязвимостей безопасности, пожалуйста, свяжитесь с командой разработки.

**Не публикуйте информацию об уязвимостях публично до их исправления.**
