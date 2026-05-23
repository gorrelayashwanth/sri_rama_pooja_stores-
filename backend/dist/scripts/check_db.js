"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function check() {
    try {
        const count = await prisma.product.count();
        console.log('Product count:', count);
        const products = await prisma.product.findMany({
            take: 5,
            include: {
                images: true,
                category: true
            }
        });
        console.log('Sample products:', JSON.stringify(products, null, 2));
    }
    catch (error) {
        console.error('Error checking DB:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
check();
