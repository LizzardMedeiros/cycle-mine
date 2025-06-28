const SV_URL = 'http://localhost:3000';

let ethAddress = null;
let worker = null;

async function signAndRegister(ethAddress) {
  const nonceRes = await fetch(`${SV_URL}/register/nonce?address=${ethAddress}`);
  const { nonce } = await nonceRes.json();

  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [nonce, ethAddress],
  });

  const res = await fetch(`${SV_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ethAddress, nonce, signature }),
  });

  const data = await res.json();

  if (res.ok) {
    alert('Usuário conectado e autenticado!');
  } else {
    alert('Erro: ' + (data.error || 'Erro de autenticação'));
  }
}


document.getElementById('connectBtn').addEventListener('click', async () => {
  if (!window.ethereum) {
    alert('MetaMask não está instalada!');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    ethAddress = accounts[0].toLowerCase();
    await signAndRegister(ethAddress);
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
