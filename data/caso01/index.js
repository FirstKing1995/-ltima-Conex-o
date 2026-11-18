// Junta o conteúdo do Caso 01. Cada arquivo é carregado separadamente: se um falhar, o jogo continua.
const V = '1.4.0'; // mude a cada publicação para furar o cache
const FILES = ['meta', 'contacts', 'papo', 'sms', 'telefone', 'galeria', 'rotas', 'lume', 'navegador', 'correio', 'jandaia', 'notas', 'agenda', 'relogio', 'gravador', 'pulso', 'bora', 'configuracoes', 'arquivos', 'clima', 'eco', 'terms', 'chapters', 'puzzles', 'answers', 'news', 'endings'];
// Conteúdo extra (ruído e rastros novos) em data/caso01/extra/<app>.js: listas são somadas às do app.
const EXTRA = ['papo', 'correio', 'lume', 'sms', 'telefone', 'agenda', 'notas', 'navegador', 'contacts'];

function merge(base, extra) {
  for (const [k, v] of Object.entries(extra || {})) {
    if (Array.isArray(v)) base[k] = [...(Array.isArray(base[k]) ? base[k] : []), ...v];
    else if (v && typeof v === 'object' && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], v);
    else if (base[k] === undefined) base[k] = v;
  }
}

export async function loadCase() {
  const CASE = {};
  const errors = [];
  await Promise.all(FILES.map(async (f) => {
    try { const m = await import(`./${f}.js?v=${V}`); CASE[f] = m.default || {}; }
    catch (e) { CASE[f] = {}; errors.push(`${f}.js: ${e.message}`); console.error(`[caso01] falha ao carregar ${f}.js`, e); }
  }));
  await Promise.all(EXTRA.map(async (f) => {
    try { const m = await import(`./extra/${f}.js?v=${V}`); merge(CASE[f] || (CASE[f] = {}), m.default || {}); }
    catch (e) { errors.push(`extra/${f}.js: ${e.message}`); console.error(`[caso01] falha ao carregar extra/${f}.js`, e); }
  }));
  CASE._errors = errors;
  return CASE;
}
