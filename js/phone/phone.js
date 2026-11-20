// O shell do celular: barra de status, pilha de telas, apps, modais, notificações.
import { h, clear, sleep } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as kit from '../ui/kit.js';
import * as time from '../core/time.js';
import * as store from '../core/store.js';
import { bus } from '../core/bus.js';
import { sfx } from '../core/sfx.js';
import { state, save } from '../core/state.js';
import { APPS, appInfo, loadApp } from '../apps/index.js';

let root, screensEl, statusEl, gestureEl, game;
const stack = [];       // telas: {el, kind:'home'|'app'|'sub', appId, params, onBack}
const modals = [];      // {el, close}
let lockLayer = null;

const svgEl = (markup) => { const t = document.createElement('template'); t.innerHTML = markup.trim(); return t.content.firstChild; };
// ícones de sistema no padrão Android (preenchidos)
const SB = {
  signal: (lvl = 3) => svgEl(`<svg class="sb-ic" viewBox="0 0 18 14" width="17" height="14">${[0, 1, 2, 3].map(i => `<rect x="${i * 4.6}" y="${10 - i * 3.2}" width="3.2" height="${3.6 + i * 3.2}" rx=".9" fill="currentColor" opacity="${i < lvl ? 1 : .32}"/>`).join('')}</svg>`),
  batt: (pct) => svgEl(`<svg class="sb-ic sb-batt" viewBox="0 0 26 14" width="25" height="14"><rect x=".75" y=".75" width="21.5" height="12.5" rx="3.6" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5"/><rect x="23.3" y="4.4" width="2" height="5.2" rx="1" fill="currentColor" fill-opacity=".55"/><rect x="2.6" y="2.6" width="${Math.max(1.5, 17.8 * pct / 100).toFixed(1)}" height="8.8" rx="2" fill="currentColor"/></svg>`),
  // pequenos ícones de notificação pendente (monocromáticos)
  papo: () => svgEl('<svg class="sb-ic sb-n" viewBox="0 0 16 16" width="13" height="13"><path fill="currentColor" d="M8 1.5C4.2 1.5 1.3 4.2 1.3 7.6c0 1.3.4 2.5 1.2 3.5l-.7 2.6c-.1.3.2.5.5.4l2.7-1.2c.9.4 1.9.6 3 .6 3.8 0 6.7-2.7 6.7-6S11.8 1.5 8 1.5z"/></svg>'),
  lume: () => svgEl('<svg class="sb-ic sb-n" viewBox="0 0 16 16" width="13" height="13"><circle cx="8" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 1v1.8M8 13.2V15M1 8h1.8M13.2 8H15M3 3l1.3 1.3M11.7 11.7 13 13M13 3l-1.3 1.3M4.3 11.7 3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'),
  pulso: () => svgEl('<svg class="sb-ic sb-n" viewBox="0 0 16 16" width="13" height="13"><path fill="currentColor" d="M8 14S1.5 10.2 1.5 5.6C1.5 3.6 3 2 4.9 2c1.3 0 2.4.7 3.1 1.8C8.7 2.7 9.8 2 11.1 2 13 2 14.5 3.6 14.5 5.6 14.5 10.2 8 14 8 14z"/></svg>'),
};

function statusBar() {
  const meta = store.CASE.meta || {};
  const batt = meta.device?.battery ?? 41;
  const apps = [...new Set((meta.lockScreen?.notifications || []).map(n => n.appId))].filter(a => SB[a]);
  return h('div', { class: 'ph-status', 'aria-hidden': 'true' },
    h('span', { class: 'time' }, time.hhmm(time.MIRROR_NOW)),
    h('span', { class: 'sb-notifs' }, apps.map(a => SB[a]())),
    h('span', { class: 'sp' }),
    h('span', { class: 'sb-net' }, '4G'),
    SB.signal(2),
    h('span', { class: 'batt' }, SB.batt(batt), h('span', { class: 'pct' }, `${batt}%`)));
}

export const phone = {
  mount(el, gameApi) {
    root = el; game = gameApi;
    clear(root);
    statusEl = statusBar();
    screensEl = h('div', { class: 'ph-screens' });
    // Barra de navegação do Android (3 botões): voltar, início, recentes. Vale em todos os apps.
    const nb = (cls, label, svg, fn) => { const b = h('button', { class: 'nb-' + cls, 'aria-label': label, on: { click: (e) => { e.stopPropagation(); fn(); } } }); b.innerHTML = svg; return b; };
    gestureEl = h('div', { class: 'ph-navbar' },
      nb('back', 'Voltar', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 4.6v14.8L5.2 12z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>', () => { if (document.querySelector('#overlay-root > *')) { bus.emit('overlay:back'); return; } phone.back(); }),
      nb('home', 'Início', '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.4" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>', () => phone.home()),
      nb('recent', 'Apps recentes', '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.6" y="5.6" width="12.8" height="12.8" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>', () => phone.home()));
    root.append(screensEl, statusEl, h('div', { class: 'ph-cam' }), gestureEl);
    statusEl.style.pointerEvents = 'auto';
    statusEl.addEventListener('click', () => phone.openShade?.());
    kit._bind(phone, game);
    phone.applySettings();
    // voltar do navegador / gesto do celular = voltar no jogo
    history.pushState({ uc: 1 }, '');
    window.addEventListener('popstate', () => { history.pushState({ uc: 1 }, ''); if (document.querySelector('#overlay-root > *')) { bus.emit('overlay:back'); return; } phone.back(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.isConnected && !document.querySelector('#overlay-root > *')) phone.back(); });
  },

  applySettings() {
    if (!root) return;
    root.classList.toggle('text-l', state.settings.textSize === 'l');
    root.classList.toggle('text-s', state.settings.textSize === 's');
  },

  get root() { return root; },
  get game() { return game; },
  current() { const top = [...stack].reverse().find(s => s.kind === 'app'); return top ? { appId: top.appId, params: top.params } : null; },
  isLocked() { return !!lockLayer; },

  /* ---------- bloqueio ---------- */
  showLock(renderLock) {
    if (lockLayer) lockLayer.remove();
    lockLayer = h('div', { class: 'ph-screen lock' });
    screensEl.appendChild(lockLayer);
    renderLock(lockLayer);
    phone.scan(lockLayer);
  },
  async unlock() {
    if (!lockLayer) return;
    const l = lockLayer; lockLayer = null;
    l.style.transition = 'transform 380ms var(--ease), opacity 380ms';
    l.style.transform = 'translateY(-8%)'; l.style.opacity = '0';
    sfx.play('unlock');
    await sleep(380); l.remove();
    bus.emit('phone:unlocked');
  },

  /* ---------- home ---------- */
  setHome(renderHome) {
    let homeEl = stack.find(s => s.kind === 'home');
    if (!homeEl) {
      const el = h('div', { class: 'ph-screen home' });
      screensEl.prepend(el);
      homeEl = { el, kind: 'home' };
      stack.unshift(homeEl);
    }
    clear(homeEl.el);
    renderHome(homeEl.el);
  },
  async home() {
    closeAllModals();
    const tops = stack.filter(s => s.kind !== 'home');
    if (!tops.length) return;
    for (const s of tops) { s.el.classList.add('app-leave'); }
    stack.splice(1);
    sfx.play('tap');
    bus.emit('app:close', {});
    await sleep(240);
    tops.forEach(s => s.el.remove());
    bus.emit('home');
  },

  /* ---------- apps ---------- */
  async open(appId, params = {}) {
    const info = appInfo(appId);
    if (!info) return phone.toast('App indisponível');
    if (lockLayer) return;
    closeAllModals();
    // reabrir o mesmo app: volta à raiz dele com os novos params
    const existing = stack.filter(s => s.kind !== 'home');
    const el = h('div', { class: `ph-screen app-screen app-${appId} app-enter` });
    const body = h('div', { class: 'ph-body' });
    el.appendChild(body);
    screensEl.appendChild(el);
    const entry = { el, kind: 'app', appId, params };
    stack.push(entry);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('app-enter')));
    existing.forEach(s => setTimeout(() => s.el.remove(), 260));
    stack.splice(1, stack.length - 2);
    let mod;
    try { mod = await loadApp(appId); }
    catch (e) { console.error(e); body.appendChild(h('div', { class: 'app-wip' }, kit.appBar({ title: info.title }), kit.empty({ icon: 'triangle-alert', title: 'Não foi possível abrir', text: String(e.message || e) }))); return; }
    const ctx = makeCtx(entry, body, mod, params);
    try { mod.render(ctx); mod.onOpen?.(ctx); }
    catch (e) { console.error(`[app ${appId}]`, e); body.appendChild(kit.empty({ icon: 'triangle-alert', title: 'Erro no app', text: String(e.message || e) })); }
    phone.scan(el);
    game?.see(`app:${appId}`);
    bus.emit('app:open', { id: appId, params });
    return ctx;
  },

  /** Empilha subtela dentro do app atual. */
  push(spec) {
    const parent = stack[stack.length - 1];
    const el = h('div', { class: `ph-screen sub-screen ${spec.className || ''} enter` });
    const body = h('div', { class: 'ph-body' });
    el.appendChild(body);
    screensEl.appendChild(el);
    const entry = { el, kind: 'sub', appId: parent?.appId, params: spec.params || {}, onBack: spec.onBack };
    stack.push(entry);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.remove('enter'); parent?.el.classList.add('under'); }));
    const nav = navFor(entry, body);
    try { spec.render(body, nav); } catch (e) { console.error(e); body.appendChild(kit.empty({ icon: 'triangle-alert', title: 'Erro', text: String(e.message || e) })); }
    phone.scan(el);
    return nav;
  },

  async back() {
    if (modals.length) { modals[modals.length - 1].close(); return; }
    if (lockLayer) { lockLayer.dispatchEvent(new CustomEvent('lock:back')); return; }
    const top = stack[stack.length - 1];
    if (!top || top.kind === 'home') return;
    if (top.onBack && top.onBack() === false) return;
    if (top.kind === 'app') return phone.home();
    stack.pop();
    const under = stack[stack.length - 1];
    top.el.classList.add('leave');
    under?.el.classList.remove('under');
    under?.refresh?.();
    sfx.play('tap');
    await sleep(240);
    top.el.remove();
  },

  /* ---------- modais ---------- */
  _mountModal(el, close) { root.appendChild(el); modals.push({ el, close }); },
  modal(el, close) { phone._mountModal(el, close); },
  _popModal(close) { const i = modals.findIndex(m => m.close === close); if (i >= 0) modals.splice(i, 1); },

  sheet({ title, render }) {
    return new Promise((resolve) => {
      const sheet = h('div', { class: 'k-sheet', role: 'dialog', 'aria-label': title || 'Painel' }, h('div', { class: 'grab' }), title ? h('h3', null, title) : null);
      const body = h('div', { class: 'body' });
      sheet.appendChild(body);
      const ov = h('div', { class: 'ph-overlay' }, h('div', { class: 'scrim2', on: { click: () => close() } }), sheet);
      const close = (v) => { ov.classList.remove('show'); phone._popModal(close); setTimeout(() => ov.remove(), 240); resolve(v); };
      phone._mountModal(ov, close);
      render(body, close);
      phone.scan(body);
      requestAnimationFrame(() => ov.classList.add('show'));
    });
  },

  dialog({ title = '', text = '', actions = [{ label: 'OK', value: true, primary: true }], body } = {}) {
    return new Promise((resolve) => {
      const dlg = h('div', { class: 'k-dialog', role: 'alertdialog', 'aria-label': title },
        title ? h('h3', null, title) : null, text ? h('p', { class: 'txt' }, text) : null, body || null,
        h('div', { class: 'acts' }, actions.map(a => h('button', { class: `k-btn ${a.primary ? 'filled' : a.danger ? 'danger' : 'text'}`, on: { click: () => close(a.value) } }, a.label))));
      const ov = h('div', { class: 'ph-overlay center' }, h('div', { class: 'scrim2', on: { click: () => close(undefined) } }), dlg);
      const close = (v) => { ov.classList.remove('show'); phone._popModal(close); setTimeout(() => ov.remove(), 200); resolve(v); };
      phone._mountModal(ov, close);
      phone.scan(dlg);
      requestAnimationFrame(() => ov.classList.add('show'));
    });
  },

  prompt({ title = '', text = '', placeholder = '', type = 'text', confirmLabel = 'OK', cancelLabel = 'Cancelar', check, value = '' } = {}) {
    return new Promise((resolve) => {
      const inp = h('input', { type: type === 'password' ? 'password' : type === 'number' ? 'tel' : 'text', placeholder, value, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', inputmode: type === 'number' ? 'numeric' : 'text' });
      const err = h('div', { class: 'err', role: 'status' });
      const ok = h('button', { class: 'k-btn filled' }, confirmLabel);
      const dlg = h('div', { class: 'k-dialog', role: 'dialog', 'aria-label': title }, title ? h('h3', null, title) : null, text ? h('p', null, text) : null, inp, err,
        h('div', { class: 'acts' }, h('button', { class: 'k-btn text', on: { click: () => close(null) } }, cancelLabel), ok));
      const ov = h('div', { class: 'ph-overlay center' }, h('div', { class: 'scrim2' }), dlg);
      const close = (v) => { ov.classList.remove('show'); phone._popModal(close); setTimeout(() => ov.remove(), 200); resolve(v); };
      const submit = async () => {
        const v = inp.value;
        if (!check) return close(v);
        ok.disabled = true;
        const r = await check(v);
        ok.disabled = false;
        if (r === true) return close(v);
        err.textContent = typeof r === 'string' ? r : 'Não confere.';
        sfx.play('error');
        dlg.animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], { duration: 260 });
        inp.select();
      };
      ok.addEventListener('click', submit);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      phone._mountModal(ov, close);
      requestAnimationFrame(() => { ov.classList.add('show'); setTimeout(() => inp.focus(), 120); });
    });
  },

  toast(text, { icon: ic, ms = 2400 } = {}) {
    const t = h('div', { class: 'k-toast', role: 'status' }, ic ? icon(ic, { size: 18 }) : null, text);
    root.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
  },

  notify({ icon: ic = 'square-terminal', app = 'Aviso', title = '', text = '', onTap, ms = 5200 } = {}) {
    const n = h('button', { class: 'ph-heads', 'aria-live': 'polite' }, h('div', { class: 'ap' }, icon(ic, { size: 18 })),
      h('div', { style: 'min-width:0' }, h('div', { class: 'tt' }, title || app, h('span', null, 'agora')), h('div', { class: 'tx' }, text)));
    root.appendChild(n);
    sfx.play('notify'); sfx.play('vibrate');
    requestAnimationFrame(() => n.classList.add('show'));
    const hide = () => { n.classList.remove('show'); setTimeout(() => n.remove(), 350); };
    n.addEventListener('click', () => { hide(); onTap?.(); });
    setTimeout(hide, ms);
  },

  /** Aplica o Modo Análise (lupa) no elemento, se ligado. */
  scan(el) { try { game?.analysis?.scan(el); } catch (e) { console.warn(e); } },
};

function navFor(entry, body) {
  return {
    push: (spec) => phone.push(spec),
    back: () => phone.back(),
    replace: (spec) => { clear(body); spec.render(body, navFor(entry, body)); phone.scan(entry.el); },
    setTitle: (t) => { const h1 = entry.el.querySelector('.k-appbar h1'); if (h1) h1.textContent = t; },
    refresh: (fn) => { entry.refresh = fn; },
    el: body,
  };
}

function makeCtx(entry, body, mod, params) {
  const info = appInfo(entry.appId);
  return {
    el: body, screen: entry.el, params, phone, game, store, kit, h, time, icon,
    app: info, nav: navFor(entry, body),
    data: store.CASE[info.dataKey || entry.appId] || {},
    now: mod.cloud ? time.PRESENT_NOW : time.MIRROR_NOW,
  };
}

function closeAllModals() { while (modals.length) modals[modals.length - 1].close(); }

// Observa mudanças no celular para reaplicar a lupa em conteúdo novo.
const mo = new MutationObserver((muts) => {
  if (!state.settings.analysis) return;
  for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1 && !n.closest?.('mark.term')) phone.scan(n);
});
bus.on('analysis', ({ on }) => { if (on && root) { mo.observe(root, { childList: true, subtree: true }); phone.scan(root); } else mo.disconnect(); });
bus.on('settings', () => phone.applySettings());

export { APPS };
