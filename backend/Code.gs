/**
 * @OnlyCurrentDoc
 *
 * ÚLTIMA CONEXÃO — Backend (Google Apps Script)
 * ------------------------------------------------------------
 * A planilha é o banco de dados; este script vira uma API JSON
 * (App da Web) que o jogo hospedado no GitHub Pages consome.
 *
 * O jogo funciona 100% offline (salva no navegador). Quando a
 * API está configurada em js/config.js, ele também sincroniza:
 * jogadores, saves na nuvem, eventos (funil), relatórios finais
 * (acusações) e ranking.
 *
 * IMPLANTAÇÃO (uma vez):
 *  1. Planilha → Extensões → Apps Script → cole este arquivo em Code.gs → Salvar.
 *  2. Rode a função setup() uma vez e autorize.
 *  3. Implantar → Nova implantação → App da Web
 *       Executar como: Eu  |  Quem pode acessar: Qualquer pessoa
 *  4. Copie a URL que termina em /exec e cole em js/config.js (API_URL).
 *
 * ATUALIZAR O CÓDIGO SEM TROCAR A URL:
 *  Implantar → Gerenciar implantações → (lápis) → Versão: Nova versão → Implantar.
 */

const API_VERSION = '1.0.0';
const TZ = 'America/Fortaleza';

const ABAS = {
  PAINEL: 'Painel',
  JOGADORES: 'Jogadores',
  SAVES: 'Saves',
  EVENTOS: 'Eventos',
  RELATORIOS: 'Relatorios',
  RANKING: 'Ranking',
  FEEDBACK: 'Feedback',
  CONFIG: 'Config',
};

const CABECALHOS = {
  Jogadores: ['id', 'codigo', 'token', 'apelido', 'email', 'cidade', 'criado_em', 'ultimo_acesso', 'capitulo', 'concluiu', 'origem', 'dispositivo'],
  Saves: ['id', 'atualizado_em', 'versao', 'capitulo', 'tamanho', 'estado_json'],
  Eventos: ['data_hora', 'id', 'tipo', 'capitulo', 'dado'],
  Relatorios: ['data_hora', 'id', 'apelido', 'acusado', 'acertos', 'total', 'resultado', 'tempo_min', 'dicas', 'erros', 'tentativa', 'pontos', 'respostas_json'],
  Ranking: ['id', 'apelido', 'pontos', 'tempo_min', 'dicas', 'erros', 'tentativas', 'concluido_em', 'cidade'],
  Feedback: ['data_hora', 'id', 'apelido', 'nota', 'comentario'],
  Config: ['chave', 'valor', 'descricao'],
};

const CONFIG_PADRAO = [
  ['jogo_ativo', 'sim', 'sim/nao — "nao" pausa a sincronização (o jogo continua offline)'],
  ['mensagem_global', '', 'Aviso exibido aos jogadores na abertura (vazio = nenhum)'],
  ['versao_conteudo', 'caso01-v1', 'Versão do conteúdo do caso'],
  ['ranking_limite', '50', 'Quantos jogadores aparecem no ranking'],
  ['url_jogo', 'https://firstking1995.github.io/-ltima-conex-o/', 'Endereço público do jogo'],
];

const CONFIG_PUBLICA = ['jogo_ativo', 'mensagem_global', 'versao_conteudo', 'ranking_limite', 'url_jogo'];

const LIMITE_SAVE = 48000; // caracteres por célula (limite do Sheets é 50.000)

/* ============================================================
 * ENTRADAS HTTP
 * ============================================================ */

function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = String(p.action || '');
  try {
    if (!action) return paginaStatus_();
    switch (action) {
      case 'ping':
        return json_({ ok: true, versao: API_VERSION, hora: agoraIso_() });
      case 'ranking':
        return json_({ ok: true, ranking: ranking_(num_(p.limit, 0, 200)) });
      case 'config':
        return json_({ ok: true, config: configPublica_() });
      case 'stats':
        return json_({ ok: true, stats: stats_() });
      default:
        return json_({ ok: false, erro: 'acao_desconhecida' });
    }
  } catch (err) {
    return json_({ ok: false, erro: msgErro_(err) });
  }
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, erro: 'json_invalido' });
  }
  const action = String(body.action || '');
  try {
    limitarTaxa_(String(body.id || body.codigo || 'anon'));
    const liberadas = ['load', 'restore'];
    if (!jogoAtivo_() && liberadas.indexOf(action) < 0) {
      return json_({ ok: false, erro: 'pausado' });
    }
    switch (action) {
      case 'register': return json_(registrar_(body));
      case 'profile': return json_(perfil_(body));
      case 'save': return json_(salvar_(body));
      case 'load': return json_(carregar_(body));
      case 'restore': return json_(restaurar_(body));
      case 'event': return json_(evento_(body));
      case 'report': return json_(relatorio_(body));
      case 'feedback': return json_(feedback_(body));
      default: return json_({ ok: false, erro: 'acao_desconhecida' });
    }
  } catch (err) {
    return json_({ ok: false, erro: msgErro_(err) });
  }
}

/* ============================================================
 * AÇÕES
 * ============================================================ */

function registrar_(b) {
  const apelido = limpa_(b.apelido, 24);
  if (apelido.replace(/'/g, '').length < 2) throw new Error('apelido_invalido');
  const email = limpa_(b.email, 120).toLowerCase();
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('email_invalido');

  return comTrava_(function () {
    const sh = aba_(ABAS.JOGADORES);
    const id = 'J' + Date.now().toString(36).toUpperCase() + aleatorio_(4);
    const token = Utilities.getUuid();
    let codigo = gerarCodigo_();
    let tentativas = 0;
    while (acharLinha_(sh, 2, codigo) && tentativas++ < 10) codigo = gerarCodigo_();
    const agora = agora_();
    sh.appendRow([
      id, codigo, token, apelido, email, limpa_(b.cidade, 60),
      agora, agora, num_(b.capitulo, 0, 99), 'nao',
      limpa_(b.origem, 120), limpa_(b.dispositivo, 160),
    ]);
    return { ok: true, id: id, token: token, codigo: codigo, apelido: apelido };
  });
}

function perfil_(b) {
  const j = autenticar_(b);
  return comTrava_(function () {
    if (b.apelido !== undefined) {
      const apelido = limpa_(b.apelido, 24);
      if (apelido.replace(/'/g, '').length >= 2) j.sh.getRange(j.linha, 4).setValue(apelido);
    }
    if (b.email !== undefined) {
      const email = limpa_(b.email, 120).toLowerCase();
      if (!email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) j.sh.getRange(j.linha, 5).setValue(email);
    }
    if (b.cidade !== undefined) j.sh.getRange(j.linha, 6).setValue(limpa_(b.cidade, 60));
    j.sh.getRange(j.linha, 8).setValue(agora_());
    return { ok: true };
  });
}

function salvar_(b) {
  const j = autenticar_(b);
  const estado = typeof b.estado === 'string' ? b.estado : JSON.stringify(b.estado || {});
  if (estado.length > LIMITE_SAVE) throw new Error('save_grande');
  const capitulo = num_(b.capitulo, 0, 99);
  return comTrava_(function () {
    const sh = aba_(ABAS.SAVES);
    const agora = agora_();
    const linha = acharLinha_(sh, 1, j.id);
    const valores = [[j.id, agora, limpa_(b.versao, 30), capitulo, estado.length, estado]];
    if (linha) sh.getRange(linha, 1, 1, valores[0].length).setValues(valores);
    else sh.appendRow(valores[0]);
    j.sh.getRange(j.linha, 8).setValue(agora);
    const capAtual = Number(j.sh.getRange(j.linha, 9).getValue()) || 0;
    if (capitulo > capAtual) j.sh.getRange(j.linha, 9).setValue(capitulo);
    return { ok: true, atualizado_em: agoraIso_() };
  });
}

function carregar_(b) {
  const j = autenticar_(b);
  return { ok: true, estado: lerSave_(j.id) };
}

function restaurar_(b) {
  const codigo = String(b.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (codigo.length < 6) throw new Error('codigo_invalido');
  const formatado = codigo.slice(0, 4) + '-' + codigo.slice(4, 8);
  const sh = aba_(ABAS.JOGADORES);
  const linha = acharLinha_(sh, 2, formatado);
  if (!linha) throw new Error('codigo_nao_encontrado');
  const v = sh.getRange(linha, 1, 1, 6).getValues()[0];
  return { ok: true, id: v[0], codigo: v[1], token: v[2], apelido: v[3], email: v[4], cidade: v[5], estado: lerSave_(v[0]) };
}

function evento_(b) {
  const j = autenticar_(b);
  const lista = Array.isArray(b.eventos) ? b.eventos.slice(0, 40) : [{ tipo: b.tipo, capitulo: b.capitulo, dado: b.dado }];
  const agora = agora_();
  const linhas = lista
    .filter(function (ev) { return ev && ev.tipo; })
    .map(function (ev) {
      const dado = typeof ev.dado === 'string' ? ev.dado : JSON.stringify(ev.dado || '');
      return [ev.quando ? new Date(ev.quando) : agora, j.id, limpa_(ev.tipo, 40), num_(ev.capitulo, 0, 99), limpa_(dado, 400)];
    });
  if (!linhas.length) return { ok: true, gravados: 0 };
  const sh = aba_(ABAS.EVENTOS);
  comTrava_(function () {
    sh.getRange(sh.getLastRow() + 1, 1, linhas.length, linhas[0].length).setValues(linhas);
  });
  return { ok: true, gravados: linhas.length };
}

function relatorio_(b) {
  const j = autenticar_(b);
  const acertos = num_(b.acertos, 0, 999);
  const total = Math.max(1, num_(b.total, 1, 999));
  const tempo = Math.round(num_(b.tempo_min, 0, 100000) * 10) / 10;
  const dicas = num_(b.dicas, 0, 999);
  const erros = num_(b.erros, 0, 9999);
  const tentativa = num_(b.tentativa, 1, 999);
  const resolvido = acertos >= total;
  const resultado = resolvido ? 'resolvido' : (acertos / total >= 0.6 ? 'parcial' : 'errado');
  const pontos = calcularPontos_(acertos, total, tempo, dicas, erros, tentativa);
  const apelido = String(j.valores[3] || '');

  return comTrava_(function () {
    aba_(ABAS.RELATORIOS).appendRow([
      agora_(), j.id, apelido, limpa_(b.acusado, 60), acertos, total, resultado,
      tempo, dicas, erros, tentativa, pontos, limpa_(JSON.stringify(b.respostas || {}), 4000),
    ]);
    let posicao = null;
    if (resolvido) {
      j.sh.getRange(j.linha, 10).setValue('sim');
      const rk = aba_(ABAS.RANKING);
      const linha = acharLinha_(rk, 1, j.id);
      const nova = [j.id, apelido, pontos, tempo, dicas, erros, tentativa, agora_(), String(j.valores[5] || '')];
      if (!linha) rk.appendRow(nova);
      else if (Number(rk.getRange(linha, 3).getValue()) < pontos) rk.getRange(linha, 1, 1, nova.length).setValues([nova]);
      CacheService.getScriptCache().remove('ranking');
      posicao = posicaoNoRanking_(j.id);
    }
    return { ok: true, resultado: resultado, pontos: pontos, posicao: posicao };
  });
}

function feedback_(b) {
  let id = '', apelido = '';
  try {
    const j = autenticar_(b);
    id = j.id;
    apelido = String(j.valores[3] || '');
  } catch (e) { /* feedback anônimo é aceito */ }
  const nota = num_(b.nota, 0, 5);
  aba_(ABAS.FEEDBACK).appendRow([agora_(), id, apelido, nota, limpa_(b.comentario, 1500)]);
  return { ok: true };
}

/* ============================================================
 * CONSULTAS
 * ============================================================ */

function ranking_(limite) {
  const cache = CacheService.getScriptCache();
  const emCache = cache.get('ranking');
  let lista;
  if (emCache) {
    lista = JSON.parse(emCache);
  } else {
    const sh = aba_(ABAS.RANKING);
    const n = sh.getLastRow() - 1;
    lista = n > 0 ? sh.getRange(2, 1, n, 9).getValues()
      .filter(function (r) { return r[0]; })
      .map(function (r) {
        return {
          apelido: String(r[1]), pontos: Number(r[2]) || 0, tempo_min: Number(r[3]) || 0,
          dicas: Number(r[4]) || 0, erros: Number(r[5]) || 0, tentativas: Number(r[6]) || 1,
          data: r[7] instanceof Date ? Utilities.formatDate(r[7], TZ, 'dd/MM/yyyy') : String(r[7] || ''),
          cidade: String(r[8] || ''),
        };
      }) : [];
    lista.sort(function (a, b) { return (b.pontos - a.pontos) || (a.tempo_min - b.tempo_min); });
    cache.put('ranking', JSON.stringify(lista.slice(0, 200)), 60);
  }
  const max = limite || Number(lerConfig_('ranking_limite')) || 50;
  return lista.slice(0, max);
}

function posicaoNoRanking_(id) {
  const sh = aba_(ABAS.RANKING);
  const n = sh.getLastRow() - 1;
  if (n <= 0) return null;
  const linhas = sh.getRange(2, 1, n, 4).getValues().filter(function (r) { return r[0]; });
  linhas.sort(function (a, b) { return (Number(b[2]) - Number(a[2])) || (Number(a[3]) - Number(b[3])); });
  for (let i = 0; i < linhas.length; i++) if (linhas[i][0] === id) return i + 1;
  return null;
}

function stats_() {
  const cache = CacheService.getScriptCache();
  const emCache = cache.get('stats');
  if (emCache) return JSON.parse(emCache);
  const jog = aba_(ABAS.JOGADORES);
  const n = Math.max(0, jog.getLastRow() - 1);
  let concluiram = 0;
  if (n > 0) jog.getRange(2, 10, n, 1).getValues().forEach(function (r) { if (r[0] === 'sim') concluiram++; });
  const stats = { jogadores: n, resolveram: concluiram, relatorios: Math.max(0, aba_(ABAS.RELATORIOS).getLastRow() - 1) };
  cache.put('stats', JSON.stringify(stats), 300);
  return stats;
}

function configPublica_() {
  const todas = lerTodaConfig_();
  const pub = {};
  CONFIG_PUBLICA.forEach(function (k) { if (k in todas) pub[k] = todas[k]; });
  return pub;
}

/* ============================================================
 * PONTUAÇÃO
 * ============================================================ */

function calcularPontos_(acertos, total, tempo, dicas, erros, tentativa) {
  const precisao = acertos / total;                // 0..1
  let pontos = Math.round(1000 * precisao);
  pontos += Math.max(0, Math.round(400 - tempo * 2)); // bônus de tempo (até 400)
  pontos -= dicas * 25;
  pontos -= erros * 10;
  pontos -= (tentativa - 1) * 100;
  return Math.max(0, pontos);
}

/* ============================================================
 * AUXILIARES
 * ============================================================ */

function autenticar_(b) {
  const id = String(b.id || '');
  const token = String(b.token || '');
  if (!id || !token) throw new Error('sem_credenciais');
  const sh = aba_(ABAS.JOGADORES);
  const linha = acharLinha_(sh, 1, id);
  if (!linha) throw new Error('jogador_nao_encontrado');
  const valores = sh.getRange(linha, 1, 1, CABECALHOS.Jogadores.length).getValues()[0];
  if (String(valores[2]) !== token) throw new Error('token_invalido');
  return { id: id, sh: sh, linha: linha, valores: valores };
}

function lerSave_(id) {
  const sh = aba_(ABAS.SAVES);
  const linha = acharLinha_(sh, 1, id);
  if (!linha) return null;
  const txt = String(sh.getRange(linha, 6).getValue() || '');
  try { return JSON.parse(txt); } catch (e) { return null; }
}

function acharLinha_(sh, coluna, valor) {
  if (!valor) return 0;
  const ultima = sh.getLastRow();
  if (ultima < 2) return 0;
  const achado = sh.getRange(2, coluna, ultima - 1, 1)
    .createTextFinder(String(valor)).matchEntireCell(true).findNext();
  return achado ? achado.getRow() : 0;
}

function comTrava_(fn) {
  const trava = LockService.getScriptLock();
  trava.waitLock(15000);
  try { return fn(); } finally { trava.releaseLock(); }
}

function limitarTaxa_(chave) {
  const cache = CacheService.getScriptCache();
  const k = 'taxa_' + String(chave).slice(0, 60);
  const n = Number(cache.get(k) || 0) + 1;
  cache.put(k, String(n), 60);
  if (n > 150) throw new Error('muitas_requisicoes');
}

function jogoAtivo_() {
  return String(lerConfig_('jogo_ativo') || 'sim').toLowerCase() !== 'nao';
}

function lerConfig_(chave) {
  return lerTodaConfig_()[chave];
}

function lerTodaConfig_() {
  const cache = CacheService.getScriptCache();
  const emCache = cache.get('config');
  if (emCache) return JSON.parse(emCache);
  const sh = ss_().getSheetByName(ABAS.CONFIG);
  const mapa = {};
  if (sh && sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(function (r) {
      if (r[0]) mapa[String(r[0]).trim()] = String(r[1]);
    });
  }
  cache.put('config', JSON.stringify(mapa), 120);
  return mapa;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }

function aba_(nome) {
  const sh = ss_().getSheetByName(nome);
  if (!sh) throw new Error('aba_ausente_' + nome);
  return sh;
}

function agora_() { return new Date(); }
function agoraIso_() { return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd'T'HH:mm:ss"); }

function limpa_(v, max) {
  let s = (v === null || v === undefined) ? '' : String(v);
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').trim();
  if (max && s.length > max) s = s.slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // impede injeção de fórmula na planilha
  return s;
}

function num_(v, min, max) {
  let n = Number(v);
  if (!isFinite(n)) n = 0;
  if (min !== undefined) n = Math.max(min, n);
  if (max !== undefined) n = Math.min(max, n);
  return n;
}

function aleatorio_(n) {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += alfabeto.charAt(Math.floor(Math.random() * alfabeto.length));
  return s;
}

function gerarCodigo_() { return aleatorio_(4) + '-' + aleatorio_(4); }

function msgErro_(err) { return String((err && err.message) || err).slice(0, 200); }

function paginaStatus_() {
  const html = '<!doctype html><meta charset="utf-8"><title>Última Conexão — API</title>' +
    '<body style="background:#0b0d10;color:#e8e6e1;font-family:system-ui;padding:32px">' +
    '<h1 style="font-weight:600">Última Conexão — API online</h1>' +
    '<p>Versão ' + API_VERSION + ' · ' + agoraIso_() + '</p>' +
    '<p>Use <code>?action=ping</code>, <code>?action=ranking</code>, <code>?action=stats</code> ou <code>?action=config</code>.</p></body>';
  return HtmlService.createHtmlOutput(html).setTitle('Última Conexão — API');
}

/* ============================================================
 * CONFIGURAÇÃO DA PLANILHA
 * ============================================================ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔦 Última Conexão')
    .addItem('Configurar / reparar abas', 'setup')
    .addItem('Testar a API (autoteste)', 'autoTeste')
    .addSeparator()
    .addItem('Limpar dados de teste', 'limparDadosDeTeste')
    .addToUi();
}

function setup() {
  const ss = ss_();
  ss.setSpreadsheetTimeZone(TZ);

  // A aba padrão vira o Painel
  let painel = ss.getSheetByName(ABAS.PAINEL);
  if (!painel) {
    const padrao = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1') || ss.getSheetByName('Página 1');
    if (padrao && padrao.getLastRow() === 0) {
      padrao.setName(ABAS.PAINEL);
      painel = padrao;
    } else {
      painel = ss.insertSheet(ABAS.PAINEL, 0);
    }
  }

  Object.keys(CABECALHOS).forEach(function (nome) {
    let sh = ss.getSheetByName(nome);
    if (!sh) sh = ss.insertSheet(nome);
    const cab = CABECALHOS[nome];
    sh.getRange(1, 1, 1, cab.length).setValues([cab])
      .setFontWeight('bold').setFontColor('#f4efe6').setBackground('#14171c');
    sh.setFrozenRows(1);
    if (sh.getMaxColumns() > cab.length + 2) sh.deleteColumns(cab.length + 3, sh.getMaxColumns() - cab.length - 2);
  });

  // Larguras e formatos úteis
  aba_(ABAS.JOGADORES).setColumnWidth(3, 90).hideColumns(3); // token escondido
  aba_(ABAS.SAVES).setColumnWidth(6, 300);
  aba_(ABAS.EVENTOS).getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  aba_(ABAS.RELATORIOS).getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  aba_(ABAS.JOGADORES).getRange('G:H').setNumberFormat('dd/MM/yyyy HH:mm');
  aba_(ABAS.RANKING).getRange('H:H').setNumberFormat('dd/MM/yyyy HH:mm');

  // Config padrão (não sobrescreve valores existentes)
  const cfg = aba_(ABAS.CONFIG);
  const existentes = cfg.getLastRow() > 1 ? cfg.getRange(2, 1, cfg.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
  CONFIG_PADRAO.forEach(function (linha) {
    if (existentes.indexOf(linha[0]) < 0) cfg.appendRow(linha);
  });
  cfg.setColumnWidth(1, 170).setColumnWidth(2, 320).setColumnWidth(3, 420);

  montarPainel_(painel);
  ss.setActiveSheet(painel);
  CacheService.getScriptCache().removeAll(['config', 'ranking', 'stats']);
  return 'ok';
}

function montarPainel_(sh) {
  sh.clear();
  sh.setHiddenGridlines(true);
  sh.getRange('A1:F1').merge().setValue('ÚLTIMA CONEXÃO — PAINEL DO JOGO')
    .setFontSize(18).setFontWeight('bold').setFontColor('#f4efe6').setBackground('#0b0d10');
  sh.getRange('A2:F2').merge().setValue('Atualiza sozinho conforme as pessoas jogam. Dados brutos nas outras abas.')
    .setFontColor('#8b8f97').setBackground('#0b0d10');

  const kpis = [
    ['Jogadores cadastrados', '=MAX(0,COUNTA(Jogadores!A:A)-1)'],
    ['Resolveram o caso', '=COUNTIF(Jogadores!J:J,"sim")'],
    ['Taxa de conclusão', '=IFERROR(B5/B4,0)'],
    ['Relatórios enviados', '=MAX(0,COUNTA(Relatorios!A:A)-1)'],
    ['Resolveram na 1ª tentativa', '=COUNTIFS(Relatorios!G:G,"resolvido",Relatorios!K:K,1)'],
    ['Tempo médio até resolver (min)', '=IFERROR(AVERAGEIF(Relatorios!G:G,"resolvido",Relatorios!H:H),0)'],
    ['Média de dicas (quem resolveu)', '=IFERROR(AVERAGE(Ranking!E2:E),0)'],
  ];
  sh.getRange(4, 1, kpis.length, 1).setValues(kpis.map(function (k) { return [k[0]]; }));
  sh.getRange(4, 2, kpis.length, 1).setFormulas(kpis.map(function (k) { return [k[1]]; }));
  sh.getRange('B6').setNumberFormat('0.0%');
  sh.getRange('B9:B10').setNumberFormat('0.0');
  sh.getRange(4, 2, kpis.length, 1).setFontWeight('bold').setFontSize(13);

  sh.getRange('A13').setValue('Funil — chegaram ao capítulo').setFontWeight('bold');
  const funil = [];
  for (let c = 0; c <= 5; c++) funil.push(['Capítulo ' + c + '+', '=COUNTIF(Jogadores!I:I,">=' + c + '")']);
  sh.getRange(14, 1, funil.length, 1).setValues(funil.map(function (f) { return [f[0]]; }));
  sh.getRange(14, 2, funil.length, 1).setFormulas(funil.map(function (f) { return [f[1]]; }));

  sh.getRange('D4').setValue('Quem os jogadores acusam').setFontWeight('bold');
  sh.getRange('D5').setFormula('=IFERROR(QUERY(Relatorios!A:M,"select D, count(D) where D is not null and D <> \'\' group by D order by count(D) desc label count(D) \'vezes\'",1),"—")');

  sh.getRange('D13').setValue('Eventos mais comuns').setFontWeight('bold');
  sh.getRange('D14').setFormula('=IFERROR(QUERY(Eventos!A:E,"select C, count(C) where C is not null and C <> \'\' group by C order by count(C) desc limit 15 label count(C) \'vezes\'",1),"—")');

  sh.getRange('A22').setValue('Top 10 do ranking').setFontWeight('bold');
  sh.getRange('A23').setFormula('=IFERROR(QUERY(Ranking!A:I,"select B, C, D, E where C is not null order by C desc limit 10 label B \'apelido\', C \'pontos\', D \'min\', E \'dicas\'",1),"—")');

  sh.setColumnWidth(1, 260).setColumnWidth(2, 110).setColumnWidth(3, 30).setColumnWidth(4, 240).setColumnWidth(5, 90);
}

function limparDadosDeTeste() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.alert('Limpar dados de teste', 'Apaga as linhas de jogadores cujo apelido começa com "TESTE" e tudo ligado a eles. Continuar?', ui.ButtonSet.YES_NO);
  if (r !== ui.Button.YES) return;
  const n = removerJogadoresDeTeste_();
  ui.alert('Pronto: ' + n + ' jogador(es) de teste removido(s).');
}

function removerJogadoresDeTeste_() {
  const jog = aba_(ABAS.JOGADORES);
  const ids = [];
  for (let i = jog.getLastRow(); i >= 2; i--) {
    const v = jog.getRange(i, 1, 1, 4).getValues()[0];
    if (/^TESTE/i.test(String(v[3]))) { ids.push(String(v[0])); jog.deleteRow(i); }
  }
  [ABAS.SAVES, ABAS.EVENTOS, ABAS.RELATORIOS, ABAS.RANKING, ABAS.FEEDBACK].forEach(function (nome) {
    const sh = aba_(nome);
    const col = (nome === ABAS.EVENTOS || nome === ABAS.RELATORIOS || nome === ABAS.FEEDBACK) ? 2 : 1;
    for (let i = sh.getLastRow(); i >= 2; i--) {
      if (ids.indexOf(String(sh.getRange(i, col).getValue())) >= 0) sh.deleteRow(i);
    }
  });
  CacheService.getScriptCache().removeAll(['ranking', 'stats']);
  return ids.length;
}

/** Simula o ciclo completo de um jogador e apaga tudo no final. */
function autoTeste() {
  const log = [];
  const reg = registrar_({ apelido: 'TESTE robô', email: '', cidade: 'Guaraciaba do Norte', origem: 'autoteste' });
  log.push('register: ' + reg.ok + ' ' + reg.codigo);
  const cred = { id: reg.id, token: reg.token };
  log.push('save: ' + salvar_(Object.assign({ estado: { flags: { teste: true } }, capitulo: 1, versao: 'teste' }, cred)).ok);
  log.push('load: ' + JSON.stringify(carregar_(cred).estado));
  log.push('restore: ' + restaurar_({ codigo: reg.codigo }).id);
  log.push('event: ' + evento_(Object.assign({ eventos: [{ tipo: 'teste', capitulo: 1, dado: 'ok' }] }, cred)).gravados);
  const rel = relatorio_(Object.assign({ acusado: 'teste', acertos: 10, total: 10, tempo_min: 42, dicas: 1, erros: 2, tentativa: 1, respostas: {} }, cred));
  log.push('report: ' + rel.resultado + ' ' + rel.pontos + ' pts, posição ' + rel.posicao);
  log.push('ranking: ' + ranking_(5).length + ' linha(s)');
  log.push('removidos: ' + removerJogadoresDeTeste_());
  Logger.log(log.join('\n'));
  return log.join('\n');
}
