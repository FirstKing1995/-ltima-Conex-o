// Configurações — ajustes do moto g85 (Android 15, interface quase pura do Google) de Iara. Extração somente leitura:
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
// cores dos círculos da página inicial (tons pastel do Android 15)
const T = { blue: '#a8c7fa', green: '#9cd67d', yellow: '#fdd663', red: '#f2b8b5', teal: '#7fd8e6', purple: '#d7aefb', orange: '#ffb683', pink: '#ffb0cd', grey: '#c4c7c5', indigo: '#b9c3ff', lime: '#c5e384' };

const appInfoByName = (name) => {
  const n = normalize(name);
  return APPS.find((a) => normalize(a.id) === n || normalize(a.title) === n) || null;
};

function readonly(ctx) { ctx.phone.toast('Somente leitura: a extração não permite alterar ajustes.', { icon: 'lock' }); }
const androidVersion = (ctx) => {
  const about = (ctx.data.about || []).find((r) => /vers[aã]o do android/i.test(r[0]));
  return about?.[1] || ctx.store.CASE.meta?.device?.android || '15';
};

/* ---------- componentes ---------- */
function iconBox(name, tint, { solid = false, size = 22 } = {}) {
  return h('div', { class: `cf-ic ${solid ? 'solid' : ''}`, style: `--t:${tint || T.grey}` }, icon(name, { size }));
}
function row({ ic, tint, title, sub, onClick, trailing, className = '', solid = false }) {
  return h(onClick ? 'button' : 'div', { class: `cf-row ${className}`, on: onClick ? { click: () => { sfx.play('tap'); onClick(); } } : null },
    ic ? iconBox(ic, tint, { solid }) : null,
    h('div', { class: 'tx' }, h('div', { class: 't' }, title), sub ? h('div', { class: 's' }, sub) : null),
    trailing || null);
}
/** Lista simples do Android 15 (sem cartão), com título de categoria na cor de destaque. */
const plain = (children, title) => h('section', { class: 'cf-plain' }, title ? h('div', { class: 'cf-gt' }, title) : null, children);
/** Cartão agrupado (usado em registros e históricos). */
const group = (children, title) => h('section', { class: 'cf-gw' }, title ? h('div', { class: 'cf-gt' }, title) : null, h('div', { class: 'cf-group' }, children));
const note = (text, ic = 'info') => h('p', { class: 'cf-note' }, icon(ic, { size: 18 }), h('span', null, text));
const chipEl = (text, kind = '') => h('span', { class: `cf-chip ${kind}` }, text);
const divider = () => h('div', { class: 'cf-div' });

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
    h('h3', null, 'Restaurando dados do sistema…', h('span', null, ' a extração ainda está processando.')),
    h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Restaurando' }, h('i')));
}

/* ---------- navegação (barra do Android 15: título grande que encolhe ao rolar) ---------- */
function header(ctx, el, title, subtitle) {
  const small = h('span', { class: 'cf-smallt' }, title);
  const bar = h('header', { class: 'cf-bar' },
    ctx.kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => ctx.phone.back() }),
    small);
  const big = h('div', { class: 'cf-bigt' }, h('h1', null, title), subtitle ? h('p', null, subtitle) : null);
  const onScroll = () => bar.classList.toggle('scrolled', el.scrollTop > 56);
  el.addEventListener('scroll', onScroll, { passive: true });
  return [bar, big];
}

function page(ctx, nav, { title, subtitle, className = '', build }) {
  nav.push({
    title, className: `app-configuracoes cf-sub ${className}`,
    render(el, nav2) {
      const body = h('div', { class: 'cf-body' });
      el.append(...header(ctx, el, title, subtitle), body);
      build(body, nav2, el);
    },
  });
}

/** Página cujo conteúdo só existe depois de uma flag (ex.: cap4). Antes: “Restaurando dados do sistema…”. */
function gatedPage(ctx, nav, { title, subtitle, req, seeKey, className = '', build }) {
  nav.push({
    title, className: `app-configuracoes cf-sub ${className}`,
    render(el, nav2) {
      const paint = () => {
        clear(el);
        el.append(...header(ctx, el, title, subtitle));
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

/* ---------- página inicial ---------- */
const SECTIONS = [
  { id: 'rede', title: 'Rede e internet', icon: 'wifi', tint: T.blue },
  { id: 'dispositivos', title: 'Dispositivos conectados', icon: 'bluetooth', tint: T.green },
  { id: 'apps', title: 'Apps', icon: 'layout-grid', tint: T.yellow },
  { id: 'notificacoes', title: 'Notificações', icon: 'bell', tint: T.orange },
  { id: 'bateria', title: 'Bateria', icon: 'battery-full', tint: T.lime },
  { id: 'armazenamento', title: 'Armazenamento', icon: 'hard-drive', tint: T.purple },
  { id: 'som', title: 'Som e vibração', icon: 'volume-2', tint: T.teal },
  { id: 'tela', title: 'Tela', icon: 'sun', tint: T.orange },
  { id: 'acessibilidade', title: 'Acessibilidade', icon: 'user-round', tint: T.indigo },
  { id: 'seguranca', title: 'Segurança e privacidade', icon: 'shield-check', tint: T.green },
  { id: 'localizacao', title: 'Localização', icon: 'map-pin', tint: T.teal },
  { id: 'contas', title: 'Senhas, chaves de acesso e contas', icon: 'key-round', tint: T.pink },
  { id: 'google', title: 'Google', icon: 'google', tint: T.blue },
  { id: 'sistema', title: 'Sistema', icon: 'info', tint: T.grey },
  { id: 'sobre', title: 'Sobre o dispositivo', icon: 'smartphone', tint: T.blue },
];

/** "G" do Google em SVG (o Lucide não tem a marca). */
function googleG(size = 22) {
  return h('span', { class: 'cf-g', html: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="currentColor" opacity=".8" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a6 6 0 0 1-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="currentColor" opacity=".6" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="currentColor" opacity=".9" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5L6.4 10A6 6 0 0 1 12 6z"/></svg>` });
}

function sectionSub(ctx, id) {
  const d = ctx.data, meta = ctx.store.CASE.meta || {};
  switch (id) {
    case 'rede': return `Wi-Fi desconectado · ${meta.device?.carrier || 'Claro'}`;
    case 'dispositivos': return `Bluetooth · ${(d.bluetooth?.devices || []).length} dispositivos pareados`;
    case 'apps': return `${(d.apps || []).length} apps instalados · apps padrão`;
    case 'notificacoes': return 'Histórico de notificações, não perturbe';
    case 'bateria': return `${d.battery?.level ?? meta.device?.battery ?? 41}% · desligado às ${hm((d.battery?.log || []).slice().sort(desc((e) => e.at))[0]?.at || time.MIRROR_NOW)}`;
    case 'armazenamento': { const s = storageInfo(ctx); return `${s.used} GB usados de ${s.total} GB`; }
    case 'som': return 'Volume, vibração, Não perturbe';
    case 'tela': return 'Tema escuro, tamanho da fonte, brilho';
    case 'acessibilidade': return 'Leitor de tela, exibição, controles de interação';
    case 'seguranca': return 'Bloqueio de tela, atividade de desbloqueio';
    case 'localizacao': return 'Ativada · apps com acesso';
    case 'contas': return `${(d.accounts || []).length} contas · gerenciador de senhas`;
    case 'google': return 'Serviços e preferências · dispositivos da conta';
    case 'sistema': return 'Idiomas, data e hora, backup';
    case 'sobre': return d.about?.find((r) => /nome do dispositivo/i.test(r[0]))?.[1] || meta.device?.model || 'moto g85';
    default: return '';
  }
}

/* ---------- Rede e Wi-Fi ---------- */
function openRede(ctx, nav) {
  const saved = ctx.data.wifi?.saved || [];
  const carrier = ctx.store.CASE.meta?.device?.carrier || 'Claro';
  page(ctx, nav, {
    title: 'Rede e internet',
    build(el, nav2) {
      el.append(plain([
        row({ ic: 'wifi', title: 'Internet', sub: `${carrier} · Wi-Fi desconectado · ${saved.length} ${saved.length === 1 ? 'rede salva' : 'redes salvas'}`, onClick: () => openWifi(ctx, nav2) }),
        row({ ic: 'signal-medium', title: 'Chips', sub: carrier, onClick: () => readonly(ctx) }),
        row({ ic: 'radio', title: 'Modo avião', trailing: ctx.kit.toggle({ checked: false, disabled: true, label: 'Modo avião' }) }),
        row({ ic: 'share-2', title: 'Ponto de acesso e tethering', sub: 'Desativado', onClick: () => readonly(ctx) }),
        row({ ic: 'shield', title: 'Economia de dados', sub: 'Desativada', onClick: () => readonly(ctx) }),
        row({ ic: 'lock-keyhole', title: 'VPN', sub: 'Nenhuma', onClick: () => readonly(ctx) }),
        row({ ic: 'globe', title: 'DNS particular', sub: 'Automático', onClick: () => readonly(ctx) }),
      ]));
    },
  });
}

function openWifi(ctx, nav) {
  const { game, kit, data } = ctx;
  const saved = (data.wifi?.saved || []).slice().sort(desc((n) => n.lastConnected));
  const log = (data.wifi?.log || []).slice().sort(desc((e) => e.at));
  page(ctx, nav, {
    title: 'Internet', subtitle: 'Wi-Fi, redes salvas e histórico',
    build(el) {
      game.see('config:wifi');
      el.append(
        h('div', { class: 'cf-master on' }, h('span', null, 'Wi-Fi'), kit.toggle({ checked: true, disabled: true, label: 'Wi-Fi' })),
        plain(saved.map((n) => row({
          ic: /aberta|open/i.test(n.security) ? 'wifi' : 'lock', title: n.ssid,
          sub: `${n.security || 'WPA2'} · Salva · última conexão: ${when(n.lastConnected)}`,
        })), `Redes salvas (${saved.length})`));
      if (!saved.length) el.append(note('Nenhuma rede salva.'));
      el.append(h('div', { class: 'cf-gt big' }, 'Histórico de conexões'));
      if (!log.length) el.append(note('Nenhuma conexão registrada.'));
      for (const [, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const on = /conect/i.test(e.event) && !/desconect/i.test(e.event);
          return logRow(ctx, {
            tm: hm(e.at), ic: on ? 'wifi' : 'wifi-off', tone: on ? 'ok' : 'off', title: e.ssid, sub: cap(e.event),
            pin: { key: `config:wifi:${e.at}:${e.ssid}`, label: `Wi-Fi ${e.event}: ${e.ssid} · ${hm(e.at)}`, app: 'configuracoes', detail: `${time.dayLabel(e.at)} · histórico de conexões Wi-Fi` },
          });
        }), dayHead(items[0].at)));
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
      el.append(
        plain([row({ ic: 'plus', title: 'Parear novo dispositivo', onClick: () => readonly(ctx) })]),
        plain(devs.slice(0, 3).map((d) => row({ ic: btIcon(d), title: d.name, sub: d.connected ? 'Conectado' : `Última conexão: ${when(d.lastConnected)}`, onClick: () => openBluetooth(ctx, nav2) })), 'Dispositivos salvos'),
        plain([
          row({ ic: 'bluetooth', title: 'Bluetooth', sub: `Ativado · ${devs.length} ${devs.length === 1 ? 'dispositivo pareado' : 'dispositivos pareados'} · histórico`, onClick: () => openBluetooth(ctx, nav2) }),
          row({ ic: 'cast', title: 'Transmitir', sub: 'Desconectado', onClick: () => readonly(ctx) }),
          row({ ic: 'file', title: 'Impressão', sub: '1 serviço ativado', onClick: () => readonly(ctx) }),
          row({ ic: 'smartphone', title: 'Quick Share', sub: 'Somente contatos', onClick: () => readonly(ctx) }),
        ], 'Preferências de conexão'));
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
        h('div', { class: 'cf-master on' }, h('span', null, 'Usar Bluetooth'), kit.toggle({ checked: true, disabled: true, label: 'Usar Bluetooth' })),
        plain(devs.map((d) => row({
          ic: btIcon(d), title: d.name,
          sub: d.connected ? 'Conectado' : `Última conexão: ${when(d.lastConnected)}`,
          trailing: d.connected ? chipEl('Conectado', 'ok') : h('span', { class: 'cf-gear' }, icon('settings', { size: 20 })),
        })), `Dispositivos pareados (${devs.length})`),
        h('div', { class: 'cf-gt big' }, 'Histórico de conexões'));
      if (!log.length) el.append(note('Nenhuma conexão registrada.'));
      for (const [, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const on = /conect/i.test(e.event) && !/desconect/i.test(e.event);
          const watchOff = !on && /pulso|rel[óo]gio|band/i.test(e.device);
          return logRow(ctx, {
            tm: hm(e.at), ic: 'bluetooth', tone: on ? 'ok' : 'off', title: e.device, sub: cap(e.event), hot: watchOff,
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
      el.append(
        plain([
          row({ ic: 'layout-grid', title: 'Notificações de apps', sub: 'Gerenciar por app', onClick: () => readonly(ctx) }),
          row({ ic: 'history', title: 'Histórico de notificações', sub: 'Ativado · mostra as notificações recentes e as dispensadas', onClick: () => openNotifHistory(ctx, nav2) }),
        ]),
        plain([
          row({ ic: 'message-square', title: 'Conversas', sub: 'Nenhuma conversa prioritária', onClick: () => readonly(ctx) }),
          row({ ic: 'bell', title: 'Balões', sub: 'Ativado', onClick: () => readonly(ctx) }),
        ], 'Conversa'),
        plain([
          row({ ic: 'lock', title: 'Notificações na tela de bloqueio', sub: 'Mostrar conversas, padrão e silenciosas', onClick: () => readonly(ctx) }),
          row({ ic: 'moon', title: 'Não perturbe', sub: 'Desativado', onClick: () => readonly(ctx) }),
          row({ ic: 'bell-off', title: 'Resfriamento de notificações', sub: 'Desativado', onClick: () => readonly(ctx) }),
        ], 'Privacidade'));
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
      el.append(
        h('div', { class: 'cf-master on' }, h('span', null, 'Usar o histórico de notificações'), ctx.kit.toggle({ checked: true, disabled: true, label: 'Usar o histórico de notificações' })),
        note('Aqui ficam também as notificações de mensagens que o remetente apagou depois. Toque no alfinete para fixar uma notificação no Quadro.', 'history'));
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
  const W = 360, H = 214, L = 38, R = 14, Tp = 22, B = 32, pw = W - L - R, ph = H - Tp - B;
  const X = (t) => L + ((t - start) / (end - start)) * pw;
  const Y = (v) => Tp + (1 - v / 100) * ph;
  let grid = '';
  for (const v of [0, 25, 50, 75, 100]) grid += `<line x1="${L}" x2="${W - R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.08)" stroke-dasharray="2 4"/><text x="${L - 7}" y="${(Y(v) + 3.5).toFixed(1)}" text-anchor="end" fill="#8e918f" font-size="10">${v}%</text>`;
  let xt = '';
  const first = new Date(start); first.setMinutes(0, 0, 0);
  for (let t = first.getTime(); t <= end; t += 3600e3) {
    if (t < start) continue;
    const d = new Date(t), hh = d.getHours();
    if (hh % 6) continue;
    xt += `<line x1="${X(t).toFixed(1)}" x2="${X(t).toFixed(1)}" y1="${Tp}" y2="${Tp + ph + 4}" stroke="rgba(255,255,255,${hh === 0 ? '.22' : '.07'})" ${hh === 0 ? 'stroke-dasharray="3 3"' : ''}/><text x="${X(t).toFixed(1)}" y="${H - 11}" text-anchor="middle" fill="#8e918f" font-size="10">${pad(hh)}h</text>`;
    if (hh === 0) xt += `<text x="${(X(t) + 4).toFixed(1)}" y="${Tp - 7}" fill="#c4c7c5" font-size="9.5" font-weight="600">${time.weekday(d)} ${time.dateShort(d)}</text>`;
  }
  let segs = '';
  for (let i = 0; i < vis.length - 1; i++) {
    const a = vis[i], b = vis[i + 1], up = b.level > a.level + 0.5;
    segs += `<line x1="${X(a.t).toFixed(1)}" y1="${Y(a.level).toFixed(1)}" x2="${X(b.t).toFixed(1)}" y2="${Y(b.level).toFixed(1)}" stroke="${up ? '#9cd67d' : '#a8c7fa'}" stroke-width="3" stroke-linecap="round"/>`;
  }
  const path = vis.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)},${Y(p.level).toFixed(1)}`).join(' ');
  const area = `${path} L${X(vis[vis.length - 1].t).toFixed(1)},${Tp + ph} L${X(vis[0].t).toFixed(1)},${Tp + ph} Z`;
  const last = vis[vis.length - 1], lx = X(last.t), ly = Y(last.level);
  const dots = vis.slice(0, -1).map((p) => `<circle cx="${X(p.t).toFixed(1)}" cy="${Y(p.level).toFixed(1)}" r="2.4" fill="#d3e3fd"/>`).join('');
  const tx = Math.min(W - R - 40, Math.max(L + 40, lx));
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Nível da bateria nas últimas 24 horas" style="display:block">
    <defs><linearGradient id="cfbat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8c7fa" stop-opacity=".30"/><stop offset="1" stop-color="#a8c7fa" stop-opacity="0"/></linearGradient></defs>
    ${grid}${xt}<path d="${area}" fill="url(#cfbat)"/>${segs}${dots}
    <line x1="${lx.toFixed(1)}" x2="${lx.toFixed(1)}" y1="${Tp}" y2="${Tp + ph}" stroke="#f2b8b5" stroke-width="1.4" stroke-dasharray="3 3"/>
    <circle class="cf-ping" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="9" fill="rgba(242,184,181,.28)"/>
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="5" fill="#f2b8b5" stroke="#131314" stroke-width="1.6"/>
    <rect x="${(tx - 41).toFixed(1)}" y="${Math.max(2, ly - 34).toFixed(1)}" width="82" height="19" rx="9.5" fill="#8c1d18"/>
    <text x="${tx.toFixed(1)}" y="${(Math.max(2, ly - 34) + 13).toFixed(1)}" text-anchor="middle" fill="#ffdad6" font-size="10.5" font-weight="700">${pad(new Date(last.t).getHours())}:${pad(new Date(last.t).getMinutes())} · ${Math.round(last.level)}%</text>
  </svg>`;
}

function openBateria(ctx, nav) {
  const { data, game, store, kit } = ctx;
  const log = (data.battery?.log || []).slice().sort(desc((e) => e.at));
  const level = data.battery?.level ?? store.CASE.meta?.device?.battery ?? 41;
  const lastFull = log.find((e) => /carga completa|100/i.test(`${e.event} ${e.level}`) && Number(e.level) >= 100);
  page(ctx, nav, {
    title: 'Bateria',
    build(el) {
      game.see('config:battery');
      const lastAt = log[0]?.at || time.MIRROR_NOW;
      el.append(
        h('section', { class: 'cf-batt' },
          h('div', { class: 'big' }, h('b', null, `${level}`, h('small', null, '%')), h('span', { class: 'ico' }, icon(level > 20 ? 'battery' : 'battery-low', { size: 30 }))),
          h('div', { class: 'cap txt' }, log[0] ? `${log[0].event}` : 'Sem registro'),
          h('div', { class: 'cap2' }, `Último registro: ${when(lastAt)}`),
          h('div', { class: 'meter', 'aria-hidden': 'true' }, h('i', { style: { width: `${level}%` } }))),
        h('section', { class: 'cf-card' },
          h('div', { class: 'cf-ch' }, h('h3', null, 'Uso da bateria'), h('small', null, lastFull ? `Desde a carga completa (${hm(lastFull.at)})` : 'Últimas 24 h')),
          h('div', { class: 'chart', html: batteryChart(data.battery?.log || [], asDate(lastAt)) }),
          h('div', { class: 'cf-legend' }, h('span', null, h('i', { style: 'background:#a8c7fa' }), 'Descarregando'), h('span', null, h('i', { style: 'background:#9cd67d' }), 'Carregando'), h('span', null, h('i', { style: 'background:#f2b8b5' }), 'Desligado'))),
        plain([
          row({ ic: 'battery-low', title: 'Economia de bateria', sub: 'Desativada', trailing: kit.toggle({ checked: false, disabled: true, label: 'Economia de bateria' }) }),
          row({ ic: 'activity', title: 'Bateria adaptável', sub: 'Ativada', trailing: kit.toggle({ checked: true, disabled: true, label: 'Bateria adaptável' }) }),
          row({ ic: 'battery-full', title: 'Porcentagem da bateria', sub: 'Mostrar na barra de status', trailing: kit.toggle({ checked: true, disabled: true, label: 'Porcentagem da bateria' }) }),
        ]));
      el.append(h('div', { class: 'cf-gt big' }, 'Registro de eventos'));
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

/* ---------- Armazenamento ---------- */
function storageInfo(ctx) {
  const r = (ctx.data.about || []).find((x) => /armazenamento/i.test(x[0]));
  const m = String(r?.[1] || '').match(/(\d+)\s*GB[^\d]+(\d+)\s*GB/i);
  return m ? { total: +m[1], used: +m[2] } : { total: 128, used: 91 };
}
function openArmazenamento(ctx, nav) {
  const s = storageInfo(ctx);
  // divisão aproximada do espaço usado (decorativa)
  const parts = [['Imagens', 'image', 0.37, T.purple], ['Vídeos', 'video', 0.26, T.pink], ['Apps', 'layout-grid', 0.17, T.blue], ['Sistema', 'settings', 0.12, T.grey], ['Áudio', 'music', 0.03, T.teal], ['Documentos e outros', 'file-text', 0.04, T.yellow], ['Lixeira', 'trash-2', 0.01, T.red]];
  page(ctx, nav, {
    title: 'Armazenamento',
    build(el) {
      const bar = h('div', { class: 'cf-stbar', 'aria-hidden': 'true' }, parts.map(([, , f, c]) => h('i', { style: { width: `${(f * s.used / s.total) * 100}%`, background: c } })));
      el.append(
        h('section', { class: 'cf-stor' }, h('div', { class: 'big' }, h('b', null, `${s.used} GB`), h('span', null, ` usados de ${s.total} GB`)), bar, h('small', null, `${s.total - s.used} GB livres`)),
        plain(parts.map(([name, ic, f, c]) => row({ ic, tint: c, solid: true, title: name, trailing: h('span', { class: 'cf-val' }, `${(f * s.used).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} GB`), onClick: () => readonly(ctx) }))));
    },
  });
}

/* ---------- Segurança e desbloqueio ---------- */
function openSeguranca(ctx, nav) {
  page(ctx, nav, {
    title: 'Segurança e privacidade',
    build(el, nav2) {
      el.append(
        h('section', { class: 'cf-status' }, h('span', { class: 'si' }, icon('shield-check', { size: 26 })), h('div', null, h('b', null, 'O dispositivo parece seguro'), h('small', null, 'Verificado pela última vez sáb., 10 de out.'))),
        plain([
          row({ ic: 'lock', title: 'Bloqueio do dispositivo', sub: 'Bloqueio de tela: PIN · Desbloqueio por impressão digital', onClick: () => readonly(ctx) }),
          row({ ic: 'fingerprint', title: 'Desbloqueio por impressão digital', sub: '1 impressão digital cadastrada', onClick: () => readonly(ctx) }),
          row({ ic: 'history', title: 'Atividade de desbloqueio', sub: 'Quando e como o aparelho foi desbloqueado', onClick: () => openUnlockLog(ctx, nav2) }),
        ], 'Desbloqueio'),
        plain([
          row({ ic: 'shield', title: 'Painel de privacidade', sub: 'Apps que usaram permissões recentemente', onClick: () => readonly(ctx) }),
          row({ ic: 'locate-fixed', title: 'Encontre Meu Dispositivo', sub: 'Ativado', onClick: () => readonly(ctx) }),
          row({ ic: 'folder-lock', title: 'Espaço privado', sub: 'Não configurado', onClick: () => readonly(ctx) }),
          row({ ic: 'shield-check', title: 'Atualização de segurança', sub: (ctx.data.about || []).find((r) => /patch/i.test(r[0]))?.[1] || '1º de setembro de 2026', onClick: () => readonly(ctx) }),
        ], 'Privacidade e sistema'));
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
      el.append(note('Desbloqueios e tentativas do aparelho, com o método usado. Toque no alfinete para fixar no Quadro.', 'fingerprint'));
      if (!log.length) el.append(note('Nenhum desbloqueio registrado.'));
      for (const [, items] of byDay(log, (e) => e.at)) {
        el.append(group(items.map((e) => {
          const m = String(e.method || 'Digital');
          const pin = /pin/i.test(m), pat = /padr/i.test(m), fail = /n[ãa]o reconhecid|falh|recusad/i.test(`${m} ${e.note || ''}`);
          return logRow(ctx, {
            tm: hm(e.at), ic: pin ? 'key-round' : pat ? 'layout-grid' : 'fingerprint', tone: pin ? 'warn' : fail ? 'bad' : 'ok', hot: pin || fail,
            title: pin ? h('span', null, 'PIN ', chipEl('PIN digitado', 'warn')) : fail ? h('span', null, m, ' ', chipEl('Recusada', 'bad')) : m,
            sub: e.note || (pin ? 'Desbloqueado com o código numérico' : 'Reconhecimento biométrico'),
            pin: { key: `config:unlock:${e.at}`, label: `Desbloqueio por ${m} · ${hm(e.at)}`, app: 'configuracoes', detail: `${time.dayLabel(e.at)}${e.note ? ' · ' + e.note : ''}` },
          });
        }), dayHead(items[0].at)));
      }
    },
  });
}

/* ---------- Contas, Google e dispositivos ---------- */
const accIcon = (s) => { const n = normalize(s); return /google|gmail/.test(n) ? 'mail' : /whats|papo/.test(n) ? 'message-circle' : /insta|lume/.test(n) ? 'aperture' : /nubank|jandaia/.test(n) ? 'landmark' : 'user-round'; };

function openContas(ctx, nav) {
  const accs = ctx.data.accounts || [];
  page(ctx, nav, {
    title: 'Senhas, chaves de acesso e contas',
    build(el, nav2) {
      el.append(
        plain([
          row({ ic: 'key-round', title: 'Gerenciador de Senhas do Google', sub: 'Serviço preferencial · senhas, chaves de acesso e preenchimento automático', onClick: () => readonly(ctx) }),
        ], 'Senhas e preenchimento automático'),
        plain(accs.map((a) => row({ ic: accIcon(a.service), tint: T.pink, solid: true, title: a.service, sub: a.email, onClick: /google/i.test(a.service) ? () => openGoogle(ctx, nav2) : undefined })), `Contas de ${ctx.store.CASE.meta?.victim?.name?.split(' ')[0] || 'Iara'} (${accs.length})`),
        plain([
          row({ ic: 'plus', title: 'Adicionar conta', onClick: () => readonly(ctx) }),
          row({ ic: 'refresh-cw', title: 'Sincronizar dados do app automaticamente', trailing: ctx.kit.toggle({ checked: true, disabled: true, label: 'Sincronizar automaticamente' }) }),
        ]));
    },
  });
}

function openGoogle(ctx, nav) {
  const { kit, store, data } = ctx;
  const email = data.accounts?.[0]?.email || store.CASE.meta?.victim?.email || '';
  page(ctx, nav, {
    title: 'Google',
    build(el, nav2) {
      el.append(
        h('section', { class: 'cf-gacc' },
          kit.avatar({ ...store.avatarOf('iara'), size: 64 }),
          h('b', null, store.CASE.meta?.victim?.name || 'Iara Fontenele'),
          h('small', null, email),
          h('button', { class: 'cf-tonal', on: { click: () => openDevices(ctx, nav2) } }, 'Gerenciar sua Conta Google')),
        plain([
          row({ ic: 'laptop', title: 'Dispositivos com acesso à conta', sub: 'Onde a Conta Google está conectada', onClick: () => openDevices(ctx, nav2) }),
          row({ ic: 'cloud-upload', title: 'Backup', sub: 'Backup do Google One · em pausa (sem conexão)', onClick: () => readonly(ctx) }),
          row({ ic: 'locate-fixed', title: 'Encontre Meu Dispositivo', sub: 'Ativado', onClick: () => readonly(ctx) }),
          row({ ic: 'layout-grid', title: 'Todos os serviços', onClick: () => readonly(ctx) }),
        ]));
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
    title: 'Dispositivos com acesso à conta', subtitle: 'Conta Google',
    build(el) {
      game.see('config:devices');
      el.append(note('Estes dispositivos entraram na Conta Google. Se algum não for reconhecido, saia dele e troque a senha.', 'shield-alert'));
      if (!list.length) el.append(note('Nenhum dispositivo encontrado.'));
      el.append(group(list.map((d) => {
        const active = isActiveNow(d), me = isThisDevice(d);
        const la = asDate(d.lastActive) ? `Último acesso: ${when(d.lastActive)}` : d.lastActive ? `Último acesso: ${d.lastActive}` : '';
        return h('article', { class: `cf-dev ${active ? 'active' : ''}` },
          iconBox(/notebook|laptop|pc|windows|mac|linux/i.test(d.name) ? 'laptop' : 'smartphone', active ? T.green : T.pink, { solid: true }),
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
    title: 'Apps',
    build(el) {
      el.append(h('div', { class: 'cf-gt' }, 'Apps abertos recentemente'));
      el.append(h('div', { class: 'cf-plain' }, apps.map((a) => {
        const info = appInfoByName(a.name);
        const used = asDate(a.lastUsed) ? `${daysAgo(a.lastUsed) === 0 ? 'Hoje' : daysAgo(a.lastUsed) === 1 ? 'Ontem' : time.dateShort(a.lastUsed)} às ${hm(a.lastUsed)}` : a.lastUsed || '';
        return appRow(a, info, used);
      })));
      if (!apps.length) el.append(note('Nenhum app listado.'));
      el.append(plain([
        row({ ic: 'layout-grid', title: `Ver todos os ${apps.length} apps`, onClick: () => readonly(ctx) }),
        row({ ic: 'star', title: 'Apps padrão', sub: 'Chrome, Mensagens e Telefone', onClick: () => readonly(ctx) }),
        row({ ic: 'shield', title: 'Gerenciador de permissões', onClick: () => readonly(ctx) }),
      ], 'Geral'));
    },
  });
}
function appRow(a, info, used) {
  return h('div', { class: 'cf-row' },
    info ? h('div', { class: 'cf-napp lg', style: { background: info.bg, color: info.fg || '#fff' } }, icon(info.icon, { size: 22 })) : h('div', { class: 'cf-napp lg generic' }, (a.name || '?').charAt(0)),
    h('div', { class: 'tx' }, h('div', { class: 't' }, a.name), h('div', { class: 's' }, [used ? `Último uso: ${used}` : '', a.size].filter(Boolean).join(' · '))));
}

function slider(pct, ic) {
  return h('div', { class: 'cf-slider', 'aria-disabled': 'true' }, h('i', { style: { width: `${pct}%` } }, ic ? icon(ic, { size: 18 }) : null), h('b', { style: { left: `${pct}%` } }));
}

function openTela(ctx, nav) {
  const { kit, store } = ctx;
  page(ctx, nav, {
    title: 'Tela',
    build(el) {
      const sizes = [['s', 'Pequeno'], ['m', 'Padrão'], ['l', 'Grande']];
      const seg = h('div', { class: 'cf-seg', role: 'radiogroup', 'aria-label': 'Tamanho da fonte' });
      const preview = h('p', { class: 'cf-prev txt' }, 'Aa — Fui no mirante fazer uns timelapse.');
      const draw = () => {
        clear(seg);
        for (const [v, l] of sizes) seg.appendChild(h('button', { class: (state.settings.textSize || 'm') === v ? 'on' : '', role: 'radio', 'aria-checked': String((state.settings.textSize || 'm') === v), on: { click: () => { state.settings.textSize = v; save(); bus.emit('settings', {}); draw(); } } }, (state.settings.textSize || 'm') === v ? icon('check', { size: 16 }) : null, l));
        preview.style.fontSize = { s: '13.5px', m: '15.5px', l: '18px' }[state.settings.textSize || 'm'];
      };
      draw();
      const wp = store.CASE.meta?.wallpapers || {};
      el.append(
        plain([h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Nível de brilho'), slider(62, 'sun')),
          row({ ic: 'sparkles', title: 'Brilho adaptável', trailing: kit.toggle({ checked: true, disabled: true, label: 'Brilho adaptável' }) })], 'Brilho'),
        plain([
          row({ ic: 'moon', title: 'Tema escuro', sub: 'Sempre ativado neste aparelho', trailing: kit.toggle({ checked: true, disabled: true, label: 'Tema escuro' }) }),
          row({ ic: 'lock', title: 'Tela de bloqueio', sub: 'Mostrar todo o conteúdo das notificações', onClick: () => readonly(ctx) }),
          row({ ic: 'clock', title: 'Tempo limite da tela', sub: 'Após 30 segundos de inatividade', onClick: () => readonly(ctx) }),
        ], 'Aparência'),
        plain([h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Tamanho da fonte'), seg, preview)], 'Tamanho da exibição e texto'),
        plain([h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Tela de bloqueio e tela inicial'),
          h('div', { class: 'cf-wps' }, wp.lock ? kit.img(wp.lock, { alt: 'Tela de bloqueio', ratio: '9/16' }) : null, wp.home ? kit.img(wp.home, { alt: 'Tela inicial', ratio: '9/16' }) : null))], 'Plano de fundo e estilo'));
    },
  });
}

function openSom(ctx, nav) {
  const { kit } = ctx;
  page(ctx, nav, {
    title: 'Som e vibração',
    build(el) {
      const t = kit.toggle({ checked: state.settings.sound !== false, label: 'Sons de toque', onChange: (v) => { state.settings.sound = v; save(); bus.emit('settings', {}); } });
      el.append(
        plain([
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Volume da mídia'), slider(70, 'music')),
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Volume da chamada'), slider(60, 'phone')),
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Volume do toque e das notificações'), slider(55, 'bell')),
          h('div', { class: 'cf-row col' }, h('div', { class: 'cf-lab' }, 'Volume do alarme'), slider(82, 'alarm-clock')),
        ]),
        plain([
          row({ ic: 'smartphone', title: 'Vibração e retorno tátil', sub: 'Ativado', trailing: kit.toggle({ checked: true, disabled: true, label: 'Vibração' }) }),
          row({ ic: 'moon', title: 'Não perturbe', sub: 'Desativado', onClick: () => readonly(ctx) }),
          row({ ic: 'volume-x', title: 'Modo silencioso', sub: 'Desativado', trailing: kit.toggle({ checked: false, disabled: true, label: 'Modo silencioso' }) }),
          row({ ic: 'volume-2', title: 'Sons de toque', sub: 'Toques e avisos deste celular (ajuste do jogo)', trailing: t }),
        ]));
    },
  });
}

function phoneArt() {
  return `<svg viewBox="0 0 120 190" width="92" aria-hidden="true"><defs><linearGradient id="cfph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3c4a5c"/><stop offset="1" stop-color="#1c232c"/></linearGradient></defs>
    <rect x="14" y="4" width="92" height="182" rx="16" fill="url(#cfph)" stroke="#5f6b7a" stroke-width="2"/>
    <rect x="21" y="12" width="78" height="166" rx="10" fill="#0d0f13"/>
    <circle cx="60" cy="21" r="3" fill="#2a2f39"/>
    <text x="60" y="84" text-anchor="middle" fill="#e3e3e3" font-size="22" font-weight="300" font-family="sans-serif">23:47</text>
    <text x="60" y="102" text-anchor="middle" fill="#9aa0a6" font-size="8" font-family="sans-serif">sáb., 10 de out.</text>
    <rect x="44" y="166" width="32" height="3" rx="1.5" fill="#e3e3e3" opacity=".7"/></svg>`;
}

function openSobre(ctx, nav) {
  const { kit, store, data } = ctx;
  const meta = store.CASE.meta || {};
  const about = (data.about && data.about.length) ? data.about : [
    ['Nome do dispositivo', `${meta.device?.model || 'moto g85'} da Iara`], ['Modelo', meta.device?.model || 'moto g85'], ['Versão do Android', androidVersion(ctx)],
    ['Número de telefone', '(85) 98741-2290'], ['Operadora', meta.device?.carrier || 'Claro'],
  ];
  const name = about.find((r) => /nome do dispositivo/i.test(r[0]))?.[1] || meta.device?.model || 'moto g85';
  page(ctx, nav, {
    title: 'Sobre o dispositivo',
    build(el) {
      el.append(
        h('div', { class: 'cf-about' }, h('div', { html: phoneArt() }), h('h2', null, name), h('p', null, `motorola ${meta.device?.model || 'moto g85'} · Android ${androidVersion(ctx)}`)),
        h('div', { class: 'cf-kv' }, kit.kv(about)),
        note('Esta é uma extração forense do aparelho, em modo avião. Os ajustes são somente leitura.', 'lock'));
    },
  });
}

/* ---------- itens sem página própria ---------- */
const soon = (ctx) => readonly(ctx);

/* ---------- roteamento e busca ---------- */
const ROUTES = {
  rede: openRede, wifi: openWifi, dispositivos: openDispositivos, bluetooth: openBluetooth, apps: openApps,
  notificacoes: openNotificacoes, 'notif-history': openNotifHistory, bateria: openBateria, battery: openBateria,
  armazenamento: openArmazenamento, storage: openArmazenamento,
  som: openSom, tela: openTela, seguranca: openSeguranca, 'unlock-log': openUnlockLog, contas: openContas, google: openGoogle,
  devices: openDevices, sobre: openSobre, about: openSobre,
  acessibilidade: soon, localizacao: soon, sistema: soon,
};

/** Índice de busca: seções, redes, dispositivos e (se liberado) textos dos históricos. */
function buildIndex(data, game) {
  const out = [];
  const add = (title, text, section, ic, tint) => out.push({ title, text, params: { section }, ic, tint });
  for (const s of SECTIONS) add(s.title, '', s.id, s.icon === 'google' ? 'user-round' : s.icon, s.tint);
  add('Wi-Fi', 'internet redes salvas histórico de conexões', 'wifi', 'wifi', T.blue);
  add('Bluetooth', 'dispositivos pareados histórico', 'bluetooth', 'bluetooth', T.green);
  add('Histórico de notificações', 'notificações recentes apagadas', 'notif-history', 'history', T.orange);
  add('Atividade de desbloqueio', 'digital impressão PIN padrão desbloqueios', 'unlock-log', 'history', T.green);
  add('Dispositivos com acesso à conta', 'conta Google notebook sessões', 'devices', 'laptop', T.pink);
  add('Bateria', 'nível registro desligado carregador', 'battery', 'battery-full', T.lime);
  for (const n of data.wifi?.saved || []) add(`Wi-Fi: ${n.ssid}`, `${n.security || ''} conectada pela última vez ${n.lastConnected ? when(n.lastConnected) : ''}`, 'wifi', 'wifi', T.blue);
  for (const d of data.bluetooth?.devices || []) add(`Bluetooth: ${d.name}`, d.connected ? 'conectado' : `última conexão ${d.lastConnected ? when(d.lastConnected) : ''}`, 'bluetooth', btIcon(d), T.green);
  for (const d of data.devices || []) add(`Dispositivo: ${d.name}`, `${d.place || ''} ${d.note || ''}`, 'devices', 'laptop', T.pink);
  for (const a of data.accounts || []) add(`Conta: ${a.service}`, a.email, 'contas', 'user-round', T.pink);
  for (const a of data.apps || []) add(`App: ${a.name}`, a.size || '', 'apps', 'layout-grid', T.yellow);
  if (game.has(data.notifications?.historyReq || 'cap4')) for (const n of data.notifications?.history || []) add(`Notificação: ${n.title || n.app}`, `${n.text} ${hm(n.at)}`, 'notif-history', 'bell', T.orange);
  if (game.has(data.security?.unlockLogReq || 'cap4')) for (const e of data.security?.unlockLog || []) add(`Desbloqueio por ${e.method}`, `${when(e.at)} ${e.note || ''}`, 'unlock-log', 'fingerprint', T.green);
  for (const e of data.battery?.log || []) add(`Bateria: ${e.event}`, `${when(e.at)} ${e.level}%`, 'battery', 'battery', T.lime);
  return out;
}

export default {
  id: 'configuracoes',
  title: 'Configurações',
  cloud: false,

  render(ctx) {
    const { el, kit, store, game, nav, params, data } = ctx;
    const email = data.accounts?.[0]?.email || store.CASE.meta?.victim?.email || '';
    const vName = store.CASE.meta?.victim?.name || 'Iara Fontenele';
    const main = h('div', { class: 'cf-main' });
    const results = h('div', { class: 'cf-main cf-results', hidden: true });

    const sectionIcon = (s) => (s.icon === 'google' ? h('div', { class: 'cf-ic solid', style: `--t:${s.tint}` }, googleG(22)) : iconBox(s.icon, s.tint, { solid: true }));
    main.append(
      h('button', { class: 'cf-account', on: { click: () => openGoogle(ctx, nav) } },
        kit.avatar({ ...store.avatarOf('iara'), size: 48 }),
        h('div', { class: 'tx' }, h('div', { class: 'n' }, vName), h('div', { class: 's' }, email), h('div', { class: 'e' }, 'Conta Google · backup em pausa')),
        icon('chevron-right', { size: 20 })),
      h('div', { class: 'cf-home' }, SECTIONS.map((s, i) => {
        const r = h('button', { class: 'cf-row home', on: { click: () => { sfx.play('tap'); ROUTES[s.id]?.(ctx, nav); } } },
          sectionIcon(s),
          h('div', { class: 'tx' }, h('div', { class: 't' }, s.title), h('div', { class: 's' }, sectionSub(ctx, s.id))));
        return [r, i === 8 || i === 13 ? divider() : null];
      })));

    /* busca "Pesquisar nas Configurações" (pílula com o avatar à direita) */
    const inp = h('input', { type: 'search', placeholder: 'Pesquisar nas Configurações', 'aria-label': 'Pesquisar nas Configurações', autocomplete: 'off', spellcheck: 'false' });
    let tmr = null;
    const runSearch = () => {
      const q = inp.value;
      const nq = normalize(q);
      clear(results);
      if (nq.length < 2) { results.hidden = true; main.hidden = false; return; }
      main.hidden = true; results.hidden = false;
      const hits = buildIndex(data, game).filter((it) => normalize(`${it.title} ${it.text}`).includes(nq)).slice(0, 40);
      if (!hits.length) results.append(kit.empty({ icon: 'search', title: 'Nenhum resultado', text: `Nenhum ajuste para “${q}”.` }));
      else results.append(plain(hits.map((it) => row({ ic: it.ic, tint: it.tint, solid: true, title: it.title, sub: it.text.trim() || undefined, onClick: () => ROUTES[it.params.section]?.(ctx, nav) }))));
      ctx.phone.scan(results);
    };
    inp.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(runSearch, 120); });
    const search = h('label', { class: 'cf-search' }, icon('search', { size: 22 }), inp,
      h('button', { class: 'cf-sav', 'aria-label': 'Conta Google', on: { click: (e) => { e.preventDefault(); openGoogle(ctx, nav); } } }, kit.avatar({ ...store.avatarOf('iara'), size: 32 })));

    el.append(h('div', { class: 'cf-homehead' }, h('h1', null, 'Configurações')), h('div', { class: 'cf-searchwrap' }, search), main, results);
    if (params?.section && ROUTES[params.section]) ROUTES[params.section](ctx, nav);
  },

  search({ data, game }) {
    return buildIndex(data, game).map((it) => ({ title: `Configurações · ${it.title}`, text: it.text, params: it.params }));
  },
};
