import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Lock, ArrowRight, UserCheck, Briefcase, Users, LogIn, UserPlus } from 'lucide-react';
import { GLOBAL_COUNTRIES, getCountryByName } from '../../data/countries';

import { TalentProfile } from '../../types';

interface AuthGateWallProps {
  pageName: string;
  roleRequired?: string;
  initialTab?: 'LOGIN' | 'SIGNUP';
  initialRole?: 'SCOUT' | 'TALENT' | 'CLIENT';
  talentToHire?: TalentProfile | null;
  onNavigate: (path: string) => void;
  onSuccess?: () => void;
}

export const AuthGateWall: React.FC<AuthGateWallProps> = ({
  pageName,
  roleRequired = 'Member',
  initialTab = 'LOGIN',
  initialRole = 'CLIENT',
  talentToHire,
  onNavigate,
  onSuccess
}) => {
  const { login, signup } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+1');
  const [role, setRole] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>(initialRole);
  const [country, setCountry] = useState('United States');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, password || undefined);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const parts = name.trim().split(' ');
    await signup({
      first_name: parts[0] || 'User',
      last_name: parts.slice(1).join(' ') || 'Member',
      email,
      password: password || undefined,
      phone: phone ? `${dialCode} ${phone}` : undefined,
      roles: [role],
      active_role: role,
      country
    });
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="rf-container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '860px' }}>
      <div
        className="rf-card"
        style={{
          padding: 'clamp(2rem, 5vw, 3.25rem) clamp(1.5rem, 4vw, 2.75rem)',
          backgroundColor: isDark ? '#0A1E12' : '#FFFFFF',
          backgroundImage: isDark ? 'linear-gradient(180deg, rgba(14, 38, 25, 0.98) 0%, rgba(7, 20, 13, 0.99) 100%)' : 'none',
          border: isDark ? '1.5px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(18, 43, 26, 0.12)',
          borderRadius: '24px',
          boxShadow: isDark ? '0 24px 60px rgba(0, 0, 0, 0.65)' : '0 20px 48px rgba(18, 43, 26, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
          color: isDark ? '#FFFFFF' : '#0F172A',
          transition: 'all 0.25s ease'
        }}
      >
        {/* Lock Icon & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(22, 163, 74, 0.12)',
              border: isDark ? '1.5px solid rgba(102, 187, 42, 0.4)' : '1.5px solid rgba(22, 163, 74, 0.32)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: isDark ? 'var(--rf-leaf-green)' : '#16A34A',
              boxShadow: isDark ? '0 0 25px rgba(102, 187, 42, 0.25)' : '0 0 20px rgba(22, 163, 74, 0.15)'
            }}
          >
            <Lock size={28} />
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: isDark ? 'var(--rf-leaf-green)' : '#15803D',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: isDark ? 'rgba(102, 187, 42, 0.1)' : 'rgba(22, 163, 74, 0.1)',
              padding: '0.3rem 0.85rem',
              borderRadius: '100px',
              marginBottom: '0.75rem',
              border: isDark ? 'none' : '1px solid rgba(22, 163, 74, 0.2)'
            }}
          >
            <Shield size={13} /> {talentToHire ? 'CLIENT REGISTRATION' : 'AUTHENTICATION REQUIRED'}
          </span>

          <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {talentToHire ? `Register as a Client to Hire ${talentToHire.full_name}` : `Sign In to Access ${pageName}`}
          </h1>

          <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.9375rem', maxWidth: '540px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
            {talentToHire
              ? `Create your client account to initiate escrow-protected milestones and collaborate directly with ${talentToHire.full_name.split(' ')[0]}.`
              : `This workspace contains private financial custody, active contracts, and sensitive communications. Please log in or create your verified Refeir account.`}
          </p>
        </div>

        {/* Talent Target Preview Card */}
        {talentToHire && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: isDark ? 'rgba(54, 224, 160, 0.08)' : '#F8FAF9',
              border: isDark ? '1px solid rgba(54, 224, 160, 0.25)' : '1px solid rgba(22, 163, 74, 0.2)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              maxWidth: '480px',
              margin: '0 auto 2rem'
            }}
          >
            <img
              src={talentToHire.avatar_url}
              alt={talentToHire.full_name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--rf-mint)'
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-mint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Selected Talent
              </div>
              <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {talentToHire.full_name}
              </div>
              <div style={{ fontSize: '0.8125rem', color: isDark ? '#CBD5E1' : '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {talentToHire.headline}
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher: Login vs Sign Up */}
        <div style={{ maxWidth: '420px', margin: '0 auto 2rem' }}>
          <div
            style={{
              display: 'flex',
              background: isDark ? 'rgba(0, 0, 0, 0.45)' : '#F1F5F9',
              padding: '4px',
              borderRadius: 'var(--rf-radius-md)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              marginBottom: '1.75rem'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('LOGIN')}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: 'var(--rf-radius-sm)',
                border: 'none',
                background: activeTab === 'LOGIN' ? (isDark ? 'var(--rf-leaf-green)' : '#16A34A') : 'transparent',
                color: activeTab === 'LOGIN' ? (isDark ? '#081C10' : '#FFFFFF') : (isDark ? 'var(--rf-slate-400)' : '#64748B'),
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'LOGIN' && !isDark ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SIGNUP')}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: 'var(--rf-radius-sm)',
                border: 'none',
                background: activeTab === 'SIGNUP' ? (isDark ? 'var(--rf-leaf-green)' : '#16A34A') : 'transparent',
                color: activeTab === 'SIGNUP' ? (isDark ? '#081C10' : '#FFFFFF') : (isDark ? 'var(--rf-slate-400)' : '#64748B'),
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'SIGNUP' && !isDark ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {activeTab === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Email Address</label>
                <input
                  type="email"
                  className="rf-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    backgroundColor: isDark ? 'rgba(7, 22, 13, 0.92)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                  }}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Password</label>
                <input
                  type="password"
                  className="rf-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    backgroundColor: isDark ? 'rgba(7, 22, 13, 0.92)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                  }}
                />
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn-primary rf-btn-lg"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  fontWeight: 800,
                  background: isDark ? 'var(--rf-leaf-green)' : 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                  color: isDark ? '#081C10' : '#FFFFFF',
                  boxShadow: isDark ? '0 4px 16px rgba(102, 187, 42, 0.3)' : '0 4px 16px rgba(22, 163, 74, 0.3)'
                }}
              >
                <LogIn size={16} />
                <span>Log In & Continue</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Full Name</label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="Amara Okafor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    backgroundColor: isDark ? 'rgba(7, 22, 13, 0.92)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                  }}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Email Address</label>
                <input
                  type="email"
                  className="rf-input"
                  placeholder="amara@refeir.africa"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    backgroundColor: isDark ? 'rgba(7, 22, 13, 0.92)' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                  }}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Primary Account Role</label>
                <select
                  className="rf-select"
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  style={{
                    backgroundColor: isDark ? '#0F2E1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                  }}
                >
                  <option value="SCOUT">Scout (Refer talent & earn 10% lifetime rewards)</option>
                  <option value="TALENT">Talent (Offer services & work on projects)</option>
                  <option value="CLIENT">Client (Hire talent & post jobs)</option>
                </select>
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Global Location / Country</label>
                <select
                  className="rf-select"
                  value={country}
                  onChange={e => {
                    const selectedName = e.target.value;
                    const matchedCountry = getCountryByName(selectedName);
                    setCountry(selectedName);
                    if (matchedCountry) {
                      setDialCode(matchedCountry.dialCode);
                    }
                  }}
                  style={{
                    backgroundColor: isDark ? '#0F2E1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                  }}
                >
                  <optgroup label="Global Enterprise & Client Markets">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'GLOBAL').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Pan-African Sovereign Nations">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'AFRICA').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label" style={{ color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.375rem', display: 'block' }}>Phone Number & Country Code</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    className="rf-select"
                    style={{
                      width: '135px',
                      flexShrink: 0,
                      padding: '0.65rem 0.5rem',
                      fontSize: '0.8125rem',
                      backgroundColor: isDark ? '#0F2E1E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                    }}
                    value={dialCode}
                    onChange={e => setDialCode(e.target.value)}
                  >
                    <optgroup label="Global Calling Codes">
                      {GLOBAL_COUNTRIES.filter(c => c.region === 'GLOBAL').map(c => (
                        <option key={c.code} value={c.dialCode}>
                          {c.flag} {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pan-African Calling Codes">
                      {GLOBAL_COUNTRIES.filter(c => c.region === 'AFRICA').map(c => (
                        <option key={c.code} value={c.dialCode}>
                          {c.flag} {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <input
                    type="tel"
                    className="rf-input"
                    placeholder="e.g. 801 234 5678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: isDark ? 'rgba(7, 22, 13, 0.92)' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #CBD5E1'
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn-primary rf-btn-lg"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  fontWeight: 800,
                  background: isDark ? 'var(--rf-leaf-green)' : 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                  color: isDark ? '#081C10' : '#FFFFFF',
                  boxShadow: isDark ? '0 4px 16px rgba(102, 187, 42, 0.3)' : '0 4px 16px rgba(22, 163, 74, 0.3)'
                }}
              >
                <UserPlus size={16} />
                <span>Create Verified Account</span>
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigate('/marketplace')}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? 'var(--rf-slate-400)' : '#64748B',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            ← Back to Public Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
