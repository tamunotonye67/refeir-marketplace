import React from 'react';
import { Wrench, ArrowRight, Calculator, FileText, Globe2, BarChart3, CheckCircle2 } from 'lucide-react';

interface FreeToolsPageProps {
  onNavigate?: (path: string) => void;
}

export const FreeToolsPage: React.FC<FreeToolsPageProps> = ({ onNavigate = () => {} }) => {
  const [rate, setRate] = React.useState(50);
  const [hours, setHours] = React.useState(160);
  const [currency, setCurrency] = React.useState('USD');
  const rates: Record<string, number> = { USD: 1, NGN: 1680, KES: 129, GHS: 15.5, ZAR: 18.7 };

  const monthly = rate * hours;
  const converted = (monthly * rates[currency]).toLocaleString();

  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Wrench size={16} />
          <span>FREE BUSINESS TOOLS</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>Free Business Tools</h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '560px', marginTop: '0.5rem' }}>
          Tools built for African freelancers and businesses — rate calculators, invoice generators, and market benchmarks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem' }}>
        {/* Rate Calculator */}
        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Calculator size={22} color="var(--rf-leaf-green)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Freelance Rate Calculator</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="rf-form-group">
              <label className="rf-label">Hourly Rate (USD)</label>
              <input className="rf-input" type="number" min={1} max={500} value={rate} onChange={e => setRate(Number(e.target.value))} />
              <input type="range" min={5} max={300} value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--rf-leaf-green)' }} />
            </div>
            <div className="rf-form-group">
              <label className="rf-label">Hours per Month</label>
              <input className="rf-input" type="number" min={1} max={240} value={hours} onChange={e => setHours(Number(e.target.value))} />
            </div>
            <div className="rf-form-group">
              <label className="rf-label">View earnings in</label>
              <select className="rf-select" value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="USD">USD — US Dollar</option>
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="KES">KES — Kenyan Shilling</option>
                <option value="GHS">GHS — Ghanaian Cedi</option>
                <option value="ZAR">ZAR — South African Rand</option>
              </select>
            </div>
            <div style={{ background: 'rgba(102,187,42,0.08)', border: '1px solid rgba(102,187,42,0.25)', borderRadius: 'var(--rf-radius-md)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '0.25rem' }}>Monthly earnings at ${rate}/hr × {hours} hrs</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>{currency} {converted}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-500)', marginTop: '0.25rem' }}>≈ ${monthly.toLocaleString()} USD/month</div>
            </div>
          </div>
        </div>

        {/* Available Tools List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { icon: FileText, color: '#7DA2FF', title: 'Invoice Generator', desc: 'Generate professional invoices with your logo, Refeir project details, and multi-currency amounts. Export to PDF.', badge: 'COMING SOON' },
            { icon: BarChart3, color: '#F4B942', title: 'African Market Salary Benchmarks', desc: 'Compare developer, designer, and PM salaries across 12 African tech hubs. Updated quarterly from real Refeir project data.', badge: 'COMING SOON' },
            { icon: Globe2, color: 'var(--rf-mint)', title: 'Cross-Border Tax Guide', desc: 'Country-by-country breakdown of freelance income tax obligations, withholding rates, and required registrations for African professionals.', badge: 'COMING SOON' },
            { icon: CheckCircle2, color: 'var(--rf-leaf-green)', title: 'Client Contract Builder', desc: 'Build legal-grade freelance contracts for African jurisdictions with milestone-based payment terms pre-filled.', badge: 'COMING SOON' },
          ].map(({ icon: Icon, color, title, desc, badge }) => (
            <div key={title} className="rf-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{title}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>{badge}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
