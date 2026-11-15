// Relógio de Iara: alarmes do aparelho, relógios mundiais e timers salvos.

export default {
  alarms: [
    { id: 'al-acordar', time: '06:30', days: ['seg', 'ter', 'qua', 'qui', 'sex'], label: 'Acordar', on: true },
    { id: 'al-onibus', time: '05:40', days: ['sex'], label: 'ônibus Sobral', on: true },
    { id: 'al-timelapse', time: '17:40', days: ['sab'], label: 'timelapse pôr do sol', on: true },
    { id: 'al-cartoes', time: '21:00', days: ['dom'], label: 'descarregar cartões de memória', on: true },
    { id: 'al-agua', time: '10:00', days: [], label: 'beber água', on: false },
    { id: 'al-dormir', time: '23:30', days: ['dom', 'seg', 'ter', 'qua', 'qui'], label: 'dormir (de verdade)', on: false },
  ],
  worldClocks: [
    { city: 'Lisboa', sub: 'Portugal', off: 60 },
    { city: 'Nova York', sub: 'Estados Unidos', off: -240 },
    { city: 'Tóquio', sub: 'Japão', off: 540 },
    { city: 'Londres', sub: 'Reino Unido', off: 60 },
  ],
  timers: [
    { id: 'tm-pose', label: 'pose longa', seconds: 30 },
    { id: 'tm-cafe', label: 'café', seconds: 240 },
    { id: 'tm-bolo', label: 'bolo da mãe', seconds: 2400 },
  ],
};
