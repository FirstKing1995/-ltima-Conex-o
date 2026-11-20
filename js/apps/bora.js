// Uber — corridas por aplicativo, no visual atual do app (preto e branco, modo escuro). Histórico do aparelho de Iara.
// Raiz com abas Início / Serviços / Atividade / Conta. Subtela: detalhes da viagem com mapa, Parada, Corrida dividida e recibo.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

/* ---------- utilidades ---------- */
const pad = (n) => String(n).padStart(2, '0');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n) => time.money(n);
const num1 = (n) => Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const endOf = (t) => new Date(time.parse(t.at).getTime() + (Number(t.minutes) || 0) * 60000);
const shortDate = (at) => `${time.weekday(at)}, ${time.dateShort(at)}`;
const uberDate = (at) => { const d = time.parse(at); return `${d.getDate()} de ${time.monthShort(d.getMonth())}.`; };
const longDate = (at) => `${cap(time.weekdayLong(at))}, ${time.dateLong(at).replace(/ de \d{4}$/, '')}`;
const monthKey = (at) => { const d = time.parse(at); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
const monthLabel = (at) => { const d = time.parse(at); return `${cap(time.monthName(d.getMonth()))} de ${d.getFullYear()}`; };
const splitName = (s) => { const [a, ...b] = String(s || '').split(' · '); return { main: a, sub: b.join(' · ') }; };

function maskPlate(p) {
  const s = String(p || '').toUpperCase();
  if (/[•*]/.test(s)) return s;
  const c = s.replace(/[^A-Z0-9]/g, '');
  if (c.length < 5) return '•••-••••';
  return `${c.slice(0, 3)}-•••${c.slice(-1)}`;
}
const payLabel = (t) => {
  const p = t.payment;
  if (!p) return 'Pix';
  if (typeof p === 'string') return p;
  return [p.method || p.type || 'Cartão', p.last4 ? `•••• ${p.last4}` : p.label || ''].filter(Boolean).join(' ');
};
const payIcon = (label) => (/pix/i.test(label) ? 'qr-code' : /dinheiro|esp[ée]cie/i.test(label) ? 'banknote' : 'credit-card');
const CAR_COLORS = { prata: '#c7cbd1', branco: '#f3f3f3', branca: '#f3f3f3', preto: '#2a2a2a', preta: '#2a2a2a', cinza: '#8a8f98', vermelho: '#e0443a', vermelha: '#e0443a', azul: '#3b7cf0', verde: '#3fae6a', amarelo: '#ffd400', bege: '#d8c7a3', marrom: '#8a5a3c', dourado: '#c9a14a' };
const carColor = (car) => { const w = String(car || '').toLowerCase().split(/\s+/).find((x) => CAR_COLORS[x]); return w ? CAR_COLORS[w] : '#9aa0a6'; };

/** Recibo coerente: as parcelas somam exatamente o total. */
function receiptLines(t) {
  const total = Math.round((Number(t.price) || 0) * 100);
  const base = Math.round(total * 0.16), dist = Math.round(total * 0.44), tempo = Math.round(total * 0.2);
  const taxa = total - base - dist - tempo;
  const f = (c) => money(c / 100);
  return [
    ['Tarifa base', f(base)],
    [`Distância (${num1(t.km)} km)`, f(dist)],
    [`Tempo (${t.minutes || 0} min)`, f(tempo)],
    ['Taxa de serviço', f(taxa)],
  ];
}

function rng(seed) {
  let s = 2166136261;
  for (const ch of String(seed)) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619) >>> 0; }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/* ---------- mapa ---------- */
/** Trajeto levemente curvo entre dois pontos (sem rota real nos dados). */
function routeCurve(a, b, seed) {
  const r = rng(seed);
  const n = 30;
  const dx = b.lng - a.lng, dy = b.lat - a.lat, len = Math.hypot(dx, dy) || 1e-6;
  const px = -dy / len, py = dx / len;
  const off = (0.14 + r() * 0.1) * len * (r() > 0.5 ? 1 : -1);
  const cx = (a.lng + b.lng) / 2 + px * off, cy = (a.lat + b.lat) / 2 + py * off;
  const ph = r() * 6;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, k = Math.sin(t * Math.PI);
    const wob = Math.sin(t * Math.PI * 5 + ph) * len * 0.012 * k;
    pts.push([(1 - t) * (1 - t) * a.lat + 2 * (1 - t) * t * cy + t * t * b.lat + py * wob, (1 - t) * (1 - t) * a.lng + 2 * (1 - t) * t * cx + t * t * b.lng + px * wob]);
  }
  return pts;
}
const hasGeo = (t) => [t.from?.lat, t.from?.lng, t.to?.lat, t.to?.lng].every((v) => typeof v === 'number' && isFinite(v));
const curveOf = (t) => (hasGeo(t) ? (Array.isArray(t.path) && t.path.length > 1 ? t.path : routeCurve(t.from, t.to, t.id)) : null);

/** Fundo de “ruas” desenhadas à mão (modo escuro do Uber), usado em miniaturas e se os blocos do mapa não carregarem. */
function streetsBg(seed) {
  const r = rng(seed + 'ruas');
  let g = '';
  for (let i = 0; i < 8; i++) { const y = 20 + i * 32 + r() * 14, a = (r() - 0.5) * 7; g += `<line x1="-20" y1="${y.toFixed(0)}" x2="440" y2="${(y + a * 9).toFixed(0)}" stroke="#2b2b2b" stroke-width="${(2 + r() * 3).toFixed(1)}"/>`; }
  for (let i = 0; i < 9; i++) { const x = 10 + i * 48 + r() * 18, a = (r() - 0.5) * 12; g += `<line x1="${x.toFixed(0)}" y1="-10" x2="${(x + a * 8).toFixed(0)}" y2="260" stroke="#262626" stroke-width="${(1.5 + r() * 2.5).toFixed(1)}"/>`; }
  const bx = 40 + r() * 240, by = 30 + r() * 120;
  g += `<ellipse cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" rx="46" ry="26" fill="#1a2a1f"/>`;
  g += `<path d="M-10 ${(150 + r() * 40).toFixed(0)} C 120 ${(110 + r() * 30).toFixed(0)}, 260 ${(190 + r() * 30).toFixed(0)}, 430 ${(130 + r() * 40).toFixed(0)}" fill="none" stroke="#1a2433" stroke-width="16" stroke-linecap="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 250" preserveAspectRatio="xMidYMid slice"><rect width="420" height="250" fill="#1b1b1b"/>${g}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

/** Trajeto em SVG (projeção simples), usado no fallback e nas miniaturas da Atividade. */
function routeSvg(curve, { W = 420, H = 250, P = 46, cls = 'bo-svgmap', label = 'Trajeto da viagem', stroke = 4.5 } = {}) {
  let pts;
  if (curve) {
    const lats = curve.map((p) => p[0]), lngs = curve.map((p) => p[1]);
    const la0 = Math.min(...lats), la1 = Math.max(...lats), ln0 = Math.min(...lngs), ln1 = Math.max(...lngs);
    const sc = Math.min((W - 2 * P) / (ln1 - ln0 || 1e-6), (H - 2 * P) / (la1 - la0 || 1e-6));
    const ox = (W - (ln1 - ln0) * sc) / 2, oy = (H - (la1 - la0) * sc) / 2;
    pts = curve.map(([la, ln]) => [ox + (ln - ln0) * sc, oy + (la1 - la) * sc]);
  } else {
    pts = Array.from({ length: 24 }, (_, i) => { const t = i / 23; return [W * 0.17 + t * W * 0.66, H * 0.7 - t * H * 0.4 + Math.sin(t * Math.PI * 2) * H * 0.07]; });
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const s = pts[0], e = pts[pts.length - 1];
  const r = stroke * 2;
  return `<svg class="${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
    <path d="${d}" fill="none" stroke="#000" stroke-width="${stroke * 2}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${s[0].toFixed(1)}" cy="${s[1].toFixed(1)}" r="${r}" fill="#fff" stroke="#000" stroke-width="${stroke * 0.9}"/>
    <rect x="${(e[0] - r).toFixed(1)}" y="${(e[1] - r).toFixed(1)}" width="${r * 2}" height="${r * 2}" fill="#fff" stroke="#000" stroke-width="${stroke * 0.9}"/>
  </svg>`;
}

function buildMap(box, t) {
  const curve = curveOf(t);
  box.style.backgroundImage = streetsBg(t.id);
  const L = window.L;
  if (L && curve) {
    try {
      const a = t.from, b = t.to;
      const map = L.map(box, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false, tap: false, zoomSnap: 0.25 });
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap', className: 'bo-osm' });
      tiles.on('tileerror', (e) => { if (e.tile) e.tile.style.visibility = 'hidden'; });
      tiles.addTo(map);
      L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map);
      L.polyline(curve, { color: '#000', weight: 9, opacity: 0.9, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(map);
      L.polyline(curve, { color: '#ffffff', weight: 4.5, opacity: 1, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(map);
      const mk = (ll, cls) => L.marker(ll, { icon: L.divIcon({ className: `bo-mk ${cls}`, html: '<i></i>', iconSize: [20, 20], iconAnchor: [10, 10] }), interactive: false, keyboard: false }).addTo(map);
      mk([a.lat, a.lng], 'o'); mk([b.lat, b.lng], 'd');
      const bounds = L.latLngBounds(curve);
      const fit = () => { map.invalidateSize(); map.fitBounds(bounds, { paddingTopLeft: [44, 64], paddingBottomRight: [44, 44], animate: false }); };
      fit();
      setTimeout(fit, 340);
      box.classList.add('has-leaflet');
      return;
    } catch (err) { console.warn('[bora] mapa indisponível, usando desenho', err); box.className = 'bo-map'; box.innerHTML = ''; }
  }
  box.insertAdjacentHTML('beforeend', routeSvg(curve));
}

/** Miniatura do trajeto (cartões da Atividade). */
function thumb(t, { W = 120, H = 120, cls = 'bo-thumb' } = {}) {
  const el = h('span', { class: cls, 'aria-hidden': 'true', html: routeSvg(curveOf(t), { W, H, P: Math.round(Math.min(W, H) * 0.2), cls: '', label: '', stroke: W > 200 ? 4 : 3 }) });
  el.style.backgroundImage = streetsBg(t.id);
  return el;
}

/* ---------- telas ---------- */
function drawTrip(ctx, el, t) {
  const { kit, game, phone } = ctx;
  game.see(`bora:trip:${t.id}`);
  const from = t.from?.name || 'Origem', to = t.to?.name || 'Destino';
  const start = time.hhmm(t.at), end = time.hhmm(endOf(t));
  const drv = t.driver || {};
  const pay = payLabel(t);
  const stub = (what) => phone.toast(`${what}: indisponível na extração`, { icon: 'info' });
  const map = h('div', { class: 'bo-map', role: 'img', 'aria-label': `Mapa: ${from} até ${to}` });
  const scroller = h('div', { class: 'bo-detail' });
  el.append(h('div', { class: 'bo-mapwrap' }, map,
    h('button', { class: 'bo-mapback', 'aria-label': 'Voltar', on: { click: () => phone.back() } }, icon('arrow-left', { size: 22 }))), scroller);
  buildMap(map, t);

  const receiptSec = h('section', { class: 'bo-sec bo-receipt', id: `bo-rcpt-${t.id}` });

  /* cabeçalho da viagem */
  scroller.append(h('section', { class: 'bo-sec bo-dh' },
    h('h1', null, `Viagem com ${drv.name || 'motorista'}`),
    h('div', { class: 'bo-dh-when' }, `${longDate(t.at)}, ${start}`),
    h('div', { class: 'bo-dh-row' },
      h('div', { class: 'bo-dh-price' }, money(t.price)),
      h('span', { class: 'bo-dh-pay' }, icon(payIcon(pay), { size: 15 }), pay)),
    h('div', { class: 'bo-dh-acts' },
      h('button', { class: 'bo-pill', on: { click: () => receiptSec.scrollIntoView({ behavior: 'smooth', block: 'start' }) } }, icon('receipt', { size: 17 }), 'Recibo'),
      h('button', { class: 'bo-pill', on: { click: () => stub('Ajuda') } }, icon('circle-help', { size: 17 }), 'Ajuda'),
      h('button', { class: 'bo-pill', on: { click: () => stub('Repetir viagem') } }, icon('rotate-ccw', { size: 17 }), 'Repetir'))));

  /* trajeto: embarque, parada, desembarque */
  const fromN = splitName(from), toN = splitName(to);
  const stop = (tm, cls, label, name) => h('div', { class: `bo-stop ${cls}` },
    h('span', { class: 'bo-stop-mk' }, h('i')),
    h('div', { class: 'bo-stop-tx' }, h('small', null, label), h('b', null, name.main), name.sub ? h('span', null, name.sub) : null),
    tm ? h('span', { class: 'bo-stop-t' }, tm) : null);
  scroller.append(h('section', { class: 'bo-sec bo-route' },
    h('h2', null, 'Trajeto'),
    h('div', { class: 'bo-stops' },
      stop(start, 'o', 'Embarque', fromN),
      t.stop ? stop('', 's', 'Parada', splitName(t.stop)) : null,
      stop(end, 'd', 'Desembarque', toN)),
    h('div', { class: 'bo-route-meta' }, icon('clock', { size: 14 }), `${t.minutes || '—'} min`, h('span', { class: 'sep' }, '·'), icon('route', { size: 14 }), `${num1(t.km)} km`)));

  if (t.split) scroller.append(h('section', { class: 'bo-sec bo-split' },
    h('span', { class: 'bo-split-ic' }, icon('users', { size: 20 })),
    h('div', { class: 'bo-split-tx' }, h('small', null, 'Corrida dividida'), h('b', null, `Com ${t.split}`), h('span', null, `Cada um paga ${money(t.price / 2)}`))));

  /* motorista */
  scroller.append(h('section', { class: 'bo-sec bo-driver' },
    h('div', { class: 'av' }, (drv.name || '?').charAt(0).toUpperCase()),
    h('div', { class: 'tx' },
      h('div', { class: 'nm' }, drv.name || 'Motorista', drv.rating ? h('span', { class: 'rt' }, Number(drv.rating).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), icon('star', { size: 12 })) : null),
      h('div', { class: 'car' }, h('i', { class: 'dot', style: { background: carColor(drv.car) } }), drv.car || 'Carro')),
    h('div', { class: 'plate', 'aria-label': 'Placa parcialmente oculta' }, h('small', null, 'BRASIL'), h('b', null, maskPlate(drv.plate)))));

  /* recibo */
  const lines = receiptLines(t);
  receiptSec.append(
    h('div', { class: 'hd' }, h('h2', null, 'Recibo'), h('small', null, `Nº ${String(t.id).replace(/^b-/, '').toUpperCase()}`)),
    h('div', { class: 'tot' }, h('span', null, 'Total'), h('b', null, money(t.price))),
    h('div', { class: 'ln' }, lines.map(([k, v]) => h('div', null, h('span', null, k), h('b', null, v)))),
    h('div', { class: 'sub' }, h('span', null, 'Subtotal'), h('b', null, money(t.price))),
    h('h3', null, 'Pagamentos'),
    h('div', { class: 'pay' }, h('span', { class: 'pay-ic' }, icon(payIcon(pay), { size: 18 })), h('span', { class: 'pay-tx' }, h('b', null, pay), h('small', null, `${shortDate(t.at)} ${end}`)), h('b', { class: 'pay-v' }, money(t.price))));
  scroller.append(receiptSec);

  scroller.append(h('div', { class: 'bo-pinrow' }, kit.pinButton({
    key: `bora:trip:${t.id}`,
    label: `Uber: ${from} → ${to}`,
    app: 'bora',
    detail: `${shortDate(t.at)} ${start}–${end} · ${money(t.price)} · ${drv.name || 'motorista'}${drv.car ? ', ' + drv.car : ''}`,
  })));
}

function openTrip(ctx, t) {
  ctx.nav.push({ title: 'Detalhes da viagem', className: 'bo-sub', render: (el) => drawTrip(ctx, el, t) });
}

/* ---------- app ---------- */
export default {
  id: 'bora',
  title: 'Uber',
  cloud: false,

  render(ctx) {
    const { el, kit, phone, params, data, store } = ctx;
    const trips = (data.trips || []).slice().sort((a, b) => time.compare(b.at, a.at));
    const who = store.avatarOf('iara');
    const stub = (what) => phone.toast(`${what}: indisponível na extração (somente leitura)`, { icon: 'info' });
    const noRide = () => phone.toast('Extração somente leitura: não dá para pedir corridas.', { icon: 'car' });

    const page = h('div', { class: 'bo-page' });
    const tabsEl = h('nav', { class: 'bo-tabs', 'aria-label': 'Abas do Uber' });
    let tab = params?.trip ? 'activity' : 'home';
    const TABS = [
      { id: 'home', label: 'Início', icon: 'house' },
      { id: 'services', label: 'Serviços', icon: 'layout-grid' },
      { id: 'activity', label: 'Atividade', icon: 'receipt' },
      { id: 'account', label: 'Conta', icon: 'user' },
    ];
    const go = (id) => { tab = id; draw(); };
    const drawTabs = () => {
      clear(tabsEl);
      for (const t of TABS) tabsEl.append(h('button', { class: `bo-tab${tab === t.id ? ' on' : ''}`, 'aria-current': tab === t.id ? 'page' : null, on: { click: () => go(t.id) } }, icon(t.icon, { size: 22, stroke: tab === t.id ? 2.4 : 1.8 }), h('span', null, t.label)));
    };

    const tile = (ic, label, onClick, big = false) => h('button', { class: `bo-tile${big ? ' big' : ''}`, on: { click: onClick } }, h('span', { class: 'bo-tile-ic' }, icon(ic, { size: big ? 30 : 26, stroke: 1.6 })), h('span', null, label));

    /* ----- Início ----- */
    function home() {
      const seen = new Set();
      const recent = [];
      for (const t of trips) { const n = t.to?.name; if (n && !seen.has(n)) { seen.add(n); recent.push(t); } if (recent.length >= 3) break; }
      return [
        h('header', { class: 'bo-hometop' }, h('span', { class: 'bo-word' }, 'Uber'), h('span', { class: 'sp' }), h('button', { class: 'bo-avbtn', 'aria-label': 'Conta', on: { click: () => go('account') } }, kit.avatar({ ...who, size: 34 }))),
        h('button', { class: 'bo-where', on: { click: noRide } },
          icon('search', { size: 22, stroke: 2.4 }), h('span', null, 'Para onde?'),
          h('em', null, icon('clock', { size: 15 }), 'Agora', icon('chevron-down', { size: 15 }))),
        recent.length ? h('div', { class: 'bo-recent' }, recent.map((t) => {
          const n = splitName(t.to.name);
          return h('button', { class: 'bo-rec', on: { click: noRide } },
            h('span', { class: 'bo-rec-ic' }, icon('history', { size: 18 })),
            h('span', { class: 'bo-rec-tx' }, h('b', null, n.main), h('small', null, n.sub || `Última viagem: ${uberDate(t.at)}`)));
        })) : null,
        h('div', { class: 'bo-h2row' }, h('h2', null, 'Sugestões'), h('button', { class: 'bo-link', on: { click: () => go('services') } }, 'Ver tudo')),
        h('div', { class: 'bo-tiles' }, tile('car', 'Viagem', noRide), tile('navigation', 'Moto', noRide), tile('calendar', 'Reserve', noRide), tile('archive', 'Envios', noRide)),
        h('div', { class: 'bo-promo' },
          h('div', { class: 'bo-promo-tx' }, h('b', null, 'Viaje com mais segurança'), h('span', null, 'Compartilhe o status da viagem com quem você confia.')),
          h('span', { class: 'bo-promo-ic' }, icon('shield-check', { size: 34, stroke: 1.5 }))),
        trips[0] ? h('button', { class: 'bo-lastride', on: { click: () => openTrip(ctx, trips[0]) } },
          h('span', { class: 'bo-rec-ic' }, icon('receipt', { size: 18 })),
          h('span', { class: 'bo-rec-tx' }, h('b', null, 'Sua última viagem'), h('small', null, `${splitName(trips[0].to?.name).main} · ${uberDate(trips[0].at)} · ${money(trips[0].price)}`)),
          icon('chevron-right', { size: 18 })) : null,
      ];
    }

    /* ----- Serviços ----- */
    function services() {
      return [
        h('h1', { class: 'bo-h1' }, 'Serviços'),
        h('h2', { class: 'bo-h2' }, 'Para ir a qualquer lugar'),
        h('div', { class: 'bo-tiles' }, tile('car', 'Viagem', noRide, true), tile('navigation', 'Moto', noRide, true), tile('calendar', 'Reserve', noRide, true), tile('star', 'Comfort', noRide, true), tile('car', 'Black', noRide, true), tile('users', 'Grupos', noRide, true), tile('archive', 'Envios', noRide, true), tile('key', 'Aluguel', noRide, true)),
      ];
    }

    /* ----- Atividade ----- */
    function activity() {
      const out = [h('h1', { class: 'bo-h1' }, 'Atividade'),
        h('div', { class: 'bo-h2row' }, h('h2', null, 'Anteriores'), h('button', { class: 'bo-filter', on: { click: () => stub('Filtrar') } }, icon('filter', { size: 15 }), 'Viagens'))];
      if (!trips.length) { out.push(kit.empty({ icon: 'car', title: 'Nenhuma viagem', text: 'As corridas feitas no Uber aparecem aqui.' })); return out; }
      const [first, ...rest] = trips;
      const fn = splitName(first.to?.name || 'Destino');
      out.push(h('button', { class: 'bo-hero', on: { click: () => openTrip(ctx, first) }, 'aria-label': `Viagem para ${first.to?.name || 'destino'}, ${money(first.price)}` },
        thumb(first, { W: 360, H: 150, cls: 'bo-hero-map' }),
        h('span', { class: 'bo-hero-tx' },
          h('span', { class: 'bo-hero-l' }, h('b', null, fn.main), h('small', null, `${uberDate(first.at)} · ${time.hhmm(first.at)}`), h('small', null, money(first.price))),
          h('span', { class: 'bo-again', role: 'presentation', on: { click: (e) => { e.stopPropagation(); noRide(); } } }, icon('rotate-ccw', { size: 15 }), 'Repetir'))));
      let mk = monthKey(first.at);
      for (const t of rest) {
        const k = monthKey(t.at);
        if (k !== mk) { mk = k; out.push(h('div', { class: 'bo-month' }, monthLabel(t.at))); }
        const n = splitName(t.to?.name || 'Destino');
        out.push(h('button', { class: 'bo-trip', on: { click: () => openTrip(ctx, t) }, 'aria-label': `Viagem de ${t.from?.name || 'origem'} para ${t.to?.name || 'destino'}, ${money(t.price)}` },
          thumb(t, { W: 112, H: 112 }),
          h('span', { class: 'bo-trip-tx' },
            h('b', null, n.main),
            h('small', null, `${uberDate(t.at)} · ${time.hhmm(t.at)}`),
            h('small', null, money(t.price), t.split ? h('em', null, icon('users', { size: 12 }), 'Dividida') : null)),
          h('span', { class: 'bo-again', role: 'presentation', on: { click: (e) => { e.stopPropagation(); noRide(); } } }, icon('rotate-ccw', { size: 15 }), 'Repetir')));
      }
      return out;
    }

    /* ----- Conta ----- */
    function account() {
      const pays = [...new Set(trips.map(payLabel))];
      const row = (ic, label, onClick) => h('button', { class: 'bo-arow', on: { click: onClick } }, icon(ic, { size: 22, stroke: 1.8 }), h('span', null, label));
      return [
        h('div', { class: 'bo-acc' }, h('h1', null, who.name || 'Iara Fontenele'), kit.avatar({ ...who, size: 58 })),
        h('div', { class: 'bo-acc-tiles' },
          tile('circle-help', 'Ajuda', () => stub('Ajuda')),
          tile('wallet', 'Carteira', () => phone.sheet({ title: 'Formas de pagamento', render: (b) => b.append(h('div', { class: 'bo-paylist' }, pays.map((p) => h('div', { class: 'bo-payrow' }, icon(payIcon(p), { size: 20 }), h('span', null, p)))) ) })),
          tile('receipt', 'Atividade', () => go('activity'))),
        h('div', { class: 'bo-alist' },
          row('settings', 'Configurações', () => stub('Configurações')),
          row('mail', 'Mensagens', () => stub('Mensagens')),
          row('shield', 'Segurança', () => stub('Segurança')),
          row('lock', 'Privacidade', () => stub('Privacidade')),
          row('info', 'Informações legais', () => stub('Informações legais'))),
      ];
    }

    function draw() {
      drawTabs();
      clear(page);
      const parts = tab === 'home' ? home() : tab === 'services' ? services() : tab === 'activity' ? activity() : account();
      page.append(h('div', { class: `bo-wrap bo-${tab}` }, parts.filter(Boolean)));
      page.scrollTop = 0;
    }

    el.append(h('div', { class: 'bo-root' }, page, tabsEl));
    draw();

    if (params?.trip) {
      const t = trips.find((x) => x.id === params.trip);
      if (t) openTrip(ctx, t); else phone.toast('Viagem não encontrada', { icon: 'car' });
    }
  },

  search({ data }) {
    return (data.trips || []).map((t) => ({
      title: `Uber · ${t.from?.name || ''} → ${t.to?.name || ''}`,
      text: `${shortDate(t.at)} ${time.hhmm(t.at)} · ${t.driver?.name || ''} ${t.driver?.car || ''} · ${money(t.price)}`,
      params: { trip: t.id },
      at: t.at,
    }));
  },
};
