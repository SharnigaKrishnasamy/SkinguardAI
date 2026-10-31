import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function MedicalDisclaimer({ language }) {
  const [expanded, setExpanded] = useState(false);
  const isTamil = language === 'ta';

  return (
    <div style={{
      background: '#fff1f2',
      borderBottom: '1px solid #fecdd3',
      padding: '0.65rem 1rem',
      fontSize: '0.85rem',
      color: '#9f1239'
    }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: '#ffe4e6',
            color: '#e11d48'
          }}>
            <AlertTriangle size={15} />
          </span>
          <span style={{ fontWeight: 700, color: '#be123c' }}>
            {isTamil ? 'மருத்துவ மறுப்புரை:' : 'Strict Medical Disclaimer:'}
          </span>
          <span style={{ color: '#881337', fontWeight: 500 }}>
            {isTamil 
              ? 'இது ஒரு மருத்துவ நோயறிதல் அல்ல. தயவுசெய்து தகுதியான மருத்துவரை அணுகவும்.'
              : 'This AI screening tool is for informational reference only and is not a clinical medical diagnosis. Always consult a board-certified dermatologist.'}
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#be123c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'underline'
          }}
        >
          {expanded ? (isTamil ? 'குறைக்க' : 'Hide details') : (isTamil ? 'விதிமுறைகள்' : 'Clinical Protocol Info')}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

      </div>

      {expanded && (
        <div className="app-container" style={{
          marginTop: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid #fecdd3',
          fontSize: '0.8rem',
          color: '#9f1239',
          lineHeight: 1.5
        }}>
          <p>
            {isTamil 
              ? '• இந்த AI கருவி மேம்பட்ட விஷன் AI தொழில்நுட்பம் மூலம் புகைப்படத்தை ஆராய்கிறது. கடுமையான தோல் புற்றுநோய் அல்லது தொற்றுநோய்களை மருத்துவர் மட்டுமே துல்லியமாக கண்டறிய முடியும். அவசர அறிகுறிகள் இருந்தால் உடனடியாக மருத்துவமனைக்கு செல்லவும்.'
              : '• General computer vision AI analyses visual features and likelihoods, but clinical biopsy and dermoscopy by a qualified physician remain the gold standard. In case of rapidly expanding lesions, high fever, or severe ulceration, seek emergency healthcare immediately.'}
          </p>
        </div>
      )}
    </div>
  );
}
