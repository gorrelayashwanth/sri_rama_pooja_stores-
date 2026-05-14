import { ProductCard } from "../../components/product/ProductCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";
import placeholderImage from "../../assets/pooja-placeholder.svg";

const mockProducts = [
  {
    id: "1",
    name: "Complete Deepavali Pooja Kit - Premium Edition",
    slug: "premium-deepavali-kit",
    price: 1499,
    salePrice: 1299,
    image: placeholderImage,
    category: "Pooja Kits",
    discount: 13
  },
  {
    id: "2",
    name: "Handcrafted Brass Lakshmi Ganesha Idols (6 Inch)",
    slug: "brass-lakshmi-ganesha",
    price: 3499,
    salePrice: 2999,
    image: placeholderImage,
    category: "Idols & Murtis",
    discount: 14
  },
  {
    id: "3",
    name: "Traditional Peacock Design Brass Diya Set",
    slug: "peacock-brass-diya",
    price: 899,
    image: placeholderImage,
    category: "Brass & Copper"
  },
  {
    id: "4",
    name: "Pure Mysore Sandalwood Incense Sticks (100g)",
    slug: "mysore-sandalwood-incense",
    price: 299,
    salePrice: 249,
    image: placeholderImage,
    category: "Incense & Dhoop",
    discount: 16
  },
  {
    id: "5",
    name: "Designer Floral Pooja Thali Set - Golden",
    slug: "floral-pooja-thali",
    price: 1299,
    salePrice: 999,
    image: placeholderImage,
    category: "Pooja Thali Sets",
    discount: 23
  },
  {
    id: "6",
    name: "Ganesh Chaturthi Special Pooja Samagri Kit",
    slug: "ganesh-chaturthi-kit",
    price: 799,
    salePrice: 649,
    image: placeholderImage,
    category: "Pooja Kits",
    discount: 19
  }
];

export function CollectionsPage() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="bg-puja-bg/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <nav className="text-[10px] font-bold uppercase tracking-widest text-saffron-600 mb-2">
              Home / Collections
            </nav>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-puja-text">Our Collections</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <div className="relative flex-1 md:w-64">
              <select className="w-full bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-saffron-100">
                <option>Sort By: Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-puja-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`w-full md:w-72 shrink-0 space-y-6 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-playfair font-bold text-xl mb-6">Refine Search</h3>
              
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h4 className="font-inter font-bold text-xs uppercase tracking-widest text-saffron-600 mb-4">Categories</h4>
                  <div className="space-y-3">
                    {["Pooja Kits", "Brass & Copper", "Incense & Dhoop", "Idols & Murtis", "Pooja Thali Sets", "Gift Sets"].map(cat => (
                      <label key={cat} className="flex items-center gap-3 text-sm text-puja-text cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-saffron-500 focus:ring-saffron-500 cursor-pointer" 
                        />
                        <span className="group-hover:text-saffron-600 transition-colors font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-inter font-bold text-xs uppercase tracking-widest text-saffron-600 mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input type="range" className="w-full accent-saffron-500" min="0" max="5000" />
                    <div className="flex justify-between text-xs font-bold text-puja-muted">
                      <span>₹0</span>
                      <span>₹5,000+</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-inter font-bold text-xs uppercase tracking-widest text-saffron-600 mb-4">Availability</h4>
                  <label className="flex items-center gap-3 text-sm text-puja-text cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-saffron-500 focus:ring-saffron-500" />
                    <span className="font-medium">In Stock Only</span>
                  </label>
                </div>
              </div>

              <button className="w-full mt-8 bg-puja-text text-white py-3 rounded-xl font-bold hover:bg-saffron-600 transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-all">1</button>
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-all">2</button>
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-all">3</button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-all">8</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
