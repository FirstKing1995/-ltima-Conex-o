// Busca global no celular (barra de pesquisa da tela inicial).
import { normalize } from './hash.js';
const providers = new Map();
export const search = {
  register(appId, fn) { providers.set(appId, fn); },
  query(text, { limit = 60 } = {}) {
    const q = normalize(text);
    if (q.length < 2) return [];
    const out = [];
    for (const [app, fn] of providers) {
      let items = [];
      try { items = fn() || []; } catch (e) { console.warn('[search]', app, e); }
      for (const it of items) {
        const hay = normalize(`${it.title || ''} ${it.text || ''}`);
        const i = hay.indexOf(q);
        if (i < 0) continue;
        const raw = String(it.text || it.title || '');
        // trecho legível em volta do termo
        const lower = raw.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        const words = String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
        let j = lower.indexOf(words);
        if (j < 0) j = 0;
        const start = Math.max(0, j - 40);
        const snippet = (start ? '…' : '') + raw.slice(start, j + words.length + 60) + (raw.length > j + words.length + 60 ? '…' : '');
        out.push({ app, title: it.title, snippet, params: it.params, at: it.at });
        if (out.length >= limit) return out;
      }
    }
    return out;
  },
};
