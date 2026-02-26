import { Link } from "react-router";

export default function Footer() {
  return (
    <footer style={{
      marginTop: 80,
      padding: 30,
      background: 'var(--secondary)',
      color: 'white',
      borderRadius: 30,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="fas fa-clock" style={{ fontSize: 20 }}></i>
        <span>Mon-Fri: 7am-7pm | Sat-Sun: 8am-8pm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="fas fa-map-marker-alt" style={{ fontSize: 20 }}></i>
        <span>123 Coffee Street, Brew City</span>
      </div>
      <div style={{ display: 'flex', gap: 15 }}>
        <a href="#" style={{ fontSize: 24, color: 'white', transition: 'color 0.3s' }}>
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" style={{ fontSize: 24, color: 'white', transition: 'color 0.3s' }}>
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" style={{ fontSize: 24, color: 'white', transition: 'color 0.3s' }}>
          <i className="fab fa-twitter"></i>
        </a>
      </div>
      <div style={{ 
        width: '100%', 
        textAlign: 'center', 
        marginTop: 10,
        paddingTop: 15,
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Link 
          to="/admin" 
          style={{ 
            fontSize: 12, 
            color: 'rgba(255,255,255,0.5)', 
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <i className="fas fa-lock" style={{ marginRight: 5 }}></i>
          Business Portal
        </Link>
      </div>
    </footer>
  );
}
