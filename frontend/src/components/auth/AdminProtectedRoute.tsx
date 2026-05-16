import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAdminAuthenticated, adminUser } = useAdminAuthStore();
  const location = useLocation();

  if (!isAdminAuthenticated || !adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (adminUser.role !== 'ADMIN' && adminUser.role !== 'CHIEF_ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
