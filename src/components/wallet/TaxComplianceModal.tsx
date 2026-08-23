import React, { useState } from 'react';
import { User, TaxIdType, TaxBusinessType } from '../../types';
import { TAX_JURISDICTIONS, getTaxJurisdiction } from '../../data/taxJurisdictions';
import { useNotification } from '../../context/NotificationContext';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  X,
  Globe2,
  Lock,
  Save,
  HelpCircle,
  Percent,
  Check
} from 'lucide-react';

interface TaxComplianceModalProps {
  user: User | null;
  onClose: () => void;
  onSaveTaxProfile: (updatedData: Partial<User>) => void;
}

export const TaxComplianceModal: React.FC<TaxComplianceModalProps> = ({
  user,
  onClose,
  onSaveTaxProfile
}) => {
  const { showToast } = useNotification();

  const [selectedCountry, setSelectedCountry] = useState<string>(user?.tax_country || user?.country || 'Nigeria');
  const [taxIdType, setTaxIdType] = useState<TaxIdType>(user?.tax_id_type || (user?.country === 'Nigeria' ? 'NIGERIA_TIN' : 'INTERNATIONAL_TAX_ID'));
  const [taxIdNumber, setTaxIdNumber] = useState<string>(user?.tax_id_number || (user?.country === 'Nigeria' ? '23891024-0001' : ''));
  const [businessType, setBusinessType] = useState<TaxBusinessType>(user?.tax_business_type || 'INDIVIDUAL_FREELANCER');
  const [rcNumber, setRcNumber] = useState<string>(user?.registered_company_rc || '');
  const [vatRegistered, setVatRegistered] = useState<boolean>(user?.vat_registered || false);
  const [vatIdNumber, setVatIdNumber] = useState<string>(user?.vat_id_number || '');
  const [exemptionStatus, setExemptionStatus] = useState<string>(user?.tax_exemption_status || 'NONE');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'CERTIFICATE'>('SETTINGS');

  const jurisdiction = getTaxJurisdiction(selectedCountry);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    const j = getTaxJurisdiction(newCountry);
    if (newCountry === 'Nigeria') {
      setTaxIdType('NIGERIA_TIN');
    } else if (newCountry === 'Kenya') {
      setTaxIdType('KENYA_KRA_PIN');
    } else if (newCountry === 'Ghana') {
      setTaxIdType('GHANA_CARD_TIN');
    } else if (newCountry === 'South Africa') {
      setTaxIdType('SA_SARS_PIN');
    } else if (newCountry === 'United States') {
      setTaxIdType('US_W8BEN_EIN_SSN');
    } else if (newCountry === 'United Kingdom') {
      setTaxIdType('UK_UTR_NIN');
    } else {
      setTaxIdType('INTERNATIONAL_TAX_ID');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    onSaveTaxProfile({
      tax_country: selectedCountry,
      tax_id_type: taxIdType,
      tax_id_number: taxIdNumber,
      tax_business_type: businessType,
      registered_company_rc: rcNumber || undefined,
      vat_registered: vatRegistered,
      vat_id_number: vatIdNumber || undefined,
      tax_exemption_status: exemptionStatus as any
    });

    setIsSaving(false);
    showToast('Tax Information Updated', `Your ${selectedCountry} tax profile has been verified and saved for reporting.`, 'SUCCESS');
    onClose();
  };

  const handleDownloadTaxCertificate = () => {
    showToast('Tax Certificate Generated', `Downloading Form WHT/FIRS Annual Tax Certificate for ${selectedCountry}...`, 'INFO');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 10, 6, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
    >
      <div
        className="rf-statement-modal-wrapper"
        style={{
          background: 'var(--rf-navy-surface)',
          border: '1.5px solid var(--rf-navy-border)',
          borderRadius: 'var(--rf-radius-2xl)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--rf-navy-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(244, 185, 66, 0.15)',
                  border: '1px solid rgba(244, 185, 66, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F4B942',
                  flexShrink: 0
                }}
              >
                <Percent size={17} />
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0, lineHeight: 1.2 }}>
                Tax Information & Cross-Border Compliance
              </h2>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '4px 0 0 0', paddingLeft: '2.65rem', lineHeight: 1.3 }}>
              Nigeria (HQ / FIRS) & International Tax Residency
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`rf-btn rf-btn-sm ${activeTab === 'SETTINGS' ? 'rf-btn-mint' : 'rf-btn-ghost'}`}
              style={{ fontSize: '0.8125rem' }}
            >
              Tax Settings
            </button>
            <button
              onClick={() => setActiveTab('CERTIFICATE')}
              className={`rf-btn rf-btn-sm ${activeTab === 'CERTIFICATE' ? 'rf-btn-mint' : 'rf-btn-ghost'}`}
              style={{ fontSize: '0.8125rem' }}
            >
              Tax Certificate (WHT)
            </button>
            <button
              onClick={onClose}
              className="rf-btn rf-btn-ghost rf-btn-sm"
              style={{ padding: '0.4rem', color: 'var(--rf-slate-400)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto' }}>
          {activeTab === 'SETTINGS' ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Headquarters Info Notice */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 35, 25, 0.95) 0%, rgba(7, 22, 13, 0.95) 100%)',
                  border: '1.5px solid rgba(54, 224, 160, 0.35)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.1rem 1.25rem'
                }}
              >
                <div style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Refeir Technologies Ltd. (Nigeria Headquarters)
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
                  CAC RC Number: <strong style={{ color: '#FFFFFF' }}>RC-1892044</strong> • FIRS Tax ID: <strong style={{ color: '#4ADE80' }}>24891023-0001</strong>. All platform service charges generated in Nigeria include 7.5% statutory VAT. Cross-border earnings are settled under international tax treaties.
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                  Country of Tax Residency
                </label>
                <select
                  value={selectedCountry}
                  onChange={e => handleCountryChange(e.target.value)}
                  className="rf-select"
                  style={{ width: '100%' }}
                >
                  {Object.keys(TAX_JURISDICTIONS).map(c => (
                    <option key={c} value={c}>
                      {c} {c === 'Nigeria' ? '★ (Platform Headquarters - FIRS)' : ''}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '4px', display: 'block' }}>
                  Governing Authority: <strong style={{ color: 'var(--rf-mint)' }}>{jurisdiction.tax_authority}</strong>
                </span>
              </div>

              {/* Business Classification */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                  Taxpayer Classification
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.625rem' }}>
                  {[
                    { id: 'INDIVIDUAL_FREELANCER', label: 'Individual / Freelancer', desc: 'Personal income earner / independent contractor' },
                    { id: 'REGISTERED_BUSINESS', label: 'Registered Business / Sole Prop', desc: 'CAC Registered Business Name or Sole Proprietor' },
                    { id: 'CORPORATION_ENTERPRISE', label: 'Limited Liability / Corp', desc: 'Registered Company (RC / Inc / Ltd)' }
                  ].map(b => (
                    <div
                      key={b.id}
                      onClick={() => setBusinessType(b.id as TaxBusinessType)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--rf-radius-md)',
                        border: businessType === b.id ? '1.5px solid var(--rf-mint)' : '1px solid var(--rf-navy-border)',
                        background: businessType === b.id ? 'rgba(54, 224, 160, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{b.label}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>{b.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Identification Number (Adaptive) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                    {jurisdiction.primary_tax_id_name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={taxIdNumber}
                    onChange={e => setTaxIdNumber(e.target.value)}
                    placeholder={jurisdiction.tax_id_placeholder}
                    className="rf-input"
                    style={{ width: '100%', fontFamily: 'var(--rf-font-mono)' }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '2px', display: 'block' }}>
                    Used on official Statement of Account & Withholding Tax certificates.
                  </span>
                </div>

                {selectedCountry === 'Nigeria' && businessType !== 'INDIVIDUAL_FREELANCER' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                      CAC RC Registration Number
                    </label>
                    <input
                      type="text"
                      value={rcNumber}
                      onChange={e => setRcNumber(e.target.value)}
                      placeholder="e.g. RC-1892044 or BN-392109"
                      className="rf-input"
                      style={{ width: '100%', fontFamily: 'var(--rf-font-mono)' }}
                    />
                  </div>
                )}
              </div>

              {/* VAT & Tax Exemption Options */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                      VAT Registration Status ({jurisdiction.vat_rate_percent}% statutory rate)
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                      Check if your business is registered for Value Added Tax with {jurisdiction.tax_authority.split('(')[0].trim()}.
                    </p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={vatRegistered}
                      onChange={e => setVatRegistered(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--rf-mint)' }}
                    />
                  </label>
                </div>

                {vatRegistered && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rf-navy-border)' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.35rem' }}>
                      VAT Identification Number
                    </label>
                    <input
                      type="text"
                      value={vatIdNumber}
                      onChange={e => setVatIdNumber(e.target.value)}
                      placeholder="e.g. NG-VAT-1892044"
                      className="rf-input"
                      style={{ width: '100%', fontFamily: 'var(--rf-font-mono)', fontSize: '0.8125rem' }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="rf-btn rf-btn-secondary rf-btn-md">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="rf-btn rf-btn-mint rf-btn-md" style={{ fontWeight: 800, gap: '0.4rem' }}>
                  <Save size={15} />
                  <span>{isSaving ? 'Saving Tax Profile...' : 'Save & Verify Tax Profile'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Tax Certificate & Summary Tab */
            <div>
              <div
                style={{
                  background: 'var(--rf-bg-page)',
                  border: '1.5px solid var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '2rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(244, 185, 66, 0.4)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                      ANNUAL WITHHOLDING TAX (WHT) CREDIT CERTIFICATE
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                      Refeir Technologies Ltd. • Statutory Tax Filing Schedule (FIRS & Pan-African DTT)
                    </div>
                  </div>
                  <div className="rf-badge rf-badge-mint rf-text-xs">
                    TAX YEAR 2026
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>Taxpayer Name:</span>
                    <div style={{ fontWeight: 800, color: 'var(--rf-cream)' }}>{user?.first_name} {user?.last_name}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>Tax Identification Number:</span>
                    <div style={{ fontWeight: 800, color: 'var(--rf-mint)', fontFamily: 'var(--rf-font-mono)' }}>{taxIdNumber || '23891024-0001'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>Tax Residency Jurisdiction:</span>
                    <div style={{ fontWeight: 800, color: 'var(--rf-cream)' }}>{selectedCountry} ({jurisdiction.tax_authority.split('(')[0].trim()})</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>Applicable Withholding Rate:</span>
                    <div style={{ fontWeight: 800, color: '#F4B942' }}>{jurisdiction.withholding_tax_percent}% Statutory WHT</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--rf-slate-300)', fontSize: '0.8125rem' }}>Gross Qualifying Contract Volume:</span>
                    <strong style={{ color: 'var(--rf-cream)' }}>₦3,450,000.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--rf-slate-300)', fontSize: '0.8125rem' }}>Total Refeir Platform Service Fees (7.5% VAT inclusive):</span>
                    <strong style={{ color: 'var(--rf-cream)' }}>₦172,500.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--rf-navy-border)' }}>
                    <span style={{ color: 'var(--rf-mint)', fontSize: '0.875rem', fontWeight: 800 }}>Total Withholding Tax Remittance Credit:</span>
                    <strong style={{ color: 'var(--rf-mint)', fontSize: '1rem' }}>₦172,500.00</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', lineHeight: 1.5, margin: 0 }}>
                  This certificate confirms statutory tax deduction credits on independent professional contractor payments remitted under the Nigerian Companies Income Tax Act (CITA) / Personal Income Tax Act (PITA) and corresponding bilateral double taxation agreements.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={onClose} className="rf-btn rf-btn-secondary rf-btn-md">
                  Close
                </button>
                <button onClick={handleDownloadTaxCertificate} className="rf-btn rf-btn-mint rf-btn-md" style={{ fontWeight: 800, gap: '0.4rem' }}>
                  <Download size={15} />
                  <span>Download / Print WHT Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
