import { useParams, Link, useLocation } from 'react-router';

export default function StoreConfirmation() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'N/A';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: '#1A4D3E',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Order Confirmed</h1>
      </header>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 40,
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <i className="fas fa-check" style={{ fontSize: 36, color: '#16a34a' }}></i>
          </div>
          
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Thank You!</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>Your order has been placed successfully.</p>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 5 }}>Order Number</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#FF6B35' }}>{orderNumber}</p>
          </div>
          
          <p style={{ color: '#666', fontSize: 14, marginBottom: 30 }}>
            We'll have your order ready at your requested pickup time. 
            Save your order number for reference.
          </p>
          
          <Link
            to={`/store/${slug}`}
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: '#1A4D3E',
              color: 'white',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
