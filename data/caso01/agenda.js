// Agenda de Iara (aparelho: até sáb 23:47). Eventos de set a dez/2026 e datas que se repetem todo ano.

const events = [
  /* ---- todo ano ---- */
  { id: 'aniv-bento', title: 'Aniversário Bento 🐶', start: '2026-03-22', allDay: true, color: 'laranja', repeat: 'yearly', notes: 'O caramelo completa mais um ano. Ligar pros pais pra cantar parabéns.' },
  { id: 'aniv-duda', title: 'Aniversário Duda 🌻', start: '2026-04-05', allDay: true, color: 'amarelo', repeat: 'yearly', notes: 'Presente: caderno de campo + gift card da livraria.' },
  { id: 'aniv-mae', title: 'Aniversário da mãe 🤍', start: '2026-06-17', allDay: true, color: 'rosa', repeat: 'yearly' },
  { id: 'aniv-nanda', title: 'Aniversário Nanda', start: '2026-09-19', allDay: true, color: 'roxo', repeat: 'yearly' },
  { id: 'aniv-leo', title: 'Aniversário Léo', start: '2026-10-30', allDay: true, color: 'azul', repeat: 'yearly', notes: 'O primo vai fazer 22 e vai querer churrasco.' },
  { id: 'aniv-pai', title: 'Aniversário do pai ❤️', start: '2026-11-02', allDay: true, color: 'vermelho', repeat: 'yearly', notes: 'Chapéu novo. Foto do Bento emoldurada.' },

  /* ---- setembro ---- */
  { id: 'ensaio-clinica', title: 'Ensaio: Clínica Almeida', start: '2026-09-14T14:00', end: '2026-09-14T18:00', color: 'verde', place: 'Clínica Almeida, Aldeota, Fortaleza', notes: '6 profissionais, recepção e consultórios. Levar o 24-70 e o refletor.' },
  { id: 'entrega-clinica', title: 'Entregar fotos da clínica', start: '2026-09-20T10:00', color: 'verde' },
  { id: 'ensaio-moura', title: 'Ensaio de família: Moura', start: '2026-09-26T16:00', end: '2026-09-26T18:00', color: 'verde', place: 'Praia do Futuro, Fortaleza', notes: 'Luz de fim de tarde, crianças de 4 e 7 anos.' },
  { id: 'prazo-camila', title: 'Fotos da Camila: prazo', start: '2026-09-02', allDay: true, color: 'cinza' },
  { id: 'aluguel-set', title: 'Vencimento do aluguel', start: '2026-09-05', allDay: true, color: 'vermelho' },

  /* ---- outubro ---- */
  { id: 'aluguel-out', title: 'Vencimento do aluguel', start: '2026-10-05', allDay: true, color: 'vermelho' },
  { id: 'corujao-backup', title: 'Ligar pro corujão (espelho do celular)', start: '2026-10-03T20:00', end: '2026-10-03T20:30', color: 'ciano', notes: 'Pedir pra ele configurar o backup cifrado. Perguntar o que eu preciso fazer.' },
  { id: 'alinhamento-evento', title: 'Alinhamento do evento (Lari)', start: '2026-10-08T14:00', end: '2026-10-08T14:40', color: 'azul', notes: 'Videochamada. Revisar roteiro v4 e posição de câmera.' },
  { id: 'viagem-0910', title: 'Viagem Fortaleza → Guaraciaba do Norte', start: '2026-10-09T07:30', end: '2026-10-09T17:10', color: 'azul', place: 'Rodoviária Eng. João Thomé → Sobral → Guaraciaba', notes: 'Ônibus 07:30 (poltrona 14). Van em Sobral às 15:30. Chego em casa dos pais pro jantar.' },
  { id: 'timelapse-mirante', title: 'Timelapse do pôr do sol', start: '2026-10-10T17:55', end: '2026-10-10T18:35', color: 'amarelo', place: 'Mirante da Pedra Lisa', notes: 'Intervalo de 3 s. Abertura f/11. Levar tripé e lanterna.' },
  { id: 'noite-colheita', title: 'Noite da Colheita: Sítio Flor da Serra', start: '2026-10-10T19:00', end: '2026-10-11T02:00', color: 'laranja', place: 'Sítio Flor da Serra, Guaraciaba do Norte', notes: 'Cobertura foto e vídeo. Credencial no pescoço. Discurso do Caio às 23:30 (live no Lume).' },
  { id: 'volta-fortaleza', title: 'Volta pra Fortaleza', start: '2026-10-11T18:00', color: 'azul', place: 'Guaraciaba do Norte → Fortaleza', notes: 'Van até Sobral, ônibus da noite. Chegar com tempo de dormir.' },
  { id: 'reuniao-farol', title: 'Reunião O Farol: Bruna', start: '2026-10-12T10:00', end: '2026-10-12T12:00', color: 'vermelho', place: 'O Farol, Av. Santos Dumont, 4º andar, Fortaleza', notes: 'Levar o celular com a Pasta Segura, o contrato padrão impresso e um documento com foto. Perguntar na recepção pela Bruna.' },
  { id: 'dentista', title: 'Dentista', start: '2026-10-15T14:30', end: '2026-10-15T15:30', color: 'ciano', place: 'Clínica Sorriso Benfica', notes: 'Sinal já pago. Levar o encaminhamento.' },
  { id: 'edicao-evento', title: 'Editar material da Noite da Colheita', start: '2026-10-14T09:00', end: '2026-10-14T18:00', color: 'amarelo' },

  /* ---- novembro e dezembro ---- */
  { id: 'aluguel-nov', title: 'Vencimento do aluguel', start: '2026-11-05', allDay: true, color: 'vermelho' },
  { id: 'casamento-livia', title: 'Casamento Lívia e João', start: '2026-12-12T16:00', end: '2026-12-12T23:30', color: 'rosa', place: 'Cascavel (CE)', notes: 'Pacote B: cerimônia + festa. Assistente confirmada? Flash reserva.' },
];

export default { events };
