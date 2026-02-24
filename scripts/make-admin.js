/**
 * Скрипт для назначения пользователя администратором
 * Использование: node scripts/make-admin.js <email>
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin(email) {
  console.log(`Making user admin: ${email}`);
  console.log('');

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      }
    });

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log('✅ User is already an admin');
      return;
    }

    // Update user to admin
    await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log('✅ User is now an admin!');
    console.log('');
    console.log('User details:');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Admin:', '✅ YES');
    console.log('');
    console.log('Please log out and log in again for changes to take effect.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/make-admin.js <email>');
  console.error('Example: node scripts/make-admin.js admin@example.com');
  process.exit(1);
}

makeAdmin(email)
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
