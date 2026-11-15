// Caderno de investigação: o que o próprio investigador anota ao encontrar coisas.
// Regra: anotar o que se viu, nunca concluir pelo jogador. Frases curtas. Primeira pessoa.
// msgs: texto | { think:true, text } (reflexão) | { doc:true, title, lines:[] } (documento) | { chapter:true, text }

export default {
  nodes: {
    /* ---------- abertura ---------- */
    'abertura': {
      msgs: [
        { chapter: true, text: 'Prólogo · Mensagem errada' },
        { doc: true, title: 'Auto de apreensão · IP 0417/2026', lines: [
          'Local: Sítio Flor da Serra, zona rural de Guaraciaba do Norte/CE. Base da encosta do Mirante da Pedra Lisa.',
          'Data e hora do encontro do corpo: 11/10/2026, 06:20. Comunicante: José Ribamar (Seu Zé), caseiro.',
          'Itens junto à vítima: 1 relógio Pulso Band 4, pulseira partida. 1 brinco de argola (o par não foi localizado).',
          'Itens no alto da pedra, a cerca de 3 m da borda: 1 celular Nimbus N9, desligado, tela intacta.',
          'Itens na bolsa da vítima (recolhida no galpão do evento): carteira com RG, cartão do banco Jandaia, R$ 42,00 e uma foto 3x4 de um cachorro caramelo. No verso, à caneta: "Bento ♥ 22.03".',
          'Não foram encontrados câmera fotográfica nem tripé com a vítima.',
          'Conclusão do plantão: queda acidental. Trecho da cerca de proteção danificado.',
        ] },
        { doc: true, title: 'Termo de declaração · Maria do Socorro Fontenele (mãe)', lines: [
          '"A Iara não caía. Ela subia naquela pedra desde os oito anos."',
          '"O celular dela tinha senha, eu não sei qual é. Ela dizia que botava em tudo a mesma coisa: o aniversário do menino dela. O menino dela é o cachorro, doutor."',
          '"Ela andava com medo de alguma coisa. Não quis me dizer de quê. Disse que na segunda ia resolver tudo."',
        ] },
        'O aparelho está sobre a mesa, em modo avião. Bloqueado. A tela acende às 23:47 do sábado e para ali.',
        { think: true, text: 'Quatro dígitos. A mãe me deu metade da resposta. A outra metade está em algum lugar daquela papelada.' },
      ],
    },
    'pin-3': { msgs: [{ think: true, text: 'Não é o ano. É dia e mês. Volto ao auto de apreensão: o que estava escrito no verso da foto?' }] },

    /* ---------- capítulo 1 ---------- */
    'desbloqueio': {
      msgs: [
        'Entrei. 23:47 de sábado, bateria em 41%. Quatro notificações esperando na tela de bloqueio.',
        'Regra de sempre: começar pelo fim. O que saiu deste aparelho por último?',
        { chapter: true, text: 'Capítulo 1 · A última noite' },
      ],
    },
    'v-grupo': { msgs: ['Grupo do evento. 23:46, do celular dela: "Fui no mirante fazer uns timelapse. Já volto."', 'Timelapse pede câmera parada por meia hora. Pede tripé.'] },
    'v-voce': { msgs: ['A conversa com o meu número. Uma mensagem só, 23:31. Eu nunca fui salvo nos contatos dela.', '"Vou gravar tudo." Gravar com o quê?'] },
    'v-pulso': { msgs: ['O relógio registrou "queda forte" às 23:41. Depois disso, o pulso não registra mais nada.'] },
    'v-last': { msgs: ['Último ponto do aparelho: o mirante, 23:47. Precisão de doze metros.'] },
    'd1-pronta': { msgs: [{ think: true, text: 'Tenho horários suficientes para pôr a noite em ordem. A dedução está no Quadro.' }] },
    'd1-ok': {
      msgs: [
        'Se a queda foi às 23:41, a mensagem das 23:46 não foi escrita por ela.',
        'Alguém estava com este aparelho na mão, em cima da pedra, cinco minutos depois.',
        { think: true, text: 'Acidente não escreve mensagem. Reabro mentalmente o caso. Primeiro, os nomes óbvios.' },
        { chapter: true, text: 'Capítulo 2 · Quem estava lá' },
      ],
    },

    /* ---------- capítulo 2 ---------- */
    'v-rafa-sms': { msgs: ['SMS de número desconhecido às 20:40: "linda essa blusa verde". Às 22:31: "tu ainda vai se arrepender."', 'Quem escreveu isso estava perto o bastante para ver a roupa dela.'] },
    'v-perfil': { msgs: ['@visto.por.ultimo. Telefone de recuperação terminado em 56.'] },
    'v-caio': { msgs: ['25/09, 10:12: R$ 20.000 entram como "bônus". 10:40: devolvidos. Vinte e oito minutos.'] },
    'v-live': { msgs: ['A live do discurso tem relógio próprio. Cada fala, um horário.'] },
    'd2-ok': {
      msgs: [
        'Os dois homens têm testemunhas: um no camarim, outro no palco, com uma câmera ao vivo apontada para ele.',
        'Mas às 21:55 ela respondeu "ok. 23h30" para um número que nunca salvou. As mensagens desse número sumiram às 23:45.',
        { think: true, text: 'Quem apaga a conversa de uma mulher morta sabe exatamente o que estava escrito nela.' },
        { chapter: true, text: 'Capítulo 3 · A colheita' },
      ],
    },

    /* ---------- capítulo 3 ---------- */
    'v-bruna': { msgs: ['Assinatura da jornalista: (85) 98812-4471.', 'O meu número termina em 4417.'] },
    'v-segura': { msgs: ['Pasta Segura. Trancada. A dica de senha, escrita por ela: "meu primeiro amor + o ano em que tudo começou".'] },
    'v-segura-ok': { msgs: ['Abri. Um LEIA-ME no topo, endereçado a quem abrisse.'] },
    'v-pai': { msgs: ['O pai dela pagou R$ 30.000 de "taxa de garantia". O comprovante tem nome e chave.'] },
    'v-numero': { msgs: ['O (88) 99645-1209 não está salvo em lugar nenhum. Mas gente organizada anota o que não salva.'] },
    'd3-ok': {
      msgs: [
        'A chave do Pix, o chip, o encontro no mirante: o mesmo nome.',
        'E ela tem um álibi. Story postado às 23:33, do meio do show.',
        { think: true, text: 'Um álibi bom demais merece a mesma desconfiança que nenhum álibi.' },
        { chapter: true, text: 'Capítulo 4 · Última conexão' },
      ],
      actions: [{ type: 'notify', icon: 'shield-alert', title: 'Correio · agora', text: 'Nova tentativa de acesso à sua conta — Guaraciaba do Norte, CE' }],
    },
    'v-alerta': { msgs: ['Alerta no e-mail dela, agora: alguém tentou entrar na conta. De Guaraciaba do Norte.', 'Alguém além de mim quer o que sobrou deste aparelho.'] },

    /* ---------- capítulo 4 ---------- */
    'v-story': { msgs: ['O story das 23:33 mostra a banda tocando.'] },
    'v-notif': { msgs: ['O sistema guarda o que passou pela tela, mesmo depois de apagado. 21:47, 21:50, 21:52.'] },
    'v-desb': { msgs: ['23:42, duas digitais recusadas. 23:43, entraram pelo PIN. 23:47, desligado no botão com 41%.'] },
    'v-grav': { msgs: ['Lixeira do gravador. Um arquivo das 23:32. Nove minutos e cinquenta e dois segundos.', 'Ouvi até o fim.'] },
    'final-pronto': {
      msgs: [
        'Tenho o suficiente para pedir a reabertura do inquérito.',
        { think: true, text: 'O relatório vai para o delegado e para a única pessoa que ela queria que soubesse: a jornalista. Desta vez, para o número certo.' },
      ],
    },
  },

  triggers: [
    { id: 't-abertura', when: 'intro_done', node: 'abertura' },
    { id: 't-pin3', when: 'pin_falhou_3 && !phone_unlocked', node: 'pin-3' },
    { id: 't-unlock', when: 'phone_unlocked', node: 'desbloqueio' },
    { id: 't-grupo', when: 'seen:papo:chat:equipe-evento', node: 'v-grupo' },
    { id: 't-voce', when: 'seen:papo:chat:voce', node: 'v-voce' },
    { id: 't-pulso', when: 'seen:pulso:day:2026-10-10', node: 'v-pulso' },
    { id: 't-last', when: 'seen:rotas:last', node: 'v-last' },
    { id: 't-d1p', when: 'objectives_done:1 && !solved:d1', node: 'd1-pronta' },
    { id: 't-d1', when: 'solved:d1', node: 'd1-ok' },
    { id: 't-rafa', when: 'cap2 && seen:sms:thread:rafa-2', node: 'v-rafa-sms' },
    { id: 't-perfil', when: 'seen:lume:recovery:visto.por.ultimo', node: 'v-perfil' },
    { id: 't-caio', when: 'seen:jandaia:tx:devolucao-2509', node: 'v-caio' },
    { id: 't-live', when: 'cap2 && seen:lume:post:live-colheita', node: 'v-live' },
    { id: 't-d2', when: 'solved:d2', node: 'd2-ok' },
    { id: 't-bruna', when: 'seen:correio:mail:bruna-1010', node: 'v-bruna' },
    { id: 't-segura', when: 'cap3 && seen:galeria:album:segura && !pasta_aberta', node: 'v-segura' },
    { id: 't-segura-ok', when: 'pasta_aberta', node: 'v-segura-ok' },
    { id: 't-pai', when: 'cap3 && seen:papo:chat:pai', node: 'v-pai' },
    { id: 't-numero', when: 'cap3 && seen:papo:chat:numero-desconhecido', node: 'v-numero' },
    { id: 't-d3', when: 'solved:d3', node: 'd3-ok' },
    { id: 't-alerta', when: 'solved:d3 && seen:correio:mail:seguranca-login', node: 'v-alerta' },
    { id: 't-story', when: 'cap4 && seen:lume:highlight:lari-noite', node: 'v-story' },
    { id: 't-notif', when: 'cap4 && seen:config:notif-history', node: 'v-notif' },
    { id: 't-desb', when: 'cap4 && seen:config:unlock-log && seen:config:battery', node: 'v-desb' },
    { id: 't-grav', when: 'seen:gravador:rec:g-2332', node: 'v-grav' },
    { id: 't-final', when: 'cap4_done', node: 'final-pronto' },
  ],

  // "Repensar o caso": três níveis, do mais vago ao quase explícito. Sempre na voz do investigador.
  hints: {
    '0.1': ['A mãe disse que ela usava o aniversário do Bento em tudo. Quem é o Bento eu já sei.', 'O auto de apreensão lista o que havia na carteira dela. Uma foto, com algo escrito no verso.', '"Bento ♥ 22.03". Dia e mês. Quatro dígitos.'],
    '1.1': ['O último rastro costuma estar onde ela mais falava com as pessoas.', 'O mensageiro dela tem um grupo com o nome da festa.', 'Papo, grupo da Noite da Colheita, até o fim.'],
    '1.2': ['Celulares lembram por onde andaram, mesmo quando o dono esquece.', 'O app de mapas guarda a linha do tempo dela.', 'Rotas, o ponto marcado como última conexão.'],
    '1.3': ['Ela usava alguma coisa no pulso que media o corpo dela.', 'O app do relógio separa os registros por dia.', 'Pulso, sábado 10/10, eventos do fim da noite.'],
    '1.4': ['Eu não estou salvo nos contatos dela. Vou aparecer como um número.', 'No mensageiro, uma conversa sem nome, só com um número que eu conheço bem.', 'Papo, a conversa com +55 85 98812-4417.'],
    'ded:d1': ['A ordem das coisas pesa mais do que as coisas.', 'Comparar a hora da queda com a hora da mensagem do grupo. E lembrar do que o timelapse exige.', 'Saiu 23:29, caiu 23:41, mensagem 23:46. O tripé ficou no galpão.'],
    '2.1': ['Perfis anônimos ainda precisam de um jeito de recuperar a senha.', 'No perfil de @visto.por.ultimo deve haver a opção de recuperar a conta.', 'Lume, @visto.por.ultimo, menu, "Esqueci a senha". Comparar o final do telefone com os contatos.'],
    '2.2': ['Ex-namorados bloqueados costumam voltar por outra porta.', 'As mensagens de texto comuns. E com quem ela desabafava naquela noite.', 'Mensagens, o número da blusa verde. Depois o Théo no Papo.'],
    '2.3': ['Dinheiro deixa rastro mais limpo que palavra.', 'A conversa com o Caio e o extrato de setembro.', 'Papo com o Caio. Jandaia, 25/09, a devolução.'],
    '2.4': ['Às 23:41 todo mundo estava em algum lugar que alguém viu.', 'O discurso foi transmitido. E alguém fotografou o camarim.', 'Lume, a live (23:30 a 23:52). Papo, a foto do camarim das 23:40.'],
    'ded:d2': ['Cada nome tem um álibi com relógio.', 'O telefone de recuperação, a live, a foto do camarim.', 'Rafa no camarim, Caio no palco. O número é o (88) 99645-1209.'],
    '3.1': ['Ela achava que falava com uma Bruna. Onde mais ela falava com essa Bruna?', 'Jornalista assina e-mail com telefone.', 'Correio, Bruna Leal, 10/10. Comparar a assinatura com o meu número.'],
    '3.2': ['"Primeiro amor" não precisa ser gente.', 'A galeria guarda lembranças antigas.', 'Galeria, Lembranças, "Há 17 anos". Nome e ano, juntos, minúsculo.'],
    '3.3': ['O pai dela também confiou na Colheita.', 'A conversa com o pai e o que ela trancou na Pasta Segura.', 'Papo com o pai (o comprovante). Arquivos, Pasta Segura, planilha das taxas.'],
    '3.4': ['Ela sabia de quem era o número. Só não quis salvar.', 'O cartão de contato da pessoa de quem eu desconfio tem um campo de notas.', 'Telefone, Contatos, Duda, notas.'],
    'ded:d3': ['Quem cobrava a taxa e de quem era o chip são a mesma pergunta.', 'A planilha mostra a chave. O contato mostra o dono.', 'Bruna, Colheita Capital, pirâmide, Caio, Duda, taxa de garantia, pai, Duda.'],
    '4.1': ['Um story tem hora de publicação. Um vídeo tem hora de gravação. Não são a mesma coisa.', 'O destaque da Lari repostou o story. O grupo do evento tem um vídeo parecido, de mais cedo.', 'Lume, destaque "Noite da Colheita". A live às 23:33. O vídeo da Duda no grupo, 22:51.'],
    '4.2': ['Apagar para todos apaga a conversa, não o que o sistema mostrou na tela.', 'As configurações guardam um histórico de notificações.', 'Configurações, Notificações, Histórico, 21:47 a 21:52.'],
    '4.3': ['Ela desbloqueava com o dedo. Naquela noite, alguém não conseguiu.', 'Segurança registra cada desbloqueio. A bateria registra como o aparelho desligou.', 'Configurações, Segurança (23:42 e 23:43) e Bateria (23:47).'],
    '4.4': ['"Vou gravar tudo." Ela disse isso para mim.', 'Apagar não é destruir. Muitos apps têm lixeira.', 'Gravador, Lixeira, 23:32.'],
    'ded:final': ['Cada bloco do relatório é conferido separado.', 'O encobrimento tem quatro passos, na ordem em que aconteceram. O álibi usa um vídeo antigo.', 'PIN, gravação, timelapse, 23:47, desligado. O vídeo é das 22:51.'],
  },
};
