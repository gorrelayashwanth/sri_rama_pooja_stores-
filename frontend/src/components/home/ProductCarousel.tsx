import { ProductCard } from "../product/ProductCard";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  category?: string;
  type?: 'bestselling' | 'newest';
}

export function ProductCarousel({ title, subtitle, category, type }: ProductCarouselProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { category, type, limit: 10 }
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch carousel products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, type]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="py-24 bg-gray-50/30 flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="w-[320px] aspect-[3/4] bg-gray-100 rounded-[32px] animate-pulse shrink-0" />
        ))}
      </div>
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron-600 block">Curated Selection</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text tracking-tight">{title}</h2>
            {subtitle && <p className="text-puja-muted italic text-sm">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-between">
            <Link 
              to="/collections" 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-puja-text hover:text-saffron-600 transition-colors"
            >
              View All Items <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            
            <div className="flex gap-3">
              <button 
                onClick={() => scroll('left')}
                className="p-4 rounded-2xl border border-gray-100 bg-white text-puja-text hover:bg-saffron-500 hover:text-white transition-all shadow-xl shadow-gray-200/20 active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-4 rounded-2xl border border-gray-100 bg-white text-puja-text hover:bg-saffron-500 hover:text-white transition-all shadow-xl shadow-gray-200/20 active:scale-95"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-10 -mx-4 px-4 mask-edge-fade"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[340px] snap-start">
              <ProductCard product={{
                ...product,
                image: product.images?.[0]?.url || placeholderImage,
                category: product.category?.name || "Sacred Item"
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

