import { ProductCard } from "../product/ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import api from "../../api/axios";
import type { Product } from "../../types";
import placeholderImage from "../../assets/pooja-placeholder.svg";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  category?: string;
}

const fallbackProducts: Product[] = [
  {
    id: "fallback-1",
    name: "Premium Pooja Thali Set",
    slug: "premium-pooja-thali-set",
    description: "Essential brass thali set for daily rituals and festive pujas.",
    price: 1299,
    salePrice: 999,
    discount: 23,
    sku: "POOJA-001",
    stock: 12,
    isAvailable: true,
    categoryId: "fallback-category",
    category: { id: "fallback-category", name: "Puja Items", slug: "puja-items" },
    images: [{ id: "fallback-image-1", url: placeholderImage, publicId: "local-placeholder" }],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-2",
    name: "Lakshmi Ganesh Idol Pair",
    slug: "lakshmi-ganesh-idol-pair",
    description: "Decorative idol pair suitable for home mandirs and gifting.",
    price: 2499,
    salePrice: 2199,
    discount: 12,
    sku: "POOJA-002",
    stock: 8,
    isAvailable: true,
    categoryId: "fallback-category-2",
    category: { id: "fallback-category-2", name: "Idols & Frames", slug: "idols-frames" },
    images: [{ id: "fallback-image-2", url: placeholderImage, publicId: "local-placeholder" }],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-3",
    name: "Fragrant Camphor and Incense Box",
    slug: "fragrant-camphor-and-incense-box",
    description: "Daily-use incense and camphor combo for peaceful aarti sessions.",
    price: 399,
    salePrice: 329,
    discount: 18,
    sku: "POOJA-003",
    stock: 25,
    isAvailable: true,
    categoryId: "fallback-category-3",
    category: { id: "fallback-category-3", name: "Incense & Oils", slug: "incense-oils" },
    images: [{ id: "fallback-image-3", url: placeholderImage, publicId: "local-placeholder" }],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

export function ProductCarousel({ title, subtitle, category }: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { category, limit: 10 }
        });
        setProducts(response.data.data);
      } catch (error) {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="py-16 bg-puja-bg/50 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-puja-bg/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-puja-text mb-2">{title}</h2>
            {subtitle && <p className="text-puja-muted font-inter">{subtitle}</p>}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-gray-200 bg-white hover:bg-saffron-500 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-gray-200 bg-white hover:bg-saffron-500 hover:text-white transition-all shadow-sm"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <ProductCard product={{
                ...product,
                image: product.images[0]?.url || placeholderImage,
                category: product.category?.name || "General"
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
