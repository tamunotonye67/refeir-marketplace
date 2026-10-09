import React from 'react';
import { Home, Compass, Ticket, Briefcase, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getDashboardPath = () => {
    if (!currentUser) return '/dashboard/scout';
    if (currentUser.active_role === 'SCOUT') return '/dashboard/scout';
    if (currentUser.active_role === 'TALENT') return '/dashboard/talent';
    if (currentUser.active_role === 'CLIENT') return '/dashboard/client';
    if (currentUser.active_role === 'ADMIN') return '/admin';
    return '/dashboard/scout';
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Explore', icon: Compass, path: '/marketplace' },
    { label: 'Referrals', icon: Ticket, path: '/dashboard/scout' },
    { label: 'Projects', icon: Briefcase, path: getDashboardPath() },
    { label: 'Wallet', icon: Wallet, path: '/wallet' }
  ];

  return (
    <nav
      className="rf-mobile-nav"
      aria-label="Mobile Navigation"
      style={{
        backgroundColor: isDark ? 'rgba(10, 23, 15, 0.98)' : '#FFFFFF',
        borderTop: isDark ? '1px solid rgba(102, 187, 42, 0.22)' : '1px solid rgba(18, 43, 26, 0.12)',
        boxShadow: isDark ? 'none' : '0 -4px 20px rgba(18, 43, 26, 0.08)'
      }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.path)}
            className={`rf-mobile-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
            style={{
              color: isActive
                ? (isDark ? 'var(--rf-leaf-green)' : '#16A34A')
                : (isDark ? 'rgba(255, 255, 255, 0.65)' : '#64748B'),
              background: 'transparent'
            }}
          >
            <Icon size={20} />
            <span style={{ fontWeight: isActive ? 800 : 600 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
