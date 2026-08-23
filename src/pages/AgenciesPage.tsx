import React, { useState } from 'react';
import { Building2, Users, Star, ArrowRight, ShieldCheck, CheckCircle2, Globe2, Briefcase, Sparkles, Filter } from 'lucide-react';
import { formatMoney, createMoney } from '../data/currencies';

interface AgenciesPageProps {
  onNavigate?: (path: string) => void;
}

interface Agency {
  id: string;
  name: string;
  tagline: string;
  country: string;
  city: string;
  teamSize: string;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  minBudget: string;
  specialties: string[];
  logo: string;
  lead: string;
  leadAvatar: string;
  verified: boolean;
}

const AGENCIES: Agency[] = [
  {
    id: 'agency-afrikode',
    name: 'AfriKode Digital Labs',
    tagline: 'Enterprise Full-Stack Software Engineering & Cloud Modernization',
    country: 'Nigeria',
    city: 'Lagos',
    teamSize: '15–30 engineers',
    rating: 4.96,
    reviewsCount: 42,
    completedProjects: 58,
    minBudget: '₦2,500,000 / project',
    specialties: ['FinTech Systems', 'Cloud Architecture', 'React & Node.js', 'DevOps & Kubernetes'],
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    lead: 'Tunde Bakare, Technical Director',
    leadAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'agency-savannah-ux',
    name: 'Savannah Design Studio',
    tagline: 'Pan-African Product Strategy, Mobile UX & Design Systems',
    country: 'Kenya',
    city: 'Nairobi',
    teamSize: '8–15 designers',
    rating: 4.98,
    reviewsCount: 38,
    completedProjects: 49,
    minBudget: 'KSh 350,000 / project',
    specialties: ['Fintech UX', 'Mobile App Design', 'Design Systems in Figma', 'User Research'],
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80',
    lead: 'Wanjiku Kamau, Head of Design',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'agency-kente-growth',
    name: 'Kente Growth Partners',
    tagline: 'Cross-Border GTM, Multilingual Performance Marketing & SEO',
    country: 'Ghana',
    city: 'Accra',
    teamSize: '10–20 marketers',
    rating: 4.92,
    reviewsCount: 31,
    completedProjects: 36,
    minBudget: 'GH₵ 25,000 / project',
    specialties: ['Pan-African SEO', 'Paid Acquisition', 'Conversion Optimization', 'B2B GTM Strategy'],
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80',
    lead: 'Kofi Mensah, Growth Partner',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'agency-nile-ai',
    name: 'Nile Intelligence Lab',
    tagline: 'Custom AI NLP Models, Computer Vision & Fraud Risk Systems',
    country: 'Egypt',
    city: 'Cairo',
    teamSize: '12–25 ML engineers',
    rating: 4.95,
    reviewsCount: 27,
    completedProjects: 33,
    minBudget: 'E£ 85,000 / project',
    specialties: ['Dialect NLP', 'Risk Scoring Models', 'Document OCR', 'Python & PyTorch'],
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=150&q=80',
    lead: 'Dr. Tariq El-Masry, Chief Scientist',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'agency-mzansi-dev',
    name: 'Cape Point Solutions',
    tagline: 'High-Volume Mobile Commerce & Scalable Microservices',
    country: 'South Africa',
    city: 'Cape Town',
    teamSize: '20–40 engineers',
    rating: 4.97,
    reviewsCount: 45,
    completedProjects: 62,
    minBudget: 'R 65,000 / project',
    specialties: ['Flutter Mobile', 'AWS Cloud Infrastructure', 'Payment Gateways', 'API Architecture'],
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=150&q=80',
    lead: 'Sipho Dlamini, Managing Director',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    verified: true
  }
];

export const AgenciesPage: React.FC<AgenciesPageProps> = ({ onNavigate = () => {} }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryModalAgency, setInquiryModalAgency] = useState<Agency | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  const specialties = ['ALL', 'Engineering', 'Product & UX Design', 'AI & Data Science', 'Growth & Marketing'];

  const filteredAgencies = AGENCIES.filter(a => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchTag = a.tagline.toLowerCase().includes(q);
      const matchCountry = a.country.toLowerCase().includes(q);
      const matchSpec = a.specialties.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchTag && !matchCountry && !matchSpec) return false;
    }
    if (selectedSpecialty !== 'ALL') {
      const spec = selectedSpecialty.toLowerCase();
      if (spec.includes('engineering') && !a.specialties.some(s => /software|cloud|react|flutter|api|systems/i.test(s))) return false;
      if (spec.includes('design') && !a.specialties.some(s => /ux|design|figma|research/i.test(s))) return false;
      if (spec.includes('ai') && !a.specialties.some(s => /nlp|ai|risk|models|pytorch/i.test(s))) return false;
      if (spec.includes('marketing') && !a.specialties.some(s => /marketing|seo|acquisition|gtm/i.test(s))) return false;
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(10, 26, 18, 0.8) 0%, transparent 100%)', borderBottom: '1px solid var(--rf-navy-border)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="rf-container" style={{ maxWidth: '840px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
            <Building2 size={16} />
            <span>AGENCY MARKETPLACE</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Hire Vetted African Agencies & Studios
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2rem' }}>
            Looking for a dedicated multi-disciplinary team? Hire verified design studios, software labs, and growth agencies backed by Refeir milestone escrow.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/jobs')} className="rf-btn rf-btn-primary rf-btn-lg">
              <span>Post Agency RFP</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('/contact')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <span>Agency Directory Support</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rf-container" style={{ maxWidth: '1100px', paddingTop: '3rem' }}>
        {/* Search and Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`rf-btn rf-btn-sm ${selectedSpecialty === spec ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
                style={{ borderRadius: '100px' }}
              >
                {spec}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="rf-input"
            placeholder="Search agencies by name, skills, or country..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '320px', fontSize: '0.875rem' }}
          />
        </div>

        {/* Agency Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
          {filteredAgencies.map(agency => (
            <div key={agency.id} className="rf-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <img src={agency.logo} alt={agency.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--rf-navy-border)' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{agency.name}</h3>
                      {agency.verified && (
                        <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldCheck size={12} /> Verified Agency
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                      📍 {agency.city}, {agency.country} • 👥 {agency.teamSize}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {agency.tagline}
                </p>

                {/* Specialties Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {agency.specialties.map(s => (
                    <span key={s} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--rf-slate-300)', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '100px', border: '1px solid var(--rf-navy-border)' }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#F4B942', fontWeight: 700 }}>
                    <Star size={14} fill="#F4B942" /> {agency.rating} ({agency.reviewsCount} reviews)
                  </div>
                  <div>✅ {agency.completedProjects} projects delivered</div>
                  <div style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>Min. Budget: {agency.minBudget}</div>
                </div>
              </div>

              {/* Action Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '180px', textAlign: 'center' }}>
                <button
                  onClick={() => { setInquiryModalAgency(agency); setInquirySent(false); }}
                  className="rf-btn rf-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Request Proposal</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => onNavigate('/jobs')}
                  className="rf-btn rf-btn-secondary rf-btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Post RFP</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Hire on Refeir */}
        <div className="rf-card" style={{ padding: '3rem', border: '1px solid rgba(102,187,42,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Why Hire Agencies Through Refeir?</h2>
            <p style={{ color: 'var(--rf-slate-400)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>Enterprise security, milestone dispute mediation, and multi-currency billing.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Milestone Escrow Protection', desc: 'Hold project funds securely. Only release payments when predefined sprints and deliverables are signed off.' },
              { title: 'Local & Global Currency Rails', desc: 'Pay via Wire, USD, NGN, KES, GHS, or ZAR. We handle tax invoices and cross-border currency conversion.' },
              { title: 'Pre-Vetted Track Records', desc: 'Every agency passes team KYC verification, portfolio audit, and client reference checks before being listed.' },
              { title: 'Neutral Arbitration Support', desc: 'Dedicated 72-hour dispute resolution team protects both enterprise clients and agency partners.' }
            ].map(b => (
              <div key={b.title} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <CheckCircle2 size={20} color="var(--rf-leaf-green)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem' }}>{b.title}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.55 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proposal Inquiry Modal */}
      {inquiryModalAgency && (
        <div className="rf-modal-backdrop" onClick={() => setInquiryModalAgency(null)}>
          <div className="rf-modal-content" style={{ maxWidth: '480px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
              Request Proposal from {inquiryModalAgency.name}
            </h3>
            {inquirySent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Inquiry Submitted!</h4>
                <p style={{ color: 'var(--rf-slate-300)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  {inquiryModalAgency.name}'s leadership team will review your project requirements and respond within 24 hours.
                </p>
                <button onClick={() => setInquiryModalAgency(null)} className="rf-btn rf-btn-secondary" style={{ marginTop: '1.5rem' }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setInquirySent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label">Your Name</label>
                  <input className="rf-input" type="text" placeholder="David Kamau" required />
                </div>
                <div className="rf-form-group">
                  <label className="rf-label">Work Email</label>
                  <input className="rf-input" type="email" placeholder="david@company.com" required />
                </div>
                <div className="rf-form-group">
                  <label className="rf-label">Estimated Budget</label>
                  <select className="rf-select" required>
                    <option value="">Select budget range...</option>
                    <option value="5k">$2,500 – $5,000 (₦4M – ₦8M)</option>
                    <option value="15k">$5,000 – $15,000 (₦8M – ₦25M)</option>
                    <option value="50k">$15,000 – $50,000+ (₦25M+)</option>
                  </select>
                </div>
                <div className="rf-form-group">
                  <label className="rf-label">Project Brief</label>
                  <textarea className="rf-input" rows={3} placeholder="Describe scope, timeline, and tech stack requirements..." required />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="rf-btn rf-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Send RFP Inquiry
                  </button>
                  <button type="button" onClick={() => setInquiryModalAgency(null)} className="rf-btn rf-btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
