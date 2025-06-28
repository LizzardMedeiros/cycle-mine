function verifyFractal(params) {
  const { results, maxIterations, range } = params;

  if (!Array.isArray(results) || typeof maxIterations !== 'number' || !Array.isArray(range)) {
    throw new Error('Invalid parameters for fractal verifier');
  }

  // Vamos fazer uma amostragem aleatória para validar resultados
  // Assumimos results[] contém booleanos: true = ponto escapou, false = ponto dentro do conjunto
  // Para validação, vamos simular o cálculo para 5 índices aleatórios e comparar

  function mandelbrotEscapeTest(x0, y0, maxIter) {
    let x = 0, y = 0, iteration = 0;
    while (x*x + y*y <= 4 && iteration < maxIter) {
      const xtemp = x*x - y*y + x0;
      y = 2*x*y + y0;
      x = xtemp;
      iteration++;
    }
    return iteration < maxIter; // true se escapou
  }

  const [start, end] = range;
  const length = results.length;
  const sampleSize = Math.min(5, length);
  const errors = [];

  for (let i = 0; i < sampleSize; i++) {
    const idx = Math.floor(Math.random() * length);
    // Map index para coordenadas x0, y0 normalizados entre -2 e 2 (exemplo simples)
    const x0 = -2 + 4 * (idx / length);
    const y0 = -2 + 4 * ((start + idx) / (end - start + 1)); 

    const expected = mandelbrotEscapeTest(x0, y0, maxIterations);
    if (results[idx] !== expected) errors.push({ idx, expected, got: results[idx] });
  }

  return {
    isValid: errors.length === 0,
    errors,
    verified: errors.length === 0 ? sampleSize : 0,
    reward: errors.length === 0 ? length * 0.00001 : 0
  };
}

module.exports = verifyFractal;
