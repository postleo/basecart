import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTopbar from '../../components/admin/AdminTopbar';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';

interface Stats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  todayRevenue: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  pickup_time: string;
  total: number;
  status: string;
  created_at: string;
  items: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/orders/stats/summary'),
          fetch('/api/orders?status=all'),
        ]);
        
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: "Today's Orders", value: stats?.todayOrders || 0, icon: 'fa-shopping-bag', color: 'var(--primary)' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: 'fa-clock', color: '#F59E0B' },
    { label: "Today's Revenue", value: `$${(stats?.todayRevenue || 0).toFixed(2)}`, icon: 'fa-dollar-sign', color: '#10B981' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: 'fa-receipt', color: 'var(--secondary)' },
  ];

  return (
    <AdminLayout>
      <AdminTopbar title="Dashboard" subtitle="Welcome back! Here's what's happening today." />
      
      <div style={{ padding: 30 }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 30,
        }}>
          {statCards.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'var(--card-bg)',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <i className={`fas ${stat.icon}`} style={{ fontSize: 24, color: stat.color }}></i>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
                  {loading ? '-' : stat.value}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.6 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '2px solid var(--bg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              View All
              <i className="fas fa-arrow-right" style={{ fontSize: 12 }}></i>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 24, color: 'var(--primary)' }}></i>
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)', opacity: 0.6 }}>
              No orders yet. Orders will appear here when customers place them.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', opacity: 0.7, fontSize: 13 }}>Order</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', opacity: 0.7, fontSize: 13 }}>Customer</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', opacity: 0.7, fontSize: 13 }}>Items</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', opacity: 0.7, fontSize: 13 }}>Total</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', opacity: 0.7, fontSize: 13 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--bg)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <Link to={`/admin/orders`} style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                          #{order.order_number}
                        </Link>
                        <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.5, marginTop: 4 }}>
                          Pickup: {order.pickup_time}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text)' }}>
                        {order.customer_name}
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text)', opacity: 0.7 }}>
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text)' }}>
                        ${order.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
