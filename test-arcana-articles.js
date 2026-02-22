// Тестовый скрипт для проверки загрузки статей арканов
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testArcanaArticles() {
  try {
    console.log('🔍 Проверка статей арканов в базе данных...\n');
    
    // Получаем все статьи категории "Arcana (Cards)"
    const articles = await prisma.article.findMany({
      where: {
        category: 'Arcana (Cards)'
      },
      orderBy: [
        { relatedValue: 'asc' },
        { language: 'asc' }
      ]
    });
    
    console.log(`📊 Всего статей: ${articles.length}`);
    console.log(`✅ Ожидается: 44 статьи (22 аркана × 2 языка)\n`);
    
    // Группируем по relatedValue
    const byArcana = {};
    articles.forEach(article => {
      if (!byArcana[article.relatedValue]) {
        byArcana[article.relatedValue] = [];
      }
      byArcana[article.relatedValue].push(article);
    });
    
    console.log('📋 Статьи по арканам:');
    for (let i = 1; i <= 22; i++) {
      const key = `arcana_${i}`;
      const arcanaArticles = byArcana[key] || [];
      const ru = arcanaArticles.find(a => a.language === 'ru');
      const en = arcanaArticles.find(a => a.language === 'en');
      
      const status = (ru && en) ? '✅' : '❌';
      console.log(`${status} Аркан ${i}: RU=${ru ? '✓' : '✗'} EN=${en ? '✓' : '✗'}`);
      
      if (ru) {
        console.log(`   RU: ${ru.title}`);
      }
      if (en) {
        console.log(`   EN: ${en.title}`);
      }
    }
    
    // Проверяем содержимое одной статьи
    if (articles.length > 0) {
      console.log('\n📄 Пример статьи (Аркан 1, RU):');
      const example = articles.find(a => a.relatedValue === 'arcana_1' && a.language === 'ru');
      if (example) {
        console.log(`Название: ${example.title}`);
        console.log(`Категория: ${example.category}`);
        console.log(`Язык: ${example.language}`);
        console.log(`Связанное значение: ${example.relatedValue}`);
        console.log(`Длина контента: ${example.content.length} символов`);
        console.log(`Первые 200 символов:\n${example.content.substring(0, 200)}...`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testArcanaArticles();
