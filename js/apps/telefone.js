// App "Telefone" — Recentes | Contatos | Caixa postal (a caixa postal vem do servidor).
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

/** Para onde vai o botão "Mensagem": conversa direta no Papo ou conversa no SMS. */
function messageTarget(env, c, phone) {
  const { game } = env;
  const phones = [...(c?.phones || []), phone].filter(Boolean);
  const chat = (store.CASE.papo?.chats || []).find((ch) => ch.type !== 'group' && game.req(ch) && ((c && ch.contact === c.id) || (ch.phone && phones.some((p) => sameNumber(p, ch.phone)))));
  if (chat) return { app: 'papo', params: { chat: chat.id } };
  const th = (store.CASE.sms?.threads || []).find((t) => game.req(t) && ((c && t.contact === c.id) || phones.some((p) => sameNumber(p, t.phone))));
  if (th) return { app: 'sms', params: { thread: th.id } };
  return null;
}

/* ---------- Recentes ---------- */
function renderRecents(env, slot, calls) {
  const { kit, game } = env;
  let filter = 'all';
  const list = h('div', { class: 'tl-list' });
  const draw = () => {
    clear(list);
    const items = calls.filter((c) => filter === 'all' || (filter === 'in' && c.dir === 'in') || (filter === 'out' && c.dir === 'out') || (filter === 'missed' && c.dir === 'missed') || (filter === 'blocked' && c.dir === 'blocked'));
    if (!items.length) { list.append(kit.empty({ icon: 'phone', title: 'Nenhuma chamada', text: 'Não há chamadas neste filtro.' })); return; }
    list.append(kit.list(items.map((call) => {
      const party = partyOf(call);
      const dir = DIR[call.dir] || DIR.in;
      const parts = [dir.label];
      if (call.via === 'papo') parts.push('Papo');
      const dur = shortDur(call.duration);
      if (dur && call.dir !== 'missed' && call.dir !== 'blocked') parts.push(dur);
      return kit.listItem({
        avatar: partyAvatar(env, party, 46),
        title: h('span', { class: 'txt' }, party.name),
        subtitle: h('span', { class: 'tl-sub' }, icon(dir.ic, { size: 14, className: `tl-dir ${dir.cls}` }), parts.join(' · ')),
        meta: h('span', { class: 'tl-when' }, h('span', null, dateLabel(call.at)), h('span', null, time.hhmm(call.at))),
        className: `tl-call ${dir.cls}`,
        onClick: () => openCall(env, call),
      });
    })));
    env.phone.scan(list);
  };
  append(slot, [
    kit.chips({ active: filter, items: [{ id: 'all', label: 'Todas' }, { id: 'missed', label: 'Perdidas' }, { id: 'out', label: 'Realizadas' }, { id: 'in', label: 'Recebidas' }, { id: 'blocked', label: 'Bloqueadas' }], onChange: (id) => { filter = id; draw(); } }),
    list,
  ]);
  draw();
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
        ['Via', call.via === 'papo' ? 'Papo (chamada pela internet)' : 'Telefone (operadora Litoral Móvel)'],
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
          actionBtn('phone', 'Ligar', () => phone.toast('Ligações indisponíveis no espelho', { icon: 'phone' })),
          actionBtn('message-circle', 'Mensagem', target ? () => phone.open(target.app, target.params) : () => phone.toast('Sem conversa com este número', { icon: 'message-circle' }), !target),
          party.c ? actionBtn('contact', 'Contato', () => openContact(env, party.c)) : null),
        kit.kv(rows),
        h('div', { class: 'td-pin' }, kit.pinButton({ key: 'telefone:call:' + call.id, label: `${dir.long}: ${party.name}${call.duration ? ' (' + longDur(call.duration) + ')' : ''}`, app: 'telefone', detail: `${when(call.at)}${call.via === 'papo' ? ' · Papo' : ''}` })),
      ]);
    },
  });
}

function actionBtn(ic, label, onClick, off = false) {
  return h('button', { class: `td-act${off ? ' off' : ''}`, on: { click: onClick } }, h('span', { class: 'c' }, icon(ic, { size: 22 })), h('span', null, label));
}

/* ---------- Contatos ---------- */
function renderContacts(env, slot) {
  const { kit, game } = env;
  const contacts = allContacts().filter((c) => c.id !== 'iara' && game.req(c)).sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'pt-BR'));
  const mine = store.contact('iara');
  let query = '';
  const body = h('div', { class: 'tc-list' });

  const row = (c) => kit.listItem({
    avatar: contactAvatar(env, c, 44),
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
      body.append(kit.list(hits.map(row)));
      env.phone.scan(body);
      return;
    }
    if (mine) {
      body.append(h('button', { class: 'tc-me', on: { click: () => openContact(env, mine, { me: true }) } },
        contactAvatar(env, mine, 48),
        h('span', { class: 'who' }, h('small', null, 'Meu cartão'), h('b', { class: 'txt' }, mine.fullName || mine.name), h('span', { class: 'txt' }, mine.phones?.[0] ? national(mine.phones[0]) : '')),
        icon('chevron-right', { size: 20 })));
    }
    const favs = contacts.filter((c) => c.favorite);
    if (favs.length) {
      body.append(kit.sectionTitle('Favoritos'), h('div', { class: 'tc-favs' }, favs.map((c) => h('button', { class: 'fav', on: { click: () => openContact(env, c) } }, contactAvatar(env, c, 56), h('span', { class: 'txt' }, c.name.split(' ')[0])))));
    }
    const groups = new Map();
    for (const c of contacts) { const l = letterOf(c); if (!groups.has(l)) groups.set(l, []); groups.get(l).push(c); }
    for (const [l, cs] of groups) body.append(h('div', { class: 'tc-letter' }, l), kit.list(cs.map(row)));
    body.append(h('p', { class: 'tc-count' }, `${contacts.length} contatos`));
    env.phone.scan(body);
  };

  append(slot, [kit.search({ placeholder: 'Pesquisar contatos', onInput: (v) => { query = v; draw(); } }), body]);
  draw();
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
          actionBtn('phone', 'Ligar', () => phone.toast('Ligações indisponíveis no espelho', { icon: 'phone' }))),
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

/* ---------- contrato ---------- */
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
    if (!['recentes', 'contatos', 'caixa'].includes(tab)) tab = 'recentes';
    const unseenCount = () => voicemail.filter((v) => !isSeen('telefone:voicemail:' + v.id)).length;

    const slot = h('div', { class: 'tel-slot' });
    const draw = (id, focus) => {
      clear(slot);
      if (id === 'contatos') renderContacts(env, slot);
      else if (id === 'caixa') renderVoicemail(env, slot, voicemail, focus, refreshBadge);
      else renderRecents(env, slot, calls);
    };
    // o badge da caixa postal acompanha as mensagens ainda não ouvidas (lido a cada redesenho das abas)
    const tabsEl = kit.tabs({
      active: tab,
      items: [{ id: 'recentes', label: 'Recentes' }, { id: 'contatos', label: 'Contatos' }, { id: 'caixa', label: 'Caixa postal', get badge() { return unseenCount(); } }],
      onChange: (id) => { tab = id; state.apps.telefone = { ...(state.apps.telefone || {}), tab: id }; save(); draw(id); },
    });
    function refreshBadge() {
      const t = tabsEl.querySelectorAll('.k-tab')[2];
      if (!t) return;
      const n = unseenCount();
      t.querySelector('.k-badge')?.remove();
      if (n) t.append(kit.badge(n));
    }
    append(el, [
      kit.appBar({ title: 'Telefone', subtitle: h('span', { class: 'no-terms' }, `Registro do aparelho · ${time.weekday(MIRROR)} ${time.hhmm(MIRROR)}`) }),
      tabsEl,
      slot,
    ]);
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
