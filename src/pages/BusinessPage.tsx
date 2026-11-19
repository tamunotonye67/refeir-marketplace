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
  TrendingUp,
  Clock,
  Compass,
  FileText,
  ChevronDown,
  Check,
  Star
} from 'lucide-react';
import '../styles/business-enterprise.css';

interface BusinessPageProps {
  onNavigate: (path: string) => void;
}

type PodType = 'fullstack' | 'ai' | 'fintech' | 'design' | 'custom';

interface SampleTalent {
  name: string;
  role: string;
  country: string;
  flag: string;
  avatar: string;
  topSkills: string[];
  rating: number;
  endorsement: string;
}

interface PodConfig {
  shortLabel: string;
  title: string;
  tagline: string;
  leadRole: string;
  teamRoster: string[];
  techStack: string[];
  sla: string;
  rateRange: string;
  sampleTalent: SampleTalent[];
}

const POD_DATA: Record<PodType, PodConfig> = {
  fullstack: {
    shortLabel: 'Fullstack & Cloud',
    title: 'Fullstack & Cloud Engineering Pod',
    tagline: 'End-to-end web & mobile product delivery with resilient cloud architectures.',
    leadRole: 'Senior Staff Fullstack Architect (10+ yrs exp)',
    teamRoster: [
      '1x Senior Staff Lead (React, Next.js, Node/Go)',
      '2x Senior Fullstack Engineers (TypeScript, PostgreSQL)',
      '1x DevOps & Cloud Infrastructure Lead (AWS, Kubernetes, CI/CD)'
    ],
    techStack: ['Next.js', 'TypeScript', 'Go', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
    sla: 'Shortlist in 48 hours',
    rateRange: '$3,800 – $6,200 / eng / mo',
    sampleTalent: [
      {
        name: 'Kwame Mensah',
        role: 'Senior Staff Cloud Architect',
        country: 'Ghana',
        flag: '🇬🇭',
        avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Go', 'Kubernetes', 'AWS', 'Next.js'],
        rating: 4.98,
        endorsement: 'Ex-Google Africa Staff Architect'
      },
      {
        name: 'Amara Diallo',
        role: 'Lead Distributed Systems Eng',
        country: 'Senegal',
        flag: '🇸🇳',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        topSkills: ['TypeScript', 'Node.js', 'PostgreSQL'],
        rating: 4.95,
        endorsement: 'Built high-throughput payment pipelines'
      },
      {
        name: 'Babatunde Adeleke',
        role: 'DevOps & Reliability Lead',
        country: 'Nigeria',
        flag: '🇳🇬',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Docker', 'Terraform', 'CI/CD', 'Python'],
        rating: 4.96,
        endorsement: 'SOC2 & Zero-Trust Cloud Specialist'
      }
    ]
  },
  ai: {
    shortLabel: 'AI & Agents',
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
    sla: 'Shortlist in 48 hours',
    rateRange: '$4,500 – $7,500 / eng / mo',
    sampleTalent: [
      {
        name: 'Zola Dlamini',
        role: 'Principal AI & RAG Architect',
        country: 'South Africa',
        flag: '🇿🇦',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        topSkills: ['PyTorch', 'LangChain', 'Vector DBs'],
        rating: 4.99,
        endorsement: 'PhD AI / Machine Learning at UCT'
      },
      {
        name: 'Tariq Mansour',
        role: 'Senior LLM Fine-Tuning Engineer',
        country: 'Egypt',
        flag: '🇪🇬',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Hugging Face', 'Python', 'Llama 3'],
        rating: 4.94,
        endorsement: 'Autonomous Multi-Agent Specialist'
      },
      {
        name: 'Fatoumata Bamba',
        role: 'Data Scientist & Vision Specialist',
        country: 'Ivory Coast',
        flag: '🇨🇮',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Computer Vision', 'PyTorch', 'FastAPI'],
        rating: 4.97,
        endorsement: 'Computer Vision Lead on AU Satellites'
      }
    ]
  },
  fintech: {
    shortLabel: 'FinTech & Mobile',
    title: 'Pan-African FinTech & Mobile Money Pod',
    tagline: 'Cross-border escrow rails, payment gateway integrations, and multi-currency ledgers.',
    leadRole: 'Senior Mobile & FinTech Lead Architect',
    teamRoster: [
      '1x Senior Mobile Lead (Flutter & React Native cross-platform)',
      '2x FinTech Backend Engineers (Payment APIs, Webhooks, Ledgers)',
      '1x Smart Contract & Security Compliance Auditor'
    ],
    techStack: ['Flutter', 'Node.js', 'Go', 'Paystack/Flutterwave APIs', 'Mobile Money Rails', 'PCI-DSS', 'Solidity'],
    sla: 'Shortlist in 48 hours',
    rateRange: '$3,600 – $5,800 / eng / mo',
    sampleTalent: [
      {
        name: 'Babatunde Adeleke',
        role: 'Lead FinTech Systems Architect',
        country: 'Nigeria',
        flag: '🇳🇬',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Paystack API', 'Flutter', 'Go Ledgers'],
        rating: 4.98,
        endorsement: 'Architected high-volume escrow rails'
      },
      {
        name: 'Wanjiku Kamau',
        role: 'Mobile Money Rails Specialist',
        country: 'Kenya',
        flag: '🇰🇪',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        topSkills: ['M-Pesa Core', 'Node.js', 'PCI-DSS'],
        rating: 4.96,
        endorsement: '10+ yrs Pan-African Banking Rails'
      },
      {
        name: 'Kofi Mensah',
        role: 'Smart Contract & Security Auditor',
        country: 'Ghana',
        flag: '🇬🇭',
        avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Solidity', 'Penetration Testing', 'Rust'],
        rating: 4.97,
        endorsement: 'Audited $40M+ in cross-border volume'
      }
    ]
  },
  design: {
    shortLabel: 'Product Design',
    title: 'Product Design & Design Systems Studio',
    tagline: 'High-converting UI/UX, unified brand design systems, and interactive 3D assets.',
    leadRole: 'Principal Product & Brand Design Director',
    teamRoster: [
      '1x Principal Product Designer (Figma Systems & User Journeys)',
      '1x Interaction & Motion Designer (Framer Motion, Micro-Interactions)',
      '1x Visual Identity & 3D Specialist'
    ],
    techStack: ['Figma', 'Design Tokens', 'Spline 3D', 'Adobe Suite', 'User Testing', 'Responsive Design'],
    sla: 'Shortlist in 24 hours',
    rateRange: '$3,200 – $5,200 / designer / mo',
    sampleTalent: [
      {
        name: 'Amaka Nwosu',
        role: 'Principal Design Systems Lead',
        country: 'Nigeria',
        flag: '🇳🇬',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Figma Systems', 'FinTech UX', 'Tokens'],
        rating: 4.98,
        endorsement: 'Ex-Paystack Design Lead'
      },
      {
        name: 'Kwame Mensah',
        role: '3D & Motion Brand Specialist',
        country: 'Ghana',
        flag: '🇬🇭',
        avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Spline 3D', 'Framer', 'Brand Strategy'],
        rating: 4.95,
        endorsement: 'Interactive 3D Web Award Winner'
      },
      {
        name: 'Zola Dlamini',
        role: 'Lead UX Researcher & Architect',
        country: 'South Africa',
        flag: '🇿🇦',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        topSkills: ['User Testing', 'Design Ops', 'Prototyping'],
        rating: 4.96,
        endorsement: 'Led Pan-African Mobile Banking Redesign'
      }
    ]
  },
  custom: {
    shortLabel: 'Custom Team',
    title: 'Custom Enterprise Deployment',
    tagline: 'Tailor-made team size, niche tech stacks, and dedicated talent success partner.',
    leadRole: 'Dedicated Refeir Enterprise Talent Partner',
    teamRoster: [
      'Flexible headcount: 1 to 25+ senior engineers & leads',
      'Custom jurisdiction targeting across 54 African countries',
      'Dedicated Refeir technical recruiter & sprint manager'
    ],
    techStack: ['Bespoke to your tech stack and internal workflow'],
    sla: 'Discovery call in 24 hours',
    rateRange: 'Bespoke milestone contracts',
    sampleTalent: [
      {
        name: 'Kwame Mensah',
        role: 'Enterprise Solutions Architect',
        country: 'Ghana',
        flag: '🇬🇭',
        avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Architecture Review', 'Cloud Migration'],
        rating: 4.99,
        endorsement: 'Senior Refeir Scout Lead'
      },
      {
        name: 'Amaka Nwosu',
        role: 'Design & Product Lead',
        country: 'Nigeria',
        flag: '🇳🇬',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        topSkills: ['Product Strategy', 'Fintech UI'],
        rating: 4.98,
        endorsement: 'Design Council Advisor'
      },
      {
        name: 'Zola Dlamini',
        role: 'AI & Data Engineering Lead',
        country: 'South Africa',
        flag: '🇿🇦',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        topSkills: ['LLM Orchestration', 'MLOps'],
        rating: 4.97,
        endorsement: 'Pan-African AI Fellow'
      }
    ]
  }
};

const POD_KEYS: PodType[] = ['fullstack', 'ai', 'fintech', 'design', 'custom'];

const ENTERPRISE_PILLARS = [
  {
    key: 'scouts',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Engineering team collaborating around laptops',
    tag: '48-Hour Shortlist',
    title: 'Scout-vetted shortlists in 48h',
    desc: 'Skip hundreds of unvetted resumes. Local CTOs and senior tech leads personally endorse candidates they have shipped code with.',
    featured: false,
    points: [
      '3 pre-vetted senior candidates per role',
      'Verified production history & peer endorsements',
      '5–8h daily overlap with Europe & US East Coast'
    ]
  },
  {
    key: 'escrow',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Enterprise leaders reviewing project milestones',
    tag: 'Enterprise Standard',
    title: 'Trust Vault Escrow & billing',
    desc: 'Every sprint milestone is protected in escrow and released only when your engineering lead approves deliverables.',
    featured: true,
    points: [
      'Consolidated monthly invoices in USD, EUR or GBP',
      'Zero payout friction across 54 African countries',
      'Automated W-8BEN & contractor tax compliance'
    ]
  },
  {
    key: 'ip',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Executive partner leading a global remote team',
    tag: 'Global Compliance',
    title: 'IP protection & EOR conversion',
    desc: 'Enforceable IP assignment and NDAs are signed before day one, with seamless contract-to-hire conversion whenever you are ready.',
    featured: false,
    points: [
      'Full intellectual property assignment & mutual NDA',
      'SOC2-ready security & access governance',
      'Direct full-time or EOR conversion after 6 months'
    ]
  }
];

const HUB_SPOTLIGHTS = [
  {
    city: 'Lagos & Abuja',
    focus: 'FinTech & Cloud Systems',
    image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80',
    stat: '1,400+ vetted engineers'
  },
  {
    city: 'Nairobi & Kigali',
    focus: 'Mobile Money & AI',
    image: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=800&q=80',
    stat: 'GMT+3 EU overlap'
  },
  {
    city: 'Cape Town & Cairo',
    focus: 'Enterprise SaaS & Design',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    stat: '4.96 avg client rating'
  }
];

const FAQS = [
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

export const BusinessPage: React.FC<BusinessPageProps> = ({ onNavigate }) => {
  const [selectedPod, setSelectedPod] = useState<PodType>('fullstack');
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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Savings Calculator Math
  const avgUsSalaryMonthly = 14500;
  const avgRefeirSalaryMonthly = 4800;
  const totalRefeirSpend = avgRefeirSalaryMonthly * teamSize * durationMonths;
  const totalUsSpend = avgUsSalaryMonthly * teamSize * durationMonths;
  const totalSavings = totalUsSpend - totalRefeirSpend;
  const savingsPercent = Math.round((totalSavings / totalUsSpend) * 100);

  const currentPod = POD_DATA[selectedPod];

  const scrollToIntake = () => {
    const el = document.getElementById('enterprise-intake-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPodForIntake = (podKey: PodType) => {
    setSelectedPod(podKey);
    setIntakeObjective(POD_DATA[podKey].title);
    scrollToIntake();
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !workEmail.trim()) return;
    const refId = `REF-ENT-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedRefId(refId);
    setFormSubmitted(true);
  };

  return (
    <div className="rf-bz-page">
      {/* Split Hero with Editorial Photo */}
      <section className="rf-bz-hero-wrap">
        <div className="rf-bz-hero-bg" aria-hidden="true" />
        <div className="rf-bz-hero">
          <div className="rf-bz-hero-copy">
            <div className="rf-bz-eyebrow">
              <Building2 size={14} /> Refeir for Business
            </div>
            <h1 className="rf-bz-title">
              Build <span className="rf-bz-title-accent">scout-vetted</span> engineering teams in 48 hours
            </h1>
            <div className="rf-bz-subtitle">
              Deploy senior African engineers, AI architects, and product designers backed by peer endorsements, Trust Vault Escrow, and consolidated global billing.
            </div>
            <div className="rf-bz-hero-actions">
              <button type="button" className="rf-bz-btn-primary" onClick={scrollToIntake}>
                Book a discovery call <ArrowRight size={16} />
              </button>
              <button type="button" className="rf-bz-btn-ghost" onClick={() => onNavigate('/marketplace')}>
                Browse talent
              </button>
            </div>
            <div className="rf-bz-hero-metrics">
              <div><strong>48h</strong><span>shortlist SLA</span></div>
              <div><strong>Top 1%</strong><span>scout-vetted</span></div>
              <div><strong>5–8h</strong><span>EU &amp; US overlap</span></div>
            </div>
          </div>

          <div className="rf-bz-hero-media">
            <div className="rf-bz-hero-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="Senior African engineering team collaborating in a modern studio"
                className="rf-bz-hero-photo"
              />
              <div className="rf-bz-floating-card">
                <div className="rf-bz-avatar-stack">
                  <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=160&q=80" alt="Kwame Mensah" />
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" alt="Amara Diallo" />
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" alt="Zola Dlamini" />
                </div>
                <div className="rf-bz-floating-text">
                  <strong>Shortlist ready in 48h</strong>
                  <span><ShieldCheck size={13} /> 100% Trust Vault Escrow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pod Builder */}
      <section id="enterprise-pod-builder" className="rf-bz-section">
        <div className="rf-bz-section-head">
          <div className="rf-bz-kicker">Dedicated Pods</div>
          <h2 className="rf-bz-h2">Assemble a ready-to-ship team</h2>
          <div className="rf-bz-section-sub">
            Select a pod template to preview roles, tech stacks, and verified senior talent.
          </div>
        </div>

        <div className="rf-bz-pod-tabs" role="tablist" aria-label="Engineering pod types">
          {POD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selectedPod === key}
              className={selectedPod === key ? 'is-active' : ''}
              onClick={() => setSelectedPod(key)}
            >
              {POD_DATA[key].shortLabel}
            </button>
          ))}
        </div>

        <div className="rf-bz-pod-card">
          <div className="rf-bz-pod-info">
            <div className="rf-bz-pod-meta">
              <span><Clock size={14} /> {currentPod.sla}</span>
              <span><TrendingUp size={14} /> {currentPod.rateRange}</span>
            </div>
            <h3 className="rf-bz-pod-title">{currentPod.title}</h3>
            <div className="rf-bz-pod-tagline">{currentPod.tagline}</div>

            <div className="rf-bz-sublabel">Pod composition</div>
            <ul className="rf-bz-roster">
              {currentPod.teamRoster.map((item) => (
                <li key={item}>
                  <span className="rf-bz-check"><Check size={12} strokeWidth={3} /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="rf-bz-sublabel">Core stack</div>
            <div className="rf-bz-tags">
              {currentPod.techStack.map((tech) => (
                <span key={tech} className="rf-bz-tag">{tech}</span>
              ))}
            </div>

            <button
              type="button"
              className="rf-bz-btn-primary rf-bz-pod-cta"
              onClick={() => handleSelectPodForIntake(selectedPod)}
            >
              Request this pod <ArrowRight size={16} />
            </button>
          </div>

          <div className="rf-bz-pod-talent">
            <div className="rf-bz-talent-head">
              <span>Sample vetted talent</span>
              <span className="rf-bz-verified-pill">
                <ShieldCheck size={13} /> Scout-endorsed
              </span>
            </div>
            <div className="rf-bz-talent-list">
              {currentPod.sampleTalent.map((person) => (
                <div key={person.name} className="rf-bz-talent-card">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="rf-bz-avatar"
                    loading="lazy"
                  />
                  <div className="rf-bz-talent-body">
                    <div className="rf-bz-talent-top">
                      <strong>{person.name}</strong>
                      <span className="rf-bz-rating">
                        <Star size={12} fill="currentColor" /> {person.rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="rf-bz-talent-role">
                      {person.role} · {person.flag} {person.country}
                    </div>
                    <div className="rf-bz-talent-endorse">
                      <Award size={12} /> {person.endorsement}
                    </div>
                    <div className="rf-bz-talent-skills">
                      {person.topSkills.map((sk) => (
                        <span key={sk}>{sk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Photo Pillar Cards */}
      <section className="rf-bz-section">
        <div className="rf-bz-section-head">
          <div className="rf-bz-kicker">Why Refeir Business</div>
          <h2 className="rf-bz-h2">Built for high-trust global delivery</h2>
          <div className="rf-bz-section-sub">
            Everything engineering leaders and finance teams need to hire across Africa with confidence.
          </div>
        </div>

        <div className="rf-bz-grid-3">
          {ENTERPRISE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.key}
                className={`rf-bz-card${pillar.featured ? ' is-featured' : ''}`}
              >
                <div className="rf-bz-card-media">
                  <img src={pillar.image} alt={pillar.imageAlt} loading="lazy" />
                  <span className="rf-bz-media-pill">{pillar.tag}</span>
                </div>
                <div className="rf-bz-card-body">
                  <div className="rf-bz-card-head">
                    <div className="rf-bz-icon"><Icon size={18} /></div>
                    <h3 className="rf-bz-card-title">{pillar.title}</h3>
                  </div>
                  <div className="rf-bz-card-desc">{pillar.desc}</div>
                  <ul className="rf-bz-list">
                    {pillar.points.map((pt) => (
                      <li key={pt}>
                        <span className="rf-bz-check"><Check size={12} strokeWidth={3} /></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rf-bz-trust">
          <span><ShieldCheck size={16} /> Trust Vault Escrow</span>
          <span><Lock size={16} /> Mutual NDA &amp; IP assignment</span>
          <span><Globe2 size={16} /> 54 African countries</span>
          <span><Layers size={16} /> Consolidated invoicing</span>
        </div>
      </section>

      {/* Pan-African Hub Photo Strip */}
      <section className="rf-bz-section">
        <div className="rf-bz-section-head">
          <div className="rf-bz-kicker">Talent Network</div>
          <h2 className="rf-bz-h2">Tap Africa&apos;s top engineering hubs</h2>
          <div className="rf-bz-section-sub">
            Real-time overlap with European and US East Coast product teams.
          </div>
        </div>

        <div className="rf-bz-hubs">
          {HUB_SPOTLIGHTS.map((hub) => (
            <div key={hub.city} className="rf-bz-hub-card">
              <img src={hub.image} alt={hub.city} loading="lazy" />
              <div className="rf-bz-hub-overlay">
                <span className="rf-bz-hub-stat">{hub.stat}</span>
                <h3>{hub.city}</h3>
                <p>{hub.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section id="enterprise-calculator-section" className="rf-bz-section">
        <div className="rf-bz-section-head">
          <div className="rf-bz-kicker">ROI Calculator</div>
          <h2 className="rf-bz-h2">Estimate your engineering savings</h2>
          <div className="rf-bz-section-sub">
            Compare fully loaded US/EU senior hiring costs against a scout-vetted Refeir pod.
          </div>
        </div>

        <div className="rf-bz-calc">
          <div className="rf-bz-calc-inputs">
            <div className="rf-bz-slider-block">
              <div className="rf-bz-slider-head">
                <label htmlFor="rf-bz-team">Team size</label>
                <strong>{teamSize} {teamSize === 1 ? 'engineer' : 'engineers'}</strong>
              </div>
              <input
                id="rf-bz-team"
                type="range"
                min={1}
                max={15}
                step={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="rf-bz-range"
              />
              <div className="rf-bz-presets">
                {[1, 3, 5, 8, 12].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={teamSize === n ? 'is-active' : ''}
                    onClick={() => setTeamSize(n)}
                  >
                    {n} {n === 1 ? 'eng' : 'engs'}
                  </button>
                ))}
              </div>
            </div>

            <div className="rf-bz-slider-block">
              <div className="rf-bz-slider-head">
                <label htmlFor="rf-bz-duration">Engagement duration</label>
                <strong>{durationMonths} {durationMonths === 1 ? 'month' : 'months'}</strong>
              </div>
              <input
                id="rf-bz-duration"
                type="range"
                min={1}
                max={24}
                step={1}
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="rf-bz-range"
              />
              <div className="rf-bz-presets">
                {[3, 6, 12, 18, 24].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={durationMonths === m ? 'is-active' : ''}
                    onClick={() => setDurationMonths(m)}
                  >
                    {m} mo
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rf-bz-calc-result">
            <div className="rf-bz-savings-top">
              <span className="rf-bz-savings-label">Estimated net savings</span>
              <span className="rf-bz-savings-pill">Save {savingsPercent}%</span>
            </div>
            <div className="rf-bz-savings-value">${totalSavings.toLocaleString()}</div>

            <div className="rf-bz-compare">
              <div className="rf-bz-compare-row">
                <div className="rf-bz-compare-meta">
                  <span>Traditional US/EU hire</span>
                  <strong>${totalUsSpend.toLocaleString()}</strong>
                </div>
                <div className="rf-bz-compare-track">
                  <div className="rf-bz-compare-fill is-us" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="rf-bz-compare-row">
                <div className="rf-bz-compare-meta">
                  <span>Refeir vetted pod</span>
                  <strong className="rf-bz-green">${totalRefeirSpend.toLocaleString()}</strong>
                </div>
                <div className="rf-bz-compare-track">
                  <div
                    className="rf-bz-compare-fill is-refeir"
                    style={{ width: `${Math.round((totalRefeirSpend / totalUsSpend) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rf-bz-btn-primary rf-bz-calc-cta"
              onClick={scrollToIntake}
            >
              Lock in custom estimate <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Intake Form with Visual Partner Card */}
      <section id="enterprise-intake-section" className="rf-bz-section">
        <div className="rf-bz-intake-wrap">
          <div className="rf-bz-intake-copy">
            <div className="rf-bz-kicker">Get started</div>
            <h2 className="rf-bz-h2 rf-bz-h2-left">Tell us what you are building</h2>
            <div className="rf-bz-intake-sub">
              An enterprise talent partner will reply within 24 hours with a tailored pod plan and vetted candidate profiles.
            </div>

            <div className="rf-bz-partner-card">
              <img
                src="/african_woman_headset.jpg"
                alt="Refeir Enterprise Talent Partner"
                className="rf-bz-partner-img"
                loading="lazy"
              />
              <div>
                <strong>Dedicated Refeir Desk</strong>
                <span>Matched by senior technical scouts · 48h shortlist SLA</span>
              </div>
            </div>

            <ul className="rf-bz-intake-perks">
              <li><CheckCircle2 size={17} /> No upfront commitment or retainer</li>
              <li><CheckCircle2 size={17} /> Mutual NDA available before technical briefing</li>
              <li><CheckCircle2 size={17} /> Pay in USD, EUR, or GBP via consolidated invoice</li>
            </ul>
            <div className="rf-bz-intake-links">
              <button type="button" className="rf-bz-link-btn" onClick={() => onNavigate('/pricing')}>
                View transparent pricing <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="rf-bz-intake-card">
            {formSubmitted ? (
              <div className="rf-bz-success">
                <div className="rf-bz-success-icon">
                  <CheckCircle2 size={28} />
                </div>
                <h3>Request received</h3>
                <div className="rf-bz-success-ref">Reference: {submittedRefId}</div>
                <p>
                  Our enterprise team will reach out to <strong>{workEmail}</strong> within 24 hours with a curated shortlist for <strong>{companyName}</strong>.
                </p>
                <div className="rf-bz-success-actions">
                  <button
                    type="button"
                    className="rf-bz-btn-primary"
                    onClick={() => onNavigate('/marketplace')}
                  >
                    Explore marketplace <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="rf-bz-btn-ghost"
                    onClick={() => setFormSubmitted(false)}
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              <form className="rf-bz-form" onSubmit={handleIntakeSubmit}>
                <div className="rf-bz-field">
                  <label htmlFor="bz-objective">Hiring objective</label>
                  <select
                    id="bz-objective"
                    value={intakeObjective}
                    onChange={(e) => setIntakeObjective(e.target.value)}
                  >
                    <option value="Deploy Full Engineering Pod">Deploy Full Engineering Pod</option>
                    <option value="Fullstack & Cloud Engineering Pod">Fullstack &amp; Cloud Engineering Pod</option>
                    <option value="AI Studios & Autonomous Agents Pod">AI Studios &amp; Autonomous Agents Pod</option>
                    <option value="Pan-African FinTech & Mobile Money Pod">Pan-African FinTech &amp; Mobile Money Pod</option>
                    <option value="Product Design & Design Systems Studio">Product Design &amp; Design Systems Studio</option>
                    <option value="Custom Enterprise Deployment">Custom Enterprise Deployment</option>
                  </select>
                </div>

                <div className="rf-bz-form-row">
                  <div className="rf-bz-field">
                    <label htmlFor="bz-name">Your name</label>
                    <input
                      id="bz-name"
                      type="text"
                      placeholder="Adaeze Okafor"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="rf-bz-field">
                    <label htmlFor="bz-company">Company name</label>
                    <input
                      id="bz-company"
                      type="text"
                      placeholder="Acme FinTech Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="rf-bz-field">
                  <label htmlFor="bz-email">Work email</label>
                  <input
                    id="bz-email"
                    type="email"
                    placeholder="you@company.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="rf-bz-form-row">
                  <div className="rf-bz-field">
                    <label htmlFor="bz-stack">Target stack or roles</label>
                    <input
                      id="bz-stack"
                      type="text"
                      placeholder="React, Go, AWS, Staff Engineer"
                      value={targetStack}
                      onChange={(e) => setTargetStack(e.target.value)}
                    />
                  </div>
                  <div className="rf-bz-field">
                    <label htmlFor="bz-start">Target start</label>
                    <select
                      id="bz-start"
                      value={targetStartDate}
                      onChange={(e) => setTargetStartDate(e.target.value)}
                    >
                      <option value="Immediate (within 2 weeks)">Immediate (within 2 weeks)</option>
                      <option value="Within 30 days">Within 30 days</option>
                      <option value="Next quarter">Next quarter</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="rf-bz-btn-primary rf-bz-submit">
                  Request vetted shortlist <ArrowRight size={16} />
                </button>
                <div className="rf-bz-form-note">
                  <Users size={14} /> Matched by senior technical scouts · 48-hour SLA
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rf-bz-section">
        <div className="rf-bz-section-head">
          <div className="rf-bz-kicker">FAQ</div>
          <h2 className="rf-bz-h2">Frequently asked questions</h2>
        </div>
        <div className="rf-bz-faq">
          {FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className={`rf-bz-faq-item${open ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="rf-bz-faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="rf-bz-faq-icon" />
                </button>
                {open && <div className="rf-bz-faq-a">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default BusinessPage;
