// Final (versão mínima — o agente de recursos substitui).
import { h, clear } from '../core/dom.js';
import { state } from '../core/state.js';
export function play(result) {
  const root = document.getElementById('overlay-root');
  clear(root);
  root.appendChild(h('div', { class: 'ov ending-screen' }, h('div', { class: 'title-inner' }, h('h1', null, 'Fim'), h('p', null, `Resultado: ${result?.ending || state.finalResult?.ending || '—'}`), h('button', { class: 'tbtn', on: { click: () => clear(root) } }, 'Voltar ao celular'))));
}
