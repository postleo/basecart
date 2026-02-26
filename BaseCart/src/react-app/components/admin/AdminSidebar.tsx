import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { useBusiness } from '../../context/BusinessContext';
import { useSidebar } from '../../context/SidebarContext';

const navItems = [
  { path: '/admin', icon: 'fa-tachometer-alt', label: 'Dashboard', exact: true },
  { path: '/admin/orders', icon: 'fa-receipt', label: 'Orders' },
  { path: '/admin/menu', icon: 'fa-utensils', label: 'Menu' },
  { path: '/admin/settings', icon: 'fa-cog', label: 'Settings' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [displayName, setDisplayName] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile?.display_name) {
          setDisplayName(data.profile.display_name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for profile updates from settings page
    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  const sidebarWidth = isCollapsed ? 70 : 260;

  return (
    <aside style={{
      width: sidebarWidth,
      background: 'var(--secondary)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'width 0.25s ease',
      overflow: 'hidden',
    }}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: 12,
          right: isCollapsed ? 'auto' : 12,
          left: isCollapsed ? '50%' : 'auto',
          transform: isCollapsed ? 'translateX(-50%)' : 'none',
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`} style={{ fontSize: 12 }}></i>
      </button>

      {/* Business Header */}
      <div style={{
        padding: isCollapsed ? '50px 10px 20px' : '50px 20px 25px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transition: 'padding 0.25s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          <div style={{
            width: 45,
            height: 45,
            minWidth: 45,
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="fas fa-store" style={{ fontSize: 20 }}></i>
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {business?.name || 'Order Manager'}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Admin Portal</div>
            </div>
          )}
        </div>
        {business && !isCollapsed && (
          <a 
            href={`/store/${business.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <i className="fas fa-external-link-alt"></i>
            View Storefront
          </a>
        )}
        {business && isCollapsed && (
          <a 
            href={`/store/${business.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Storefront"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              padding: 8,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
            }}
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 0' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            title={isCollapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: isCollapsed ? '14px 0' : '14px 24px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            <i className={`fas ${item.icon}`} style={{ width: 20, textAlign: 'center' }}></i>
            {!isCollapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div style={{
        padding: isCollapsed ? '15px 10px' : '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        transition: 'padding 0.25s ease',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          marginBottom: isCollapsed ? 10 : 15,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}>
          {user?.google_user_data?.picture ? (
            <img
              src={user.google_user_data.picture}
              alt=""
              style={{ width: 40, height: 40, minWidth: 40, borderRadius: '50%' }}
            />
          ) : (
            <div style={{
              width: 40,
              height: 40,
              minWidth: 40,
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className="fas fa-user"></i>
            </div>
          )}
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName || user?.google_user_data?.name || 'Admin'}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => logout()}
          title={isCollapsed ? 'Sign Out' : undefined}
          style={{
            width: '100%',
            padding: isCollapsed ? '10px 0' : '10px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Nunito',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isCollapsed ? 0 : 8,
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
