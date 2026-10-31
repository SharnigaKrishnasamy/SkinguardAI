import React, { useState } from 'react';
import { Key, Database, CheckCircle, ExternalLink, ShieldCheck, X } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  customApiKey, 
  onSaveApiKey, 
  systemStatus,
  language 
}) {
  const isTamil = language === 'ta';
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', width: '100%', padding: '2rem', position: 'relative', background: '#ffffff' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Key size={20} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
            {isTamil ? 'AI மற்றும் கணினி அமைப்புகள்' : 'AI Core & Database Settings'}
          </h3>
        </div>

        {/* AI API Key Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
            Vision AI API Key
          </label>
          <input
            type="password"
            placeholder="AIzaSy... or API key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontSize: '0.9rem',
              outline: 'none',
              marginBottom: '0.5rem'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {isTamil ? 'API சாவியை உள்ளிடவும் அல்லது மாற்றவும்' : 'Securely stored for vision screening'}
            </span>
          </div>
        </div>

        {/* System Architecture Status */}
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={15} color="#0284c7" />
              Database Engine:
            </span>
            <span style={{ color: '#0284c7', fontWeight: 700 }}>
              {systemStatus?.database?.type || 'MongoDB / Mongoose'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={15} color="#059669" />
              Vision Neural Model:
            </span>
            <span style={{ color: '#059669', fontWeight: 700 }}>
              Clinical Deep Vision Core v2.4
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            fontWeight: 600
          }}>
            <CheckCircle size={15} color="#059669" />
            <span>{isTamil ? 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!' : 'API Key successfully configured!'}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.65rem 1.2rem' }}>
            {isTamil ? 'மூடு' : 'Close'}
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            {isTamil ? 'சேமி' : 'Save Key'}
          </button>
        </div>

      </div>
    </div>
  );
}
