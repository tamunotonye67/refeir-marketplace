import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
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
  ExternalLink
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
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const currentValidation = detectProhibitedContent(inputText);
  const totalUnreadCount = threads.reduce((acc, t) => acc + t.unread, 0);

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
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
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Page Title & Trust Notice */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageSquare size={26} color="var(--rf-leaf-green)" />
            <span>Direct Inbox & Sovereign Negotiations</span>
          </h1>
          <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Encrypted negotiation rails for Scouts, Talents, and Clients with automated Payment Escrow protection.
          </p>
        </div>

        {/* Anti-Circumvention Policy Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.85rem', borderRadius: '100px', color: '#F87171', fontSize: '0.75rem', fontWeight: 700 }}>
          <Ban size={14} />
          <span>Strict Anti-Disintermediation Monitored</span>
        </div>
      </div>

      {/* Strict Policy Banner Across All Chats */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.05) 100%)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--rf-radius-lg)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={18} color="#F87171" />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FCA5A5' }}>
              STRICT NOTICE: Chatting Outside Refeir & Sharing Contacts is Prohibited
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
              Chatting outside Refeir (via WhatsApp, Telegram, Zoom, Email, or external apps) and sharing phone numbers or links between Scouts, Talents, and Clients is strictly prohibited. <strong>Violators face immediate permanent ban and complete loss/forfeiture of all wallet holdings, locked escrow, and referral commissions.</strong>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rf-card"
        style={{
          padding: 0,
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          height: '660px',
          overflow: 'hidden',
          border: '1px solid var(--rf-navy-border)'
        }}
      >
        {/* Left Threads Column */}
        <div style={{ borderRight: '1px solid var(--rf-navy-border)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '0.85rem 1.15rem', borderBottom: '1px solid var(--rf-navy-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: 'rgba(102, 187, 42, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-300)', letterSpacing: '0.04em' }}>
              Negotiations
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {totalUnreadCount > 0 && (
                <button
                  onClick={() => {
                    setThreads(prev => prev.map(t => ({ ...t, unread: 0 })));
                  }}
                  style={{
                    background: 'rgba(102, 187, 42, 0.12)',
                    border: '1px solid rgba(102, 187, 42, 0.35)',
                    color: 'var(--rf-leaf-green)',
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
            {threads.map(t => (
              <div
                key={t.id}
                onClick={() => handleSelectThread(t.id)}
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  backgroundColor: t.id === activeThreadId ? 'rgba(102, 187, 42, 0.12)' : t.unread > 0 ? 'rgba(102, 187, 42, 0.05)' : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  borderLeft: t.id === activeThreadId ? '3px solid var(--rf-leaf-green)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: t.unread > 0 ? '2px solid var(--rf-leaf-green)' : '1.5px solid var(--rf-navy-border)' }}
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
                        background: 'var(--rf-leaf-green)',
                        color: 'var(--rf-dark-green)',
                        fontSize: '0.625rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 8px rgba(102, 187, 42, 0.8)'
                      }}
                    >
                      {t.unread}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: t.unread > 0 ? 800 : 700, color: 'var(--rf-cream)' }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: t.unread > 0 ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)', fontWeight: t.unread > 0 ? 700 : 400 }}>{t.time}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{t.role}</div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: t.unread > 0 ? 'var(--rf-cream)' : 'var(--rf-slate-300)',
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
            ))}
          </div>
        </div>

        {/* Right Active Message Box */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(5, 15, 10, 0.6)' }}>
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--rf-navy-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--rf-leaf-green)' }}
              />
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  {activeThread.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                  {activeThread.role} • {activeThread.country}
                </div>
              </div>
            </div>

            {/* Escrow Protected Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 700 }}>
              <Lock size={14} />
              <span>Escrow Protected & Monitored</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* System Security Notice In-Chat */}
            <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                <Lock size={12} color="var(--rf-leaf-green)" />
                <span>Encrypted on Refeir Sovereign Protocol. External contact sharing is permanently logged and prohibited.</span>
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
                    background: isMe ? 'var(--rf-leaf-green)' : 'rgba(255, 255, 255, 0.06)',
                    color: isMe ? '#05190D' : 'var(--rf-cream)',
                    fontWeight: isMe ? 600 : 400,
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--rf-radius-lg)',
                    border: isMe ? 'none' : '1px solid var(--rf-bg-card-border)',
                    boxShadow: isMe ? '0 4px 15px rgba(102, 187, 42, 0.25)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{msg.text}</div>
                  <div style={{ fontSize: '0.625rem', color: isMe ? 'rgba(5, 25, 13, 0.75)' : 'var(--rf-slate-400)', textAlign: 'right', marginTop: '4px', fontWeight: 600 }}>
                    {msg.time}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-Time Violation Alert Bar (Shows while typing if prohibited pattern detected) */}
          {currentValidation.isProhibited && (
            <div
              style={{
                padding: '0.5rem 1.5rem',
                background: 'rgba(239, 68, 68, 0.2)',
                borderTop: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#FCA5A5',
                fontSize: '0.75rem',
                fontWeight: 700,
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <AlertTriangle size={14} color="#F87171" style={{ flexShrink: 0 }} />
              <span>{currentValidation.reason} Sending this will block your message and risk immediate account termination.</span>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--rf-navy-border)',
              display: 'flex',
              gap: '0.75rem',
              background: 'rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <input
              type="text"
              className="rf-input"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeThread.name} (Chatting outside Refeir, links & phone numbers strictly prohibited)...`}
              style={{
                borderColor: currentValidation.isProhibited ? '#EF4444' : undefined,
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
            background: 'rgba(0, 0, 0, 0.85)',
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
              background: '#0B1A12',
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
                color: 'var(--rf-slate-400)',
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
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
                }}
              >
                <Ban size={32} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F87171', letterSpacing: '-0.02em' }}>
                SECURITY VIOLATION BLOCKED
              </h2>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                Chatting Outside Refeir & Contact Sharing is Strictly Prohibited
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--rf-radius-lg)', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#F87171', marginBottom: '0.35rem' }}>
                Reason for Block:
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-cream)', lineHeight: 1.4 }}>
                {violationDetail?.reason}
              </div>
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--rf-font-mono)', color: '#FCA5A5' }}>
                Blocked Snippet: "{violationDetail?.text}"
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <ShieldAlert size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
                  <strong style={{ color: '#FCA5A5' }}>Permanent Account Ban:</strong> Chatting outside Refeir (WhatsApp, Telegram, Zoom, Email) or exchanging phone numbers/links between Scouts, Talents, and Clients will result in an immediate permanent ban.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <DollarSign size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
                  <strong style={{ color: '#FCA5A5' }}>Total Asset Forfeiture:</strong> Guilty accounts lose all wallet balances, locked escrow deposits, and pending 10% referral commissions without possibility of refund or appeal.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <Lock size={18} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--rf-cream)' }}>Safe In-Platform Messaging:</strong> Always conduct all messaging, scoping, and milestone discussions directly within Refeir's encrypted rails to protect payments and scout commissions.
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
  );
};
