import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const imagesDir = path.join(__dirname, '../../generated-images');

  if (!fs.existsSync(imagesDir)) {
    console.error('generated-images directory not found!');
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir).filter(f =>
    f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp')
  );

  console.log(`\n🚀 Found ${files.length} images to upload to Cloudinary...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const sku = path.basename(file, path.extname(file)); // e.g., SRP-INC-001
    const filePath = path.join(imagesDir, file);
    const publicId = sku.toLowerCase().replace(/-/g, '_'); // e.g., srp_inc_001

    console.log(`⬆️  Uploading ${sku}...`);

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'pooja-stores/products',
        public_id: publicId,
        overwrite: true,
        transformation: [
          { width: 800, height: 800, crop: 'fill', gravity: 'center' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      console.log(`   ✅ Uploaded: ${result.secure_url}`);

      // Find product in DB
      const product = await prisma.product.findUnique({ where: { sku } });

      if (product) {
        // Delete old placeholder images
        await prisma.productImage.deleteMany({ where: { productId: product.id } });

        // Create real image
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: result.secure_url,
            publicId: result.public_id,
          }
        });
        console.log(`   ✅ DB updated for ${sku}\n`);
        successCount++;
      } else {
        console.warn(`   ⚠️  Product not found in DB for SKU: ${sku}\n`);
      }

    } catch (err) {
      console.error(`   ❌ Failed for ${sku}:`, (err as Error).message, '\n');
      failCount++;
    }
  }

  console.log('\n==============================');
  console.log(`✅ Success: ${successCount} products updated`);
  console.log(`❌ Failed:  ${failCount} products`);
  console.log('==============================\n');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
