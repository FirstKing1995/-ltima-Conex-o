// Datas e horas em pt-BR. Conteúdo usa "2026-10-10T23:46" (hora local de Fortaleza, sem fuso).
export const MIRROR_NOW = '2026-10-10T23:47';
export const PRESENT_NOW = '2026-10-13T23:12';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DIAS_LONGOS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** Converte "2026-10-10T23:46[:08]" em Date local (sem depender do fuso do jogador). */
export function parse(s) {
  if (s instanceof Date) return s;
  if (!s) return new Date(NaN);
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m) return new Date(s);
  return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
}
const pad = (n) => String(n).padStart(2, '0');
export const ymd = (s) => { const d = parse(s); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
export const hhmm = (s) => { const d = parse(s); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
export const hhmmss = (s) => { const d = parse(s); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
export const dateBR = (s) => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
export const dateShort = (s) => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
export const weekday = (s) => DIAS[parse(s).getDay()];
export const weekdayLong = (s) => DIAS_LONGOS[parse(s).getDay()];
/** "sáb, 10 de out." */
export const dayLabel = (s) => { const d = parse(s); return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}.`; };
/** "10 de outubro de 2026" */
export const dateLong = (s) => { const d = parse(s); return `${d.getDate()} de ${MESES_LONGOS[d.getMonth()]} de ${d.getFullYear()}`; };
export const monthName = (m) => MESES_LONGOS[m];
export const monthShort = (m) => MESES[m];

function dayDiff(a, b) {
  const da = parse(a), db = parse(b);
  const ua = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
  const ub = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
  return Math.round((ub - ua) / 86400000);
}

/** Para listas: "23:46" (mesmo dia) | "ontem" | "qui" (até 6 dias) | "08/10" | "08/10/2025" */
export function relative(s, now = MIRROR_NOW) {
  const diff = dayDiff(s, now);
  if (diff <= 0) return hhmm(s);
  if (diff === 1) return 'ontem';
  if (diff < 7) return DIAS[parse(s).getDay()];
  return parse(s).getFullYear() === parse(now).getFullYear() ? dateShort(s) : dateBR(s);
}

/** Separador de dia em chats: "Hoje" | "Ontem" | "quinta-feira" | "8 de outubro" */
export function chatDay(s, now = MIRROR_NOW) {
  const diff = dayDiff(s, now);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff > 1 && diff < 7) return DIAS_LONGOS[parse(s).getDay()];
  const d = parse(s);
  const base = `${d.getDate()} de ${MESES_LONGOS[d.getMonth()]}`;
  return d.getFullYear() === parse(now).getFullYear() ? base : `${base} de ${d.getFullYear()}`;
}

export function duration(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** "02:09" → 129 */
export function toSec(t) {
  if (typeof t === 'number') return t;
  const p = String(t || '0').split(':').map(Number);
  return p.reduce((acc, v) => acc * 60 + (v || 0), 0);
}

export function money(n, { sign = false } = {}) {
  const v = Math.abs(Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const neg = (Number(n) || 0) < 0;
  return `${neg ? '− ' : sign ? '+ ' : ''}R$ ${v}`;
}

export const compare = (a, b) => parse(a) - parse(b);
export const isBefore = (a, b) => parse(a) < parse(b);
