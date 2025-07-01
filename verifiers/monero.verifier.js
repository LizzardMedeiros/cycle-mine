require('dotenv/config');

const { MONERO_WALLET = '0x0', MONERO_TIME = 30_000 } = process.env;

module.exports = (params) => {
  const { results, wallet } = params;
  const [hashRate] = results;

  if (wallet !== MONERO_WALLET) throw new Error('Invalid wallet');

  const p = hashRate / 5_860_000_000; // taxa total da rede -> 5.8GH/s
  const btch = (18 * p) * 0.0029; // Bitcoin por hr... (0.0029 = preço do XMR em BTC)
  const sats = (btch * 100_000_000) / 3600; // Satoshi por segundo

  return {
    hashRate,
    reward: sats * (MONERO_TIME / 1000),
    isValid: true,
  };
};
