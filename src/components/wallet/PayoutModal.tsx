import React, { useState } from 'react';
import { Money, PayoutMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { formatMoney } from '../../data/currencies';
import { AddPayoutMethodModal } from './AddPayoutMethodModal';
import { TaxComplianceModal } from './TaxComplianceModal';
import { 
  evaluateWithdrawalCompliance, 
  evaluatePaymentTransferEligibility, 
  isPayoutChannelValid,
  isPayoutChannelCompatible 
} from '../../services/complianceEngine';
import {
  X,
  Building,
  Smartphone,
  Coins,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Plus,
  AlertTriangle,
  FileText,
  UserCheck,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PayoutModalProps {
  userId: string;
  currency: string;
  availableMinor: number;
  payoutMethods: PayoutMethod[];
  onClose: () => void;
  onSuccess: () => void;
  onNavigate?: (path: string) => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  userId,
  currency,
  availableMinor,
  payoutMethods,
  onClose,
  onSuccess,
  onNavigate
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { requestPayout, getUserWallet } = useMarketplace();
  const { showToast } = useNotification();

  const userWallet = getUserWallet(userId);
  const currentMethods = userWallet?.payout_methods?.length ? userWallet.payout_methods : payoutMethods;

  const defaultMethod = currentMethods.find(m => m.is_default) || currentMethods[0];

  const [withdrawMajor, setWithdrawMajor] = useState<number>(availableMinor / 100);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    defaultMethod ? defaultMethod.id : 'none'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);

  const selectedMethod = currentMethods.find(m => m.id === selectedMethodId) || defaultMethod || null;

  // Strict Payment Transfer Eligibility Algorithm:
  // 1. Identity / KYC Verification
  // 2. Tax Information & TIN
  // 3. Verified & Currency-Compatible Payment Channel
  const transferEligibility = evaluatePaymentTransferEligibility(
    currentUser,
    userWallet,
    currency,
    selectedMethod
  );

  const maxMajor = availableMinor / 100;

  const handleWithdraw = async () => {
    // Strict Rule Enforcement:
    if (!transferEligibility.canTransfer) {
      showToast(
        'Transfer Blocked: Requirements Missing',
        transferEligibility.reasons.join(' '),
        'WARNING'
      );
      if (!transferEligibility.hasLinkedChannel || !transferEligibility.isChannelCompatible) {
        setShowAddPayoutModal(true);
      } else if (!transferEligibility.isTaxCompliant) {
        setShowTaxModal(true);
      } else if (!transferEligibility.isVerified) {
        handleGoToVerification();
      }
      return;
    }

    if (withdrawMajor <= 0 || withdrawMajor > maxMajor) {
      showToast('Invalid Amount', 'Please enter an amount within your available balance.', 'WARNING');
      return;
    }

    if (!selectedMethod) {
      showToast('Link Payout Channel', `Please link a verified ${currency} payout channel or bank account first.`, 'WARNING');
      setShowAddPayoutModal(true);
      return;
    }

    setIsProcessing(true);
    const amountMoney: Money = {
      amount_minor: Math.round(withdrawMajor * 100),
      currency
    };

    setTimeout(async () => {
      const success = await requestPayout(userId, amountMoney, selectedMethod, currentUser);
      setIsProcessing(false);
      if (success) {
        setIsDone(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        showToast(
          'Payout Dispatched!',
          `${formatMoney(amountMoney)} has been transferred to your ${selectedMethod.institution_name} account.`,
          'SUCCESS'
        );
      } else {
        showToast(
          'Disbursement Failed',
          'Could not complete transfer rail dispatch. Please verify your payment channel, compliance status, and balance.',
          'ERROR'
        );
      }
    }, 1200);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'MOBILE_MONEY':
        return <Smartphone size={18} color="var(--rf-leaf-green)" />;
      case 'OTHER':
        return <Coins size={18} color="var(--rf-leaf-green)" />;
      default:
        return <Building size={18} color="var(--rf-leaf-green)" />;
    }
  };

  const handleGoToVerification = () => {
    onClose();
    if (onNavigate) {
      onNavigate('/verification');
    } else {
      window.location.href = '/verification';
    }
  };

  return (
    <>
      <div className="rf-modal-backdrop" onClick={onClose}>
        <div
          className="rf-modal-content"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '560px', padding: '2rem', maxHeight: '92vh', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Withdraw Payout ({currency})
                </h3>
                {transferEligibility.canTransfer ? (
                  <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={11} />
                    <span>Cleared for Transfer</span>
                  </span>
                ) : (
                  <span className="rf-badge rf-badge-danger rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldAlert size={11} />
                    <span>Requirements Incomplete</span>
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                Dispatched instantly via Mobile Money, Bank Transfer, or Crypto Rails.
              </p>
            </div>
            <button onClick={onClose} className="rf-btn-ghost rf-btn-icon" aria-label="Close modal">
              <X size={20} color="var(--rf-slate-400)" />
            </button>
          </div>

          {!isDone ? (
            <div>
              {/* =========================================================================
                 STRICT 3-PILLAR PAYMENT TRANSFER COMPLIANCE & CHANNEL GATE
                 ========================================================================= */}
              {!transferEligibility.canTransfer ? (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1.5px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <AlertTriangle size={18} color="#EF4444" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                      Payment Transfer Locked: Complete Requirements
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                    Pan-African financial regulations require government ID verification, a registered tax identification profile, and a verified currency-compatible payment channel before transfer disbursements can execute.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Item 1: Identity & KYC Verification */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(18, 43, 26, 0.04)',
                        border: `1px solid ${transferEligibility.isVerified ? 'rgba(102, 187, 42, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: 'var(--rf-radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {transferEligibility.isVerified ? (
                          <CheckCircle2 size={16} color="var(--rf-leaf-green)" />
                        ) : (
                          <UserCheck size={16} color="#F87171" />
                        )}
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                            1. Government Identity Verification (KYC)
                          </div>
                          <div style={{ fontSize: '0.72rem', color: transferEligibility.isVerified ? 'var(--rf-leaf-green)' : '#DC2626' }}>
                            {transferEligibility.isVerified ? 'Cleared & Verified' : 'Unverified • ID & Face Scan required'}
                          </div>
                        </div>
                      </div>

                      {!transferEligibility.isVerified && (
                        <button
                          type="button"
                          onClick={handleGoToVerification}
                          className="rf-btn rf-btn-orange rf-btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}
                        >
                          <span>Verify Now</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>

                    {/* Item 2: Tax Information & TIN */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(18, 43, 26, 0.04)',
                        border: `1px solid ${transferEligibility.isTaxCompliant ? 'rgba(102, 187, 42, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: 'var(--rf-radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {transferEligibility.isTaxCompliant ? (
                          <CheckCircle2 size={16} color="var(--rf-leaf-green)" />
                        ) : (
                          <FileText size={16} color="#F87171" />
                        )}
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                            2. Tax Identification (TIN) & Jurisdiction
                          </div>
                          <div style={{ fontSize: '0.72rem', color: transferEligibility.isTaxCompliant ? 'var(--rf-leaf-green)' : '#DC2626' }}>
                            {transferEligibility.isTaxCompliant ? `Active (${currentUser?.tax_id_number})` : 'Missing Tax ID / Jurisdiction'}
                          </div>
                        </div>
                      </div>

                      {!transferEligibility.isTaxCompliant && (
                        <button
                          type="button"
                          onClick={() => setShowTaxModal(true)}
                          className="rf-btn rf-btn-mint rf-btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}
                        >
                          <span>Fill Tax Info</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>

                    {/* Item 3: Linked & Compatible Payment Channel */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(18, 43, 26, 0.04)',
                        border: `1px solid ${transferEligibility.hasLinkedChannel && transferEligibility.isChannelCompatible ? 'rgba(102, 187, 42, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: 'var(--rf-radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {transferEligibility.hasLinkedChannel && transferEligibility.isChannelCompatible ? (
                          <CheckCircle2 size={16} color="var(--rf-leaf-green)" />
                        ) : (
                          <CreditCard size={16} color="#F87171" />
                        )}
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                            3. Linked Payment Channel for {currency}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: transferEligibility.hasLinkedChannel && transferEligibility.isChannelCompatible ? 'var(--rf-leaf-green)' : '#DC2626' }}>
                            {!transferEligibility.hasLinkedChannel
                              ? 'No verified payout channel linked'
                              : !transferEligibility.isChannelCompatible
                              ? `Incompatible channel (${selectedMethod?.institution_name})`
                              : `Linked: ${selectedMethod?.institution_name} (${selectedMethod?.masked_identifier})`}
                          </div>
                        </div>
                      </div>

                      {(!transferEligibility.hasLinkedChannel || !transferEligibility.isChannelCompatible) && (
                        <button
                          type="button"
                          onClick={() => setShowAddPayoutModal(true)}
                          className="rf-btn rf-btn-mint rf-btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}
                        >
                          <span>{!transferEligibility.hasLinkedChannel ? 'Link Channel' : `Link ${currency} Channel`}</span>
                          <Plus size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Compliant Verified Banner */
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(102, 187, 42, 0.1)',
                    border: '1px solid rgba(102, 187, 42, 0.3)',
                    borderRadius: 'var(--rf-radius-md)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="var(--rf-leaf-green)" />
                    <div style={{ fontSize: '0.78rem', color: 'var(--rf-cream)' }}>
                      <strong>Ready for Transfer:</strong> ID Verified • Tax TIN Active • Channel Linked ({selectedMethod?.institution_name}).
                    </div>
                  </div>
                  <span className="rf-badge rf-badge-mint rf-text-xs">
                    100% Cleared
                  </span>
                </div>
              )}

              {/* Balance Card */}
              <div
                style={{
                  background: 'var(--rf-navy-surface)',
                  border: '1px solid var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>
                    Available Balance
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
                    {formatMoney({ amount_minor: availableMinor, currency })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawMajor(maxMajor)}
                  className="rf-btn rf-btn-secondary rf-btn-sm"
                  disabled={!transferEligibility.canTransfer}
                >
                  Max Amount
                </button>
              </div>

              {/* Input Amount */}
              <div className="rf-form-group">
                <label className="rf-label" htmlFor="withdraw-amount">
                  <span style={{ color: 'var(--rf-cream)' }}>Amount to Withdraw ({currency})</span>
                </label>
                <input
                  id="withdraw-amount"
                  type="number"
                  min={1}
                  max={maxMajor}
                  disabled={!transferEligibility.canTransfer}
                  className="rf-input"
                  value={withdrawMajor}
                  onChange={e => setWithdrawMajor(parseFloat(e.target.value) || 0)}
                  style={{ color: 'var(--rf-cream)', fontWeight: 700, opacity: transferEligibility.canTransfer ? 1 : 0.6 }}
                />
              </div>

              {/* Destination Method Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', margin: 0 }}>
                    Destination Payout Account
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddPayoutModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--rf-leaf-green)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Plus size={13} />
                    <span>Link New Channel</span>
                  </button>
                </div>

                {currentMethods.length > 0 && selectedMethod && isPayoutChannelValid(selectedMethod) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {currentMethods.length > 1 && (
                      <select
                        value={selectedMethodId}
                        onChange={e => setSelectedMethodId(e.target.value)}
                        className="rf-select"
                        style={{
                          width: '100%',
                          marginBottom: '0.25rem'
                        }}
                      >
                        {currentMethods.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.institution_name} ({m.masked_identifier}) — {m.account_holder_name} [{m.currency || 'MULTI'}] {m.is_default ? '★ Default' : ''}
                          </option>
                        ))}
                      </select>
                    )}

                    <div
                      style={{
                        background: 'var(--rf-navy-surface)',
                        border: `1px solid ${transferEligibility.isChannelCompatible ? 'var(--rf-navy-border)' : 'rgba(239, 68, 68, 0.5)'}`,
                        borderRadius: 'var(--rf-radius-md)',
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'rgba(102, 187, 42, 0.15)',
                          border: '1px solid rgba(102, 187, 42, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {getMethodIcon(selectedMethod.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                          {selectedMethod.institution_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', fontFamily: 'var(--rf-font-mono)' }}>
                          {selectedMethod.masked_identifier} • {selectedMethod.account_holder_name}
                        </div>
                        {!transferEligibility.isChannelCompatible && (
                          <div style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.2rem' }}>
                            ⚠️ This channel currency ({selectedMethod.currency}) cannot receive {currency}. Please switch or link a {currency} account.
                          </div>
                        )}
                      </div>
                      {selectedMethod.is_default && (
                        <span className="rf-badge rf-badge-mint rf-text-xs">
                          Primary Rail
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '1.25rem 1rem',
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px dashed rgba(239, 68, 68, 0.4)',
                      borderRadius: 'var(--rf-radius-md)',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '0.75rem' }}>
                      No payout destination linked yet. You must link your verified bank account or mobile money to withdraw {currency}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddPayoutModal(true)}
                      className="rf-btn rf-btn-mint rf-btn-sm"
                      style={{ fontWeight: 800 }}
                    >
                      <Plus size={14} />
                      <span>Link {currency} Payout Channel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Withdrawal Button */}
              <button
                onClick={handleWithdraw}
                disabled={isProcessing || withdrawMajor <= 0 || !transferEligibility.canTransfer}
                className={`rf-btn ${transferEligibility.canTransfer ? 'rf-btn-mint' : 'rf-btn-secondary'} rf-w-full rf-btn-lg`}
                style={{
                  gap: '0.5rem',
                  opacity: isProcessing || !transferEligibility.canTransfer ? 0.65 : 1,
                  cursor: !transferEligibility.canTransfer ? 'not-allowed' : 'pointer'
                }}
              >
                <Lock size={18} />
                <span>
                  {!transferEligibility.isVerified
                    ? 'KYC Verification Required to Transfer'
                    : !transferEligibility.isTaxCompliant
                    ? 'Tax Information (TIN) Required to Transfer'
                    : !transferEligibility.hasLinkedChannel
                    ? 'Link a Payout Channel to Transfer'
                    : !transferEligibility.isChannelCompatible
                    ? `Link a Compatible ${currency} Channel to Transfer`
                    : isProcessing
                    ? 'Processing Transfer Rail...'
                    : `Withdraw ${formatMoney({ amount_minor: Math.round(withdrawMajor * 100), currency })}`}
                </span>
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(54, 224, 160, 0.15)',
                  color: 'var(--rf-mint)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Payout Transfer Completed
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {formatMoney({ amount_minor: Math.round(withdrawMajor * 100), currency })} has been sent to {selectedMethod?.institution_name || 'Destination'} ({selectedMethod?.masked_identifier || ''}).
              </p>

              <button
                onClick={() => {
                  onClose();
                  onSuccess();
                }}
                className="rf-btn rf-btn-primary"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Add Payout Channel Modal */}
      <AddPayoutMethodModal
        userId={userId}
        isOpen={showAddPayoutModal}
        onClose={() => setShowAddPayoutModal(false)}
        onAdded={(method) => {
          setSelectedMethodId(method.id);
        }}
      />

      {/* Embedded Tax Compliance Modal for Instant In-Flow Resolution */}
      {showTaxModal && (
        <TaxComplianceModal
          user={currentUser}
          onClose={() => setShowTaxModal(false)}
          onSaveTaxProfile={(updatedData) => {
            updateProfile(updatedData);
            setShowTaxModal(false);
          }}
        />
      )}
    </>
  );
};
