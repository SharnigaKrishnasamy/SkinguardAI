import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Camera, 
  X, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { createSampleImageBlob } from '../utils/api';

const COMMON_SYMPTOMS = [
  'Severe Itching',
  'Redness & Erythema',
  'Dry Flaking / Scales',
  'Burning Sensation',
  'Raised Bumps / Papules',
  'Pain or Soreness',
  'Blisters with Fluid',
  'Spreading Outward'
];

const BODY_LOCATIONS = [
  'Arm / Elbow',
  'Leg / Knee',
  'Face / Forehead',
  'Torso / Chest / Back',
  'Hands / Fingers',
  'Feet / Soles',
  'Scalp / Neck',
  'Other / Unspecified'
];

export default function ImageUploader({ onStartAnalysis, isAnalyzing, language }) {
  const isTamil = language === 'ta';

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Patient context
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [bodyLocation, setBodyLocation] = useState(BODY_LOCATIONS[0]);
  const [durationDays, setDurationDays] = useState('1 - 2 Weeks');

  // Webcam state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelection = (file) => {
    setErrorMessage('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(isTamil ? 'தயவுசெய்து பட கோப்பை மட்டும் பதிவேற்றவும் (JPG, PNG, WEBP).' : 'Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(isTamil ? 'படத்தின் அளவு 10MB க்கும் குறைவாக இருக்க வேண்டும்.' : 'Image size must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Preset clinical sample loader
  const handleLoadSample = async (type) => {
    setErrorMessage('');
    try {
      const { file, dataUrl } = await createSampleImageBlob(type);
      setSelectedFile(file);
      setPreviewUrl(dataUrl);

      if (type === 'eczema') {
        setSelectedSymptoms(['Severe Itching', 'Redness & Erythema', 'Dry Flaking / Scales']);
        setBodyLocation('Arm / Elbow');
      } else if (type === 'ringworm') {
        setSelectedSymptoms(['Redness & Erythema', 'Spreading Outward', 'Severe Itching']);
        setBodyLocation('Torso / Chest / Back');
      } else {
        setSelectedSymptoms(['Dry Flaking / Scales', 'Raised Bumps / Papules']);
        setBodyLocation('Leg / Knee');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Webcam handlers
  const startCamera = async () => {
    try {
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setErrorMessage(isTamil ? 'கேமராவை அணுக முடியவில்லை. அனுமதியை சரிபார்க்கவும்.' : 'Unable to access camera. Please check browser permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `camera-skin-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setErrorMessage(isTamil ? 'தயவுசெய்து ஒரு படத்தை பதிவேற்றவும்.' : 'Please upload or capture a photo first.');
      return;
    }

    onStartAnalysis(selectedFile, {
      symptoms: selectedSymptoms,
      bodyLocation,
      durationDays
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: '2rem', marginTop: '1.5rem' }}>
      
      {/* Left Column: Image Upload & Preview */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {isTamil ? 'தோல் புகைப்படத்தை பதிவேற்றவும்' : 'Upload Lesion Image'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {isTamil ? 'நேரடி கேமரா அல்லது பட கோப்பை தேர்வு செய்யவும்' : 'Clear, well-lit photo of the affected skin area'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => isCameraActive ? stopCamera() : startCamera()}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
            >
              <Camera size={16} color="#0284c7" />
              <span>{isCameraActive ? (isTamil ? 'மூடு' : 'Close Cam') : (isTamil ? 'கேமரா' : 'Live Camera')}</span>
            </button>
          </div>
        </div>

        {/* Live Camera View */}
        {isCameraActive ? (
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0f172a',
            border: '2px solid #0284c7',
            marginBottom: '1.5rem'
          }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '360px', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '1rem'
            }}>
              <button 
                onClick={capturePhoto} 
                className="btn-primary"
                style={{ padding: '0.7rem 1.8rem', borderRadius: '999px' }}
              >
                <Camera size={18} />
                <span>{isTamil ? 'புகைப்படம் எடு' : 'Capture Snapshot'}</span>
              </button>
              <button 
                onClick={stopCamera} 
                className="btn-secondary"
                style={{ borderRadius: '999px', background: '#ffffff', color: '#0f172a' }}
              >
                {isTamil ? 'ரத்து' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          /* Image Preview State */
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #bae6fd',
            background: '#f8fafc',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.08)'
          }}>
            <img 
              src={previewUrl} 
              alt="Skin Scan Preview" 
              style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
            />

            {/* Scanner line if analyzing */}
            {isAnalyzing && <div className="scanner-line" />}

            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button
                onClick={handleClear}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  color: '#ef4444',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                title="Remove photo"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              padding: '0.75rem 1rem',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.82rem',
              color: '#64748b'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 600 }}>
                <CheckCircle2 size={15} />
                {selectedFile?.name || 'skin-photo.jpg'}
              </span>
              <span>
                {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ''}
              </span>
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop Dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? '2px dashed #0284c7' : '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? '#f0f9ff' : '#f8fafc',
              transition: 'all 0.2s ease',
              marginBottom: '1.5rem'
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => handleFileSelection(e.target.files[0])}
              accept="image/*" 
              style={{ display: 'none' }} 
            />

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto',
              border: '1px solid #bae6fd'
            }}>
              <UploadCloud size={30} />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              {isTamil ? 'படத்தை இங்கே இழுத்து விடவும் அல்லது கிளிக் செய்யவும்' : 'Drag & drop skin photo or click to browse'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '380px', margin: '0 auto' }}>
              {isTamil ? 'JPG, PNG, WEBP வடிவங்களை ஆதரிக்கிறது (அதிகபட்சம் 10MB)' : 'Supports JPG, PNG, WEBP (Max 10MB). Ensure crisp focus and even lighting.'}
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.85rem',
            marginBottom: '1.2rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Preset Clinical Samples for Instant Testing */}
        <div style={{
          padding: '1.1rem',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isTamil ? 'உடனடி சோதனைக்கான மாதிரி படங்கள் (1-Click Sample)' : '1-Click Clinical Demonstration Samples'}
            </span>
            <Zap size={14} color="#d97706" />
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLoadSample('eczema')}
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
            >
              🔴 {isTamil ? 'அரிப்பு / எக்ஸிமா' : 'Eczema / Dermatitis'}
            </button>
            <button
              onClick={() => handleLoadSample('ringworm')}
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
            >
              ⭕ {isTamil ? 'படர்தாமரை' : 'Tinea / Ringworm'}
            </button>
            <button
              onClick={() => handleLoadSample('psoriasis')}
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
            >
              ⚪ {isTamil ? 'சொரியாசிஸ்' : 'Psoriasis Plaque'}
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Clinical Patient Context & Action */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            {isTamil ? 'நோயாளியின் கூடுதல் விவரங்கள்' : 'Clinical Context & Symptoms'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.4rem' }}>
            {isTamil ? 'துல்லியமான AI பகுப்பாய்வுக்கு அறிகுறிகளை தேர்வு செய்யவும்' : 'Help Clinical AI provide a higher fidelity differential diagnosis'}
          </p>

          {/* Body Location */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              {isTamil ? 'பாதிக்கப்பட்ட உடல் பகுதி' : 'Affected Body Region'}
            </label>
            <select
              value={bodyLocation}
              onChange={(e) => setBodyLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.68rem 0.9rem',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              {BODY_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              {isTamil ? 'அறிகுறியின் கால அளவு' : 'Duration of Condition'}
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              style={{
                width: '100%',
                padding: '0.68rem 0.9rem',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              <option value="Less than 3 days">Less than 3 days (Acute onset)</option>
              <option value="1 - 2 Weeks">1 - 2 Weeks</option>
              <option value="1 - 3 Months">1 - 3 Months (Subacute)</option>
              <option value="Over 6 Months (Chronic)">Over 6 Months (Chronic)</option>
            </select>
          </div>

          {/* Symptoms Checklist Pills */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.6rem' }}>
              {isTamil ? 'உணரப்படும் அறிகுறிகள்' : 'Presenting Symptoms (Select all that apply)'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    style={{
                      padding: '0.45rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      background: isSelected ? '#e0f2fe' : '#f8fafc',
                      color: isSelected ? '#0284c7' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{sym}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isAnalyzing}
            className="btn-primary"
            style={{ width: '100%', padding: '0.95rem', fontSize: '1.02rem', borderRadius: '12px' }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>{isTamil ? 'AI விஷன் ஆய்வு செய்கிறது...' : 'Clinical AI Vision Analyzing...'}</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>{isTamil ? 'தோல் நிலையை ஆய்வு செய்' : 'Analyze Skin Condition'}</span>
              </>
            )}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.74rem', color: '#64748b', marginTop: '0.7rem' }}>
            🔒 {isTamil ? 'MongoDB யில் பாதுகாப்பாக சேமிக்கப்படும் • பாதுகாப்பான நெறிமுறை' : 'Securely recorded to MongoDB • Privacy Compliant'}
          </p>
        </div>

      </div>

    </div>
  );
}
