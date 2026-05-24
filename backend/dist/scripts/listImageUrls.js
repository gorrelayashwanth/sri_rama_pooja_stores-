"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const images = await prisma.productImage.findMany({ take: 30, select: { url: true } });
    const patterns = {};
    for (const img of images) {
        const key = img.url.startsWith('http') ? 'http' : img.url.startsWith('/images/') ? 'local' : 'other';
        patterns[key] = (patterns[key] || 0) + 1;
        console.log(img.url);
    }
    console.log('patterns sample:', patterns);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
