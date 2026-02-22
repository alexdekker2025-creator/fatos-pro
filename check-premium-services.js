// Скрипт для проверки премиум услуг в базе данных
// Использование: node check-premium-services.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPremiumServices() {
  try {
    console.log('🔍 Проверка премиум услуг в базе данных...\n');

    // Получаем все активные услуги
    const services = await prisma.premiumService.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    console.log(`✅ Найдено активных услуг: ${services.length}\n`);

    if (services.length === 0) {
      console.log('⚠️  База данных пуста!');
      console.log('📝 Выполните SQL миграцию: prisma/update-premium-services.sql\n');
      return;
    }

    // Проверяем каждую услугу
    console.log('📋 Список услуг:\n');
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.titleRu} (${service.serviceId})`);
      console.log(`   СТАРТ: ${service.priceBasicRUB}₽ / $${service.priceBasicUSD}`);
      console.log(`   ГЛУБОКИЙ: ${service.priceFullRUB}₽ / $${service.priceFullUSD}`);
      console.log(`   Hook: "${service.hookRu}"`);
      console.log(`   Features Basic: ${service.featuresBasic.length} пунктов`);
      console.log(`   Features Full: ${service.featuresFull ? service.featuresFull.length : 0} пунктов`);
      console.log('');
    });

    // Проверяем ожидаемые цены
    console.log('🔍 Проверка цен:\n');
    const expectedPrices = {
      'destiny_matrix': { basic: 3500, full: 5500 },
      'child_numerology': { basic: 2900, full: 4900 },
      'compatibility': { basic: 3900, full: 5900 },
      'money_numerology': { basic: 3900, full: 5900 },
      'yearly_forecast': { basic: 4900, full: 6900 },
      'pythagorean_full': { basic: 2900, full: 4900 },
      'pro_access': { basic: 500, full: 2500 },
    };

    let allPricesCorrect = true;
    services.forEach(service => {
      const expected = expectedPrices[service.serviceId];
      if (expected) {
        const basicCorrect = service.priceBasicRUB === expected.basic;
        const fullCorrect = service.priceFullRUB === expected.full;
        
        if (!basicCorrect || !fullCorrect) {
          console.log(`❌ ${service.titleRu}:`);
          if (!basicCorrect) {
            console.log(`   СТАРТ: ожидалось ${expected.basic}₽, получено ${service.priceBasicRUB}₽`);
          }
          if (!fullCorrect) {
            console.log(`   ГЛУБОКИЙ: ожидалось ${expected.full}₽, получено ${service.priceFullRUB}₽`);
          }
          allPricesCorrect = false;
        } else {
          console.log(`✅ ${service.titleRu}: цены корректны`);
        }
      }
    });

    console.log('');
    if (allPricesCorrect) {
      console.log('✅ Все цены соответствуют ожидаемым значениям!');
    } else {
      console.log('⚠️  Некоторые цены не соответствуют ожидаемым значениям');
    }

    // Проверяем наличие hookRu/hookEn
    console.log('\n🔍 Проверка описаний (hook):\n');
    let allHooksPresent = true;
    services.forEach(service => {
      const hasHookRu = service.hookRu && service.hookRu.length > 0;
      const hasHookEn = service.hookEn && service.hookEn.length > 0;
      
      if (!hasHookRu || !hasHookEn) {
        console.log(`❌ ${service.titleRu}: отсутствует hook`);
        if (!hasHookRu) console.log('   - hookRu пустой');
        if (!hasHookEn) console.log('   - hookEn пустой');
        allHooksPresent = false;
      } else {
        console.log(`✅ ${service.titleRu}: hook присутствует`);
      }
    });

    console.log('');
    if (allHooksPresent) {
      console.log('✅ Все услуги имеют описания (hook)!');
    } else {
      console.log('⚠️  У некоторых услуг отсутствуют описания');
    }

    console.log('\n✅ Проверка завершена!');

  } catch (error) {
    console.error('❌ Ошибка при проверке:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPremiumServices();
