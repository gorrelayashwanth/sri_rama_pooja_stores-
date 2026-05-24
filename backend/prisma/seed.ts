import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Base URL where images are served from (public folder on Vercel)
const IMG = (filename: string) => `/images/${filename}`;

const seedData = [
  {
    category: "Incense & Dhoop",
    slug: "incense-dhoop",
    image: IMG("srp_inc_001_1779533196551.png"),
    products: [
      {
        name: "Premium Chandan Agarbatti (Sandalwood Incense)",
        slug: "premium-chandan-agarbatti",
        description: "Hand-rolled sandalwood incense sticks with authentic Mysore chandan. Creates a serene, spiritual ambiance. Charcoal-free, low smoke.",
        price: 110.00, salePrice: 85.00, sku: "INC-CHA-001",
        weight_grams: 120, is_perishable: false,
        image_url: IMG("srp_inc_001_1779533196551.png"),
        attributes: { fragrance: "Pure Sandalwood", stick_count: "~60 sticks", burn_time: "~45 mins each", composition: "Charcoal-free" }
      },
      {
        name: "Jasmine Mogra Agarbatti (Temple Grade)",
        slug: "jasmine-mogra-agarbatti-temple-grade",
        description: "Divine jasmine and mogra blend incense sticks. The quintessential temple fragrance for daily pooja rituals.",
        price: 95.00, salePrice: 75.00, sku: "INC-MOG-002",
        weight_grams: 110, is_perishable: false,
        image_url: IMG("srp_inc_002_1779533220598.png"),
        attributes: { fragrance: "Jasmine & Mogra", stick_count: "~70 sticks", composition: "Natural floral blend" }
      },
      {
        name: "Rose Gulab Dhoop Sticks (Thick Premium)",
        slug: "rose-gulab-dhoop-sticks-premium",
        description: "Thick premium dhoop sticks infused with pure rose extract. Long 2-hour burn time. Ideal for meditation spaces.",
        price: 130.00, salePrice: 99.00, sku: "INC-ROS-003",
        weight_grams: 200, is_perishable: false,
        image_url: IMG("srp_inc_003_1779533241213.png"),
        attributes: { fragrance: "Pure Rose Gulab", stick_count: "20 thick sticks", burn_time: "~2 hours each" }
      },
      {
        name: "Loban Havan Dhoop Cone Set",
        slug: "loban-havan-dhoop-cone-set",
        description: "Pure Loban (benzoin resin) dhoop cones. Used in traditional havan ceremonies for purifying the atmosphere.",
        price: 150.00, salePrice: 120.00, sku: "INC-LOB-004",
        weight_grams: 180, is_perishable: false,
        image_url: IMG("srp_inc_004_1779533261925.png"),
        attributes: { fragrance: "Sacred Loban Resin", cone_count: "30 cones", use: "Havan & Home Purification" }
      },
      {
        name: "Nag Champa Masala Agarbatti",
        slug: "nag-champa-masala-agarbatti",
        description: "World-famous Nag Champa blend — earthy, exotic, and deeply calming. A favourite for yoga and meditation sessions.",
        price: 120.00, salePrice: 90.00, sku: "INC-NAG-005",
        weight_grams: 130, is_perishable: false,
        image_url: IMG("srp_inc_005_1779533281342.png"),
        attributes: { fragrance: "Nag Champa Masala", stick_count: "~50 sticks", ideal_for: "Meditation & Yoga" }
      },
      {
        name: "Tulsi & Haldi Pooja Agarbatti Pack",
        slug: "tulsi-haldi-pooja-agarbatti-pack",
        description: "Blessed combination of Sacred Tulsi and Haldi fragrance. Traditionally offered during Vishnu and Lakshmi pooja.",
        price: 100.00, salePrice: 80.00, sku: "INC-TUL-006",
        weight_grams: 115, is_perishable: false,
        image_url: IMG("srp_inc_006_1779533304013.png"),
        attributes: { fragrance: "Tulsi & Haldi", stick_count: "~60 sticks", deity: "Vishnu & Lakshmi" }
      },
      {
        name: "Guggul Sacred Resin Dhoop",
        slug: "guggul-sacred-resin-dhoop",
        description: "Pure Guggul (commiphora) resin, used in Vedic rituals for centuries. Renowned for its air-purifying, anti-bacterial properties.",
        price: 180.00, salePrice: 145.00, sku: "INC-GUG-007",
        weight_grams: 150, is_perishable: false,
        image_url: IMG("srp_inc_007_1779533327762.png"),
        attributes: { type: "Resin Dhoop", weight: "150g", properties: "Anti-bacterial, Air-purifying" }
      },
      {
        name: "Kewra & Oudh Luxury Agarbatti",
        slug: "kewra-oudh-luxury-agarbatti",
        description: "An opulent blend of rare Kewra (screwpine) and Royal Oudh (oud). Premium fragrance for special occasions and pujas.",
        price: 220.00, salePrice: 185.00, sku: "INC-OUD-008",
        weight_grams: 100, is_perishable: false,
        image_url: IMG("srp_inc_008_1779533349933.png"),
        attributes: { fragrance: "Kewra & Royal Oudh", stick_count: "~40 sticks", grade: "Luxury Premium" }
      },
      {
        name: "Camphor & Eucalyptus Incense Sticks",
        slug: "camphor-eucalyptus-incense-sticks",
        description: "Refreshing camphor and eucalyptus blend. Purifies air, repels insects, and creates a fresh, cool atmosphere.",
        price: 90.00, salePrice: 70.00, sku: "INC-CAM-009",
        weight_grams: 110, is_perishable: false,
        image_url: IMG("srp_inc_009_1779533372867.png"),
        attributes: { fragrance: "Camphor & Eucalyptus", stick_count: "~65 sticks", properties: "Air Purifying" }
      },
      {
        name: "Coconut & Musk Agarbatti (South Indian Special)",
        slug: "coconut-musk-agarbatti-south-indian",
        description: "A uniquely South Indian fragrance profile — sweet coconut blended with earthy white musk. Beloved in Tamil Nadu and Andhra temples.",
        price: 105.00, salePrice: 82.00, sku: "INC-COC-010",
        weight_grams: 120, is_perishable: false,
        image_url: IMG("srp_inc_010_1779533395755.png"),
        attributes: { fragrance: "Coconut & White Musk", stick_count: "~60 sticks", origin: "South Indian Temple Blend" }
      }
    ]
  },
  {
    category: "Diyas & Lamps",
    slug: "diyas-lamps",
    image: IMG("srp_dya_001_1779533420847.png"),
    products: [
      {
        name: "Traditional Handmade Clay Diya Set (Pack of 12)",
        slug: "traditional-clay-diya-set-12pc",
        description: "Authentic terracotta clay diyas handcrafted by local artisans. Natural clay ensures a slow, pure ghee burn for auspicious illumination.",
        price: 120.00, salePrice: 95.00, sku: "DYA-CLY-001",
        weight_grams: 400, is_perishable: false,
        image_url: IMG("srp_dya_001_1779533420847.png"),
        attributes: { material: "Natural Terracotta", quantity: "12 Diyas", size: "3 inch diameter", craft: "Handmade" }
      },
      {
        name: "Brass Pancha Deepam (5-Wick Lamp)",
        slug: "brass-pancha-deepam-5-wick",
        description: "Premium solid brass Pancha Deepam lamp with 5 wicks. Represents the five elements. Used in temples and grand home poojas.",
        price: 850.00, salePrice: 699.00, sku: "DYA-BRS-002",
        weight_grams: 650, is_perishable: false,
        image_url: IMG("srp_dya_002_1779533441390.png"),
        attributes: { material: "Solid Brass", wicks: "5", significance: "Five Elements (Pancha Bhuta)", finish: "Antique Polish" }
      },
      {
        name: "Decorative Floating Diya Set (Pack of 10)",
        slug: "decorative-floating-diya-set-10pc",
        description: "Beautiful wax floating diyas with rose petals embedded inside. Perfect for Diwali, Navratri, and home entrance decoration.",
        price: 250.00, salePrice: 199.00, sku: "DYA-FLT-003",
        weight_grams: 300, is_perishable: false,
        image_url: IMG("srp_dya_003_1779533461343.png"),
        attributes: { material: "Wax with Rose Petals", quantity: "10 Diyas", use: "Floating in Water Bowls" }
      },
      {
        name: "Copper Vilakku Standing Lamp (12 inch)",
        slug: "copper-vilakku-standing-lamp-12inch",
        description: "Traditional South Indian Kuthu Vilakku in pure copper. The sacred lamp of Goddess Lakshmi, lit for evening sandhya prayers.",
        price: 1200.00, salePrice: 999.00, sku: "DYA-COP-004",
        weight_grams: 800, is_perishable: false,
        image_url: IMG("srp_dya_004_1779533480695.png"),
        attributes: { material: "Pure Copper", height: "12 Inches", style: "South Indian Vilakku", deity: "Lakshmi" }
      },
      {
        name: "Kumkum-Decorated Terracotta Festival Diyas (Pack of 6)",
        slug: "kumkum-decorated-terracotta-diyas-6pc",
        description: "Hand-painted terracotta diyas decorated with auspicious kumkum dots and turmeric patterns. Festival-ready, Diwali special.",
        price: 180.00, salePrice: 149.00, sku: "DYA-DEC-005",
        weight_grams: 350, is_perishable: false,
        image_url: IMG("srp_dya_005_1779533501017.png"),
        attributes: { material: "Painted Terracotta", quantity: "6 Diyas", decoration: "Kumkum & Turmeric Patterns" }
      },
      {
        name: "Silver-Plated Aarti Diya with Handle",
        slug: "silver-plated-aarti-diya-with-handle",
        description: "Elegant silver-plated single diya with a long handle. Designed for holding during Aarti ceremonies. Tarnish-resistant finish.",
        price: 450.00, salePrice: 380.00, sku: "DYA-SLV-006",
        weight_grams: 200, is_perishable: false,
        image_url: IMG("srp_dya_006_1779533522117.png"),
        attributes: { material: "Silver-Plated Brass", use: "Aarti Ceremony", handle: "Long Ergonomic Handle" }
      },
      {
        name: "Earthen Navaratri Golu Diya Lamp (Pair)",
        slug: "earthen-navaratri-golu-diya-pair",
        description: "Classic red-and-gold painted earthen diya pair, traditionally placed at the top of the Golu (doll display) during Navaratri.",
        price: 220.00, salePrice: 175.00, sku: "DYA-GOL-007",
        weight_grams: 450, is_perishable: false,
        image_url: IMG("srp_dya_007_1779533542976.png"),
        attributes: { material: "Painted Earthen Clay", quantity: "Pair (2)", occasion: "Navaratri Golu" }
      },
      {
        name: "Electric Brass Deepam (Temple Style LED)",
        slug: "electric-brass-deepam-led-temple",
        description: "Authentic brass temple deepam with a safe, energy-efficient LED flame. Suitable for continuous 24-hour pooja use. No fire risk.",
        price: 650.00, salePrice: 520.00, sku: "DYA-LED-008",
        weight_grams: 500, is_perishable: false,
        image_url: IMG("srp_dya_008_1779552388771.png"),
        attributes: { material: "Solid Brass", power: "LED (Plug-In)", safety: "No Open Flame", usage: "24-Hour Continuous" }
      },
      {
        name: "Banana Leaf Diyas for Ritual Offerings (Pack of 20)",
        slug: "banana-leaf-diyas-ritual-20pc",
        description: "Biodegradable diyas made from pressed banana leaves. Traditionally used in river and pond offerings (tharpanam ceremonies).",
        price: 80.00, salePrice: 60.00, sku: "DYA-BAN-009",
        weight_grams: 150, is_perishable: true,
        image_url: IMG("srp_dya_009_1779552412560.png"),
        attributes: { material: "Banana Leaf", quantity: "20 Diyas", eco: "Fully Biodegradable", use: "River Offerings" }
      },
      {
        name: "Brass Deepa Lakshmi Idol with Diya (8 inch)",
        slug: "brass-deepa-lakshmi-idol-with-diya-8inch",
        description: "Exquisite solid brass Deepa Lakshmi figurine holding an oil lamp. A sacred symbol of wealth and light for home mandirs.",
        price: 1800.00, salePrice: 1499.00, sku: "DYA-LAK-010",
        weight_grams: 900, is_perishable: false,
        image_url: IMG("srp_dya_010_1779552435866.png"),
        attributes: { material: "Solid Brass", height: "8 Inches", deity: "Deepa Lakshmi", finish: "Traditional Antique" }
      }
    ]
  },
  {
    category: "Sacred Idols & Murtis",
    slug: "sacred-idols-murtis",
    image: IMG("srp_idl_001_1779552460809.png"),
    products: [
      {
        name: "Lord Ganesha Brass Murti (Sitting, 6 inch)",
        slug: "lord-ganesha-brass-murti-6inch",
        description: "Handcrafted sitting Ganesha in solid brass. The Vighnaharta, remover of obstacles. An auspicious presence for home and office mandirs.",
        price: 1500.00, salePrice: 1250.00, sku: "IDL-GAN-001",
        weight_grams: 700, is_perishable: false,
        image_url: IMG("srp_idl_001_1779552460809.png"),
        attributes: { material: "Solid Brass", height: "6 Inches", deity: "Lord Ganesha", pose: "Lalitasana (Sitting)" }
      },
      {
        name: "Goddess Lakshmi Standing Idol (White Marble Look, 8 inch)",
        slug: "goddess-lakshmi-marble-idol-8inch",
        description: "Elegantly sculpted Goddess Lakshmi in white marble-finish resin. Raised hand in Abhaya mudra, gold-finished accents.",
        price: 999.00, salePrice: 849.00, sku: "IDL-LAK-002",
        weight_grams: 600, is_perishable: false,
        image_url: IMG("srp_idl_002_1779552499736.png"),
        attributes: { material: "Marble-finish Resin", height: "8 Inches", deity: "Goddess Lakshmi", finish: "White & Gold" }
      },
      {
        name: "Lord Krishna with Flute Brass Idol (5 inch)",
        slug: "lord-krishna-flute-brass-idol-5inch",
        description: "Charming brass idol of Lord Krishna in his iconic Tribhanga (three-bend) pose playing the divine flute. Hand-engraved details.",
        price: 1200.00, salePrice: 999.00, sku: "IDL-KRI-003",
        weight_grams: 550, is_perishable: false,
        image_url: IMG("srp_idl_003_1779552527354.png"),
        attributes: { material: "Solid Brass", height: "5 Inches", deity: "Lord Krishna", pose: "Tribhanga with Flute" }
      },
      {
        name: "Panchamukhi Hanuman Copper Idol (7 inch)",
        slug: "panchamukhi-hanuman-copper-idol-7inch",
        description: "The five-faced (Panchamukhi) form of Lord Hanuman in pure copper. Provides protection and removes negative energies from the home.",
        price: 2200.00, salePrice: 1850.00, sku: "IDL-HAN-004",
        weight_grams: 950, is_perishable: false,
        image_url: IMG("srp_idl_004_1779552554337.png"),
        attributes: { material: "Pure Copper", height: "7 Inches", deity: "Panchamukhi Hanuman", faces: "5 Sacred Faces" }
      },
      {
        name: "Saraswati Veena Idol (White Marble, 9 inch)",
        slug: "saraswati-veena-marble-idol-9inch",
        description: "Goddess Saraswati seated with her Veena — a must-have for homes with students and artists. Marble-finish with intricate detailing.",
        price: 1100.00, salePrice: 899.00, sku: "IDL-SAR-005",
        weight_grams: 700, is_perishable: false,
        image_url: IMG("srp_idl_005_1779552582880.png"),
        attributes: { material: "Marble-finish", height: "9 Inches", deity: "Goddess Saraswati", blessings: "Education & Arts" }
      },
      {
        name: "Lord Shiva Nataraja Bronze Statue (6 inch)",
        slug: "shiva-nataraja-bronze-statue-6inch",
        description: "The cosmic dancer Nataraja — Lord Shiva performing the Ananda Tandava. Crafted in Chola bronze style with intricate detailing.",
        price: 1800.00, salePrice: 1499.00, sku: "IDL-SHI-006",
        weight_grams: 800, is_perishable: false,
        image_url: IMG("srp_idl_006_1779552608103.png"),
        attributes: { material: "Chola-style Bronze", height: "6 Inches", deity: "Lord Shiva as Nataraja", style: "South Indian Temple Art" }
      },
      {
        name: "Sri Venkateshwara (Balaji) Idol (5 inch)",
        slug: "sri-venkateshwara-balaji-idol-5inch",
        description: "Lord Sri Venkateshwara (Tirupati Balaji) in his iconic standing form. A sacred presence from the Tirumala tradition for your home mandir.",
        price: 950.00, salePrice: 799.00, sku: "IDL-VEN-007",
        weight_grams: 500, is_perishable: false,
        image_url: IMG("srp_idl_007_1779552630829.png"),
        attributes: { material: "Black Resin", height: "5 Inches", deity: "Lord Venkateshwara", tradition: "Tirumala Tirupati" }
      },
      {
        name: "Nandi Bull Brass Idol (3 inch, Temple Grade)",
        slug: "nandi-bull-brass-idol-3inch",
        description: "Nandi — the sacred vehicle and gatekeeper of Lord Shiva. Placing Nandi facing the Shiva Lingam is an ancient Vedic tradition.",
        price: 650.00, salePrice: 530.00, sku: "IDL-NAN-008",
        weight_grams: 350, is_perishable: false,
        image_url: IMG("srp_idl_008_1779552656613.png"),
        attributes: { material: "Solid Brass", size: "3 Inches", deity: "Nandi (Shiva's Vehicle)", placement: "Facing Shiva Lingam" }
      },
      {
        name: "Durga Maa Mahishasura Mardini Idol (8 inch)",
        slug: "durga-maa-mahishasura-mardini-idol-8inch",
        description: "The fierce and protective Mother Goddess Durga in her demon-slaying avatar. 8 arms, full lion mount, vibrant painted colors.",
        price: 1350.00, salePrice: 1099.00, sku: "IDL-DUR-009",
        weight_grams: 750, is_perishable: false,
        image_url: IMG("srp_idl_009_1779552678394.png"),
        attributes: { material: "Painted Resin", height: "8 Inches", deity: "Goddess Durga", arms: "8 Arms (Ashtabhuja)" }
      },
      {
        name: "Panchadhatu Panchayatana Set (5 Deity Ensemble)",
        slug: "panchadhatu-panchayatana-deity-set",
        description: "The sacred Panchayatana set — Ganesha, Vishnu, Shiva, Devi, and Surya. Five deities in panchadhatu alloy for complete home worship.",
        price: 3500.00, salePrice: 2999.00, sku: "IDL-PAN-010",
        weight_grams: 1200, is_perishable: false,
        image_url: IMG("srp_idl_010_1779552701244.png"),
        attributes: { material: "Panchadhatu Alloy", deities: "5 (Panchayatana)", tradition: "Adi Shankaracharya Sampradaya" }
      }
    ]
  },
  {
    category: "Sacred Threads & Raksha",
    slug: "sacred-threads-raksha",
    image: IMG("srp_thd_001_1779552729835.png"),
    products: [
      {
        name: "Mauli Kalava Red Sacred Thread (10m Roll)",
        slug: "mauli-kalava-red-sacred-thread-10m",
        description: "Pure cotton Mauli thread, dyed with natural red and yellow colors. Tied on wrists as a protective raksha during all Vedic rituals.",
        price: 60.00, salePrice: 45.00, sku: "THD-MAU-001",
        weight_grams: 50, is_perishable: false,
        image_url: IMG("srp_thd_001_1779552729835.png"),
        attributes: { material: "Pure Cotton", length: "10 Meters", color: "Red & Yellow (Traditional)", use: "Raksha Bandhan & Rituals" }
      },
      {
        name: "Panchamukhi Rudraksha Raksha Bracelet",
        slug: "panchamukhi-rudraksha-raksha-bracelet",
        description: "A powerful protection bracelet featuring 5-mukhi (five-faced) Rudraksha beads strung on red silk thread. Blesses with good health and clarity.",
        price: 350.00, salePrice: 280.00, sku: "THD-RUD-002",
        weight_grams: 30, is_perishable: false,
        image_url: IMG("srp_thd_002_1779552753592.png"),
        attributes: { beads: "5-Mukhi Rudraksha", thread: "Red Silk", blessings: "Health, Clarity, Protection" }
      },
      {
        name: "Gold-Zari Pooja Thread (Sutra for Kalash, 5m)",
        slug: "gold-zari-pooja-thread-sutra-5m",
        description: "Auspicious gold zari thread used to tie around the Kalash (sacred pot) during Navratri, Griha Pravesh, and Satyanarayan poojas.",
        price: 90.00, salePrice: 70.00, sku: "THD-ZAR-003",
        weight_grams: 60, is_perishable: false,
        image_url: IMG("srp_thd_003_1779552778465.png"),
        attributes: { material: "Gold Zari Cotton", length: "5 Meters", use: "Kalash Bandhan, Griha Pravesh" }
      },
      {
        name: "Navgraha Raksha Thread Set (9 Sacred Colors)",
        slug: "navgraha-raksha-thread-set-9-colors",
        description: "Set of 9 auspicious colored threads representing the nine planetary deities (Navgrahas). Worn for planetary harmony and dosh nivaran.",
        price: 150.00, salePrice: 120.00, sku: "THD-NAV-004",
        weight_grams: 80, is_perishable: false,
        image_url: IMG("srp_thd_004_1779552801307.png"),
        attributes: { material: "Silk & Cotton Blend", count: "9 Threads", colors: "9 Navgraha Colors", purpose: "Planetary Harmony" }
      },
      {
        name: "Black Thread Kala Dhaga Nazar Protection Bracelet",
        slug: "black-thread-kala-dhaga-nazar-bracelet",
        description: "Traditional black Kala Dhaga (thread) bracelet with a silver-coated eye (nazar) charm. Protects against the evil eye (buri nazar).",
        price: 80.00, salePrice: 60.00, sku: "THD-KAL-005",
        weight_grams: 20, is_perishable: false,
        image_url: IMG("srp_thd_005_1779598641994.png"),
        attributes: { material: "Black Cotton Thread", charm: "Silver-coated Evil Eye", protection: "Anti-Nazar (Evil Eye)" }
      },
      {
        name: "Satyanarayan Pooja Yellow Thread (Patambi)",
        slug: "satyanarayan-pooja-yellow-thread-patambi",
        description: "Sacred yellow thread used for the Satyanarayan Pooja Vratam. Blessed by priests and distributed as Prasad after the ceremony.",
        price: 45.00, salePrice: 35.00, sku: "THD-SAT-006",
        weight_grams: 30, is_perishable: false,
        image_url: IMG("srp_thd_006_1779598663856.png"),
        attributes: { color: "Auspicious Yellow", material: "Cotton", ritual: "Satyanarayan Vratam", distribution: "As Prasad" }
      },
      {
        name: "Vastu Raksha Red Silk Thread (Grahapravesh)",
        slug: "vastu-raksha-red-silk-thread-grahapravesh",
        description: "Premium red silk thread for Griha Pravesh (housewarming) Vastu rituals. Tied on the main door threshold for prosperity and protection.",
        price: 120.00, salePrice: 95.00, sku: "THD-VAS-007",
        weight_grams: 50, is_perishable: false,
        image_url: IMG("srp_thd_007_1779598684115.png"),
        attributes: { material: "Pure Red Silk", use: "Griha Pravesh / Housewarming", placement: "Main Door Threshold" }
      },
      {
        name: "Cotton Janeu (Sacred Yagnopaveet Thread, Pack of 5)",
        slug: "cotton-janeu-yagnopaveet-5pc",
        description: "Authentic three-strand Janeu (Yagnopaveet or Poonal) made from pure white cotton. Worn by initiated males during rituals.",
        price: 100.00, salePrice: 80.00, sku: "THD-JAN-008",
        weight_grams: 60, is_perishable: false,
        image_url: IMG("srp_thd_008_1779598705216.png"),
        attributes: { material: "Pure White Cotton", strands: "3 (Traditional)", quantity: "5 Janeus", tradition: "Vedic Upanayana" }
      },
      {
        name: "Durga Raksha Thread (8-Armed Murti Design)",
        slug: "durga-raksha-thread-8-armed",
        description: "Blessed Raksha thread for Durga Navratri. Features a miniature Durga Maa charm woven into the thread. Given as Prasad at temples.",
        price: 70.00, salePrice: 55.00, sku: "THD-DUR-009",
        weight_grams: 25, is_perishable: false,
        image_url: IMG("srp_thd_009_1779598726560.png"),
        attributes: { color: "Red & Gold", charm: "Durga Maa Icon", occasion: "Navratri & Durga Puja" }
      },
      {
        name: "Maha Mrityunjaya Chanting Rosary (Rudraksha Mala, 108 Beads)",
        slug: "rudraksha-mala-108-beads-maha-mrityunjaya",
        description: "Authentic 108-bead Rudraksha Japa Mala for chanting the Maha Mrityunjaya mantra. Each bead is individually knotted on silk thread.",
        price: 800.00, salePrice: 650.00, sku: "THD-MAL-010",
        weight_grams: 120, is_perishable: false,
        image_url: IMG("srp_thd_010_1779598751770.png"),
        attributes: { beads: "108 Rudraksha Beads", thread: "Silk", mantra: "Maha Mrityunjaya", use: "Daily Japa Chanting" }
      }
    ]
  },
  {
    category: "Kumkum, Vibhuti & Sacred Powders",
    slug: "kumkum-vibhuti-sacred-powders",
    image: IMG("srp_pwd_001_1779598773020.png"),
    products: [
      {
        name: "Mysore Pure Kumkum (Sindoor Red, 100g Jar)",
        slug: "mysore-pure-kumkum-100g",
        description: "100% natural, herb-processed Kumkum from Mysore. Deep red color, no artificial dyes. Safe for skin, ideal for daily tilak and pooja.",
        price: 80.00, salePrice: 65.00, sku: "PWD-KUM-001",
        weight_grams: 100, is_perishable: false,
        image_url: IMG("srp_pwd_001_1779598773020.png"),
        attributes: { color: "Deep Vermillion Red", weight: "100g", composition: "Natural Herbs & Turmeric", skin_safe: "Yes" }
      },
      {
        name: "Sacred Vibhuti (Holy Ash) from Cow Dung (50g)",
        slug: "sacred-vibhuti-holy-ash-cow-dung-50g",
        description: "Pure Bhasma (sacred ash) prepared through the traditional Vedic process of burning pure cow dung with herbs. Applied on forehead during Shiva worship.",
        price: 60.00, salePrice: 45.00, sku: "PWD-VIB-002",
        weight_grams: 50, is_perishable: false,
        image_url: IMG("srp_pwd_002_1779598797030.png"),
        attributes: { source: "Pure Cow Dung & Herbs", weight: "50g", deity: "Lord Shiva", application: "Forehead (Tripundra)" }
      },
      {
        name: "Haldi Kumkum Set (Pooja Thali Edition)",
        slug: "haldi-kumkum-set-pooja-thali-edition",
        description: "Auspicious pairing of Pure Turmeric (Haldi) and Sacred Kumkum in a beautifully presented twin-pack box. Perfect for gifting and Mangala Puja.",
        price: 130.00, salePrice: 99.00, sku: "PWD-HAK-003",
        weight_grams: 200, is_perishable: false,
        image_url: IMG("srp_pwd_003_1779598817439.png"),
        attributes: { contents: "50g Haldi + 50g Kumkum", packaging: "Decorative Gift Box", use: "Mangala Puja & Gifting" }
      },
      {
        name: "Chandan (Sandalwood) Powder for Abhishek (200g)",
        slug: "chandan-sandalwood-powder-abhishek-200g",
        description: "Fine-ground, aromatic sandalwood powder for ritual abhishek (sacred bathing of idols). Cool, calming, and deeply fragrant.",
        price: 250.00, salePrice: 199.00, sku: "PWD-CHA-004",
        weight_grams: 200, is_perishable: false,
        image_url: IMG("srp_pwd_004_1779598840235.png"),
        attributes: { type: "Sandalwood Powder", weight: "200g", use: "Deity Abhishek & Tilak", aroma: "Pure Mysore Sandalwood" }
      },
      {
        name: "Gopichandana Tilak Paste (Ready-to-Use, 50g)",
        slug: "gopichandana-tilak-paste-50g",
        description: "Sacred Gopichandana white clay paste from Dwarka. The holy tilak of Vaishnavites — applied as Urdhva Pundra on the forehead.",
        price: 90.00, salePrice: 72.00, sku: "PWD-GOP-005",
        weight_grams: 50, is_perishable: false,
        image_url: IMG("srp_pwd_005_1779598860307.png"),
        attributes: { type: "White Clay Paste", weight: "50g", source: "Dwarka (Gopichandana)", tradition: "Vaishnava Tilak" }
      },
      {
        name: "Panchamrit Powder Mix (For Abhishek Rituals)",
        slug: "panchamrit-powder-mix-abhishek",
        description: "Ready-mix powder for preparing Panchamrit (five-nectar offering) for Shiva Lingam and Idol abhishek. Contains dry milk, honey, ghee powder, sugar, curd.",
        price: 180.00, salePrice: 145.00, sku: "PWD-PAM-006",
        weight_grams: 250, is_perishable: false,
        image_url: IMG("srp_pwd_006_1779598903346.png"),
        attributes: { ingredients: "Dry Milk, Honey, Ghee, Sugar, Curd Powder", weight: "250g", use: "Deity Abhishek" }
      },
      {
        name: "Rakta Chandan (Red Sandalwood Powder, 100g)",
        slug: "rakta-chandan-red-sandalwood-100g",
        description: "Precious Rakta Chandan (red sandalwood) powder. Used for applying tilak to deities, especially Lord Vishnu and Goddess Durga. Rich, deep color.",
        price: 200.00, salePrice: 160.00, sku: "PWD-RAK-007",
        weight_grams: 100, is_perishable: false,
        image_url: IMG("srp_pwd_007_1779598927923.png"),
        attributes: { type: "Red Sandalwood Powder", weight: "100g", deity: "Vishnu & Durga", color: "Deep Crimson Red" }
      },
      {
        name: "Gulal (Herbal Natural Color Powder, 5-Color Set)",
        slug: "herbal-gulal-5-color-set",
        description: "Set of 5 vivid, skin-safe Herbal Gulal powder colors. Made from natural flowers and herbs. Perfect for Holi and festive offerings.",
        price: 250.00, salePrice: 195.00, sku: "PWD-GUL-008",
        weight_grams: 500, is_perishable: false,
        image_url: IMG("srp_pwd_008_1779598951678.png"),
        attributes: { colors: "5 (Red, Yellow, Green, Pink, Orange)", material: "Herbal Flower-based", weight: "100g each", occasion: "Holi & Festivals" }
      },
      {
        name: "Turmeric Haldi Powder (Ritual Grade, 500g)",
        slug: "turmeric-haldi-ritual-grade-500g",
        description: "High-curcumin turmeric powder, sourced from Erode (Kumkum Poo). Used in all South Indian rituals, Haldi ceremonies, and Ganesha pooja.",
        price: 110.00, salePrice: 85.00, sku: "PWD-HAL-009",
        weight_grams: 500, is_perishable: false,
        image_url: IMG("srp_pwd_009_1779598971420.png"),
        attributes: { weight: "500g", origin: "Erode, Tamil Nadu", curcumin: "High Grade", use: "Rituals & Ganesha Pooja" }
      },
      {
        name: "Kum Kum Archana Powder Set (8 varieties, Deity-Specific)",
        slug: "kumkum-archana-powder-set-8-variety",
        description: "Comprehensive set of 8 deity-specific archana powders — each charged with the appropriate mantra. Includes rose, jasmmine, lotus, tulsi-infused varieties.",
        price: 320.00, salePrice: 260.00, sku: "PWD-ARC-010",
        weight_grams: 400, is_perishable: false,
        image_url: IMG("srp_pwd_010_1779598992653.png"),
        attributes: { varieties: "8 Types", weight: "50g each", infusion: "Mantra-Charged", use: "Deity-Specific Archana" }
      }
    ]
  },
  {
    category: "Fresh Ritual Florals & Leaves",
    slug: "fresh-florals-leaves",
    image: IMG("srp_flr_001_1779599015442.png"),
    products: [
      {
        name: "Fresh Festive Marigold Flower Garland (1 Meter)",
        slug: "fresh-marigold-garland-1meter",
        description: "Premium, locally cut fresh yellow and orange marigold garlands. Ideal for framing home entrance doors or mandir altars.",
        price: 130.00, salePrice: 95.00, sku: "PS-FLR-MAR-001",
        weight_grams: 300, is_perishable: true,
        image_url: IMG("srp_flr_001_1779599015442.png"),
        attributes: { length: "1 Meter", freshness_window: "24-36 Hours", color: "Yellow & Orange" }
      },
      {
        name: "Sacred Mango Leaves Bundle (Toran Cut, 11 Leaves)",
        slug: "sacred-mango-leaves-11pc",
        description: "A collection of 11 freshly plucked, unblemished mango leaves. Culturally essential for Kalash setups in all poojas.",
        price: 45.00, salePrice: 30.00, sku: "PS-FLR-MNG-011",
        weight_grams: 100, is_perishable: true,
        image_url: IMG("srp_flr_001_1779599015442.png"),
        attributes: { count: "11 Leaves", condition: "Freshly Plucked Same-Day", use: "Kalash Bandhan" }
      }
    ]
  },
  {
    category: "Pooja Essentials",
    slug: "pooja-essentials",
    image: IMG("srp_inc_001_1779533196551.png"),
    products: [
      {
        name: "Premium Bhimseni Camphor (Pure Crystals, 100g)",
        slug: "premium-bhimseni-camphor-100g",
        description: "100% pure, chemical-free crystal flake Bhimseni camphor. Creates a clean, smoke-free divine atmosphere during Aarti.",
        price: 195.00, salePrice: 160.00, sku: "PS-ESS-CAM-100",
        weight_grams: 100, is_perishable: false,
        image_url: IMG("srp_inc_001_1779533196551.png"),
        attributes: { purity: "100% Medicinal Pure", packaging: "Air-tight jar", shelf_life: "Indefinite" }
      },
      {
        name: "Natural Mysore Sandalwood Paste Tube (50g)",
        slug: "mysore-sandalwood-paste-50g",
        description: "Authentic, rich-fragrance sandalwood paste sourced from premium organic wood blocks. Perfect for daily tilak.",
        price: 299.00, salePrice: 249.00, sku: "PS-ESS-SAN-050",
        weight_grams: 50, is_perishable: false,
        image_url: IMG("srp_pwd_004_1779598840235.png"),
        attributes: { type: "Organic Paste", aroma: "Intense Classic Sandal", skin_safe: "Yes" }
      },
      {
        name: "Handmade Cow Ghee Diya Wicks (Pack of 50)",
        slug: "cow-ghee-diya-wicks-50pc",
        description: "Ready-to-use cotton wicks pre-soaked in pure, premium cow ghee. Designed for seamless, clean, 30-40 minute steady burning.",
        price: 150.00, salePrice: 120.00, sku: "PS-ESS-WIK-050",
        weight_grams: 150, is_perishable: false,
        image_url: IMG("srp_dya_001_1779533420847.png"),
        attributes: { quantity: "50 Wicks", average_burn_time: "30-40 Mins", ghee_type: "Pure Cow Ghee" }
      },
      {
        name: "Premium Natural Incense Sticks (Agarbatti, 100g)",
        slug: "premium-natural-incense-sticks-100g",
        description: "Charcoal-free incense sticks hand-rolled with temple flowers and natural essential oils. Low smoke, long-lasting fragrance.",
        price: 110.00, salePrice: 85.00, sku: "PS-ESS-INC-100",
        weight_grams: 120, is_perishable: false,
        image_url: IMG("srp_inc_002_1779533220598.png"),
        attributes: { fragrance: "Mogra & Champa Blend", stick_count: "~60-70", composition: "Charcoal-free" }
      }
    ]
  }
];

async function main() {
  console.log('Seeding database with all Quick Commerce products and local images...');

  // Clean old combo (if exists) to avoid duplicate seeding
  await prisma.combo.deleteMany({});

  for (const cat of seedData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: cat.image },
      create: {
        name: cat.category,
        slug: cat.slug,
        image: cat.image,
      },
    });

    for (const prod of cat.products) {
      const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
      if (existing) {
        // Update image if product exists
        await prisma.product.update({
          where: { slug: prod.slug },
          data: {
            price: prod.price,
            salePrice: prod.salePrice,
            weightGrams: prod.weight_grams,
            isPerishable: prod.is_perishable,
            attributes: prod.attributes,
          }
        });
        // Update image record
        const imgs = await prisma.productImage.findMany({ where: { productId: existing.id } });
        if (imgs.length === 0) {
          await prisma.productImage.create({
            data: { url: prod.image_url, publicId: prod.slug, productId: existing.id }
          });
        } else {
          await prisma.productImage.update({
            where: { id: imgs[0].id },
            data: { url: prod.image_url }
          });
        }
      } else {
        await prisma.product.create({
          data: {
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
              create: [{ url: prod.image_url, publicId: prod.slug }]
            }
          },
        });
      }
    }
    console.log(`✅ Seeded category: ${cat.category} (${cat.products.length} products)`);
  }

  // Seed Combos
  console.log('Seeding Combo kits...');
  const allProducts = await prisma.product.findMany({ take: 4 });
  if (allProducts.length >= 2) {
    await prisma.combo.create({
      data: {
        name: "Daily Pooja Essentials Kit",
        description: "Everything you need for your daily morning pooja. Incense, Diyas, Kumkum, and Sacred Thread — all in one bundle at a sacred discount.",
        price: 599.00,
        salePrice: 480.00,
        isActive: true,
        products: { connect: allProducts.slice(0, 4).map(p => ({ id: p.id })) }
      }
    });
    await prisma.combo.create({
      data: {
        name: "Temple-Grade Festival Pack",
        description: "Curated for grand festival poojas — brass diya, idol, premium incense and sacred powder set. The complete pooja samagri.",
        price: 1299.00,
        salePrice: 999.00,
        isActive: true,
        products: { connect: allProducts.slice(0, 3).map(p => ({ id: p.id })) }
      }
    });
  }

  console.log('\n🎉 Database seeding completed successfully!');
  console.log(`Total categories: ${seedData.length}`);
  console.log(`Total products: ${seedData.reduce((acc, c) => acc + c.products.length, 0)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
