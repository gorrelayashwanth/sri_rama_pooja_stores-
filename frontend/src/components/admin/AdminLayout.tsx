import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminBottomNav } from "./AdminBottomNav";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfdfc] pb-16 lg:pb-0">
      <AdminSidebar />
      <main className="flex min-h-screen flex-col lg:pl-64">
        {children}
      </main>
      <AdminBottomNav />
    </div>
  );
}
