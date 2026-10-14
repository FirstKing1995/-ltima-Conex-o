// Tela de título (versão mínima — o agente de recursos substitui por uma versão completa).
import { h, clear } from '../core/dom.js';
import { state, hasSave, reset, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { sfx } from '../core/sfx.js';

export function show() {
  const root = document.getElementById('overlay-root');
  clear(root);
  const close = () => clear(root);
  const novo = () => { sfx.unlockAudio(); reset(false); state.startedAt = Date.now(); save(true); close(); bus.emit('game:new'); };
  const cont = () => { sfx.unlockAudio(); close(); bus.emit('game:continue'); };
  root.appendChild(h('div', { class: 'ov title-screen' },
    h('div', { class: 'title-inner' },
      h('h1', null, 'Última Conexão'),
      h('p', null, 'Ela mandou a última mensagem para o número errado. O seu.'),
      h('div', { class: 'title-menu' },
        hasSave() ? h('button', { class: 'tbtn primary', on: { click: cont } }, 'Continuar') : null,
        h('button', { class: `tbtn ${hasSave() ? '' : 'primary'}`, on: { click: novo } }, 'Novo jogo')))));
}
