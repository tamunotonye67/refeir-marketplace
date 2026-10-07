import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, HelpCircle, ArrowRight, MessageSquare, Mail } from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';

interface FAQPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

interface FAQItem {
  category: string;
  q: string;
  a: string;
}

const FAQ_DATABASE: FAQItem[] = [
  // Admissions & Selection
  {
    category: 'Admissions',
    q: 'Who is eligible to become a Refeir Pioneer?',
    a: 'Anyone with useful domain skills, ideas, networks, or an active willingness to build Africa’s freelance infrastructure. There is no minimum formal degree or years-of-experience requirement. Students, junior developers, senior architects, designers, and community creators are all welcome.'
  },
  {
    category: 'Admissions',
    q: 'How long does the application review take?',
    a: 'Our admissions committee reviews applications on a rolling weekly basis. Most applicants receive a status update within 48 to 72 hours via email and WhatsApp. You can also check your live review status anytime on the site using your Application ID.'
  },
  {
    category: 'Admissions',
    q: 'Is admission restricted to specific African countries?',
    a: 'No. While our initial launch hubs are focused on Nigeria, Kenya, Ghana, Rwanda, Egypt, and South Africa, pioneers from all 54 African nations (and members of the African diaspora globally) are eligible and encouraged to apply.'
  },
  {
    category: 'Admissions',
    q: 'Can I apply for more than one squad or division?',
    a: 'Yes. In the application form, you can indicate multiple roles and domain interests. However, you will select one Primary Division where your main weekly contributions and deliverables will be focused.'
  },

  // Squads & Roles
  {
    category: 'Squads',
    q: 'Do I have to be a software developer to participate?',
    a: 'Absolutely not. Over 60% of Refeir’s squads are dedicated to non-engineering disciplines: UI/UX design, brand identity, marketing loops, business development, campus community leadership, user research, and quality assurance.'
  },
  {
    category: 'Squads',
    q: 'How much time commitment is expected each week?',
    a: 'There is no rigid clock-in requirement. Most Pioneers contribute between 3 to 8 flexible hours per week. Consistency and follow-through on specific tasks matter far more than total raw hours.'
  },
  {
    category: 'Squads',
    q: 'How do squads coordinate and collaborate?',
    a: 'Squads communicate through dedicated private WhatsApp Community groups, weekly asynchronous check-ins, and bi-weekly virtual town halls. You will receive private channel invitations upon acceptance.'
  },
  {
    category: 'Squads',
    q: 'How do Daily Squad Missions & Bounties work?',
    a: 'Each squad releases daily missions and weekly sprints designed by squad leads and Tonye Taylor. Active missions carry tangible compensation (Airtime giveaways, Data vouchers, Cash prizes, and Certificate XP). Pioneers review specifications, execute the deliverable, and submit proof of work for fast-track validation.'
  },

  // Compensation & Economics
  {
    category: 'Compensation',
    q: 'Is becoming a Pioneer a paid full-time job?',
    a: 'No. The Pioneer program is an early contributor and co-creation fellowship. It does not constitute formal employment or guaranteed immediate salaries. However, Pioneers receive substantial economic advantages, priority contract assignments, and higher referral commission multipliers on mainnet launch.'
  },
  {
    category: 'Compensation',
    q: 'How do the referral protocol earnings work?',
    a: 'When you refer an employer who posts a job or a freelancer who completes an escrow milestone on Refeir, the protocol automatically distributes a recurring referral reward directly to your wallet or bank account upon client sign-off.'
  },
  {
    category: 'Compensation',
    q: 'How does the Contributor Reward Scheme & Ladder work?',
    a: 'Refeir operates a formal 5-level contributor progression ladder: Level 1 (Refeir Member), Level 2 (Refeir Pioneer), Level 3 (Refeir Builder), Level 4 (Refeir Lead), and Level 5 (Refeir Core Team). Rewards, elevated referral commission multipliers (+15% to +30%), squad stipends, bounty pools, and token allocations are awarded based on verified missions and tangible contributions rather than passive group membership.'
  },
  {
    category: 'Compensation',
    q: 'Do I get contributor rewards just by joining the WhatsApp group?',
    a: 'No. Joining the community places you at Level 1: Refeir Member. To qualify for official Pioneer badges, higher commission tiers, bounty pools, and Level Completion Certificates, you must complete and have at least 15 verified deliverables approved to unlock Level 2 (Refeir Pioneer) and beyond.'
  },
  {
    category: 'Compensation',
    q: 'Will Pioneers receive equity or token incentives?',
    a: 'Yes. Pioneers who advance to Level 3 (Builder), Level 4 (Lead), and Level 5 (Core Team) are eligible for bounty pool payouts, squad leadership grants, and contributor equity or ecosystem token pool allocations.'
  },
  {
    category: 'Compensation',
    q: 'How are Airtime, Data, and Cash Bounties disbursed?',
    a: 'Airtime and Data vouchers are dispatched directly to your verified phone number (MTN, Airtel, Glo, 9mobile) within 2 to 4 hours of approval. Cash prizes are wired to your designated bank account or fintech wallet within 24 hours, while verified deliverable credits are permanently logged toward your Level 2 & Level 3 Pioneer Certificates.'
  },

  // Community & Conduct
  {
    category: 'Community',
    q: 'What is the Pioneer Code of Conduct?',
    a: 'Refeir is founded on integrity, peer respect, and confidentiality. Pioneers agree not to leak unreleased product specifications or test datasets, and to maintain an inclusive, supportive environment for all builders.'
  },
  {
    category: 'Community',
    q: 'What happens if I cannot maintain my weekly commitment?',
    a: 'We understand that freelance and work schedules fluctuate. Simply notify your Squad Lead. Members who need to step back can transition to alumni contributor status while preserving their Founding 100 credentials.'
  },
  {
    category: 'Community',
    q: 'How can I contact the core team for questions?',
    a: 'You can reach out through our Contact page, email us at pioneers@refeir.com, or drop a query inside our community support channels.'
  }
];

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const categories = ['All', 'Admissions', 'Squads', 'Compensation', 'Community'];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter(item => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleAccordion = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter(i => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: RF_DEEP_GREEN, color: '#1E293B' }}>
      {/* Hero Header */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '130px 24px 70px', position: 'relative', overflow: 'hidden', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 840, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}33`,
            padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 20
          }}>
            Help Center & Knowledge Base
          </span>

          <h1 style={{
            fontSize: 'clamp(34px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: 20, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Frequently asked<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              questions & answers.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7, maxWidth: 640, margin: '0 auto 32px'
          }}>
            Everything you need to know about admissions, squad deliverables, referral economics, and pioneer community participation.
          </p>

          {/* Interactive Search Bar */}
          <div style={{
            maxWidth: 580, margin: '0 auto', position: 'relative'
          }}>
            <Search size={18} color={RF_LEAF_GREEN} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search questions (e.g. stipend, review time, developer, equity)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '14px 20px 14px 48px', borderRadius: 100,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF', fontSize: 14, outline: 'none', transition: 'all 0.2s',
                backdropFilter: 'blur(8px)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ padding: '30px 24px 10px', background: '#F8FAF9', borderBottom: '1px solid #E2E8F0' }}>
        <div className="rp-category-pill-bar" style={{ maxWidth: 840, margin: '0 auto', display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 100, fontSize: 13,
                  fontWeight: isSelected ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s',
                  background: isSelected ? RF_DEEP_GREEN : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  border: `1px solid ${isSelected ? RF_DEEP_GREEN : '#E2E8F0'}`
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Accordion Questions List */}
      <section style={{ padding: '60px 24px 90px', background: '#F8FAF9' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0' }}>
              <HelpCircle size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#334155', marginBottom: 6 }}>No matching questions found</h3>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
                Try adjusting your search terms or view all categories.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                style={{
                  background: '#F1F5F9', border: 'none', padding: '9px 18px', borderRadius: 100,
                  fontSize: 13, fontWeight: 600, color: '#1E293B', cursor: 'pointer'
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    style={{
                      border: `1px solid ${isOpen ? RF_LEAF_GREEN : '#E2E8F0'}`,
                      borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s',
                      background: isOpen ? '#FFFFFF' : '#FFFFFF',
                      boxShadow: isOpen ? '0 6px 24px rgba(0,0,0,0.04)' : 'none'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '20px 24px', background: 'none',
                        border: 'none', cursor: 'pointer', gap: 16, textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: 15.5, fontWeight: 600, color: RF_DEEP_GREEN, letterSpacing: '-0.01em' }}>
                        {faq.q}
                      </span>
                      <div style={{
                        flexShrink: 0, color: RF_LEAF_GREEN,
                        transform: isOpen ? 'rotate(180deg)' : '',
                        transition: 'transform 0.2s'
                      }}>
                        <ChevronDown size={19} />
                      </div>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 24px 22px', borderTop: '1px solid #F1F5F9' }}>
                        <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.75, margin: '14px 0 0' }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Still Have Questions Box */}
          <div style={{
            marginTop: 60, background: '#FFFFFF', borderRadius: 20, padding: '36px 32px',
            border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 20
          }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif', color: RF_DEEP_GREEN, margin: '0 0 6px' }}>
                Still have a question?
              </h3>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
                Our team is always available to clarify any details about the Pioneer program.
              </p>
            </div>

            <div className="rp-responsive-btn-group" style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => onNavigate('/contact')}
                style={{
                  background: RF_DEEP_GREEN, color: '#FFFFFF', border: 'none',
                  padding: '11px 22px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7
                }}
              >
                <Mail size={14} /> Contact Team
              </button>

              <button
                onClick={() => onNavigate('/#apply')}
                style={{
                  background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                  padding: '11px 22px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7
                }}
              >
                Apply Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
