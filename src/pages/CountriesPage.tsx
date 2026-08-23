import React, { useState } from 'react';
import { AFRICAN_COUNTRIES, REGIONS } from '../data/countries';
import { useMarketplace } from '../context/MarketplaceContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { TalentCard } from '../components/marketplace/TalentCard';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { JobCard } from '../components/marketplace/JobCard';
import { ReferModal } from '../components/referral/ReferModal';
import { Country, TalentProfile, Service, Job } from '../types';
import {
  Globe2,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  MapPin
} from 'lucide-react';

interface CountriesPageProps {
  countryId?: string;
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
  onSelectService: (service: Service) => void;
}

export const CountriesPage: React.FC<CountriesPageProps> = ({
  countryId,
  onNavigate,
  onSelectTalent,
  onSelectService
}) => {
  const { talentList, servicesList, jobsList } = useMarketplace();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const [selectedTalentForRefer, setSelectedTalentForRefer] = useState<TalentProfile | null>(null);
  const [selectedServiceForRefer, setSelectedServiceForRefer] = useState<Service | null>(null);

  // If a specific country is chosen
  const activeCountry = countryId
    ? AFRICAN_COUNTRIES.find(c => c.id === countryId.toLowerCase() || c.iso_code.toLowerCase() === countryId.toLowerCase())
    : null;

  const filteredCountries = AFRICAN_COUNTRIES.filter(c => {
    if (selectedRegion !== 'ALL' && c.region !== selectedRegion) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.iso_code.toLowerCase().includes(q) ||
        c.currency_code.toLowerCase().includes(q) ||
        c.popular_cities.some(city => city.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const countryTalent = activeCountry
    ? talentList
        .filter(t => t.country_name.toLowerCase() === activeCountry.name.toLowerCase() || t.country_id === activeCountry.id)
        .sort((a, b) => {
          const aPro = (a.is_pro || a.is_featured) ? 1 : 0;
          const bPro = (b.is_pro || b.is_featured) ? 1 : 0;
          if (bPro !== aPro) return bPro - aPro;
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.completed_projects - a.completed_projects;
        })
    : [];

  const countryServices = activeCountry
    ? servicesList
        .filter(s => s.talent_country.toLowerCase() === activeCountry.name.toLowerCase())
        .sort((a, b) => {
          const aTalent = talentList.find(t => t.id === a.talent_id || t.full_name === a.talent_name);
          const bTalent = talentList.find(t => t.id === b.talent_id || t.full_name === b.talent_name);
          const aPro = (aTalent?.is_pro || aTalent?.is_featured) ? 1 : 0;
          const bPro = (bTalent?.is_pro || bTalent?.is_featured) ? 1 : 0;
          if (bPro !== aPro) return bPro - aPro;
          return b.talent_rating - a.talent_rating;
        })
    : [];

  const countryJobs = activeCountry
    ? jobsList.filter(j => j.client_country.toLowerCase() === activeCountry.name.toLowerCase() || j.country_preference === 'Africa-wide')
    : [];

  // Individual Country Hub View (Section 27 & 28)
  if (activeCountry) {
    return (
      <div className="rf-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <button
          onClick={() => onNavigate('/countries')}
          className="rf-btn rf-btn-ghost rf-btn-sm"
          style={{ gap: '0.375rem', marginBottom: '1.5rem', color: 'var(--rf-slate-400)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Countries</span>
        </button>

        {/* Country Header Card */}
        <div
          className="rf-card"
          style={{
            padding: '2.5rem',
            background: 'var(--rf-navy-surface)',
            border: '1px solid var(--rf-navy-border)',
            borderRadius: 'var(--rf-radius-xl)',
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} color="var(--rf-leaf-green)" />
              </div>
              <div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
                  {activeCountry.name}
                </h1>
                <span className="rf-badge rf-badge-blue rf-text-xs">
                  {activeCountry.region}
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', maxWidth: '580px', marginTop: '0.5rem' }}>
              Discover verified {activeCountry.name} talent, explore popular services, and connect your professional network with full payment protection.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '1.25rem' }}>
              <span>Dial Code: <strong style={{ color: 'var(--rf-cream)' }}>{activeCountry.country_code}</strong></span>
              <span>Currency: <strong style={{ color: 'var(--rf-mint)' }}>{activeCountry.currency_code} ({activeCountry.currency_symbol})</strong></span>
              <span>Timezone: <strong style={{ color: 'var(--rf-cream)' }}>{activeCountry.timezone}</strong></span>
              <span>Key Hubs: <strong style={{ color: 'var(--rf-cream)' }}>{activeCountry.popular_cities.join(', ')}</strong></span>
            </div>
          </div>

          <div
            style={{
              background: 'var(--rf-navy-card)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.25rem',
              minWidth: '240px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', marginBottom: '0.5rem' }}>
              Operational Capabilities
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: activeCountry.payment_availability ? 'var(--rf-mint)' : 'var(--rf-slate-500)' }}>
                <CheckCircle2 size={15} />
                <span>Protected Payments {activeCountry.payment_availability ? 'Active' : 'Coming Soon'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: activeCountry.payout_availability ? 'var(--rf-mint)' : 'var(--rf-slate-500)' }}>
                <CheckCircle2 size={15} />
                <span>Direct Payouts {activeCountry.payout_availability ? 'Active' : 'In Enablement'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: activeCountry.verification_availability ? 'var(--rf-mint)' : 'var(--rf-slate-500)' }}>
                <CheckCircle2 size={15} />
                <span>Identity & KYC {activeCountry.verification_availability ? 'Supported' : 'Manual Review'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Talent in this country */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Top Professionals in {activeCountry.name} ({countryTalent.length})
            </h2>
          </div>

          {countryTalent.length > 0 ? (
            <div className="rf-grid-cards">
              {countryTalent.map(talent => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  onSelect={onSelectTalent}
                  onRefer={t => setSelectedTalentForRefer(t)}
                />
              ))}
            </div>
          ) : (
            <div className="rf-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--rf-slate-300)' }}>
                No registered talent in {activeCountry.name} yet. Be the first to offer skills or refer a professional!
              </p>
            </div>
          )}
        </div>

        {/* Services in this country */}
        {countryServices.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
              Featured Services from {activeCountry.name}
            </h2>
            <div className="rf-grid-cards">
              {countryServices.map(srv => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  onSelect={onSelectService}
                  onRefer={s => {
                    setSelectedServiceForRefer(s);
                    const t = talentList.find(item => item.id === s.talent_id);
                    if (t) setSelectedTalentForRefer(t);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Refer Modal */}
        {selectedTalentForRefer && (
          <ReferModal
            talent={selectedTalentForRefer}
            service={selectedServiceForRefer || undefined}
            onClose={() => {
              setSelectedTalentForRefer(null);
              setSelectedServiceForRefer(null);
            }}
            onNavigate={onNavigate}
          />
        )}
      </div>
    );
  }

  // All 54 African Countries Directory (Section 27)
  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          <Globe2 size={14} />
          <span>AFRICA-WIDE ARCHITECTURE</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
          Discover All 54 Sovereign African Countries
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Explore talent density, local currencies, timezones, and marketplace availability across the continent.
        </p>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: 'var(--rf-navy-surface)',
          border: '1px solid var(--rf-navy-border)',
          borderRadius: 'var(--rf-radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
          <input
            type="text"
            className="rf-input"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search country, ISO code, or city..."
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          <button
            onClick={() => setSelectedRegion('ALL')}
            className={`rf-btn rf-btn-sm ${selectedRegion === 'ALL' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
          >
            All Africa ({AFRICAN_COUNTRIES.length})
          </button>
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`rf-btn rf-btn-sm ${selectedRegion === r ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 54 Country Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {filteredCountries.map(country => (
          <div
            key={country.id}
            onClick={() => onNavigate(`/countries/${country.id}`)}
            className="rf-card rf-card-interactive"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} color="var(--rf-leaf-green)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    {country.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                    {country.region}
                  </span>
                </div>
              </div>
              <span className={`rf-badge rf-text-xs ${
                country.status === 'FULLY_OPERATIONAL' ? 'rf-badge-mint' : country.status === 'PAYMENTS_ENABLED' ? 'rf-badge-blue' : 'rf-badge-neutral'
              }`} style={{ fontSize: '0.625rem' }}>
                {country.status === 'FULLY_OPERATIONAL' ? 'Active' : country.status === 'PAYMENTS_ENABLED' ? 'Payments' : 'Marketplace'}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem' }}>
              <strong>Currency:</strong> {country.currency_code} ({country.currency_symbol})
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
              Cities: {country.popular_cities.slice(0, 3).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
