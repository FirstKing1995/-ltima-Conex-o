// Instagram — a rede social de Iara. App na nuvem (cloud:true): mostra os dados até terça.
// Visual do Instagram para Android (modo escuro). Prefixo de classes: lm-.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import { bus } from '../core/bus.js';
import { isSeen } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { asset } from '../core/store.js';
import { normalize } from '../core/hash.js';
import * as time from '../core/time.js';

const TABS = [['home', 'Início'], ['search', 'Pesquisar'], ['create', 'Criar'], ['reels', 'Reels'], ['me', 'Perfil']];
const STORY_MS = 6000;
const LIVE_STEP = 2; // 1 s real = 20 s de vídeo (tique de 100 ms)

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const snippet = (s, n = 60) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };
const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

function fmtCount(n) {
  n = Number(n) || 0;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  if (n >= 1e4) return `${(n / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`;
  return n.toLocaleString('pt-BR');
}

/** "23:38:12" | "23:38" | "2026-10-10T23:38" → segundos desde 00:00 */
function clockSec(v) {
  if (v === undefined || v === null) return 0;
  const m = String(v).match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/);
  return m ? +m[1] * 3600 + +m[2] * 60 + +(m[3] || 0) : 0;
}
const pad2 = (n) => String(n).padStart(2, '0');
const fmtClock = (sec) => `${pad2(Math.floor(sec / 3600) % 24)}:${pad2(Math.floor((sec % 3600) / 60))}:${pad2(Math.floor(sec % 60))}`;

/* ---------- ícones no traço do Instagram (SVG inline, sem assets) ---------- */
const P = {
  home: '<path d="M3.5 10.2 12 3l8.5 7.2V20a1 1 0 0 1-1 1H15v-6.2H9V21H4.5a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  create: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7.5v9M7.5 12h9"/>',
  reels: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.2h18M9.2 3l3 5.2M15.2 3l3 5.2"/><path d="M10.2 11.4v5.4l4.6-2.7z" fill="currentColor" stroke-width="1.2"/>',
  heart: '<path d="M12 20.3s-8.6-5-8.6-11.1A4.9 4.9 0 0 1 12 6.4a4.9 4.9 0 0 1 8.6 2.8c0 6.1-8.6 11.1-8.6 11.1z"/>',
  comment: '<path d="M19.95 16.2A9 9 0 1 0 17.16 19.37L21.5 21.5z"/>',
  send: '<path d="M21.5 2.5 2.5 9.3l7.6 3.9 3.8 8.3z"/><path d="m10.1 13.2 11.4-10.7"/>',
  bookmark: '<path d="M19 21l-7-5.6L5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1z"/>',
  messenger: '<path d="M12 2.8c-5.2 0-9.2 3.8-9.2 8.8 0 2.6 1.1 4.9 2.9 6.5v3.1l2.9-1.6c1.1.3 2.2.5 3.4.5 5.2 0 9.2-3.8 9.2-8.5S17.2 2.8 12 2.8z"/><path d="m7.2 13.9 3.1-3.4 2.8 2.2 3.7-3.5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  tagged: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="10" r="3"/><path d="M6.6 20.6a6 6 0 0 1 10.8 0"/>',
  carousel: '<rect x="7" y="3" width="14" height="14" rx="2.5" fill="currentColor"/><path d="M17 21H5a2 2 0 0 1-2-2V7"/>',
  threads: '<path d="M16.6 11.2c-.5-2.6-2.4-3.9-4.8-3.9-2 0-3.5.9-4.3 2.4M7.2 15.6c.8 2.4 2.7 4.4 5.3 4.4 4 0 7-2.7 7-7.6 0-5-3-8.4-7.6-8.4C7.4 4 4.5 7.5 4.5 12c0 1 .1 1.9.4 2.7"/><path d="M15.9 12.3c-2.8-.8-6.4-.4-6.4 1.9 0 2.4 4.3 2.6 5.6.6.6-.9.9-2 .8-3.3"/>',
};
function svg(name, { size = 24, filled = false, sw = 1.9, cls = '' } = {}) {
  return h('span', { class: `lm-svg ${cls}`, 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P[name] || ''}</svg>` });
}

const VERIFIED_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M12 1.8l2.6 1.9 3.2-.2 1.1 3 2.8 1.6-.9 3.1.9 3.1-2.8 1.6-1.1 3-3.2-.2L12 22.2l-2.6-1.9-3.2.2-1.1-3-2.8-1.6.9-3.1-.9-3.1 2.8-1.6 1.1-3 3.2.2z" fill="currentColor"/><path d="M8.2 12.3l2.5 2.5 5-5.2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const verifiedBadge = () => h('span', { class: 'lm-verified', title: 'Conta verificada', role: 'img', 'aria-label': 'verificado', html: VERIFIED_SVG });

/* ---------- posts e stories sem imagem: degradê suave com o texto ---------- */
const GRADS = [
  ['#3a1c71', '#d76d77', '#ffaf7b'], ['#4568dc', '#b06ab3'], ['#0f2027', '#2c5364'], ['#614385', '#516395'],
  ['#1d4350', '#a43931'], ['#41295a', '#2f0743'], ['#c94b4b', '#4b134f'], ['#134e5e', '#71b280'],
  ['#5f2c82', '#49a09d'], ['#e96443', '#904e95'], ['#2b5876', '#4e4376'], ['#232526', '#414345'],
];
function hashStr(s) { let n = 0; for (const c of String(s)) n = (n * 31 + c.charCodeAt(0)) >>> 0; return n; }
const gradFor = (seed) => `linear-gradient(150deg, ${GRADS[hashStr(seed) % GRADS.length].join(', ')})`;
const stripTags = (s) => String(s || '').replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s{2,}/g, ' ').trim();
function textTile(text, seed, { ratio, mini = false } = {}) {
  const t = stripTags(text);
  const sz = t.length <= 60 ? 'l' : t.length <= 140 ? 'm' : 's';
  return h('div', { class: `lm-textpost sz-${sz}${mini ? ' mini' : ''}`, style: { background: gradFor(seed), aspectRatio: ratio || undefined } },
    h('p', null, t));
}
const isEmojiOnly = (s) => { const t = String(s || '').trim(); return !!t && t.length <= 12 && /^(?:\p{Extended_Pictographic}|‍|️|\s)+$/u.test(t); };

export default {
  id: 'lume',
  title: 'Instagram',
  cloud: true,

  render(ctx) {
    const L = createLume(ctx);
    L.mount();
    L.handleParams();
  },

  search({ data, game }) {
    const out = [];
    for (const p of data.profiles || []) {
      if (!p.bio) continue;
      out.push({ title: `@${p.handle}${p.name ? ' · ' + p.name : ''}`, text: p.bio, params: { profile: p.handle } });
    }
    for (const post of data.posts || []) {
      if (!game.req(post)) continue;
      if (post.caption) out.push({ title: `@${post.author} · ${post.kind === 'live' ? 'transmissão ao vivo' : 'publicação'}`, text: post.caption, params: { post: post.id }, at: post.at });
      for (const c of post.comments || []) out.push({ title: `@${c.author} comentou em @${post.author}`, text: c.text, params: { post: post.id }, at: c.at });
      if (post.kind === 'live' && post.live) {
        for (const t of post.live.transcript || []) out.push({ title: `Live · ${post.live.title || 'Noite da Colheita'} · ${t.t}`, text: `${t.who ? t.who + ': ' : ''}${t.text}`, params: { post: post.id } });
        for (const c of post.live.comments || []) out.push({ title: `Live · comentário de @${c.author} · ${c.t}`, text: c.text, params: { post: post.id } });
      }
    }
    return out;
  },
};

function createLume(ctx) {
  const { el, kit, phone, game, data, params, now } = ctx;
  const me = data.me || 'iarafontenele.foto';
  const profiles = data.profiles || [];
  const prof = (hd) => profiles.find((p) => p.handle === hd) || null;
  const nameOf = (hd) => prof(hd)?.name || hd;

  /* ---------- conteúdo visível ---------- */
  const posts = () => (data.posts || []).filter((p) => game.req(p)).sort((a, b) => time.compare(b.at, a.at));
  const postById = (id) => posts().find((p) => p.id === id) || null;
  const storyById = (id) => (data.stories || []).find((s) => s.id === id) || null;
  const framesOf = (hl) => arr(hl.stories).map(storyById).filter((s) => s && game.req(s));
  const highlights = () => (data.highlights || []).filter((x) => game.req(x) && framesOf(x).length);
  const highlightById = (id) => highlights().find((x) => x.id === id) || null;
  const postsOf = (hd) => posts().filter((p) => p.author === hd);
  const dms = () => (data.dms || []).filter((d) => game.req(d));
  const see = (key, item) => { game.see(key); if (item?.onSee?.length) game.flags(item.onSee); };
  const readonly = () => phone.toast('A extração é somente leitura', { icon: 'eye' });

  /* ---------- tempo ---------- */
  const minsAgo = (at) => Math.floor((time.parse(now) - time.parse(at)) / 60000);
  function agoShort(at) {
    const m = minsAgo(at);
    if (m < 1) return 'agora';
    if (m < 60) return `${m} min`;
    if (m < 1440) return `${Math.floor(m / 60)} h`;
    const d = Math.floor(m / 1440);
    if (d < 7) return `${d} d`;
    if (d < 35) return `${Math.floor(d / 7)} sem`;
    return time.dateShort(at);
  }
  function agoLong(at) {
    const m = minsAgo(at);
    if (m < 1) return 'agora mesmo';
    if (m < 60) return `há ${plural(m, 'minuto', 'minutos')}`;
    if (m < 1440) return `há ${plural(Math.floor(m / 60), 'hora', 'horas')}`;
    const d = Math.floor(m / 1440);
    if (d < 7) return `há ${plural(d, 'dia', 'dias')}`;
    if (d < 35) return `há ${plural(Math.floor(d / 7), 'semana', 'semanas')}`;
    return longDate(at);
  }
  function longDate(at) {
    const d = time.parse(at);
    const base = `${d.getDate()} de ${time.monthName(d.getMonth())}`;
    return d.getFullYear() === time.parse(now).getFullYear() ? base : `${base} de ${d.getFullYear()}`;
  }
  const shortDate = (at) => { const d = time.parse(at); return `${d.getDate()} de ${time.monthShort(d.getMonth())}. de ${d.getFullYear()}`; };
  const stampDate = (at) => { const d = time.parse(at); return `${d.getDate()} ${time.monthShort(d.getMonth())} ${time.hhmm(at)}`; };
  /** início da transmissão como data completa, mesmo se o dado trouxer só o relógio ("23:30:00") */
  const liveStart = (post) => {
    const v = post.live?.start;
    if (!v) return post.at;
    if (/^\d{4}-\d{2}-\d{2}/.test(String(v))) return v;
    return `${String(post.at).slice(0, 10)}T${String(v).slice(0, 5)}`;
  };

  /* ---------- peças ---------- */
  function avatar(hd, size = 40) {
    const p = prof(hd);
    // perfil sem foto: a silhueta cinza padrão do Instagram
    if (p?.fake && !p.avatar) return kit.avatar({ name: p.name || hd, size, icon: 'user-round', color: '#3a3a3a' });
    return kit.avatar({ src: p?.avatar || '', name: p?.name || hd, size });
  }
  const hlSeen = (id) => isSeen('lume:highlight:' + id);
  function ringed(content, hlId) {
    return h('span', { class: `lm-ring${hlId && hlSeen(hlId) ? ' seen' : ''}`, dataset: hlId ? { hl: hlId } : null }, h('span', { class: 'lm-ring-in' }, content));
  }
  const placeName = (post) => (typeof post.place === 'string' ? post.place : post.place?.name || post.location || '');
  const commentCount = (post) => post.commentsCount ?? (post.comments || []).length;
  const handleEl = (hd, cls = '') => h('b', { class: `lm-hd ${cls}` }, hd, prof(hd)?.verified ? verifiedBadge() : null);

  /** #hashtags e @menções viram trechos coloridos; as menções abrem o perfil. */
  function rich(text) {
    const s = String(text ?? '');
    const out = [];
    let i = 0;
    for (const m of s.matchAll(/[#@][\p{L}\p{N}_]+(?:\.[\p{L}\p{N}_]+)*/gu)) {
      if (m.index > i) out.push(s.slice(i, m.index));
      const tok = m[0];
      const hd = tok.slice(1);
      if (tok[0] === '@' && prof(hd)) {
        out.push(h('span', { class: 'lm-link', role: 'link', tabindex: '0', on: { click: (e) => { e.stopPropagation(); openProfile(hd); }, keydown: (e) => { if (e.key === 'Enter') openProfile(hd); } } }, tok));
      } else out.push(h('span', { class: 'lm-tag' }, tok));
      i = m.index + tok.length;
    }
    if (i < s.length) out.push(s.slice(i));
    return out;
  }

  const pinDraws = new Set();
  const offPin = bus.on('pin', () => {
    if (!el.isConnected) { offPin(); pinDraws.clear(); return; }
    for (const d of [...pinDraws]) { if (!d.btn.isConnected) pinDraws.delete(d); else d.draw(); }
  });
  /** Botão compacto "Fixar no Quadro" (do jogo, em dourado). */
  function pinToggle({ key, label, detail }) {
    const btn = h('button', { class: 'lm-pin', 'aria-label': 'Fixar no Quadro', title: 'Fixar no Quadro' });
    const draw = () => {
      const on = game.isPinned(key);
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', String(on));
      clear(btn).append(icon(on ? 'check' : 'pin', { size: 16 }));
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (game.isPinned(key)) game.unpin(key);
      else { game.pin({ key, label, app: 'lume', detail }); sfx.play('pin'); phone.toast('Fixado no Quadro', { icon: 'pin', ms: 1400 }); }
      draw();
    });
    draw();
    pinDraws.add({ btn, draw });
    return btn;
  }

  function postPin(post) {
    return { label: `@${post.author}`, detail: `${shortDate(post.at)}${post.caption ? ' · ' + snippet(post.caption, 70) : ''}` };
  }

  /* ---------- mídia ---------- */
  function openViewer(post, index = 0) {
    const imgs = arr(post.media).filter(Boolean);
    if (!imgs.length) return;
    const pm = postPin(post);
    const rows = [
      ['Autor', '@' + post.author],
      ['Publicado em', `${shortDate(post.at)} às ${time.hhmm(post.at)}`],
      placeName(post) ? ['Local', placeName(post)] : null,
      post.likes != null ? ['Curtidas', fmtCount(post.likes)] : null,
      ['Comentários', String(commentCount(post))],
    ].filter(Boolean);
    kit.imageViewer(imgs.map((src) => ({ src, title: pm.label, subtitle: pm.detail, desc: post.caption || '', info: rows, key: 'lume:post:' + post.id })), index);
    see('lume:post:' + post.id, post);
  }

  /** Mídia do post. Devolve { el, dots } — os pontinhos do carrossel ficam na fileira de ações, como no app. */
  function mediaBlock(post, ratio = '1/1') {
    const imgs = arr(post.media).filter(Boolean);
    if (!imgs.length) {
      const r = !ratio || ratio === '4/3' ? '1/1' : ratio;
      return { el: h('div', { class: 'lm-media lm-media-text' }, textTile(post.caption, post.id, { ratio: r })), dots: null };
    }
    const slide = (src, i) => h('button', { class: 'lm-mediabtn', 'aria-label': imgs.length > 1 ? `Ampliar foto ${i + 1} de ${imgs.length}` : 'Ampliar foto', on: { click: () => openViewer(post, i) } },
      kit.img(src, { alt: `Foto publicada por @${post.author}`, ratio }));
    if (imgs.length === 1) return { el: h('div', { class: 'lm-media' }, slide(imgs[0], 0)), dots: null };
    const track = h('div', { class: 'lm-track' }, imgs.map((src, i) => h('div', { class: 'lm-slide' }, slide(src, i))));
    const dots = h('div', { class: 'lm-dots', 'aria-hidden': 'true' }, imgs.map((_, i) => h('i', { class: i === 0 ? 'on' : '' })));
    const count = h('span', { class: 'lm-count' }, `1/${imgs.length}`);
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
      count.textContent = `${i + 1}/${imgs.length}`;
    }, { passive: true });
    return { el: h('div', { class: 'lm-media lm-carousel' }, track, count), dots };
  }

  /* ---------- posts ---------- */
  function postMenu(post) {
    return (e) => kit.menu(e.currentTarget, [
      { label: 'Ver perfil', icon: 'user-round', onClick: () => openProfile(post.author) },
      { label: post.kind === 'live' ? 'Assistir à live' : 'Ver comentários', icon: post.kind === 'live' ? 'play' : 'message-circle', onClick: () => (post.kind === 'live' ? openLive(post) : openComments(post)) },
      { label: 'Copiar link', icon: 'link', onClick: () => phone.toast('Link copiado', { icon: 'check' }) },
    ]);
  }

  function postHead(post) {
    const place = placeName(post);
    return h('header', { class: 'lm-post-head' },
      h('button', { class: 'lm-who', 'aria-label': `Abrir o perfil de ${post.author}`, on: { click: () => openProfile(post.author) } },
        avatar(post.author, 32),
        h('span', { class: 'lm-who-t' },
          handleEl(post.author),
          place ? h('small', null, place) : null)),
      h('button', { class: 'lm-dots-btn', 'aria-label': 'Mais opções', on: { click: postMenu(post) } }, icon('ellipsis-vertical', { size: 20 })));
  }

  function actionRow(post, { onComment, pin, dots }) {
    const n = commentCount(post);
    return h('div', { class: 'lm-acts' },
      h('button', { class: 'lm-act', 'aria-label': `Curtir. ${fmtCount(post.likes)} curtidas`, on: { click: readonly } }, svg('heart', { size: 25 })),
      h('button', { class: 'lm-act', 'aria-label': `Comentar. ${n} comentários`, on: { click: onComment } }, svg('comment', { size: 24 })),
      h('button', { class: 'lm-act', 'aria-label': 'Compartilhar', on: { click: readonly } }, svg('send', { size: 23 })),
      dots || null,
      h('span', { class: 'lm-sp' }),
      pin || null,
      h('button', { class: 'lm-act', 'aria-label': 'Salvar', on: { click: readonly } }, svg('bookmark', { size: 24 })));
  }

  function likesLine(post) {
    if (post.likes == null) return null;
    const n = Number(post.likes) || 0;
    return h('div', { class: 'lm-likes' }, n ? ['Curtido por ', h('b', null, `${fmtCount(n)} ${n === 1 ? 'pessoa' : 'pessoas'}`)] : 'Seja o primeiro a curtir');
  }

  function captionEl(post, { clamp = false } = {}) {
    if (!post.caption) return null;
    const long = clamp && String(post.caption).length > 150;
    const p = h('p', { class: `lm-cap txt${long ? ' clamp' : ''}` },
      h('b', { class: 'lm-handle', on: { click: () => openProfile(post.author) } }, post.author), prof(post.author)?.verified ? verifiedBadge() : null, ' ', rich(post.caption));
    if (!long) return p;
    const more = h('button', { class: 'lm-capmore', on: { click: (e) => { e.stopPropagation(); p.classList.remove('clamp'); more.remove(); } } }, 'mais');
    return h('div', { class: 'lm-capwrap' }, p, more);
  }

  function postCard(post, { detail = false } = {}) {
    if (post.kind === 'live') return liveCard(post, { detail });
    const n = commentCount(post);
    const pm = postPin(post);
    const media = mediaBlock(post, post.ratio);
    return h('article', { class: 'lm-post', dataset: { id: post.id } },
      postHead(post),
      media.el,
      actionRow(post, { onComment: () => openComments(post), dots: media.dots, pin: pinToggle({ key: 'lume:post:' + post.id, label: pm.label, detail: pm.detail }) }),
      likesLine(post),
      captionEl(post, { clamp: !detail }),
      detail ? null : (n ? h('button', { class: 'lm-more', on: { click: () => openComments(post) } }, n === 1 ? 'Ver 1 comentário' : `Ver todos os ${fmtCount(n)} comentários`) : null),
      h('time', { class: 'lm-when' }, agoLong(post.at)));
  }

  function liveSpan(post) {
    const live = post.live || {};
    const a = clockSec(live.start), b = clockSec(live.end);
    return Math.max(0, b - a);
  }

  const liveBadge = (txt = 'AO VIVO') => h('span', { class: 'lm-live-badge' }, txt);

  function liveCard(post, { detail = false } = {}) {
    const live = post.live || {};
    const frame = arr(live.media)[0] || arr(post.media)[0] || '';
    const mins = Math.max(1, Math.round(liveSpan(post) / 60));
    const p = prof(post.author);
    const n = commentCount(post) || (live.comments || []).length;
    return h('article', { class: 'lm-post lm-live', dataset: { id: post.id } },
      postHead(post),
      h('button', { class: 'lm-live-frame', 'aria-label': `Assistir à transmissão gravada de ${p?.name || post.author}`, on: { click: () => openLive(post) } },
        kit.img(frame, { alt: 'Frame da transmissão ao vivo', ratio: '4/5' }),
        h('span', { class: 'lm-live-shade' }),
        h('span', { class: 'lm-live-tl' }, liveBadge(), h('span', { class: 'lm-live-rec' }, 'gravada')),
        h('span', { class: 'lm-live-dur' }, icon('clock', { size: 12 }), `${mins} min`),
        h('span', { class: 'lm-live-play' }, icon('play', { size: 28 })),
        h('span', { class: 'lm-live-cta' }, 'Assistir à transmissão')),
      actionRow(post, { onComment: () => openLive(post) }),
      likesLine(post),
      captionEl(post, { clamp: !detail }),
      detail ? null : (n ? h('button', { class: 'lm-more', on: { click: () => openLive(post) } }, `Ver os ${plural(n, 'comentário', 'comentários')} da transmissão`) : null),
      h('time', { class: 'lm-when' }, `${stampDate(liveStart(post))} · ${agoLong(post.at)}`));
  }

  /* ---------- comentários ---------- */
  function commentRow(post, c, i) {
    const key = `lume:comment:${post.id}:${c.id ?? i}`;
    return h('div', { class: 'lm-comment' },
      h('button', { class: 'lm-c-av', 'aria-label': `Abrir o perfil de ${c.author}`, on: { click: () => openProfile(c.author) } }, avatar(c.author, 34)),
      h('div', { class: 'lm-c-body' },
        h('div', { class: 'lm-c-line' },
          h('b', { class: 'lm-c-who', on: { click: () => openProfile(c.author) } }, c.author, prof(c.author)?.verified ? verifiedBadge() : null),
          h('span', { class: 'lm-c-ago' }, c.at ? agoShort(c.at) : '')),
        h('p', { class: 'lm-c-tx txt' }, rich(c.text)),
        h('div', { class: 'lm-c-meta' }, h('button', { on: { click: readonly } }, 'Responder'))),
      h('div', { class: 'lm-c-side' },
        pinToggle({ key, label: `@${c.author}: ${snippet(c.text, 100)}`, detail: `Comentário no post de @${post.author} · ${c.at ? longDate(c.at) : ''}` }),
        h('button', { class: 'lm-c-like', 'aria-label': `${fmtCount(c.likes || 0)} curtidas`, on: { click: readonly } }, svg('heart', { size: 15, sw: 2 }), c.likes ? h('span', null, fmtCount(c.likes)) : null)));
  }

  function commentsList(post) {
    const list = [...(post.comments || [])].filter((c) => game.req(c)).sort((a, b) => time.compare(a.at, b.at));
    return list.length ? h('div', { class: 'lm-comments' }, list.map((c, i) => commentRow(post, c, i)))
      : kit.empty({ icon: 'message-circle', title: 'Ainda não há comentários', text: 'Inicie a conversa.' });
  }

  const composer = (txt = 'Adicione um comentário…') => h('div', { class: 'lm-composer', role: 'button', tabindex: '0', 'aria-label': 'Somente leitura', on: { click: readonly } },
    avatar(me, 34), h('span', null, txt), icon('lock', { size: 16 }));

  function openComments(post) {
    see('lume:post:' + post.id, post);
    phone.push({
      className: 'lm-sub',
      render(body) {
        const cap1 = post.caption ? h('div', { class: 'lm-comment lm-c-cap' },
          h('button', { class: 'lm-c-av', 'aria-label': `Abrir o perfil de ${post.author}`, on: { click: () => openProfile(post.author) } }, avatar(post.author, 34)),
          h('div', { class: 'lm-c-body' },
            h('div', { class: 'lm-c-line' }, h('b', { class: 'lm-c-who', on: { click: () => openProfile(post.author) } }, post.author, prof(post.author)?.verified ? verifiedBadge() : null), h('span', { class: 'lm-c-ago' }, agoShort(post.at))),
            h('p', { class: 'lm-c-tx txt' }, rich(post.caption)))) : null;
        body.append(kit.appBar({ title: 'Comentários', subtitle: `${post.author} · ${plural(commentCount(post), 'comentário', 'comentários')}` }),
          h('div', { class: 'lm-cwrap' }, cap1, cap1 ? h('div', { class: 'lm-sep' }) : null, commentsList(post)),
          composer(`Adicione um comentário para ${post.author}…`));
      },
    });
  }

  function openPost(post) {
    if (post.kind === 'live') return openLive(post);
    see('lume:post:' + post.id, post);
    phone.push({
      className: 'lm-sub',
      render(body) {
        body.append(kit.appBar({ title: 'Publicações', subtitle: post.author }),
          h('div', { class: 'lm-detail' }, postCard(post, { detail: true }),
            kit.sectionTitle(`Comentários · ${commentCount(post)}`), commentsList(post)),
          composer(`Adicione um comentário para ${post.author}…`));
      },
    });
  }

  /* ---------- transmissão ao vivo (gravada) ---------- */
  function openLive(post) {
    see('lume:post:' + post.id, post);
    const live = post.live || {};
    const frame = arr(live.media)[0] || arr(post.media)[0] || '';
    const title = live.title || 'Noite da Colheita';
    const rows = [
      ...(live.transcript || []).map((x) => ({ kind: 'tr', sfx: x.kind === 'sfx', t: clockSec(x.t), raw: x.t, who: x.who, text: x.text, key: 'lume:live:' + x.t })),
      ...(live.comments || []).map((x, i) => ({ kind: 'cm', t: clockSec(x.t), raw: x.t, author: x.author, text: x.text, key: `lume:live:${x.t}:c${i}` })),
    ].sort((a, b) => a.t - b.t || (a.kind === 'tr' ? -1 : 1));
    const startSec = live.start ? clockSec(live.start) : (rows[0]?.t ?? 0);
    const endSec = Math.max(startSec + 1, live.end ? clockSec(live.end) : (rows[rows.length - 1]?.t ?? startSec) + 60);
    const total = endSec - startSec;

    phone.push({
      className: 'lm-sub lm-livescreen',
      render(body) {
        let cur = startSec, playing = false, timer = null, lastIdx = -2, dragging = false;

        const clockEl = h('span', { class: 'lm-vid-clock no-terms' }, fmtClock(cur));
        const bigPlay = h('button', { class: 'lm-vid-play', 'aria-label': 'Reproduzir', on: { click: () => toggle() } }, icon('play', { size: 32 }));
        const vid = h('div', { class: 'lm-vid' },
          kit.img(frame, { alt: 'Frame da transmissão ao vivo', ratio: undefined }),
          h('span', { class: 'lm-vid-shade' }),
          h('span', { class: 'lm-vid-tl' }, liveBadge(), h('span', { class: 'lm-live-rec' }, 'gravada')),
          clockEl, bigPlay);

        const fill = h('i', { class: 'lm-fill' });
        const knob = h('b', { class: 'lm-knob' });
        const scrub = h('div', { class: 'lm-scrub', role: 'slider', tabindex: '0', 'aria-label': 'Posição da transmissão', 'aria-valuemin': String(startSec), 'aria-valuemax': String(endSec) }, fill, knob);
        const pp = h('button', { class: 'lm-pp', 'aria-label': 'Reproduzir', on: { click: () => toggle() } }, icon('play', { size: 20 }));
        const endEl = h('span', { class: 'lm-ctl-t no-terms' }, fmtClock(endSec));
        const ctl = h('div', { class: 'lm-ctl' }, pp, h('div', { class: 'lm-scrubwrap' }, scrub, h('div', { class: 'lm-ctl-row' }, h('span', { class: 'lm-ctl-t no-terms' }, fmtClock(startSec)), endEl)), h('span', { class: 'lm-speed', title: '1 segundo = 20 segundos de vídeo' }, '20×'));

        const tl = h('div', { class: 'lm-tl', role: 'list', 'aria-label': 'Transcrição e comentários' });
        const rowEls = rows.map((r) => {
          const common = { role: 'listitem', tabindex: '0', on: { click: (e) => { if (e.target.closest('.lm-pin')) return; seek(r.t); }, keydown: (e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); seek(r.t); } } } };
          if (r.kind === 'tr') {
            return h('div', { ...common, class: `lm-lrow tr${r.sfx ? ' sfx' : ''}` },
              h('span', { class: 'lm-lt' }, r.raw),
              h('div', { class: 'lm-lbody' },
                r.sfx ? h('b', { class: 'lm-lwho sfx' }, icon('video', { size: 12 }), 'Na imagem') : r.who ? h('b', { class: 'lm-lwho' }, r.who) : null,
                h('p', { class: 'txt' }, r.text)),
              pinToggle({ key: r.key, label: `${r.who ? r.who + ': ' : ''}“${snippet(r.text, 110)}”`, detail: `Transmissão “${title}” · ${r.raw}` }));
          }
          return h('div', { ...common, class: 'lm-lrow cm' },
            h('span', { class: 'lm-lt' }, r.raw),
            h('div', { class: 'lm-lbody' },
              h('div', { class: 'lm-lcm' }, avatar(r.author, 24),
                h('p', { class: 'txt' }, h('b', { class: 'lm-lcm-who' }, r.author), ' ', rich(r.text)))),
            pinToggle({ key: r.key, label: `@${r.author}: ${snippet(r.text, 110)}`, detail: `Comentário na transmissão “${title}” · ${r.raw}` }));
        });
        tl.append(...rowEls);
        if (!rows.length) tl.append(kit.empty({ icon: 'audio-lines', title: 'Sem transcrição', text: 'Esta transmissão não tem texto salvo.' }));

        function currentIdx() { let k = -1; for (let i = 0; i < rows.length; i++) { if (rows[i].t <= cur) k = i; else break; } return k; }
        function render(scroll) {
          const f = (cur - startSec) / total;
          fill.style.width = (f * 100).toFixed(2) + '%';
          knob.style.left = (f * 100).toFixed(2) + '%';
          clockEl.textContent = fmtClock(cur);
          scrub.setAttribute('aria-valuenow', String(Math.round(cur)));
          scrub.setAttribute('aria-valuetext', fmtClock(cur));
          const k = currentIdx();
          if (k !== lastIdx) {
            rowEls.forEach((r, i) => r.classList.toggle('now', i === k));
            lastIdx = k;
            if ((playing || scroll) && k >= 0) {
              const r = rowEls[k];
              tl.scrollTo({ top: Math.max(0, r.offsetTop - (tl.clientHeight - r.offsetHeight) / 2), behavior: reduceMotion() ? 'auto' : 'smooth' });
            }
          }
        }
        function drawPP() {
          const nm = playing ? 'pause' : 'play';
          clear(pp).append(icon(nm, { size: 20 }));
          pp.setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');
          vid.classList.toggle('playing', playing);
        }
        function stop() { playing = false; clearInterval(timer); drawPP(); }
        function play() {
          if (cur >= endSec) cur = startSec;
          playing = true; drawPP();
          clearInterval(timer);
          timer = setInterval(() => {
            if (!vid.isConnected) { stop(); return; }
            cur = Math.min(endSec, cur + LIVE_STEP);
            render();
            if (cur >= endSec) stop();
          }, 100);
        }
        function toggle() { playing ? stop() : play(); }
        function seek(t) { cur = Math.max(startSec, Math.min(endSec, t)); render(true); }

        const seekPointer = (e) => { const r = scrub.getBoundingClientRect(); const f = Math.max(0, Math.min(1, (e.clientX - r.left) / Math.max(1, r.width))); cur = Math.round(startSec + f * total); render(true); };
        scrub.addEventListener('pointerdown', (e) => { dragging = true; try { scrub.setPointerCapture(e.pointerId); } catch (err) { /* ok */ } seekPointer(e); });
        scrub.addEventListener('pointermove', (e) => { if (dragging) seekPointer(e); });
        const endDrag = () => { dragging = false; };
        scrub.addEventListener('pointerup', endDrag); scrub.addEventListener('pointercancel', endDrag);
        scrub.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { cur = Math.min(endSec, cur + 10); render(true); } else if (e.key === 'ArrowLeft') { cur = Math.max(startSec, cur - 10); render(true); } });

        body.append(h('div', { class: 'lm-live-wrap' },
          kit.appBar({ title: [post.author, prof(post.author)?.verified ? verifiedBadge() : null], subtitle: `${title} · ${stampDate(liveStart(post))}`, avatar: avatar(post.author, 34) }),
          vid, ctl,
          h('div', { class: 'lm-tl-head' }, icon('message-circle', { size: 15 }), 'Transcrição e comentários', h('span', { class: 'lm-sp' }), h('small', null, 'toque para pular')),
          tl));
        render(false);
        drawPP();
      },
    });
  }

  /* ---------- stories e destaques (tela cheia) ---------- */
  function openHighlight(hl, start = 0) {
    const frames = framesOf(hl);
    if (!frames.length) return;
    see('lume:highlight:' + hl.id, hl);
    let i = Math.max(0, Math.min(start, frames.length - 1));
    let elapsed = 0, paused = false, timer = null, downAt = 0, token = 0;

    const bars = h('div', { class: 'lm-st-bars', 'aria-hidden': 'true' }, frames.map(() => h('i', null, h('b'))));
    const stageMedia = h('div', { class: 'lm-st-media' });
    const whoEl = h('div', { class: 'lm-st-who' });
    const repost = h('div', { class: 'lm-st-repost' });
    const textEl = h('div', { class: 'lm-st-text txt' });
    const mine = hl.author === me;
    const foot = h('div', { class: 'lm-st-foot', 'aria-hidden': 'true' },
      mine
        ? [h('span', { class: 'lm-st-act' }, icon('eye', { size: 18 }), 'Atividade'), h('span', { class: 'lm-sp' }), svg('send', { size: 24 })]
        : [h('span', { class: 'lm-st-reply' }, 'Enviar mensagem'), svg('heart', { size: 26 }), svg('send', { size: 24 })]);
    const stage = h('div', { class: 'lm-st-stage' });
    const top = h('div', { class: 'lm-st-top' },
      bars,
      h('div', { class: 'lm-st-bar' },
        h('button', { class: 'lm-st-author', 'aria-label': 'Abrir perfil', on: { click: () => { close(); openProfile(frames[i].author || hl.author); } } }, avatar(hl.author, 32), whoEl),
        h('span', { class: 'lm-sp' }),
        h('span', { class: 'lm-st-more', 'aria-hidden': 'true' }, icon('ellipsis-vertical', { size: 20 })),
        kit.iconButton({ icon: 'x', label: 'Fechar', className: 'lm-st-x', onClick: () => close() })));
    const root = h('div', { class: 'lm-stories', role: 'dialog', 'aria-label': `Destaque ${hl.title || ''}` },
      stageMedia, h('div', { class: 'lm-st-shade' }), stage, top, repost, textEl, foot);

    function close() {
      clearInterval(timer);
      document.removeEventListener('keydown', onKey);
      root.remove();
      phone._popModal?.(close);
    }
    function paint() {
      bars.childNodes.forEach((b, k) => { b.firstChild.style.width = (k < i ? 100 : k === i ? Math.min(100, (elapsed / STORY_MS) * 100) : 0) + '%'; });
    }
    function show() {
      const s = frames[i];
      const my = ++token;
      elapsed = 0;
      clear(stageMedia);
      stageMedia.className = 'lm-st-media';
      stageMedia.style.background = '';
      root.classList.remove('textmode');
      // story sem imagem: fundo em degradê e o texto no centro, como um story de texto
      const textMode = () => {
        if (my !== token) return;
        clear(stageMedia);
        stageMedia.classList.add('textbg');
        stageMedia.style.background = gradFor(s.id);
        root.classList.add('textmode');
      };
      const src = arr(s.media)[0] || '';
      if (src) {
        const url = asset(src);
        const im = h('img', { class: 'lm-st-img', alt: s.text ? snippet(s.text, 80) : 'Story', draggable: 'false' });
        im.addEventListener('error', textMode, { once: true });
        im.addEventListener('load', () => { if (my === token) stageMedia.classList.toggle('portrait', im.naturalWidth / Math.max(1, im.naturalHeight) < 0.8); }, { once: true });
        im.src = url;
        stageMedia.append(h('img', { class: 'lm-st-blur', alt: '', 'aria-hidden': 'true', src: url, draggable: 'false' }), im);
      } else textMode();
      clear(whoEl).append(
        h('span', { class: 'lm-st-l1' }, h('b', null, s.author || hl.author), h('span', { class: 'lm-st-time' }, stampDate(s.at))),
        hl.title ? h('span', { class: 'lm-st-l2' }, hl.title) : null);
      clear(repost);
      repost.hidden = !s.repostOf;
      if (s.repostOf) repost.append(icon('refresh-cw', { size: 14 }), h('span', null, `Repost de @${s.repostOf.author} · story original ${time.weekday(s.repostOf.at)} ${time.hhmm(s.repostOf.at)}`));
      clear(textEl);
      textEl.hidden = !s.text;
      if (s.text) textEl.append(...rich(s.text));
      paint();
    }
    const next = () => { if (i < frames.length - 1) { i++; show(); } else close(); };
    const prev = () => { if (elapsed > 1500 || i === 0) { elapsed = 0; paint(); } else { i--; show(); } };
    function onKey(e) {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') { e.preventDefault(); paused = !paused; root.classList.toggle('hold', paused); }
    }
    stage.addEventListener('pointerdown', () => { downAt = performance.now(); paused = true; root.classList.add('hold'); });
    const release = (e, cancelled) => {
      paused = false; root.classList.remove('hold');
      if (cancelled || performance.now() - downAt > 280) return;
      const r = stage.getBoundingClientRect();
      (e.clientX - r.left) < r.width * 0.32 ? prev() : next();
    };
    stage.addEventListener('pointerup', (e) => release(e, false));
    stage.addEventListener('pointercancel', (e) => release(e, true));
    stage.addEventListener('pointerleave', () => { if (paused) { paused = false; root.classList.remove('hold'); } });
    document.addEventListener('keydown', onKey);
    timer = setInterval(() => {
      if (!root.isConnected) { close(); return; }
      if (paused) return;
      elapsed += 60;
      paint();
      if (elapsed >= STORY_MS) next();
    }, 60);
    if (phone._mountModal) phone._mountModal(root, close); else phone.root.appendChild(root);
    show();
  }

  const offSeen = bus.on('seen', ({ key }) => {
    if (!el.isConnected) { offSeen(); return; }
    if (typeof key !== 'string') return;
    if (key.startsWith('lume:highlight:')) {
      const id = key.slice('lume:highlight:'.length);
      document.querySelectorAll(`.lm-ring[data-hl="${CSS.escape(id)}"]`).forEach((r) => r.classList.add('seen'));
    } else if (key.startsWith('lume:dm:')) {
      const id = key.slice('lume:dm:'.length);
      document.querySelectorAll(`.lm-dmrow[data-dm="${CSS.escape(id)}"]`).forEach((r) => { r.classList.remove('unread'); r.querySelector('.lm-dmdot')?.remove(); });
      refreshHeader?.();
    }
  });
  let refreshHeader = null;

  /* ---------- perfis ---------- */
  function statBox(n, label) { return h('div', { class: 'lm-stat' }, h('b', null, fmtCount(n)), h('span', null, label)); }

  function postTile(post, cls = '') {
    const imgs = arr(post.media).filter(Boolean);
    const multi = imgs.length > 1;
    return h('button', { class: `lm-pt ${cls}`, 'aria-label': `Abrir publicação de @${post.author}${post.caption ? ': ' + snippet(post.caption, 50) : ''}`, on: { click: () => openPost(post) } },
      imgs.length ? kit.img(imgs[0], { alt: snippet(post.caption, 60) }) : textTile(post.caption, post.id, { mini: true }),
      post.kind === 'live' ? h('span', { class: 'lm-pt-ic' }, svg('reels', { size: 18, sw: 2 })) : multi ? h('span', { class: 'lm-pt-ic' }, svg('carousel', { size: 18, sw: 2 })) : null);
  }

  function profileMenu(hd) {
    return (e) => kit.menu(e.currentTarget, [
      { label: 'Copiar link do perfil', icon: 'link', onClick: () => phone.toast('Link copiado', { icon: 'check' }) },
      hd !== me ? { label: 'Esqueci a senha', icon: 'key-round', onClick: () => openRecovery(hd) } : null,
      hd !== me ? { label: 'Denunciar', icon: 'triangle-alert', danger: true, onClick: readonly } : null,
    ]);
  }

  const igBtn = (label, { variant = 'gray', onClick = readonly, ic } = {}) =>
    h('button', { class: `lm-btn ${variant}`, on: { click: (e) => { sfx.play('tap'); onClick(e); } } }, label, ic ? icon(ic, { size: 16 }) : null);

  function profileBody(hd) {
    const p = prof(hd) || { handle: hd, name: hd, bio: '', followers: 0, following: 0 };
    const mine = postsOf(hd);
    const hls = highlights().filter((x) => x.author === hd);
    const dm = dms().find((d) => d.with === hd);
    const postsN = p.posts ?? mine.length;
    const isMe = hd === me;
    const priv = !!p.private && !isMe;
    const acts = isMe
      ? [igBtn('Editar perfil'), igBtn('Compartilhar perfil')]
      : [
        priv || p.fake ? igBtn('Seguir', { variant: 'blue' }) : igBtn('Seguindo', { ic: 'chevron-down' }),
        igBtn('Mensagem', { onClick: () => (dm ? openDM(dm) : phone.toast(`Nenhuma conversa com @${hd}`, { icon: 'messages-square' })) }),
      ];
    return h('div', { class: 'lm-prof' },
      h('div', { class: 'lm-prof-head' },
        h('div', { class: `lm-prof-av${p.fake ? ' fake' : ''}` }, avatar(hd, 84)),
        h('div', { class: 'lm-prof-right' },
          h('h2', null, p.name || hd, p.verified ? verifiedBadge() : null),
          h('div', { class: 'lm-stats' }, statBox(postsN, 'publicações'), statBox(p.followers, 'seguidores'), statBox(p.following, 'seguindo')))),
      h('div', { class: 'lm-prof-info' },
        p.fake ? h('small', { class: 'lm-prof-flag' }, icon('eye', { size: 13 }), 'Perfil sem foto e sem publicações') : null,
        p.bio ? h('p', { class: 'lm-bio txt' }, rich(p.bio)) : null,
        priv ? h('small', { class: 'lm-prof-flag' }, icon('lock', { size: 13 }), 'Conta privada') : null),
      h('div', { class: 'lm-prof-acts' }, acts),
      hls.length ? h('div', { class: 'lm-hls', role: 'list', 'aria-label': 'Destaques' }, hls.map((hl) => {
        const frames = framesOf(hl);
        const cover = hl.cover || arr(frames[0]?.media)[0] || '';
        return h('button', { class: 'lm-hl', role: 'listitem', 'aria-label': `Destaque ${hl.title}`, on: { click: () => openHighlight(hl) } },
          ringed(kit.avatar({ src: cover, name: hl.title, size: 60, color: gradFor(hl.id) }), hl.id),
          h('span', { class: 'lm-hl-t' }, hl.title));
      })) : null,
      priv
        ? h('div', { class: 'lm-private' }, h('span', null, icon('lock', { size: 26, stroke: 1.6 })), h('b', null, 'Esta conta é privada'), h('small', null, 'Siga esta conta para ver as fotos e os vídeos.'))
        : [
          h('div', { class: 'lm-ptabs', role: 'tablist', 'aria-label': 'Conteúdo do perfil' },
            h('span', { class: 'lm-ptab on', role: 'tab', 'aria-selected': 'true', 'aria-label': 'Publicações' }, svg('grid', { size: 22, sw: 1.8 })),
            h('span', { class: 'lm-ptab', role: 'tab', 'aria-selected': 'false', 'aria-label': 'Reels' }, svg('reels', { size: 22, sw: 1.8 })),
            h('span', { class: 'lm-ptab', role: 'tab', 'aria-selected': 'false', 'aria-label': 'Marcações' }, svg('tagged', { size: 22, sw: 1.8 }))),
          mine.length
            ? h('div', { class: 'lm-pgrid' }, mine.map((x) => postTile(x)))
            : h('div', { class: 'lm-noposts' }, h('span', null, icon('camera', { size: 30, stroke: 1.4 })), h('b', null, 'Ainda não há publicações'), h('small', null, p.fake ? 'Este perfil só observa.' : 'Quando houver fotos, elas aparecem aqui.')),
        ]);
  }

  function openProfile(hd) {
    if (!hd) return;
    see('lume:profile:' + hd, prof(hd));
    phone.push({
      className: 'lm-sub lm-profscreen',
      render(body) {
        body.append(kit.appBar({ title: [hd, prof(hd)?.private ? icon('lock', { size: 15, className: 'lm-tlock' }) : null], actions: [{ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: profileMenu(hd) }] }), profileBody(hd));
      },
    });
  }

  /* ---------- recuperar acesso ---------- */
  function openRecovery(prefill = '') {
    phone.push({
      className: 'lm-sub',
      render(body) {
        const input = h('input', { type: 'text', value: prefill, placeholder: 'Nome de usuário', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Nome de usuário' });
        const out = h('div', { class: 'lm-rec-out', 'aria-live': 'polite' });
        const go = () => {
          const hd = input.value.trim().replace(/^@/, '').toLowerCase();
          clear(out);
          const p = profiles.find((x) => x.handle.toLowerCase() === hd);
          if (!hd) { out.append(h('p', { class: 'lm-rec-err' }, 'Digite o nome de usuário da conta.')); return; }
          if (p?.recovery) {
            see('lume:recovery:' + p.handle, p);
            out.append(h('div', { class: 'lm-rec-card' },
              h('div', { class: 'lm-rec-who' }, avatar(p.handle, 40), h('span', null, h('b', null, p.handle), h('small', null, 'Conta do Instagram'))),
              h('h3', null, 'Vamos enviar um código para:'),
              h('button', { class: 'lm-rec-opt', on: { click: () => phone.toast('Envio indisponível na extração', { icon: 'eye' }) } },
                h('span', { class: 'lm-rec-ic' }, icon('smartphone', { size: 20 })),
                h('span', null, h('small', null, 'Mensagem de texto (SMS)'), h('b', { class: 'txt' }, p.recovery.phone || '—'))),
              h('button', { class: 'lm-rec-opt', on: { click: () => phone.toast('Envio indisponível na extração', { icon: 'eye' }) } },
                h('span', { class: 'lm-rec-ic' }, icon('mail', { size: 20 })),
                h('span', null, h('small', null, 'E-mail'), h('b', { class: 'txt' }, p.recovery.email || '—'))),
              h('small', { class: 'lm-rec-foot' }, 'O código vale por 10 minutos. Se você não reconhece esses dados, a conta pode ter outro dono.')));
          } else {
            out.append(h('div', { class: 'lm-rec-card none' }, icon('circle-alert', { size: 28, stroke: 1.6 }), h('h3', null, 'Não encontramos essa conta'), h('small', null, 'Confira o nome de usuário e tente de novo.')));
          }
        };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
        body.append(kit.appBar({ title: 'Recuperar acesso' }),
          h('div', { class: 'lm-rec' },
            h('div', { class: 'lm-rec-hero' }, h('span', null, icon('lock', { size: 34, stroke: 1.4 })), h('h2', null, 'Esqueceu a senha?'), h('p', null, 'Digite o nome de usuário da conta para recuperar o acesso.')),
            h('label', { class: 'lm-field' }, input),
            kit.button({ label: 'Continuar', onClick: go }),
            out));
      },
    });
  }

  /* ---------- Direct (mensagens) ---------- */
  function lastMsg(dm) { return [...(dm.messages || [])].filter((m) => game.req(m)).sort((a, b) => time.compare(a.at, b.at)).pop() || null; }
  const dmUnread = (d) => { const l = lastMsg(d); return !!l && l.from !== 'me' && !isSeen('lume:dm:' + d.id); };

  function openDMs() {
    phone.push({
      className: 'lm-sub lm-dmlist',
      render(body) {
        const all = dms().map((d) => ({ d, last: lastMsg(d) })).filter((x) => x.last).sort((a, b) => time.compare(b.last.at, a.last.at));
        const listEl = h('div', { class: 'lm-dmrows' });
        const draw = (q) => {
          clear(listEl);
          const nq = normalize(q || '');
          const list = nq ? all.filter(({ d }) => normalize(`${d.with} ${nameOf(d.with)}`).includes(nq)) : all;
          if (!list.length) { listEl.append(kit.empty({ icon: 'messages-square', title: nq ? 'Nada encontrado' : 'Nenhuma conversa', text: nq ? '' : 'As mensagens diretas aparecem aqui.' })); return; }
          listEl.append(...list.map(({ d, last }) => {
            const unread = dmUnread(d);
            return h('button', { class: `lm-dmrow${unread ? ' unread' : ''}`, dataset: { dm: d.id }, on: { click: () => openDM(d) } },
              avatar(d.with, 54),
              h('span', { class: 'lm-dmrow-t' },
                h('b', null, nameOf(d.with)),
                h('small', null, h('span', { class: 'lm-dmrow-msg' }, `${last.from === 'me' ? 'Você: ' : ''}${snippet(last.text, 44)}`), h('span', { class: 'lm-dmrow-ago' }, ` · ${agoShort(last.at)}`))),
              unread ? h('i', { class: 'lm-dmdot' }) : null,
              h('span', { class: 'lm-dmcam', 'aria-hidden': 'true' }, icon('camera', { size: 24, stroke: 1.6 })));
          }));
        };
        const field = kit.search({ placeholder: 'Pesquisar', onInput: draw });
        draw('');
        body.append(kit.appBar({ title: [me, icon('chevron-down', { size: 18, className: 'lm-tchev' })], actions: [{ icon: 'pencil', label: 'Nova mensagem', onClick: readonly }] }),
          h('div', { class: 'lm-dmsearch' }, field),
          h('div', { class: 'lm-dmhead' }, h('b', null, 'Mensagens'), h('span', { class: 'lm-sp' }), h('span', { class: 'lm-dmreq' }, 'Solicitações')),
          listEl);
      },
    });
  }

  function openDM(dm) {
    see('lume:dm:' + dm.id, dm);
    const hd = dm.with;
    const p = prof(hd);
    phone.push({
      className: 'lm-sub lm-dm',
      render(body) {
        const msgs = [...(dm.messages || [])].filter((m) => game.req(m)).sort((a, b) => time.compare(a.at, b.at));
        const thread = h('div', { class: 'lm-thread' });
        // cartão do perfil no topo da conversa, como no Direct
        thread.append(h('div', { class: 'lm-dmcard' },
          avatar(hd, 88),
          h('b', null, nameOf(hd)),
          h('small', null, hd, ' · Instagram'),
          p ? h('small', null, `${fmtCount(p.followers)} seguidores · ${plural(p.posts ?? postsOf(hd).length, 'publicação', 'publicações')}`) : null,
          igBtn('Ver perfil', { onClick: () => openProfile(hd) })));
        let day = null, prevAt = null;
        msgs.forEach((m, k) => {
          const d = time.ymd(m.at);
          const gap = prevAt ? (time.parse(m.at) - time.parse(prevAt)) / 60000 : Infinity;
          if (d !== day || gap >= 60) { thread.append(h('div', { class: 'lm-dayline' }, `${cap(time.chatDay(m.at, now))}, ${time.hhmm(m.at)}`)); }
          day = d; prevAt = m.at;
          const side = m.from === 'me' ? 'me' : 'them';
          const nx = msgs[k + 1];
          const lastOfGroup = !nx || (nx.from === 'me' ? 'me' : 'them') !== side || time.ymd(nx.at) !== d || (time.parse(nx.at) - time.parse(m.at)) / 60000 >= 60;
          const emo = isEmojiOnly(m.text);
          thread.append(h('div', { class: `lm-msg ${side}${lastOfGroup ? ' last' : ''}` },
            side === 'them' ? (lastOfGroup ? avatar(hd, 28) : h('span', { class: 'lm-msg-sp' })) : null,
            h('div', { class: `lm-bub ${side}${emo ? ' emoji' : ''}` }, h('p', { class: 'txt' }, rich(m.text)), h('time', null, time.hhmm(m.at)))));
        });
        if (!msgs.length) thread.append(kit.empty({ icon: 'messages-square', title: 'Conversa vazia', text: '' }));
        const comp = h('div', { class: 'lm-dmcomp', role: 'button', tabindex: '0', 'aria-label': 'Somente leitura', on: { click: readonly } },
          h('span', { class: 'lm-dmcomp-cam' }, icon('camera', { size: 20 })),
          h('span', { class: 'lm-dmcomp-ph' }, 'Mensagem…'),
          icon('mic', { size: 22, stroke: 1.8 }), icon('image', { size: 22, stroke: 1.8 }), icon('smile', { size: 22, stroke: 1.8 }));
        body.append(kit.appBar({ title: [nameOf(hd), p?.verified ? verifiedBadge() : null], subtitle: hd, avatar: avatar(hd, 34), actions: [{ icon: 'phone', label: 'Ligar', onClick: readonly }, { icon: 'video', label: 'Chamada de vídeo', onClick: readonly }] }),
          thread, comp);
        requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
      },
    });
  }

  /* ---------- notificações (o coração do topo) ---------- */
  function notifsView() {
    const list = [...(data.notifications || [])].filter((n) => game.req(n)).sort((a, b) => time.compare(b.at, a.at));
    if (!list.length) return kit.empty({ icon: 'heart', title: 'Nenhuma atividade', text: 'Curtidas, comentários e menções aparecem aqui.' });
    const groups = [['Hoje', []], ['Esta semana', []], ['Este mês', []], ['Anteriores', []]];
    list.forEach((n) => { const m = minsAgo(n.at); groups[m < 1440 ? 0 : m < 7 * 1440 ? 1 : m < 30 * 1440 ? 2 : 3][1].push(n); });
    const wrap = h('div', { class: 'lm-notifs' });
    for (const [title, items] of groups) {
      if (!items.length) continue;
      wrap.append(h('h3', { class: 'lm-ntitle' }, title), h('div', { class: 'lm-nlist' }, items.map((n) => {
        const actor = n.actor;
        const text = String(n.text || '').replace(/^@/, '');
        const starts = actor && text.toLowerCase().startsWith(String(actor).toLowerCase());
        const thumb = n.post ? postById(n.post) : null;
        const th = thumb ? arr(thumb.media)[0] : null;
        return h('button', { class: 'lm-notif', on: { click: () => (thumb ? openPost(thumb) : actor ? openProfile(actor) : null) } },
          actor ? avatar(actor, 44) : h('span', { class: 'lm-notif-ic' }, svg('heart', { size: 22 })),
          h('span', { class: 'lm-notif-tx txt' }, actor && !starts ? h('b', null, actor, ' ') : null, starts ? [h('b', null, text.slice(0, actor.length)), text.slice(actor.length)] : text, h('em', null, ' ' + agoShort(n.at))),
          thumb ? h('span', { class: 'lm-notif-th' }, th ? kit.img(th, { alt: '', ratio: '1/1' }) : textTile(thumb.caption, thumb.id, { mini: true })) : null);
      })));
    }
    return wrap;
  }

  function openNotifs() {
    phone.push({
      className: 'lm-sub',
      render(body) { body.append(kit.appBar({ title: 'Notificações' }), notifsView()); },
    });
  }

  /* ---------- abas ---------- */
  function storiesRow() {
    const seenAuthors = new Set();
    const items = [];
    for (const hl of highlights()) { if (seenAuthors.has(hl.author)) continue; seenAuthors.add(hl.author); items.push(hl); }
    items.sort((a, b) => (b.author === me) - (a.author === me));
    if (!items.length) return null;
    return h('div', { class: 'lm-stories-row', role: 'list', 'aria-label': 'Stories e destaques' }, items.map((hl) =>
      h('button', { class: 'lm-story', role: 'listitem', 'aria-label': `Destaque de ${hl.author}: ${hl.title || ''}`, on: { click: () => openHighlight(hl) } },
        ringed(avatar(hl.author, 62), hl.id),
        h('span', { class: 'lm-story-n' }, hl.author === me ? 'Seu story' : hl.author))));
  }

  function homeView() {
    const wrap = h('div', { class: 'lm-home' });
    const row = storiesRow();
    if (row) wrap.append(row);
    const feed = posts();
    feed.forEach((p) => wrap.append(postCard(p)));
    if (!feed.length) wrap.append(kit.empty({ icon: 'aperture', title: 'Nada por aqui ainda', text: 'As publicações de quem você segue aparecem aqui.' }));
    else wrap.append(h('div', { class: 'lm-endfeed' }, h('span', null, icon('check', { size: 26, stroke: 1.6 })), h('b', null, 'Você já viu tudo'), h('small', null, 'Você viu todas as publicações extraídas desta conta.')));
    return wrap;
  }

  function profileRow(p) {
    return kit.listItem({
      avatar: avatar(p.handle, 44),
      title: h('span', { class: 'lm-li-t' }, p.handle, p.verified ? verifiedBadge() : null),
      subtitle: [p.name, p.followers != null ? `${fmtCount(p.followers)} seguidores` : ''].filter(Boolean).join(' · '),
      onClick: () => openProfile(p.handle),
    });
  }

  function searchView() {
    const results = h('div', { class: 'lm-sresults' });
    const draw = (q) => {
      clear(results);
      const nq = normalize(q || '');
      if (!nq) {
        results.append(h('div', { class: 'lm-shead' }, h('b', null, 'Contas'), h('small', null, `${profiles.length}`)),
          h('div', { class: 'lm-accts', role: 'list' }, profiles.map((p) => h('button', { class: 'lm-acct', role: 'listitem', 'aria-label': `Abrir o perfil de ${p.handle}`, on: { click: () => openProfile(p.handle) } },
            avatar(p.handle, 58), h('span', { class: 'lm-acct-h' }, p.handle), h('small', null, p.name && p.name !== p.handle ? p.name : '')))));
        const all = posts();
        if (all.length) results.append(h('div', { class: 'lm-explore' }, all.map((x, i) => postTile(x, i % 10 === 2 ? 'tall r' : i % 10 === 5 ? 'tall l' : ''))));
        return;
      }
      const ps = profiles.filter((p) => normalize(`${p.handle} ${p.name || ''}`).includes(nq));
      const hits = posts().filter((p) => normalize(`${p.caption || ''} ${placeName(p)} ${p.author}`).includes(nq));
      if (ps.length) results.append(kit.sectionTitle('Contas'), kit.list(ps.map(profileRow)));
      if (hits.length) results.append(kit.sectionTitle('Publicações'), h('div', { class: 'lm-explore flat' }, hits.map((x) => postTile(x))));
      if (!ps.length && !hits.length) results.append(kit.empty({ icon: 'search', title: 'Nenhum resultado encontrado', text: `Nada para “${q}”.` }));
    };
    const field = kit.search({ placeholder: 'Pesquisar', onInput: draw });
    draw('');
    return h('div', { class: 'lm-searchview' }, h('div', { class: 'lm-sbar' }, field), results);
  }

  function reelsView() {
    const lives = posts().filter((p) => p.kind === 'live');
    if (!lives.length) return kit.empty({ icon: 'video', title: 'Nenhum reel', text: 'Os vídeos extraídos aparecem aqui.' });
    return h('div', { class: 'lm-reels' }, lives.map((post) => {
      const live = post.live || {};
      const frame = arr(live.media)[0] || arr(post.media)[0] || '';
      const n = commentCount(post) || (live.comments || []).length;
      return h('div', { class: 'lm-reel' },
        h('button', { class: 'lm-reel-media', 'aria-label': `Assistir à transmissão gravada de ${post.author}`, on: { click: () => openLive(post) } },
          kit.img(frame, { alt: 'Frame da transmissão ao vivo' }),
          h('span', { class: 'lm-reel-shade' }),
          h('span', { class: 'lm-live-play' }, icon('play', { size: 28 }))),
        h('span', { class: 'lm-reel-tl' }, liveBadge(), h('span', { class: 'lm-live-rec' }, `gravada · ${stampDate(liveStart(post))}`)),
        h('div', { class: 'lm-reel-side' },
          h('button', { 'aria-label': 'Curtir', on: { click: readonly } }, svg('heart', { size: 28 }), h('small', null, fmtCount(post.likes))),
          h('button', { 'aria-label': 'Comentários', on: { click: () => openLive(post) } }, svg('comment', { size: 27 }), h('small', null, fmtCount(n))),
          h('button', { 'aria-label': 'Compartilhar', on: { click: readonly } }, svg('send', { size: 26 })),
          h('button', { 'aria-label': 'Mais opções', on: { click: postMenu(post) } }, icon('ellipsis-vertical', { size: 22 }))),
        h('div', { class: 'lm-reel-info' },
          h('button', { class: 'lm-reel-who', on: { click: () => openProfile(post.author) } }, avatar(post.author, 32), handleEl(post.author), h('span', { class: 'lm-reel-follow' }, 'Seguir')),
          post.caption ? h('p', { class: 'lm-reel-cap txt' }, rich(post.caption)) : null));
    }));
  }

  function meView() { return profileBody(me); }

  /* ---------- raiz ---------- */
  function unreadCount() { return dms().filter(dmUnread).length; }
  const hasRecentActivity = () => (data.notifications || []).some((n) => game.req(n) && minsAgo(n.at) < 3 * 1440);

  function mount() {
    let tab = 'home';
    const views = {};
    const scrolls = {};
    const view = h('div', { class: 'lm-view' });
    const header = h('header', { class: 'lm-top' });
    const nav = h('nav', { class: 'lm-nav', 'aria-label': 'Navegação do Instagram' });

    const topBtn = (ic, label, onClick, extra) => h('button', { class: 'lm-topbtn', 'aria-label': label, title: label, on: { click: () => { sfx.play('tap'); onClick(); } } }, ic, extra || null);

    const makeHeader = () => {
      clear(header);
      header.hidden = false;
      view.classList.toggle('reels', tab === 'reels');
      if (tab === 'home') {
        const n = unreadCount();
        header.append(
          h('button', { class: 'lm-logo-btn', 'aria-label': 'Instagram, voltar ao topo', on: { click: () => view.scrollTo({ top: 0, behavior: 'smooth' }) } },
            h('span', { class: 'lm-logo' }, 'Instagram'), icon('chevron-down', { size: 16, className: 'lm-logo-chev' })),
          h('span', { class: 'lm-sp' }),
          topBtn(svg('heart', { size: 26 }), 'Notificações', openNotifs, hasRecentActivity() ? h('i', { class: 'lm-reddot' }) : null),
          topBtn(svg('messenger', { size: 26 }), n ? `Mensagens, ${n} não lidas` : 'Mensagens', openDMs, n ? h('span', { class: 'lm-badge' }, String(n)) : null));
      } else if (tab === 'search') {
        header.hidden = true;
      } else if (tab === 'reels') {
        header.append(h('h1', { class: 'lm-h1' }, 'Reels', icon('chevron-down', { size: 18 })), h('span', { class: 'lm-sp' }), topBtn(icon('camera', { size: 24, stroke: 1.8 }), 'Câmera', readonly));
      } else {
        header.append(h('h1', { class: 'lm-h1' }, me, icon('chevron-down', { size: 18 })), h('span', { class: 'lm-sp' }),
          topBtn(svg('threads', { size: 24, sw: 1.7 }), 'Threads', readonly),
          topBtn(svg('create', { size: 25 }), 'Criar', readonly),
          h('button', { class: 'lm-topbtn', 'aria-label': 'Mais opções', title: 'Mais opções', on: { click: profileMenu(me) } }, icon('menu', { size: 26, stroke: 1.8 })));
      }
    };

    const drawNav = () => {
      clear(nav);
      for (const [id, label] of TABS) {
        const on = id === tab;
        let ic;
        if (id === 'me') ic = h('span', { class: `lm-navav${on ? ' on' : ''}` }, avatar(me, 26));
        else if (id === 'home') ic = svg('home', { size: 26, filled: on, sw: on ? 2 : 1.9 });
        else if (id === 'search') ic = svg('search', { size: 26, sw: on ? 2.8 : 1.9 });
        else if (id === 'reels') ic = svg('reels', { size: 26, sw: on ? 2.4 : 1.9 });
        else ic = svg('create', { size: 26 });
        nav.append(h('button', { class: `lm-navbtn${on ? ' on' : ''}`, 'aria-current': on ? 'page' : null, 'aria-label': label, title: label, on: { click: () => setTab(id) } }, ic));
      }
    };

    function setTab(id) {
      if (id === 'create') { readonly(); return; }
      if (id === tab && views[id]) { (id === 'reels' ? view.querySelector('.lm-reels') || view : view).scrollTo({ top: 0, behavior: 'smooth' }); return; }
      scrolls[tab] = view.scrollTop;
      tab = id;
      if (!views[id]) views[id] = id === 'home' ? homeView() : id === 'search' ? searchView() : id === 'reels' ? reelsView() : meView();
      clear(view).append(views[id]);
      view.scrollTop = scrolls[id] || 0;
      makeHeader(); drawNav();
      if (id === 'me') see('lume:profile:' + me, prof(me));
      phone.scan(view);
    }

    el.append(h('div', { class: 'lm-root' }, header, view, nav));
    views.home = homeView();
    view.append(views.home);
    makeHeader(); drawNav();
    refreshHeader = () => { if (tab === 'home') makeHeader(); };
  }

  function handleParams() {
    const { profile, post, highlight, dm } = params || {};
    if (highlight) { const hl = highlightById(highlight); if (hl) openHighlight(hl); }
    else if (post) { const p = postById(post); if (p) openPost(p); }
    else if (profile) openProfile(String(profile).replace(/^@/, ''));
    else if (dm) {
      const d = dms().find((x) => x.id === dm || x.with === dm);
      if (d) openDM(d);
    }
  }

  return { mount, handleParams };
}
