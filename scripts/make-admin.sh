#!/bin/bash

# Скрипт для назначения роли администратора пользователю (Bash)
#
# Использование:
# ./scripts/make-admin.sh <email>
#
# Пример:
# ./scripts/make-admin.sh admin@fatos.pro

if [ -z "$1" ]; then
    echo ""
    echo "❌ Ошибка: не указан email пользователя"
    echo ""
    echo "📖 Использование:"
    echo "   ./scripts/make-admin.sh <email>"
    echo ""
    echo "📝 Пример:"
    echo "   ./scripts/make-admin.sh admin@fatos.pro"
    echo ""
    exit 1
fi

EMAIL=$1

echo ""
echo "🔧 Назначение роли администратора..."
echo ""

# Запускаем TypeScript скрипт
npx ts-node scripts/make-admin.ts "$EMAIL"

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ Готово!"
else
    echo ""
    echo "⚠️  Произошла ошибка"
    exit 1
fi
