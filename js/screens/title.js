// Tela de título e menu.
import { h, clear } from '../core/dom.js';
import { state, hasSave, reset, save, adoptCloud } from '../core/state.js';
import { api } from '../core/api.js';
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
  const start = () => { sfx.unlockAudio(); reset(true); state.startedAt = Date.now(); save(true); location.href = location.pathname + location.search + '#novo'; location.reload(); };
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
      !inGame ? h('button', { class: 'tbtn ghost', on: { click: () => login(inGame) } }, 'Entrar com código') : h('button', { class: 'tbtn ghost', on: { click: () => account(inGame) } }, 'Meu código de acesso'),
      h('button', { class: 'tbtn ghost', on: { click: howTo } }, 'Como jogar'),
      h('button', { class: 'tbtn ghost', on: { click: credits } }, 'Créditos')),
    h('p', { class: 'ts-foot' }, 'Ficção. Pessoas, empresas e fatos são inventados.'),
  ]);
}

export function menu() { show({ inGame: true }); }

/** Mostra o código de acesso do jogador (a "conta"). */
function account(inGame) {
  const back = () => show({ inGame });
  const cod = state.player.codigo;
  shell([
    h('h2', { class: 'ts-h2' }, 'Seu código de acesso'),
    cod ? h('p', { class: 'ts-code' }, cod) : h('p', { class: 'ts-note' }, 'Ainda sem código: o servidor não respondeu. Ele é criado assim que houver internet.'),
    h('p', { class: 'ts-note' }, 'Com ele você continua o caso de onde parou em qualquer celular ou computador: na tela inicial, toque em "Entrar com código". O progresso vai para a nuvem sozinho enquanto você joga. Guarde o código: ele é a sua conta.'),
    h('div', { class: 'title-menu' },
      cod ? h('button', { class: 'tbtn primary', on: { click: (e) => { const b = e.currentTarget; navigator.clipboard?.writeText(cod).then(() => { b.textContent = 'Copiado'; }).catch(() => {}); } } }, 'Copiar código') : null,
      h('button', { class: 'tbtn ghost', on: { click: back } }, 'Voltar')),
  ]);
}

/** Entrar com o código de acesso: traz a conta e o progresso salvos na nuvem. */
function login(inGame) {
  const back = () => show({ inGame });
  const inp = h('input', { class: 'ts-input', type: 'text', maxlength: '9', placeholder: 'ABCD-1234', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', 'aria-label': 'Código de acesso' });
  const msg = h('p', { class: 'ts-note', role: 'status' }, 'O código aparece no menu do jogo, em "Meu código de acesso".');
  const btn = h('button', { class: 'tbtn primary' }, 'Entrar');
  const go = async () => {
    const raw = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length < 8) { msg.textContent = 'O código tem 8 letras e números, como ABCD-1234.'; inp.focus(); return; }
    const mine = (state.player.codigo || '').replace(/[^A-Z0-9]/g, '');
    if (hasSave() && state.flags.intro_done && mine && mine !== raw && !confirm('Este navegador já tem um caso em andamento com outro código. Trocar pelo caso deste código?')) return;
    btn.disabled = true; msg.textContent = 'Procurando o seu caso…';
    const j = await api.restore(raw);
    btn.disabled = false;
    if (!j) { msg.textContent = 'Não encontrei esse código, ou estou sem internet. Confira e tente de novo.'; return; }
    const tem = adoptCloud({ id: j.id, token: j.token, codigo: j.codigo, apelido: j.apelido }, j.estado);
    msg.textContent = tem ? 'Achei. Abrindo o caso…' : 'Código certo. Esse caso ainda não tinha progresso nesta versão: vamos começar.';
    setTimeout(() => location.reload(), tem ? 600 : 1600);
  };
  btn.addEventListener('click', go);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  shell([
    h('h2', { class: 'ts-h2' }, 'Entrar com código'),
    h('p', { class: 'ts-note' }, 'Digite o código de acesso para continuar o caso de onde parou, em qualquer aparelho.'),
    inp, msg,
    h('div', { class: 'title-menu' }, btn, h('button', { class: 'tbtn ghost', on: { click: back } }, 'Voltar')),
  ]);
  setTimeout(() => inp.focus(), 80);
}


function howTo() {
  const back = () => show({ inGame: !!state.flags.intro_done });
  shell([
    h('h2', { class: 'ts-h2' }, 'Como jogar'),
    h('ol', { class: 'ts-list' },
      h('li', null, h('b', null, 'Você é o investigador. '), 'O caso foi arquivado como acidente. Ninguém vai te dizer o que procurar.'),
      h('li', null, h('b', null, 'O celular. '), 'É a extração do aparelho de Iara, parado às 23:47 do sábado em que ela morreu. Abra os apps, leia, ouça, compare horários.'),
      h('li', null, h('b', null, 'O caderno. '), 'Seu diário de campo, suas notas e as pendências do caso. Se travar, "Repensar" revisa o que você já sabe, mas custa pontos.'),
      h('li', null, h('b', null, 'A lupa. '), 'Ligue o Modo Análise e toque nas palavras destacadas para guardar nomes, horas, lugares e objetos.'),
      h('li', null, h('b', null, 'O Quadro. '), 'Objetivos, provas fixadas, dossiês e linha do tempo. Cada capítulo termina numa dedução que você preenche com os termos guardados.'),
      h('li', null, h('b', null, 'O relatório. '), 'No fim, você monta o relatório para a jornalista. Ele decide o final.')),
    h('p', { class: 'ts-note' }, 'O progresso fica salvo neste navegador e na nuvem. Para continuar em outro aparelho, use o seu código de acesso (menu, "Meu código de acesso"). Jogue em computador ou celular; no celular, o Caderno e o Quadro ficam na barra do topo.'),
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
