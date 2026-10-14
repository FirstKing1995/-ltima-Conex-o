// Configurações — ajustes do Nimbus N9 (Android 16) de Iara. Espelho somente leitura:
// Wi-Fi, Bluetooth, histórico de notificações, bateria, atividade de desbloqueio e dispositivos da conta.
import { h, clear } from '../core/dom.js';
import { bus } from '../core/bus.js';
import { state, save } from '../core/state.js';
import { normalize } from '../core/hash.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { sfx } from '../core/sfx.js';
import { APPS } from './index.js';

/* ---------- utilidades ---------- */
const pad = (n) => String(n).padStart(2, '0');
const cap = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
const hasSec = (at) => /T\d\d:\d\d:\d\d/.test(String(at));
const hm = (at) => (hasSec(at) ? time.hhmmss(at) : time.hhmm(at));
const when = (at) => (time.parse(at).getTime() ? `${time.dayLabel(at)} às ${hm(at)}` : String(at || '—'));
const asDate = (at) => time.parse(at).getTime();
const desc = (get) => (a, b) => asDate(get(b)) - asDate(get(a));
function daysAgo(at) {
  const a = time.parse(at), b = time.parse(time.MIRROR_NOW);
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
}
function dayHead(at) {
  const d = daysAgo(at);
  return d === 0 ? `Hoje · ${time.dayLabel(at)}` : d === 1 ? `Ontem · ${time.dayLabel(at)}` : cap(time.dayLabel(at));
}
function byDay(items, get) {
  const map = new Map();
  for (const it of items) { const k = time.ymd(get(it)); if (!map.has(k)) map.set(k, []); map.get(k).push(it); }
  return [...map.entries()];
}
const T = { blue: '#8ab4f8', green: '#81c995', yellow: '#fdd663', red: '#f28b82', teal: '#78d9ec', purple: '#d7aefb', orange: '#fcad70', pink: '#fbb3c6', grey: '#aecbfa' };

const appInfoByName = (name) => {
  const n = normalize(name);
  return APPS.find((a) => normalize(a.id) === n || normalize(a.title) === n) || null;
};

function readonly(ctx) { ctx.phone.toast('Somente leitura: o espelho não permite alterar ajustes.', { icon: 'lock' }); }

/* ---------- componentes ---------- */
function iconBox(name, tint, size = 22) {
  return h('div', { class: 'cf-ic', style: `--t:${tint || T.grey}` }, icon(name, { size }));
}
function row({ ic, tint, title, sub, onClick, trailing, className = '' }) {
  return h(onClick ? 'button' : 'div', { class: `cf-row ${className}`, on: onClick ? { click: () => { sfx.play('tap'); onClick(); } } : null },
    ic ? iconBox(ic, tint) : null,
    h('div', { class: 'tx' }, h('div', { class: 't' }, title), sub ? h('div', { class: 's' }, sub) : null),
    trailing || null);
}
const group = (children, title) => h('section', { class: 'cf-gw' }, title ? h('div', { class: 'cf-gt' }, title) : null, h('div', { class: 'cf-group' }, children));
const note = (text, ic = 'info') => h('p', { class: 'cf-note' }, icon(ic, { size: 16 }), h('span', null, text));
const chipEl = (text, kind = '') => h('span', { class: `cf-chip ${kind}` }, text);

function pinMini(game, spec) {
  const b = h('button', { class: 'cf-pin', title: 'Fixar no Quadro' });
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

/** Linha de registro: hora | marcador | texto | fixar */
function logRow(ctx, { tm, ic, tone = '', title, sub, pin, hot = false }) {
  return h('div', { class: `cf-log ${tone} ${hot ? 'hot' : ''}` },
    h('div', { class: 'tm' }, tm),
    h('div', { class: 'mk' }, icon(ic, { size: 16 })),
    h('div', { class: 'tx' }, h('div', { class: 't' }, title), sub ? h('div', { class: 's txt' }, sub) : null),
    pin ? pinMini(ctx.game, pin) : h('span'));
}

function spinner() {
  return h('div', { class: 'cf-restore' },
    h('div', { class: 'orb', 'aria-hidden': 'true' }, icon('database', { size: 30 })),
    h('h3', null, 'Restaurando dados do sistema…', h('span', null, ' o ECO está trabalhando nisso.')),
    h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Restaurando' }, h('i')));
}

/* ---------- navegação ---------- */
function page(ctx, nav, { title, subtitle, className = '', build }) {
  nav.push({
    title, className: `cf-sub ${className}`,
    render(el, nav2) { el.append(ctx.kit.appBar({ title, subtitle }), h('div', { class: 'cf-body' })); build(el.querySelector('.cf-body'), nav2, el); },
  });
}

/** Página cujo conteúdo só existe depois de uma flag (ex.: cap4). Antes: “Restaurando dados do sistema…”. */
function gatedPage(ctx, nav, { title, subtitle, req, seeKey, className = '', build }) {
  nav.push({
    title, className: `cf-sub ${className}`,
    render(el, nav2) {
      const paint = () => {
        clear(el);
        el.append(ctx.kit.appBar({ title, subtitle }));
        if (!ctx.game.has(req)) { el.append(spinner()); return false; }
        const body = h('div', { class: 'cf-body' });
        el.append(body);
        build(body, nav2);
        ctx.game.see(seeKey);
        return true;
      };
      let open = paint();
      const off = bus.on('flag', () => {
        if (!el.isConnected) { off(); return; }
        const now = ctx.game.has(req);
        if (now !== open) open = paint();
      });
    },
  });
}

/* ---------- seções ---------- */
const SECTIONS = [
  { id: 'rede', title: 'Rede e internet', icon: 'wifi', tint: T.blue },
  { id: 'dispositivos', title: 'Dispositivos conectados', icon: 'bluetooth', tint: T.green },
  { id: 'apps', title: 'Apps', icon: 'layout-grid', tint: T.yellow },
  { id: 'notificacoes', title: 'Notificações', icon: 'bell', tint: T.red },
  { id: 'bateria', title: 'Bateria', icon: 'battery-full', tint: T.green },
  { id: 'som', title: 'Som e vibração', icon: 'volume-2', tint: T.purple },
  { id: 'tela', title: 'Tela', icon: 'sun', tint: T.orange },
  { id: 'seguranca', title: 'Segurança e privacidade', icon: 'shield', tint: T.teal },
  { id: 'contas', title: 'Contas', icon: 'user-round', tint: T.pink },
  { id: 'sobre', title: 'Sobre o telefone', icon: 'smartphone', tint: T.grey },
];

function sectionSub(ctx, id) {
  const d = ctx.data, meta = ctx.store.CASE.meta || {};
  switch (id) {
    case 'rede': return `Wi-Fi desconectado · ${meta.device?.carrier || 'Litoral Móvel'}`;
    case 'dispositivos': return `Bluetooth · ${(d.bluetooth?.devices || []).length} dispositivos pareados`;
    case 'apps': return `${(d.apps || []).length} apps instalados`;
    case 'notificacoes': return 'Histórico de notificações, não perturbe';
    case 'bateria': return `${d.battery?.level ?? meta.device?.battery ?? 41}%`;
    case 'som': return 'Volume, toques e vibração';
    case 'tela': return 'Tema escuro, tamanho do texto';
    case 'seguranca': return 'Bloqueio de tela, atividade de desbloqueio';
    case 'contas': return d.accounts?.[0]?.email || meta.victim?.email || '';
    case 'sobre': return meta.device?.model || 'Nimbus N9';
    default: return '';
  }
}

/* ---------- Rede e Wi-Fi ---------- */
function openRede(ctx, nav) {
  const saved = ctx.data.wifi?.saved || [];
  const carrier = ctx.store.CASE.meta?.device?.carrier || 'Litoral Móvel';
  page(ctx, nav, {
    title: 'Rede e internet',
    build(el, nav2) {
      el.append(
        group([
          row({ ic: 'wifi', tint: T.blue, title: 'Wi-Fi', sub: `Não conectado · ${saved.length} ${saved.length === 1 ? 'rede salva' : 'redes salvas'}`, onClick: () => openWifi(ctx, nav2) }),
          row({ ic: 'signal-medium', tint: T.blue, title: 'Rede móvel', sub: `${carrier} · dados móveis ativos`, onClick: () => readonly(ctx) }),
          row({ ic: 'share-2', tint: T.blue, title: 'Ponto de acesso e tethering', sub: 'Desativado', onClick: () => readonly(ctx) }),
          row({ ic: 'radio', tint: T.blue, title: 'Modo avião', sub: 'Desativado', trailing: ctx.kit.toggle({ checked: false, disabled: true, label: 'Modo avião' }) }),
        ]));
    },
  });
}

function openWifi(ctx, nav) {
  const { game, kit, data } = ctx;
  const saved = (data.wifi?.saved || []).slice().sort(desc((n) => n.lastConnected));
  const log = (data.wifi?.log || []).slice().sort(desc((e) => e.at));
  page(ctx, nav, {
    title: 'Wi-Fi', subtitle: 'Redes salvas e histórico',
    build(el) {
      game.see('config:wifi');
      el.append(
        group([row({ ic: 'wifi', tint: T.blue, title: 'Usar Wi-Fi', sub: 'Ligado · sem conexão no momento', trailing: kit.toggle({ checked: true, disabled: true, label: 'Usar Wi-Fi' }) })]),
        group(saved.map((n) => row({
          ic: 'wifi', tint: /aberta|open/i.test(n.security) ? T.yellow : T.blue, title: n.ssid,
          sub: `${n.security || 'WPA2'} · Conectada pela última vez: ${when(n.lastConnected)}`,
        })), `Redes salvas (${saved.length})`));
      if (!saved.length) el.append(note('Nenhuma rede salva.'));
      el.append(h('div', { class: 'cf-gt big' }, 'Histórico de conexões'));
      if (!log.length) el.append(note('Nenhuma conexão registrada.'));
      for (const [day, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const on = /conect/i.test(e.event) && !/desconect/i.test(e.event);
          return logRow(ctx, {
            tm: hm(e.at), ic: on ? 'wifi' : 'wifi-off', tone: on ? 'ok' : 'off', title: e.ssid, sub: cap(e.event),
            pin: { key: `config:wifi:${e.at}:${e.ssid}`, label: `Wi-Fi ${e.event}: ${e.ssid} · ${hm(e.at)}`, app: 'configuracoes', detail: `${time.dayLabel(e.at)} · histórico de conexões Wi-Fi` },
          });
        }), dayHead(items[0].at)));
        void day;
      }
    },
  });
}

/* ---------- Dispositivos e Bluetooth ---------- */
const btIcon = (d) => {
  const s = `${d.kind || ''} ${d.name || ''}`.toLowerCase();
  if (/watch|rel[óo]gio|pulso|band/.test(s)) return 'watch';
  if (/car|carro|strada|multim[íi]dia|auto/.test(s)) return 'car';
  if (/head|fone|buds|audio/.test(s)) return 'headphones';
  if (/speaker|caixa|jbl|som/.test(s)) return 'speaker';
  return 'bluetooth';
};

function openDispositivos(ctx, nav) {
  const devs = ctx.data.bluetooth?.devices || [];
  page(ctx, nav, {
    title: 'Dispositivos conectados',
    build(el, nav2) {
      el.append(group([
        row({ ic: 'bluetooth', tint: T.green, title: 'Bluetooth', sub: `Ligado · ${devs.length} ${devs.length === 1 ? 'dispositivo pareado' : 'dispositivos pareados'}`, onClick: () => openBluetooth(ctx, nav2) }),
        row({ ic: 'plus', tint: T.green, title: 'Parear novo dispositivo', sub: 'Procurar dispositivos próximos', onClick: () => readonly(ctx) }),
        row({ ic: 'cast', tint: T.green, title: 'Transmitir', sub: 'Tela e mídia', onClick: () => readonly(ctx) }),
      ]));
    },
  });
}

function openBluetooth(ctx, nav) {
  const { game, kit, data } = ctx;
  const devs = (data.bluetooth?.devices || []).slice().sort((a, b) => Number(!!b.connected) - Number(!!a.connected) || asDate(b.lastConnected) - asDate(a.lastConnected));
  const log = (data.bluetooth?.log || []).slice().sort(desc((e) => e.at));
  page(ctx, nav, {
    title: 'Bluetooth', subtitle: 'Dispositivos pareados e histórico',
    build(el) {
      game.see('config:bluetooth');
      el.append(
        group([row({ ic: 'bluetooth', tint: T.green, title: 'Usar Bluetooth', sub: 'Ligado', trailing: kit.toggle({ checked: true, disabled: true, label: 'Usar Bluetooth' }) })]),
        group(devs.map((d) => row({
          ic: btIcon(d), tint: d.connected ? T.green : T.grey, title: d.name,
          sub: d.connected ? 'Conectado' : `Última conexão: ${when(d.lastConnected)}`,
          trailing: d.connected ? chipEl('Conectado', 'ok') : null,
        })), `Dispositivos pareados (${devs.length})`),
        h('div', { class: 'cf-gt big' }, 'Histórico de conexões'));
      if (!log.length) el.append(note('Nenhuma conexão registrada.'));
      for (const [, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const on = /conect/i.test(e.event) && !/desconect/i.test(e.event);
          const watchOff = !on && /pulso|rel[óo]gio|band/i.test(e.device);
          return logRow(ctx, {
            tm: hm(e.at), ic: on ? 'bluetooth' : 'bluetooth', tone: on ? 'ok' : 'off', title: e.device, sub: cap(e.event), hot: watchOff,
            pin: { key: `config:bt:${e.at}:${e.device}`, label: `Bluetooth ${e.event}: ${e.device} · ${hm(e.at)}`, app: 'configuracoes', detail: `${time.dayLabel(e.at)} · histórico de Bluetooth` },
          });
        }), dayHead(items[0].at)));
      }
    },
  });
}

/* ---------- Notificações ---------- */
function openNotificacoes(ctx, nav) {
  page(ctx, nav, {
    title: 'Notificações',
    build(el, nav2) {
      el.append(group([
        row({ ic: 'history', tint: T.red, title: 'Histórico de notificações', sub: 'Ativado · mostra as notificações recentes', onClick: () => openNotifHistory(ctx, nav2) }),
        row({ ic: 'layout-grid', tint: T.red, title: 'Notificações de apps', sub: 'Gerenciar por app', onClick: () => readonly(ctx) }),
        row({ ic: 'moon', tint: T.red, title: 'Não perturbe', sub: 'Desativado', onClick: () => readonly(ctx) }),
        row({ ic: 'lock', tint: T.red, title: 'Notificações na tela de bloqueio', sub: 'Mostrar conteúdo', onClick: () => readonly(ctx) }),
      ]));
    },
  });
}

function notifAppEl(app) {
  const a = appInfoByName(app);
  if (a) return h('div', { class: 'cf-napp', style: { background: a.bg, color: a.fg || '#fff' }, title: a.title }, icon(a.icon, { size: 18 }));
  return h('div', { class: 'cf-napp generic' }, icon('bell', { size: 18 }));
}

function openNotifHistory(ctx, nav) {
  const { data, game } = ctx;
  const req = data.notifications?.historyReq || 'cap4';
  gatedPage(ctx, nav, {
    title: 'Histórico de notificações', subtitle: 'Últimas 24 horas', req, seeKey: 'config:notif-history',
    build(el) {
      const items = (data.notifications?.history || []).map((n, i) => ({ ...n, _i: i })).sort(desc((n) => n.at));
      el.append(note('Toque em 📌 para fixar uma notificação no Quadro. Aqui ficam também as que o remetente apagou depois.', 'history'));
      if (!items.length) el.append(note('Nenhuma notificação no histórico.'));
      const groups = new Map();
      for (const n of items) { const d = time.parse(n.at); const k = `${time.ymd(n.at)} ${pad(d.getHours())}`; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(n); }
      for (const [, list] of groups) {
        const hr = time.parse(list[0].at).getHours();
        el.append(group(list.map((n) => {
          const a = appInfoByName(n.app);
          const gone = n.deleted || n.removed || /apagad/i.test(n.note || '');
          return h('article', { class: `cf-notif ${gone ? 'gone' : ''}` },
            notifAppEl(n.app),
            h('div', { class: 'tx' },
              h('div', { class: 'top' }, h('span', { class: 'ap' }, a ? a.title : cap(n.app)), h('span', { class: 'tm' }, hm(n.at))),
              n.title ? h('div', { class: 't' }, n.title) : null,
              h('div', { class: 'x txt' }, n.text),
              gone ? h('div', { class: 'flag' }, icon('trash-2', { size: 13 }), n.note || 'Mensagem apagada') : null),
            pinMini(game, {
              key: `config:notif:${n._i}`,
              label: `Notificação ${a ? a.title : n.app} · ${hm(n.at)}${n.title ? ' · ' + n.title : ''}`,
              app: 'configuracoes',
              detail: `“${n.text}”${gone ? ' (apagada pelo remetente)' : ''}`,
            }));
        }), `${dayHead(list[0].at).split(' · ')[0]} · ${pad(hr)}h`));
      }
    },
  });
}

/* ---------- Bateria ---------- */
function batteryChart(log, endAt) {
  const pts = log.map((e) => ({ t: asDate(e.at), level: Number(e.level), event: e.event })).filter((p) => p.t && isFinite(p.level)).sort((a, b) => a.t - b.t);
  if (pts.length < 2) return '';
  const end = Math.max(pts[pts.length - 1].t, endAt || 0), start = end - 24 * 3600e3;
  const before = pts.filter((p) => p.t < start).pop();
  let vis = pts.filter((p) => p.t >= start);
  if (before && vis.length) {
    const nx = vis[0], k = (start - before.t) / (nx.t - before.t || 1);
    vis = [{ t: start, level: before.level + (nx.level - before.level) * k, event: '' }, ...vis];
  }
  if (vis.length < 2) vis = pts.slice(-2);
  const W = 360, H = 214, L = 38, R = 14, T = 22, B = 32, pw = W - L - R, ph = H - T - B;
  const X = (t) => L + ((t - start) / (end - start)) * pw;
  const Y = (v) => T + (1 - v / 100) * ph;
  let grid = '';
  for (const v of [0, 25, 50, 75, 100]) grid += `<line x1="${L}" x2="${W - R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.08)" stroke-dasharray="2 4"/><text x="${L - 7}" y="${(Y(v) + 3.5).toFixed(1)}" text-anchor="end" fill="#8d9096" font-size="10">${v}%</text>`;
  let xt = '';
  const first = new Date(start); first.setMinutes(0, 0, 0);
  for (let t = first.getTime(); t <= end; t += 3600e3) {
    if (t < start) continue;
    const d = new Date(t), hh = d.getHours();
    if (hh % 6) continue;
    xt += `<line x1="${X(t).toFixed(1)}" x2="${X(t).toFixed(1)}" y1="${T}" y2="${T + ph + 4}" stroke="rgba(255,255,255,${hh === 0 ? '.22' : '.07'})" ${hh === 0 ? 'stroke-dasharray="3 3"' : ''}/><text x="${X(t).toFixed(1)}" y="${H - 11}" text-anchor="middle" fill="#8d9096" font-size="10">${pad(hh)}h</text>`;
    if (hh === 0) xt += `<text x="${(X(t) + 4).toFixed(1)}" y="${T - 7}" fill="#aab0b8" font-size="9.5" font-weight="600">${time.weekday(d)} ${time.dateShort(d)}</text>`;
  }
  let segs = '';
  for (let i = 0; i < vis.length - 1; i++) {
    const a = vis[i], b = vis[i + 1], up = b.level > a.level + 0.5;
    segs += `<line x1="${X(a.t).toFixed(1)}" y1="${Y(a.level).toFixed(1)}" x2="${X(b.t).toFixed(1)}" y2="${Y(b.level).toFixed(1)}" stroke="${up ? '#7ee0a3' : '#8ab4f8'}" stroke-width="3" stroke-linecap="round"/>`;
  }
  const path = vis.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)},${Y(p.level).toFixed(1)}`).join(' ');
  const area = `${path} L${X(vis[vis.length - 1].t).toFixed(1)},${T + ph} L${X(vis[0].t).toFixed(1)},${T + ph} Z`;
  const last = vis[vis.length - 1], lx = X(last.t), ly = Y(last.level);
  const dots = vis.slice(0, -1).map((p) => `<circle cx="${X(p.t).toFixed(1)}" cy="${Y(p.level).toFixed(1)}" r="2.4" fill="#cfe0ff"/>`).join('');
  const tx = Math.min(W - R - 40, Math.max(L + 40, lx));
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Nível da bateria nas últimas 24 horas" style="display:block">
    <defs><linearGradient id="cfbat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ab4f8" stop-opacity=".30"/><stop offset="1" stop-color="#8ab4f8" stop-opacity="0"/></linearGradient></defs>
    ${grid}${xt}<path d="${area}" fill="url(#cfbat)"/>${segs}${dots}
    <line x1="${lx.toFixed(1)}" x2="${lx.toFixed(1)}" y1="${T}" y2="${T + ph}" stroke="#ff6b6b" stroke-width="1.4" stroke-dasharray="3 3"/>
    <circle class="cf-ping" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="9" fill="rgba(255,107,107,.28)"/>
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="5" fill="#ff6b6b" stroke="#fff" stroke-width="1.6"/>
    <rect x="${(tx - 41).toFixed(1)}" y="${Math.max(2, ly - 34).toFixed(1)}" width="82" height="19" rx="9.5" fill="#ff6b6b"/>
    <text x="${tx.toFixed(1)}" y="${(Math.max(2, ly - 34) + 13).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">${pad(new Date(last.t).getHours())}:${pad(new Date(last.t).getMinutes())} · ${Math.round(last.level)}%</text>
  </svg>`;
}

function openBateria(ctx, nav) {
  const { data, game, store } = ctx;
  const log = (data.battery?.log || []).slice().sort(desc((e) => e.at));
  const level = data.battery?.level ?? store.CASE.meta?.device?.battery ?? 41;
  page(ctx, nav, {
    title: 'Bateria', subtitle: 'Nível e registro das últimas 24 horas',
    build(el) {
      game.see('config:battery');
      const lastAt = log[0]?.at || time.MIRROR_NOW;
      el.append(
        h('section', { class: 'cf-batt' },
          h('div', { class: 'big' }, h('span', { class: 'ico' }, icon(level > 20 ? 'battery' : 'battery-low', { size: 34 })), h('b', null, `${level}`, h('small', null, '%'))),
          h('div', { class: 'cap' }, 'Último nível registrado', h('br'), h('span', null, when(lastAt))),
          h('div', { class: 'meter', 'aria-hidden': 'true' }, h('i', { style: { width: `${level}%` } }))),
        h('section', { class: 'cf-card' },
          h('div', { class: 'cf-ch' }, icon('activity', { size: 17 }), h('h3', null, 'Nível da bateria'), h('small', null, 'últimas 24 h')),
          h('div', { class: 'chart', html: batteryChart(data.battery?.log || [], asDate(lastAt)) }),
          h('div', { class: 'cf-legend' }, h('span', null, h('i', { style: 'background:#8ab4f8' }), 'Descarregando'), h('span', null, h('i', { style: 'background:#7ee0a3' }), 'Carregando'), h('span', null, h('i', { style: 'background:#ff6b6b' }), 'Desligado'))));
      el.append(h('div', { class: 'cf-gt big' }, 'Registro'));
      if (!log.length) el.append(note('Nenhum registro de bateria.'));
      for (const [, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const off = /desligad|shutdown|power ?off/i.test(e.event);
          const chg = /carreg|conectado ao carregador|carga/i.test(e.event) && !/desconect/i.test(e.event);
          return logRow(ctx, {
            tm: hm(e.at), ic: off ? 'power' : chg ? 'battery-full' : 'battery', tone: off ? 'bad' : chg ? 'ok' : '', hot: off,
            title: e.event, sub: `${e.level}%`,
            pin: { key: `config:battery:${e.at}`, label: `Bateria · ${hm(e.at)} · ${e.event}`, app: 'configuracoes', detail: `${time.dayLabel(e.at)} · ${e.level}%` },
          });
        }), dayHead(items[0].at)));
      }
    },
  });
}

/* ---------- Segurança e desbloqueio ---------- */
function openSeguranca(ctx, nav) {
  page(ctx, nav, {
    title: 'Segurança e privacidade',
    build(el, nav2) {
      el.append(group([
        row({ ic: 'history', tint: T.teal, title: 'Atividade de desbloqueio', sub: 'Quando e como o aparelho foi desbloqueado', onClick: () => openUnlockLog(ctx, nav2) }),
        row({ ic: 'lock', tint: T.teal, title: 'Bloqueio de tela', sub: 'PIN · Digital', onClick: () => readonly(ctx) }),
        row({ ic: 'fingerprint', tint: T.teal, title: 'Desbloqueio por digital', sub: '1 digital cadastrada', onClick: () => readonly(ctx) }),
        row({ ic: 'locate-fixed', tint: T.teal, title: 'Localizar meu dispositivo', sub: 'Ativado', onClick: () => readonly(ctx) }),
        row({ ic: 'shield-check', tint: T.teal, title: 'Atualização de segurança', sub: '1º de setembro de 2026', onClick: () => readonly(ctx) }),
      ]));
    },
  });
}

function openUnlockLog(ctx, nav) {
  const { data, game } = ctx;
  const req = data.security?.unlockLogReq || 'cap4';
  gatedPage(ctx, nav, {
    title: 'Atividade de desbloqueio', subtitle: 'Últimos 7 dias', req, seeKey: 'config:unlock-log',
    build(el) {
      const log = (data.security?.unlockLog || []).slice().sort(desc((e) => e.at));
      el.append(note('Desbloqueios bem-sucedidos do aparelho, com o método usado. Toque em 📌 para fixar no Quadro.', 'fingerprint'));
      if (!log.length) el.append(note('Nenhum desbloqueio registrado.'));
      for (const [, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const m = String(e.method || 'Digital');
          const pin = /pin/i.test(m), pat = /padr/i.test(m);
          return logRow(ctx, {
            tm: hm(e.at), ic: pin ? 'key-round' : pat ? 'layout-grid' : 'fingerprint', tone: pin ? 'warn' : 'ok', hot: pin,
            title: pin ? h('span', null, 'PIN ', chipEl('PIN digitado', 'warn')) : m, sub: e.note || (pin ? 'Desbloqueado com o código numérico' : 'Reconhecimento biométrico'),
            pin: { key: `config:unlock:${e.at}`, label: `Desbloqueio por ${m} · ${hm(e.at)}`, app: 'configuracoes', detail: `${time.dayLabel(e.at)}${e.note ? ' · ' + e.note : ''}` },
          });
        }), dayHead(items[0].at)));
      }
    },
  });
}

/* ---------- Contas e dispositivos ---------- */
const accIcon = (s) => { const n = normalize(s); return /papo/.test(n) ? 'message-circle' : /lume/.test(n) ? 'aperture' : /jandaia/.test(n) ? 'landmark' : /correio/.test(n) ? 'mail' : 'user-round'; };

function openContas(ctx, nav) {
  const accs = ctx.data.accounts || [];
  page(ctx, nav, {
    title: 'Contas',
    build(el, nav2) {
      el.append(
        group([row({ ic: 'laptop', tint: T.pink, title: 'Dispositivos com acesso à conta', sub: 'Veja onde a Conta Nimbus está conectada', onClick: () => openDevices(ctx, nav2) })], 'Conta Nimbus'),
        group(accs.map((a) => row({ ic: accIcon(a.service), tint: T.pink, title: a.service, sub: a.email })), `Contas neste aparelho (${accs.length})`),
        group([row({ ic: 'plus', tint: T.pink, title: 'Adicionar conta', onClick: () => readonly(ctx) })]));
    },
  });
}

const isThisDevice = (d) => /nimbus|este aparelho/i.test(`${d.name || ''} ${d.note || ''}`);
function isActiveNow(d) {
  if (isThisDevice(d)) return false;
  if (d.active || d.now || d.current) return true;
  if (/agora/i.test(`${d.lastActive || ''} ${d.note || ''}`)) return true;
  const t = asDate(d.lastActive);
  return !!t && t > asDate(time.MIRROR_NOW);
}

function openDevices(ctx, nav) {
  const { data, game } = ctx;
  const list = (data.devices || []).slice().sort((a, b) => Number(isActiveNow(b)) - Number(isActiveNow(a)) || Number(isThisDevice(b)) - Number(isThisDevice(a)));
  page(ctx, nav, {
    title: 'Dispositivos com acesso à conta', subtitle: 'Conta Nimbus',
    build(el) {
      game.see('config:devices');
      el.append(note('Estes dispositivos entraram na Conta Nimbus. Se algum não for reconhecido, saia dele e troque a senha.', 'shield-alert'));
      if (!list.length) el.append(note('Nenhum dispositivo encontrado.'));
      el.append(group(list.map((d) => {
        const active = isActiveNow(d), me = isThisDevice(d);
        const la = asDate(d.lastActive) ? `Último acesso: ${when(d.lastActive)}` : d.lastActive ? `Último acesso: ${d.lastActive}` : '';
        return h('article', { class: `cf-dev ${active ? 'active' : ''}` },
          iconBox(/notebook|laptop|pc|windows|mac/i.test(d.name) ? 'laptop' : 'smartphone', active ? T.green : T.pink),
          h('div', { class: 'tx' },
            h('div', { class: 't' }, d.name, active ? chipEl('ativo agora', 'live') : me ? chipEl('Este aparelho', 'ok') : null),
            d.place ? h('div', { class: 's' }, icon('map-pin', { size: 13 }), d.place) : null,
            la && !active ? h('div', { class: 's' }, la) : null,
            d.note && !me ? h('div', { class: 'n txt' }, d.note) : null),
          pinMini(game, { key: `config:device:${d.name}`, label: `Dispositivo com acesso à conta: ${d.name}`, app: 'configuracoes', detail: [d.place, active ? 'ativo agora' : la, d.note].filter(Boolean).join(' · ') }));
      }), `${list.length} ${list.length === 1 ? 'dispositivo' : 'dispositivos'}`));
    },
  });
}

/* ---------- Apps, Tela, Som, Sobre ---------- */
function openApps(ctx, nav) {
  const apps = (ctx.data.apps || []).slice().sort(desc((a) => a.lastUsed));
  page(ctx, nav, {
    title: 'Apps', subtitle: `${apps.length} apps instalados`,
    build(el) {
      el.append(group(apps.map((a) => {
        const info = appInfoByName(a.name);
        const used = asDate(a.lastUsed) ? `Último uso: ${daysAgo(a.lastUsed) === 0 ? 'hoje' : daysAgo(a.lastUsed) === 1 ? 'ontem' : time.dateShort(a.lastUsed)} às ${hm(a.lastUsed)}` : a.lastUsed ? `Último uso: ${a.lastUsed}` : '';
        return appRow(a, info, used);
      })));
      if (!apps.length) el.append(note('Nenhum app listado.'));
    },
  });
}
function appRow(a, info, used) {
  return h('div', { class: 'cf-row' },
    info ? h('div', { class: 'cf-napp lg', style: { background: info.bg, color: info.fg || '#fff' } }, icon(info.icon, { size: 22 })) : h('div', { class: 'cf-napp lg generic' }, (a.name || '?').charAt(0)),
    h('div', { class: 'tx' }, h('div', { class: 't' }, a.name), h('div', { class: 's' }, [a.size, used].filter(Boolean).join(' · '))));
}

function slider(pct) { return h('div', { class: 'cf-slider', 'aria-disabled': 'true' }, h('i', { style: { width: `${pct}%` } }), h('b', { style: { left: `${pct}%` } })); }

function openTela(ctx, nav) {
  const { kit, store } = ctx;
  page(ctx, nav, {
    title: 'Tela',
    build(el) {
      const sizes = [['s', 'Pequeno'], ['m', 'Padrão'], ['l', 'Grande']];
      const seg = h('div', { class: 'cf-seg', role: 'radiogroup', 'aria-label': 'Tamanho do texto' });
      const preview = h('p', { class: 'cf-prev txt' }, 'Aa — Fui no mirante fazer uns timelapse.');
      const draw = () => {
        clear(seg);
        for (const [v, l] of sizes) seg.appendChild(h('button', { class: (state.settings.textSize || 'm') === v ? 'on' : '', role: 'radio', 'aria-checked': String((state.settings.textSize || 'm') === v), on: { click: () => { state.settings.textSize = v; save(); bus.emit('settings', {}); draw(); } } }, l));
        preview.style.fontSize = { s: '13.5px', m: '15.5px', l: '18px' }[state.settings.textSize || 'm'];
      };
      draw();
      const wp = store.CASE.meta?.wallpapers || {};
      el.append(
        group([
          row({ ic: 'moon', tint: T.orange, title: 'Tema escuro', sub: 'Sempre ativado neste aparelho', trailing: kit.toggle({ checked: true, disabled: true, label: 'Tema escuro' }) }),
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, icon('sun', { size: 18 }), 'Brilho'), slider(62)),
        ]),
        group([h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, icon('pencil', { size: 18 }), 'Tamanho do texto'), seg, preview)], 'Texto'),
        group([h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, icon('image', { size: 18 }), 'Papel de parede'),
          h('div', { class: 'cf-wps' }, wp.lock ? kit.img(wp.lock, { alt: 'Tela de bloqueio', ratio: '9/16' }) : null, wp.home ? kit.img(wp.home, { alt: 'Tela inicial', ratio: '9/16' }) : null))]));
    },
  });
}

function openSom(ctx, nav) {
  const { kit } = ctx;
  page(ctx, nav, {
    title: 'Som e vibração',
    build(el) {
      const t = kit.toggle({ checked: state.settings.sound !== false, label: 'Sons de interação', onChange: (v) => { state.settings.sound = v; save(); bus.emit('settings', {}); } });
      el.append(
        group([
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, icon('volume-2', { size: 18 }), 'Volume de mídia'), slider(70)),
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, icon('bell', { size: 18 }), 'Volume do toque e notificações'), slider(55)),
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, icon('alarm-clock', { size: 18 }), 'Volume do alarme'), slider(82)),
        ]),
        group([
          row({ ic: 'volume-2', tint: T.purple, title: 'Sons de interação', sub: 'Toques e avisos deste celular', trailing: t }),
          row({ ic: 'smartphone', tint: T.purple, title: 'Vibração', sub: 'Vibrar ao receber notificações', trailing: kit.toggle({ checked: true, disabled: true, label: 'Vibração' }) }),
          row({ ic: 'volume-x', tint: T.purple, title: 'Modo silencioso', sub: 'Desativado', trailing: kit.toggle({ checked: false, disabled: true, label: 'Modo silencioso' }) }),
        ]));
    },
  });
}

function phoneArt() {
  return `<svg viewBox="0 0 120 190" width="96" aria-hidden="true"><defs><linearGradient id="cfph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4150"/><stop offset="1" stop-color="#1b1f27"/></linearGradient></defs>
    <rect x="14" y="4" width="92" height="182" rx="18" fill="url(#cfph)" stroke="#59606e" stroke-width="2"/>
    <rect x="22" y="14" width="76" height="162" rx="11" fill="#0d0f13"/>
    <rect x="22" y="14" width="76" height="162" rx="11" fill="none" stroke="rgba(242,184,128,.4)"/>
    <circle cx="60" cy="24" r="3" fill="#2a2f39"/>
    <text x="60" y="84" text-anchor="middle" fill="#ecebe8" font-size="22" font-weight="300" font-family="sans-serif">23:47</text>
    <text x="60" y="102" text-anchor="middle" fill="#9aa0a6" font-size="8" font-family="sans-serif">sáb, 10 de out.</text>
    <rect x="44" y="164" width="32" height="3" rx="1.5" fill="#ecebe8" opacity=".7"/></svg>`;
}

function openSobre(ctx, nav) {
  const { kit, store, data } = ctx;
  const meta = store.CASE.meta || {};
  const about = (data.about && data.about.length) ? data.about : [
    ['Nome do dispositivo', `${meta.device?.model || 'Nimbus N9'} da Iara`], ['Modelo', meta.device?.model || 'Nimbus N9'], ['Versão do Android', meta.device?.android || '16'],
    ['Número de telefone', '(85) 98741-2290'], ['Operadora', meta.device?.carrier || 'Litoral Móvel'],
  ];
  page(ctx, nav, {
    title: 'Sobre o telefone',
    build(el) {
      el.append(
        h('div', { class: 'cf-about' }, h('div', { html: phoneArt() }), h('h2', null, meta.device?.model || 'Nimbus N9'), h('p', null, `Android ${meta.device?.android || '16'}`)),
        h('div', { class: 'cf-kv' }, kit.kv(about)),
        note('Este é um espelho do aparelho restaurado da nuvem. Os ajustes são somente leitura.', 'lock'));
    },
  });
}

/* ---------- roteamento e busca ---------- */
const ROUTES = {
  rede: openRede, wifi: openWifi, dispositivos: openDispositivos, bluetooth: openBluetooth, apps: openApps,
  notificacoes: openNotificacoes, 'notif-history': openNotifHistory, bateria: openBateria, battery: openBateria,
  som: openSom, tela: openTela, seguranca: openSeguranca, 'unlock-log': openUnlockLog, contas: openContas, devices: openDevices, sobre: openSobre, about: openSobre,
};

/** Índice de busca: seções, redes, dispositivos e (se liberado) textos dos históricos. */
function buildIndex(data, game) {
  const out = [];
  const add = (title, text, section, ic, tint) => out.push({ title, text, params: { section }, ic, tint });
  for (const s of SECTIONS) add(s.title, '', s.id, s.icon, s.tint);
  add('Wi-Fi', 'redes salvas histórico de conexões', 'wifi', 'wifi', T.blue);
  add('Bluetooth', 'dispositivos pareados histórico', 'bluetooth', 'bluetooth', T.green);
  add('Histórico de notificações', 'notificações recentes apagadas', 'notif-history', 'history', T.red);
  add('Atividade de desbloqueio', 'digital PIN padrão desbloqueios', 'unlock-log', 'history', T.teal);
  add('Dispositivos com acesso à conta', 'conta Nimbus notebook sessões', 'devices', 'laptop', T.pink);
  add('Bateria', 'nível registro desligado carregador', 'battery', 'battery-full', T.green);
  for (const n of data.wifi?.saved || []) add(`Wi-Fi: ${n.ssid}`, `${n.security || ''} conectada pela última vez ${n.lastConnected ? when(n.lastConnected) : ''}`, 'wifi', 'wifi', T.blue);
  for (const d of data.bluetooth?.devices || []) add(`Bluetooth: ${d.name}`, d.connected ? 'conectado' : `última conexão ${d.lastConnected ? when(d.lastConnected) : ''}`, 'bluetooth', btIcon(d), T.green);
  for (const d of data.devices || []) add(`Dispositivo: ${d.name}`, `${d.place || ''} ${d.note || ''}`, 'devices', 'laptop', T.pink);
  for (const a of data.accounts || []) add(`Conta: ${a.service}`, a.email, 'contas', 'user-round', T.pink);
  for (const a of data.apps || []) add(`App: ${a.name}`, a.size || '', 'apps', 'layout-grid', T.yellow);
  if (game.has(data.notifications?.historyReq || 'cap4')) for (const n of data.notifications?.history || []) add(`Notificação: ${n.title || n.app}`, `${n.text} ${hm(n.at)}`, 'notif-history', 'bell', T.red);
  if (game.has(data.security?.unlockLogReq || 'cap4')) for (const e of data.security?.unlockLog || []) add(`Desbloqueio por ${e.method}`, `${when(e.at)} ${e.note || ''}`, 'unlock-log', 'fingerprint', T.teal);
  for (const e of data.battery?.log || []) add(`Bateria: ${e.event}`, `${when(e.at)} ${e.level}%`, 'battery', 'battery', T.green);
  return out;
}

export default {
  id: 'configuracoes',
  title: 'Configurações',
  cloud: false,

  render(ctx) {
    const { el, kit, store, game, nav, params, data } = ctx;
    const email = data.accounts?.[0]?.email || store.CASE.meta?.victim?.email || '';
    const main = h('div', { class: 'cf-main' });
    const results = h('div', { class: 'cf-main', hidden: true });

    main.append(
      h('button', { class: 'cf-account', on: { click: () => openContas(ctx, nav) } },
        kit.avatar({ ...store.avatarOf('iara'), size: 56 }),
        h('div', { class: 'tx' }, h('div', { class: 'n' }, 'Iara Fontenele'), h('div', { class: 's' }, 'Conta Nimbus'), h('div', { class: 'e' }, email)),
        icon('chevron-right', { size: 20 })),
      group(SECTIONS.map((s) => row({ ic: s.icon, tint: s.tint, title: s.title, sub: sectionSub(ctx, s.id), onClick: () => ROUTES[s.id](ctx, nav) }))));

    const search = kit.search({
      placeholder: 'Pesquisar configurações',
      onInput: (q) => {
        const nq = normalize(q);
        clear(results);
        if (nq.length < 2) { results.hidden = true; main.hidden = false; return; }
        main.hidden = true; results.hidden = false;
        const hits = buildIndex(data, game).filter((it) => normalize(`${it.title} ${it.text}`).includes(nq)).slice(0, 40);
        if (!hits.length) results.append(kit.empty({ icon: 'search', title: 'Nada encontrado', text: `Nenhum ajuste para “${q}”.` }));
        else results.append(group(hits.map((it) => row({ ic: it.ic, tint: it.tint, title: it.title, sub: it.text.trim() || undefined, onClick: () => ROUTES[it.params.section]?.(ctx, nav) }))));
        ctx.phone.scan(results);
      },
    });

    el.append(kit.appBar({ title: 'Configurações', subtitle: 'Nimbus N9 · Android 16' }), search, main, results);
    if (params?.section && ROUTES[params.section]) ROUTES[params.section](ctx, nav);
  },

  search({ data, game }) {
    return buildIndex(data, game).map((it) => ({ title: `Configurações · ${it.title}`, text: it.text, params: it.params }));
  },
};
