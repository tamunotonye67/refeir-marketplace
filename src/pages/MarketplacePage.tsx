import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { TalentCard } from '../components/marketplace/TalentCard';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { ReferModal } from '../components/referral/ReferModal';
import { TalentProfile, Service, AfricanRegion } from '../types';
import { REGIONS, AFRICAN_COUNTRIES } from '../data/countries';
import {
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Globe2,
  CheckCircle2,
  X
} from 'lucide-react';

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
  onSelectService: (service: Service) => void;
  initialQuery?: string;
  initialCategory?: string;
  initialType?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  'Engineering': 'Development & Tech',
  'Development & Tech': 'Development & Tech',
  'AI & Data': 'AI & Data Science',
  'AI & Data Science': 'AI & Data Science',
  'Design & Creative': 'Design & Creative',
  'Design & UI/UX': 'Design & Creative',
  'Growth & Marketing': 'Marketing & Sales',
  'Marketing & Sales': 'Marketing & Sales',
  'Legal & Operations': 'Legal & Compliance',
  'Legal & Compliance': 'Legal & Compliance'
};

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onNavigate,
  onSelectTalent,
  onSelectService,
  initialQuery = '',
  initialCategory = '',
  initialType = ''
}) => {
  const { talentList, servicesList } = useMarketplace();

  const resolveCategory = (cat: string) => {
    if (!cat || cat === 'ALL') return 'ALL';
    const decoded = decodeURIComponent(cat).trim();
    return CATEGORY_MAP[decoded] || decoded || 'ALL';
  };

  const [activeTab, setActiveTab] = useState<'TALENT' | 'SERVICES'>(() => {
    return initialType?.toLowerCase() === 'services' ? 'SERVICES' : 'TALENT';
  });
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => resolveCategory(initialCategory));
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [selectedTalentForRefer, setSelectedTalentForRefer] = useState<TalentProfile | null>(null);
  const [selectedServiceForRefer, setSelectedServiceForRefer] = useState<Service | null>(null);

  // Sync category or tab if query params change
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(resolveCategory(initialCategory));
    }
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialType?.toLowerCase() === 'services') {
      setActiveTab('SERVICES');
    }
  }, [initialType]);

  const categories = [
    'ALL',
    'Development & Tech',
    'Design & Creative',
    'AI & Data Science',
    'Marketing & Sales',
    'Legal & Compliance'
  ];

  // Helper to check if talent skills/headline match category
  const matchesTalentCategory = (t: TalentProfile, cat: string) => {
    if (cat === 'ALL') return true;
    const catLower = cat.toLowerCase();
    if (catLower.includes('development') || catLower.includes('tech') || catLower.includes('engineering')) {
      return t.skills.some(s => /code|developer|full stack|backend|frontend|node|go|react|mobile|flutter|swift|ios|devops|cloud|cybersecurity|architect/i.test(s)) ||
        /engineer|developer|architect|full stack|devops|mobile/i.test(t.headline);
    }
    if (catLower.includes('ai') || catLower.includes('data')) {
      return t.skills.some(s => /ai|data|machine learning|python|nlp|analytics|pytorch|intelligence|fraud/i.test(s)) ||
        /ai|data|machine learning|intelligence/i.test(t.headline);
    }
    if (catLower.includes('design') || catLower.includes('creative')) {
      return t.skills.some(s => /design|ui|ux|figma|brand|typography|art|visual|creative/i.test(s)) ||
        /design|ui|ux|creative|art/i.test(t.headline);
    }
    if (catLower.includes('marketing') || catLower.includes('growth') || catLower.includes('sales')) {
      return t.skills.some(s => /marketing|growth|seo|social|e-commerce|content|sales|gtm/i.test(s)) ||
        /marketing|growth|e-commerce|seo/i.test(t.headline);
    }
    if (catLower.includes('legal') || catLower.includes('compliance') || catLower.includes('operations')) {
      return t.skills.some(s => /legal|compliance|operations|fintech|security|audit|regulatory/i.test(s)) ||
        /legal|compliance|operations|fintech/i.test(t.headline);
    }
    return true;
  };

  // Filter Logic
  const filteredTalent = useMemo(() => {
    return talentList.filter(t => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.full_name.toLowerCase().includes(q);
        const matchesHeadline = t.headline.toLowerCase().includes(q);
        const matchesSkills = t.skills.some(s => s.toLowerCase().includes(q));
        const matchesBio = t.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesHeadline && !matchesSkills && !matchesBio) return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && !matchesTalentCategory(t, selectedCategory)) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'ALL') {
        const country = AFRICAN_COUNTRIES.find(c => c.name.toLowerCase() === t.country_name.toLowerCase());
        if (!country || country.region !== selectedRegion) return false;
      }
      // Country filter
      if (selectedCountry !== 'ALL') {
        if (t.country_name.toLowerCase() !== selectedCountry.toLowerCase()) return false;
      }
      // Verified only
      if (verifiedOnly && t.verification_status !== 'PROFESSION_VERIFIED') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      // 1. Talents enrolled in Featured Talent Pro strictly rank first
      const aPro = (a.is_pro || a.is_featured) ? 1 : 0;
      const bPro = (b.is_pro || b.is_featured) ? 1 : 0;
      if (bPro !== aPro) return bPro - aPro;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.completed_projects - a.completed_projects;
    });
  }, [talentList, searchQuery, selectedCategory, selectedRegion, selectedCountry, verifiedOnly]);

  const filteredServices = useMemo(() => {
    return servicesList.filter(s => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesTalent = s.talent_name.toLowerCase().includes(q);
        const matchesSkills = s.skills.some(sk => sk.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTalent && !matchesSkills) return false;
      }
      if (selectedCategory !== 'ALL') {
        const catStandard = resolveCategory(selectedCategory);
        if (s.category !== catStandard && s.category !== selectedCategory) {
          return false;
        }
      }
      if (selectedCountry !== 'ALL' && s.talent_country.toLowerCase() !== selectedCountry.toLowerCase()) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const aTalent = talentList.find(t => t.id === a.talent_id || t.full_name === a.talent_name);
      const bTalent = talentList.find(t => t.id === b.talent_id || t.full_name === b.talent_name);
      const aPro = (aTalent?.is_pro || aTalent?.is_featured) ? 1 : 0;
      const bPro = (bTalent?.is_pro || bTalent?.is_featured) ? 1 : 0;
      if (bPro !== aPro) return bPro - aPro;
      return b.talent_rating - a.talent_rating;
    });
  }, [servicesList, talentList, searchQuery, selectedCategory, selectedCountry]);

  const handleReferTalent = (talent: TalentProfile) => {
    setSelectedTalentForRefer(talent);
  };

  const handleReferService = (service: Service) => {
    setSelectedServiceForRefer(service);
    const talent = talentList.find(t => t.id === service.talent_id);
    if (talent) setSelectedTalentForRefer(talent);
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
              Africa Professional Marketplace
            </h1>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Search vetted talent or browse guaranteed referral services across 54 African countries.
            </p>
          </div>

          {/* View Tab Switcher: Talent vs Services */}
          <div
            style={{
              display: 'flex',
              background: 'var(--rf-bg-surface-hover)',
              border: '1px solid var(--rf-bg-card-border)',
              borderRadius: 'var(--rf-radius-md)',
              padding: '3px',
              width: 'min(100%, 380px)'
            }}
          >
            <button
              onClick={() => setActiveTab('TALENT')}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--rf-radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: activeTab === 'TALENT' ? '#FFFFFF' : 'var(--rf-slate-400)',
                backgroundColor: activeTab === 'TALENT' ? 'var(--rf-leaf-green)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'center'
              }}
            >
              Talents ({filteredTalent.length})
            </button>
            <button
              onClick={() => setActiveTab('SERVICES')}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--rf-radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: activeTab === 'SERVICES' ? '#FFFFFF' : 'var(--rf-slate-400)',
                backgroundColor: activeTab === 'SERVICES' ? 'var(--rf-leaf-green)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'center'
              }}
            >
              Services ({filteredServices.length})
            </button>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div
          style={{
            background: 'var(--rf-navy-surface)',
            border: '1px solid var(--rf-navy-border)',
            borderRadius: 'var(--rf-radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Main Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--rf-slate-400)' }} />
            <input
              type="text"
              className="rf-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by skill, name, role (e.g. 'Fintech Figma', 'Node.js Architect', 'Flutter', 'Cairo')..."
              style={{ paddingLeft: '2.75rem', fontSize: '0.9375rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '1rem', color: 'var(--rf-slate-400)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Pills: Region, Country, Category, Verified */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* Region Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: '1 1 140px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', whiteSpace: 'nowrap' }}>
                Region:
              </span>
              <select
                className="rf-select"
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', width: '100%' }}
              >
                <option value="ALL">All Africa</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Country Dropdown Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: '1 1 140px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', whiteSpace: 'nowrap' }}>
                Country:
              </span>
              <select
                className="rf-select"
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', width: '100%' }}
              >
                <option value="ALL">All 54 Countries</option>
                {AFRICAN_COUNTRIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            {activeTab === 'SERVICES' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: '1 1 140px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', whiteSpace: 'nowrap' }}>
                  Category:
                </span>
                <select
                  className="rf-select"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', width: '100%' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Verified Only Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--rf-cream)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                style={{ accentColor: 'var(--rf-mint)' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                <CheckCircle2 size={14} color="var(--rf-mint)" />
                Verified Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {activeTab === 'TALENT' ? (
        filteredTalent.length > 0 ? (
          <div className="rf-grid-cards">
            {filteredTalent.map(talent => (
              <TalentCard
                key={talent.id}
                talent={talent}
                onSelect={onSelectTalent}
                onRefer={handleReferTalent}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--rf-bg-surface-hover)', border: '1px solid var(--rf-bg-card-border)', borderRadius: 'var(--rf-radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
              No Talent Found
            </h3>
            <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Try broadening your search terms or clearing your country and regional filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('ALL');
                setSelectedCountry('ALL');
                setVerifiedOnly(false);
              }}
              className="rf-btn rf-btn-secondary"
            >
              Reset All Filters
            </button>
          </div>
        )
      ) : filteredServices.length > 0 ? (
        <div className="rf-grid-cards">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
              onRefer={handleReferService}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--rf-bg-surface-hover)', border: '1px solid var(--rf-bg-card-border)', borderRadius: 'var(--rf-radius-lg)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
            No Services Found
          </h3>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedCountry('ALL');
            }}
            className="rf-btn rf-btn-secondary"
          >
            Reset Filters
          </button>
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
