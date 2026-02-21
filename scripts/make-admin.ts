/**
 * Скрипт для назначения роли администратора пользователю
 * 
 * Использование:
 * npx ts-node scripts/make-admin.ts <email>
 * 
 * Пример:
 * npx ts-node scripts/make-admin.ts admin@fatos.pro
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    console.log(`\n🔍 Поиск пользователя с email: ${email}...`);

    // Находим пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Пользователь с email ${email} не найден!`);
      console.log('\n💡 Убедитесь, что:');
      console.log('   1. Email указан правильно');
      console.log('   2. Пользователь зарегистрирован в системе');
      process.exit(1);
    }

    // Проверяем, не является ли пользователь уже администратором
    if (user.isAdmin) {
      console.log(`ℹ️  Пользователь ${user.name} (${email}) уже является администратором`);
      process.exit(0);
    }

    // Назначаем роль администратора
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log(`✅ Успешно! Пользователь назначен администратором:`);
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Имя: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Администратор: ${updatedUser.isAdmin ? 'Да' : 'Нет'}`);
    console.log(`\n🎉 Теперь пользователь может получить доступ к /admin`);

  } catch (error) {
    console.error('❌ Ошибка при назначении роли администратора:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Получаем email из аргументов командной строки
const email = process.argv[2];

if (!email) {
  console.error('❌ Ошибка: не указан email пользователя');
  console.log('\n📖 Использование:');
  console.log('   npx ts-node scripts/make-admin.ts <email>');
  console.log('\n📝 Пример:');
  console.log('   npx ts-node scripts/make-admin.ts admin@fatos.pro');
  process.exit(1);
}

// Запускаем скрипт
makeAdmin(email);
