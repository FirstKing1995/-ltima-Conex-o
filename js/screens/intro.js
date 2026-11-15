// Prólogo: você é o investigador. A mensagem errada, a notícia, o arquivamento, o celular sobre a mesa.
import { h, clear, sleep } from '../core/dom.js';
import { state, setFlag, save } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { bus } from '../core/bus.js';
import { api } from '../core/api.js';
import { appIconEl } from '../ui/appicons.js';

const MSG = 'Bruna, é a Iara. Número novo? Salva esse. Tô indo encontrar ela no mirante agora. Vou gravar tudo. Se eu não te mandar nada até amanhã, o Théo sabe onde tá a pasta.';

export async function play() {
  const root = document.getElementById('overlay-root');
  clear(root);
  let skipped = false;
  const stage = h('div', { class: 'in-stage' });
  const el = h('div', { class: 'ov intro-screen' }, stage);
  const skip = h('button', { class: 'in-skip', on: { click: () => { skipped = true; sign(); } } }, 'Pular');
  el.appendChild(skip);
  root.appendChild(el);

  const wait = async (ms) => { await sleep(ms); return skipped; };
  const line = (cls, text) => { const p = h('p', { class: `in-line ${cls}` }, text); stage.appendChild(p); requestAnimationFrame(() => p.classList.add('on')); setTimeout(() => p.classList.add('on'), 60); return p; };
  const wipe = async () => { stage.querySelectorAll('.in-line, .in-phone').forEach(n => n.classList.remove('on')); await sleep(800); clear(stage); };

  function sign() {
    skip.remove(); clear(stage);
    const inp = h('input', { class: 'in-name', type: 'text', maxlength: '24', placeholder: 'seu nome', autocomplete: 'off', 'aria-label': 'Seu nome' });
    const go = () => {
      const v = inp.value.trim().replace(/\s+/g, ' ');
      if (v.length < 2) { inp.focus(); inp.classList.add('err'); return; }
      state.player.apelido = v.slice(0, 24); save(true);
      bus.emit('player:name', { name: state.player.apelido });
      api.register(state.player.apelido).then(() => api.save());
      sfx.play('unlock');
      el.classList.add('out');
      setTimeout(() => { clear(root); setFlag('intro_done'); }, 650);
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    const form = h('div', { class: 'in-form' },
      h('p', { class: 'in-doc-k' }, 'Polícia Civil do Estado do Ceará'),
      h('p', { class: 'in-doc-t' }, 'Requisição de análise de aparelho celular'),
      h('p', { class: 'in-doc-p' }, 'Inquérito 0417/2026 · Delegacia Municipal de Guaraciaba do Norte · situação: arquivado (morte acidental).'),
      h('p', { class: 'in-doc-p' }, 'Objeto: um aparelho Nimbus N9, pertencente à vítima Iara Fontenele, entregue voluntariamente pela mãe. Extração em modo avião. Dados de nuvem obtidos até a data desta requisição.'),
      h('label', { class: 'in-doc-l' }, 'Investigador responsável', h('div', { class: 'in-sign' }, h('span', null, 'Insp.'), inp)),
      h('button', { class: 'tbtn primary', on: { click: go } }, 'Assinar e abrir o caso'));
    stage.appendChild(form);
    requestAnimationFrame(() => form.classList.add('on')); setTimeout(() => form.classList.add('on'), 60);
    setTimeout(() => inp.focus(), 300);
  }

  // sábado
  line('when', 'Sábado, 10 de outubro · 23:31');
  if (await wait(1700)) return;
  line('where', 'Fortaleza. Você acabou de chegar do plantão.');
  if (await wait(1900)) return;
  const notif = h('div', { class: 'in-phone' }, h('div', { class: 'in-notif' }, appIconEl('papo', 34, 'round'),
    h('div', { class: 'in-n-body' }, h('div', { class: 'in-n-hd' }, 'Papo · agora'), h('div', { class: 'in-n-tt' }, '+55 85 98741-2290'), h('div', { class: 'in-n-tx' }, MSG))));
  stage.appendChild(notif); sfx.play('notify');
  requestAnimationFrame(() => notif.classList.add('on')); setTimeout(() => notif.classList.add('on'), 60);
  if (await wait(6500)) return;
  line('think', 'Uma Bruna que você não conhece. Uma Iara que você não conhece.');
  if (await wait(2200)) return;
  line('think', 'Você não responde.');
  if (await wait(2400)) return;
  await wipe(); if (skipped) return;

  // domingo e segunda
  line('when', 'Domingo, 11 de outubro · 06:20');
  if (await wait(1500)) return;
  line('where', 'Serra da Ibiapaba. O caseiro de um sítio encontra o corpo de uma mulher no pé de uma pedra de quarenta metros.');
  if (await wait(3400)) return;
  line('when', 'Segunda · 07:10');
  if (await wait(1300)) return;
  line('where', 'O jornal dá o nome: Iara Fontenele, 27 anos, fotógrafa.');
  if (await wait(2600)) return;
  line('think', 'Você relê a mensagem de sábado. "Bruna, é a Iara."');
  if (await wait(3000)) return;
  await wipe(); if (skipped) return;

  // terça
  line('when', 'Terça, 13 de outubro · 23:12');
  if (await wait(1500)) return;
  line('where', 'O inquérito foi arquivado como acidente em dezenove horas.');
  if (await wait(2600)) return;
  line('where', 'Você pediu o celular dela como quem pede um favor. A mãe entregou sem perguntar nada. Só disse: "Ela não caía. Ela conhecia aquela pedra desde menina."');
  if (await wait(5200)) return;
  line('think', 'Ninguém mandou você fazer isso.');
  if (await wait(2400)) return;
  await wipe(); if (skipped) return;
  sign();
}
