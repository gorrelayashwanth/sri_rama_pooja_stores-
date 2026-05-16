import { ShoppingCart, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { Product } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguage();
  const hasDiscount = product.discount && product.discount > 0;
  const productImage = product.images?.[0]?.url || "/placeholder-product.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100/50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#fdfaf7]">
        <Link to={`/products/${product.slug}`}>
          <img 
            src={productImage} 
            alt={t(product.name, product.translations, 'name')}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {hasDiscount && (
            <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30">
              {product.discount}% OFF
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-saffron-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-saffron-500/30 flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" /> Featured
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
          <button className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl text-puja-text hover:bg-saffron-500 hover:text-white shadow-xl shadow-black/5 transition-all active:scale-90">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add to Cart - Desktop */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 bg-[#2d4a2d] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transform translate-y-24 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 shadow-2xl shadow-green-950/20 hover:bg-black"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-saffron-600 font-black uppercase tracking-[0.2em]">
            {product.category?.name || "General"}
          </p>
          {(product.material || product.weight) && (
            <span className="text-[9px] text-puja-muted font-bold uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded">
              {product.material || product.weight}
            </span>
          )}
        </div>
        
        <Link to={`/products/${product.slug}`} className="hover:text-saffron-600 transition-colors">
          <h3 className="font-playfair font-bold text-puja-text text-base line-clamp-2 mb-3 min-h-[48px] leading-tight">
            {t(product.name, product.translations, 'name')}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-puja-text">
                ₹{product.salePrice || product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-puja-muted line-through font-medium">
                  ₹{product.price}
                </span>
              )}
            </div>
            {product.unit && (
              <span className="text-[10px] text-puja-muted font-medium mt-1">per {product.unit}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="md:hidden bg-saffron-50 text-saffron-600 p-3 rounded-2xl hover:bg-saffron-500 hover:text-white transition-all active:scale-90"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}