# Миграции базы данных FATOS.pro

## Обзор

Этот документ описывает процесс применения миграций базы данных для проекта FATOS.pro. Мы используем Prisma ORM для управления схемой базы данных и миграциями.

## Предварительные требования

### 1. PostgreSQL

Вам нужна работающая база данных PostgreSQL. Есть несколько вариантов:

#### Вариант A: Локальная установка PostgreSQL

**Windows:**
```bash
# Скачайте и установите PostgreSQL с официального сайта
# https://www.postgresql.org/download/windows/

# После установки создайте базу данных
psql -U postgres
CREATE DATABASE fatos_pro;
\q
```

**macOS (с Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb fatos_pro
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb fatos_pro
```

#### Вариант B: Облачные сервисы (Рекомендуется для production)

**Supabase (Бесплатный tier):**
1. Зарегистрируйтесь на https://supabase.com
2. Создайте новый проект
3. Скопируйте Connection String из Settings → Database
4. Используйте формат: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**Neon (Бесплатный tier):**
1. Зарегистрируйтесь на https://neon.tech
2. Создайте новый проект
3. Скопируйте Connection String
4. Формат: `postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require`

**Railway:**
1. Зарегистрируйтесь на https://railway.app
2. Создайте новый PostgreSQL сервис
3. Скопируйте DATABASE_URL из переменных окружения

#### Вариант C: Docker (Для разработки)

```bash
# Запустить PostgreSQL в Docker
docker run --name fatos-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fatos_pro \
  -p 5432:5432 \
  -d postgres:15

# Проверить, что контейнер запущен
docker ps
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта (если его нет):

```env
# Локальная разработка
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fatos_pro?schema=public"

# Или используйте URL из облачного сервиса
# DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**ВАЖНО:** Файл `.env` не должен коммититься в Git (уже добавлен в `.gitignore`).

## Применение миграций

### Шаг 1: Проверка подключения к базе данных

Убедитесь, что Prisma может подключиться к базе данных:

```bash
npx prisma db pull
```

Если команда выполнилась без ошибок, подключение работает.

### Шаг 2: Создание и применение миграции

Для разработки используйте команду `migrate dev`:

```bash
# Создать миграцию и применить её к базе данных
npx prisma migrate dev --name init

# Prisma автоматически:
# 1. Создаст SQL файл миграции в prisma/migrations/
# 2. Применит миграцию к базе данных
# 3. Сгенерирует Prisma Client
```

**Что происходит:**
- Создаётся папка `prisma/migrations/[timestamp]_init/`
- В ней создаётся файл `migration.sql` с SQL командами
- Миграция применяется к базе данных
- Генерируется Prisma Client для использования в коде

### Шаг 3: Проверка миграции

Проверьте, что все таблицы созданы:

```bash
# Откройте Prisma Studio для визуального просмотра
npx prisma studio

# Или используйте psql
psql -U postgres -d fatos_pro -c "\dt"
```

Вы должны увидеть следующие таблицы:
- `User`
- `Calculation`
- `Order`
- `Article`
- `AdminLog`
- `CollectedArcana`
- `_prisma_migrations` (служебная таблица Prisma)

### Шаг 4: Генерация Prisma Client

Если вы изменили схему без создания миграции, сгенерируйте клиент:

```bash
npx prisma generate
```

## Применение миграций в Production

Для production используйте команду `migrate deploy`:

```bash
# Применить все pending миграции
npx prisma migrate deploy
```

**Отличия от `migrate dev`:**
- Не создаёт новые миграции
- Не сбрасывает базу данных
- Применяет только pending миграции
- Безопасно для production

### Netlify Deployment

Добавьте в `netlify.toml`:

```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

Настройте переменную окружения в Netlify Dashboard:
- `DATABASE_URL` - ваш production database URL

## Управление миграциями

### Создание новой миграции

Когда вы изменяете `schema.prisma`:

```bash
# Создать и применить миграцию
npx prisma migrate dev --name add_new_field

# Примеры имён миграций:
# - add_user_avatar
# - update_order_status
# - create_notifications_table
```

### Откат миграции

Prisma не поддерживает автоматический откат. Для отката:

1. Создайте новую миграцию с обратными изменениями
2. Или вручную откатите через SQL:

```bash
# Посмотреть историю миграций
npx prisma migrate status

# Вручную откатить через psql
psql -U postgres -d fatos_pro
# Выполните обратные SQL команды
```

### Сброс базы данных (только для разработки!)

```bash
# ВНИМАНИЕ: Удаляет все данные!
npx prisma migrate reset

# Это:
# 1. Удаляет базу данных
# 2. Создаёт новую базу данных
# 3. Применяет все миграции
# 4. Запускает seed (если настроен)
```

## Seed данных (Опционально)

Создайте файл `prisma/seed.ts` для начальных данных:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создать тестового пользователя
  const user = await prisma.user.create({
    data: {
      email: 'admin@fatos.pro',
      name: 'Admin',
      passwordHash: '$2b$10$...', // Хешированный пароль
      preferredLang: 'ru',
    },
  });

  console.log('Seed completed:', user);
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

Добавьте в `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Запустите seed:

```bash
npx prisma db seed
```

## Troubleshooting

### Ошибка: "Can't reach database server"

**Проблема:** Prisma не может подключиться к базе данных.

**Решение:**
1. Проверьте, что PostgreSQL запущен
2. Проверьте DATABASE_URL в .env
3. Проверьте firewall и сетевые настройки
4. Для облачных БД проверьте IP whitelist

```bash
# Проверить подключение
psql -U postgres -h localhost -d fatos_pro

# Или для облачной БД
psql "postgresql://user:password@host:5432/database?sslmode=require"
```

### Ошибка: "Migration failed"

**Проблема:** Миграция не может быть применена.

**Решение:**
1. Проверьте логи ошибок
2. Проверьте, что схема корректна
3. Проверьте, что нет конфликтующих изменений

```bash
# Посмотреть статус миграций
npx prisma migrate status

# Пометить миграцию как применённую (если она уже применена вручную)
npx prisma migrate resolve --applied [migration_name]
```

### Ошибка: "Prisma Client not generated"

**Проблема:** Prisma Client не сгенерирован.

**Решение:**
```bash
npx prisma generate
```

### Ошибка: "Schema drift detected"

**Проблема:** База данных не соответствует схеме.

**Решение:**
```bash
# Посмотреть различия
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma

# Создать миграцию для синхронизации
npx prisma migrate dev --name sync_schema
```

## Лучшие практики

1. **Всегда создавайте резервные копии** перед применением миграций в production
2. **Тестируйте миграции** на staging окружении
3. **Используйте осмысленные имена** для миграций
4. **Не редактируйте** уже применённые миграции
5. **Коммитьте миграции** в Git вместе с изменениями схемы
6. **Используйте транзакции** для критических миграций
7. **Мониторьте производительность** после применения миграций

## Полезные команды

```bash
# Посмотреть схему в браузере
npx prisma studio

# Проверить статус миграций
npx prisma migrate status

# Валидация схемы
npx prisma validate

# Форматирование схемы
npx prisma format

# Просмотр SQL миграции без применения
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

## Дополнительные ресурсы

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
