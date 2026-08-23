import React from 'react';
import { Handshake, CheckCircle2 } from 'lucide-react';

interface PartnershipsPageProps {
  onNavigate?: (path: string) => void;
}

export const PartnershipsPage: React.FC<PartnershipsPageProps> = ({ onNavigate = () => {} }) => {
  const [form, setForm] = React.useState({ org: '', name: '', email: '', type: 'SPONSOR', message: '' });
  const [sent, setSent] = React.useState(false);

  const partnerTypes = [
    {
      icon: '🏆',
      title: 'Event & Community Sponsor',
      desc: 'Sponsor Refeir Scout meetups, hackathons, and pan-African developer summits. Reach thousands of vetted tech professionals across 12+ markets.',
      benefits: ['Logo placement at events', 'Direct talent access passes', 'Brand mention in Scout newsletters'],
    },
    {
      icon: '🤝',
      title: 'Platform Integration Partner',
      desc: "Integrate your HR, payments, or developer tools with Refeir's API. Offer joint solutions to thousands of African businesses and freelancers.",
      benefits: ['API sandbox access', 'Co-marketing campaigns', 'Featured partner badge on listings'],
    },
    {
      icon: '🌍',
      title: 'Regional Expansion Partner',
      desc: 'Help Refeir launch into new African markets. Bring your local regulatory expertise, banking relationships, and talent networks.',
      benefits: ['Revenue share model', 'Country exclusivity windows', 'Joint press releases and media'],
    },
    {
      icon: '🎓',
      title: 'Education & Training Partner',
      desc: "Offer courses, bootcamps, and certifications to Refeir's talent base. Build a pipeline from your school directly to vetted global clients.",
      benefits: ['Direct learner-to-marketplace pipeline', 'Verified Graduate badge', 'Bootcamp listing on Refeir platform'],
    },
  ];

  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1200px' }}>

      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--rf-leaf-green)',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            background: 'rgba(102,187,42,0.08)',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            border: '1px solid rgba(102,187,42,0.2)',
          }}
        >
          <Handshake size={16} />
          <span>COLLABORATE WITH REFEIR</span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
          Sponsorship &amp; Partnership
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1.0625rem', lineHeight: 1.6 }}>
          Partner with Africa's fastest-growing professional talent network. From hackathon sponsorships to enterprise integrations — let's build together.
        </p>
      </div>

      {/* Two-column layout: narrow cards left, wide form right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '5fr 7fr',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT: 4 partnership type cards stacked vertically — natural flow, no scroll */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {partnerTypes.map(p => (
            <div key={p.title} className="rf-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{ fontSize: '1.625rem', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.55, marginBottom: '0.75rem' }}>
                    {p.desc}
                  </p>
                  <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {p.benefits.map(b => (
                      <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--rf-slate-400)' }}>
                        <CheckCircle2 size={12} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: wider Apply to Partner form — natural flow, no scroll */}
        <div className="rf-card" style={{ padding: '2.75rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.625rem' }}>
                Partnership Inquiry Received!
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', lineHeight: 1.6 }}>
                Our partnerships team will contact you within 48 business hours.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.375rem' }}>
                  Apply to Partner with Refeir
                </h2>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Complete the form below and our team will reach out with partnership options tailored to your organisation.
                </p>
              </div>

              <form
                onSubmit={e => { e.preventDefault(); setSent(true); }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="rf-form-group">
                    <label className="rf-label">Organisation Name</label>
                    <input
                      className="rf-input"
                      type="text"
                      placeholder="Acme Corp"
                      value={form.org}
                      onChange={e => setForm({ ...form, org: e.target.value })}
                      required
                    />
                  </div>
                  <div className="rf-form-group">
                    <label className="rf-label">Your Full Name</label>
                    <input
                      className="rf-input"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Work Email</label>
                  <input
                    className="rf-input"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Partnership Type</label>
                  <select
                    className="rf-select"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="SPONSOR">Event / Community Sponsor</option>
                    <option value="INTEGRATION">Platform Integration Partner</option>
                    <option value="REGIONAL">Regional Expansion Partner</option>
                    <option value="EDUCATION">Education &amp; Training Partner</option>
                  </select>
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Tell us about your goals</label>
                  <textarea
                    className="rf-input"
                    rows={5}
                    placeholder="What are you hoping to achieve through this partnership?"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="rf-btn rf-btn-primary rf-btn-lg"
                  style={{ gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                >
                  <Handshake size={17} />
                  <span>Submit Partnership Application</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
