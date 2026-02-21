# FATOS.pro

Веб-платформа для нумерологических расчетов на базе Next.js 14.

## Возможности

- Расчет Квадрата Пифагора
- Расчет Числа Судьбы
- Расчет Матрицы Судьбы
- Многоязычность (русский/английский)
- Интеграция с платежными системами (ЮKassa, Stripe)
- Административная панель

## Технологии

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Netlify
- **Testing**: Jest, fast-check (property-based testing)

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

4. Настройте переменные окружения в `.env`

5. Примените миграции базы данных:

```bash
npx prisma migrate dev
```

6. Запустите сервер разработки:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Команды

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка для production
- `npm run start` - запуск production сервера
- `npm run lint` - проверка кода
- `npm run test` - запуск тестов
- `npm run test:watch` - запуск тестов в watch режиме
- `npm run test:coverage` - запуск тестов с покрытием

## Структура проекта

```
.
├── app/                  # Next.js App Router страницы
├── components/           # React компоненты
├── lib/                  # Утилиты и сервисы
│   ├── calculators/      # Нумерологические калькуляторы
│   ├── services/         # Бизнес-логика
│   └── validation/       # Схемы валидации
├── types/                # TypeScript типы
├── prisma/               # Prisma схема и миграции
└── __tests__/            # Тесты
```

## Деплой на Netlify

1. Подключите репозиторий к Netlify
2. Настройте переменные окружения в Netlify Dashboard
3. Деплой произойдет автоматически при push в main ветку

## Лицензия

Proprietary
