const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();
const userStorage = require('../storages/users.storage');
const jwtUtil = require('../utils/jwt.util');

router.get('/nonce', (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Address required' });

  const nonceJWT = jwtUtil.createNonceJWT(address);
  return res.json({ nonce: nonceJWT });
});

router.post('/', async (req, res) => {
  const { ethAddress, nonce, signature } = req.body;

  if (!ethAddress || !nonce || !signature) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    const recovered = ethers.verifyMessage(nonce, signature);

    if (recovered.toLowerCase() !== ethAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Assinatura inválida' });
    }

    const existingUser = await userStorage.findUserByAddress(ethAddress);
    if (existingUser) {
      return res.json({ message: 'User already registered', ethAddress: existingUser.ethAddress });
    }

    const newUser = {
      ethAddress: ethAddress.toLowerCase(),
      score: 0.0,
    };

    await userStorage.addUser(newUser);
    res.json({ message: 'User registered', ethAddress: newUser.ethAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
