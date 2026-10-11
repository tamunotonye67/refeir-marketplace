import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface AiWizardsPageProps {
  onNavigate: (path: string) => void;
  initialPillar?: 'creative' | 'agents' | 'visuals';
}

type PillarType = 'creative' | 'agents' | 'visuals';

export const AiWizardsPage: React.FC<AiWizardsPageProps> = ({ onNavigate, initialPillar }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activePillar, setActivePillar] = useState<PillarType>(() => {
    if (initialPillar) return initialPillar;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('pillar');
      if (p === 'agents') return 'agents';
      if (p === 'visuals') return 'visuals';
      if (p === 'creative') return 'creative';
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('agent')) return 'agents';
      if (hash.includes('visual') || hash.includes('3d')) return 'visuals';
      if (hash.includes('creative') || hash.includes('video') || hash.includes('wizard')) return 'creative';
    }
    return 'creative';
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('pillar');
      if (p === 'agents' || p === 'visuals' || p === 'creative') {
        setActivePillar(p as PillarType);
      }
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const PILLARS_CONFIG = {
    creative: {
      id: 'creative',
      badge: 'AI CREATIVE PRODUCTION',
      badgeColor: '#66BB2A',
      title: 'The AI Wizard era has arrived',
      subtitle: 'From ideation to final frame, work with renowned AI Video Wizards to create scroll-stopping content and campaigns that drive real impact.',
      ctaButtonText: 'Commission AI Video Talent',
      ctaSearchQuery: '/marketplace?q=AI%20Video',
      summary:
        'AI Creative Production replaces slow, multi-month physical film crews with agile neural video directors. Using state-of-the-art diffusion models, our talent directs cinematic commercial spots, narrative visual storytelling, and high-converting marketing campaigns in days instead of weeks.',
      buttonExplained:
        'When you see "Borrow a Wand" on Refeir, it means booking a vetted Generative AI Film Director or VFX lead who orchestrates complex multi-pass neural pipelines to bring your concept to life.',
      tools: ['Runway Gen-3 Alpha', 'OpenAI Sora', 'Midjourney v6', 'ComfyUI Workflows', 'Stable Video Diffusion', 'DaVinci Neural Colorist'],
      deliverables: [
        'High-resolution 4K master commercials and promo videos',
        'Multi-aspect ratio cutdowns (16:9 widescreen, 9:16 reels/TikTok, 1:1 square)',
        'Synthesized audio scoring, voice synthesis, and Foley sound design',
        'Complete commercial copyright ownership and source project files'
      ],
      process: [
        {
          step: '01',
          name: 'Concept & Narrative Prompt Scripting',
          desc: 'Your AI Director develops narrative storyboards, character style sheets, and prompt architectures aligned with your brand identity.'
        },
        {
          step: '02',
          name: 'Consistency-Locked Video Generation',
          desc: 'Using motion brushes, character seeds, and custom LoRA models to guarantee facial and wardrobe consistency across every camera angle.'
        },
        {
          step: '03',
          name: 'Upscaling, Sound Design & DaVinci Mastering',
          desc: 'Neural video upscaling to native 4K, synchronized voice cloning, Foley audio mastering, and broadcast-ready color correction.'
        }
      ],
      comparison: {
        traditional: {
          label: 'Traditional Video Production',
          cost: '$20,000 – $75,000',
          timeline: '6 to 10 weeks',
          details: 'Physical film crews, studio rental, actors, travel, lighting rigs, and painful reshoots.'
        },
        refeir: {
          label: 'Refeir AI Creative Studio',
          cost: '$1,200 – $6,500',
          timeline: '3 to 7 days',
          details: 'Zero physical production overhead, limitless virtual locations, infinite revisions, and 4K masters.'
        }
      },
      tiers: [
        { name: 'Viral Social Asset', price: '$800 – $1,500', time: '3 days', desc: '15-30s high-impact AI hook video optimized for TikTok and Instagram ads.' },
        { name: 'Brand Hero Commercial', price: '$2,500 – $4,500', time: '5 days', desc: '60s full cinematic brand narrative with custom voiceover and sound design.' },
        { name: 'Full Campaign Suite', price: '$5,000 – $8,500', time: '10 days', desc: '3 hero variations, 8 aspect-ratio cutdowns, static banners, and source workflows.' }
      ]
    },
    agents: {
      id: 'agents',
      badge: 'AUTONOMOUS ENGINEERING',
      badgeColor: '#F6B21A',
      title: 'Architect Autonomous AI Agents',
      subtitle: 'Supercharge your operations with elite African AI engineers building bespoke RAG pipelines, fine-tuned LLMs, and custom workflow automations.',
      ctaButtonText: 'Deploy Autonomous Agent Engineers',
      ctaSearchQuery: '/marketplace?q=AI%20Agents',
      summary:
        'Autonomous Engineering transforms rigid software into cognitive, self-correcting agentic workflows. Our engineers build custom LLM architectures and Retrieval-Augmented Generation (RAG) systems that interact with your company data, automate complex business workflows, and act as tireless digital team members.',
      buttonExplained:
        'When you see "Deploy an Agent" on Refeir, it means commissioning an AI Systems Architect to build custom, secure autonomous pipelines that connect directly to your databases, APIs, and business operations.',
      tools: ['LangChain', 'LlamaIndex', 'Pinecone & Qdrant', 'CrewAI & AutoGen', 'vLLM & Ollama', 'pgvector & Weaviate'],
      deliverables: [
        'Production-ready autonomous agent codebase containerized with Docker',
        'Secure RAG pipeline indexing proprietary company documentation and vector embeddings',
        'Custom API endpoints and webhooks integrated into your CRM or internal dashboard',
        'Comprehensive evaluation suites measuring latency, accuracy, and hallucination rates'
      ],
      process: [
        {
          step: '01',
          name: 'Knowledge Ingestion & Vector Indexing',
          desc: 'Extracting, chunking, and embedding your unstructured business data (PDFs, Notion, databases) into private, low-latency vector databases.'
        },
        {
          step: '02',
          name: 'Tooling, APIs & Reasoning Loops',
          desc: 'Empowering the agent with tool calling—querying SQL, sending transactional emails, processing documents, and multi-agent peer reviews.'
        },
        {
          step: '03',
          name: 'Guardrailing, Benchmarks & Cloud Deployment',
          desc: 'Implementing strict security guardrails against prompt injection, testing with automated evals, and deploying to your cloud infrastructure.'
        }
      ],
      comparison: {
        traditional: {
          label: 'Traditional Software Automation',
          cost: '$40,000 – $120,000',
          timeline: '3 to 6 months',
          details: 'Rigid rule engines, fragile regex patterns, endless manual edge cases, and high maintenance overhead.'
        },
        refeir: {
          label: 'Refeir Autonomous Agent Squad',
          cost: '$2,800 – $9,500',
          timeline: '1 to 3 weeks',
          details: 'Adaptive cognitive architectures, natural language interfaces, self-correcting loops, and secure private hosting.'
        }
      },
      tiers: [
        { name: 'Internal Knowledge RAG', price: '$1,800 – $3,200', time: '5 days', desc: 'Private document search assistant with semantic citation and team access controls.' },
        { name: 'Autonomous Workflow Agent', price: '$3,500 – $6,500', time: '12 days', desc: 'Multi-tool agent automating lead qualification, report generation, or customer support.' },
        { name: 'Enterprise Multi-Agent System', price: '$7,000 – $14,000', time: '21 days', desc: 'Orchestrated squad of specialized agents collaborating on end-to-end operational processes.' }
      ]
    },
    visuals: {
      id: 'visuals',
      badge: 'GENERATIVE VISUALS & 3D',
      badgeColor: '#F47C20',
      title: 'Hyper-Real 3D & Brand Generation',
      subtitle: 'Transform product concepts into stunning visual assets, photo-realistic CGI renders, and generative brand collateral crafted by top digital artists.',
      ctaButtonText: 'Commission 3D & Visual Artists',
      ctaSearchQuery: '/marketplace?q=Generative%20Design',
      summary:
        'Generative Visuals & 3D merges computational 3D modeling with generative diffusion models to deliver hyper-realistic product imagery, spatial graphics, and interactive brand collateral without physical prototyping delays.',
      buttonExplained:
        'When you see "Commission Visuals" on Refeir, it means hiring specialized 3D artists and spatial designers who turn sketches, CAD files, or product concepts into photorealistic billboard-ready renders and e-commerce assets.',
      tools: ['Blender 3D', 'Unreal Engine 5', 'Stable Diffusion XL', 'ControlNet & LoRA', 'Spline 3D', 'Octane / Cycles Raytracing'],
      deliverables: [
        'Photorealistic 8K render images suitable for print packaging, billboards, and e-commerce',
        'Interactive 3D web models (GLTF, USDZ) for online product configurators',
        'Multi-angle turntable product animations and lighting variations',
        'Layered source project files (.blend, .c4d, .psd) with full commercial IP transfer'
      ],
      process: [
        {
          step: '01',
          name: 'CAD Ingestion & Mesh Optimization',
          desc: 'Importing physical product specifications, CAD models, or converting 2D concept art into clean, high-density 3D geometry.'
        },
        {
          step: '02',
          name: 'Physics-Based Texturing & Studio Lighting',
          desc: 'Simulating realistic material shaders (glass refraction, brushed metal, woven fabric) combined with ControlNet guided texture detailing.'
        },
        {
          step: '03',
          name: 'Raytraced Rendering & Interactive Exports',
          desc: 'Generating sub-24h multi-angle renders, interactive 3D web viewer exports, and multi-channel compositing passes.'
        }
      ],
      comparison: {
        traditional: {
          label: 'Traditional Product Photography',
          cost: '$15,000 – $40,000',
          timeline: '4 to 8 weeks',
          details: 'Physical prototype manufacturing, international freight shipping, studio staging, and destructive re-renders.'
        },
        refeir: {
          label: 'Refeir Generative 3D Studio',
          cost: '$900 – $4,200',
          timeline: '24 hours to 5 days',
          details: 'Instant geometry tweaks, zero physical manufacturing required, unlimited digital angles, and sub-24h options.'
        }
      },
      tiers: [
        { name: 'Product Packshot Suite', price: '$600 – $1,200', time: '48 hours', desc: '5 photorealistic studio-grade product shots with transparent and lifestyle backgrounds.' },
        { name: 'Interactive 3D & Turntable', price: '$1,800 – $3,200', time: '5 days', desc: '360° animated turntable video plus web-ready GLTF/USDZ interactive model.' },
        { name: 'Complete Virtual Brand World', price: '$4,000 – $7,500', time: '10 days', desc: 'Full architectural environment, 12 render scenes, interactive web model, and video reel.' }
      ]
    }
  };

  const currentConfig = PILLARS_CONFIG[activePillar];

  const FAQS = [
    {
      q: 'What do the three snapshots on the homepage represent?',
      a: 'The snapshots represent Refeir’s three specialized AI innovation disciplines: AI Creative Production (filmmaking and high-impact video), Autonomous Engineering (self-executing AI agents and enterprise RAG systems), and Generative Visuals & 3D (photorealistic product renders and interactive CGI assets). Instead of generic freelancing, these represent curated, production-grade AI pipelines.'
    },
    {
      q: 'Do I own 100% of the intellectual property (IP) created?',
      a: 'Yes. Upon milestone approval and payment release through Refeir Trust Vault escrow, 100% of the commercial rights, copyrights, codebases, and source asset files are legally and exclusively transferred to your business.'
    },
    {
      q: 'How does milestone escrow protect my project?',
      a: 'Your project funds remain securely locked in Refeir Trust Vault escrow until deliverables are delivered and inspected. You review watermarked drafts, staged code repositories, or preview renders before approving milestone releases.'
    },
    {
      q: 'What if I need help deciding between these disciplines?',
      a: 'You can consult with a Refeir Scout or post a project scope on our marketplace. Refeir Scouts are domain experts who evaluate your technical or creative requirements and introduce you to the ideal verified specialist without any upfront matchmaking fees.'
    },
    {
      q: 'Can African AI engineers integrate with our existing stack?',
      a: 'Yes. Our autonomous engineering talent works routinely with global engineering stacks including AWS, Google Cloud, Azure, Supabase, Postgres, Docker, Kubernetes, LangChain, and enterprise REST/GraphQL APIs.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '85vh', backgroundColor: 'var(--rf-bg-base)' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: 'clamp(4rem, 8vw, 6.5rem) 1.5rem clamp(3.5rem, 6vw, 4.5rem)',
          textAlign: 'center',
          background: isDark
            ? 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(102, 187, 42, 0.16), transparent 70%), var(--rf-bg-base)'
            : 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(102, 187, 42, 0.10), transparent 70%), var(--rf-bg-base)',
          borderBottom: '1px solid var(--rf-bg-card-border)',
          position: 'relative'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '920px', margin: '0 auto' }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(102, 187, 42, 0.12)',
              border: '1px solid rgba(102, 187, 42, 0.3)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              marginBottom: '1.5rem'
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Refeir AI Innovation & Creative Studios
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--rf-font-display)',
              fontSize: 'clamp(2.3rem, 5.2vw, 3.85rem)',
              fontWeight: 600,
              color: 'var(--rf-cream)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.35rem'
            }}
          >
            Everything you need to know about Refeir’s AI Disciplines
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--rf-slate-300)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2.5rem'
            }}
          >
            A deep-dive breakdown of the technologies, workflows, deliverables, and commercial protections behind each of the three featured disciplines on Refeir.
          </p>

          {/* Interactive Discipline Switcher */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--rf-bg-surface)',
              padding: '0.35rem',
              borderRadius: '16px',
              border: '1px solid var(--rf-bg-card-border)',
              maxWidth: '100%',
              overflowX: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              gap: '0.35rem'
            }}
          >
            <button
              onClick={() => setActivePillar('creative')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activePillar === 'creative' ? '#66BB2A' : 'transparent',
                color: activePillar === 'creative' ? '#0F1E13' : 'var(--rf-slate-300)',
                fontWeight: activePillar === 'creative' ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              AI Creative Production
            </button>

            <button
              onClick={() => setActivePillar('agents')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activePillar === 'agents' ? '#F6B21A' : 'transparent',
                color: activePillar === 'agents' ? '#1B1400' : 'var(--rf-slate-300)',
                fontWeight: activePillar === 'agents' ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              Autonomous Engineering
            </button>

            <button
              onClick={() => setActivePillar('visuals')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activePillar === 'visuals' ? '#F47C20' : 'transparent',
                color: activePillar === 'visuals' ? '#FFFFFF' : 'var(--rf-slate-300)',
                fontWeight: activePillar === 'visuals' ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              Generative Visuals & 3D
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE PILLAR COMPREHENSIVE BREAKDOWN */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 1.5rem', backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Snapshot Header Card */}
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              borderRadius: '24px',
              backgroundColor: 'var(--rf-bg-base)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              marginBottom: '3rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: currentConfig.badgeColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {currentConfig.badge}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--rf-font-sans)',
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 600,
                color: 'var(--rf-cream)',
                lineHeight: 1.2,
                marginBottom: '1rem'
              }}
            >
              {currentConfig.title}
            </h2>

            <p style={{ fontSize: '1.15rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '780px' }}>
              {currentConfig.subtitle}
            </p>

            {/* Explanation of the Homepage Snapshot */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(102, 187, 42, 0.07)',
                border: '1px solid rgba(102, 187, 42, 0.22)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Snapshot Context & Meaning
              </div>
              <p style={{ fontSize: '0.98rem', color: 'var(--rf-slate-200)', lineHeight: 1.55, margin: 0 }}>
                {currentConfig.buttonExplained}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--rf-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                Core Tools & Neural Engines
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {currentConfig.tools.map((tool, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--rf-bg-surface)',
                      border: '1px solid var(--rf-bg-card-border)',
                      color: 'var(--rf-cream)'
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Commission CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => onNavigate(currentConfig.ctaSearchQuery)}
                className="rf-btn rf-btn-primary rf-btn-lg"
                style={{
                  fontWeight: 700,
                  padding: '0.9rem 2rem',
                  fontSize: '1rem',
                  boxShadow: '0 4px 20px rgba(102, 187, 42, 0.45)'
                }}
              >
                <span>{currentConfig.ctaButtonText}</span>
              </button>

              <button
                onClick={() => onNavigate('/scout-sourcing')}
                className="rf-btn rf-btn-secondary rf-btn-lg"
                style={{ fontWeight: 600, padding: '0.9rem 1.75rem', fontSize: '1rem' }}
              >
                <span>Consult with an AI Scout</span>
              </button>
            </div>
          </div>

          {/* 3-STEP PRODUCTION PIPELINE */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Methodology
              </span>
              <h3 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 600, color: 'var(--rf-cream)', marginTop: '0.5rem' }}>
                How a project runs on Refeir
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {currentConfig.process.map((stepItem, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '2rem',
                    borderRadius: '20px',
                    backgroundColor: 'var(--rf-bg-base)',
                    border: '1px solid var(--rf-bg-card-border)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: currentConfig.badgeColor,
                      fontFamily: 'monospace',
                      marginBottom: '1rem'
                    }}
                  >
                    {stepItem.step}
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {stepItem.name}
                  </h4>
                  <p style={{ fontSize: '0.925rem', color: 'var(--rf-slate-400)', lineHeight: 1.6, margin: 0 }}>
                    {stepItem.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TRADITIONAL VS REFEIR COMPARISON */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Cost & Efficiency
              </span>
              <h3 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 600, color: 'var(--rf-cream)', marginTop: '0.5rem' }}>
                The Old Method vs. The Refeir AI Way
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Traditional */}
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--rf-bg-base)',
                  border: '1px solid var(--rf-bg-card-border)',
                  opacity: 0.85
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Traditional Workflow
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '1.25rem' }}>
                  {currentConfig.comparison.traditional.label}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Typical Cost: </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--rf-cream)' }}>{currentConfig.comparison.traditional.cost}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Turnaround: </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--rf-cream)' }}>{currentConfig.comparison.traditional.timeline}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--rf-slate-400)', lineHeight: 1.6, margin: 0 }}>
                  {currentConfig.comparison.traditional.details}
                </p>
              </div>

              {/* Refeir AI */}
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--rf-bg-base)',
                  border: '2px solid #66BB2A',
                  boxShadow: '0 8px 32px rgba(102, 187, 42, 0.12)'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Recommended Refeir Pipeline
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '1.25rem' }}>
                  {currentConfig.comparison.refeir.label}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Typical Cost: </span>
                    <strong style={{ fontSize: '1.05rem', color: '#66BB2A' }}>{currentConfig.comparison.refeir.cost}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Turnaround: </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--rf-cream)' }}>{currentConfig.comparison.refeir.timeline}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, margin: 0 }}>
                  {currentConfig.comparison.refeir.details}
                </p>
              </div>
            </div>
          </div>

          {/* DELIVERABLES & GUARANTEES */}
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 2.5rem)',
              borderRadius: '20px',
              backgroundColor: 'var(--rf-bg-base)',
              border: '1px solid var(--rf-bg-card-border)',
              marginBottom: '3.5rem'
            }}
          >
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '1.25rem' }}>
              Standard Deliverables & Guarantees Included
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {currentConfig.deliverables.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--rf-bg-surface)',
                    border: '1px solid var(--rf-bg-card-border)',
                    fontSize: '0.925rem',
                    color: 'var(--rf-slate-200)',
                    lineHeight: 1.5
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* TYPICAL TIERS & PRICING */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Pricing Guidance
              </span>
              <h3 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 600, color: 'var(--rf-cream)', marginTop: '0.5rem' }}>
                Typical Scope & Investment Estimates
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {currentConfig.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '2rem',
                    borderRadius: '20px',
                    backgroundColor: 'var(--rf-bg-base)',
                    border: '1px solid var(--rf-bg-card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                      {tier.name}
                    </h5>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#66BB2A', marginBottom: '0.35rem' }}>
                      {tier.price}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--rf-slate-400)', marginBottom: '1rem' }}>
                      Delivered in {tier.time}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--rf-slate-300)', lineHeight: 1.55, margin: 0 }}>
                      {tier.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.75rem' }}>
                    <button
                      onClick={() => onNavigate(currentConfig.ctaSearchQuery)}
                      className="rf-btn rf-btn-primary rf-btn-sm"
                      style={{ width: '100%', fontWeight: 700, justifyContent: 'center' }}
                    >
                      <span>Explore Talent in this Tier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM ESCROW & IP ASSIGNMENT */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 1.5rem', backgroundColor: 'var(--rf-bg-base)' }}>
        <div className="rf-container" style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Security & Compliance
          </span>
          <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 600, color: 'var(--rf-cream)', margin: '0.5rem 0 1rem' }}>
            Built on Trust Vault Escrow & Legal IP Assignment
          </h3>
          <p style={{ fontSize: '1.05rem', color: 'var(--rf-slate-300)', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Every AI contract on Refeir is backed by our strict financial and intellectual property standards.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ padding: '1.75rem', borderRadius: '16px', backgroundColor: 'var(--rf-bg-surface)', border: '1px solid var(--rf-bg-card-border)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                100% Commercial IP Transfer
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)', lineHeight: 1.6, margin: 0 }}>
                Upon milestone approval, full exclusive copyright, patents, and commercial publication rights are permanently assigned to you.
              </p>
            </div>

            <div style={{ padding: '1.75rem', borderRadius: '16px', backgroundColor: 'var(--rf-bg-surface)', border: '1px solid var(--rf-bg-card-border)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Milestone Inspection Prior to Release
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)', lineHeight: 1.6, margin: 0 }}>
                Talent posts deliverables to your contract workspace. You only approve and release milestone funds when deliverables match scope.
              </p>
            </div>

            <div style={{ padding: '1.75rem', borderRadius: '16px', backgroundColor: 'var(--rf-bg-surface)', border: '1px solid var(--rf-bg-card-border)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Strict Confidentiality & Privacy
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)', lineHeight: 1.6, margin: 0 }}>
                Proprietary company data, prompt architectures, and confidential training materials are protected by binding platform NDAs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPANDABLE FAQ SECTION */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 1.5rem', backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Common Questions
            </span>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 600, color: 'var(--rf-cream)', marginTop: '0.5rem' }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--rf-bg-base)',
                    borderRadius: '16px',
                    border: '1px solid var(--rf-bg-card-border)',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--rf-cream)', lineHeight: 1.4 }}>
                      {faq.q}
                    </span>
                    <span style={{ color: 'var(--rf-slate-400)', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem',
                        fontSize: '0.95rem',
                        color: 'var(--rf-slate-300)',
                        lineHeight: 1.65,
                        borderTop: '1px solid var(--rf-bg-card-border)',
                        paddingTop: '1rem'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM FINAL CTA BANNER */}
      <section
        style={{
          padding: 'clamp(3.5rem, 6vw, 5rem) 1.5rem',
          backgroundColor: 'var(--rf-bg-base)',
          textAlign: 'center',
          borderTop: '1px solid var(--rf-bg-card-border)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 600, color: 'var(--rf-cream)', lineHeight: 1.2, marginBottom: '1rem' }}>
            Ready to build with Africa’s premier AI specialists?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Deploy autonomous agents, commission cinematic generative video, or create photorealistic 3D brand assets backed by Refeir escrow.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate(currentConfig.ctaSearchQuery)}
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{ fontWeight: 700, padding: '0.9rem 2.25rem', fontSize: '1rem', boxShadow: '0 4px 20px rgba(102, 187, 42, 0.45)' }}
            >
              <span>Explore Verified Talent</span>
            </button>

            <button
              onClick={() => onNavigate('/scout-sourcing')}
              className="rf-btn rf-btn-secondary rf-btn-lg"
              style={{ fontWeight: 600, padding: '0.9rem 2rem', fontSize: '1rem' }}
            >
              <span>Learn About Scout Sourcing</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
