// Google Maps — histórico de localização do aparelho de Iara (até sáb 10/10 23:47).

const place = (id, name, kind, address, lat, lng) => ({ id, name, kind, address, lat, lng });
const visit = (p, start, end, note) => ({ type: 'visit', place: p, start, end, ...(note ? { note } : {}) });
const move = (mode, from, to, start, end, km, extra = {}) => ({ type: 'move', mode, from, to, start, end, km, ...extra });

export default {
  places: [
    place('apto', 'Apê da Iara', 'casa', 'Rua Carapinima, Benfica, Fortaleza, CE', -3.74, -38.541),
    place('colheita-escritorio', 'Colheita Capital (escritório)', 'trabalho', 'Av. Dom Luís, Aldeota, Fortaleza, CE', -3.736, -38.495),
    place('cafe-dragao', 'Café do Dragão', 'cafe', 'Praia de Iracema, Fortaleza, CE', -3.7215, -38.517),
    place('mercado-central', 'Mercado Central', 'loja', 'Centro, Fortaleza, CE', -3.727, -38.526),
    place('estudio-lumina', 'Estúdio Lumina', 'trabalho', 'Meireles, Fortaleza, CE', -3.726, -38.504),
    place('rod-fortaleza', 'Rodoviária Engenheiro João Thomé', 'rodoviaria', 'Fortaleza, CE', -3.7525, -38.533),
    place('rod-sobral', 'Rodoviária de Sobral', 'rodoviaria', 'Sobral, CE', -3.688, -40.349),
    place('cafe-margarida', 'Café Margarida', 'cafe', 'Centro, Sobral, CE', -3.689, -40.35),
    place('ipu', 'Ipu (parada na estrada)', 'outro', 'Ipu, CE', -4.3204, -40.7119),
    place('casa-pais', 'Casa dos pais', 'casa', 'Rua Padre Anchieta, Centro, Guaraciaba do Norte, CE', -4.1669, -40.7472),
    place('padaria-serrana', 'Padaria Serrana', 'loja', 'Centro, Guaraciaba do Norte, CE', -4.1672, -40.7465),
    place('casa-sede', 'Sítio Flor da Serra · casa sede', 'fazenda', 'Zona rural, Guaraciaba do Norte, CE', -4.1648, -40.6918),
    place('galpao', 'Sítio Flor da Serra · galpão', 'evento', 'Sítio Flor da Serra, zona rural, Guaraciaba do Norte, CE', -4.1655, -40.6905),
    place('estacionamento', 'Sítio Flor da Serra · estacionamento', 'outro', 'Sítio Flor da Serra, zona rural, Guaraciaba do Norte, CE', -4.166, -40.6896),
    place('mirante', 'Mirante da Pedra Lisa', 'mirante', 'Estrada do Mirante, Sítio Flor da Serra, Guaraciaba do Norte, CE', -4.1632, -40.686),
  ],

  days: [
    /* ---------- 10/10, sábado: Guaraciaba do Norte ---------- */
    {
      date: '2026-10-10',
      summary: 'Guaraciaba do Norte · Sítio Flor da Serra',
      segments: [
        visit('casa-pais', '2026-10-10T00:00', '2026-10-10T11:40', 'Passou a manhã na casa dos pais.'),
        move('walk', 'casa-pais', 'padaria-serrana', '2026-10-10T11:40', '2026-10-10T11:48', 0.4,
          { path: [[-4.1669, -40.7472], [-4.1670, -40.7469], [-4.1672, -40.7465]] }),
        visit('padaria-serrana', '2026-10-10T11:48', '2026-10-10T12:05'),
        move('walk', 'padaria-serrana', 'casa-pais', '2026-10-10T12:05', '2026-10-10T12:12', 0.4,
          { path: [[-4.1672, -40.7465], [-4.1670, -40.7469], [-4.1669, -40.7472]] }),
        visit('casa-pais', '2026-10-10T12:12', '2026-10-10T15:50', 'Almoço e descanso. Saiu às 15:50, quando a Duda chegou.'),
        move('car', 'casa-pais', 'casa-sede', '2026-10-10T15:50', '2026-10-10T16:20', 9.6,
          { path: [[-4.1669, -40.7472], [-4.1685, -40.7400], [-4.1672, -40.7300], [-4.1660, -40.7200], [-4.1651, -40.7102], [-4.1655, -40.7000], [-4.1650, -40.6950], [-4.1648, -40.6918]],
            note: 'De carro, com a Duda, pela estrada de terra até o Sítio Flor da Serra.' }),
        visit('casa-sede', '2026-10-10T16:20', '2026-10-10T17:35', 'Parte do tempo foi no galpão, a 170 m da casa sede, acompanhando a montagem do evento.'),
        move('walk', 'casa-sede', 'mirante', '2026-10-10T17:35', '2026-10-10T17:55', 0.9,
          { path: [[-4.1648, -40.6918], [-4.1651, -40.6911], [-4.1656, -40.6903], [-4.1654, -40.6893], [-4.1649, -40.6884], [-4.1643, -40.6876], [-4.1637, -40.6868], [-4.1632, -40.6860]] }),
        visit('mirante', '2026-10-10T17:55', '2026-10-10T18:30', 'Fotografou o fim do pôr do sol e a cerca do mirante entre 18:14 e 18:19.'),
        move('walk', 'mirante', 'galpao', '2026-10-10T18:30', '2026-10-10T18:37', 0.42,
          { path: [[-4.1632, -40.6860], [-4.1636, -40.6867], [-4.1640, -40.6873], [-4.1644, -40.6880], [-4.1648, -40.6886], [-4.1650, -40.6892], [-4.1653, -40.6899], [-4.1655, -40.6905]] }),
        visit('galpao', '2026-10-10T18:37', '2026-10-10T23:29', 'Noite da Colheita: palco, camarim e plateia no mesmo galpão. O aparelho ficou na área do evento até as 23:29.'),
        move('walk', 'galpao', 'mirante', '2026-10-10T23:29', '2026-10-10T23:36', 0.42,
          { path: [[-4.1655, -40.6905], [-4.1654, -40.6900], [-4.1652, -40.6895], [-4.1650, -40.6890], [-4.1648, -40.6885], [-4.1645, -40.6881], [-4.1642, -40.6876], [-4.1639, -40.6871], [-4.1636, -40.6866], [-4.1633, -40.6862], [-4.1632, -40.6860]],
            note: 'A pé pela trilha, em ritmo acelerado. Saiu do galpão sozinha.' }),
        visit('mirante', '2026-10-10T23:36', '2026-10-10T23:47', 'O aparelho ficou parado no mirante até desligar, às 23:47.'),
      ],
    },

    /* ---------- 09/10, sexta: Fortaleza -> Sobral -> Guaraciaba ---------- */
    {
      date: '2026-10-09',
      summary: 'Fortaleza → Sobral → Guaraciaba do Norte',
      segments: [
        visit('apto', '2026-10-09T00:00', '2026-10-09T06:41'),
        move('ride', 'apto', 'rod-fortaleza', '2026-10-09T06:41', '2026-10-09T06:52', 2.1, { path: [[-3.74, -38.541], [-3.7445, -38.5385], [-3.7490, -38.5352], [-3.7525, -38.533]] }),
        visit('rod-fortaleza', '2026-10-09T06:52', '2026-10-09T07:30', 'Embarcou no ônibus de 07:30 para Sobral.'),
        move('bus', 'rod-fortaleza', 'rod-sobral', '2026-10-09T07:30', '2026-10-09T11:20', 232,
          { path: [[-3.7525, -38.533], [-3.7360, -38.6530], [-3.8280, -38.9400], [-3.7930, -39.2700], [-3.6830, -39.5840], [-3.7480, -39.7850], [-3.7150, -40.0900], [-3.6880, -40.3490]],
            note: 'Ônibus intermunicipal pela BR-222.' }),
        visit('rod-sobral', '2026-10-09T11:20', '2026-10-09T11:36'),
        move('ride', 'rod-sobral', 'cafe-margarida', '2026-10-09T11:36', '2026-10-09T11:42', 1.0),
        visit('cafe-margarida', '2026-10-09T11:42', '2026-10-09T14:52', 'Almoço e café com o ex-professor dela.'),
        move('ride', 'cafe-margarida', 'rod-sobral', '2026-10-09T14:52', '2026-10-09T14:59', 1.0),
        visit('rod-sobral', '2026-10-09T14:59', '2026-10-09T15:30'),
        move('van', 'rod-sobral', 'ipu', '2026-10-09T15:30', '2026-10-09T16:15', 71,
          { path: [[-3.688, -40.349], [-3.7600, -40.3900], [-3.9100, -40.4400], [-4.0500, -40.5600], [-4.1800, -40.6500], [-4.3204, -40.7119]], note: 'Topic (van) até o pé da serra.' }),
        visit('ipu', '2026-10-09T16:15', '2026-10-09T16:28', 'Parada rápida na estrada, em Ipu.'),
        move('van', 'ipu', 'casa-pais', '2026-10-09T16:28', '2026-10-09T17:10', 38,
          { path: [[-4.3204, -40.7119], [-4.2800, -40.7250], [-4.2300, -40.7380], [-4.1900, -40.7440], [-4.1669, -40.7472]], note: 'Subida da serra da Ibiapaba até Guaraciaba do Norte.' }),
        visit('casa-pais', '2026-10-09T17:10', '2026-10-09T23:59', 'Chegou à casa dos pais no fim da tarde.'),
      ],
    },

    /* ---------- 08/10 ---------- */
    {
      date: '2026-10-08',
      summary: 'Fortaleza · escritório da Colheita',
      segments: [
        visit('apto', '2026-10-08T00:00', '2026-10-08T08:35'),
        move('ride', 'apto', 'colheita-escritorio', '2026-10-08T08:35', '2026-10-08T08:49', 4.2),
        visit('colheita-escritorio', '2026-10-08T08:49', '2026-10-08T20:40', 'Dia longo no escritório. Ficou até depois das 20h.'),
        move('ride', 'colheita-escritorio', 'apto', '2026-10-08T20:40', '2026-10-08T20:58', 4.4),
        visit('apto', '2026-10-08T20:58', '2026-10-08T23:59'),
      ],
    },
    /* ---------- 07/10 ---------- */
    {
      date: '2026-10-07',
      summary: 'Fortaleza · Mercado Central e ensaio no Meireles',
      segments: [
        visit('apto', '2026-10-07T00:00', '2026-10-07T09:15'),
        move('ride', 'apto', 'mercado-central', '2026-10-07T09:15', '2026-10-07T09:28', 3.1),
        visit('mercado-central', '2026-10-07T09:28', '2026-10-07T11:30'),
        move('ride', 'mercado-central', 'estudio-lumina', '2026-10-07T11:30', '2026-10-07T11:44', 3.4),
        visit('estudio-lumina', '2026-10-07T11:44', '2026-10-07T16:50', 'Ensaio fotográfico de trabalho.'),
        move('ride', 'estudio-lumina', 'apto', '2026-10-07T16:50', '2026-10-07T17:14', 6.0),
        visit('apto', '2026-10-07T17:14', '2026-10-07T23:59'),
      ],
    },
    /* ---------- 06/10 ---------- */
    {
      date: '2026-10-06',
      summary: 'Fortaleza · escritório da Colheita',
      segments: [
        visit('apto', '2026-10-06T00:00', '2026-10-06T08:40'),
        move('ride', 'apto', 'colheita-escritorio', '2026-10-06T08:40', '2026-10-06T08:55', 4.3),
        visit('colheita-escritorio', '2026-10-06T08:55', '2026-10-06T19:05'),
        move('ride', 'colheita-escritorio', 'apto', '2026-10-06T19:05', '2026-10-06T19:24', 4.4),
        visit('apto', '2026-10-06T19:24', '2026-10-06T23:59'),
      ],
    },
    /* ---------- 05/10 ---------- */
    {
      date: '2026-10-05',
      summary: 'Fortaleza · escritório e Praia de Iracema',
      segments: [
        visit('apto', '2026-10-05T00:00', '2026-10-05T08:22'),
        move('ride', 'apto', 'colheita-escritorio', '2026-10-05T08:22', '2026-10-05T08:36', 4.2),
        visit('colheita-escritorio', '2026-10-05T08:36', '2026-10-05T18:10'),
        move('ride', 'colheita-escritorio', 'cafe-dragao', '2026-10-05T18:10', '2026-10-05T18:27', 4.0),
        visit('cafe-dragao', '2026-10-05T18:27', '2026-10-05T21:48', 'Editou fotos de trabalho no café até a noite.'),
        move('ride', 'cafe-dragao', 'apto', '2026-10-05T21:48', '2026-10-05T22:05', 5.2),
        visit('apto', '2026-10-05T22:05', '2026-10-05T23:59'),
      ],
    },
  ],

  last: { at: '2026-10-10T23:47', lat: -4.1633, lng: -40.6861, accuracy: 12, place: 'mirante', label: 'Última conexão' },
};
