// Usage:  npm run ingest            (fetch -> clean -> chunk -> embed -> save)
//         npm run ingest -- --dry   (fetch -> clean -> chunk only, prints stats)
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { htmlToSections, chunkSections } from './text.js';
import { embedDocuments, EMBED_MODEL, EMBED_DIM } from './embed.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dry = process.argv.includes('--dry');
const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
const sources = JSON.parse(fs.readFileSync(path.join(__dirname, 'sources.json'), 'utf8'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const allChunks = [];

// Step 1: collect (polite: identified user-agent, 1.5s gap between requests)
for (const src of sources) {
  try {
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'SkinGuardRAG/1.0 (educational project)' },
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) { console.warn(`✗ ${res.status} ${src.url}`); continue; }
    const { sections } = htmlToSections(await res.text());
    const chunks = chunkSections(`${src.org}: ${src.title}`, sections);
    chunks.forEach((c, i) => allChunks.push({
      id: `${src.org}-${src.title}-${i}`.replace(/\s+/g, '_'),
      org: src.org, title: src.title, url: src.url, heading: c.heading, text: c.text
    }));
    console.log(`✓ ${src.org} / ${src.title}: ${chunks.length} chunks`);
  } catch (e) {
    console.warn(`✗ ${src.url} (${e.message})`);
  }
  await sleep(1500);
}

console.log(`\nTotal chunks: ${allChunks.length}`);
if (dry || allChunks.length === 0) process.exit(0);

if (!apiKey) { console.error('Set GEMINI_API_KEY in backend/.env first.'); process.exit(1); }

// Step 3: embed and store (small batches + cache, so free-tier limits can't lose progress)
const cachePath = path.join(__dirname, 'embed-cache.json');
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
const keyOf = (c) => crypto.createHash('md5').update(c.text).digest('hex');
const todo = allChunks.filter(c => !cache[keyOf(c)]);
console.log(`Embedding ${todo.length} chunks (${allChunks.length - todo.length} already cached)`);

const BATCH = 15;
for (let i = 0; i < todo.length; i += BATCH) {
  const batch = todo.slice(i, i + BATCH);
  const vecs = await embedDocuments(batch.map(c => ({ text: c.text, title: `${c.org}: ${c.title}` })), apiKey, BATCH);
  batch.forEach((c, j) => { cache[keyOf(c)] = vecs[j]; });
  fs.writeFileSync(cachePath, JSON.stringify(cache));
  console.log(`  ${Math.min(i + BATCH, todo.length)}/${todo.length} done`);
  if (i + BATCH < todo.length) await sleep(12000);
}
allChunks.forEach(c => { c.embedding = cache[keyOf(c)]; });

const file = path.join(__dirname, 'store.json');
fs.writeFileSync(file, JSON.stringify({ model: EMBED_MODEL, dim: EMBED_DIM, createdAt: new Date().toISOString(), chunks: allChunks }));
console.log(`Saved ${allChunks.length} chunks -> ${file}`);
