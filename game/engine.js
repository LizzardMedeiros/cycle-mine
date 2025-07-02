const { v4: uuidv4 } = require('uuid');

class Asteroid {
  constructor (score) {
    this.id = uuidv4();
    this.x = Math.random();
    this.y = Math.random();
    this.createdAt = Date.now();
    this.score = score || 0.001;
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
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
    this.fps = 10;
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
    this.activeAsteroids.set(aster.id, aster);
  }

  start() {
    const ms = Math.max(1000 / this.fps, 1);
    this.interval = setInterval(() => {
      this.activeAsteroids.forEach((c) => {
        this.io.emit('aster:refresh', c.toJSON());
      });
      this.playerList.forEach((p) => {
        console.clear();
        console.log(p.toJSON());
      })
    }, ms);
  }

  stop() {
    this.activeAsteroids.clear();
    clearInterval(this.interval);
  }
}

module.exports = GameEngine;
