const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'cyclemine-dev-secret';

function createNonceJWT(address) {
  const payload = {
    sub: address.toLowerCase(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3 * 60, // expira em 3 minutos
  };
  return jwt.sign(payload, SECRET);
}

function verifyNonceJWT(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

module.exports = {
  createNonceJWT,
  verifyNonceJWT,
};
