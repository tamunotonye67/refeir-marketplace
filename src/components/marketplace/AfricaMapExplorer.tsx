import React, { useState } from 'react';
import { AFRICAN_COUNTRIES, REGIONS } from '../../data/countries';
import { AfricanRegion, Country } from '../../types';
import { CountryFlag } from '../common/CountryFlag';
import { MapPin, Users, Briefcase, Sparkles, ArrowRight, Layers } from 'lucide-react';

interface AfricaMapExplorerProps {
  onSelectCountry: (countryId: string) => void;
  onSelectRegion: (region: AfricanRegion) => void;
}

export const AfricaMapExplorer: React.FC<AfricaMapExplorerProps> = ({
  onSelectCountry,
  onSelectRegion
}) => {
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion>('West Africa');

  const regionData: Record<AfricanRegion, { color: string; talentCount: number; projectCount: number; keyHubs: string[] }> = {
    'West Africa': { color: '#2E7D32', talentCount: 1840, projectCount: 420, keyHubs: ['Lagos', 'Accra', 'Dakar', 'Abidjan'] },
    'East Africa': { color: '#66BB2A', talentCount: 1420, projectCount: 380, keyHubs: ['Nairobi', 'Kigali', 'Dar es Salaam', 'Kampala'] },
    'Southern Africa': { color: '#4CAF50', talentCount: 1650, projectCount: 390, keyHubs: ['Johannesburg', 'Cape Town', 'Gaborone', 'Lusaka'] },
    'North Africa': { color: '#F6B21A', talentCount: 1290, projectCount: 310, keyHubs: ['Cairo', 'Casablanca', 'Tunis', 'Algiers'] },
    'Central Africa': { color: '#F47C20', talentCount: 780, projectCount: 160, keyHubs: ['Douala', 'Kinshasa', 'Yaoundé', 'Libreville'] }
  };

  const countriesInRegion = AFRICAN_COUNTRIES.filter(c => c.region === selectedRegion);

  return (
    <div
      style={{
        background: 'var(--rf-navy-surface)',
        border: '1px solid var(--rf-navy-border)',
        borderRadius: 'var(--rf-radius-xl)',
        padding: '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.3)', padding: '0.25rem 0.625rem', borderRadius: 'var(--rf-radius-full)', marginBottom: '0.5rem' }}>
            <MapPin size={13} color="var(--rf-leaf-green)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-leaf-green)', textTransform: 'uppercase' }}>
              Pan-African Marketplace Grid
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            Explore Africa by Region & Country
          </h2>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Discover top-tier engineering, creative, and business talent across 54 sovereign nations.
          </p>
        </div>

        {/* Region Selector Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {REGIONS.map(reg => {
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--rf-radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  transition: 'all 0.15s ease',
                  background: isSelected ? 'var(--rf-leaf-green)' : 'var(--rf-bg-surface-hover)',
                  color: isSelected ? '#FFFFFF' : 'var(--rf-cream)',
                  border: isSelected ? '1px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)'
                }}
              >
                {reg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Regional Overview Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          background: 'var(--rf-bg-surface-hover)',
          border: '1px solid var(--rf-bg-card-border)',
          borderRadius: 'var(--rf-radius-lg)',
          padding: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Region
          </span>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: regionData[selectedRegion].color }} />
            {selectedRegion}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
            Verified Professionals
          </span>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-mint)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Users size={16} />
            {regionData[selectedRegion].talentCount.toLocaleString()}+ Talent
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
            Protected Projects
          </span>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#7DA2FF', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Briefcase size={16} />
            {regionData[selectedRegion].projectCount} Active
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
            Key Metropolises
          </span>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--rf-cream)', marginTop: '2px' }}>
            {regionData[selectedRegion].keyHubs.join(' • ')}
          </div>
        </div>
      </div>

      {/* Country Cards in Selected Region */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {countriesInRegion.map(country => {
          const isOperational = country.status === 'FULLY_OPERATIONAL';
          const isPayments = country.status === 'PAYMENTS_ENABLED';

          return (
            <div
              key={country.id}
              onClick={() => onSelectCountry(country.id)}
              className="rf-region-country-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CountryFlag countryIsoOrName={country.name} />
                <span
                  className={`rf-country-status-badge rf-badge rf-text-xs ${
                    isOperational
                      ? 'rf-badge-mint'
                      : isPayments
                      ? 'rf-badge-blue'
                      : 'rf-badge-neutral'
                  }`}
                  style={{ fontSize: '0.625rem', padding: '0.18rem 0.45rem', borderRadius: '9999px', transition: 'all 0.25s ease' }}
                >
                  {isOperational ? 'Fully Active' : isPayments ? 'Payments On' : 'Marketplace'}
                </span>
              </div>

              <div className="rf-country-info-row">
                <span>Currency: {country.currency_code} ({country.currency_symbol})</span>
                <span>{country.timezone.split('/')[1]?.replace('_', ' ') || 'Local'}</span>
              </div>

              <div className="rf-country-cities-row">
                Cities: {country.popular_cities.slice(0, 2).join(', ')}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => onSelectRegion(selectedRegion)}
          className="rf-btn rf-btn-secondary"
          style={{ gap: '0.5rem' }}
        >
          <span>View All {selectedRegion} Talent & Services</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
