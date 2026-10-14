// Boot do jogo.
import { CONFIG } from './config.js';
import { loadCase } from '../data/caso01/index.js';
import { setCase, CASE } from './core/store.js';
import { state, load, save, setFlag } from './core/state.js';
import { bus } from './core/bus.js';
import { api, cloudSaveSoon } from './core/api.js';
import { phone } from './phone/phone.js';
import { renderHome } from './phone/launcher.js';
import { renderLock } from './phone/lock.js';
import { game } from './game/game.js';
import * as progress from './game/progress.js';
import * as eco from './game/eco.js';
import * as board from './game/board.js';
import * as invbar from './game/invbar.js';

async function boot() {
  const data = await loadCase();
  setCase(data);
  if (data._errors?.length) console.warn('[caso01] arquivos com erro:', data._errors);
  load();

  const stage = document.getElementById('stage');
  phone.mount(document.getElementById('phone'), game);
  phone.setHome(renderHome);
  if (!state.flags.phone_unlocked) phone.showLock(renderLock);
  game.analysis.attach(phone.root, game, (txt, isNew) => phone.toast(txt, { icon: isNew ? 'sparkles' : 'check' }));

  invbar.mount({ barEl: document.getElementById('inv-bar'), ecoEl: document.getElementById('eco-panel'), boardEl: document.getElementById('board-panel'), onMenu: () => openMenu() });
  game.eco = eco.eco;
  game.board = board.board;
  eco.mount(document.getElementById('eco-panel'), { isVisible: invbar.isEcoVisible });
  board.mount(document.getElementById('board-panel'));
  progress.init();

  stage.dataset.mode = 'play';

  // fluxo de telas
  bus.on('game:new', async () => { location.hash = ''; const intro = await import('./screens/intro.js'); intro.play(); });
  bus.on('game:continue', () => {});
  bus.on('final:submitted', async (r) => { const end = await import('./screens/ending.js'); end.play(r); });
  bus.on('ending:start', async (a) => { const end = await import('./screens/ending.js'); end.play(state.finalResult || a); });
  bus.on('chapter', () => cloudSaveSoon());
  bus.on('objective', ({ text }) => phone.toast(`Objetivo concluído: ${text}`, { icon: 'check', ms: 3200 }));
  bus.on('phone:unlocked', () => {});

  const title = await import('./screens/title.js');
  title.show();

  // sincroniza config remota (aviso global)
  api.config().then(cfg => { if (cfg?.mensagem_global) bus.emit('global:message', cfg.mensagem_global); });

  if (CONFIG.DEBUG) { window.__state = () => state; window.__CASE = CASE; window.__phone = phone; window.__setFlag = setFlag; }
}

async function openMenu() {
  const title = await import('./screens/title.js');
  (title.menu || title.show)();
}

boot().catch(err => {
  console.error(err);
  document.getElementById('phone').innerHTML = `<div style="padding:40px 20px;color:#eee;font-family:sans-serif">Erro ao iniciar o jogo. Recarregue a página.<br><small style="color:#999">${String(err.message || err)}</small></div>`;
});
