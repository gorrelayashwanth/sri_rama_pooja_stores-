"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const products = await prisma.product.findMany({
        include: { images: true },
    });
    let updated = 0;
    for (const product of products) {
        const localUrl = `/images/products/${product.sku}.png`;
        if (product.images.length === 0) {
            await prisma.productImage.create({
                data: {
                    url: localUrl,
                    publicId: `local_${product.sku}`,
                    productId: product.id,
                },
            });
            updated++;
        }
        else {
            for (const img of product.images) {
                if (img.url.includes('via.placeholder.com') ||
                    img.url.includes('placeholder')) {
                    await prisma.productImage.update({
                        where: { id: img.id },
                        data: { url: localUrl, publicId: `local_${product.sku}` },
                    });
                    updated++;
                }
            }
        }
    }
    console.log(`Updated ${updated} product image records.`);
    console.log('Place product PNG files at: frontend/public/images/products/{SKU}.png');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
