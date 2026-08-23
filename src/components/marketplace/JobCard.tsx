import React from 'react';
import { Job } from '../../types';
import { CountryFlag } from '../common/CountryFlag';
import { formatMoney } from '../../data/currencies';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Briefcase, Clock, Users, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onApply }) => {
  const { getClientScorecard } = useMarketplace();
  const scorecard = getClientScorecard(job.client_id, job.client_name);

  return (
    <div className="rf-card rf-card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="rf-badge rf-badge-blue">{job.category}</span>
          <span className="rf-badge rf-badge-neutral">{job.country_preference}</span>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              background: 'rgba(102, 187, 42, 0.12)',
              border: '1px solid rgba(102, 187, 42, 0.3)',
              color: '#66BB2A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <ShieldCheck size={11} />
            <span>5% + 5% Proposal Fee</span>
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>
            Budget
          </span>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
            {formatMoney(job.budget)}
          </div>
        </div>
      </div>

      <h3
        onClick={() => onSelect(job)}
        style={{
          fontSize: '1.0625rem',
          fontWeight: 800,
          color: 'var(--rf-cream)',
          lineHeight: 1.4,
          marginBottom: '0.5rem',
          cursor: 'pointer'
        }}
      >
        {job.title}
      </h3>

      {/* Client Reputation Trust Snippet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--rf-slate-300)', fontWeight: 600 }}>{job.client_name}</span>
        <span style={{ color: 'var(--rf-slate-500)' }}>•</span>
        <span style={{ color: '#F4B942', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
          <Star size={12} fill="#F4B942" /> {scorecard.overall_rating}
        </span>
        <span style={{ color: 'var(--rf-slate-500)' }}>•</span>
        <span style={{ color: '#66BB2A', fontWeight: 700 }}>
          ⚡ {scorecard.pays_on_time_percentage}% On-Time Payer
        </span>
      </div>

      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--rf-slate-300)',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {job.description}
      </p>

      {/* Skills pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
        {job.skills.map(s => (
          <span
            key={s}
            style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--rf-radius-sm)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--rf-slate-300)'
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Footer Info */}
      <div
        style={{
          borderTop: '1px solid var(--rf-navy-border)',
          paddingTop: '0.875rem',
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8125rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--rf-slate-400)' }}>
          <CountryFlag countryIsoOrName={job.client_country} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Users size={14} /> {job.proposals_count} proposals
          </span>
        </div>

        <button
          onClick={() => onSelect(job)}
          className="rf-btn rf-btn-secondary rf-btn-sm"
          style={{ gap: '0.375rem' }}
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
