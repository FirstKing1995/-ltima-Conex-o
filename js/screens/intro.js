// Prólogo (versão mínima — o agente de recursos substitui pela cinemática completa).
import { h, clear } from '../core/dom.js';
import { setFlag } from '../core/state.js';

export function play() {
  const root = document.getElementById('overlay-root');
  clear(root);
  root.appendChild(h('div', { class: 'ov intro-screen' }, h('div', { class: 'title-inner' },
    h('p', null, 'Sábado, 23:31. Uma mensagem de um número desconhecido chega no seu celular.'),
    h('button', { class: 'tbtn primary', on: { click: () => { clear(root); setFlag('intro_done'); } } }, 'Continuar'))));
}
