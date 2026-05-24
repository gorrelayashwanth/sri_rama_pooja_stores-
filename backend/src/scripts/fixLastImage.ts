import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const url = 'https://image.pollinations.ai/prompt/a%20small%20bottle%20of%20pink%20rose%20water?width=800&height=800&model=flux&nologo=true&seed=999';
  const result = await cloudinary.uploader.upload(url, {
    folder: 'pooja-stores/products',
    public_id: 'srp_lqd_003',
    overwrite: true
  });
  const product = await prisma.product.findUnique({ where: { sku: 'SRP-LQD-003' } });
  if (!product) return;
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.create({
    data: { productId: product.id, url: result.secure_url, publicId: result.public_id }
  });
  console.log('✅ Final image fixed: ' + result.secure_url);
}
main().finally(() => prisma.$disconnect());
