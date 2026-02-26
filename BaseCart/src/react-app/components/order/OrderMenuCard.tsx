import { MenuItem } from '../../data/menuData';
import { useCart } from '../../context/CartContext';

interface OrderMenuCardProps {
  item: MenuItem;
  category: string;
}

export default function OrderMenuCard({ item, category }: OrderMenuCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.name === item.name);
  const quantity = cartItem?.quantity || 0;

  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: 20,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 15,
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <div style={{
        width: 50,
        height: 50,
        background: 'var(--bg)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <i className={`fas ${item.icon}`} style={{ fontSize: 22, color: 'var(--primary)' }}></i>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7, marginBottom: 6 }}>
          {item.description}
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--secondary)' }}>
          {item.price}
        </div>
      </div>

      {quantity === 0 ? (
        <button
          onClick={() => addItem(item, category)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--primary)',
            border: 'none',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg)',
          borderRadius: 30,
          padding: '4px 8px',
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
            onClick={() => addItem(item, category)}
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
  );
}
