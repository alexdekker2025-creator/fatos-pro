#!/bin/bash

# FATOS.pro Database Migration Script
# Этот скрипт упрощает процесс применения миграций базы данных

set -e

echo "🚀 FATOS.pro Database Migration Tool"
echo "===================================="
echo ""

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "📝 Создайте файл .env на основе .env.example"
    echo ""
    echo "Пример:"
    echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/fatos_pro?schema=public\""
    exit 1
fi

# Проверка DATABASE_URL
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL не найден в .env файле!"
    exit 1
fi

echo "✅ Файл .env найден"
echo ""

# Меню выбора действия
echo "Выберите действие:"
echo "1) Создать и применить миграцию (dev)"
echo "2) Применить pending миграции (production)"
echo "3) Сгенерировать Prisma Client"
echo "4) Открыть Prisma Studio"
echo "5) Проверить статус миграций"
echo "6) Сбросить базу данных (ОПАСНО!)"
echo "7) Проверить подключение к БД"
echo ""
read -p "Введите номер (1-7): " choice

case $choice in
    1)
        read -p "Введите имя миграции (например: add_user_avatar): " migration_name
        if [ -z "$migration_name" ]; then
            echo "❌ Имя миграции не может быть пустым!"
            exit 1
        fi
        echo ""
        echo "📦 Создание и применение миграции: $migration_name"
        npx prisma migrate dev --name "$migration_name"
        echo ""
        echo "✅ Миграция успешно применена!"
        ;;
    2)
        echo ""
        echo "📦 Применение pending миграций..."
        npx prisma migrate deploy
        echo ""
        echo "✅ Миграции успешно применены!"
        ;;
    3)
        echo ""
        echo "🔧 Генерация Prisma Client..."
        npx prisma generate
        echo ""
        echo "✅ Prisma Client сгенерирован!"
        ;;
    4)
        echo ""
        echo "🎨 Открытие Prisma Studio..."
        npx prisma studio
        ;;
    5)
        echo ""
        echo "📊 Статус миграций:"
        npx prisma migrate status
        ;;
    6)
        echo ""
        echo "⚠️  ВНИМАНИЕ: Это удалит ВСЕ данные из базы данных!"
        read -p "Вы уверены? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "🗑️  Сброс базы данных..."
            npx prisma migrate reset --force
            echo ""
            echo "✅ База данных сброшена!"
        else
            echo "❌ Отменено"
        fi
        ;;
    7)
        echo ""
        echo "🔌 Проверка подключения к базе данных..."
        if npx prisma db pull --force 2>/dev/null; then
            echo ""
            echo "✅ Подключение к базе данных успешно!"
        else
            echo ""
            echo "❌ Не удалось подключиться к базе данных!"
            echo "Проверьте DATABASE_URL в .env файле"
        fi
        ;;
    *)
        echo "❌ Неверный выбор!"
        exit 1
        ;;
esac

echo ""
echo "✨ Готово!"
