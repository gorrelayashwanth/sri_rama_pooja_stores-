import { Link, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  Package, 
  Layers, 
  Star, 
  Users, 
  MessageSquare, 
  Settings, 
  FileText,
  Store,
  LogOut,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { name: "Orders", icon: ShoppingBag, path: "/admin/orders", badge: "Live Monitor" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Combos", icon: Layers, path: "/admin/combos" },
  { name: "Reviews", icon: Star, path: "/admin/reviews" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
  { name: "Content", icon: FileText, path: "/admin/content" },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-full bg-[#1a2b1a] text-white lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 flex flex-col border-r border-white/10">
      {/* Brand */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-[#86efac]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase">AdminPanel</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-tighter">Sri Rama Pooja Store</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 lg:py-6 overflow-x-auto lg:overflow-y-auto">
        <ul className="flex gap-2 px-3 lg:block lg:space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <li key={item.name} className="shrink-0 lg:shrink">
                <Link 
                  to={item.path}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#2d4a2d] text-[#86efac]' 
                      : 'hover:bg-white/5 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#86efac]' : 'group-hover:text-white'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[8px] bg-[#86efac]/10 text-[#86efac] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
        >
          <Store className="h-5 w-5" />
          Go to Store
        </Link>
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
