import { Link } from 'react-router';
import Layout from '../components/Layout';
import { menuCategories } from '../data/menuData';

export default function Menu() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: 'var(--primary)',
          marginBottom: 20,
          textShadow: '2px 2px 0 var(--secondary)',
        }}>
          OUR MENU
        </h1>
        <p style={{
          fontSize: 20,
          fontWeight: 400,
          color: 'var(--text)',
          opacity: 0.8,
        }}>
          Select a category to explore our offerings
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 30,
      }}>
        {menuCategories.map(category => (
          <Link
            key={category.slug}
            to={`/menu/${category.slug}`}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 30,
              padding: 40,
              textAlign: 'center',
              textDecoration: 'none',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              border: '3px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{
              width: 100,
              height: 100,
              margin: '0 auto 25px',
              background: 'var(--secondary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 5px 20px rgba(26, 77, 62, 0.3)',
            }}>
              <i className={`fas ${category.icon}`} style={{ fontSize: 44, color: 'white' }}></i>
            </div>
            
            <h2 style={{
              fontWeight: 800,
              fontSize: 24,
              color: 'var(--text)',
              marginBottom: 10,
              letterSpacing: 1,
            }}>
              {category.name}
            </h2>
            
            <p style={{
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--primary)',
              marginBottom: 20,
            }}>
              {category.items.length} delicious items
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: 'var(--secondary)',
              fontWeight: 700,
            }}>
              <span>View Menu</span>
              <i className="fas fa-arrow-right"></i>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Info */}
      <div style={{
        marginTop: 60,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
      }}>
        <div style={{
          background: 'var(--secondary)',
          color: 'white',
          borderRadius: 30,
          padding: 25,
          textAlign: 'center',
        }}>
          <i className="fas fa-leaf" style={{ fontSize: 28, marginBottom: 10 }}></i>
          <p style={{ fontWeight: 700 }}>Organic Beans</p>
        </div>
        <div style={{
          background: 'var(--secondary)',
          color: 'white',
          borderRadius: 30,
          padding: 25,
          textAlign: 'center',
        }}>
          <i className="fas fa-heart" style={{ fontSize: 28, marginBottom: 10 }}></i>
          <p style={{ fontWeight: 700 }}>Made with Love</p>
        </div>
        <div style={{
          background: 'var(--secondary)',
          color: 'white',
          borderRadius: 30,
          padding: 25,
          textAlign: 'center',
        }}>
          <i className="fas fa-recycle" style={{ fontSize: 28, marginBottom: 10 }}></i>
          <p style={{ fontWeight: 700 }}>Eco-Friendly</p>
        </div>
        <div style={{
          background: 'var(--secondary)',
          color: 'white',
          borderRadius: 30,
          padding: 25,
          textAlign: 'center',
        }}>
          <i className="fas fa-award" style={{ fontSize: 28, marginBottom: 10 }}></i>
          <p style={{ fontWeight: 700 }}>Award Winning</p>
        </div>
      </div>
    </Layout>
  );
}
