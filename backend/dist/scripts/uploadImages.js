"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path.join(__dirname, '../../.env') });
const prisma = new client_1.PrismaClient();
cloudinary_1.v2.config({
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
    const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp'));
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
            const result = await cloudinary_1.v2.uploader.upload(filePath, {
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
            }
            else {
                console.warn(`   ⚠️  Product not found in DB for SKU: ${sku}\n`);
            }
        }
        catch (err) {
            console.error(`   ❌ Failed for ${sku}:`, err.message, '\n');
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
