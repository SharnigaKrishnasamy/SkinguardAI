import express from 'express';

const router = express.Router();
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODELS = (process.env.TTS_MODELS || 'gemini-2.5-flash-preview-tts,gemini-2.5-pro-preview-tts').split(',');
const VOICE = process.env.TTS_VOICE || 'Kore';

// Gemini returns raw 16-bit mono PCM @ 24kHz; browsers need a WAV header to play it
export function pcmToWav(pcm, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);            // PCM
  header.writeUInt16LE(1, 22);            // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

const clean = (t) => String(t || '').replace(/\[\d+\]/g, '').replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim();

// keep audio short (saves quota): cut at a sentence end near 900 chars
const clip = (t, max = 900) => {
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const end = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('?'), cut.lastIndexOf('!'), cut.lastIndexOf('।'));
  return end > 200 ? cut.slice(0, end + 1) : cut;
};

router.post('/', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['x-gemini-key'] || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    const text = clip(clean(req.body?.text));
    if (!text) return res.status(400).json({ success: false, error: 'No text.' });
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return res.status(503).json({ success: false, error: 'Missing API key.' });

    let lastErr = '';
    for (const model of MODELS) {
      try {
        const r = await fetch(`${BASE}/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Say in a calm, clear, friendly tone: ${text}` }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } }
            }
          })
        });
        if (!r.ok) { lastErr = `${model} ${r.status}: ${(await r.text()).slice(0, 120)}`; continue; }
        const j = await r.json();
        const b64 = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        if (!b64) { lastErr = `${model}: no audio returned`; continue; }
        const wav = pcmToWav(Buffer.from(b64, 'base64'));
        res.set({ 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store' });
        return res.send(wav);
      } catch (e) {
        lastErr = `${model}: ${String(e.message).slice(0, 100)}`;
      }
    }
    console.warn('[Speak] failed:', lastErr);
    return res.status(503).json({ success: false, error: 'Voice is unavailable right now.' });
  } catch (e) {
    console.error('[Speak Route Error]', e);
    return res.status(500).json({ success: false, error: 'Voice failed.' });
  }
});

export default router;
