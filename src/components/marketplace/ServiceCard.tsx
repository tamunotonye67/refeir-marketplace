import React from 'react';
import { Service } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CountryFlag } from '../common/CountryFlag';
import { formatCompactMoney } from '../../data/currencies';
import { Sparkles, Clock, RefreshCw, Star, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  onRefer: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onRefer
}) => {
  const { currentUser } = useAuth();
  const activeRole = currentUser?.active_role;

  return (
    <div className="rf-card rf-card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      {/* Service Cover Image */}
      <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
        <img
          src={service.image_url}
          alt={service.title}
          className="rf-service-cover-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Ribbon Tag */}
        {activeRole === 'CLIENT' ? (
          <div className="rf-animated-sparkle-badge" style={{ background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.9), rgba(54, 224, 160, 0.9))' }}>
            <div className="rf-sparkle-icon-anchor">
              <span className="rf-animated-sparkle-icon">
                <ShieldCheck size={13} />
              </span>
            </div>
            <div className="rf-sparkle-text-viewport">
              <span className="rf-sparkle-sliding-text">
                0% ESCROW FEE • PROTECTED DELIVERY
              </span>
            </div>
          </div>
        ) : (
          <div className="rf-animated-sparkle-badge">
            <div className="rf-sparkle-icon-anchor">
              <span className="rf-animated-sparkle-icon">
                <Sparkles size={13} />
              </span>
            </div>
            <div className="rf-sparkle-text-viewport">
              <span className="rf-sparkle-sliding-text">
                {service.referral_percentage}% REFERRAL REWARD
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Talent info line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
          <img
            src={service.talent_avatar}
            alt={service.talent_name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
              {service.talent_name}
            </span>
            <CountryFlag countryIsoOrName={service.talent_country} />
          </div>
        </div>

        {/* Title */}
        <h4
          onClick={() => onSelect(service)}
          style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--rf-cream)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {service.title}
        </h4>

        {/* Meta badges: Delivery & Revisions */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginBottom: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={13} /> {service.delivery_days} days delivery
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <RefreshCw size={13} /> {service.revisions} revisions
          </span>
        </div>

        {/* Bottom Bar: Price & Buttons */}
        <div
          style={{
            borderTop: '1px solid var(--rf-navy-border)',
            paddingTop: '1rem',
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>
              Service Fee
            </span>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', whiteSpace: 'nowrap' }}>
              {formatCompactMoney(service.price)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {activeRole === 'CLIENT' ? (
              /* CLIENT MODE: Only Order Service button, NO Refer button */
              <button
                onClick={() => onSelect(service)}
                className="rf-btn rf-btn-primary rf-btn-sm"
                style={{ fontWeight: 800, padding: '0.4rem 0.85rem', gap: '0.35rem' }}
                title="Order service with 100% Trust Vault protection"
              >
                <ShoppingBag size={13} />
                <span>Order Service</span>
              </button>
            ) : activeRole === 'SCOUT' ? (
              /* SCOUT MODE: Refer button & Details, NO direct Order/Hire */
              <>
                <button
                  onClick={() => onRefer(service)}
                  className="rf-btn rf-btn-mint rf-btn-sm"
                  style={{ fontWeight: 800, gap: '0.3rem' }}
                  title="Refer this service to clients"
                >
                  <Sparkles size={12} />
                  <span>Refer ({service.referral_percentage}%)</span>
                </button>
                <button
                  onClick={() => onSelect(service)}
                  className="rf-btn rf-btn-secondary rf-btn-sm"
                >
                  <span>Details</span>
                </button>
              </>
            ) : activeRole === 'TALENT' ? (
              /* TALENT MODE: Peer service view */
              <button
                onClick={() => onSelect(service)}
                className="rf-btn rf-btn-secondary rf-btn-sm"
                style={{ fontWeight: 700 }}
              >
                <span>View Service</span>
              </button>
            ) : (
              /* GUEST MODE: Both options available */
              <>
                <button
                  onClick={() => onRefer(service)}
                  className="rf-btn rf-btn-mint rf-btn-sm"
                >
                  <span>Refer</span>
                </button>
                <button
                  onClick={() => onSelect(service)}
                  className="rf-btn rf-btn-secondary rf-btn-sm"
                >
                  <span>Order</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
