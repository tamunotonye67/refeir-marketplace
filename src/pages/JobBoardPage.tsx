import React, { useState } from 'react';
import { Job, Proposal } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { JobCard } from '../components/marketplace/JobCard';
import { ClientReputationScorecard } from '../components/marketplace/ClientReputationScorecard';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney, createMoney } from '../data/currencies';
import { calculateProposalJobBreakdown } from '../services/commissionEngine';
import { AFRICAN_COUNTRIES } from '../data/countries';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Lock,
  Star,
  Info,
  DollarSign,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JobBoardPageProps {
  onNavigate: (path: string) => void;
}

export const JobBoardPage: React.FC<JobBoardPageProps> = ({ onNavigate }) => {
  const { currentUser, login } = useAuth();
  const { jobsList, talentList, postJob, createProject, getClientScorecard } = useMarketplace();
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [selectedJobForProposal, setSelectedJobForProposal] = useState<Job | null>(null);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Development & Tech');
  const [newDesc, setNewDesc] = useState('');
  const [newSkills, setNewSkills] = useState('React, TypeScript, Node.js');
  const [newBudget, setNewBudget] = useState('500000');
  const [newCurrency, setNewCurrency] = useState('NGN');
  const [newCountryPref, setNewCountryPref] = useState('Africa-wide');

  // Proposal State
  const [proposalPrice, setProposalPrice] = useState('450000');
  const [proposalTimeline, setProposalTimeline] = useState('14');
  const [proposalMsg, setProposalMsg] = useState('');

  const filteredJobs = jobsList.filter(job => {
    if (selectedCategory !== 'ALL' && job.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchSkill = job.skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkill) return false;
    }
    return true;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    postJob({
      client_id: currentUser ? currentUser.id : 'user-client-kenya',
      client_name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'David Kamau',
      client_country: currentUser ? currentUser.country : 'Kenya',
      title: newTitle,
      category: newCategory,
      description: newDesc,
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      budget: createMoney(parseFloat(newBudget) || 300000, newCurrency),
      country_preference: newCountryPref,
      remote: true
    });

    setShowPostJobModal(false);
    showToast('Job Published!', 'Your job is now open for proposals from talent across Africa.');
  };

  const currentPriceMoney = createMoney(
    parseFloat(proposalPrice) || 450000,
    selectedJobForProposal ? selectedJobForProposal.budget.currency : 'NGN'
  );
  const proposalBreakdown = calculateProposalJobBreakdown(currentPriceMoney);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForProposal) return;

    // Ensure user is signed in as talent
    if (!currentUser) {
      login('amaka@refeir.africa');
    }

    const baseTalent = talentList.find(t => t.id === currentUser?.id || t.user_id === currentUser?.id) || talentList[0];
    const talentUser = {
      ...baseTalent,
      starting_price: currentPriceMoney
    };

    createProject({
      title: `${selectedJobForProposal.title} (Proposal Hire)`,
      talent: talentUser,
      client: {
        id: selectedJobForProposal.client_id,
        name: selectedJobForProposal.client_name,
        country: selectedJobForProposal.client_country
      },
      amount: currentPriceMoney,
      origin: 'PROPOSAL_HIRE',
      is_proposal_hire: true
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}

    setSelectedJobForProposal(null);
    showToast(
      'Proposal Dispatched to Client!',
      `Fee rule applied: 5% client + 5% talent fee deducted upon final milestone release. All chatting must remain on Refeir.`,
      'SUCCESS'
    );
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-blue)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Briefcase size={14} />
            <span>PAN-AFRICAN JOB BOARD</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            Client Opportunities Across Africa
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Browse open contracts with Trust Vault protection or post your requirements to reach vetted talent.
          </p>
        </div>

        <button
          onClick={() => setShowPostJobModal(true)}
          className="rf-btn rf-btn-primary rf-btn-lg"
          style={{ gap: '0.5rem' }}
        >
          <Plus size={18} />
          <span>Post a Job Requirement</span>
        </button>
      </div>

      {/* Mandatory In-Platform Rule & Proposal Fee Split Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.12) 0%, rgba(13, 34, 23, 0.95) 100%)',
          border: '1.5px solid rgba(102, 187, 42, 0.35)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(102, 187, 42, 0.2)',
              border: '1px solid rgba(102, 187, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--rf-leaf-green)',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Proposal-Based Jobs: 5% Client + 5% Talent Split Fee</span>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: '#66BB2A', color: '#07160D', fontWeight: 800 }}>
                Direct Job Board Rule
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', margin: '0.2rem 0 0 0' }}>
              For jobs initiated through open proposals (without a Scout), Refeir takes 5% from the client and 5% from the talent at the final milestone. <strong>All chatting and negotiations must be conducted strictly within the platform.</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', fontWeight: 700 }}>
            🔒 End-to-End Trust Vault Escrow
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
          <input
            type="text"
            className="rf-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search by job title, deliverables, tech stack..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--rf-slate-400)" />
          <select
            className="rf-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Development & Tech">Development & Tech</option>
            <option value="Design & Creative">Design & Creative</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="Marketing & Sales">Marketing & Sales</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onSelect={j => setSelectedJobForProposal(j)}
          />
        ))}
      </div>

      {/* Post a Job Modal */}
      {showPostJobModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowPostJobModal(false)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
              Post a New Project Requirement
            </h3>

            <form onSubmit={handleCreateJob}>
              <div className="rf-form-group">
                <label className="rf-label">Project Title</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Mobile Engineer for Cross-Border Payments App"
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Category</label>
                <select className="rf-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  <option value="Development & Tech">Development & Tech</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Project Description</label>
                <textarea
                  required
                  className="rf-textarea"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Describe deliverables, required tech stack, and timeline..."
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  className="rf-input"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label">Budget (Major Units)</label>
                  <input
                    type="number"
                    required
                    className="rf-input"
                    value={newBudget}
                    onChange={e => setNewBudget(e.target.value)}
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Currency</label>
                  <select className="rf-select" value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Geographic Preference</label>
                <select className="rf-select" value={newCountryPref} onChange={e => setNewCountryPref(e.target.value)}>
                  <option value="Africa-wide">Africa-wide (All Countries)</option>
                  <option value="West Africa">West Africa</option>
                  <option value="East Africa">East Africa</option>
                  <option value="Southern Africa">Southern Africa</option>
                  <option value="North Africa">North Africa</option>
                  <option value="Central Africa">Central Africa</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowPostJobModal(false)} className="rf-btn rf-btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="rf-btn rf-btn-primary" style={{ flex: 1 }}>
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Proposal Modal with 5%+5% Fee Split & In-Platform Chat Rule */}
      {selectedJobForProposal && (
        <div className="rf-modal-backdrop" onClick={() => setSelectedJobForProposal(null)}>
          <div
            className="rf-modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '620px', backgroundColor: '#07160D', border: '1.5px solid rgba(102, 187, 42, 0.45)', padding: 0 }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Submit Proposal for {selectedJobForProposal.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                  Client Budget: {formatMoney(selectedJobForProposal.budget)} • Client: {selectedJobForProposal.client_name} ({selectedJobForProposal.client_country})
                </p>
              </div>

              <button
                onClick={() => setSelectedJobForProposal(null)}
                className="rf-btn-ghost"
                style={{ color: 'var(--rf-slate-400)', padding: '0.25rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              {/* Client Reputation Scorecard Snippet */}
              <div style={{ marginBottom: '1.5rem' }}>
                <ClientReputationScorecard
                  clientId={selectedJobForProposal.client_id}
                  clientName={selectedJobForProposal.client_name}
                />
              </div>

              <form onSubmit={handleSubmitProposal}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="rf-form-group">
                    <label className="rf-label">Proposed Price ({selectedJobForProposal.budget.currency})</label>
                    <input
                      type="number"
                      required
                      className="rf-input"
                      value={proposalPrice}
                      onChange={e => setProposalPrice(e.target.value)}
                    />
                  </div>
                  <div className="rf-form-group">
                    <label className="rf-label">Timeline (Days)</label>
                    <input
                      type="number"
                      required
                      className="rf-input"
                      value={proposalTimeline}
                      onChange={e => setProposalTimeline(e.target.value)}
                    />
                  </div>
                </div>

                {/* 5% Client + 5% Talent Fee Breakdown Card */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(102, 187, 42, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', fontWeight: 600 }}>
                      Client Escrow Total (Amount + 5% Fee):
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                      {formatMoney(proposalBreakdown.client_total_amount)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#66BB2A', fontWeight: 700 }}>
                      Talent Net Payout (Amount - 5% Success Fee at Final Milestone):
                    </span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 900, color: '#66BB2A' }}>
                      {formatMoney(proposalBreakdown.talent_net_amount)}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    Refeir collects 5% from client + 5% from talent upon final milestone release (10% total Refeir revenue).
                  </div>
                </div>

                <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="rf-label">Cover Message & Technical Approach</label>
                  <textarea
                    required
                    rows={4}
                    className="rf-textarea"
                    value={proposalMsg}
                    onChange={e => setProposalMsg(e.target.value)}
                    placeholder="Explain why you are the best fit, relevant past work, and how you will tackle the requirements..."
                  />
                </div>

                {/* Strict In-Platform Chat Rule Banner */}
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <Lock size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.75rem', color: '#FCA5A5', lineHeight: 1.4 }}>
                    <strong>Mandatory Platform Policy:</strong> All chatting, negotiations, and milestone submissions must be done strictly within Refeir to maintain 100% Trust Vault payment protection.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setSelectedJobForProposal(null)} className="rf-btn rf-btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="rf-btn rf-btn-mint" style={{ flex: 1, gap: '0.5rem', fontWeight: 800 }}>
                    <Send size={15} />
                    <span>Submit Proposal</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
