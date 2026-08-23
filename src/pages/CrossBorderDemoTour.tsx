import React, { useState } from 'react';
import { formatMoney, createMoney } from '../data/currencies';
import { CountryFlag } from '../components/common/CountryFlag';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Building,
  Lock,
  Globe2,
  Layers,
  Award,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CrossBorderDemoTourProps {
  onNavigate: (path: string) => void;
}

export const CrossBorderDemoTour: React.FC<CrossBorderDemoTourProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep === 5) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Globe2 size={14} />
          <span>INTERACTIVE PRODUCT ARCHITECTURE WALKTHROUGH</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
          The Pan-African Cross-Border Journey
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Watch how Refeir connects a Nigerian Talent, a Ghanaian Scout, and a Kenyan Client with locked commissions and protected funds.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {[1, 2, 3, 4, 5, 6].map(step => (
          <div
            key={step}
            style={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: step <= currentStep ? 'var(--rf-mint)' : 'rgba(255, 255, 255, 0.1)',
              transition: 'background-color 0.2s'
            }}
          />
        ))}
      </div>

      {/* Step Content Cards */}
      <div
        className="rf-card rf-card-glow"
        style={{
          padding: '3rem 2.5rem',
          background: 'var(--rf-navy-surface)',
          border: '1px solid rgba(54, 224, 160, 0.3)',
          marginBottom: '2rem'
        }}
      >
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div>
            <span className="rf-badge rf-badge-blue" style={{ marginBottom: '1rem' }}>
              Step 1 of 6: Talent Offer
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Amaka in Lagos Sets Up Her Marketplace Service
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Amaka"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rf-blue)' }}
              />
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Amaka Nwosu</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  <CountryFlag countryIsoOrName="Nigeria" /> • Lagos, Nigeria
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--rf-cream)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Amaka offers a full <strong>Fintech Mobile App UI/UX Design System</strong> package. She prices it at <strong>₦1,000,000</strong> and locks a generous <strong>10% Scout Referral Reward (₦100,000)</strong> to incentivize professionals across Africa to champion her work.
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '1rem' }}>
              Step 2 of 6: Scout Discovery & Lock
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Kwame in Accra Generates a Locked Referral Link
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Kwame"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rf-mint)' }}
              />
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Kwame Mensah (Verified Scout)</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  <CountryFlag countryIsoOrName="Ghana" /> • Accra, Ghana
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--rf-cream)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Kwame knows a founder in Nairobi looking for a world-class fintech designer. He clicks "Refer", generating locked link <code style={{ color: 'var(--rf-mint)', background: 'rgba(54, 224, 160, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>RF-KWAME-AMAKA</code> with a 30-day attribution lock and sends it via WhatsApp.
            </p>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div>
            <span className="rf-badge rf-badge-reward" style={{ marginBottom: '1rem' }}>
              Step 3 of 6: Client Visit & Disclosure
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              David in Nairobi Visits with Full Legal Transparency
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="David"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7DA2FF' }}
              />
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>David Kamau (CEO, SafariPay)</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  <CountryFlag countryIsoOrName="Kenya" /> • Nairobi, Kenya
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(36, 87, 255, 0.1)', border: '1px solid rgba(36, 87, 255, 0.3)', borderRadius: 'var(--rf-radius-md)', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
              ⚖️ <strong>Visitor Disclosure:</strong> "Recommended through Kwame Mensah. The Scout may receive a referral reward if you hire this professional and the project is successfully completed."
            </div>
            <p style={{ color: 'var(--rf-cream)', fontSize: '1rem', lineHeight: 1.6 }}>
              David reviews Amaka's verified Nigerian portfolio and clicks "Hire Professional".
            </p>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '1rem' }}>
              Step 4 of 6: Trust Vault Protection
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Protected Payment Funded in Milestone Custody
            </h2>
            <div style={{ background: 'var(--rf-navy-card)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--rf-cream)' }}>
                <span>Project Base Amount:</span>
                <strong>₦1,000,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--rf-cream)' }}>
                <span>5% Refeir Client Protection Fee:</span>
                <strong>₦50,000</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--rf-navy-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
                <span>David Pays:</span>
                <span>₦1,050,000</span>
              </div>
            </div>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              The funds are securely locked in the Refeir double-entry custody pool. Amaka starts designing with 100% confidence.
            </p>
          </div>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <div>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '1rem' }}>
              Step 5 of 6: Delivery & Approval
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Amaka Delivers Design Specs & David Approves
            </h2>
            <div style={{ background: 'rgba(54, 224, 160, 0.08)', border: '1px dashed rgba(54, 224, 160, 0.3)', borderRadius: 'var(--rf-radius-lg)', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <CheckCircle2 size={42} color="var(--rf-mint)" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                Milestone 1 & 2 Approved by Client in Nairobi
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '4px' }}>
                Delivered 2 days ahead of schedule!
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {currentStep === 6 && (
          <div>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '1rem' }}>
              Step 6 of 6: Multi-Country Settlement
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Settlement Engine Distributes Value Across Africa!
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--rf-navy-card)', padding: '1.25rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Amaka (Talent - Nigeria)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '4px' }}>₦900,000 Net</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)' }}>Direct to Zenith Bank Nigeria</div>
              </div>

              <div style={{ background: 'var(--rf-navy-card)', padding: '1.25rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(54, 224, 160, 0.4)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', textTransform: 'uppercase', fontWeight: 700 }}>Kwame (Scout - Ghana)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '4px' }}>₦100,000 Commission</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)' }}>Withdrawn to MTN Mobile Money Ghana</div>
              </div>

              <div style={{ background: 'var(--rf-navy-card)', padding: '1.25rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Refeir Platform</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7DA2FF', marginTop: '4px' }}>₦50,000 Protection Fee</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)' }}>Platform revenue</div>
              </div>
            </div>

            <p style={{ color: 'var(--rf-cream)', fontSize: '0.9375rem', textAlign: 'center' }}>
              Every participant achieved their goal with zero friction, locked trust, and pan-African settlement.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="rf-btn rf-btn-secondary"
          style={{ opacity: currentStep === 1 ? 0.4 : 1 }}
        >
          <ArrowLeft size={16} />
          <span>Previous Step</span>
        </button>

        {currentStep < 6 ? (
          <button
            onClick={handleNextStep}
            className="rf-btn rf-btn-primary rf-btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <span>Next Step ({currentStep + 1}/6)</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/marketplace')}
            className="rf-btn rf-btn-mint rf-btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <span>Explore Refeir Marketplace Now</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
