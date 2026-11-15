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
  let skipped = false, signed = false, resolveTap = null;
  const stage = h('div', { class: 'in-stage' });
  const el = h('div', { class: 'ov intro-screen' }, stage);
  const skip = h('button', { class: 'in-skip', on: { click: () => { skipped = true; if (resolveTap) { const r = resolveTap; resolveTap = null; r(); } sign(); } } }, 'Pular');
  el.appendChild(skip);
  root.appendChild(el);

  const line = (cls, text) => { const p = h('p', { class: `in-line ${cls}` }, text); stage.appendChild(p); requestAnimationFrame(() => p.classList.add('on')); setTimeout(() => p.classList.add('on'), 60); return p; };
  const wipe = async () => { stage.querySelectorAll('.in-line, .in-phone').forEach(n => n.classList.remove('on')); await sleep(800); clear(stage); };

  function sign() {
    if (signed) return; signed = true;
    skip.remove(); el.querySelector(".in-next")?.remove(); clear(stage);
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

  // Cada cena aparece em partes; o jogador avança no próprio ritmo (toque, clique, Enter ou espaço).
  const notifEl = () => h("div", { class: "in-phone" }, h("div", { class: "in-notif" }, appIconEl("papo", 34, "round"),
    h("div", { class: "in-n-body" }, h("div", { class: "in-n-hd" }, "Papo · agora"), h("div", { class: "in-n-tt" }, "+55 85 98741-2290"), h("div", { class: "in-n-tx" }, MSG))));
  const beats = [
    { items: [["when", "Sábado, 10 de outubro · 23:31"], ["where", "Fortaleza. Você acabou de chegar do plantão."]] },
    { items: [["notif"]] },
    { items: [["think", "Uma Bruna que você não conhece. Uma Iara que você não conhece."], ["think", "Você não responde."]] },
    { wipe: true, items: [["when", "Domingo, 11 de outubro · 06:20"], ["where", "Serra da Ibiapaba. O caseiro de um sítio encontra o corpo de uma mulher no pé de uma pedra de quarenta metros."]] },
    { items: [["when", "Segunda · 07:10"], ["where", "O jornal dá o nome: Iara Fontenele, 27 anos, fotógrafa."]] },
    { items: [["think", "Você relê a mensagem de sábado. \"Bruna, é a Iara.\""]] },
    { wipe: true, items: [["when", "Terça, 13 de outubro · 23:12"], ["where", "O inquérito foi arquivado como acidente em dezenove horas."]] },
    { items: [["where", "Você pediu o celular dela como quem pede um favor. A mãe entregou sem perguntar nada. Só disse: \"Ela não caía. Ela conhecia aquela pedra desde menina.\""]] },
    { items: [["think", "Ninguém mandou você fazer isso."]] },
  ];

  const hint = h("div", { class: "in-next", "aria-hidden": "true" }, "toque para continuar");
  el.appendChild(hint);
  let hurry = false;
  const tap = () => { if (resolveTap) { const r = resolveTap; resolveTap = null; r(); } else hurry = true; };
  el.addEventListener("click", (e) => { if (e.target.closest(".in-skip, .in-form")) return; tap(); });
  const onKey = (e) => { if (skipped) return; if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); tap(); } };
  document.addEventListener("keydown", onKey);
  const waitTap = () => new Promise(r => { resolveTap = r; hint.classList.add("on"); }).then(() => hint.classList.remove("on"));
  const pause = async (ms) => { const t0 = Date.now(); while (!hurry && !skipped && Date.now() - t0 < ms) await sleep(50); };
  const done = () => { document.removeEventListener("keydown", onKey); hint.remove(); };

  for (const b of beats) {
    if (skipped) return done();
    if (b.wipe) { await wipe(); if (skipped) return done(); }
    hurry = false;
    for (const [k, t] of b.items) {
      if (k === "notif") { const n = notifEl(); stage.appendChild(n); sfx.play("notify"); requestAnimationFrame(() => n.classList.add("on")); setTimeout(() => n.classList.add("on"), 60); }
      else line(k, t);
      await pause(900);
      if (skipped) return done();
    }
    await waitTap();
    if (skipped) return done();
  }
  done();
  await wipe(); if (skipped) return;
  sign();
}
