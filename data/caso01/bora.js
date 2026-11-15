// Bora — corridas de Iara em Fortaleza e Sobral. Nenhuma em Guaraciaba do Norte: lá ela foi de carro com a Duda.

const P = {
  apto: { name: 'Apê · Rua Carapinima, Benfica', lat: -3.74, lng: -38.541 },
  colheita: { name: 'Colheita Capital · Av. Dom Luís, Aldeota', lat: -3.736, lng: -38.495 },
  dragao: { name: 'Café do Dragão · Praia de Iracema', lat: -3.7215, lng: -38.517 },
  mercado: { name: 'Mercado Central', lat: -3.727, lng: -38.526 },
  lumina: { name: 'Estúdio Lumina · Meireles', lat: -3.726, lng: -38.504 },
  rodFor: { name: 'Rodoviária Engenheiro João Thomé', lat: -3.7525, lng: -38.533 },
  rodSob: { name: 'Rodoviária de Sobral', lat: -3.688, lng: -40.349 },
  hotelSob: { name: 'Hotel Convenções · Centro, Sobral', lat: -3.6905, lng: -40.3475 },
  margarida: { name: 'Café Margarida · Centro, Sobral', lat: -3.689, lng: -40.35 },
};

const D = {
  edson: { name: 'Edson R.', car: 'Chevrolet Onix prata', plate: 'OKX-3H91', rating: 4.91 },
  wanessa: { name: 'Wanessa M.', car: 'Hyundai HB20 branco', plate: 'PMD-7C05', rating: 4.97 },
  jorge: { name: 'Jorge L.', car: 'Fiat Argo cinza', plate: 'OLR-1B48', rating: 4.88 },
  tiago: { name: 'Tiago S.', car: 'Volkswagen Gol preto', plate: 'NSE-9A12', rating: 4.79 },
  rosana: { name: 'Rosana C.', car: 'Renault Kwid vermelho', plate: 'PNA-2F66', rating: 4.95 },
  cicero: { name: 'Cícero A.', car: 'Fiat Mobi branco', plate: 'OJK-6D33', rating: 4.84 },
};

const CARD = 'Cartão •••• 4412';
const t = (id, at, from, to, driver, price, minutes, km, payment = CARD) => ({ id, at, from: P[from], to: P[to], driver: D[driver], price, minutes, km, payment });

export default {
  trips: [
    t('b-0807', '2026-08-07T08:48', 'apto', 'colheita', 'edson', 15.4, 15, 4.3),
    t('b-0813', '2026-08-13T22:30', 'dragao', 'apto', 'wanessa', 19.8, 17, 5.2),
    t('b-0826', '2026-08-26T18:40', 'colheita', 'apto', 'tiago', 16.9, 18, 4.4, 'Pix'),
    t('b-0903', '2026-09-03T09:05', 'apto', 'lumina', 'rosana', 20.1, 19, 5.6),
    t('b-0912a', '2026-09-12T12:05', 'rodSob', 'hotelSob', 'jorge', 9.2, 7, 1.9),
    t('b-0912b', '2026-09-12T19:35', 'hotelSob', 'rodSob', 'cicero', 9.6, 7, 1.9),
    t('b-0919a', '2026-09-19T17:20', 'apto', 'dragao', 'wanessa', 18.4, 18, 5.0),
    t('b-0919b', '2026-09-19T22:05', 'dragao', 'apto', 'edson', 19.1, 17, 5.2),
    t('b-0925', '2026-09-25T08:50', 'apto', 'colheita', 'tiago', 15.9, 16, 4.3),
    t('b-0930', '2026-09-30T20:55', 'colheita', 'apto', 'rosana', 17.3, 19, 4.4),
    t('b-0510a', '2026-10-05T08:22', 'apto', 'colheita', 'edson', 14.9, 14, 4.2),
    t('b-0510b', '2026-10-05T18:10', 'colheita', 'dragao', 'jorge', 16.4, 17, 4.0),
    t('b-0510c', '2026-10-05T21:48', 'dragao', 'apto', 'wanessa', 18.7, 17, 5.2),
    t('b-0610a', '2026-10-06T08:40', 'apto', 'colheita', 'cicero', 15.6, 15, 4.3),
    t('b-0610b', '2026-10-06T19:05', 'colheita', 'apto', 'edson', 16.2, 19, 4.4),
    t('b-0710a', '2026-10-07T09:15', 'apto', 'mercado', 'rosana', 11.9, 13, 3.1),
    t('b-0710b', '2026-10-07T11:30', 'mercado', 'lumina', 'tiago', 13.5, 14, 3.4),
    t('b-0710c', '2026-10-07T16:50', 'lumina', 'apto', 'wanessa', 21.3, 24, 6.0),
    t('b-0810a', '2026-10-08T08:35', 'apto', 'colheita', 'jorge', 14.6, 14, 4.2),
    t('b-0810b', '2026-10-08T20:40', 'colheita', 'apto', 'edson', 16.1, 18, 4.4),
    t('b-0910a', '2026-10-09T06:41', 'apto', 'rodFor', 'cicero', 12.4, 11, 2.1),
    t('b-0910b', '2026-10-09T11:36', 'rodSob', 'margarida', 'jorge', 8.9, 6, 1.0, 'Pix'),
    t('b-0910c', '2026-10-09T14:52', 'margarida', 'rodSob', 'tiago', 9.3, 7, 1.0, 'Pix'),
  ],
};
