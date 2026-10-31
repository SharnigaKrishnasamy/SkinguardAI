import * as cheerio from 'cheerio';

const SKIP_HEADINGS = /^(references?|related|see also|find out more|page last reviewed|more information|cookies?|share|author|dermnet references|about us)/i;

// Step 2a: strip page chrome and split the article into headed sections
export function htmlToSections(html) {
  const $ = cheerio.load(html);
  $('script, style, noscript, nav, header, footer, aside, form, iframe, svg, button, .cookie, [role=navigation], [aria-hidden=true]').remove();

  const root = ['main', '#maincontent', '#main-content', 'article', 'body']
    .map(sel => $(sel).first())
    .find(el => el.length) || $.root();

  const title = ($('h1').first().text() || $('title').text() || '').replace(/\s+/g, ' ').trim();

  const sections = [];
  let current = { heading: 'Overview', parts: [] };
  const push = () => {
    if (current.parts.length) sections.push({ heading: current.heading, text: current.parts.join('\n') });
  };

  root.find('h1, h2, h3, h4, p, li').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (!text) return;
    if (tag === 'h1') return;
    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      push();
      current = { heading: text, parts: [] };
      return;
    }
    // skip nested <li><p> duplicates
    if (tag === 'p' && $(el).parent().is('li')) return;
    current.parts.push(tag === 'li' ? `- ${text}` : text);
  });
  push();

  return { title, sections: sections.filter(s => !SKIP_HEADINGS.test(s.heading)) };
}

function splitLong(text, max) {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
  const out = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > max && buf) { out.push(buf.trim()); buf = ''; }
    buf += s;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

// Step 2b: pack paragraphs into ~MAX-char chunks with a small overlap
export function chunkSections(title, sections, { max = 900, overlap = 150, min = 80 } = {}) {
  const chunks = [];
  for (const sec of sections) {
    const paras = sec.text.split('\n').flatMap(p => splitLong(p, max));
    let buf = '';
    const flush = () => {
      const body = buf.trim();
      if (body.length >= min) chunks.push({ heading: sec.heading, text: `${title} — ${sec.heading}\n${body}` });
      buf = body.length > overlap ? body.slice(-overlap) : '';
    };
    for (const p of paras) {
      if ((buf + '\n' + p).length > max && buf.trim()) flush();
      buf += (buf ? '\n' : '') + p;
    }
    flush();
  }
  return chunks;
}
