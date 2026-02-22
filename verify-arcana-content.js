// Проверка содержимого статей арканов
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyArcanaContent() {
  try {
    console.log('🔍 Проверка содержимого статей арканов...\n');
    
    // Получаем одну статью для детальной проверки
    const article = await prisma.article.findFirst({
      where: {
        category: 'Arcana (Cards)',
        relatedValue: 'arcana_1',
        language: 'ru'
      }
    });
    
    if (!article) {
      console.log('❌ Статья не найдена!');
      return;
    }
    
    console.log('📄 Статья: ' + article.title);
    console.log('🔗 Связанное значение: ' + article.relatedValue);
    console.log('🌐 Язык: ' + article.language);
    console.log('📏 Длина контента: ' + article.content.length + ' символов\n');
    
    // Проверяем наличие всех 4 разделов
    const hasMorning = article.content.includes('🌅 УТРО') || article.content.includes('🌅 MORNING');
    const hasDay = article.content.includes('☀️ ДЕНЬ') || article.content.includes('☀️ DAY');
    const hasEvening = article.content.includes('🌇 ВЕЧЕР') || article.content.includes('🌇 EVENING');
    const hasNight = article.content.includes('🌙 НОЧЬ') || article.content.includes('🌙 NIGHT');
    
    console.log('✅ Проверка разделов:');
    console.log(`  ${hasMorning ? '✓' : '✗'} Утро (🌅)`);
    console.log(`  ${hasDay ? '✓' : '✗'} День (☀️)`);
    console.log(`  ${hasEvening ? '✓' : '✗'} Вечер (🌇)`);
    console.log(`  ${hasNight ? '✓' : '✗'} Ночь (🌙)`);
    
    if (hasMorning && hasDay && hasEvening && hasNight) {
      console.log('\n🎉 Отлично! Все 4 раздела присутствуют.');
    } else {
      console.log('\n⚠️  Внимание: не все разделы найдены!');
    }
    
    console.log('\n📝 Полное содержимое статьи:');
    console.log('─'.repeat(80));
    console.log(article.content);
    console.log('─'.repeat(80));
    
    // Проверяем все статьи
    console.log('\n🔍 Проверка всех статей...');
    const allArticles = await prisma.article.findMany({
      where: {
        category: 'Arcana (Cards)'
      }
    });
    
    let validCount = 0;
    let invalidArticles = [];
    
    allArticles.forEach(a => {
      const hasMorning = a.content.includes('🌅');
      const hasDay = a.content.includes('☀️');
      const hasEvening = a.content.includes('🌇');
      const hasNight = a.content.includes('🌙');
      
      if (hasMorning && hasDay && hasEvening && hasNight) {
        validCount++;
      } else {
        invalidArticles.push(`${a.relatedValue} (${a.language})`);
      }
    });
    
    console.log(`\n✅ Валидных статей: ${validCount} из ${allArticles.length}`);
    
    if (invalidArticles.length > 0) {
      console.log('\n⚠️  Статьи с неполным содержимым:');
      invalidArticles.forEach(a => console.log(`  - ${a}`));
    } else {
      console.log('\n🎉 Все статьи содержат полные описания!');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyArcanaContent();
