import { Link } from 'react-router';
import Layout from '../components/Layout';
import Logo from '../components/Logo';
import { menuCategories } from '../data/menuData';

export default function Home() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <Logo size="large" />
        
        <h1 style={{
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 'clamp(60px, 10vw, 120px)',
          color: 'var(--primary)',
          margin: '40px 0 20px',
          letterSpacing: -2,
          textShadow: '3px 3px 0 var(--secondary)',
        }}>
          GOLDEN HOUR
        </h1>
        
        <p style={{
          fontSize: 24,
          fontWeight: 400,
          color: 'var(--text)',
          opacity: 0.8,
          maxWidth: 600,
          margin: '0 auto 40px',
        }}>
          Artisan coffee crafted with care, served during the most beautiful hours of the day.
        </p>

        <Link
          to="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--primary)',
            color: 'white',
            padding: '18px 40px',
            borderRadius: 50,
            fontWeight: 800,
            fontSize: 20,
            textDecoration: 'none',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 5px 20px rgba(255, 107, 53, 0.4)',
          }}
        >
          <i className="fas fa-book-open"></i>
          View Our Menu
        </Link>
      </div>

      {/* Category Cards */}
      <div style={{ marginTop: 80 }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: 36,
          textAlign: 'center',
          color: 'var(--text)',
          marginBottom: 40,
        }}>
          Explore Our Offerings
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 30,
        }}>
          {menuCategories.map(category => (
            <Link
              key={category.slug}
              to={`/menu/${category.slug}`}
              style={{
                background: 'var(--card-bg)',
                borderRadius: 30,
                padding: 30,
                textAlign: 'center',
                textDecoration: 'none',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                width: 80,
                height: 80,
                margin: '0 auto 20px',
                background: 'var(--secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <i className={`fas ${category.icon}`} style={{ fontSize: 36, color: 'white' }}></i>
              </div>
              <h3 style={{
                fontWeight: 800,
                fontSize: 20,
                color: 'var(--text)',
                marginBottom: 8,
              }}>
                {category.name}
              </h3>
              <p style={{
                fontWeight: 400,
                fontSize: 16,
                color: 'var(--primary)',
              }}>
                {category.items.length} items
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div style={{
        marginTop: 80,
        background: 'var(--card-bg)',
        borderRadius: 30,
        padding: 50,
        textAlign: 'center',
      }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: 32,
          color: 'var(--secondary)',
          marginBottom: 20,
        }}>
          <i className="fas fa-star" style={{ color: 'var(--primary)', marginRight: 12 }}></i>
          Customer Favorite
        </h2>
        <div style={{
          fontSize: 60,
          color: 'var(--primary)',
          marginBottom: 20,
        }}>
          <i className="fas fa-mug-hot"></i>
        </div>
        <h3 style={{ fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 10 }}>
          Golden Hour Latte
        </h3>
        <p style={{ fontSize: 18, color: 'var(--text)', opacity: 0.8, marginBottom: 15 }}>
          Our signature latte with honey, cinnamon, and a touch of vanilla
        </p>
        <p style={{ fontWeight: 700, fontSize: 24, color: 'var(--secondary)' }}>
          $6.50
        </p>
      </div>
    </Layout>
  );
}
