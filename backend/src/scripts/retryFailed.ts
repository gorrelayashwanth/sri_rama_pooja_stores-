import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Final 6 failed products with much simpler prompts to avoid 402/timeouts
const products = [
  { sku: 'SRP-KIT-002', prompt: 'A Diwali puja gift box with Lakshmi Ganesha idols' },
  { sku: 'SRP-KIT-005', prompt: 'A housewarming Griha Pravesh puja kit' },
  { sku: 'SRP-KIT-006', prompt: 'A South Indian Varalakshmi Vratam puja kit' },
  { sku: 'SRP-LQD-002', prompt: 'Five small bottles for Panchamrit abhishekam' },
  { sku: 'SRP-LQD-003', prompt: 'A pink bottle of pure rose water gulab jal' },
  { sku: 'SRP-DCR-001', prompt: 'A carved wooden wall-hanging home temple mandir' }
];

async function generateAndUpload(sku: string, prompt: string, attempt: number = 1): Promise<boolean> {
  const publicId = sku.toLowerCase().replace(/-/g, '_');
  const seed = Math.floor(Math.random() * 99999);
  // Using an alternate provider to ensure we don't hit rate limits, or just a very simple Pollinations URL
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&model=flux&nologo=true&seed=${seed}`;

  console.log(`\n🎨 [Attempt ${attempt}] Generating ${sku}...`);

  try {
    const result = await cloudinary.uploader.upload(pollinationsUrl, {
      folder: 'pooja-stores/products',
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'center' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      timeout: 120000
    });

    console.log(`   ✅ Uploaded: ${result.secure_url}`);

    const product = await prisma.product.findUnique({ where: { sku } });
    if (product) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.create({
        data: { productId: product.id, url: result.secure_url, publicId: result.public_id }
      });
      console.log(`   ✅ DB updated for ${sku}`);
      return true;
    }
  } catch (err) {
    const msg = (err as Error).message;
    console.error(`   ❌ Attempt ${attempt} failed for ${sku}: ${msg}`);
    if (attempt < 5) { // 5 retries this time
      const delay = attempt * 5000;
      console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
      return generateAndUpload(sku, prompt, attempt + 1);
    }
  }
  return false;
}

async function main() {
  console.log(`\n🔁 Retrying the final ${products.length} products...\n`);
  let success = 0;
  const failed: string[] = [];

  for (const p of products) {
    const ok = await generateAndUpload(p.sku, p.prompt);
    if (ok) success++;
    else failed.push(p.sku);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n==============================');
  console.log(`✅ Success: ${success}/${products.length}`);
  if (failed.length) console.log(`❌ Still failed: ${failed.join(', ')}`);
  console.log('==============================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
