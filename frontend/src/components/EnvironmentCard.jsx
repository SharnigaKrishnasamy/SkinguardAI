import React, { useState } from 'react';
import { Sun, MapPin } from 'lucide-react';
import { buildAdvice, UV_LABEL } from '../utils/envAdvice';

const T = {
  en: {
    title: 'Skin weather check',
    sub: 'UV index and humidity at your location',
    btn: 'Check my local UV & weather',
    loading: 'Getting your location...',
    uv: "Today's peak UV",
    temp: 'Temperature',
    hum: 'Humidity',
    denied: 'Location permission was denied. Allow it in your browser settings and try again.',
    fail: "Couldn't load weather data. Please try again."
  },
  ta: {
    title: 'சருமப் பாதுகாப்பு வானிலை',
    sub: 'உங்கள் இடத்தின் UV மற்றும் ஈரப்பதம்',
    btn: 'என் பகுதியின் UV & வானிலையைப் பார்க்க',
    loading: 'உங்கள் இருப்பிடத்தைப் பெறுகிறது...',
    uv: 'இன்றைய அதிகபட்ச UV',
    temp: 'வெப்பநிலை',
    hum: 'ஈரப்பதம்',
    denied: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. உலாவி அமைப்புகளில் அனுமதித்து மீண்டும் முயற்சிக்கவும்.',
    fail: 'வானிலைத் தகவலைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
  }
};

export default function EnvironmentCard({ language = 'en', condition = '' }) {
  const t = T[language] || T.en;
  const L = language === 'ta' ? 'ta' : 'en';
  const [state, setState] = useState('idle'); // idle | loading | ready | denied | error
  const [data, setData] = useState(null);

  const load = () => {
    if (!navigator.geolocation) { setState('error'); return; }
    setState('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m&daily=uv_index_max&timezone=auto&forecast_days=1`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('weather');
          const j = await res.json();
          setData({
            temp: j.current?.temperature_2m,
            humidity: j.current?.relative_humidity_2m,
            uv: j.daily?.uv_index_max?.[0]
          });
          setState('ready');
        } catch {
          setState('error');
        }
      },
      (err) => setState(err.code === 1 ? 'denied' : 'error'),
      { timeout: 10000, maximumAge: 600000 }
    );
  };

  const advice = state === 'ready' ? buildAdvice({ ...data, condition }) : null;
  const lvl = advice ? UV_LABEL[advice.level] : null;

  return (
    <div style={{ maxWidth: 900, margin: '1.5rem auto 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
        <Sun size={20} color="#ea580c" />
        <div>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.title}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.sub}</div>
        </div>
      </div>

      {(state === 'idle' || state === 'denied' || state === 'error') && (
        <>
          <button onClick={load} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.55rem 0.95rem', border: 'none', borderRadius: 10, background: '#0284c7', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            <MapPin size={16} /> {t.btn}
          </button>
          {state === 'denied' && <div style={{ color: '#b91c1c', fontSize: '0.85rem', marginTop: 8 }}>{t.denied}</div>}
          {state === 'error' && <div style={{ color: '#b91c1c', fontSize: '0.85rem', marginTop: 8 }}>{t.fail}</div>}
        </>
      )}
      {state === 'loading' && <div style={{ color: '#0284c7', fontWeight: 600 }}>{t.loading}</div>}

      {state === 'ready' && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Stat label={t.uv} value={`${data.uv ?? '-'} · ${lvl[L]}`} color={lvl.color} />
            <Stat label={t.temp} value={data.temp != null ? `${Math.round(data.temp)}°C` : '-'} />
            <Stat label={t.hum} value={data.humidity != null ? `${Math.round(data.humidity)}%` : '-'} />
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {advice.tips.map((tip, i) => <li key={i}>{tip[L]}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, color = '#0f172a' }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.45rem 0.8rem' }}>
      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{label}</div>
      <div style={{ fontWeight: 800, color }}>{value}</div>
    </div>
  );
}
