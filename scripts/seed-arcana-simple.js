/**
 * Простой скрипт для загрузки статей арканов
 * Выполнение: node scripts/seed-arcana-simple.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Данные статей арканов
const arcanaArticles = [
  // Аркан 1
  {
    id: 'arcana_1_ru',
    category: 'Arcana (Cards)',
    language: 'ru',
    title: 'Аркан 1: Маг',
    content: 'Сегодня вы полны энергии и возможностей. Маг символизирует начало новых дел, творческую силу и умение воплощать идеи в реальность. Используйте свои таланты и навыки для достижения целей. Это время действовать решительно и уверенно.',
    relatedValue: 'arcana_1',
  },
  {
    id: 'arcana_1_en',
    category: 'Arcana (Cards)',
    language: 'en',
    title: 'Arcana 1: The Magician',
    content: 'Today you are full of energy and possibilities. The Magician symbolizes the beginning of new endeavors, creative power, and the ability to manifest ideas into reality. Use your talents and skills to achieve your goals. This is a time to act decisively and confidently.',
    relatedValue: 'arcana_1',
  },
  // Аркан 2
  {
    id: 'arcana_2_ru',
    category: 'Arcana (Cards)',
    language: 'ru',
    title: 'Аркан 2: Верховная Жрица',
    content: 'День интуиции и внутренней мудрости. Прислушайтесь к своему внутреннему голосу, доверьтесь предчувствиям. Сегодня важно не спешить с решениями, а дать себе время для размышлений. Тайны могут раскрыться, если вы будете внимательны.',
    relatedValue: 'arcana_2',
  },
  {
    id: 'arcana_2_en',
    category: 'Arcana (Cards)',
    language: 'en',
    title: 'Arcana 2: The High Priestess',
    content: 'A day of intuition and inner wisdom. Listen to your inner voice, trust your premonitions. Today it is important not to rush decisions, but to give yourself time to reflect. Secrets may be revealed if you are attentive.',
    relatedValue: 'arcana_2',
  },
  // Добавьте остальные арканы здесь...
];

async function main() {
  console.log('🌟 Начинаем загрузку статей арканов...');

  let successCount = 0;
  let skipCount = 0;

  for (const article of arcanaArticles) {
    try {
      await prisma.article.upsert({
        where: { id: article.id },
        update: article,
        create: article,
      });
      successCount++;
      console.log(`✅ Загружена: ${article.title}`);
    } catch (error) {
      skipCount++;
      console.log(`⚠️  Пропущена: ${article.title}`);
    }
  }

  const totalArticles = await prisma.article.count({
    where: { category: 'Arcana (Cards)' },
  });

  console.log('\n📊 Статистика:');
  console.log(`   - Успешно: ${successCount}`);
  console.log(`   - Пропущено: ${skipCount}`);
  console.log(`   - Всего в БД: ${totalArticles}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
