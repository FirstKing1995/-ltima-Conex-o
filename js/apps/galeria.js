// Galeria — fotos, álbuns, lembranças, Lixeira e a Pasta Segura.
// App do aparelho (cloud:false): mostra o estado até sáb 23:47.
import { h, clear } from '../core/dom.js';
import { icon, ICONS } from '../ui/icons.js';
import { bus } from '../core/bus.js';
import { state, save } from '../core/state.js';
import * as time from '../core/time.js';
import { CASE } from '../core/store.js';

const TABS = [{ id: 'fotos', label: 'Fotos' }, { id: 'albuns', label: 'Álbuns' }, { id: 'lembrancas', label: 'Lembranças' }];

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const byAtDesc = (a, b) => time.compare(b.at, a.at) || String(a.id).localeCompare(String(b.id));
const hasSeconds = (at) => /[T ]\d{2}:\d{2}:\d{2}/.test(String(at || ''));
const isNum = (v) => v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));
const iconOr = (name, fallback) => (name && ICONS[name] ? name : fallback);
const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

/** "Sábado, 10 de outubro" (com o ano se for de outro ano). */
function dayTitle(at, now) {
  const d = time.parse(at);
  const base = `${cap(time.weekdayLong(at))}, ${d.getDate()} de ${time.monthName(d.getMonth())}`;
  return d.getFullYear() === time.parse(now).getFullYear() ? base : `${base} de ${d.getFullYear()}`;
}

/** "sábado, 10 de outubro de 2026" */
const fullDate = (at) => `${time.weekdayLong(at)}, ${time.dateLong(at)}`;

const FILE_KIND = {
  pdf: { icon: 'file-text', color: '#d9534f', label: 'PDF' },
  xlsx: { icon: 'file-spreadsheet', color: '#2e9e6a', label: 'Planilha' },
  txt: { icon: 'file-text', color: '#6b7fd6', label: 'Texto' },
  docx: { icon: 'file-text', color: '#4f84f5', label: 'Documento' },
  m4a: { icon: 'file-audio', color: '#e8833a', label: 'Áudio' },
  jpg: { icon: 'image', color: '#9b7be8', label: 'Imagem' },
};

// Os itens com `onSee` ligam flags extras quando a foto é vista (o visualizador do kit só chama game.see).
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
  title: 'Galeria',
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
      out.push({ title: a.name, text: `Álbum da Galeria`, params: { album: a.id } });
    }
    return out;
  },
};

function createGallery(ctx) {
  const { el, kit, phone, game, data, params, now } = ctx;
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

  /* ---------- visualizador ---------- */
  function infoRows(p) {
    const a = albumById(inTrash(p) ? 'lixeira' : p.album);
    return [
      ['Data', fullDate(p.at)],
      ['Hora', hasSeconds(p.at) ? time.hhmmss(p.at) : time.hhmm(p.at)],
      p.place?.name ? ['Local', p.place.name] : null,
      p.place && isNum(p.place.lat) && isNum(p.place.lng) ? ['Coordenadas', `${Number(p.place.lat).toFixed(4)}, ${Number(p.place.lng).toFixed(4)}`] : null,
      p.device ? ['Aparelho', p.device] : null,
      p.w && p.h ? ['Dimensões', `${p.w} × ${p.h}`] : null,
      p.video ? ['Duração', time.duration(p.video.duration)] : null,
      a ? ['Álbum', a.name] : null,
      p.deletedAt ? ['Apagada em', `${time.dateBR(p.deletedAt)} às ${time.hhmm(p.deletedAt)}`] : null,
      p.caption ? ['Legenda', p.caption] : null,
    ].filter(Boolean);
  }

  function viewerItem(p) {
    return {
      src: p.src,
      title: p.place?.name || (p.video ? 'Vídeo' : 'Foto'),
      subtitle: `${time.dayLabel(p.at)} · ${time.hhmm(p.at)}${p.video ? ` · vídeo ${time.duration(p.video.duration)}` : ''}`,
      desc: p.desc || '',
      info: infoRows(p),
      key: 'galeria:photo:' + p.id,
    };
  }

  function openViewer(list, index) {
    if (!list.length) return;
    kit.imageViewer(list.map(viewerItem), index);
    const p = list[index];
    if (p) game.see('galeria:photo:' + p.id);
  }

  /* ---------- peças de grade ---------- */
  function tile(p, onClick) {
    const where = p.place?.name ? ` · ${p.place.name}` : '';
    return h('button', { class: `gl-tile${p.video ? ' is-video' : ''}`, 'aria-label': `${p.video ? 'Vídeo' : 'Foto'}${where} · ${time.hhmm(p.at)}`, on: { click: onClick } },
      kit.img(p.src, { alt: p.desc || p.place?.name || 'Foto', ratio: '1/1' }),
      p.video ? h('span', { class: 'gl-vid' }, icon('play', { size: 11, stroke: 2.6 }), time.duration(p.video.duration)) : null);
  }

  function daySections(list, onOpen) {
    const wrap = h('div', { class: 'gl-days' });
    let day = null, grid = null;
    list.forEach((p, i) => {
      const d = time.ymd(p.at);
      if (d !== day) {
        day = d;
        wrap.append(h('h3', { class: 'gl-dayhd' }, dayTitle(p.at, now)));
        grid = h('div', { class: 'gl-grid' });
        wrap.append(grid);
      }
      grid.append(tile(p, () => onOpen(i)));
    });
    return wrap;
  }

  /* ---------- abas ---------- */
  function countLabel() {
    const list = mainPhotos();
    const vids = list.filter((p) => p.video).length;
    const pics = list.length - vids;
    if (!list.length) return 'Nenhuma foto';
    return vids ? `${plural(pics, 'foto', 'fotos')} e ${plural(vids, 'vídeo', 'vídeos')}` : plural(pics, 'foto', 'fotos');
  }

  function photosView() {
    const list = mainPhotos();
    if (!list.length) return kit.empty({ icon: 'images', title: 'Nenhuma foto', text: 'As fotos e os vídeos do aparelho aparecem aqui.' });
    return daySections(list, (i) => openViewer(list, i));
  }

  function memoriesView() {
    const items = (data.memories || [])
      .map((m) => ({ m, p: photoById(m.photo) }))
      .filter((x) => x.p && game.req(x.m) && game.req(x.p) && !inTrash(x.p));
    if (!items.length) return kit.empty({ icon: 'sparkles', title: 'Sem lembranças ainda', text: 'Quando houver fotos antigas, elas voltam por aqui.' });
    const list = items.map((x) => x.p);
    return h('div', { class: 'gl-memories' }, items.map(({ m, p }, i) => {
      const years = time.parse(now).getFullYear() - time.parse(p.at).getFullYear();
      const title = m.title || (years > 0 ? `Há ${plural(years, 'ano', 'anos')}` : 'Lembrança');
      const sub = [time.dateLong(p.at), p.place?.name].filter(Boolean).join(' · ');
      return h('button', { class: 'gl-memory', 'aria-label': `${title}. ${sub}`, on: { click: () => openViewer(list, i) } },
        kit.img(p.src, { alt: p.desc || title, ratio: '4/5' }),
        h('span', { class: 'gl-memory-shade' }),
        h('span', { class: 'gl-memory-chip' }, icon('sparkles', { size: 13 }), 'Lembrança'),
        h('span', { class: 'gl-memory-in' }, h('b', null, title), h('small', null, sub)));
    }));
  }

  function coverOf(a) {
    const list = a.id === 'lixeira' ? trashPhotos() : albumPhotos(a.id);
    return (a.cover && list.find((p) => p.id === a.cover)) || list[0] || null;
  }

  function albumCount(a) {
    if (a.id === 'lixeira') return trashPhotos().length;
    if (a.locked) return safePhotos().length + safeFiles().length + safeRecs().length;
    return albumPhotos(a.id).length;
  }

  function albumCard(a, { wide = false } = {}) {
    const n = albumCount(a);
    const cover = coverOf(a);
    const media = cover ? kit.img(cover.src, { alt: '', ratio: wide ? '2/1' : '1/1' })
      : h('span', { class: 'gl-album-empty', style: { aspectRatio: wide ? '2/1' : '1/1' } }, icon(iconOr(a.icon, 'image'), { size: 34, stroke: 1.5 }));
    return h('button', { class: `gl-album${wide ? ' wide' : ''}`, 'aria-label': `${a.name}, ${plural(n, 'item', 'itens')}`, on: { click: () => openAlbum(a) } },
      media,
      h('span', { class: 'gl-album-shade' }),
      h('span', { class: 'gl-album-meta' }, h('b', null, a.name), h('small', null, plural(n, 'item', 'itens'))));
  }

  function specialCard(a) {
    if (a.locked) {
      const opened = game.has('pasta_aberta');
      const ready = game.has('cap3');
      return h('button', { class: `gl-album gl-card-safe${opened ? ' is-open' : ''}`, 'aria-label': `${a.name}, ${opened ? 'aberta' : 'bloqueada'}`, on: { click: () => openAlbum(a) } },
        h('span', { class: 'gl-special-bg' }, icon(opened ? 'lock-open' : 'lock', { size: 38, stroke: 1.5 })),
        h('span', { class: 'gl-album-meta' }, h('b', null, a.name), h('small', null, opened ? plural(albumCount(a), 'item', 'itens') : ready ? 'Protegida por senha' : 'Bloqueada')));
    }
    const n = albumCount(a);
    return h('button', { class: 'gl-album gl-card-trash', 'aria-label': `${a.name}, ${plural(n, 'item', 'itens')}`, on: { click: () => openAlbum(a) } },
      h('span', { class: 'gl-special-bg' }, icon('trash-2', { size: 36, stroke: 1.5 })),
      h('span', { class: 'gl-album-meta' }, h('b', null, a.name), h('small', null, plural(n, 'item', 'itens'))));
  }

  function albumsView() {
    const regular = albums.filter((a) => !isSpecial(a) && game.req(a));
    const special = albums.filter((a) => isSpecial(a) && (a.locked || game.req(a)));
    const wrap = h('div', { class: 'gl-albums' });
    if (!regular.length && !special.length) return kit.empty({ icon: 'folder', title: 'Sem álbuns', text: 'Os álbuns do aparelho aparecem aqui.' });
    if (regular.length) {
      const wideFirst = regular.length % 2 === 1;
      wrap.append(kit.sectionTitle('Álbuns do aparelho'),
        h('div', { class: 'gl-agrid' }, regular.map((a, i) => albumCard(a, { wide: wideFirst && i === 0 }))));
    }
    if (special.length) wrap.append(kit.sectionTitle('Privado e lixeira'), h('div', { class: 'gl-agrid' }, special.map(specialCard)));
    return wrap;
  }

  /* ---------- álbuns ---------- */
  function openAlbum(a) {
    if (a.locked) return openSafe(a);
    if (a.id === 'lixeira') return openTrash(a);
    const list = albumPhotos(a.id);
    game.see('galeria:album:' + a.id);
    phone.push({
      className: 'gl-sub',
      render(body) {
        body.append(kit.appBar({ title: a.name, subtitle: plural(list.length, 'item', 'itens') }),
          list.length ? daySections(list, (i) => openViewer(list, i)) : kit.empty({ icon: iconOr(a.icon, 'image'), title: 'Nada por aqui', text: 'Este álbum está vazio.' }));
      },
    });
  }

  function openTrash(a) {
    const list = trashPhotos();
    game.see('galeria:album:' + a.id);
    phone.push({
      className: 'gl-sub',
      render(body) {
        const cells = list.map((p, i) => {
          const when = p.deletedAt || p.at;
          const left = Math.max(0, 30 - Math.floor((time.parse(now) - time.parse(when)) / 86400000));
          return h('button', { class: 'gl-tcell', on: { click: () => openViewer(list, i) }, 'aria-label': `Foto apagada em ${time.dateBR(when)} às ${time.hhmm(when)}` },
            h('span', { class: 'gl-tthumb' }, kit.img(p.src, { alt: p.desc || 'Foto apagada', ratio: '1/1' }), p.video ? h('span', { class: 'gl-vid' }, icon('play', { size: 11, stroke: 2.6 }), time.duration(p.video.duration)) : null),
            h('span', { class: 'gl-tinfo' },
              h('b', null, icon('trash-2', { size: 13 }), `Apagada ${time.dayLabel(when)} · ${time.hhmm(when)}`),
              h('small', null, left <= 1 ? 'Exclusão definitiva hoje' : `Exclusão definitiva em ${left} dias`)));
        });
        body.append(kit.appBar({ title: a.name || 'Lixeira', subtitle: plural(list.length, 'item', 'itens') }),
          h('div', { class: 'gl-banner' }, icon('info', { size: 20 }),
            h('div', null, h('b', null, 'Itens apagados ficam aqui por 30 dias.'), h('small', null, 'Depois desse prazo, eles são excluídos para sempre.'))),
          list.length ? h('div', { class: 'gl-tgrid' }, cells) : kit.empty({ icon: 'trash-2', title: 'A lixeira está vazia', text: 'Nada foi apagado recentemente.' }));
      },
    });
  }

  /* ---------- Pasta Segura ---------- */
  const safeFiles = () => (CASE.arquivos?.files || []).filter((f) => f.folder === 'segura' && game.req(f));
  const safeRecs = () => (CASE.gravador?.recordings || []).filter((r) => r.folder === 'segura' && game.req(r) && !r.deletedAt);

  function lockArt(name) {
    const art = h('div', { class: 'gl-lockart' }, h('span', { class: 'gl-lockring' }), h('span', { class: 'gl-lockring r2' }), h('span', { class: 'gl-lockcore' }, icon(name, { size: 40, stroke: 1.6 })));
    return art;
  }

  function cipherBox() {
    const rows = [0, 1, 2].map(() => h('span'));
    const hex = () => Array.from({ length: 22 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('').replace(/(.{4})/g, '$1 ').trim();
    const fill = () => rows.forEach((r) => { r.textContent = hex(); });
    fill();
    const box = h('div', { class: 'gl-cipher', 'aria-hidden': 'true' }, rows);
    if (!reduceMotion()) {
      const t = setInterval(() => { if (!box.isConnected) clearInterval(t); else fill(); }, 520);
    }
    return box;
  }

  function openSafe(a) {
    const ready = game.has('cap3');
    if (ready) game.see('galeria:album:' + a.id);
    const hint = a.hint || CASE.puzzles?.pasta?.hint || '';
    phone.push({
      className: 'gl-sub gl-safe-screen',
      render(body) {
        let unlocking = false;

        const askPassword = async () => {
          await phone.prompt({
            title: 'Pasta Segura',
            text: 'Digite a senha para abrir este álbum.',
            placeholder: 'Senha',
            type: 'password',
            confirmLabel: 'Abrir',
            check: async (v) => ((await game.verify('pasta', v)) ? true : 'Senha incorreta'),
          });
        };

        const waiting = () => h('div', { class: 'gl-gate' },
          lockArt('lock'),
          h('h2', null, 'Pasta Segura'),
          h('p', { class: 'gl-gate-msg' }, 'O ECO ainda está quebrando a criptografia deste álbum.'),
          cipherBox(),
          h('small', { class: 'gl-gate-sub' }, 'Conteúdo criptografado · aguardando a chave'));

        const prompt = () => h('div', { class: 'gl-gate' },
          lockArt('lock-keyhole'),
          h('h2', null, 'Pasta Segura'),
          h('p', { class: 'gl-gate-msg' }, 'Este álbum está protegido por senha.'),
          hint ? h('div', { class: 'gl-hint' }, h('small', null, 'Dica da senha'), h('p', { class: 'txt' }, hint)) : null,
          kit.button({ label: 'Digitar senha', icon: 'key-round', onClick: askPassword }));

        const opened = () => {
          const files = safeFiles(), recs = safeRecs(), photos = safePhotos();
          const wrap = h('div', { class: 'gl-safe' });
          wrap.append(h('div', { class: 'gl-safehead' }, h('span', { class: 'gl-safeico' }, icon('lock-open', { size: 20 })), h('div', null, h('b', null, 'Pasta Segura aberta'), h('small', null, `${plural(files.length + recs.length + photos.length, 'item', 'itens')} guardados por Iara`))));
          if (files.length) {
            wrap.append(kit.sectionTitle(`Arquivos · ${files.length}`),
              kit.list(files.map((f) => {
                const k = FILE_KIND[f.type] || { icon: 'file', color: '#6b7078', label: 'Arquivo' };
                return kit.listItem({
                  icon: k.icon, iconColor: k.color, title: f.name,
                  subtitle: [k.label, f.size].filter(Boolean).join(' · '),
                  meta: f.at ? time.dateShort(f.at) : '',
                  onClick: () => phone.open('arquivos', { file: f.id }),
                });
              })));
          }
          if (recs.length) {
            wrap.append(kit.sectionTitle(`Gravações · ${recs.length}`),
              kit.list(recs.map((r) => kit.listItem({
                icon: 'mic', iconColor: '#e5603f', title: r.name,
                subtitle: `Gravação · ${time.duration(r.duration)}`,
                meta: r.at ? time.dateShort(r.at) : '',
                onClick: () => phone.open('gravador', { rec: r.id }),
              }))));
          }
          if (photos.length) {
            wrap.append(kit.sectionTitle(`Fotos · ${photos.length}`), daySections(photos, (i) => openViewer(photos, i)));
          }
          if (!files.length && !recs.length && !photos.length) wrap.append(kit.empty({ icon: 'folder-open', title: 'Pasta vazia', text: 'Nada foi guardado aqui.' }));
          return wrap;
        };

        const draw = () => {
          clear(body);
          const isOpen = game.has('pasta_aberta');
          const isReady = game.has('cap3');
          body.append(kit.appBar({ title: a.name || 'Pasta Segura', subtitle: isOpen ? 'Aberta' : isReady ? 'Protegida por senha' : 'Bloqueada' }),
            isOpen ? opened() : isReady ? prompt() : waiting());
        };
        draw();

        const off = bus.on('flag', ({ name }) => {
          if (!body.isConnected) { off(); return; }
          if (name === 'cap3') draw();
          else if (name === 'pasta_aberta' && !unlocking) {
            unlocking = true;
            game.see('galeria:album:' + a.id);
            const core = body.querySelector('.gl-lockcore');
            if (core) { clear(core); core.append(icon('lock-open', { size: 40, stroke: 1.6 })); core.parentElement.classList.add('opening'); }
            setTimeout(draw, reduceMotion() ? 0 : 900);
          }
        });
      },
    });
  }

  /* ---------- raiz ---------- */
  function mountRoot() {
    const saved = state.apps?.galeria?.tab;
    let tab = TABS.some((t) => t.id === saved) ? saved : 'fotos';
    const content = h('div', { class: 'gl-content' });
    const draw = () => {
      clear(content);
      content.append(tab === 'albuns' ? albumsView() : tab === 'lembrancas' ? memoriesView() : photosView());
    };
    el.append(
      kit.appBar({ title: 'Galeria', subtitle: countLabel() }),
      kit.tabs({
        items: TABS, active: tab,
        onChange: (id) => {
          tab = id; draw();
          el.scrollTop = 0;
          state.apps.galeria = { ...(state.apps.galeria || {}), tab: id };
          save();
        },
      }),
      content);
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
