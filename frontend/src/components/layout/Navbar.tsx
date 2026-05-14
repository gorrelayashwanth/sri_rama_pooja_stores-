import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-saffron-100/50 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-puja-text hover:text-saffron-600 transition">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex flex-col">
            <span className="text-2xl md:text-3xl font-playfair font-black text-saffron-600 tracking-tighter leading-none">
              SRI RAMA
            </span>
            <span className="text-[10px] md:text-xs font-bold text-puja-muted uppercase tracking-[0.3em] leading-none mt-1">
              Pooja Store
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-puja-text hover:text-saffron-600 text-sm font-bold uppercase tracking-widest transition">Home</Link>
          <Link to="/collections" className="text-puja-text hover:text-saffron-600 text-sm font-bold uppercase tracking-widest transition">Shop</Link>
          <Link to="/about" className="text-puja-text hover:text-saffron-600 text-sm font-bold uppercase tracking-widest transition">About</Link>
          <Link to="/contact" className="text-puja-text hover:text-saffron-600 text-sm font-bold uppercase tracking-widest transition">Contact</Link>
        </div>

        <div className="flex items-center space-x-5">
          <button className="text-puja-text hover:text-saffron-500 transition">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" className="text-puja-text hover:text-saffron-500 transition relative">
            <Heart className="h-5 w-5" />
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/account" className="text-puja-text hover:text-saffron-500 transition flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm font-medium">{user?.name.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="text-puja-muted hover:text-red-500 transition">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-puja-text hover:text-saffron-500 transition">
              <User className="h-5 w-5" />
            </Link>
          )}

          <Link to="/cart" className="text-puja-text hover:text-saffron-500 transition relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-saffron-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
