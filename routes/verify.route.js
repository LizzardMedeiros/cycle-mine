require('dotenv/config');

const express = require('express');
const router = express.Router();
const verifiers = require('../verifiers');
const rewardStorage = require('../storages/rewards.storage');

const { TYPE = 'prime' } = process.env;

router.post('/', async (req, res) => {
  const { params, ethAddress } = req.body;
  try {
    const result = await verifiers[TYPE](params);
    console.log(result);
    await rewardStorage.addScore(ethAddress, result.reward);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal verifier error' });
  }
});

module.exports = router;
