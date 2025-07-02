import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const SV_URL = 'http://localhost:3000';
const ROTATION_PRECISION = 0.01; // radianos
const UPDATE_INTERVAL = 5; // a cada 5 frames

const socket = io();
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let ethAddress, worker, player, cursors, pointer, lastSentRotation;

const game = new Phaser.Game(config);

function preload() {
  // Cria o sprite para os asteroids
  this.graphics = this.add.graphics();
  this.graphics.fillStyle(0xffffff, 1);
  this.graphics.fillRect(0, 0, 48, 48);
  this.graphics.generateTexture('aster', 48, 48);
  this.graphics.destroy(); // remove do canvas

  // Carrega o sprite do personagem
  this.load.image('player', './sprites/mantis.png');
}

function create() {
  // Mundo de 10000 x 10000
  this.cameras.main.setBounds(0, 0, 10000, 10000);
  this.physics.world.setBounds(0, 0, 10000, 10000);

  // Posição aleatória dentro do mundo
  const spawnX = Phaser.Math.Between(0, 10000);
  const spawnY = Phaser.Math.Between(0, 10000);

  // Adiciona jogador
  player = this.physics.add.sprite(spawnX, spawnY, 'player');
  player.setCollideWorldBounds(true);

  // Câmera segue o jogador
  this.cameras.main.startFollow(player, true);

  // Controles de movimento
  cursors = this.input.keyboard.createCursorKeys();
  pointer = this.input.activePointer;

  lastSentRotation = 0.0;
}

function update() {
  const speed = 300;
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-speed);
  else if (cursors.right.isDown) player.setVelocityX(speed);

  if (cursors.up.isDown) player.setVelocityY(-speed);
  else if (cursors.down.isDown) player.setVelocityY(speed);

  // Aponta para o cursor do mouse (convertido para coordenadas do mundo)
  const worldPoint = pointer.positionToCamera(this.cameras.main);
  const angle = Phaser.Math.Angle.Between(player.x, player.y, worldPoint.x, worldPoint.y)
              + Phaser.Math.DegToRad(90);
  player.setRotation(angle);

  if (this.game.getFrame() % UPDATE_INTERVAL === 0 && socket.id) {
    if (Math.abs(angle - lastSentRotation) < ROTATION_PRECISION) return;
    socket.emit('u', [player.x, player.y, player.rotation]);
    lastSentRotation = angle;
  }
}

async function signAndRegister(addr) {
  const nonceRes = await fetch(`${SV_URL}/register/nonce?address=${addr}`);
  const { nonce } = await nonceRes.json();

  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [nonce, addr],
  });

  const res = await fetch(`${SV_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ethAddress: addr, nonce, signature }),
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

async function startMining () {
  const res = await fetch(`${SV_URL}/task`);
  const { params, type } = await res.json();

  // Cria e roda WebWorker
  worker = new Worker(`../workers/${type}.worker.js`);
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

    await submit.json();
  };
};

connect(() => {
  startMining();
  socket.emit('join', ethAddress);
});

// Responsividade da viewport
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
