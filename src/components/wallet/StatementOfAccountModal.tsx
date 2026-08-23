import React, { useState, useMemo, useRef } from 'react';
import { User, UserRole, Money, StatementItem, StatementSummary } from '../../types';
import { formatMoney, createMoney } from '../../data/currencies';
import { getTaxJurisdiction } from '../../data/taxJurisdictions';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  Shield,
  Calendar,
  Building,
  QrCode,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  Lock,
  ExternalLink
} from 'lucide-react';

interface StatementOfAccountModalProps {
  user: User | null;
  onClose: () => void;
  onOpenTaxSettings?: () => void;
}

type PeriodOption = 'MTD' | 'LAST_MONTH' | 'Q2_2026' | 'YTD_2026' | 'LIFETIME';

export const StatementOfAccountModal: React.FC<StatementOfAccountModalProps> = ({
  user,
  onClose,
  onOpenTaxSettings
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('MTD');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('NGN');
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const country = user?.tax_country || user?.country || 'Nigeria';
  const taxJurisdiction = getTaxJurisdiction(country);
  const taxIdDisplay = user?.tax_id_number || (country === 'Nigeria' ? '23891024-0001' : 'A019283746Z');

  // Dynamic period labels & dates
  const periodDetails = useMemo(() => {
    switch (selectedPeriod) {
      case 'MTD':
        return { label: 'Month-to-Date (August 2026)', start: '2026-08-01', end: '2026-08-17' };
      case 'LAST_MONTH':
        return { label: 'Last Month (July 2026)', start: '2026-07-01', end: '2026-07-31' };
      case 'Q2_2026':
        return { label: 'Second Quarter (Q2 2026)', start: '2026-04-01', end: '2026-06-30' };
      case 'YTD_2026':
        return { label: 'Year-to-Date (2026 YTD)', start: '2026-01-01', end: '2026-08-17' };
      case 'LIFETIME':
      default:
        return { label: 'All-Time Historical Ledger', start: '2026-01-01', end: '2026-08-17' };
    }
  }, [selectedPeriod]);

  // Generate realistic ledger items customized for the active user role & currency
  const ledgerItems = useMemo((): StatementItem[] => {
    const role = user?.active_role || 'TALENT';
    const curr = selectedCurrency;
    const factor = curr === 'USD' ? 0.00067 : (curr === 'KES' ? 0.088 : (curr === 'GHS' ? 0.010 : 1));

    if (role === 'CLIENT') {
      return [
        {
          id: 'item-c1',
          reference_code: 'RF-TXN-202608-9821',
          timestamp: '2026-08-14T11:20:00Z',
          date_formatted: 'Aug 14, 2026',
          description: 'Trust Vault Escrow Deposit: Pan-African Cross-Border Dispatch Platform',
          counterparty: 'Amaka Nwosu (Design Lead)',
          category: 'ESCROW_DEPOSIT',
          type: 'DEBIT',
          amount: createMoney(Math.round(450000 * factor), curr),
          vat_amount: createMoney(Math.round(450000 * 0.075 * factor), curr),
          wht_amount: createMoney(0, curr),
          balance_after: createMoney(Math.round(850000 * factor), curr),
          status: 'CLEARED'
        },
        {
          id: 'item-c2',
          reference_code: 'RF-TXN-202608-8104',
          timestamp: '2026-08-08T09:15:00Z',
          date_formatted: 'Aug 08, 2026',
          description: 'Milestone 1 Settlement Approval & Fund Release',
          counterparty: 'Amaka Nwosu (Talent)',
          category: 'MILESTONE_RELEASE',
          type: 'DEBIT',
          amount: createMoney(Math.round(250000 * factor), curr),
          vat_amount: createMoney(0, curr),
          balance_after: createMoney(Math.round(1300000 * factor), curr),
          status: 'COMPLETED'
        },
        {
          id: 'item-c3',
          reference_code: 'RF-TXN-202608-7201',
          timestamp: '2026-08-02T14:45:00Z',
          date_formatted: 'Aug 02, 2026',
          description: 'Corporate Wallet Funding via Nigerian Banking Rail (Zenith Direct / Paystack)',
          counterparty: 'Twiga Logistics Kenya / Nigerian Entity',
          category: 'ESCROW_DEPOSIT',
          type: 'CREDIT',
          amount: createMoney(Math.round(1550000 * factor), curr),
          vat_amount: createMoney(0, curr),
          balance_after: createMoney(Math.round(1550000 * factor), curr),
          status: 'COMPLETED'
        }
      ];
    } else if (role === 'SCOUT') {
      return [
        {
          id: 'item-s1',
          reference_code: 'RF-TXN-202608-9842',
          timestamp: '2026-08-15T16:00:00Z',
          date_formatted: 'Aug 15, 2026',
          description: '10% Scout Referral Commission: Tunde Bakare (Apex Fintech Africa) Deal Close',
          counterparty: 'Refeir Referral Protocol',
          category: 'SCOUT_COMMISSION',
          type: 'CREDIT',
          amount: createMoney(Math.round(45000 * factor), curr),
          vat_amount: createMoney(0, curr),
          wht_amount: createMoney(Math.round(45000 * 0.05 * factor), curr),
          balance_after: createMoney(Math.round(180000 * factor), curr),
          status: 'COMPLETED'
        },
        {
          id: 'item-s2',
          reference_code: 'RF-AIRTOKEN-2026-08',
          timestamp: '2026-08-10T12:00:00Z',
          date_formatted: 'Aug 10, 2026',
          description: 'Monthly Airfee Token Fee Waiver (2% Platform Fee Waived to 0%)',
          counterparty: 'Refeir Admin Treasury',
          category: 'AIRFEE_SAVING',
          type: 'CREDIT',
          amount: createMoney(Math.round(9000 * factor), curr),
          vat_amount: createMoney(0, curr),
          balance_after: createMoney(Math.round(135000 * factor), curr),
          status: 'COMPLETED'
        },
        {
          id: 'item-s3',
          reference_code: 'RF-TXN-202608-5512',
          timestamp: '2026-08-04T10:30:00Z',
          date_formatted: 'Aug 04, 2026',
          description: 'Bank Withdrawal Payout to Access Bank Nigeria (•••• 3821)',
          counterparty: 'Access Bank Nigeria PLC',
          category: 'WITHDRAWAL_PAYOUT',
          type: 'DEBIT',
          amount: createMoney(Math.round(100000 * factor), curr),
          vat_amount: createMoney(0, curr),
          balance_after: createMoney(Math.round(126000 * factor), curr),
          status: 'COMPLETED'
        }
      ];
    } else {
      // TALENT or ADMIN
      return [
        {
          id: 'item-t1',
          reference_code: 'RF-TXN-202608-9901',
          timestamp: '2026-08-16T14:20:00Z',
          date_formatted: 'Aug 16, 2026',
          description: 'Milestone 2 Escrow Release: Mobile Banking App UI/UX Design System in Figma',
          counterparty: 'David Kamau (Twiga Logistics Kenya)',
          category: 'MILESTONE_RELEASE',
          type: 'CREDIT',
          amount: createMoney(Math.round(450000 * factor), curr),
          vat_amount: createMoney(0, curr),
          wht_amount: createMoney(Math.round(450000 * 0.05 * factor), curr),
          balance_after: createMoney(Math.round(2450000 * factor), curr),
          status: 'COMPLETED'
        },
        {
          id: 'item-t2',
          reference_code: 'RF-TXN-202608-8812',
          timestamp: '2026-08-09T11:00:00Z',
          date_formatted: 'Aug 09, 2026',
          description: 'Milestone 1 Escrow Release: Wireframes, Design Tokens & User Flows',
          counterparty: 'David Kamau (Client)',
          category: 'MILESTONE_RELEASE',
          type: 'CREDIT',
          amount: createMoney(Math.round(300000 * factor), curr),
          vat_amount: createMoney(0, curr),
          wht_amount: createMoney(Math.round(300000 * 0.05 * factor), curr),
          balance_after: createMoney(Math.round(2000000 * factor), curr),
          status: 'COMPLETED'
        },
        {
          id: 'item-t3',
          reference_code: 'RF-TXN-202608-6204',
          timestamp: '2026-08-03T15:40:00Z',
          date_formatted: 'Aug 03, 2026',
          description: 'Direct Payout Withdrawal to Zenith Bank Nigeria (•••• 9104)',
          counterparty: 'Zenith Bank PLC Nigeria',
          category: 'WITHDRAWAL_PAYOUT',
          type: 'DEBIT',
          amount: createMoney(Math.round(250000 * factor), curr),
          vat_amount: createMoney(0, curr),
          balance_after: createMoney(Math.round(1700000 * factor), curr),
          status: 'COMPLETED'
        }
      ];
    }
  }, [user, selectedCurrency]);

  // Aggregate totals
  const summary = useMemo(() => {
    let totalCredits = 0;
    let totalDebits = 0;
    let totalWht = 0;
    let totalVat = 0;

    ledgerItems.forEach(item => {
      if (item.type === 'CREDIT') totalCredits += item.amount.amount_minor;
      if (item.type === 'DEBIT') totalDebits += item.amount.amount_minor;
      if (item.wht_amount) totalWht += item.wht_amount.amount_minor;
      if (item.vat_amount) totalVat += item.vat_amount.amount_minor;
    });

    const closingBalance = ledgerItems.length > 0 ? ledgerItems[0].balance_after.amount_minor : totalCredits - totalDebits;
    const openingBalance = Math.max(0, closingBalance - totalCredits + totalDebits);

    return {
      statementNumber: `RF-SOA-202608-${user?.id ? user.id.replace(/\D/g, '').slice(-4) || '8821' : '8821'}`,
      generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      openingBalance,
      totalCredits,
      totalDebits,
      totalWht,
      totalVat,
      closingBalance,
      count: ledgerItems.length,
      digitalHash: 'SHA256: 9e4f2b1a8d0c6e5a7b3c1d9f8e2a4b6c0d8e4f2a1b3c5d7e9f1a3b5c7d9e1f3a'
    };
  }, [ledgerItems, user]);

  // Handle Printable PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle CSV Export
  const handleExportCsv = () => {
    setIsExportingCsv(true);
    const headers = [
      'Statement Reference',
      'Transaction Date',
      'Transaction Code',
      'Description',
      'Counterparty',
      'Category',
      'Entry Type',
      'Currency',
      'Amount',
      'VAT Amount',
      'WHT Amount',
      'Balance After',
      'Status'
    ];

    const rows = ledgerItems.map(item => [
      summary.statementNumber,
      item.date_formatted,
      item.reference_code,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${(item.counterparty || 'Refeir Protocol').replace(/"/g, '""')}"`,
      item.category,
      item.type,
      selectedCurrency,
      (item.amount.amount_minor / 100).toFixed(2),
      item.vat_amount ? (item.vat_amount.amount_minor / 100).toFixed(2) : '0.00',
      item.wht_amount ? (item.wht_amount.amount_minor / 100).toFixed(2) : '0.00',
      (item.balance_after.amount_minor / 100).toFixed(2),
      item.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Refeir_Statement_${user?.id || 'account'}_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportingCsv(false);
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
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden'
        }}
      >
        {/* Controls Toolbar (Hidden in Print) */}
        <div
          className="rf-no-print"
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--rf-navy-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(54, 224, 160, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rf-mint)'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Official Statement of Account
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                FIRS & Cross-Border Compliant Financial Ledger
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Currency Selector */}
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              className="rf-select"
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem', width: 'auto' }}
            >
              <option value="NGN">NGN (₦ - Nigeria HQ)</option>
              <option value="KES">KES (KSh - Kenya)</option>
              <option value="GHS">GHS (GH₵ - Ghana)</option>
              <option value="ZAR">ZAR (R - South Africa)</option>
              <option value="USD">USD ($ - Global)</option>
            </select>

            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as PeriodOption)}
              className="rf-select"
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem', width: 'auto' }}
            >
              <option value="MTD">August 2026 (MTD)</option>
              <option value="LAST_MONTH">July 2026 (Last Month)</option>
              <option value="Q2_2026">Q2 2026 (Apr - Jun)</option>
              <option value="YTD_2026">2026 Year-to-Date</option>
              <option value="LIFETIME">Full Lifetime Archive</option>
            </select>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ fontWeight: 800, gap: '0.35rem' }}
              title="Print official PDF statement"
            >
              <Printer size={14} />
              <span>Download PDF / Print</span>
            </button>

            {/* CSV Button */}
            <button
              onClick={handleExportCsv}
              className="rf-btn rf-btn-secondary rf-btn-sm"
              style={{ gap: '0.35rem' }}
              title="Export as CSV for accounting"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rf-btn rf-btn-ghost rf-btn-sm"
              style={{ padding: '0.4rem', color: 'var(--rf-slate-400)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Statement Body */}
        <div
          ref={printRef}
          id="rf-printable-statement"
          style={{
            padding: '2.5rem',
            overflowY: 'auto',
            background: 'var(--rf-bg-page)',
            color: 'var(--rf-cream)',
            fontFamily: 'var(--rf-font-sans)'
          }}
        >
          {/* Header Letterhead */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(54, 224, 160, 0.4)', paddingBottom: '1.75rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--rf-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#07160D', fontWeight: 900, fontSize: '1.125rem' }}>
                  R
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--rf-cream)' }}>
                  REFEIR <span style={{ color: 'var(--rf-mint)' }}>TECHNOLOGIES</span>
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', lineHeight: 1.5 }}>
                <strong>Refeir Technologies Ltd.</strong> • RC-1892044<br />
                <strong>FIRS Tax ID (TIN):</strong> 24891023-0001 • <strong>VAT No:</strong> NG-VAT-1892044<br />
                12 Marina Boulevard, Victoria Island, Lagos, Nigeria<br />
                Regional Hubs: Nairobi (Silicon Savannah) • Accra • London
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="rf-badge rf-badge-mint rf-text-xs" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                AUDITED ACCOUNT STATEMENT
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>
                {summary.statementNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                Date Issued: {summary.generatedAt}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', fontWeight: 700, marginTop: '2px' }}>
                Period: {periodDetails.label}
              </div>
            </div>
          </div>

          {/* Account Holder & Tax Information Banner */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Account Holder Name
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                {user?.first_name} {user?.last_name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                Role: <strong style={{ color: 'var(--rf-mint)' }}>{user?.active_role}</strong> • User ID: {user?.id}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Tax Residency & Authority
              </span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                {country} ({taxJurisdiction.tax_authority.split('(')[0].trim()})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                {country === 'Nigeria' ? 'Headquarters Jurisdiction (FIRS / LIRS)' : 'Cross-Border Treaty Partner'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Tax ID / TIN / KRA PIN
              </span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-mint)', fontFamily: 'var(--rf-font-mono)', marginTop: '2px' }}>
                {taxIdDisplay}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                Status: Verified Resident
              </div>
            </div>
          </div>

          {/* Executive Ledger Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                Opening Balance
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                {formatMoney(createMoney(summary.openingBalance, selectedCurrency))}
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(54, 224, 160, 0.06)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(54, 224, 160, 0.2)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--rf-mint)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Credits (+)
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '2px' }}>
                {formatMoney(createMoney(summary.totalCredits, selectedCurrency))}
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <span style={{ fontSize: '0.6875rem', color: '#EF4444', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Debits (-)
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>
                {formatMoney(createMoney(summary.totalDebits, selectedCurrency))}
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(244, 185, 66, 0.08)', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(244, 185, 66, 0.25)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--rf-golden-yellow)', textTransform: 'uppercase', fontWeight: 700 }}>
                Taxes & WHT
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-golden-yellow)', marginTop: '2px' }}>
                {formatMoney(createMoney(summary.totalWht + summary.totalVat, selectedCurrency))}
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(36, 87, 255, 0.08)', borderRadius: 'var(--rf-radius-md)', border: '1.5px solid rgba(36, 87, 255, 0.35)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--rf-leaf-green)', textTransform: 'uppercase', fontWeight: 800 }}>
                Closing Balance
              </span>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--rf-cream)', marginTop: '2px' }}>
                {formatMoney(createMoney(summary.closingBalance, selectedCurrency))}
              </div>
            </div>
          </div>

          {/* Itemized Financial Ledger Table */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Itemized Financial Ledger & Escrow Settlement Records</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--rf-slate-400)' }}>
                {ledgerItems.length} Transactions Recorded
              </span>
            </h3>

            <div style={{ overflowX: 'auto', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(18, 43, 26, 0.04)', borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800 }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Date & Ref</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Description & Counterparty</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Tax / WHT</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--rf-navy-border)' }}>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{item.date_formatted}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)' }}>{item.reference_code}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--rf-cream)' }}>{item.description}</div>
                        {item.counterparty && (
                          <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                            Party: {item.counterparty}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: item.type === 'CREDIT' ? 'rgba(54, 224, 160, 0.15)' : 'rgba(255, 87, 87, 0.15)',
                            color: item.type === 'CREDIT' ? 'var(--rf-mint)' : '#FF7D7D'
                          }}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: item.type === 'CREDIT' ? 'var(--rf-mint)' : '#FF7D7D' }}>
                        {item.type === 'CREDIT' ? '+' : '-'}{formatMoney(item.amount)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>
                        {item.wht_amount && item.wht_amount.amount_minor > 0
                          ? `WHT: ${formatMoney(item.wht_amount)}`
                          : (item.vat_amount && item.vat_amount.amount_minor > 0 ? `VAT: ${formatMoney(item.vat_amount)}` : '—')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>
                        {formatMoney(item.balance_after)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Compliance & Legal Notice Box */}
          <div
            style={{
              border: '1px solid rgba(244, 185, 66, 0.25)',
              background: 'rgba(244, 185, 66, 0.04)',
              borderRadius: 'var(--rf-radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              fontSize: '0.75rem',
              color: 'var(--rf-slate-300)',
              lineHeight: 1.6
            }}
          >
            <div style={{ fontWeight: 800, color: '#F4B942', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} />
              <span>Tax Authority & Statutory Withholding Notes (Nigeria & Cross-Border)</span>
            </div>
            <div>
              {taxJurisdiction.compliance_notes} All electronic transfers are settled in accordance with CBN regulations, FIRS guidelines, and cross-border Double Taxation Treaties (DTT).
            </div>
          </div>

          {/* Official Verification Seal & Cryptographic Signature */}
          <div
            style={{
              borderTop: '2px dashed var(--rf-navy-border)',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <CheckCircle2 size={16} />
                <span>Verified Cryptographic Audit Hash</span>
              </div>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--rf-font-mono)', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                {summary.digitalHash}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-500)', marginTop: '2px' }}>
                This is an official computer-generated statement issued by Refeir Technologies Ltd. Valid without physical signature when verified online.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.25rem' }}>
                  <QrCode size={36} color="var(--rf-mint)" />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Scan to Verify</span>
              </div>

              <div style={{ textAlign: 'right', borderLeft: '1px solid var(--rf-navy-border)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Refeir Financial Controller
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>
                  Treasury & Escrow Operations
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginTop: '2px' }}>
                  SEALED & RECONCILED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden in Print) */}
        <div
          className="rf-no-print"
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--rf-navy-border)',
            background: 'var(--rf-navy-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {onOpenTaxSettings ? (
            <button
              onClick={onOpenTaxSettings}
              className="rf-btn rf-btn-ghost rf-btn-sm"
              style={{ gap: '0.35rem', color: 'var(--rf-mint)' }}
            >
              <Percent size={14} />
              <span>Edit Tax Profile & Country Details</span>
            </button>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
              Tax ID: <strong style={{ color: 'var(--rf-cream)' }}>{taxIdDisplay}</strong> ({country})
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} className="rf-btn rf-btn-secondary rf-btn-sm">
              Close Statement
            </button>
            <button onClick={handlePrint} className="rf-btn rf-btn-mint rf-btn-sm" style={{ fontWeight: 800, gap: '0.35rem' }}>
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
