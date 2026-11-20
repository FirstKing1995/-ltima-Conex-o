// Notas extras de Iara (aparelho: até sáb 23:47). Somado a data/caso01/notas.js. Só a vida comum.

const ck = (...items) => items.map(([text, done]) => ({ text, done: !!done }));

const notes = [
  {
    id: 'x-compras-casa', title: 'Casa (comprar)', color: 'verde',
    created: '2026-09-21T20:10', edited: '2026-10-04T11:30',
    checklist: ck(['Lâmpada do banheiro', 1], ['Sabão de lava-roupa', 1], ['Papel toalha', 1], ['Pilha AA (8)', 0], ['Filtro de café', 1], ['Vaso pra costela-de-adão', 0], ['Cortina blackout do quarto', 0]),
  },
  {
    id: 'x-ensaios-novembro', title: 'Ensaios pra oferecer em novembro', color: 'roxo',
    created: '2026-09-03T21:40', edited: '2026-10-01T22:05',
    body: `- Mini sessão de Natal na Praça do Ferreira (20 min, 15 fotos, R$ 250).
- Retrato de família na varanda, na luz da manhã.
- Ensaio de casal no Centro Dragão do Mar, depois das 17h.
- Ensaio pet: cachorro e dono no mesmo enquadramento.
- Pacote de fotos profissionais pra LinkedIn (fundo neutro, 3 looks).`,
  },
  {
    id: 'x-equip-casamento', title: 'Equipamento: casamento (padrão)', color: 'azul',
    created: '2026-07-12T10:00', edited: '2026-09-13T09:50',
    checklist: ck(
      ['2 corpos + 4 baterias', 1],
      ['24-70, 85 e 35', 1],
      ['2 flashes + pilhas reserva (16)', 1],
      ['Difusor e gelatina laranja', 1],
      ['6 cartões de 128 GB', 1],
      ['Monopé', 1],
      ['Lista de fotos de família impressa', 0],
      ['Barra de cereal e água', 0],
      ['Sapato confortável (nunca mais de salto)', 1],
    ),
  },
  {
    id: 'x-cuscuz-mae', title: 'Cuscuz da mãe', color: 'laranja',
    created: '2026-06-28T09:15', edited: '2026-06-28T09:15',
    body: `2 xícaras de flocão, 1 colher (chá) de sal, água aos pouquinhos até a massa ficar úmida, mas soltinha.
Deixar descansar 10 min. Cuscuzeira com água até a marca, pano molhado na tampa.
Uns 12 min no fogo médio. Manteiga da terra por cima, ainda quente.

A mãe põe um pouquinho de coco ralado quando tem visita. Diz que é segredo, mas a serra inteira sabe.`,
  },
  {
    id: 'x-legendas-2', title: 'Legendas (rascunhos)', color: 'cinza',
    created: '2026-09-10T22:30', edited: '2026-10-07T23:15',
    body: `"Quem acorda antes do sol vende o dia." (pro TCC)
"Luz de janela não cobra cachê."
"Fotografei o mar de novo. Ele continua não posando."
"Toda família tem um tio que fecha o olho na foto. Esse é o meu trabalho: ele de olho aberto."
"Casamento é a única festa em que o fotógrafo chega antes da noiva."`,
  },
  {
    id: 'x-wifi', title: 'wi-fi do apê', color: 'cinza',
    created: '2026-02-11T18:20', edited: '2026-02-11T18:20',
    body: `rede: ape_das_meninas
senha: benfica2024

(pra quando vier visita. a Nanda pediu pra não trocar)`,
  },
  {
    id: 'x-orcamento-lente', title: 'Lente nova (orçamento)', color: 'amarelo',
    created: '2026-09-05T13:00', edited: '2026-10-03T19:20',
    body: `35mm f/1.4 nova: R$ 5.890 na Loja Foco (8% no Pix: R$ 5.418)
50mm f/1.8: R$ 1.149 na FotoBras (barata, mas o foco é lento)
35 usada (grupo de fotógrafos): R$ 3.900, sem nota

Conclusão: esperar o pagamento do casamento da Lívia. Até lá, a 50 resolve.`,
  },
  {
    id: 'x-tcc-pendencias', title: 'TCC: pendências', color: 'roxo', pinned: false,
    created: '2026-08-28T08:00', edited: '2026-10-06T22:40',
    checklist: ck(
      ['Cortar 8 fotos (ficar com 12)', 1],
      ['Reescrever o memorial na primeira pessoa', 1],
      ['Autorização da Dona Graça', 1],
      ['Autorização do Seu Valdir do peixe', 1],
      ['Autorização do menino do caldo de cana (falar com a mãe dele)', 0],
      ['Referências: Tiago Santana, Maureen Bisilliat', 1],
      ['Revisar ABNT', 0],
      ['Subir no portal até 20/10', 0],
    ),
  },
  {
    id: 'x-filmes', title: 'Filmes pra ver', color: 'rosa',
    created: '2026-05-30T23:10', edited: '2026-09-27T23:40',
    checklist: ck(['Central do Brasil (rever)', 1], ['Bacurau', 1], ['Aquarius', 0], ['O Som ao Redor', 0], ['Maré Baixa (série, Netflix)', 0], ['Documentário do Sebastião Salgado', 1]),
  },
  {
    id: 'x-gastos-outubro', title: 'Contas de outubro', color: 'vermelho',
    created: '2026-10-01T08:10', edited: '2026-10-07T20:25',
    checklist: ck(['Aluguel R$ 1.450', 1], ['Luz R$ 168,32', 1], ['Internet R$ 99,90', 1], ['Celular R$ 79,90', 1], ['Academia R$ 119,90', 0], ['Rateio caixa d\'água R$ 85', 0], ['Netflix R$ 39,90', 1]),
  },
];

export default { notes };
