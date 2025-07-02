require('dotenv/config');
const cache = require('../utils/cache.utils');

const { MONERO_WALLET = '0x0', MONERO_TIME = 30_000 } = process.env;

async function getBtcPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=btc';
  const response = await fetch(url);
  const data = await response.json();
  return data.monero.btc;
}

async function getMoneroNetworkStats() {
  // Encontrar uma API online
  return {
    hashrate: 5_340_000_000,     // valor fixo por enquanto
    difficulty: 703_000_000_000, // atualizado manualmente
    rewardXMR: 0.628,            // 628e9 piconero → 0.628 XMR
  };
}

module.exports = async (params) => {
  const { results, wallet } = params;
  const [hashRate] = results;

  if (wallet !== MONERO_WALLET) throw new Error('Invalid wallet');

  const btcPrice = cache.get('btc-price') ||
    cache.create('btc-price', await getBtcPrice());
  const networkStatus = cache.get('xmr-stats') ||
    cache.create('xmr-stats', await getMoneroNetworkStats());

  // Tempo de mineração do bloco XMR
  const timeBlock = networkStatus.difficulty / networkStatus.hashrate;
  // Recompensa em segundos da rede
  const reward = networkStatus.rewardXMR / timeBlock;
  // Proporção do worker
  const ratio = hashRate / networkStatus.hashrate;
  // Ganho estimado
  const gain = reward * ratio;
  const btch = gain * btcPrice; // Bitcoin por segundo
  const sats = btch * 100_000_000 * Number(MONERO_TIME); // Satoshi por ciclo

  return {
    hashRate,
    reward: sats * 10,
    isValid: true,
  };
};
