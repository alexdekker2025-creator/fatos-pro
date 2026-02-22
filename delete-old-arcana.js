// Скрипт для удаления старых статей арканов
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteOldArcana() {
  try {
    console.log('🔍 Проверка текущего состояния...\n');
    
    const totalBefore = await prisma.article.count({
      where: { category: 'Arcana (Cards)' }
    });
    
    console.log(`📊 Всего статей арканов: ${totalBefore}`);
    
    // Удаляем старые статьи (те, у которых короткий контент без emoji)
    console.log('\n🗑️  Удаление старых статей...');
    
    const result = await prisma.article.deleteMany({
      where: {
        category: 'Arcana (Cards)',
        content: {
          // Старые статьи не содержат emoji 🌅
          not: {
            contains: '🌅'
          }
        }
      }
    });
    
    console.log(`✅ Удалено статей: ${result.count}`);
    
    const totalAfter = await prisma.article.count({
      where: { category: 'Arcana (Cards)' }
    });
    
    console.log(`📊 Осталось статей: ${totalAfter}`);
    console.log(`✅ Ожидается: 44 статьи (22 аркана × 2 языка)\n`);
    
    if (totalAfter === 44) {
      console.log('🎉 Отлично! Все старые статьи удалены, осталось ровно 44 новых статьи.');
    } else {
      console.log(`⚠️  Внимание: ожидалось 44 статьи, но осталось ${totalAfter}`);
    }
    
    // Проверяем, что остались только новые статьи с emoji
    const newArticles = await prisma.article.findMany({
      where: {
        category: 'Arcana (Cards)',
        content: {
          contains: '🌅'
        }
      },
      select: {
        relatedValue: true,
        language: true,
        title: true
      },
      orderBy: [
        { relatedValue: 'asc' },
        { language: 'asc' }
      ]
    });
    
    console.log('\n📋 Оставшиеся статьи (первые 5):');
    newArticles.slice(0, 5).forEach(article => {
      console.log(`  ${article.relatedValue} (${article.language}): ${article.title}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldArcana();
