// Ícones de app (SVG, viewBox 64x64, fundo cheio) no estilo das marcas reais. Para voltar às fictícias, ver tools/marcas.mjs e o histórico do git.
// appIconSVG(id) → string SVG;  appIconEl(id, size) → elemento <span class="ai"> com o SVG.

const G = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const R = (id, stops, cx = .3, cy = .2, r = 1.1) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const BG = (fill) => `<rect width="64" height="64" fill="${fill}"/>`;

const DEFS = {
  // Telefone (Google): fone azul sobre fundo claro
  telefone: () => `${BG('#eaf1fb')}
    <path fill="#1a73e8" d="M22.6 15.5c1.2-.6 2.7-.2 3.4.9l3.5 5.5c.6 1 .5 2.4-.3 3.3l-2.4 2.5c1.7 3.7 4.5 6.6 8.1 8.3l2.5-2.4c.9-.8 2.3-1 3.3-.3l5.5 3.5c1.2.7 1.6 2.3.9 3.5l-1.8 3.1c-1 1.9-3.1 2.9-5.2 2.5C28.5 44 18 33.5 16.2 21.8c-.3-2.1.7-4.2 2.6-5.2z"/>`,
  // Mensagens (Google): balão azul
  sms: () => `${BG('#eaf1fb')}
    <path fill="#1a73e8" d="M16 20a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H28l-9 7v-7.5A6 6 0 0 1 16 34z"/>
    <rect x="23" y="22" width="18" height="3.4" rx="1.7" fill="#fff"/><rect x="23" y="29" width="12" height="3.4" rx="1.7" fill="#fff"/>`,
  // WhatsApp
  papo: () => `${BG('#25d366')}
    <path fill="none" stroke="#fff" stroke-width="3.6" d="M32 13.5c-10.2 0-18.5 8.1-18.5 18.2 0 3.5 1 6.8 2.8 9.6L14 50l9.1-2.6c2.7 1.5 5.7 2.3 8.9 2.3 10.2 0 18.5-8.1 18.5-18.1S42.2 13.5 32 13.5z"/>
    <path fill="#fff" d="M25.4 22.7c.5-.1 1.1 0 1.4.6l1.7 4c.2.5.1 1-.2 1.4l-1.2 1.5c1.2 2.4 3.2 4.3 5.6 5.5l1.5-1.2c.4-.3 1-.4 1.4-.2l4 1.7c.6.3.8.9.6 1.5-.6 2-2.4 3.4-4.6 3.1-6.3-.9-11.6-6.2-12.4-12.5-.3-2.2 1.1-4.3 2.2-5.4z"/>`,
  // Câmera
  camera: () => `${BG('#e8eaed')}
    <rect x="12" y="20" width="40" height="28" rx="7" fill="#5f6368"/><path d="M24 20l2.8-4.4c.4-.6 1-.9 1.7-.9h7c.7 0 1.3.3 1.7.9L40 20z" fill="#5f6368"/>
    <circle cx="32" cy="34" r="9.5" fill="#fff"/><circle cx="32" cy="34" r="6.2" fill="#1a73e8"/><circle cx="44.5" cy="25.5" r="1.8" fill="#fbbc04"/>`,
  // Google Fotos: cata-vento de quatro cores
  galeria: () => `${BG('#ffffff')}
    <path fill="#ea4335" d="M32 32V14a9 9 0 0 1 9 9v9z"/><path fill="#fbbc04" d="M32 32H50a9 9 0 0 1-9 9h-9z"/>
    <path fill="#34a853" d="M32 32v18a9 9 0 0 1-9-9v-9z"/><path fill="#4285f4" d="M32 32H14a9 9 0 0 1 9-9h9z"/>`,
  // Google Maps: alfinete colorido
  rotas: () => `${BG('#ffffff')}
    <path fill="#34a853" d="M20 20.5 12 30v20l14-16z"/><path fill="#fbbc04" d="M12 50h40L32 30z" opacity=".95"/><path fill="#4285f4" d="M44 20.5 52 30v20L38 34z"/>
    <path fill="#ea4335" d="M32 10c-7.7 0-14 6.1-14 13.7C18 34 32 48 32 48s14-14 14-24.3C46 16.1 39.7 10 32 10z"/>
    <path fill="#c5221f" d="M32 10c7.7 0 14 6.1 14 13.7 0 3.1-1.3 6.5-3.1 9.7L32 23.7z" opacity=".45"/><circle cx="32" cy="23.7" r="5.4" fill="#7c1c16"/>`,
  // Instagram
  lume: () => `<defs>${R('g', [[0, '#fdf497'], [.05, '#fdf497'], [.45, '#fd5949'], [.6, '#d6249f'], [.9, '#285aeb']], .3, 1.07, 1.35)}</defs>${BG('url(#g)')}
    <rect x="15" y="15" width="34" height="34" rx="10" fill="none" stroke="#fff" stroke-width="3.8"/>
    <circle cx="32" cy="32" r="8.3" fill="none" stroke="#fff" stroke-width="3.8"/><circle cx="42.6" cy="21.4" r="2.4" fill="#fff"/>`,
  // Gmail
  correio: () => `${BG('#ffffff')}
    <path fill="#4285f4" d="M13 22.5v21a3 3 0 0 0 3 3h6V29z"/><path fill="#34a853" d="M42 46.5h6a3 3 0 0 0 3-3v-21L42 29z"/>
    <path fill="#fbbc04" d="M42 18v11l9-6.5V20c0-3.3-3.8-5.2-6.4-3.2z"/><path fill="#ea4335" d="M22 29V18l10 7.5L42 18v11l-10 7.5z"/>
    <path fill="#c5221f" d="M13 20v2.5l9 6.5V18l-2.6-1.2C16.8 14.8 13 16.7 13 20z"/>`,
  // Chrome
  navegador: () => `${BG('#ffffff')}
    <path fill="#ea4335" d="M32 12a20 20 0 0 1 17.3 10H32a10 10 0 0 0-8.7 5l-8.6-15A20 20 0 0 1 32 12z" transform="translate(0 0)"/>
    <path fill="#ea4335" d="M14.7 22A20 20 0 0 1 32 12h0a20 20 0 0 1 17.3 10H32a10 10 0 0 0-8.7 5z"/>
    <path fill="#fbbc04" d="M49.3 22A20 20 0 0 1 32 52l8.7-15a10 10 0 0 0 0-10z"/>
    <path fill="#34a853" d="M32 52a20 20 0 0 1-17.3-30l8.6 15a10 10 0 0 0 8.7 5h8.7z"/>
    <circle cx="32" cy="32" r="9.4" fill="#fff"/><circle cx="32" cy="32" r="7.4" fill="#1a73e8"/>`,
  // Nubank
  jandaia: () => `${BG('#820ad1')}
    <text x="32" y="40.5" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="700" font-size="25" fill="#fff" letter-spacing="-1">nu</text>`,
  // Keep Notas
  notas: () => `${BG('#fbbc04')}
    <path d="M32 15a11 11 0 0 0-6.6 19.8c1 .8 1.6 2 1.6 3.3V40h10v-1.9c0-1.3.6-2.5 1.6-3.3A11 11 0 0 0 32 15z" fill="#fff"/>
    <rect x="27" y="42.5" width="10" height="4.5" rx="1.5" fill="#fff"/>`,
  // Google Agenda
  agenda: () => `${BG('#ffffff')}
    <rect x="13" y="13" width="38" height="38" rx="5" fill="#fff" stroke="#dadce0" stroke-width="1.2"/>
    <path fill="#1a73e8" d="M13 18a5 5 0 0 1 5-5h28a5 5 0 0 1 5 5v4H13z"/><path fill="#ea4335" d="M42 51l9-9h-9z"/><path fill="#188038" d="M13 42v4a5 5 0 0 0 5 5h4v-9z"/>
    <text x="32" y="44" text-anchor="middle" font-family="Roboto, Arial, sans-serif" font-weight="700" font-size="18" fill="#1a73e8">10</text>`,
  // Gravador
  gravador: () => `${BG('#e8453c')}
    <g stroke="#fff" stroke-width="3.6" stroke-linecap="round"><path d="M18 29v6M25 22v20M32 16v32M39 24v16M46 28v8"/></g>`,
  // Mi Fitness (relógio Xiaomi)
  pulso: () => `${BG('#ff6900')}
    <path d="M14 33h9l4-9 6 17 5-12 3 4h9" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  // Uber
  bora: () => `${BG('#000000')}
    <text x="32" y="38.5" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-weight="500" font-size="17" fill="#fff" letter-spacing="-.3">Uber</text>`,
  // Files by Google
  arquivos: () => `${BG('#ffffff')}
    <path fill="#1a73e8" d="M13 21a4 4 0 0 1 4-4h9.5l4 4.5H47a4 4 0 0 1 4 4V45a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z"/>
    <path fill="#8ab4f8" d="M13 27h38v18a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z"/>`,
  // Relógio
  relogio: () => `${BG('#e8f0fe')}
    <circle cx="32" cy="32" r="18" fill="#1a73e8"/><circle cx="32" cy="32" r="15" fill="#fff"/>
    <path d="M32 22v10l7 5" fill="none" stroke="#1a73e8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  // Clima
  clima: () => `<defs>${G('g', [[0, '#4fa3f7'], [1, '#1a6fd8']])}</defs>${BG('url(#g)')}
    <circle cx="26" cy="26" r="8" fill="#fdd663"/><path d="M24 46a8 8 0 0 1 .8-16 10 10 0 0 1 19.2 3.5A6.3 6.3 0 0 1 43.5 46z" fill="#fff"/>`,
  // Configurações
  configuracoes: () => `${BG('#5f6368')}
    <path fill="#fff" d="M35.2 13.5l.9 4.6a14.6 14.6 0 0 1 3.6 2.1l4.4-1.5 3.2 5.6-3.5 3.1a14.7 14.7 0 0 1 0 4.2l3.5 3.1-3.2 5.6-4.4-1.5a14.6 14.6 0 0 1-3.6 2.1l-.9 4.6h-6.4l-.9-4.6a14.6 14.6 0 0 1-3.6-2.1l-4.4 1.5-3.2-5.6 3.5-3.1a14.7 14.7 0 0 1 0-4.2l-3.5-3.1 3.2-5.6 4.4 1.5a14.6 14.6 0 0 1 3.6-2.1l.9-4.6z"/>
    <circle cx="32" cy="32" r="5.6" fill="#5f6368"/>`,
};

let uid = 0;
/** SVG do ícone (ids de gradiente únicos por instância). */
export function appIconSVG(id) {
  const f = DEFS[id];
  if (!f) return '';
  const n = ++uid;
  const body = f().replace(/id="(\w+)"/g, `id="$1${n}"`).replace(/url\(#(\w+)\)/g, `url(#$1${n})`);
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
}

export function hasAppIcon(id) { return !!DEFS[id]; }

export function appIconEl(id, size = 56, className = '') {
  const s = document.createElement('span');
  s.className = `ai ${className}`.trim();
  s.style.width = s.style.height = `${size}px`;
  s.innerHTML = appIconSVG(id);
  return s;
}
