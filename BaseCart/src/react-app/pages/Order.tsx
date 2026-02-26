import { useState } from 'react';
import { Link } from 'react-router';
import OrderLayout from '../components/order/OrderLayout';
import OrderMenuCard from '../components/order/OrderMenuCard';
import { menuCategories } from '../data/menuData';

export default function Order() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].slug);
  
  // Filter out merchandise from ordering (keep only food/drink)
  const orderableCategories = menuCategories.filter(c => c.slug !== 'merchandise');

  return (
    <OrderLayout>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{
          fontWeight: 800,
          fontSize: 'clamp(28px, 5vw, 40px)',
          color: 'var(--primary)',
          marginBottom: 8,
        }}>
          Place Your Order
        </h1>
        <p style={{ color: 'var(--text)', opacity: 0.7 }}>
          Select items and add them to your cart
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 30,
        overflowX: 'auto',
        paddingBottom: 10,
      }}>
        {orderableCategories.map(category => (
          <button
            key={category.slug}
            onClick={() => setActiveCategory(category.slug)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 30,
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeCategory === category.slug ? 'var(--secondary)' : 'var(--card-bg)',
              color: activeCategory === category.slug ? 'white' : 'var(--text)',
              transition: 'all 0.2s',
              fontFamily: 'Nunito',
            }}
          >
            <i className={`fas ${category.icon}`}></i>
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      {orderableCategories.map(category => (
        <div
          key={category.slug}
          style={{ display: activeCategory === category.slug ? 'block' : 'none' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 15,
          }}>
            {category.items.map((item, index) => (
              <OrderMenuCard key={index} item={item} category={category.name} />
            ))}
          </div>
        </div>
      ))}

      {/* Quick Info */}
      <div style={{
        marginTop: 40,
        padding: 20,
        background: 'var(--card-bg)',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <i className="fas fa-info-circle" style={{ fontSize: 24, color: 'var(--secondary)' }}></i>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Pickup Only
            </div>
            <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>
              Orders are prepared for pickup at 123 Coffee Street, Brew City
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            to="/order/track"
            style={{
              padding: '10px 16px',
              borderRadius: 20,
              background: 'var(--secondary)',
              color: 'white',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <i className="fas fa-search" style={{ marginRight: 6 }}></i>
            Track Order
          </Link>
          <Link
            to="/order/history"
            style={{
              padding: '10px 16px',
              borderRadius: 20,
              background: 'var(--bg)',
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: 13,
              border: '1px solid var(--grid-line)',
            }}
          >
            <i className="fas fa-history" style={{ marginRight: 6 }}></i>
            History
          </Link>
        </div>
      </div>
    </OrderLayout>
  );
}
