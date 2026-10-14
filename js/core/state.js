// Estado do jogo + salvamento local.
import { bus } from './bus.js';
import { CONFIG } from '../config.js';

const VERSION = 1;

function fresh() {
  return {
    v: VERSION,
    caseId: CONFIG.CASE_ID,
    player: { id: '', token: '', codigo: '', apelido: '' },
    startedAt: 0,
    playMs: 0,
    flags: {},        // nome -> timestamp (ms)
    terms: {},        // termId -> timestamp
    pins: [],         // [{key,label,app,detail,at}]
    answers: {},      // blankId -> valor escolhido
    solved: {},       // deducaoId/blocoId -> timestamp
    objectives: {},   // objetivoId -> timestamp
    chapter: 0,
    hints: {},        // objetivoId -> nível de dica já usado (1..3)
    wrong: 0,         // respostas erradas em deduções
    reportAttempts: 0,
    finalResult: null,
    eco: { log: [], fired: {}, unread: 0 },
    achievements: {},
    settings: { sound: true, textSize: 'm', analysis: false },
    apps: {},
  };
}

export let state = fresh();

export function setFlag(name) {
  if (!name || state.flags[name]) return false;
  state.flags[name] = Date.now();
  bus.emit('flag', { name });
  save();
  return true;
}
export function setFlags(list) { (list || []).forEach(setFlag); }
export function hasFlag(name) { return !!state.flags[name]; }
export function clearFlag(name) { delete state.flags[name]; save(); }

/** Avalia expressão de flags: "a", "!a", "a && b", "a || b && !c". Vazio = true. */
export function evalReq(expr) {
  if (expr === undefined || expr === null || expr === '' || expr === true) return true;
  if (expr === false) return false;
  if (Array.isArray(expr)) return expr.every(evalReq);
  return String(expr).split('||').some(orPart =>
    orPart.split('&&').every(term => {
      let t = term.trim();
      let neg = false;
      while (t.startsWith('!')) { neg = !neg; t = t.slice(1).trim(); }
      const v = !!state.flags[t];
      return neg ? !v : v;
    })
  );
}

export function markSeen(key) {
  if (!key) return false;
  const name = 'seen:' + key;
  if (state.flags[name]) return false;
  state.flags[name] = Date.now();
  bus.emit('seen', { key });
  bus.emit('flag', { name });
  save();
  return true;
}
export const isSeen = (key) => !!state.flags['seen:' + key];

/* ---------- tempo de jogo ---------- */
let lastTick = 0;
export function tick() {
  const now = Date.now();
  if (lastTick && document.visibilityState === 'visible') {
    const dt = now - lastTick;
    if (dt > 0 && dt < 60000) state.playMs += dt;
  }
  lastTick = now;
}
setInterval(tick, 5000);
document.addEventListener('visibilitychange', () => { lastTick = Date.now(); });

/* ---------- persistência ---------- */
let saveTimer = null;
export function save(immediate = false) {
  clearTimeout(saveTimer);
  const doIt = () => {
    try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(state)); } catch (e) { /* armazenamento indisponível */ }
    bus.emit('state:save', {});
  };
  if (immediate) doIt(); else saveTimer = setTimeout(doIt, 400);
}

export function load() {
  try {
    const raw = localStorage.getItem(CONFIG.SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || data.caseId !== CONFIG.CASE_ID) return false;
    state = Object.assign(fresh(), data);
    state.settings = Object.assign(fresh().settings, data.settings || {});
    state.eco = Object.assign(fresh().eco, data.eco || {});
    return true;
  } catch (e) { return false; }
}

export function hasSave() {
  try { const raw = localStorage.getItem(CONFIG.SAVE_KEY); if (!raw) return false; const d = JSON.parse(raw); return !!(d && d.startedAt); } catch (e) { return false; }
}

export function replaceState(data) {
  state = Object.assign(fresh(), data || {});
  save(true);
}

export function reset(keepPlayer = true) {
  const player = keepPlayer ? state.player : fresh().player;
  const settings = state.settings;
  state = fresh();
  state.player = player;
  state.settings = settings;
  save(true);
}

/** Cópia enxuta para salvar na nuvem. */
export function snapshot() {
  const s = JSON.parse(JSON.stringify(state));
  delete s.player.token;
  s.eco.log = (s.eco.log || []).slice(-120);
  return s;
}
