// SMS extra do aparelho de Iara (espelho até sáb 10/10 23:47). Somado a data/caso01/sms.js.
// Só ruído do dia a dia. Nada depois de 23:47 do dia 10: SMS é do aparelho.

export default {
  threads: [
    /* ---------- cartão Nubank (outro código curto, só cartão) ---------- */
    {
      id: 'x-jandaia-cartao', phone: '28410', name: 'Nubank Cartões',
      messages: [
        { id: 'xjc-1', from: 'them', at: '2026-05-14T19:22', text: 'Nubank: compra aprovada no cartão final 7731, R$ 62,40, PAGUE BEM BENFICA, hoje 19:22.' },
        { id: 'xjc-2', from: 'them', at: '2026-06-22T14:01', text: 'Nubank: compra aprovada no cartão final 7731, 3x de R$ 137,60, LOJA FOCO, hoje 14:01.' },
        { id: 'xjc-3', from: 'them', at: '2026-07-28T08:02', text: 'Nubank: a fatura do seu cartão final 7731 fechou em R$ 1.012,48. Vencimento 05/08.' },
        { id: 'xjc-4', from: 'them', at: '2026-08-19T13:01', text: 'Nubank: seu novo limite de R$ 4.500 já está disponível no cartão final 7731.' },
        { id: 'xjc-5', from: 'them', at: '2026-09-12T20:47', text: 'Nubank: compra aprovada no cartão final 7731, R$ 54,90, IFOME*PIZZARIA DO BENFICA, hoje 20:47.' },
        { id: 'xjc-6', from: 'them', at: '2026-10-03T11:15', text: 'Nubank: compra aprovada no cartão final 7731, R$ 189,00, LIVRARIA DO CENTRO, hoje 11:15.' },
      ],
    },

    /* ---------- ofertas da operadora (código diferente do 1058) ---------- */
    {
      id: 'x-litoral-ofertas', phone: '30580', name: 'Litoral Ofertas',
      messages: [
        { id: 'xlo-1', from: 'them', at: '2026-06-01T10:00', text: 'Litoral: troque seu pré por um plano controle de 30 GB por R$ 49,90/mês nos 3 primeiros meses. Responda QUERO.' },
        { id: 'xlo-2', from: 'them', at: '2026-07-15T10:00', text: 'Litoral: assista ao Netflix sem gastar internet no plano Mais Vídeo. Saiba mais em claro.com.br/video. Para sair, responda SAIR.' },
        { id: 'xlo-3', from: 'them', at: '2026-09-18T10:00', text: 'Litoral: aniversário Litoral! Ganhe 2 GB de bônus ao recarregar R$ 20 até domingo.' },
      ],
    },

    /* ---------- códigos ---------- */
    {
      id: 'x-nimbus-conta', phone: '27310', name: 'Google',
      messages: [
        { id: 'xnb-1', from: 'them', at: '2026-05-03T09:41', text: 'Google: seu código de verificação é 118 402. Use para concluir a configuração do seu moto g85.' },
        { id: 'xnb-2', from: 'them', at: '2026-08-09T16:20', text: 'Motorola: a atualização de sistema 14.2 está disponível para o seu moto g85. Conecte-se ao Wi-Fi para baixar.' },
      ],
    },
    {
      id: 'x-streamflix-cod', phone: '25009', name: 'Netflix',
      messages: [
        { id: 'xsf-1', from: 'them', at: '2026-07-30T22:04', text: 'Netflix: seu código é 7381. Não compartilhe.' },
      ],
    },
    {
      id: 'x-foco-cod', phone: '24771', name: 'Loja Foco',
      messages: [
        { id: 'xfc-1', from: 'them', at: '2026-06-24T09:31', text: 'Loja Foco: seu pedido #88213 saiu para entrega. Rastreio: FC204478193BR.' },
        { id: 'xfc-2', from: 'them', at: '2026-10-06T12:14', text: 'Loja Foco: 482917 é o seu código de acesso. Vale por 10 minutos.' },
      ],
    },

    /* ---------- entregas ---------- */
    {
      id: 'x-entrega-rapida', phone: '5585981127764',
      messages: [
        { id: 'xer-1', from: 'them', at: '2026-08-11T14:05', text: 'Olá, aqui é o Cícero da Rapidão Entregas. Tenho uma encomenda da Moda Aurora pra Iara Fontenele. Tem alguém em casa até 16h?' },
        { id: 'xer-2', from: 'iara', at: '2026-08-11T14:09', text: 'oi! tem sim, a Nanda tá em casa. pode deixar com ela', status: 'read' },
        { id: 'xer-3', from: 'them', at: '2026-08-11T15:32', text: 'Entregue. Obrigado!' },
      ],
    },
    {
      id: 'x-mercado-entrega', phone: '29362', name: 'Pague Bem',
      messages: [
        { id: 'xpb-1', from: 'them', at: '2026-09-12T10:40', text: 'Pague Bem: seu pedido #55102 está pronto para retirada na loja Benfica até 22h. Apresente o código 7718.' },
        { id: 'xpb-2', from: 'them', at: '2026-10-08T19:50', text: 'Pague Bem: seu pedido #57391 foi separado. Entrega hoje entre 20h e 21h.' },
      ],
    },

    /* ---------- saúde ---------- */
    {
      id: 'x-drogaria', phone: '5585985120933', name: 'Drogaria Vida',
      messages: [
        { id: 'xdv-1', from: 'them', at: '2026-06-30T11:12', text: 'Drogaria Vida: Iara, seu cadastro no Programa Vida+ foi ativado. Você ganhou 10% de desconto na próxima compra.' },
        { id: 'xdv-2', from: 'them', at: '2026-09-04T18:02', text: 'Drogaria Vida: seu pedido de protetor solar FPS 50 e soro fisiológico está pronto para retirada.' },
      ],
    },
    {
      id: 'x-dermato', phone: '5585987004418', name: 'Clínica Pele Viva',
      messages: [
        { id: 'xdm-1', from: 'them', at: '2026-07-06T09:00', text: 'Clínica Pele Viva: Iara, sua consulta com a Dra. Luíza Teles está confirmada para quarta, 08/07, às 10h20. Chegue 15 min antes. Responda C para confirmar.' },
        { id: 'xdm-2', from: 'iara', at: '2026-07-06T09:31', text: 'C', status: 'read' },
        { id: 'xdm-3', from: 'them', at: '2026-07-06T09:31', text: 'Consulta confirmada. Até quarta!' },
        { id: 'xdm-4', from: 'them', at: '2026-09-28T09:00', text: 'Clínica Pele Viva: está na hora do seu retorno. Agende pelo número (85) 98700-4418.' },
      ],
    },
    {
      id: 'x-sorriso', phone: '5585986331207', name: 'Clínica Sorriso Benfica',
      messages: [
        { id: 'xso-1', from: 'them', at: '2026-10-06T15:40', text: 'Clínica Sorriso Benfica: recebemos o sinal de R$ 80,00. Sua avaliação está marcada para quinta, 15/10, às 14h30. Traga o encaminhamento.' },
        { id: 'xso-2', from: 'them', at: '2026-10-10T09:00', text: 'Clínica Sorriso Benfica: lembrete da sua consulta quinta, 15/10, às 14h30. Para remarcar, responda REMARCAR.' },
      ],
    },

    /* ---------- golpe e propaganda ---------- */
    {
      id: 'x-golpe-cpf', phone: '5511937406621',
      messages: [
        { id: 'xgc-1', from: 'them', at: '2026-08-26T08:12', text: 'RECEITA: Seu CPF esta IRREGULAR e sera suspenso em 24h. Evite bloqueio de contas e Pix. Regularize: regulariza-cpf.online' },
        { id: 'xgc-2', from: 'them', at: '2026-08-26T08:13', text: 'ULTIMO AVISO. Protocolo 88.231/2026.' },
      ],
    },
    {
      id: 'x-golpe-premio', phone: '5521964119087',
      messages: [
        { id: 'xgp-1', from: 'them', at: '2026-09-23T13:48', text: 'Oi! Aqui é a Bia do RH. Vi seu perfil e temos vaga home office de avaliar produtos, R$ 300 a R$ 800 por dia. Posso te passar os detalhes?' },
      ],
    },
    {
      id: 'x-pizzaria', phone: '29871', name: 'Pizzaria do Benfica',
      messages: [
        { id: 'xpz-1', from: 'them', at: '2026-09-17T18:00', text: 'Pizzaria do Benfica: quinta é dia de pizza grande pelo preço da média. Peça pelo app. Para sair, responda SAIR.' },
        { id: 'xpz-2', from: 'them', at: '2026-10-08T18:00', text: 'Pizzaria do Benfica: sentimos sua falta! Use o cupom VOLTA15 até domingo. Para sair, responda SAIR.' },
      ],
    },

    /* ---------- academia e lavanderia ---------- */
    {
      id: 'x-lavanderia', phone: '5585984670331', contact: 'lavanderia',
      messages: [
        { id: 'xlv-1', from: 'them', at: '2026-07-21T16:30', text: 'Lavanderia Bolha: sua roupa está pronta! 2 cestos + 1 edredom. Total R$ 68,00. Retirada até 20h.' },
        { id: 'xlv-2', from: 'iara', at: '2026-07-21T16:44', text: 'obrigada! passo amanhã cedo', status: 'read' },
        { id: 'xlv-3', from: 'them', at: '2026-09-24T17:05', text: 'Lavanderia Bolha: sua roupa está pronta! 1 cesto. Total R$ 32,00.' },
      ],
    },
    {
      id: 'x-vet', phone: '5588993927760', contact: 'vet',
      messages: [
        { id: 'xvt-1', from: 'them', at: '2026-06-15T10:00', text: 'Clínica Vet Serra: lembrete de vacina antirrábica do Bento. Agende a dose anual até o fim do mês. Dr. Tobias.' },
        { id: 'xvt-2', from: 'iara', at: '2026-06-15T10:30', text: 'obrigada, dr. Tobias! minha mãe leva ele essa semana', status: 'read' },
      ],
    },
  ],
};
