import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { CurrencyBalanceCard } from '../components/wallet/CurrencyBalanceCard';
import { PayoutModal } from '../components/wallet/PayoutModal';
import { AddPayoutMethodModal } from '../components/wallet/AddPayoutMethodModal';
import { StatementOfAccountModal } from '../components/wallet/StatementOfAccountModal';
import { TaxComplianceModal } from '../components/wallet/TaxComplianceModal';
import { evaluateWithdrawalCompliance } from '../services/complianceEngine';
import { formatMoney } from '../data/currencies';
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Building,
  Smartphone,
  Coins,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  FileText,
  Clock,
  Lock,
  Sparkles,
  Ticket,
  Percent,
  Download,
  Plus,
  Trash2,
  Star
} from 'lucide-react';

interface WalletPageProps {
  onNavigate: (path: string) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ onNavigate }) => {
  const { currentUser, updateProfile } = useAuth();
  const { 
    getUserWallet, 
    transactions, 
    ledgerEntries, 
    getActiveAirfeeToken,
    setDefaultPayoutMethod,
    deletePayoutMethod 
  } = useMarketplace();

  const [activeCurrencyWithdraw, setActiveCurrencyWithdraw] = useState<string | null>(null);
  const [activeAvailableMinor, setActiveAvailableMinor] = useState<number>(0);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const wallet = getUserWallet(userId);
  const activeAirfeeToken = getActiveAirfeeToken(userId);
  const totalTokensCount = currentUser?.airfee_tokens_balance || (currentUser?.is_pro ? 5 : 2);
  const userCountry = currentUser?.tax_country || currentUser?.country || 'Nigeria';
  const taxIdDisplay = currentUser?.tax_id_number || (userCountry === 'Nigeria' ? '23891024-0001' : 'A019283746Z');

  // Strict Withdrawal Compliance Check
  const compliance = evaluateWithdrawalCompliance(currentUser);

  const balancesList = Object.values(wallet.balances);
  const myTransactions = transactions; // all transactions with audit ledger

  const handleOpenWithdraw = (currency: string, availableMinor: number) => {
    setActiveCurrencyWithdraw(currency);
    setActiveAvailableMinor(availableMinor);
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Wallet size={14} />
            <span>PAN-AFRICAN MULTI-CURRENCY VAULT</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            Multi-Currency Wallet & Ledger
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Balances are preserved in native settlement currencies • FIRS & Cross-Border Tax Compliant.
          </p>
        </div>

        {/* Action Buttons: Statement of Account & Tax Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowTaxModal(true)}
            className="rf-btn rf-btn-secondary rf-btn-sm"
            style={{ fontWeight: 700, gap: '0.45rem', border: '1px solid var(--rf-navy-border)', height: '38px', padding: '0 1rem', display: 'inline-flex', alignItems: 'center' }}
            title="Configure Tax ID & Jurisdiction"
          >
            <Percent size={14} color="#F4B942" />
            <span>Tax Profile ({userCountry})</span>
          </button>

          <button
            onClick={() => setShowStatementModal(true)}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ fontWeight: 800, gap: '0.45rem', height: '38px', padding: '0 1rem', display: 'inline-flex', alignItems: 'center' }}
            title="Generate & Download Audited Statement of Account"
          >
            <FileText size={15} />
            <span>Download Statement of Account</span>
          </button>
        </div>
      </div>

      {/* WITHDRAWAL COMPLIANCE & REGULATORY STATUS BANNER */}
      {!compliance.canWithdraw || wallet.payout_methods.length === 0 ? (
        <div
          className="rf-card"
          style={{
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--rf-radius-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Payment Transfer Rails Locked — Requirements Incomplete
                </span>
                <span className="rf-badge rf-badge-danger rf-text-xs">
                  {wallet.payout_methods.length === 0 ? 'No Payout Channel Linked' : `Compliance: ${compliance.complianceScore}%`}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', margin: '0.25rem 0 0 0' }}>
                Before disbursements can execute, statutory financial regulations require you to be <strong>ID-verified</strong>, have a valid <strong>Tax ID (TIN)</strong>, and link a <strong>verified payment channel</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!compliance.isVerified && (
              <button
                onClick={() => onNavigate('/verification')}
                className="rf-btn rf-btn-orange rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.4rem' }}
              >
                <UserCheck size={14} />
                <span>Verify Identity (KYC)</span>
              </button>
            )}
            {!compliance.isTaxCompliant && (
              <button
                onClick={() => setShowTaxModal(true)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.4rem' }}
              >
                <FileText size={14} />
                <span>Fill Tax Details</span>
              </button>
            )}
            {wallet.payout_methods.length === 0 && (
              <button
                onClick={() => setShowAddPayoutModal(true)}
                className="rf-btn rf-btn-primary rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.4rem' }}
              >
                <Plus size={14} />
                <span>Link Payout Channel</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="rf-card"
          style={{
            padding: '0.85rem 1.5rem',
            marginBottom: '2rem',
            background: 'rgba(102, 187, 42, 0.08)',
            border: '1px solid rgba(102, 187, 42, 0.3)',
            borderRadius: 'var(--rf-radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={18} color="var(--rf-leaf-green)" />
            <span style={{ fontSize: '0.84rem', color: 'var(--rf-cream)' }}>
              <strong>Payment Transfer Rails Active:</strong> Identity KYC Cleared • Tax TIN ({compliance.taxIdNumber}) • {wallet.payout_methods.length} Payout {wallet.payout_methods.length === 1 ? 'Channel' : 'Channels'} Connected.
            </span>
          </div>
          <span className="rf-badge rf-badge-mint rf-text-xs">
            100% Transfer Cleared
          </span>
        </div>
      )}

      {/* ROLE-SPECIFIC BENEFIT & PROTECTION BANNER (Fixed Dark Gradient Overlays with High-Contrast White Text) */}
      {currentUser?.active_role === 'SCOUT' ? (
        /* Scout: Airfee Token Status & Fee Protection Bar */
        <div
          className="rf-card"
          style={{
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(10, 35, 25, 0.95) 0%, rgba(7, 22, 13, 0.95) 100%)',
            border: '1.5px solid rgba(54, 224, 160, 0.35)',
            borderRadius: 'var(--rf-radius-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(54, 224, 160, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ADE80' }}>
              <Ticket size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Airfee Token Vault: {totalTokensCount} Available
                </span>
                <span className="rf-badge rf-badge-mint rf-text-xs" style={{ background: 'rgba(54, 224, 160, 0.2)', color: '#4ADE80', border: '1px solid rgba(54, 224, 160, 0.4)' }}>
                  Level 3 Shield (0% Fee Active)
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.25rem 0 0 0' }}>
                Active Token: <code style={{ color: '#4ADE80', fontWeight: 700 }}>{activeAirfeeToken ? activeAirfeeToken.code : 'RF-AIRTOKEN-2026-08'}</code> • 100% of platform fees waived for August 2026
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 700 }}>
                Airfee Saved To Date
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80' }}>
                ₦180,000
              </div>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/scout')}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ gap: '0.35rem', fontWeight: 800 }}
            >
              <span>Scout Hub</span>
            </button>
          </div>
        </div>
      ) : currentUser?.active_role === 'CLIENT' ? (
        /* Client: Trust Vault Custody & 0% Platform Fee Guarantee */
        <div
          className="rf-card"
          style={{
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(15, 35, 60, 0.95) 0%, rgba(7, 22, 40, 0.95) 100%)',
            border: '1.5px solid rgba(125, 162, 255, 0.35)',
            borderRadius: 'var(--rf-radius-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(125, 162, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DA2FF' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Protected Client Trust Vault
                </span>
                <span className="rf-badge rf-badge-blue rf-text-xs" style={{ background: 'rgba(125, 162, 255, 0.2)', color: '#93C5FD', border: '1px solid rgba(125, 162, 255, 0.4)' }}>
                  0% Escrow Fee • 100% Custody
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.25rem 0 0 0' }}>
                Your project milestone funds are held in regulated custody rails and released only upon your explicit approval.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => onNavigate('/dashboard/client')}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ gap: '0.35rem', fontWeight: 800 }}
            >
              <span>Client Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        /* Talent: Guaranteed Milestone Earnings & Bank Settlement */
        <div
          className="rf-card"
          style={{
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(10, 35, 25, 0.95) 0%, rgba(7, 22, 13, 0.95) 100%)',
            border: '1.5px solid rgba(54, 224, 160, 0.35)',
            borderRadius: 'var(--rf-radius-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(54, 224, 160, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ADE80' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Talent Protected Net Earnings
                </span>
                <span className="rf-badge rf-badge-mint rf-text-xs" style={{ background: 'rgba(54, 224, 160, 0.2)', color: '#4ADE80', border: '1px solid rgba(54, 224, 160, 0.4)' }}>
                  Direct Local Payouts Active
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.25rem 0 0 0' }}>
                Deliverables trigger instant escrow releases into your multi-currency wallet with zero hidden deductions.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => onNavigate('/dashboard/talent')}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ gap: '0.35rem', fontWeight: 800 }}
            >
              <span>Talent Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Multi-Currency Balances Cards (Section 36 & 37) */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
          Your Separate Currency Balances
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {balancesList.map(b => (
            <CurrencyBalanceCard
              key={b.currency}
              balance={b}
              onWithdraw={handleOpenWithdraw}
            />
          ))}
        </div>
      </div>

      {/* Linked Payout Methods (Section 38 & 39) */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Linked Payout & Banking Channels
              </h3>
              <span className="rf-badge rf-badge-mint rf-text-xs">
                {wallet.payout_methods.length} Active
              </span>
            </div>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Direct settlement channels for escrow milestone disbursements and scout referral split earnings.
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
              <span>Add Your First Bank / MoMo Account</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {wallet.payout_methods.map(pm => (
              <div
                key={pm.id}
                className="rf-payout-channel-card"
                style={{
                  background: 'var(--rf-navy-surface)',
                  border: `1.5px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.5)' : 'var(--rf-navy-border)'}`,
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  cursor: 'pointer'
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
                          <span>Primary</span>
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

                {/* Bottom Channel Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--rf-navy-border)', paddingTop: '0.75rem' }}>
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

      {/* Immutable Financial Ledger Audit Table (Section 80) */}
      <div className="rf-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Double-Entry Financial Ledger
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem' }}>
              Immutable transaction events, Trust Vault holds, and verified commission releases.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                <th style={{ padding: '0.75rem 1rem' }}>Reference</th>
                <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Payment Rail</th>
                <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {myTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--rf-navy-border)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'var(--rf-font-mono)', fontWeight: 700, color: 'var(--rf-mint)' }}>
                    {tx.reference_code}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--rf-cream)' }}>
                    {tx.type.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--rf-slate-300)' }}>
                    {tx.payment_provider}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    {formatMoney(tx.amount)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="rf-badge rf-badge-mint rf-text-xs">
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--rf-slate-400)', fontSize: '0.8125rem' }}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {activeCurrencyWithdraw && (
        <PayoutModal
          userId={userId}
          currency={activeCurrencyWithdraw}
          availableMinor={activeAvailableMinor}
          payoutMethods={wallet.payout_methods}
          onClose={() => setActiveCurrencyWithdraw(null)}
          onSuccess={() => setActiveCurrencyWithdraw(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* Statement of Account Modal */}
      {showStatementModal && (
        <StatementOfAccountModal
          user={currentUser}
          onClose={() => setShowStatementModal(false)}
          onOpenTaxSettings={() => {
            setShowStatementModal(false);
            setShowTaxModal(true);
          }}
        />
      )}

      {/* Tax Compliance Modal */}
      {showTaxModal && (
        <TaxComplianceModal
          user={currentUser}
          onClose={() => setShowTaxModal(false)}
          onSaveTaxProfile={updatedData => updateProfile(updatedData)}
        />
      )}

      {/* Add Payout Channel & Bank Details Modal */}
      <AddPayoutMethodModal
        userId={userId}
        isOpen={showAddPayoutModal}
        onClose={() => setShowAddPayoutModal(false)}
      />
    </div>
  );
};
