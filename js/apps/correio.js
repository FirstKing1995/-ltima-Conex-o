// Gmail — o e-mail de Iara (nuvem: mostra dados até terça 13/10). Visual do Gmail para Android (Material 3, modo escuro).
// Raiz: barra "Pesquisar no e-mail" (menu + avatar), rótulo da caixa, lista, botão "Escrever" e barra inferior E-mail / Meet.
// Gaveta lateral com as pastas. Subtela: o e-mail (assunto, marcador, remetente, detalhes, corpo, anexos).
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { state, save } from '../core/state.js';
import { colorFor } from '../core/store.js';

/* ---------- ícones Material (SVG inline) ---------- */
const P_TAG = 'M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z';
const P_IMP = 'M15 19H3l4.5-7L3 5h12c.65 0 1.26.31 1.63.84L21 12l-4.37 6.16c-.37.52-.98.84-1.63.84zm-8.5-2H15l3.5-5L15 7H6.5l3.5 5-3.5 5z';
const P_IMP_FILL = 'M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z';
function svg(d, size = 24, cls = '') {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="ic ${cls}" aria-hidden="true"><path d="${d}"/></svg>`;
  return t.content.firstChild;
}
/** Logotipo "M" do Gmail (4 cores). */
function gmailLogo(size = 30) {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 0.75)}" viewBox="52 42 88 66" aria-hidden="true"><path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/><path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/><path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/><path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/><path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/></svg>`;
  return t.content.firstChild;
}

/* pastas da gaveta (ids reais: inbox | promo | sent | spam | trash; os outros são visões) */
const FOLDERS = [
  { id: 'inbox', label: 'Principal', icon: 'inbox', group: 1 },
  { id: 'promo', label: 'Promoções', path: P_TAG, group: 1 },
  { id: 'starred', label: 'Com estrela', icon: 'star', group: 2 },
  { id: 'snoozed', label: 'Adiados', icon: 'clock', group: 2 },
  { id: 'important', label: 'Importante', path: P_IMP, group: 2 },
  { id: 'sent', label: 'Enviados', icon: 'send', group: 2 },
  { id: 'drafts', label: 'Rascunhos', icon: 'file', group: 2 },
  { id: 'all', label: 'Todos os e-mails', icon: 'mail', group: 2 },
  { id: 'spam', label: 'Spam', icon: 'circle-alert', group: 2 },
  { id: 'trash', label: 'Lixeira', icon: 'trash-2', group: 2 },
];
const folderLabel = (id) => FOLDERS.find(f => f.id === id)?.label || id;
/* nome do marcador como aparece no e-mail aberto */
const MAIL_LABEL = { inbox: 'Caixa de entrada', promo: 'Promoções', sent: 'Enviados', spam: 'Spam', trash: 'Lixeira' };
const mailLabel = (id) => MAIL_LABEL[id] || folderLabel(id);
const folderIcon = (f, size = 22) => (f.path ? svg(f.path, size) : icon(f.icon, { size }));

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const prefs = () => { const a = (state.apps.correio ||= {}); a.read ||= {}; a.star ||= {}; return a; };
const isLive = (m) => m.live === true || m.id === 'seguranca-login';
const isRead = (m) => prefs().read[m.id] === true || m.read === true;
const isStar = (m) => (m.id in prefs().star ? !!prefs().star[m.id] : !!m.starred);
const outside = (m) => m.folder === 'trash' || m.folder === 'spam';

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
const pad = (n) => String(n).padStart(2, '0');

/** "sáb., 10 de out. de 2026, 20:02" */
function fullDate(at) {
  const d = time.parse(at);
  return `${time.weekday(at)}., ${d.getDate()} de ${time.monthShort(d.getMonth())}. de ${d.getFullYear()}, ${time.hhmm(at)}`;
}
/** Data da lista, como no Gmail: "22:58" (hoje) | "12 de out." | "12/10/2025" */
function gDate(at, now) {
  const d = time.parse(at), n = time.parse(now);
  if (d.toDateString() === n.toDateString()) return time.hhmm(at);
  if (d.getFullYear() === n.getFullYear()) return `${d.getDate()} de ${time.monthShort(d.getMonth())}.`;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const FILE_TYPES = { pdf: ['file-text', '#ee675c', 'PDF'], docx: ['file-text', '#4c8df6', 'Documento'], xlsx: ['file-spreadsheet', '#37a864', 'Planilha'], txt: ['file-text', '#a8adb3', 'Texto'], m4a: ['file-audio', '#f29a3d', 'Áudio'], jpg: ['image', '#e8710a', 'Imagem'], png: ['image', '#e8710a', 'Imagem'] };
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
  title: 'Gmail',
  cloud: true,

  render(ctx) {
    const { el, kit, game, phone, data, nav, params = {} } = ctx;
    const NOW = ctx.now || time.PRESENT_NOW;
    const ACCOUNT = data.account || 'iara.fontenele@gmail.com';
    const files = () => ctx.store.CASE.arquivos?.files || [];
    const all = () => (data.emails || []).filter(m => game.req(m));
    let folder = prefs().folder && FOLDERS.some(f => f.id === prefs().folder) ? prefs().folder : 'inbox';
    let only = null; // filtro da busca: null | 'unread' | 'att' | 'star'
    let searching = false;
    const external = () => phone.toast('Links externos indisponíveis na extração', { icon: 'link' });
    const stub = (what) => phone.toast(`${what} indisponível na extração`, { icon: 'info' });
    const me = (p) => fold(p.email) === fold(ACCOUNT);
    const userAvatar = (size) => kit.avatar({ src: 'assets/caso01/avatars/iara.jpg', name: 'Iara', color: '#e25b45', size });

    const letterAv = (name, email, live, size = 40) =>
      h('span', { class: `cr-av ${live ? 'alert' : ''}`, style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.45) + 'px', background: live ? '' : colorFor(email || name || '?') } },
        live ? icon('shield-alert', { size: Math.round(size * 0.52) }) : (String(name || email || '?').trim().charAt(0).toUpperCase() || '?'));

    /* ----- seleção de e-mails ----- */
    function inFolder(id) {
      const list = all();
      if (id === 'starred') return list.filter(m => isStar(m) && !outside(m));
      if (id === 'important') return list.filter(m => m.important && !outside(m));
      if (id === 'all') return list.filter(m => !outside(m));
      if (id === 'snoozed' || id === 'drafts') return [];
      return list.filter(m => m.folder === id);
    }
    const unreadIn = (id) => inFolder(id).filter(m => !isRead(m)).length;
    const sorted = (list) => [...list].sort((a, b) => (isLive(b) - isLive(a)) || time.compare(b.at, a.at));
    function toggleStar(m) { prefs().star[m.id] = !isStar(m); save(); }

    /* ----- linha da lista ----- */
    function attChip(a) {
      const f = files().find(x => x.id === a.file);
      const ext = String(f?.type || a.name?.split('.').pop() || '').toLowerCase();
      const [ic, color] = FILE_TYPES[ext] || ['file', '#a8adb3'];
      return h('span', { class: 'cr-achip' }, h('span', { class: 'cr-achip-ic', style: { color } }, icon(ic, { size: 15 })), h('span', { class: 'cr-achip-t' }, a.name || f?.name || 'Anexo'));
    }

    function row(m, { showFolder = false } = {}) {
      const unread = !isRead(m);
      const from = person(m.from);
      const sent = m.folder === 'sent';
      const name = sent ? `Para: ${recipients(m).map(who).join(', ')}` : (me(from) ? 'eu' : who(from));
      const atts = m.attachments || [];
      const star = h('button', { class: `cr-star ${isStar(m) ? 'on' : ''}`, 'aria-label': isStar(m) ? 'Remover estrela' : 'Marcar com estrela', on: { click: (e) => { e.stopPropagation(); toggleStar(m); draw(); } } }, icon('star', { size: 20 }));
      return h('div', { class: `cr-row ${unread ? 'unread' : ''} ${isLive(m) ? 'live' : ''}` },
        h('button', { class: 'cr-open', on: { click: () => openMail(m) } },
          letterAv(sent ? who(recipients(m)[0] || {}) : from.name, sent ? recipients(m)[0]?.email : from.email, isLive(m)),
          h('span', { class: 'cr-main' },
            h('span', { class: 'cr-l1' },
              h('span', { class: 'cr-from' }, name),
              h('time', { class: 'cr-time' }, isLive(m) ? 'agora' : gDate(m.at, NOW))),
            h('span', { class: 'cr-subj' }, m.important && !outside(m) ? h('span', { class: 'cr-impm', title: 'Importante' }, svg(P_IMP_FILL, 15)) : null, h('span', null, m.subject)),
            h('span', { class: 'cr-snip' }, showFolder && m.folder !== 'inbox' ? h('em', { class: 'cr-ftag' }, mailLabel(m.folder)) : null, plain(m.body)),
            atts.length ? h('span', { class: 'cr-atts-row' }, attChip(atts[0]), atts.length > 1 ? h('span', { class: 'cr-amore' }, `+${atts.length - 1}`) : null) : null)),
        star);
    }

    /* ----- raiz: busca ----- */
    const listEl = h('div', { class: 'cr-list' });
    const input = h('input', { type: 'search', placeholder: 'Pesquisar no e-mail', 'aria-label': 'Pesquisar no e-mail', autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'search' });
    let t = null;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(draw, 100); });
    input.addEventListener('focus', () => { if (!searching) { searching = true; syncSearch(); } });
    const leadBtn = h('button', { class: 'cr-lead', 'aria-label': 'Abrir menu', on: { click: () => (searching ? exitSearch() : openDrawer()) } }, icon('menu', { size: 24 }));
    const avBox = h('span', { class: 'cr-me', title: ACCOUNT }, userAvatar(32));
    const pill = h('div', { class: 'cr-search', on: { click: (e) => { if (!e.target.closest('button')) input.focus(); } } }, leadBtn, input, avBox);
    const chipsEl = h('div', { class: 'cr-chips', hidden: true });
    const CHIPS = [{ id: 'unread', label: 'Não lidos', icon: 'mail' }, { id: 'att', label: 'Anexo', icon: 'paperclip' }, { id: 'star', label: 'Com estrela', icon: 'star' }];
    function drawChips() {
      clear(chipsEl);
      for (const c of CHIPS) {
        const on = only === c.id;
        chipsEl.appendChild(h('button', { class: `cr-chip ${on ? 'on' : ''}`, 'aria-pressed': String(on), on: { click: () => { only = on ? null : c.id; drawChips(); draw(); } } },
          icon(on ? 'check' : c.icon, { size: 16 }), c.label));
      }
    }
    function syncSearch() {
      pill.classList.toggle('on', searching);
      chipsEl.hidden = !searching;
      avBox.hidden = searching;
      clear(leadBtn).appendChild(icon(searching ? 'arrow-left' : 'menu', { size: 24 }));
      leadBtn.setAttribute('aria-label', searching ? 'Sair da pesquisa' : 'Abrir menu');
      drawChips();
      draw();
    }
    function exitSearch() { searching = false; input.value = ''; only = null; input.blur(); syncSearch(); el.scrollTop = 0; }
    const top = h('div', { class: 'cr-top' }, pill, chipsEl);

    /* ----- barra inferior + botão Escrever ----- */
    const navBadge = h('span', { class: 'cr-nbadge', hidden: true });
    const bottom = h('nav', { class: 'cr-nav', 'aria-label': 'Gmail' },
      h('button', { class: 'cr-ntab on', 'aria-current': 'page', on: { click: () => { if (searching) exitSearch(); else el.scrollTo({ top: 0, behavior: 'smooth' }); } } },
        h('span', { class: 'cr-nind' }, icon('mail', { size: 22 }), navBadge), h('span', { class: 'cr-nlbl' }, 'E-mail')),
      h('button', { class: 'cr-ntab', on: { click: () => stub('Meet') } },
        h('span', { class: 'cr-nind' }, icon('video', { size: 22 })), h('span', { class: 'cr-nlbl' }, 'Meet')));
    const fab = h('button', { class: 'cr-fab', 'aria-label': 'Escrever', on: { click: () => stub('Escrever') } }, icon('pencil', { size: 22 }), h('span', null, 'Escrever'));
    let lastY = 0;
    el.addEventListener('scroll', () => { const y = el.scrollTop; if (Math.abs(y - lastY) > 6) { fab.classList.toggle('mini', y > lastY && y > 40); lastY = y; } }, { passive: true });

    function draw() {
      clear(listEl);
      const q = fold(input.value).trim();
      const filtered = searching && (q || only);
      let items;
      let heading;
      if (filtered) {
        items = q ? all().filter(m => fold(`${m.subject} ${person(m.from).name} ${person(m.from).email} ${recipients(m).map(r => r.name + ' ' + r.email).join(' ')} ${plain(m.body)}`).includes(q)) : all();
        heading = 'Resultados';
      } else {
        items = inFolder(folder);
        heading = folderLabel(folder);
      }
      if (only === 'unread') items = items.filter(m => !isRead(m));
      if (only === 'att') items = items.filter(m => (m.attachments || []).length);
      if (only === 'star') items = items.filter(m => isStar(m));
      items = sorted(items);
      const inboxUnread = unreadIn('inbox');
      navBadge.hidden = !inboxUnread;
      navBadge.textContent = inboxUnread > 99 ? '99+' : String(inboxUnread);

      listEl.appendChild(h('div', { class: 'cr-label' }, h('span', null, heading), filtered ? h('span', { class: 'cr-count' }, `${items.length} ${items.length === 1 ? 'resultado' : 'resultados'}`) : null));
      if (!filtered && (folder === 'spam' || folder === 'trash') && items.length) {
        const what = folder === 'spam' ? 'no Spam' : 'na Lixeira';
        listEl.appendChild(h('div', { class: 'cr-banner' },
          h('p', null, `As mensagens que estão ${what} há mais de 30 dias serão excluídas automaticamente.`),
          h('button', { class: 'cr-tbtn', on: { click: () => stub(folder === 'spam' ? 'Esvaziar o Spam' : 'Esvaziar a Lixeira') } }, folder === 'spam' ? 'Esvaziar Spam agora' : 'Esvaziar Lixeira agora')));
      }
      if (!filtered && folder === 'inbox') {
        const promo = sorted(inFolder('promo'));
        if (promo.length) {
          const fresh = promo.filter(m => !isRead(m)).length;
          const names = [...new Set(promo.map(m => who(person(m.from))))].slice(0, 3).join(', ');
          listEl.appendChild(h('button', { class: 'cr-cat', on: { click: () => go('promo') } },
            h('span', { class: 'cr-cat-ic' }, svg(P_TAG, 22)),
            h('span', { class: 'cr-cat-tx' }, h('b', null, 'Promoções'), h('span', null, names)),
            fresh ? h('span', { class: 'cr-new' }, `${fresh} ${fresh === 1 ? 'novo' : 'novos'}`) : null));
        }
      }
      if (!items.length) {
        const f = FOLDERS.find(x => x.id === folder);
        listEl.appendChild(h('div', { class: 'cr-empty' },
          filtered ? icon('search', { size: 56, stroke: 1.4 }) : (f ? folderIcon(f, 56) : icon('inbox', { size: 56, stroke: 1.4 })),
          h('b', null, filtered ? 'Nenhum resultado encontrado' : 'Nada aqui'),
          h('span', null, filtered ? 'Tente outro nome, assunto ou palavra.' : 'Esta pasta está vazia.')));
        return;
      }
      for (const m of items) listEl.appendChild(row(m, { showFolder: !!filtered }));
    }

    /* ----- gaveta lateral ----- */
    function go(id) {
      folder = id; prefs().folder = id; save();
      if (searching) { searching = false; input.value = ''; only = null; input.blur(); syncSearch(); } else draw();
      el.scrollTop = 0;
    }
    function openDrawer() {
      const close = () => {
        ov.classList.remove('show');
        phone._popModal?.(close);
        setTimeout(() => ov.remove(), 260);
      };
      const item = (f) => {
        const n = (f.id === 'inbox' || f.id === 'spam' || f.id === 'promo') ? unreadIn(f.id) : 0;
        let count = null;
        if (n) count = f.id === 'promo' ? h('span', { class: 'cr-new' }, `${n} ${n === 1 ? 'novo' : 'novos'}`) : h('span', { class: 'cr-fcount' }, n > 99 ? '99+' : String(n));
        return h('button', { class: `cr-fitem ${folder === f.id ? 'on' : ''}`, on: { click: () => { close(); go(f.id); } } },
          folderIcon(f, 22), h('span', { class: 'cr-fname' }, f.label), count);
      };
      const extra = (ic, label, what) => h('button', { class: 'cr-fitem', on: { click: () => { close(); stub(what); } } }, icon(ic, { size: 22 }), h('span', { class: 'cr-fname' }, label));
      const drawer = h('aside', { class: 'cr-drawer', 'aria-label': 'Pastas do Gmail' },
        h('div', { class: 'cr-brand' }, gmailLogo(30), h('b', null, 'Gmail')),
        h('div', { class: 'cr-fdiv' }),
        h('nav', { class: 'cr-folders' },
          FOLDERS.filter(f => f.group === 1).map(item),
          h('div', { class: 'cr-fhead' }, 'Todos os marcadores'),
          FOLDERS.filter(f => f.group === 2).map(item),
          h('div', { class: 'cr-fdiv' }),
          extra('settings', 'Configurações', 'Configurações'),
          extra('circle-help', 'Ajuda e feedback', 'Ajuda')),
        h('div', { class: 'cr-dnote' }, icon('cloud', { size: 14 }), h('span', null, ACCOUNT)));
      const ov = h('div', { class: 'cr-drawer-ov', role: 'dialog', 'aria-label': 'Menu do Gmail' }, h('div', { class: 'cr-scrim', on: { click: close } }), drawer);
      if (phone._mountModal) phone._mountModal(ov, close); else (ctx.screen || el).appendChild(ov);
      requestAnimationFrame(() => ov.classList.add('show'));
    }

    /* ----- e-mail (subtela) ----- */
    function openMail(m) {
      if (!game.req(m)) { phone.toast('E-mail indisponível', { icon: 'mail' }); return; }
      game.see('correio:mail:' + m.id);
      if (m.onSee) game.flags([].concat(m.onSee));
      if (!isRead(m)) { prefs().read[m.id] = true; save(); }
      nav.push({ className: 'cr-screen', render: (body) => mailView(body, m) });
    }

    function mailView(body, m) {
      const from = person(m.from);
      const tos = recipients(m);
      const ccs = [].concat(m.cc || []).map(person);
      const fmt = (p) => (p.name ? `${p.name} • ${p.email}` : p.email);
      const toLine = (() => {
        const names = tos.map(p => (me(p) ? 'mim' : (p.name || p.email)));
        if (!names.length) return 'para —';
        return names.length > 2 ? `para ${names.slice(0, 2).join(', ')} e mais ${names.length - 2}` : `para ${names.join(' e ')}`;
      })();
      const starBtn = h('button', { class: `cr-vstar ${isStar(m) ? 'on' : ''}`, 'aria-label': 'Marcar com estrela', on: { click: () => { toggleStar(m); starBtn.classList.toggle('on', isStar(m)); } } }, icon('star', { size: 22 }));

      const details = h('div', { class: 'cr-details' },
        h('div', { class: 'cr-drow' }, h('span', null, 'De'), h('span', { class: 'txt' }, fmt(from) || '—')),
        h('div', { class: 'cr-drow' }, h('span', null, 'Para'), h('span', { class: 'txt' }, tos.map(fmt).join(', ') || '—')),
        ccs.length ? h('div', { class: 'cr-drow' }, h('span', null, 'Cc'), h('span', { class: 'txt' }, ccs.map(fmt).join(', '))) : null,
        h('div', { class: 'cr-drow' }, h('span', null, 'Data'), h('span', { class: 'txt' }, (isLive(m) ? 'agora · ' : '') + fullDate(m.at))),
        h('div', { class: 'cr-drow' }, h('span', null, 'Segurança'), h('span', null, icon('lock', { size: 13 }), ' Criptografia padrão (TLS)')));
      const toBtn = h('button', { class: 'cr-tobtn open', 'aria-expanded': 'true', on: { click: () => { const open = details.hidden; details.hidden = !open; toBtn.classList.toggle('open', open); toBtn.setAttribute('aria-expanded', String(open)); } } },
        h('span', null, toLine), icon('chevron-down', { size: 16 }));

      const atts = (m.attachments || []).map(a => {
        const f = files().find(x => x.id === a.file);
        const ext = String(f?.type || a.name?.split('.').pop() || '').toLowerCase();
        const [ic, color, label] = FILE_TYPES[ext] || ['file', '#a8adb3', ext.toUpperCase() || 'Arquivo'];
        return h('button', { class: 'cr-att', on: { click: () => { if (a.file) phone.open('arquivos', { file: a.file }); else stub('Anexo'); } } },
          h('span', { class: 'cr-att-pv', style: { '--ft': color } }, icon(ic, { size: 34, stroke: 1.5 }), h('i', null, ext.toUpperCase() || 'ARQ')),
          h('span', { class: 'cr-att-ft' },
            h('span', { class: 'cr-att-badge', style: { background: color } }, icon(ic, { size: 13 })),
            h('span', { class: 'cr-att-tx' }, h('b', null, a.name || f?.name || 'Anexo'), h('small', null, [label, fileSize(f?.size ?? a.size)].filter(Boolean).join(' · ')))));
      });

      const moreBtn = kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: (e) => kit.menu(e.currentTarget, [
        { icon: 'mail', label: 'Marcar como não lida', onClick: () => stub('Marcar como não lida') },
        { icon: 'clock', label: 'Adiar', onClick: () => stub('Adiar') },
        { icon: 'circle-alert', label: 'Denunciar spam', onClick: () => stub('Denunciar spam') },
        { icon: 'file-text', label: 'Imprimir', onClick: () => stub('Imprimir') },
      ]) });

      body.append(...[
        kit.appBar({ title: '', actions: [
          { icon: 'archive', label: 'Arquivar', onClick: () => stub('Arquivar') },
          { icon: 'trash-2', label: 'Excluir', onClick: () => stub('Excluir') },
          { icon: 'mail', label: 'Marcar como não lida', onClick: () => stub('Marcar como não lida') },
          moreBtn,
        ] }),
        h('div', { class: 'cr-subj-row' }, h('h2', { class: 'cr-subject txt' }, m.subject), starBtn),
        h('div', { class: 'cr-labels' },
          m.important ? h('span', { class: 'cr-impm big', title: 'Importante' }, svg(P_IMP_FILL, 18)) : null,
          h('span', { class: 'cr-lchip' }, mailLabel(m.folder), icon('x', { size: 13 }))),
        m.folder === 'spam' ? h('div', { class: 'cr-warn' }, icon('circle-alert', { size: 20 }),
          h('div', null, h('b', null, 'Por que esta mensagem está no Spam?'), h('span', null, 'Ela é parecida com mensagens que foram identificadas como spam no passado.'))) : null,
        h('div', { class: 'cr-sender' },
          letterAv(from.name, from.email, isLive(m), 40),
          h('div', { class: 'cr-sender-tx' },
            h('div', { class: 'cr-sender-l1' }, h('b', { class: 'txt' }, who(from)), h('time', null, isLive(m) ? 'agora' : gDate(m.at, NOW))),
            toBtn),
          kit.iconButton({ icon: 'reply', label: 'Responder', className: 'cr-sbtn', onClick: () => stub('Responder') }),
          kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais', className: 'cr-sbtn', onClick: () => stub('Mais opções') })),
        details,
        h('div', { class: 'cr-body txt' }, bodyNodes(m.body, external)),
        atts.length ? h('div', { class: 'cr-atts' },
          h('div', { class: 'cr-atts-h' }, `${atts.length} ${atts.length === 1 ? 'anexo' : 'anexos'}`, h('span', null, '· Verificados pelo Gmail')),
          h('div', { class: 'cr-att-grid' }, atts)) : null,
        h('div', { class: 'cr-pinrow' }, kit.pinButton({ key: 'correio:mail:' + m.id, label: m.subject, app: 'correio', detail: `${who(from)} · ${fullDate(m.at)}` })),
        h('div', { class: 'cr-actions' },
          h('button', { class: 'cr-pill', on: { click: () => stub('Responder') } }, icon('reply', { size: 18 }), 'Responder'),
          h('button', { class: 'cr-pill', on: { click: () => stub('Encaminhar') } }, icon('forward', { size: 18 }), 'Encaminhar'),
          h('button', { class: 'cr-pill round', 'aria-label': 'Reagir', on: { click: () => stub('Reagir') } }, icon('smile', { size: 18 }))),
      ].filter(Boolean));
    }

    /* ----- montagem ----- */
    el.append(top, listEl);
    drawChips();
    draw();
    const scr = ctx.screen || el;
    scr.append(fab, bottom);
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
