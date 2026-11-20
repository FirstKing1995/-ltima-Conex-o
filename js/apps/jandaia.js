// Nubank — o banco de Iara (nuvem: mostra dados até terça 13/10), no visual atual do app em modo escuro.
// Raiz: "Olá, Iara", Conta com saldo (olho), atalhos, Meus cartões e Cartão de crédito.
// Subtelas: Conta (saldo + Histórico com busca e filtros) e o comprovante no estilo do Nubank (Origem/Destino, chave, ID).
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { state, save } from '../core/state.js';

/* ---------- identidade ---------- */
const NU_LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="24" fill="#820ad1"/><path d="M11.5 31v-8.5a4.5 4.5 0 0 1 9 0V31M26.5 17.5V26a4.5 4.5 0 0 0 9 0v-8.5V31" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PIX = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.6 16.9a2.8 2.8 0 0 1-2-.8l-2.9-2.9a.6.6 0 0 0-.8 0l-2.9 2.9a2.8 2.8 0 0 1-2 .8h-.6l3.7 3.7a2.9 2.9 0 0 0 4.1 0l3.7-3.7zM7 7.1c.8 0 1.5.3 2 .8l2.9 2.9c.2.2.6.2.8 0l2.9-2.9c.5-.5 1.2-.8 2-.8h.4l-3.7-3.7a2.9 2.9 0 0 0-4.1 0L6.5 7.1zm13.6 2.8-2.2-2.2h-.8c-.5 0-1 .2-1.4.6l-2.9 2.9a1.6 1.6 0 0 1-2.4 0L8 8.3a2 2 0 0 0-1.4-.6h-1l-2.2 2.2a2.9 2.9 0 0 0 0 4.1l2.2 2.2h1A2 2 0 0 0 8 15.6l2.9-2.9a1.7 1.7 0 0 1 2.4 0l2.9 2.9c.4.4.9.6 1.4.6h.8l2.2-2.2a2.9 2.9 0 0 0 0-4.1z"/></svg>`;

const SELF_ISPB = '37120094';
const ALNUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** tipos de movimentação: rótulo (Histórico), sinal (entrada +1 / saída −1), ícone, título do comprovante */
const TYPES = {
  pix_in: { label: 'Transferência recebida', title: 'Comprovante de transferência', sign: 1, icon: 'pix', kind: 'pix', recv: true },
  pix_out: { label: 'Transferência enviada', title: 'Comprovante de transferência', sign: -1, icon: 'pix', kind: 'pix' },
  devolucao_in: { label: 'Devolução recebida', title: 'Comprovante de devolução', sign: 1, icon: 'rotate-ccw', kind: 'pix', recv: true, dev: true },
  devolucao_out: { label: 'Devolução enviada', title: 'Comprovante de devolução', sign: -1, icon: 'rotate-ccw', kind: 'pix', dev: true },
  debito: { label: 'Compra no débito', title: 'Comprovante de compra', sign: -1, icon: 'credit-card', kind: 'card' },
  credito: { label: 'Compra no crédito', title: 'Comprovante de compra', sign: -1, icon: 'credit-card', kind: 'card', credit: true },
  boleto: { label: 'Pagamento de boleto', title: 'Comprovante de pagamento', sign: -1, icon: 'scan-line', kind: 'boleto' },
  tarifa: { label: 'Tarifa', title: 'Comprovante de tarifa', sign: -1, icon: 'landmark', kind: 'fee' },
};
const typeOf = (t) => TYPES[t.type] || { label: 'Movimentação', title: 'Comprovante', sign: -1, icon: 'wallet', kind: 'other' };
const typeIcon = (T, size = 20) => (T.icon === 'pix' ? h('span', { class: 'ja-pixic', html: PIX }) : icon(T.icon, { size }));

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const pad = (n) => String(n).padStart(2, '0');
const prefs = () => (state.apps.jandaia ||= {});
const partyName = (t) => t.party?.name || (t.type === 'tarifa' ? 'Nubank' : '—');
const nf = (n) => Math.abs(Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const MES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const nuDate = (at) => { const d = time.parse(at); return `${pad(d.getDate())} ${MES[d.getMonth()]}`; };
const dayDiff = (a, b) => {
  const da = time.parse(a), db = time.parse(b);
  return Math.round((Date.UTC(db.getFullYear(), db.getMonth(), db.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) / 86400000);
};
function dayTitle(at, now) {
  const d = time.parse(at), n = time.parse(now);
  const base = `${pad(d.getDate())} ${MES[d.getMonth()]}${d.getFullYear() !== n.getFullYear() ? ` ${d.getFullYear()}` : ''}`;
  const diff = dayDiff(at, now);
  return diff === 0 ? `Hoje · ${base}` : diff === 1 ? `Ontem · ${base}` : `${cap(time.weekday(at))} · ${base}`;
}

/* números estáveis: o mesmo comprovante sempre mostra o mesmo ID */
function hash32(str) { let x = 2166136261; for (const c of String(str)) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; }
function rng(seed) {
  let a = hash32(seed);
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const ispbOf = (bank) => (bank ? String(10000000 + (hash32('ispb:' + bank) % 89999999)) : SELF_ISPB);
/** carimbo UTC do ID (Fortaleza = UTC−3) */
function utcStamp(at) {
  const d = time.parse(at);
  const u = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 3, d.getMinutes()));
  return `${u.getUTCFullYear()}${pad(u.getUTCMonth() + 1)}${pad(u.getUTCDate())}${pad(u.getUTCHours())}${pad(u.getUTCMinutes())}`;
}
function e2e(t, prefix = 'E') {
  const r = rng('e2e:' + t.id);
  let tail = '';
  for (let i = 0; i < 11; i++) tail += ALNUM[Math.floor(r() * ALNUM.length)];
  const T = typeOf(t);
  return `${prefix}${ispbOf(T.recv ? t.party?.bank : '')}${utcStamp(t.at)}${tail}`;
}
function authCode(t) {
  const r = rng('aut:' + t.id);
  let s = '';
  for (let i = 0; i < 16; i++) s += '0123456789ABCDEF'[Math.floor(r() * 16)];
  return s.match(/.{4}/g).join('.');
}
function clock(t) {
  const d = time.parse(t.at);
  const sec = d.getSeconds() || Math.floor(rng('sec:' + t.id)() * 60);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(sec)}`;
}

/* documentos mascarados (CPF/CNPJ) */
function maskDoc(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  if (/[*•]/.test(s)) return s.replace(/\*/g, '•');
  const d = s.replace(/\D/g, '');
  if (d.length === 11) return `•••.${d.slice(3, 6)}.${d.slice(6, 9)}-••`;
  if (d.length === 14) return `••.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-••`;
  return s;
}
const docLabel = (raw) => { const s = String(raw || ''); return s.includes('/') || s.replace(/\D/g, '').length === 14 ? 'CNPJ' : 'CPF'; };
function fmtKey(k) {
  const s = String(k ?? '').trim();
  if (/^\d{14}$/.test(s)) return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(12)}`;
  if (/^\d{11}$/.test(s)) return maskDoc(s);
  return s;
}
const keyKind = (k) => {
  const s = String(k ?? '').trim();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) return 'Chave aleatória';
  if (/@/.test(s)) return 'E-mail';
  if (/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(s) || /^\+?55/.test(s)) return 'Celular';
  const d = s.replace(/\D/g, '');
  if (d.length === 14) return 'CNPJ';
  if (d.length === 11) return 'CPF';
  return '';
};

/* ---------- app ---------- */
export default {
  id: 'jandaia',
  title: 'Nubank',
  cloud: true,

  render(ctx) {
    const { el, kit, game, phone, data, params = {} } = ctx;
    const NOW = ctx.now || time.PRESENT_NOW;
    const acc = data.account || {};
    const holder = acc.holder || 'Iara Fontenele';
    const first = String(holder).split(/\s+/)[0];
    const stub = (what) => phone.toast(`${what}: indisponível na extração`, { icon: 'info' });
    const txs = () => (data.transactions || []).filter(t => game.req(t)).sort((a, b) => time.compare(b.at, a.at));
    const hidden = () => !!prefs().hide;
    const money = (v) => (hidden() ? 'R$ ••••' : `R$ ${nf(v)}`);

    /* valores que somem com o olho */
    const masks = new Set();
    const maskVal = (v, cls = '') => { const s = h('span', { class: `ja-mv ${cls}`, dataset: { v: String(v) } }); s.textContent = money(v); masks.add(s); return s; };
    const eyeBtns = new Set();
    const drawEye = (b) => { b.replaceChildren(icon(hidden() ? 'eye-off' : 'eye', { size: 22 })); b.setAttribute('aria-label', hidden() ? 'Mostrar valores' : 'Ocultar valores'); };
    const eyeBtn = (cls = '') => { const b = h('button', { class: `ja-eye ${cls}`, on: { click: () => { prefs().hide = !hidden(); save(); refreshMasks(); } } }); eyeBtns.add(b); drawEye(b); return b; };
    function refreshMasks() {
      for (const s of masks) { if (!s.isConnected) { masks.delete(s); continue; } s.textContent = money(Number(s.dataset.v)); }
      for (const b of eyeBtns) { if (!b.isConnected) { eyeBtns.delete(b); continue; } drawEye(b); }
    }

    /* atalhos (carrossel de círculos) */
    const SHORTCUTS = [
      { label: 'Área Pix', pix: true, onClick: () => openPixArea() },
      { label: 'Pagar', icon: 'scan-line' },
      { label: 'Transferir', icon: 'send-horizontal' },
      { label: 'Depositar', icon: 'download' },
      { label: 'Pegar emprestado', icon: 'banknote' },
      { label: 'Recarga de celular', icon: 'smartphone' },
      { label: 'Cobrar', icon: 'qr-code' },
    ];
    const quickRow = () => h('nav', { class: 'ja-quick', 'aria-label': 'Atalhos' }, SHORTCUTS.map(s =>
      h('button', { class: 'ja-qk', on: { click: s.onClick || (() => stub(s.label)) } },
        h('span', { class: 'ja-qk-ic' }, s.pix ? h('span', { class: 'ja-pixic big', html: PIX }) : icon(s.icon, { size: 24, stroke: 1.8 })),
        h('span', { class: 'ja-qk-l' }, s.label))));

    function openPixArea() {
      const keys = data.pixKeys || [];
      phone.sheet({
        title: 'Área Pix',
        render: (body) => body.append(h('div', { class: 'ja-pixsheet' },
          h('p', null, 'Minhas chaves'),
          keys.length ? keys.map(k => h('div', { class: 'ja-pixkey' }, h('span', { class: 'ja-pixic', html: PIX }), h('span', null, h('b', null, fmtKey(k)), h('small', null, keyKind(k) || 'Chave')))) : h('small', null, 'Nenhuma chave cadastrada.'))),
      });
    }

    /* fatura atual: compras no crédito depois do último pagamento de fatura */
    const lastBill = txs().find(t => t.type === 'boleto' && /fatura/i.test(`${t.description || ''}`));
    const billNow = txs().filter(t => t.type === 'credito' && (!lastBill || time.compare(t.at, lastBill.at) > 0)).reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);

    /* ----- raiz ----- */
    const hero = h('header', { class: 'ja-hero' },
      h('div', { class: 'ja-top' },
        h('button', { class: 'ja-me', 'aria-label': 'Perfil', on: { click: () => stub('Perfil') } }, icon('user-round', { size: 24, stroke: 1.8 })),
        h('span', { class: 'ja-sp' }),
        eyeBtn(),
        h('button', { class: 'ja-hbtn', 'aria-label': 'Me ajuda', on: { click: () => stub('Me ajuda') } }, icon('circle-help', { size: 22 })),
        h('button', { class: 'ja-hbtn', 'aria-label': 'Convidar amigos', on: { click: () => stub('Convidar amigos') } }, icon('mail', { size: 22 }))),
      h('div', { class: 'ja-hello' }, `Olá, ${first}`));

    const contaSec = h('button', { class: 'ja-sec ja-conta', on: { click: () => openConta() } },
      h('span', { class: 'ja-sec-h' }, h('b', null, 'Conta'), icon('chevron-right', { size: 20 })),
      maskVal(acc.balance, 'ja-bal'));

    const cardsBtn = h('button', { class: 'ja-mycards', on: { click: () => stub('Meus cartões') } }, icon('credit-card', { size: 20 }), h('span', null, 'Meus cartões'));

    const creditSec = h('button', { class: 'ja-sec ja-credit', on: { click: () => openConta('cc') } },
      h('span', { class: 'ja-sec-ic' }, icon('credit-card', { size: 22 })),
      h('span', { class: 'ja-sec-h' }, h('b', null, 'Cartão de crédito'), icon('chevron-right', { size: 20 })),
      h('small', { class: 'ja-sec-l' }, 'Fatura atual'),
      maskVal(billNow, 'ja-bill'),
      acc.limit != null && acc.limit !== '' ? h('small', { class: 'ja-sec-l' }, 'Limite disponível de ', maskVal(acc.limit)) : null);

    const loanSec = h('button', { class: 'ja-sec ja-loan', on: { click: () => stub('Empréstimo') } },
      h('span', { class: 'ja-sec-ic' }, icon('banknote', { size: 22 })),
      h('span', { class: 'ja-sec-h' }, h('b', null, 'Empréstimo'), icon('chevron-right', { size: 20 })),
      h('small', { class: 'ja-sec-l' }, 'Simule e veja as condições disponíveis para você.'));

    el.append(h('div', { class: 'ja-home' },
      hero, contaSec, quickRow(), cardsBtn,
      h('div', { class: 'ja-banner', role: 'note' }, icon('shield-check', { size: 20 }), h('span', null, 'Ative o ', h('b', null, 'Modo Rua'), ' e proteja suas transações fora de casa.')),
      h('hr', { class: 'ja-hr' }), creditSec, h('hr', { class: 'ja-hr' }), loanSec, h('div', { class: 'ja-end' })));

    /* ----- Conta: saldo + Histórico ----- */
    function openConta(startFilter = 'all') {
      phone.push({
        className: 'ja-screen ja-conta-screen',
        render: (body) => {
          const listEl = h('div', { class: 'ja-list' });
          let filter = startFilter, query = '';
          const chipsEl = kit.chips({ items: [{ id: 'all', label: 'Tudo' }, { id: 'in', label: 'Entradas' }, { id: 'out', label: 'Saídas' }, { id: 'cc', label: 'Cartão de crédito' }], active: filter, onChange: (id) => { filter = id; draw(); } });
          chipsEl.classList.add('ja-chips');

          const row = (t) => {
            const T = typeOf(t);
            const inc = T.sign > 0;
            const cls = `ja-row ${inc ? 'in' : 'out'} ${T.dev ? 'dev' : ''} ${T.credit ? 'cc' : ''} ${T.kind === 'fee' ? 'fee' : ''}`;
            const val = T.credit ? `R$ ${nf(t.amount)}` : time.money(T.sign * Math.abs(Number(t.amount) || 0), { sign: inc });
            return h('button', { class: cls, dataset: { id: t.id }, on: { click: () => openReceipt(t) } },
              h('span', { class: 'ja-ic' }, typeIcon(T)),
              h('span', { class: 'ja-main' },
                h('span', { class: 'ja-t' }, T.label),
                h('span', { class: 'ja-p' }, partyName(t)),
                h('span', { class: 'ja-v' }, val),
                h('span', { class: 'ja-d' }, [T.kind === 'pix' ? 'Pix' : T.credit ? 'Fatura do cartão' : '', t.description].filter(Boolean).join(' · '))),
              h('span', { class: 'ja-when' }, time.hhmm(t.at)));
          };

          function draw() {
            listEl.replaceChildren();
            const needle = fold(query).trim();
            const items = txs().filter(t => {
              const T = typeOf(t);
              if (filter === 'in' && T.sign < 0) return false;
              if (filter === 'out' && T.sign > 0) return false;
              if (filter === 'cc' && !T.credit) return false;
              if (!needle) return true;
              return fold(`${t.party?.name || ''} ${t.description || ''} ${t.category || ''} ${T.label} ${nf(t.amount)}`).includes(needle);
            });
            if (!items.length) { listEl.appendChild(kit.empty({ icon: 'receipt', title: 'Nada encontrado', text: needle ? 'Nenhuma movimentação corresponde à busca.' : 'Sem movimentações neste filtro.' })); return; }
            let last = '';
            for (const t of items) {
              const day = time.ymd(t.at);
              if (day !== last) { last = day; listEl.appendChild(h('h3', { class: 'ja-day' }, dayTitle(t.at, NOW))); }
              listEl.appendChild(row(t));
            }
          }

          body.append(
            h('header', { class: 'ja-bar' },
              kit.iconButton({ icon: 'arrow-left', label: 'Voltar', onClick: () => phone.back() }),
              h('span', { class: 'ja-sp' }),
              eyeBtn('dark'),
              kit.iconButton({ icon: 'circle-help', label: 'Me ajuda', onClick: () => stub('Me ajuda') })),
            h('section', { class: 'ja-cbal' },
              h('small', null, 'Saldo disponível'),
              maskVal(acc.balance, 'ja-bal'),
              h('small', { class: 'ja-acct' }, [acc.agency ? `Agência ${acc.agency}` : '', acc.number ? `Conta ${acc.number}` : ''].filter(Boolean).join(' · '))),
            quickRow(),
            h('hr', { class: 'ja-hr' }),
            h('section', { class: 'ja-ext' },
              h('h2', null, 'Histórico'),
              kit.search({ placeholder: 'Buscar no histórico', onInput: (v) => { query = v; draw(); } }),
              chipsEl, listEl));
          draw();
        },
      });
    }

    /* ----- comprovante ----- */
    function original(t) {
      const T = typeOf(t);
      if (!T.dev) return null;
      const want = T.recv ? 'pix_out' : 'pix_in';
      return txs().find(x => x.type === want && x.party?.name === t.party?.name && Math.abs(Number(x.amount)) === Math.abs(Number(t.amount)) && time.compare(x.at, t.at) <= 0) || null;
    }

    function openReceipt(t) {
      game.see('jandaia:tx:' + t.id);
      if (t.onSee) game.flags([].concat(t.onSee));
      const T = typeOf(t);
      phone.push({
        className: 'ja-screen ja-rcpt-screen',
        render: (body) => {
          body.appendChild(h('header', { class: 'ja-bar' },
            kit.iconButton({ icon: 'x', label: 'Fechar', onClick: () => phone.back() }),
            h('span', { class: 'ja-sp' }),
            kit.iconButton({ icon: 'share-2', label: 'Compartilhar', onClick: () => stub('Compartilhar') })));
          body.appendChild(h('div', { class: 'ja-rwrap' },
            ticket(t),
            h('div', { class: 'ja-pinrow' }, kit.pinButton({ key: 'jandaia:tx:' + t.id, label: `${T.label} — ${partyName(t)}`, app: 'jandaia', detail: `R$ ${nf(t.amount)} · ${time.dateBR(t.at)} ${time.hhmm(t.at)}` }))));
        },
      });
    }

    function ticket(t) {
      const T = typeOf(t);
      const kv = (k, v, cls = '') => (v === undefined || v === null || v === '' ? null : h('div', { class: `ja-kv ${cls}` }, h('span', null, k), h('b', null, v)));
      const me = { name: holder, doc: acc.doc ? maskDoc(acc.doc) : '', bank: 'Nu Pagamentos - IP', agency: acc.agency, number: acc.number };
      const other = t.party || {};
      const block = (title, p, { mine, pix } = {}) => h('section', { class: 'ja-blk' },
        h('h4', null, title),
        kv('Nome', p.name || '—', 'nm'),
        kv(docLabel(p.doc), maskDoc(p.doc)),
        kv('Instituição', p.bank),
        mine ? kv('Agência', p.agency) : null,
        mine ? kv('Conta', p.number) : null,
        mine ? kv('Tipo de conta', 'Conta de pagamento') : null,
        !mine && pix ? kv('Chave Pix', fmtKey(p.key), 'key') : null,
        !mine && pix && p.key ? kv('Tipo de chave', keyKind(p.key)) : null);

      const isPix = T.kind === 'pix';
      const blocks = [];
      if (isPix) {
        if (T.recv) blocks.push(block('Origem', other, { pix: true }), block('Destino', me, { mine: true }));
        else blocks.push(block('Destino', other, { pix: true }), block('Origem', me, { mine: true }));
      } else if (T.kind === 'card') {
        blocks.push(block('Estabelecimento', other),
          h('section', { class: 'ja-blk' }, h('h4', null, 'Pagamento'), kv('Forma', T.credit ? 'Cartão de crédito' : 'Cartão de débito'), kv('Titular', holder)));
      } else if (T.kind === 'boleto') {
        blocks.push(block('Beneficiário', other), block('Pagador', me, { mine: true }));
      } else {
        blocks.push(h('section', { class: 'ja-blk' }, h('h4', null, 'Cobrado por'), kv('Nome', partyName(t), 'nm')), block('Conta debitada', me, { mine: true }));
      }

      const orig = original(t);
      const ids = [];
      if (isPix) {
        ids.push(idBox(T.dev ? 'ID da devolução' : 'ID da transação', e2e(t, T.dev ? 'D' : 'E')));
        if (orig) ids.push(idBox('ID da transação original', e2e(orig, 'E'), `${time.dateBR(orig.at)} · ${time.hhmm(orig.at)}`));
      } else ids.push(idBox('Código de autenticação', authCode(t)));

      const kind = T.dev ? 'Devolução de Pix' : isPix ? 'Pix' : T.kind === 'card' ? (T.credit ? 'Cartão de crédito' : 'Cartão de débito') : T.kind === 'boleto' ? 'Boleto' : 'Tarifa';
      const d = time.parse(t.at);
      return h('article', { class: 'ja-ticket' },
        h('span', { class: 'ja-logo', html: NU_LOGO }),
        h('h1', { class: 'ja-tt' }, T.title),
        h('div', { class: 'ja-twhen' }, `${pad(d.getDate())} ${MES[d.getMonth()]} ${d.getFullYear()} - ${clock(t)}`),
        h('div', { class: 'ja-kvs first' },
          kv('Valor', `R$ ${nf(t.amount)}`, 'amt'),
          kv(isPix ? 'Tipo de transferência' : 'Tipo', kind),
          kv(isPix ? 'Mensagem' : 'Descrição', t.description),
          kv('Categoria', t.category),
          T.credit ? kv('Situação', 'Lançada na fatura') : null),
        blocks,
        h('section', { class: 'ja-foot' },
          h('b', null, 'Nu Pagamentos S.A. - Instituição de Pagamento'),
          ids,
          h('p', { class: 'ja-fine' }, 'Estamos aqui para ajudar se você tiver alguma dúvida. Fale com a gente pelo app, a qualquer hora.')));
    }

    function idBox(label, value, sub) {
      return h('div', { class: 'ja-id' },
        h('span', null, label),
        h('code', null, value),
        sub ? h('em', null, sub) : null,
        h('button', { class: 'ja-copy', 'aria-label': `Copiar ${label}`, on: { click: async () => { try { await navigator.clipboard.writeText(value); } catch (e) { /* sem permissão de área de transferência */ } phone.toast('Código copiado', { icon: 'copy' }); } } }, icon('copy', { size: 16 })));
    }

    if (params.tx) {
      const t = txs().find(x => x.id === params.tx);
      if (t) openReceipt(t); else phone.toast('Comprovante não encontrado', { icon: 'info' });
    }
  },

  search({ data, game }) {
    return (data.transactions || []).filter(t => game.req(t)).map(t => {
      const T = typeOf(t);
      const p = t.party || {};
      return {
        title: `${T.label} — ${partyName(t)}`,
        text: [p.name, t.description, t.category, T.label, T.kind === 'pix' ? 'Pix' : '', `R$ ${nf(t.amount)}`, p.doc, p.key].filter(Boolean).join(' '),
        params: { tx: t.id },
        at: t.at,
      };
    });
  },
};
