import React from 'react';
import { Mail, Phone, MapPin, Globe2, MessageCircle, ArrowRight, Building2 } from 'lucide-react';

interface ContactPageProps {
  onNavigate?: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate = () => {} }) => {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <MessageCircle size={16} />
          <span>GET IN TOUCH</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>Contact Refeir</h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '560px' }}>
          We're building Africa's most trusted talent network. Reach our team across Nairobi, Lagos, and Accra.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start' }}>
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { icon: Mail, label: 'Email', value: 'hello@refeir.africa', color: 'var(--rf-leaf-green)' },
            { icon: Phone, label: 'Phone (Nigeria)', value: '+234 800 REFEIR', color: 'var(--rf-mint)' },
            { icon: Phone, label: 'Phone (Kenya)', value: '+254 700 REFEIR', color: 'var(--rf-mint)' },
            { icon: Building2, label: 'HQ — Lagos', value: 'Victoria Island, Lagos, Nigeria', color: '#7DA2FF' },
            { icon: Building2, label: 'East Africa — Nairobi', value: 'Westlands, Nairobi, Kenya', color: '#7DA2FF' },
            { icon: Globe2, label: 'General Enquiries', value: 'partnerships@refeir.africa', color: 'var(--rf-cream)' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rf-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--rf-cream)', marginTop: '2px' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="rf-card" style={{ padding: '2.5rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>Message Sent!</h3>
              <p style={{ color: 'var(--rf-slate-300)' }}>Our team will respond within 24 hours across all Pan-African time zones.</p>
              <button onClick={() => setSent(false)} className="rf-btn rf-btn-secondary" style={{ marginTop: '1.5rem' }}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>Send a Message</h3>
              <div className="rf-form-group">
                <label className="rf-label">Full Name</label>
                <input className="rf-input" type="text" placeholder="Amaka Nwosu" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="rf-form-group">
                <label className="rf-label">Email Address</label>
                <input className="rf-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="rf-form-group">
                <label className="rf-label">Subject</label>
                <input className="rf-input" type="text" placeholder="Partnership inquiry / Talent hiring / Scout onboarding..." value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="rf-form-group">
                <label className="rf-label">Message</label>
                <textarea className="rf-input" rows={5} placeholder="Tell us about your project, team size, or how we can help..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="rf-btn rf-btn-primary rf-btn-lg" style={{ gap: '0.5rem' }}>
                <span>Send Message</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
