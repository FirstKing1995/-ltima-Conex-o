// Capítulos, objetivos, deduções, dossiês e linha do tempo do Caso 01.
// Lacuna de termo: { b:'id', cat:'hora' }   Lacuna de escolha: { b:'id', choice:[{id,label}] }
// Respostas ficam em answers.js (hash). Flags especiais: intro_done, phone_unlocked, cap1..cap4, cap4_done, solved:<id>.

const ch = (id, label) => ({ id, label });

export default {
  chapters: [
    {
      n: 0, title: 'Prólogo', subtitle: 'Mensagem errada', startWhen: 'intro_done',
      objectives: [
        { id: '0.1', text: 'Entrar no aparelho.', doneWhen: 'phone_unlocked' },
      ],
      completeWhen: 'phone_unlocked', onComplete: ['cap1'],
    },
    {
      n: 1, title: 'Capítulo 1', subtitle: 'A última noite', startWhen: 'cap1',
      objectives: [
        { id: '1.1', text: 'O que saiu deste celular por último?', doneWhen: 'seen:papo:chat:equipe-evento' },
        { id: '1.2', text: 'Onde o aparelho perdeu o sinal?', doneWhen: 'seen:rotas:last' },
        { id: '1.3', text: 'O que o corpo dela registrou naquela noite?', doneWhen: 'seen:pulso:day:2026-10-10' },
        { id: '1.4', text: 'A mensagem que chegou ao meu número.', doneWhen: 'seen:papo:chat:voce' },
      ],
      deduction: 'd1', completeWhen: 'solved:d1', onComplete: ['cap2'],
    },
    {
      n: 2, title: 'Capítulo 2', subtitle: 'Seis nomes', startWhen: 'cap2',
      objectives: [
        { id: '2.1', text: 'Quem se esconde atrás de @visto.por.ultimo?', doneWhen: 'seen:lume:recovery:visto.por.ultimo && seen:sms:thread:rafa-2' },
        { id: '2.2', text: 'Para onde o Rafa foi "fumar"?', doneWhen: 'seen:lume:post:rafa-live-1010 && seen:papo:chat:equipe-evento' },
        { id: '2.3', text: 'O que Caio queria comprar dela?', doneWhen: 'seen:papo:chat:caio && seen:jandaia:tx:devolucao-2509 && seen:lume:post:live-colheita' },
        { id: '2.4', text: 'Quem largou a festa durante o discurso?', doneWhen: 'seen:papo:chat:marcos && seen:papo:chat:equipe-evento && seen:lume:post:live-colheita' },
        { id: '2.5', text: 'O que o caseiro foi fazer no mirante?', doneWhen: 'seen:papo:chat:ze' },
      ],
      deduction: 'd2', completeWhen: 'solved:d2', onComplete: ['cap3'],
    },
    {
      n: 3, title: 'Capítulo 3', subtitle: 'A colheita', startWhen: 'cap3',
      objectives: [
        { id: '3.1', text: 'Para quem era, de fato, a mensagem das 23:31?', doneWhen: 'seen:correio:mail:bruna-1010' },
        { id: '3.2', text: 'Quem mais vigiava o celular dela?', doneWhen: 'seen:correio:mail:espelho-1110 && seen:papo:chat:turma-sobral' },
        { id: '3.3', text: 'O que ela trancou na Pasta Trancada?', doneWhen: 'pasta_aberta' },
        { id: '3.4', text: 'Seguir o dinheiro do pai.', doneWhen: 'seen:papo:chat:pai && seen:arquivos:file:taxas-garantia' },
        { id: '3.5', text: 'Quem é M E S ANDRADE?', doneWhen: 'seen:jandaia:tx:racha-bora && seen:papo:chat:turma-anchieta' },
      ],
      deduction: 'd3', completeWhen: 'solved:d3', onComplete: ['cap4'],
    },
    {
      n: 4, title: 'Capítulo 4', subtitle: 'Última conexão', startWhen: 'cap4',
      objectives: [
        { id: '4.1', text: 'O álibi de Duda resiste?', doneWhen: 'seen:lume:highlight:lari-noite && seen:lume:post:live-colheita' },
        { id: '4.2', text: 'O que foi apagado às 23:45 ainda existe em algum lugar?', doneWhen: 'seen:config:notif-history' },
        { id: '4.3', text: 'Quem usou o celular depois da queda, e como?', doneWhen: 'seen:config:unlock-log && seen:config:battery' },
        { id: '4.4', text: '"Vou gravar tudo."', doneWhen: 'seen:gravador:rec:g-2332' },
      ],
      allDoneFlag: 'cap4_done',
      deduction: 'final', completeWhen: 'solved:final', onComplete: ['final_done'],
    },
    {
      n: 5, title: 'Capítulo 5', subtitle: 'Dezessete anos', startWhen: 'final_verdade',
      objectives: [
        { id: '5.1', text: 'O que uma menina de dez anos viu em 2009?', doneWhen: 'seen:galeria:photo:festa-2009' },
        { id: '5.2', text: 'Quem caiu daquela pedra antes dela?', doneWhen: 'seen:arquivos:file:recortes-pedra && seen:notas:note:dezessete' },
        { id: '5.3', text: 'Quem mandou Iara parar de cavar?', doneWhen: 'seen:telefone:voicemail:vm-ademar' },
      ],
      deduction: 'd5', completeWhen: 'solved:d5', onComplete: ['cap6'],
    },
    {
      n: 6, title: 'Capítulo 6', subtitle: 'O Caderno da Serra', startWhen: 'cap6',
      objectives: [
        { id: '6.1', text: 'O manuscrito que a defesa juntou existe neste aparelho?', doneWhen: 'seen:arquivos:file:caderno-da-serra' },
        { id: '6.2', text: 'Quem mexeu na nuvem dela depois da morte?', doneWhen: 'seen:correio:mail:nuvem-edicao && seen:config:devices' },
        { id: '6.3', text: 'Quem escreveu, de fato, as mensagens da blusa verde?', doneWhen: 'cap6 && seen:sms:thread:rafa-2 && seen:lume:recovery:visto.por.ultimo' },
      ],
      deduction: 'd6', completeWhen: 'solved:d6', onComplete: ['cap7'],
    },
    {
      n: 7, title: 'Capítulo 7', subtitle: 'A Irmandade', startWhen: 'cap7',
      objectives: [
        { id: '7.1', text: 'Para onde ia o dinheiro da taxa?', doneWhen: 'seen:arquivos:file:repasses-associacao' },
        { id: '7.2', text: 'O que foi fundado em 11 de outubro de 1941?', doneWhen: 'seen:arquivos:file:estatuto-1941' },
        { id: '7.3', text: 'O que se ouve na Pedra Lisa?', doneWhen: 'seen:arquivos:file:infrassom-ibiapaba && seen:clima:agora' },
        { id: '7.4', text: 'O último arquivo do aparelho.', doneWhen: 'seen:galeria:photo:ultima-2347' },
      ],
      allDoneFlag: 'cap7_done',
      deduction: 'final2', completeWhen: 'solved:final2', onComplete: ['final2_done'],
    },
  ],

  deductions: {
    d1: {
      title: 'O que aconteceu às 23:41?', chapter: 1, unlockWhen: 'cap1',
      blocks: [{
        id: 'd1a', title: 'A noite',
        parts: ['Às ', { b: 'd1.saida', cat: 'hora' }, ' Iara saiu do galpão e foi a pé até o ', { b: 'd1.lugar', cat: 'lugar' },
          '. O relógio dela registrou uma queda às ', { b: 'd1.queda', cat: 'hora' }, '. A mensagem do “timelapse” saiu às ', { b: 'd1.msg', cat: 'hora' }, ', ',
          { b: 'd1.ordem', choice: [ch('antes', 'antes'), ch('depois', 'depois')] }, ' da queda — e o ', { b: 'd1.objeto', cat: 'objeto' },
          ' dela tinha ficado no galpão. Conclusão: essa mensagem ', { b: 'd1.autoria', choice: [ch('foi', 'foi escrita por Iara'), ch('naofoi', 'não foi escrita por Iara')] }, '.'],
      }],
      onSolve: ['solved:d1'],
    },
    d2: {
      title: 'Onde cada um estava às 23:41?', chapter: 2, unlockWhen: 'cap2',
      blocks: [
        { id: 'd2a', title: 'O ex', parts: ['O perfil @visto.por.ultimo era do ', { b: 'd2.perfil', cat: 'pessoa' }, '. Ele saiu do camarim às 23:36 e, às 23:41, estava no ',
          { b: 'd2.lugar_rafa', cat: 'lugar' }, ', fazendo uma ', { b: 'd2.prova_rafa', cat: 'objeto' }, '. O barro da bota era ',
          { b: 'd2.barro', choice: [ch('trilha', 'da trilha do mirante'), ch('estacionamento', 'do estacionamento'), ch('pasto', 'do pasto')] }, '.'] },
        { id: 'd2b', title: 'O chefe e o marketing', parts: [{ b: 'd2.live', cat: 'pessoa' }, ' discursava ao vivo no ', { b: 'd2.lugar_caio', cat: 'lugar' },
          '; a transmissão caiu por ', { b: 'd2.queda', choice: [ch('40s', '40 segundos'), ch('4min', '4 minutos'), ch('12min', '12 minutos')] }, '. ',
          { b: 'd2.marcos', cat: 'pessoa' }, ' largou a câmera às 23:33 e, à 00:04, estava em ', { b: 'd2.lugar_marcos', cat: 'lugar' }, ', comprando ', { b: 'd2.prova_marcos', cat: 'objeto' }, '.'] },
        { id: 'd2c', title: 'O caseiro e o encontro', parts: ['Seu Zé subiu a trilha antes das 23:30 para amarrar a ', { b: 'd2.fita', cat: 'objeto' }, ' na cerca; às 23:42 aparece na live, no ',
          { b: 'd2.lugar_ze', cat: 'lugar' }, '. Nenhum dos quatro ', { b: 'd2.estavam', choice: [ch('estava', 'estava'), ch('naoestava', 'não estava')] },
          ' no mirante. Mas, às 21:55, Iara tinha confirmado um encontro às 23h30 com o número ', { b: 'd2.numero', cat: 'numero' }, '.'] },
      ],
      onSolve: ['solved:d2'],
    },
    d3: {
      title: 'Por que Iara?', chapter: 3, unlockWhen: 'cap3',
      blocks: [{
        id: 'd3a', title: 'O motivo',
        parts: ['A mensagem das 23:31 era para a jornalista ', { b: 'd3.jornalista', cat: 'pessoa' }, '. Iara ia provar que a ', { b: 'd3.empresa', cat: 'conceito' },
          ' era uma ', { b: 'd3.esquema', cat: 'conceito' }, ' comandada por ', { b: 'd3.chefe', cat: 'pessoa' }, ', com fotos de fazenda montadas por ', { b: 'd3.fotos', cat: 'pessoa' }, '.'],
      }, {
        id: 'd3b', title: 'O amigo',
        parts: [{ b: 'd3.eco', cat: 'pessoa' }, ' mentiu sobre onde estava no domingo. Mas às 23:38 de sábado, três minutos antes da queda, ele abria a cópia do celular dela em ', { b: 'd3.lugar_eco', cat: 'lugar' }, '.'],
      }, {
        id: 'd3c', title: 'O dinheiro',
        parts: ['Alguém cobrava uma falsa ', { b: 'd3.taxa', cat: 'conceito' }, ' — inclusive R$ 30 mil do ', { b: 'd3.familia', cat: 'pessoa' }, ' de Iara — para a firma M E S ANDRADE ME. A firma e o número que marcou o encontro no mirante eram de ',
          { b: 'd3.dono', cat: 'pessoa' }, '.'],
      }],
      onSolve: ['solved:d3'],
    },
    final: {
      title: 'Pedido de reabertura do inquérito', chapter: 4, unlockWhen: 'cap4_done', final: true,
      sendLabel: 'Enviar para Bruna', lockText: 'Conclua os objetivos do capítulo 4 para liberar o relatório.',
      intro: 'Relatório ao delegado de Guaraciaba do Norte, com cópia para a jornalista Bruna Leal. Cada bloco é conferido separadamente. Um relatório errado mantém o caso arquivado.',
      blocks: [
        { id: 'fa', title: 'O crime', parts: ['Quem matou Iara: ', { b: 'f.quem', cat: 'pessoa' }, '. Onde: no ', { b: 'f.onde', cat: 'lugar' }, '. Quando: às ', { b: 'f.quando', cat: 'hora' }, '. Como: durante uma briga pelo ', { b: 'f.como', cat: 'objeto' }, ', Iara caiu da pedra.'] },
        { id: 'fb', title: 'O encobrimento', parts: ['Depois da queda, o celular foi desbloqueado com o ', { b: 'f.desbloqueio', cat: 'objeto' }, ', a ', { b: 'f.apagou', cat: 'objeto' }, ' foi apagada, a mensagem falsa do ', { b: 'f.mensagem', cat: 'conceito' }, ' foi enviada e, às ', { b: 'f.hora_off', cat: 'hora' }, ', o celular foi ', { b: 'f.off', cat: 'conceito' }, '. Para ter álibi, um story com o vídeo das ', { b: 'f.video', cat: 'hora' }, ' foi postado às 23:33.'] },
        { id: 'fc', title: 'O motivo', parts: ['Iara ia entregar à jornalista ', { b: 'f.jornalista', cat: 'pessoa' }, ' as provas da pirâmide da ', { b: 'f.empresa', cat: 'conceito' }, ' e da falsa ', { b: 'f.taxa', cat: 'conceito' }, ' — inclusive o dinheiro do ', { b: 'f.familia', cat: 'pessoa' }, ' dela.'] },
        { id: 'fd', title: 'Os outros suspeitos', parts: ['@visto.por.ultimo era o ', { b: 'f.stalker', cat: 'pessoa' }, ', que estava no ', { b: 'f.lugar_rafa', cat: 'lugar' }, '. ', { b: 'f.chefe', cat: 'pessoa' }, ' comandava a pirâmide, mas estava no ', { b: 'f.lugar_caio', cat: 'lugar' }, '. O Marcos estava em ', { b: 'f.lugar_marcos', cat: 'lugar' }, ' e o Théo, em ', { b: 'f.lugar_theo', cat: 'lugar' }, '.'] },
        { id: 'fe', title: 'Anexo — quem guardava a cópia da nuvem?', bonus: true, parts: ['O backup cifrado do celular, ativo desde 03/10, foi configurado por ', { b: 'f.eco', cat: 'pessoa' }, ', a pessoa a quem ela disse "se acontecer alguma coisa, você sabe o que fazer".'] },
      ],
      onSolve: ['solved:final'],
    },
    d5: {
      title: 'Dezessete anos', chapter: 5, unlockWhen: 'final_verdade',
      blocks: [{
        id: 'd5a', title: 'O padrão',
        parts: ['Desde 1958, de ', { b: 'd5.ciclo', choice: [ch('10', 'dez'), ch('17', 'dezessete'), ch('20', 'vinte')] }, ' em igual número de anos, sempre na noite da ', { b: 'd5.festa', cat: 'conceito' },
          ', uma moça cai da ', { b: 'd5.lugar', cat: 'lugar' }, '. Em 1992 foi ', { b: 'd5.v1992', cat: 'pessoa' }, ', tia de Iara. Em 2009 foi ', { b: 'd5.v2009', cat: 'pessoa' },
          ', que subiu a trilha atrás de ', { b: 'd5.crianca', cat: 'pessoa' }, '. Desde 1975, quem acha os corpos é ', { b: 'd5.achou', cat: 'pessoa' },
          '. Todas morreram nas terras da ', { b: 'd5.familia', cat: 'pessoa' }, '.'],
      }],
      onSolve: ['solved:d5'],
    },
    d6: {
      title: 'O Caderno da Serra', chapter: 6, unlockWhen: 'cap6',
      blocks: [
        { id: 'd6a', title: 'Os quatro trechos da defesa', parts: [
          'Trecho A, "escuto a pedra": ', { b: 'd6.a', choice: [ch('dela', 'escrito por Iara'), ch('plantado', 'acrescentado depois'), ch('alterado', 'alterado depois')] },
          '. Trecho B, "a blusa verde": ', { b: 'd6.b', choice: [ch('dela', 'escrito por Iara'), ch('plantado', 'acrescentado depois'), ch('alterado', 'alterado depois')] },
          '. Trecho C, "até a beira": ', { b: 'd6.c', choice: [ch('dela', 'escrito por Iara'), ch('plantado', 'acrescentado depois'), ch('alterado', 'alterado depois')] },
          '. Trecho D, "a serra pede": ', { b: 'd6.d', choice: [ch('dela', 'escrito por Iara'), ch('plantado', 'acrescentado depois'), ch('alterado', 'alterado depois')] }, '.'] },
        { id: 'd6b', title: 'Quem mexeu', parts: [
          'A cópia da nuvem foi alterada às ', { b: 'd6.hora', cat: 'hora' }, ' do dia 12, depois da morte, num notebook em ', { b: 'd6.lugar', cat: 'lugar' },
          ', na conta do sistema de ', { b: 'd6.quem', cat: 'pessoa' }, '. A edição servia para a morte parecer ',
          { b: 'd6.tese', choice: [ch('acidente', 'acidente'), ch('suicidio', 'suicídio'), ch('crime', 'crime de outra pessoa')] }, '.'] },
      ],
      onSolve: ['solved:d6'],
    },
    final2: {
      title: 'Relatório complementar: o padrão', chapter: 7, unlockWhen: 'cap7_done', final: true,
      endings: ['serra', 'serra_parcial', 'serra_errado'], sendLabel: 'Enviar ao Ministério Público', lockText: 'Conclua os objetivos do capítulo 7 para liberar o relatório.',
      intro: 'Ao Ministério Público do Ceará, com cópia para Bruna Leal. Não para a delegacia de Guaraciaba. O primeiro bloco é o que sustenta o resto.',
      blocks: [
        { id: 'ga', title: 'A Irmandade', parts: ['Por trás da festa existe uma confraria fundada em 1941: a ', { b: 'g.irmandade', cat: 'conceito' }, ', hoje chefiada por ', { b: 'g.provedor', cat: 'pessoa' },
          '. Ela recebia ', { b: 'g.parte', choice: [ch('10', '10%'), ch('40', '40%'), ch('100', 'tudo')] }, ' de cada ', { b: 'g.taxa', cat: 'conceito' }, ' e financiou a empresa de ', { b: 'g.afilhado', cat: 'pessoa' }, '.'] },
        { id: 'gb', title: 'O padrão', parts: ['De dezessete em dezessete anos a Irmandade faz a ', { b: 'g.rito', cat: 'conceito' }, ' no alto do ', { b: 'g.lugar', cat: 'lugar' },
          '. Em 2009 morreu ', { b: 'g.v2009', cat: 'pessoa' }, '. Em 2026, ', { b: 'g.v2026', cat: 'pessoa' }, '.'] },
        { id: 'gc', title: 'O manuscrito', parts: ['Depois da morte, ', { b: 'g.editou', cat: 'pessoa' }, ' alterou o ', { b: 'g.doc', cat: 'conceito' }, ' para sustentar a tese de ', { b: 'g.tese', choice: [ch('acidente', 'acidente'), ch('suicidio', 'suicídio'), ch('loucura', 'delírio religioso')] }, '.'] },
        { id: 'gd', title: 'Anexo — o que se ouve na pedra', bonus: true, parts: ['O zumbido da gravação é ', { b: 'g.som', cat: 'conceito' }, ', produzido pela fenda da pedra com vento de ', { b: 'g.vento', cat: 'conceito' }, '.'] },
      ],
      onSolve: ['solved:final2'],
    },
  },

  // Dossiês (aba Pessoas do Quadro). Fatos aparecem quando o req fica verdadeiro.
  people: [
    { id: 'iara', name: 'Iara Fontenele', role: 'a vítima', avatar: 'assets/caso01/avatars/iara.jpg', facts: [
      { text: 'Fotógrafa e videomaker, 27 anos. Nasceu em Guaraciaba do Norte, estudou em Sobral, morava em Fortaleza.' },
      { text: 'Morreu ao cair do Mirante da Pedra Lisa, no Sítio Flor da Serra, na noite de sáb 10/10. Polícia: acidente.' },
      { text: 'Às 23:31 mandou uma mensagem para o SEU número, achando que falava com outra pessoa.', req: 'seen:papo:chat:voce' },
      { text: 'O relógio dela registrou uma queda forte às 23:41.', req: 'seen:pulso:day:2026-10-10' },
      { text: 'Às 21:55 confirmou um encontro às 23h30 com um número desconhecido.', req: 'seen:papo:chat:numero-desconhecido' },
      { text: 'Tinha reunião marcada com a jornalista Bruna Leal na segunda, 12/10, às 10h.', req: 'seen:correio:mail:bruna-0510 || seen:correio:mail:bruna-1010' },
      { text: 'Descobriu que a Colheita Capital não tinha fazenda nenhuma.', req: 'pasta_aberta' },
    ] },
    { id: 'duda', name: 'Duda (Maria Eduarda)', role: 'melhor amiga de infância', avatar: 'assets/caso01/avatars/duda.jpg', facts: [
      { text: 'Melhor amiga de Iara desde a escola. Consultora da Colheita Capital na serra.', req: 'seen:papo:chat:duda' },
      { text: 'A família dela é dona do Sítio Flor da Serra, onde foi o evento.', req: 'seen:lume:profile:dudaandrade.oficial || seen:papo:chat:equipe-evento' },
      { text: 'Em julho, brincou que sabia o PIN de Iara (o aniversário do Bento, que Iara posta todo ano).', req: 'seen:papo:chat:duda' },
      { text: 'Em 01/10, depois de uma ligação de 31 minutos, pediu "um tempo" sobre "aquilo". Iara deu até o dia 12.', req: 'seen:papo:chat:duda' },
      { text: 'Tem uma firma, MEI. Em 19/09 pagou a Iara a parte do Uber pela conta da firma.', req: 'seen:jandaia:tx:racha-bora' },
      { text: 'Visitou os pais de Iara em 14/08, o mesmo dia do Pix de R$ 30 mil.', req: 'seen:papo:chat:pai' },
      { text: 'No grupo da 4ª B, respondeu "do outro chip": o do trabalho, 99645-1209.', req: 'seen:papo:chat:turma-anchieta' },
      { text: 'Às 00:17 disse no grupo que Iara "ia direto pra casa".', req: 'seen:papo:chat:equipe-evento' },
      { text: 'Disse no grupo, às 23:55, que estava "no banheiro, fila enorme". Às 23:44 a Lari tinha avisado que o banheiro feminino estava vazio.', req: 'seen:papo:chat:equipe-evento' },
      { text: 'Na live, às 23:31, uma moça de camisa jeans e rabo de cavalo aparece perto do camarim. Às 23:43 a porta está vazia.', req: 'seen:lume:post:live-colheita && seen:galeria:photo:duda-mirante' },
      { text: 'Postou às 23:33 um story com um vídeo de banda tocando.', req: 'seen:lume:highlight:lari-noite' },
    ] },
    { id: 'rafa', name: 'Rafa Aguiar', role: 'ex-namorado', avatar: 'assets/caso01/avatars/rafa.jpg', facts: [
      { text: 'Namorou Iara de 2018 a 2023, em Sobral. Está bloqueado no celular dela.', req: 'seen:papo:chat:rafa || seen:telefone:contact:rafa' },
      { text: 'Vocalista da banda contratada para a Noite da Colheita.', req: 'seen:papo:chat:theo || seen:papo:chat:equipe-evento' },
      { text: 'Mandou SMS de números novos: "linda essa blusa verde" (20:40) e "tu ainda vai se arrepender" (22:31).', req: 'seen:sms:thread:rafa-2' },
      { text: 'Discutiu com Iara atrás do palco às 22:20.', req: 'seen:papo:chat:equipe-evento' },
      { text: 'O perfil @visto.por.ultimo tem telefone de recuperação terminado em 56 — como o número dele.', req: 'seen:lume:recovery:visto.por.ultimo' },
      { text: 'Aparece de chapéu de couro na foto do camarim das 23:35. Às 23:36 saiu "pra fumar"; voltou às 23:51 com a bota suja de barro vermelho.', req: 'seen:papo:chat:equipe-evento' },
      { text: 'Fez uma live no próprio perfil das 23:37 às 23:49, "ao vivo da van".', req: 'seen:lume:post:rafa-live-1010' },
    ] },
    { id: 'caio', name: 'Caio Montenegro', role: 'CEO da Colheita Capital', avatar: 'assets/caso01/avatars/caio.jpg', facts: [
      { text: 'Fundador da Colheita Capital: promete 4% ao mês "lastreado em contratos de safra".', req: 'seen:papo:chat:caio || seen:lume:profile:colheitacapital' },
      { text: 'Mandou R$ 20 mil de "bônus" para Iara. Ela devolveu no mesmo dia.', req: 'seen:jandaia:tx:devolucao-2509' },
      { text: 'Lembrou Iara do termo de confidencialidade (08/10).', req: 'seen:papo:chat:caio' },
      { text: '21:15: "Depois do discurso, precisamos conversar. Sem drama."', req: 'seen:papo:chat:caio' },
      { text: 'Fez o discurso ao vivo das 23:30 às 23:52.', req: 'seen:lume:post:live-colheita' },
    ] },
    { id: 'bruna', name: 'Bruna Leal', role: 'jornalista do O Farol', avatar: 'assets/caso01/avatars/bruna.jpg', facts: [
      { text: 'Repórter investigativa. Só falava com Iara por e-mail.', req: 'seen:correio:mail:bruna-1809 || seen:correio:mail:bruna-2209' },
      { text: 'Telefone na assinatura: (85) 98812-4471.', req: 'seen:correio:mail:bruna-1010' },
    ] },
    { id: 'numero', name: '(88) 99645-1209', role: 'número desconhecido', avatar: '', facts: [
      { text: 'Mandou 3 mensagens entre 21:47 e 21:52. Todas apagadas às 23:45.', req: 'seen:papo:chat:numero-desconhecido' },
      { text: 'Iara respondeu: "ok. 23h30".', req: 'seen:papo:chat:numero-desconhecido' },
      { text: 'É o número que cobrava a "taxa de garantia" das famílias, segundo a planilha de Iara.', req: 'seen:arquivos:file:taxas-garantia' },
      { text: 'Alguém o salvou como "Duda trabalho".', req: 'seen:papo:chat:turma-anchieta' },
      { text: 'Conteúdo recuperado: "No mirante às 23h30, na hora do discurso. Só nós duas. Por favor 🙏".', req: 'seen:config:notif-history' },
    ] },
    { id: 'ademar', name: 'Ademar Sampaio Andrade', role: 'pai de Duda, dono do sítio', avatar: '', facts: [
      { text: 'Pai de Duda. Dono do Sítio Flor da Serra.', req: 'seen:telefone:voicemail:vm-ademar' },
      { text: '09/10, 21:14: "A serra não gosta de quem cava."', req: 'seen:telefone:voicemail:vm-ademar' },
      { text: 'Irmão de Rosângela Sampaio, morta na Pedra Lisa em 2009.', req: 'seen:arquivos:file:recortes-pedra' },
      { text: 'O usuário "ademar.sa" editou o manuscrito de Iara em 12/10, às 03:17.', req: 'seen:correio:mail:nuvem-edicao' },
      { text: 'Preside a Associação Beneficente Nossa Senhora da Colheita, que recebia 40% de cada taxa.', req: 'seen:arquivos:file:repasses-associacao' },
      { text: 'Provedor da Irmandade da Colheita, por herança do avô, o Cel. Firmino Sampaio.', req: 'seen:arquivos:file:estatuto-1941' },
    ] },
    { id: 'pedra', name: 'As moças da Pedra Lisa', role: '1958 · 1975 · 1992 · 2009', avatar: '', facts: [
      { text: '1958: Joana Batista, 18 anos, filha de morador.', req: 'seen:arquivos:file:recortes-pedra' },
      { text: '1975: Francisca "Chica" Bezerra, 17 anos, ajudante de cozinha. Achada pelo caseiro José Ribamar.', req: 'seen:arquivos:file:recortes-pedra' },
      { text: '1992: Antônia Fontenele, 21 anos, tia de Iara.', req: 'seen:arquivos:file:recortes-pedra' },
      { text: '2009: Rosângela Sampaio, 19 anos, tia de Duda. Subiu atrás de uma criança: Iara, 10 anos.', req: 'seen:arquivos:file:recortes-pedra' },
      { text: 'Na foto de 2009, uma roda de luzes no alto da pedra.', req: 'seen:galeria:photo:festa-2009' },
    ] },
  ],

  // Linha do tempo automática (aba do Quadro)
  timeline: [
    { at: '2026-10-10T18:14', text: 'Iara fotografa o pôr do sol na Pedra Lisa (cerca quebrada num trecho).', req: 'seen:rotas:day:2026-10-10' },
    { at: '2026-10-10T20:40', text: 'SMS de número desconhecido: "linda essa blusa verde".', req: 'seen:sms:thread:rafa-2' },
    { at: '2026-10-10T21:15', text: 'Caio: "Depois do discurso, precisamos conversar."', req: 'seen:papo:chat:caio' },
    { at: '2026-10-10T21:47', text: '(88) 99645-1209 manda 3 mensagens (depois apagadas).', req: 'seen:papo:chat:numero-desconhecido' },
    { at: '2026-10-10T21:55', text: 'Iara confirma: "ok. 23h30".', req: 'seen:papo:chat:numero-desconhecido' },
    { at: '2026-10-10T22:20', text: 'Discussão entre Iara e Rafa atrás do palco.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T22:51', text: 'Duda manda no grupo um vídeo da banda tocando.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:25', text: 'A banda para para o discurso.', req: 'seen:arquivos:file:roteiro' },
    { at: '2026-10-10T23:29', text: 'Iara sai do galpão a pé em direção ao mirante.', req: 'seen:rotas:day:2026-10-10' },
    { at: '2026-10-10T23:30', text: 'Começa o discurso de Caio, ao vivo no Instagram.', req: 'seen:lume:post:live-colheita' },
    { at: '2026-10-10T23:31', text: 'Iara manda a mensagem para o seu número.', req: 'seen:papo:chat:voce' },
    { at: '2026-10-10T23:33', text: 'Duda posta um story com a banda tocando.', req: 'seen:lume:highlight:lari-noite' },
    { at: '2026-10-10T23:15', text: 'Seu Zé sobe a trilha do mirante com uma lanterna.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:27', text: 'Seu Zé avisa Iara: amarrou a fita de perigo na cerca e está voltando.', req: 'seen:papo:chat:ze' },
    { at: '2026-10-10T23:33', text: 'Marcos larga a câmera da live e vai buscar gelo. Igor assume.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:35', text: 'Lari manda foto da banda no camarim (Rafa ainda lá).', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:36', text: 'Rafa sai do camarim "pra fumar".', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:37', text: 'Rafa começa uma live "ao vivo da van" (até 23:49).', req: 'seen:lume:post:rafa-live-1010' },
    { at: '2026-10-10T23:38', text: 'Théo acessa a cópia do celular de Iara, de Fortaleza.', req: 'seen:correio:mail:espelho-1010a' },
    { at: '2026-10-10T23:40:12', text: 'A live da Colheita cai por 40 segundos.', req: 'seen:lume:post:live-colheita' },
    { at: '2026-10-10T23:42:20', text: 'Na live, Caio agradece ao Seu Zé pela lanterna.', req: 'seen:lume:post:live-colheita' },
    { at: '2026-10-10T23:44', text: 'Lari avisa no grupo: o banheiro feminino está vazio.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:51', text: 'Rafa volta com a bota suja de barro vermelho.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-11T00:04:12', text: 'Nota fiscal do gelo, Mercadinho São José, centro de Guaraciaba.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-11T06:12', text: 'Théo acessa a cópia do celular de Iara, já em Guaraciaba do Norte.', req: 'seen:correio:mail:espelho-1110' },
    { at: '2026-10-10T23:41', text: 'Relógio de Iara: queda forte detectada.', req: 'seen:pulso:day:2026-10-10' },
    { at: '2026-10-10T23:43', text: 'Celular desbloqueado com PIN.', req: 'seen:config:unlock-log' },
    { at: '2026-10-10T23:44', text: 'Gravação das 23:32 apagada.', req: 'seen:gravador:rec:g-2332' },
    { at: '2026-10-10T23:45', text: 'As mensagens de (88) 99645-1209 são apagadas para todos.', req: 'seen:papo:chat:numero-desconhecido' },
    { at: '2026-10-10T23:46', text: '"Fui no mirante fazer uns timelapse. Já volto." — enviada do celular de Iara.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:47', text: 'Última conexão. Celular desligado pelo botão (41% de bateria).', req: 'seen:rotas:last' },
    { at: '2026-10-11T00:17', text: 'Duda: "Ela me disse que ia direto pra casa depois".', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-11T06:20', text: 'O caseiro encontra o corpo no pé da encosta.' },
    { at: '2009-10-10T23:52', text: 'A última foto da Pipoca: luzes em roda no alto da pedra.', req: 'seen:galeria:photo:festa-2009' },
    { at: '2026-10-09T21:14', text: 'Recado de voz de Ademar: "A serra não gosta de quem cava."', req: 'seen:telefone:voicemail:vm-ademar' },
    { at: '2026-10-12T03:17', text: 'O manuscrito de Iara é editado na nuvem, de um notebook em Guaraciaba (ademar.sa).', req: 'seen:correio:mail:nuvem-edicao' },
    { at: '2026-10-10T23:47:31', text: 'Uma foto é registrada 29 segundos depois de o aparelho ser desligado.', req: 'seen:galeria:photo:ultima-2347' },
  ],
};
