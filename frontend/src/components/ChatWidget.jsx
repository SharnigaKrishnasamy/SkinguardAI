import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { sendChatMessage, fetchSpeech } from '../utils/api';

const T = {
  en: {
    title: 'SkinGuard Assistant',
    sub: 'Ask about skin care or your results',
    placeholder: 'Type or tap the mic...',
    listening: 'Listening...',
    hello: "Hi! I'm your skin-care assistant. Ask me about skin conditions, your scan results, or when to see a doctor. You can also use the mic to talk.",
    error: 'Sorry, something went wrong. Please try again.',
    note: 'Not a substitute for a doctor.',
    sources: 'Sources',
    micDenied: 'Microphone permission was denied. Allow it in your browser settings.',
    noSpeech: "Didn't hear anything. Tap the mic and try again.",
    micError: 'Voice input failed. Please try again.',
    noVoice: 'Voice is not available right now, so the reply cannot be read aloud.',
    voiceLoading: 'Preparing voice...',
    noMic: "Voice input isn't supported in this browser. Use your keyboard's mic button instead.",
    speakOn: 'Read replies aloud: on',
    speakOff: 'Read replies aloud: off'
  },
  ta: {
    title: 'SkinGuard உதவியாளர்',
    sub: 'தோல் பராமரிப்பு அல்லது முடிவுகள் பற்றி கேளுங்கள்',
    placeholder: 'எழுதுங்கள் அல்லது மைக்கை அழுத்துங்கள்...',
    listening: 'கேட்கிறேன்...',
    hello: 'வணக்கம்! தோல் நிலைகள், ஸ்கேன் முடிவுகள் அல்லது மருத்துவரை எப்போது பார்க்க வேண்டும் என்பது பற்றி கேளுங்கள். மைக்கை அழுத்தி பேசவும் செய்யலாம்.',
    error: 'மன்னிக்கவும், ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    note: 'மருத்துவருக்கு மாற்று அல்ல.',
    sources: 'ஆதாரங்கள்',
    micDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவி அமைப்புகளில் அனுமதியுங்கள்.',
    noSpeech: 'குரல் கேட்கவில்லை. மைக்கை அழுத்தி மீண்டும் முயற்சிக்கவும்.',
    micError: 'குரல் உள்ளீடு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    noVoice: 'குரல் இப்போது கிடைக்கவில்லை, அதனால் பதிலை வாசிக்க முடியாது.',
    voiceLoading: 'குரலைத் தயார் செய்கிறது...',
    noMic: 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. உங்கள் விசைப்பலகையின் மைக்கைப் பயன்படுத்தவும்.',
    speakOn: 'பதிலை வாசித்தல்: இயக்கத்தில்',
    speakOff: 'பதிலை வாசித்தல்: நிறுத்தத்தில்'
  }
};

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
const voiceLang = (language) => (language === 'ta' ? 'ta-IN' : 'en-IN');
const cleanForSpeech = (txt) => txt.replace(/\[\d+\]/g, '').replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim();

export default function ChatWidget({ scanContext, customApiKey, language = 'en' }) {
  const t = T[language] || T.en;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const endRef = useRef(null);
  const recRef = useRef(null);
  const audioRef = useRef(null);
  const messagesRef = useRef([]);
  const loadingRef = useRef(false);
  const propsRef = useRef({});

  messagesRef.current = messages;
  loadingRef.current = loading;
  propsRef.current = { scanContext, customApiKey, language, speakReplies, t };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  // Some browsers load voices asynchronously
  useEffect(() => {
    window.speechSynthesis?.getVoices();
  }, []);

  // Stop mic and speech when the chat is closed
  useEffect(() => {
    if (!open) {
      window.speechSynthesis?.cancel();
      audioRef.current?.pause();
      try { recRef.current?.abort(); } catch (e) { /* ignore */ }
      setListening(false);
    }
  }, [open]);

  // Tamil with no installed browser voice -> generate speech on the server (Gemini TTS)
  const speakViaServer = async (text) => {
    const { language: lang, customApiKey: key, t: tt } = propsRef.current;
    audioRef.current?.pause();
    setVoiceNote(tt.voiceLoading);
    try {
      const blob = await fetchSpeech(cleanForSpeech(text), lang, key);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audioRef.current = audio;
      setVoiceNote('');
      await audio.play();
    } catch (e) {
      setVoiceNote(tt.noVoice);
    }
  };

  const speak = async (text) => {
    const synth = window.speechSynthesis;
    const { language: lang } = propsRef.current;
    const wanted = voiceLang(lang);
    const voices = synth ? synth.getVoices() : [];
    const voice =
      voices.find(v => v.lang.replace('_', '-').toLowerCase() === wanted.toLowerCase()) ||
      voices.find(v => v.lang.toLowerCase().startsWith(wanted.slice(0, 2)));
    if (lang === 'ta' && !voice) {
      await speakViaServer(text);
      return;
    }
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
    u.lang = wanted;
    if (voice) u.voice = voice;
    u.rate = 0.95;
    synth.cancel();
    synth.speak(u);
  };

  const send = async (override, viaVoice = false) => {
    const text = String(override ?? input).trim();
    if (!text || loadingRef.current) return;
    const next = [...messagesRef.current, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setVoiceNote('');
    setLoading(true);
    try {
      const p = propsRef.current;
      const { reply, sources } = await sendChatMessage(next, p.scanContext, p.language, p.customApiKey);
      setMessages([...next, { role: 'assistant', content: reply, sources }]);
      if (viaVoice || p.speakReplies) speak(reply);
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: err.message || propsRef.current.t.error, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!SR || listening) return;
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setVoiceNote('');
    const rec = new SR();
    rec.lang = voiceLang(language);
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = '';

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInput((finalText + interim).trim());
    };
    rec.onerror = (e) => {
      const tt = propsRef.current.t;
      setVoiceNote(
        e.error === 'not-allowed' || e.error === 'service-not-allowed' ? tt.micDenied
        : e.error === 'no-speech' ? tt.noSpeech
        : tt.micError
      );
    };
    rec.onend = () => {
      setListening(false);
      if (finalText.trim()) send(finalText.trim(), true);
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      setVoiceNote(t.micError);
    }
  };

  const stopListening = () => {
    try { recRef.current?.stop(); } catch (e) { /* ignore */ }
  };

  const toggleSpeak = () => {
    if (speakReplies) { window.speechSynthesis?.cancel(); audioRef.current?.pause(); }
    setSpeakReplies(!speakReplies);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const bubble = (m) => ({
    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
    maxWidth: '85%',
    padding: '0.6rem 0.85rem',
    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
    background: m.role === 'user' ? '#0284c7' : m.isError ? '#fee2e2' : '#f1f5f9',
    color: m.role === 'user' ? '#fff' : m.isError ? '#b91c1c' : '#0f172a',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  });

  const iconBtn = { background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' };

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', right: '1rem', bottom: '5rem', zIndex: 1000,
          width: 'min(380px, calc(100vw - 2rem))', height: 'min(540px, calc(100vh - 7rem))',
          background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0',
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.25)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '0.85rem 1rem', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{t.title}</div>
              <div style={{ fontSize: '0.74rem', opacity: 0.9 }}>{t.sub}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button onClick={toggleSpeak} aria-label={speakReplies ? t.speakOn : t.speakOff} title={speakReplies ? t.speakOn : t.speakOff} style={iconBtn}>
                {speakReplies ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close chat" style={iconBtn}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={bubble({ role: 'assistant' })}>{t.hello}</div>
            {messages.map((m, i) => (
              <div key={i} style={bubble(m)}>
                {m.content}
                {m.sources?.length > 0 && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #e2e8f0', fontSize: '0.76rem' }}>
                    <div style={{ fontWeight: 700, color: '#475569', marginBottom: 2 }}>{t.sources}</div>
                    {m.sources.map(src => (
                      <div key={src.url}>
                        [{src.n}]{' '}
                        <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7' }}>
                          {src.org}: {src.title}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ ...bubble({ role: 'assistant' }), color: '#64748b' }}>...</div>}
            <div ref={endRef} />
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', padding: '0.6rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder={listening ? t.listening : t.placeholder}
                maxLength={1000}
                style={{ flex: 1, minWidth: 0, padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '16px', outline: 'none' }}
              />
              {SR && (
                <button
                  onClick={listening ? stopListening : startListening}
                  disabled={loading}
                  aria-label={listening ? 'Stop listening' : 'Speak'}
                  style={{
                    width: 42, border: listening ? '2px solid #dc2626' : '1px solid #cbd5e1', borderRadius: '10px',
                    background: listening ? '#fee2e2' : '#fff', color: listening ? '#dc2626' : '#0284c7',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: loading ? 0.5 : 1
                  }}>
                  {listening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              )}
              <button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send"
                style={{
                  width: 42, border: 'none', borderRadius: '10px', background: '#0284c7', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.5 : 1
                }}>
                <Send size={18} />
              </button>
            </div>
            {voiceNote && <div style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '0.4rem' }}>{voiceNote}</div>}
            {!SR && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem' }}>{t.noMic}</div>}
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.4rem' }}>{t.note}</div>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)} aria-label="Open chat"
        style={{
          position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%', border: 'none', background: '#0284c7', color: '#fff',
          cursor: 'pointer', boxShadow: '0 6px 20px rgba(2, 132, 199, 0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </>
  );
}
