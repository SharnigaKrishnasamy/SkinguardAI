import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { embedQuery } from './embed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, 'store.json');
let cache = null;

const loadStore = () => {
  if (cache) return cache;
  if (!fs.existsSync(STORE_PATH)) return null;
  cache = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  return cache;
};

export const ragReady = () => Boolean(loadStore()?.chunks?.length);

// vectors are pre-normalised, so dot product == cosine similarity
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

export async function retrieve(query, apiKey, k = Number(process.env.RAG_TOP_K || 4)) {
  const store = loadStore();
  if (!store) return [];
  const minScore = Number(process.env.RAG_MIN_SCORE || 0.5);
  const q = await embedQuery(query, apiKey);
  const ranked = store.chunks
    .map(c => ({ ...c, score: dot(q, c.embedding) }))
    .filter(c => c.score >= minScore)
    .sort((a, b) => b.score - a.score);
  const picks = ranked.slice(0, k);
  // make sure each organisation (NHS / DermNet) that matched is represented
  for (const org of new Set(ranked.map(c => c.org))) {
    if (!picks.some(c => c.org === org)) {
      const best = ranked.find(c => c.org === org);
      if (best) picks[picks.length - 1] = best;
    }
  }
  return picks;
}
