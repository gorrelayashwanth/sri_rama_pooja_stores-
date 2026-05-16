import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  try {
    const count = await prisma.product.count();
    console.log('Product count:', count);
    const products = await prisma.product.findMany({ 
        take: 5, 
        include: { 
            images: true,
            category: true
        } 
    });
    console.log('Sample products:', JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error checking DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}
check();
