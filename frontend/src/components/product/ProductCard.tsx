import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    image: string;
    category: string;
    discount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const hasDiscount = product.discount && product.discount > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/products/${product.slug}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-saffron-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.discount}% Off
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-puja-text hover:bg-saffron-500 hover:text-white shadow-sm transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add to Cart - Desktop */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-saffron-500 text-white py-3 font-semibold text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-[10px] text-saffron-600 font-bold uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <Link to={`/products/${product.slug}`} className="hover:text-saffron-500 transition-colors">
          <h3 className="font-inter font-semibold text-puja-text text-sm line-clamp-2 mb-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-puja-text">
              ₹{product.salePrice || product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-puja-muted line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          
          {/* Add to Cart - Mobile only (visible when button is hidden) */}
          <button 
            onClick={handleAddToCart}
            className="md:hidden bg-saffron-50 text-saffron-600 p-2 rounded-lg hover:bg-saffron-600 hover:text-white transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}