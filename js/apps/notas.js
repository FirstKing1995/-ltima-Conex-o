// Keep Notas — o bloco de notas de Iara (dados do aparelho: até sáb 23:47). Visual do Google Keep para Android (modo escuro).
// Raiz: barra "Pesquisar nas notas" + grade de cards com as cores do Keep (fixadas em cima) + botão "+".
// Subtela: a nota inteira na cor dela (texto ou lista de verificação, itens marcados no fim).
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { state, save } from '../core/state.js';

/* paleta escura do Keep: cor do dado → fundo do card */
const COLORS = {
  vermelho: '#77172e', // Coral
  laranja: '#692b17', // Pêssego
  amarelo: '#7c4a03', // Areia
  verde: '#264d3b', // Menta
  ciano: '#0c625d', // Sálvia
  azul: '#256377', // Neblina
  azulescuro: '#284255', // Tempestade
  roxo: '#472e5b', // Crepúsculo
  rosa: '#6c394f', // Flor
  marrom: '#4b443a', // Argila
  giz: '#2d2e30', // Giz
};
// "cinza" é a nota sem cor: no Keep escuro ela fica com o fundo do app e só o contorno
const ALIAS = { cinza: 'none', amarela: 'amarelo', padrao: 'none', default: 'none', branco: 'none', branca: 'none', neutro: 'none', grafite: 'giz', turquesa: 'ciano', 'azul-claro': 'azul', 'azul-escuro': 'azulescuro', dourado: 'amarelo', lilas: 'roxo', violeta: 'roxo', vinho: 'vermelho', vermelha: 'vermelho', laranjado: 'laranja', coral: 'vermelho', pessego: 'laranja', areia: 'amarelo', menta: 'verde', salvia: 'ciano', neblina: 'azul', tempestade: 'azulescuro', crepusculo: 'roxo', flor: 'rosa', argila: 'marrom', giz: 'cinza' };

/* ícones Material (SVG inline) */
const P_BOX = 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z';
const P_BOX_ON = 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
const P_LIST = 'M19 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6H5V5h14v4zm0 4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H5v-4h14v4z';
const P_GRID = 'M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z';
const P_ADDBOX = 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z';
const P_PALETTE = 'M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z';
function svg(d, size = 24, cls = '') {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="ic ${cls}" aria-hidden="true"><path d="${d}"/></svg>`;
  return t.content.firstChild;
}
/** "+" colorido do Google (botão de criar). */
function gPlus(size = 30) {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36" aria-hidden="true"><path fill="#EA4335" d="M16 6h4v10h-4z"/><path fill="#4285F4" d="M16 16h14v4H16z"/><path fill="#34A853" d="M16 20h4v10h-4z"/><path fill="#FBBC05" d="M6 16h10v4H6z"/></svg>`;
  return t.content.firstChild;
}

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const pad = (n) => String(n).padStart(2, '0');
/** fundo da nota ('' = sem cor: card com contorno) */
function colorOf(n) {
  const raw = String(n.color || '').trim();
  if (/^#[0-9a-f]{3,8}$/i.test(raw)) return `color-mix(in srgb, ${raw} 45%, #202124)`;
  const k = fold(raw).replace(/\s+/g, '');
  const key = COLORS[k] ? k : ALIAS[k];
  if (!raw || !key || key === 'none') return '';
  return COLORS[key];
}
const checklist = (n) => (Array.isArray(n.checklist) ? n.checklist.map(c => (typeof c === 'string' ? { text: c, done: false } : c)) : []);
const bodyOf = (n) => (typeof n.body === 'string' ? n.body : typeof n.text === 'string' ? n.text : '');
const firstLine = (n) => (bodyOf(n).split('\n').map(s => s.trim()).find(Boolean) || checklist(n)[0]?.text || '');
const plainText = (n) => [bodyOf(n), ...checklist(n).map(c => `${c.done ? '☑' : '☐'} ${c.text}`)].filter(Boolean).join('\n');
/** "1 de out. de 2026, 22:31" */
function stamp(at) {
  const d = time.parse(at);
  return `${d.getDate()} de ${time.monthShort(d.getMonth())}. de ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
/** "Editada às 16:55" (mesmo dia) | "Editada em 10 de out." | "... de 2025" */
function editedLabel(at, now) {
  const d = time.parse(at), n = time.parse(now);
  if (d.toDateString() === n.toDateString()) return `Editada às ${time.hhmm(at)}`;
  return `Editada em ${d.getDate()} de ${time.monthShort(d.getMonth())}.${d.getFullYear() !== n.getFullYear() ? ` de ${d.getFullYear()}` : ''}`;
}
/** peso visual aproximado, para repartir os cards nas duas colunas */
function weight(n) {
  const lines = bodyOf(n).split('\n').reduce((a, l) => a + Math.max(1, Math.ceil(l.length / 22)), 0);
  const open = checklist(n).filter(c => !c.done).length;
  return 1.2 + (n.title ? 1.4 : 0) + (bodyOf(n) ? Math.min(10, lines) : 0) + Math.min(8, open) * 1.1 + (checklist(n).some(c => c.done) ? 1 : 0);
}

/* ---------- app ---------- */
export default {
  id: 'notas',
  title: 'Keep Notas',
  cloud: false,

  render(ctx) {
    const { el, screen, kit, game, phone, data, params = {} } = ctx;
    const NOW = ctx.now || time.MIRROR_NOW;
    const notes = () => (data.notes || []).filter(n => game.req(n));
    const stub = () => phone.toast('Edição indisponível na extração', { icon: 'info' });
    const prefs = () => (state.apps.notas ||= {});

    /* ----- subtela: a nota ----- */
    function openNote(n) {
      game.see('notas:note:' + n.id);
      if (n.onSee) game.flags([].concat(n.onSee));
      const bg = colorOf(n);
      const items = checklist(n);
      const open = items.filter(i => !i.done), done = items.filter(i => i.done);
      const body = bodyOf(n);
      const title = n.title || firstLine(n) || 'Nota sem título';
      const edited = n.edited || n.created;
      phone.push({
        className: 'nt-screen',
        render: (box) => {
          const scr = box.parentElement;
          if (bg) scr.style.setProperty('--nt-bg', bg);
          box.appendChild(kit.appBar({ title: '', actions: [
            { icon: 'bell', label: 'Lembrete', onClick: stub },
            { icon: 'archive', label: 'Arquivar', onClick: stub },
          ] }));
          const li = (i) => h('li', { class: `nt-li ${i.done ? 'done' : ''}` }, h('span', { class: 'nt-box' }, svg(i.done ? P_BOX_ON : P_BOX, 22)), h('span', { class: 'nt-ct txt' }, i.text));
          const doneList = h('ul', { class: 'nt-list' }, done.map(li));
          const doneHead = done.length ? h('button', { class: 'nt-donehead open', 'aria-expanded': 'true', on: { click: () => { const show = doneList.hidden; doneList.hidden = !show; doneHead.classList.toggle('open', show); doneHead.setAttribute('aria-expanded', String(show)); } } },
            icon('chevron-down', { size: 20 }), `${done.length} ${done.length === 1 ? 'item marcado' : 'itens marcados'}`) : null;
          box.append(
            h('article', { class: 'nt-view' },
              n.title ? h('h1', { class: 'nt-title txt' }, n.title) : null,
              body ? h('div', { class: 'nt-body txt' }, body) : null,
              open.length ? h('ul', { class: 'nt-list' }, open.map(li)) : null,
              doneHead, done.length ? doneList : null,
              h('div', { class: 'nt-dates' },
                n.created && n.created !== edited ? h('span', null, `Criada em ${stamp(n.created)}`) : null,
                h('span', null, `Editada em ${stamp(edited)}`)),
              h('div', { class: 'nt-pinrow' }, kit.pinButton({ key: 'notas:note:' + n.id, label: title, app: 'notas', detail: firstLine(n).slice(0, 90) }))),
            h('div', { class: 'nt-bottom' },
              h('button', { class: 'nt-bbtn', 'aria-label': 'Adicionar', on: { click: stub } }, svg(P_ADDBOX, 22)),
              h('button', { class: 'nt-bbtn', 'aria-label': 'Opções de cor', on: { click: stub } }, svg(P_PALETTE, 22)),
              h('span', { class: 'nt-edited' }, editedLabel(edited, NOW)),
              h('button', { class: 'nt-bbtn', 'aria-label': 'Mais opções', on: { click: () => phone.toast('Compartilhar indisponível na extração', { icon: 'info' }) } }, icon('ellipsis-vertical', { size: 22 }))));
        },
      });
    }

    /* ----- raiz ----- */
    const cols = h('div', { class: 'nt-wrap' });
    let query = '';
    let single = !!prefs().list;
    const card = (n) => {
      const bg = colorOf(n);
      const items = checklist(n);
      const open = items.filter(i => !i.done);
      const doneN = items.length - open.length;
      const body = bodyOf(n);
      return h('button', { class: `nt-card ${bg ? 'tint' : ''}`, style: bg ? { '--nt-bg': bg } : null, dataset: { id: n.id }, on: { click: () => openNote(n) } },
        n.title ? h('h3', null, n.title) : null,
        body ? h('p', { class: 'nt-pv' }, body) : null,
        open.length ? h('ul', { class: 'nt-ckp' }, open.slice(0, 8).map(i => h('li', null, h('span', { class: 'nt-box' }, svg(P_BOX, 18)), h('span', { class: 'nt-ct' }, i.text))), open.length > 8 ? h('li', { class: 'more' }, '…') : null) : null,
        doneN ? h('div', { class: 'nt-donen' }, `+ ${doneN} ${doneN === 1 ? 'item marcado' : 'itens marcados'}`) : null);
    };
    const masonry = (list) => {
      if (single) return h('div', { class: 'nt-cols one' }, h('div', { class: 'nt-col' }, list.map(card)));
      const L = h('div', { class: 'nt-col' }), R = h('div', { class: 'nt-col' });
      let hl = 0, hr = 0;
      for (const n of list) { const w = weight(n); if (hl <= hr) { L.appendChild(card(n)); hl += w; } else { R.appendChild(card(n)); hr += w; } }
      return h('div', { class: 'nt-cols' }, L, R);
    };
    function draw() {
      cols.replaceChildren();
      const needle = fold(query).trim();
      const list = notes()
        .filter(n => !needle || fold(`${n.title || ''} ${plainText(n)}`).includes(needle))
        .sort((a, b) => time.compare(b.edited || b.created, a.edited || a.created));
      if (!list.length) {
        cols.appendChild(h('div', { class: 'nt-empty' }, icon(needle ? 'search' : 'sticky-note', { size: 96, stroke: 1 }), h('p', null, needle ? 'Nenhuma nota corresponde à pesquisa' : 'As notas que você adicionar aparecerão aqui')));
        return;
      }
      const pinned = list.filter(n => n.pinned), others = list.filter(n => !n.pinned);
      if (pinned.length) cols.append(h('div', { class: 'nt-sec' }, 'Fixadas'), masonry(pinned));
      if (others.length) { if (pinned.length) cols.appendChild(h('div', { class: 'nt-sec' }, 'Outras')); cols.appendChild(masonry(others)); }
    }

    const input = h('input', { type: 'search', placeholder: 'Pesquisar nas notas', 'aria-label': 'Pesquisar nas notas', autocomplete: 'off', spellcheck: 'false' });
    let tmr = null;
    input.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(() => { query = input.value; draw(); }, 120); });
    const viewBtn = h('button', { class: 'nt-tbtn', 'aria-label': single ? 'Visualização em grade' : 'Visualização em lista' }, svg(single ? P_GRID : P_LIST, 22));
    viewBtn.addEventListener('click', () => {
      single = !single; prefs().list = single; save();
      viewBtn.replaceChildren(svg(single ? P_GRID : P_LIST, 22));
      viewBtn.setAttribute('aria-label', single ? 'Visualização em grade' : 'Visualização em lista');
      draw();
    });
    const bar = h('div', { class: 'nt-top' },
      h('div', { class: 'nt-search', on: { click: (e) => { if (!e.target.closest('button')) input.focus(); } } },
        h('button', { class: 'nt-tbtn', 'aria-label': 'Menu', on: { click: () => phone.toast('Marcadores indisponíveis na extração', { icon: 'info' }) } }, icon('menu', { size: 22 })),
        input,
        viewBtn,
        h('span', { class: 'nt-me' }, kit.avatar({ src: 'assets/caso01/avatars/iara.jpg', name: 'Iara', color: '#e25b45', size: 32 }))));

    el.append(bar, cols);
    screen.appendChild(h('button', { class: 'nt-fab', 'aria-label': 'Criar nota', on: { click: stub } }, gPlus(34)));
    draw();

    if (params.note) {
      const n = notes().find(x => x.id === params.note);
      if (n) openNote(n); else phone.toast('Nota não encontrada', { icon: 'info' });
    }
  },

  search({ data, game }) {
    return (data.notes || []).filter(n => game.req(n)).map(n => ({
      title: n.title || firstLine(n) || 'Nota',
      text: `${n.title || ''}\n${plainText(n)}`,
      params: { note: n.id },
      at: n.edited || n.created,
    }));
  },
};
