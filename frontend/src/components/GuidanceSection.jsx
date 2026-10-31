import React from 'react';
import { FileCheck, Stethoscope, Compass } from 'lucide-react';

export default function GuidanceSection({ language }) {
  const isTamil = language === 'ta';

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Info */}
      <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)', border: '1px solid #bae6fd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <Stethoscope size={28} color="#0284c7" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            {isTamil ? 'மருத்துவ வழிகாட்டல் மற்றும் தோல் ஆரோக்கிய நெறிமுறைகள்' : 'Clinical Screening Protocols & Dermatologist Guide'}
          </h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '850px', lineHeight: 1.6 }}>
          {isTamil 
            ? 'இந்த AI தொழில்நுட்பம் ஆரம்பக்கட்ட வழிகாட்டலுக்கு மட்டுமே. தோல் நோய் அல்லது மச்சங்களில் சந்தேகமிருந்தால் உடனடியாக மருத்துவரை அணுகுவதற்கான உலகளாவிய ABCDE நெறிமுறைகள் கீழே கொடுக்கப்பட்டுள்ளன.'
            : 'SkinGuard AI combines high-resolution visual feature extraction with advanced Deep Vision Neural Networks. Below are internationally recognized clinical rules to help patients recognize suspicious lesions.'}
        </p>
      </div>

      {/* ABCDE Rule Card Grid */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={20} color="#0284c7" />
          {isTamil ? 'மச்சம் & தோல் புற்றுநோய் ABCDE விதிகள்' : 'The Dermatological ABCDE Melanoma Rule'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>A</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
              {isTamil ? 'சமச்சீரற்ற தன்மை (Asymmetry)' : 'Asymmetry'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {isTamil ? 'மச்சத்தின் ஒரு பாதி மற்ற பாதியுடன் பொருந்தாமல் இருப்பது.' : 'One half of the mole does not match the other half in shape or appearance.'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>B</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
              {isTamil ? 'ஒழுங்கற்ற எல்லை (Border)' : 'Border Irregularity'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {isTamil ? 'விளிம்புகள் சீரற்றதாக, மங்கலாக அல்லது வெட்டப்பட்டிருப்பது.' : 'The edges are irregular, ragged, notched, or blurred.'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>C</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
              {isTamil ? 'நிற மாற்றம் (Color)' : 'Color Variation'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {isTamil ? 'ஒரே சீரான நிறம் இல்லாமல் பழுப்பு, கருப்பு, சிவப்பு கலந்திருப்பது.' : 'The color is not uniform and may include different shades of brown, black, red, or blue.'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ea580c' }}>D</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
              {isTamil ? 'விட்டம் (Diameter)' : 'Diameter > 6mm'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {isTamil ? 'மச்சத்தின் அளவு பென்சில் ரப்பரை விட (6 மிமீ) பெரிதாக இருப்பது.' : 'The spot is larger than 6 millimeters across (about the size of a pencil eraser).'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626' }}>E</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
              {isTamil ? 'மாற்றம் (Evolving)' : 'Evolving'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {isTamil ? 'அளவு, வடிவம், அல்லது அரிப்பு திடீரென மாறுவது.' : 'The mole is changing in size, shape, color, or causing new symptoms like itching or bleeding.'}
            </p>
          </div>

        </div>
      </div>

      {/* Questions to Ask Doctor */}
      <div className="glass-panel" style={{ padding: '1.8rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck size={20} color="#059669" />
          {isTamil ? 'மருத்துவரிடம் கேட்க வேண்டிய முக்கியமான கேள்விகள்' : 'Checklist: Questions to Ask Your Dermatologist'}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.88rem', color: '#334155' }}>
              1. {isTamil ? 'இந்த புண் அல்லது தடிப்பின் உண்மையான மூல காரணம் என்ன?' : 'What is the exact diagnosis of this lesion, and is a skin scraping or biopsy necessary?'}
            </p>
          </div>
          <div style={{ padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.88rem', color: '#334155' }}>
              2. {isTamil ? 'இது மற்றவர்களுக்கோ அல்லது உடலின் பிற பாகங்களுக்கோ பரவுமா?' : 'Is this condition contagious to family members or likely to spread to other body sites?'}
            </p>
          </div>
          <div style={{ padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.88rem', color: '#334155' }}>
              3. {isTamil ? 'நான் தவிர்க்க வேண்டிய உணவுகள் அல்லது சோப்புகள் எவை?' : 'Which topical ingredients, cosmetics, or environmental triggers should I strictly avoid?'}
            </p>
          </div>
          <div style={{ padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.88rem', color: '#334155' }}>
              4. {isTamil ? 'குணமடைய எத்தனை நாட்கள் ஆகும்?' : 'What is the expected timeframe for healing and when should I come back for a follow-up?'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
