const express = require('express');
const router = express.Router();
const userStorage = require('../storages/local.storage');

router.post('/', async (req, res) => {
  const { ethAddress } = req.body;
  if (!ethAddress) {
    return res.status(400).json({ error: 'ETH address is required' });
  }
  try {
    const existingUser = await userStorage.findUserByAddress(ethAddress);
    if (existingUser) {
      return res.json({ message: 'User already registered', ethAddress: existingUser.ethAddress });
    }
    const newUser = { ethAddress: ethAddress.toLowerCase(), createdAt: new Date().toISOString() };
    await userStorage.addUser(newUser);
    res.json({ message: 'User registered', ethAddress: newUser.ethAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
