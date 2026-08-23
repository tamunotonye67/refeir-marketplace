import React, { useState } from 'react';
import { TalentProfile, Service, PortfolioItem } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import { ReferModal } from '../components/referral/ReferModal';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Clock,
  Briefcase,
  Globe2,
  Award,
  ArrowLeft,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';

interface TalentProfilePageProps {
  talent: TalentProfile;
  onBack: () => void;
  onNavigate: (path: string) => void;
  onHire: (talent: TalentProfile, service?: Service) => void;
}

export const TalentProfilePage: React.FC<TalentProfilePageProps> = ({
  talent,
  onBack,
  onNavigate,
  onHire
}) => {
  const { servicesList } = useMarketplace();
  const { currentUser, switchRole } = useAuth();
  const activeRole = currentUser?.active_role;
  const [showReferModal, setShowReferModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const talentServices = servicesList.filter(s => s.talent_id === talent.id);

  return (
    <div className="rf-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="rf-btn rf-btn-ghost rf-btn-sm"
        style={{ gap: '0.375rem', marginBottom: '1.5rem', color: 'var(--rf-slate-400)' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </button>

      {/* Main Grid: Left Column (Profile, Portfolio, Reviews) & Right Column (Sticky Pricing, Referral Card) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column */}
        <div>
          {/* Profile Header Card */}
          <div
            className="rf-card"
            style={{
              padding: '2rem',
              display: 'flex',
              gap: '1.75rem',
              marginBottom: '2rem',
              alignItems: 'flex-start'
            }}
          >
            <img
              src={talent.avatar_url}
              alt={talent.full_name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--rf-navy-border)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
                  {talent.full_name}
                </h1>
                {talent.verification_status === 'PROFESSION_VERIFIED' && (
                  <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} />
                    Verified Professional
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--rf-mint)', marginBottom: '0.75rem' }}>
                {talent.headline}
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--rf-slate-300)', marginBottom: '1rem' }}>
                <CountryFlag countryIsoOrName={talent.country_name} />
                <span>• {talent.city}</span>
                <span>• Timezone: {talent.timezone}</span>
                <span>• {talent.experience_years} years exp</span>
              </div>

              {/* Badges: Rating, Completed Projects, Response Time */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(255,255,255,0.05)', padding: '0.375rem 0.75rem', borderRadius: 'var(--rf-radius-sm)' }}>
                  <Star size={15} fill="#FDB022" color="#FDB022" />
                  <strong style={{ color: 'var(--rf-cream)' }}>{talent.rating}</strong>
                  <span style={{ color: 'var(--rf-slate-400)' }}>({talent.reviews_count} reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(255,255,255,0.05)', padding: '0.375rem 0.75rem', borderRadius: 'var(--rf-radius-sm)' }}>
                  <Briefcase size={15} color="var(--rf-mint)" />
                  <strong style={{ color: 'var(--rf-cream)' }}>{talent.completed_projects}</strong> projects ({talent.completion_rate}% success)
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(255,255,255,0.05)', padding: '0.375rem 0.75rem', borderRadius: 'var(--rf-radius-sm)' }}>
                  <Clock size={15} color="var(--rf-blue)" />
                  <span>Responds {talent.response_time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About & Bio */}
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Professional Background
            </h3>
            <p style={{ color: 'var(--rf-cream)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {talent.bio}
            </p>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', marginBottom: '0.75rem' }}>
              Core Skills & Tools
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {talent.skills.map((skill: string) => (
                <span
                  key={skill}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--rf-radius-md)',
                    background: 'rgba(36, 87, 255, 0.12)',
                    color: '#7DA2FF',
                    border: '1px solid rgba(36, 87, 255, 0.25)',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', borderTop: '1px solid var(--rf-navy-border)', paddingTop: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Languages
                </span>
                <div style={{ fontSize: '0.875rem', color: 'var(--rf-cream)', fontWeight: 600, marginTop: '2px' }}>
                  {talent.languages.join(', ')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Education
                </span>
                <div style={{ fontSize: '0.875rem', color: 'var(--rf-cream)', fontWeight: 600, marginTop: '2px' }}>
                  {talent.education}
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          {talentServices.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
                Services Offered ({talentServices.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {talentServices.map(srv => (
                  <div
                    key={srv.id}
                    className="rf-card rf-card-interactive"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem' }}
                  >
                    <div style={{ flex: 1 }}>
                      <span className="rf-badge rf-badge-blue rf-text-xs" style={{ marginBottom: '0.375rem' }}>
                        {srv.category}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                        {srv.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                        <span>{srv.delivery_days} days delivery</span>
                        <span>{srv.revisions} revisions</span>
                        <span style={{ color: 'var(--rf-mint)', fontWeight: 700 }}>
                          {srv.referral_percentage}% Scout Reward
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                        {formatMoney(srv.price)}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setSelectedService(srv);
                            setShowReferModal(true);
                          }}
                          className="rf-btn rf-btn-mint rf-btn-sm"
                        >
                          <span>Refer</span>
                        </button>
                        <button
                          onClick={() => onHire(talent, srv)}
                          className="rf-btn rf-btn-primary rf-btn-sm"
                        >
                          <span>Hire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Showcase */}
          {talent.portfolio.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
                Featured Portfolio
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {talent.portfolio.map((item: PortfolioItem) => (
                  <div key={item.id} className="rf-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1.25rem' }}>
                      <span className="rf-badge rf-badge-neutral rf-text-xs" style={{ marginBottom: '0.375rem' }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Column: Order & Refer Card */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div
            className="rf-card rf-card-glow"
            style={{
              padding: '1.75rem',
              border: '1px solid rgba(54, 224, 160, 0.3)',
              background: 'var(--rf-navy-surface)'
            }}
          >
            {/* Dynamic Role Banner */}
            {activeRole === 'CLIENT' ? (
              /* CLIENT MODE: Trust Vault Custody Protection */
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.15) 0%, rgba(54, 224, 160, 0.12) 100%)',
                  border: '1px solid rgba(54, 224, 160, 0.35)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '1rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <ShieldCheck size={14} />
                  <span>100% Protected Client Trust Vault</span>
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                  0% Escrow Fee • Milestone Custody
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '4px' }}>
                  Milestone funds are held in regulated custody rails and released only upon your explicit approval.
                </p>
              </div>
            ) : activeRole === 'SCOUT' ? (
              /* SCOUT MODE: Locked Referral Opportunity */
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(54, 224, 160, 0.15) 0%, rgba(36, 87, 255, 0.15) 100%)',
                  border: '1px solid rgba(54, 224, 160, 0.3)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '0.875rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Sparkles size={14} />
                  <span>Locked Referral Opportunity</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                  {talent.referral_percentage}% Scout Reward
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                  Share your link with client hiring managers and earn locked {talent.referral_percentage}% reward upon project milestone completion.
                </p>
              </div>
            ) : activeRole === 'TALENT' ? (
              /* TALENT MODE: Peer Network */
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '0.875rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Globe2 size={14} />
                  <span>African Talent Network</span>
                </div>
                <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                  Peer Portfolio Profile
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                  Connect with verified developers, designers, and specialists across Africa.
                </p>
              </div>
            ) : (
              /* GUEST MODE */
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(54, 224, 160, 0.15) 0%, rgba(36, 87, 255, 0.15) 100%)',
                  border: '1px solid rgba(54, 224, 160, 0.3)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '0.875rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Sparkles size={14} />
                  <span>Vetted African Professional</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                  {talent.referral_percentage}% Referral / Direct Hire
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Starting Engagement Rate
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                {formatMoney(talent.starting_price)}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {activeRole === 'CLIENT' ? (
                /* CLIENT MODE: Only Hire and Message actions, strictly NO Refer button */
                <>
                  <button
                    onClick={() => onHire(talent, selectedService || undefined)}
                    className="rf-btn rf-btn-primary rf-btn-lg rf-w-full"
                    style={{ fontWeight: 800, gap: '0.5rem' }}
                  >
                    <Briefcase size={16} />
                    <span>Hire {talent.full_name.split(' ')[0]} Now</span>
                  </button>

                  <button
                    onClick={() => onNavigate('/messages')}
                    className="rf-btn rf-btn-secondary rf-btn-md rf-w-full"
                    style={{ gap: '0.5rem' }}
                  >
                    <MessageSquare size={15} />
                    <span>Message & Scope Project</span>
                  </button>
                </>
              ) : activeRole === 'SCOUT' ? (
                /* SCOUT MODE: Only Refer CTA, Scout cannot hire directly without switching to Client mode */
                <>
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      setShowReferModal(true);
                    }}
                    className="rf-btn rf-btn-mint rf-btn-lg rf-w-full"
                    style={{ fontWeight: 800, gap: '0.5rem' }}
                  >
                    <Sparkles size={16} />
                    <span>Refer {talent.full_name.split(' ')[0]} (Earn {talent.referral_percentage}%)</span>
                  </button>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'block', marginBottom: '0.35rem' }}>
                      Want to hire this talent directly?
                    </span>
                    <button
                      onClick={() => switchRole('CLIENT')}
                      className="rf-btn rf-btn-secondary rf-btn-xs"
                      style={{ width: '100%', gap: '0.35rem' }}
                    >
                      <Briefcase size={12} />
                      <span>Switch to Client Mode to Hire</span>
                    </button>
                  </div>
                </>
              ) : activeRole === 'TALENT' ? (
                /* TALENT MODE: Connect & Collaborate only */
                <button
                  onClick={() => onNavigate('/messages')}
                  className="rf-btn rf-btn-secondary rf-btn-lg rf-w-full"
                  style={{ gap: '0.5rem' }}
                >
                  <MessageSquare size={15} />
                  <span>Connect & Collaborate</span>
                </button>
              ) : (
                /* GUEST MODE: Both options */
                <>
                  <button
                    onClick={() => onHire(talent)}
                    className="rf-btn rf-btn-primary rf-btn-lg rf-w-full"
                  >
                    <span>Hire Professional</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      setShowReferModal(true);
                    }}
                    className="rf-btn rf-btn-mint rf-btn-lg rf-w-full"
                  >
                    <span>Refer {talent.full_name.split(' ')[0]} & Earn</span>
                  </button>
                </>
              )}
            </div>

            {/* Protection Guarantees */}
            <div style={{ borderTop: '1px solid var(--rf-navy-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                <ShieldCheck size={16} color="var(--rf-mint)" />
                <span>100% Protected Project Payments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                <Check size={16} color="var(--rf-mint)" />
                <span>Milestone-based fund release</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                <Check size={16} color="var(--rf-mint)" />
                <span>Verified identity & portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refer Modal */}
      {showReferModal && (
        <ReferModal
          talent={talent}
          service={selectedService || undefined}
          onClose={() => setShowReferModal(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
