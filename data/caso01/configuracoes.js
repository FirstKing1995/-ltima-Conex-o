// Configurações do Nimbus N9 de Iara (espelho congelado em 10/10 23:47).
// Históricos de notificações e de desbloqueio só abrem no capítulo 4 (historyReq / unlockLogReq).

const dig = (day, hours) => hours.map((h) => ({ at: `2026-10-${day}T${h}`, method: 'Digital' }));

const SEMANA = [
  ...dig('04', ['08:12', '09:40', '11:03', '13:25', '14:50', '16:31', '18:05', '19:48', '21:10', '22:37', '23:19']),
  ...dig('05', ['07:58', '09:15', '10:02', '12:30', '14:11', '15:45', '17:20', '19:06', '20:33', '22:14', '23:40']),
  ...dig('06', ['08:03', '09:31', '11:48', '13:02', '15:20', '16:44', '18:30', '20:05', '21:52', '23:08']),
  ...dig('07', ['07:45', '08:50', '10:17', '12:41', '14:02', '15:58', '17:36', '19:21', '21:03', '22:49']),
  ...dig('08', ['08:20', '09:55', '11:30', '13:14', '14:40', '16:05', '17:52', '19:37', '21:25', '22:58']),
  ...dig('09', ['06:42', '07:10', '08:55', '11:16', '13:20', '15:03', '16:48', '17:21', '18:40', '20:12', '21:44', '23:02']),
  ...dig('10', ['07:48', '09:03', '10:41', '12:20', '14:35', '15:48', '16:19', '17:56', '18:14', '18:19', '18:52', '19:30', '20:12', '21:02', '21:55', '22:14', '22:58', '23:05', '23:24']),
];

export default {
  wifi: {
    saved: [
      { ssid: 'FlorDaSerra_Eventos', lastConnected: '2026-10-10T23:30', security: 'WPA2' },
      { ssid: 'Fontenele_5G', lastConnected: '2026-10-10T15:50', security: 'WPA2' },
      { ssid: 'Apto302_Benfica', lastConnected: '2026-10-09T06:47', security: 'WPA2' },
      { ssid: 'CafeMargarida_Clientes', lastConnected: '2026-10-09T13:10', security: 'Aberta' },
      { ssid: 'ColheitaCapital_Corp', lastConnected: '2026-10-02T18:05', security: 'WPA2 Enterprise' },
      { ssid: 'Rodoviaria_Gratis', lastConnected: '2026-10-09T07:35', security: 'Aberta' },
    ],
    log: [
      { at: '2026-10-09T06:47', ssid: 'Apto302_Benfica', event: 'desconectado' },
      { at: '2026-10-09T07:35', ssid: 'Rodoviaria_Gratis', event: 'conectado' },
      { at: '2026-10-09T08:10', ssid: 'Rodoviaria_Gratis', event: 'desconectado' },
      { at: '2026-10-09T13:10', ssid: 'CafeMargarida_Clientes', event: 'conectado' },
      { at: '2026-10-09T14:25', ssid: 'CafeMargarida_Clientes', event: 'desconectado' },
      { at: '2026-10-09T17:25', ssid: 'Fontenele_5G', event: 'conectado' },
      { at: '2026-10-10T15:50', ssid: 'Fontenele_5G', event: 'desconectado' },
      { at: '2026-10-10T18:40', ssid: 'FlorDaSerra_Eventos', event: 'conectado' },
      { at: '2026-10-10T23:30', ssid: 'FlorDaSerra_Eventos', event: 'desconectado' },
    ],
  },

  bluetooth: {
    devices: [
      { name: 'Pulso Band 4', kind: 'relógio', lastConnected: '2026-10-10T23:41:31', connected: false },
      { name: 'Caixa JBL (casa)', kind: 'caixa de som', lastConnected: '2026-10-08T22:40', connected: false },
      { name: 'Nimbus Buds', kind: 'fone', lastConnected: '2026-10-09T07:35', connected: false },
    ],
    log: [
      { at: '2026-10-08T21:10', device: 'Caixa JBL (casa)', event: 'conectado' },
      { at: '2026-10-08T22:40', device: 'Caixa JBL (casa)', event: 'desconectado' },
      { at: '2026-10-09T06:40', device: 'Nimbus Buds', event: 'conectado' },
      { at: '2026-10-09T07:35', device: 'Nimbus Buds', event: 'desconectado' },
      { at: '2026-10-10T08:57', device: 'Pulso Band 4', event: 'conectado' },
      { at: '2026-10-10T23:41:31', device: 'Pulso Band 4', event: 'desconectado' },
    ],
  },

  security: {
    unlockLogReq: 'cap4',
    unlockLog: [
      ...SEMANA,
      { at: '2026-10-10T23:42:07', method: 'Digital não reconhecida', note: 'Tentativa falhou: a digital não confere com a cadastrada' },
      { at: '2026-10-10T23:42:31', method: 'Digital não reconhecida', note: 'Segunda tentativa falhou, outro dedo' },
      { at: '2026-10-10T23:43:12', method: 'PIN', note: 'Desbloqueado com o PIN, um minuto depois de duas digitais recusadas' },
    ],
  },

  notifications: {
    historyEnabled: true,
    historyReq: 'cap4',
    history: [
      { at: '2026-10-10T07:30', app: 'Clima', title: 'Guaraciaba do Norte', text: 'Manhã fresca, 19°. Chance de chuva à noite: 20%.' },
      { at: '2026-10-10T08:57', app: 'Pulso', title: 'Pulso Band 4', text: 'Meta de passos de ontem batida: 9.402 passos.' },
      { at: '2026-10-10T09:08', app: 'Papo', title: 'Mãe 🤍', text: 'filha, já tomou café? o Bento tá aqui te esperando' },
      { at: '2026-10-10T10:12', app: 'Jandaia', title: 'Jandaia', text: 'Pix recebido: R$ 120,00 de LARISSA PRADO.' },
      { at: '2026-10-10T11:40', app: 'Lume', title: 'Lume', text: 'nanda.lopes e mais 12 pessoas curtiram sua foto.' },
      { at: '2026-10-10T13:02', app: 'Papo', title: 'Nanda', text: 'amiga, me manda a foto do pôr do sol depois!! quero ver' },
      { at: '2026-10-10T14:02', app: 'Correio', title: 'Bruna Leal', text: 'Confirmado segunda. Qualquer coisa me chama no zap.' },
      { at: '2026-10-10T15:49', app: 'Rotas', title: 'Rotas', text: 'Viagem em andamento: Guaraciaba do Norte até Sítio Flor da Serra, 30 min.' },
      { at: '2026-10-10T17:40', app: 'Agenda', title: 'Noite da Colheita', text: 'Começa às 19:00 · Sítio Flor da Serra' },
      { at: '2026-10-10T18:22', app: 'Lume', title: 'Lume', text: 'leo.fontenele marcou você em uma foto.' },
      { at: '2026-10-10T19:10', app: 'Papo', title: 'Mãe 🤍', text: 'ai que bonito esse pôr do sol, me manda mais' },
      { at: '2026-10-10T19:42', app: 'Papo', title: 'Equipe Noite da Colheita', text: 'Lari Produção: gente, jantar liberado no salão dos fundos' },
      { at: '2026-10-10T20:40', app: 'Mensagens', title: '+55 88 99201-4456', text: 'linda essa blusa verde' },
      { at: '2026-10-10T21:15', app: 'Papo', title: 'Caio Montenegro', text: 'Depois do discurso, precisamos conversar. Sem drama.' },
      { at: '2026-10-10T21:47', app: 'Papo', title: '+55 88 99645-1209', text: 'Iara, eu sei o que tu achou. Me deixa explicar antes de tu fazer besteira', deleted: true, note: 'Mensagem apagada para todos às 23:45' },
      { at: '2026-10-10T21:50', app: 'Papo', title: '+55 88 99645-1209', text: 'Não faz isso com o meu pai nem com o teu. Por favor', deleted: true, note: 'Mensagem apagada para todos às 23:45' },
      { at: '2026-10-10T21:52', app: 'Papo', title: '+55 88 99645-1209', text: 'No mirante às 23h30, na hora do discurso. Só nós duas. Por favor 🙏', deleted: true, note: 'Mensagem apagada para todos às 23:45' },
      { at: '2026-10-10T22:16', app: 'Papo', title: 'Théo 🦉', text: 'ok. fica de olho. qualquer coisa me chama' },
      { at: '2026-10-10T22:24', app: 'Papo', title: 'Equipe Noite da Colheita', text: 'Lari Produção: gente, o vocalista e a Iara discutindo atrás do palco, alguém vê isso?' },
      { at: '2026-10-10T22:31', app: 'Mensagens', title: '+55 88 99201-7756', text: 'tu ainda vai se arrepender' },
      { at: '2026-10-10T22:51', app: 'Papo', title: 'Equipe Noite da Colheita', text: 'Duda 🌻: vídeo (0:24)' },
      { at: '2026-10-10T23:05', app: 'Pulso', title: 'Pulso Band 4', text: 'Frequência cardíaca elevada: 112 bpm em repouso.' },
      { at: '2026-10-10T23:20', app: 'Papo', title: 'Léo 🏛️', text: 'e aí, como tá a festa da firma? 😅' },
      { at: '2026-10-10T23:26', app: 'Papo', title: 'Equipe Noite da Colheita', text: 'Lari Produção: banda parou, Caio subindo' },
      { at: '2026-10-10T23:30', app: 'Lume', title: 'colheitacapital', text: 'está ao vivo agora: Noite da Colheita.' },
      { at: '2026-10-10T23:33', app: 'Lume', title: 'Lume', text: 'dudaandrade.oficial publicou um story.' },
      { at: '2026-10-10T23:34', app: 'Lume', title: 'Lume', text: 'larissa.prado publicou um story.' },
      { at: '2026-10-10T23:40', app: 'Papo', title: 'Lari Produção', text: 'a banda atacando o churrasco no camarim 😂🍖' },
      { at: '2026-10-10T23:41', app: 'Pulso', title: 'Pulso Band 4', text: 'Queda forte detectada. Você está bem?' },
    ],
  },

  battery: {
    level: 41,
    log: [
      { at: '2026-09-18T03:10', level: 77, event: 'Reinício do sistema' },
      { at: '2026-10-02T23:58', level: 1, event: 'Desligado: bateria esgotada' },
      { at: '2026-10-03T07:20', level: 3, event: 'Conectado ao carregador' },
      { at: '2026-10-10T07:30', level: 64, event: 'Conectado ao carregador' },
      { at: '2026-10-10T08:55', level: 100, event: 'Carga completa' },
      { at: '2026-10-10T15:50', level: 100, event: 'Desconectado do carregador' },
      { at: '2026-10-10T18:14', level: 82, event: 'Uso intenso da câmera' },
      { at: '2026-10-10T19:30', level: 71, event: 'Descarregando' },
      { at: '2026-10-10T20:30', level: 63, event: 'Descarregando' },
      { at: '2026-10-10T21:30', level: 55, event: 'Descarregando' },
      { at: '2026-10-10T22:30', level: 49, event: 'Descarregando' },
      { at: '2026-10-10T23:10', level: 45, event: 'Descarregando' },
      { at: '2026-10-10T23:29', level: 44, event: 'Descarregando' },
      { at: '2026-10-10T23:41', level: 43, event: 'Descarregando' },
      { at: '2026-10-10T23:47:02', level: 41, event: 'Desligado pelo botão de energia (23:47:02)' },
    ],
  },

  accounts: [
    { service: 'Conta Nimbus', email: 'iara.fontenele@correio.app' },
    { service: 'Correio', email: 'iara.fontenele@correio.app' },
    { service: 'Papo', email: '(85) 98741-2290' },
    { service: 'Lume', email: '@iarafontenele.foto' },
    { service: 'Jandaia', email: 'Iara Fontenele · ag. 0412' },
  ],

  devices: [
    { name: 'Nimbus N9 de Iara', place: 'Guaraciaba do Norte, CE', lastActive: '2026-10-10T23:47', current: false, note: 'Este aparelho' },
    { name: 'Notebook · Windows 11', place: 'Fortaleza, CE', lastActive: '2026-10-09T06:30', current: false, note: 'Edição de fotos e vídeos' },
    { name: 'Notebook · Windows 10 (ademar.sa)', place: 'Guaraciaba do Norte, CE', lastActive: '2026-10-12T03:17', current: false, note: 'Primeiro acesso: 12/10/2026 03:09. Nimbus Nuvem: 1 documento modificado.' },
    { name: 'Espelho — backup cifrado', place: 'Fortaleza, CE', lastActive: '2026-10-13T23:10', current: true, note: 'Backup cifrado configurado em 03/10/2026. Sincronização contínua, somente leitura.' },
  ],

  apps: [
    { name: 'Papo', size: '412 MB', lastUsed: '2026-10-10T23:46' },
    { name: 'Gravador', size: '38 MB', lastUsed: '2026-10-10T23:44' },
    { name: 'Pulso', size: '96 MB', lastUsed: '2026-10-10T23:41' },
    { name: 'Lume', size: '688 MB', lastUsed: '2026-10-10T23:03' },
    { name: 'Rotas', size: '241 MB', lastUsed: '2026-10-10T15:49' },
    { name: 'Câmera', size: '74 MB', lastUsed: '2026-10-10T22:08' },
    { name: 'Galeria', size: '129 MB', lastUsed: '2026-10-10T19:12' },
    { name: 'Telefone', size: '52 MB', lastUsed: '2026-10-10T16:33' },
    { name: 'Correio', size: '186 MB', lastUsed: '2026-10-10T14:02' },
    { name: 'Agenda', size: '44 MB', lastUsed: '2026-10-10T17:40' },
    { name: 'Jandaia', size: '118 MB', lastUsed: '2026-10-10T10:12' },
    { name: 'Mensagens', size: '31 MB', lastUsed: '2026-10-10T22:31' },
    { name: 'Notas', size: '22 MB', lastUsed: '2026-10-08T21:15' },
    { name: 'Arquivos', size: '61 MB', lastUsed: '2026-10-09T17:00' },
    { name: 'Navegador', size: '305 MB', lastUsed: '2026-10-09T12:51' },
    { name: 'Clima', size: '29 MB', lastUsed: '2026-10-10T07:30' },
    { name: 'Relógio', size: '19 MB', lastUsed: '2026-10-10T04:40' },
    { name: 'Bora', size: '84 MB', lastUsed: '2026-10-09T06:48' },
    { name: 'Configurações', size: '16 MB', lastUsed: '2026-10-03T22:30' },
  ],

  about: [
    ['Nome do dispositivo', 'Nimbus N9 de Iara'],
    ['Modelo', 'Nimbus N9'],
    ['Versão do Android', '16'],
    ['Nível do patch de segurança', '1º de setembro de 2026'],
    ['Número de telefone', '(85) 98741-2290'],
    ['Operadora', 'Litoral Móvel'],
    ['Armazenamento', '128 GB · 91 GB em uso'],
    ['Última vez desligado', 'sáb, 10 de out. de 2026 às 23:47'],
  ],
};
