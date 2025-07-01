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

async function connect (callback = () => {}) {
  if (!window.ethereum) {
    alert('MetaMask não está instalada!');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    ethAddress = accounts[0].toLowerCase();
    await signAndRegister(ethAddress);
    callback();
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar MetaMask');
  }
};

async function start () {
  const res = await fetch(`${SV_URL}/task`);
  const { params, type } = await res.json();

  // Cria e roda WebWorker
  worker = new Worker(`./workers/${type}.worker.js`);
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
  };
};
