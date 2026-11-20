// Instagram — conteúdo extra (ruído): perfis, posts, stories, DMs e notificações que NÃO são pista.
// As listas são somadas às de data/caso01/lume.js. Isca: @eunice.sobreira (Maria Eunice Sobreira Andrade, mãe da Duda).
// Posts sem `media` são de propósito: aparecem como "foto ainda não baixada da nuvem".

const IMG = (n) => `assets/caso01/img/${n}.jpg`;
const AV = (n) => `assets/caso01/avatars/${n}.jpg`; // eslint-disable-line no-unused-vars
const c = (id, author, at, text, likes = 0) => ({ id, author, at, text, likes });
const prof = (handle, name, bio, followers, following, extra = {}) => ({ handle, name, bio, avatar: '', followers, following, verified: false, private: false, ...extra });

const ME = 'iarafontenele.foto';

export default {
  profiles: [
    prof('eunice.sobreira', 'Eunice Sobreira Andrade 🌻', "mãe da @dudaandrade.oficial · Sítio Flor da Serra\nserva de Deus 🙏 bolo, crochê e oração\ninvestidora orgulhosa @colheitacapital 🌱", 1342, 610, { posts: 487 }),
    prof('jessica.fontenele', 'Jéssica Fontenele 💍', "noiva do @thiago.paiva_ 💍 contagem regressiva pra novembro\nprofessora de Ciências | Guaraciaba do Norte", 1890, 1120, { posts: 312 }),
    prof('thiago.paiva_', 'Thiago Paiva', "engenheiro agrônomo | São Benedito\nnoivo da @jessica.fontenele", 760, 540, { posts: 64 }),
    prof('kel.araujo', 'Kel Araújo', "mãe do Benício 💙 | enfermeira\nGuaraciaba do Norte → Tianguá\n4ª B pra sempre", 1120, 980, { posts: 258 }),
    prof('tati.melo.nails', 'Tati Melo | Nail Designer', "💅 unhas em gel e fibra\nRua Cel. Firmino, Centro, Guaraciaba do Norte\nagenda pelo direct", 3480, 1290, { posts: 615 }),
    prof('mayara.sousa_', 'Mayara Sousa', "Guaraciaba do Norte 🌽 | pedagoga\nforró, café e família", 940, 870, { posts: 171 }),
    prof('camila.sa.jor', 'Camila Sá', "jornalista | rádio e podcast em Sobral 🎙️\nComunicação UVA 2017", 2210, 1330, { posts: 402 }),
    prof('davimendes.av', 'Davi Mendes', "videomaker | casamentos e institucionais\nSobral · Fortaleza · onde tiver luz\norçamentos: direct", 3900, 760, { posts: 288 }),
    prof('renata.pinho.rp', 'Renata Pinho', "relações públicas | Recife 🌊\ncearense de Sobral exilada no Capibaribe", 1460, 1010, { posts: 199 }),
    prof('pauloribeiro.foto', 'Paulo Ribeiro Fotografia', "fotógrafo de casamento 📷\nSobral e região norte do CE\nprofessor de iluminação nas horas vagas", 6120, 890, { posts: 734 }),
    prof('livia.carv', 'Lívia Carvalho', "fisioterapeuta | Fortaleza\n12.12.26 💍 Cascavel", 1280, 1150, { posts: 143 }),
    prof('camilabezerra.mae', 'Camila Bezerra', "mãe do Heitor 👶💛\nmaternidade real, sem filtro | Fortaleza", 2640, 790, { posts: 221 }),
    prof('clinicaalmeida.ce', 'Clínica Almeida', "Saúde da família com carinho 🩺\nAldeota, Fortaleza · agendamentos pelo link\nDra. Renata Almeida · CRM-CE", 8700, 120, { posts: 356 }),
    prof('foconordeste.lentes', 'Foco Nordeste · Lentes', "lentes novas e seminovas revisadas 📸\nRua Barão do Rio Branco, Centro, Fortaleza\nenviamos para todo o Ceará", 7850, 302, { posts: 912 }),
    prof('cafe.cajueiro', 'Café Cajueiro', "café especial e bolo de rolo ☕\nBenfica, Fortaleza · seg a sáb, 7h às 20h\nwi-fi bom e mesa na janela", 11300, 420, { posts: 1044 }),
    prof('ibiapabasemfiltro', 'Ibiapaba Sem Filtro', "o humor da serra 🥶🌄\nfrio de 17°C e a gente de casaco de inverno europeu\nmande seu meme pelo direct", 48200, 35, { posts: 2310 }),
    prof('visiteibiapaba', 'Visite Ibiapaba', "turismo na Serra da Ibiapaba 🌄\nTianguá · Ubajara · Ibiapina · São Benedito · Guaraciaba · Ipu\nroteiros, mirantes e onde comer", 61400, 210, { verified: true, posts: 1780 }),
    prof('trilhas.da.serra', 'Trilhas da Serra', "trilhas guiadas na Ibiapaba 🥾\nsegurança em primeiro lugar\nsaídas aos sábados e domingos", 9300, 400, { posts: 520 }),
    prof('bia.rangel', 'Bia Rangel ✨', "Fortaleza 🌴 | lifestyle, praia e onde comer\npublis: contato@biarangel.com.br", 214000, 980, { verified: true, posts: 1890 }),
    prof('mila.forrozeira', 'Mila 🎶', "forró pé de serra é vida\nSobral | fã de carteirinha da banda do Rafa 🪗", 610, 1430, { posts: 97 }),
    prof('pedroelu.casal', 'Pedro & Lu', "o casal que vai casar 💛 maio/2027\nFortaleza", 380, 410, { posts: 22 }),
    prof('brisaria.moda', 'Brisaria Moda Praia', "moda praia autoral feita no Ceará 🌊\nloja online · parcerias pelo direct", 25600, 640, { posts: 830 }),
    prof('embaixadores.oficial.br', 'Programa Embaixadores Oficial', "✅ seja nosso embaixador e ganhe produtos\n📩 selecionamos perfis todos os dias\n👇 link na bio", 1204, 7400, { posts: 9 }),
    prof('anaclara.15', 'Ana Clara 🎀', "15 anos em dezembro 🎀\nFortaleza", 520, 640, { private: true, posts: 41 }),
  ],

  posts: [
    /* ---------- Iara: trabalhos e viagens antigos ---------- */
    {
      id: 'x-ia-casamento-ipu-2503', author: ME, at: '2025-03-16T11:40', ratio: '4/5', place: 'Ipu, CE',
      caption: "primeiro casamento do ano e logo no pé da Bica do Ipu 💍💦 noiva chorando, padrinho chorando, fotógrafa chorando atrás da câmera. Ana e Rodrigo, obrigada pela confiança! #casamentonoceara #fotografiadecasamento",
      likes: 389,
      comments: [
        c('c1', 'pauloribeiro.foto', '2025-03-16T12:05', "a luz da Bica nessa hora é covardia 👏👏", 6),
        c('c2', 'nanda.lopes', '2025-03-16T12:30', "chorei só de ver o preview", 3),
        c('c3', 'davimendes.av', '2025-03-16T14:10', "da próxima me chama pro vídeo, dupla de Sobral reunida 🎥", 4),
        c('c4', ME, '2025-03-16T14:22', "@davimendes.av fechado!! já tô devendo uma", 2),
      ],
    },
    {
      id: 'x-ia-saojoao-2506', author: ME, at: '2025-06-24T10:15', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "São João de Guaraciaba 2025 🔥🌽 quadrilha, milho assado e a serra inteira na praça. Voltar pra casa também é um tipo de viagem.",
      likes: 702,
      comments: [
        c('c1', 'dudaandrade.oficial', '2025-06-24T10:30', "a gente dançando na quadrilha da 4ª B de novo kkkk 🌻", 15),
        c('c2', 'mayara.sousa_', '2025-06-24T11:02', "quem diria que a Iara ia virar a fotógrafa famosa da turma 🥹", 8),
        c('c3', 'kel.araujo', '2025-06-24T11:47', "faltou eu nessa foto, fui embora cedo com o Benício 😩", 3),
        c('c4', 'tia.neide', '2025-06-24T13:20', "que coisa linda nossa terra 🌸", 4),
      ],
    },
    {
      id: 'x-ia-apartamento-2509', author: ME, at: '2025-09-07T18:50', ratio: '4/3', place: 'Benfica, Fortaleza',
      caption: "apê novo no Benfica 🏠🪴 caixa pra todo lado, uma suculenta sobrevivente e a melhor colega de apê do mundo @nanda.lopes. Fortaleza, agora é sério.",
      likes: 455,
      comments: [
        c('c1', 'nanda.lopes', '2025-09-07T19:01', "a suculenta é minha, só pra deixar registrado 🌵", 12),
        c('c2', 'leofontenele', '2025-09-07T19:40', "já posso ir filar janta?", 5),
        c('c3', ME, '2025-09-07T19:44', "@leofontenele só se trouxer o refri", 3),
        c('c4', 'cafe.cajueiro', '2025-09-08T08:10', "seja bem-vinda ao bairro! primeiro café é por nossa conta ☕", 9),
      ],
    },
    {
      id: 'x-ia-retro-2512', author: ME, at: '2025-12-30T21:00', ratio: '1/1', place: 'Fortaleza, CE',
      caption: "2025 em números: 14 casamentos, 31 ensaios, 2 HDs cheios, 1 lente quebrada (descanse em paz, 50mm) e muita gente de verdade na frente da câmera. obrigada a cada cliente. 2026, vem com luz boa ✨📸 #retrospectiva",
      likes: 812,
      comments: [
        c('c1', 'foconordeste.lentes', '2025-12-30T21:20', "a 50mm merecia um velório digno 😂 aqui tem substituta esperando", 7),
        c('c2', 'camila.sa.jor', '2025-12-30T21:35', "orgulho da nossa turma 🙌", 6),
        c('c3', 'renata.pinho.rp', '2025-12-30T22:10', "14 casamentos!!! e eu aqui sem conseguir nem um namorado", 21),
        c('c4', 'dudaandrade.oficial', '2025-12-30T22:40', "2026 é nosso, amiga 🌻", 9),
      ],
    },
    {
      id: 'x-ia-praia-2601', author: ME, at: '2026-01-18T17:55', ratio: '4/5', place: 'Praia de Iracema, Fortaleza',
      caption: "fim de tarde na Praia de Iracema com a Lu e o Pedro 🌅 a luz boa dura quinze minutos. fotografe como se fosse a última. #ensaiodecasal #fortaleza",
      likes: 534,
      comments: [
        c('c1', 'pedroelu.casal', '2026-01-18T18:10', "a gente ainda não acredita que somos nós 😭💛", 11),
        c('c2', 'bia.rangel', '2026-01-18T19:30', "que luz é essa 😍 salvando pra referência", 18),
        c('c3', 'pauloribeiro.foto', '2026-01-18T20:02', "esse contraluz ficou de livro", 4),
      ],
    },
    {
      id: 'x-ia-saojoao-2606', author: ME, at: '2026-06-29T09:30', media: [IMG('duda_iara_saojoao')], ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "São João de Guaraciaba 2026, edição \"a gente ficou velha\" 🔥🌽 foto da @dudaandrade.oficial, que pela primeira vez na vida acertou o foco",
      likes: 921,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-06-29T09:41', "respeita a fotógrafa convidada 😤🌻", 19),
        c('c2', 'eunice.sobreira', '2026-06-29T10:15', "Minhas duas meninas 🥰🙏 Deus abençoe essa amizade", 14),
        c('c3', 'tati.melo.nails', '2026-06-29T10:40', "e as unhas de São João que eu fiz, ninguém fala? 💅😂", 7),
        c('c4', 'jessica.fontenele', '2026-06-29T11:12', "prima tá parecendo artista de novela 😍", 5),
      ],
    },
    {
      id: 'x-ia-gestante-2608', author: ME, at: '2026-08-26T19:20', ratio: '4/5', place: 'Fortaleza, CE',
      caption: "luz de janela, tecido solto e uma mãe respirando fundo antes do clique 🤍 ensaio gestante da @camilabezerra.mae. o Heitor já chegou cheio de luz. #ensaiogestante #luznatural",
      likes: 640,
      comments: [
        c('c1', 'camilabezerra.mae', '2026-08-26T19:35', "EU CHOREI DE NOVO. obrigada por me enxergar assim 😭🤍", 22),
        c('c2', 'kel.araujo', '2026-08-26T20:10', "que delicadeza, Iara. queria ter feito um desse no Benício", 4),
        c('c3', 'clinicaalmeida.ce', '2026-08-26T21:00', "Trabalho lindo, como sempre! 💙", 3),
      ],
    },
    {
      id: 'x-ia-clinica-2609', author: ME, at: '2026-09-21T12:10', ratio: '4/3', place: 'Aldeota, Fortaleza',
      caption: "seis profissionais, um consultório pequeno e nenhuma cara de foto 3x4 👩‍⚕️📸 ensaio institucional da @clinicaalmeida.ce. retrato corporativo também pode ter alma.",
      likes: 298,
      comments: [
        c('c1', 'clinicaalmeida.ce', '2026-09-21T12:30', "A equipe toda amou! Já trocamos as fotos do site 💙", 6),
        c('c2', 'davimendes.av', '2026-09-21T13:15', "corporativo com alma é raro, parabéns", 2),
      ],
    },
    {
      id: 'x-ia-cafe-0510', author: ME, at: '2026-10-05T21:05', media: [IMG('cafe_dragao_0510')], ratio: '4/5', place: 'Praia de Iracema, Fortaleza',
      caption: "segunda-feira de edição com um coração na xícara ☕🤍 tudo que eu amo cabe num cartão de memória (e num café bem tirado).",
      likes: 276,
      comments: [
        c('c1', 'nanda.lopes', '2026-10-05T21:12', "e o pão que eu comprei pra tu, comeu? 🤨", 4),
        c('c2', ME, '2026-10-05T21:14', "@nanda.lopes comi, mãe 😂", 3),
        c('c3', 'cafe.cajueiro', '2026-10-05T21:40', "traindo a gente com outro café, Iara? 😢☕", 11),
        c('c4', 'bia.rangel', '2026-10-05T22:02', "latte art perfeito", 2),
      ],
    },
    {
      id: 'x-ia-workshop-0710', author: ME, at: '2026-10-07T19:40', media: [IMG('estudio_ensaio_0710')], ratio: '4/5', place: 'Estúdio Lumina · Meireles, Fortaleza',
      caption: "tarde de workshop de luz no Estúdio Lumina 💡 uma octa, um refletor e uma modelo paciente. voltei pra casa com vontade de refazer todos os meus retratos. #iluminacao #estudio",
      likes: 341,
      comments: [
        c('c1', 'pauloribeiro.foto', '2026-10-07T19:55', "o fill do lado direito tá lindo. quem ministrou?", 3),
        c('c2', ME, '2026-10-07T20:03', "@pauloribeiro.foto a turma do Lumina, te mando o contato!", 1),
        c('c3', 'renata.pinho.rp', '2026-10-07T20:30', "tu trabalha até no dia de folga mulher", 5),
      ],
    },
    {
      id: 'x-ia-sobral-0910', author: ME, at: '2026-10-09T13:05', media: [IMG('sobral_cafe_0910')], ratio: '4/5', place: 'Café Margarida, Sobral',
      caption: "parada em Sobral no caminho pra serra 🚌☕ rocambole, café e um papo bom com o professor que me ensinou a fotometrar. a cidade continua com cheiro de faculdade.",
      likes: 418,
      comments: [
        c('c1', 'camila.sa.jor', '2026-10-09T13:20', "TU TÁ EM SOBRAL E NÃO ME AVISOU??? 😤", 9),
        c('c2', ME, '2026-10-09T13:24', "@camila.sa.jor passagem rápida, a van sai 15h30! na volta eu fico mais 🙏", 3),
        c('c3', 'davimendes.av', '2026-10-09T14:01', "o professor ainda usa aquele colete de mil bolsos?", 6),
        c('c4', ME, '2026-10-09T14:05', "@davimendes.av o mesmo colete. lenda.", 4),
      ],
    },

    /* ---------- Eunice (isca: mesmas iniciais da firma) ---------- */
    {
      id: 'x-eunice-oracao-0614', author: 'eunice.sobreira', at: '2026-06-14T06:20', ratio: '1/1', place: 'Sítio Flor da Serra',
      caption: "Bom dia, família! 🙏🌻 \"Entrega o teu caminho ao Senhor, confia nele, e o mais ele fará.\" Salmo 37:5. Que Deus abençoe o domingo de todos. Aqui na serra amanheceu frio, o café já tá passado ☕",
      likes: 86,
      comments: [
        c('c1', 'tia.neide', '2026-06-14T06:41', "Amém, comadre 🙏🌸", 3),
        c('c2', 'mayara.sousa_', '2026-06-14T08:05', "amém tia Eunice! guarda um café pra mim", 1),
        c('c3', 'eunice.sobreira', '2026-06-14T08:12', "Venha, minha filha, a porta tá aberta 🥰", 1),
      ],
    },
    {
      id: 'x-duda-mae-0714', author: 'dudaandrade.oficial', at: '2026-07-14T07:30', ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "Feliz aniversário, Maria Eunice Sobreira Andrade, minha rainha 👑🌻 a mulher que acorda 5h pra rezar, passar café e ainda fazer bolo pra metade da serra. Tudo que eu sou começou na tua cozinha, mainha. Te amo infinito!",
      likes: 1104,
      comments: [
        c('c1', 'eunice.sobreira', '2026-07-14T07:45', "Ai minha filha, mainha chorou aqui 😭🙏 Deus te abençoe sempre, Dudinha", 31),
        c('c2', ME, '2026-07-14T08:20', "feliz aniversário, tia Eunice! 💛 obrigada por todo cuscuz e todo cafuné da minha infância", 24),
        c('c3', 'kel.araujo', '2026-07-14T09:02', "parabéns Dona Eunice!! o bolo de milho dela é patrimônio da serra", 12),
        c('c4', 'tia.neide', '2026-07-14T09:30', "Parabéns comadre, muitos anos de vida 🌸", 6),
        c('c5', 'mayara.sousa_', '2026-07-14T10:15', "parabéns tia!!! 🎉", 2),
      ],
    },
    {
      id: 'x-eunice-bolo-0726', author: 'eunice.sobreira', at: '2026-07-26T16:10', ratio: '1/1', place: 'Sítio Flor da Serra',
      caption: "Bolo de milho verde da roça aqui do sítio 🌽🍰 a receita é segredo de família, mas quem vier tomar café comigo come um pedaço 😂 Domingo abençoado!",
      likes: 142,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-07-26T16:22', "guarda um pedaço pra mim mainha, tô descendo!! 🌻", 6),
        c('c2', 'tati.melo.nails', '2026-07-26T17:00', "tia, aceita unha em troca de bolo? 💅😂", 5),
        c('c3', 'eunice.sobreira', '2026-07-26T17:08', "Aceito, Tati! Venha 😂", 3),
        c('c4', 'jessica.fontenele', '2026-07-26T18:30', "Dona Eunice, faz o do meu casamento? 😍", 4),
        c('c5', 'eunice.sobreira', '2026-07-26T18:41', "Faço, minha filha, é só me avisar com tempo 🙏", 2),
      ],
    },
    {
      id: 'x-eunice-filha-0828', author: 'eunice.sobreira', at: '2026-08-28T19:40', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "Minha filha consultora! 🌱🌻 Orgulho dessa menina que cresceu aqui na serra e hoje ajuda tanta família a ter uma renda a mais. Deus te guarde, Dudinha. Mainha tá sempre aqui. @dudaandrade.oficial @colheitacapital",
      likes: 233,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-08-28T19:52', "mainhaaaa 😭🌻 para que eu choro", 12),
        c('c2', 'kel.araujo', '2026-08-28T20:30', "a Duda tá podendo 👏👏", 4),
        c('c3', 'marcos.colheita', '2026-08-28T21:05', "A Duda é referência no time! 🌱", 3),
        c('c4', 'tia.neide', '2026-08-28T21:40', "Deus abençoe mãe e filha 🙏", 2),
      ],
    },
    {
      id: 'x-eunice-aporte-0918', author: 'eunice.sobreira', at: '2026-09-18T20:15', ratio: '1/1', place: 'Sítio Flor da Serra',
      caption: "Segundo aporte na Colheita feito hoje 🙏🌱 Deus é fiel! Meu finado pai dizia que dinheiro parado é terra sem semente. Quem planta com fé colhe em dobro. #colheitacapital #gratidao",
      likes: 198,
      comments: [
        c('c1', 'tia.neide', '2026-09-18T20:30', "Parabéns, Dona Maria Eunice Sobreira Andrade, a investidora da família 😂👏", 9),
        c('c2', 'eunice.sobreira', '2026-09-18T20:36', "Nome completo, Neide? Tô ficando importante 😂🙏", 7),
        c('c3', 'mayara.sousa_', '2026-09-18T21:02', "tia, meu pai também entrou! disse que tá rendendo certinho", 2),
        c('c4', 'rodrigo.contabil', '2026-09-18T22:10', "Dona Eunice, com todo respeito: antes de colocar mais, peça o registro deles na CVM.", 11),
        c('c5', 'eunice.sobreira', '2026-09-18T22:31', "Meu filho, minha filha trabalha lá, eu confio de olho fechado 🙏🌻", 4),
        c('c6', 'carlinhos.ibiapaba', '2026-09-18T23:05', "Deus é fiel mesmo 🙏", 1),
      ],
    },
    {
      id: 'x-eunice-festa-1010', author: 'eunice.sobreira', at: '2026-10-10T16:45', ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "Hoje o Sítio Flor da Serra recebe a Noite da Colheita! 🌻🌽 Casa arrumada, café passado, coração cheio. Que Deus abençoe essa festa e todas as famílias que vêm subir a serra. @colheitacapital @dudaandrade.oficial",
      likes: 176,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-10-10T17:02', "mainha caprichou demais 🌻", 5),
        c('c2', 'lari.producao', '2026-10-10T17:20', "Dona Eunice, obrigada pela acolhida! o café da tarde salvou a equipe ☕✨", 4),
        c('c3', 'mayara.sousa_', '2026-10-10T17:48', "chegando mais tarde, tia! guarda bolo 🙏", 1),
        c('c4', 'tia.neide', '2026-10-10T18:05', "Vai ser bonito demais 🌸", 1),
      ],
    },
    {
      id: 'x-eunice-luto-1011', author: 'eunice.sobreira', at: '2026-10-11T19:30', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "Hoje a serra amanheceu mais triste. Iara, minha menina, que eu vi crescer correndo nesse terreiro com a Dudinha, de câmera na mão desde pequena. Não tenho palavras pra Socorro e pro Toinho. Que Deus console essa família. Descansa, filha. 🕊️🙏 @iarafontenele.foto",
      likes: 612,
      comments: [
        c('c1', 'tia.neide', '2026-10-11T19:41', "Que Deus conforte todos nós, comadre 🙏", 8),
        c('c2', 'kel.araujo', '2026-10-11T19:58', "Dona Eunice, um abraço apertado na senhora e na Duda. 💔", 6),
        c('c3', 'mayara.sousa_', '2026-10-11T20:20', "não consigo acreditar, tia. ontem mesmo a gente tava aí", 5),
        c('c4', 'eunice.sobreira', '2026-10-11T20:34', "Nem eu, minha filha. Ninguém consegue. 💔", 4),
        c('c5', 'jessica.fontenele', '2026-10-11T21:10', "Obrigada pelo carinho com a nossa família, Dona Eunice. 🕊️", 9),
      ],
    },

    /* ---------- prima Jéssica e o noivo ---------- */
    {
      id: 'x-jessica-noivado-2512', author: 'jessica.fontenele', at: '2025-12-25T22:10', ratio: '4/5', place: 'São Benedito, CE',
      caption: "ELE PEDIU!!! 💍😭 no meio da ceia, na frente da família toda, com a voz tremendo. Sim, sim e sim, @thiago.paiva_. Novembro de 2026, aguarde!",
      likes: 1340,
      comments: [
        c('c1', ME, '2025-12-25T22:20', "PRIMAAAA 😭💍 a fotógrafa do casamento já tá reservada, nem discute", 28),
        c('c2', 'jessica.fontenele', '2025-12-25T22:24', "@iarafontenele.foto era o meu primeiro pedido!!! 🥹", 12),
        c('c3', 'leofontenele', '2025-12-25T22:51', "Thiago, ainda dá tempo de correr kkkk brincadeira, bem-vindo à família", 17),
        c('c4', 'thiago.paiva_', '2025-12-25T23:05', "@leofontenele não corro nem amarrado 😂", 9),
      ],
    },
    {
      id: 'x-thiago-cha-2609', author: 'thiago.paiva_', at: '2026-09-27T20:40', ratio: '4/3', place: 'Guaraciaba do Norte, CE',
      caption: "chá de panela sobrevivido 🍳😅 me pintaram, me fizeram dançar e ganhei 4 airfryers. obrigado, família Fontenele! falta pouco, @jessica.fontenele 💍",
      likes: 288,
      comments: [
        c('c1', 'jessica.fontenele', '2026-09-27T20:52', "4 airfryers, amor, vamos abrir uma lanchonete 😂", 14),
        c('c2', ME, '2026-09-27T21:30', "o vídeo de tu dançando vai passar no telão do casamento 😈", 11),
        c('c3', 'thiago.paiva_', '2026-09-27T21:34', "@iarafontenele.foto prima, pelo amor de Deus 🙏", 6),
      ],
    },
    {
      id: 'x-jessica-luto-1012', author: 'jessica.fontenele', at: '2026-10-12T21:15', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "minha prima, minha fotógrafa, minha primeira melhor amiga da vida. tu ia fotografar o dia mais feliz da minha vida e eu não sei como vou entrar naquela igreja sem tu atrás da câmera. a gente te ama, Iara. pra sempre. 🕊️💍 @iarafontenele.foto",
      likes: 1520,
      comments: [
        c('c1', 'thiago.paiva_', '2026-10-12T21:22', "tô contigo, meu amor. ela vai estar lá. 🕊️", 25),
        c('c2', 'leofontenele', '2026-10-12T21:40', "a gente vai dar um jeito de ela estar lá, prima.", 18),
        c('c3', 'pauloribeiro.foto', '2026-10-12T22:15', "Jéssica, sou amigo da Iara da faculdade. Se vocês quiserem, eu fotografo o casamento de vocês, sem custo nenhum. Ela faria o mesmo.", 64),
        c('c4', 'jessica.fontenele', '2026-10-12T22:31', "@pauloribeiro.foto não tenho palavras. obrigada. 💔", 20),
        c('c5', 'kel.araujo', '2026-10-12T22:50', "força, Jéssica 🙏", 3),
      ],
    },

    /* ---------- ex-colegas de escola (Guaraciaba) ---------- */
    {
      id: 'x-kel-benicio-0905', author: 'kel.araujo', at: '2026-09-05T15:30', ratio: '4/5', place: 'Tianguá, CE',
      caption: "5 anos do meu Benício 💙🦖 festa de dinossauro, bolo de dinossauro e um aniversariante que dormiu antes do parabéns. Mãe cansada, coração cheio.",
      likes: 312,
      comments: [
        c('c1', ME, '2026-09-05T16:02', "o dinossauro mais lindo da serra 🦖💙 parabéns, Benício!", 7),
        c('c2', 'mayara.sousa_', '2026-09-05T16:20', "dormiu antes do parabéns é muito ele kkkk", 4),
        c('c3', 'tati.melo.nails', '2026-09-05T17:45', "parabéns pro rapazinho! 🎉", 2),
      ],
    },
    {
      id: 'x-kel-luto-1011', author: 'kel.araujo', at: '2026-10-11T22:40', ratio: '1/1', place: 'Tianguá, CE',
      caption: "Iara da 4ª B. A menina que levava a câmera da tia pro recreio e tirava foto da merenda. Que fotografou o aniversário do meu filho sem cobrar nada \"porque era presente\". Não dá pra acreditar. Descansa, amiga. 🕊️",
      likes: 488,
      comments: [
        c('c1', 'mayara.sousa_', '2026-10-11T22:51', "a foto da merenda 😭 ela fazia isso mesmo", 9),
        c('c2', 'tati.melo.nails', '2026-10-11T23:05', "não tô conseguindo dormir pensando nisso", 6),
        c('c3', 'dudaandrade.oficial', '2026-10-12T07:40', "🌻💔", 11),
      ],
    },
    {
      id: 'x-tati-unhas-0920', author: 'tati.melo.nails', at: '2026-09-20T11:00', ratio: '1/1', place: 'Guaraciaba do Norte, CE',
      caption: "francesinha com glitter dourado pra noiva de outubro 💅✨ agenda de outubro e novembro abrindo hoje, corre que o casamento da serra tá movimentado! #unhasemgel #guaraciaba",
      likes: 164,
      comments: [
        c('c1', 'jessica.fontenele', '2026-09-20T11:15', "reserva a minha de novembro pelo amor 🙏💍", 3),
        c('c2', 'tati.melo.nails', '2026-09-20T11:18', "@jessica.fontenele já tá anotada, noiva! 💅", 2),
        c('c3', 'mayara.sousa_', '2026-09-20T12:40', "que perfeição Tati", 1),
      ],
    },
    {
      id: 'x-tati-fechado-1012', author: 'tati.melo.nails', at: '2026-10-12T08:00', ratio: '1/1', place: 'Guaraciaba do Norte, CE',
      caption: "Hoje o studio não abre. Vou estar com a família Fontenele. Quem tinha horário, eu remarco pelo direct. Obrigada pela compreensão. 🕊️",
      likes: 207,
      comments: [
        c('c1', 'kel.araujo', '2026-10-12T08:20', "🙏💔", 2),
        c('c2', 'carlinhos.ibiapaba', '2026-10-12T09:10', "a cidade toda tá parada hoje", 4),
      ],
    },
    {
      id: 'x-mayara-forro-1010', author: 'mayara.sousa_', at: '2026-10-10T22:20', ratio: '4/5', place: 'Sítio Flor da Serra',
      caption: "noite de forró na serra 🌽🪗 baião de dois, paçoca e o pé doendo de tanto dançar. obrigada pela noite, tia Eunice! #noitedacolheita",
      likes: 118,
      comments: [
        c('c1', 'eunice.sobreira', '2026-10-10T22:34', "Que bom que veio, minha filha! 🌻", 2),
        c('c2', 'kel.araujo', '2026-10-10T22:58', "inveja branca daqui de Tianguá 😩", 1),
        c('c3', 'mayara.sousa_', '2026-10-12T09:15', "não consigo mais olhar essa foto do mesmo jeito. 💔", 7),
      ],
    },
    {
      id: 'x-mayara-luto-1012', author: 'mayara.sousa_', at: '2026-10-12T19:10', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "o velório mais cheio que essa cidade já viu. a serra inteira veio dizer tchau pra Iara. a gente nunca sabe quando é a última vez que dá um abraço em alguém. abracem os seus hoje. 🕊️",
      likes: 391,
      comments: [
        c('c1', 'tia.neide', '2026-10-12T19:30', "Foi bonito e foi triste. Que Deus a receba 🙏", 6),
        c('c2', 'josue.agro', '2026-10-12T20:05', "essa pedra já levou outras, fia. ninguém faz nada", 13),
        c('c3', 'mayara.sousa_', '2026-10-12T20:12', "@josue.agro já? meu Deus", 2),
        c('c4', 'carlinhos.ibiapaba', '2026-10-12T20:44', "meu avô dizia que um vaqueiro caiu de lá nos anos 80", 5),
      ],
    },

    /* ---------- faculdade (Sobral) ---------- */
    {
      id: 'x-camila-podcast-0915', author: 'camila.sa.jor', at: '2026-09-15T18:00', ratio: '1/1', place: 'Sobral, CE',
      caption: "episódio 40 do Pauta Norte no ar! 🎙️ hoje: por que a rádio do interior ainda é a maior rede social do Ceará. link na bio. #podcast #sobral",
      likes: 143,
      comments: [
        c('c1', ME, '2026-09-15T18:20', "40!!! a capa foi minha, só pra lembrar 😎", 5),
        c('c2', 'camila.sa.jor', '2026-09-15T18:24', "@iarafontenele.foto e eu nunca vou deixar de te creditar 🙏", 3),
        c('c3', 'renata.pinho.rp', '2026-09-15T19:00', "ouvindo no trânsito do Recife", 2),
      ],
    },
    {
      id: 'x-camila-luto-1011', author: 'camila.sa.jor', at: '2026-10-11T21:30', ratio: '4/5', place: 'Sobral, CE',
      caption: "a turma de Comunicação de 2017 perdeu a melhor de nós. a Iara via o que ninguém via, e fazia a gente se ver bonito também. ontem ela passou aqui em Sobral e eu não fui. não deixem pra depois. 🕊️ @iarafontenele.foto",
      likes: 702,
      comments: [
        c('c1', 'davimendes.av', '2026-10-11T21:42', "a gente ainda tinha aquele casamento pra fazer junto 💔", 12),
        c('c2', 'renata.pinho.rp', '2026-10-11T22:00', "tô sem chão aqui em Recife. queria estar aí com vocês.", 9),
        c('c3', 'pauloribeiro.foto', '2026-10-11T22:31', "ela era a melhor da turma de luz. de longe.", 15),
      ],
    },
    {
      id: 'x-davi-casamento-0905', author: 'davimendes.av', at: '2026-09-06T10:00', ratio: '16/9', place: 'Meruoca, CE',
      caption: "teaser do casamento de Rita e Hugo na Meruoca 🎥🌿 neblina das 6h, drone corajoso e uma noiva que entrou cantando. vídeo completo em breve.",
      likes: 410,
      comments: [
        c('c1', ME, '2026-09-06T10:30', "essa neblina!!! 😍 e eu aqui devendo aquela parceria", 4),
        c('c2', 'davimendes.av', '2026-09-06T10:41', "@iarafontenele.foto dezembro tem casamento em Cascavel, bora?", 2),
        c('c3', ME, '2026-09-06T10:50', "@davimendes.av em Cascavel eu já tô fechada no dia 12! se for outro dia, bora", 2),
      ],
    },
    {
      id: 'x-davi-luto-1012', author: 'davimendes.av', at: '2026-10-12T10:30', ratio: '16/9', place: 'Sobral, CE',
      caption: "editei hoje de madrugada um vídeo com tudo que eu tinha da Iara: os bastidores da faculdade, o TCC, a gente correndo atrás de luz em Sobral. não vou postar. é da família. só queria dizer que ela tá em cada quadro. 🎞️🕊️",
      likes: 356,
      comments: [
        c('c1', 'camila.sa.jor', '2026-10-12T10:44', "manda pra mãe dela, Davi. ela vai querer.", 8),
        c('c2', 'davimendes.av', '2026-10-12T10:50', "@camila.sa.jor vou mandar pelo Léo, o primo", 3),
        c('c3', 'leofontenele', '2026-10-12T11:20', "me chama no WhatsApp, Davi. obrigado.", 6),
      ],
    },
    {
      id: 'x-renata-recife-0920', author: 'renata.pinho.rp', at: '2026-09-20T17:30', ratio: '4/5', place: 'Recife, PE',
      caption: "pôr do sol no Capibaribe, mas confesso que nenhum chega aos pés de um fim de tarde na Ibiapaba 🌇 saudade da serra (e do cuscuz)",
      likes: 189,
      comments: [
        c('c1', ME, '2026-09-20T17:50', "a serra te espera! vem que eu te levo nos mirantes 🌄", 4),
        c('c2', 'visiteibiapaba', '2026-09-20T18:30', "A Ibiapaba agradece o elogio! 🌄", 6),
      ],
    },
    {
      id: 'x-paulo-dica-0928', author: 'pauloribeiro.foto', at: '2026-09-28T09:00', ratio: '4/5', place: 'Sobral, CE',
      caption: "dica de segunda: no casamento ao ar livre, chegue 1h antes e ande o espaço todo com o fotômetro. a luz das 16h não é a das 17h. carrossel completo nos destaques 📷 #fotografiadecasamento #iluminacao",
      likes: 520,
      comments: [
        c('c1', ME, '2026-09-28T09:20', "salvando pra mostrar pro assistente novo 🙌", 3),
        c('c2', 'foconordeste.lentes', '2026-09-28T10:00', "dica de ouro, Paulo! 📸", 2),
        c('c3', 'davimendes.av', '2026-09-28T11:02', "ele ensinava isso na faculdade e a gente não ouvia", 7),
      ],
    },
    {
      id: 'x-paulo-luto-1011', author: 'pauloribeiro.foto', at: '2026-10-11T20:00', ratio: '1/1', place: 'Sobral, CE',
      caption: "hoje eu não vou postar foto nenhuma. só quero lembrar que a Iara foi a primeira da turma a entender que fotografia é sobre gente, não sobre câmera. quem tiver uma foto feita por ela, guarda com carinho. 📷🕊️",
      likes: 845,
      comments: [
        c('c1', 'camilabezerra.mae', '2026-10-11T20:20', "eu tenho o ensaio da minha gravidez. vou guardar pra sempre. 🤍", 19),
        c('c2', 'clinicaalmeida.ce', '2026-10-11T21:00', "Nossa equipe inteira tem um retrato dela. Muito triste.", 7),
        c('c3', 'renata.pinho.rp', '2026-10-11T21:30', "💔", 2),
      ],
    },

    /* ---------- clientes ---------- */
    {
      id: 'x-livia-noivado-0915', author: 'livia.carv', at: '2026-09-15T20:10', ratio: '4/5', place: 'Fortaleza, CE',
      caption: "faltam 88 dias 💍 data fechada, igreja fechada, buffet fechado e FOTÓGRAFA fechada (a mais disputada de Fortaleza, viu @iarafontenele.foto?) agora só falta o João aprender a dançar.",
      likes: 231,
      comments: [
        c('c1', ME, '2026-09-15T20:30', "12/12 já tá cravado na minha agenda com coração 💛 o João vai dançar sim!", 6),
        c('c2', 'livia.carv', '2026-09-15T20:35', "@iarafontenele.foto confia que eu pago as aulas kkkk", 3),
      ],
    },
    {
      id: 'x-livia-luto-1012', author: 'livia.carv', at: '2026-10-12T13:00', ratio: '1/1', place: 'Fortaleza, CE',
      caption: "Não sei bem como escrever isso. A Iara ia fotografar nosso casamento em dezembro. Conversei com ela por mensagem semana passada, cheia de ideia, cheia de vida. Meus sentimentos à família. Nada mais importa hoje. 🕊️",
      likes: 304,
      comments: [
        c('c1', 'pedroelu.casal', '2026-10-12T13:20', "a gente também ia casar com ela atrás da câmera. que tristeza. 💔", 8),
        c('c2', 'davimendes.av', '2026-10-12T14:00', "Lívia, se precisar de indicação de alguém que trabalhava com ela, me chama.", 5),
      ],
    },
    {
      id: 'x-camilab-heitor-1003', author: 'camilabezerra.mae', at: '2026-10-03T14:20', ratio: '4/5', place: 'Fortaleza, CE',
      caption: "Heitor chegou 💛👶 3,2 kg de pura luz, às 5h40 da manhã. Parto longo, coração gigante. Obrigada a cada pessoa que rezou por nós. (as fotos da barriga feitas pela @iarafontenele.foto estão emolduradas no quarto dele 🤍)",
      likes: 1630,
      comments: [
        c('c1', ME, '2026-10-03T14:45', "AAAAA bem-vindo, Heitor!!! 😭💛 quando puder eu vou conhecer com uma câmera e zero flash", 21),
        c('c2', 'clinicaalmeida.ce', '2026-10-03T15:10', "Parabéns à família! 💙", 4),
        c('c3', 'kel.araujo', '2026-10-03T16:30', "que bênção! parabéns mamãe 💛", 2),
      ],
    },
    {
      id: 'x-clinica-equipe-0922', author: 'clinicaalmeida.ce', at: '2026-09-22T09:00', ratio: '4/3', place: 'Aldeota, Fortaleza',
      caption: "Conheça a nossa equipe! 🩺💙 Seis profissionais dedicados à saúde da sua família. Retratos por @iarafontenele.foto. Agende sua consulta pelo link da bio.",
      likes: 176,
      comments: [
        c('c1', ME, '2026-09-22T09:30', "foi um prazer enorme! equipe mais simpática de Fortaleza 💙", 3),
        c('c2', 'camilabezerra.mae', '2026-09-22T10:15', "a Dra. Renata é a melhor pediatra que eu conheço", 4),
      ],
    },
    {
      id: 'x-pedroelu-save-0901', author: 'pedroelu.casal', at: '2026-09-01T19:00', ratio: '4/5', place: 'Fortaleza, CE',
      caption: "save the date oficial 💛 maio de 2027. fotos do pré-wedding em outubro com a @iarafontenele.foto (a gente já tá treinando a pose natural, que é a mais difícil kkk)",
      likes: 129,
      comments: [
        c('c1', ME, '2026-09-01T19:20', "pose natural é não posar 😂 24/10 vai ser lindo!", 4),
        c('c2', 'livia.carv', '2026-09-01T20:00', "parabéns, casal! vocês vão amar ela", 2),
      ],
    },

    /* ---------- lojas, café e marcas ---------- */
    {
      id: 'x-foco-promo-0925', author: 'foconordeste.lentes', at: '2026-09-25T10:00', ratio: '1/1', place: 'Centro, Fortaleza',
      caption: "SEMANA DA LENTE FIXA 📸 35mm f/1.8, 50mm f/1.4 e 85mm f/1.8 seminovas revisadas, troca em 6 meses e parcelamento em 10x. Estoque limitado, chama no direct! #lentes #fotografia #fortaleza",
      likes: 342,
      comments: [
        c('c1', 'pauloribeiro.foto', '2026-09-25T10:30', "a 85 ainda tá aí?", 1),
        c('c2', 'foconordeste.lentes', '2026-09-25T10:42', "@pauloribeiro.foto saiu ontem, Paulo 😩 chega outra semana que vem", 1),
        c('c3', ME, '2026-09-25T11:05', "e a 35? 👀", 2),
        c('c4', 'foconordeste.lentes', '2026-09-25T11:08', "@iarafontenele.foto te chamei no direct! 📩", 1),
      ],
    },
    {
      id: 'x-foco-luto-1012', author: 'foconordeste.lentes', at: '2026-10-12T17:00', ratio: '1/1', place: 'Centro, Fortaleza',
      caption: "A família Foco Nordeste se despede de uma cliente querida e de uma fotógrafa que fazia a gente ter orgulho do que vende. Iara, obrigado por cada visita e cada conversa sobre luz. 🕊️",
      likes: 488,
      comments: [
        c('c1', 'pauloribeiro.foto', '2026-10-12T17:30', "bonita homenagem.", 3),
        c('c2', 'davimendes.av', '2026-10-12T18:02', "🖤", 1),
      ],
    },
    {
      id: 'x-cajueiro-bolo-0928', author: 'cafe.cajueiro', at: '2026-09-28T08:00', ratio: '4/5', place: 'Benfica, Fortaleza',
      caption: "segunda-feira pede bolo de rolo quentinho e coado de Guaramiranga ☕🍰 abrimos às 7h. a mesa da janela já tem dona, mas a do lado tá livre 😉",
      likes: 612,
      comments: [
        c('c1', 'nanda.lopes', '2026-09-28T08:20', "a mesa da janela é da @iarafontenele.foto, todo mundo sabe", 9),
        c('c2', ME, '2026-09-28T08:45', "tô indo, segura minha mesa 🏃‍♀️☕", 6),
        c('c3', 'bia.rangel', '2026-09-28T09:30', "melhor bolo de rolo de Fortaleza, sem discussão", 14),
      ],
    },
    {
      id: 'x-cajueiro-mesa-1013', author: 'cafe.cajueiro', at: '2026-10-13T08:00', ratio: '4/5', place: 'Benfica, Fortaleza',
      caption: "Hoje a mesa da janela vai ficar vazia, com uma flor e um café. Era o lugar da Iara, que editava aqui quase toda manhã e sempre deixava a gente rir antes das 8h. Obrigado por tanto, vizinha. 🌼☕",
      likes: 1980,
      comments: [
        c('c1', 'nanda.lopes', '2026-10-13T08:30', "passei aí agora e não consegui entrar. obrigada por isso. 💔", 33),
        c('c2', 'bia.rangel', '2026-10-13T09:10', "que homenagem linda 🤍", 12),
        c('c3', 'leofontenele', '2026-10-13T10:00', "vou levar a tia Socorro aí quando ela vier buscar as coisas do apê.", 18),
      ],
    },
    {
      id: 'x-brisaria-colecao-0930', author: 'brisaria.moda', at: '2026-09-30T12:00', ratio: '4/5', place: 'Fortaleza, CE',
      caption: "Coleção Maré Alta chegou 🌊 estampas pintadas à mão por artistas cearenses. Frete grátis pra todo o Ceará até domingo! #modapraia #feitonoceara",
      likes: 1420,
      comments: [
        c('c1', 'bia.rangel', '2026-09-30T12:30', "a estampa de caju é minha 😍", 21),
        c('c2', 'livia.carv', '2026-09-30T13:15', "pra lua de mel 👀", 3),
      ],
    },
    {
      id: 'x-embaixador-1001', author: 'embaixadores.oficial.br', at: '2026-10-01T03:12', ratio: '1/1',
      caption: "🚨 ÚLTIMAS VAGAS 🚨 Seja embaixador(a) oficial e receba produtos grátis em casa! ✅ Sem experiência ✅ Qualquer número de seguidores. Clique no link da bio e garanta seu kit (pague só o frete) 📦",
      likes: 37,
      comments: [
        c('c1', 'rodrigo.contabil', '2026-10-01T09:40', "\"pague só o frete\". golpe. denunciem.", 8),
        c('c2', 'carlinhos.ibiapaba', '2026-10-01T11:00', "é verdade isso?", 0),
      ],
    },
    {
      id: 'x-bia-praia-0927', author: 'bia.rangel', at: '2026-09-27T17:40', ratio: '4/5', place: 'Praia de Iracema, Fortaleza',
      caption: "domingo é dia de Iracema, caldo de peixe e pôr do sol no Poço da Draga 🌅🐟 qual o seu lugar preferido pra ver o sol ir embora em Fortaleza? #fortaleza #pordosol",
      likes: 18400,
      comments: [
        c('c1', 'cafe.cajueiro', '2026-09-27T17:55', "depois passa pra um café 😉☕", 22),
        c('c2', 'visiteibiapaba', '2026-09-27T18:20', "e se subir a serra no próximo fim de semana? 🌄 os mirantes da Ibiapaba te esperam!", 41),
        c('c3', 'brisaria.moda', '2026-09-27T18:45', "musa 🌊", 15),
      ],
    },
    {
      id: 'x-bia-cajueiro-1006', author: 'bia.rangel', at: '2026-10-06T10:30', ratio: '4/5', place: 'Benfica, Fortaleza',
      caption: "achei o bolo de rolo mais honesto de Fortaleza e é no Benfica 🍰☕ @cafe.cajueiro, vocês me ganharam. (não é publi, é amor mesmo)",
      likes: 22100,
      comments: [
        c('c1', 'cafe.cajueiro', '2026-10-06T10:40', "BIA RANGEL NO NOSSO CAFÉ 😭😭 volte sempre!!", 64),
        c('c2', 'nanda.lopes', '2026-10-06T11:15', "agora não vai ter mais mesa pra gente 😩", 12),
      ],
    },
    {
      id: 'x-bia-iara-1012', author: 'bia.rangel', at: '2026-10-12T20:00', ratio: '1/1', place: 'Fortaleza, CE',
      caption: "Eu não conhecia a Iara pessoalmente, só pelos ensaios lindos que salvava como referência. Desde ontem não paro de ver o perfil dela. Fica o pedido: mirante não é lugar de selfie na beirada, à noite ainda menos. Cuidem-se. Meus sentimentos à família. 🕊️",
      likes: 31200,
      comments: [
        c('c1', 'trilhas.da.serra', '2026-10-12T20:30', "Obrigado por falar disso, Bia. Mirante de noite, sem guia e sem lanterna, nunca.", 210),
        c('c2', 'nanda.lopes', '2026-10-12T21:00', "ela não era de fazer selfie na beirada. ela era fotógrafa, conhecia aquela pedra desde criança. por favor, sem julgamento.", 402),
        c('c3', 'bia.rangel', '2026-10-12T21:10', "@nanda.lopes você tem toda razão, me desculpa. não quis julgar. 🤍", 155),
        c('c4', 'ibiapabasemfiltro', '2026-10-12T21:40', "a serra toda tá de luto 🕊️", 88),
      ],
    },
    {
      id: 'x-mila-saojoao-0624', author: 'mila.forrozeira', at: '2026-06-24T23:10', ratio: '4/5', place: 'Sobral, CE',
      caption: "São João de Sobral com a banda do Rafa 🪗🔥 rouca, suada e feliz. forró pé de serra nunca morre! #forropedeserra",
      likes: 88,
      comments: [
        c('c1', 'bandadorafa.fc', '2026-06-24T23:30', "foi histórico!! 🎶", 3),
        c('c2', 'igormatos.som', '2026-06-25T09:10', "o som tava no talo nesse dia kkk", 2),
      ],
    },

    /* ---------- humor e turismo da serra ---------- */
    {
      id: 'x-humor-frio-0715', author: 'ibiapabasemfiltro', at: '2026-07-15T06:30', ratio: '1/1', place: 'Serra da Ibiapaba',
      caption: "Termômetro marcando 16°C em Guaraciaba e o serrano saindo de casa com: 2 casacos, 1 touca, 1 cachecol que a avó fez e a certeza de que vai morrer congelado 🥶😂 marque o friorento da sua família",
      likes: 9800,
      comments: [
        c('c1', 'kel.araujo', '2026-07-15T07:02', "@mayara.sousa_ tu de cachecol em julho kkkkk", 31),
        c('c2', 'mayara.sousa_', '2026-07-15T07:10', "@kel.araujo é questão de sobrevivência mulher", 22),
        c('c3', 'carlinhos.ibiapaba', '2026-07-15T08:00', "16 graus é inverno siberiano sim senhor", 40),
      ],
    },
    {
      id: 'x-humor-mae-0903', author: 'ibiapabasemfiltro', at: '2026-09-03T12:00', ratio: '1/1', place: 'Serra da Ibiapaba',
      caption: "Mãe serrana: \"vou ali em Tianguá rapidinho\" 🚗 Volta 6 horas depois com 3 sacos de feira, uma muda de planta, notícia de 4 parentes e um vestido que \"tava baratinho\" 😂",
      likes: 14200,
      comments: [
        c('c1', 'dudaandrade.oficial', '2026-09-03T12:20', "@eunice.sobreira olha tu aqui mainha 😂🌻", 26),
        c('c2', 'eunice.sobreira', '2026-09-03T12:41', "Mentira! Eu volto em 5 horas 😂🙏", 54),
        c('c3', 'tati.melo.nails', '2026-09-03T13:00', "e ainda faz unha no caminho 💅", 18),
      ],
    },
    {
      id: 'x-humor-luto-1011', author: 'ibiapabasemfiltro', at: '2026-10-11T18:00', ratio: '1/1', place: 'Serra da Ibiapaba',
      caption: "Hoje não tem meme. A serra perdeu uma filha. Nossos sentimentos à família de Iara Fontenele, de Guaraciaba do Norte. 🕊️",
      likes: 21300,
      comments: [
        c('c1', 'carlinhos.ibiapaba', '2026-10-11T18:20', "cadê a cerca daquele mirante? tem anos que tá caindo", 312),
        c('c2', 'josue.agro', '2026-10-11T18:35', "essa pedra já levou outras. meu tio contava", 140),
        c('c3', 'mayara.sousa_', '2026-10-11T19:02', "ela era tão querida aqui 💔", 61),
        c('c4', 'rodrigo.contabil', '2026-10-11T19:40', "foi acidente mesmo? alguém sabe se a perícia já saiu?", 97),
        c('c5', 'tia.neide', '2026-10-11T20:10', "Deixem a família em paz, gente. Rezem. 🙏", 230),
      ],
    },
    {
      id: 'x-visite-mirantes-0905', author: 'visiteibiapaba', at: '2026-09-05T09:00', ratio: '4/5', place: 'Serra da Ibiapaba',
      caption: "5 mirantes da Ibiapaba pra ver o pôr do sol 🌄 1. Mirante do Gavião (Ubajara) 2. Pedra do Itagurussu (Tianguá) 3. Mirante de Ibiapina 4. Pedra Lisa (Guaraciaba, em propriedade particular, peça autorização) 5. Bica do Ipu vista de cima. Salve pra sua próxima viagem! #ibiapaba #mirante",
      likes: 7400,
      comments: [
        c('c1', 'renata.pinho.rp', '2026-09-05T09:40', "a Pedra Lisa é a mais bonita, não aceito discussão", 12),
        c('c2', 'trilhas.da.serra', '2026-09-05T10:15', "Lembrando: em mirante, sempre com luz do dia e longe da beirada! 🥾", 30),
        c('c3', 'carlinhos.ibiapaba', '2026-09-05T11:30', "o do Gavião é top", 4),
      ],
    },
    {
      id: 'x-visite-ubajara-0920', author: 'visiteibiapaba', at: '2026-09-20T10:00', ratio: '4/5', place: 'Ubajara, CE',
      caption: "Bondinho de Ubajara funcionando de terça a domingo 🚡 descida até a Gruta, cachoeira do Cafundó no caminho e friozinho de 19°C. Ingresso na bilheteria do Parque Nacional. #ubajara #turismoceara",
      likes: 5100,
      comments: [
        c('c1', 'bia.rangel', '2026-09-20T10:40', "tá na minha lista desde sempre 😍", 44),
        c('c2', 'visiteibiapaba', '2026-09-20T10:52', "@bia.rangel vem que a gente monta o roteiro! 🌄", 18),
      ],
    },
    {
      id: 'x-visite-nota-1012', author: 'visiteibiapaba', at: '2026-10-12T12:00', ratio: '1/1', place: 'Serra da Ibiapaba',
      caption: "Nota: lamentamos profundamente a morte da fotógrafa Iara Fontenele, que tantas vezes mostrou a beleza da nossa serra. Reforçamos: mirantes em áreas particulares devem ser visitados com autorização, de dia e com acompanhamento. Cobramos dos responsáveis a manutenção das proteções. 🕊️",
      likes: 3900,
      comments: [
        c('c1', 'carlinhos.ibiapaba', '2026-10-12T12:30', "cobram de quem? aquilo é terra particular", 26),
        c('c2', 'josue.agro', '2026-10-12T13:05', "a prefeitura nunca fez nada nos mirantes daqui", 31),
        c('c3', 'kel.araujo', '2026-10-12T13:40', "que ninguém mais precise passar por isso 💔", 12),
        c('c4', 'rodrigo.contabil', '2026-10-12T14:20', "uma morte numa festa cheia de gente e ninguém viu nada. estranho.", 58),
        c('c5', 'tia.neide', '2026-10-12T15:00', "Gente, respeito. A família tá sofrendo.", 44),
      ],
    },
    {
      id: 'x-trilhas-pedralisa-0912', author: 'trilhas.da.serra', at: '2026-09-12T08:00', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "Trilha curta, vista gigante 🥾🌄 saída domingo 6h com destino aos mirantes de Guaraciaba. Levar água, protetor, tênis de solado bom e respeito pela natureza. Vagas pelo direct.",
      likes: 640,
      comments: [
        c('c1', 'mayara.sousa_', '2026-09-12T08:30', "criança pode ir?", 1),
        c('c2', 'trilhas.da.serra', '2026-09-12T08:41', "@mayara.sousa_ a partir de 10 anos, acompanhada! 🥾", 2),
      ],
    },
    {
      id: 'x-trilhas-seguranca-1013', author: 'trilhas.da.serra', at: '2026-10-13T09:00', ratio: '1/1', place: 'Serra da Ibiapaba',
      caption: "Suspendemos as saídas deste fim de semana. Em respeito à família da Iara e porque a gente precisa conversar sobre segurança nos mirantes: cerca, sinalização, iluminação. Mirante não é brincadeira. 🕊️🥾",
      likes: 1280,
      comments: [
        c('c1', 'renata.pinho.rp', '2026-10-13T09:30', "obrigada por isso. ela amava aquelas pedras.", 14),
        c('c2', 'josue.agro', '2026-10-13T10:10', "tem que ter cerca de verdade, não aquelas estaca podre", 37),
        c('c3', 'carlinhos.ibiapaba', '2026-10-13T11:00', "dizem que a festa era bem do lado. ninguém ouviu nada?", 22),
        c('c4', 'trilhas.da.serra', '2026-10-13T11:20', "@carlinhos.ibiapaba vamos deixar isso pra polícia, amigo. 🙏", 41),
      ],
    },

    /* ---------- mais vida ---------- */
    {
      id: 'x-thiago-maracuja-0815', author: 'thiago.paiva_', at: '2026-08-15T17:20', ratio: '4/3', place: 'São Benedito, CE',
      caption: "maracujá da serra no ponto 🌱💛 três anos de assistência técnica nessa roça e hoje o seu Raimundo me deu a primeira caixa da colheita. agronomia é isso.",
      likes: 214,
      comments: [
        c('c1', 'jessica.fontenele', '2026-08-15T17:35', "meu agrônomo favorito 😍 traz suco!", 6),
        c('c2', 'josue.agro', '2026-08-15T18:40', "maracujá bonito demais. quanto tá a caixa aí?", 2),
        c('c3', 'thiago.paiva_', '2026-08-15T18:52', "@josue.agro R$ 60 a de 13 kg no atacado, seu Josué", 1),
      ],
    },
    {
      id: 'x-cajueiro-tapioca-1009', author: 'cafe.cajueiro', at: '2026-10-09T08:00', ratio: '4/5', place: 'Benfica, Fortaleza',
      caption: "sexta é dia de tapioca de carne de sol com nata 🫓☕ e café coado na hora. vem antes das 9h que a fila do Benfica não perdoa!",
      likes: 488,
      comments: [
        c('c1', 'nanda.lopes', '2026-10-09T08:15', "a @iarafontenele.foto tá na serra, sobrou a mesa da janela pra mim 😎", 7),
        c('c2', 'bia.rangel', '2026-10-09T09:40', "carne de sol com nata deveria ser patrimônio", 19),
      ],
    },
    {
      id: 'x-mila-noite-1010', author: 'mila.forrozeira', at: '2026-10-10T22:05', ratio: '4/5', place: 'Guaraciaba do Norte, CE',
      caption: "subi a serra só pra ouvir a banda do Rafa 🪗🌽 frio, poeira e forró bom. vale cada curva da estrada! #forropedeserra #ibiapaba",
      likes: 64,
      comments: [
        c('c1', 'bandadorafa.fc', '2026-10-10T22:20', "fã raiz é assim 🎶", 3),
        c('c2', 'mayara.sousa_', '2026-10-10T22:41', "tava lá também!! que noite", 1),
        c('c3', 'mila.forrozeira', '2026-10-11T14:00', "não consigo mais nem olhar essas fotos. que Deus conforte a família da fotógrafa. 🕊️", 9),
      ],
    },
  ],

  stories: [
    { id: 'x-st-cajueiro-0808', author: 'cafe.cajueiro', at: '2026-10-08T07:05', media: [], text: "abrimos! ☕ bolo de rolo saindo do forno agora" },
    { id: 'x-st-jessica-0810', author: 'jessica.fontenele', at: '2026-10-08T18:40', media: [], text: "prova do vestido nº 3 👰‍♀️ não posso mostrar, o noivo segue 🙈💍" },
    { id: 'x-st-bia-0910', author: 'bia.rangel', at: '2026-10-09T11:20', media: [], text: "sexta de praia 🌊 quem mais fugiu do trabalho?" },
    { id: 'x-st-humor-0910', author: 'ibiapabasemfiltro', at: '2026-10-09T19:00', media: [], text: "previsão do fim de semana na serra: 17°C. prepare o casaco de pele 🥶" },
    { id: 'x-st-eunice-1730', author: 'eunice.sobreira', at: '2026-10-10T17:30', media: [], text: "Casa sede pronta pra receber todo mundo 🌻🙏 Deus abençoe" },
    { id: 'x-st-eunice-1915', author: 'eunice.sobreira', at: '2026-10-10T19:15', media: [], text: "Já tem gente chegando! Que alegria ver o sítio cheio assim 🥰" },
    { id: 'x-st-mayara-1950', author: 'mayara.sousa_', at: '2026-10-10T19:50', media: [], text: "chegamos 🌽 fila no portão, mas o cheiro de churrasco compensa" },
    { id: 'x-st-eunice-2030', author: 'eunice.sobreira', at: '2026-10-10T20:30', media: [], text: "Baião de dois, paçoca e o meu bolo de milho na mesa do jantar 😋🌽" },
    { id: 'x-st-mayara-2045', author: 'mayara.sousa_', at: '2026-10-10T20:45', media: [], text: "a comida tá maravilhosa, já tô no segundo prato 🙈" },
    { id: 'x-st-mayara-2125', author: 'mayara.sousa_', at: '2026-10-10T21:25', media: [], text: "forró começou 🪗🔥 meu pai já tirou mainha pra dançar" },
    { id: 'x-st-eunice-2140', author: 'eunice.sobreira', at: '2026-10-10T21:40', media: [], text: "Olha o forró! Até eu dancei 😂🪗" },
    { id: 'x-st-mayara-2250', author: 'mayara.sousa_', at: '2026-10-10T22:50', media: [], text: "pé doendo, alma feliz. a gente desce a serra já já 🌙" },
    { id: 'x-st-visite-1011', author: 'visiteibiapaba', at: '2026-10-11T07:30', media: [], text: "Domingo de neblina em Ubajara ☁️ bondinho funciona normalmente" },
    { id: 'x-st-cajueiro-1212', author: 'cafe.cajueiro', at: '2026-10-12T07:10', media: [], text: "hoje o café abre mais tarde. estamos de luto pela nossa vizinha Iara 🌼" },
    { id: 'x-st-bia-1211', author: 'bia.rangel', at: '2026-10-11T16:00', media: [], text: "domingo tranquilo em casa, recarregando 🤍" },
    { id: 'x-st-humor-1310', author: 'ibiapabasemfiltro', at: '2026-10-13T10:00', media: [], text: "a serra segue de luto 🕊️ voltamos com os memes depois" },
  ],

  // Destaques para os stories acima aparecerem no app (o Instagram só mostra stories dentro de destaques).
  highlights: [
    { id: 'x-hl-mayara-noite', author: 'mayara.sousa_', title: 'Colheita 🌽', stories: ['x-st-mayara-1950', 'x-st-mayara-2045', 'x-st-mayara-2125', 'x-st-mayara-2250'] },
    { id: 'x-hl-eunice-sitio', author: 'eunice.sobreira', title: 'Sítio 🌻', stories: ['x-st-eunice-1730', 'x-st-eunice-1915', 'x-st-eunice-2030', 'x-st-eunice-2140'] },
    { id: 'x-hl-cajueiro', author: 'cafe.cajueiro', title: 'Cajueiro ☕', stories: ['x-st-cajueiro-0808', 'x-st-cajueiro-1212'] },
    { id: 'x-hl-bia', author: 'bia.rangel', title: 'Dia a dia', stories: ['x-st-bia-0910', 'x-st-bia-1211'] },
    { id: 'x-hl-jessica', author: 'jessica.fontenele', title: 'Casamento 💍', stories: ['x-st-jessica-0810'] },
    { id: 'x-hl-visite', author: 'visiteibiapaba', title: 'Ubajara', stories: ['x-st-visite-1011'] },
    { id: 'x-hl-humor', author: 'ibiapabasemfiltro', title: 'Previsão 🥶', stories: ['x-st-humor-0910', 'x-st-humor-1310'] },
  ],

  dms: [
    {
      id: 'x-dm-livia', with: 'livia.carv',
      messages: [
        { id: 'm1', from: 'them', at: '2026-09-15T20:40', text: "Iara, te marquei no post, espero que não ligue 🙈💍" },
        { id: 'm2', from: 'me', at: '2026-09-15T21:02', text: "ligo nada, amei!! 💛 já tô montando o moodboard de vocês" },
        { id: 'm3', from: 'them', at: '2026-10-06T19:12', text: "consegui confirmar o horário da cerimônia: 16h! a luz vai estar boa?" },
        { id: 'm4', from: 'me', at: '2026-10-06T19:30', text: "em dezembro, em Cascavel, 16h é perfeito. às 17h20 a gente rouba vocês 15 min pro pôr do sol 🌅" },
        { id: 'm5', from: 'them', at: '2026-10-06T19:31', text: "AAAA tô chorando já" },
        { id: 'm6', from: 'them', at: '2026-10-12T09:50', text: "Iara, vi uma notícia horrível e não quero acreditar. me diz que não é você 🙏" },
        { id: 'm7', from: 'them', at: '2026-10-12T12:40', text: "Meus sentimentos à sua família. Obrigada por tudo que você já fez pela gente. 🕊️" },
      ],
    },
    {
      id: 'x-dm-anaclara', with: 'anaclara.15',
      messages: [
        { id: 'm1', from: 'them', at: '2026-10-06T15:20', text: "oi! aqui é a Ana Clara, minha mãe pediu pra eu perguntar quanto é um ensaio de 15 anos 🎀 é em dezembro" },
        { id: 'm2', from: 'me', at: '2026-10-07T09:10', text: "oi, Ana Clara! que lindo 🎀 o ensaio externo de 2h sai R$ 650 com 40 fotos editadas. me passa o número da tua mãe que eu mando tudo certinho?" },
        { id: 'm3', from: 'them', at: '2026-10-07T13:45', text: "ela vai te chamar no WhatsApp! ela queria na praia ou no Dragão do Mar" },
        { id: 'm4', from: 'me', at: '2026-10-07T13:50', text: "os dois são ótimos! no Dragão o fim de tarde fica lindo 💜" },
        { id: 'm5', from: 'them', at: '2026-10-11T16:30', text: "oi! a mãe perguntou se dá pra fazer dia 28/11?" },
        { id: 'm6', from: 'them', at: '2026-10-13T11:02', text: "oi? 🥺" },
      ],
    },
    {
      id: 'x-dm-foco', with: 'foconordeste.lentes',
      messages: [
        { id: 'm1', from: 'them', at: '2026-09-25T11:07', text: "Oi, Iara! Sobre a 35mm f/1.8: temos uma seminova, 98% de conservação, revisada e com troca em 6 meses. R$ 2.390 ou 10x sem juros." },
        { id: 'm2', from: 'me', at: '2026-09-25T11:30', text: "aceita a minha 50mm quebrada como parte? 😅 brincadeira. consegue segurar até eu voltar da serra?" },
        { id: 'm3', from: 'them', at: '2026-09-25T11:34', text: "Kkkk a 50mm a gente manda pro conserto se quiser! Seguramos sim, até segunda 12/10, combinado?" },
        { id: 'm4', from: 'me', at: '2026-09-25T11:35', text: "combinadíssimo 🙏" },
        { id: 'm5', from: 'them', at: '2026-10-09T10:00', text: "Bom dia! Só lembrando que a 35mm segue reservada no seu nome 📸" },
        { id: 'm6', from: 'them', at: '2026-10-12T16:40', text: "Iara, ficamos sabendo. Não temos palavras. Nossos sentimentos à família." },
      ],
    },
    {
      id: 'x-dm-brisaria', with: 'brisaria.moda',
      messages: [
        { id: 'm1', from: 'them', at: '2026-10-02T14:00', text: "Olá, Iara! Somos a Brisaria, moda praia feita no Ceará 🌊 Amamos sua fotografia com luz natural. Topa uma parceria para a campanha de verão? Ensaio na praia + 2 posts." },
        { id: 'm2', from: 'me', at: '2026-10-03T10:20', text: "oi, gente! amo a marca 🌊 topo conversar sim. me mandem o briefing e a data que eu mando o orçamento do ensaio e o mídia kit" },
        { id: 'm3', from: 'them', at: '2026-10-03T10:45', text: "Perfeito! Pensamos em novembro, Praia do Futuro ou Cumbuco. Mandamos o briefing por e-mail até sexta." },
        { id: 'm4', from: 'them', at: '2026-10-10T11:15', text: "Iara, briefing enviado pro seu e-mail! Qualquer dúvida estamos aqui 😊" },
        { id: 'm5', from: 'them', at: '2026-10-13T15:00', text: "Oi, Iara! Conseguiu ver o briefing?" },
      ],
    },
    {
      id: 'x-dm-embaixador', with: 'embaixadores.oficial.br',
      messages: [
        { id: 'm1', from: 'them', at: '2026-10-01T03:20', text: "🎉 PARABÉNS @iarafontenele.foto! Seu perfil foi SELECIONADO para ser embaixadora oficial! Receba produtos grátis 🎁 Responda SIM para garantir sua vaga." },
        { id: 'm2', from: 'them', at: '2026-10-04T02:55', text: "⚠️ Sua vaga expira em 24h! Clique no link da bio e pague apenas o frete de R$ 29,90 para receber seu kit." },
        { id: 'm3', from: 'them', at: '2026-10-11T04:10', text: "ÚLTIMA CHANCE ⏳ embaixadora, seu kit está separado! Não perca!" },
      ],
    },
    {
      id: 'x-dm-mila', with: 'mila.forrozeira',
      messages: [
        { id: 'm1', from: 'them', at: '2026-10-11T08:05', text: "oi moça! tu é a fotógrafa da festa de ontem no sítio né? 😊 vi tua câmera de longe" },
        { id: 'm2', from: 'them', at: '2026-10-11T08:06', text: "se tiver alguma foto minha dançando no forró me manda? eu tava de vestido vermelho de bolinha 🙏🪗" },
        { id: 'm3', from: 'them', at: '2026-10-11T13:30', text: "meu Deus. acabei de ver a notícia. me desculpa por ter mandado mensagem. que Deus conforte tua família. 🕊️" },
      ],
    },
    {
      id: 'x-dm-pedroelu', with: 'pedroelu.casal',
      messages: [
        { id: 'm1', from: 'them', at: '2026-08-29T21:00', text: "Oi, Iara! A Lu aqui. Queria fechar o pré-wedding pra outubro, aquele pacote de 3h que você mandou" },
        { id: 'm2', from: 'me', at: '2026-08-29T21:20', text: "oi, Lu!! bora! 24/10 de manhã ou fim de tarde? 💛" },
        { id: 'm3', from: 'them', at: '2026-08-29T21:22', text: "fim de tarde! na Sabiaguaba, pode?" },
        { id: 'm4', from: 'me', at: '2026-08-29T21:25', text: "perfeito, as dunas às 16h30 são mágicas. sinal de 30% e tá garantido" },
        { id: 'm5', from: 'them', at: '2026-10-08T18:10', text: "comprei o vestido do ensaio!! amarelo, tá bom pra luz?" },
        { id: 'm6', from: 'me', at: '2026-10-08T18:40', text: "AMARELO NAS DUNAS 😍 vai ficar de capa de revista" },
        { id: 'm7', from: 'them', at: '2026-10-12T14:05', text: "Iara... a gente soube. não sei nem o que escrever. vamos guardar o vestido amarelo. 💔" },
      ],
    },
    {
      id: 'x-dm-jessica', with: 'jessica.fontenele',
      messages: [
        { id: 'm1', from: 'them', at: '2026-09-28T09:00', text: "prima, o Thiago perguntou se tu filma também ou só foto 😅" },
        { id: 'm2', from: 'me', at: '2026-09-28T09:12', text: "foto eu, vídeo o Davi da faculdade, já falei com ele! presente de casamento, nem pensa em pagar" },
        { id: 'm3', from: 'them', at: '2026-09-28T09:13', text: "TU NÃO EXISTE 😭💍" },
        { id: 'm4', from: 'them', at: '2026-10-08T18:45', text: "postei a prova do vestido escondendo tudo kkkk tu vai ver ao vivo primeiro" },
        { id: 'm5', from: 'me', at: '2026-10-08T19:30', text: "sábado eu tô na serra, se der passo aí domingo pra ver 👀" },
        { id: 'm6', from: 'them', at: '2026-10-11T09:30', text: "prima, cadê tu? tia Socorro tá chorando aqui" },
        { id: 'm7', from: 'them', at: '2026-10-12T23:58', text: "eu não vou tirar teu nome da lista da mesa dos padrinhos. não vou." },
      ],
    },
    {
      id: 'x-dm-kel', with: 'kel.araujo',
      messages: [
        { id: 'm1', from: 'them', at: '2026-09-05T17:00', text: "amiga, obrigada pelas fotos do aniversário do Benício!! ele tá mostrando pra todo mundo 🦖💙" },
        { id: 'm2', from: 'me', at: '2026-09-05T17:20', text: "presente da tia Iara! 💙 manda um beijo nele" },
        { id: 'm3', from: 'them', at: '2026-10-09T20:15', text: "tu tá na serra? amanhã eu não consigo ir na festa, plantão 😩 aproveita por mim" },
        { id: 'm4', from: 'me', at: '2026-10-09T20:40', text: "tô! vou trabalhar a noite toda kkk mas aproveito sim. bom plantão 🙏" },
        { id: 'm5', from: 'them', at: '2026-10-11T10:20', text: "Iara, me responde. tão dizendo uma coisa horrível aqui em Tianguá. me responde por favor 🙏" },
      ],
    },
  ],

  notifications: [
    { at: '2025-12-25T22:24', text: "jessica.fontenele respondeu ao seu comentário: “era o meu primeiro pedido!!! 🥹”", actor: 'jessica.fontenele', post: 'x-jessica-noivado-2512' },
    { at: '2026-01-18T19:30', text: "bia.rangel comentou na sua publicação: “que luz é essa 😍 salvando pra referência”", actor: 'bia.rangel', post: 'x-ia-praia-2601' },
    { at: '2026-01-18T19:31', text: "bia.rangel começou a seguir você", actor: 'bia.rangel' },
    { at: '2026-06-29T10:15', text: "eunice.sobreira comentou na sua publicação: “Minhas duas meninas 🥰🙏 Deus abençoe essa amizade”", actor: 'eunice.sobreira', post: 'x-ia-saojoao-2606' },
    { at: '2026-08-26T19:35', text: "camilabezerra.mae comentou na sua publicação: “EU CHOREI DE NOVO. obrigada por me enxergar assim 😭🤍”", actor: 'camilabezerra.mae', post: 'x-ia-gestante-2608' },
    { at: '2026-09-01T19:00', text: "pedroelu.casal marcou você em uma publicação", actor: 'pedroelu.casal', post: 'x-pedroelu-save-0901' },
    { at: '2026-09-15T20:10', text: "livia.carv marcou você em uma publicação", actor: 'livia.carv', post: 'x-livia-noivado-0915' },
    { at: '2026-09-15T18:24', text: "camila.sa.jor respondeu ao seu comentário: “e eu nunca vou deixar de te creditar 🙏”", actor: 'camila.sa.jor', post: 'x-camila-podcast-0915' },
    { at: '2026-09-22T09:00', text: "clinicaalmeida.ce marcou você em uma publicação", actor: 'clinicaalmeida.ce', post: 'x-clinica-equipe-0922' },
    { at: '2026-09-25T11:08', text: "foconordeste.lentes mencionou você em um comentário: “te chamei no direct! 📩”", actor: 'foconordeste.lentes', post: 'x-foco-promo-0925' },
    { at: '2026-09-27T20:52', text: "jessica.fontenele curtiu seu comentário: “o vídeo de tu dançando vai passar no telão do casamento 😈”", actor: 'jessica.fontenele', post: 'x-thiago-cha-2609' },
    { at: '2026-09-28T08:20', text: "nanda.lopes mencionou você em um comentário: “a mesa da janela é da @iarafontenele.foto, todo mundo sabe”", actor: 'nanda.lopes', post: 'x-cajueiro-bolo-0928' },
    { at: '2026-10-01T03:20', text: "embaixadores.oficial.br quer enviar uma mensagem para você", actor: 'embaixadores.oficial.br' },
    { at: '2026-10-03T14:20', text: "camilabezerra.mae marcou você em uma publicação", actor: 'camilabezerra.mae', post: 'x-camilab-heitor-1003' },
    { at: '2026-10-05T21:40', text: "cafe.cajueiro comentou na sua publicação: “traindo a gente com outro café, Iara? 😢☕”", actor: 'cafe.cajueiro', post: 'x-ia-cafe-0510' },
    { at: '2026-10-06T11:40', text: "cafe.cajueiro curtiu sua publicação", actor: 'cafe.cajueiro', post: 'x-ia-cafe-0510' },
    { at: '2026-10-07T19:55', text: "pauloribeiro.foto comentou na sua publicação: “o fill do lado direito tá lindo. quem ministrou?”", actor: 'pauloribeiro.foto', post: 'x-ia-workshop-0710' },
    { at: '2026-10-07T20:30', text: "renata.pinho.rp comentou na sua publicação: “tu trabalha até no dia de folga mulher”", actor: 'renata.pinho.rp', post: 'x-ia-workshop-0710' },
    { at: '2026-10-09T13:20', text: "camila.sa.jor comentou na sua publicação: “TU TÁ EM SOBRAL E NÃO ME AVISOU??? 😤”", actor: 'camila.sa.jor', post: 'x-ia-sobral-0910' },
    { at: '2026-10-09T14:01', text: "davimendes.av comentou na sua publicação: “o professor ainda usa aquele colete de mil bolsos?”", actor: 'davimendes.av', post: 'x-ia-sobral-0910' },
    { at: '2026-10-09T18:12', text: "mila.forrozeira começou a seguir você", actor: 'mila.forrozeira' },
    { at: '2026-10-10T17:40', text: "eunice.sobreira curtiu sua publicação", actor: 'eunice.sobreira', post: 'x-ia-saojoao-2606' },
    { at: '2026-10-10T21:50', text: "mayara.sousa_ começou a seguir você", actor: 'mayara.sousa_' },
    { at: '2026-10-11T19:30', text: "eunice.sobreira mencionou você em uma publicação", actor: 'eunice.sobreira', post: 'x-eunice-luto-1011' },
    { at: '2026-10-11T21:30', text: "camila.sa.jor mencionou você em uma publicação", actor: 'camila.sa.jor', post: 'x-camila-luto-1011' },
    { at: '2026-10-12T08:14', text: "Você tem 312 novos seguidores", actor: null },
    { at: '2026-10-12T21:15', text: "jessica.fontenele mencionou você em uma publicação", actor: 'jessica.fontenele', post: 'x-jessica-luto-1012' },
    { at: '2026-10-12T22:16', text: "pauloribeiro.foto comentou em uma publicação em que você foi marcada", actor: 'pauloribeiro.foto', post: 'x-jessica-luto-1012' },
    { at: '2026-10-13T08:00', text: "cafe.cajueiro publicou uma homenagem: “Hoje a mesa da janela vai ficar vazia…”", actor: 'cafe.cajueiro', post: 'x-cajueiro-mesa-1013' },
    { at: '2026-10-13T11:02', text: "anaclara.15 enviou uma mensagem: “oi? 🥺”", actor: 'anaclara.15' },
    { at: '2026-10-13T15:00', text: "brisaria.moda enviou uma mensagem: “Oi, Iara! Conseguiu ver o briefing?”", actor: 'brisaria.moda' },
  ],
};
