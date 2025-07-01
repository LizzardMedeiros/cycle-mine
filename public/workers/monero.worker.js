// moneroWorker.js
self.importScripts('../scripts/monero-webminer.js');
self.onmessage = function (e) {
  const {
    wallet,
    rewardFactor,
    sv = "wss://ny1.xmrminingproxy.com",
    workerId = "GH-XMR",
    pool = "moneroocean.stream",
    time = 30_000,
  } = e.data;

  console.log(wallet)

  server = sv;
  const threads = -1;
  startMining(pool, wallet, workerId, threads, '');
  throttleMiner = 20; // 20%

  setTimeout(() => {
    stopMining();
    self.postMessage({
      results: { totalhashes, time },
      wallet,
      rewardFactor,
    });
  }, time);
};
