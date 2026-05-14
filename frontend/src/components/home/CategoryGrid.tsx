import { Link } from "react-router-dom";
import pujaItemsImage from "../../assets/home/puja-items.png";
import idolsAndFramesImage from "../../assets/home/idols-and-frames.png";
import incenseAndOilsImage from "../../assets/home/incense-and-oils.png";
import festivalSuppliesImage from "../../assets/home/festival-supplies.png";
import brasswareImage from "../../assets/home/brassware.png";

const categories = [
  {
    name: "PUJA ITEMS",
    subtitle: "Thalis, bells, lamps & daily worship essentials",
    slug: "puja-items",
    image: pujaItemsImage
  },
  {
    name: "IDOLS & FRAMES",
    subtitle: "Beautifully crafted deity idols & sacred frames",
    slug: "idols-frames",
    image: idolsAndFramesImage
  },
  {
    name: "INCENSE & OILS",
    subtitle: "Premium agarbatti, camphor & fragrant oils",
    slug: "incense-oils",
    image: incenseAndOilsImage
  },
  {
    name: "FESTIVAL SUPPLIES",
    subtitle: "Kumkum, turmeric, flowers & festive décor",
    slug: "festival-supplies",
    image: festivalSuppliesImage
  },
  {
    name: "BRASSWARE",
    subtitle: "Ornate brass lamps, vessels & traditional utensils",
    slug: "brassware",
    image: brasswareImage
  }
];

export function CategoryGrid() {
  return (
    <section className="py-24 bg-puja-bg relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-divine-pattern" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              to={`/collections/${category.slug}`}
              className="group relative h-[400px] overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-700 hover:-translate-y-2"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                <h3 className="text-2xl font-playfair font-bold text-white mb-2 tracking-wider">
                  {category.name}
                </h3>
                <p className="text-saffron-200 text-sm font-medium italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {category.subtitle}
                </p>
                
                {/* Decorative Line */}
                <div className="w-12 h-1 bg-saffron-500 mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
