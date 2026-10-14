// Fachada do jogo usada pelos apps e telas: game.see / pin / collect / verify / deduções.
import { state, setFlag, setFlags, evalReq, markSeen, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { CASE } from '../core/store.js';
import { check } from '../core/hash.js';
import { api, cloudSaveSoon } from '../core/api.js';
import { sfx } from '../core/sfx.js';
import { analysis } from './analysis.js';

const termIndex = () => {
  if (!termIndex.map) { termIndex.map = new Map((CASE.terms?.terms || []).map(t => [t.id, t])); }
  return termIndex.map;
};

export const game = {
  api,
  analysis,
  eco: null,     // definido por js/game/eco.js
  board: null,   // definido por js/game/board.js

  /** Marca algo como visto (abre objetivos, gatilhos do ECO, dossiês). */
  see(key) { return markSeen(key); },
  req(item) { return !item || evalReq(item.req); },
  flag(name) { return setFlag(name); },
  flags(list) { setFlags(list); },
  has(expr) { return evalReq(expr); },

  /* ---------- Quadro: provas fixadas ---------- */
  pin({ key, label, app, detail }) {
    if (!key || game.isPinned(key)) return;
    state.pins.push({ key, label: String(label || key).slice(0, 140), app, detail: detail ? String(detail).slice(0, 220) : '', at: Date.now() });
    save(); bus.emit('pin', { key }); api.event('fixou', key);
  },
  unpin(key) { state.pins = state.pins.filter(p => p.key !== key); save(); bus.emit('pin', { key, removed: true }); },
  isPinned(key) { return state.pins.some(p => p.key === key); },

  /* ---------- termos (lupa) ---------- */
  collect(termId) {
    if (!termId || state.terms[termId]) return false;
    if (!termIndex().has(termId)) return false;
    state.terms[termId] = Date.now();
    save(); sfx.play('collect');
    bus.emit('term', { id: termId });
    return true;
  },
  hasTerm: (id) => !!state.terms[id],
  term: (id) => termIndex().get(id) || null,
  terms(cat) { return Object.keys(state.terms).map(id => termIndex().get(id)).filter(t => t && (!cat || t.cat === cat)); },

  /* ---------- puzzles ---------- */
  async verify(puzzleId, value) {
    const p = CASE.puzzles?.[puzzleId];
    const hash = CASE.answers?.puzzles?.[puzzleId];
    if (!p || !hash) return false;
    if (p.req && !evalReq(p.req)) return false;
    const ok = await check(hash, `${CASE.answers.salt}|${puzzleId}`, value);
    if (ok) { setFlags(p.onSolve); sfx.play('unlock'); api.event('puzzle_ok', puzzleId); cloudSaveSoon(); }
    else { api.event('puzzle_erro', puzzleId); }
    return ok;
  },

  /* ---------- deduções ---------- */
  deduction(id) { return CASE.chapters?.deductions?.[id] || null; },
  setAnswer(blankId, value) { if (value) state.answers[blankId] = value; else delete state.answers[blankId]; save(); bus.emit('answer', { blankId, value }); },
  answer: (blankId) => state.answers[blankId] || null,

  /** Confere uma dedução. Retorna {blocks:{id:{total,wrong,empty,correct,bonus}}, allCorrect, filled} */
  async checkDeduction(id) {
    const d = game.deduction(id);
    const salt = CASE.answers?.salt || 'uc01';
    const res = { blocks: {}, allCorrect: true, filled: true, correctCount: 0, totalCount: 0 };
    if (!d) return res;
    for (const blk of d.blocks) {
      const blanks = blk.parts.filter(p => p && typeof p === 'object');
      let wrong = 0, empty = 0;
      for (const bl of blanks) {
        const v = state.answers[bl.b];
        if (!v) { empty++; continue; }
        const ok = await check(CASE.answers?.blanks?.[bl.b], `${salt}|${bl.b}`, v);
        if (!ok) wrong++;
        else if (!blk.bonus) res.correctCount++;
      }
      if (!blk.bonus) res.totalCount += blanks.length;
      res.blocks[blk.id] = { total: blanks.length, wrong, empty, correct: !wrong && !empty, bonus: !!blk.bonus };
      if (!blk.bonus && (wrong || empty)) res.allCorrect = false;
      if (!blk.bonus && empty) res.filled = false;
    }
    return res;
  },

  /** Envia uma dedução. Se tudo certo, resolve (flags onSolve). Retorna o resultado de checkDeduction + {solved}. */
  async submitDeduction(id) {
    const d = game.deduction(id);
    const r = await game.checkDeduction(id);
    if (!d) return r;
    if (d.final) state.reportAttempts++;
    if (r.allCorrect) {
      if (!state.solved[id]) { state.solved[id] = Date.now(); setFlags(d.onSolve); sfx.play('solve'); bus.emit('solve', { id }); }
      api.event('deducao_ok', id);
      r.solved = true;
    } else {
      const wrongBlanks = Object.values(r.blocks).filter(b => !b.bonus).reduce((a, b) => a + b.wrong, 0);
      state.wrong += Math.max(1, wrongBlanks);
      sfx.play('error');
      api.event('deducao_erro', `${id}:${wrongBlanks}`);
      r.solved = false;
    }
    if (d.final) {
      const blockA = r.blocks[d.blocks[0].id];
      const bonus = Object.values(r.blocks).find(b => b.bonus);
      r.ending = r.allCorrect ? 'verdade' : (blockA?.correct ? 'incompleto' : 'errado');
      r.bonus = !!bonus?.correct;
      state.finalResult = { ending: r.ending, bonus: r.bonus, at: Date.now(), correct: r.correctCount, total: r.totalCount };
    }
    save(true); cloudSaveSoon();
    return r;
  },

  /** Pontuação (mesma fórmula da API). */
  score() {
    const fr = state.finalResult || {};
    const total = fr.total || 1, acertos = fr.correct || 0;
    const tempo = state.playMs / 60000;
    const dicas = Object.values(state.hints).reduce((a, b) => a + (b || 0), 0);
    let p = Math.round(1000 * (acertos / total)) + Math.max(0, Math.round(400 - tempo * 2)) - dicas * 25 - state.wrong * 10 - Math.max(0, state.reportAttempts - 1) * 100;
    return { pontos: Math.max(0, p), acertos, total, tempo_min: Math.round(tempo * 10) / 10, dicas, erros: state.wrong, tentativa: Math.max(1, state.reportAttempts) };
  },
};

window.__game = game; // depuração
