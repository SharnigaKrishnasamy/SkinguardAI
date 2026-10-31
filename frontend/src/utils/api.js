// API Utility for communicating with backend

const API_BASE = '/api';

export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend offline');
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};

export const analyzeSkinImage = async (imageFile, patientContext = {}, customApiKey = null) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  if (patientContext.symptoms) {
    formData.append('symptoms', JSON.stringify(patientContext.symptoms));
  }
  if (patientContext.bodyLocation) {
    formData.append('bodyLocation', patientContext.bodyLocation);
  }
  if (patientContext.durationDays) {
    formData.append('durationDays', patientContext.durationDays);
  }
  if (patientContext.ageGroup) {
    formData.append('ageGroup', patientContext.ageGroup);
  }

  const headers = {};
  if (customApiKey) {
    headers['x-api-key'] = customApiKey;
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${res.status}`);
  }

  return await res.json();
};

export const fetchHistory = async () => {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to load scan history');
  return await res.json();
};

export const deleteHistoryItem = async (id) => {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete item');
  return await res.json();
};

export const clearAllHistory = async () => {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear history');
  return await res.json();
};

// Preset demo lesions generated as canvas blobs for 1-click testing
export const createSampleImageBlob = (type) => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  // Realistic skin tone background
  const skinGrad = ctx.createRadialGradient(200, 200, 50, 200, 200, 260);
  skinGrad.addColorStop(0, '#f2ceb3');
  skinGrad.addColorStop(1, '#dfb496');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 400, 400);

  // Micro skin pores texture
  ctx.fillStyle = 'rgba(180, 120, 90, 0.08)';
  for (let i = 0; i < 400; i += 8) {
    for (let j = 0; j < 400; j += 8) {
      if ((i + j) % 3 === 0) {
        ctx.fillRect(i + Math.random() * 4, j + Math.random() * 4, 2, 2);
      }
    }
  }

  if (type === 'eczema') {
    // Erythematous patchy rash with flaking
    const patchGrad = ctx.createRadialGradient(200, 200, 20, 200, 200, 110);
    patchGrad.addColorStop(0, 'rgba(215, 65, 75, 0.85)');
    patchGrad.addColorStop(0.6, 'rgba(230, 100, 100, 0.55)');
    patchGrad.addColorStop(1, 'rgba(215, 65, 75, 0)');
    ctx.fillStyle = patchGrad;
    ctx.beginPath();
    ctx.arc(200, 200, 110, 0, Math.PI * 2);
    ctx.fill();

    // Flaking and micro-papules
    ctx.fillStyle = 'rgba(255, 230, 220, 0.6)';
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 85;
      ctx.fillRect(200 + Math.cos(angle) * r, 200 + Math.sin(angle) * r, 3, 2);
    }
  } else if (type === 'ringworm') {
    // Annular ring with active borders
    ctx.lineWidth = 18;
    ctx.strokeStyle = 'rgba(210, 55, 60, 0.75)';
    ctx.beginPath();
    ctx.ellipse(200, 200, 95, 80, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    // Central clearing
    ctx.fillStyle = 'rgba(240, 195, 175, 0.4)';
    ctx.beginPath();
    ctx.arc(200, 200, 60, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Psoriasis plaque with silvery scales
    const plaque = ctx.createRadialGradient(200, 200, 15, 200, 200, 90);
    plaque.addColorStop(0, 'rgba(200, 45, 60, 0.9)');
    plaque.addColorStop(0.8, 'rgba(180, 40, 55, 0.7)');
    plaque.addColorStop(1, 'rgba(180, 40, 55, 0)');
    ctx.fillStyle = plaque;
    ctx.beginPath();
    ctx.ellipse(200, 200, 100, 75, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Silvery micaceous scale flakes
    ctx.fillStyle = 'rgba(245, 245, 250, 0.85)';
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 65;
      ctx.fillRect(200 + Math.cos(angle) * r, 200 + Math.sin(angle) * r, 4, 3);
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], `${type}-clinical-sample.jpg`, { type: 'image/jpeg' });
      resolve({ file, dataUrl: canvas.toDataURL('image/jpeg') });
    }, 'image/jpeg', 0.92);
  });
};

export const sendChatMessage = async (messages, scanContext = null, language = 'en', customApiKey = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (customApiKey) headers['x-api-key'] = customApiKey;

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, scanContext, language })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || `Server responded with ${res.status}`);
  return { reply: data.reply, sources: data.sources || [] };
};

export const translateResult = async (result, language = 'ta', customApiKey = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (customApiKey) headers['x-api-key'] = customApiKey;
  const res = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ result, language })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || `Server responded with ${res.status}`);
  return data.result;
};

export const fetchVerifiedInfo = async (condition, language = 'en', customApiKey = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (customApiKey) headers['x-api-key'] = customApiKey;
  const res = await fetch(`${API_BASE}/verified-info`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ condition, language })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || `Server responded with ${res.status}`);
  return { text: data.text, sources: data.sources || [] };
};

export const fetchSpeech = async (text, language = 'ta', customApiKey = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (customApiKey) headers['x-api-key'] = customApiKey;
  const res = await fetch(`${API_BASE}/speak`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, language })
  });
  if (!res.ok) throw new Error('Voice unavailable');
  return await res.blob();
};
