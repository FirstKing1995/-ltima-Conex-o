// Efeitos sonoros sintetizados (WebAudio). Nenhum arquivo de áudio.
import { state } from './state.js';
let ctx = null;
function ac() {
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, dur = 0.12, { type = 'sine', gain = 0.07, when = 0, slide = 0, attack = 0.005 } = {}) {
  const a = ac(); if (!a) return;
  const t0 = a.currentTime + when;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
function noise(dur = 0.2, gain = 0.04, when = 0) {
  const a = ac(); if (!a) return;
  const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = a.createBufferSource(), g = a.createGain(); s.buffer = buf; g.gain.value = gain;
  s.connect(g).connect(a.destination); s.start(a.currentTime + when);
}
const SOUNDS = {
  tap: () => tone(520, 0.04, { type: 'triangle', gain: 0.03 }),
  type: () => tone(1800 + Math.random() * 400, 0.015, { type: 'square', gain: 0.012 }),
  notify: () => { tone(880, 0.12, { gain: 0.06 }); tone(1320, 0.18, { gain: 0.05, when: 0.1 }); },
  eco: () => { tone(220, 0.08, { type: 'square', gain: 0.03 }); tone(330, 0.08, { type: 'square', gain: 0.03, when: 0.09 }); tone(440, 0.12, { type: 'square', gain: 0.03, when: 0.18 }); },
  unlock: () => { tone(660, 0.1, { gain: 0.05 }); tone(990, 0.16, { gain: 0.05, when: 0.08 }); },
  error: () => { tone(200, 0.16, { type: 'sawtooth', gain: 0.04 }); tone(160, 0.2, { type: 'sawtooth', gain: 0.04, when: 0.12 }); },
  collect: () => { tone(1200, 0.06, { gain: 0.05 }); tone(1600, 0.1, { gain: 0.05, when: 0.05 }); },
  solve: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, { gain: 0.05, when: i * 0.09 })); },
  glitch: () => { noise(0.25, 0.05); tone(90, 0.25, { type: 'sawtooth', gain: 0.04, slide: -40 }); },
  send: () => tone(700, 0.07, { type: 'triangle', gain: 0.04, slide: 300 }),
  pin: () => { tone(980, 0.05, { type: 'triangle', gain: 0.05 }); tone(740, 0.08, { type: 'triangle', gain: 0.04, when: 0.05 }); },
  vibrate: () => { try { navigator.vibrate?.([30, 40, 30]); } catch (e) {} },
};
export const sfx = {
  play(name) { if (!state.settings?.sound) return; try { SOUNDS[name]?.(); } catch (e) {} },
  unlockAudio() { ac(); },
};
