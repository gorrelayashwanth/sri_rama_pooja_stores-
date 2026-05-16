import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdmin() {
  const newEmail = 'sriramapoojastores@gmail.com';
  const newPassword = 'srirama@admin';
  const passwordHash = await bcrypt.hash(newPassword, 12);

  console.log(`Updating/Creating admin user: ${newEmail}`);

  const user = await prisma.user.upsert({
    where: { email: newEmail },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'Sri Rama Pooja Stores Admin',
      email: newEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('--- ADMIN UPDATED SUCCESSFULLY ---');
  console.log('Email:', user.email);
  console.log('Role:', user.role);
}

updateAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
