import { Link, useLocation } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { itemCount, total } = useCart();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      maxWidth: 1400,
      margin: '0 auto',
      flexWrap: 'wrap',
      gap: 20,
    }}>
      <Logo size="small" />

      <nav style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
      }}>
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              padding: '10px 20px',
              borderRadius: 30,
              fontWeight: 700,
              fontSize: 16,
              background: location.pathname === link.path ? 'var(--primary)' : 'var(--card-bg)',
              color: location.pathname === link.path ? 'white' : 'var(--text)',
              border: '2px solid var(--primary)',
              transition: 'all 0.3s',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--card-bg)',
            border: '2px solid var(--primary)',
            borderRadius: 30,
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 700,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Nunito',
            fontSize: 16,
            transition: 'all 0.3s',
          }}
        >
          <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>

        <Link
          to="/order/cart"
          style={{
            position: 'relative',
            background: itemCount > 0 ? 'var(--primary)' : 'var(--card-bg)',
            border: '2px solid var(--primary)',
            borderRadius: 30,
            padding: '10px 20px',
            fontWeight: 700,
            color: itemCount > 0 ? 'white' : 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 16,
            transition: 'all 0.3s',
          }}
        >
          <i className="fas fa-shopping-cart"></i>
          {itemCount > 0 && (
            <>
              <span>{itemCount}</span>
              <span style={{ fontSize: 14 }}>·</span>
              <span>${total.toFixed(2)}</span>
            </>
          )}
          {itemCount === 0 && <span>Cart</span>}
        </Link>
      </div>
    </header>
  );
}
