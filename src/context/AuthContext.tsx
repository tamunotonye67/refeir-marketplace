import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VerificationStatus } from '../types';

export interface DemoPersona {
  id: string;
  name: string;
  roleDescription: string;
  country: string;
  city: string;
  roles: UserRole[];
  active_role: UserRole;
  email: string;
  avatar_url: string;
  verification_status: VerificationStatus;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'user-sarah',
    name: 'Sarah Adeyemi',
    roleDescription: 'Elite Scout (Nigeria)',
    country: 'Nigeria',
    city: 'Lagos',
    roles: ['SCOUT', 'CLIENT'],
    active_role: 'SCOUT',
    email: 'sarah.adeyemi@refeir.africa',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verification_status: 'PROFESSION_VERIFIED'
  },
  {
    id: 'user-amaka',
    name: 'Amaka Nwosu',
    roleDescription: 'Senior Product Designer (Nigeria)',
    country: 'Nigeria',
    city: 'Lagos',
    roles: ['TALENT', 'SCOUT'],
    active_role: 'TALENT',
    email: 'amaka.nwosu@refeir.africa',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    verification_status: 'PROFESSION_VERIFIED'
  },
  {
    id: 'user-kofi',
    name: 'Kofi Boateng',
    roleDescription: 'Professional Scout & Tech Connector (Ghana)',
    country: 'Ghana',
    city: 'Accra',
    roles: ['SCOUT', 'TALENT'],
    active_role: 'SCOUT',
    email: 'kofi.boateng@refeir.africa',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    verification_status: 'PROFESSION_VERIFIED'
  },
  {
    id: 'user-client-kenya',
    name: 'David Kamau',
    roleDescription: 'Business Client (Twiga Logistics, Kenya)',
    country: 'Kenya',
    city: 'Nairobi',
    roles: ['CLIENT', 'BUSINESS'],
    active_role: 'CLIENT',
    email: 'david.kamau@twigalogistics.co.ke',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verification_status: 'IDENTITY_VERIFIED'
  },
  {
    id: 'user-admin-refeir',
    name: 'Antigravity Admin',
    roleDescription: 'Pan-African Super Admin',
    country: 'Pan-Africa',
    city: 'Pan-Africa',
    roles: ['ADMIN', 'CLIENT', 'TALENT', 'SCOUT'],
    active_role: 'ADMIN',
    email: 'admin@refeir.africa',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    verification_status: 'PROFESSION_VERIFIED'
  },
  {
    id: 'user-unverified-talent',
    name: 'Tariq Al-Mansoor',
    roleDescription: 'New Talent (Unverified & Missing Tax Profile)',
    country: 'Egypt',
    city: 'Cairo',
    roles: ['TALENT'],
    active_role: 'TALENT',
    email: 'tariq.mansoor@refeir.africa',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verification_status: 'UNVERIFIED'
  }
];

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  switchPersona: (personaId: string) => void;
  login: (email: string) => void;
  logout: () => void;
  signup: (userData: Partial<User>) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  upgradeToPro: (tier: 'SCOUT_PRO' | 'TALENT_PRO' | 'CLIENT_PRO') => void;
  demoPersonas: DemoPersona[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('refeir_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('refeir_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('refeir_auth_user');
    }
  }, [currentUser]);

  const switchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
      const updatedRoles = prev.roles.includes(newRole) ? prev.roles : [...prev.roles, newRole];
      const updated: User = {
        ...prev,
        roles: updatedRoles,
        active_role: newRole
      };
      localStorage.setItem('refeir_auth_user', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('refeir-role-switched', { detail: { newRole, previousRole: prev.active_role } }));
      return updated;
    });
  };

  const switchPersona = (personaId: string) => {
    const p = DEMO_PERSONAS.find(item => item.id === personaId);
    if (!p) return;
    setCurrentUser({
      id: p.id,
      first_name: p.name.split(' ')[0],
      last_name: p.name.split(' ')[1] || '',
      email: p.email,
      phone: p.country === 'Ghana' ? '+233 24 123 4567' : p.country === 'Kenya' ? '+254 712 345 678' : '+234 802 987 6543',
      country: p.country,
      city: p.city,
      primary_language: 'English',
      timezone: p.country === 'Ghana' ? 'Africa/Accra' : p.country === 'Kenya' ? 'Africa/Nairobi' : 'Africa/Lagos',
      avatar_url: p.avatar_url,
      roles: p.roles,
      active_role: p.active_role,
      verification_status: p.verification_status,
      created_at: '2026-01-10T00:00:00Z',
      // Refeir Pro Subscriptions
      is_pro: p.id === 'user-sarah' || p.id === 'user-amaka' || p.id === 'user-client-kenya' || p.id === 'user-admin-refeir',
      pro_tier: p.id === 'user-sarah' ? 'SCOUT_PRO' : p.id === 'user-amaka' ? 'TALENT_PRO' : p.id === 'user-client-kenya' ? 'CLIENT_PRO' : 'SCOUT_PRO',
      pro_subscribed_at: '2026-02-01T00:00:00Z',
      airfee_tokens_balance: p.id === 'user-sarah' ? 5 : (p.id === 'user-kofi' ? 2 : 0),
      is_featured_talent: p.id === 'user-amaka',
      refeir_desk_enabled: p.id === 'user-client-kenya',
      // Role Onboarding Details
      scout_onboarding_completed: p.id === 'user-sarah' || p.id === 'user-kofi' || p.id === 'user-admin-refeir',
      scout_specialty: p.id === 'user-kofi' ? 'Fintech & Web3 Connectors' : 'Software Engineering & Tech',
      scout_payout_preference: p.country === 'Ghana' ? 'Mobile Money (MTN MoMo)' : 'Bank Transfer',
      talent_onboarding_completed: p.id === 'user-amaka' || p.id === 'user-admin-refeir',
      headline: p.id === 'user-amaka' ? 'Senior Product Designer & Design Systems Lead' : undefined,
      talent_years_experience: p.id === 'user-amaka' ? 6 : undefined,
      talent_starting_rate: p.id === 'user-amaka' ? 450000 : undefined,
      talent_rate_currency: 'NGN',
      client_onboarding_completed: p.id === 'user-client-kenya' || p.id === 'user-admin-refeir',
      company_name: p.id === 'user-client-kenya' ? 'Twiga Logistics' : undefined,
      company_industry: p.id === 'user-client-kenya' ? 'Logistics & Supply Chain' : undefined,
      company_size: p.id === 'user-client-kenya' ? 'Growth (11 - 50 employees)' : undefined,
      client_billing_currency: p.id === 'user-client-kenya' ? 'KES' : 'USD',
      // Tax Compliance Configuration
      tax_country: p.country,
      tax_id_type: p.country === 'Nigeria' ? 'NIGERIA_TIN' : p.country === 'Kenya' ? 'KENYA_KRA_PIN' : p.country === 'Ghana' ? 'GHANA_CARD_TIN' : 'INTERNATIONAL_TAX_ID',
      tax_id_number: p.id === 'user-unverified-talent' ? '' : p.id === 'user-sarah' ? '23891024-0001' : p.id === 'user-amaka' ? '24918204-0002' : p.id === 'user-client-kenya' ? 'A019283746Z' : p.id === 'user-kofi' ? 'GHA-721908234-1' : 'RC-1892044-TIN',
      tax_business_type: p.id === 'user-client-kenya' ? 'REGISTERED_BUSINESS' : (p.id === 'user-admin-refeir' ? 'CORPORATION_ENTERPRISE' : 'INDIVIDUAL_FREELANCER'),
      registered_company_rc: p.id === 'user-client-kenya' ? 'CPR/2021/89210' : (p.country === 'Nigeria' ? 'RC-1892044' : undefined),
      vat_registered: p.id === 'user-client-kenya' || p.id === 'user-admin-refeir',
      vat_id_number: p.id === 'user-client-kenya' ? 'P051239847K' : (p.id === 'user-admin-refeir' ? 'NG-VAT-1892044' : undefined),
      tax_withholding_rate: p.country === 'Ghana' ? 7.5 : 5.0,
      tax_exemption_status: 'NONE'
    });
  };

  const login = (email: string) => {
    const existing = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      switchPersona(existing.id);
    } else {
      const defaultP = DEMO_PERSONAS[0];
      setCurrentUser({
        id: `user-${Date.now()}`,
        email,
        first_name: email.split('@')[0],
        last_name: 'Member',
        phone: '+234 800 000 0000',
        country: 'Nigeria',
        city: 'Lagos',
        primary_language: 'English',
        timezone: 'Africa/Lagos',
        avatar_url: defaultP.avatar_url,
        roles: ['SCOUT', 'CLIENT'],
        active_role: 'SCOUT',
        verification_status: 'UNVERIFIED',
        created_at: new Date().toISOString(),
        scout_onboarding_completed: false,
        talent_onboarding_completed: false,
        client_onboarding_completed: false
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('refeir_auth_user');
    setCurrentUser(null);
  };

  const signup = (userData: Partial<User>) => {
    const defaultP = DEMO_PERSONAS[0];
    const newUser: User = {
      id: `user-${Date.now()}`,
      first_name: userData.first_name || 'New',
      last_name: userData.last_name || 'Member',
      email: userData.email || 'user@refeir.africa',
      phone: userData.phone || '+234 800 000 0000',
      country: userData.country || 'Nigeria',
      city: userData.city || 'Lagos',
      primary_language: 'English',
      timezone: 'Africa/Lagos',
      avatar_url: defaultP.avatar_url,
      roles: userData.roles || ['SCOUT'],
      active_role: userData.active_role || 'SCOUT',
      verification_status: 'UNVERIFIED',
      created_at: new Date().toISOString(),
      scout_onboarding_completed: false,
      talent_onboarding_completed: false,
      client_onboarding_completed: false
    };
    setCurrentUser(newUser);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated: User = {
        ...prev,
        ...updatedData
      };
      localStorage.setItem('refeir_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  const upgradeToPro = (tier: 'SCOUT_PRO' | 'TALENT_PRO' | 'CLIENT_PRO') => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated: User = {
        ...prev,
        is_pro: true,
        pro_tier: tier,
        pro_subscribed_at: new Date().toISOString(),
        pro_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        airfee_tokens_balance: tier === 'SCOUT_PRO' ? (prev.airfee_tokens_balance || 0) + 5 : prev.airfee_tokens_balance,
        is_featured_talent: tier === 'TALENT_PRO' ? true : prev.is_featured_talent,
        refeir_desk_enabled: tier === 'CLIENT_PRO' ? true : prev.refeir_desk_enabled
      };
      localStorage.setItem('refeir_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        switchRole,
        switchPersona,
        login,
        logout,
        signup,
        updateProfile,
        upgradeToPro,
        demoPersonas: DEMO_PERSONAS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
