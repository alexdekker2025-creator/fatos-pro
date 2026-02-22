/**
 * Скрипт для загрузки статей арканов в базу данных
 * 
 * Выполнение: npx ts-node prisma/seed-arcana.ts
 * или: npm run seed:arcana (если добавить в package.json)
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Начинаем загрузку статей арканов...');

  // Читаем SQL файл
  const sqlPath = path.join(__dirname, 'seed-arcana-articles.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

  // Разбиваем на отдельные INSERT запросы
  const insertStatements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.startsWith('INSERT INTO'));

  console.log(`📝 Найдено ${insertStatements.length} INSERT запросов`);

  let successCount = 0;
  let errorCount = 0;

  for (const statement of insertStatements) {
    try {
      // Выполняем каждый INSERT через Prisma raw query
      await prisma.$executeRawUnsafe(statement);
      successCount++;
    } catch (error) {
      // Игнорируем ошибки дубликатов (если статьи уже существуют)
      if (error instanceof Error && error.message.includes('unique constraint')) {
        console.log(`⚠️  Статья уже существует, пропускаем...`);
      } else {
        console.error(`❌ Ошибка при выполнении запроса:`, error);
        errorCount++;
      }
    }
  }

  // Проверяем количество статей в БД
  const totalArticles = await prisma.article.count({
    where: {
      category: 'Arcana (Cards)',
    },
  });

  console.log('\n✅ Загрузка завершена!');
  console.log(`📊 Статистика:`);
  console.log(`   - Успешно добавлено: ${successCount}`);
  console.log(`   - Ошибок: ${errorCount}`);
  console.log(`   - Всего статей арканов в БД: ${totalArticles}`);
  console.log(`   - Ожидается: 44 (22 аркана × 2 языка)`);

  if (totalArticles === 44) {
    console.log('\n🎉 Все статьи арканов успешно загружены!');
  } else if (totalArticles < 44) {
    console.log(`\n⚠️  Внимание: загружено меньше статей чем ожидалось (${totalArticles}/44)`);
  }
}

main()
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
