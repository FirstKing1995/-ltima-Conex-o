// Tela de título e menu.
import { h, clear } from '../core/dom.js';
import { state, hasSave, reset, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { sfx } from '../core/sfx.js';
import { CASE } from '../core/store.js';
import { icon } from '../ui/icons.js';

const root = () => document.getElementById('overlay-root');

function shell(content, { dim = false } = {}) {
  const r = root(); clear(r);
  const el = h('div', { class: `ov title-screen ${dim ? 'dim' : ''}` },
    h('div', { class: 'ts-glow' }),
    h('div', { class: 'title-inner' }, content));
  r.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 60);
  return el;
}

export function show({ inGame = false } = {}) {
  const close = () => clear(root());
  const start = () => { sfx.unlockAudio(); reset(false); state.startedAt = Date.now(); save(true); location.href = location.pathname + location.search + '#novo'; location.reload(); };
  const novo = () => {
    if (!(hasSave() && state.flags.intro_done)) { sfx.unlockAudio(); close(); bus.emit('game:new'); return; }
    shell([
      h('h2', { class: 'ts-h2' }, 'Começar de novo?'),
      h('p', { class: 'ts-note' }, 'O progresso deste caso será apagado deste navegador.'),
      h('div', { class: 'title-menu' }, h('button', { class: 'tbtn primary', on: { click: start } }, 'Apagar e recomeçar'), h('button', { class: 'tbtn ghost', on: { click: () => show({ inGame }) } }, 'Cancelar')),
    ]);
  };
  const cont = () => { sfx.unlockAudio(); close(); bus.emit('game:continue'); };
  const started = hasSave() && state.flags.intro_done;
  shell([
    h('p', { class: 'ts-kicker' }, CASE.meta?.subtitle || 'Caso 01'),
    h('h1', { class: 'ts-title' }, 'Última', h('br'), 'Conexão'),
    h('p', { class: 'ts-tag' }, CASE.meta?.tagline || 'Ela mandou a última mensagem para o número errado. O seu.'),
    h('div', { class: 'title-menu' },
      inGame ? h('button', { class: 'tbtn primary', on: { click: close } }, 'Voltar ao caso') : null,
      !inGame && started ? h('button', { class: 'tbtn primary', on: { click: cont } }, 'Continuar investigação') : null,
      h('button', { class: `tbtn ${!inGame && !started ? 'primary' : ''}`, on: { click: novo } }, started ? 'Novo jogo' : 'Começar'),
      h('button', { class: 'tbtn ghost', on: { click: howTo } }, 'Como jogar'),
      h('button', { class: 'tbtn ghost', on: { click: credits } }, 'Créditos')),
    h('p', { class: 'ts-foot' }, 'Ficção. Pessoas, empresas e fatos são inventados. Use fones de ouvido.'),
  ]);
}

export function menu() { show({ inGame: true }); }


function howTo() {
  const back = () => show({ inGame: !!state.flags.intro_done });
  shell([
    h('h2', { class: 'ts-h2' }, 'Como jogar'),
    h('ol', { class: 'ts-list' },
      h('li', null, h('b', null, 'O celular. '), 'É uma cópia do aparelho de Iara, congelada às 23:47 do sábado em que ela morreu. Abra os apps, leia, ouça, compare horários.'),
      h('li', null, h('b', null, 'O ECO. '), 'Um hacker fala com você pelo canal cifrado. Ele orienta e dá dicas quando você pede, mas não entrega respostas.'),
      h('li', null, h('b', null, 'A lupa. '), 'Ligue o Modo Análise e toque nas palavras destacadas para guardar nomes, horas, lugares e objetos.'),
      h('li', null, h('b', null, 'O Quadro. '), 'Objetivos, provas fixadas, dossiês e linha do tempo. Cada capítulo termina numa dedução que você preenche com os termos guardados.'),
      h('li', null, h('b', null, 'O relatório. '), 'No fim, você monta o relatório para a jornalista. Ele decide o final.')),
    h('p', { class: 'ts-note' }, 'O progresso fica salvo neste navegador. Jogue em computador ou celular; no celular, o ECO e o Quadro ficam na barra do topo.'),
    h('div', { class: 'title-menu' }, h('button', { class: 'tbtn primary', on: { click: back } }, 'Entendi')),
  ]);
}

function credits() {
  const back = () => show({ inGame: !!state.flags.intro_done });
  shell([
    h('h2', { class: 'ts-h2' }, 'Créditos'),
    h('dl', { class: 'ts-cred' }, (CASE.meta?.credits || []).map(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
    h('div', { class: 'title-menu' }, h('button', { class: 'tbtn primary', on: { click: back } }, 'Voltar')),
  ]);
}

bus.on('overlay:back', () => { const r = root(); if (r.querySelector('.title-screen') && state.flags.intro_done) clear(r); });
export { icon };
