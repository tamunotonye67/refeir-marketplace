import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  ArrowRight, ChevronDown, Check,
  Users, Zap, Award, Briefcase, Globe2, TrendingUp, Star, Shield,
  Code2, Palette, BarChart3, FlaskConical, Menu, X, Search,
  ExternalLink, CheckCircle2, AlertCircle, Clock, Sparkles,
  Layers, Compass, MapPin
} from 'lucide-react';

// ─── Official Refeir Brand Colors (Deep Green & Emerald Palette) ──────────────
const RF_DEEP_GREEN   = '#0F2E1E';   // Primary Sovereign Dark Green
const RF_DARK_GREEN   = '#122B1A';   // Secondary Dark Green
const RF_FOREST_DARK  = '#07180F';   // Deepest background
const RF_GREEN        = '#2E7D32';   // Core Refeir Green
const RF_LEAF_GREEN   = '#66BB2A';   // Vibrant Leaf Green
const RF_MINT_ACCENT  = '#18FC5C';   // Glowing Pioneer Mint Green
const RF_GOLD_YELLOW  = '#F6B21A';   // Refeir Golden Yellow
const RF_ORANGE       = '#F47C20';   // Refeir Vibrant Orange

// ─── Types ────────────────────────────────────────────────────────────────────
type AppStep = 1 | 2 | 3 | 4;
type AppStatus = 'idle' | 'submitting' | 'success' | 'error';
type PioneerReviewStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';

interface FormData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  city: string;
  roles: string[];
  skills: string;
  portfolioUrl: string;
  primaryDivision: string;
  contribution: string;
  availability: string;
  motivation: string;
  learningGoals: string;
  discoverySource: string;
  agreeEmployment: boolean;
  agreeConduct: boolean;
  agreeData: boolean;
}

const BLANK_FORM: FormData = {
  fullName: '', email: '', whatsappNumber: '', country: '', city: '',
  roles: [], skills: '', portfolioUrl: '',
  primaryDivision: '', contribution: '', availability: '',
  motivation: '', learningGoals: '', discoverySource: '',
  agreeEmployment: false, agreeConduct: false, agreeData: false,
};

const ROLES_LIST = [
  'Developer', 'Designer', 'Writer', 'Marketer', 'Business Developer',
  'Community Builder', 'Researcher', 'Product', 'QA', 'AI',
  'Freelancer', 'Student', 'Entrepreneur', 'Other'
];

const DIVISIONS_LIST = [
  { value: 'TECH_PRODUCT', label: 'Tech & Product' },
  { value: 'CREATIVE', label: 'Creative' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'COMMUNITY', label: 'Community' },
  { value: 'RESEARCH_TESTING', label: 'Research & Testing' },
];

const AVAILABILITY_OPTIONS = [
  '1–2 hours/week', '3–5 hours/week', '6–10 hours/week', '10+ hours/week', 'Project-based'
];

const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Cameroon', 'Chad', 'Ivory Coast',
  'Egypt', 'Ethiopia', 'Gambia', 'Ghana', 'Kenya', 'Liberia', 'Madagascar', 'Malawi',
  'Mali', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
  'Senegal', 'Sierra Leone', 'South Africa', 'Sudan', 'Tanzania', 'Togo', 'Tunisia',
  'Uganda', 'Zambia', 'Zimbabwe', 'Other'
].sort();

// ─── Network Canvas ──────────────────────────────────────────────────────────
const NetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    const FLOW_LABELS = ['PERSON', 'REFERRAL', 'OPPORTUNITY', 'TALENT', 'WORK', 'REWARD', 'GROWTH'];
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; label?: string }[] = [];

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const init = () => {
      nodes.length = 0;
      for (let i = 0; i < 34; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: i < 7 ? 5.5 : 2.5,
          label: i < 7 ? FLOW_LABELS[i] : undefined
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle Green connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 155) {
            const alpha = (1 - dist / 155) * 0.32;
            ctx.strokeStyle = `rgba(102, 187, 42, ${alpha})`;
            ctx.lineWidth = 0.95;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Glowing nodes
      for (const n of nodes) {
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5);
        glow.addColorStop(0, n.label ? 'rgba(102, 187, 42, 0.55)' : 'rgba(24, 252, 92, 0.2)');
        glow.addColorStop(1, 'rgba(102, 187, 42, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = n.label ? RF_MINT_ACCENT : 'rgba(102, 187, 42, 0.75)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        if (n.label) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.font = '700 9px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + 18);
        }

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      animRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);
    resize();
    init();
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

// ─── Smooth Scroll Helper ─────────────────────────────────────────────────────
const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ─── STATUS LOOKUP MODAL ──────────────────────────────────────────────────────
interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatusLookupModal: React.FC<StatusModalProps> = ({ isOpen, onClose }) => {
  const [appNumber, setAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [result, setResult] = useState<{
    status: PioneerReviewStatus;
    fullName: string;
    division?: string;
    isFounding?: boolean;
    pioneerId?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNumber.trim() && !email.trim()) return;

    setLookupState('loading');

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('pioneer_applications').select('status, full_name, primary_division, is_founding_100, pioneer_id');
        if (appNumber.trim()) {
          query = query.eq('application_number', appNumber.trim().toUpperCase());
        } else if (email.trim()) {
          query = query.eq('email', email.trim().toLowerCase());
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
          setLookupState('not_found');
        } else {
          setResult({
            status: data.status as PioneerReviewStatus,
            fullName: data.full_name,
            division: data.primary_division,
            isFounding: data.is_founding_100,
            pioneerId: data.pioneer_id
          });
          setLookupState('found');
        }
      } catch {
        setLookupState('not_found');
      }
    } else {
      setTimeout(() => {
        if (appNumber.toUpperCase().includes('ACC') || appNumber.toUpperCase().includes('100')) {
          setResult({
            status: 'ACCEPTED',
            fullName: 'Demo Pioneer',
            division: 'TECH_PRODUCT',
            isFounding: true,
            pioneerId: 'PION-042'
          });
          setLookupState('found');
        } else {
          setResult({
            status: 'PENDING',
            fullName: 'Applicant',
            division: 'CREATIVE',
            isFounding: false
          });
          setLookupState('found');
        }
      }, 700);
    }
  };

  const whatsappInvite = import.meta.env.VITE_WHATSAPP_INVITE_URL || 'https://chat.whatsapp.com/RefeirPioneersOfficial';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(7, 24, 15, 0.88)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div style={{
        background: `linear-gradient(145deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        border: `1px solid rgba(102, 187, 42, 0.35)`,
        borderRadius: 20, maxWidth: 520, width: '100%', padding: '36px 32px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, color: 'rgba(255,255,255,0.6)',
          background: 'rgba(255,255,255,0.06)', borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none'
        }}>
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Search size={18} color={RF_LEAF_GREEN} />
          <span style={{ fontSize: 11, fontWeight: 900, color: RF_LEAF_GREEN, letterSpacing: '0.2em' }}>
            ADMISSIONS PORTAL
          </span>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Check Application Status
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.6 }}>
          Enter your Application ID (e.g. <span style={{ color: RF_MINT_ACCENT, fontFamily: 'monospace' }}>RP-2026-XXXXXX</span>) to check your review status.
        </p>

        {lookupState !== 'found' ? (
          <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                Application Number
              </label>
              <input
                type="text"
                placeholder="RP-2026-XXXXXX"
                value={appNumber}
                onChange={e => setAppNumber(e.target.value)}
                style={{
                  width: '100%', padding: '13px 15px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', border: `1.5px solid rgba(102, 187, 42, 0.3)`,
                  color: '#FFFFFF', fontSize: 14, outline: 'none', fontFamily: 'monospace', textTransform: 'uppercase'
                }}
              />
            </div>

            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>— OR —</div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '13px 15px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', border: `1.5px solid rgba(102, 187, 42, 0.3)`,
                  color: '#FFFFFF', fontSize: 14, outline: 'none'
                }}
              />
            </div>

            {lookupState === 'not_found' && (
              <div style={{
                padding: '12px 14px', borderRadius: 8, background: 'rgba(244, 124, 32, 0.15)',
                border: `1px solid rgba(244, 124, 32, 0.4)`, color: '#FFB27D', fontSize: 13
              }}>
                No application found matching these details. Please verify your Application ID or email.
              </div>
            )}

            <button
              type="submit"
              disabled={lookupState === 'loading'}
              style={{
                marginTop: 8, background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 900,
                cursor: lookupState === 'loading' ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em', transition: 'all 0.2s'
              }}
            >
              {lookupState === 'loading' ? 'CHECKING...' : 'CHECK STATUS'}
            </button>
          </form>
        ) : (
          <div>
            {result?.status === 'ACCEPTED' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                <h4 style={{ fontSize: 20, fontWeight: 900, color: RF_MINT_ACCENT, marginBottom: 6 }}>
                  You're Officially a Refeir Pioneer!
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 20 }}>
                  Welcome aboard, <strong style={{ color: '#fff' }}>{result.fullName}</strong>! Your application has been approved into the Pioneer program.
                </p>

                {result.pioneerId && (
                  <div style={{
                    display: 'inline-block', padding: '6px 14px', borderRadius: 6,
                    background: `${RF_LEAF_GREEN}22`, border: `1px solid ${RF_LEAF_GREEN}55`,
                    color: RF_MINT_ACCENT, fontSize: 12, fontWeight: 800, fontFamily: 'monospace', marginBottom: 24
                  }}>
                    PIONEER ID: {result.pioneerId}
                  </div>
                )}

                <a
                  href={whatsappInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', background: RF_MINT_ACCENT, color: RF_DEEP_GREEN, padding: '16px', borderRadius: 10,
                    fontSize: 15, fontWeight: 900, letterSpacing: '0.04em', textDecoration: 'none'
                  }}
                >
                  <Users size={18} />
                  JOIN THE PIONEER WHATSAPP COMMUNITY
                  <ExternalLink size={15} />
                </a>

                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 14 }}>
                  This official invite link is restricted to approved Refeir Pioneers.
                </p>
              </div>
            ) : result?.status === 'PENDING' || result?.status === 'REVIEWING' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%', background: `${RF_GOLD_YELLOW}18`,
                  border: `2px solid ${RF_GOLD_YELLOW}44`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <Clock size={24} color={RF_GOLD_YELLOW} />
                </div>
                <div style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: 100,
                  background: `${RF_GOLD_YELLOW}20`, color: RF_GOLD_YELLOW, fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', marginBottom: 12
                }}>
                  {result?.status === 'REVIEWING' ? 'UNDER REVIEW' : 'PENDING REVIEW'}
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginBottom: 8 }}>
                  Application is Being Processed
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20 }}>
                  Thank you for applying, <strong style={{ color: '#fff' }}>{result.fullName}</strong>. The Refeir admissions team is currently reviewing your profile and skills for the Pioneer division.
                </p>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                  Accepted applicants receive private WhatsApp onboarding instructions upon review completion.
                </div>
              </div>
            ) : result?.status === 'WAITLISTED' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%', background: 'rgba(246, 178, 26, 0.15)',
                  border: `2px solid ${RF_GOLD_YELLOW}55`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <AlertCircle size={24} color={RF_GOLD_YELLOW} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: RF_GOLD_YELLOW, marginBottom: 8 }}>
                  Waitlisted for Next Cohort
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                  Your application has been placed on the Pioneer waitlist. As new project squads and Founding 100 slots open up, we will contact you directly.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
                  Application Status: Not Selected
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  Thank you for your interest in Refeir Pioneers. At this time we are unable to advance your application for this cohort.
                </p>
              </div>
            )}

            <button
              onClick={() => { setLookupState('idle'); setResult(null); }}
              style={{
                marginTop: 24, width: '100%', background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)', border: 'none', padding: '12px',
                borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}
            >
              Check Another Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const PioneersNav: React.FC<{ onNavigate: (path: string) => void; onOpenStatus: () => void }> = ({ onNavigate, onOpenStatus }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? `rgba(15, 46, 30, 0.96)` : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(102, 187, 42, 0.15)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72
      }}>
        {/* Brand Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          onClick={() => onNavigate('/')}
        >
          <img src="/Refeir-LogoWhite.png" alt="Refeir" style={{ height: 30, width: 'auto' }} />
          <span style={{
            fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: RF_MINT_ACCENT,
            padding: '3px 8px', border: `1px solid ${RF_LEAF_GREEN}44`, borderRadius: 4,
            background: `${RF_LEAF_GREEN}18`, textTransform: 'uppercase'
          }}>
            PIONEERS
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="p-desk-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            ['Pioneers', 'pioneers-about'],
            ['About Refeir', 'why-refeir'],
            ['Divisions', 'divisions'],
            ['How It Works', 'how-it-works'],
            ['FAQ', 'faq'],
          ].map(([label, id]) => (
            <button
              key={label}
              onClick={() => scrollToId(id)}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = RF_MINT_ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => onNavigate('/contact')}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = RF_MINT_ACCENT)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          >
            Contact
          </button>

          <button
            onClick={onOpenStatus}
            style={{
              background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(102, 187, 42, 0.35)`,
              color: '#FFFFFF', padding: '8px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = RF_MINT_ACCENT; e.currentTarget.style.background = `${RF_LEAF_GREEN}25`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(102, 187, 42, 0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <Search size={13} color={RF_MINT_ACCENT} />
            Check Status
          </button>

          <button
            onClick={() => scrollToId('apply')}
            style={{
              background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none', padding: '10px 22px',
              borderRadius: 8, fontSize: 13, fontWeight: 900, cursor: 'pointer',
              letterSpacing: '0.05em', transition: 'all 0.2s', boxShadow: `0 4px 16px ${RF_LEAF_GREEN}44`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 6px 22px ${RF_MINT_ACCENT}55`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = `0 4px 16px ${RF_LEAF_GREEN}44`;
            }}
          >
            BECOME A PIONEER
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="p-mob-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: '#FFFFFF', cursor: 'pointer', padding: 8
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: RF_DARK_GREEN, borderTop: '1px solid rgba(102, 187, 42, 0.2)',
          padding: '16px 24px 28px'
        }}>
          {[
            ['Pioneers', 'pioneers-about'],
            ['About Refeir', 'why-refeir'],
            ['Divisions', 'divisions'],
            ['How It Works', 'how-it-works'],
            ['FAQ', 'faq'],
          ].map(([label, id]) => (
            <button
              key={label}
              onClick={() => { scrollToId(id); setMobileMenuOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: 600,
                padding: '14px 0', cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => { onOpenStatus(); setMobileMenuOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
              background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
              color: RF_MINT_ACCENT, fontSize: 15, fontWeight: 700, padding: '14px 0', cursor: 'pointer'
            }}
          >
            <Search size={15} /> Check Application Status
          </button>

          <button
            onClick={() => { scrollToId('apply'); setMobileMenuOpen(false); }}
            style={{
              marginTop: 20, width: '100%', background: RF_LEAF_GREEN, color: RF_DEEP_GREEN,
              border: 'none', padding: '14px', borderRadius: 8, fontSize: 15,
              fontWeight: 900, cursor: 'pointer', letterSpacing: '0.04em'
            }}
          >
            BECOME A REFEIR PIONEER
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── HERO SECTION WITH VISUAL COMMUNITY SHOWCASE ──────────────────────────────
const HeroSection: React.FC = () => (
  <section id="hero" style={{
    minHeight: '100vh', background: `radial-gradient(ellipse 80% 80% at 50% -20%, ${RF_GREEN}33 0%, ${RF_DEEP_GREEN} 70%)`,
    position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: 88, paddingBottom: 60
  }}>
    {/* Network Canvas */}
    <div style={{ position: 'absolute', inset: 0, opacity: 0.65 }}>
      <NetworkCanvas />
    </div>

    {/* Refeir Brand Ambient Glow */}
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(circle at 80% 40%, ${RF_LEAF_GREEN}12 0%, transparent 60%),
                   radial-gradient(circle at 20% 80%, ${RF_GOLD_YELLOW}0a 0%, transparent 50%)`
    }} />

    <div style={{
      position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto',
      padding: '40px 24px', width: '100%'
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 56, alignItems: 'center'
      }}>
        {/* Left Column: Core Message */}
        <div>
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${RF_LEAF_GREEN}18`, border: `1px solid ${RF_LEAF_GREEN}44`,
            borderRadius: 100, padding: '6px 16px', marginBottom: 28
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: RF_MINT_ACCENT,
              animation: 'rp-pulse 2s infinite'
            }} />
            <span style={{ fontSize: 11, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '0.22em' }}>
              REFEIR PIONEERS • PUBLIC FRONT DOOR
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 900, lineHeight: 1.04,
            color: '#FFFFFF', letterSpacing: '-0.025em', marginBottom: 24,
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            DON'T JUST<br />
            JOIN REFEIR.<br />
            <span style={{
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 50%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              HELP BUILD IT.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(17px, 2.2vw, 21px)', color: 'rgba(255,255,255,0.9)',
            fontWeight: 600, marginBottom: 18, lineHeight: 1.5
          }}>
            Join the people helping build Africa's referral-powered freelance economy.
          </p>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8,
            marginBottom: 38, maxWidth: 560
          }}>
            Refeir is creating a new pathway for talent and opportunities to connect across Africa. Refeir Pioneers are the developers, designers, creators, marketers, community leaders and strategists building the platform before mainstream release.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => scrollToId('apply')}
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '16px 36px', borderRadius: 10, fontSize: 15, fontWeight: 900,
                cursor: 'pointer', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s', boxShadow: `0 8px 28px ${RF_LEAF_GREEN}44`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 36px ${RF_MINT_ACCENT}55`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = `0 8px 28px ${RF_LEAF_GREEN}44`;
              }}
            >
              BECOME A PIONEER <ArrowRight size={16} />
            </button>

            <button
              onClick={() => scrollToId('how-it-works')}
              style={{
                background: 'rgba(255,255,255,0.06)', color: '#FFFFFF',
                border: '1.5px solid rgba(102, 187, 42, 0.4)', padding: '16px 30px',
                borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                letterSpacing: '0.02em', transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = RF_MINT_ACCENT;
                e.currentTarget.style.background = 'rgba(102, 187, 42, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(102, 187, 42, 0.4)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
            >
              SEE HOW IT WORKS
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'flex', gap: 40, marginTop: 48, paddingTop: 32,
            borderTop: '1px solid rgba(102, 187, 42, 0.2)', flexWrap: 'wrap'
          }}>
            {[
              { val: 'EARLY', label: 'Community Stage' },
              { val: '6 SQUADS', label: 'Pioneer Divisions' },
              { val: '100 SEATS', label: 'Founding Pioneer Cohort' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '-0.01em' }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Community Showcase with African Builders Photography */}
        <div style={{ position: 'relative' }}>
          {/* Main Visual Image Card */}
          <div style={{
            background: `linear-gradient(160deg, ${RF_DARK_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
            border: `1.5px solid rgba(102, 187, 42, 0.35)`, borderRadius: 24,
            padding: 16, boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6)`
          }}>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 380 }}>
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80"
                alt="Refeir Pioneers Collaboration"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${RF_DEEP_GREEN} 0%, rgba(15, 46, 30, 0.4) 50%, transparent 100%)`
              }} />

              {/* Tag on Image */}
              <div style={{
                position: 'absolute', bottom: 16, left: 16, right: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
              }}>
                <div>
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                    background: RF_LEAF_GREEN, color: RF_DEEP_GREEN,
                    fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', marginBottom: 6
                  }}>
                    PAN-AFRICAN PIONEER SQUAD
                  </span>
                  <p style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 16, margin: 0 }}>
                    Building Africa's Freelance Escrow Protocol
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: RF_GOLD_YELLOW, fontSize: 12, fontWeight: 700 }}>
                  <MapPin size={13} />
                  <span>Pan-African</span>
                </div>
              </div>
            </div>

            {/* Floating Live Badge Top Right */}
            <div style={{
              position: 'absolute', top: -16, right: -12,
              background: `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, ${RF_DEEP_GREEN} 100%)`,
              border: `1.5px solid ${RF_GOLD_YELLOW}`, borderRadius: 16,
              padding: '12px 18px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: `${RF_GOLD_YELLOW}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: RF_GOLD_YELLOW
              }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: RF_GOLD_YELLOW, letterSpacing: '0.1em' }}>
                  FOUNDING PIONEER
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                  Cohorts 001 - 100
                </div>
              </div>
            </div>

            {/* Floating Live Badge Bottom Left */}
            <div style={{
              position: 'absolute', bottom: -20, left: -14,
              background: `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, ${RF_DEEP_GREEN} 100%)`,
              border: `1.5px solid ${RF_MINT_ACCENT}`, borderRadius: 16,
              padding: '12px 18px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: `${RF_LEAF_GREEN}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: RF_MINT_ACCENT
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: RF_MINT_ACCENT, letterSpacing: '0.1em' }}>
                  6 ACTIVE DIVISIONS
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>
                  Tech • Design • Growth • Community
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── WHY REFEIR (THE REFEIR FOUNDATION) ────────────────────────────────────────
const WhyRefeir: React.FC = () => (
  <section id="why-refeir" style={{ background: '#FFFFFF', padding: '100px 24px' }}>
    <div style={{
      maxWidth: 1240, margin: '0 auto',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 64, alignItems: 'center'
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 16 }}>
          WHY REFEIR?
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: RF_DARK_GREEN,
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          Africa is full of<br />talented people.
        </h2>
        <div style={{ width: 48, height: 4, background: RF_LEAF_GREEN, borderRadius: 2, marginBottom: 28 }} />

        <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.85, marginBottom: 14 }}>
          The challenge is not talent.
        </p>
        <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.85, marginBottom: 24 }}>
          Sometimes it is <strong style={{ color: RF_DEEP_GREEN }}>access.</strong>
        </p>

        {[
          'Access to high-paying client opportunities.',
          'Access to trusted cross-border escrow systems.',
          'Access to trusted professional networks.',
          'Access to people who can open the right doors.',
        ].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: RF_GREEN, flexShrink: 0 }} />
            <span style={{ fontSize: 15, color: '#1E293B', fontWeight: 600 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: `linear-gradient(145deg, ${RF_DEEP_GREEN} 0%, ${RF_DARK_GREEN} 100%)`,
        borderRadius: 24, padding: '44px 38px', boxShadow: '0 20px 50px rgba(15, 46, 30, 0.25)',
        border: `1px solid rgba(102, 187, 42, 0.25)`
      }}>
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 100,
          background: `${RF_GOLD_YELLOW}20`, border: `1px solid ${RF_GOLD_YELLOW}44`,
          color: RF_GOLD_YELLOW, fontSize: 11, fontWeight: 900, letterSpacing: '0.15em', marginBottom: 20
        }}>
          THE CORE REFEIR IDEA
        </div>

        <p style={{
          fontSize: 'clamp(18px, 2.2vw, 24px)', color: '#FFFFFF', lineHeight: 1.7,
          fontStyle: 'italic', fontWeight: 400, marginBottom: 28
        }}>
          "When people share opportunities and success is rewarded, everyone has a reason to help someone else move forward."
        </p>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 24 }} />
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>
          Refeir is creating a referral-powered freelance marketplace where opportunities move seamlessly through trusted networks across Africa.
        </p>

        <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Referrals', 'Freelance Economy', 'Escrow Trust', 'Pan-African Sovereign Tech'].map(tag => (
            <span key={tag} style={{
              padding: '5px 14px', borderRadius: 100,
              background: `${RF_LEAF_GREEN}18`, border: `1px solid ${RF_LEAF_GREEN}44`,
              color: RF_MINT_ACCENT, fontSize: 12, fontWeight: 700
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── WHAT IS REFEIR PIONEERS? ─────────────────────────────────────────────────
const WhatIsPioneers: React.FC = () => (
  <section id="pioneers-about" style={{ background: '#F4F7F5', padding: '100px 24px' }}>
    <div style={{ maxWidth: 940, margin: '0 auto', textAlign: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 18 }}>
        WHAT IS REFEIR PIONEERS?
      </p>
      <h2 style={{
        fontSize: 'clamp(28px, 5vw, 54px)', fontWeight: 900, color: RF_DARK_GREEN,
        lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20,
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        WE'RE NOT BUILDING<br />
        <span style={{ color: RF_GREEN }}>REFEIR ALONE.</span>
      </h2>
      <div style={{ width: 48, height: 4, background: RF_LEAF_GREEN, borderRadius: 2, margin: '0 auto 32px' }} />

      <p style={{ fontSize: 18, color: '#1E293B', lineHeight: 1.85, marginBottom: 16, maxWidth: 740, margin: '0 auto 16px' }}>
        Refeir Pioneers is the early community of builders, designers, marketers and problem-solvers helping shape Refeir before it reaches the mainstream.
      </p>
      <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 14 }}>
        We're looking for people who want to contribute their skills, ideas, networks and energy to something ambitious.
      </p>
      <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 52 }}>
        You don't have to be an expert. You don't need decades of experience.<br />
        <strong style={{ color: RF_DEEP_GREEN }}>You need something useful to contribute and the willingness to execute.</strong>
      </p>

      {/* Visual Trio Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
        background: 'rgba(15, 46, 30, 0.15)', borderRadius: 20, overflow: 'hidden'
      }} className="rp-trio">
        {[
          { text: 'YOU BRING YOUR SKILL.', dark: false },
          { text: 'WE BUILD THE NETWORK.', dark: true },
          { text: 'EVERYONE GROWS.', dark: false }
        ].map(({ text, dark }) => (
          <div key={text} style={{
            background: dark ? RF_DEEP_GREEN : '#FFFFFF',
            padding: '36px 22px', textAlign: 'center'
          }}>
            <p style={{
              fontSize: 'clamp(12px, 1.5vw, 15px)', fontWeight: 900, letterSpacing: '0.1em',
              color: dark ? RF_MINT_ACCENT : RF_DARK_GREEN, lineHeight: 1.4
            }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── WHO ARE WE LOOKING FOR? (6 DIVISION SQUADS WITH PICTURES) ────────────────
const DIVISIONS_DATA = [
  {
    Icon: Code2,
    title: 'TECH & PRODUCT',
    roles: ['Developers', 'Engineers', 'QA testers', 'AI specialists', 'Product thinkers'],
    mission: 'Build, stress-test and improve the Refeir platform.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    color: RF_LEAF_GREEN
  },
  {
    Icon: Palette,
    title: 'CREATIVE',
    roles: ['UI/UX designers', 'Graphic designers', 'Writers', 'Video creators', 'Content creators'],
    mission: 'Make Refeir impossible to ignore across Africa.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    color: RF_GOLD_YELLOW
  },
  {
    Icon: TrendingUp,
    title: 'GROWTH',
    roles: ['Digital marketers', 'Social media specialists', 'Growth strategists', 'SEO specialists'],
    mission: 'Put Refeir in front of the people who need it.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    color: RF_ORANGE
  },
  {
    Icon: Briefcase,
    title: 'BUSINESS',
    roles: ['Business developers', 'Sales professionals', 'Partnership builders', 'Networkers'],
    mission: 'Bring high-value client contracts into the ecosystem.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    color: RF_LEAF_GREEN
  },
  {
    Icon: Users,
    title: 'COMMUNITY',
    roles: ['Community managers', 'Campus ambassadors', 'Regional leads', 'Community builders'],
    mission: 'Build the people-powered network behind Refeir.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    color: RF_MINT_ACCENT
  },
  {
    Icon: FlaskConical,
    title: 'RESEARCH & TESTING',
    roles: ['Researchers', 'Product testers', 'Analysts', 'Problem solvers'],
    mission: 'Help Refeir become better every single day.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    color: RF_GOLD_YELLOW
  },
];

const WhoWeAreLookingFor: React.FC = () => (
  <section id="divisions" style={{
    background: `linear-gradient(180deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
    padding: '100px 24px'
  }}>
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '0.22em', marginBottom: 16 }}>
          WHO ARE WE LOOKING FOR?
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#FFFFFF',
          lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          There is a place for your skills.
        </h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24
      }}>
        {DIVISIONS_DATA.map(({ Icon, title, roles, mission, image, color }) => (
          <div
            key={title}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(102, 187, 42, 0.2)',
              borderRadius: 20, overflow: 'hidden', transition: 'all 0.28s', cursor: 'default'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = `${color}88`;
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(102, 187, 42, 0.2)';
              e.currentTarget.style.transform = '';
            }}
          >
            {/* Division Image Banner */}
            <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
              <img
                src={image}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${RF_DEEP_GREEN} 0%, rgba(15, 46, 30, 0.4) 60%, transparent 100%)`
              }} />
              <div style={{
                position: 'absolute', top: 14, left: 14,
                width: 40, height: 40, borderRadius: 10, background: `${RF_DEEP_GREEN}dd`,
                backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${color}44`
              }}>
                <Icon size={20} color={color} />
              </div>
            </div>

            {/* Division Details */}
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 900, color, letterSpacing: '0.15em', marginBottom: 12 }}>
                {title}
              </p>

              <div style={{ marginBottom: 18 }}>
                {roles.map(r => (
                  <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: RF_LEAF_GREEN, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{r}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', fontStyle: 'italic' }}>
                Mission: {mission}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── WHY BECOME A PIONEER? (6 BENEFITS) ───────────────────────────────────────
const BENEFITS_DATA = [
  {
    Icon: Star,
    title: 'REAL EXPERIENCE',
    desc: 'Work on a real technology product that is actively being built and launched across Africa.'
  },
  {
    Icon: Award,
    title: 'PORTFOLIO',
    desc: 'Build evidence of your skills through meaningful contributions to a growing platform.'
  },
  {
    Icon: Globe2,
    title: 'NETWORK',
    desc: 'Connect with talented, ambitious people from across Africa who are building something real.'
  },
  {
    Icon: Shield,
    title: 'RECOGNITION',
    desc: 'Meaningful contributions earn Pioneer recognition, badges, and verified track records.'
  },
  {
    Icon: TrendingUp,
    title: 'LEADERSHIP',
    desc: 'Outstanding contributors may grow into leadership opportunities within the program.'
  },
  {
    Icon: Zap,
    title: 'FUTURE OPPORTUNITIES',
    desc: 'As Refeir grows, outstanding contributors may be considered for paid contracts, roles, and partnerships.'
  },
];

const WhyBecomePioneer: React.FC = () => (
  <section style={{ background: '#FFFFFF', padding: '100px 24px' }}>
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 16 }}>
          WHY BECOME A PIONEER?
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 900, color: RF_DARK_GREEN,
          lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          BUILD SOMETHING REAL.<br />
          <span style={{ color: RF_GREEN }}>GROW WHILE YOU DO IT.</span>
        </h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24
      }}>
        {BENEFITS_DATA.map(({ Icon, title, desc }) => (
          <div
            key={title}
            style={{
              background: '#F4F7F5', border: '1px solid rgba(18, 43, 26, 0.1)',
              borderRadius: 20, padding: 32, transition: 'all 0.25s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = RF_DEEP_GREEN;
              e.currentTarget.style.borderColor = RF_DEEP_GREEN;
              (e.currentTarget.querySelector('.bt') as HTMLElement).style.color = RF_MINT_ACCENT;
              (e.currentTarget.querySelector('.bd') as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#F4F7F5';
              e.currentTarget.style.borderColor = 'rgba(18, 43, 26, 0.1)';
              (e.currentTarget.querySelector('.bt') as HTMLElement).style.color = RF_DARK_GREEN;
              (e.currentTarget.querySelector('.bd') as HTMLElement).style.color = '#475569';
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: `${RF_LEAF_GREEN}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
            }}>
              <Icon size={22} color={RF_GREEN} />
            </div>
            <p className="bt" style={{
              fontSize: 12, fontWeight: 900, color: RF_DARK_GREEN, letterSpacing: '0.12em',
              marginBottom: 10, transition: 'color 0.25s'
            }}>
              {title}
            </p>
            <p className="bd" style={{
              fontSize: 14, color: '#475569', lineHeight: 1.72, transition: 'color 0.25s'
            }}>
              {desc}
            </p>
          </div>
        ))}
      </div>

      <p style={{
        textAlign: 'center', marginTop: 40, fontSize: 13,
        color: '#64748B', fontStyle: 'italic', maxWidth: 700, margin: '40px auto 0'
      }}>
        Pioneer membership is a community contributor program. Future opportunities may become available based on meaningful contribution. No employment, payment, or equity is guaranteed.
      </p>
    </div>
  </section>
);

// ─── HOW IT WORKS (6-STEP TIMELINE) ───────────────────────────────────────────
const HOW_IT_WORKS_STEPS = [
  { n: '01', t: 'APPLY', d: 'Tell us who you are and what you can contribute.' },
  { n: '02', t: 'REVIEW', d: 'The Refeir team reviews your application.' },
  { n: '03', t: 'WELCOME', d: 'Accepted applicants receive instructions for joining the Pioneer Community.' },
  { n: '04', t: 'CONNECT', d: 'Join the Refeir Pioneers WhatsApp Community.' },
  { n: '05', t: 'CONTRIBUTE', d: 'Get involved in missions, projects and initiatives.' },
  { n: '06', t: 'GROW', d: 'Build experience, reputation, relationships and opportunities.' },
];

const HowItWorks: React.FC = () => (
  <section id="how-it-works" style={{ background: '#F4F7F5', padding: '100px 24px' }}>
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 16 }}>
          HOW IT WORKS
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: RF_DARK_GREEN,
          lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          Six Simple Steps.
        </h2>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 31, top: 32, bottom: 32, width: 2,
          background: 'rgba(18, 43, 26, 0.15)', zIndex: 0
        }} className="rp-vline" />

        {HOW_IT_WORKS_STEPS.map((s, i) => (
          <div
            key={s.n}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 28,
              padding: '16px 0', position: 'relative', zIndex: 1
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
              background: i === 0 ? RF_LEAF_GREEN : i === 5 ? RF_DEEP_GREEN : '#FFFFFF',
              border: `2px solid ${i === 0 ? RF_LEAF_GREEN : i === 5 ? RF_DEEP_GREEN : 'rgba(18, 43, 26, 0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 900,
              color: i === 0 ? RF_DEEP_GREEN : i === 5 ? RF_MINT_ACCENT : '#64748B',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: i === 0 ? `0 0 0 6px ${RF_LEAF_GREEN}25` : i === 5 ? `0 0 0 6px ${RF_DEEP_GREEN}20` : 'none'
            }}>
              {s.n}
            </div>
            <div style={{ paddingTop: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: RF_DARK_GREEN, letterSpacing: '0.16em', marginBottom: 6 }}>
                {s.t}
              </p>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
                {s.d}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── THE FOUNDING 100 ─────────────────────────────────────────────────────────
const Founding100: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCount(0);
      return;
    }
    supabase.from('pioneer_application_count').select('total').single()
      .then(
        ({ data }) => setCount(data ? Number(data.total) : 0),
        () => setCount(0)
      );
  }, []);

  return (
    <section style={{
      background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
      padding: '100px 24px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `radial-gradient(${RF_LEAF_GREEN} 1px, transparent 1px)`,
        backgroundSize: '22px 22px'
      }} />

      <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-block', padding: '6px 18px', borderRadius: 100,
          background: `${RF_GOLD_YELLOW}1e`, border: `1px solid ${RF_GOLD_YELLOW}55`,
          fontSize: 11, fontWeight: 900, color: RF_GOLD_YELLOW, letterSpacing: '0.22em', marginBottom: 32
        }}>
          LIMITED OPPORTUNITY
        </div>

        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: '#FFFFFF',
          lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 14,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          THE REFEIR FOUNDING 100
        </h2>

        <p style={{
          fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 800, color: RF_GOLD_YELLOW,
          letterSpacing: '0.06em', marginBottom: 36
        }}>
          BE THERE BEFORE EVERYONE ELSE.
        </p>

        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.82, marginBottom: 16 }}>
          We're opening the doors to the first 100 serious contributors who want to help shape Refeir from the beginning.
        </p>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.82, marginBottom: 48 }}>
          The Founding 100 will become part of the early story of Refeir. They may receive special recognition, early access, leadership consideration and other community benefits based on meaningful contribution.
        </p>

        {/* Counter Box */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: `1.5px solid rgba(102, 187, 42, 0.35)`,
          borderRadius: 24, padding: '40px 48px', marginBottom: 44,
          display: 'inline-block', minWidth: 300, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: 14 }}>
            FOUNDING PIONEERS
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 72, fontWeight: 900, color: RF_MINT_ACCENT, lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {count !== null ? count : '—'}
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>/</span>
            <span style={{ fontSize: 44, fontWeight: 900, color: 'rgba(255,255,255,0.55)' }}>100</span>
          </div>
          <p style={{ fontSize: 13, color: RF_GOLD_YELLOW, marginTop: 14, fontWeight: 800 }}>
            {count !== null ? 'Applications currently open' : 'Loading...'}
          </p>
        </div>

        <br />
        <button
          onClick={() => scrollToId('apply')}
          style={{
            background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none', padding: '18px 44px',
            borderRadius: 10, fontSize: 15, fontWeight: 900, cursor: 'pointer',
            letterSpacing: '0.05em', transition: 'all 0.2s', boxShadow: `0 8px 30px ${RF_LEAF_GREEN}55`
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 36px ${RF_MINT_ACCENT}66`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = `0 8px 30px ${RF_LEAF_GREEN}55`;
          }}
        >
          BECOME A FOUNDING PIONEER
        </button>
      </div>
    </section>
  );
};

// ─── THIS IS NOT JUST A WHATSAPP GROUP (MORE THAN A COMMUNITY) ────────────────
const MoreThanCommunity: React.FC = () => (
  <section style={{ background: '#FFFFFF', padding: '100px 24px' }}>
    <div style={{
      maxWidth: 1240, margin: '0 auto',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 64, alignItems: 'center'
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 16 }}>
          MORE THAN A GROUP
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: RF_DARK_GREEN,
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          MORE THAN A COMMUNITY.
        </h2>
        <div style={{ width: 48, height: 4, background: RF_LEAF_GREEN, borderRadius: 2, marginBottom: 28 }} />
        <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.82, marginBottom: 14 }}>
          WhatsApp will be where we communicate.
        </p>
        <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.82, marginBottom: 14 }}>
          But Refeir Pioneers is bigger than a chat group.
        </p>
        <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.82 }}>
          As the program grows, Pioneers participate in real product squads, lead regional chapters, build public reputations, earn recognition badges, and unlock future career contracts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { l: 'COMMUNITY', d: 'Connect with talented builders across Africa', dark: true },
          { l: 'CONTRIBUTION', d: 'Work on real platform missions and code', dark: false },
          { l: 'REPUTATION', d: 'Build verified public track records', dark: false },
          { l: 'OPPORTUNITY', d: 'Grow into paid contracts and leadership', dark: true },
        ].map(({ l, d, dark }) => (
          <div
            key={l}
            style={{
              background: dark ? RF_DEEP_GREEN : '#F4F7F5',
              border: dark ? 'none' : '1px solid rgba(18, 43, 26, 0.1)',
              borderRadius: 20, padding: '28px 24px'
            }}
          >
            <p style={{
              fontSize: 11, fontWeight: 900, letterSpacing: '0.15em',
              color: dark ? RF_MINT_ACCENT : RF_GREEN, marginBottom: 10
            }}>
              {l}
            </p>
            <p style={{
              fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : '#475569',
              lineHeight: 1.65
            }}>
              {d}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── PIONEER JOURNEY ──────────────────────────────────────────────────────────
const PIONEER_JOURNEY_TIERS = [
  { t: 'EXPLORER', d: "You've discovered Refeir Pioneers.", icon: '1' },
  { t: 'PIONEER', d: "You've made your first meaningful contribution.", icon: '2' },
  { t: 'BUILDER', d: "You've consistently delivered on missions.", icon: '3' },
  { t: 'PIONEER LEAD', d: "You've demonstrated team leadership.", icon: '4' },
  { t: 'CORE PIONEER', d: "You're trusted with critical platform initiatives.", icon: '★' },
];

const PioneerJourney: React.FC = () => (
  <section style={{ background: '#F4F7F5', padding: '100px 24px' }}>
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 16 }}>
          THE PIONEER JOURNEY
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: RF_DARK_GREEN,
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          Where Could You Go?
        </h2>
        <p style={{ fontSize: 15, color: '#475569', maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>
          Pioneer progression is based on meaningful contribution and leadership — not simply joining the WhatsApp group.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 23, top: 0, bottom: 0, width: 2,
          background: `linear-gradient(to bottom, ${RF_LEAF_GREEN}, ${RF_DEEP_GREEN})`, borderRadius: 2
        }} />

        {PIONEER_JOURNEY_TIERS.map(({ t, d, icon }, i) => (
          <div
            key={t}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 28,
              padding: '18px 0', position: 'relative', zIndex: 1
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
              background: i === 0 ? RF_LEAF_GREEN : i === 4 ? RF_DEEP_GREEN : '#FFFFFF',
              border: `2px solid ${i === 0 ? RF_LEAF_GREEN : i === 4 ? RF_DEEP_GREEN : 'rgba(18, 43, 26, 0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900,
              color: i === 0 ? RF_DEEP_GREEN : i === 4 ? RF_MINT_ACCENT : '#64748B',
              boxShadow: i === 0 ? `0 0 0 6px ${RF_LEAF_GREEN}25` : i === 4 ? `0 0 0 6px ${RF_DEEP_GREEN}20` : 'none'
            }}>
              {icon}
            </div>
            <div style={{ paddingTop: 10 }}>
              <p style={{
                fontSize: 13, fontWeight: 900, letterSpacing: '0.13em',
                color: i === 0 ? RF_GREEN : i === 4 ? RF_DEEP_GREEN : '#1E293B', marginBottom: 6
              }}>
                {t}
              </p>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.68 }}>
                {d}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── APPLICATION SECTION (MULTI-STEP FORM) ────────────────────────────────────
const ApplicationSection: React.FC = () => {
  const [step, setStep] = useState<AppStep>(1);
  const [form, setForm] = useState<FormData>(BLANK_FORM);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [appId, setAppId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleRole = (r: string) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(r) ? prev.roles.filter(x => x !== r) : [...prev.roles, r]
    }));
  };

  const validateCurrentStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Valid email address required';
      if (!form.whatsappNumber.trim()) e.whatsappNumber = 'WhatsApp number is required';
      if (!form.country) e.country = 'Country is required';
    }
    if (step === 2) {
      if (form.roles.length === 0) e.roles = 'Please select at least one role';
    }
    if (step === 3) {
      if (!form.primaryDivision) e.primaryDivision = 'Please select a preferred division';
      if (!form.availability) e.availability = 'Please select your time commitment';
      if (!form.motivation.trim()) e.motivation = 'Please share your motivation';
    }
    if (step === 4) {
      if (!form.agreeEmployment) e.agreeEmployment = 'Agreement required';
      if (!form.agreeConduct) e.agreeConduct = 'Agreement required';
      if (!form.agreeData) e.agreeData = 'Agreement required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(s => Math.min(4, s + 1) as AppStep);
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1) as AppStep);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setStatus('submitting');

    const appNumber = `RP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      application_number: appNumber,
      full_name: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp_number: form.whatsappNumber.trim(),
      country: form.country,
      city: form.city.trim() || null,
      roles: form.roles,
      skills: form.skills.trim() || null,
      portfolio_url: form.portfolioUrl.trim() || null,
      primary_division: form.primaryDivision || null,
      contribution: form.contribution.trim() || null,
      availability: form.availability || null,
      motivation: form.motivation.trim() || null,
      learning_goals: form.learningGoals.trim() || null,
      discovery_source: form.discoverySource.trim() || null,
      status: 'PENDING',
      is_founding_100: false,
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pioneer_applications')
          .insert(payload)
          .select('application_number')
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setAppId(appNumber);
        } else {
          setAppId(data?.application_number || appNumber);
        }
      } catch (err) {
        console.error(err);
        setAppId(appNumber);
      }
    } else {
      await new Promise(r => setTimeout(r, 1400));
      setAppId(appNumber);
    }

    setStatus('success');
    scrollToId('apply');
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 15px', borderRadius: 10,
    border: `1.5px solid ${hasError ? '#EF4444' : 'rgba(18, 43, 26, 0.15)'}`,
    fontSize: 15, color: RF_DARK_GREEN, background: '#FFFFFF', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s'
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 700, color: RF_DARK_GREEN,
    marginBottom: 7, letterSpacing: '0.02em'
  };

  const errStyle: React.CSSProperties = {
    fontSize: 12, color: '#EF4444', marginTop: 5
  };

  // SUCCESS VIEW
  if (status === 'success') {
    return (
      <section id="apply" style={{
        background: RF_DEEP_GREEN, padding: '100px 24px', minHeight: '65vh',
        display: 'flex', alignItems: 'center'
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.1, marginBottom: 16, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            APPLICATION RECEIVED
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.82, marginBottom: 48 }}>
            Your application to Refeir Pioneers has been received. Our team will review your application and contact you using the information provided.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(102, 187, 42, 0.35)`,
            borderRadius: 20, padding: '36px 40px', marginBottom: 40
          }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: 10 }}>
              APPLICATION ID
            </p>
            <p style={{ fontSize: 26, fontWeight: 900, color: RF_MINT_ACCENT, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              {appId}
            </p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: RF_GOLD_YELLOW, animation: 'rp-pulse 2s infinite' }} />
              <p style={{ fontSize: 12, fontWeight: 800, color: RF_GOLD_YELLOW, letterSpacing: '0.18em' }}>
                PENDING ADMISSIONS REVIEW
              </p>
            </div>
          </div>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
            Please save your Application ID. We will contact you once your application has been reviewed. This process ensures a curated, high-impact community of contributors.
          </p>
        </div>
      </section>
    );
  }

  const stepLabels = ['About You', 'Your Skills', 'Your Contribution', 'Agreement'];

  return (
    <section id="apply" style={{
      background: `linear-gradient(145deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
      padding: '100px 24px'
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '0.22em', marginBottom: 16 }}>
            APPLY NOW
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 14,
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            READY TO HELP BUILD REFEIR?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
            Tell us who you are, what you can contribute and where you think you can help.
          </p>
        </div>

        {/* Step Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 44 }}>
          {stepLabels.map((label, i) => {
            const stepNum = (i + 1) as AppStep;
            const isDone = step > stepNum;
            const isActive = step === stepNum;
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: isDone || isActive ? RF_LEAF_GREEN : 'rgba(255,255,255,0.1)',
                    border: `2px solid ${isDone || isActive ? RF_LEAF_GREEN : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDone || isActive ? RF_DEEP_GREEN : 'rgba(255,255,255,0.4)',
                    fontSize: 14, fontWeight: 900, transition: 'all 0.28s'
                  }}>
                    {isDone ? <Check size={16} strokeWidth={3} /> : stepNum}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase', maxWidth: 64, textAlign: 'center', lineHeight: 1.3
                  }}>
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: step > stepNum ? RF_LEAF_GREEN : 'rgba(255,255,255,0.12)',
                    margin: '0 8px', marginBottom: 26, transition: 'background 0.28s'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: 32 }}>
                Step 1 — About You
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    value={form.fullName}
                    onChange={e => updateField('fullName', e.target.value)}
                    placeholder="Your full legal name"
                    style={inputStyle(!!errors.fullName)}
                  />
                  {errors.fullName && <p style={errStyle}>{errors.fullName}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && <p style={errStyle}>{errors.email}</p>}
                </div>

                <div>
                  <label style={labelStyle}>WhatsApp Number *</label>
                  <input
                    value={form.whatsappNumber}
                    onChange={e => updateField('whatsappNumber', e.target.value)}
                    placeholder="+234 800 000 0000"
                    style={inputStyle(!!errors.whatsappNumber)}
                  />
                  {errors.whatsappNumber && <p style={errStyle}>{errors.whatsappNumber}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Country *</label>
                  <select
                    value={form.country}
                    onChange={e => updateField('country', e.target.value)}
                    style={{ ...inputStyle(!!errors.country), cursor: 'pointer' }}
                  >
                    <option value="">Select your country</option>
                    {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p style={errStyle}>{errors.country}</p>}
                </div>

                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    placeholder="e.g. Lagos, Nairobi, Accra..."
                    style={inputStyle()}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: 8 }}>
                Step 2 — Your Skills
              </h3>
              <p style={{ fontSize: 14, color: '#475569', marginBottom: 32 }}>
                Select all primary roles and skills that apply to you.
              </p>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Primary Role(s) *</label>
                {errors.roles && <p style={{ ...errStyle, marginBottom: 8 }}>{errors.roles}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {ROLES_LIST.map(role => {
                    const isSelected = form.roles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        style={{
                          padding: '8px 16px', borderRadius: 100,
                          background: isSelected ? RF_DEEP_GREEN : '#F4F7F5',
                          border: `1.5px solid ${isSelected ? RF_LEAF_GREEN : 'rgba(18, 43, 26, 0.12)'}`,
                          color: isSelected ? RF_MINT_ACCENT : '#1E293B',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Skills & Tools</label>
                  <textarea
                    value={form.skills}
                    onChange={e => updateField('skills', e.target.value)}
                    placeholder="e.g. React, TypeScript, Figma, Copywriting, SEO, Python, Growth..."
                    rows={3}
                    style={{ ...inputStyle(), resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Portfolio / LinkedIn / GitHub</label>
                  <input
                    value={form.portfolioUrl}
                    onChange={e => updateField('portfolioUrl', e.target.value)}
                    placeholder="https://..."
                    style={inputStyle()}
                  />
                  <p style={{ fontSize: 12, color: '#64748B', marginTop: 5 }}>
                    Link to your portfolio, GitHub, Behance, or LinkedIn
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: 32 }}>
                Step 3 — Your Contribution
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Preferred Pioneer Division *</label>
                  <select
                    value={form.primaryDivision}
                    onChange={e => updateField('primaryDivision', e.target.value)}
                    style={{ ...inputStyle(!!errors.primaryDivision), cursor: 'pointer' }}
                  >
                    <option value="">Select a division</option>
                    {DIVISIONS_LIST.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  {errors.primaryDivision && <p style={errStyle}>{errors.primaryDivision}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Time Availability *</label>
                  <select
                    value={form.availability}
                    onChange={e => updateField('availability', e.target.value)}
                    style={{ ...inputStyle(!!errors.availability), cursor: 'pointer' }}
                  >
                    <option value="">How much time can you commit?</option>
                    {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.availability && <p style={errStyle}>{errors.availability}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>What Can You Contribute?</label>
                  <textarea
                    value={form.contribution}
                    onChange={e => updateField('contribution', e.target.value)}
                    placeholder="Describe what specific skills, time, project execution, or networks you can contribute..."
                    rows={3}
                    style={{ ...inputStyle(), resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Why Do You Want to Become a Pioneer? *</label>
                  <textarea
                    value={form.motivation}
                    onChange={e => updateField('motivation', e.target.value)}
                    placeholder="Tell us what excites you about Refeir's referral-powered marketplace vision..."
                    rows={4}
                    style={{ ...inputStyle(!!errors.motivation), resize: 'vertical' }}
                  />
                  {errors.motivation && <p style={errStyle}>{errors.motivation}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
                  <div>
                    <label style={labelStyle}>What Would You Like to Learn?</label>
                    <textarea
                      value={form.learningGoals}
                      onChange={e => updateField('learningGoals', e.target.value)}
                      placeholder="Skills, mentorship, or leadership areas you want to develop..."
                      rows={3}
                      style={{ ...inputStyle(), resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>How Did You Hear About Refeir?</label>
                    <input
                      value={form.discoverySource}
                      onChange={e => updateField('discoverySource', e.target.value)}
                      placeholder="e.g. X / Twitter, WhatsApp, friend referral, LinkedIn..."
                      style={inputStyle()}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: 8 }}>
                Step 4 — Agreement
              </h3>
              <p style={{ fontSize: 14, color: '#475569', marginBottom: 32 }}>
                Please review and accept these community terms before submitting.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  {
                    k: 'agreeEmployment' as keyof FormData,
                    text: 'I understand that becoming a Refeir Pioneer does not automatically create an employment relationship, partnership, equity ownership or guaranteed payment.'
                  },
                  {
                    k: 'agreeConduct' as keyof FormData,
                    text: 'I agree to follow the Refeir Pioneer Community Code of Conduct.'
                  },
                  {
                    k: 'agreeData' as keyof FormData,
                    text: 'I agree that the information I provide may be used to evaluate my application and communicate with me regarding Refeir Pioneers.'
                  },
                ].map(({ k, text }) => {
                  const checked = form[k] as boolean;
                  const hasErr = !!errors[k];
                  return (
                    <label
                      key={k}
                      style={{
                        display: 'flex', gap: 14, cursor: 'pointer', padding: 18,
                        borderRadius: 12, border: `1.5px solid ${hasErr ? '#EF4444' : checked ? RF_LEAF_GREEN : 'rgba(18, 43, 26, 0.12)'}`,
                        background: checked ? `${RF_LEAF_GREEN}10` : '#FFFFFF', transition: 'all 0.2s'
                      }}
                    >
                      <div
                        onClick={() => updateField(k, !checked)}
                        style={{
                          width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                          border: `2px solid ${checked ? RF_LEAF_GREEN : '#CBD5E1'}`,
                          background: checked ? RF_LEAF_GREEN : '#FFFFFF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        {checked && <Check size={14} color={RF_DEEP_GREEN} strokeWidth={3} />}
                      </div>
                      <p style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.7 }}>
                        {text}
                      </p>
                    </label>
                  );
                })}
              </div>

              {status === 'error' && (
                <div style={{
                  marginTop: 20, padding: 14, borderRadius: 10,
                  background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 14
                }}>
                  Something went wrong submitting your application. Please try again.
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 40, paddingTop: 28, borderTop: '1px solid #E2E8F0', gap: 14, flexWrap: 'wrap'
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  background: '#F1F5F9', color: '#334155', border: 'none',
                  padding: '13px 26px', borderRadius: 10, fontSize: 14,
                  fontWeight: 700, cursor: 'pointer'
                }}
              >
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  background: RF_DEEP_GREEN, color: '#FFFFFF', border: 'none',
                  padding: '14px 32px', borderRadius: 10, fontSize: 14,
                  fontWeight: 800, cursor: 'pointer', letterSpacing: '0.04em',
                  display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = RF_DARK_GREEN)}
                onMouseLeave={e => (e.currentTarget.style.background = RF_DEEP_GREEN)}
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                style={{
                  background: status === 'submitting' ? '#94A3B8' : RF_LEAF_GREEN,
                  color: RF_DEEP_GREEN, border: 'none', padding: '15px 36px',
                  borderRadius: 10, fontSize: 15, fontWeight: 900,
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.05em', transition: 'all 0.2s', boxShadow: `0 6px 20px ${RF_LEAF_GREEN}44`
                }}
              >
                {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    q: 'WHO CAN BECOME A PIONEER?',
    a: 'Anyone with useful skills, ideas, networks or a willingness to contribute. There is no minimum experience requirement.'
  },
  {
    q: 'DO I HAVE TO BE A DEVELOPER?',
    a: 'No. Refeir Pioneers welcomes designers, writers, marketers, community builders, researchers, business developers, students, entrepreneurs and more.'
  },
  {
    q: 'IS THIS A PAID JOB?',
    a: 'Not automatically. Pioneer membership is a contributor/community program. Future paid opportunities may become available as Refeir grows based on meaningful contribution.'
  },
  {
    q: 'DO I NEED EXPERIENCE?',
    a: 'No. Useful skills and willingness to learn matter more than years of experience.'
  },
  {
    q: 'DO I GET EQUITY?',
    a: 'Pioneer membership does not automatically grant equity. Participation is as a community contributor.'
  },
  {
    q: 'HOW MUCH TIME DO I NEED?',
    a: 'There is no universal requirement. Contributors should commit only what they can realistically deliver. Consistency matters more than hours.'
  },
  {
    q: 'WHERE DO WE COMMUNICATE?',
    a: 'The official Refeir Pioneers WhatsApp Community will be the primary communication channel during the early phase.'
  },
  {
    q: 'WHAT HAPPENS AFTER I APPLY?',
    a: 'Your application is reviewed by the Refeir team. Accepted applicants receive instructions for joining the Pioneer Community via the contact information provided.'
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: '#FFFFFF', padding: '100px 24px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: RF_GREEN, letterSpacing: '0.22em', marginBottom: 16 }}>
            FAQ
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: RF_DARK_GREEN,
            lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Common Questions.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ_DATA.map((item, i) => (
            <div
              key={i}
              style={{
                border: `1.5px solid ${openIndex === i ? RF_GREEN : 'rgba(18, 43, 26, 0.12)'}`,
                borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
                background: openIndex === i ? `${RF_LEAF_GREEN}08` : '#FFFFFF'
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '20px 24px', background: 'none',
                  border: 'none', cursor: 'pointer', gap: 14, textAlign: 'left'
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: RF_DARK_GREEN, letterSpacing: '0.04em' }}>
                  {item.q}
                </span>
                <div style={{
                  flexShrink: 0, color: RF_GREEN,
                  transform: openIndex === i ? 'rotate(180deg)' : '',
                  transition: 'transform 0.2s'
                }}>
                  <ChevronDown size={20} />
                </div>
              </button>

              {openIndex === i && (
                <div style={{ padding: '0 24px 24px' }}>
                  <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.78 }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FINAL CTA SECTION (DEEP REFEIR GREEN) ────────────────────────────────────
const FinalCTA: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <section style={{
    background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
    padding: '120px 24px', position: 'relative', overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse 50% 55% at 50% 100%, ${RF_LEAF_GREEN}14 0%, transparent 65%)`
    }} />

    <div style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <h2 style={{
        fontSize: 'clamp(34px, 6vw, 70px)', fontWeight: 900, color: '#FFFFFF',
        lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 24,
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        THE FUTURE WON'T<br />
        <span style={{
          background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_GOLD_YELLOW} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          BUILD ITSELF.
        </span>
      </h2>

      <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.82, marginBottom: 14 }}>
        Refeir is still being built.
      </p>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.82, marginBottom: 52 }}>
        That means there is still time to be one of the people who helped shape it.
      </p>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => scrollToId('apply')}
          style={{
            background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none', padding: '18px 40px',
            borderRadius: 10, fontSize: 15, fontWeight: 900, cursor: 'pointer',
            letterSpacing: '0.06em', transition: 'all 0.2s', boxShadow: `0 8px 30px ${RF_LEAF_GREEN}55`
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 36px ${RF_MINT_ACCENT}66`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = `0 8px 30px ${RF_LEAF_GREEN}55`;
          }}
        >
          BECOME A REFEIR PIONEER
        </button>

        <button
          onClick={() => onNavigate('/')}
          style={{
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(102, 187, 42, 0.4)', padding: '18px 40px',
            borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = RF_MINT_ACCENT;
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.background = `${RF_LEAF_GREEN}18`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(102, 187, 42, 0.4)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          EXPLORE REFEIR
        </button>
      </div>

      <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(102, 187, 42, 0.2)' }}>
        <p style={{ fontSize: 20, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '0.12em', marginBottom: 16 }}>
          REFEIR
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', lineHeight: 2.4 }}>
          WHERE OPPORTUNITIES CONNECT.<br />
          REFERRALS REWARD.<br />
          EVERYONE GROWS.
        </p>
      </div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const PioneersFooter: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <footer style={{ background: RF_FOREST_DARK, padding: '36px 24px', borderTop: '1px solid rgba(102, 187, 42, 0.2)' }}>
    <div style={{
      maxWidth: 1240, margin: '0 auto', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/Refeir-LogoWhite.png" alt="Refeir" style={{ height: 24, width: 'auto' }} />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>
          PIONEERS
        </span>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[
          ['Privacy', '/privacy'],
          ['Terms', '/terms'],
          ['Contact', '/contact'],
          ['About Refeir', '/about']
        ].map(([label, path]) => (
          <button
            key={label}
            onClick={() => onNavigate(path)}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
              fontSize: 13, cursor: 'pointer', transition: 'color 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = RF_MINT_ACCENT)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            {label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
        © {new Date().getFullYear()} Refeir. All rights reserved.
      </p>
    </div>
  </footer>
);

// ─── STYLES & RESPONSIVENESS ──────────────────────────────────────────────────
const KeyframeStyles: React.FC = () => (
  <style>{`
    @keyframes rp-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.55; transform: scale(0.8); }
    }
    @keyframes rp-bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(8px); }
    }
    .p-desk-nav { display: flex !important; }
    .p-mob-toggle { display: none !important; }
    @media (max-width: 768px) {
      .p-desk-nav { display: none !important; }
      .p-mob-toggle { display: flex !important; }
      .rp-trio { grid-template-columns: 1fr !important; }
      .rp-vline { left: 23px !important; }
    }
    input:focus, select:focus, textarea:focus {
      outline: none !important;
      border-color: #66BB2A !important;
      box-shadow: 0 0 0 3px rgba(102, 187, 42, 0.2) !important;
    }
  `}</style>
);

// ─── MAIN PIONEERS PAGE COMPONENT ─────────────────────────────────────────────
export interface PioneersPageProps {
  onNavigate: (path: string) => void;
}

export const PioneersPage: React.FC<PioneersPageProps> = ({ onNavigate }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, Manrope, sans-serif' }}>
      <KeyframeStyles />
      <StatusLookupModal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} />
      <PioneersNav onNavigate={onNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
      <HeroSection />
      <WhyRefeir />
      <WhatIsPioneers />
      <WhoWeAreLookingFor />
      <WhyBecomePioneer />
      <HowItWorks />
      <Founding100 />
      <MoreThanCommunity />
      <PioneerJourney />
      <ApplicationSection />
      <FAQSection />
      <FinalCTA onNavigate={onNavigate} />
      <PioneersFooter onNavigate={onNavigate} />
    </div>
  );
};
