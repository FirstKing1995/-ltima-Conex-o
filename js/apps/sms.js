// App "Mensagens" (SMS) — registro do aparelho, relativo a sáb 10/10 23:47.
// Mensagens com undelivered:true chegaram depois que o celular desligou e aparecem como "Não entregue".
import { h, clear, append } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import * as store from '../core/store.js';
import { normalize } from '../core/hash.js';

const MIRROR = time.MIRROR_NOW;

/* ---------- helpers ---------- */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const hasSeconds = (s) => /T\d{2}:\d{2}:\d{2}/.test(String(s));
const clock = (s) => (hasSeconds(s) ? time.hhmmss(s) : time.hhmm(s));
const when = (s) => `${time.weekday(s)} ${time.dateShort(s)} ${clock(s)}`;
const isMe = (m) => m.from === 'iara' || m.from === 'me';
const isLate = (m) => !!m.undelivered || time.parse(m.at) > time.parse(MIRROR);

function daysBetween(a, b) {
  const pa = time.parse(a), pb = time.parse(b);
  return Math.round((Date.UTC(pb.getFullYear(), pb.getMonth(), pb.getDate()) - Date.UTC(pa.getFullYear(), pa.getMonth(), pa.getDate())) / 86400000);
}
function dayTitle(at) {
  const diff = daysBetween(at, MIRROR);
  if (diff < 0) return `${cap(time.weekdayLong(at))} · ${time.dateShort(at)}`;
  const base = cap(time.chatDay(at, MIRROR));
  return diff < 7 ? `${base} · ${time.dateShort(at)}` : base;
}
/** Hora na lista: mensagens "do futuro" (depois do desligamento) mostram o dia da semana. */
const listTime = (m) => (time.parse(m.at) > time.parse(MIRROR) ? `${time.weekday(m.at)} ${time.hhmm(m.at)}` : time.relative(m.at, MIRROR));

const contactOf = (t) => (t.contact ? store.contact(t.contact) : null) || store.contactByPhone(t.phone) || null;
function threadName(t) {
  const c = contactOf(t);
  return c?.name || t.name || store.fmtPhone(t.phone);
}
function threadSub(t) {
  const c = contactOf(t);
  if (c || t.name) return store.fmtPhone(t.phone || c?.phones?.[0] || '', { intl: false });
  return 'Não está nos seus contatos';
}

function visibleMsgs(t, game) {
  return (t.messages || []).map((m, i) => [m, i]).filter(([m]) => game.req(m))
    .sort((a, b) => time.compare(a[0].at, b[0].at) || a[1] - b[1]).map(([m]) => m);
}
const lastOf = (t, game) => { const ms = visibleMsgs(t, game); return ms[ms.length - 1] || null; };

// serviços e empresas (todos fictícios) ganham um ícone com a cor do app
const SERVICES = [
  { re: /jandaia/, ic: 'landmark', bg: '#1f9d6b', fg: '#f7d154' },
  { re: /lume/, ic: 'aperture', bg: 'linear-gradient(135deg,#f0567a,#ff9f43)' },
  { re: /litoral/, ic: 'signal', bg: '#3b5fb4' },
  { re: /serra ?verde|viacao/, ic: 'bus', bg: '#2f7d55' },
  { re: /prefeitura|municipal|governo/, ic: 'landmark', bg: '#4b5d7a' },
  { re: /bora/, ic: 'car', bg: '#141414', fg: '#ffd400' },
  { re: /correio/, ic: 'mail', bg: '#e25b45' },
];

function avatarFor(env, t, size = 46) {
  const { kit } = env;
  const c = contactOf(t);
  if (c) return kit.avatar({ src: c.avatar, name: c.name, color: c.color, size });
  const svc = t.name ? SERVICES.find((s) => s.re.test(fold(t.name))) : null;
  if (svc) return h('div', { class: 'k-avatar', style: { width: size + 'px', height: size + 'px', background: svc.bg, color: svc.fg || '#fff' } }, icon(svc.ic, { size: Math.round(size * 0.48) }));
  if (t.name) return kit.avatar({ name: t.name, size });
  return kit.avatar({ name: '?', size, icon: 'user-round', color: '#5f6368' });
}

/* ---------- raiz (Google Mensagens, Material You escuro) ---------- */
const GM_NEW_CHAT = '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM11 5h2v4h4v2h-4v4h-2v-4H7V9h4z"/>';
function gmIcon(paths, size = 24) {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="ic" aria-hidden="true">${paths}</svg>`;
  return t.content.firstChild;
}
const readOnlyToast = (env) => env.phone.toast('Somente leitura: extração do aparelho', { icon: 'lock' });

function renderRoot(env, threads) {
  const { ctx, kit, game } = env;
  const views = threads.map((t) => {
    const msgs = visibleMsgs(t, game);
    return { t, msgs, last: msgs[msgs.length - 1] || null, late: msgs.filter(isLate).length };
  });
  const byLast = (a, b) => (b.last ? time.parse(b.last.at).getTime() : -Infinity) - (a.last ? time.parse(a.last.at).getTime() : -Infinity);
  const headSlot = h('div', { class: 'sm-head' });
  const listSlot = h('div', { class: 'sm-list' });
  const scroll = h('div', { class: 'sm-scroll-root' }, listSlot);
  let query = '';
  let searching = false;

  const row = (v) => kit.listItem({
    avatar: avatarFor(env, v.t, 44),
    title: threadName(v.t),
    subtitle: v.last ? (isMe(v.last) ? 'Você: ' : '') + String(v.last.text || '').replace(/\s+/g, ' ') : 'Sem mensagens',
    meta: v.last ? cap(listTime(v.last)) : '',
    badge: v.late || null,
    unread: v.late > 0,
    className: 'sm-row-item',
    onClick: () => openThread(env, v.t),
  });

  const draw = () => {
    clear(listSlot);
    const q = normalize(query);
    let vs = views;
    if (q.length >= 2) {
      vs = views.filter((v) => normalize(threadName(v.t)).includes(q) || normalize(v.t.phone || '').includes(q) || v.msgs.some((m) => normalize(m.text || '').includes(q)));
    }
    vs = [...vs].sort(byLast);
    if (!vs.length) append(listSlot, [kit.empty({ icon: 'message-square', title: q.length >= 2 ? 'Nada encontrado' : 'Nenhuma conversa', text: q.length >= 2 ? `Nenhum resultado para "${query}".` : 'As mensagens de texto aparecem aqui.' })]);
    else append(listSlot, [kit.list(vs.map(row))]);
    append(listSlot, [h('p', { class: 'sm-foot no-terms' }, icon('lock', { size: 13 }),
      h('span', null, 'Mensagens do aparelho, em modo somente leitura. ', h('span', { class: 'sm-when' }, `Registro até ${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}`)))]);
    env.phone.scan(listSlot);
  };

  const fab = h('button', { class: 'sm-fab', on: { click: () => readOnlyToast(env) } }, gmIcon(GM_NEW_CHAT, 24), h('span', null, 'Iniciar conversa'));

  const drawHead = () => {
    clear(headSlot);
    if (searching) {
      headSlot.append(h('div', { class: 'sm-searchbar' },
        kit.iconButton({ icon: 'arrow-left', label: 'Fechar busca', onClick: () => { searching = false; query = ''; fab.hidden = false; drawHead(); draw(); } }),
        kit.search({ placeholder: 'Pesquisar mensagens', autofocus: true, onInput: (v) => { query = v; draw(); } })));
      return;
    }
    const me = store.contact('iara');
    headSlot.append(h('header', { class: 'k-appbar sm-top' },
      h('div', { class: 'ttl' }, h('h1', null, 'Mensagens')),
      kit.iconButton({ icon: 'search', label: 'Pesquisar', onClick: () => { searching = true; fab.hidden = true; drawHead(); } }),
      h('button', { class: 'sm-me', 'aria-label': 'Conta', on: { click: () => readOnlyToast(env) } },
        kit.avatar({ src: me?.avatar || '', name: me?.name || 'Iara', color: me?.color, size: 32 }))));
  };

  append(ctx.el, [headSlot, scroll, fab]);
  drawHead();
  draw();
}

/* ---------- conversa ---------- */
function openThread(env, t, opts = {}) {
  env.nav.push({ title: threadName(t), className: 'sms-thread', render: (body, nav) => buildThread(env, t, opts, body, nav) });
}

function buildThread(env, t, opts, body, nav) {
  const { kit, phone, game } = env;
  const msgs = visibleMsgs(t, game);
  const name = threadName(t);
  const c = contactOf(t);

  game.see('sms:thread:' + t.id);
  if (t.onSee) game.flags(t.onSee);
  for (const m of msgs) { game.see('sms:msg:' + m.id); if (m.onSee) game.flags(m.onSee); }

  const bar = h('header', { class: 'k-appbar sm-bar' },
    kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => nav.back() }),
    avatarFor(env, t, 34),
    h('div', { class: 'nm' }, h('span', { class: 't txt' }, name), h('span', { class: 's txt' }, threadSub(t))),
    kit.iconButton({ icon: 'phone', label: 'Ligar', onClick: () => phone.toast('Ligações indisponíveis na extração', { icon: 'phone' }) }),
    kit.iconButton({ icon: 'video', label: 'Videochamada', onClick: () => phone.toast('Ligações indisponíveis na extração', { icon: 'video' }) }),
    kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: () => readOnlyToast(env) }));

  const list = h('div', { class: 'sm-msgs' });
  const scroller = h('div', { class: 'sm-scroll' }, list);
  // campo "Mensagem de texto" do Google Mensagens, desativado (extração forense)
  const foot = h('div', { class: 'sm-foot-bar no-terms' },
    h('button', { class: 'sm-plus', 'aria-label': 'Anexar (indisponível)', on: { click: () => readOnlyToast(env) } }, icon('plus', { size: 22 })),
    h('div', { class: 'sm-input', 'aria-disabled': 'true', title: 'Somente leitura — extração do aparelho' },
      h('input', { type: 'text', disabled: true, placeholder: 'Mensagem de texto', 'aria-label': 'Somente leitura — extração do aparelho' }),
      h('span', { class: 'sm-ic' }, icon('smile', { size: 21 })),
      h('span', { class: 'sm-ic' }, icon('image', { size: 21 }))),
    h('button', { class: 'sm-mic', 'aria-label': 'Gravar áudio (indisponível)', on: { click: () => readOnlyToast(env) } }, icon('mic', { size: 22 })));
  append(body, [bar, scroller, foot]);

  let target = null, stick = true;
  const goto = () => {
    if (target) scroller.scrollTop = Math.max(0, target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - Math.max(24, (scroller.clientHeight - target.offsetHeight) / 2));
    else scroller.scrollTop = scroller.scrollHeight;
  };
  for (const ev of ['wheel', 'touchstart', 'pointerdown', 'keydown']) scroller.addEventListener(ev, () => { stick = false; }, { passive: true });

  let selected = null;
  const select = (row) => {
    if (selected && selected !== row) selected.classList.remove('sel');
    row.classList.toggle('sel');
    selected = row.classList.contains('sel') ? row : null;
  };
  scroller.addEventListener('click', (e) => { if (selected && !e.target.closest('.sm-col')) { selected.classList.remove('sel'); selected = null; } });

  const sameRun = (a, b) => a && b && isMe(a) === isMe(b) && isLate(a) === isLate(b) && time.ymd(a.at) === time.ymd(b.at) && Math.abs(time.parse(b.at) - time.parse(a.at)) < 6 * 60000;
  let lateShown = false;

  msgs.forEach((m, i) => {
    const prev = msgs[i - 1], next = msgs[i + 1];
    if (!prev || time.ymd(prev.at) !== time.ymd(m.at)) list.append(h('div', { class: 'sm-day' }, dayTitle(m.at)));
    if (isLate(m) && !lateShown) {
      lateShown = true;
      list.append(h('div', { class: 'sm-after no-terms', role: 'note' }, icon('clock', { size: 16 }), h('span', null, `Chegaram depois que o celular desligou (${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}) · não entregues`)));
    }
    const me = isMe(m);
    const first = !sameRun(prev, m), last = !sameRun(m, next);
    const late = isLate(m);
    const statusText = me ? ({ sent: 'Enviada', delivered: 'Entregue', read: 'Lida', failed: 'Falha no envio' }[m.status] || '') : '';
    const timeLine = last || late
      ? h('div', { class: `sm-t${late ? ' late' : ''}` },
        late ? icon('circle-alert', { size: 13 }) : null,
        late ? h('span', null, `Não entregue · ${time.weekday(m.at)} ${time.hhmm(m.at)}`) : h('span', null, [time.hhmm(m.at), statusText].filter(Boolean).join(' · ')))
      : null;
    const key = 'sms:msg:' + m.id;
    const acts = h('div', { class: 'sm-acts' },
      kit.pinButton({ key, label: String(m.text || '').slice(0, 140), app: 'sms', detail: `${name} · ${when(m.at)}` }),
      h('button', { class: 'sm-copy', on: { click: (e) => { e.stopPropagation(); try { navigator.clipboard?.writeText(m.text || ''); } catch (err) { /* sem permissão */ } phone.toast('Texto copiado', { icon: 'copy' }); } } }, icon('copy', { size: 15 }), 'Copiar'));
    const bubble = h('div', { class: 'sm-b' }, h('span', { class: 'txt sm-text' }, m.text || ''));
    // como no Google Mensagens: a foto de quem enviou aparece ao lado da última mensagem de cada sequência
    const av = me ? null : h('div', { class: 'sm-av', 'aria-hidden': 'true' }, last ? avatarFor(env, t, 30) : null);
    const rowEl = h('div', { class: `sm-row ${me ? 'me' : 'them'}${first ? ' first' : ''}${last ? ' last' : ''}${late ? ' late' : ''}`, dataset: { id: m.id } },
      av, h('div', { class: 'sm-col' }, bubble, timeLine, acts));
    bubble.addEventListener('click', (e) => { if (!e.target.closest('mark')) select(rowEl); }); // marcas da lupa têm clique próprio
    list.append(rowEl);
  });
  if (!msgs.length) list.append(h('div', { class: 'sm-day' }, 'Nenhuma mensagem nesta conversa.'));

  if (opts.msg) {
    target = list.querySelector(`[data-id="${CSS.escape(opts.msg)}"]`);
    if (target) { target.classList.add('flash'); setTimeout(() => target.classList.remove('flash'), 2600); }
  }
  goto();
  requestAnimationFrame(goto);
}

export default {
  id: 'sms',
  title: 'Mensagens',
  cloud: false,

  render(ctx) {
    const { game, kit, phone, nav, params = {} } = ctx;
    const env = { ctx, kit, phone, game, nav };
    const threads = (ctx.data?.threads || []).filter((t) => game.req(t));
    renderRoot(env, threads);
    let thread = params.thread ? threads.find((t) => t.id === params.thread) : null;
    if (!thread && params.msg) thread = threads.find((t) => (t.messages || []).some((m) => m.id === params.msg));
    if (thread) openThread(env, thread, { msg: params.msg });
    else if (params.thread) phone.toast('Conversa indisponível', { icon: 'message-square' });
  },

  search({ data, game }) {
    const out = [];
    for (const t of data?.threads || []) {
      if (!game.req(t)) continue;
      const title = threadName(t);
      for (const m of t.messages || []) {
        if (!game.req(m) || !m.text) continue;
        out.push({ title, text: m.text, params: { thread: t.id, msg: m.id }, at: m.at });
      }
    }
    return out;
  },
};
