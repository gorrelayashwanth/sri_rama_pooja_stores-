"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function check() {
    const user = await prisma.user.findUnique({ where: { email: 'admin@sriramapooja.com' } });
    if (user) {
        console.log('--- USER FOUND ---');
        console.log('ID:', user.id);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Has Password Hash:', !!user.passwordHash);
    }
    else {
        console.log('--- USER NOT FOUND ---');
    }
}
check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
