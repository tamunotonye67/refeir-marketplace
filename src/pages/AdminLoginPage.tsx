import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, KeyRound, Eye, EyeOff, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';
import { RefeirLogo } from '../components/common/RefeirLogo';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@refeir.africa',
  password: 'Refeir@Admin2026',
};

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofilled, setAutofilled] = useState(false);

  // If already logged in as admin, redirect
  React.useEffect(() => {
    if (currentUser?.active_role === 'ADMIN') {
      onNavigate('/admin');
    }
  }, [currentUser]);

  const handleAutofill = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setAutofilled(true);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        login(ADMIN_CREDENTIALS.email);
        onNavigate('/admin');
      } else {
        setError('Invalid admin credentials. Check your email and password.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--rf-bg-deep)',
        padding: '2rem',
      }}
    >
      {/* Background subtle grid */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--rf-leaf-green) 1px, transparent 1px), linear-gradient(90deg, var(--rf-leaf-green) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <RefeirLogo size="lg" isLight showTagline={false} />
        </div>

        {/* Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(10,26,18,0.97), rgba(7,20,12,0.99))',
            border: '1px solid rgba(102,187,42,0.35)',
            borderRadius: 'var(--rf-radius-xl)',
            padding: '2.5rem',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(102,187,42,0.1)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(102,187,42,0.12)',
                border: '1px solid rgba(102,187,42,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <Shield size={28} color="var(--rf-leaf-green)" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)' }}>
              Restricted access — Pan-African Governance Console
            </p>
          </div>

          {/* Quick-fill hint */}
          <div
            style={{
              background: 'rgba(125,162,255,0.06)',
              border: '1px solid rgba(125,162,255,0.2)',
              borderRadius: 'var(--rf-radius-md)',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
            }}
          >
            <KeyRound size={15} color="#7DA2FF" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7DA2FF', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Demo Credentials
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', fontFamily: 'var(--rf-font-mono)', lineHeight: 1.6 }}>
                Email: admin@refeir.africa<br />
                Password: Refeir@Admin2026
              </div>
              <button
                type="button"
                onClick={handleAutofill}
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#7DA2FF',
                  background: 'rgba(125,162,255,0.1)',
                  border: '1px solid rgba(125,162,255,0.25)',
                  borderRadius: '100px',
                  padding: '0.2rem 0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {autofilled ? <CheckCircle2 size={12} color="#66bb2a" /> : <Lock size={12} />}
                {autofilled ? 'Credentials filled!' : 'Auto-fill credentials'}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div className="rf-form-group">
              <label className="rf-label">Admin Email</label>
              <input
                className="rf-input"
                type="email"
                placeholder="admin@refeir.africa"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
                autoComplete="email"
              />
            </div>

            <div className="rf-form-group">
              <label className="rf-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="rf-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rf-slate-400)', padding: '0.25rem',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)',
                borderRadius: 'var(--rf-radius-md)', padding: '0.75rem 1rem',
                fontSize: '0.8125rem', color: '#FF6B6B',
              }}>
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{ marginTop: '0.5rem', gap: '0.5rem', position: 'relative' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Access Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--rf-navy-border)', textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('/')}
              style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Return to Refeir Homepage
            </button>
          </div>
        </div>

        {/* Security notice */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--rf-slate-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
          <Lock size={12} />
          <span>This portal is monitored and all access is logged in the immutable audit trail.</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
