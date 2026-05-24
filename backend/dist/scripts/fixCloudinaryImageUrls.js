"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CLOUDINARY_BASE = 'https://res.cloudinary.com/ddslkpq4w/image/upload/pooja-stores/products';
/** Convert /images/srp_inc_001_1234567890.png → Cloudinary URL */
function toCloudinaryUrl(localPath) {
    const match = localPath.match(/\/images\/(srp_[a-z]+_\d+)_\d+\.\w+$/i);
    if (match) {
        return `${CLOUDINARY_BASE}/${match[1].toLowerCase()}.jpg`;
    }
    return null;
}
async function main() {
    const images = await prisma.productImage.findMany({
        where: { url: { startsWith: '/images/srp_' } },
    });
    let fixed = 0;
    let skipped = 0;
    for (const img of images) {
        const cloudUrl = toCloudinaryUrl(img.url);
        if (cloudUrl) {
            await prisma.productImage.update({
                where: { id: img.id },
                data: { url: cloudUrl },
            });
            fixed++;
            console.log(`Fixed: ${img.url} → ${cloudUrl}`);
        }
        else {
            skipped++;
            console.log(`Skipped (no match): ${img.url}`);
        }
    }
    // Fix /images/products/SRP-*.png paths → lowercase srp_* on Cloudinary
    const skuImages = await prisma.productImage.findMany({
        where: { url: { startsWith: '/images/products/' } },
        include: { product: { select: { sku: true } } },
    });
    for (const img of skuImages) {
        const sku = img.product.sku;
        const code = sku
            .replace(/^SRP-/i, '')
            .replace(/-/g, '_')
            .toLowerCase();
        const cloudUrl = `${CLOUDINARY_BASE}/srp_${code}.jpg`;
        await prisma.productImage.update({
            where: { id: img.id },
            data: { url: cloudUrl },
        });
        fixed++;
        console.log(`Fixed SKU path: ${sku} → ${cloudUrl}`);
    }
    console.log(`\nDone. Fixed: ${fixed}, Skipped: ${skipped}`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
