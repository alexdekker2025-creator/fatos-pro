# Инструкция по деплою на Netlify

## Предварительные требования

1. Аккаунт на [Netlify](https://www.netlify.com/)
2. PostgreSQL база данных (можно использовать [Supabase](https://supabase.com/), [Neon](https://neon.tech/), или [Railway](https://railway.app/))
3. Аккаунты в платежных системах:
   - [ЮKassa](https://yookassa.ru/) для российских платежей
   - [Stripe](https://stripe.com/) для международных платежей

## Шаги деплоя

### 1. Подготовка базы данных

1. Создайте PostgreSQL базу данных на выбранном хостинге
2. Получите строку подключения (DATABASE_URL)
3. Примените миграции:

```bash
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

### 2. Настройка Netlify

1. Войдите в [Netlify Dashboard](https://app.netlify.com/)
2. Нажмите "Add new site" → "Import an existing project"
3. Подключите ваш Git репозиторий
4. Настройте параметры сборки:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

### 3. Настройка переменных окружения

В Netlify Dashboard перейдите в Site settings → Environment variables и добавьте:

```
DATABASE_URL=postgresql://user:password@host:5432/database
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### 4. Установка плагина Next.js

Netlify автоматически определит Next.js проект и установит необходимый плагин `@netlify/plugin-nextjs`.

### 5. Настройка вебхуков платежных систем

#### ЮKassa

1. Войдите в личный кабинет ЮKassa
2. Перейдите в настройки магазина
3. Добавьте URL вебхука: `https://your-site.netlify.app/api/webhooks/yukassa`
4. Выберите события: "Успешный платеж", "Отмена платежа"

#### Stripe

1. Войдите в [Stripe Dashboard](https://dashboard.stripe.com/)
2. Перейдите в Developers → Webhooks
3. Добавьте endpoint: `https://your-site.netlify.app/api/webhooks/stripe`
4. Выберите события: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Скопируйте signing secret и добавьте в переменные окружения

### 6. Деплой

1. Сделайте commit и push в main ветку
2. Netlify автоматически начнет деплой
3. Следите за процессом в Netlify Dashboard → Deploys

### 7. Проверка

После успешного деплоя проверьте:

- [ ] Главная страница открывается
- [ ] База данных подключена (проверьте логи)
- [ ] API эндпоинты работают
- [ ] Вебхуки настроены корректно

## Автоматический деплой

Netlify автоматически деплоит изменения при каждом push в main ветку.

Для отключения автоматического деплоя:
1. Site settings → Build & deploy → Continuous deployment
2. Отключите "Auto publishing"

## Откат к предыдущей версии

1. Перейдите в Deploys
2. Найдите нужную версию
3. Нажмите "Publish deploy"

## Мониторинг

Netlify предоставляет:
- Логи деплоя
- Логи функций
- Аналитику трафика
- Мониторинг ошибок

Доступ: Site overview → Functions или Analytics

## Troubleshooting

### Ошибка подключения к базе данных

Проверьте:
- Правильность DATABASE_URL
- Доступность базы данных из Netlify (whitelist IP если нужно)
- Применены ли миграции

### Ошибки сборки

Проверьте:
- Версию Node.js (должна быть 18)
- Наличие всех зависимостей в package.json
- Логи сборки в Netlify Dashboard

### Вебхуки не работают

Проверьте:
- Правильность URL вебхуков
- Наличие WEBHOOK_SECRET в переменных окружения
- Логи функций в Netlify

## Дополнительные ресурсы

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
