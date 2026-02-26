interface AdminTopbarProps {
  title: string;
  subtitle?: string;
}

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  return (
    <header style={{
      padding: '20px 30px',
      background: 'var(--card-bg)',
      borderBottom: '2px solid var(--grid-line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{
          fontWeight: 800,
          fontSize: 24,
          color: 'var(--text)',
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'var(--text)', opacity: 0.6, margin: '4px 0 0', fontSize: 14 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <a
          href="/order"
          target="_blank"
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: 'var(--primary)',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fas fa-external-link-alt"></i>
          View Store
        </a>
      </div>
    </header>
  );
}
