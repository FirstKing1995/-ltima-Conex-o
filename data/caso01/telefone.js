// Telefone de Iara: chamadas de setembro a 10/10 (aparelho) + chamadas pelo WhatsApp de 11 a 13/10 (nuvem, todas perdidas).
// Números fora dos contatos aparecem formatados. Duração em segundos.

export default {
  calls: [
    /* ---------- setembro ---------- */
    { id: 'c-0902-gas', phone: '5585984410962', contact: 'gas', at: '2026-09-02T17:48', dir: 'out', duration: 74, via: 'phone' },
    { id: 'c-0904-spam', phone: '5511940028922', at: '2026-09-04T10:31', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-0907-mae', phone: '5588994305562', contact: 'mae', at: '2026-09-07T19:20', dir: 'in', duration: 612, via: 'phone' },
    { id: 'c-0911-nanda', phone: '5585999082231', contact: 'nanda', at: '2026-09-11T18:05', dir: 'out', duration: 95, via: 'phone' },
    { id: 'c-0914-duda', phone: '5588997120384', contact: 'duda', at: '2026-09-14T21:12', dir: 'in', duration: 1380, via: 'phone' },
    { id: 'c-0916-marina', phone: '5585996172803', contact: 'marina', at: '2026-09-16T15:40', dir: 'out', duration: 188, via: 'phone' },
    { id: 'c-0918-nanda', phone: '5585999082231', contact: 'nanda', at: '2026-09-18T20:55', dir: 'in', duration: 41, via: 'phone' },
    { id: 'c-0920-pai', phone: '5588994417710', contact: 'pai', at: '2026-09-20T07:42', dir: 'out', duration: 133, via: 'phone' },
    { id: 'c-0922-rafa-b', phone: '5588991870056', at: '2026-09-22T22:48', dir: 'blocked', duration: 0, via: 'phone' },
    { id: 'c-0922-rafa-b2', phone: '5588991870056', at: '2026-09-22T23:03', dir: 'blocked', duration: 0, via: 'phone' },
    { id: 'c-0923-sindico', phone: '5585996630215', contact: 'sindico', at: '2026-09-23T08:15', dir: 'in', duration: 57, via: 'phone' },
    { id: 'c-0925-caio', phone: '5585991230077', contact: 'caio', at: '2026-09-25T10:52', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-0925-caio2', phone: '5585991230077', contact: 'caio', at: '2026-09-25T11:30', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-0926-desc', phone: '5585982261904', at: '2026-09-26T14:20', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-0929-dentista', phone: '5585987720136', contact: 'dentista', at: '2026-09-29T10:10', dir: 'out', duration: 66, via: 'phone' },
    { id: 'c-0930-mae', phone: '5588994305562', contact: 'mae', at: '2026-09-30T19:30', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-0930-mae2', phone: '5588994305562', contact: 'mae', at: '2026-09-30T20:15', dir: 'out', duration: 421, via: 'phone' },

    /* ---------- outubro ---------- */
    { id: 'c-1001-duda', phone: '5588997120384', contact: 'duda', at: '2026-10-01T22:36', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1001-duda2', phone: '5588997120384', contact: 'duda', at: '2026-10-01T22:58', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1002-gas', phone: '5585984410962', contact: 'gas', at: '2026-10-02T17:30', dir: 'in', duration: 38, via: 'phone' },
    { id: 'c-1003-theo', phone: '5585996017733', contact: 'theo', at: '2026-10-03T14:05', dir: 'out', duration: 252, via: 'phone' },
    { id: 'c-1003-rafa-b', phone: '5588998312456', contact: 'rafa', at: '2026-10-03T23:21', dir: 'blocked', duration: 0, via: 'phone' },
    { id: 'c-1005-duda', phone: '5588997120384', contact: 'duda', at: '2026-10-05T21:10', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1005-pai', phone: '5588994417710', contact: 'pai', at: '2026-10-05T20:10', dir: 'in', duration: 150, via: 'phone' },
    { id: 'c-1006-desc', phone: '5585982261904', at: '2026-10-06T11:03', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1007-rafa-b', phone: '5588998312456', contact: 'rafa', at: '2026-10-07T21:52', dir: 'blocked', duration: 0, via: 'phone' },
    { id: 'c-1007-rafa-b2', phone: '5588991870056', at: '2026-10-07T22:03', dir: 'blocked', duration: 0, via: 'phone' },
    { id: 'c-1008-caio', phone: '5585991230077', contact: 'caio', at: '2026-10-08T17:42', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1008-marina', phone: '5585996172803', contact: 'marina', at: '2026-10-08T18:20', dir: 'in', duration: 244, via: 'phone' },
    { id: 'c-1009-mae', phone: '5588994305562', contact: 'mae', at: '2026-10-09T16:02', dir: 'out', duration: 29, via: 'phone' },
    { id: 'c-1009-pai', phone: '5588994417710', contact: 'pai', at: '2026-10-09T17:03', dir: 'out', duration: 22, via: 'phone' },
    { id: 'c-1010-mae', phone: '5588994305562', contact: 'mae', at: '2026-10-10T08:10', dir: 'in', duration: 76, via: 'phone' },
    { id: 'c-1010-lari', phone: '5585998764410', contact: 'lari', at: '2026-10-10T12:20', dir: 'in', duration: 184, via: 'phone' },
    { id: 'c-1010-duda', phone: '5588997120384', contact: 'duda', at: '2026-10-10T15:44', dir: 'in', duration: 35, via: 'phone' },
    { id: 'c-1010-nanda', phone: '5585999082231', contact: 'nanda', at: '2026-10-10T19:05', dir: 'missed', duration: 0, via: 'phone' },

    /* ---------- depois do desligamento: nuvem, pelo WhatsApp ---------- */
    { id: 'c-1011-pai1', phone: '5588994417710', contact: 'pai', at: '2026-10-11T07:40', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1011-mae1', phone: '5588994305562', contact: 'mae', at: '2026-10-11T08:06', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1011-pai2', phone: '5588994417710', contact: 'pai', at: '2026-10-11T08:12', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1011-mae2', phone: '5588994305562', contact: 'mae', at: '2026-10-11T08:31', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1011-duda', phone: '5588997120384', contact: 'duda', at: '2026-10-11T08:41', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1011-lari', phone: '5585998764410', contact: 'lari', at: '2026-10-11T09:02', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1011-nanda', phone: '5585999082231', contact: 'nanda', at: '2026-10-11T09:05', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1011-mae3', phone: '5588994305562', contact: 'mae', at: '2026-10-11T10:50', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1012-mae', phone: '5588994305562', contact: 'mae', at: '2026-10-12T06:35', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1012-bruna1', phone: '5585988124471', at: '2026-10-12T10:22', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1012-bruna2', phone: '5585988124471', at: '2026-10-12T10:33', dir: 'missed', duration: 0, via: 'phone' },
    { id: 'c-1012-bruna3', phone: '5585988124471', at: '2026-10-12T10:48', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1012-duda', phone: '5588997120384', contact: 'duda', at: '2026-10-12T19:40', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1013-pai', phone: '5588994417710', contact: 'pai', at: '2026-10-13T20:05', dir: 'missed', duration: 0, via: 'papo' },
    { id: 'c-1013-duda', phone: '5588997120384', contact: 'duda', at: '2026-10-13T21:48', dir: 'missed', duration: 0, via: 'papo' },
  ],

  voicemail: [
    {
      id: 'vm-clinica', phone: '5585987720136', contact: 'dentista', at: '2026-08-26T16:12', duration: 24,
      transcript: 'Oi, Iara, aqui é da Clínica Odonto Benfica. Estamos ligando para lembrar da sua limpeza amanhã, quinta, às quinze e trinta, com o Dr. Hélio. Se não puder vir, é só retornar neste número para remarcar. Um bom dia.',
    },
    {
      id: 'vm-marina', phone: '5585996172803', contact: 'marina', at: '2026-10-08T18:14', duration: 19,
      transcript: 'Oi, Iara, é a Marina. Tinha esquecido de falar do horário do casamento, é às quatro da tarde, não às cinco. Me retorna quando puder. Beijo.',
    },
    {
      id: 'vm-pai', phone: '5588994417710', contact: 'pai', at: '2026-10-11T07:44', duration: 11,
      transcript: 'Filha, é teu pai. Tu não dormiu aqui em casa. Me liga, tá? Deus te abençoe.',
    },
    {
      id: 'vm-mae', phone: '5588994305562', contact: 'mae', at: '2026-10-11T11:20', duration: 31,
      transcript: 'Filha, é a mamãe. Eu sei que tu não vai ouvir. Eu liguei mesmo assim. A tua cama tá arrumada, o Bento tá na porta. Eu só queria ouvir a tua voz no começo da mensagem. É só. Te amo.',
    },
    {
      id: 'vm-bruna', phone: '5585988124471', at: '2026-10-12T10:35', duration: 28,
      transcript: 'Iara, é a Bruna Leal, do Farol. Estou aqui no jornal te esperando, são dez e trinta e cinco. A sala está reservada até as onze. Se aconteceu algum imprevisto, me avisa por favor. Eu preciso do que você disse que tinha.',
    },
    {
      id: 'vm-ademar', phone: '5588996017741', at: '2026-10-09T21:14', duration: 47, req: 'final_verdade',
      transcript: 'Iara, minha filha, aqui é o Ademar, pai da Duda. Soube que tu andou no cartório de Ipu pedindo livro velho, e no jornal pedindo jornal de noventa e dois. Eu entendo. É tua tia. Mas deixa os mortos onde Deus deixou. Vem pra festa, faz o teu serviço, volta pra Fortaleza. A serra não gosta de quem cava. Tua família sabe disso melhor que ninguém. Um abraço no teu pai.',
    },
  ],
};
