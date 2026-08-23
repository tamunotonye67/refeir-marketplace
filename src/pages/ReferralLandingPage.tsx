import React, { useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ReferralDisclosureBanner } from '../components/referral/ReferralDisclosureBanner';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import { TalentProfile, Service } from '../types';
import {
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Lock,
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface ReferralLandingPageProps {
  referralCode: string;
  onNavigate: (path: string) => void;
  onHire: (talent: TalentProfile, service?: Service, referral?: any) => void;
}

export const ReferralLandingPage: React.FC<ReferralLandingPageProps> = ({
  referralCode,
  onNavigate,
  onHire
}) => {
  const { getReferralByCode, trackReferralClick, talentList, servicesList } = useMarketplace();

  const referral = getReferralByCode(referralCode);

  useEffect(() => {
    if (referral) {
      trackReferralClick(referral.referral_code);
    }
  }, [referralCode]);

  const talent = referral
    ? talentList.find(t => t.id === referral.talent_id) || talentList[0]
    : talentList[0];

  const service = referral?.service_id
    ? servicesList.find(s => s.id === referral.service_id)
    : undefined;

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '840px' }}>
      {/* Mandatory Transparent Referral Disclosure Banner (Section 18) */}
      <ReferralDisclosureBanner
        scoutName={referral ? referral.scout_name : 'Verified Scout'}
      />

      {/* Main Recommended Offer Card */}
      <div
        className="rf-card rf-card-glow"
        style={{
          padding: '2.5rem',
          background: 'var(--rf-navy-surface)',
          border: '1px solid rgba(54, 224, 160, 0.3)',
          marginBottom: '2rem'
        }}
      >
        {/* Top Scout Recommendation Stamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          <Sparkles size={16} />
          <span>EXCLUSIVE SCOUT INTRODUCTION • REFERRAL ID: {referral ? referral.referral_code : referralCode}</span>
        </div>

        {/* Talent Bio & Profile Header */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          <img
            src={talent.avatar_url}
            alt={talent.full_name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--rf-mint)'
            }}
          />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                {talent.full_name}
              </h1>
              <CheckCircle2 size={18} color="var(--rf-mint)" />
            </div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--rf-mint)', marginTop: '2px' }}>
              {talent.headline}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '4px' }}>
              <CountryFlag countryIsoOrName={talent.country_name} />
              <span>• ★ {talent.rating} ({talent.reviews_count} reviews)</span>
              <span>• {talent.completed_projects} projects completed</span>
            </div>
          </div>
        </div>

        {/* Recommended Service Details (if specific service was referred) */}
        {service ? (
          <div
            style={{
              background: 'var(--rf-navy-card)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.5rem',
              marginBottom: '1.75rem'
            }}
          >
            <span className="rf-badge rf-badge-blue rf-text-xs" style={{ marginBottom: '0.5rem' }}>
              Recommended Deliverable
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
              {service.title}
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              {service.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--rf-navy-border)', paddingTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Locked Price
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  {formatMoney(service.price)}
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                {service.delivery_days} days delivery • {service.revisions} revisions
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: 'var(--rf-navy-card)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.5rem',
              marginBottom: '1.75rem'
            }}
          >
            <p style={{ color: 'var(--rf-cream)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {talent.bio}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {talent.skills.map(s => (
                <span key={s} className="rf-badge rf-badge-neutral">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* CTAs: Hire with Payment Protection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => onHire(talent, service, referral)}
            className="rf-btn rf-btn-mint rf-btn-lg rf-w-full"
            style={{ gap: '0.5rem' }}
          >
            <ShieldCheck size={18} />
            <span>Hire {talent.full_name.split(' ')[0]} with Payment Protection</span>
          </button>
        </div>

        {/* Protection Note */}
        <div
          style={{
            borderTop: '1px solid var(--rf-navy-border)',
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8125rem',
            color: 'var(--rf-slate-400)'
          }}
        >
          <Lock size={16} color="var(--rf-mint)" />
          <span>
            <strong>Refeir Project Protection:</strong> Funds are held safely and only released when you approve completed milestones.
          </span>
        </div>
      </div>
    </div>
  );
};
