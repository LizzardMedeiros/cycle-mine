self.onmessage = function(e) {
  const { start, end, maxIterations = 100 } = e.data;

  // Calcular array de booleanos indicando se o ponto escapou
  // Mapeamos índice i para coordenadas entre -2 e 2
  function mandelbrotEscapeTest(x0, y0, maxIter) {
    let x = 0, y = 0, iteration = 0;
    while (x*x + y*y <= 4 && iteration < maxIter) {
      const xtemp = x*x - y*y + x0;
      y = 2*x*y + y0;
      x = xtemp;
      iteration++;
    }

    return iteration < maxIter;
  }

  const length = end - start + 1;
  const results = [];

  for(let i = 0; i < length; i++) {
    const x0 = -2 + 4 * (i / length);
    const y0 = -2 + 4 * ((start + i) / (end - start + 1));
    results.push(mandelbrotEscapeTest(x0, y0, maxIterations));
  }

  self.postMessage({ results, range: [start, end], maxIterations });
};
