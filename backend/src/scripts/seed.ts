import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with matching IDs...');

  // 1. Create Admin User
  const adminEmail = 'admin@sriramapooja.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created: admin@sriramapooja.com / admin123');
  }

  // 2. Create Categories with matching IDs for frontend fallbacks
  const categories = [
    { id: 'cat-1', name: 'Puja Items', slug: 'puja-items' },
    { id: 'cat-2', name: 'Idols & Frames', slug: 'idols-frames' },
    { id: 'cat-3', name: 'Incense & Oils', slug: 'incense-oils' },
    { id: 'cat-4', name: 'Festival Supplies', slug: 'festival-supplies' },
    { id: 'cat-5', name: 'Brassware', slug: 'brassware' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { id: cat.id }, // Force ID to match
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      },
    });
  }
  console.log('Categories seeded with matching IDs.');

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
