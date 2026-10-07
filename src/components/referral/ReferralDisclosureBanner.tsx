import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
      className={`rf-referral-disclosure-banner ${className}`}
      style={{
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
