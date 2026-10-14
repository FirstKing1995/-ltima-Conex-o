// Normalização e hash para conferir respostas sem guardar a resposta em texto.
export function normalize(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** hash esperado = sha256(salt + '|' + normalize(valor)) */
export async function check(expectedHash, salt, value) {
  if (!expectedHash) return false;
  const got = await sha256(`${salt}|${normalize(value)}`);
  return got === expectedHash;
}
