import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { ProductCarousel } from "../../components/home/ProductCarousel";
import { useCartStore } from "../../store/cartStore";
import placeholderImage from "../../assets/pooja-placeholder.svg";

export function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addItem = useCartStore((state) => state.addItem);

  // ... (keep product object for now until real fetch is fully implemented)

  const handleAddToCart = () => {
    addItem({
      id: "1", // Use real ID in production
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0],
      quantity: quantity
    });
  };

  const product = {
    name: "Complete Deepavali Pooja Kit - Premium Edition",
    price: 1499,
    salePrice: 1299,
    discount: 13,
    rating: 4.8,
    reviews: 124,
    sku: "PS-DK-2026",
    availability: "In Stock",
    category: "Pooja Kits",
    images: [
      placeholderImage,
      placeholderImage,
      placeholderImage
    ],
    description: "Our Premium Deepavali Pooja Kit is carefully curated to provide everything you need for a traditional and spiritually uplifting Diwali celebration. Each item is handpicked for its quality and significance.",
    details: [
      "Includes 25+ essential items for Lakshmi Pooja",
      "Premium quality brass diya included",
      "Authentic Gangajal and Gomutra",
      "Handcrafted cotton wicks and pure ghee",
      "Step-by-step pooja vidhi guide included"
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-saffron-500 transition-all bg-gray-50">
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-saffron-600 mb-4">
              <span>Home</span>
              <span>/</span>
              <span>{product.category}</span>
              <span>/</span>
              <span className="text-puja-muted">{product.name}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-puja-text leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-gold-500' : 'fill-gray-200 text-gray-200'}`} />
                ))}
                <span className="text-sm font-bold text-puja-text ml-2">{product.rating}</span>
                <span className="text-sm text-puja-muted font-medium">({product.reviews} Reviews)</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> {product.availability}
              </span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-bold text-puja-text">₹{product.salePrice}</span>
              <span className="text-xl text-puja-muted line-through mb-1">₹{product.price}</span>
              <span className="bg-saffron-100 text-saffron-600 text-xs font-bold px-3 py-1 rounded-full mb-1">
                SAVE {product.discount}%
              </span>
            </div>

            <p className="text-puja-muted leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            {/* Actions */}
            <div className="space-y-6 mt-auto">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center border-2 border-gray-100 rounded-xl p-1 bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-saffron-600 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-puja-text">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:text-saffron-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white py-4 px-8 rounded-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-saffron-100"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </button>

                <button className="p-4 rounded-xl border-2 border-gray-100 hover:border-saffron-500 hover:text-saffron-500 transition-all group">
                  <Heart className="h-6 w-6 group-hover:fill-saffron-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm font-medium text-puja-text">
                  <Truck className="h-5 w-5 text-saffron-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-puja-text">
                  <RotateCcw className="h-5 w-5 text-saffron-500" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-puja-text">
                  <Share2 className="h-5 w-5 text-saffron-500" />
                  <span>Share Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20">
          <div className="flex border-b border-gray-100 gap-10">
            {["description", "details", "reviews"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-saffron-600' : 'text-puja-muted hover:text-puja-text'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-saffron-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-10">
            {activeTab === "description" && (
              <div className="prose prose-puja max-w-none text-puja-muted leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">
                  Bring divine energy to your home with our carefully assembled pooja kits. Each component is sourced from traditional artisans and follows authentic Vedic specifications.
                </p>
              </div>
            )}
            {activeTab === "details" && (
              <ul className="space-y-4">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-3 text-puja-muted">
                    <div className="w-1.5 h-1.5 bg-saffron-500 rounded-full" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-10 bg-puja-bg/30 rounded-3xl border-2 border-dashed border-gray-200">
                <Star className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-puja-muted">No reviews yet for this product. Be the first to review!</p>
                <button className="mt-4 text-saffron-600 font-bold hover:underline">Write a Review</button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-gray-100 pt-12">
          <ProductCarousel title="Related Products" subtitle="You might also like these spiritual items" />
        </div>
      </div>
    </div>
  );
}
