import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import OrderLayout from '../components/order/OrderLayout';
import { useCart } from '../context/CartContext';

// Golden Hour Coffee business slug - used to link orders to the admin portal
const GOLDEN_HOUR_SLUG = 'golden-hour-coffee';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupTime: '',
    notes: '',
  });

  // Fetch the Golden Hour Coffee business ID on mount
  useEffect(() => {
    fetch(`/api/business/${GOLDEN_HOUR_SLUG}`)
      .then(res => res.json())
      .then(data => {
        if (data.business?.id) {
          setBusinessId(data.business.id);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: businessId,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email || null,
          pickupTime: formData.pickupTime,
          notes: formData.notes || null,
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      const data = await response.json();
      clearCart();
      navigate('/order/confirmation', { state: { orderNumber: data.orderNumber } });
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <OrderLayout>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 20 }}>
            Your cart is empty
          </h2>
          <Link
            to="/order"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '15px 30px',
              borderRadius: 30,
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 700,
            }}
          >
            Browse Menu
          </Link>
        </div>
      </OrderLayout>
    );
  }

  // Generate pickup time options
  const getPickupTimes = () => {
    const times = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (let h = Math.max(7, currentHour); h <= 19; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === currentHour && m <= currentMinute + 15) continue;
        if (h === 19 && m > 0) break;
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });
        times.push({ value: time, label });
      }
    }
    return times;
  };

  return (
    <OrderLayout>
      <div style={{ marginBottom: 30 }}>
        <Link to="/order/cart" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--secondary)',
          fontWeight: 700,
        }}>
          <i className="fas fa-arrow-left"></i>
          Back to Cart
        </Link>
      </div>

      <h1 style={{
        fontWeight: 800,
        fontSize: 32,
        color: 'var(--primary)',
        marginBottom: 30,
      }}>
        Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 30,
      }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: 20,
            padding: 25,
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 20 }}>
              <i className="fas fa-user" style={{ marginRight: 10, color: 'var(--secondary)' }}></i>
              Your Details
            </h3>

            <div style={{ display: 'grid', gap: 15 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid var(--grid-line)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 16,
                    fontFamily: 'Nunito',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid var(--grid-line)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 16,
                    fontFamily: 'Nunito',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid var(--grid-line)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 16,
                    fontFamily: 'Nunito',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  Pickup Time *
                </label>
                <select
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid var(--grid-line)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 16,
                    fontFamily: 'Nunito',
                  }}
                >
                  <option value="">Select a time</option>
                  {getPickupTimes().map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  Special Instructions
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any allergies or special requests?"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid var(--grid-line)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 16,
                    fontFamily: 'Nunito',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '16px 30px',
              borderRadius: 30,
              background: isSubmitting ? 'var(--secondary)' : 'var(--primary)',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              fontSize: 18,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito',
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: 10 }}></i>
                Placing Order...
              </>
            ) : (
              <>
                <i className="fas fa-check" style={{ marginRight: 10 }}></i>
                Place Order · ${(total * 1.08).toFixed(2)}
              </>
            )}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: 20,
            padding: 25,
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 20 }}>
              <i className="fas fa-receipt" style={{ marginRight: 10, color: 'var(--primary)' }}></i>
              Order Summary
            </h3>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>
                    ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid var(--bg)', paddingTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ opacity: 0.7 }}>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ opacity: 0.7 }}>Tax (8%)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 20,
            padding: 20,
            background: 'var(--secondary)',
            borderRadius: 20,
            color: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <i className="fas fa-map-marker-alt" style={{ fontSize: 20 }}></i>
              <span style={{ fontWeight: 700 }}>Pickup Location</span>
            </div>
            <p style={{ opacity: 0.9 }}>
              123 Coffee Street, Brew City
            </p>
          </div>
        </div>
      </div>
    </OrderLayout>
  );
}
