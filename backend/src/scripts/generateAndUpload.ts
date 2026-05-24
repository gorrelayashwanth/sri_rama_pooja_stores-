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

// Products to generate — only ones not yet done
const products = [
  { sku: 'SRP-FLR-002', prompt: 'A stunning garland made of artificial pink lotus flowers for Hindu temple puja decoration, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-FLR-003', prompt: 'An artificial green mango leaf toran hanging decoration for Hindu doorways, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-FLR-004', prompt: 'A highly realistic artificial green Tulsi holy basil plant in a small decorated terracotta pot, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-FLR-005', prompt: 'A heap of deep red dried rose petals scattered on a white surface for puja offerings, soft studio lighting, product photography 4K' },
  { sku: 'SRP-MLA-001', prompt: '108 brown natural Rudraksha bead mala coiled on white marble, one large guru bead visible, soft natural lighting, product photography 4K' },
  { sku: 'SRP-MLA-002', prompt: 'A delicate mala made of small light-brown Tulsi wood beads for japa meditation, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-MLA-003', prompt: 'A transparent sphatik crystal quartz bead mala catching light beautifully, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-MLA-004', prompt: 'A smooth light-brown sandalwood bead mala for prayer and meditation, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-MLA-005', prompt: 'A pure white circular cotton janeu sacred thread for Hindu rituals laid flat on clean surface, soft studio lighting, product photography 4K' },
  { sku: 'SRP-MLA-006', prompt: 'A spool of bright red and yellow intertwined kalava mauli cotton thread for Hindu ceremonies, soft studio lighting, product photography 4K' },
  { sku: 'SRP-MLA-007', prompt: 'A saffron-colored cloth gomukhi japa bag with embroidered Om symbol for hiding mala during chanting, soft studio lighting, product photography 4K' },
  { sku: 'SRP-FAB-001', prompt: 'A rectangular red velvet puja mat with intricate golden border laid flat, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-FAB-002', prompt: 'A shiny red satin cloth with heavy golden zari border softly draped for puja use, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-FAB-003', prompt: 'A small heavily embellished red velvet chunri dupatta with golden sequins and border for deity worship, soft studio lighting, product photography 4K' },
  { sku: 'SRP-FAB-004', prompt: 'A neatly folded white cotton dhoti with gold border alongside a matching angavastram for puja, soft studio lighting, product photography 4K' },
  { sku: 'SRP-FAB-005', prompt: 'A set of 9 brightly colored square cotton cloths folded neatly for Navgraha nine planets puja, soft studio lighting, product photography 4K' },
  { sku: 'SRP-KIT-001', prompt: 'A beautifully arranged Satyanarayan puja kit with incense camphor kumkum haldi flowers brass diya laid out on red cloth, warm light, product photography 4K' },
  { sku: 'SRP-KIT-002', prompt: 'A decorated red gift box containing Lakshmi Ganesha brass idols and Diwali puja essentials neatly arranged, soft studio lighting, product photography 4K' },
  { sku: 'SRP-KIT-003', prompt: 'A puja kit for Ganesh Chaturthi with small clay Ganesha idol surrounded by puja items modak incense flowers, soft studio lighting, product photography 4K' },
  { sku: 'SRP-KIT-004', prompt: 'A colorful Navratri puja kit featuring a red chunri dupatta coconut brass kalash and puja items, soft studio lighting, product photography 4K' },
  { sku: 'SRP-KIT-005', prompt: 'A large comprehensive housewarming Griha Pravesh puja kit with brass items coconut and sacred items displayed on table, soft studio lighting, product photography 4K' },
  { sku: 'SRP-KIT-006', prompt: 'A South Indian Varalakshmi Vratam puja kit featuring a golden Devi face mask sacred items and flowers, soft studio lighting, product photography 4K' },
  { sku: 'SRP-KIT-007', prompt: 'A Shiva abhishekam puja kit containing vibhuti small lingam copper pot and bel patra leaves arranged neatly, soft studio lighting, product photography 4K' },
  { sku: 'SRP-LQD-001', prompt: 'A small sealed glass bottle of clear sacred Ganga holy water with a religious label, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-LQD-002', prompt: 'Five small transparent bottles containing milk curd honey ghee and sugar syrup for Panchamrit abhishekam arranged together, soft studio lighting, product photography 4K' },
  { sku: 'SRP-LQD-003', prompt: 'A pink-tinted bottle of pure rose gulab jal water with a fresh rose petal beside it, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-LQD-004', prompt: 'A large glass jar filled with rich yellow desi cow ghee for puja and cooking use, soft studio lighting, white background, product photography 4K' },
  { sku: 'SRP-SPR-001', prompt: 'A vibrant religious Hindu devotional booklet with colorful images of Gods on the cover for puja, soft studio lighting, product photography 4K' },
  { sku: 'SRP-SPR-002', prompt: 'A brightly colored wall-hanging Hindu panchangam almanac calendar with festival dates and Hindu months, soft studio lighting, product photography 4K' },
  { sku: 'SRP-SPR-003', prompt: 'A framed picture of Lord Ganesha with gold trim frame leaning against white background, soft studio lighting, product photography 4K' },
  { sku: 'SRP-SPR-004', prompt: '11 white spiral-patterned Gomati Chakra sacred shells arranged on red cloth for rituals, soft studio lighting, product photography 4K' },
  { sku: 'SRP-SPR-005', prompt: 'A flat copper plate engraved with complex Sri Yantra sacred geometry for worship, soft studio lighting, product photography 4K' },
  { sku: 'SRP-DCR-001', prompt: 'A small intricately carved wooden wall-hanging home temple mandir with pillars and arch for puja room, soft studio lighting, product photography 4K' },
  { sku: 'SRP-DCR-002', prompt: 'Several circular plastic rangoli stencils with intricate floral cut-out patterns for making rangoli designs, soft studio lighting, product photography 4K' },
  { sku: 'SRP-DCR-003', prompt: 'A wide shallow brass urli bowl filled with water and floating pink lotus flowers and lit floating candles, soft studio lighting, product photography 4K' },
  { sku: 'SRP-DCR-004', prompt: 'An assembled adjustable metal backdrop stand with decorative fabric draped behind a home altar for puja, soft studio lighting, product photography 4K' },
  { sku: 'SRP-DCR-005', prompt: 'A polished wooden plaque with Pooja Room engraved in elegant gold lettering for door hanging, soft studio lighting, product photography 4K' },
  { sku: 'SRP-SUB-001', prompt: 'A neat cardboard subscription box filled with packets of incense sticks camphor wicks kumkum and haldi powders for monthly delivery, soft studio lighting, product photography 4K' },
];

function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        fetchImageBuffer(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function generateAndUpload(sku: string, prompt: string): Promise<void> {
  const publicId = sku.toLowerCase().replace(/-/g, '_');
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&model=flux&nologo=true&seed=${Math.floor(Math.random() * 9999)}`;

  console.log(`\n🎨 Generating ${sku}...`);

  try {
    // Upload directly from Pollinations URL to Cloudinary
    const result = await cloudinary.uploader.upload(pollinationsUrl, {
      folder: 'pooja-stores/products',
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'center' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    console.log(`   ✅ Uploaded: ${result.secure_url}`);

    // Update DB
    const product = await prisma.product.findUnique({ where: { sku } });
    if (product) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.create({
        data: { productId: product.id, url: result.secure_url, publicId: result.public_id }
      });
      console.log(`   ✅ DB updated for ${sku}`);
    } else {
      console.warn(`   ⚠️  Product not found in DB for ${sku}`);
    }
  } catch (err) {
    console.error(`   ❌ Failed for ${sku}:`, (err as Error).message);
  }
}

async function main() {
  console.log(`\n🚀 Generating & uploading ${products.length} images via Pollinations.ai (FLUX model)...\n`);
  let success = 0;
  for (const p of products) {
    await generateAndUpload(p.sku, p.prompt);
    success++;
    // Small delay to be polite to the free API
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`\n✅ Done! ${success}/${products.length} products generated and uploaded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
