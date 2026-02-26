import { useParams, Link, useNavigate } from 'react-router';
import { useStoreCart } from '../context/StoreCartContext';

export default function StoreCart() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, total, businessSlug } = useStoreCart();

  // Redirect if cart is for different store
  if (businessSlug && businessSlug !== slug) {
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

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: '#1A4D3E',
        color: 'white',
        padding: '20px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 15 }}>
          <Link to={`/store/${slug}`} style={{ color: 'white', fontSize: 20 }}>
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Your Cart</h1>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 15 }}>
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
        ) : (
          <>
            {/* Cart Items */}
            <div style={{ background: 'white', borderRadius: 15, marginBottom: 20 }}>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    padding: 20,
                    borderBottom: idx < items.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    gap: 15,
                  }}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ fontWeight: 700 }}>{item.name}</h3>
                      <span style={{ fontWeight: 700, color: '#FF6B35' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 8 }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: 32,
                            height: 32,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          −
                        </button>
                        <span style={{ padding: '0 12px', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: 32,
                            height: 32,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ background: 'white', borderRadius: 15, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 15 }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#666' }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, color: '#666' }}>
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 15,
                borderTop: '2px solid #f0f0f0',
                fontWeight: 800,
                fontSize: 18,
              }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate(`/store/${slug}/checkout`)}
              style={{
                width: '100%',
                padding: '16px',
                background: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
