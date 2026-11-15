// Roteiro do ECO (canal cifrado). Escreve só em minúsculas, frases curtas. Nunca entrega a resposta pronta.
// Gatilhos disparam uma vez, quando a expressão de flags fica verdadeira.

export default {
  nodes: {
    /* ---------- prólogo ---------- */
    'intro-1': {
      msgs: [
        { system: true, text: 'canal cifrado estabelecido · ponta a ponta' },
        'oi.',
        'você não me conhece.',
        'sábado, 23:31, chegou no seu celular uma mensagem de um número que você não tinha salvo. lembra?',
      ],
      choices: [
        { label: 'Lembro. Achei que era golpe e ignorei.', next: 'intro-2' },
        { label: 'Quem é você? Como conseguiu meu número?', next: 'intro-2b' },
      ],
    },
    'intro-2b': {
      msgs: ['seu número tá no celular de uma pessoa que morreu.', 'foi assim.'],
      next: 'intro-2',
    },
    'intro-2': {
      msgs: [
        'não era golpe.',
        'era a Iara Fontenele. fotógrafa, 27 anos, nascida em Guaraciaba do Norte.',
        'dez minutos depois de te escrever, ela caiu do Mirante da Pedra Lisa, na serra.',
        'a polícia fechou como acidente em menos de um dia.',
        'eu não acredito nisso.',
        'antes de continuar: como eu te chamo?',
      ],
      input: { kind: 'name', placeholder: 'seu nome ou apelido', next: 'intro-3' },
      next: 'intro-3',
    },
    'intro-3': {
      msgs: [
        'certo, {nome}. pode me chamar de ECO.',
        'eu tenho um espelho do celular dela. uma cópia de tudo, até a hora em que ele foi desligado: sábado, 23:47.',
        'os apps de nuvem continuam recebendo coisa até hoje. o resto parou ali.',
        'eu não posso aparecer. não posso ir à polícia. você pode, porque você não tem nada a ver com isso.',
        'o problema: tá bloqueado. PIN de quatro dígitos. no dia a dia ela usava a digital.',
        'a Iara era do tipo que usa uma data como senha. e a pessoa que ela mais amava tinha quatro patas.',
        'achei isso no perfil público dela, de março:',
        '"faz quatro anos que esse caramelo apareceu na porta dos meus pais e nunca mais saiu. 22 de março, o dia mais feliz do ano. feliz aniversário, Bento."',
        'tenta.',
      ],
      actions: [{ type: 'objective', text: 'Desbloqueie o celular de Iara.' }],
    },

    'pin-dica': { msgs: ['calma. não é o ano. é dia e mês.', 'o aniversário do Bento: 22 de março. dois dígitos pro dia, dois pro mês.'] },
    'pin-dica2': { msgs: ['2203.'] },

    /* ---------- capítulo 1 ---------- */
    'unlocked': {
      msgs: [
        'entrou.',
        'agora presta atenção, que eu só explico uma vez.',
        'a LUPA liga o modo análise. com ela ligada, nomes, horas, lugares e objetos ficam marcados nos textos. toca neles pra guardar.',
        'o QUADRO tem os objetivos, as provas que você fixar e as deduções. as deduções são preenchidas com os termos que você guardou.',
        'tudo que tá nesse celular é o que ela viu, escreveu e apagou. nada mais.',
        'começa pelo fim: o grupo do evento, no Papo. foi a última coisa que saiu desse aparelho.',
      ],
      actions: [{ type: 'system', text: 'capítulo 1 · a última noite' }],
    },
    'r-grupo': {
      msgs: [
        '23:46. "fui no mirante fazer uns timelapse. já volto."',
        'guarda essa hora.',
        'e repara numa coisa: timelapse se faz parado, com a câmera presa em algum lugar por meia hora.',
      ],
    },
    'r-voce': {
      msgs: [
        'essa é a sua.',
        'ela não tava falando com você. tava falando com uma tal de Bruna.',
        '"vou gravar tudo." gravar o quê?',
      ],
    },
    'r-pulso': {
      msgs: [
        'o relógio.',
        'queda forte às 23:41. depois disso, nada. nem batimento, nem passo.',
        'e a mensagem do grupo é das 23:46.',
      ],
    },
    'r-last': {
      msgs: [
        '23:47, no mirante. bateria em 41%.',
        'quarenta e um por cento não desliga celular sozinho.',
      ],
    },
    'd1-pronta': {
      msgs: ['você já tem o suficiente pra primeira dedução. tá no Quadro.', 'não chuta. se errar, eu vou saber.'],
      actions: [{ type: 'openBoard' }],
    },
    'd1-ok': {
      msgs: [
        'então é isso.',
        'quem mandou "fui no mirante fazer uns timelapse" não foi a Iara. ela já tinha caído.',
        'alguém tava com o celular dela na mão depois da queda.',
        'a pergunta agora é quem estava lá.',
        'tem dois nomes que qualquer delegado iria procurar primeiro. vamos ver se eles se sustentam.',
      ],
      actions: [{ type: 'system', text: 'capítulo 2 · quem estava lá' }],
    },

    /* ---------- capítulo 2 ---------- */
    'r-rafa-sms': {
      msgs: ['números novos, sempre. bloqueia um, ele aparece com outro.', '"linda essa blusa verde." ele tava vendo ela naquela noite.'],
    },
    'r-perfil': {
      msgs: [
        'telefone de recuperação terminando em 56.',
        'confere com quem você acha que confere. o Lume não mostra o número inteiro, mas o telefone dela tem os contatos.',
      ],
    },
    'r-caio': {
      msgs: [
        'vinte mil reais de "bônus". devolvido em vinte e oito minutos.',
        'ninguém devolve vinte mil reais assim. a não ser que saiba de onde eles vieram.',
      ],
    },
    'r-live': {
      msgs: ['a live tem horário em cada fala. usa isso.', 'presta atenção no que ele fala às 23:38.'],
    },
    'd2-ok': {
      msgs: [
        'o Rafa estava no camarim. o Caio, no palco, com cem pessoas olhando.',
        'nenhum dos dois estava no mirante às 23:41.',
        'mas ela foi encontrar alguém. às 21:55 respondeu "ok. 23h30" para um número que ela nunca salvou.',
        'as mensagens desse número foram apagadas. às 23:45. depois da queda.',
        'quem apaga mensagem do celular de uma mulher morta é quem tem medo do que tá escrito nelas.',
      ],
      actions: [{ type: 'system', text: 'capítulo 3 · a colheita' }],
    },

    /* ---------- capítulo 3 ---------- */
    'r-bruna': {
      msgs: [
        'olha a assinatura.',
        '98812-4471.',
        'o seu é 98812-4417.',
        'ela digitou com pressa, no escuro, andando pra um mirante. trocou os dois últimos números.',
        'a última mensagem dela era pra uma jornalista. foi parar em você.',
      ],
    },
    'r-pasta': {
      msgs: [
        'a Pasta Segura. ela guardou alguma coisa ali.',
        'a dica de senha que ela mesma escreveu: "meu primeiro amor + o ano em que tudo começou".',
        'o Bento não foi o primeiro. procura nas lembranças.',
      ],
    },
    'r-pasta-ok': {
      msgs: ['agora sim.', 'lê o LEIA-ME primeiro. ela escreveu pra quem fosse abrir.'],
    },
    'r-pai': {
      msgs: [
        'trinta mil reais. o dinheiro de uma vida inteira de roça.',
        'repara pra quem foi o Pix. a chave.',
      ],
    },
    'r-numero': {
      msgs: [
        'o número que marcou o encontro.',
        'ela sabia de quem era. ela anotou em algum lugar. gente que não salva um número costuma anotar ele no contato da própria pessoa.',
      ],
    },
    'd3-ok': {
      msgs: [
        'a Duda.',
        'melhor amiga desde a quarta série.',
        'cobrava uma taxa que não existia das famílias da serra. inclusive do pai da Iara.',
        'e a Iara ia entregar tudo pra Bruna na segunda.',
        'só que tem um problema, {nome}.',
        'a Duda postou um story às 23:33. tava no show.',
        'se isso for verdade, a gente tá errado.',
      ],
      actions: [{ type: 'system', text: 'capítulo 4 · última conexão' }],
    },
    'r-alerta': {
      msgs: [
        'urgente.',
        'chegou um alerta de segurança no e-mail dela agora. alguém tentou entrar na conta. de Guaraciaba do Norte.',
        'alguém quer apagar o que sobrou.',
        'não temos muito tempo.',
      ],
      actions: [{ type: 'notify', icon: 'shield-alert', title: 'Correio', text: 'Nova tentativa de acesso à sua conta — Guaraciaba do Norte, CE' }],
    },

    /* ---------- capítulo 4 ---------- */
    'r-story': {
      msgs: [
        'o story é das 23:33. olha o que tá no vídeo.',
        'agora olha o que estava acontecendo no palco às 23:33.',
        'já vi esse vídeo antes. em outro lugar, mais cedo.',
      ],
    },
    'r-notif': {
      msgs: [
        'apagar "para todos" apaga a conversa. não apaga o que o sistema mostrou na tela.',
        '"só nós duas."',
      ],
    },
    'r-desbloqueio': {
      msgs: [
        'a digital falhou duas vezes. às 23:42. dedo de outra pessoa.',
        'depois entraram com o PIN. alguém que sabia o aniversário de um cachorro.',
        'e às 23:47 o celular não morreu. foi desligado. no botão.',
      ],
    },
    'r-gravacao': {
      msgs: [
        '...',
        'eu ouvi isso três vezes.',
        'não consigo ouvir de novo.',
        'ela gravou tudo, como disse que ia gravar. e quem apagou não sabia que a lixeira guarda por trinta dias.',
      ],
    },
    'final-pronto': {
      msgs: [
        'você tem tudo.',
        'monta o relatório no Quadro. é ele que vai pra Bruna.',
        'quando você enviar, eu mando do número certo dessa vez.',
        'e, {nome}... se quiser, tem um campo a mais no fim. sobre mim. não é obrigatório.',
      ],
      actions: [{ type: 'openBoard' }],
    },
  },

  triggers: [
    { id: 't-intro', when: 'intro_done', node: 'intro-1' },
    { id: 't-pin3', when: 'pin_falhou_3 && !phone_unlocked', node: 'pin-dica' },
    { id: 't-pin6', when: 'pin_falhou_6 && !phone_unlocked', node: 'pin-dica2' },
    { id: 't-unlock', when: 'phone_unlocked', node: 'unlocked' },
    { id: 't-grupo', when: 'seen:papo:chat:equipe-evento', node: 'r-grupo' },
    { id: 't-voce', when: 'seen:papo:chat:voce', node: 'r-voce' },
    { id: 't-pulso', when: 'seen:pulso:day:2026-10-10', node: 'r-pulso' },
    { id: 't-last', when: 'seen:rotas:last', node: 'r-last' },
    { id: 't-d1p', when: 'objectives_done:1 && !solved:d1', node: 'd1-pronta' },
    { id: 't-d1', when: 'solved:d1', node: 'd1-ok' },
    { id: 't-rafa', when: 'cap2 && seen:sms:thread:rafa-2', node: 'r-rafa-sms' },
    { id: 't-perfil', when: 'seen:lume:recovery:visto.por.ultimo', node: 'r-perfil' },
    { id: 't-caio', when: 'seen:jandaia:tx:devolucao-2509', node: 'r-caio' },
    { id: 't-live', when: 'cap2 && seen:lume:post:live-colheita', node: 'r-live' },
    { id: 't-d2', when: 'solved:d2', node: 'd2-ok' },
    { id: 't-bruna', when: 'seen:correio:mail:bruna-1010', node: 'r-bruna' },
    { id: 't-pasta', when: 'cap3 && seen:galeria:album:segura && !pasta_aberta', node: 'r-pasta' },
    { id: 't-pasta-ok', when: 'pasta_aberta', node: 'r-pasta-ok' },
    { id: 't-pai', when: 'cap3 && seen:papo:chat:pai', node: 'r-pai' },
    { id: 't-numero', when: 'cap3 && seen:papo:chat:numero-desconhecido', node: 'r-numero' },
    { id: 't-d3', when: 'solved:d3', node: 'd3-ok' },
    { id: 't-alerta', when: 'solved:d3', node: 'r-alerta' },
    { id: 't-story', when: 'cap4 && seen:lume:highlight:lari-noite', node: 'r-story' },
    { id: 't-notif', when: 'cap4 && seen:config:notif-history', node: 'r-notif' },
    { id: 't-desb', when: 'cap4 && seen:config:unlock-log && seen:config:battery', node: 'r-desbloqueio' },
    { id: 't-grav', when: 'seen:gravador:rec:g-2332', node: 'r-gravacao' },
    { id: 't-final', when: 'cap4_done', node: 'final-pronto' },
  ],

  // Dicas em 3 níveis por objetivo (sutil, direta, quase a resposta).
  hints: {
    '0.1': ['a senha é uma data, dia e mês.', 'o Bento faz aniversário no dia do post.', '22 de março. dia e mês, quatro dígitos.'],
    '1.1': ['é um grupo, não uma conversa individual.', 'abre o Papo. o grupo tem o nome da festa.', 'Papo → "Equipe Noite da Colheita". desce até o fim.'],
    '1.2': ['tem um app que guarda por onde ela andou.', 'abre o Rotas e procura o último ponto registrado.', 'Rotas → o card "Última conexão" no mapa.'],
    '1.3': ['ela usava um relógio no pulso.', 'abre o Pulso e vê o dia 10.', 'Pulso → sábado, 10/10 → os eventos do fim da noite.'],
    '1.4': ['a conversa não tem nome. você nunca foi salvo nos contatos dela.', 'no Papo, procura um número sem nome.', 'Papo → a conversa com +55 85 98812-4417, o seu número.'],
    'ded:d1': ['a ordem dos fatos importa mais que os fatos.', 'compara a hora da queda com a hora da mensagem do grupo. e lembra do que se precisa pra fazer timelapse.', 'saída 23:29, queda 23:41, mensagem 23:46, depois da queda. o tripé ficou no galpão.'],
    '2.1': ['perfis anônimos ainda precisam de um jeito de recuperar a senha.', 'no Lume, abre o perfil @visto.por.ultimo e procura a opção de recuperar conta.', 'Lume → @visto.por.ultimo → ⋮ → "Esqueci a senha". compara o final do telefone com os contatos.'],
    '2.2': ['o ex dela não desiste. ele usa números novos.', 'olha as mensagens SMS de números desconhecidos. e o que ela contou para o Théo.', 'Mensagens → o número que fala da blusa verde. depois Papo → Théo.'],
    '2.3': ['siga o dinheiro.', 'abre a conversa com o Caio e o extrato do banco em setembro.', 'Papo → Caio. Jandaia → 25/09, a devolução de R$ 20.000.'],
    '2.4': ['às 23:41 todo mundo estava em algum lugar visível.', 'a live do discurso e as fotos do grupo têm hora.', 'Lume → a live da Colheita (23:30 a 23:52). Papo → a foto do camarim das 23:40.'],
    'ded:d2': ['cada suspeito tem um álibi com hora marcada.', 'o perfil é de quem tem telefone terminado em 56. a live mostra quem estava no palco. a foto mostra quem estava no camarim.', 'Rafa no camarim, Caio no palco. nenhum dos dois estava no mirante. o número é o (88) 99645-1209.'],
    '3.1': ['a mensagem era para uma Bruna. onde a Iara falava com ela?', 'procura no Correio os e-mails da Bruna. o mais recente tem assinatura.', 'Correio → Bruna Leal, 10/10. compara o telefone da assinatura com o seu.'],
    '3.2': ['a dica da senha está na própria pasta.', '"primeiro amor" não é uma pessoa. procura as lembranças na Galeria.', 'Galeria → Lembranças → "Há 17 anos". nome dela + o ano, tudo junto, minúsculo.'],
    '3.3': ['o pai dela também entrou na Colheita.', 'abre a conversa com o pai e os arquivos da Pasta Segura.', 'Papo → Pai (o comprovante). Arquivos → Pasta Segura → planilha das taxas de garantia.'],
    '3.4': ['ela sabia de quem era esse número.', 'olha o cartão de contato da pessoa que você suspeita. o app Telefone mostra detalhes.', 'Telefone → Contatos → Duda → as notas do contato.'],
    'ded:d3': ['quem cobrava a taxa e de quem era o chip são a mesma pergunta.', 'a planilha mostra a chave Pix. o contato mostra o dono.', 'Bruna, Colheita Capital, pirâmide, Caio, Duda, taxa de garantia, pai, Duda.'],
    '4.1': ['um story tem hora. um vídeo também.', 'compara o story repostado pela Lari com o que estava acontecendo no palco às 23:33.', 'Lume → destaque "Noite da Colheita" da Lari. depois a live. depois o vídeo que a Duda mandou no grupo às 22:51.'],
    '4.2': ['mensagens apagadas "para todos" deixam rastro no sistema.', 'as Configurações guardam o histórico de notificações.', 'Configurações → Notificações → Histórico de notificações → 21:47 a 21:52.'],
    '4.3': ['ela usava a digital. naquela noite, alguém não conseguiu.', 'Configurações → Segurança mostra os desbloqueios. a Bateria mostra como o celular desligou.', 'Configurações → Segurança → registro de desbloqueio (23:42–23:43) e Bateria → 23:47.'],
    '4.4': ['ela disse que ia gravar tudo.', 'o Gravador tem uma lixeira.', 'Gravador → Lixeira → a gravação das 23:32.'],
    'ded:final': ['cada bloco do relatório é conferido separado. você pode acertar um e errar outro.', 'o encobrimento tem quatro passos, na ordem em que aconteceram. e o álibi usa um vídeo antigo.', 'PIN, gravação, timelapse, 23:47, desligado. o vídeo é das 22:51.'],
  },
};
