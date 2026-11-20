// Agenda — a agenda de Iara (dados do aparelho: até sáb 23:47; "hoje" = sáb 10/10). Visual do Google Agenda para Android (modo escuro).
// Raiz: visão "Programação" (contínua, com faixas de mês e semanas) ou "Mês" (grade). O título "outubro ▾" abre o minicalendário.
// Subtela: o evento aberto, no estilo do Google Agenda.
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

/* cores dos eventos do Google Agenda: [fundo, texto] */
const COLORS = {
  azul: ['#3f51b5', '#fff'], // Mirtilo
  ciano: ['#039be5', '#fff'], // Pavão
  laranja: ['#f4511e', '#fff'], // Tangerina
  verde: ['#33b679', '#fff'], // Sálvia
  amarelo: ['#f6bf26', '#202124'], // Banana
  vermelho: ['#d50000', '#fff'], // Tomate
  roxo: ['#8e24aa', '#fff'], // Uva
  rosa: ['#e67c73', '#fff'], // Flamingo
  cinza: ['#616161', '#fff'], // Grafite
  lavanda: ['#7986cb', '#fff'],
  manjericao: ['#0b8043', '#fff'],
};
const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
/* faixas de mês (no app são ilustrações; aqui, gradientes) */
const BANNERS = [
  ['#1e3a5f', '#3b6ea5'], ['#3d2c5c', '#7a5aa6'], ['#21452f', '#3f8a5c'], ['#4a3a1a', '#a3802f'],
  ['#1d4a4a', '#3a9191'], ['#4a2a1e', '#b0603a'], ['#173f5f', '#2f86b9'], ['#4a3412', '#c7892b'],
  ['#2f3f1c', '#6f9440'], ['#4a2316', '#c2562b'], ['#2a2f45', '#5e6b9e'], ['#3a1f2e', '#8e4766'],
];
const P_AGENDA = 'M19 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6H5V5h14v4zm0 4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H5v-4h14v4z';
const P_NOTES = 'M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z';
const P_REPEAT = 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z';
function svg(d, size = 24) {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="ic" aria-hidden="true"><path d="${d}"/></svg>`;
  return t.content.firstChild;
}
function gPlus(size = 30) {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36" aria-hidden="true"><path fill="#EA4335" d="M16 6h4v10h-4z"/><path fill="#4285F4" d="M16 16h14v4H16z"/><path fill="#34A853" d="M16 20h4v10h-4z"/><path fill="#FBBC05" d="M6 16h10v4H6z"/></svg>`;
  return t.content.firstChild;
}

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const pad = (n) => String(n).padStart(2, '0');
const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const colorPair = (ev) => {
  const raw = String(ev.color || '');
  if (/^(#|rgb|hsl)/i.test(raw)) return [raw, '#fff'];
  return COLORS[fold(raw)] || COLORS.azul;
};
const colorOf = (ev) => colorPair(ev)[0];
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
    if (r <= 0) return 'Na hora do evento';
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
    const stub = (what) => phone.toast(`${what} indisponível na extração`, { icon: 'info' });

    /* meses: set–dez/2026 + qualquer mês do ano com evento (inclusive os anuais) */
    let lo = YEAR * 12 + 8, hi = YEAR * 12 + 11;
    for (const o of occs) {
      const d = time.parse(o.date);
      if (d.getFullYear() !== YEAR) continue;
      lo = Math.min(lo, YEAR * 12 + d.getMonth()); hi = Math.max(hi, YEAR * 12 + d.getMonth());
    }
    const nowIdx = YEAR * 12 + time.parse(NOW).getMonth();
    const idxOf = (date) => { const d = time.parse(date); return d.getFullYear() * 12 + d.getMonth(); };
    const clampIdx = (i) => Math.max(lo, Math.min(hi, i));
    const ym = (i) => ({ y: Math.floor(i / 12), m: i % 12 });
    let idx = clampIdx(nowIdx);
    let view = 'sched'; // 'sched' | 'month'
    let sel = '';

    /* ----- barra superior ----- */
    const titleTx = h('span', null, '');
    const caret = icon('chevron-down', { size: 20 });
    const titleBtn = h('button', { class: 'ag-title', 'aria-expanded': 'false', on: { click: () => toggleMini() } }, titleTx, caret);
    const todayBtn = h('button', { class: 'ag-tbtn', 'aria-label': 'Ir para hoje', on: { click: () => goToday() } }, h('span', { class: 'ag-todayic' }, String(time.parse(NOW).getDate())));
    const head = h('header', { class: 'ag-tb' },
      h('button', { class: 'ag-tbtn', 'aria-label': 'Menu', on: { click: () => openDrawer() } }, icon('menu', { size: 22 })),
      titleBtn,
      h('span', { class: 'ag-sp' }),
      h('button', { class: 'ag-tbtn', 'aria-label': 'Pesquisar', on: { click: () => stub('Pesquisa') } }, icon('search', { size: 22 })),
      todayBtn,
      h('span', { class: 'ag-me' }, kit.avatar({ src: 'assets/caso01/avatars/iara.jpg', name: 'Iara', color: '#e25b45', size: 30 })));
    const setTitle = (i) => { const { y, m } = ym(i); titleTx.textContent = y === YEAR ? time.monthName(m) : `${time.monthName(m)} de ${y}`; };

    /* ----- minicalendário (abre pelo título) ----- */
    let miniIdx = idx;
    const miniGrid = h('div', { class: 'ag-mgrid' });
    const miniHead = h('div', { class: 'ag-mhead' });
    const mini = h('div', { class: 'ag-mini', hidden: true }, miniHead, h('div', { class: 'ag-mdow', 'aria-hidden': 'true' }, WD.map(d => h('span', null, d))), miniGrid);
    const top = h('div', { class: 'ag-top' }, head, mini);

    function drawMini() {
      const { y, m } = ym(miniIdx);
      miniHead.replaceChildren(
        h('b', null, `${cap(time.monthName(m))} de ${y}`),
        kit.iconButton({ icon: 'chevron-left', label: 'Mês anterior', className: `ag-mnav ${miniIdx <= lo ? 'off' : ''}`, onClick: () => { if (miniIdx > lo) { miniIdx--; drawMini(); } } }),
        kit.iconButton({ icon: 'chevron-right', label: 'Próximo mês', className: `ag-mnav ${miniIdx >= hi ? 'off' : ''}`, onClick: () => { if (miniIdx < hi) { miniIdx++; drawMini(); } } }));
      miniGrid.replaceChildren();
      const lead = new Date(y, m, 1).getDay();
      const dim = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < lead; i++) miniGrid.appendChild(h('span', { class: 'ag-md out' }));
      for (let n = 1; n <= dim; n++) {
        const date = key(y, m, n);
        const list = byDate.get(date) || [];
        miniGrid.appendChild(h('button', {
          class: `ag-md${date === TODAY ? ' today' : ''}${date === sel ? ' sel' : ''}${list.length ? ' has' : ''}`,
          'aria-label': `${n} de ${time.monthName(m)}${list.length ? `, ${plural(list.length, 'evento', 'eventos')}` : ''}`,
          on: { click: () => { closeMini(); pick(date); } },
        }, h('span', null, String(n)), list.length ? h('i', { style: { background: colorOf(list[0].ev) } }) : null));
      }
    }
    function toggleMini() { if (mini.hidden) { miniIdx = idx; drawMini(); mini.hidden = false; titleBtn.classList.add('open'); titleBtn.setAttribute('aria-expanded', 'true'); } else closeMini(); }
    function closeMini() { mini.hidden = true; titleBtn.classList.remove('open'); titleBtn.setAttribute('aria-expanded', 'false'); }

    /* ----- visão Programação (contínua) ----- */
    const schedEl = h('section', { class: 'ag-sched' });
    const monthEl = h('section', { class: 'ag-month', hidden: true });

    const evChip = (o) => {
      const [bg, fg] = colorPair(o.ev);
      return h('button', { class: `ag-ev ${o.timed ? '' : 'allday'}`, style: { background: bg, color: fg }, on: { click: () => openEvent(o) } },
        h('b', null, o.ev.title),
        o.timed ? h('span', null, clockText(o)) : null,
        o.ev.place ? h('span', { class: 'ag-pl' }, o.ev.place) : null);
    };

    function drawSched() {
      schedEl.replaceChildren();
      for (let i = lo; i <= hi; i++) {
        const { y, m } = ym(i);
        const [c1, c2] = BANNERS[m];
        schedEl.appendChild(h('div', { class: 'ag-mban', dataset: { idx: String(i) }, style: { background: `linear-gradient(120deg, ${c1}, ${c2})` } },
          h('span', null, `${time.monthName(m)}${y !== YEAR ? ` de ${y}` : ''}`)));
        const dim = new Date(y, m + 1, 0).getDate();
        for (let d = 1; d <= dim; d++) {
          const dt = new Date(y, m, d);
          const date = key(y, m, d);
          if (d === 1 || dt.getDay() === 0) {
            const end = Math.min(dim, d + (6 - dt.getDay()));
            const mon = time.monthShort(m);
            schedEl.appendChild(h('div', { class: 'ag-week' }, end === d ? `${d} de ${mon}.` : `${d} – ${end} de ${mon}.`));
          }
          const list = byDate.get(date) || [];
          if (!list.length && date !== TODAY) continue;
          const isToday = date === TODAY;
          const evs = h('div', { class: 'ag-gl' });
          if (!list.length) evs.appendChild(h('button', { class: 'ag-noev', on: { click: () => stub('Novo evento') } }, 'Nada planejado hoje. Toque para criar.'));
          let nowPut = !isToday;
          for (const o of list) {
            if (!nowPut && o.timed && o.startAt > NOW.slice(0, 16)) { evs.appendChild(h('div', { class: 'ag-now', 'aria-label': 'Agora' })); nowPut = true; }
            evs.appendChild(evChip(o));
          }
          if (!nowPut) evs.appendChild(h('div', { class: 'ag-now', 'aria-label': 'Agora' }));
          schedEl.appendChild(h('div', { class: `ag-group${isToday ? ' today' : ''}`, dataset: { date } },
            h('div', { class: 'ag-gd' }, h('small', null, `${time.weekday(date)}.`), h('b', null, String(d))),
            evs));
        }
      }
      schedEl.appendChild(h('div', { class: 'ag-end' }, icon('calendar', { size: 18 }), 'Fim da agenda deste aparelho'));
    }

    /* ----- visão Mês (grade) ----- */
    function drawMonth() {
      const { y, m } = ym(idx);
      const lead = new Date(y, m, 1).getDay();
      const dim = new Date(y, m + 1, 0).getDate();
      const prevDim = new Date(y, m, 0).getDate();
      const total = Math.ceil((lead + dim) / 7) * 7;
      const grid = h('div', { class: 'ag-mg', role: 'grid' });
      for (let i = 0; i < total; i++) {
        const n = i - lead + 1;
        if (n < 1 || n > dim) { grid.appendChild(h('div', { class: 'ag-mc out', 'aria-hidden': 'true' }, h('span', { class: 'ag-mn' }, String(n < 1 ? prevDim + n : n - dim)))); continue; }
        const date = key(y, m, n);
        const list = byDate.get(date) || [];
        grid.appendChild(h('button', {
          class: `ag-mc${date === TODAY ? ' today' : ''}${date === sel ? ' sel' : ''}`,
          'aria-label': `${n} de ${time.monthName(m)}${list.length ? `, ${plural(list.length, 'evento', 'eventos')}` : ''}`,
          on: { click: () => pick(date) },
        }, h('span', { class: 'ag-mn' }, String(n)),
          list.slice(0, 3).map(o => { const [bg, fg] = colorPair(o.ev); return h('span', { class: 'ag-mchip', style: { background: bg, color: fg } }, o.ev.title); }),
          list.length > 3 ? h('span', { class: 'ag-mmore' }, `+${list.length - 3}`) : null));
      }
      let x0 = null;
      grid.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
      grid.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 60) goMonth(idx + (dx < 0 ? 1 : -1)); });
      monthEl.replaceChildren(h('div', { class: 'ag-mdow2', 'aria-hidden': 'true' }, WD.map(d => h('span', null, d))), grid,
        h('div', { class: 'ag-mfoot' },
          kit.iconButton({ icon: 'chevron-left', label: 'Mês anterior', className: `ag-mnav ${idx <= lo ? 'off' : ''}`, onClick: () => goMonth(idx - 1) }),
          h('span', null, 'Deslize para trocar de mês'),
          kit.iconButton({ icon: 'chevron-right', label: 'Próximo mês', className: `ag-mnav ${idx >= hi ? 'off' : ''}`, onClick: () => goMonth(idx + 1) })));
    }
    function goMonth(i) { const n = clampIdx(i); if (n === idx) return; idx = n; setTitle(idx); drawMonth(); el.scrollTop = 0; }

    function setView(v) {
      view = v;
      closeMini();
      schedEl.hidden = v !== 'sched';
      monthEl.hidden = v !== 'month';
      if (v === 'month') { drawMonth(); setTitle(idx); el.scrollTop = 0; }
      else syncTitle();
    }

    /* título acompanha a rolagem da Programação */
    const headH = () => top.offsetHeight || 60;
    function syncTitle() {
      if (view !== 'sched') return;
      let cur = lo;
      const y = el.scrollTop + headH() + 4;
      for (const b of schedEl.querySelectorAll('.ag-mban')) { if (b.offsetTop <= y) cur = +b.dataset.idx; else break; }
      for (const g of schedEl.querySelectorAll('.ag-group')) { if (g.offsetTop <= y) { const i = idxOf(g.dataset.date); if (i > cur) cur = i; } else break; }
      idx = cur; setTitle(idx);
    }
    el.addEventListener('scroll', () => syncTitle(), { passive: true });

    function scrollToDate(date, { flash = false, smooth = false } = {}) {
      const groups = [...schedEl.querySelectorAll('.ag-group')];
      const g = groups.find(x => x.dataset.date === date) || groups.find(x => x.dataset.date > date) || groups[groups.length - 1];
      if (!g) return null;
      const target = Math.max(0, g.offsetTop - headH() - 34);
      if (smooth) el.scrollTo({ top: target, behavior: 'smooth' }); else el.scrollTop = target;
      if (flash && g.dataset.date === date) { g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash'); }
      return g.dataset.date === date ? g : null;
    }

    /** seleciona o dia e leva a Programação até ele */
    function pick(date) {
      sel = date;
      if (view !== 'sched') setView('sched');
      const g = scrollToDate(date, { flash: true, smooth: true });
      if (!g) phone.toast(`Nada marcado em ${dayShort(date)}`, { icon: 'calendar' });
      setTimeout(syncTitle, 450);
    }
    function goToday() { if (view === 'month') { idx = clampIdx(nowIdx); setTitle(idx); drawMonth(); } else { closeMini(); scrollToDate(TODAY, { smooth: true, flash: true }); } }

    /* ----- gaveta lateral ----- */
    function openDrawer() {
      const close = () => { ov.classList.remove('show'); phone._popModal?.(close); setTimeout(() => ov.remove(), 260); };
      const vItem = (id, ic, label) => h('button', { class: `ag-ditem ${view === id ? 'on' : ''}`, on: { click: () => { close(); if (id === 'sched' || id === 'month') setView(id); else stub(`Visualização ${label}`); } } }, ic, h('span', null, label));
      const cal = (color, label) => h('div', { class: 'ag-dcal' }, h('span', { class: 'ag-dck', style: { background: color } }, icon('check', { size: 14, stroke: 3 })), h('span', null, label));
      const drawer = h('aside', { class: 'ag-drawer', 'aria-label': 'Menu da Agenda' },
        h('div', { class: 'ag-brand' }, h('span', { class: 'ag-logo' }, h('i'), h('b', null, '31')), h('span', null, h('b', null, 'Google'), ' Agenda')),
        vItem('sched', svg(P_AGENDA, 22), 'Programação'),
        vItem('day', icon('rectangle-vertical', { size: 22 }), 'Dia'),
        vItem('3d', icon('panel-left', { size: 22 }), '3 dias'),
        vItem('week', icon('layout-grid', { size: 22 }), 'Semana'),
        vItem('month', icon('calendar-days', { size: 22 }), 'Mês'),
        h('div', { class: 'ag-ddiv' }),
        h('div', { class: 'ag-dacc' }, 'iara.fontenele@gmail.com'),
        cal('#039be5', 'Iara Fontenele'),
        cal('#33b679', 'Aniversários'),
        cal('#0b8043', 'Feriados no Brasil'),
        h('div', { class: 'ag-ddiv' }),
        h('button', { class: 'ag-ditem', on: { click: () => { close(); stub('Configurações'); } } }, icon('settings', { size: 22 }), h('span', null, 'Configurações')),
        h('button', { class: 'ag-ditem', on: { click: () => { close(); stub('Ajuda'); } } }, icon('circle-help', { size: 22 }), h('span', null, 'Ajuda e feedback')));
      const ov = h('div', { class: 'ag-drawer-ov', role: 'dialog', 'aria-label': 'Menu da Agenda' }, h('div', { class: 'ag-scrim', on: { click: close } }), drawer);
      phone._mountModal(ov, close);
      requestAnimationFrame(() => ov.classList.add('show'));
    }

    /* ----- subtela: o evento ----- */
    function openEvent(o) {
      const ev = o.ev;
      game.see('agenda:event:' + ev.id);
      if (ev.onSee) game.flags([].concat(ev.onSee));
      const row = (ic, main, sub) => h('div', { class: 'ag-row' },
        h('span', { class: 'ag-ric' }, ic instanceof Node ? ic : icon(ic, { size: 22 })),
        h('div', { class: 'ag-rt' }, main instanceof Node ? main : h('span', { class: 'ag-rmain' }, main), sub ? h('small', null, sub) : null));
      phone.push({
        className: 'ag-screen',
        render: (box) => {
          box.parentElement.style.setProperty('--ag-c', colorOf(ev));
          const more = kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: (e) => kit.menu(e.currentTarget, [
            { icon: 'trash-2', label: 'Excluir', onClick: () => stub('Excluir') },
            { icon: 'copy', label: 'Duplicar', onClick: () => stub('Duplicar') },
            { icon: 'share-2', label: 'Compartilhar', onClick: () => stub('Compartilhar') },
          ]) });
          const bar = kit.appBar({ title: '', onBack: () => phone.back(), actions: [{ icon: 'pencil', label: 'Editar', onClick: () => stub('Editar evento') }, more] });
          const backBtn = bar.querySelector('.k-iconbtn');
          if (backBtn) backBtn.replaceChildren(icon('x', { size: 22 }));
          box.appendChild(bar);
          const sameEnd = !o.endAt || time.ymd(o.endAt) === o.date;
          const dateMain = `${cap(time.weekdayLong(o.date))}, ${time.parse(o.date).getDate()} de ${time.monthName(time.parse(o.date).getMonth())}${o.timed ? ` · ${clockText(o).replace(/ \(.*\)$/, '')}` : ''}`;
          const dateSub = [
            !o.timed && o.endAt ? `Até ${dayShort(o.endAt)}` : '',
            o.timed && !sameEnd ? `Termina ${time.weekdayLong(o.endAt)}, ${time.dateLong(o.endAt)}` : '',
            !o.timed ? 'Dia inteiro' : '',
          ].filter(Boolean).join(' · ');
          box.append(
            h('article', { class: 'ag-view' },
              h('div', { class: 'ag-vh' }, h('span', { class: 'ag-dot' }),
                h('div', null,
                  h('h1', { class: 'txt' }, ev.title),
                  h('div', { class: 'ag-when txt' }, dateMain),
                  dateSub ? h('div', { class: 'ag-when2' }, dateSub) : null,
                  h('div', { class: 'ag-when2' }, time.dateLong(o.date)),
                  o.yearly ? h('div', { class: 'ag-when2 rep' }, svg(P_REPEAT, 16), 'Todos os anos') : null)),
              ev.place ? row('map-pin', h('span', { class: 'ag-rmain txt' }, ev.place)) : null,
              row('bell', reminderText(o)),
              row('calendar', 'Iara Fontenele', 'Agenda do aparelho'),
              ev.notes ? row(svg(P_NOTES, 22), h('div', { class: 'ag-notes txt' }, ev.notes)) : null),
            h('div', { class: 'ag-bottom' }, kit.pinButton({ key: 'agenda:event:' + ev.id, label: ev.title, app: 'agenda', detail: `${dayShort(o.date)}${o.timed ? ' · ' + time.hhmm(o.startAt) : ''}${ev.place ? ' · ' + ev.place : ''}` })));
        },
      });
    }

    /* ----- montagem ----- */
    el.append(top, schedEl, monthEl);
    screen.appendChild(h('button', { class: 'ag-fab', 'aria-label': 'Criar evento', on: { click: () => stub('Novo evento') } }, gPlus(34)));
    drawSched();
    setTitle(idx);

    let startDate = TODAY;
    let openO = null;
    if (params.event) {
      const o = occs.find(x => x.ev.id === params.event && (!params.date || x.date === params.date)) || occs.find(x => x.ev.id === params.event);
      if (o) { startDate = o.date; sel = o.date; openO = o; }
      else phone.toast('Evento não encontrado', { icon: 'info' });
    } else if (params.date) { startDate = params.date; sel = params.date; }
    setTimeout(() => {
      const g = scrollToDate(startDate, { flash: !!(params.date || params.event) });
      if (params.date && !params.event && !g) phone.toast(`Nada marcado em ${dayShort(params.date)}`, { icon: 'calendar' });
      syncTitle();
    }, 40);
    if (openO) openEvent(openO);
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
