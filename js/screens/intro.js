// Prólogo cinematográfico: a mensagem errada (sáb 23:31) e o contato do ECO (ter 23:12).
import { h, clear, sleep } from '../core/dom.js';
import { setFlag } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { bus } from '../core/bus.js';
import { appIconEl } from '../ui/appicons.js';

const MSG = 'Bruna, é a Iara. Número novo? Salva esse. Tô indo encontrar ela no mirante agora. Vou gravar tudo. Se eu não te mandar nada até amanhã, o Théo sabe onde tá a pasta.';

export async function play() {
  const root = document.getElementById('overlay-root');
  clear(root);
  let skipped = false;
  const finish = () => {
    if (skipped) return; skipped = true;
    el.classList.add('out');
    setTimeout(() => { clear(root); setFlag('intro_done'); bus.emit('eco:open'); }, 600);
  };
  const stage = h('div', { class: 'in-stage' });
  const skip = h('button', { class: 'in-skip', on: { click: finish } }, 'Pular');
  const el = h('div', { class: 'ov intro-screen' }, stage, skip);
  root.appendChild(el);

  const wait = async (ms) => { await sleep(ms); return skipped; };
  const line = (cls, text) => { const p = h('p', { class: `in-line ${cls}` }, text); stage.appendChild(p); requestAnimationFrame(() => p.classList.add('on')); return p; };
  const wipe = async () => { stage.querySelectorAll('.in-line, .in-phone').forEach(n => n.classList.remove('on')); await sleep(700); clear(stage); };

  // cena 1 — sábado
  line('when', 'Sábado, 10 de outubro · 23:31');
  if (await wait(1600)) return;
  line('where', 'Fortaleza. Você está quase dormindo.');
  if (await wait(1700)) return;
  const notif = h('div', { class: 'in-phone' },
    h('div', { class: 'in-notif' },
      appIconEl('papo', 34, 'round'),
      h('div', { class: 'in-n-body' },
        h('div', { class: 'in-n-hd' }, 'Papo · agora'),
        h('div', { class: 'in-n-tt' }, '+55 85 98741-2290'),
        h('div', { class: 'in-n-tx' }, MSG))));
  stage.appendChild(notif);
  sfx.play('notify');
  requestAnimationFrame(() => notif.classList.add('on'));
  if (await wait(5200)) return;
  line('think', 'Número desconhecido. Uma Bruna que você não conhece.');
  if (await wait(1900)) return;
  line('think', 'Golpe, você pensa. Vira para o lado e dorme.');
  if (await wait(2600)) return;
  await wipe(); if (skipped) return;

  // cena 2 — terça
  line('when', 'Terça, 13 de outubro · 23:12');
  if (await wait(1600)) return;
  line('where', 'Uma janela abre sozinha no seu computador. Um canal que você nunca instalou.');
  if (await wait(2400)) return;
  const eco = h('div', { class: 'in-phone' }, h('div', { class: 'in-eco' }, appIconEl('eco', 40, 'round'), h('div', null, h('b', null, 'ECO // canal seguro'), h('span', null, 'conexão cifrada · alguém está digitando'))));
  stage.appendChild(eco);
  sfx.play('eco');
  requestAnimationFrame(() => eco.classList.add('on'));
  if (await wait(1800)) return;
  const go = h('button', { class: 'tbtn primary in-go', on: { click: finish } }, 'Abrir o canal');
  stage.appendChild(go);
  requestAnimationFrame(() => go.classList.add('on'));
}
