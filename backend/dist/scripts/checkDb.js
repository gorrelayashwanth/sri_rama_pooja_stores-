"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const categories = await prisma.category.count();
    const products = await prisma.product.count();
    const withImages = await prisma.product.count({
        where: { images: { some: {} } },
    });
    const admin = await prisma.user.findUnique({
        where: { email: 'sriramapoojastores@admin.com' },
        select: { email: true, role: true },
    });
    console.log(JSON.stringify({ categories, products, withImages, admin }, null, 2));
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
