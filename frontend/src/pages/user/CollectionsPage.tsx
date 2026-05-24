import { ProductCard } from "../../components/product/ProductCard";
import { SlidersHorizontal, ChevronDown, FilterX, Grid3X3, Layers } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  _count?: { products: number };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images?: { url: string }[];
  category?: { name: string; slug: string };
  isPerishable?: boolean;
  isFeatured?: boolean;
  discount?: number;
  [key: string]: any;
}

export function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grouped" | "grid">("grouped");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    sort: "newest",
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    festival: "",
    deity: "",
    isSouthIndian: false,
    search: ""
  });

  const categoryRefs = useRef<{ [slug: string]: HTMLDivElement | null }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products", {
          params: {
            ...filters,
            limit: 200, // get all products at once
            category: filters.category || undefined,
          }
        }),
        api.get("/categories")
      ]);
      const prods: Product[] = Array.isArray(prodRes.data.data) ? prodRes.data.data : [];
      setAllProducts(prods);
      setCategories(Array.isArray(catRes.data.data) ? catRes.data.data : []);
    } catch (error) {
      console.error("Failed to fetch collections", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Update category filter when URL param changes
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat) {
      setFilters(prev => ({ ...prev, category: urlCat }));
    }
  }, [searchParams]);

  const toggleCategory = (catSlug: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catSlug ? "" : catSlug
    }));
  };

  const scrollToCategory = (slug: string) => {
    const el = categoryRefs.current[slug];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Group products by category
  const groupedProducts: { [catName: string]: { products: Product[]; catObj: Category | null } } = {};

  if (filters.category) {
    // Single category mode
    const cat = categories.find(c => c.slug === filters.category || c.id === filters.category);
    const filtered = allProducts.filter(
      p => p.category?.slug === filters.category || p.category?.slug === cat?.slug
    );
    groupedProducts[cat?.name || filters.category] = { products: filtered, catObj: cat || null };
  } else {
    // Group all products by category
    allProducts.forEach(prod => {
      const catName = prod.category?.name || "Other";
      if (!groupedProducts[catName]) {
        const catObj = categories.find(c => c.name === catName) || null;
        groupedProducts[catName] = { products: [], catObj };
      }
      groupedProducts[catName].products.push(prod);
    });
  }

  const totalCount = allProducts.length;
  const activeCategoryName = filters.category
    ? categories.find(c => c.slug === filters.category || c.id === filters.category)?.name || filters.category
    : null;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600">
                Home / {activeCategoryName ? `Collections / ${activeCategoryName}` : "All Collections"}
              </nav>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text tracking-tight">
                {activeCategoryName ? activeCategoryName : "Divine Inventory"}
              </h1>
              <p className="text-sm text-puja-muted italic">
                {loading ? "Loading sacred items..." : `${totalCount} sacred items across ${Object.keys(groupedProducts).length} categories`}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* View Toggle */}
              <div className="hidden md:flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "grouped" ? "bg-white shadow text-saffron-600" : "text-gray-400"}`}
                  title="Category View"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white shadow text-saffron-600" : "text-gray-400"}`}
                  title="Grid View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white px-6 py-3.5 rounded-2xl border border-gray-100 text-xs font-black uppercase tracking-widest shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>

              {/* Sort */}
              <div className="relative flex-1 md:w-64">
                <select
                  value={filters.sort}
                  onChange={e => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full bg-white px-5 py-3.5 rounded-2xl border border-gray-100 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-saffron-50 shadow-sm transition-all"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="popular">Popularity</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-puja-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">

          {/* ── Sidebar ── */}
          <aside className={`w-full md:w-72 shrink-0 space-y-5 ${isMobileFiltersOpen ? "block" : "hidden md:block"}`}>
            <div className="bg-white p-7 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-playfair font-bold text-2xl text-puja-text">Refine</h3>
                {(filters.category || filters.inStock || filters.festival || filters.deity) && (
                  <button
                    onClick={() => setFilters({ category: "", sort: "newest", minPrice: 0, maxPrice: 10000, inStock: false, festival: "", deity: "", isSouthIndian: false, search: "" })}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <FilterX className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>

              {/* Search */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-3">Search</h4>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saffron-200"
                />
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-4">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => toggleCategory("")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-sm font-bold ${
                      !filters.category
                        ? "bg-saffron-50 border-saffron-200 text-saffron-700 translate-x-1"
                        : "bg-gray-50/50 border-transparent text-puja-text hover:bg-white hover:border-gray-100"
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-[10px] opacity-50 font-medium">({totalCount})</span>
                  </button>
                  {categories.map(cat => {
                    const catProductCount = cat._count?.products ?? allProducts.filter(p => p.category?.name === cat.name).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          toggleCategory(cat.slug);
                          if (viewMode === "grouped") scrollToCategory(cat.slug);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-sm font-bold ${
                          filters.category === cat.slug
                            ? "bg-saffron-50 border-saffron-200 text-saffron-700 translate-x-1"
                            : "bg-gray-50/50 border-transparent text-puja-text hover:bg-white hover:border-gray-100"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-40 font-medium">({catProductCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-3">
                  Max Price: ₹{filters.maxPrice.toLocaleString()}
                </h4>
                <input
                  type="range"
                  className="w-full accent-saffron-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  min="0" max="10000" step="500"
                  value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                />
                <div className="flex justify-between text-[10px] font-black text-puja-muted mt-2">
                  <span>₹0</span><span>₹10,000+</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-puja-text">🌿 Fresh / Perishable</span>
                  <input type="checkbox" checked={filters.inStock} onChange={e => setFilters({ ...filters, inStock: e.target.checked })} className="w-5 h-5 rounded-lg border-gray-200 text-saffron-500 cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-puja-text">In Stock Only</span>
                  <input type="checkbox" checked={filters.isSouthIndian} onChange={e => setFilters({ ...filters, isSouthIndian: e.target.checked })} className="w-5 h-5 rounded-lg border-gray-200 text-saffron-500 cursor-pointer" />
                </label>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-16">
                {[1, 2, 3].map(i => (
                  <div key={i}>
                    <div className="h-8 bg-gray-200 rounded-full w-56 mb-6 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="aspect-[3/4] bg-gray-100 rounded-[32px] animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : totalCount === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                <FilterX className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-playfair font-bold text-puja-text mb-2">No items found</h3>
                <p className="text-puja-muted mb-8 italic">Try adjusting your filters.</p>
                <button
                  onClick={() => setFilters({ category: "", sort: "newest", minPrice: 0, maxPrice: 10000, inStock: false, festival: "", deity: "", isSouthIndian: false, search: "" })}
                  className="bg-saffron-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-saffron-600 transition-all shadow-lg shadow-saffron-100"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              // ── Flat Grid Mode ──
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts.map(product => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              // ── Grouped by Category Mode ──
              <div className="space-y-20">
                {Object.entries(groupedProducts).map(([catName, { products, catObj }]) => {
                  if (products.length === 0) return null;
                  const catImage = catObj?.image;
                  return (
                    <div
                      key={catName}
                      ref={el => { categoryRefs.current[catObj?.slug || catName] = el; }}
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-5 mb-8">
                        {catImage && (
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-saffron-100 shadow-lg shrink-0">
                            <img
                              src={catImage}
                              alt={catName}
                              className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = placeholderImage; }}
                            />
                          </div>
                        )}
                        <div className="flex-1 flex items-center gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-saffron-600 block mb-1">
                              {products.length} Items
                            </span>
                            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-puja-text">{catName}</h2>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-saffron-200 to-transparent ml-4 hidden md:block" />
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                          <ProductCard key={product.id} product={product as any} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
