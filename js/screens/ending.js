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
  const success = kind === 'verdade' || kind === 'serra';
  const bonusTxt = txt.bonusKey ? E[txt.bonusKey] : null;
  const bonus = !!r.bonus && success && !!bonusTxt;
  if (bonus && kind === 'verdade') setFlag('eco_revelado');
  const sc = game.score();
  if (success) api.report?.({ ...sc, final: kind, bonus });
  save(true);
  // o final "verdade" do capítulo 4 não encerra: abre a segunda metade do caso
  const goesOn = kind === 'verdade' && (CASE.chapters?.chapters || []).some(c => c.startWhen === 'final_verdade');

  const close = () => { clear(root); if (goesOn) setFlag('final_verdade'); };
  const review = () => { clear(root); bus.emit('board:open'); };
  const label = { verdade: 'Caso reaberto', incompleto: 'Caso reaberto em parte', errado: 'Caso arquivado', serra: 'Caso encerrado', serra_parcial: 'Denúncia parcial', serra_errado: 'Denúncia rejeitada' }[kind] || 'Fim';

  const body = h('div', { class: 'end-body' },
    h('p', { class: `end-kicker k-${kind}` }, label),
    h('h1', { class: 'end-title' }, txt.title),
    txt.lead ? h('p', { class: 'end-lead' }, txt.lead) : null,
    (txt.paragraphs || []).map(p => h('p', { class: 'end-p' }, p)),
    txt.epilogue?.length ? h('div', { class: 'end-epi' }, txt.epilogue.map(p => h('p', null, p))) : null,
    bonus ? h('section', { class: 'end-eco' }, h('h2', null, bonusTxt.title || 'Anexo'), (bonusTxt.paragraphs || []).map(p => h('p', null, p))) : null,
    goesOn && txt.hook?.length ? h('div', { class: 'end-hook' }, txt.hook.map(p => h('p', null, p))) : null,
    h('div', { class: 'end-stats' },
      stat('Pontos', sc.pontos), stat('Acertos', `${sc.acertos}/${sc.total}`), stat('Tempo', `${Math.round(sc.tempo_min)} min`), stat('Dicas', sc.dicas)),
    h('div', { class: 'end-ach' }, progress.achievements().map(a => h('div', { class: `ach ${state.achievements?.[a.id] ? 'on' : ''}` }, h('b', null, a.title), h('span', null, a.text)))),
    h('div', { class: 'title-menu' },
      !success ? h('button', { class: 'tbtn primary', on: { click: review } }, 'Revisar o relatório') : null,
      h('button', { class: `tbtn ${success ? 'primary' : 'ghost'}`, on: { click: close } }, goesOn ? 'Continuar a investigação' : 'Voltar ao celular')));

  const el = h('div', { class: `ov ending-screen e-${kind.split('_')[0] === 'serra' ? (kind === 'serra' ? 'verdade' : kind === 'serra_parcial' ? 'incompleto' : 'errado') : kind}` }, h('div', { class: 'end-scroll' }, body));
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 60);
}

const stat = (k, v) => h('div', { class: 'st' }, h('b', null, String(v)), h('span', null, k));
