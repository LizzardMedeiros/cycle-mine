require('dotenv/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const verifyRouter = require('./routes/verify.route');
const registerRouter = require('./routes/register.route');

const socket = require('./game/socket');

const TaskManager = require('./tasks/TaskManager');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const { TYPE = 'prime', PORT } = process.env;
const taskManager = new TaskManager(TYPE);

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

const server = require('http').createServer(app);
server.listen(PORT, () => {
  socket(server);
  console.log(`Verifier ${TYPE} running on ${PORT}`);
});
