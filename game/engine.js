const { v4: uuidv4 } = require('uuid');
const { randomRange } = require('../utils/math.utils');

class Asteroid {
  constructor (score) {
    this.id = uuidv4();
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.createdAt = Date.now();
    this.score = score || 0.001;

    const speed = Math.random() * 20;
    this.velocityX = randomRange(-speed, speed);
    this.velocityY = randomRange(-speed, speed);
    this.angularVelocity = randomRange(-1, 1);
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.a += this.angularVelocity * 0.01;
    this.a = this.a % (2 * Math.PI);
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      a: this.a,
    }
  }
}

class Player {
  constructor (socketId) {
    this.id = socketId || uuidv4();
    this.x = Math.random();
    this.y = Math.random();
    this.createdAt = Date.now();
    this.ethAddress = '0x0';
    this.score = 0.0;
    this.angle = 0.0;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      a: this.angle,
    }
  }
}

class GameEngine {
  constructor(io) {
    this.io = io;
    this.activeAsteroids = new Map();
    this.playerList = new Map();
    this.fps = 60;
    this.roomWidth = 2_000;
    this.roomHeight = 2_000;
    this.interval;
  }

  addPlayer (socketId) {
    const p = new Player(socketId);
    this.playerList.set(socketId, p);
    return p;
  }

  removePlayer (id) {
    this.playerList.delete(id);
  }

  getPlayer (id) {
    return this.playerList.get(id);
  }

  spawnAsteroid(score) {
    const aster = new Asteroid(score);
    aster.x = Math.random() * this.roomWidth;
    aster.y = Math.random() * this.roomHeight;
    this.activeAsteroids.set(aster.id, aster);
  }

  start() {
    const ms = Math.max(1000 / this.fps, 1);
    this.interval = setInterval(() => {
      this.activeAsteroids.forEach((c) => {
        c.update();
        if (
          c.x > this.roomWidth ||
          c.y > this.roomHeight ||
          c.x < 0 ||
          c.y < 0
        ) {
          this.io.emit('aster:destroy', c.id);
          return this.activeAsteroids.delete(c.id);
        }
        this.io.emit('aster:refresh', c.toJSON());
      });
      /* this.playerList.forEach((p) => {
        console.clear();
        console.log(p.toJSON());
      }); */
    }, ms);
  }

  stop() {
    this.activeAsteroids.clear();
    clearInterval(this.interval);
  }
}

module.exports = GameEngine;
