import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, MapPin, Star, Briefcase, ShieldCheck, Compass, Share2 } from 'lucide-react';
import { TalentProfile } from '../../types';
import { formatMoney } from '../../data/currencies';
import { TALENT_SUB_CATEGORIES, TalentSubCategory } from '../../data/subCategories';

export interface RecruiterCategory {
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  count: string;
  query: string;
}

interface TalentCategoryExplorerProps {
  categories: RecruiterCategory[];
  talentList: TalentProfile[];
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
}

const MAX_TALENTS = 5;

/** Scores a talent against a keyword list using skills + headline. */
function scoreTalent(talent: TalentProfile, keywords: string[]): number {
  const skills = talent.skills.map(s => s.toLowerCase());
  const headline = talent.headline.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (skills.some(s => s.includes(k))) score += 2;
    else if (headline.includes(k)) score += 1;
  }
  return score;
}

/** Returns matching talents, falling back to category-level and top-rated so the grid is never empty. */
function matchTalents(
  talentList: TalentProfile[],
  sub: TalentSubCategory,
  categoryKeywords: string[]
): TalentProfile[] {
  const rank = (keywords: string[]) =>
    talentList
      .map(t => ({ t, s: scoreTalent(t, keywords) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s || b.t.rating - a.t.rating)
      .map(x => x.t);

  const picked: TalentProfile[] = [];
  const add = (list: TalentProfile[]) => {
    for (const t of list) {
      if (picked.length >= MAX_TALENTS) return;
      if (!picked.some(p => p.id === t.id)) picked.push(t);
    }
  };
  add(rank(sub.keywords));
  add(rank(categoryKeywords));
  add([...talentList].sort((a, b) => b.rating - a.rating));
  return picked;
}

export const TalentCategoryExplorer: React.FC<TalentCategoryExplorerProps> = ({
  categories,
  talentList,
  onNavigate,
  onSelectTalent,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const subCategories = activeCategory ? TALENT_SUB_CATEGORIES[activeCategory] || [] : [];
  const activeSub = subCategories.find(s => s.id === activeSubId) || subCategories[0];
  const categoryMeta = categories.find(c => c.name === activeCategory);

  const categoryKeywords = useMemo(
    () => subCategories.flatMap(s => s.keywords),
    [subCategories]
  );

  // Pre-compute matches for every sub-category (used for stacked avatars + talent grid)
  const matchesBySub = useMemo(() => {
    const map: Record<string, TalentProfile[]> = {};
    for (const sub of subCategories) map[sub.id] = matchTalents(talentList, sub, categoryKeywords);
    return map;
  }, [subCategories, talentList, categoryKeywords]);

  const talents = activeSub ? matchesBySub[activeSub.id] || [] : [];

  const handleCategoryClick = (name: string) => {
    if (activeCategory === name) {
      setActiveCategory(null);
      setActiveSubId(null);
      return;
    }
    setActiveCategory(name);
    setActiveSubId(TALENT_SUB_CATEGORIES[name]?.[0]?.id ?? null);
  };

  // Gently bring the panel into view when a category is opened
  useEffect(() => {
    if (!activeCategory || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.75) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeCategory]);

  return (
    <>
      <div className="rf-grid-5 rf-talent-categories-slider" style={{ gap: '1rem' }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <div
              key={cat.name}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onClick={() => handleCategoryClick(cat.name)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(cat.name);
                }
              }}
              className={`rf-talent-cat-card${isActive ? ' is-active' : ''}`}
            >
              <div className="rf-cat-icon-box">
                <Icon size={19} className="rf-cat-icon" />
              </div>
              <h3 className="rf-cat-title">{cat.name}</h3>
              <div className="rf-cat-count">{cat.count}</div>
              <div className="rf-cat-action">
                <span>{isActive ? 'Hide specialties' : 'Browse available'}</span>
                {isActive ? <ChevronDown size={12} /> : <ArrowRight size={12} />}
              </div>
            </div>
          );
        })}
      </div>

      {activeCategory && activeSub && (
        <div ref={panelRef} key={activeCategory} className="rf-cat-explorer-panel">
          <div className="rf-cat-explorer-head">
            <div>
              <div className="rf-cat-explorer-eyebrow">
                <Compass size={13} /> Specialties in {activeCategory}
              </div>
              <h3 className="rf-cat-explorer-title">Pick a specialty to hire, refer (10%), or join as talent</h3>
            </div>
            {categoryMeta && (
              <div className="rf-cat-explorer-actions">
                <button
                  type="button"
                  className="rf-cat-explorer-mode-btn"
                  onClick={() => onNavigate(`/subcategories/${activeSub.id}?mode=scout`)}
                >
                  <Share2 size={13} /> Scout & Earn 10%
                </button>
                <button
                  type="button"
                  className="rf-cat-explorer-mode-btn"
                  onClick={() => onNavigate(`/subcategories/${activeSub.id}?mode=talent`)}
                >
                  <Briefcase size={13} /> Open Bounties
                </button>
                <button
                  type="button"
                  className="rf-cat-explorer-link"
                  onClick={() => onNavigate(`/subcategories/${activeSub.id}`)}
                >
                  Explore {activeSub.name} <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Sub-category cards */}
          <div className="rf-subcat-grid">
            {subCategories.map(sub => {
              const selected = sub.id === activeSub.id;
              const avatars = (matchesBySub[sub.id] || []).slice(0, 3);
              return (
                <button
                  key={sub.id}
                  type="button"
                  className={`rf-subcat-card${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => {
                    if (selected) {
                      onNavigate(`/subcategories/${sub.id}`);
                    } else {
                      setActiveSubId(sub.id);
                    }
                  }}
                >
                  <span className="rf-subcat-name">{sub.name}</span>
                  <span className="rf-subcat-meta">
                    <span className="rf-subcat-count">{sub.count} available</span>
                    {selected && avatars.length > 0 && (
                      <span className="rf-subcat-avatars">
                        {avatars.map(a => (
                          <img key={a.id} src={a.avatar_url} alt="" loading="lazy" />
                        ))}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Talent profiles */}
          <div key={activeSub.id} className="rf-subcat-talent-grid">
            {talents.map(t => {
              const scoutReward = {
                amount_minor: Math.max(2500, Math.round(t.starting_price.amount_minor * 0.1)),
                currency: t.starting_price.currency,
              };
              return (
                <div key={t.id} className="rf-subcat-talent-card">
                  <div className="rf-subcat-talent-top">
                    <img className="rf-subcat-talent-avatar" src={t.avatar_url} alt={t.full_name} loading="lazy" />
                    <div style={{ minWidth: 0 }}>
                      <div className="rf-subcat-talent-name">
                        {t.full_name}
                        {(t.verification_status === 'IDENTITY_VERIFIED' || t.verification_status === 'PROFESSION_VERIFIED') && (
                          <ShieldCheck size={14} className="rf-subcat-verified" aria-label="Verified" />
                        )}
                      </div>
                      <div className="rf-subcat-talent-loc">
                        <MapPin size={12} /> {t.city}, {t.country_name}
                      </div>
                    </div>
                  </div>

                  <div className="rf-subcat-talent-stats">
                    <span className="rf-subcat-rate">From {formatMoney(t.starting_price)}</span>
                    <span><Star size={12} className="rf-subcat-star" /> {t.rating.toFixed(1)}</span>
                    <span><Briefcase size={12} /> {t.completed_projects} jobs</span>
                  </div>

                  <div className="rf-subcat-scout-tag">
                    <Share2 size={11} /> Scout 10% reward: {formatMoney(scoutReward)}+/milestone
                  </div>

                  <p className="rf-subcat-talent-bio">{t.headline}. {t.bio}</p>

                  <div className="rf-subcat-skills">
                    {t.skills.slice(0, 3).map(s => (
                      <span key={s} className="rf-subcat-skill">{s}</span>
                    ))}
                    {t.skills.length > 3 && <span className="rf-subcat-skill">+{t.skills.length - 3}</span>}
                  </div>

                  <div className="rf-subcat-btn-row">
                    <button type="button" className="rf-subcat-profile-btn" onClick={() => onSelectTalent(t)}>
                      See profile
                    </button>
                    <button
                      type="button"
                      className="rf-subcat-refer-btn"
                      onClick={() => onNavigate(`/talent/${t.id}?intent=scout`)}
                      title="Refer this specialist and earn 10% commission"
                    >
                      <Share2 size={12} /> Refer (10%)
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Blurred explore placeholder */}
            <div className="rf-subcat-talent-card rf-subcat-explore-card">
              <div className="rf-subcat-explore-ghost" aria-hidden="true">
                <div className="rf-subcat-talent-top">
                  <div className="rf-subcat-talent-avatar rf-ghost-block" />
                  <div style={{ flex: 1 }}>
                    <div className="rf-ghost-line" style={{ width: '60%' }} />
                    <div className="rf-ghost-line" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="rf-ghost-line" style={{ width: '90%' }} />
                <div className="rf-ghost-line" style={{ width: '75%' }} />
                <div className="rf-ghost-line" style={{ width: '50%' }} />
              </div>
              <div className="rf-subcat-explore-cta">
                <span className="rf-subcat-explore-count">{activeSub.count} {activeSub.name}</span>
                <button
                  type="button"
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  onClick={() => onNavigate(`/subcategories/${activeSub.id}`)}
                >
                  Explore {activeSub.name} <ArrowRight size={14} />
                </button>
                <div className="rf-subcat-explore-sublinks">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/subcategories/${activeSub.id}?mode=scout`)}
                  >
                    Scout & Earn 10%
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/subcategories/${activeSub.id}?mode=talent`)}
                  >
                    Work as Talent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
