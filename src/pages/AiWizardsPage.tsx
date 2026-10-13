import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  Clock,
  Star,
  ShieldCheck,
  Lock,
  Wallet,
  Plus,
  Briefcase,
  Award,
  Compass,
  BadgeCheck,
  FileCheck,
  Users,
  Video,
  Bot,
  Layers
} from 'lucide-react';
import '../styles/ai-wizards.css';

interface AiWizardsPageProps {
  onNavigate: (path: string) => void;
  initialPillar?: 'creative' | 'agents' | 'visuals';
}

type PillarType = 'creative' | 'agents' | 'visuals';
type RoleType = 'client' | 'talent';
type ChapterId = 'meet' | 'process' | 'invest' | 'protect' | 'start';

interface Wizard {
  name: string;
  country: string;
  role: string;
  rating: string;
  projects: number;
  rate: string;
  image: string;
}

interface Tier {
  name: string;
  price: string;
  time: string;
  desc: string;
}

interface PillarConfig {
  label: string;
  short: string;
  icon: React.ReactNode;
  accent: string;
  accentSoft: string;
  accentInk: string;
  eyebrow: string;
  title: string;
  highlight: string;
  lead: string;
  ctaVerb: string;
  wizards: Wizard[];
  tools: string[];
  process: { name: string; desc: string; time: string }[];
  outcomes: string[];
  compare: {
    oldLabel: string;
    newLabel: string;
    oldCost: string;
    newCost: string;
    oldCostMax: number;
    newCostMax: number;
    oldTime: string;
    newTime: string;
    oldDays: number;
    newDays: number;
    saving: string;
  };
  tiers: Tier[];
}

const img = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=80`;

const PILLARS: Record<PillarType, PillarConfig> = {
  creative: {
    label: 'AI Creative Production',
    short: 'AI Video',
    icon: <Video size={15} />,
    accent: '#66BB2A',
    accentSoft: 'rgba(102, 187, 42, 0.14)',
    accentInk: '#0F1E13',
    eyebrow: 'AI Creative Production',
    title: 'Borrow a wand.',
    highlight: 'Ship a campaign in days.',
    lead:
      'Work with Africa’s most sought-after AI video directors. They turn your idea into scroll-stopping, broadcast-ready films without a studio, a crew, or a six-week wait.',
    ctaVerb: 'Borrow a Wand',
    wizards: [
      { name: 'Tariq Al-Mansoor', country: '🇪🇬', role: 'Generative AI Film Director & VFX Lead', rating: '4.9', projects: 84, rate: '$55/hr', image: img('1507152832244-10d45c7eda57') },
      { name: 'Nia Mwangi', country: '🇰🇪', role: 'AI Storyteller & Brand Film Producer', rating: '5.0', projects: 61, rate: '$48/hr', image: img('1531746020798-e6953c6e8e04') },
      { name: 'Amara Okafor', country: '🇳🇬', role: 'Motion Designer & Neural Colourist', rating: '4.9', projects: 72, rate: '$42/hr', image: img('1573496359142-b8d87734a5a2') }
    ],
    tools: ['Runway Gen-3', 'OpenAI Sora', 'Midjourney v6', 'ComfyUI', 'Stable Video Diffusion', 'DaVinci Resolve'],
    process: [
      { name: 'Brief, storyboard & style lock', desc: 'Your director shapes the narrative, builds character sheets and locks a visual style that matches your brand.', time: 'Day 1' },
      { name: 'Consistent AI generation', desc: 'Scenes are generated with locked seeds and custom models so faces, wardrobe and products stay identical in every shot.', time: 'Days 2–4' },
      { name: 'Sound, upscale & master', desc: 'Native 4K upscaling, voice and Foley, colour grading, and cutdowns for every platform you publish on.', time: 'Days 5–7' }
    ],
    outcomes: [
      '4K master film plus 16:9, 9:16 and 1:1 cutdowns',
      'Voiceover, score and sound design included',
      'Full commercial rights and source project files',
      'Revision rounds built into every milestone'
    ],
    compare: {
      oldLabel: 'Traditional production',
      newLabel: 'Refeir AI studio',
      oldCost: '$20k – $75k',
      newCost: '$1.2k – $6.5k',
      oldCostMax: 75000,
      newCostMax: 6500,
      oldTime: '6 – 10 weeks',
      newTime: '3 – 7 days',
      oldDays: 70,
      newDays: 7,
      saving: 'up to 90%'
    },
    tiers: [
      { name: 'Viral Social Asset', price: '$800 – $1.5k', time: '3 days', desc: 'A 15–30s hook video built for TikTok, Reels and paid social.' },
      { name: 'Brand Hero Film', price: '$2.5k – $4.5k', time: '5 days', desc: 'A 60s cinematic brand story with custom voiceover and score.' },
      { name: 'Full Campaign Suite', price: '$5k – $8.5k', time: '10 days', desc: 'Three hero variations, eight cutdowns, statics and source files.' }
    ]
  },
  agents: {
    label: 'Autonomous Engineering',
    short: 'AI Agents',
    icon: <Bot size={15} />,
    accent: '#F6B21A',
    accentSoft: 'rgba(246, 178, 26, 0.15)',
    accentInk: '#1B1400',
    eyebrow: 'Autonomous Engineering',
    title: 'Deploy an agent.',
    highlight: 'Give your team superpowers.',
    lead:
      'Elite African AI engineers build custom agents, RAG pipelines and workflow automations that plug into your data and quietly do the work, around the clock.',
    ctaVerb: 'Deploy an Agent',
    wizards: [
      { name: 'Chidinma Eze', country: '🇳🇬', role: 'Principal LLM & RAG Systems Architect', rating: '5.0', projects: 47, rate: '$70/hr', image: img('1573497019940-1c28c88b4f3e') },
      { name: 'Jean-Paul Habimana', country: '🇷🇼', role: 'Multi-Agent Workflow Engineer', rating: '4.9', projects: 39, rate: '$62/hr', image: img('1506794778202-cad84cf45f1d') },
      { name: 'Kofi Mensah', country: '🇬🇭', role: 'MLOps & Secure Deployment Lead', rating: '4.8', projects: 53, rate: '$58/hr', image: img('1531384441138-2736e62e0919') }
    ],
    tools: ['LangChain', 'LlamaIndex', 'CrewAI', 'Pinecone', 'pgvector', 'vLLM & Ollama'],
    process: [
      { name: 'Map the workflow & ingest data', desc: 'Your engineer maps the job to automate, then indexes your docs, databases and tools into a private vector store.', time: 'Week 1' },
      { name: 'Build tools & reasoning loops', desc: 'The agent learns to query systems, send emails, process files and check its own work before acting.', time: 'Week 2' },
      { name: 'Guardrail, test & deploy', desc: 'Prompt-injection guardrails, automated evals for accuracy, then deployment to your own cloud.', time: 'Week 3' }
    ],
    outcomes: [
      'Production-ready, containerised agent codebase',
      'Private RAG over your own company knowledge',
      'API and webhook integration with your stack',
      'Evaluation reports on accuracy and latency'
    ],
    compare: {
      oldLabel: 'Traditional automation',
      newLabel: 'Refeir agent squad',
      oldCost: '$40k – $120k',
      newCost: '$2.8k – $9.5k',
      oldCostMax: 120000,
      newCostMax: 9500,
      oldTime: '3 – 6 months',
      newTime: '1 – 3 weeks',
      oldDays: 180,
      newDays: 21,
      saving: 'up to 92%'
    },
    tiers: [
      { name: 'Knowledge Assistant', price: '$1.8k – $3.2k', time: '5 days', desc: 'Private document search with cited answers and team access.' },
      { name: 'Workflow Agent', price: '$3.5k – $6.5k', time: '12 days', desc: 'A multi-tool agent for lead qualification, reporting or support.' },
      { name: 'Multi-Agent System', price: '$7k – $14k', time: '21 days', desc: 'A coordinated squad of agents running an end-to-end process.' }
    ]
  },
  visuals: {
    label: 'Generative Visuals & 3D',
    short: '3D & Visuals',
    icon: <Layers size={15} />,
    accent: '#F47C20',
    accentSoft: 'rgba(244, 124, 32, 0.15)',
    accentInk: '#2A1203',
    eyebrow: 'Generative Visuals & 3D',
    title: 'Commission visuals.',
    highlight: 'Skip the photo shoot.',
    lead:
      'Top 3D artists and spatial designers turn sketches, CAD files or product ideas into photoreal renders, 3D web models and brand worlds, often within 48 hours.',
    ctaVerb: 'Commission Visuals',
    wizards: [
      { name: 'Liam Van Der Merwe', country: '🇿🇦', role: 'Generative 3D & Spatial Designer', rating: '4.9', projects: 66, rate: '$50/hr', image: img('1522529599102-193c0d76b5b6') },
      { name: 'Fatima Zahra', country: '🇲🇦', role: 'Product CGI & Lighting Artist', rating: '5.0', projects: 58, rate: '$46/hr', image: img('1589156280159-27698a70f29e') },
      { name: 'Zainab Bello', country: '🇳🇬', role: 'Brand Worlds & Interactive 3D Lead', rating: '4.9', projects: 44, rate: '$52/hr', image: img('1531123897727-8f129e1688ce') }
    ],
    tools: ['Blender', 'Unreal Engine 5', 'Stable Diffusion XL', 'ControlNet', 'Spline', 'Octane'],
    process: [
      { name: 'Model from CAD or concept', desc: 'Your artist builds clean, high-detail 3D geometry from your CAD files, photos or a simple sketch.', time: 'Day 1' },
      { name: 'Materials & studio lighting', desc: 'Realistic glass, metal and fabric shaders, lit like a high-end studio shoot and tuned to your brand.', time: 'Days 2–3' },
      { name: 'Render & export everywhere', desc: 'Ultra-high-res stills, turntables and interactive 3D models ready for web, retail and print.', time: 'Days 4–5' }
    ],
    outcomes: [
      '8K photoreal renders for print and e-commerce',
      'Interactive GLTF / USDZ models for the web',
      'Turntable animations and lighting variations',
      'Layered source files with full IP transfer'
    ],
    compare: {
      oldLabel: 'Traditional photography',
      newLabel: 'Refeir 3D studio',
      oldCost: '$15k – $40k',
      newCost: '$900 – $4.2k',
      oldCostMax: 40000,
      newCostMax: 4200,
      oldTime: '4 – 8 weeks',
      newTime: '1 – 5 days',
      oldDays: 56,
      newDays: 5,
      saving: 'up to 89%'
    },
    tiers: [
      { name: 'Product Packshots', price: '$600 – $1.2k', time: '48 hours', desc: 'Five studio-grade product shots on clean and lifestyle backgrounds.' },
      { name: 'Interactive 3D', price: '$1.8k – $3.2k', time: '5 days', desc: 'A 360° turntable video plus a web-ready interactive 3D model.' },
      { name: 'Virtual Brand World', price: '$4k – $7.5k', time: '10 days', desc: 'A full 3D environment, 12 render scenes and a short reel.' }
    ]
  }
};

const CHAPTERS: { id: ChapterId; label: string }[] = [
  { id: 'meet', label: 'Meet the talent' },
  { id: 'process', label: 'How it works' },
  { id: 'invest', label: 'Investment' },
  { id: 'protect', label: 'Protection' },
  { id: 'start', label: 'Get started' }
];

const FAQS = [
  {
    q: 'Do I own everything that gets created?',
    a: 'Yes. When you approve a milestone and funds are released from escrow, 100% of the commercial rights, code and source files transfer to your business.'
  },
  {
    q: 'What if the work doesn’t match my brief?',
    a: 'You review drafts, previews or staging builds before approving anything. Request revisions, and if you still can’t agree, Refeir mediation steps in. Your money stays protected until then.'
  },
  {
    q: 'Is signing up free?',
    a: 'Creating a client account is completely free. You only fund a milestone when you’ve chosen a specialist and agreed on the scope.'
  },
  {
    q: 'Can I get help choosing the right specialist?',
    a: 'Absolutely. After signing up, a Refeir Scout can review your brief and introduce you to the best-matched, verified specialists at no extra cost.'
  }
];

export const AiWizardsPage: React.FC<AiWizardsPageProps> = ({ onNavigate, initialPillar }) => {
  const [pillar, setPillar] = useState<PillarType>(initialPillar || 'creative');
  const [tierIndex, setTierIndex] = useState<number>(1);
  const [role, setRole] = useState<RoleType>('client');
  const [activeChapter, setActiveChapter] = useState<ChapterId | null>(null);
  const [barsIn, setBarsIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  const config = PILLARS[pillar];
  const tier = config.tiers[tierIndex];

  // Sync with route changes (e.g. clicking a different homepage CTA)
  useEffect(() => {
    if (initialPillar) setPillar(initialPillar);
  }, [initialPillar]);

  // Reset package choice to the most popular tier when switching discipline
  useEffect(() => {
    setTierIndex(1);
  }, [pillar]);

  // Track the chapter currently in view for the progress rail
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveChapter(entry.target.id.replace('aw-', '') as ChapterId);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    CHAPTERS.forEach(c => {
      const el = document.getElementById(`aw-${c.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Soft reveal-on-scroll for content blocks (re-run when discipline swaps content)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    root.querySelectorAll('.rf-aw-reveal:not(.is-in)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pillar]);

  // Animate comparison bars once they enter the viewport
  useEffect(() => {
    const el = compareRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setBarsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: ChapterId) => {
    document.getElementById(`aw-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeIndex = activeChapter ? CHAPTERS.findIndex(c => c.id === activeChapter) : -1;

  const pct = (part: number, whole: number) => `${Math.max(6, Math.round((part / whole) * 100))}%`;

  const handleRegister = () => {
    try {
      sessionStorage.setItem(
        'rf_ai_wizard_intent',
        JSON.stringify({ discipline: config.label, package: tier.name, budget: tier.price, timeline: tier.time, role })
      );
    } catch {
      /* storage unavailable — continue to signup */
    }
    onNavigate(`/register?role=${role}`);
  };

  const rootStyle = useMemo(
    () =>
      ({
        '--aw-accent': config.accent,
        '--aw-accent-soft': config.accentSoft,
        '--aw-accent-ink': config.accentInk
      }) as React.CSSProperties,
    [config]
  );

  const NextButton: React.FC<{ to: ChapterId; label: string }> = ({ to, label }) => (
    <div className="rf-aw-next">
      <button type="button" className="rf-aw-next-btn" onClick={() => scrollTo(to)}>
        {label}
        <span className="rf-aw-next-arrow">
          <ChevronDown size={18} />
        </span>
      </button>
    </div>
  );

  return (
    <div className="rf-aw" ref={rootRef} style={rootStyle}>
      {/* ============ HERO ============ */}
      <section className="rf-aw-hero">
        <div className="rf-aw-hero-glow" />
        <div className="rf-aw-wrap">
          <div className="rf-aw-hero-grid">
            <div key={`hero-copy-${pillar}`} className="rf-aw-swap">
              <span className="rf-aw-eyebrow">
                <span className="rf-aw-eyebrow-dot" />
                {config.eyebrow}
              </span>
              <h1 className="rf-aw-h1">
                {config.title}
                <br />
                <span className="rf-aw-accent-text">{config.highlight}</span>
              </h1>
              <p className="rf-aw-lead">{config.lead}</p>

              <div className="rf-aw-pillars" role="tablist" aria-label="Choose a discipline">
                {(Object.keys(PILLARS) as PillarType[]).map(key => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={pillar === key}
                    className={`rf-aw-pillar${pillar === key ? ' is-active' : ''}`}
                    onClick={() => setPillar(key)}
                  >
                    <span className="rf-aw-pillar-icon">{PILLARS[key].icon}</span>
                    {PILLARS[key].short}
                  </button>
                ))}
              </div>

              <div className="rf-aw-hero-actions">
                <button type="button" className="rf-aw-btn rf-aw-btn-primary" onClick={() => scrollTo('meet')}>
                  Show me how it works
                  <ArrowRight size={18} />
                </button>
                <button type="button" className="rf-aw-btn rf-aw-btn-ghost" onClick={() => scrollTo('start')}>
                  I’m ready to start
                </button>
              </div>

              <div className="rf-aw-trust-row">
                <span><ShieldCheck size={16} /> Escrow-protected</span>
                <span><BadgeCheck size={16} /> Vetted specialists</span>
                <span><Award size={16} /> 100% IP ownership</span>
              </div>
            </div>

            <div className="rf-aw-visual" key={`hero-visual-${pillar}`}>
              <div className="rf-aw-blob" />
              <div className="rf-aw-blob-ring" />

              <div className="rf-aw-portrait rf-aw-portrait-left rf-aw-swap">
                <img src={config.wizards[1].image} alt={config.wizards[1].name} loading="lazy" />
              </div>
              <div className="rf-aw-portrait rf-aw-portrait-right rf-aw-swap">
                <img src={config.wizards[2].image} alt={config.wizards[2].name} loading="lazy" />
              </div>
              <div className="rf-aw-portrait rf-aw-portrait-main rf-aw-swap">
                <img src={config.wizards[0].image} alt={config.wizards[0].name} />
                <div className="rf-aw-portrait-tag">
                  <strong>
                    {config.wizards[0].name} {config.wizards[0].country}
                  </strong>
                  <span>{config.wizards[0].role}</span>
                </div>
              </div>

              <div className="rf-aw-chip rf-aw-chip-a">
                <Star size={15} /> 4.9 average rating
              </div>
              <div className="rf-aw-chip rf-aw-chip-b">
                <Lock size={15} /> Funds held in escrow
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STICKY JOURNEY RAIL ============ */}
      <div className="rf-aw-rail-holder">
        <nav className="rf-aw-rail" aria-label="Journey progress">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`rf-aw-rail-btn${activeChapter === c.id ? ' is-active' : ''}${i < activeIndex ? ' is-done' : ''}`}
              onClick={() => scrollTo(c.id)}
            >
              <span className="rf-aw-rail-num">{i < activeIndex ? <Check size={12} /> : i + 1}</span>
              <span className="rf-aw-rail-text">{c.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ============ 1. MEET THE TALENT ============ */}
      <section id="aw-meet" className="rf-aw-chapter">
        <div className="rf-aw-wrap">
          <div className="rf-aw-chapter-head rf-aw-reveal">
            <div>
              <span className="rf-aw-step-label">Step 1 of 5</span>
              <h2 className="rf-aw-h2">The people behind the magic</h2>
              <p className="rf-aw-lead">
                Every specialist is identity-verified and portfolio-reviewed. Here are a few who are taking on {config.label.toLowerCase()} projects right now.
              </p>
            </div>
          </div>

          <div className="rf-aw-wizards" key={`wizards-${pillar}`}>
            {config.wizards.map((w, i) => (
              <article key={w.name} className={`rf-aw-wizard rf-aw-reveal rf-aw-d${i + 1}`}>
                <div className="rf-aw-wizard-photo">
                  <img src={w.image} alt={w.name} loading="lazy" />
                  <span className="rf-aw-wizard-rating">
                    <Star size={13} /> {w.rating}
                  </span>
                </div>
                <div className="rf-aw-wizard-body">
                  <h3 className="rf-aw-wizard-name">
                    {w.name} {w.country}
                  </h3>
                  <p className="rf-aw-wizard-role">{w.role}</p>
                  <div className="rf-aw-wizard-meta">
                    <span>{w.projects} projects delivered</span>
                    <strong>{w.rate}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rf-aw-tools rf-aw-reveal" key={`tools-${pillar}`}>
            {config.tools.map(t => (
              <span key={t} className="rf-aw-tool">
                {t}
              </span>
            ))}
          </div>

          <NextButton to="process" label="See how a project runs" />
        </div>
      </section>

      {/* ============ 2. HOW IT WORKS ============ */}
      <section id="aw-process" className="rf-aw-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-aw-wrap">
          <div className="rf-aw-chapter-head rf-aw-reveal">
            <div>
              <span className="rf-aw-step-label">Step 2 of 5</span>
              <h2 className="rf-aw-h2">From idea to delivery in three moves</h2>
              <p className="rf-aw-lead">No agency back-and-forth. You stay in the loop at every milestone, and nothing is final until you approve it.</p>
            </div>
          </div>

          <div className="rf-aw-process" key={`process-${pillar}`}>
            <div className="rf-aw-process-line" />
            {config.process.map((s, i) => (
              <div key={s.name} className={`rf-aw-step rf-aw-reveal rf-aw-d${i + 1}`}>
                <div className="rf-aw-step-num">{`0${i + 1}`}</div>
                <div className="rf-aw-step-card">
                  <span className="rf-aw-step-time">
                    <Clock size={13} /> {s.time}
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rf-aw-outcomes rf-aw-reveal" key={`outcomes-${pillar}`}>
            <h4>What lands in your inbox</h4>
            <ul className="rf-aw-outcome-list">
              {config.outcomes.map(o => (
                <li key={o}>
                  <Check size={17} /> {o}
                </li>
              ))}
            </ul>
          </div>

          <NextButton to="invest" label="What will it cost?" />
        </div>
      </section>

      {/* ============ 3. INVESTMENT ============ */}
      <section id="aw-invest" className="rf-aw-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-aw-wrap">
          <div className="rf-aw-chapter-head rf-aw-reveal">
            <div>
              <span className="rf-aw-step-label">Step 3 of 5</span>
              <h2 className="rf-aw-h2">A fraction of the cost. A fraction of the wait.</h2>
              <p className="rf-aw-lead">Pick the package closest to what you need. We’ll carry your choice through to your brief.</p>
            </div>
          </div>

          <div className="rf-aw-compare rf-aw-reveal" ref={compareRef}>
            <div className="rf-aw-compare-row">
              <div className="rf-aw-compare-label">
                <strong>Budget</strong>
                {config.compare.oldLabel}
              </div>
              <div className="rf-aw-bar-track">
                <div className="rf-aw-bar rf-aw-bar-old" style={{ width: barsIn ? '100%' : '0%' }}>
                  {config.compare.oldCost}
                </div>
              </div>
            </div>
            <div className="rf-aw-compare-row">
              <div className="rf-aw-compare-label">
                <strong>&nbsp;</strong>
                {config.compare.newLabel}
              </div>
              <div className="rf-aw-bar-track">
                <div
                  className="rf-aw-bar rf-aw-bar-new"
                  style={{ width: barsIn ? pct(config.compare.newCostMax, config.compare.oldCostMax) : '0%' }}
                >
                  {config.compare.newCost}
                </div>
              </div>
            </div>
            <div className="rf-aw-compare-row" style={{ marginTop: '1.6rem' }}>
              <div className="rf-aw-compare-label">
                <strong>Timeline</strong>
                {config.compare.oldLabel}
              </div>
              <div className="rf-aw-bar-track">
                <div className="rf-aw-bar rf-aw-bar-old" style={{ width: barsIn ? '100%' : '0%' }}>
                  {config.compare.oldTime}
                </div>
              </div>
            </div>
            <div className="rf-aw-compare-row">
              <div className="rf-aw-compare-label">
                <strong>&nbsp;</strong>
                {config.compare.newLabel}
              </div>
              <div className="rf-aw-bar-track">
                <div
                  className="rf-aw-bar rf-aw-bar-new"
                  style={{ width: barsIn ? pct(config.compare.newDays, config.compare.oldDays) : '0%' }}
                >
                  {config.compare.newTime}
                </div>
              </div>
            </div>
            <div className="rf-aw-compare-foot">
              <span>
                Typical saving: <strong>{config.compare.saving}</strong>
              </span>
              <span>No studio, travel or crew overheads</span>
              <span>Pay per milestone, never upfront</span>
            </div>
          </div>

          <div className="rf-aw-tiers" key={`tiers-${pillar}`}>
            {config.tiers.map((t, i) => (
              <button
                key={t.name}
                type="button"
                className={`rf-aw-tier rf-aw-reveal rf-aw-d${i + 1}${tierIndex === i ? ' is-selected' : ''}`}
                onClick={() => setTierIndex(i)}
                aria-pressed={tierIndex === i}
              >
                <span className="rf-aw-tier-check">
                  <Check size={14} />
                </span>
                {i === 1 && <span className="rf-aw-tier-pop">Most popular</span>}
                <p className="rf-aw-tier-name">{t.name}</p>
                <div className="rf-aw-tier-price">{t.price}</div>
                <div className="rf-aw-tier-time">
                  <Clock size={13} /> Delivered in {t.time}
                </div>
                <p className="rf-aw-tier-desc">{t.desc}</p>
              </button>
            ))}
          </div>

          <NextButton to="protect" label="How am I protected?" />
        </div>
      </section>

      {/* ============ 4. PROTECTION ============ */}
      <section id="aw-protect" className="rf-aw-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-aw-wrap">
          <div className="rf-aw-chapter-head rf-aw-reveal">
            <div>
              <span className="rf-aw-step-label">Step 4 of 5</span>
              <h2 className="rf-aw-h2">Your money moves only when you say so</h2>
              <p className="rf-aw-lead">Refeir Trust Vault holds every payment in escrow, so you and your specialist can focus on great work.</p>
            </div>
          </div>

          <div className="rf-aw-escrow rf-aw-reveal">
            <div className="rf-aw-escrow-step">
              <div className="rf-aw-escrow-icon">
                <Wallet size={24} />
              </div>
              <h3>You fund a milestone</h3>
              <p>Money goes into the Trust Vault, not to the specialist. They can see it’s secured and start work with confidence.</p>
              <span className="rf-aw-escrow-arrow">
                <ArrowRight size={14} />
              </span>
            </div>
            <div className="rf-aw-escrow-step">
              <div className="rf-aw-escrow-icon">
                <FileCheck size={24} />
              </div>
              <h3>You review the work</h3>
              <p>Drafts, previews and staging builds land in your workspace. Ask for changes until it matches your brief.</p>
              <span className="rf-aw-escrow-arrow">
                <ArrowRight size={14} />
              </span>
            </div>
            <div className="rf-aw-escrow-step">
              <div className="rf-aw-escrow-icon">
                <ShieldCheck size={24} />
              </div>
              <h3>You approve and own it</h3>
              <p>Only then is payment released, and full commercial rights and source files transfer to you.</p>
            </div>
          </div>

          <div className="rf-aw-faq">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className={`rf-aw-faq-item rf-aw-reveal${isOpen ? ' is-open' : ''}`}>
                  <button type="button" className="rf-aw-faq-q" onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen}>
                    {f.q}
                    <Plus size={18} />
                  </button>
                  <div className="rf-aw-faq-a">
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <NextButton to="start" label="I’m ready. Let’s go" />
        </div>
      </section>

      {/* ============ 5. GET STARTED ============ */}
      <section id="aw-start" className="rf-aw-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-aw-wrap">
          <div className="rf-aw-start rf-aw-reveal">
            <div className="rf-aw-start-blob" />
            <div className="rf-aw-start-grid">
              <div>
                <span className="rf-aw-step-label">Step 5 of 5</span>
                <h2 className="rf-aw-h2">Your project is one step away</h2>
                <p className="rf-aw-lead">
                  Create your free account and we’ll match you with verified {config.short.toLowerCase()} specialists within hours.
                </p>

                <div className="rf-aw-roles" role="radiogroup" aria-label="I am joining as">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={role === 'client'}
                    className={`rf-aw-role${role === 'client' ? ' is-selected' : ''}`}
                    onClick={() => setRole('client')}
                  >
                    <span className="rf-aw-role-icon">
                      <Briefcase size={18} />
                    </span>
                    <strong>I want to hire</strong>
                    <span>Brief a specialist and get proposals</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={role === 'talent'}
                    className={`rf-aw-role${role === 'talent' ? ' is-selected' : ''}`}
                    onClick={() => setRole('talent')}
                  >
                    <span className="rf-aw-role-icon">
                      <Compass size={18} />
                    </span>
                    <strong>I’m a specialist</strong>
                    <span>Get discovered by global brands</span>
                  </button>
                </div>

                <button type="button" className="rf-aw-btn rf-aw-btn-primary" onClick={handleRegister}>
                  {role === 'client' ? `${config.ctaVerb}: create free account` : 'Join as a specialist'}
                  <ArrowRight size={18} />
                </button>
                <p className="rf-aw-fineprint">
                  <ShieldCheck size={14} /> Free to join · No card required · Pay only per approved milestone
                </p>
              </div>

              <div className="rf-aw-brief" key={`brief-${pillar}-${role}`}>
                <div className="rf-aw-brief-head">
                  <span>{role === 'client' ? 'Your project brief' : 'Your specialist profile'}</span>
                  <span className="rf-aw-brief-live">Ready to submit</span>
                </div>

                {role === 'client' ? (
                  <>
                    <div className="rf-aw-brief-row">
                      <span>Discipline</span>
                      <strong>{config.label}</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Package</span>
                      <strong>{tier.name}</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Estimated budget</span>
                      <strong>{tier.price}</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Delivery</span>
                      <strong>{tier.time}</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Payment</span>
                      <strong>Milestone escrow</strong>
                    </div>
                    <div className="rf-aw-brief-team">
                      <div className="rf-aw-avatars">
                        {config.wizards.map(w => (
                          <img key={w.name} src={w.image} alt={w.name} loading="lazy" />
                        ))}
                      </div>
                      <span>{config.wizards.length} specialists available for this package</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rf-aw-brief-row">
                      <span>Discipline</span>
                      <strong>{config.label}</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Typical project value</span>
                      <strong>{config.tiers[0].price.split(' – ')[0]} – {config.tiers[2].price.split(' – ')[1]}</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Payouts</span>
                      <strong>Guaranteed via escrow</strong>
                    </div>
                    <div className="rf-aw-brief-row">
                      <span>Verification</span>
                      <strong>ID + portfolio review</strong>
                    </div>
                    <div className="rf-aw-brief-team">
                      <Users size={18} style={{ color: 'var(--aw-accent)', flexShrink: 0 }} />
                      <span>Join {config.wizards[0].name.split(' ')[0]}, {config.wizards[1].name.split(' ')[0]} and other top specialists</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
