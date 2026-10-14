// Clima — Guaraciaba do Norte (CE), sáb 10/10/2026 23:47 (hora do espelho): noite limpa, ventania na serra.
// Lê CASE.clima se houver dados; o que faltar usa os padrões abaixo. Visual: céu noturno, vidro fosco, SVG desenhado à mão.
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

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

/* ---------- ícones de tempo desenhados à mão ---------- */
let uid = 0;
const CLOUD = 'M13 36a7 7 0 0 1-1-13.9A10 10 0 0 1 31.3 19.8 8.5 8.5 0 0 1 35 36z';
const MOON = 'M-.16 -14A14 14 0 1 0 13.18 4.68A11.5 11.5 0 0 1 -.16 -14Z';
const SPARK = 'M0 -3.4L.9 -.9L3.4 0L.9 .9L0 3.4L-.9 .9L-3.4 0L-.9 -.9Z';
const ALIAS = { moon: 'clear-night', lua: 'clear-night', limpo: 'clear-night', sol: 'sun', 'cloud-sun': 'partly-day', 'cloud-moon': 'partly-night', nublado: 'cloud', chuva: 'rain', 'cloud-rain': 'rain' };

function wx(kind, size = 44) {
  const k = ALIAS[kind] || kind, id = `clw${++uid}`;
  const rays = (cx, cy, r1, r2, n = 8, from = 0, span = 360) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = ((from + (span / (span === 360 ? n : n - 1)) * i - 90) * Math.PI) / 180;
      s += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}"/>`;
    }
    return `<g stroke="#ffc65a" stroke-width="2.6" stroke-linecap="round">${s}</g>`;
  };
  const sun = (cx, cy, s) => `${rays(cx, cy, 12.5 * s, 17 * s)}<circle cx="${cx}" cy="${cy}" r="${(9 * s).toFixed(1)}" fill="url(#${id}s)"/>`;
  const moon = (cx, cy, s) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="${MOON}" fill="url(#${id}m)"/>`;
  const star = (cx, cy, s) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="${SPARK}" fill="#fff6d6"/>`;
  const cloud = (dx = 0, dy = 0, s = 1) => `<path transform="translate(${dx} ${dy}) scale(${s})" d="${CLOUD}" fill="url(#${id}c)"/>`;
  let g = '';
  switch (k) {
    case 'sun': g = sun(24, 24, 1); break;
    case 'sunrise': g = `${rays(24, 31, 13, 17.5, 5, -60, 120)}<path d="M12 32a12 12 0 0 1 24 0z" fill="url(#${id}s)"/><path d="M5 36.5h38" stroke="#bcd0f5" stroke-width="2.6" stroke-linecap="round"/><path d="M17 41.5h14" stroke="#bcd0f5" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`; break;
    case 'partly-day': g = `${sun(17, 16, .66)}${cloud(2, 4, .95)}`; break;
    case 'partly-night': g = `${moon(17, 17, .78)}${star(35, 10, .7)}${cloud(2, 4, .95)}`; break;
    case 'cloud': g = cloud(-1, 0, 1.08); break;
    case 'rain': g = `${cloud(0, -5, 1)}<g stroke="#6cc3ff" stroke-width="2.8" stroke-linecap="round"><line x1="17" y1="37" x2="14.5" y2="43"/><line x1="25" y1="37" x2="22.5" y2="43"/><line x1="33" y1="37" x2="30.5" y2="43"/></g>`; break;
    default: g = `${moon(22, 25, 1.12)}${star(37, 11, 1.15)}${star(38, 31, .7)}${star(9, 10, .8)}`;
  }
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" class="cl-gl" style="display:block"><defs>
    <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3fc"/><stop offset="1" stop-color="#a9b9d6"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#ff9f43"/></linearGradient>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset="1" stop-color="#e8c878"/></linearGradient></defs>${g}</svg>`;
}
const glyph = (kind, size) => h('span', { class: 'gw', html: wx(kind, size) });
const dropSvg = (s = 18) => `<svg xmlns="http://www.w3.org/2000/svg" class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c3.2 4 6.2 7.1 6.2 11a6.2 6.2 0 0 1-12.4 0C5.8 10.1 8.8 7 12 3z"/></svg>`;
const gaugeSvg = (s = 18) => `<svg xmlns="http://www.w3.org/2000/svg" class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 17a9 9 0 1 1 15.6 0"/><path d="M12 15l3.6-5.2"/><circle cx="12" cy="15.4" r="1.3"/></svg>`;

/* ---------- vento / orvalho / sol ---------- */
const DIRS = { N: [0, 'norte'], NE: [45, 'nordeste'], L: [90, 'leste'], E: [90, 'leste'], SE: [135, 'sudeste'], S: [180, 'sul'], SO: [225, 'sudoeste'], O: [270, 'oeste'], NO: [315, 'noroeste'] };
function compassSvg(dir) {
  const [deg] = DIRS[String(dir).toUpperCase()] || [90];
  const to = deg + 180; // o vento sopra de `deg` para o lado oposto
  const pt = (a, rr, cx = 32, cy = 32) => [(cx + rr * Math.sin((a * Math.PI) / 180)).toFixed(1), (cy - rr * Math.cos((a * Math.PI) / 180)).toFixed(1)];
  const [x1, y1] = pt(deg, 15), [x2, y2] = pt(to, 15);
  const [b1x, b1y] = pt(to + 150, 8, +x2, +y2), [b2x, b2y] = pt(to - 150, 8, +x2, +y2);
  const lab = (t, a) => { const [x, y] = pt(a, 29); return `<text x="${x}" y="${(+y + 3).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="#9fb0d0" font-weight="600">${t}</text>`; };
  return `<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)"/>${lab('N', 0)}${lab('L', 90)}${lab('S', 180)}${lab('O', 270)}
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#bcd5ff" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M${b1x} ${b1y}L${x2} ${y2}L${b2x} ${b2y}" fill="none" stroke="#bcd5ff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
const dew = (t, rh) => Math.round(t - (100 - rh) / 5);
const mins = (hhmm) => { const [a, b] = String(hhmm).split(':').map(Number); return (a || 0) * 60 + (b || 0); };

/** Arco do dia: curva do sol nas 24 h, nascer/pôr marcados e a Lua na hora do espelho (abaixo do horizonte). */
function sunArc(sun, nowHm) {
  const W = 320, H = 132, L = 14, R = 14, pw = W - L - R, hor = 70, amp = 42;
  const rise = mins(sun.rise), set = mins(sun.set), noon = (rise + set) / 2, D = set - rise;
  const f = (t) => Math.cos((2 * Math.PI * (t - noon)) / 1440) - Math.cos((Math.PI * D) / 1440);
  const X = (t) => L + (t / 1440) * pw, Y = (t) => hor - f(t) * amp;
  const pts = [];
  for (let t = 0; t <= 1440; t += 10) pts.push([X(t), Y(t)]);
  const d = (a, b) => pts.filter(([x]) => x >= X(a) - 0.01 && x <= X(b) + 0.01).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const day = d(Math.ceil(rise / 10) * 10, Math.floor(set / 10) * 10);
  const nowT = mins(nowHm), nx = X(nowT), ny = Y(nowT);
  const lab = (t, txt, anchor) => `<text x="${X(t).toFixed(1)}" y="${hor + 18}" text-anchor="${anchor}" fill="#cfdcf5" font-size="11" font-weight="600">${txt}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Arco do sol: nascer ${sun.rise}, pôr ${sun.set}" style="display:block">
    <defs><linearGradient id="clarc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb55a"/><stop offset="1" stop-color="#ffd978"/></linearGradient></defs>
    <rect x="${L}" y="${hor}" width="${pw}" height="${H - hor - 26}" fill="rgba(5,10,28,.35)"/>
    <line x1="${L}" x2="${W - R}" y1="${hor}" y2="${hor}" stroke="rgba(255,255,255,.3)"/>
    <path d="${d(0, 1440)}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2" stroke-dasharray="3 5"/>
    <path d="${day}" fill="none" stroke="url(#clarc)" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="${X(rise).toFixed(1)}" cy="${hor}" r="4.2" fill="#ffc65a"/><circle cx="${X(set).toFixed(1)}" cy="${hor}" r="4.2" fill="#ff9f43"/>
    ${lab(rise, sun.rise, 'middle')}${lab(set, sun.set, 'middle')}
    <line x1="${nx.toFixed(1)}" x2="${nx.toFixed(1)}" y1="14" y2="${(hor + 24).toFixed(1)}" stroke="rgba(255,255,255,.28)" stroke-dasharray="2 3"/>
    <g transform="translate(${nx.toFixed(1)} ${ny.toFixed(1)}) scale(.62)"><circle r="16" fill="#0b1431" stroke="rgba(255,246,207,.5)"/><path d="${MOON}" fill="#fff0b8" transform="scale(.8)"/></g>
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
    const [, dirName] = DIRS[String(n.windDir).toUpperCase()] || [0, String(n.windDir)];
    game.see('clima:agora');

    /* estrelas (determinísticas) */
    let seed = 7;
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    let stars = '';
    for (let i = 0; i < 70; i++) {
      const x = (rnd() * 100).toFixed(1), y = (rnd() * 96).toFixed(1), r = (0.5 + rnd() * 1.2).toFixed(2);
      stars += `<circle class="${i % 5 === 0 ? 'tw' : ''}" cx="${x}%" cy="${y}%" r="${r}" fill="#fff" opacity="${(0.35 + rnd() * 0.55).toFixed(2)}" style="animation-delay:${(rnd() * 4).toFixed(1)}s"/>`;
    }
    const sky = h('div', { class: 'cl-sky', 'aria-hidden': 'true' },
      h('div', { html: `<svg width="100%" height="100%">${stars}</svg>` }),
      h('div', { class: 'gusts', html: '<svg viewBox="0 0 390 200" preserveAspectRatio="none" width="100%" height="100%"><path d="M-20 70C60 52 120 92 200 66S330 50 420 74"/><path d="M-30 120C50 104 100 138 190 116S320 100 430 124"/><path d="M-10 168C70 154 130 184 210 162S340 150 420 170"/></svg>' }));

    /* hero */
    const hero = h('section', { class: 'cl-hero' },
      h('div', { class: 'city' }, icon('map-pin', { size: 16 }), place),
      h('div', { class: 'when' }, `${time.weekday(now)}, ${time.dateShort(now)} · ${time.hhmm(now)}`),
      h('div', { class: 'main' },
        h('div', { class: 'temp' }, h('b', null, String(n.temp)), h('sup', null, '°')),
        h('div', { class: 'moon' }, glyph(n.icon, 96))),
      h('div', { class: 'desc txt' }, n.desc),
      h('div', { class: 'mm' }, h('span', null, icon('chevron-up', { size: 15 }), `Máx. ${n.max}°`), h('span', null, icon('chevron-down', { size: 15 }), `Mín. ${n.min}°`)),
      h('div', { class: 'pinrow' }, kit.pinButton({
        key: 'clima:agora', label: `Clima em ${place} · ${time.weekday(now)} ${time.hhmm(now)}`, app: 'clima',
        detail: `${n.temp} °C (sensação ${n.feels} °C) · ${n.desc} · vento de ${dirName} a ${n.wind} km/h, rajadas de ${n.gust} km/h`,
      })));

    /* próximas horas */
    const nextDay = (a, i, list) => i > 0 && time.ymd(a.at) !== time.ymd(list[i - 1].at);
    const hours = h('div', { class: 'cl-hours' }, m.hourly.map((x, i, list) => {
      const ev = !!x.event || x.temp === undefined;
      const lbl = x.label && !ev ? x.label : ev ? time.hhmm(x.at) : `${nextDay(x, i, list) ? time.weekday(x.at) + ' ' : ''}${time.hhmm(x.at).slice(0, 2)}h`;
      return h('div', { class: `hr ${i === 0 ? 'now' : ''} ${ev ? 'ev' : ''}` },
        h('small', null, lbl), glyph(x.icon, 38),
        ev ? h('span', { class: 'evn' }, x.label || '') : h('b', null, `${x.temp}°`),
        !ev && x.wind ? h('span', { class: 'wd' }, icon('wind', { size: 12 }), `${x.wind}`) : null);
    }));

    /* tiles */
    const tile = (ic, label, big, small, extra) => h('div', { class: 'cl-tile' },
      h('div', { class: 'tl' }, ic, label), h('div', { class: 'tv' }, big), small ? h('div', { class: 'ts' }, small) : null, extra || null);
    const raw = (svg) => h('span', { class: 'rw', html: svg });
    const tiles = h('section', { class: 'cl-grid' },
      h('div', { class: 'cl-tile wind' },
        h('div', { class: 'tl' }, icon('wind', { size: 18 }), 'Vento'),
        h('div', { class: 'wrow' }, h('div', null, h('div', { class: 'tv' }, h('b', null, String(n.wind)), h('small', null, ' km/h')), h('div', { class: 'ts' }, `de ${dirName} · rajadas de ${n.gust} km/h`)), h('div', { class: 'cmp', html: compassSvg(n.windDir) }))),
      tile(icon('thermometer', { size: 18 }), 'Sensação', `${n.feels}°`, n.feels < n.temp ? 'Mais frio por causa do vento' : 'Parecida com a temperatura'),
      tile(raw(dropSvg()), 'Umidade', `${n.humidity}%`, `Ponto de orvalho ${dew(n.temp, n.humidity)}°`),
      tile(icon('eye', { size: 18 }), 'Visibilidade', h('span', null, h('b', null, String(n.visibility)), h('small', null, ' km')), 'Ótima: céu limpo'),
      tile(icon('cloud', { size: 18 }), 'Chuva', `${n.rain ?? 0}%`, 'Nenhuma chuva nas próximas 24 h'),
      tile(icon('sun', { size: 18 }), 'Índice UV', String(n.uv), n.uv === 0 ? 'Baixo (noite)' : 'Use protetor'),
      tile(raw(gaugeSvg()), 'Pressão', h('span', null, h('b', null, String(n.pressure)), h('small', null, ' hPa')), 'Estável'));

    /* 7 dias */
    const lo = Math.min(...m.daily.map((d) => d.min)), hi = Math.max(...m.daily.map((d) => d.max)), span = Math.max(1, hi - lo);
    const days = h('div', { class: 'cl-days' }, m.daily.map((d, i) => h('div', { class: `dy ${i === 0 ? 'today' : ''}` },
      h('span', { class: 'dn' }, i === 0 ? 'Hoje' : time.weekday(d.date)),
      glyph(d.icon, 30),
      h('span', { class: 'rn' }, d.rain ? h('span', { class: 'rr' }, raw(dropSvg(11)), `${d.rain}%`) : null),
      h('span', { class: 'lo' }, `${d.min}°`),
      h('span', { class: 'bar' }, h('i', { style: `left:${(((d.min - lo) / span) * 100).toFixed(1)}%;width:${(((d.max - d.min) / span) * 100).toFixed(1)}%` })),
      h('span', { class: 'hi' }, `${d.max}°`))));

    /* sol */
    const dl = mins(m.sun.set) - mins(m.sun.rise);
    const sun = h('section', { class: 'cl-card cl-sun' },
      h('div', { class: 'ch' }, icon('sunrise', { size: 18 }), h('h3', null, 'Nascer e pôr do sol'), h('small', null, `${Math.floor(dl / 60)} h ${String(dl % 60).padStart(2, '0')} min de sol`)),
      h('div', { html: sunArc(m.sun, time.hhmm(now)) }),
      h('p', { class: 'tip' }, icon('moon', { size: 14 }), `Agora é noite: o sol nasce às ${m.sun.rise}, em ${Math.floor((1440 - mins(time.hhmm(now)) + mins(m.sun.rise)) / 60)} h ${(1440 - mins(time.hhmm(now)) + mins(m.sun.rise)) % 60} min.`));

    /* cidades salvas */
    const saved = h('section', { class: 'cl-card cl-saved' },
      h('div', { class: 'ch' }, icon('map-pin', { size: 18 }), h('h3', null, 'Cidades salvas')),
      m.saved.map((c) => h('button', { class: 'sv', on: { click: () => phone.toast('Sem conexão: a previsão desta cidade não está no espelho.', { icon: 'cloud' }) } },
        h('div', { class: 'tx' }, h('b', null, c.city + (c.region ? `, ${c.region}` : '')), h('small', null, c.desc || '')),
        glyph(c.icon || 'cloud', 34), h('span', { class: 'tp' }, `${c.temp}°`))));

    const block = (title, ic, child, extra = '') => h('section', { class: `cl-card ${extra}` }, h('div', { class: 'ch' }, icon(ic, { size: 18 }), h('h3', null, title)), child);
    const upd = time.parse(m.updated);

    el.append(
      kit.appBar({ title: 'Clima', subtitle: place, className: 'cl-bar' }),
      sky,
      h('div', { class: 'cl-wrap' },
        hero,
        block('Próximas horas', 'clock', hours, 'cl-hourly'),
        tiles,
        block('Próximos 7 dias', 'calendar-days', days, 'cl-daily'),
        sun,
        saved,
        h('p', { class: 'cl-foot' }, icon('info', { size: 14 }), `Atualizado ${time.weekday(upd)} ${time.hhmm(upd)} · dados salvos no aparelho`)));
    phone.scan(el);
  },

  search({ data }) {
    const m = model(data || {});
    const n = m.now;
    const out = [{ title: `Clima em ${m.city}`, text: `${n.temp} °C · ${n.desc} · vento ${n.wind} km/h · máx. ${n.max}° mín. ${n.min}°`, params: {} }];
    for (const c of m.saved) out.push({ title: `Clima em ${c.city}`, text: `${c.temp} °C · ${c.desc || ''}`, params: {} });
    return out;
  },
};
