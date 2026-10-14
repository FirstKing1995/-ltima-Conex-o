// Pulso — saúde e relógio inteligente (Pulso Band 4). Dados do aparelho: tudo até sáb 10/10, 23:47.
import { h, clear, esc } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

const TODAY = time.ymd(time.MIRROR_NOW);
const GOAL = 8000;
let UID = 0;

/* ---------- utilidades ---------- */
const pad = (n) => String(n).padStart(2, '0');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtInt = (n) => Math.round(Number(n) || 0).toLocaleString('pt-BR');
const kmOf = (steps) => (steps || 0) * 0.00074;
const fmtKm = (steps) => `${kmOf(steps).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
const kcalOf = (steps) => Math.round((steps || 0) * 0.042);
const addDays = (ymd, n) => { const d = time.parse(ymd); d.setDate(d.getDate() + n); return time.ymd(d); };
const tHours = (t) => { const p = String(t).split(':').map(Number); return (p[0] || 0) + (p[1] || 0) / 60 + (p[2] || 0) / 3600; };
const NOW_H = tHours(time.hhmmss(time.MIRROR_NOW));
const dayTitle = (date) => `${cap(time.weekdayLong(date))}, ${time.dateLong(date).replace(/ de \d{4}$/, '')}`;
const stripWarn = (s) => String(s || '').replace(/^\s*(⚠️?|⚠)\s*/u, '');

function rng(seed) {
  let s = 2166136261;
  for (const ch of String(seed)) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619) >>> 0; }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** Curva suave que não ultrapassa os pontos (interpolação cúbica monótona). */
function smoothPath(pts) {
  const n = pts.length;
  if (n < 2) return '';
  if (n === 2) return `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} L${pts[1][0].toFixed(1)},${pts[1][1].toFixed(1)}`;
  const dx = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0] || 1e-6; m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]; }
  t[0] = m[0];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  t[n - 1] = m[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const k = dx[i] / 3;
    d += ` C${(pts[i][0] + k).toFixed(1)},${(pts[i][1] + t[i] * k).toFixed(1)} ${(pts[i + 1][0] - k).toFixed(1)},${(pts[i + 1][1] - t[i + 1] * k).toFixed(1)} ${pts[i + 1][0].toFixed(1)},${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
}

/* ---------- dados ---------- */
function stepsOf(data, date) {
  const s = (data.steps || []).find((x) => x.date === date);
  return s ? Number(s.value) || 0 : null;
}

/** Série de frequência cardíaca do dia. Sem registros detalhados, desenha a média por hora (estimada). */
function hrSeries(data, date) {
  const raw = data.heart?.[date];
  if (Array.isArray(raw) && raw.length) {
    const pts = raw.map(([t, bpm]) => ({ t: tHours(t), label: String(t), bpm: Number(bpm) })).filter((p) => isFinite(p.t) && isFinite(p.bpm)).sort((a, b) => a.t - b.t);
    if (pts.length) return { pts, synthetic: false };
  }
  const steps = stepsOf(data, date) ?? 6000;
  const r = rng(date);
  const pts = [];
  for (let hh = 0; hh < 24; hh++) {
    const base = hh < 6 ? 57 : hh < 8 ? 66 : 72;
    const bump = hh >= 8 && hh <= 19 ? Math.min(30, (steps / 12000) * 26) * Math.sin(((hh - 8) / 11) * Math.PI) : 0;
    pts.push({ t: hh, label: `${pad(hh)}:00`, bpm: Math.round(base + bump + (r() - 0.5) * 8) });
  }
  return { pts, synthetic: true };
}

function sleepOf(data) {
  const list = (data.sleep || []).slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const cur = list.filter((s) => s.date <= TODAY).pop() || null;
  return { cur, list: list.filter((s) => s.date <= TODAY).slice(-7) };
}
const sleepHours = (s) => Number(s?.hours ?? (s?.minutes ? s.minutes / 60 : 0)) || 0;
const fmtSleep = (hrs) => { const m = Math.round(hrs * 60); return `${Math.floor(m / 60)} h ${pad(m % 60)} min`; };
function sleepQuality(s) {
  const q = s?.quality;
  if (typeof q === 'number') return q >= 80 ? 'Boa' : q >= 60 ? 'Regular' : 'Ruim';
  return q ? cap(String(q)) : '';
}

/* ---------- gráficos (SVG desenhado à mão) ---------- */
function ringSvg(pct, id, size = 150, stroke = 15) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = Math.max(0, Math.min(1, pct)), m = size / 2;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${Math.round(pct * 100)}% da meta de passos">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b88"/><stop offset="1" stop-color="#ffb454"/></linearGradient></defs>
    <circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${stroke}"/>
    <circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${m} ${m})"/>
  </svg>`;
}

function sparkSvg(pts, w = 132, hgt = 42) {
  if (pts.length < 2) return '';
  const lo = Math.min(...pts.map((p) => p.bpm)) - 4, hi = Math.max(...pts.map((p) => p.bpm)) + 4;
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1;
  const xy = pts.map((p) => [3 + ((p.t - t0) / (t1 - t0 || 1)) * (w - 8), 4 + (1 - (p.bpm - lo) / (hi - lo || 1)) * (hgt - 8)]);
  const last = xy[xy.length - 1];
  return `<svg viewBox="0 0 ${w} ${hgt}" width="100%" height="${hgt}" preserveAspectRatio="none" aria-hidden="true">
    <path d="${smoothPath(xy)}" fill="none" stroke="#ff6b88" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="#ff4d4f"/>
  </svg>`;
}

/** Gráfico de linha da frequência cardíaca. abrupt = o relógio parou de enviar dados (marcador vermelho). */
function hrChart(series, { abrupt = false } = {}) {
  const id = `plhr${++UID}`;
  const W = 360, H = 216, L = 38, R = 12, T = 24, B = 30;
  const pw = W - L - R, ph = H - T - B;
  const pts = series.pts;
  const lo = Math.min(...pts.map((p) => p.bpm)), hi = Math.max(...pts.map((p) => p.bpm));
  let y0 = Math.max(40, Math.floor((lo - 10) / 20) * 20);
  let y1 = Math.ceil((hi + 10) / 20) * 20;
  if (y1 - y0 < 60) y1 = y0 + 60;
  const ystep = y1 - y0 > 100 ? 40 : 20;
  y1 = y0 + Math.ceil((y1 - y0) / ystep) * ystep;
  let x0, x1;
  if (series.synthetic) { x0 = 0; x1 = 24; } else {
    x0 = Math.floor(pts[0].t); x1 = Math.ceil(pts[pts.length - 1].t);
    if (abrupt) x1 = Math.max(x1, Math.ceil(NOW_H));
    if (x1 - x0 < 2) { x1 = Math.min(24, x0 + 2); x0 = Math.max(0, x1 - 2); }
  }
  const span = x1 - x0;
  const X = (t) => L + ((t - x0) / span) * pw;
  const Y = (b) => T + (1 - (b - y0) / (y1 - y0)) * ph;
  const xs = span <= 3 ? 0.5 : span <= 6 ? 1 : span <= 12 ? 2 : 3;
  let grid = '', xl = '';
  for (let v = y0; v <= y1 + 0.01; v += ystep) grid += `<line x1="${L}" x2="${W - R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.08)" stroke-dasharray="2 4"/><text x="${L - 7}" y="${(Y(v) + 3.5).toFixed(1)}" text-anchor="end" fill="#8d8186" font-size="10">${v}</text>`;
  for (let v = x0; v <= x1 + 0.01; v += xs) {
    const hh = Math.floor(v), mm = Math.round((v - hh) * 60);
    const lab = span > 12 ? `${pad(hh)}h` : `${pad(hh)}:${pad(mm)}`;
    xl += `<line x1="${X(v).toFixed(1)}" x2="${X(v).toFixed(1)}" y1="${T + ph}" y2="${T + ph + 4}" stroke="rgba(255,255,255,.25)"/><text x="${X(v).toFixed(1)}" y="${H - 10}" text-anchor="middle" fill="#8d8186" font-size="10">${lab}</text>`;
  }
  const xy = pts.map((p) => [X(p.t), Y(p.bpm)]);
  const line = series.synthetic || xy.length > 2 ? smoothPath(xy) : `M${xy.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' L')}`;
  const lastP = pts[pts.length - 1], firstP = pts[0];
  const area = `${line} L${X(lastP.t).toFixed(1)},${T + ph} L${X(firstP.t).toFixed(1)},${T + ph} Z`;
  const maxP = pts.reduce((a, b) => (b.bpm > a.bpm ? b : a), pts[0]);
  const dots = series.synthetic ? '' : pts.map((p) => `<circle cx="${X(p.t).toFixed(1)}" cy="${Y(p.bpm).toFixed(1)}" r="2.2" fill="#ff8fa3"/>`).join('');
  let end = '';
  if (abrupt) {
    const xe = X(lastP.t), ye = Y(lastP.bpm);
    const tag = lastP.label.length > 5 ? lastP.label : `${lastP.label}`;
    const tx = Math.min(W - R - 28, Math.max(L + 28, xe));
    end = `
      <rect x="${xe.toFixed(1)}" y="${T}" width="${Math.max(0, W - R - xe).toFixed(1)}" height="${ph}" fill="url(#${id}h)"/>
      <text transform="translate(${((xe + W - R) / 2 + 3).toFixed(1)} ${(T + ph / 2).toFixed(1)}) rotate(-90)" text-anchor="middle" fill="#ff9d9d" font-size="10" letter-spacing=".08em">SEM SINAL</text>
      <line x1="${xe.toFixed(1)}" x2="${xe.toFixed(1)}" y1="${T - 2}" y2="${T + ph}" stroke="#ff4d4f" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle class="pl-pulse" cx="${xe.toFixed(1)}" cy="${ye.toFixed(1)}" r="10" fill="rgba(255,77,79,.28)"/>
      <circle cx="${xe.toFixed(1)}" cy="${ye.toFixed(1)}" r="5" fill="#ff4d4f" stroke="#fff" stroke-width="1.6"/>
      <rect x="${(tx - 31).toFixed(1)}" y="2" width="62" height="17" rx="8.5" fill="#ff4d4f"/>
      <text x="${tx.toFixed(1)}" y="14" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">${esc(tag)}</text>`;
  }
  const peak = (!series.synthetic && maxP !== lastP)
    ? `<text x="${X(maxP.t).toFixed(1)}" y="${(Y(maxP.bpm) - 8).toFixed(1)}" text-anchor="middle" fill="#ffd0d8" font-size="10.5" font-weight="600">${maxP.bpm}</text>` : '';
  const html = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Gráfico da frequência cardíaca" style="touch-action:pan-y;display:block">
    <defs>
      <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b88" stop-opacity=".38"/><stop offset="1" stop-color="#ff6b88" stop-opacity="0"/></linearGradient>
      <pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,77,79,.30)" stroke-width="2"/></pattern>
    </defs>
    ${grid}${xl}
    <path d="${area}" fill="url(#${id}a)"/>
    <path d="${line}" fill="none" stroke="#ff6b88" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}${peak}${end}
    <g class="cur" opacity="0"><line y1="${T}" y2="${T + ph}" stroke="rgba(255,255,255,.55)" stroke-width="1"/><circle r="4.5" fill="#fff" stroke="#ff6b88" stroke-width="2"/></g>
  </svg>`;
  return { html, pts, X, Y, x0, x1, W, L, pw };
}

/** Barras de passos dos últimos 14 dias. */
function stepsChart(days) {
  const W = 346, H = 176, L = 4, R = 4, T = 26, B = 36;
  const slot = (W - L - R) / days.length, bw = Math.min(16, slot - 8);
  const max = Math.max(GOAL * 1.2, ...days.map((d) => d.value || 0)) * 1.04;
  const Y = (v) => T + (1 - v / max) * (H - T - B);
  const maxDay = days.reduce((a, b) => ((b.value || 0) > (a.value || 0) ? b : a), days[0]);
  let out = '';
  days.forEach((d, i) => {
    const cx = L + slot * i + slot / 2, v = d.value || 0;
    const isToday = d.date === TODAY, ok = v >= GOAL;
    const top = Y(v), base = H - B;
    const fill = isToday ? '#ff6b88' : ok ? 'rgba(255,107,136,.85)' : 'rgba(255,107,136,.42)';
    const wd = 'DSTQQSS'[time.parse(d.date).getDay()];
    out += `<g data-date="${d.date}" style="cursor:pointer">
      <rect x="${(cx - slot / 2).toFixed(1)}" y="0" width="${slot.toFixed(1)}" height="${H}" fill="transparent"/>
      ${v ? `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw}" height="${Math.max(2, base - top).toFixed(1)}" rx="5" fill="${fill}" ${isToday ? 'stroke="#fff" stroke-opacity=".55" stroke-width="1.2"' : ''}/>` : `<rect x="${(cx - bw / 2).toFixed(1)}" y="${base - 2}" width="${bw}" height="2" rx="1" fill="rgba(255,255,255,.14)"/>`}
      ${(isToday || d === maxDay) && v ? `<text x="${cx.toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" fill="${isToday ? '#fff' : '#ffc4cf'}" font-size="10" font-weight="600">${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k</text>` : ''}
      <text x="${cx.toFixed(1)}" y="${H - 18}" text-anchor="middle" fill="${isToday ? '#fff' : '#a99aa0'}" font-size="11" font-weight="${isToday ? 700 : 500}">${wd}</text>
      <text x="${cx.toFixed(1)}" y="${H - 5}" text-anchor="middle" fill="#6f6469" font-size="9">${time.parse(d.date).getDate()}</text>
    </g>`;
  });
  const gy = Y(GOAL).toFixed(1);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Passos dos últimos 14 dias" style="display:block">
    <line x1="${L}" x2="${W - R}" y1="${gy}" y2="${gy}" stroke="rgba(255,255,255,.3)" stroke-dasharray="4 4"/>
    ${out}
    <rect x="${L}" y="${(Y(GOAL) - 17).toFixed(1)}" width="${(`meta ${fmtInt(GOAL)}`.length * 5.1 + 12).toFixed(1)}" height="14" rx="7" fill="#1d1618" fill-opacity=".92"/>
    <text x="${L + 6}" y="${(Y(GOAL) - 6.8).toFixed(1)}" fill="#b4a5ab" font-size="9.5">meta ${fmtInt(GOAL)}</text></svg>`;
}

/* ---------- componentes ---------- */
const stat = (label, value, unit) => h('div', { class: 'pl-stat' }, h('b', null, value, unit ? h('small', null, ` ${unit}`) : null), h('span', null, label));

function eventKind(e) {
  const k = String(e.kind || '').toLowerCase();
  if (k === 'fall') return { cls: 'fall', ic: 'triangle-alert', title: stripWarn(e.title) || 'Queda forte detectada', text: e.text || 'Você está bem? Sem resposta' };
  if (k === 'disconnect') return { cls: 'warn', ic: 'watch', title: e.title || 'Relógio desconectado do celular', text: e.text || '' };
  if (k === 'connect') return { cls: '', ic: 'watch', title: e.title || 'Relógio conectado ao celular', text: e.text || '' };
  if (k === 'high-hr') return { cls: 'warn', ic: 'heart-pulse', title: e.title || 'Frequência cardíaca alta', text: e.text || '' };
  return { cls: '', ic: 'activity', title: e.title || 'Evento', text: e.text || '' };
}

/* ---------- detalhe do dia ---------- */
function drawDay(ctx, el, date) {
  const { kit, game, data } = ctx;
  clear(el);
  game.see(`pulso:day:${date}`);
  const steps = stepsOf(data, date);
  const isToday = date === TODAY;
  const events = (data.events || []).filter((e) => time.ymd(e.at) === date).sort((a, b) => time.compare(a.at, b.at));
  const hasFall = events.some((e) => String(e.kind).toLowerCase() === 'fall');
  const series = hrSeries(data, date);
  const last = series.pts[series.pts.length - 1];
  const abrupt = !series.synthetic && (hasFall || (isToday && last.t < NOW_H - 2 / 60));

  el.append(kit.appBar({ title: dayTitle(date), subtitle: `Pulso Band 4${isToday ? ' · hoje' : ''}` }));
  const wrap = h('div', { class: 'pl-wrap' });

  // resumo
  const pct = steps == null ? 0 : steps / GOAL;
  wrap.append(h('section', { class: 'pl-card pl-sum' },
    h('div', { class: 'big' }, h('b', null, steps == null ? '—' : fmtInt(steps)), h('span', null, 'passos')),
    h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': String(Math.round(pct * 100)), 'aria-label': 'Meta de passos' }, h('i', { style: { width: `${Math.min(100, pct * 100)}%` } })),
    h('div', { class: 'goal' }, steps == null ? 'Sem dados de passos' : pct >= 1 ? `Meta de ${fmtInt(GOAL)} passos atingida` : `${Math.round(pct * 100)}% da meta de ${fmtInt(GOAL)} passos`),
    h('div', { class: 'pl-stats' }, stat('Distância', steps == null ? '—' : kmOf(steps).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 'km'), stat('Calorias ativas', steps == null ? '—' : fmtInt(kcalOf(steps)), 'kcal'), stat('Sono', (() => { const s = (data.sleep || []).find((x) => x.date === date); return s ? fmtSleep(sleepHours(s)) : '—'; })()))));

  // frequência cardíaca
  const chart = hrChart(series, { abrupt });
  const bpms = series.pts.map((p) => p.bpm);
  const avg = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);
  const defaultRead = abrupt ? `Última leitura · ${last.bpm} bpm às ${last.label}` : series.synthetic ? 'Média por hora' : `${last.bpm} bpm às ${last.label}`;
  const read = h('div', { class: `read ${abrupt ? 'red' : ''}` }, defaultRead);
  const box = h('div', { class: 'chart', html: chart.html });
  const svg = box.querySelector('svg');
  const cur = svg.querySelector('.cur');
  const move = (e) => {
    const r = svg.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * chart.W;
    if (vx < chart.L - 6 || vx > chart.L + chart.pw + 6) return;
    const t = chart.x0 + ((vx - chart.L) / chart.pw) * (chart.x1 - chart.x0);
    const p = chart.pts.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a), chart.pts[0]);
    cur.setAttribute('opacity', '1');
    cur.querySelector('line').setAttribute('x1', chart.X(p.t)); cur.querySelector('line').setAttribute('x2', chart.X(p.t));
    cur.querySelector('circle').setAttribute('cx', chart.X(p.t)); cur.querySelector('circle').setAttribute('cy', chart.Y(p.bpm));
    read.textContent = `${p.bpm} bpm às ${p.label}`;
    read.classList.remove('red');
  };
  const leave = () => { cur.setAttribute('opacity', '0'); read.textContent = defaultRead; read.classList.toggle('red', abrupt); };
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', leave);
  svg.addEventListener('pointerup', () => setTimeout(leave, 1600));
  const maxP = series.pts.reduce((a, b) => (b.bpm > a.bpm ? b : a), series.pts[0]);
  wrap.append(h('section', { class: 'pl-card' },
    h('div', { class: 'pl-head' }, icon('heart-pulse', { size: 18 }), h('h3', null, 'Frequência cardíaca'), series.synthetic ? h('small', null, 'estimada') : null),
    read, box,
    h('div', { class: 'pl-stats three' }, stat('Mínima', Math.min(...bpms), 'bpm'), stat('Média', avg, 'bpm'), stat(series.synthetic ? 'Máxima' : `Pico · ${maxP.label.slice(0, 5)}`, maxP.bpm, 'bpm'))));

  // eventos
  wrap.append(h('div', { class: 'pl-sec' }, 'Eventos do dia'));
  if (!events.length) wrap.append(h('div', { class: 'pl-none' }, icon('check', { size: 16 }), 'Nenhum evento registrado neste dia.'));
  for (const e of events) {
    const k = eventKind(e);
    const hms = time.hhmmss(e.at);
    wrap.append(h('article', { class: `pl-ev ${k.cls}` },
      h('div', { class: 'ico' }, icon(k.ic, { size: 22 })),
      h('div', { class: 'tx' },
        h('div', { class: 'tt' }, k.title),
        h('div', { class: 'meta' }, hms, k.text ? h('span', null, ' · ') : null, k.text ? h('span', { class: 'txt' }, k.text) : null),
        h('div', { class: 'act' }, kit.pinButton({
          key: `pulso:event:${e.at}`,
          label: `${k.title} · ${hms}`,
          app: 'pulso',
          detail: `${time.dayLabel(e.at)} · ${k.text || 'Evento do relógio'}`,
        })))));
  }
  ctx.phone.scan(wrap);
  el.append(wrap);
}

function openDay(ctx, date) {
  ctx.nav.push({ title: dayTitle(date), className: 'pl-sub', render: (el) => drawDay(ctx, el, date) });
}

/* ---------- app ---------- */
export default {
  id: 'pulso',
  title: 'Pulso',
  cloud: false,

  render(ctx) {
    const { el, kit, phone, params, data } = ctx;
    const uid = ++UID;
    const stepVals = new Map((data.steps || []).map((s) => [s.date, Number(s.value) || 0]));
    const allDates = [...new Set([...stepVals.keys(), ...Object.keys(data.heart || {}), ...(data.events || []).map((e) => time.ymd(e.at))])].filter((d) => d <= TODAY).sort().reverse();
    const days14 = Array.from({ length: 14 }, (_, i) => { const d = addDays(TODAY, i - 13); return { date: d, value: stepVals.has(d) ? stepVals.get(d) : null }; });
    const todaySteps = stepVals.has(TODAY) ? stepVals.get(TODAY) : (days14[13].value ?? 0);
    const falls = (data.events || []).filter((e) => String(e.kind).toLowerCase() === 'fall').sort((a, b) => time.compare(b.at, a.at));
    const fall = falls[0];
    const fallDates = new Set(falls.map((e) => time.ymd(e.at)));
    const dev = data.device || {};
    const sync = dev.lastSync || time.MIRROR_NOW;
    const disconnected = time.compare(time.MIRROR_NOW, sync) > 90000;

    const wrap = h('div', { class: 'pl-wrap' });

    // alerta de queda
    if (fall) {
      const k = eventKind(fall);
      wrap.append(h('button', { class: 'pl-alert', on: { click: () => openDay(ctx, time.ymd(fall.at)) }, 'aria-label': `${k.title}, ${time.hhmmss(fall.at)}. Abrir o dia.` },
        h('div', { class: 'ico' }, icon('triangle-alert', { size: 26 })),
        h('div', { class: 'tx' },
          h('div', { class: 'tt' }, k.title),
          h('div', { class: 'meta' }, `${time.hhmmss(fall.at)} · ${k.text}`),
          h('div', { class: 'go' }, 'Ver o que o relógio registrou', icon('chevron-right', { size: 16 })))));
    }

    // aparelho
    wrap.append(h('section', { class: 'pl-card pl-dev' },
      h('div', { class: 'wico' }, icon('watch', { size: 26 })),
      h('div', { class: 'tx' },
        h('div', { class: 'nm' }, dev.name || 'Pulso Band 4'),
        h('div', { class: 'st' }, h('span', { class: `chip ${disconnected ? 'off' : 'on'}` }, h('i'), disconnected ? 'Desconectado' : 'Conectado')),
        h('div', { class: 'sync' }, `Última sincronização: ${time.weekday(sync)} ${time.hhmm(sync)}`))));

    // hoje: anel de passos
    const ringId = `plring${uid}`;
    wrap.append(h('section', { class: 'pl-card pl-today' },
      h('div', { class: 'ring' }, h('div', { html: ringSvg(todaySteps / GOAL, ringId) }), h('div', { class: 'in' }, h('b', null, fmtInt(todaySteps)), h('span', null, 'passos'))),
      h('div', { class: 'pl-side' },
        h('div', { class: 'cap' }, 'Hoje · ', time.dayLabel(time.MIRROR_NOW)),
        stat('Meta', fmtInt(GOAL), 'passos'),
        stat('Distância', kmOf(todaySteps).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 'km'),
        stat('Calorias ativas', fmtInt(kcalOf(todaySteps)), 'kcal'))));

    // sono + frequência cardíaca
    const sl = sleepOf(data);
    const sleepCard = h('section', { class: 'pl-card pl-mini sleep' },
      h('div', { class: 'cap' }, icon('moon', { size: 15 }), 'Sono'),
      h('b', { class: 'val' }, sl.cur ? fmtSleep(sleepHours(sl.cur)) : '—'),
      h('div', { class: 'sub' }, sl.cur ? `Noite anterior${sleepQuality(sl.cur) ? ` · ${sleepQuality(sl.cur)}` : ''}` : 'Sem registro'),
      h('div', { class: 'bars', 'aria-hidden': 'true' }, sl.list.map((s) => h('i', { class: s === sl.cur ? 'cur' : '', style: { height: `${Math.round(Math.min(1, sleepHours(s) / 9) * 100)}%` } }))));
    const hrToday = data.heart?.[TODAY] ? hrSeries(data, TODAY) : null;
    const hrLast = hrToday?.pts[hrToday.pts.length - 1];
    const hrCard = h('button', { class: 'pl-card pl-mini hr', on: { click: () => openDay(ctx, TODAY) }, 'aria-label': 'Abrir o dia de hoje' },
      h('div', { class: 'cap' }, h('span', { class: 'beat' }, icon('heart-pulse', { size: 15 })), 'Frequência cardíaca'),
      h('b', { class: 'val' }, hrLast ? String(hrLast.bpm) : '—', h('small', null, ' bpm')),
      h('div', { class: 'sub' }, hrLast ? `Última leitura · ${hrLast.label.slice(0, 5)}` : 'Sem leitura'),
      hrToday ? h('div', { class: 'spark', html: sparkSvg(hrToday.pts.filter((p) => p.t >= hrLast.t - 2)) }) : null);
    wrap.append(h('div', { class: 'pl-pair' }, sleepCard, hrCard));

    // passos nos últimos 14 dias
    const chartBox = h('div', { class: 'chart', html: stepsChart(days14) });
    chartBox.addEventListener('click', (e) => { const g = e.target.closest?.('[data-date]'); if (g) openDay(ctx, g.dataset.date); });
    wrap.append(h('section', { class: 'pl-card' },
      h('div', { class: 'pl-head' }, icon('footprints', { size: 18 }), h('h3', null, 'Passos · últimos 14 dias'), h('small', null, 'toque numa barra')),
      chartBox));

    // lista de dias
    wrap.append(h('div', { class: 'pl-sec' }, 'Dias'));
    const listEl = h('div', { class: 'pl-days' });
    let showAll = false;
    const drawDays = () => {
      clear(listEl);
      const rows = showAll ? allDates : allDates.slice(0, 14);
      for (const d of rows) {
        const v = stepVals.has(d) ? stepVals.get(d) : null;
        const pc = v == null ? 0 : Math.min(1, v / GOAL);
        listEl.append(h('button', { class: `pl-day ${d === TODAY ? 'today' : ''}`, on: { click: () => openDay(ctx, d) } },
          h('div', { class: 'date' }, h('small', null, time.weekday(d)), h('b', null, String(time.parse(d).getDate()))),
          h('div', { class: 'mid' },
            h('div', { class: 'ln' }, h('b', null, v == null ? '—' : fmtInt(v)), h('span', null, ' passos'), fallDates.has(d) ? h('em', null, icon('triangle-alert', { size: 13 }), 'queda') : null),
            h('div', { class: 'bar' }, h('i', { style: { width: `${pc * 100}%` } }))),
          h('div', { class: 'km' }, v == null ? '' : fmtKm(v), d === TODAY ? h('small', null, 'hoje') : null),
          icon('chevron-right', { size: 18 })));
      }
      if (!showAll && allDates.length > 14) listEl.append(h('button', { class: 'pl-more', on: { click: () => { showAll = true; drawDays(); phone.scan(listEl); } } }, 'Ver dias anteriores'));
    };
    drawDays();
    wrap.append(listEl);

    el.append(
      kit.appBar({ title: 'Pulso', subtitle: dev.name || 'Pulso Band 4', actions: [{ icon: 'refresh-cw', label: 'Sincronizar', onClick: () => phone.toast('Relógio desconectado. Não é possível sincronizar.', { icon: 'watch' }) }] }),
      wrap);

    if (params?.day) openDay(ctx, params.day);
  },

  search({ data }) {
    const out = [];
    const dates = new Set([...(data.steps || []).map((s) => s.date), ...Object.keys(data.heart || {})]);
    for (const d of [...dates].sort().reverse()) {
      const v = (data.steps || []).find((s) => s.date === d)?.value;
      out.push({ title: `Pulso · ${dayTitle(d)}`, text: `${v != null ? fmtInt(v) + ' passos · ' : ''}frequência cardíaca, passos e sono`, params: { day: d }, at: d });
    }
    for (const e of data.events || []) {
      const k = eventKind(e);
      out.push({ title: `Pulso · ${k.title}`, text: `${time.hhmmss(e.at)} ${k.text}`.trim(), params: { day: time.ymd(e.at) }, at: e.at });
    }
    return out;
  },
};
