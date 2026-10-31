import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import ScanHistory from './components/ScanHistory';
import GuidanceSection from './components/GuidanceSection';
import SettingsModal from './components/SettingsModal';
import ChatWidget from './components/ChatWidget';
import EnvironmentCard from './components/EnvironmentCard';
import VerifiedInfo from './components/VerifiedInfo';
import NearbyDoctors from './components/NearbyDoctors';
import CareGuide from './components/CareGuide';
import { checkHealth, analyzeSkinImage, translateResult } from './utils/api';
import { Activity, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [patientContext, setPatientContext] = useState({});
  const [systemStatus, setSystemStatus] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('VISION_AI_CUSTOM_KEY') || '');
  const [language, setLanguage] = useState('en');
  const [translated, setTranslated] = useState(null); // { source, lang, data }
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateFailed, setTranslateFailed] = useState(false);

  // Translate the scan result text whenever a non-English language is selected
  useEffect(() => {
    if (language === 'en' || !analysisResult) { setTranslateFailed(false); return; }
    if (translated && translated.source === analysisResult && translated.lang === language) return;
    let cancelled = false;
    setIsTranslating(true);
    setTranslateFailed(false);
    translateResult(analysisResult, language, customApiKey)
      .then(data => { if (!cancelled) setTranslated({ source: analysisResult, lang: language, data }); })
      .catch(() => { if (!cancelled) setTranslateFailed(true); })
      .finally(() => { if (!cancelled) setIsTranslating(false); });
    return () => { cancelled = true; };
  }, [language, analysisResult]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayResult = (language !== 'en' && translated && translated.source === analysisResult && translated.lang === language)
    ? translated.data
    : analysisResult;

  // Load system health on mount
  useEffect(() => {
    checkHealth().then(status => {
      setSystemStatus(status);
    });
  }, []);

  const handleSaveApiKey = (key) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('VISION_AI_CUSTOM_KEY', key);
    } else {
      localStorage.removeItem('VISION_AI_CUSTOM_KEY');
    }
  };

  const handleStartAnalysis = async (file, context) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPatientContext(context);

    // Create preview data URL
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    const steps = [
      'Normalizing high-resolution dermal specimen...',
      'Segmenting borders, erythema, and pigment features...',
      'Consulting Deep Vision Neural Core...',
      'Synthesizing differential diagnoses & care protocols...'
    ];

    let stepIndex = 0;
    setAnalysisStepText(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setAnalysisStepText(steps[stepIndex]);
      }
    }, 900);

    try {
      const response = await analyzeSkinImage(file, context, customApiKey);
      clearInterval(stepInterval);
      if (response.success) {
        setAnalysisResult(response.result);
      } else {
        alert('Analysis error: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      clearInterval(stepInterval);
      alert('Error connecting to backend: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetScan = () => {
    setAnalysisResult(null);
    setPreviewImage(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Persistent Medical Disclaimer Banner */}
      <MedicalDisclaimer language={language} />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1, paddingBottom: '3.5rem' }}>
        
        {/* Tab 1: Scan & Screening */}
        {activeTab === 'scan' && (
          <div>
            {!analysisResult && !isAnalyzing && (
              <>
                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '1.2rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 1rem',
                    borderRadius: '999px',
                    background: '#e0f2fe',
                    border: '1px solid #bae6fd',
                    color: '#0284c7',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem'
                  }}>
                    <Sparkles size={14} />
                    <span>NEXT-GEN AI DERMATOLOGY SCREENING</span>
                  </div>

                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                    {language === 'ta' ? 'அதிநவீன AI தோல் நோய் பரிசோதனை' : 'Intelligent AI-Assisted Skin Lesion Screening'}
                  </h1>

                  <p style={{ fontSize: '1.02rem', color: '#64748b', maxWidth: '640px', margin: '0.5rem auto 0 auto', lineHeight: 1.6 }}>
                    {language === 'ta'
                      ? 'உங்கள் தோல் பிரச்சினையின் புகைப்படத்தை பதிவேற்றி ஆழ்ந்த விஷன் AI மூலம் உடனடி சாத்தியமான நிலைகள், ஆபத்து நிலை மற்றும் வீட்டு பராமரிப்பு ஆலோசனைகளைப் பெறுங்கள்.'
                      : 'Upload or capture a photo of any rash, bump, or lesion. Clinical AI provides preliminary differential diagnosis, severity rating, and doctor consultation guidance.'}
                  </p>
                </div>

                {/* Upload Form */}
                <ImageUploader 
                  onStartAnalysis={handleStartAnalysis}
                  isAnalyzing={isAnalyzing}
                  language={language}
                />
              </>
            )}

            {/* Analyzing Progress State */}
            {isAnalyzing && (
              <div style={{ maxWidth: '600px', margin: '5rem auto', textAlign: 'center', background: '#ffffff' }} className="glass-panel">
                <div style={{ padding: '3.5rem 2rem' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    border: '2px solid #0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 4px 20px rgba(2, 132, 199, 0.25)'
                  }}>
                    <Activity size={38} color="#0284c7" style={{ animation: 'pulse 1.5s infinite' }} />
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {language === 'ta' ? 'AI விஷன் ஆய்வு செய்கிறது...' : 'Clinical AI Vision Analyzing...'}
                  </h3>
                  
                  <p style={{ fontSize: '0.94rem', color: '#0284c7', fontWeight: 600, marginBottom: '1.5rem', minHeight: '24px' }}>
                    {analysisStepText}
                  </p>

                  <div className="progress-track" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{ width: '85%', animation: 'pulse 1.8s infinite' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Result View */}
            {analysisResult && !isAnalyzing && (language !== 'en') && (isTranslating || translateFailed) && (
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: translateFailed ? '#b91c1c' : '#0284c7', fontWeight: 600, marginBottom: '0.75rem' }}>
                {translateFailed ? 'மொழிபெயர்ப்பு தோல்வியடைந்தது. ஆங்கிலத்தில் காட்டப்படுகிறது.' : 'முடிவுகள் தமிழில் மொழிபெயர்க்கப்படுகின்றன...'}
              </div>
            )}
            {analysisResult && !isAnalyzing && (
              <AnalysisResult 
                result={displayResult}
                previewImage={previewImage}
                patientContext={patientContext}
                onReset={handleResetScan}
                onViewHistory={() => setActiveTab('history')}
                language={language}
              />
            )}

            {/* Extras: trusted info, nearby doctors, local UV/weather */}
            {analysisResult && !isAnalyzing && (
              <>
                <VerifiedInfo
                  condition={analysisResult.possible_conditions?.[0]?.name}
                  language={language}
                  customApiKey={customApiKey}
                />
                <CareGuide
                  condition={analysisResult.possible_conditions?.[0]?.name}
                  urgency={analysisResult.see_doctor_urgency}
                  language={language}
                />
                <NearbyDoctors urgency={analysisResult.see_doctor_urgency} language={language} />
              </>
            )}
            {!isAnalyzing && (
              <EnvironmentCard
                language={language}
                condition={analysisResult?.possible_conditions?.[0]?.name || ''}
              />
            )}
          </div>
        )}

        {/* Tab 2: Scan History from MongoDB */}
        {activeTab === 'history' && (
          <ScanHistory 
            onSelectScan={(record) => {
              setAnalysisResult({
                possible_conditions: record.possibleConditions,
                visible_features: record.visibleFeatures,
                home_care_advice: record.homeCareAdvice,
                see_doctor_urgency: record.seeDoctorUrgency,
                clinical_summary: record.clinicalSummary,
                immediate_care_signs: record.immediateCareSigns,
                disclaimer: record.disclaimer,
                aiModelUsed: record.aiModelUsed
              });
              setPreviewImage(record.imageThumbnail);
              setPatientContext({
                bodyLocation: record.bodyLocation,
                durationDays: record.durationDays,
                symptoms: record.symptoms
              });
              setActiveTab('scan');
            }}
            language={language}
          />
        )}

        {/* Tab 3: Guidance & ABCDE */}
        {activeTab === 'guidance' && (
          <GuidanceSection language={language} />
        )}

      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customApiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
        systemStatus={systemStatus}
        language={language}
      />

      {/* Floating Chatbot */}
      <ChatWidget scanContext={analysisResult} customApiKey={customApiKey} language={language} />

      {/* Minimal Footer */}
      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '1.5rem 0',
        background: '#ffffff',
        fontSize: '0.82rem',
        color: '#64748b',
        textAlign: 'center'
      }}>
        <div className="app-container">
          <p>
            SkinGuard AI • Powered by Deep Vision AI Neural Engine & MongoDB • Built for preliminary visual screening
          </p>
        </div>
      </footer>

    </div>
  );
}
