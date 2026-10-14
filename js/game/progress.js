// Progresso: capítulos, objetivos e conquistas, reavaliados a cada flag nova.
import { state, setFlag, setFlags, evalReq, save } from '../core/state.js';
import { bus } from '../core/bus.js';
import { CASE } from '../core/store.js';
import { api, cloudSaveSoon } from '../core/api.js';
import { sfx } from '../core/sfx.js';

let busy = false, again = false;

export function chapters() { return CASE.chapters?.chapters || []; }
export function chapter(n) { return chapters().find(c => c.n === n) || null; }
export function currentChapter() { return chapter(state.chapter) || chapters()[0] || null; }
export const objectiveDone = (id) => !!state.objectives[id];

export function evaluate() {
  if (busy) { again = true; return; }
  busy = true;
  try {
    let guard = 0;
    do {
      again = false;
      for (const c of chapters()) {
        // início de capítulo
        if (evalReq(c.startWhen) && !state.flags[`chapter_started:${c.n}`]) {
          setFlag(`chapter_started:${c.n}`);
          if (c.n >= state.chapter) state.chapter = c.n;
          bus.emit('chapter', { n: c.n });
          api.event('capitulo', String(c.n));
          cloudSaveSoon();
        }
        if (!state.flags[`chapter_started:${c.n}`]) continue;
        // objetivos
        let all = true;
        for (const o of (c.objectives || [])) {
          if (!state.objectives[o.id] && evalReq(o.doneWhen)) {
            state.objectives[o.id] = Date.now();
            bus.emit('objective', { id: o.id, chapter: c.n, text: o.text });
            api.event('objetivo', o.id);
            sfx.play('collect');
          }
          if (!state.objectives[o.id]) all = false;
        }
        if (all && c.allDoneFlag) setFlag(c.allDoneFlag);
        if (all) setFlag(`objectives_done:${c.n}`);
        // conclusão
        if (c.completeWhen && evalReq(c.completeWhen) && !state.flags[`chapter_done:${c.n}`]) {
          setFlag(`chapter_done:${c.n}`);
          setFlags(c.onComplete || []);
          bus.emit('chapter:done', { n: c.n });
        }
      }
      checkAchievements();
    } while (again && ++guard < 10);
  } finally { busy = false; save(); }
}

/* ---------- conquistas ---------- */
const ACH = [
  { id: 'arqueologo', title: 'Arqueólogo', text: 'Encontrou tudo o que foi apagado.', when: 'seen:config:notif-history && seen:gravador:rec:g-2332 && seen:papo:chat:numero-desconhecido' },
  { id: 'serra', title: 'Serra adentro', text: 'Percorreu a linha do tempo de Guaraciaba do Norte.', when: 'seen:rotas:day:2026-10-09 && seen:rotas:day:2026-10-10' },
  { id: 'eco', title: 'Eco', text: 'Descobriu quem é o ECO.', when: 'eco_revelado' },
  { id: 'sem-dicas', title: 'Sem dicas', text: 'Resolveu o caso sem pedir nenhuma dica.', when: 'solved:final && !usou_dica' },
  { id: 'primeira', title: 'De primeira', text: 'Acertou o relatório final na primeira tentativa.', when: 'final_primeira' },
];
export const achievements = () => ACH;
function checkAchievements() {
  for (const a of ACH) {
    if (!state.achievements[a.id] && evalReq(a.when)) {
      state.achievements[a.id] = Date.now();
      bus.emit('achievement', a);
      api.event('conquista', a.id);
    }
  }
}

/** Dica do objetivo pendente mais antigo do capítulo atual. */
export function pendingObjective() {
  for (const c of chapters()) {
    if (!state.flags[`chapter_started:${c.n}`]) continue;
    for (const o of (c.objectives || [])) if (!state.objectives[o.id]) return { ...o, chapter: c.n };
    if (c.deduction && !state.solved[c.deduction] && evalReq(CASE.chapters?.deductions?.[c.deduction]?.unlockWhen)) return { id: `ded:${c.deduction}`, text: 'Resolva a dedução do capítulo no Quadro.', chapter: c.n };
  }
  return null;
}

export function useHint(objectiveId) {
  const hints = CASE.eco?.hints?.[objectiveId] || [];
  const lvl = Math.min(hints.length, (state.hints[objectiveId] || 0) + 1);
  if (!hints.length) return null;
  state.hints[objectiveId] = lvl;
  setFlag('usou_dica');
  api.event('dica', `${objectiveId}:${lvl}`);
  save();
  return { level: lvl, text: hints[lvl - 1], max: hints.length };
}

export function init() {
  bus.on('flag', () => evaluate());
  bus.on('solve', ({ id }) => { if (id === 'final' && state.reportAttempts === 1) setFlag('final_primeira'); });
  evaluate();
}
