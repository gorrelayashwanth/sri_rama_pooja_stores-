"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const products = await prisma.product.findMany({
        take: 5,
        include: { images: true, category: true },
        orderBy: { createdAt: 'desc' },
    });
    products.forEach((p) => {
        console.log(p.sku, p.name, p.isAvailable, p.images[0]?.url?.slice(0, 80));
    });
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
