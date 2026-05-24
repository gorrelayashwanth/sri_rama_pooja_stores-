"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/** Category slug → image path served from frontend public folder */
const categoryImages = {
    'incense-fragrance': '/images/categories/incense-and-oils.png',
    'diyas-lamps': '/images/categories/brassware.png',
    'god-idols-murtis': '/images/categories/idols-and-frames.png',
    'puja-thali-utensils': '/images/categories/brassware.png',
    'sacred-powders': '/images/categories/puja-items.png',
    'flowers-garlands': '/images/categories/pooja-essentials-alt.png',
    'sacred-threads-malas': '/images/categories/puja-items.png',
    'puja-fabrics': '/images/categories/pooja-essentials-alt.png',
    'puja-kits': '/images/categories/festival-supplies.png',
    'sacred-water-liquids': '/images/categories/puja-items.png',
    'books-spiritual-items': '/images/categories/pooja-essentials-alt.png',
    'temple-mandir-decoration': '/images/categories/idols-and-frames.png',
    'incense-dhoop': '/images/categories/incense-and-oils.png',
    'incense-oils': '/images/categories/incense-and-oils.png',
    'sacred-idols-murtis': '/images/categories/idols-and-frames.png',
    'idols-frames': '/images/categories/idols-and-frames.png',
    'puja-items': '/images/categories/puja-items.png',
    'pooja-essentials': '/images/categories/puja-items.png',
    'kumkum-vibhuti-sacred-powders': '/images/categories/puja-items.png',
    'fresh-florals-leaves': '/images/categories/pooja-essentials-alt.png',
    'sacred-threads-raksha': '/images/categories/puja-items.png',
    'festival-supplies': '/images/categories/festival-supplies.png',
    'brassware': '/images/categories/brassware.png',
};
async function main() {
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories`);
    for (const cat of categories) {
        const image = categoryImages[cat.slug];
        if (image) {
            await prisma.category.update({
                where: { id: cat.id },
                data: { image },
            });
            console.log(`Updated image for: ${cat.name}`);
        }
        else {
            console.log(`No image mapping for slug: ${cat.slug}`);
        }
    }
    console.log('Category images updated.');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
