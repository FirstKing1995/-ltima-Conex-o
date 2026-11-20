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
import { appIconEl, hasAppIcon } from '../ui/appicons.js';

function appIcon(a, { badgeN = 0 } = {}) {
  const ic = hasAppIcon(a.id) ? appIconEl(a.id, 58) : h('span', { class: 'ai', style: { background: a.bg, color: a.fg || '#fff', display: 'grid', placeItems: 'center' } }, icon(a.icon, { size: 28 }));
  return h('button', { class: 'app-ic', 'aria-label': a.title, dataset: { app: a.id }, on: { click: () => phone.open(a.id) } },
    h('span', { class: 'icw' }, ic, badgeN ? h('span', { class: 'badge-n' }, String(badgeN)) : null), h('span', { class: 'nm' }, a.title));
}

/** Notificações "presas" no aparelho às 23:47 (contagem por app para os badges). */
function badgeCounts() {
  const out = {};
  for (const n of (CASE.meta?.lockScreen?.notifications || [])) { const id = n.appId || n.app; out[id] = (out[id] || 0) + 1; }
  return out;
}

const G_SVG = '<svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><path fill="#4285f4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.2z"/><path fill="#34a853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#fbbc05" d="M11.8 28.3c-.4-1.3-.7-2.8-.7-4.3s.3-3 .7-4.3V14H4.5C3 17 2.2 20.4 2.2 24s.8 7 2.3 10z"/><path fill="#ea4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/></svg>';
const gLogo = () => { const s = h('span', { class: 'g' }); s.innerHTML = G_SVG; return s; };
const MOON = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>';
export function renderHome(el) {
  const meta = CASE.meta || {};
  if (meta.wallpapers?.home) el.style.backgroundImage = `url("${asset(meta.wallpapers.home)}")`;
  const counts = badgeCounts();
  const grid = APPS.filter(a => !a.dock && !a.hidden);
  const dock = APPS.filter(a => a.dock);
  const wx = h('div', { class: 'wx' }); wx.innerHTML = MOON; wx.append('19° · Guaraciaba do Norte');
  el.append(
    h('div', { class: 'hm-glance' }, h('div', { class: 'day' }, time.weekdayLong(time.MIRROR_NOW).replace(/^./, c => c.toUpperCase()) + ', ' + time.dateLong(time.MIRROR_NOW).replace(/ de \d{4}$/, '')), wx),
    h('div', { class: 'hm-pages' }, h('div', { class: 'hm-grid' }, grid.map(a => appIcon(a, { badgeN: counts[a.id] })))),
    h('div', { class: 'hm-dots' }, h('i', { class: 'on' }), h('i')),
    h('div', { class: 'hm-dock' }, dock.map(a => appIcon(a, { badgeN: counts[a.id] }))),
    h('button', { class: 'hm-search', on: { click: openSearch } }, gLogo(), h('span', { class: 'sp' }, 'Pesquisar'), h('span', { class: 'mic' }, icon('mic', { size: 20 })), h('span', { class: 'mic' }, icon('camera', { size: 20 }))));
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
          const av = hasAppIcon(r.app) ? appIconEl(r.app, 40, 'round') : null;
          results.appendChild(kit.listItem({
            avatar: av || h('div', { class: 'k-avatar', style: { width: '40px', height: '40px', background: info.bg, color: info.fg || '#fff' } }, icon(info.icon, { size: 20 })),
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
      const tiles = [['wifi-off', 'Wi-Fi', 'Desconectado'], ['bluetooth', 'Bluetooth', 'Ativado'], ['signal-medium', 'Dados', 'Claro'], ['battery-low', 'Bateria', `${meta.device?.battery ?? 41}%`]];
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
