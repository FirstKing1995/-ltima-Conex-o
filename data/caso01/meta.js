// Metadados do Caso 01.
export default {
  title: 'Última Conexão',
  subtitle: 'Caso 01 — A Pedra Lisa',
  tagline: 'Ela mandou a última mensagem para o número errado. O seu.',
  victim: { id: 'iara', name: 'Iara Fontenele', phone: '5585987412290', email: 'iara.fontenele@gmail.com', handle: 'iarafontenele.foto' },
  playerPhone: '5585988124417',
  mirrorNow: '2026-10-10T23:47',
  presentNow: '2026-10-13T23:12',
  device: { model: 'moto g85', android: '15', battery: 41, carrier: 'Claro' },
  wallpapers: { lock: 'assets/caso01/img/wallpaper_lock.jpg', home: 'assets/caso01/img/wallpaper_home.jpg' },
  lockScreen: {
    notifications: [
      { appId: 'pulso', icon: 'heart-pulse', title: 'Mi Fitness', text: '⚠️ Queda forte detectada. Você está bem?', at: '2026-10-10T23:41' },
      { appId: 'papo', icon: 'message-circle', title: 'Equipe Noite da Colheita 🌻', text: 'Igor Som: sinal caiu uns segundos, já voltou', at: '2026-10-10T23:40' },
      { appId: 'lume', icon: 'aperture', title: 'Instagram', text: 'dudaandrade.oficial publicou um story.', at: '2026-10-10T23:33' },
      { appId: 'papo', icon: 'message-circle', title: 'Léo 🏛️', text: 'e aí, como tá a festa da firma? 😅', at: '2026-10-10T23:20' },
    ],
    emergency: [
      ['Nome', 'Iara Fontenele'],
      ['Contato de emergência', 'Mãe — (88) 99430-5562'],
      ['Tipo sanguíneo', 'O+'],
      ['Alergias', 'Dipirona'],
      ['Observação', 'Se achar este celular, liga pra minha mãe 🤍'],
    ],
  },
  credits: [
    ['Criação', 'Dhione Cambraia'],
    ['Roteiro, código e direção', 'Claude (Anthropic) com Dhione Cambraia'],
    ['Ícones', 'Lucide (licença ISC)'],
    ['Mapa', 'Leaflet (BSD-2) · © OpenStreetMap · © CARTO'],
    ['Fontes', 'Roboto Flex, Fraunces, JetBrains Mono, Caveat (SIL OFL)'],
    ['Fotos', 'Geradas com Gemini, ChatGPT e Adobe Firefly; fotos de banco do Pexels (licença Pexels)'],
    ['Prints e documentos', 'Montados em código para o jogo'],
  ],
};
