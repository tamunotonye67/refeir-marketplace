import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import {
  MessageSquare,
  Send,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Ban,
  CheckCircle2,
  X,
  Info,
  DollarSign,
  Briefcase,
  Users,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Message {
  sender: string;
  text: string;
  time: string;
  systemWarning?: boolean;
}

interface Thread {
  id: string;
  name: string;
  avatar: string;
  role: string;
  category: 'NEGOTIATION' | 'CLIENT' | 'ADMIN';
  country: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

// Advanced Real-Time DLP Pattern Checkers
const PROHIBITED_PATTERNS = {
  // URLs, Links, Domains
  links: /(https?:\/\/|www\.|ftp:\/\/|[a-z0-9-]+\.(com|org|net|io|co|ng|ke|gh|za|me|tech|app|xyz|site|online|link|ai|info|biz|tv|cc|to|ly|gg|top))\b/i,
  // Phone numbers (African formats e.g. Nigeria +234/080, Kenya +254/07, Ghana +233, South Africa +27, Rwanda +250, Egypt +20, and general international)
  phone: /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b|\b0[789][01]\d{8}\b|\b(\+?234|\+?254|\+?233|\+?27|\+?20|\+?250)\d{7,10}\b|\b(\d[\s-.]*){9,13}\b/,
  // Chatting outside Refeir & off-platform channels
  outsideChat: /\b(chat\s*on|talk\s*on|message\s*on|reach\s*on|whatsapp|telegram|wa\.me|t\.me|discord|skype|zoom|calendly|google\s*meet|teams|slack|instagram|twitter|facebook|linkedin|snapchat|tiktok|viber|signal|wechat|phone\s*number|call\s*me|text\s*me|dm\s*me|reach\s*me\s*at|my\s*number|my\s*phone|contact\s*me\s*at|pay\s*me\s*direct|outside\s*refeir|off\s*platform|take\s*this\s*to|hop\s*on\s*a\s*call|let's\s*chat\s*on|let's\s*talk\s*on|let's\s*meet\s*on)\b/i,
  // Email addresses
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i
};

export const detectProhibitedContent = (text: string): { isProhibited: boolean; reason: string | null; matchedType: 'link' | 'phone' | 'outsideChat' | 'email' | null } => {
  if (PROHIBITED_PATTERNS.outsideChat.test(text)) {
    return { isProhibited: true, reason: 'Chatting outside of Refeir or soliciting external messaging channels (WhatsApp, Telegram, Zoom, etc.) is strictly prohibited.', matchedType: 'outsideChat' };
  }
  if (PROHIBITED_PATTERNS.links.test(text)) {
    return { isProhibited: true, reason: 'Sharing external website links, URLs, or domain references is prohibited.', matchedType: 'link' };
  }
  if (PROHIBITED_PATTERNS.phone.test(text)) {
    return { isProhibited: true, reason: 'Sharing phone numbers or numerical contact sequences is strictly prohibited.', matchedType: 'phone' };
  }
  if (PROHIBITED_PATTERNS.email.test(text)) {
    return { isProhibited: true, reason: 'Sharing direct personal or business email addresses is prohibited.', matchedType: 'email' };
  }
  return { isProhibited: false, reason: null, matchedType: null };
};

interface MessagesPageProps {
  initialThreadId?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ initialThreadId }) => {
  const { currentUser } = useAuth();
  const { markChatAsRead } = useNotification();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isNoticeExpanded, setIsNoticeExpanded] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(() => {
    if (initialThreadId) return initialThreadId;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('thread') || 't1';
    } catch {
      return 't1';
    }
  });
  const [inputText, setInputText] = useState('');
  const [showBanWarningModal, setShowBanWarningModal] = useState(false);
  const [violationDetail, setViolationDetail] = useState<{ reason: string; text: string } | null>(null);

  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 't1',
      name: 'David Kamau (SafariPay)',
      avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=150&auto=format&fit=crop&q=80',
      role: 'Client (Enterprise FinTech)',
      category: 'CLIENT',
      country: 'Kenya',
      lastMessage: 'The escrow milestone of $3,400 has been funded. Wireframes look fantastic!',
      time: '10:42 AM',
      unread: 0,
      messages: [
        { sender: 'David Kamau', text: 'Hi! Reached out through Kwame’s scout referral link regarding our Nairobi mobile wallet architecture.', time: '10:15 AM' },
        { sender: 'You', text: 'Great to connect David! I will prepare the Figma component library and API swagger schemas inside Refeir workspace.', time: '10:20 AM' },
        { sender: 'David Kamau', text: 'The escrow milestone of $3,400 has been funded. Wireframes look fantastic!', time: '10:42 AM' }
      ]
    },
    {
      id: 't2',
      name: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&auto=format&fit=crop&q=80',
      role: 'Top-Tier Scout Referrer',
      category: 'NEGOTIATION',
      country: 'Egypt',
      lastMessage: 'Proposed 12% scout referral split for the upcoming Cairo logistics contract.',
      time: 'Yesterday',
      unread: 1,
      messages: [
        { sender: 'Tariq Al-Mansoor', text: 'Salam! I have a high-value logistics client in Cairo needing smart contracts. Would you agree to a 12% scout split on all milestone releases?', time: 'Yesterday' },
        { sender: 'You', text: 'Yes, 12% is completely fair for such a verified enterprise lead. Let us lock the terms via Refeir.', time: 'Yesterday' }
      ]
    },
    {
      id: 't3',
      name: 'Refeir Sovereign Arbitration Desk',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Platform Security & Trust Tribunal',
      category: 'ADMIN',
      country: 'Pan-African Sovereign Vault',
      lastMessage: 'Your 4-factor biometric audit has been verified and registered on the trust rail.',
      time: '2 days ago',
      unread: 0,
      messages: [
        { sender: 'Refeir Trust Desk', text: 'Welcome to Refeir Sovereign Communications. All conversations are protected under cryptographic escrow with real-time Anti-Disintermediation monitoring.', time: '2 days ago' },
        { sender: 'Refeir Trust Desk', text: 'Your 4-factor biometric audit has been verified and registered on the trust rail.', time: '2 days ago' }
      ]
    }
  ]);

  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const currentValidation = detectProhibitedContent(inputText);
  const totalUnreadCount = threads.reduce((acc, t) => acc + t.unread, 0);

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setShowMobileChat(true);
    setThreads(prev =>
      prev.map(t => (t.id === threadId ? { ...t, unread: 0 } : t))
    );
    if (threadId === 't2') markChatAsRead('chat-1');
    if (threadId === 't1') markChatAsRead('chat-2');
    if (threadId === 't3') markChatAsRead('chat-3');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Run strict DLP scan
    const check = detectProhibitedContent(inputText);
    if (check.isProhibited) {
      setViolationDetail({
        reason: check.reason || 'Prohibited contact exchange attempt',
        text: inputText
      });
      setShowBanWarningModal(true);
      return;
    }

    setThreads(prev =>
      prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: inputText,
            time: 'Just now',
            messages: [...t.messages, { sender: 'You', text: inputText, time: 'Just now' }]
          };
        }
        return t;
      })
    );
    setInputText('');
  };

  return (
    <div
      style={{
        backgroundColor: isDark ? 'var(--rf-bg-base)' : '#FFFFFF',
        minHeight: '85vh',
        width: '100%',
        color: isDark ? '#FFFFFF' : '#122B1A'
      }}
    >
      <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        {/* Page Title & Trust Notice */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MessageSquare size={26} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
              <span>Direct Inbox & Sovereign Negotiations</span>
            </h1>
            <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Encrypted negotiation rails for Scouts, Talents, and Clients with automated Payment Escrow protection.
            </p>
          </div>

          {/* Anti-Circumvention Policy Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid #FECACA',
              padding: '0.35rem 0.85rem',
              borderRadius: '100px',
              color: isDark ? '#FCA5A5' : '#DC2626',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <Ban size={14} />
            <span>Anti-Disintermediation Active</span>
          </div>
        </div>

        {/* Collapsible Sovereign Policy Notice */}
        <div
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FECACA',
            borderRadius: 'var(--rf-radius-lg)',
            marginBottom: '1.25rem',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
          }}
        >
          {/* Header Bar / Summary (Always Visible) */}
          <div
            onClick={() => setIsNoticeExpanded(prev => !prev)}
            style={{
              padding: '0.75rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldAlert size={16} color={isDark ? '#F87171' : '#DC2626'} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    color: isDark ? '#FCA5A5' : '#991B1B',
                    letterSpacing: '0.01em'
                  }}
                >
                  Strict Policy: Keep all negotiations & contacts on Refeir
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: isDark ? '#94A3B8' : '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Sharing off-platform links, WhatsApp, Telegram, or personal contact info is prohibited.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsNoticeExpanded(prev => !prev);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FCA5A5',
                borderRadius: '100px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isDark ? '#FCA5A5' : '#B91C1C',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <span>{isNoticeExpanded ? 'Hide Details' : 'View Policy'}</span>
              {isNoticeExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Expandable Details */}
          {isNoticeExpanded && (
            <div
              style={{
                padding: '0.75rem 1.15rem 1rem 1.15rem',
                borderTop: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #FEE2E2',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.85rem',
                background: isDark ? 'rgba(0, 0, 0, 0.15)' : '#FFF5F5'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Ban size={15} color={isDark ? '#F87171' : '#DC2626'} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.75rem', color: isDark ? '#E2E8F0' : '#334155', lineHeight: 1.45 }}>
                  <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>No External Channels:</strong> WhatsApp, Telegram, Zoom, and phone/email sharing are blocked by real-time DLP filters.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Lock size={15} color={isDark ? 'var(--rf-leaf-green)' : '#16A34A'} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.75rem', color: isDark ? '#E2E8F0' : '#334155', lineHeight: 1.45 }}>
                  <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>Escrow Guaranteed:</strong> Payment disputes and milestone funds are protected only for transactions negotiated in this inbox.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <ShieldAlert size={15} color={isDark ? '#F87171' : '#DC2626'} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.75rem', color: isDark ? '#E2E8F0' : '#334155', lineHeight: 1.45 }}>
                  <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>Strict Sanction:</strong> Circumventing platform rails results in permanent account suspension and commission forfeiture.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Messenger Box */}
        <div
          className={`rf-card rf-messages-card ${showMobileChat ? 'show-chat' : ''}`}
          style={{
            padding: 0,
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            height: '660px',
            overflow: 'hidden',
            backgroundColor: isDark ? '#08170E' : '#FFFFFF',
            border: isDark ? '1px solid rgba(102, 187, 42, 0.2)' : '1px solid rgba(18, 43, 26, 0.12)',
            boxShadow: isDark ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.05)',
            borderRadius: 'var(--rf-radius-xl)'
          }}
        >
          {/* Left Threads Column */}
          <div
            className="rf-messages-threads-col"
            style={{
              borderRight: isDark ? '1px solid rgba(102, 187, 42, 0.15)' : '1px solid rgba(18, 43, 26, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#F8FAF9'
            }}
          >
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderBottom: isDark ? '1px solid rgba(102, 187, 42, 0.15)' : '1px solid rgba(18, 43, 26, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                backgroundColor: isDark ? 'rgba(102, 187, 42, 0.06)' : '#F0FDF4'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: isDark ? 'var(--rf-leaf-green)' : '#166534',
                  letterSpacing: '0.04em'
                }}
              >
                Negotiations
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {totalUnreadCount > 0 && (
                  <button
                    onClick={() => {
                      setThreads(prev => prev.map(t => ({ ...t, unread: 0 })));
                    }}
                    style={{
                      background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7',
                      border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid #86EFAC',
                      color: isDark ? 'var(--rf-leaf-green)' : '#15803D',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '100px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Mark all as Read
                  </button>
                )}
                <span
                  className="rf-badge rf-badge-mint rf-text-xs"
                  style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}
                >
                  {totalUnreadCount > 0 ? `${totalUnreadCount} Unread` : 'All Read'}
                </span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {threads.map(t => {
                const isSelected = t.id === activeThreadId;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectThread(t.id)}
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      backgroundColor: isSelected
                        ? (isDark ? 'rgba(102, 187, 42, 0.15)' : '#EBF7EE')
                        : t.unread > 0
                          ? (isDark ? 'rgba(102, 187, 42, 0.06)' : 'rgba(46, 125, 50, 0.04)')
                          : (isDark ? 'transparent' : '#FFFFFF'),
                      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(18, 43, 26, 0.06)',
                      borderLeft: isSelected
                        ? (isDark ? '3px solid var(--rf-leaf-green)' : '3px solid #16A34A')
                        : '3px solid transparent',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={t.avatar}
                        alt={t.name}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: t.unread > 0
                            ? '2px solid #16A34A'
                            : (isDark ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid rgba(18, 43, 26, 0.12)')
                        }}
                      />
                      {t.unread > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            minWidth: '16px',
                            height: '16px',
                            padding: '0 3px',
                            borderRadius: '50%',
                            background: '#16A34A',
                            color: '#FFFFFF',
                            fontSize: '0.625rem',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 8px rgba(22, 163, 74, 0.4)'
                          }}
                        >
                          {t.unread}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: t.unread > 0 ? 800 : 700,
                            color: isDark ? '#FFFFFF' : '#0F172A'
                          }}
                        >
                          {t.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            color: t.unread > 0 ? (isDark ? 'var(--rf-leaf-green)' : '#15803D') : '#64748B',
                            fontWeight: t.unread > 0 ? 700 : 500
                          }}
                        >
                          {t.time}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.71875rem', color: isDark ? 'var(--rf-leaf-green)' : '#15803D', fontWeight: 700 }}>
                        {t.role}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78125rem',
                          color: t.unread > 0 ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#94A3B8' : '#475569'),
                          fontWeight: t.unread > 0 ? 600 : 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px'
                        }}
                      >
                        {t.lastMessage}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Active Message Box */}
          <div
            className="rf-messages-chat-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              backgroundColor: isDark ? '#0A170F' : '#FFFFFF'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: isDark ? '1px solid rgba(102, 187, 42, 0.15)' : '1px solid rgba(18, 43, 26, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  className="rf-messages-mobile-back"
                  onClick={() => setShowMobileChat(false)}
                  aria-label="Back to Negotiations"
                  style={{
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                    border: isDark ? '1px solid var(--rf-navy-border)' : '1px solid #CBD5E1',
                    color: isDark ? 'var(--rf-mint)' : '#166534',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '0.3rem 0.55rem',
                    borderRadius: 'var(--rf-radius-sm)',
                    marginRight: '0.25rem'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Inbox</span>
                </button>
                <img
                  src={activeThread.avatar}
                  alt={activeThread.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #16A34A',
                    flexShrink: 0
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                    {activeThread.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {activeThread.role} • {activeThread.country}
                  </div>
                </div>
              </div>

              {/* Escrow Protected Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: isDark ? 'var(--rf-leaf-green)' : '#16A34A',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                <Lock size={14} />
                <span>Escrow Protected & Monitored</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: isDark ? '#0A170F' : '#FFFFFF'
              }}
            >
              {/* System Security Notice In-Chat */}
              <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '100px',
                    fontSize: '0.71875rem',
                    color: isDark ? '#94A3B8' : '#475569'
                  }}
                >
                  <Lock size={12} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
                  <span>Encrypted negotiation protocol • All escrow milestone releases logged.</span>
                </div>
              </div>

              {activeThread.messages.map((msg, i) => {
                const isMe = msg.sender === 'You';
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '72%',
                      backgroundColor: isMe
                        ? (isDark ? 'var(--rf-leaf-green)' : '#16A34A')
                        : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9'),
                      color: isMe
                        ? '#FFFFFF'
                        : (isDark ? '#FFFFFF' : '#0F172A'),
                      fontWeight: isMe ? 500 : 400,
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--rf-radius-lg)',
                      border: isMe
                        ? 'none'
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      boxShadow: isMe ? '0 2px 8px rgba(22, 163, 74, 0.25)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', lineHeight: 1.45 }}>{msg.text}</div>
                    <div
                      style={{
                        fontSize: '0.625rem',
                        color: isMe ? 'rgba(255, 255, 255, 0.85)' : (isDark ? '#94A3B8' : '#64748B'),
                        textAlign: 'right',
                        marginTop: '4px',
                        fontWeight: 600
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-Time Violation Alert Bar */}
            {currentValidation.isProhibited && (
              <div
                style={{
                  padding: '0.5rem 1.5rem',
                  background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
                  borderTop: '1px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: isDark ? '#FCA5A5' : '#B91C1C',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0 }} />
                <span>{currentValidation.reason} Sending this will block your message.</span>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '1rem 1.5rem',
                borderTop: isDark ? '1px solid rgba(102, 187, 42, 0.15)' : '1px solid rgba(18, 43, 26, 0.08)',
                display: 'flex',
                gap: '0.75rem',
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                position: 'relative'
              }}
            >
              <input
                type="text"
                className="rf-input"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Message ${activeThread.name}...`}
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAF9',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  border: currentValidation.isProhibited
                    ? '1.5px solid #EF4444'
                    : (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 43, 26, 0.15)'),
                  boxShadow: currentValidation.isProhibited ? '0 0 10px rgba(239, 68, 68, 0.4)' : undefined
                }}
              />
              <button
                type="submit"
                className={`rf-btn ${currentValidation.isProhibited ? 'rf-btn-secondary' : 'rf-btn-primary'}`}
                style={{
                  background: currentValidation.isProhibited ? 'rgba(239, 68, 68, 0.2)' : undefined,
                  borderColor: currentValidation.isProhibited ? '#EF4444' : undefined,
                  color: currentValidation.isProhibited ? '#F87171' : undefined
                }}
                title={currentValidation.isProhibited ? 'Prohibited content detected' : 'Send message'}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* --- SEVERE VIOLATION BAN & FORFEITURE MODAL --- */}
        {showBanWarningModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}
            onClick={() => setShowBanWarningModal(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                background: isDark ? '#0B1A12' : '#FFFFFF',
                border: '2px solid #EF4444',
                borderRadius: 'var(--rf-radius-xl)',
                boxShadow: '0 25px 60px rgba(239, 68, 68, 0.35)',
                padding: '2rem',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowBanWarningModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: isDark ? 'var(--rf-slate-400)' : '#64748B',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                    border: '2px solid #EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <Ban size={32} color="#EF4444" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626', letterSpacing: '-0.02em' }}>
                  SECURITY VIOLATION BLOCKED
                </h2>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '0.25rem' }}>
                  Chatting Outside Refeir & Contact Sharing is Strictly Prohibited
                </div>
              </div>

              <div style={{ background: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--rf-radius-lg)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#DC2626', marginBottom: '0.35rem' }}>
                  Reason for Block:
                </div>
                <div style={{ fontSize: '0.8125rem', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.4 }}>
                  {violationDetail?.reason}
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: isDark ? 'rgba(0,0,0,0.4)' : '#FFFFFF', border: isDark ? 'none' : '1px solid #FECACA', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--rf-font-mono)', color: '#DC2626' }}>
                  Blocked Snippet: "{violationDetail?.text}"
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <ShieldAlert size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8125rem', color: isDark ? 'var(--rf-slate-300)' : '#475569', lineHeight: 1.4 }}>
                    <strong style={{ color: isDark ? '#FCA5A5' : '#B91C1C' }}>Permanent Account Ban:</strong> Chatting outside Refeir or sharing external contacts will result in immediate permanent account termination.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <DollarSign size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8125rem', color: isDark ? 'var(--rf-slate-300)' : '#475569', lineHeight: 1.4 }}>
                    <strong style={{ color: isDark ? '#FCA5A5' : '#B91C1C' }}>Escrow & Commission Forfeiture:</strong> Violating parties forfeit all wallet balances and pending referral commissions.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <Lock size={18} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8125rem', color: isDark ? 'var(--rf-slate-300)' : '#475569', lineHeight: 1.4 }}>
                    <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>Protected Messaging:</strong> Keep all discussions inside Refeir to maintain escrow and dispute protection.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowBanWarningModal(false)}
                  className="rf-btn rf-btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontWeight: 800 }}
                >
                  I Understand & Agree to Chat Only Inside Refeir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
