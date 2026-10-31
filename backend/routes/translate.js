import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
const LANGS = { ta: 'Tamil' };

// Fields whose text should be translated; everything else is copied unchanged
const pickTexts = (r) => ({
  possible_conditions: (r.possible_conditions || []).map(c => ({ name: c.name, description: c.description, severity: c.severity })),
  visible_features: r.visible_features || [],
  causes_and_triggers: r.causes_and_triggers || [],
  prevention_tips: r.prevention_tips || [],
  home_care_advice: r.home_care_advice || [],
  clinical_summary: r.clinical_summary || '',
  immediate_care_signs: r.immediate_care_signs || [],
  disclaimer: r.disclaimer || ''
});

router.post('/', async (req, res) => {
  try {
    const { result, language = 'ta' } = req.body || {};
    const apiKey = req.headers['x-api-key'] || req.headers['x-gemini-key'] || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    const langName = LANGS[language];
    if (!result || !langName) return res.status(400).json({ success: false, error: 'Invalid request.' });
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return res.status(503).json({ success: false, error: 'Missing API key.' });

    const prompt = `Translate every string value in this JSON into ${langName}.
Rules:
- Return ONLY valid JSON with exactly the same structure and keys. No markdown fences.
- Write only in ${langName} script. Never use any other language or script (no Korean, Chinese, Hindi, etc.).
- For condition names, write the ${langName} name followed by the English name in brackets, e.g. "முகப்பரு (Acne Vulgaris)".
- Keep numbers, units and drug names accurate. Do not add or remove items.

${JSON.stringify(pickTexts(result))}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { temperature: 0.2 } });
        const out = await model.generateContent(prompt);
        let text = out.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
        const m = text.match(/\{[\s\S]*\}/);
        const t = JSON.parse(m ? m[0] : text);

        const merged = {
          ...result,
          possible_conditions: (result.possible_conditions || []).map((c, i) => ({ ...c, ...(t.possible_conditions?.[i] || {}) })),
          visible_features: t.visible_features || result.visible_features,
          causes_and_triggers: t.causes_and_triggers || result.causes_and_triggers,
          prevention_tips: t.prevention_tips || result.prevention_tips,
          home_care_advice: t.home_care_advice || result.home_care_advice,
          clinical_summary: t.clinical_summary || result.clinical_summary,
          immediate_care_signs: t.immediate_care_signs || result.immediate_care_signs,
          disclaimer: t.disclaimer || result.disclaimer
        };
        return res.json({ success: true, result: merged });
      } catch (err) {
        console.warn(`[Translate] ${modelName} failed: ${String(err.message).slice(0, 90)}`);
        await new Promise(r => setTimeout(r, 300));
      }
    }
    return res.status(503).json({ success: false, error: 'Translation is busy. Please try again.' });
  } catch (e) {
    console.error('[Translate Route Error]', e);
    return res.status(500).json({ success: false, error: 'Translation failed.' });
  }
});

export default router;
