// Componentes de interface do celular (kit). Todos retornam Element.
import { h, clear } from '../core/dom.js';
import { icon } from './icons.js';
import { asset, colorFor } from '../core/store.js';
import { toSec, duration as fmtDur } from '../core/time.js';
import { sfx } from '../core/sfx.js';

// Injetado pelo shell para evitar import circular.
let PHONE = null, GAME = null;
export function _bind(phone, game) { PHONE = phone; GAME = game; }

/* ---------- básicos ---------- */
export function iconButton({ icon: name, label, onClick, className = '', size = 22 }) {
  return h('button', { class: `k-iconbtn ${className}`, 'aria-label': label || name, title: label || '', on: { click: (e) => { sfx.play('tap'); onClick?.(e); } } }, icon(name, { size }));
}

export function button({ label, icon: ic, variant = 'filled', onClick, disabled, className = '' }) {
  return h('button', { class: `k-btn ${variant} ${className}`, disabled: !!disabled, on: { click: (e) => { sfx.play('tap'); onClick?.(e); } } }, ic ? icon(ic, { size: 18 }) : null, label);
}

export function fab({ icon: ic = 'plus', label, onClick }) {
  return h('button', { class: 'k-fab', 'aria-label': label || ic, on: { click: onClick } }, icon(ic, { size: 22 }), label ? h('span', null, label) : null);
}

export function badge(n, { red = false } = {}) {
  if (!n) return null;
  return h('span', { class: `k-badge ${red ? 'red' : ''}` }, n > 99 ? '99+' : String(n));
}

export function toggle({ checked = false, onChange, disabled = false, label }) {
  const b = h('button', { class: `k-toggle ${checked ? 'on' : ''}`, role: 'switch', 'aria-checked': String(checked), 'aria-label': label || 'alternar', disabled });
  b.addEventListener('click', () => { const v = !b.classList.contains('on'); b.classList.toggle('on', v); b.setAttribute('aria-checked', String(v)); onChange?.(v); });
  return b;
}

export const divider = () => h('div', { class: 'k-divider' });
export const sectionTitle = (text) => h('div', { class: 'k-section' }, text);

export function empty({ icon: ic = 'inbox', title = 'Nada aqui', text = '' } = {}) {
  return h('div', { class: 'k-empty' }, icon(ic, { size: 44, stroke: 1.5 }), h('h4', null, title), text ? h('p', null, text) : null);
}

export function kv(rows) {
  return h('table', { class: 'k-kv' }, h('tbody', null, rows.filter(Boolean).map(([k, v]) => h('tr', null, h('td', null, k), h('td', { class: 'txt' }, v instanceof Node ? v : String(v ?? '—'))))));
}

/* ---------- avatar e imagem ---------- */
export function initials(name) {
  const clean = String(name || '?').replace(/[^\p{L}\p{N}\s+]/gu, '').trim();
  if (!clean) return '?';
  if (/^\+?\d/.test(clean)) return '#';
  const parts = clean.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function avatar({ src = '', name = '', color, size = 40, ring = false, icon: ic } = {}) {
  const el = h('div', { class: `k-avatar ${ring ? 'ring' : ''}`, style: { width: size + 'px', height: size + 'px', background: color || colorFor(name), fontSize: Math.round(size * 0.38) + 'px' } });
  const fallback = () => { clear(el); if (ic) el.appendChild(icon(ic, { size: Math.round(size * 0.5) })); else el.appendChild(document.createTextNode(initials(name))); };
  if (src) {
    const img = h('img', { src: asset(src), alt: name || '', loading: 'lazy', draggable: 'false' });
    img.addEventListener('error', fallback, { once: true });
    el.appendChild(img);
  } else fallback();
  return el;
}

/** Imagem com placeholder se faltar. ratio: '4/3', '1/1'... */
export function img(src, { alt = '', className = '', ratio, onClick, fit = 'cover', loading = 'lazy' } = {}) {
  const box = h('div', { class: `k-img ${className}`, style: ratio ? { aspectRatio: ratio } : null });
  const im = h('img', { src: asset(src), alt, loading, draggable: 'false', style: { objectFit: fit } });
  im.addEventListener('error', () => { box.classList.add('missing'); clear(box); box.appendChild(icon('image', { size: 28, stroke: 1.5 })); if (alt) box.title = alt; }, { once: true });
  box.appendChild(im);
  if (onClick) { box.style.cursor = 'pointer'; box.addEventListener('click', onClick); }
  return box;
}

/* ---------- barra superior ---------- */
export function appBar({ title = '', subtitle = '', back = true, onBack, avatar: av, actions = [], color, className = '' } = {}) {
  const bar = h('header', { class: `k-appbar ${color ? 'tinted' : ''} ${className}`, style: color ? { '--k-bar': color } : null });
  if (back) bar.appendChild(iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => (onBack ? onBack() : PHONE?.back()) }));
  if (av) bar.appendChild(av instanceof Node ? av : avatar({ ...av, size: av.size || 38 }));
  bar.appendChild(h('div', { class: 'ttl' }, h('h1', null, title), subtitle ? h('p', null, subtitle) : null));
  for (const a of actions) if (a) bar.appendChild(a instanceof Node ? a : iconButton(a));
  return bar;
}

/* ---------- listas ---------- */
export const list = (children) => h('div', { class: 'k-list' }, children);

export function listItem({ avatar: av, icon: ic, iconColor, title, subtitle, meta, badge: bd, trailing, onClick, dim, unread, className = '', subIcon } = {}) {
  let lead = null;
  if (av) lead = av instanceof Node ? av : avatar({ ...av, size: av.size || 46 });
  else if (ic) lead = h('div', { class: 'k-ic', style: iconColor ? { background: iconColor, color: '#fff' } : null }, icon(ic, { size: 20 }));
  const tag = onClick ? 'button' : 'div';
  return h(tag, { class: `k-item ${dim ? 'dim' : ''} ${unread ? 'unread' : ''} ${className}`, on: onClick ? { click: (e) => { sfx.play('tap'); onClick(e); } } : null },
    lead ? h('div', { class: 'k-lead' }, lead) : null,
    h('div', { class: 'k-main' },
      h('div', { class: 'k-title' }, title),
      subtitle !== undefined && subtitle !== null && subtitle !== '' ? h('div', { class: 'k-sub' }, subIcon ? icon(subIcon, { size: 14 }) : null, h('span', { style: 'overflow:hidden;text-overflow:ellipsis' }, subtitle)) : null),
    (meta || bd || trailing) ? h('div', { class: 'k-meta' }, meta ? h('span', null, meta) : null, bd ? (bd instanceof Node ? bd : badge(bd)) : null, trailing || null) : null);
}

/* ---------- abas, chips, busca ---------- */
export function tabs({ items, active, onChange }) {
  const wrap = h('div', { class: 'k-tabs', role: 'tablist' });
  const draw = (cur) => {
    clear(wrap);
    for (const t of items) wrap.appendChild(h('button', { class: `k-tab ${t.id === cur ? 'on' : ''}`, role: 'tab', 'aria-selected': String(t.id === cur), on: { click: () => { sfx.play('tap'); draw(t.id); onChange?.(t.id); } } }, t.label, t.badge ? badge(t.badge) : null));
  };
  draw(active ?? items[0]?.id);
  return wrap;
}

export function chip({ label, icon: ic, active = false, onClick }) {
  return h('button', { class: `k-chip ${active ? 'on' : ''}`, on: { click: () => { sfx.play('tap'); onClick?.(); } } }, ic ? icon(ic, { size: 16 }) : null, label);
}

export function chips({ items, active, onChange }) {
  const wrap = h('div', { class: 'k-chips' });
  const draw = (cur) => { clear(wrap); for (const c of items) wrap.appendChild(chip({ label: c.label, icon: c.icon, active: c.id === cur, onClick: () => { draw(c.id); onChange?.(c.id); } })); };
  draw(active ?? items[0]?.id);
  return wrap;
}

export function search({ placeholder = 'Pesquisar', onInput, value = '', autofocus = false } = {}) {
  const inp = h('input', { type: 'search', placeholder, value, 'aria-label': placeholder, autocomplete: 'off', spellcheck: 'false' });
  let t = null;
  inp.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => onInput?.(inp.value), 120); });
  const el = h('label', { class: 'k-search' }, icon('search', { size: 20 }), inp);
  if (autofocus) setTimeout(() => inp.focus(), 250);
  el.input = inp;
  return el;
}

/* ---------- menu ---------- */
export function menu(anchor, items) {
  const root = anchor.closest('.phone') || document.body;
  const r = anchor.getBoundingClientRect(), pr = root.getBoundingClientRect();
  const m = h('div', { class: 'k-menu', role: 'menu', style: { top: (r.bottom - pr.top + 4) + 'px', right: Math.max(8, pr.right - r.right) + 'px' } },
    items.filter(Boolean).map(it => h('button', { class: it.danger ? 'danger' : '', role: 'menuitem', on: { click: () => { close(); it.onClick?.(); } } }, it.icon ? icon(it.icon, { size: 18 }) : null, it.label)));
  const close = () => { m.remove(); document.removeEventListener('pointerdown', outside, true); };
  const outside = (e) => { if (!m.contains(e.target)) close(); };
  root.appendChild(m);
  setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
  return close;
}

/* ---------- Quadro (pins) ---------- */
export function pinButton({ key, label, app, detail }) {
  const b = h('button', { class: 'k-pin' });
  const draw = () => { const on = GAME?.isPinned(key); b.classList.toggle('on', !!on); clear(b); b.appendChild(icon(on ? 'check' : 'pin', { size: 15 })); b.appendChild(document.createTextNode(on ? 'Fixado no Quadro' : 'Fixar no Quadro')); };
  b.addEventListener('click', (e) => { e.stopPropagation(); if (GAME?.isPinned(key)) GAME.unpin(key); else { GAME?.pin({ key, label, app, detail }); sfx.play('pin'); } draw(); });
  draw();
  return b;
}

/* ---------- visualizador de imagens ---------- */
export function imageViewer(images, index = 0) {
  if (!PHONE) return;
  let i = index, scale = 1, tx = 0, ty = 0;
  const imgEl = h('img', { alt: '' });
  const stage = h('div', { class: 'stagev' }, imgEl);
  const title = h('b'), sub = h('small');
  const info = h('div', { class: 'vinfo' });
  const root = h('div', { class: 'k-viewer', role: 'dialog', 'aria-label': 'Foto' });
  const close = () => { root.remove(); PHONE._popModal?.(close); };
  const apply = () => { imgEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
  const reset = () => { scale = 1; tx = 0; ty = 0; imgEl.style.transformOrigin = 'center center'; apply(); };
  const show = () => {
    const it = images[i];
    imgEl.src = asset(it.src);
    imgEl.alt = it.title || '';
    imgEl.onerror = () => { imgEl.removeAttribute('src'); imgEl.alt = 'Imagem indisponível'; };
    title.textContent = it.title || '';
    sub.textContent = it.subtitle || '';
    reset();
    info.classList.remove('show');
    clear(info);
    info.append(h('div', { class: 'grab', style: 'width:36px;height:4px;border-radius:2px;background:#666;margin:8px auto' }), h('h4', null, 'Detalhes'), it.desc ? h('div', { class: 'desc txt' }, it.desc) : null, kv(it.info || []));
    if (it.key) GAME?.see(it.key);
    prev.hidden = i === 0; next.hidden = i === images.length - 1;
    foot.querySelector('.pinwrap')?.replaceWith(h('div', { class: 'pinwrap' }, it.key ? pinButton({ key: it.key, label: it.title || 'Foto', app: it.app || 'galeria', detail: it.subtitle }) : null));
  };
  const prev = h('button', { class: 'navbtn l', 'aria-label': 'Anterior', on: { click: () => { if (i > 0) { i--; show(); } } } }, icon('chevron-left'));
  const next = h('button', { class: 'navbtn r', 'aria-label': 'Próxima', on: { click: () => { if (i < images.length - 1) { i++; show(); } } } }, icon('chevron-right'));
  const zoomBy = (f) => { scale = Math.min(6, Math.max(1, scale * f)); if (scale === 1) { tx = 0; ty = 0; } apply(); };
  const foot = h('div', { class: 'vfoot' },
    h('button', { on: { click: () => zoomBy(1.6) } }, icon('zoom-in'), 'Ampliar'),
    h('button', { on: { click: () => zoomBy(1 / 1.6) } }, icon('zoom-out'), 'Reduzir'),
    h('button', { on: { click: () => info.classList.toggle('show') } }, icon('info'), 'Detalhes'),
    h('div', { class: 'pinwrap' }));
  root.append(h('div', { class: 'vbar' }, iconButton({ icon: 'arrow-left', label: 'Fechar', onClick: close }), h('div', { class: 'ttl' }, title, sub)), stage, prev, next, foot, info);
  // zoom/pan: roda, arrastar, pinça, duplo toque
  stage.addEventListener('wheel', (e) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
  let pts = new Map(), last = null, lastDist = 0, lastTap = 0;
  stage.addEventListener('pointerdown', (e) => { stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, e); last = { x: e.clientX, y: e.clientY }; const now = Date.now(); if (now - lastTap < 280) { scale > 1 ? reset() : zoomBy(2.2); } lastTap = now; });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (lastDist) zoomBy(d / lastDist); lastDist = d; return; }
    if (scale > 1 && last) { tx += e.clientX - last.x; ty += e.clientY - last.y; apply(); }
    last = { x: e.clientX, y: e.clientY };
  });
  const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) lastDist = 0; };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  PHONE._mountModal(root, close);
  show();
  return close;
}

/* ---------- player de áudio simulado ---------- */
export function audioPlayer({ title = 'Áudio', at = '', duration = 30, transcript = [], key, compact = false } = {}) {
  const total = Math.max(1, toSec(duration));
  let pos = 0, playing = false, timer = null, speed = 1;
  const bars = Array.from({ length: 42 }, (_, k) => { const v = 0.25 + Math.abs(Math.sin(k * 1.7 + total)) * 0.75; return h('i', { style: { height: Math.round(8 + v * 28) + 'px' } }); });
  const wave = h('div', { class: 'wave', role: 'slider', 'aria-label': 'Posição do áudio', 'aria-valuemin': '0', 'aria-valuemax': String(total) }, bars);
  const tNow = h('span', null, '0:00'), tTot = h('span', null, fmtDur(total));
  const playBtn = h('button', { class: 'play', 'aria-label': 'Tocar' }, icon('play', { size: 22 }));
  const spd = h('button', { class: 'speed', 'aria-label': 'Velocidade' }, '1x');
  const lines = transcript.map(l => h('div', { class: `ln ${l.kind || 'speech'}`, dataset: { t: String(toSec(l.t)) } }, h('span', { class: 't' }, l.t), h('div', { class: 'txt' }, l.who ? h('span', { class: 'who' }, l.who) : null, l.text)));
  const tr = transcript.length ? h('div', { class: 'k-transcript' }, lines) : null;
  const draw = () => {
    const p = pos / total;
    bars.forEach((b, k) => b.classList.toggle('on', k / bars.length < p));
    tNow.textContent = fmtDur(pos);
    wave.setAttribute('aria-valuenow', String(Math.round(pos)));
    let cur = null;
    for (const ln of lines) { if (+ln.dataset.t <= pos) cur = ln; ln.classList.remove('now'); }
    if (cur && playing) { cur.classList.add('now'); if (!compact) cur.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  };
  const stop = () => { playing = false; clearInterval(timer); clear(playBtn).appendChild(icon('play', { size: 22 })); playBtn.setAttribute('aria-label', 'Tocar'); };
  const play = () => {
    if (key) GAME?.see(key);
    if (pos >= total) pos = 0;
    playing = true; clear(playBtn).appendChild(icon('pause', { size: 22 })); playBtn.setAttribute('aria-label', 'Pausar');
    clearInterval(timer);
    timer = setInterval(() => { pos = Math.min(total, pos + 0.25 * speed * 4); draw(); if (pos >= total) stop(); if (!el.isConnected) stop(); }, 250);
  };
  playBtn.addEventListener('click', () => (playing ? stop() : play()));
  spd.addEventListener('click', () => { speed = speed === 1 ? 2 : speed === 2 ? 4 : 1; spd.textContent = speed + 'x'; });
  wave.addEventListener('click', (e) => { const r = wave.getBoundingClientRect(); pos = Math.max(0, Math.min(total, ((e.clientX - r.left) / r.width) * total)); if (key) GAME?.see(key); draw(); });
  lines.forEach(ln => ln.addEventListener('click', () => { pos = +ln.dataset.t; draw(); }));
  const el = h('div', { class: 'k-audio-wrap' },
    h('div', { class: 'k-audio' },
      compact ? null : h('div', { style: 'font-weight:600;margin-bottom:10px;display:flex;justify-content:space-between;gap:8px' }, h('span', null, title), at ? h('span', { style: 'color:var(--ph-mut);font-weight:400;font-size:13px' }, at) : null),
      h('div', { class: 'row' }, playBtn, wave, spd),
      h('div', { class: 'times' }, tNow, tTot)),
    tr);
  draw();
  return el;
}
