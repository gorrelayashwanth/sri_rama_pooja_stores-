"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testQuery() {
    const products = await prisma.product.findMany({
        where: {
            isAvailable: true,
            price: {
                gte: 0,
                lte: 10000
            }
        }
    });
    console.log('Found:', products.length);
    await prisma.$disconnect();
}
testQuery();
