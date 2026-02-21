# База данных FATOS.pro - Схема

## Обзор

База данных FATOS.pro использует PostgreSQL с Prisma ORM. Схема включает 6 основных моделей для управления пользователями, расчетами, заказами, контентом и коллекцией арканов.

## Модели данных

### 1. User (Пользователь)

Хранит информацию о зарегистрированных пользователях платформы.

```prisma
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
  collectedArcana CollectedArcana[]
  
  @@index([email])
}
```

**Поля:**
- `id` - Уникальный идентификатор (CUID)
- `email` - Email пользователя (уникальный)
- `name` - Имя пользователя
- `passwordHash` - Хешированный пароль (bcrypt)
- `preferredLang` - Предпочитаемый язык (ru/en)
- `createdAt` - Дата регистрации
- `updatedAt` - Дата последнего обновления

**Связи:**
- Один ко многим с Calculation (расчеты пользователя)
- Один ко многим с Order (заказы пользователя)
- Один ко многим с AdminLog (действия администратора)
- Один ко многим с CollectedArcana (собранные арканы)

**Индексы:**
- `email` - для быстрого поиска по email

---

### 2. Calculation (Расчет)

Хранит результаты нумерологических расчетов.

```prisma
model Calculation {
  id              String        @id @default(cuid())
  userId          String?
  birthDay        Int
  birthMonth      Int
  birthYear       Int
  workingNumbers  Json
  square          Json
  destinyNumber   Json
  matrix          Json?
  createdAt       DateTime      @default(now())
  
  user            User?         @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([createdAt])
}
```

**Поля:**
- `id` - Уникальный идентификатор
- `userId` - ID пользователя (nullable для анонимных расчетов)
- `birthDay` - День рождения (1-31)
- `birthMonth` - Месяц рождения (1-12)
- `birthYear` - Год рождения (1900+)
- `workingNumbers` - JSON с рабочими числами Пифагора
- `square` - JSON с квадратом Пифагора
- `destinyNumber` - JSON с числом судьбы
- `matrix` - JSON с матрицей судьбы (опционально)
- `createdAt` - Дата создания расчета

**Связи:**
- Многие к одному с User (опционально)

**Индексы:**
- `userId` - для быстрого получения расчетов пользователя
- `createdAt` - для сортировки по дате

---

### 3. Order (Заказ)

Хранит информацию о платежных транзакциях.

```prisma
model Order {
  id              String        @id @default(cuid())
  userId          String
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @db.VarChar(3)
  status          OrderStatus   @default(PENDING)
  paymentProvider String
  externalId      String?
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
```

**Поля:**
- `id` - Уникальный идентификатор
- `userId` - ID пользователя
- `amount` - Сумма платежа (до 10 цифр, 2 знака после запятой)
- `currency` - Валюта (3 символа: RUB, USD, EUR)
- `status` - Статус заказа (PENDING/COMPLETED/FAILED/REFUNDED)
- `paymentProvider` - Платежная система (yukassa/stripe)
- `externalId` - ID транзакции в платежной системе
- `createdAt` - Дата создания заказа
- `updatedAt` - Дата последнего обновления

**Связи:**
- Многие к одному с User

**Индексы:**
- `userId` - для получения заказов пользователя
- `status` - для фильтрации по статусу
- `externalId` - для поиска по ID платежной системы

---

### 4. Article (Статья)

Хранит информационный контент с описаниями нумерологических значений.

```prisma
model Article {
  id              String        @id @default(cuid())
  title           String
  content         String        @db.Text
  category        String
  language        String        @db.VarChar(2)
  relatedValue    String?
  publishedAt     DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([category, language])
  @@index([relatedValue])
}
```

**Поля:**
- `id` - Уникальный идентификатор
- `title` - Заголовок статьи
- `content` - Содержание статьи (текст)
- `category` - Категория (destiny_number/matrix_position/square_cell)
- `language` - Язык статьи (ru/en)
- `relatedValue` - Связанное значение (например, "1", "11", "position_1")
- `publishedAt` - Дата публикации
- `updatedAt` - Дата последнего обновления

**Индексы:**
- `(category, language)` - композитный индекс для поиска статей
- `relatedValue` - для связывания с результатами расчетов

---

### 5. AdminLog (Лог администратора)

Хранит логи действий администраторов.

```prisma
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

**Поля:**
- `id` - Уникальный идентификатор
- `adminId` - ID администратора (ссылка на User)
- `action` - Тип действия (create_article/update_article/delete_article)
- `details` - Дополнительные детали (JSON)
- `createdAt` - Дата действия

**Связи:**
- Многие к одному с User (администратор)

**Индексы:**
- `adminId` - для получения действий администратора
- `createdAt` - для сортировки по дате

---

### 6. CollectedArcana (Собранные арканы)

Хранит информацию о собранных пользователями арканах.

```prisma
model CollectedArcana {
  id              String        @id @default(cuid())
  userId          String
  arcanaNumber    Int
  firstSeenAt     DateTime      @default(now())
  
  user            User          @relation(fields: [userId], references: [id])
  
  @@unique([userId, arcanaNumber])
  @@index([userId])
}
```

**Поля:**
- `id` - Уникальный идентификатор
- `userId` - ID пользователя
- `arcanaNumber` - Номер аркана (1-22)
- `firstSeenAt` - Дата первого получения

**Связи:**
- Многие к одному с User

**Ограничения:**
- `@@unique([userId, arcanaNumber])` - пользователь может иметь только один экземпляр каждого аркана

**Индексы:**
- `userId` - для получения коллекции пользователя

---

## Диаграмма связей

```
User (1) ──< (N) Calculation
User (1) ──< (N) Order
User (1) ──< (N) AdminLog
User (1) ──< (N) CollectedArcana

Article (независимая таблица)
```

## Типы данных

### JSON поля

**Calculation.workingNumbers:**
```json
{
  "first": 25,
  "second": 7,
  "third": 23,
  "fourth": 5
}
```

**Calculation.square:**
```json
{
  "cells": [[1,1,1], [4,4,0], [7,0,0]],
  "digitCounts": {
    "1": 3,
    "2": 0,
    "3": 0,
    "4": 2,
    "5": 0,
    "6": 0,
    "7": 1,
    "8": 0,
    "9": 0
  }
}
```

**Calculation.destinyNumber:**
```json
{
  "value": 7,
  "isMasterNumber": false
}
```

**Calculation.matrix:**
```json
{
  "positions": {
    "dayNumber": 15,
    "monthNumber": 6,
    "yearNumber": 1990,
    "lifePathNumber": 7,
    "personalityNumber": 6,
    "soulNumber": 9,
    "powerNumber": 3,
    "karmicNumber": 4
  }
}
```

## Миграции

Для применения схемы к базе данных:

```bash
# Создать миграцию
npx prisma migrate dev --name init

# Применить миграцию к production
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate
```

## Переменные окружения

Необходимо настроить в `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fatos_pro?schema=public"
```

Для production (Netlify):
- Настроить DATABASE_URL в переменных окружения Netlify
- Использовать внешний PostgreSQL сервис (например, Supabase, Neon, Railway)

## Оптимизация

### Индексы
Все критические поля имеют индексы для оптимизации запросов:
- Уникальные поля (email)
- Foreign keys (userId, adminId)
- Поля для фильтрации (status, category, language)
- Поля для сортировки (createdAt)

### Производительность
- Используйте `select` для выборки только нужных полей
- Используйте `include` вместо множественных запросов
- Кешируйте часто запрашиваемые данные
- Используйте пагинацию для больших списков

## Безопасность

1. **Пароли**: Всегда хешируются с bcrypt перед сохранением
2. **SQL Injection**: Prisma автоматически защищает от SQL-инъекций
3. **Валидация**: Используйте Zod схемы перед сохранением в БД
4. **Права доступа**: Проверяйте userId перед операциями
5. **Sensitive данные**: Никогда не возвращайте passwordHash клиенту

## Резервное копирование

Рекомендуется настроить автоматическое резервное копирование:
- Ежедневные бэкапы базы данных
- Хранение бэкапов минимум 30 дней
- Тестирование восстановления из бэкапа

## Мониторинг

Отслеживайте:
- Размер базы данных
- Количество запросов
- Медленные запросы (> 1 секунда)
- Ошибки подключения
- Использование индексов
