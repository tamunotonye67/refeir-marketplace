import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  BookOpen,
  ArrowRight,
  Clock,
  User,
  Zap,
  Search,
  Bookmark,
  Share2,
  ThumbsUp,
  Tag,
  Calendar,
  ChevronRight,
  X,
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface BlogPageProps {
  onNavigate?: (path: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  tag: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  excerpt: string;
  color: string;
  image: string;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  content: string[];
  keyTakeaways: string[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate = () => {} }) => {
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'How Refeir Scouts Are Earning ₦500K+ Per Month from Referrals',
      tag: 'Scout Network',
      author: 'Refeir Editorial',
      authorRole: 'Marketplace Insights',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      date: 'Aug 10, 2026',
      readTime: '5 min read',
      excerpt: 'We sat down with three of our top-earning scouts to understand exactly how they turn their professional networks into reliable passive income on Refeir.',
      color: 'var(--rf-leaf-green)',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      likes: 142,
      isLiked: false,
      isBookmarked: false,
      keyTakeaways: [
        'Guaranteed 10% minimum attribution on every milestone approved.',
        'Pre-vetted African talent profiles remove client onboarding resistance.',
        'Multi-currency escrow guarantees swift cross-border scout commissions.'
      ],
      content: [
        'Across Africa, tens of thousands of top-tier software engineers, product designers, and AI specialists are capable of delivering enterprise-grade solutions to global clients. However, access to global opportunities has historically been constrained by disintermediation fears and fragmented payment rails.',
        'Refeir’s Scout Referral System solves this by giving industry connectors and senior tech leaders a formal, cryptographically attributed role. When a scout introduces a client or talent, every subsequent contract milestone earned within that attribution window generates a minimum 10% cash commission.',
        'In our interviews with scouts based in Lagos, Nairobi, and Accra, the secret to hitting monthly revenues exceeding ₦500,000 lies in presenting verified talent portfolios alongside Refeir’s Escrow Protection guarantee.'
      ]
    },
    {
      id: '2',
      title: 'Why African Talent Deserves Guaranteed Payment — Not Hope',
      tag: 'Thought Leadership',
      author: 'Tonye Taylor',
      authorRole: 'Founder & CEO',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      date: 'Aug 5, 2026',
      readTime: '7 min read',
      excerpt: 'For too long, African freelancers have been forced to work on trust and prayer. Refeir\'s escrow-first model changes that permanently.',
      color: '#7DA2FF',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      likes: 218,
      isLiked: false,
      isBookmarked: false,
      keyTakeaways: [
        '100% pre-funded milestones before work begins.',
        'Independent 72-hour dispute arbitration tribunals.',
        'Zero risk of international chargeback scams.'
      ],
      content: [
        'The international freelance marketplace has historically treated African professionals with structural asymmetry. Developers deliver world-class microservices, only to experience payment delays, arbitrary account freezes, or outright ghosting.',
        'At Refeir, we established an unconditional rule: no talent touches a codebase until the milestone funds are locked in the Refeir Escrow Vault. This fundamental shift guarantees that deliverable completion equals guaranteed payment.'
      ]
    },
    {
      id: '3',
      title: 'Building a Cross-Border Product Team from Lagos to Nairobi',
      tag: 'Case Study',
      author: 'David Kamau',
      authorRole: 'VP of Engineering, SafariPay',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      date: 'Jul 28, 2026',
      readTime: '6 min read',
      excerpt: 'SafariPay shares how they hired 4 senior engineers and a product designer across 3 African countries in under 2 weeks using Refeir.',
      color: '#F4B942',
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80',
      likes: 95,
      isLiked: false,
      isBookmarked: false,
      keyTakeaways: [
        'Distributed engineering across Nigeria, Kenya, and Ghana in 14 days.',
        'Unified multi-currency contracts settling in KES and NGN.',
        '40% faster time-to-market compared to legacy recruitment agencies.'
      ],
      content: [
        'When SafariPay initiated its cross-border remittances architecture, assembling a full-stack distributed team was our highest priority. Traditional agencies quoted 6 to 10 weeks of vetting with 25% placement markups.',
        'Through Refeir, our tech leads browsed verified portfolios, reviewed live git commits, and finalized milestone contracts within 48 hours.'
      ]
    },
    {
      id: '4',
      title: 'The 54 Country Vision: Refeir\'s Roadmap to Pan-African Coverage',
      tag: 'Company News',
      author: 'Refeir Editorial',
      authorRole: 'Platform Strategy',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      date: 'Jul 20, 2026',
      readTime: '4 min read',
      excerpt: 'We\'re now live in 12 African markets with payment rails operational. Here\'s our phased plan to reach all 54 sovereign nations by 2027.',
      color: 'var(--rf-mint)',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      likes: 180,
      isLiked: false,
      isBookmarked: false,
      keyTakeaways: [
        'Direct local settlement via M-Pesa, MTN MoMo, Airtel Money, and NGN rails.',
        'Integration with sovereign biometric registries across ECOWAS and EAC.',
        'Pan-African developer hub expansion in Kigali, Dakar, and Cairo.'
      ],
      content: [
        'Africa is not a monolith. Connecting talent in Francophone West Africa with enterprise clients in East Africa and North America requires deeply localized settlement rails and multi-language support.',
        'Refeir is actively deploying local currency rails across 12 countries with the ultimate vision of full 54-nation sovereignty by 2027.'
      ]
    },
    {
      id: '5',
      title: 'KYC & Identity Verification: How We Keep the Network Trusted',
      tag: 'Trust & Safety',
      author: 'Wanjiku Kamau',
      authorRole: 'Head of Trust & Safety',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      date: 'Jul 12, 2026',
      readTime: '5 min read',
      excerpt: 'A deep dive into our multi-tier identity verification process — government ID, biometric liveness, and professional portfolio validation.',
      color: '#FF6B6B',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      likes: 133,
      isLiked: false,
      isBookmarked: false,
      keyTakeaways: [
        'Tier 2 OCR Document Matching verifies National ID and Passports instantly.',
        '3D Facial Liveness prevents identity spoofing and bot infiltration.',
        'Zero tolerance for off-platform disintermediation protects scout attribution.'
      ],
      content: [
        'Trust is the currency of distributed marketplaces. On Refeir, every talent and scout completes a rigorous 4-factor sovereign biometric audit.',
        'Combined with real-time Data Loss Prevention (DLP) neural monitoring, clients and talents interact in a fully protected, authenticated ecosystem.'
      ]
    },
    {
      id: '6',
      title: 'Freelancing in Nigeria in 2026: Opportunities, Platforms, and Protections',
      tag: 'Resources',
      author: 'Amaka Nwosu',
      authorRole: 'Community Lead, Lagos Guild',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      date: 'Jul 2, 2026',
      readTime: '8 min read',
      excerpt: 'A comprehensive guide for Nigerian freelancers looking to access international clients while keeping their earnings secure and protected.',
      color: 'var(--rf-leaf-green)',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      likes: 167,
      isLiked: false,
      isBookmarked: false,
      keyTakeaways: [
        'Setting hourly rates in USD while withdrawing directly to Nigerian Naira.',
        'How to avoid high currency conversion spreads using Refeir Multi-Currency Wallets.',
        'Leveraging local scout networks for high-ticket contract intros.'
      ],
      content: [
        'Nigerian developers and designers represent one of the fastest-growing tech talent pools in the world. However, navigating currency volatility and international banking barriers remains a hurdle.',
        'This guide covers how to set competitive international rates, structure deliverables in milestone phases, and protect earnings using Refeir’s multi-currency escrow.'
      ]
    }
  ]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      })
    );
  };

  const handleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const isBookmarked = !p.isBookmarked;
          showToast(isBookmarked ? 'Article Bookmarked' : 'Bookmark Removed', isBookmarked ? 'Saved to your reading list.' : 'Removed from reading list.', 'INFO');
          return { ...p, isBookmarked };
        }
        return p;
      })
    );
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterEmail('');
    showToast('Subscribed to Refeir Blog!', 'You will receive weekly Pan-African tech and scout insights.', 'SUCCESS');
  };

  const filteredPosts = posts.filter(post => {
    const matchesTag = selectedTag === 'ALL' || post.tag.toLowerCase() === selectedTag.toLowerCase();
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--rf-dark-green)', padding: '2.5rem 1rem 6rem' }}>
      <div className="rf-container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <BookOpen size={16} />
            <span>INSIGHTS & STORIES</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--rf-cream)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Refeir <span style={{ color: 'var(--rf-leaf-green)' }}>Editorial Blog</span>
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '640px', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Scout referral playbooks, engineering deep-dives, African talent market insights, and blueprints for building high-velocity cross-border teams.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="rf-card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
            <input
              type="text"
              placeholder="Search articles by title, scout tactics, tech stacks, or author..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 'var(--rf-radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--rf-navy-border)',
                color: 'var(--rf-cream)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Tags Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {['ALL', 'Scout Network', 'Thought Leadership', 'Case Study', 'Company News', 'Trust & Safety', 'Resources'].map(tag => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '20px',
                    background: isActive ? 'var(--rf-leaf-green)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? 'var(--rf-dark-green)' : 'var(--rf-slate-300)',
                    border: isActive ? '1px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tag === 'ALL' ? 'All Articles' : tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post (if matching filter) */}
        {filteredPosts.length > 0 && selectedTag === 'ALL' && !searchQuery && (
          <div
            onClick={() => setSelectedArticle(filteredPosts[0])}
            className="rf-card"
            style={{
              padding: '2rem',
              marginBottom: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: '2rem',
              alignItems: 'center',
              cursor: 'pointer',
              border: '1.5px solid rgba(102, 187, 42, 0.35)',
              background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.08) 0%, rgba(7, 23, 14, 0.95) 100%)'
            }}
          >
            <div>
              <span style={{ display: 'inline-block', background: 'rgba(102,187,42,0.15)', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '100px', marginBottom: '0.85rem', textTransform: 'uppercase' }}>
                ⭐ Featured Story
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)', lineHeight: 1.25, marginBottom: '0.85rem' }}>
                {filteredPosts[0].title}
              </h2>
              <p style={{ color: 'var(--rf-slate-300)', lineHeight: 1.6, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
                {filteredPosts[0].excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={14} color="var(--rf-leaf-green)" /> {filteredPosts[0].author}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} color="var(--rf-leaf-green)" /> {filteredPosts[0].readTime}</span>
              </div>
              <button className="rf-btn rf-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
                <span>Read Full Article</span>
                <ArrowRight size={15} />
              </button>
            </div>
            <div style={{ borderRadius: 'var(--rf-radius-lg)', overflow: 'hidden', height: '260px', position: 'relative' }}>
              <img src={filteredPosts[0].image} alt={filteredPosts[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {filteredPosts.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedArticle(post)}
              className="rf-card"
              style={{
                overflow: 'hidden',
                padding: 0,
                cursor: 'pointer',
                border: '1px solid var(--rf-navy-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: post.color, background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                      {post.tag}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={post.authorAvatar} alt={post.author} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', fontWeight: 600 }}>{post.author}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    style={{ background: 'none', border: 'none', color: post.isLiked ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <ThumbsUp size={13} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={(e) => handleBookmark(post.id, e)}
                    style={{ background: 'none', border: 'none', color: post.isBookmarked ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)', cursor: 'pointer' }}
                    title="Bookmark Article"
                  >
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div
          className="rf-card"
          style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.1) 0%, rgba(7, 23, 14, 0.95) 100%)',
            border: '1.5px solid rgba(102, 187, 42, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Mail size={20} color="var(--rf-leaf-green)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Get Pan-African Tech & Scout Insights
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
              Join 12,000+ African founders, senior engineers, and referral scouts receiving our weekly dispatch on cross-border hiring and escrow innovations.
            </p>
          </div>

          <form onSubmit={handleSubscribeNewsletter} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '420px' }}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--rf-radius-md)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--rf-navy-border)',
                color: 'var(--rf-cream)',
                fontSize: '0.875rem'
              }}
            />
            <button
              type="submit"
              className="rf-btn rf-btn-primary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
            >
              <Send size={15} />
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </div>

      {/* ================= FULL ARTICLE VIEWER MODAL ================= */}
      {selectedArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="rf-card"
            style={{
              width: '780px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              background: '#07160D',
              border: '1.5px solid rgba(102, 187, 42, 0.4)',
              borderRadius: 'var(--rf-radius-xl)',
              animation: 'fadeIn 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: selectedArticle.color, background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.65rem', borderRadius: '100px', display: 'inline-block', marginBottom: '0.5rem' }}>
                  {selectedArticle.tag}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)', lineHeight: 1.3, margin: 0 }}>
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={selectedArticle.authorAvatar} alt={selectedArticle.author} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--rf-leaf-green)' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{selectedArticle.author}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{selectedArticle.authorRole} • {selectedArticle.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={(e) => handleLike(selectedArticle.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: selectedArticle.isLiked ? 'rgba(102, 187, 42, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(102, 187, 42, 0.3)',
                    color: selectedArticle.isLiked ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--rf-radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 700
                  }}
                >
                  <ThumbsUp size={14} />
                  <span>{selectedArticle.likes}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Link Copied', 'Article link copied to clipboard.', 'INFO');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--rf-slate-300)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--rf-radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem'
                  }}
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 'var(--rf-radius-lg)', marginBottom: '1.5rem' }}
            />

            {/* Key Takeaways Box */}
            <div style={{ padding: '1.25rem', background: 'rgba(102, 187, 42, 0.08)', borderRadius: 'var(--rf-radius-md)', borderLeft: '4px solid var(--rf-leaf-green)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={16} />
                <span>Key Takeaways</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--rf-slate-200)' }}>
                {selectedArticle.keyTakeaways.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Content Paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9375rem', color: 'var(--rf-slate-200)', lineHeight: 1.7 }}>
              {selectedArticle.content.map((p, idx) => (
                <p key={idx} style={{ margin: 0 }}>{p}</p>
              ))}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedArticle(null)}
                className="rf-btn rf-btn-primary"
                style={{ padding: '0.65rem 1.5rem' }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
