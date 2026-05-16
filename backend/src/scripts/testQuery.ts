import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testQuery() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      price: {
        gte: 0,
        lte: 10000
      }
    }
  });
  console.log('Found:', products.length);
  await prisma.$disconnect();
}
testQuery();
