// Arquivos do aparelho de Iara (até sáb 23:47). Pastas: Downloads, Documentos e segura (Pasta Segura, só abre com a senha).
// Blocos: h1 h2 p li table(rows, 1ª linha = cabeçalho) highlight sign. **negrito** e ==marca-texto== funcionam dentro do texto.

const pdf = (id, name, folder, at, size, pages, x = {}) => ({ id, name, folder, type: 'pdf', size, at, pages: pages.map(blocks => ({ blocks })), ...x });

const files = [
  /* ---------------- Downloads ---------------- */
  pdf('roteiro', 'Roteiro_Noite_da_Colheita_v4.pdf', 'Downloads', '2026-10-08T12:21', 214000, [[
    { type: 'h1', text: 'NOITE DA COLHEITA — ROTEIRO DE PRODUÇÃO (v4)' },
    { type: 'p', text: 'Sábado, 10 de outubro de 2026 · Sítio Flor da Serra, Guaraciaba do Norte (CE). Produção: Larissa Prado (Lari). Cliente: Colheita Capital. Todos os horários são do relógio oficial da produção. Dúvidas no grupo da equipe.' },
    { type: 'h2', text: 'Cronograma' },
    { type: 'table', rows: [
      ['Horário', 'Atividade', 'Responsável'],
      ['14:00', 'Montagem de palco, som e luz no galpão', 'Equipe técnica / Igor'],
      ['16:20', 'Chegada da equipe na casa sede; café e alinhamento', 'Lari'],
      ['17:00', 'Passagem de som da banda', 'Igor Som'],
      ['17:55', 'Fotos da propriedade e do mirante (pôr do sol)', 'Iara'],
      ['18:30', 'Teste de transmissão ao vivo (Lume)', 'Marcos'],
      ['19:00', 'Abertura dos portões e credenciamento', 'Lari / recepção'],
      ['19:30', 'Coquetel de boas-vindas', 'Buffet'],
      ['20:00', 'Jantar', 'Buffet'],
      ['21:00', 'Show: Forró Pé de Serra do Rafa (1º set)', 'Banda'],
      ['22:15', 'Intervalo da banda (20 min)', 'Igor'],
      ['22:35', 'Show: 2º set', 'Banda'],
      ['23:25', 'Banda para. Caio sobe ao palco', 'Lari / Igor'],
      ['23:30', 'Discurso do Caio (ao vivo no Lume, @colheitacapital)', 'Caio / Marcos'],
      ['23:30', 'Churrasco da equipe e da banda no camarim', 'Buffet'],
      ['23:52', 'Fim do discurso e brinde', 'Caio'],
      ['00:00', 'Queima de fogos no pátio', 'Fogos Serra Azul'],
      ['00:15', 'DJ e pista', 'DJ Léo Vale'],
      ['02:00', 'Encerramento e desmontagem', 'Equipe técnica'],
    ] },
    { type: 'h2', text: 'Observações' },
    { type: 'li', text: 'Cobertura de foto e vídeo: **Iara**. Para o discurso (23:30), posicionar a câmera 1 na lateral do palco; tripé fica no camarim.' },
    { type: 'li', text: 'A live do Caio é gerenciada pelo Marcos: sem cortes e sem reposição de áudio.' },
    { type: 'li', text: 'O camarim fica no anexo, atrás do palco. Acesso restrito à banda e à produção.' },
    { type: 'li', text: 'Estacionamento nos fundos do galpão. Ônibus e vans param na entrada principal.' },
    { type: 'li', text: 'Trânsito de pedestres até o mirante (420 m, trilha) só durante o dia, com cordão de segurança.' },
  ]]),

  pdf('convite-evento', 'Convite_Noite_da_Colheita.pdf', 'Downloads', '2026-09-22T10:06', 520000, [[
    { type: 'h1', text: 'Você está convidado: Noite da Colheita' },
    { type: 'p', text: 'A Colheita Capital convida seus investidores e parceiros para uma noite de confraternização na serra, com jantar, música ao vivo e a apresentação dos resultados do trimestre.' },
    { type: 'table', rows: [['Quando', 'Sábado, 10 de outubro de 2026, a partir das 19h'], ['Onde', 'Sítio Flor da Serra, Guaraciaba do Norte (CE)'], ['Traje', 'Passeio descontraído; leve um agasalho']] },
    { type: 'p', text: 'Apresente este convite na entrada. Convite pessoal e intransferível.' },
  ]]),

  pdf('relatorio-safras', 'Relatorio_Safras_Setembro.pdf', 'Downloads', '2026-10-02T07:02', 1380000, [[
    { type: 'h1', text: 'Relatório de Safras: Setembro/2026' },
    { type: 'p', text: 'Colheita Capital Gestão Ltda. Documento de divulgação aos investidores. Rendimento do mês: **4,0%**, lastreado em contratos de safra com produtores parceiros.' },
    { type: 'h2', text: 'Fazendas parceiras em operação' },
    { type: 'table', rows: [
      ['Fazenda parceira', 'Município', 'Cultura', 'Área (ha)', 'Rentabilidade'],
      ['Santa Luzia', 'Irauçuba', 'Milho', '820', '4,0%'],
      ['Boa Esperança', 'Itapipoca', 'Feijão', '640', '4,1%'],
      ['Vale Verde', 'Quixadá', 'Milho', '910', '3,9%'],
      ['Novo Horizonte', 'Canindé', 'Castanha', '780', '4,0%'],
      ['Riacho Fundo', 'Sobral', 'Algodão', '720', '4,0%'],
      ['Total', '', '', '3.870', '4,0%'],
    ] },
    { type: 'h2', text: 'Nota do período' },
    { type: 'p', text: 'A produtividade média do trimestre superou a meta em 6%. Todos os valores são estimativas da gestão e não representam promessa de rentabilidade futura.' },
    { type: 'p', text: 'Fotos e vídeos das fazendas no portal do investidor.' },
  ], [
    { type: 'h2', text: 'Rodapé' },
    { type: 'p', text: 'Este relatório não foi auditado por terceiros. Colheita Capital Gestão Ltda.' },
  ]]),

  pdf('passagem-onibus', 'Passagem_Fortaleza_Sobral_0910.pdf', 'Downloads', '2026-10-06T21:04', 98000, [[
    { type: 'h1', text: 'Expresso Norte: Passe de embarque' },
    { type: 'table', rows: [
      ['Passageiro', 'Iara Fontenele'],
      ['Origem', 'Fortaleza (Rodoviária Engenheiro João Thomé)'],
      ['Destino', 'Sobral'],
      ['Saída', 'Sexta, 09/10/2026, 07:30'],
      ['Chegada prevista', '11:20'],
      ['Poltrona', '14 (janela)'],
      ['Valor', 'R$ 89,90'],
    ] },
    { type: 'p', text: 'Apresente o QR code e um documento com foto. Chegue com 30 minutos de antecedência.' },
  ]]),

  pdf('reserva-van', 'Reserva_Van_0910.pdf', 'Downloads', '2026-10-07T10:31', 73000, [[
    { type: 'h1', text: 'Cooperativa Van Serrana: Voucher' },
    { type: 'table', rows: [
      ['Passageiro', 'Iara Fontenele'],
      ['Trecho', 'Sobral → Guaraciaba do Norte'],
      ['Saída', 'Sexta, 09/10/2026, 15:30'],
      ['Chegada prevista', '17:10'],
      ['Valor', 'R$ 35,00 (pago por Pix)'],
    ] },
    { type: 'p', text: 'Embarque no Terminal Rodoviário de Sobral. Em caso de atraso, ligue para o motorista: (88) 99701-2230.' },
  ]]),

  /* ---------------- Documentos ---------------- */
  pdf('contrato-freela', 'Contrato_Prestacao_Servicos_Iara.pdf', 'Documentos', '2026-05-05T10:02', 410000, [[
    { type: 'h1', text: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS AUTÔNOMOS' },
    { type: 'p', text: '**CONTRATANTE:** Colheita Capital Gestão Ltda., CNPJ 41.208.774/0001-50, com sede na Av. Dom Luís, Aldeota, Fortaleza (CE).' },
    { type: 'p', text: '**CONTRATADA:** Iara Fontenele, fotógrafa e videomaker autônoma, CPF 012.***.***-27.' },
    { type: 'h2', text: 'Cláusula 1ª: do objeto' },
    { type: 'p', text: 'Cobertura fotográfica e audiovisual de eventos, visitas e ações institucionais da CONTRATANTE, em todo o estado do Ceará.' },
    { type: 'h2', text: 'Cláusula 2ª: da remuneração' },
    { type: 'p', text: 'Pela prestação dos serviços, a CONTRATANTE pagará à CONTRATADA o valor mensal de **R$ 3.500,00**, até o dia 5 do mês seguinte, por Pix.' },
    { type: 'h2', text: 'Cláusula 3ª: da vigência' },
    { type: 'p', text: 'Prazo indeterminado, com início em 05/05/2026. Qualquer das partes pode rescindir mediante aviso de 30 dias.' },
    { type: 'h2', text: 'Cláusula 4ª: do uso de imagem' },
    { type: 'p', text: 'Todo o material produzido é cedido à CONTRATANTE, que poderá usá-lo em qualquer meio, sem limite de tempo. A CONTRATADA mantém o direito de uso em portfólio.' },
    { type: 'sign', text: 'Marcos Vieira', role: 'p/ Colheita Capital', signed: 'Marcos V.' },
    { type: 'sign', text: 'Iara Fontenele', role: 'Contratada', signed: 'Iara F.' },
  ]], { font: 'serif' }),

  pdf('contrato-padrao', 'Colheita_Contrato_Padrao_Investidor.pdf', 'Documentos', '2026-09-14T22:41', 880000, [[
    { type: 'h1', text: 'CONTRATO DE PARTICIPAÇÃO EM SAFRA (MODELO PADRÃO)' },
    { type: 'p', text: 'Pelo presente instrumento, de um lado a **COLHEITA CAPITAL GESTÃO LTDA.**, doravante GESTORA, e de outro o INVESTIDOR, qualificado no Termo de Adesão, têm entre si justo e contratado o seguinte:' },
    { type: 'h2', text: 'Cláusula 1ª: do objeto' },
    { type: 'p', text: 'O INVESTIDOR aporta recursos que a GESTORA destinará à participação em contratos de safra firmados com produtores rurais parceiros.' },
    { type: 'h2', text: 'Cláusula 2ª: da rentabilidade' },
    { type: 'p', text: 'A GESTORA remunerará o aporte em **4% (quatro por cento) ao mês**, creditados até o dia 10 do mês seguinte, lastreados nos resultados dos contratos de safra.' },
    { type: 'h2', text: 'Cláusula 3ª: do prazo e do resgate' },
    { type: 'p', text: 'O prazo mínimo é de 12 meses. O resgate antecipado poderá ser solicitado após o 6º mês, com prazo de liquidação de até 60 dias.' },
    { type: 'h2', text: 'Cláusula 4ª: do indicador' },
    { type: 'p', text: 'O INVESTIDOR que indicar novos aportantes receberá bônus de 1% sobre o valor aportado pelo indicado, creditado na primeira remuneração.' },
    { type: 'h2', text: 'Cláusula 5ª: das garantias' },
    { type: 'p', text: 'Os contratos de safra servem de lastro ao aporte. A GESTORA não oferece garantia de capital nem se responsabiliza por frustrações de safra.' },
  ], [
    { type: 'h2', text: 'Cláusula 6ª: das consultoras e consultores' },
    { type: 'p', text: 'A GESTORA poderá contar com consultores regionais para atendimento aos investidores. Os consultores não recebem nem administram valores em nome da GESTORA; todo aporte deve ser feito exclusivamente para a conta da GESTORA.' },
    { type: 'h2', text: 'Cláusula 7ª: das taxas' },
    { type: 'highlight', text: 'A GESTORA não cobra taxa de adesão, de garantia, de custódia, de administração ou de saída. Qualquer cobrança feita em nome da GESTORA por terceiros é indevida e deve ser comunicada imediatamente à GESTORA.' },
    { type: 'h2', text: 'Cláusula 8ª: do foro' },
    { type: 'p', text: 'Fica eleito o foro da Comarca de Fortaleza (CE) para dirimir quaisquer dúvidas oriundas deste contrato.' },
    { type: 'sign', text: 'Caio Montenegro', role: 'Colheita Capital Gestão Ltda.', signed: 'C. Montenegro' },
    { type: 'sign', text: 'INVESTIDOR', role: 'Conforme Termo de Adesão' },
  ]], { font: 'serif' }),

  pdf('termo-confidencialidade', 'Termo_de_Confidencialidade.pdf', 'Documentos', '2026-05-05T10:04', 220000, [[
    { type: 'h1', text: 'TERMO DE CONFIDENCIALIDADE E SIGILO' },
    { type: 'p', text: 'Pelo presente termo, **IARA FONTENELE** (RECEPTORA) compromete-se perante a **COLHEITA CAPITAL GESTÃO LTDA.** (DIVULGADORA) a manter sigilo sobre as informações a que tiver acesso em razão da prestação de serviços.' },
    { type: 'h2', text: 'Cláusula 1ª: das informações confidenciais' },
    { type: 'p', text: 'São confidenciais todas as informações sobre clientes, investidores, fornecedores, fazendas e propriedades parceiras, operações, resultados, estratégias, contratos e bastidores de eventos, em qualquer meio.' },
    { type: 'h2', text: 'Cláusula 2ª: das exceções' },
    { type: 'p', text: 'Não se aplicam as exceções legais de informação pública ou cuja divulgação seja exigida por autoridade competente.' },
    { type: 'h2', text: 'Cláusula 3ª: do prazo' },
    { type: 'p', text: 'O sigilo vigora durante a prestação de serviços e por 5 (cinco) anos após o seu término.' },
    { type: 'h2', text: 'Cláusula 4ª: da penalidade' },
    { type: 'p', text: 'O descumprimento deste termo sujeita a RECEPTORA ao pagamento de multa de **R$ 100.000,00 (cem mil reais)**, sem prejuízo de perdas e danos e de medidas judiciais cabíveis.' },
    { type: 'sign', text: 'Caio Montenegro', role: 'Colheita Capital Gestão Ltda.', signed: 'C. Montenegro' },
    { type: 'sign', text: 'Iara Fontenele', role: 'Receptora', signed: 'Iara F.' },
  ]], { font: 'serif' }),

  pdf('curriculo-iara', 'Curriculo_Iara_Fontenele.pdf', 'Documentos', '2026-08-12T16:38', 156000, [[
    { type: 'h1', text: 'Iara Fontenele' },
    { type: 'p', text: 'Fotógrafa e videomaker · Fortaleza (CE) · @iarafontenele.foto · iara.fontenele@correio.app' },
    { type: 'h2', text: 'Resumo' },
    { type: 'p', text: 'Cinco anos de experiência em fotografia de eventos, casamentos e institucional. Formada em Comunicação (Sobral). Fotografia documental, luz natural e edição de vídeo curto para redes.' },
    { type: 'h2', text: 'Experiência' },
    { type: 'li', text: 'Freelancer, Colheita Capital (mai/2026 a hoje): fotografia e vídeo de eventos e ações institucionais.' },
    { type: 'li', text: 'Fotógrafa autônoma (2021 a hoje): casamentos, ensaios e eventos corporativos em Fortaleza e na Serra da Ibiapaba.' },
    { type: 'li', text: 'Assistente de fotografia, Estúdio Lume Claro (2020/2021).' },
    { type: 'h2', text: 'Formação' },
    { type: 'li', text: 'Comunicação Social, Sobral (2018 a 2022).' },
  ]]),

  pdf('orcamento-ensaio-renata', 'Orcamento_Ensaio_Clinica.pdf', 'Documentos', '2026-08-21T10:03', 120000, [[
    { type: 'h1', text: 'Orçamento: ensaio profissional para clínica' },
    { type: 'table', rows: [['Item', 'Descrição', 'Valor'], ['Diária', '4 horas de cobertura', 'R$ 1.600,00'], ['Tratamento', '40 fotos tratadas', 'R$ 800,00'], ['Uso de imagem', 'Site e redes, 2 anos', 'R$ 400,00'], ['Total', '', 'R$ 2.800,00']] },
    { type: 'p', text: 'Validade: 15 dias. Pagamento: 50% na reserva da data e 50% na entrega.' },
  ]]),

  { id: 'orcamento-casamento', name: 'Orcamento_Casamento_Livia_Joao.xlsx', folder: 'Documentos', type: 'xlsx', size: 24000, at: '2026-09-13T09:28',
    sheets: [{ name: 'Orçamento', rows: [
      ['Pacote', 'Cobertura', 'Horas', 'Valor'],
      ['A: Cerimônia', '1 fotógrafa', '4', 'R$ 3.200,00'],
      ['B: Cerimônia + festa', '1 fotógrafa + assistente', '9', 'R$ 5.400,00'],
      ['Álbum 30x30', '30 páginas', '', 'R$ 900,00'],
      ['Sinal (30%)', 'Reserva da data', '', 'R$ 1.620,00'],
    ] }] },

  { id: 'cronograma-ensaios', name: 'Cronograma_Ensaios_2026.xlsx', folder: 'Documentos', type: 'xlsx', size: 31000, at: '2026-09-02T17:10',
    sheets: [{ name: 'Ensaios', rows: [
      ['Cliente', 'Tipo', 'Data', 'Status'],
      ['Camila Bezerra', 'Gestante', '15/08', 'Entregue'],
      ['Clínica Almeida', 'Institucional', '14/09', 'Entregue'],
      ['Família Moura', 'Família', '26/09', 'Entregue'],
      ['Lívia e João', 'Casamento', '12/12', 'Sinal pendente'],
      ['Noite da Colheita', 'Evento', '10/10', 'Contratado'],
    ] }] },

  /* ---------------- Pasta Segura ---------------- */
  {
    id: 'taxas-garantia', name: 'taxas_garantia.xlsx', folder: 'segura', type: 'xlsx', size: 19000, at: '2026-10-05T22:10',
    sheets: [
      { name: 'Famílias', rows: [
        ['N.º', 'Família', 'Município', 'Valor pago', 'Data', 'Pix para', 'Contato'],
        ['1', 'Antônio Fontenele (meu pai)', 'Guaraciaba do Norte', 'R$ 30.000,00', '14/08', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'confirmou comigo 02/10'],
        ['2', 'José Raimundo Moura', 'Ibiapina', 'R$ 18.000,00', '19/07', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'vizinho do pai'],
        ['3', 'Francisca das Chagas Lima', 'Ubajara', 'R$ 12.500,00', '22/07', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'prima da mãe'],
        ['4', 'Manoel Ferreira Neto', 'São Benedito', 'R$ 25.000,00', '02/08', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'vendeu um gado'],
        ['5', 'Raimunda Pinheiro', 'Carnaubal', 'R$ 8.000,00', '08/08', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'aposentada'],
        ['6', 'Sebastião e Lúcia Araújo', 'Guaraciaba do Norte', 'R$ 20.000,00', '25/08', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'padrinhos de uma amiga'],
        ['7', 'Pedro Alves Sobrinho', 'Viçosa do Ceará', 'R$ 15.000,00', '31/08', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'indicado pelo Sebastião'],
        ['8', 'Maria Neuma Costa', 'Tianguá', 'R$ 10.000,00', '09/09', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'comerciante'],
        ['9', 'Cícero Batista', 'Croatá', 'R$ 6.500,00', '14/09', '(88) 99645-1209 MARIA EDUARDA S ANDRADE', 'pediu para não aparecer'],
        ['Total', '9 famílias', '', 'R$ 145.000,00', '', '', ''],
      ] },
      { name: 'Observações', rows: [
        ['Observação', 'Texto'],
        ['1', '"Taxa de garantia" cobrada antes de liberar o aporte do investidor. Pix sempre para o mesmo número.'],
        ['2', 'A Colheita Capital não cobra taxa nenhuma — confirmado no contrato padrão, cláusula 7.'],
        ['3', 'Quem cobra é a consultora regional. Ela diz que "a empresa exige".'],
        ['4', 'Nenhum recibo da Colheita. Só comprovante de Pix para o chip de trabalho dela.'],
        ['5', 'Falta conferir se o Caio sabe da taxa ou se é por fora.'],
      ] },
    ],
  },

  {
    id: 'leia-me-segura', name: 'LEIA-ME.txt', folder: 'segura', type: 'txt', size: 3200, at: '2026-10-05T22:34',
    text: `LEIA-ME — Pasta Segura

Se você está lendo isto, ou eu te passei a senha, ou aconteceu alguma coisa comigo. Tomara que seja a primeira.

O que tem aqui:
- taxas_garantia.xlsx: a lista das famílias da serra que pagaram uma "taxa de garantia" por Pix para a chave (88) 99645-1209.
- fazendas_conferencia.xlsx: a conferência, fazenda por fazenda, do que a Colheita Capital diz que tem.
- comprovante_devolucao_2509.pdf: o comprovante dos R$ 20 mil que o Caio mandou e eu devolvi.

O que eu descobri:
1. A Colheita Capital é uma pirâmide. Não existe fazenda. Eu fotografei e editei tudo: as "fazendas" são sítios de terceiros alugados por um dia ou fotos de banco de imagens. Os 4% ao mês são pagos com o dinheiro dos novos entrando.
2. O Caio sabe. Ele me mandou R$ 20 mil de "bônus" no dia 25/09. Eu devolvi. Em 08/10 ele me lembrou do termo de confidencialidade, com aquela multa de R$ 100 mil.
3. A taxa de garantia é coisa da Duda. A Colheita Capital não cobra taxa nenhuma: está no contrato padrão, cláusula 7. A Duda cobra por fora, por Pix, no número de trabalho dela, e usa o nome da empresa. O meu pai pagou R$ 30 mil em 14/08.

Eu fui falar com ela no dia 1º. Ela chorou, pediu um tempo, disse que ia devolver tudo. Eu disse que dava até o dia 12. Quero acreditar que ela vai devolver. Ela é minha melhor amiga desde a 4ª série. Mas o dinheiro das famílias não é meu para perdoar.

O que fazer:
- Entregar tudo para a Bruna Leal, do O Farol, na segunda, dia 12, 10h. O e-mail dela é bruna.leal@ofarol.com.br.
- Se eu não aparecer, mostrar esta pasta a ela e a mais ninguém da Colheita.
- Avisar o meu pai e a minha mãe, sem alarde.

Iara`,
  },

  {
    id: 'comprovante-devolucao', name: 'comprovante_devolucao_2509.pdf', folder: 'segura', type: 'pdf', size: 88000, at: '2026-09-25T10:42',
    pages: [{ blocks: [
      { type: 'h1', text: 'Jandaia: Comprovante de devolução de Pix' },
      { type: 'table', rows: [
        ['Tipo', 'Devolução de Pix'],
        ['Valor', 'R$ 20.000,00'],
        ['Data e hora', '25/09/2026, 10:40'],
        ['Para', 'COLHEITA CAPITAL GESTAO LTDA'],
        ['De', 'Iara Fontenele'],
        ['Mensagem', 'Devolução — não aceito'],
        ['Pix original', 'Bônus performance, recebido às 10:12'],
      ] },
      { type: 'p', text: 'Comprovante gerado pelo app Jandaia.' },
    ] }],
  },

  {
    id: 'fazendas-conferencia', name: 'fazendas_conferencia.xlsx', folder: 'segura', type: 'xlsx', size: 22000, at: '2026-09-30T21:02',
    sheets: [{ name: 'Conferência', rows: [
      ['Fazenda "parceira"', 'O que a empresa diz', 'O que eu vi', 'Prova'],
      ['Santa Luzia (Irauçuba)', '820 ha de milho', 'Sítio de um conhecido do Caio, alugado por um dia (R$ 800)', 'fotos 14/07, placa trocada'],
      ['Boa Esperança (Itapipoca)', '640 ha de feijão', 'Lavoura de 2 ha; o resto é foto de banco de imagens', 'busca reversa'],
      ['Vale Verde (Quixadá)', '910 ha de milho', 'Visita encenada com figurantes de colete', 'vídeo bruto'],
      ['Novo Horizonte (Canindé)', '780 ha de castanha', 'Cajueiral de terceiros; o dono nem conhece a empresa', 'conversa com o vigia'],
      ['Riacho Fundo (Sobral)', '720 ha de algodão', 'Não existe. Imagem de drone é de site estrangeiro', 'busca reversa'],
      ['Total declarado', '3.870 ha', '', ''],
    ] }],
  },
  {
    id: 'briefing-colheita', name: 'Briefing_Eventos_Colheita_Out.pdf', folder: 'Downloads', type: 'pdf', size: 286000, at: '2026-09-23T10:03',
    pages: [{ blocks: [
      { type: 'h1', text: 'Colheita Capital — Briefing de conteúdo · Outubro/2026' },
      { type: 'p', text: 'Responsável: Marcos Vieira (Marketing). Fotografia e vídeo: Iara Fontenele (freela).' },
      { type: 'h2', text: 'Entregas' },
      { type: 'li', text: 'Cobertura completa da Noite da Colheita, Sítio Flor da Serra, Guaraciaba do Norte, 10/10.' },
      { type: 'li', text: 'Vídeo institucional "Do campo para o seu rendimento" até 15/10.' },
      { type: 'li', text: 'Fotos para o relatório de safra do trimestre.' },
      { type: 'h2', text: 'Regras de uso de imagem' },
      { type: 'highlight', text: 'Não identificar o nome nem a localização das fazendas parceiras. Usar o banco de imagens aprovado quando não houver material próprio.' },
      { type: 'li', text: 'Nenhuma imagem de investidores sem autorização assinada.' },
      { type: 'li', text: 'Todo material bruto pertence à Colheita Capital e deve ser entregue em até 72 h. Ver termo de confidencialidade.' },
      { type: 'sign', text: 'Marcos Vieira · Colheita Capital Gestão Ltda.' },
    ] }],
  },
  {
    id: 'ata-assembleia', name: 'Ata_Assembleia_Agosto.pdf', folder: 'Downloads', type: 'pdf', size: 198000, at: '2026-08-20T20:50',
    pages: [{ blocks: [
      { type: 'h1', text: 'Condomínio Edifício Jangada — Ata da Assembleia Ordinária' },
      { type: 'p', text: 'Aos 20 dias de agosto de 2026, às 19h30, no salão de festas, reuniram-se os condôminos.' },
      { type: 'li', text: 'Aprovada a troca do portão da garagem (3 orçamentos; menor valor).' },
      { type: 'li', text: 'Taxa extra de R$ 85,00 em setembro e outubro.' },
      { type: 'li', text: 'Dedetização marcada para 02/10. Moradores devem manter as janelas fechadas.' },
      { type: 'li', text: 'Proibido estender roupa nas varandas voltadas para a rua.' },
      { type: 'p', text: 'Nada mais havendo a tratar, encerrou-se a reunião às 21h05.' },
      { type: 'sign', text: 'Síndico: Edvaldo Moura · Secretária: Rosângela Pinto' },
    ] }],
  },
];

export default { files };
