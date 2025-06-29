const socketIo = require('socket.io');
const userStorage = require('../storages/users.storage');
const rewardStorage = require('../storages/rewards.storage');
const Engine = require('./engine');

module.exports = (...server) => {
  const io = socketIo(...server);
  const usersConnected = new Map();
  const game = new Engine(io);
  game.start();

  // Gerar novos circulos de tempos em tempos
  setInterval(async () => {
    const totalScoreAvailable = await rewardStorage.getScore();
    if (totalScoreAvailable === 0) return;
    game.spawnCircle(totalScoreAvailable);
    await rewardStorage.saveScore([]);
  }, 1_000);

  io.on('connection', async (socket) => {
    console.log(`client ${socket.id} join...`);

    // Eventos
    socket.on('join', async (ethAddress) => {
      const existingUser = await userStorage.findUserByAddress(ethAddress);
      if (!existingUser) return;
      usersConnected.set(socket.id, existingUser);

      io.emit('job:new'); // Emula o envio de um job pra resolver
      io.emit(`${ethAddress}:refresh`, {
        score: (existingUser.rewards || 0.0).toFixed(2),
      });
    });

    socket.on('claim', async (id) => {
      // lógica para capturar o clique no círculo
      const reward = game.claimCircle(id);
      const user = usersConnected.get(socket.id);

      if (!user) return;

      user.rewards = user.rewards || 0.0;
      user.rewards += reward;

      io.emit('job:new');
      usersConnected.forEach((u) => {
        io.emit(`${u.ethAddress}:refresh`, {
          score: (u.rewards || 0.0).toFixed(2),
        });
      })
    });

    socket.on('disconnect', async () => {
      console.log(`client ${socket.id} leave...`);
      const userList = await userStorage.readUsers();
      const user = usersConnected.get(socket.id);

      if (!user) return;

      const newUserList = userList.filter((u) => u.ethAddress !== user.ethAddress);
      newUserList.push(user);
      await userStorage.saveUsers(newUserList);

      usersConnected.delete(socket.id);
      socket.disconnect(0);
    });
  });

  return io;
};
