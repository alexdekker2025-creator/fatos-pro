const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin(email) {
  try {
    if (!email) {
      console.log('❌ Укажите email пользователя!');
      console.log('Использование: node make-admin.js email@example.com');
      process.exit(1);
    }

    console.log(`\n🔍 Поиск пользователя с email: ${email}...`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`❌ Пользователь с email ${email} не найден!`);
      console.log('\n💡 Сначала зарегистрируйтесь на сайте: http://localhost:3002/ru');
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log(`ℹ️  Пользователь ${user.name || user.email} уже является администратором!`);
      console.log(`\n✅ Можете войти в админ-панель: http://localhost:3002/ru/admin`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log('✅ Успешно! Пользователь назначен администратором:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Имя: ${user.name || 'Не указано'}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Администратор: Да`);
    console.log(`\n🎉 Теперь можете войти в админ-панель: http://localhost:3002/ru/admin`);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
makeAdmin(email);
