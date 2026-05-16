import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";

export function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-divine-pattern" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron-600 mb-3 block">Sacred Collections</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text">Divine Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="h-[400px] rounded-[2.5rem] bg-gray-50 animate-pulse border border-gray-100" />
            ))
          ) : categories.map((category) => (
            <Link 
              key={category.id}
              to={`/collections?category=${category.id}`}
              className="group relative h-[400px] overflow-hidden rounded-[2.5rem] shadow-xl shadow-gray-200/40 transition-all duration-700 hover:-translate-y-2 border border-gray-100"
            >
              <img 
                src={category.image || placeholderImage} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <h3 className="text-3xl font-playfair font-bold text-white mb-3 tracking-wider group-hover:text-saffron-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-saffron-100 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  Explore Collection
                </p>
                
                {/* Decorative Line */}
                <div className="w-16 h-1.5 bg-saffron-500 mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

