// Chrome — o navegador do aparelho de Iara (dados do aparelho: até sáb 23:47; sem conexão no espelho).
// Visual do Chrome para Android (Material 3, modo escuro): barra de endereço no topo com cadeado, contador de guias e menu de três pontos.
// Raiz: guia ativa (ou Nova guia). Subtelas: grade de guias, Nova guia, histórico, favoritos, página aberta pelo histórico.
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

const OFFLINE = 'Esta página não está disponível na extração (modo avião)';

/* ---------- SVGs ---------- */
function tpl(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
const gLogo = (size = 20) => tpl(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`);
const incognito = (size = 20) => tpl(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="ic" aria-hidden="true"><path d="M2.5 11h19"/><path d="M5 11l1.8-5.6a1 1 0 0 1 1.3-.6L12 6l3.9-1.2a1 1 0 0 1 1.3.6L19 11"/><circle cx="7" cy="16" r="3"/><circle cx="17" cy="16" r="3"/><path d="M10 16c1.3-.8 2.7-.8 4 0"/></svg>`);
const lensIc = (size = 20) => tpl(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="ic" aria-hidden="true"><path d="M4 9V7a3 3 0 0 1 3-3h2"/><path d="M15 4h2a3 3 0 0 1 3 3v2"/><path d="M4 15v2a3 3 0 0 0 3 3h2"/><circle cx="12" cy="12" r="3.2"/><circle cx="18" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg>`);

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
const isGoogle = (host) => /(^|\.)google\.com(\.br)?$/.test(String(host || ''));
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
/** "Hoje - sábado, 10 de outubro de 2026" (como no histórico do Chrome) */
function dayHeader(at, now) {
  const d = time.parse(at);
  const base = `${time.weekdayLong(at)}, ${d.getDate()} de ${time.monthName(d.getMonth())} de ${d.getFullYear()}`;
  const diff = dayDiff(at, now);
  return diff === 0 ? `Hoje - ${base}` : diff === 1 ? `Ontem - ${base}` : base.charAt(0).toUpperCase() + base.slice(1);
}
/** Ícone do site (letra no círculo colorido; "G" para pesquisas do Google). */
function favicon(host, title, size = 20) {
  if (isGoogle(host)) return h('span', { class: 'nv-fav g', style: { width: size + 'px', height: size + 'px' } }, gLogo(Math.round(size * 0.78)));
  return h('span', { class: 'nv-fav', style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.55) + 'px', '--site': siteColor(host) } }, (siteName(title, host) || '?').charAt(0).toUpperCase());
}

/* ---------- a página como site simples (os sites têm tema próprio, claro) ---------- */
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
      h('span', { class: 'nv-sfav' }, name.charAt(0).toUpperCase()),
      h('b', null, name),
      h('span', null, h('i', null, icon('menu', { size: 18 })))),
    h('article', { class: 'nv-article txt' }, nodes),
    h('footer', { class: 'nv-foot' }, `© ${u.host}`));
}

/* ---------- app ---------- */
export default {
  id: 'navegador',
  title: 'Chrome',
  cloud: false,

  render(ctx) {
    const { el, kit, game, phone, data, nav, params = {} } = ctx;
    const NOW = ctx.now || time.MIRROR_NOW;
    const tabs = () => (data.tabs || []).filter(t => game.req(t));
    const history = () => (data.history || []).filter(x => game.req(x));
    const bookmarks = () => (data.bookmarks || []).map((b, i) => (typeof b === 'string' ? { id: `bm${i}`, title: b, url: b } : { id: b.id || `bm${i}`, ...b })).filter(b => game.req(b));
    const stub = (what) => phone.toast(`${what} indisponível na extração`, { icon: 'info' });
    const offline = () => phone.toast(OFFLINE, { icon: 'wifi-off', ms: 3400 });
    const isBookmarked = (url) => bookmarks().some(b => sameUrl(b.url, url));

    /** Página (aba ou histórico) a abrir, ou null. */
    const pageFor = (it) => {
      if (!it) return null;
      if (it.page) return { title: it.page.title || it.title, url: it.url, page: it.page, tab: null };
      const t = tabs().find(x => x.id === it.tab) || (it.url && tabs().find(x => sameUrl(x.url, it.url)));
      return t && t.page ? { title: t.title, url: t.url, page: t.page, tab: t } : null;
    };
    const openUrl = (url) => { const pg = pageFor({ url }); if (pg) { if (pg.tab) game.see('navegador:tab:' + pg.tab.id); openPageScreen(pg); } else offline(); };
    const tapHistory = (it) => {
      game.see('navegador:history:' + it.id);
      if (it.onSee) game.flags([].concat(it.onSee));
      const pg = pageFor(it);
      if (pg) { if (pg.tab) game.see('navegador:tab:' + pg.tab.id); openPageScreen(pg); }
      else offline();
    };

    /* ----- barra de ferramentas (topo) ----- */
    /** pg: {title,url,page,tab} ou null (Nova guia). lead: 'home' | 'back' */
    function toolbar(pg, { lead = 'home', onLead } = {}) {
      const u = pg ? parseUrl(pg.url) : null;
      const leadBtn = h('button', { class: 'nv-tbtn', 'aria-label': lead === 'back' ? 'Voltar' : 'Página inicial', on: { click: () => (onLead ? onLead() : lead === 'back' ? nav.back() : openNtp()) } }, icon(lead === 'back' ? 'arrow-left' : 'house', { size: 22 }));
      const omni = pg
        ? h('button', { class: 'nv-omni', 'aria-label': `Endereço: ${u.host}${u.path}`, on: { click: () => openOmni(pg) } },
          h('span', { class: `nv-omni-ic ${u.proto === 'http' ? 'warn' : ''}` }, icon(u.proto === 'http' ? 'triangle-alert' : 'lock', { size: 16 })),
          h('span', { class: 'nv-omni-t' }, u.proto === 'http' ? h('em', null, 'Não seguro') : null, u.host))
        : h('button', { class: 'nv-omni empty', on: { click: offline } }, h('span', { class: 'nv-omni-ic' }, icon('search', { size: 17 })), h('span', { class: 'nv-omni-t' }, 'Pesquisar ou digitar URL'));
      const count = tabs().length;
      const tabBtn = h('button', { class: 'nv-tabbtn', 'aria-label': `${count} guias abertas`, on: { click: () => openTabs() } }, h('span', null, count > 99 ? '99+' : String(count)));
      const moreBtn = h('button', { class: 'nv-tbtn', 'aria-label': 'Mais opções' }, icon('ellipsis-vertical', { size: 22 }));
      moreBtn.addEventListener('click', () => openMenu(moreBtn, pg));
      return h('header', { class: 'nv-tb' }, leadBtn, omni, tabBtn, moreBtn);
    }

    /* ----- raiz: guia ativa ----- */
    let cur = null;
    const tbSlot = h('div', { class: 'nv-tb-slot' });
    const pageBox = h('div', { class: 'nv-page' });

    function showTab(t, { silent } = {}) {
      cur = t;
      clear(pageBox); clear(tbSlot);
      pageBox.classList.toggle('dark', !t || !t.page);
      if (!t) {
        tbSlot.appendChild(toolbar(null));
        pageBox.appendChild(ntp());
        return;
      }
      tbSlot.appendChild(toolbar({ title: t.title, url: t.url, page: t.page, tab: t }));
      pageBox.appendChild(t.page ? pageDoc(kit, t) : h('div', { class: 'nv-err' }, icon('wifi-off', { size: 44, stroke: 1.5 }), h('h3', null, 'Sem conexão com a internet'), h('p', null, OFFLINE + '.'), h('small', null, 'ERR_INTERNET_DISCONNECTED')));
      pageBox.scrollTop = 0;
      if (!silent) { game.see('navegador:tab:' + t.id); if (t.onSee) game.flags([].concat(t.onSee)); }
      phone.scan(pageBox);
    }

    /* ----- Nova guia (logotipo do Google + atalhos) ----- */
    function shortcuts() {
      const seen = new Map();
      for (const it of history()) {
        if (it.query || !it.url) continue;
        const u = parseUrl(it.url);
        const s = seen.get(u.host) || { host: u.host, url: it.url, title: it.title, n: 0, at: it.at };
        s.n++; if (time.compare(it.at, s.at) >= 0) { s.at = it.at; s.url = it.url; s.title = it.title; }
        seen.set(u.host, s);
      }
      const list = [...seen.values()].sort((a, b) => b.n - a.n || time.compare(b.at, a.at));
      for (const b of bookmarks()) { const u = parseUrl(b.url); if (!list.some(x => x.host === u.host)) list.push({ host: u.host, url: b.url, title: b.title }); }
      return list.slice(0, 8);
    }
    function ntp() {
      const word = 'Google'.split('').map((c, i) => h('span', { class: `c${i}` }, c));
      return h('div', { class: 'nv-ntp' },
        h('div', { class: 'nv-glogo', role: 'img', 'aria-label': 'Google' }, word),
        h('button', { class: 'nv-fake', on: { click: offline } },
          icon('search', { size: 20 }), h('span', null, 'Pesquisar ou digitar URL'),
          h('i', { class: 'nv-fake-ic' }, icon('mic', { size: 20 })), h('i', { class: 'nv-fake-ic' }, lensIc(20))),
        h('div', { class: 'nv-tiles' }, shortcuts().map(s => h('button', { class: 'nv-tile', on: { click: () => openUrl(s.url) } },
          h('span', { class: 'nv-tile-ic' }, favicon(s.host, s.title, 26)),
          h('span', { class: 'nv-tile-t' }, siteName(s.title, s.host))))),
        h('div', { class: 'nv-feed' }, h('b', null, 'Discover'), h('span', null, 'Desativado'), icon('settings', { size: 18 })));
    }
    function openNtp() {
      nav.push({
        className: 'nv-screen',
        render: (body) => {
          body.appendChild(h('div', { class: 'nv-root' }, toolbar(null, { lead: 'back' }), h('div', { class: 'nv-page dark' }, ntp())));
        },
      });
    }

    /* ----- endereço em foco: URL completa + página atual ----- */
    function openOmni(pg) {
      const u = parseUrl(pg.url);
      const close = () => { ov.classList.remove('show'); phone._popModal?.(close); setTimeout(() => ov.remove(), 200); };
      const recent = history().filter(x => x.query).sort((a, b) => time.compare(b.at, a.at)).slice(0, 4);
      const act = (ic, label, what) => h('button', { class: 'nv-oact', on: { click: () => stub(what) } }, icon(ic, { size: 20 }), h('span', null, label));
      const ov = h('div', { class: 'nv-omni-ov', role: 'dialog', 'aria-label': 'Barra de endereço' },
        h('div', { class: 'nv-omni-top' },
          h('button', { class: 'nv-tbtn', 'aria-label': 'Fechar', on: { click: close } }, icon('arrow-left', { size: 22 })),
          h('div', { class: 'nv-omni-edit txt' }, pg.url)),
        h('div', { class: 'nv-ocard' },
          h('div', { class: 'nv-ocard-h' }, favicon(u.host, pg.title, 32),
            h('div', { class: 'nv-ocard-t' }, h('b', { class: 'txt' }, pg.page?.title || pg.title || u.host), h('span', { class: 'txt' }, pg.url))),
          h('div', { class: 'nv-oacts' }, act('share-2', 'Compartilhar', 'Compartilhar'), act('copy', 'Copiar link', 'Copiar link'), act('pencil', 'Editar', 'Editar endereço')),
          h('div', { class: `nv-osec ${u.proto === 'http' ? 'warn' : ''}` }, icon(u.proto === 'http' ? 'triangle-alert' : 'lock', { size: 16 }), u.proto === 'http' ? 'Conexão não segura' : 'A conexão é segura')),
        recent.length ? h('div', { class: 'nv-osug' }, recent.map(it => h('button', { class: 'nv-osug-row', on: { click: () => { close(); tapHistory(it); } } },
          icon('clock', { size: 20 }), h('span', null, it.query), icon('arrow-up-right', { size: 18 })))) : null);
      phone._mountModal(ov, close);
      phone.scan(ov);
      requestAnimationFrame(() => ov.classList.add('show'));
    }

    /* ----- menu de três pontos ----- */
    function openMenu(anchor, pg) {
      const root = anchor.closest('.phone') || document.body;
      const r = anchor.getBoundingClientRect(), pr = root.getBoundingClientRect();
      const close = () => { ov.remove(); phone._popModal?.(close); };
      const run = (fn) => () => { close(); fn(); };
      const tab = pg?.tab || null;
      const pinKey = tab ? 'navegador:tab:' + tab.id : null;
      const pinned = pinKey && game.isPinned(pinKey);
      const starOn = pg && isBookmarked(pg.url);
      const top = (ic, label, fn, { off, on } = {}) => h('button', { class: `nv-picon ${on ? 'on' : ''}`, 'aria-label': label, title: label, disabled: !!off, on: { click: run(fn) } }, ic instanceof Node ? ic : icon(ic, { size: 22 }));
      const item = (ic, label, fn) => h('button', { class: 'nv-pitem', role: 'menuitem', on: { click: run(fn) } }, ic instanceof Node ? ic : icon(ic, { size: 20 }), h('span', null, label));
      const pop = h('div', { class: 'nv-pop', role: 'menu', style: { top: (r.top - pr.top) + 'px', right: Math.max(6, pr.right - r.right) + 'px' } },
        h('div', { class: 'nv-picons' },
          top('arrow-right', 'Avançar', () => {}, { off: true }),
          top('star', starOn ? 'Editar favorito' : 'Adicionar aos favoritos', () => stub('Favoritos'), { off: !pg, on: starOn }),
          top('download', 'Fazer download da página', () => stub('Download'), { off: !pg }),
          top('info', 'Informações da página', () => pg && openOmni(pg), { off: !pg }),
          top('refresh-cw', 'Atualizar', offline, { off: !pg })),
        h('div', { class: 'nv-pdiv' }),
        item('plus', 'Nova guia', openNtp),
        item(incognito(20), 'Nova guia anônima', () => stub('Guia anônima')),
        h('div', { class: 'nv-pdiv' }),
        item('history', 'Histórico', () => openHistory()),
        item('download', 'Downloads', () => phone.open('arquivos', { folder: 'downloads' })),
        item('bookmark', 'Favoritos', openBookmarks),
        item('layers', 'Guias recentes', () => openTabs()),
        tab ? h('div', { class: 'nv-pdiv' }) : null,
        tab ? item(pinned ? 'check' : 'pin', pinned ? 'Remover do Quadro' : 'Fixar no Quadro', () => {
          if (game.isPinned(pinKey)) { game.unpin(pinKey); phone.toast('Página removida do Quadro', { icon: 'pin-off' }); }
          else { game.pin({ key: pinKey, label: tab.title, app: 'navegador', detail: tab.url }); phone.toast('Página fixada no Quadro', { icon: 'pin' }); }
        }) : null,
        h('div', { class: 'nv-pdiv' }),
        pg ? item('share-2', 'Compartilhar...', () => stub('Compartilhar')) : null,
        pg ? item('search', 'Encontrar na página', () => stub('Encontrar na página')) : null,
        item('laptop', 'Versão para computador', () => stub('Versão para computador')),
        item('settings', 'Configurações', () => stub('Configurações')),
        item('circle-help', 'Ajuda e feedback', () => stub('Ajuda')));
      const ov = h('div', { class: 'nv-pop-ov', on: { pointerdown: (e) => { if (e.target === ov) close(); } } }, pop);
      phone._mountModal(ov, close);
      // não deixar o menu passar da borda de baixo
      requestAnimationFrame(() => {
        const ph = pr.height, pb = pop.getBoundingClientRect();
        const maxTop = Math.max(40, ph - (pb.height + 52));
        if (pb.top - pr.top > maxTop) pop.style.top = maxTop + 'px';
        pop.classList.add('show');
      });
    }

    /* ----- subtela: grade de guias ----- */
    function openTabs() {
      nav.push({
        className: 'nv-screen',
        render: (body, n) => {
          const list = tabs();
          const more = h('button', { class: 'nv-tbtn', 'aria-label': 'Mais opções' }, icon('ellipsis-vertical', { size: 22 }));
          more.addEventListener('click', () => kit.menu(more, [
            { icon: 'x', label: 'Fechar todas as guias', onClick: () => phone.toast('Fechar guias está desativado na extração', { icon: 'info' }) },
            { icon: 'list-checks', label: 'Selecionar guias', onClick: () => stub('Selecionar guias') },
            { icon: 'settings', label: 'Configurações', onClick: () => stub('Configurações') },
          ]));
          body.appendChild(h('header', { class: 'nv-sw-top' },
            h('button', { class: 'nv-tbtn', 'aria-label': 'Nova guia', on: { click: () => { n.back(); setTimeout(openNtp, 260); } } }, icon('plus', { size: 24 })),
            h('div', { class: 'nv-seg' },
              h('span', { class: 'nv-seg-b on', 'aria-label': `${list.length} guias` }, h('span', { class: 'nv-tabbtn sm' }, h('span', null, String(list.length)))),
              h('button', { class: 'nv-seg-b', 'aria-label': 'Guias anônimas', on: { click: () => stub('Guias anônimas') } }, incognito(20))),
            more));
          const grid = h('div', { class: 'nv-cards' });
          for (const t of list) {
            const u = parseUrl(t.url);
            const name = siteName(t.title, u.host);
            const img = (t.page?.blocks || []).find(b => b.type === 'img');
            const lines = (t.page?.blocks || []).filter(b => b.type === 'p' || b.type === 'li' || b.type === 'quote').slice(0, 4);
            const thumb = h('div', { class: 'nv-thumb', style: `--site:${siteColor(u.host)}` },
              h('div', { class: 'nv-thumb-h' }, h('i', null, name.charAt(0).toUpperCase()), h('span', null, name)),
              h('div', { class: 'nv-thumb-b' },
                h('b', null, t.page?.title || t.title),
                img ? kit.img(img.src, { alt: '', ratio: '16/9', className: 'nv-thumb-img' }) : null,
                lines.map(l => h('span', null, l.text))));
            const open = () => { showTab(t); n.back(); };
            grid.appendChild(h('div', { class: `nv-card ${cur && cur.id === t.id ? 'on' : ''}` },
              h('div', { class: 'nv-card-h' },
                h('button', { class: 'nv-card-open', 'aria-label': `Abrir guia ${t.title}`, on: { click: open } }, favicon(u.host, t.title, 18), h('span', { class: 'nv-card-t' }, t.title)),
                h('button', { class: 'nv-card-x', 'aria-label': 'Fechar guia', on: { click: () => phone.toast('Fechar guias está desativado na extração', { icon: 'info' }) } }, icon('x', { size: 16 }))),
              h('button', { class: 'nv-card-body', 'aria-hidden': 'true', tabindex: '-1', on: { click: open } }, thumb)));
          }
          body.appendChild(grid);
          if (!list.length) body.appendChild(kit.empty({ icon: 'layers', title: 'Nenhuma guia aberta', text: 'Nenhuma guia estava aberta neste aparelho.' }));
        },
      });
    }

    /* ----- subtela: página aberta pelo histórico/favoritos/atalhos ----- */
    function openPageScreen(pg) {
      nav.push({
        className: 'nv-screen',
        render: (body) => {
          body.appendChild(h('div', { class: 'nv-root' }, toolbar(pg, { lead: 'back' }), h('div', { class: 'nv-page' }, pageDoc(kit, pg))));
        },
      });
    }

    /* ----- subtela: histórico ----- */
    function openHistory({ focus } = {}) {
      nav.push({
        className: 'nv-screen',
        render: (body) => {
          body.appendChild(kit.appBar({ title: 'Histórico', back: false, className: 'nv-bar', actions: [{ icon: 'x', label: 'Fechar', onClick: () => phone.back() }] }));
          const listEl = h('div', { class: 'nv-hist' });
          const draw = (q = '') => {
            clear(listEl);
            const needle = fold(q).trim();
            const items = history().filter(it => !needle || fold(`${it.query || ''} ${it.title || ''} ${it.url || ''}`).includes(needle)).sort((a, b) => time.compare(b.at, a.at));
            if (!needle) listEl.appendChild(h('button', { class: 'nv-clear', on: { click: () => stub('Excluir dados de navegação') } }, icon('trash-2', { size: 20 }), 'Excluir dados de navegação...'));
            if (!items.length) { listEl.appendChild(kit.empty({ icon: 'history', title: 'Nada encontrado', text: needle ? 'Nenhum item corresponde à pesquisa.' : 'O histórico está vazio.' })); return; }
            let last = '', box = null;
            for (const it of items) {
              const day = time.ymd(it.at);
              if (day !== last) {
                box = h('div', { class: 'nv-hday' });
                listEl.append(h('div', { class: 'nv-day' }, dayHeader(it.at, NOW)), box);
                last = day;
              }
              const isQ = !!it.query;
              const u = parseUrl(it.url || '');
              const title = isQ ? `${it.query} - Pesquisa Google` : (it.title || it.url);
              box.appendChild(h('button', { class: `nv-hrow ${focus === it.id ? 'flash' : ''}`, dataset: { id: it.id }, on: { click: () => tapHistory(it) } },
                h('span', { class: 'nv-hic' }, favicon(isQ ? 'google.com' : u.host, it.title, 22)),
                h('span', { class: 'nv-hmain' }, h('span', { class: 'nv-ht' }, title), h('span', { class: 'nv-hs' }, isQ ? 'google.com' : u.host)),
                h('time', { class: 'nv-htime' }, time.hhmm(it.at))));
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
          body.appendChild(kit.appBar({ title: 'Favoritos para dispositivos móveis', className: 'nv-bar', actions: [{ icon: 'search', label: 'Pesquisar', onClick: () => stub('Pesquisar nos favoritos') }] }));
          const list = bookmarks();
          if (!list.length) { body.appendChild(kit.empty({ icon: 'bookmark', title: 'Sem favoritos', text: 'Nenhuma página foi favoritada neste aparelho.' })); return; }
          body.appendChild(h('div', { class: 'nv-bms' }, list.map(b => {
            const u = parseUrl(b.url);
            return h('div', { class: 'nv-bm' },
              h('button', { class: 'nv-bm-open', on: { click: () => openUrl(b.url) } },
                h('span', { class: 'nv-hic' }, favicon(u.host, b.title, 22)),
                h('span', { class: 'nv-hmain' }, h('span', { class: 'nv-ht' }, b.title || u.host), h('span', { class: 'nv-hs' }, u.host + u.path))),
              h('button', { class: 'nv-tbtn sm', 'aria-label': 'Mais opções', on: { click: () => stub('Editar favorito') } }, icon('ellipsis-vertical', { size: 20 })));
          })));
        },
      });
    }

    /* ----- montagem ----- */
    el.appendChild(h('div', { class: 'nv-root' }, tbSlot, pageBox));
    let start = tabs()[0] || null;
    let unavailable = false;
    if (params.tab) { const t = tabs().find(x => x.id === params.tab); if (t) start = t; else unavailable = true; }
    else if (params.url) {
      const t = tabs().find(x => sameUrl(x.url, params.url));
      if (t) start = t;
      else { const pg = pageFor({ url: params.url }); if (!pg) unavailable = true; }
    }
    showTab(start);
    nav.refresh?.(() => { const b = tbSlot.querySelector('.nv-tabbtn span'); if (b) b.textContent = String(tabs().length); });
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
