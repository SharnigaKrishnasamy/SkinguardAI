import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { retrieve, ragReady } from '../rag/retriever.js';

const router = express.Router();
const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

// Scan result -> trusted NHS / DermNet care information for the predicted condition
router.post('/', async (req, res) => {
  try {
    const { condition, language = 'en' } = req.body || {};
    const apiKey = req.headers['x-api-key'] || req.headers['x-gemini-key'] || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!condition || typeof condition !== 'string') return res.status(400).json({ success: false, error: 'No condition given.' });
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return res.status(503).json({ success: false, error: 'Missing API key.' });
    if (!ragReady()) return res.json({ success: true, text: null, sources: [] });

    const name = condition.replace(/\s+/g, ' ').slice(0, 120);
    const chunks = await retrieve(`${name} symptoms treatment self-care when to see a doctor`, apiKey, 6);
    if (!chunks.length) return res.json({ success: true, text: null, sources: [] });

    const byUrl = new Map();
    for (const c of chunks) {
      if (!byUrl.has(c.url)) byUrl.set(c.url, { n: byUrl.size + 1, org: c.org, title: c.title, url: c.url, texts: [] });
      byUrl.get(c.url).texts.push(c.text);
    }
    const sources = [...byUrl.values()];

    const prompt = `You summarise trusted medical web pages for patients.
Condition: ${name}
Use ONLY the excerpts below. If they are not about this condition (or a very close synonym), reply with exactly: NO_MATCH
Otherwise write 4-6 short bullet points, each starting with "- ", covering: what it is, common self-care, and when to see a doctor or get urgent help.
Put the excerpt number like [1] at the end of each bullet. Use simple words. Do not diagnose and do not give drug doses.
${language === 'ta'
  ? 'Write ONLY in Tamil script (English medical terms in brackets are fine). Never use any other language or script.'
  : 'Write in English.'}

EXCERPTS:
${sources.map(s => `[${s.n}] ${s.org} - ${s.title}\n${s.texts.join('\n---\n')}`).join('\n\n')}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { temperature: 0.2 } });
        const out = await model.generateContent(prompt);
        const text = out.response.text().trim();
        if (/^NO_MATCH/i.test(text)) return res.json({ success: true, text: null, sources: [] });
        const cited = new Set([...text.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1])));
        const citedSources = sources.filter(s => cited.has(s.n)).map(({ n, org, title, url }) => ({ n, org, title, url }));
        return res.json({ success: true, text, sources: citedSources });
      } catch (err) {
        console.warn(`[Verified] ${modelName} failed: ${String(err.message).slice(0, 90)}`);
        await new Promise(r => setTimeout(r, 300));
      }
    }
    return res.status(503).json({ success: false, error: 'Busy. Please try again.' });
  } catch (e) {
    console.error('[Verified Route Error]', e);
    return res.status(500).json({ success: false, error: 'Failed.' });
  }
});

export default router;
