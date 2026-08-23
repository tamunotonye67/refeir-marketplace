import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VerificationStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  switchRole: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<void> | void;
  logout: () => Promise<void> | void;
  signup: (userData: Partial<User> & { password?: string }) => Promise<void> | void;
  updateProfile: (updatedData: Partial<User>) => Promise<void> | void;
  upgradeToPro: (tier: 'SCOUT_PRO' | 'TALENT_PRO' | 'CLIENT_PRO') => void;
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
            avatar_url: data.avatar_url || DEFAULT_AVATAR,
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
        setCurrentUser(null);
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

    if (isSupabaseConfigured) {
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

  const login = async (email: string, password?: string) => {
    setAuthError(null);

    if (isSupabaseConfigured && password) {
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

    // Local / Offline Signin
    const parts = email.split('@')[0].split('.');
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      first_name: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Member',
      last_name: parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '',
      phone: '+234 800 000 0000',
      country: 'Nigeria',
      city: 'Lagos',
      primary_language: 'English',
      timezone: 'Africa/Lagos',
      avatar_url: DEFAULT_AVATAR,
      roles: ['CLIENT', 'SCOUT', 'TALENT'],
      active_role: 'SCOUT',
      verification_status: 'UNVERIFIED',
      created_at: new Date().toISOString(),
      scout_onboarding_completed: false,
      talent_onboarding_completed: false,
      client_onboarding_completed: false
    };
    setCurrentUser(newUser);
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
      avatar_url: DEFAULT_AVATAR,
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

    if (isSupabaseConfigured && currentUser) {
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
        login,
        logout,
        signup,
        updateProfile,
        upgradeToPro,
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
