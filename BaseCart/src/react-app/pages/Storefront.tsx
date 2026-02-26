import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useStoreCart } from '../context/StoreCartContext';

interface Business {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  custom_link_url: string | null;
  custom_link_text: string | null;
}

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

export default function Storefront() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, itemCount, total } = useStoreCart();
  const [business, setBusiness] = useState<Business | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [showTrackModal, setShowTrackModal] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const fetchData = async () => {
    try {
      const [bizRes, menuRes] = await Promise.all([
        fetch(`/api/business/${slug}`),
        fetch(`/api/store/${slug}/menu`),
      ]);

      if (!bizRes.ok) {
        setError('Store not found');
        return;
      }

      const bizData = await bizRes.json();
      setBusiness(bizData.business);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData);
        const cats = [...new Set(menuData.map((i: MenuItem) => i.category))];
        setCategories(cats as string[]);
      }
    } catch (err) {
      setError('Failed to load store');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(i => i.category === selectedCategory);

  const handleTrackOrder = () => {
    if (trackOrderNumber.trim()) {
      window.location.href = `/order/track/${trackOrderNumber.trim()}`;
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#FF6B35', marginBottom: 15 }}></i>
          <p style={{ color: '#666', fontWeight: 500 }}>Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: 20,
      }}>
        <div style={{
          background: 'white',
          padding: 50,
          borderRadius: 20,
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <i className="fas fa-store-slash" style={{ fontSize: 60, color: '#ccc', marginBottom: 20 }}></i>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Store Not Found</h1>
          <p style={{ color: '#666', marginBottom: 20 }}>This store doesn't exist or has been removed.</p>
          <Link to="/" style={{
            padding: '12px 24px',
            background: '#FF6B35',
            color: 'white',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'white',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>
        <Link to={`/store/${slug}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          color: '#1A4D3E',
        }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
            <i className="fas fa-store" style={{ fontSize: 16 }}></i>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{business.name}</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            to={business.custom_link_url || "/"}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
            }}
          >
            <i className="fas fa-coffee"></i>
            <span className="nav-text">{business.custom_link_text || "Golden Hour"}</span>
          </Link>
          
          <Link
            to="/admin"
            style={{
              padding: '10px 16px',
              background: '#1A4D3E',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
            }}
          >
            <i className="fas fa-store-alt"></i>
            <span className="nav-text">Business Portal</span>
          </Link>
          
          <button
            onClick={() => setShowTrackModal(true)}
            style={{
              padding: '10px 16px',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: 10,
              color: '#333',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
            }}
          >
            <i className="fas fa-search"></i>
            <span style={{ display: 'none' }} className="track-text">Track Order</span>
          </button>
          
          <Link
            to={`/store/${slug}/cart`}
            style={{
              padding: '10px 16px',
              background: itemCount > 0 ? '#FF6B35' : '#f0f0f0',
              color: itemCount > 0 ? 'white' : '#333',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              position: 'relative',
            }}
          >
            <i className="fas fa-shopping-cart"></i>
            {itemCount > 0 && (
              <span style={{
                background: itemCount > 0 ? 'white' : '#FF6B35',
                color: itemCount > 0 ? '#FF6B35' : 'white',
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
              }}>
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1A4D3E 0%, #2d6a4f 100%)',
        color: 'white',
        padding: '50px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(28px, 5vw, 42px)', 
            fontWeight: 800, 
            marginBottom: 12,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
            {business.name}
          </h1>
          {business.description && (
            <p style={{ 
              opacity: 0.9, 
              fontSize: 'clamp(14px, 2vw, 18px)',
              lineHeight: 1.6,
              marginBottom: 20,
            }}>
              {business.description}
            </p>
          )}
          {business.address && (
            <p style={{
              opacity: 0.7,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              <i className="fas fa-map-marker-alt"></i>
              {business.address}
            </p>
          )}
        </div>
      </header>

      {/* Category Filter */}
      <div style={{
        padding: '20px',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 60,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 5,
          scrollbarWidth: 'none',
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '12px 24px',
              borderRadius: 30,
              border: 'none',
              background: selectedCategory === 'all' 
                ? 'linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)' 
                : '#f5f5f5',
              color: selectedCategory === 'all' ? 'white' : '#555',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              boxShadow: selectedCategory === 'all' ? '0 4px 15px rgba(255,107,53,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '12px 24px',
                borderRadius: 30,
                border: 'none',
                background: selectedCategory === cat 
                  ? 'linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)'
                  : '#f5f5f5',
                color: selectedCategory === cat ? 'white' : '#555',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
                boxShadow: selectedCategory === cat ? '0 4px 15px rgba(255,107,53,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 20px' }}>
        {menuItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 80,
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}>
            <i className="fas fa-utensils" style={{ fontSize: 60, color: '#ddd', marginBottom: 20 }}></i>
            <h3 style={{ marginBottom: 10, fontWeight: 700 }}>Menu Coming Soon</h3>
            <p style={{ color: '#888' }}>This store hasn't added any items yet.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 24,
          }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
              >
                {item.image_url ? (
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ 
                        width: '100%', 
                        height: 180, 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                    }}></div>
                  </div>
                ) : (
                  <div style={{
                    height: 120,
                    background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <i className="fas fa-utensils" style={{ fontSize: 30, color: '#ccc' }}></i>
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: 10,
                    gap: 10,
                  }}>
                    <h3 style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>{item.name}</h3>
                    <span style={{ 
                      fontWeight: 800, 
                      color: '#FF6B35', 
                      fontSize: 20,
                      whiteSpace: 'nowrap',
                    }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p style={{ 
                      color: '#777', 
                      fontSize: 14, 
                      marginBottom: 18,
                      lineHeight: 1.5,
                    }}>
                      {item.description}
                    </p>
                  )}
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image_url }, slug!)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #1A4D3E 0%, #2d6a4f 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      fontSize: 15,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(26,77,62,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-plus"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1A4D3E',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center',
        marginTop: 40,
      }}>
        <p style={{ opacity: 0.8, marginBottom: 8 }}>
          Powered by <span style={{ fontWeight: 700, color: '#FF6B35' }}>BaseCart</span>
        </p>
        <p style={{ opacity: 0.6, fontSize: 13 }}>
          The simple way to sell online
        </p>
      </footer>

      {/* Floating Cart Button (Mobile) */}
      {itemCount > 0 && (
        <Link
          to={`/store/${slug}/cart`}
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)',
            color: 'white',
            padding: '16px 30px',
            borderRadius: 50,
            textDecoration: 'none',
            fontWeight: 700,
            boxShadow: '0 8px 30px rgba(255,107,53,0.4)',
            display: 'none',
            alignItems: 'center',
            gap: 12,
            zIndex: 300,
          }}
          className="mobile-cart-btn"
        >
          <i className="fas fa-shopping-cart"></i>
          <span>View Cart ({itemCount})</span>
          <span style={{ 
            padding: '4px 12px', 
            background: 'rgba(255,255,255,0.25)', 
            borderRadius: 20,
            fontSize: 14,
          }}>
            ${total.toFixed(2)}
          </span>
        </Link>
      )}

      {/* Track Order Modal */}
      {showTrackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }} onClick={() => setShowTrackModal(false)}>
          <div 
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 30,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              fontSize: 20, 
              fontWeight: 700, 
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <i className="fas fa-search" style={{ color: '#FF6B35' }}></i>
              Track Your Order
            </h3>
            <input
              type="text"
              placeholder="Enter order number (e.g., ORD123456)"
              value={trackOrderNumber}
              onChange={(e) => setTrackOrderNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 12,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'inherit',
                marginBottom: 15,
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowTrackModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleTrackOrder}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#FF6B35',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-cart-btn {
            display: flex !important;
          }
        }
        @media (min-width: 500px) {
          .track-text {
            display: inline !important;
          }
        }
        @media (max-width: 600px) {
          .nav-text {
            display: none;
          }
        }
        @media (min-width: 601px) {
          .nav-text {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}
