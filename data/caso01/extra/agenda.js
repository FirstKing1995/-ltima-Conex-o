// Agenda extra de Iara (aparelho: até sáb 23:47). Somado a data/caso01/agenda.js.
// Só a rotina: ensaios, clientes, pós, saúde, família. Nada em 10/10 nem em 12/10.

const events = [
  /* ---- maio e junho ---- */
  { id: 'x-pos-aula-0516', title: 'Pós: seminário de projeto', start: '2026-05-16T08:00', end: '2026-05-16T12:00', color: 'roxo', place: 'Faculdade Atlântico, bloco B', notes: 'Levar 3 ideias de TCC impressas.' },
  { id: 'x-reuniao-rosilene', title: 'Call com Rosilene (15 anos da Thaís)', start: '2026-05-25T19:00', end: '2026-05-25T19:30', color: 'verde', notes: 'Alinhar estilo: ela quer "natural, nada de pose de revista".' },
  { id: 'x-preprojeto', title: 'Entregar pré-projeto do TCC', start: '2026-06-05', allDay: true, color: 'roxo' },
  { id: 'x-mercado-1', title: 'Mercado São Sebastião: fotos do TCC', start: '2026-06-20T04:30', end: '2026-06-20T07:00', color: 'roxo', place: 'Mercado São Sebastião, Centro, Fortaleza', notes: 'Bora às 4h10. Levar o 35 e a lanterna pequena. Pedir autorização por escrito.' },
  { id: 'x-saojoao', title: 'São João de Guaraciaba', start: '2026-06-27', end: '2026-06-28', allDay: true, color: 'laranja', place: 'Guaraciaba do Norte' },

  /* ---- julho ---- */
  { id: 'x-dermato', title: 'Dermatologista (Dra. Luíza)', start: '2026-07-08T10:20', end: '2026-07-08T11:00', color: 'ciano', place: 'Clínica Pele Viva, Aldeota' },
  { id: 'x-ensaio-thais', title: 'Ensaio: Thaís 15 anos', start: '2026-07-11T16:30', end: '2026-07-11T18:00', color: 'verde', place: 'Dragão do Mar, Praia de Iracema', notes: 'Luz baixa às 17h15. Vestido azul + tênis branco.' },
  { id: 'x-festa-thais', title: 'Festa 15 anos: Thaís', start: '2026-07-18T19:00', end: '2026-07-19T00:00', color: 'verde', place: 'Salão Estrela, Montese', notes: 'Valsa às 21h. Pedir prato pra equipe.' },
  { id: 'x-mercado-2', title: 'Mercado São Sebastião: fotos do TCC', start: '2026-07-25T04:30', end: '2026-07-25T07:00', color: 'roxo', place: 'Mercado São Sebastião, Centro, Fortaleza', notes: 'Voltar na Dona Graça das ervas e no Seu Valdir do peixe.' },

  /* ---- agosto ---- */
  { id: 'x-curso-estudio', title: 'Curso Luz de Estúdio (Escola Olhar)', start: '2026-08-08T09:00', end: '2026-08-08T13:00', color: 'amarelo', place: 'Escola Olhar, Aldeota', notes: 'Sábados de agosto. Levar o 85.' },
  { id: 'x-ensaio-camila', title: 'Ensaio gestante: Camila', start: '2026-08-15T16:00', end: '2026-08-15T17:30', color: 'verde', place: 'Apê da Camila, Meireles', notes: 'Luz de janela, tecido solto. Ver nota de referências.' },
  { id: 'x-tcc-versao1', title: 'TCC: primeira versão', start: '2026-08-21', allDay: true, color: 'roxo' },
  { id: 'x-dentista-limpeza', title: 'Limpeza (Dr. Hélio)', start: '2026-08-27T15:30', end: '2026-08-27T16:15', color: 'ciano', place: 'Clínica Odonto Benfica' },
  { id: 'x-academia-0831', title: 'Academia', start: '2026-08-31T06:30', end: '2026-08-31T07:30', color: 'cinza', place: 'Ritmo Fit', notes: 'Voltar de verdade dessa vez.' },

  /* ---- setembro ---- */
  { id: 'x-briefing-clinica', title: 'Reunião com a Renata (Clínica Almeida)', start: '2026-09-02T11:00', end: '2026-09-02T11:45', color: 'verde', place: 'Clínica Almeida, Aldeota', notes: 'Ver as salas, conferir a luz da recepção, lista de nomes.' },
  { id: 'x-academia-0908', title: 'Academia', start: '2026-09-08T06:30', end: '2026-09-08T07:30', color: 'cinza', place: 'Ritmo Fit' },
  { id: 'x-mercado-3', title: 'Mercado São Sebastião: últimas fotos', start: '2026-09-12T04:30', end: '2026-09-12T07:00', color: 'roxo', place: 'Mercado São Sebastião, Centro, Fortaleza', notes: 'Faltam 2 retratos. Levar as autorizações assinadas pra conferir.' },
  { id: 'x-edital-fundo', title: 'Prazo: Edital de Artes Visuais', start: '2026-09-15', allDay: true, color: 'amarelo', notes: 'Decidi não mandar. Fica pro ano que vem.' },
  { id: 'x-aniv-mae-almoco', title: 'Aniversário da mãe: almoço em casa', start: '2026-09-20T12:00', end: '2026-09-20T15:00', color: 'rosa', place: 'Casa dos pais, Guaraciaba do Norte', notes: 'Levar o bolo da padaria da praça. Ligar cedo pra dar parabéns antes de todo mundo.' },
  { id: 'x-manicure', title: 'Unha (Jéssica)', start: '2026-09-24T18:00', end: '2026-09-24T19:00', color: 'rosa' },

  /* ---- outubro (antes e depois do fim de semana na serra) ---- */
  { id: 'x-condominio', title: 'Reunião do condomínio (a Nanda vai)', start: '2026-10-08T19:30', end: '2026-10-08T21:00', color: 'cinza', place: 'Salão do Ed. Benfica Plaza' },
  { id: 'x-entrega-moura', title: 'Entregar fotos: família Moura', start: '2026-10-13', allDay: true, color: 'verde' },
  { id: 'x-oficina-cor', title: 'Oficina online: cor em lote', start: '2026-10-15T19:00', end: '2026-10-15T20:30', color: 'amarelo' },
  { id: 'x-batizado-miguel', title: 'Batizado do Miguel (Aline)', start: '2026-10-18T08:40', end: '2026-10-18T12:00', color: 'verde', place: 'Paróquia de Fátima, Fortaleza', notes: 'Cerimônia 9h. Almoço depois, endereço a confirmar. Sinal pago.' },
  { id: 'x-tcc-final', title: 'TCC: versão final no portal', start: '2026-10-20', allDay: true, color: 'roxo', notes: 'PDF, imagens em baixa. Não deixar pro último dia.' },

  /* ---- novembro ---- */
  { id: 'x-banca-tcc', title: 'Banca do TCC', start: '2026-11-06T14:00', end: '2026-11-06T16:00', color: 'roxo', place: 'Faculdade Atlântico, bloco B, sala 12', notes: 'Banca: Heitor, Cecília Arruda e Ivan Holanda. Imprimir 3 cópias do memorial.' },
  { id: 'x-casamento-jessica', title: 'Casamento da Jéssica e do Thiago', start: '2026-11-28T19:00', end: '2026-11-29T02:00', color: 'rosa', place: 'Igreja Matriz, Guaraciaba do Norte', notes: 'Festa no Clube. Vestido verde. Hoje eu sou convidada!' },
];

export default { events };
