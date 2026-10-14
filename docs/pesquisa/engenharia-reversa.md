# Engenharia reversa do gênero "celular de outra pessoa" — Última Conexão

**Data:** 14/10/2026 · **Escopo:** pesquisa de game design (sem código).
**Método:** 34 consultas (WebSearch/WebFetch), acima das ~25 previstas, para cobrir o item 4. Fato sem marcação foi lido em fonte nesta sessão. **(†)** = conhecimento prévio, não reverificado. **(n/v)** = não verificado. Duas URLs foram bloqueadas por permissão (API de busca do GitHub e a página de licenças do DiceBear); por isso estrelas/licenças de repositórios só constam de páginas efetivamente abertas.

## 0. Resumo executivo

1. O "satalker" é quase certamente **Stalkie · Mobile Detective** (iOS/Android, 4,6★ em 2,9 mil avaliações, com português).
2. O gênero inteiro repete um laço: explorar o celular → coletar pistas → responder/deduzir → destravar mais celular. O que separa os bem avaliados dos mal avaliados é **o que trava o progresso**. Trava por informação (senha, pergunta, dedução) é elogiada. Trava por atrito artificial (minigame, timer, energia, paywall) é a crítica nº 1 em Duskwood, I Am Innocent, Peek a Phone e Stalkie.
3. Nossa vantagem: o enquadramento de **"espelho" forense** (somente leitura, com lacunas e adulterações possíveis) + **deduções por lacunas** (Golden Idol) com **confirmação em blocos de 3** (Obra Dinn).

## 1. Qual é o "satalker"?

| # | Candidato | Evidência | Peso |
|---|---|---|---|
| 1 | **Stalkie · Mobile Detective** (Gregoire Collin / "isdlf"; iOS id6745106241; Android `com.gc.stalki`) | 1º resultado da busca "satalker game phone investigation"; celular falso com mensagens, redes sociais, notas, galeria (fotos apagadas), calendário, Wallet e conteúdo bloqueado; recente (v1.0.8 → 1.3.7); 6 idiomas **incluindo português** | Alto |
| 2 | Peek a Phone (FaintLines) | Mesmo gênero, mas o nome não lembra "stalk" | Médio-baixo |
| 3 | Dead Man's Phone (beta iOS/Android, PocketGamer) | "Found phone investigation", sem "stalk" no nome (n/v) | Baixo |
| 4 | Leaked · Mobile Detective (AppGoblin id6785890577) | Mesmo subtítulo de Stalkie; desenvolvedor não confirmado (n/v) | Baixo |
| — | Stop the Stalker, The Distant Lurker (itch.io), S.T.A.L.K.E.R., "stalkerware" | Só aparecem pelo nome; não parecem ser investigação de celular (n/v) | Descartados |

**Veredito: Stalkie (~75% de confiança).** Teste rápido com o usuário: se ele lembra de "Clonar o celular", de perguntas do caso e de assinatura semanal, é esse. Se for outro título, o restante vale igual (mesmo gênero). Fontes: [App Store](https://apps.apple.com/app/id6745106241), [ScreensDesign](https://screensdesign.com/showcase/stalkie-mobile-detective), [MEmu (pacote Android)](https://www.memuplay.com/how-to-use-com.gc.stalki-on-pc.html).

## 2. Fichas dos jogos

### 2.1 Stalkie · Mobile Detective ([App Store](https://apps.apple.com/app/id6745106241), [ScreensDesign](https://screensdesign.com/showcase/stalkie-mobile-detective))
- **Enquadramento:** você é detetive. A abertura é uma cena de chat (não um tutorial) em que uma cliente (Ep. 1: mulher que suspeita do namorado) pede ajuda; o botão **"Clonar o celular"** leva ao primeiro paywall.
- **Apps:** mensagens, redes sociais, notas, galeria com fotos apagadas, calendário, Wallet, itens bloqueados. "Todo contato pode esconder uma pista".
- **Loop:** explorar o celular ⇄ **overlay de perguntas do caso** (dá objetivo e marca progresso) ⇄ botão de dica sem sair do fluxo. A loja promete "resolver antes que o tempo acabe" e "detectar mentiras".
- **Trava:** as perguntas. Grátis até ~9–10 perguntas (relato de usuários); depois assinatura. As datas dos casos dependem da **data real do aparelho** (fonte de bug).
- **Narrativa:** acervo estático + cena de chat inicial; push não descrito.
- **Monetização:** assinatura (US$ 5,99/semana, 9,99/mês, 22,99/3 meses, 19,99–29,99/ano), sem trial, 2 paywalls (aos 33 s e ~6 min). Anúncios, até dentro dos e-mails do jogo.
- **Elogios:** "drama suculento", entretém. **Críticas:** paywall cedo; **respostas corretas marcadas como erradas** (datas); "lixo de IA"; anúncios necessários para responder; "muitos detalhes imprecisos".
- **Lição:** o Q&A persistente é o análogo do nosso caderno de deduções; alternar celular ↔ perguntas cansa (sugestão de split view).

### 2.2 Peek a Phone ([App Store](https://apps.apple.com/us/app/-/id1628788964))
- **Enquadramento:** missões **semanais autocontidas**: devolver celular perdido, ler mensagens não lidas, ajudar a polícia, interrogar suspeitos, "trocar mensagens com um sequestrador". "Todos são suspeitos", inclusive o cliente.
- **Apps:** liberados ao longo do jogo: grupos, ligações e videochamadas, fotos, vídeos-evidência, e-mails, sites reais, hackers.
- **Puzzles:** "puzzles de texto" e "brain puzzles" para invadir apps; corrida contra o relógio.
- **Narrativa:** chats, ligações e videochamadas; "jogos de texto" com o sequestrador; se há espera em tempo real (n/v).
- **Trava/dicas:** dicas, chaves, moedas e **bateria** são recursos pagos: dicas 10/US$ 2,99 → 80/US$ 12,99; "Recarregar bateria a 100%" US$ 1,99; remover anúncios US$ 4,99; missão premium US$ 1,99.
- **Recepção:** 4,9★ (3,2 mil); sem textos de review acessíveis. Finais e duração (n/v).
- **Lição:** bateria como moeda é tematicamente esperta, mas é pay-to-skip. Usar bateria só como cenário (barra de status).

### 2.3 Duskwood ([App Store](https://apps.apple.com/app/id1479430106), [press kit](https://everbytestudio.com/Press/sheet.php?p=duskwood))
- **Enquadramento:** Hannah some há 72 h; os amigos recebem uma mensagem do celular dela com só um número: o **seu**. Você não tem o celular da vítima; é um estranho num chat, investigando "disfarçado".
- **Loop:** chats em grupo e 1:1 com fotos, vídeos, voz e ligações; escolhas mudam afinidade e rumo; coleta de evidências; **minigames match-3** como progressão; **"Spy Mode"** (ler escondido o chat alheio).
- **Narrativa:** episódios (o 10º e último saiu; [press release](https://gamespress.westeu-v2.propressroom.com/DUSKWOOD-Episode-10---The-Final-Episode-Is-Now-Available)); respostas com atraso e push (†).
- **Dicas/finais:** sistema de dicas (n/v); finais variam pelas escolhas (†).
- **Monetização:** créditos (US$ 1,99–149), Multimedia Pack US$ 12,99, Premium, anúncios. 4,4★ (2,6 mil).
- **Elogios:** suspense, atuação, foto/vídeo, interação, final. **Críticas:** match-3 aleatório com vidas limitadas ("falhar tarde = recomeçar"), querer digitar as próprias falas, começo lento.
- **Lição:** NPC vivo gera apego, mas custa roteiro ramificado e relógio. Copiar o gancho do número e o "Spy Mode", não o chat livre.

### 2.4 I Am Innocent ([App Store](https://apps.apple.com/us/app/-/id1040968153); registros em [Lutris](https://lutris.net/games/i-am-innocent/), [Backloggd](https://backloggd.com/games/i-am-innocent/))
- **Qual é:** o título de peso é o da **Guts United / Long Jaunt** (©2017; mesma casa de "Who Is The Killer"). Não achei homônimo de celular investigativo (n/v); **confirmar com o usuário**.
- **Premissa:** detetive que investiga assassinatos de adolescentes; ligações "realistas", mensageiro, "hackear computador", fotos, documentos; mensagens curtas, "sem grandes parágrafos"; respostas afetam relações; vários finais; "muitos dias de jogo".
- **Trava:** **puzzle de blocos tipo Tetris** + moedas + timer de recarga (US$ 0,99–99,99).
- **Recepção:** 4,2★ (10 mil). Elogios: história, atmosfera, originalidade. Críticas: puzzle repetitivo e "aleatório", "enrolação", pressão por moedas, "esqueci o enredo depois de meses".
- **Lição:** exemplo canônico do erro "minigame sem relação com a trama como trava".

### 2.5 Simulacra 1 e 2 ([review S1](https://www.useapotion.com/2019/12/simulacra-review/), [matéria S2](https://indiegamesplus.com/simulacra-2-investigates-an-unsettling-disappearance-using-the-victims-phone/))
- **S1:** o celular de Anna, sumida há dias, aparece na sua casa; um vídeo mostra Anna presa pedindo que ninguém a procure. Apps: mensagens, redes sociais, namoro, galeria. **Responder aos contatos muda o que eles revelam.** "Puzzles básicos" de lógica; **5 finais**; ~4 h; nota 8/10.
- **S2 (fev/2020; Google Play, App Store, Steam):** influenciadora morta, **três suspeitos**; explora seguidores, círculo social, fotos, conteúdo privado, algum hacking; ramificações; fotos "glitchando" e apps estranhos sugerem sobrenatural.
- **Elogios:** conceito sinistro, imersão ("parece meu celular"), escolhas, tom de terror consistente. **Críticas:** rejogar perde a graça; pensado para toque; "não é dos mais emocionantes".
- **Lição:** o S2 é o análogo mais próximo do nosso (vítima morta + 3 suspeitos). **Glitch de UI** cria clima barato.

### 2.6 Sara Is Missing / SIM ([ModDB](https://www.moddb.com/games/sim), [itch.io](https://saraismissing.itch.io/sim))
- **Premissa:** o celular de Sara, desaparecida, é a única pista (Monsoon Lab, 2016; APK no ModDB e página no itch.io, preço n/v; inspirado em *Replica*; tema de "found footage" e voyeurismo).
- **Apps/mecânicas:** mensagens, notas, e-mails, fotos, vídeos; **arquivos com senha, mensagens ocultas, "dados perdidos" a decifrar**; várias conversas simultâneas; ligações de NPCs e desconhecidos; mídia enviada por NPCs; **assistente simulado do telefone que dá dicas**; digitação como nos apps reais; múltiplos finais e subtramas ocultas.
- **Lição:** dicas **dentro da ficção** e subtramas opcionais.

### 2.7 A Normal Lost Phone e Another Lost Phone: Laura's Story ([Wikipedia](https://en.wikipedia.org/wiki/A_Normal_Lost_Phone), [Steam](https://store.steampowered.com/app/689910/Another_Lost_Phone_Lauras_Story/))
- **ANLP (jan/2017, Accidental Queens, Unity, nascido numa game jam):** celular de Sam (cidade fictícia Melren); você descobre que Sam é Samira, mulher trans. **Puzzle-padrão:** pista de um app destrava outro (ex.: inferir o ano de nascimento num app e usá-lo como senha em outro). Metacritic: iOS 83, PC 71, Switch 73. Crítica mista (Kotaku AU: "falha ao explorar identidade trans"); a equipe diz ter corrigido "erros de design" na sequência.
- **ALP (set/2017):** Laura parece feliz, mas vive relação abusiva e escândalo no trabalho; termina com fuga. Steam: 91% positivas (1.067), Metacritic 71, tag "Short"; Pocket Gamer 8/10 ("puzzles de lógica inteligentes"), AppTrigger 9/10 ("passeio curto, de mão única"). Saiu da Steam.
- **Narrativa:** acervo estático (mensagens, fotos, fóruns, apps de encontro); a revelação vem da ordem em que o jogador abre as coisas.
- **Lição:** escopo enxuto (≈2–3 h †), dilema humano > crime. **Tema sensível exige cuidado** — o nosso também.

### 2.8 Replica ([GameCritics](https://gamecritics.com/gc-staff/replica-review/), [itch.io](https://indiesomi.itch.io/replica))
- **Premissa:** você guia um agente do governo que investiga "atos de rebeldia" do dono do celular, via fotos, SMS e posts.
- **Puzzle:** **escolher palavras/frases que servem de senha**; o acerto salva a senha/dedução. Sem sistema de dicas (o supervisor às vezes sugere). Vários finais, mas **é preciso resetar o celular** para ver cada um. ~1–1,5 h; nasceu mobile em 2016 → iOS/PC/Switch ([PS4/Xbox em 2022](https://gematsu.com/2022/03/replica-for-ps4-xbox-one-launches-april-5)). Nota 5/10.
- **Elogios:** mensagem política (vigilância), acessível (tudo em texto). **Críticas:** jogabilidade datada, escrita rasa, controles imprecisos, rejogar tedioso.
- **Lição:** "escolher palavras" é precedente do nosso sistema de deduções; a **complicidade moral** (você decide quem sofre) é memorável; evitar reset total.

### 2.9 Mecânicas de dedução: The Case of the Golden Idol e Return of the Obra Dinn
- **Golden Idol** ([Wikipedia](https://en.wikipedia.org/wiki/The_Case_of_the_Golden_Idol)): modo *Explorar* (clicar em personagens/objetos/documentos adiciona **palavras** — nomes, lugares, verbos, itens — a uma barra) e modo *Pensar* (preencher **lacunas** de uma descrição). Cada trecho **trava** quando todas as palavras estão certas. 11 casos; o Redux adicionou sistema de dicas. **Críticas:** "forçar bruto" o fim, pistas obscuras, pouca separação entre essencial e secundário, saltos lógicos.
- **Obra Dinn** ([Wikipedia](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)): livro com identidade e destino de cada pessoa; catálogo fixo de causas; **confirmação em conjuntos de 3** para desencorajar chute (os 6 últimos, em pares); respostas revisáveis; basta acertar 58 de 60. A demo com mortes fora de ordem confundiu, daí os capítulos.
- **Adotar:** chips coletados nos apps ("Anexar ao caderno") + frases com lacunas + validação em blocos de 3 + revisão livre + **prova de apoio** (escolher qual evidência sustenta cada lacuna).

## 3. Síntese

### 3.1 Padrões do gênero
| Eixo | Padrão dominante | Melhor prática | Pior prática |
|---|---|---|---|
| Trava | Credencial achada em outro app; perguntas do caso | ANLP/ALP, Replica, Stalkie (Q&A) | Match-3, Tetris, timer, bateria paga |
| Dicas | Botão in-flow; assistente na ficção | SIM (assistente), Stalkie | Dica paga (Peek a Phone) |
| Narrativa | Acervo estático + eventos roteirizados | ANLP/ALP (curtos) | NPC ao vivo ramificado (custo) |
| Finais | 2–5 finais por escolhas | Simulacra (5 finais) | Reset total para outro final (Replica) |
| Duração | 1–4 h (curtos); episódios (longos) | ALP "Short" | Enrolação (I Am Innocent) |
| Monetização | Assinatura/consumíveis | Preço único/grátis | Anúncios dentro da diegese (Stalkie) |

### 3.2 Mecânicas ranqueadas (Impacto × Viabilidade, notas 1–5, para uma pessoa)
| # | Mecânica | I | V | I×V | Notas concretas |
|---|---|---|---|---|---|
| 1 | **Credenciais derivadas** (PIN, senha, pergunta de segurança) com ≥2 pistas independentes | 5 | 5 | 25 | PIN = data do aniversário do filho (perfil + calendário). "Esqueci a senha" → pergunta cuja resposta está em foto/chat. Sem bloqueio por tentativas |
| 2 | **Deduções por lacunas** + blocos de 3 + prova de apoio | 5 | 4 | 20 | Núcleo do jogo; trava camadas |
| 3 | **Cronologia cruzada** ("tudo tem hora"): mensagem × Pix × GPS × passos × Wi-Fi | 5 | 4 | 20 | Uma linha do tempo automática do que foi anexado |
| 4 | **Mensagens apagadas/editadas** recuperáveis | 5 | 4 | 20 | "Esta mensagem foi apagada" + prévia no **histórico de notificações** (Ajustes) ou lixeira da galeria |
| 5 | **Busca global** no celular | 4 | 5 | 20 | Digitar "Pix", "hotel", nome → resultados em todos os apps; vira ferramenta de puzzle |
| 6 | **Dicas graduais grátis** (3 níveis) por assistente na ficção | 4 | 5 | 20 | Empurrão → apontar o app → revelar; sem custo, só marcadas na telemetria |
| 7 | **Metadados de foto** (hora, GPS, aparelho, "editada") + zoom | 4 | 4 | 16 | Foto às 23:58, enviada às 00:14, GPS divergente |
| 8 | **Eventos roteirizados por marco** | 4 | 4 | 16 | Ao confirmar a 2ª dedução, chega mensagem/ligação nova ao espelho |
| 9 | **App de saúde** como cronologia fisiológica | 4 | 4 | 16 | FC dispara 22:41, zero passos após 22:47 |
| 10 | **Estilometria**: quem escreveu as últimas mensagens? | 4 | 4 | 16 | "vc"/"você", pontuação, emojis; quase sem custo de produção |
| 11 | **Caderno com Contradições** (apontar evidência A × B) | 5 | 3 | 15 | Complemento às lacunas |
| 12 | **Mapa** com histórico e lacunas | 4 | 3 | 12 | Linha do tempo de lugares; "GPS desligado das 21:50 às 23:10" |
| 13 | **Áudio** do gravador | 3 | 3 | 9 | Entregar transcrição + marcas de ruído; áudio real só se houver produção |
| 14 | **Chat ao vivo ramificado** estilo Duskwood | 4 | 1 | 4 | Evitar |

### 3.2b Catálogo de puzzles (padrão do gênero → exemplo para o nosso caso)
| Tipo | Visto em | Exemplo em Última Conexão | Regra de justiça |
|---|---|---|---|
| Credencial por inferência | ANLP (ano de nascimento num app vira senha noutro) | PIN do banco = aniversário da filha (calendário + foto do bolo) | ≥2 pistas; mostrar o formato ("6 dígitos") |
| Credencial por escolha de palavras | Replica | Senha do app de notas = apelido, entre 3 candidatos já coletados | Candidatos vêm do que o jogador coletou |
| Recuperação de senha | SIM (arquivos com senha), ANLP | "Esqueci": "nome do primeiro cachorro?", resposta numa foto antiga | Só pede o que o jogador pode ter visto |
| Foto + metadados | Stalkie (fotos apagadas), SIM | Foto "vazia" com hora 23:58 e GPS em rua errada | Ficha de metadados completa, sem EXIF obscuro |
| Mensagem apagada | Stalkie e SIM (conversas/mensagens ocultas) | Tombstone + prévia no histórico de notificações | A via de recuperação existe na interface |
| Contradição | Golden Idol (análogo) | Álibi "estava em casa" × Wi-Fi/GPS | Sempre 2 fontes independentes |
| Estilometria | Proposta | Mensagens pós-morte comparadas com ≥5 anteriores | Diferença perceptível (abreviação, pontuação) |
| Cronologia | Todos | Pix 22:41 → ligação 22:44 → FC dispara 22:47 | Horário visível em todo item |

### 3.3 Armadilhas (com evidência)
1. **Caça a pixel / pista obscura:** Golden Idol é criticado por pistas "extremamente obscuras" sem separar essencial de secundário. Regra: toda pista essencial existe em **≥2 canais** (visual + texto/metadado) e há contador "3/5 detalhes".
2. **Senha impossível:** só vale se a fonte está no mundo (ANLP, Replica). Aceitar variações (12/03, 12/3/2025, "12 de março"; "1.200", "1200,00"; sem acento/caixa). Um usuário relata que o **Stalkie marcou resposta certa como errada** — o validador de respostas é parte do design.
3. **Texto demais:** I Am Innocent vende mensagens curtas; Replica é criticado por escrita rasa. Mensagens ≤ 140 caracteres; textão só em e-mails/notas opcionais.
4. **Ritmo lento:** Duskwood demora a engrenar. Abrir *in medias res* e dar a 1ª dedução em ≤ 10 min.
5. **Final frustrante:** Replica obriga a resetar; Golden Idol termina em chute. Salvar antes da acusação final, **epílogo que revela a verdade mesmo após erro** e feedback do que faltou.
6. **Atrito artificial:** minigame, energia, timer, paywall (Duskwood, I Am Innocent, Peek a Phone, Stalkie).
7. **Dependência de data real do aparelho** (Stalkie): use o relógio da ficção.
8. **Ativos de IA inconsistentes:** a crítica "lixo de IA" e "detalhes imprecisos" mostra que texto ilegível em imagem quebra pista. Auditar cada ativo que carrega pista.
9. **Áudio/vídeo caro** (Simulacra 2, Duskwood): preferir texto, imagem e transcrição.
10. **Tema sensível** (morte de uma mulher, possível violência de gênero): aviso de conteúdo, sem gratuidade; a recepção de ANLP mostra o risco de tratar identidade com leveza.

### 3.4 UX de celular simulado
- **Moldura:** em ≤ 480 px, tela cheia (`100dvh`, `viewport-fit=cover`, `env(safe-area-inset-*)`); em desktop, 390×844 centralizado com **caderno ao lado**; no mobile, o caderno é bottom sheet.
- **Sistema:** barra de status (hora **da ficção**, bateria, sinal), barra de navegação Voltar/Início/Recentes. **Voltar** sobe um nível por app; no início da tela inicial não faz nada. Use `history.pushState` para o botão voltar do Android/navegador não expulsar o jogador.
- **Desbloqueio:** tela de bloqueio com notificações visíveis (ensina a ler notificações), teclado de PIN, tremida no erro, **sem lockout**; "Biometria indisponível" (o dono morreu) é um toque de ambientação.
- **O que é clicável:** ícones com rótulo, chevrons em linhas, ponto de "não lido/novo", ripple no toque, alvos ≥ 48 px, **pulso discreto após ~45 s parado** no app com conteúdo novo. Itens vistos ficam cinza. Foto com botão "Analisar" que lista zonas.
- **Notificações:** banner no topo (~4 s), vai para o histórico, o toque abre o app/conversa **e destaca a mensagem**; no máximo uma a cada 3 s; som só após o 1º toque (política de autoplay); `navigator.vibrate` não existe no iOS (†).
- **Chat realista:** bolhas, separadores de data, "digitando…" curto, tiques azuis como pista, respostas citadas, "encaminhada", mensagem apagada, áudio com forma de onda + transcrição, "visto por último às 22:47" (central no título).
- **Persistência/telemetria:** autosave em `localStorage` + sincronização com Sheets via `sendBeacon`, que nunca bloqueia o jogo. Eventos anônimos (PIN errado, dica usada, tentativa de dedução) mostram onde o jogador trava; avisar conforme a LGPD.
- **Acessibilidade:** fonte ajustável, `prefers-reduced-motion`, transcrição de áudio, contraste, foco de teclado, `aria-live` nas notificações.
- **Autoria:** escrever mensagens numa planilha (chat, hora, remetente, texto, flags) e **exportar JSON estático** para o repositório; o jogo roda sem rede.

### 3.5 Momentos memoráveis (do gênero e propostas)
- **Do gênero:** a mensagem que só traz um número (Duskwood); o vídeo da Anna presa (Simulacra); apps que "glitcham" (Simulacra 2); a decisão de culpar (Replica); a revelação gradual de identidade (ANLP) e de abuso (ALP).
- **Propostas:** (1) **O espelho continua recebendo mensagens**: alguém que não sabe da morte escreve "cadê vc?". (2) **"Visto por último" após a morte**: o celular conectou ao Wi-Fi às 02:14, depois do óbito; alguém o usou. (3) **Estilometria**: as últimas respostas não são dela. (4) **Pix de R$ 1,00** com "perdão" na descrição. (5) **Gravador** com 0:03 acidental no bolso. (6) Foto sem nada, mas o **metadado** conta a história. (7) Ligação perdida às 03:12 de um número "desconhecido" que é do banco/trabalho. (8) **Cadeia de custódia**: o espelho mostra hash/hora da extração; um trecho foi adulterado depois.

### 3.6 Esqueleto sugerido
Prólogo de 2 min (briefing do perito, PIN inicial, 1ª notificação) → Camada 1 (mensagens, galeria, mapa abertos; 1ª dedução libera e-mail e redes) → Camada 2 (PIN derivado abre banco/Pix; histórico de notificações recupera apagadas; 2ª dedução) → Camada 3 (gravador, saúde, Wi-Fi/Bluetooth fecham a cronologia; reviravolta do uso pós-morte) → acusação final em 3 blocos de 3 → epílogo. Meta: 2–3 h + 20–30% opcional. **Finais** por completude da prova, não por reset: justiça completa / justiça parcial (faltou prova) / acusação errada (retomada do último salvamento, com epílogo que revela o que faltou).

### 3.7 Decisões recomendadas (top 10)
1. Espelho forense somente leitura, com PIN inicial fornecido no briefing.
2. Trava só por informação: credenciais derivadas e deduções; nenhum minigame, timer ou energia.
3. Deduções por lacunas com chips coletados, blocos de 3 e prova de apoio.
4. Toda pista essencial em ≥2 canais; validador tolerante (datas, valores, acentos).
5. Cronologia da ficção, com horário em todo item; nunca a data real do aparelho.
6. Mensagens apagadas recuperáveis via histórico de notificações/lixeira.
7. Busca global e caderno com linha do tempo automática.
8. Dicas grátis em 3 níveis, ditas por personagem/assistente.
9. Eventos roteirizados por marco (o espelho "recebe" mensagens), sem chat livre.
10. Conteúdo em planilha → JSON estático; jogo offline; 2–3 h; finais por prova, com epílogo.

## 4. Projetos e bibliotecas gratuitos

### 4.1 Verificados nesta sessão
| Projeto | Licença | Atividade | Aproveitar (reescrever do zero) |
|---|---|---|---|
| [kidsOS](https://github.com/mixashin/kidsOS) | MIT | 3 estrelas, 158 commits, 25 apps; HTML/CSS/JS puro, sem framework | Shell home/janelas, **sistema de arquivos falso em localStorage**, service worker com lista de cache gerada no build, tabelas de idioma por app, deploy no GitHub Pages. Fonte Nunito (OFL) e three.js têm licenças próprias |
| [your-phone-is-lying](https://github.com/sakinazehrapk-maker/your-phone-is-lying) | MIT | 0 estrelas, 55 commits; `index.html`/`script.js`/`style.css` | "Jogo inteiro num smartphone falso"; README não inspecionado — só referência de escopo |
| [Ren'Py Phone System](https://kleineluka.itch.io/phone) (kleineluka) | "Dê crédito" (ver `phone.rpy`); grátis/pague quanto quiser; 5,0★ (6) | Sem data visível | Checklist de recursos: contatos, DMs, grupos com entrada/saída, modo claro/escuro, emojis inline, foto, escolhas, notificações, pausas forçadas, histórico. Limites: um telefone só; bugs de layout |

**Lacunas honestas:** as buscas não acharam template de chat para **Twine/Ink** com licença clara, nem **UI kit Android/WhatsApp em HTML/CSS** aberto (só mockups comerciais do Adobe Stock/Envato). Não há atalho: construir do zero com Roboto, Material Symbols e tokens CSS. Para Ren'Py há também o [Simple messaging system](https://nighten.itch.io/renpy-simple-messaging-system-for-mobile-game/purchase) (página de compra; provavelmente pago, n/v).

### 4.2 Achados por busca, licença não verificada (usar só como estudo de UX)
- GitHub: [html-phone](https://github.com/DanielYanesDev/html-phone) (simulação de telefone), [city-detective](https://github.com/lukaswall/city-detective) (detetive HTML/JS no GitHub Pages), [Last-Testinomy](https://github.com/aanchalyadav-21/Last-Testinomy).
- itch.io: coleção [Found Phones](https://itch.io/c/4484525/found-phones), [UNREAD](https://lguidolin.itch.io/unread/devlog/1679993/unread-is-out-you-found-a-missing-girls-phone-someone-wants-it-back), [Phone Detective](https://fonegames.itch.io/phone-detective), [The Last Question](https://itch.io/t/7101760/html5-the-last-question-a-free-5-minute-mystery-game-mobile-browser) (HTML5 de 5 min), [SeCrets](https://ichaann.itch.io/secrets), [Number Not Available](https://lyco-wolf.itch.io/number-not-available), [Phone Chat System for Ren'Py](https://alphonsinious.itch.io/phone-chat-system-renpy). Sem licença declarada, vale "todos os direitos reservados": **jogar para estudar, não copiar**.

### 4.3 Bibliotecas e ativos
| Item | Licença | Observação |
|---|---|---|
| [DiceBear](https://www.dicebear.com/styles/lorelei) | Biblioteca MIT (†). **Lorelei** (Lisa Wischofsky) e **Notionists** (Zoish): **CC0 1.0**. Open Peeps: CC0. Avataaars/Bottts: uso livre pessoal e comercial. **Personas, Croodles, Dylan, Fun Emoji, Miniavs, Adventurer Neutral: CC BY 4.0** (exigem crédito) | Verificado na página do Lorelei. **Gerar os SVGs antes e hospedá-los** no repositório; não depender da API em tempo de execução. Ordem de grandeza: milhares de estrelas (†) |
| [Lucide](https://github.com/lucide-icons/lucide) / [Tabler Icons](https://github.com/tabler/tabler-icons) | ISC / MIT (†) | Ícones de apps; ordem de 10–20 mil estrelas, ativos (†). Para o "feeling Android", os Material Symbols (Apache-2.0 †) combinam mais |
| [Leaflet](https://github.com/Leaflet/Leaflet) | BSD-2-Clause (†) | Para mapa **fictício**, usar `L.CRS.Simple` + `imageOverlay` (sem servidor de tiles, sem política de uso). Ordem de 40 mil estrelas (†) |
| [Política de tiles do OSM](https://operations.osmfoundation.org/policies/tiles/) (†) | Dados ODbL | Exige atribuição "© OpenStreetMap contributors", proíbe uso pesado/prefetch em massa, pede Referer/User-Agent identificável, sem SLA e pode bloquear. Para cidade real: poucas imagens pré-renderizadas com atribuição, ou MapLibre + provedor sem chave (OpenFreeMap †) ou com chave gratuita (†) |
| [Fuse.js](https://github.com/krisk/Fuse) | Apache-2.0 (†) | Busca global do celular (mecânica 5) |
| [inkjs](https://github.com/y-lohse/inkjs) + Inky | MIT (†) | Só se quiser roteiro ramificado; para acervo + eventos, **JSON gerado de planilha** basta. Twine/SugarCube: editor GPL-3.0, SugarCube BSD-2 (†) |
| [Twemoji (fork jdecked)](https://github.com/jdecked/twemoji) / Noto Color Emoji | Gráficos CC BY 4.0 / OFL (†) | Emoji consistente; Noto é o emoji real do Android |
| Roboto | Apache-2.0 (†) | Fonte de sistema do Android: dá autenticidade |
| [Kenney](https://kenney.nl/assets) (áudio) | CC0 (†) | Sons de notificação/teclado |

**Sugestão final de arquitetura de conteúdo:** Sheets como "CMS" (abas `contatos`, `mensagens`, `fotos`, `transacoes`, `locais`, `saude`, `deducoes`) → Apps Script exporta JSON → repositório (GitHub Pages) → jogo estático offline, com Sheets só para telemetria opcional.
