// SMS do aparelho de Iara (espelho até sáb 10/10 23:47). Nada depois disso: SMS é do aparelho.
// Rafa reaproveitou o chip novo (5588992014456) nas duas mensagens de 10/10; o chip de agosto/setembro é outro (5588991870056).
// Mensagens de serviço usam códigos curtos (sem DDD) e "name" para o app mostrar o ícone da empresa.

export default {
  threads: [
    /* ---------- Rafa, o ex (falso culpado) ---------- */
    {
      id: 'rafa-2', phone: '5588992014456',
      messages: [
        { id: 'rafa2-1', from: 'them', at: '2026-10-10T20:40', text: 'linda essa blusa verde' },
        { id: 'rafa2-2', from: 'iara', at: '2026-10-10T20:52', text: 'quem é?', status: 'read' },
        { id: 'rafa2-3', from: 'them', at: '2026-10-10T22:31', text: 'tu ainda vai se arrepender' },
      ],
    },
    {
      id: 'rafa-1', phone: '5588991870056',
      messages: [
        { id: 'rafa1-1', from: 'them', at: '2026-08-19T22:14', text: 'oi iara. sou eu. troquei de chip. não precisa ter medo, só queria saber se tu recebeu minha mensagem' },
        { id: 'rafa1-2', from: 'them', at: '2026-08-19T22:41', text: 'tá lendo e não responde. tudo bem. eu espero' },
        { id: 'rafa1-3', from: 'them', at: '2026-09-21T22:14', text: 'vi no Lume que tu tava em Guaraciaba ontem. com saudade da serra?' },
        { id: 'rafa1-4', from: 'iara', at: '2026-09-21T22:40', text: 'Rafa, para. vou bloquear esse também', status: 'read' },
        { id: 'rafa1-5', from: 'them', at: '2026-10-07T21:55', text: 'tu bloqueou né. sem problema. eu sei onde tu tá' },
      ],
    },

    /* ---------- operadora ---------- */
    {
      id: 'litoral-movel', phone: '1058', name: 'Litoral Móvel',
      messages: [
        { id: 'lm-1', from: 'them', at: '2026-08-12T08:00', text: 'Litoral Móvel: seu pacote Mais 20 GB renovou. Validade até 11/09. Consulte seu saldo no app ou discando *222#.' },
        { id: 'lm-2', from: 'them', at: '2026-08-28T19:12', text: 'Litoral Móvel: você usou 90% da sua internet. Para não ficar sem, recarregue com bônus: litoralmovel.com.br/recarga' },
        { id: 'lm-3', from: 'them', at: '2026-09-02T13:05', text: 'Litoral Móvel: recarga de R$ 30,00 confirmada. Bônus de 5 GB válido por 7 dias. Obrigado por escolher a Litoral!' },
        { id: 'lm-4', from: 'them', at: '2026-09-11T08:00', text: 'Litoral Móvel: seu pacote Mais 20 GB renovou. Validade até 11/10.' },
        { id: 'lm-5', from: 'them', at: '2026-10-09T16:41', text: 'Litoral Móvel: você está na rede parceira Serra Tel (roaming nacional). Chamadas e internet seguem sem custo extra, mas o sinal pode variar.' },
        { id: 'lm-6', from: 'them', at: '2026-10-10T16:19', text: 'Litoral Móvel: bem-vinda de volta à rede parceira Serra Tel, Guaraciaba do Norte. Seu pacote vence em 11/10. Renove com 10% de desconto: litoralmovel.com.br/renovar' },
        { id: 'lm-7', from: 'them', at: '2026-10-10T21:10', text: 'Litoral Móvel: sua internet está lenta? Em locais de muito movimento a rede pode oscilar. Dúvidas: 1058.' },
      ],
    },

    /* ---------- banco Jandaia ---------- */
    {
      id: 'jandaia', phone: '28400', name: 'Banco Jandaia',
      messages: [
        { id: 'jd-1', from: 'them', at: '2026-08-05T09:03', text: 'Jandaia: Pix recebido de COLHEITA CAPITAL GESTAO LTDA no valor de R$ 3.500,00.' },
        { id: 'jd-2', from: 'them', at: '2026-08-17T11:42', text: 'Jandaia: seu código de verificação é 604218. Vale por 5 minutos. Não compartilhe com ninguém, nem com funcionário do banco.' },
        { id: 'jd-3', from: 'them', at: '2026-09-05T09:01', text: 'Jandaia: Pix recebido de COLHEITA CAPITAL GESTAO LTDA no valor de R$ 3.500,00.' },
        { id: 'jd-4', from: 'them', at: '2026-09-25T10:12', text: 'Jandaia: Pix recebido de COLHEITA CAPITAL GESTAO LTDA no valor de R$ 20.000,00.' },
        { id: 'jd-5', from: 'them', at: '2026-09-25T10:38', text: 'Jandaia: seu código de verificação é 391057. Vale por 5 minutos. Não compartilhe com ninguém, nem com funcionário do banco.' },
        { id: 'jd-6', from: 'them', at: '2026-09-25T10:40', text: 'Jandaia: Pix enviado para COLHEITA CAPITAL GESTAO LTDA no valor de R$ 20.000,00. Se não reconhece essa operação, ligue 4004 2840.' },
        { id: 'jd-7', from: 'them', at: '2026-10-05T09:02', text: 'Jandaia: Pix recebido de COLHEITA CAPITAL GESTAO LTDA no valor de R$ 3.500,00.' },
        { id: 'jd-8', from: 'them', at: '2026-10-09T06:41', text: 'Jandaia: compra aprovada no cartão final 7731, R$ 94,90, SERRA VERDE VIACAO, hoje 06:41.' },
        { id: 'jd-9', from: 'them', at: '2026-10-09T12:07', text: 'Jandaia: compra aprovada no cartão final 7731, R$ 31,50, CAFE MARGARIDA SOBRAL, hoje 12:07.' },
        { id: 'jd-10', from: 'them', at: '2026-10-09T15:12', text: 'Jandaia: compra aprovada no cartão final 7731, R$ 38,00, SERRA VERDE VIACAO VAN, hoje 15:12.' },
      ],
    },

    /* ---------- códigos de apps ---------- */
    {
      id: 'lume-cod', phone: '28822', name: 'Lume',
      messages: [
        { id: 'lu-1', from: 'them', at: '2026-08-04T09:14', text: 'Lume: 774 120 é o seu código de confirmação. Se não foi você, ignore esta mensagem.' },
        { id: 'lu-2', from: 'them', at: '2026-09-22T18:30', text: 'Lume: 508 336 é o seu código de confirmação. Se não foi você, ignore esta mensagem.' },
        { id: 'lu-3', from: 'them', at: '2026-10-05T14:20', text: 'Lume: alguém tentou entrar na sua conta por um aparelho novo. Se foi você, o código é 912 645. Se não foi, troque sua senha.' },
      ],
    },
    {
      id: 'bora-cod', phone: '26702', name: 'Bora',
      messages: [
        { id: 'bo-1', from: 'them', at: '2026-08-21T20:44', text: 'Bora: seu código de verificação é 3047. Não compartilhe com o motorista.' },
        { id: 'bo-2', from: 'them', at: '2026-09-18T23:51', text: 'Bora: sua corrida com Anderson (placa HXR-4D19) chegou ao destino. Avalie sua viagem no app.' },
        { id: 'bo-3', from: 'them', at: '2026-10-09T05:58', text: 'Bora: seu motorista Cleiton chega em 3 min. Código para embarcar: 5518.' },
      ],
    },
    {
      id: 'correio-cod', phone: '27755', name: 'Correio',
      messages: [
        { id: 'co-1', from: 'them', at: '2026-09-18T16:02', text: 'Correio: seu código de verificação em duas etapas é 285 903. Ele expira em 10 minutos.' },
        { id: 'co-2', from: 'them', at: '2026-09-30T22:47', text: 'Correio: seu código de verificação em duas etapas é 640 118. Ele expira em 10 minutos.' },
        { id: 'co-3', from: 'them', at: '2026-10-05T10:15', text: 'Correio: novo acesso à sua conta iara.fontenele@correio.app em Fortaleza, CE. Foi você? Se sim, ignore.' },
      ],
    },

    /* ---------- farmácia, serviços e contatos salvos ---------- */
    {
      id: 'farmacia', phone: '5585986015524', contact: 'farmacia',
      messages: [
        { id: 'fa-1', from: 'them', at: '2026-08-14T17:20', text: 'Farmácia do Benfica: seu pedido #4471 saiu para entrega. Chega em até 40 min. Entregador: Josué.' },
        { id: 'fa-2', from: 'iara', at: '2026-08-14T17:23', text: 'ok, obrigada! portão azul, apt 302', status: 'read' },
        { id: 'fa-3', from: 'them', at: '2026-09-27T10:05', text: 'Farmácia do Benfica: Iara, seu medicamento de uso contínuo está acabando. Responda 1 para repor com 15% de desconto.' },
        { id: 'fa-4', from: 'them', at: '2026-10-06T08:30', text: 'Farmácia do Benfica: lembrete: anotamos alergia a dipirona no seu cadastro. Em caso de dúvida, fale com o farmacêutico.' },
      ],
    },
    {
      id: 'dentista', phone: '5585987720136', contact: 'dentista',
      messages: [
        { id: 'de-1', from: 'them', at: '2026-08-25T09:00', text: 'Clínica Odonto Benfica: Iara, confirmamos sua limpeza quinta 27/08 às 15h30 com o Dr. Hélio. Responda 1 para confirmar.' },
        { id: 'de-2', from: 'iara', at: '2026-08-25T09:12', text: '1', status: 'read' },
        { id: 'de-3', from: 'them', at: '2026-10-07T09:00', text: 'Clínica Odonto Benfica: já faz 6 meses da sua última revisão. Que tal agendar? Responda AGENDAR.' },
      ],
    },
    {
      id: 'academia', phone: '5585985593071', contact: 'academia',
      messages: [
        { id: 'ac-1', from: 'them', at: '2026-09-01T07:30', text: 'Ritmo Fit: sua mensalidade de setembro (R$ 119,90) vence dia 05. Pague pelo app e ganhe 1 semana de bônus.' },
        { id: 'ac-2', from: 'them', at: '2026-09-14T19:00', text: 'Ritmo Fit: sentimos sua falta! Faz 3 semanas que você não treina. Venha hoje, a gente te espera.' },
        { id: 'ac-3', from: 'them', at: '2026-10-01T07:30', text: 'Ritmo Fit: sua mensalidade de outubro (R$ 119,90) vence dia 05.' },
      ],
    },
    {
      id: 'sindico', phone: '5585996630215', contact: 'sindico',
      messages: [
        { id: 'si-1', from: 'them', at: '2026-09-29T18:40', text: 'Boa noite, moradores. Reunião de condomínio quinta, 08/10, 19h30, no salão. Pauta: portão eletrônico e reparo da caixa d\'água. Wellington (síndico).' },
        { id: 'si-2', from: 'iara', at: '2026-09-29T19:02', text: 'Boa noite, Wellington. Vou estar fora, mas a Nanda representa o apt 302.', status: 'read' },
        { id: 'si-3', from: 'them', at: '2026-09-29T19:10', text: 'Anotado, obrigado!' },
      ],
    },

    /* ---------- viagem ---------- */
    {
      id: 'serra-verde', phone: '28131', name: 'Serra Verde Viação',
      messages: [
        { id: 'sv-1', from: 'them', at: '2026-10-08T21:30', text: 'Serra Verde Viação: passagem confirmada. Fortaleza > Sobral, sex 09/10, saída 06h50, poltrona 14, plataforma 6. Apresente este SMS e um documento com foto.' },
        { id: 'sv-2', from: 'them', at: '2026-10-09T05:45', text: 'Serra Verde Viação: sua saída é daqui a 1h. Chegue com 30 min de antecedência na Rodoviária Engenheiro João Thomé.' },
        { id: 'sv-3', from: 'them', at: '2026-10-09T14:50', text: 'Serra Verde Viação: van Sobral > Guaraciaba do Norte sai às 15h30 do terminal. Poltrona 3. Boa viagem!' },
      ],
    },

    /* ---------- propaganda ---------- */
    {
      id: 'moda-aurora', phone: '29044', name: 'Moda Aurora',
      messages: [
        { id: 'ma-1', from: 'them', at: '2026-08-29T10:00', text: 'Moda Aurora: liquidação de meia estação. Até 60% OFF só hoje. aurora.com.br/promo. Para sair, responda SAIR.' },
        { id: 'ma-2', from: 'them', at: '2026-09-26T11:30', text: 'Moda Aurora: vestidos verdes a partir de R$ 79,90. Frete grátis acima de R$ 199. aurora.com.br/verde. Para sair, responda SAIR.' },
        { id: 'ma-3', from: 'them', at: '2026-10-07T12:15', text: 'Moda Aurora: Dia das Crianças chegando, mas a promoção é pra você: 20% off em tudo. aurora.com.br/dia. Para sair, responda SAIR.' },
      ],
    },
    {
      id: 'mercado-ne', phone: '29361', name: 'Mercado Nordeste',
      messages: [
        { id: 'mn-1', from: 'them', at: '2026-09-04T18:05', text: 'Mercado Nordeste: sexta de ofertas! Arroz 5kg a R$ 21,90 e café a R$ 13,90. Cartão fidelidade em dobro. Cancelar: SAIR.' },
        { id: 'mn-2', from: 'them', at: '2026-10-02T18:05', text: 'Mercado Nordeste: sexta de ofertas! Frango inteiro a R$ 9,99/kg e leite 12 un. por R$ 54. Cancelar: SAIR.' },
      ],
    },
    {
      id: 'numero-0800', phone: '4004', name: 'Cobrança Central',
      messages: [
        { id: 'nc-1', from: 'them', at: '2026-09-09T14:22', text: 'PARABENS! Voce foi selecionado para um emprestimo pre-aprovado de ate R$ 15.000. Acesse tinyurl.com/emp-ja e confirme seu CPF. Oferta valida por 24h.' },
        { id: 'nc-2', from: 'them', at: '2026-10-01T09:48', text: 'Aviso: seu CPF possui pendencia. Regularize hoje em cobranca-central.net/regularize e evite restricao. Ignore se ja pagou.' },
      ],
    },
  ],
};
