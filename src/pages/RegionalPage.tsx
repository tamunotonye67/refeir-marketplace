import React, { useState } from 'react';
import { AfricanRegion, TalentProfile, Service } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { AFRICAN_COUNTRIES } from '../data/countries';
import { TalentCard } from '../components/marketplace/TalentCard';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { ReferModal } from '../components/referral/ReferModal';
import { CountryFlag } from '../components/common/CountryFlag';
import { ArrowLeft, MapPin, Users, Briefcase, Globe2 } from 'lucide-react';

interface RegionalPageProps {
  regionSlug: string;
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
  onSelectService: (service: Service) => void;
}

export const RegionalPage: React.FC<RegionalPageProps> = ({
  regionSlug,
  onNavigate,
  onSelectTalent,
  onSelectService
}) => {
  const { talentList, servicesList } = useMarketplace();

  const [selectedTalentForRefer, setSelectedTalentForRefer] = useState<TalentProfile | null>(null);
  const [selectedServiceForRefer, setSelectedServiceForRefer] = useState<Service | null>(null);

  // Convert slug to formal region name (e.g. "west-africa" -> "West Africa")
  const regionName = regionSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') as AfricanRegion;

  const countriesInRegion = AFRICAN_COUNTRIES.filter(c => c.region.toLowerCase() === regionName.toLowerCase());

  const regionalTalent = talentList
    .filter(t => {
      const country = AFRICAN_COUNTRIES.find(c => c.name.toLowerCase() === t.country_name.toLowerCase());
      return country && country.region.toLowerCase() === regionName.toLowerCase();
    })
    .sort((a, b) => {
      const aPro = (a.is_pro || a.is_featured) ? 1 : 0;
      const bPro = (b.is_pro || b.is_featured) ? 1 : 0;
      if (bPro !== aPro) return bPro - aPro;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.completed_projects - a.completed_projects;
    });

  const regionalServices = servicesList
    .filter(s => {
      const country = AFRICAN_COUNTRIES.find(c => c.name.toLowerCase() === s.talent_country.toLowerCase());
      return country && country.region.toLowerCase() === regionName.toLowerCase();
    })
    .sort((a, b) => {
      const aTalent = talentList.find(t => t.id === a.talent_id || t.full_name === a.talent_name);
      const bTalent = talentList.find(t => t.id === b.talent_id || t.full_name === b.talent_name);
      const aPro = (aTalent?.is_pro || aTalent?.is_featured) ? 1 : 0;
      const bPro = (bTalent?.is_pro || bTalent?.is_featured) ? 1 : 0;
      if (bPro !== aPro) return bPro - aPro;
      return b.talent_rating - a.talent_rating;
    });

  return (
    <div className="rf-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <button
        onClick={() => onNavigate('/marketplace')}
        className="rf-btn rf-btn-ghost rf-btn-sm"
        style={{ gap: '0.375rem', marginBottom: '1.5rem', color: 'var(--rf-slate-400)' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </button>

      {/* Regional Hero */}
      <div
        className="rf-card"
        style={{
          padding: '2.5rem',
          background: 'var(--rf-navy-surface)',
          border: '1px solid var(--rf-navy-border)',
          borderRadius: 'var(--rf-radius-xl)',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-blue)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <MapPin size={14} />
          <span>REGIONAL MARKETPLACE HUB</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          {regionName} Talent & Services
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '640px' }}>
          Explore professional networks, verified talent, and protected engagements across {countriesInRegion.length} sovereign countries in {regionName}.
        </p>

        {/* Country Pills in this region */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
          {countriesInRegion.map(c => (
            <button
              key={c.id}
              onClick={() => onNavigate(`/countries/${c.id}`)}
              className="rf-btn rf-btn-secondary rf-btn-sm"
              style={{ gap: '0.375rem' }}
            >
              <MapPin size={13} color="var(--rf-leaf-green)" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Regional Talent Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
          Professionals in {regionName} ({regionalTalent.length})
        </h2>

        {regionalTalent.length > 0 ? (
          <div className="rf-grid-cards">
            {regionalTalent.map(talent => (
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
              No talent profiles listed in this region yet.
            </p>
          </div>
        )}
      </div>

      {/* Regional Services */}
      {regionalServices.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
            Popular Services from {regionName}
          </h2>
          <div className="rf-grid-cards">
            {regionalServices.map(srv => (
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
};
