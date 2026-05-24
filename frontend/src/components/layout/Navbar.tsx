import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, Heart, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.totalItems());
  const { settings } = useSettings();
  const { language, setLanguage } = useLanguage();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'CHIEF_ADMIN';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-saffron-100/50 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-puja-text hover:text-saffron-600 transition">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.storeName} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            ) : (
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-playfair font-black text-saffron-600 tracking-tighter leading-none">
                  {settings?.storeName?.split(' ')[0] || "SRI RAMA"}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-puja-muted uppercase tracking-[0.3em] leading-none mt-1">
                  {settings?.storeName?.split(' ').slice(1).join(' ') || "Pooja Store"}
                </span>
              </div>
            )}
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-puja-text hover:text-saffron-600 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/collections" className="text-puja-text hover:text-saffron-600 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/festivals" className="text-puja-text hover:text-saffron-600 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group">
            Festivals
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/deities" className="text-puja-text hover:text-saffron-600 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group">
            Deities
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/about" className="text-puja-text hover:text-saffron-600 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/contact" className="text-puja-text hover:text-saffron-600 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron-500 transition-all group-hover:w-full" />
          </Link>
        </div>


        <div className="flex items-center space-x-5">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="hidden md:block bg-transparent text-[10px] font-black text-puja-text uppercase tracking-widest cursor-pointer focus:outline-none"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="te">TE</option>
          </select>
          <button className="text-puja-text hover:text-saffron-500 transition">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" className="text-puja-text hover:text-saffron-500 transition relative">
            <Heart className="h-5 w-5" />
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to={isAdmin ? "/admin" : "/account"} 
                className="text-puja-text hover:text-saffron-500 transition flex items-center gap-2 bg-gray-50 pr-4 pl-1 py-1 rounded-full border border-gray-100"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isAdmin ? 'bg-[#2d4a2d] text-white' : 'bg-saffron-100 text-saffron-600'}`}>
                  {isAdmin ? <ShieldCheck className="h-4 w-4" /> : user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                    {isAdmin ? 'Admin' : 'Account'}
                  </span>
                  <span className="hidden lg:inline text-xs font-bold leading-none text-puja-muted">{user?.name?.split(' ')[0]}</span>
                </div>
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

