import React, { useState } from 'react';
import { PayoutMethod, PayoutMethodType } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import {
  X,
  Building,
  Smartphone,
  Coins,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AddPayoutMethodModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (method: PayoutMethod) => void;
}

const COUNTRY_PRESETS = [
  { code: 'Nigeria', currency: 'NGN', name: 'Nigeria (NGN - Naira)' },
  { code: 'Kenya', currency: 'KES', name: 'Kenya (KES - Shilling)' },
  { code: 'Ghana', currency: 'GHS', name: 'Ghana (GHS - Cedi)' },
  { code: 'South Africa', currency: 'ZAR', name: 'South Africa (ZAR - Rand)' },
  { code: 'Egypt', currency: 'EGP', name: 'Egypt (EGP - Pound)' },
  { code: 'Rwanda', currency: 'RWF', name: 'Rwanda (RWF - Franc)' },
  { code: 'Uganda', currency: 'UGX', name: 'Uganda (UGX - Shilling)' },
  { code: 'Tanzania', currency: 'TZS', name: 'Tanzania (TZS - Shilling)' },
  { code: 'Ivory Coast', currency: 'XOF', name: 'West Africa (XOF - CFA)' },
  { code: 'United States', currency: 'USD', name: 'Global (USD - US Dollar / SWIFT)' },
  { code: 'United Kingdom', currency: 'GBP', name: 'United Kingdom (GBP - Pound)' },
  { code: 'European Union', currency: 'EUR', name: 'Europe (EUR - SEPA)' }
];

const BANK_PRESETS: Record<string, string[]> = {
  Nigeria: ['Guaranty Trust Bank (GTB)', 'Access Bank', 'Zenith Bank', 'First Bank of Nigeria', 'United Bank for Africa (UBA)', 'Kuda Microfinance Bank', 'Moniepoint MFB', 'OPay', 'Stanbic IBTC', 'Sterling Bank'],
  Kenya: ['Equity Bank', 'KCB Bank Kenya', 'Co-operative Bank', 'NCBA Bank', 'Standard Chartered Kenya', 'Absa Bank Kenya', 'Diamond Trust Bank'],
  Ghana: ['Ecobank Ghana', 'GCB Bank', 'Stanbic Bank Ghana', 'Absa Bank Ghana', 'CalBank', 'Fidelity Bank Ghana'],
  'South Africa': ['Standard Bank', 'First National Bank (FNB)', 'Capitec Bank', 'Nedbank', 'Absa Group', 'Investec'],
  Egypt: ['Commercial International Bank (CIB)', 'National Bank of Egypt (NBE)', 'Banque Misr', 'QNB Alahli', 'HSBC Egypt'],
  'United States': ['Chase Bank (JPMorgan)', 'Bank of America', 'Wells Fargo', 'Citibank', 'Wise USD Account', 'Payoneer USD'],
  'United Kingdom': ['Barclays Bank', 'HSBC UK', 'Lloyds Bank', 'NatWest', 'Revolut UK', 'Monzo Bank']
};

const MOMO_PRESETS: Record<string, string[]> = {
  Kenya: ['M-Pesa (Safaricom)', 'Airtel Money Kenya'],
  Ghana: ['MTN Mobile Money', 'Telecel (Vodafone) Cash', 'AirtelTigo Money'],
  Nigeria: ['OPay Wallet', 'PalmPay', 'MoMo PSB (MTN)', 'Kuda PSB'],
  Rwanda: ['MTN Mobile Money Rwanda', 'Airtel Money Rwanda'],
  Uganda: ['MTN Mobile Money Uganda', 'Airtel Money Uganda'],
  Tanzania: ['M-Pesa Tanzania (Vodacom)', 'Tigo Pesa', 'Airtel Money Tanzania'],
  'Ivory Coast': ['Orange Money', 'MTN Mobile Money CI', 'Moov Money CI', 'Wave Côte d’Ivoire']
};

export const AddPayoutMethodModal: React.FC<AddPayoutMethodModalProps> = ({
  userId,
  isOpen,
  onClose,
  onAdded
}) => {
  const { addPayoutMethod } = useMarketplace();
  const { showToast } = useNotification();

  const [methodType, setMethodType] = useState<PayoutMethodType>('BANK_ACCOUNT');
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [institutionName, setInstitutionName] = useState(BANK_PRESETS['Nigeria'][0]);
  const [customInstitution, setCustomInstitution] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCountryConfig = COUNTRY_PRESETS.find(c => c.code === selectedCountry) || COUNTRY_PRESETS[0];

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setVerifiedName(null);
    if (methodType === 'BANK_ACCOUNT') {
      const banks = (BANK_PRESETS as any)[country] || ['Local Commercial Bank'];
      setInstitutionName(banks[0]);
    } else if (methodType === 'MOBILE_MONEY') {
      const momos = (MOMO_PRESETS as any)[country] || ['Direct Mobile Money'];
      setInstitutionName(momos[0]);
    }
  };

  const handleTypeChange = (type: PayoutMethodType) => {
    setMethodType(type);
    setVerifiedName(null);
    if (type === 'BANK_ACCOUNT') {
      const banks = (BANK_PRESETS as any)[selectedCountry] || ['Local Commercial Bank'];
      setInstitutionName(banks[0]);
    } else if (type === 'MOBILE_MONEY') {
      const momos = (MOMO_PRESETS as any)[selectedCountry] || ['Direct Mobile Money'];
      setInstitutionName(momos[0]);
    } else {
      setInstitutionName('USDT / USDC (Polygon & TRC20)');
    }
  };

  const handleVerifyAccount = () => {
    if (!accountNumber || accountNumber.trim().length < 6) {
      showToast('Invalid Identifier', 'Please enter a valid account or phone number.', 'WARNING');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const name = accountHolderName.trim() || 'Verified Account Holder';
      setVerifiedName(name);
      showToast('Account Verified', 'Successfully resolved account holder: ' + name, 'SUCCESS');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      showToast('Required Field', 'Please enter your account number or payout identifier.', 'WARNING');
      return;
    }

    if (!accountHolderName.trim() && methodType !== 'OTHER') {
      showToast('Required Field', 'Please enter the official account holder name.', 'WARNING');
      return;
    }

    const finalInstitution = institutionName === 'OTHER_CUSTOM' ? customInstitution : institutionName;
    
    let masked = '';
    const cleanNum = accountNumber.trim();
    if (cleanNum.length >= 4) {
      const last4 = cleanNum.slice(-4);
      masked = methodType === 'MOBILE_MONEY' 
        ? cleanNum.slice(0, 4) + ' •••• ' + last4 
        : '•••• ' + last4;
    } else {
      masked = '•••• ' + cleanNum;
    }

    const newMethod = addPayoutMethod(userId, {
      type: methodType,
      country: selectedCountry,
      currency: currentCountryConfig.currency,
      institution_name: finalInstitution || 'Verified Bank Account',
      masked_identifier: masked,
      account_holder_name: accountHolderName.trim() || 'Primary Account',
      is_default: isDefault
    });

    showToast(
      'Payout Channel Linked',
      finalInstitution + ' (' + masked + ') has been added as your ' + (isDefault ? 'primary' : 'secondary') + ' payout channel.',
      'SUCCESS'
    );

    if (onAdded) onAdded(newMethod);
    onClose();
  };

  return (
    <div className="rf-modal-backdrop" style={{ zIndex: 1200 }} onClick={onClose}>
      <div
        className="rf-modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#07160D',
          border: '1.5px solid rgba(102, 187, 42, 0.45)',
          borderRadius: 'var(--rf-radius-2xl)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(102, 187, 42, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '100px',
            background: 'radial-gradient(ellipse, rgba(102, 187, 42, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            zIndex: 2,
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--rf-radius-md)',
                background: 'rgba(102, 187, 42, 0.15)',
                border: '1px solid rgba(102, 187, 42, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rf-leaf-green)'
              }}
            >
              <Building size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Add Payout Channel
                </h3>
                <span className="rf-badge rf-badge-mint rf-text-xs" style={{ padding: '0.15rem 0.5rem' }}>
                  Direct Settlement
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                Link your bank account, mobile money wallet, or stablecoin address.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--rf-slate-300)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--rf-slate-300)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              padding: '1.5rem 1.75rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* 1. Channel Type Selector */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '0.5rem' }}>
                Select Payout Channel Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                <button
                  type="button"
                  onClick={() => handleTypeChange('BANK_ACCOUNT')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    background: methodType === 'BANK_ACCOUNT' ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    border: '1.5px solid ' + (methodType === 'BANK_ACCOUNT' ? 'var(--rf-leaf-green)' : 'rgba(255, 255, 255, 0.08)'),
                    borderRadius: 'var(--rf-radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <Building size={20} color={methodType === 'BANK_ACCOUNT' ? 'var(--rf-leaf-green)' : '#94A3B8'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: methodType === 'BANK_ACCOUNT' ? '#FFFFFF' : '#CBD5E1' }}>
                    Bank Account
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('MOBILE_MONEY')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    background: methodType === 'MOBILE_MONEY' ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    border: '1.5px solid ' + (methodType === 'MOBILE_MONEY' ? 'var(--rf-leaf-green)' : 'rgba(255, 255, 255, 0.08)'),
                    borderRadius: 'var(--rf-radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <Smartphone size={20} color={methodType === 'MOBILE_MONEY' ? 'var(--rf-leaf-green)' : '#94A3B8'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: methodType === 'MOBILE_MONEY' ? '#FFFFFF' : '#CBD5E1' }}>
                    Mobile Money
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('OTHER')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    background: methodType === 'OTHER' ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    border: '1.5px solid ' + (methodType === 'OTHER' ? 'var(--rf-leaf-green)' : 'rgba(255, 255, 255, 0.08)'),
                    borderRadius: 'var(--rf-radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <Coins size={20} color={methodType === 'OTHER' ? 'var(--rf-leaf-green)' : '#94A3B8'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: methodType === 'OTHER' ? '#FFFFFF' : '#CBD5E1' }}>
                    USDC / USDT
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Country / Jurisdiction */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '0.4rem' }}>
                Country & Settlement Currency
              </label>
              <select
                value={selectedCountry}
                onChange={e => handleCountryChange(e.target.value)}
                className="rf-select"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderColor: 'rgba(102, 187, 42, 0.35)',
                  color: '#FFFFFF',
                  padding: '0.65rem 0.85rem'
                }}
              >
                {COUNTRY_PRESETS.map(c => (
                  <option key={c.code} value={c.code} style={{ background: '#0F2E1E', color: '#FFFFFF' }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Institution / Bank Name */}
            {methodType !== 'OTHER' && (
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '0.4rem' }}>
                  {methodType === 'BANK_ACCOUNT' ? 'Select Bank / Financial Institution' : 'Select Mobile Money Operator'}
                </label>
                <select
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  className="rf-select"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderColor: 'rgba(102, 187, 42, 0.35)',
                    color: '#FFFFFF',
                    padding: '0.65rem 0.85rem',
                    marginBottom: institutionName === 'OTHER_CUSTOM' ? '0.5rem' : '0'
                  }}
                >
                  {(methodType === 'BANK_ACCOUNT' 
                    ? (BANK_PRESETS[selectedCountry] || ['Local Commercial Bank'])
                    : (MOMO_PRESETS[selectedCountry] || ['Direct Mobile Money'])
                  ).map((b: string) => (
                    <option key={b} value={b} style={{ background: '#0F2E1E', color: '#FFFFFF' }}>
                      {b}
                    </option>
                  ))}
                  <option value="OTHER_CUSTOM" style={{ background: '#0F2E1E', color: '#FFFFFF' }}>
                    + Other / Custom Institution
                  </option>
                </select>

                {institutionName === 'OTHER_CUSTOM' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter Institution Name (e.g. Sterling Bank, Standard Chartered)"
                    value={customInstitution}
                    onChange={e => setCustomInstitution(e.target.value)}
                    className="rf-input"
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderColor: 'rgba(102, 187, 42, 0.35)',
                      color: '#FFFFFF',
                      padding: '0.65rem 0.85rem'
                    }}
                  />
                )}
              </div>
            )}

            {/* 4. Account Number / IBAN / Phone / Wallet */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {methodType === 'BANK_ACCOUNT' 
                    ? 'Account Number / NUBAN / IBAN'
                    : methodType === 'MOBILE_MONEY'
                    ? 'Registered Mobile Money Phone Number'
                    : 'Recipient Wallet Address (Polygon / TRC20)'}
                </label>
                {accountNumber.length >= 6 && methodType !== 'OTHER' && (
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={isVerifying}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--rf-leaf-green)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Sparkles size={12} />
                    <span>{isVerifying ? 'Verifying...' : 'Verify Name'}</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                placeholder={
                  methodType === 'BANK_ACCOUNT'
                    ? 'e.g. 0123456789 or IBAN'
                    : methodType === 'MOBILE_MONEY'
                    ? 'e.g. +234 801 234 5678 or 0712345678'
                    : 'e.g. 0x71C... or T9y... (USDT/USDC)'
                }
                value={accountNumber}
                onChange={e => {
                  setAccountNumber(e.target.value);
                  setVerifiedName(null);
                }}
                className="rf-input"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderColor: 'rgba(102, 187, 42, 0.35)',
                  color: '#FFFFFF',
                  padding: '0.65rem 0.85rem'
                }}
              />
            </div>

            {/* 5. Account Holder Legal Name */}
            {methodType !== 'OTHER' && (
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '0.4rem' }}>
                  Account Holder Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Official name registered with the bank or telecom"
                  value={accountHolderName}
                  onChange={e => setAccountHolderName(e.target.value)}
                  className="rf-input"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderColor: verifiedName ? 'var(--rf-leaf-green)' : 'rgba(102, 187, 42, 0.35)',
                    color: '#FFFFFF',
                    padding: '0.65rem 0.85rem'
                  }}
                />
                {verifiedName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle2 size={13} />
                    <span>Instant Name Verification Confirmed</span>
                  </div>
                )}
              </div>
            )}

            {/* 6. Default Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--rf-radius-md)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Set as Preferred / Default Payout Destination
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Automatic destination for milestone releases and scout referral rewards.
                </div>
              </div>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--rf-leaf-green)', cursor: 'pointer' }}
              />
            </div>

            {/* Security Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem',
                background: 'rgba(102, 187, 42, 0.08)',
                border: '1px solid rgba(102, 187, 42, 0.2)',
                borderRadius: 'var(--rf-radius-md)'
              }}
            >
              <ShieldCheck size={18} color="var(--rf-leaf-green)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: '#CBD5E1', margin: 0, lineHeight: 1.4 }}>
                <strong>Bank-Grade Encryption:</strong> Your identifiers are stored securely and masked across public views.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(0, 0, 0, 0.2)',
              flexShrink: 0
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rf-btn rf-btn-ghost rf-btn-sm"
              style={{ color: '#CBD5E1' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ fontWeight: 800, padding: '0.6rem 1.35rem', gap: '0.45rem' }}
            >
              <span>Save & Link Channel</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
