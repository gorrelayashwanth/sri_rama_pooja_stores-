import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findUnique({ where: { sku: 'SRP-DYA-001' } });
  if (!product) { console.log('Product SRP-DYA-001 not found'); return; }

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.create({
    data: {
      productId: product.id,
      url: 'https://res.cloudinary.com/ddslkpq4w/image/upload/v1779533678/pooja-stores/products/srp_dya_001.jpg',
      publicId: 'pooja-stores/products/srp_dya_001'
    }
  });
  console.log('✅ SRP-DYA-001 DB image fixed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
