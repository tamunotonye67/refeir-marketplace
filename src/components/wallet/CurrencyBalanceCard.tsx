import React from 'react';
import { WalletCurrencyBalance } from '../../types';
import { formatMoney } from '../../data/currencies';
import { ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

interface CurrencyBalanceCardProps {
  balance: WalletCurrencyBalance;
  onWithdraw: (currency: string, availableMinor: number) => void;
}

export const CurrencyBalanceCard: React.FC<CurrencyBalanceCardProps> = ({
  balance,
  onWithdraw
}) => {
  const isAvailable = balance.available_minor > 0;

  return (
    <div
      className="rf-card rf-card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--rf-navy-surface)',
        borderColor: isAvailable ? 'rgba(54, 224, 160, 0.3)' : 'var(--rf-navy-border)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="rf-badge rf-badge-blue" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
            {balance.currency} WALLET
          </span>
          {isAvailable && (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--rf-mint)' }} className="rf-pulse" />
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Available for Payout
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
            {formatMoney({ amount_minor: balance.available_minor, currency: balance.currency })}
          </div>
        </div>

        {balance.pending_minor > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              color: 'var(--rf-warning)',
              background: 'rgba(247, 144, 9, 0.1)',
              padding: '0.375rem 0.625rem',
              borderRadius: 'var(--rf-radius-sm)',
              marginBottom: '1rem'
            }}
          >
            <Clock size={13} />
            <span>
              Pending Clearance: {formatMoney({ amount_minor: balance.pending_minor, currency: balance.currency })}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => onWithdraw(balance.currency, balance.available_minor)}
        disabled={!isAvailable}
        className={`rf-btn ${isAvailable ? 'rf-btn-mint' : 'rf-btn-secondary'} rf-w-full rf-btn-sm`}
        style={{ gap: '0.375rem', marginTop: '0.5rem', opacity: isAvailable ? 1 : 0.5 }}
      >
        <span>Withdraw {balance.currency}</span>
        <ArrowUpRight size={14} />
      </button>
    </div>
  );
};
