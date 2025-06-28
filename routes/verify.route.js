require('dotenv/config');

const express = require('express');
const router = express.Router();
const verifiers = require('../verifiers');
const userStorage = require('../storages/local.storage');

const { TYPE = 'prime' } = process.env;

router.post('/', async (req, res) => {
  const { params, ethAddress } = req.body;

  try {
    const result = verifiers[TYPE](params);
    const users = await userStorage.readUsers();
    const usr = users.find((u) => u.ethAddress === ethAddress);
    
    await userStorage.findUserByAddress(ethAddress);
    usr.rewards = usr.rewards || 0.0;
    usr.rewards += result.reward;

    const newUsers = users.filter((u) => u.ethAddress !== ethAddress);
    newUsers.push(usr);

    await userStorage.saveUsers(newUsers);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal verifier error' });
  }
});

module.exports = router;
