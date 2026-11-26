import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Building,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface ConnectedAccount {
  id: string;
  user_id: string;
  account_id: string;
  contact_email: string;
  display_name?: string | null;
  country: string;
  entity_type: 'individual' | 'company';
  transfers_status: 'restricted' | 'active';
  payouts_status: 'restricted' | 'active';
  international_payouts: boolean;
  requirements_due: string[];
  liveness_owed: boolean;
}

interface TransferRecord {
  transfer_id: string;
  amount: string;
  currency: string;
  description?: string | null;
  created_at: string;
}

interface PayoutRecord {
  id: string;
  payout_id?: string | null;
  amount: string;
  currency: string;
  fee?: string | null;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'uncertain';
  failure_reason?: string | null;
  created_at: string;
}

interface PayoutDestination {
  id: string;
  type: string;
  currency: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  is_usable?: boolean;
  status?: string;
}

interface BalanceEntry {
  currency: string;
  available_balance: string;
  pending_balance: string;
}

interface BachsConnectCardProps {
  userId: string;
  userEmail: string;
  displayName: string;
  countryCode?: string;
}

export const BachsConnectCard: React.FC<BachsConnectCardProps> = ({
  userId,
  userEmail,
  displayName,
  countryCode = 'NG'
}) => {
  const { showToast } = useNotification();
  const [account, setAccount] = useState<ConnectedAccount | null>(null);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [balances, setBalances] = useState<BalanceEntry[]>([]);
  const [destinations, setDestinations] = useState<PayoutDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Destination registration form
  const [showDestForm, setShowDestForm] = useState(false);
  const [bankCode, setBankCode] = useState('058');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState(displayName);
  const [destCurrency, setDestCurrency] = useState('NGN');

  // Payout withdrawal form
  const [selectedDestId, setSelectedDestId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const loadAccountState = async (refresh = false) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/bachs/connect/accounts?user_id=${encodeURIComponent(userId)}${refresh ? '&refresh=true' : ''}`
      );
      if (res.status === 404) {
        setAccount(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || 'Unable to load Bachs Connect account.');
        setLoading(false);
        return;
      }

      const acct = data.account as ConnectedAccount;
      setAccount(acct);
      setTransfers((data.transfers || []) as TransferRecord[]);
      setPayouts((data.payouts || []) as PayoutRecord[]);

      if (acct?.account_id) {
        const [balRes, destRes] = await Promise.all([
          fetch(`/api/bachs/connect/balances?account_id=${encodeURIComponent(acct.account_id)}`),
          fetch(`/api/bachs/connect/destinations?account_id=${encodeURIComponent(acct.account_id)}`)
        ]);
        if (balRes.ok) {
          const balData = await balRes.json();
          const items = Array.isArray(balData.items) ? balData.items : Array.isArray(balData.balances) ? balData.balances : [];
          setBalances(items as BalanceEntry[]);
        }
        if (destRes.ok) {
          const destData = await destRes.json();
          const items = (Array.isArray(destData.items) ? destData.items : []) as PayoutDestination[];
          setDestinations(items);
          const usable = items.find(d => d.is_usable);
          if (usable) setSelectedDestId(usable.id);
        }
      }
    } catch {
      setErrorMsg('Network error loading Bachs Connect status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccountState(false);
  }, [userId]);

  const handleCreateAccount = async () => {
    setActionBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/bachs/connect/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contactEmail: userEmail,
          displayName,
          country: countryCode,
          entityType: 'individual'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || 'Failed to create Bachs Connect sub-account.');
        showToast('Connect Setup Error', data.message || 'Could not create sub-account.', 'ERROR');
      } else {
        setAccount(data.account as ConnectedAccount);
        showToast('Bachs Seller Account Ready', 'Sub-account created. Complete onboarding to activate payouts.', 'SUCCESS');
      }
    } catch {
      setErrorMsg('Network error creating connected account.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleLaunchOnboarding = async () => {
    if (!account) return;
    setActionBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/bachs/connect/account-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: account.account_id,
          type: account.liveness_owed ? 'liveness' : account.requirements_due.length > 0 ? 'update' : 'onboarding',
          originUrl: window.location.origin
        })
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setErrorMsg(data.message || 'Could not generate onboarding link.');
        showToast('Onboarding Link Error', data.message || 'Unable to generate link.', 'ERROR');
      } else {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setErrorMsg('Network error generating onboarding link.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setActionBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/bachs/connect/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: account.account_id,
          type: 'bank_account',
          currency: destCurrency,
          bankCode,
          accountNumber,
          accountName
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || 'Failed to register payout destination.');
        showToast('Destination Error', data.message || 'Registration failed.', 'ERROR');
      } else {
        showToast('Destination Added', 'Payout destination registered with Bachs Connect.', 'SUCCESS');
        setShowDestForm(false);
        setAccountNumber('');
        await loadAccountState(true);
      }
    } catch {
      setErrorMsg('Network error registering destination.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !selectedDestId) return;
    const major = Number(withdrawAmount);
    if (!Number.isFinite(major) || major <= 0) {
      showToast('Invalid Amount', 'Enter a positive payout amount.', 'WARNING');
      return;
    }

    setActionBusy(true);
    setErrorMsg(null);
    try {
      const dest = destinations.find(d => d.id === selectedDestId);
      const res = await fetch('/api/bachs/connect/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          accountId: account.account_id,
          destinationId: selectedDestId,
          currency: dest?.currency || 'NGN',
          amountMinor: Math.round(major * 100)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || 'Payout could not be created.');
        showToast('Payout Blocked', data.message || 'Payout failed.', 'WARNING');
      } else {
        showToast('Payout Submitted', 'Your Bachs payout is pending rail delivery.', 'SUCCESS');
        setWithdrawAmount('');
        await loadAccountState(false);
      }
    } catch {
      setErrorMsg('Network error creating payout.');
    } finally {
      setActionBusy(false);
    }
  };

  const usableDestinations = destinations.filter(d => d.is_usable);
  const canPayout = account?.payouts_status === 'active' && usableDestinations.length > 0;

  return (
    <div
      className="rf-card"
      style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        background: 'rgba(15, 23, 42, 0.72)',
        border: '1px solid rgba(56, 189, 248, 0.28)',
        borderRadius: 'var(--rf-radius-xl)',
        minWidth: 0
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.14)',
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Building size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Bachs Connect Seller Settlement & Payouts
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
              Receive marketplace project splits at settlement and withdraw directly to your verified bank or wallet.
            </div>
          </div>
        </div>

        {account && (
          <button
            type="button"
            onClick={() => void loadAccountState(true)}
            disabled={loading || actionBusy}
            className="rf-btn rf-btn-secondary rf-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} />
            <span>Refresh Status</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#FCA5A5',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)' }}>Loading Bachs Connect status...</div>
      ) : !account ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--rf-slate-300)' }}>
            Activate a Bachs recipient sub-account to receive automated destination-charge splits when client payments settle.
          </p>
          <button
            type="button"
            onClick={() => void handleCreateAccount()}
            disabled={actionBusy}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
          >
            <ShieldCheck size={15} />
            <span>{actionBusy ? 'Creating Sub-Account...' : 'Activate Bachs Seller Account'}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {/* Capabilities & Onboarding Status */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span className="rf-badge rf-badge-neutral" style={{ fontFamily: 'var(--rf-font-mono)' }}>
                {account.account_id}
              </span>
              <span className={`rf-badge ${account.transfers_status === 'active' ? 'rf-badge-success' : 'rf-badge-warning'}`}>
                Transfers: {account.transfers_status}
              </span>
              <span className={`rf-badge ${account.payouts_status === 'active' ? 'rf-badge-success' : 'rf-badge-warning'}`}>
                Payouts: {account.payouts_status}
              </span>
            </div>

            <button
              type="button"
              onClick={() => void handleLaunchOnboarding()}
              disabled={actionBusy}
              className="rf-btn rf-btn-secondary rf-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ExternalLink size={14} />
              <span>{account.payouts_status === 'active' ? 'Update Seller Details' : 'Complete Bachs Onboarding'}</span>
            </button>
          </div>

          {account.requirements_due.length > 0 && (
            <div style={{ fontSize: '0.8125rem', color: '#FCD34D' }}>
              Pending requirements: {account.requirements_due.join(', ')}
            </div>
          )}

          {/* Balances */}
          {balances.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {balances.map(b => (
                <div
                  key={b.currency}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Wallet size={13} />
                    <span>{b.currency} Bachs Balance</span>
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    {b.available_balance} {b.currency}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                    Pending settlement: {b.pending_balance} {b.currency}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Destinations & Payout Request */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                Payout Destinations ({destinations.length})
              </span>
              <button
                type="button"
                onClick={() => setShowDestForm(v => !v)}
                className="rf-btn rf-btn-secondary rf-btn-sm"
              >
                {showDestForm ? 'Cancel' : '+ Add Bank Destination'}
              </button>
            </div>

            {showDestForm && (
              <form
                onSubmit={handleAddDestination}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.625rem',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <input
                  type="text"
                  value={destCurrency}
                  onChange={e => setDestCurrency(e.target.value.toUpperCase())}
                  placeholder="Currency (e.g. NGN)"
                  style={{ fontSize: '16px', padding: '0.5rem', borderRadius: '6px' }}
                  required
                />
                <input
                  type="text"
                  value={bankCode}
                  onChange={e => setBankCode(e.target.value)}
                  placeholder="Bank Code (e.g. 058)"
                  style={{ fontSize: '16px', padding: '0.5rem', borderRadius: '6px' }}
                  required
                />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="Account Number"
                  style={{ fontSize: '16px', padding: '0.5rem', borderRadius: '6px' }}
                  required
                />
                <input
                  type="text"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  placeholder="Account Holder Name"
                  style={{ fontSize: '16px', padding: '0.5rem', borderRadius: '6px' }}
                  required
                />
                <button type="submit" disabled={actionBusy} className="rf-btn rf-btn-mint rf-btn-sm">
                  {actionBusy ? 'Saving...' : 'Save Destination'}
                </button>
              </form>
            )}

            {destinations.length > 0 && (
              <form onSubmit={handleWithdraw} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
                <select
                  value={selectedDestId}
                  onChange={e => setSelectedDestId(e.target.value)}
                  style={{ fontSize: '16px', padding: '0.5rem', borderRadius: '6px', flex: '1 1 200px', minWidth: 0 }}
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.bank_name || d.type} • {d.account_number || d.id} ({d.currency}) {d.is_usable ? '✓ Usable' : '• Pending Review'}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Amount"
                  style={{ fontSize: '16px', padding: '0.5rem', borderRadius: '6px', width: '130px', maxWidth: '100%' }}
                />
                <button
                  type="submit"
                  disabled={actionBusy || !canPayout}
                  className="rf-btn rf-btn-mint rf-btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  title={!canPayout ? 'Requires active payouts capability and a usable destination' : 'Withdraw via Bachs'}
                >
                  <ArrowUpRight size={15} />
                  <span>Withdraw via Bachs</span>
                </button>
              </form>
            )}
          </div>

          {/* Recent Transfers & Payouts */}
          {(transfers.length > 0 || payouts.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {transfers.slice(0, 3).map(t => (
                <div key={t.transfer_id} style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span>Settlement {t.amount} {t.currency}</span>
                </div>
              ))}
              {payouts.slice(0, 3).map(p => (
                <div key={p.reference} style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                  Payout {p.amount} {p.currency} • <strong>{p.status}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
