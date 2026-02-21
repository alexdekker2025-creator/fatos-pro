# Настройка управления премиум услугами в админ панели

## 1. Миграция базы данных

Выполните миграцию для создания таблицы `PremiumService`:

```bash
npx prisma migrate dev --name add_premium_services
```

## 2. Заполнение начальными данными (опционально)

Создайте файл `prisma/seed-services.ts` для заполнения базы данных текущими услугами:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
  {
    serviceId: 'destiny_matrix',
    titleRu: 'Матрица судьбы',
    titleEn: 'Destiny Matrix',
    // ... остальные поля
  },
  // ... другие услуги
];

async function main() {
  for (const service of services) {
    await prisma.premiumService.upsert({
      where: { serviceId: service.serviceId },
      update: service,
      create: service,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Запустите:
```bash
npx ts-node prisma/seed-services.ts
```

## 3. Добавление ссылки в админ панель

Добавьте ссылку на управление услугами в файл админ панели (`app/ru/admin/page.tsx` и `app/en/admin/page.tsx`):

```tsx
import ServiceManager from '@/components/admin/ServiceManager';

// В компоненте добавьте вкладку:
<button onClick={() => setActiveTab('services')}>
  Премиум услуги
</button>

// И рендер компонента:
{activeTab === 'services' && <ServiceManager />}
```

## 4. API Endpoints

Созданы следующие endpoints:

- `GET /api/services` - Публичный список активных услуг
- `GET /api/admin/services` - Список всех услуг (требует авторизации)
- `POST /api/admin/services` - Создание новой услуги
- `GET /api/admin/services/[id]` - Получение одной услуги
- `PUT /api/admin/services/[id]` - Обновление услуги
- `DELETE /api/admin/services/[id]` - Удаление услуги

## 5. Возможности

- ✅ Редактирование названий (RU/EN)
- ✅ Редактирование описаний и хуков
- ✅ Изменение цен (базовый/полный тариф)
- ✅ Изменение иконки и цвета
- ✅ Редактирование списка фич
- ✅ Активация/деактивация услуг
- ✅ Изменение порядка отображения
- ✅ Логирование всех действий

## 6. Автоматическая загрузка

Компонент `PremiumServices` теперь автоматически загружает услуги из базы данных. При ошибке API используются захардкоженные значения как fallback.
