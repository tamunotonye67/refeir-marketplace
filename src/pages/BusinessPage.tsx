import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Users,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
  Award,
  Zap,
  TrendingUp,
  Clock,
  Compass,
  FileText,
  Calculator,
  ChevronDown,
  Calendar,
  DollarSign,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/business-enterprise.css';

interface BusinessPageProps {
  onNavigate: (path: string) => void;
}

type PodType = 'fullstack' | 'ai' | 'fintech' | 'design' | 'custom';

export const BusinessPage: React.FC<BusinessPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Interactive Pod / Team Sizer State
  const [selectedPod, setSelectedPod] = useState<PodType>('fullstack');

  // Interactive Savings Calculator State
  const [teamSize, setTeamSize] = useState<number>(3);
  const [durationMonths, setDurationMonths] = useState<number>(6);

  // Intake Form State
  const [intakeObjective, setIntakeObjective] = useState<string>('Deploy Full Engineering Pod');
  const [companyName, setCompanyName] = useState<string>('');
  const [workEmail, setWorkEmail] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [targetStack, setTargetStack] = useState<string>('');
  const [targetStartDate, setTargetStartDate] = useState<string>('Immediate (within 2 weeks)');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [submittedRefId, setSubmittedRefId] = useState<string>('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculation formulas
  const avgUsSalaryMonthly = 14500; // ~$174k/year base + recruiter fee + benefits
  const avgRefeirSalaryMonthly = 4800; // Top 1% vetted senior African staff engineer
  const monthlySavingsPerEng = avgUsSalaryMonthly - avgRefeirSalaryMonthly;
  const totalSavings = monthlySavingsPerEng * teamSize * durationMonths;
  const totalRefeirSpend = avgRefeirSalaryMonthly * teamSize * durationMonths;
  const totalUsSpend = avgUsSalaryMonthly * teamSize * durationMonths;
  const savingsPercent = Math.round(((totalUsSpend - totalRefeirSpend) / totalUsSpend) * 100);

  // Pod configurations
  const POD_DATA: Record<PodType, {
    title: string;
    tagline: string;
    leadRole: string;
    teamRoster: string[];
    techStack: string[];
    sla: string;
    rateRange: string;
  }> = {
    fullstack: {
      title: 'Fullstack & Cloud Engineering Pod',
      tagline: 'End-to-end web & mobile product delivery with resilient cloud architectures.',
      leadRole: 'Senior Staff Fullstack Architect (10+ yrs exp)',
      teamRoster: [
        '1x Senior Staff Lead (React, Next.js, Node/Go)',
        '2x Senior Fullstack Engineers (TypeScript, PostgreSQL)',
        '1x DevOps & Cloud Infrastructure Lead (AWS, Kubernetes, CI/CD)'
      ],
      techStack: ['Next.js', 'TypeScript', 'Go', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
      sla: 'Candidate shortlist delivered in 48 hours',
      rateRange: '$3,800 – $6,200 / engineer / month'
    },
    ai: {
      title: 'AI Studios & Autonomous Agents Pod',
      tagline: 'Custom generative workflows, LLM fine-tuning, and production multi-agent systems.',
      leadRole: 'Principal AI & Machine Learning Architect',
      teamRoster: [
        '1x Principal AI Architect (LLM orchestration, RAG architectures)',
        '1x Machine Learning & Prompt Optimization Engineer',
        '1x Computer Vision & Generative Media Specialist',
        '1x Fullstack AI Integration Developer'
      ],
      techStack: ['PyTorch', 'Hugging Face', 'LangChain', 'Llama 3', 'Pinecone', 'Whisper', 'Python', 'FastAPI'],
      sla: 'Candidate shortlist delivered in 48 hours',
      rateRange: '$4,500 – $7,500 / engineer / month'
    },
    fintech: {
      title: 'Pan-African FinTech & Mobile Money Pod',
      tagline: 'Cross-border escrow rails, payment gateway integrations, and multi-currency ledgers.',
      leadRole: 'Senior Mobile & FinTech Lead Architect',
      teamRoster: [
        '1x Senior Mobile Lead (Flutter & React Native cross-platform)',
        '2x FinTech Backend Engineers (Payment APIs, Webhooks, Ledgers)',
        '1x Smart Contract & Security Compliance Auditor'
      ],
      techStack: ['Flutter', 'Node.js', 'Go', 'Paystack/Flutterwave APIs', 'Mobile Money Rails', 'PCI-DSS', 'Solidity'],
      sla: 'Candidate shortlist delivered in 48 hours',
      rateRange: '$3,600 – $5,800 / engineer / month'
    },
    design: {
      title: 'Product Design & Design Systems Studio',
      tagline: 'High-converting UI/UX, unified brand design systems, and interactive 3D assets.',
      leadRole: 'Principal Product & Brand Design Director',
      teamRoster: [
        '1x Principal Product Designer (Figma Systems & User Journeys)',
        '1x Interaction & Motion Designer (Framer Motion, Micro-Interactions)',
        '1x Visual Identity & 3D Specialist'
      ],
      techStack: ['Figma', 'Design Tokens', 'Spline 3D', 'Adobe Suite', 'User Testing', 'Responsive Design'],
      sla: 'Candidate shortlist delivered in 24 hours',
      rateRange: '$3,200 – $5,200 / designer / month'
    },
    custom: {
      title: 'Custom Enterprise Deployment',
      tagline: 'Tailor-made team size, niche tech stacks, and dedicated talent success partner.',
      leadRole: 'Dedicated Refeir Enterprise Talent Partner',
      teamRoster: [
        'Flexible headcount: 1 to 25+ senior engineers & leads',
        'Custom jurisdiction targeting across 54 African countries',
        'Dedicated Refeir technical recruiter & sprint manager'
      ],
      techStack: ['Bespoke to your tech stack and internal workflow'],
      sla: 'Custom discovery call within 24 hours',
      rateRange: 'Bespoke milestone contracts'
    }
  };

  const currentPod = POD_DATA[selectedPod];

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !workEmail.trim()) return;

    const refId = `REF-ENT-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedRefId(refId);
    setFormSubmitted(true);
  };

  const handleSelectPodForIntake = (podKey: PodType) => {
    setSelectedPod(podKey);
    setIntakeObjective(POD_DATA[podKey].title);
    const intakeSection = document.getElementById('enterprise-intake-section');
    if (intakeSection) {
      intakeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'How does Refeir ensure candidate quality without endless interviewing?',
      a: 'We tap local industry Tech Scouts—active senior leads and CTOs across Lagos, Nairobi, Cape Town, Cairo, and Kigali—who personally endorse talent they have worked with. You receive a curated shortlist of 3 pre-screened candidates within 48 hours instead of reviewing hundreds of unvetted proposals.'
    },
    {
      q: 'How does the Trust Vault Escrow protect our enterprise budget?',
      a: 'Milestone funds are deposited securely into Trust Vault Escrow prior to sprint kick-off. Funds are only disbursed when your engineering leadership reviews and approves code commits, deliverables, and pull requests. If milestone criteria are not satisfied, revisions are mandatory or funds remain protected.'
    },
    {
      q: 'Can we hire contractors full-time or convert them to direct permanent employees?',
      a: 'Yes. Refeir supports a seamless contract-to-hire model. After an agreed milestone period (typically 6 months), enterprises can transition contractors to direct full-time contracts or use our Employer-of-Record (EOR) partner rails with zero friction.'
    },
    {
      q: 'How does Refeir handle cross-border IP assignment and contractor tax compliance?',
      a: 'Every engagement includes a comprehensive, enforceable Intellectual Property Assignment agreement and Non-Disclosure Agreement before any work starts. Refeir manages contractor classification, W-8BEN compliance, and provides consolidated monthly tax invoices in USD, EUR, or GBP.'
    },
    {
      q: 'What time-zone overlap can our team expect?',
      a: 'African tech hubs operate between GMT and GMT+3. This provides 5 to 8 hours of daily real-time working overlap with London, Berlin, Amsterdam, and Paris, and 4 to 6 hours of morning overlap with US East Coast (New York, Boston).'
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '80vh',
        backgroundColor: isDark ? 'var(--rf-bg-base)' : '#F8FAF8',
        color: isDark ? '#FFFFFF' : '#122B1A'
      }}
    >
      {/* =========================================================================
          1. ATMOSPHERIC ORGANIC HERO SECTION
          ========================================================================= */}
      <section
        className="rf-ent-hero-wrap"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(102, 187, 42, 0.22), transparent 75%), var(--rf-bg-base)'
            : 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(102, 187, 42, 0.14), transparent 75%), #F4FBF0',
          borderBottom: isDark ? '1px solid rgba(102, 187, 42, 0.18)' : '1px solid rgba(18, 43, 26, 0.1)'
        }}
      >
        <div
          className="rf-ent-ambient-glow"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(102, 187, 42, 0.28) 0%, rgba(246, 178, 26, 0.12) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(102, 187, 42, 0.2) 0%, rgba(246, 178, 26, 0.08) 50%, transparent 80%)'
          }}
        />

        <div className="rf-container" style={{ position: 'relative', zIndex: 1, maxWidth: '1120px' }}>
          {/* Eyebrow */}
          <div
            className="rf-ent-eyebrow"
            style={{
              background: isDark ? 'rgba(102, 187, 42, 0.12)' : 'rgba(102, 187, 42, 0.1)',
              border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(102, 187, 42, 0.25)',
              color: isDark ? '#85D33A' : '#1E6B27'
            }}
          >
            <Building2 size={15} />
            <span>Refeir for Business & Global Teams</span>
          </div>

          {/* Headline */}
          <h1 className="rf-ent-hero-title" style={{ color: isDark ? '#FFFFFF' : '#07160D' }}>
            Scale Distributed Engineering & AI Teams Across Africa
          </h1>

          {/* Subtitle */}
          <p
            className="rf-ent-hero-subtitle"
            style={{ color: isDark ? 'rgba(235, 245, 238, 0.85)' : '#334D3D' }}
          >
            Access the top 1% vetted tech and creative talent through localized scout networks. Consolidated multi-currency invoicing, cross-border compliance across 54 jurisdictions, and 100% milestone Trust Vault escrow.
          </p>

          {/* Dual Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            <button
              onClick={() => {
                const el = document.getElementById('enterprise-pod-builder');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{ gap: '0.5rem', padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 700 }}
            >
              <span>Explore Enterprise Pods</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('enterprise-calculator-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rf-btn rf-btn-secondary rf-btn-lg"
              style={{ gap: '0.5rem', padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 600 }}
            >
              <Calculator size={17} />
              <span>Calculate Savings</span>
            </button>
          </div>

          {/* Live Key Metrics */}
          <div className="rf-ent-stats-grid">
            <div
              className="rf-ent-stat-card"
              style={{
                background: isDark ? 'rgba(13, 35, 22, 0.7)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.2)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div className="rf-ent-stat-val" style={{ color: '#66BB2A' }}>48 Hours</div>
              <div className="rf-ent-stat-label" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                Average match time to 3 scout-vetted candidates
              </div>
            </div>

            <div
              className="rf-ent-stat-card"
              style={{
                background: isDark ? 'rgba(13, 35, 22, 0.7)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.2)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div className="rf-ent-stat-val" style={{ color: '#F6B21A' }}>54 Nations</div>
              <div className="rf-ent-stat-label" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                Compliant contractor rails & local currency payouts
              </div>
            </div>

            <div
              className="rf-ent-stat-card"
              style={{
                background: isDark ? 'rgba(13, 35, 22, 0.7)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.2)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div className="rf-ent-stat-val" style={{ color: '#66BB2A' }}>$0 Upfront</div>
              <div className="rf-ent-stat-label" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                Zero headhunter fees; funds release only on milestone approval
              </div>
            </div>

            <div
              className="rf-ent-stat-card"
              style={{
                background: isDark ? 'rgba(13, 35, 22, 0.7)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.2)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div className="rf-ent-stat-val" style={{ color: '#F6B21A' }}>100% Escrow</div>
              <div className="rf-ent-stat-label" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                Milestone Trust Vault protection with full IP assignment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. INTERACTIVE ENTERPRISE POD & SOLUTION SIZER
          ========================================================================= */}
      <section id="enterprise-pod-builder" className="rf-section" style={{ position: 'relative' }}>
        <div className="rf-container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.75rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#66BB2A',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              TURNKEY TALENT PODS
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', lineHeight: 1.2 }}>
              Choose a Pre-Engineered Pod or Build Your Custom Squad
            </h2>
            <p style={{ color: isDark ? '#94A3B8' : '#475569', marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
              Select a specialized team architecture below to review roster breakdown, verified tech stacks, and deployment timeline.
            </p>
          </div>

          {/* Pod Selector Tabs */}
          <div className="rf-ent-pod-selector">
            {(['fullstack', 'ai', 'fintech', 'design', 'custom'] as const).map(podKey => {
              const isSelected = selectedPod === podKey;
              return (
                <button
                  key={podKey}
                  onClick={() => setSelectedPod(podKey)}
                  className="rf-ent-pod-tab"
                  style={{
                    background: isSelected
                      ? isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(102, 187, 42, 0.1)'
                      : isDark ? 'rgba(13, 35, 22, 0.6)' : '#FFFFFF',
                    borderColor: isSelected
                      ? '#66BB2A'
                      : isDark ? 'rgba(102, 187, 42, 0.2)' : 'rgba(18, 43, 26, 0.12)',
                    boxShadow: isSelected
                      ? '0 4px 16px rgba(102, 187, 42, 0.15)'
                      : isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? '#66BB2A' : (isDark ? '#FFFFFF' : '#07160D'), marginBottom: '0.2rem' }}>
                    {podKey === 'fullstack' && 'Fullstack Pod'}
                    {podKey === 'ai' && 'AI & LLM Pod'}
                    {podKey === 'fintech' && 'FinTech Pod'}
                    {podKey === 'design' && 'Design Studio'}
                    {podKey === 'custom' && 'Custom Squad'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {podKey === 'fullstack' && 'Web, Mobile, Cloud'}
                    {podKey === 'ai' && 'GenAI, Agents, Data'}
                    {podKey === 'fintech' && 'Mobile Money Rails'}
                    {podKey === 'design' && 'UI/UX & Brand Systems'}
                    {podKey === 'custom' && 'Tailored Headcount'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pod Details Box */}
          <div
            className="rf-ent-pod-detail-box"
            style={{
              background: isDark ? 'rgba(13, 35, 22, 0.85)' : '#FFFFFF',
              border: isDark ? '1.5px solid rgba(102, 187, 42, 0.3)' : '1.5px solid rgba(102, 187, 42, 0.25)',
              boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 36px rgba(18, 43, 26, 0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F6B21A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  FEATURED DEPLOYMENT PROFILE
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', marginTop: '0.25rem' }}>
                  {currentPod.title}
                </h3>
                <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  {currentPod.tagline}
                </p>
              </div>

              <button
                onClick={() => handleSelectPodForIntake(selectedPod)}
                className="rf-btn rf-btn-primary"
                style={{ padding: '0.65rem 1.4rem', fontWeight: 700, gap: '0.45rem' }}
              >
                <span>Request This Pod</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {/* Left Column: Team Roster */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Recommended Roster Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {currentPod.teamRoster.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F4FBF0',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(18, 43, 26, 0.06)'
                      }}
                    >
                      <CheckCircle2 size={16} color="#66BB2A" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: isDark ? '#FFFFFF' : '#07160D' }}>
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Stack & Guarantees */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Verified Stack & SLAs
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                  {currentPod.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: isDark ? 'rgba(102, 187, 42, 0.12)' : 'rgba(102, 187, 42, 0.1)',
                        color: isDark ? '#85D33A' : '#1B5E20',
                        border: isDark ? '1px solid rgba(102, 187, 42, 0.25)' : '1px solid rgba(102, 187, 42, 0.2)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(246, 178, 26, 0.08)' : 'rgba(246, 178, 26, 0.08)',
                    border: '1px solid rgba(246, 178, 26, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', fontWeight: 700, color: '#F6B21A' }}>
                    <Clock size={15} />
                    <span>{currentPod.sla}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                    Typical cost tier: <span style={{ fontWeight: 700, color: isDark ? '#FFFFFF' : '#07160D' }}>{currentPod.rateRange}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. COMPARISON: REFEIR FOR BUSINESS VS TRADITIONAL PLATFORMS
          ========================================================================= */}
      <section
        className="rf-section"
        style={{
          background: isDark ? 'rgba(10, 23, 15, 0.6)' : '#F0F7F2',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(18, 43, 26, 0.08)',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(18, 43, 26, 0.08)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: '#66BB2A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              THE REFEIR ARCHITECTURE
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', lineHeight: 1.2 }}>
              Why Modern Enterprises Build on Refeir
            </h2>
            <p style={{ color: isDark ? '#94A3B8' : '#475569', marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
              Compare how Refeir eliminates cross-border friction, contractor tax liabilities, and ghosting compared to traditional marketplaces.
            </p>
          </div>

          <div className="rf-ent-compare-grid">
            {/* Traditional Marketplaces */}
            <div
              className="rf-ent-compare-col"
              style={{
                background: isDark ? 'rgba(239, 68, 68, 0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.18)' : '1px solid rgba(239, 68, 68, 0.15)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                TRADITIONAL FREELANCE PLATFORMS
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#07160D', marginBottom: '1.25rem' }}>
                High Friction & Unverified Noise
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✕</span>
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                    <strong>150+ unvetted proposals</strong> to sift through, wasting 3-4 engineering weeks on screening.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✕</span>
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                    <strong>Direct tax exposure</strong>: Your legal department must handle W-8BENs, withholding taxes, and misclassification audits across foreign jurisdictions.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✕</span>
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                    <strong>Fragmented invoicing</strong> with unpredictable credit card fees, high wire surcharges, and fluctuating FX rates.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✕</span>
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                    <strong>No sprint accountability</strong>: If a freelancer ghosts or submits substandard code, you absorb the sunk sprint costs.
                  </div>
                </div>
              </div>
            </div>

            {/* Refeir for Business */}
            <div
              className="rf-ent-compare-col"
              style={{
                background: isDark ? 'rgba(102, 187, 42, 0.08)' : '#FFFFFF',
                border: '1.5px solid #66BB2A',
                boxShadow: isDark ? '0 8px 30px rgba(102, 187, 42, 0.12)' : '0 8px 30px rgba(18, 43, 26, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  REFEIR FOR BUSINESS
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#66BB2A', color: '#07160D', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                  RECOMMENDED
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#07160D', marginBottom: '1.25rem' }}>
                Scout-Vetted & Milestone-Protected
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} color="#66BB2A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#FFFFFF' : '#07160D' }}>
                    <strong>Scout Endorsed in 48h</strong>: Senior African tech leads present 3 pre-vetted engineers matched to your exact architecture.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} color="#66BB2A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#FFFFFF' : '#07160D' }}>
                    <strong>Refeir Contractor Shield</strong>: Full IP assignment, localized contract enforcement, and complete tax indemnity in 54 nations.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} color="#66BB2A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#FFFFFF' : '#07160D' }}>
                    <strong>Single Consolidated Invoice</strong>: Pay once per cycle in USD, EUR, or GBP via wire or corporate card; Refeir manages multi-currency FX.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} color="#66BB2A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#FFFFFF' : '#07160D' }}>
                    <strong>100% Trust Vault Escrow</strong>: Payouts release strictly upon your PR approval. 14-day replacement guarantee included.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE COST & SAVINGS CALCULATOR
          ========================================================================= */}
      <section id="enterprise-calculator-section" className="rf-section">
        <div className="rf-container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: '#F6B21A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              BUDGET OPTIMIZATION CALCULATOR
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', lineHeight: 1.2 }}>
              Simulate Your Enterprise Runway Extension
            </h2>
            <p style={{ color: isDark ? '#94A3B8' : '#475569', marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
              Adjust team size and engagement duration to calculate the capital saved vs traditional US/European tech hiring.
            </p>
          </div>

          <div
            style={{
              background: isDark ? 'rgba(13, 35, 22, 0.75)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(102, 187, 42, 0.22)' : '1px solid rgba(18, 43, 26, 0.12)',
              borderRadius: '24px',
              padding: 'clamp(1.75rem, 4vw, 3rem)',
              boxShadow: isDark ? 'none' : '0 12px 35px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              {/* Controls */}
              <div>
                {/* Team Size Slider */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#07160D' }}>
                      Senior Engineers Needed:
                    </label>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#66BB2A' }}>
                      {teamSize} {teamSize === 1 ? 'Engineer' : 'Engineers'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={teamSize}
                    onChange={e => setTeamSize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#66BB2A', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: isDark ? '#64748B' : '#94A3B8', marginTop: '0.35rem' }}>
                    <span>1 engineer</span>
                    <span>6 engineers</span>
                    <span>12+ engineers</span>
                  </div>
                </div>

                {/* Duration Picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#07160D', marginBottom: '0.75rem' }}>
                    Engagement Horizon:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                    {[3, 6, 12].map(months => (
                      <button
                        key={months}
                        onClick={() => setDurationMonths(months)}
                        style={{
                          padding: '0.65rem',
                          borderRadius: '10px',
                          border: durationMonths === months
                            ? '1.5px solid #66BB2A'
                            : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 43, 26, 0.12)',
                          background: durationMonths === months
                            ? isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(102, 187, 42, 0.1)'
                            : 'transparent',
                          color: durationMonths === months
                            ? '#66BB2A'
                            : isDark ? '#FFFFFF' : '#07160D',
                          fontWeight: durationMonths === months ? 800 : 600,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {months} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Metric Card */}
              <div
                style={{
                  background: isDark ? 'rgba(7, 22, 13, 0.9)' : '#F4FBF0',
                  border: isDark ? '1.5px solid rgba(102, 187, 42, 0.3)' : '1.5px solid rgba(102, 187, 42, 0.25)',
                  borderRadius: '20px',
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F6B21A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  ESTIMATED CAPITAL PRESERVED
                </div>
                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#66BB2A', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                  ${totalSavings.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#07160D', marginBottom: '1.25rem' }}>
                  ~{savingsPercent}% Lower Total Cost of Ownership
                </div>

                <div style={{ borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ color: isDark ? '#64748B' : '#94A3B8' }}>US / UK Equivalent</div>
                    <div style={{ fontWeight: 700, color: isDark ? '#CBD5E1' : '#475569', marginTop: '0.2rem' }}>${totalUsSpend.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: isDark ? '#64748B' : '#94A3B8' }}>Refeir Escrow Spend</div>
                    <div style={{ fontWeight: 800, color: '#66BB2A', marginTop: '0.2rem' }}>${totalRefeirSpend.toLocaleString()}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('enterprise-intake-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rf-btn rf-btn-primary"
                  style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', fontWeight: 700 }}
                >
                  <span>Lock In This Capacity</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. THE ACTION POINT: ENTERPRISE SCOPING & INTAKE
          ========================================================================= */}
      <section
        id="enterprise-intake-section"
        className="rf-section"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(102, 187, 42, 0.16), transparent 70%), var(--rf-bg-base)'
            : 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(102, 187, 42, 0.1), transparent 70%), #F8FAF8',
          position: 'relative'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: '#66BB2A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              TAKE ACTION TODAY
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', lineHeight: 1.2 }}>
              Deploy Your Vetted African Engineering Pod
            </h2>
            <p style={{ color: isDark ? '#94A3B8' : '#475569', marginTop: '0.75rem', fontSize: '1.025rem', lineHeight: 1.6 }}>
              Submit your team requirement below. A dedicated Refeir Technical Scout Lead will review your architecture and provide 3 candidate dossiers within 48 hours.
            </p>
          </div>

          <div
            className="rf-ent-intake-card"
            style={{
              background: isDark ? 'rgba(13, 35, 22, 0.95)' : '#FFFFFF',
              border: isDark ? '1.5px solid rgba(102, 187, 42, 0.3)' : '1.5px solid rgba(18, 43, 26, 0.12)'
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(102, 187, 42, 0.15)',
                    border: '2px solid #66BB2A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}
                >
                  <Check size={32} color="#66BB2A" />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F6B21A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  INTAKE DOSSIER REGISTERED
                </div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', marginBottom: '0.75rem' }}>
                  Thank you, {contactName || 'Partner'}!
                </h3>
                <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 1.5rem' }}>
                  Your enterprise requirement for <strong>{companyName}</strong> has been logged under reference{' '}
                  <span style={{ color: '#66BB2A', fontWeight: 800 }}>{submittedRefId}</span>. A designated Refeir Talent Scout Lead is reviewing your tech stack right now.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    textAlign: 'left',
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F4FBF0',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem 1.75rem',
                    marginBottom: '2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="#66BB2A" />
                    <span>Selected Objective: <strong>{intakeObjective}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="#66BB2A" />
                    <span>Confirmation sent to: <strong>{workEmail}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="#66BB2A" />
                    <span>Candidate Dossiers SLA: <strong>Within 48 hours</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onNavigate('/marketplace')}
                    className="rf-btn rf-btn-primary"
                    style={{ fontWeight: 700 }}
                  >
                    <span>Browse Current Verified Talent</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setCompanyName('');
                      setWorkEmail('');
                    }}
                    className="rf-btn rf-btn-secondary"
                  >
                    Submit Another Requirement
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIntakeSubmit}>
                {/* Step 1: Objective Selection */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#66BB2A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Step 1: Select Your Primary Hiring Objective
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                    {[
                      'Deploy Full Engineering Pod',
                      'Hire Specialized Senior Engineer',
                      'Pan-African FinTech Compliance',
                      'Contractor Shield & Invoicing'
                    ].map(obj => (
                      <button
                        type="button"
                        key={obj}
                        onClick={() => setIntakeObjective(obj)}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: '10px',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          fontWeight: intakeObjective === obj ? 800 : 500,
                          cursor: 'pointer',
                          border: intakeObjective === obj
                            ? '1.5px solid #66BB2A'
                            : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.12)',
                          background: intakeObjective === obj
                            ? isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(102, 187, 42, 0.1)'
                            : isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                          color: intakeObjective === obj
                            ? '#66BB2A'
                            : isDark ? '#FFFFFF' : '#07160D',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Company & Contact Information */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: isDark ? '#CBD5E1' : '#1E293B' }}>
                      Company or Scale-Up Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flutterwave, Paystack, Stripe"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="rf-ent-input-field"
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 43, 26, 0.15)',
                        color: isDark ? '#FFFFFF' : '#07160D'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: isDark ? '#CBD5E1' : '#1E293B' }}>
                      Corporate Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={workEmail}
                      onChange={e => setWorkEmail(e.target.value)}
                      className="rf-ent-input-field"
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 43, 26, 0.15)',
                        color: isDark ? '#FFFFFF' : '#07160D'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: isDark ? '#CBD5E1' : '#1E293B' }}>
                      Your Full Name & Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan, VP of Engineering"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="rf-ent-input-field"
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 43, 26, 0.15)',
                        color: isDark ? '#FFFFFF' : '#07160D'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: isDark ? '#CBD5E1' : '#1E293B' }}>
                      Target Start Timeline
                    </label>
                    <select
                      value={targetStartDate}
                      onChange={e => setTargetStartDate(e.target.value)}
                      className="rf-ent-input-field"
                      style={{
                        background: isDark ? '#0D2316' : '#FFFFFF',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 43, 26, 0.15)',
                        color: isDark ? '#FFFFFF' : '#07160D'
                      }}
                    >
                      <option value="Immediate (within 2 weeks)">Immediate (within 2 weeks)</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Next quarter (30-60 days)">Next quarter (30-60 days)</option>
                      <option value="Exploratory / Discovery phase">Exploratory / Discovery phase</option>
                    </select>
                  </div>
                </div>

                {/* Step 3: Stack Scope */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: isDark ? '#CBD5E1' : '#1E293B' }}>
                    Key Technology Stack & Project Scope (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need 2 senior Go + Flutter engineers to scale mobile escrow architecture. Overlapping with European timezone."
                    value={targetStack}
                    onChange={e => setTargetStack(e.target.value)}
                    className="rf-ent-input-field"
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 43, 26, 0.15)',
                      color: isDark ? '#FFFFFF' : '#07160D',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    <ShieldCheck size={18} color="#66BB2A" />
                    <span>Protected by Refeir Enterprise NDA & Trust Vault</span>
                  </div>

                  <button
                    type="submit"
                    className="rf-btn rf-btn-primary rf-btn-lg"
                    style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', fontWeight: 800, gap: '0.5rem' }}
                  >
                    <span>Request Candidate Shortlist</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FREQUENTLY ASKED ENTERPRISE QUESTIONS
          ========================================================================= */}
      <section className="rf-section" style={{ borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
        <div className="rf-container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: '#66BB2A', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              EXECUTIVE & LEGAL FAQ
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#07160D', lineHeight: 1.2 }}>
              Everything You Need to Know
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rf-ent-faq-item"
                  style={{
                    background: isDark ? 'rgba(13, 35, 22, 0.5)' : '#FFFFFF',
                    border: isOpen
                      ? '1px solid #66BB2A'
                      : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.08)'
                  }}
                >
                  <button
                    className="rf-ent-faq-header"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    style={{ color: isOpen ? '#66BB2A' : (isDark ? '#FFFFFF' : '#07160D') }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="rf-ent-faq-body" style={{ color: isDark ? '#CBD5E1' : '#475569' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
