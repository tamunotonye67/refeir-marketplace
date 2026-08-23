import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { ReferModal } from '../components/referral/ReferModal';
import { Service, TalentProfile } from '../types';
import { Sparkles, Search, Filter, ArrowRight, ShieldCheck, CheckCircle2, Globe2 } from 'lucide-react';

interface ProjectCatalogPageProps {
  onNavigate?: (path: string) => void;
  onSelectService?: (service: Service) => void;
  onSelectTalent?: (talent: TalentProfile) => void;
}

export const ProjectCatalogPage: React.FC<ProjectCatalogPageProps> = ({
  onNavigate = () => {},
  onSelectService = () => {},
  onSelectTalent = () => {}
}) => {
  const { servicesList, talentList } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedServiceForRefer, setSelectedServiceForRefer] = useState<Service | null>(null);
  const [selectedTalentForRefer, setSelectedTalentForRefer] = useState<TalentProfile | null>(null);

  const categories = [
    'ALL',
    'Design & Creative',
    'Development & Tech',
    'AI & Data Science',
    'Marketing & Sales',
    'Legal & Compliance'
  ];

  const filteredServices = servicesList.filter(s => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchTalent = s.talent_name.toLowerCase().includes(q);
      const matchSkills = s.skills.some(sk => sk.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTalent && !matchSkills) return false;
    }
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleReferService = (service: Service) => {
    setSelectedServiceForRefer(service);
    const talent = talentList.find(t => t.id === service.talent_id);
    if (talent) setSelectedTalentForRefer(talent);
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(10, 26, 18, 0.8) 0%, transparent 100%)', borderBottom: '1px solid var(--rf-navy-border)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="rf-container" style={{ maxWidth: '840px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
            <Sparkles size={16} />
            <span>PRE-SCOUTED WORK PACKAGES</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Project Catalog
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2rem' }}>
            Browse ready-to-deliver project packages with transparent pricing, guaranteed delivery windows, and 10% Scout referral commissions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary rf-btn-lg">
              <span>View Talent Marketplace</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('/agencies')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <span>Hire an Agency</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rf-container" style={{ maxWidth: '1100px', paddingTop: '3rem' }}>
        {/* Search & Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rf-btn rf-btn-sm ${selectedCategory === cat ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
                style={{ borderRadius: '100px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
            <input
              type="text"
              className="rf-input"
              placeholder="Search project services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={() => onSelectService(service)}
              onRefer={() => handleReferService(service)}
            />
          ))}
        </div>

        {/* Project Escrow Guarantee Banner */}
        <div className="rf-card" style={{ padding: '2.5rem', border: '1px solid rgba(102,187,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--rf-leaf-green)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>100% Protected Milestone Delivery</h3>
            </div>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              All project catalog engagements include predefined revision rounds, source code transfer, and funds held in escrow until you approve the completed deliverable.
            </p>
          </div>
          <button onClick={() => onNavigate('/protection')} className="rf-btn rf-btn-secondary">
            <span>Learn About Protection</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Referral Modal */}
      {selectedTalentForRefer && (
        <ReferModal
          onClose={() => {
            setSelectedTalentForRefer(null);
            setSelectedServiceForRefer(null);
          }}
          talent={selectedTalentForRefer}
          service={selectedServiceForRefer || undefined}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
