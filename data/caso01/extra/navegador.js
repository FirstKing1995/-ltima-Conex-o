// Navegador: histórico e favoritos extras (aparelho: até sáb 10/10 23:47). Somado a data/caso01/navegador.js.
// Sem abas novas. Ids com prefixo "x" para não colidir com q01/p01 do original.

let n = 0;
const q = (at, query) => ({ id: 'xq' + String(++n).padStart(2, '0'), at, query, url: 'https://busca.vento.app/?q=' + encodeURIComponent(query) });
const p = (at, title, url, page) => ({ id: 'xp' + String(++n).padStart(2, '0'), at, title, url, ...(page ? { page } : {}) });

const history = [
  /* maio e junho */
  q('2026-05-09T22:14', 'nimbus n9 como desativar som do obturador'),
  q('2026-05-20T16:02', 'quanto cobrar festa de 15 anos fotografia fortaleza'),
  q('2026-05-28T21:40', 'retrato de trabalhadores fotojornalismo referências'),
  p('2026-05-28T21:46', 'Tiago Santana: o sertão em preto e branco — Revista Lente Viva', 'https://lenteviva.com.br/perfil/tiago-santana'),
  q('2026-06-02T23:30', 'como escrever memorial descritivo de ensaio fotográfico'),
  q('2026-06-19T21:10', 'mercado são sebastião horário de abertura'),
  q('2026-06-22T13:40', 'cartão sd v60 ou v90 para vídeo 4k'),
  p('2026-06-22T13:52', 'Cartão de memória 128 GB V60 — Loja Foco', 'https://lojafoco.com.br/cartao-128gb-v60'),
  q('2026-06-27T08:30', 'previsão do tempo guaraciaba do norte são joão'),

  /* julho */
  q('2026-07-04T19:20', 'receita cuscuz de flocão macio'),
  q('2026-07-11T15:05', 'horário pôr do sol fortaleza hoje'),
  q('2026-07-15T22:50', 'filtro nd variável vale a pena'),
  q('2026-07-21T07:10', 'dermatite no rosto protetor solar oil free'),
  q('2026-07-30T21:58', 'streamflix entrar na tv com código'),

  /* agosto */
  q('2026-08-03T22:31', 'o que é pirâmide financeira'),
  p('2026-08-03T22:35', 'O que é pirâmide financeira? Entenda em 5 minutos — Portal do Consumidor', 'https://portaldoconsumidor.org.br/piramide-financeira', { title: 'O que é pirâmide financeira?', blocks: [
    { type: 'h1', text: 'O que é pirâmide financeira?' },
    { type: 'p', text: 'É um modelo em que o dinheiro de quem entra paga quem entrou antes. Não há produto ou negócio que sustente o retorno prometido. Enquanto entra gente nova, parece funcionar.' },
    { type: 'p', text: 'Promessas de ganho alto e garantido, bônus por indicar amigos e pressa para "não perder a oportunidade" são os sinais mais comuns.' },
  ] }),
  q('2026-08-08T07:40', 'luz de estúdio três pontos retrato esquema'),
  q('2026-08-14T12:10', 'luz de janela ensaio gestante dicas'),
  q('2026-08-19T20:05', 'feirinha da beira mar horário domingo'),
  q('2026-08-26T08:20', 'mensagem cpf irregular receita é golpe'),
  q('2026-08-30T22:45', 'como cortar fotos de um ensaio edição curadoria'),

  /* setembro */
  q('2026-09-03T15:55', 'prêmio luz do sertão fotografia regulamento'),
  q('2026-09-06T23:12', 'como fazer timelapse noturno'),
  p('2026-09-06T23:18', 'Timelapse noturno: estrelas, cidade e o "efeito pisca" — Fotografe Mais', 'https://fotografemais.com/timelapse-noturno', { title: 'Timelapse noturno: estrelas, cidade e o "efeito pisca"', blocks: [
    { type: 'h1', text: 'Timelapse noturno' },
    { type: 'p', text: 'À noite, tudo é manual: foco no infinito marcado com fita, ISO entre 1600 e 3200, exposição de 15 a 20 segundos e intervalo de 2 segundos entre as fotos.' },
    { type: 'li', text: 'Tripé firme, sem coluna central levantada.' },
    { type: 'li', text: 'Desligue a estabilização da lente.' },
    { type: 'li', text: 'Leve bateria extra: o frio da madrugada derruba a carga.' },
    { type: 'p', text: 'Para o "efeito pisca", use o deflicker na edição.' },
  ] }),
  q('2026-09-09T19:30', 'vestido verde madrinha casamento noite'),
  q('2026-09-13T09:05', 'contrato fotografia casamento modelo sinal'),
  q('2026-09-18T20:44', 'presente aniversário amiga fotógrafa barato'),
  q('2026-09-19T22:30', 'como responder comentários carrossel engajamento'),
  q('2026-09-24T21:15', 'abnt citação de imagem trabalho acadêmico'),
  q('2026-09-28T22:20', 'como denunciar golpe financeiro CVM'),
  p('2026-09-28T22:24', 'Serviço de Atendimento ao Cidadão — CVM', 'https://www.gov.br/cvm/atendimento', { title: 'Serviço de Atendimento ao Cidadão', blocks: [
    { type: 'h1', text: 'Serviço de Atendimento ao Cidadão' },
    { type: 'p', text: 'Reclamações e denúncias sobre ofertas irregulares de investimento podem ser registradas pelo formulário eletrônico. Informe o nome da empresa, o meio de contato e, se tiver, documentos e comprovantes.' },
    { type: 'p', text: 'A identidade de quem denuncia pode ser mantida em sigilo, se solicitado.' },
  ] }),

  /* outubro (até o dia 10, antes do evento) */
  q('2026-10-01T08:15', 'previsão do tempo fortaleza semana'),
  q('2026-10-03T19:10', 'lente 50mm 1.8 vale a pena para retrato'),
  q('2026-10-04T12:40', 'receita baião de dois cremoso'),
  q('2026-10-06T20:48', 'passagem de ônibus Fortaleza Sobral'),
  p('2026-10-06T20:55', 'Fortaleza → Sobral: horários e preços — Expresso Norte', 'https://expressonorte.com.br/fortaleza-sobral'),
  q('2026-10-07T13:20', 'oficina gratuita edição de cor lightroom'),
  q('2026-10-08T07:05', 'previsão do tempo serra da ibiapaba fim de semana'),
  q('2026-10-09T13:30', 'farmácia aberta sobral centro'),
  q('2026-10-10T10:12', 'quanto tempo dura bateria de drone no frio'),
];

const bookmarks = [
  { id: 'bm-x1', title: 'Portal do TCC — Faculdade Atlântico', url: 'https://portal.faculdadeatlantico.edu.br/tcc' },
  { id: 'bm-x2', title: 'Loja Foco', url: 'https://lojafoco.com.br' },
  { id: 'bm-x3', title: 'Escola Olhar — cursos', url: 'https://escolaolhar.com.br' },
  { id: 'bm-x4', title: 'Prêmio Luz do Sertão de Fotografia', url: 'https://premioluzdosertao.org.br' },
];

export default { history, bookmarks };
