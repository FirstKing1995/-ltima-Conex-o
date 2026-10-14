// Termos coletáveis no Modo Análise (lupa). match: textos que, quando aparecem no celular, viram o termo.
// cat: pessoa | lugar | hora | objeto | conceito | numero.  cs: true = diferencia maiúsculas.
const horas = ['18:19', '20:40', '21:15', '21:47', '21:52', '21:55', '22:15', '22:20', '22:31', '22:51', '23:05', '23:07', '23:20', '23:25', '23:26', '23:28', '23:29', '23:30', '23:31', '23:32', '23:33', '23:34', '23:38', '23:39', '23:40', '23:41', '23:42', '23:43', '23:44', '23:45', '23:46', '23:47', '23:52', '23:53', '23:55', '23:58', '00:15', '00:17', '06:20'];

export default {
  terms: [
    // pessoas
    { id: 'p-iara', label: 'Iara', cat: 'pessoa', match: ['Iara', 'Iara Fontenele'] },
    { id: 'p-duda', label: 'Duda', cat: 'pessoa', match: ['Duda', 'Maria Eduarda', 'Eduarda'] },
    { id: 'p-rafa', label: 'Rafa', cat: 'pessoa', match: ['Rafa', 'Rafael', 'Rafa Aguiar'] },
    { id: 'p-caio', label: 'Caio', cat: 'pessoa', match: ['Caio', 'Caio Montenegro'] },
    { id: 'p-bruna', label: 'Bruna', cat: 'pessoa', match: ['Bruna', 'Bruna Leal'] },
    { id: 'p-theo', label: 'Théo', cat: 'pessoa', match: ['Théo', 'Theo'] },
    { id: 'p-pai', label: 'pai', cat: 'pessoa', match: ['pai', 'Seu Toinho', 'Toinho'] },
    { id: 'p-mae', label: 'mãe', cat: 'pessoa', match: ['mãe', 'Dona Socorro'] },
    { id: 'p-lari', label: 'Lari', cat: 'pessoa', match: ['Lari', 'Larissa'] },
    { id: 'p-marcos', label: 'Marcos', cat: 'pessoa', match: ['Marcos'] },
    { id: 'p-igor', label: 'Igor', cat: 'pessoa', match: ['Igor'] },
    { id: 'p-nanda', label: 'Nanda', cat: 'pessoa', match: ['Nanda'] },
    { id: 'p-leo', label: 'Léo', cat: 'pessoa', match: ['Léo'] },
    { id: 'p-ze', label: 'Seu Zé', cat: 'pessoa', match: ['Seu Zé'] },
    // números
    { id: 'n-99645', label: '(88) 99645-1209', cat: 'numero', match: ['99645-1209', '99645 1209', '996451209'] },
    { id: 'n-4471', label: '98812-4471', cat: 'numero', match: ['98812-4471'] },
    { id: 'n-4417', label: '98812-4417', cat: 'numero', match: ['98812-4417'] },
    { id: 'n-2456', label: '(88) 99831-2456', cat: 'numero', match: ['99831-2456'] },
    // lugares
    { id: 'l-mirante', label: 'mirante', cat: 'lugar', match: ['mirante', 'Pedra Lisa'] },
    { id: 'l-galpao', label: 'galpão', cat: 'lugar', match: ['galpão', 'galpao'] },
    { id: 'l-camarim', label: 'camarim', cat: 'lugar', match: ['camarim'] },
    { id: 'l-palco', label: 'palco', cat: 'lugar', match: ['palco'] },
    { id: 'l-sitio', label: 'Sítio Flor da Serra', cat: 'lugar', match: ['Flor da Serra'] },
    { id: 'l-casa-sede', label: 'casa sede', cat: 'lugar', match: ['casa sede'] },
    { id: 'l-estacionamento', label: 'estacionamento', cat: 'lugar', match: ['estacionamento'] },
    { id: 'l-sobral', label: 'Sobral', cat: 'lugar', match: ['Sobral'] },
    { id: 'l-guaraciaba', label: 'Guaraciaba do Norte', cat: 'lugar', match: ['Guaraciaba'] },
    { id: 'l-ipu', label: 'Ipu', cat: 'lugar', match: ['Ipu'] },
    { id: 'l-fortaleza', label: 'Fortaleza', cat: 'lugar', match: ['Fortaleza'] },
    // horas
    ...horas.map(t => ({ id: 'h-' + t.replace(':', ''), label: t, cat: 'hora', match: [t, t.replace(':', 'h')] })),
    // objetos
    { id: 'o-celular', label: 'celular', cat: 'objeto', match: ['celular'] },
    { id: 'o-relogio', label: 'relógio', cat: 'objeto', match: ['relógio', 'Pulso Band'] },
    { id: 'o-gravacao', label: 'gravação', cat: 'objeto', match: ['gravação', 'gravar', 'gravando'] },
    { id: 'o-tripe', label: 'tripé', cat: 'objeto', match: ['tripé'] },
    { id: 'o-pin', label: 'PIN', cat: 'objeto', match: ['PIN'], cs: true },
    { id: 'o-digital', label: 'digital', cat: 'objeto', match: ['digital'] },
    { id: 'o-story', label: 'story', cat: 'objeto', match: ['story', 'stories'] },
    { id: 'o-live', label: 'live', cat: 'objeto', match: ['live', 'ao vivo'] },
    { id: 'o-video', label: 'vídeo', cat: 'objeto', match: ['vídeo'] },
    { id: 'o-comprovante', label: 'comprovante', cat: 'objeto', match: ['comprovante', 'comprovantes'] },
    { id: 'o-pasta', label: 'Pasta Segura', cat: 'objeto', match: ['Pasta Segura'] },
    { id: 'o-cerca', label: 'cerca quebrada', cat: 'objeto', match: ['cerca quebrada', 'cerca'] },
    { id: 'o-pendrive', label: 'pendrive', cat: 'objeto', match: ['pendrive'] },
    // conceitos
    { id: 'c-timelapse', label: 'timelapse', cat: 'conceito', match: ['timelapse', 'time-lapse', 'timelapses'] },
    { id: 'c-piramide', label: 'pirâmide', cat: 'conceito', match: ['pirâmide', 'piramide'] },
    { id: 'c-colheita', label: 'Colheita Capital', cat: 'conceito', match: ['Colheita Capital', 'Colheita'] },
    { id: 'c-taxa', label: 'taxa de garantia', cat: 'conceito', match: ['taxa de garantia'] },
    { id: 'c-desligado', label: 'desligado', cat: 'conceito', match: ['desligado', 'desligou', 'desligamento'] },
    { id: 'c-queda', label: 'queda', cat: 'conceito', match: ['queda'] },
    { id: 'c-acidente', label: 'acidente', cat: 'conceito', match: ['acidente'] },
    { id: 'c-perseguicao', label: 'perseguição', cat: 'conceito', match: ['perseguição', 'stalker'] },
    { id: 'c-bonus', label: 'bônus', cat: 'conceito', match: ['bônus', 'bonus'] },
    { id: 'c-pix', label: 'Pix', cat: 'conceito', match: ['Pix'], cs: true },
    { id: 'c-apagada', label: 'mensagem apagada', cat: 'conceito', match: ['Mensagem apagada', 'mensagem apagada', 'apagada'] },
  ],
};
