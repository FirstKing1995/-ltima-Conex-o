// Clima — Guaraciaba do Norte (CE), sáb 10/10/2026, 23:47: noite limpa, frio da serra e vento forte.
// O pôr do sol de hoje foi às 18:08 (as fotos do mirante são de 18:14 e 18:19).

export default {
  city: 'Guaraciaba do Norte',
  region: 'CE',
  updated: '2026-10-10T23:30',

  now: {
    temp: 19, feels: 16, desc: 'Céu limpo · ventania na serra, rajadas fortes à noite',
    min: 17, max: 29, wind: 28, gust: 41, windDir: 'SE', humidity: 52, visibility: 10, pressure: 1013, uv: 0, rain: 0, icon: 'clear-night',
  },

  sun: { rise: '05:56', set: '18:08' },

  hourly: [
    { at: '2026-10-10T23:47', temp: 19, icon: 'clear-night', wind: 28, label: 'Agora' },
    { at: '2026-10-11T00:00', temp: 19, icon: 'clear-night', wind: 31 },
    { at: '2026-10-11T01:00', temp: 18, icon: 'clear-night', wind: 34 },
    { at: '2026-10-11T02:00', temp: 18, icon: 'clear-night', wind: 33 },
    { at: '2026-10-11T03:00', temp: 17, icon: 'clear-night', wind: 29 },
    { at: '2026-10-11T04:00', temp: 17, icon: 'clear-night', wind: 25 },
    { at: '2026-10-11T05:00', temp: 17, icon: 'clear-night', wind: 22 },
    { at: '2026-10-11T05:56', icon: 'sunrise', label: 'Nascer do sol', event: true },
    { at: '2026-10-11T06:00', temp: 18, icon: 'sun', wind: 20 },
  ],

  daily: [
    { date: '2026-10-10', min: 17, max: 29, icon: 'sun', rain: 0 },
    { date: '2026-10-11', min: 17, max: 30, icon: 'sun', rain: 0 },
    { date: '2026-10-12', min: 18, max: 31, icon: 'sun', rain: 0 },
    { date: '2026-10-13', min: 18, max: 31, icon: 'partly-day', rain: 5 },
    { date: '2026-10-14', min: 18, max: 30, icon: 'partly-day', rain: 10 },
    { date: '2026-10-15', min: 19, max: 29, icon: 'cloud', rain: 20 },
    { date: '2026-10-16', min: 19, max: 30, icon: 'partly-day', rain: 10 },
  ],

  saved: [
    { city: 'Fortaleza', region: 'CE', temp: 27, desc: 'Parcialmente nublado', icon: 'partly-night' },
    { city: 'Sobral', region: 'CE', temp: 26, desc: 'Céu limpo', icon: 'clear-night' },
  ],
};
