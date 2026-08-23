import React from 'react';
import { getCountryByIso } from '../../data/countries';
import { MapPin } from 'lucide-react';

interface CountryFlagProps {
  countryIsoOrName: string;
  showName?: boolean;
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryIsoOrName,
  showName = true,
  className = ''
}) => {
  const country = getCountryByIso(countryIsoOrName) || {
    name: countryIsoOrName
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <MapPin size={13} className="rf-country-flag-icon" style={{ flexShrink: 0, color: 'var(--rf-leaf-green)', transition: 'color 0.25s ease' }} />
      {showName && <span className="rf-country-flag-name" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)', transition: 'color 0.25s ease' }}>{country.name}</span>}
    </span>
  );
};
