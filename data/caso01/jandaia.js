// Jandaia — banco de Iara (nuvem). Extrato de agosto a 10/10. Pix de entrada: Colheita Capital (R$ 3.500 mensais, dia 5).

const COLHEITA = { name: 'COLHEITA CAPITAL GESTAO LTDA', doc: '41.208.774/0001-50', bank: 'Banco Mandacaru', key: '41208774000150' };
const IMOB = { name: 'IMOBILIARIA BENFICA LTDA', doc: '08.331.902/0001-14', bank: 'Banco Alvorada' };
const FIBRA = { name: 'FIBRANET TELECOM LTDA', doc: '17.455.021/0001-88', bank: 'Banco Alvorada' };
const MERCADO = { name: 'SUPERMERCADO PAGUE BEM', doc: '10.222.314/0003-60' };
const BORA = { name: 'BORA CORRIDAS', doc: '32.909.553/0001-02' };
const MAE = { name: 'Maria do Socorro Fontenele', doc: '•••.220.318-••', bank: 'Banco do Nordeste Popular', key: '(88) 99430-5562' };
const NANDA = { name: 'Fernanda Lopes', doc: '•••.771.045-••', bank: 'Banco Alvorada', key: 'nanda.lopes@correio.app' };
const LEO = { name: 'Leonardo Fontenele', doc: '•••.509.882-••', bank: 'Banco Alvorada', key: '(85) 98890-3344' };
const STREAM = { name: 'STREAMFLIX SERVICOS DIGITAIS', doc: '25.014.980/0001-30' };
const FOTOBRAS = { name: 'FOTOBRAS COMERCIO DE EQUIPAMENTOS', doc: '12.774.301/0001-07' };
const DELIVERY = { name: 'BOCADO DELIVERY', doc: '30.660.120/0001-45' };

const t = (id, at, type, amount, party, description, category, x = {}) => ({ id, at, type, amount, party, description, category, receipt: true, ...x });

const transactions = [
  /* ---- agosto ---- */
  t('stream-0308', '2026-08-03T12:01', 'credito', 39.90, STREAM, 'Assinatura mensal', 'Lazer'),
  t('colheita-0508', '2026-08-05T09:02', 'pix_in', 3500, COLHEITA, 'Honorários jul/26: freela', 'Renda'),
  t('aluguel-0508', '2026-08-05T09:31', 'boleto', 1450, IMOB, 'Aluguel agosto, apto 204', 'Moradia'),
  t('mercado-0608', '2026-08-06T19:20', 'debito', 87.45, MERCADO, 'Compra no débito', 'Mercado'),
  t('nanda-0708', '2026-08-07T08:41', 'pix_in', 187.40, NANDA, 'internet + luz de julho', 'Moradia'),
  t('bora-0808', '2026-08-08T18:03', 'debito', 54.10, BORA, 'Corrida Benfica → Aldeota', 'Transporte'),
  t('fibra-1008', '2026-08-10T10:15', 'boleto', 99.90, FIBRA, 'Internet 500 Mega', 'Moradia'),
  t('mae-1208', '2026-08-12T10:15', 'pix_out', 300, MAE, 'pra ajudar com a luz, mãe', 'Família'),
  t('farmacia-1408', '2026-08-14T13:22', 'debito', 62.90, { name: 'FARMACIA POPULAR DO CENTRO', doc: '04.118.660/0001-73' }, 'Antialérgico e protetor', 'Saúde'),
  t('delivery-1708', '2026-08-17T20:45', 'debito', 48.00, DELIVERY, 'Pedido noturno', 'Alimentação'),
  t('camila-2108', '2026-08-21T15:30', 'pix_in', 800, { name: 'Camila Bezerra', doc: '•••.664.130-••', bank: 'Banco Alvorada', key: 'camilabezerra@correio.app' }, 'sinal do ensaio gestante', 'Renda'),
  t('renata-2108', '2026-08-21T16:12', 'pix_in', 1400, { name: 'Renata Almeida', doc: '•••.340.972-••', bank: 'Banco Mandacaru', key: '(85) 99211-4058' }, 'reserva da data, clínica', 'Renda'),
  t('camila-2408', '2026-08-24T09:50', 'pix_in', 800, { name: 'Camila Bezerra', doc: '•••.664.130-••', bank: 'Banco Alvorada', key: 'camilabezerra@correio.app' }, 'resto do ensaio, obrigada!', 'Renda'),
  t('tarifa-2808', '2026-08-28T06:00', 'tarifa', 14.90, { name: 'Jandaia' }, 'Pacote de serviços', 'Tarifas'),
  t('mercado-2908', '2026-08-29T18:30', 'debito', 71.20, MERCADO, 'Compra no débito', 'Mercado'),
  t('bora-3008', '2026-08-30T21:10', 'debito', 44.00, BORA, 'Corrida Praia de Iracema → Benfica', 'Transporte'),

  /* ---- setembro ---- */
  t('stream-0309', '2026-09-03T12:01', 'credito', 39.90, STREAM, 'Assinatura mensal', 'Lazer'),
  t('colheita-0509', '2026-09-05T09:00', 'pix_in', 3500, COLHEITA, 'Honorários ago/26: freela', 'Renda'),
  t('aluguel-0509', '2026-09-05T09:40', 'boleto', 1450, IMOB, 'Aluguel setembro, apto 204', 'Moradia'),
  t('padaria-0509', '2026-09-05T15:20', 'debito', 22.50, { name: 'PADARIA TRIGO E MEL', doc: '19.003.447/0001-90' }, 'Compra no débito', 'Alimentação'),
  t('nanda-0609', '2026-09-06T08:50', 'pix_in', 187.40, NANDA, 'internet + luz de agosto', 'Moradia'),
  t('bora-0909', '2026-09-09T17:11', 'debito', 38.60, BORA, 'Corrida Centro → Benfica', 'Transporte'),
  t('fibra-1009', '2026-09-10T10:30', 'boleto', 99.90, FIBRA, 'Internet 500 Mega', 'Moradia'),
  t('mae-1209', '2026-09-12T11:00', 'pix_out', 200, MAE, 'feira da mãe', 'Família'),
  t('leo-1309', '2026-09-13T22:05', 'pix_out', 40, LEO, 'pizza de ontem, primo', 'Lazer'),
  t('nuvem-1609', '2026-09-16T08:00', 'credito', 9.90, { name: 'NUVEM+ ARMAZENAMENTO', doc: '28.455.119/0001-04' }, 'Plano 100 GB', 'Assinaturas'),
  t('bora-1809', '2026-09-18T19:45', 'debito', 55.00, BORA, 'Corrida Benfica → Meireles', 'Transporte'),
  t('renata-2009', '2026-09-20T14:12', 'pix_in', 1400, { name: 'Renata Almeida', doc: '•••.340.972-••', bank: 'Banco Mandacaru', key: '(85) 99211-4058' }, 'saldo do ensaio, clínica', 'Renda'),
  t('fotobras-2309', '2026-09-23T18:05', 'credito', 389.00, FOTOBRAS, 'Filtro polarizador + cartão 128 GB', 'Equipamento'),
  t('bonus-2509', '2026-09-25T10:12', 'pix_in', 20000, COLHEITA, 'Bônus performance', 'Renda'),
  t('devolucao-2509', '2026-09-25T10:40', 'devolucao_out', 20000, COLHEITA, 'Devolução — não aceito', 'Devolução'),
  t('mercado-2509', '2026-09-25T20:30', 'debito', 63.80, MERCADO, 'Compra no débito', 'Mercado'),
  t('moura-2609', '2026-09-26T11:02', 'pix_in', 900, { name: 'Adriana Moura', doc: '•••.118.056-••', bank: 'Banco do Nordeste Popular', key: '(88) 99620-4452' }, 'ensaio da família, obrigada', 'Renda'),
  t('tarifa-2809', '2026-09-28T06:00', 'tarifa', 14.90, { name: 'Jandaia' }, 'Pacote de serviços', 'Tarifas'),
  t('delivery-2909', '2026-09-29T21:12', 'debito', 52.50, DELIVERY, 'Pedido noturno', 'Alimentação'),
  t('bora-3009', '2026-09-30T08:20', 'debito', 29.40, BORA, 'Corrida Benfica → Dom Luís', 'Transporte'),

  /* ---- outubro ---- */
  t('mercado-0210', '2026-10-02T20:10', 'debito', 41.30, MERCADO, 'Compra no débito', 'Mercado'),
  t('stream-0310', '2026-10-03T12:01', 'credito', 39.90, STREAM, 'Assinatura mensal', 'Lazer'),
  t('farmacia-0310', '2026-10-03T16:44', 'debito', 27.80, { name: 'FARMACIA POPULAR DO CENTRO', doc: '04.118.660/0001-73' }, 'Compra no débito', 'Saúde'),
  t('colheita-0510', '2026-10-05T09:00', 'pix_in', 3500, COLHEITA, 'Honorários set/26: freela', 'Renda'),
  t('aluguel-0510', '2026-10-05T09:20', 'boleto', 1450, IMOB, 'Aluguel outubro, apto 204', 'Moradia'),
  t('fatura-0510', '2026-10-05T09:25', 'boleto', 1294.17, { name: 'JANDAIA CARTOES SA', doc: '37.120.094/0001-11' }, 'Fatura do cartão (set)', 'Cartão'),
  t('nanda-0610', '2026-10-06T08:42', 'pix_in', 187.40, NANDA, 'internet + luz de setembro', 'Moradia'),
  t('onibus-0610', '2026-10-06T21:03', 'credito', 89.90, { name: 'EXPRESSO NORTE VIAGENS', doc: '07.560.318/0001-26' }, 'Fortaleza → Sobral, 09/10', 'Transporte'),
  t('dentista-0610', '2026-10-06T21:20', 'pix_out', 80, { name: 'Clínica Sorriso Benfica', doc: '22.188.409/0001-70', bank: 'Banco Alvorada', key: '22188409000170' }, 'sinal da consulta 15/10', 'Saúde'),
  t('van-0710', '2026-10-07T10:32', 'pix_out', 35, { name: 'COOPERATIVA VAN SERRANA', doc: '13.905.620/0001-39', bank: 'Banco do Nordeste Popular', key: 'reservas@vanserrana.com.br' }, 'Reserva van 09/10', 'Transporte'),
  t('luz-0710', '2026-10-07T20:02', 'boleto', 168.32, { name: 'ENERGIA CEARA SA', doc: '07.047.251/0001-70' }, 'Conta de luz setembro', 'Moradia'),
  t('litoral-0710', '2026-10-07T20:05', 'boleto', 79.90, { name: 'LITORAL MOVEL TELECOM', doc: '02.558.157/0001-62' }, 'Plano pós-pago', 'Telefonia'),
  t('fibra-0810', '2026-10-08T12:10', 'boleto', 99.90, FIBRA, 'Internet 500 Mega', 'Moradia'),
  t('delivery-0810', '2026-10-08T20:15', 'debito', 36.00, DELIVERY, 'Pedido noturno', 'Alimentação'),
  t('bora-0910', '2026-10-09T06:12', 'debito', 14.90, BORA, 'Corrida Benfica → Rodoviária', 'Transporte'),
  t('cafe-0910', '2026-10-09T12:40', 'debito', 32.00, { name: 'CAFE MARGARIDA SOBRAL', doc: '31.540.209/0001-02' }, 'Almoço rápido, Sobral', 'Alimentação'),
  t('lanche-0910', '2026-10-09T18:40', 'pix_out', 22.00, { name: 'Lanchonete da Praça', doc: '•••.402.717-••', bank: 'Banco do Nordeste Popular', key: '(88) 99811-6620' }, 'lanche', 'Alimentação'),
  t('padaria-1010', '2026-10-10T09:38', 'pix_out', 18.00, { name: 'PADARIA SABOR DA SERRA', doc: '14.620.083/0001-58', bank: 'Banco do Nordeste Popular', key: '14620083000158' }, 'pão de queijo e café', 'Alimentação'),
  t('pai-1010', '2026-10-10T11:02', 'pix_out', 100, { name: 'Antônio Fontenele', doc: '•••.130.552-••', bank: 'Banco do Nordeste Popular', key: '(88) 99441-7710' }, 'pro senhor tomar uma cervejinha, pai', 'Família'),
  t('mae-1010', '2026-10-10T11:04', 'pix_out', 150, MAE, 'pra mãe comprar o que faltar', 'Família'),
];

export default {
  account: { holder: 'Iara Fontenele', agency: '0481', number: '27719-3', doc: '012.481.117-27', balance: 4312.66, limit: 1705.83 },
  pixKeys: ['iara.fontenele@correio.app', '(85) 98741-2290', '012.481.117-27'],
  transactions,
};
