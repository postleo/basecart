import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { useBusiness } from '../../context/BusinessContext';
import { useSidebar } from '../../context/SidebarContext';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  requiresBusiness?: boolean;
}

export default function AdminLayout({ children, requiresBusiness = true }: AdminLayoutProps) {
  const { user, isPending } = useAuth();
  const { business, isLoading } = useBusiness();
  const { isCollapsed } = useSidebar();

  if (isPending || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: 'var(--primary)', marginBottom: 20 }}></i>
          <p style={{ color: 'var(--text)', fontWeight: 600 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiresBusiness && !business) {
    return <Navigate to="/admin/onboarding" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{
        flex: 1,
        marginLeft: isCollapsed ? 70 : 260,
        background: 'var(--bg)',
        minHeight: '100vh',
        transition: 'margin-left 0.25s ease',
      }}>
        {children}
      </main>
    </div>
  );
}
