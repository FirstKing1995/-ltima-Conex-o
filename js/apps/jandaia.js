// Jandaia — o banco de Iara (nuvem: mostra dados até terça 13/10).
// Raiz: saudação, saldo (com olho), atalhos e extrato por dia. Subtela: comprovante (papel serrilhado, De/Para, ID E2E, Fixar no Quadro).
import { h } from '../core/dom.js';
import { icon } from '../ui/icons.js';
import * as time from '../core/time.js';
import { state, save } from '../core/state.js';

/* ---------- identidade: a jandaia (periquito de cabeça amarela) ---------- */
const BIRD = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <path d="M9 58c3-13 9-24 19-31l7 8c-6 8-14 17-26 23z" fill="#0f5a40"/>
  <path d="M17 36c0-12 8-21 20-21 9 0 15 7 14 17-1 11-9 21-20 21-9 0-14-7-14-17z" fill="#f2c94c"/>
  <path d="M17 38c2 8 8 12 16 11 8-1 13-6 15-13-7 3-12 1-17-3-6-5-10-4-14 5z" fill="#ee8b2c"/>
  <path d="M21 30c7-3 15 0 19 8-8 5-18 3-22-3z" fill="#1f9d6b"/>
  <circle cx="40" cy="25" r="3.4" fill="#fff"/><circle cx="40.8" cy="25" r="2" fill="#10261d"/>
  <path d="M46 22c6-1 10 3 8 8-1 3-5 4-8 2l-2-6z" fill="#2b2f2c"/>
</svg>`;

const SELF_ISPB = '37120094';
const ALNUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** tipos de movimentação: rótulo, sinal (entrada +1 / saída −1), ícone, quem origina a ordem */
const TYPES = {
  pix_in: { label: 'Pix recebido', title: 'Pix recebido', sign: 1, icon: 'arrow-down-left', kind: 'pix', recv: true },
  pix_out: { label: 'Pix enviado', title: 'Pix enviado', sign: -1, icon: 'arrow-up-right', kind: 'pix' },
  devolucao_in: { label: 'Devolução recebida', title: 'Devolução recebida', sign: 1, icon: 'rotate-ccw', kind: 'pix', recv: true, dev: true },
  devolucao_out: { label: 'Devolução enviada', title: 'Devolução enviada', sign: -1, icon: 'rotate-ccw', kind: 'pix', dev: true },
  debito: { label: 'Compra no débito', title: 'Compra no débito', sign: -1, icon: 'credit-card', kind: 'card' },
  credito: { label: 'Compra no crédito', title: 'Compra no crédito', sign: -1, icon: 'credit-card', kind: 'card', credit: true },
  boleto: { label: 'Pagamento de boleto', title: 'Boleto pago', sign: -1, icon: 'scan-line', kind: 'boleto' },
  tarifa: { label: 'Tarifa', title: 'Tarifa de serviços', sign: -1, icon: 'landmark', kind: 'fee' },
};
const typeOf = (t) => TYPES[t.type] || { label: 'Movimentação', title: 'Movimentação', sign: -1, icon: 'wallet', kind: 'other' };

/* ---------- utilitários ---------- */
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const pad = (n) => String(n).padStart(2, '0');
const prefs = () => (state.apps.jandaia ||= {});
const partyName = (t) => t.party?.name || (t.type === 'tarifa' ? 'Jandaia' : '—');
const nf = (n) => Math.abs(Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dayDiff = (a, b) => {
  const da = time.parse(a), db = time.parse(b);
  return Math.round((Date.UTC(db.getFullYear(), db.getMonth(), db.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) / 86400000);
};
function dayTitle(at, now) {
  const d = time.parse(at), n = time.parse(now);
  const wd = cap(time.weekdayLong(at).replace('-feira', ''));
  const base = `${wd}, ${d.getDate()} de ${time.monthName(d.getMonth())}${d.getFullYear() !== n.getFullYear() ? ` de ${d.getFullYear()}` : ''}`;
  const diff = dayDiff(at, now);
  return diff === 0 ? `Hoje · ${base}` : diff === 1 ? `Ontem · ${base}` : base;
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

/* ---------- app ---------- */
export default {
  id: 'jandaia',
  title: 'Jandaia',
  cloud: true,

  render(ctx) {
    const { el, kit, game, phone, data, params = {} } = ctx;
    const NOW = ctx.now || time.PRESENT_NOW;
    const acc = data.account || {};
    const holder = acc.holder || 'Iara Fontenele';
    const stub = (what) => phone.toast(`${what}: indisponível no espelho`, { icon: 'info' });
    const txs = () => (data.transactions || []).filter(t => game.req(t)).sort((a, b) => time.compare(b.at, a.at));

    /* ----- raiz: topo verde com saldo ----- */
    const balEl = h('div', { class: 'ja-bal', 'aria-live': 'polite' });
    const eye = h('button', { class: 'ja-eye', on: { click: () => { prefs().hide = !prefs().hide; save(); drawBal(); } } });
    function drawBal() {
      const hide = !!prefs().hide;
      balEl.replaceChildren(h('span', { class: 'ja-cur' }, 'R$'), h('span', { class: 'ja-num' }, hide ? '••••••' : nf(acc.balance)));
      eye.replaceChildren(icon(hide ? 'eye-off' : 'eye', { size: 20 }));
      eye.setAttribute('aria-label', hide ? 'Mostrar saldo' : 'Ocultar saldo');
    }
    drawBal();

    const hero = h('header', { class: 'ja-hero' },
      h('div', { class: 'ja-top' },
        kit.iconButton({ icon: 'arrow-left', label: 'Voltar', className: 'ja-back', onClick: () => phone.back() }),
        h('div', { class: 'ja-brand' }, h('span', { class: 'ja-logo', html: BIRD }), h('b', null, 'Jandaia')),
        h('span', { class: 'ja-sp' }),
        kit.iconButton({ icon: 'bell', label: 'Notificações', className: 'ja-back', onClick: () => stub('Notificações') })),
      h('div', { class: 'ja-hello' }, `Olá, ${String(holder).split(/\s+/)[0]}`),
      h('div', { class: 'ja-acct' }, [acc.agency ? `Ag. ${acc.agency}` : '', acc.number ? `Conta ${acc.number}` : ''].filter(Boolean).join(' · ')),
      h('div', { class: 'ja-bal-l' }, h('span', null, 'Saldo em conta'), eye),
      balEl);

    const SHORTCUTS = [
      { label: 'Pix', icon: 'qr-code' },
      { label: 'Pagar', icon: 'scan-line' },
      { label: 'Transferir', icon: 'send-horizontal' },
      { label: 'Cartões', icon: 'credit-card' },
    ];
    const quick = h('nav', { class: 'ja-quick', 'aria-label': 'Atalhos' }, SHORTCUTS.map(s =>
      h('button', { class: 'ja-qk', on: { click: () => stub(s.label) } }, h('span', { class: 'ja-qk-ic' }, icon(s.icon, { size: 24 })), h('span', null, s.label))));

    const limit = acc.limit != null && acc.limit !== ''
      ? h('button', { class: 'ja-limit', on: { click: () => stub('Cartões') } },
        h('span', { class: 'ja-limit-ic' }, icon('credit-card', { size: 20 })),
        h('span', { class: 'ja-limit-t' }, h('b', null, 'Limite disponível'), h('small', null, 'Cartão de crédito Jandaia')),
        h('span', { class: 'ja-limit-v' }, time.money(acc.limit)))
      : null;

    /* ----- extrato ----- */
    const listEl = h('div', { class: 'ja-list' });
    let filter = 'all', query = '';
    const chipsEl = kit.chips({ items: [{ id: 'all', label: 'Tudo' }, { id: 'in', label: 'Entradas' }, { id: 'out', label: 'Saídas' }], active: 'all', onChange: (id) => { filter = id; draw(); } });
    chipsEl.classList.add('ja-chips');

    const row = (t) => {
      const T = typeOf(t);
      const inc = T.sign > 0;
      const cls = `ja-row ${inc ? 'in' : 'out'} ${T.dev ? 'dev' : ''} ${T.credit ? 'cc' : ''} ${T.kind === 'fee' ? 'fee' : ''}`;
      const val = T.credit ? `R$ ${nf(t.amount)}` : time.money(T.sign * Math.abs(Number(t.amount) || 0), { sign: true });
      return h('button', { class: cls, dataset: { id: t.id }, on: { click: () => openReceipt(t) } },
        h('span', { class: 'ja-ic' }, icon(T.icon, { size: 20 })),
        h('span', { class: 'ja-main' },
          h('span', { class: 'ja-t' }, T.label),
          h('span', { class: 'ja-p' }, partyName(t)),
          t.description ? h('span', { class: 'ja-d' }, t.description) : null),
        h('span', { class: 'ja-val' }, h('b', null, val), h('small', null, T.credit ? `Fatura · ${time.hhmm(t.at)}` : time.hhmm(t.at))));
    };

    function draw() {
      listEl.replaceChildren();
      const needle = fold(query).trim();
      const items = txs().filter(t => {
        const T = typeOf(t);
        if (filter === 'in' && T.sign < 0) return false;
        if (filter === 'out' && T.sign > 0) return false;
        if (!needle) return true;
        return fold(`${t.party?.name || ''} ${t.description || ''} ${t.category || ''} ${T.label} ${nf(t.amount)}`).includes(needle);
      });
      if (!items.length) { listEl.appendChild(kit.empty({ icon: 'receipt', title: 'Nada encontrado', text: needle ? 'Nenhuma movimentação corresponde à busca.' : 'Sem movimentações neste filtro.' })); return; }
      let last = '';
      let grp = null;
      for (const t of items) {
        const day = time.ymd(t.at);
        if (day !== last) {
          last = day;
          listEl.appendChild(h('h3', { class: 'ja-day' }, dayTitle(t.at, NOW)));
          grp = h('div', { class: 'ja-grp' });
          listEl.appendChild(grp);
        }
        grp.appendChild(row(t));
      }
    }

    /* ----- subtela: comprovante ----- */
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
          body.appendChild(kit.appBar({ title: 'Comprovante', actions: [{ icon: 'share-2', label: 'Compartilhar', onClick: () => stub('Compartilhar') }] }));
          body.appendChild(h('div', { class: 'ja-rwrap' },
            h('div', { class: 'ja-ticket-shadow' }, ticket(t)),
            h('div', { class: 'ja-pinrow' }, kit.pinButton({ key: 'jandaia:tx:' + t.id, label: `${T.label} — ${partyName(t)}`, app: 'jandaia', detail: `R$ ${nf(t.amount)} · ${time.dateBR(t.at)} ${time.hhmm(t.at)}` }))));
        },
      });
    }

    function ticket(t) {
      const T = typeOf(t);
      const kv = (k, v, cls = '') => (v === undefined || v === null || v === '' ? null : h('div', { class: `ja-kv ${cls}` }, h('span', null, k), h('b', null, v)));
      const me = { name: holder, doc: acc.doc ? maskDoc(acc.doc) : '', bank: 'Jandaia', extra: [acc.agency ? `Ag. ${acc.agency}` : '', acc.number ? `Conta ${acc.number}` : ''].filter(Boolean).join(' · ') };
      const other = t.party || {};
      const person = (title, p, { me: mine, pix } = {}) => h('section', { class: 'ja-blk' },
        h('h4', null, title),
        h('div', { class: 'ja-nm' }, p.name || '—'),
        kv(docLabel(p.doc), maskDoc(p.doc)),
        kv('Instituição', p.bank),
        mine ? kv('Agência e conta', p.extra) : null,
        !mine && pix ? kv('Chave Pix', fmtKey(p.key)) : null);

      const isPix = T.kind === 'pix';
      const blocks = [];
      if (isPix) {
        if (T.recv) { blocks.push(person('De', other, { pix: true }), person('Para', me, { me: true })); }
        else { blocks.push(person('Para', other, { pix: true }), person('De', me, { me: true })); }
      } else if (T.kind === 'card') {
        blocks.push(person('Estabelecimento', other), h('section', { class: 'ja-blk' }, h('h4', null, 'Pago com'), h('div', { class: 'ja-nm' }, T.credit ? 'Cartão de crédito Jandaia' : 'Cartão de débito Jandaia'), kv('Titular', holder)));
      } else if (T.kind === 'boleto') {
        blocks.push(person('Beneficiário', other), person('Pagador', me, { me: true }));
      } else {
        blocks.push(h('section', { class: 'ja-blk' }, h('h4', null, 'Cobrado por'), h('div', { class: 'ja-nm' }, partyName(t))), person('Conta debitada', me, { me: true }));
      }

      const orig = original(t);
      const ids = [];
      if (isPix) {
        ids.push(idBox(T.dev ? 'ID da devolução' : 'ID da transação (E2E)', e2e(t, T.dev ? 'D' : 'E')));
        if (orig) ids.push(idBox('ID do Pix original (E2E)', e2e(orig, 'E'), `${time.dateBR(orig.at)} · ${time.hhmm(orig.at)}`));
      } else ids.push(idBox('Código de autenticação', authCode(t)));

      const kind = T.dev ? 'Devolução de Pix' : isPix ? 'Pix' : T.kind === 'card' ? (T.credit ? 'Cartão de crédito' : 'Cartão de débito') : T.kind === 'boleto' ? 'Pagamento de boleto' : 'Tarifa';
      return h('article', { class: 'ja-ticket' },
        h('header', { class: 'ja-th' }, h('span', { class: 'ja-logo', html: BIRD }), h('b', null, 'Jandaia'), h('span', { class: 'ja-sp' }), h('small', null, 'Comprovante')),
        h('div', { class: 'ja-tb' },
          h('div', { class: 'ja-tstat' }, h('span', { class: 'ja-ok' }, icon('check', { size: 18, stroke: 2.6 })), h('div', null, h('b', null, T.title), h('small', null, T.credit ? 'Lançada na fatura' : 'Concluído'))),
          h('div', { class: 'ja-tamt' }, h('span', null, 'R$'), nf(t.amount)),
          h('div', { class: 'ja-twhen' }, `${cap(time.weekdayLong(t.at))}, ${time.dateLong(t.at)}`, h('br'), `às ${clock(t)}`),
          h('hr', { class: 'ja-dash' }),
          blocks,
          h('hr', { class: 'ja-dash' }),
          h('div', { class: 'ja-kvs' },
            kv('Tipo', kind),
            kv(isPix ? 'Mensagem' : 'Descrição', t.description),
            kv('Categoria', t.category)),
          h('hr', { class: 'ja-dash' }),
          ids,
          h('p', { class: 'ja-fine' }, 'Comprovante gerado pelo app Jandaia. Guarde-o para conferência.')));
    }

    function idBox(label, value, sub) {
      return h('div', { class: 'ja-id' },
        h('span', null, label),
        h('code', null, value),
        sub ? h('em', null, sub) : null,
        h('button', { class: 'ja-copy', 'aria-label': `Copiar ${label}`, on: { click: async () => { try { await navigator.clipboard.writeText(value); } catch (e) { /* sem permissão de área de transferência */ } phone.toast('Código copiado', { icon: 'copy' }); } } }, icon('copy', { size: 16 })));
    }

    /* ----- montagem ----- */
    el.append(...[hero, quick, limit,
      h('section', { class: 'ja-ext' },
        h('div', { class: 'ja-ext-h' }, h('h2', null, 'Extrato')),
        kit.search({ placeholder: 'Pesquisar no extrato', onInput: (v) => { query = v; draw(); } }),
        chipsEl, listEl)].filter(Boolean));
    draw();

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
        text: [p.name, t.description, t.category, T.label, `R$ ${nf(t.amount)}`, p.doc, p.key].filter(Boolean).join(' '),
        params: { tx: t.id },
        at: t.at,
      };
    });
  },
};
