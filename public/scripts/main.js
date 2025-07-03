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
const asteroidList = new Map();

const game = new Phaser.Game(config);

function preload() {
  // Cria o sprite para os asteroids
  this.graphics = this.add.graphics();
  this.graphics.fillStyle(0xffffff, 1);
  this.graphics.fillRect(0, 0, 256, 256);
  this.graphics.generateTexture('aster', 256, 256);
  this.graphics.destroy(); // remove do canvas

  // Carrega o sprite do personagem
  this.load.image('player', './sprites/mantis.png');
  this.load.image('bg', './sprites/bg.png');
}

function create() {
  this.cameras.main.setBounds(0, 0, 2000, 2000);
  this.physics.world.setBounds(0, 0, 2000, 2000);
  this.bg = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'bg')
    .setOrigin(0, 0)
    .setScrollFactor(0);

  // Posição aleatória dentro do mundo
  const spawnX = Phaser.Math.Between(0, 2000);
  const spawnY = Phaser.Math.Between(0, 2000);

  // Adiciona jogador
  player = this.physics.add.sprite(spawnX, spawnY, 'player');
  player.setCollideWorldBounds(true);

  // Câmera segue o jogador
  this.cameras.main.startFollow(player, true);

  // Controles de movimento
  cursors = this.input.keyboard.createCursorKeys();
  pointer = this.input.activePointer;

  lastSentRotation = 0.0;

  // Eventos
  socket.on('aster:destroy', (id) => {
    const a = asteroidList.get(id);
    if (!a) return;
    a.destroy();
    asteroidList.delete(id);
  });
  socket.on("aster:refresh", (data) => {
    const { id, x, y, a } = data;

    // Se o sprite ainda não existe, cria
    if (!asteroidList.get(id)) {
      const sprite = this.add.sprite(x, y, 'aster');
      sprite.setDisplaySize(64, 64);
      sprite.setRotation(a);
      asteroidList.set(id, sprite);
    }

    asteroidList.forEach((aster) => {
      aster.setRotation(a);
      aster.setPosition(x, y);
    });
  });
}

function update() {
  this.bg.tilePositionX = this.cameras.main.scrollX;
  this.bg.tilePositionY = this.cameras.main.scrollY;

  // Aponta para o cursor do mouse (convertido para coordenadas do mundo)
  const worldPoint = pointer.positionToCamera(this.cameras.main);
  const dx = worldPoint.x - player.x;
  const dy = worldPoint.y - player.y;

  const distance = Math.hypot(dx, dy); // distância euclidiana
  const angle = Math.atan2(dy, dx);
  player.setRotation(angle + Phaser.Math.DegToRad(90));

  // Se o mouse está longe o suficiente, move em direção a ele
  const threshold = 10; // distância mínima para considerar "em cima"
  const speed = 200;

  if (distance > threshold) {
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    player.setVelocity(vx, vy);
  } else player.setVelocity(0);

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
  const width = window.innerWidth;
  const height = window.innerHeight;

  game.scale.resize(width, height);
  if (bg) bg.setSize(width, height);
});
