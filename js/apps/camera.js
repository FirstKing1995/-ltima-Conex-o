// Câmera — visor escuro com grade. No espelho ela não captura nada; a miniatura leva à Galeria.
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';

const MODES = [{ id: 'foto', label: 'FOTO' }, { id: 'video', label: 'VÍDEO' }, { id: 'retrato', label: 'RETRATO' }];
const FLASH = [['off', 'Flash desligado'], ['auto', 'Flash automático'], ['on', 'Flash ligado']];
const TIMER = [['0', 'Temporizador desligado'], ['3', 'Temporizador de 3 segundos'], ['10', 'Temporizador de 10 segundos']];
const ZOOMS = ['0,6', '1×', '2×', '5×'];

// "raio" (o Lucide embutido não tem) no mesmo formato dos outros ícones
const bolt = (off) => {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ic" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>${off ? '<path d="M3 3l18 18"/>' : ''}</svg>`;
  return t.content.firstChild;
};

export default {
  id: 'camera',
  title: 'Câmera',
  cloud: false,

  render(ctx) {
    const { el, kit, phone, game, data } = ctx;

    // a última foto do aparelho vira a miniatura (fora da Pasta Segura e da Lixeira)
    const last = (data.photos || [])
      .filter((p) => game.req(p) && p.album !== 'segura' && p.album !== 'lixeira' && !p.deletedAt)
      .sort((a, b) => time.compare(b.at, a.at))[0] || null;

    let mode = 'foto';
    let flash = 0, timer = 0, zoom = 1;

    const root = h('div', { class: 'cm-root cm-mode-foto' });

    /* ---------- topo ---------- */
    const flashBtn = h('button', { class: 'cm-tool', 'aria-label': FLASH[0][1], title: FLASH[0][1] }, bolt(true));
    flashBtn.addEventListener('click', () => {
      flash = (flash + 1) % FLASH.length;
      flashBtn.replaceChildren(...[bolt(flash === 0), flash === 1 ? h('small', null, 'A') : null].filter(Boolean));
      flashBtn.classList.toggle('on', flash > 0);
      flashBtn.setAttribute('aria-label', FLASH[flash][1]);
      flashBtn.title = FLASH[flash][1];
    });
    const timerBtn = h('button', { class: 'cm-tool', 'aria-label': TIMER[0][1], title: TIMER[0][1] }, icon('timer', { size: 22 }));
    timerBtn.addEventListener('click', () => {
      timer = (timer + 1) % TIMER.length;
      timerBtn.replaceChildren(...[icon('timer', { size: 22 }), timer ? h('small', null, TIMER[timer][0] + 's') : null].filter(Boolean));
      timerBtn.classList.toggle('on', timer > 0);
      timerBtn.setAttribute('aria-label', TIMER[timer][1]);
      timerBtn.title = TIMER[timer][1];
    });
    const ratio = h('button', { class: 'cm-chip', 'aria-label': 'Proporção 3:4' }, '3:4');
    const top = h('div', { class: 'cm-top' },
      kit.iconButton({ icon: 'arrow-left', label: 'Voltar', className: 'cm-back', onClick: () => phone.back() }),
      h('span', { class: 'cm-sp' }),
      flashBtn, timerBtn, ratio,
      h('button', { class: 'cm-tool', 'aria-label': 'Configurações da câmera', title: 'Configurações', on: { click: () => phone.toast('Câmera indisponível no espelho', { icon: 'camera' }) } }, icon('settings', { size: 22 })));

    /* ---------- visor ---------- */
    const focus = h('div', { class: 'cm-focus', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('i'));
    const hint = h('div', { class: 'cm-hint' },
      h('span', { class: 'cm-hint-ic' }, icon('camera', { size: 26, stroke: 1.5 })),
      h('b', null, 'Sem imagem'),
      h('small', null, 'Este é um espelho do aparelho. O visor não recebe sinal.'));
    const zoomRow = h('div', { class: 'cm-zoom', role: 'group', 'aria-label': 'Zoom' },
      ZOOMS.map((z, i) => h('button', {
        class: `cm-z${i === 1 ? ' on' : ''}`, 'aria-label': `Zoom ${z}`,
        on: { click: (e) => { zoom = i; zoomRow.querySelectorAll('.cm-z').forEach((b, k) => b.classList.toggle('on', k === zoom)); e.stopPropagation(); } },
      }, z)));
    const finder = h('div', { class: 'cm-finder', on: { click: (e) => ping(e) } },
      h('div', { class: 'cm-vig' }),
      h('div', { class: 'cm-grid', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('i')),
      hint, focus, zoomRow);

    function ping(e) {
      const r = finder.getBoundingClientRect();
      const x = Math.max(44, Math.min(r.width - 44, e.clientX - r.left));
      const y = Math.max(44, Math.min(r.height - 44, e.clientY - r.top));
      focus.style.left = x + 'px';
      focus.style.top = y + 'px';
      focus.classList.remove('show'); void focus.offsetWidth; focus.classList.add('show');
    }

    /* ---------- modos ---------- */
    const modeBtns = MODES.map((m) => h('button', { class: `cm-mode${m.id === mode ? ' on' : ''}`, role: 'tab', 'aria-selected': String(m.id === mode), on: { click: () => setMode(m.id) } }, m.label));
    const modes = h('div', { class: 'cm-modes', role: 'tablist', 'aria-label': 'Modo da câmera' }, modeBtns);
    function setMode(id) {
      mode = id;
      root.className = `cm-root cm-mode-${id}`;
      modeBtns.forEach((b, i) => { const on = MODES[i].id === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
    }

    /* ---------- base ---------- */
    const thumb = h('button', { class: 'cm-thumb', 'aria-label': 'Abrir a Galeria', title: 'Galeria', on: { click: () => phone.open('galeria') } },
      last ? kit.img(last.src, { alt: 'Última foto', ratio: '1/1' }) : icon('images', { size: 22 }));
    const shutter = h('button', { class: 'cm-shutter', 'aria-label': 'Disparar', on: { click: () => {
      shutter.classList.remove('snap'); void shutter.offsetWidth; shutter.classList.add('snap');
      phone.toast('Câmera indisponível no espelho', { icon: 'camera' });
    } } }, h('span', { class: 'cm-shutter-in' }, h('i')));
    const flip = h('button', { class: 'cm-flip', 'aria-label': 'Alternar câmera', title: 'Alternar câmera', on: { click: () => { flip.classList.remove('spin'); void flip.offsetWidth; flip.classList.add('spin'); } } }, icon('refresh-cw', { size: 24 }));
    const bar = h('div', { class: 'cm-bar' }, thumb, shutter, flip);

    root.append(top, finder, modes, bar);
    el.append(root);
  },
};
