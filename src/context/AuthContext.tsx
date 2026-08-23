import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VerificationStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  isLoading: boolean;
  authError: string | null;
  switchRole: (role: UserRole) => void;
  switchPersona: (personaId: string) => void;
  login: (email: string, password?: string) => Promise<void> | void;
  logout: () => Promise<void> | void;
  signup: (userData: Partial<User> & { password?: string }) => Promise<void> | void;
  updateProfile: (updatedData: Partial<User>) => Promise<void> | void;
  upgradeToPro: (tier: 'SCOUT_PRO' | 'TALENT_PRO' | 'CLIENT_PRO') => void;
  demoPersonas: DemoPersona[];
  isLiveSupabase: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync state to localStorage for offline / persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('refeir_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('refeir_auth_user');
    }
  }, [currentUser]);

  // Load user profile from Supabase on session change
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async (userId: string, email: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading Supabase profile:', error.message);
        }

        if (data) {
          const parts = (data.name || '').trim().split(' ');
          const userObj: User = {
            id: data.id,
            email: data.email || email,
            first_name: parts[0] || 'User',
            last_name: parts.slice(1).join(' ') || 'Member',
            phone: data.phone || '+234 800 000 0000',
            avatar_url: data.avatar_url || DEMO_PERSONAS[0].avatar_url,
            roles: (data.roles as UserRole[]) || ['CLIENT'],
            active_role: (data.active_role as UserRole) || 'CLIENT',
            country: data.country || 'Nigeria',
            city: data.city || 'Lagos',
            verification_status: (data.verification_status as VerificationStatus) || 'UNVERIFIED',
            created_at: data.created_at || new Date().toISOString(),
            primary_language: 'English',
            timezone: 'Africa/Lagos'
          };
          setCurrentUser(userObj);
        }
      } catch (err) {
        console.error('Profile fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        if (!currentUser?.id.startsWith('user-')) {
          setCurrentUser(null);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const switchRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    const updatedRoles = currentUser.roles.includes(newRole) ? currentUser.roles : [...currentUser.roles, newRole];
    const updated: User = {
      ...currentUser,
      roles: updatedRoles,
      active_role: newRole
    };
    setCurrentUser(updated);
    window.dispatchEvent(new CustomEvent('refeir-role-switched', { detail: { newRole, previousRole: currentUser.active_role } }));

    if (isSupabaseConfigured && !currentUser.id.startsWith('user-')) {
      try {
        await supabase
          .from('profiles')
          .update({ active_role: newRole, roles: updatedRoles })
          .eq('id', currentUser.id);
      } catch (err) {
        console.error('Failed to sync role change to Supabase:', err);
      }
    }
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
      is_pro: p.id === 'user-sarah' || p.id === 'user-amaka' || p.id === 'user-client-kenya' || p.id === 'user-admin-refeir',
      pro_tier: p.id === 'user-sarah' ? 'SCOUT_PRO' : p.id === 'user-amaka' ? 'TALENT_PRO' : p.id === 'user-client-kenya' ? 'CLIENT_PRO' : 'SCOUT_PRO',
      pro_subscribed_at: '2026-02-01T00:00:00Z',
      airfee_tokens_balance: p.id === 'user-sarah' ? 5 : (p.id === 'user-kofi' ? 2 : 0),
      is_featured_talent: p.id === 'user-amaka',
      refeir_desk_enabled: p.id === 'user-client-kenya',
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

  const login = async (email: string, password?: string) => {
    setAuthError(null);
    const existingDemo = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (isSupabaseConfigured && password && !existingDemo) {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        throw error;
      }
      return;
    }

    if (existingDemo) {
      switchPersona(existingDemo.id);
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

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem('refeir_auth_user');
    setCurrentUser(null);
  };

  const signup = async (userData: Partial<User> & { password?: string }) => {
    setAuthError(null);
    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'New Member';

    if (isSupabaseConfigured && userData.password && userData.email) {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: fullName,
            role: userData.active_role || 'CLIENT',
            country: userData.country || 'Nigeria'
          }
        }
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        throw error;
      }
      return;
    }

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

  const updateProfile = async (updatedData: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated: User = {
        ...prev,
        ...updatedData
      };
      localStorage.setItem('refeir_auth_user', JSON.stringify(updated));
      return updated;
    });

    if (isSupabaseConfigured && currentUser && !currentUser.id.startsWith('user-')) {
      try {
        const payload: Record<string, any> = {};
        if (updatedData.first_name || updatedData.last_name) {
          payload.name = `${updatedData.first_name || currentUser.first_name} ${updatedData.last_name || currentUser.last_name}`.trim();
        }
        if (updatedData.avatar_url) payload.avatar_url = updatedData.avatar_url;
        if (updatedData.country) payload.country = updatedData.country;
        if (updatedData.city) payload.city = updatedData.city;
        if (updatedData.bio) payload.bio = updatedData.bio;

        if (Object.keys(payload).length > 0) {
          await supabase.from('profiles').update(payload).eq('id', currentUser.id);
        }
      } catch (err) {
        console.error('Failed to sync profile update to Supabase:', err);
      }
    }
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
        isLoading,
        authError,
        switchRole,
        switchPersona,
        login,
        logout,
        signup,
        updateProfile,
        upgradeToPro,
        demoPersonas: DEMO_PERSONAS,
        isLiveSupabase: isSupabaseConfigured
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
