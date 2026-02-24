# Скрипт для запуска FATOS.pro локально
# PowerShell скрипт для Windows

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  FATOS.pro - Локальный запуск" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Node.js
Write-Host "Проверка Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js установлен: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js не найден! Установите Node.js 18+ с https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Проверка наличия .env.local
Write-Host ""
Write-Host "Проверка конфигурации..." -ForegroundColor Yellow
if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠ Файл .env.local не найден!" -ForegroundColor Yellow
    Write-Host "Создаю из .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "✓ Файл .env.local создан" -ForegroundColor Green
        Write-Host ""
        Write-Host "ВАЖНО: Отредактируйте .env.local и заполните необходимые переменные!" -ForegroundColor Red
        Write-Host "Особенно DATABASE_URL и NEXTAUTH_SECRET" -ForegroundColor Red
        Write-Host ""
        $continue = Read-Host "Продолжить? (y/n)"
        if ($continue -ne "y") {
            exit 0
        }
    } else {
        Write-Host "✗ Файл .env.example не найден!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Файл .env.local найден" -ForegroundColor Green
}

# Проверка node_modules
Write-Host ""
Write-Host "Проверка зависимостей..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "⚠ Папка node_modules не найдена" -ForegroundColor Yellow
    Write-Host "Устанавливаю зависимости..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Ошибка при установке зависимостей" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Зависимости установлены" -ForegroundColor Green
} else {
    Write-Host "✓ Зависимости найдены" -ForegroundColor Green
}

# Генерация Prisma клиента
Write-Host ""
Write-Host "Генерация Prisma клиента..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Ошибка при генерации Prisma клиента" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma клиент сгенерирован" -ForegroundColor Green

# Запуск dev сервера
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Запуск сервера разработки..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Сервер будет доступен по адресу: http://localhost:3000" -ForegroundColor Green
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

npm run dev
