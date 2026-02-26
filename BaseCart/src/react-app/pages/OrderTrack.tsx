import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
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

const statusSteps = ['pending', 'preparing', 'ready', 'completed'];

const statusInfo: Record<string, { icon: string; label: string; description: string }> = {
  pending: { icon: 'fa-clock', label: 'Order Received', description: 'Your order is in the queue' },
  preparing: { icon: 'fa-blender', label: 'Preparing', description: 'Your order is being made' },
  ready: { icon: 'fa-check-circle', label: 'Ready', description: 'Your order is ready for pickup!' },
  completed: { icon: 'fa-smile', label: 'Completed', description: 'Order picked up. Enjoy!' },
  cancelled: { icon: 'fa-times-circle', label: 'Cancelled', description: 'This order was cancelled' },
};

export default function OrderTrack() {
  const { orderNumber } = useParams();
  const [searchNumber, setSearchNumber] = useState(orderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchOrder = async (num: string) => {
    if (!num.trim()) return;
    
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`/api/orders/track/${encodeURIComponent(num)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setOrder(null);
          return;
        }
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch {
      setError('Unable to fetch order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchNumber);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    if (order.status === 'cancelled') return -1;
    return statusSteps.indexOf(order.status);
  };

  return (
    <OrderLayout>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 36px)',
            color: 'var(--primary)',
            marginBottom: 8,
          }}>
            Track Order
          </h1>
          <p style={{ color: 'var(--text)', opacity: 0.7 }}>
            Enter your order number to check status
          </p>
        </div>

        {/* Search Form */}
        {!orderNumber && (
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: 10,
            marginBottom: 30,
          }}>
            <input
              type="text"
              placeholder="Order number (e.g., ORD123456)"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                padding: '15px',
                borderRadius: 30,
                border: '2px solid var(--grid-line)',
                fontSize: 16,
                fontFamily: 'Nunito',
                fontWeight: 700,
                textAlign: 'center',
                background: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
            <button
              type="submit"
              disabled={loading || !searchNumber.trim()}
              style={{
                padding: '15px 25px',
                borderRadius: 30,
                border: 'none',
                fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'Nunito',
                background: 'var(--primary)',
                color: 'white',
                opacity: loading || !searchNumber.trim() ? 0.6 : 1,
              }}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
            </button>
          </form>
        )}

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

        {searched && !loading && !order && !error && (
          <div style={{
            textAlign: 'center',
            padding: 40,
            background: 'var(--card-bg)',
            borderRadius: 20,
          }}>
            <i className="fas fa-search" style={{ fontSize: 48, color: 'var(--text)', opacity: 0.3, marginBottom: 15 }}></i>
            <p style={{ color: 'var(--text)', opacity: 0.7 }}>Order not found</p>
            <p style={{ color: 'var(--text)', opacity: 0.5, fontSize: 14 }}>
              Please check the order number and try again
            </p>
          </div>
        )}

        {order && (
          <>
            {/* Order Header */}
            <div style={{
              background: order.status === 'cancelled' ? '#FEE2E2' : 'var(--secondary)',
              color: order.status === 'cancelled' ? '#991B1B' : 'white',
              borderRadius: 20,
              padding: 25,
              textAlign: 'center',
              marginBottom: 20,
            }}>
              <i className={`fas ${statusInfo[order.status]?.icon || 'fa-question'}`} style={{ fontSize: 40, marginBottom: 15 }}></i>
              <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 5 }}>
                {statusInfo[order.status]?.label || order.status}
              </h2>
              <p style={{ opacity: 0.9 }}>
                {statusInfo[order.status]?.description}
              </p>
            </div>

            {/* Status Progress */}
            {order.status !== 'cancelled' && (
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: 20,
                padding: 25,
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {/* Progress Line */}
                  <div style={{
                    position: 'absolute',
                    top: 15,
                    left: '10%',
                    right: '10%',
                    height: 4,
                    background: 'var(--grid-line)',
                    borderRadius: 2,
                  }}>
                    <div style={{
                      width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%`,
                      height: '100%',
                      background: 'var(--secondary)',
                      borderRadius: 2,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  
                  {statusSteps.map((step, idx) => {
                    const isActive = idx <= getCurrentStepIndex();
                    const info = statusInfo[step];
                    return (
                      <div key={step} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: isActive ? 'var(--secondary)' : 'var(--grid-line)',
                          color: isActive ? 'white' : 'var(--text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: 12,
                        }}>
                          <i className={`fas ${info.icon}`}></i>
                        </div>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: isActive ? 'var(--secondary)' : 'var(--text)',
                          opacity: isActive ? 1 : 0.5,
                        }}>
                          {info.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details */}
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: 20,
              padding: 25,
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <span style={{ color: 'var(--text)', opacity: 0.7 }}>Order Number</span>
                <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{order.order_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <span style={{ color: 'var(--text)', opacity: 0.7 }}>Placed</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatDate(order.created_at)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text)', opacity: 0.7 }}>Pickup Time</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{order.pickup_time}</span>
              </div>
            </div>

            {/* Items */}
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: 20,
              padding: 25,
              marginBottom: 20,
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: 15, color: 'var(--text)' }}>
                <i className="fas fa-receipt" style={{ marginRight: 10, color: 'var(--primary)' }}></i>
                Order Items
              </h3>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: idx < order.items.length - 1 ? '1px solid var(--grid-line)' : 'none',
                }}>
                  <span style={{ color: 'var(--text)' }}>
                    {item.quantity}x {item.name}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.price}</span>
                </div>
              ))}
              
              <div style={{ marginTop: 15, paddingTop: 15, borderTop: '2px solid var(--grid-line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: 'var(--text)', opacity: 0.7 }}>Subtotal</span>
                  <span style={{ color: 'var(--text)' }}>${order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: 'var(--text)', opacity: 0.7 }}>Tax</span>
                  <span style={{ color: 'var(--text)' }}>${order.tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text)' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/order"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '15px 25px',
                  borderRadius: 30,
                  background: 'var(--primary)',
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                <i className="fas fa-plus"></i>
                New Order
              </Link>
              <Link
                to="/order/history"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '15px 25px',
                  borderRadius: 30,
                  background: 'var(--card-bg)',
                  color: 'var(--text)',
                  fontWeight: 700,
                  border: '2px solid var(--secondary)',
                }}
              >
                <i className="fas fa-history"></i>
                Order History
              </Link>
            </div>
          </>
        )}
      </div>
    </OrderLayout>
  );
}
