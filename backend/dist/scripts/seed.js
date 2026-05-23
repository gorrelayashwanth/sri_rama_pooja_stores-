"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database with matching IDs...');
    // 1. Create Admin User
    const adminEmail = 'admin@sriramapooja.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const passwordHash = await bcryptjs_1.default.hash('admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                email: adminEmail,
                passwordHash,
                role: 'ADMIN',
            },
        });
        console.log('Admin user created: admin@sriramapooja.com / admin123');
    }
    // 2. Create Categories with matching IDs for frontend fallbacks
    const categories = [
        { id: 'cat-1', name: 'Puja Items', slug: 'puja-items' },
        { id: 'cat-2', name: 'Idols & Frames', slug: 'idols-frames' },
        { id: 'cat-3', name: 'Incense & Oils', slug: 'incense-oils' },
        { id: 'cat-4', name: 'Festival Supplies', slug: 'festival-supplies' },
        { id: 'cat-5', name: 'Brassware', slug: 'brassware' },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { id: cat.id }, // Force ID to match
            create: {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
            },
        });
    }
    console.log('Categories seeded with matching IDs.');
    console.log('Seeding completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
