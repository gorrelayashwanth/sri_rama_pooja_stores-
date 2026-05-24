import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Canonical 12 store categories (slug → keep this category id prefix pattern)
 * Duplicate/legacy slugs map to canonical slug; products are reassigned then dupes deleted.
 */
const SLUG_TO_CANONICAL: Record<string, string> = {
  // Legacy seed.ts (5) → closest canonical
  'puja-items': 'puja-kits',
  'idols-frames': 'god-idols-murtis',
  'incense-oils': 'incense-fragrance',
  'festival-supplies': 'puja-kits',
  'brassware': 'diyas-lamps',
  // Alternate naming from bulk import
  'incense-dhoop': 'incense-fragrance',
  'sacred-idols-murtis': 'god-idols-murtis',
  'sacred-threads-raksha': 'sacred-threads-malas',
  'kumkum-vibhuti-sacred-powders': 'sacred-powders',
  'fresh-florals-leaves': 'flowers-garlands',
  'pooja-essentials': 'puja-kits',
};

const CANONICAL_SLUGS = [
  'incense-fragrance',
  'diyas-lamps',
  'god-idols-murtis',
  'puja-thali-utensils',
  'sacred-powders',
  'flowers-garlands',
  'sacred-threads-malas',
  'puja-fabrics',
  'puja-kits',
  'sacred-water-liquids',
  'books-spiritual-items',
  'temple-mandir-decoration',
];

async function main() {
  const all = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  const bySlug = new Map(all.map((c) => [c.slug, c]));

  // Ensure canonical categories exist (upsert by slug)
  for (const slug of CANONICAL_SLUGS) {
    if (!bySlug.has(slug)) {
      console.warn(`Missing canonical category: ${slug} — run seedProducts first`);
    }
  }

  let movedProducts = 0;
  let deletedCategories = 0;

  for (const cat of all) {
    const targetSlug = SLUG_TO_CANONICAL[cat.slug];
    if (!targetSlug) continue; // keep canonical + unmapped

    const target = bySlug.get(targetSlug);
    if (!target) {
      console.error(`No target for ${cat.slug} → ${targetSlug}`);
      continue;
    }

    if (cat.id === target.id) continue;

    const productCount = cat._count.products;
    if (productCount > 0) {
      const result = await prisma.product.updateMany({
        where: { categoryId: cat.id },
        data: { categoryId: target.id },
      });
      movedProducts += result.count;
      console.log(`Moved ${result.count} products: "${cat.name}" → "${target.name}"`);
    }

    await prisma.category.delete({ where: { id: cat.id } });
    deletedCategories++;
    console.log(`Deleted duplicate category: ${cat.name} (${cat.slug})`);
  }

  // Delete empty legacy categories with zero products (cat-1..cat-5 style)
  const emptyLegacy = await prisma.category.findMany({
    where: {
      slug: { in: ['puja-items', 'idols-frames', 'incense-oils', 'festival-supplies', 'brassware'] },
    },
    include: { _count: { select: { products: true } } },
  });

  for (const cat of emptyLegacy) {
    if (cat._count.products === 0) {
      await prisma.category.delete({ where: { id: cat.id } });
      deletedCategories++;
      console.log(`Deleted empty legacy: ${cat.name}`);
    }
  }

  const remaining = await prisma.category.count();
  console.log('\n--- MERGE COMPLETE ---');
  console.log(`Products reassigned: ${movedProducts}`);
  console.log(`Categories deleted: ${deletedCategories}`);
  console.log(`Categories remaining: ${remaining}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
