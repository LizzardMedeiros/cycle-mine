class TaskManager {
  constructor(taskType, options = {}) {
    this.taskType = taskType;
    this.currentStart = options.start || 3000000;
    this.batchSize = options.batchSize || 1000;
  }

  getNextTask() {
    const task = this._generateTask();
    this.currentStart += this.batchSize;
    return task;
  }

  _generateTask() {
    switch (this.taskType) {
      case 'prime':
        return {
          type: 'prime',
          params: {
            start: this.currentStart,
            end: this.currentStart + this.batchSize - 1,
          },
        };
      case 'fractal':
        return {
          type: 'fractal',
          params: {
            start: this.currentStart,
            end: this.currentStart + this.batchSize - 1,
            maxIterations: this.maxIterations,
          },
        };
      // Futuro: outros tipos de tarefa podem ser tratados aqui
      default:
        throw new Error(`Task type ${this.taskType} not supported`);
    }
  }

  reset(start = 3000000) {
    this.currentStart = start;
  }
}

module.exports = TaskManager;
