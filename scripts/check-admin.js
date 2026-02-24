/**
 * Скрипт для проверки админских прав пользователя
 * Использование: node scripts/check-admin.js <email>
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin(email) {
  console.log(`Checking admin status for: ${email}`);
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
        emailVerified: true,
        isBlocked: true,
        createdAt: true,
      }
    });

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    console.log('User found:');
    console.log('  ID:', user.id);
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Is Admin:', user.isAdmin ? '✅ YES' : '❌ NO');
    console.log('  Email Verified:', user.emailVerified ? '✅ YES' : '❌ NO');
    console.log('  Is Blocked:', user.isBlocked ? '❌ YES' : '✅ NO');
    console.log('  Created:', user.createdAt.toISOString());
    console.log('');

    // Check active sessions
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expiresAt: {
          gte: new Date(),
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    console.log(`Active sessions: ${sessions.length}`);
    sessions.forEach((session, index) => {
      console.log(`  ${index + 1}. Session ID: ${session.id}`);
      console.log(`     Created: ${session.createdAt.toISOString()}`);
      console.log(`     Expires: ${session.expiresAt.toISOString()}`);
    });
    console.log('');

    // If not admin, offer to make admin
    if (!user.isAdmin) {
      console.log('⚠️  User is NOT an admin');
      console.log('');
      console.log('To make this user an admin, run:');
      console.log(`node scripts/make-admin.js ${email}`);
    } else {
      console.log('✅ User has admin privileges');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/check-admin.js <email>');
  console.error('Example: node scripts/check-admin.js admin@example.com');
  process.exit(1);
}

checkAdmin(email)
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
