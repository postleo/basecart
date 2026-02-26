import { Link, useLocation } from 'react-router';
import OrderLayout from '../components/order/OrderLayout';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || `GH${Date.now().toString().slice(-6)}`;

  return (
    <OrderLayout>
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        maxWidth: 500,
        margin: '0 auto',
      }}>
        <div style={{
          width: 100,
          height: 100,
          margin: '0 auto 30px',
          background: 'var(--secondary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="fas fa-check" style={{ fontSize: 50, color: 'white' }}></i>
        </div>

        <h1 style={{
          fontWeight: 800,
          fontSize: 32,
          color: 'var(--primary)',
          marginBottom: 15,
        }}>
          Order Confirmed!
        </h1>

        <p style={{
          fontSize: 18,
          color: 'var(--text)',
          opacity: 0.8,
          marginBottom: 30,
        }}>
          Your order has been placed successfully and will be ready for pickup soon.
        </p>

        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 20,
          padding: 25,
          marginBottom: 30,
        }}>
          <div style={{ marginBottom: 15 }}>
            <span style={{ opacity: 0.7 }}>Order Number</span>
            <div style={{
              fontWeight: 800,
              fontSize: 28,
              color: 'var(--secondary)',
              letterSpacing: 2,
            }}>
              {orderNumber}
            </div>
          </div>

          <div style={{
            padding: 15,
            background: 'var(--bg)',
            borderRadius: 12,
          }}>
            <i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginRight: 10 }}></i>
            <span style={{ fontSize: 14 }}>
              Please show this order number when picking up
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--secondary)',
          color: 'white',
          borderRadius: 20,
          padding: 25,
          marginBottom: 30,
          textAlign: 'left',
        }}>
          <h3 style={{ fontWeight: 700, marginBottom: 15 }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: 10 }}></i>
            Pickup Details
          </h3>
          <p style={{ marginBottom: 10 }}>
            <strong>Location:</strong> 123 Coffee Street, Brew City
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong>Hours:</strong> Mon-Fri 7am-7pm, Sat-Sun 8am-8pm
          </p>
          <p>
            <strong>Phone:</strong> (555) 123-4567
          </p>
        </div>

        <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={`/order/track/${orderNumber}`}
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
            <i className="fas fa-search"></i>
            Track Order
          </Link>
          <Link
            to="/order"
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
            <i className="fas fa-plus"></i>
            Order More
          </Link>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link
            to="/order/history"
            style={{
              color: 'var(--secondary)',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <i className="fas fa-history" style={{ marginRight: 6 }}></i>
            View Order History
          </Link>
        </div>
      </div>
    </OrderLayout>
  );
}
