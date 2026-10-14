// Barra do investigador (celular/tablet) + gavetas laterais do ECO e do Quadro.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { sfx } from '../core/sfx.js';
import { game } from './game.js';

let bar, ecoPanel, boardPanel, scrim, ecoBtn, lupaBtn, boardBtn;
const wide = () => window.matchMedia('(min-width: 1180px)').matches;

export function isEcoVisible() { return wide() || ecoPanel?.classList.contains('open'); }

function setOpen(panel, on) {
  if (wide()) return;
  [ecoPanel, boardPanel].forEach(p => { if (p !== panel) p.classList.remove('open'); });
  panel.classList.toggle('open', on);
  scrim.classList.toggle('on', ecoPanel.classList.contains('open') || boardPanel.classList.contains('open'));
  ecoBtn.setAttribute('aria-pressed', String(ecoPanel.classList.contains('open')));
  boardBtn.setAttribute('aria-pressed', String(boardPanel.classList.contains('open')));
  if (panel === ecoPanel && on) game.eco?.markRead();
}

export function mount({ barEl, ecoEl, boardEl, onMenu }) {
  bar = barEl; ecoPanel = ecoEl; boardPanel = boardEl;
  scrim = h('div', { class: 'scrim', on: { click: () => { setOpen(ecoPanel, false); setOpen(boardPanel, false); } } });
  document.body.appendChild(scrim);
  ecoBtn = h('button', { class: 'inv-btn', 'aria-pressed': 'false', 'aria-label': 'Abrir canal do ECO', on: { click: () => { sfx.play('tap'); setOpen(ecoPanel, !ecoPanel.classList.contains('open')); } } }, h('span', null, '🦉'), h('span', { class: 'lbl' }, 'ECO'), h('span', { class: 'badge-dot', hidden: true }));
  lupaBtn = h('button', { class: 'inv-btn', 'aria-pressed': String(!!state.settings.analysis), 'aria-label': 'Modo Análise (lupa)', on: { click: () => { const on = game.analysis.toggle(); sfx.play(on ? 'collect' : 'tap'); lupaBtn.setAttribute('aria-pressed', String(on)); } } }, icon('scan-search', { size: 17 }), h('span', { class: 'lbl' }, 'Lupa'));
  boardBtn = h('button', { class: 'inv-btn', 'aria-pressed': 'false', 'aria-label': 'Abrir o Quadro', on: { click: () => { sfx.play('tap'); setOpen(boardPanel, !boardPanel.classList.contains('open')); } } }, icon('layout-grid', { size: 17 }), h('span', { class: 'lbl' }, 'Quadro'));
  const menuBtn = h('button', { class: 'inv-btn', 'aria-label': 'Menu', on: { click: () => onMenu?.() } }, icon('menu', { size: 17 }));
  clear(bar);
  bar.append(h('div', { class: 'brand' }, h('span', { class: 'dot' }), 'Última Conexão'), ecoBtn, lupaBtn, boardBtn, menuBtn);
  bus.on('eco:unread', ({ n }) => { const d = ecoBtn.querySelector('.badge-dot'); d.hidden = !n || isEcoVisible(); d.textContent = n; });
  bus.on('eco:open', () => setOpen(ecoPanel, true));
  bus.on('board:open', () => setOpen(boardPanel, true));
  bus.on('analysis', ({ on }) => lupaBtn.setAttribute('aria-pressed', String(on)));
  window.addEventListener('resize', () => { if (wide()) { ecoPanel.classList.remove('open'); boardPanel.classList.remove('open'); scrim.classList.remove('on'); } });
}
