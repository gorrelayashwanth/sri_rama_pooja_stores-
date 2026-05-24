import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    "category": "Pooja Essentials",
    "slug": "pooja-essentials",
    "products": [
      {
        "name": "Premium Bhimseni Camphor (Pure Crystals)",
        "slug": "premium-bhimseni-camphor-100g",
        "description": "100% pure, chemical-free crystal flake Bhimseni camphor. Creates a clean, smoke-free divine atmosphere during Aarti.",
        "price": 195.00,
        "salePrice": 160.00,
        "sku": "PS-ESS-CAM-100",
        "weight_grams": 100,
        "is_perishable": false,
        "image_url": ["https://res.cloudinary.com/demo/image/upload/v1/camphor.jpg"],
        "attributes": {"purity": "100% Medicinal Pure", "packaging": "Air-tight jar", "shelf_life": "Indefinite"}
      },
      {
        "name": "Natural Mysore Sandalwood Paste Tube",
        "slug": "mysore-sandalwood-paste-50g",
        "description": "Authentic, rich-fragrance sandalwood paste sourced from premium organic wood blocks. Perfect for daily tilak.",
        "price": 299.00,
        "salePrice": 249.00,
        "sku": "PS-ESS-SAN-050",
        "weight_grams": 50,
        "is_perishable": false,
        "image_url": ["https://res.cloudinary.com/demo/image/upload/v1/sandalwood.jpg"],
        "attributes": {"type": "Organic Paste", "aroma": "Intense Classic Sandal", "skin_safe": "Yes"}
      },
      {
        "name": "Handmade Cow Ghee Diya Wicks",
        "slug": "cow-ghee-diya-wicks-50pc",
        "description": "Ready-to-use cotton wicks pre-soaked in pure, premium cow ghee. Designed for seamless, clean, 30-minute steady burning.",
        "price": 150.00,
        "salePrice": 120.00,
        "sku": "PS-ESS-WIK-050",
        "weight_grams": 150,
        "is_perishable": false,
        "image_url": ["https://res.cloudinary.com/demo/image/upload/v1/ghee_wicks.jpg"],
        "attributes": {"quantity": "50 Wicks", "average_burn_time": "30-40 Mins", "ghee_type": "Pure Cow Ghee"}
      },
      {
        "name": "Premium Natural Incense Sticks (Agarbatti)",
        "slug": "premium-natural-incense-sticks-100g",
        "description": "Charcoal-free incense sticks hand-rolled with temple flowers and natural essential oils. Low smoke, long-lasting fragrance.",
        "price": 110.00,
        "salePrice": 85.00,
        "sku": "PS-ESS-INC-100",
        "weight_grams": 120,
        "is_perishable": false,
        "image_url": ["https://res.cloudinary.com/demo/image/upload/v1/incense.jpg"],
        "attributes": {"fragrance": "Mogra & Champa Blend", "stick_count": "Approx. 60-70", "composition": "Charcoal-free"}
      }
    ]
  },
  {
    "category": "Fresh Ritual Florals & Leaves",
    "slug": "fresh-florals-leaves",
    "products": [
      {
        "name": "Fresh Festive Marigold Flower Garland",
        "slug": "fresh-marigold-garland-1meter",
        "description": "Premium, locally cut fresh yellow and orange marigold garlands. Ideal for framing home entrance doors or mandir altars.",
        "price": 130.00,
        "salePrice": 95.00,
        "sku": "PS-FLR-MAR-001",
        "weight_grams": 300,
        "is_perishable": true,
        "image_url": ["https://res.cloudinary.com/demo/image/upload/v1/marigold.jpg"],
        "attributes": {"length": "1 Meter", "freshness_window": "24-36 Hours"}
      },
      {
        "name": "Sacred Mango Leaves Bundle (Toran Cut)",
        "slug": "sacred-mango-leaves-11pc",
        "description": "A collection of 11 freshly plucked, unblemished mango leaves. Culturally essential for kalash setups.",
        "price": 45.00,
        "salePrice": 30.00,
        "sku": "PS-FLR-MNG-011",
        "weight_grams": 100,
        "is_perishable": true,
        "image_url": ["https://res.cloudinary.com/demo/image/upload/v1/mango_leaves.jpg"],
        "attributes": {"count": "11 Leaves", "condition": "Freshly Plucked Same-Day"}
      }
    ]
  }
];

async function main() {
  console.log('Seeding database with Quick Commerce products...');
  for (const cat of seedData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.category,
        slug: cat.slug,
      },
    });

    for (const prod of cat.products) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          price: prod.price,
          salePrice: prod.salePrice,
          weightGrams: prod.weight_grams,
          isPerishable: prod.is_perishable,
          attributes: prod.attributes,
        },
        create: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          salePrice: prod.salePrice,
          sku: prod.sku,
          stock: 100,
          weightGrams: prod.weight_grams,
          isPerishable: prod.is_perishable,
          attributes: prod.attributes,
          categoryId: category.id,
          images: {
            create: prod.image_url.map(url => ({
              url: url,
              publicId: url.split('/').pop() || 'image'
            }))
          }
        },
      });
    }
  }

  // Create a Combo
  console.log('Seeding Combo kits...');
  const allProducts = await prisma.product.findMany();
  if (allProducts.length > 0) {
    const firstTwo = allProducts.slice(0, 2);
    await prisma.combo.create({
      data: {
        name: "Daily Essentials Pooja Kit",
        description: "A complete bundle of daily pooja items for your morning rituals. Sourced fresh for divine presence.",
        price: 500.00,
        salePrice: 420.00,
        isActive: true,
        products: {
          connect: firstTwo.map(p => ({ id: p.id }))
        }
      }
    });
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
