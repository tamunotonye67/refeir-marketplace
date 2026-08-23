import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { StatementOfAccountModal } from '../components/wallet/StatementOfAccountModal';
import { AddPayoutMethodModal } from '../components/wallet/AddPayoutMethodModal';
import { TAX_JURISDICTIONS, getTaxJurisdiction } from '../data/taxJurisdictions';
import { TaxIdType, TaxBusinessType } from '../types';
import {
  User,
  Mail,
  Phone,
  Globe2,
  MapPin,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Link as LinkIcon,
  Code2,
  Share2,
  Globe,
  Save,
  Award,
  AlertCircle,
  Clock,
  Trash2,
  Plus,
  ExternalLink,
  ArrowRight,
  FileText,
  Percent,
  Building,
  Smartphone,
  Coins,
  Star,
  Download
} from 'lucide-react';

interface ProfileSettingsPageProps {
  onNavigate?: (path: string) => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onNavigate = () => {} }) => {
  const { currentUser, updateProfile, switchRole } = useAuth();
  const { getUserWallet, setDefaultPayoutMethod, deletePayoutMethod } = useMarketplace();
  const { showToast, addAppNotification } = useNotification();

  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'PROFESSIONAL' | 'LINKS' | 'VERIFICATION' | 'TAX' | 'PAYOUT'>('PERSONAL');
  const [isSaving, setIsSaving] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const wallet = getUserWallet(userId);

  // Form State
  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+234 800 000 0000',
    country: currentUser?.country || 'Nigeria',
    city: currentUser?.city || 'Lagos',
    primary_language: currentUser?.primary_language || 'English',
    timezone: currentUser?.timezone || 'Africa/Lagos',
    avatar_url: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: currentUser?.headline || 'Senior Full-Stack & Smart Contract Engineer',
    bio: currentUser?.bio || 'Building decentralized financial rails and sovereign talent marketplaces across Africa and global distributed teams.',
    portfolio_url: currentUser?.portfolio_url || 'https://refeir.africa',
    github_url: currentUser?.github_url || 'https://github.com/refeir-africa',
    linkedin_url: currentUser?.linkedin_url || 'https://linkedin.com/company/refeir-africa',
    twitter_url: currentUser?.twitter_url || 'https://x.com/RefeirAfrica',
    skills: currentUser?.skills || ['React', 'TypeScript', 'Node.js', 'Solidity', 'Escrow Architecture', 'Smart Contracts'],
    active_role: currentUser?.active_role || 'TALENT',
    // Tax Fields
    tax_country: currentUser?.tax_country || currentUser?.country || 'Nigeria',
    tax_id_type: currentUser?.tax_id_type || (currentUser?.country === 'Nigeria' ? 'NIGERIA_TIN' : 'INTERNATIONAL_TAX_ID'),
    tax_id_number: currentUser?.tax_id_number || (currentUser?.country === 'Nigeria' ? '23891024-0001' : ''),
    tax_business_type: currentUser?.tax_business_type || 'INDIVIDUAL_FREELANCER',
    registered_company_rc: currentUser?.registered_company_rc || '',
    vat_registered: currentUser?.vat_registered || false,
    vat_id_number: currentUser?.vat_id_number || ''
  });

  const [newSkill, setNewSkill] = useState('');

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result as string }));
        showToast('Avatar Photo Loaded', 'Click "Save Profile Changes" to persist your new photo.', 'INFO');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        primary_language: formData.primary_language,
        timezone: formData.timezone,
        avatar_url: formData.avatar_url,
        headline: formData.headline,
        bio: formData.bio,
        portfolio_url: formData.portfolio_url,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        skills: formData.skills,
        active_role: formData.active_role
      });

      if (formData.active_role !== currentUser?.active_role) {
        switchRole(formData.active_role);
      }

      showToast(
        'Profile Updated Successfully!',
        'Your profile details and links are now live and synchronized across Refeir.',
        'SUCCESS'
      );

      addAppNotification({
        title: 'Profile Details Updated',
        message: 'Your personal information, skills, and portfolio links have been updated successfully.',
        type: 'SUCCESS',
        category: 'SYSTEM',
        email_dispatched: true,
        email_recipient: formData.email
      });
    } catch (err) {
      showToast('Update Failed', 'Unable to save profile changes. Please try again.', 'WARNING');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '880px' }}>
      {/* Header Banner */}
      <div
        className="rf-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(10, 30, 18, 0.95) 0%, rgba(7, 22, 13, 0.98) 100%)',
          border: '1.5px solid rgba(102, 187, 42, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Avatar with Camera Overlay */}
          <div style={{ position: 'relative' }}>
            <img
              src={formData.avatar_url}
              alt={formData.first_name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid var(--rf-leaf-green)',
                boxShadow: '0 0 20px rgba(102, 187, 42, 0.4)'
              }}
            />
            <label
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--rf-leaf-green)',
                color: 'var(--rf-dark-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}
              title="Change Profile Photo"
            >
              <Camera size={14} />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                {formData.first_name} {formData.last_name}
              </h1>
              {currentUser?.verification_status === 'PROFESSION_VERIFIED' || currentUser?.verification_status === 'IDENTITY_VERIFIED' ? (
                <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} /> Verified Sovereign
                </span>
              ) : (
                <span className="rf-badge rf-text-xs" style={{ background: 'rgba(244, 185, 66, 0.15)', color: '#F4B942', border: '1px solid rgba(244, 185, 66, 0.3)' }}>
                  Unverified
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--rf-slate-300)', margin: '0 0 0.5rem 0' }}>
              {formData.headline}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} color="var(--rf-leaf-green)" /> {formData.city}, {formData.country}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Mail size={12} color="var(--rf-leaf-green)" /> {formData.email}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowStatementModal(true)}
            className="rf-btn rf-btn-secondary rf-btn-sm"
            style={{ fontWeight: 700, gap: '0.35rem' }}
            title="Download Audited Statement of Account"
          >
            <FileText size={14} />
            <span>Statement of Account</span>
          </button>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/verification')}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ fontWeight: 800 }}
            >
              <ShieldCheck size={14} />
              <span>Biometric KYC Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--rf-bg-card-border)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { key: 'PERSONAL', label: '1. Personal & Identity', icon: User },
          { key: 'PROFESSIONAL', label: '2. Role, Bio & Skills', icon: Briefcase },
          { key: 'LINKS', label: '3. Portfolio & Social Links', icon: LinkIcon },
          { key: 'VERIFICATION', label: '4. Sovereign Trust & KYC', icon: ShieldCheck },
          { key: 'TAX', label: '5. Tax & Compliance', icon: Percent },
          { key: 'PAYOUT', label: '6. Payout & Bank Details', icon: Building }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--rf-radius-md)',
                background: isActive ? 'rgba(102, 187, 42, 0.15)' : 'transparent',
                border: isActive ? '1px solid var(--rf-leaf-green)' : '1px solid transparent',
                color: isActive ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        {/* =========================================================================
            TAB 1: PERSONAL & IDENTITY DETAILS
            ========================================================================= */}
        {activeTab === 'PERSONAL' && (
          <div className="rf-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} color="var(--rf-leaf-green)" />
              <span>Personal Identity & Contact Information</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1.5rem' }}>
              Your legal name should match your official National ID or Passport to ensure smooth OCR alignment and instant KYC verification.
            </p>

            <div className="rf-grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">First Name *</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="e.g. Chidi"
                />
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Last Name *</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="e.g. Okafor"
                />
              </div>
            </div>

            <div className="rf-grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="rf-input"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="chidi.okafor@refeir.africa"
                />
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="rf-input"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 802 987 6543"
                />
              </div>
            </div>

            <div className="rf-grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Sovereign Country</label>
                <select
                  className="rf-select"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="Nigeria">Nigeria (NGN ₦)</option>
                  <option value="Ghana">Ghana (GHS GH₵)</option>
                  <option value="Kenya">Kenya (KES KSh)</option>
                  <option value="Rwanda">Rwanda (RWF RF)</option>
                  <option value="South Africa">South Africa (ZAR R)</option>
                  <option value="Egypt">Egypt (EGP E£)</option>
                  <option value="Pan-Africa">Pan-Africa (Multi-Currency)</option>
                </select>
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">City / Hub Location</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Lagos, Nairobi, or Accra"
                />
              </div>
            </div>

            <div className="rf-grid-2" style={{ gap: '1.25rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Primary Language</label>
                <input
                  type="text"
                  className="rf-input"
                  value={formData.primary_language}
                  onChange={e => setFormData({ ...formData, primary_language: e.target.value })}
                  placeholder="e.g. English, French, Swahili"
                />
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">Timezone</label>
                <input
                  type="text"
                  className="rf-input"
                  value={formData.timezone}
                  onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                  placeholder="e.g. Africa/Lagos (GMT+1)"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ROLE, BIO & SKILLS
            ========================================================================= */}
        {activeTab === 'PROFESSIONAL' && (
          <div className="rf-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={18} color="var(--rf-leaf-green)" />
              <span>Professional Role, Bio & Skill Matrix</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1.5rem' }}>
              Highlight your core African and global expertise to maximize matching with scouts, employers, and client contracts.
            </p>

            <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="rf-label">Primary Active Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {[
                  { role: 'TALENT', label: 'Talent / Freelancer', desc: 'Get hired & earn escrow payouts' },
                  { role: 'SCOUT', label: 'Scout / Connector', desc: 'Refer talent & earn 10% lifetime' },
                  { role: 'CLIENT', label: 'Recruiter / Client', desc: 'Post jobs & hire verified peers' },
                  { role: 'BUSINESS', label: 'Enterprise Business', desc: 'Scale cross-border teams' }
                ].map(r => (
                  <div
                    key={r.role}
                    onClick={() => setFormData({ ...formData, active_role: r.role as any })}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--rf-radius-md)',
                      border: formData.active_role === r.role ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)',
                      background: formData.active_role === r.role ? 'rgba(102, 187, 42, 0.12)' : 'var(--rf-bg-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: formData.active_role === r.role ? 'var(--rf-leaf-green)' : 'var(--rf-cream)' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '0.2rem' }}>
                      {r.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="rf-label">Professional Headline *</label>
              <input
                type="text"
                required
                className="rf-input"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Senior Smart Contract Architect & Full-Stack Engineer"
              />
            </div>

            <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="rf-label">Bio & Professional Summary *</label>
              <textarea
                rows={4}
                required
                className="rf-input"
                style={{ resize: 'vertical' }}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe your background, technical focus, and achievements..."
              />
            </div>

            {/* Skills Tags Manager */}
            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">Skills & Specializations</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="rf-input"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Type a skill and press Add (e.g. Next.js, Flutter, Escrow)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="rf-btn rf-btn-mint rf-btn-sm"
                  style={{ whiteSpace: 'nowrap', fontWeight: 800 }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(102, 187, 42, 0.15)',
                      border: '1px solid rgba(102, 187, 42, 0.35)',
                      color: 'var(--rf-leaf-green)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PORTFOLIO & SOCIAL LINKS
            ========================================================================= */}
        {activeTab === 'LINKS' && (
          <div className="rf-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LinkIcon size={18} color="var(--rf-leaf-green)" />
              <span>Sovereign Portfolio & Online Social Presence</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1.5rem' }}>
              Connect your verified GitHub, LinkedIn, portfolio repository, and social channels.
            </p>

            <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="rf-label">Personal Portfolio / Website Link</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  className="rf-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.portfolio_url}
                  onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
                <Globe2 size={16} color="var(--rf-slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="rf-label">GitHub Profile URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  className="rf-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.github_url}
                  onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/yourhandle"
                />
                <Code2 size={16} color="var(--rf-slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="rf-label">LinkedIn Profile URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  className="rf-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.linkedin_url}
                  onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/yourhandle"
                />
                <Globe size={16} color="var(--rf-slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="rf-form-group" style={{ margin: 0 }}>
              <label className="rf-label">X (Twitter) Profile Handle / URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  className="rf-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.twitter_url}
                  onChange={e => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://x.com/yourhandle"
                />
                <Share2 size={16} color="var(--rf-slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SOVEREIGN TRUST & KYC STATUS
            ========================================================================= */}
        {activeTab === 'VERIFICATION' && (
          <div className="rf-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--rf-leaf-green)" />
              <span>Sovereign Identity & Biometric Trust Status</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1.5rem' }}>
              Refeir safeguards contracts through automated 4-Factor Identity Alignments (Government ID OCR, DOB, NIN, and 3D Live Biometrics).
            </p>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--rf-radius-lg)',
                background: 'rgba(102, 187, 42, 0.08)',
                border: '1.5px solid var(--rf-leaf-green)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="var(--rf-leaf-green)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    Tier 2 Sovereign Verification Status
                  </span>
                </div>
                <span className="rf-badge rf-badge-mint">
                  <CheckCircle2 size={13} /> Active Sovereign Verified
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Your account is protected under Pan-African Escrow Standards. Your full legal name (<strong>{formData.first_name} {formData.last_name}</strong>) is synced with official registry databases.
              </p>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/verification')}
                className="rf-btn rf-btn-mint rf-btn-lg"
                style={{ width: '100%', fontWeight: 800, justifyContent: 'center' }}
              >
                <span>Launch Biometric Face & OCR Verification Hub</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: TAX & STATUTORY COMPLIANCE (NIGERIA HQ & CROSS-BORDER)
            ========================================================================= */}
        {activeTab === 'TAX' && (
          <div className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Percent size={18} color="#F4B942" />
                  <span>Tax Identification & Cross-Border Residency</span>
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                  Nigeria (FIRS Headquarters) and bilateral Pan-African / International tax compliance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowStatementModal(true)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.35rem' }}
              >
                <FileText size={14} />
                <span>View Full Statement & Tax Ledger</span>
              </button>
            </div>

            {/* Nigeria Headquarters Framework Callout */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(10, 35, 25, 0.95) 0%, rgba(7, 22, 13, 0.95) 100%)',
                border: '1.5px solid rgba(54, 224, 160, 0.35)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
                marginBottom: '1.75rem'
              }}
            >
              <Building size={20} color="var(--rf-mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-200)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--rf-cream)' }}>Refeir Technologies Ltd. (Nigeria Headquarters)</strong>
                <div style={{ color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                  CAC RC Number: <strong>RC-1892044</strong> • FIRS Tax ID: <strong>24891023-0001</strong>. All Nigerian platform fees are subject to 7.5% VAT. Independent contractor payouts include 5% WHT credit certificates recorded in your Statement of Account.
                </div>
              </div>
            </div>

            {/* Country Selector */}
            <div className="rf-form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="rf-label">Country of Permanent Tax Residency *</label>
              <select
                className="rf-select"
                value={formData.tax_country}
                onChange={e => {
                  const newCountry = e.target.value;
                  const newJurisdiction = getTaxJurisdiction(newCountry);
                  let idType: TaxIdType = 'INTERNATIONAL_TAX_ID';
                  if (newCountry === 'Nigeria') idType = 'NIGERIA_TIN';
                  else if (newCountry === 'Kenya') idType = 'KENYA_KRA_PIN';
                  else if (newCountry === 'Ghana') idType = 'GHANA_CARD_TIN';
                  else if (newCountry === 'South Africa') idType = 'SA_SARS_PIN';
                  else if (newCountry === 'United States') idType = 'US_W8BEN_EIN_SSN';
                  else if (newCountry === 'United Kingdom') idType = 'UK_UTR_NIN';

                  setFormData({
                    ...formData,
                    tax_country: newCountry,
                    tax_id_type: idType
                  });
                }}
              >
                {Object.keys(TAX_JURISDICTIONS).map(c => (
                  <option key={c} value={c}>
                    {c} {c === 'Nigeria' ? '★ (Platform Headquarters - FIRS)' : ''}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '4px', display: 'block' }}>
                Governing Tax Authority: <strong style={{ color: 'var(--rf-mint)' }}>{getTaxJurisdiction(formData.tax_country).tax_authority}</strong>
              </span>
            </div>

            {/* Taxpayer Entity Classification */}
            <div className="rf-form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="rf-label">Tax Entity Classification</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.625rem' }}>
                {[
                  { id: 'INDIVIDUAL_FREELANCER', label: 'Individual / Freelancer', desc: 'Personal income earner / independent contractor' },
                  { id: 'REGISTERED_BUSINESS', label: 'Registered Business / Sole Prop', desc: 'CAC Registered Business Name or Sole Proprietor' },
                  { id: 'CORPORATION_ENTERPRISE', label: 'Limited Liability / Corp', desc: 'Registered Company (RC / Inc / Ltd)' }
                ].map(b => (
                  <div
                    key={b.id}
                    onClick={() => setFormData({ ...formData, tax_business_type: b.id as TaxBusinessType })}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--rf-radius-md)',
                      border: formData.tax_business_type === b.id ? '1.5px solid var(--rf-mint)' : '1px solid var(--rf-navy-border)',
                      background: formData.tax_business_type === b.id ? 'rgba(54, 224, 160, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{b.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax ID and RC Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">{getTaxJurisdiction(formData.tax_country).primary_tax_id_name} *</label>
                <input
                  type="text"
                  className="rf-input"
                  style={{ fontFamily: 'var(--rf-font-mono)' }}
                  value={formData.tax_id_number}
                  onChange={e => setFormData({ ...formData, tax_id_number: e.target.value })}
                  placeholder={getTaxJurisdiction(formData.tax_country).tax_id_placeholder}
                />
              </div>

              {formData.tax_country === 'Nigeria' && formData.tax_business_type !== 'INDIVIDUAL_FREELANCER' && (
                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label">CAC RC Registration Number</label>
                  <input
                    type="text"
                    className="rf-input"
                    style={{ fontFamily: 'var(--rf-font-mono)' }}
                    value={formData.registered_company_rc}
                    onChange={e => setFormData({ ...formData, registered_company_rc: e.target.value })}
                    placeholder="e.g. RC-1892044"
                  />
                </div>
              )}
            </div>

            {/* VAT Checkbox */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                    Registered for VAT with {getTaxJurisdiction(formData.tax_country).tax_authority.split('(')[0].trim()}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                    Applicable statutory rate: {getTaxJurisdiction(formData.tax_country).vat_rate_percent}%
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.vat_registered}
                  onChange={e => setFormData({ ...formData, vat_registered: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--rf-mint)' }}
                />
              </div>

              {formData.vat_registered && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rf-navy-border)' }}>
                  <label className="rf-label" style={{ fontSize: '0.75rem' }}>VAT Registration / Identification Number</label>
                  <input
                    type="text"
                    className="rf-input"
                    style={{ fontFamily: 'var(--rf-font-mono)', fontSize: '0.8125rem' }}
                    value={formData.vat_id_number}
                    onChange={e => setFormData({ ...formData, vat_id_number: e.target.value })}
                    placeholder="e.g. NG-VAT-1892044"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: PAYOUT & BANKING CHANNELS
            ========================================================================= */}
        {activeTab === 'PAYOUT' && (
          <div className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={18} color="var(--rf-leaf-green)" />
                  <span>Preferred Payout Channels & Bank Details</span>
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                  Configure your primary local bank account, mobile money wallet, or stablecoin address for automated earnings releases.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPayoutModal(true)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.45rem', padding: '0.55rem 1.15rem' }}
              >
                <Plus size={15} />
                <span>Add Payout Channel</span>
              </button>
            </div>

            {wallet.payout_methods.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-lg)'
                }}
              >
                <Building size={32} color="var(--rf-slate-400)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                  No Payout Channels Linked Yet
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                  Link your local bank account, mobile money wallet (M-Pesa, MTN MoMo), or USDT/USDC address to receive instant project funds.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddPayoutModal(true)}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{ fontWeight: 800 }}
                >
                  <Plus size={14} />
                  <span>Link Bank / Mobile Money</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {wallet.payout_methods.map(pm => (
                  <div
                    key={pm.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: `1.5px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: 'var(--rf-radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: pm.is_default ? 'rgba(102, 187, 42, 0.18)' : 'rgba(36, 87, 255, 0.12)',
                          border: `1px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.35)' : 'rgba(36, 87, 255, 0.25)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {pm.type === 'MOBILE_MONEY' ? (
                          <Smartphone size={22} color="var(--rf-leaf-green)" />
                        ) : pm.type === 'OTHER' ? (
                          <Coins size={22} color="var(--rf-golden-yellow)" />
                        ) : (
                          <Building size={22} color="var(--rf-leaf-green)" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                            {pm.institution_name}
                          </span>
                          {pm.is_default && (
                            <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Star size={10} fill="currentColor" />
                              <span>Primary Payout</span>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)', marginTop: '3px' }}>
                          {pm.masked_identifier}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                          {pm.account_holder_name} • <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{pm.currency} ({pm.country})</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                      {!pm.is_default ? (
                        <button
                          type="button"
                          onClick={() => setDefaultPayoutMethod(userId, pm.id)}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--rf-leaf-green)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: 0
                          }}
                        >
                          <Star size={12} />
                          <span>Set as Default</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={12} color="var(--rf-leaf-green)" />
                          <span>Preferred Destination</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => deletePayoutMethod(userId, pm.id)}
                        title="Remove Payout Channel"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--rf-slate-400)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'var(--rf-slate-400)';
                          e.currentTarget.style.background = 'none';
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="rf-btn rf-btn-primary rf-btn-lg"
            style={{ fontWeight: 800, padding: '0.85rem 2.25rem', opacity: isSaving ? 0.7 : 1 }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Statement of Account Modal */}
      {showStatementModal && (
        <StatementOfAccountModal
          user={currentUser}
          onClose={() => setShowStatementModal(false)}
          onOpenTaxSettings={() => {
            setShowStatementModal(false);
            setActiveTab('TAX');
          }}
        />
      )}

      {/* Add Payout Method Modal */}
      <AddPayoutMethodModal
        userId={userId}
        isOpen={showAddPayoutModal}
        onClose={() => setShowAddPayoutModal(false)}
      />
    </div>
  );
};
