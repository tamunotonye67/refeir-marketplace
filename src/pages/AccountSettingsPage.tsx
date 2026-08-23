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
  Lock,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  MapPin,
  Save,
  Key,
  Smartphone,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck,
  Eye,
  EyeOff,
  FileText,
  Percent,
  Building,
  Coins,
  Star,
  Plus,
  Trash2,
  Download
} from 'lucide-react';

interface AccountSettingsPageProps {
  onNavigate?: (path: string) => void;
}

type SettingsSection = 'ALL' | 'PERSONAL' | 'SECURITY' | 'NOTIFICATIONS' | 'VERIFICATION' | 'TAX' | 'PAYOUT';

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ onNavigate = () => {} }) => {
  const { currentUser, updateProfile } = useAuth();
  const { getUserWallet, setDefaultPayoutMethod, deletePayoutMethod } = useMarketplace();
  const { showToast, addAppNotification } = useNotification();

  const [activeSection, setActiveSection] = useState<SettingsSection>('ALL');
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const wallet = getUserWallet(userId);

  // Personal Information State
  const [personalForm, setPersonalForm] = useState({
    first_name: currentUser?.first_name || 'Chidi',
    last_name: currentUser?.last_name || 'Eze',
    email: currentUser?.email || 'chidi@refeir.africa',
    phone: currentUser?.phone || '+234 803 123 4567',
    country: currentUser?.country || 'Nigeria',
    city: currentUser?.city || 'Lagos',
    primary_language: currentUser?.primary_language || 'English',
    timezone: currentUser?.timezone || 'Africa/Lagos'
  });

  // Tax & Statutory State
  const [taxForm, setTaxForm] = useState({
    tax_country: currentUser?.tax_country || currentUser?.country || 'Nigeria',
    tax_id_type: currentUser?.tax_id_type || (currentUser?.country === 'Nigeria' ? 'NIGERIA_TIN' : 'INTERNATIONAL_TAX_ID'),
    tax_id_number: currentUser?.tax_id_number || (currentUser?.country === 'Nigeria' ? '23891024-0001' : ''),
    tax_business_type: currentUser?.tax_business_type || 'INDIVIDUAL_FREELANCER',
    registered_company_rc: currentUser?.registered_company_rc || '',
    vat_registered: currentUser?.vat_registered || false,
    vat_id_number: currentUser?.vat_id_number || ''
  });

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    escrowAlerts: true,
    messagePush: true,
    scoutCommissionAlerts: true,
    securityEmails: true,
    weeklyDigest: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));

    updateProfile({
      first_name: personalForm.first_name,
      last_name: personalForm.last_name,
      email: personalForm.email,
      phone: personalForm.phone,
      country: personalForm.country,
      city: personalForm.city,
      primary_language: personalForm.primary_language,
      timezone: personalForm.timezone
    });

    setIsSaving(false);
    showToast('Personal Information Updated', 'Your legal contact and identity details have been saved.', 'SUCCESS');
    addAppNotification({
      title: 'Personal Info Updated',
      message: 'Your account contact and personal details were modified successfully.',
      type: 'INFO',
      category: 'SYSTEM'
    });
  };

  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));

    updateProfile({
      tax_country: taxForm.tax_country,
      tax_id_type: taxForm.tax_id_type as any,
      tax_id_number: taxForm.tax_id_number,
      tax_business_type: taxForm.tax_business_type as any,
      registered_company_rc: taxForm.registered_company_rc || undefined,
      vat_registered: taxForm.vat_registered,
      vat_id_number: taxForm.vat_id_number || undefined
    });

    setIsSaving(false);
    showToast('Tax Profile Updated', `Your ${taxForm.tax_country} tax configuration has been updated.`, 'SUCCESS');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Password Mismatch', 'New password and confirmation do not match.', 'ERROR');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password Too Short', 'Password must be at least 8 characters long.', 'WARNING');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password Updated', 'Your account credentials have been securely updated.', 'SUCCESS');
  };

  const handleSaveNotifications = () => {
    showToast('Notification Preferences Saved', 'Your real-time alert preferences have been applied.', 'SUCCESS');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--rf-dark-green)', padding: '2.5rem 1rem 5rem' }}>
      <div className="rf-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="rf-badge rf-badge-mint rf-text-xs">Account Preferences</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                • {currentUser?.email || 'chidi@refeir.africa'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--rf-cream)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
              Account <span style={{ color: 'var(--rf-leaf-green)' }}>Settings</span>
            </h1>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '680px', lineHeight: 1.6, margin: 0 }}>
              Manage your personal credentials, tax residency, financial statements, and security across Africa.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setShowStatementModal(true)}
              className="rf-btn rf-btn-mint rf-btn-md"
              style={{ fontWeight: 800, gap: '0.4rem' }}
            >
              <FileText size={16} />
              <span>Download Statement of Account</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Card 1: Personal Information */}
          <div
            onClick={() => setActiveSection(activeSection === 'PERSONAL' ? 'ALL' : 'PERSONAL')}
            className="rf-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: activeSection === 'PERSONAL' ? '2px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
              background: activeSection === 'PERSONAL' ? 'rgba(102, 187, 42, 0.1)' : 'var(--rf-bg-card)',
              borderRadius: 'var(--rf-radius-lg)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'var(--rf-leaf-green)'
                }}
              >
                <User size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                Personal Information
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Manage your legal identity details, official email address, phone contact, and regional location.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-leaf-green)' }}>
              <span>{activeSection === 'PERSONAL' ? 'Active Section' : 'Configure Personal Info'}</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 2: Account Security */}
          <div
            onClick={() => setActiveSection(activeSection === 'SECURITY' ? 'ALL' : 'SECURITY')}
            className="rf-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: activeSection === 'SECURITY' ? '2px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
              background: activeSection === 'SECURITY' ? 'rgba(102, 187, 42, 0.1)' : 'var(--rf-bg-card)',
              borderRadius: 'var(--rf-radius-lg)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#38BDF8'
                }}
              >
                <Lock size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                Account Security
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Protect your Refeir account with 2FA, sovereign session management, and password credentials.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8' }}>
              <span>{activeSection === 'SECURITY' ? 'Active Section' : 'Manage Security'}</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 3: Notifications */}
          <div
            onClick={() => setActiveSection(activeSection === 'NOTIFICATIONS' ? 'ALL' : 'NOTIFICATIONS')}
            className="rf-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: activeSection === 'NOTIFICATIONS' ? '2px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
              background: activeSection === 'NOTIFICATIONS' ? 'rgba(102, 187, 42, 0.1)' : 'var(--rf-bg-card)',
              borderRadius: 'var(--rf-radius-lg)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#FBBF24'
                }}
              >
                <Bell size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                Notifications
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Control your real-time email alerts, escrow milestone updates, and direct negotiation push notices.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24' }}>
              <span>{activeSection === 'NOTIFICATIONS' ? 'Active Section' : 'Set Alerts'}</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 4: Identity Verification */}
          <div
            onClick={() => setActiveSection(activeSection === 'VERIFICATION' ? 'ALL' : 'VERIFICATION')}
            className="rf-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: activeSection === 'VERIFICATION' ? '2px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
              background: activeSection === 'VERIFICATION' ? 'rgba(102, 187, 42, 0.1)' : 'var(--rf-bg-card)',
              borderRadius: 'var(--rf-radius-lg)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'var(--rf-leaf-green)'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                Identity Verification
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Review your Tier 2 Sovereign Biometric verification status, verified credentials, and audit logs.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-leaf-green)' }}>
              <span>{activeSection === 'VERIFICATION' ? 'Active Section' : 'Review Biometric Status'}</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 5: Tax Compliance & Statements */}
          <div
            onClick={() => setActiveSection(activeSection === 'TAX' ? 'ALL' : 'TAX')}
            className="rf-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: activeSection === 'TAX' ? '2px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
              background: activeSection === 'TAX' ? 'rgba(102, 187, 42, 0.1)' : 'var(--rf-bg-card)',
              borderRadius: 'var(--rf-radius-lg)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(244, 185, 66, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#F4B942'
                }}
              >
                <Percent size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                Tax & Statement of Account
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Manage TIN, FIRS / KRA / GRA compliance, VAT status, and generate official audited statements.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#F4B942' }}>
              <span>{activeSection === 'TAX' ? 'Active Section' : 'Configure Tax & Statement'}</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 6: Preferred Payout & Banking Channels */}
          <div
            onClick={() => setActiveSection(activeSection === 'PAYOUT' ? 'ALL' : 'PAYOUT')}
            className="rf-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: activeSection === 'PAYOUT' ? '2px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
              background: activeSection === 'PAYOUT' ? 'rgba(102, 187, 42, 0.1)' : 'var(--rf-bg-card)',
              borderRadius: 'var(--rf-radius-lg)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'var(--rf-leaf-green)'
                }}
              >
                <Building size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                Payout Channels & Banking
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                Link your bank accounts, mobile money wallets, or stablecoin addresses for instant earnings settlement.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-leaf-green)' }}>
              <span>{activeSection === 'PAYOUT' ? 'Active Section' : 'Manage Payout Methods'}</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* ================= DETAILED SECTIONS ================= */}

        {/* 1. PERSONAL INFORMATION SECTION */}
        {(activeSection === 'ALL' || activeSection === 'PERSONAL') && (
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <User size={20} color="var(--rf-leaf-green)" />
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Personal Information
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                  Manage your legal identity details, official email address, phone contact, and regional location.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePersonal}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={personalForm.first_name}
                    onChange={e => setPersonalForm({ ...personalForm, first_name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={personalForm.last_name}
                    onChange={e => setPersonalForm({ ...personalForm, last_name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    value={personalForm.email}
                    onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    Phone Contact *
                  </label>
                  <input
                    type="tel"
                    value={personalForm.phone}
                    onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    Primary Country *
                  </label>
                  <select
                    value={personalForm.country}
                    onChange={e => setPersonalForm({ ...personalForm, country: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: '#0D2316',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Ghana">🇬🇭 Ghana</option>
                    <option value="Kenya">🇰🇪 Kenya</option>
                    <option value="South Africa">🇿🇦 South Africa</option>
                    <option value="Rwanda">🇷🇼 Rwanda</option>
                    <option value="Egypt">🇪🇬 Egypt</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    City / State *
                  </label>
                  <input
                    type="text"
                    value={personalForm.city}
                    onChange={e => setPersonalForm({ ...personalForm, city: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rf-btn rf-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Personal Information'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. ACCOUNT SECURITY SECTION */}
        {(activeSection === 'ALL' || activeSection === 'SECURITY') && (
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Lock size={20} color="#38BDF8" />
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Account Security
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                  Protect your Refeir account with 2FA, sovereign session management, and password credentials.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {/* Password Change Form */}
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={16} color="var(--rf-leaf-green)" />
                  <span>Update Password</span>
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.35rem' }}>
                    Current Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.35rem' }}>
                    New Password (min 8 chars)
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.35rem' }}>
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--rf-navy-border)',
                      color: 'var(--rf-cream)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                  </button>
                  <button type="submit" className="rf-btn rf-btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8125rem' }}>
                    Update Password
                  </button>
                </div>
              </form>

              {/* 2FA & Active Sessions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Smartphone size={18} color="var(--rf-leaf-green)" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        Two-Factor Authentication (2FA)
                      </span>
                    </div>
                    <span className="rf-badge rf-badge-mint rf-text-xs">
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    Authenticates withdrawals and milestone approvals with a time-based TOTP code.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(twoFactorEnabled ? '2FA Disabled' : '2FA Enabled', 'Authenticator app integration updated.', 'INFO');
                    }}
                    className="rf-btn rf-btn-outline"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
                  >
                    {twoFactorEnabled ? 'Disable 2FA' : 'Enable Authenticator 2FA'}
                  </button>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Shield size={18} color="#38BDF8" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                      Active Trusted Sessions
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', marginBottom: '0.5rem' }}>
                    🟢 <strong>Current Session:</strong> Chrome on Windows • Lagos, Nigeria (IP 102.89.x.x)
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Sessions Terminated', 'All other active sessions have been signed out.', 'SUCCESS')}
                    className="rf-btn rf-btn-outline"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    Sign Out Other Devices
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. NOTIFICATIONS SECTION */}
        {(activeSection === 'ALL' || activeSection === 'NOTIFICATIONS') && (
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Bell size={20} color="#FBBF24" />
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Notifications
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                  Control your real-time email alerts, escrow milestone updates, and direct negotiation push notices.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                {
                  key: 'escrowAlerts',
                  title: 'Escrow Vault & Payment Notifications',
                  desc: 'Receive immediate email and notification alerts when an escrow deposit is funded, released, or disputed.'
                },
                {
                  key: 'messagePush',
                  title: 'Direct Negotiation & Message Alerts',
                  desc: 'Get notified when a client or scout messages you regarding project terms or rate agreements.'
                },
                {
                  key: 'scoutCommissionAlerts',
                  title: '10% Scout Referral Commission Updates',
                  desc: 'Receive confirmation receipts every time a referred talent earns from an escrow milestone release.'
                },
                {
                  key: 'securityEmails',
                  title: 'Sovereign Security & Sign-in Alerts',
                  desc: 'Real-time notifications for password changes, new device logins, or biometric status modifications.'
                },
                {
                  key: 'weeklyDigest',
                  title: 'Weekly Pan-African Marketplace Digest',
                  desc: 'Curated weekly overview of top-budget client listings, hackathons, and regional chapter events.'
                }
              ].map(item => {
                const isChecked = (notifPrefs as any)[item.key];
                return (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--rf-radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.2rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
                        {item.desc}
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setNotifPrefs(prev => ({ ...prev, [item.key]: !isChecked }))}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: isChecked ? 'var(--rf-leaf-green)' : 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '24px',
                          transition: '0.2s ease'
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            height: '18px',
                            width: '18px',
                            left: isChecked ? '22px' : '3px',
                            bottom: '3px',
                            backgroundColor: '#07160D',
                            borderRadius: '50%',
                            transition: '0.2s ease'
                          }}
                        />
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSaveNotifications}
                className="rf-btn rf-btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Save Notification Preferences
              </button>
            </div>
          </div>
        )}

        {/* 4. IDENTITY VERIFICATION SECTION */}
        {(activeSection === 'ALL' || activeSection === 'VERIFICATION') && (
          <div className="rf-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.08) 0%, rgba(7, 23, 14, 0.95) 100%)', border: '1.5px solid rgba(102, 187, 42, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={24} color="var(--rf-leaf-green)" />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    Identity Verification
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                    Review your Tier 2 Sovereign Biometric verification status, verified credentials, and audit logs.
                  </p>
                </div>
              </div>
              <span className="rf-badge rf-badge-mint" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem' }}>
                <CheckCircle2 size={14} />
                <span>Tier 2 Sovereign Verified</span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>
                  OCR Document Verification
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  National ID / Passport
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', marginTop: '0.2rem' }}>
                  ✓ Match 100% (Name & Date of Birth)
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Facial Liveness Audit
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  3D Sovereign Mesh
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', marginTop: '0.2rem' }}>
                  ✓ Passed Anti-Spoofing
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Trust Badge
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Pan-African Trust Rail
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', marginTop: '0.2rem' }}>
                  ✓ Certified for Escrow Vaults
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                Need to update your legal identity documents or upgrade to Enterprise Sovereign Tier 3?
              </div>
              <button
                onClick={() => onNavigate('/verification')}
                className="rf-btn rf-btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderColor: 'var(--rf-leaf-green)', color: 'var(--rf-leaf-green)' }}
              >
                <span>Launch Verification Portal</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* 5. TAX COMPLIANCE & STATEMENT OF ACCOUNT SECTION */}
        {(activeSection === 'ALL' || activeSection === 'TAX') && (
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Percent size={20} color="#F4B942" />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    Tax Identification & Cross-Border Compliance
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                    Nigeria Headquarters (FIRS TIN: 24891023-0001) and Pan-African statutory reporting.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowStatementModal(true)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.4rem' }}
              >
                <FileText size={15} />
                <span>Download Statement of Account</span>
              </button>
            </div>

            {/* Nigeria Headquarters Callout */}
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
                  CAC RC Number: <strong>RC-1892044</strong> • FIRS Tax ID: <strong>24891023-0001</strong>. All Nigerian platform fees are subject to 7.5% statutory VAT. Withholding Tax (WHT 5%) is tracked on contractor milestone releases.
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveTax} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.35rem', fontWeight: 700 }}>
                    Country of Permanent Tax Residency *
                  </label>
                  <select
                    className="rf-select"
                    value={taxForm.tax_country}
                    onChange={e => {
                      const newCountry = e.target.value;
                      let idType: TaxIdType = 'INTERNATIONAL_TAX_ID';
                      if (newCountry === 'Nigeria') idType = 'NIGERIA_TIN';
                      else if (newCountry === 'Kenya') idType = 'KENYA_KRA_PIN';
                      else if (newCountry === 'Ghana') idType = 'GHANA_CARD_TIN';
                      else if (newCountry === 'South Africa') idType = 'SA_SARS_PIN';
                      else if (newCountry === 'United States') idType = 'US_W8BEN_EIN_SSN';
                      else if (newCountry === 'United Kingdom') idType = 'UK_UTR_NIN';

                      setTaxForm({
                        ...taxForm,
                        tax_country: newCountry,
                        tax_id_type: idType
                      });
                    }}
                    style={{ width: '100%' }}
                  >
                    {Object.keys(TAX_JURISDICTIONS).map(c => (
                      <option key={c} value={c}>
                        {c} {c === 'Nigeria' ? '★ (Platform Headquarters - FIRS)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.35rem', fontWeight: 700 }}>
                    {getTaxJurisdiction(taxForm.tax_country).primary_tax_id_name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={taxForm.tax_id_number}
                    onChange={e => setTaxForm({ ...taxForm, tax_id_number: e.target.value })}
                    placeholder={getTaxJurisdiction(taxForm.tax_country).tax_id_placeholder}
                    className="rf-input"
                    style={{ width: '100%', fontFamily: 'var(--rf-font-mono)' }}
                  />
                </div>
              </div>

              {taxForm.tax_country === 'Nigeria' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.35rem', fontWeight: 700 }}>
                    CAC RC Registration Number (if Registered Business / Entity)
                  </label>
                  <input
                    type="text"
                    value={taxForm.registered_company_rc}
                    onChange={e => setTaxForm({ ...taxForm, registered_company_rc: e.target.value })}
                    placeholder="e.g. RC-1892044"
                    className="rf-input"
                    style={{ width: '100%', fontFamily: 'var(--rf-font-mono)' }}
                  />
                </div>
              )}

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                      VAT Registration with {getTaxJurisdiction(taxForm.tax_country).tax_authority.split('(')[0].trim()}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                      Statutory tax rate: {getTaxJurisdiction(taxForm.tax_country).vat_rate_percent}%
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={taxForm.vat_registered}
                    onChange={e => setTaxForm({ ...taxForm, vat_registered: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--rf-mint)' }}
                  />
                </div>

                {taxForm.vat_registered && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rf-navy-border)' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.3rem' }}>
                      VAT Identification Number
                    </label>
                    <input
                      type="text"
                      value={taxForm.vat_id_number}
                      onChange={e => setTaxForm({ ...taxForm, vat_id_number: e.target.value })}
                      placeholder="e.g. NG-VAT-1892044"
                      className="rf-input"
                      style={{ width: '100%', fontFamily: 'var(--rf-font-mono)' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rf-btn rf-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, padding: '0.75rem 1.75rem' }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Tax Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. PAYOUT & BANKING CHANNELS SECTION */}
        {(activeSection === 'ALL' || activeSection === 'PAYOUT') && (
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Building size={20} color="var(--rf-leaf-green)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                    Preferred Payout Channels & Bank Details
                  </h3>
                  <span className="rf-badge rf-badge-mint rf-text-xs">
                    {wallet.payout_methods.length} Active
                  </span>
                </div>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Manage bank accounts, mobile money wallets, and crypto addresses for automated milestone payouts and referral split earnings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPayoutModal(true)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.45rem', padding: '0.55rem 1.15rem' }}
              >
                <Plus size={15} />
                <span>Link Payout Channel</span>
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
                      background: 'var(--rf-navy-surface)',
                      border: `1.5px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.5)' : 'var(--rf-navy-border)'}`,
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
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--rf-cream)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
      </div>

      {/* Statement of Account Modal */}
      {showStatementModal && (
        <StatementOfAccountModal
          user={currentUser}
          onClose={() => setShowStatementModal(false)}
          onOpenTaxSettings={() => {
            setShowStatementModal(false);
            setActiveSection('TAX');
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
