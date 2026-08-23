import React from 'react';
import { UserRole } from '../../types';
import {
  Briefcase,
  Code2,
  Building2,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface ProfileSwitchGateProps {
  targetRole: 'SCOUT' | 'TALENT' | 'CLIENT' | 'ADMIN';
  currentRole: UserRole;
  onNavigate: (path: string) => void;
  onSwitch: () => void;
}

export const ProfileSwitchGate: React.FC<ProfileSwitchGateProps> = ({
  targetRole,
  currentRole,
  onNavigate,
  onSwitch
}) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'SCOUT':
        return {
          title: 'Scout Profile',
          desc: '10% Guaranteed locked referral rewards, scout matchmaking, and talent pipeline management.',
          color: '#66BB2A',
          bgColor: 'rgba(102, 187, 42, 0.12)',
          icon: Briefcase,
          dashboardPath: '/dashboard/scout'
        };
      case 'TALENT':
        return {
          title: 'Talent Profile',
          desc: 'Pan-African service listings, milestone contracts, deliverable submissions, and talent earnings.',
          color: '#F4B942',
          bgColor: 'rgba(244, 185, 66, 0.12)',
          icon: Code2,
          dashboardPath: '/dashboard/talent'
        };
      case 'CLIENT':
        return {
          title: 'Client Profile',
          desc: 'Direct talent hiring, project milestone management, job posting, and Trust Vault escrow deposits.',
          color: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.12)',
          icon: Building2,
          dashboardPath: '/dashboard/client'
        };
      case 'ADMIN':
        return {
          title: 'Administrator Console',
          desc: 'Pan-African telemetry, platform analytics, dispute arbitration, and user KYC verification.',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.12)',
          icon: ShieldAlert,
          dashboardPath: '/admin-portal'
        };
      default:
        return {
          title: 'Member Profile',
          desc: 'Refeir ecosystem access and marketplace browsing.',
          color: '#66BB2A',
          bgColor: 'rgba(102, 187, 42, 0.12)',
          icon: Briefcase,
          dashboardPath: '/marketplace'
        };
    }
  };

  const targetConfig = getRoleConfig(targetRole);
  const currentConfig = getRoleConfig(currentRole);
  const TargetIcon = targetConfig.icon;
  const CurrentIcon = currentConfig.icon;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--rf-header-height, 72px) - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--rf-bg-base)'
      }}
    >
      <div
        style={{
          maxWidth: '580px',
          width: '100%',
          background: 'var(--rf-bg-surface)',
          border: '1px solid var(--rf-bg-card-border)',
          borderRadius: '24px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: targetConfig.bgColor,
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Badges: Current vs Required */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: currentConfig.bgColor,
              border: `1px solid ${currentConfig.color}40`,
              color: currentConfig.color,
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            <CurrentIcon size={13} />
            <span>Active: {currentRole} Profile</span>
          </div>

          <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.85rem' }}>→</span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: targetConfig.bgColor,
              border: `1px solid ${targetConfig.color}40`,
              color: targetConfig.color,
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            <TargetIcon size={13} />
            <span>Required: {targetRole} Profile</span>
          </div>
        </div>

        {/* Center Target Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: targetConfig.bgColor,
            color: targetConfig.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: `2px solid ${targetConfig.color}40`,
            boxShadow: `0 8px 24px ${targetConfig.color}25`
          }}
        >
          <TargetIcon size={36} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 1.85rem)',
            fontWeight: 800,
            color: 'var(--rf-cream)',
            marginBottom: '0.75rem',
            lineHeight: 1.25
          }}
        >
          Switch to {targetConfig.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--rf-slate-300)',
            lineHeight: 1.55,
            marginBottom: '1.75rem'
          }}
        >
          You are currently signed in under your <strong>{currentRole} Profile</strong>. Under Refeir's strict single-profile policy, you must switch your active profile to access <strong>{targetConfig.title}</strong> tools and features.
        </p>

        {/* Feature Preview Card */}
        <div
          style={{
            background: 'var(--rf-bg-base)',
            border: '1px solid var(--rf-bg-card-border)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}
        >
          <CheckCircle2 size={18} color={targetConfig.color} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.2rem' }}>
              What unlocks in {targetConfig.title}:
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)', lineHeight: 1.45 }}>
              {targetConfig.desc}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onSwitch}
            className="rf-btn rf-btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: 800,
              gap: '0.5rem',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(102, 187, 42, 0.3)'
            }}
          >
            <RefreshCw size={17} />
            <span>Switch to {targetRole} Profile Now</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => onNavigate(currentConfig.dashboardPath)}
            className="rf-btn rf-btn-secondary"
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              justifyContent: 'center'
            }}
          >
            <span>Return to My {currentRole} Dashboard</span>
          </button>
        </div>

        {/* Security / Rule Note */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--rf-bg-card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--rf-slate-400)'
          }}
        >
          <Lock size={12} />
          <span>Strict Role Isolation: 1 Profile Active at a Time</span>
        </div>
      </div>
    </div>
  );
};
