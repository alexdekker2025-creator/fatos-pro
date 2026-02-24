#!/bin/bash
# Скрипт для запуска FATOS.pro локально
# Bash скрипт для Linux/Mac/Git Bash на Windows

echo "=================================="
echo "  FATOS.pro - Локальный запуск"
echo "=================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Проверка наличия Node.js
echo -e "${YELLOW}Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js не найден! Установите Node.js 18+ с https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js установлен: $NODE_VERSION${NC}"

# Проверка наличия .env.local
echo ""
echo -e "${YELLOW}Проверка конфигурации...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠ Файл .env.local не найден!${NC}"
    echo -e "${YELLOW}Создаю из .env.example...${NC}"
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✓ Файл .env.local создан${NC}"
        echo ""
        echo -e "${RED}ВАЖНО: Отредактируйте .env.local и заполните необходимые переменные!${NC}"
        echo -e "${RED}Особенно DATABASE_URL и NEXTAUTH_SECRET${NC}"
        echo ""
        read -p "Продолжить? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    else
        echo -e "${RED}✗ Файл .env.example не найден!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Файл .env.local найден${NC}"
fi

# Проверка node_modules
echo ""
echo -e "${YELLOW}Проверка зависимостей...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ Папка node_modules не найдена${NC}"
    echo -e "${YELLOW}Устанавливаю зависимости...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Ошибка при установке зависимостей${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Зависимости установлены${NC}"
else
    echo -e "${GREEN}✓ Зависимости найдены${NC}"
fi

# Генерация Prisma клиента
echo ""
echo -e "${YELLOW}Генерация Prisma клиента...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Ошибка при генерации Prisma клиента${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prisma клиент сгенерирован${NC}"

# Запуск dev сервера
echo ""
echo "=================================="
echo "  Запуск сервера разработки..."
echo "=================================="
echo ""
echo -e "${GREEN}Сервер будет доступен по адресу: http://localhost:3000${NC}"
echo -e "${YELLOW}Для остановки нажмите Ctrl+C${NC}"
echo ""

npm run dev
