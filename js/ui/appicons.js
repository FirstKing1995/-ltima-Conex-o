// Ícones de app desenhados à mão (SVG, viewBox 64x64, fundo cheio). Marcas fictícias do jogo.
// appIconSVG(id) → string SVG;  appIconEl(id, size) → elemento <span class="ai"> com o SVG.

const G = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const R = (id, stops, cx = .3, cy = .2, r = 1.1) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const BG = (fill) => `<rect width="64" height="64" fill="${fill}"/>`;

const DEFS = {
  telefone: () => `<defs>${G('g', [[0, '#4be39a'], [1, '#17a35d']])}</defs>${BG('url(#g)')}
    <path fill="#fff" d="M24.3 16.5c1.2-.6 2.6-.2 3.3.9l3.4 5.4c.6 1 .5 2.3-.3 3.2l-2.3 2.4c1.6 3.6 4.3 6.4 7.8 8.1l2.4-2.3c.9-.8 2.2-1 3.2-.3l5.3 3.4c1.2.7 1.6 2.2.9 3.4l-1.7 3c-1 1.8-3 2.8-5 2.4C29.9 44.6 19.4 34.1 17.7 22.7c-.3-2 .7-4 2.5-5z"/>`,
  sms: () => `<defs>${G('g', [[0, '#7aa6ff'], [1, '#3563d6']])}</defs>${BG('url(#g)')}
    <path fill="#fff" d="M17 21.5c0-3 2.4-5.5 5.5-5.5h19c3 0 5.5 2.5 5.5 5.5v13c0 3-2.5 5.5-5.5 5.5H29l-7.6 6.3c-.7.6-1.7.1-1.7-.8V40c-1.6-.8-2.7-2.5-2.7-4.4z"/>
    <circle cx="25" cy="28" r="2.4" fill="#3d6ee0"/><circle cx="32" cy="28" r="2.4" fill="#3d6ee0"/><circle cx="39" cy="28" r="2.4" fill="#3d6ee0"/>`,
  papo: () => `<defs>${G('g', [[0, '#2fd39a'], [1, '#0f8a64']])}</defs>${BG('url(#g)')}
    <path fill="#fff" d="M32 14c-10.2 0-18 7.3-18 16.6 0 3.6 1.2 6.9 3.3 9.6l-2 7.2c-.2.8.6 1.5 1.3 1.1l7.3-3.4c2.4 1.1 5.2 1.8 8.1 1.8 10.2 0 18-7.3 18-16.3S42.2 14 32 14z"/>
    <path fill="none" stroke="#14a274" stroke-width="3.4" stroke-linecap="round" d="M24 28.5c2.6-2.6 5.4-2.6 8 0s5.4 2.6 8 0M24 35c2.6-2.6 5.4-2.6 8 0s5.4 2.6 8 0"/>`,
  camera: () => `<defs>${G('g', [[0, '#5d636d'], [1, '#2c3036']])}${R('l', [[0, '#6aa7ff'], [.45, '#1b2a44'], [1, '#05070a']], .4, .35, .7)}</defs>${BG('url(#g)')}
    <rect x="14" y="21" width="36" height="25" rx="6" fill="#f2f3f5"/><path d="M25 21l2.6-4.2c.4-.6 1-.8 1.6-.8h5.6c.6 0 1.2.3 1.6.8L39 21z" fill="#f2f3f5"/>
    <circle cx="32" cy="33.5" r="9" fill="#2b2f36"/><circle cx="32" cy="33.5" r="6.4" fill="url(#l)"/><circle cx="29.8" cy="31.3" r="1.6" fill="#fff" opacity=".8"/><circle cx="44.5" cy="26" r="1.6" fill="#f5b14c"/>`,
  galeria: () => `<defs>${G('g', [[0, '#b69cff'], [1, '#6b49e6']])}${G('m', [[0, '#ffd28a'], [1, '#ff8a65']])}</defs>${BG('url(#g)')}
    <rect x="15" y="17" width="34" height="30" rx="6" fill="#fff"/><rect x="18" y="20" width="28" height="24" rx="3.5" fill="url(#m)"/>
    <circle cx="38.5" cy="27" r="3.4" fill="#fff6d8"/><path d="M18 40l8.5-9.5c.8-.9 2.2-.9 3 0L35 37l3-3c.8-.8 2-.8 2.8 0l5.2 5.5V41a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3z" fill="#5a3fd6"/>`,
  rotas: () => `<defs>${G('g', [[0, '#f4f7fb'], [1, '#dfe7f1']])}${G('p', [[0, '#ff5d5d'], [1, '#d92f3c']])}</defs>${BG('url(#g)')}
    <path d="M-2 44 L24 30 L40 40 L66 22" stroke="#8fd19e" stroke-width="9" fill="none"/><path d="M-2 44 L24 30 L40 40 L66 22" stroke="#fff" stroke-width="3" fill="none"/>
    <path d="M10 -2 L22 66" stroke="#ffd36b" stroke-width="5"/><path d="M-2 14 L66 10" stroke="#c7d3e3" stroke-width="3"/>
    <path fill="url(#p)" d="M40 12c-6.1 0-11 4.8-11 10.8 0 7.7 9.2 16.2 10.1 17 .5.4 1.3.4 1.8 0 .9-.8 10.1-9.3 10.1-17C51 16.8 46.1 12 40 12z"/><circle cx="40" cy="22.8" r="4.1" fill="#fff"/>`,
  lume: () => `<defs>${G('g', [[0, '#ffb547'], [.5, '#f2456b'], [1, '#8b3cf0']], 1, 1)}</defs>${BG('url(#g)')}
    <circle cx="32" cy="32" r="12.5" fill="none" stroke="#fff" stroke-width="4.6"/>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M32 10.5v3.2M32 50.3v3.2M10.5 32h3.2M50.3 32h3.2M16.8 16.8l2.3 2.3M44.9 44.9l2.3 2.3M47.2 16.8l-2.3 2.3M19.1 44.9l-2.3 2.3"/></g>
    <circle cx="32" cy="32" r="5" fill="#fff"/>`,
  correio: () => `<defs>${G('g', [[0, '#ffffff'], [1, '#eef0f3']])}</defs>${BG('url(#g)')}
    <rect x="13" y="19" width="38" height="27" rx="5" fill="#e8483a"/><path d="M13.5 22.5L32 35.5l18.5-13" stroke="#fff" stroke-width="3.6" fill="none" stroke-linejoin="round"/>
    <path d="M13 44l13-11M51 44L38 33" stroke="#b9281d" stroke-width="2" opacity=".55"/>`,
  navegador: () => `<defs>${G('g', [[0, '#5fb0ff'], [1, '#2662e0']])}</defs>${BG('url(#g)')}
    <circle cx="32" cy="32" r="16.5" fill="#fff"/><path d="M41.5 22.5L36 36l-13.5 5.5L28 28z" fill="#2b6ef0"/><path d="M41.5 22.5L36 36l-8-8z" fill="#ff5a5f"/><circle cx="32" cy="32" r="2.1" fill="#fff"/>`,
  jandaia: () => `<defs>${G('g', [[0, '#1fb579'], [1, '#0b7a4f']])}${G('y', [[0, '#ffe36e'], [1, '#f2b916']])}</defs>${BG('url(#g)')}
    <path fill="url(#y)" d="M39.5 15c-8.3 0-15 6.7-15 15v2.6c0 6.6-4 11.3-7.9 14.9 9.6 2 25.4-1 27.6-15.5l5.9-3.8c.7-.5.7-1.5 0-1.9l-5.2-3.3C44.5 18.5 42.3 15 39.5 15z"/>
    <circle cx="40.4" cy="22.6" r="2.3" fill="#0d3b28"/><path d="M47 25.2l7 1.6-6.3 3z" fill="#ff8a3d"/>`,
  notas: () => `<defs>${G('g', [[0, '#ffd75e'], [1, '#f0b320']])}</defs>${BG('url(#g)')}
    <path d="M18 14h22l8 8v26a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z" fill="#fffdf4"/><path d="M40 14v6a2 2 0 0 0 2 2h6z" fill="#f3d98e"/>
    <path d="M21 29h20M21 35h20M21 41h13" stroke="#d9a520" stroke-width="2.6" stroke-linecap="round"/>`,
  agenda: () => `<defs>${G('g', [[0, '#ffffff'], [1, '#eef1f6']])}</defs>${BG('url(#g)')}
    <rect x="14" y="15" width="36" height="35" rx="6" fill="#fff" stroke="#d6dce6"/><path d="M14 21a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v4H14z" fill="#3e72f0"/>
    <text x="32" y="45" text-anchor="middle" font-family="Roboto Flex, Arial, sans-serif" font-size="17" font-weight="700" fill="#2c3440">10</text>`,
  gravador: () => `<defs>${G('g', [[0, '#ff7a54'], [1, '#e2412a']])}</defs>${BG('url(#g)')}
    <rect x="26" y="13" width="12" height="24" rx="6" fill="#fff"/><path d="M20.5 30.5a11.5 11.5 0 0 0 23 0" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M32 42v8M26 50h12" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`,
  pulso: () => `<defs>${G('g', [[0, '#2a2d34'], [1, '#121418']])}${G('h', [[0, '#ff6b87'], [1, '#e8344f']])}</defs>${BG('url(#g)')}
    <path fill="url(#h)" d="M32 47.5S15 37.6 15 25.7c0-5 3.9-8.7 8.6-8.7 3.4 0 6.3 1.9 8.4 4.9 2.1-3 5-4.9 8.4-4.9 4.7 0 8.6 3.7 8.6 8.7C49 37.6 32 47.5 32 47.5z"/>
    <path d="M16 30h8.5l3-5 4 10 3-6.5 2 1.5H48" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  bora: () => `${BG('#0c0c0c')}<text x="32" y="38.5" text-anchor="middle" font-family="Roboto Flex, Arial, sans-serif" font-size="17.5" font-weight="900" letter-spacing="-.5" fill="#ffd400">bora</text><circle cx="47.5" cy="23" r="2.6" fill="#ffd400"/>`,
  arquivos: () => `<defs>${G('g', [[0, '#eaf3ff'], [1, '#d4e4f8']])}${G('f', [[0, '#ffc542'], [1, '#f29b18']])}</defs>${BG('url(#g)')}
    <path d="M13 21a4 4 0 0 1 4-4h9.2c1 0 2 .4 2.7 1.1L31.5 21H47a4 4 0 0 1 4 4v1H13z" fill="#e88a0c"/><rect x="13" y="24" width="38" height="24" rx="4" fill="url(#f)"/>`,
  relogio: () => `<defs>${G('g', [[0, '#3c4a63'], [1, '#1d2535']])}</defs>${BG('url(#g)')}
    <circle cx="32" cy="33" r="16" fill="#fff"/><circle cx="32" cy="33" r="16" fill="none" stroke="#c9d3e3" stroke-width="1.4"/>
    <path d="M32 23v10l6.5 4" stroke="#1d2535" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="32" cy="33" r="1.8" fill="#ff5a4e"/>
    <path d="M18 18.5l-4.5 4.2M46 18.5l4.5 4.2" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>`,
  clima: () => `<defs>${G('g', [[0, '#5cc6ff'], [1, '#2a7fd6']])}${R('s', [[0, '#fff3b0'], [1, '#ffbf2e']], .4, .4, .7)}</defs>${BG('url(#g)')}
    <circle cx="25" cy="25" r="9.5" fill="url(#s)"/><path d="M24 46h21a8 8 0 0 0 .6-16 10.5 10.5 0 0 0-20.2 3.4A6.4 6.4 0 0 0 24 46z" fill="#fff"/>`,
  configuracoes: () => `<defs>${G('g', [[0, '#8a93a1'], [1, '#4c5462']])}</defs>${BG('url(#g)')}
    <path fill="#fff" d="M29.4 13h5.2l1 5.2c1.4.4 2.7 1 3.9 1.7l4.4-3 3.7 3.7-3 4.4c.7 1.2 1.3 2.5 1.7 3.9l5.2 1v5.2l-5.2 1c-.4 1.4-1 2.7-1.7 3.9l3 4.4-3.7 3.7-4.4-3c-1.2.7-2.5 1.3-3.9 1.7l-1 5.2h-5.2l-1-5.2c-1.4-.4-2.7-1-3.9-1.7l-4.4 3-3.7-3.7 3-4.4c-.7-1.2-1.3-2.5-1.7-3.9l-5.2-1v-5.2l5.2-1c.4-1.4 1-2.7 1.7-3.9l-3-4.4 3.7-3.7 4.4 3c1.2-.7 2.5-1.3 3.9-1.7z"/>
    <circle cx="32" cy="32" r="6.5" fill="#5f6878"/>`,
  eco: () => `${BG('#0b0c0e')}<circle cx="24" cy="30" r="7" fill="none" stroke="#d6b46a" stroke-width="3"/><circle cx="40" cy="30" r="7" fill="none" stroke="#d6b46a" stroke-width="3"/><circle cx="24" cy="30" r="2.4" fill="#d6b46a"/><circle cx="40" cy="30" r="2.4" fill="#d6b46a"/><path d="M29 41l3 3.4 3-3.4" fill="#d6b46a"/><path d="M17 21l6 3M47 21l-6 3" stroke="#d6b46a" stroke-width="3" stroke-linecap="round"/>`,
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
