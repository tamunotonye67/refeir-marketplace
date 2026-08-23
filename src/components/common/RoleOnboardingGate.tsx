import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Sparkles,
  Briefcase,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Building2,
  Coins,
  Globe2,
  FileCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoleOnboardingGateProps {
  targetRole: 'SCOUT' | 'TALENT' | 'CLIENT';
  onNavigate: (path: string) => void;
  onCompleted?: () => void;
}

export const RoleOnboardingGate: React.FC<RoleOnboardingGateProps> = ({
  targetRole,
  onNavigate,
  onCompleted = () => {}
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useNotification();

  // SCOUT ONBOARDING FORM STATE
  const [scoutSpecialty, setScoutSpecialty] = useState(
    currentUser?.scout_specialty || 'Software Engineering & Tech'
  );
  const [scoutPayoutMethod, setScoutPayoutMethod] = useState(
    currentUser?.scout_payout_preference || 'Bank Transfer (Direct NGN / KES / GHS / ZAR)'
  );
  const [scoutNetworkSize, setScoutNetworkSize] = useState(
    currentUser?.scout_network_size || '10 - 50 professional contacts'
  );
  const [scoutAgreed, setScoutAgreed] = useState(false);

  // TALENT ONBOARDING FORM STATE
  const [talentHeadline, setTalentHeadline] = useState(
    currentUser?.headline || 'Senior Full-Stack Engineer'
  );
  const [talentBio, setTalentBio] = useState(
    currentUser?.bio || 'Passionate software craftsman building scalable web and mobile solutions across Africa.'
  );
  const [talentYearsExp, setTalentYearsExp] = useState(
    currentUser?.talent_years_experience?.toString() || '4'
  );
  const [talentStartingRate, setTalentStartingRate] = useState(
    currentUser?.talent_starting_rate?.toString() || '350000'
  );
  const [talentRateCurrency, setTalentRateCurrency] = useState(
    currentUser?.talent_rate_currency || 'NGN'
  );
  const [talentAvailability, setTalentAvailability] = useState(
    currentUser?.talent_availability || 'Available Now'
  );
  const [talentPortfolioUrl, setTalentPortfolioUrl] = useState(
    currentUser?.portfolio_url || 'https://github.com/'
  );
  const [talentAgreed, setTalentAgreed] = useState(false);

  // CLIENT ONBOARDING FORM STATE
  const [companyName, setCompanyName] = useState(
    currentUser?.company_name || `${currentUser?.first_name || 'My'} Ventures`
  );
  const [companyIndustry, setCompanyIndustry] = useState(
    currentUser?.company_industry || 'Fintech & Digital Commerce'
  );
  const [companySize, setCompanySize] = useState(
    currentUser?.company_size || 'Startup (1 - 10 employees)'
  );
  const [clientHiringScope, setClientHiringScope] = useState(
    currentUser?.client_hiring_scope || 'Immediate Milestone-Based Project'
  );
  const [clientBillingCurrency, setClientBillingCurrency] = useState(
    currentUser?.client_billing_currency || 'USD'
  );
  const [clientAgreed, setClientAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitScout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoutAgreed) {
      showToast('Agreement Required', 'Please accept the Scout Referral & Anti-Circumvention Policy.', 'WARNING');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      updateProfile({
        scout_onboarding_completed: true,
        scout_specialty: scoutSpecialty,
        scout_payout_preference: scoutPayoutMethod,
        scout_network_size: scoutNetworkSize
      });
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
      showToast('Scout Dashboard Unlocked!', 'Welcome to the Scout Network. Your 0% referral links and Airfee token rails are now active.');
      onCompleted();
    }, 400);
  };

  const handleSubmitTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!talentAgreed) {
      showToast('Agreement Required', 'Please agree to in-platform deliverable submission and escrow policies.', 'WARNING');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      updateProfile({
        talent_onboarding_completed: true,
        headline: talentHeadline,
        bio: talentBio,
        portfolio_url: talentPortfolioUrl,
        talent_years_experience: parseInt(talentYearsExp) || 3,
        talent_starting_rate: parseFloat(talentStartingRate) || 300000,
        talent_rate_currency: talentRateCurrency,
        talent_availability: talentAvailability
      });
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
      showToast('Talent Hub Unlocked!', 'Your professional talent profile is verified and ready to accept contracts.');
      onCompleted();
    }, 400);
  };

  const handleSubmitClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientAgreed) {
      showToast('Agreement Required', 'Please agree to the Refeir Payment Protection & Custody terms.', 'WARNING');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      updateProfile({
        client_onboarding_completed: true,
        company_name: companyName,
        company_industry: companyIndustry,
        company_size: companySize,
        client_hiring_scope: clientHiringScope,
        client_billing_currency: clientBillingCurrency
      });
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
      showToast('Client Hub Unlocked!', 'Your organization account is active. You can now post jobs and hire with 100% payment protection.');
      onCompleted();
    }, 400);
  };

  return (
    <div className="rf-container" style={{ paddingTop: '3.5rem', paddingBottom: '6rem', maxWidth: '820px' }}>
      <div
        className="rf-card"
        style={{
          padding: '3rem 2.5rem',
          background: 'linear-gradient(180deg, rgba(14, 38, 25, 0.95) 0%, rgba(7, 20, 13, 0.98) 100%)',
          border: '1.5px solid rgba(102, 187, 42, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Top Role Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(102, 187, 42, 0.15)',
              border: '1.5px solid rgba(102, 187, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--rf-leaf-green)',
              boxShadow: '0 0 25px rgba(102, 187, 42, 0.3)'
            }}
          >
            {targetRole === 'SCOUT' ? (
              <Sparkles size={28} />
            ) : targetRole === 'TALENT' ? (
              <Users size={28} />
            ) : (
              <Building2 size={28} />
            )}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--rf-leaf-green)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(102, 187, 42, 0.1)',
              padding: '0.3rem 0.85rem',
              borderRadius: '100px',
              marginBottom: '0.75rem',
              border: '1px solid rgba(102, 187, 42, 0.25)'
            }}
          >
            <Shield size={13} /> PROFILE SETUP REQUIRED
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {targetRole === 'SCOUT'
              ? 'Complete Your Scout Profile'
              : targetRole === 'TALENT'
              ? 'Set Up Your Talent Hub'
              : 'Complete Client Organization Setup'}
          </h1>

          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', maxWidth: '560px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
            {targetRole === 'SCOUT'
              ? 'To generate exclusive local client introduction links and earn 0% platform fee commissions, please fill in your scouting details.'
              : targetRole === 'TALENT'
              ? 'To receive milestone contracts, submit deliverables, and get protected escrow payouts, please configure your talent profile.'
              : 'To post job briefs, fund escrow milestones, and access verified African developers, please register your organization details.'}
          </p>
        </div>

        {/* 1. SCOUT SETUP FORM */}
        {targetRole === 'SCOUT' && (
          <form onSubmit={handleSubmitScout} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Primary Scout Specialty / Domain</label>
                <select
                  className="rf-input"
                  value={scoutSpecialty}
                  onChange={e => setScoutSpecialty(e.target.value)}
                >
                  <option value="Software Engineering & Tech">Software Engineering & Tech</option>
                  <option value="Product Design & UI/UX">Product Design & UI/UX</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Fintech & Web3 Connectors">Fintech & Web3 Connectors</option>
                  <option value="Growth, Marketing & Operations">Growth, Marketing & Operations</option>
                </select>
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Estimated Network Size</label>
                <select
                  className="rf-input"
                  value={scoutNetworkSize}
                  onChange={e => setScoutNetworkSize(e.target.value)}
                >
                  <option value="1 - 10 contacts">1 - 10 contacts</option>
                  <option value="10 - 50 professional contacts">10 - 50 professional contacts</option>
                  <option value="50 - 200 tech professionals">50 - 200 tech professionals</option>
                  <option value="200+ industry network">200+ industry network</option>
                </select>
              </div>
            </div>

            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">Preferred Payout Channel for Commissions</label>
              <select
                className="rf-input"
                value={scoutPayoutMethod}
                onChange={e => setScoutPayoutMethod(e.target.value)}
              >
                <option value="Bank Transfer (Direct NGN / KES / GHS / ZAR)">Direct Local Bank Transfer (NGN / KES / GHS / ZAR)</option>
                <option value="Mobile Money (M-Pesa / MTN MoMo / Telebirr)">Mobile Money (M-Pesa / MTN MoMo / Telebirr / Orange)</option>
                <option value="USDT TRC-20 / USDC Cross-Border">USDT TRC-20 / USDC Cross-Border Stablecoin</option>
              </select>
            </div>

            {/* Scout Economic Benefits Callout */}
            <div
              style={{
                background: 'rgba(102, 187, 42, 0.08)',
                border: '1px solid rgba(102, 187, 42, 0.25)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--rf-cream)'
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--rf-leaf-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> YOUR ACTIVATED REFERRAL BENEFITS
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--rf-slate-300)' }}>
                <li><strong>0% Fee Forever:</strong> Keep 100% of proceeds for talent offers &le; 10%.</li>
                <li><strong>Monthly Airfee Tokens:</strong> Share your exclusive local client link to waive 2% fee on high-tier deals.</li>
                <li><strong>Instant Automated Splits:</strong> Funds deposited directly upon milestone approval.</li>
              </ul>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                fontSize: '0.8125rem',
                color: 'var(--rf-slate-300)',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              <input
                type="checkbox"
                checked={scoutAgreed}
                onChange={e => setScoutAgreed(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <span>
                I agree to the Refeir Scout Code of Conduct, strictly in-platform communications, and understand that sharing contacts outside Refeir leads to asset forfeiture.
              </span>
            </label>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('/marketplace')}
                className="rf-btn rf-btn-secondary"
                style={{ flex: 1 }}
              >
                Browse Marketplace
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rf-btn rf-btn-mint"
                style={{ flex: 2, gap: '0.5rem' }}
              >
                <span>{isSubmitting ? 'Unlocking...' : 'Unlock Scout Dashboard →'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. TALENT SETUP FORM */}
        {targetRole === 'TALENT' && (
          <form onSubmit={handleSubmitTalent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">Professional Headline</label>
              <input
                type="text"
                required
                className="rf-input"
                value={talentHeadline}
                onChange={e => setTalentHeadline(e.target.value)}
                placeholder="e.g. Senior Flutter & Node.js Developer"
              />
            </div>

            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">Short Professional Bio</label>
              <textarea
                required
                rows={2}
                className="rf-textarea"
                value={talentBio}
                onChange={e => setTalentBio(e.target.value)}
                placeholder="Describe your technical expertise, track record, and key achievements..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Years of Experience</label>
                <select
                  className="rf-input"
                  value={talentYearsExp}
                  onChange={e => setTalentYearsExp(e.target.value)}
                >
                  <option value="1">1 - 2 Years</option>
                  <option value="3">3 - 5 Years (Mid-Level)</option>
                  <option value="6">6 - 8 Years (Senior)</option>
                  <option value="10">10+ Years (Lead / Principal)</option>
                </select>
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Availability</label>
                <select
                  className="rf-input"
                  value={talentAvailability}
                  onChange={e => setTalentAvailability(e.target.value)}
                >
                  <option value="Available Now">Available Now</option>
                  <option value="Part-time">Part-time (20 hrs/wk)</option>
                  <option value="Full-time">Full-time Contract</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Starting Project / Milestone Rate</label>
                <input
                  type="number"
                  required
                  className="rf-input"
                  value={talentStartingRate}
                  onChange={e => setTalentStartingRate(e.target.value)}
                  placeholder="300000"
                />
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Currency</label>
                <select
                  className="rf-input"
                  value={talentRateCurrency}
                  onChange={e => setTalentRateCurrency(e.target.value)}
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="GHS">GHS (GH₵)</option>
                  <option value="ZAR">ZAR (R)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">Portfolio URL / GitHub / LinkedIn</label>
              <input
                type="url"
                required
                className="rf-input"
                value={talentPortfolioUrl}
                onChange={e => setTalentPortfolioUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
              />
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                fontSize: '0.8125rem',
                color: 'var(--rf-slate-300)',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              <input
                type="checkbox"
                checked={talentAgreed}
                onChange={e => setTalentAgreed(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <span>
                I agree to submit all project deliverables exclusively via the Refeir Deliverables Console and conduct all client communications within Refeir to maintain full escrow payment protection.
              </span>
            </label>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('/marketplace')}
                className="rf-btn rf-btn-secondary"
                style={{ flex: 1 }}
              >
                Browse Marketplace
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rf-btn rf-btn-primary"
                style={{ flex: 2, gap: '0.5rem' }}
              >
                <span>{isSubmitting ? 'Activating...' : 'Unlock Talent Workspace →'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. CLIENT SETUP FORM */}
        {targetRole === 'CLIENT' && (
          <form onSubmit={handleSubmitClient} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Company or Organization Name</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global Tech"
                />
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Industry / Sector</label>
                <select
                  className="rf-input"
                  value={companyIndustry}
                  onChange={e => setCompanyIndustry(e.target.value)}
                >
                  <option value="Fintech & Digital Banking">Fintech & Digital Banking</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Healthtech & MedTech">Healthtech & MedTech</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="EdTech & Digital Education">EdTech & Digital Education</option>
                  <option value="Software & SaaS">Software & SaaS</option>
                  <option value="Creative Agency & Media">Creative Agency & Media</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Company Size</label>
                <select
                  className="rf-input"
                  value={companySize}
                  onChange={e => setCompanySize(e.target.value)}
                >
                  <option value="Individual Founder">Individual Founder</option>
                  <option value="Startup (1 - 10 employees)">Startup (1 - 10 employees)</option>
                  <option value="Growth (11 - 50 employees)">Growth (11 - 50 employees)</option>
                  <option value="Enterprise (50+ employees)">Enterprise (50+ employees)</option>
                </select>
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Preferred Settlement Currency</label>
                <select
                  className="rf-input"
                  value={clientBillingCurrency}
                  onChange={e => setClientBillingCurrency(e.target.value)}
                >
                  <option value="USD">USD ($ - Global Escrow)</option>
                  <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                  <option value="KES">KES (KSh - Kenyan Shilling)</option>
                  <option value="GHS">GHS (GH₵ - Ghanaian Cedi)</option>
                  <option value="ZAR">ZAR (R - South African Rand)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
            </div>

            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">Primary Hiring Goal</label>
              <select
                className="rf-input"
                value={clientHiringScope}
                onChange={e => setClientHiringScope(e.target.value)}
              >
                <option value="Immediate Milestone-Based Project">Immediate Milestone-Based Project</option>
                <option value="Dedicated Monthly Retainer">Dedicated Monthly Retainer</option>
                <option value="Direct Full-Time Technical Hire">Direct Full-Time Technical Hire</option>
              </select>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                fontSize: '0.8125rem',
                color: 'var(--rf-slate-300)',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              <input
                type="checkbox"
                checked={clientAgreed}
                onChange={e => setClientAgreed(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <span>
                I agree to the Refeir 100% Payment Protection terms, funding milestone escrows prior to work commencement, and keeping all communications on-platform.
              </span>
            </label>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('/marketplace')}
                className="rf-btn rf-btn-secondary"
                style={{ flex: 1 }}
              >
                Browse Marketplace
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rf-btn rf-btn-primary"
                style={{ flex: 2, gap: '0.5rem' }}
              >
                <span>{isSubmitting ? 'Activating...' : 'Unlock Client Dashboard →'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
