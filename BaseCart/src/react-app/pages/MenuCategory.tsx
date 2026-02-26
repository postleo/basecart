import { useParams, Link, Navigate } from 'react-router';
import Layout from '../components/Layout';
import MenuItemCard from '../components/MenuItemCard';
import { getCategoryBySlug, menuCategories } from '../data/menuData';

export default function MenuCategory() {
  const { category } = useParams<{ category: string }>();
  const categoryData = category ? getCategoryBySlug(category) : null;

  if (!categoryData) {
    return <Navigate to="/menu" replace />;
  }

  const currentIndex = menuCategories.findIndex(c => c.slug === category);
  const prevCategory = currentIndex > 0 ? menuCategories[currentIndex - 1] : null;
  const nextCategory = currentIndex < menuCategories.length - 1 ? menuCategories[currentIndex + 1] : null;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 30 }}>
        <Link to="/menu" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--secondary)',
          fontWeight: 700,
          fontSize: 16,
        }}>
          <i className="fas fa-arrow-left"></i>
          Back to Menu
        </Link>
      </div>

      {/* Category Header */}
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div style={{
          width: 120,
          height: 120,
          margin: '0 auto 25px',
          background: 'var(--secondary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(26, 77, 62, 0.3)',
        }}>
          <i className={`fas ${categoryData.icon}`} style={{ fontSize: 50, color: 'white' }}></i>
        </div>
        
        <h1 style={{
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 'clamp(32px, 6vw, 56px)',
          color: 'var(--primary)',
          textShadow: '2px 2px 0 var(--secondary)',
        }}>
          {categoryData.name}
        </h1>
      </div>

      {/* Menu Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 30,
      }}>
        {categoryData.items.map((item, index) => (
          <MenuItemCard key={index} item={item} category={categoryData.slug} />
        ))}
      </div>

      {/* Navigation between categories */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 60,
        flexWrap: 'wrap',
        gap: 20,
      }}>
        {prevCategory ? (
          <Link
            to={`/menu/${prevCategory.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--card-bg)',
              padding: '15px 25px',
              borderRadius: 30,
              color: 'var(--text)',
              fontWeight: 700,
              border: '2px solid var(--secondary)',
              transition: 'all 0.3s',
            }}
          >
            <i className="fas fa-arrow-left"></i>
            <span>{prevCategory.name}</span>
          </Link>
        ) : <div />}
        
        {nextCategory && (
          <Link
            to={`/menu/${nextCategory.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--secondary)',
              padding: '15px 25px',
              borderRadius: 30,
              color: 'white',
              fontWeight: 700,
              transition: 'all 0.3s',
            }}
          >
            <span>{nextCategory.name}</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        )}
      </div>
    </Layout>
  );
}
