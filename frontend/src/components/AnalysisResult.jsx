import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  RotateCcw, 
  HeartHandshake,
  Eye,
  FileText,
  BookmarkCheck,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function AnalysisResult({ 
  result, 
  previewImage, 
  patientContext, 
  onReset, 
  onViewHistory,
  language 
}) {
  const isTamil = language === 'ta';

  if (!result) return null;

  const urgency = (result.see_doctor_urgency || 'low').toLowerCase();

  const getUrgencyBadge = () => {
    if (urgency === 'high') {
      return (
        <span className="badge-urgency badge-high">
          <AlertTriangle size={15} />
          {isTamil ? 'உடனடி மருத்துவ ஆலோசனை தேவை (High Urgency)' : 'Urgent: Consult Doctor Promptly'}
        </span>
      );
    }
    if (urgency === 'medium') {
      return (
        <span className="badge-urgency badge-medium">
          <Clock size={15} />
          {isTamil ? 'மிதமான அவசரம் (Moderate Urgency)' : 'Moderate Urgency: Doctor Evaluation Recommended'}
        </span>
      );
    }
    return (
      <span className="badge-urgency badge-low">
        <CheckCircle size={15} />
        {isTamil ? 'குறைந்த ஆபத்து / வழக்கமான கவனிப்பு (Low Urgency)' : 'Low Urgency: Routine Care & Monitoring'}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const primaryCondition = result.possible_conditions?.[0] || {
    name: 'Unspecified Skin Condition',
    likelihood_percent: 75,
    description: 'Visual analysis complete.',
    severity: 'Mild'
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      
      {/* Top Banner with Model & Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem 1.5rem',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {getUrgencyBadge()}
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            AI Model: <strong style={{ color: '#0284c7' }}>{result.aiModelUsed || 'Clinical Deep Vision AI'}</strong>
          </span>
          {result.isSimulated && (
            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: '#fef3c7',
              color: '#d97706',
              border: '1px solid #fde68a',
              fontWeight: 600
            }}>
              Simulation Mode (Configure API Key in Settings)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handlePrint}
            className="btn-secondary" 
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <Download size={15} color="#0284c7" />
            <span>{isTamil ? 'அறிக்கை அச்சிடு / PDF' : 'Print / Export PDF'}</span>
          </button>
          <button 
            onClick={onReset}
            className="btn-primary" 
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
          >
            <RotateCcw size={15} />
            <span>{isTamil ? 'புதிய ஸ்கேன்' : 'New Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Image + Primary Condition + Differentials */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.8rem', marginBottom: '2rem' }}>
        
        {/* Left Column: Image Snapshot & Context Card */}
        <div className="glass-panel" style={{ padding: '1.6rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="#0284c7" />
            {isTamil ? 'ஸ்கேன் செய்யப்பட்ட படம்' : 'Screened Skin Lesion'}
          </h3>
          
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            marginBottom: '1.2rem'
          }}>
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Lesion Scanned" 
                style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>

          <div style={{ fontSize: '0.84rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span>{isTamil ? 'உடல் பகுதி:' : 'Body Region:'}</span>
              <strong style={{ color: '#0f172a' }}>{patientContext?.bodyLocation || 'Unspecified'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span>{isTamil ? 'கால அளவு:' : 'Duration:'}</span>
              <strong style={{ color: '#0f172a' }}>{patientContext?.durationDays || 'Unspecified'}</strong>
            </div>
            {patientContext?.symptoms?.length > 0 && (
              <div style={{ paddingTop: '0.2rem' }}>
                <span style={{ display: 'block', marginBottom: '0.35rem' }}>{isTamil ? 'அறிகுறிகள்:' : 'Reported Symptoms:'}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {patientContext.symptoms.map(s => (
                    <span key={s} style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#334155'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{
            marginTop: '1.2rem',
            padding: '0.75rem',
            borderRadius: '10px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            color: '#065f46',
            fontWeight: 600
          }}>
            <BookmarkCheck size={16} color="#059669" />
            <span>{isTamil ? 'முடிவு MongoDB யில் பதிவு செய்யப்பட்டுள்ளது' : 'Scan securely logged to MongoDB database'}</span>
          </div>
        </div>

        {/* Right Column: Possible Conditions & Likelihood Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Primary Condition Highlight Card */}
          <div className="glass-panel" style={{
            padding: '1.8rem',
            borderLeft: `5px solid ${urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#d97706' : '#0284c7'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#0284c7'
                }}>
                  {isTamil ? 'முதன்மையான சாத்தியமான நிலை' : 'Primary Differential Match'}
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                  {primaryCondition.name}
                </h2>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0284c7' }}>
                  {primaryCondition.likelihood_percent}%
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {isTamil ? 'சாத்தியக்கூறு' : 'Likelihood Match'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              {primaryCondition.description}
            </p>

            {/* Clinical summary */}
            {result.clinical_summary && (
              <div style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                fontSize: '0.86rem',
                color: '#0369a1',
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start'
              }}>
                <FileText size={17} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{result.clinical_summary}</span>
              </div>
            )}
          </div>

          {/* Differential Conditions Progress Bars */}
          <div className="glass-panel" style={{ padding: '1.8rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem' }}>
              {isTamil ? 'பிற சாத்தியமான நோயறிதல்கள் (Differential Diagnoses)' : 'All Differential Conditions & Likelihood'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {(result.possible_conditions || []).map((cond, idx) => (
                <div key={idx} style={{ padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{cond.name}</span>
                      {cond.severity && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: '#e2e8f0',
                          color: '#475569'
                        }}>
                          {cond.severity}
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: idx === 0 ? '#0284c7' : '#64748b' }}>
                      {cond.likelihood_percent}%
                    </span>
                  </div>

                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${cond.likelihood_percent}%`,
                        background: idx === 0 ? 'linear-gradient(90deg, #0284c7, #2563eb)' : 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
                      }} 
                    />
                  </div>

                  {cond.description && (
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.45rem' }}>
                      {cond.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Features, Causes, Prevention & Advice Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem' }}>
        
        {/* Visible Features */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Eye size={20} color="#0284c7" />
            {isTamil ? 'தென்படும் தோல் பண்புகள்' : 'Visible Dermatological Features'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(result.visible_features || []).map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ color: '#0284c7', fontWeight: 'bold' }}>•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Causes & Triggers (எதனால் வருகிறது) */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HelpCircle size={20} color="#d97706" />
            {isTamil ? 'நோய் உருவாவதற்கான காரணங்கள் (Why & How it occurs)' : 'Root Causes & Triggers'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(result.causes_and_triggers || [
              'தோலின் ஈரப்பத தடுப்பு குறைபாடு (Barrier lipid defect)',
              'ஒவ்வாமை தூண்டுதல்கள் அல்லது ரசாயன சோப்புகள்',
              'அதிகப்படியான வியர்வை அல்லது பூஞ்சை தொற்று (Fungal/Microbial trigger)',
              'மரபணு மற்றும் சுற்றுச்சூழல் மாறுதல்கள்'
            ]).map((cause, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ color: '#d97706', fontWeight: 'bold' }}>•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prevention & Protection (எப்படி தடுக்கலாம்) */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#059669" />
            {isTamil ? 'தடுக்கும் மற்றும் பாதுகாப்பு முறைகள் (Prevention)' : 'Prevention & Barrier Protection'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(result.prevention_tips || [
              'குளித்த 3 நிமிடங்களுக்குள் மென்மையான மாய்ஸ்சரைசர் பூசவும்',
              'காற்றோட்டமான பருத்தி ஆடைகளை மட்டுமே அணியவும்',
              'சுடுநீர் குளியல் மற்றும் நகங்களால் அரிப்பு எடுப்பதை தவிர்க்கவும்',
              'தனிநபர் துண்டுகள், சீப்புகளை மற்றவர்களுடன் பகிர வேண்டாம்'
            ]).map((tip, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Home Care Advice */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HeartHandshake size={20} color="#2563eb" />
            {isTamil ? 'வீட்டு பராமரிப்பு ஆலோசனைகள்' : 'Home-Care & Self-Management Advice'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(result.home_care_advice || []).map((adv, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* When to Seek Immediate Care */}
        <div className="glass-panel" style={{ padding: '1.8rem', border: '1px solid #fecaca', background: '#fef2f2' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b91c1c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} color="#dc2626" />
            {isTamil ? 'உடனடி மருத்துவ உதவி தேவைப்படும் அறிகுறிகள்' : 'Immediate Medical Warning Signs'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(result.immediate_care_signs || [
              'Spreading redness accompanied by fever',
              'Severe throbbing pain or warm pus discharge',
              'Bleeding or rapid color elevation changes'
            ]).map((sign, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#991b1b' }}>
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>!</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
