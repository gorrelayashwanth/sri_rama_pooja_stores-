import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfdfc]">
      <AdminSidebar />
      <main className="flex min-h-screen flex-col lg:pl-64">
        {children}
      </main>
    </div>
  );
}
