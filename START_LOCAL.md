# Запуск проекта локально

## Предварительные требования

1. **Node.js** версии 18 или выше
2. **npm** или **yarn**
3. **PostgreSQL** база данных (или используйте Neon онлайн)

## Шаги для запуска

### 1. Установка зависимостей

```bash
npm install
```

или

```bash
yarn install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта (если его нет) и скопируйте туда содержимое из `.env.example`:

```bash
cp .env.example .env.local
```

Затем отредактируйте `.env.local` и заполните необходимые переменные:

```env
# Database
DATABASE_URL="ваша_строка_подключения_к_postgresql"

# NextAuth
NEXTAUTH_SECRET="ваш_секретный_ключ"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="ваш_api_ключ_resend"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Payment providers (опционально для локальной разработки)
STRIPE_SECRET_KEY="ваш_stripe_ключ"
YUKASSA_SHOP_ID="ваш_yukassa_id"
YUKASSA_SECRET_KEY="ваш_yukassa_ключ"

# OAuth (опционально)
GOOGLE_CLIENT_ID="ваш_google_client_id"
GOOGLE_CLIENT_SECRET="ваш_google_client_secret"
YANDEX_CLIENT_ID="ваш_yandex_client_id"
YANDEX_CLIENT_SECRET="ваш_yandex_client_secret"
VK_CLIENT_ID="ваш_vk_client_id"
VK_CLIENT_SECRET="ваш_vk_client_secret"
```

### 3. Применение миграций базы данных

```bash
npx prisma generate
npx prisma db push
```

### 4. Запуск проекта в режиме разработки

```bash
npm run dev
```

или

```bash
yarn dev
```

Проект будет доступен по адресу: **http://localhost:3000**

### 5. Создание админа (опционально)

Если вам нужно создать администратора, выполните:

```bash
node scripts/make-admin.js
```

Введите email пользователя, которому нужно дать права администратора.

## Полезные команды

### Просмотр базы данных

```bash
npx prisma studio
```

Откроется веб-интерфейс для просмотра и редактирования данных в базе.

### Сборка для продакшена

```bash
npm run build
npm run start
```

### Проверка типов TypeScript

```bash
npm run type-check
```

### Линтинг кода

```bash
npm run lint
```

## Структура проекта

```
fatos-pro/
├── app/                    # Next.js App Router
│   ├── api/               # API эндпоинты
│   ├── [locale]/          # Локализованные страницы
│   └── layout.tsx         # Корневой layout
├── components/            # React компоненты
├── lib/                   # Утилиты и сервисы
│   ├── services/         # Бизнес-логика
│   ├── auth/             # Аутентификация
│   └── prisma.ts         # Prisma клиент
├── messages/              # Файлы переводов (i18n)
├── prisma/               # Схема базы данных
├── public/               # Статические файлы
└── scripts/              # Утилитарные скрипты

```

## Решение проблем

### Ошибка подключения к базе данных

Убедитесь, что:
- PostgreSQL запущен
- Строка подключения `DATABASE_URL` в `.env.local` правильная
- У пользователя БД есть права на создание таблиц

### Ошибки при установке зависимостей

Попробуйте очистить кэш и переустановить:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с Prisma

Пересоздайте клиент Prisma:

```bash
npx prisma generate
```

## Дополнительная информация

- **Документация Next.js**: https://nextjs.org/docs
- **Документация Prisma**: https://www.prisma.io/docs
- **Документация Resend**: https://resend.com/docs

## Контакты

Если у вас возникли вопросы, обратитесь к документации или создайте issue в репозитории проекта.
