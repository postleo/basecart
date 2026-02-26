import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '@getmocha/users-service/react';

export default function AdminSettings() {
  const { business, refetch } = useBusiness();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [displayName, setDisplayName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    customLinkUrl: '',
    customLinkText: '',
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        address: business.address || '',
        phone: business.phone || '',
        customLinkUrl: business.custom_link_url || '',
        customLinkText: business.custom_link_text || '',
      });
    }
  }, [business]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.display_name) {
            setDisplayName(data.profile.display_name);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
      // Fallback to Google name if no custom name set
      if (user?.google_user_data?.name) {
        setDisplayName(user.google_user_data.name);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName }),
      });

      if (res.ok) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Dispatch event to notify sidebar to refresh
        window.dispatchEvent(new CustomEvent('profile-updated'));
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await refetch();
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const storefrontUrl = business ? `${window.location.origin}/store/${business.slug}` : '';

  return (
    <AdminLayout>
      <div style={{ padding: 30, maxWidth: 700 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 5 }}>Settings</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 30 }}>Manage your business information</p>

        {/* Storefront Link */}
        {business && (
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: 15,
            padding: 20,
            marginBottom: 30,
          }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
              <i className="fas fa-link" style={{ marginRight: 8 }}></i>
              Your Storefront URL
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={storefrontUrl}
                readOnly
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '2px solid #e5e5e5',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  background: '#f5f5f5',
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(storefrontUrl);
                  setMessage({ type: 'success', text: 'URL copied!' });
                }}
                style={{
                  padding: '10px 16px',
                  background: 'var(--secondary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                <i className="fas fa-copy"></i>
              </button>
              <a
                href={storefrontUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 16px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 15,
          padding: 25,
          marginBottom: 30,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fas fa-user-circle" style={{ color: 'var(--primary)' }}></i>
            Your Profile
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
            {user?.google_user_data?.picture ? (
              <img
                src={user.google_user_data.picture}
                alt=""
                style={{ width: 60, height: 60, borderRadius: '50%' }}
              />
            ) : (
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 24,
              }}>
                <i className="fas fa-user"></i>
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>
                {user?.google_user_data?.name || 'Admin'}
              </div>
              <div style={{ fontSize: 14, color: '#888' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
              }}
            />
            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
              This name will be shown in the admin portal sidebar.
            </p>
          </div>

          {profileMessage.text && (
            <div style={{
              padding: '12px 16px',
              background: profileMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
              borderRadius: 10,
              color: profileMessage.type === 'success' ? '#16a34a' : '#dc2626',
              marginBottom: 20,
              fontSize: 14,
            }}>
              <i className={`fas fa-${profileMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ marginRight: 8 }}></i>
              {profileMessage.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            style={{
              padding: '12px 24px',
              background: isSavingProfile ? '#ccc' : 'var(--secondary)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              cursor: isSavingProfile ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isSavingProfile ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Update Profile
              </>
            )}
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} style={{ background: 'var(--card-bg)', borderRadius: 15, padding: 25 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
              Business Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
              }}
            />
          </div>

          {/* Storefront Custom Link Section */}
          <div style={{
            padding: 20,
            background: '#f8f9fa',
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)' }}>
              <i className="fas fa-link" style={{ color: 'var(--primary)' }}></i>
              Storefront Shop Button
            </h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 15 }}>
              Customize the shop button that appears on your storefront navigation bar.
            </p>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                Button Text
              </label>
              <input
                type="text"
                value={formData.customLinkText}
                onChange={(e) => setFormData({ ...formData, customLinkText: e.target.value })}
                placeholder="e.g., Golden Hour, Visit Shop, Home"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '2px solid #e5e5e5',
                  fontSize: 14,
                  fontFamily: 'Nunito',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                Button Link
              </label>
              <input
                type="text"
                value={formData.customLinkUrl}
                onChange={(e) => setFormData({ ...formData, customLinkUrl: e.target.value })}
                placeholder="e.g., /, /order, https://example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '2px solid #e5e5e5',
                  fontSize: 14,
                  fontFamily: 'Nunito',
                }}
              />
              <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
                Use "/" for home page or enter a full URL for external links.
              </p>
            </div>
          </div>

          {message.text && (
            <div style={{
              padding: '12px 16px',
              background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              borderRadius: 10,
              color: message.type === 'success' ? '#16a34a' : '#dc2626',
              marginBottom: 20,
              fontSize: 14,
            }}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ marginRight: 8 }}></i>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: '14px 28px',
              background: isSaving ? '#ccc' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* Danger Zone */}
        <div style={{
          marginTop: 40,
          background: '#fef2f2',
          borderRadius: 15,
          padding: 25,
          border: '2px solid #fecaca',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: 10 }}></i>
            Danger Zone
          </h2>
          <p style={{ color: '#991b1b', fontSize: 14, marginBottom: 20 }}>
            Deleting your account will permanently remove your business, all menu items, and all order history. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: '12px 24px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Nunito',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-trash-alt"></i>
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 30,
            maxWidth: 450,
            width: '100%',
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#dc2626', marginBottom: 15 }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: 10 }}></i>
              Delete Your Account?
            </h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              This will permanently delete <strong>{business?.name}</strong> and all associated data including menu items and orders. This action is irreversible.
            </p>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 10 }}>
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e5e5e5',
                fontSize: 16,
                fontFamily: 'Nunito',
                marginBottom: 20,
              }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmText !== 'DELETE') return;
                  setIsDeleting(true);
                  try {
                    const res = await fetch('/api/business', { method: 'DELETE' });
                    if (res.ok) {
                      await logout();
                      navigate('/');
                    } else {
                      throw new Error('Failed to delete');
                    }
                  } catch (error) {
                    setMessage({ type: 'error', text: 'Failed to delete account' });
                    setShowDeleteModal(false);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: deleteConfirmText === 'DELETE' ? '#dc2626' : '#fca5a5',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: deleteConfirmText === 'DELETE' && !isDeleting ? 'pointer' : 'not-allowed',
                  fontFamily: 'Nunito',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {isDeleting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-alt"></i>
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
