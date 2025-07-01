require('dotenv/config');

const { MONERO_WALLET = '0x0', MONERO_TIME = 30_000 } = process.env;

module.exports = (params) => {
  const { results, wallet } = params;
  const { totalhashes, time } = results;

  console.log(totalhashes);

  if (wallet !== MONERO_WALLET) throw new Error('Invalid wallet');
  if (time !== MONERO_TIME) throw new Error('Invalid time');

  const hashRate = totalhashes / time;

  return {
    hashRate,
    isValid: true,
    reward: 0.00001,
  };
};
