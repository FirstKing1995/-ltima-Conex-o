// Modo Análise (lupa): destaca termos no celular; tocar coleta o termo para as deduções.
import { state, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { CASE } from '../core/store.js';

let reCI = null, reCS = null, mapCI = new Map(), mapCS = new Map(), phoneEl = null, hooked = false;
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'MARK', 'SVG', 'svg', 'NOSCRIPT', 'SELECT', 'OPTION']);
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function build() {
  const terms = CASE.terms?.terms || [];
  const ci = [], cs = [];
  mapCI = new Map(); mapCS = new Map();
  for (const t of terms) for (const m of (t.match || [t.label])) {
    if (!m) continue;
    if (t.cs) { cs.push(m); mapCS.set(m, t.id); }
    else { ci.push(m); if (!mapCI.has(fold(m))) mapCI.set(fold(m), t.id); }
  }
  const mk = (arr, flags) => arr.length ? new RegExp(`(?<![\\p{L}\\p{N}])(${arr.sort((a, b) => b.length - a.length).map(escRe).join('|')})(?![\\p{L}\\p{N}])`, flags) : null;
  reCI = mk(ci, 'giu'); reCS = mk(cs, 'gu');
}

function matchesIn(text) {
  const out = [];
  for (const [re, ci] of [[reCI, true], [reCS, false]]) {
    if (!re) continue;
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const id = ci ? mapCI.get(fold(m[1])) : mapCS.get(m[1]);
      if (id) out.push({ start: m.index, end: m.index + m[1].length, id, text: m[1] });
    }
  }
  out.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const res = []; let last = -1;
  for (const o of out) if (o.start >= last) { res.push(o); last = o.end; }
  return res;
}

function wrapNode(node) {
  const text = node.nodeValue;
  if (!text || text.trim().length < 2) return;
  const ms = matchesIn(text);
  if (!ms.length) return;
  const frag = document.createDocumentFragment();
  let pos = 0;
  for (const m of ms) {
    if (m.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
    const mk = document.createElement('mark');
    mk.className = 'term' + (state.terms[m.id] ? ' got' : '');
    mk.dataset.term = m.id;
    mk.textContent = m.text;
    frag.appendChild(mk);
    pos = m.end;
  }
  if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
  node.parentNode.replaceChild(frag, node);
}

function scan(el) {
  if (!state.settings.analysis || !el) return;
  if (!reCI && !reCS) build();
  const root = el.nodeType === 1 ? el : el.parentElement;
  if (!root || root.closest?.('.no-terms, .ph-status, .k-viewer .stagev')) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName) || p.closest('mark.term, .no-terms, .ph-status, input, textarea, svg')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(wrapNode);
}

function unwrapAll(root) {
  root.querySelectorAll('mark.term').forEach(m => { const t = document.createTextNode(m.textContent); m.replaceWith(t); });
  root.normalize();
}

function hook(root) {
  if (hooked || !root) return;
  hooked = true;
  // Coleta no "soltar" (pointerup): funciona com dedo, mouse e caneta. No toque NÃO se cancela o touchstart,
  // senão o celular não gera o resto do gesto (e também não deixa rolar a tela começando num termo).
  let downAt = null, lastCollect = 0;
  const collect = (mk) => {
    lastCollect = Date.now();
    const id = mk.dataset.term;
    const isNew = analysis.game?.collect(id);
    root.querySelectorAll(`mark.term[data-term="${CSS.escape(id)}"]`).forEach(x => x.classList.add('got'));
    mk.classList.remove('flash'); void mk.offsetWidth; mk.classList.add('flash');
    const t = (CASE.terms?.terms || []).find(x => x.id === id);
    analysis.toast?.(isNew ? `Termo coletado: ${t?.label || id}` : `Você já tem: ${t?.label || id}`, isNew);
  };
  const handler = (e) => {
    if (!state.settings.analysis) return;
    const mk = e.target.closest?.('mark.term');
    if (!mk) { if (e.type === 'pointerdown') downAt = null; return; }
    e.stopPropagation();                       // o toque no termo não abre conversa nem fixa a mensagem
    if (e.type === 'pointerdown') { downAt = { x: e.clientX, y: e.clientY, mk }; return; }
    if (e.type === 'touchstart') return;       // sem preventDefault: o gesto segue normal
    if (e.cancelable) e.preventDefault();
    if (e.type === 'pointerup') {
      const moved = downAt ? Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) : 0;
      if (downAt && downAt.mk === mk && moved < 12) collect(mk);   // foi um toque, não uma rolagem
      downAt = null;
      return;
    }
    if (e.type === 'click' && Date.now() - lastCollect > 700) collect(mk);  // teclado/leitor de tela
  };
  ['click', 'pointerdown', 'pointerup', 'mousedown', 'touchstart', 'contextmenu'].forEach(ev => root.addEventListener(ev, handler, { capture: true, passive: false }));
}

export const analysis = {
  game: null,
  toast: null,
  get active() { return !!state.settings.analysis; },
  attach(phoneRoot, game, toastFn) { phoneEl = phoneRoot; analysis.game = game; analysis.toast = toastFn; hook(phoneRoot); if (state.settings.analysis) { phoneRoot.classList.add('analysis'); bus.emit('analysis', { on: true }); } },
  set(on) {
    state.settings.analysis = !!on; save();
    if (phoneEl) { phoneEl.classList.toggle('analysis', !!on); if (!on) unwrapAll(phoneEl); }
    bus.emit('analysis', { on: !!on });
    if (on) analysis.toast?.('Lupa ligada. Toque num trecho sublinhado (nome, hora, lugar) para guardá-lo como pista. Elas vão para o Quadro, aba Termos.', true, 5200);
  },
  toggle() { analysis.set(!state.settings.analysis); return state.settings.analysis; },
  scan,
  rebuild() { reCI = reCS = null; build(); },
};
