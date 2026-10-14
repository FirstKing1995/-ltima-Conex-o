// Notas — o bloco de notas de Iara (dados do aparelho: até sáb 23:47).
// Raiz: busca + grade de cartões coloridos (fixadas no topo). Subtela: a nota inteira (texto com quebras de linha ou lista de verificação).
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

/* paleta (fundo escuro tingido + cor de destaque) */
const COLORS = {
  amarelo: { bg: '#3a3417', ac: '#f2c94c' },
  verde: { bg: '#16352a', ac: '#5bd68a' },
  rosa: { bg: '#40202e', ac: '#f08ab0' },
  azul: { bg: '#1a2f4d', ac: '#8fb8ff' },
  laranja: { bg: '#40291a', ac: '#f5a35c' },
  roxo: { bg: '#2f2349', ac: '#b79cff' },
  cinza: { bg: '#26292e', ac: '#aab0b8' },
  ciano: { bg: '#143a40', ac: '#5fd0e0' },
  vermelho: { bg: '#431f1e', ac: '#ff7b72' },
};
const ALIAS = { amarela: 'amarelo', padrao: 'cinza', default: 'cinza', branco: 'cinza', branca: 'cinza', neutro: 'cinza', grafite: 'cinza', turquesa: 'ciano', 'azul-claro': 'ciano', marrom: 'laranja', dourado: 'amarelo', lilas: 'roxo', violeta: 'roxo', vinho: 'vermelho', vermelha: 'vermelho', laranjado: 'laranja' };

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const pad = (n) => String(n).padStart(2, '0');
function colorOf(n) {
  const raw = String(n.color || '').trim();
  if (/^#[0-9a-f]{3,8}$/i.test(raw)) return { bg: `color-mix(in srgb, ${raw} 22%, #16181b)`, ac: raw };
  const k = fold(raw);
  return COLORS[k] || COLORS[ALIAS[k]] || COLORS.cinza;
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
/** rótulo curto do cartão: "10 de out." (ou com o ano, se for outro) */
function shortDate(at, now) {
  const d = time.parse(at), n = time.parse(now);
  return `${d.getDate()} de ${time.monthShort(d.getMonth())}.${d.getFullYear() !== n.getFullYear() ? ` de ${d.getFullYear()}` : ''}`;
}
/** peso visual aproximado, para repartir os cartões nas duas colunas */
function weight(n) {
  const lines = bodyOf(n).split('\n').reduce((a, l) => a + Math.max(1, Math.ceil(l.length / 24)), 0);
  return 1.5 + (n.title ? 1.6 : 0) + (bodyOf(n) ? Math.min(7, lines) : 0) + Math.min(6, checklist(n).length) * 1.15;
}
const style = (c) => `--nt-bg:${c.bg};--nt-ac:${c.ac}`;

/* ---------- app ---------- */
export default {
  id: 'notas',
  title: 'Notas',
  cloud: false,

  render(ctx) {
    const { el, screen, kit, game, phone, data, params = {} } = ctx;
    const NOW = ctx.now || time.MIRROR_NOW;
    const notes = () => (data.notes || []).filter(n => game.req(n));
    const stub = () => phone.toast('Edição indisponível no espelho', { icon: 'info' });

    /* ----- subtela: a nota ----- */
    function openNote(n) {
      game.see('notas:note:' + n.id);
      if (n.onSee) game.flags([].concat(n.onSee));
      const c = colorOf(n);
      const items = checklist(n);
      const body = bodyOf(n);
      const title = n.title || firstLine(n) || 'Nota sem título';
      const done = items.filter(i => i.done).length;
      phone.push({
        className: 'nt-screen',
        render: (box) => {
          const scr = box.parentElement;
          scr.style.setProperty('--nt-bg', c.bg);
          scr.style.setProperty('--nt-ac', c.ac);
          box.appendChild(kit.appBar({ title: '', actions: [{ icon: 'share-2', label: 'Compartilhar', onClick: () => phone.toast('Compartilhar indisponível no espelho', { icon: 'info' }) }] }));
          box.append(
            h('article', { class: 'nt-view' },
              n.title ? h('h1', { class: 'nt-title txt' }, n.title) : null,
              h('div', { class: 'nt-meta' },
                h('span', null, `Editada em ${stamp(n.edited || n.created)}`),
                n.created && n.edited && n.created !== n.edited ? h('span', null, `Criada em ${stamp(n.created)}`) : null,
                items.length ? h('span', null, `${done} de ${items.length} ${items.length === 1 ? 'item concluído' : 'itens concluídos'}`) : null),
              body ? h('div', { class: 'nt-body txt' }, body) : null,
              items.length ? h('ul', { class: 'nt-list' }, items.map(i => h('li', { class: `nt-li ${i.done ? 'done' : ''}` }, h('span', { class: 'nt-box', 'aria-hidden': 'true' }), h('span', { class: 'nt-ct txt' }, i.text)))) : null),
            h('div', { class: 'nt-bottom' }, kit.pinButton({ key: 'notas:note:' + n.id, label: title, app: 'notas', detail: firstLine(n).slice(0, 90) })));
        },
      });
    }

    /* ----- raiz ----- */
    const cols = h('div', { class: 'nt-wrap' });
    let query = '';
    const card = (n) => {
      const c = colorOf(n);
      const items = checklist(n);
      const body = bodyOf(n);
      return h('button', { class: `nt-card ${n.pinned ? 'pinned' : ''}`, style: style(c), dataset: { id: n.id }, on: { click: () => openNote(n) } },
        n.title ? h('h3', null, n.title) : null,
        body ? h('p', { class: 'nt-pv' }, body) : null,
        items.length ? h('ul', { class: 'nt-ckp' }, items.slice(0, 6).map(i => h('li', { class: i.done ? 'done' : '' }, h('span', { class: 'nt-box', 'aria-hidden': 'true' }), h('span', { class: 'nt-ct' }, i.text))), items.length > 6 ? h('li', { class: 'more' }, `+ ${items.length - 6} ${items.length - 6 === 1 ? 'item' : 'itens'}`) : null) : null,
        h('div', { class: 'nt-dt' }, n.pinned ? icon('pin', { size: 13 }) : null, shortDate(n.edited || n.created, NOW)));
    };
    const masonry = (list) => {
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
      if (!list.length) { cols.appendChild(kit.empty({ icon: 'sticky-note', title: needle ? 'Nada encontrado' : 'Sem notas', text: needle ? 'Nenhuma nota corresponde à busca.' : 'Nenhuma nota neste aparelho.' })); return; }
      const pinned = list.filter(n => n.pinned), others = list.filter(n => !n.pinned);
      if (pinned.length) cols.append(h('div', { class: 'nt-sec' }, 'Fixadas'), masonry(pinned));
      if (others.length) { if (pinned.length) cols.appendChild(h('div', { class: 'nt-sec' }, 'Outras')); cols.appendChild(masonry(others)); }
    }

    el.append(kit.appBar({ title: ctx.app?.title || 'Notas' }), kit.search({ placeholder: 'Pesquisar nas notas', onInput: (v) => { query = v; draw(); } }), cols);
    screen.appendChild(kit.fab({ icon: 'plus', label: 'Nota', onClick: stub }));
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

