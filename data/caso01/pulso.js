// Pulso Band 4 — passos, sono e frequência cardíaca. Dados do aparelho, até sáb 10/10 às 23:41:31 (última sincronização).

// 01/09 a 10/10 (40 dias)
const stepsList = [
  7420, 8910, 6310, 10240, 5120, 4210, 9330, 8120, 7640, 11020,
  8830, 12340, 5410, 3980, 8240, 9100, 7320, 8560, 6710, 5230,
  9470, 8040, 7780, 9930, 6870, 7250, 4890, 6120, 8350, 7960,
  5140, 6690, 8470, 3210, 9210, 8860, 11210, 7040, 6112, 11864,
];
const sleepList = [
  7.2, 6.8, 7.5, 6.1, 8.0, 8.4, 6.9, 7.1, 7.3, 6.4,
  7.0, 5.8, 8.2, 8.6, 7.0, 6.7, 7.4, 6.2, 7.9, 8.3,
  6.6, 7.1, 6.8, 6.5, 5.6, 6.9, 8.1, 7.5, 7.2, 6.9,
  6.3, 5.2, 5.9, 7.8, 6.8, 6.5, 6.0, 5.4, 5.1, 5.9,
];

const day = (i) => {
  const d = new Date(Date.UTC(2026, 8, 1 + i));
  return d.toISOString().slice(0, 10);
};

export default {
  device: { name: 'Pulso Band 4', lastSync: '2026-10-10T23:41:31' },

  steps: stepsList.map((value, i) => ({ date: day(i), value })),

  sleep: sleepList.map((hours, i) => ({ date: day(i), hours, quality: Math.round(Math.min(95, hours * 11.6)) })),

  heart: {
    '2026-10-10': [
      ['18:00', 76], ['18:10', 82], ['18:20', 90], ['18:30', 88], ['18:40', 91], ['18:50', 84],
      ['19:00', 86], ['19:15', 92], ['19:30', 88], ['19:45', 90],
      ['20:00', 84], ['20:15', 82], ['20:30', 88], ['20:45', 91],
      ['21:00', 86], ['21:15', 83], ['21:30', 80], ['21:45', 85], ['21:50', 92], ['21:55', 96],
      ['22:00', 84], ['22:10', 82], ['22:20', 108], ['22:25', 112], ['22:30', 98], ['22:45', 88],
      ['23:00', 82], ['23:10', 79], ['23:20', 83], ['23:25', 86],
      ['23:29', 97], ['23:30', 103], ['23:31', 99], ['23:32', 98],
      ['23:33', 104], ['23:34', 109], ['23:35', 116], ['23:36', 114], ['23:37', 121],
      ['23:38', 128], ['23:39', 139], ['23:40', 148], ['23:41', 141],
    ],
  },

  events: [
    { at: '2026-10-08T20:12', kind: 'high-hr', title: 'Frequência cardíaca alta', text: '112 bpm em repouso, sem atividade registrada.' },
    { at: '2026-10-10T22:20', kind: 'high-hr', title: 'Frequência cardíaca alta', text: '108 bpm sem atividade física registrada.' },
    { at: '2026-10-10T23:39:20', kind: 'high-hr', title: 'Frequência cardíaca alta', text: '139 bpm. Sem passos registrados nos últimos 2 minutos.' },
    { at: '2026-10-10T23:41:02', kind: 'fall', title: 'Queda forte detectada', text: 'Impacto forte seguido de ausência de movimento. Sem resposta do usuário.' },
    { at: '2026-10-10T23:41:31', kind: 'disconnect', title: 'Pulso Band 4 desconectado', text: 'Conexão Bluetooth com o celular perdida. Última leitura enviada: 23:41.' },
  ],
};
