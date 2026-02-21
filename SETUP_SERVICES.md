# Быстрая настройка управления услугами

Выполните эти команды по порядку:

## 1. Создайте миграцию базы данных

```bash
npx prisma migrate dev --name add_premium_services
```

## 2. Заполните базу данных услугами

```bash
npx ts-node prisma/seed-services.ts
```

Если `ts-node` не установлен, сначала установите его:

```bash
npm install -D ts-node
```

Или используйте альтернативный способ:

```bash
npx tsx prisma/seed-services.ts
```

## 3. Готово!

Теперь:
1. Откройте админ панель: http://localhost:3000/ru/admin
2. Перейдите на вкладку "Премиум услуги"
3. Вы увидите список всех 9 услуг
4. Можете редактировать любую услугу

## Проверка

Если услуги не отображаются, проверьте:

1. Выполнена ли миграция:
```bash
npx prisma studio
```
Откроется Prisma Studio, проверьте таблицу `PremiumService`

2. Есть ли ошибки в консоли браузера (F12)

3. Проверьте API напрямую:
```bash
curl http://localhost:3000/api/services
```

## Если что-то пошло не так

Пересоздайте базу данных:
```bash
npx prisma migrate reset
npx prisma migrate dev
npx ts-node prisma/seed-services.ts
```
