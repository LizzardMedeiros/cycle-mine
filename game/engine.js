const { v4: uuidv4 } = require('uuid');

class Circle {
  constructor (score) {
    this.id = uuidv4();
    this.x = Math.random(); // normalizar: frontend escala pela tela
    this.y = Math.random();
    this.radius = 0.05 + Math.random() * 0.1;
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
    this.createdAt = Date.now();
    this.score = score || 0.001;
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      radius: this.radius,
      color: this.color,
    }
  }
}

class GameEngine {
  constructor(io) {
    this.io = io;
    this.activeCircles = new Map();
    this.fps = 10;
    this.interval;
  }

  spawnCircle(score) {
    const circle = new Circle(score);
    this.activeCircles.set(circle.id, circle);
  }

  claimCircle(circleId) {
    const circle = this.activeCircles.get(circleId);
    if (!circle) return;

    this.activeCircles.delete(circleId);
    this.io.emit('circle:claimed', circleId);

    return circle.score;
  }

  start() {
    const ms = Math.max(1000 / this.fps, 1);
    this.interval = setInterval(() => {
      this.activeCircles.forEach((c) => {
        this.io.emit('circle:refresh', c.toJSON());
      });
    }, ms);
  }

  stop() {
    this.activeCircles = new Map();
    clearInterval(this.interval);
  }
}

module.exports = GameEngine;
