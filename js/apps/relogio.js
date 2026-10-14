// Relógio — alarmes de Iara (espelho somente leitura), relógio mundial parado em sáb 23:47,
// cronômetro e timer funcionais (decorativos: não afetam o caso).
import { h, clear } from '../core/dom.js';
import { state } from '../core/state.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { sfx } from '../core/sfx.js';

/* ---------- utilidades ---------- */
const pad = (n) => String(n).padStart(2, '0');
const prefs = () => (state.apps.relogio = state.apps.relogio || {});
const TABS = [
  { id: 'alarme', label: 'Alarme' }, { id: 'relogio', label: 'Relógio' },
  { id: 'cronometro', label: 'Cronômetro' }, { id: 'timer', label: 'Timer' },
];
const DAY_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const DAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const strip = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function dayIdx(d) {
  if (typeof d === 'number') return d >= 0 && d <= 6 ? d : -1;
  return DAY_KEYS.indexOf(strip(d).slice(0, 3));
}
const idxSet = (days) => [...new Set((days || []).map(dayIdx).filter((n) => n >= 0))].sort((a, b) => a - b);
function daysText(days) {
  const idx = idxSet(days), k = idx.join('');
  if (!idx.length) return 'Uma vez';
  if (idx.length === 7) return 'Todos os dias';
  if (k === '12345') return 'Seg a sex';
  if (k === '123456') return 'Seg a sáb';
  if (k === '06') return 'Fim de semana';
  return idx.map((i) => DAY_NAMES[i]).join(', ');
}

/** Próxima ocorrência (a partir da hora do espelho) entre os alarmes ativados. */
function nextAlarm(alarms) {
  const now = time.parse(time.MIRROR_NOW);
  let best = null;
  for (const a of alarms) {
    if (a.on === false) continue;
    const [hh, mm] = String(a.time).split(':').map(Number);
    if (!isFinite(hh) || !isFinite(mm)) continue;
    const idx = idxSet(a.days);
    for (let d = 0; d <= 7; d++) {
      const c = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, hh, mm, 0);
      if (c <= now) continue;
      if (idx.length && !idx.includes(c.getDay())) continue;
      if (!best || c < best.at) best = { alarm: a, at: c };
      break;
    }
  }
  return best;
}
function untilText(ms) {
  const t = Math.max(1, Math.round(ms / 60000));
  if (t < 60) return `em ${t} min`;
  if (t < 1440) { const hh = Math.floor(t / 60), mm = t % 60; return `em ${hh} h${mm ? ` ${mm} min` : ''}`; }
  const dd = Math.floor(t / 1440), hh = Math.floor((t % 1440) / 60);
  return `em ${dd} d${hh ? ` ${hh} h` : ''}`;
}

function pinMini(game, spec) {
  const b = h('button', { class: 'rl-pin', title: 'Fixar no Quadro' });
  const draw = () => {
    const on = game.isPinned(spec.key);
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Remover do Quadro' : 'Fixar no Quadro');
    clear(b).appendChild(icon(on ? 'check' : 'pin', { size: 15 }));
  };
  b.addEventListener('click', (e) => { e.stopPropagation(); if (game.isPinned(spec.key)) game.unpin(spec.key); else { game.pin(spec); sfx.play('pin'); } draw(); });
  draw();
  return b;
}

/* ---------- relógio analógico (desenhado à mão, parado na hora do espelho) ---------- */
function clockSvg(hh, mm) {
  const cx = 120, cy = 120;
  let ticks = '', nums = '';
  for (let i = 0; i < 60; i++) {
    const a = ((i * 6 - 90) * Math.PI) / 180, big = i % 5 === 0, r1 = big ? 94 : 100, r2 = 107;
    ticks += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}" stroke="${big ? '#8fa0bd' : '#3a4559'}" stroke-width="${big ? 2.6 : 1.2}" stroke-linecap="round"/>`;
  }
  for (const [n, ang] of [[12, 0], [3, 90], [6, 180], [9, 270]]) {
    const a = ((ang - 90) * Math.PI) / 180;
    nums += `<text x="${(cx + 76 * Math.cos(a)).toFixed(1)}" y="${(cy + 76 * Math.sin(a) + 6).toFixed(1)}" text-anchor="middle" fill="#c9d3e6" font-size="19" font-weight="300">${n}</text>`;
  }
  const ha = ((hh % 12) + mm / 60) * 30, ma = mm * 6;
  return `<svg viewBox="0 0 240 240" width="100%" role="img" aria-label="Relógio analógico marcando ${pad(hh)}:${pad(mm)}" style="display:block">
    <defs><radialGradient id="rlface" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#1e2432"/><stop offset="1" stop-color="#12161f"/></radialGradient></defs>
    <circle cx="120" cy="120" r="116" fill="url(#rlface)" stroke="#2a3243" stroke-width="2"/>
    ${ticks}${nums}
    <g transform="rotate(${ha.toFixed(1)} 120 120)"><line x1="120" y1="132" x2="120" y2="66" stroke="#eef2fa" stroke-width="7.5" stroke-linecap="round"/></g>
    <g transform="rotate(${ma.toFixed(1)} 120 120)"><line x1="120" y1="136" x2="120" y2="40" stroke="#a8c7fa" stroke-width="5" stroke-linecap="round"/></g>
    <circle cx="120" cy="120" r="8" fill="#a8c7fa"/><circle cx="120" cy="120" r="3.2" fill="#12161f"/>
  </svg>`;
}

/* ---------- relógio mundial (offsets fixos para out/2026) ---------- */
const FORTALEZA_OFF = -180;
const DEFAULT_CITIES = [
  { city: 'Lisboa', sub: 'Portugal', off: 60 },
  { city: 'Nova York', sub: 'Estados Unidos', off: -240 },
  { city: 'Tóquio', sub: 'Japão', off: 540 },
];
function baseUtc() {
  const n = time.parse(time.MIRROR_NOW);
  return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes()) - FORTALEZA_OFF * 60000;
}
function tzOffsetMin(tz, utcMs) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - Math.floor(utcMs / 60000) * 60000) / 60000);
}
function parseOffset(c) {
  const v = c.off ?? c.offset ?? c.utc ?? c.gmt;
  if (typeof v === 'number') return Math.abs(v) <= 14 ? Math.round(v * 60) : v;
  if (typeof v === 'string') {
    const m = v.replace('−', '-').match(/([+-])\s*(\d{1,2})(?::?(\d{2}))?/);
    if (m) return (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +(m[3] || 0));
  }
  if (c.tz) { try { return tzOffsetMin(c.tz, baseUtc()); } catch { /* sem Intl */ } }
  return null;
}
function cityClock(c) {
  const off = parseOffset(c);
  if (off === null) return null;
  const loc = new Date(baseUtc() + off * 60000), mine = new Date(baseUtc() + FORTALEZA_OFF * 60000);
  const dayOf = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const diff = Math.round((dayOf(loc) - dayOf(mine)) / 86400000);
  const delta = (off - FORTALEZA_OFF) / 60;
  const dtxt = delta === 0 ? 'mesmo horário' : `${Math.abs(delta).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} h ${delta > 0 ? 'à frente' : 'atrás'}`;
  return { name: c.city || c.name || '—', sub: c.sub || c.country || '', hhmm: `${pad(loc.getUTCHours())}:${pad(loc.getUTCMinutes())}`, day: diff === 0 ? 'Hoje' : diff > 0 ? 'Amanhã' : 'Ontem', dtxt, night: loc.getUTCHours() >= 18 || loc.getUTCHours() < 6 };
}

/* ---------- cronômetro / timer ---------- */
function fmtSw(ms) {
  const t = Math.min(Math.floor(ms / 10), 99 * 6000 + 5999);
  return { main: `${pad(Math.floor(t / 6000))}:${pad(Math.floor(t / 100) % 60)}`, cs: pad(t % 100) };
}
const fmtLap = (ms) => { const f = fmtSw(ms); return `${f.main}.${f.cs}`; };
function fmtTimer(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000)), hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
  return hh ? `${hh}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
}
const RING_R = 104, RING_C = 2 * Math.PI * RING_R;
function ringSvg(cls) {
  return `<svg viewBox="0 0 240 240" width="100%" aria-hidden="true" style="display:block"><circle cx="120" cy="120" r="${RING_R}" fill="none" stroke="#252b38" stroke-width="9"/><circle class="${cls}" cx="120" cy="120" r="${RING_R}" fill="none" stroke="#a8c7fa" stroke-width="9" stroke-linecap="round" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${RING_C.toFixed(2)}" transform="rotate(-90 120 120)"/></svg>`;
}

/* ---------- app ---------- */
export default {
  id: 'relogio',
  title: 'Relógio',
  cloud: false,

  render(ctx) {
    const { el, screen, kit, game, phone, params, data } = ctx;
    const alarms = (data.alarms || []).slice().sort((a, b) => String(a.time).localeCompare(String(b.time)));
    const cities = ((data.worldClocks && data.worldClocks.length) ? data.worldClocks : DEFAULT_CITIES).map(cityClock).filter(Boolean);
    const now = time.parse(time.MIRROR_NOW);
    const ro = (msg) => phone.toast(msg, { icon: 'lock' });

    const S = {
      tab: TABS.some((t) => t.id === prefs().tab) ? prefs().tab : 'alarme',
      sw: { run: false, t0: 0, acc: 0, laps: [] },
      tm: { mode: 'set', digits: '', total: 0, endAt: 0, left: 0 },
    };
    if (params?.tab && TABS.some((t) => t.id === params.tab)) S.tab = params.tab;
    if (params?.alarm) S.tab = 'alarme';

    const body = h('div', { class: 'rl-body' });
    let live = {};

    const fab = h('button', { class: 'rl-fab', 'aria-label': 'Adicionar alarme', on: { click: () => ro('Espelho somente leitura: não é possível criar alarmes.') } }, icon('plus', { size: 28 }));

    /* ----- Alarme ----- */
    const alarmCard = (a) => {
      const on = a.on !== false, idx = idxSet(a.days), hl = params?.alarm === a.id;
      const warn = () => ro('Espelho somente leitura: os alarmes não podem ser alterados.');
      return h('article', { class: `rl-alarm ${on ? 'on' : 'off'} ${hl ? 'hl' : ''}`, dataset: { id: a.id || '' }, tabindex: '0', role: 'button', 'aria-label': `Alarme ${a.time}${a.label ? ', ' + a.label : ''}, ${on ? 'ativado' : 'desativado'}`, on: { click: warn, keydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); warn(); } } } },
        h('div', { class: 'top' },
          h('span', { class: 'lb txt' }, a.label || 'Alarme'),
          pinMini(game, {
            key: `relogio:alarm:${a.id || a.time}`, label: `Alarme ${a.time}${a.label ? ' · ' + a.label : ''}`, app: 'relogio',
            detail: `${daysText(a.days)} · ${on ? 'ativado' : 'desativado'}`,
          })),
        h('div', { class: 'mid' },
          h('b', { class: 'tm' }, a.time),
          h('span', { class: 'rl-tg' }, kit.toggle({ checked: on, disabled: true, label: `Alarme ${a.time}` }))),
        h('div', { class: 'days' },
          idx.length ? h('span', { class: 'dots', 'aria-hidden': 'true' }, DAY_LETTERS.map((l, i) => h('i', { class: idx.includes(i) ? 'on' : '' }, l))) : null,
          h('span', { class: 'dt' }, daysText(a.days))));
    };
    const drawAlarm = () => {
      const nx = nextAlarm(alarms);
      body.append(h('section', { class: 'rl-next' },
        h('div', { class: 'ic' }, icon('alarm-clock', { size: 22 })),
        h('div', { class: 'tx' },
          h('small', null, 'Próximo alarme'),
          nx
            ? h('b', { class: 'txt' }, `${time.weekday(nx.at)} ${time.hhmm(nx.at)}`, h('span', null, ` · ${untilText(nx.at - now)}`))
            : h('b', { class: 'txt' }, 'Nenhum alarme ativado'),
          nx && nx.alarm.label ? h('em', { class: 'txt' }, nx.alarm.label) : null)));
      if (!alarms.length) body.append(kit.empty({ icon: 'alarm-clock', title: 'Nenhum alarme', text: 'Os alarmes do aparelho aparecem aqui.' }));
      else body.append(h('div', { class: 'rl-alarms' }, alarms.map(alarmCard)));
      body.append(h('p', { class: 'rl-foot' }, icon('lock', { size: 14 }), 'Espelho somente leitura: os alarmes não tocam neste aparelho.'));
      const hit = body.querySelector('.rl-alarm.hl');
      if (hit) setTimeout(() => hit.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
    };

    /* ----- Relógio ----- */
    const drawClock = () => {
      body.append(
        h('section', { class: 'rl-clock' },
          h('div', { class: 'face', html: clockSvg(now.getHours(), now.getMinutes()) }),
          h('div', { class: 'dg' }, h('b', null, time.hhmm(now))),
          h('div', { class: 'dd txt' }, `${time.weekdayLong(now)}, ${time.dateLong(now)}`),
          h('div', { class: 'zone' },
            h('span', null, icon('map-pin', { size: 14 }), 'Fortaleza · UTC−3'),
            h('span', { class: 'frozen' }, icon('lock', { size: 14 }), 'Hora do espelho'))),
        h('div', { class: 'rl-ct' }, 'Cidades'),
        h('div', { class: 'rl-cities' }, cities.map((c) => h('div', { class: `rl-city ${c.night ? 'night' : ''}` },
          h('div', { class: 'tx' }, h('b', { class: 'txt' }, c.name), h('small', null, `${c.day}, ${c.dtxt}${c.sub ? ' · ' + c.sub : ''}`)),
          h('div', { class: 'hm' }, icon(c.night ? 'moon' : 'sun', { size: 16 }), h('b', null, c.hhmm))))));
    };

    /* ----- Cronômetro ----- */
    const swNow = () => (S.sw.run ? S.sw.acc + performance.now() - S.sw.t0 : S.sw.acc);
    const swPaint = (ms) => {
      if (!live.swMain) return;
      const f = fmtSw(ms);
      live.swMain.textContent = f.main; live.swCs.textContent = `.${f.cs}`;
      live.swArc.style.strokeDashoffset = String(RING_C * (1 - ((ms / 1000) % 60) / 60));
    };
    const lapsPaint = () => {
      const box = live.swLaps;
      if (!box) return;
      clear(box);
      const laps = S.sw.laps;
      if (laps.length >= 3) {
        const sp = laps.map((l) => l.split), lo = Math.min(...sp), hi = Math.max(...sp);
        laps.forEach((l) => { l.tag = l.split === lo ? 'best' : l.split === hi ? 'worst' : ''; });
      } else laps.forEach((l) => { l.tag = ''; });
      for (const l of laps) box.append(h('div', { class: `lap ${l.tag}` }, h('span', null, `Volta ${l.n}`), h('b', null, `+${fmtLap(l.split)}`), h('em', null, fmtLap(l.total))));
    };
    const drawSw = () => {
      const sw = S.sw;
      const main = h('span', { class: 'mm' }), cs = h('span', { class: 'cs' });
      const left = h('button', { class: 'rl-btn sec' }), right = h('button', { class: 'rl-btn pri' });
      const ring = h('div', { class: 'rl-ring' }, h('div', { html: ringSvg('arc') }), h('div', { class: 'big' }, h('div', { class: 'row' }, main, cs)));
      const laps = h('div', { class: 'rl-laps' });
      const sync = () => {
        clear(left); clear(right);
        left.append(sw.run ? 'Volta' : 'Zerar'); left.disabled = !sw.run && sw.acc === 0;
        right.className = `rl-btn pri ${sw.run ? 'stop' : ''}`;
        right.append(icon(sw.run ? 'pause' : 'play', { size: 22 }), sw.run ? 'Pausar' : (sw.acc ? 'Retomar' : 'Iniciar'));
      };
      left.addEventListener('click', () => {
        sfx.play('tap');
        if (sw.run) { const t = swNow(); sw.laps.unshift({ n: sw.laps.length + 1, split: t - (sw.laps[0]?.total || 0), total: t }); lapsPaint(); } else { sw.acc = 0; sw.laps = []; lapsPaint(); swPaint(0); sync(); }
      });
      right.addEventListener('click', () => {
        sfx.play('tap');
        if (sw.run) { sw.acc += performance.now() - sw.t0; sw.run = false; } else { sw.t0 = performance.now(); sw.run = true; }
        sync(); swPaint(swNow());
      });
      live = { swMain: main, swCs: cs, swArc: ring.querySelector('.arc'), swLaps: laps };
      body.append(ring, h('div', { class: 'rl-ctrl' }, left, right), laps);
      sync(); swPaint(swNow()); lapsPaint();
    };

    /* ----- Timer ----- */
    const tmPaint = () => {
      const tm = S.tm;
      if (!live.tmTime) return;
      const left = tm.mode === 'run' ? Math.max(0, tm.endAt - performance.now()) : tm.left;
      live.tmTime.textContent = fmtTimer(left);
      live.tmArc.style.strokeDashoffset = String(RING_C * (1 - (tm.total ? left / tm.total : 0)));
    };
    const tmFinish = () => {
      const tm = S.tm;
      tm.mode = 'done'; tm.left = 0;
      sfx.play('notify');
      phone.toast('Timer finalizado', { icon: 'timer' });
      if (S.tab === 'timer') draw();
    };
    const drawTimer = () => {
      const tm = S.tm;
      if (tm.mode === 'set') {
        const d = tm.digits.padStart(6, '0');
        const disp = h('div', { class: 'rl-tdisp', role: 'timer' },
          ['h', 'm', 's'].map((u, i) => h('span', { class: d.slice(i * 2, i * 2 + 2) === '00' ? 'z' : '' }, h('b', null, d.slice(i * 2, i * 2 + 2)), u)));
        const press = (k) => {
          sfx.play('tap');
          if (k === 'del') tm.digits = tm.digits.slice(0, -1);
          else if (tm.digits.length + k.length <= 6 && !(tm.digits === '' && /^0+$/.test(k))) tm.digits += k;
          draw();
        };
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'];
        const ok = tm.digits.length > 0 && Number(tm.digits) > 0;
        const start = h('button', { class: 'rl-go', 'aria-label': 'Iniciar timer', disabled: !ok, on: { click: () => {
          const s = Number(d.slice(0, 2)) * 3600 + Number(d.slice(2, 4)) * 60 + Number(d.slice(4, 6));
          if (!s) return;
          sfx.play('tap');
          tm.total = s * 1000; tm.left = tm.total; tm.endAt = performance.now() + tm.total; tm.mode = 'run';
          draw();
        } } }, icon('play', { size: 28 }));
        body.append(
          disp,
          h('div', { class: 'rl-presets' }, [['1 min', '100'], ['5 min', '500'], ['10 min', '1000']].map(([l, v]) => h('button', { class: 'rl-pre', on: { click: () => { sfx.play('tap'); tm.digits = v; draw(); } } }, icon('timer', { size: 15 }), l))),
          h('div', { class: 'rl-keys' }, keys.map((k) => h('button', { 'aria-label': k === 'del' ? 'Apagar' : k, on: { click: () => press(k) } }, k === 'del' ? icon('delete', { size: 22 }) : k))),
          h('div', { class: 'rl-gorow' }, start));
        live = {};
        return;
      }
      const time_ = h('b', { class: 'tmv' });
      const ring = h('div', { class: 'rl-ring t' }, h('div', { html: ringSvg('arc') }), h('div', { class: 'big' }, time_, tm.mode === 'done' ? h('span', { class: 'lbl' }, 'Timer finalizado') : h('span', { class: 'lbl' }, tm.mode === 'pause' ? 'Em pausa' : `de ${fmtTimer(tm.total)}`)));
      if (tm.mode === 'done') ring.classList.add('done');
      live = { tmTime: time_, tmArc: ring.querySelector('.arc') };
      const cancel = h('button', { class: 'rl-btn sec', on: { click: () => { sfx.play('tap'); tm.mode = 'set'; draw(); } } }, tm.mode === 'done' ? 'Parar' : 'Cancelar');
      const plus = h('button', { class: 'rl-btn sec', 'aria-label': 'Adicionar um minuto', on: { click: () => {
        sfx.play('tap');
        if (tm.mode === 'done') { tm.total = 60000; tm.left = 60000; tm.endAt = performance.now() + 60000; tm.mode = 'run'; }
        else { tm.total += 60000; if (tm.mode === 'run') tm.endAt += 60000; else tm.left += 60000; }
        draw();
      } } }, '+1:00');
      const toggle = h('button', { class: `rl-btn pri ${tm.mode === 'run' ? 'stop' : ''}`, on: { click: () => {
        sfx.play('tap');
        if (tm.mode === 'run') { tm.left = Math.max(0, tm.endAt - performance.now()); tm.mode = 'pause'; } else if (tm.mode === 'pause') { tm.endAt = performance.now() + tm.left; tm.mode = 'run'; }
        draw();
      } } }, icon(tm.mode === 'run' ? 'pause' : 'play', { size: 22 }), tm.mode === 'run' ? 'Pausar' : 'Retomar');
      body.append(ring, h('div', { class: 'rl-ctrl' }, cancel, plus, tm.mode === 'done' ? null : toggle));
      tmPaint();
    };

    /* ----- montagem ----- */
    const draw = () => {
      clear(body);
      live = {};
      fab.hidden = S.tab !== 'alarme';
      ({ alarme: drawAlarm, relogio: drawClock, cronometro: drawSw, timer: drawTimer })[S.tab]();
      phone.scan(body);
    };
    const tabs = kit.tabs({ items: TABS, active: S.tab, onChange: (id) => { S.tab = id; prefs().tab = id; draw(); } });
    el.append(kit.appBar({ title: 'Relógio', subtitle: `${time.weekdayLong(now)} · Fortaleza` }), tabs, body);
    screen.appendChild(fab);
    draw();

    // um único ticker para cronômetro e timer; para sozinho quando o app é fechado
    let wasIn = false;
    const iv = setInterval(() => {
      if (el.isConnected) wasIn = true; else if (wasIn) { clearInterval(iv); return; }
      if (S.sw.run && live.swMain) swPaint(swNow());
      if (S.tm.mode === 'run') {
        if (S.tm.endAt - performance.now() <= 0) tmFinish(); else tmPaint();
      }
    }, 50);
  },

  search({ data }) {
    return (data.alarms || []).map((a) => ({
      title: `Alarme ${a.time}${a.label ? ' · ' + a.label : ''}`,
      text: `${daysText(a.days)} · ${a.on === false ? 'desativado' : 'ativado'}`,
      params: { tab: 'alarme', alarm: a.id },
    }));
  },
};
