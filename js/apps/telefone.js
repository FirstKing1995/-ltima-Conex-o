// App "Telefone" (visual do Telefone do Google) — Favoritos | Recentes | Contatos | Correio de voz (a caixa postal vem do servidor).
import { h, clear, append } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import * as store from '../core/store.js';
import { state, save, isSeen } from '../core/state.js';
import { normalize } from '../core/hash.js';

const MIRROR = time.MIRROR_NOW;

/* ---------- helpers ---------- */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const hasSeconds = (s) => /T\d{2}:\d{2}:\d{2}/.test(String(s));
const clock = (s) => (hasSeconds(s) ? time.hhmmss(s) : time.hhmm(s));
const when = (s) => `${time.weekday(s)} ${time.dateShort(s)} · ${time.hhmm(s)}`;
const national = (p) => store.fmtPhone(p, { intl: false });

function daysBetween(a, b) {
  const pa = time.parse(a), pb = time.parse(b);
  return Math.round((Date.UTC(pb.getFullYear(), pb.getMonth(), pb.getDate()) - Date.UTC(pa.getFullYear(), pa.getMonth(), pa.getDate())) / 86400000);
}
/** "Hoje" | "Ontem" | "01/10" (relativo ao desligamento do aparelho) */
function dateLabel(at) {
  const d = daysBetween(at, MIRROR);
  if (d === 0) return 'Hoje';
  if (d === 1) return 'Ontem';
  return time.dateShort(at);
}
function shortDur(sec) {
  sec = Math.round(sec || 0);
  if (sec <= 0) return '';
  return sec < 60 ? `${sec} s` : `${Math.round(sec / 60)} min`;
}
function longDur(sec) {
  sec = Math.round(sec || 0);
  if (sec <= 0) return '';
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60), s = sec % 60;
  if (m < 60) return s ? `${m} min ${s} s` : `${m} min`;
  const hh = Math.floor(m / 60), mm = m % 60;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
}
function fmtBirthday(b) {
  const s = String(b).trim();
  let m = s.match(/^(?:(\d{4})-)?(\d{2})-(\d{2})$/); // aaaa-mm-dd ou mm-dd
  if (m) return `${+m[3]} de ${time.monthName(+m[2] - 1)}${m[1] ? ' de ' + m[1] : ''}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/); // dd/mm ou dd/mm/aaaa
  if (m) return `${+m[1]} de ${time.monthName(+m[2] - 1)}${m[3] ? ' de ' + m[3] : ''}`;
  return s;
}
const sortKey = (c) => fold(c.name).replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
const letterOf = (c) => { const k = sortKey(c)[0] || '#'; return /[a-z]/.test(k) ? k.toUpperCase() : '#'; };
const sameNumber = (a, b) => { const x = store.digits(a), y = store.digits(b); return !!x && !!y && (x === y || (x.length >= 9 && y.length >= 9 && x.slice(-9) === y.slice(-9))); };

const allContacts = () => store.CASE.contacts?.contacts || [];
const contactOf = (call) => (call.contact && store.contact(call.contact)) || store.contactByPhone(call.phone) || null;

const DIR = {
  in: { ic: 'phone-incoming', label: 'Recebida', cls: 'in', long: 'Chamada recebida' },
  out: { ic: 'phone-outgoing', label: 'Realizada', cls: 'out', long: 'Chamada realizada' },
  missed: { ic: 'phone-missed', label: 'Perdida', cls: 'missed', long: 'Chamada perdida' },
  blocked: { ic: 'ban', label: 'Bloqueada', cls: 'blocked', long: 'Chamada bloqueada' },
};

function contactAvatar(env, c, size = 46) {
  return env.kit.avatar({ src: c.avatar, name: c.name, color: c.color || store.colorFor(c.id), size });
}
function partyAvatar(env, party, size = 46) {
  if (party.c) return contactAvatar(env, party.c, size);
  return env.kit.avatar({ name: party.name, size, icon: 'user-round', color: '#5f6368' });
}
function partyOf(call) {
  const c = contactOf(call);
  return { c, name: c?.name || store.fmtPhone(call.phone), number: store.fmtPhone(call.phone) };
}

/** Para onde vai o botão "Mensagem": conversa direta no WhatsApp ou conversa no SMS. */
function messageTarget(env, c, phone) {
  const { game } = env;
  const phones = [...(c?.phones || []), phone].filter(Boolean);
  const chat = (store.CASE.papo?.chats || []).find((ch) => ch.type !== 'group' && game.req(ch) && ((c && ch.contact === c.id) || (ch.phone && phones.some((p) => sameNumber(p, ch.phone)))));
  if (chat) return { app: 'papo', params: { chat: chat.id } };
  const th = (store.CASE.sms?.threads || []).find((t) => game.req(t) && ((c && t.contact === c.id) || phones.some((p) => sameNumber(p, t.phone))));
  if (th) return { app: 'sms', params: { thread: th.id } };
  return null;
}

/* ---------- ícones do Telefone do Google (Material, SVG inline) ---------- */
const MD = {
  received: '<path d="M20 5.41 18.59 4 7 15.59V9H5v10h10v-2H8.41z"/>',
  made: '<path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>',
  missed: '<path d="M19.59 7 12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z"/>',
  block: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 0 1 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0 1 20 12c0 4.42-3.58 8-8 8z"/>',
  call: '<path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>',
  dialpad: '<path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
  star: '<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  starO: '<path d="m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>',
  recents: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  people: '<path d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87zM15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24a5.98 5.98 0 0 1 0 7.52c.42.14.86.24 1.33.24zm-6 0c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1z"/>',
  voicemail: '<path d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"/>',
  personAdd: '<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
  backspace: '<path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>',
};
function md(name, size = 24, cls = '') {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="ic ${cls}" aria-hidden="true">${MD[name] || ''}</svg>`;
  return t.content.firstChild;
}
const DIR_MD = { in: 'received', out: 'made', missed: 'missed', blocked: 'block' };
const noCall = (env) => env.phone.toast('Ligações indisponíveis na extração', { icon: 'phone' });

/** Botão redondo de ligar no fim da linha (span, porque a linha já é um botão). */
function callBtn(env) {
  return h('span', { class: 'tl-callbtn', role: 'button', tabindex: '0', 'aria-label': 'Ligar', on: { click: (e) => { e.stopPropagation(); noCall(env); } } }, md('call', 22));
}

/* ---------- Recentes ---------- */
function recentGroup(at) {
  if (time.parse(at) > time.parse(MIRROR)) return 'Depois que o celular desligou';
  const d = daysBetween(at, MIRROR);
  if (d <= 0) return 'Hoje';
  if (d === 1) return 'Ontem';
  return 'Mais antigas';
}

function renderRecents(env, slot, calls) {
  const { kit } = env;
  let filter = 'all';
  const list = h('div', { class: 'tl-list' });
  const draw = () => {
    clear(list);
    const items = calls.filter((c) => filter === 'all' || (filter === 'in' && c.dir === 'in') || (filter === 'out' && c.dir === 'out') || (filter === 'missed' && c.dir === 'missed') || (filter === 'blocked' && c.dir === 'blocked'));
    if (!items.length) { list.append(kit.empty({ icon: 'phone', title: 'Nenhuma chamada', text: 'Não há chamadas neste filtro.' })); return; }
    // agrupado como no Telefone do Google: Hoje, Ontem, Mais antigas
    const groups = new Map();
    for (const call of items) { const g = recentGroup(call.at); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(call); }
    for (const [g, cs] of groups) {
      list.append(h('div', { class: `tl-group${g.startsWith('Depois') ? ' late' : ''}` }, g), kit.list(cs.map((call) => {
        const party = partyOf(call);
        const dir = DIR[call.dir] || DIR.in;
        const parts = [];
        if (call.via === 'papo') parts.push('WhatsApp');
        else parts.push(party.c ? 'Celular' : dir.label);
        const dur = shortDur(call.duration);
        if (dur && call.dir !== 'missed' && call.dir !== 'blocked') parts.push(dur);
        parts.push(g === 'Mais antigas' || g.startsWith('Depois') ? `${time.dateShort(call.at)}, ${time.hhmm(call.at)}` : time.hhmm(call.at));
        return kit.listItem({
          avatar: partyAvatar(env, party, 42),
          title: h('span', { class: 'txt' }, party.name),
          subtitle: h('span', { class: 'tl-sub' }, md(DIR_MD[call.dir] || 'received', 16, `tl-dir ${dir.cls}`), h('span', { class: 'sr' }, dir.label + ': '), parts.join(' • ')),
          trailing: callBtn(env),
          className: `tl-call ${dir.cls}`,
          onClick: () => openCall(env, call),
        });
      })));
    }
    env.phone.scan(list);
  };
  append(slot, [
    kit.chips({ active: filter, items: [{ id: 'all', label: 'Todas' }, { id: 'missed', label: 'Perdidas' }, { id: 'out', label: 'Realizadas' }, { id: 'in', label: 'Recebidas' }, { id: 'blocked', label: 'Bloqueadas' }], onChange: (id) => { filter = id; draw(); } }),
    list,
  ]);
  draw();
}

/* ---------- Favoritos ---------- */
function renderFavorites(env, slot, calls) {
  const { kit, game } = env;
  const contacts = allContacts().filter((c) => c.id !== 'iara' && game.req(c));
  const favs = contacts.filter((c) => c.favorite).sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'pt-BR'));
  if (favs.length) {
    slot.append(h('div', { class: 'tf-grid' }, favs.map((c) => h('button', { class: 'tf-fav', on: { click: () => openContact(env, c) } },
      contactAvatar(env, c, 72),
      h('span', { class: 'n txt' }, c.name.split(' ')[0]),
      h('span', { class: 'l' }, c.phones?.length ? 'Celular' : c.email ? 'E-mail' : '')))));
  } else {
    slot.append(kit.empty({ icon: 'star', title: 'Nenhum favorito', text: 'Os contatos favoritos aparecem aqui.' }));
  }
  // "Frequentes": quem mais aparece nas chamadas e não é favorito
  const count = new Map();
  for (const call of calls) { const c = contactOf(call); if (c && !c.favorite && c.id !== 'iara' && game.req(c)) count.set(c, (count.get(c) || 0) + 1); }
  const freq = [...count].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c);
  if (freq.length) {
    slot.append(h('div', { class: 'tl-group' }, 'Frequentes'), kit.list(freq.map((c) => kit.listItem({
      avatar: contactAvatar(env, c, 42),
      title: h('span', { class: 'txt' }, c.name),
      subtitle: h('span', { class: 'txt' }, c.phones?.[0] ? national(c.phones[0]) : c.relation || ''),
      trailing: callBtn(env),
      className: 'tc-row',
      onClick: () => openContact(env, c),
    }))));
  }
  env.phone.scan(slot);
}

function openCall(env, call) {
  const { kit, phone, game, nav } = env;
  const party = partyOf(call);
  const dir = DIR[call.dir] || DIR.in;
  game.see('telefone:call:' + call.id);
  if (call.onSee) game.flags(call.onSee);
  nav.push({
    title: party.name,
    className: 'tel-detail',
    render(body) {
      const target = messageTarget(env, party.c, call.phone);
      const rows = [
        ['Tipo', dir.long],
        ['Data', `${cap(time.weekdayLong(call.at))}, ${time.dateLong(call.at)}`],
        ['Hora', clock(call.at)],
        ['Duração', call.dir === 'missed' ? 'Não atendida' : call.dir === 'blocked' ? 'Bloqueada pelo aparelho' : longDur(call.duration) || '—'],
        ['Via', call.via === 'papo' ? 'WhatsApp (chamada pela internet)' : 'Telefone (operadora Claro)'],
        ['Número', party.number],
      ];
      if (time.parse(call.at) > time.parse(MIRROR)) rows.push(['Observação', `Registrada depois que o celular desligou (${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}).`]);
      append(body, [
        kit.appBar({ title: 'Detalhes da chamada' }),
        h('div', { class: 'td-hero' },
          partyAvatar(env, party, 84),
          h('h2', { class: 'txt' }, party.name),
          party.c ? h('p', { class: 'txt' }, party.number) : h('p', null, 'Número fora dos contatos'),
          h('span', { class: `td-pill ${dir.cls}` }, icon(dir.ic, { size: 15 }), dir.long)),
        h('div', { class: 'td-actions' },
          actionBtn('phone', 'Ligar', () => phone.toast('Ligações indisponíveis na extração', { icon: 'phone' })),
          actionBtn('message-circle', 'Mensagem', target ? () => phone.open(target.app, target.params) : () => phone.toast('Sem conversa com este número', { icon: 'message-circle' }), !target),
          party.c ? actionBtn('contact', 'Contato', () => openContact(env, party.c)) : null),
        kit.kv(rows),
        h('div', { class: 'td-pin' }, kit.pinButton({ key: 'telefone:call:' + call.id, label: `${dir.long}: ${party.name}${call.duration ? ' (' + longDur(call.duration) + ')' : ''}`, app: 'telefone', detail: `${when(call.at)}${call.via === 'papo' ? ' · WhatsApp' : ''}` })),
      ]);
    },
  });
}

function actionBtn(ic, label, onClick, off = false) {
  return h('button', { class: `td-act${off ? ' off' : ''}`, on: { click: onClick } }, h('span', { class: 'c' }, icon(ic, { size: 22 })), h('span', null, label));
}

/* ---------- Contatos ---------- */
/** Desenha a lista de contatos; a busca fica na barra de cima do app. Devolve setQuery(texto). */
function renderContacts(env, slot, initialQuery = '') {
  const { kit, game } = env;
  const contacts = allContacts().filter((c) => c.id !== 'iara' && game.req(c)).sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'pt-BR'));
  const mine = store.contact('iara');
  let query = initialQuery;
  const body = h('div', { class: 'tc-list' });

  const row = (c) => kit.listItem({
    avatar: contactAvatar(env, c, 42),
    title: h('span', { class: 'txt' }, c.name),
    subtitle: h('span', { class: 'txt' }, c.phones?.[0] ? national(c.phones[0]) : c.email || c.relation || ''),
    meta: c.blocked ? h('span', { class: 'tc-blk' }, icon('ban', { size: 13 }), 'Bloqueado') : null,
    dim: !!c.blocked,
    className: 'tc-row',
    onClick: () => openContact(env, c),
  });

  const draw = () => {
    clear(body);
    const q = normalize(query);
    if (q.length >= 1) {
      const hits = contacts.filter((c) => normalize([c.name, c.fullName, c.email, c.company, c.relation, ...(c.phones || [])].join(' ')).includes(q));
      if (!hits.length) { body.append(kit.empty({ icon: 'search', title: 'Nenhum contato', text: `Nada encontrado para "${query}".` })); return; }
      body.append(h('div', { class: 'tl-group' }, `Contatos · ${hits.length}`), kit.list(hits.map(row)));
      env.phone.scan(body);
      return;
    }
    body.append(h('button', { class: 'tc-new', on: { click: () => env.phone.toast('Somente leitura: extração do aparelho', { icon: 'lock' }) } },
      h('span', { class: 'i' }, md('personAdd', 22)), h('span', null, 'Criar novo contato')));
    if (mine) {
      body.append(h('button', { class: 'tc-me', on: { click: () => openContact(env, mine, { me: true }) } },
        contactAvatar(env, mine, 42),
        h('span', { class: 'who' }, h('b', { class: 'txt' }, mine.fullName || mine.name), h('small', null, 'Meu cartão'))));
    }
    const groups = new Map();
    for (const c of contacts) { const l = letterOf(c); if (!groups.has(l)) groups.set(l, []); groups.get(l).push(c); }
    for (const [l, cs] of groups) body.append(h('div', { class: 'tc-group' }, h('div', { class: 'tc-letter' }, l), kit.list(cs.map(row))));
    body.append(h('p', { class: 'tc-count' }, `${contacts.length} contatos`));
    env.phone.scan(body);
  };

  slot.append(body);
  draw();
  return (v) => { query = v; draw(); };
}

function openContact(env, c, { me = false } = {}) {
  const { kit, phone, game, nav } = env;
  game.see('telefone:contact:' + c.id);
  if (c.onSee) game.flags(c.onSee);
  nav.push({
    title: c.name,
    className: 'tel-detail',
    render(body) {
      const target = me ? null : messageTarget(env, c);
      const color = c.color || store.colorFor(c.id);
      const rows = [];
      (c.phones || []).forEach((p, i) => rows.push({ ic: 'phone', label: i === 0 ? 'Celular' : `Celular ${i + 1}`, value: national(p) }));
      if (c.email) rows.push({ ic: 'mail', label: 'E-mail', value: c.email });
      if (c.birthday) rows.push({ ic: 'cake', label: 'Aniversário', value: fmtBirthday(c.birthday) });
      if (c.company) rows.push({ ic: 'store', label: 'Empresa', value: c.company });
      if (c.relation) rows.push({ ic: 'users', label: 'Relação', value: cap(c.relation) });
      if (c.notes) rows.push({ ic: 'notebook', label: 'Notas', value: c.notes, long: true });
      const showFull = c.fullName && c.fullName !== c.name;
      append(body, [
        kit.appBar({ title: me ? 'Meu cartão' : 'Contato' }),
        h('div', { class: 'td-hero tinted', style: { '--c': color } },
          contactAvatar(env, c, 96),
          h('h2', { class: 'txt' }, c.name),
          showFull ? h('p', { class: 'txt' }, c.fullName) : null,
          h('div', { class: 'td-tags' },
            c.blocked ? h('span', { class: 'td-pill blocked' }, icon('ban', { size: 14 }), 'Bloqueado') : null,
            c.favorite ? h('span', { class: 'td-pill fav' }, icon('star', { size: 14 }), 'Favorito') : null,
            me ? h('span', { class: 'td-pill' }, icon('smartphone', { size: 14 }), 'Dona do celular') : null)),
        me ? null : h('div', { class: 'td-actions' },
          actionBtn('message-circle', 'Mensagem', target ? () => phone.open(target.app, target.params) : () => phone.toast('Sem conversa com este contato', { icon: 'message-circle' }), !target),
          actionBtn('phone', 'Ligar', () => phone.toast('Ligações indisponíveis na extração', { icon: 'phone' }))),
        h('div', { class: 'td-card' }, rows.map((r) => h('div', { class: `td-row${r.long ? ' long' : ''}` },
          h('span', { class: 'i' }, icon(r.ic, { size: 18 })),
          h('span', { class: 'v' }, h('small', null, r.label), h('span', { class: 'txt' }, r.value))))),
        h('div', { class: 'td-pin' }, kit.pinButton({ key: 'telefone:contact:' + c.id, label: showFull ? `${c.name} — ${c.fullName}` : c.name, app: 'telefone', detail: (c.phones || []).map(national).join(' · ') })),
      ]);
    },
  });
}

/* ---------- Caixa postal ---------- */
function renderVoicemail(env, slot, items, focus, onSeen) {
  const { kit, game } = env;
  if (!items.length) { slot.append(kit.empty({ icon: 'voicemail', title: 'Caixa postal vazia', text: 'Nenhuma mensagem de voz.' })); return; }
  const cards = [];
  append(slot, [h('p', { class: 'tv-intro no-terms' }, icon('cloud', { size: 14 }), `Mensagens guardadas no servidor da operadora · ${items.length}`)]);
  for (const v of items) {
    const party = partyOf(v);
    const key = 'telefone:voicemail:' + v.id;
    const tr = v.transcript;
    const lines = Array.isArray(tr) ? tr : null;
    const text = typeof tr === 'string' ? tr : '';
    const panel = h('div', { class: 'tv-body', hidden: true },
      kit.audioPlayer({ compact: !lines, title: 'Mensagem de voz', at: when(v.at), duration: v.duration || 20, key, transcript: lines || [] }),
      text ? h('div', { class: 'tv-trans' }, h('small', null, 'Transcrição automática'), h('p', { class: 'txt' }, text)) : null);
    const head = h('button', { class: 'tv-head', 'aria-expanded': 'false' },
      partyAvatar(env, party, 46),
      h('span', { class: 'who' }, h('b', { class: 'txt' }, party.name), h('span', null, when(v.at))),
      h('span', { class: 'dur' }, icon('voicemail', { size: 14 }), time.duration(v.duration || 0)),
      icon('chevron-down', { size: 20, className: 'chev' }));
    const card = h('div', { class: `tv-card${isSeen(key) ? '' : ' unread'}`, dataset: { id: v.id } }, head, panel);
    const toggle = (open) => {
      const on = open === undefined ? panel.hidden : open;
      panel.hidden = !on;
      card.classList.toggle('open', on);
      head.setAttribute('aria-expanded', String(on));
      if (on) { game.see(key); if (v.onSee) game.flags(v.onSee); card.classList.remove('unread'); onSeen?.(); }
    };
    head.addEventListener('click', () => toggle());
    card.toggle = toggle;
    cards.push(card);
    slot.append(card);
  }
  env.phone.scan(slot);
  if (focus) {
    const card = cards.find((c) => c.dataset.id === focus);
    if (card) { card.toggle(true); setTimeout(() => { card.scrollIntoView({ block: 'center' }); card.classList.add('flash'); setTimeout(() => card.classList.remove('flash'), 2400); }, 280); }
  }
}

/* ---------- Teclado (discador) ---------- */
const KEYS = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']];

function openDialpad(env) {
  const { phone, game } = env;
  const contacts = allContacts().filter((c) => c.id !== 'iara' && game.req(c) && (c.phones || []).length);
  let typed = '';
  let onKey = null;
  phone.sheet({
    title: '',
    render(el, close) {
      const num = h('div', { class: 'tdp-num', 'aria-live': 'polite' });
      const sugg = h('div', { class: 'tdp-sugg' });
      const del = h('button', { class: 'tdp-del', 'aria-label': 'Apagar', on: { click: () => { typed = typed.slice(0, -1); draw(); } } }, md('backspace', 24));
      const draw = () => {
        num.textContent = typed;
        num.classList.toggle('long', typed.length > 11);
        del.hidden = !typed;
        clear(sugg);
        const d = store.digits(typed);
        if (d.length < 2) return;
        const hits = contacts.filter((c) => c.phones.some((p) => store.digits(p).includes(d))).slice(0, 3);
        for (const c of hits) {
          sugg.append(h('button', { class: 'tdp-hit', on: { click: () => { close(); openContact(env, c); } } },
            contactAvatar(env, c, 36),
            h('span', { class: 'w' }, h('b', { class: 'txt' }, c.name), h('small', { class: 'txt' }, national(c.phones.find((p) => store.digits(p).includes(d))))),
            md('call', 20)));
        }
      };
      const press = (k) => { if (typed.length < 20) { typed += k; draw(); } };
      el.classList.add('tdp-sheet');
      el.append(h('div', { class: 'tdp' },
        sugg,
        h('div', { class: 'tdp-disp' }, h('span', { class: 'sp' }), num, del),
        h('div', { class: 'tdp-keys' }, KEYS.map(([k, l]) => h('button', { class: 'tdp-key', 'aria-label': k, on: { click: () => press(k) } }, h('span', { class: 'd' }, k), h('small', null, l)))),
        h('div', { class: 'tdp-foot' },
          h('button', { class: 'tdp-call', 'aria-label': 'Ligar', on: { click: () => noCall(env) } }, md('call', 28)))));
      onKey = (e) => {
        if (/^[0-9*#]$/.test(e.key)) { press(e.key); e.preventDefault(); }
        else if (e.key === 'Backspace') { typed = typed.slice(0, -1); draw(); e.preventDefault(); }
        else if (e.key === '+') press('+');
      };
      document.addEventListener('keydown', onKey);
      draw();
    },
  }).then(() => { if (onKey) document.removeEventListener('keydown', onKey); });
}

/* ---------- contrato ---------- */
const TABS = [
  { id: 'favoritos', label: 'Favoritos', ic: 'starO', on: 'star' },
  { id: 'recentes', label: 'Recentes', ic: 'recents' },
  { id: 'contatos', label: 'Contatos', ic: 'people' },
  { id: 'caixa', label: 'Correio de voz', ic: 'voicemail' },
];

export default {
  id: 'telefone',
  title: 'Telefone',
  cloud: false,

  render(ctx) {
    const { el, kit, phone, game, nav, params = {} } = ctx;
    const env = { ctx, kit, phone, game, nav };
    const data = ctx.data || {};
    const calls = (data.calls || []).filter((c) => game.req(c)).slice().sort((a, b) => time.compare(b.at, a.at));
    const voicemail = (data.voicemail || []).filter((v) => game.req(v)).slice().sort((a, b) => time.compare(b.at, a.at));

    const saved = state.apps?.telefone?.tab;
    let tab = params.voicemail ? 'caixa' : params.contact && !params.tab ? 'contatos' : params.tab || saved || 'recentes';
    if (!TABS.some((t) => t.id === tab)) tab = 'recentes';
    const unseenCount = () => voicemail.filter((v) => !isSeen('telefone:voicemail:' + v.id)).length;

    let query = '';
    let setContactQuery = null;
    const slot = h('div', { class: 'tel-slot' });
    const scroll = h('div', { class: 'tel-scroll' }, slot);
    const draw = (id, focus) => {
      clear(slot);
      setContactQuery = null;
      scroll.scrollTop = 0;
      if (id === 'contatos') setContactQuery = renderContacts(env, slot, query);
      else if (id === 'caixa') renderVoicemail(env, slot, voicemail, focus, refreshBadge);
      else if (id === 'favoritos') renderFavorites(env, slot, calls);
      else renderRecents(env, slot, calls);
    };

    // barra de busca do Telefone do Google ("Pesquisar contatos"): procura nos contatos
    const searchEl = kit.search({ placeholder: 'Pesquisar contatos', value: '', onInput: (v) => {
      query = v;
      if (tab !== 'contatos' && v.trim()) { go('contatos'); return; }
      setContactQuery?.(v);
    } });
    const top = h('div', { class: 'tel-top' }, searchEl,
      kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', className: 'tel-more', onClick: (e) => kit.menu(e.currentTarget, [
        { label: 'Histórico de chamadas', icon: 'history', onClick: () => go('recentes') },
        { label: 'Correio de voz', icon: 'voicemail', onClick: () => go('caixa') },
      ]) }));

    // barra de navegação inferior (Material 3)
    const navEl = h('nav', { class: 'tel-nav no-terms', 'aria-label': 'Seções do Telefone' });
    const drawNav = () => {
      clear(navEl);
      for (const t of TABS) {
        const on = t.id === tab;
        const n = t.id === 'caixa' ? unseenCount() : 0;
        navEl.append(h('button', { class: `tel-tab${on ? ' on' : ''}`, 'aria-current': on ? 'page' : null, on: { click: () => go(t.id) } },
          h('span', { class: 'ti' }, md(on && t.on ? t.on : t.ic, 24), n ? h('span', { class: 'tb' }, String(n)) : null),
          h('span', { class: 'tl' }, t.label)));
      }
    };
    function go(id, focus) {
      tab = id;
      if (id !== 'contatos' && query) { query = ''; searchEl.input.value = ''; }
      state.apps.telefone = { ...(state.apps.telefone || {}), tab: id };
      save();
      drawNav();
      draw(id, focus);
    }
    function refreshBadge() { drawNav(); }

    const fab = h('button', { class: 'tel-fab', 'aria-label': 'Teclado', title: 'Teclado', on: { click: () => openDialpad(env) } }, md('dialpad', 24));
    append(el, [
      top,
      h('p', { class: 'tel-reg no-terms' }, `Registro do aparelho · ${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}`),
      scroll,
      fab,
      navEl,
    ]);
    drawNav();
    draw(tab, params.voicemail);

    if (params.contact) {
      const c = store.contact(params.contact);
      if (c && game.req(c)) openContact(env, c, { me: c.id === 'iara' });
      else phone.toast('Contato indisponível', { icon: 'contact' });
    }
  },

  search({ data, game }) {
    const out = [];
    for (const c of allContacts()) {
      if (c.id === 'iara' || !game.req(c)) continue;
      const nums = (c.phones || []).map((p) => `${store.fmtPhone(p)} ${national(p)} ${p}`);
      out.push({ title: c.name, text: [c.fullName, ...nums, c.email, c.company, c.relation].filter(Boolean).join(' · '), params: { tab: 'contatos', contact: c.id } });
    }
    for (const v of data?.voicemail || []) {
      if (!game.req(v)) continue;
      const tr = Array.isArray(v.transcript) ? v.transcript.map((l) => l.text).join(' ') : v.transcript || '';
      if (!tr) continue;
      out.push({ title: `Caixa postal · ${partyOf(v).name}`, text: tr, params: { tab: 'caixa', voicemail: v.id }, at: v.at });
    }
    return out;
  },
};
