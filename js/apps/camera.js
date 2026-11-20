// Câmera — app de câmera do Android (estilo Pixel/Moto: visor 3:4, zoom, modos, disparador).
// No espelho ela não captura nada; a miniatura leva ao Fotos.
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { sfx } from '../core/sfx.js';

const MODES = [
  { id: 'noturno', label: 'Visão noturna' },
  { id: 'retrato', label: 'Retrato' },
  { id: 'foto', label: 'Foto' },
  { id: 'video', label: 'Vídeo' },
  { id: 'pano', label: 'Panorama' },
];
const FLASH = [['off', 'Flash desativado'], ['auto', 'Flash automático'], ['on', 'Flash ativado']];
const TIMER = [['0', 'Timer desativado'], ['3', 'Timer de 3 segundos'], ['10', 'Timer de 10 segundos']];
const RATIOS = ['3:4', '9:16', '1:1'];
const ZOOMS = ['.5', '1×', '2×', '5×'];
const OFFLINE = 'Câmera indisponível: esta é uma extração forense do aparelho.';

// ícones que o Lucide embutido não tem (mesmo formato dos outros)
const svg = (inner, size = 22) => {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ic" aria-hidden="true">${inner}</svg>`;
  return t.content.firstChild;
};
const bolt = (off) => svg(`<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>${off ? '<path d="M3 3l18 18"/>' : ''}`);
const flipIc = () => svg('<path d="M4 9a8 8 0 0 1 14.5-3.5L20 7"/><path d="M20 3v4h-4"/><path d="M20 15a8 8 0 0 1-14.5 3.5L4 17"/><path d="M4 21v-4h4"/><circle cx="12" cy="12" r="2.6"/>', 24);

export default {
  id: 'camera',
  title: 'Câmera',
  cloud: false,

  render(ctx) {
    const { el, kit, phone, game, data } = ctx;

    // a última foto do aparelho vira a miniatura (fora da Pasta Trancada e da Lixeira)
    const last = (data.photos || [])
      .filter((p) => game.req(p) && p.album !== 'segura' && p.album !== 'lixeira' && !p.deletedAt)
      .sort((a, b) => time.compare(b.at, a.at))[0] || null;

    let mode = 'foto';
    let flash = 0, timer = 0, ratio = 0, zoom = 1;

    const root = h('div', { class: 'cx-root cx-mode-foto' });
    const tool = (label, child, onClick) => {
      const b = h('button', { class: 'cx-tool', 'aria-label': label, title: label }, child);
      b.addEventListener('click', (e) => { e.stopPropagation(); sfx.play('tap'); onClick(b); });
      return b;
    };

    /* ---------- topo: atalhos rápidos ---------- */
    const flashBtn = tool(FLASH[0][1], bolt(true), (b) => {
      flash = (flash + 1) % FLASH.length;
      b.replaceChildren(...[bolt(flash === 0), flash === 1 ? h('small', null, 'A') : null].filter(Boolean));
      b.classList.toggle('on', flash > 0);
      b.setAttribute('aria-label', FLASH[flash][1]); b.title = FLASH[flash][1];
      phone.toast(FLASH[flash][1], { icon: 'sun', ms: 1200 });
    });
    const timerBtn = tool(TIMER[0][1], icon('timer', { size: 22 }), (b) => {
      timer = (timer + 1) % TIMER.length;
      b.replaceChildren(...[icon('timer', { size: 22 }), timer ? h('small', null, TIMER[timer][0] + 's') : null].filter(Boolean));
      b.classList.toggle('on', timer > 0);
      b.setAttribute('aria-label', TIMER[timer][1]); b.title = TIMER[timer][1];
    });
    const ratioBtn = tool('Proporção 3:4', h('span', { class: 'cx-ratio' }, RATIOS[0]), (b) => {
      ratio = (ratio + 1) % RATIOS.length;
      b.firstChild.textContent = RATIOS[ratio];
      b.setAttribute('aria-label', `Proporção ${RATIOS[ratio]}`);
      root.dataset.ratio = RATIOS[ratio].replace(':', 'x');
    });
    const top = h('div', { class: 'cx-top' },
      tool('Configurações da câmera', icon('settings', { size: 22 }), () => phone.toast(OFFLINE, { icon: 'camera' })),
      h('span', { class: 'cx-sp' }),
      flashBtn, timerBtn, ratioBtn,
      h('span', { class: 'cx-sp' }),
      tool('Mais ajustes', icon('chevron-down', { size: 22 }), () => phone.toast(OFFLINE, { icon: 'camera' })));

    /* ---------- visor ---------- */
    const focus = h('div', { class: 'cx-focus', 'aria-hidden': 'true' }, h('i'), h('span', { class: 'sun' }, icon('sun', { size: 14 })));
    const hint = h('div', { class: 'cx-hint' },
      h('span', { class: 'cx-hint-ic' }, icon('camera', { size: 26, stroke: 1.5 })),
      h('b', null, 'Sem imagem'),
      h('small', null, 'Esta é uma extração forense do aparelho. O visor não recebe sinal.'));
    const zoomRow = h('div', { class: 'cx-zoom', role: 'group', 'aria-label': 'Zoom' },
      ZOOMS.map((z, i) => h('button', {
        class: `cx-z${i === 1 ? ' on' : ''}`, 'aria-label': `Zoom ${z}`,
        on: { click: (e) => { e.stopPropagation(); zoom = i; sfx.play('tap'); zoomRow.querySelectorAll('.cx-z').forEach((b, k) => b.classList.toggle('on', k === zoom)); } },
      }, z)));
    const finder = h('div', { class: 'cx-finder', on: { click: (e) => ping(e) } },
      h('div', { class: 'cx-noise' }),
      h('div', { class: 'cx-grid', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('i')),
      h('div', { class: 'cx-rec', 'aria-hidden': 'true' }, h('i'), '00:00'),
      hint, focus, zoomRow);

    function ping(e) {
      const r = finder.getBoundingClientRect();
      const x = Math.max(40, Math.min(r.width - 40, e.clientX - r.left));
      const y = Math.max(40, Math.min(r.height - 60, e.clientY - r.top));
      focus.style.left = x + 'px';
      focus.style.top = y + 'px';
      focus.classList.remove('show'); void focus.offsetWidth; focus.classList.add('show');
    }

    /* ---------- modos ---------- */
    const modeBtns = MODES.map((m) => h('button', { class: `cx-mode${m.id === mode ? ' on' : ''}`, role: 'tab', 'aria-selected': String(m.id === mode), on: { click: () => setMode(m.id) } }, m.label));
    const modes = h('div', { class: 'cx-modes', role: 'tablist', 'aria-label': 'Modo da câmera' }, modeBtns);
    function center(b, smooth) {
      const left = b.offsetLeft - (modes.clientWidth - b.offsetWidth) / 2;
      if (smooth && modes.scrollTo) modes.scrollTo({ left, behavior: 'smooth' }); else modes.scrollLeft = left;
    }
    function setMode(id) {
      mode = id;
      sfx.play('tap');
      root.className = `cx-root cx-mode-${id}`;
      modeBtns.forEach((b, i) => {
        const on = MODES[i].id === id;
        b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on));
        if (on) center(b, true);
      });
    }

    /* ---------- base ---------- */
    const thumb = h('button', { class: 'cx-thumb', 'aria-label': 'Abrir o Fotos', title: 'Fotos', on: { click: () => phone.open('galeria') } },
      last ? kit.img(last.src, { alt: 'Última foto', ratio: '1/1' }) : icon('images', { size: 22 }));
    const shutter = h('button', { class: 'cx-shutter', 'aria-label': 'Disparar', on: { click: () => {
      shutter.classList.remove('snap'); void shutter.offsetWidth; shutter.classList.add('snap');
      finder.classList.remove('flash'); void finder.offsetWidth; finder.classList.add('flash');
      sfx.play('tap');
      phone.toast(OFFLINE, { icon: 'camera' });
    } } }, h('span', { class: 'cx-shutter-in' }, h('i')));
    const flip = h('button', { class: 'cx-flip', 'aria-label': 'Alternar câmera', title: 'Alternar câmera', on: { click: () => { sfx.play('tap'); flip.classList.remove('spin'); void flip.offsetWidth; flip.classList.add('spin'); } } }, flipIc());
    const bar = h('div', { class: 'cx-bar' }, thumb, shutter, flip);

    root.dataset.ratio = '3x4';
    root.append(top, finder, modes, bar);
    el.append(root);
    requestAnimationFrame(() => { const b = modeBtns[MODES.findIndex((m) => m.id === mode)]; if (b) center(b, false); });
  },
};
