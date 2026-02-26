import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';

export default function AdminLogin() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isPending) {
      navigate('/admin');
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: 'var(--primary)' }}></i>
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
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--card-bg)',
        borderRadius: 24,
        padding: 40,
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          width: 80,
          height: 80,
          margin: '0 auto 25px',
          background: 'var(--primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="fas fa-store" style={{ fontSize: 36, color: 'white' }}></i>
        </div>

        <h1 style={{
          fontWeight: 800,
          fontSize: 28,
          color: 'var(--primary)',
          marginBottom: 8,
        }}>
          Order Manager
        </h1>
        <p style={{
          color: 'var(--text)',
          opacity: 0.7,
          marginBottom: 30,
        }}>
          Admin Portal
        </p>

        <button
          onClick={() => redirectToLogin()}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 12,
            background: 'var(--secondary)',
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontFamily: 'Nunito',
          }}
        >
          <i className="fab fa-google"></i>
          Sign in with Google
        </button>

        <p style={{
          marginTop: 25,
          fontSize: 13,
          color: 'var(--text)',
          opacity: 0.5,
        }}>
          Only authorized staff members can access the admin portal
        </p>
      </div>
    </div>
  );
}
