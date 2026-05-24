import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";
import { getCategoryImage, sortCategoriesByCanonical, isCanonicalCategory } from "../../constants/categoryImages";

export function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = sessionStorage.getItem('categories_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.ts < 5 * 60 * 1000) {
            setCategories(parsed.data);
            setLoading(false);
          }
        }

        const response = await api.get('/categories');
        const data = response.data?.data;
        const list = Array.isArray(data) ? data : [];
        const withProducts = list.filter(
          (c: { _count?: { products: number }; slug: string }) =>
            (c._count?.products ?? 0) > 0 && isCanonicalCategory(c.slug)
        );
        const sorted = sortCategoriesByCanonical(withProducts);
        setCategories(sorted);
        sessionStorage.setItem('categories_cache', JSON.stringify({ data: sorted, ts: Date.now() }));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-divine-pattern" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron-600 mb-3 block">
            Sacred Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-puja-text">Divine Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-56 sm:h-72 md:h-[400px] rounded-3xl md:rounded-[2.5rem] bg-gray-50 animate-pulse border border-gray-100" />
            ))
          ) : categories.length === 0 ? (
            <p className="col-span-full text-center text-puja-muted py-12">
              Categories are loading. Please refresh shortly.
            </p>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/collections?category=${category.slug}`}
                className="group relative h-56 sm:h-72 md:h-[400px] overflow-hidden rounded-3xl md:rounded-[2.5rem] shadow-lg md:shadow-xl shadow-gray-200/40 transition-all duration-500 active:scale-[0.98] md:hover:-translate-y-2 border border-gray-100"
              >
                <img
                  src={getCategoryImage(category.slug, category.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholderImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                  <h3 className="text-xl md:text-3xl font-playfair font-bold text-white mb-2 md:mb-3 tracking-wide md:group-hover:text-saffron-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-saffron-100 text-[10px] md:text-xs font-black uppercase tracking-widest md:opacity-0 md:group-hover:opacity-100 transition-all">
                    Explore Collection →
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
