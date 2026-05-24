"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function updateAdmin() {
    const newEmail = 'sriramapoojastores@admin.com';
    const newPassword = 'admin123';
    const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
    console.log(`Updating/Creating admin user: ${newEmail}`);
    // Remove legacy admin accounts with old emails
    const legacyEmails = [
        'sriramapoojastores@gmail.com',
        'admin@sriramapooja.com',
    ];
    for (const email of legacyEmails) {
        await prisma.user.deleteMany({ where: { email } }).catch(() => { });
    }
    const user = await prisma.user.upsert({
        where: { email: newEmail },
        update: {
            passwordHash,
            role: 'CHIEF_ADMIN',
            emailVerified: true,
        },
        create: {
            name: 'Sri Rama Pooja Stores Admin',
            email: newEmail,
            passwordHash,
            role: 'CHIEF_ADMIN',
            emailVerified: true,
        },
    });
    console.log('--- ADMIN UPDATED SUCCESSFULLY ---');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
}
updateAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
