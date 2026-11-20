// Troca os nomes fictícios de apps e marcas pelos reais (e de volta).
// Uso:  node tools/marcas.mjs reais      (fictício → real)
//       node tools/marcas.mjs ficticias  (real → fictício, para comercializar)
// Só mexe em texto exibido; os ids internos (papo, lume, correio, bora...) não mudam.
import fs from 'fs';
import path from 'path';

// Ordem importa: o mais específico primeiro.
export const PARES = [
  ['Pulso Band 4', 'Smart Band 8'],
  ['Nimbus N9 de Iara', 'moto g85 de Iara'],
  ['Nimbus N9', 'moto g85'],
  ['Nimbus Nuvem', 'Google Drive'],
  ['Nimbus Buds', 'moto buds'],
  ['Conta Nimbus', 'Conta Google'],
  ['conta Nimbus', 'conta Google'],
  ['Nimbus: a atualização', 'Motorola: a atualização'],
  ['A Nimbus avisou', 'O Google avisou'],
  ['aviso da Nimbus', 'aviso do Google'],
  ['e-mail da Nimbus', 'e-mail do Google'],
  ['Nimbus', 'Google'],
  ['Android 16', 'Android 15'],
  ['Litoral Móvel', 'Claro'],
  ['LITORAL MOVEL', 'CLARO'],
  ['litoralmovel.com.br', 'claro.com.br'],
  ['Banco Jandaia', 'Nubank'],
  ['jandaia-verifica.com', 'nubank-verifica.com'],
  ['jandaia.com.br', 'nubank.com.br'],
  ['Jandaia', 'Nubank'],
  ['BORA CORRIDAS', 'UBER DO BRASIL TECNOLOGIA'],
  ['bora.app', 'uber.com'],
  ['Bora', 'Uber'],
  ['lume.app', 'instagram.com'],
  ['Lume', 'Instagram'],
  ['Papo', 'WhatsApp'],
  ['Segurança do Correio', 'Google'],
  ['correio.app', 'gmail.com'],
  ['Correio', 'Gmail'],
  ['Rotas', 'Google Maps'],
  ['Pasta Segura', 'Pasta Trancada'],
  ['Pulso', 'Mi Fitness'],
  ['STREAMFLIX SERVICOS DIGITAIS', 'NETFLIX ENTRETENIMENTO BRASIL'],
  ['Streamflix', 'Netflix'],
  ['busca.vento.app', 'google.com'],
];
// Trechos que NÃO são a marca (gíria, jornal, etc.): ficam como estão.
const PROTEGE = ['Bora voltar', 'Correio da Ibiapaba', 'Bora, que agora', 'Bora ganhar'];

const ROOTS = ['data', 'js'];
const files = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (p.endsWith('.js')) files.push(p); } };
ROOTS.forEach(walk);

const dir = process.argv[2] === 'ficticias' ? 'back' : 'fwd';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let total = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  const guards = [];
  PROTEGE.forEach((p, i) => { s = s.split(p).join(`\u0001${i}\u0001`); guards.push(p); });
  const pares = dir === 'fwd' ? PARES : [...PARES].reverse().map(([a, b]) => [b, a]);
  for (const [a, b] of pares) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}_])${esc(a)}(?![\\p{L}\\p{N}_])`, 'gu');
    s = s.replace(re, () => { total++; return b; });
  }
  guards.forEach((p, i) => { s = s.split(`\u0001${i}\u0001`).join(p); });
  if (s !== orig) fs.writeFileSync(f, s);
}
console.log(`${dir === 'fwd' ? 'reais' : 'fictícias'}: ${total} trocas`);
