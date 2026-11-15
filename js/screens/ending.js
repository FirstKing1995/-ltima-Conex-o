// Final: texto conforme o relatório (verdade / incompleto / errado), bônus do ECO, pontuação e conquistas.
import { h, clear } from '../core/dom.js';
import { state, setFlag, save } from '../core/state.js';
import { CASE } from '../core/store.js';
import { bus } from '../core/bus.js';
import { api } from '../core/api.js';
import { game } from '../game/game.js';
import * as progress from '../game/progress.js';

export function play(result) {
  const root = document.getElementById('overlay-root');
  clear(root);
  const r = result || state.finalResult || {};
  const kind = r.ending || 'errado';
  const E = CASE.endings || {};
  const txt = E[kind] || { title: 'Fim', paragraphs: [] };
  const bonus = !!r.bonus && kind === 'verdade';
  if (bonus) setFlag('eco_revelado');
  const sc = game.score();
  if (kind === 'verdade') api.report?.({ ...sc, final: kind, bonus });
  save(true);

  const close = () => clear(root);
  const review = () => { close(); bus.emit('board:open'); };
  const label = { verdade: 'Caso resolvido', incompleto: 'Caso reaberto', errado: 'Caso arquivado' }[kind];

  const body = h('div', { class: 'end-body' },
    h('p', { class: `end-kicker k-${kind}` }, label),
    h('h1', { class: 'end-title' }, txt.title),
    txt.lead ? h('p', { class: 'end-lead' }, txt.lead) : null,
    (txt.paragraphs || []).map(p => h('p', { class: 'end-p' }, p)),
    txt.epilogue?.length ? h('div', { class: 'end-epi' }, txt.epilogue.map(p => h('p', null, p))) : null,
    bonus && E.bonusEco ? h('section', { class: 'end-eco' }, h('h2', null, E.bonusEco.title || 'O ECO'), (E.bonusEco.paragraphs || []).map(p => h('p', null, p))) : null,
    h('div', { class: 'end-stats' },
      stat('Pontos', sc.pontos), stat('Acertos', `${sc.acertos}/${sc.total}`), stat('Tempo', `${Math.round(sc.tempo_min)} min`), stat('Dicas', sc.dicas)),
    h('div', { class: 'end-ach' }, progress.achievements().map(a => h('div', { class: `ach ${state.achievements?.[a.id] ? 'on' : ''}` }, h('b', null, a.title), h('span', null, a.text)))),
    h('div', { class: 'title-menu' },
      kind !== 'verdade' ? h('button', { class: 'tbtn primary', on: { click: review } }, 'Revisar o relatório') : null,
      h('button', { class: `tbtn ${kind === 'verdade' ? 'primary' : 'ghost'}`, on: { click: close } }, 'Voltar ao celular')));

  const el = h('div', { class: `ov ending-screen e-${kind}` }, h('div', { class: 'end-scroll' }, body));
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 60);
}

const stat = (k, v) => h('div', { class: 'st' }, h('b', null, String(v)), h('span', null, k));
