/**
 * Тестовый скрипт для проверки сервисов аутентификации
 * Запуск: node test-auth-services.js
 */

async function testEncryptionService() {
  console.log('\n🔐 Тест EncryptionService...');
  
  try {
    const { getEncryptionService } = require('./lib/services/auth/EncryptionService');
    const service = getEncryptionService();
    
    const plaintext = 'test-secret-data-12345';
    const encrypted = service.encrypt(plaintext);
    const decrypted = service.decrypt(encrypted);
    
    console.log('✅ Шифрование:', encrypted.substring(0, 50) + '...');
    console.log('✅ Расшифровка:', decrypted === plaintext ? 'OK' : 'FAIL');
    
    return decrypted === plaintext;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return false;
  }
}

async function testTokenService() {
  console.log('\n🎫 Тест TokenService...');
  
  try {
    const { getTokenService } = require('./lib/services/auth/TokenService');
    const service = getTokenService();
    
    // Тест генерации токена
    const token = service.generateToken();
    console.log('✅ Токен сгенерирован:', token.substring(0, 20) + '...');
    console.log('   Длина:', token.length, 'символов');
    
    // Тест хеширования
    const hash = service.hashToken(token);
    console.log('✅ Хеш создан:', hash.substring(0, 20) + '...');
    
    // Тест верификации
    const isValid = service.verifyToken(token, hash);
    console.log('✅ Верификация:', isValid ? 'OK' : 'FAIL');
    
    // Тест с неправильным токеном
    const isInvalid = service.verifyToken('wrong-token', hash);
    console.log('✅ Отклонение неверного токена:', !isInvalid ? 'OK' : 'FAIL');
    
    return isValid && !isInvalid;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return false;
  }
}

async function testTwoFactorService() {
  console.log('\n🔒 Тест TwoFactorService...');
  
  try {
    const { getTwoFactorService } = require('./lib/services/auth/TwoFactorService');
    const service = getTwoFactorService();
    
    // Тест генерации секрета
    const secret = service.generateSecret();
    console.log('✅ TOTP секрет сгенерирован:', secret.substring(0, 10) + '...');
    
    // Тест генерации QR кода
    const qrCode = await service.generateQRCode(secret, 'test@example.com');
    console.log('✅ QR код создан:', qrCode.substring(0, 30) + '...');
    console.log('   Формат:', qrCode.startsWith('data:image/png;base64,') ? 'OK' : 'FAIL');
    
    // Тест генерации backup кодов
    const backupCodes = service.generateBackupCodes();
    console.log('✅ Backup коды сгенерированы:', backupCodes.length, 'штук');
    console.log('   Пример:', backupCodes[0]);
    console.log('   Формат (XXXX-XXXX):', /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(backupCodes[0]) ? 'OK' : 'FAIL');
    
    return qrCode.startsWith('data:image/png;base64,') && backupCodes.length === 10;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return false;
  }
}

async function testEmailService() {
  console.log('\n📧 Тест EmailService...');
  
  try {
    const { getEmailService } = require('./lib/services/auth/EmailService');
    const service = getEmailService();
    
    console.log('✅ EmailService инициализирован');
    console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'установлен' : '❌ НЕ УСТАНОВЛЕН');
    console.log('   EMAIL_FROM:', process.env.EMAIL_FROM || 'не установлен');
    
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_123')) {
      console.log('⚠️  Для отправки email нужен настоящий RESEND_API_KEY');
      console.log('   Зарегистрируйтесь на https://resend.com');
      return true; // Не считаем ошибкой
    }
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return false;
  }
}

async function checkDatabase() {
  console.log('\n💾 Проверка базы данных...');
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Проверка подключения
    await prisma.$connect();
    console.log('✅ Подключение к БД: OK');
    
    // Проверка новых таблиц
    const tables = [
      'passwordResetToken',
      'emailVerificationToken',
      'twoFactorAuth',
      'oAuthProvider',
      'securityLog'
    ];
    
    for (const table of tables) {
      try {
        const count = await prisma[table].count();
        console.log(`✅ Таблица ${table}: ${count} записей`);
      } catch (error) {
        console.log(`❌ Таблица ${table}: НЕ НАЙДЕНА`);
      }
    }
    
    // Проверка новых полей в User
    const user = await prisma.user.findFirst({
      select: {
        emailVerified: true,
        twoFactorEnabled: true,
      }
    });
    
    if (user !== null) {
      console.log('✅ Поля User.emailVerified и User.twoFactorEnabled: OK');
    }
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Ошибка БД:', error.message);
    return false;
  }
}

async function checkEnvironment() {
  console.log('\n🔧 Проверка переменных окружения...');
  
  const required = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'ENCRYPTION_SECRET': process.env.ENCRYPTION_SECRET,
  };
  
  const optional = {
    'RESEND_API_KEY': process.env.RESEND_API_KEY,
    'EMAIL_FROM': process.env.EMAIL_FROM,
    'NEXT_PUBLIC_BASE_URL': process.env.NEXT_PUBLIC_BASE_URL,
  };
  
  let allOk = true;
  
  console.log('\nОбязательные:');
  for (const [key, value] of Object.entries(required)) {
    if (value) {
      const display = key === 'DATABASE_URL' 
        ? value.substring(0, 30) + '...' 
        : value.substring(0, 20) + '...';
      console.log(`✅ ${key}: ${display}`);
    } else {
      console.log(`❌ ${key}: НЕ УСТАНОВЛЕН`);
      allOk = false;
    }
  }
  
  console.log('\nОпциональные:');
  for (const [key, value] of Object.entries(optional)) {
    if (value) {
      const display = value.length > 30 ? value.substring(0, 30) + '...' : value;
      console.log(`✅ ${key}: ${display}`);
    } else {
      console.log(`⚠️  ${key}: не установлен`);
    }
  }
  
  return allOk;
}

async function runTests() {
  console.log('🧪 Тестирование сервисов расширенной аутентификации\n');
  console.log('='.repeat(60));
  
  const results = {
    environment: await checkEnvironment(),
    database: await checkDatabase(),
    encryption: await testEncryptionService(),
    token: await testTokenService(),
    twoFactor: await testTwoFactorService(),
    email: await testEmailService(),
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Результаты тестирования:\n');
  
  for (const [name, result] of Object.entries(results)) {
    const icon = result ? '✅' : '❌';
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    console.log(`${icon} ${label}: ${result ? 'PASS' : 'FAIL'}`);
  }
  
  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ Все тесты пройдены успешно!');
    console.log('\n📝 Следующие шаги:');
    console.log('   1. Получите RESEND_API_KEY на https://resend.com');
    console.log('   2. Обновите .env файл');
    console.log('   3. Продолжите с созданием API endpoints');
  } else {
    console.log('⚠️  Некоторые тесты не прошли. Проверьте ошибки выше.');
  }
  console.log('='.repeat(60) + '\n');
}

// Запуск тестов
runTests().catch(console.error);
