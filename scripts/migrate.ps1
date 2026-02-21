# FATOS.pro Database Migration Script (PowerShell)
# Этот скрипт упрощает процесс применения миграций базы данных

Write-Host "🚀 FATOS.pro Database Migration Tool" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия .env файла
if (-not (Test-Path .env)) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    Write-Host "📝 Создайте файл .env на основе .env.example" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Пример:" -ForegroundColor Yellow
    Write-Host 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fatos_pro?schema=public"' -ForegroundColor Gray
    exit 1
}

# Проверка DATABASE_URL
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host "❌ DATABASE_URL не найден в .env файле!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Файл .env найден" -ForegroundColor Green
Write-Host ""

# Меню выбора действия
Write-Host "Выберите действие:" -ForegroundColor Yellow
Write-Host "1) Создать и применить миграцию (dev)"
Write-Host "2) Применить pending миграции (production)"
Write-Host "3) Сгенерировать Prisma Client"
Write-Host "4) Открыть Prisma Studio"
Write-Host "5) Проверить статус миграций"
Write-Host "6) Сбросить базу данных (ОПАСНО!)"
Write-Host "7) Проверить подключение к БД"
Write-Host ""

$choice = Read-Host "Введите номер (1-7)"

switch ($choice) {
    "1" {
        $migrationName = Read-Host "Введите имя миграции (например: add_user_avatar)"
        if ([string]::IsNullOrWhiteSpace($migrationName)) {
            Write-Host "❌ Имя миграции не может быть пустым!" -ForegroundColor Red
            exit 1
        }
        Write-Host ""
        Write-Host "📦 Создание и применение миграции: $migrationName" -ForegroundColor Cyan
        npx prisma migrate dev --name $migrationName
        Write-Host ""
        Write-Host "✅ Миграция успешно применена!" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "📦 Применение pending миграций..." -ForegroundColor Cyan
        npx prisma migrate deploy
        Write-Host ""
        Write-Host "✅ Миграции успешно применены!" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "🔧 Генерация Prisma Client..." -ForegroundColor Cyan
        npx prisma generate
        Write-Host ""
        Write-Host "✅ Prisma Client сгенерирован!" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "🎨 Открытие Prisma Studio..." -ForegroundColor Cyan
        npx prisma studio
    }
    "5" {
        Write-Host ""
        Write-Host "📊 Статус миграций:" -ForegroundColor Cyan
        npx prisma migrate status
    }
    "6" {
        Write-Host ""
        Write-Host "⚠️  ВНИМАНИЕ: Это удалит ВСЕ данные из базы данных!" -ForegroundColor Red
        $confirm = Read-Host "Вы уверены? (yes/no)"
        if ($confirm -eq "yes") {
            Write-Host ""
            Write-Host "🗑️  Сброс базы данных..." -ForegroundColor Cyan
            npx prisma migrate reset --force
            Write-Host ""
            Write-Host "✅ База данных сброшена!" -ForegroundColor Green
        } else {
            Write-Host "❌ Отменено" -ForegroundColor Yellow
        }
    }
    "7" {
        Write-Host ""
        Write-Host "🔌 Проверка подключения к базе данных..." -ForegroundColor Cyan
        try {
            npx prisma db pull --force 2>$null
            Write-Host ""
            Write-Host "✅ Подключение к базе данных успешно!" -ForegroundColor Green
        } catch {
            Write-Host ""
            Write-Host "❌ Не удалось подключиться к базе данных!" -ForegroundColor Red
            Write-Host "Проверьте DATABASE_URL в .env файле" -ForegroundColor Yellow
        }
    }
    default {
        Write-Host "❌ Неверный выбор!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✨ Готово!" -ForegroundColor Green
