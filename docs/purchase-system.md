# Система покупок и разблокировки контента

## Обзор

Система покупок позволяет пользователям приобретать премиум-услуги и автоматически разблокировать соответствующий контент после успешной оплаты.

## Архитектура

### База данных

#### Модель Purchase

```prisma
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

**Поля**:
- `id` - Уникальный идентификатор покупки
- `userId` - ID пользователя, совершившего покупку
- `serviceId` - ID приобретенной услуги (`full_pythagorean`, `destiny_matrix`)
- `orderId` - ID заказа (связь с Order)
- `createdAt` - Дата и время покупки
- `expiresAt` - Дата истечения (опционально, для подписок)

**Индексы**:
- `userId` - для быстрого поиска покупок пользователя
- `serviceId` - для поиска по типу услуги
- `userId + serviceId` - уникальная комбинация (один пользователь не может купить одну услугу дважды)

#### Обновление модели Order

Добавлено поле `serviceId` для связи заказа с конкретной услугой:

```prisma
model Order {
  // ... существующие поля
  serviceId       String?
  purchase        Purchase?
}
```

## API Эндпоинты

### GET /api/purchases

Получение списка покупок текущего пользователя.

**Headers**:
```
Authorization: Bearer <sessionId>
```

**Response** (200 OK):
```json
{
  "success": true,
  "purchases": [
    {
      "id": "clx...",
      "userId": "clx...",
      "serviceId": "full_pythagorean",
      "orderId": "clx...",
      "createdAt": "2026-02-21T10:00:00.000Z",
      "expiresAt": null
    }
  ]
}
```

**Errors**:
- `401 Unauthorized` - Отсутствует или невалидный sessionId
- `500 Internal Server Error` - Ошибка сервера

## Хуки

### usePurchases()

React хук для работы с покупками пользователя.

**Использование**:
```typescript
import { usePurchases } from '@/lib/hooks/usePurchases';

function MyComponent() {
  const { purchases, loading, error, hasPurchased, getPurchase, refetch } = usePurchases();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const hasFullPythagorean = hasPurchased('full_pythagorean');

  return (
    <div>
      {hasFullPythagorean ? (
        <div>У вас есть доступ к полному квадрату Пифагора</div>
      ) : (
        <div>Купите полный квадрат Пифагора</div>
      )}
    </div>
  );
}
```

**Возвращаемые значения**:
- `purchases: Purchase[]` - Массив покупок пользователя
- `loading: boolean` - Флаг загрузки
- `error: string | null` - Сообщение об ошибке
- `hasPurchased(serviceId: string): boolean` - Проверка наличия покупки
- `getPurchase(serviceId: string): Purchase | undefined` - Получение конкретной покупки
- `refetch(): Promise<void>` - Повторная загрузка покупок

## Процесс покупки

### 1. Инициация платежа

Пользователь нажимает "Купить" на карточке услуги:

```typescript
// components/PremiumServices.tsx
const handleBuyClick = (serviceId: string) => {
  setSelectedService({
    id: serviceId,
    titleKey: 'premium.fullPythagorean',
    priceRUB: 490,
    priceEUR: 7,
  });
  setIsPaymentModalOpen(true);
};
```

### 2. Выбор способа оплаты

Пользователь выбирает ЮKassa или Stripe в модальном окне:

```typescript
// components/PaymentModal.tsx
const handlePayment = async () => {
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`,
    },
    body: JSON.stringify({
      amount: 49000, // 490 руб в копейках
      currency: 'RUB',
      countryCode: 'RU',
      serviceId: 'full_pythagorean',
    }),
  });

  const data = await response.json();
  window.location.href = data.paymentUrl;
};
```

### 3. Создание заказа

API создает заказ со статусом PENDING и сохраняет serviceId:

```typescript
// app/api/payments/create/route.ts
const order = await prisma.order.create({
  data: {
    userId: user.id,
    amount,
    currency,
    status: 'PENDING',
    paymentProvider: providerType,
    serviceId, // Сохраняем ID услуги
  },
});
```

### 4. Обработка вебхука

После успешной оплаты платежная система отправляет вебхук:

```typescript
// app/api/webhooks/stripe/route.ts
// Обновляем статус заказа
await prisma.order.update({
  where: { id: result.orderId },
  data: { status: 'COMPLETED' },
});

// Создаем запись Purchase
if (result.status === 'completed' && existingOrder.serviceId) {
  await prisma.purchase.create({
    data: {
      userId: existingOrder.userId,
      serviceId: existingOrder.serviceId,
      orderId: existingOrder.id,
    },
  });
}
```

### 5. Перенаправление на страницу успеха

Пользователь перенаправляется на `/ru/payment/success` с параметрами:

```
/ru/payment/success?orderId=clx...&serviceId=full_pythagorean&amount=490.00 RUB
```

### 6. Разблокировка контента

При следующем посещении страницы с расчетами:

```typescript
// components/PythagoreanSquareDisplay.tsx
const { hasPurchased } = usePurchases();
const hasFullAccess = hasPurchased('full_pythagorean');

// Показываем все ячейки, если есть доступ
const isLocked = !isFree && !hasFullAccess;
```

## Разблокировка контента

### Квадрат Пифагора

**Бесплатные ячейки**: 1, 5, 9 (диагональ)

**Заблокированные ячейки**: 2, 3, 4, 6, 7, 8

После покупки `full_pythagorean` все ячейки становятся доступными.

**Визуализация**:
- Заблокированные ячейки показывают иконку замка
- Фон заблокированных ячеек затемнен
- Под квадратом отображается сообщение о необходимости покупки

### Матрица Судьбы

**TODO**: Реализовать разблокировку для `destiny_matrix`

## Страницы результатов оплаты

### Страница успеха

**Путь**: `/ru/payment/success`, `/en/payment/success`

**Параметры URL**:
- `orderId` - ID заказа
- `serviceId` - ID услуги
- `amount` - Сумма платежа

**Функциональность**:
- Отображение иконки успеха (зеленая галочка)
- Информация о заказе (услуга, сумма, номер заказа)
- Сообщение о разблокировке контента
- Кнопки "Вернуться на главную" и "Перейти в профиль"

### Страница отмены

**Путь**: `/ru/payment/cancel`, `/en/payment/cancel`

**Функциональность**:
- Отображение иконки отмены (оранжевый крестик)
- Сообщение об отмене платежа
- Информация о том, что средства не были списаны
- Кнопки "Вернуться на главную" и "Попробовать снова"

## Безопасность

### Проверка прав доступа

1. **API эндпоинты**: Все эндпоинты требуют валидный sessionId
2. **Вебхуки**: Верификация подписи от платежных систем
3. **Уникальность покупок**: Ограничение `@@unique([userId, serviceId])` предотвращает дублирование

### Идемпотентность

- Вебхуки проверяют статус заказа перед обработкой
- Повторная обработка вебхука возвращает 200 OK без изменений
- Purchase создается только один раз для каждого заказа

## Миграция базы данных

Для применения изменений выполните:

```bash
# Применить миграцию вручную
psql -U postgres -d fatos_pro -f prisma/migrations/add_purchase_model.sql

# Или через Prisma
npx prisma migrate deploy
```

## Тестирование

### Тестовый сценарий

1. Зарегистрироваться/войти в систему
2. Перейти на главную страницу
3. Прокрутить до блока "Премиум услуги"
4. Нажать "Купить" на карточке "Полный Квадрат Пифагора"
5. Выбрать способ оплаты (ЮKassa или Stripe)
6. Использовать тестовую карту для оплаты
7. Проверить перенаправление на страницу успеха
8. Вернуться на главную и выполнить расчет
9. Убедиться, что все ячейки квадрата Пифагора разблокированы

### Тестовые карты

**ЮKassa**:
- Успешная оплата: `5555 5555 5555 4444`
- Отклоненная оплата: `5555 5555 5555 5599`

**Stripe**:
- Успешная оплата: `4242 4242 4242 4242`
- Отклоненная оплата: `4000 0000 0000 0002`

## Мониторинг

### Логирование

Все операции с покупками логируются:

```typescript
console.log('Purchase created', {
  userId: existingOrder.userId,
  serviceId: existingOrder.serviceId,
  orderId: existingOrder.id,
});
```

### Метрики

Рекомендуется отслеживать:
- Количество успешных покупок
- Конверсия (просмотры → покупки)
- Средний чек
- Процент отмененных платежей

## Будущие улучшения

1. **Email-уведомления**: Отправка письма после успешной покупки
2. **Подписки**: Поддержка recurring платежей с expiresAt
3. **Возвраты**: Обработка refund через вебхуки
4. **Промокоды**: Система скидок и промокодов
5. **Аналитика**: Интеграция с Google Analytics для отслеживания покупок
