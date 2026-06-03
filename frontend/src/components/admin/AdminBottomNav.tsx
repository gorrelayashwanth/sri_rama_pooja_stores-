import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import { 
  ShoppingBag, 
  Package, 
  Layers, 
  MessageSquare, 
  Menu, 
  Star, 
  Users, 
  Settings, 
  FileText, 
  Store, 
  LogOut,
  X
} from "lucide-react";

export function AdminBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const adminLogout = useAdminAuthStore((state) => state.adminLogout);

  const handleLogout = () => {
    setShowMoreSheet(false);
    adminLogout();
    navigate("/admin/login");
  };

  const primaryItems = [
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Products", icon: Package, path: "/admin/products" },
    { name: "Combos", icon: Layers, path: "/admin/combos" },
    { name: "Messages", icon: MessageSquare, path: "/admin/messages" },
  ];

  const moreItems = [
    { name: "Reviews", icon: Star, path: "/admin/reviews" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Content", icon: FileText, path: "/admin/content" },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a2b1a] text-white border-t border-white/10 z-40 h-16 flex items-center justify-around px-2 shadow-2xl">
        {primaryItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-colors ${
                isActive ? "text-[#86efac]" : "text-white/70 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 font-bold">{item.name}</span>
            </Link>
          );
        })}
        
        {/* More Button */}
        <button
          onClick={() => setShowMoreSheet(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-colors ${
            showMoreSheet ? "text-[#86efac]" : "text-white/70 hover:text-white"
          }`}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-bold">More</span>
        </button>
      </div>

      {/* More Options Bottom Sheet */}
      {showMoreSheet && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Overlay click area */}
          <div className="flex-1" onClick={() => setShowMoreSheet(false)} />
          
          {/* Bottom Sheet content */}
          <div className="bg-[#1a2b1a] text-white rounded-t-[2.5rem] border-t border-white/15 p-6 space-y-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#86efac]">More Actions</h3>
                <p className="text-[10px] text-white/50 uppercase mt-0.5">Sri Rama Pooja Store</p>
              </div>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {moreItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setShowMoreSheet(false)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      isActive
                        ? "bg-[#2d4a2d] border-[#2d4a2d]/30 text-[#86efac]"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/80"
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-6 space-y-3">
              <Link
                to="/"
                onClick={() => setShowMoreSheet(false)}
                className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-xs font-bold text-white/80"
              >
                <Store className="h-5 w-5 shrink-0 text-[#86efac]" />
                Go to Devotional Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/20 text-red-400 rounded-2xl transition-all text-xs font-bold"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                Sign Out from Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
