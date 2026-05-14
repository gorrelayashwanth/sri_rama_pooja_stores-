import { ShieldCheck, UserRound, UserRoundCheck, UserRoundX } from "lucide-react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";

const sampleUsers = [
  {
    id: "user-1",
    name: "Pooja Lakshmi",
    email: "pooja@example.com",
    role: "Customer",
    status: "Active",
  },
  {
    id: "user-2",
    name: "Rahul Verma",
    email: "rahul@example.com",
    role: "Admin",
    status: "Verified",
  },
  {
    id: "user-3",
    name: "Sita Devi",
    email: "sita@example.com",
    role: "Customer",
    status: "Active",
  },
];

export function AdminUsersPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Users" subtitle="Accounts" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <UserRound className="h-6 w-6 text-saffron-600" />
            <p className="mt-4 text-sm font-medium text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-black text-puja-text">1,284</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <UserRoundCheck className="h-6 w-6 text-green-600" />
            <p className="mt-4 text-sm font-medium text-gray-500">Active Accounts</p>
            <p className="mt-2 text-3xl font-black text-puja-text">1,176</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#2d4a2d]" />
            <p className="mt-4 text-sm font-medium text-gray-500">Admin Accounts</p>
            <p className="mt-2 text-3xl font-black text-puja-text">3</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <UserRoundX className="h-6 w-6 text-red-500" />
            <p className="mt-4 text-sm font-medium text-gray-500">Blocked Users</p>
            <p className="mt-2 text-3xl font-black text-puja-text">2</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-playfair font-bold text-puja-text">User Management</h1>
            <p className="text-sm text-puja-muted">This page no longer falls through to the storefront and is ready for API wiring.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-4 font-semibold text-puja-text">{user.name}</td>
                    <td className="px-4 py-4 text-sm text-puja-muted">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-saffron-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-saffron-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-700">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
