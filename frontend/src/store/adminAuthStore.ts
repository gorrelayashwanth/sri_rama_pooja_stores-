import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AdminAuthState {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  setAdminAuth: (user: AdminUser, token: string) => void;
  adminLogout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminUser: null,
      adminToken: null,
      isAdminAuthenticated: false,
      setAdminAuth: (adminUser, adminToken) => {
        localStorage.setItem('adminToken', adminToken);
        set({ adminUser, adminToken, isAdminAuthenticated: true });
      },
      adminLogout: () => {
        localStorage.removeItem('adminToken');
        set({ adminUser: null, adminToken: null, isAdminAuthenticated: false });
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
