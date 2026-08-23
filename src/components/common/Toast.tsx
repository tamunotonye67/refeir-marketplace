import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { activeToast, clearToast } = useNotification();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'SUCCESS':
        return <CheckCircle2 size={20} color="var(--rf-mint)" />;
      case 'ERROR':
        return <AlertCircle size={20} color="var(--rf-error)" />;
      case 'REWARD':
        return <Sparkles size={20} color="var(--rf-mint)" />;
      case 'WARNING':
        return <AlertCircle size={20} color="var(--rf-warning)" />;
      default:
        return <Info size={20} color="var(--rf-blue)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: 'var(--rf-navy-surface)',
        border: '1px solid var(--rf-navy-border)',
        borderRadius: 'var(--rf-radius-lg)',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--rf-shadow-xl)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
        maxWidth: '380px',
        animation: 'rfFadeIn 0.25s ease-out'
      }}
      role="alert"
    >
      <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--rf-white)', marginBottom: '0.25rem' }}>
          {activeToast.title}
        </h4>
        <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
          {activeToast.message}
        </p>
      </div>
      <button
        onClick={clearToast}
        style={{ color: 'var(--rf-slate-400)', padding: '2px' }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = Toast;

