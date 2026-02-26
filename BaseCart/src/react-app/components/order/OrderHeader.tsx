import { Link } from 'react-router';
import { useCart } from '../../context/CartContext';

export default function OrderHeader() {
  const { itemCount, total } = useCart();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 30px',
      background: 'var(--card-bg)',
      borderBottom: '2px solid var(--grid-line)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 50,
          height: 50,
          background: 'var(--primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="fas fa-coffee" style={{ fontSize: 24, color: 'white' }}></i>
        </div>
        <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>
          Golden Hour
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Link to="/order" style={{
          padding: '10px 20px',
          borderRadius: 30,
          fontWeight: 700,
          background: 'var(--secondary)',
          color: 'white',
        }}>
          <i className="fas fa-utensils" style={{ marginRight: 8 }}></i>
          Order
        </Link>
        
        <Link to="/order/cart" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          borderRadius: 30,
          fontWeight: 700,
          background: itemCount > 0 ? 'var(--primary)' : 'var(--card-bg)',
          color: itemCount > 0 ? 'white' : 'var(--text)',
          border: '2px solid var(--primary)',
        }}>
          <i className="fas fa-shopping-cart"></i>
          <span>{itemCount}</span>
          {itemCount > 0 && <span>· ${total.toFixed(2)}</span>}
        </Link>
      </div>
    </header>
  );
}
