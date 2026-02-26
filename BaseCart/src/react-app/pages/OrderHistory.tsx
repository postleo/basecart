import { useState } from 'react';
import { Link } from 'react-router';
import OrderLayout from '../components/order/OrderLayout';

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  pickup_time: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  preparing: { bg: '#DBEAFE', color: '#1E40AF' },
  ready: { bg: '#D1FAE5', color: '#065F46' },
  completed: { bg: '#E5E7EB', color: '#374151' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function OrderHistory() {
  const [lookupType, setLookupType] = useState<'email' | 'phone'>('email');
  const [lookupValue, setLookupValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupValue.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const param = lookupType === 'email' ? `email=${encodeURIComponent(lookupValue)}` : `phone=${encodeURIComponent(lookupValue)}`;
      const response = await fetch(`/api/orders/history?${param}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch {
      setError('Unable to fetch order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <OrderLayout>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 36px)',
            color: 'var(--primary)',
            marginBottom: 8,
          }}>
            Order History
          </h1>
          <p style={{ color: 'var(--text)', opacity: 0.7 }}>
            Look up your past orders by email or phone
          </p>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleSearch} style={{
          background: 'var(--card-bg)',
          borderRadius: 20,
          padding: 25,
          marginBottom: 30,
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              <button
                type="button"
                onClick={() => setLookupType('email')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                  background: lookupType === 'email' ? 'var(--secondary)' : 'var(--bg)',
                  color: lookupType === 'email' ? 'white' : 'var(--text)',
                }}
              >
                <i className="fas fa-envelope" style={{ marginRight: 8 }}></i>
                Email
              </button>
              <button
                type="button"
                onClick={() => setLookupType('phone')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                  background: lookupType === 'phone' ? 'var(--secondary)' : 'var(--bg)',
                  color: lookupType === 'phone' ? 'white' : 'var(--text)',
                }}
              >
                <i className="fas fa-phone" style={{ marginRight: 8 }}></i>
                Phone
              </button>
            </div>
            <input
              type={lookupType === 'email' ? 'email' : 'tel'}
              placeholder={lookupType === 'email' ? 'Enter your email address' : 'Enter your phone number'}
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: 12,
                border: '2px solid var(--grid-line)',
                fontSize: 16,
                fontFamily: 'Nunito',
                background: 'var(--bg)',
                color: 'var(--text)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !lookupValue.trim()}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: 30,
              border: 'none',
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'Nunito',
              background: 'var(--primary)',
              color: 'white',
              opacity: loading || !lookupValue.trim() ? 0.6 : 1,
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                Searching...
              </>
            ) : (
              <>
                <i className="fas fa-search" style={{ marginRight: 8 }}></i>
                Find Orders
              </>
            )}
          </button>
        </form>

        {error && (
          <div style={{
            padding: 15,
            background: '#FEE2E2',
            color: '#991B1B',
            borderRadius: 12,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
            {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && orders.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            padding: 40,
            background: 'var(--card-bg)',
            borderRadius: 20,
          }}>
            <i className="fas fa-inbox" style={{ fontSize: 48, color: 'var(--text)', opacity: 0.3, marginBottom: 15 }}></i>
            <p style={{ color: 'var(--text)', opacity: 0.7 }}>No orders found</p>
          </div>
        )}

        {orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--secondary)' }}>
                      {order.order_number}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', opacity: 0.6 }}>
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    background: statusColors[order.status]?.bg || '#E5E7EB',
                    color: statusColors[order.status]?.color || '#374151',
                  }}>
                    {order.status}
                  </span>
                </div>

                <div style={{
                  borderTop: '1px solid var(--grid-line)',
                  paddingTop: 15,
                  marginBottom: 15,
                }}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div style={{ fontSize: 13, color: 'var(--text)', opacity: 0.6 }}>
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
                    ${order.total.toFixed(2)}
                  </div>
                  <Link
                    to={`/order/track/${order.order_number}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      background: 'var(--secondary)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Track Single Order Link */}
        <div style={{
          marginTop: 30,
          textAlign: 'center',
          padding: 20,
          background: 'var(--card-bg)',
          borderRadius: 20,
        }}>
          <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: 10 }}>
            Have an order number?
          </p>
          <Link
            to="/order/track"
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
            }}
          >
            Track a specific order →
          </Link>
        </div>
      </div>
    </OrderLayout>
  );
}
