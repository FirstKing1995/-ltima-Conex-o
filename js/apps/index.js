// Registro dos apps do celular de Iara.
// bg: fundo do ícone; fg: cor do desenho; dock: fica na barra de baixo; dataKey: chave em CASE (padrão = id)
export const APPS = [
  { id: 'telefone', title: 'Telefone', icon: 'phone', bg: '#34c27a', dock: true },
  { id: 'sms', title: 'Mensagens', icon: 'message-square', bg: '#5b8def', dock: true },
  { id: 'papo', title: 'WhatsApp', icon: 'message-circle', bg: '#1fa37a', dock: true },
  { id: 'camera', title: 'Câmera', icon: 'camera', bg: '#4b5563', dock: true, dataKey: 'galeria' },
  { id: 'galeria', title: 'Fotos', icon: 'images', bg: '#8b6cf0' },
  { id: 'rotas', title: 'Maps', icon: 'map-pin', bg: '#3b82f6' },
  { id: 'lume', title: 'Instagram', icon: 'aperture', bg: 'linear-gradient(135deg,#f0567a,#ff9f43)' },
  { id: 'correio', title: 'Gmail', icon: 'mail', bg: '#e25b45' },
  { id: 'navegador', title: 'Chrome', icon: 'globe', bg: '#4f9cf9' },
  { id: 'jandaia', title: 'Nubank', icon: 'landmark', bg: '#1f9d6b', fg: '#f7d154' },
  { id: 'notas', title: 'Keep Notas', icon: 'sticky-note', bg: '#e9b949', fg: '#3b2a05' },
  { id: 'agenda', title: 'Agenda', icon: 'calendar-days', bg: '#4c7ef3' },
  { id: 'gravador', title: 'Gravador', icon: 'mic', bg: '#f05d3a' },
  { id: 'pulso', title: 'Mi Fitness', icon: 'heart-pulse', bg: '#ef4f6c' },
  { id: 'bora', title: 'Uber', icon: 'car', bg: '#141414', fg: '#ffd400' },
  { id: 'arquivos', title: 'Files', icon: 'folder', bg: '#e0a526', fg: '#3b2a05' },
  { id: 'relogio', title: 'Relógio', icon: 'alarm-clock', bg: '#5b6b82' },
  { id: 'clima', title: 'Clima', icon: 'cloud-sun', bg: '#38a6db' },
  { id: 'configuracoes', title: 'Configurações', icon: 'settings', bg: '#5f6672' },
];

export const appInfo = (id) => APPS.find(a => a.id === id) || null;

const cache = new Map();
export async function loadApp(id) {
  if (cache.has(id)) return cache.get(id);
  const mod = await import(`./${id}.js`);
  const app = mod.default || mod;
  cache.set(id, app);
  return app;
}
