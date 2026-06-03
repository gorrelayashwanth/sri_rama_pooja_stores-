import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-saffron-50 p-8 rounded-full mb-6">
          <ShoppingBag className="h-16 w-16 text-saffron-500" />
        </div>
        <h1 className="text-3xl font-playfair font-bold text-puja-text mb-4">Your Cart is Empty</h1>
        <p className="text-puja-muted mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our collection to find the perfect spiritual items for your home.
        </p>
        <Link 
          to="/collections" 
          className="bg-saffron-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-saffron-600 transition-all shadow-lg shadow-saffron-100 flex items-center gap-2"
        >
          Start Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-puja-bg/30 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-puja-text mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.cartId} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.id}`} className="hover:text-saffron-500 transition-colors">
                    <h3 className="font-bold text-puja-text text-lg line-clamp-1 mb-1">{item.name}</h3>
                  </Link>
                  {item.selectedTier && (
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mb-1.5 mr-2">
                      {item.selectedTier}
                    </span>
                  )}
                  <p className="text-saffron-600 font-bold">₹{item.salePrice || item.price}</p>
                </div>

                <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 p-1">
                  <button 
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="p-2 hover:text-saffron-600 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="p-2 hover:text-saffron-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-lg text-puja-text">₹{(item.salePrice || item.price) * item.quantity}</p>
                  <button 
                    onClick={() => removeItem(item.cartId)}
                    className="text-red-500 hover:text-red-600 p-2 transition-colors mt-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-playfair font-bold text-puja-text mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-puja-muted">
                  <span>Subtotal ({totalItems()} items)</span>
                  <span>₹{totalPrice()}</span>
                </div>
                <div className="flex justify-between text-puja-muted">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-puja-text">Total Amount</span>
                  <span className="text-2xl font-bold text-saffron-600">₹{totalPrice()}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-saffron-500 text-white py-4 rounded-xl font-bold hover:bg-saffron-600 transition-all shadow-lg shadow-saffron-100 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-5 w-5" />
              </Link>
              
              <p className="mt-4 text-[10px] text-center text-puja-muted uppercase tracking-widest font-bold">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}