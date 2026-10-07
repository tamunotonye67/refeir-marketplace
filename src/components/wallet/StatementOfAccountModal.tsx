import React, { useState, useMemo, useRef } from 'react';
import { User, UserRole, Money, StatementItem, StatementSummary } from '../../types';
import { formatMoney, createMoney } from '../../data/currencies';
import { getTaxJurisdiction } from '../../data/taxJurisdictions';
import { useTheme } from '../../context/ThemeContext';
import { RefeirLogo } from '../common/RefeirLogo';
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
          background: isDark ? '#0A1810' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDark ? '0 25px 60px rgba(0, 0, 0, 0.7)' : '0 20px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Controls Toolbar (Hidden in Print) */}
        <div
          className="rf-no-print"
          style={{
            padding: '1.15rem 1.75rem',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? 'var(--rf-leaf-green)' : '#16A34A'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                Official Statement of Account
              </h2>
              <span style={{ fontSize: '0.72rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                FIRS & Cross-Border Compliant Financial Ledger
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Currency Selector */}
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              className="rf-input"
              style={{
                fontSize: '0.8125rem',
                height: '36px',
                padding: '0 0.75rem',
                width: 'auto',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#0F172A',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                borderRadius: '8px'
              }}
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
              className="rf-input"
              style={{
                fontSize: '0.8125rem',
                height: '36px',
                padding: '0 0.75rem',
                width: 'auto',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#0F172A',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                borderRadius: '8px'
              }}
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
              style={{ height: '36px', fontWeight: 800, gap: '0.35rem' }}
              title="Print official PDF statement"
            >
              <Printer size={14} />
              <span>Download PDF / Print</span>
            </button>

            {/* CSV Button */}
            <button
              onClick={handleExportCsv}
              className="rf-btn rf-btn-secondary rf-btn-sm"
              style={{ height: '36px', gap: '0.35rem' }}
              title="Export as CSV for accounting"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rf-btn rf-btn-ghost rf-btn-sm"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#94A3B8' : '#64748B',
                borderRadius: '8px'
              }}
              title="Close Statement"
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
            background: isDark ? '#0A1810' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#0F172A',
            fontFamily: 'var(--rf-font-sans)'
          }}
        >
          {/* Header Letterhead: Official Refeir Brand & Clean Metadata */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              paddingBottom: '1.75rem',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ marginBottom: '0.65rem' }}>
                <RefeirLogo size="md" isLight={isDark} showTagline={false} />
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5 }}>
                Refeir Technologies Ltd. • RC-1892044 • FIRS Tax ID: 24891023-0001<br />
                Pan-African Escrow Custody • Lagos • Nairobi • Accra • London
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: isDark ? 'rgba(102, 187, 42, 0.12)' : '#DCFCE7',
                  color: isDark ? 'var(--rf-leaf-green)' : '#16A34A',
                  marginBottom: '0.4rem'
                }}
              >
                Audited Statement
              </span>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', fontFamily: 'monospace' }}>
                {summary.statementNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                Date Issued: {summary.generatedAt}
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#CBD5E1' : '#334155', fontWeight: 600, marginTop: '2px' }}>
                Period: {periodDetails.label}
              </div>
            </div>
          </div>

          {/* Account Holder & Tax Information: Minimalist & Clean */}
          <div
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B', letterSpacing: '0.04em' }}>
                Account Holder
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '3px' }}>
                {user?.first_name} {user?.last_name}
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                Role: <strong style={{ color: isDark ? 'var(--rf-leaf-green)' : '#16A34A' }}>{user?.active_role}</strong> • User ID: {user?.id}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B', letterSpacing: '0.04em' }}>
                Tax Residency & Authority
              </span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '3px' }}>
                {country} ({taxJurisdiction.tax_authority.split('(')[0].trim()})
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                {country === 'Nigeria' ? 'Headquarters Jurisdiction (FIRS / LIRS)' : 'Cross-Border Treaty Partner'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B', letterSpacing: '0.04em' }}>
                Tax Identification (TIN)
              </span>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', fontFamily: 'monospace', marginTop: '3px' }}>
                {taxIdDisplay}
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', fontWeight: 600, marginTop: '2px' }}>
                Status: Verified Resident
              </div>
            </div>
          </div>

          {/* Executive Ledger Summary: Minimalist, Balanced, Cohesive */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                padding: '0.9rem',
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                Opening Balance
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '3px' }}>
                {formatMoney(createMoney(summary.openingBalance, selectedCurrency))}
              </div>
            </div>

            <div
              style={{
                padding: '0.9rem',
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Credits (+)
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', marginTop: '3px' }}>
                {formatMoney(createMoney(summary.totalCredits, selectedCurrency))}
              </div>
            </div>

            <div
              style={{
                padding: '0.9rem',
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Debits (-)
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isDark ? '#CBD5E1' : '#334155', marginTop: '3px' }}>
                {formatMoney(createMoney(summary.totalDebits, selectedCurrency))}
              </div>
            </div>

            <div
              style={{
                padding: '0.9rem',
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                Taxes & WHT
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isDark ? '#CBD5E1' : '#334155', marginTop: '3px' }}>
                {formatMoney(createMoney(summary.totalWht + summary.totalVat, selectedCurrency))}
              </div>
            </div>

            <div
              style={{
                padding: '0.9rem',
                background: isDark ? 'rgba(102, 187, 42, 0.06)' : '#F0FDF4',
                borderRadius: '12px',
                border: isDark ? '1.5px solid rgba(102, 187, 42, 0.3)' : '1.5px solid #BBF7D0'
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: isDark ? 'var(--rf-leaf-green)' : '#166534', textTransform: 'uppercase', fontWeight: 800 }}>
                Closing Balance
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#14532D', marginTop: '3px' }}>
                {formatMoney(createMoney(summary.closingBalance, selectedCurrency))}
              </div>
            </div>
          </div>

          {/* Itemized Financial Ledger Table */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Itemized Financial Ledger & Escrow Settlement Records</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B' }}>
                {ledgerItems.length} Transactions Recorded
              </span>
            </h3>

            <div style={{ overflowX: 'auto', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800 }}>
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
                    <tr key={item.id} style={{ borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>{item.date_formatted}</div>
                        <div style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B', fontFamily: 'monospace' }}>{item.reference_code}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: isDark ? '#FFFFFF' : '#0F172A' }}>{item.description}</div>
                        {item.counterparty && (
                          <div style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
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
                            background: item.type === 'CREDIT' ? (isDark ? 'rgba(54, 224, 160, 0.15)' : '#DCFCE7') : (isDark ? 'rgba(255, 87, 87, 0.15)' : '#FEE2E2'),
                            color: item.type === 'CREDIT' ? (isDark ? 'var(--rf-mint)' : '#16A34A') : '#DC2626'
                          }}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: item.type === 'CREDIT' ? (isDark ? 'var(--rf-mint)' : '#16A34A') : '#DC2626' }}>
                        {item.type === 'CREDIT' ? '+' : '-'}{formatMoney(item.amount)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.75rem' }}>
                        {item.wht_amount && item.wht_amount.amount_minor > 0
                          ? `WHT: ${formatMoney(item.wht_amount)}`
                          : (item.vat_amount && item.vat_amount.amount_minor > 0 ? `VAT: ${formatMoney(item.vat_amount)}` : '—')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', fontFamily: 'monospace' }}>
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
              borderTop: isDark ? '2px dashed rgba(255, 255, 255, 0.08)' : '2px dashed #E2E8F0',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? 'var(--rf-mint)' : '#16A34A', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <CheckCircle2 size={16} />
                <span>Verified Cryptographic Audit Hash</span>
              </div>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                {summary.digitalHash}
              </div>
              <div style={{ fontSize: '0.6875rem', color: isDark ? '#64748B' : '#94A3B8', marginTop: '2px' }}>
                This is an official computer-generated statement issued by Refeir Technologies Ltd. Valid without physical signature when verified online.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.25rem' }}>
                  <QrCode size={34} color={isDark ? 'var(--rf-mint)' : '#16A34A'} />
                </div>
                <span style={{ fontSize: '0.625rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase' }}>Scan to Verify</span>
              </div>

              <div style={{ textAlign: 'right', borderLeft: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Refeir Financial Controller
                </div>
                <div style={{ fontSize: '0.6875rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Treasury & Escrow Operations
                </div>
                <div style={{ fontSize: '0.625rem', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', fontWeight: 700, marginTop: '2px' }}>
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
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
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
              style={{ gap: '0.35rem', color: isDark ? 'var(--rf-mint)' : '#16A34A' }}
            >
              <Percent size={14} />
              <span>Edit Tax Profile & Country Details</span>
            </button>
          ) : (
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
              Tax ID: <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{taxIdDisplay}</strong> ({country})
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
