import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface ReferralDisclosureBannerProps {
  scoutName: string;
  className?: string;
}

export const ReferralDisclosureBanner: React.FC<ReferralDisclosureBannerProps> = ({
  scoutName,
  className = ''
}) => {
  return (
    <div
      className={`rf-disclosure-banner ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(15, 46, 30, 0.95) 0%, rgba(18, 51, 33, 0.95) 100%)',
        borderLeft: '4px solid var(--rf-leaf-green)',
        borderRadius: '0 var(--rf-radius-md) var(--rf-radius-md) 0',
        borderTop: '1px solid var(--rf-bg-card-border)',
        borderRight: '1px solid var(--rf-bg-card-border)',
        borderBottom: '1px solid var(--rf-bg-card-border)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        marginBottom: '1.5rem'
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'rgba(102, 187, 42, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <ShieldCheck size={20} color="var(--rf-leaf-green)" />
      </div>
      <div style={{ flex: 1, fontSize: '0.875rem', color: 'var(--rf-cream)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--rf-cream)' }}>Recommended through Refeir Scout {scoutName}.</strong> The Scout may receive an agreed referral reward from the talent if you hire this professional and the project is successfully completed.
      </div>
    </div>
  );
};
