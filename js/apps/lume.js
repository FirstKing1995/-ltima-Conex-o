// Lume — a rede social de Iara. App na nuvem (cloud:true): mostra os dados até terça.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import { bus } from '../core/bus.js';
import { isSeen } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { asset } from '../core/store.js';
import { normalize } from '../core/hash.js';
import * as time from '../core/time.js';

const TABS = [['home', 'Início', 'house'], ['search', 'Buscar', 'search'], ['notifs', 'Notificações', 'bell'], ['me', 'Perfil', 'user-round']];
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

const VERIFIED_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 1.8l2.6 1.9 3.2-.2 1.1 3 2.8 1.6-.9 3.1.9 3.1-2.8 1.6-1.1 3-3.2-.2L12 22.2l-2.6-1.9-3.2.2-1.1-3-2.8-1.6.9-3.1-.9-3.1 2.8-1.6 1.1-3 3.2.2z" fill="currentColor"/><path d="M8.2 12.3l2.5 2.5 5-5.2" fill="none" stroke="#2b1704" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const verifiedBadge = () => h('span', { class: 'lm-verified', title: 'Perfil verificado', role: 'img', 'aria-label': 'verificado', html: VERIFIED_SVG });

export default {
  id: 'lume',
  title: 'Lume',
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
  const readonly = () => phone.toast('O espelho é somente leitura', { icon: 'eye' });

  /* ---------- tempo ---------- */
  const minsAgo = (at) => Math.floor((time.parse(now) - time.parse(at)) / 60000);
  function agoShort(at) {
    const m = minsAgo(at);
    if (m < 1) return 'agora';
    if (m < 60) return `${m}\u00a0min`;
    if (m < 1440) return `${Math.floor(m / 60)}\u00a0h`;
    const d = Math.floor(m / 1440);
    if (d < 7) return `${d}\u00a0d`;
    if (d < 35) return `${Math.floor(d / 7)}\u00a0sem`;
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
  const avatar = (hd, size = 40) => { const p = prof(hd); return kit.avatar({ src: p?.avatar || '', name: p?.name || hd, size }); };
  function ringed(hd, size = 56, hlId) {
    const r = h('span', { class: `lm-ring${hlId && isSeen('lume:highlight:' + hlId) ? ' seen' : ''}`, dataset: hlId ? { hl: hlId } : null }, h('span', { class: 'lm-ring-in' }, avatar(hd, size)));
    return r;
  }
  const placeName = (post) => (typeof post.place === 'string' ? post.place : post.place?.name || post.location || '');
  const commentCount = (post) => post.commentsCount ?? (post.comments || []).length;

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
  /** Botão compacto "Fixar no Quadro". */
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

  function mediaBlock(post, ratio = '1/1') {
    const imgs = arr(post.media).filter(Boolean);
    if (!imgs.length) return null;
    const slide = (src, i) => h('button', { class: 'lm-mediabtn', 'aria-label': imgs.length > 1 ? `Ampliar foto ${i + 1} de ${imgs.length}` : 'Ampliar foto', on: { click: () => openViewer(post, i) } },
      kit.img(src, { alt: `Foto publicada por @${post.author}`, ratio }));
    if (imgs.length === 1) return h('div', { class: 'lm-media' }, slide(imgs[0], 0));
    const track = h('div', { class: 'lm-track' }, imgs.map((src, i) => h('div', { class: 'lm-slide' }, slide(src, i))));
    const dots = h('div', { class: 'lm-dots', 'aria-hidden': 'true' }, imgs.map((_, i) => h('i', { class: i === 0 ? 'on' : '' })));
    const count = h('span', { class: 'lm-count' }, `1/${imgs.length}`);
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
      count.textContent = `${i + 1}/${imgs.length}`;
    }, { passive: true });
    return h('div', { class: 'lm-media lm-carousel' }, track, count, dots);
  }

  /* ---------- posts ---------- */
  function postHead(post, right) {
    const p = prof(post.author);
    const place = placeName(post);
    return h('header', { class: 'lm-post-head' },
      h('button', { class: 'lm-who', 'aria-label': `Abrir o perfil de ${post.author}`, on: { click: () => openProfile(post.author) } },
        avatar(post.author, 38),
        h('span', { class: 'lm-who-t' },
          h('b', null, post.author, p?.verified ? verifiedBadge() : null),
          place ? h('small', null, icon('map-pin', { size: 12 }), place) : null)),
      right || h('span', { class: 'lm-ago' }, agoShort(post.at)));
  }

  function captionEl(post) {
    if (!post.caption) return null;
    return h('p', { class: 'lm-cap txt' },
      h('b', { class: 'lm-handle', on: { click: () => openProfile(post.author) } }, post.author), ' ', rich(post.caption));
  }

  function postCard(post, { detail = false } = {}) {
    if (post.kind === 'live') return liveCard(post, { detail });
    const n = commentCount(post);
    const pm = postPin(post);
    const acts = h('div', { class: 'lm-acts' },
      h('button', { class: 'lm-act', 'aria-label': `Curtir. ${fmtCount(post.likes)} curtidas`, on: { click: readonly } }, icon('heart', { size: 20 }), fmtCount(post.likes)),
      h('button', { class: 'lm-act', 'aria-label': `Comentários: ${n}`, on: { click: () => openComments(post) } }, icon('message-circle', { size: 20 }), fmtCount(n)),
      h('button', { class: 'lm-act', disabled: true, 'aria-label': 'Compartilhar (indisponível)' }, icon('share-2', { size: 20 })),
      h('span', { class: 'lm-sp' }),
      pinToggle({ key: 'lume:post:' + post.id, label: pm.label, detail: pm.detail }));
    return h('article', { class: 'lm-post', dataset: { id: post.id } },
      postHead(post),
      mediaBlock(post, post.ratio),
      acts,
      captionEl(post),
      detail ? null : (n ? h('button', { class: 'lm-more', on: { click: () => openComments(post) } }, n === 1 ? 'Ver 1 comentário' : `Ver todos os ${fmtCount(n)} comentários`) : null),
      h('time', { class: 'lm-when' }, agoLong(post.at)));
  }

  function liveSpan(post) {
    const live = post.live || {};
    const a = clockSec(live.start), b = clockSec(live.end);
    return Math.max(0, b - a);
  }

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
        h('span', { class: 'lm-live-badge' }, h('i'), 'AO VIVO · gravada'),
        h('span', { class: 'lm-live-dur' }, icon('clock', { size: 12 }), `${mins} min`),
        h('span', { class: 'lm-live-play' }, icon('play', { size: 30 })),
        h('span', { class: 'lm-live-cta' }, 'Assistir à transmissão')),
      captionEl(post),
      detail ? null : (n ? h('button', { class: 'lm-more', on: { click: () => openLive(post) } }, `${plural(n, 'comentário', 'comentários')} na transmissão`) : null),
      h('time', { class: 'lm-when' }, `${stampDate(liveStart(post))} · ${agoLong(post.at)}`));
  }

  /* ---------- comentários ---------- */
  function commentRow(post, c, i) {
    const p = prof(c.author);
    const key = `lume:comment:${post.id}:${c.id ?? i}`;
    return h('div', { class: 'lm-comment' },
      h('button', { class: 'lm-c-av', 'aria-label': `Abrir o perfil de ${c.author}`, on: { click: () => openProfile(c.author) } }, avatar(c.author, 36)),
      h('div', { class: 'lm-c-body' },
        h('div', { class: 'lm-c-line' },
          h('b', { class: 'lm-c-who', on: { click: () => openProfile(c.author) } }, c.author, p?.verified ? verifiedBadge() : null),
          h('span', { class: 'lm-c-ago' }, c.at ? agoShort(c.at) : '')),
        h('p', { class: 'lm-c-tx txt' }, rich(c.text)),
        c.likes ? h('div', { class: 'lm-c-meta' }, `${fmtCount(c.likes)} ${c.likes === 1 ? 'curtida' : 'curtidas'}`) : null),
      pinToggle({ key, label: `@${c.author}: ${snippet(c.text, 100)}`, detail: `Comentário no post de @${post.author} · ${c.at ? longDate(c.at) : ''}` }));
  }

  function commentsList(post) {
    const list = [...(post.comments || [])].filter((c) => game.req(c)).sort((a, b) => time.compare(a.at, b.at));
    return list.length ? h('div', { class: 'lm-comments' }, list.map((c, i) => commentRow(post, c, i)))
      : kit.empty({ icon: 'message-circle', title: 'Nenhum comentário ainda', text: 'Quando alguém comentar, vai aparecer aqui.' });
  }

  const composer = (txt = 'Comentar…') => h('div', { class: 'lm-composer', 'aria-label': 'Somente leitura' }, avatar(me, 32), h('span', null, txt), icon('lock', { size: 16 }));

  function openComments(post) {
    see('lume:post:' + post.id, post);
    phone.push({
      className: 'lm-sub',
      render(body) {
        const cap1 = post.caption ? h('div', { class: 'lm-comment lm-c-cap' },
          h('button', { class: 'lm-c-av', 'aria-label': `Abrir o perfil de ${post.author}`, on: { click: () => openProfile(post.author) } }, avatar(post.author, 36)),
          h('div', { class: 'lm-c-body' },
            h('div', { class: 'lm-c-line' }, h('b', { class: 'lm-c-who', on: { click: () => openProfile(post.author) } }, post.author), h('span', { class: 'lm-c-ago' }, agoShort(post.at))),
            h('p', { class: 'lm-c-tx txt' }, rich(post.caption)))) : null;
        body.append(kit.appBar({ title: 'Comentários', subtitle: `@${post.author} · ${plural(commentCount(post), 'comentário', 'comentários')}` }),
          h('div', { class: 'lm-cwrap' }, cap1, cap1 ? h('div', { class: 'lm-sep' }) : null, commentsList(post)),
          composer('Adicionar comentário…'));
      },
    });
  }

  function openPost(post) {
    if (post.kind === 'live') return openLive(post);
    see('lume:post:' + post.id, post);
    phone.push({
      className: 'lm-sub',
      render(body) {
        body.append(kit.appBar({ title: 'Publicação', subtitle: `@${post.author}` }),
          h('div', { class: 'lm-detail' }, postCard(post, { detail: true }),
            kit.sectionTitle(`Comentários · ${commentCount(post)}`), commentsList(post)),
          composer('Adicionar comentário…'));
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
      ...(live.transcript || []).map((x) => ({ kind: 'tr', t: clockSec(x.t), raw: x.t, who: x.who, text: x.text, key: 'lume:live:' + x.t })),
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
        const bigPlay = h('button', { class: 'lm-vid-play', 'aria-label': 'Reproduzir', on: { click: () => toggle() } }, icon('play', { size: 34 }));
        const vid = h('div', { class: 'lm-vid' },
          kit.img(frame, { alt: 'Frame da transmissão ao vivo', ratio: undefined }),
          h('span', { class: 'lm-vid-shade' }),
          h('span', { class: 'lm-live-badge' }, h('i'), 'AO VIVO'),
          clockEl, bigPlay);

        const fill = h('i', { class: 'lm-fill' });
        const knob = h('b', { class: 'lm-knob' });
        const scrub = h('div', { class: 'lm-scrub', role: 'slider', tabindex: '0', 'aria-label': 'Posição da transmissão', 'aria-valuemin': String(startSec), 'aria-valuemax': String(endSec) }, fill, knob);
        const pp = h('button', { class: 'lm-pp', 'aria-label': 'Reproduzir', on: { click: () => toggle() } }, icon('play', { size: 22 }));
        const endEl = h('span', { class: 'lm-ctl-t no-terms' }, fmtClock(endSec));
        const ctl = h('div', { class: 'lm-ctl' }, pp, h('div', { class: 'lm-scrubwrap' }, scrub, h('div', { class: 'lm-ctl-row' }, h('span', { class: 'lm-ctl-t no-terms' }, fmtClock(startSec)), endEl)), h('span', { class: 'lm-speed', title: '1 segundo = 20 segundos de vídeo' }, '20×'));

        const tl = h('div', { class: 'lm-tl', role: 'list', 'aria-label': 'Transcrição e comentários' });
        const rowEls = rows.map((r) => {
          const common = { role: 'listitem', tabindex: '0', on: { click: (e) => { if (e.target.closest('.lm-pin')) return; seek(r.t); }, keydown: (e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); seek(r.t); } } } };
          if (r.kind === 'tr') {
            return h('div', { ...common, class: 'lm-lrow tr' },
              h('span', { class: 'lm-lt' }, r.raw),
              h('div', { class: 'lm-lbody' }, r.who ? h('b', { class: 'lm-lwho' }, r.who) : null, h('p', { class: 'txt' }, r.text)),
              pinToggle({ key: r.key, label: `${r.who ? r.who + ': ' : ''}“${snippet(r.text, 110)}”`, detail: `Transmissão “${title}” · ${r.raw}` }));
          }
          return h('div', { ...common, class: 'lm-lrow cm' },
            h('span', { class: 'lm-lt' }, r.raw),
            h('div', { class: 'lm-lbody' },
              h('div', { class: 'lm-lcm' }, avatar(r.author, 22), h('b', null, '@' + r.author)),
              h('p', { class: 'txt' }, rich(r.text))),
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
          clear(pp).append(icon(nm, { size: 22 }));
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
          kit.appBar({ title: prof(post.author)?.name || '@' + post.author, subtitle: `AO VIVO · gravada · ${stampDate(liveStart(post))}` }),
          vid, ctl, tl));
        render(false);
        drawPP();
      },
    });
  }

  /* ---------- destaques (stories) ---------- */
  function openHighlight(hl, start = 0) {
    const frames = framesOf(hl);
    if (!frames.length) return;
    see('lume:highlight:' + hl.id, hl);
    let i = Math.max(0, Math.min(start, frames.length - 1));
    let elapsed = 0, paused = false, timer = null, downAt = 0;

    const bars = h('div', { class: 'lm-st-bars', 'aria-hidden': 'true' }, frames.map(() => h('i', null, h('b'))));
    const stageMedia = h('div', { class: 'lm-st-media' });
    const whoEl = h('div', { class: 'lm-st-who' });
    const repost = h('div', { class: 'lm-st-repost' });
    const textEl = h('div', { class: 'lm-st-text txt' });
    const foot = h('div', { class: 'lm-st-foot' }, icon('sparkles', { size: 14 }), `Destaque · ${hl.title || 'Sem título'}`);
    const stage = h('div', { class: 'lm-st-stage' });
    const top = h('div', { class: 'lm-st-top' },
      bars,
      h('div', { class: 'lm-st-bar' },
        h('button', { class: 'lm-st-author', 'aria-label': 'Abrir perfil', on: { click: () => { close(); openProfile(frames[i].author || hl.author); } } }, avatar(hl.author, 34), whoEl),
        h('span', { class: 'lm-sp' }),
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
      elapsed = 0;
      clear(stageMedia);
      const src = arr(s.media)[0] || '';
      stageMedia.classList.remove('missing', 'portrait');
      if (src) {
        const url = asset(src);
        const im = h('img', { class: 'lm-st-img', alt: s.text ? snippet(s.text, 80) : 'Story', draggable: 'false' });
        im.addEventListener('error', () => { stageMedia.classList.add('missing'); im.remove(); stageMedia.querySelector('.lm-st-blur')?.remove(); stageMedia.append(h('span', { class: 'lm-st-miss' }, icon('image', { size: 40, stroke: 1.4 }))); }, { once: true });
        im.addEventListener('load', () => { stageMedia.classList.toggle('portrait', im.naturalWidth / Math.max(1, im.naturalHeight) < 0.8); }, { once: true });
        im.src = url;
        stageMedia.append(h('img', { class: 'lm-st-blur', alt: '', 'aria-hidden': 'true', src: url, draggable: 'false' }), im);
      } else {
        stageMedia.classList.add('missing');
        stageMedia.append(h('span', { class: 'lm-st-miss' }, icon('image', { size: 40, stroke: 1.4 })));
      }
      clear(whoEl).append(h('b', null, '@' + (s.author || hl.author)), h('span', null, ' · ' + stampDate(s.at)));
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
    } else if (key.startsWith('lume:dm:')) refreshHeader?.();
  });
  let refreshHeader = null;

  /* ---------- perfis ---------- */
  function statBox(n, label) { return h('div', { class: 'lm-stat' }, h('b', null, fmtCount(n)), h('span', null, label)); }

  function postTile(post) {
    const first = arr(post.media)[0];
    const multi = arr(post.media).length > 1;
    return h('button', { class: 'lm-pt', 'aria-label': `Abrir publicação de @${post.author}${post.caption ? ': ' + snippet(post.caption, 50) : ''}`, on: { click: () => openPost(post) } },
      kit.img(first, { alt: snippet(post.caption, 60), ratio: '1/1' }),
      post.kind === 'live' ? h('span', { class: 'lm-pt-ic live' }, icon('play', { size: 13 })) : multi ? h('span', { class: 'lm-pt-ic' }, icon('layers', { size: 14 })) : null);
  }

  function profileMenu(hd) {
    return (e) => kit.menu(e.currentTarget, [
      { label: 'Copiar link do perfil', icon: 'link', onClick: () => phone.toast('Link copiado', { icon: 'check' }) },
      hd !== me ? { label: 'Esqueceu a senha?', icon: 'key-round', onClick: () => openRecovery(hd) } : null,
      hd !== me ? { label: 'Denunciar', icon: 'triangle-alert', danger: true, onClick: readonly } : null,
    ]);
  }

  function profileBody(hd) {
    const p = prof(hd) || { handle: hd, name: hd, bio: '', followers: 0, following: 0 };
    const mine = postsOf(hd);
    const hls = highlights().filter((x) => x.author === hd);
    const dm = dms().find((d) => d.with === hd);
    const postsN = p.posts ?? mine.length;
    const priv = !!p.private && hd !== me;
    return h('div', { class: 'lm-prof' },
      h('div', { class: 'lm-prof-head' },
        h('div', { class: `lm-prof-av${p.fake ? ' fake' : ''}` }, avatar(hd, 86)),
        h('div', { class: 'lm-stats' }, statBox(postsN, 'publicações'), statBox(p.followers, 'seguidores'), statBox(p.following, 'seguindo'))),
      h('div', { class: 'lm-prof-info' },
        h('h2', null, p.name || hd, p.verified ? verifiedBadge() : null),
        p.fake ? h('small', { class: 'lm-prof-flag' }, icon('eye', { size: 13 }), 'Perfil sem foto e sem publicações') : null,
        p.bio ? h('p', { class: 'lm-bio txt' }, rich(p.bio)) : null,
        priv ? h('small', { class: 'lm-prof-flag' }, icon('lock', { size: 13 }), 'Conta privada') : null),
      dm ? h('div', { class: 'lm-prof-acts' }, kit.button({ label: 'Mensagem', icon: 'messages-square', variant: 'tonal', onClick: () => openDM(dm) })) : null,
      hls.length ? h('div', { class: 'lm-hls', role: 'list' }, hls.map((hl) => {
        const frames = framesOf(hl);
        const cover = hl.cover || arr(frames[0]?.media)[0];
        return h('button', { class: 'lm-hl', role: 'listitem', 'aria-label': `Destaque ${hl.title}`, on: { click: () => openHighlight(hl) } },
          h('span', { class: `lm-ring${isSeen('lume:highlight:' + hl.id) ? ' seen' : ''}`, dataset: { hl: hl.id } }, h('span', { class: 'lm-ring-in' }, kit.avatar({ src: cover, name: hl.title, size: 58 }))),
          h('span', { class: 'lm-hl-t' }, hl.title));
      })) : null,
      priv
        ? h('div', { class: 'lm-private' }, h('span', null, icon('lock', { size: 28, stroke: 1.5 })), h('b', null, 'Esta conta é privada'), h('small', null, 'Siga este perfil para ver as fotos e os vídeos.'))
        : mine.length
          ? h('div', { class: 'lm-pgrid' }, mine.map(postTile))
          : h('div', { class: 'lm-noposts' }, icon('camera', { size: 30, stroke: 1.4 }), h('b', null, 'Nenhuma publicação ainda'), h('small', null, p.fake ? 'Este perfil só observa.' : 'Quando houver fotos, elas aparecem aqui.')));
  }

  function openProfile(hd) {
    if (!hd) return;
    see('lume:profile:' + hd, prof(hd));
    phone.push({
      className: 'lm-sub',
      render(body) {
        body.append(kit.appBar({ title: '@' + hd, subtitle: nameOf(hd) !== hd ? nameOf(hd) : '', actions: [{ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: profileMenu(hd) }] }), profileBody(hd));
      },
    });
  }

  /* ---------- recuperar acesso ---------- */
  function openRecovery(prefill = '') {
    phone.push({
      className: 'lm-sub',
      render(body) {
        const input = h('input', { type: 'text', value: prefill, placeholder: 'nome de usuário', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Nome de usuário' });
        const out = h('div', { class: 'lm-rec-out', 'aria-live': 'polite' });
        const go = () => {
          const hd = input.value.trim().replace(/^@/, '').toLowerCase();
          clear(out);
          const p = profiles.find((x) => x.handle.toLowerCase() === hd);
          if (!hd) { out.append(h('p', { class: 'lm-rec-err' }, 'Digite o nome de usuário da conta.')); return; }
          if (p?.recovery) {
            see('lume:recovery:' + p.handle, p);
            out.append(h('div', { class: 'lm-rec-card' },
              h('h3', null, 'Vamos enviar um código para:'),
              h('button', { class: 'lm-rec-opt', on: { click: () => phone.toast('Envio indisponível no espelho', { icon: 'eye' }) } },
                h('span', { class: 'lm-rec-ic' }, icon('smartphone', { size: 20 })),
                h('span', null, h('small', null, 'Mensagem de texto'), h('b', { class: 'txt' }, p.recovery.phone || '—'))),
              h('button', { class: 'lm-rec-opt', on: { click: () => phone.toast('Envio indisponível no espelho', { icon: 'eye' }) } },
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
            h('div', { class: 'lm-rec-hero' }, h('span', null, icon('key-round', { size: 30, stroke: 1.6 })), h('h2', null, 'Esqueceu a senha?'), h('p', null, 'Digite o nome de usuário da conta para recuperar o acesso.')),
            h('label', { class: 'lm-field' }, h('span', { class: 'lm-field-pre' }, '@'), input),
            kit.button({ label: 'Continuar', onClick: go }),
            out));
      },
    });
  }

  /* ---------- mensagens diretas ---------- */
  function lastMsg(dm) { return [...(dm.messages || [])].filter((m) => game.req(m)).sort((a, b) => time.compare(a.at, b.at)).pop() || null; }

  function openDMs() {
    phone.push({
      className: 'lm-sub',
      render(body) {
        const list = dms().map((d) => ({ d, last: lastMsg(d) })).filter((x) => x.last).sort((a, b) => time.compare(b.last.at, a.last.at));
        body.append(kit.appBar({ title: 'Mensagens', subtitle: '@' + me }),
          list.length ? kit.list(list.map(({ d, last }) => kit.listItem({
            avatar: avatar(d.with, 48),
            title: nameOf(d.with),
            subtitle: `${last.from === 'me' ? 'Você: ' : ''}${snippet(last.text, 60)}`,
            meta: agoShort(last.at),
            unread: last.from !== 'me' && !isSeen('lume:dm:' + d.id),
            onClick: () => openDM(d),
          }))) : kit.empty({ icon: 'messages-square', title: 'Nenhuma conversa', text: 'As mensagens diretas aparecem aqui.' }));
      },
    });
  }

  function openDM(dm) {
    see('lume:dm:' + dm.id, dm);
    const hd = dm.with;
    phone.push({
      className: 'lm-sub lm-dm',
      render(body) {
        const msgs = [...(dm.messages || [])].filter((m) => game.req(m)).sort((a, b) => time.compare(a.at, b.at));
        const thread = h('div', { class: 'lm-thread' });
        let day = null;
        for (const m of msgs) {
          const d = time.ymd(m.at);
          if (d !== day) { day = d; thread.append(h('div', { class: 'lm-dayline' }, cap(time.chatDay(m.at, now)))); }
          thread.append(h('div', { class: `lm-bub ${m.from === 'me' ? 'me' : 'them'}` }, h('p', { class: 'txt' }, rich(m.text)), h('time', null, time.hhmm(m.at))));
        }
        if (!msgs.length) thread.append(kit.empty({ icon: 'messages-square', title: 'Conversa vazia', text: '' }));
        body.append(kit.appBar({ title: nameOf(hd), subtitle: '@' + hd, avatar: avatar(hd, 38), actions: [{ icon: 'user-round', label: 'Ver perfil', onClick: () => openProfile(hd) }] }),
          thread, composer('Mensagem…'));
        requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
      },
    });
  }

  /* ---------- abas ---------- */
  function storiesRow() {
    const seenAuthors = new Set();
    const items = [];
    for (const hl of highlights()) { if (seenAuthors.has(hl.author)) continue; seenAuthors.add(hl.author); items.push(hl); }
    items.sort((a, b) => (b.author === me) - (a.author === me));
    if (!items.length) return null;
    return h('div', { class: 'lm-stories-row', role: 'list', 'aria-label': 'Destaques' }, items.map((hl) =>
      h('button', { class: 'lm-story', role: 'listitem', 'aria-label': `Destaque de ${hl.author}: ${hl.title || ''}`, on: { click: () => openHighlight(hl) } },
        ringed(hl.author, 58, hl.id),
        h('span', { class: 'lm-story-n' }, hl.author === me ? 'Você' : hl.author))));
  }

  function homeView() {
    const wrap = h('div', { class: 'lm-home' });
    const row = storiesRow();
    if (row) wrap.append(row);
    const feed = posts();
    feed.forEach((p) => wrap.append(postCard(p)));
    if (!feed.length) wrap.append(kit.empty({ icon: 'aperture', title: 'Nada por aqui ainda', text: 'As publicações de quem você segue aparecem aqui.' }));
    return wrap;
  }

  function profileRow(p) {
    return kit.listItem({
      avatar: avatar(p.handle, 46),
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
        results.append(kit.sectionTitle('Perfis'), kit.list(profiles.map(profileRow)));
        const all = posts();
        if (all.length) results.append(kit.sectionTitle('Explorar'), h('div', { class: 'lm-explore' }, all.map(postTile)));
        return;
      }
      const ps = profiles.filter((p) => normalize(`${p.handle} ${p.name || ''}`).includes(nq));
      const hits = posts().filter((p) => normalize(`${p.caption || ''} ${placeName(p)} ${p.author}`).includes(nq));
      if (ps.length) results.append(kit.sectionTitle('Perfis'), kit.list(ps.map(profileRow)));
      if (hits.length) results.append(kit.sectionTitle('Publicações'), h('div', { class: 'lm-explore flat' }, hits.map(postTile)));
      if (!ps.length && !hits.length) results.append(kit.empty({ icon: 'search', title: 'Nada encontrado', text: `Nenhum resultado para “${q}”.` }));
    };
    const field = kit.search({ placeholder: 'Buscar no Lume', onInput: draw });
    draw('');
    return h('div', { class: 'lm-searchview' }, h('div', { class: 'lm-sbar' }, field), results);
  }

  function notifsView() {
    const list = [...(data.notifications || [])].filter((n) => game.req(n)).sort((a, b) => time.compare(b.at, a.at));
    if (!list.length) return kit.empty({ icon: 'bell', title: 'Sem notificações', text: 'Curtidas, comentários e menções aparecem aqui.' });
    const groups = [['Esta semana', []], ['Antes', []]];
    list.forEach((n) => groups[minsAgo(n.at) < 7 * 1440 ? 0 : 1][1].push(n));
    const wrap = h('div', { class: 'lm-notifs' });
    for (const [title, items] of groups) {
      if (!items.length) continue;
      wrap.append(kit.sectionTitle(title), kit.list(items.map((n) => {
        const actor = n.actor;
        const text = String(n.text || '').replace(/^@/, '');
        const starts = actor && text.toLowerCase().startsWith(String(actor).toLowerCase());
        const thumb = n.post ? postById(n.post) : null;
        return h('button', { class: 'lm-notif', on: { click: () => (thumb ? openPost(thumb) : actor ? openProfile(actor) : null) } },
          actor ? avatar(actor, 44) : h('span', { class: 'lm-notif-ic' }, icon('bell', { size: 20 })),
          h('span', { class: 'lm-notif-tx txt' }, actor && !starts ? h('b', null, actor, ' ') : null, starts ? [h('b', null, text.slice(0, actor.length)), text.slice(actor.length)] : text, h('em', null, ' ' + agoShort(n.at))),
          thumb && arr(thumb.media)[0] ? h('span', { class: 'lm-notif-th' }, kit.img(arr(thumb.media)[0], { alt: '', ratio: '1/1' })) : null);
      })));
    }
    return wrap;
  }

  function meView() { return profileBody(me); }

  /* ---------- raiz ---------- */
  function hasUnreadDM() { return dms().some((d) => { const l = lastMsg(d); return l && l.from !== 'me' && !isSeen('lume:dm:' + d.id); }); }

  function mount() {
    let tab = 'home';
    const views = {};
    const scrolls = {};
    const view = h('div', { class: 'lm-view' });
    const header = h('header', { class: 'lm-top' });
    const nav = h('nav', { class: 'lm-nav', 'aria-label': 'Navegação do Lume' });

    const makeHeader = () => {
      clear(header);
      if (tab === 'home') {
        const dmBtn = kit.iconButton({ icon: 'messages-square', label: 'Mensagens', className: 'lm-dmbtn', onClick: openDMs });
        if (hasUnreadDM()) dmBtn.append(h('i', { class: 'lm-unread' }));
        header.append(kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
          h('span', { class: 'lm-wordmark' }, 'lume', h('i', null)), h('span', { class: 'lm-sp' }), dmBtn);
      } else if (tab === 'search') {
        header.append(kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }), h('h1', { class: 'lm-h1' }, 'Buscar'));
      } else if (tab === 'notifs') {
        header.append(kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }), h('h1', { class: 'lm-h1' }, 'Notificações'));
      } else {
        header.append(kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }), h('h1', { class: 'lm-h1' }, '@' + me), h('span', { class: 'lm-sp' }),
          kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: profileMenu(me) }));
      }
    };

    const drawNav = () => {
      clear(nav);
      for (const [id, label, ic] of TABS) {
        const on = id === tab;
        nav.append(h('button', { class: `lm-navbtn${on ? ' on' : ''}`, 'aria-current': on ? 'page' : null, 'aria-label': label, on: { click: () => setTab(id) } },
          h('span', { class: 'lm-pill' }, id === 'me' ? kit.avatar({ src: prof(me)?.avatar || '', name: nameOf(me), size: 24 }) : icon(ic, { size: 22, stroke: on ? 2.3 : 1.9 })),
          h('span', { class: 'lm-navlbl' }, label)));
      }
    };

    function setTab(id) {
      if (id === tab && views[id]) { view.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      scrolls[tab] = view.scrollTop;
      tab = id;
      if (!views[id]) views[id] = id === 'home' ? homeView() : id === 'search' ? searchView() : id === 'notifs' ? notifsView() : meView();
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
