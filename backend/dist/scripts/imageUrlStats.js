"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const images = await prisma.productImage.findMany({ select: { url: true } });
    const stats = { cloudinary: 0, localProducts: 0, localSrp: 0, other: 0 };
    for (const { url } of images) {
        if (url.includes('cloudinary.com'))
            stats.cloudinary++;
        else if (url.startsWith('/images/products/'))
            stats.localProducts++;
        else if (url.startsWith('/images/srp_') || url.startsWith('/images/SRP'))
            stats.localSrp++;
        else
            stats.other++;
    }
    console.log(stats, 'total:', images.length);
    const others = images.filter((i) => !i.url.includes('cloudinary') && !i.url.startsWith('/images/products/'));
    others.slice(0, 10).forEach((i) => console.log(i.url));
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
