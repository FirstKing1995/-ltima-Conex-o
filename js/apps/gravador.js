// Gravador — gravações do aparelho de Iara (espelho somente leitura), Lixeira de 30 dias
// e arquivos protegidos pela Pasta Segura (só abrem por params {rec}).
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
const sizeOf = (r) => {
  const kb = secs(r) * 16;
  return kb >= 1024 ? `${(kb / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(kb))} KB`;
};
const purgeDate = (at) => { const d = time.parse(at); d.setDate(d.getDate() + 30); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; };
const trText = (r) => (r.transcript || []).map((l) => (l.who ? `${l.who}: ` : '') + (l.text || '')).join(' ');

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
  return h('div', { class: `gv-wave ${bad ? 'bad' : ''} ${tall ? 'tall' : ''}`, 'aria-hidden': 'true' }, bars);
}

/** Botão de fixar compacto (ícone). */
function pinMini(game, spec) {
  const b = h('button', { class: 'gv-pinmini', title: 'Fixar no Quadro' });
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

/* ---------- cartão da lista ---------- */
function recCard(rec, game, onOpen, { trash = false } = {}) {
  const dur = time.duration(secs(rec));
  if (trash && !game.req(rec)) {
    // conteúdo ainda indisponível no espelho: visual de arquivo corrompido
    return h('button', { class: 'gv-card bad', on: { click: onOpen }, 'aria-label': `${rec.name}, arquivo corrompido` },
      h('div', { class: 'top' },
        h('div', { class: 'ic warn' }, icon('triangle-alert', { size: 22 })),
        h('div', { class: 'tx' },
          h('div', { class: 'nm' }, rec.name),
          h('div', { class: 'sub warn' }, `Arquivo corrompido no espelho · ${dur} · ${delTag(rec.deletedAt || rec.at).toLowerCase()}`))),
      waveEl(rec.id, { bad: true }),
      h('div', { class: 'eco-note' }, icon('square-terminal', { size: 15 }), 'O ECO está tentando reconstruir este arquivo.'));
  }
  return h('button', { class: `gv-card ${trash ? 'trash' : ''}`, on: { click: onOpen } },
    h('div', { class: 'top' },
      h('div', { class: 'ic' }, icon(isSafe(rec) ? 'lock' : 'mic', { size: 22 })),
      h('div', { class: 'tx' },
        h('div', { class: 'nm' }, rec.name),
        h('div', { class: 'sub' }, trash && rec.deletedAt ? `${delTag(rec.deletedAt)} · exclusão definitiva em ${purgeDate(rec.deletedAt)}` : dateTag(rec.at))),
      h('div', { class: 'dur' }, dur)),
    waveEl(rec.id));
}

/* ---------- detalhe da gravação ---------- */
function drawDetail(ctx, el, rec) {
  const { kit, game, phone } = ctx;
  const trash = isTrash(rec);
  const locked = isSafe(rec) && !game.has('pasta_aberta');
  const gated = !locked && trash && !game.req(rec);
  const dur = secs(rec);
  clear(el);
  el.append(kit.appBar({
    title: rec.name,
    subtitle: locked ? 'Pasta Segura' : gated ? 'Arquivo corrompido' : `${dateTag(rec.at)} · ${time.duration(dur)}`,
  }));

  if (locked) {
    el.append(h('div', { class: 'gv-lock' },
      h('div', { class: 'ring' }, icon('folder-lock', { size: 34 })),
      h('h3', null, 'Arquivo protegido pela Pasta Segura'),
      h('p', null, 'Esta gravação está guardada na Pasta Segura da Galeria. Abra a pasta para ouvir.'),
      kit.button({ label: 'Ir para a Galeria', icon: 'images', variant: 'tonal', onClick: () => phone.open('galeria', { album: 'segura' }) })));
    return 'locked';
  }

  if (gated) {
    el.append(h('div', { class: 'gv-corrupt' },
      waveEl(rec.id + '-d', { n: 52, bad: true, tall: true }),
      h('div', { class: 'msg' },
        h('div', { class: 'badge' }, icon('triangle-alert', { size: 18 }), 'Arquivo corrompido no espelho'),
        h('p', { class: 'meta' }, `${time.duration(dur)} · ${delTag(rec.deletedAt || rec.at).toLowerCase()}`),
        h('p', { class: 'eco' }, icon('square-terminal', { size: 16 }), 'O ECO está tentando reconstruir este arquivo.'),
        h('div', { class: 'rebuild', role: 'progressbar', 'aria-label': 'Reconstruindo arquivo' }, h('i')),
        h('small', null, 'Reconstruindo a partir dos fragmentos do espelho…'))));
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
    el.append(h('div', { class: 'gv-note slim' }, icon('trash-2', { size: 17 }),
      h('span', null, `${delTag(rec.deletedAt || rec.at)}${rec.deletedAt ? ` · exclusão definitiva em ${purgeDate(rec.deletedAt)}` : ''}`)));
  }
  const player = kit.audioPlayer({ title: rec.name, at: dateTag(rec.at), duration: dur, transcript: rec.transcript || [], key: `gravador:rec:${rec.id}` });
  const tr = player.querySelector('.k-transcript');
  const pinRow = h('div', { class: 'gv-pinrow' }, kit.pinButton(pinSpec));
  if (tr) {
    tr.before(pinRow, h('div', { class: 'gv-trhead' }, icon('audio-lines', { size: 16 }), 'Transcrição automática', h('small', null, 'toque numa fala para ir até ela')));
    // fixar uma fala específica
    const lines = [...tr.querySelectorAll('.ln')];
    (rec.transcript || []).forEach((l, i) => {
      if (!lines[i] || (l.kind && l.kind !== 'speech')) return;
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
    h('div', { class: 'gv-trhead info' }, icon('info', { size: 16 }), 'Detalhes'),
    kit.kv([
      ['Nome', rec.name],
      ['Gravada em', `${time.dayLabel(rec.at)} às ${time.hhmm(rec.at)}`],
      ['Duração', time.duration(dur)],
      ['Formato', 'M4A · 128 kbps'],
      ['Tamanho', sizeOf(rec)],
      ['Pasta', isSafe(rec) ? 'Pasta Segura' : trash ? 'Lixeira' : 'Gravações'],
    ]));
  return 'open';
}

function openRec(ctx, rec) {
  ctx.nav.push({
    title: rec.name,
    className: 'gv-sub',
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
    const listEl = h('div', { class: 'gv-list' });

    const draw = () => {
      clear(listEl);
      if (tab === 'lixeira') {
        listEl.append(h('div', { class: 'gv-note' }, icon('info', { size: 18 }), h('span', null, 'Gravações apagadas ficam aqui por 30 dias')));
        const items = trash();
        if (!items.length) listEl.append(kit.empty({ icon: 'trash-2', title: 'A lixeira está vazia', text: 'Nenhuma gravação apagada.' }));
        items.forEach((r) => listEl.append(recCard(r, game, () => openRec(ctx, r), { trash: true })));
      } else {
        const items = normal();
        if (!items.length) listEl.append(kit.empty({ icon: 'mic', title: 'Nenhuma gravação', text: 'As gravações do aparelho aparecem aqui.' }));
        else listEl.append(h('div', { class: 'gv-count' }, `${items.length} ${items.length === 1 ? 'gravação' : 'gravações'}`));
        items.forEach((r) => listEl.append(recCard(r, game, () => openRec(ctx, r))));
      }
      phone.scan(listEl);
    };

    const tabs = kit.tabs({
      items: [{ id: 'rec', label: 'Gravações' }, { id: 'lixeira', label: 'Lixeira' }],
      active: tab,
      onChange: (id) => { tab = id; prefs().tab = id; draw(); },
    });
    const fab = h('button', { class: 'gv-fab', 'aria-label': 'Gravar', on: { click: () => phone.toast('Espelho somente leitura: não é possível gravar.', { icon: 'mic' }) } }, icon('mic', { size: 26 }));
    el.append(kit.appBar({ title: 'Gravador', subtitle: 'Gravações do aparelho' }), tabs, listEl, h('div', { class: 'gv-pad' }));
    screen.appendChild(fab);
    draw();

    // quando o capítulo libera a gravação corrompida, a lista se atualiza
    const off = bus.on('flag', () => { if (!el.isConnected) { off(); return; } if (!screen.querySelector('.gv-sub')) draw(); });

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
        text: open ? (trText(r) || `Gravação de ${dateTag(r.at)}`) : 'Arquivo corrompido no espelho',
        params: { rec: r.id },
        at: r.at,
      });
    }
    return out;
  },
};
