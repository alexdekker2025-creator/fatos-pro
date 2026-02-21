# Payments API Endpoints - API-эндпоинты для платежей

## Обзор

API-эндпоинты для работы с платежами. Обеспечивают создание платежных сессий и интеграцию с платежными системами (ЮKassa для России, Stripe для международных платежей).

## POST /api/payments/create

Инициация платежа и создание платежной сессии.

### Аутентификация

Требуется валидная сессия пользователя.

### Headers

```
Authorization: Bearer <sessionId>
Content-Type: application/json
```

### Request Body

```typescript
{
  amount: number;        // Сумма в минимальных единицах валюты (копейки, центы)
  currency: string;      // Валюта (ISO 4217): RUB, USD, EUR
  countryCode: string;   // Код страны (ISO 3166-1 alpha-2): RU, US, GB
}
```

### Response

#### Успешный ответ (201 Created)

```typescript
{
  success: true;
  order: {
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING';
    paymentProvider: 'yukassa' | 'stripe';
    createdAt: Date;
  };
  paymentUrl: string;    // URL для перенаправления пользователя
  expiresAt: Date;       // Время истечения платежной сессии
}
```

#### Ошибки

**401 Unauthorized** - Отсутствует или невалидный токен аутентификации

```typescript
{
  success: false;
  error: 'Authorization header is required' | 'Invalid or expired session';
}
```

**400 Bad Request** - Ошибка валидации данных

```typescript
{
  success: false;
  error: 'Validation error';
  details: Array<{
    field: string;
    message: string;
  }>;
}
```

**503 Service Unavailable** - Платежная система недоступна

```typescript
{
  success: false;
  error: 'Payment provider error';
  message: 'Unable to create payment session. Please try again later.';
}
```

**500 Internal Server Error** - Внутренняя ошибка сервера

```typescript
{
  success: false;
  error: 'Internal server error';
}
```

### Примеры использования

#### Создание платежа для российского пользователя

```typescript
const response = await fetch('/api/payments/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionId}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 100000,      // 1000.00 руб (в копейках)
    currency: 'RUB',
    countryCode: 'RU',
  }),
});

const data = await response.json();

if (data.success) {
  // Перенаправить пользователя на страницу оплаты
  window.location.href = data.paymentUrl;
}
```

#### Создание платежа для международного пользователя

```typescript
const response = await fetch('/api/payments/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionId}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 5000,        // 50.00 USD (в центах)
    currency: 'USD',
    countryCode: 'US',
  }),
});

const data = await response.json();

if (data.success) {
  window.location.href = data.paymentUrl;
}
```

## Логика работы

### 1. Аутентификация

Эндпоинт проверяет наличие и валидность токена аутентификации в заголовке `Authorization`.

### 2. Валидация данных

Используется Zod-схема для валидации:
- `amount` - положительное число
- `currency` - строка из 3 символов (ISO 4217)
- `countryCode` - строка из 2 символов (ISO 3166-1 alpha-2)

### 3. Выбор платежного провайдера

На основе `countryCode` определяется регион и выбирается соответствующий провайдер:
- `RU` → ЮKassa
- Остальные → Stripe

### 4. Создание заказа

В базе данных создается запись заказа со статусом `PENDING`.

### 5. Создание платежной сессии

Вызывается метод `createSession` выбранного провайдера для создания платежной сессии.

### 6. Обновление заказа

Заказ обновляется с `externalId` (ID сессии во внешней платежной системе).

### 7. Возврат ответа

Возвращается URL для перенаправления пользователя на страницу оплаты.

## Безопасность

- Все запросы требуют аутентификации
- Валидация всех входных данных
- Использование HTTPS для всех соединений
- Секретные ключи платежных систем хранятся в переменных окружения

## Переменные окружения

```env
# ЮKassa
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key

# Stripe
STRIPE_SECRET_KEY=your_secret_key

# Base URL для return URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Связанные эндпоинты

- `POST /api/webhooks/yukassa` - Обработка вебхуков от ЮKassa (задача 22)
- `POST /api/webhooks/stripe` - Обработка вебхуков от Stripe (задача 22)

## См. также

- [Payment Service Documentation](./payment-service.md) - Документация сервиса платежей
- [Design Document](../.kiro/specs/fatos-pro-platform/design.md) - Архитектура платежной системы
- [Requirements](../.kiro/specs/fatos-pro-platform/requirements.md) - Требования к платежам
