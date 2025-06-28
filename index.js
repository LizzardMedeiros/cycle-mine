require('dotenv/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const verifyRouter = require('./routes/verify.route');
const registerRouter = require('./routes/register.route');

const TaskManager = require('./tasks/TaskManager');

const app = express();
app.use(bodyParser.json());

const { TYPE = 'prime', PORT } = process.env;
const taskManager = new TaskManager(TYPE, { start: 3000000, batchSize: 1000 });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/verify', verifyRouter);
app.use('/register', registerRouter);

// Nova rota para entregar tarefas
app.get('/task', (_req, res) => {
  try {
    const task = taskManager.getNextTask();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

app.listen(3000, () => {
  console.log(`Verifier ${TYPE} running on ${PORT}`);
});
