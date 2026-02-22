// Тест функции извлечения контента по времени суток
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Функция для извлечения нужной части описания
function extractTimeOfDayContent(fullContent, timeOfDay, locale = 'ru') {
  const patterns = {
    morning: locale === 'ru' ? '🌅 УТРО' : '🌅 MORNING',
    day: locale === 'ru' ? '☀️ ДЕНЬ' : '☀️ DAY',
    evening: locale === 'ru' ? '🌇 ВЕЧЕР' : '🌇 EVENING',
    night: locale === 'ru' ? '🌙 НОЧЬ' : '🌙 NIGHT'
  };

  const currentPattern = patterns[timeOfDay];
  const allPatterns = Object.values(patterns);
  
  // Находим начало нужного раздела
  const startIndex = fullContent.indexOf(currentPattern);
  if (startIndex === -1) return fullContent; // Если не найден, возвращаем весь текст
  
  // Находим начало следующего раздела
  let endIndex = fullContent.length;
  for (const pattern of allPatterns) {
    if (pattern === currentPattern) continue;
    const nextIndex = fullContent.indexOf(pattern, startIndex + 1);
    if (nextIndex !== -1 && nextIndex < endIndex) {
      endIndex = nextIndex;
    }
  }
  
  // Извлекаем текст и убираем заголовок раздела
  let extracted = fullContent.substring(startIndex, endIndex).trim();
  extracted = extracted.replace(currentPattern, '').trim();
  
  return extracted;
}

async function testContentExtraction() {
  try {
    console.log('🔍 Тестирование извлечения контента по времени суток...\n');
    
    // Получаем статью для теста
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
    
    console.log('📄 Тестируем статью: ' + article.title);
    console.log('─'.repeat(80));
    console.log('Полный контент:');
    console.log(article.content);
    console.log('─'.repeat(80));
    console.log('\n');
    
    // Тестируем извлечение для каждого времени суток
    const timesOfDay = ['morning', 'day', 'evening', 'night'];
    const labels = {
      morning: 'Утро',
      day: 'День',
      evening: 'Вечер',
      night: 'Ночь'
    };
    
    timesOfDay.forEach(timeOfDay => {
      console.log(`\n🕐 ${labels[timeOfDay].toUpperCase()}`);
      console.log('─'.repeat(80));
      const extracted = extractTimeOfDayContent(article.content, timeOfDay, 'ru');
      console.log(extracted);
      console.log('─'.repeat(80));
      console.log(`Длина: ${extracted.length} символов\n`);
    });
    
    console.log('\n✅ Тест завершен!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testContentExtraction();
