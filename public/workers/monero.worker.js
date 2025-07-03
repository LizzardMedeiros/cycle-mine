// moneroWorker.js
self.importScripts('../scripts/webminer.js');
self.onmessage = function (e) {
  const {
    wallet,
    sv = "wss://ny1.xmrminingproxy.com",
    workerId = "GH-XMR",
    pool = "moneroocean.stream",
    time = 30_000,
  } = e.data;

  server = sv;
  const threads = -1;
  startMining(pool, wallet, workerId, threads);
  throttleMiner = 20; // 20%

  setInterval(() => {
    self.postMessage({
      results: [totalhashes / (time / 1000)],
      wallet,
    });
    totalhashes = 0;
  }, time);
};