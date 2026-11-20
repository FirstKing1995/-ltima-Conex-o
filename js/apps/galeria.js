// Fotos (Google Fotos) — grade por dia, Lembranças, Coleções (álbuns, Lixeira, Pasta Trancada) e Pesquisar.
// App do aparelho (cloud:false): mostra o estado até sáb 23:47.
import { h, clear } from '../core/dom.js';
import { icon, ICONS } from '../ui/icons.js';
import { bus } from '../core/bus.js';
import { state, save } from '../core/state.js';
import * as time from '../core/time.js';
import { CASE, asset } from '../core/store.js';
import { sfx } from '../core/sfx.js';

const TABS = [{ id: 'fotos', label: 'Fotos', icon: 'images' }, { id: 'colecoes', label: 'Coleções', icon: 'layout-grid' }, { id: 'pesquisar', label: 'Pesquisar', icon: 'search' }];
// pastas do aparelho (o resto vira "Álbuns")
const DEVICE_FOLDERS = ['camera', 'capturas', 'papo', 'lume'];

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const pad = (n) => String(n).padStart(2, '0');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const byAtDesc = (a, b) => time.compare(b.at, a.at) || String(a.id).localeCompare(String(b.id));
const hasSeconds = (at) => /[T ]\d{2}:\d{2}:\d{2}/.test(String(at || ''));
const isNum = (v) => v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));
const iconOr = (name, fallback) => (name && ICONS[name] ? name : fallback);
const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const dayDiff = (at, now) => {
  const a = time.parse(at), b = time.parse(now);
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
};

/** Cabeçalho de dia como no Google Fotos: "Hoje", "Ontem", "qui., 8 de out." (com o ano se for outro ano). */
function dayTitle(at, now) {
  const dd = dayDiff(at, now);
  if (dd === 0) return 'Hoje';
  if (dd === 1) return 'Ontem';
  const d = time.parse(at);
  const base = `${time.weekday(at).toLowerCase()}., ${d.getDate()} de ${time.monthShort(d.getMonth())}.`;
  return d.getFullYear() === time.parse(now).getFullYear() ? base : `${d.getDate()} de ${time.monthShort(d.getMonth())}. de ${d.getFullYear()}`;
}

/** "sábado, 10 de outubro de 2026" */
const fullDate = (at) => `${time.weekdayLong(at)}, ${time.dateLong(at)}`;

/** Nome de arquivo no padrão do Android. */
function fileName(p) {
  const d = time.parse(p.at);
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const hms = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  if (p.album === 'capturas' || /captura/i.test(p.device || '')) return `Screenshot_${stamp}-${hms}.png`;
  if (p.album === 'papo') return `IMG-${stamp}-WA00${String(p.id).length % 10}.jpg`;
  return `${p.video ? 'VID' : 'IMG'}_${stamp}_${hms}.${p.video ? 'mp4' : 'jpg'}`;
}

const FILE_KIND = {
  pdf: { icon: 'file-text', color: '#f28b82', label: 'PDF' },
  xlsx: { icon: 'file-spreadsheet', color: '#81c995', label: 'Planilha' },
  txt: { icon: 'file-text', color: '#a8c7fa', label: 'Texto' },
  docx: { icon: 'file-text', color: '#8ab4f8', label: 'Documento' },
  m4a: { icon: 'file-audio', color: '#fcad70', label: 'Áudio' },
  jpg: { icon: 'image', color: '#d7aefb', label: 'Imagem' },
};

/** Cata-vento do Google Fotos (4 pétalas). */
const PINWHEEL = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 12V3.2a4.4 4.4 0 0 1 4.4 4.4V12z" fill="#ea4335"/><path d="M12 12h8.8a4.4 4.4 0 0 1-4.4 4.4H12z" fill="#4285f4"/><path d="M12 12v8.8a4.4 4.4 0 0 1-4.4-4.4V12z" fill="#34a853"/><path d="M12 12H3.2a4.4 4.4 0 0 1 4.4-4.4H12z" fill="#fbbc04"/></svg>';

// Os itens com `onSee` ligam flags extras quando a foto é vista.
let hooked = false;
function hookOnSee(game) {
  if (hooked) return;
  hooked = true;
  bus.on('seen', ({ key }) => {
    if (typeof key !== 'string' || !key.startsWith('galeria:photo:')) return;
    const id = key.slice('galeria:photo:'.length);
    const p = (CASE.galeria?.photos || []).find((x) => x.id === id);
    if (p?.onSee?.length) game.flags(p.onSee);
  });
}

export default {
  id: 'galeria',
  title: 'Fotos',
  cloud: false,

  render(ctx) {
    hookOnSee(ctx.game);
    const g = createGallery(ctx);
    g.mountRoot();
    g.handleParams();
  },

  search({ data, game }) {
    const out = [];
    const albums = data.albums || [];
    for (const p of data.photos || []) {
      if (!game.req(p)) continue;
      if (p.album === 'segura' && !game.has('pasta_aberta')) continue; // não vaza o que está trancado
      const where = p.place?.name || '';
      out.push({
        title: where ? `${where} · ${time.hhmm(p.at)}` : `${p.video ? 'Vídeo' : 'Foto'} · ${time.dateShort(p.at)} ${time.hhmm(p.at)}`,
        text: [p.desc, p.caption, where].filter(Boolean).join(' — '),
        params: { photo: p.id },
        at: p.at,
      });
    }
    for (const a of albums) {
      if (a.locked && !game.has('pasta_aberta')) continue;
      out.push({ title: a.name, text: 'Álbum do Google Fotos', params: { album: a.id } });
    }
    return out;
  },
};

function createGallery(ctx) {
  const { el, screen, kit, phone, game, data, params, now } = ctx;
  const albums = data.albums || [];
  const albumById = (id) => albums.find((a) => a.id === id) || null;
  const photoById = (id) => (data.photos || []).find((p) => p.id === id) || null;
  const allPhotos = () => (data.photos || []).filter((p) => game.req(p));
  const inTrash = (p) => p.album === 'lixeira' || !!p.deletedAt;
  const inSafe = (p) => p.album === 'segura' && !inTrash(p);
  const mainPhotos = () => allPhotos().filter((p) => !inTrash(p) && !inSafe(p)).sort(byAtDesc);
  const trashPhotos = () => allPhotos().filter(inTrash).sort((a, b) => time.compare(b.deletedAt || b.at, a.deletedAt || a.at));
  const safePhotos = () => allPhotos().filter(inSafe).sort(byAtDesc);
  const albumPhotos = (id) => allPhotos().filter((p) => !inTrash(p) && !inSafe(p) && p.album === id).sort(byAtDesc);
  const isSpecial = (a) => !!a.locked || a.id === 'lixeira';
  const readonly = () => phone.toast('Extração somente leitura: não é possível alterar as fotos.', { icon: 'lock' });
  const subClass = 'app-galeria gp-sub';

  /* ---------- visualizador (estilo Google Fotos) ---------- */
  function openViewer(list, index) {
    if (!list.length) return;
    let i = Math.max(0, Math.min(index, list.length - 1));
    let scale = 1, tx = 0, ty = 0, chrome = true;

    const imgEl = h('img', { alt: '', draggable: 'false' });
    const stage = h('div', { class: 'gp-vstage' }, imgEl);
    const playBadge = h('span', { class: 'gp-vplay', 'aria-hidden': 'true' }, icon('play', { size: 30 }));
    const counter = h('span', { class: 'gp-vcount' });
    const info = h('div', { class: 'gp-vinfo', role: 'region', 'aria-label': 'Informações da foto' });
    const pinWrap = h('div', { class: 'gp-vpin' });
    const root = h('div', { class: 'gp-viewer', role: 'dialog', 'aria-label': 'Foto' });

    const close = () => { root.remove(); phone._popModal?.(close); };
    const apply = () => { imgEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
    const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };
    const zoomBy = (f) => { scale = Math.min(6, Math.max(1, scale * f)); if (scale === 1) { tx = 0; ty = 0; } apply(); };
    const toggleInfo = (v) => { const on = v ?? !root.classList.contains('info-on'); root.classList.toggle('info-on', on); if (on) info.scrollTop = 0; };

    const fav = h('button', { class: 'gp-vbtn', 'aria-label': 'Favorito', on: { click: readonly } }, icon('heart', { size: 22 }));
    const top = h('div', { class: 'gp-vtop' },
      h('button', { class: 'gp-vbtn', 'aria-label': 'Voltar', on: { click: close } }, icon('arrow-left', { size: 22 })),
      counter,
      h('span', { class: 'sp' }),
      h('button', { class: 'gp-vbtn', 'aria-label': 'Transmitir', on: { click: () => phone.toast('Sem conexão na extração', { icon: 'cast' }) } }, icon('cast', { size: 21 })),
      fav,
      h('button', { class: 'gp-vbtn', 'aria-label': 'Informações', on: { click: () => toggleInfo() } }, icon('info', { size: 22 })));
    const act = (ic, label, fn) => h('button', { class: 'gp-vact', 'aria-label': label, on: { click: fn } }, icon(ic, { size: 22 }), h('span', null, label));
    const bottom = h('div', { class: 'gp-vbottom' },
      pinWrap,
      h('div', { class: 'gp-vacts' },
        act('share-2', 'Compartilhar', readonly),
        act('pencil', 'Editar', readonly),
        act('scan-search', 'Lens', () => toggleInfo(true)),
        act('trash-2', 'Excluir', readonly)));
    const prev = h('button', { class: 'gp-vnav l', 'aria-label': 'Anterior', on: { click: () => go(-1) } }, icon('chevron-left', { size: 22 }));
    const next = h('button', { class: 'gp-vnav r', 'aria-label': 'Próxima', on: { click: () => go(1) } }, icon('chevron-right', { size: 22 }));

    function infoPanel(p) {
      const a = albumById(inTrash(p) ? 'lixeira' : p.album);
      const mp = p.w && p.h ? `${(p.w * p.h / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MP · ${p.w} × ${p.h}` : '';
      const hasGeo = p.place && isNum(p.place.lat) && isNum(p.place.lng);
      const row = (ic, title, sub) => h('div', { class: 'gp-irow' }, h('span', { class: 'ii' }, icon(ic, { size: 20 })), h('div', { class: 'it' }, h('b', { class: 'txt' }, title), sub ? h('small', { class: 'txt' }, sub) : null));
      clear(info).append(
        h('div', { class: 'grab' }),
        h('div', { class: 'gp-ihead' },
          h('b', { class: 'txt' }, cap(fullDate(p.at))),
          h('small', { class: 'txt' }, `${hasSeconds(p.at) ? time.hhmmss(p.at) : time.hhmm(p.at)}${p.video ? ` · vídeo de ${time.duration(p.video.duration)}` : ''}`)),
        h('div', { class: 'gp-icap' + (p.caption ? '' : ' empty') },
          icon('pencil', { size: 16 }),
          h('div', null, h('small', null, 'Descrição'), h('p', { class: 'txt' }, p.caption || 'Nenhuma descrição'))),
        p.desc ? h('div', { class: 'gp-ilens' }, h('small', null, icon('scan-search', { size: 14 }), 'Na imagem'), h('p', { class: 'txt' }, p.desc)) : null,
        h('div', { class: 'gp-isec' }, 'Detalhes'),
        row('image', fileName(p), [mp, a ? `Pasta: ${a.name}` : ''].filter(Boolean).join(' · ')),
        p.device ? row('smartphone', p.device, /moto/i.test(p.device) ? 'Câmera traseira · ƒ/1.8 · 4,8 mm' : '') : null,
        p.deletedAt ? row('trash-2', `Apagada em ${time.dateBR(p.deletedAt)} às ${time.hhmm(p.deletedAt)}`, 'Na Lixeira do aparelho') : null,
        p.place?.name ? row('map-pin', p.place.name, hasGeo ? `${Number(p.place.lat).toFixed(4)}, ${Number(p.place.lng).toFixed(4)}` : 'Local estimado') : null,
        hasGeo ? h('div', { class: 'gp-imap', 'aria-hidden': 'true' }, h('span', { class: 'pin' }, icon('map-pin', { size: 26 }))) : null,
        !p.place?.name ? row('map-pin', 'Sem local', 'O arquivo não tem dados de localização') : null,
        h('p', { class: 'gp-ibackup' }, icon('cloud-upload', { size: 16 }), 'Backup pausado · somente no aparelho'));
    }

    function show() {
      const p = list[i];
      reset();
      stage.querySelector('.k-img')?.remove();
      imgEl.hidden = false;
      imgEl.alt = p.desc || p.place?.name || 'Foto';
      imgEl.onerror = () => { imgEl.hidden = true; stage.appendChild(kit.img(p.src + '#x', { alt: p.desc || p.place?.name || '', className: 'gp-vmiss' })); };
      imgEl.src = asset(p.src);
      playBadge.hidden = !p.video;
      counter.textContent = list.length > 1 ? `${i + 1} de ${list.length}` : '';
      infoPanel(p);
      clear(pinWrap).append(kit.pinButton({ key: 'galeria:photo:' + p.id, label: p.place?.name || (p.video ? 'Vídeo' : 'Foto'), app: 'galeria', detail: `${time.dayLabel(p.at)} · ${time.hhmm(p.at)}` }));
      prev.hidden = i === 0; next.hidden = i === list.length - 1;
      game.see('galeria:photo:' + p.id);
    }
    function go(d) { const n = i + d; if (n < 0 || n >= list.length) return; i = n; sfx.play('tap'); show(); }

    // gestos: arrastar para os lados troca de foto, para cima abre as informações, toque mostra/esconde a barra
    stage.addEventListener('wheel', (e) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
    const pts = new Map();
    let start = null, last = null, lastDist = 0, lastTap = 0, moved = false;
    stage.addEventListener('pointerdown', (e) => {
      stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, e);
      start = last = { x: e.clientX, y: e.clientY }; moved = false;
    });
    stage.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
      if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (lastDist) zoomBy(d / lastDist); lastDist = d; moved = true; return; }
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) moved = true;
      if (scale > 1 && last) { tx += e.clientX - last.x; ty += e.clientY - last.y; apply(); }
      last = { x: e.clientX, y: e.clientY };
    });
    const up = (e) => {
      const wasPinch = pts.size >= 2;
      pts.delete(e.pointerId);
      if (pts.size < 2) lastDist = 0;
      if (wasPinch || !start || e.type === 'pointercancel') { if (!pts.size) start = null; return; }
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      start = null;
      if (scale === 1 && moved) {
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        else if (dy < -60) toggleInfo(true);
        else if (dy > 60) { if (root.classList.contains('info-on')) toggleInfo(false); else close(); }
        return;
      }
      if (moved) return;
      const t = Date.now();
      if (t - lastTap < 280) { if (scale > 1) reset(); else zoomBy(2.2); lastTap = 0; return; }
      lastTap = t;
      setTimeout(() => { if (lastTap === t && scale === 1) { chrome = !chrome; root.classList.toggle('bare', !chrome); } }, 290);
    };
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);

    root.append(stage, playBadge, top, prev, next, bottom, info);
    phone.modal(root, close);
    show();
  }

  /* ---------- peças de grade ---------- */
  function tile(p, onClick, { left } = {}) {
    const where = p.place?.name ? ` · ${p.place.name}` : '';
    return h('button', { class: `gp-tile${p.video ? ' is-video' : ''}`, 'aria-label': `${p.video ? 'Vídeo' : 'Foto'}${where} · ${time.hhmm(p.at)}`, on: { click: onClick } },
      kit.img(p.src, { alt: p.desc || p.place?.name || 'Foto', ratio: '1/1' }),
      p.video ? h('span', { class: 'gp-vid' }, time.duration(p.video.duration), icon('play', { size: 12, stroke: 2.6 })) : null,
      p.album === 'favoritos' && !left ? h('span', { class: 'gp-fav' }, icon('heart', { size: 13, stroke: 2.4 })) : null,
      left ? h('span', { class: 'gp-left' }, left) : null);
  }

  function daySections(list, onOpen, { trash = false } = {}) {
    const wrap = h('div', { class: 'gp-days' });
    let day = null, grid = null;
    list.forEach((p, i) => {
      const ref = trash ? (p.deletedAt || p.at) : p.at;
      const d = time.ymd(ref);
      if (d !== day) {
        day = d;
        wrap.append(h('h3', { class: 'gp-dayhd' }, trash ? `Apagadas · ${dayTitle(ref, now).toLowerCase()}` : dayTitle(ref, now)));
        grid = h('div', { class: 'gp-grid' });
        wrap.append(grid);
      }
      let left = '';
      if (trash) {
        const days = Math.max(0, 30 - Math.floor((time.parse(now) - time.parse(ref)) / 86400000));
        left = days <= 1 ? 'Hoje' : `${days} dias`;
      }
      grid.append(tile(p, () => onOpen(i), { left }));
    });
    return wrap;
  }

  /* ---------- Lembranças ---------- */
  function memoryItems() {
    return (data.memories || [])
      .map((m) => ({ m, p: photoById(m.photo) }))
      .filter((x) => x.p && game.req(x.m) && game.req(x.p) && !inTrash(x.p));
  }

  function memoryTitle(m, p) {
    const years = time.parse(now).getFullYear() - time.parse(p.at).getFullYear();
    return m.title || (years > 0 ? `Há ${plural(years, 'ano', 'anos')}` : 'Lembrança');
  }

  function memoriesRow() {
    const items = memoryItems();
    if (!items.length) return null;
    return h('div', { class: 'gp-mems', role: 'list', 'aria-label': 'Lembranças' }, items.map(({ m, p }) => {
      const title = memoryTitle(m, p);
      return h('button', { class: 'gp-mem', role: 'listitem', 'aria-label': `Lembrança: ${title}`, on: { click: () => openMemory(m, p) } },
        kit.img(p.src, { alt: p.desc || title, ratio: '3/4' }),
        h('span', { class: 'shade' }),
        h('b', { class: 'txt' }, title));
    }));
  }

  /** Lembrança em tela cheia (como as "histórias" do Google Fotos). */
  function openMemory(m, p) {
    const title = memoryTitle(m, p);
    const root = h('div', { class: 'gp-story', role: 'dialog', 'aria-label': `Lembrança: ${title}` });
    const close = () => { root.remove(); phone._popModal?.(close); };
    const pic = kit.img(p.src, { alt: p.desc || title, className: 'gp-story-img', loading: 'eager' });
    root.append(
      pic,
      h('span', { class: 'gp-story-shade' }),
      h('div', { class: 'gp-story-bar' }, h('i')),
      h('div', { class: 'gp-story-top' },
        h('button', { class: 'gp-vbtn', 'aria-label': 'Fechar', on: { click: close } }, icon('x', { size: 22 })),
        h('span', { class: 'sp' }),
        h('button', { class: 'gp-vbtn', 'aria-label': 'Ver foto', on: { click: () => { close(); openViewer([p], 0); } } }, icon('images', { size: 21 }))),
      h('div', { class: 'gp-story-in' },
        h('b', { class: 'txt' }, title),
        h('small', { class: 'txt' }, [time.dateLong(p.at), p.place?.name].filter(Boolean).join(' · ')),
        p.caption ? h('p', { class: 'txt' }, p.caption) : null,
        h('button', { class: 'gp-story-open', on: { click: () => { close(); openViewer([p], 0); } } }, icon('maximize-2', { size: 16 }), 'Abrir a foto')));
    phone.modal(root, close);
    game.see('galeria:photo:' + p.id);
  }

  /* ---------- aba Fotos ---------- */
  function photosView() {
    const list = mainPhotos();
    const wrap = h('div', { class: 'gp-photos' });
    const mem = memoriesRow();
    if (mem) wrap.append(mem);
    if (!list.length) wrap.append(kit.empty({ icon: 'images', title: 'Nenhuma foto', text: 'As fotos e os vídeos do aparelho aparecem aqui.' }));
    else wrap.append(daySections(list, (i) => openViewer(list, i)));
    return wrap;
  }

  /* ---------- aba Coleções ---------- */
  function coverOf(a) {
    const list = a.id === 'lixeira' ? trashPhotos() : albumPhotos(a.id);
    return (a.cover && list.find((p) => p.id === a.cover)) || list[0] || null;
  }

  function albumCount(a) {
    if (a.id === 'lixeira') return trashPhotos().length;
    if (a.locked) return safePhotos().length + safeFiles().length + safeRecs().length;
    return albumPhotos(a.id).length;
  }

  function albumCard(a) {
    const n = albumCount(a);
    const cover = coverOf(a);
    return h('button', { class: 'gp-album', 'aria-label': `${a.name}, ${plural(n, 'item', 'itens')}`, on: { click: () => openAlbum(a) } },
      cover ? kit.img(cover.src, { alt: '', ratio: '1/1' }) : h('span', { class: 'gp-album-empty' }, icon(iconOr(a.icon, 'image'), { size: 30, stroke: 1.6 })),
      h('b', null, a.name),
      h('small', null, plural(n, 'item', 'itens')));
  }

  function shortcut(ic, label, sub, onClick, cls = '') {
    return h('button', { class: `gp-short ${cls}`, on: { click: () => { sfx.play('tap'); onClick(); } } },
      h('span', { class: 'si' }, icon(ic, { size: 20 })),
      h('span', { class: 'st' }, h('b', null, label), sub ? h('small', null, sub) : null));
  }

  function collectionsView() {
    const regular = albums.filter((a) => !isSpecial(a) && game.req(a));
    const device = regular.filter((a) => DEVICE_FOLDERS.includes(a.id));
    const own = regular.filter((a) => !DEVICE_FOLDERS.includes(a.id));
    const safe = albums.find((a) => a.locked);
    const trash = albums.find((a) => a.id === 'lixeira');
    const favs = albumById('favoritos');
    const wrap = h('div', { class: 'gp-coll' });

    const shorts = h('div', { class: 'gp-shorts' },
      favs ? shortcut('heart', 'Favoritos', plural(albumCount(favs), 'item', 'itens'), () => openAlbum(favs)) : shortcut('heart', 'Favoritos', 'Nenhum item', () => phone.toast('Nenhum favorito', { icon: 'heart' })),
      shortcut('archive', 'Arquivo', 'Nenhum item', () => phone.toast('Nada foi arquivado neste aparelho.', { icon: 'archive' })),
      trash ? shortcut('trash-2', 'Lixeira', plural(albumCount(trash), 'item', 'itens'), () => openAlbum(trash), 'trash') : null,
      safe ? shortcut(game.has('pasta_aberta') ? 'lock-open' : 'lock', safe.name || 'Pasta Trancada', game.has('pasta_aberta') ? plural(albumCount(safe), 'item', 'itens') : 'Protegida', () => openAlbum(safe), 'safe') : null);
    wrap.append(shorts);

    if (device.length) {
      wrap.append(h('div', { class: 'gp-chead' }, h('h3', null, 'Fotos no dispositivo')),
        h('div', { class: 'gp-arow' }, device.map(albumCard)));
    }
    if (own.length) {
      wrap.append(h('div', { class: 'gp-chead' }, h('h3', null, 'Álbuns')),
        h('div', { class: 'gp-agrid' }, own.map(albumCard)));
    }
    if (!regular.length && !safe && !trash) wrap.append(kit.empty({ icon: 'folder', title: 'Sem coleções', text: 'Os álbuns do aparelho aparecem aqui.' }));
    wrap.append(h('div', { class: 'gp-chead' }, h('h3', null, 'Utilitários')),
      h('div', { class: 'gp-util' },
        shortcut('sparkles', 'Lembranças', plural(memoryItems().length, 'lembrança', 'lembranças'), () => { const m = memoryItems()[0]; if (m) openMemory(m.m, m.p); else phone.toast('Nenhuma lembrança', { icon: 'sparkles' }); }),
        shortcut('cloud-upload', 'Backup', 'Pausado · sem conexão', () => phone.toast('Backup pausado: o aparelho está em modo avião na extração.', { icon: 'cloud-upload' }))));
    return wrap;
  }

  /* ---------- aba Pesquisar ---------- */
  function searchView() {
    const wrap = h('div', { class: 'gp-search' });
    const results = h('div', { class: 'gp-sres' });
    const browse = h('div', { class: 'gp-browse' });
    const inp = h('input', { type: 'search', placeholder: 'Pesquise nas suas fotos', 'aria-label': 'Pesquise nas suas fotos', autocomplete: 'off', spellcheck: 'false' });
    let tmr = null;
    const run = () => {
      const q = norm(inp.value).trim();
      clear(results);
      browse.hidden = q.length >= 2;
      if (q.length < 2) return;
      const list = mainPhotos().filter((p) => norm([p.desc, p.caption, p.place?.name, dayTitle(p.at, now), time.dateBR(p.at), time.dateLong(p.at), p.video ? 'video' : 'foto'].join(' ')).includes(q));
      results.append(list.length
        ? h('div', null, h('div', { class: 'gp-scount' }, plural(list.length, 'resultado', 'resultados')), daySections(list, (i) => openViewer(list, i)))
        : kit.empty({ icon: 'search', title: 'Nenhum resultado', text: `Nada encontrado para “${inp.value.trim()}”.` }));
      phone.scan(results);
    };
    inp.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(run, 140); });

    // lugares
    const places = new Map();
    for (const p of mainPhotos()) {
      const n = p.place?.name;
      if (!n) continue;
      if (!places.has(n)) places.set(n, []);
      places.get(n).push(p);
    }
    const placeCards = [...places.entries()].sort((a, b) => b[1].length - a[1].length).map(([name, list]) =>
      h('button', { class: 'gp-place', on: { click: () => openList(name, list) } },
        kit.img(list[0].src, { alt: '', ratio: '1/1' }),
        h('span', { class: 'shade' }),
        h('b', { class: 'txt' }, name.split(' · ')[0]),
        h('small', null, plural(list.length, 'item', 'itens'))));
    const vids = mainPhotos().filter((p) => p.video);
    const caps = albumPhotos('capturas');
    browse.append(
      placeCards.length ? h('div', { class: 'gp-chead' }, h('h3', null, 'Lugares')) : null,
      placeCards.length ? h('div', { class: 'gp-places' }, placeCards) : null,
      h('div', { class: 'gp-chead' }, h('h3', null, 'Categorias')),
      h('div', { class: 'gp-cats' },
        shortcut('video', 'Vídeos', plural(vids.length, 'item', 'itens'), () => openList('Vídeos', vids)),
        shortcut('smartphone', 'Capturas de tela', plural(caps.length, 'item', 'itens'), () => openList('Capturas de tela', caps)),
        shortcut('heart', 'Favoritos', plural(albumPhotos('favoritos').length, 'item', 'itens'), () => openList('Favoritos', albumPhotos('favoritos'))),
        shortcut('map-pin', 'Com local', plural(mainPhotos().filter((p) => p.place?.name).length, 'item', 'itens'), () => openList('Fotos com local', mainPhotos().filter((p) => p.place?.name)))));

    wrap.append(h('label', { class: 'gp-sbar' }, icon('search', { size: 20 }), inp, h('span', { class: 'gp-sav', 'aria-hidden': 'true' }, icon('scan-search', { size: 20 }))), browse, results);
    return wrap;
  }

  /* ---------- telas empilhadas ---------- */
  function subHeader(title, sub, actions = []) {
    return h('header', { class: 'gp-subbar' },
      kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
      h('span', { class: 'sp' }),
      ...actions);
  }
  function bigTitle(title, sub) {
    return h('div', { class: 'gp-bigt' }, h('h1', null, title), sub ? h('p', null, sub) : null);
  }

  function openList(title, list) {
    phone.push({
      className: subClass,
      render(body) {
        body.append(subHeader(), bigTitle(title, plural(list.length, 'item', 'itens')),
          list.length ? daySections(list, (i) => openViewer(list, i)) : kit.empty({ icon: 'images', title: 'Nada por aqui', text: 'Nenhum item.' }));
      },
    });
  }

  function openAlbum(a) {
    if (a.locked) return openSafe(a);
    if (a.id === 'lixeira') return openTrash(a);
    const list = albumPhotos(a.id);
    game.see('galeria:album:' + a.id);
    phone.push({
      className: subClass,
      render(body) {
        const range = list.length ? `${time.dateShort(list[list.length - 1].at)} – ${time.dateShort(list[0].at)}` : '';
        body.append(subHeader(null, null, [kit.iconButton({ icon: 'share-2', label: 'Compartilhar', onClick: readonly }), kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: readonly })]),
          bigTitle(a.name, [plural(list.length, 'item', 'itens'), range].filter(Boolean).join(' · ')),
          list.length ? daySections(list, (i) => openViewer(list, i)) : kit.empty({ icon: iconOr(a.icon, 'image'), title: 'Nada por aqui', text: 'Este álbum está vazio.' }));
      },
    });
  }

  function openTrash(a) {
    const list = trashPhotos();
    game.see('galeria:album:' + a.id);
    phone.push({
      className: subClass,
      render(body) {
        body.append(subHeader(null, null, [kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: readonly })]),
          bigTitle(a.name || 'Lixeira', plural(list.length, 'item', 'itens')),
          h('div', { class: 'gp-banner' }, icon('info', { size: 20 }),
            h('div', null, h('b', null, 'Os itens são excluídos permanentemente após 30 dias.'), h('small', null, 'Itens que estão só no aparelho e não têm backup ficam aqui até a exclusão definitiva.'))),
          list.length ? daySections(list, (i) => openViewer(list, i), { trash: true }) : kit.empty({ icon: 'trash-2', title: 'Nenhum item na lixeira', text: 'Nada foi apagado recentemente.' }));
      },
    });
  }

  /* ---------- Pasta Trancada ---------- */
  const safeFiles = () => (CASE.arquivos?.files || []).filter((f) => f.folder === 'segura' && game.req(f));
  const safeRecs = () => (CASE.gravador?.recordings || []).filter((r) => r.folder === 'segura' && game.req(r) && !r.deletedAt);

  function lockArt(name) {
    return h('div', { class: 'gp-lockart' }, h('span', { class: 'ring' }), h('span', { class: 'core' }, icon(name, { size: 38, stroke: 1.7 })));
  }

  function cipherBox() {
    const rows = [0, 1, 2].map(() => h('span'));
    const hex = () => Array.from({ length: 20 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('').replace(/(.{4})/g, '$1 ').trim();
    const fill = () => rows.forEach((r) => { r.textContent = hex(); });
    fill();
    const box = h('div', { class: 'gp-cipher', 'aria-hidden': 'true' }, rows);
    if (!reduceMotion()) {
      const t = setInterval(() => { if (!box.isConnected) clearInterval(t); else fill(); }, 520);
    }
    return box;
  }

  function openSafe(a) {
    const ready = game.has('cap3');
    if (ready) game.see('galeria:album:' + a.id);
    const hint = a.hint || CASE.puzzles?.pasta?.hint || '';
    const name = a.name || 'Pasta Trancada';
    phone.push({
      className: `${subClass} gp-safe-screen`,
      render(body) {
        let unlocking = false;

        const askPassword = async () => {
          await phone.prompt({
            title: name,
            text: 'Digite a senha para desbloquear a pasta.',
            placeholder: 'Senha',
            type: 'password',
            confirmLabel: 'Desbloquear',
            check: async (v) => ((await game.verify('pasta', v)) ? true : 'Senha incorreta'),
          });
        };

        const waiting = () => h('div', { class: 'gp-gate' },
          lockArt('lock'),
          h('h2', null, name),
          h('p', { class: 'msg' }, 'A extração ainda não conseguiu abrir a criptografia desta pasta.'),
          cipherBox(),
          h('small', { class: 'sub' }, 'Conteúdo criptografado · aguardando a chave'));

        const prompt = () => h('div', { class: 'gp-gate' },
          lockArt('lock-keyhole'),
          h('h2', null, name),
          h('p', { class: 'msg' }, 'As fotos e os arquivos desta pasta ficam separados e protegidos por senha. Eles não aparecem na grade de Fotos nem em outros apps.'),
          hint ? h('div', { class: 'gp-hint' }, h('span', { class: 'hi' }, icon('key-round', { size: 18 })), h('div', null, h('small', null, 'Dica da senha'), h('p', { class: 'txt' }, hint))) : null,
          kit.button({ label: 'Desbloquear', icon: 'lock-open', onClick: askPassword }));

        const opened = () => {
          const files = safeFiles(), recs = safeRecs(), photos = safePhotos();
          const wrap = h('div', { class: 'gp-safe' });
          wrap.append(h('div', { class: 'gp-safehead' }, h('span', { class: 'si' }, icon('lock-open', { size: 20 })), h('div', null, h('b', null, `${name} desbloqueada`), h('small', null, `${plural(files.length + recs.length + photos.length, 'item', 'itens')} guardados por Iara`))));
          if (files.length) {
            wrap.append(h('h3', { class: 'gp-dayhd' }, `Arquivos · ${files.length}`),
              h('div', { class: 'gp-safelist' }, kit.list(files.map((f) => {
                const k = FILE_KIND[f.type] || { icon: 'file', color: '#c4c7c5', label: 'Arquivo' };
                return kit.listItem({
                  icon: k.icon, iconColor: k.color, title: f.name,
                  subtitle: [k.label, f.size].filter(Boolean).join(' · '),
                  meta: f.at ? time.dateShort(f.at) : '',
                  onClick: () => phone.open('arquivos', { file: f.id }),
                });
              }))));
          }
          if (recs.length) {
            wrap.append(h('h3', { class: 'gp-dayhd' }, `Gravações · ${recs.length}`),
              h('div', { class: 'gp-safelist' }, kit.list(recs.map((r) => kit.listItem({
                icon: 'mic', iconColor: '#f28b82', title: r.name,
                subtitle: `Gravação · ${time.duration(r.duration)}`,
                meta: r.at ? time.dateShort(r.at) : '',
                onClick: () => phone.open('gravador', { rec: r.id }),
              })))));
          }
          if (photos.length) wrap.append(daySections(photos, (i) => openViewer(photos, i)));
          if (!files.length && !recs.length && !photos.length) wrap.append(kit.empty({ icon: 'folder-open', title: 'Pasta vazia', text: 'Nada foi guardado aqui.' }));
          return wrap;
        };

        const draw = () => {
          clear(body);
          const isOpen = game.has('pasta_aberta');
          const isReady = game.has('cap3');
          body.append(subHeader(), isOpen ? bigTitle(name, 'Desbloqueada') : null, isOpen ? opened() : isReady ? prompt() : waiting());
        };
        draw();

        const off = bus.on('flag', ({ name: flag }) => {
          if (!body.isConnected) { off(); return; }
          if (flag === 'cap3') draw();
          else if (flag === 'pasta_aberta' && !unlocking) {
            unlocking = true;
            game.see('galeria:album:' + a.id);
            const core = body.querySelector('.gp-lockart .core');
            if (core) { clear(core); core.append(icon('lock-open', { size: 38, stroke: 1.7 })); core.parentElement.classList.add('opening'); }
            setTimeout(draw, reduceMotion() ? 0 : 900);
          }
        });
      },
    });
  }

  /* ---------- raiz ---------- */
  function mountRoot() {
    const saved = state.apps?.galeria?.tab;
    let tab = TABS.some((t) => t.id === saved) ? saved : saved === 'albuns' ? 'colecoes' : 'fotos';
    const content = h('div', { class: 'gp-content' });
    const av = ctx.store?.avatarOf ? kit.avatar({ ...ctx.store.avatarOf('iara'), size: 32 }) : kit.avatar({ name: 'Iara Fontenele', size: 32 });
    const top = h('header', { class: 'gp-top' },
      h('div', { class: 'gp-brand' }, h('span', { class: 'logo', html: PINWHEEL }), h('span', null, h('b', null, 'Google'), ' Fotos')),
      kit.iconButton({ icon: 'plus', label: 'Criar', onClick: readonly }),
      h('button', { class: 'gp-me', 'aria-label': 'Conta: backup pausado', on: { click: () => phone.toast('Backup pausado: sem conexão na extração.', { icon: 'cloud-upload' }) } }, av, h('span', { class: 'off' }, icon('cloud-upload', { size: 10, stroke: 3 }))));
    const navBtns = TABS.map((t) => h('button', { class: 'gp-navbtn', role: 'tab', 'aria-label': t.label, on: { click: () => { sfx.play('tap'); setTab(t.id); } } },
      h('span', { class: 'pill' }, icon(t.icon, { size: 22 })), h('span', { class: 'lb' }, t.label)));
    const nav = h('nav', { class: 'gp-nav', role: 'tablist', 'aria-label': 'Seções do Fotos' }, navBtns);

    const draw = () => {
      clear(content);
      content.append(tab === 'colecoes' ? collectionsView() : tab === 'pesquisar' ? searchView() : photosView());
      navBtns.forEach((b, k) => { const on = TABS[k].id === tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
      top.classList.toggle('flat', tab === 'pesquisar');
    };
    function setTab(id) {
      tab = id; draw();
      el.scrollTop = 0;
      state.apps.galeria = { ...(state.apps.galeria || {}), tab: id };
      save();
    }
    el.append(top, content);
    if (screen) screen.appendChild(nav); else el.append(nav);
    draw();
  }

  function handleParams() {
    const { photo, album } = params || {};
    if (album) {
      const a = albumById(album);
      if (a) openAlbum(a);
    } else if (photo) {
      const p = photoById(photo);
      if (!p || !game.req(p)) return;
      if (inSafe(p)) {
        if (!game.has('pasta_aberta')) { const a = albumById('segura'); if (a) openAlbum(a); return; }
        const list = safePhotos();
        openViewer(list, Math.max(0, list.findIndex((x) => x.id === p.id)));
      } else if (inTrash(p)) {
        const list = trashPhotos();
        openViewer(list, Math.max(0, list.findIndex((x) => x.id === p.id)));
      } else {
        const list = mainPhotos();
        openViewer(list, Math.max(0, list.findIndex((x) => x.id === p.id)));
      }
    }
  }

  return { mountRoot, handleParams };
}
