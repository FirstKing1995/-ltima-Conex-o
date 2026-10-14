// Rotas — mapa, linha do tempo e a última localização do aparelho (até sáb 23:47).
import { h, clear, esc } from '../core/dom.js';
import { icon, iconSvg, ICONS } from '../ui/icons.js';
import * as time from '../core/time.js';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTR = '© OpenStreetMap © CARTO';

const KINDS = {
  casa: { icon: 'house', color: '#f2b880', label: 'Casa' },
  trabalho: { icon: 'laptop', color: '#8fb8ff', label: 'Trabalho' },
  cafe: { icon: 'coffee', color: '#d9a877', label: 'Café' },
  mirante: { icon: 'mountain', color: '#6fe0a3', label: 'Mirante' },
  evento: { icon: 'tent', color: '#ffd166', label: 'Evento' },
  rodoviaria: { icon: 'bus', color: '#b79cff', label: 'Rodoviária' },
  hotel: { icon: 'bed', color: '#ff9fb2', label: 'Hospedagem' },
  restaurante: { icon: 'utensils', color: '#ffb17a', label: 'Restaurante' },
  igreja: { icon: 'landmark', color: '#e8d9a8', label: 'Igreja' },
  museu: { icon: 'landmark', color: '#e8d9a8', label: 'Cultura' },
  loja: { icon: 'store', color: '#8ee0d3', label: 'Comércio' },
  fazenda: { icon: 'sprout', color: '#9be37a', label: 'Sítio' },
  outro: { icon: 'map-pin', color: '#aab0b8', label: 'Lugar' },
};
const kindOf = (k) => KINDS[k] || KINDS.outro;

const MODES = {
  walk: { icon: 'footprints', label: 'A pé', color: '#f2b880', dash: '6 10' },
  car: { icon: 'car', label: 'De carro', color: '#7aa7ff', dash: null },
  bus: { icon: 'bus', label: 'De ônibus', color: '#52d68a', dash: null },
  van: { icon: 'bus', label: 'De topic', color: '#c4a6ff', dash: null },
  ride: { icon: 'car', label: 'Corrida Bora', color: '#ffd400', dash: null },
};
const modeOf = (m) => MODES[m] || MODES.car;

const num = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
const isNum = (v) => Number.isFinite(num(v));
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const coord = (lat, lng) => `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
const iconOr = (name, fb) => (ICONS[name] ? name : fb);

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
  for (const s of day.segments || []) {
    if (s.type === 'move' && isNum(s.km)) { km += Number(s.km); hasKm = true; }
    if (s.type === 'visit' && s.place) ids.add(s.place);
  }
  if (isNum(day.km)) { km = Number(day.km); hasKm = true; }
  return { km, hasKm, places: ids.size };
}

/** Desenho do trajeto do dia, num quadradinho. */
function miniRoute(day, places) {
  const pts = [];
  for (const s of day.segments || []) {
    if (s.type === 'move') segPath(s, places).forEach((p) => pts.push(p));
    else { const pl = places.get(s.place); if (pl && isNum(pl.lat) && isNum(pl.lng)) pts.push([Number(pl.lat), Number(pl.lng)]); }
  }
  if (!pts.length) return h('span', { class: 'rt-mini empty' }, icon('map-pin', { size: 20 }));
  const W = 56, pad = 8;
  const lat0 = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const kx = Math.cos((lat0 * Math.PI) / 180);
  const xy = pts.map((p) => [p[1] * kx, -p[0]]);
  const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX, hg = maxY - minY;
  let svg;
  if (w < 1e-6 && hg < 1e-6) {
    svg = `<circle cx="${W / 2}" cy="${W / 2}" r="4.5" fill="#f2b880"/>`;
  } else {
    const sc = Math.min((W - pad * 2) / (w || 1e-9), (W - pad * 2) / (hg || 1e-9));
    const ox = (W - w * sc) / 2, oy = (W - hg * sc) / 2;
    const P = xy.map((p) => [ox + (p[0] - minX) * sc, oy + (p[1] - minY) * sc]);
    const poly = P.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const a = P[0], b = P[P.length - 1];
    svg = `<polyline points="${poly}" fill="none" stroke="#f2b880" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`
      + `<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="3" fill="#0b0c0e" stroke="#9aa0a6" stroke-width="1.6"/>`
      + `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="3.4" fill="#f2b880"/>`;
  }
  return h('span', { class: 'rt-mini', html: `<svg viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" aria-hidden="true">${svg}</svg>` });
}

/* ---------- mapa (Leaflet) ---------- */
function gridLayerClass(L) {
  // Fundo de reserva: se os tiles não carregarem (offline), o mapa continua com uma grade discreta que acompanha o zoom.
  return L.GridLayer.extend({
    createTile() {
      const s = this.getTileSize();
      const c = document.createElement('canvas');
      c.width = s.x; c.height = s.y;
      const g = c.getContext('2d');
      g.fillStyle = '#0c0f13';
      g.fillRect(0, 0, s.x, s.y);
      g.lineWidth = 1;
      g.strokeStyle = 'rgba(255,255,255,.032)';
      g.beginPath();
      for (let i = 1; i < 4; i++) { const v = Math.round((i * s.x) / 4) + 0.5; g.moveTo(v, 0); g.lineTo(v, s.y); g.moveTo(0, v); g.lineTo(s.x, v); }
      g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.08)';
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
    html: `<span class="rt-pin${sel ? ' sel' : ''}" style="--c:${k.color}"><span class="rt-pin-dot">${iconSvg(k.icon, { size: 15, stroke: 2.3 })}</span><span class="rt-lbl">${esc(place.name || '')}</span></span>`,
    iconSize: [30, 30], iconAnchor: [15, 15],
  });
}

function lastIcon(L) {
  return L.divIcon({
    className: 'rt-pinwrap',
    html: '<span class="rt-last"><i></i><i></i><b></b><em>Última conexão</em></span>',
    iconSize: [34, 34], iconAnchor: [17, 17],
  });
}

function onSized(el, fn) {
  if (el.clientWidth > 0 && el.clientHeight > 0) { fn(); return; }
  if (typeof ResizeObserver === 'undefined') { setTimeout(fn, 300); return; }
  const ro = new ResizeObserver(() => { if (el.clientWidth > 0 && el.clientHeight > 0) { ro.disconnect(); fn(); } });
  ro.observe(el);
}

/** Cria o mapa dentro de `box`. Devolve um controlador (ou um falso, se o Leaflet não estiver disponível). */
function createMap(box, { places, onPlace, onLast, onSeg } = {}) {
  const L = window.L;
  const noop = () => {};
  if (!L) {
    box.classList.add('rt-nomap');
    box.append(h('div', { class: 'rt-nomap-msg' }, icon('map', { size: 30, stroke: 1.5 }), h('b', null, 'Mapa indisponível'), h('small', null, 'A lista abaixo continua funcionando.')));
    return { ok: false, addPlace: noop, addRoute: noop, addLast: noop, selectPlace: noop, selectSeg: noop, focusLast: noop, fit: noop, whenReady: (f) => f(), flyTo: noop };
  }
  const map = L.map(box, { zoomControl: false, attributionControl: false, zoomSnap: 0.5, zoomDelta: 1, minZoom: 3, maxZoom: 19, inertia: true, bounceAtZoomLimits: false });
  map.setView([-4.1659, -40.7461], 12); // Serra da Ibiapaba: vista padrão até o app enquadrar os pontos
  L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map);
  L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 80 }).addTo(map);
  const Grid = gridLayerClass(L);
  new Grid({ tileSize: 256, minZoom: 3, maxZoom: 19, zIndex: 1 }).addTo(map);
  const tiles = L.tileLayer(TILE_URL, { subdomains: 'abcd', minZoom: 3, maxZoom: 19, zIndex: 2, attribution: ATTR });
  let ok = 0, bad = 0;
  tiles.on('tileload', () => { ok++; box.classList.remove('rt-offline'); });
  tiles.on('tileerror', () => { bad++; if (!ok && bad >= 3) box.classList.add('rt-offline'); });
  tiles.addTo(map);
  box.append(h('span', { class: 'rt-offline-tag' }, icon('wifi-off', { size: 13 }), 'mapa base indisponível'));

  const layer = L.layerGroup().addTo(map);
  const markers = new Map();   // id do lugar -> { mk, place, sel }
  const routes = [];           // { line, casing, idx, bounds }
  let lastMk = null;
  const syncLabels = () => box.classList.toggle('rt-lbls', map.getZoom() >= 14.5);
  map.on('zoomend', syncLabels);
  syncLabels();

  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { if (box.clientWidth > 0) map.invalidateSize({ animate: false }); }).observe(box);
  requestAnimationFrame(() => map.invalidateSize({ animate: false }));
  setTimeout(() => map.invalidateSize({ animate: false }), 320);

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
      for (const r of routes) { r.line.setStyle({ opacity: 0.55, weight: 4 }); r.casing.setStyle({ opacity: 0.35, weight: 8 }); }
      const m = markers.get(id);
      if (m && fly) map.flyTo(m.mk.getLatLng(), Math.max(map.getZoom(), 15.5), { duration: 0.7 });
    },
    addRoute(seg, idx) {
      const pts = segPath(seg, places);
      if (pts.length < 2) return;
      const mode = modeOf(seg.mode);
      const casing = L.polyline(pts, { color: '#04060a', weight: 8, opacity: 0.6, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(layer);
      const line = L.polyline(pts, { color: mode.color, weight: 4, opacity: 0.95, dashArray: mode.dash, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
      line.on('click', () => onSeg?.(idx));
      routes.push({ line, casing, idx, bounds: line.getBounds() });
    },
    selectSeg(idx) {
      for (const [, m] of markers) if (m.sel) { m.sel = false; m.mk.setIcon(placeIcon(L, m.place, false)); m.mk.setZIndexOffset(0); }
      let hit = null;
      for (const r of routes) {
        const on = r.idx === idx;
        r.line.setStyle({ opacity: on ? 1 : 0.28, weight: on ? 6 : 4 });
        r.casing.setStyle({ opacity: on ? 0.7 : 0.14, weight: on ? 10 : 8 });
        if (on) { r.line.bringToFront(); hit = r; }
      }
      if (hit) map.flyToBounds(hit.bounds, { padding: [44, 44], maxZoom: 17, duration: 0.7 });
    },
    addLast(last) {
      const ll = [Number(last.lat), Number(last.lng)];
      if (isNum(last.accuracy)) L.circle(ll, { radius: Number(last.accuracy), color: '#ff6b6b', weight: 1.5, opacity: 0.9, fillColor: '#ff6b6b', fillOpacity: 0.16, dashArray: '3 4', interactive: false }).addTo(layer);
      lastMk = L.marker(ll, { icon: lastIcon(L), zIndexOffset: 2000, keyboard: true, title: last.label || 'Última conexão' });
      lastMk.on('click', () => onLast?.());
      lastMk.addTo(layer);
    },
    focusLast(last, zoom = 16.5) {
      for (const [, m] of markers) if (m.sel) { m.sel = false; m.mk.setIcon(placeIcon(L, m.place, false)); m.mk.setZIndexOffset(0); }
      for (const r of routes) { r.line.setStyle({ opacity: 0.55, weight: 4 }); r.casing.setStyle({ opacity: 0.35, weight: 8 }); }
      map.flyTo([Number(last.lat), Number(last.lng)], zoom, { duration: 0.8 });
    },
    flyTo(ll, zoom) { map.flyTo(ll, zoom, { duration: 0.7 }); },
    fit(points, opts = {}) {
      const pts = points.filter((p) => p && isNum(p[0]) && isNum(p[1]));
      if (!pts.length) return;
      if (pts.length === 1) { map.setView(pts[0], opts.zoom || 15, { animate: false }); return; }
      const o = { maxZoom: opts.maxZoom || 16, animate: !!opts.animate };
      // margem maior à direita: os rótulos dos marcadores saem para a direita do ponto
      if (opts.tl || opts.br) { o.paddingTopLeft = opts.tl || [42, 42]; o.paddingBottomRight = opts.br || [42, 42]; } else o.padding = opts.padding || [42, 42];
      map.fitBounds(L.latLngBounds(pts), o);
    },
  };
  return ctrl;
}

export default {
  id: 'rotas',
  title: 'Rotas',
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
  const { el, kit, phone, game, data, params } = ctx;
  const { places, days, visits, last } = indexData(data, game);
  const lastPlace = last ? places.get(last.place) : null;
  const lastName = lastPlace?.name || last?.label || 'Local desconhecido';

  const seeLast = () => {
    game.see('rotas:last');
    if (last?.onSee?.length) game.flags(last.onSee);
  };

  /* ---------- lista de lugares ---------- */
  function placeRow(pl, { onClick }) {
    const k = kindOf(pl.kind);
    const v = visits.get(pl.id) || [];
    return h('button', { class: 'rt-place', on: { click: () => onClick(pl) } },
      h('span', { class: 'rt-place-ic', style: `--c:${k.color}` }, icon(iconOr(k.icon, 'map-pin'), { size: 19 })),
      h('span', { class: 'rt-place-tx' }, h('b', null, pl.name), h('small', null, pl.address || k.label)),
      h('span', { class: 'rt-place-n' }, v.length ? plural(v.length, 'visita', 'visitas') : k.label));
  }

  /* ---------- raiz ---------- */
  function mountRoot() {
    const mapBox = h('div', { class: 'rt-map', role: 'application', 'aria-label': 'Mapa' });
    let ctrl = null;

    const fitAll = () => {
      if (!ctrl?.ok) return;
      const pts = [...places.values()].filter((p) => isNum(p.lat) && isNum(p.lng)).map((p) => [Number(p.lat), Number(p.lng)]);
      if (last) pts.push([Number(last.lat), Number(last.lng)]);
      ctrl.fit(pts, { animate: true, maxZoom: 12 });
    };
    const focusLast = () => {
      if (!last) { phone.toast('Sem localização registrada', { icon: 'map-pin' }); return; }
      seeLast();
      ctrl?.focusLast(last);
      strip?.classList.add('flash');
      setTimeout(() => strip?.classList.remove('flash'), 900);
    };

    const floatBar = h('div', { class: 'rt-float' },
      kit.iconButton({ icon: 'arrow-left', label: 'Voltar', className: 'rt-fabbtn', onClick: () => phone.back() }),
      h('span', { class: 'rt-chip' }, icon('route', { size: 15 }), 'Rotas'),
      h('span', { class: 'rt-sp' }),
      kit.iconButton({ icon: 'maximize-2', label: 'Ver todos os lugares', className: 'rt-fabbtn', onClick: fitAll }),
      kit.iconButton({ icon: 'locate-fixed', label: 'Ir para a última localização', className: 'rt-fabbtn', onClick: focusLast }));

    /* faixa da última localização */
    const strip = last ? h('button', { class: 'rt-last-strip', 'aria-label': `Última localização: ${lastName}, ${time.weekday(last.at)} ${time.hhmm(last.at)}`, on: { click: focusLast } },
      h('span', { class: 'rt-last-dot' }, h('i'), icon('map-pin', { size: 20 })),
      h('span', { class: 'rt-last-tx' },
        h('small', null, 'Última localização'),
        h('b', null, lastName),
        h('span', null, `${time.weekday(last.at)} ${time.hhmm(last.at)}${isNum(last.accuracy) ? ` · precisão ${Math.round(Number(last.accuracy))} m` : ''}`)),
      icon('chevron-right', { size: 20 })) : null;

    /* linha do tempo */
    const dayRows = days.map((d) => {
      const st = dayStats(d);
      const hasLast = last && time.ymd(last.at) === d.date;
      const meta = [st.hasKm ? fmtKm(st.km) : '', st.places ? plural(st.places, 'lugar', 'lugares') : ''].filter(Boolean).join(' · ');
      return h('button', { class: 'rt-dayrow', on: { click: () => openDay(d) }, 'aria-label': `${dayTitle(d.date)}. ${d.summary || ''}. ${meta}` },
        miniRoute(d, places),
        h('span', { class: 'rt-dayrow-tx' },
          h('b', null, cap(time.dayLabel(d.date)), hasLast ? h('i', { class: 'rt-dot', title: 'Inclui a última conexão' }) : null),
          h('small', null, d.summary || 'Sem resumo'),
          h('span', null, meta)),
        icon('chevron-right', { size: 20 }));
    });

    /* lugares */
    const placeList = [...places.values()].sort((a, b) => (visits.get(b.id)?.length || 0) - (visits.get(a.id)?.length || 0) || String(a.name).localeCompare(String(b.name), 'pt-BR'));
    let showAll = false;
    const placesBox = h('div', { class: 'rt-places' });
    const drawPlaces = () => {
      clear(placesBox);
      const shown = showAll ? placeList : placeList.slice(0, 5);
      shown.forEach((pl) => placesBox.append(placeRow(pl, { onClick: (p) => { ctrl?.selectPlace(p.id); } })));
      if (placeList.length > 5) placesBox.append(h('button', { class: 'rt-showall', on: { click: () => { showAll = !showAll; drawPlaces(); } } }, showAll ? 'Mostrar menos' : `Ver todos os ${placeList.length} lugares`, icon(showAll ? 'chevron-up' : 'chevron-down', { size: 18 })));
    };
    drawPlaces();

    const panel = h('div', { class: 'rt-panel' },
      h('div', { class: 'rt-grab', 'aria-hidden': 'true' }),
      strip,
      kit.sectionTitle('Linha do tempo'),
      dayRows.length ? h('div', { class: 'rt-days' }, dayRows) : kit.empty({ icon: 'route', title: 'Sem histórico', text: 'O aparelho não guardou trajetos.' }),
      placeList.length ? kit.sectionTitle('Lugares salvos') : null,
      placeList.length ? placesBox : null,
      h('div', { class: 'rt-end' }));

    el.append(h('div', { class: 'rt-root' }, h('div', { class: 'rt-mapbox' }, mapBox, floatBar), panel));

    /* mapa */
    ctrl = createMap(mapBox, {
      places,
      onPlace: (pl) => { ctrl.selectPlace(pl.id); highlightPlace(pl.id); },
      onLast: focusLast,
    });
    for (const pl of places.values()) ctrl.addPlace(pl);
    const recent = days[0];
    if (recent) recent.segments.forEach((s, i) => { if (s.type === 'move') ctrl.addRoute(s, i); });
    if (last) ctrl.addLast(last);
    ctrl.whenReady(() => {
      if (ctrl.ok && last) ctrl.map.setView([Number(last.lat), Number(last.lng)], 15, { animate: false });
      else fitAll();
      if (params?.last) focusLast();
    });

    function highlightPlace(id) {
      const idx = placeList.findIndex((p) => p.id === id);
      if (idx >= 5 && !showAll) { showAll = true; drawPlaces(); }
      const row = [...placesBox.querySelectorAll('.rt-place')][idx];
      if (!row) return;
      row.classList.add('flash');
      setTimeout(() => row.classList.remove('flash'), 1200);
      const p = panel.getBoundingClientRect(), r = row.getBoundingClientRect();
      panel.scrollBy({ top: r.top - p.top - 80, behavior: 'smooth' });
    }
  }

  /* ---------- dia ---------- */
  const diaRight = () => 120;
  function openDay(day) {
    game.see('rotas:day:' + day.date);
    if (day.onSee?.length) game.flags(day.onSee);
    const st = dayStats(day);
    const showLast = !!last && time.ymd(last.at) === day.date;
    const segs = day.segments;
    const usedPlaces = [...new Set(segs.filter((s) => s.type === 'visit' && s.place).map((s) => s.place))].map((id) => places.get(id)).filter(Boolean);

    phone.push({
      className: 'rt-sub',
      render(body) {
        const subtitle = [day.summary, st.hasKm ? fmtKm(st.km) : '', st.places ? plural(st.places, 'lugar', 'lugares') : ''].filter(Boolean).join(' · ');
        const mapBox = h('div', { class: 'rt-map', role: 'application', 'aria-label': `Mapa do dia ${dayTitle(day.date)}` });
        const tl = h('div', { class: 'rt-tl' });
        const panel = h('div', { class: 'rt-panel flat' }, tl, h('div', { class: 'rt-end' }));
        body.append(h('div', { class: 'rt-root rt-dayroot' },
          kit.appBar({ title: dayTitle(day.date), subtitle }),
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
              pl.address ? h('div', { class: 'rt-row' }, icon('map-pin', { size: 14 }), h('span', { class: 'txt' }, pl.address)) : null,
              isNum(pl.lat) ? h('div', { class: 'rt-row' }, icon('crosshair', { size: 14 }), h('span', { class: 'txt' }, coord(pl.lat, pl.lng))) : null,
              s.note ? h('p', { class: 'rt-note txt' }, s.note) : null,
              kit.pinButton({ key: `rotas:seg:${day.date}:${time.hhmm(s.start)}`, label: `${pl.name} · ${time.hhmm(s.start)}–${time.hhmm(end)}`, app: 'rotas', detail: `${time.dayLabel(day.date)}${pl.address ? ' · ' + pl.address : ''}` }));
            const row = h('div', { class: 'rt-seg is-visit', role: 'button', tabindex: '0', 'aria-expanded': 'false', style: `--c:${k.color}` },
              h('span', { class: 'rt-rail' }, h('span', { class: 'rt-node' }, icon(iconOr(k.icon, 'map-pin'), { size: 18 }))),
              h('div', { class: 'rt-seg-body' },
                h('div', { class: 'rt-seg-title' }, pl.name),
                h('div', { class: 'rt-seg-meta txt' }, `${time.hhmm(s.start)} – ${time.hhmm(end)} · ${fmtMin(mins)}`),
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
              from || to ? h('div', { class: 'rt-row' }, icon('route', { size: 14 }), h('span', { class: 'txt' }, `${from?.name || '—'} → ${to?.name || '—'}`)) : null,
              h('div', { class: 'rt-row' }, icon('clock', { size: 14 }), h('span', { class: 'txt' }, `${time.hhmm(s.start)} – ${time.hhmm(s.end || s.start)}`)),
              s.note ? h('p', { class: 'rt-note txt' }, s.note) : null,
              kit.pinButton({ key: `rotas:seg:${day.date}:${time.hhmm(s.start)}`, label: head, app: 'rotas', detail: `${from?.name || ''} → ${to?.name || ''} · ${time.dayLabel(day.date)} ${time.hhmm(s.start)}` }));
            const row = h('div', { class: `rt-seg is-move mode-${s.mode || 'car'}${m.dash ? ' dashed' : ''}`, role: 'button', tabindex: '0', 'aria-expanded': 'false', style: `--c:${m.color}` },
              h('span', { class: 'rt-rail' }, h('span', { class: 'rt-node small' }, icon(m.icon, { size: 14 }))),
              h('div', { class: 'rt-seg-body' },
                h('div', { class: 'rt-seg-move txt' }, head),
                more));
            rows.push({ el: row, kind: 'move', segIdx: i, focus: () => ctrl.selectSeg(i) });
            tl.append(row);
          }
        });

        if (showLast) {
          const more = h('div', { class: 'rt-seg-more' },
            h('div', { class: 'rt-row' }, icon('crosshair', { size: 14 }), h('span', { class: 'txt' }, coord(last.lat, last.lng))),
            isNum(last.accuracy) ? h('div', { class: 'rt-row' }, icon('locate-fixed', { size: 14 }), h('span', { class: 'txt' }, `Precisão de ${Math.round(Number(last.accuracy))} m`)) : null,
            h('div', { class: 'rt-row' }, icon('power', { size: 14 }), h('span', { class: 'txt' }, 'O aparelho não se conectou mais depois deste ponto.')),
            kit.pinButton({ key: 'rotas:last', label: `Última conexão · ${time.hhmm(last.at)} · ${lastName}`, app: 'rotas', detail: `${time.dayLabel(last.at)}${isNum(last.accuracy) ? ` · precisão ${Math.round(Number(last.accuracy))} m` : ''}` }));
          const row = h('div', { class: 'rt-seg is-last', role: 'button', tabindex: '0', 'aria-expanded': 'false', style: '--c:#ff6b6b' },
            h('span', { class: 'rt-rail' }, h('span', { class: 'rt-node' }, h('i', { class: 'rt-bullet' }, '●'))),
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
        ctrl.whenReady(() => ctrl.fit(pts, { tl: [36, 40], br: [diaRight(), 36], maxZoom: 16 }));
      },
    });
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
