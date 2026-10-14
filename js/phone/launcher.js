// Tela inicial, gaveta de notificações e busca global.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as kit from '../ui/kit.js';
import * as time from '../core/time.js';
import { CASE, asset } from '../core/store.js';
import { search } from '../core/search.js';
import { phone } from './phone.js';
import { APPS, appInfo, loadApp } from '../apps/index.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';

function appIcon(a, { badgeN = 0 } = {}) {
  const tile = h('span', { class: 'tile', style: { background: a.bg, color: a.fg || '#fff' } }, icon(a.icon, { size: 28, stroke: 1.9 }), badgeN ? kit.badge(badgeN, { red: true }) : null);
  return h('button', { class: 'app-ic', 'aria-label': a.title, dataset: { app: a.id }, on: { click: () => phone.open(a.id) } }, tile, h('span', { class: 'nm' }, a.title));
}

/** Notificações "presas" no aparelho às 23:47 (contagem por app para os badges). */
function badgeCounts() {
  const out = {};
  for (const n of (CASE.meta?.lockScreen?.notifications || [])) { const id = n.appId || n.app; out[id] = (out[id] || 0) + 1; }
  return out;
}

export function renderHome(el) {
  const meta = CASE.meta || {};
  el.style.backgroundImage = meta.wallpapers?.home ? `url("${asset(meta.wallpapers.home)}")` : 'linear-gradient(160deg,#2a1f1a,#0f1216 55%,#0b0c0e)';
  const counts = badgeCounts();
  const grid = APPS.filter(a => !a.dock && !a.hidden);
  const dock = APPS.filter(a => a.dock);
  el.append(
    h('div', { class: 'home-top' },
      h('div', { class: 'home-clock' }, time.hhmm(time.MIRROR_NOW)),
      h('div', { class: 'home-date' }, time.weekdayLong(time.MIRROR_NOW) + ', ' + time.dateLong(time.MIRROR_NOW).replace(/ de \d{4}$/, ''), h('span', { style: 'opacity:.7' }, '·'),
        h('span', { style: 'display:inline-flex;gap:4px;align-items:center' }, icon('moon', { size: 14 }), '19°C Guaraciaba do Norte'))),
    h('button', { class: 'home-search', on: { click: openSearch } }, icon('search', { size: 20 }), h('span', null, 'Pesquisar no celular')),
    h('div', { class: 'home-pages' }, h('div', { class: 'home-grid' }, grid.map(a => appIcon(a, { badgeN: counts[a.id] })))),
    h('div', { class: 'home-dock' }, dock.map(a => appIcon(a, { badgeN: counts[a.id] }))));
}

/* ---------- busca global ---------- */
async function ensureIndexers() {
  // carrega os módulos dos apps para que registrem seus indexadores
  await Promise.all(APPS.map(a => loadApp(a.id).then(mod => { if (mod.search && !mod.__indexed) { search.register(a.id, () => mod.search({ data: CASE[a.dataKey || a.id] || {}, game: phone.game })); mod.__indexed = true; } }).catch(() => {})));
}

function openSearch() {
  phone.push({
    className: 'search-screen',
    render(body, nav) {
      const results = h('div', { class: 'k-list' });
      const draw = (q) => {
        clear(results);
        if (!q || q.trim().length < 2) { results.appendChild(kit.empty({ icon: 'search', title: 'Pesquise em todo o celular', text: 'Nomes, números, lugares, palavras. Ex.: "mirante", "99645", "Bento".' })); return; }
        const res = search.query(q);
        if (!res.length) { results.appendChild(kit.empty({ icon: 'search', title: 'Nada encontrado', text: `Nenhum resultado para "${q}".` })); return; }
        for (const r of res) {
          const info = appInfo(r.app) || { title: r.app, icon: 'circle', bg: '#444' };
          results.appendChild(kit.listItem({
            avatar: h('div', { class: 'k-avatar', style: { width: '40px', height: '40px', background: info.bg, color: info.fg || '#fff' } }, icon(info.icon, { size: 20 })),
            title: r.title || info.title, subtitle: r.snippet, meta: info.title,
            onClick: () => phone.open(r.app, r.params || {}),
          }));
        }
        phone.scan(results);
      };
      const field = kit.search({ placeholder: 'Pesquisar no celular', onInput: draw, autofocus: true });
      body.append(h('div', { style: 'display:flex;align-items:center;gap:2px;padding:6px 4px 0' }, kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => nav.back() }), h('div', { style: 'flex:1' }, field)), results);
      draw('');
      ensureIndexers().then(() => draw(field.input.value));
    },
  });
}
phone.openSearch = openSearch;

/* ---------- gaveta de notificações ---------- */
phone.openShade = function openShade() {
  if (phone.isLocked()) return;
  const meta = CASE.meta || {};
  phone.sheet({
    title: 'Notificações',
    render(body, close) {
      const tiles = [['wifi-off', 'Wi-Fi', 'Desconectado'], ['bluetooth', 'Bluetooth', 'Ativado'], ['signal-medium', 'Dados', 'Litoral Móvel'], ['battery-low', 'Bateria', `${meta.device?.battery ?? 41}%`]];
      body.append(
        h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px 10px' }, tiles.map(([ic, a, b]) => h('div', { style: 'background:var(--ph-s3);border-radius:18px;padding:12px;display:flex;gap:10px;align-items:center' }, icon(ic, { size: 20 }), h('div', null, h('div', { style: 'font-size:13.5px;font-weight:600' }, a), h('div', { style: 'font-size:12px;color:var(--ph-mut)' }, b))))),
        kit.sectionTitle('No aparelho às ' + time.hhmm(time.MIRROR_NOW)),
        kit.list((meta.lockScreen?.notifications || []).map(n => kit.listItem({ icon: n.icon || 'bell', title: n.title, subtitle: n.text, meta: n.at ? time.hhmm(n.at) : '', onClick: () => { close(); if (n.appId) phone.open(n.appId, n.params || {}); } }))),
      );
    },
  });
};

bus.on('home', () => {});
export { appIcon };
