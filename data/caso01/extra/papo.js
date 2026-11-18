// Papo (extra) — conversas comuns do celular de Iara: ruído realista.
// Mesmo formato compacto de data/caso01/papo.js (ver explicação lá). Arquivo autônomo.
// Pistas só em turma-anchieta (21/08 19:02–19:06) e turma-sobral (11/10 10:22–10:31).

const CUT = '2026-10-10T23:47';
const iso = (s) => (/^\d{2}-\d{2} /.test(s) ? '2026-' + s : s).replace(' ', 'T');
const pad = (n) => String(n).padStart(2, '0');

function msgs(px, raw) {
  let n = 0;
  return raw.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    n++;
    const cols = line.split(' | ').map((s) => s.trim());
    const opt = {};
    if (cols.length >= 4 && cols[cols.length - 1].startsWith('::')) {
      cols.pop().slice(2).split(';').forEach((kv) => {
        const i = kv.indexOf('=');
        if (i < 0) opt[kv] = true; else opt[kv.slice(0, i)] = kv.slice(i + 1);
      });
    }
    let [when, from, body = '', cap = ''] = cols;
    let tag = '';
    if (when.includes('#')) [when, tag] = when.split('#');
    const at = iso(when);
    const m = { id: px + (tag || pad(n)), from: from === 'sis' ? 'sistema' : from, at, kind: 'text' };
    if (from === 'sis') { m.kind = 'system'; m.text = body; }
    else if (body.startsWith('!')) {
      const [cmd, ...a] = body.slice(1).split(':');
      if (cmd === 'img') { m.kind = 'image'; m.media = `assets/caso01/img/${a[0]}.jpg`; if (cap) m.caption = cap; }
      else if (cmd === 'vid') { m.kind = 'video'; m.media = `assets/caso01/img/${a[0]}.jpg`; m.duration = +a[1]; if (cap) m.caption = cap; }
      else if (cmd === 'aud') { m.kind = 'audio'; m.duration = +a[0]; m.transcript = cap; }
      else if (cmd === 'doc') { m.kind = 'doc'; m.doc = { name: a[1], size: a[2], file: a[0] }; if (cap) m.caption = cap; }
      else if (cmd === 'stk') { m.kind = 'sticker'; m.text = a[0]; }
      else if (cmd === 'loc') { m.kind = 'location'; m.place = { name: a.slice(2).join(':'), lat: +a[0], lng: +a[1] }; }
      else if (cmd === 'call') { m.kind = 'call'; m.call = { dir: a[0] }; m.duration = +(a[1] || 0); }
      else if (cmd === 'del') { m.kind = 'deleted'; }
    } else m.text = body;
    if (opt.del) m.deletedAt = iso(opt.del);
    if (opt.reply) m.replyTo = px + opt.reply;
    if (opt.react) m.reactions = opt.react.split(',');
    if (opt.fwd) m.forwarded = true;
    if (from === 'iara') m.status = opt.st || 'read';
    else if (from !== 'sis' && at > CUT) m.pending = true;
    return m;
  });
}

const chat = (id, px, props, raw) => ({ id, ...props, messages: msgs(px, raw) });

/* ===================== TURMA 4ª B · ANCHIETA 2008 ===================== */
const turmaAnchieta = chat('turma-anchieta', 'ta-', {
  type: 'group', name: 'Turma 4ª B · Anchieta 2008 💛', muted: true,
  members: ['tati', 'kel', 'iara', 'duda', 'bruno-anchieta', 'mayara', 'josias', 'cicero-anchieta', 'leidiane', 'raquel-anchieta', '5588996451209'],
  about: 'Colégio Padre Anchieta · Guaraciaba do Norte · 4ª série B de 2008. Reencontro dia 05/12 💛',
}, `
05-09 18:20 | sis | Tati criou o grupo "Turma 4ª B · Anchieta 2008 💛"
05-09 18:21 | tati | GENTEEE 💛 achei a lista de chamada da 4ª B num caderno velho da minha mãe e não resisti
05-09 18:22 | tati | adicionei todo número que eu consegui achar, se faltar alguém avisa aqui
05-09 18:30 | kel | KKKKKK Tati tu é doida. que saudade dessa turma 😭
05-09 18:34 | josias | Boa noite a todos. Que iniciativa bonita, Tatiane. Deus abençoe
05-09 18:35 | bruno-anchieta | o Josias já chegou dando boa noite de reunião de condomínio kkkkk
05-09 18:41 | iara | gente que coisa boa!! 💛 tô em Fortaleza mas o coração tá aí
05-09 18:43 | mayara | IARA FONTENELE a fotógrafa famosa 😍
05-09 18:44 | iara | famosa só lá em casa kkkk
05-09 19:02 | duda | que lindo isso, Tati 🌻 4ª B pra sempre
05-09 19:10 | cicero-anchieta | quem lembra da tia Graça botando o Bruno de castigo todo santo dia
05-09 19:11 | bruno-anchieta | ela me amava. era amor bruto
05-09 19:11 | leidiane | kkkkkkkkkkkkk
05-09 19:15#reenc | kel | ideia: esse ano faz 18 anos que a gente saiu da 4ª série. bora fazer um reencontro??
05-09 19:16 | raquel-anchieta | apoio!!! 🙋‍♀️ | ::reply=reenc
05-09 19:17 | tati | 18 anos?? não fala isso não, Kel, me senti com 80
05-12 07:05 | josias | Bom dia, turma. Que o Senhor abençoe a semana de cada um 🙏 | ::fwd
05-12 07:20 | leidiane | !stk:🙏
05-20 20:30 | mayara | !aud:26 | Oi gente, é a Mayara. Voltei com os bolos, viu? Bolo de pote de ninho com morango, de prestígio e o de macaxeira da minha avó. Quem quiser me chama no privado, eu entrego no centro e no Juá.
05-20 20:38 | kel | quero 3 de macaxeira, me reserva!!
05-20 20:41 | iara | se tivesse delivery pra Fortaleza eu ia à falência kkkk
05-20 20:42 | mayara | manda o endereço que eu boto na van kkkkk
06-02 21:15 | leidiane | minha mãe achou uma foto da quadrilha de 2008 😂 a Iara de noiva caipira, a Duda de padre com bigode de lápis de olho e o Cícero chorando porque não queria dançar
06-02 21:16 | cicero-anchieta | eu não tava chorando, era alergia
06-02 21:16 | kel | MANDA A FOTO AGORA
06-02 21:18 | leidiane | tá no álbum, vou escanear na lan house amanhã
06-02 21:20 | duda | eu era o padre mais lindo de Guaraciaba 🌻😂
06-02 21:22 | iara | tu casou eu com o Josias, Duda, lembra?? kkkkk
06-02 21:25 | josias | Guardo esse casamento com muito respeito até hoje 😂 | ::react=😂,😂
06-09 18:02 | leidiane | o scanner da lan house quebrou, a foto vai ter que esperar 😩
06-09 18:05 | bruno-anchieta | sabotagem da Iara, certeza
06-17 19:40 | josias | Pessoal, a ponte da estrada do Juá ficou pronta. Só demorou 3 anos e uma eleição kkk
06-17 19:42 | kel | regra do grupo: proibido falar de política 🚫
06-17 19:42 | josias | Não é política, é engenharia
06-17 19:43 | tati | kkkkkkkk
06-25 12:10 | kel | quem vai pro São João da praça sábado?
06-25 12:30 | iara | chego sexta à noite!! 🔥
06-25 12:31 | duda | eu e a Iara vamos, já tô separando o vestido de chita 🌻
06-25 12:40 | mayara | vou com o bolo de milho pra vender kkk sempre trabalhando
07-09 07:30 | tati | Parabéns, Iara!! 🎂💛 que Deus te dê tudo de mais lindo
07-09 07:42 | kel | parabéns, fotógrafa!!! 🎉
07-09 08:05 | raquel-anchieta | Feliz aniversário, Iarinha 🎈
07-09 08:10 | josias | Parabéns, Iara. Muita saúde e paz
07-09 09:12 | iara | obrigada, gente!!! 🥹💛 27 anos e ainda me sentindo na 4ª série
07-19 20:02 | raquel-anchieta | gente... tenho uma novidade 💍 o Wellison pediu! casamento em março!
07-19 20:03 | kel | AAAAAAAAAA
07-19 20:03 | tati | RAQUEL 😭😭😭
07-19 20:05 | iara | parabéns, Raquel!! que lindo 💍
07-19 20:06 | bruno-anchieta | mais uma que casa antes de mim
07-19 20:07 | leidiane | Bruno tu nem namorada tem kkkkkk
07-19 20:07 | bruno-anchieta | detalhes
07-19 20:15 | raquel-anchieta | Iara, tu faz as fotos, né?? com desconto de colega de turma kkkk
07-19 20:20 | iara | faço! e o desconto é de colega de banca de lanche, que eu te devo uns pastéis desde 2008 kkk
08-05 19:30 | kel | bora oficializar o reencontro?? proposta: sábado 05/12, chácara da Tati, R$ 50 cada com churrasco e refri
08-05 19:32 | tati | a chácara tá liberada!! tem piscina, só não pode empurrar ninguém kkk
08-05 19:35 | josias | Conte comigo. Levo a caixa de som
08-05 19:36 | mayara | e eu levo os bolos 🍰
08-05 19:40 | iara | dia 5 eu consigo!! 💛 não perco por nada
08-05 19:50 | kel | vou fazer a lista de confirmação, quem confirmar me fala no privado ou aqui
08-12 08:15 | cicero-anchieta | !aud:18 | Bom dia, turma! Passando pra avisar que o Arthur nasceu ontem à noite, 3 quilos e 400, grandão. A Gessica tá bem, graças a Deus. Obrigado pelas orações.
08-12 08:20 | tati | PARABÉNS, CÍCERO 😭💛
08-12 08:22 | iara | que bênção!! parabéns, papai 👶
08-12 08:25 | duda | bem-vindo, Arthur 🌻🌻
08-12 08:30 | leidiane | o Cícero chorão agora é pai kkkk
08-12 08:31 | cicero-anchieta | e chorei de novo. alergia
08-21 19:02 | 5588996451209 | gente, quem já confirmou a resenha do dia 5/12?
08-21 19:04 | kel | quem é? 😅
08-21 19:05 | 5588996451209 | ops, era do outro chip 😅 Duda aqui, esse é o do trabalho
08-21 19:06 | kel | salvei aqui como Duda trabalho 99645-1209 kkk
08-21 19:06 | duda | 🌻🌻
08-21 19:10 | kel | confirmados até agora: Tati, Josias, Mayara, Iara, Bruno e eu. faltam vocês, preguiçosos
08-21 19:14 | leidiane | eu vou mas só confirmo quando souber se arrumo quem fique com os meninos
08-30 17:45 | mayara | promoção de domingo: bolo de pote 3 por 20 🍰
08-30 18:02 | bruno-anchieta | Mayara tu tá rica já, vende bolo pra serra inteira
08-30 18:03 | mayara | rica de cansaço kkkkk
09-08 21:30 | leidiane | !stk:😂
09-08 21:30 | leidiane | quem lembra do dia que o Bruno trancou a tia Graça no banheiro
09-08 21:32 | bruno-anchieta | a porta emperrou sozinha, eu sou inocente até hoje
09-08 21:35 | iara | eu lembro que a gente ficou 20 minutos sem professora e a Duda virou a professora kkkk
09-08 21:36 | tati | e passou dever!!! a Duda passou DEVER 😂
09-08 21:40 | duda | alguém tinha que manter a ordem 🌻
09-19 12:00 | josias | Pessoal, o colégio faz 60 anos em novembro. A diretora pediu fotos antigas pra uma exposição no pátio
09-19 12:30 | kel | Iara!! tu podia ajudar com isso
09-19 13:10 | iara | ajudo sim, mas só consigo depois de outubro, tô enrolada demais 😓
09-19 13:12 | josias | Sem pressa. Obrigado, Iara
10-04 19:10 | bruno-anchieta | votei e fui direto pro açude. democracia e cerveja 🍺
10-04 19:11 | kel | proibido política!!! 🚫🚫
10-04 19:11 | bruno-anchieta | açude não é política, Kel
10-08 20:20 | kel | lista atualizada do dia 5/12: 14 confirmados 🎉 Leidiane, decide tua vida
10-08 20:25 | leidiane | confirmada!! a sogra fica com os meninos 🙌
10-08 20:40 | iara | 💛💛
10-10 11:05 | mayara | quem vai na festa de hoje no sítio da família da Duda? a serra toda tá comentando
10-10 11:20 | duda | quem tiver convite vem 🌻 vai ser lindo
10-10 11:31 | iara | eu vou tá lá trabalhando, fotografando 📸
10-10 11:32 | kel | arrasa!! manda foto depois
10-11 09:34 | tati | gente... é verdade o que tão falando da Iara?
10-11 09:36 | kel | que foi??
10-11 09:40 | tati | minha mãe ouviu na feira que acharam a Iara lá embaixo da Pedra Lisa, no sítio. que ela caiu 😭
10-11 09:41 | kel | não. não pode
10-11 09:45 | josias | Acabei de confirmar com o tio dela. É verdade, pessoal. Que Deus conforte a família
10-11 09:46 | raquel-anchieta | meu Deus do céu 😭😭
10-11 09:50 | leidiane | eu não acredito. ela tava aqui no grupo ontem
10-11 09:52 | mayara | a gente falou com ela ontem de manhã 💔
10-11 10:05 | bruno-anchieta | sem palavras. a Iara era a melhor de nós
10-11 10:20 | kel | a Duda deve estar destruída. eram unha e carne desde pequenas
10-11 10:22 | tati | tô ligando pra ela e não atende. deixa ela, coitada
10-11 10:40 | cicero-anchieta | Que Deus receba ela. Vou rezar com a Gessica hoje
10-11 13:10 | josias | O velório vai ser amanhã às 10h na Igreja Matriz. A família pediu roupa branca
10-11 21:30 | leidiane | !aud:31 | Gente, eu tô aqui olhando a foto da quadrilha. A Iara de noiva, com aquele sorriso dela. Eu não consigo. Ela era a mais animada pra esse reencontro. Desculpa o áudio, eu só precisava falar.
10-11 21:35 | raquel-anchieta | 💔
10-12 12:40 | tati | foi lindo e triste demais. a mãe dela não soltava o caixão
10-12 12:42 | kel | o seu Toinho... eu não aguentei olhar pra ele
10-12 19:15 | duda | obrigada pelo carinho de vocês. ela amava essa turma 🌻
10-12 19:16 | kel | 🌻 tô aqui pra ti, Duda
10-12 19:16 | tati | força, amiga 🌻
10-12 19:20 | josias | Missa de sétimo dia sábado, 17/10, às 19h, Igreja Matriz
10-13 20:05 | kel | gente, sobre o dia 5/12. acho que a gente mantém e faz uma homenagem pra Iara. o que vocês acham?
10-13 20:08 | tati | mantém. ela ia querer
10-13 20:10 | leidiane | eu levo a foto da quadrilha, nem que eu escaneie no celular
10-13 20:11 | mayara | eu faço o bolo de macaxeira que ela gostava
10-13 20:30 | bruno-anchieta | 💛
`);

/* ===================== TURMA DE SOBRAL ===================== */
const turmaSobral = chat('turma-sobral', 'ts-', {
  type: 'group', name: 'Turma de Sobral 📷',
  members: ['iara', 'theo', 'camila-sobral', 'davi-sobral', 'renata-sobral', 'paulo-sobral'],
  about: 'os seis que sobreviveram à UVA 📷',
}, `
05-04 21:10 | paulo-sobral | !stk:📷
05-04 21:10 | paulo-sobral | quem aqui ainda tem a câmera da época da faculdade? a minha virou peso de porta
05-04 21:15 | camila-sobral | a minha tá viva e tirando foto de aniversário de criança, que é o que paga as contas kkkk
05-04 21:18 | iara | a minha tá aposentada com honra, comprei outra em 2024 💛
05-04 21:30 | theo | a minha é o celular
05-04 21:31 | paulo-sobral | o corujão sempre minimalista kkkk
05-04 21:32 | davi-sobral | o corujão nem ia nas saídas fotográficas, ficava no laboratório de informática
05-04 21:35 | theo | alguém tinha que consertar o projetor
05-18 14:02#expo | davi-sobral | gente, notícia boa: a Casa da Cultura topou uma exposição coletiva de ex-alunos de Comunicação. abertura em setembro, tema "Luz do Acaraú e arredores"
05-18 14:05 | renata-sobral | DAVI! que orgulho 😭
05-18 14:10 | camila-sobral | entro com as fotos do mercado de Sobral!
05-18 14:30 | iara | posso mandar a série das rendeiras de Guaraciaba? é serra, mas é arredores com boa vontade kkk | ::reply=expo
05-18 14:32 | davi-sobral | pode demais, Iara. curadoria aprova
05-18 14:35 | paulo-sobral | curadoria = Davi e a mãe dele kkkkk
05-18 14:36 | davi-sobral | e daí, minha mãe tem olho bom
06-03 10:20 | renata-sobral | vaga pra quem quiser: videomaker na TV Jangada Sobral, CLT, edição + captação. me mandaram aqui
06-03 10:40 | paulo-sobral | eu quero!!! me passa o contato
06-03 10:45 | iara | Paulo, vai! tu é o melhor câmera da turma
06-03 10:46 | paulo-sobral | fala isso pro RH, Iara kkk
06-03 11:02 | theo | paulo, revisa o portfólio antes. o link tava quebrado da última vez
06-03 11:03 | paulo-sobral | corujão auditor de link 😂 valeu
06-20 18:30 | paulo-sobral | PASSEI NA TV JANGADA 🎉🎉🎉
06-20 18:31 | camila-sobral | AAAAAAA PAULO
06-20 18:33 | iara | eu disse!!! 👏👏
06-20 18:35 | theo | boa
06-20 18:36 | renata-sobral | o "boa" do Théo vale um abraço de 5 minutos, viu, Paulo kkkk
07-09 07:50 | camila-sobral | feliz aniversário, Iarinha!! 🎂 27 e linda
07-09 08:02 | davi-sobral | parabéns, Iara! 🎉
07-09 08:30 | renata-sobral | parabéns, amiga 💛 saudade do teu riso escandaloso
07-09 08:41 | theo | parabéns, iara 🦉
07-09 09:20 | iara | amo vocês!!! 🥹 e o corujão mandou emoji, tô emocionada
07-09 09:22 | paulo-sobral | print pra posteridade kkkk
07-28 22:40 | davi-sobral | preciso das fotos da exposição até 20/08, em alta, com título e legenda curta
07-28 22:45 | iara | mando no fim de semana!
08-16 19:10 | iara | Davi, mandei no drive as 3 das rendeiras. a da Dona Mazé com o bilro é a minha preferida
08-16 19:30 | davi-sobral | Iara, essa da Dona Mazé vai pra parede principal. arrepiei
08-16 19:31 | camila-sobral | eu vi, tá linda demais 😭
08-28 21:00 | paulo-sobral | primeira matéria minha na TV hoje, quem quiser rir de mim é às 19h no jornal da noite kkk
08-28 21:05 | renata-sobral | assisti!! ficou ótimo, só a câmera tremeu um tiquinho kkkk
08-28 21:06 | paulo-sobral | era o vento 🙄
08-28 21:10 | theo | era o café
09-05 20:15 | davi-sobral | abertura confirmada: sábado 19/09, 18h, Casa da Cultura. quem vem?
09-05 20:20 | camila-sobral | tô dentro
09-05 20:22 | paulo-sobral | vou de terno kkk
09-05 20:40 | iara | semana que vem tô em Sobral a trabalho, mas no dia da abertura não vou conseguir 😭 me mandem tudo
09-05 21:30 | renata-sobral | Théo, tu vem de Fortaleza comigo?
09-07 08:10 | renata-sobral | Théo?
09-07 09:00 | camila-sobral | o corujão sumiu do grupo kkk
09-19 21:40 | davi-sobral | obrigado a quem veio 🙏 a parede da Iara foi a mais fotografada da noite
09-19 21:42 | camila-sobral | a Dona Mazé virou celebridade kkkk
09-19 22:10 | iara | chorando aqui em Fortaleza 🥹 obrigada, Davi
09-26 19:00 | paulo-sobral | alguém tem notícia do Théo? tá sumido
09-26 19:20 | theo | tô aqui. trabalho.
09-26 19:21 | paulo-sobral | vivo! 🙌
10-09 11:42 | iara | tô em Sobral de passagem, indo pra serra! almoço rápido com o prof Anselmo
10-09 11:45 | camila-sobral | e não avisa a gente 😤
10-09 11:47 | iara | foi tudo corrido, na volta eu paro aí, prometo 💛
10-09 11:48 | davi-sobral | vou cobrar
10-11 09:15 | paulo-sobral | gente. vocês viram o Serra Notícias?
10-11 09:16 | paulo-sobral | fotógrafa de 27 anos, de Guaraciaba. diz que caiu de um mirante
10-11 09:18 | renata-sobral | não
10-11 09:18 | renata-sobral | não não não
10-11 09:25 | camila-sobral | liguei pra Nanda. é ela. é a Iara 😭
10-11 09:30 | davi-sobral | eu não consigo respirar
10-11 09:40 | renata-sobral | ela disse que ia parar aqui na volta. ela prometeu
10-11 10:22 | camila-sobral | alguém vai pro velório amanhã? eu vou de carro de Sobral, cabem 3
10-11 10:25 | paulo-sobral | eu vou contigo, Camila
10-11 10:26 | davi-sobral | eu também
10-11 10:30 | theo | tô em fortaleza, sem condição de ir pro velório. não consigo.
10-11 10:31 | camila-sobral | entendo, corujão. te abraço daqui 🖤
10-11 10:40 | renata-sobral | eu vou de Fortaleza no primeiro ônibus. Théo, se mudar de ideia me chama
10-11 22:10 | davi-sobral | vou deixar a foto da Dona Mazé na parede até o fim da exposição. com o nome dela embaixo
10-11 22:12 | camila-sobral | 🖤
10-12 05:40 | camila-sobral | saindo. Paulo e Davi, tô na frente da casa do Paulo em 10 min
10-12 14:20 | renata-sobral | foi tudo muito triste. a mãe dela abraçou a gente e disse que ela falava muito da turma
10-12 14:25 | paulo-sobral | fiz umas fotos da igreja pra família, sem flash, do jeito que ela ensinou
10-13 21:30 | davi-sobral | a Casa da Cultura vai fazer um minuto de silêncio sábado, antes da sessão de cinema. depois eu mando foto
10-13 21:31 | camila-sobral | 🖤🖤
`);

/* ===================== COMUNICAÇÃO UVA 2017 ===================== */
const comunicacaoUva = chat('comunicacao-uva', 'cu-', {
  type: 'group', name: 'Comunicação UVA 2017 🎓', muted: true,
  members: ['iara', 'theo', 'camila-sobral', 'davi-sobral', 'renata-sobral', 'paulo-sobral', '5588994018273', '5585996203348', '5588992951106', '5588996720437', '5585991465082'],
  about: 'Turma 2017.1 · Comunicação Social · UVA Sobral. Vagas, memes e convites de casamento.',
}, `
05-06 09:10 | 5585996203348 | bom dia, turma! vaga de social media júnior na agência Maré, Fortaleza, presencial. salário 2.200. quem quiser me chama
05-06 09:30 | 5588994018273 | 2.200 em Fortaleza é pra morar no armário kkk
05-06 09:31 | paulo-sobral | kkkkkk
05-14 22:05 | 5588996720437 | !stk:😂
05-14 22:05 | 5588996720437 | quem lembra da prova de fotojornalismo do Anselmo em que metade da turma fotografou o mesmo jumento na praça
05-14 22:08 | camila-sobral | o jumento da praça!! ele tá vivo ainda?
05-14 22:10 | iara | o jumento rendeu mais portfólio que eu kkkk
05-14 22:12 | 5585991465082 | o Anselmo deu 10 pro jumento do Davi e 6 pro meu. injustiça até hoje
05-14 22:13 | davi-sobral | talento é talento, Bia
06-10 19:00 | 5588994018273 | gente!!!! vou casar 💍 dia 31/10 em Sobral, o convite chega essa semana pra quem eu tiver o endereço
06-10 19:02 | renata-sobral | JOYCE 😍
06-10 19:05 | iara | parabéns, Joyce!!! 💛
06-10 19:06 | 5588994018273 | Iara, preciso de indicação de fotógrafo que caiba no bolso de jornalista kkkk
06-10 19:10 | iara | te mando uns nomes no privado! se eu não tivesse trabalho em outubro ia eu
06-10 19:30 | 5585996203348 | parabéns, Joyce!
07-01 08:45 | 5588992951106 | alguém tem modelo de mídia kit? preciso pra ontem
07-01 09:00 | renata-sobral | tenho um no Canva, te mando
07-01 09:02 | 5588992951106 | salvou minha vida, Renata 🙏
07-22 13:15 | 5585996203348 | edital aberto: bolsa de fotografia documental da Secult, até R$ 15 mil. prazo 30/08
07-22 13:30 | iara | ah eu quero tentar!! valeu, Ítalo
07-22 13:31 | davi-sobral | eu também vou tentar, Iara. que vença a melhor (tu) kkk
08-29 17:50 | iara | não consegui fechar o projeto do edital a tempo 😩 ano que vem
08-29 17:52 | davi-sobral | mandei o meu com a série da exposição, vamo ver
08-29 17:55 | 5585991465082 | boa sorte, Davi!!
09-10 21:00 | 5588996720437 | alguém vende cartão de memória de 128? o meu morreu no meio de um casamento 😭
09-10 21:05 | iara | NUNCA confia num cartão só, Neto. câmera de dois slots ou backup no intervalo kkk
09-10 21:06 | 5588996720437 | aprendi da pior forma
09-10 21:10 | camila-sobral | tenho um de 64 sobrando, te empresto
09-24 10:30 | 5588994018273 | convites entregues! quem não recebeu me chama 💌
09-24 10:40 | paulo-sobral | recebi!! vou levar a câmera da TV kkk
10-02 20:12 | 5585996203348 | vaga: fotógrafo freela pra cobertura de eleição em Fortaleza, dias 3 e 4/10
10-02 20:30 | paulo-sobral | tô cobrindo pela TV em Sobral, não dá
10-11 14:05 | 5588994018273 | gente, eu vi agora. a Iara Fontenele? da nossa turma?
10-11 14:08 | renata-sobral | é ela, Joyce. a gente tá sabendo desde cedo 💔
10-11 14:10 | 5585991465082 | meu Deus. ela era a mais talentosa da sala
10-11 14:12 | 5585996203348 | meus sentimentos à família e aos amigos dela daqui
10-11 14:15 | 5588992951106 | não acredito. 27 anos
10-11 14:30 | 5588996720437 | foi ela que me ensinou a usar o modo manual no primeiro semestre. descansa, Iara
10-11 15:00 | davi-sobral | o velório é amanhã às 10h em Guaraciaba, Igreja Matriz. a gente vai de carro de Sobral
10-11 18:20 | 5588994018273 | vou dedicar a primeira foto do meu casamento pra ela 🤍
10-12 20:40 | 5585996203348 | o professor Anselmo pediu pra avisar que vai ter uma homenagem na aula inaugural do semestre que vem
10-12 20:45 | camila-sobral | 🤍
`);

/* ===================== MARINA (noiva, casamento 21/11) ===================== */
const marinaNoiva = chat('marina-noiva', 'mn-', { type: 'direct', contact: 'marina', lastSeen: '2026-10-13T10:42' }, `
08-18 15:20 | marina | Oi, Iara! Tudo bem? Peguei teu contato com o Sandro, ele tá com a agenda cheia em novembro e te indicou 😊
08-18 15:21 | marina | casamento dia 21/11, sábado, em Beberibe, pé na areia 🌊
08-18 15:40 | iara | Oi, Marina! Que delícia, pé na areia é meu tipo preferido 😍 qual o horário da cerimônia e quantos convidados?
08-18 15:45 | marina | 16h, umas 120 pessoas. a gente queria making of da noiva também
08-18 15:47 | iara | perfeito. te mando o orçamento até quinta, com duas opções
08-20 10:12 | iara | Marina, bom dia! Orçamento: Pacote A, cerimônia + festa até 23h, 400 fotos tratadas, R$ 4.800. Pacote B, com making of e ensaio pré-wedding, R$ 6.200. Deslocamento pra Beberibe incluso
08-20 10:13 | iara | sinal de 30% reserva a data, o resto até 7 dias antes
08-20 12:40 | marina | ai que lindo! vou mostrar pro Diego
08-23 21:15 | marina | Iara, a gente amou, mas tá apertado 😅 tu consegue fazer o B por 5.000? a gente estourou no buffet
08-23 21:16 | marina | ou sem o pré-wedding?
08-23 21:50 | iara | entendo demais, casamento é um poço sem fundo kkk. consigo o B por 5.600, ou o A com making of por 5.000. abaixo disso eu fico no prejuízo, viu
08-24 09:10 | marina | fechado o A com making of por 5.000!! 🥹
08-24 09:20 | iara | combinado! mando o contrato por e-mail hoje
08-24 09:30 | marina | posso te dar o sinal em espécie quando a gente se encontrar? meu banco bloqueou o app por besteira 🙄
08-24 09:40 | iara | pode sim! marca um café essa semana?
08-24 09:41 | marina | quinta, 17h, no Benfica?
08-24 09:42 | iara | fechado ☕
08-27 17:05 | marina | cheguei! mesa do canto
08-27 17:06 | iara | 2 min, tô atravessando a rua
09-08 20:30 | marina | Iara, dúvida: se chover, tu fotografa na tenda? o cerimonial disse que tem plano B
09-08 20:45 | iara | fotografo sim! levo flash e rebatedor. chuva em Beberibe em novembro é rara, fica tranquila
09-08 20:46 | marina | 🙏🙏
09-15 13:10 | marina | outra coisa: drone, tu faz?
09-15 13:40 | iara | não tenho drone, mas tenho um parceiro que faz, R$ 600 a mais. quer que eu veja?
09-15 13:41 | marina | quero!! o Diego quer foto do alto com a gente no mar kkk
09-15 13:50 | iara | vou ver a agenda dele 😉
09-22 19:00 | marina | !aud:42 | Iara, é a Marina. Minha mãe agora quer foto com todos os tios, um por um, e são dezoito tios. Eu disse que não dá, mas ela tá irredutível. Me ajuda a explicar pra ela que vai atrasar a festa? Kkkk. Beijo.
09-22 19:20 | iara | kkkkkkk clássico. faço as fotos de família em blocos, por lado da família, uns 15 min no total. ninguém fica de fora e a festa não atrasa
09-22 19:21 | marina | tu é um anjo
09-30 10:10 | iara | Marina, drone confirmado pro dia 21! o Kaique, meu parceiro de vídeo, vai comigo
09-30 10:15 | marina | AAAA obrigada 😍
10-06 21:00 | marina | Iara, a gente mudou o horário: cerimônia 16h30 por causa do sol. muda alguma coisa?
10-06 21:30 | iara | melhor ainda! 16h30 em Beberibe é luz dourada pura. só preciso chegar 13h pro making of
10-06 21:31 | marina | ❤️
10-10 13:30 | marina | Iara, a cerimonialista pediu teu e-mail pra mandar o cronograma. é o mesmo do contrato?
10-10 14:40 | iara | é sim! essa semana tô na serra, respondo tudo com calma semana que vem 😘
10-11 11:00 | marina | combinado! bom domingo 🌊
10-12 20:05 | marina | Iara... uma amiga me mandou a notícia agora. eu não sei o que dizer
10-12 20:07 | marina | a gente tava falando de luz dourada semana passada
10-12 20:10 | marina | que Deus conforte a tua família. sinto muito, de coração 🤍
10-13 10:40 | marina | !aud:23 | Oi... eu sei que ninguém vai ouvir isso. Eu só queria dizer que tu fez a gente se sentir especial desde a primeira mensagem. Fica com Deus, Iara.
`);

/* ===================== THALYTA (formatura) ===================== */
const thalyta = chat('thalyta-formatura', 'tf-', { type: 'direct', contact: 'thalyta', lastSeen: '2026-10-13T19:51' }, `
09-01 11:20 | thalyta | Oi, Iara, boa tarde! Sou a Thalyta, da comissão de formatura de Enfermagem 2026.2. A Camila, do ensaio gestante, te indicou 😊
09-01 11:21 | thalyta | a gente tá fechando o fotógrafo da colação (18/12) e do baile (19/12). Tu faz formatura?
09-01 12:05 | iara | Oi, Thalyta! Faço sim, adoro formatura de saúde, é sempre emoção em dobro kkk. quantos formandos?
09-01 12:10 | thalyta | 42. e a gente queria as fotos de beca em estúdio também, em novembro
09-01 12:12 | iara | anotado! te mando proposta até sexta
09-04 18:30 | iara | Thalyta, proposta: colação + baile + ensaio de beca em estúdio, R$ 260 por formando, com galeria online e 1 foto impressa 20x30 pra cada. pagamento em até 4x
09-04 18:31 | iara | !aud:35 | Oi, Thalyta, só complementando: o ensaio de beca eu faço num estúdio parceiro aqui no Benfica, a gente divide em dois sábados de novembro pra não cansar ninguém. E no baile eu levo uma assistente, porque com 42 formandos e família não dá pra fazer sozinha. Qualquer dúvida me chama.
09-04 19:00 | thalyta | ai que proposta organizada 😍 vou levar pra comissão
09-10 20:15 | thalyta | Iara, a empresa grande que veio aqui ofereceu 230 por formando. tu consegue cobrir?
09-10 20:40 | iara | consigo chegar em 245, abaixo disso não dá com assistente. mas te garanto que eu não sumo depois da festa kkk
09-10 20:41 | thalyta | kkkkk isso pesa, viu. a turma passada esperou 8 meses pelo álbum
09-10 20:42 | iara | entrego a galeria em 30 dias, tá no contrato
09-16 12:30 | thalyta | tu tem fotos de formatura pra mostrar? o pessoal quer ver antes de votar
09-16 13:10 | iara | tenho! te mando por e-mail o link de uma galeria completa, do jeito que o formando recebe
09-16 13:11 | thalyta | manda sim 🙏
09-16 13:15 | iara | mandei!
09-24 19:40 | thalyta | votação adiada pra semana que vem, metade da turma tava de plantão 🙄
09-24 19:45 | iara | kkk enfermagem é assim, sem problema
10-07 21:10 | thalyta | IARA! a comissão votou e foi tu!! 🎉🎉 32 votos contra 10
10-07 21:15 | iara | que notícia boa!!! 😍 obrigada pela confiança, Thalyta
10-07 21:16 | iara | te mando o contrato até o fim da semana que vem, pode ser? tô com um evento grande no sábado
10-07 21:18 | thalyta | pode sim! sem pressa
10-12 18:30 | thalyta | Iara, boa noite! conseguiu ver o contrato? a turma queria assinar essa semana 😊
10-13 19:50 | thalyta | Iara? tudo bem? 😅
`);

/* ===================== BIANCA (gestante) ===================== */
const bianca = chat('bianca-gestante', 'bg-', { type: 'direct', contact: 'bianca', lastSeen: '2026-10-13T16:22' }, `
09-09 10:05 | bianca | Oi, Iara! Vi o ensaio gestante que tu fez da Camila e me apaixonei 😭 tô de 30 semanas, ainda dá tempo?
09-09 10:30 | iara | Oi, Bianca!! Parabéns 🤰 dá tempo sim, o ideal é entre 28 e 34 semanas. é menino ou menina?
09-09 10:31 | bianca | menino! Heitor 💙
09-09 10:35 | iara | que nome lindo. tu prefere estúdio ou externo?
09-09 10:40 | bianca | praia!! no fim de tarde, igual o da Camila
09-09 10:45 | iara | Praia do Futuro, luz das 16h30. o ensaio sai R$ 800, 1h30, 30 fotos tratadas. pode levar o marido e até o cachorro kkk
09-09 10:46 | bianca | o cachorro vai SIM kkkk
09-14 21:10 | bianca | Iara, que roupa eu levo? tô em dúvida entre um vestido longo branco e um azul
09-14 21:30 | iara | leva os dois! o branco no mar fica lindo e o azul combina com o Heitor 💙 só evita estampa miudinha, que na foto fica estranha
09-23 08:40 | bianca | dia 3/10 tá de pé? sábado
09-23 09:00 | iara | de pé! 16h no quiosque 7, Praia do Futuro
10-03 15:40 | bianca | chegamos!! o Thor já tá cavando buraco na areia
10-03 15:42 | iara | kkkkk tô estacionando, 5 min
10-03 18:05 | bianca | obrigada por hoje!!! 😭 o Fábio disse que nunca se sentiu tão à vontade numa foto
10-03 18:20 | iara | vocês foram incríveis! a luz ajudou demais. prévia até quarta 💙
10-07 22:00 | iara | Bianca, prévia no teu e-mail! 6 fotos, o resto até dia 17
10-07 22:15 | bianca | AAAAAA eu chorei 😭😭 a do Thor com a barriga é a minha preferida
10-07 22:16 | bianca | posso postar uma?
10-07 22:20 | iara | pode! só marca @iarafontenele.foto 💙
10-07 22:21 | bianca | óbvio!!
10-09 13:00 | bianca | Iara, tô sentindo umas contrações de treinamento kkk o médico disse que é normal. se o Heitor vier cedo tu faz o newborn?
10-09 13:40 | iara | faço! newborn é até uns 15 dias de vida. tô viajando pra serra hoje, mas volto semana que vem 💙
10-12 06:15 | bianca | IARA ELE NASCEU 😭💙 ontem à noite, 36 semanas, 2,9 kg, os dois bem
10-12 06:16 | bianca | adiantou tudo kkkk. quando tu pode vir fazer o newborn?
10-13 16:20 | bianca | Iara, tô te mandando de novo porque não chegou nem o visto 😅 a pediatra disse que dá pra fazer o newborn até o dia 25
`);

/* ===================== CAFÉ SERRA VERDE (pagamento atrasado) ===================== */
const cafeSerra = chat('cafe-serra-verde', 'cs-', { type: 'direct', contact: 'cafe-serra', lastSeen: '2026-10-13T09:20' }, `
06-22 09:30 | cafe-serra | Bom dia, Iara! Rodrigo, do Café Serra Verde, de Ubajara. Peguei teu contato no Lume. Tamo lançando embalagem nova e queria fotos de produto pro site e pro marketplace
06-22 10:15 | iara | Bom dia, Rodrigo! Conheço o Serra Verde, meu pai só toma ele kkk. quantos produtos?
06-22 10:16 | cafe-serra | 6: três de 250 g, dois de 500 g e o drip. fundo branco + umas fotos ambientadas
06-22 10:40 | iara | fundo branco + 2 ambientadas por produto sai R$ 1.200. metade na aprovação, metade na entrega
06-22 10:41 | cafe-serra | fechado. mando os pacotes pela transportadora pro teu endereço
07-02 14:20 | iara | os cafés chegaram! o apê tá cheirando a sítio kkk
07-02 14:21 | cafe-serra | kkkk pode tomar o que abrir
07-08 19:00 | iara | Rodrigo, fotos prontas! 36 no total, link no teu e-mail. o restante (R$ 600) pode ser até sexta
07-08 19:40 | cafe-serra | ficaram TOP 🔥 o pessoal aqui amou. o financeiro faz o Pix sexta
07-17 10:00 | iara | bom dia, Rodrigo! o pagamento de sexta não caiu, consegue verificar?
07-17 15:20 | cafe-serra | opa, vou ver com o financeiro e te falo
07-29 09:10 | iara | Rodrigo, tudo bem? ainda tô sem o restante 😕
07-29 18:00 | cafe-serra | Iara, mil desculpas. a safra atrasou o caixa, semana que vem sai
08-12 11:30 | iara | Rodrigo, bom dia. já faz um mês da entrega. consegue me dar uma data certa?
08-12 14:02 | cafe-serra | !call:in:184
08-12 14:06 | iara | combinado então, dia 30. obrigada pela ligação
08-31 09:00 | iara | Rodrigo, passou o dia 30 e nada 😐
08-31 12:10 | cafe-serra | amanhã cedo, palavra
09-15 16:40 | iara | Rodrigo, vou ser sincera: tô vendo as minhas fotos no marketplace de vocês e ainda sem receber. preciso resolver isso
09-15 17:30 | cafe-serra | tu tem toda razão. vou falar direto com o dono hoje
09-15 17:31 | cafe-serra | !aud:39 | Iara, é o Rodrigo. Eu tô morrendo de vergonha, de verdade. Já falei com o seu Aurélio, ele disse que paga até o fim do mês, que a venda da feira de Tianguá vai cobrir. Vou te mandar um pacote de café de presente, viu? Desculpa mesmo.
09-15 18:00 | iara | o café eu aceito kkk mas o pagamento também, né, Rodrigo 😅
09-24 13:10 | iara | o café de presente chegou kkk obrigada. agora só falta o resto 😂
09-24 13:30 | cafe-serra | 🙈🙈
09-30 17:10 | iara | Rodrigo, fim do mês. alguma novidade?
10-01 08:20 | cafe-serra | Iara, o seu Aurélio viajou, volta dia 8. eu sei, eu sei 😩
10-08 10:02 | iara | e aí? ele voltou?
10-08 19:30 | cafe-serra | voltou! sexta ou segunda no máximo
10-11 10:30 | cafe-serra | Iara, bom dia. o seu Aurélio prometeu fazer amanhã cedo, de verdade dessa vez 🙏
10-13 09:15 | cafe-serra | Iara, ele disse que libera hoje à tarde. foi mal pela novela 😩
`);

/* ===================== DONA FÁTIMA (vizinha) ===================== */
const donaFatima = chat('dona-fatima-pv', 'df-', { type: 'direct', contact: 'dona-fatima', lastSeen: '2026-10-13T08:15' }, `
06-08 10:15 | dona-fatima | Iara, minha filha, chegou uma caixa pra ti, o porteiro deixou comigo porque tu não tava
06-08 12:30 | iara | ai, obrigada, Dona Fátima! passo aí de noite pra pegar
06-08 19:40 | iara | Dona Fátima, posso passar agora?
06-08 19:42 | dona-fatima | pode, filha, tô vendo a novela mas a porta tá aberta
07-14 21:50 | dona-fatima | Iara, o Frajola tá aí no corredor de vocês? sumiu de novo esse gato
07-14 21:55 | iara | tá deitado no nosso capacho kkk quer que eu leve?
07-14 21:56 | dona-fatima | leva sim, esse gato acha que mora com vocês
08-05 08:30 | dona-fatima | Bom dia! Que Deus ilumine o seu caminho 🌸🌸 | ::fwd
08-05 09:10 | iara | bom dia, Dona Fátima 🌸
08-19 14:00 | dona-fatima | minha filha, essa obra do 201 tá me matando, tu tá ouvindo esse martelo?
08-19 14:05 | iara | tô editando de fone e mesmo assim kkkk
08-19 14:06 | dona-fatima | vou falar com o Wellington
09-07 16:20 | iara | Dona Fátima, a senhora tem forma de bolo redonda pra emprestar? vou fazer o bolo de aniversário da Nanda escondido
09-07 16:22 | dona-fatima | tenho! e tenho fermento também se faltar. vem buscar
09-07 16:23 | iara | a senhora é um anjo 🙏
09-19 10:00 | dona-fatima | o bolo ficou bonito? a Nanda gostou?
09-19 10:30 | iara | ela chorou kkk devolvo a forma hoje, lavadinha
10-08 19:30 | iara | Dona Fátima, vou pra serra amanhã cedo e volto semana que vem. se a Nanda esquecer de molhar a samambaia da varanda, a senhora dá uma lembrada nela? kkk
10-08 19:35 | dona-fatima | pode deixar, eu fico de olho. vai com Deus e leva casaco, que lá faz frio
10-08 19:36 | iara | 💚
10-11 16:40 | dona-fatima | Iara, minha filha, a Nanda me contou. Eu não tô acreditando
10-11 16:42 | dona-fatima | !aud:29 | Minha filha, aqui é a Dona Fátima. Eu sei que tu não vai ouvir. Mas eu precisava dizer que tu era a menina mais educada desse prédio. Sempre me ajudou com as sacolas, com o gato. Que Nossa Senhora te receba.
10-13 08:10 | dona-fatima | molhei tua samambaia hoje. vou continuar molhando, viu
`);

/* ===================== GABI (ex-colega de estágio) ===================== */
const gabi = chat('gabi', 'gb-', { type: 'direct', contact: 'gabi', lastSeen: '2026-10-12T09:20' }, `
05-27 20:30 | gabi | IARAAA sumida! aqui é a Gabi, do Diário do Acaraú, lembra de mim? a estagiária que derramou café no arquivo kkkk
05-27 20:45 | iara | GABI!!! como eu ia esquecer o dia do café no arquivo 😂 como tu tá?
05-27 20:47 | gabi | sobrevivendo! o jornal agora é só digital, acabou a edição impressa em março
05-27 20:48 | iara | sério?? que triste. e o seu Wilson?
05-27 20:50 | gabi | aposentou!! fizeram festa com bolo e ele chorou no discurso. o homem que nunca sorriu 😭
05-27 20:51 | iara | kkkkk não acredito. o seu Wilson chorando eu pagava pra ver
05-27 20:52 | gabi | tem vídeo, te mando depois kkk
06-15 18:10 | gabi | fofoca da redação: o editor novo quer vídeo vertical de TUDO. até de obituário 🙄
06-15 18:20 | iara | obituário em vertical com música em alta kkkk
06-15 18:21 | gabi | NÃO DÁ IDEIA 😂
07-20 11:00 | gabi | Iara, uma amiga vai casar em Sobral em janeiro e quer fotógrafo bom. tu indica alguém de lá?
07-20 11:30 | iara | a Camila Arruda, estudou comigo, é fotógrafa de mão cheia. te passo o contato
07-20 11:31 | gabi | perfeito, obrigada 🙏
08-14 16:00 | gabi | outra: tu conhece alguém da Agência Pulsar? vi que tão contratando
08-14 16:20 | iara | mandei currículo pra lá essa semana kkk vamos ver
08-19 09:30 | iara | Gabi, levei um não da Pulsar 🙃 "outro perfil"
08-19 09:32 | gabi | o perfil deles é ruim então. o mercado tá doido
08-19 09:33 | gabi | !stk:🫂
09-03 21:10 | gabi | Iara, tu ainda faz frila de foto pra jornal? o Diário tá precisando de alguém pra umas pautas na serra
09-03 21:40 | iara | faço, mas até outubro tô sem agenda nenhuma. me chama de novo em novembro?
09-03 21:41 | gabi | fechado, anotei aqui 📌
10-01 12:00 | gabi | achei o vídeo do seu Wilson chorando, mando quando o wi-fi da redação deixar kkk
10-01 12:30 | iara | kkkk tô esperando há 4 meses
10-11 19:50 | gabi | Iara... chegou na redação agora a nota da polícia de Guaraciaba. tem o teu nome
10-11 19:51 | gabi | me diz que é outra Iara
10-11 20:30 | gabi | o pessoal aqui tá todo calado. o seu Wilson ligou chorando, dessa vez de verdade
10-12 09:15 | gabi | tô escrevendo a nota de falecimento. não consigo passar da primeira linha
10-12 09:16 | gabi | vou escrever do jeito que tu merece. sem vídeo vertical
`);

/* ===================== GOLPE (encomenda retida) ===================== */
const golpe = chat('golpe-encomenda', 'gp-', { type: 'direct', phone: '5511940036618' }, `
08-25 10:14 | 5511940036618 | ENVIOS BR INFORMA: sua encomenda BR8841277CE está retida na unidade de fiscalização. Para liberar, pague a taxa de R$ 47,90 em até 24h: envios-liberacao.online/br8841
08-25 10:30 | iara | kkkkk eu nem comprei nada
08-25 10:31 | iara | e esse link aí, liberacao ponto online? nem se esforçaram
08-26 09:00 | 5511940036618 | ULTIMO AVISO: encomenda BR8841277CE sera devolvida ao remetente. Regularize: envios-liberacao.online/br8841
08-26 09:02 | iara | manda foto da encomenda então
08-26 09:03 | iara | se for uma lente nova eu pago na hora kkkk
09-14 13:20 | 5511940036618 | Olá! Você foi selecionado(a) no sorteio de 15 anos da loja Magazine Pra Valer 🎁 Seu prêmio: Air Fryer 5L. Para retirar, pague apenas o frete de R$ 29,90: premio-pravaler.site
09-14 13:40 | iara | engraçado, eu também sorteei vocês. o prêmio é eu denunciar esse número 🙃
10-02 11:05 | 5511940036618 | Prezado(a) cliente, identificamos pendência no seu CPF. Evite bloqueio regularizando hoje: cpf-regular.online
10-02 11:10 | iara | 🥱
10-11 08:00 | 5511940036618 | ENVIOS BR: sua encomenda BR9023361CE aguarda pagamento de R$ 52,40. Pague e receba em 2 dias: envios-liberacao.online/br9023
10-12 08:00 | 5511940036618 | ULTIMO AVISO: encomenda BR9023361CE sera devolvida. envios-liberacao.online/br9023
10-13 08:00 | 5511940036618 | ⚠ Sua encomenda foi devolvida ao remetente. Para reenvio pague R$ 52,40 hoje
`);

/* ===================== ENTREGADOR (marketplace) ===================== */
const entregador = chat('entregador-mercaja', 'en-', { type: 'direct', phone: '5585981557302', archived: true }, `
08-07 13:40 | 5585981557302 | Boa tarde, entrega MercaJá pra Iara Fontenele? tô aqui na rua mas o GPS manda pro outro lado do canal
08-07 13:42 | iara | !loc:-3.7400:-38.5410:Ed. Benfica Plaza
08-07 13:43 | iara | é esse prédio, do lado da farmácia
08-07 13:50 | 5585981557302 | tô na portaria
08-07 13:51 | iara | pode deixar com o seu Raimundo, o porteiro, já desço
08-07 13:52 | 5585981557302 | deixei! bom dia de trabalho 👍
09-18 11:05 | 5585981557302 | Bom dia, outra entrega MercaJá. Benfica Plaza, né?
09-18 11:06 | iara | isso! tô em casa, pode subir no 302?
09-18 11:15 | 5585981557302 | o porteiro não deixa subir, só até a portaria
09-18 11:16 | iara | desço em 2 min
09-18 11:20 | 5585981557302 | caixa grande hein, é tv? kkk
09-18 11:21 | iara | kkk é presente de aniversário da minha amiga, finge que não viu
09-18 11:22 | 5585981557302 | kkkk sigilo garantido
10-09 09:30 | 5585981557302 | Bom dia, entrega MercaJá, Benfica Plaza 302. tem alguém?
10-09 09:45 | 5585981557302 | !call:missed
10-09 09:50 | 5585981557302 | deixei na portaria com o porteiro, ok?
10-09 10:05 | iara | obrigada! tô viajando, minha amiga pega
`);

/* ===================== ACADEMIA ===================== */
const academia = chat('academia-ritmo', 'ac-', { type: 'direct', contact: 'academia', muted: true }, `
06-01 08:00 | academia | Olá, Iara! 💪 Bem-vinda à Ritmo Fit! Seu plano semestral começa hoje. Horário: seg a sex 5h às 22h, sáb 7h às 12h
06-01 08:30 | iara | obrigada!! 💪
06-03 19:20 | academia | Oi, Iara, aqui é o Wanderson, teu personal nas terças e quintas 🏋️ amanhã 6h30 tá confirmado?
06-03 19:40 | iara | confirmado! 6h30 é cedo demais, mas vamo
06-17 06:40 | academia | Iara, tô te esperando kkk
06-17 06:52 | iara | perdi a hora 😭 me perdoa, Wand
06-17 06:53 | academia | 10 burpees de multa na quinta
07-15 18:00 | academia | Iara, sentimos sua falta! 💪 Faz 10 dias desde o seu último treino. Bora voltar?
07-21 06:35 | academia | bom dia, sumida! hoje tem treino de perna 🦵
07-21 07:10 | iara | Wand, tô com um trabalho atrasado, quinta eu vou sem falta
08-06 06:30 | academia | quinta passada não veio também, hein 👀
08-06 07:00 | iara | eu sei, eu sei. fase de muito trabalho
08-06 07:01 | academia | treino de 30 min resolve. sem desculpa 😂
09-01 09:00 | academia | Olá, Iara! Sua mensalidade de setembro vence dia 5. Pague pelo app ou na recepção 😉
09-22 06:45 | academia | Iara, tô vendo que tu não vem há 3 semanas. tá tudo bem?
09-22 08:30 | iara | tá sim, Wand. só uma fase pesada. outubro eu volto, prometo
09-22 08:31 | academia | vou cobrar! 💪
10-01 09:00 | academia | Olá, Iara! Sua mensalidade de outubro vence dia 5. Pague pelo app ou na recepção 😉
10-12 08:00 | academia | Sentimos sua falta! 💪 Faz 21 dias desde o seu último treino. Que tal voltar hoje?
10-13 09:00 | academia | Olá, Iara! Sua mensalidade de outubro está em aberto. Evite a suspensão do plano 😉
`);

/* ===================== MANICURE ===================== */
const manicure = chat('manicure-jessica', 'mj-', { type: 'direct', contact: 'manicure', lastSeen: '2026-10-13T19:25' }, `
06-11 14:00 | iara | Jéssica, tem horário sábado de manhã?
06-11 14:10 | manicure | tenho 9h e 10h30, amiga
06-11 14:11 | iara | 9h!
06-11 14:12 | manicure | anotado 💅 vai querer a cor de sempre?
06-11 14:13 | iara | quero ousar: vermelho
06-11 14:14 | manicure | AMEI. ousadia 💅🔥
07-23 18:20 | manicure | amiga, tô com promoção de pé e mão a 55 essa semana
07-23 18:40 | iara | quinta 18h?
07-23 18:41 | manicure | fechado
08-27 20:00 | manicure | Iara, uma pergunta: quanto tu cobra um ensaio de família? queria fazer com os meninos antes do Lucas perder os dentes da frente kkk
08-27 20:20 | iara | pra tu faço preço de cliente fiel kkk. que tal uma troca? ensaio de família por 3 meses de unha
08-27 20:21 | manicure | TROCA ACEITA 😍😍
08-27 20:25 | iara | Praia do Futuro, fim de tarde. dia 26/09 pode?
08-27 20:26 | manicure | pode!! vou comprar roupa combinando pra todo mundo kkk
09-26 15:30 | manicure | Iara, tô saindo de casa, a Sofia quer levar a boneca, pode?
09-26 15:32 | iara | pode tudo! boneca, balde, pá. criança feliz é foto boa
09-26 18:40 | manicure | o Lucas não para de falar de ti kkkk obrigada, amiga 😭
09-26 18:45 | iara | vocês são lindos! prévia semana que vem 💛
10-02 21:00 | iara | Jéssica, prévia no teu e-mail! 💛
10-02 21:30 | manicure | !aud:24 | Amiga, eu tô chorando aqui com o Rogério. A foto da Sofia correndo com a boneca na areia é a coisa mais linda que eu já vi. Muito obrigada, viu? Vou imprimir e botar na sala.
10-02 21:35 | iara | 🥹💛
10-06 19:00 | iara | Jéssica, dia 16, sexta, tem horário? volto de viagem e quero ficar apresentável kkk
10-06 19:10 | manicure | 17h tá livre, anotei! primeira das três de permuta 💅
10-06 19:11 | iara | 🙌
10-13 19:20 | manicure | Oi, amiga! lembrete: sexta, 16/10, 17h 💅 confirma pra mim?
`);

/* ===================== JÉSSICA (prima, casamento 28/11) ===================== */
const jessicaPrima = chat('jessica-prima', 'jp-', { type: 'direct', contact: 'jessica-prima', lastSeen: '2026-10-13T20:25' }, `
05-30 19:00 | jessica-prima | PRIMAAAA 💍 tu vai ser minha madrinha? não aceito não como resposta
05-30 19:02 | iara | JÉSSICA 😭 claro que sim!!!!
05-30 19:03 | jessica-prima | 28 de novembro, Igreja Matriz, festa no Clube 🥹
05-30 19:05 | iara | já tô chorando e ainda faltam 6 meses
06-15 21:10 | jessica-prima | as madrinhas vão de verde, qualquer tom de verde. tu fica linda de verde
06-15 21:20 | iara | verde é comigo mesmo 💚
07-10 20:00 | jessica-prima | prima, a mãe tá enlouquecendo com a lista. 280 convidados 😩
07-10 20:05 | iara | 280 em Guaraciaba é a cidade inteira kkkk
07-10 20:06 | jessica-prima | e ainda tem gente reclamando que não foi chamada
07-10 20:10 | jessica-prima | !aud:33 | Prima, a mãe quer chamar até a moça da tapioca da feira, porque ela "sempre pergunta de mim". Eu disse que não dá. Aí o Éverton disse que se a tapioqueira vai, ele quer chamar o time de futebol inteiro. Socorro, eu vou fugir pra casar em Sobral.
07-10 20:12 | iara | kkkkkkkkk a tapioqueira vai sim, ela merece
08-02 15:00 | jessica-prima | prima, tu faz as fotos do making of? só o making of, por favor. o fotógrafo do casamento é o Sandro, mas ele não faz making of
08-02 15:20 | iara | faço! é o meu presente pra ti. mas aí eu me arrumo correndo kkk
08-02 15:21 | jessica-prima | 😭😭 te amo
09-04 12:00 | jessica-prima | prima, deixei teu convite com a tia Socorro. e o da Duda também, que ela vive passando lá
09-04 12:30 | iara | obrigada!! vou pedir pra mãe guardar
09-04 12:31 | jessica-prima | botei vocês duas na mesma mesa, do ladinho da pista 💃
09-20 08:30 | jessica-prima | prima, tu chega que horas? a mãe já tá fazendo a cabidela kkk
09-20 08:45 | iara | meio-dia tô aí! levando o refrigerante
09-27 22:00 | jessica-prima | prima, achei que tu tava meio calada no almoço. tá tudo bem?
09-27 22:30 | iara | tô sim, prima. só cansada, muito trabalho. no casamento eu tô inteira, prometo 💚
10-05 18:00 | jessica-prima | prova do vestido sábado que vem, vem comigo? dia 17
10-05 18:40 | iara | dia 17 eu tô em Fortaleza 😭 manda foto de tudo
10-09 19:00 | jessica-prima | prima, tu chegou?? vem comer bolo aqui amanhã cedo
10-09 19:30 | iara | cheguei! amanhã tô no evento do sítio, trabalhando. domingo eu passo aí 💚
10-09 19:31 | jessica-prima | combinado!!
10-11 09:55 | jessica-prima | prima
10-11 09:55 | jessica-prima | prima, por favor
10-11 10:30 | jessica-prima | !aud:28 | Prima, a mãe tá aqui chorando, disse que... Não. Eu não vou acreditar. Tu me prometeu que vinha aqui hoje comer bolo. Tu prometeu. Me liga, Iara.
10-11 22:40 | jessica-prima | o Éverton quer adiar o casamento. eu não sei de mais nada
10-12 21:10 | jessica-prima | foi o dia mais triste da minha vida. a Duda passou o velório inteiro do lado da tia Socorro
10-13 20:20 | jessica-prima | a tia Socorro disse que tu ia ficar braba se eu adiasse. então eu vou casar. e o teu lugar de madrinha vai ficar lá, com uma câmera em cima da cadeira
`);

/* ===================== TIA NÉIA (privado) ===================== */
const tiaNeia = chat('tia-neia-pv', 'tn-', { type: 'direct', contact: 'tia-neia', lastSeen: '2026-10-13T06:12' }, `
06-03 06:12 | tia-neia | Bom dia, sobrinha linda!! 🌹 Que o Senhor guie teus passos hoje e sempre | ::fwd
06-03 07:40 | iara | bom dia, tia 🌹
06-10 06:05 | tia-neia | !stk:☕
06-10 06:06 | tia-neia | Bom dia!! Café com Deus é o melhor café ☕🙏 | ::fwd
06-24 19:30 | tia-neia | !aud:47 | Iara, minha filha, aqui é a tia Néia. Eu queria pedir um favor. A igreja vai fazer a festa de São Pedro e o padre pediu fotos bonitas pro mural. Tu não podia mandar umas fotos daquelas tuas da Igreja Matriz? Aquelas do pôr do sol. Deus te abençoe.
06-24 20:10 | iara | mando sim, tia! amanhã te mando 3 em alta
06-25 18:00 | iara | tia, mandei no seu e-mail. se não abrir me avisa
06-25 18:30 | tia-neia | Abriu!!! O padre amou, disse que tu tem dom 🙏
07-09 06:00 | tia-neia | !aud:58 | Bom dia, minha sobrinha! Hoje é teu aniversário. A tia pede a Deus que te dê saúde, juízo, um bom marido e muito trabalho. Que Nossa Senhora te cubra com o manto dela. Parabéns, Iarinha. Beijo da tia.
07-09 09:00 | iara | obrigada, tia!! o marido pode esperar kkkk o resto eu aceito 💛
07-09 09:05 | tia-neia | Kkkkk tu é igual tua mãe
07-24 08:30 | iara | parabéns, tiaaa!!! 🎂 saúde e muita paz 💛
07-24 08:40 | tia-neia | Obrigada, meu amor 🙏🌹
08-10 06:20 | tia-neia | ATENÇÃO!!! Não atendam ligação de 0800 que pede pra digitar 1, é golpe que clona o zap!!! Repassem!!! | ::fwd
08-10 08:00 | iara | obrigada, tia 🙏
08-25 06:15 | tia-neia | !stk:🌹
08-25 06:15 | tia-neia | Bom dia! Deus no comando 🙏 | ::fwd
09-05 21:00 | tia-neia | Iara, tu viu que vai ter uma festa grande lá no sítio da família da Duda em outubro? O povo só fala nisso. Tu vai?
09-05 21:30 | iara | vou sim, tia, eu que vou fotografar 📸
09-05 21:31 | tia-neia | Que orgulho! Leva casaco que o sítio é frio
09-20 06:10 | tia-neia | Bom dia, família abençoada!!! Hoje é aniversário da minha cunhada Socorro 🎂🙏
09-20 07:00 | iara | 💛
10-01 06:00 | tia-neia | Bom dia! Outubro chegou, mês de Nossa Senhora Aparecida 🙏🌹 | ::fwd
10-07 06:05 | tia-neia | !stk:🙏
10-10 06:30 | tia-neia | Bom dia, sobrinha! Que bom que tu tá na serra. Bom trabalho hoje, Deus te acompanhe 🙏
10-10 08:50 | iara | obrigada, tia 💛 te vejo domingo na missa
10-11 11:10 | tia-neia | !aud:64 | Senhor, recebe a minha sobrinha Iara nos teus braços. Ela era luz, Senhor. Conforta o coração do meu irmão Toinho e da Socorro, que não tão aguentando. Nossa Senhora, cobre essa família com o teu manto. Amém. Eu sei que tu não vai ouvir, minha filha, mas a tia precisava rezar pra ti.
10-12 06:00 | tia-neia | !aud:38 | Iarinha, hoje é o teu enterro. A tia vai de branco como a tua mãe pediu. Rezei o terço inteiro por ti essa madrugada. Descansa, minha filha.
10-13 06:10 | tia-neia | Bom dia, minha sobrinha. Eu sei que tu não vai ler. Mas a tia vai continuar te mandando bom dia 🌹
`);

/* ===================== KAIQUE (editor de vídeo) ===================== */
const kaique = chat('kaique', 'ke-', { type: 'direct', contact: 'kaique', lastSeen: '2026-10-13T23:03' }, `
05-15 14:00 | kaique | Iara, terminei o primeiro corte do filme da Taís e do Robson. 4min30. te mando o link privado
05-15 14:30 | iara | vou ver agora!!
05-15 15:10 | iara | Kaique, ficou lindo. só três coisas: a música entra muito cedo, o pai da noiva chorando tem que ficar mais tempo e o drone do final tá azulado demais
05-15 15:12 | kaique | o azul é a tua LUT kkk
05-15 15:13#lut | iara | a minha LUT é quente, homi! tu aplicou a errada
05-15 15:20 | kaique | ...apliquei a "Ibiapaba Quente v1", não a v3. corrigindo 🙃 | ::reply=lut
05-22 19:00 | kaique | versão final no drive. render em 4K levou 3 horas, meu PC quase decolou
05-22 19:10 | iara | obrigada!!! a noiva vai chorar. mando hoje
05-22 21:40 | iara | ela chorou kkk aprovado sem alteração 🎉
05-22 21:41 | kaique | 🥹 ninguém aprova sem alteração. tô emocionado
06-30 22:10 | kaique | Iara, me manda aquela tua LUT de pele do ensaio da praia? o meu cliente tá parecendo um camarão
06-30 22:15 | iara | kkkkk mando, mas baixa o vermelho dele antes de aplicar
07-12 18:00 | kaique | tem um 15 anos em agosto pedindo vídeo + foto. topa dividir?
07-12 18:30 | iara | topo! dia?
07-12 18:31 | kaique | 22/08, sábado, em Messejana
07-12 18:35 | iara | fechado, anota aí
08-22 23:50 | kaique | sobrevivemos ao 15 anos. a debutante dançou 7 valsas 😵
08-22 23:52 | iara | 7!!! eu contei 8 kkkk meus pés
08-28 10:00 | kaique | o HD externo do 15 anos tá comigo, devolvo semana que vem
09-08 15:00 | kaique | Iara, o HD tá fazendo barulho de grilo. copiei tudo antes, relaxa
09-08 15:10 | iara | Kaique!!! barulho de grilo é HD morrendo. me devolve o material em outro kkk
09-08 15:11 | kaique | já comprei outro. o grilo descansou
09-30 11:00 | iara | Kaique, topa um drone em Beberibe dia 21/11? casamento pé na areia, R$ 600 a tua parte
09-30 11:20 | kaique | topo demais. levo a bateria extra
09-30 11:21 | iara | 🙌 confirmo com a noiva
10-08 21:00 | iara | Kaique, semana que vem te mando o material de um evento grande de sábado. aftermovie de 1 minuto, prazo curto, pode?
10-08 21:15 | kaique | pode. me manda o bruto até terça que eu entrego quinta
10-08 21:16 | iara | combinado. aplico a LUT antes pra adiantar
10-12 10:20 | kaique | Iara, bom dia! já liberei a agenda pra terça. me manda o link do bruto quando subir
10-12 17:45 | kaique | Iara. me mandaram a notícia agora. não
10-12 17:46 | kaique | eu tava aqui com a timeline aberta te esperando
10-13 23:02 | kaique | vou guardar a Ibiapaba Quente v3. ninguém mais vai usar. só tu sabia acertar a pele com ela
`);

/* ===================== PROFª HELOÍSA (pós) ===================== */
const profHeloisa = chat('prof-heloisa', 'ph-', { type: 'direct', contact: 'prof-heloisa', lastSeen: '2026-10-13T17:35' }, `
05-11 16:00 | prof-heloisa | Boa tarde, Iara. Sou a Heloísa, vou orientar o teu TCC da especialização. Li o pré-projeto: as rendeiras de Guaraciaba dão um belo ensaio. Podemos conversar quinta, 18h, online?
05-11 16:40 | iara | Boa tarde, professora! Que bom, fiquei muito feliz. Quinta 18h perfeito
05-14 18:00 | prof-heloisa | O link da sala está no teu e-mail.
05-14 19:20 | iara | obrigada pela conversa, professora! vou reler a Sontag como a senhora sugeriu
06-20 10:00 | prof-heloisa | Iara, lembrete: o projeto revisado é até 31/08. Pense no recorte. Rendeiras hoje ou memória das rendeiras?
06-20 11:00 | iara | hoje, com a memória entrando pelas mãos delas. tô pensando em só close de mão e um retrato no fim
06-20 11:05 | prof-heloisa | Gosto. Só não romantize a pobreza. Mostre o trabalho, não a miséria.
06-20 11:06 | iara | anotado 🙏
08-30 23:40 | iara | professora, mandei o projeto revisado agora. desculpa o horário kkk
08-31 07:10 | prof-heloisa | Recebido. Todo mundo manda às 23h. Leio esta semana.
09-04 14:00 | prof-heloisa | Projeto aprovado, com pequenas correções no e-mail. A foto da Dona Mazé com o bilro é forte. Será a abertura?
09-04 14:30 | iara | será! ela vai estar numa exposição em Sobral também 🥹
09-04 14:31 | prof-heloisa | Ótimo. Cite isso no artigo.
09-28 20:00 | iara | professora, posso pedir uma semana a mais na versão parcial? tô com um trabalho pesado até meados de outubro
09-28 21:15 | prof-heloisa | Pode. Nova data: 07/10. Não mais que isso.
10-07 22:50 | iara | professora, parcial enviada! 12 fotos e 8 páginas do artigo
10-08 08:30 | prof-heloisa | Recebido. Comentários até o dia 16. A versão final continua em 30/10.
10-08 08:45 | iara | combinado 🙏
10-12 09:00 | prof-heloisa | Iara, li a parcial. A sequência das mãos está muito boa. Precisamos conversar sobre o texto, que está tímido perto das fotos. Quinta, 18h?
10-13 17:30 | prof-heloisa | Iara, a coordenação me avisou agora. Sinto muito. Vou pedir à família autorização para exibir as fotos da Dona Mazé na banca de novembro, em tua homenagem.
`);

/* ===================== LENTE & CIA (loja de usados) ===================== */
const lenteCia = chat('lente-cia', 'lc-', { type: 'direct', contact: 'lente-cia', muted: true }, `
07-03 11:00 | iara | Oi! Vocês têm 35 mm f/1.8 usada? mesma montagem da minha 24-70
07-03 11:20 | lente-cia | Bom dia! Rômulo aqui. Tenho uma 35 1.8 em estado 9/10, R$ 1.950, e uma 35 1.4 mais antiga por R$ 2.700
07-03 11:22 | lente-cia | as duas testadas, com nota
07-03 11:30 | iara | a 1.8 tem fungo? marca de queda?
07-03 11:35 | lente-cia | zero fungo, só um risquinho no para-sol. te mando foto do vidro com lanterna
07-03 11:40 | iara | manda! e aceita a minha 50 mm na troca?
07-03 12:10 | lente-cia | aceito na avaliação. tua 50 entra uns R$ 600 se tiver boa
07-03 12:12 | iara | vou pensar com carinho 🤔
07-18 15:00 | lente-cia | Iara, a 35 1.8 ainda tá aqui. tem um rapaz interessado, quer que eu segure?
07-18 15:30 | iara | segura até o fim do mês? tô esperando entrar um pagamento atrasado
07-18 15:31 | lente-cia | seguro até dia 31
08-01 10:00 | lente-cia | Iara, passou o dia 31 kkk vou liberar pro rapaz, tudo bem?
08-01 10:30 | iara | pode liberar 😩 o pagamento não entrou ainda
08-01 10:31 | lente-cia | quando chegar outra eu te aviso primeiro
09-09 16:00 | lente-cia | Chegou uma 35 1.8 seminova de verdade, 10/10, R$ 2.050. Te interessa?
09-09 17:10 | iara | interessa, mas só depois de outubro. me avisa se ainda tiver em novembro?
09-09 17:11 | lente-cia | aviso sim 👍
09-22 11:00 | lente-cia | Promoção de setembro: limpeza de sensor por R$ 120 🔧 | ::fwd
10-11 10:15 | lente-cia | Bom dia, Iara! A 35 ainda tá aqui. Faço por R$ 1.900 pra ti se fechar essa semana
10-13 11:00 | lente-cia | Iara? aguardo teu retorno 👍
`);

export default {
  chats: [
    turmaAnchieta, turmaSobral, comunicacaoUva, marinaNoiva, thalyta, bianca, cafeSerra, donaFatima,
    gabi, golpe, entregador, academia, manicure, jessicaPrima, tiaNeia, kaique, profHeloisa, lenteCia,
  ],
};
