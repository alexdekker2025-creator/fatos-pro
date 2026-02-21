# Payment Service

Сервис для работы с платежными системами.

## Структура

```
payment/
├── types.ts              # Типы и интерфейсы
├── PaymentFactory.ts     # Фабрика провайдеров
├── YuKassaProvider.ts    # ЮKassa (реализовано)
├── StripeProvider.ts     # Stripe (задача 20)
├── index.ts              # Экспорт модуля
└── README.md             # Эта документация
```

## Использование

### Создание платежа для российского пользователя

```typescript
import { PaymentFactory } from '@/lib/services/payment';

// Определить регион
const region = PaymentFactory.getRegionFromCountryCode('RU');

// Получить провайдера (YuKassaProvider)
const provider = PaymentFactory.getProvider(region);

// Создать платежную сессию
const session = await provider.createSession(
  1000,      // Сумма в копейках
  'RUB',     // Валюта
  'user123', // User ID
  'order456' // Order ID
);

// Перенаправить пользователя
window.location.href = session.url;
```

### Обработка вебхука

```typescript
import { PaymentFactory } from '@/lib/services/payment';

// В API route
export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get('X-Signature') || '';
  
  const provider = PaymentFactory.getProvider('RU');
  
  // Верифицировать
  if (!provider.verifyWebhook(payload, signature)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Обработать
  const result = await provider.processWebhook(payload);
  
  // Обновить заказ в БД
  await updateOrder(result.orderId, result.status);
  
  return new Response('OK', { status: 200 });
}
```

## Тесты

```bash
npm test -- __tests__/lib/services/payment/PaymentFactory.test.ts
```

## Документация

См. [docs/payment-service.md](../../../docs/payment-service.md) для полной документации.
