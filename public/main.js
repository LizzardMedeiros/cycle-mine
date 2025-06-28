const SV_URL = 'http://localhost:3000';

let ethAddress = null;
let worker = null;

document.getElementById('connectBtn').addEventListener('click', async () => {
  if (!window.ethereum) {
    alert('MetaMask não está instalada!');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    ethAddress = accounts[0].toLowerCase();

    const res = await fetch(`${SV_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ethAddress }),
    });

    if (res.ok) {
      alert('Usuário conectado: ' + ethAddress);
      document.getElementById('startTaskBtn').disabled = false;
    } else {
      const data = await res.json();
      alert('Erro: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar MetaMask');
  }
});

document.getElementById('startTaskBtn').addEventListener('click', async () => {
  const res = await fetch(`${SV_URL}/task`);
  const { params, type } = await res.json();

  // Cria e roda WebWorker
  switch (type) {
    case 'prime':
      worker = new Worker('./workers/prime.worker.js');
      break;
    case 'fractal':
      worker = new Worker('./workers/fractal.worker.js');
      break;
    default:
      throw new Error('Invalid task');
  }

  worker.postMessage(params);
  worker.onmessage = async (event) => {
    const submit = await fetch(`${SV_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ethAddress,
        params: event.data,
      }),
    });

    const confirm = await submit.json();
    console.log(confirm);
    alert('Task finalizada. Resultado enviado com sucesso!');
  };
});
