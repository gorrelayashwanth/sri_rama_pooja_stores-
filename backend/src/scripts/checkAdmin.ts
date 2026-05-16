import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@sriramapooja.com' } });
  if (user) {
    console.log('--- USER FOUND ---');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Has Password Hash:', !!user.passwordHash);
  } else {
    console.log('--- USER NOT FOUND ---');
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
