/**
 * Скрипт для удаления пользователя из базы данных
 * Использование: node scripts/delete-user.js <user-id>
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUser(userId) {
  console.log(`Starting deletion of user: ${userId}`);

  try {
    // Get user info first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    console.log(`User found: ${user.name} (${user.email})`);
    console.log('');

    // Delete in transaction
    await prisma.$transaction(async (tx) => {
      // Check and delete related records
      const calculations = await tx.calculation.count({ where: { userId } });
      console.log(`Deleting ${calculations} calculations...`);
      await tx.calculation.deleteMany({ where: { userId } });

      const purchases = await tx.purchase.count({ where: { userId } });
      console.log(`Deleting ${purchases} purchases...`);
      await tx.purchase.deleteMany({ where: { userId } });

      const orders = await tx.order.count({ where: { userId } });
      console.log(`Deleting ${orders} orders...`);
      await tx.order.deleteMany({ where: { userId } });

      const arcana = await tx.collectedArcana.count({ where: { userId } });
      console.log(`Deleting ${arcana} collected arcana...`);
      await tx.collectedArcana.deleteMany({ where: { userId } });

      const resetTokens = await tx.passwordResetToken.count({ where: { userId } });
      console.log(`Deleting ${resetTokens} password reset tokens...`);
      await tx.passwordResetToken.deleteMany({ where: { userId } });

      const verifyTokens = await tx.emailVerificationToken.count({ where: { userId } });
      console.log(`Deleting ${verifyTokens} email verification tokens...`);
      await tx.emailVerificationToken.deleteMany({ where: { userId } });

      const twoFactor = await tx.twoFactorAuth.count({ where: { userId } });
      console.log(`Deleting ${twoFactor} two factor auth...`);
      await tx.twoFactorAuth.deleteMany({ where: { userId } });

      const oauth = await tx.oAuthProvider.count({ where: { userId } });
      console.log(`Deleting ${oauth} OAuth providers...`);
      await tx.oAuthProvider.deleteMany({ where: { userId } });

      const securityLogs = await tx.securityLog.count({ where: { userId } });
      console.log(`Deleting ${securityLogs} security logs...`);
      await tx.securityLog.deleteMany({ where: { userId } });

      const sessions = await tx.session.count({ where: { userId } });
      console.log(`Deleting ${sessions} sessions...`);
      await tx.session.deleteMany({ where: { userId } });

      // Check AdminLog
      const adminLogs = await tx.adminLog.count({ where: { adminId: userId } });
      console.log(`Found ${adminLogs} admin logs created by this user`);
      if (adminLogs > 0) {
        console.log('Note: AdminLog entries will remain but user will be deleted');
      }

      // Delete user
      console.log('Deleting user...');
      await tx.user.delete({ where: { id: userId } });

      console.log('✅ User deleted successfully!');
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

// Get user ID from command line
const userId = process.argv[2];

if (!userId) {
  console.error('Usage: node scripts/delete-user.js <user-id>');
  process.exit(1);
}

deleteUser(userId)
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
