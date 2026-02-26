import { useState } from 'react';
import { MenuItem } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  category: string;
}

export default function MenuItemCard({ item, category }: MenuItemCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const cartItem = items.find(i => i.name === item.name);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(item, category);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        borderRadius: 30,
        padding: 25,
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ fontSize: 36, color: 'var(--primary)', marginBottom: 15 }}>
        <i className={`fas ${item.icon}`}></i>
      </div>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--text)' }}>
        {item.name}
      </div>
      <div style={{ fontWeight: 400, fontSize: 16, color: 'var(--text)', opacity: 0.8, marginBottom: 12, flex: 1 }}>
        {item.description}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--secondary)' }}>
          {item.price}
        </div>
        
        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            style={{
              background: justAdded ? 'var(--secondary)' : 'var(--primary)',
              border: 'none',
              borderRadius: 25,
              padding: '10px 18px',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Nunito',
              transition: 'all 0.3s',
            }}
          >
            {justAdded ? (
              <>
                <i className="fas fa-check"></i>
                Added!
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Add to Cart
              </>
            )}
          </button>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg)',
            borderRadius: 25,
            padding: '6px 10px',
          }}>
            <button
              onClick={() => updateQuantity(item.name, quantity - 1)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--secondary)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fas fa-minus" style={{ fontSize: 12 }}></i>
            </button>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', minWidth: 24, textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={handleAddToCart}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fas fa-plus" style={{ fontSize: 12 }}></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
