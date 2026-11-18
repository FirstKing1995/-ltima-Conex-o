// Notas de Iara (aparelho: até sáb 23:47). Sem senhas aqui: ela deixava tudo no gerenciador.

const ck = (...items) => items.map(([text, done]) => ({ text, done: !!done }));

const notes = [
  {
    id: 'equip-evento', title: 'Equipamento: Noite da Colheita (sáb 10/10)', pinned: true, color: 'amarelo',
    created: '2026-10-05T21:40', edited: '2026-10-10T16:55',
    checklist: ck(
      ['2 corpos de câmera + 2 baterias reserva cada', 1],
      ['Lentes 24-70 e 70-200', 1],
      ['Flash e difusor', 1],
      ['3 cartões formatados (128 GB)', 1],
      ['tripé', 1],
      ['Intervalômetro e filtro polarizador', 1],
      ['Lanterna de cabeça (mirante depois das 17h30)', 1],
      ['Power bank + cabo', 1],
      ['Credencial no pescoço', 1],
      ['timelapse do pôr do sol no mirante (17:55)', 0],
      ['Drone: deixar carregando na casa sede', 1],
      ['Fotos do galpão vazio antes de abrir os portões', 1],
      ['Cobrir o discurso do Caio (23:30), lateral do palco', 0],
    ),
  },
  {
    id: 'perguntas-bruna', title: 'Perguntas para a Bruna', pinned: true, color: 'azul',
    created: '2026-09-23T22:15', edited: '2026-10-09T23:10',
    body: `Pra segunda, dia 12:

1. Quanto tempo leva para publicar? E se a Colheita processar?
2. Como o jornal protege quem entrega o material? Eu apareço?
3. O que acontece com as famílias que já colocaram dinheiro? Dá pra recuperar alguma coisa?
4. A taxa de garantia entra na mesma reportagem ou vira outra?
5. Posso falar com o advogado do jornal antes de assinar qualquer coisa?
6. E o termo de confidencialidade, a multa de R$ 100 mil vale?

Levar: o celular com a Pasta Segura, um documento com foto, o contrato padrão impresso.

Lembrar: não mandar nada por e-mail. Entregar em mãos.`,
  },
  {
    id: 'coisas-que-eu-sei', title: 'coisas que eu sei', pinned: true, color: 'vermelho', req: 'cap3',
    created: '2026-09-30T21:50', edited: '2026-10-05T22:20',
    body: `1. A Colheita Capital é uma pirâmide. Não tem fazenda. Santa Luzia é um sítio alugado por um dia (R$ 800, conhecido do Caio). As fotos de colheita são de banco de imagens.
2. Os 4% ao mês saem do dinheiro dos novos. O bônus de indicação (1%) é o motor.
3. O Caio sabe de tudo. Ouvi ele dizer ao Marcos, na van: "a safra é o evento".
4. Bônus de R$ 20 mil em 25/09 era para eu ficar calada. Devolvi.
5. Termo de confidencialidade, cláusula 4: multa de R$ 100 mil. Ele me lembrou em 08/10.
6. A taxa de garantia: por fora, por Pix, para a firma M E S ANDRADE ME. A cobrança vem do (88) 99645-1209. 9 famílias, R$ 145 mil. Eu sei de quem é. Não consigo escrever o nome.
7. O pai está entre elas: R$ 30 mil em 14/08.
8. A cláusula 7 do contrato padrão diz que a Colheita Capital não cobra taxa nenhuma.
9. A Bruna Leal é quem pode publicar. Dia 12, 10h.
10. Tudo guardado na Pasta Segura. O Théo sabe onde.`,
  },
  {
    id: 'desabafo-duda', title: 'duda', color: 'rosa', req: 'solved:d3',
    created: '2026-10-02T00:12', edited: '2026-10-02T00:48',
    body: `Eu não tô conseguindo dormir.

Ela chorou. Pediu um tempo. Disse que ia resolver, que ia devolver tudo, que o dinheiro foi "para cobrir buraco". Que o Caio também apertou ela. Eu quero acreditar. A gente cresceu junta. Foi ela quem ficou comigo quando eu tirei meu primeiro 4 em redação, quem me emprestou a casa da serra quando eu não tinha dinheiro pra voltar.

Mas é o meu pai. É o dinheiro do Seu Manoel, da Dona Raimunda, de gente que vendeu gado. Isso não é um erro, é um plano. Ela olhou na minha cara em julho e continuou aceitando Pix.

Disse "dia 12". É o dia da Bruna. Se ela devolver tudo até lá, eu penso no que fazer. Se não, eu entrego.

Odeio isso. Odeio ter que escolher.`,
  },
  {
    id: 'lista-mercado', title: 'Mercado', color: 'verde',
    created: '2026-10-08T19:30', edited: '2026-10-08T19:45',
    checklist: ck(['Arroz', 1], ['Feijão', 1], ['Café', 1], ['Leite', 1], ['Ovos', 1], ['Banana', 0], ['Pão de forma', 0], ['Detergente', 1], ['Shampoo da Nanda (devolver)', 0]),
  },
  {
    id: 'mala-serra', title: 'Mala para a serra', color: 'verde',
    created: '2026-10-08T22:20', edited: '2026-10-09T05:40',
    checklist: ck(['2 camisas (uma é a verde)', 1], ['Casaco: venta no mirante', 1], ['Carregador do celular', 1], ['Remédio de alergia', 1], ['Fones', 1], ['Presente pra mãe', 1], ['Ração do Bento', 0]),
  },
  {
    id: 'pipoca-2009', title: 'Pipoca 2009', color: 'laranja',
    created: '2026-09-14T23:55', edited: '2026-09-14T23:55',
    body: `Pipoca. A primeira cachorrinha, aquela vira-lata branca malhada de marrom. Dormia em cima do meu pé enquanto eu aprendia a segurar a câmera da minha mãe.

Todo mundo acha que foi a faculdade que me fez fotógrafa. Não foi. Foi ela, posando de um jeito que nenhum cachorro posa.`,
  },
  {
    id: 'ideias-ensaio', title: 'Ideias de ensaio', color: 'roxo',
    created: '2026-08-02T22:10', edited: '2026-09-30T08:00',
    body: `- Mãos que trabalham (feirantes, costureiras, agricultores da serra).
- Retratos de contra-luz no fim de tarde, em lugares onde a luz entra baixa.
- Ensaio na estação abandonada de Ubajara.
- Fotolivro "Quem fica": os que ficam na serra.
- Série de cachorros de rua com nome e história.`,
  },
  {
    id: 'ideia-serie-maos', title: 'Série "Mãos da serra"', color: 'laranja',
    created: '2026-09-09T20:45', edited: '2026-09-09T20:45',
    body: `Começar pelas mãos do meu pai. Descascando milho, consertando a cerca, segurando o Bento. Pedir que ele não olhe pra câmera.

Título provisório: "O que a terra deixa nas mãos".`,
  },
  {
    id: 'orcamento-livia', title: 'Casamento Lívia e João (12/12)', color: 'azul',
    created: '2026-09-13T09:40', edited: '2026-09-20T18:12',
    body: `Pacote B: R$ 5.400. Sinal de 30%: R$ 1.620 (ainda não pagaram).
Perguntar: tem cerimônia ao ar livre? Horário? Quem faz o making-of?
Levar assistente (Lara? Pedro?). Duas baterias de flash a mais.`,
  },
  {
    id: 'camila-refs', title: 'Camila: referências', color: 'rosa',
    created: '2026-08-10T11:20', edited: '2026-08-10T11:20',
    body: `Luz de janela, tons de terra, tecido solto, sem sorriso forçado. Pedir pra ela fechar os olhos e respirar fundo antes do clique.`,
  },
  {
    id: 'visita-boa-esperanca', title: 'Visita Boa Esperança (28/07)', color: 'cinza',
    created: '2026-07-28T20:10', edited: '2026-07-28T20:40',
    body: `O vigia disse que a fazenda é de um tio do Caio, mas que ninguém planta nada ali desde 2022. Colocaram gente de colete e uns sacos de milho pra filmar. A "colheita" durou 20 minutos.

Não falei nada. Fiquei com o vídeo bruto.`,
  },
  {
    id: 'frases-legendas', title: 'Legendas (banco)', color: 'cinza',
    created: '2026-06-18T14:02', edited: '2026-09-12T09:30',
    body: `"A luz boa dura quinze minutos. Fotografe como se fosse a última."
"Ninguém vê o que a câmera não escolhe."
"Voltar pra casa também é um tipo de viagem."
"Tudo que eu amo cabe num cartão de memória."`,
  },
  {
    id: 'pauta-lume', title: 'Pauta do Lume (outubro)', color: 'amarelo',
    created: '2026-10-01T09:05', edited: '2026-10-07T21:10',
    checklist: ck(['Reels: bastidor do ensaio da Camila', 1], ['Carrossel: 5 erros de luz', 1], ['Post: Noite da Colheita (só depois da liberação do Marcos)', 0], ['Story: antes e depois da edição', 0]),
  },
  {
    id: 'dentista', title: 'Dentista 15/10', color: 'ciano',
    created: '2026-10-06T21:22', edited: '2026-10-06T21:22',
    body: `Clínica Sorriso Benfica, quinta, 14:30. Sinal de R$ 80 já pago. Perguntar sobre o siso e sobre branqueamento. Levar o encaminhamento.`,
  },
  {
    id: 'presente-pai', title: 'Presente pro pai (aniversário 02/11)', color: 'laranja',
    created: '2026-09-27T20:00', edited: '2026-09-27T20:00',
    body: `Ideias: chapéu novo (o dele já tá furado), uma foto revelada e emoldurada do Bento, rádio de pilha.
Perguntar pra mãe o tamanho do chapéu.`,
  },
  {
    id: 'bolo-milho-mae', title: 'Bolo de milho da mãe', color: 'laranja',
    created: '2026-09-12T21:12', edited: '2026-09-12T21:12',
    body: `5 espigas de milho verde, 3 ovos, 1 xícara de açúcar, 1/2 xícara de óleo, 1 colher de fermento. Bater tudo no liquidificador, assar 40 min. A mãe jura que o segredo é um pouco de erva-doce.`,
  },
  {
    id: 'playlist-editar', title: 'Playlist pra editar', color: 'roxo',
    created: '2026-08-15T22:30', edited: '2026-09-18T22:00',
    body: `Luiz Gonzaga (Asa Branca, versão lenta)
Tim Bernardes
Maria Gadú
Fagner (ao vivo)
Ludmilla pra acelerar o fim da edição`,
  },
  {
    id: 'metas-outubro', title: 'Metas de outubro', color: 'verde',
    created: '2026-10-01T07:30', edited: '2026-10-09T05:45',
    checklist: ck(['Entregar o ensaio da clínica', 1], ['Mandar orçamento do casamento', 1], ['Terminar a pasta pra Bruna', 1], ['Dentista', 0], ['Voltar a correr', 0], ['Falar com minha mãe todo dia', 0]),
  },
  {
    id: 'senhas-nao', title: 'senhas: NÃO', color: 'cinza',
    created: '2026-06-02T08:00', edited: '2026-06-02T08:00',
    body: `Aqui não vai senha nenhuma. Tá tudo no gerenciador. Se eu esquecer, eu me viro.`,
  },
  {
    id: 'dezessete', title: '17', color: 'cinza', req: 'final_verdade',
    created: '2026-09-27T23:58', edited: '2026-10-09T00:41',
    body: `58 · Joana?
75 · Chica (o seu Zé achou)
92 · tia Tônia
09 · Rô
26 · ?

+17 +17 +17 +17

perguntar pro pai da tia Tônia. ele vai sair da sala de novo.
cartório de Ipu: livro A-3.
o seu Zé sabe. o seu Zé sempre soube.`,
  },
];

export default { notes };
