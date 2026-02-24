/**
 * Script to set admin rights for a user
 * Usage: node scripts/set-admin.js <email>
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setAdmin(email) {
  try {
    console.log(`Setting admin rights for: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    console.log('Current user status:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Is Admin: ${user.isAdmin}`);

    if (user.isAdmin) {
      console.log('\nUser is already an admin!');
    } else {
      console.log('\nUpdating user to admin...');
      
      await prisma.user.update({
        where: { email },
        data: { isAdmin: true },
      });

      console.log('✓ User is now an admin!');
    }

    // Verify
    const updatedUser = await prisma.user.findUnique({
      where: { email },
      select: { isAdmin: true },
    });

    console.log(`\nFinal status: isAdmin = ${updatedUser?.isAdmin}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin.js <email>');
  process.exit(1);
}

setAdmin(email);
