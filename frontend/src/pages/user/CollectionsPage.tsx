import { ProductCard } from "../../components/product/ProductCard";
import { SlidersHorizontal, ChevronDown, FilterX, Grid3X3, Layers } from "lucide-react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";
import { getCategoryImage, sortCategoriesByCanonical, isCanonicalCategory } from "../../constants/categoryImages";

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
  material?: string;
  weight?: string;
  [key: string]: unknown;
}

const INITIAL_FILTERS = {
  category: "",
  sort: "newest",
  minPrice: 0,
  maxPrice: 10000,
  inStock: false,
  isSouthIndian: false,
  search: "",
};

export function CollectionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grouped" | "grid">("grouped");
  const [activeSection, setActiveSection] = useState("");
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    category: searchParams.get("category") || "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sidebarListRef = useRef<HTMLDivElement>(null);
  const isSingleCategory = Boolean(filters.category);

  // Debounce filter changes (especially search & price slider)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 350);
    return () => clearTimeout(timer);
  }, [filters]);

  // Sync URL → filter when landing from homepage category card
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat && urlCat !== filters.category) {
      setFilters((prev) => ({ ...prev, category: urlCat }));
    }
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products", {
          params: {
            limit: isSingleCategory ? 50 : 150,
            sort: debouncedFilters.sort,
            search: debouncedFilters.search || undefined,
            minPrice: debouncedFilters.minPrice || undefined,
            maxPrice: debouncedFilters.maxPrice < 10000 ? debouncedFilters.maxPrice : undefined,
            inStock: debouncedFilters.inStock || undefined,
            isSouthIndian: debouncedFilters.isSouthIndian || undefined,
            category: debouncedFilters.category || undefined,
          },
        }),
        api.get("/categories"),
      ]);
      const prods: Product[] = Array.isArray(prodRes.data.data) ? prodRes.data.data : [];
      const cats: Category[] = Array.isArray(catRes.data.data) ? catRes.data.data : [];
      const canonical = sortCategoriesByCanonical(
        cats.filter(
          (c) =>
            (c._count?.products ?? 0) > 0 &&
            isCanonicalCategory(c.slug)
        )
      );
      setAllProducts(prods);
      setCategories(canonical);
    } catch (error) {
      console.error("Failed to fetch collections", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, isSingleCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, { products: Product[]; catObj: Category | null }> = {};

    if (filters.category) {
      const cat = categories.find((c) => c.slug === filters.category);
      const filtered = allProducts.filter((p) => p.category?.slug === filters.category);
      groups[cat?.name || filters.category] = { products: filtered, catObj: cat || null };
      return groups;
    }

    for (const cat of categories) {
      const products = allProducts.filter((p) => p.category?.slug === cat.slug);
      if (products.length > 0) {
        groups[cat.name] = { products, catObj: cat };
      }
    }
    return groups;
  }, [allProducts, categories, filters.category]);

  const groupedEntries = useMemo(
    () => Object.entries(groupedProducts).filter(([, g]) => g.products.length > 0),
    [groupedProducts]
  );

  // Scroll-spy: highlight sidebar as user scrolls through category sections
  useEffect(() => {
    if (isSingleCategory || viewMode !== "grouped" || groupedEntries.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0];
        if (top) {
          const slug = top.target.getAttribute("data-category-slug");
          if (slug) setActiveSection(slug);
        }
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    groupedEntries.forEach(([, { catObj }]) => {
      const slug = catObj?.slug;
      if (slug && categoryRefs.current[slug]) {
        observer.observe(categoryRefs.current[slug]!);
      }
    });

    return () => observer.disconnect();
  }, [groupedEntries, isSingleCategory, viewMode]);

  // Auto-scroll sidebar list to keep active category visible
  useEffect(() => {
    if (!activeSection || !sidebarListRef.current) return;
    const btn = sidebarListRef.current.querySelector(`[data-sidebar-slug="${activeSection}"]`);
    btn?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSection]);

  const scrollToCategory = (slug: string) => {
    const el = categoryRefs.current[slug];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(slug);
    }
  };

  const selectCategory = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
      setFilters((prev) => ({ ...prev, category: slug }));
    } else {
      setSearchParams({});
      setFilters((prev) => ({ ...prev, category: "" }));
      setActiveSection("");
    }
    setIsMobileFiltersOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const browseCategorySection = (slug: string) => {
    if (isSingleCategory) {
      selectCategory(slug);
      return;
    }
    if (!slug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
      setIsMobileFiltersOpen(false);
      return;
    }
    scrollToCategory(slug);
    setIsMobileFiltersOpen(false);
  };

  const totalCount = allProducts.length;
  const activeCategoryName = filters.category
    ? categories.find((c) => c.slug === filters.category)?.name
    : null;

  const sidebarActiveSlug = filters.category || activeSection;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 md:pb-10">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 md:static">
        <div className="container mx-auto px-4 py-5 md:py-10">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600">
                Home / {activeCategoryName ? activeCategoryName : "Shop"}
              </nav>
              <h1 className="text-2xl md:text-5xl font-playfair font-bold text-puja-text tracking-tight">
                {activeCategoryName || "Divine Inventory"}
              </h1>
              <p className="text-xs md:text-sm text-puja-muted italic">
                {loading ? "Loading..." : `${totalCount} sacred items`}
              </p>
            </div>

            {/* Mobile: horizontal category chips */}
            <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-2 pb-1">
              <button
                onClick={() => selectCategory("")}
                className={`shrink-0 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  !filters.category
                    ? "bg-saffron-500 border-saffron-500 text-white"
                    : "bg-white border-gray-200 text-puja-muted"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.slug)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    filters.category === cat.slug || activeSection === cat.slug
                      ? "bg-saffron-500 border-saffron-500 text-white"
                      : "bg-white border-gray-200 text-puja-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="md:hidden flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <div className="hidden md:flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`p-2.5 rounded-xl ${viewMode === "grouped" ? "bg-white shadow text-saffron-600" : "text-gray-400"}`}
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl ${viewMode === "grid" ? "bg-white shadow text-saffron-600" : "text-gray-400"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
              <div className="relative flex-1 md:w-56">
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full bg-white px-4 py-3 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest appearance-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-puja-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Sidebar — desktop */}
          <aside
            className={`w-full md:w-64 lg:w-72 shrink-0 ${isMobileFiltersOpen ? "block" : "hidden md:block"}`}
          >
            <div className="bg-white p-5 md:p-7 rounded-3xl shadow-lg border border-gray-100 md:sticky md:top-24 space-y-6 max-h-[70vh] md:max-h-[calc(100vh-8rem)] flex flex-col">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="font-playfair font-bold text-xl text-puja-text">Categories</h3>
                {filters.category && (
                  <button
                    onClick={() => selectCategory("")}
                    className="text-[10px] font-black uppercase text-red-500"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div
                ref={sidebarListRef}
                className="space-y-1.5 overflow-y-auto flex-1 -mr-1 pr-1 scrollbar-thin"
              >
                <button
                  data-sidebar-slug=""
                  onClick={() => (isSingleCategory ? selectCategory("") : browseCategorySection(""))}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left text-sm font-bold transition-all ${
                    !sidebarActiveSlug
                      ? "bg-saffron-50 border-saffron-200 text-saffron-700"
                      : "border-transparent text-puja-text hover:bg-gray-50"
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[10px] opacity-50">({totalCount})</span>
                </button>
                {categories.map((cat) => {
                  const count =
                    cat._count?.products ??
                    allProducts.filter((p) => p.category?.slug === cat.slug).length;
                  const isActive = sidebarActiveSlug === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      data-sidebar-slug={cat.slug}
                      onClick={() =>
                        isSingleCategory ? selectCategory(cat.slug) : browseCategorySection(cat.slug)
                      }
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left text-sm font-bold transition-all ${
                        isActive
                          ? "bg-saffron-50 border-saffron-200 text-saffron-700"
                          : "border-transparent text-puja-text hover:bg-gray-50"
                      }`}
                    >
                      <span className="line-clamp-2 pr-2">{cat.name}</span>
                      <span className="text-[10px] opacity-40 shrink-0">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="shrink-0 pt-4 border-t border-gray-50">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : totalCount === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <FilterX className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold mb-4">No items found</h3>
                <button
                  onClick={() => {
                    setFilters({ ...INITIAL_FILTERS, category: "" });
                    navigate("/collections");
                  }}
                  className="bg-saffron-500 text-white px-8 py-3 rounded-xl font-bold"
                >
                  Reset
                </button>
              </div>
            ) : viewMode === "grid" || isSingleCategory ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {(isSingleCategory ? groupedEntries[0]?.[1].products ?? allProducts : allProducts).map(
                  (product) => (
                    <ProductCard key={product.id} product={product as any} />
                  )
                )}
              </div>
            ) : (
              <div className="space-y-12 md:space-y-20">
                {groupedEntries.map(([catName, { products, catObj }]) => {
                  const slug = catObj?.slug || catName;
                  return (
                    <section
                      key={catName}
                      ref={(el) => {
                        categoryRefs.current[slug] = el as HTMLDivElement | null;
                      }}
                      data-category-slug={slug}
                      className="scroll-mt-28"
                    >
                      <div className="flex items-center gap-4 mb-5 md:mb-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-saffron-100 shrink-0">
                          <img
                            src={getCategoryImage(slug, catObj?.image)}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholderImage;
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-saffron-600">
                            {products.length} items
                          </span>
                          <h2 className="text-xl md:text-3xl font-playfair font-bold text-puja-text">
                            {catName}
                          </h2>
                        </div>
                        <button
                          onClick={() => selectCategory(slug)}
                          className="ml-auto text-[10px] font-black uppercase tracking-widest text-saffron-600 hover:underline shrink-0"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                        {products.map((product) => (
                          <ProductCard key={product.id} product={product as any} />
                        ))}
                      </div>
                    </section>
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
