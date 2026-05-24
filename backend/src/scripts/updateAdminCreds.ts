import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdmin() {
  const newEmail = 'sriramapoojastores@admin.com';
  const newPassword = 'admin123';
  const passwordHash = await bcrypt.hash(newPassword, 12);

  console.log(`Updating/Creating admin user: ${newEmail}`);

  // Remove legacy admin accounts with old emails
  const legacyEmails = [
    'sriramapoojastores@gmail.com',
    'admin@sriramapooja.com',
  ];
  for (const email of legacyEmails) {
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
  }

  const user = await prisma.user.upsert({
    where: { email: newEmail },
    update: {
      passwordHash,
      role: 'CHIEF_ADMIN',
      emailVerified: true,
    },
    create: {
      name: 'Sri Rama Pooja Stores Admin',
      email: newEmail,
      passwordHash,
      role: 'CHIEF_ADMIN',
      emailVerified: true,
    },
  });

  console.log('--- ADMIN UPDATED SUCCESSFULLY ---');
  console.log('Email:', user.email);
  console.log('Role:', user.role);
}

updateAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
