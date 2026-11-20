// Instagram — rede social de Iara (nuvem: continua até ter 13/10, 23:12). Imagens em assets/caso01/img/.

const IMG = (n) => `assets/caso01/img/${n}.jpg`;
const AV = (n) => `assets/caso01/avatars/${n}.jpg`;
const c = (id, author, at, text, likes = 0) => ({ id, author, at, text, likes });
const prof = (handle, name, bio, followers, following, extra = {}) => ({ handle, name, bio, avatar: '', followers, following, verified: false, private: false, ...extra });

const ME = 'iarafontenele.foto';

export default {
  me: ME,

  profiles: [
    prof(ME, 'Iara Fontenele', "fotógrafa e videomaker 📸\nGuaraciaba do Norte → Fortaleza\nluz natural, gente de verdade\niara.fontenele@gmail.com", 4812, 623, { avatar: AV('iara'), posts: 214 }),
    prof('dudaandrade.oficial', 'Duda Andrade 🌻', "consultora @colheitacapital na Ibiapaba 🌱\nfilha da serra | gratidão sempre\nSítio Flor da Serra, Guaraciaba do Norte", 6240, 811, { avatar: AV('duda'), posts: 342 }),
    prof('colheitacapital', 'Colheita Capital', "Seu dinheiro cresce como a safra 🌱\n4% ao mês, lastreado em contratos de safra.\nEscritório: Av. Dom Luís, Aldeota, Fortaleza", 38900, 112, { verified: true, posts: 468 }),
    prof('caiomontenegro', 'Caio Montenegro', "CEO @colheitacapital | palestrante\n#mentalidadedecolheita\nFortaleza, CE", 21400, 340, { avatar: AV('caio'), verified: true, posts: 289 }),
    prof('rafaaguiar.voz', 'Rafa Aguiar', "vocalista | Forró Pé de Serra do Rafa 🎤\nSobral, CE\ncontratações pelo direct", 8930, 1204, { avatar: AV('rafa'), posts: 531 }),
    prof('visto.por.ultimo', 'visto por último', "só olhando.", 0, 1, { fake: true, posts: 0, recovery: { phone: "(88) 9••••-••56", email: "r•••••••••r@gmail.com" } }),
    prof('lari.producao', 'Lari Produção', "produção de eventos | Fortaleza/CE\ncada detalhe conta ✨\norçamentos: direct", 2310, 1050, { posts: 176 }),
    prof('theo.castro', 'théo castro', "análise de segurança. fortaleza.\n🦉", 214, 187, { avatar: IMG('theo_coruja'), private: true, posts: 3 }),
    prof('nanda.lopes', 'Nanda Lopes', "design | café | Fortaleza 🌴\ncolega de apê da @iarafontenele.foto", 1870, 902, { posts: 203 }),
    prof('ofarol', 'O Farol', "Jornal O Farol · jornalismo independente do Ceará desde 1998.\nPauta: ofarol.com.br/contato", 152000, 410, { verified: true, posts: 3820 }),
    prof('serranoticias', 'Serra Notícias', "O portal da Ibiapaba.\nGuaraciaba, Ubajara, Tianguá, Ibiapina, São Benedito, Ipu", 24300, 89, { verified: true, posts: 5120 }),
    prof('leofontenele', 'Léo Fontenele 🏛️', "Direito | UFC | primo da @iarafontenele.foto", 640, 420, { posts: 58 }),
    prof('marcos.colheita', 'Marcos Vieira', "marketing @colheitacapital | Fortaleza", 1180, 530, { posts: 94 }),
    prof('igormatos.som', 'Igor Som', "técnico de som e backline | Forró Pé de Serra do Rafa", 780, 610, { posts: 47 }),
    prof('bandadorafa.fc', 'Fã-clube Banda do Rafa', "fã-clube não oficial do Forró Pé de Serra do Rafa 🎶", 2100, 12, { posts: 160 }),
    prof('lenteviva.ce', 'Lente Viva · Equipamentos', "Câmeras, lentes e acessórios para fotógrafos do Ceará. Parcerias: direct.", 5400, 210, { verified: true, posts: 640 }),
    prof('mochilatrilha', 'Trilha Mochilas', "mochilas para quem faz da estrada um estúdio 🎒", 3200, 98, { posts: 120 }),
    prof('josue.agro', 'Josué Maciel', "agricultor | Ubajara", 312, 280, { posts: 12 }),
    prof('tia.neide', 'Neide Sousa', "avó, costureira, serrana 🌸", 120, 200, { posts: 31 }),
    prof('carlinhos.ibiapaba', 'Carlinhos', "Tianguá | motoboy | futebol de domingo", 450, 700, { posts: 77 }),
    prof('rodrigo.contabil', 'Rodrigo Tavares', "contador | planilha não mente", 980, 350, { posts: 215 }),
  ],

  posts: [
    /* ---------- Iara ---------- */
    {
      id: 'ia-bento-aniv', author: ME, at: '2026-03-22T19:40', media: [IMG('bento_aniversario')], ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "Bento, 3 aninhos hoje 🎂🐶 22 de março é o dia mais feliz do ano aqui em casa. Quem te viu, quem te vê, meu caramelo. #bento #caramelo #adote",
      likes: 612,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-03-22T19:52', "FELIZ ANIVERSÁRIO MEU SOBRINHO 🥳🎉🐶 a madrinha manda um osso gigante", 24),
        c('c2', 'nanda.lopes', '2026-03-22T20:03', "esse chapeuzinho!!! 😭😭", 9),
        c('c3', 'leofontenele', '2026-03-22T20:30', "o mais bonito da família, sem competição kkkk", 6),
        c('c4', 'theo.castro', '2026-03-22T21:10', "parabéns, bento. o dono manda foto do bolo pra mim também.", 3),
        c('c5', 'visto.por.ultimo', '2026-03-23T00:47', "ficou grande. eu lembro dele filhote no teu colo.", 0),
      ],
    },
    {
      id: 'ia-guardaroupa-0719', author: ME, at: '2026-07-19T17:30', media: [IMG('guardaroupa')], ratio: '1/1', place: 'Fortaleza, CE',
      caption: "arrumando o guarda-roupa e achando coisa que eu nem lembrava que tinha 😅 tudo vai pro brechó, menos a blusa verde. essa fica.",
      likes: 245,
      comments: [
        c('c1', 'nanda.lopes', '2026-07-19T17:41', "a blusa verde de Sobral??? essa blusa tem história hein", 5),
        c('c2', 'lari.producao', '2026-07-19T18:02', "manda o brechó pra mim que eu levo tudo 😂", 2),
        c('c3', 'visto.por.ultimo', '2026-07-19T22:03', "ainda guarda aquela blusa verde? 💚", 0),
      ],
    },
    {
      id: 'ia-duda-sitio-0802', author: ME, at: '2026-08-02T18:10', media: [IMG('duda_iara_0802')], ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "domingo no sítio com essa criatura 🌻 #amigas #serra",
      likes: 534,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-08-02T18:25', "te amo sua feia 🌻", 18),
        c('c2', 'nanda.lopes', '2026-08-02T19:00', "quero uma amiga assim", 4),
        c('c3', 'visto.por.ultimo', '2026-08-03T01:12', "linda nessa luz.", 0),
      ],
    },
    {
      id: 'ia-pais-0816', author: ME, at: '2026-08-16T19:03', media: [IMG('pais_terreiro_0816')], ratio: '4/3', place: 'Guaraciaba do Norte, CE',
      caption: "domingo com os velhos 🥹 meu pai mostrando o cercado novo das galinhas como se fosse a obra do século. tô guardando cada segundo.",
      likes: 421,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-08-16T19:20', "Seu Toinho arrasou!! 🌻 abraço nos dois", 11),
        c('c2', 'nanda.lopes', '2026-08-16T19:42', "aaah o Seu Toinho 😍", 3),
        c('c3', 'leofontenele', '2026-08-16T20:15', "tio Toinho é um gênio da engenharia avícola", 7),
      ],
    },
    {
      id: 'ia-fazenda-0819', author: ME, at: '2026-08-19T15:50', media: [IMG('visita_fazenda_0819'), IMG('visita_fazenda_0819b')], ratio: '4/3', place: 'Massapé, CE',
      caption: "Dia de campo com o time da @colheitacapital 🌽🎥 conteúdo novo saindo em breve. #colheitacapital #bastidores",
      likes: 310,
      comments: [
        c('c1', 'caiomontenegro', '2026-08-19T16:05', "Time de campo! Ficou ótimo, Iara.", 14),
        c('c2', 'marcos.colheita', '2026-08-19T16:12', "o vídeo vai ficar lindo!", 4),
        c('c3', 'carlinhos.ibiapaba', '2026-08-19T17:30', "onde é essa fazenda? parece boa", 1),
        c('c4', ME, '2026-08-19T17:48', "zona rural, amigo 😅", 2),
      ],
    },
    {
      id: 'ia-sobral-0912', author: ME, at: '2026-09-12T21:10', media: [IMG('encontro_sobral_0912')], ratio: '4/3', place: 'Sobral, CE',
      caption: "Bastidores do Encontro Safra em Sobral. Dia longo, salão cheio, resultado lindo 🎥 #colheitacapital",
      likes: 505,
      comments: [
        c('c1', 'caiomontenegro', '2026-09-12T21:25', "Time foda. Obrigado, Iara.", 20),
        c('c2', 'lari.producao', '2026-09-12T21:31', "melhor fotógrafa 🙌", 8),
        c('c3', 'marcos.colheita', '2026-09-12T21:40', "valeu demais!", 2),
      ],
    },
    {
      id: 'ia-pipoca-tbt', author: ME, at: '2026-09-17T08:15', media: [IMG('pipoca_2009')], ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "#tbt Pipoca, meu primeiro amor. 2009, o ano em que eu ganhei a primeira câmera e tudo começou 🐶📷",
      likes: 1204,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-09-17T08:30', "a Pipoca!!! 😭🌻 lembro dela comendo meu lanche", 33),
        c('c2', 'nanda.lopes', '2026-09-17T08:51', "AAAA a menina da foto 🥹", 7),
        c('c3', 'leofontenele', '2026-09-17T09:12', "foi a Pipoca que me ensinou a ter medo de cachorro kkkk", 12),
        c('c4', 'theo.castro', '2026-09-17T09:40', "começou tudo aí. e olha onde chegou.", 5),
      ],
    },
    {
      id: 'ia-bastidores-1010', author: ME, at: '2026-10-10T19:22', media: [IMG('selfie_camarim'), IMG('galpao_pronto')], ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "Noite da Colheita começando 🌻 camarim, tripé e muita coragem. Hoje eu fotografo tudo. #colheitacapital #noitedacolheita",
      likes: 388,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-10-10T19:31', "tá linda amiga 🌻🌻 bora arrasar", 12),
        c('c2', 'lari.producao', '2026-10-10T19:36', "camarim liberado pra você hoje 😂", 5),
        c('c3', 'caiomontenegro', '2026-10-10T19:44', "Boa noite a todos. Conto com o seu olhar, Iara.", 9),
        c('c4', 'nanda.lopes', '2026-10-10T19:58', "que blusa é essa??? manda o link 😍", 3),
      ],
    },

    /* ---------- Duda ---------- */
    {
      id: 'duda-familias-0925', author: 'dudaandrade.oficial', at: '2026-09-25T18:00', media: [IMG('encontro_sobral_0912')], ratio: '4/3', place: 'Sobral, CE',
      caption: "Cada família que entra na Colheita é uma família que cresce. Orgulho de levar isso pra nossa serra 🌻🌱 #colheitacapital #ibiapaba",
      likes: 744,
      comments: [
        c('c1', 'caiomontenegro', '2026-09-25T18:20', "Referência na serra. Obrigado, Duda.", 15),
        c('c2', 'tia.neide', '2026-09-25T18:41', "Deus abençoe minha filha", 6),
        c('c3', 'josue.agro', '2026-09-25T19:05', "Dona Duda, já fiz meu depósito. Tá tudo certo mesmo?", 2),
        c('c4', 'dudaandrade.oficial', '2026-09-25T19:12', "Tá sim, Seu Josué! Qualquer dúvida sobre a taxa de garantia eu resolvo direto com o senhor, me chama no zap 🌻", 4),
        c('c5', 'carlinhos.ibiapaba', '2026-09-25T20:30', "me chama no direct que eu quero entrar", 1),
      ],
    },
    {
      id: 'duda-luto-1012', author: 'dudaandrade.oficial', at: '2026-10-12T08:41', media: [IMG('duda_luto')], ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "minha irmã de alma. 4ª série, carteira de trás, a gente nunca mais se soltou. não sei escrever isso, Iara. descansa, minha flor. a serra inteira tá chorando 🌻 @iarafontenele.foto #IaraParaSempre",
      likes: 3120,
      comments: [
        c('c1', 'nanda.lopes', '2026-10-12T08:50', "não consigo acreditar. ela tinha acabado de me falar de domingo. 💔", 41),
        c('c2', 'lari.producao', '2026-10-12T08:58', "Duda, a gente tá com você. A Iara era luz.", 30),
        c('c3', 'caiomontenegro', '2026-10-12T09:20', "Nossos sentimentos à família. Iara era parte da nossa equipe.", 18),
        c('c4', 'marcos.colheita', '2026-10-12T09:31', "Força, Duda. Sei o quanto eram próximas.", 9),
        c('c5', 'leofontenele', '2026-10-12T09:45', "obrigado por cuidar dela e da minha família ❤️", 22),
        c('c6', 'tia.neide', '2026-10-12T10:02', "Deus conforta essa família. Tão nova...", 14),
        c('c7', 'carlinhos.ibiapaba', '2026-10-12T10:40', "a polícia falou que foi acidente mesmo?", 3),
        c('c8', 'dudaandrade.oficial', '2026-10-12T10:52', "foi, Carlinhos. A cerca do mirante cedeu. Ainda não consigo nem olhar pra aquela pedra.", 17),
        c('c9', 'josue.agro', '2026-10-12T11:30', "que tristeza. meus pêsames, Dona Duda.", 2),
      ],
    },

    /* ---------- Rafa ---------- */
    {
      id: 'rafa-show-1010', author: 'rafaaguiar.voz', at: '2026-10-10T21:12', media: [IMG('rafa_show')], ratio: '4/3', place: 'Sítio Flor da Serra',
      caption: "Noite de forró na serra com a galera da @colheitacapital! 🔥🎶 Guaraciaba do Norte, obrigado demais! #forropedeserra #ibiapaba",
      likes: 276,
      comments: [
        c('c1', 'igormatos.som', '2026-10-10T21:20', "o som tava lindo hoje, mestre 🔊", 4),
        c('c2', 'lari.producao', '2026-10-10T21:34', "arrasaram!", 6),
        c('c3', 'bandadorafa.fc', '2026-10-10T21:41', "bora de novo! 🎶", 2),
      ],
    },
    {
      id: 'rafa-foto-antiga-1012', author: 'rafaaguiar.voz', at: '2026-10-12T14:20', media: [IMG('rafa_foto_antiga')], ratio: '4/5', place: 'Sobral, CE',
      caption: "7 anos e um pedaço do meu coração foi embora. te amei do jeito que eu soube, Iara. descansa. 🕊️ @iarafontenele.foto",
      likes: 487,
      comments: [
        c('c1', 'lari.producao', '2026-10-12T14:31', "Rafa, apaga isso. Tem hora e tem lugar.", 29),
        c('c2', 'nanda.lopes', '2026-10-12T14:40', "você não tem o direito de usar a foto dela. ela te bloqueou, esqueceu?", 51),
        c('c3', 'leofontenele', '2026-10-12T14:52', "respeita a família.", 33),
        c('c4', 'dudaandrade.oficial', '2026-10-12T15:05', "Respeito, Rafa. Mas a gente prefere que isso fique pra família.", 20),
        c('c5', 'bandadorafa.fc', '2026-10-12T15:20', "força, Rafa 🙏", 6),
        c('c6', 'carlinhos.ibiapaba', '2026-10-12T15:48', "que triste, não acredito", 1),
      ],
    },

    /* ---------- Lari ---------- */
    {
      id: 'lari-montagem-1010', author: 'lari.producao', at: '2026-10-10T18:10', media: [IMG('galpao_montagem_2')], ratio: '4/3', place: 'Sítio Flor da Serra',
      caption: "Montagem da Noite da Colheita no Sítio Flor da Serra ✨ foto da @iarafontenele.foto, nossa fotógrafa, que nunca erra o ângulo",
      likes: 190,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-10-10T18:22', "vai dar tudo certo 🌻", 5),
        c('c2', 'caiomontenegro', '2026-10-10T18:30', "Time!", 3),
        c('c3', ME, '2026-10-10T18:41', "te amo, produtora", 6),
      ],
    },

    /* ---------- Colheita Capital e Caio ---------- */
    {
      id: 'colheita-banner-0930', author: 'colheitacapital', at: '2026-09-30T09:00', media: [IMG('colheita_banner')], ratio: '1/1',
      caption: "Rendimento de setembro: 4,0% ao mês, lastreado em contratos de safra. Seu dinheiro cresce como a safra. 🌱 #colheitacapital #safragarantida",
      likes: 1240,
      comments: [
        c('c1', 'josue.agro', '2026-09-30T09:20', "recebi certinho, valeu", 7),
        c('c2', 'tia.neide', '2026-09-30T09:48', "Deus abençoe 🙏", 5),
        c('c3', 'rodrigo.contabil', '2026-09-30T10:15', "4% ao mês dá mais de 60% ao ano. lastro em quê exatamente? cadê o registro na CVM?", 38),
        c('c4', 'colheitacapital', '2026-09-30T11:02', "Olá, Rodrigo! Nossa operação é de parceria rural. Enviamos o material completo por direct. 🌱", 1),
      ],
    },
    {
      id: 'colheita-safra-0904', author: 'colheitacapital', at: '2026-09-04T10:00', media: [IMG('visita_fazenda_0819')], ratio: '4/3',
      caption: "Safra de milho 2026: 18 contratos ativos em 7 municípios. A terra trabalha para você. 🌽 #colheitacapital",
      likes: 980,
      comments: [
        c('c1', 'carlinhos.ibiapaba', '2026-09-04T10:40', "tá bonita essa lavoura!", 3),
        c('c2', 'caiomontenegro', '2026-09-04T11:05', "Safra não mente.", 10),
      ],
    },
    {
      id: 'caio-recepcao-1010', author: 'caiomontenegro', at: '2026-10-10T20:05', media: [IMG('caio_recepcao')], ratio: '4/3', place: 'Sítio Flor da Serra',
      caption: "Hoje a Colheita desce a serra! Noite da Colheita no Sítio Flor da Serra, Guaraciaba do Norte. Obrigado, famílias! 🌻 Foto: @iarafontenele.foto #noitedacolheita",
      likes: 540,
      comments: [
        c('c1', 'marcos.colheita', '2026-10-10T20:11', "noite histórica!", 4),
        c('c2', 'dudaandrade.oficial', '2026-10-10T20:15', "🌻🌻🌻", 6),
      ],
    },
    {
      id: 'live-colheita', author: 'colheitacapital', kind: 'live', at: '2026-10-10T23:52', media: [IMG('live_caio_frame')], ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "Noite da Colheita ao vivo, com @caiomontenegro. Obrigado a quem esteve com a gente na serra! 🌱",
      likes: 842,
      comments: [],
      commentsCount: 12,
      live: {
        title: 'Noite da Colheita',
        start: '23:30', end: '23:52',
        media: [IMG('live_caio_frame')],
        transcript: [
          { t: '23:30:08', who: 'CAIO', text: "Boa noite, Guaraciaba do Norte! Boa noite, Ibiapaba! Estamos ao vivo no Instagram direto do palco da Noite da Colheita." },
          { t: '23:30:41', who: 'CAIO', text: "Quero agradecer à família Andrade, que abriu as portas do Sítio Flor da Serra pra gente." },
          { t: '23:31:05', who: null, text: "(a câmera passeia pela plateia; ao fundo, perto da porta do camarim, uma moça de camisa jeans e rabo de cavalo, de costas, digita no celular)", kind: 'sfx' },
          { t: '23:31:20', who: 'CAIO', text: "Um ano atrás eu tinha uma ideia. Hoje são mais de duas mil famílias plantando com a Colheita." },
          { t: '23:32:35', who: 'CAIO', text: "Quatro por cento ao mês. Lastreado em contratos de safra. Safra não mente." },
          { t: '23:33:50', who: 'CAIO', text: "Eu sei que tem gente de fora que duvida. Deixa duvidar. O campo responde." },
          { t: '23:34:40', who: null, text: "(a imagem treme e muda de mão; agora a câmera fica parada ao lado do palco, mais baixa)", kind: 'sfx' },
          { t: '23:35:10', who: 'CAIO', text: "Quero chamar aqui, daqui a pouco, a nossa consultora da serra, a cara dessa operação. Depois eu chamo, que ela tá resolvendo as coisas da festa." },
          { t: '23:36:15', who: 'CAIO', text: "E nosso time de imagem, a Iara, nossa fotógrafa, que filma tudo e nunca aparece na foto." },
          { t: '23:37:20', who: 'CAIO', text: "Gente, a banda deu uma pausa pro meu discurso. Mas já já eles voltam." },
          { t: '23:38:12', who: 'CAIO', text: "E o Marcos, nosso marketing, que foi buscar gelo pra vocês. Isso é que é time!" },
          { t: '23:38:40', who: 'CAIO', text: "Gente, uma salva de palmas pro nosso time!" },
          { t: '23:39:30', who: null, text: "(aplausos e assobios na plateia)", kind: 'sfx' },
          { t: '23:40:12', who: null, text: "(transmissão interrompida: sinal fraco)", kind: 'sfx' },
          { t: '23:40:52', who: null, text: "(transmissão retomada)", kind: 'sfx' },
          { t: '23:40:55', who: 'CAIO', text: "...comendo um churrasquinho. Mas o último forró vem aí." },
          { t: '23:42:15', who: 'CAIO', text: "A distribuição de outubro cai na sexta, no Pix de cada um. Sem atraso. Nunca teve atraso." },
          { t: '23:42:20', who: 'CAIO', text: "Obrigado, Seu Zé, pela luz! Queimou o refletor e o homem resolveu na lanterna." },
          { t: '23:43:30', who: null, text: "(a câmera volta a mostrar o fundo do galpão: a porta do camarim, ninguém perto dela; Seu Zé, de chapéu de palha, segura uma lanterna apontada para a faixa da Colheita)", kind: 'sfx' },
          { t: '23:44:00', who: 'CAIO', text: "Esse vento da serra hoje tá de lascar, hein? Segurem os chapéus!" },
          { t: '23:46:30', who: 'CAIO', text: "Quem indicar um amigo até domingo ganha bônus de indicação. Fala com a Duda ou com o Marcos." },
          { t: '23:49:05', who: 'CAIO', text: "E quem nunca subiu no Mirante da Pedra Lisa, amanhã suba lá. O pôr do sol é de outro mundo." },
          { t: '23:51:20', who: 'CAIO', text: "Boa noite, gente! Segurança na estrada, tá? Fica com Deus. Obrigado, Colheita!" },
        ],
        comments: [
          { t: '23:30:20', author: 'josue.agro', text: "Boa noite Caio! 🙌" },
          { t: '23:30:55', author: 'tia.neide', text: "que festa linda, Deus abençoe" },
          { t: '23:31:40', author: 'carlinhos.ibiapaba', text: "tá bonito esse sítio" },
          { t: '23:32:50', author: 'rodrigo.contabil', text: "4% ao mês lastreado em quê exatamente?" },
          { t: '23:33:30', author: 'marcos.colheita', text: "Time Colheita no comando 🌱" },
          { t: '23:34:25', author: 'lari.producao', text: "o palco ficou lindo 😍" },
          { t: '23:36:10', author: 'tia.neide', text: "cadê a Iara que filma tudo?" },
          { t: '23:38:20', author: 'lari.producao', text: "Marcos herói do gelo 😂" },
          { t: '23:39:05', author: 'bandadorafa.fc', text: "a banda tá no camarim comendo kkkk" },
          { t: '23:40:58', author: 'josue.agro', text: "caiu aqui, voltou" },
          { t: '23:41:30', author: 'carlinhos.ibiapaba', text: "a câmera tá mais baixa agora kkk trocou o cinegrafista" },
          { t: '23:44:10', author: 'carlinhos.ibiapaba', text: "esse vento tá forte aí, hein" },
          { t: '23:51:30', author: 'josue.agro', text: "parabéns pela noite 👏" },
        ],
      },
    },
    {
      id: 'rafa-live-1010', author: 'rafaaguiar.voz', kind: 'live', at: '2026-10-10T23:49', media: [IMG('rafa_live_van')], ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "ao vivo da van 🎸 enquanto o patrão discursa, o forró não para",
      likes: 214,
      comments: [],
      commentsCount: 9,
      live: {
        title: 'ao vivo da van',
        start: '23:37', end: '23:49',
        media: [IMG('rafa_live_van')],
        transcript: [
          { t: '23:37:12', who: 'RAFA', text: "Ê, boa noite, meu povo! Tô aqui escondido na van, que lá dentro o patrão tá discursando." },
          { t: '23:37:40', who: null, text: "(Rafa de chapéu de couro, sentado no banco de trás de uma van branca, violão no colo; pelo vidro, atrás dele, as luzes do estacionamento e a lona do galpão)", kind: 'sfx' },
          { t: '23:38:30', who: 'RAFA', text: "Vou tocar uma pra quem não veio. Essa é de Luiz Gonzaga, mas do meu jeito." },
          { t: '23:38:45', who: null, text: "(violão; Rafa canta baixinho)", kind: 'sfx' },
          { t: '23:41:05', who: 'RAFA', text: "Quem tá chegando agora, boa noite! Comenta de onde tá assistindo." },
          { t: '23:42:10', who: 'RAFA', text: "Ibiapina, Tianguá, Sobral... Sobral, minha terra! Saudade, viu?" },
          { t: '23:43:20', who: 'VOZ (fora de quadro)', text: "Rafa, o Caio tá terminando já, viu? Dez minutos. A Lari vai te matar." },
          { t: '23:43:30', who: 'RAFA', text: "Tô indo, Bodinho, tô indo. Deixa eu só terminar essa." },
          { t: '23:44:10', who: 'RAFA', text: "O povo tá lá no discurso do patrão, eu tô aqui com vocês. Prioridade, né?" },
          { t: '23:45:00', who: null, text: "(violão; um carro passa devagar atrás da van, os faróis iluminam o barro do chão)", kind: 'sfx' },
          { t: '23:47:30', who: 'RAFA', text: "Não, não vou falar de ex aqui não, gente. Próxima pergunta." },
          { t: '23:48:40', who: 'RAFA', text: "Bora, que agora é o último forró. Valeu, meu povo! Beijo, Sobral!" },
        ],
        comments: [
          { t: '23:37:30', author: 'bandadorafa.fc', text: "AO VIVO DA VAN KKKKK" },
          { t: '23:38:10', author: 'carlinhos.ibiapaba', text: "boa rafa" },
          { t: '23:39:40', author: 'bandadorafa.fc', text: "tem que ter asa branca" },
          { t: '23:41:20', author: 'josue.agro', text: "Ubajara presente" },
          { t: '23:42:00', author: 'bandadorafa.fc', text: "Sobral te ama 🎤" },
          { t: '23:44:30', author: 'tia.neide', text: "que voz linda meu filho" },
          { t: '23:47:10', author: 'bandadorafa.fc', text: "e a ex? 👀" },
          { t: '23:48:50', author: 'carlinhos.ibiapaba', text: "valeu rafa 👏" },
        ],
      },
    },
    {
      id: 'colheita-comunicado-1013', author: 'colheitacapital', at: '2026-10-13T09:30', media: [IMG('colheita_comunicado')], ratio: '1/1',
      caption: "Comunicado: a Colheita Capital lamenta o falecimento de Iara Fontenele, fotógrafa e parte da nossa equipe. Nossas condolências à família e aos amigos. As atividades seguem normalmente.",
      likes: 410,
      comments: [
        c('c1', 'caiomontenegro', '2026-10-13T09:34', "Que a família encontre conforto.", 8),
        c('c2', 'rodrigo.contabil', '2026-10-13T10:05', "e o 'as atividades seguem normalmente'... tá bom.", 27),
        c('c3', 'tia.neide', '2026-10-13T10:40', "Deus conforta os pais dela 🙏", 4),
      ],
    },

    /* ---------- Imprensa e amigos ---------- */
    {
      id: 'ofarol-alerta-1002', author: 'ofarol', at: '2026-10-02T12:00', media: [IMG('ofarol_card')], ratio: '1/1',
      caption: "Investimento garantido, com rendimento fixo de 4% ao mês? Sete sinais de alerta antes de entregar o seu dinheiro: da falta de registro à promessa de lastro que ninguém vê. Leia na íntegra no link da bio. #educacaofinanceira #pirâmide",
      likes: 2210,
      comments: [
        c('c1', 'rodrigo.contabil', '2026-10-02T12:20', "esse é o caso da Colheita? 👀", 44),
        c('c2', 'carlinhos.ibiapaba', '2026-10-02T13:05', "meu cunhado entrou numa dessas", 12),
        c('c3', ME, '2026-10-02T14:20', "compartilhando com os meus.", 9),
      ],
    },
    {
      id: 'serra-noticias-1011', author: 'serranoticias', at: '2026-10-11T08:52', media: [IMG('serra_noticias_card')], ratio: '1/1', place: 'Guaraciaba do Norte, CE',
      caption: "Fotógrafa de 27 anos morre após queda em mirante na Serra da Ibiapaba. O corpo foi encontrado às 6h20 deste domingo (11) por um funcionário do Sítio Flor da Serra, em Guaraciaba do Norte. Segundo a Polícia Civil, tudo indica acidente. A perícia deve apontar a causa. @iarafontenele.foto #guaraciabadonorte #ibiapaba",
      likes: 1830,
      comments: [
        c('c1', 'tia.neide', '2026-10-11T09:05', "meu Deus, essa menina era de família conhecida", 15),
        c('c2', 'josue.agro', '2026-10-11T09:20', "a cerca daquele mirante já tava podre há tempo", 40),
        c('c3', 'carlinhos.ibiapaba', '2026-10-11T10:02', "ela tava numa festa da Colheita, né? ouvi dizer", 8),
        c('c4', 'rodrigo.contabil', '2026-10-11T11:30', "acidente numa noite dessas. vamos aguardar a perícia.", 19),
      ],
    },
    {
      id: 'nanda-apto-1011', author: 'nanda.lopes', at: '2026-10-11T10:05', media: [IMG('apto_varanda_0810')], ratio: '4/3', place: 'Fortaleza, CE',
      caption: "última foto que ela me mandou: a varanda do nosso apê, quinta à noite. as suculentas, o chá. não sei lidar. amiga, volta. 💔 @iarafontenele.foto",
      likes: 902,
      comments: [
        c('c1', 'lari.producao', '2026-10-11T10:20', "Nanda, estou aqui. Pra o que precisar.", 21),
        c('c2', 'leofontenele', '2026-10-11T10:41', "vou aí te ver hoje.", 15),
        c('c3', 'dudaandrade.oficial', '2026-10-11T11:00', "minha irmã... não sei nem o que dizer 🌻", 10),
      ],
    },
  ],

  stories: [
    { id: 'st-iara-0507', author: ME, at: '2026-05-07T06:10', media: [IMG('serra_amanhecer')], text: "bom dia, serra ☁️" },
    { id: 'st-iara-1827', author: ME, at: '2026-10-10T18:27', media: [IMG('mirante_vale_1814')], text: "a serra me cura 🌄 #pedralisa" },
    { id: 'st-lari-1930', author: 'lari.producao', at: '2026-10-10T19:30', media: [IMG('lari_portao')], text: "portões abertos! 🌻 bem-vindos à Noite da Colheita" },
    { id: 'st-lari-2105', author: 'lari.producao', at: '2026-10-10T21:05', media: [IMG('lari_banda')], text: "a banda do Rafa entrando no palco 🔥🎶" },
    { id: 'st-duda-2333', author: 'dudaandrade.oficial', at: '2026-10-10T23:33', media: [IMG('duda_video_banda')], text: "que noite 🌻🎶" },
    { id: 'st-lari-repost-duda', author: 'lari.producao', at: '2026-10-10T23:34', media: [IMG('duda_video_banda')], text: "que noite 🌻🎶", repostOf: { author: 'dudaandrade.oficial', at: '2026-10-10T23:33' } },
    { id: 'st-lari-2334', author: 'lari.producao', at: '2026-10-10T23:34', media: [IMG('lari_palco_caio')], text: "discurso do chefe 🙌" },
  ],

  highlights: [
    { id: 'lari-noite', author: 'lari.producao', title: 'Noite da Colheita', cover: IMG('lari_portao'), stories: ['st-lari-1930', 'st-lari-2105', 'st-lari-repost-duda', 'st-lari-2334'] },
    { id: 'hl-iara-serra', author: ME, title: 'Serra', cover: IMG('mirante_vale_1814'), stories: ['st-iara-0507', 'st-iara-1827'] },
  ],

  dms: [
    {
      id: 'dm-duda', with: 'dudaandrade.oficial',
      messages: [
        { id: 'm1', from: 'them', at: '2026-08-03T09:12', text: "vi que o Instagram tá bombando teu post 😍" },
        { id: 'm2', from: 'me', at: '2026-08-03T09:15', text: "kkkk foi tu que ficou bonita" },
        { id: 'm3', from: 'them', at: '2026-09-08T13:05', text: "tu vem pro evento mesmo? quero tu comigo no sítio" },
        { id: 'm4', from: 'me', at: '2026-09-08T13:20', text: "vou sim, chego sexta lá na casa dos meus pais" },
        { id: 'm5', from: 'them', at: '2026-09-24T21:30', text: "tu tá estranha comigo" },
        { id: 'm6', from: 'me', at: '2026-09-24T21:44', text: "tô só cansada" },
        { id: 'm7', from: 'them', at: '2026-10-09T20:22', text: "amanhã 15h50 passo aí. leva casaco que lá em cima esfria" },
        { id: 'm8', from: 'me', at: '2026-10-09T20:31', text: "levo 😘 obrigada por me buscar" },
        { id: 'm9', from: 'them', at: '2026-10-09T20:32', text: "🌻🌻" },
        { id: 'm10', from: 'them', at: '2026-10-11T07:12', text: "Iara... me diz que é mentira. por favor. 😭" },
        { id: 'm11', from: 'them', at: '2026-10-11T09:48', text: "amiga eu tô na casa da tua mãe, todo mundo chorando. onde tu foi parar" },
        { id: 'm12', from: 'them', at: '2026-10-12T11:30', text: "fiz um post pra ti. espero que tu goste. 🌻" },
      ],
    },
    {
      id: 'dm-nanda', with: 'nanda.lopes',
      messages: [
        { id: 'm1', from: 'them', at: '2026-09-19T17:40', text: "tô na praia, chega logo!" },
        { id: 'm2', from: 'me', at: '2026-09-19T17:42', text: "tô no Uber, 5 min" },
        { id: 'm3', from: 'them', at: '2026-10-05T17:10', text: "comprei pão e queijo pra tu, não esquece de comer" },
        { id: 'm4', from: 'me', at: '2026-10-08T21:12', text: "tô com a cabeça cheia. depois te conto tudo, tu nem acredita" },
        { id: 'm5', from: 'them', at: '2026-10-08T21:14', text: "tá tudo bem? tu vai pra serra amanhã?" },
        { id: 'm6', from: 'me', at: '2026-10-08T21:20', text: "vou. dia 12 muda tudo" },
        { id: 'm7', from: 'them', at: '2026-10-08T21:21', text: "que mistério hein 👀" },
        { id: 'm8', from: 'them', at: '2026-10-10T17:15', text: "tô vendo teus stories do sítio, que lindo!!" },
        { id: 'm9', from: 'them', at: '2026-10-11T08:40', text: "amiga me liga" },
        { id: 'm10', from: 'them', at: '2026-10-11T10:02', text: "a Duda me ligou. tô sem chão. por favor, me responde" },
      ],
    },
    {
      id: 'dm-lenteviva', with: 'lenteviva.ce',
      messages: [
        { id: 'm1', from: 'them', at: '2026-09-14T11:20', text: "Oi Iara! Aqui é da Lente Viva. Tem interesse em parceria? Cupom pra seus seguidores em troca de 3 posts." },
        { id: 'm2', from: 'me', at: '2026-09-14T12:05', text: "Oi! Tenho sim. Me manda os valores?" },
        { id: 'm3', from: 'them', at: '2026-09-14T12:10', text: "Mandamos por e-mail. Pode ser?" },
        { id: 'm4', from: 'me', at: '2026-09-14T12:12', text: "Pode, iara.fontenele@gmail.com" },
      ],
    },
    {
      id: 'dm-mochila', with: 'mochilatrilha',
      messages: [
        { id: 'm1', from: 'them', at: '2026-10-03T15:30', text: "Olá, Iara! Amamos seu trabalho. Podemos enviar uma mochila para você testar e divulgar? 🎒" },
      ],
    },
    {
      id: 'dm-visto', with: 'visto.por.ultimo',
      messages: [
        { id: 'm1', from: 'them', at: '2026-10-10T20:44', text: "te vi hoje. a blusa verde continua te caindo bem." },
      ],
    },
  ],

  notifications: [
    { at: '2026-03-02T01:15', text: "visto.por.ultimo começou a seguir você", actor: 'visto.por.ultimo' },
    { at: '2026-10-02T14:30', text: "ofarol curtiu seu comentário", actor: 'ofarol', post: 'ofarol-alerta-1002' },
    { at: '2026-10-10T19:31', text: "dudaandrade.oficial comentou na sua publicação: “tá linda amiga 🌻🌻 bora arrasar”", actor: 'dudaandrade.oficial', post: 'ia-bastidores-1010' },
    { at: '2026-10-10T19:44', text: "caiomontenegro comentou na sua publicação: “Boa noite a todos. Conto com o seu olhar, Iara.”", actor: 'caiomontenegro', post: 'ia-bastidores-1010' },
    { at: '2026-10-10T20:05', text: "caiomontenegro marcou você em uma publicação", actor: 'caiomontenegro', post: 'caio-recepcao-1010' },
    { at: '2026-10-10T23:30', text: "colheitacapital iniciou uma live: Noite da Colheita, às 23:30", actor: 'colheitacapital', post: 'live-colheita' },
    { at: '2026-10-10T23:33', text: "dudaandrade.oficial postou um story às 23:33", actor: 'dudaandrade.oficial' },
    { at: '2026-10-10T23:34', text: "lari.producao compartilhou um story com menção à equipe: “discurso do chefe 🙌”", actor: 'lari.producao' },
    { at: '2026-10-10T23:37', text: "rafaaguiar.voz iniciou uma live: ao vivo da van", actor: 'rafaaguiar.voz', post: 'rafa-live-1010' },
    { at: '2026-10-10T23:52', text: "A live de colheitacapital terminou às 23:52 e foi salva no perfil.", actor: 'colheitacapital', post: 'live-colheita' },
    { at: '2026-10-11T08:52', text: "serranoticias mencionou você em uma publicação", actor: 'serranoticias', post: 'serra-noticias-1011' },
    { at: '2026-10-11T10:05', text: "nanda.lopes mencionou você em uma publicação", actor: 'nanda.lopes', post: 'nanda-apto-1011' },
    { at: '2026-10-12T08:41', text: "dudaandrade.oficial marcou você em uma publicação", actor: 'dudaandrade.oficial', post: 'duda-luto-1012' },
    { at: '2026-10-12T14:20', text: "rafaaguiar.voz marcou você em uma publicação", actor: 'rafaaguiar.voz', post: 'rafa-foto-antiga-1012' },
    { at: '2026-10-13T09:30', text: "colheitacapital marcou você em uma publicação", actor: 'colheitacapital', post: 'colheita-comunicado-1013' },
  ],
};
