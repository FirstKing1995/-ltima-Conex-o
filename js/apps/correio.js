// Correio — o e-mail de Iara (nuvem: mostra dados até terça 13/10).
// Raiz: busca em pílula + gaveta de pastas + lista por período. Subtela: e-mail (assunto, cabeçalho, corpo, anexos).
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { state, save } from '../core/state.js';
import { colorFor } from '../core/store.js';

const FOLDERS = [
  { id: 'inbox', label: 'Caixa de entrada', icon: 'inbox' },
  { id: 'starred', label: 'Com estrela', icon: 'star' },
  { id: 'sent', label: 'Enviados', icon: 'send' },
  { id: 'promo', label: 'Promoções', icon: 'gift' },
  { id: 'spam', label: 'Spam', icon: 'shield-alert' },
  { id: 'trash', label: 'Lixeira', icon: 'trash-2' },
];
const folderLabel = (id) => FOLDERS.find(f => f.id === id)?.label || id;

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const prefs = () => { const a = (state.apps.correio ||= {}); a.read ||= {}; a.star ||= {}; return a; };
const isLive = (m) => m.live === true || m.id === 'seguranca-login';
const isRead = (m) => prefs().read[m.id] === true || m.read === true;
const isStar = (m) => (m.id in prefs().star ? !!prefs().star[m.id] : !!m.starred);

function person(p) {
  if (!p) return { name: '', email: '' };
  if (typeof p === 'string') {
    const m = p.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
    if (m) return { name: m[1].replace(/^"|"$/g, ''), email: m[2] };
    return p.includes('@') ? { name: '', email: p } : { name: p, email: '' };
  }
  return { name: p.name || '', email: p.email || '' };
}
const who = (p) => p.name || p.email || '—';
const recipients = (m) => [].concat(m.to || []).map(person);
const plain = (body) => String(body || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/^\s*>\s?/gm, '').replace(/\s+/g, ' ').trim();

/** "sáb., 10 de out. de 2026, 20:02" */
function fullDate(at) {
  const d = time.parse(at);
  return `${time.weekday(at)}., ${d.getDate()} de ${time.monthShort(d.getMonth())}. de ${d.getFullYear()}, ${time.hhmm(at)}`;
}
function dayDiff(a, b) {
  const da = time.parse(a), db = time.parse(b);
  return Math.round((Date.UTC(db.getFullYear(), db.getMonth(), db.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) / 86400000);
}
function bucket(m, now) {
  if (isLive(m)) return 'Agora';
  if (dayDiff(m.at, now) < 7) return 'Últimos 7 dias';
  const d = time.parse(m.at), n = time.parse(now);
  if (d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth()) return 'Este mês';
  const nm = time.monthName(d.getMonth());
  const cap = nm.charAt(0).toUpperCase() + nm.slice(1);
  return d.getFullYear() === n.getFullYear() ? cap : `${cap} de ${d.getFullYear()}`;
}

const FILE_TYPES = { pdf: ['file-text', '#ef6a5f', 'PDF'], docx: ['file-text', '#5b93ee', 'Documento'], xlsx: ['file-spreadsheet', '#46b974', 'Planilha'], txt: ['file-text', '#a9afb8', 'Texto'], m4a: ['file-audio', '#f39a4a', 'Áudio'], jpg: ['image', '#a78bfa', 'Imagem'], png: ['image', '#a78bfa', 'Imagem'] };
function fileSize(s) {
  if (s === undefined || s === null || s === '') return '';
  if (typeof s === 'string' && !/^\d+$/.test(s)) return s;
  const n = Number(s);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0).replace('.', ',')} kB`;
  return `${(n / 1048576).toFixed(1).replace('.', ',')} MB`;
}

/* corpo: parágrafos, citações (> ...), assinatura e links [texto](url) */
function inline(text, onLink) {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const url = m[2];
    out.push(h('a', { class: 'cr-link', href: '#', title: url, on: { click: (e) => { e.preventDefault(); onLink(url); } } }, m[1]));
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
function bodyNodes(text, onLink) {
  const blocks = String(text || '').replace(/\r/g, '').split(/\n{2,}/).filter(b => b.trim() !== '');
  return blocks.map((blk, i) => {
    const lines = blk.split('\n');
    if (lines.every(l => /^\s*>/.test(l))) return h('blockquote', { class: 'cr-quote' }, inline(lines.map(l => l.replace(/^\s*>\s?/, '')).join('\n'), onLink));
    const sig = i === blocks.length - 1 && i > 0 && blk.length < 170 && / · /.test(blk);
    return h('p', { class: `cr-p${sig ? ' cr-sig' : ''}` }, inline(blk, onLink));
  });
}

/* ---------- app ---------- */
export default {
  id: 'correio',
  title: 'Correio',
  cloud: true,

  render(ctx) {
    const { el, kit, game, phone, data, nav, params = {} } = ctx;
    const NOW = ctx.now || time.PRESENT_NOW;
    const files = () => ctx.store.CASE.arquivos?.files || [];
    const all = () => (data.emails || []).filter(m => game.req(m));
    const unreadIn = (id) => all().filter(m => m.folder === id && !isRead(m)).length;
    let folder = prefs().folder && FOLDERS.some(f => f.id === prefs().folder) ? prefs().folder : 'inbox';
    let filter = 'all';
    const external = () => phone.toast('Links externos indisponíveis no espelho', { icon: 'link' });
    const stub = (what) => phone.toast(`${what} indisponível no espelho`, { icon: 'info' });

    const letterAv = (name, email, live, size = 44) => {
      const l = h('span', { class: `cr-av ${live ? 'alert' : ''}`, style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.42) + 'px', background: live ? '' : colorFor(email || name || '?') } },
        live ? icon('shield-alert', { size: Math.round(size * 0.5) }) : (String(name || email || '?').trim().charAt(0).toUpperCase() || '?'));
      return l;
    };

    /* ----- seleção de e-mails ----- */
    function inFolder(id) {
      if (id === 'starred') return all().filter(m => isStar(m) && m.folder !== 'trash' && m.folder !== 'spam');
      return all().filter(m => m.folder === id);
    }
    const sorted = (list) => [...list].sort((a, b) => (isLive(b) - isLive(a)) || time.compare(b.at, a.at));

    /* ----- linha ----- */
    function row(m, { showFolder = false } = {}) {
      const unread = !isRead(m);
      const from = person(m.from);
      const sent = m.folder === 'sent';
      const name = sent ? `Para: ${recipients(m).map(who).join(', ')}` : who(from);
      const star = h('button', { class: `cr-star ${isStar(m) ? 'on' : ''}`, 'aria-label': isStar(m) ? 'Remover estrela' : 'Marcar com estrela', on: { click: (e) => { e.stopPropagation(); toggleStar(m); draw(); } } }, icon('star', { size: 19 }));
      return h('div', { class: `cr-row ${unread ? 'unread' : ''} ${isLive(m) ? 'live' : ''}` },
        h('button', { class: 'cr-open', on: { click: () => openMail(m) } },
          letterAv(sent ? who(recipients(m)[0] || {}) : from.name, sent ? recipients(m)[0]?.email : from.email, isLive(m)),
          h('span', { class: 'cr-main' },
            h('span', { class: 'cr-top' }, h('span', { class: 'cr-from' }, name), h('time', { class: 'cr-time' }, isLive(m) ? 'agora' : time.relative(m.at, NOW))),
            h('span', { class: 'cr-subj' }, m.subject),
            h('span', { class: 'cr-snip' }, showFolder && m.folder !== 'inbox' ? h('em', { class: 'cr-ftag' }, folderLabel(m.folder)) : null, plain(m.body)))),
        h('span', { class: 'cr-side' }, (m.attachments || []).length ? h('span', { class: 'cr-clip', 'aria-label': 'Tem anexo', title: 'Tem anexo' }, icon('paperclip', { size: 16 })) : null, star));
    }

    function toggleStar(m) { prefs().star[m.id] = !isStar(m); save(); }

    /* ----- raiz: lista ----- */
    const listEl = h('div', { class: 'cr-list' });
    const input = h('input', { type: 'search', placeholder: 'Pesquisar no e-mail', 'aria-label': 'Pesquisar no e-mail', autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'search' });
    let t = null;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(draw, 100); });
    const menuBtn = h('button', { class: 'cr-menubtn', 'aria-label': 'Abrir pastas', on: { click: () => openDrawer() } }, icon('menu', { size: 22 }));
    const pill = h('div', { class: 'cr-search', on: { click: (e) => { if (!e.target.closest('button')) input.focus(); } } }, menuBtn, input,
      kit.avatar({ src: 'assets/caso01/avatars/iara.svg', name: 'Iara', color: '#e25b45', size: 34 }));
    const newChips = () => kit.chips({ items: [{ id: 'all', label: 'Tudo' }, { id: 'unread', label: 'Não lidas', icon: 'mail' }, { id: 'att', label: 'Com anexo', icon: 'paperclip' }], active: 'all', onChange: (id) => { filter = id; draw(); } });
    let chipsEl = newChips();
    const top = h('div', { class: 'cr-top-sticky' }, pill, chipsEl);

    function draw() {
      clear(listEl);
      const q = fold(input.value).trim();
      let items;
      let heading;
      if (q) {
        items = all().filter(m => fold(`${m.subject} ${person(m.from).name} ${person(m.from).email} ${recipients(m).map(r => r.name + ' ' + r.email).join(' ')} ${plain(m.body)}`).includes(q));
        heading = `Resultados para “${input.value.trim()}”`;
      } else {
        items = inFolder(folder);
        heading = folderLabel(folder);
      }
      if (filter === 'unread') items = items.filter(m => !isRead(m));
      if (filter === 'att') items = items.filter(m => (m.attachments || []).length);
      items = sorted(items);
      const unreadN = items.filter(m => !isRead(m)).length;
      listEl.appendChild(h('div', { class: 'cr-heading' }, h('b', null, heading), h('span', null, q ? `${items.length} ${items.length === 1 ? 'e-mail' : 'e-mails'}` : (unreadN ? `${unreadN} ${unreadN === 1 ? 'não lida' : 'não lidas'}` : `${items.length} ${items.length === 1 ? 'e-mail' : 'e-mails'}`))));
      if (!items.length) {
        listEl.appendChild(kit.empty({ icon: q ? 'search' : (FOLDERS.find(f => f.id === folder)?.icon || 'inbox'), title: q ? 'Nenhum resultado' : 'Nada por aqui', text: q ? 'Tente outro nome, assunto ou palavra.' : 'Esta pasta está vazia.' }));
        return;
      }
      let lastB = null;
      for (const m of items) {
        const b = q ? null : bucket(m, NOW);
        if (b && b !== lastB) { listEl.appendChild(h('div', { class: 'cr-sec' }, b)); lastB = b; }
        listEl.appendChild(row(m, { showFolder: !!q }));
      }
    }

    /* ----- gaveta de pastas (folha lateral) ----- */
    function openDrawer() {
      const close = () => {
        ov.classList.remove('show');
        phone._popModal?.(close);
        setTimeout(() => ov.remove(), 260);
      };
      const go = (id) => { folder = id; prefs().folder = id; save(); input.value = ''; filter = 'all'; const fresh = newChips(); chipsEl.replaceWith(fresh); chipsEl = fresh; close(); draw(); el.scrollTop = 0; };
      const item = (f) => {
        const n = unreadIn(f.id);
        return h('button', { class: `cr-fitem ${folder === f.id ? 'on' : ''}`, on: { click: () => go(f.id) } },
          icon(f.icon, { size: 21 }), h('span', { class: 'cr-fname' }, f.label), n ? h('span', { class: `cr-fcount ${f.id === 'inbox' ? 'strong' : ''}` }, f.id === 'promo' ? `${n} novos` : String(n)) : null);
      };
      const drawer = h('aside', { class: 'cr-drawer', 'aria-label': 'Pastas do Correio' },
        h('div', { class: 'cr-brand' }, h('span', { class: 'cr-logo' }, icon('mail', { size: 22 })), h('div', null, h('b', null, 'Correio'), h('small', null, data.account || 'iara.fontenele@correio.app'))),
        h('nav', { class: 'cr-folders' }, FOLDERS.slice(0, 3).map(item), h('div', { class: 'cr-fdiv' }), FOLDERS.slice(3).map(item)),
        h('div', { class: 'cr-dnote' }, icon('cloud', { size: 14 }), 'Conta na nuvem · sincronizada'));
      const ov = h('div', { class: 'cr-drawer-ov', role: 'dialog', 'aria-label': 'Menu do Correio' }, h('div', { class: 'cr-scrim', on: { click: close } }), drawer);
      if (phone._mountModal) phone._mountModal(ov, close); else (ctx.screen || el).appendChild(ov);
      requestAnimationFrame(() => ov.classList.add('show'));
    }

    /* ----- e-mail (subtela) ----- */
    function openMail(m) {
      if (!game.req(m)) { phone.toast('E-mail indisponível', { icon: 'mail' }); return; }
      game.see('correio:mail:' + m.id);
      if (m.onSee) game.flags([].concat(m.onSee));
      if (!isRead(m)) { prefs().read[m.id] = true; save(); }
      nav.push({ className: 'cr-screen', render: (body, n) => mailView(body, m) });
    }

    function mailView(body, m) {
      const from = person(m.from);
      const tos = recipients(m);
      const ccs = [].concat(m.cc || []).map(person);
      const starBtn = h('button', { class: `k-iconbtn cr-topstar ${isStar(m) ? 'on' : ''}`, 'aria-label': 'Marcar com estrela', on: { click: () => { toggleStar(m); starBtn.classList.toggle('on', isStar(m)); } } }, icon('star', { size: 22 }));
      const d = time.parse(m.at);
      const stamp = h('div', { class: 'cr-stamp', 'aria-hidden': 'true' }, h('span', null, 'CORREIO'), h('b', null, `${String(d.getDate()).padStart(2, '0')} ${time.monthShort(d.getMonth()).toUpperCase()}`), h('span', null, String(d.getFullYear())));
      const meta = h('div', { class: 'cr-meta' }, stamp,
        h('div', { class: 'cr-from-row' }, letterAv(from.name, from.email, isLive(m), 46),
          h('div', { class: 'cr-from-txt' }, h('b', { class: 'txt' }, who(from)), from.name && from.email ? h('span', { class: 'txt' }, from.email) : null)),
        h('dl', { class: 'cr-dl' },
          h('dt', null, 'Para'), h('dd', { class: 'txt' }, tos.map(p => (p.name ? `${p.name} <${p.email}>` : p.email)).join(', ') || '—'),
          ccs.length ? [h('dt', null, 'Cc'), h('dd', { class: 'txt' }, ccs.map(p => (p.name ? `${p.name} <${p.email}>` : p.email)).join(', '))] : null,
          h('dt', null, 'Data'), h('dd', { class: 'txt' }, (isLive(m) ? 'agora · ' : '') + fullDate(m.at))));
      const atts = (m.attachments || []).map(a => {
        const f = files().find(x => x.id === a.file);
        const ext = String(f?.type || a.name?.split('.').pop() || '').toLowerCase();
        const [ic, color, label] = FILE_TYPES[ext] || ['file', '#9aa0a6', ext.toUpperCase() || 'Arquivo'];
        return h('button', { class: 'cr-att', on: { click: () => { if (a.file) phone.open('arquivos', { file: a.file }); else stub('Anexo'); } } },
          h('span', { class: 'cr-att-ic', style: `--ft:${color}` }, icon(ic, { size: 22 })),
          h('span', { class: 'cr-att-tx' }, h('b', null, a.name || f?.name || 'Anexo'), h('small', null, [label, fileSize(f?.size ?? a.size)].filter(Boolean).join(' · '))),
          icon('chevron-right', { size: 18 }));
      });
      body.append(...[
        kit.appBar({ title: folderLabel(m.folder), actions: [starBtn, { icon: 'trash-2', label: 'Excluir', onClick: () => stub('Excluir') }] }),
        h('h2', { class: 'cr-subject txt' }, m.subject),
        h('div', { class: 'cr-tags' }, h('span', { class: 'cr-tag' }, folderLabel(m.folder)), m.important ? h('span', { class: 'cr-tag imp' }, icon('circle-alert', { size: 12 }), 'Importante') : null),
        meta,
        h('div', { class: 'cr-body txt' }, bodyNodes(m.body, external)),
        atts.length ? h('div', { class: 'cr-atts' }, h('div', { class: 'cr-atts-h' }, icon('paperclip', { size: 15 }), `${atts.length} ${atts.length === 1 ? 'anexo' : 'anexos'}`), atts) : null,
        h('div', { class: 'cr-actions' },
          h('div', { class: 'cr-act-pin' }, kit.pinButton({ key: 'correio:mail:' + m.id, label: m.subject, app: 'correio', detail: `${who(from)} · ${fullDate(m.at)}` })),
          h('div', { class: 'cr-act-btns' },
            kit.button({ label: 'Responder', icon: 'reply', variant: 'tonal', onClick: () => stub('Responder') }),
            kit.button({ label: 'Encaminhar', icon: 'forward', variant: 'tonal', onClick: () => stub('Encaminhar') }))),
      ].filter(Boolean));
    }

    /* ----- montagem ----- */
    el.append(top, listEl);
    draw();
    (ctx.screen || el).appendChild(kit.fab({ icon: 'pencil', label: 'Escrever', onClick: () => stub('Escrever') }));
    nav.refresh?.(draw);

    if (params.mail) {
      const m = (data.emails || []).find(x => x.id === params.mail);
      if (m && game.req(m)) openMail(m); else phone.toast('E-mail indisponível', { icon: 'mail' });
    }
  },

  search({ data, game }) {
    return (data.emails || []).filter(m => game.req(m)).map(m => {
      const from = person(m.from);
      return { title: m.subject, text: `${from.name} <${from.email}> — ${plain(m.body)}`, params: { mail: m.id }, at: m.at };
    });
  },
};
