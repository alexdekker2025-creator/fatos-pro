# Payment Service - Сервис платежей

## Обзор

Payment Service предоставляет абстракцию для работы с различными платежными системами. Реализует паттерн Strategy для поддержки нескольких провайдеров платежей (ЮKassa для России, Stripe для международных платежей).

## Архитектура

### Паттерны проектирования

1. **Strategy Pattern**: `PaymentProvider` интерфейс позволяет легко добавлять новые платежные системы
2. **Factory Pattern**: `PaymentFactory` выбирает подходящего провайдера на основе региона пользователя

### Структура файлов

```
lib/services/payment/
├── types.ts              # Типы и интерфейсы
├── PaymentFactory.ts     # Фабрика провайдеров
├── YuKassaProvider.ts    # Реализация для ЮKassa (задача 19)
├── StripeProvider.ts     # Реализация для Stripe (задача 20)
└── index.ts              # Экспорт модуля
```

## Типы данных

### PaymentSession

Платежная сессия, создаваемая при инициации платежа.

```typescript
interface PaymentSession {
  id: string;        // Уникальный идентификатор сессии
  url: string;       // URL для перенаправления пользователя
  expiresAt: Date;   // Время истечения сессии
}
```

### PaymentResult

Результат обработки платежа из вебхука.

```typescript
interface PaymentResult {
  orderId: string;      // ID заказа в нашей системе
  status: 'completed' | 'failed';  // Статус платежа
  amount: number;       // Сумма платежа
  currency: string;     // Валюта (ISO 4217)
  externalId?: string;  // ID транзакции во внешней системе
}
```

### PaymentProvider

Интерфейс провайдера платежной системы.

```typescript
interface PaymentProvider {
  createSession(
    amount: number,
    currency: string,
    userId: string,
    orderId: string
  ): Promise<PaymentSession>;

  verifyWebhook(payload: any, signature: string): boolean;

  processWebhook(payload: any): Promise<PaymentResult>;
}
```

## PaymentFactory

Фабрика для создания экземпляров платежных провайдеров.

### Методы

#### `getProvider(region: UserRegion): PaymentProvider`

Возвращает экземпляр провайдера на основе региона пользователя.

```typescript
const provider = PaymentFactory.getProvider('RU');
// Вернет YuKassaProvider

const provider = PaymentFactory.getProvider('OTHER');
// Вернет StripeProvider
```

#### `getProviderType(region: UserRegion): PaymentProviderType`

Определяет тип провайдера на основе региона.

```typescript
const type = PaymentFactory.getProviderType('RU');
// Вернет 'yukassa'

const type = PaymentFactory.getProviderType('OTHER');
// Вернет 'stripe'
```

#### `getRegionFromCountryCode(countryCode: string): UserRegion`

Определяет регион на основе кода страны (ISO 3166-1 alpha-2).

```typescript
const region = PaymentFactory.getRegionFromCountryCode('RU');
// Вернет 'RU'

const region = PaymentFactory.getRegionFromCountryCode('US');
// Вернет 'OTHER'

const region = PaymentFactory.getRegionFromCountryCode('GB');
// Вернет 'OTHER'
```

## Использование

### Базовый пример

```typescript
import { PaymentFactory } from '@/lib/services/payment';

// Определить регион пользователя
const userCountry = 'RU'; // Получено из профиля или IP
const region = PaymentFactory.getRegionFromCountryCode(userCountry);

// Получить провайдера
const provider = PaymentFactory.getProvider(region);

// Создать платежную сессию
const session = await provider.createSession(
  1000,      // 1000 рублей или центов
  'RUB',     // Валюта
  'user123', // ID пользователя
  'order456' // ID заказа
);

// Перенаправить пользователя на страницу оплаты
window.location.href = session.url;
```

### Обработка вебхука

```typescript
import { PaymentFactory } from '@/lib/services/payment';

// В API route для вебхука
export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get('X-Signature');
  
  // Определить провайдера (из payload или URL)
  const provider = PaymentFactory.getProvider('RU'); // или 'OTHER'
  
  // Верифицировать подпись
  if (!provider.verifyWebhook(payload, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Обработать вебхук
  const result = await provider.processWebhook(payload);
  
  // Обновить заказ в БД
  await updateOrder(result.orderId, result.status);
  
  return new Response('OK', { status: 200 });
}
```

## YuKassaProvider

Провайдер для работы с платежной системой ЮKassa (Яндекс.Касса).

### Конфигурация

Провайдер требует следующие переменные окружения:

```env
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Методы

#### `createSession(amount, currency, userId, orderId): Promise<PaymentSession>`

Создает платежную сессию в ЮKassa.

```typescript
const provider = new YuKassaProvider();

const session = await provider.createSession(
  1000,      // 10.00 руб (в копейках)
  'RUB',
  'user123',
  'order456'
);

// Перенаправить пользователя
window.location.href = session.url;
```

**Параметры:**
- `amount` - Сумма в копейках (1000 = 10.00 руб)
- `currency` - Валюта (обычно 'RUB')
- `userId` - ID пользователя
- `orderId` - ID заказа

**Возвращает:** `PaymentSession` с URL для перенаправления

#### `verifyWebhook(payload, signature): boolean`

Верифицирует вебхук от ЮKassa.

```typescript
const isValid = provider.verifyWebhook(webhookPayload, signature);

if (!isValid) {
  return new Response('Invalid webhook', { status: 401 });
}
```

**Примечание:** ЮKassa не использует подпись в заголовках. Рекомендуется проверять IP-адрес отправителя в production.

#### `processWebhook(payload): Promise<PaymentResult>`

Обрабатывает вебхук от ЮKassa.

```typescript
const result = await provider.processWebhook(webhookPayload);

// result = {
//   orderId: 'order456',
//   status: 'completed' | 'failed',
//   amount: 1000,
//   currency: 'RUB',
//   externalId: 'payment_123'
// }
```

#### `getPaymentInfo(paymentId): Promise<YuKassaPaymentResponse>`

Получает информацию о платеже из ЮKassa.

```typescript
const info = await provider.getPaymentInfo('payment_123');
```

### Обработка статусов

ЮKassa отправляет вебхуки со следующими статусами:

| Статус ЮKassa | Наш статус | Описание |
|---------------|------------|----------|
| succeeded + paid: true | completed | Платеж успешно завершен |
| canceled | failed | Платеж отменен |
| pending | - | Ожидание (не обрабатывается) |
| waiting_for_capture | - | Ожидание подтверждения (не обрабатывается) |

### Безопасность

1. **IP-адреса ЮKassa**: В production следует проверять IP-адрес отправителя вебхука
2. **HTTPS**: Все запросы к API ЮKassa используют HTTPS
3. **Basic Auth**: Аутентификация через shopId и secretKey
4. **Идемпотентность**: Используется Idempotence-Key для предотвращения дублирования платежей

### Тестирование

```bash
npm test -- __tests__/lib/services/payment/YuKassaProvider.test.ts
```

Тесты покрывают:
- Создание платежной сессии
- Верификацию вебхуков
- Обработку различных статусов платежей
- Обработку ошибок API
- Получение информации о платеже

## Выбор платежной системы

Система автоматически выбирает платежную систему на основе региона пользователя:

| Регион | Платежная система | Валюта по умолчанию |
|--------|-------------------|---------------------|
| RU     | ЮKassa            | RUB                 |
| OTHER  | Stripe            | USD, EUR, и др.     |

## Безопасность

### Верификация вебхуков

Все вебхуки от платежных систем должны быть верифицированы перед обработкой:

```typescript
if (!provider.verifyWebhook(payload, signature)) {
  // Логировать попытку с неверной подписью
  console.error('Invalid webhook signature');
  return new Response('Unauthorized', { status: 401 });
}
```

### Идемпотентность

Обработка вебхуков должна быть идемпотентной - повторная отправка того же вебхука не должна приводить к дублированию операций.

## Тестирование

### Unit-тесты

```bash
npm test -- __tests__/lib/services/payment/PaymentFactory.test.ts
```

Тесты покрывают:
- Выбор провайдера на основе региона
- Определение региона по коду страны
- Определение типа провайдера
- Интеграцию методов фабрики

## Следующие шаги

1. **Задача 19**: Реализация YuKassaProvider
2. **Задача 20**: Реализация StripeProvider
3. **Задача 21**: Создание API-эндпоинтов для платежей
4. **Задача 22**: Создание API-эндпоинтов для вебхуков

## Требования

- **14.1**: Интеграция с платежными системами
- **15.1**: Поддержка международных платежей

## См. также

- [Design Document](.kiro/specs/fatos-pro-platform/design.md) - Архитектура платежной системы
- [Requirements](.kiro/specs/fatos-pro-platform/requirements.md) - Требования к платежам
