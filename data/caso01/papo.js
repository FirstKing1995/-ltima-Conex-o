// Papo — mensageiro na nuvem de Iara (vai até ter 13/10 23:12).
// O conteúdo é escrito em linhas compactas e expandido pelas funções abaixo:
//   "MM-DD HH:MM | quem | texto"                         texto (ano 2026; use "AAAA-MM-DD HH:MM" para outros anos)
//   "MM-DD HH:MM#tag | quem | texto"                     texto com id próprio (para respostas)
//   "... | quem | !img:nome | legenda"                   imagem   (assets/caso01/img/nome.jpg)
//   "... | quem | !vid:nome:segundos | legenda"          vídeo (miniatura nome.jpg)
//   "... | quem | !aud:segundos | transcrição"           áudio
//   "... | quem | !doc:idArquivo:Nome.pdf:tamanho | legenda"
//   "... | quem | !stk:😂"   "... | quem | !loc:lat:lng:Nome"   "... | quem | !call:in|out|missed:segundos"   "... | quem | !del"
//   quem = 'iara' | id do contato | telefone (só dígitos) | 'sis' (mensagem de sistema)
//   última coluna opcional começando com :: => ::st=delivered;react=👍,❤️;reply=tag;fwd;del=MM-DD HH:MM
// Mensagens recebidas depois de 23:47 de 10/10 (aparelho desligado) saem com pending:true.

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
      else if (cmd === 'aud') { m.kind = 'audio'; m.duration = +a[0]; m.transcript = cap; m.src = `assets/caso01/audio/papo_${from}_${when.replace(/[^0-9]/g, '')}.mp3`; }
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

/* ===================== GRUPO DO EVENTO ===================== */
const equipe = chat('equipe-evento', 'eq-', {
  type: 'group', name: 'Equipe Noite da Colheita 🌻', members: ['duda', 'lari', 'iara', 'marcos', 'caio', 'igor', 'ze'], pinned: true,
  about: 'Grupo da produção da Noite da Colheita · sáb 10/10 · Sítio Flor da Serra, Guaraciaba do Norte',
}, `
10-05 14:02 | sis | Lari criou o grupo "Equipe Noite da Colheita 🌻"
10-05 14:02 | sis | Lari adicionou você e mais 6 participantes
10-05 14:03 | lari | Pessoal, grupo criado 🌻 Noite da Colheita, sábado 10/10, Sítio Flor da Serra, Guaraciaba do Norte. Aqui a gente alinha tudo, nada de decisão por ligação, combinado?
10-05 14:05 | duda | Bem-vindos à minha casa kkkk 🌻 qualquer coisa de local, estrada, energia e comida é comigo e com o Seu Zé
10-05 14:12 | marcos | Arte do convite aprovada pelo Caio. Solto hoje à noite no Lume.
10-05 14:31 | iara | Oi gente! Eu sou a Iara, foto e vídeo do evento 📸 Lari, preciso do cronograma pra me posicionar
10-05 14:33 | lari | Te mando até quinta, Iara. Bem-vinda!
10-05 15:10 | ze | Boa tarde a todos. O gerador novo ja chegou, ta no galpao. Qualquer coisa me chamem
10-05 15:12 | duda | valeu Seu Zé 🌻
10-06 09:40 | igor | Bom dia. Igor, som da banda. Passagem de som sábado 15h, preciso de 4 tomadas no palco e camarim com água e gelo.
10-06 09:52 | lari | O camarim fica no anexo atrás do palco, o Seu Zé abre às 14h. Churrasco da banda combinado com a Duda.
10-06 10:03 | duda | Costela e linguiça, a banda vai comer bem 😋
10-07 11:20 | marcos | Sinal de internet: vou instalar link via satélite no galpão pra live do discurso.
10-07 11:35 | caio | Prioridade máxima: a live do discurso não pode cair. Marcos, teste na sexta.
10-07 11:36 | marcos | Teste sexta 18h.
10-08 16:02 | caio | Lembrete: todo material da Iara passa pelo Marcos antes de qualquer postagem.
10-08 16:10 | iara | Ok.
10-09 18:01 | lari | !doc:roteiro:Roteiro_Noite_da_Colheita_v4.pdf:412 KB | Roteiro final v4. Banda para às 23:25, discurso do Caio ao vivo às 23:30. Não atrasem, pelo amor de Deus 🙏
10-09 18:10 | marcos | Recebido.
10-09 18:25 | ze | !aud:10 | Dona Lari, o portão de trás tava emperrado, já engraxei, tá funcionando. Pode mandar a banda por ele.
10-09 18:40 | lari | Obrigada Seu Zé!!
10-10 08:30 | duda | !img:eq_ceu_manha | Céu limpo, zero chuva 🌻 vai ser perfeito
10-10 08:34 | marcos | Previsão confirmada. Sem plano B de chuva.
10-10 12:55 | lari | !loc:-4.1655:-40.6905:Galpão · Sítio Flor da Serra
10-10 12:56 | lari | Pra quem ainda não conhece, o GPS pega mal. Entra pela estrada de terra depois da igrejinha.
10-10 14:05 | iara | Gente, tô na casa dos meus pais em Guaraciaba, a Duda me pega 15:50 🚗
10-10 16:25 | iara | Cheguei! Que lugar lindo 😍
10-10 16:31 | lari | A casa sede está com café e bolo, quem quiser já passa lá
10-10 17:02 | iara | !img:eq_montagem_palco | Montagem do palco, o galpão tá lindo ✨
10-10 17:05 | marcos | Ótimo ângulo. Capta a faixa da Colheita bem visível.
10-10 18:31#cerca | iara | Gente, atenção: lá no mirante tem um trecho da cerca quebrado, bem perto da pedra. Se alguém for lá no escuro, cuidado.
10-10 18:33 | duda | ah é antiga kkk já pedi mil vezes pro Seu Zé arrumar | ::reply=cerca
10-10 18:35 | ze | Arrumo segunda patroa, hoje to na luz e no gerador
10-10 18:42 | iara | !img:eq_por_do_sol | Pôr do sol lá do mirante 🌅
10-10 18:44 | lari | LINDO. Posso usar nos stories da produção?
10-10 18:45 | iara | Pode!
10-10 19:00 | lari | Portões abertos! 🎉
10-10 19:52 | iara | !img:eq_credenciamento | Fila do credenciamento já na porta
10-10 20:00 | lari | Jantar servido na casa sede e no galpão. Equipe come em revezamento, ninguém sai do posto sem avisar!!
10-10 20:14 | duda | Alguém viu minha bolsa vermelha? 😅
10-10 20:16 | igor | tá no camarim, em cima da caixa
10-10 20:17 | duda | Salvou 🌻
10-10 20:58 | lari | Banda no palco em 2 minutos!
10-10 21:00 | lari | BANDA NO PALCO 🎶🔥 | ::react=🔥,🎉
10-10 21:05 | igor | Retorno ajustado, quem reclamou do som pode voltar
10-10 21:18 | marcos | Iara, capta o público dançando, vai pro reels de amanhã
10-10 21:30 | iara | !img:eq_publico_danca | Galpão lotado ❤️
10-10 21:40 | duda | A galera da serra tá amando 🌻🔥
10-10 22:05 | ze | a luz do estacionamento queimou, alguem tem lampada?
10-10 22:06 | lari | Tem na dispensa da casa sede, Seu Zé
10-10 22:24 | lari | gente, o vocalista e a Iara discutindo atrás do palco, alguém vê isso?
10-10 22:25 | marcos | Ixi. Isso pode pegar mal com o Caio.
10-10 22:27 | igor | Deixa que eu falo com ele. Ele bebeu um pouco.
10-10 22:33 | iara | Tá tudo certo, gente. Foi só um mal-entendido antigo. Obrigada, Lari.
10-10 22:34 | lari | Qualquer coisa me chama 🫶
10-10 22:51 | duda | !vid:eq_banda_video:24 | Essa banda é boa demais 🎶🌻
10-10 22:53 | marcos | Boa, Duda. Posta nos stories que eu repost no oficial.
10-10 22:55 | duda | Depois eu posto, o 4G aqui tá péssimo
10-10 23:05 | iara | vou descansar a câmera 10 min
10-10 23:10 | lari | Quem tem o roteiro à mão? Preciso do horário exato do discurso.
10-10 23:11 | marcos | 23:30 em ponto. A live começa junto.
10-10 23:24 | lari | Daqui a 1 min a banda para. Caio, se prepara.
10-10 23:26 | lari | banda parou, Caio subindo
10-10 23:27 | marcos | Live configurada, sinal ok 📶
10-10 23:28 | igor | Microfone do Caio ok.
10-10 23:36 | marcos | Alguém viu a Duda? O Caio tá procurando ela no palco.
10-10 23:37 | lari | Ela tava aqui agorinha. Duda?
10-10 23:40 | lari | !img:eq_banda_camarim | a banda atacando o churrasco no camarim 😂🍖
10-10 23:41 | marcos | kkkkk o cantor de chapéu de couro comendo costela
10-10 23:42 | igor | O Rafa não solta a costela 😂
10-10 23:46 | iara | Fui no mirante fazer uns timelapse. Já volto. | ::st=delivered;react=👍
10-10 23:49 | lari | Vai de lanterna, Iara! Tá escuro lá
10-10 23:52 | marcos | Live encerrada. Pico de 1.240 pessoas assistindo.
10-10 23:55 | duda | voltei, tava no banheiro, fila enorme 😩
10-10 23:57 | lari | Kkkk fila de banheiro de festa é sempre assim
10-11 00:15 | lari | alguém viu a Iara? o tripé dela tá aqui no camarim
10-11 00:17 | duda | Ela me disse que ia direto pra casa depois
10-11 00:20 | lari | ah ok, amanhã eu entrego o tripé
10-11 00:41 | igor | Banda indo embora. Valeu pela noite, galera!
10-11 01:10 | marcos | Resultado ótimo, Caio satisfeito. Descansem. Amanhã eu preciso do material bruto, Iara 🙏
10-11 06:41 | ze | Bom dia. Alguem da familia da dona Duda me ligue urgente
10-11 08:44 | duda | Gente... preciso contar uma coisa muito triste. A Iara... o Seu Zé achou ela no pé da Pedra Lisa. Ela caiu do mirante. 💔
10-11 08:46 | lari | O QUE? Não pode ser
10-11 08:47 | marcos | Como assim? Ela estava aqui ontem.
10-11 08:50 | igor | Meu Deus do céu
10-11 08:58 | lari | O tripé dela tá aqui comigo... eu disse que entregava amanhã...
10-11 09:20 | duda | A polícia tá aqui. Disseram que parece acidente. A cerca do mirante tava quebrada, eu pedi tanto...
10-11 10:15 | marcos | Sinto muito pela Iara. O Caio pediu que ninguém se manifeste nas redes por enquanto. Nota oficial em breve.
10-12 07:55 | duda | O velório é hoje às 10h na Igreja Matriz de Guaraciaba. A família pediu que quem for use branco 🤍
10-12 12:30 | lari | Obrigada a quem foi. A mãe dela agradeceu.
10-12 17:02 | marcos | Pessoal, favor devolver à produção qualquer material da Iara (cartões de memória, HD, pendrive). A Colheita precisa organizar o acervo do evento.
10-13 09:12 | caio | Comunicado: a Colheita Capital lamenta profundamente o falecimento da nossa colaboradora Iara Fontenele. Neste momento de luto, pedimos respeito à privacidade da família e que não sejam feitas especulações. Seguiremos com a agenda prevista.
10-13 09:20 | marcos | Nota oficial enviada à imprensa e às redes.
10-13 09:45 | duda | Obrigada, Caio. A Iara era minha irmã de alma 🌻
10-13 10:30 | lari | Mandei o tripé pelo correio pra família dela.
`);

/* ===================== VOCÊ (jogador) ===================== */
const voce = chat('voce', 'vc-', { type: 'direct', phone: '5585988124417' }, `
10-10 23:31 | iara | Bruna, é a Iara. Número novo? Salva esse. Tô indo encontrar ela no mirante agora. Vou gravar tudo. Se eu não te mandar nada até amanhã, o Théo sabe onde tá a pasta. | ::st=delivered
`);

/* ===================== NÚMERO DESCONHECIDO (chip da Duda) ===================== */
const desconhecido = chat('numero-desconhecido', 'nd-', { type: 'direct', phone: '5588996451209' }, `
10-10 21:47 | 5588996451209 | !del | ::del=10-10 23:45
10-10 21:50 | 5588996451209 | !del | ::del=10-10 23:45
10-10 21:52 | 5588996451209 | !del | ::del=10-10 23:45
10-10 21:55 | iara | ok. 23h30
`);

/* ===================== DUDA ===================== */
const duda = chat('duda', 'du-', { type: 'direct', contact: 'duda', lastSeen: '2026-10-13T21:45' }, `
05-20 10:14 | duda | AMIGAAAA a Colheita tá contratando fotógrafo pros eventos, falei de ti pro Caio 🌻🌻
05-20 10:15 | iara | sério?? kkkk quanto paga
05-20 10:16 | duda | 3.500 fixo por mês + extras. tu vai amar, é a tua cara
05-20 10:18 | iara | me manda o contato dele
05-20 10:19 | duda | mandei no teu zap. liga hoje que ele tá animado
05-22 18:40 | iara | assinei o contrato. tô nervosa kkkk
05-22 18:41 | duda | bora ganhar dinheiro juntas 🌻🌻🌻
05-22 18:42 | duda | e finalmente tu vai ter motivo pra vir mais na serra
06-12 20:05 | duda | !aud:13 | Amiga, tu não vai acreditar. A Lúcia do salão, aquela que casou com o Wagner, largou o marido e foi morar em Sobral com o professor de zumba. Eu tô passada. Me liga amanhã que eu te conto tudo, tá?
06-12 20:09 | iara | KKKKKKKKK não acredito
06-12 20:10 | iara | o do zumba?? aquele de 50 anos??
06-12 20:10 | duda | ele mesmo 😂😂
06-28 22:12 | duda | !img:duda_iara_saojoao | São João de Guaraciaba 2026, edição "a gente ficou velha" 🔥
06-28 22:15 | iara | essa foto tá linda!! me manda em qualidade
06-28 22:15 | duda | mandei no drive 🌻
07-12 21:38 | duda | amiga, tu continua usando o mesmo PIN no celular, né? vi tu digitando ontem kkkk
07-12 21:40 | duda | tua senha ainda é o aniversário do Bento? kkkk
07-12 21:42 | iara | para de saber minhas senhas 😂
07-12 21:43 | duda | 22 de março, nunca esqueço, dia do nosso netinho 🐶🌻
07-12 21:43 | iara | kkkkkk sua doida. vou trocar
07-12 21:44 | duda | tu não troca nada, tu é preguiçosa
07-12 21:44 | iara | ...é verdade
08-03 09:20 | duda | bom dia, minha estrela 🌻 tu vem no fim de semana do dia 15?
08-03 09:41 | iara | tô sem fôlego de trabalho, mas vou tentar
08-14 19:30 | duda | amiga, o povo da serra tá todo animado com a Colheita, tá todo mundo entrando
08-14 19:32 | iara | kkk tua mãe também?
08-14 19:33 | duda | minha mãe já tá no segundo aporte 🌻 rende 4% ao mês, tu já fez a conta?
08-14 19:35 | iara | sou só a fotógrafa, Duda. não entendo de investimento kkk
08-15 08:50 | duda | fui na casa dos teus pais ontem levar bolo de macaxeira da minha mãe. teu pai é um amor 🌻
08-15 09:12 | iara | ele me contou! disse que tu falou da Colheita o tempo todo kkk
08-15 09:13 | duda | kkk eu falo da Colheita até dormindo
09-06 11:02 | duda | pegou o convite do casamento da prima Jéssica? é em novembro
09-06 11:30 | iara | peguei. vou de vestido verde
09-20 17:15 | duda | tu tá estranha comigo?
09-20 17:40 | iara | tô só atolada
09-20 17:41 | duda | tá bom. mas se for outra coisa tu me fala, tá? a gente nunca escondeu nada uma da outra 🌻
09-25 20:30 | duda | ainda tá atolada?
09-30 09:00 | duda | vamos tomar um café quando tu vier?
09-30 21:14 | iara | semana que vem a gente se fala
10-01 22:14 | iara | Duda. preciso falar contigo e não consigo esperar até sábado
10-01 22:15 | duda | o que foi? tu tá me assustando 🌻
10-01 22:16 | iara | taxa de garantia.
10-01 22:16 | duda | que taxa?
10-01 22:17 | iara | não faz isso comigo. eu vi a tua planilha. a Colheita nunca cobrou taxa de garantia de ninguém. tem o nome do meu pai na tua lista.
10-01 22:19 | duda | Iara
10-01 22:19 | duda | eu posso explicar
10-01 22:20 | iara | R$ 30 mil, Duda. do meu pai. que planta milho e feijão.
10-01 22:22 | duda | eu ia devolver
10-01 22:22 | duda | foi só um empréstimo, o dinheiro da Colheita atrasou e eu tava apertada
10-01 22:24 | iara | empréstimo?? e os outros nomes da tua lista? as famílias da serra?
10-01 22:26 | duda | Iara pelo amor de Deus
10-01 22:27 | duda | me dá um tempo, eu resolvo, eu devolvo tudo
10-01 22:28 | duda | por favor. a gente é irmã desde a 4ª série
10-01 22:31 | iara | dia 12.
10-01 22:31 | iara | dia 12 eu entrego tudo pra quem tem que entregar. até lá tu devolve pra todo mundo.
10-01 22:33 | duda | entrega pra quem??
10-01 22:40 | iara | boa noite, Duda.
10-01 22:41 | duda | Iara
10-01 22:41 | duda | me responde
10-01 23:02 | duda | por favor não faz nada precipitado. eu te peço
10-03 11:20 | duda | oi amiga, tudo bem?
10-05 21:05 | duda | Iara, a gente precisa conversar
10-05 21:30 | iara | dia 12.
10-08 18:10 | duda | tu vem pro evento sábado, né? ainda conto contigo, minha casa é tua casa
10-08 18:40 | iara | vou. é trabalho.
10-09 20:15 | duda | te busco na casa dos teus pais amanhã às 15h50, pode ser?
10-09 20:30 | iara | pode. eu levo a câmera
10-10 15:48 | duda | tô na porta 🌻
10-10 15:49 | iara | já tô descendo
10-10 16:22 | duda | chegamos. vem conhecer o galpão montado
10-10 18:36 | duda | te vi lá no mirante de longe, fotografando. não quis atrapalhar
10-10 18:37 | duda | lembra que a gente ia lá matar aula?
10-10 18:39 | iara | lembro. era lá que a gente jurava que ia sair da serra
10-10 18:40 | duda | e a gente saiu. e voltou kkkk 🌻
10-10 21:33 | duda | tá com cara de quem vai chorar. bora esquecer isso hoje? hoje é a minha noite
10-10 21:40 | iara | eu tô trabalhando, Duda.
10-11 07:12 | duda | Iara, tu dormiu aonde?? tua mãe tá me ligando
10-11 07:13 | duda | me liga assim que ver isso
10-11 07:58 | duda | amiga, por favor atende
10-11 08:41 | duda | !call:missed
10-11 08:44 | duda | meu Deus, Iara
10-11 09:20 | duda | não pode ser
10-11 09:21 | duda | não pode ser
10-11 11:02 | duda | eu te amo tanto. me perdoa por tudo. me perdoa
10-11 14:30 | duda | !aud:13 | Iara... eu não sei nem o que falar. Tu me disse que ia direto pra casa, eu devia ter te levado. Eu devia ter ficado contigo. Tua mãe tá destruída, eu tô aqui com ela. Me perdoa, minha irmã. Me perdoa.
10-12 08:10 | duda | hoje é o teu velório, minha irmã. tô tentando ser forte por tua mãe
10-12 21:15 | duda | a polícia disse que foi acidente. a cerca. eu pedi tanto pro Seu Zé arrumar...
10-13 09:30 | duda | tô postando uma homenagem pra ti. todo mundo tá comentando 🌻
10-13 18:02 | duda | se tu pudesse me mandar um sinal
10-13 21:20 | duda | tua mãe me pediu pra juntar as fotos pra missa. tu tinha uma pasta com o trabalho todo, né? tu lembra a senha?
10-13 21:45 | duda | esquece, achei as fotos no drive
`);

/* ===================== PAI ===================== */
const pai = chat('pai', 'pa-', { type: 'direct', contact: 'pai', pinned: true, lastSeen: '2026-10-13T22:12' }, `
05-23 19:10 | iara | pai, arrumei um trabalho novo, numa empresa de Fortaleza, a Colheita Capital. vou fotografar os eventos deles
05-23 19:25 | pai | A da Dudinha? Ela já tinha me falado. Que Deus te abençoe filha, tu merece
05-23 19:26 | iara | obrigada pai ❤️
06-06 07:02 | pai | Bom dia filha, Deus te abençoe
06-06 07:30 | iara | bom dia pai 💛 como tá o Bento?
06-06 07:41 | pai | !img:bento_quintal | O danado tá deitado na sombra do pé de manga, nem liga pra nada
06-06 07:44 | iara | kkkkk que amor. dá um cheiro nele por mim
06-20 18:20 | pai | !aud:20 | Filha, aqui é seu pai. Choveu bem hoje, viu? A roça de feijão tá aprumando que dá gosto. Tua mãe tá com saudade, diz que tu só vem aqui quando tá com fome kkk. Quando tu vem, filha? Deus te abençoe.
06-20 19:02 | iara | !aud:6 | Oi pai! Eu vou em julho, tá? Dá um abraço apertado na mãe. Te amo.
07-04 12:10 | pai | Tua mae fez cuscuz com ovo, ta com saudade de ti
07-04 12:30 | iara | tô morrendo de saudade do cuscuz da mãe 😭
08-15 07:30 | pai | Filha a Dudinha veio aqui ontem trazer bolo, que menina educada. Falou muito de ti
08-15 07:52 | iara | kkk ela é assim mesmo, pai
09-12 20:20 | pai | Filha tu vem no aniversário da tua mãe dia 20?
09-12 20:45 | iara | vou sim pai! levo o bolo
10-02 19:10 | iara | pai, o senhor pagou alguma taxa pra Colheita da Duda? preciso saber, é sério. não conta pra mãe.
10-02 19:14 | pai | Paguei sim filha mas foi pra garantir, ela disse que era assim pra todo mundo da serra
10-02 19:15 | iara | quanto, pai?
10-02 19:17 | pai | 30 mil. Era o que eu tinha juntado do milho e do feijão, pra operar o joelho da tua mãe
10-02 19:18 | iara | meu Deus pai
10-02 19:19 | pai | Foi a Dudinha que organizou, filha, ela é de casa
10-02 19:21 | iara | o senhor tem o comprovante?
10-02 19:25 | pai | !img:comprovante_pai | Comprovante Pix R$ 30.000,00 · 14/08/2026 · Para: MARIA EDUARDA S ANDRADE · Chave: (88) 99645-1209 · Taxa de garantia
10-02 19:25 | pai | O comprovante tá ai filha, taxa de garantia, pix pra Maria Eduarda
10-02 19:27 | pai | Aconteceu alguma coisa filha? Tu me assustou
10-02 19:30 | iara | nada ainda pai. mas não paga mais nada pra ninguém, tá? nem pra Duda. depois eu explico
10-02 19:31 | pai | Tá bom filha. Tu tá me deixando preocupado
10-02 19:32 | iara | tá tudo bem. te amo. não fala disso com ninguém, nem com a Duda
10-02 19:33 | pai | Tá bom ❤️
10-03 08:12 | pai | Bom dia filha. Tua mãe perguntou porque tu tava tão séria no telefone. Eu disse que era cansaço do trabalho
10-03 08:30 | iara | foi isso mesmo pai. fica tranquilo
10-05 20:10 | pai | !call:in:150
10-09 17:05 | iara | pai, cheguei na van, tô na praça. vem me pegar?
10-09 17:08 | pai | Já to chegando de moto, filha
10-09 21:40 | pai | Tua mae fez o doce de leite que tu gosta
10-10 09:05 | pai | Filha, o café tá na mesa e o Bento já tá te esperando
10-10 09:12 | iara | já vou pai!
10-10 12:40 | iara | pai, a Duda me pega 15:50, vou fazer o evento no sítio da família dela. volto tarde, não precisa esperar acordado
10-10 12:46 | pai | Tá bem filha. Vai com Deus. A Dudinha é de confiança
10-10 20:30 | pai | Como ta a festa filha?
10-10 20:47 | iara | tá linda pai, lotado. depois te mando foto 😘
10-10 20:48 | pai | ❤️
10-11 06:58 | pai | Filha bom dia. Tu nao dormiu aqui? A cama ta arrumada
10-11 07:10 | pai | A Dudinha disse que tu ia direto pra casa. Me liga filha
10-11 07:40 | pai | !call:missed
10-11 08:12 | pai | !call:missed
10-11 09:50 | pai | Filha
10-11 10:02 | pai | !aud:14 | Minha filha... minha filha... Eles disseram que... Deus, eu não quero acreditar. Atende o teu pai, por favor. Atende.
10-11 17:30 | pai | O Bento nao come desde cedo, ta deitado na porta do teu quarto
10-12 06:20 | pai | Hoje a gente vai te levar, filha. Eu vou de camisa branca como tu gostava
10-13 20:11 | pai | Filha eu pensei bem. Eu nao ligo pro dinheiro. Eu so queria tu aqui
10-13 21:40 | pai | Se alguem te fez mal eu quero saber filha. Me diz de algum jeito
`);

/* ===================== MÃE ===================== */
const mae = chat('mae', 'ma-', { type: 'direct', contact: 'mae', pinned: true, lastSeen: '2026-10-13T22:30' }, `
05-23 20:02 | mae | Filha, teu pai me contou do trabalho novo!! Que Deus te guarde 🙏
05-23 20:10 | iara | obrigada mãe 🤍 depois eu te ligo
06-14 07:45 | mae | Bom dia! Que Deus abençoe o seu dia 🌹🙏 | ::fwd
06-14 08:30 | iara | bom dia mãe 🤍
07-02 14:20 | mae | Filha, tu tá se alimentando direito? Teu pai disse que tu tá magra
07-02 14:35 | iara | tô comendo sim mãe kkk. o pai exagera
07-02 14:36 | mae | Come arroz com feijão, não vive de miojo
07-02 14:36 | iara | kkkkk tá bom
07-18 10:00 | mae | !aud:17 | Filha, é a mamãe. Eu fui no médico hoje, o joelho tá igual, ele falou em cirurgia mas eu não quero agora. Teu pai quer juntar um dinheirinho pra isso, mas eu digo que não precisa. Me liga quando puder, tá? Um beijo.
07-18 19:12 | iara | mãe, tu vai operar sim. a gente dá um jeito. eu ajudo
07-18 19:20 | mae | Deus te abençoe, minha filha
08-15 20:00 | mae | Dudinha veio aqui ontem, quanta educação aquela menina. Tua amiga é uma benção
08-15 20:40 | iara | é sim mãe
09-21 09:10 | mae | Obrigada por ter vindo ontem, filha. Foi o melhor presente
09-21 09:30 | iara | te amo mãe 🤍
10-05 20:10 | mae | Filha, teu pai disse que tu tava triste no telefone. Tem alguma coisa te preocupando?
10-05 20:40 | iara | é só trabalho mãe. semana que vem eu vou aí e a gente conversa
10-09 16:02 | iara | mãe, tô passando em Ipu, chego umas 17h
10-09 16:05 | mae | Vem com Deus. Tô fazendo o doce de leite
10-10 17:20 | mae | Filha tu levou casaco? Lá no sítio venta de noite
10-10 17:30 | iara | levei mãe 🧥
10-10 21:30 | mae | Já jantou? Deus abençoe
10-10 21:50 | iara | já mãe, tô trabalhando. beijo 🤍
10-11 08:05 | mae | Filha cadê tu
10-11 08:06 | mae | !call:missed
10-11 08:31 | mae | !call:missed
10-11 08:50 | mae | Filha por favor atende
10-11 09:28 | mae | A Maria Eduarda ligou. Tá dizendo coisa que eu não quero acreditar
10-11 10:12 | mae | !aud:10 | Minha filha, atende a mamãe... Dizem que acharam tu... Eu não quero... Tu falou que ia pra casa... Ai, meu Deus...
10-11 10:40 | mae | Minha filha
10-11 15:05 | mae | O padre veio rezar com a gente
10-12 06:30 | mae | Hoje é o dia, minha filha
10-13 18:40 | mae | Filha, tua mãe aqui. Eu não vou apagar esse número. Vou continuar escrevendo
`);

/* ===================== THÉO ===================== */
const theo = chat('theo', 'th-', { type: 'direct', contact: 'theo', lastSeen: '2026-10-13T22:55' }, `
07-30 22:10 | iara | corujão, tu dorme nunca?
07-30 22:11 | theo | dorme quem não tem prazo
07-30 22:12 | iara | !stk:🦉
08-10 21:02 | iara | corujão, tu viu o evento da Colheita no Lume? parece golpe ou eu tô paranoica?
08-10 21:05 | theo | manda o site
08-10 21:40 | theo | domínio registrado em março. cnpj existe, capital social de 10 mil reais. tu tá fotografando pra isso?
08-10 21:41 | iara | tô. 3.500 por mês
08-10 21:42 | theo | hm
08-10 21:42 | theo | fica de olho
08-24 18:15 | theo | tu mandou o orçamento do casamento da marina?
08-24 18:30 | iara | mandei sim. ela quis desconto kkk
08-24 18:31 | theo | o clássico
09-28 23:10 | iara | corujão, acho que é pirâmide. prometem 4% ao mês "lastreado em contratos de safra"
09-28 23:12 | theo | 4% ao mês é 60% ao ano. só pirâmide paga isso
09-28 23:13 | iara | as fazendas dos vídeos... eu edito e é sempre a mesma paisagem com a cor mudada
09-28 23:14 | theo | tu tem prova?
09-28 23:15 | iara | tô juntando
09-28 23:15 | theo | junta. e não conta pra ninguém da empresa
10-03 14:00 | iara | corujão, preciso de um favor grande. posso ligar?
10-03 14:01 | theo | liga
10-03 14:05 | iara | !call:out:252
10-03 14:12 | theo | tá. vou montar o espelho. cópia cifrada do teu celular que sincroniza sozinha com a nuvem
10-03 14:13 | theo | mensagens, fotos, gravações, tudo. a chave fica só comigo
10-03 14:14 | iara | se acontecer alguma coisa, você sabe o que fazer
10-03 14:14 | theo | não gosto dessa frase
10-03 14:15 | iara | é só garantia kkkk
10-03 14:16 | theo | a pasta segura entra no espelho?
10-03 14:17 | iara | entra. a senha tu não precisa, quem for abrir vai saber
10-03 14:18 | theo | isso é perigoso, iara. se descobrirem que eu acessei teus dados sem ordem eu perco o emprego
10-03 14:18 | iara | por isso é só se acontecer. promete
10-03 14:19 | theo | prometo
10-03 21:30 | theo | espelho no ar. primeira sincronização completa
10-03 21:31 | iara | corujão, tu é o melhor 🦉
10-03 21:32 | theo | vai dormir
10-08 22:15 | theo | o espelho acusa teu celular ligado e sincronizando. tudo certo aí?
10-08 22:30 | iara | tudo. sábado é o evento. depois a gente conversa pessoalmente
10-09 20:00 | iara | tô na serra. dias de roça
10-09 20:01 | theo | bom evento. tô online se precisar
10-10 22:15 | iara | o Rafa tá aqui. é o vocalista da banda contratada. ninguém me avisou.
10-10 22:16 | theo | o ex? quer que eu ligue pra alguém aí?
10-10 22:17 | iara | não. tô bem. só fiquei com o estômago embrulhado
10-10 22:18 | theo | me manda mensagem quando sair de lá
10-10 22:19 | iara | mando
10-11 07:22 | theo | tu não mandou mensagem quando saiu de lá. tá tudo bem?
10-11 07:50 | theo | iara
10-11 09:58 | theo | acabei de ver a notícia
10-11 09:59 | theo | me diz que é mentira
10-11 10:10 | theo | eu vou fazer o que a gente combinou
10-11 22:40 | theo | ninguém vai mexer em nada. o espelho tá guardado
10-12 20:30 | theo | a polícia fechou como acidente. eu não acredito
10-13 22:50 | theo | eu vou dar um jeito, iara. juro
`);

/* ===================== CAIO ===================== */
const caio = chat('caio', 'ca-', { type: 'direct', contact: 'caio', lastSeen: '2026-10-13T20:10' }, `
05-26 09:10 | caio | Iara, bem-vinda à Colheita Capital. Combinado: R$ 3.500 mensais, Pix todo dia 5. Entregas por evento.
05-26 09:40 | iara | Obrigada, Caio! Animada.
06-05 10:00 | caio | Pix do mês enviado.
06-05 10:20 | iara | Recebido, obrigada.
06-18 15:30 | caio | O vídeo do evento de Sobral ficou excelente. Cliente aprovou.
06-18 15:45 | iara | Que bom! Fico feliz.
07-05 10:00 | caio | Pix do mês enviado.
07-05 10:12 | iara | Recebido!
07-23 11:02 | iara | Caio, queria fotografar os contratos de safra pro vídeo institucional. Pode?
07-23 11:20 | caio | Os contratos são sigilosos. Use as imagens das fazendas.
07-23 11:24 | iara | Quais fazendas? Cada vídeo mostra uma diferente.
07-23 11:30 | caio | Isso é logística. Siga o roteiro do Marcos.
08-05 10:00 | caio | Pix do mês enviado.
08-05 10:30 | iara | Recebido. Caio, a Fazenda Santa Rita da visita de ontem é de quem mesmo?
08-05 10:45 | caio | Parceira. Detalhes jurídicos ficam com o escritório.
09-05 10:00 | caio | Pix do mês enviado.
09-05 10:08 | iara | Recebido.
09-25 10:12 | caio | Iara, bom dia. Enviei um bônus de reconhecimento pelo seu desempenho: R$ 20.000,00. Sem compromisso.
09-25 10:40 | iara | Caio, devolvi o valor agora de manhã. Não posso aceitar.
09-25 10:44 | caio | Vi que devolveu. Por quê? É reconhecimento.
09-25 10:51 | iara | Prefiro receber só o combinado.
09-25 10:55 | caio | Entendo. Podemos conversar pessoalmente no evento.
09-25 10:56 | iara | Tá bom.
10-08 17:30 | caio | Iara, lembrando que o termo de confidencialidade assinado em maio segue vigente. Todo material bruto das captações pertence à Colheita Capital.
10-08 17:48 | iara | Recebi, Caio.
10-09 10:15 | caio | Confirmado: sábado, discurso às 23:30, você registra do palco.
10-09 10:30 | iara | Ok.
10-10 21:15 | caio | Depois do discurso, precisamos conversar. Sem drama.
10-11 08:20 | caio | Iara, me ligue assim que acordar.
10-11 12:05 | caio | Soube agora. Estou sem palavras.
`);

/* ===================== RAFA (bloqueado) ===================== */
const rafa = chat('rafa', 'rf-', { type: 'direct', contact: 'rafa', blocked: true }, `
2019-05-12 21:30 | rafa | linda, tu viu o vídeo que eu te mandei do ensaio da banda?
2019-05-12 21:32 | iara | vi! tão afinados kkk
2019-05-12 21:33 | rafa | !img:rafa_iara_2019 | a gente depois do show em Sobral
2019-05-12 21:35 | rafa | tu é a minha melhor plateia 🎤
2020-02-13 08:00 | rafa | feliz dia dos namorados antecipado, minha linda. te amo
2020-02-13 08:20 | iara | te amo também 🥰
2021-09-18 23:40 | rafa | por que tu não responde faz 3 horas
2021-09-18 23:41 | rafa | tô vendo que tu tá online
2021-09-18 23:50 | iara | tava no aniversário da Nanda, amor. o celular tava na bolsa
2021-09-18 23:51 | rafa | tava na bolsa mas tava online né
2021-09-18 23:52 | iara | Rafa, para
2022-04-02 20:12 | rafa | quem é o Théo que curtiu tua foto?
2022-04-02 20:13 | iara | é amigo da faculdade. já te falei dele mil vezes
2022-04-02 20:14 | rafa | manda a localização onde tu tá agora
2022-04-02 20:16 | iara | !loc:-3.6890:-40.3500:Café Margarida, Sobral
2022-04-02 20:20 | rafa | tá bom. desculpa. é que eu te amo demais
2022-12-31 23:58 | rafa | ano novo sem ti vai ser horrível
2023-02-11 02:14 | rafa | tu tá com quem??
2023-02-11 02:15 | rafa | atende
2023-02-11 02:15 | rafa | !call:missed
2023-02-11 02:30 | rafa | se tu me deixar eu não sei o que eu faço
2023-02-11 11:00 | iara | Rafa, a gente precisa conversar. eu não aguento mais esse controle
2023-03-14 19:40 | iara | acabou, Rafa. não me procura mais.
2023-03-14 19:41 | rafa | tu não pode fazer isso comigo
2023-03-14 19:41 | rafa | Iara
2023-03-14 19:42 | rafa | IARA
2023-03-14 19:55 | rafa | tu vai se arrepender disso
2023-03-14 20:12 | sis | Você bloqueou este contato
2026-08-02 21:10 | sis | Você desbloqueou este contato
2026-08-02 21:11 | rafa | oi, Iara
2026-08-03 14:30 | rafa | sei que tu não quer falar comigo. só queria dizer que tô melhor, tô na terapia faz um ano. queria pedir perdão pelo que eu fui
2026-08-03 14:31 | rafa | a banda vai ter uns shows na serra mês que vem. se um dia tu quiser conversar...
2026-08-04 09:00 | iara | Rafa, eu desbloqueei sem querer, tava limpando contatos. não responde mais.
2026-08-04 09:02 | rafa | tá. só uma coisa: tu tá linda nas fotos da Colheita
2026-08-04 09:03 | iara | como assim, fotos da Colheita?
2026-08-04 09:05 | rafa | no Lume, uai. eu vejo tudo que tu posta
2026-08-04 09:10 | sis | Você bloqueou este contato
`);

/* ===================== LÉO ===================== */
const leo = chat('leo', 'le-', { type: 'direct', contact: 'leo', lastSeen: '2026-10-13T20:40' }, `
08-22 12:10 | leo | prima, tu ainda mora no Benfica? vou fazer estágio perto daí
08-22 12:25 | iara | moro! tem sofá, tem cuscuz, tem Nanda reclamando 😂
08-22 12:26 | leo | kkkkk fechado
09-14 19:02 | leo | prima, tô entre estágio no fórum e escritório de advocacia. qual tu escolhe?
09-14 19:30 | iara | fórum. tu vai ver como o mundo funciona de verdade
09-14 19:31 | leo | kkk tá bom, mestre da vida
10-06 20:10 | iara | primo, pergunta de Direito: se eu assinei um termo de confidencialidade e descobri que a empresa pratica crime, posso denunciar?
10-06 20:18 | leo | pode e deve kkk. contrato não te obriga a ficar calada diante de crime. mas guarda as provas e só leva pra polícia ou imprensa, não sai espalhando
10-06 20:19 | iara | e se for pirâmide? tipo prometer lucro fixo alto pra quem entra
10-06 20:21 | leo | isso é crime contra a economia popular. por que, prima??
10-06 20:22 | iara | é pra um roteiro 😅
10-06 20:23 | leo | ixi. roteiro bom. cuidado hein
10-06 20:24 | iara | sempre
10-09 15:40 | leo | prima, tô em Fortaleza. vamos no Benfica comer tapioca amanhã?
10-09 15:55 | iara | tô indo pra serra agora, só semana que vem
10-09 15:56 | leo | beleza, semana que vem então
10-10 23:20 | leo | e aí, como tá a festa da firma? 😅
10-11 11:40 | leo | prima?
10-11 13:25 | leo | me falaram agora. não acredito
10-11 13:26 | leo | tô indo pra Guaraciaba com meus pais
10-12 06:50 | leo | hoje a gente vai te despedir, prima
10-13 21:00 | leo | pesquisei: se aparecer prova nova a família pode pedir pra reabrir o inquérito. se tu deixou alguma coisa me avisa de algum jeito
`);

/* ===================== NANDA ===================== */
const nanda = chat('nanda', 'na-', { type: 'direct', contact: 'nanda', lastSeen: '2026-10-13T19:35' }, `
08-03 21:10 | nanda | amiga, a conta de luz veio 187. tua metade é 93,50
08-03 21:15 | iara | te passo o Pix agora
08-03 21:16 | nanda | 🙏
08-30 19:00 | nanda | QUEM comeu meu iogurte grego??
08-30 19:02 | iara | não fui eu
08-30 19:02 | nanda | foi o gato do 4B só pode
08-30 19:03 | iara | kkkkkkk o gato abriu a geladeira
09-18 22:30 | iara | parabéns, Nanda!! te amo, obrigada por aguentar minha bagunça 🎂
09-18 22:35 | nanda | chorando aqui 😭 também te amo
09-28 22:40 | iara | nanda tu acha que é possível uma empresa render 4% ao mês de verdade?
09-28 22:42 | nanda | só se for golpe kkkk
09-28 22:43 | iara | foi o que eu pensei
09-28 22:43 | nanda | por quê?? tu não tá investindo né
09-28 22:44 | iara | não. tô trabalhando pra uma. e tô achando que é pirâmide
09-28 22:45 | nanda | AMIGA sai fora disso
09-28 22:46 | iara | depois eu te conto. segredo
10-05 18:10 | iara | comprei um relógio novo, o Pulso Band 4! mede até queda
10-05 18:11 | nanda | queda?? kkkk pra tu que vive tropeçando é perfeito
10-05 18:12 | iara | kkkkk
10-07 23:20 | iara | nanda, o Rafa me mandou mensagem de novo, de número que eu não conheço
10-07 23:21 | nanda | de novo?? isso já é perseguição, amiga
10-07 23:22 | iara | eu sei. tô tentando não dar bola
10-07 23:22 | nanda | guarda os prints. qualquer coisa a gente faz B.O.
10-10 20:12 | nanda | arrasa na festa! me manda foto da roça kkk
10-10 20:40 | iara | tá lindo aqui! te mando amanhã
10-11 09:00 | nanda | amiga, tua mãe me ligou agora
10-11 09:01 | nanda | AMIGA
10-11 09:10 | nanda | teu celular tá desligado. por favor liga
10-11 12:20 | nanda | não é verdade. não pode ser verdade
10-12 05:30 | nanda | tô no ônibus das 6h pra Guaraciaba
10-13 19:30 | nanda | tô no apê com as tuas coisas. teu quarto do jeito que tu deixou. vem pra casa, por favor
`);

/* ===================== LARI ===================== */
const lari = chat('lari', 'la-', { type: 'direct', contact: 'lari', lastSeen: '2026-10-13T18:50' }, `
09-22 10:00 | lari | Iara, tudo bem? Aqui é a Lari, da produção da Noite da Colheita. O Marcos passou teu contato.
09-22 10:20 | iara | Oi Lari! Tudo ótimo, vamos alinhar?
09-22 10:25 | lari | Preciso de foto + vídeo + um mini aftermovie de 1 min. Dá pra entregar na segunda depois do evento?
09-22 10:30 | iara | dá sim
09-30 14:12 | lari | Fechamos o local: Sítio Flor da Serra, da família da Duda. Tem galpão e um mirante lindo que vale uma foto
09-30 14:20 | iara | adoro mirante 🌅
10-06 15:00 | lari | Iara, tu pode chegar às 16h no sábado? A luz de fim de tarde é ótima pro sítio
10-06 15:10 | iara | posso chegar 16h30, a Duda me pega
10-09 18:20 | lari | Tá tudo certo pra amanhã? O equipamento é todo teu?
10-09 18:30 | iara | tudo meu. câmera, duas lentes e o tripé
10-10 14:01 | lari | Chego aí 15h30, qualquer coisa te ligo
10-10 22:36 | lari | tá tudo bem, Iara? Vi a discussão
10-10 22:38 | iara | tô sim. só cansada
10-10 22:39 | lari | 🫶 se precisar de mim
10-10 22:58 | lari | teu tripé tá ocupando o corredor do camarim, posso mover?
10-10 23:03 | iara | pode, só não perde. deixa no camarim que depois eu pego
10-11 09:00 | lari | Iara... meu Deus
10-11 09:01 | lari | eu não consigo acreditar
10-12 12:00 | lari | Tô com o teu tripé. Vou entregar pra tua família, prometo
10-13 18:50 | lari | A polícia perguntou quem falou com ela por último. Eu disse o que a Duda falou: que tu ia direto pra casa
`);

/* ===================== FAMÍLIA ===================== */
const familia = chat('familia', 'fa-', {
  type: 'group', name: 'Fontenele 🏡', members: ['pai', 'mae', 'iara', 'leo', 'tia-neia', 'tia-zuila'], muted: false,
  about: 'Família Fontenele. Proibido corrente de ódio, permitido corrente de bom dia.',
}, `
06-14 06:30 | tia-neia | Bom dia família! Deus abençoe 🌻🙏 | ::fwd
06-14 06:45 | mae | Amém 🙏
06-14 07:10 | tia-zuila | Bom dia
07-24 08:00 | pai | Hoje é o aniversário da Néia!! Parabéns minha irmã 🎂
07-24 08:05 | tia-neia | Obrigada meu irmão ❤️
07-24 08:20 | leo | Parabéns tia!! 🎉
07-24 09:00 | iara | Parabéns, tia Néia! Te amo ❤️ depois mando um abraço pessoalmente
08-29 07:00 | iara | !stk:🎂
08-29 07:02 | iara | Parabéns, pai!!! O melhor pai do mundo 💛
08-29 07:15 | pai | Obrigado filha. Deus te abençoe
08-29 07:30 | leo | Parabéns tio!
09-13 17:30 | tia-zuila | !aud:14 | Gente, é a Zuíla. Domingo que vem o almoço de aniversário da Socorro é lá em casa, cada um traz uma coisa. Eu faço a galinha de cabidela.
09-13 17:45 | mae | Eu levo o doce
09-13 17:46 | iara | levo refrigerante!
09-20 15:20 | iara | !img:familia_almoco | Aniversário da mãe, 56 anos de pura sabedoria 🥰
09-20 15:25 | tia-neia | Que lindos!!
10-09 18:05 | mae | A Iara chegou! Já tô fazendo o doce
10-09 18:10 | tia-neia | Que Deus a guarde na viagem
10-10 09:20 | iara | !img:bento_iara_manha | Bom dia da Iara e do Bento 🐶☕
10-10 09:25 | tia-zuila | Que lindo!!! Esse cachorro é a cara da senhora
10-10 09:26 | pai | O Bento já acordou mandando
10-10 09:30 | leo | kkkkk o Bento é meu primo preferido
10-11 10:45 | tia-neia | Meu Deus do céu, o que foi isso? Socorro, me liga
10-11 10:50 | tia-zuila | Não pode ser. A Iara?
10-11 11:20 | leo | Tô indo pra casa dos meus tios. Força família
10-11 11:25 | tia-zuila | Estou saindo pra Guaraciaba
10-12 06:15 | tia-neia | Hoje é o último adeus. Deus conforta a nossa família 🙏
10-12 13:40 | tia-zuila | Missa de sétimo dia sábado 17/10 às 19h na Igreja Matriz
10-13 10:10 | mae | Obrigada a todos. Orem por nós.
`);

/* ===================== BANAIS ===================== */
const marcos = chat('marcos', 'mk-', { type: 'direct', contact: 'marcos', lastSeen: '2026-10-13T17:40' }, `
09-23 10:02 | marcos | Iara, bem-vinda à pauta de outubro. Em anexo o briefing das visitas e dos eventos.
09-23 10:03 | marcos | !doc:briefing-colheita:Briefing_Eventos_Colheita_Out.pdf:286 KB | Briefing outubro. Atenção às regras de uso de imagem.
09-23 10:40 | iara | Recebi, Marcos. Vou ler.
09-30 11:15 | marcos | O Caio quer o vídeo institucional até dia 15. Sem especificar fazenda, usa as imagens de arquivo.
09-30 11:30 | iara | Imagens de arquivo de quê, exatamente?
09-30 11:35 | marcos | Das fazendas parceiras. Está na pasta compartilhada.
10-02 16:00 | marcos | Iara, preciso do material bruto do evento de Sobral até terça.
10-02 16:20 | iara | Te mando em pendrive na segunda, tá pesado demais pro drive.
10-02 16:21 | marcos | Pendrive não. Sobe no drive da empresa.
10-10 17:50 | marcos | Chegou bem no sítio? Qualquer coisa me chama.
10-10 18:05 | iara | Cheguei, tudo certo.
10-12 16:50 | marcos | Iara, preciso saber onde estão os cartões de memória da Noite da Colheita.
`);

const ze = chat('ze', 'ze-', { type: 'direct', contact: 'ze', lastSeen: '2026-10-13T06:10' }, `
10-09 19:20 | ze | Dona Iara boa noite, o Sr Toinho me falou que a senhora chega amanha. Quando precisar das chaves do galpao e so falar
10-09 19:35 | iara | boa noite Seu Zé! chego amanhã 16h. obrigada
10-10 18:34 | iara | !img:mirante_cerca | Seu Zé, essa cerca aqui no mirante tá quebrada. dá pra arrumar?
10-10 18:40 | ze | Vish dona, essa e velha. Vou ver amanha, hoje to na luz e no gerador
10-10 18:41 | iara | tá. só avisa o povo pra não chegar muito perto da pedra
10-10 18:42 | ze | pode deixar
10-11 07:20 | ze | Dona Iara. Fui eu que achei a senhora la embaixo. Perdoa esse velho.
10-11 07:21 | ze | Aquela cerca eu devia ter arrumado. Deus a tenha.
`);

const gas = chat('gas', 'gs-', { type: 'direct', contact: 'gas', archived: true }, `
07-18 17:05 | iara | Boa tarde, quero um botijão de gás, Rua do Benfica, apt 302
07-18 17:10 | gas | Boa tarde! R$ 125. Chego em 30 min
07-18 17:11 | iara | Pode ser Pix?
07-18 17:11 | gas | Pode sim
09-04 18:20 | iara | Quero outro botijão por favor, mesmo endereço
09-04 18:22 | gas | Tá certo! R$ 130 agora. 20 min
10-08 17:40 | iara | boa tarde, o próximo botijão eu peço quando voltar da viagem
10-08 17:42 | gas | Tranquilo! Boa viagem 🚚
`);

const condominio = chat('condominio', 'cd-', {
  type: 'group', name: 'Ed. Benfica Plaza 🏢', members: ['sindico', 'dona-fatima', 'nanda', 'iara', '5585987650044'], muted: true,
  about: 'Avisos do condomínio. Só assuntos do prédio, por favor.',
}, `
08-12 19:00 | sindico | Boa noite, moradores. Assembleia dia 20/08 às 19h no salão. Pauta: reforma do elevador.
08-12 19:05 | dona-fatima | Já era hora, esse elevador vive parado
08-12 19:40 | 5585987650044 | Vou levar a ata do ano passado
08-12 19:42 | nanda | a gente vai, né Iara?
08-12 19:43 | iara | vamos
08-20 20:50 | sindico | !doc:ata-assembleia:Ata_Assembleia_Agosto.pdf:198 KB | Ata da assembleia de hoje, para conferência.
09-14 07:35 | sindico | !del | ::del=09-14 07:36
09-14 07:36 | sindico | Desculpa, mensagem errada. A chave do bicicletário está na portaria.
09-28 21:00 | sindico | Lembrete: sexta, 02/10, dedetização. Fechem as janelas.
10-02 07:10 | dona-fatima | Alguém viu o gato do 4B? Voltou?
10-02 07:20 | nanda | o gato tá aqui no nosso corredor kkk
10-08 10:00 | iara | Pessoal, vou viajar amanhã e volto na terça. A Nanda fica no apê.
10-13 15:00 | sindico | Aos moradores: lamentamos o falecimento da moradora do 302, Iara Fontenele. Sinceras condolências à família.
10-13 15:12 | dona-fatima | Que menina querida, sempre educada. Meu Deus.
`);

const dentista = chat('dentista', 'dn-', { type: 'direct', contact: 'dentista', archived: true }, `
08-26 14:00 | dentista | Olá, Iara! Sua limpeza está marcada para 14/10 às 14h na Clínica Odonto Benfica. Confirma?
08-26 14:30 | iara | Confirmo, obrigada!
10-13 09:00 | dentista | Lembrete: sua consulta é amanhã às 14h. Confirma presença?
`);

export default {
  chats: [equipe, voce, desconhecido, duda, pai, mae, theo, caio, rafa, leo, nanda, lari, familia, marcos, ze, gas, condominio, dentista],
};
