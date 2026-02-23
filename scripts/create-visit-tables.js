/**
 * Скрипт для создания таблиц отслеживания посещений
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Создание таблиц для отслеживания посещений...');

  try {
    // Читаем SQL файл
    const sqlPath = path.join(__dirname, '..', 'prisma', 'create-visit-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Удаляем комментарии и разделяем SQL на отдельные команды
    const commands = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--')) // Удаляем строки с комментариями
      .join('\n')
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    // Выполняем каждую команду отдельно
    for (const command of commands) {
      if (command) {
        const preview = command.replace(/\s+/g, ' ').substring(0, 60);
        console.log(`Выполнение: ${preview}...`);
        await prisma.$executeRawUnsafe(command);
      }
    }

    console.log('✅ Таблицы успешно созданы!');
    console.log('');
    console.log('Созданные таблицы:');
    console.log('  - SiteVisit (для хранения посещений)');
    console.log('  - DailyStats (для дневной статистики)');
    console.log('');
    console.log('Теперь система отслеживания посещений готова к работе!');
  } catch (error) {
    console.error('❌ Ошибка при создании таблиц:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
