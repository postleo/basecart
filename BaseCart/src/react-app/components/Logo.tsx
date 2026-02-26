import { Link } from 'react-router';

interface LogoProps {
  size?: 'small' | 'large';
}

export default function Logo({ size = 'large' }: LogoProps) {
  const dimension = size === 'large' ? 200 : 80;
  const iconSize = size === 'large' ? 60 : 28;
  const fontSize = size === 'large' ? 16 : 8;

  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <div
        style={{
          width: dimension,
          height: dimension,
          margin: size === 'large' ? '0 auto' : '0',
          position: 'relative',
          background: 'var(--card-bg)',
          borderRadius: '50%',
          border: `${size === 'large' ? 4 : 2}px solid var(--primary)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i className="fas fa-coffee" style={{ fontSize: iconSize, color: 'var(--primary)' }}></i>
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
            <defs>
              <path id="circlePath" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
            </defs>
            <text style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize, fill: 'var(--secondary)', letterSpacing: '2px' }}>
              <textPath href="#circlePath" startOffset="25%">
                GOLDEN HOUR
              </textPath>
            </text>
            <text style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize, fill: 'var(--secondary)', letterSpacing: '2px' }}>
              <textPath href="#circlePath" startOffset="75%">
                COFFEE CO.
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </Link>
  );
}
