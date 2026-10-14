// Bora — corridas por aplicativo (identidade preta e amarela). Histórico do aparelho de Iara.
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

/* ---------- utilidades ---------- */
const pad = (n) => String(n).padStart(2, '0');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n) => time.money(n);
const num1 = (n) => Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const endOf = (t) => new Date(time.parse(t.at).getTime() + (Number(t.minutes) || 0) * 60000);
const shortDate = (at) => `${time.weekday(at)}, ${time.dateShort(at)}`;
const longDate = (at) => `${cap(time.weekdayLong(at))}, ${time.dateLong(at).replace(/ de \d{4}$/, '')}`;
const monthKey = (at) => { const d = time.parse(at); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
const monthLabel = (at) => { const d = time.parse(at); return `${cap(time.monthName(d.getMonth()))} de ${d.getFullYear()}`; };

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
    [`Distância · ${num1(t.km)} km`, f(dist)],
    [`Tempo · ${t.minutes || 0} min`, f(tempo)],
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

/** Fundo de “ruas” desenhadas à mão, usado atrás do mapa (aparece se os blocos do mapa não carregarem). */
function streetsBg(seed) {
  const r = rng(seed + 'ruas');
  let g = '';
  for (let i = 0; i < 8; i++) { const y = 20 + i * 32 + r() * 14, a = (r() - 0.5) * 7; g += `<line x1="-20" y1="${y.toFixed(0)}" x2="440" y2="${(y + a * 9).toFixed(0)}" stroke="#202226" stroke-width="${(2 + r() * 3).toFixed(1)}"/>`; }
  for (let i = 0; i < 9; i++) { const x = 10 + i * 48 + r() * 18, a = (r() - 0.5) * 12; g += `<line x1="${x.toFixed(0)}" y1="-10" x2="${(x + a * 8).toFixed(0)}" y2="260" stroke="#1c1e21" stroke-width="${(1.5 + r() * 2.5).toFixed(1)}"/>`; }
  const bx = 40 + r() * 240, by = 30 + r() * 120;
  g += `<ellipse cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" rx="46" ry="26" fill="#101812"/>`;
  g += `<path d="M-10 ${(150 + r() * 40).toFixed(0)} C 120 ${(110 + r() * 30).toFixed(0)}, 260 ${(190 + r() * 30).toFixed(0)}, 430 ${(130 + r() * 40).toFixed(0)}" fill="none" stroke="#0e1722" stroke-width="16" stroke-linecap="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 250" preserveAspectRatio="xMidYMid slice"><rect width="420" height="250" fill="#0d0e10"/>${g}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function svgRoute(box, a, b, curve) {
  const W = 420, H = 250, P = 46;
  let pts;
  if (curve) {
    const lats = curve.map((p) => p[0]), lngs = curve.map((p) => p[1]);
    const la0 = Math.min(...lats), la1 = Math.max(...lats), ln0 = Math.min(...lngs), ln1 = Math.max(...lngs);
    const sc = Math.min((W - 2 * P) / (ln1 - ln0 || 1e-6), (H - 2 * P) / (la1 - la0 || 1e-6));
    const ox = (W - (ln1 - ln0) * sc) / 2, oy = (H - (la1 - la0) * sc) / 2;
    pts = curve.map(([la, ln]) => [ox + (ln - ln0) * sc, oy + (la1 - la) * sc]);
  } else {
    pts = Array.from({ length: 24 }, (_, i) => { const t = i / 23; return [70 + t * 280, 175 - t * 100 + Math.sin(t * Math.PI * 2) * 18]; });
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const s = pts[0], e = pts[pts.length - 1];
  box.insertAdjacentHTML('beforeend', `<svg class="bo-svgmap" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Trajeto da viagem">
    <path d="${d}" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
    <path d="${d}" fill="none" stroke="#ffd400" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${s[0].toFixed(1)}" cy="${s[1].toFixed(1)}" r="9" fill="#fff" stroke="#000" stroke-width="4"/>
    <rect x="${(e[0] - 9).toFixed(1)}" y="${(e[1] - 9).toFixed(1)}" width="18" height="18" rx="4" fill="#ffd400" stroke="#000" stroke-width="4"/>
  </svg>`);
}

function buildMap(box, t) {
  const a = t.from || {}, b = t.to || {};
  const geo = [a.lat, a.lng, b.lat, b.lng].every((v) => typeof v === 'number' && isFinite(v));
  const curve = geo ? (Array.isArray(t.path) && t.path.length > 1 ? t.path : routeCurve(a, b, t.id)) : null;
  box.style.backgroundImage = streetsBg(t.id);
  const L = window.L;
  if (L && geo) {
    try {
      const map = L.map(box, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false, tap: false, zoomSnap: 0.25 });
      const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 19, attribution: '© OpenStreetMap · © CARTO' });
      tiles.on('tileerror', (e) => { if (e.tile) e.tile.style.visibility = 'hidden'; });
      tiles.addTo(map);
      L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map);
      L.polyline(curve, { color: '#000', weight: 9, opacity: 0.85, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(map);
      L.polyline(curve, { color: '#ffd400', weight: 4.5, opacity: 1, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(map);
      const mk = (ll, cls) => L.marker(ll, { icon: L.divIcon({ className: `bo-mk ${cls}`, html: '<i></i>', iconSize: [24, 24], iconAnchor: [12, 12] }), interactive: false, keyboard: false }).addTo(map);
      mk([a.lat, a.lng], 'o'); mk([b.lat, b.lng], 'd');
      const bounds = L.latLngBounds(curve);
      const fit = () => { map.invalidateSize(); map.fitBounds(bounds, { padding: [44, 44], animate: false }); };
      fit();
      setTimeout(fit, 340);
      box.classList.add('has-leaflet');
      return;
    } catch (err) { console.warn('[bora] mapa indisponível, usando desenho', err); box.className = 'bo-map'; box.innerHTML = ''; }
  }
  svgRoute(box, a, b, curve);
}

/* ---------- telas ---------- */
function tripCard(t, onOpen) {
  const from = t.from?.name || 'Origem', to = t.to?.name || 'Destino';
  return h('button', { class: 'bo-trip', on: { click: onOpen }, 'aria-label': `Viagem de ${from} para ${to}, ${money(t.price)}` },
    h('div', { class: 'route' },
      h('div', { class: 'dots', 'aria-hidden': 'true' }, h('i', { class: 'o' }), h('i', { class: 'l' }), h('i', { class: 'd' })),
      h('div', { class: 'names' }, h('div', { class: 'a' }, from), h('div', { class: 'b' }, to))),
    h('div', { class: 'right' }, h('b', { class: 'price' }, money(t.price)), h('span', { class: 'when' }, `${shortDate(t.at)} · ${time.hhmm(t.at)}`)),
    h('div', { class: 'chips' },
      t.driver?.car ? h('span', { class: 'bo-ch' }, h('i', { class: 'dot', style: { background: carColor(t.driver.car) } }), t.driver.car) : null,
      t.minutes ? h('span', { class: 'bo-ch' }, icon('clock', { size: 13 }), `${t.minutes} min`) : null,
      t.km ? h('span', { class: 'bo-ch' }, icon('route', { size: 13 }), `${num1(t.km)} km`) : null));
}

function drawTrip(ctx, el, t) {
  const { kit, game } = ctx;
  game.see(`bora:trip:${t.id}`);
  const from = t.from?.name || 'Origem', to = t.to?.name || 'Destino';
  const start = time.hhmm(t.at), end = time.hhmm(endOf(t));
  const drv = t.driver || {};
  const pay = payLabel(t);
  const map = h('div', { class: 'bo-map', role: 'img', 'aria-label': `Mapa: ${from} até ${to}` });
  el.append(kit.appBar({ title: 'Detalhes da viagem', subtitle: `${longDate(t.at)}` }), map);
  buildMap(map, t);

  const wrap = h('div', { class: 'bo-wrap' });
  wrap.append(h('section', { class: 'bo-card bo-line' },
    h('div', { class: 'row' }, h('div', { class: 'tm' }, start), h('div', { class: 'mk' }, h('i', { class: 'o' })), h('div', { class: 'tx' }, h('small', null, 'Embarque'), h('b', null, from))),
    h('div', { class: 'row mid' }, h('div', { class: 'tm' }), h('div', { class: 'mk' }, h('i', { class: 'l' })), h('div', { class: 'tx' }, h('span', { class: 'pill' }, icon('clock', { size: 13 }), `${t.minutes || '—'} min`, ' · ', icon('route', { size: 13 }), `${num1(t.km)} km`))),
    h('div', { class: 'row' }, h('div', { class: 'tm' }, end), h('div', { class: 'mk' }, h('i', { class: 'd' })), h('div', { class: 'tx' }, h('small', null, 'Desembarque'), h('b', null, to)))));

  wrap.append(h('section', { class: 'bo-card bo-driver' },
    h('div', { class: 'av' }, (drv.name || '?').charAt(0).toUpperCase()),
    h('div', { class: 'tx' },
      h('div', { class: 'nm' }, drv.name || 'Motorista', drv.rating ? h('span', { class: 'rt' }, icon('star', { size: 13 }), Number(drv.rating).toLocaleString('pt-BR', { minimumFractionDigits: 2 })) : null),
      h('div', { class: 'car' }, h('i', { class: 'dot', style: { background: carColor(drv.car) } }), drv.car || 'Carro')),
    h('div', { class: 'plate', 'aria-label': 'Placa parcialmente oculta' }, h('small', null, 'BRASIL'), h('b', null, maskPlate(drv.plate)))));

  const lines = receiptLines(t);
  wrap.append(h('section', { class: 'bo-card bo-receipt' },
    h('div', { class: 'hd' }, icon('receipt', { size: 18 }), h('h3', null, 'Recibo'), h('small', null, `Nº ${String(t.id).replace(/^b-/, '').toUpperCase()}`)),
    h('div', { class: 'ln' }, lines.map(([k, v]) => h('div', null, h('span', null, k), h('b', null, v)))),
    h('div', { class: 'tot' }, h('span', null, 'Total'), h('b', null, money(t.price))),
    h('div', { class: 'pay' }, icon(payIcon(pay), { size: 18 }), h('span', null, 'Pago com'), h('b', null, pay))));

  wrap.append(h('div', { class: 'bo-pinrow' }, kit.pinButton({
    key: `bora:trip:${t.id}`,
    label: `Bora: ${from} → ${to}`,
    app: 'bora',
    detail: `${shortDate(t.at)} ${start}–${end} · ${money(t.price)} · ${drv.name || 'motorista'}${drv.car ? ', ' + drv.car : ''}`,
  })));
  el.append(wrap);
}

function openTrip(ctx, t) {
  ctx.nav.push({ title: 'Detalhes da viagem', className: 'bo-sub', render: (el) => drawTrip(ctx, el, t) });
}

/* ---------- app ---------- */
export default {
  id: 'bora',
  title: 'Bora',
  cloud: false,

  render(ctx) {
    const { el, kit, phone, params, data, store } = ctx;
    const trips = (data.trips || []).slice().sort((a, b) => time.compare(b.at, a.at));
    const who = store.avatarOf('iara');
    const total = trips.reduce((s, t) => s + (Number(t.price) || 0), 0);
    const kms = trips.reduce((s, t) => s + (Number(t.km) || 0), 0);

    const wrap = h('div', { class: 'bo-wrap' });
    wrap.append(
      h('button', { class: 'bo-where', on: { click: () => phone.toast('Espelho somente leitura: não dá para pedir corridas.', { icon: 'car' }) } },
        icon('search', { size: 20 }), h('span', null, 'Para onde?'), h('em', null, icon('clock', { size: 14 }), 'Agora')),
      h('div', { class: 'bo-sum' },
        h('div', null, h('b', null, String(trips.length)), h('span', null, 'viagens')),
        h('div', null, h('b', null, money(total).replace('R$ ', 'R$ ')), h('span', null, 'em corridas')),
        h('div', null, h('b', null, num1(kms)), h('span', null, 'km rodados'))),
      h('h2', { class: 'bo-h2' }, 'Suas viagens'));
    if (!trips.length) wrap.append(kit.empty({ icon: 'car', title: 'Nenhuma viagem', text: 'As corridas feitas no Bora aparecem aqui.' }));
    let mk = '';
    for (const t of trips) {
      const k = monthKey(t.at);
      if (k !== mk) { mk = k; wrap.append(h('div', { class: 'bo-month' }, monthLabel(t.at))); }
      wrap.append(tripCard(t, () => openTrip(ctx, t)));
    }

    el.append(
      h('header', { class: 'bo-top' },
        kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
        h('div', { class: 'bo-logo', 'aria-label': 'bora' }, h('span', null, 'bora'), icon('arrow-up-right', { size: 20, stroke: 3 })),
        h('span', { class: 'sp' }),
        kit.avatar({ ...who, size: 38 })),
      wrap);

    if (params?.trip) {
      const t = trips.find((x) => x.id === params.trip);
      if (t) openTrip(ctx, t); else phone.toast('Viagem não encontrada', { icon: 'car' });
    }
  },

  search({ data }) {
    return (data.trips || []).map((t) => ({
      title: `Bora · ${t.from?.name || ''} → ${t.to?.name || ''}`,
      text: `${shortDate(t.at)} ${time.hhmm(t.at)} · ${t.driver?.name || ''} ${t.driver?.car || ''} · ${money(t.price)}`,
      params: { trip: t.id },
      at: t.at,
    }));
  },
};
