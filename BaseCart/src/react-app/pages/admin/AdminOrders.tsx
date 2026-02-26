import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTopbar from '../../components/admin/AdminTopbar';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  category: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  pickup_time: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
}

const statusFilters = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusOptions = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <AdminTopbar title="Orders" subtitle="Manage incoming customer orders" />
      
      <div style={{ padding: 30 }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 5,
        }}>
          {statusFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: statusFilter === filter.value ? 'var(--secondary)' : 'var(--card-bg)',
                color: statusFilter === filter.value ? 'white' : 'var(--text)',
                fontFamily: 'Nunito',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {/* Orders List */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: 24, color: 'var(--primary)' }}></i>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)', opacity: 0.6 }}>
                  No orders found for this filter.
                </div>
              ) : (
                <div>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: 20,
                        borderBottom: '1px solid var(--bg)',
                        cursor: 'pointer',
                        background: selectedOrder?.id === order.id ? 'var(--bg)' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--secondary)', marginRight: 10 }}>
                            #{order.order_number}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text)', opacity: 0.5 }}>
                          {formatTime(order.created_at)}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                        {order.customer_name}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.6, marginBottom: 8 }}>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items · Pickup: {order.pickup_time}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Detail */}
          {selectedOrder && (
            <div style={{
              width: 400,
              background: 'var(--card-bg)',
              borderRadius: 16,
              padding: 24,
              position: 'sticky',
              top: 30,
              height: 'fit-content',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: 0 }}>
                  #{selectedOrder.order_number}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 8,
                    color: 'var(--text)',
                    opacity: 0.5,
                  }}
                >
                  <i className="fas fa-times" style={{ fontSize: 18 }}></i>
                </button>
              </div>

              {/* Status Update */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
                  Order Status
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedOrder.id, status)}
                      disabled={updating === selectedOrder.id}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 6,
                        border: 'none',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: updating === selectedOrder.id ? 'not-allowed' : 'pointer',
                        textTransform: 'capitalize',
                        background: selectedOrder.status === status ? 'var(--secondary)' : 'var(--bg)',
                        color: selectedOrder.status === status ? 'white' : 'var(--text)',
                        fontFamily: 'Nunito',
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: 20, padding: 15, background: 'var(--bg)', borderRadius: 10 }}>
                <h4 style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', opacity: 0.7, marginBottom: 10 }}>
                  Customer
                </h4>
                <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  {selectedOrder.customer_name}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>
                  <i className="fas fa-phone" style={{ width: 20 }}></i> {selectedOrder.customer_phone}
                </div>
                {selectedOrder.customer_email && (
                  <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>
                    <i className="fas fa-envelope" style={{ width: 20 }}></i> {selectedOrder.customer_email}
                  </div>
                )}
                <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7, marginTop: 8 }}>
                  <i className="fas fa-clock" style={{ width: 20 }}></i> Pickup: {selectedOrder.pickup_time}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', opacity: 0.7, marginBottom: 10 }}>
                  Items
                </h4>
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: index < selectedOrder.items.length - 1 ? '1px solid var(--bg)' : 'none',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {item.quantity}x {item.name}
                      </span>
                      <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.5 }}>
                        {item.category}
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div style={{ marginBottom: 20, padding: 15, background: '#FEF3C7', borderRadius: 10 }}>
                  <h4 style={{ fontWeight: 600, fontSize: 14, color: '#92400E', marginBottom: 8 }}>
                    <i className="fas fa-sticky-note" style={{ marginRight: 8 }}></i>
                    Special Instructions
                  </h4>
                  <p style={{ margin: 0, color: '#78350F', fontSize: 14 }}>
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Totals */}
              <div style={{ padding: 15, background: 'var(--bg)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text)', opacity: 0.7 }}>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text)', opacity: 0.7 }}>Tax</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTop: '2px solid var(--card-bg)',
                  fontWeight: 700,
                  fontSize: 18,
                }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
