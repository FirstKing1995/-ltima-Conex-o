// ECO — canal seguro do hacker. Motor de roteiro (nós + gatilhos) + painel.
// Roteiro em data/caso01/eco.js: { nodes:{id:{msgs, choices, next, input, flags, actions}}, triggers:[{when, node}], hints:{objId:[...]}}
import { h, clear, sleep } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import { state, setFlag, setFlags, evalReq, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { CASE, asset } from '../core/store.js';
import { sfx } from '../core/sfx.js';
import { api } from '../core/api.js';
import { phone } from '../phone/phone.js';
import * as progress from './progress.js';

let panel, logEl, choicesEl, typingEl, playing = false, queue = [], visibleFn = () => true;

const nodes = () => CASE.eco?.nodes || {};
const fill = (t) => String(t ?? '').replace(/\{nome\}/g, state.player.apelido || 'você');

export function mount(el, { isVisible } = {}) {
  panel = el;
  if (isVisible) visibleFn = isVisible;
  clear(panel);
  logEl = h('div', { class: 'eco-log', role: 'log', 'aria-live': 'polite' });
  typingEl = h('div', { class: 'eco-typing', hidden: true }, h('span'), h('span'), h('span'));
  choicesEl = h('div', { class: 'eco-choices' });
  const hintBtn = h('button', { class: 'eco-hint', on: { click: askHint } }, icon('circle-help', { size: 16 }), 'Pedir dica');
  panel.appendChild(h('div', { class: 'panel eco' },
    h('div', { class: 'panel-head' }, h('span', { class: 'eco-owl' }, '🦉'), h('div', { style: 'flex:1;min-width:0' }, h('div', { class: 'panel-title' }, 'ECO // canal seguro'), h('div', { class: 'eco-sub' }, 'conexão cifrada · espelho ativo')), hintBtn),
    h('div', { class: 'panel-body' }, logEl, typingEl),
    choicesEl));
  // redesenha histórico
  for (const m of state.eco.log) logEl.appendChild(renderMsg(m));
  scrollDown();
  bus.on('flag', checkTriggers);
  checkTriggers();
  // se havia escolhas pendentes, mostra de novo
  if (state.eco.pending) showChoices(state.eco.pending);
}

function scrollDown() { const b = logEl?.parentElement; if (b) requestAnimationFrame(() => { b.scrollTop = b.scrollHeight; }); }

function renderMsg(m) {
  if (m.who === 'me') return h('div', { class: 'eco-msg me' }, h('div', { class: 'b' }, fill(m.text)));
  if (m.kind === 'system') return h('div', { class: 'eco-sys' }, fill(m.text));
  if (m.kind === 'image') return h('div', { class: 'eco-msg' }, h('div', { class: 'b img' }, h('img', { src: asset(m.src), alt: m.text || 'imagem enviada pelo ECO', loading: 'lazy' }), m.text ? h('div', { class: 'cap' }, fill(m.text)) : null));
  if (m.kind === 'objective') return h('div', { class: 'eco-obj' }, icon('target', { size: 14 }), fill(m.text));
  return h('div', { class: 'eco-msg' }, h('div', { class: 'b' }, fill(m.text)));
}

function push(m) {
  state.eco.log.push(m);
  if (state.eco.log.length > 400) state.eco.log = state.eco.log.slice(-400);
  save();
  logEl?.appendChild(renderMsg(m));
  scrollDown();
  if (m.who !== 'me' && m.kind !== 'system' && !visibleFn()) {
    state.eco.unread = (state.eco.unread || 0) + 1;
    bus.emit('eco:unread', { n: state.eco.unread });
    if (m.text) phone.notify({ icon: 'square-terminal', title: 'ECO', text: fill(m.text).slice(0, 120), onTap: () => bus.emit('eco:open') });
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

/** Toca um nó do roteiro (fila; um por vez). */
export function play(nodeId) {
  if (!nodeId) return;
  queue.push(nodeId);
  if (!playing) run();
}

async function run() {
  playing = true;
  while (queue.length) {
    const id = queue.shift();
    const n = nodes()[id];
    if (!n) { console.warn('[eco] nó inexistente', id); continue; }
    await playNode(id, n);
  }
  playing = false;
}

async function playNode(id, n) {
  for (const raw of (n.msgs || [])) {
    const m = typeof raw === 'string' ? { text: raw } : raw;
    const txt = fill(m.text || '');
    const delay = m.delay ?? Math.min(2600, 500 + txt.length * 22);
    typingEl.hidden = false; scrollDown();
    await sleep(state.settings.fastEco ? 120 : delay);
    typingEl.hidden = true;
    if (m.image) push({ kind: 'image', src: m.image, text: m.text || '' });
    else if (m.system) push({ kind: 'system', text: m.text });
    else push({ text: m.text });
    sfx.play('eco');
  }
  if (n.flags) setFlags(n.flags);
  for (const a of (n.actions || [])) await doAction(a);
  if (n.input) { await askInput(n.input); }
  if (n.choices?.length) { state.eco.pending = { node: id }; save(); showChoices(state.eco.pending); return; }
  if (n.next) await playNode(n.next, nodes()[n.next] || {});
}

function showChoices({ node }) {
  const n = nodes()[node];
  clear(choicesEl);
  if (!n?.choices) return;
  for (const c of n.choices) {
    choicesEl.appendChild(h('button', { class: 'eco-choice', on: { click: () => {
      clear(choicesEl);
      state.eco.pending = null; save();
      push({ who: 'me', text: c.label });
      sfx.play('send');
      if (c.flags) setFlags(c.flags);
      if (c.next) play(c.next);
    } } }, fill(c.label)));
  }
  scrollDown();
}

function askInput(spec) {
  return new Promise((resolve) => {
    clear(choicesEl);
    const inp = h('input', { class: 'eco-input', type: 'text', maxlength: '24', placeholder: spec.placeholder || 'digite aqui', autocomplete: 'off', 'aria-label': spec.placeholder || 'Resposta' });
    const send = async () => {
      const v = inp.value.trim().replace(/\s+/g, ' ');
      if (v.length < 2) { inp.focus(); return; }
      clear(choicesEl);
      push({ who: 'me', text: v });
      sfx.play('send');
      if (spec.kind === 'name') {
        state.player.apelido = v.slice(0, 24); save(true);
        bus.emit('player:name', { name: state.player.apelido });
        api.register(state.player.apelido).then(() => api.save());
      }
      resolve(v);
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
    choicesEl.append(h('div', { class: 'eco-inrow' }, inp, h('button', { class: 'eco-send', 'aria-label': 'Enviar', on: { click: send } }, icon('send-horizontal', { size: 18 }))));
    setTimeout(() => inp.focus(), 200);
  });
}

async function doAction(a) {
  switch (a.type) {
    case 'objective': push({ kind: 'objective', text: a.text }); break;
    case 'system': push({ kind: 'system', text: a.text }); break;
    case 'flag': setFlag(a.flag); break;
    case 'notify': phone.notify({ icon: a.icon || 'bell', title: a.title || 'Aviso', text: a.text }); break;
    case 'openBoard': bus.emit('board:open', a); break;
    case 'openPhone': bus.emit('phone:focus', a); break;
    case 'ending': bus.emit('ending:start', a); break;
    case 'wait': await sleep(a.ms || 1000); break;
    default: bus.emit('eco:action', a);
  }
}

export function askHint() {
  const obj = progress.pendingObjective();
  if (!obj) { push({ text: 'por enquanto tá tudo certo. segue explorando o celular dela.' }); return; }
  const hint = progress.useHint(obj.id);
  push({ who: 'me', text: 'me dá uma dica?' });
  if (!hint) { push({ text: 'olha o Quadro: o objetivo tá lá. fuça os apps com calma.' }); return; }
  setTimeout(() => push({ text: `dica ${hint.level}/${hint.max} — ${hint.text}` }), 700);
}

export const eco = { mount, play, askHint, markRead, push };
