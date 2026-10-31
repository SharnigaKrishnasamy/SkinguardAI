// Gemini embeddings via REST (stable regardless of SDK version)
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const EMBED_MODEL = process.env.EMBED_MODEL || 'gemini-embedding-001';
export const EMBED_DIM = Number(process.env.EMBED_DIM || 768);

const normalize = (v) => {
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => Number((x / n).toFixed(6)));
};

async function post(path, body, apiKey, tries = 8) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`${BASE}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body)
    });
    if (res.ok) return res.json();
    if (res.status === 429 && i < tries - 1) {
      console.log('  Rate limit hit, waiting 65s then retrying...');
      await new Promise(r => setTimeout(r, 65000));
      continue;
    }
    if ([500, 503].includes(res.status) && i < tries - 1) {
      await new Promise(r => setTimeout(r, 3000 * (i + 1)));
      continue;
    }
    throw new Error(`Embedding API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

export async function embedDocuments(items, apiKey, batchSize = 50) {
  const out = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const data = await post(`models/${EMBED_MODEL}:batchEmbedContents`, {
      requests: batch.map(it => ({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: it.text }] },
        taskType: 'RETRIEVAL_DOCUMENT',
        title: it.title,
        outputDimensionality: EMBED_DIM
      }))
    }, apiKey);
    out.push(...data.embeddings.map(e => normalize(e.values)));
  }
  return out;
}

export async function embedQuery(text, apiKey) {
  const data = await post(`models/${EMBED_MODEL}:embedContent`, {
    model: `models/${EMBED_MODEL}`,
    content: { parts: [{ text }] },
    taskType: 'RETRIEVAL_QUERY',
    outputDimensionality: EMBED_DIM
  }, apiKey);
  return normalize(data.embedding.values);
}
