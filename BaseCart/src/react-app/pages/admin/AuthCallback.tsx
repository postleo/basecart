import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate('/admin');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Failed to complete sign in. Please try again.');
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 20,
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 400,
          padding: 40,
          background: 'var(--card-bg)',
          borderRadius: 20,
        }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: 50, color: '#e74c3c', marginBottom: 20 }}></i>
          <h2 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 15 }}>Sign In Failed</h2>
          <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: 25 }}>{error}</p>
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: 'var(--primary)',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Nunito',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: 'var(--primary)', marginBottom: 20 }}></i>
        <p style={{ color: 'var(--text)', fontWeight: 600 }}>Completing sign in...</p>
      </div>
    </div>
  );
}
