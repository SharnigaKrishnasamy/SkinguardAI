import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { retrieve } from '../rag/retriever.js';

const router = express.Router();

const MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

const buildSystemPrompt = (scanContext, language, sources = []) => {
  let p = `You are SkinGuard Assistant, a friendly chatbot inside a skin-screening app.
You help users understand skin conditions, scan results, skincare habits, and when to see a doctor.
Rules:
- Keep answers short (2-5 sentences) and easy to read. Use simple words.
- You are NOT a doctor. Never give a definitive diagnosis or prescribe medication or doses.
- If the user describes red-flag symptoms (rapid spreading, fever, pus, severe pain, bleeding or changing moles, trouble breathing, swelling of face/lips), tell them to seek medical care promptly.
- Politely decline topics unrelated to skin, hair, nails, or the app.
- Address EVERY word and part of the user's question, including multi-word condition names (e.g. "acne vulgaris", not just "acne").
- ${language === 'ta'
    ? 'Reply ONLY in Tamil script (English medical terms in brackets are fine). Never use any other language or script such as Korean, Chinese or Hindi.'
    : "Reply in the same language the user writes in (default English). Never mix in other languages or scripts."}`;

  if (scanContext && scanContext.clinical_summary) {
    const top = (scanContext.possible_conditions || []).slice(0, 3)
      .map(c => `${c.name} (${c.likelihood_percent}%)`).join(', ');
    p += `\n\nThe user's latest scan result (for context only):
- Possible conditions: ${top || 'n/a'}
- Summary: ${scanContext.clinical_summary}
- Doctor urgency: ${scanContext.see_doctor_urgency || 'n/a'}`;
  }

  if (sources.length) {
    p += `\n\nREFERENCE EXCERPTS (from NHS and DermNet NZ):\n`;
    for (const src of sources) {
      p += `\n[${src.n}] ${src.org} - ${src.title} (${src.url})\n${src.texts.join('\n---\n')}\n`;
    }
    p += `\nGrounding rules:
- Base medical facts ONLY on the excerpts above. Do not add facts that are not in them.
- Cite the supporting excerpt with its number in square brackets, e.g. [1], right after the claim.
- If the excerpts do not answer the question, say you don't have verified information on that and suggest a pharmacist or doctor. Never invent sources or numbers.
- Always end with a one-line safety reminder when the user describes symptoms: this is general information, not a diagnosis, and a doctor should check anything severe, spreading, painful, bleeding, or changing.`;
  }
  return p;
};

router.post('/', async (req, res) => {
  try {
    const { messages = [], scanContext = null, language = 'en' } = req.body || {};
    const apiKey =
      req.headers['x-api-key'] || req.headers['x-gemini-key'] ||
      process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'No message provided.' });
    }
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(503).json({ success: false, error: 'Chatbot is not configured (missing API key).' });
    }

    // Keep last 12 turns, cap length, and map to Gemini roles
    const recent = messages.slice(-12).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      text: String(m.content || '').slice(0, 1500)
    }));
    const last = recent.pop();
    if (!last || last.role !== 'user') {
      return res.status(400).json({ success: false, error: 'Last message must be from the user.' });
    }
    while (recent.length && recent[0].role !== 'user') recent.shift(); // history must start with user
    const history = recent.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

    // RAG: retrieve trusted excerpts (falls back to plain chat if no store / retrieval fails)
    let sources = [];
    try {
      const split = (t) => String(t || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
      const userTurns = messages.filter(m => m.role !== 'assistant').map(m => split(m.content));
      const lastQ = userTurns[userTurns.length - 1] || '';
      const prevQ = lastQ.length < 40 ? (userTurns[userTurns.length - 2] || '') : '';
      const topCondition = scanContext?.possible_conditions?.[0]?.name;
      const query = [prevQ, lastQ, lastQ.length < 40 ? topCondition : ''].filter(Boolean).join(' ').slice(0, 1000);
      const chunks = await retrieve(query, apiKey);
      const byUrl = new Map();
      for (const c of chunks) {
        if (!byUrl.has(c.url)) byUrl.set(c.url, { n: byUrl.size + 1, org: c.org, title: c.title, url: c.url, texts: [] });
        byUrl.get(c.url).texts.push(c.text);
      }
      sources = [...byUrl.values()];
    } catch (err) {
      console.warn('[Chat RAG] retrieval skipped:', String(err.message).slice(0, 100));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = buildSystemPrompt(scanContext, language, sources);

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction, generationConfig: { temperature: 0.3 } });
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(last.text);
        const reply = result.response.text().trim();
        const cited = new Set([...reply.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1])));
        const citedSources = sources
          .filter(x => cited.has(x.n))
          .map(({ n, org, title, url }) => ({ n, org, title, url }));
        return res.json({ success: true, reply, sources: citedSources, grounded: sources.length > 0 });
      } catch (err) {
        console.warn(`[Chat] ${modelName} failed: ${String(err.message).slice(0, 90)}`);
        await new Promise(r => setTimeout(r, 300));
      }
    }
    return res.status(503).json({ success: false, error: 'Assistant is busy right now. Please try again in a moment.' });
  } catch (error) {
    console.error('[Chat Route Error]', error);
    return res.status(500).json({ success: false, error: 'Chat failed.' });
  }
});

export default router;
