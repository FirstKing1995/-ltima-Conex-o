// Capítulos, objetivos, deduções, dossiês e linha do tempo do Caso 01.
// Lacuna de termo: { b:'id', cat:'hora' }   Lacuna de escolha: { b:'id', choice:[{id,label}] }
// Respostas ficam em answers.js (hash). Flags especiais: intro_done, phone_unlocked, cap1..cap4, cap4_done, solved:<id>.

const ch = (id, label) => ({ id, label });

export default {
  chapters: [
    {
      n: 0, title: 'Prólogo', subtitle: 'Mensagem errada', startWhen: 'intro_done',
      objectives: [
        { id: '0.1', text: 'Desbloqueie o celular de Iara.', doneWhen: 'phone_unlocked' },
      ],
      completeWhen: 'phone_unlocked', onComplete: ['cap1'],
    },
    {
      n: 1, title: 'Capítulo 1', subtitle: 'A última noite', startWhen: 'cap1',
      objectives: [
        { id: '1.1', text: 'Leia a última mensagem que Iara mandou no grupo do evento.', doneWhen: 'seen:papo:chat:equipe-evento' },
        { id: '1.2', text: 'Descubra onde o celular perdeu a conexão.', doneWhen: 'seen:rotas:last' },
        { id: '1.3', text: 'Veja o que o relógio dela registrou naquela noite.', doneWhen: 'seen:pulso:day:2026-10-10' },
        { id: '1.4', text: 'Encontre a mensagem que ela mandou pra você.', doneWhen: 'seen:papo:chat:voce' },
      ],
      deduction: 'd1', completeWhen: 'solved:d1', onComplete: ['cap2'],
    },
    {
      n: 2, title: 'Capítulo 2', subtitle: 'Quem estava lá', startWhen: 'cap2',
      objectives: [
        { id: '2.1', text: 'Descubra quem está por trás do perfil @visto.por.ultimo.', doneWhen: 'seen:lume:recovery:visto.por.ultimo' },
        { id: '2.2', text: 'Entenda o que aconteceu entre Iara e Rafa naquela noite.', doneWhen: 'seen:sms:thread:rafa-2 && seen:papo:chat:theo' },
        { id: '2.3', text: 'Descubra o que Caio queria com ela.', doneWhen: 'seen:papo:chat:caio && seen:jandaia:tx:devolucao-2509' },
        { id: '2.4', text: 'Descubra onde Rafa e Caio estavam às 23:41.', doneWhen: 'seen:lume:post:live-colheita && seen:papo:chat:equipe-evento' },
      ],
      deduction: 'd2', completeWhen: 'solved:d2', onComplete: ['cap3'],
    },
    {
      n: 3, title: 'Capítulo 3', subtitle: 'A colheita', startWhen: 'cap3',
      objectives: [
        { id: '3.1', text: 'Descubra para quem era a mensagem das 23:31.', doneWhen: 'seen:correio:mail:bruna-1010' },
        { id: '3.2', text: 'Abra a Pasta Segura.', doneWhen: 'pasta_aberta' },
        { id: '3.3', text: 'Siga o dinheiro do pai dela.', doneWhen: 'seen:papo:chat:pai && seen:arquivos:file:taxas-garantia' },
        { id: '3.4', text: 'Descubra de quem é o número (88) 99645-1209.', doneWhen: 'seen:telefone:contact:duda && seen:papo:chat:numero-desconhecido' },
      ],
      deduction: 'd3', completeWhen: 'solved:d3', onComplete: ['cap4'],
    },
    {
      n: 4, title: 'Capítulo 4', subtitle: 'Última conexão', startWhen: 'cap4',
      objectives: [
        { id: '4.1', text: 'Confira o álibi de Duda.', doneWhen: 'seen:lume:highlight:lari-noite && seen:lume:post:live-colheita' },
        { id: '4.2', text: 'Recupere o que foi apagado às 23:45.', doneWhen: 'seen:config:notif-history' },
        { id: '4.3', text: 'Descubra como usaram o celular dela depois da queda.', doneWhen: 'seen:config:unlock-log && seen:config:battery' },
        { id: '4.4', text: 'Encontre a gravação.', doneWhen: 'seen:gravador:rec:g-2332' },
      ],
      allDoneFlag: 'cap4_done',
      deduction: 'final', completeWhen: 'solved:final', onComplete: ['final_done'],
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
      title: 'Quem estava lá?', chapter: 2, unlockWhen: 'cap2',
      blocks: [{
        id: 'd2a', title: 'Os suspeitos óbvios',
        parts: ['O perfil @visto.por.ultimo era do ', { b: 'd2.perfil', cat: 'pessoa' }, '. Às 23:41 ele estava no ', { b: 'd2.lugar_rafa', cat: 'lugar' },
          '. ', { b: 'd2.live', cat: 'pessoa' }, ' fazia o discurso ao vivo no ', { b: 'd2.lugar_caio', cat: 'lugar' }, '. Nenhum dos dois ',
          { b: 'd2.estavam', choice: [ch('estava', 'estava'), ch('naoestava', 'não estava')] }, ' no mirante. Mas, às 21:55, Iara tinha confirmado um encontro às 23h30 com o número ',
          { b: 'd2.numero', cat: 'numero' }, '.'],
      }],
      onSolve: ['solved:d2'],
    },
    d3: {
      title: 'Por que Iara?', chapter: 3, unlockWhen: 'cap3',
      blocks: [{
        id: 'd3a', title: 'O motivo',
        parts: ['A mensagem das 23:31 era para a jornalista ', { b: 'd3.jornalista', cat: 'pessoa' }, '. Iara ia provar que a ', { b: 'd3.empresa', cat: 'conceito' },
          ' era uma ', { b: 'd3.esquema', cat: 'conceito' }, ' comandada por ', { b: 'd3.chefe', cat: 'pessoa' }, '. E descobriu que ', { b: 'd3.desvio', cat: 'pessoa' },
          ' cobrava uma falsa ', { b: 'd3.taxa', cat: 'conceito' }, ' — inclusive R$ 30 mil do ', { b: 'd3.familia', cat: 'pessoa' }, ' de Iara. O número que marcou o encontro no mirante era de ',
          { b: 'd3.dono', cat: 'pessoa' }, '.'],
      }],
      onSolve: ['solved:d3'],
    },
    final: {
      title: 'Relatório para Bruna', chapter: 4, unlockWhen: 'cap4_done', final: true,
      intro: 'Iara mandou a última mensagem para o número errado. Agora é você quem entrega tudo para a pessoa certa. Preencha o relatório; cada bloco é conferido separadamente.',
      blocks: [
        { id: 'fa', title: 'O crime', parts: ['Quem matou Iara: ', { b: 'f.quem', cat: 'pessoa' }, '. Onde: no ', { b: 'f.onde', cat: 'lugar' }, '. Quando: às ', { b: 'f.quando', cat: 'hora' }, '. Como: durante uma briga pelo ', { b: 'f.como', cat: 'objeto' }, ', Iara caiu da pedra.'] },
        { id: 'fb', title: 'O encobrimento', parts: ['Depois da queda, o celular foi desbloqueado com o ', { b: 'f.desbloqueio', cat: 'objeto' }, ', a ', { b: 'f.apagou', cat: 'objeto' }, ' foi apagada, a mensagem falsa do ', { b: 'f.mensagem', cat: 'conceito' }, ' foi enviada e, às ', { b: 'f.hora_off', cat: 'hora' }, ', o celular foi ', { b: 'f.off', cat: 'conceito' }, '. Para ter álibi, um story com o vídeo das ', { b: 'f.video', cat: 'hora' }, ' foi postado às 23:33.'] },
        { id: 'fc', title: 'O motivo', parts: ['Iara ia entregar à jornalista ', { b: 'f.jornalista', cat: 'pessoa' }, ' as provas da pirâmide da ', { b: 'f.empresa', cat: 'conceito' }, ' e da falsa ', { b: 'f.taxa', cat: 'conceito' }, ' — inclusive o dinheiro do ', { b: 'f.familia', cat: 'pessoa' }, ' dela.'] },
        { id: 'fd', title: 'Os outros suspeitos', parts: ['@visto.por.ultimo era o ', { b: 'f.stalker', cat: 'pessoa' }, ', que estava no ', { b: 'f.lugar_rafa', cat: 'lugar' }, '. ', { b: 'f.chefe', cat: 'pessoa' }, ' comandava a pirâmide, mas estava no ', { b: 'f.lugar_caio', cat: 'lugar' }, '.'] },
        { id: 'fe', title: 'Bônus — quem é o ECO?', bonus: true, parts: ['O ECO é ', { b: 'f.eco', cat: 'pessoa' }, '.'] },
      ],
      onSolve: ['solved:final'],
    },
  },

  // Dossiês (aba Pessoas do Quadro). Fatos aparecem quando o req fica verdadeiro.
  people: [
    { id: 'iara', name: 'Iara Fontenele', role: 'a vítima', avatar: 'assets/caso01/avatars/iara.svg', facts: [
      { text: 'Fotógrafa e videomaker, 27 anos. Nasceu em Guaraciaba do Norte, estudou em Sobral, morava em Fortaleza.' },
      { text: 'Morreu ao cair do Mirante da Pedra Lisa, no Sítio Flor da Serra, na noite de sáb 10/10. Polícia: acidente.' },
      { text: 'Às 23:31 mandou uma mensagem para o SEU número, achando que falava com outra pessoa.', req: 'seen:papo:chat:voce' },
      { text: 'O relógio dela registrou uma queda forte às 23:41.', req: 'seen:pulso:day:2026-10-10' },
      { text: 'Às 21:55 confirmou um encontro às 23h30 com um número desconhecido.', req: 'seen:papo:chat:numero-desconhecido' },
      { text: 'Tinha reunião marcada com a jornalista Bruna Leal na segunda, 12/10, às 10h.', req: 'seen:correio:mail:bruna-0510 || seen:correio:mail:bruna-1010' },
      { text: 'Descobriu que a Colheita Capital não tinha fazenda nenhuma.', req: 'pasta_aberta' },
    ] },
    { id: 'duda', name: 'Duda (Maria Eduarda)', role: 'melhor amiga de infância', avatar: 'assets/caso01/avatars/duda.svg', facts: [
      { text: 'Melhor amiga de Iara desde a escola. Consultora da Colheita Capital na serra.', req: 'seen:papo:chat:duda' },
      { text: 'A família dela é dona do Sítio Flor da Serra, onde foi o evento.', req: 'seen:lume:profile:dudaandrade.oficial || seen:papo:chat:equipe-evento' },
      { text: 'Em julho, brincou que sabia o PIN de Iara (o aniversário do Bento).', req: 'seen:papo:chat:duda' },
      { text: 'Depois de 01/10 implorou "um tempo" a Iara. Iara respondeu: "dia 12".', req: 'seen:papo:chat:duda' },
      { text: 'O nome dela aparece no comprovante de R$ 30 mil pago pelo pai de Iara como "taxa de garantia".', req: 'seen:papo:chat:pai' },
      { text: 'Às 00:17 disse no grupo que Iara "ia direto pra casa".', req: 'seen:papo:chat:equipe-evento' },
      { text: 'Na live, às 23:38, Caio pergunta no microfone: "Cadê a Duda? Sumiu!"', req: 'seen:lume:post:live-colheita' },
      { text: 'Postou às 23:33 um story com um vídeo de banda tocando.', req: 'seen:lume:highlight:lari-noite' },
    ] },
    { id: 'rafa', name: 'Rafa Aguiar', role: 'ex-namorado', avatar: 'assets/caso01/avatars/rafa.svg', facts: [
      { text: 'Namorou Iara de 2018 a 2023, em Sobral. Está bloqueado no celular dela.', req: 'seen:papo:chat:rafa || seen:telefone:contact:rafa' },
      { text: 'Vocalista da banda contratada para a Noite da Colheita.', req: 'seen:papo:chat:theo || seen:papo:chat:equipe-evento' },
      { text: 'Mandou SMS de números novos: "linda essa blusa verde" (20:40) e "tu ainda vai se arrepender" (22:31).', req: 'seen:sms:thread:rafa-2' },
      { text: 'Discutiu com Iara atrás do palco às 22:20.', req: 'seen:papo:chat:equipe-evento' },
      { text: 'O perfil @visto.por.ultimo tem telefone de recuperação terminado em 56 — como o número dele.', req: 'seen:lume:recovery:visto.por.ultimo' },
      { text: 'Aparece de chapéu de couro na foto do camarim das 23:39.', req: 'seen:papo:chat:equipe-evento' },
    ] },
    { id: 'caio', name: 'Caio Montenegro', role: 'CEO da Colheita Capital', avatar: 'assets/caso01/avatars/caio.svg', facts: [
      { text: 'Fundador da Colheita Capital: promete 4% ao mês "lastreado em contratos de safra".', req: 'seen:papo:chat:caio || seen:lume:profile:colheitacapital' },
      { text: 'Mandou R$ 20 mil de "bônus" para Iara. Ela devolveu no mesmo dia.', req: 'seen:jandaia:tx:devolucao-2509' },
      { text: 'Lembrou Iara do termo de confidencialidade (08/10).', req: 'seen:papo:chat:caio' },
      { text: '21:15: "Depois do discurso, precisamos conversar. Sem drama."', req: 'seen:papo:chat:caio' },
      { text: 'Fez o discurso ao vivo das 23:30 às 23:52.', req: 'seen:lume:post:live-colheita' },
    ] },
    { id: 'bruna', name: 'Bruna Leal', role: 'jornalista do O Farol', avatar: 'assets/caso01/avatars/bruna.svg', facts: [
      { text: 'Repórter investigativa. Só falava com Iara por e-mail.', req: 'seen:correio:mail:bruna-1809 || seen:correio:mail:bruna-2209' },
      { text: 'Telefone na assinatura: (85) 98812-4471.', req: 'seen:correio:mail:bruna-1010' },
    ] },
    { id: 'numero', name: '(88) 99645-1209', role: 'número desconhecido', avatar: '', facts: [
      { text: 'Mandou 3 mensagens entre 21:47 e 21:52. Todas apagadas às 23:45.', req: 'seen:papo:chat:numero-desconhecido' },
      { text: 'Iara respondeu: "ok. 23h30".', req: 'seen:papo:chat:numero-desconhecido' },
      { text: 'É a chave Pix que recebeu os R$ 30 mil do pai de Iara.', req: 'seen:papo:chat:pai && seen:papo:chat:numero-desconhecido' },
      { text: 'Conteúdo recuperado: "No mirante às 23h30, na hora do discurso. Só nós duas. Por favor 🙏".', req: 'seen:config:notif-history' },
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
    { at: '2026-10-10T23:30', text: 'Começa o discurso de Caio, ao vivo no Lume.', req: 'seen:lume:post:live-colheita' },
    { at: '2026-10-10T23:31', text: 'Iara manda a mensagem para o seu número.', req: 'seen:papo:chat:voce' },
    { at: '2026-10-10T23:33', text: 'Duda posta um story com a banda tocando.', req: 'seen:lume:highlight:lari-noite' },
    { at: '2026-10-10T23:38', text: 'Na live: "Cadê a Duda? Sumiu!"', req: 'seen:lume:post:live-colheita' },
    { at: '2026-10-10T23:40', text: 'Lari manda foto da banda no camarim.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:41', text: 'Relógio de Iara: queda forte detectada.', req: 'seen:pulso:day:2026-10-10' },
    { at: '2026-10-10T23:43', text: 'Celular desbloqueado com PIN.', req: 'seen:config:unlock-log' },
    { at: '2026-10-10T23:44', text: 'Gravação das 23:32 apagada.', req: 'seen:gravador:rec:g-2332' },
    { at: '2026-10-10T23:45', text: 'As mensagens de (88) 99645-1209 são apagadas para todos.', req: 'seen:papo:chat:numero-desconhecido' },
    { at: '2026-10-10T23:46', text: '"Fui no mirante fazer uns timelapse. Já volto." — enviada do celular de Iara.', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-10T23:47', text: 'Última conexão. Celular desligado pelo botão (41% de bateria).', req: 'seen:rotas:last' },
    { at: '2026-10-11T00:17', text: 'Duda: "Ela me disse que ia direto pra casa depois".', req: 'seen:papo:chat:equipe-evento' },
    { at: '2026-10-11T06:20', text: 'O caseiro encontra o corpo no pé da encosta.' },
  ],
};
