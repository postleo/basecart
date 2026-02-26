import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';

interface Business {
  id: number;
  name: string;
  slug: string;
  owner_email: string;
  order_count: number;
  revenue: number;
  created_at: string;
}

interface Stats {
  totalBusinesses: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

// Define system admin emails here
const SYSTEM_ADMIN_EMAILS = ['admin@example.com']; // Add your admin email

export default function SystemAdminDashboard() {
  const { user, isPending, logout } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isSystemAdmin = user && SYSTEM_ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (isSystemAdmin) {
      fetchData();
    }
  }, [isSystemAdmin]);

  const fetchData = async () => {
    try {
      const [statsRes, bizRes] = await Promise.all([
        fetch('/api/system-admin/stats'),
        fetch('/api/system-admin/businesses'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (bizRes.ok) setBusinesses(await bizRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#3b82f6' }}></i>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isSystemAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: 'white',
        padding: 20,
      }}>
        <i className="fas fa-shield-alt" style={{ fontSize: 60, color: '#ef4444', marginBottom: 20 }}></i>
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>Access Denied</h1>
        <p style={{ color: '#94a3b8', marginBottom: 30 }}>You don't have system admin privileges.</p>
        <Link
          to="/admin"
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Go to Business Admin
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <header style={{
        background: '#1e293b',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{
            width: 40,
            height: 40,
            background: '#3b82f6',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="fas fa-cog" style={{ color: 'white', fontSize: 18 }}></i>
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>System Admin</h1>
            <p style={{ color: '#64748b', fontSize: 12 }}>Order Manager Platform</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>{user.email}</span>
          <button
            onClick={() => logout()}
            style={{
              padding: '8px 16px',
              background: '#334155',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ padding: 30 }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#3b82f6' }}></i>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
              <StatCard icon="fa-store" label="Total Businesses" value={stats?.totalBusinesses || 0} color="#8b5cf6" />
              <StatCard icon="fa-receipt" label="Total Orders" value={stats?.totalOrders || 0} color="#3b82f6" />
              <StatCard icon="fa-dollar-sign" label="Total Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} color="#10b981" />
              <StatCard icon="fa-clock" label="Orders Today" value={stats?.todayOrders || 0} color="#f59e0b" />
            </div>

            {/* Businesses Table */}
            <div style={{ background: '#1e293b', borderRadius: 15, overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid #334155' }}>
                <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>All Businesses</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Business</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Owner</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Orders</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Revenue</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Created</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                          No businesses registered yet
                        </td>
                      </tr>
                    ) : (
                      businesses.map(biz => (
                        <tr key={biz.id} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ color: 'white', fontWeight: 600 }}>{biz.name}</div>
                            <div style={{ color: '#64748b', fontSize: 12 }}>{biz.slug}</div>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#94a3b8' }}>{biz.owner_email}</td>
                          <td style={{ padding: '16px 20px', color: 'white', fontWeight: 600 }}>{biz.order_count}</td>
                          <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 600 }}>${biz.revenue.toFixed(2)}</td>
                          <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                            {new Date(biz.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <a
                              href={`/store/${biz.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '6px 12px',
                                background: '#334155',
                                color: 'white',
                                borderRadius: 6,
                                textDecoration: 'none',
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              View Store
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: 12,
      padding: 20,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <i className={`fas ${icon}`} style={{ color, fontSize: 18 }}></i>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>{label}</span>
      </div>
      <div style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
