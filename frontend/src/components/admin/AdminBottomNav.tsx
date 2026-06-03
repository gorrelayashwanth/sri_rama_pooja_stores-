import { Link, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  Package, 
  Star, 
  MessageSquare, 
  Settings 
} from "lucide-react";

const bottomNavItems = [
  { name: "Orders", icon: ShoppingBag, path: "/admin/orders", showPulse: true },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Reviews", icon: Star, path: "/admin/reviews" },
  { name: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminBottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a2b1a] text-white border-t border-white/10 z-50 flex justify-around items-center h-16 safe-area-pb shadow-2xl">
      {bottomNavItems.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] transition-all relative ${
              isActive ? "text-[#86efac]" : "text-white/60 hover:text-white"
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.showPulse && (
                <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
