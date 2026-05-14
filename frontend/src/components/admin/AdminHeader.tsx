import { Search, RefreshCw, Bell, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function AdminHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white px-4 py-4 md:px-8">
      {/* Page Title */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          {title} {subtitle && <span className="text-gray-300 mx-2">•</span>} 
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
        </h2>
        </div>

        {/* Global Search & Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by Name, Ref, AWB..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:bg-white transition-all"
              />
            </div>

            <div className="relative group sm:max-w-[220px]">
              <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all">
                <option>All Orders</option>
                <option>Pending</option>
                <option>Packing</option>
                <option>Out for Delivery</option>
                <option>Delivered</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button className="inline-flex items-center justify-center gap-2 bg-[#f4f7f4] text-[#2d4a2d] px-5 py-2.5 rounded-xl text-sm font-bold border border-[#e2ede2] hover:bg-[#e2ede2] transition-all">
              <RefreshCw className="h-4 w-4" />
              Refresh All Tracking
            </button>
          </div>

          {/* User Profile & Alerts */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <button className="relative p-2 text-gray-400 hover:text-saffron-500 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="hidden h-10 w-px bg-gray-100 sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#2d4a2d] uppercase tracking-tighter leading-none mb-1">
                  {user?.role === 'CHIEF_ADMIN' ? 'Chief Admin' : 'Admin'}
                </p>
                <p className="text-xs text-gray-400 leading-none">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#2d4a2d] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-green-100">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
