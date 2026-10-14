// Junta o conteúdo do Caso 01. Cada arquivo é carregado separadamente: se um falhar, o jogo continua.
const FILES = ['meta', 'contacts', 'papo', 'sms', 'telefone', 'galeria', 'rotas', 'lume', 'navegador', 'correio', 'jandaia', 'notas', 'agenda', 'relogio', 'gravador', 'pulso', 'bora', 'configuracoes', 'arquivos', 'clima', 'eco', 'terms', 'chapters', 'puzzles', 'answers', 'news', 'endings'];

export async function loadCase() {
  const CASE = {};
  const errors = [];
  await Promise.all(FILES.map(async (f) => {
    try { const m = await import(`./${f}.js`); CASE[f] = m.default || {}; }
    catch (e) { CASE[f] = {}; errors.push(`${f}.js: ${e.message}`); console.error(`[caso01] falha ao carregar ${f}.js`, e); }
  }));
  CASE._errors = errors;
  return CASE;
}
