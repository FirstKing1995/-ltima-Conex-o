// Arquivos do aparelho de Iara (até sáb 23:47). Pastas: Downloads, Documentos e segura (Pasta Trancada, só abre com a senha).
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
      ['18:30', 'Teste de transmissão ao vivo (Instagram)', 'Marcos'],
      ['19:00', 'Abertura dos portões e credenciamento', 'Lari / recepção'],
      ['19:30', 'Coquetel de boas-vindas', 'Buffet'],
      ['20:00', 'Jantar', 'Buffet'],
      ['21:00', 'Show: Forró Pé de Serra do Rafa (1º set)', 'Banda'],
      ['22:15', 'Intervalo da banda (20 min)', 'Igor'],
      ['22:35', 'Show: 2º set', 'Banda'],
      ['23:25', 'Banda para. Caio sobe ao palco', 'Lari / Igor'],
      ['23:30', 'Discurso do Caio (ao vivo no Instagram, @colheitacapital)', 'Caio / Marcos'],
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
    { type: 'p', text: 'Fotógrafa e videomaker · Fortaleza (CE) · @iarafontenele.foto · iara.fontenele@gmail.com' },
    { type: 'h2', text: 'Resumo' },
    { type: 'p', text: 'Cinco anos de experiência em fotografia de eventos, casamentos e institucional. Formada em Comunicação (Sobral). Fotografia documental, luz natural e edição de vídeo curto para redes.' },
    { type: 'h2', text: 'Experiência' },
    { type: 'li', text: 'Freelancer, Colheita Capital (mai/2026 a hoje): fotografia e vídeo de eventos e ações institucionais.' },
    { type: 'li', text: 'Fotógrafa autônoma (2021 a hoje): casamentos, ensaios e eventos corporativos em Fortaleza e na Serra da Ibiapaba.' },
    { type: 'li', text: 'Assistente de fotografia, Estúdio Instagram Claro (2020/2021).' },
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

  /* ---------------- Pasta Trancada ---------------- */
  {
    id: 'taxas-garantia', name: 'taxas_garantia.xlsx', folder: 'segura', type: 'xlsx', size: 19000, at: '2026-10-05T22:10',
    sheets: [
      { name: 'Famílias', rows: [
        ['N.º', 'Família', 'Município', 'Valor pago', 'Data', 'Pix para', 'Cobrança', 'Contato'],
        ['1', 'Antônio Fontenele (meu pai)', 'Guaraciaba do Norte', 'R$ 30.000,00', '14/08', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'confirmou comigo 02/10'],
        ['2', 'José Raimundo Moura', 'Ibiapina', 'R$ 18.000,00', '19/07', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'vizinho do pai'],
        ['3', 'Francisca das Chagas Lima', 'Ubajara', 'R$ 12.500,00', '22/07', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'prima da mãe'],
        ['4', 'Manoel Ferreira Neto', 'São Benedito', 'R$ 25.000,00', '02/08', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'vendeu um gado'],
        ['5', 'Raimunda Pinheiro', 'Carnaubal', 'R$ 8.000,00', '08/08', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'aposentada'],
        ['6', 'Sebastião e Lúcia Araújo', 'Guaraciaba do Norte', 'R$ 20.000,00', '25/08', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'padrinhos de uma amiga'],
        ['7', 'Pedro Alves Sobrinho', 'Viçosa do Ceará', 'R$ 15.000,00', '31/08', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'indicado pelo Sebastião'],
        ['8', 'Maria Neuma Costa', 'Tianguá', 'R$ 10.000,00', '09/09', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'comerciante'],
        ['9', 'Cícero Batista', 'Croatá', 'R$ 6.500,00', '14/09', 'M E S ANDRADE ME (chave aleatória 3f9a2c71…e112)', 'WhatsApp (88) 99645-1209', 'pediu para não aparecer'],
        ['Total', '9 famílias', '', 'R$ 145.000,00', '', '', '', ''],
      ] },
      { name: 'Observações', rows: [
        ['Observação', 'Texto'],
        ['1', '"Taxa de garantia" cobrada antes de liberar o aporte do investidor. Pix sempre para a mesma firma, M E S ANDRADE ME, CNPJ 52.318.044/0001-09.'],
        ['2', 'A Colheita Capital não cobra taxa nenhuma — confirmado no contrato padrão, cláusula 7.'],
        ['3', 'Quem cobra se apresenta como gente da Colheita e diz que "a empresa exige". A cobrança chega sempre do mesmo número no WhatsApp.'],
        ['4', 'Nenhum recibo da Colheita. Só comprovante de Pix para a firma. M E S: conferir de quem são as iniciais.'],
        ['5', 'Falta conferir se o Caio sabe da taxa ou se é por fora.'],
      ] },
    ],
  },

  {
    id: 'leia-me-segura', name: 'LEIA-ME.txt', folder: 'segura', type: 'txt', size: 3200, at: '2026-10-05T22:34',
    text: `LEIA-ME — Pasta Trancada

Se você está lendo isto, ou eu te passei a senha, ou aconteceu alguma coisa comigo. Tomara que seja a primeira.

O que tem aqui:
- taxas_garantia.xlsx: a lista das famílias da serra que pagaram uma "taxa de garantia" por Pix para a firma M E S ANDRADE ME.
- fazendas_conferencia.xlsx: a conferência, fazenda por fazenda, do que a Colheita Capital diz que tem.
- comprovante_devolucao_2509.pdf: o comprovante dos R$ 20 mil que o Caio mandou e eu devolvi.

O que eu descobri:
1. A Colheita Capital é uma pirâmide. Não existe fazenda. Eu fotografei e editei tudo: as "fazendas" são sítios de terceiros alugados por um dia ou fotos de banco de imagens. Os 4% ao mês são pagos com o dinheiro dos novos entrando.
2. O Caio sabe. Ele me mandou R$ 20 mil de "bônus" no dia 25/09. Eu devolvi. Em 08/10 ele me lembrou do termo de confidencialidade, com aquela multa de R$ 100 mil.
3. A taxa de garantia não é da Colheita. A Colheita Capital não cobra taxa nenhuma: está no contrato padrão, cláusula 7. Alguém de dentro cobra por fora, por Pix, numa firma de iniciais, e usa o nome da empresa. O meu pai pagou R$ 30 mil em 14/08.

Eu sei quem é. Não vou escrever o nome aqui: se você chegou até esta pasta, o número e a firma te levam até a pessoa. Eu dei até o dia 12 para ela devolver tudo. Quero acreditar que vai devolver. Mas o dinheiro das famílias não é meu para perdoar.

O que fazer:
- Entregar tudo para a Bruna Leal, do O Farol, na segunda, dia 12, 10h. O e-mail dela é bruna.leal@ofarol.com.br.
- Se eu não aparecer, mostrar esta pasta a ela e a mais ninguém da Colheita.
- Avisar o meu pai e a minha mãe, sem alarde.

Iara`,
  },

  {
    id: 'comprovante-devolucao', name: 'comprovante_devolucao_2509.pdf', folder: 'segura', type: 'pdf', size: 88000, at: '2026-09-25T10:42',
    pages: [{ blocks: [
      { type: 'h1', text: 'Nubank: Comprovante de devolução de Pix' },
      { type: 'table', rows: [
        ['Tipo', 'Devolução de Pix'],
        ['Valor', 'R$ 20.000,00'],
        ['Data e hora', '25/09/2026, 10:40'],
        ['Para', 'COLHEITA CAPITAL GESTAO LTDA'],
        ['De', 'Iara Fontenele'],
        ['Mensagem', 'Devolução — não aceito'],
        ['Pix original', 'Bônus performance, recebido às 10:12'],
      ] },
      { type: 'p', text: 'Comprovante gerado pelo app Nubank.' },
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

  /* ================= PARTE 2 (segundo lote da extração: nuvem de Iara) ================= */

  // Cap. 5 — a pesquisa dela sobre a pedra
  pdf('recortes-pedra', 'Recortes_Pedra_Lisa_hemeroteca.pdf', 'segura', '2026-09-27T23:41', 2140000, [
    [
      { type: 'h1', text: 'Recortes — Pedra Lisa' },
      { type: 'p', text: 'Digitalizados na hemeroteca da Biblioteca Municipal de Guaraciaba do Norte e no arquivo do Serra Notícias. Pedi como "pesquisa para um livro de fotografia". Ninguém perguntou mais nada. Só a moça do arquivo, que disse: "a senhora é a segunda pessoa que pede esses jornais".' },
      { type: 'h2', text: 'Correio da Ibiapaba · 14 de outubro de 1958' },
      { type: 'quote', text: 'TRAGÉDIA NO SÍTIO DO CORONEL. A jovem Joana Batista, 18 anos, filha de morador do Sítio Flor da Serra, propriedade do Cel. Firmino Sampaio, faleceu na noite de sábado, 11, ao cair da Pedra Lisa, onde teria subido em busca de uma cabra desgarrada. A festa da colheita, tradição da família, não foi interrompida. O coronel mandou rezar missa de sétimo dia às suas custas.' },
      { type: 'h2', text: 'Correio da Ibiapaba · 15 de outubro de 1975' },
      { type: 'quote', text: 'MOÇA CAI DE PEDRA EM GUARACIABA. Francisca Bezerra, a Chica, de 17 anos, ajudante de cozinha contratada para a tradicional festa da colheita dos Sampaio, morreu na madrugada de domingo, 12, após cair da Pedra Lisa. Segundo colegas, ela "saiu da cozinha para tomar um ar" pouco antes da meia-noite. O corpo foi encontrado pelo caseiro José Ribamar, de 22 anos.' },
    ],
    [
      { type: 'h2', text: 'Serra Notícias · 13 de outubro de 1992' },
      { type: 'quote', text: 'ACIDENTE NA PEDRA LISA. A estudante Antônia Fontenele, 21 anos, natural de Guaraciaba do Norte, morreu na noite de sábado, 10, ao cair do mirante da Pedra Lisa durante a festa da colheita no Sítio Flor da Serra. Amigos disseram que ela tinha subido "para ver as estrelas". O caseiro da propriedade localizou o corpo ao amanhecer. O delegado considerou o caso encerrado.' },
      { type: 'p', text: 'Anotação minha, a caneta, na margem da cópia: ==tia Tônia==. O pai nunca disse o nome dela em voz alta. Na casa da vó tinha um retrato virado para a parede.' },
      { type: 'h2', text: 'Serra Notícias · 12 de outubro de 2009' },
      { type: 'quote', text: 'JOVEM DA FAMÍLIA SAMPAIO MORRE EM QUEDA. Rosângela Sampaio, 19 anos, irmã do produtor Ademar Sampaio Andrade, morreu na noite de sábado, 10, ao cair da Pedra Lisa, na propriedade da família, durante a festa da colheita. Segundo convidados, ela subiu a trilha à procura de uma criança que havia se afastado da festa. A criança foi encontrada bem, pouco depois, na base da trilha.' },
      { type: 'p', text: 'A criança era eu. Eu tinha dez anos. Eu estava atrás da Pipoca, que correu para a pedra quando começou o barulho. Eu lembro das luzes lá em cima. Eu lembro da Rô me chamando. Eu não lembro de descer.' },
      { type: 'highlight', text: '1958 · 1975 · 1992 · 2009. Sempre no segundo sábado de outubro. Sempre a festa da colheita. Sempre uma moça. Dezessete anos entre uma e outra.' },
      { type: 'p', text: 'O próximo segundo sábado de outubro de 17 em 17 é 10/10/2026. É a data da Noite da Colheita. Fui contratada para fotografar.' },
    ],
  ], { req: 'final_verdade' }),

  // Cap. 6 — o manuscrito, cópia local (a que ficou no aparelho, sem a edição da nuvem)
  {
    id: 'caderno-da-serra', name: 'Caderno_da_Serra_rascunho.docx', folder: 'Documentos', type: 'docx', size: 412000, at: '2026-10-09T23:58', req: 'cap6',
    pages: [
      { blocks: [
        { type: 'h1', text: 'Caderno da Serra' },
        { type: 'p', text: 'rascunho · não mostrar a ninguém ainda · versão do aparelho' },
        { type: 'h2', text: '1. A câmera' },
        { type: 'p', text: 'Ganhei a primeira câmera em junho de 2009. Uma compacta prata, de segunda mão, que o pai comprou na feira de Tianguá. A primeira foto foi da Pipoca. A última daquele ano também.' },
        { type: 'h2', text: '2. O barulho' },
        { type: 'p', text: 'Desde 2009 eu escuto a pedra. Um som que não é som. Fica no peito, embaixo do osso.' },
        { type: 'p', text: 'Não é sempre. É quando venta de um lado só. A Duda também escutava, quando a gente era menina. Ela dizia que era a pedra chamando. Eu dizia que era o vento. Hoje eu não sei qual de nós duas estava com medo de quê.' },
        { type: 'h2', text: '3. As moças' },
        { type: 'p', text: 'Quatro moças em sessenta e oito anos. Todas na mesma noite do ano, todas da mesma pedra, todas "acidente". Ninguém da serra acha isso estranho. Ou todo mundo acha e ninguém fala.' },
        { type: 'p', text: 'O seu Zé achou três delas. Quando eu perguntei da Rô, ele olhou para o chão e disse: "a menina devia ter ficado embaixo". A menina era eu.' },
      ] },
      { blocks: [
        { type: 'h2', text: '4. O Rafa' },
        { type: 'p', text: 'Ele voltou a mandar mensagem de número novo. Eu reconheço o jeito de escrever, o "tu" sem acento, o mesmo erro em "arrepender". Vou guardar tudo e pedir a medida protetiva na volta da serra. Cansei de ter medo de quem eu conheço.' },
        { type: 'h2', text: '5. A Duda' },
        { type: 'p', text: 'A pessoa que eu mais amei nessa vida está tirando dinheiro do meu pai. Eu fico escrevendo isso para ver se a frase fica menos absurda. Não fica.' },
        { type: 'p', text: 'Eu não quero que ela seja presa. Eu quero que ela devolva, e que pare. E que me olhe na cara uma vez sem a família dela atrás.' },
        { type: 'h2', text: '6. Eles' },
        { type: 'p', text: 'O Ademar fala da festa como quem fala de missa. A Dona Eunice não sobe na pedra. O cartório de Ipu tem um estatuto de 1941 com o nome do bisavô da Duda. Tem uma associação que recebe dinheiro e não faz caridade nenhuma.' },
        { type: 'p', text: 'A serra não pede nada. Quem pede são eles.' },
        { type: 'p', text: 'Sábado eu subo. Com a câmera, com o gravador, com o celular no bolso. Se a pedra fizer barulho, eu gravo o barulho. Se for gente, eu gravo a gente.' },
      ] },
    ],
  },

  // Cap. 7 — o dinheiro, o estatuto e o vento
  {
    id: 'repasses-associacao', name: 'repasses_associacao.xlsx', folder: 'segura', type: 'xlsx', size: 14000, at: '2026-10-07T00:12', req: 'cap7',
    sheets: [
      { name: 'Saídas do chip', rows: [
        ['Data', 'Entrou (taxa)', 'Família', 'Saiu no dia seguinte', 'Para', 'Descrição do Pix'],
        ['20/07', 'R$ 18.000,00', 'José Raimundo Moura', 'R$ 7.200,00', 'ASSOC BENEF N SRA DA COLHEITA', 'dizimo'],
        ['23/07', 'R$ 12.500,00', 'Francisca das Chagas Lima', 'R$ 5.000,00', 'ASSOC BENEF N SRA DA COLHEITA', 'dizimo'],
        ['03/08', 'R$ 25.000,00', 'Manoel Ferreira Neto', 'R$ 10.000,00', 'ASSOC BENEF N SRA DA COLHEITA', 'dizimo'],
        ['15/08', 'R$ 30.000,00', 'Antônio Fontenele (meu pai)', 'R$ 12.000,00', 'ASSOC BENEF N SRA DA COLHEITA', 'dizimo safra grande'],
        ['26/08', 'R$ 20.000,00', 'Sebastião e Lúcia Araújo', 'R$ 8.000,00', 'ASSOC BENEF N SRA DA COLHEITA', 'dizimo'],
        ['Total', 'R$ 105.500,00', '5 famílias conferidas', 'R$ 42.200,00', '40% de cada taxa', ''],
      ] },
      { name: 'Quem é', rows: [
        ['Campo', 'O que achei'],
        ['Nome', 'Associação Beneficente Nossa Senhora da Colheita'],
        ['CNPJ', '12.417.300/0001-17 · aberta em 1987 · Guaraciaba do Norte'],
        ['Presidente', 'Ademar Sampaio Andrade (pai da Duda)'],
        ['Endereço', 'Sítio Flor da Serra, s/n — o mesmo do evento'],
        ['Caridade registrada', 'nenhuma que eu tenha achado'],
        ['Obs.', 'A Duda não ficava com tudo. 40% ia para o pai, toda vez, no dia seguinte. "Dízimo".'],
        ['Obs. 2', 'A firma M E S ANDRADE ME tem como endereço a sede da Associação, no Sítio Flor da Serra.'],
      ] },
    ],
  },

  pdf('estatuto-1941', 'Estatuto_Irmandade_1941_cartorio_Ipu.pdf', 'Downloads', '2026-09-24T15:02', 3310000, [
    [
      { type: 'p', text: 'Cartório do 1º Ofício de Ipu · Livro A-3 · fls. 112 a 114 · cópia reprográfica, original em mau estado.' },
      { type: 'h1', text: 'Estatuto da Irmandade da Colheita da Serra Grande' },
      { type: 'p', text: 'Aos onze dias do mês de outubro de mil novecentos e quarenta e um, no Sítio Flor da Serra, reunidos os chefes das famílias abaixo assinados, sob a provedoria do Coronel Firmino Sampaio, fica fundada esta Irmandade, em ação de graças pela água que voltou à serra depois da grande seca.' },
      { type: 'h2', text: 'Capítulo I — Dos fins' },
      { type: 'li', text: 'Art. 1º Zelar pela fartura das famílias da serra e pela memória dos que a seca levou.' },
      { type: 'li', text: 'Art. 2º Manter a festa da colheita no segundo sábado de outubro, na casa do provedor.' },
      { type: 'li', text: 'Art. 3º De dezessete em dezessete safras faz-se a ==Colheita Grande==, na Pedra, na noite da festa, com as lanternas em roda. Dezessete foram as covas abertas na seca.' },
      { type: 'h2', text: 'Capítulo II — Dos irmãos' },
      { type: 'li', text: 'Art. 4º O cargo de provedor passa de pai a filho na família Sampaio.' },
      { type: 'li', text: 'Art. 5º Cada irmão contribui com o dízimo de suas colheitas para a caixa da Irmandade.' },
      { type: 'li', text: 'Art. 6º O que se faz na Pedra não se escreve.' },
      { type: 'sign', text: 'Firmino Sampaio', role: 'Provedor' },
    ],
    [
      { type: 'h2', text: 'Averbação de 1987' },
      { type: 'p', text: 'A Irmandade passa a ter, para fins civis, a denominação de ==Associação Beneficente Nossa Senhora da Colheita==, mantidos os fins e a provedoria. Presidente: Ademar Sampaio Andrade.' },
      { type: 'h2', text: 'Averbação de 2023' },
      { type: 'p', text: 'Aprovado pela assembleia o fundo semente de R$ 1.200.000,00 em favor do irmão afilhado ==Caio Montenegro==, para a constituição de empresa de investimentos que levará o nome da Irmandade, com retorno à caixa na forma combinada.' },
      { type: 'p', text: 'Anotação de Iara, no pé da cópia: "Colheita Capital" é a Irmandade de terno.' },
    ],
  ], { req: 'cap7' }),

  pdf('infrassom-ibiapaba', 'Infrassom_eolico_lajedos_Ibiapaba_UFC_2014.pdf', 'Downloads', '2026-09-26T01:20', 1880000, [
    [
      { type: 'h1', text: 'Infrassom de origem eólica em lajedos graníticos da Ibiapaba' },
      { type: 'p', text: 'Departamento de Geologia, Universidade Federal do Ceará. Relatório técnico, 2014.' },
      { type: 'h2', text: 'Resumo' },
      { type: 'p', text: 'Medimos emissões de baixa frequência em seis afloramentos da Serra da Ibiapaba. No ponto P4 (Pedra Lisa, Guaraciaba do Norte), uma fenda vertical na face leste funciona como um tubo ressonante: com ==vento de sudeste== acima de 35 km/h, registrou-se um tom contínuo próximo de ==17 Hz==, abaixo do limiar da audição humana.' },
      { type: 'h2', text: 'Efeitos relatados por voluntários expostos' },
      { type: 'li', text: 'Ansiedade e medo sem causa aparente.' },
      { type: 'li', text: 'Aperto no peito e aceleração cardíaca.' },
      { type: 'li', text: 'Visão periférica "tremida"; percepção de vultos.' },
      { type: 'li', text: 'Sensação de presença: "como se alguém estivesse atrás de mim".' },
      { type: 'h2', text: 'Ocorrência' },
      { type: 'p', text: 'O regime de vento de sudeste é mais forte entre setembro e novembro, à noite. Os maiores registros foram feitos em outubro, entre 23h e 1h.' },
      { type: 'p', text: 'Nota de Iara na primeira página: "não é a pedra chamando. é física. então por que eu ainda tenho medo?"' },
    ],
  ], { req: 'cap7' }),
];

export default { files };
