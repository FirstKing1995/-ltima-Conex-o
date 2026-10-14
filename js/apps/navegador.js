// Navegador — o navegador do aparelho de Iara (dados do aparelho: até sáb 23:47; sem conexão no espelho).
// Raiz: aba ativa como página simples + barra inferior (endereço decorativo, abas, menu). Subtelas: abas, histórico, favoritos, página.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

const OFFLINE = 'Esta página não está disponível no espelho (sem conexão)';

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function parseUrl(u) {
  try {
    const x = new URL(u);
    return { proto: x.protocol.replace(':', ''), host: x.hostname.replace(/^www\./, ''), path: ((x.pathname === '/' ? '' : x.pathname) + x.search).replace(/\/$/, '') };
  } catch (e) {
    const raw = String(u || '').replace(/^https?:\/\//, '').replace(/^www\./, '');
    const i = raw.indexOf('/');
    return { proto: /^http:\/\//.test(String(u || '')) ? 'http' : 'https', host: i < 0 ? raw : raw.slice(0, i), path: i < 0 ? '' : raw.slice(i).replace(/\/$/, '') };
  }
}
const sameUrl = (a, b) => { if (!a || !b) return false; const x = parseUrl(a), y = parseUrl(b); return x.host === y.host && x.path === y.path; };
const hue = (s) => { let n = 7; for (const c of String(s)) n = (n * 31 + c.charCodeAt(0)) >>> 0; return n % 360; };
const siteColor = (host) => `hsl(${hue(host)} 48% 30%)`;
function siteName(title, host) {
  const parts = String(title || '').split(/\s[—–|]\s/);
  if (parts.length > 1) return parts[parts.length - 1].trim();
  const base = String(host || '').split('.')[0] || 'Site';
  return base.charAt(0).toUpperCase() + base.slice(1);
}
const blocksText = (page) => (page?.blocks || []).map(b => b.text || b.caption || b.alt || '').join(' ');
function dayDiff(a, b) {
  const da = time.parse(a), db = time.parse(b);
  return Math.round((Date.UTC(db.getFullYear(), db.getMonth(), db.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) / 86400000);
}
function dayHeader(at, now) {
  const d = time.parse(at);
  const wd = time.weekdayLong(at);
  const base = `${wd}, ${d.getDate()} de ${time.monthName(d.getMonth())}`;
  const diff = dayDiff(at, now);
  return diff === 0 ? `Hoje · ${base}` : diff === 1 ? `Ontem · ${base}` : base.charAt(0).toUpperCase() + base.slice(1);
}

/* ---------- a página como site simples (tema claro, legível) ---------- */
function pageDoc(kit, { title, url, page }) {
  const u = parseUrl(url);
  const name = siteName(title || page?.title, u.host);
  const blocks = page?.blocks || [];
  const nodes = [];
  if (!blocks.some(b => b.type === 'h1') && (page?.title || title)) nodes.push(h('h1', { class: 'nv-h1' }, page?.title || title));
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'li') {
      const ul = h('ul', { class: 'nv-ul' });
      while (i < blocks.length && blocks[i].type === 'li') { ul.appendChild(h('li', null, blocks[i].text)); i++; }
      i--; nodes.push(ul); continue;
    }
    if (b.type === 'h1') nodes.push(h('h1', { class: 'nv-h1' }, b.text));
    else if (b.type === 'h2' || b.type === 'h3') nodes.push(h('h2', { class: 'nv-h2' }, b.text));
    else if (b.type === 'quote') nodes.push(h('blockquote', { class: 'nv-quote' }, b.text));
    else if (b.type === 'img') {
      nodes.push(h('figure', { class: 'nv-fig' },
        kit.img(b.src, { alt: b.alt || b.caption || '', ratio: b.ratio || '16/10', className: 'nv-img' }),
        b.caption ? h('figcaption', null, b.caption) : null));
    } else if (b.text) nodes.push(h('p', { class: 'nv-p' }, b.text));
  }
  return h('div', { class: 'nv-doc' },
    h('header', { class: 'nv-site', style: `--site:${siteColor(u.host)}` },
      h('span', { class: 'nv-fav' }, name.charAt(0).toUpperCase()),
      h('b', null, name),
      h('span', null, u.host)),
    h('article', { class: 'nv-article txt' }, nodes),
    h('footer', { class: 'nv-foot' }, `${u.host} · ${u.proto === 'http' ? 'conexão não segura' : 'conexão segura'}`));
}

/* ---------- app ---------- */
export default {
  id: 'navegador',
  title: 'Navegador',
  cloud: false,

  render(ctx) {
    const { el, kit, game, phone, data, nav, params = {} } = ctx;
    const NOW = ctx.now || time.MIRROR_NOW;
    const tabs = () => (data.tabs || []).filter(t => game.req(t));
    const history = () => (data.history || []).filter(x => game.req(x));
    const bookmarks = () => (data.bookmarks || []).map((b, i) => (typeof b === 'string' ? { id: `bm${i}`, title: b, url: b } : { id: b.id || `bm${i}`, ...b })).filter(b => game.req(b));
    const stub = (what) => phone.toast(`${what} indisponível no espelho`, { icon: 'info' });
    const offline = () => phone.toast(OFFLINE, { icon: 'wifi-off', ms: 3400 });

    /** Página (aba ou histórico) a abrir, ou null. */
    const pageFor = (it) => {
      if (!it) return null;
      if (it.page) return { title: it.page.title || it.title, url: it.url, page: it.page, tab: null };
      const t = tabs().find(x => x.id === it.tab) || (it.url && tabs().find(x => sameUrl(x.url, it.url)));
      return t && t.page ? { title: t.title, url: t.url, page: t.page, tab: t } : null;
    };

    /* ----- barra inferior ----- */
    const addrPill = (url, onTap) => {
      const u = parseUrl(url);
      return h('button', { class: 'nv-addr', 'aria-label': `Endereço: ${u.host}${u.path}`, on: { click: onTap || offline } },
        icon(u.proto === 'http' ? 'triangle-alert' : 'lock', { size: 15 }),
        h('span', { class: 'nv-addr-t' }, h('b', null, u.host || 'Nova aba'), u.path ? h('em', null, u.path) : null),
        icon('refresh-cw', { size: 15 }));
    };

    /* ----- raiz: aba ativa ----- */
    let cur = null;
    const pageBox = h('div', { class: 'nv-page' });
    const addrSlot = h('div', { class: 'nv-addr-slot' });
    const tabBtn = h('button', { class: 'nv-tabbtn', 'aria-label': 'Abas abertas', on: { click: () => openTabs() } }, h('span', null, '0'));
    const menuBtn = h('button', { class: 'nv-menubtn', 'aria-label': 'Mais opções', on: { click: () => openMenu() } }, icon('ellipsis-vertical', { size: 22 }));
    const bar = h('div', { class: 'nv-bar' }, addrSlot, tabBtn, menuBtn);

    function showTab(t, { silent } = {}) {
      cur = t;
      clear(pageBox); clear(addrSlot);
      if (!t) {
        pageBox.appendChild(h('div', { class: 'nv-start' }, icon('compass', { size: 46, stroke: 1.4 }), h('h3', null, 'Nenhuma aba aberta'), h('p', null, 'O espelho está sem conexão. Só aparece o que estava aberto no aparelho.')));
        addrSlot.appendChild(addrPill('https://', offline));
        tabBtn.firstChild.textContent = '0';
        return;
      }
      pageBox.appendChild(t.page ? pageDoc(kit, t) : h('div', { class: 'nv-start' }, icon('wifi-off', { size: 46, stroke: 1.4 }), h('h3', null, 'Sem conexão'), h('p', null, OFFLINE + '.')));
      pageBox.scrollTop = 0;
      addrSlot.appendChild(addrPill(t.url));
      tabBtn.firstChild.textContent = String(tabs().length);
      if (!silent) { game.see('navegador:tab:' + t.id); if (t.onSee) game.flags([].concat(t.onSee)); }
      phone.scan(pageBox);
    }

    /* ----- subtela: abas ----- */
    function openTabs() {
      nav.push({
        className: 'nv-screen',
        render: (body, n) => {
          const list = tabs();
          body.appendChild(kit.appBar({ title: `${list.length} ${list.length === 1 ? 'aba' : 'abas'}`, actions: [{ icon: 'plus', label: 'Nova aba', onClick: () => offline() }] }));
          const grid = h('div', { class: 'nv-cards' });
          for (const t of list) {
            const u = parseUrl(t.url);
            const name = siteName(t.title, u.host);
            const img = (t.page?.blocks || []).find(b => b.type === 'img');
            const lines = (t.page?.blocks || []).filter(b => b.type === 'p' || b.type === 'li' || b.type === 'quote').slice(0, 3);
            const thumb = h('div', { class: 'nv-thumb', style: `--site:${siteColor(u.host)}` },
              h('div', { class: 'nv-thumb-h' }, h('i', null, name.charAt(0).toUpperCase()), h('span', null, name)),
              h('div', { class: 'nv-thumb-b' },
                h('b', null, t.page?.title || t.title),
                img ? kit.img(img.src, { alt: '', ratio: '16/9', className: 'nv-thumb-img' }) : null,
                lines.map(l => h('span', null, l.text))));
            grid.appendChild(h('div', { class: `nv-card ${cur && cur.id === t.id ? 'on' : ''}` },
              h('div', { class: 'nv-card-h' },
                h('button', { class: 'nv-card-open', 'aria-label': `Abrir aba ${t.title}`, on: { click: () => { showTab(t); n.back(); } } }, h('span', { class: 'nv-card-t' }, t.title), h('span', { class: 'nv-card-u' }, u.host)),
                h('button', { class: 'nv-card-x', 'aria-label': 'Fechar aba', on: { click: () => phone.toast('Fechar abas está desativado no espelho', { icon: 'info' }) } }, icon('x', { size: 16 }))),
              h('button', { class: 'nv-card-body', 'aria-hidden': 'true', tabindex: '-1', on: { click: () => { showTab(t); n.back(); } } }, thumb)));
          }
          grid.appendChild(h('button', { class: 'nv-card new', on: { click: () => offline() } }, icon('plus', { size: 26 }), h('span', null, 'Nova aba')));
          body.appendChild(grid);
          if (!list.length) body.appendChild(kit.empty({ icon: 'layers', title: 'Sem abas', text: 'Nenhuma aba estava aberta neste aparelho.' }));
        },
      });
    }

    /* ----- subtela: página aberta pelo histórico/favoritos ----- */
    function openPageScreen(pg) {
      nav.push({
        className: 'nv-screen nv-pagescreen',
        render: (body, n) => {
          const box = h('div', { class: 'nv-page' }, pageDoc(kit, pg));
          const b2 = h('div', { class: 'nv-bar' },
            h('button', { class: 'nv-menubtn', 'aria-label': 'Fechar página', on: { click: () => n.back() } }, icon('x', { size: 22 })),
            h('div', { class: 'nv-addr-slot' }, addrPill(pg.url)));
          body.appendChild(h('div', { class: 'nv-root' }, box, b2));
        },
      });
    }

    /* ----- subtela: histórico ----- */
    function openHistory({ focus } = {}) {
      nav.push({
        className: 'nv-screen',
        render: (body, n) => {
          body.appendChild(kit.appBar({ title: 'Histórico', actions: [{ icon: 'trash-2', label: 'Limpar histórico', onClick: () => stub('Limpar histórico') }] }));
          const listEl = h('div', { class: 'nv-hist' });
          const tap = (it) => {
            game.see('navegador:history:' + it.id);
            if (it.onSee) game.flags([].concat(it.onSee));
            const pg = pageFor(it);
            if (pg) { if (pg.tab) game.see('navegador:tab:' + pg.tab.id); openPageScreen(pg); }
            else offline();
          };
          const draw = (q = '') => {
            clear(listEl);
            const needle = fold(q).trim();
            const items = history().filter(it => !needle || fold(`${it.query || ''} ${it.title || ''} ${it.url || ''}`).includes(needle)).sort((a, b) => time.compare(b.at, a.at));
            if (!items.length) { listEl.appendChild(kit.empty({ icon: 'history', title: 'Nada encontrado', text: needle ? 'Nenhum item corresponde à busca.' : 'O histórico está vazio.' })); return; }
            let last = '';
            for (const it of items) {
              const day = time.ymd(it.at);
              if (day !== last) { listEl.appendChild(h('div', { class: 'nv-day' }, dayHeader(it.at, NOW))); last = day; }
              const isQ = !!it.query;
              const u = parseUrl(it.url || '');
              const lead = isQ
                ? h('span', { class: 'nv-hic q' }, icon('search', { size: 18 }))
                : h('span', { class: 'nv-hic', style: `--site:${siteColor(u.host)}` }, (siteName(it.title, u.host) || '?').charAt(0).toUpperCase());
              const row = h('button', { class: `nv-hrow ${focus === it.id ? 'flash' : ''}`, dataset: { id: it.id }, on: { click: () => tap(it) } },
                lead,
                h('span', { class: 'nv-hmain' }, h('span', { class: 'nv-ht' }, isQ ? it.query : (it.title || it.url)), h('span', { class: 'nv-hs' }, isQ ? 'Pesquisa' : (u.host + u.path))),
                h('time', { class: 'nv-htime' }, time.hhmm(it.at)));
              listEl.appendChild(row);
            }
          };
          body.append(kit.search({ placeholder: 'Pesquisar no histórico', onInput: draw }), listEl);
          draw();
          if (focus) setTimeout(() => listEl.querySelector(`[data-id="${CSS.escape(focus)}"]`)?.scrollIntoView({ block: 'center' }), 280);
        },
      });
    }

    /* ----- subtela: favoritos ----- */
    function openBookmarks() {
      nav.push({
        className: 'nv-screen',
        render: (body) => {
          body.appendChild(kit.appBar({ title: 'Favoritos' }));
          const list = bookmarks();
          if (!list.length) { body.appendChild(kit.empty({ icon: 'bookmark', title: 'Sem favoritos', text: 'Nenhuma página foi favoritada neste aparelho.' })); return; }
          body.appendChild(kit.list(list.map(b => {
            const u = parseUrl(b.url);
            return kit.listItem({
              avatar: h('span', { class: 'nv-hic', style: `--site:${siteColor(u.host)}` }, (siteName(b.title, u.host) || '?').charAt(0).toUpperCase()),
              title: b.title || u.host, subtitle: u.host + u.path,
              trailing: icon('star', { size: 18 }),
              onClick: () => { const pg = pageFor({ url: b.url }); if (pg) { if (pg.tab) game.see('navegador:tab:' + pg.tab.id); openPageScreen(pg); } else offline(); },
            });
          })));
        },
      });
    }

    /* ----- menu (folha inferior) ----- */
    function openMenu() {
      phone.sheet({
        title: 'Opções',
        render: (box, close) => {
          const pinned = cur && game.isPinned('navegador:tab:' + cur.id);
          const item = (ic, label, fn, sub) => h('button', { class: 'nv-mi', on: { click: () => { close(); fn(); } } }, icon(ic, { size: 20 }), h('span', null, label, sub ? h('small', null, sub) : null));
          box.append(h('div', { class: 'nv-menu' },
            item('plus', 'Nova aba', offline),
            item('history', 'Histórico', () => openHistory(), `${history().length} itens`),
            item('bookmark', 'Favoritos', openBookmarks, `${bookmarks().length} páginas`),
            cur ? item(pinned ? 'check' : 'pin', pinned ? 'Página fixada no Quadro (remover)' : 'Fixar página no Quadro', () => {
              if (pinned) game.unpin('navegador:tab:' + cur.id);
              else { game.pin({ key: 'navegador:tab:' + cur.id, label: cur.title, app: 'navegador', detail: cur.url }); phone.toast('Página fixada no Quadro', { icon: 'pin' }); }
            }) : null,
            item('share-2', 'Compartilhar', () => stub('Compartilhar'))));
        },
      });
    }

    /* ----- montagem ----- */
    el.appendChild(h('div', { class: 'nv-root' }, pageBox, bar));
    let start = tabs()[0] || null;
    let unavailable = false;
    if (params.tab) { const t = tabs().find(x => x.id === params.tab); if (t) start = t; else unavailable = true; }
    else if (params.url) {
      const t = tabs().find(x => sameUrl(x.url, params.url));
      if (t) start = t;
      else { const pg = pageFor({ url: params.url }); if (!pg) unavailable = true; }
    }
    showTab(start);
    nav.refresh?.(() => { tabBtn.firstChild.textContent = String(tabs().length); });
    if (unavailable) setTimeout(offline, 320);
    if (params.history) openHistory({ focus: params.history });
  },

  search({ data, game }) {
    const out = [];
    const tabs = (data.tabs || []).filter(t => game.req(t));
    for (const t of tabs) out.push({ title: t.title, text: `${t.url} ${blocksText(t.page)}`, params: { tab: t.id } });
    for (const it of (data.history || []).filter(x => game.req(x))) {
      const t = tabs.find(x => x.id === it.tab) || (it.url && tabs.find(x => sameUrl(x.url, it.url)));
      out.push({
        title: it.query ? `Pesquisa: ${it.query}` : (it.title || it.url),
        text: `${it.query || ''} ${it.title || ''} ${it.url || ''}`.trim(),
        params: t && t.page ? { tab: t.id } : { history: it.id },
        at: it.at,
      });
    }
    for (const b of (data.bookmarks || [])) {
      const bm = typeof b === 'string' ? { title: b, url: b } : b;
      if (!game.req(bm)) continue;
      out.push({ title: `Favorito: ${bm.title || bm.url}`, text: `${bm.title || ''} ${bm.url || ''}`, params: { url: bm.url } });
    }
    return out;
  },
};
