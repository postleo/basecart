import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { useBusiness } from '../../context/BusinessContext';

export default function BusinessOnboarding() {
  const { user, isPending } = useAuth();
  const { business, isLoading, refetch } = useBusiness();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  // Redirect users who already have a business
  useEffect(() => {
    if (!isPending && !isLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (business) {
        navigate('/admin');
      }
    }
  }, [user, business, isPending, isLoading, navigate]);

  // Show loading while checking auth/business status
  if (isPending || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--secondary) 0%, #0d2a22 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: 'white' }}></i>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create business');
      }

      await refetch();
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--secondary) 0%, #0d2a22 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: 40,
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 70,
            height: 70,
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <i className="fas fa-store" style={{ fontSize: 30, color: 'white' }}></i>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--secondary)', marginBottom: 8 }}>
            Set Up Your Business
          </h1>
          <p style={{ color: '#666', fontSize: 14 }}>
            Welcome, {user?.google_user_data?.name}! Let's get your store ready.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--secondary)' }}>
              Business Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Golden Hour Coffee"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--secondary)' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell customers about your business..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--secondary)' }}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--secondary)' }}>
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fee2e2',
              borderRadius: 10,
              color: '#dc2626',
              marginBottom: 20,
              fontSize: 14,
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !formData.name}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 10,
              background: isSubmitting || !formData.name ? '#ccc' : 'var(--primary)',
              border: 'none',
              color: 'white',
              fontSize: 16,
              fontWeight: 700,
              cursor: isSubmitting || !formData.name ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-rocket"></i>
                Launch My Store
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
