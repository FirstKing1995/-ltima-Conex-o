// Google Maps (modo escuro) — mapa, Linha do tempo e a última localização do aparelho (até sáb 23:47).
// Raiz: mapa em tela cheia, barra "Pesquise aqui", chips, painel inferior arrastável e abas Explorar / Você / Contribuir.
// Subtelas: pesquisa de lugares e a Linha do tempo de cada dia (com navegação entre os dias).
import { h, clear, esc } from '../core/dom.js';
import { icon, iconSvg, ICONS } from '../ui/icons.js';
import * as time from '../core/time.js';

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTR = '© OpenStreetMap';

/* cores de categoria no estilo do Google Maps (modo escuro) */
const KINDS = {
  casa: { icon: 'house', color: '#8ab4f8', label: 'Casa' },
  trabalho: { icon: 'laptop', color: '#8ab4f8', label: 'Trabalho' },
  cafe: { icon: 'coffee', color: '#fcad70', label: 'Cafeteria' },
  mirante: { icon: 'mountain', color: '#81c995', label: 'Mirante' },
  evento: { icon: 'tent', color: '#ff8bcb', label: 'Espaço de eventos' },
  rodoviaria: { icon: 'bus', color: '#78a9ff', label: 'Rodoviária' },
  hotel: { icon: 'bed', color: '#ff8bcb', label: 'Hotel' },
  restaurante: { icon: 'utensils', color: '#fcad70', label: 'Restaurante' },
  igreja: { icon: 'landmark', color: '#78d9ec', label: 'Igreja' },
  museu: { icon: 'landmark', color: '#78d9ec', label: 'Museu' },
  loja: { icon: 'store', color: '#8ab4f8', label: 'Loja' },
  fazenda: { icon: 'sprout', color: '#81c995', label: 'Sítio' },
  outro: { icon: 'map-pin', color: '#bdc1c6', label: 'Lugar' },
};
const kindOf = (k) => KINDS[k] || KINDS.outro;

/* modos de deslocamento (Linha do tempo) — trajeto sempre em azul, a pé pontilhado */
const MODES = {
  walk: { icon: 'footprints', label: 'Caminhando', dash: '1 9' },
  car: { icon: 'car', label: 'Dirigindo', dash: null },
  bus: { icon: 'bus', label: 'De ônibus', dash: null },
  van: { icon: 'bus', label: 'De van', dash: null },
  ride: { icon: 'car', label: 'Corrida Uber', dash: null },
};
const modeOf = (m) => MODES[m] || MODES.car;
const ROUTE = '#4c8df6', ROUTE_CASE = '#1b4fa8';

/* chips da raiz */
const CHIPS = [
  { id: 'casa', label: 'Casa', icon: 'house', kinds: ['casa'], one: true },
  { id: 'trabalho', label: 'Trabalho', icon: 'laptop', kinds: ['trabalho'], one: true },
  { id: 'food', label: 'Restaurantes', icon: 'utensils', kinds: ['restaurante', 'cafe'] },
  { id: 'cafe', label: 'Cafés', icon: 'coffee', kinds: ['cafe'] },
  { id: 'hotel', label: 'Hotéis', icon: 'bed', kinds: ['hotel'] },
  { id: 'shop', label: 'Compras', icon: 'store', kinds: ['loja'] },
  { id: 'transit', label: 'Transporte', icon: 'bus', kinds: ['rodoviaria'] },
];

const GPIN = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#ea4335" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><path fill="#4285f4" d="M12 2c3.9 0 7 3.1 7 7 0 1.6-.7 3.4-1.6 5.1L12 9z" opacity=".9"/><path fill="#fbbc04" d="M6.6 14.1C5.7 12.4 5 10.6 5 9l7 0z" opacity=".9"/><circle cx="12" cy="9" r="2.6" fill="#1f1f1f"/></svg>';
const DROP = '<svg viewBox="0 0 28 40" width="28" height="40" aria-hidden="true"><path d="M14 1C6.8 1 1 6.7 1 13.8 1 23.5 14 39 14 39s13-15.5 13-25.2C27 6.7 21.2 1 14 1z" fill="#ea4335" stroke="#a50e0e" stroke-width="1.4"/><circle cx="14" cy="14" r="5" fill="#a50e0e"/></svg>';

const num = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
const isNum = (v) => Number.isFinite(num(v));
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const coord = (lat, lng) => `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
const iconOr = (name, fb) => (ICONS[name] ? name : fb);
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function fmtKm(km) {
  const v = num(km);
  if (!Number.isFinite(v)) return '';
  if (v < 1) return `${Math.round(v * 1000)} m`;
  return `${(v >= 100 ? Math.round(v) : Math.round(v * 10) / 10).toLocaleString('pt-BR')} km`;
}
const minutesBetween = (a, b) => Math.max(0, Math.round((time.parse(b) - time.parse(a)) / 60000));
function fmtMin(m) {
  if (m < 60) return `${m} min`;
  const hh = Math.floor(m / 60), mm = m % 60;
  return mm ? `${hh} h ${String(mm).padStart(2, '0')} min` : `${hh} h`;
}
const dayTitle = (date) => { const d = time.parse(date); return `${cap(time.weekdayLong(date))}, ${d.getDate()} de ${time.monthName(d.getMonth())}`; };
const dayShortTitle = (date) => { const d = time.parse(date); return `${cap(time.weekday(date))}., ${d.getDate()} de ${time.monthShort(d.getMonth())}.`; };

/* ---------- dados ---------- */
function indexData(data, game) {
  const places = new Map((data.places || []).map((p) => [p.id, p]));
  const days = (data.days || []).filter((d) => game.req(d)).map((d) => ({ ...d, segments: (d.segments || []).filter((s) => game.req(s)) }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const visits = new Map(); // lugar -> [{date, start, end}]
  for (const d of days) {
    for (const s of d.segments) {
      if (s.type !== 'visit' || !s.place) continue;
      if (!visits.has(s.place)) visits.set(s.place, []);
      visits.get(s.place).push({ date: d.date, start: s.start, end: s.end });
    }
  }
  const last = data.last && isNum(data.last.lat) && isNum(data.last.lng) ? data.last : null;
  return { places, days, visits, last };
}

function segPath(seg, places) {
  const pts = (seg.path || []).filter((p) => Array.isArray(p) && isNum(p[0]) && isNum(p[1])).map((p) => [Number(p[0]), Number(p[1])]);
  if (pts.length >= 2) return pts;
  const a = places.get(seg.from), b = places.get(seg.to);
  if (a && b && isNum(a.lat) && isNum(a.lng) && isNum(b.lat) && isNum(b.lng)) return [[Number(a.lat), Number(a.lng)], [Number(b.lat), Number(b.lng)]];
  return pts;
}

function dayStats(day) {
  let km = 0, hasKm = false;
  const ids = new Set();
  const modes = new Set();
  for (const s of day.segments || []) {
    if (s.type === 'move' && isNum(s.km)) { km += Number(s.km); hasKm = true; }
    if (s.type === 'move') modes.add(s.mode || 'car');
    if (s.type === 'visit' && s.place) ids.add(s.place);
  }
  if (isNum(day.km)) { km = Number(day.km); hasKm = true; }
  return { km, hasKm, places: ids.size, modes: [...modes] };
}

/** Miniatura do trajeto do dia (estilo cartão da Linha do tempo). */
function miniRoute(day, places) {
  const pts = [];
  for (const s of day.segments || []) {
    if (s.type === 'move') segPath(s, places).forEach((p) => pts.push(p));
    else { const pl = places.get(s.place); if (pl && isNum(pl.lat) && isNum(pl.lng)) pts.push([Number(pl.lat), Number(pl.lng)]); }
  }
  if (!pts.length) return h('span', { class: 'rt-mini empty' }, icon('map-pin', { size: 20 }));
  const W = 56, pad = 9;
  const lat0 = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const kx = Math.cos((lat0 * Math.PI) / 180);
  const xy = pts.map((p) => [p[1] * kx, -p[0]]);
  const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX, hg = maxY - minY;
  let svg;
  if (w < 1e-6 && hg < 1e-6) {
    svg = `<circle cx="${W / 2}" cy="${W / 2}" r="5" fill="${ROUTE}" stroke="#fff" stroke-width="1.6"/>`;
  } else {
    const sc = Math.min((W - pad * 2) / (w || 1e-9), (W - pad * 2) / (hg || 1e-9));
    const ox = (W - w * sc) / 2, oy = (W - hg * sc) / 2;
    const P = xy.map((p) => [ox + (p[0] - minX) * sc, oy + (p[1] - minY) * sc]);
    const poly = P.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const a = P[0], b = P[P.length - 1];
    svg = `<polyline points="${poly}" fill="none" stroke="${ROUTE_CASE}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<polyline points="${poly}" fill="none" stroke="${ROUTE}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="3" fill="#202124" stroke="#e8eaed" stroke-width="1.5"/>`
      + `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="3.6" fill="#ea4335" stroke="#fff" stroke-width="1.2"/>`;
  }
  return h('span', { class: 'rt-mini', html: `<svg viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" aria-hidden="true">${svg}</svg>` });
}

/* ---------- mapa (Leaflet) ---------- */
function gridLayerClass(L) {
  // Fundo de reserva: se os blocos não carregarem (offline), o mapa continua com uma grade discreta que acompanha o zoom.
  return L.GridLayer.extend({
    createTile() {
      const s = this.getTileSize();
      const c = document.createElement('canvas');
      c.width = s.x; c.height = s.y;
      const g = c.getContext('2d');
      g.fillStyle = '#1f2023';
      g.fillRect(0, 0, s.x, s.y);
      g.lineWidth = 1;
      g.strokeStyle = 'rgba(255,255,255,.035)';
      g.beginPath();
      for (let i = 1; i < 4; i++) { const v = Math.round((i * s.x) / 4) + 0.5; g.moveTo(v, 0); g.lineTo(v, s.y); g.moveTo(0, v); g.lineTo(s.x, v); }
      g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.07)';
      g.beginPath();
      g.moveTo(0.5, 0); g.lineTo(0.5, s.y); g.moveTo(0, 0.5); g.lineTo(s.x, 0.5);
      g.stroke();
      return c;
    },
  });
}

function placeIcon(L, place, sel) {
  const k = kindOf(place.kind);
  return L.divIcon({
    className: 'rt-pinwrap',
    html: `<span class="rt-pin${sel ? ' sel' : ''}" style="--c:${k.color}"><span class="rt-pin-dot">${iconSvg(iconOr(k.icon, 'map-pin'), { size: 13, stroke: 2.4 })}</span><span class="rt-drop">${DROP}</span><span class="rt-lbl">${esc(place.name || '')}</span></span>`,
    iconSize: [26, 26], iconAnchor: [13, 13],
  });
}

function lastIcon(L, last) {
  return L.divIcon({
    className: 'rt-pinwrap',
    html: `<span class="rt-me"><i></i><b></b><em>Última conexão · ${esc(time.hhmm(last.at))}</em></span>`,
    iconSize: [30, 30], iconAnchor: [15, 15],
  });
}

function onSized(el, fn) {
  if (el.clientWidth > 0 && el.clientHeight > 0) { fn(); return; }
  if (typeof ResizeObserver === 'undefined') { setTimeout(fn, 300); return; }
  const ro = new ResizeObserver(() => { if (el.clientWidth > 0 && el.clientHeight > 0) { ro.disconnect(); fn(); } });
  ro.observe(el);
}

/**
 * Cria o mapa dentro de `box`. Devolve um controlador (ou um falso, se o Leaflet não estiver disponível).
 * offset(): deslocamento vertical (px) para centralizar acima do painel inferior.
 */
function createMap(box, { places, onPlace, onLast, onSeg, attribution = true, offset } = {}) {
  const L = window.L;
  const noop = () => {};
  if (!L) {
    box.classList.add('rt-nomap');
    box.append(h('div', { class: 'rt-nomap-msg' }, icon('map', { size: 30, stroke: 1.5 }), h('b', null, 'Mapa indisponível'), h('small', null, 'A lista continua funcionando.')));
    return { ok: false, addPlace: noop, addRoute: noop, addLast: noop, selectPlace: noop, selectSeg: noop, focusLast: noop, fit: noop, whenReady: (f) => f(), flyTo: noop, clearSel: noop };
  }
  const map = L.map(box, { zoomControl: false, attributionControl: false, zoomSnap: 0.5, zoomDelta: 1, minZoom: 3, maxZoom: 19, inertia: true, bounceAtZoomLimits: false });
  map.setView([-4.1659, -40.7461], 12); // Serra da Ibiapaba: vista padrão até o app enquadrar os pontos
  if (attribution) L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map);
  const Grid = gridLayerClass(L);
  new Grid({ tileSize: 256, minZoom: 3, maxZoom: 19, zIndex: 1 }).addTo(map);
  const tiles = L.tileLayer(TILE_URL, { minZoom: 3, maxZoom: 19, zIndex: 2, attribution: ATTR, className: 'rt-osm' });
  let ok = 0, bad = 0;
  tiles.on('tileload', () => { ok++; box.classList.remove('rt-offline'); });
  tiles.on('tileerror', () => { bad++; if (!ok && bad >= 3) box.classList.add('rt-offline'); });
  tiles.addTo(map);
  box.append(h('span', { class: 'rt-offline-tag' }, icon('wifi-off', { size: 13 }), 'Mapa base indisponível'));

  const layer = L.layerGroup().addTo(map);
  const markers = new Map();   // id do lugar -> { mk, place, sel }
  const routes = [];           // { line, casing, idx, bounds }
  const syncLabels = () => box.classList.toggle('rt-lbls', map.getZoom() >= 14.5);
  map.on('zoomend', syncLabels);
  syncLabels();

  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { if (box.clientWidth > 0) map.invalidateSize({ animate: false }); }).observe(box);
  requestAnimationFrame(() => map.invalidateSize({ animate: false }));
  setTimeout(() => map.invalidateSize({ animate: false }), 320);

  /** centro do mapa que deixa `ll` no meio da área visível (acima do painel) */
  const centerFor = (ll, z) => {
    const off = Number(offset?.()) || 0;
    if (!off) return L.latLng(ll);
    return map.unproject(map.project(L.latLng(ll), z).add([0, off]), z);
  };
  const unselect = () => {
    for (const [, m] of markers) if (m.sel) { m.sel = false; m.mk.setIcon(placeIcon(L, m.place, false)); m.mk.setZIndexOffset(0); }
  };
  const dimRoutes = () => { for (const r of routes) { r.line.setStyle({ opacity: 0.9, weight: 5 }); r.casing.setStyle({ opacity: 0.9, weight: 8 }); } };

  const ctrl = {
    ok: true, map,
    whenReady(fn) { onSized(box, () => { map.invalidateSize({ animate: false }); fn(); }); },
    addPlace(place) {
      if (!place || !isNum(place.lat) || !isNum(place.lng) || markers.has(place.id)) return;
      const mk = L.marker([Number(place.lat), Number(place.lng)], { icon: placeIcon(L, place, false), keyboard: true, title: place.name, riseOnHover: true });
      mk.on('click', () => onPlace?.(place));
      mk.addTo(layer);
      markers.set(place.id, { mk, place, sel: false });
    },
    selectPlace(id, { fly = true } = {}) {
      for (const [pid, m] of markers) {
        const on = pid === id;
        if (on !== m.sel) { m.sel = on; m.mk.setIcon(placeIcon(L, m.place, on)); m.mk.setZIndexOffset(on ? 1200 : 0); }
      }
      dimRoutes();
      const m = markers.get(id);
      if (m && fly) { const z = Math.max(map.getZoom(), 15.5); map.flyTo(centerFor(m.mk.getLatLng(), z), z, { duration: 0.7 }); }
    },
    clearSel() { unselect(); dimRoutes(); },
    addRoute(seg, idx) {
      const pts = segPath(seg, places);
      if (pts.length < 2) return;
      const mode = modeOf(seg.mode);
      const walk = !!mode.dash;
      const casing = L.polyline(pts, { color: ROUTE_CASE, weight: walk ? 0 : 8, opacity: walk ? 0 : 0.9, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(layer);
      const line = L.polyline(pts, { color: ROUTE, weight: 5, opacity: 0.9, dashArray: mode.dash, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
      line.on('click', () => onSeg?.(idx));
      routes.push({ line, casing, idx, walk, bounds: line.getBounds() });
    },
    selectSeg(idx) {
      unselect();
      let hit = null;
      for (const r of routes) {
        const on = r.idx === idx;
        r.line.setStyle({ opacity: on ? 1 : 0.3, weight: on ? 7 : 5 });
        if (!r.walk) r.casing.setStyle({ opacity: on ? 1 : 0.25, weight: on ? 11 : 8 });
        if (on) { r.line.bringToFront(); hit = r; }
      }
      if (hit) map.flyToBounds(hit.bounds, { padding: [44, 44], maxZoom: 17, duration: 0.7 });
    },
    addLast(last) {
      const ll = [Number(last.lat), Number(last.lng)];
      if (isNum(last.accuracy)) L.circle(ll, { radius: Number(last.accuracy), color: '#4285f4', weight: 1, opacity: 0.6, fillColor: '#4285f4', fillOpacity: 0.18, interactive: false }).addTo(layer);
      const mk = L.marker(ll, { icon: lastIcon(L, last), zIndexOffset: 2000, keyboard: true, title: last.label || 'Última conexão' });
      mk.on('click', () => onLast?.());
      mk.addTo(layer);
    },
    focusLast(last, zoom = 16.5) {
      unselect(); dimRoutes();
      map.flyTo(centerFor([Number(last.lat), Number(last.lng)], zoom), zoom, { duration: 0.8 });
    },
    flyTo(ll, zoom) { map.flyTo(centerFor(ll, zoom), zoom, { duration: 0.7 }); },
    setView(ll, zoom) { map.setView(centerFor(ll, zoom), zoom, { animate: false }); },
    fit(points, opts = {}) {
      const pts = points.filter((p) => p && isNum(p[0]) && isNum(p[1]));
      if (!pts.length) return;
      if (pts.length === 1) { const z = opts.zoom || 15; map.setView(centerFor(pts[0], z), z, { animate: !!opts.animate }); return; }
      const o = { maxZoom: opts.maxZoom || 16, animate: !!opts.animate };
      o.paddingTopLeft = opts.tl || [42, 42];
      o.paddingBottomRight = opts.br || [42, 42];
      map.fitBounds(L.latLngBounds(pts), o);
    },
  };
  return ctrl;
}

/* ---------- painel inferior arrastável ---------- */
function bottomSheet(sheet, handle, stage, { onSnap } = {}) {
  const PEEK = 128, TOP = 112;
  let snap = 1, drag = null;
  const heights = () => { const H = stage.clientHeight || 600; return [PEEK, Math.round(H * 0.46), Math.max(PEEK + 40, H - TOP)]; };
  const set = (i) => {
    snap = Math.max(0, Math.min(2, i));
    sheet.style.height = '';
    sheet.classList.remove('dragging');
    sheet.dataset.snap = String(snap);
    onSnap?.(snap);
  };
  handle.addEventListener('pointerdown', (e) => {
    if (e.button || e.target.closest('button:not(.rt-grabbtn)')) return;
    drag = { y: e.clientY, y0: e.clientY, h: sheet.offsetHeight, t: performance.now(), moved: false, id: e.pointerId };
    try { handle.setPointerCapture(e.pointerId); } catch { /* */ }
  });
  handle.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y0;
    if (Math.abs(dy) > 5) drag.moved = true;
    if (!drag.moved) return;
    const hs = heights();
    const nh = Math.max(hs[0] - 40, Math.min(hs[2], drag.h - dy));
    sheet.classList.add('dragging');
    sheet.style.height = nh + 'px';
    const now = performance.now();
    drag.v = (e.clientY - drag.y) / Math.max(1, now - drag.t); // px/ms, positivo = para baixo
    drag.y = e.clientY; drag.t = now;
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved) { if (e.type === 'pointerup') set(snap === 2 ? 1 : snap + 1); return; }
    const hs = heights(), cur = sheet.offsetHeight, v = d.v || 0;
    let i = hs.reduce((b, x, k) => (Math.abs(x - cur) < Math.abs(hs[b] - cur) ? k : b), 0);
    if (v > 0.45) i = Math.max(0, hs.filter((x) => x < cur - 4).length - 1);
    else if (v < -0.45) { const k = hs.findIndex((x) => x > cur + 4); i = k < 0 ? 2 : k; }
    set(i);
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
  sheet.dataset.snap = String(snap);
  return { set, get: () => snap, height: () => sheet.offsetHeight };
}

export default {
  id: 'rotas',
  title: 'Maps',
  cloud: false,

  render(ctx) {
    const r = createRotas(ctx);
    r.mountRoot();
    r.handleParams();
  },

  search({ data, game }) {
    const { places, days, last } = indexData(data, game);
    const out = [];
    for (const d of days) {
      for (const s of d.segments) {
        if (s.type === 'visit') {
          const pl = places.get(s.place);
          if (!pl) continue;
          out.push({ title: `${pl.name} · ${time.dayLabel(d.date)}`, text: [pl.address, s.note].filter(Boolean).join(' — ') || kindOf(pl.kind).label, params: { day: d.date }, at: s.start });
        } else if (s.note) {
          out.push({ title: `${modeOf(s.mode).label} · ${time.dayLabel(d.date)}`, text: s.note, params: { day: d.date }, at: s.start });
        }
      }
      if (d.summary) out.push({ title: `${time.dayLabel(d.date)} · linha do tempo`, text: d.summary, params: { day: d.date }, at: d.date });
    }
    if (last) {
      const pl = places.get(last.place);
      out.push({ title: `${last.label || 'Última conexão'} · ${pl?.name || 'localização'}`, text: `Última localização do aparelho, ${time.dayLabel(last.at)} ${time.hhmm(last.at)}, precisão ${last.accuracy || '?'} m`, params: { last: true }, at: last.at });
    }
    return out;
  },
};

function createRotas(ctx) {
  const { el, kit, phone, game, data, params, store } = ctx;
  const { places, days, visits, last } = indexData(data, game);
  const lastPlace = last ? places.get(last.place) : null;
  const lastName = lastPlace?.name || last?.label || 'Local desconhecido';
  const accTxt = last && isNum(last.accuracy) ? `precisão de ${Math.round(Number(last.accuracy))} m` : '';
  const readOnly = (what) => phone.toast(`${what}: indisponível na extração (somente leitura)`, { icon: 'info' });

  const seeLast = () => {
    game.see('rotas:last');
    if (last?.onSee?.length) game.flags(last.onSee);
  };

  const placeList = [...places.values()].sort((a, b) => (visits.get(b.id)?.length || 0) - (visits.get(a.id)?.length || 0) || String(a.name).localeCompare(String(b.name), 'pt-BR'));
  const dayOf = (date) => days.find((d) => d.date === date);

  /* ---------- linha de lugar (lista) ---------- */
  function placeRow(pl, { onClick, history = false }) {
    const k = kindOf(pl.kind);
    const v = visits.get(pl.id) || [];
    return h('button', { class: 'rt-place', on: { click: () => onClick(pl) } },
      h('span', { class: `rt-place-ic${history ? ' hist' : ''}`, style: `--c:${k.color}` }, icon(history ? 'history' : iconOr(k.icon, 'map-pin'), { size: 19 })),
      h('span', { class: 'rt-place-tx' }, h('b', null, pl.name), h('small', null, pl.address || k.label)),
      v.length ? h('span', { class: 'rt-place-n' }, plural(v.length, 'visita', 'visitas')) : null);
  }

  /* ---------- raiz ---------- */
  function mountRoot() {
    const mapBox = h('div', { class: 'rt-map', role: 'application', 'aria-label': 'Mapa' });
    const stage = h('div', { class: 'rt-stage' });
    let ctrl = null, sheetCtl = null;
    let mode = 'main';

    const visibleOffset = () => {
      const sh = sheetCtl ? sheetCtl.height() : 0;
      return Math.max(0, Math.round((sh - 120) / 2));
    };
    const fitPts = (pts, opts = {}) => {
      if (!ctrl?.ok) return;
      const sh = sheetCtl ? sheetCtl.height() : 0;
      ctrl.fit(pts, { animate: true, tl: [40, 128], br: [40, sh + 24], ...opts });
    };
    const fitAll = () => {
      const pts = [...places.values()].filter((p) => isNum(p.lat) && isNum(p.lng)).map((p) => [Number(p.lat), Number(p.lng)]);
      if (last) pts.push([Number(last.lat), Number(last.lng)]);
      fitPts(pts, { maxZoom: 12 });
    };
    const focusLast = () => {
      if (!last) { phone.toast('Sem localização registrada', { icon: 'map-pin' }); return; }
      seeLast();
      if (mode !== 'main') showMain();
      if (sheetCtl?.get() === 2) sheetCtl.set(1);
      ctrl?.focusLast(last);
      const card = sheetBody.querySelector('.rt-lastcard');
      card?.classList.add('flash');
      setTimeout(() => card?.classList.remove('flash'), 900);
    };

    /* barra de pesquisa flutuante + chips */
    const who = store?.avatarOf ? store.avatarOf('iara') : { name: 'Iara' };
    const avBtn = h('button', { class: 'rt-avbtn', 'aria-label': 'Conta e Linha do tempo' }, kit.avatar({ ...who, size: 32 }));
    avBtn.addEventListener('click', () => kit.menu(avBtn, [
      { icon: 'history', label: 'Sua linha do tempo', onClick: () => goTimeline() },
      { icon: 'bookmark', label: 'Seus lugares', onClick: () => showList('Seus lugares', placeList) },
      last ? { icon: 'locate-fixed', label: 'Última localização', onClick: focusLast } : null,
      { icon: 'settings', label: 'Configurações', onClick: () => readOnly('Configurações') },
    ]));
    const searchBar = h('div', { class: 'rt-search' },
      h('button', { class: 'rt-search-hit', on: { click: () => openSearch() }, 'aria-label': 'Pesquise aqui' },
        h('span', { class: 'rt-gpin', html: GPIN }),
        h('span', { class: 'rt-search-ph' }, 'Pesquise aqui')),
      h('button', { class: 'rt-search-ic', 'aria-label': 'Pesquisa por voz', on: { click: () => readOnly('Pesquisa por voz') } }, icon('mic', { size: 21 })),
      avBtn);

    let chipOn = null;
    const chipsRow = h('div', { class: 'rt-chips' });
    const drawChips = () => {
      clear(chipsRow);
      for (const c of CHIPS) {
        const b = h('button', { class: `rt-chip${chipOn === c.id ? ' on' : ''}`, on: { click: () => pickChip(c) } }, icon(c.icon, { size: 16 }), c.label);
        chipsRow.append(b);
      }
    };
    function pickChip(c) {
      const list = placeList.filter((p) => c.kinds.includes(p.kind));
      if (!list.length) { phone.toast(`Nenhum lugar em "${c.label}" no histórico`, { icon: 'map-pin' }); return; }
      if (c.one) { chipOn = null; drawChips(); selectPlace(list[0]); return; }
      chipOn = chipOn === c.id ? null : c.id;
      drawChips();
      if (!chipOn) { showMain(); return; }
      showList(c.label, list);
      fitPts(list.filter((p) => isNum(p.lat)).map((p) => [Number(p.lat), Number(p.lng)]), { maxZoom: 15 });
    }
    drawChips();

    let lightMap = false;
    const layersBtn = h('button', { class: 'rt-mapbtn rt-layers', 'aria-label': 'Tipo de mapa', title: 'Tipo de mapa', on: { click: () => { lightMap = !lightMap; mapBox.classList.toggle('rt-lightmap', lightMap); phone.toast(lightMap ? 'Mapa claro' : 'Mapa escuro', { icon: 'layers' }); } } }, icon('layers', { size: 20 }));

    const top = h('div', { class: 'rt-top' }, searchBar, chipsRow, layersBtn);

    /* painel inferior */
    const sheetBody = h('div', { class: 'rt-sheet-body' });
    const handle = h('div', { class: 'rt-sheet-handle' }, h('button', { class: 'rt-grabbtn', 'aria-label': 'Expandir ou recolher o painel' }, h('i')));
    const locBtn = h('button', { class: 'rt-mapbtn rt-locate', 'aria-label': 'Ir para a última localização', title: 'Última localização', on: { click: focusLast } }, icon('locate-fixed', { size: 22 }));
    const fitBtn = h('button', { class: 'rt-mapbtn rt-fitall', 'aria-label': 'Ver todos os lugares', title: 'Ver todos os lugares', on: { click: fitAll } }, icon('maximize-2', { size: 19 }));
    const sheet = h('section', { class: 'rt-sheet', 'aria-label': 'Painel' },
      h('span', { class: 'rt-credit' }, ATTR),
      h('div', { class: 'rt-sheet-fabs' }, fitBtn, locBtn),
      handle, sheetBody);
    stage.append(mapBox, top, sheet);

    /* abas inferiores do Maps */
    let tab = 'explore';
    const tabsEl = h('nav', { class: 'rt-tabs', 'aria-label': 'Abas do Maps' });
    const TABS = [
      { id: 'explore', label: 'Explorar', icon: 'map-pin' },
      { id: 'you', label: 'Você', icon: 'bookmark' },
      { id: 'contrib', label: 'Contribuir', icon: 'plus' },
    ];
    const drawTabs = () => {
      clear(tabsEl);
      for (const t of TABS) tabsEl.append(h('button', { class: `rt-tab${tab === t.id ? ' on' : ''}`, 'aria-current': tab === t.id ? 'page' : null, on: { click: () => pickTab(t.id) } }, h('span', { class: 'rt-tab-ic' }, icon(t.icon, { size: 21 })), h('span', null, t.label)));
    };
    function pickTab(id) {
      if (id === 'contrib') { readOnly('Contribuir'); return; }
      tab = id; drawTabs();
      if (id === 'explore') { showMain(); sheetCtl.set(1); sheetBody.scrollTo({ top: 0 }); }
      else goTimeline();
    }
    drawTabs();

    el.append(h('div', { class: 'rt-root' }, stage, tabsEl));
    sheetCtl = bottomSheet(sheet, handle, stage, { onSnap: (s) => stage.classList.toggle('rt-full', s === 2) });

    /* conteúdo do painel: principal */
    function showMain() {
      mode = 'main';
      chipOn = null; drawChips();
      ctrl?.clearSel();
      clear(sheetBody);
      if (last) {
        sheetBody.append(h('button', { class: 'rt-lastcard', on: { click: focusLast }, 'aria-label': `Última localização: ${lastName}, ${time.weekday(last.at)} ${time.hhmm(last.at)}` },
          h('span', { class: 'rt-lastdot' }, h('i'), h('b')),
          h('span', { class: 'rt-lastcard-tx' },
            h('small', null, 'Última localização do aparelho'),
            h('b', null, lastName),
            h('span', null, `${cap(time.weekday(last.at))}., ${time.dateShort(last.at)} às ${time.hhmm(last.at)}${accTxt ? ` · ${accTxt}` : ''}`)),
          icon('chevron-right', { size: 20 })));
      }
      const tlHead = h('div', { class: 'rt-sec rt-sec-tl' }, h('h2', null, 'Sua linha do tempo'), h('span', { class: 'rt-sec-sub' }, icon('lock', { size: 13 }), 'Só você pode ver'));
      sheetBody.append(tlHead);
      if (days.length) {
        sheetBody.append(h('div', { class: 'rt-days' }, days.map((d) => {
          const st = dayStats(d);
          const hasLast = last && time.ymd(last.at) === d.date;
          const meta = [st.hasKm ? fmtKm(st.km) : '', st.places ? plural(st.places, 'lugar', 'lugares') : ''].filter(Boolean).join(' · ');
          return h('button', { class: 'rt-dayrow', on: { click: () => openDay(d) }, 'aria-label': `${dayTitle(d.date)}. ${d.summary || ''}. ${meta}` },
            miniRoute(d, places),
            h('span', { class: 'rt-dayrow-tx' },
              h('b', null, dayTitle(d.date), hasLast ? h('i', { class: 'rt-dot', title: 'Inclui a última conexão' }) : null),
              h('small', null, d.summary || 'Sem resumo'),
              h('span', { class: 'rt-dayrow-meta' }, st.modes.slice(0, 3).map((m) => icon(modeOf(m).icon, { size: 13 })), meta)),
            icon('chevron-right', { size: 20 }));
        })));
      } else sheetBody.append(kit.empty({ icon: 'route', title: 'Sem histórico', text: 'O aparelho não guardou trajetos.' }));

      if (placeList.length) {
        sheetBody.append(h('div', { class: 'rt-sec' }, h('h2', null, 'Lugares visitados')));
        const box = h('div', { class: 'rt-places' });
        let showAll = false;
        const draw = () => {
          clear(box);
          (showAll ? placeList : placeList.slice(0, 5)).forEach((pl) => box.append(placeRow(pl, { onClick: selectPlace })));
          if (placeList.length > 5) box.append(h('button', { class: 'rt-showall', on: { click: () => { showAll = !showAll; draw(); } } }, showAll ? 'Mostrar menos' : `Ver todos os ${placeList.length} lugares`, icon(showAll ? 'chevron-up' : 'chevron-down', { size: 18 })));
        };
        draw();
        sheetBody.append(box);
      }
      sheetBody.append(h('div', { class: 'rt-end' }));
      sheetBody.scrollTo?.({ top: 0 });
    }

    function goTimeline() {
      tab = 'you'; drawTabs();
      if (mode !== 'main') showMain();
      sheetCtl.set(2);
      setTimeout(() => {
        const hd = sheetBody.querySelector('.rt-sec-tl');
        if (hd) sheetBody.scrollTo({ top: Math.max(0, hd.offsetTop - 8), behavior: 'smooth' });
      }, 280);
    }

    /* lista (chips / seus lugares) */
    function showList(title, list) {
      mode = 'list';
      clear(sheetBody);
      sheetBody.append(h('div', { class: 'rt-pv-head' }, h('h2', null, title), h('button', { class: 'rt-x', 'aria-label': 'Fechar', on: { click: showMain } }, icon('x', { size: 20 }))),
        h('div', { class: 'rt-places' }, list.map((pl) => placeRow(pl, { onClick: selectPlace }))),
        h('div', { class: 'rt-end' }));
      sheetBody.scrollTo?.({ top: 0 });
      if (sheetCtl.get() === 0) sheetCtl.set(1);
    }

    /* detalhes do lugar */
    function selectPlace(pl) {
      ctrl?.selectPlace(pl.id);
      showPlace(pl);
    }
    function showPlace(pl) {
      mode = 'place';
      const k = kindOf(pl.kind);
      const v = (visits.get(pl.id) || []).slice().sort((a, b) => time.compare(b.start, a.start));
      clear(sheetBody);
      const act = (ic, label, primary) => h('button', { class: `rt-act${primary ? ' pri' : ''}`, on: { click: () => readOnly(label) } }, icon(ic, { size: 18 }), label);
      sheetBody.append(
        h('div', { class: 'rt-pv-head' }, h('h2', null, pl.name), h('button', { class: 'rt-x', 'aria-label': 'Fechar', on: { click: showMain } }, icon('x', { size: 20 }))),
        h('div', { class: 'rt-pv-kind' }, k.label, v.length ? ` · ${plural(v.length, 'visita', 'visitas')}` : ''),
        h('div', { class: 'rt-acts' }, act('navigation', 'Rotas', true), act('bookmark', 'Salvar'), act('share-2', 'Compartilhar')),
        h('div', { class: 'rt-pv-rows' },
          pl.address ? h('div', { class: 'rt-row' }, icon('map-pin', { size: 18 }), h('span', { class: 'txt' }, pl.address)) : null,
          isNum(pl.lat) ? h('div', { class: 'rt-row' }, icon('crosshair', { size: 18 }), h('span', { class: 'txt' }, coord(pl.lat, pl.lng))) : null,
          v.length ? h('div', { class: 'rt-row' }, icon('history', { size: 18 }), h('span', null, `Última visita: ${time.dayLabel(v[0].start)} às ${time.hhmm(v[0].start)}`)) : null));
      if (v.length) {
        sheetBody.append(h('div', { class: 'rt-sec' }, h('h2', null, 'Suas visitas')),
          h('div', { class: 'rt-visits' }, v.map((x) => {
            const d = dayOf(x.date);
            return h('button', { class: 'rt-visit', on: { click: () => { if (d) openDay(d); } } },
              h('span', { class: 'rt-visit-ic' }, icon('calendar', { size: 18 })),
              h('span', { class: 'rt-visit-tx' }, h('b', null, dayTitle(x.date)), h('small', null, `${time.hhmm(x.start)} – ${x.end ? time.hhmm(x.end) : '…'}`)),
              icon('chevron-right', { size: 18 }));
          })));
      }
      sheetBody.append(h('div', { class: 'rt-end' }));
      sheetBody.scrollTo?.({ top: 0 });
      if (sheetCtl.get() !== 1) sheetCtl.set(1);
    }

    /* tela de pesquisa */
    function openSearch() {
      phone.push({
        className: 'rt-sub rt-searchscr',
        render(body) {
          const list = h('div', { class: 'rt-places rt-sresults' });
          const inp = h('input', { type: 'search', placeholder: 'Pesquise aqui', 'aria-label': 'Pesquise aqui', autocomplete: 'off', spellcheck: 'false' });
          const draw = () => {
            clear(list);
            const q = fold(inp.value).trim();
            const res = q ? placeList.filter((p) => fold(`${p.name} ${p.address || ''} ${kindOf(p.kind).label}`).includes(q)) : placeList;
            if (!q) list.append(h('div', { class: 'rt-sres-h' }, 'Recentes'));
            if (!res.length) { list.append(kit.empty({ icon: 'search', title: 'Nenhum resultado', text: 'Só aparecem lugares do histórico deste aparelho.' })); return; }
            res.forEach((pl) => list.append(placeRow(pl, { history: !q, onClick: (p) => { phone.back(); setTimeout(() => selectPlace(p), 260); } })));
          };
          inp.addEventListener('input', draw);
          body.append(h('div', { class: 'rt-sbar' },
            kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
            inp,
            h('button', { class: 'rt-search-ic', 'aria-label': 'Pesquisa por voz', on: { click: () => readOnly('Pesquisa por voz') } }, icon('mic', { size: 21 }))),
          h('div', { class: 'rt-schips' }, CHIPS.slice(2).map((c) => h('button', { class: 'rt-chip', on: { click: () => { phone.back(); setTimeout(() => pickChip(c), 260); } } }, icon(c.icon, { size: 16 }), c.label))),
          list);
          draw();
          setTimeout(() => inp.focus(), 260);
        },
      });
    }

    showMain();

    /* mapa */
    ctrl = createMap(mapBox, {
      places,
      attribution: false,
      offset: visibleOffset,
      onPlace: (pl) => selectPlace(pl),
      onLast: focusLast,
    });
    for (const pl of places.values()) ctrl.addPlace(pl);
    const recent = days[0];
    if (recent) recent.segments.forEach((s, i) => { if (s.type === 'move') ctrl.addRoute(s, i); });
    if (last) ctrl.addLast(last);
    ctrl.whenReady(() => {
      if (ctrl.ok && last) ctrl.setView([Number(last.lat), Number(last.lng)], 15);
      else fitAll();
      if (params?.last) focusLast();
    });
  }

  /* ---------- Linha do tempo de um dia ---------- */
  function openDay(day) {
    phone.push({ className: 'rt-sub rt-daysub', render: (body, nav) => renderDay(body, nav, day) });
  }

  function renderDay(body, nav, day) {
    game.see('rotas:day:' + day.date);
    if (day.onSee?.length) game.flags(day.onSee);
    const st = dayStats(day);
    const showLast = !!last && time.ymd(last.at) === day.date;
    const segs = day.segments;
    const usedPlaces = [...new Set(segs.filter((s) => s.type === 'visit' && s.place).map((s) => s.place))].map((id) => places.get(id)).filter(Boolean);
    const idx = days.findIndex((d) => d.date === day.date);
    const older = idx >= 0 ? days[idx + 1] : null, newer = idx > 0 ? days[idx - 1] : null;
    const go = (d) => { if (d) nav.replace({ render: (b, n) => renderDay(b, n, d) }); };
    const pickDay = () => phone.sheet({
      title: 'Escolher um dia',
      render: (sb, close) => sb.append(h('div', { class: 'rt-pick' }, days.map((d) => h('button', { class: `rt-pick-d${d.date === day.date ? ' on' : ''}`, on: { click: () => { close(); if (d.date !== day.date) setTimeout(() => go(d), 200); } } },
        icon('calendar', { size: 18 }), h('span', null, h('b', null, dayTitle(d.date)), h('small', null, d.summary || '')))))),
    });

    const mapBox = h('div', { class: 'rt-map', role: 'application', 'aria-label': `Mapa do dia ${dayTitle(day.date)}` });
    const tl = h('div', { class: 'rt-tl' });
    const panel = h('div', { class: 'rt-panel' },
      h('div', { class: 'rt-daysum' },
        h('div', { class: 'rt-daysum-tx' }, h('b', { class: 'txt' }, day.summary || 'Linha do tempo'),
          h('span', null, [st.hasKm ? fmtKm(st.km) : '', st.places ? plural(st.places, 'lugar', 'lugares') : ''].filter(Boolean).join(' · '))),
        h('div', { class: 'rt-daysum-modes' }, st.modes.map((m) => h('span', { title: modeOf(m).label }, icon(modeOf(m).icon, { size: 15 }))))),
      tl, h('div', { class: 'rt-end' }));

    body.append(h('div', { class: 'rt-root rt-dayroot' },
      h('header', { class: 'rt-dayhead' },
        kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
        h('h1', null, 'Linha do tempo'),
        kit.iconButton({ icon: 'calendar-days', label: 'Escolher um dia', onClick: pickDay }),
        kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: () => readOnly('Opções da Linha do tempo') })),
      h('div', { class: 'rt-datebar' },
        h('button', { class: 'rt-datenav', 'aria-label': 'Dia anterior', disabled: !older, on: { click: () => go(older) } }, icon('chevron-left', { size: 22 })),
        h('button', { class: 'rt-datepill', on: { click: pickDay } }, h('span', null, dayTitle(day.date)), icon('chevron-down', { size: 16 })),
        h('button', { class: 'rt-datenav', 'aria-label': 'Próximo dia', disabled: !newer, on: { click: () => go(newer) } }, icon('chevron-right', { size: 22 }))),
      h('div', { class: 'rt-mapbox' }, mapBox),
      panel));

    const rows = [];
    let ctrl = null;

    const select = (i, { scroll = false, map = true } = {}) => {
      rows.forEach((r, k) => { r.el.classList.toggle('open', k === i); r.el.setAttribute('aria-expanded', String(k === i)); });
      const r = rows[i];
      if (!r) return;
      if (map && ctrl) r.focus();
      if (scroll) {
        const p = panel.getBoundingClientRect(), q = r.el.getBoundingClientRect();
        panel.scrollBy({ top: q.top - p.top - 70, behavior: 'smooth' });
      }
    };
    const bindRow = (rowEl) => {
      rowEl.addEventListener('click', (e) => { if (e.target.closest('.k-pin')) return; select(rows.findIndex((x) => x.el === rowEl)); });
      rowEl.addEventListener('keydown', (e) => { if (e.target !== rowEl) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(rows.findIndex((x) => x.el === rowEl)); } });
    };

    segs.forEach((s, i) => {
      if (s.type === 'visit') {
        const pl = places.get(s.place);
        if (!pl) return;
        const k = kindOf(pl.kind);
        const end = s.end || (showLast ? last.at : s.start);
        const mins = minutesBetween(s.start, end);
        const more = h('div', { class: 'rt-seg-more' },
          pl.address ? h('div', { class: 'rt-row' }, icon('map-pin', { size: 15 }), h('span', { class: 'txt' }, pl.address)) : null,
          isNum(pl.lat) ? h('div', { class: 'rt-row' }, icon('crosshair', { size: 15 }), h('span', { class: 'txt' }, coord(pl.lat, pl.lng))) : null,
          h('div', { class: 'rt-row' }, icon('clock', { size: 15 }), h('span', { class: 'txt' }, `Ficou ${fmtMin(mins)}`)),
          s.note ? h('p', { class: 'rt-note txt' }, s.note) : null,
          kit.pinButton({ key: `rotas:seg:${day.date}:${time.hhmm(s.start)}`, label: `${pl.name} · ${time.hhmm(s.start)}–${time.hhmm(end)}`, app: 'rotas', detail: `${time.dayLabel(day.date)}${pl.address ? ' · ' + pl.address : ''}` }));
        const row = h('div', { class: 'rt-seg is-visit', role: 'button', tabindex: '0', 'aria-expanded': 'false', style: `--c:${k.color}` },
          h('span', { class: 'rt-rail' }, h('span', { class: 'rt-node' }, icon(iconOr(k.icon, 'map-pin'), { size: 17 }))),
          h('div', { class: 'rt-seg-body' },
            h('div', { class: 'rt-seg-title' }, pl.name),
            h('div', { class: 'rt-seg-meta txt' }, `${time.hhmm(s.start)} – ${time.hhmm(end)}`),
            more));
        rows.push({ el: row, kind: 'visit', placeId: pl.id, focus: () => ctrl.selectPlace(pl.id) });
        tl.append(row);
      } else if (s.type === 'move') {
        const m = modeOf(s.mode);
        const from = places.get(s.from), to = places.get(s.to);
        const mins = minutesBetween(s.start, s.end || s.start);
        const dist = isNum(s.km) ? fmtKm(s.km) : '';
        const head = [m.label, dist, fmtMin(mins)].filter(Boolean).join(' · ');
        const more = h('div', { class: 'rt-seg-more' },
          from || to ? h('div', { class: 'rt-row' }, icon('route', { size: 15 }), h('span', { class: 'txt' }, `${from?.name || '—'} → ${to?.name || '—'}`)) : null,
          h('div', { class: 'rt-row' }, icon('clock', { size: 15 }), h('span', { class: 'txt' }, `${time.hhmm(s.start)} – ${time.hhmm(s.end || s.start)}`)),
          s.note ? h('p', { class: 'rt-note txt' }, s.note) : null,
          kit.pinButton({ key: `rotas:seg:${day.date}:${time.hhmm(s.start)}`, label: head, app: 'rotas', detail: `${from?.name || ''} → ${to?.name || ''} · ${time.dayLabel(day.date)} ${time.hhmm(s.start)}` }));
        const row = h('div', { class: `rt-seg is-move mode-${s.mode || 'car'}${m.dash ? ' dashed' : ''}`, role: 'button', tabindex: '0', 'aria-expanded': 'false' },
          h('span', { class: 'rt-rail' }, h('span', { class: 'rt-node small' }, icon(m.icon, { size: 15 }))),
          h('div', { class: 'rt-seg-body' },
            h('div', { class: 'rt-seg-move txt' }, head),
            more));
        rows.push({ el: row, kind: 'move', segIdx: i, focus: () => ctrl.selectSeg(i) });
        tl.append(row);
      }
    });

    if (showLast) {
      const more = h('div', { class: 'rt-seg-more' },
        h('div', { class: 'rt-row' }, icon('crosshair', { size: 15 }), h('span', { class: 'txt' }, coord(last.lat, last.lng))),
        isNum(last.accuracy) ? h('div', { class: 'rt-row' }, icon('locate-fixed', { size: 15 }), h('span', { class: 'txt' }, `Precisão de ${Math.round(Number(last.accuracy))} m`)) : null,
        h('div', { class: 'rt-row' }, icon('power', { size: 15 }), h('span', { class: 'txt' }, 'O aparelho não se conectou mais depois deste ponto.')),
        kit.pinButton({ key: 'rotas:last', label: `Última conexão · ${time.hhmm(last.at)} · ${lastName}`, app: 'rotas', detail: `${time.dayLabel(last.at)}${isNum(last.accuracy) ? ` · precisão ${Math.round(Number(last.accuracy))} m` : ''}` }));
      const row = h('div', { class: 'rt-seg is-last', role: 'button', tabindex: '0', 'aria-expanded': 'false' },
        h('span', { class: 'rt-rail' }, h('span', { class: 'rt-node me' }, h('i'), h('b'))),
        h('div', { class: 'rt-seg-body' },
          h('div', { class: 'rt-seg-title' }, 'Última conexão'),
          h('div', { class: 'rt-seg-meta txt' }, `${time.hhmm(last.at)} — ${lastName}${isNum(last.accuracy) ? ` (precisão ${Math.round(Number(last.accuracy))} m)` : ''}`),
          more));
      rows.push({ el: row, kind: 'last', focus: () => { seeLast(); ctrl.focusLast(last); } });
      tl.append(row);
    }

    if (!rows.length) tl.append(kit.empty({ icon: 'route', title: 'Nada registrado', text: 'O aparelho não guardou lugares neste dia.' }));
    rows.forEach((r) => bindRow(r.el));
    if (rows.length) { rows[0].el.classList.add('first'); rows[rows.length - 1].el.classList.add('lastrow'); }

    /* mapa do dia */
    const pickRow = (pred) => { const i = rows.findIndex(pred); if (i >= 0) select(i, { scroll: true }); return i; };
    ctrl = createMap(mapBox, {
      places,
      onPlace: (pl) => { if (pickRow((r) => r.kind === 'visit' && r.placeId === pl.id) < 0) ctrl.selectPlace(pl.id); },
      onLast: () => pickRow((r) => r.kind === 'last'),
      onSeg: (segIdx) => pickRow((r) => r.kind === 'move' && r.segIdx === segIdx),
    });
    usedPlaces.forEach((pl) => ctrl.addPlace(pl));
    segs.forEach((s, i) => { if (s.type === 'move') ctrl.addRoute(s, i); });
    if (showLast) ctrl.addLast(last);
    const pts = [];
    usedPlaces.forEach((pl) => { if (isNum(pl.lat) && isNum(pl.lng)) pts.push([Number(pl.lat), Number(pl.lng)]); });
    segs.forEach((s) => { if (s.type === 'move') segPath(s, places).forEach((p) => pts.push(p)); });
    if (showLast) pts.push([Number(last.lat), Number(last.lng)]);
    ctrl.whenReady(() => ctrl.fit(pts, { tl: [36, 40], br: [110, 36], maxZoom: 16 }));
  }

  function handleParams() {
    const { day } = params || {};
    if (day) {
      const d = days.find((x) => x.date === day);
      if (d) openDay(d);
    }
  }

  return { mountRoot, handleParams };
}
