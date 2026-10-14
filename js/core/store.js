// Acesso ao conteúdo do caso.
export let CASE = {};
let byId = new Map();
let byPhone = new Map();

export function setCase(data) {
  CASE = data || {};
  byId = new Map();
  byPhone = new Map();
  for (const c of (CASE.contacts?.contacts || [])) {
    byId.set(c.id, c);
    for (const p of (c.phones || [])) byPhone.set(digits(p), c);
  }
}

export const digits = (s) => String(s || '').replace(/\D/g, '');
export const contact = (id) => byId.get(id) || null;
export function contactByPhone(phone) {
  const d = digits(phone);
  if (!d) return null;
  if (byPhone.has(d)) return byPhone.get(d);
  for (const [k, c] of byPhone) if (k.endsWith(d.slice(-9)) && d.length >= 9) return c;
  return null;
}

/** Formata "5585988124417" → "+55 85 98812-4417"; "5588996451209" → "+55 88 99645-1209" */
export function fmtPhone(p, { intl = true } = {}) {
  let d = digits(p);
  if (!d) return String(p || '');
  if (d.length === 13 && d.startsWith('55')) { const ddd = d.slice(2, 4), a = d.slice(4, 9), b = d.slice(9); return intl ? `+55 ${ddd} ${a}-${b}` : `(${ddd}) ${a}-${b}`; }
  if (d.length === 11) { return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`; }
  if (d.length === 10) { return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`; }
  return String(p);
}

/** Nome para exibir dado id de contato ou telefone. */
export function displayName(idOrPhone) {
  if (!idOrPhone) return '';
  if (idOrPhone === 'iara' || idOrPhone === 'me') return 'Você';
  const c = contact(idOrPhone) || contactByPhone(idOrPhone);
  return c ? c.name : fmtPhone(idOrPhone);
}

const PALETTE = ['#e07a5f', '#3d9970', '#7c6cf0', '#d9a441', '#2f80ed', '#c2557a', '#2bb3a3', '#9a6b4a', '#5f7ad9', '#b65fd6'];
export function colorFor(key) { let h = 0; for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }

/** {src?, name, color} para avatar */
export function avatarOf(idOrPhone) {
  const c = contact(idOrPhone) || contactByPhone(idOrPhone);
  if (c) return { src: c.avatar ? asset(c.avatar) : '', name: c.name, color: c.color || colorFor(c.id) };
  return { src: '', name: fmtPhone(idOrPhone), color: '#5f6368', unknown: true };
}

/** Resolve caminho de asset relativo à raiz do site. */
export function asset(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return new URL(path.replace(/^\/+/, ''), document.baseURI).href;
}
