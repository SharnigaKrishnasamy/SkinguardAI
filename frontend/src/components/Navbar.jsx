import React from 'react';
import { Activity, ShieldAlert, Database, Languages, Sparkles } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  systemStatus, 
  onOpenSettings,
  language,
  setLanguage 
}) {
  const isTamil = language === 'ta';

  return (
    <header className="glass-nav">
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('scan')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}>
            <Activity size={22} color="#ffffff" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: systemStatus?.connected ? '#10b981' : '#f59e0b',
              border: '2px solid #ffffff'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                SkinGuard <span style={{ color: '#0284c7' }}>AI</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                background: '#e0f2fe',
                color: '#0284c7',
                border: '1px solid #bae6fd',
                fontWeight: 700
              }}>
                VISION CORE AI
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              {isTamil ? 'தோல் நோய் கண்டறிதல் மற்றும் வழிகாட்டல்' : 'Clinical Dermatology Visual Screening'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setActiveTab('scan')}
            style={{
              background: activeTab === 'scan' ? '#f0f9ff' : 'transparent',
              color: activeTab === 'scan' ? '#0284c7' : '#64748b',
              border: activeTab === 'scan' ? '1px solid #bae6fd' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={16} />
            {isTamil ? 'ஸ்கேன் & கண்டறிதல்' : 'Scan & Screening'}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              background: activeTab === 'history' ? '#f0f9ff' : 'transparent',
              color: activeTab === 'history' ? '#0284c7' : '#64748b',
              border: activeTab === 'history' ? '1px solid #bae6fd' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Database size={16} />
            {isTamil ? 'வரலாறு (MongoDB)' : 'Scan History (MongoDB)'}
          </button>

          <button
            onClick={() => setActiveTab('guidance')}
            style={{
              background: activeTab === 'guidance' ? '#f0f9ff' : 'transparent',
              color: activeTab === 'guidance' ? '#0284c7' : '#64748b',
              border: activeTab === 'guidance' ? '1px solid #bae6fd' : '1px solid transparent',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldAlert size={16} />
            {isTamil ? 'மருத்துவ ஆலோசனை' : 'Clinical Guidance'}
          </button>
        </nav>

        {/* Utility Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
            title="Toggle English / தமிழ்"
          >
            <Languages size={15} color="#0284c7" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
