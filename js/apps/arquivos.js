// Arquivos — o gerenciador de arquivos do aparelho de Iara (dados do aparelho: até sáb 23:47).
// Raiz: pastas + recentes. Subtelas: pasta, Pasta Segura (3 estados) e visualizador (PDF, planilha, texto, áudio, imagem).
import { h, clear } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { bus } from '../core/bus.js';

/* ---------- constantes ---------- */
const FOLDERS = [
  { id: 'downloads', label: 'Downloads', icon: 'download', tone: 'blue' },
  { id: 'documentos', label: 'Documentos', icon: 'file-text', tone: 'gold' },
  { id: 'segura', label: 'Pasta Segura', icon: 'folder-lock', tone: 'vault' },
];

const TYPES = {
  pdf: { icon: 'file-text', color: '#ef6a5f', label: 'PDF' },
  docx: { icon: 'file-text', color: '#5b93ee', label: 'Documento' },
  xlsx: { icon: 'file-spreadsheet', color: '#46b974', label: 'Planilha' },
  txt: { icon: 'file-text', color: '#a9afb8', label: 'Texto' },
  m4a: { icon: 'file-audio', color: '#f39a4a', label: 'Áudio' },
  jpg: { icon: 'image', color: '#a78bfa', label: 'Imagem' },
};
const typeOf = (f) => TYPES[String(f.type || '').toLowerCase()] || { icon: 'file', color: '#9aa0a6', label: String(f.type || 'Arquivo').toUpperCase() };
const extOf = (f) => String(f.type || f.name?.split('.').pop() || '').toLowerCase();

/* ---------- utilitários de dados ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const folderKey = (f) => {
  const n = fold(f.folder);
  if (n.startsWith('seg')) return 'segura';
  if (n.startsWith('down')) return 'downloads';
  if (n.startsWith('doc')) return 'documentos';
  return n || 'documentos';
};
const folderInfo = (key) => FOLDERS.find(f => f.id === key) || { id: key, label: key.charAt(0).toUpperCase() + key.slice(1), icon: 'folder', tone: 'gold' };
const cellText = (c) => (c && typeof c === 'object' ? (c.v ?? c.text ?? '') : (c ?? ''));

function fileSize(s) {
  if (s === undefined || s === null || s === '') return '';
  if (typeof s === 'string' && !/^\d+$/.test(s)) return s;
  const n = Number(s);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0).replace('.', ',')} kB`;
  return `${(n / 1048576).toFixed(1).replace('.', ',')} MB`;
}

function fileDate(at, now) {
  if (!at) return '';
  const d = time.parse(at), n = time.parse(now);
  if (d.toDateString() === n.toDateString()) return `Hoje, ${time.hhmm(at)}`;
  const base = `${d.getDate()} de ${time.monthShort(d.getMonth())}.`;
  return d.getFullYear() === n.getFullYear() ? base : `${base} de ${d.getFullYear()}`;
}

/** Páginas do arquivo: [{blocks:[...]}] — aceita pages, blocks ou text. */
function pagesOf(f) {
  if (Array.isArray(f.pages) && f.pages.length) return f.pages.map(p => (Array.isArray(p) ? { blocks: p } : p));
  if (Array.isArray(f.blocks)) return [{ blocks: f.blocks }];
  const txt = typeof f.text === 'string' ? f.text : typeof f.content === 'string' ? f.content : null;
  if (txt) return [{ blocks: txt.split(/\n{2,}/).map(t => ({ type: 'p', text: t })) }];
  return [];
}

function blocksText(blocks) {
  return (blocks || []).map(b => {
    if (b.type === 'table') return (b.rows || []).map(r => (r || []).map(cellText).join(' ')).join(' ');
    if (b.type === 'sign') return [b.text, b.role].filter(Boolean).join(' ');
    return b.text || '';
  }).join(' ');
}
const fileText = (f) => {
  const parts = [pagesOf(f).map(p => blocksText(p.blocks)).join(' ')];
  if (f.sheets) parts.push(f.sheets.map(s => (s.rows || []).map(r => r.map(cellText).join(' ')).join(' ')).join(' '));
  if (Array.isArray(f.rows)) parts.push(f.rows.map(r => r.map(cellText).join(' ')).join(' '));
  if (typeof f.text === 'string') parts.push(f.text);
  if (Array.isArray(f.transcript)) parts.push(f.transcript.map(l => l.text).join(' '));
  return parts.join(' ').replace(/\s+/g, ' ').trim();
};

/** Texto plano (visualizador .txt). */
function plainText(f) {
  if (typeof f.text === 'string') return f.text;
  if (typeof f.content === 'string') return f.content;
  const out = [];
  let prevLi = false;
  for (const p of pagesOf(f)) for (const b of (p.blocks || [])) {
    if (b.type === 'li') { out.push((prevLi ? '' : '\n') + '- ' + b.text); prevLi = true; continue; }
    prevLi = false;
    if (b.type === 'table') out.push((b.rows || []).map(r => (r || []).map(cellText).join('   ')).join('\n'));
    else if (b.type === 'sep') out.push('----------------------------------------');
    else if (b.text) out.push(b.text);
  }
  return out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Planilhas do arquivo: [{name, rows}] */
function sheetsOf(f) {
  if (Array.isArray(f.sheets) && f.sheets.length) return f.sheets.map((s, i) => ({ name: s.name || `Planilha${i + 1}`, rows: s.rows || [] }));
  if (Array.isArray(f.rows)) return [{ name: f.sheet || 'Planilha1', rows: f.rows }];
  const out = [];
  let lastHead = '';
  for (const p of pagesOf(f)) for (const b of (p.blocks || [])) {
    if (b.type === 'h1' || b.type === 'h2') lastHead = b.text;
    if (b.type === 'table') out.push({ name: lastHead && out.length ? lastHead : `Planilha${out.length + 1}`, rows: b.rows || [], header: b.header });
  }
  return out;
}

/** Resumo curto para o Quadro: trecho marcado > linha de total > primeiro parágrafo. */
function fileDetail(f) {
  const clip = (s, n = 200) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  if (extOf(f) === 'xlsx') {
    for (const sh of sheetsOf(f)) for (const r of sh.rows) if (/^\s*total/i.test(String(cellText(r[0])))) return clip(r.map(cellText).filter(Boolean).join(' · '));
  }
  const blocks = pagesOf(f).flatMap(p => p.blocks || []);
  const hl = blocks.find(b => b.type === 'highlight' && b.text);
  if (hl) return clip(hl.text);
  const p = blocks.find(b => b.type === 'p' && b.text);
  if (p) return clip(p.text, 150);
  return `${typeOf(f).label} · ${folderInfo(folderKey(f)).label}`;
}

/** **negrito** e ==marca-texto== dentro de um texto. */
function rich(text) {
  const parts = String(text ?? '').split(/(\*\*[^*]+\*\*|==[^=]+==)/g).filter(s => s !== '');
  return parts.map(s => {
    if (s.startsWith('**') && s.endsWith('**') && s.length > 4) return h('strong', null, s.slice(2, -2));
    if (s.startsWith('==') && s.endsWith('==') && s.length > 4) return h('span', { class: 'ar-hl' }, s.slice(2, -2));
    return s;
  });
}

const isNumeric = (t) => /^[\s\-−+]*(R\$\s*)?[\d.,]+\s*(%|kg|m²|ha)?\s*$/.test(String(t)) && /\d/.test(String(t));

/* ---------- app ---------- */
export default {
  id: 'arquivos',
  title: 'Arquivos',
  cloud: false,

  render(ctx) {
    const { el, kit, game, phone, data, nav, params = {} } = ctx;
    const NOW = ctx.now || time.MIRROR_NOW;
    const files = () => (data.files || []).filter(f => game.req(f));
    const segOpen = () => game.has('pasta_aberta');
    const shown = () => files().filter(f => folderKey(f) !== 'segura' || segOpen());
    const inFolder = (key) => files().filter(f => folderKey(f) === key).sort((a, b) => time.compare(b.at, a.at));
    const goSeen = (f) => {
      game.see('arquivos:file:' + f.id);
      if (f.onSee) game.flags([].concat(f.onSee));
    };

    /* ----- linha de arquivo ----- */
    const fileRow = (f, { sub } = {}) => {
      const t = typeOf(f);
      const tile = h('div', { class: 'ar-ft', style: `--ft:${t.color}` }, icon(t.icon, { size: 20 }), h('b', null, extOf(f).toUpperCase().slice(0, 4)));
      return kit.listItem({
        avatar: tile,
        title: f.name,
        subtitle: sub ?? [fileSize(f.size), fileDate(f.at, NOW)].filter(Boolean).join(' · '),
        onClick: () => openFile(f),
        className: 'ar-row',
      });
    };

    /* ----- pasta ----- */
    function openFolder(key) {
      nav.push({
        className: 'ar-screen',
        render: (body, n) => {
          const draw = () => {
            clear(body);
            if (key === 'segura' && (!game.has('cap3') || !segOpen())) return drawLocked(body, n, draw);
            const info = folderInfo(key);
            const list = inFolder(key);
            body.appendChild(kit.appBar({ title: info.label, subtitle: `${list.length} ${list.length === 1 ? 'arquivo' : 'arquivos'}` }));
            if (key === 'segura') body.appendChild(h('div', { class: 'ar-vault-note' }, icon('lock-open', { size: 15 }), 'Pasta aberta — conteúdo criptografado neste aparelho'));
            if (!list.length) body.appendChild(kit.empty({ icon: 'folder-open', title: 'Pasta vazia', text: 'Nenhum arquivo por aqui.' }));
            else body.appendChild(kit.list(list.map(f => fileRow(f))));
            phone.scan(body);
          };
          draw();
          // se o estado mudar enquanto a pasta está aberta (ECO libera / senha), redesenha
          const off = bus.on('flag', ({ name }) => { if (!body.isConnected) return off(); if (name === 'cap3' || name === 'pasta_aberta') draw(); });
        },
      });
    }

    /* ----- Pasta Segura trancada ----- */
    function drawLocked(body, n, redraw) {
      body.appendChild(kit.appBar({ title: 'Pasta Segura', subtitle: 'Criptografada' }));
      const hint = ctx.store.CASE.puzzles?.pasta?.hint || 'meu primeiro amor + o ano em que tudo começou';
      if (!game.has('cap3')) {
        body.appendChild(h('div', { class: 'ar-locked' },
          h('div', { class: 'ar-lockring wait' }, icon('lock', { size: 38, stroke: 1.6 })),
          h('h3', null, 'Pasta Segura'),
          h('p', { class: 'txt' }, 'O ECO ainda está quebrando a criptografia desta pasta.'),
          h('div', { class: 'ar-crack', 'aria-hidden': 'true' }, h('i')),
          h('small', null, 'Isso pode levar algum tempo. Continue investigando.')));
        return;
      }
      const unlock = async () => {
        const v = await phone.prompt({
          title: 'Pasta Segura', text: 'Digite a senha para abrir a pasta.', placeholder: 'Senha', type: 'password', confirmLabel: 'Abrir',
          check: async (val) => (await game.verify('pasta', val)) || 'Senha incorreta',
        });
        if (v !== null && v !== undefined) {
          phone.toast('Pasta Segura aberta', { icon: 'lock-open' });
          redraw();
          refreshRoot();
        }
      };
      body.appendChild(h('div', { class: 'ar-locked' },
        h('div', { class: 'ar-lockring' }, icon('lock-keyhole', { size: 38, stroke: 1.6 })),
        h('h3', null, 'Pasta protegida por senha'),
        h('p', null, 'Só quem sabe a senha entra. A dica foi deixada pela própria dona:'),
        h('blockquote', { class: 'ar-hint txt' }, icon('key-round', { size: 16 }), h('span', null, hint)),
        kit.button({ label: 'Digitar senha', icon: 'lock-open', onClick: unlock })));
    }

    /* ----- visualizador ----- */
    function openFile(f) {
      if (!game.req(f)) { phone.toast('Arquivo indisponível', { icon: 'file' }); return; }
      if (folderKey(f) === 'segura' && (!game.has('cap3') || !segOpen())) { openFolder('segura'); return; }
      const ext = extOf(f);
      goSeen(f);
      if (ext === 'm4a' && (f.rec || f.recording)) { phone.open('gravador', { rec: f.rec || f.recording }); return; }
      if (ext === 'jpg' && (f.photo)) { phone.open('galeria', { photo: f.photo }); return; }
      if (ext === 'jpg' && (f.src || f.media)) {
        kit.imageViewer([{ src: f.src || f.media, title: f.name, subtitle: fileDate(f.at, NOW), info: [['Arquivo', f.name], ['Tamanho', fileSize(f.size)], ['Pasta', folderInfo(folderKey(f)).label]], key: 'arquivos:file:' + f.id }]);
        return;
      }
      nav.push({ className: 'ar-screen ar-view', render: (body, n) => viewer(body, n, f) });
    }

    function viewer(body, n, f) {
      const t = typeOf(f);
      const ext = extOf(f);
      const pages = pagesOf(f);
      const isSheet = ext === 'xlsx';
      const isText = ext === 'txt';
      const isAudio = ext === 'm4a';
      const metaParts = [t.label];
      if (!isSheet && !isText && !isAudio && pages.length > 1) metaParts.push(`${pages.length} págs.`);
      if (fileSize(f.size)) metaParts.push(fileSize(f.size));
      const bar = h('div', { class: 'ar-bar' },
        h('span', { class: 'ar-bar-meta' }, h('span', { class: 'ar-dot', style: { background: t.color } }), metaParts.join(' · ')),
        h('span', { class: 'ar-bar-sp' }));
      const appbar = kit.appBar({
        title: f.name,
        subtitle: `${folderInfo(folderKey(f)).label} · ${fileDate(f.at, NOW)}`,
        actions: [{ icon: 'share-2', label: 'Compartilhar', onClick: () => phone.toast('Compartilhar está indisponível no espelho', { icon: 'share-2' }) }],
      });
      const pin = kit.pinButton({ key: 'arquivos:file:' + f.id, label: f.name, app: 'arquivos', detail: fileDetail(f) });
      let content;
      if (isSheet) content = sheetView(f);
      else if (isText) content = textView(f);
      else if (isAudio) content = audioView(f);
      else content = paperView(f, pages, bar);
      bar.appendChild(pin);
      if (isSheet) {
        body.classList.add('ar-body-flex');
        body.append(appbar, bar, content);
      } else body.append(appbar, bar, content);
    }

    /* ----- PDF / DOCX: folhas de papel ----- */
    function paperView(f, pages, bar) {
      const font = f.font || (/contrato|termo|confidencial|cl[aá]usula|procura|declara|ata\b/i.test(`${f.name} ${pages[0]?.blocks?.find(b => b.type === 'h1')?.text || ''}`) ? 'serif' : 'sans');
      const wrap = h('div', { class: 'ar-papers', style: '--z:1' });
      const desk = h('div', { class: 'ar-desk' }, wrap);
      let zoomed = false;
      const zbtn = h('button', { class: 'ar-zoom', 'aria-label': 'Ampliar', on: { click: () => {
        zoomed = !zoomed;
        wrap.style.setProperty('--z', zoomed ? 1.7 : 1);
        zbtn.setAttribute('aria-label', zoomed ? 'Reduzir' : 'Ampliar');
        clear(zbtn).appendChild(icon(zoomed ? 'zoom-out' : 'zoom-in', { size: 18 }));
      } } }, icon('zoom-in', { size: 18 }));
      bar.insertBefore(zbtn, bar.querySelector('.ar-bar-sp').nextSibling);
      if (!pages.length) wrap.appendChild(h('div', { class: 'ar-paper ' + font }, h('div', { class: 'ar-pg' }, h('div', { class: 'ar-pg-in' }, h('p', { class: 'txt' }, 'Documento sem conteúdo legível.')))));
      pages.forEach((pg, i) => wrap.appendChild(paper(pg, i, pages.length, font, f)));
      return desk;
    }

    function paper(pg, i, total, font, f) {
      const inner = h('div', { class: 'ar-pg-in txt' });
      const blocks = pg.blocks || [];
      for (let k = 0; k < blocks.length; k++) {
        const b = blocks[k];
        if (b.type === 'li') {
          const ul = h('ul', { class: 'ar-ul' });
          while (k < blocks.length && blocks[k].type === 'li') { ul.appendChild(h('li', null, rich(blocks[k].text))); k++; }
          k--; inner.appendChild(ul); continue;
        }
        if (b.type === 'sign') {
          const row = h('div', { class: 'ar-signs' });
          while (k < blocks.length && blocks[k].type === 'sign') { row.appendChild(signBlock(blocks[k])); k++; }
          k--; inner.appendChild(row); continue;
        }
        const node = blockNode(b);
        if (node) inner.appendChild(node);
      }
      return h('article', { class: `ar-paper ${font}`, lang: 'pt-BR', 'aria-label': `Página ${i + 1} de ${total}` },
        h('div', { class: 'ar-pg' }, inner,
          h('footer', { class: 'ar-pg-foot' }, h('span', null, f.name), h('span', null, `${i + 1} / ${total}`))));
    }

    function blockNode(b) {
      switch (b.type) {
        case 'h1': return h('h1', { class: 'ar-h1' }, rich(b.text));
        case 'h2': return h('h2', { class: 'ar-h2' }, rich(b.text));
        case 'h3': return h('h3', { class: 'ar-h3' }, rich(b.text));
        case 'p': return h('p', { class: 'ar-p' }, rich(b.text));
        case 'highlight': return h('p', { class: 'ar-p ar-hlp' }, h('span', { class: 'ar-hl' }, b.text));
        case 'quote': return h('blockquote', { class: 'ar-quote' }, rich(b.text));
        case 'sep': return h('hr', { class: 'ar-sep' });
        case 'table': return tableNode(b);
        default: return b.text ? h('p', { class: 'ar-p' }, rich(b.text)) : null;
      }
    }

    function tableNode(b) {
      const rows = b.rows || [];
      const head = b.header === false ? null : rows[0];
      const bodyRows = b.header === false ? rows : rows.slice(1);
      const cell = (tag, c) => { const t = String(cellText(c)); return h(tag, { class: isNumeric(t) ? 'num' : '' }, rich(t)); };
      return h('div', { class: 'ar-tbl-wrap' }, h('table', { class: 'ar-tbl' },
        head ? h('thead', null, h('tr', null, head.map(c => cell('th', c)))) : null,
        h('tbody', null, bodyRows.map(r => h('tr', { class: /^\s*total/i.test(String(cellText(r[0]))) ? 'tot' : '' }, r.map(c => cell('td', c)))))));
    }

    function signBlock(b) {
      const art = b.signed ? (typeof b.signed === 'string' ? b.signed : b.text) : '';
      return h('div', { class: 'ar-sign' },
        h('div', { class: 'ar-sign-art' }, art ? h('span', null, art) : null),
        h('div', { class: 'ar-sign-line' }),
        h('div', { class: 'ar-sign-name' }, rich(b.text || '')),
        b.role ? h('div', { class: 'ar-sign-role' }, b.role) : null);
    }

    /* ----- XLSX: planilha ----- */
    function sheetView(f) {
      const sheets = sheetsOf(f);
      const fx = h('div', { class: 'ar-fx' }, h('span', { class: 'ar-fx-l' }, 'fx'), h('span', { class: 'ar-fx-t txt' }, ''));
      const gridWrap = h('div', { class: 'ar-grid-wrap' });
      const tabsEl = h('div', { class: 'ar-sheet-tabs' });
      const root = h('div', { class: 'ar-xl' }, fx, gridWrap, tabsEl);
      const drawSheet = (idx) => {
        const sh = sheets[idx] || { name: 'Planilha1', rows: [] };
        clear(gridWrap);
        const rows = sh.rows || [];
        const ncol = Math.max(1, ...rows.map(r => (r || []).length));
        const letters = Array.from({ length: ncol }, (_, i) => String.fromCharCode(65 + (i % 26)).repeat(Math.floor(i / 26) + 1));
        const hasHead = sh.header !== false && rows.length > 1 && (rows[0] || []).filter(c => String(cellText(c)).trim()).length >= 2 && !(rows[0] || []).some(c => isNumeric(cellText(c)));
        let selected = null;
        const select = (td, text, ref) => {
          selected?.classList.remove('sel');
          selected = td; td.classList.add('sel');
          fx.querySelector('.ar-fx-t').textContent = text ? text : '';
          fx.querySelector('.ar-fx-l').textContent = ref;
        };
        const table = h('table', { class: 'ar-grid' },
          h('thead', null, h('tr', null, h('th', { class: 'corner' }), letters.map(l => h('th', { class: 'col' }, l)))),
          h('tbody', null, rows.map((r, ri) => {
            const isTotal = (r || []).some((c, ci) => ci < 2 && /^\s*total\b/i.test(String(cellText(c))));
            return h('tr', { class: `${hasHead && ri === 0 ? 'head' : ''} ${isTotal ? 'tot' : ''}` },
              h('th', { class: 'rn' }, String(ri + 1)),
              Array.from({ length: ncol }, (_, ci) => {
                const c = (r || [])[ci];
                const t = String(cellText(c));
                const bold = c && typeof c === 'object' && c.bold;
                const td = h('td', { class: `${isNumeric(t) ? 'num' : ''} ${bold ? 'b' : ''}`, title: t }, t);
                td.addEventListener('click', () => select(td, t, `${letters[ci]}${ri + 1}`));
                return td;
              }));
          })));
        gridWrap.appendChild(table);
        clear(tabsEl);
        sheets.forEach((s, i) => tabsEl.appendChild(h('button', { class: `ar-stab ${i === idx ? 'on' : ''}`, on: { click: () => drawSheet(i) } }, s.name)));
        if (!sheets.length) tabsEl.appendChild(h('span', { class: 'ar-stab on' }, 'Planilha1'));
        phone.scan(gridWrap);
      };
      drawSheet(0);
      return root;
    }

    /* ----- TXT ----- */
    function textView(f) {
      const txt = plainText(f);
      const lines = txt.split('\n').length;
      return h('div', { class: 'ar-txt-wrap' },
        h('div', { class: 'ar-txt-meta' }, `UTF-8 · ${lines} ${lines === 1 ? 'linha' : 'linhas'}`),
        h('pre', { class: 'ar-txt txt' }, txt));
    }

    /* ----- áudio ----- */
    function audioView(f) {
      return h('div', { class: 'ar-audio' },
        kit.audioPlayer({ title: f.name, at: fileDate(f.at, NOW), duration: f.duration || 60, transcript: f.transcript || [], key: 'arquivos:file:' + f.id }));
    }

    /* ----- raiz ----- */
    const results = h('div', { class: 'ar-results' });
    const home = h('div', { class: 'ar-home' });
    const search = kit.search({
      placeholder: 'Pesquisar arquivos',
      onInput: (q) => {
        const query = fold(q).trim();
        if (query.length < 2) { results.hidden = true; home.hidden = false; clear(results); return; }
        home.hidden = true; results.hidden = false; clear(results);
        const hits = shown().filter(f => fold(f.name).includes(query) || fold(fileText(f)).includes(query));
        if (!hits.length) { results.appendChild(kit.empty({ icon: 'search', title: 'Nada encontrado', text: `Nenhum arquivo com "${q}".` })); return; }
        results.appendChild(kit.list(hits.map(f => {
          const text = fileText(f);
          const i = fold(text).indexOf(query);
          let snip = '';
          if (i >= 0 && !fold(f.name).includes(query)) { const a = Math.max(0, i - 28); snip = (a ? '…' : '') + text.slice(a, i + query.length + 50) + '…'; }
          return fileRow(f, { sub: snip || [fileSize(f.size), fileDate(f.at, NOW)].filter(Boolean).join(' · ') });
        })));
        phone.scan(results);
      },
    });
    results.hidden = true;

    function folderTile(info) {
      const list = files().filter(f => folderKey(f) === info.id);
      const locked = info.id === 'segura' && !segOpen();
      let line;
      if (locked) line = game.has('cap3') ? 'Protegida por senha' : 'Criptografada';
      else line = `${list.length} ${list.length === 1 ? 'arquivo' : 'arquivos'}`;
      return h('button', { class: `ar-folder tone-${info.tone}`, on: { click: () => openFolder(info.id) } },
        h('span', { class: 'ar-folder-ic' }, icon(locked ? 'lock' : info.icon, { size: 22, stroke: 1.8 })),
        h('span', { class: 'ar-folder-nm' }, info.label),
        h('span', { class: 'ar-folder-ct' }, line));
    }

    function drawHome() {
      clear(home);
      const keys = [...FOLDERS.map(f => f.id)];
      for (const f of files()) { const k = folderKey(f); if (!keys.includes(k)) keys.push(k); }
      home.appendChild(h('div', { class: 'ar-sec' }, 'Pastas'));
      home.appendChild(h('div', { class: 'ar-folders' }, keys.map(k => folderTile(folderInfo(k)))));
      home.appendChild(storageCard());
      home.appendChild(h('div', { class: 'ar-sec' }, icon('clock', { size: 15 }), 'Recentes'));
      const recent = shown().sort((a, b) => time.compare(b.at, a.at)).slice(0, 8);
      if (!recent.length) home.appendChild(kit.empty({ icon: 'folder-open', title: 'Nenhum arquivo', text: 'Os arquivos do aparelho aparecem aqui.' }));
      else home.appendChild(kit.list(recent.map(f => fileRow(f, { sub: `${folderInfo(folderKey(f)).label} · ${fileSize(f.size)} · ${fileDate(f.at, NOW)}` }))));
      phone.scan(home);
    }

    function storageCard() {
      const st = data.storage || { used: 41.2, total: 128, parts: [['Fotos e vídeos', 24.6, '#a78bfa'], ['Apps', 9.8, '#5b93ee'], ['Documentos', 2.1, '#e0a526'], ['Outros', 4.7, '#6b7078']] };
      const tot = st.total;
      return h('div', { class: 'ar-storage' },
        h('div', { class: 'ar-st-top' }, h('b', null, 'Armazenamento do aparelho'), h('span', null, `${String(st.used).replace('.', ',')} GB de ${tot} GB`)),
        h('div', { class: 'ar-st-bar', role: 'img', 'aria-label': 'Uso do armazenamento' }, st.parts.map(([n, v, c]) => h('i', { style: { width: (v / tot * 100) + '%', background: c }, title: n }))),
        h('div', { class: 'ar-st-leg' }, st.parts.map(([n, , c]) => h('span', null, h('i', { style: { background: c } }), n))));
    }

    function refreshRoot() { drawHome(); }
    el.append(kit.appBar({ title: 'Arquivos', subtitle: 'Armazenamento interno' }), search, home, results);
    drawHome();
    nav.refresh?.(refreshRoot);

    if (params.folder) openFolder(folderKey({ folder: params.folder }));
    if (params.file) {
      const f = (data.files || []).find(x => x.id === params.file);
      if (f) openFile(f); else phone.toast('Arquivo não encontrado', { icon: 'file' });
    }
  },

  search({ data, game }) {
    const segOpen = game.has('pasta_aberta') && game.has('cap3');
    return (data.files || [])
      .filter(f => game.req(f) && (folderKey(f) !== 'segura' || segOpen))
      .map(f => ({ title: f.name, text: fileText(f), params: { file: f.id }, at: f.at }));
  },
};
