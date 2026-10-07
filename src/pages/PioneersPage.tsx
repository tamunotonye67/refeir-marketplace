import React, { useState, useEffect, useRef } from 'react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { addStoredApplication, getStoredApplications } from '../lib/pioneerApplications';
import { PioneersNav } from '../components/PioneersNav';
import { PioneersFooter } from '../components/PioneersFooter';
import { StatusLookupModal } from '../components/StatusLookupModal';
import {
  ArrowRight, ChevronDown, Check,
  Users, Zap, Award, Briefcase, Globe2, TrendingUp, Star, Shield,
  Code2, Palette, BarChart3, FlaskConical, Menu, X, Search,
  ExternalLink, CheckCircle2, AlertCircle, Clock,
  Layers, Compass, MapPin, ChevronLeft, ChevronRight, Play, Pause,
  Volume2, VolumeX, Maximize2, Copy
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



// ─── HERO SECTION WITH VISUAL COMMUNITY SHOWCASE ──────────────────────────────
const HeroSection: React.FC = () => {
  const [isTurboSpinning, setIsTurboSpinning] = useState(false);
  const turboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTriggerTurboSpin = () => {
    if (turboTimerRef.current) clearTimeout(turboTimerRef.current);
    setIsTurboSpinning(true);
    // Spin very fast for 1.3s, then return to normal speed
    turboTimerRef.current = setTimeout(() => {
      setIsTurboSpinning(false);
    }, 1300);
  };

  const handleMouseLeave = () => {
    if (turboTimerRef.current) clearTimeout(turboTimerRef.current);
    setIsTurboSpinning(false);
  };

  useEffect(() => {
    return () => {
      if (turboTimerRef.current) clearTimeout(turboTimerRef.current);
    };
  }, []);

  return (
    <section id="hero" style={{
      minHeight: '100vh', background: `radial-gradient(ellipse 80% 80% at 50% -20%, ${RF_GREEN}33 0%, ${RF_DEEP_GREEN} 70%)`,
      position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: 76, paddingBottom: 24
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
        padding: '16px 24px 20px', width: '100%'
      }}>
        <div className="rp-hero-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48, alignItems: 'center'
        }}>
          {/* Left Column: Core Message */}
          <div>
            {/* Headline */}
            <h1
              className="rp-hero-headline"
              style={{
                fontSize: 'clamp(36px, 5.4vw, 68px)', fontWeight: 800, lineHeight: 1.08,
                color: '#FFFFFF', letterSpacing: '-0.035em', marginBottom: 20,
                fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
              }}
            >
              Don't wait for Africa's future.<br />
              <span style={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Help build it.
              </span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.88)',
              fontWeight: 500, marginBottom: 24, lineHeight: 1.55
            }}>
              Join the people helping build Refeir, Africa's referral-powered freelance economy.
            </p>

            {/* CTAs */}
            <div className="rp-hero-cta-group" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => scrollToId('apply')}
                style={{
                  background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                  padding: '12px 28px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s', boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.background = RF_MINT_ACCENT;
                  e.currentTarget.style.boxShadow = `0 6px 24px ${RF_MINT_ACCENT}45`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.background = RF_LEAF_GREEN;
                  e.currentTarget.style.boxShadow = `0 4px 18px ${RF_LEAF_GREEN}35`;
                }}
              >
                Become a Pioneer <ArrowRight size={15} />
              </button>

              <button
                onClick={() => scrollToId('how-it-works')}
                style={{
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)', padding: '12px 24px',
                  borderRadius: 100, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                  letterSpacing: '0.01em', transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                }}
              >
                See how it works
              </button>
            </div>

            {/* Stats Bar (Always 1 Single Line across Mobile and Desktop) */}
            <div className="rp-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(8px, 2.5vw, 32px)',
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid rgba(102, 187, 42, 0.2)',
              width: '100%'
            }}>
              {[
                { val: 'EARLY', label: 'Community Stage' },
                { val: '6 SQUADS', label: 'Pioneer Divisions' },
                { val: '100 SEATS', label: 'Founding Pioneer Cohort' },
              ].map(s => (
                <div key={s.label} style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: 'clamp(14px, 3.8vw, 22px)',
                    fontWeight: 900,
                    color: RF_MINT_ACCENT,
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 1.15
                  }}>
                    {s.val}
                  </div>
                  <div style={{
                    fontSize: 'clamp(8.5px, 2.2vw, 11px)',
                    color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '0.04em',
                    marginTop: 3,
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Animated Rotating & Glowing Favicon Centerpiece (Aligned to Top & Enlarged) */}
          <div className="rp-hero-stage" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            minHeight: 420,
            paddingTop: 0
          }}>
            {/* Ambient Multi-Layer Radial Glow */}
            <div style={{
              position: 'absolute',
              width: 'clamp(380px, 42vw, 500px)',
              height: 'clamp(380px, 42vw, 500px)',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${RF_MINT_ACCENT}2c 0%, ${RF_LEAF_GREEN}16 45%, transparent 70%)`,
              filter: 'blur(36px)',
              pointerEvents: 'none'
            }} />

            {/* Outer Orbital Dashed Ring (Slow Clockwise Spin) */}
            <div
              className={`rp-orbital-ring-1 ${isTurboSpinning ? 'rp-ring-turbo-1' : ''}`}
              style={{
                position: 'absolute',
                width: 'clamp(350px, 38vw, 450px)',
                height: 'clamp(350px, 38vw, 450px)',
                borderRadius: '50%',
                border: `1.5px dashed rgba(102, 187, 42, 0.38)`,
                pointerEvents: 'none'
              }}
            >
              {/* Orbital Satellite Node Top */}
              <div style={{
                position: 'absolute',
                top: -7,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: RF_MINT_ACCENT,
                boxShadow: `0 0 18px ${RF_MINT_ACCENT}`
              }} />
              {/* Orbital Satellite Node Bottom */}
              <div style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: RF_GOLD_YELLOW,
                boxShadow: `0 0 16px ${RF_GOLD_YELLOW}`
              }} />
            </div>

            {/* Middle Counter-Rotating Ring (Slow Counter-Clockwise Spin) */}
            <div
              className={`rp-orbital-ring-2 ${isTurboSpinning ? 'rp-ring-turbo-2' : ''}`}
              style={{
                position: 'absolute',
                width: 'clamp(290px, 32vw, 370px)',
                height: 'clamp(290px, 32vw, 370px)',
                borderRadius: '50%',
                border: `1px solid rgba(24, 252, 92, 0.28)`,
                boxShadow: `inset 0 0 30px rgba(24, 252, 92, 0.1)`,
                pointerEvents: 'none'
              }}
            >
              {/* Satellite Node Right */}
              <div style={{
                position: 'absolute',
                top: '50%',
                right: -6,
                transform: 'translateY(-50%)',
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: RF_LEAF_GREEN,
                boxShadow: `0 0 14px ${RF_LEAF_GREEN}`
              }} />
              {/* Satellite Node Left */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: -5,
                transform: 'translateY(-50%)',
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: RF_MINT_ACCENT,
                boxShadow: `0 0 12px ${RF_MINT_ACCENT}`
              }} />
            </div>

            {/* Inner Backing Disc with Glassmorphic Border */}
            <div style={{
              position: 'absolute',
              width: 'clamp(230px, 26vw, 300px)',
              height: 'clamp(230px, 26vw, 300px)',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(15, 46, 30, 0.94) 0%, rgba(7, 24, 15, 0.9) 100%)`,
              border: `1.5px solid rgba(102, 187, 42, 0.45)`,
              boxShadow: `0 0 70px rgba(24, 252, 92, 0.28), inset 0 0 40px rgba(24, 252, 92, 0.18)`
            }} />

            {/* Core Animated Rotating & Glowing Favicon Image */}
            <div
              className="rp-hero-glow"
              onMouseEnter={handleTriggerTurboSpin}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'clamp(210px, 23vw, 270px)',
                height: 'clamp(210px, 23vw, 270px)',
                cursor: 'pointer'
              }}
            >
              <img
                src="/Refeir-Favic-Symb.png"
                alt="Refeir Favicon Symbol"
                className={`rp-hero-rotate ${isTurboSpinning ? 'rp-hero-rotate-turbo' : ''}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FOUNDER'S WELCOME NOTE & VIDEO SECTION ──────────────────────────────────
interface FounderWelcomeSectionProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

// Global declaration for YouTube Iframe API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const FounderWelcomeSection: React.FC<FounderWelcomeSectionProps> = ({ onNavigate, onOpenStatus }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(82);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const isInViewRef = useRef(false);
  const YOUTUBE_VIDEO_ID = '9CzUSsyVQfc'; // Founder's Welcome Note

  // Load YouTube Iframe API
  useEffect(() => {
    const setHighestQuality = (player: any) => {
      if (!player) return;
      try {
        if (typeof player.getAvailableQualityLevels === 'function') {
          const levels: string[] = player.getAvailableQualityLevels();
          if (levels && levels.length > 0) {
            const best = levels.find(l => ['highres', 'hd1440', 'hd1080', 'hd720'].includes(l)) || levels[0];
            if (best && typeof player.setPlaybackQuality === 'function') {
              player.setPlaybackQuality(best);
            }
          }
        } else if (typeof player.setPlaybackQuality === 'function') {
          player.setPlaybackQuality('hd1080');
        }
      } catch {
        // ignore
      }
    };

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      playerRef.current = new window.YT.Player('yt-founder-player', {
        width: '100%',
        height: '100%',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          mute: 1,
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          vq: 'hd1080' // Request 1080p HD stream
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            try {
              event.target.mute();
              setHighestQuality(event.target);
              const dur = event.target.getDuration();
              if (dur && dur > 0) setTotalDuration(Math.floor(dur));
              if (isInViewRef.current) {
                event.target.playVideo();
                setIsPlaying(true);
              } else {
                event.target.pauseVideo();
                setIsPlaying(false);
              }
            } catch (err) {
              console.error("YouTube onReady error:", err);
            }
          },
          onPlaybackQualityChange: (event: any) => {
            // Nudge back to highest available if YouTube defaults to low resolution
            if (['small', 'tiny', 'medium'].includes(event.data)) {
              setHighestQuality(event.target);
            }
          },
          onStateChange: (event: any) => {
            if (window.YT) {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setHighestQuality(event.target);
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
              }
            }
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Autoplay video when scrolled into view, pause when scrolled away
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting;
          isInViewRef.current = inView;

          if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            try {
              if (inView) {
                playerRef.current.playVideo();
                setIsPlaying(true);
              } else {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
              }
            } catch (err) {
              // ignore
            }
          }
        });
      },
      {
        threshold: 0.25
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isPlayerReady]);

  // Poll progress from YouTube player
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const cur = playerRef.current.getCurrentTime();
            const dur = playerRef.current.getDuration() || totalDuration;
            if (dur > 0) {
              setCurrentTime(Math.floor(cur));
              setProgress((cur / dur) * 100);
            }
          } catch {
            // ignore
          }
        }
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {
        setIsPlaying(!isPlaying);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerRef.current && typeof playerRef.current.isMuted === 'function') {
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch {
        setIsMuted(!isMuted);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    const newTime = Math.floor((val / 100) * totalDuration);
    setCurrentTime(newTime);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(newTime, true);
      } catch {
        // ignore
      }
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section
      id="founder-welcome"
      style={{
        background: 'linear-gradient(180deg, #07180F 0%, #0B2417 50%, #07180F 100%)',
        position: 'relative',
        padding: '80px 24px 92px',
        borderTop: '1px solid rgba(102, 187, 42, 0.22)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}
    >
      {/* Subtle ambient light gradient */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 350,
        background: 'radial-gradient(ellipse at center, rgba(24, 252, 92, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Minimalist Centered Header with Initial Heading */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 16
          }}>
            FOUNDER'S WELCOME NOTE
          </div>

          <h2 style={{
            fontSize: 'clamp(30px, 4.2vw, 52px)', fontWeight: 600,
            lineHeight: 1.14, color: '#FFFFFF', letterSpacing: '-0.03em',
            marginBottom: 16, fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Welcome to the ground floor of Africa's freelance economy.
          </h2>

          <p style={{
            fontSize: 'clamp(14.5px, 1.8vw, 16.5px)', color: 'rgba(255,255,255,0.7)',
            margin: 0, fontWeight: 400, lineHeight: 1.7
          }}>
            A personal note from our founder to every builder, creator, and strategist considering joining Refeir Pioneers.
          </p>
        </div>

        {/* Wide Curved Autoplaying Video Player Container */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleTogglePlay}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1140,
            margin: '0 auto',
            aspectRatio: '16/9',
            maxHeight: '640px',
            borderRadius: 30,
            overflow: 'hidden',
            background: '#040d08',
            border: '1.5px solid rgba(102, 187, 42, 0.32)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75), 0 0 45px rgba(24, 252, 92, 0.1)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* YouTube IFrame Mount Container */}
          <div
            style={{
              position: 'absolute',
              inset: '-20px -20px -20px -20px', // slightly offset to prevent YouTube borders
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            <div
              id="yt-founder-player"
              style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Cinematic Poster Fallback while loading */}
          {!isPlayerReady && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(https://img.youtube.com/vi/9CzUSsyVQfc/maxresdefault.jpg), url(/images/founder-welcome-poster.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
                transition: 'opacity 0.6s ease',
                pointerEvents: 'none'
              }}
            />
          )}

          {/* Cinematic Periphery Vignette Layer (Edges of the Video) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              borderRadius: 30,
              boxShadow: 'inset 0 0 100px 30px rgba(4, 13, 8, 0.8), inset 0 0 45px rgba(0, 0, 0, 0.9)',
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4, 13, 8, 0.4) 70%, rgba(4, 13, 8, 0.88) 100%)'
            }}
          />

          {/* Big Center Play/Pause indicator: Shows on hover OR whenever paused */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: isHovered || !isPlaying ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.88)',
              zIndex: 10,
              pointerEvents: 'none',
              opacity: isHovered || !isPlaying ? 0.95 : 0,
              transition: isHovered || !isPlaying
                ? 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                : 'opacity 0.2s ease-out, transform 0.2s ease-out',
              willChange: 'opacity, transform'
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: 'rgba(7, 24, 15, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '2px solid rgba(24, 252, 92, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(24, 252, 92, 0.45)'
              }}
            >
              {isPlaying ? (
                <Pause size={30} color="#FFFFFF" />
              ) : (
                <Play size={30} fill="#18FC5C" color="#18FC5C" style={{ marginLeft: 3 }} />
              )}
            </div>
          </div>

          {/* Minimalist Bottom Control Bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              background: 'linear-gradient(to top, rgba(7, 24, 15, 0.94) 0%, rgba(7, 24, 15, 0.6) 60%, transparent 100%)',
              padding: '22px 26px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              transition: 'opacity 0.25s ease',
              opacity: isHovered || !isPlaying ? 1 : 0.85
            }}
          >
            {/* Slim Timeline Scrubber */}
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: RF_MINT_ACCENT,
                height: 3,
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={handleTogglePlay}
                  style={{
                    background: 'none', border: 'none', color: '#FFFFFF',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                  }}
                >
                  {isPlaying ? <Pause size={17} fill="#fff" /> : <Play size={17} fill="#fff" />}
                </button>

                <button
                  onClick={handleToggleMute}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                  }}
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} color={RF_MINT_ACCENT} />}
                </button>

                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  onClick={handleFullscreen}
                  title="Fullscreen"
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                  }}
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Actions (Centered, Simple & Clean) */}
        <div
          className="rp-video-bottom-actions"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginTop: 32,
            flexWrap: 'wrap'
          }}
        >
          <button
            className="rp-video-btn-apply"
            onClick={() => scrollToId('apply')}
            style={{
              background: RF_LEAF_GREEN,
              color: RF_DEEP_GREEN,
              border: 'none',
              padding: '12px 28px',
              borderRadius: 100,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span>Join the Builders</span> <ArrowRight size={14} style={{ flexShrink: 0 }} />
          </button>

          <button
            className="rp-video-btn-divisions"
            onClick={() => onNavigate('/divisions')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.16)',
              padding: '12px 24px',
              borderRadius: 100,
              fontSize: 13.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            }}
          >
            <span>Explore Divisions</span>
          </button>
        </div>
      </div>
    </section>
  );
};

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
          fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif",
          fontSize: 'clamp(20px, 2.5vw, 27px)', color: '#FFFFFF', lineHeight: 1.6,
          fontStyle: 'italic', fontWeight: 400, marginBottom: 28,
          letterSpacing: '0.01em'
        }}>
          “When people share opportunities and success is rewarded, everyone has a reason to help someone else move forward.”
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

      <p style={{ fontSize: 18, color: '#1E293B', lineHeight: 1.85, maxWidth: 740, margin: '0 auto 18px', fontWeight: 500 }}>
        Refeir is creating a new pathway for talent and opportunities to connect across Africa. Refeir Pioneers is the early community of builders, designers, marketers and problem-solvers helping shape Refeir before it reaches the mainstream.
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

// ─── WHO ARE WE LOOKING FOR? (6 DIVISION SQUADS WITH TRANSPARENT PNGs) ───────
const DIVISIONS_DATA = [
  {
    id: '01',
    code: 'TECH',
    Icon: Code2,
    title: 'TECH & PRODUCT',
    shortTitle: 'Tech & Product',
    mobileTitle: 'Tech',
    tagline: 'Platform Architecture, Engineering & AI Systems',
    roles: ['Developers', 'Engineers', 'QA Testers', 'AI Specialists', 'Product Thinkers'],
    mission: 'Build, stress-test and continuously engineer the Refeir platform.',
    image: '/images/skills/tech_product.png',
    color: RF_MINT_ACCENT,
    divisionValue: 'TECH_PRODUCT'
  },
  {
    id: '02',
    code: 'CRTV',
    Icon: Palette,
    title: 'CREATIVE',
    shortTitle: 'Creative',
    mobileTitle: 'Creative',
    tagline: 'Brand Identity, UI/UX & Visual Storytelling',
    roles: ['UI/UX Designers', 'Graphic Designers', 'Brand Writers', 'Motion & Video Creators', 'Content Strategists'],
    mission: 'Make Refeir unmistakable, intuitive, and impossible to ignore across Africa.',
    image: '/images/skills/creative.png',
    color: RF_GOLD_YELLOW,
    divisionValue: 'CREATIVE'
  },
  {
    id: '03',
    code: 'GRTH',
    Icon: TrendingUp,
    title: 'GROWTH',
    shortTitle: 'Growth',
    mobileTitle: 'Growth',
    tagline: 'User Acquisition, Distribution & Network Expansion',
    roles: ['Digital Marketers', 'Growth Strategists', 'Social Media Specialists', 'SEO Specialists', 'Campaign Leads'],
    mission: 'Put Refeir directly in front of the ambitious talent and clients who need it most.',
    image: '/images/skills/growth.png',
    color: RF_ORANGE,
    divisionValue: 'GROWTH'
  },
  {
    id: '04',
    code: 'BIZ',
    Icon: Briefcase,
    title: 'BUSINESS',
    shortTitle: 'Business',
    mobileTitle: 'Business',
    tagline: 'Enterprise Contracts, Partnerships & Monetization',
    roles: ['Business Developers', 'Sales Executives', 'Partnership Builders', 'Strategic Networkers', 'Account Leads'],
    mission: 'Bring verified, high-value client contracts into the Refeir freelance ecosystem.',
    image: '/images/skills/business.png',
    color: RF_LEAF_GREEN,
    divisionValue: 'BUSINESS'
  },
  {
    id: '05',
    code: 'COMM',
    Icon: Users,
    title: 'COMMUNITY',
    shortTitle: 'Community',
    mobileTitle: 'Community',
    tagline: 'Grassroots Engagement & Pan-African Ambassador Network',
    roles: ['Community Managers', 'Campus Ambassadors', 'Regional Leads', 'Ecosystem Organizers', 'Mentors'],
    mission: 'Build and nurture the trusted people-powered network behind Refeir in every major tech hub.',
    image: '/images/skills/community.png',
    color: RF_MINT_ACCENT,
    divisionValue: 'COMMUNITY'
  },
  {
    id: '06',
    code: 'R&D',
    Icon: FlaskConical,
    title: 'RESEARCH & TESTING',
    shortTitle: 'Research & Testing',
    mobileTitle: 'Research',
    tagline: 'Product Intelligence, Market Feedback & QA Reliability',
    roles: ['Product Testers', 'User Researchers', 'Data Analysts', 'Beta Evaluators', 'Problem Solvers'],
    mission: 'Uncover user pain points, stress-test platform mechanics, and make Refeir better every single day.',
    image: '/images/skills/research_testing.png',
    color: RF_GOLD_YELLOW,
    divisionValue: 'RESEARCH_TESTING'
  },
];

// ─── 2D FLAT VECTOR ART FOR SQUAD DIVISIONS ──────────────────────────────────
const SquadFlatVectorArt: React.FC<{ squadId: string; color: string; title: string }> = ({ squadId, color }) => {
  switch (squadId) {
    case '01': // Tech & Product - Classic Flat Developer at Workstation
      return (
        <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 340, width: 'auto', maxWidth: '100%', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}>
          <circle cx="160" cy="130" r="105" fill={color} fillOpacity="0.06" />
          {/* Background Monitor with Code */}
          <rect x="70" y="30" width="180" height="110" rx="16" fill="#0C2518" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
          <rect x="85" y="48" width="55" height="5" rx="2.5" fill={color} />
          <rect x="145" y="48" width="40" height="5" rx="2.5" fill="#40B4FF" />
          <rect x="85" y="60" width="80" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.5" />
          <rect x="85" y="72" width="65" height="5" rx="2.5" fill={color} fillOpacity="0.75" />
          <rect x="155" y="72" width="30" height="5" rx="2.5" fill="#F6B21A" />
          {/* Desk Lamp with cone of light */}
          <path d="M50 175H70" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 175V110L75 95" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M68 90L85 100L75 108Z" fill={color} />
          <path d="M80 102L135 180H65L80 102Z" fill={color} fillOpacity="0.07" />
          {/* Potted Succulent Plant */}
          <rect x="235" y="165" width="22" height="18" rx="4" fill="#154228" stroke={color} strokeWidth="1.5" />
          <path d="M246 165C238 145 228 148 232 135C240 148 245 155 246 165Z" fill={color} />
          <path d="M246 165C254 145 264 148 260 135C252 148 247 155 246 165Z" fill="#66BB2A" />
          <path d="M246 165C243 138 250 132 246 122C248 135 247 148 246 165Z" fill={color} />
          {/* Desk Surface & Legs */}
          <rect x="35" y="180" width="250" height="10" rx="5" fill="#183D28" stroke={color} strokeWidth="1.5" />
          <rect x="60" y="190" width="10" height="45" rx="4" fill="#102E20" />
          <rect x="250" y="190" width="10" height="45" rx="4" fill="#102E20" />
          {/* Coffee Mug with steam */}
          <rect x="90" y="165" width="14" height="15" rx="3" fill="#F6B21A" />
          <path d="M104 168C107 168 109 171 107 175C105 177 104 177 104 177" stroke="#F6B21A" strokeWidth="1.5" />
          <path d="M94 158C94 154 98 152 96 148" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Ergonomic Chair Back */}
          <path d="M135 155C135 130 145 115 155 115C165 115 175 130 175 155" fill="#133624" stroke={color} strokeWidth="2" />
          {/* Developer Character */}
          <path d="M125 210L135 150C138 142 148 138 158 138C168 138 178 142 181 150L191 210H125Z" fill="#1E5234" />
          <path d="M140 160L165 175H190" stroke="#1E5234" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="155" y="172" width="40" height="8" rx="3" fill="#0A1C12" stroke={color} strokeWidth="1.5" />
          <circle cx="175" cy="172" r="5" fill="#E8B896" />
          <rect x="153" y="128" width="10" height="12" rx="4" fill="#E8B896" />
          <circle cx="158" cy="115" r="15" fill="#E8B896" />
          <path d="M143 115C143 102 150 96 162 96C172 96 175 102 175 110C170 108 165 110 160 107C155 112 148 112 143 115Z" fill="#12241A" />
          <rect x="156" y="112" width="10" height="6" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
          <ellipse cx="160" cy="242" rx="100" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      );
    case '02': // Creative & Media - Classic Flat Artist/Designer at Easel
      return (
        <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 340, width: 'auto', maxWidth: '100%', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}>
          <circle cx="160" cy="130" r="105" fill={color} fillOpacity="0.06" />
          {/* Artist Wooden Easel Stand */}
          <path d="M190 40L165 220M240 40L265 220M215 30V220" stroke="#8A6412" strokeWidth="3" strokeLinecap="round" />
          {/* Art Canvas with Color Splash */}
          <rect x="165" y="45" width="100" height="120" rx="8" fill="#1C180E" stroke={color} strokeWidth="2" />
          <path d="M175 140C190 85 235 150 255 75" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <circle cx="210" cy="95" r="14" fill="#18FC5C" fillOpacity="0.7" />
          <circle cx="238" cy="125" r="9" fill="#FF5F56" />
          <rect x="180" y="60" width="22" height="22" rx="4" fill="#40B4FF" fillOpacity="0.8" />
          <rect x="155" y="165" width="120" height="8" rx="4" fill="#8A6412" />
          {/* Artist Character */}
          <path d="M95 185L90 235M115 185L120 235" stroke="#252A18" strokeWidth="12" strokeLinecap="round" />
          <rect x="75" y="232" width="24" height="8" rx="4" fill={color} />
          <rect x="114" y="232" width="24" height="8" rx="4" fill={color} />
          <path d="M85 130C85 120 95 115 105 115C118 115 125 120 128 130L122 188H90L85 130Z" fill={color} />
          {/* Arm with Brush */}
          <path d="M120 125L150 110L180 100" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="180" cy="100" r="4.5" fill="#E8B896" />
          <path d="M180 100L190 95" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Arm with Palette */}
          <path d="M92 132L80 155L100 162" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="102" cy="162" rx="16" ry="12" fill="#3D2E10" stroke={color} strokeWidth="1.5" />
          <circle cx="96" cy="160" r="2.5" fill="#18FC5C" />
          <circle cx="102" cy="156" r="2.5" fill="#FF5F56" />
          <circle cx="108" cy="160" r="2.5" fill="#40B4FF" />
          {/* Head & Beret */}
          <rect x="100" y="105" width="8" height="12" rx="3" fill="#E8B896" />
          <circle cx="104" cy="95" r="14" fill="#E8B896" />
          <ellipse cx="104" cy="85" rx="16" ry="7" fill="#122B1A" />
          <circle cx="104" cy="80" r="3" fill={color} />
          <ellipse cx="160" cy="242" rx="110" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      );
    case '03': // Growth & Expansion - Classic Flat Strategist Launching Rocket
      return (
        <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 340, width: 'auto', maxWidth: '100%', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}>
          <circle cx="160" cy="130" r="105" fill={color} fillOpacity="0.06" />
          {/* Stepped Mountain Pedestals */}
          <path d="M40 230L90 195V245H40V230Z" fill="#182A1C" />
          <path d="M90 195L145 160V245H90V195Z" fill="#223D28" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
          <line x1="260" y1="90" x2="260" y2="180" stroke={color} strokeWidth="2.5" />
          <path d="M260 90L290 105L260 120Z" fill={color} />
          <path d="M120 160C170 120 210 90 270 50" stroke={color} strokeWidth="3" strokeDasharray="6 6" />
          {/* Strategist Character */}
          <path d="M125 155L108 200M138 155L150 195" stroke="#162E20" strokeWidth="12" strokeLinecap="round" />
          <rect x="96" y="196" width="20" height="7" rx="3" fill={color} />
          <rect x="144" y="191" width="20" height="7" rx="3" fill={color} />
          <path d="M115 110C115 100 125 96 135 96C145 96 155 100 155 110L148 160H118L115 110Z" fill={color} />
          {/* Arm holding brass telescope */}
          <path d="M125 112L145 98L175 88" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M165 92L195 80" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
          <path d="M192 81L202 77" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
          <rect x="130" y="86" width="8" height="12" rx="3" fill="#E8B896" />
          <circle cx="134" cy="76" r="14" fill="#E8B896" />
          <path d="M122 75C122 62 130 58 140 58C148 58 156 65 150 78C142 74 135 74 122 75Z" fill="#0C1F15" />
          {/* Soaring Origami Rocket */}
          <g transform="translate(225, 45)">
            <path d="M0 25L35 0L18 35L15 22L0 25Z" fill="#FFF" />
            <path d="M15 22L35 0L18 35" stroke={color} strokeWidth="1.5" fill="none" />
            <path d="M3 28C-2 36 -6 45 -8 52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 32C5 40 3 48 2 55" stroke="#FFBD2E" strokeWidth="2" strokeLinecap="round" />
          </g>
          <ellipse cx="160" cy="242" rx="105" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      );
    case '04': // Business & Alliances - Classic Flat Handshake & Agreement
      return (
        <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 340, width: 'auto', maxWidth: '100%', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}>
          <circle cx="160" cy="130" r="105" fill={color} fillOpacity="0.06" />
          {/* Conference Table */}
          <rect x="90" y="165" width="140" height="8" rx="4" fill="#183D28" stroke={color} strokeWidth="1.5" />
          <path d="M110 173V225M210 173V225" stroke="#122E1E" strokeWidth="4" strokeLinecap="round" />
          {/* Partnership Agreement with Seal */}
          <rect x="135" y="152" width="50" height="20" rx="3" fill="#FFF" stroke={color} strokeWidth="1.5" />
          <line x1="142" y1="158" x2="165" y2="158" stroke="#0F2E1E" strokeWidth="1.5" />
          <line x1="142" y1="164" x2="160" y2="164" stroke="#0F2E1E" strokeWidth="1.5" />
          <circle cx="174" cy="162" r="4" fill={color} />
          {/* Left Professional */}
          <path d="M85 195L80 235M102 195L105 235" stroke="#162E20" strokeWidth="11" strokeLinecap="round" />
          <path d="M75 130C75 118 85 112 96 112C108 112 115 118 118 130L112 195H80L75 130Z" fill="#1B4D2F" />
          <rect x="92" y="105" width="8" height="10" rx="3" fill="#E8B896" />
          <circle cx="96" cy="95" r="13" fill="#E8B896" />
          <path d="M85 93C85 82 92 78 102 78C110 78 112 84 112 90C106 88 100 89 96 88C90 92 87 93 85 93Z" fill="#12241A" />
          <path d="M106 128L130 140H148" stroke="#1B4D2F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="152" cy="140" r="5" fill="#E8B896" />
          {/* Right Professional */}
          <path d="M218 195L215 235M235 195L240 235" stroke="#162E20" strokeWidth="11" strokeLinecap="round" />
          <path d="M202 130C205 118 212 112 224 112C235 112 245 118 245 130L240 195H208L202 130Z" fill={color} />
          <rect x="220" y="105" width="8" height="10" rx="3" fill="#D4A078" />
          <circle cx="224" cy="95" r="13" fill="#D4A078" />
          <path d="M213 90C213 80 222 78 230 78C238 78 242 85 240 92C235 88 228 88 222 90Z" fill="#1F2815" />
          <path d="M214 128L190 140H172" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="168" cy="140" r="5" fill="#D4A078" />
          {/* Handshake Clasp */}
          <circle cx="160" cy="140" r="12" fill={color} fillOpacity="0.25" />
          <path d="M152 140H168" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M160 70L163 77L170 80L163 83L160 90L157 83L150 80L157 77Z" fill={color} />
          <ellipse cx="160" cy="242" rx="105" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      );
    case '05': // Community & Ops - Classic Flat Collaborative Trio
      return (
        <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 340, width: 'auto', maxWidth: '100%', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}>
          <circle cx="160" cy="130" r="105" fill={color} fillOpacity="0.06" />
          {/* Center Leader with Megaphone */}
          <path d="M150 190L148 235M170 190L172 235" stroke="#162E20" strokeWidth="11" strokeLinecap="round" />
          <path d="M140 120C140 110 150 105 160 105C170 105 180 110 180 120L175 190H145L140 120Z" fill={color} />
          <path d="M172 122L195 105L210 95" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M210 98L228 85V110L210 98Z" fill="#F6B21A" />
          <rect x="204" y="93" width="7" height="10" rx="2" fill="#FFF" />
          <rect x="156" y="98" width="8" height="10" rx="3" fill="#D4A078" />
          <circle cx="160" cy="88" r="13" fill="#D4A078" />
          <path d="M148 85C148 74 155 72 165 72C174 72 176 78 175 85Z" fill="#0C1F15" />
          {/* Left Waving Ambassador */}
          <path d="M92 195L90 235M108 195L110 235" stroke="#162E20" strokeWidth="10" strokeLinecap="round" />
          <path d="M85 135C85 125 95 120 102 120C110 120 118 125 118 135L114 195H88L85 135Z" fill="#1D4A32" />
          <path d="M90 138L70 115L62 90" stroke="#1D4A32" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="62" cy="88" r="4.5" fill="#E8B896" />
          <circle cx="102" cy="105" r="12" fill="#E8B896" />
          <path d="M92 102C92 92 98 90 106 90C114 90 116 95 114 102Z" fill="#12241A" />
          {/* Right Ops Lead with Clipboard */}
          <path d="M212 195L210 235M228 195L230 235" stroke="#162E20" strokeWidth="10" strokeLinecap="round" />
          <path d="M205 135C205 125 215 120 222 120C230 120 238 125 238 135L234 195H208L205 135Z" fill="#2E7D32" />
          <circle cx="222" cy="105" r="12" fill="#C6865A" />
          <path d="M212 102C212 92 218 90 226 90C234 90 236 95 234 102Z" fill="#12241A" />
          <rect x="230" y="140" width="22" height="28" rx="3" fill="#FFF" stroke={color} strokeWidth="1.5" />
          <line x1="235" y1="148" x2="247" y2="148" stroke="#0F2E1E" strokeWidth="1.5" />
          <line x1="235" y1="154" x2="245" y2="154" stroke="#0F2E1E" strokeWidth="1.5" />
          {/* Community Hearts & Sparkles */}
          <path d="M160 55C158 50 152 50 150 54C148 58 152 64 160 68C168 64 172 58 170 54C168 50 162 50 160 55Z" fill="#FF5F56" />
          <circle cx="75" cy="70" r="3" fill={color} />
          <circle cx="245" cy="75" r="3" fill="#F6B21A" />
          <ellipse cx="160" cy="242" rx="110" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      );
    case '06': // Research & Testing - Classic Flat QA Scientist Inspecting Specimen
    default:
      return (
        <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 340, width: 'auto', maxWidth: '100%', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}>
          <circle cx="160" cy="130" r="105" fill={color} fillOpacity="0.06" />
          {/* Laboratory Bench */}
          <rect x="60" y="175" width="200" height="10" rx="5" fill="#1E1C12" stroke={color} strokeWidth="1.5" />
          <rect x="80" y="185" width="10" height="45" rx="3" fill="#12241A" />
          <rect x="230" y="185" width="10" height="45" rx="3" fill="#12241A" />
          {/* Protocol Flask with Fluid */}
          <path d="M215 130V150L200 175H230L215 150V130H215Z" fill="#1A2E20" stroke={color} strokeWidth="1.5" />
          <path d="M205 168L211 175H226L219 168H205Z" fill={color} />
          <circle cx="215" cy="155" r="2.5" fill="#FFF" />
          <circle cx="215" cy="120" r="3" fill={color} />
          {/* QA Researcher Character with Magnifying Glass */}
          <path d="M100 160C100 135 110 120 120 120C130 120 138 135 138 160" fill="#143622" stroke="#18FC5C" strokeWidth="1.5" />
          <path d="M105 205L95 235M125 205L135 235" stroke="#152B1E" strokeWidth="11" strokeLinecap="round" />
          <path d="M98 140C100 128 110 122 122 122C135 122 144 128 145 140L140 205H95L98 140Z" fill={color} />
          <path d="M125 135L155 145L172 150" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="178" cy="150" r="16" fill="#0C2518" stroke="#18FC5C" strokeWidth="2.5" />
          <path d="M188 162L200 174" stroke="#18FC5C" strokeWidth="4" strokeLinecap="round" />
          <path d="M172 150L176 154L184 146" stroke="#18FC5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="168" y="170" width="18" height="6" rx="2" fill="#18FC5C" />
          <rect x="116" y="115" width="8" height="10" rx="3" fill="#E8B896" />
          <circle cx="120" cy="105" r="14" fill="#E8B896" />
          <path d="M110 102C110 92 118 88 128 88C136 88 140 94 138 102Z" fill="#12241A" />
          <circle cx="126" cy="105" r="4.5" stroke="#FFF" strokeWidth="1.5" fill="none" />
          {/* Test Checklist Card */}
          <g transform="translate(60, 115)">
            <rect width="28" height="38" rx="4" fill="#FFF" stroke={color} strokeWidth="1.5" />
            <path d="M66 125L69 128L75 122M66 135L69 138L75 132" stroke="#18FC5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <ellipse cx="160" cy="242" rx="105" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      );
  }
};

const WhoWeAreLookingFor: React.FC = () => {
  const [activeSquadIndex, setActiveSquadIndex] = useState<number>(0);
  const [isDockExpanded, setIsDockExpanded] = useState<boolean>(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillContainerRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Automatically center active squad pill in horizontal track on mobile/smaller screens
  useEffect(() => {
    const activePill = pillRefs.current[activeSquadIndex];
    if (activePill && pillContainerRef.current) {
      const container = pillContainerRef.current;
      const pillLeft = activePill.offsetLeft;
      const pillWidth = activePill.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScrollLeft = pillLeft - (containerWidth / 2) + (pillWidth / 2);
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeSquadIndex]);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const isMobile = window.innerWidth <= 880;
      const isSmall = window.innerWidth <= 540;
      const baseTop = isMobile ? (isSmall ? 118 : 122) : 130;
      const step = isMobile ? (isSmall ? 14 : 16) : 26;

      let highestStuckIndex = 0;

      DIVISIONS_DATA.forEach((_, i) => {
        const card = cardRefs.current[i];
        const shell = shellRefs.current[i];
        if (!card || !shell) return;

        const targetTop = baseTop + i * step;
        const cardRect = card.getBoundingClientRect();

        // Check if card has reached its sticky offset
        if (cardRect.top <= targetTop + 8) {
          highestStuckIndex = i;
        }

        // Apple-style stacking depth physics:
        // Only apply compression when this card has arrived at its sticky dock
        const isCardDocked = cardRect.top <= targetTop + 14;
        let stackProgress = 0;

        if (isCardDocked && i < DIVISIONS_DATA.length - 1) {
          // 1. Primary approach from the card directly below it (i + 1)
          const nextCard = cardRefs.current[i + 1];
          if (nextCard) {
            const nextTargetTop = baseTop + (i + 1) * step;
            const nextRect = nextCard.getBoundingClientRect();
            // Distance of next card from its dock position
            const dist = Math.max(0, nextRect.top - nextTargetTop);
            const stackRange = isMobile ? 260 : 380;

            if (dist < stackRange) {
              const p = Math.min(1, Math.max(0, 1 - (dist / stackRange)));
              stackProgress += p;
            }
          }

          // 2. Progressive subtle depth from secondary subsequent cards (i + 2, i + 3...)
          for (let k = i + 2; k < DIVISIONS_DATA.length; k++) {
            const furtherCard = cardRefs.current[k];
            if (furtherCard) {
              const furtherTargetTop = baseTop + k * step;
              const furtherRect = furtherCard.getBoundingClientRect();
              const furtherDist = Math.max(0, furtherRect.top - furtherTargetTop);
              const furtherRange = isMobile ? 260 : 380;
              if (furtherDist < furtherRange) {
                const p = Math.min(1, Math.max(0, 1 - (furtherDist / furtherRange)));
                stackProgress += p * 0.35;
              }
            }
          }
        }

        if (isCardDocked && stackProgress > 0.005) {
          const scale = Math.max(isMobile ? 0.88 : 0.84, 1 - stackProgress * (isMobile ? 0.045 : 0.052));
          const translateY = -(stackProgress * (isMobile ? 8 : 12));
          const brightness = Math.max(0.42, 1 - stackProgress * (isMobile ? 0.22 : 0.28));
          const topShadowAlpha = Math.min(0.25, 0.10 + stackProgress * 0.08);
          const mainShadowAlpha = Math.min(0.46, 0.28 + stackProgress * 0.10);
          shell.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          shell.style.filter = `brightness(${brightness})`;
          shell.style.boxShadow = `0 -4px 18px rgba(0, 0, 0, ${topShadowAlpha}), 0 ${16 + stackProgress * 8}px ${32 + stackProgress * 12}px rgba(0, 0, 0, ${mainShadowAlpha})`;
        } else {
          shell.style.transform = 'scale(1) translateY(0px)';
          shell.style.filter = 'brightness(1)';
          shell.style.boxShadow = '';
        }
      });

      setActiveSquadIndex(highestStuckIndex);

      // Check if user has scrolled to the second card (Card 1) or beyond
      const card1 = cardRefs.current[1];
      if (card1) {
        const targetTop1 = baseTop + 1 * step;
        const rect1 = card1.getBoundingClientRect();
        // Morph once the user reaches the second card
        setIsDockExpanded(rect1.top <= targetTop1 + 24);
      } else {
        setIsDockExpanded(highestStuckIndex >= 1);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleJumpToSquad = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      const isMobile = window.innerWidth <= 880;
      const isSmall = window.innerWidth <= 540;
      const baseTop = isMobile ? (isSmall ? 118 : 122) : 130;
      const step = isMobile ? (isSmall ? 14 : 16) : 26;
      const targetTop = baseTop + index * step;
      const elementY = card.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementY - targetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="divisions" style={{
      background: `linear-gradient(180deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
      padding: '90px 0 48px',
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 900, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(24, 252, 92, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Section Header Container */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 14
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: RF_MINT_ACCENT }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: RF_MINT_ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Squad Divisions
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 3.8vw, 46px)', fontWeight: 800, color: '#FFFFFF',
            lineHeight: 1.15, letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            marginBottom: 12
          }}>
            There is a place for your skills.
          </h2>

          <p style={{
            fontSize: 14.5, color: 'rgba(255, 255, 255, 0.65)', maxWidth: 560, margin: '0 auto',
            lineHeight: 1.6
          }}>
            Refeir is built across six specialized squads. Scroll down to see each squad emerge and stack into our sovereign roster.
          </p>
        </div>
      </div>

      {/* Floating Squad Tracker Pills Overlay (Morphs to 100% viewport width without rounded edges once scrolled to second card) */}
      <div className={`rp-squad-tracker-dock ${isDockExpanded ? 'is-expanded' : ''}`}>
        <div
          ref={pillContainerRef}
          className={`rp-squad-tracker-pills ${isDockExpanded ? 'is-expanded' : ''}`}
          role="tablist"
          aria-label="Squad divisions switcher"
        >
          <div className={`rp-squad-tracker-inner ${isDockExpanded ? 'is-expanded' : ''}`}>
            {DIVISIONS_DATA.map((item, i) => {
              const isActive = activeSquadIndex === i;
              return (
                <button
                  key={item.id}
                  ref={el => (pillRefs.current[i] = el)}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleJumpToSquad(i)}
                  className={`rp-squad-pill-btn ${isActive ? 'is-active' : ''}`}
                  style={{
                    background: isActive ? `${item.color}22` : 'transparent',
                    borderColor: isActive ? `${item.color}99` : 'transparent',
                    boxShadow: isActive ? `0 0 16px ${item.color}33, 0 2px 8px rgba(0, 0, 0, 0.4)` : 'none'
                  }}
                >
                  <item.Icon size={12} color={isActive ? item.color : 'rgba(255, 255, 255, 0.4)'} />
                  <span className="rp-pill-title-desk">{item.id} {item.shortTitle}</span>
                  <span className="rp-pill-title-mob">{item.id} {item.mobileTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Sticky Stacking Cards Deck (Phone-Product Style) ─── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div className="rp-sticky-deck-track">
          {DIVISIONS_DATA.map((item, index) => (
            <div
              key={item.id}
              ref={el => (cardRefs.current[index] = el)}
              className="rp-sticky-card-wrapper"
              style={{
                '--card-index': index,
                zIndex: index + 1
              } as React.CSSProperties}
            >
              <div
                ref={el => (shellRefs.current[index] = el)}
                className="rp-sticky-card-shell"
                style={{
                  borderColor: `${item.color}35`,
                  boxShadow: `0 -4px 18px rgba(0, 0, 0, 0.18), 0 16px 36px -6px rgba(0, 0, 0, 0.38), 0 0 20px ${item.color}08`
                }}
              >
                {/* Ambient Radial Spotlight inside Card */}
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  right: '25%',
                  width: 320,
                  height: 320,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${item.color}18 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                {/* Card Top Tab Bar (Remains visible as subsequent cards stack) */}
                <div
                  className="rp-sticky-card-tab"
                  onClick={() => handleJumpToSquad(index)}
                  title={`View Squad 0${index + 1}: ${item.title}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}`
                    }} />
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: item.color,
                      letterSpacing: '0.08em'
                    }}>
                      SQUAD {item.id} • {item.code}
                    </span>
                    <span style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                      opacity: 0.95
                    }}>
                      {item.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.45)',
                      letterSpacing: '0.06em'
                    }}>
                      0{index + 1} OF 06
                    </span>
                    <item.Icon size={14} color={item.color} />
                  </div>
                </div>

                {/* Card Left: Mission & Details */}
                <div className="rp-sticky-card-body">
                  <div>
                    <h3 style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(24px, 3.2vw, 34px)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                      marginBottom: 6
                    }}>
                      {item.title}
                    </h3>

                    <p style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: item.color,
                      marginBottom: 16,
                      letterSpacing: '0.01em'
                    }}>
                      {item.tagline}
                    </p>

                    <p style={{
                      fontSize: 14.5,
                      color: 'rgba(255, 255, 255, 0.75)',
                      lineHeight: 1.6,
                      marginBottom: 22,
                      maxWidth: 520
                    }}>
                      {item.mission}
                    </p>

                    {/* Roles & Disciplines Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                      {item.roles.map(r => (
                        <span
                          key={r}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 100,
                            padding: '4px 12px',
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.88)'
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => scrollToId('apply')}
                      style={{
                        background: item.color,
                        color: RF_FOREST_DARK,
                        padding: '11px 24px',
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: `0 4px 16px ${item.color}44`,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 6px 22px ${item.color}66`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 16px ${item.color}44`;
                      }}
                    >
                      <span>Apply for {item.shortTitle}</span>
                      <ArrowRight size={14} />
                    </button>

                    {index < DIVISIONS_DATA.length - 1 && (
                      <button
                        onClick={() => handleJumpToSquad(index + 1)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          padding: '10px 18px',
                          borderRadius: 100,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        }}
                      >
                        <span>Next: {DIVISIONS_DATA[index + 1].shortTitle}</span>
                        <ChevronDown size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Right: 2D Flat Vector Art Showcase */}
                <div className="rp-sticky-card-visual">
                  {/* Subtle ambient light */}
                  <div style={{
                    position: 'absolute',
                    width: 280,
                    height: 280,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${item.color}16 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />

                  <SquadFlatVectorArt squadId={item.id} color={item.color} title={item.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

const WhyBecomePioneer: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef<boolean>(false);
  const resumeTimerRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // For mouse drag support on desktop emulators
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // Triple set of benefits so users can swipe infinitely left or right with wrap-around
  const tripleBenefits = [
    ...BENEFITS_DATA,
    ...BENEFITS_DATA,
    ...BENEFITS_DATA
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastTime = performance.now();
    const speed = 0.045; // pixels per millisecond (~45px/s, smooth reading pace)

    const step = (time: number) => {
      const delta = Math.min(time - lastTime, 100);
      lastTime = time;

      if (el) {
        const oneThird = el.scrollWidth / 3;

        // Auto-glide from right to left (scrollLeft increases) when user is not touching/interacting
        if (!isInteractingRef.current) {
          el.scrollLeft += speed * delta;
        }

        // Seamless wrap-around for both auto-motion and left/right manual swipe
        if (oneThird > 0) {
          if (el.scrollLeft >= oneThird * 2) {
            el.scrollLeft -= oneThird;
            if (isDownRef.current) startScrollLeftRef.current -= oneThird;
          } else if (el.scrollLeft <= 5) {
            el.scrollLeft += oneThird;
            if (isDownRef.current) startScrollLeftRef.current += oneThird;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    // Center scroll initially at 1/3 (start of middle set) so user can swipe backwards right away!
    const initTimer = setTimeout(() => {
      if (el) {
        const oneThird = el.scrollWidth / 3;
        if (oneThird > 0 && el.scrollLeft < 10) {
          el.scrollLeft = oneThird;
        }
      }
    }, 150);

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      clearTimeout(initTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseInteraction = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const scheduleResume = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  const handleTouchStart = () => {
    pauseInteraction();
  };

  const handleTouchEnd = () => {
    scheduleResume();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    pauseInteraction();
    isDownRef.current = true;
    startXRef.current = e.pageX;
    if (scrollRef.current) {
      startScrollLeftRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !scrollRef.current) return;
    const walk = (e.pageX - startXRef.current) * 1.2;
    scrollRef.current.scrollLeft = startScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDownRef.current) {
      isDownRef.current = false;
      scheduleResume();
    }
  };

  return (
    <section style={{ background: '#FFFFFF', padding: '80px 24px', overflow: 'hidden' }}>
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

        {/* Desktop Grid View */}
        <div className="rp-benefits-desktop-grid">
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

        {/* Mobile Swipeable + Auto-gliding Carousel (Right to Left & Swipable Left/Right) */}
        <div className="rp-benefits-mobile-wrapper">
          {/* Edge Fades */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 28,
            background: 'linear-gradient(to right, #FFFFFF 20%, rgba(255,255,255,0))',
            pointerEvents: 'none', zIndex: 3
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 28,
            background: 'linear-gradient(to left, #FFFFFF 20%, rgba(255,255,255,0))',
            pointerEvents: 'none', zIndex: 3
          }} />

          <div
            ref={scrollRef}
            className="rp-benefits-mobile-marquee"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onScroll={() => { if (isInteractingRef.current) scheduleResume(); }}
          >
            {tripleBenefits.map(({ Icon, title, desc }, idx) => (
              <div
                key={`${title}-${idx}`}
                className="rp-benefit-card-mobile"
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: `${RF_LEAF_GREEN}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                }}>
                  <Icon size={20} color={RF_GREEN} />
                </div>
                <p style={{
                  fontSize: 12, fontWeight: 900, color: RF_DARK_GREEN, letterSpacing: '0.12em',
                  marginBottom: 8
                }}>
                  {title}
                </p>
                <p style={{
                  fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
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
};

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

  const updateCount = async () => {
    // 1. Fetch from local applications storage (instant single-source of truth)
    const stored = getStoredApplications();
    let total = stored.length;

    // 2. If Firebase is configured, check pioneer_applications collection
    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(db, 'pioneer_applications'));
        if (!snap.empty) {
          total = Math.max(total, snap.size);
        }
      } catch (err) {
        console.warn('Could not query Firestore applicant count:', err);
      }
    }

    setCount(total);
  };

  useEffect(() => {
    updateCount();

    // Listen for live updates when an applicant submits or joins
    const handleAppsChange = () => {
      updateCount();
    };

    window.addEventListener('refeir-applications-change', handleAppsChange);
    window.addEventListener('refeir-auth-change', handleAppsChange);
    window.addEventListener('storage', handleAppsChange);

    return () => {
      window.removeEventListener('refeir-applications-change', handleAppsChange);
      window.removeEventListener('refeir-auth-change', handleAppsChange);
      window.removeEventListener('storage', handleAppsChange);
    };
  }, []);

  return (
    <section className="rp-founding-section" style={{
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
          display: 'inline-block',
          fontSize: 11, fontWeight: 900, color: RF_GOLD_YELLOW, letterSpacing: '0.22em', marginBottom: 32
        }}>
          LIMITED OPPORTUNITY
        </div>

        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: '#FFFFFF',
          lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 14,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          <span className="rp-founding-p1">THE REFEIR </span>
          <span className="rp-founding-p2">FOUNDING 100</span>
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
        <div className="rp-founding-box" style={{
          background: 'rgba(255,255,255,0.06)', border: `1.5px solid rgba(102, 187, 42, 0.35)`,
          borderRadius: 24, padding: 'clamp(24px, 5vw, 40px) clamp(18px, 4vw, 48px)', marginBottom: 44,
          display: 'inline-block', width: '100%', maxWidth: 360, boxSizing: 'border-box',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
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

          {/* Progress bar towards 100 Founding Seats */}
          <div style={{
            width: '100%', maxWidth: 260, height: 6, borderRadius: 100,
            background: 'rgba(255,255,255,0.1)', margin: '16px auto 14px', overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, count ? (count / 100) * 100 : 0)}%`,
              height: '100%', borderRadius: 100,
              background: `linear-gradient(90deg, ${RF_LEAF_GREEN} 0%, ${RF_MINT_ACCENT} 100%)`,
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          <p style={{ fontSize: 13, color: RF_GOLD_YELLOW, margin: 0, fontWeight: 800 }}>
            {count !== null ? (
              count >= 100
                ? '0 seats remaining • Waitlist Active'
                : `Only ${Math.max(0, 100 - count)} seats remaining`
            ) : 'Loading...'}
          </p>
        </div>

        <br />
        <button
          onClick={() => scrollToId('apply')}
          style={{
            background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none', padding: '13px 32px',
            borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            letterSpacing: '0.01em', transition: 'all 0.2s', boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.background = RF_MINT_ACCENT;
            e.currentTarget.style.boxShadow = `0 6px 24px ${RF_MINT_ACCENT}45`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.background = RF_LEAF_GREEN;
            e.currentTarget.style.boxShadow = `0 4px 18px ${RF_LEAF_GREEN}35`;
          }}
        >
          Become a Founding Pioneer
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
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
      gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center'
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

      <div className="rp-quad-grid">
        {[
          { l: 'COMMUNITY', d: 'Connect with talented builders across Africa', dark: true },
          { l: 'CONTRIBUTION', d: 'Work on real platform missions and code', dark: false },
          { l: 'REPUTATION', d: 'Build verified public track records', dark: false },
          { l: 'OPPORTUNITY', d: 'Grow into paid contracts and leadership', dark: true },
        ].map(({ l, d, dark }) => (
          <div
            key={l}
            className="rp-quad-card"
            style={{
              background: dark ? RF_DEEP_GREEN : '#F4F7F5',
              border: dark ? 'none' : '1px solid rgba(18, 43, 26, 0.1)'
            }}
          >
            <p
              className="rp-quad-title"
              style={{
                color: dark ? RF_MINT_ACCENT : RF_GREEN
              }}
            >
              {l}
            </p>
            <p
              className="rp-quad-desc"
              style={{
                color: dark ? 'rgba(255,255,255,0.75)' : '#475569'
              }}
            >
              {d}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CONTRIBUTOR REWARD LADDER (FORMAL 5-LEVEL SYSTEM) ───────────────────────
const ContributorLadder: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [selectedLevel, setSelectedLevel] = useState(2);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isInteractingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<any>(null);

  const levels = [
    {
      level: 1,
      name: 'Refeir Member',
      tagline: 'Interested in the Mission',
      status: 'Entry Gate',
      criteria: 'Application approved & community orientation completed.',
      rewards: 'Access to general WhatsApp community, monthly product briefings, and early prototype builds.',
      badgeColor: '#94A3B8',
      icon: Users
    },
    {
      level: 2,
      name: 'Refeir Pioneer',
      tagline: 'Has Made a Meaningful Contribution',
      status: 'Active Builder',
      criteria: 'Completed & peer-reviewed at least 1 tangible mission (not simply joined the group).',
      rewards: 'Official Verified Pioneer Badge, division squad admission, and priority access to client pilot work packages.',
      badgeColor: RF_LEAF_GREEN,
      icon: Award
    },
    {
      level: 3,
      name: 'Refeir Builder',
      tagline: 'Consistently Delivers',
      status: 'High Impact',
      criteria: 'Sustained delivery across 4+ squad missions with demonstrated high quality and peer endorsements.',
      rewards: 'Tier-2 Referral Multiplier (+15%), Contributor Bounty Pool access, and verified public builder profile.',
      badgeColor: RF_MINT_ACCENT,
      icon: TrendingUp
    },
    {
      level: 4,
      name: 'Refeir Lead',
      tagline: 'Leads a Functional Team',
      status: 'Squad Leader',
      criteria: 'Leads a functional division squad, mentors new contributors, or anchors regional community chapters.',
      rewards: 'Tier-3 Referral Multiplier (+30%), monthly squad leadership stipend/bounties, and direct advisory with Founder.',
      badgeColor: RF_GOLD_YELLOW,
      icon: Star
    },
    {
      level: 5,
      name: 'Refeir Core Team',
      tagline: 'Trusted Contributors in Strategic Execution',
      status: 'Protocol Steward',
      criteria: 'Deeply trusted contributors involved in platform architecture, sovereign smart contracts, and strategic roadmap.',
      rewards: 'Ecosystem Token / Contributor Equity Pool allocation, full-time core contracts, and permanent Governance Council seat.',
      badgeColor: '#38BDF8',
      icon: Shield
    }
  ];

  const tripleLevels = [...levels, ...levels, ...levels];
  const active = levels.find(l => l.level === selectedLevel) || levels[1];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastTime = performance.now();
    const speed = 0.038; // Gentle right-to-left flow speed (~38px/sec)

    const step = (time: number) => {
      const delta = Math.min(time - lastTime, 100);
      lastTime = time;

      if (!isInteractingRef.current && el) {
        el.scrollLeft += speed * delta;
        const oneThird = el.scrollWidth / 3;
        if (oneThird > 0) {
          if (el.scrollLeft >= 2 * oneThird) {
            el.scrollLeft -= oneThird;
            if (isDownRef.current) startScrollLeftRef.current -= oneThird;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += oneThird;
            if (isDownRef.current) startScrollLeftRef.current += oneThird;
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };

    const initTimer = setTimeout(() => {
      if (el) {
        const oneThird = el.scrollWidth / 3;
        if (oneThird > 0 && el.scrollLeft < 10) {
          el.scrollLeft = oneThird;
        }
      }
    }, 150);

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      clearTimeout(initTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseInteraction = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const scheduleResume = (delayMs = 3000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, delayMs);
  };

  const handleCardClick = (levelNumber: number) => {
    setSelectedLevel(levelNumber);
    pauseInteraction();
    scheduleResume(5000);
  };

  const handleTouchStart = () => {
    pauseInteraction();
  };

  const handleTouchEnd = () => {
    scheduleResume(3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    pauseInteraction();
    isDownRef.current = true;
    startXRef.current = e.pageX;
    if (scrollRef.current) {
      startScrollLeftRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !scrollRef.current) return;
    const walk = (e.pageX - startXRef.current) * 1.2;
    scrollRef.current.scrollLeft = startScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDownRef.current) {
      isDownRef.current = false;
      scheduleResume(3000);
    }
  };

  return (
    <section id="contributor-ladder" className="rp-ladder-section">
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div className="rp-ladder-header-wrap">
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: RF_GREEN, fontSize: 11.5, fontWeight: 800, letterSpacing: '0.16em',
            textTransform: 'uppercase', marginBottom: 16
          }}>
            <Award size={15} style={{ flexShrink: 0, display: 'block' }} />
            <span>
              <span className="rp-scheme-line1">Formal Contributor </span>
              <span className="rp-scheme-line2">Reward Scheme</span>
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 900, color: RF_DARK_GREEN,
            lineHeight: 1.15, letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            <span className="rp-ladder-title-p1">The Refeir </span>
            <span className="rp-ladder-title-p2">Contributor Ladder</span>
          </h2>

          <p style={{
            fontSize: 16, color: '#475569', maxWidth: 660, margin: '14px auto 0',
            lineHeight: 1.75
          }}>
            Rewards and leadership in Refeir Pioneers are earned through <strong style={{ color: RF_DEEP_GREEN }}>verified execution</strong>, not passive membership. You advance as you deliver tangible value.
          </p>
        </div>

        {/* Desktop 5-Level Progress Tabs */}
        <div className="rp-ladder-desktop-grid">
          {levels.map(lvl => {
            const isSelected = lvl.level === selectedLevel;
            const LvlIcon = lvl.icon;
            return (
              <div
                key={lvl.level}
                onClick={() => handleCardClick(lvl.level)}
                style={{
                  background: isSelected ? RF_DEEP_GREEN : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#1E293B',
                  border: isSelected ? `2px solid ${lvl.badgeColor}` : '1.5px solid rgba(18, 43, 26, 0.09)',
                  borderRadius: 18,
                  padding: '22px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  boxShadow: isSelected ? '0 12px 30px rgba(7, 24, 15, 0.2)' : '0 2px 8px rgba(10, 30, 17, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(18, 43, 26, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 22px rgba(10, 30, 17, 0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(18, 43, 26, 0.09)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(10, 30, 17, 0.04)';
                  }
                }}
              >
                {/* Top Row: Icon badge + Level Pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: isSelected ? 'rgba(255,255,255,0.16)' : `${lvl.badgeColor}18`,
                    border: isSelected ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${lvl.badgeColor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <LvlIcon size={18} color={isSelected ? '#FFFFFF' : lvl.badgeColor} style={{ display: 'block', flexShrink: 0 }} />
                  </div>
                  <span style={{
                    fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em',
                    padding: '4px 10px', borderRadius: 100,
                    background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(18, 43, 26, 0.06)',
                    color: isSelected ? lvl.badgeColor : RF_GREEN,
                    display: 'inline-flex', alignItems: 'center'
                  }}>
                    LEVEL 0{lvl.level}
                  </span>
                </div>

                {/* Text Block: Header Text + Text Under tightly coupled */}
                <div>
                  <div style={{
                    fontSize: 15.5, fontWeight: 800,
                    color: isSelected ? '#FFFFFF' : RF_DARK_GREEN,
                    marginBottom: 6,
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em'
                  }}>
                    {lvl.name}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: isSelected ? 'rgba(255,255,255,0.72)' : '#64748B',
                    lineHeight: 1.45,
                    minHeight: 35
                  }}>
                    {lvl.tagline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Flowing Carousel (Right to Left & Swipable Left/Right) */}
        <div className="rp-ladder-mobile-wrapper">
          {/* Edge Fades */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 28,
            background: 'linear-gradient(to right, #F4F7F5 20%, rgba(244,247,245,0))',
            pointerEvents: 'none', zIndex: 3
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 28,
            background: 'linear-gradient(to left, #F4F7F5 20%, rgba(244,247,245,0))',
            pointerEvents: 'none', zIndex: 3
          }} />

          <div
            ref={scrollRef}
            className="rp-ladder-mobile-marquee"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onScroll={() => { if (isInteractingRef.current) scheduleResume(); }}
          >
            {tripleLevels.map((lvl, idx) => {
              const isSelected = lvl.level === selectedLevel;
              const LvlIcon = lvl.icon;
              return (
                <div
                  key={`mobile-lvl-${lvl.level}-${idx}`}
                  className="rp-ladder-card-mobile"
                  onClick={() => handleCardClick(lvl.level)}
                  style={{
                    background: isSelected ? RF_DEEP_GREEN : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#1E293B',
                    border: isSelected ? `2px solid ${lvl.badgeColor}` : '1.5px solid rgba(18, 43, 26, 0.08)',
                    boxShadow: isSelected
                      ? '0 6px 18px rgba(7, 24, 15, 0.2)'
                      : '0 2px 6px rgba(10, 30, 17, 0.03)'
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isSelected ? 'rgba(255,255,255,0.15)' : `${lvl.badgeColor}15`,
                    border: isSelected ? '1px solid rgba(255,255,255,0.22)' : `1px solid ${lvl.badgeColor}28`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <LvlIcon
                      size={17}
                      color={isSelected ? '#FFFFFF' : lvl.badgeColor}
                      style={{ display: 'block', flexShrink: 0 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                    <div style={{
                      fontSize: 9.5,
                      fontWeight: 900,
                      letterSpacing: '0.1em',
                      color: isSelected ? lvl.badgeColor : RF_GREEN,
                      textTransform: 'uppercase',
                      lineHeight: 1
                    }}>
                      LEVEL 0{lvl.level}
                    </div>
                    <div style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: isSelected ? '#FFFFFF' : RF_DARK_GREEN,
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2
                    }}>
                      {lvl.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Feature Card (Displayed directly under) */}
        <div className="rp-ladder-detail-card" style={{
          background: RF_DEEP_GREEN,
          borderRadius: 24,
          padding: '40px 36px',
          color: '#FFFFFF',
          border: `2px solid rgba(102, 187, 42, 0.35)`,
          boxShadow: '0 20px 50px rgba(7, 24, 15, 0.3)'
        }}>
          <div className="rp-ladder-detail-header" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16, marginBottom: 20, paddingBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 13,
                background: `${active.badgeColor}22`,
                border: `1.5px solid ${active.badgeColor}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <ActiveIcon size={25} color={active.badgeColor} style={{ display: 'block', flexShrink: 0 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 900, color: active.badgeColor,
                  letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1
                }}>
                  LEVEL 0{active.level} • {active.status}
                </span>
                <h3 style={{
                  fontSize: 'clamp(21px, 3.8vw, 32px)', fontWeight: 800, margin: 0,
                  fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.15,
                  color: '#FFFFFF'
                }}>
                  {active.name}
                </h3>
              </div>
            </div>

            <button
              className="rp-ladder-rubric-btn"
              onClick={() => onNavigate('/rewards')}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = RF_LEAF_GREEN;
                e.currentTarget.style.color = RF_DEEP_GREEN;
                e.currentTarget.style.borderColor = RF_LEAF_GREEN;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <span>Full Reward Rubric</span>
              <ArrowRight size={14} style={{ display: 'block', flexShrink: 0 }} />
            </button>
          </div>

          <p style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.78)',
            fontStyle: 'italic',
            margin: '0 0 24px 0',
            lineHeight: 1.55
          }}>
            "{active.tagline}"
          </p>

          <div className="rp-ladder-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {/* Qualification Gate */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '24px 22px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${active.badgeColor}22`,
                  border: `1px solid ${active.badgeColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={16} color={active.badgeColor} style={{ display: 'block', flexShrink: 0 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: active.badgeColor, lineHeight: 1 }}>
                  How to Qualify
                </span>
              </div>
              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                {active.criteria}
              </p>
            </div>

            {/* Formal Rewards */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '24px 22px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${active.badgeColor}22`,
                  border: `1px solid ${active.badgeColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={16} color={active.badgeColor} style={{ display: 'block', flexShrink: 0 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: active.badgeColor, lineHeight: 1 }}>
                  Unlocked Rewards & Privileges
                </span>
              </div>
              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                {active.rewards}
              </p>
            </div>
          </div>

          {/* Bottom Execution Note */}
          <div style={{
            marginTop: 24, padding: '16px 20px', borderRadius: 14,
            background: 'rgba(24, 252, 92, 0.08)', border: '1px solid rgba(24, 252, 92, 0.2)',
            display: 'flex', alignItems: 'flex-start', gap: 14
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(24, 252, 92, 0.18)',
              border: '1px solid rgba(24, 252, 92, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 2
            }}>
              <Shield size={16} color={RF_MINT_ACCENT} style={{ display: 'block', flexShrink: 0 }} />
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, flex: 1 }}>
              <strong style={{ color: '#FFFFFF' }}>Execution Over Attendance:</strong> Merely joining WhatsApp does not qualify for Level 2 badges or bounty pools. Progression requires completing verified missions logged in your Pioneer profile.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── APPLICATION SECTION (MULTI-STEP FORM) ────────────────────────────────────
const ApplicationSection: React.FC = () => {
  const [step, setStep] = useState<AppStep>(1);
  const [form, setForm] = useState<FormData>(BLANK_FORM);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [appId, setAppId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    if (!appId) return;
    navigator.clipboard.writeText(appId).then(() => {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    });
  };

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

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'pioneer_applications', appNumber), payload, { merge: true });
        setAppId(appNumber);
      } catch (err) {
        console.error('Firestore application submit error:', err);
        setAppId(appNumber);
      }
    } else {
      await new Promise(r => setTimeout(r, 800));
      setAppId(appNumber);
    }

    // Save to local applications registry for instant status tracking & admin approval
    addStoredApplication({
      application_number: appNumber,
      full_name: payload.full_name,
      email: payload.email,
      whatsapp_number: payload.whatsapp_number,
      country: payload.country,
      city: payload.city,
      roles: payload.roles,
      skills: payload.skills,
      portfolio_url: payload.portfolio_url,
      primary_division: payload.primary_division,
      contribution: payload.contribution,
      availability: payload.availability,
      motivation: payload.motivation,
      learning_goals: payload.learning_goals,
      discovery_source: payload.discovery_source,
      status: 'PENDING',
      is_founding_100: false,
      contributor_level: 'LEVEL_1'
    });

    setStatus('success');
    scrollToId('apply');
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', padding: isMobile ? '10px 12px' : '12px 14px', borderRadius: 10,
    border: `1.5px solid ${hasError ? '#EF4444' : 'rgba(18, 43, 26, 0.15)'}`,
    fontSize: isMobile ? 13.5 : 14.5, color: RF_DARK_GREEN, background: '#FFFFFF', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s'
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: isMobile ? 12 : 12.5, fontWeight: 700, color: RF_DARK_GREEN,
    marginBottom: 5, letterSpacing: '0.01em'
  };

  const errStyle: React.CSSProperties = {
    fontSize: 11.5, color: '#EF4444', marginTop: 4
  };

  // SUCCESS VIEW
  if (status === 'success') {
    return (
      <section id="apply" style={{
        background: `linear-gradient(145deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: isMobile ? '44px 14px' : '88px 24px',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: 560, width: '100%', margin: '0 auto', textAlign: 'center' }}>
          {/* Animated Success Badge */}
          <div style={{
            width: isMobile ? 54 : 64,
            height: isMobile ? 54 : 64,
            borderRadius: '50%',
            background: 'rgba(24, 252, 92, 0.12)',
            border: `1.5px solid ${RF_MINT_ACCENT}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: RF_MINT_ACCENT,
            boxShadow: '0 0 24px rgba(24, 252, 92, 0.25)'
          }}>
            <Check size={isMobile ? 26 : 32} strokeWidth={3} />
          </div>

          <h2 style={{
            fontSize: isMobile ? 'clamp(22px, 5.5vw, 28px)' : 'clamp(28px, 3.5vw, 38px)',
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 10,
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            APPLICATION RECEIVED
          </h2>

          <p style={{
            fontSize: isMobile ? 13.5 : 15,
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto 24px'
          }}>
            Your application to Refeir Pioneers has been received. Our team will review your dossier and notify you shortly.
          </p>

          {/* Clean Glassmorphic ID Card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(102, 187, 42, 0.3)',
            borderRadius: isMobile ? 16 : 20,
            padding: isMobile ? '20px 14px' : '28px 32px',
            marginBottom: isMobile ? 20 : 28,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}>
            <p style={{
              fontSize: 10.5,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.14em',
              marginBottom: 8,
              textTransform: 'uppercase'
            }}>
              Your Application ID
            </p>

            {/* Application ID row with copy button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 14
            }}>
              <span style={{
                fontSize: isMobile ? 'clamp(18px, 5vw, 24px)' : 26,
                fontWeight: 900,
                color: RF_MINT_ACCENT,
                fontFamily: 'monospace, monospace',
                letterSpacing: isMobile ? '0.04em' : '0.08em',
                whiteSpace: 'nowrap'
              }}>
                {appId}
              </span>

              <button
                type="button"
                onClick={handleCopyId}
                title="Copy Application ID"
                style={{
                  height: 32,
                  padding: '0 10px',
                  borderRadius: 8,
                  background: copiedId ? 'rgba(24, 252, 92, 0.2)' : 'rgba(255,255,255,0.08)',
                  border: copiedId ? `1px solid ${RF_MINT_ACCENT}` : '1px solid rgba(255,255,255,0.15)',
                  color: copiedId ? RF_MINT_ACCENT : '#FFFFFF',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s ease'
                }}
              >
                {copiedId ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Status Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(246, 178, 26, 0.12)',
              border: '1px solid rgba(246, 178, 26, 0.28)',
              padding: '4px 12px',
              borderRadius: 100
            }}>
              <div style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: RF_GOLD_YELLOW,
                animation: 'rp-pulse 2s infinite',
                flexShrink: 0
              }} />
              <span style={{
                fontSize: isMobile ? 10.5 : 11.5,
                fontWeight: 800,
                color: RF_GOLD_YELLOW,
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap'
              }}>
                PENDING ADMISSIONS REVIEW
              </span>
            </div>
          </div>

          {/* Action Button Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? 8 : 12,
            marginBottom: isMobile ? 18 : 24
          }}>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('refeir-open-status'))}
              style={{
                height: 40,
                padding: isMobile ? '0 16px' : '0 22px',
                borderRadius: 10,
                background: RF_LEAF_GREEN,
                color: RF_DEEP_GREEN,
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: `0 4px 14px ${RF_LEAF_GREEN}44`,
                transition: 'all 0.15s ease'
              }}
            >
              <Search size={14} />
              <span>Track Status</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setStep(1);
                setForm(BLANK_FORM);
              }}
              style={{
                height: 40,
                padding: isMobile ? '0 16px' : '0 20px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.15s ease'
              }}
            >
              <span>Done</span>
            </button>
          </div>

          <p style={{
            fontSize: isMobile ? 12 : 13,
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.6,
            maxWidth: 460,
            margin: '0 auto'
          }}>
            Please keep your Application ID safe. You can use it anytime to track your admissions status.
          </p>
        </div>
      </section>
    );
  }

  const stepLabels = ['About You', 'Your Skills', 'Your Contribution', 'Agreement'];

  return (
    <section id="apply" style={{
      background: `linear-gradient(145deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
      padding: isMobile ? '44px 14px' : '88px 24px'
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
          <p style={{ fontSize: 10.5, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '0.18em', marginBottom: 10 }}>
            APPLY NOW
          </p>
          <h2 style={{
            fontSize: isMobile ? 'clamp(22px, 6vw, 28px)' : 'clamp(28px, 4vw, 44px)',
            fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 10,
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            READY TO HELP BUILD REFEIR?
          </h2>
          <p style={{ fontSize: isMobile ? 13.5 : 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 auto', maxWidth: 540 }}>
            Tell us who you are, what you can contribute, and where you want to make an impact.
          </p>
        </div>

        {/* Modern Responsive Step Progress Bar */}
        <div style={{ marginBottom: isMobile ? 20 : 32 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                color: RF_MINT_ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                Step {step} of 4
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>•</span>
              <span style={{ fontSize: isMobile ? 12.5 : 13.5, fontWeight: 600, color: '#FFFFFF' }}>
                {stepLabels[step - 1]}
              </span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
              {step * 25}%
            </span>
          </div>

          {/* 4 Connected Progress Segments */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {[1, 2, 3, 4].map(s => {
              const isPast = step > s;
              const isCurr = step === s;
              return (
                <div
                  key={s}
                  style={{
                    height: 4,
                    borderRadius: 100,
                    background: isPast || isCurr ? RF_MINT_ACCENT : 'rgba(255,255,255,0.14)',
                    boxShadow: isCurr ? '0 0 8px rgba(24, 252, 92, 0.5)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: isMobile ? 16 : 24,
          padding: isMobile ? '18px 14px' : '36px 36px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.45)'
        }}>
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: isMobile ? 16 : 24 }}>
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
                    className="rp-light-select"
                    style={{ ...inputStyle(!!errors.country), paddingRight: isMobile ? 40 : 44, cursor: 'pointer' }}
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
              <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: 4 }}>
                Step 2 — Your Skills
              </h3>
              <p style={{ fontSize: isMobile ? 12.5 : 13.5, color: '#475569', marginBottom: isMobile ? 18 : 24 }}>
                Select all primary roles and skills that apply to you.
              </p>

              <div style={{ marginBottom: isMobile ? 18 : 24 }}>
                <label style={labelStyle}>Primary Role(s) *</label>
                {errors.roles && <p style={{ ...errStyle, marginBottom: 8 }}>{errors.roles}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 6 : 8 }}>
                  {ROLES_LIST.map(role => {
                    const isSelected = form.roles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        style={{
                          padding: isMobile ? '6px 12px' : '7px 14px', borderRadius: 8,
                          background: isSelected ? RF_DEEP_GREEN : '#F4F7F5',
                          border: `1.5px solid ${isSelected ? RF_LEAF_GREEN : 'rgba(18, 43, 26, 0.12)'}`,
                          color: isSelected ? RF_MINT_ACCENT : '#1E293B',
                          fontSize: isMobile ? 12.5 : 13.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(230px, 1fr))', gap: isMobile ? 12 : 18 }}>
                <div>
                  <label style={labelStyle}>Skills &amp; Tools</label>
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
                  <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>
                    Link to your portfolio, GitHub, Behance, or LinkedIn
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: isMobile ? 16 : 24 }}>
                Step 3 — Your Contribution
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 12 : 18, marginBottom: isMobile ? 14 : 18 }}>
                <div>
                  <label style={labelStyle}>Preferred Pioneer Division *</label>
                  <select
                    value={form.primaryDivision}
                    onChange={e => updateField('primaryDivision', e.target.value)}
                    className="rp-light-select"
                    style={{ ...inputStyle(!!errors.primaryDivision), paddingRight: isMobile ? 40 : 44, cursor: 'pointer' }}
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
                    className="rp-light-select"
                    style={{ ...inputStyle(!!errors.availability), paddingRight: isMobile ? 40 : 44, cursor: 'pointer' }}
                  >
                    <option value="">How much time can you commit?</option>
                    {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.availability && <p style={errStyle}>{errors.availability}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 18 }}>
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
                    rows={3}
                    style={{ ...inputStyle(!!errors.motivation), resize: 'vertical' }}
                  />
                  {errors.motivation && <p style={errStyle}>{errors.motivation}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(230px, 1fr))', gap: isMobile ? 12 : 18 }}>
                  <div>
                    <label style={labelStyle}>What Would You Like to Learn?</label>
                    <textarea
                      value={form.learningGoals}
                      onChange={e => updateField('learningGoals', e.target.value)}
                      placeholder="Skills, mentorship, or leadership areas you want to develop..."
                      rows={2}
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
              <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: RF_DARK_GREEN, marginBottom: 4 }}>
                  Agreement &amp; Terms
                </h3>
                <p style={{ fontSize: isMobile ? 12.5 : 13.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Please review and accept these community terms before submitting.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 14 }}>
                {[
                  {
                    k: 'agreeEmployment' as keyof FormData,
                    text: 'I understand that becoming a Refeir Pioneer does not automatically create an employment relationship, partnership, equity ownership or guaranteed payment.'
                  },
                  {
                    k: 'agreeConduct' as keyof FormData,
                    text: 'I agree to follow the Refeir Pioneer Community Code of Conduct and uphold collaborative standards.'
                  },
                  {
                    k: 'agreeData' as keyof FormData,
                    text: 'I agree that the information I provide may be used to evaluate my application and communicate regarding Refeir Pioneers.'
                  },
                ].map(({ k, text }) => {
                  const checked = form[k] as boolean;
                  const hasErr = !!errors[k];
                  return (
                    <label
                      key={k}
                      onClick={() => updateField(k, !checked)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: isMobile ? 11 : 14,
                        cursor: 'pointer',
                        padding: isMobile ? '12px 14px' : '16px 18px',
                        borderRadius: 12,
                        border: `1.5px solid ${hasErr ? '#EF4444' : checked ? RF_LEAF_GREEN : 'rgba(18, 43, 26, 0.12)'}`,
                        background: checked ? `${RF_LEAF_GREEN}0c` : '#FAFAFA',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          flexShrink: 0,
                          marginTop: 2,
                          border: `2px solid ${checked ? RF_LEAF_GREEN : '#CBD5E1'}`,
                          background: checked ? RF_LEAF_GREEN : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        {checked && <Check size={13} color={RF_DEEP_GREEN} strokeWidth={3} />}
                      </div>
                      <span style={{
                        fontSize: isMobile ? 12.5 : 13.5,
                        color: checked ? '#0F172A' : '#334155',
                        lineHeight: 1.55,
                        fontWeight: checked ? 500 : 400
                      }}>
                        {text}
                      </span>
                    </label>
                  );
                })}
              </div>

              {status === 'error' && (
                <div style={{
                  marginTop: 16,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  fontSize: 13
                }}>
                  Something went wrong submitting your application. Please try again.
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons - Perfectly Aligned Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: isMobile ? 22 : 32,
            paddingTop: isMobile ? 16 : 22,
            borderTop: '1px solid #E2E8F0',
            gap: isMobile ? 8 : 12
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  height: 44,
                  padding: isMobile ? '0 16px' : '0 24px',
                  borderRadius: 10,
                  background: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #E2E8F0',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  flex: isMobile ? '0 0 auto' : '0 0 auto',
                  transition: 'background 0.15s ease'
                }}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  height: 44,
                  padding: isMobile ? '0 20px' : '0 28px',
                  borderRadius: 10,
                  background: RF_DEEP_GREEN,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  flex: isMobile && step > 1 ? 1 : isMobile ? 1 : '0 0 auto',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 10px rgba(15, 46, 30, 0.2)'
                }}
              >
                <span>Next</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                style={{
                  height: 44,
                  padding: isMobile ? '0 18px' : '0 32px',
                  borderRadius: 10,
                  background: status === 'submitting' ? '#94A3B8' : RF_LEAF_GREEN,
                  color: RF_DEEP_GREEN,
                  border: 'none',
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  flex: isMobile ? 1 : '0 0 auto',
                  transition: 'all 0.15s ease',
                  boxShadow: `0 4px 16px ${RF_LEAF_GREEN}44`
                }}
              >
                {status === 'submitting' ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>{isMobile ? 'Submit' : 'Submit Application'}</span>
                    <Check size={16} strokeWidth={3} />
                  </>
                )}
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
    q: 'Who can become a Pioneer?',
    a: 'Anyone with useful skills, ideas, networks or a willingness to contribute. There is no minimum experience requirement.'
  },
  {
    q: 'Do I have to be a developer?',
    a: 'No. Refeir Pioneers welcomes designers, writers, marketers, community builders, researchers, business developers, students, entrepreneurs and more.'
  },
  {
    q: 'Is this a paid job?',
    a: 'Not automatically. Pioneer membership is a contributor/community program. Future paid opportunities may become available as Refeir grows based on meaningful contribution.'
  },
  {
    q: 'Do I need experience?',
    a: 'No. Useful skills and willingness to learn matter more than years of experience.'
  },
  {
    q: 'Do I get equity?',
    a: 'Pioneer membership does not automatically grant equity. Participation is as a community contributor.'
  },
  {
    q: 'How much time do I need?',
    a: 'There is no universal requirement. Contributors should commit only what they can realistically deliver. Consistency matters more than hours.'
  },
  {
    q: 'Where do we communicate?',
    a: 'The official Refeir Pioneers WhatsApp Community will be the primary communication channel during the early phase.'
  },
  {
    q: 'What happens after I apply?',
    a: 'Your application is reviewed by the Refeir team. Accepted applicants receive instructions for joining the Pioneer Community via the contact information provided.'
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: '#FFFFFF', padding: '100px 24px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: RF_GREEN, letterSpacing: '0.18em', marginBottom: 16 }}>
            FAQ
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: RF_DARK_GREEN,
            lineHeight: 1.15, letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Common Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ_DATA.map((item, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${openIndex === i ? RF_GREEN : 'rgba(18, 43, 26, 0.12)'}`,
                borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s',
                background: openIndex === i ? `${RF_LEAF_GREEN}08` : '#FFFFFF'
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '18px 22px', background: 'none',
                  border: 'none', cursor: 'pointer', gap: 14, textAlign: 'left'
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: RF_DARK_GREEN, letterSpacing: '-0.01em' }}>
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
        fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 800, color: '#FFFFFF',
        lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: 24,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        The future won't<br />
        <span style={{
          fontWeight: 800,
          background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_GOLD_YELLOW} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          build itself.
        </span>
      </h2>

      <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 12 }}>
        Refeir is still being built.
      </p>
      <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 46 }}>
        That means there is still time to be one of the people who helped shape it.
      </p>

      <div className="rp-responsive-btn-group" style={{ maxWidth: 640, margin: '0 auto' }}>
        <button
          onClick={() => scrollToId('apply')}
          style={{
            background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none', padding: '13px 32px',
            borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            letterSpacing: '0.01em', transition: 'all 0.2s', boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.background = RF_MINT_ACCENT;
            e.currentTarget.style.boxShadow = `0 6px 24px ${RF_MINT_ACCENT}45`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.background = RF_LEAF_GREEN;
            e.currentTarget.style.boxShadow = `0 4px 18px ${RF_LEAF_GREEN}35`;
          }}
        >
          Become a Refeir Pioneer
        </button>

        <button
          onClick={() => onNavigate('/')}
          style={{
            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)', padding: '13px 28px',
            borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }}
        >
          Explore Refeir
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
    .rp-trio {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 768px) {
      .rp-trio { grid-template-columns: 1fr !important; }
      .rp-vline { left: 23px !important; }
    }
    @media (max-width: 640px) {
      .rp-squad-cards-grid {
        grid-template-columns: 1fr !important;
        gap: 18px !important;
      }
    }
    #yt-founder-player {
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      pointer-events: none !important;
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
      <StatusLookupModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onActivateAccount={(appNum, code, pioneerId) => {
          setStatusModalOpen(false);
          window.dispatchEvent(new CustomEvent('refeir-open-auth', {
            detail: { tab: 'signup', appNumber: appNum, pioneerId, acceptanceCode: code }
          }));
        }}
      />
      <PioneersNav onNavigate={onNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
      <HeroSection />
      <FounderWelcomeSection onNavigate={onNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
      <WhyRefeir />
      <WhatIsPioneers />
      <WhoWeAreLookingFor />
      <WhyBecomePioneer />
      <HowItWorks />
      <Founding100 />
      <MoreThanCommunity />
      <ContributorLadder onNavigate={onNavigate} />
      <ApplicationSection />
      <FAQSection />
      <FinalCTA onNavigate={onNavigate} />
      <PioneersFooter onNavigate={onNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
    </div>
  );
};
