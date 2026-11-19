import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Headphones,
  MessageCircle,
  BookOpen,
  X,
  Clock,
  CheckCircle2,
  Compass,
  Briefcase,
  Award,
  Crown,
  Layers,
  type LucideIcon
} from 'lucide-react';
import {
  HELP_DIRECTORIES,
  type HelpRoleCategory,
  type HelpTopicArticle,
  type HelpCategorySection,
  type RoleHelpDirectory
} from '../data/helpDirectories';
import '../styles/help-center.css';

export {
  HELP_DIRECTORIES,
  type HelpRoleCategory,
  type HelpTopicArticle,
  type HelpCategorySection,
  type RoleHelpDirectory
};

interface HelpPageProps {
  onNavigate?: (path: string) => void;
}

const ROLE_TABS: { key: HelpRoleCategory; label: string; icon: LucideIcon }[] = [
  { key: 'ALL', label: 'All Topics', icon: Layers },
  { key: 'TALENT', label: 'Talent & Freelancers', icon: Award },
  { key: 'CLIENT', label: 'Clients & Hiring', icon: Briefcase },
  { key: 'SCOUT', label: 'Scouts & Referrals', icon: Compass },
  { key: 'PRO', label: 'Refeir Pro', icon: Crown }
];

const QUICK_SEARCH_CHIPS = [
  'Escrow',
  'Withdraw',
  'Verify',
  'Dispute',
  'Airfee',
  'Pro'
];

const SUPPORT_CARDS = [
  {
    key: 'escrow',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Client and talent reviewing milestone deliverables',
    tag: 'Trust Vault',
    title: 'Escrow & Milestone Protection',
    desc: 'Understand how funds are held securely in escrow and released upon milestone approval across 54 countries.',
    cta: 'View pricing & fees',
    path: '/pricing',
    featured: false
  },
  {
    key: 'dispatch',
    image: '/african_woman_headset.jpg',
    imageAlt: 'Refeir 24/7 support specialist assisting a user',
    tag: '24/7 Live Desk',
    title: 'Pan-African Support Dispatch',
    desc: 'Need help with a payout, verification, or account access? Reach a human specialist in under 15 minutes.',
    cta: 'Contact support',
    path: '/contact',
    featured: true
  },
  {
    key: 'disputes',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Mediation specialists reviewing project records',
    tag: 'Fair Mediation',
    title: 'Dispute Resolution Center',
    desc: 'Every milestone includes structured mediation backed by git commits, chat logs, and deliverable records.',
    cta: 'Open dispute center',
    path: '/disputes',
    featured: false
  }
];

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate = () => {} }) => {
  const [activeCategory, setActiveCategory] = useState<HelpRoleCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<{
    role: string;
    sectionTitle: string;
    article: HelpTopicArticle;
  } | null>(null);
  const [selectedSectionModal, setSelectedSectionModal] = useState<{
    role: string;
    section: HelpCategorySection;
  } | null>(null);

  const allArticlesList = useMemo(() => {
    const list: {
      role: HelpRoleCategory;
      roleLabel: string;
      sectionId: string;
      sectionTitle: string;
      article: HelpTopicArticle;
    }[] = [];

    (Object.keys(HELP_DIRECTORIES) as (keyof typeof HELP_DIRECTORIES)[]).forEach((roleKey) => {
      const dir = HELP_DIRECTORIES[roleKey];
      dir.sections.forEach((section) => {
        section.articles.forEach((art) => {
          list.push({
            role: roleKey,
            roleLabel: dir.roleLabel,
            sectionId: section.id,
            sectionTitle: section.title,
            article: art
          });
        });
      });
    });

    return list;
  }, []);

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();

    return allArticlesList.filter((item) => {
      const matchesCategory = activeCategory === 'ALL' || item.role === activeCategory;
      const matchesSearch =
        item.article.title.toLowerCase().includes(query) ||
        item.article.summary.toLowerCase().includes(query) ||
        item.sectionTitle.toLowerCase().includes(query) ||
        item.roleLabel.toLowerCase().includes(query) ||
        (item.article.steps && item.article.steps.some((s) => s.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, allArticlesList]);

  const currentDirectories = useMemo(() => {
    if (activeCategory === 'ALL') {
      return Object.values(HELP_DIRECTORIES);
    }
    return [HELP_DIRECTORIES[activeCategory]];
  }, [activeCategory]);

  const popularArticles = useMemo(() => {
    const pool =
      activeCategory === 'ALL'
        ? allArticlesList
        : allArticlesList.filter((a) => a.role === activeCategory);
    return pool.slice(0, 6);
  }, [activeCategory, allArticlesList]);

  return (
    <div className="rf-hp-page">
      {/* Split Hero with Search & Photo */}
      <section className="rf-hp-hero-wrap">
        <div className="rf-hp-hero-bg" aria-hidden="true" />
        <div className="rf-hp-hero">
          <div className="rf-hp-hero-copy">
            <div className="rf-hp-eyebrow">
              <Headphones size={14} /> Help &amp; Support Center
            </div>
            <h1 className="rf-hp-title">
              How can we <span className="rf-hp-title-accent">help you</span> today?
            </h1>
            <div className="rf-hp-subtitle">
              Search step-by-step guides for talent, clients, scouts, and Refeir Pro—or connect directly with our 24/7 support desk.
            </div>

            <div className="rf-hp-search-box">
              <Search size={18} className="rf-hp-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search escrow, payouts, verification, disputes..."
                aria-label="Search help articles"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="rf-hp-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="rf-hp-chips">
              <span>Popular:</span>
              {QUICK_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="rf-hp-hero-media">
            <div className="rf-hp-hero-frame">
              <img
                src="/help_center_hero.jpg"
                alt="Refeir Help and Support Center"
                className="rf-hp-hero-photo"
              />
              <div className="rf-hp-floating-card">
                <img
                  src="/african_woman_headset.jpg"
                  alt="Refeir Support Specialist"
                  className="rf-hp-floating-avatar"
                />
                <div className="rf-hp-floating-text">
                  <strong>24/7 Pan-African Support</strong>
                  <span><Clock size={13} /> Median reply under 15 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Filter Tabs */}
      <section className="rf-hp-section rf-hp-tabs-section">
        <div className="rf-hp-tabs" role="tablist" aria-label="Help categories by role">
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeCategory === tab.key}
                className={activeCategory === tab.key ? 'is-active' : ''}
                onClick={() => setActiveCategory(tab.key)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search Results OR Category Directories */}
      {filteredSearchResults ? (
        <section className="rf-hp-section rf-hp-directory-section">
          <div className="rf-hp-search-head">
            <div>
              <h2>Search results for &ldquo;{searchQuery}&rdquo;</h2>
              <p>{filteredSearchResults.length} {filteredSearchResults.length === 1 ? 'article' : 'articles'} found</p>
            </div>
            <button type="button" className="rf-hp-btn-ghost" onClick={() => setSearchQuery('')}>
              Clear search
            </button>
          </div>

          {filteredSearchResults.length === 0 ? (
            <div className="rf-hp-empty">
              <BookOpen size={32} />
              <h3>No matching articles found</h3>
              <p>Try a different keyword or reach out to our 24/7 support desk directly.</p>
              <button type="button" className="rf-hp-btn-primary" onClick={() => onNavigate('/contact')}>
                Contact support <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="rf-hp-results-grid">
              {filteredSearchResults.map((item, idx) => (
                <button
                  key={`${item.sectionId}-${idx}`}
                  type="button"
                  className="rf-hp-result-card"
                  onClick={() =>
                    setSelectedArticle({
                      role: item.roleLabel,
                      sectionTitle: item.sectionTitle,
                      article: item.article
                    })
                  }
                >
                  <div className="rf-hp-result-meta">
                    <span className="rf-hp-role-pill">{item.roleLabel}</span>
                    <span className="rf-hp-sec-name">{item.sectionTitle}</span>
                  </div>
                  <h3>{item.article.title}</h3>
                  <p>{item.article.summary}</p>
                  <span className="rf-hp-read-link">
                    Read guide <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="rf-hp-section rf-hp-directory-section">
          {currentDirectories.map((dir) => (
            <div key={dir.role} className="rf-hp-role-block">
              <div className="rf-hp-role-head">
                <div>
                  <div className="rf-hp-kicker">{dir.role} Guide</div>
                  <h2 className="rf-hp-h2">{dir.roleLabel}</h2>
                  <p className="rf-hp-role-desc">{dir.description}</p>
                </div>
              </div>

              <div className="rf-hp-cat-grid">
                {dir.sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.id} className="rf-hp-cat-card">
                      <div className="rf-hp-cat-top">
                        <div className="rf-hp-icon">
                          <Icon size={20} />
                        </div>
                        <span className="rf-hp-count">
                          {section.articles.length} {section.articles.length === 1 ? 'article' : 'articles'}
                        </span>
                      </div>

                      <h3 className="rf-hp-cat-title">{section.title}</h3>
                      <p className="rf-hp-cat-desc">{section.description}</p>

                      <ul className="rf-hp-article-links">
                        {section.articles.slice(0, 3).map((art) => (
                          <li key={art.title}>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedArticle({
                                  role: dir.roleLabel,
                                  sectionTitle: section.title,
                                  article: art
                                })
                              }
                            >
                              <span>{art.title}</span>
                              <ChevronRight size={15} />
                            </button>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className="rf-hp-see-all"
                        onClick={() =>
                          setSelectedSectionModal({
                            role: dir.roleLabel,
                            section
                          })
                        }
                      >
                        See all {section.articles.length} articles <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Visual Support Channels with Photos */}
      <section className="rf-hp-section">
        <div className="rf-hp-section-head">
          <div className="rf-hp-kicker">Support &amp; Safety</div>
          <h2 className="rf-hp-h2">Built-in protection at every step</h2>
          <div className="rf-hp-section-sub">
            Direct access to escrow documentation, dispute mediation, and live support specialists.
          </div>
        </div>

        <div className="rf-hp-photo-grid">
          {SUPPORT_CARDS.map((card) => (
            <div
              key={card.key}
              className={`rf-hp-photo-card${card.featured ? ' is-featured' : ''}`}
            >
              <div className="rf-hp-photo-media">
                <img src={card.image} alt={card.imageAlt} loading="lazy" />
                <span className="rf-hp-media-pill">{card.tag}</span>
              </div>
              <div className="rf-hp-photo-body">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <button
                  type="button"
                  className={card.featured ? 'rf-hp-btn-primary' : 'rf-hp-btn-ghost'}
                  onClick={() => onNavigate(card.path)}
                >
                  {card.cta} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Quick-Start Guides */}
      <section className="rf-hp-section">
        <div className="rf-hp-section-head">
          <div className="rf-hp-kicker">Quick Start</div>
          <h2 className="rf-hp-h2">Popular step-by-step guides</h2>
        </div>

        <div className="rf-hp-popular-grid">
          {popularArticles.map((item, idx) => (
            <button
              key={`${item.sectionId}-pop-${idx}`}
              type="button"
              className="rf-hp-popular-item"
              onClick={() =>
                setSelectedArticle({
                  role: item.roleLabel,
                  sectionTitle: item.sectionTitle,
                  article: item.article
                })
              }
            >
              <div className="rf-hp-popular-text">
                <span className="rf-hp-popular-meta">{item.roleLabel} · {item.sectionTitle}</span>
                <strong>{item.article.title}</strong>
              </div>
              <ChevronRight size={18} className="rf-hp-popular-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* Bottom Support Dispatch Banner */}
      <section className="rf-hp-section">
        <div className="rf-hp-cta-banner">
          <div className="rf-hp-cta-left">
            <img
              src="/african_woman_headset.jpg"
              alt="Refeir Support Specialist"
              className="rf-hp-cta-avatar"
              loading="lazy"
            />
            <div>
              <h3>Still can&apos;t find what you&apos;re looking for?</h3>
              <p>
                Our 24/7 Pan-African support dispatch is ready to help with payments, verification, and dispute mediation.
              </p>
            </div>
          </div>
          <div className="rf-hp-cta-actions">
            <button type="button" className="rf-hp-cta-primary" onClick={() => onNavigate('/contact')}>
              <MessageCircle size={16} /> Contact support
            </button>
            <button type="button" className="rf-hp-cta-ghost" onClick={() => onNavigate('/disputes')}>
              <ShieldCheck size={16} /> Dispute center
            </button>
          </div>
        </div>
      </section>

      {/* Modal 1: Single Article Detail */}
      {selectedArticle && (
        <div
          className="rf-hp-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedArticle(null)}
        >
          <div className="rf-hp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rf-hp-modal-head">
              <div className="rf-hp-modal-crumb">
                <span>{selectedArticle.role}</span>
                <span>/</span>
                <span>{selectedArticle.sectionTitle}</span>
              </div>
              <button
                type="button"
                className="rf-hp-modal-close"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="rf-hp-modal-title">{selectedArticle.article.title}</h2>
            <p className="rf-hp-modal-summary">{selectedArticle.article.summary}</p>

            {selectedArticle.article.steps && selectedArticle.article.steps.length > 0 && (
              <div className="rf-hp-steps-box">
                <div className="rf-hp-steps-label">Step-by-step instructions</div>
                <ol className="rf-hp-steps-list">
                  {selectedArticle.article.steps.map((step, sIdx) => (
                    <li key={sIdx}>
                      <span className="rf-hp-step-num">{sIdx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {selectedArticle.article.tips && (
              <div className="rf-hp-tip">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Refeir Tip:</strong> {selectedArticle.article.tips}
                </div>
              </div>
            )}

            <div className="rf-hp-modal-foot">
              {selectedArticle.article.actionUrl ? (
                <button
                  type="button"
                  className="rf-hp-btn-primary"
                  onClick={() => {
                    const url = selectedArticle.article.actionUrl!;
                    setSelectedArticle(null);
                    onNavigate(url);
                  }}
                >
                  {selectedArticle.article.actionLabel || 'Open in Refeir'} <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="rf-hp-btn-primary"
                  onClick={() => setSelectedArticle(null)}
                >
                  Got it
                </button>
              )}
              <button
                type="button"
                className="rf-hp-btn-ghost"
                onClick={() => {
                  setSelectedArticle(null);
                  onNavigate('/contact');
                }}
              >
                Need more help?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Section All-Articles Directory */}
      {selectedSectionModal && (
        <div
          className="rf-hp-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedSectionModal(null)}
        >
          <div className="rf-hp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rf-hp-modal-head">
              <div className="rf-hp-modal-crumb">
                <span>{selectedSectionModal.role}</span>
                <span>/</span>
                <span>{selectedSectionModal.section.title}</span>
              </div>
              <button
                type="button"
                className="rf-hp-modal-close"
                onClick={() => setSelectedSectionModal(null)}
                aria-label="Close section"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="rf-hp-modal-title">{selectedSectionModal.section.title}</h2>
            <p className="rf-hp-modal-summary">{selectedSectionModal.section.description}</p>

            <div className="rf-hp-modal-list">
              {selectedSectionModal.section.articles.map((art) => (
                <button
                  key={art.title}
                  type="button"
                  className="rf-hp-modal-article-btn"
                  onClick={() => {
                    const role = selectedSectionModal.role;
                    const sectionTitle = selectedSectionModal.section.title;
                    setSelectedSectionModal(null);
                    setSelectedArticle({ role, sectionTitle, article: art });
                  }}
                >
                  <div>
                    <strong>{art.title}</strong>
                    <span>{art.summary}</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
