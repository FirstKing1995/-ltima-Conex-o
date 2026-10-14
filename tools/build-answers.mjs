// Gera data/caso01/answers.js (hashes) a partir de privado/respostas.json (texto puro, NÃO versionado).
// Uso: node tools/build-answers.mjs
import fs from 'fs';
import crypto from 'crypto';
const src = JSON.parse(fs.readFileSync(new URL('../privado/respostas.json', import.meta.url)));
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const hash = (salt, v) => crypto.createHash('sha256').update(`${salt}|${norm(v)}`).digest('hex');
const out = { salt: src.salt, puzzles: {}, blanks: {} };
for (const [k, v] of Object.entries(src.puzzles)) out.puzzles[k] = hash(`${src.salt}|${k}`, v);
for (const [k, v] of Object.entries(src.blanks)) out.blanks[k] = hash(`${src.salt}|${k}`, v);
const js = `// GERADO por tools/build-answers.mjs — não editar à mão. Respostas em hash (sha256).\nexport default ${JSON.stringify(out, null, 1)};\n`;
fs.writeFileSync(new URL('../data/caso01/answers.js', import.meta.url), js);
console.log('answers.js:', Object.keys(out.blanks).length, 'lacunas,', Object.keys(out.puzzles).length, 'puzzles');
