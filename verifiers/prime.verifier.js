const { isPrime } = require('../utils/prime.util');

function verifySubset(primes, range, sampleSize = 5) {
  const [start, end] = range;
  const verified = [];
  const errors = [];

  if (!Array.isArray(primes)) return { isValid: false, error: 'Invalid primes format' };

  const indices = [...Array(sampleSize).keys()].map(() =>
    Math.floor(Math.random() * primes.length)
  );

  for (let i of indices) {
    const num = primes[i];
    if (num < start || num > end || !isPrime(num)) {
      errors.push(num);
    } else {
      verified.push(num);
    }
  }

  return {
    verified,
    errors,
    isValid: errors.length === 0
  };
}

function primeVerifier(params) {
  const { range, results } = params;
  if (!range || !results)  throw new Error('Missing range or primes');

  const result = verifySubset(results, range);
  result.reward = result.isValid ? results.length * 0.00001 : 0;

  return result;
}

module.exports = primeVerifier;
