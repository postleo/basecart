import { Link, useNavigate } from 'react-router';
import OrderLayout from '../components/order/OrderLayout';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <OrderLayout>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
        }}>
          <div style={{
            width: 100,
            height: 100,
            margin: '0 auto 30px',
            background: 'var(--bg)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: 40, color: 'var(--text)', opacity: 0.3 }}></i>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 10 }}>
            Your cart is empty
          </h2>
          <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: 30 }}>
            Add some delicious items to get started
          </p>
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
            <i className="fas fa-utensils"></i>
            Browse Menu
          </Link>
        </div>
      </OrderLayout>
    );
  }

  return (
    <OrderLayout>
      <div style={{ marginBottom: 30 }}>
        <Link to="/order" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--secondary)',
          fontWeight: 700,
        }}>
          <i className="fas fa-arrow-left"></i>
          Continue Shopping
        </Link>
      </div>

      <h1 style={{
        fontWeight: 800,
        fontSize: 32,
        color: 'var(--primary)',
        marginBottom: 30,
      }}>
        Your Cart
      </h1>

      <div style={{ display: 'grid', gap: 15, marginBottom: 30 }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 20,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <div style={{
              width: 50,
              height: 50,
              background: 'var(--bg)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className={`fas ${item.icon}`} style={{ fontSize: 22, color: 'var(--primary)' }}></i>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                {item.name}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.6 }}>
                {item.category}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <button
                onClick={() => updateQuantity(item.name, item.quantity - 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--secondary)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-minus" style={{ fontSize: 12 }}></i>
              </button>
              <span style={{ fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.name, item.quantity + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-plus" style={{ fontSize: 12 }}></i>
              </button>
            </div>

            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--secondary)', minWidth: 70, textAlign: 'right' }}>
              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
            </div>

            <button
              onClick={() => removeItem(item.name)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'transparent',
                border: '2px solid #e74c3c',
                color: '#e74c3c',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-trash" style={{ fontSize: 14 }}></i>
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
      }}>
        <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 15 }}>
          Order Summary
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: 'var(--text)', opacity: 0.7 }}>Subtotal</span>
          <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
          <span style={{ color: 'var(--text)', opacity: 0.7 }}>Tax (8%)</span>
          <span style={{ fontWeight: 600 }}>${(total * 0.08).toFixed(2)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 15,
          borderTop: '2px solid var(--bg)',
        }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--primary)' }}>
            ${(total * 1.08).toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 15 }}>
        <button
          onClick={() => {
            clearCart();
          }}
          style={{
            flex: 1,
            padding: '15px 25px',
            borderRadius: 30,
            background: 'transparent',
            border: '2px solid var(--secondary)',
            color: 'var(--secondary)',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            fontFamily: 'Nunito',
          }}
        >
          Clear Cart
        </button>
        <button
          onClick={() => navigate('/order/checkout')}
          style={{
            flex: 2,
            padding: '15px 25px',
            borderRadius: 30,
            background: 'var(--primary)',
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            fontFamily: 'Nunito',
          }}
        >
          <i className="fas fa-arrow-right" style={{ marginRight: 10 }}></i>
          Proceed to Checkout
        </button>
      </div>
    </OrderLayout>
  );
}
