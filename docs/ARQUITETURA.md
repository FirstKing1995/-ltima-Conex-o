# Última Conexão — Arquitetura e contratos

Jogo web estático (HTML/CSS/JS puro, ES modules, sem build) publicado no GitHub Pages. Backend opcional em Google Apps Script (planilha). Tudo em **português do Brasil**.

> Leia este arquivo inteiro antes de mexer no código. Ele é o contrato entre as partes do jogo.

## 1. Regras gerais
- **Sem framework, sem build, sem CDN.** Tudo local (fontes em `assets/fonts`, Leaflet em `vendor/leaflet`). O jogo tem que rodar abrindo via servidor estático simples (`python3 -m http.server`).
- ES modules (`<script type="module">`). Imports com caminho relativo e extensão `.js`.
- Código em inglês ou português — **textos visíveis sempre em pt-BR**.
- Mobile first. Tem que funcionar em celular (360×740) e desktop (1440×900).
- **Nunca** use `alert/confirm/prompt` nativos. Use `phone.dialog/prompt/toast`.
- Imagens podem faltar durante o desenvolvimento: use sempre `kit.img()` (mostra placeholder elegante se der erro).
- Acessibilidade básica: botões são `<button>`, `aria-label` em botões só com ícone, contraste AA.
- Não edite arquivos que não são seus (ver "Donos dos arquivos"). Se precisar de algo do núcleo, anote em `docs/pedidos-ao-nucleo.md` e faça um contorno local.

## 2. Estrutura de pastas
```
index.html
css/base.css            tokens, palco (layout desktop/mobile), fontes
css/phone.css           moldura, barra de status, telas, componentes do kit
css/overlay.css         título, intro, ECO, Quadro, final (agente de recursos)
css/apps/<app>.css      estilos de cada app (dono: agente do app)
js/config.js            API_URL, CASE_ID, DEBUG
js/main.js              boot
js/core/                dom, bus, state, time, store, hash, sfx, api, search
js/ui/                  kit.js (componentes), icons.js (Lucide)
js/phone/               phone.js (shell), launcher.js, lock.js, shade.js
js/game/                game.js (fachada), progress.js, analysis.js, eco.js, board.js, puzzles.js
js/screens/             title.js, intro.js, ending.js
js/apps/index.js        registro dos apps
js/apps/<app>.js        cada app
data/caso01/*.js        conteúdo do caso (ver seção 6)
assets/caso01/img/      imagens do caso
assets/caso01/avatars/  avatares (svg)
assets/fonts/           fontes
vendor/leaflet/         mapa
backend/Code.gs         API (Apps Script)
tools/                  scripts de apoio (node)
docs/                   documentação pública (sem spoilers)
privado/                NÃO versionado (bíblia, respostas)
```

## 3. Palco e telas
- `#stage` contém: `#eco-panel` (canal do hacker ECO), `#phone` (o celular de Iara) e `#board-panel` (Quadro de investigação).
- **Desktop ≥ 1180px:** três colunas: ECO (360px) | celular (moldura ~400×860) | Quadro (420px).
- **760–1179px:** celular centralizado; ECO e Quadro viram gavetas laterais abertas pela barra do investigador.
- **< 760px (celular):** o celular de Iara ocupa a tela inteira, abaixo de uma **barra do investigador** fixa (44px) com: botão ECO (badge de não lidas), Lupa (Modo Análise), Quadro, menu (⋯). ECO e Quadro abrem como folhas por cima.
- Telas fora do celular: `title` (menu), `intro` (prólogo), `ending` (final). Ficam em `#overlay-root`.

## 4. Núcleo (js/core) — APIs

### dom.js
- `h(tag, props?, ...children)` → Element. `props`: `class`, `style` (obj ou string), `on: {click: fn}`, `dataset`, atributos. Children: string, Node, array, null/false (ignorados).
- `$(sel, root?)`, `$$(sel, root?)`, `clear(el)`, `esc(text)`.

### bus.js
- `bus.on(evt, fn)` → unsubscribe; `bus.emit(evt, data)`; `bus.once(evt, fn)`.
- Eventos: `flag` {name}, `seen` {key}, `term` {id}, `pin` {key}, `objective` {id}, `solve` {id}, `chapter` {n}, `notify` {...}, `analysis` {on}, `app:open` {id}, `app:close`, `eco:unread` {n}, `state:save`.

### state.js
```js
import { state, save, load, reset, setFlag, hasFlag, evalReq, markSeen, isSeen } from './core/state.js'
```
- `state` (objeto vivo): `{ v, caseId, player:{id,token,codigo,apelido}, startedAt, playMs, flags:{}, terms:{}, pins:[], answers:{}, solved:{}, objectives:{}, chapter, hints:{}, wrong, reportAttempts, finalResult, eco:{log:[], fired:{}}, settings:{sound,textSize,analysis}, apps:{} }`
- `state.apps[appId]` é livre para cada app guardar preferências (ex.: aba ativa).
- `setFlag(name)` — idempotente; emite `flag`. `hasFlag(name)`.
- `evalReq(expr)` — expressão de flags: `"a"`, `"!a"`, `"a && b"`, `"a || b && c"` (sem parênteses; `&&` tem precedência). `undefined`/vazio → `true`.
- `markSeen(key)` → seta a flag `seen:<key>` e emite `seen`.
- `save()` (debounce, localStorage `uc01_save`), `load()`, `reset()`.

### time.js
- Datas no conteúdo são strings locais **`"2026-10-10T23:46"`** (sem fuso; horário de Fortaleza). Segundos opcionais `"2026-10-10T23:41:08"`.
- `MIRROR_NOW = "2026-10-10T23:47"`, `PRESENT_NOW = "2026-10-13T23:12"`.
- `parse(s)` → Date; `hhmm(s)` "23:46"; `hhmmss(s)`; `dayLabel(s)` "sáb, 10 de out."; `dateBR(s)` "10/10/2026"; `relative(s, now=MIRROR_NOW)` → "23:46" (mesmo dia) | "ontem" | "qui" (até 6 dias) | "08/10"; `chatDay(s)` → "Hoje"/"Ontem"/"quinta-feira"/"8 de outubro" (relativo ao `now` passado); `duration(sec)` "4:12"; `money(n)` "R$ 1.234,56".

### store.js
- `CASE` (todo o conteúdo carregado de `data/caso01/index.js`).
- `contact(id)`, `contactByPhone(phone)` (compara só dígitos), `displayName(idOrPhone)`, `avatarOf(idOrPhone)` → `{src?, name, color}`, `asset(path)` (resolve caminho relativo à raiz), `fmtPhone(digits)`.

### hash.js
- `normalize(s)` (minúsculo, sem acentos, sem espaços/pontuação) e `sha256(s)` → hex (Web Crypto).
- `check(answerHash, salt, value)` → Promise<boolean>; o hash é `sha256(salt + '|' + normalize(value))`.

### sfx.js
- `sfx.play(name)` — sons sintetizados por WebAudio (sem arquivos): `tap`, `notify`, `eco`, `unlock`, `error`, `collect`, `solve`, `glitch`, `type`, `send`. Respeita `state.settings.sound`.

### api.js (planilha)
- `api.enabled` (true se `config.API_URL`). Métodos async que **nunca lançam** (retornam `null` em falha): `register(apelido, extra)`, `save()`, `load()`, `restore(codigo)`, `event(tipo, dado)` (fila + envio em lote a cada 15 s), `report(payload)`, `ranking(limit)`, `stats()`, `config()`.
- POST com `Content-Type: text/plain;charset=utf-8` e corpo JSON (evita preflight). GET com `?action=...`.

### search.js
- `search.index()` monta índice de todo o conteúdo visível; `search.query(text)` → `[{app, title, snippet, open: {app, params}}]`. Cada app pode registrar seu indexador: `search.register(appId, fn)` onde `fn()` retorna `[{title, text, params}]`.

## 5. Celular (js/phone) e kit (js/ui)

### phone.js
```js
import { phone } from '../phone/phone.js'
```
- `phone.mount(el)`; `phone.lock()`; `phone.unlock()`; `phone.home()`.
- `phone.open(appId, params?)` — abre app (anima). `phone.back()` — volta uma tela; na raiz do app vai para a home. O botão voltar do navegador/gesto também chama `back()`.
- `phone.push({ title?, className?, render(el, nav) })` — empilha uma subtela dentro do app atual. `nav` = `{ push, back, replace, setTitle }`.
- `phone.toast(text, {icon?, ms?})`; `phone.dialog({title, text, actions:[{label, value, primary, danger}]})` → Promise<value>; `phone.prompt({title, text, placeholder, type:'text'|'password'|'number', confirmLabel, check: async v => true|false|'mensagem de erro'})` → Promise<string|null>; `phone.sheet({title, render(el, close)})` → Promise.
- `phone.notify({icon, app, title, text, onTap})` — notificação heads-up (usada pelo ECO e por eventos do presente).
- `phone.current()` → `{appId, params}`.

### Contrato de um app (js/apps/<id>.js)
```js
export default {
  id: 'papo',
  title: 'Papo',
  cloud: true,               // true = dados do servidor (mostra até terça); false = aparelho (até sáb 23:47)
  render(ctx) { /* desenha a tela raiz dentro de ctx.el */ },
  onOpen(ctx) {},            // opcional
  search() { return [{ title, text, params }] } // opcional: itens para a busca global
}
```
`ctx = { el, params, phone, nav, game, store, kit, h, time, icon, data }` onde `data = CASE.<chave do app>`.
- O app desenha com `kit` + `h`. Para subtelas: `ctx.nav.push({ title, render(el, nav) {...} })`.
- O app **avisa o jogo** quando algo importante é visto: `game.see('<chave>')` (ver seção 7) — ao abrir uma conversa, foto, e-mail, arquivo, gravação, dia do mapa, tela de ajustes etc.
- Todo item com `req` só aparece se `game.req(item)` for verdadeiro.
- Itens podem ser fixados no Quadro: `kit.pinButton({ key, label, app, detail })`.
- Textos longos (mensagens, e-mails, notas, legendas, transcrições) recebem a classe `.txt` para o Modo Análise achar os termos (o núcleo aplica sozinho dentro do celular).

### kit.js (componentes)
Todos retornam `Element`:
- `appBar({ title, subtitle, back=true, onBack, avatar, actions:[{icon,label,onClick}], color, transparent })`
- `list(children)`, `listItem({ avatar, icon, iconColor, title, subtitle, meta, badge, trailing, onClick, dim, unread, className })`
- `avatar({ src, name, color, size=40, ring })` — imagem ou iniciais coloridas.
- `img(src, { alt, className, ratio, onClick })` — com placeholder se faltar.
- `tabs({ items:[{id,label,badge}], active, onChange })`, `chips({ items, active, onChange })`, `chip(...)`
- `search({ placeholder, onInput })`, `empty({ icon, title, text })`, `sectionTitle(text)`, `divider()`
- `kv(rows:[[label, value]])` — tabela de detalhes/metadados.
- `button({ label, icon, variant:'filled'|'tonal'|'text'|'danger', onClick })`, `iconButton({ icon, label, onClick })`, `fab({icon,label,onClick})`, `toggle({checked,onChange,disabled})`, `badge(n)`
- `imageViewer(images:[{src, title, subtitle, info:[[k,v]], key}], index)` — tela cheia com zoom (pinça/scroll/duplo toque), botão "Detalhes" (metadados) e "Fixar no Quadro".
- `audioPlayer({ title, at, duration, transcript:[{t:"02:09", who, text, kind:'speech'|'sfx'|'gap'}], key })` — player simulado (sem áudio real): barra de progresso, velocidade, transcrição que destaca a linha atual; tocar marca `game.see(key)`.
- `pinButton({ key, label, app, detail })` — botão "📌 Fixar no Quadro"/"Fixado".
- `menu(anchorEl, items:[{label, icon, onClick, danger}])`
- `statusDot(kind)` etc.

### Ícones
`icon(name, {size, stroke})` de `js/ui/icons.js` (Lucide). Nomes em `ICONS` (ex.: `phone`, `message-circle`, `map-pin`, `camera`, `lock`, `fingerprint`, `trash-2`, `pin`, `scan-search`...).

## 6. Conteúdo do caso — `data/caso01/`
Cada arquivo faz `export default { ... }`. `index.js` junta tudo em `CASE`. **Datas no formato `"2026-10-10T23:46"`.** IDs únicos (kebab-case). Telefones como string só com dígitos e DDI/DDD: `"5585987412290"`. Campo `req` opcional em qualquer item (expressão de flags). Campo `onSee` opcional (lista de flags extras ao ver).

### meta.js
```js
{ title, subtitle, victim:{ name, phone, email, handle }, playerPhone:'5585988124417',
  mirrorNow:'2026-10-10T23:47', presentNow:'2026-10-13T23:12',
  device:{ model:'Nimbus N9', android:'16', battery:41, carrier:'Vivo'?? (use fictícia "Litoral Móvel") },
  wallpapers:{ lock:'assets/caso01/img/wallpaper_lock.jpg', home:'assets/caso01/img/wallpaper_home.jpg' },
  lockScreen:{ notifications:[{app, title, text, at}], emergency:[[k,v]] },
  credits:[...] }
```

### contacts.js
```js
{ contacts: [ { id:'duda', name:'Duda 🌻', fullName:'Maria Eduarda Sampaio Andrade', phones:['5588997120384'],
  email:'', avatar:'assets/caso01/avatars/duda.svg', color:'#d9a441', relation:'amiga', birthday:'05-04',
  notes:'', blocked:false, favorite:true, company:'Colheita Capital' } ] }
```
`id: 'iara'` é a dona do celular. Números não salvos não têm contato (o app mostra o número formatado).

### papo.js (mensageiro)
```js
{ chats: [ {
  id:'equipe-evento', type:'group'|'direct', contact:'duda' /*direct*/, phone:'5588996451209' /*direct sem contato*/,
  name:'Equipe Noite da Colheita 🌻' /*group*/, members:['duda','lari','iara', ...], avatar, 
  pinned:false, archived:false, blocked:false, muted:false, unread:0, lastSeen:'2026-10-10T23:12' /*do contato*/,
  messages: [ {
    id:'eq-2346', from:'iara'|'<contactId>'|'<telefone>', at:'2026-10-10T23:46',
    kind:'text'|'image'|'video'|'audio'|'doc'|'sticker'|'location'|'deleted'|'system'|'call',
    text:'...', media:'assets/...jpg', caption:'', duration:12 /*seg, audio/video*/,
    transcript:'...' /*audio*/, doc:{ name, size, file:'<id em arquivos.js>' },
    status:'read'|'delivered'|'sent'|'pending' /*só para mensagens da iara ou pendentes*/,
    pending:true /*mensagem enviada A ela depois das 23:47 — ✓ cinza "não entregue"*/,
    deletedAt:'2026-10-10T23:45' /*kind deleted*/, forwarded:false, replyTo:'<msgId>', reactions:['🙏'], req, onSee
  } ] } ] }
```

### sms.js — `{ threads:[{ id, phone, name?, messages:[{id, from:'iara'|'them', at, text, status?, undelivered?}] }] }`
### calls.js — `{ calls:[{ id, phone, contact?, at, dir:'in'|'out'|'missed'|'blocked', duration /*seg*/, via:'phone'|'papo' }], voicemail:[{ id, phone, contact?, at, duration, transcript }] }`
### gallery.js
```js
{ albums:[{ id:'camera', name:'Câmera', icon:'camera', locked:false }...,{ id:'segura', name:'Pasta Segura', locked:true, puzzle:'pasta' },{ id:'lixeira', name:'Lixeira' }],
  photos:[{ id:'mirante-cerca', src:'assets/caso01/img/mirante_cerca.jpg', album:'camera', at:'2026-10-10T18:19',
    w:1440, h:1080, place:{ name:'Mirante da Pedra Lisa', lat:-4.1632, lng:-40.6860 }, device:'Nimbus N9',
    desc:'texto alternativo/descrição do que a foto mostra', caption:'' , deletedAt?, video?:{duration}, req, onSee }],
  memories:[{ id, title:'Há 17 anos', photo:'pipoca-2009' }] }
```
Arquivos-texto da Pasta Segura (LEIA-ME, planilhas) ficam em `arquivos.js` com `folder:'segura'`.

### rotas.js
```js
{ places:[{ id, name, address, lat, lng, kind:'casa'|'trabalho'|'cafe'|'mirante'|'evento'|'rodoviaria'|'outro' }],
  days:[{ date:'2026-10-10', summary:'Guaraciaba do Norte', segments:[
     { type:'visit', place:'galpao', start:'2026-10-10T18:37', end:'2026-10-10T23:29', note? },
     { type:'move', mode:'walk'|'car'|'bus'|'van'|'ride', from:'galpao', to:'mirante', start, end, km:0.42, path:[[lat,lng],...] } ] }],
  last:{ at:'2026-10-10T23:47', lat, lng, accuracy:12, place:'mirante', label:'Última conexão' } }
```
### lume.js (rede social)
```js
{ me:'iarafontenele.foto',
  profiles:[{ handle, name, bio, avatar, followers, following, posts:N?, verified, private, fake, recovery:{ phone:'(88) 9••••-••56', email:'r•••••••••o@correio.app' } }],
  posts:[{ id, author:'handle', at, media:['assets/...'], caption, likes, comments:[{ id, author, at, text, likes }], kind:'post'|'live', live:{ start, end, transcript:[{t:'23:38:12', who, text}], comments:[{t, author, text}] }, req }],
  stories:[{ id, author, at, media, text, highlight:'Noite da Colheita', repostOf:{ author, at } }],
  highlights:[{ id, author, title, cover, stories:['id'...] }],
  dms:[{ id, with:'handle', messages:[{ id, from:'me'|'them', at, text }] }],
  notifications:[{ at, text, actor }] }
```
### correio.js — `{ account:'iara.fontenele@correio.app', emails:[{ id, folder:'inbox'|'sent'|'spam'|'trash'|'promo', from:{name,email}, to:[...], at, subject, body /*texto com \n; links em [texto](url)*/, attachments:[{ name, file:'<id arquivos>' }], read, starred, important, req }] }`
### navegador.js — `{ tabs:[{ id, title, url, page:{ title, blocks:[{type:'h1'|'p'|'li'|'quote'|'img', text|src}] } }], history:[{ id, at, title, url, query? }], bookmarks:[...] }`
### jandaia.js (banco) — `{ account:{ holder, agency, number, balance, limit }, pixKeys:[...], transactions:[{ id, at, type:'pix_in'|'pix_out'|'devolucao_out'|'devolucao_in'|'debito'|'credito'|'boleto'|'tarifa', amount /*positivo*/, party:{ name, doc, bank, key }, description, category, receipt:true }] }`
### notas.js — `{ notes:[{ id, title, body, created, edited, pinned, color, checklist:[{text,done}], req }] }`
### agenda.js — `{ events:[{ id, title, start, end, allDay, place, notes, color, repeat:'yearly'? }] }`
### relogio.js — `{ alarms:[{ id, time:'04:40', days:['dom'], label, on }], timers:[], worldClocks:[] }`
### gravador.js — `{ recordings:[{ id, name, at, duration, folder:'all'|'lixeira'|'segura', deletedAt?, transcript:[{t:'02:09', who:'IARA'|'VOZ FEMININA'|'CAIO'|..., text, kind:'speech'|'sfx'|'gap'}], req }] }`
### pulso.js — `{ device:{ name:'Pulso Band 4', lastSync:'2026-10-10T23:41:31' }, steps:[{date, value}], sleep:[{date, hours, quality}], heart:{ '2026-10-10':[['22:00',84],...] }, events:[{ at, kind:'fall'|'disconnect'|'high-hr'|..., title, text }] }`
### bora.js (corridas) — `{ trips:[{ id, at, from:{name,lat,lng}, to:{name,lat,lng}, driver:{name, car, plate, rating}, price, minutes, km, payment }] }`
### config.js (Configurações) — `{ wifi:{ saved:[{ssid, lastConnected, security}], log:[{at, ssid, event:'conectado'|'desconectado'}] }, bluetooth:{ devices:[{name, kind, lastConnected, connected}], log:[{at, device, event}] }, security:{ unlockLog:[{at, method:'Digital'|'PIN'|'Padrão', note?}] }, notifications:{ historyEnabled:true, history:[{at, app, title, text}] }, battery:{ level:41, log:[{at, level, event}] }, accounts:[{ service, email }], devices:[{ name, place, lastActive, current, note }], apps:[{ name, size, lastUsed }], about:[[k,v]] }`
### arquivos.js — `{ files:[{ id, name, folder:'Downloads'|'Documentos'|'segura', type:'pdf'|'xlsx'|'txt'|'docx'|'m4a'|'jpg', size, at, pages:[{ blocks:[{type:'h1'|'h2'|'p'|'li'|'table'|'highlight'|'sign', text, rows }] }], req }] }`
### eco.js (roteiro do ECO) — ver seção 8.
### terms.js, chapters.js, puzzles.js, answers.js, news.js, endings.js — ver seções 8 e 9 (núcleo/autor do caso).

## 7. Chaves "vistas" (game.see) — padrão
`<app>:<tipo>:<id>` — exemplos: `papo:chat:equipe-evento`, `papo:msg:eq-2346`, `galeria:photo:mirante-cerca`, `galeria:album:segura`, `rotas:day:2026-10-10`, `rotas:last`, `pulso:day:2026-10-10`, `lume:profile:visto.por.ultimo`, `lume:recovery:visto.por.ultimo`, `lume:post:<id>`, `lume:highlight:<id>`, `correio:mail:<id>`, `arquivos:file:<id>`, `gravador:rec:<id>`, `config:notif-history`, `config:unlock-log`, `config:battery`, `config:bluetooth`, `config:wifi`, `config:devices`, `jandaia:tx:<id>`, `notas:note:<id>`, `agenda:event:<id>`, `telefone:voicemail:<id>`, `sms:thread:<id>`.
Regra: abrir uma conversa marca a conversa **e todas as mensagens visíveis dela**; abrir uma foto marca a foto; abrir um dia no mapa marca o dia; ver o "último ponto" marca `rotas:last`.

## 8. Jogo (js/game) — fachada `game`
- `game.see(key)`; `game.req(item)`; `game.flag(name)`; `game.has(expr)`.
- `game.pin({key,label,app,detail})`, `game.unpin(key)`, `game.isPinned(key)`.
- `game.collect(termId)`; `game.terms()`.
- `game.verify(puzzleId, value)` → Promise<boolean> (usa `data/caso01/puzzles.js`).
- `game.eco` (painel), `game.board` (Quadro), `game.analysis` (lupa).
- **ECO (`data/caso01/eco.js`):**
```js
{ nodes: { 'intro-1': { msgs:[ 'texto', {text:'...', delay:1200}, {image:'assets/..'} ], choices:[{label:'...', next:'intro-2', flags:['x']}],
            next:'intro-2', input:{ kind:'name', next:'intro-3' }, flags:['...'], actions:[{type:'objective', chapter:1}|{type:'email', id:'...'}|{type:'notify', text}|{type:'openBoard'}|{type:'ending'}] } },
  triggers: [ { when:'seen:papo:chat:voce', node:'r-voce' } ],   // dispara uma vez quando a expressão fica verdadeira
  hints: { '1.1': ['dica sutil', 'dica direta', 'quase a resposta'] } }
```
Placeholders nos textos: `{nome}` = apelido do jogador.
- **Capítulos/objetivos/deduções** em `data/caso01/chapters.js` (autor do caso). Objetivo completa quando `doneWhen` (expressão de flags) é verdadeiro. Dedução = blocos com lacunas `{blank:'t1', cat:'hora'}` (termo) ou `{blank:'c1', choice:['antes','depois']}`; respostas conferidas por hash (`answers.js`).
- **Termos** em `data/caso01/terms.js`: `{ terms:[{ id:'h-2341', label:'23:41', cat:'pessoa'|'lugar'|'hora'|'objeto'|'conceito'|'numero', match:['23:41','23h41'] }] }`. Com a Lupa ligada, o núcleo destaca e o jogador toca para coletar.

## 9. Visual
- Palco do investigador: fundo `#07080a`, texto `#e9e4da`, apagado `#8b8f97`, ouro `#d6b46a`, alerta `#e5484d`. Títulos em **Fraunces** (serifada), terminal em **JetBrains Mono**.
- Celular de Iara: Android escuro estilo Material You, fonte **Roboto Flex**. Superfícies `#111214 / #1a1c20 / #23262b`, texto `#ecebe8`, apagado `#9aa0a6`, acento quente `#f2b880`.
- Cores dos apps (ícone redondo-quadrado): Papo `#1fa37a`, Mensagens `#5b8def`, Telefone `#34c27a`, Galeria `#a78bfa`, Câmera `#6b7280`, Rotas `#3b82f6`, Lume `#f0567a→#ff9f43`, Navegador `#4f9cf9`, Correio `#e25b45`, Jandaia `#1f9d6b` com amarelo `#f2c94c`, Notas `#e9b949`, Agenda `#4c7ef3`, Relógio `#64748b`, Gravador `#f05d3a`, Pulso `#ef4f6c`, Bora `#111` com `#ffd400`, Configurações `#6b7280`, Arquivos `#e0a526`, Clima `#38bdf8`.
- Movimento: transições de 180–260 ms, `ease-out`. Respeitar `prefers-reduced-motion`.
- Nunca copiar marcas reais (WhatsApp, Instagram, Google…). Apps são fictícios com identidade própria.

## 10. Donos dos arquivos (para trabalho em paralelo)
- **Núcleo (Claude Opus):** `index.html`, `css/base.css`, `css/phone.css`, `js/main.js`, `js/config.js`, `js/core/*`, `js/ui/*`, `js/phone/*`, `js/apps/index.js`, `js/game/game.js`, `data/caso01/{index,meta,terms,chapters,puzzles,answers}.js`.
- **Recursos de jogo:** `js/game/{eco,board,analysis,progress}.js`, `js/screens/*`, `css/overlay.css`.
- **Apps:** cada `js/apps/<app>.js` + `css/apps/<app>.css` do seu grupo.
- **Conteúdo:** arquivos de `data/caso01/` do seu grupo.
- **Imagens:** `assets/caso01/img/*`, `assets/caso01/avatars/*`, `tools/images/*`.
