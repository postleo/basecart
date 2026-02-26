import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useStoreCart } from '../context/StoreCartContext';

interface Business {
  id: number;
  name: string;
}

export default function StoreCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { items, total, clearCart, businessSlug } = useStoreCart();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupTime: '',
    notes: '',
  });

  useEffect(() => {
    fetch(`/api/business/${slug}`).then(res => res.json()).then(data => setBusiness(data.business));
  }, [slug]);

  // Redirect if cart empty or different store
  if (items.length === 0 || (businessSlug && businessSlug !== slug)) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: 20 }}>
        <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: 50, color: '#ccc', marginBottom: 20 }}></i>
          <h2 style={{ marginBottom: 15 }}>Your cart is empty</h2>
          <Link
            to={`/store/${slug}`}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#FF6B35',
              color: 'white',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const tax = total * 0.08;
  const grandTotal = total + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business?.id,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          pickupTime: formData.pickupTime,
          notes: formData.notes,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: `$${item.price.toFixed(2)}`,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        navigate(`/store/${slug}/confirmation`, { state: { orderNumber: data.orderNumber } });
      }
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: '#1A4D3E',
        color: 'white',
        padding: '20px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 15 }}>
          <Link to={`/store/${slug}/cart`} style={{ color: 'white', fontSize: 20 }}>
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Checkout</h1>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <form onSubmit={handleSubmit}>
          {/* Contact Info */}
          <div style={{ background: 'white', borderRadius: 15, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Contact Information</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e5e5e5',
                  fontSize: 16,
                  fontFamily: 'inherit',
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e5e5e5',
                  fontSize: 16,
                  fontFamily: 'inherit',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e5e5e5',
                  fontSize: 16,
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div style={{ background: 'white', borderRadius: 15, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Pickup Time</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>When would you like to pick up? *</label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={e => setFormData({ ...formData, pickupTime: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e5e5e5',
                  fontSize: 16,
                  fontFamily: 'inherit',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Special Instructions</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e5e5e5',
                  fontSize: 16,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 15, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 15 }}>Order Summary</h3>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#666' }}>
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 15, paddingTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#666' }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, color: '#666' }}>
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '16px',
              background: isSubmitting ? '#ccc' : '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
