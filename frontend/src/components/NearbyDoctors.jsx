import React from 'react';
import { Stethoscope, ExternalLink } from 'lucide-react';

const T = {
  en: {
    title: 'Find a skin doctor nearby',
    high: 'Your result suggests seeing a doctor soon.',
    medium: 'It would be wise to get this checked by a doctor.',
    low: 'If it does not improve, a doctor or pharmacist can help.',
    derm: 'Dermatologists near me',
    pharm: 'Pharmacies near me',
    note: 'Opens Google Maps using your device location.'
  },
  ta: {
    title: 'அருகிலுள்ள தோல் மருத்துவரைக் கண்டறிக',
    high: 'உங்கள் முடிவின்படி விரைவில் மருத்துவரைப் பார்ப்பது நல்லது.',
    medium: 'இதை ஒரு மருத்துவரிடம் பரிசோதிப்பது புத்திசாலித்தனம்.',
    low: 'குணமாகவில்லை என்றால் மருத்துவர் அல்லது மருந்தாளர் உதவலாம்.',
    derm: 'அருகிலுள்ள தோல் மருத்துவர்கள்',
    pharm: 'அருகிலுள்ள மருந்தகங்கள்',
    note: 'உங்கள் சாதன இருப்பிடத்துடன் Google Maps திறக்கும்.'
  }
};

export default function NearbyDoctors({ urgency = 'low', language = 'en' }) {
  const t = T[language] || T.en;
  const u = ['high', 'medium'].includes(String(urgency).toLowerCase()) ? String(urgency).toLowerCase() : 'low';
  const accent = u === 'high' ? '#dc2626' : u === 'medium' ? '#d97706' : '#0284c7';

  const linkStyle = (primary) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.55rem 0.95rem', borderRadius: 10,
    fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem',
    background: primary ? accent : '#fff', color: primary ? '#fff' : accent, border: `1px solid ${accent}`
  });

  return (
    <div style={{ maxWidth: 900, margin: '1.25rem auto 0', background: '#fff', border: `1px solid ${accent}40`, borderLeft: `5px solid ${accent}`, borderRadius: 14, padding: '1.1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <Stethoscope size={20} color={accent} />
        <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.title}</div>
      </div>
      <div style={{ color: '#334155', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{t[u]}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        <a href="https://www.google.com/maps/search/dermatologist+near+me" target="_blank" rel="noopener noreferrer" style={linkStyle(true)}>
          {t.derm} <ExternalLink size={14} />
        </a>
        <a href="https://www.google.com/maps/search/pharmacy+near+me" target="_blank" rel="noopener noreferrer" style={linkStyle(false)}>
          {t.pharm} <ExternalLink size={14} />
        </a>
      </div>
      <div style={{ marginTop: 8, fontSize: '0.74rem', color: '#64748b' }}>{t.note}</div>
    </div>
  );
}
