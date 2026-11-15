// Correio — e-mail de Iara (nuvem: chega até ter 13/10 23:12).
// Pastas: inbox | sent | promo | spam | trash. Anexos apontam para ids de arquivos.js.

const IARA = { name: 'Iara Fontenele', email: 'iara.fontenele@correio.app' };
const BRUNA = { name: 'Bruna Leal', email: 'bruna.leal@ofarol.com.br' };
const CAIO = { name: 'Caio Montenegro', email: 'caio@colheitacapital.com.br' };
const MARCOS = { name: 'Marcos Vieira', email: 'marcos@colheitacapital.com.br' };
const LARI = { name: 'Larissa Prado', email: 'lari@producoesprado.com.br' };

const SIG_BRUNA = 'Bruna Leal · Repórter, O Farol · (85) 98812-4471';

// inbox
const inb = (id, at, from, subject, body, x = {}) => ({ id, folder: 'inbox', from, to: [IARA], at, subject, body, read: true, ...x });
// enviados
const snd = (id, at, to, subject, body, x = {}) => ({ id, folder: 'sent', from: IARA, to: [].concat(to), at, subject, body, read: true, ...x });
// promoções / spam
const pro = (id, at, from, subject, body, x = {}) => ({ id, folder: 'promo', from, to: [IARA], at, subject, body, read: true, ...x });
const spm = (id, at, from, subject, body, x = {}) => ({ id, folder: 'spam', from, to: [IARA], at, subject, body, read: false, ...x });

const emails = [
  /* ---------------- Bruna Leal / O Farol ---------------- */
  snd('bruna-1809', '2026-09-18T21:14', BRUNA, 'Preciso falar com uma jornalista sobre a Colheita Capital',
`Olá, Bruna.

Meu nome é Iara Fontenele, sou fotógrafa e videomaker. Encontrei seu e-mail na página do O Farol, na sua reportagem sobre os falsos consórcios de Sobral. Escrevo porque não sei a quem mais recorrer.

Desde maio eu trabalho como freelancer para a Colheita Capital, uma empresa de investimentos que promete 4% ao mês "lastreado em contratos de safra". Meu trabalho é fotografar e filmar os eventos e as "visitas às fazendas parceiras". Editando esse material percebi coisas que não fecham: as fazendas aparecem diferentes em cada visita, uma delas eu reconheci como o sítio de um conhecido, e as imagens de colheita são, em parte, de banco de imagens. Pelo que pesquisei, o que a empresa faz parece uma pirâmide: os rendimentos de quem entrou antes são pagos com o dinheiro de quem entra depois.

Eu moro em Fortaleza, mas minha família é de Guaraciaba do Norte e muita gente da serra já colocou dinheiro lá. Tenho medo do que vai acontecer com essas pessoas quando a conta não fechar mais.

Você teria um tempo para conversar? Prefiro e-mail por enquanto. Ainda estou trabalhando para eles e não quero me expor antes da hora.

Obrigada,

Iara Fontenele · fotógrafa · @iarafontenele.foto`),

  inb('bruna-1909', '2026-09-19T09:22', BRUNA, 'Re: Preciso falar com uma jornalista sobre a Colheita Capital',
`Oi, Iara.

Recebi seu e-mail e li duas vezes. Obrigada por escrever e por ter escolhido o O Farol.

O que você descreve é parecido com casos que a gente acompanha há tempos. Mas, antes de qualquer coisa: não diga a ninguém da empresa que falou comigo e não use o e-mail ou o celular de trabalho para tratar disso.

Vou ler seu relato com calma e te escrevo no começo da semana dizendo o que eu preciso para seguir. Até lá, continue trabalhando normalmente, sem mudar a rotina.

> Iara Fontenele escreveu:
> Prefiro e-mail por enquanto. Ainda estou trabalhando para eles e não quero me expor antes da hora.

Um abraço,

${SIG_BRUNA}`),

  inb('bruna-2209', '2026-09-22T18:40', BRUNA, 'O que eu preciso para publicar',
`Iara, boa tarde.

Conversei com meu editor. A história é forte, mas um jornal só publica o que consegue provar, e a Colheita Capital tem advogados. Preciso de provas, não de impressões.

O que ajuda:

1. Contratos e termos que a empresa entrega aos investidores (o contrato padrão, principalmente).
2. Relatórios e materiais de divulgação, com os números que eles prometem.
3. Comprovantes de pagamento: de quem entrou, de quem recebeu e de quem foi pago com o dinheiro de outros.
4. Qualquer prova de que as "fazendas" não existem ou não são da empresa.
5. Nomes: quem manda, quem recruta, quem lida com o dinheiro.
6. Se alguém te oferecer dinheiro, favor ou ameaça para você ficar calada, guarde o registro.

Guarde tudo num lugar seguro e não encaminhe nada por e-mail nem pelo Papo. Quando você tiver o material, a gente marca para se ver pessoalmente, aqui em Fortaleza.

Me avise se algo mudar.

${SIG_BRUNA}`),

  snd('bruna-3009', '2026-09-30T23:05', BRUNA, 'Re: O que eu preciso para publicar',
`Bruna, oi.

Montei uma pasta organizada, protegida por senha, só no meu celular. Tem o contrato padrão, o relatório de "safras" que eles mandam aos investidores, uma planilha em que eu conferi cada fazenda uma por uma e o comprovante de que recusei um dinheiro que a empresa me mandou. Não vou te mandar nada por aqui, como você pediu. Prefiro entregar tudo em mãos.

Ainda falta fechar um ponto, mais grave, que envolve gente da minha própria família. Te conto pessoalmente.

Posso ir te ver na próxima semana?

Iara`),

  snd('bruna-0410', '2026-10-04T20:31', BRUNA, 'Reunião na segunda, dia 12?',
`Oi, Bruna.

Terminei de organizar o material. Consigo ir ao jornal na segunda-feira, dia 12, de manhã. Neste fim de semana vou para a serra e volto no domingo à noite, então a segunda é o melhor dia pra mim.

Se puder às 10h, melhor ainda.

Obrigada!

Iara`),

  inb('bruna-0510', '2026-10-05T09:10', BRUNA, 'Confirmado: segunda, 12/10, 10h, no O Farol',
`Iara, bom dia.

Está marcado: segunda-feira, 12 de outubro, às 10h, na redação do O Farol (Avenida Santos Dumont, 4º andar). Avise na recepção que você vai falar com a Bruna. Eu desço para te buscar.

Leve tudo o que você conseguiu juntar, o celular com a pasta e um documento com foto. Vou reservar a manhã inteira e meu editor pode passar para ouvir.

Se algo mudar, me avise por e-mail.

${SIG_BRUNA}`),

  inb('bruna-1010', '2026-10-10T14:02', BRUNA, 'Re: Reunião na segunda, dia 12?',
`Iara, oi.

Confirmado para segunda, 10h, como combinamos. Está tudo reservado do meu lado.

Se der algum imprevisto na estrada ou no fim de semana, ou se você precisar falar comigo rápido, me chama no zap: (85) 98812-4471. Esse é o meu número de trabalho, pode salvar. Pelo e-mail eu respondo mais devagar nos fins de semana.

Boa viagem pra serra. Até segunda.

${SIG_BRUNA}`),

  snd('bruna-1010r', '2026-10-10T14:20', BRUNA, 'Re: Re: Reunião na segunda, dia 12?',
`Perfeito, Bruna. Salvo seu número. Segunda às 10h estou aí com tudo.

Qualquer coisa te chamo.

Iara`),

  inb('bruna-1210', '2026-10-12T10:40', BRUNA, 'Estou te esperando',
`Iara, estou te esperando desde as 10h. Tudo bem? Aconteceu alguma coisa?

Se você só se atrasou, sem problema, eu estou na redação a manhã toda. Me responda, por favor, ou me liga: (85) 98812-4471.

${SIG_BRUNA}`, { read: false, important: true }),

  inb('bruna-1210-tarde', '2026-10-12T15:10', BRUNA, 'Sinto muito',
`Iara,

acabei de ver a notícia. Não sei como escrever isto. Sinto muito, de verdade.

Não sei quem vai ler esta mensagem. Se for alguém da família, ou alguém que tenha acesso a esta conta, por favor me procure no (85) 98812-4471 ou neste e-mail. A Iara tinha uma informação importante para me entregar hoje e eu gostaria de saber se ela deixou o material guardado em algum lugar.

Não passe nada para ninguém da Colheita Capital.

${SIG_BRUNA}`, { read: false, important: true }),

  /* ---------------- Segurança da conta ---------------- */
  {
    id: 'seguranca-login', folder: 'inbox', live: true, important: true, read: false,
    from: { name: 'Segurança do Correio', email: 'seguranca@correio.app' }, to: [IARA], at: '2026-10-13T22:58',
    subject: 'Nova tentativa de acesso à sua conta',
    body: `Olá, Iara.

Detectamos uma nova tentativa de acesso à sua conta iara.fontenele@correio.app.

Local: Guaraciaba do Norte, CE, Brasil
Dispositivo: Android
Horário: ter., 13 de out. de 2026, 22:57

Se foi você, nenhuma ação é necessária. Se não foi você, altere sua senha agora e revise os dispositivos conectados. A tentativa foi bloqueada porque pedia uma verificação em duas etapas.

Nunca compartilhe códigos de verificação com ninguém.

Equipe de Segurança · Correio`,
  },

  /* ---------------- Colheita Capital ---------------- */
  inb('colheita-contrato', '2026-05-04T11:30', MARCOS, 'Contrato de prestação de serviços (freela) e termo de confidencialidade',
`Oi, Iara. Tudo bem?

Seguem, em anexo, o contrato de prestação de serviços (freelancer, R$ 3.500 mensais, pagos todo dia 5) e o termo de confidencialidade. Pode assinar digitalmente e devolver.

É uma formalidade do jurídico, todo mundo que trabalha com a gente assina. Bem-vinda ao time, estamos muito animados com o seu olhar para a marca.

Marcos Vieira · Marketing, Colheita Capital`, { attachments: [{ name: 'Contrato_Prestacao_Servicos_Iara.pdf', file: 'contrato-freela' }, { name: 'Termo_de_Confidencialidade.pdf', file: 'termo-confidencialidade' }] }),

  inb('colheita-fazendas-q3', '2026-07-01T09:15', MARCOS, 'Visitas às fazendas parceiras: agenda do trimestre',
`Iara, bom dia!

Segue a agenda das visitas do trimestre. A ideia é a mesma de sempre: filmar a "jornada do campo", com planos abertos da lavoura, o Caio caminhando com o produtor e o drone no final.

Fazenda Santa Luzia (Irauçuba): 14/07
Fazenda Boa Esperança (Itapipoca): 28/07
Fazenda Vale Verde (Quixadá): 11/08
Fazenda Novo Horizonte (Canindé): 25/08

Leve o cartão formatado e o drone carregado. O Caio quer cortes curtos para o Lume, vertical. Pode ser?

Marcos Vieira · Marketing, Colheita Capital`),

  inb('colheita-convite', '2026-09-22T10:05', MARCOS, 'Convite: Noite da Colheita, sáb 10/10, Sítio Flor da Serra',
`Iara,

o convite oficial da Noite da Colheita já está pronto, em anexo. O evento será no sábado, 10 de outubro, no Sítio Flor da Serra, em Guaraciaba do Norte. Portões abertos às 19h, jantar às 20h, show da banda às 21h e o discurso do Caio ao vivo no Lume, perto da meia-noite.

Você vai cobrir o evento inteiro (foto e vídeo). A produção está com a Lari. Fique à vontade para chegar mais cedo e fotografar a propriedade.

Marcos Vieira · Marketing, Colheita Capital`, { attachments: [{ name: 'Convite_Noite_da_Colheita.pdf', file: 'convite-evento' }] }),

  inb('colheita-credencial', '2026-10-07T16:48', MARCOS, 'Credencial e orientações para sábado',
`Iara, orientações para sábado:

1. Credencial de imprensa/equipe é pessoal. Use no pescoço o tempo todo.
2. A cobertura é da Colheita Capital: nada de postar material antes da liberação do Marcos.
3. Os convidados são investidores e família. Evite fotografar quem pedir para não aparecer.
4. Sem álcool para a equipe até o fim do discurso do Caio.

Até lá!

Marcos Vieira · Marketing, Colheita Capital`),

  inb('lari-roteiro', '2026-10-08T12:20', LARI, 'Roteiro v4: Noite da Colheita (confere por favor)',
`Oi, Iara!

Segue o roteiro final da noite, versão 4. Dá uma olhada nos horários da sua cobertura e me avisa se alguma coisa não bate com o seu planejamento de equipamento. A banda toca até 23:25, o Caio sobe logo em seguida e o discurso é ao vivo no Lume. Fogos à meia-noite.

Qualquer mudança eu te aviso no Papo.

Larissa Prado · Produtora, Produções Prado`, { attachments: [{ name: 'Roteiro_Noite_da_Colheita_v4.pdf', file: 'roteiro' }], starred: true }),

  inb('caio-2509', '2026-09-25T09:40', CAIO, 'Reconhecimento',
`Iara,

o trabalho que você vem fazendo para a Colheita está acima do combinado. Em reconhecimento, vamos creditar hoje um bônus de performance na sua conta. Sem burocracia, é um agradecimento.

Conto com você nos próximos eventos.

Caio Montenegro · CEO, Colheita Capital`),

  snd('caio-2509r', '2026-09-25T10:46', CAIO, 'Re: Reconhecimento',
`Caio, recebi o valor e devolvi agora há pouco, no mesmo Pix. Agradeço o gesto, mas não posso aceitar um bônus fora do contrato.

Continuo à disposição para o trabalho combinado.

Iara`),

  inb('caio-0810', '2026-10-08T17:12', CAIO, 'Lembrete: termo de confidencialidade',
`Iara,

reenvio o termo de confidencialidade que você assinou em maio, para a sua consulta. Peço que releia a cláusula 4. Como o evento de sábado terá muitos investidores, é importante que todo material interno e toda conversa de bastidor permaneçam dentro da empresa.

Qualquer dúvida, falo com você pessoalmente no sábado.

Caio Montenegro · CEO, Colheita Capital`, { attachments: [{ name: 'Termo_de_Confidencialidade.pdf', file: 'termo-confidencialidade' }], important: true }),

  inb('colheita-news-0109', '2026-09-01T07:00', { name: 'Colheita Capital', email: 'newsletter@colheitacapital.com.br' }, 'Colheita em Números: rendimento de agosto, 4% ao mês',
`Investidor Colheita,

agosto fechou em 4% ao mês, como previsto. O rendimento foi lastreado em contratos de safra de milho, feijão e castanha em mais de 3.800 hectares de fazendas parceiras no Ceará.

Veja o relatório completo no portal do investidor. Indique um amigo e ganhe um bônus de boas-vindas.

Colheita Capital · Plantando hoje, colhendo sempre`),

  inb('colheita-news-0210', '2026-10-02T07:00', { name: 'Colheita Capital', email: 'newsletter@colheitacapital.com.br' }, 'Colheita em Números: rendimento de setembro, 4% ao mês',
`Investidor Colheita,

rendimento de setembro: 4% ao mês. O terceiro trimestre fechou acima da meta, com expansão de 620 hectares em novas fazendas parceiras.

No dia 10 de outubro, a Noite da Colheita reunirá investidores e a equipe no Sítio Flor da Serra. Confirme sua presença.

Em anexo, o relatório de safras de setembro.

Colheita Capital · Plantando hoje, colhendo sempre`, { attachments: [{ name: 'Relatorio_Safras_Setembro.pdf', file: 'relatorio-safras' }], read: false }),

  inb('colheita-evento-lembrete', '2026-10-09T08:00', { name: 'Colheita Capital', email: 'eventos@colheitacapital.com.br' }, 'Amanhã: Noite da Colheita',
`Falta pouco. Amanhã, às 19h, abrimos os portões do Sítio Flor da Serra. Traga seu convite no celular. Estacionamento gratuito no local; transporte por van a partir de Guaraciaba do Norte, a combinar com a produção.

Colheita Capital`, { read: false }),

  /* ---------------- Passagens e viagem ---------------- */
  inb('passagem-0910', '2026-10-06T21:03', { name: 'Expresso Norte', email: 'vendas@expressonorte.com.br' }, 'Sua passagem: Fortaleza → Sobral, sex 09/10, 07:30',
`Compra confirmada!

Passageiro: Iara Fontenele
Trecho: Fortaleza (Rodoviária Engenheiro João Thomé) → Sobral
Saída: sexta-feira, 09/10/2026, 07:30
Chegada prevista: 11:20
Poltrona: 14 (janela)
Valor: R$ 89,90

Apresente o QR code no embarque. O passe de embarque está em anexo. Chegue com 30 minutos de antecedência.

Expresso Norte · Viaje tranquilo`, { attachments: [{ name: 'Passagem_Fortaleza_Sobral_0910.pdf', file: 'passagem-onibus' }] }),

  inb('van-reserva', '2026-10-07T10:30', { name: 'Cooperativa Van Serrana', email: 'reservas@vanserrana.com.br' }, 'Reserva confirmada: Sobral → Guaraciaba do Norte, 09/10, 15:30',
`Olá, Iara!

Sua reserva foi confirmada.

Trecho: Sobral (Terminal Rodoviário) → Guaraciaba do Norte
Data: sexta, 09/10/2026, 15:30
Chegada prevista: 17:10
Valor: R$ 35,00, pago por Pix

Em caso de atraso, fale com o motorista pelo número do voucher em anexo. Boa viagem!

Cooperativa Van Serrana`, { attachments: [{ name: 'Reserva_Van_0910.pdf', file: 'reserva-van' }] }),

  /* ---------------- Clientes e trabalho de fotógrafa ---------------- */
  inb('cliente-renata', '2026-08-20T14:12', { name: 'Renata Almeida', email: 'renata.almeida@clinicaalmeida.com.br' }, 'Orçamento: ensaio profissional para a clínica',
`Oi, Iara! Vi seu trabalho no Lume e adorei. Pode me passar um orçamento para um ensaio com 6 profissionais da clínica, mais fotos da recepção e dos consultórios?

Preciso das fotos até o fim de setembro, para o site novo.

Abraço,
Renata`),

  snd('cliente-renata-r', '2026-08-21T10:05', { name: 'Renata Almeida', email: 'renata.almeida@clinicaalmeida.com.br' }, 'Re: Orçamento: ensaio profissional para a clínica',
`Oi, Renata! Obrigada pelo carinho.

Segue o orçamento em anexo. Inclui diária de 4 horas, 40 fotos tratadas e direito de uso para site e redes. Podemos fechar a data para a semana de 14/09?

Iara`, { attachments: [{ name: 'Orcamento_Ensaio_Clinica.pdf', file: 'orcamento-ensaio-renata' }] }),

  inb('cliente-livia', '2026-09-12T19:40', { name: 'Lívia Carvalho', email: 'livia.carv@correio.app' }, 'Casamento 12/12: você ainda tem data?',
`Iara, oi! O João e eu vimos suas fotos de casamento e queremos muito você. A data é 12 de dezembro, em Cascavel. Você ainda tem agenda?

Pode nos mandar os valores?

Lívia`),

  snd('cliente-livia-r', '2026-09-13T09:30', { name: 'Lívia Carvalho', email: 'livia.carv@correio.app' }, 'Re: Casamento 12/12: você ainda tem data?',
`Lívia, que alegria! Tenho a data, sim. Mandei o orçamento em anexo, com as duas opções (só cerimônia, ou cerimônia + festa). Sinal de 30% para reservar a data.

Iara`, { attachments: [{ name: 'Orcamento_Casamento_Livia_Joao.xlsx', file: 'orcamento-casamento' }] }),

  snd('curriculo-rh', '2026-08-12T16:40', { name: 'RH Agência Pulsar', email: 'rh@agenciapulsar.com.br' }, 'Candidatura: fotógrafa e videomaker (vaga híbrida)',
`Olá,

envio meu currículo para a vaga de fotógrafa e videomaker. Tenho 5 anos de experiência com eventos, casamentos e institucional. Portfólio no Lume (@iarafontenele.foto).

Atenciosamente,
Iara Fontenele`, { attachments: [{ name: 'Curriculo_Iara_Fontenele.pdf', file: 'curriculo-iara' }] }),

  inb('rh-pulsar', '2026-08-18T11:00', { name: 'RH Agência Pulsar', email: 'rh@agenciapulsar.com.br' }, 'Re: Candidatura: fotógrafa e videomaker',
`Olá, Iara. Agradecemos o interesse. No momento, escolhemos outro perfil, mas manteremos seu currículo no nosso banco de talentos.

Equipe de RH · Agência Pulsar`, { read: true }),

  inb('cliente-camila', '2026-08-24T08:55', { name: 'Camila Bezerra', email: 'camilabezerra@correio.app' }, 'Fotos do ensaio gestante',
`Iara, as fotos ficaram LINDAS. Chorei no meio da galeria. Obrigada! Já indiquei para duas amigas.

Beijos,
Camila`),

  /* ---------------- Contas e faturas ---------------- */
  inb('fatura-jandaia-set', '2026-09-28T08:00', { name: 'Jandaia', email: 'fatura@jandaia.com.br' }, 'Sua fatura de setembro está disponível',
`Olá, Iara. A fatura do seu cartão Jandaia fechou em R$ 1.294,17 e vence em 05/10. Você pode pagar pelo app, com Pix ou boleto.

Jandaia · seu banco, do seu jeito`),

  inb('fatura-jandaia-out', '2026-10-05T08:00', { name: 'Jandaia', email: 'fatura@jandaia.com.br' }, 'Pagamento da fatura confirmado',
`Recebemos o pagamento da sua fatura de setembro. Obrigado!

Jandaia`),

  inb('litoral-fatura', '2026-10-02T06:30', { name: 'Litoral Móvel', email: 'faturas@litoralmovel.com.br' }, 'Sua fatura Litoral Móvel (venc. 10/10)',
`Olá! A fatura da linha (85) 98741-2290 está disponível: R$ 79,90, vencimento em 10/10. Pague pelo app e evite a suspensão.

Litoral Móvel`),

  inb('energia-fatura', '2026-09-25T07:10', { name: 'Energia Ceará', email: 'contas@energiaceara.com.br' }, 'Conta de luz de setembro: R$ 168,32',
`Sua conta de luz (Rua Carneiro da Cunha, Benfica) chegou: R$ 168,32. Vencimento: 05/10.

Energia Ceará`),

  inb('fibranet', '2026-10-01T09:00', { name: 'FibraNet', email: 'cobranca@fibranet.com.br' }, 'Boleto de outubro: internet 500 Mega',
`Olá! O boleto da sua internet de R$ 99,90 vence em 08/10. Pague pelo app para manter o desconto de pontualidade.

FibraNet`),

  inb('streamflix', '2026-10-03T12:00', { name: 'Streamflix', email: 'cobranca@streamflix.com' }, 'Cobrança realizada: R$ 39,90',
`Recebemos o pagamento da sua assinatura Streamflix Padrão (R$ 39,90). Aproveite a nova temporada.

Streamflix`, { read: true }),

  inb('nuvem-armazenamento', '2026-09-16T08:00', { name: 'Nuvem+', email: 'avisos@nuvemmais.com' }, 'Seu armazenamento está quase cheio (92%)',
`Você usou 92% dos seus 100 GB. Libere espaço ou faça upgrade por R$ 9,90/mês.

Nuvem+`, { read: true }),

  inb('imobiliaria', '2026-10-01T10:00', { name: 'Imobiliária Benfica', email: 'cobranca@imobbenfica.com.br' }, 'Boleto de aluguel: out/2026',
`Prezada Iara,

segue o boleto do aluguel do imóvel da Rua Carneiro da Cunha, apto 204 (R$ 1.450,00), com vencimento em 05/10.

Imobiliária Benfica`),

  /* ---------------- Newsletters e promoções (inbox e promo) ---------------- */
  inb('lente-viva', '2026-10-08T07:30', { name: 'Revista Lente Viva', email: 'contato@lenteviva.com.br' }, 'Edição 212: a luz do fim de tarde (e como parar de errar o branco)',
`Nesta edição: como fotografar o pôr do sol sem estourar o céu, cinco erros de balanço de branco e entrevista com a fotógrafa Leila Moura sobre projetos de longa duração.

Leia agora no app da revista.

Revista Lente Viva`, { read: true }),

  inb('fotografe-mais', '2026-09-29T07:30', { name: 'Fotografe Mais', email: 'oi@fotografemais.com' }, 'Timelapse sem segredo: guia para iniciantes',
`Tripé firme, intervalômetro e paciência. Neste guia, a gente mostra como configurar o intervalo, a abertura fixa e a exposição manual para um timelapse suave do pôr do sol.

Fotografe Mais`, { read: true }),

  pro('promo-fotobras-1', '2026-09-20T09:00', { name: 'FotoBras', email: 'ofertas@fotobras.com.br' }, 'Semana do Fotógrafo: até 35% off em lentes e filtros',
`Filtros polarizadores a partir de R$ 189,90. Cartões de memória 128 GB com 30% de desconto. Frete grátis acima de R$ 299.

FotoBras`),
  pro('promo-fotobras-2', '2026-10-06T09:00', { name: 'FotoBras', email: 'ofertas@fotobras.com.br' }, 'Tripé de carbono em 10x sem juros',
`O tripé que cabe na mochila: 1,1 kg, suporta 12 kg. Só até domingo.

FotoBras`),
  pro('promo-bora', '2026-10-04T18:00', { name: 'Bora', email: 'ola@bora.app' }, 'Cupom de R$ 10 para a sua próxima corrida',
`Use o cupom BORA10 na sua próxima viagem em Fortaleza. Válido até 15/10.

Bora`),
  pro('promo-streamflix', '2026-09-22T10:00', { name: 'Streamflix', email: 'oi@streamflix.com' }, 'Novos episódios esta semana',
`Cinco estreias para o seu fim de semana. Maratone com a gente.

Streamflix`),
  pro('promo-passagens', '2026-10-01T08:00', { name: 'Viaje Mais', email: 'ofertas@viajemais.com' }, 'Fortaleza → Jericoacoara por R$ 69',
`Ônibus leito para Jeri com 40% off. Ofertas até 20/10.

Viaje Mais`),
  pro('promo-mercado', '2026-10-07T08:30', { name: 'Supermercado Pague Bem', email: 'ofertas@paguebem.com.br' }, 'Ofertas da semana: arroz, feijão e café',
`Aproveite as ofertas do Pague Bem até quarta. Compre pelo app e retire na loja.

Pague Bem`),

  /* ---------------- Spam e lixeira ---------------- */
  spm('spam-1', '2026-10-09T03:12', { name: 'Premio Brasil', email: 'ganhador@premiobr-sorteio.xyz' }, 'Você foi sorteada! Resgate R$ 4.980 agora',
`Parabéns! Clique no link abaixo para resgatar seu prêmio antes que expire. Informe seu CPF e os dados do seu cartão.

[Resgatar prêmio](http://premiobr-sorteio.xyz/r)`),
  spm('spam-2', '2026-10-05T14:55', { name: 'Credito Facil', email: 'contato@credfacil-online.net' }, 'Empréstimo aprovado sem consulta ao SPC',
`Dinheiro na sua conta em 10 minutos. Sem comprovar renda. Responda este e-mail com seu CPF.`),
  spm('spam-3', '2026-09-30T22:10', { name: 'Jandaia Segurança', email: 'seguranca@jandaia-verifica.com' }, 'URGENTE: sua conta será bloqueada',
`Detectamos atividade suspeita. Acesse o link para confirmar seus dados em até 2 horas.

[Confirmar agora](http://jandaia-verifica.com/login)`),
  spm('spam-4', '2026-09-14T09:08', { name: 'Dr. Marcos Emagrece', email: 'vendas@emagreca-ja.biz' }, 'Perca 12 kg em 15 dias (método secreto)',
`Chega de dieta! Clique e descubra o método que os médicos não querem que você conheça.`),

  { id: 'lixo-1', folder: 'trash', from: { name: 'Bora', email: 'ola@bora.app' }, to: [IARA], at: '2026-09-10T18:00', subject: 'Sua corrida foi avaliada', body: 'Obrigado por avaliar sua motorista. Sua opinião ajuda a melhorar o Bora.', read: true },
  { id: 'lixo-2', folder: 'trash', from: { name: 'Fotografe Mais', email: 'oi@fotografemais.com' }, to: [IARA], at: '2026-09-15T07:30', subject: 'Webinar grátis: iluminação com luz natural', body: 'Quinta, às 19h, ao vivo. Inscreva-se.', read: true },
  { id: 'lixo-3', folder: 'trash', from: IARA, to: [IARA], at: '2026-09-27T16:00', subject: 'rascunho (sem assunto)', body: 'Pergunta pro Théo se ele consegue fazer aquele backup cifrado de que a gente falou.', read: true },

  /* ---------------- PARTE 2 ---------------- */
  {
    id: 'nuvem-edicao', folder: 'inbox', live: true, important: false, read: false, req: 'cap6',
    from: { name: 'Nimbus Nuvem', email: 'nao-responda@nimbus.cloud' }, to: [IARA], at: '2026-10-12T03:19',
    subject: '"Caderno_da_Serra_rascunho.docx" foi alterado em outro dispositivo',
    body: `Olá, Iara.

Um arquivo da sua Nimbus Nuvem foi modificado.

Arquivo: Caderno_da_Serra_rascunho.docx
Alteração: 3 trechos editados
Horário: seg., 12 de out. de 2026, 03:17
Dispositivo: Notebook · Windows 10 (usuário do sistema: ademar.sa)
Local aproximado: Guaraciaba do Norte, CE

A versão do seu celular Nimbus N9 não foi sincronizada desde sáb., 10 de out., 23:47, porque o aparelho está desligado.

Se não foi você, troque sua senha e revise os dispositivos com acesso à conta.

Nimbus Nuvem`,
  },
];

export default {
  account: 'iara.fontenele@correio.app',
  emails,
};
