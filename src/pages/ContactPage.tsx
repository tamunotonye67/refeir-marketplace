import React, { useState } from 'react';
import {
  Mail, MessageSquare, Send, CheckCircle2, MapPin, Globe2,
  ExternalLink, Phone, ArrowRight, ShieldCheck
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'PIONEER_ADMISSIONS',
    message: ''
  });

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    setFormState('submitting');

    // Simulate reliable dispatch
    await new Promise(r => setTimeout(r, 800));
    setFormState('submitted');
  };

  return (
    <div style={{ minHeight: '100vh', background: RF_DEEP_GREEN, color: '#1E293B' }}>
      {/* Header Banner */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '130px 24px 70px', position: 'relative', overflow: 'hidden', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}33`,
            padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 20
          }}>
            Connect With Refeir
          </span>

          <h1 style={{
            fontSize: 'clamp(32px, 4.8vw, 60px)', fontWeight: 500, lineHeight: 1.18,
            letterSpacing: '-0.02em', marginBottom: 20, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            We'd love to hear from<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              WebkitBoxDecorationBreak: 'clone',
              boxDecorationBreak: 'clone',
              paddingRight: '0.22em',
              paddingLeft: '0.04em'
            }}>
              builders, partners, and&nbsp;creators.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7, maxWidth: 800, margin: '0 auto'
          }}>
            Have questions about your Pioneer application, commercial partnerships, or press inquiries?<br />
            Send us a message and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info Section */}
      <section style={{ padding: '80px 24px 100px', background: '#F8FAF9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 40, alignItems: 'start'
          }}>
            {/* Left Column: Interactive Contact Form */}
            <div style={{
              background: '#FFFFFF', borderRadius: 20, padding: '40px 36px',
              border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
            }}>
              <h2 style={{
                fontSize: 24, fontWeight: 500, color: RF_DEEP_GREEN,
                fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 8
              }}>
                Send us a direct message
              </h2>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28, lineHeight: 1.6 }}>
                Fill in the form below and we'll route your inquiry to the relevant squad lead.
              </p>

              {formState === 'submitted' ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: `${RF_LEAF_GREEN}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px'
                  }}>
                    <CheckCircle2 size={32} color={RF_LEAF_GREEN} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: 8 }}>
                    Message Received!
                  </h3>
                  <p style={{ fontSize: 14.5, color: '#64748B', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 24px' }}>
                    Thank you, <strong>{formData.name}</strong>. Your message has been dispatched to our team. We typically respond within 24–48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setFormState('idle');
                      setFormData({ name: '', email: '', phone: '', category: 'PIONEER_ADMISSIONS', message: '' });
                    }}
                    style={{
                      background: '#F1F5F9', border: 'none', padding: '10px 22px', borderRadius: 100,
                      fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer'
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {errorMsg && (
                    <div style={{
                      padding: '12px 14px', borderRadius: 10, background: '#FEF2F2',
                      border: '1px solid #FECACA', color: '#991B1B', fontSize: 13.5
                    }}>
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amara Okafor"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: '1px solid #CBD5E1', fontSize: 14, outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="amara@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: 10,
                          border: '1px solid #CBD5E1', fontSize: 14, outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+234 / +254 ..."
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: 10,
                          border: '1px solid #CBD5E1', fontSize: 14, outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Inquiry Subject *
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="rp-light-select"
                      style={{
                        width: '100%', padding: '12px 42px 12px 16px', borderRadius: 10,
                        border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#FFFFFF',
                        color: '#0F2E1E'
                      }}
                    >
                      <option value="PIONEER_ADMISSIONS">Pioneer Admissions & Review Question</option>
                      <option value="PARTNERSHIP">Commercial & Enterprise Partnership</option>
                      <option value="MEDIA">Press & Media Inquiries</option>
                      <option value="TECHNICAL">Platform & Security Feedback</option>
                      <option value="GENERAL">General Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help or collaborate?"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    style={{
                      background: RF_DEEP_GREEN, color: '#FFFFFF', border: 'none',
                      padding: '13px 26px', borderRadius: 100, fontSize: 14, fontWeight: 600,
                      cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'background 0.2s', marginTop: 6
                    }}
                  >
                    {formState === 'submitting' ? 'Sending...' : 'Send Message'} <Send size={14} />
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Channels, Direct Emails & Presence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Direct Channels Box */}
              <div style={{
                background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
                borderRadius: 20, padding: '34px 30px', color: '#FFFFFF',
                border: '1px solid rgba(102, 187, 42, 0.2)'
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Direct Communication
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <Mail size={18} color={RF_MINT_ACCENT} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Pioneers Admissions</div>
                      <a href="mailto:pioneers@refeir.com" style={{ fontSize: 14.5, color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>
                        pioneers@refeir.com
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <Mail size={18} color={RF_LEAF_GREEN} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Commercial & Enterprise</div>
                      <a href="mailto:partners@refeir.com" style={{ fontSize: 14.5, color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>
                        partners@refeir.com
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <MessageSquare size={18} color="#25D366" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Official WhatsApp</div>
                      <a
                        href="https://chat.whatsapp.com/sample-refeir-pioneers"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 14.5, color: '#25D366', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Refeir Community <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Hubs Box */}
              <div style={{
                background: '#FFFFFF', borderRadius: 20, padding: '30px 28px',
                border: '1px solid #E2E8F0'
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={17} color={RF_LEAF_GREEN} />
                  Pan-African Remote Presence
                </h3>
                <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.6, marginBottom: 18 }}>
                  Refeir is a remote-first platform connecting builders across Africa’s fastest-growing technology hubs:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {['Lagos, Nigeria', 'Nairobi, Kenya', 'Kigali, Rwanda', 'Accra, Ghana', 'Cairo, Egypt', 'Johannesburg, SA'].map((city, i) => (
                    <div key={i} style={{
                      background: '#F8FAF9', padding: '8px 12px', borderRadius: 8,
                      fontSize: 12.5, color: '#334155', fontWeight: 500, border: '1px solid #E2E8F0'
                    }}>
                      • {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
