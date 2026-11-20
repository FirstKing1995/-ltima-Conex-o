// Gravador (Google Gravador) — gravações do aparelho de Iara (espelho somente leitura), Lixeira de 30 dias
// e arquivos protegidos pela Pasta Trancada (só abrem por params {rec}).
import { h, clear } from '../core/dom.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { sfx } from '../core/sfx.js';

/* ---------- utilidades ---------- */
const prefs = () => (state.apps.gravador = state.apps.gravador || {});
const secs = (r) => Math.max(0, Math.round(time.toSec(r.duration)));
const dateTag = (at) => `${time.weekday(at)}, ${time.dateShort(at)} · ${time.hhmm(at)}`;
const delTag = (at) => `Apagada ${time.weekday(at)} ${time.hhmm(at)}`;
const isTrash = (r) => r.folder === 'lixeira' || (!!r.deletedAt && r.folder !== 'segura');
const isSafe = (r) => r.folder === 'segura';
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const sizeOf = (r) => {
  const kb = secs(r) * 16;
  return kb >= 1024 ? `${(kb / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(kb))} KB`;
};
const purgeDate = (at) => { const d = time.parse(at); d.setDate(d.getDate() + 30); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; };
const trText = (r) => (r.transcript || []).map((l) => (l.who ? `${l.who}: ` : '') + (l.text || '')).join(' ');
const longDate = (at) => { const d = time.parse(at); return `${time.weekday(at)}., ${d.getDate()} de ${time.monthShort(d.getMonth())}. de ${d.getFullYear()} · ${time.hhmm(at)}`; };

function dayGroup(at) {
  const a = time.parse(at), b = time.parse(time.MIRROR_NOW);
  const dd = Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
  if (dd === 0) return 'Hoje';
  if (dd === 1) return 'Ontem';
  if (dd < 7) return 'Nesta semana';
  const m = time.monthName(a.getMonth());
  return `${m.charAt(0).toUpperCase() + m.slice(1)}${a.getFullYear() !== b.getFullYear() ? ' de ' + a.getFullYear() : ''}`;
}

function rng(seed) {
  let s = 2166136261;
  for (const ch of String(seed)) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619) >>> 0; }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** Forma de onda desenhada (determinística pelo id). bad = arquivo corrompido (falhas, picos, fantasmas). */
function waveEl(seed, { n = 44, bad = false, tall = false } = {}) {
  const r = rng(seed);
  let env = 0.5;
  const bars = [];
  for (let i = 0; i < n; i++) {
    env = Math.min(1, Math.max(0.14, env + (r() - 0.5) * 0.55));
    let v = Math.max(0.1, env * (0.6 + r() * 0.4));
    let cls = '';
    if (bad) {
      const roll = r();
      if (roll < 0.2) { v = 0.05; cls = 'cut'; } else if (roll > 0.9) { v = 1; cls = 'hot'; } else if (roll > 0.8) cls = 'ghost';
    }
    bars.push(h('i', { class: cls, style: { height: Math.round(v * 100) + '%' } }));
  }
  return h('div', { class: `rc-wave ${bad ? 'bad' : ''} ${tall ? 'tall' : ''}`, 'aria-hidden': 'true' }, bars);
}

/** Botão de fixar compacto (ícone). */
function pinMini(game, spec) {
  const b = h('button', { class: 'rc-pinmini', title: 'Fixar no Quadro' });
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

/* ---------- item da lista ---------- */
function recRow(rec, game, onOpen, { trash = false } = {}) {
  const dur = time.duration(secs(rec));
  if (trash && !game.req(rec)) {
    // conteúdo ainda indisponível na extração: visual de arquivo corrompido
    return h('button', { class: 'rc-row bad', on: { click: onOpen }, 'aria-label': `${rec.name}, arquivo corrompido` },
      h('div', { class: 'top' },
        h('span', { class: 'lead warn' }, icon('triangle-alert', { size: 20 })),
        h('div', { class: 'tx' },
          h('div', { class: 'nm' }, rec.name),
          h('div', { class: 'sub warn' }, `Arquivo corrompido na extração · ${dur} · ${delTag(rec.deletedAt || rec.at).toLowerCase()}`))),
      waveEl(rec.id, { bad: true }),
      h('div', { class: 'eco-note' }, icon('square-terminal', { size: 15 }), 'A recuperação dos fragmentos está em andamento.'));
  }
  return h('button', { class: `rc-row ${trash ? 'trash' : ''}`, on: { click: onOpen } },
    h('div', { class: 'top' },
      h('span', { class: 'lead' }, icon(isSafe(rec) ? 'lock' : trash ? 'trash-2' : 'audio-lines', { size: 20 })),
      h('div', { class: 'tx' },
        h('div', { class: 'nm' }, rec.name),
        h('div', { class: 'sub' }, trash && rec.deletedAt ? `${delTag(rec.deletedAt)} · exclusão em ${purgeDate(rec.deletedAt)}` : `${time.dateShort(rec.at)} · ${time.hhmm(rec.at)}`)),
      h('span', { class: 'dur' }, dur)));
}

/* ---------- detalhe da gravação (player) ---------- */
function drawDetail(ctx, el, rec) {
  const { kit, game, phone } = ctx;
  const trash = isTrash(rec);
  const locked = isSafe(rec) && !game.has('pasta_aberta');
  const gated = !locked && trash && !game.req(rec);
  const dur = secs(rec);
  const ro = () => phone.toast('Extração somente leitura.', { icon: 'lock' });
  clear(el);
  el.append(
    h('header', { class: 'rc-subbar' },
      kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
      h('span', { class: 'sp' }),
      kit.iconButton({ icon: 'share-2', label: 'Compartilhar', onClick: ro }),
      kit.iconButton({ icon: 'ellipsis-vertical', label: 'Mais opções', onClick: ro })),
    h('div', { class: 'rc-head' },
      h('h1', null, rec.name),
      h('p', null, locked ? 'Pasta Trancada' : gated ? 'Arquivo corrompido' : `${longDate(rec.at)} · ${time.duration(dur)}`)));

  if (locked) {
    el.append(h('div', { class: 'rc-lock' },
      h('div', { class: 'ring' }, icon('folder-lock', { size: 34 })),
      h('h3', null, 'Arquivo protegido pela Pasta Trancada'),
      h('p', null, 'Esta gravação está guardada na Pasta Trancada do Fotos. Abra a pasta para ouvir.'),
      kit.button({ label: 'Abrir no Fotos', icon: 'images', variant: 'tonal', onClick: () => phone.open('galeria', { album: 'segura' }) })));
    return 'locked';
  }

  if (gated) {
    el.append(h('div', { class: 'rc-corrupt' },
      waveEl(rec.id + '-d', { n: 52, bad: true, tall: true }),
      h('div', { class: 'msg' },
        h('div', { class: 'badge' }, icon('triangle-alert', { size: 18 }), 'Arquivo corrompido na extração'),
        h('p', { class: 'meta' }, `${time.duration(dur)} · ${delTag(rec.deletedAt || rec.at).toLowerCase()}`),
        h('p', { class: 'eco' }, icon('square-terminal', { size: 16 }), 'A recuperação dos fragmentos está em andamento.'),
        h('div', { class: 'rebuild', role: 'progressbar', 'aria-label': 'Reconstruindo arquivo' }, h('i')),
        h('small', null, 'Reconstruindo a partir dos fragmentos da extração…'))));
    sfx.play('glitch');
    return 'gated';
  }

  game.see(`gravador:rec:${rec.id}`);
  const deletedTxt = trash && rec.deletedAt ? delTag(rec.deletedAt).toLowerCase() : '';
  const pinSpec = {
    key: `gravador:rec:${rec.id}`,
    label: `Gravação “${rec.name}”`,
    app: 'gravador',
    detail: `${dateTag(rec.at)} · ${time.duration(dur)}${deletedTxt ? ' · ' + deletedTxt : ''}`,
  };
  if (trash) {
    el.append(h('div', { class: 'rc-note slim' }, icon('trash-2', { size: 17 }),
      h('span', null, `${delTag(rec.deletedAt || rec.at)}${rec.deletedAt ? ` · exclusão definitiva em ${purgeDate(rec.deletedAt)}` : ''}`)));
  }
  const player = kit.audioPlayer({ title: rec.name, at: dateTag(rec.at), duration: dur, transcript: rec.transcript || [], key: `gravador:rec:${rec.id}` });
  player.classList.add('rc-player');
  const tr = player.querySelector('.k-transcript');
  const pinRow = h('div', { class: 'rc-pinrow' }, kit.pinButton(pinSpec));
  const speakers = [...new Set((rec.transcript || []).map((l) => l.who).filter(Boolean))];
  if (tr) {
    tr.before(pinRow, h('div', { class: 'rc-trhead' },
      h('span', { class: 'tabs' }, h('b', null, icon('audio-lines', { size: 16 }), 'Transcrição')),
      h('small', null, speakers.length ? `${speakers.length} ${speakers.length === 1 ? 'pessoa' : 'pessoas'} · toque numa fala` : 'toque numa fala para ir até ela')));
    // cor por falante, como os rótulos do Gravador
    const lines = [...tr.querySelectorAll('.ln')];
    (rec.transcript || []).forEach((l, i) => {
      if (!lines[i]) return;
      if (l.who) lines[i].dataset.spk = String(Math.max(0, speakers.indexOf(l.who)) % 4);
      if (l.kind && l.kind !== 'speech') return;
      lines[i].appendChild(pinMini(game, {
        key: `gravador:rec:${rec.id}#${l.t}`,
        label: `${rec.name} · ${l.t}${l.who ? ' · ' + l.who : ''}`,
        app: 'gravador',
        detail: `“${l.text}”`,
      }));
    });
  } else player.append(pinRow);
  el.append(player);
  el.append(
    h('div', { class: 'rc-trhead info' }, h('span', { class: 'tabs' }, h('b', null, icon('info', { size: 16 }), 'Detalhes'))),
    h('div', { class: 'rc-kv' }, kit.kv([
      ['Nome', rec.name],
      ['Gravada em', `${time.dayLabel(rec.at)} às ${time.hhmm(rec.at)}`],
      ['Duração', time.duration(dur)],
      ['Formato', 'M4A · 128 kbps'],
      ['Tamanho', sizeOf(rec)],
      ['Pasta', isSafe(rec) ? 'Pasta Trancada' : trash ? 'Lixeira' : 'Gravações'],
    ])));
  return 'open';
}

function openRec(ctx, rec) {
  ctx.nav.push({
    title: rec.name,
    className: 'app-gravador rc-sub',
    render(el) {
      let last = drawDetail(ctx, el, rec);
      // quando um capítulo libera o conteúdo (ex.: cap4), a tela se refaz sozinha
      const off = bus.on('flag', () => {
        if (!el.isConnected) { off(); return; }
        const sig = drawSignature(ctx, rec);
        if (sig !== last) last = drawDetail(ctx, el, rec);
      });
    },
  });
}

function drawSignature(ctx, rec) {
  const { game } = ctx;
  if (isSafe(rec) && !game.has('pasta_aberta')) return 'locked';
  if (isTrash(rec) && !game.req(rec)) return 'gated';
  return 'open';
}

/* ---------- app ---------- */
export default {
  id: 'gravador',
  title: 'Gravador',
  cloud: false,

  render(ctx) {
    const { el, screen, kit, game, params, phone } = ctx;
    const all = ctx.data.recordings || [];
    const visible = (r) => (isTrash(r) ? true : game.req(r));
    const normal = () => all.filter((r) => !isTrash(r) && !isSafe(r) && visible(r)).sort((a, b) => time.compare(b.at, a.at));
    const trash = () => all.filter((r) => isTrash(r) && !isSafe(r)).sort((a, b) => time.compare(b.deletedAt || b.at, a.deletedAt || a.at));

    const target = params?.rec ? all.find((r) => r.id === params.rec) : null;
    let tab = prefs().tab === 'lixeira' ? 'lixeira' : 'rec';
    if (target && isTrash(target)) tab = 'lixeira';
    let query = '';
    const listEl = h('div', { class: 'rc-list' });
    const chipsEl = h('div', { class: 'rc-chips', role: 'tablist', 'aria-label': 'Pastas do Gravador' });

    const match = (r) => !query || norm(`${r.name} ${game.req(r) ? trText(r) : ''}`).includes(query);
    const grouped = (items, opts) => {
      let cur = null, box = null;
      for (const r of items) {
        const g = dayGroup(opts.trash ? (r.deletedAt || r.at) : r.at);
        if (g !== cur) { cur = g; listEl.append(h('h3', { class: 'rc-day' }, g)); box = h('div', { class: 'rc-group' }); listEl.append(box); }
        box.append(recRow(r, game, () => openRec(ctx, r), opts));
      }
    };

    const drawChips = () => {
      clear(chipsEl);
      const nT = trash().length;
      for (const [id, label, ic, n] of [['rec', 'Gravações', 'audio-lines', normal().length], ['lixeira', 'Lixeira', 'trash-2', nT]]) {
        chipsEl.append(h('button', { class: `rc-chip ${tab === id ? 'on' : ''}`, role: 'tab', 'aria-selected': String(tab === id), on: { click: () => { sfx.play('tap'); setTab(id); } } },
          icon(tab === id ? 'check' : ic, { size: 16 }), label, n ? h('span', { class: 'n' }, String(n)) : null));
      }
    };

    const draw = () => {
      clear(listEl);
      drawChips();
      if (tab === 'lixeira') {
        listEl.append(h('div', { class: 'rc-note' }, icon('info', { size: 18 }), h('span', null, 'As gravações na lixeira são excluídas permanentemente após 30 dias.')));
        const items = trash().filter(match);
        if (!items.length) listEl.append(kit.empty({ icon: 'trash-2', title: query ? 'Nada encontrado' : 'A lixeira está vazia', text: query ? 'Nenhuma gravação apagada com esse termo.' : 'Nenhuma gravação apagada.' }));
        else grouped(items, { trash: true });
      } else {
        const items = normal().filter(match);
        if (!items.length) listEl.append(kit.empty({ icon: 'mic', title: query ? 'Nada encontrado' : 'Nenhuma gravação', text: query ? 'Nenhuma gravação ou transcrição com esse termo.' : 'As gravações do aparelho aparecem aqui.' }));
        else grouped(items, { trash: false });
      }
      phone.scan(listEl);
    };
    function setTab(id) { tab = id; prefs().tab = id; draw(); }

    /* busca nas gravações e transcrições (como no Gravador) */
    const sInput = h('input', { type: 'search', placeholder: 'Pesquisar gravações', 'aria-label': 'Pesquisar gravações', autocomplete: 'off', spellcheck: 'false' });
    let st = null;
    sInput.addEventListener('input', () => { clearTimeout(st); st = setTimeout(() => { query = norm(sInput.value).trim(); draw(); }, 140); });
    const sBar = h('label', { class: 'rc-search', hidden: true }, icon('search', { size: 20 }), sInput,
      h('button', { class: 'rc-sx', 'aria-label': 'Fechar a pesquisa', on: { click: (e) => { e.preventDefault(); sInput.value = ''; query = ''; sBar.hidden = true; draw(); } } }, icon('x', { size: 18 })));

    const more = h('button', { class: 'k-iconbtn', 'aria-label': 'Mais opções' }, icon('ellipsis-vertical', { size: 22 }));
    more.addEventListener('click', () => kit.menu(more, [
      { label: 'Lixeira', icon: 'trash-2', onClick: () => setTab('lixeira') },
      { label: 'Configurações', icon: 'settings', onClick: () => phone.toast('Extração somente leitura.', { icon: 'lock' }) },
    ]));
    const top = h('header', { class: 'rc-top' },
      h('h1', null, 'Gravador'),
      kit.iconButton({ icon: 'search', label: 'Pesquisar', onClick: () => { sBar.hidden = !sBar.hidden; if (!sBar.hidden) setTimeout(() => sInput.focus(), 60); } }),
      more);

    const recBtn = h('button', { class: 'rc-recbtn', 'aria-label': 'Gravar', on: { click: () => phone.toast('Extração somente leitura: não é possível gravar.', { icon: 'mic' }) } }, h('i'));
    const dock = h('div', { class: 'rc-dock' }, recBtn);
    el.append(top, sBar, chipsEl, listEl);
    screen.appendChild(dock);
    draw();

    // quando o capítulo libera a gravação corrompida, a lista se atualiza
    const off = bus.on('flag', () => { if (!el.isConnected) { off(); return; } draw(); });

    if (params?.rec) {
      if (!target) phone.toast('Gravação não encontrada', { icon: 'mic' });
      else openRec(ctx, target);
    }
  },

  search({ data, game }) {
    const out = [];
    for (const r of data.recordings || []) {
      if (isSafe(r) && !game.has('pasta_aberta')) continue;
      const open = game.req(r);
      if (!open && !isTrash(r)) continue;
      out.push({
        title: r.name,
        text: open ? (trText(r) || `Gravação de ${dateTag(r.at)}`) : 'Arquivo corrompido na extração',
        params: { rec: r.id },
        at: r.at,
      });
    }
    return out;
  },
};
