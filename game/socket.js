const socketIo = require('socket.io');
const userStorage = require('../storages/users.storage');
const rewardStorage = require('../storages/rewards.storage');
const Engine = require('./engine');

module.exports = (...server) => {
  const io = socketIo(...server);
  const game = new Engine(io);
  game.start();

  // Gerar novos asteroides
  setInterval(async () => {
    const totalScoreAvailable = await rewardStorage.getScore();
    if (!totalScoreAvailable) return;
    game.spawnAsteroid(totalScoreAvailable);
    await rewardStorage.saveScore([]);
  }, 10_000);

  io.on('connection', async (socket) => {
    console.log(`client ${socket.id} try to login...`);

    // Eventos
    socket.on('join', async (ethAddress) => {
      const existingUser = await userStorage.findUserByAddress(ethAddress);
      if (!existingUser) return;
      const player = game.addPlayer(socket.id);
      player.ethAddress = ethAddress;
      player.score = existingUser.rewards || 0.0;
      console.log(`Player ${socket.id} joined!`);
    });

    socket.on('u', (data) => { // Updating
      const [x, y, a] = data;
      const player = game.getPlayer(socket.id);
      if (!player) return;
      player.x = x;
      player.y = y;
      player.angle = a;
    });

    socket.on('disconnect', async () => {
      console.log(`client ${socket.id} leave...`);

      const userList = await userStorage.readUsers();
      const user = game.getPlayer(socket.id);

      if (!user) return;

      const newUserList = userList.filter((u) => u.ethAddress !== user.ethAddress);
      newUserList.push({
        ethAddress: user.ethAddress,
        score: user.score,
      });
      await userStorage.saveUsers(newUserList);

      game.removePlayer(socket.id);
      socket.disconnect(0);
    });
  });

  return io;
};
