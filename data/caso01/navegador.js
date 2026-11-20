// Navegador de Iara (aparelho: até sáb 10/10 23:47). Sem notícias da morte: tudo aqui é anterior a 23:47 do dia 10.
// Abas abertas (a primeira é a que aparece ao abrir), histórico de buscas e páginas, favoritos.

const tabs = [
  {
    id: 'tab-mirante', title: 'Mirante da Pedra Lisa — Turismo Ibiapaba', url: 'https://turismoibiapaba.com.br/guaraciaba/mirante-pedra-lisa',
    page: { title: 'Mirante da Pedra Lisa', blocks: [
      { type: 'h1', text: 'Mirante da Pedra Lisa' },
      { type: 'p', text: 'A 420 metros do galpão do Sítio Flor da Serra, em Guaraciaba do Norte, a Pedra Lisa é um bloco de granito com vista aberta para o vale e um dos pores do sol mais fotografados da Ibiapaba.' },
      { type: 'h2', text: 'Como chegar' },
      { type: 'p', text: 'A trilha parte do estacionamento do sítio e leva cerca de 8 minutos a pé. O trecho final é de pedra e fica escorregadio com orvalho.' },
      { type: 'h2', text: 'Segurança' },
      { type: 'li', text: 'Use calçado fechado e leve lanterna se for ficar depois das 17h30.' },
      { type: 'li', text: 'A cerca de madeira de proteção está em manutenção em um trecho da borda leste. Mantenha distância da beira.' },
      { type: 'li', text: 'Não há iluminação nem sinal de celular estável no mirante.' },
      { type: 'p', text: 'Informações atualizadas pela Secretaria de Turismo de Guaraciaba do Norte. Visitação gratuita nos dias úteis; aos fins de semana, consulte o proprietário.' },
    ] },
  },
  {
    id: 'tab-piramide', title: 'Pirâmide financeira: como funciona e como reconhecer — Bússola Financeira', url: 'https://bussolafinanceira.com.br/piramide-financeira-como-funciona',
    page: { title: 'Pirâmide financeira: como funciona e como reconhecer', blocks: [
      { type: 'h1', text: 'Pirâmide financeira: como funciona e como reconhecer' },
      { type: 'p', text: 'Na pirâmide financeira, o rendimento de quem entrou antes é pago com o dinheiro de quem entra depois. Não existe um negócio real gerando o lucro prometido. Quando os novos aportes diminuem, a conta não fecha e o esquema desmorona.' },
      { type: 'h2', text: 'Sinais de alerta' },
      { type: 'li', text: 'Rendimento fixo e alto (3%, 4% ao mês), sem risco.' },
      { type: 'li', text: 'Bônus por indicar novos investidores.' },
      { type: 'li', text: 'Lastro vago: "contratos", "safras", "ativos" que ninguém consegue visitar ou auditar.' },
      { type: 'li', text: 'Eventos luxuosos e muita imagem de sucesso.' },
      { type: 'li', text: 'Cobrança de taxas antecipadas para "liberar" o aporte ou "garantir" o retorno.' },
      { type: 'h2', text: 'O esquema de Ponzi' },
      { type: 'p', text: 'O nome vem de Charles Ponzi, que em 1920 prometeu dobrar o dinheiro de investidores em 90 dias com cupons postais. Pagava os antigos com o dinheiro dos novos.' },
      { type: 'h2', text: 'O que fazer' },
      { type: 'p', text: 'Pesquise se a empresa tem autorização para captar recursos, desconfie de promessas sem risco e guarde provas. Denúncias podem ser feitas ao Ministério Público e à autoridade reguladora do mercado.' },
    ] },
  },
  {
    id: 'tab-cvm', title: 'Consulta de participantes autorizados — CVM', url: 'https://consultas.cvm.gov.br/participantes?q=colheita',
    page: { title: 'Consulta de participantes autorizados', blocks: [
      { type: 'h1', text: 'Consulta de participantes autorizados' },
      { type: 'p', text: 'Termo pesquisado: "colheita capital gestao ltda"' },
      { type: 'h2', text: 'Resultado' },
      { type: 'p', text: 'Nenhum registro encontrado para o termo informado.' },
      { type: 'p', text: 'A ausência de registro indica que a empresa não é participante autorizada a administrar carteiras ou ofertar valores mobiliários ao público. Antes de investir, verifique a regularidade da empresa e desconfie de ofertas de retorno garantido.' },
    ] },
  },
  {
    id: 'tab-colheita', title: 'Colheita Capital — Plantando hoje, colhendo sempre', url: 'https://colheitacapital.com.br',
    page: { title: 'Colheita Capital', blocks: [
      { type: 'h1', text: 'Plantando hoje, colhendo sempre.' },
      { type: 'p', text: 'A Colheita Capital conecta você ao campo. Seu dinheiro vira contratos de safra em fazendas parceiras no Ceará, com rentabilidade de 4% ao mês.' },
      { type: 'img', src: 'assets/caso01/img/colheita-site-hero.jpg', caption: 'Visita a uma fazenda parceira (imagem de divulgação)', ratio: '16/9' },
      { type: 'h2', text: 'Como funciona' },
      { type: 'li', text: 'Você faz seu aporte na conta da Colheita Capital.' },
      { type: 'li', text: 'A gestão aloca seu dinheiro em contratos de safra.' },
      { type: 'li', text: 'Todo mês você recebe 4% de rentabilidade.' },
      { type: 'h2', text: 'Indique e ganhe' },
      { type: 'p', text: 'Indicou um amigo? Receba 1% do aporte dele como bônus de boas-vindas.' },
      { type: 'quote', text: '"Em dois meses já recuperei parte do que investi." — depoimento de investidor' },
      { type: 'p', text: 'Noite da Colheita: 10 de outubro, Sítio Flor da Serra, Guaraciaba do Norte. Confirme presença com seu consultor.' },
    ] },
  },
  {
    id: 'tab-reclame', title: 'Colheita Capital: reclamações — Queixa Certa', url: 'https://queixacerta.com.br/empresa/colheita-capital',
    page: { title: 'Colheita Capital: reclamações', blocks: [
      { type: 'h1', text: 'Colheita Capital: reclamações' },
      { type: 'p', text: 'Nota geral: 4,6/10. 11 reclamações nos últimos 12 meses. A empresa respondeu a 2.' },
      { type: 'quote', text: '"Pedi resgate em agosto e disseram que o prazo é de 60 dias. Já passou e nada." — Francisco, Sobral' },
      { type: 'quote', text: '"Só recebo se eu indicar mais gente. Que investimento é esse?" — anônimo' },
      { type: 'quote', text: '"A consultora da minha cidade disse que precisava pagar uma taxa de garantia antes. Paguei e nunca recebi recibo." — anônimo, serra da Ibiapaba' },
      { type: 'p', text: 'Resposta da empresa: "Lamentamos o ocorrido. Entre em contato com seu consultor."' },
    ] },
  },
  {
    id: 'tab-backup', title: 'Como fazer backup criptografado do celular — GuiaDroid', url: 'https://guiadroid.com.br/backup-criptografado',
    page: { title: 'Como fazer backup criptografado do celular Android', blocks: [
      { type: 'h1', text: 'Como fazer backup criptografado do celular Android' },
      { type: 'p', text: 'Um backup criptografado protege suas fotos, conversas e arquivos mesmo que o armazenamento caia em mãos erradas. Só quem tem a chave consegue abrir.' },
      { type: 'li', text: 'Escolha um destino seguro: nuvem própria ou outro computador.' },
      { type: 'li', text: 'Ative a criptografia de ponta a ponta e guarde a chave em local diferente.' },
      { type: 'li', text: 'Programe a sincronização automática, de preferência só no Wi-Fi.' },
      { type: 'li', text: 'Peça a alguém de confiança para configurar um espelho do aparelho, se você não quiser fazer sozinha.' },
      { type: 'p', text: 'Teste a restauração pelo menos uma vez, para ter certeza de que o backup funciona.' },
    ] },
  },
  {
    id: 'tab-farol', title: 'Bruna Leal — O Farol', url: 'https://ofarol.com.br/autor/bruna-leal',
    page: { title: 'Bruna Leal', blocks: [
      { type: 'h1', text: 'Bruna Leal' },
      { type: 'p', text: 'Repórter investigativa do O Farol, em Fortaleza. Cobre fraudes financeiras, consórcios e golpes contra aposentados. Ganhou o prêmio Imprensa do Nordeste por série sobre falsos consórcios de Sobral.' },
      { type: 'h2', text: 'Últimas reportagens' },
      { type: 'li', text: 'Falsos consórcios de Sobral deixam 300 famílias no prejuízo' },
      { type: 'li', text: 'Como uma "cooperativa" levou as economias de 40 aposentados' },
      { type: 'li', text: 'Promessas de retorno alto: o que os órgãos de defesa recomendam' },
      { type: 'p', text: 'Contato: bruna.leal@ofarol.com.br' },
    ] },
  },
  {
    id: 'tab-protetiva', title: 'Medidas protetivas: como pedir — Defensoria Pública', url: 'https://defensoria.ce.def.br/medida-protetiva',
    page: { title: 'Medidas protetivas: como pedir', blocks: [
      { type: 'h1', text: 'Medidas protetivas: como pedir' },
      { type: 'p', text: 'Quem sofre perseguição, ameaça ou assédio de ex-companheiro pode pedir medida protetiva de urgência, sem advogado, em qualquer delegacia ou na Defensoria Pública.' },
      { type: 'li', text: 'Guarde mensagens, prints e registros de ligação.' },
      { type: 'li', text: 'Anote datas, horários e locais das ocorrências.' },
      { type: 'li', text: 'Se houver risco imediato, ligue 190.' },
      { type: 'p', text: 'A medida pode determinar o afastamento do agressor e a proibição de contato.' },
    ] },
  },
];

let n = 0;
const q = (at, query) => ({ id: 'q' + String(++n).padStart(2, '0'), at, query, url: 'https://google.com/?q=' + encodeURIComponent(query) });
const p = (at, title, url, tab) => ({ id: 'p' + String(++n).padStart(2, '0'), at, title, url, ...(tab ? { tab } : {}) });

const history = [
  q('2026-09-12T21:08', 'receita bolo de milho verde'),
  p('2026-09-12T21:10', 'Bolo de milho verde cremoso — Cozinha da Vovó', 'https://cozinhadavovo.com.br/bolo-milho-verde'),
  q('2026-09-16T23:04', 'o que é esquema ponzi'),
  p('2026-09-16T23:12', 'Pirâmide financeira: como funciona e como reconhecer — Bússola Financeira', 'https://bussolafinanceira.com.br/piramide-financeira-como-funciona', 'tab-piramide'),
  q('2026-09-17T22:41', 'Bruna Leal O Farol'),
  p('2026-09-17T22:43', 'Bruna Leal — O Farol', 'https://ofarol.com.br/autor/bruna-leal', 'tab-farol'),
  q('2026-09-17T23:20', 'Colheita Capital reclame'),
  p('2026-09-17T23:22', 'Colheita Capital: reclamações — Queixa Certa', 'https://queixacerta.com.br/empresa/colheita-capital', 'tab-reclame'),
  q('2026-09-18T20:30', 'como denunciar pirâmide financeira'),
  q('2026-09-20T11:15', 'Smart Band 8 como ativar detecção de queda'),
  q('2026-09-22T19:02', 'dipirona alergia substituto'),
  q('2026-09-27T14:40', 'colheita capital gestao ltda cnpj'),
  q('2026-09-28T21:50', 'CVM consulta empresa autorizada'),
  p('2026-09-28T21:52', 'Consulta de participantes autorizados — CVM', 'https://consultas.cvm.gov.br/participantes?q=colheita', 'tab-cvm'),
  q('2026-09-29T08:10', 'melhor app de timelapse android'),
  p('2026-09-29T08:14', 'Timelapse sem segredo: guia para iniciantes — Fotografe Mais', 'https://fotografemais.com/timelapse-iniciantes'),
  q('2026-10-02T21:30', 'taxa de garantia investimento é legal'),
  q('2026-10-02T21:35', 'golpe taxa antecipada investimento Pix'),
  q('2026-10-02T23:40', 'backup celular criptografado'),
  p('2026-10-02T23:44', 'Como fazer backup criptografado do celular — GuiaDroid', 'https://guiadroid.com.br/backup-criptografado', 'tab-backup'),
  q('2026-10-05T10:20', 'passagem fortaleza sobral horários'),
  q('2026-10-06T08:00', 'tripé de carbono ou alumínio para timelapse'),
  q('2026-10-06T08:12', 'van sobral guaraciaba do norte horário'),
  q('2026-10-06T23:10', 'medida protetiva ex namorado'),
  p('2026-10-06T23:14', 'Medidas protetivas: como pedir — Defensoria Pública', 'https://defensoria.ce.def.br/medida-protetiva', 'tab-protetiva'),
  q('2026-10-08T21:40', 'contrato de freelancer cláusula de confidencialidade vale'),
  q('2026-10-08T21:55', 'multa por quebra de sigilo contrato prestador de serviço'),
  q('2026-10-08T22:10', 'proteção a quem denuncia golpe empresa'),
  q('2026-10-09T11:35', 'Café Margarida Sobral horário'),
  q('2026-10-09T22:10', 'previsão do tempo guaraciaba do norte sábado'),
  q('2026-10-10T17:22', 'horário do pôr do sol guaraciaba do norte hoje'),
  q('2026-10-10T17:25', 'melhor intervalo timelapse pôr do sol'),
  q('2026-10-10T18:41', 'mirante pedra lisa guaraciaba cerca'),
  p('2026-10-10T18:42', 'Mirante da Pedra Lisa — Turismo Ibiapaba', 'https://turismoibiapaba.com.br/guaraciaba/mirante-pedra-lisa', 'tab-mirante'),
  q('2026-10-10T22:38', 'como bloquear número desconhecido sms android'),
  p('2026-10-10T22:40', 'Como bloquear números no Android — GuiaDroid', 'https://guiadroid.com.br/bloquear-numeros', undefined),
];
// a busca de 10/10 22:38 abre uma página curta
history[history.length - 1].page = { title: 'Como bloquear números no Android', blocks: [
  { type: 'h1', text: 'Como bloquear números no Android' },
  { type: 'p', text: 'Abra o app de mensagens, toque na conversa, vá em "Detalhes" e escolha "Bloquear número". Se o remetente trocar de número, será preciso bloquear de novo.' },
  { type: 'p', text: 'Guarde as mensagens como prova se houver ameaça.' },
] };

const bookmarks = [
  { title: 'Bruna Leal — O Farol', url: 'https://ofarol.com.br/autor/bruna-leal' },
  { title: 'Pirâmide financeira: como reconhecer — Bússola Financeira', url: 'https://bussolafinanceira.com.br/piramide-financeira-como-funciona' },
  { title: 'Mirante da Pedra Lisa — Turismo Ibiapaba', url: 'https://turismoibiapaba.com.br/guaraciaba/mirante-pedra-lisa' },
  { title: 'Revista Lente Viva', url: 'https://lenteviva.com.br' },
  { title: 'Fotografe Mais', url: 'https://fotografemais.com' },
  { title: 'Expresso Norte — passagens', url: 'https://expressonorte.com.br' },
  { title: 'FotoBras', url: 'https://fotobras.com.br' },
];

export default { tabs, history, bookmarks };
