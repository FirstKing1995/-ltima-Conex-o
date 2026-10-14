// Agenda — a agenda de Iara (dados do aparelho: até sáb 23:47; "hoje" = sáb 10/10).
// Raiz: mês (setas set–dez/2026) com pontos nos dias, "Programação" do mês e "Todo ano". Subtela: o compromisso.
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

const COLORS = {
  azul: '#6ea8ff', laranja: '#ff9f5a', verde: '#4cc58b', amarelo: '#f2c94c', vermelho: '#ff6b6b',
  roxo: '#b79cff', rosa: '#f08ab0', cinza: '#9aa0a6', ciano: '#4dd0e1',
};
const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const WD3 = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const pad = (n) => String(n).padStart(2, '0');
const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const colorOf = (ev) => (/^(#|rgb|hsl)/i.test(String(ev.color || '')) ? ev.color : COLORS[fold(ev.color)] || COLORS.azul);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const dayDiff = (a, b) => {
  const da = time.parse(a), db = time.parse(b);
  return Math.round((Date.UTC(db.getFullYear(), db.getMonth(), db.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) / 86400000);
};
/** "sáb., 10 de out." */
const dayShort = (d) => `${time.weekday(d)}., ${time.parse(d).getDate()} de ${time.monthShort(time.parse(d).getMonth())}.`;

/** Ocorrências: compromissos únicos na data própria; anuais (repeat:'yearly') uma vez no ano `year`. */
function occurrencesOf(events, year) {
  const out = [];
  for (const ev of events) {
    const s = time.parse(ev.start);
    if (isNaN(s)) continue;
    const timed = ev.allDay !== true && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(String(ev.start));
    const yearly = ev.repeat === 'yearly';
    const date = yearly ? key(year, s.getMonth(), s.getDate()) : time.ymd(s);
    let endAt = '';
    if (ev.end) {
      const e = time.parse(ev.end);
      if (!isNaN(e)) {
        const span = dayDiff(s, e);
        const base = time.parse(date);
        const ed = new Date(base.getFullYear(), base.getMonth(), base.getDate() + span);
        endAt = timed ? `${time.ymd(ed)}T${time.hhmm(e)}` : (span > 0 ? time.ymd(ed) : '');
      }
    }
    out.push({ ev, date, startAt: timed ? `${date}T${time.hhmm(s)}` : date, endAt, timed, yearly });
  }
  return out;
}
const byTime = (a, b) => a.date.localeCompare(b.date) || (a.timed - b.timed) || a.startAt.localeCompare(b.startAt) || String(a.ev.title).localeCompare(String(b.ev.title), 'pt-BR');

/** "19:00 – 02:00" (+ dia do término, se for outro) */
function clockText(o) {
  if (!o.timed) return 'Dia inteiro';
  const a = time.hhmm(o.startAt);
  if (!o.endAt) return a;
  const same = time.ymd(o.endAt) === o.date;
  return `${a} – ${time.hhmm(o.endAt)}${same ? '' : ` (${time.weekday(o.endAt)}.)`}`;
}
function reminderText(o) {
  const r = o.ev.reminder;
  if (typeof r === 'string' && r.trim()) return r;
  if (typeof r === 'number') {
    if (r <= 0) return 'Na hora do compromisso';
    if (r >= 1440) return `${plural(Math.round(r / 1440), 'dia', 'dias')} antes`;
    if (r >= 60) return `${plural(Math.round(r / 60), 'hora', 'horas')} antes`;
    return `${plural(r, 'minuto', 'minutos')} antes`;
  }
  return o.timed ? '30 minutos antes' : 'No dia, às 09:00';
}

/* ---------- app ---------- */
export default {
  id: 'agenda',
  title: 'Agenda',
  cloud: false,

  render(ctx) {
    const { el, screen, kit, game, phone, data, params = {} } = ctx;
    const NOW = ctx.now || time.MIRROR_NOW;
    const TODAY = time.ymd(NOW);
    const YEAR = time.parse(NOW).getFullYear();
    const occs = occurrencesOf((data.events || []).filter(e => game.req(e)), YEAR).sort(byTime);
    const byDate = new Map();
    for (const o of occs) { if (!byDate.has(o.date)) byDate.set(o.date, []); byDate.get(o.date).push(o); }
    const stub = (what) => phone.toast(`${what} indisponível no espelho`, { icon: 'info' });

    /* meses navegáveis: set–dez/2026 (e qualquer mês do ano com compromisso) */
    let lo = YEAR * 12 + 8, hi = YEAR * 12 + 11;
    for (const o of occs) {
      if (o.yearly) continue;
      const d = time.parse(o.date);
      if (d.getFullYear() !== YEAR) continue;
      lo = Math.min(lo, YEAR * 12 + d.getMonth()); hi = Math.max(hi, YEAR * 12 + d.getMonth());
    }
    const nowIdx = YEAR * 12 + time.parse(NOW).getMonth();
    const idxOf = (date) => { const d = time.parse(date); return d.getFullYear() * 12 + d.getMonth(); };
    const clampIdx = (i) => Math.max(lo, Math.min(hi, i));
    let idx = clampIdx(nowIdx);
    let sel = '';

    /* ----- cabeçalho ----- */
    const prev = kit.iconButton({ icon: 'chevron-left', label: 'Mês anterior', className: 'ag-nav', onClick: () => go(idx - 1) });
    const next = kit.iconButton({ icon: 'chevron-right', label: 'Próximo mês', className: 'ag-nav', onClick: () => go(idx + 1) });
    const todayBtn = kit.iconButton({ icon: 'calendar-days', label: 'Ir para hoje', className: 'ag-nav', onClick: () => { go(nowIdx); pick(TODAY); } });
    const bar = kit.appBar({ title: '', actions: [todayBtn, prev, next] });
    const titleEl = bar.querySelector('h1');

    const gridEl = h('div', { class: 'ag-grid', role: 'grid' });
    const schedEl = h('section', { class: 'ag-sched' });
    const yearEl = h('section', { class: 'ag-year' });

    const ymOf = () => ({ y: Math.floor(idx / 12), m: idx % 12 });

    function drawGrid() {
      const { y, m } = ymOf();
      gridEl.replaceChildren();
      const lead = new Date(y, m, 1).getDay();
      const dim = new Date(y, m + 1, 0).getDate();
      const prevDim = new Date(y, m, 0).getDate();
      const total = Math.ceil((lead + dim) / 7) * 7;
      for (let i = 0; i < total; i++) {
        const n = i - lead + 1;
        if (n < 1 || n > dim) { gridEl.appendChild(h('span', { class: 'ag-day out', 'aria-hidden': 'true' }, h('span', { class: 'ag-n' }, String(n < 1 ? prevDim + n : n - dim)))); continue; }
        const date = key(y, m, n);
        const list = byDate.get(date) || [];
        gridEl.appendChild(h('button', {
          class: `ag-day${date === TODAY ? ' today' : ''}${date === sel ? ' sel' : ''}${list.length ? ' has' : ''}`,
          dataset: { date },
          'aria-label': `${n} de ${time.monthName(m)}${date === TODAY ? ', hoje' : ''}${list.length ? `, ${plural(list.length, 'compromisso', 'compromissos')}` : ''}`,
          on: { click: () => pick(date) },
        }, h('span', { class: 'ag-n' }, String(n)), h('span', { class: 'ag-dots' }, list.slice(0, 3).map(o => h('i', { style: `background:${colorOf(o.ev)}` })))));
      }
    }

    const evRow = (o, { withDate } = {}) => h('button', { class: 'ag-ev', style: `--c:${colorOf(o.ev)}`, on: { click: () => openEvent(o) } },
      h('span', { class: 'ag-bar' }),
      h('span', { class: 'ag-et' },
        h('b', null, o.ev.title),
        h('span', { class: 'ag-tm' }, withDate ? `${time.parse(o.date).getDate()} de ${time.monthName(time.parse(o.date).getMonth())} · todo ano` : clockText(o)),
        o.ev.place ? h('span', { class: 'ag-pl' }, icon('map-pin', { size: 13 }), o.ev.place) : null));

    function drawSched() {
      const { y, m } = ymOf();
      const ym = `${y}-${pad(m + 1)}`;
      const list = occs.filter(o => o.date.startsWith(ym));
      schedEl.replaceChildren(h('h2', { class: 'ag-h' }, 'Programação', h('small', null, `${cap(time.monthName(m))} · ${plural(list.length, 'compromisso', 'compromissos')}`)));
      if (!list.length) schedEl.appendChild(h('div', { class: 'ag-none' }, icon('calendar', { size: 22, stroke: 1.5 }), `Nada marcado em ${time.monthName(m)}.`));
      let last = '', box = null;
      for (const o of list) {
        if (o.date !== last) {
          last = o.date;
          const d = time.parse(o.date);
          box = h('div', { class: 'ag-gl' });
          schedEl.appendChild(h('div', { class: `ag-group${o.date === TODAY ? ' today' : ''}`, dataset: { date: o.date } },
            h('div', { class: 'ag-gd' }, h('small', null, WD3[d.getDay()]), h('b', null, String(d.getDate())), o.date === TODAY ? h('em', null, 'hoje') : null),
            box));
        }
        box.appendChild(evRow(o));
      }
      const yearly = occs.filter(o => o.yearly).sort((a, b) => a.date.localeCompare(b.date));
      yearEl.replaceChildren(...(yearly.length ? [h('h2', { class: 'ag-h' }, 'Todo ano', h('small', null, 'Datas que se repetem')), h('div', { class: 'ag-yl' }, yearly.map(o => evRow(o, { withDate: true })))] : []));
    }

    function draw() {
      const { y, m } = ymOf();
      titleEl.textContent = `${cap(time.monthName(m))} ${y}`;
      prev.disabled = idx <= lo; next.disabled = idx >= hi;
      drawGrid(); drawSched();
    }
    function go(i) { const n = clampIdx(i); if (n === idx) return; idx = n; sel = ''; draw(); el.scrollTop = 0; }

    /** seleciona o dia no calendário e leva a Programação até ele */
    function pick(date) {
      if (idxOf(date) !== idx) { idx = clampIdx(idxOf(date)); draw(); }
      sel = date;
      gridEl.querySelectorAll('.ag-day.sel').forEach(b => b.classList.remove('sel'));
      gridEl.querySelector(`[data-date="${date}"]`)?.classList.add('sel');
      const g = schedEl.querySelector(`[data-date="${date}"]`);
      if (g) { g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash'); g.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      else phone.toast(`Nada marcado em ${dayShort(date)}`, { icon: 'calendar' });
    }

    /* ----- subtela: o compromisso ----- */
    function openEvent(o) {
      const ev = o.ev;
      game.see('agenda:event:' + ev.id);
      if (ev.onSee) game.flags([].concat(ev.onSee));
      const row = (ic, main, sub) => h('div', { class: 'ag-row' },
        h('span', { class: 'ag-ric' }, icon(ic, { size: 20 })),
        h('div', { class: 'ag-rt' }, h('b', null, main), sub ? h('small', null, sub) : null));
      phone.push({
        className: 'ag-screen',
        render: (box) => {
          box.parentElement.style.setProperty('--ag-c', colorOf(ev));
          box.appendChild(kit.appBar({ title: '', actions: [{ icon: 'share-2', label: 'Compartilhar', onClick: () => stub('Compartilhar') }] }));
          const sameEnd = !o.endAt || time.ymd(o.endAt) === o.date;
          box.append(
            h('article', { class: 'ag-view' },
              h('div', { class: 'ag-vh' }, h('span', { class: 'ag-dot' }), h('h1', { class: 'txt' }, ev.title)),
              row('calendar', `${cap(time.weekdayLong(o.date))}, ${time.dateLong(o.date)}`, o.yearly ? 'Todos os anos' : (!o.timed && o.endAt ? `até ${dayShort(o.endAt)}` : '')),
              row('clock', o.timed ? clockText(o).replace(/ \(.*\)$/, '') : 'Dia inteiro', o.timed && !sameEnd ? `Termina ${time.weekdayLong(o.endAt)}, ${time.dateLong(o.endAt)}` : ''),
              ev.place ? row('map-pin', ev.place) : null,
              ev.notes ? h('div', { class: 'ag-row' }, h('span', { class: 'ag-ric' }, icon('sticky-note', { size: 20 })), h('div', { class: 'ag-rt' }, h('small', null, 'Notas'), h('div', { class: 'ag-notes txt' }, ev.notes))) : null,
              row('bell', reminderText(o), 'Lembrete'),
              row('calendar-days', 'Iara Fontenele', 'Agenda do aparelho')),
            h('div', { class: 'ag-bottom' }, kit.pinButton({ key: 'agenda:event:' + ev.id, label: ev.title, app: 'agenda', detail: `${dayShort(o.date)}${o.timed ? ' · ' + time.hhmm(o.startAt) : ''}${ev.place ? ' · ' + ev.place : ''}` })));
        },
      });
    }

    /* ----- montagem ----- */
    const dow = h('div', { class: 'ag-dow', 'aria-hidden': 'true' }, WD.map(d => h('span', null, d)));
    el.append(bar, h('div', { class: 'ag-cal' }, dow, gridEl), schedEl, yearEl, h('div', { class: 'ag-end' }));
    screen.appendChild(kit.fab({ icon: 'plus', label: 'Evento', onClick: () => stub('Novo compromisso') }));

    if (params.event) {
      const o = occs.find(x => x.ev.id === params.event && (!params.date || x.date === params.date)) || occs.find(x => x.ev.id === params.event);
      if (o) { idx = clampIdx(idxOf(o.date)); sel = o.date; draw(); openEvent(o); }
      else { draw(); phone.toast('Compromisso não encontrado', { icon: 'info' }); }
    } else if (params.date) {
      idx = clampIdx(idxOf(params.date)); sel = params.date; draw();
      setTimeout(() => pick(params.date), 80);
    } else draw();
  },

  search({ data, game }) {
    const Y = time.parse(time.MIRROR_NOW).getFullYear();
    return occurrencesOf((data.events || []).filter(e => game.req(e)), Y).sort(byTime).map(o => ({
      title: o.ev.title,
      text: [o.ev.title, `${time.dateLong(o.date)}${o.timed ? ' ' + clockText(o) : ''}`, o.ev.place, o.ev.notes].filter(Boolean).join(' · '),
      params: { event: o.ev.id, date: o.date },
      at: o.startAt,
    }));
  },
};
