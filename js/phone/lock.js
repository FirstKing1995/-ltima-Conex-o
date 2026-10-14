// Tela de bloqueio de Iara + teclado do PIN (puzzle P0).
import { h, clear, sleep } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { CASE, asset } from '../core/store.js';
import { phone } from './phone.js';
import { sfx } from '../core/sfx.js';
import { state, save } from '../core/state.js';
import { bus } from '../core/bus.js';

const APPCOLORS = { papo: '#1fa37a', sms: '#5b8def', telefone: '#34c27a', correio: '#e25b45', lume: '#f0567a', jandaia: '#1f9d6b', pulso: '#ef4f6c', agenda: '#4c7ef3', relogio: '#5b6b82' };

export function renderLock(el) {
  const meta = CASE.meta || {};
  el.style.backgroundImage = meta.wallpapers?.lock ? `url("${asset(meta.wallpapers.lock)}")` : 'linear-gradient(160deg,#3a2a22,#101317)';
  const notifs = (meta.lockScreen?.notifications || []).slice(0, 4);
  el.append(
    h('div', { class: 'lock-clock' },
      h('div', { class: 't' }, time.hhmm(time.MIRROR_NOW)),
      h('div', { class: 'd' }, `${time.weekdayLong(time.MIRROR_NOW)}, ${time.parse(time.MIRROR_NOW).getDate()} de outubro`)),
    h('div', { class: 'lock-notifs' }, notifs.map(n => h('div', { class: 'lock-notif' },
      h('div', { class: 'ap', style: { background: APPCOLORS[n.appId] || '#333' } }, icon(n.icon || 'bell', { size: 16 })),
      h('div', { style: 'min-width:0' }, h('div', { class: 'tt' }, n.title, h('span', null, n.at ? time.hhmm(n.at) : '')), h('div', { class: 'tx txt' }, n.text))))),
    h('div', { class: 'lock-bottom' },
      h('div', { class: 'lock-hint' }, icon('fingerprint', { size: 18 }), 'Toque para desbloquear'),
      h('div', { class: 'lock-row' },
        h('button', { class: 'lock-round', 'aria-label': 'Telefone de emergência', on: { click: () => emergency() } }, icon('phone', { size: 20 })),
        h('button', { class: 'lock-round', style: 'width:64px;height:64px', 'aria-label': 'Desbloquear', on: { click: () => tryFinger(el) } }, icon('fingerprint', { size: 30 })),
        h('button', { class: 'lock-round', 'aria-label': 'Câmera', on: { click: () => phone.toast('Câmera indisponível no espelho', { icon: 'camera' }) } }, icon('camera', { size: 20 }))),
      h('button', { class: 'lock-emerg', on: { click: () => emergency() } }, 'Informações de emergência')));
  el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('.lock-clock')) openPin(el); });
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
    h('div', { class: 'who' }, 'Iara Fontenele'),
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
  const close = () => { pad.remove(); document.removeEventListener('keydown', onKey); lockEl.removeEventListener('lock:back', close); };
  const onKey = (e) => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); };
  document.addEventListener('keydown', onKey);
  lockEl.addEventListener('lock:back', close);
  lockEl.appendChild(pad);
  if (lockoutLeft()) countdown();
}
