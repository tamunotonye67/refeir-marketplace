import React, { useState } from 'react';
import { TalentProfile, Service, Referral } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ReferralEngine } from '../../services/referralEngine';
import { formatMoney } from '../../data/currencies';
import {
  X,
  Sparkles,
  Share2,
  Copy,
  Check,
  Lock,
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReferModalProps {
  talent: TalentProfile;
  service?: Service;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const ReferModal: React.FC<ReferModalProps> = ({
  talent,
  service,
  onClose,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const { createReferral } = useMarketplace();
  const { showToast } = useNotification();

  const [generatedReferral, setGeneratedReferral] = useState<Referral | null>(null);
  const [copied, setCopied] = useState(false);
  const [campaignTag, setCampaignTag] = useState('direct');

  const price = service ? service.price : talent.starting_price;
  const referralPct = service ? service.referral_percentage : talent.referral_percentage;
  const rewardMinor = Math.round(price.amount_minor * (referralPct / 100));
  const formattedReward = formatMoney({ amount_minor: rewardMinor, currency: price.currency });

  const handleGenerate = () => {
    const scout = {
      id: currentUser ? currentUser.id : 'user-sarah',
      name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Sarah Adeyemi'
    };

    const ref = createReferral(scout, talent, service);
    setGeneratedReferral(ref);

    // Fire celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    showToast(
      'Locked Referral Link Created!',
      `You can earn ${formattedReward} when this referral completes.`,
      'REWARD'
    );
  };

  const getShareUrl = () => {
    const origin = window.location.origin;
    const code = generatedReferral ? generatedReferral.referral_code : 'RF-DEMO';
    return `${origin}/r/${code}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    showToast('Link Copied!', 'Referral link with transparent disclosure copied to clipboard.');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    if (!generatedReferral) return;
    const msg = ReferralEngine.generateWhatsAppMessage(generatedReferral, getShareUrl());
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleWebShare = async () => {
    if (navigator.share && generatedReferral) {
      try {
        await navigator.share({
          title: `Recommend ${talent.full_name} on Refeir`,
          text: `Meet ${talent.full_name}, a verified ${talent.headline} on Refeir.`,
          url: getShareUrl()
        });
      } catch (err) {
        // user dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="rf-modal-backdrop" onClick={onClose}>
      <div
        className="rf-modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '540px', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(54, 224, 160, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} color="var(--rf-mint)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                Refer this Professional
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                Refer and Earn. Connect your network and earn.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rf-btn-ghost rf-btn-icon"
            style={{ color: 'var(--rf-slate-400)' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Talent & Service Snapshot */}
        <div
          style={{
            background: 'var(--rf-navy-surface)',
            border: '1px solid var(--rf-navy-border)',
            borderRadius: 'var(--rf-radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <img
            src={talent.avatar_url}
            alt={talent.full_name}
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                {talent.full_name}
              </h4>
              <span className="rf-badge rf-badge-mint rf-text-xs">
                {talent.country_name}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
              {service ? service.title : talent.headline}
            </p>
          </div>
        </div>

        {/* Transparent Reward Breakdown Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.08) 0%, rgba(54, 224, 160, 0.08) 100%)',
            border: '1px solid rgba(54, 224, 160, 0.3)',
            borderRadius: 'var(--rf-radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>
                Service Pricing
              </span>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '2px' }}>
                {formatMoney(price)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--rf-mint)', textTransform: 'uppercase' }}>
                Your Scout Reward ({referralPct}%)
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '2px' }}>
                {formattedReward}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--rf-slate-300)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '0.75rem'
            }}
          >
            <Lock size={14} color="var(--rf-mint)" />
            <span>
              <strong>Locked Terms:</strong> Price, {referralPct}% reward, and 30-day attribution lock permanently upon link creation.
            </span>
          </div>
        </div>

        {/* Actions State */}
        {!generatedReferral ? (
          <div>
            <div className="rf-form-group">
              <label className="rf-label" htmlFor="campaign-input">
                <span>Campaign / Source Tag (Optional)</span>
              </label>
              <input
                id="campaign-input"
                type="text"
                className="rf-input"
                placeholder="e.g. whatsapp-group, linkedin-network, slack-community"
                value={campaignTag}
                onChange={e => setCampaignTag(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="rf-btn rf-btn-mint rf-w-full rf-btn-lg"
            >
              <span>Generate Locked Referral Link</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Generated Code Display */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)', display: 'block', marginBottom: '0.5rem' }}>
                Your Unique Tracking Link
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--rf-navy-surface)',
                  border: '1px solid var(--rf-blue)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '0.5rem 0.75rem',
                  gap: '0.5rem'
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--rf-cream)',
                    fontSize: '0.875rem',
                    flex: 1,
                    outline: 'none',
                    fontFamily: 'var(--rf-font-mono)'
                  }}
                />
                <button
                  onClick={handleCopy}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{ padding: '0.375rem 0.75rem' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 1-Click WhatsApp & Social Share Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                onClick={handleWhatsApp}
                className="rf-btn"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  gap: '0.5rem',
                  boxShadow: '0 2px 10px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageCircle size={18} />
                <span>Share on WhatsApp</span>
              </button>

              <button
                onClick={handleWebShare}
                className="rf-btn rf-btn-secondary"
                style={{ gap: '0.5rem' }}
              >
                <Share2 size={16} />
                <span>More Share Options</span>
              </button>
            </div>

            {/* Legal Disclosure Reminder */}
            <div
              style={{
                background: 'rgba(11, 16, 32, 0.6)',
                borderLeft: '3px solid var(--rf-mint)',
                padding: '0.75rem 1rem',
                borderRadius: '0 var(--rf-radius-sm) var(--rf-radius-sm) 0',
                fontSize: '0.75rem',
                color: 'var(--rf-slate-300)',
                lineHeight: 1.4
              }}
            >
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} color="var(--rf-mint)" />
              <strong>Refeir Transparency:</strong> When your client opens this link, they will clearly see your Scout recommendation and transparent fee protection.
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('/dashboard/scout');
                }}
                className="rf-btn-ghost"
                style={{ fontSize: '0.8125rem', color: 'var(--rf-mint)', fontWeight: 600 }}
              >
                View in Scout Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
