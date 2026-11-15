// CADERNO DE INVESTIGAÇÃO — o painel do detetive (substitui o antigo canal do ECO).
// Diário de campo escrito na voz do investigador (gatilhos), notas livres, pendências e "repensar o caso".
// Roteiro em data/caso01/eco.js: { nodes:{id:{title?, msgs:[texto|{doc,title,lines}], flags, actions}}, triggers:[{when,node}], hints:{objId:[...]}}
// O nome do arquivo e as exportações (eco.*) ficam iguais para não quebrar o resto do jogo.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import { state, setFlag, setFlags, evalReq, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { CASE } from '../core/store.js';
import { sfx } from '../core/sfx.js';
import { phone } from '../phone/phone.js';
import * as progress from './progress.js';

let panel, logEl, notesEl, leadsEl, tabsEl, visibleFn = () => true, tab = 'diario';

const nodes = () => CASE.eco?.nodes || {};
const fill = (t) => String(t ?? '').replace(/\{nome\}/g, state.player.apelido || 'inspetor');
const stamp = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

export function mount(el, { isVisible } = {}) {
  panel = el;
  if (isVisible) visibleFn = isVisible;
  clear(panel);
  state.notes ??= '';
  if (state.eco?.v !== 2) { state.eco = { log: [], fired: {}, unread: 0, v: 2 }; save(); } // saves da v1.1 (canal do ECO)
  logEl = h('div', { class: 'cd-log', role: 'log', 'aria-live': 'polite' });
  notesEl = h('textarea', { class: 'cd-notes', placeholder: 'Minhas anotações. Suspeitas, horários, perguntas. Fica salvo.', spellcheck: 'false', 'aria-label': 'Minhas anotações' });
  notesEl.value = state.notes;
  notesEl.addEventListener('input', () => { state.notes = notesEl.value; save(); });
  leadsEl = h('div', { class: 'cd-leads' });
  const views = {
    diario: h('div', { class: 'cd-view' }, logEl),
    pendencias: h('div', { class: 'cd-view' }, leadsEl),
    notas: h('div', { class: 'cd-view cd-view-notes' }, notesEl),
  };
  const body = h('div', { class: 'panel-body cd-body' });
  const setTab = (t) => {
    tab = t;
    tabsEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    clear(body); body.appendChild(views[t]);
    if (t === 'pendencias') drawLeads();
    if (t === 'diario') scrollDown();
  };
  tabsEl = h('div', { class: 'cd-tabs' }, [['diario', 'Diário'], ['pendencias', 'Pendências'], ['notas', 'Minhas notas']].map(([t, l]) => h('button', { dataset: { t }, on: { click: () => setTab(t) } }, l)));
  const rethink = h('button', { class: 'cd-rethink', title: 'Repensar o caso (custa pontos)', on: { click: askHint } }, icon('brain', { size: 15 }), 'Repensar');
  panel.appendChild(h('div', { class: 'panel caderno' },
    h('div', { class: 'panel-head cd-head' },
      h('span', { class: 'cd-ic' }, icon('notebook-pen', { size: 18 })),
      h('div', { style: 'flex:1;min-width:0' },
        h('div', { class: 'panel-title' }, 'Caderno de investigação'),
        h('div', { class: 'cd-sub' }, caseLine())),
      rethink),
    tabsEl, body));
  setTab('diario');
  for (const m of state.eco.log) logEl.appendChild(render(m));
  scrollDown();
  bus.on('flag', () => { checkTriggers(); if (tab === 'pendencias') drawLeads(); });
  bus.on('player:name', () => { const s = panel.querySelector('.cd-sub'); if (s) s.textContent = caseLine(); });
  checkTriggers();
}

function caseLine() { return `Insp. ${state.player.apelido || '—'} · IP 0417/2026 · Guaraciaba do Norte`; }

function scrollDown() { const b = logEl?.parentElement?.parentElement; if (b) requestAnimationFrame(() => { b.scrollTop = b.scrollHeight; }); }

function render(m) {
  if (m.kind === 'chapter') return h('div', { class: 'cd-chapter' }, fill(m.text));
  if (m.kind === 'doc') return h('div', { class: 'cd-doc' },
    h('div', { class: 'cd-doc-h' }, icon('file-text', { size: 14 }), fill(m.title || 'Documento')),
    (m.lines || []).map(l => h('p', { class: 'txt' }, fill(l))));
  if (m.kind === 'think') return h('div', { class: 'cd-think' }, h('span', { class: 'cd-t' }, m.at || ''), h('p', { class: 'txt' }, fill(m.text)));
  return h('div', { class: 'cd-entry' }, h('span', { class: 'cd-t' }, m.at || ''), h('p', { class: 'txt' }, fill(m.text)));
}

function push(m) {
  m.at ??= stamp();
  state.eco.log.push(m);
  if (state.eco.log.length > 500) state.eco.log = state.eco.log.slice(-500);
  save();
  const el = render(m); el.classList.add('new');
  logEl?.appendChild(el);
  scrollDown();
  if (!visibleFn() && m.kind !== 'chapter') {
    state.eco.unread = (state.eco.unread || 0) + 1;
    bus.emit('eco:unread', { n: state.eco.unread });
  }
}

export function markRead() { state.eco.unread = 0; save(); bus.emit('eco:unread', { n: 0 }); }

function checkTriggers() {
  const trig = CASE.eco?.triggers || [];
  trig.forEach((t, i) => {
    const key = t.id || `t${i}`;
    if (state.eco.fired[key]) return;
    if (evalReq(t.when)) { state.eco.fired[key] = Date.now(); save(); play(t.node); }
  });
}

/** Escreve uma entrada do diário (sem animação: é o próprio detetive anotando). */
export function play(nodeId) {
  const n = nodes()[nodeId];
  if (!n) { console.warn('[caderno] entrada inexistente', nodeId); return; }
  let wrote = false;
  for (const raw of (n.msgs || [])) {
    const m = typeof raw === 'string' ? { text: raw } : raw;
    if (m.doc) push({ kind: 'doc', title: m.title, lines: m.lines || [] });
    else if (m.chapter) push({ kind: 'chapter', text: m.text });
    else push({ kind: m.think ? 'think' : 'entry', text: m.text });
    wrote = true;
  }
  if (wrote) { sfx.play('type'); if (!visibleFn()) phone.toast('Anotado no caderno', { icon: 'notebook-pen', ms: 1600 }); }
  if (n.flags) setFlags(n.flags);
  for (const a of (n.actions || [])) doAction(a);
}

function doAction(a) {
  switch (a.type) {
    case 'flag': setFlag(a.flag); break;
    case 'notify': phone.notify({ icon: a.icon || 'bell', title: a.title || 'Aviso', text: a.text }); break;
    case 'openBoard': bus.emit('board:open', a); break;
    case 'ending': bus.emit('ending:start', a); break;
    default: bus.emit('eco:action', a);
  }
}

/* ---------- pendências: o que ainda não sei ---------- */
function drawLeads() {
  clear(leadsEl);
  const chs = progress.chapters().filter(c => state.flags[`chapter_started:${c.n}`]);
  if (!chs.length) { leadsEl.appendChild(h('p', { class: 'cd-empty' }, 'Nada em aberto ainda.')); return; }
  for (const c of [...chs].reverse()) {
    const done = state.flags[`chapter_done:${c.n}`];
    leadsEl.appendChild(h('div', { class: `cd-lead-ch ${done ? 'done' : ''}` }, `${c.title} · ${c.subtitle}`));
    for (const o of (c.objectives || [])) {
      const ok = !!state.objectives[o.id];
      leadsEl.appendChild(h('div', { class: `cd-lead ${ok ? 'ok' : ''}` }, icon(ok ? 'check' : 'circle', { size: 14 }), h('span', null, o.text)));
    }
    const d = c.deduction && CASE.chapters?.deductions?.[c.deduction];
    if (d && evalReq(d.unlockWhen)) {
      const ok = !!state.solved[c.deduction];
      leadsEl.appendChild(h('button', { class: `cd-lead ded ${ok ? 'ok' : ''}`, on: { click: () => bus.emit('board:open') } }, icon(ok ? 'check' : 'puzzle', { size: 14 }), h('span', null, ok ? `Dedução fechada: ${d.title}` : `Fechar a dedução no Quadro: ${d.title}`)));
    }
    if (done) break;
  }
}

/* ---------- repensar: o detetive revisa o caso (custa pontos) ---------- */
export function askHint() {
  const obj = progress.pendingObjective();
  if (!obj) { push({ kind: 'think', text: 'Releio tudo. Por ora, nada me escapa. Sigo pelo aparelho.' }); return; }
  const hint = progress.useHint(obj.id);
  if (!hint) { push({ kind: 'think', text: `Ainda em aberto: ${obj.text} Volto ao aparelho com calma.` }); return; }
  push({ kind: 'think', text: hint.text });
  if (tab !== 'diario') panel.querySelector('.cd-tabs button[data-t="diario"]')?.click();
}

export const eco = { mount, play, askHint, markRead, push };
