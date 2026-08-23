import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, ArrowRight, UserCheck, Sparkles, Briefcase, Users, LogIn, UserPlus } from 'lucide-react';
import { GLOBAL_COUNTRIES, getCountryByName } from '../../data/countries';

interface AuthGateWallProps {
  pageName: string;
  roleRequired?: string;
  onNavigate: (path: string) => void;
}

export const AuthGateWall: React.FC<AuthGateWallProps> = ({
  pageName,
  roleRequired = 'Member',
  onNavigate
}) => {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+1');
  const [role, setRole] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>('SCOUT');
  const [country, setCountry] = useState('United States');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, password || undefined);
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
  };

  return (
    <div className="rf-container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '860px' }}>
      <div
        className="rf-card"
        style={{
          padding: '3rem 2.5rem',
          background: 'linear-gradient(180deg, rgba(15, 46, 30, 0.95) 0%, rgba(8, 20, 14, 0.98) 100%)',
          border: '1px solid rgba(102, 187, 42, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)'
        }}
      >
        {/* Lock Icon & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(102, 187, 42, 0.15)',
              border: '1.5px solid rgba(102, 187, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--rf-leaf-green)',
              boxShadow: '0 0 25px rgba(102, 187, 42, 0.25)'
            }}
          >
            <Lock size={28} />
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--rf-leaf-green)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(102, 187, 42, 0.1)',
              padding: '0.3rem 0.85rem',
              borderRadius: '100px',
              marginBottom: '0.75rem'
            }}
          >
            <Shield size={13} /> AUTHENTICATION REQUIRED
          </span>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Sign In to Access {pageName}
          </h1>

          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', maxWidth: '520px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
            This workspace contains private financial custody, active contracts, and sensitive communications. Please log in or create your verified Refeir account.
          </p>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div style={{ maxWidth: '420px', margin: '0 auto 2rem' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '4px',
              borderRadius: 'var(--rf-radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.75rem'
            }}
          >
            <button
              onClick={() => setActiveTab('LOGIN')}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: 'var(--rf-radius-sm)',
                border: 'none',
                background: activeTab === 'LOGIN' ? 'var(--rf-leaf-green)' : 'transparent',
                color: activeTab === 'LOGIN' ? '#081C10' : 'var(--rf-slate-400)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('SIGNUP')}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: 'var(--rf-radius-sm)',
                border: 'none',
                background: activeTab === 'SIGNUP' ? 'var(--rf-leaf-green)' : 'transparent',
                color: activeTab === 'SIGNUP' ? '#081C10' : 'var(--rf-slate-400)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {activeTab === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Email Address</label>
                <input
                  type="email"
                  className="rf-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Password</label>
                <input
                  type="password"
                  className="rf-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn-primary rf-btn-lg"
                style={{ width: '100%', marginTop: '0.5rem', fontWeight: 800 }}
              >
                <LogIn size={16} />
                <span>Log In & Continue</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Full Name</label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="Amara Okafor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Email Address</label>
                <input
                  type="email"
                  className="rf-input"
                  placeholder="amara@refeir.africa"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Primary Account Role</label>
                <select
                  className="rf-select"
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                >
                  <option value="SCOUT">Scout (Refer talent & earn 10% lifetime rewards)</option>
                  <option value="TALENT">Talent (Offer services & work on projects)</option>
                  <option value="CLIENT">Client (Hire talent & post jobs)</option>
                </select>
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Global Location / Country</label>
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
                <label className="rf-label">Phone Number & Country Code</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    className="rf-select"
                    style={{ width: '135px', flexShrink: 0, padding: '0.65rem 0.5rem', fontSize: '0.8125rem' }}
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
                    style={{ flex: 1 }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn-primary rf-btn-lg"
                style={{ width: '100%', marginTop: '0.5rem', fontWeight: 800 }}
              >
                <UserPlus size={16} />
                <span>Create Verified Account</span>
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => onNavigate('/marketplace')}
            style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', fontSize: '0.84rem', cursor: 'pointer' }}
          >
            ← Back to Public Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
