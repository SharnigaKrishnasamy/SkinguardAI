import React, { useEffect, useState } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { fetchVerifiedInfo } from '../utils/api';

const T = {
  en: {
    title: 'Verified care information (NHS & DermNet NZ)',
    loading: 'Looking up trusted sources...',
    none: 'No matching NHS or DermNet page for this condition yet.',
    fail: 'Could not load verified information right now.',
    note: 'Summarised by AI from the sources below. Not a diagnosis.',
    sources: 'Sources'
  },
  ta: {
    title: 'சரிபார்க்கப்பட்ட பராமரிப்புத் தகவல் (NHS & DermNet NZ)',
    loading: 'நம்பகமான ஆதாரங்களைத் தேடுகிறது...',
    none: 'இந்த நிலைக்கு பொருந்தும் NHS அல்லது DermNet பக்கம் இன்னும் இல்லை.',
    fail: 'சரிபார்க்கப்பட்ட தகவலை இப்போது ஏற்ற முடியவில்லை.',
    note: 'கீழுள்ள ஆதாரங்களிலிருந்து AI சுருக்கியது. இது நோய் கண்டறிதல் அல்ல.',
    sources: 'ஆதாரங்கள்'
  }
};

export default function VerifiedInfo({ condition, language = 'en', customApiKey }) {
  const t = T[language] || T.en;
  const [state, setState] = useState('loading'); // loading | ready | none | error
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!condition) return;
    let cancelled = false;
    setState('loading');
    fetchVerifiedInfo(condition, language, customApiKey)
      .then(r => {
        if (cancelled) return;
        if (!r.text) { setState('none'); return; }
        setInfo(r);
        setState('ready');
      })
      .catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [condition, language]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!condition) return null;

  const lines = (info?.text || '').split('\n').map(l => l.trim()).filter(Boolean);

  return (
    <div style={{ maxWidth: 900, margin: '1.25rem auto 0', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 14, padding: '1.1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
        <BookOpenCheck size={20} color="#0284c7" />
        <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.title}</div>
      </div>

      {state === 'loading' && <div style={{ color: '#0284c7', fontWeight: 600 }}>{t.loading}</div>}
      {state === 'none' && <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{t.none}</div>}
      {state === 'error' && <div style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{t.fail}</div>}

      {state === 'ready' && (
        <>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#1e293b', fontSize: '0.92rem', lineHeight: 1.65 }}>
            {lines.map((l, i) => <li key={i}>{l.replace(/^[-*•]\s*/, '')}</li>)}
          </ul>
          {info.sources.length > 0 && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 700, color: '#475569' }}>{t.sources}: </span>
              {info.sources.map(s => (
                <span key={s.url} style={{ marginRight: 10 }}>
                  [{s.n}] <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7' }}>{s.org}: {s.title}</a>
                </span>
              ))}
            </div>
          )}
          <div style={{ marginTop: 6, fontSize: '0.74rem', color: '#64748b' }}>{t.note}</div>
        </>
      )}
    </div>
  );
}
