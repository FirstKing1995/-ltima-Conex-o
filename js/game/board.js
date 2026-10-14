// QUADRO de investigação: objetivos, deduções (lacunas), termos, provas fixadas, pessoas e linha do tempo.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import { state, evalReq, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { CASE, asset } from '../core/store.js';
import * as time from '../core/time.js';
import { sfx } from '../core/sfx.js';
import * as progress from './progress.js';
import { game } from './game.js';

let panel, body, tabsEl, tab = 'caso';
const CATS = { pessoa: 'Pessoas', lugar: 'Lugares', hora: 'Horas', objeto: 'Objetos', conceito: 'Conceitos', numero: 'Números' };

export function mount(el) {
  panel = el;
  clear(panel);
  tabsEl = h('div', { class: 'bd-tabs', role: 'tablist' });
  body = h('div', { class: 'panel-body bd-body' });
  panel.appendChild(h('div', { class: 'panel board' },
    h('div', { class: 'panel-head' }, icon('layout-grid', { size: 16 }), h('div', { class: 'panel-title', style: 'flex:1' }, 'Quadro'), h('span', { class: 'bd-chap' })),
    tabsEl, body));
  ['flag', 'term', 'pin', 'objective', 'chapter', 'solve', 'answer'].forEach(ev => bus.on(ev, () => schedule()));
  bus.on('board:tab', (t) => { tab = t; draw(); });
  draw();
}

let t = null;
function schedule() { clearTimeout(t); t = setTimeout(draw, 60); }

function draw() {
  if (!panel) return;
  const c = progress.currentChapter();
  const chap = panel.querySelector('.bd-chap');
  if (chap) chap.textContent = c ? `${c.title} · ${c.subtitle}` : '';
  const tabs = [['caso', 'Caso'], ['termos', `Termos ${Object.keys(state.terms).length || ''}`], ['provas', `Provas ${state.pins.length || ''}`], ['pessoas', 'Pessoas'], ['linha', 'Linha do tempo']];
  clear(tabsEl);
  for (const [id, label] of tabs) tabsEl.appendChild(h('button', { class: `bd-tab ${tab === id ? 'on' : ''}`, role: 'tab', 'aria-selected': String(tab === id), on: { click: () => { tab = id; sfx.play('tap'); draw(); } } }, label));
  const scroll = body.scrollTop;
  clear(body);
  ({ caso: drawCaso, termos: drawTermos, provas: drawProvas, pessoas: drawPessoas, linha: drawLinha })[tab]?.();
  body.scrollTop = scroll;
}

/* ---------- Caso: objetivos + deduções ---------- */
function drawCaso() {
  const chs = progress.chapters().filter(c => state.flags[`chapter_started:${c.n}`]).reverse();
  if (!chs.length) { body.appendChild(h('p', { class: 'bd-empty' }, 'O caso ainda não começou.')); return; }
  for (const c of chs) {
    const done = !!state.flags[`chapter_done:${c.n}`];
    const sec = h('section', { class: `bd-chapter ${done ? 'done' : ''}` },
      h('h3', null, h('small', null, c.title), c.subtitle, done ? h('span', { class: 'bd-ok' }, icon('check', { size: 14 }), 'concluído') : null));
    const ul = h('ul', { class: 'bd-objs' });
    for (const o of (c.objectives || [])) ul.appendChild(h('li', { class: state.objectives[o.id] ? 'ok' : '' }, icon(state.objectives[o.id] ? 'check' : 'circle', { size: 15 }), h('span', null, o.text)));
    sec.appendChild(ul);
    const d = c.deduction && CASE.chapters?.deductions?.[c.deduction];
    if (d) sec.appendChild(deductionCard(c.deduction, d));
    body.appendChild(sec);
  }
}

function deductionCard(id, d) {
  const unlocked = evalReq(d.unlockWhen);
  const solved = !!state.solved[id];
  const card = h('div', { class: `bd-ded ${solved ? 'solved' : ''} ${d.final ? 'final' : ''}` }, h('h4', null, icon(d.final ? 'newspaper' : 'puzzle', { size: 16 }), d.title));
  if (!unlocked) { card.appendChild(h('p', { class: 'bd-lock' }, icon('lock', { size: 14 }), d.final ? 'Conclua os objetivos do capítulo 4 para liberar o relatório.' : 'Disponível em breve.')); return card; }
  if (d.intro) card.appendChild(h('p', { class: 'bd-intro' }, d.intro));
  const feedback = {};
  for (const blk of d.blocks) {
    const p = h('p', { class: 'bd-sentence' });
    if (blk.title) card.appendChild(h('div', { class: 'bd-blk-title' }, blk.title, blk.bonus ? h('em', null, ' (opcional)') : null));
    for (const part of blk.parts) {
      if (typeof part === 'string') { p.appendChild(document.createTextNode(part)); continue; }
      p.appendChild(blankEl(part, solved));
    }
    card.appendChild(p);
    feedback[blk.id] = h('div', { class: 'bd-fb', role: 'status' });
    card.appendChild(feedback[blk.id]);
  }
  if (!solved) {
    const btn = h('button', { class: 'bd-submit', on: { click: async () => {
      btn.disabled = true;
      const r = await game.submitDeduction(id);
      btn.disabled = false;
      for (const [bid, b] of Object.entries(r.blocks)) {
        const fb = feedback[bid]; if (!fb) continue;
        fb.className = 'bd-fb ' + (b.correct ? 'ok' : b.empty ? 'empty' : 'bad');
        fb.textContent = b.correct ? 'Bloco correto.' : b.empty ? `Faltam ${b.empty} lacuna(s).` : (b.wrong <= 2 ? `Quase: ${b.wrong === 1 ? 'uma lacuna está errada' : 'duas lacunas estão erradas'}.` : 'Várias lacunas estão erradas.');
      }
      if (d.final) bus.emit('final:submitted', r);
    } } }, icon(d.final ? 'send' : 'check-check', { size: 16 }), d.final ? 'Enviar para Bruna' : 'Conferir dedução');
    card.appendChild(btn);
  } else card.appendChild(h('div', { class: 'bd-fb ok' }, icon('check', { size: 14 }), d.final ? 'Relatório enviado.' : 'Dedução confirmada.'));
  return card;
}

function blankEl(part, locked) {
  const val = state.answers[part.b];
  let label = '______';
  if (val) {
    if (part.choice) label = part.choice.find(c => c.id === val)?.label || val;
    else label = game.term(val)?.label || val;
  }
  const b = h('button', { class: `bd-blank ${val ? 'filled' : ''}`, disabled: locked, 'aria-label': 'Escolher termo', on: { click: () => pick(part) } }, label);
  return b;
}

function pick(part) {
  const sheetBody = h('div', { class: 'bd-pick' });
  const close = () => { ov.remove(); };
  const choose = (v) => { game.setAnswer(part.b, v); sfx.play('tap'); close(); };
  if (part.choice) {
    for (const c of part.choice) sheetBody.appendChild(h('button', { class: 'bd-opt', on: { click: () => choose(c.id) } }, c.label));
  } else {
    const all = game.terms();
    const cats = [part.cat, ...Object.keys(CATS).filter(k => k !== part.cat)];
    if (!all.length) sheetBody.appendChild(h('p', { class: 'bd-empty' }, 'Você ainda não coletou termos. Ligue a lupa (Modo Análise) e toque nas palavras destacadas no celular.'));
    for (const cat of cats) {
      const items = all.filter(t => t.cat === cat);
      if (!items.length) continue;
      sheetBody.appendChild(h('div', { class: 'bd-cat' }, CATS[cat] || cat));
      sheetBody.appendChild(h('div', { class: 'bd-chips' }, items.map(t2 => h('button', { class: `bd-chip ${state.answers[part.b] === t2.id ? 'on' : ''}`, on: { click: () => choose(t2.id) } }, t2.label))));
    }
  }
  sheetBody.appendChild(h('button', { class: 'bd-clear', on: { click: () => choose(null) } }, 'Limpar lacuna'));
  const ov = h('div', { class: 'bd-sheet-ov', on: { click: (e) => { if (e.target === ov) close(); } } }, h('div', { class: 'bd-sheet' }, h('div', { class: 'bd-sheet-h' }, part.choice ? 'Escolha' : `Escolha um termo (${CATS[part.cat] || 'qualquer'})`, h('button', { 'aria-label': 'Fechar', on: { click: close } }, icon('x', { size: 18 }))), sheetBody));
  document.body.appendChild(ov);
}

/* ---------- Termos ---------- */
function drawTermos() {
  const all = game.terms();
  body.appendChild(h('p', { class: 'bd-help' }, 'Ligue a lupa e toque nas palavras destacadas no celular para coletar termos. Eles servem para preencher as deduções.'));
  if (!all.length) { body.appendChild(h('p', { class: 'bd-empty' }, 'Nenhum termo coletado ainda.')); return; }
  for (const [cat, name] of Object.entries(CATS)) {
    const items = all.filter(t2 => t2.cat === cat);
    if (!items.length) continue;
    body.append(h('div', { class: 'bd-cat' }, name), h('div', { class: 'bd-chips' }, items.map(t2 => h('span', { class: 'bd-chip static' }, t2.label))));
  }
}

/* ---------- Provas ---------- */
function drawProvas() {
  if (!state.pins.length) { body.appendChild(h('p', { class: 'bd-empty' }, 'Nada fixado. Nas fotos, mensagens e arquivos, toque em “Fixar no Quadro”.')); return; }
  for (const p of [...state.pins].reverse()) body.appendChild(h('div', { class: 'bd-pin' }, icon('pin', { size: 15 }), h('div', { style: 'flex:1;min-width:0' }, h('b', null, p.label), p.detail ? h('small', null, p.detail) : null), h('button', { 'aria-label': 'Remover', on: { click: () => game.unpin(p.key) } }, icon('x', { size: 15 }))));
}

/* ---------- Pessoas ---------- */
function drawPessoas() {
  for (const p of (CASE.chapters?.people || [])) {
    const facts = (p.facts || []).filter(f => evalReq(f.req));
    if (!facts.length) continue;
    body.appendChild(h('div', { class: 'bd-person' },
      h('div', { class: 'bd-person-h' }, p.avatar ? h('img', { src: asset(p.avatar), alt: '', onerror: "this.style.visibility='hidden'" }) : h('span', { class: 'bd-person-ic' }, icon('user-round', { size: 18 })), h('div', null, h('b', null, p.name), h('small', null, p.role))),
      h('ul', null, facts.map(f => h('li', null, f.text)))));
  }
}

/* ---------- Linha do tempo ---------- */
function drawLinha() {
  const items = (CASE.chapters?.timeline || []).filter(i => evalReq(i.req)).sort((a, b) => time.compare(a.at, b.at));
  if (!items.length) { body.appendChild(h('p', { class: 'bd-empty' }, 'A linha do tempo se monta sozinha conforme você investiga.')); return; }
  body.appendChild(h('ol', { class: 'bd-time' }, items.map(i => h('li', null, h('time', null, `${time.weekday(i.at)} ${time.hhmm(i.at)}`), h('span', null, i.text)))));
}

export const board = { mount, draw, open: (t2) => { if (t2) tab = t2; draw(); } };
