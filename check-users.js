const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('\n📋 Список пользователей в базе данных:\n');
    
    if (users.length === 0) {
      console.log('❌ Пользователи не найдены!');
      console.log('\n💡 Чтобы войти в админ-панель:');
      console.log('   1. Зарегистрируйтесь на сайте: http://localhost:3002/ru');
      console.log('   2. Затем выполните: node make-admin.js ваш@email.com');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.isAdmin ? '👑 ADMIN' : '👤 USER'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Имя: ${user.name || 'Не указано'}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Создан: ${user.createdAt.toLocaleString('ru-RU')}`);
        console.log('');
      });

      const admins = users.filter(u => u.isAdmin);
      if (admins.length === 0) {
        console.log('⚠️  Администраторы не назначены!');
        console.log('\n💡 Чтобы назначить администратора:');
        console.log(`   node make-admin.js ${users[0].email}`);
      } else {
        console.log(`✅ Найдено администраторов: ${admins.length}`);
      }
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
