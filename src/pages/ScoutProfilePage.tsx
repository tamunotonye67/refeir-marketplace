import React, { useState } from 'react';
import { ScoutProfile, TalentProfile } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { TalentCard } from '../components/marketplace/TalentCard';
import { ReferModal } from '../components/referral/ReferModal';
import { formatMoney } from '../data/currencies';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Globe2,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ScoutProfilePageProps {
  scout: ScoutProfile;
  onBack: () => void;
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
}

export const ScoutProfilePage: React.FC<ScoutProfilePageProps> = ({
  scout,
  onBack,
  onNavigate,
  onSelectTalent
}) => {
  const { talentList } = useMarketplace();
  const [selectedTalentForRefer, setSelectedTalentForRefer] = useState<TalentProfile | null>(null);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Elite Scout':
        return 'var(--rf-mint)';
      case 'Professional Scout':
        return 'var(--rf-blue)';
      case 'Verified Scout':
        return '#7DA2FF';
      default:
        return 'var(--rf-slate-300)';
    }
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <button
        onClick={onBack}
        className="rf-btn rf-btn-ghost rf-btn-sm"
        style={{ gap: '0.375rem', marginBottom: '1.5rem', color: 'var(--rf-slate-400)' }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Scout Header Hero Card */}
      <div
        className="rf-card rf-card-glow"
        style={{
          padding: '2.5rem',
          display: 'flex',
          gap: '2rem',
          marginBottom: '2.5rem',
          background: 'var(--rf-navy-surface)',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <img
          src={scout.avatar_url}
          alt={scout.full_name}
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--rf-mint)'
          }}
        />

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              {scout.full_name}
            </h1>
            <span
              className="rf-badge rf-text-xs"
              style={{
                background: 'rgba(54, 224, 160, 0.15)',
                color: getTierColor(scout.tier),
                border: '1px solid rgba(54, 224, 160, 0.3)'
              }}
            >
              <Award size={13} style={{ marginRight: '3px' }} />
              {scout.tier}
            </span>
          </div>

          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--rf-slate-300)', marginBottom: '0.75rem' }}>
            {scout.headline}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }}>
            <CountryFlag countryIsoOrName={scout.country_name} />
            <span>• 99.8% Dispute-Free Track Record</span>
            <span>• {scout.client_satisfaction}/5.0 Satisfaction</span>
          </div>
        </div>

        {/* Scout Impact Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            background: 'var(--rf-navy-card)',
            border: '1px solid var(--rf-navy-border)',
            borderRadius: 'var(--rf-radius-lg)',
            padding: '1.25rem',
            minWidth: '280px'
          }}
        >
          <div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Successful Referrals
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
              {scout.successful_referrals}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Projects Generated
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '2px' }}>
              {formatMoney(scout.projects_generated_value)}
            </div>
          </div>

          {scout.is_public_earnings && (
            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--rf-navy-border)', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Total Verified Scout Commissions
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7DA2FF' }}>
                {formatMoney(scout.total_earned)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Countries Referred by Scout (Section 21) */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
          Pan-African Network Footprint
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {scout.countries_referred.map((c: string) => (
            <div
              key={c}
              style={{
                background: 'var(--rf-navy-surface)',
                border: '1px solid var(--rf-navy-border)',
                borderRadius: 'var(--rf-radius-md)',
                padding: '0.625rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CountryFlag countryIsoOrName={c} />
            </div>
          ))}
        </div>
      </div>

      {/* Scout's Recommended Talent Roster */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Talent Recommended by {scout.full_name.split(' ')[0]}
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem' }}>
              Vetted professionals in this Scout's active referral portfolio.
            </p>
          </div>
        </div>

        <div className="rf-grid-cards">
          {talentList.slice(0, 3).map(talent => (
            <TalentCard
              key={talent.id}
              talent={talent}
              onSelect={onSelectTalent}
              onRefer={t => setSelectedTalentForRefer(t)}
            />
          ))}
        </div>
      </div>

      {/* Refer Modal */}
      {selectedTalentForRefer && (
        <ReferModal
          talent={selectedTalentForRefer}
          onClose={() => setSelectedTalentForRefer(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
