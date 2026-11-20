import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SocialAuthProvider } from '../../context/AuthContext';

export interface SocialProviderMeta {
  id: SocialAuthProvider;
  label: string;
  shortLabel: string;
  brandColor: string;
  icon: React.ReactNode;
}

export const SOCIAL_AUTH_PROVIDERS: SocialProviderMeta[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    shortLabel: 'Google',
    brandColor: '#4285F4',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.24 1.26-.96 2.33-2.04 3.04l3.3 2.56c1.92-1.77 3.04-4.38 3.04-7.5 0-.72-.06-1.42-.2-2H12z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.75 0 5.06-.9 6.75-2.45l-3.3-2.56c-.91.61-2.08.98-3.45.98-2.65 0-4.9-1.79-5.7-4.2l-3.4 2.62C4.6 19.78 8.03 22 12 22z"
        />
        <path
          fill="#FBBC05"
          d="M6.3 13.77c-.2-.6-.32-1.25-.32-1.92s.12-1.32.32-1.92L2.9 7.31C2.2 8.7 1.8 10.25 1.8 11.85s.4 3.15 1.1 4.54l3.4-2.62z"
        />
        <path
          fill="#4285F4"
          d="M12 5.73c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.05 2.69 14.75 1.7 12 1.7 8.03 1.7 4.6 3.92 2.9 7.31l3.4 2.62c.8-2.41 3.05-4.2 5.7-4.2z"
        />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'Continue with GitHub',
    shortLabel: 'GitHub',
    brandColor: '#24292F',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'Continue with LinkedIn',
    shortLabel: 'LinkedIn',
    brandColor: '#0A66C2',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#0A66C2"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    shortLabel: 'Facebook',
    brandColor: '#1877F2',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
        />
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'Continue with X (Twitter)',
    shortLabel: 'X',
    brandColor: '#0F1419',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

interface SocialAuthButtonsProps {
  onSelectProvider: (provider: SocialAuthProvider) => Promise<void> | void;
  mode?: 'LOGIN' | 'SIGNUP';
  compact?: boolean;
  dividerText?: string;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSelectProvider,
  mode = 'LOGIN',
  compact = false,
  dividerText = 'or continue with email',
}) => {
  const [loadingProvider, setLoadingProvider] = useState<SocialAuthProvider | null>(null);

  const handleClick = async (provider: SocialAuthProvider) => {
    if (loadingProvider) return;
    setLoadingProvider(provider);
    try {
      await onSelectProvider(provider);
    } finally {
      setLoadingProvider(null);
    }
  };

  const primaryProviders = SOCIAL_AUTH_PROVIDERS.slice(0, 2); // Google & GitHub
  const secondaryProviders = SOCIAL_AUTH_PROVIDERS.slice(2); // LinkedIn, Facebook, Pinterest

  return (
    <div className="rf-social-auth-wrap">
      {/* Top 2 Primary Full/Half Buttons (Google & GitHub) */}
      <div className={`rf-social-primary-grid${compact ? ' is-compact' : ''}`}>
        {primaryProviders.map(p => {
          const isBusy = loadingProvider === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleClick(p.id)}
              disabled={Boolean(loadingProvider)}
              className="rf-social-auth-btn is-primary"
              aria-label={`${mode === 'SIGNUP' ? 'Sign up' : 'Sign in'} with ${p.shortLabel}`}
            >
              <span className="rf-social-auth-icon">
                {isBusy ? <Loader2 size={17} className="rf-spin" /> : p.icon}
              </span>
              <span className="rf-social-auth-label">{p.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary 3-column row: LinkedIn, Facebook, Pinterest */}
      <div className="rf-social-secondary-grid">
        {secondaryProviders.map(p => {
          const isBusy = loadingProvider === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleClick(p.id)}
              disabled={Boolean(loadingProvider)}
              className="rf-social-auth-btn is-secondary"
              aria-label={`${mode === 'SIGNUP' ? 'Sign up' : 'Sign in'} with ${p.shortLabel}`}
              title={p.label}
            >
              <span className="rf-social-auth-icon">
                {isBusy ? <Loader2 size={16} className="rf-spin" /> : p.icon}
              </span>
              <span className="rf-social-auth-label">{p.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="rf-auth-divider">
        <span>{dividerText}</span>
      </div>
    </div>
  );
};
