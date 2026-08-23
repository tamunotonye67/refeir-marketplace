import React from 'react';
import { Home, Compass, Ticket, Briefcase, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();

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
    <nav className="rf-mobile-nav" aria-label="Mobile Navigation">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.path)}
            className={`rf-mobile-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
