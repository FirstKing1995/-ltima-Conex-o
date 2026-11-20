// Gmail — conteúdo extra (ruído do dia a dia + relatórios do Espelho Seguro + Iara → Bruna 29/09).
// Somado a data/caso01/correio.js. Mesmo formato: pastas inbox | sent | promo | spam | trash.
// Iara só envia até sáb 10/10; depois disso só chegam e-mails (conta na nuvem, até ter 13/10 23:12).

const IARA = { name: 'Iara Fontenele', email: 'iara.fontenele@gmail.com' };
const BRUNA = { name: 'Bruna Leal', email: 'bruna.leal@ofarol.com.br' };
const ESPELHO = { name: 'Espelho Seguro', email: 'alertas@espelhoseguro.app' };
const PROF = { name: 'Heitor Maranhão', email: 'heitor.maranhao@faculdadeatlantico.edu.br' };
const POS = { name: 'Coordenação · Especialização em Fotojornalismo', email: 'pos.fotojornalismo@faculdadeatlantico.edu.br' };
const JESSICA = { name: 'Jéssica e Thiago', email: 'casamento.jessicaethiago@gmail.com' };
const LITORAL = { name: 'Claro', email: 'faturas@claro.com.br' };
const JANDAIA = { name: 'Nubank', email: 'fatura@nubank.com.br' };
const JANDAIA_AV = { name: 'Nubank', email: 'avisos@nubank.com.br' };
const ENERGIA = { name: 'Energia Ceará', email: 'contas@energiaceara.com.br' };
const LUME = { name: 'Instagram', email: 'notificacoes@instagram.com' };
const FOCO = { name: 'Loja Foco', email: 'pedidos@lojafoco.com.br' };
const FOCO_NEWS = { name: 'Loja Foco', email: 'novidades@lojafoco.com.br' };
const FOTOBRAS = { name: 'FotoBras', email: 'ofertas@fotobras.com.br' };
const LENTE = { name: 'Revista Lente Viva', email: 'contato@lenteviva.com.br' };
const OLHAR = { name: 'Escola Olhar', email: 'turmas@escolaolhar.com.br' };
const PREMIO = { name: 'Prêmio Luz do Sertão', email: 'inscricoes@premioluzdosertao.org.br' };
const SINDICO = { name: 'Condomínio Ed. Benfica Plaza', email: 'sindico.benficaplaza@gmail.com' };
const MOURA = { name: 'Patrícia Moura', email: 'patimoura@gmail.com' };
const LIVIA = { name: 'Lívia Carvalho', email: 'livia.carv@gmail.com' };
const THAIS = { name: 'Rosilene Freitas', email: 'rosilene.freitas@gmail.com' };
const BATIZADO = { name: 'Aline Sobreira Costa', email: 'aline.scosta@gmail.com' };
const CAMILA = { name: 'Camila Bezerra', email: 'camilabezerra@gmail.com' };
const SANDRO = { name: 'Sandro Alencar', email: 'sandro.alencar.foto@gmail.com' };
const SONORA = { name: 'Sonora', email: 'oi@sonora.app' };

const fim = 'Você recebe este alerta porque ativou o espelho em 03/10/2026.';

// inbox
const inb = (id, at, from, subject, body, x = {}) => ({ id, folder: 'inbox', from, to: [IARA], at, subject, body, read: true, ...x });
// enviados
const snd = (id, at, to, subject, body, x = {}) => ({ id, folder: 'sent', from: IARA, to: [].concat(to), at, subject, body, read: true, ...x });
// promoções / spam
const pro = (id, at, from, subject, body, x = {}) => ({ id, folder: 'promo', from, to: [IARA], at, subject, body, read: true, ...x });
const spm = (id, at, from, subject, body, x = {}) => ({ id, folder: 'spam', from, to: [IARA], at, subject, body, read: false, ...x });

const emails = [
  /* ---------------- Espelho Seguro (backup cifrado que o Théo configurou) ---------------- */
  inb('espelho-0310', '2026-10-03T21:30', ESPELHO, 'Relatório de acesso ao seu espelho',
`Olá, Iara.

Espelho ativado. Primeira sincronização completa.

Aparelho de origem: moto g85
Administrador do espelho: theo.castro
Permissão do administrador: ativação e manutenção (sem acesso de leitura registrado)
Data e hora: sáb., 3 de out. de 2026, 21:30
Local aproximado (pelo IP): Fortaleza, CE, Brasil

A partir de agora, uma cópia cifrada do seu aparelho é atualizada sempre que ele estiver conectado. Só quem tem a chave consegue abrir a cópia. Toda vez que o administrador acessar o espelho, você recebe um relatório como este.

Espelho Seguro · backup cifrado de ponta a ponta

${fim}`),

  inb('espelho-1010a', '2026-10-10T23:38', ESPELHO, 'Relatório de acesso ao seu espelho',
`Olá, Iara.

O administrador do seu espelho acessou a cópia cifrada do seu aparelho.

Administrador: theo.castro
Tipo de acesso: leitura da cópia cifrada
Data e hora: sáb., 10 de out. de 2026, 23:38
Local aproximado (pelo IP): Fortaleza, CE, Brasil
Dispositivo: Android

Se você reconhece este acesso, nenhuma ação é necessária. Para revogar o administrador, abra o Espelho Seguro e toque em Administradores.

Espelho Seguro · backup cifrado de ponta a ponta

${fim}`, { read: false }),

  inb('espelho-1010b', '2026-10-10T23:52', ESPELHO, 'Relatório de acesso ao seu espelho',
`Olá, Iara.

O administrador do seu espelho acessou a cópia cifrada do seu aparelho.

Administrador: theo.castro
Tipo de acesso: leitura da cópia cifrada
Data e hora: sáb., 10 de out. de 2026, 23:52
Local aproximado (pelo IP): Fortaleza, CE, Brasil
Dispositivo: Android

Último contato com o aparelho de origem: 10/10/2026 23:47.

Se você reconhece este acesso, nenhuma ação é necessária. Para revogar o administrador, abra o Espelho Seguro e toque em Administradores.

Espelho Seguro · backup cifrado de ponta a ponta

${fim}`, { read: false }),

  inb('espelho-1110', '2026-10-11T06:12', ESPELHO, 'Relatório de acesso ao seu espelho',
`Olá, Iara.

O administrador do seu espelho acessou a cópia cifrada do seu aparelho.

Administrador: theo.castro
Tipo de acesso: leitura da cópia cifrada
Data e hora: dom., 11 de out. de 2026, 06:12
Local aproximado (pelo IP): Guaraciaba do Norte, CE, Brasil
Dispositivo: Android

Se você reconhece este acesso, nenhuma ação é necessária. Para revogar o administrador, abra o Espelho Seguro e toque em Administradores.

Espelho Seguro · backup cifrado de ponta a ponta

${fim}`, { read: false }),

  inb('espelho-1210', '2026-10-12T22:40', ESPELHO, 'Relatório de acesso ao seu espelho',
`Olá, Iara.

O administrador do seu espelho acessou a cópia cifrada do seu aparelho.

Administrador: theo.castro
Tipo de acesso: leitura da cópia cifrada
Data e hora: seg., 12 de out. de 2026, 22:40
Local aproximado (pelo IP): Guaraciaba do Norte, CE, Brasil
Dispositivo: notebook Linux

Se você reconhece este acesso, nenhuma ação é necessária. Para revogar o administrador, abra o Espelho Seguro e toque em Administradores.

Espelho Seguro · backup cifrado de ponta a ponta

${fim}`, { read: false }),

  /* ---------------- Iara → Bruna, 29/09 ---------------- */
  snd('iara-bruna-2909', '2026-09-29T23:40', BRUNA, 'Re: as fazendas',
`Bruna, desculpa a hora.

Confirmei hoje uma coisa e preciso deixar escrito em algum lugar. As fotos das "fazendas parceiras" da Colheita são montadas pelo marketing, o Marcos (Marcos Vieira). Parte é de banco de imagens e parte é de uma fazenda de Uruçuí, no Piauí. Tá no metadado de uma das fotos, nem se deram ao trabalho de apagar.

Eu confrontei o Marcos hoje. Ele não negou. Pediu "até segunda pra resolver internamente".

Não confio em ninguém lá dentro. Nem em quem eu achava que confiava.

Iara`),

  /* ---------------- Pós em fotojornalismo (TCC) ---------------- */
  inb('pos-calendario', '2026-05-11T10:00', POS, 'Calendário do TCC: turma 2025.1',
`Prezadas e prezados,

segue o calendário do Trabalho de Conclusão de Curso da turma 2025.1 da Especialização em Fotojornalismo e Documentário:

Entrega do pré-projeto: 05/06
Primeira versão (ensaio + memorial): 21/08
Versão final: 20/10
Bancas: de 03/11 a 13/11

Cada aluno será acompanhado por um orientador. A lista sai até o fim do mês.

Coordenação · Especialização em Fotojornalismo e Documentário · Faculdade Atlântico`),

  snd('pos-preprojeto', '2026-06-04T22:48', PROF, 'Pré-projeto: "Quem vende o dia"',
`Professor Heitor, boa noite.

Envio meu pré-projeto. A ideia é um ensaio de retratos dos feirantes do Mercado São Sebastião, sempre na primeira hora do dia, entre 4h30 e 6h, quando a luz ainda é de lâmpada e o mercado está montando. Título provisório: "Quem vende o dia".

No memorial, quero discutir o retrato de trabalho sem cair na pena ou no folclore.

Fico no aguardo das suas observações.

Iara Fontenele`, { attachments: [{ name: 'PreProjeto_IaraFontenele.pdf' }] }),

  inb('pos-preprojeto-r', '2026-06-09T08:15', PROF, 'Re: Pré-projeto: "Quem vende o dia"',
`Iara, bom dia.

Gostei muito. O recorte de horário é o melhor do projeto: dá unidade à série e resolve a pergunta "por que esses retratos e não outros". Duas coisas:

1. Cuidado com o excesso de ensaios parecidos. Leia o trabalho de feira do Tiago Santana e pense no que você faz diferente.
2. O memorial precisa ter os nomes dos retratados e a autorização de uso. Comece a pedir já.

Pré-projeto aprovado. Pode seguir.

Heitor Maranhão · Professor orientador`),

  inb('pos-versao1', '2026-08-27T21:02', PROF, 'Primeira versão: comentários',
`Iara,

li a primeira versão. As fotos do Seu Valdir do peixe e da Dona Graça das ervas estão entre as melhores da turma. O memorial ainda está tímido: você descreve o que fez, mas não diz o que pensa. Escreva na primeira pessoa, sem medo.

Corte umas oito fotos. Doze fortes valem mais que vinte médias.

Heitor`),

  snd('pos-versao1-r', '2026-08-28T07:40', PROF, 'Re: Primeira versão: comentários',
`Obrigada, professor! Vou cortar e reescrever o memorial. Acho que consigo voltar no mercado em setembro pra fazer mais duas pessoas.

Iara`),

  inb('pos-banca', '2026-09-24T14:30', POS, 'Bancas de TCC: datas e horários',
`Prezada Iara Fontenele,

sua banca de TCC foi marcada para sexta-feira, 06/11/2026, às 14h, na sala 12 do bloco B.

Banca: Prof. Heitor Maranhão (orientador), Profa. Cecília Arruda e o fotógrafo convidado Ivan Holanda.

A versão final deve ser enviada pelo portal até 20/10, em PDF, com as imagens em baixa resolução.

Coordenação · Especialização em Fotojornalismo e Documentário`),

  inb('pos-lembrete-final', '2026-10-11T09:00', POS, 'Lembrete: versão final do TCC até 20/10',
`Prezadas e prezados,

lembramos que a versão final do TCC deve ser enviada pelo portal até terça, 20/10. Depois dessa data o portal fecha e a banca precisa ser remarcada para o próximo semestre.

Coordenação · Especialização em Fotojornalismo e Documentário`, { read: false }),

  /* ---------------- Casamento da prima Jéssica ---------------- */
  inb('jessica-savethedate', '2026-07-19T19:00', JESSICA, 'Save the date: Jéssica e Thiago · 28/11/2026',
`Querida Iara,

guarda essa data: 28 de novembro de 2026, sábado, às 19h, na Igreja Matriz de Guaraciaba do Norte. A festa vai ser no Clube, logo depois.

O convite de papel chega em setembro. Esse aqui é só pra ninguém marcar outra coisa!

Com amor,
Jéssica e Thiago`),

  inb('jessica-rsvp', '2026-09-08T20:10', JESSICA, 'Confirme sua presença até 31/10',
`Oi, Iara!

O convite já chegou aí? Pra gente fechar a lista do buffet, confirma tua presença respondendo esse e-mail até 31/10. Se for levar acompanhante, manda o nome.

A lista de presentes tá no site, mas sério, presente é tu ir.

Beijo,
Jéssica`),

  snd('jessica-rsvp-r', '2026-09-08T21:32', JESSICA, 'Re: Confirme sua presença até 31/10',
`Jé, confirmadíssima! Vou sozinha. Já separei o vestido verde.

E nem pensa em me contratar, nesse dia eu sou convidada. Mas vou levar a câmera pequena, que eu não aguento.

Beijo grande pra ti e pro Thiago.

Iara`),

  inb('jessica-presentes', '2026-10-06T18:45', JESSICA, 'Faltam 6 semanas!',
`Oi, gente querida!

Faltam só seis semanas e a ansiedade já bateu. Algumas informações:

Traje: esporte fino. A capela é pequena, então chegue cedo.
Vai fazer frio na serra à noite: levem um casaquinho.
Quem vem de fora: o Hotel Serrano deu 10% de desconto pra quem disser que é do casamento.

Obrigada por fazerem parte disso.

Jéssica e Thiago`),

  /* ---------------- Clientes e propostas ---------------- */
  inb('cliente-15anos', '2026-05-20T15:22', THAIS, 'Orçamento festa de 15 anos (Thaís)',
`Boa tarde, Iara. Sou mãe da Thaís, que faz 15 anos em julho. Queria orçamento de foto para a festa (umas 5 horas) e um ensaio antes, se possível na Praia de Iracema.

A festa é dia 18/07, num salão no Montese.

Obrigada,
Rosilene`),

  snd('cliente-15anos-r', '2026-05-21T09:40', THAIS, 'Re: Orçamento festa de 15 anos (Thaís)',
`Bom dia, Rosilene! Que alegria.

Segue o orçamento:
Ensaio externo (1h30, 30 fotos tratadas): R$ 450
Cobertura da festa (5h, 250 fotos tratadas, galeria online): R$ 1.600
Os dois juntos: R$ 1.900

Para reservar a data, sinal de 30%. Se quiser, a gente faz uma chamada para alinhar o estilo da Thaís.

Iara`),

  inb('cliente-15anos-ok', '2026-05-23T11:05', THAIS, 'Re: Re: Orçamento festa de 15 anos (Thaís)',
`Iara, fechado o pacote dos dois. Fiz o Pix do sinal agora. A Thaís quer o ensaio no fim de tarde, perto do Dragão do Mar.

Rosilene`),

  inb('proposta-festival', '2026-06-16T10:12', { name: 'Festival de Inverno de Viçosa', email: 'producao@festivalvicosa.art.br' }, 'Proposta: fotografia oficial do Festival de Inverno',
`Olá, Iara.

Estamos montando a equipe do Festival de Inverno de Viçosa do Ceará (de 23 a 26/07) e seu nome foi indicado pelo Sandro Alencar. Buscamos uma fotógrafa para os shows noturnos e a programação infantil. Diária de R$ 600, com hospedagem e alimentação.

Teria disponibilidade?

Equipe de Produção · Festival de Inverno de Viçosa do Ceará`),

  snd('proposta-festival-r', '2026-06-16T21:18', { name: 'Festival de Inverno de Viçosa', email: 'producao@festivalvicosa.art.br' }, 'Re: Proposta: fotografia oficial do Festival de Inverno',
`Olá! Muito obrigada pelo convite e pela confiança.

Infelizmente, nessa semana eu já tenho trabalho fechado em Fortaleza. Se a equipe do ano que vem estiver aberta, eu adoraria.

Iara Fontenele`),

  inb('cliente-batizado', '2026-08-31T17:44', BATIZADO, 'Fotos do batizado do Miguel',
`Oi, Iara! Uma amiga me passou seu contato. O batizado do meu filho, Miguel, vai ser no dia 18/10, um domingo, às 9h, na Paróquia de Fátima, com almoço em casa depois. Você faz?

Aline`),

  snd('cliente-batizado-r', '2026-09-01T08:30', BATIZADO, 'Re: Fotos do batizado do Miguel',
`Oi, Aline! Faço sim, e o dia 18/10 está livre.

Cobertura da cerimônia + almoço (até 3h): R$ 700, com 120 fotos tratadas e galeria online em até 15 dias. Sinal de R$ 200 para reservar.

Iara`),

  inb('cliente-batizado-ok', '2026-09-03T12:20', BATIZADO, 'Re: Re: Fotos do batizado do Miguel',
`Fechado! Mandei o sinal pelo Pix. Depois te passo o endereço do almoço.

Aline`),

  inb('cliente-batizado-1310', '2026-10-13T19:05', BATIZADO, 'Endereço do almoço (domingo, 18/10)',
`Oi, Iara! Tudo certo pra domingo? O almoço vai ser na casa da minha mãe: Rua Waldery Uchôa, 880, Benfica. Pertinho de ti, né?

A gente chega na paróquia 8h40. Qualquer coisa me chama.

Aline`, { read: false }),

  inb('cliente-moura', '2026-09-29T20:30', MOURA, 'Fotos do ensaio na praia',
`Oi, Iara! Os meninos não param de perguntar das fotos da praia kkk. Tem previsão?

Patrícia`),

  snd('cliente-moura-r', '2026-09-30T08:05', MOURA, 'Re: Fotos do ensaio na praia',
`Oi, Patrícia! Ficaram lindas, o pôr do sol ajudou muito. Estou terminando a edição e entrego até o dia 13/10, pode ser? Esse começo de outubro está corrido.

Iara`),

  inb('cliente-moura-1110', '2026-10-11T20:40', MOURA, 'Re: Re: Fotos do ensaio na praia',
`Oi, Iara! Só lembrando das fotos, a vovó vem pra cá no dia 15 e eu queria imprimir algumas pra ela. Se der pra mandar uma prévia antes, já me salva!

Beijo,
Patrícia`, { read: false }),

  inb('cliente-livia-1110', '2026-10-11T17:20', LIVIA, 'Sinal do casamento',
`Iara, oi! Desculpa a demora, a gente teve uns imprevistos com o buffet. Vamos fazer o Pix do sinal (os 30%) essa semana. É a mesma chave do orçamento?

E queria marcar uma conversa pra falar da cerimônia ao ar livre.

Lívia`, { read: false }),

  inb('cliente-livia-1310', '2026-10-13T11:48', LIVIA, 'Re: Sinal do casamento',
`Iara? Não sei se meu e-mail chegou. Me responde quando puder, tá? Não quero perder a data.

Lívia`, { read: false }),

  inb('camila-1210', '2026-10-12T21:15', CAMILA, '(sem assunto)',
`Iara,

eu sei que você não vai ler isso. Vi a notícia hoje à tarde e fiquei olhando a galeria do meu ensaio por uma hora. A Helena nasceu semana passada e a primeira coisa que eu ia fazer era te mandar a foto dela.

Obrigada por ter me feito achar bonita num momento em que eu não me achava.

Camila`, { read: false }),

  inb('sandro-1210', '2026-10-12T23:02', SANDRO, 'o flash',
`Iara,

não sei quem vai ver isso. Fiquei sabendo hoje à noite pelo grupo dos fotógrafos. Ainda não consigo acreditar.

Eu tô com o teu flash e o difusor desde o casamento de agosto. Vou entregar pra tua família, em Guaraciaba ou com a Nanda, o que for melhor pra eles. Se alguém da família ler, me procure: (85) 99190-3426.

Sandro`, { read: false }),

  /* ---------------- Editais e cursos ---------------- */
  inb('premio-inscricao', '2026-09-03T16:40', PREMIO, 'Inscrição recebida: Prêmio Luz do Sertão de Fotografia 2026',
`Olá, Iara Fontenele.

Recebemos sua inscrição na categoria Ensaio Documental, com a série "Quem vende o dia" (12 imagens). Número da inscrição: LS-2026-0418.

O resultado da primeira fase sai em 13/10.

Prêmio Luz do Sertão de Fotografia`),

  inb('premio-resultado', '2026-10-13T10:00', PREMIO, 'Resultado da 1ª fase: sua série foi selecionada',
`Olá, Iara Fontenele.

Temos o prazer de informar que a série "Quem vende o dia" foi selecionada para a fase final do Prêmio Luz do Sertão de Fotografia 2026, na categoria Ensaio Documental.

Para seguir, envie até 23/10 os arquivos em alta resolução e a autorização de uso de imagem das pessoas retratadas.

Parabéns!

Comissão de Seleção · Prêmio Luz do Sertão`, { read: false, starred: true }),

  inb('olhar-curso', '2026-07-02T09:00', OLHAR, 'Últimas vagas: Luz de Estúdio para Retrato (presencial)',
`Quatro sábados de agosto, das 9h às 13h, no estúdio da Escola Olhar, na Aldeota. Turma de 10 pessoas. Iluminação com um, dois e três pontos, rebatedor e luz contínua.

Investimento: R$ 680 em até 4x.

Escola Olhar`),

  inb('olhar-oficina', '2026-10-07T09:00', OLHAR, 'Oficina gratuita: edição de cor em lote',
`Quinta, 15/10, às 19h, ao vivo. Aprenda a criar predefinições e a manter a mesma cor em um casamento inteiro.

Escola Olhar`, { read: false }),

  inb('edital-ccbnb', '2026-08-06T11:30', { name: 'Fundo de Cultura de Fortaleza', email: 'editais@fundoculturafortaleza.org.br' }, 'Edital de Artes Visuais 2026: inscrições abertas',
`Estão abertas as inscrições para o Edital de Artes Visuais 2026, com prêmios de R$ 8.000 para projetos de fotografia em Fortaleza. Inscrições até 15/09, apenas pela plataforma.

Fundo de Cultura de Fortaleza`),

  /* ---------------- Contas, faturas e banco ---------------- */
  inb('litoral-fatura-mai', '2026-05-02T06:30', LITORAL, 'Sua fatura Claro (venc. 10/05)',
`Olá! A fatura da linha (85) 98741-2290 está disponível: R$ 79,90, vencimento em 10/05. Pague pelo app e evite a suspensão.

Claro`),

  inb('litoral-pago-1007', '2026-10-07T20:20', LITORAL, 'Pagamento recebido',
`Recebemos o pagamento da sua fatura de outubro (R$ 79,90). Obrigado por escolher a Litoral!

Claro`),

  inb('energia-ago', '2026-08-25T07:10', ENERGIA, 'Conta de luz de agosto: R$ 151,07',
`Sua conta de luz (Rua Carneiro da Cunha, Benfica) chegou: R$ 151,07. Vencimento: 05/09.

Dica: o ar-condicionado em 23 °C gasta até 30% menos que em 18 °C.

Energia Ceará`),

  inb('jandaia-fatura-jul', '2026-07-28T08:00', JANDAIA, 'Sua fatura de julho está disponível',
`Olá, Iara. A fatura do seu cartão Nubank fechou em R$ 1.012,48 e vence em 05/08. Você pode pagar pelo app, com Pix ou boleto.

Nubank · seu banco, do seu jeito`),

  inb('jandaia-limite', '2026-08-19T13:00', JANDAIA_AV, 'Boa notícia: seu limite aumentou',
`Iara, o limite do seu cartão Nubank agora é de R$ 4.500. O novo valor já está disponível no app.

Nubank · seu banco, do seu jeito`),

  inb('jandaia-pix-regra', '2026-10-12T08:00', JANDAIA_AV, 'Novos limites do Pix à noite',
`Olá, Iara. A partir de 01/11, o limite padrão do Pix entre 20h e 6h passa a ser de R$ 1.000. Você pode ajustar seus limites no app, em Pix > Meus limites.

Nubank · seu banco, do seu jeito`, { read: false }),

  inb('condominio-ata', '2026-09-10T19:30', SINDICO, 'Ata da assembleia e rateio da caixa d\'água',
`Prezados moradores,

segue o resumo da assembleia de 09/09:

1. Aprovado o conserto da caixa d'água, com rateio de R$ 85,00 por unidade em outubro.
2. O portão eletrônico será orçado com três empresas. Nova reunião em 08/10.
3. Lembrete: proibido deixar bicicleta no hall.

Wellington Barros · Síndico`),

  /* ---------------- Compras, rastreio e códigos ---------------- */
  inb('foco-pedido', '2026-06-22T14:02', FOCO, 'Pedido #88213 confirmado',
`Oi, Iara! Recebemos seu pedido.

1x Cartão de memória 128 GB V60
1x Bateria compatível para câmera
Total: R$ 412,80 (cartão de crédito, 3x)

Avisamos quando sair para entrega.

Loja Foco · equipamento fotográfico`),

  inb('foco-rastreio', '2026-06-24T09:30', FOCO, 'Seu pedido #88213 saiu para entrega',
`Seu pedido está a caminho. Código de rastreio: FC204478193BR. Entrega prevista: 26/06.

Loja Foco`),

  inb('foco-entregue', '2026-06-26T15:41', FOCO, 'Pedido #88213 entregue',
`Seu pedido foi entregue e recebido por "Fernanda (moradora)". Conta pra gente o que achou!

Loja Foco`),

  inb('foco-codigo', '2026-10-06T12:14', FOCO, 'Seu código de acesso: 482 917',
`Use o código 482 917 para entrar na sua conta da Loja Foco. Ele vale por 10 minutos.

Se não foi você, ignore este e-mail.

Loja Foco`),

  inb('streamflix-codigo', '2026-07-30T22:05', { name: 'Netflix', email: 'nao-responda@streamflix.com' }, 'Seu código de acesso temporário',
`Alguém (provavelmente você) pediu para entrar na Netflix em uma TV. Código: 7381. Válido por 15 minutos.

Netflix`),

  inb('lume-resumo-ago', '2026-09-01T10:00', LUME, 'Seu mês no Instagram: agosto',
`@iarafontenele.foto, olha só o seu agosto:

Contas alcançadas: 18.402 (+34%)
Novos seguidores: 212
Post mais visto: "luz de janela, tecido solto" (ensaio gestante)

Continue postando nos horários em que seu público está ativo: terças e quintas, às 19h.

Instagram`),

  inb('lume-alerta-reels', '2026-09-19T21:40', LUME, 'Seu carrossel está bombando',
`Seu carrossel "5 erros de luz que eu cometia" passou de 10 mil visualizações em 24 horas. Que tal responder os comentários?

Instagram`),

  inb('lume-resumo-set', '2026-10-01T10:00', LUME, 'Seu mês no Instagram: setembro',
`@iarafontenele.foto, olha só o seu setembro:

Contas alcançadas: 31.977 (+73%)
Novos seguidores: 640
Post mais visto: "5 erros de luz que eu cometia"

Instagram`),

  inb('lume-marcacao-1210', '2026-10-12T19:10', LUME, 'Você foi marcada em 14 publicações',
`@iarafontenele.foto, você foi marcada em 14 publicações e 37 comentários desde ontem. Abra o Instagram para ver.

Instagram`, { read: false }),

  /* ---------------- Newsletters e promoções ---------------- */
  inb('lente-viva-213', '2026-10-13T07:30', LENTE, 'Edição 213: fotografar à noite sem medo do ISO',
`Nesta edição: ruído não é defeito, guia de lanternas para retrato noturno e a história de uma série inteira feita com um celular antigo.

Leia agora no app da revista.

Revista Lente Viva`, { read: false }),

  inb('sonora-resumo', '2026-08-01T12:00', SONORA, 'Seu julho em música',
`Você ouviu 41 horas de música em julho. Artista mais ouvido: Fagner. Música do mês: "Asa Branca" (versão lenta). Sua playlist "pra editar" foi tocada 63 vezes.

Sonora`),

  pro('promo-foco-lentes', '2026-09-05T09:00', FOCO_NEWS, 'Chegou a nova 35mm f/1.4',
`Mais leve, mais nítida e com foco silencioso para vídeo. Pré-venda com 8% de desconto no Pix.

Loja Foco`),

  pro('promo-fotobras-carrinho', '2026-10-03T19:00', FOTOBRAS, 'Você esqueceu algo no carrinho',
`A lente 50mm f/1.8 ainda está esperando por você. Finalize a compra hoje e ganhe frete grátis.

FotoBras`),

  pro('promo-fotobras-1210', '2026-10-12T09:00', FOTOBRAS, 'Black Week antecipada: até 40% off',
`Só 72 horas. Corpos de câmera, lentes e iluminação com os menores preços do ano.

FotoBras`),

  pro('promo-bora-1110', '2026-10-11T18:00', { name: 'Uber', email: 'ola@uber.com' }, 'Domingo de chuva? Seu cupom ainda vale',
`O cupom BORA10 vale até 15/10. Use na sua próxima viagem.

Uber`),

  pro('promo-streamflix-1310', '2026-10-13T12:00', { name: 'Netflix', email: 'oi@streamflix.com' }, 'Continue de onde parou',
`Faltam 3 episódios para você terminar "Maré Baixa". Os novos episódios chegam sexta.

Netflix`),

  pro('promo-expresso', '2026-10-10T09:00', { name: 'Expresso Norte', email: 'vendas@expressonorte.com.br' }, 'Como foi sua viagem?',
`Conte pra gente como foi a sua viagem Fortaleza → Sobral de 09/10. Leva menos de 1 minuto.

Expresso Norte · Viaje tranquilo`),

  /* ---------------- Spam ---------------- */
  spm('spam-cripto', '2026-06-03T02:41', { name: 'Investe Fácil', email: 'lucros@investe-facil.top' }, 'Ganhe 3% AO DIA com robô de criptomoedas',
`Nosso robô opera sozinho enquanto você dorme. Comece com R$ 100 e saque quando quiser. Vagas limitadas!`),

  spm('spam-encomenda', '2026-08-11T10:17', { name: 'Correios Rastreamento', email: 'aviso@rastreio-encomendas.info' }, 'Sua encomenda está retida: pague a taxa de R$ 37,90',
`Sua encomenda foi retida na fiscalização. Para liberar, pague a taxa em até 24 horas pelo link.

[Pagar taxa](http://rastreio-encomendas.info/pagar)`),

  spm('spam-cpf', '2026-10-12T04:03', { name: 'Receita Regulariza', email: 'pendencia@regulariza-cpf.online' }, 'Seu CPF será cancelado',
`Identificamos irregularidades no seu CPF. Regularize em até 48 horas para evitar o bloqueio de contas e cartões.

[Regularizar agora](http://regulariza-cpf.online)`),

  { id: 'lixo-x1', folder: 'trash', from: { name: 'Escola Olhar', email: 'turmas@escolaolhar.com.br' }, to: [IARA], at: '2026-08-20T09:00', subject: 'Começa sábado: Luz de Estúdio', body: 'Lembrete para quem se inscreveu. Se você não se inscreveu, ignore.', read: true },
];

export default { emails };
