import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "CHIEF_ADMIN";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden p-2 -ml-2 text-puja-text hover:text-saffron-600"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-[min(100%,320px)] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-playfair font-black text-saffron-600 text-lg">Menu</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block py-4 px-4 rounded-2xl text-sm font-black uppercase tracking-widest text-puja-text hover:bg-saffron-50 hover:text-saffron-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 space-y-2">
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-gray-50 font-bold text-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-gray-50 font-bold text-sm"
              >
                <Heart className="h-5 w-5" /> Wishlist
              </Link>
              <Link
                to={isAuthenticated ? (isAdmin ? "/admin" : "/account") : "/login"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-saffron-500 text-white font-bold text-sm"
              >
                <User className="h-5 w-5" />
                {isAuthenticated ? (isAdmin ? "Admin" : "Account") : "Login"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
