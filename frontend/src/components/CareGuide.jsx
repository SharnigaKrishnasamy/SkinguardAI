import React from 'react';
import { Sparkles, Salad, ShieldAlert } from 'lucide-react';
import { getCareGuide, COMMON_SAFETY, FOOD_LINK, DOCTOR_FIRST } from '../utils/careGuide';

const T = {
  en: { head: 'Care routine and product guide', look: 'Look for on the label', avoid: 'Avoid', food: 'Food and lifestyle', safe: 'Before you start', note: 'General guidance only, not a prescription.' },
  ta: { head: 'பராமரிப்பு வழக்கம் மற்றும் பொருள் வழிகாட்டி', look: 'லேபிளில் பார்க்க வேண்டியவை', avoid: 'தவிர்க்க வேண்டியவை', food: 'உணவு மற்றும் வாழ்க்கைமுறை', safe: 'தொடங்கும் முன்', note: 'பொதுவான வழிகாட்டுதல் மட்டுமே, மருந்துச்சீட்டு அல்ல.' }
};

const card = { maxWidth: 900, margin: '1.25rem auto 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.1rem 1.25rem' };
const h4 = { fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', margin: '0.9rem 0 0.3rem' };

export default function CareGuide({ condition, urgency = 'low', language = 'en' }) {
  if (!condition) return null;
  const L = language === 'ta' ? 'ta' : 'en';
  const t = T[L];
  const { key, guide } = getCareGuide(condition, urgency);

  if (key === 'doctor') {
    return (
      <div style={{ ...card, background: '#fef2f2', border: '1px solid #fecaca' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 6 }}>
          <ShieldAlert size={20} color="#dc2626" />
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.head}</div>
        </div>
        <div style={{ color: '#7f1d1d', fontSize: '0.92rem', lineHeight: 1.6 }}>{DOCTOR_FIRST[L]}</div>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Sparkles size={20} color="#0284c7" />
        <div>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{guide.title[L]}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.head}</div>
        </div>
      </div>

      {guide.routine.map((r, i) => (
        <div key={i}>
          <div style={h4}>{r.title[L]}</div>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>
            {r.steps.map((s, j) => <li key={j}>{s[L]}</li>)}
          </ol>
        </div>
      ))}

      <div style={h4}>{t.look}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {guide.look.map((x, i) => (
          <span key={i} style={{ background: '#e0f2fe', color: '#075985', borderRadius: 999, padding: '0.2rem 0.65rem', fontSize: '0.82rem', fontWeight: 600 }}>{x[L]}</span>
        ))}
      </div>

      <div style={h4}>{t.avoid}</div>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>
        {guide.avoid.map((x, i) => <li key={i}>{x[L]}</li>)}
      </ul>

      <div style={{ ...h4, display: 'flex', alignItems: 'center', gap: 6 }}><Salad size={16} color="#16a34a" /> {t.food}</div>
      <div style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>{guide.food[L]}</div>
      <div style={{ marginTop: 6, fontSize: '0.82rem' }}>
        <a href={FOOD_LINK.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7' }}>{FOOD_LINK.label[L]}</a>
      </div>

      <div style={{ ...h4 }}>{t.safe}</div>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#475569', fontSize: '0.84rem', lineHeight: 1.6 }}>
        {COMMON_SAFETY.map((x, i) => <li key={i}>{x[L]}</li>)}
      </ul>
      <div style={{ marginTop: 8, fontSize: '0.74rem', color: '#94a3b8' }}>{t.note}</div>
    </div>
  );
}
