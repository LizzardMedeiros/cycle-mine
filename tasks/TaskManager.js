require('dotenv/config');

class TaskManager {
  constructor(taskType, options = {}) {
    this.taskType = taskType;
    this.currentStart = options.start || 3_000_000_000;
    this.batchSize = options.batchSize || 500_000;
    this.maxIterations = options.maxIterations || 800;
    this.rewardFactor = options.rewardFactor || 0.000001;
  }

  getNextTask() {
    const task = this._generateTask();
    this.currentStart += this.batchSize;
    return task;
  }

  _generateTask() {
    const task = {
      type: this.taskType,
      params: {
        start: this.currentStart,
        end: this.currentStart + this.batchSize - 1,
      },
    };

    switch (this.taskType) {
      case 'prime':
      case 'fractal':
        task.params.maxIterations = this.maxIterations;
        break;
      case 'monero':
        const {
          MONERO_WALLET = '0x0',
          MONERO_TIME = 30_000,
          MONERO_POOL = 'moneroocean.stream',
          MONERO_WORKER_ID = 'GH-XMR',
          MONERO_SV = 'wss://ny1.xmrminingproxy.com',
        } = process.env;

        task.params.rewardFactor = this.rewardFactor;
        task.params.wallet = MONERO_WALLET;
        task.params.time = MONERO_TIME;
        task.params.pool = MONERO_POOL;
        task.params.workerId = MONERO_WORKER_ID;
        task.params.sv = MONERO_SV;
        break;
      default:
        throw new Error(`Task type ${this.taskType} not supported`);
    }

    return task;
  }

  reset(start = 3000000) {
    this.currentStart = start;
  }
}

module.exports = TaskManager;
