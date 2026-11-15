// Tela de bloqueio de Iara + teclado do PIN (puzzle P0).
import { h, clear, sleep } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { CASE, asset } from '../core/store.js';
import { phone } from './phone.js';
import { sfx } from '../core/sfx.js';
import { state, save, setFlag } from '../core/state.js';
import { bus } from '../core/bus.js';
import { appIconEl, hasAppIcon } from '../ui/appicons.js';

const APPCOLORS = { papo: '#1fa37a', sms: '#5b8def', telefone: '#34c27a', correio: '#e25b45', lume: '#f0567a', jandaia: '#1f9d6b', pulso: '#ef4f6c', agenda: '#4c7ef3', relogio: '#5b6b82' };

const MOON = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>';
const appName = (id) => ({ papo: 'Papo', lume: 'Lume', pulso: 'Pulso', sms: 'Mensagens', correio: 'Correio' }[id] || id);
export function renderLock(el) {
  const meta = CASE.meta || {};
  if (meta.wallpapers?.lock) el.style.backgroundImage = `url("${asset(meta.wallpapers.lock)}")`;
  const notifs = (meta.lockScreen?.notifications || []).slice(0, 4);
  const [hh, mm] = time.hhmm(time.MIRROR_NOW).split(':');
  const d = time.parse(time.MIRROR_NOW);
  const wd = time.weekdayLong(time.MIRROR_NOW).slice(0, 3);
  const date = h('div', { class: 'lk-date' }, `${wd.charAt(0).toUpperCase() + wd.slice(1)}, ${d.getDate()} de out.`);
  const w = h('span', { style: 'display:inline-flex;gap:5px;align-items:center' }); w.innerHTML = MOON; w.append('19°'); date.append(w);
  el.append(
    h('div', { class: 'lk-top' }, date, h('div', { class: 'lk-clock' }, h('span', null, hh), h('span', null, mm))),
    h('div', { class: 'lk-notifs' }, notifs.map(n => h('button', { class: 'lk-notif', on: { click: (e) => { e.stopPropagation(); openPin(el); } } },
      hasAppIcon(n.appId) ? appIconEl(n.appId, 30, 'round') : h('div', { class: 'ap', style: { background: APPCOLORS[n.appId] || '#333' } }, icon(n.icon || 'bell', { size: 16 })),
      h('div', { style: 'min-width:0;flex:1' },
        h('div', { class: 'hd' }, appName(n.appId), h('span', null, '·'), h('span', null, n.at ? time.hhmm(n.at) : '')),
        h('div', { class: 'tt' }, n.title),
        h('div', { class: 'tx txt' }, n.text))))),
    h('div', { class: 'lk-bottom' },
      h('button', { class: 'lk-sc', 'aria-label': 'Telefone', on: { click: (e) => { e.stopPropagation(); emergency(); } } }, icon('phone', { size: 22 })),
      h('button', { class: 'lk-finger', 'aria-label': 'Desbloquear com digital', on: { click: (e) => { e.stopPropagation(); tryFinger(el); } } }, h('span', { class: 'fp' }, icon('fingerprint', { size: 38 }))),
      h('button', { class: 'lk-sc', 'aria-label': 'Câmera', on: { click: (e) => { e.stopPropagation(); phone.toast('Câmera indisponível no espelho', { icon: 'camera' }); } } }, icon('camera', { size: 22 }))));
  el.addEventListener('click', (e) => { if (!e.target.closest('.pin-pad')) openPin(el); });
}

async function tryFinger(el) {
  sfx.play('error');
  phone.toast('Digital não reconhecida. Use o PIN.', { icon: 'fingerprint' });
  await sleep(500);
  openPin(el);
}

function emergency() {
  const rows = CASE.meta?.lockScreen?.emergency || [];
  const body = h('div', { style: 'display:flex;flex-direction:column;gap:6px;margin-bottom:8px' }, rows.map(([k, v]) => h('div', null, h('div', { style: 'font-size:12px;color:var(--ph-mut)' }, k), h('div', { class: 'txt', style: 'font-size:15px' }, v))));
  phone.dialog({ title: 'Informações de emergência', body, actions: [{ label: 'Fechar', value: true, primary: true }] });
}

function lockoutLeft() { const until = state.apps.lockoutUntil || 0; return Math.max(0, Math.ceil((until - Date.now()) / 1000)); }

function openPin(lockEl) {
  if (lockEl.querySelector('.pin-pad')) return;
  let val = '';
  const dots = h('div', { class: 'pin-dots' }, [0, 1, 2, 3].map(() => h('i')));
  const msg = h('div', { class: 'pin-msg', role: 'status' });
  const pad = h('div', { class: 'pin-pad', role: 'dialog', 'aria-label': 'Digite o PIN' },
    icon('lock', { size: 22, className: 'lockic' }),
    h('h3', null, 'Digite o PIN'),
    dots, msg);
  const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']];
  const grid = h('div', { class: 'pin-keys' });
  const draw = () => dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i < val.length));
  const press = async (k) => {
    if (lockoutLeft()) return;
    sfx.play('tap');
    if (k === 'del') { val = val.slice(0, -1); draw(); return; }
    if (val.length >= 4) return;
    val += k; draw();
    if (val.length === 4) {
      const attempt = val;
      const ok = await phone.game.verify('pin', attempt);
      phone.game.api?.event('pin_tentativa', ok ? 'ok' : 'erro');
      if (ok) {
        msg.textContent = '';
        state.apps.pinFails = 0; save();
        await sleep(150);
        phone.unlock();
        return;
      }
      sfx.play('error'); sfx.play('vibrate');
      pad.classList.remove('shake'); void pad.offsetWidth; pad.classList.add('shake');
      state.apps.pinFails = (state.apps.pinFails || 0) + 1;
      bus.emit('pin:fail', { n: state.apps.pinFails });
      if (state.apps.pinFails >= 3) setFlag('pin_falhou_3');
      if (state.apps.pinFails >= 6) setFlag('pin_falhou_6');
      if (state.apps.pinFails % 5 === 0) { state.apps.lockoutUntil = Date.now() + 30000; save(); countdown(); }
      else msg.textContent = 'PIN incorreto';
      await sleep(380); val = ''; draw();
    }
  };
  const countdown = () => {
    const t = setInterval(() => { const s = lockoutLeft(); msg.textContent = s ? `Muitas tentativas. Tente de novo em ${s} s` : ''; if (!s) clearInterval(t); }, 250);
  };
  for (const [n, l] of keys) grid.appendChild(h('button', { 'aria-label': n, on: { click: () => press(n) } }, n, h('small', null, l || ' ')));
  grid.append(
    h('button', { class: 'ghost', on: { click: () => close() } }, 'Cancelar'),
    h('button', { 'aria-label': '0', on: { click: () => press('0') } }, '0', h('small', null, '+')),
    h('button', { class: 'ghost', 'aria-label': 'Apagar', on: { click: () => press('del') } }, icon('delete', { size: 24 })));
  pad.appendChild(grid);
  pad.appendChild(h('button', { class: 'pin-emerg', on: { click: () => emergency() } }, 'Emergência'));
  const close = () => { pad.remove(); document.removeEventListener('keydown', onKey); lockEl.removeEventListener('lock:back', close); };
  const onKey = (e) => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); };
  document.addEventListener('keydown', onKey);
  lockEl.addEventListener('lock:back', close);
  lockEl.appendChild(pad);
  if (lockoutLeft()) countdown();
}
