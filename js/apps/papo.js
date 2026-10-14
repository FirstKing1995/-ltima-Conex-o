// App "Papo" — mensageiro na nuvem de Iara (mostra o que o servidor tem até terça 13/10 23:12).
// Lista de conversas, conversa com balões, mídia, apagadas, pendentes (não entregues) e dados do contato/grupo.
import { h, clear, append } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import * as store from '../core/store.js';
import { normalize } from '../core/hash.js';

const NOW = time.PRESENT_NOW;
const MIRROR = time.MIRROR_NOW;

/* =====================================================================
   Helpers de tempo e texto
   ===================================================================== */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const hasSeconds = (s) => /T\d{2}:\d{2}:\d{2}/.test(String(s));
const clock = (s) => (hasSeconds(s) ? time.hhmmss(s) : time.hhmm(s));
/** "sáb 10/10 23:46" */
const when = (s) => `${time.weekday(s)} ${time.dateShort(s)} ${clock(s)}`;

function daysBetween(a, b) {
  const pa = time.parse(a), pb = time.parse(b);
  return Math.round((Date.UTC(pb.getFullYear(), pb.getMonth(), pb.getDate()) - Date.UTC(pa.getFullYear(), pa.getMonth(), pa.getDate())) / 86400000);
}

/** Separador de dia: "Hoje · 13/10", "Sábado · 10/10", "5 de outubro". */
function dayTitle(at, now) {
  const diff = daysBetween(at, now);
  const base = cap(time.chatDay(at, now));
  return diff >= 0 && diff < 7 ? `${base} · ${time.dateShort(at)}` : base;
}

function lastSeenText(at, now) {
  const d = time.chatDay(at, now).toLowerCase();
  const full = /^\d/.test(d); // "8 de outubro"
  return `visto por último ${full ? 'em ' : ''}${d} às ${time.hhmm(at)}`;
}

const prettify = (id) => String(id).replace(/[-_]+/g, ' ').replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());

/* =====================================================================
   Pessoas, conversas e mensagens
   ===================================================================== */
const isMe = (who) => who === 'iara' || who === 'me';
const contactOf = (who) => (who ? store.contact(who) || store.contactByPhone(who) || null : null);

function nameOf(who) {
  if (!who) return '';
  if (isMe(who)) return 'Você';
  const c = contactOf(who);
  if (c) return c.name;
  return store.digits(who).length >= 8 ? store.fmtPhone(who) : prettify(who);
}
const senderLabel = (who) => (isMe(who) ? 'Iara' : nameOf(who));

/** Cor do nome do remetente em grupos (clareada para dar contraste no balão escuro). */
function colorOf(who) {
  const c = contactOf(who);
  return c?.color || store.colorFor(String(who));
}

const isGroup = (chat) => chat.type === 'group' || (!chat.type && Array.isArray(chat.members) && chat.members.length > 2);
const chatWho = (chat) => chat.contact || chat.phone || null;
const isBlocked = (chat) => !!(chat.blocked || contactOf(chatWho(chat))?.blocked);
const isPending = (m) => !!m.pending || m.status === 'pending';

function chatName(chat) {
  if (isGroup(chat)) return chat.name || 'Grupo';
  const who = chatWho(chat);
  return who ? nameOf(who) : chat.name || 'Conversa';
}

function visibleMsgs(chat, game) {
  return (chat.messages || [])
    .map((m, i) => [m, i])
    .filter(([m]) => game.req(m))
    .sort((a, b) => time.compare(a[0].at, b[0].at) || a[1] - b[1])
    .map(([m]) => m);
}

function chatView(chat, game) {
  const all = visibleMsgs(chat, game);
  return { chat, all, last: all[all.length - 1] || null, pending: all.filter(isPending).length };
}

function statusOf(m) {
  if (isPending(m)) return 'pending';
  if (isMe(m.from)) return m.status || 'delivered';
  return null;
}
const STATUS_TEXT = { read: 'Lida', delivered: 'Entregue', sent: 'Enviada', pending: 'Não entregue' };

function tick(status, size = 15) {
  if (status === 'read') return icon('check-check', { size, stroke: 2.2, className: 'tk read' });
  if (status === 'delivered') return icon('check-check', { size, stroke: 2.2, className: 'tk' });
  if (status === 'sent' || status === 'pending') return icon('check', { size, stroke: 2.2, className: 'tk' });
  return null;
}

function callInfo(m) {
  const c = m.call || {};
  let dir = c.dir || m.dir || (m.missed || m.status === 'missed' ? 'missed' : '');
  if (!dir) dir = m.duration > 0 ? (isMe(m.from) ? 'out' : 'in') : 'missed';
  const video = !!(c.video || m.video);
  const noun = video ? 'Chamada de vídeo' : 'Chamada de voz';
  if (dir === 'missed') return { icon: 'phone-missed', cls: 'missed', label: m.text || `${noun} perdida`, sub: '' };
  return {
    icon: dir === 'out' ? 'phone-outgoing' : 'phone-incoming',
    cls: dir,
    label: m.text || (dir === 'out' ? `${noun} realizada` : `${noun} recebida`),
    sub: m.duration ? time.duration(m.duration) : '',
  };
}

const KIND_WORD = { image: 'Foto', video: 'Vídeo', audio: 'Áudio', doc: 'Documento', sticker: 'Figurinha', location: 'Localização', deleted: 'Mensagem apagada', call: 'Chamada' };

/** Rótulo curto de uma mensagem (prévia da lista, Quadro). */
function describe(m) {
  switch (m.kind) {
    case 'image': return { ic: 'camera', text: m.caption ? `Foto · ${m.caption}` : 'Foto' };
    case 'video': return { ic: 'video', text: `Vídeo${m.duration ? ' ' + time.duration(m.duration) : ''}${m.caption ? ' · ' + m.caption : ''}` };
    case 'audio': return { ic: 'mic', text: `Áudio${m.duration ? ' ' + time.duration(m.duration) : ''}` };
    case 'doc': return { ic: 'file-text', text: m.doc?.name || 'Documento' };
    case 'sticker': return { ic: 'sticker', text: 'Figurinha' };
    case 'location': return { ic: 'map-pin', text: 'Localização' };
    case 'deleted': return { ic: 'ban', text: 'Mensagem apagada', cls: 'del' };
    case 'call': { const c = callInfo(m); return { ic: c.icon, text: c.label, cls: c.cls === 'missed' ? 'missed' : '' }; }
    default: return { text: String(m.text || '').replace(/\s+/g, ' ') };
  }
}

/** Trecho para o Quadro. */
function snippet(m) {
  switch (m.kind) {
    case 'image': return `Foto${m.caption ? ': ' + m.caption : ''}`;
    case 'video': return `Vídeo${m.duration ? ' ' + time.duration(m.duration) : ''}${m.caption ? ': ' + m.caption : ''}`;
    case 'audio': return `Áudio${m.duration ? ' ' + time.duration(m.duration) : ''}${m.transcript ? ': ' + m.transcript : ''}`;
    case 'doc': return m.doc?.name || 'Documento';
    case 'sticker': return 'Figurinha';
    case 'location': return `Localização: ${m.place?.name || m.text || ''}`;
    case 'deleted': return `Mensagem apagada${m.deletedAt ? ' (' + when(m.deletedAt) + ')' : ''}`;
    case 'call': return callInfo(m).label;
    default: return String(m.text || '').replace(/\s+/g, ' ');
  }
}

/** Texto pesquisável de uma mensagem (busca global e busca do Papo). */
function searchText(m) {
  switch (m.kind) {
    case 'text': return m.text || '';
    case 'image': case 'video': return m.caption || '';
    case 'audio': return m.transcript || '';
    case 'doc': return [m.doc?.name, m.caption || m.text].filter(Boolean).join(' · ');
    case 'location': return m.place?.name || m.text || '';
    case 'deleted': case 'sticker': case 'call': return '';
    default: return m.text || '';
  }
}

function fmtSize(s) {
  if (s === undefined || s === null || s === '') return '';
  if (typeof s === 'string') return s;
  if (s >= 1048576) return `${(s / 1048576).toFixed(1).replace('.', ',')} MB`;
  return `${Math.max(1, Math.round(s / 1024))} KB`;
}

const EXT_ICON = { pdf: 'file-text', txt: 'file-text', docx: 'file-text', doc: 'file-text', xlsx: 'file-spreadsheet', xls: 'file-spreadsheet', csv: 'file-spreadsheet', m4a: 'file-audio', mp3: 'file-audio', jpg: 'image', png: 'image' };

const clampRatio = (r) => Math.min(1.5, Math.max(0.64, r));

/* =====================================================================
   Avatares
   ===================================================================== */
function chatAvatar(env, chat, size) {
  const { kit } = env;
  if (isGroup(chat)) return kit.avatar({ src: chat.avatar || '', name: chat.name || 'Grupo', size, icon: 'users', color: '#34464f' });
  const who = chatWho(chat);
  if (!who) return kit.avatar({ src: chat.avatar || '', name: chat.name || '?', size, icon: 'user-round', color: '#5f6368' });
  const a = store.avatarOf(who);
  return kit.avatar({ src: a.src, name: a.name, color: a.color, size, icon: a.unknown ? 'user-round' : undefined });
}

function whoAvatar(env, who, size) {
  const a = store.avatarOf(who);
  return env.kit.avatar({ src: a.src, name: a.name, color: a.color, size, icon: a.unknown ? 'user-round' : undefined });
}

/* =====================================================================
   Raiz: lista de conversas
   ===================================================================== */
function previewNode(chat, m) {
  if (!m) return h('span', { class: 'pv' }, 'Sem mensagens');
  const d = describe(m);
  const kids = [];
  if (isMe(m.from) && m.kind !== 'system') kids.push(tick(statusOf(m), 15));
  if (isGroup(chat) && m.kind !== 'system') kids.push(h('span', { class: 'pv-who' }, nameOf(m.from) + ': '));
  if (d.ic) kids.push(icon(d.ic, { size: 15, className: 'pv-ic' }));
  kids.push(d.text);
  return h('span', { class: `pv ${d.cls || ''}` }, kids);
}

function chatRow(env, v) {
  const { chat, last, pending } = v;
  const title = [h('span', { class: 'pp-name' }, chatName(chat))];
  if (chat.muted) title.push(icon('bell-off', { size: 14, className: 'pp-mini' }));
  if (isBlocked(chat)) title.push(icon('ban', { size: 14, className: 'pp-mini danger' }));
  return env.kit.listItem({
    avatar: chatAvatar(env, chat, 50),
    title,
    subtitle: previewNode(chat, last),
    meta: last ? time.relative(last.at, env.now) : '',
    badge: pending || null,
    trailing: chat.pinned ? icon('pin', { size: 14, className: 'pp-pin' }) : null,
    unread: pending > 0,
    className: 'pp-row',
    onClick: () => openChat(env, chat),
  });
}

const byLast = (a, b) => (b.last ? time.parse(b.last.at).getTime() : -Infinity) - (a.last ? time.parse(a.last.at).getTime() : -Infinity);

function openArchived(env, views) {
  const { kit, nav } = env;
  nav.push({
    title: 'Conversas arquivadas',
    className: 'papo-arch',
    render(body) {
      const arch = views.filter((v) => v.chat.archived).sort(byLast);
      body.append(
        kit.appBar({ title: 'Conversas arquivadas', subtitle: `${arch.length} ${arch.length === 1 ? 'conversa' : 'conversas'}` }),
        arch.length
          ? kit.list(arch.map((v) => chatRow(env, v)))
          : kit.empty({ icon: 'archive', title: 'Nada arquivado', text: 'As conversas arquivadas aparecem aqui.' }));
    },
  });
}

function snippetAround(raw, q) {
  const text = String(raw || '').replace(/\s+/g, ' ');
  const i = fold(text).indexOf(fold(q).trim());
  if (i < 0) return text.slice(0, 110);
  const start = Math.max(0, i - 30);
  return (start ? '…' : '') + text.slice(start, i + q.length + 70) + (text.length > i + q.length + 70 ? '…' : '');
}

function renderRoot(env, views) {
  const { ctx, kit } = env;
  const { el } = ctx;
  let filter = 'all';
  let searching = false;
  let query = '';

  const headSlot = h('div', { class: 'pp-head' });
  const chipSlot = h('div', { class: 'pp-chips' });
  const listSlot = h('div', { class: 'pp-list' });
  el.append(headSlot, chipSlot, listSlot);

  const visible = views.filter((v) => !v.chat.archived);
  const pendChats = visible.filter((v) => v.pending).length;
  const archivedN = views.length - visible.length;

  const logo = h('span', { class: 'pp-logo', 'aria-hidden': 'true' }, icon('message-circle', { size: 20, stroke: 2.2 }));
  const sync = h('span', { class: 'pp-sync no-terms' }, icon('cloud', { size: 12 }), `Sincronizado · ${time.weekday(NOW)} ${time.hhmm(NOW)}`);

  const drawHead = () => {
    clear(headSlot);
    if (searching) {
      headSlot.append(h('div', { class: 'pp-searchbar' },
        kit.iconButton({ icon: 'arrow-left', label: 'Fechar busca', onClick: () => { searching = false; query = ''; drawHead(); drawChips(); drawList(); } }),
        kit.search({ placeholder: 'Pesquisar conversas e mensagens', autofocus: true, onInput: (v) => { query = v; drawList(); } })));
      return;
    }
    headSlot.append(kit.appBar({
      title: 'Papo', subtitle: sync, avatar: logo,
      actions: [
        { icon: 'search', label: 'Pesquisar', onClick: () => { searching = true; drawHead(); drawChips(); drawList(); } },
        { icon: 'ellipsis-vertical', label: 'Mais opções', onClick: (e) => kit.menu(e.currentTarget, [{ label: 'Conversas arquivadas', icon: 'archive', onClick: () => openArchived(env, views) }]) },
      ],
    }));
  };

  const drawChips = () => {
    clear(chipSlot);
    if (searching) return;
    chipSlot.append(kit.chips({
      active: filter,
      items: [{ id: 'all', label: 'Todas' }, { id: 'pend', label: pendChats ? `Não entregues · ${pendChats}` : 'Não entregues' }, { id: 'grp', label: 'Grupos' }],
      onChange: (id) => { filter = id; drawList(); },
    }));
  };

  const drawResults = () => {
    const q = query.trim();
    if (fold(q).length < 2) { listSlot.append(kit.empty({ icon: 'search', title: 'Pesquise no Papo', text: 'Nomes de conversas, números e trechos de mensagens, fotos e áudios.' })); return; }
    const nq = normalize(q);
    const chats = views.filter((v) => normalize(chatName(v.chat)).includes(nq) || (nq.length >= 3 && normalize(store.digits(chatWho(v.chat) || '')).includes(nq)));
    const hits = [];
    for (const v of views) {
      for (const m of v.all) {
        const t = searchText(m);
        if (t && normalize(t).includes(nq)) hits.push({ v, m, t });
      }
    }
    hits.sort((a, b) => time.compare(b.m.at, a.m.at));
    if (!chats.length && !hits.length) { listSlot.append(kit.empty({ icon: 'search', title: 'Nada encontrado', text: `Nenhum resultado para "${q}".` })); return; }
    if (chats.length) listSlot.append(kit.sectionTitle('Conversas'), kit.list(chats.sort(byLast).map((v) => chatRow(env, v))));
    if (hits.length) {
      listSlot.append(kit.sectionTitle(`Mensagens · ${hits.length}`), kit.list(hits.slice(0, 80).map(({ v, m, t }) => kit.listItem({
        avatar: chatAvatar(env, v.chat, 44),
        title: chatName(v.chat),
        subtitle: h('span', { class: 'pv txt' }, (isGroup(v.chat) ? nameOf(m.from) + ': ' : '') + snippetAround(t, q)),
        meta: time.relative(m.at, env.now),
        className: 'pp-row',
        onClick: () => openChat(env, v.chat, { msg: m.id }),
      }))));
    }
  };

  const drawList = () => {
    clear(listSlot);
    if (searching) { drawResults(); env.phone.scan(listSlot); return; }
    let vs = visible;
    if (filter === 'pend') vs = vs.filter((v) => v.pending);
    if (filter === 'grp') vs = vs.filter((v) => isGroup(v.chat));
    const pinned = vs.filter((v) => v.chat.pinned).sort(byLast);
    const rest = vs.filter((v) => !v.chat.pinned).sort(byLast);
    if (!vs.length) {
      listSlot.append(kit.empty({ icon: filter === 'pend' ? 'check-check' : 'message-circle', title: filter === 'pend' ? 'Nada pendente' : 'Nenhuma conversa', text: filter === 'pend' ? 'Todas as mensagens foram entregues.' : 'Não há conversas neste filtro.' }));
    } else {
      if (pinned.length) append(listSlot, [kit.sectionTitle('Fixadas'), kit.list(pinned.map((v) => chatRow(env, v)))]);
      if (rest.length) append(listSlot, [pinned.length ? kit.sectionTitle('Todas as conversas') : null, kit.list(rest.map((v) => chatRow(env, v)))]);
    }
    if (filter === 'all' && archivedN) {
      listSlot.append(kit.list([kit.listItem({ icon: 'archive', title: 'Conversas arquivadas', meta: String(archivedN), className: 'pp-row pp-arch', onClick: () => openArchived(env, views) })]));
    }
    listSlot.append(h('p', { class: 'pp-foot no-terms' }, icon('lock', { size: 13 }), 'Espelho somente leitura. Nada do que você fizer aqui chega às outras pessoas.'));
    env.phone.scan(listSlot);
  };

  drawHead(); drawChips(); drawList();
}

/* =====================================================================
   Conversa
   ===================================================================== */
function openChat(env, chat, opts = {}) {
  env.nav.push({
    title: chatName(chat),
    className: 'papo-chat',
    render: (body, nav) => buildChat(env, chat, opts, body, nav),
  });
}

function mediaInfo(env, chat, m) {
  const who = senderLabel(m.from);
  const info = [['Remetente', who], ['Conversa', chatName(chat)], ['Data', time.dateBR(m.at)], ['Hora', clock(m.at)]];
  if (m.kind === 'video' && m.duration) info.push(['Duração', time.duration(m.duration)]);
  return {
    src: m.media,
    title: `${m.kind === 'video' ? 'Vídeo' : 'Foto'} de ${who}${m.caption ? ': ' + m.caption : ''}`,
    subtitle: `${chatName(chat)} · ${when(m.at)}`,
    desc: m.caption || '',
    info,
    key: 'papo:media:' + m.id,
  };
}

/** Posiciona o kit.menu perto do balão (o menu do kit alinha só ao canto direito da âncora). */
function placeMenu(env, anchor, alignRight) {
  const root = env.phone.root;
  const menus = root.querySelectorAll('.k-menu');
  const m = menus[menus.length - 1];
  if (!m) return;
  const pr = root.getBoundingClientRect(), ar = anchor.getBoundingClientRect(), mr = m.getBoundingClientRect();
  let left = alignRight ? ar.right - pr.left - mr.width : ar.left - pr.left;
  left = Math.max(10, Math.min(left, pr.width - mr.width - 10));
  let top = ar.bottom - pr.top + 6;
  if (top + mr.height > pr.height - 36) top = Math.max(44, ar.top - pr.top - mr.height - 6);
  m.style.left = left + 'px';
  m.style.right = 'auto';
  m.style.top = top + 'px';
}

function buildChat(env, chat, opts, body, nav) {
  const { phone, game, kit, now } = env;
  const msgs = visibleMsgs(chat, game);
  const byId = new Map(msgs.map((m) => [m.id, m]));
  const group = isGroup(chat);
  const who = chatWho(chat);
  const contact = who ? contactOf(who) : null;
  const name = chatName(chat);
  const blocked = isBlocked(chat);
  const unknown = !group && !contact;
  const pendingMsgs = msgs.filter(isPending);

  // o jogo precisa saber o que foi visto: conversa + cada mensagem visível
  game.see('papo:chat:' + chat.id);
  if (chat.onSee) game.flags(chat.onSee);
  for (const m of msgs) { game.see('papo:msg:' + m.id); if (m.onSee) game.flags(m.onSee); }

  const media = msgs.filter((m) => (m.kind === 'image' || m.kind === 'video') && m.media);
  const viewerItems = media.map((m) => mediaInfo(env, chat, m));
  const openMedia = (m) => { const i = media.indexOf(m); if (i >= 0) kit.imageViewer(viewerItems, i); };

  /* ---------- cabeçalho ---------- */
  const subtitle = group ? membersText(chat) : unknown ? 'Não está nos seus contatos' : chat.lastSeen ? lastSeenText(chat.lastSeen, now) : store.fmtPhone(chat.phone || contact?.phones?.[0] || '', { intl: false });
  const chatMenu = (anchor) => kit.menu(anchor, [
    { label: group ? 'Dados do grupo' : 'Dados do contato', icon: group ? 'users' : 'user-round', onClick: openInfo },
    pendingMsgs.length ? { label: 'Ir para as não entregues', icon: 'cloud-download', onClick: () => { stick = false; jump(pendingMsgs[0].id, { divider: true }); } } : null,
  ]);
  const bar = h('header', { class: 'k-appbar pc-bar' },
    kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => nav.back() }),
    h('button', { class: 'pc-who', 'aria-label': `Dados de ${name}`, on: { click: () => openInfo() } },
      chatAvatar(env, chat, 40),
      h('span', { class: 'nm' }, h('span', { class: 't' }, name), h('span', { class: 's' }, subtitle))),
    kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: (e) => chatMenu(e.currentTarget) }));

  const banners = [];
  if (unknown) banners.push(h('div', { class: 'pc-banner' }, icon('info', { size: 16 }), h('span', null, 'Este número não está nos seus contatos.')));
  if (blocked) banners.push(h('div', { class: 'pc-banner block' }, icon('ban', { size: 16 }), h('span', null, 'Você bloqueou este contato.')));

  const list = h('div', { class: 'pc-list' });
  const scroller = h('div', { class: 'pc-scroll' }, list);
  const foot = h('div', { class: 'pc-foot no-terms' },
    h('div', { class: 'pc-input', 'aria-disabled': 'true' }, icon('lock', { size: 16 }),
      h('input', { type: 'text', disabled: true, placeholder: 'Somente leitura — espelho do aparelho', 'aria-label': 'Somente leitura — espelho do aparelho' })));
  body.append(bar, ...banners, scroller, foot);

  /* ---------- rolagem ---------- */
  let target = null;           // mensagem/divisor alvo (null = fim)
  let stick = true;            // enquanto o jogador não rolar, mantém a âncora quando as fotos carregam
  const anchorTop = (n) => n.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
  const goto = () => {
    if (target) scroller.scrollTop = Math.max(0, anchorTop(target) - Math.max(24, (scroller.clientHeight - target.offsetHeight) / 2));
    else scroller.scrollTop = scroller.scrollHeight;
  };
  for (const ev of ['wheel', 'touchstart', 'pointerdown', 'keydown']) scroller.addEventListener(ev, () => { stick = false; }, { passive: true });
  scroller.addEventListener('load', (e) => {
    const im = e.target;
    if (im.tagName !== 'IMG') return;
    const box = im.closest('.pm-thumb');
    if (box && im.naturalWidth) {
      const r = im.naturalWidth / im.naturalHeight;
      box.style.aspectRatio = String(clampRatio(r));
      im.style.objectPosition = r < 0.8 ? 'center top' : 'center';
    }
    if (stick) goto();
  }, true);

  const flash = (node) => { node.classList.remove('flash'); void node.offsetWidth; node.classList.add('flash'); setTimeout(() => node.classList.remove('flash'), 2600); };
  function jump(id, { divider = false } = {}) {
    const node = divider ? list.querySelector('.pm-pending') || list.querySelector(`[data-id="${CSS.escape(id)}"]`) : list.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (!node) return;
    target = node; goto(); flash(node);
  }

  /* ---------- seleção, menu e toque longo ---------- */
  let selected = null;
  const select = (row) => {
    if (selected && selected !== row) selected.classList.remove('sel');
    row.classList.toggle('sel');
    selected = row.classList.contains('sel') ? row : null;
  };
  scroller.addEventListener('click', (e) => { if (selected && !e.target.closest('.pm')) { selected.classList.remove('sel'); selected = null; } });

  const pinKey = (m) => 'papo:msg:' + m.id;
  function openMenu(m, row, bubble) {
    phone.root.querySelectorAll('.k-menu').forEach((x) => x.remove());
    const pinned = game.isPinned(pinKey(m));
    const items = [
      pinned
        ? { label: 'Remover do Quadro', icon: 'pin-off', onClick: () => { game.unpin(pinKey(m)); phone.toast('Removido do Quadro', { icon: 'pin-off' }); } }
        : { label: 'Fixar no Quadro', icon: 'pin', onClick: () => { game.pin({ key: pinKey(m), label: snippet(m), app: 'papo', detail: `${senderLabel(m.from)}${group ? ' em ' + name : ''} · ${when(m.at)}` }); phone.toast('Fixado no Quadro', { icon: 'pin' }); } },
      { label: 'Detalhes', icon: 'info', onClick: () => showDetails(env, chat, m) },
      m.kind === 'text' && m.text ? { label: 'Copiar texto', icon: 'copy', onClick: () => { try { navigator.clipboard?.writeText(m.text); } catch (e) { /* sem permissão */ } phone.toast('Texto copiado', { icon: 'copy' }); } } : null,
    ];
    kit.menu(bubble, items);
    placeMenu(env, bubble, row.classList.contains('me'));
  }

  function attachPress(row, bubble, m) {
    let timer = null, sx = 0, sy = 0, fired = false;
    const cancel = () => { clearTimeout(timer); timer = null; };
    bubble.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      fired = false; sx = e.clientX; sy = e.clientY;
      cancel();
      timer = setTimeout(() => { timer = null; fired = true; row.classList.add('sel'); selected = row; openMenu(m, row, bubble); }, 480);
    });
    bubble.addEventListener('pointermove', (e) => { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) cancel(); });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) bubble.addEventListener(ev, cancel);
    bubble.addEventListener('contextmenu', (e) => { e.preventDefault(); cancel(); fired = true; openMenu(m, row, bubble); });
    bubble.addEventListener('click', (e) => {
      if (fired) { fired = false; return; }
      if (e.target.closest('button, .k-audio, a, mark')) return;
      select(row);
    });
  }

  /* ---------- balões ---------- */
  function thumb(m) {
    const ratio = m.w && m.h ? clampRatio(m.w / m.h) : 4 / 3;
    const box = kit.img(m.media, { alt: m.caption || (m.kind === 'video' ? 'Vídeo' : 'Foto'), className: 'pm-thumb', ratio: String(ratio), onClick: () => openMedia(m) });
    const im = box.querySelector('img');
    if (im) im.loading = 'eager';
    box.setAttribute('role', 'button');
    box.setAttribute('aria-label', m.kind === 'video' ? 'Abrir vídeo' : 'Abrir foto');
    if (m.kind === 'video') {
      const overlay = [h('span', { class: 'pm-play' }, icon('play', { size: 22 })), m.duration ? h('span', { class: 'pm-dur' }, time.duration(m.duration)) : null];
      box.append(...overlay.filter(Boolean));
      // se o arquivo faltar, o kit.img limpa a caixa: devolve o botão de play para o vídeo continuar abrível
      if (im) im.addEventListener('error', () => box.append(...overlay.filter(Boolean)), { once: true });
    }
    return box;
  }

  const metaNode = (m, over = false) => {
    const st = statusOf(m);
    return h('span', { class: `pm-meta${over ? ' over' : ''}`, title: st ? STATUS_TEXT[st] : '' }, h('span', { class: 'pm-time' }, time.hhmm(m.at)), tick(st, 15));
  };
  const textBody = (text, m) => h('div', { class: 'pm-body' }, h('span', { class: 'txt pm-text' }, text), metaNode(m));
  const footMeta = (m) => h('div', { class: 'pm-foot' }, metaNode(m));

  function quoteNode(q) {
    return h('button', { class: 'pm-quote', style: { '--c': colorOf(q.from) }, on: { click: (e) => { e.stopPropagation(); jump(q.id); } } },
      h('b', null, isMe(q.from) ? 'Você' : nameOf(q.from)),
      h('span', { class: 'txt' }, snippet(q).slice(0, 140)));
  }

  function bubbleFor(m, pos) {
    const me = isMe(m.from);
    const parts = [];
    let cls = 'pm';
    if (!me && group && pos.first) parts.push(h('div', { class: 'pm-who', style: { '--c': colorOf(m.from) } }, nameOf(m.from)));
    if (m.forwarded) parts.push(h('div', { class: 'pm-fwd' }, icon('forward', { size: 13 }), 'Encaminhada'));
    const q = m.replyTo && byId.get(m.replyTo);
    if (q) parts.push(quoteNode(q));

    switch (m.kind) {
      case 'image':
      case 'video': {
        cls += ' media';
        parts.push(thumb(m));
        if (m.caption) parts.push(textBody(m.caption, m));
        else parts.push(metaNode(m, true));
        break;
      }
      case 'audio': {
        cls += ' audio';
        parts.push(h('div', { class: 'pm-audio' }, kit.audioPlayer({ compact: true, duration: m.duration || 20, key: 'papo:audio:' + m.id, title: 'Áudio' })));
        if (m.transcript) {
          const tr = h('div', { class: 'pm-trans txt', hidden: true }, m.transcript);
          const lbl = h('span', null, 'Transcrição');
          const btn = h('button', { class: 'pm-tbtn', 'aria-expanded': 'false', on: { click: (e) => {
            e.stopPropagation();
            const open = tr.hidden;
            tr.hidden = !open; btn.classList.toggle('on', open); btn.setAttribute('aria-expanded', String(open));
            lbl.textContent = open ? 'Ocultar transcrição' : 'Transcrição';
            if (open) game.see('papo:audio:' + m.id);
          } } }, icon('audio-lines', { size: 15 }), lbl);
          parts.push(btn, tr);
        }
        parts.push(footMeta(m));
        break;
      }
      case 'doc': {
        const d = m.doc || {};
        const ext = (String(d.name || '').split('.').pop() || '').toLowerCase();
        cls += ' doc';
        parts.push(h('button', { class: 'pm-doc', on: { click: (e) => { e.stopPropagation(); if (d.file) phone.open('arquivos', { file: d.file }); else phone.toast('Arquivo indisponível no espelho', { icon: 'file-text' }); } } },
          h('span', { class: `ft ${ext}` }, icon(EXT_ICON[ext] || 'file', { size: 22 })),
          h('span', { class: 'fi' }, h('b', { class: 'txt' }, d.name || 'Documento'), h('small', null, [ext.toUpperCase(), fmtSize(d.size)].filter(Boolean).join(' · ')))));
        if (m.caption || m.text) parts.push(textBody(m.caption || m.text, m)); else parts.push(footMeta(m));
        break;
      }
      case 'location': {
        const p = m.place || {};
        const label = p.name || m.text || 'Localização compartilhada';
        const coords = p.lat != null && p.lng != null ? `${Number(p.lat).toFixed(4)}, ${Number(p.lng).toFixed(4)}` : 'Toque para abrir no Rotas';
        cls += ' loc';
        parts.push(h('button', { class: 'pm-loc', on: { click: (e) => { e.stopPropagation(); phone.open('rotas', {}); } } },
          h('span', { class: 'map', 'aria-hidden': 'true' }, h('span', { class: 'pin' }, icon('map-pin', { size: 24, stroke: 2.2 }))),
          h('span', { class: 'lb' }, h('b', { class: 'txt' }, label), h('small', null, coords))));
        parts.push(footMeta(m));
        break;
      }
      case 'deleted': {
        cls += ' deleted';
        parts.push(h('div', { class: 'pm-body' }, icon('ban', { size: 15, className: 'pm-ban' }), h('span', { class: 'txt pm-text' }, ' Esta mensagem foi apagada'), metaNode(m)));
        break;
      }
      case 'call': {
        const c = callInfo(m);
        cls += ` call ${c.cls}`;
        parts.push(h('div', { class: 'pm-call' }, h('span', { class: 'ci' }, icon(c.icon, { size: 18 })),
          h('span', { class: 'cl' }, h('b', { class: 'txt' }, c.label), c.sub ? h('small', null, c.sub) : null)));
        parts.push(footMeta(m));
        break;
      }
      case 'sticker': {
        cls += ' sticker';
        const st = m.media
          ? kit.img(m.media, { alt: 'Figurinha', className: 'pm-sticker', ratio: '1/1', onClick: () => openMedia(m) })
          : h('div', { class: 'pm-sticker emoji', 'aria-label': 'Figurinha' }, m.text || '🏷️');
        parts.push(st, metaNode(m, true));
        break;
      }
      default:
        parts.push(textBody(m.text || '', m));
    }
    return h('div', { class: cls }, parts);
  }

  function rowFor(m, pos) {
    const me = isMe(m.from);
    const pend = isPending(m);
    const bubble = bubbleFor(m, pos);
    const row = h('div', { class: `pm-row ${me ? 'me' : 'them'}${pos.first ? ' first' : ''}${pos.last ? ' last' : ''}${pend ? ' pend' : ''}`, dataset: { id: m.id } });
    const more = h('button', { class: 'pm-more', 'aria-label': 'Opções da mensagem', on: { click: (e) => { e.stopPropagation(); openMenu(m, row, bubble); } } }, icon('ellipsis', { size: 18 }));
    const react = Array.isArray(m.reactions) && m.reactions.length ? reactionsNode(m.reactions) : null;
    const col = h('div', { class: 'pm-col' }, bubble, react);
    row.append(...(me ? [more, col] : [col, more]));
    attachPress(row, bubble, m);
    return row;
  }

  /* ---------- montagem da lista ---------- */
  const sameRun = (a, b) => a && b && a.from === b.from && a.kind !== 'system' && b.kind !== 'system' && isPending(a) === isPending(b) && time.ymd(a.at) === time.ymd(b.at) && Math.abs(time.parse(b.at) - time.parse(a.at)) < 6 * 60000;
  let pendingShown = false;
  msgs.forEach((m, i) => {
    const prev = msgs[i - 1], next = msgs[i + 1];
    if (!prev || time.ymd(prev.at) !== time.ymd(m.at)) list.append(h('div', { class: 'pm-day' }, dayTitle(m.at, now)));
    if (isPending(m) && !pendingShown) {
      pendingShown = true;
      list.append(h('div', { class: 'pm-pending no-terms', role: 'note' }, icon('cloud-download', { size: 16 }),
        h('span', null, `Recebidas pelo servidor depois que o celular desligou (${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}) · não entregues`)));
    }
    if (m.kind === 'system') { list.append(h('div', { class: 'pm-sys txt', dataset: { id: m.id } }, m.text)); return; }
    list.append(rowFor(m, { first: !sameRun(prev, m), last: !sameRun(m, next) }));
  });
  if (!msgs.length) list.append(h('div', { class: 'pm-sys' }, 'Nenhuma mensagem nesta conversa.'));

  // abre no fim da conversa ou direto na mensagem pedida
  if (opts.msg && byId.has(opts.msg)) {
    target = list.querySelector(`[data-id="${CSS.escape(opts.msg)}"]`);
    if (target) flash(target);
  }
  goto();
  requestAnimationFrame(() => { goto(); });

  /* ---------- dados do contato / grupo ---------- */
  function openInfo() {
    phone.sheet({
      render(el, close) {
        const about = chat.about || chat.status || chat.description || contact?.about || '';
        el.append(h('div', { class: 'pi' },
          h('div', { class: 'pi-hero' },
            chatAvatar(env, chat, 92),
            h('h2', { class: 'txt' }, name),
            group
              ? h('p', null, `Grupo · ${(chat.members || []).length} participantes`)
              : h('p', { class: 'txt' }, store.fmtPhone(chat.phone || contact?.phones?.[0] || '')),
            h('div', { class: 'pi-tags' },
              unknown ? h('span', { class: 'tag' }, icon('info', { size: 13 }), 'Fora dos contatos') : null,
              blocked ? h('span', { class: 'tag danger' }, icon('ban', { size: 13 }), 'Bloqueado') : null,
              chat.muted ? h('span', { class: 'tag' }, icon('bell-off', { size: 13 }), 'Silenciada') : null,
              chat.archived ? h('span', { class: 'tag' }, icon('archive', { size: 13 }), 'Arquivada') : null)),
          about ? h('div', { class: 'pi-sec' }, h('small', null, group ? 'Descrição' : 'Recado'), h('p', { class: 'txt' }, about)) : null,
          contact && !group ? h('div', { class: 'pi-act' }, kit.button({ label: 'Ver contato', icon: 'contact', variant: 'tonal', onClick: () => { close(); phone.open('telefone', { tab: 'contatos', contact: contact.id }); } })) : null));

        if (media.length) {
          el.append(kit.sectionTitle(`Mídia compartilhada · ${media.length}`),
            h('div', { class: 'pi-grid' }, media.map((m, i) => {
              const t = kit.img(m.media, { alt: m.caption || 'Mídia', ratio: '1/1', onClick: () => kit.imageViewer(viewerItems, i) });
              if (m.kind === 'video') t.append(h('span', { class: 'pm-play sm' }, icon('play', { size: 16 })));
              t.setAttribute('role', 'button');
              return t;
            })));
        }
        const docs = msgs.filter((m) => m.kind === 'doc' && m.doc);
        if (docs.length) {
          el.append(kit.sectionTitle(`Documentos · ${docs.length}`),
            kit.list(docs.map((m) => kit.listItem({ icon: EXT_ICON[(m.doc.name || '').split('.').pop().toLowerCase()] || 'file', title: m.doc.name, subtitle: `${senderLabel(m.from)} · ${time.dateShort(m.at)}`, onClick: () => { close(); if (m.doc.file) phone.open('arquivos', { file: m.doc.file }); } }))));
        }
        if (group) {
          const ids = chat.members || [];
          const ordered = [...ids.filter((id) => !isMe(id)), ...ids.filter(isMe)];
          el.append(kit.sectionTitle(`Participantes · ${ids.length}`),
            kit.list(ordered.map((id) => {
              const c = contactOf(id);
              return kit.listItem({
                avatar: whoAvatar(env, id, 40), title: nameOf(id),
                subtitle: isMe(id) ? 'Dona do celular' : store.digits(id).length >= 8 ? store.fmtPhone(id) : c?.phones?.[0] ? store.fmtPhone(c.phones[0], { intl: false }) : c?.relation || '',
                onClick: c && !isMe(id) ? () => { close(); phone.open('telefone', { tab: 'contatos', contact: c.id }); } : null,
              });
            })));
        }
        el.append(h('div', { class: 'pi-pin' }, kit.pinButton({ key: 'papo:chat:' + chat.id, label: `Conversa: ${name}`, app: 'papo', detail: group ? `Grupo · ${(chat.members || []).length} participantes` : (chat.lastSeen ? lastSeenText(chat.lastSeen, now) : 'Conversa direta') })));
      },
    });
  }
}

function membersText(chat) {
  const ids = chat.members || [];
  const names = ids.filter((id) => !isMe(id)).map(nameOf);
  if (ids.some(isMe)) names.push('Você');
  return names.join(', ');
}

function reactionsNode(list) {
  const counts = new Map();
  for (const r of list) { const k = typeof r === 'string' ? r : r?.emoji || r?.e || ''; if (k) counts.set(k, (counts.get(k) || 0) + 1); }
  return h('div', { class: 'pm-react', 'aria-label': 'Reações' }, [...counts].map(([e, n]) => h('span', null, e, n > 1 ? h('i', null, String(n)) : null)));
}

function showDetails(env, chat, m) {
  const { phone, now } = env;
  const rows = [];
  const me = isMe(m.from);
  const when2 = (s) => `${time.dayLabel(s)} · ${clock(s)}`;
  if (m.kind === 'deleted') {
    rows.push(['Situação', m.deletedAt ? `Apagada para todos em ${time.weekday(m.deletedAt)} ${time.hhmm(m.deletedAt)}` : 'Apagada para todos']);
    rows.push(['Enviada por', senderLabel(m.from)]);
    rows.push(['Enviada em', when2(m.at)]);
  } else if (isPending(m)) {
    rows.push(['Enviada por', senderLabel(m.from)]);
    rows.push(['Enviada em', when2(m.at)]);
    rows.push(['Entrega', 'Não entregue']);
    rows.push(['Situação', `Chegou ao servidor depois que o celular desligou (${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}). O aparelho nunca recebeu.`]);
  } else if (me) {
    const st = statusOf(m);
    rows.push(['Enviada', when2(m.at)]);
    rows.push(['Entregue', st === 'delivered' || st === 'read' ? 'Sim' : 'Ainda não']);
    rows.push(['Lida', st === 'read' ? 'Sim' : 'Ainda não']);
  } else {
    rows.push(['Enviada por', senderLabel(m.from)]);
    rows.push(['Recebida', when2(m.at)]);
  }
  if (m.forwarded) rows.push(['Origem', 'Mensagem encaminhada']);
  rows.push(['Conversa', chatName(chat)]);
  phone.dialog({
    title: 'Detalhes da mensagem',
    body: h('dl', { class: 'pm-detail txt' }, rows.flatMap(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
    actions: [{ label: 'Fechar', value: true, primary: true }],
  });
}

/* =====================================================================
   Contrato do app
   ===================================================================== */
export default {
  id: 'papo',
  title: 'Papo',
  cloud: true,

  render(ctx) {
    const { game, kit, phone, nav, params = {} } = ctx;
    const env = { ctx, kit, phone, game, nav, now: ctx.now || NOW };
    const chats = (ctx.data?.chats || []).filter((c) => game.req(c));
    const views = chats.map((c) => chatView(c, game));
    renderRoot(env, views);

    // abertura direta: {chat, msg}
    let chat = params.chat ? chats.find((c) => c.id === params.chat) : null;
    if (!chat && params.msg) chat = chats.find((c) => (c.messages || []).some((m) => m.id === params.msg && game.req(m)));
    if (chat) openChat(env, chat, { msg: params.msg });
    else if (params.chat) phone.toast('Conversa indisponível', { icon: 'message-circle-x' });
  },

  search({ data, game }) {
    const out = [];
    for (const chat of data?.chats || []) {
      if (!game.req(chat)) continue;
      const title = chatName(chat);
      for (const m of chat.messages || []) {
        if (!game.req(m)) continue;
        const text = searchText(m);
        if (text) out.push({ title, text, params: { chat: chat.id, msg: m.id }, at: m.at });
      }
    }
    return out;
  },
};
