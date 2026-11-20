// Clima (app de clima do Google/Pixel) — Guaraciaba do Norte (CE), sáb 10/10/2026 23:47 (hora do espelho):
// noite limpa, ventania de sudeste na serra. Lê CASE.clima; o que faltar usa os padrões abaixo.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { sfx } from '../core/sfx.js';

/* ---------- dados (padrões do caso + mescla com CASE.clima) ---------- */
const DEF = {
  city: 'Guaraciaba do Norte', region: 'CE', updated: '2026-10-10T23:30',
  now: { temp: 19, feels: 17, desc: 'Céu limpo · ventania na serra', min: 17, max: 29, wind: 28, gust: 41, windDir: 'L', humidity: 52, visibility: 10, pressure: 1013, uv: 0, rain: 0, icon: 'clear-night' },
  sun: { rise: '05:24', set: '17:33' },
  hourly: [
    { at: '2026-10-10T23:47', temp: 19, icon: 'clear-night', wind: 28, label: 'Agora' },
    { at: '2026-10-11T00:00', temp: 19, icon: 'clear-night', wind: 27 },
    { at: '2026-10-11T01:00', temp: 18, icon: 'clear-night', wind: 26 },
    { at: '2026-10-11T02:00', temp: 18, icon: 'clear-night', wind: 24 },
    { at: '2026-10-11T03:00', temp: 17, icon: 'clear-night', wind: 23 },
    { at: '2026-10-11T04:00', temp: 17, icon: 'clear-night', wind: 21 },
    { at: '2026-10-11T05:00', temp: 17, icon: 'clear-night', wind: 20 },
    { at: '2026-10-11T05:24', icon: 'sunrise', label: 'Nascer do sol', event: true },
    { at: '2026-10-11T06:00', temp: 18, icon: 'sun', wind: 18 },
  ],
  daily: [
    { date: '2026-10-10', min: 17, max: 29, icon: 'sun', rain: 0 },
    { date: '2026-10-11', min: 17, max: 30, icon: 'sun', rain: 0 },
    { date: '2026-10-12', min: 18, max: 31, icon: 'sun', rain: 0 },
    { date: '2026-10-13', min: 18, max: 31, icon: 'partly-day', rain: 5 },
    { date: '2026-10-14', min: 18, max: 30, icon: 'partly-day', rain: 10 },
    { date: '2026-10-15', min: 19, max: 29, icon: 'cloud', rain: 20 },
    { date: '2026-10-16', min: 19, max: 30, icon: 'partly-day', rain: 10 },
  ],
  saved: [{ city: 'Fortaleza', region: 'CE', temp: 27, desc: 'Parcialmente nublado', icon: 'partly-night' }],
};

const arr = (v, d) => (Array.isArray(v) && v.length ? v : d);
function model(data) {
  const n = data.now || {}, N = DEF.now;
  const pick = (...ks) => { for (const k of ks) if (n[k] !== undefined && n[k] !== null) return n[k]; return undefined; };
  const now = {
    temp: pick('temp') ?? N.temp, feels: pick('feels', 'feelsLike') ?? N.feels, desc: pick('desc', 'description', 'text') ?? N.desc,
    min: pick('min') ?? N.min, max: pick('max') ?? N.max, wind: pick('wind') ?? N.wind, gust: pick('gust') ?? N.gust, windDir: pick('windDir') ?? N.windDir,
    humidity: pick('humidity', 'humid') ?? N.humidity, visibility: pick('visibility') ?? N.visibility, pressure: pick('pressure') ?? N.pressure,
    uv: pick('uv') ?? N.uv, rain: pick('rain') ?? N.rain, icon: pick('icon') ?? N.icon,
  };
  const hourly = arr(data.hourly, DEF.hourly).map((x) => ({ ...x, at: x.at || x.time }));
  const daily = arr(data.daily, DEF.daily).map((x) => ({ ...x, date: x.date || x.day }));
  return {
    city: data.city || DEF.city, region: data.region || DEF.region, updated: data.updated || DEF.updated, now,
    sun: { ...DEF.sun, ...(data.sun || {}) }, hourly, daily, saved: arr(data.saved, DEF.saved),
  };
}

/* ---------- ícones de tempo (SVG desenhado à mão, no estilo dos ícones do Google) ---------- */
let uid = 0;
const CLOUD = 'M13 36a7 7 0 0 1-1-13.9A10 10 0 0 1 31.3 19.8 8.5 8.5 0 0 1 35 36z';
const MOON = 'M-.16 -14A14 14 0 1 0 13.18 4.68A11.5 11.5 0 0 1 -.16 -14Z';
const ALIAS = { moon: 'clear-night', lua: 'clear-night', limpo: 'clear-night', sol: 'sun', 'cloud-sun': 'partly-day', 'cloud-moon': 'partly-night', nublado: 'cloud', chuva: 'rain', 'cloud-rain': 'rain' };

function wx(kind, size = 44) {
  const k = ALIAS[kind] || kind, id = `clw${++uid}`;
  const sun = (cx, cy, s) => `<circle cx="${cx}" cy="${cy}" r="${(11 * s).toFixed(1)}" fill="url(#${id}s)"/>`;
  const moon = (cx, cy, s) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="${MOON}" fill="url(#${id}m)"/>`;
  const cloud = (dx = 0, dy = 0, s = 1) => `<path transform="translate(${dx} ${dy}) scale(${s})" d="${CLOUD}" fill="url(#${id}c)"/>`;
  let g = '';
  switch (k) {
    case 'sun': g = sun(24, 24, 1.15); break;
    case 'sunrise': g = `<path d="M10 33a14 14 0 0 1 28 0z" fill="url(#${id}s)"/><path d="M5 37h38" stroke="#c4c7c5" stroke-width="2.6" stroke-linecap="round"/><path d="M24 9v7M21 13l3 3 3-3" stroke="#fdd663" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; break;
    case 'partly-day': g = `${sun(18, 17, .8)}${cloud(2, 4, .95)}`; break;
    case 'partly-night': g = `${moon(18, 18, .78)}${cloud(2, 4, .95)}`; break;
    case 'cloud': g = cloud(-1, 0, 1.08); break;
    case 'rain': g = `${cloud(0, -5, 1)}<g stroke="#7cacf8" stroke-width="2.8" stroke-linecap="round"><line x1="17" y1="37" x2="14.5" y2="43"/><line x1="25" y1="37" x2="22.5" y2="43"/><line x1="33" y1="37" x2="30.5" y2="43"/></g>`; break;
    default: g = moon(23, 25, 1.12);
  }
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" class="cw-gl" style="display:block"><defs>
    <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f3f4"/><stop offset="1" stop-color="#bdc1c6"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde293"/><stop offset="1" stop-color="#f9ab00"/></linearGradient>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8eaed"/><stop offset="1" stop-color="#aecbfa"/></linearGradient></defs>${g}</svg>`;
}
const glyph = (kind, size) => h('span', { class: 'gw', html: wx(kind, size) });
const dropSvg = (s = 18) => `<svg xmlns="http://www.w3.org/2000/svg" class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c3.2 4 6.2 7.1 6.2 11a6.2 6.2 0 0 1-12.4 0C5.8 10.1 8.8 7 12 3z"/></svg>`;
const gaugeSvg = (s = 18) => `<svg xmlns="http://www.w3.org/2000/svg" class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 17a9 9 0 1 1 15.6 0"/><path d="M12 15l3.6-5.2"/><circle cx="12" cy="15.4" r="1.3"/></svg>`;

/* ---------- vento / orvalho / sol ---------- */
const DIRS = { N: [0, 'norte'], NE: [45, 'nordeste'], L: [90, 'leste'], E: [90, 'leste'], SE: [135, 'sudeste'], S: [180, 'sul'], SO: [225, 'sudoeste'], SW: [225, 'sudoeste'], O: [270, 'oeste'], W: [270, 'oeste'], NO: [315, 'noroeste'], NW: [315, 'noroeste'] };
const dirOf = (d) => DIRS[String(d || '').toUpperCase()] || null;

/** Bússola: a seta aponta para onde o vento vai (sopra DE `dir`). */
function compassSvg(dir, size = 132) {
  const [deg] = dirOf(dir) || [90];
  const to = deg + 180;
  const c = 60, pt = (a, rr) => [(c + rr * Math.sin((a * Math.PI) / 180)).toFixed(1), (c - rr * Math.cos((a * Math.PI) / 180)).toFixed(1)];
  let ticks = '';
  for (let a = 0; a < 360; a += 10) {
    const big = a % 90 === 0, [x1, y1] = pt(a, big ? 44 : 47), [x2, y2] = pt(a, 52);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${big ? '#c4c7c5' : 'rgba(196,199,197,.35)'}" stroke-width="${big ? 2 : 1.2}" stroke-linecap="round"/>`;
  }
  const lab = (t, a) => { const [x, y] = pt(a, 34); return `<text x="${x}" y="${(+y + 4).toFixed(1)}" text-anchor="middle" font-size="11" fill="#c4c7c5" font-weight="600">${t}</text>`; };
  const [tx, ty] = pt(to, 40), [fx, fy] = pt(deg, 40);
  const [b1x, b1y] = pt(to - 9, 30), [b2x, b2y] = pt(to + 9, 30);
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Vento de ${dirOf(dir)?.[1] || dir}" style="display:block">
    <circle cx="60" cy="60" r="56" fill="rgba(255,255,255,.04)"/>${ticks}${lab('N', 0)}${lab('L', 90)}${lab('S', 180)}${lab('O', 270)}
    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="#a8c7fa" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${fx}" cy="${fy}" r="5" fill="#131314" stroke="#a8c7fa" stroke-width="3"/>
    <path d="M${b1x} ${b1y}L${tx} ${ty}L${b2x} ${b2y}Z" fill="#a8c7fa" stroke="#a8c7fa" stroke-width="2" stroke-linejoin="round"/></svg>`;
}
/** Seta pequena (para onde o vento vai). */
const arrowEl = (dir) => {
  const [deg] = dirOf(dir) || [90];
  return h('span', { class: 'arw', style: { transform: `rotate(${deg + 180}deg)` }, html: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3l6 15-6-3.5L6 18z" fill="currentColor"/></svg>' });
};
const dew = (t, rh) => Math.round(t - (100 - rh) / 5);
const mins = (hhmm) => { const [a, b] = String(hhmm).split(':').map(Number); return (a || 0) * 60 + (b || 0); };

/** Arco do dia: curva do sol nas 24 h, nascer/pôr marcados e a hora do espelho (noite: abaixo do horizonte). */
function sunArc(sun, nowHm) {
  const W = 300, H = 120, L = 10, R = 10, pw = W - L - R, hor = 64, amp = 40;
  const rise = mins(sun.rise), set = mins(sun.set), noon = (rise + set) / 2, D = set - rise;
  const f = (t) => Math.cos((2 * Math.PI * (t - noon)) / 1440) - Math.cos((Math.PI * D) / 1440);
  const X = (t) => L + (t / 1440) * pw, Y = (t) => hor - f(t) * amp;
  const pts = [];
  for (let t = 0; t <= 1440; t += 10) pts.push([X(t), Y(t)]);
  const d = (a, b) => pts.filter(([x]) => x >= X(a) - 0.01 && x <= X(b) + 0.01).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const day = d(Math.ceil(rise / 10) * 10, Math.floor(set / 10) * 10);
  const nowT = mins(nowHm), nx = X(nowT), ny = Y(nowT);
  const lab = (t, txt) => `<text x="${X(t).toFixed(1)}" y="${hor + 20}" text-anchor="middle" fill="#c4c7c5" font-size="11.5" font-weight="500">${txt}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Arco do sol: nascer ${sun.rise}, pôr ${sun.set}" style="display:block">
    <line x1="${L}" x2="${W - R}" y1="${hor}" y2="${hor}" stroke="rgba(255,255,255,.25)"/>
    <path d="${d(0, 1440)}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2" stroke-dasharray="3 5"/>
    <path d="${day}" fill="none" stroke="#fdd663" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="${X(rise).toFixed(1)}" cy="${hor}" r="4" fill="#fdd663"/><circle cx="${X(set).toFixed(1)}" cy="${hor}" r="4" fill="#f9ab00"/>
    ${lab(rise, sun.rise)}${lab(set, sun.set)}
    <circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="7" fill="#131314" stroke="#aecbfa" stroke-width="2.5"/>
  </svg>`;
}

/* ---------- app ---------- */
export default {
  id: 'clima',
  title: 'Clima',
  cloud: false,

  render(ctx) {
    const { el, kit, game, phone } = ctx;
    const m = model(ctx.data || {});
    const now = time.parse(time.MIRROR_NOW);
    const n = m.now;
    const place = `${m.city}, ${m.region}`;
    const dirName = dirOf(n.windDir)?.[1] || String(n.windDir);
    const dirCode = String(n.windDir).toUpperCase();
    game.see('clima:agora');
    const offline = () => phone.toast('Sem conexão: a extração só tem os dados salvos no aparelho.', { icon: 'cloud' });

    /* céu de fundo (estrelas determinísticas) */
    let seed = 7;
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    let stars = '';
    for (let i = 0; i < 60; i++) {
      const x = (rnd() * 100).toFixed(1), y = (rnd() * 96).toFixed(1), r = (0.4 + rnd() * 1.1).toFixed(2);
      stars += `<circle class="${i % 5 === 0 ? 'tw' : ''}" cx="${x}%" cy="${y}%" r="${r}" fill="#fff" opacity="${(0.3 + rnd() * 0.5).toFixed(2)}" style="animation-delay:${(rnd() * 4).toFixed(1)}s"/>`;
    }
    const sky = h('div', { class: 'cw-sky', 'aria-hidden': 'true' }, h('div', { html: `<svg width="100%" height="100%">${stars}</svg>` }));

    /* topo */
    const top = h('header', { class: 'cw-top' },
      h('button', { class: 'cw-loc', on: { click: () => openPlaces() } }, icon('map-pin', { size: 18 }), h('span', null, m.city), icon('chevron-down', { size: 18 })),
      kit.iconButton({ icon: 'settings', label: 'Configurações', onClick: offline }));

    /* agora */
    const hero = h('section', { class: 'cw-hero' },
      h('div', { class: 'now' }, 'Agora'),
      h('div', { class: 'main' },
        h('div', { class: 'temp' }, h('b', null, String(n.temp)), h('sup', null, '°')),
        h('div', { class: 'gl' }, glyph(n.icon, 84))),
      h('div', { class: 'desc txt' }, n.desc),
      h('div', { class: 'mm' }, `Máx.: ${n.max}° · Mín.: ${n.min}°`),
      h('div', { class: 'feels' }, `Sensação térmica de ${n.feels}°`),
      h('div', { class: 'pinrow' }, kit.pinButton({
        key: 'clima:agora', label: `Clima em ${place} · ${time.weekday(now)} ${time.hhmm(now)}`, app: 'clima',
        detail: `${n.temp} °C (sensação ${n.feels} °C) · ${n.desc} · vento de ${dirName} a ${n.wind} km/h, rajadas de ${n.gust} km/h`,
      })));

    /* previsão por hora (Temperatura / Vento / Chuva) */
    const nextDay = (a, i, list) => i > 0 && time.ymd(a.at) !== time.ymd(list[i - 1].at);
    const hoursBox = h('div', { class: 'cw-hours' });
    let hmode = 'temp';
    const drawHours = () => {
      clear(hoursBox);
      m.hourly.forEach((x, i, list) => {
        const ev = !!x.event || x.temp === undefined;
        const lbl = x.label && !ev ? x.label : ev ? time.hhmm(x.at) : `${nextDay(x, i, list) ? time.weekday(x.at) + '. ' : ''}${time.hhmm(x.at).slice(0, 2)}h`;
        let mid, val;
        if (ev) { mid = glyph(x.icon, 34); val = h('span', { class: 'evn' }, x.label || ''); }
        else if (hmode === 'wind') { mid = arrowEl(x.windDir || n.windDir); val = h('b', null, x.wind != null ? `${x.wind}` : '—', h('small', null, ' km/h')); }
        else if (hmode === 'rain') { mid = h('span', { class: 'drop', html: dropSvg(20) }); val = h('b', null, `${x.rain ?? n.rain ?? 0}%`); }
        else { mid = glyph(x.icon, 34); val = h('b', null, `${x.temp}°`); }
        hoursBox.append(h('div', { class: `hr ${i === 0 ? 'now' : ''} ${ev ? 'ev' : ''}` }, h('small', null, lbl), mid, val));
      });
      phone.scan(hoursBox);
    };
    const segs = [['temp', 'Temperatura'], ['wind', 'Vento'], ['rain', 'Chuva']].map(([id, label]) => h('button', { class: `cw-seg ${id === hmode ? 'on' : ''}`, on: { click: () => { sfx.play('tap'); hmode = id; segs.forEach((b) => b.classList.toggle('on', b.dataset.id === id)); drawHours(); } }, dataset: { id } }, label));
    drawHours();
    const hourly = h('section', { class: 'cw-card' },
      h('div', { class: 'ch' }, icon('clock', { size: 18 }), h('h3', null, 'Previsão por hora')),
      h('div', { class: 'cw-segs', role: 'group', 'aria-label': 'Tipo de previsão' }, segs),
      hoursBox);

    /* 7 dias */
    const lo = Math.min(...m.daily.map((d) => d.min)), hi = Math.max(...m.daily.map((d) => d.max)), span = Math.max(1, hi - lo);
    const daily = h('section', { class: 'cw-card' },
      h('div', { class: 'ch' }, icon('calendar-days', { size: 18 }), h('h3', null, `Previsão para ${m.daily.length} dias`)),
      h('div', { class: 'cw-days' }, m.daily.map((d, i) => h('div', { class: `dy ${i === 0 ? 'today' : ''}` },
        h('span', { class: 'dn' }, i === 0 ? 'Hoje' : `${time.weekday(d.date)}.`),
        h('span', { class: 'rn' }, d.rain ? h('span', { class: 'rr' }, h('span', { html: dropSvg(12) }), `${d.rain}%`) : null),
        glyph(d.icon, 28),
        h('span', { class: 'hi' }, `${d.max}°`),
        h('span', { class: 'bar' }, h('i', { style: `left:${(((d.min - lo) / span) * 100).toFixed(1)}%;width:${(((d.max - d.min) / span) * 100).toFixed(1)}%` })),
        h('span', { class: 'lo' }, `${d.min}°`)))));

    /* cartões de detalhes */
    const tile = (ic, label, big, small, extra, cls = '') => h('section', { class: `cw-tile ${cls}` },
      h('div', { class: 'tl' }, ic, label), h('div', { class: 'tv' }, big), small ? h('div', { class: 'ts txt' }, small) : null, extra || null);
    const raw = (svg) => h('span', { class: 'rw', html: svg });
    const wind = h('section', { class: 'cw-tile cw-wind' },
      h('div', { class: 'tl' }, icon('wind', { size: 18 }), 'Vento'),
      h('div', { class: 'wrow' },
        h('div', { class: 'wtx' },
          h('div', { class: 'tv' }, h('b', null, String(n.wind)), h('small', null, ' km/h')),
          h('div', { class: 'wd txt' }, `Vento de ${dirName}${dirCode && dirCode.length <= 2 ? ` (${dirCode})` : ''}`),
          h('div', { class: 'ts txt' }, `Rajadas de até ${n.gust} km/h`),
          h('div', { class: 'ts txt' }, `${time.weekday(now)}., ${now.getDate()} de ${time.monthShort(now.getMonth())}. · ${time.hhmm(now)}`)),
        h('div', { class: 'cmp', html: compassSvg(n.windDir) })));
    const dl = mins(m.sun.set) - mins(m.sun.rise);
    const toRise = (1440 - mins(time.hhmm(now)) + mins(m.sun.rise)) % 1440;
    const sun = h('section', { class: 'cw-tile cw-sun' },
      h('div', { class: 'tl' }, icon('sunrise', { size: 18 }), 'Nascer e pôr do sol'),
      h('div', { class: 'srow' },
        h('div', null, h('small', null, 'Nascer do sol'), h('b', null, m.sun.rise)),
        h('div', null, h('small', null, 'Pôr do sol'), h('b', null, m.sun.set))),
      h('div', { html: sunArc(m.sun, time.hhmm(now)) }),
      h('div', { class: 'ts' }, `${Math.floor(dl / 60)} h ${String(dl % 60).padStart(2, '0')} min de luz · o sol nasce em ${Math.floor(toRise / 60)} h ${toRise % 60} min`));
    const tiles = h('div', { class: 'cw-grid' },
      wind,
      tile(raw(dropSvg()), 'Umidade', `${n.humidity}%`, `Ponto de orvalho: ${dew(n.temp, n.humidity)}°`, h('div', { class: 'meter' }, h('i', { style: `width:${Math.max(0, Math.min(100, n.humidity))}%` }))),
      tile(icon('thermometer', { size: 18 }), 'Sensação térmica', `${n.feels}°`, n.feels < n.temp ? 'O vento faz parecer mais frio' : 'Parecida com a temperatura real'),
      tile(icon('sun', { size: 18 }), 'Índice UV', String(n.uv), n.uv === 0 ? 'Baixo durante a noite' : 'Use protetor solar', h('div', { class: 'uvbar' }, h('i', { style: `left:${Math.min(100, (Number(n.uv) || 0) / 11 * 100)}%` }))),
      tile(raw(gaugeSvg()), 'Pressão', h('span', null, h('b', null, String(n.pressure)), h('small', null, ' hPa')), 'Estável'),
      tile(icon('eye', { size: 18 }), 'Visibilidade', h('span', null, h('b', null, String(n.visibility)), h('small', null, ' km')), 'Ótima: céu limpo'),
      tile(icon('cloud', { size: 18 }), 'Precipitação', `${n.rain ?? 0}%`, 'Sem chuva prevista nas próximas horas'),
      sun);

    const upd = time.parse(m.updated);
    el.append(
      sky,
      h('div', { class: 'cw-wrap' },
        top,
        hero,
        hourly,
        daily,
        tiles,
        h('p', { class: 'cw-foot' }, icon('info', { size: 14 }), `${place} · atualizado ${time.weekday(upd)}. ${time.hhmm(upd)} · dados salvos no aparelho`)));
    phone.scan(el);

    /* locais salvos (folha inferior) */
    function openPlaces() {
      phone.sheet({
        title: 'Locais',
        render(body, close) {
          body.classList.add('cw-places');
          const item = (c, cur) => h('button', { class: `cw-place ${cur ? 'cur' : ''}`, on: { click: () => { if (cur) close(); else offline(); } } },
            h('div', { class: 'tx' }, h('b', null, c.city + (c.region ? `, ${c.region}` : '')), h('small', null, cur ? `Local atual · ${n.desc}` : (c.desc || ''))),
            glyph(c.icon || 'cloud', 34), h('span', { class: 'tp' }, `${c.temp}°`));
          body.append(item({ city: m.city, region: m.region, temp: n.temp, icon: n.icon }, true), ...m.saved.map((c) => item(c, false)));
        },
      });
    }
  },

  search({ data }) {
    const m = model(data || {});
    const n = m.now;
    const out = [{ title: `Clima em ${m.city}`, text: `${n.temp} °C · ${n.desc} · vento ${n.wind} km/h · máx. ${n.max}° mín. ${n.min}°`, params: {} }];
    for (const c of m.saved) out.push({ title: `Clima em ${c.city}`, text: `${c.temp} °C · ${c.desc || ''}`, params: {} });
    return out;
  },
};
