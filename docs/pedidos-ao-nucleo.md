
## Equipe Comunicação (Papo, Mensagens, Telefone)

Todos têm contorno local; nada bloqueia o jogo. Em ordem de importância:

1. **`kit.imageViewer` fixa sempre `app: 'galeria'`** no botão "Fixar no Quadro" (js/ui/kit.js, `pinButton({ ..., app: 'galeria' })`). Mídia vinda do Papo (`key: 'papo:media:<id>'`) vai para o Quadro com app errado, e o clique no pino abriria a Galeria. Pedido: usar `it.app || 'galeria'` (o Papo já passa `app: 'papo'` em cada item, sem efeito hoje).
2. **`kit.menu` só alinha ao canto direito da âncora e não corrige borda/altura.** O Papo reposiciona o menu depois de criado (`placeMenu` em papo.js, mexe em `left/right/top` do último `.k-menu`). Pedido: opção `{ align: 'left'|'right', flip: true }` e limitar à área do telefone.
3. **`onSee` dos itens de dados não é aplicado pelo núcleo.** Os três apps chamam `game.flags(item.onSee)` ao exibir mensagem/conversa/correio de voz. Se `game.see` passar a cuidar disso, avisar para remover a chamada duplicada (inofensiva).
4. **`kit.img` força `loading="lazy"`.** Nas conversas do Papo isso atrasa a rolagem automática até o fim; o Papo troca para `eager` localmente. Pedido: aceitar `loading` em `kit.img`.
5. **`.ic { display: block }` (phone.css)** obriga a sobrescrever ícones inline (prévia de conversa, texto de chamada) em cada CSS de app. Pedido: classe utilitária `.ic.inline` ou `display: inline-block` com `vertical-align`.
6. **`kit.tabs` não atualiza `badge` depois de criado.** O Telefone lê o badge da Caixa postal por getter a cada redesenho e troca o nó na mão ao ouvir uma mensagem. Pedido: `tabs.setBadge(id, n)`.

## Equipe Mídia e Lugares (Galeria, Câmera, Rotas, Lume)

Todos têm contorno local; nada bloqueia o jogo. Em ordem de importância:

1. **`kit.imageViewer` fixa sempre `app: 'galeria'`** no "Fixar no Quadro" (mesmo pedido da Comunicação). Os posts do Lume abrem o visualizador com `key: 'lume:post:<id>'` e o pino leva à Galeria. Pedido: usar `it.app || 'galeria'` (o Lume já poderá passar `app: 'lume'` por item). Nas telas do próprio Lume uso botões de pino locais com `app: 'lume'`.
2. **`onSee` dos itens não é aplicado por `game.see`.** Galeria (`galeria:photo:<id>`), Rotas (dia, última localização) e Lume (post, perfil, destaque, DM, recuperação) chamam `game.flags(item.onSee)` ao exibir. Se o núcleo passar a cuidar disso, avisar: a chamada duplicada é inofensiva.
3. **`phone._mountModal` / `_popModal` são "privados" (underscore), mas o Lume depende deles** para o visualizador de destaques em tela cheia (precisa ficar acima das telas e abaixo da barra de status: `z-index: 29`). Pedido: expor `phone.modal(el, close)` público e documentar a camada (status 30, sheets 40, viewer 42, toast 60).
4. **`.ic { display: block }`**: ícones inline (rótulo de lugar no post do Lume, linhas de detalhe em Rotas) precisam de override em cada CSS. Pedido: utilitário `.ic.inline` (mesmo pedido da Comunicação).
5. **`kit.img` sempre escreve `aspect-ratio` inline quando recebe `ratio`.** Para preencher miniaturas/cards uso `aspect-ratio: auto !important` nos CSS. Pedido: opção `fill: true` (posiciona `inset: 0`) ou `ratio: null` sem estilo.
6. **Mapa (Rotas) depende de tiles remotos** (`https://{s}.basemaps.cartocdn.com/dark_all/...`). Sem rede, o app cai numa grade escura offline com marcadores e trajetos (aviso "mapa base indisponível"). Se houver CSP no deploy, liberar `img-src https://*.basemaps.cartocdn.com`.
7. **Pasta Segura**: o app chama `game.verify('pasta', v)` e escuta `bus.on('flag')` para `cap3` e `pasta_aberta`. Se `verify` ficar assíncrono ou mudar de nome, avisar.

## Equipe Utilitários 1 (Correio, Navegador, Jandaia, Arquivos, Notas, Agenda)

Todos têm contorno local; nada bloqueia o jogo. Em ordem de importância:

1. **`h()` (js/core/dom.js) não aplica variáveis CSS em `style` como objeto.** `Object.assign(el.style, { '--c': x })` não faz nada (conferido no Chromium: `getPropertyValue('--c')` volta vazio; só `cssText`/`setProperty` funcionam). Papo (`pm-quote`, `pm-who`) e Telefone (`td-hero`) passam `style: { '--c': ... }` e ficam sem a cor. Pedido: para chaves que começam com `--`, usar `el.style.setProperty(k, v)`. Contorno nos meus seis apps: `style` como string (`'--ft:#ef6a5f'`).
2. **`phone._mountModal` / `_popModal` são "privados".** O Correio monta a gaveta de pastas por eles (overlay sobre o app, `z-index: 40`). Mesmo pedido de `phone.modal(el, close)` público. Contorno: se `_mountModal` não existir, a gaveta é anexada à tela do app.
3. **`onSee` dos itens não é aplicado por `game.see`.** Arquivos, Correio, Navegador, Jandaia, Notas e Agenda chamam `game.flags(item.onSee)` ao exibir o item (mesmo pedido). Se o núcleo passar a cuidar disso, avisar: a chamada duplicada é inofensiva.
4. **Pasta Segura (Arquivos):** usa `await game.verify('pasta', v)` e escuta `bus.on('flag')` para `cap3`/`pasta_aberta` (mesmo aviso da equipe Mídia e Lugares).
5. **E-mail de alerta "agora" (Correio):** `seguranca-login` (ou qualquer e-mail com `live: true`) é tratado como "agora" e fixado no topo da lista, porque o `at` fixo do dado não acompanha o relógio do presente. Se o núcleo preferir outro mecanismo, avisar.

## Equipe Utilitários 2 (Gravador, Pulso, Bora, Configurações, Relógio, Clima)

Todos têm contorno local; nada bloqueia o jogo. Em ordem de importância:

1. **`.side` é uma classe global em css/base.css (linhas ~96-128: painel lateral com `visibility: hidden` e `position: fixed` no mobile).** Qualquer app que use `class="side"` some ou sai do lugar (a coluna de estatísticas do anel de passos do Pulso desapareceu até eu renomear). Como todos os CSS são globais, vale escopar (`.layout > .side` ou `.inv-side`) e registrar na ARQUITETURA que classes de app levam prefixo. Contorno: todas as minhas classes têm prefixo (`gv-`, `pl-`, `bo-`, `cf-`, `rl-`, `cl-`); rodei um script que cruza os seletores globais com as classes dos meus apps e só esse caso apareceu.
2. **`.ic { display: block }`** (mesmo pedido das outras equipes): ícones inline no Pulso e no Clima (gota, vento nas horas) precisam de override local.
3. **Bora (Leaflet) depende de tiles remotos** (`basemaps.cartocdn.com`, mesmo caso do mapa das Rotas). Sem rede o mapa mostra fundo escuro com ruas desenhadas e a rota em SVG; se houver CSP no deploy, liberar `img-src https://*.basemaps.cartocdn.com`.
4. **`kit.toggle` com `disabled` perde a cor de destaque** (opacidade .5 em `.k-toggle[disabled]`). Nos apps somente leitura (Configurações, Relógio) sobrescrevo a opacidade e a cor por app; seria útil uma variante `readonly` que mantenha o estado visível.
