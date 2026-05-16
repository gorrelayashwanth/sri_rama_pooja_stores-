import { ShieldCheck, UserRound, UserRoundCheck, UserRoundX, Ban, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api/axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    blocked: 0
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const data = response.data.data;
      setUsers(data);
      
      const total = data.length;
      const admins = data.filter((u: User) => u.role === 'ADMIN' || u.role === 'CHIEF_ADMIN').length;
      const blocked = data.filter((u: User) => u.isBlocked).length;
      setStats({
        total,
        active: total - blocked,
        admins,
        blocked
      });
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id: string) => {
    try {
      await api.patch(`/users/${id}/toggle-block`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle block status", error);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Users" subtitle="Account Management" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <UserRound className="h-6 w-6 text-saffron-600" />
            <p className="mt-4 text-sm font-medium text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{stats.total}</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <UserRoundCheck className="h-6 w-6 text-green-600" />
            <p className="mt-4 text-sm font-medium text-gray-500">Active Accounts</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{stats.active}</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#2d4a2d]" />
            <p className="mt-4 text-sm font-medium text-gray-500">Admin Accounts</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{stats.admins}</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <UserRoundX className="h-6 w-6 text-red-500" />
            <p className="mt-4 text-sm font-medium text-gray-500">Blocked Users</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{stats.blocked}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-playfair font-bold text-puja-text">User List</h1>
              <p className="text-sm text-puja-muted">Manage all registered accounts and their status.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email / Phone</th>
                  <th className="px-4 py-4">Join Date</th>
                  <th className="px-4 py-4">Orders</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-puja-muted">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-puja-muted">No users found.</td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-puja-text">{user.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-puja-muted">{user.email}</div>
                      <div className="text-[11px] text-puja-muted">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-puja-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-puja-text">
                      {user._count.orders}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'ADMIN' || user.role === 'CHIEF_ADMIN' 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'bg-saffron-50 text-saffron-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        user.isBlocked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => handleToggleBlock(user.id)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          user.isBlocked 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
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

