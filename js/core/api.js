// Cliente da API (Google Apps Script). Offline-first: nunca lança erro; retorna null em falha.
import { CONFIG } from '../config.js';
import { state, save, snapshot } from './state.js';

const QKEY = 'uc01_evq';
let queue = [];
try { queue = JSON.parse(localStorage.getItem(QKEY) || '[]'); } catch (e) { queue = []; }

async function post(body, timeout = 15000) {
  if (!CONFIG.API_URL) return null;
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(CONFIG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body), signal: ctl.signal, redirect: 'follow' });
    const j = await r.json();
    return j && j.ok ? j : (j || null);
  } catch (e) { return null; } finally { clearTimeout(t); }
}
async function get(params, timeout = 12000) {
  if (!CONFIG.API_URL) return null;
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const u = new URL(CONFIG.API_URL);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    const r = await fetch(u, { signal: ctl.signal, redirect: 'follow' });
    const j = await r.json();
    return j && j.ok ? j : null;
  } catch (e) { return null; } finally { clearTimeout(t); }
}
const cred = () => ({ id: state.player.id, token: state.player.token });
const device = () => `${navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'} ${innerWidth}x${innerHeight}`.slice(0, 150);

export const api = {
  get enabled() { return !!CONFIG.API_URL; },
  get registered() { return !!(state.player.id && state.player.token); },

  async register(apelido, extra = {}) {
    const j = await post({ action: 'register', apelido, origem: (document.referrer || 'direto').slice(0, 110), dispositivo: device(), ...extra });
    if (j && j.ok) { Object.assign(state.player, { id: j.id, token: j.token, codigo: j.codigo, apelido: j.apelido }); save(true); }
    return j && j.ok ? j : null;
  },
  async profile(fields) { if (!api.registered) return null; return post({ action: 'profile', ...cred(), ...fields }); },
  async save() {
    if (!api.registered) return null;
    return post({ action: 'save', ...cred(), capitulo: state.chapter, versao: CONFIG.VERSION, estado: snapshot() });
  },
  async load() { if (!api.registered) return null; const j = await post({ action: 'load', ...cred() }); return j && j.ok ? j.estado : null; },
  async restore(codigo) { const j = await post({ action: 'restore', codigo }); return j && j.ok ? j : null; },

  event(tipo, dado = '') {
    queue.push({ tipo, capitulo: state.chapter, dado: typeof dado === 'string' ? dado : JSON.stringify(dado), quando: new Date().toISOString() });
    if (queue.length > 200) queue = queue.slice(-200);
    try { localStorage.setItem(QKEY, JSON.stringify(queue)); } catch (e) {}
  },
  async flush() {
    if (!api.registered || !queue.length) return;
    const lote = queue.slice(0, 40);
    const j = await post({ action: 'event', ...cred(), eventos: lote });
    if (j && j.ok) { queue = queue.slice(lote.length); try { localStorage.setItem(QKEY, JSON.stringify(queue)); } catch (e) {} }
  },
  async report(payload) { if (!api.registered) return null; return post({ action: 'report', ...cred(), ...payload }, 20000); },
  async feedback(nota, comentario) { return post({ action: 'feedback', ...cred(), nota, comentario }); },
  async ranking(limit = 50) { const j = await get({ action: 'ranking', limit }); return j ? j.ranking : null; },
  async stats() { const j = await get({ action: 'stats' }); return j ? j.stats : null; },
  async config() { const j = await get({ action: 'config' }); return j ? j.config : null; },
};

// envio periódico
setInterval(() => { api.flush(); }, 15000);
let lastCloudSave = 0;
export function cloudSaveSoon() {
  const now = Date.now();
  if (now - lastCloudSave < 20000) return;
  lastCloudSave = now;
  api.save();
}
window.addEventListener('pagehide', () => { api.flush(); });
