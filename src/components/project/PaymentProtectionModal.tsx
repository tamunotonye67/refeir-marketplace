import React, { useState } from 'react';
import { Project, Money } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { formatMoney, convertCurrency, SUPPORTED_CURRENCIES } from '../../data/currencies';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Globe2,
  Zap,
  Coins,
  QrCode,
  Copy,
  Info,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentProtectionModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export type PaymentMethodCategory = 'GLOBAL_CARD' | 'INTERNATIONAL_WIRE' | 'CRYPTO_STABLECOIN' | 'AFRICAN_RAILS';

export const PaymentProtectionModal: React.FC<PaymentProtectionModalProps> = ({
  project,
  onClose,
  onSuccess
}) => {
  const { fundProject } = useMarketplace();
  const { showToast } = useNotification();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCategory>('GLOBAL_CARD');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(project.client_total_amount.currency || 'USD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardCountry, setCardCountry] = useState('United States');

  // Crypto network selection
  const [cryptoNetwork, setCryptoNetwork] = useState<'POLYGON' | 'ETHEREUM' | 'SOLANA'>('POLYGON');

  // Currency Conversion Calculation
  const convertedTotal = convertCurrency(project.client_total_amount, selectedCurrency);
  const convertedBase = convertCurrency(project.project_amount, selectedCurrency);
  const convertedFee = convertCurrency(project.platform_fee_amount, selectedCurrency);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldKey);
    showToast('Copied to Clipboard', `${text} copied.`, 'INFO');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const success = await fundProject(project.id);
      setIsProcessing(false);
      if (success) {
        setIsCompleted(true);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast(
          'Project Payment Protected & Funded!',
          `${convertedTotal.converted.formatted} is locked in sovereign escrow custody until milestone sign-off.`,
          'SUCCESS'
        );
      }
    }, 1400);
  };

  return (
    <div className="rf-modal-backdrop" onClick={onClose}>
      <div
        className="rf-modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(102, 187, 42, 0.15)',
                border: '1px solid rgba(102, 187, 42, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rf-leaf-green)'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--rf-cream)', margin: 0 }}>
                Refeir Sovereign Escrow Gateway
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: '2px 0 0' }}>
                Multi-currency escrow for global foreign clients & African enterprises.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rf-btn-ghost rf-btn-icon" aria-label="Close modal" style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
            <X size={20} color="var(--rf-slate-400)" />
          </button>
        </div>

        {!isCompleted ? (
          <div>
            {/* Currency Selector for Global Foreign Clients */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--rf-radius-md)',
                border: '1px solid var(--rf-navy-border)',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe2 size={16} color="var(--rf-leaf-green)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                  Pay in Client Billing Currency:
                </span>
              </div>
              <select
                value={selectedCurrency}
                onChange={e => setSelectedCurrency(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--rf-radius-sm)',
                  background: '#07160D',
                  border: '1px solid var(--rf-leaf-green)',
                  color: 'var(--rf-leaf-green)',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                <optgroup label="International Client Currencies">
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="CAD">CAD (CA$) — Canadian Dollar</option>
                  <option value="AUD">AUD (A$) — Australian Dollar</option>
                  <option value="AED">AED (AED) — UAE Dirham</option>
                  <option value="SGD">SGD (S$) — Singapore Dollar</option>
                </optgroup>
                <optgroup label="Pan-African Settlement Rails">
                  <option value="NGN">NGN (₦) — Nigerian Naira</option>
                  <option value="KES">KES (KSh) — Kenyan Shilling</option>
                  <option value="GHS">GHS (GH₵) — Ghanaian Cedi</option>
                  <option value="ZAR">ZAR (R) — South African Rand</option>
                  <option value="EGP">EGP (E£) — Egyptian Pound</option>
                  <option value="RWF">RWF (FRw) — Rwandan Franc</option>
                </optgroup>
              </select>
            </div>

            {/* Financial Ledger Itemized Breakdown */}
            <div
              style={{
                background: 'var(--rf-navy-surface)',
                border: '1px solid var(--rf-navy-border)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.875rem', color: 'var(--rf-slate-300)' }}>
                <span>Milestone Deliverable Base Value:</span>
                <span style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{convertedBase.converted.formatted}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.875rem', color: 'var(--rf-slate-300)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Escrow Custody & Arbitration Fee ({project.platform_fee_percent}%):
                </span>
                <span style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{convertedFee.converted.formatted}</span>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--rf-navy-border)',
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--rf-cream)', display: 'block' }}>
                    Total Locked in Escrow:
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>
                    Protected until you review and approve deliverable commits.
                  </span>
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--rf-leaf-green)' }}>
                  {convertedTotal.converted.formatted}
                </span>
              </div>
            </div>

            {/* 4 Multi-Channel Payment Rail Tabs */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)', display: 'block', marginBottom: '0.6rem' }}>
                Select Global or African Payment Rail
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {[
                  { id: 'GLOBAL_CARD', label: 'Global Cards', icon: CreditCard, subtitle: 'Visa / MC / Amex / Apple Pay' },
                  { id: 'INTERNATIONAL_WIRE', label: 'Bank Wire / ACH', icon: Building, subtitle: 'Fedwire / SEPA / BACS' },
                  { id: 'CRYPTO_STABLECOIN', label: 'USDC / USDT', icon: Coins, subtitle: 'Instant 0% Slippage' },
                  { id: 'AFRICAN_RAILS', label: 'African Rails', icon: Smartphone, subtitle: 'M-Pesa / MoMo / Direct' }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = paymentMethod === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id as PaymentMethodCategory)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--rf-radius-md)',
                        background: isActive ? 'rgba(102, 187, 42, 0.15)' : 'var(--rf-navy-surface)',
                        border: isActive ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
                        color: isActive ? 'var(--rf-cream)' : 'var(--rf-slate-300)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={18} color={isActive ? 'var(--rf-leaf-green)' : 'currentColor'} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>{tab.label}</span>
                      <span style={{ fontSize: '0.625rem', color: 'var(--rf-slate-400)', lineHeight: 1.1 }}>{tab.subtitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: Global Credit / Debit Cards (Stripe / Amex / Apple Pay) */}
            {paymentMethod === 'GLOBAL_CARD' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Global Card Details (3D Secure 2.0)</span>
                  <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                    <span>Visa</span> • <span>Mastercard</span> • <span>Amex</span> • <span>Apple Pay</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginBottom: '0.25rem' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
                    <input
                      type="text"
                      className="rf-input"
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginBottom: '0.25rem' }}>Expires (MM/YY)</label>
                    <input
                      type="text"
                      className="rf-input"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      style={{ fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginBottom: '0.25rem' }}>CVC / CVV</label>
                    <input
                      type="text"
                      className="rf-input"
                      placeholder="123"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      style={{ fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: International Wire / Fedwire / ACH / SEPA */}
            {paymentMethod === 'INTERNATIONAL_WIRE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800 }}>
                  <Building size={16} />
                  <span>Direct Corporate Wire & ACH Instructions</span>
                </div>

                <div style={{ background: '#07160D', padding: '0.75rem', borderRadius: 'var(--rf-radius-sm)', border: '1px solid rgba(102, 187, 42, 0.25)', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>Beneficiary:</span>
                    <span style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>Refeir Sovereign Escrow Trust, LLC</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>US Fedwire / ACH Routing:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>021000021</span>
                      <button onClick={() => handleCopy('021000021', 'wire_routing')} style={{ background: 'none', border: 'none', color: 'var(--rf-leaf-green)', cursor: 'pointer', padding: 0 }}>
                        {copiedField === 'wire_routing' ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>International IBAN / SWIFT:</span>
                    <span style={{ fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>CHASUS33 • GB42REFEIR8829</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 800 }}>Escrow Milestone Reference Code:</span>
                    <span style={{ fontWeight: 900, color: 'var(--rf-leaf-green)', fontFamily: 'var(--rf-font-mono)' }}>REF-ESC-{project.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: USDC / USDT Crypto Stablecoin Escrow */}
            {paymentMethod === 'CRYPTO_STABLECOIN' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontSize: '0.8125rem', fontWeight: 800 }}>
                    <Coins size={16} />
                    <span>Institutional Stablecoin Custody (USDC / USDT)</span>
                  </div>
                  <span className="rf-badge rf-badge-mint rf-text-xs">0% Conversion Fee</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['POLYGON', 'ETHEREUM', 'SOLANA'].map(net => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setCryptoNetwork(net as any)}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: cryptoNetwork === net ? '#38BDF8' : 'rgba(255, 255, 255, 0.05)',
                        color: cryptoNetwork === net ? '#07160D' : 'var(--rf-cream)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {net}
                    </button>
                  ))}
                </div>

                <div style={{ background: '#07160D', padding: '0.75rem', borderRadius: 'var(--rf-radius-sm)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>Smart Contract Escrow Vault:</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>
                      0x73A8...99eB28F (RefeirEscrow.sol)
                    </div>
                  </div>
                  <button onClick={() => handleCopy('0x73A8bE219746f39d22C819F90a293D31899eB28F', 'crypto_addr')} className="rf-btn rf-btn-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                    {copiedField === 'crypto_addr' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: African Rails (M-Pesa, MTN MoMo, NGN Direct Debit) */}
            {paymentMethod === 'AFRICAN_RAILS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800 }}>
                  <Smartphone size={16} />
                  <span>Pan-African Mobile Money & Local Bank Rails</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                  Instant STK Push for M-Pesa (Kenya/Tanzania), MTN Mobile Money (Ghana/Rwanda/Uganda), and NIBSS Instant Settlement (Nigeria).
                </p>
                <input
                  type="tel"
                  className="rf-input"
                  placeholder="Enter African Mobile Money phone number (+254, +234, +233...)"
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            )}

            {/* Fund CTA */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="rf-btn rf-btn-primary rf-w-full"
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              <Lock size={18} />
              <span>
                {isProcessing ? 'Locking in Sovereign Escrow Custody...' : `Authorize & Lock ${convertedTotal.converted.formatted} in Escrow`}
              </span>
            </button>
          </div>
        ) : (
          /* Payment Success State */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(102, 187, 42, 0.15)',
                color: 'var(--rf-leaf-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1.5px solid var(--rf-leaf-green)'
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
              Project Milestone Successfully Funded
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', maxWidth: '440px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              {convertedTotal.converted.formatted} is securely locked in the Refeir Sovereign Escrow Vault. The talent has received confirmation to commence code deliverables.
            </p>

            <button
              onClick={() => {
                onClose();
                onSuccess();
              }}
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{ gap: '0.5rem' }}
            >
              <span>Return to Project Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
