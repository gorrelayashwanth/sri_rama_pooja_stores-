import { ProductCard } from "../../components/product/ProductCard";
import { SlidersHorizontal, ChevronDown, FilterX } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    sort: "newest",
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    festival: "",
    deity: "",
    isSouthIndian: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: filters }),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Failed to fetch collections", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const toggleCategory = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? "" : catId
    }));
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600">
              Home / Collections
            </nav>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text tracking-tight">Divine Inventory</h1>
            <p className="text-sm text-puja-muted italic">Showing {products.length} sacred items</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-[20px] border border-gray-100 text-xs font-black uppercase tracking-widest shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <div className="relative flex-1 md:w-72">
              <select 
                value={filters.sort}
                onChange={e => setFilters({...filters, sort: e.target.value})}
                className="w-full bg-white px-6 py-4 rounded-[20px] border border-gray-100 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-saffron-50 shadow-sm transition-all"
              >
                <option value="newest">Sort By: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-puja-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className={`w-full md:w-80 shrink-0 space-y-6 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-playfair font-bold text-2xl text-puja-text">Refine</h3>
                {(filters.category || filters.inStock) && (
                  <button 
                    onClick={() => setFilters({ ...filters, category: "", inStock: false, festival: "", deity: "", isSouthIndian: false })}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="space-y-10">
                {/* Categories */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-5">Categories</h4>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-sm font-bold ${
                          filters.category === cat.slug 
                            ? 'bg-saffron-50 border-saffron-200 text-saffron-700 translate-x-2' 
                            : 'bg-gray-50/50 border-transparent text-puja-text hover:bg-white hover:border-gray-100'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-40 font-medium">({cat._count?.products || 0})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Festivals */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-5">Shop by Festival</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Diwali", "Navratri", "Ganesh Chaturthi", "Mahashivaratri", "Janmashtami"].map(fest => (
                      <button 
                        key={fest}
                        onClick={() => setFilters(prev => ({ ...prev, festival: prev.festival === fest ? "" : fest }))}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          filters.festival === fest 
                            ? 'bg-saffron-500 border-saffron-500 text-white shadow-lg shadow-saffron-200' 
                            : 'bg-white border-gray-100 text-puja-muted hover:border-saffron-200'
                        }`}
                      >
                        {fest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deities */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-5">Shop by Deity</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Ganesha", "Lakshmi", "Shiva", "Krishna", "Hanuman", "Durga"].map(deity => (
                      <button 
                        key={deity}
                        onClick={() => setFilters(prev => ({ ...prev, deity: prev.deity === deity ? "" : deity }))}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          filters.deity === deity 
                            ? 'bg-puja-text border-puja-text text-white shadow-lg shadow-gray-200' 
                            : 'bg-white border-gray-100 text-puja-muted hover:border-gray-200'
                        }`}
                      >
                        {deity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-5">Price Ceiling (₹{filters.maxPrice})</h4>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      className="w-full accent-saffron-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                      min="0" 
                      max="10000" 
                      step="500"
                      value={filters.maxPrice}
                      onChange={e => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    />
                    <div className="flex justify-between text-[10px] font-black text-puja-muted uppercase tracking-widest">
                      <span>₹0</span>
                      <span>₹10,000+</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="pt-6 border-t border-gray-50 space-y-4">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-bold text-puja-text group-hover:text-saffron-600 transition-colors">South Indian Items Only</span>
                    <input 
                      type="checkbox" 
                      checked={filters.isSouthIndian}
                      onChange={e => setFilters({...filters, isSouthIndian: e.target.checked})}
                      className="w-6 h-6 rounded-lg border-gray-200 text-saffron-500 focus:ring-saffron-500 cursor-pointer" 
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-bold text-puja-text group-hover:text-saffron-600 transition-colors">In Stock Only</span>
                    <input 
                      type="checkbox" 
                      checked={filters.inStock}
                      onChange={e => setFilters({...filters, inStock: e.target.checked})}
                      className="w-6 h-6 rounded-lg border-gray-200 text-saffron-500 focus:ring-saffron-500 cursor-pointer" 
                    />
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                <FilterX className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-playfair font-bold text-puja-text mb-2">No items found</h3>
                <p className="text-puja-muted mb-8 italic">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => setFilters({ category: "", sort: "newest", minPrice: 0, maxPrice: 10000, inStock: false, festival: "", deity: "", isSouthIndian: false })}
                  className="bg-saffron-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-saffron-600 transition-all shadow-lg shadow-saffron-100"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {!loading && products.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-xs font-bold hover:bg-saffron-50 transition-all shadow-sm">Previous</button>
                <div className="flex gap-2">
                  <span className="w-10 h-10 rounded-xl bg-saffron-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-saffron-100">1</span>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-xs font-bold hover:bg-saffron-50 transition-all shadow-sm">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

