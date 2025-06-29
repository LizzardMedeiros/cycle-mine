const fs = require('fs').promises;
const path = require('path');

const scoreFile = path.join(__dirname, '../db', 'rewards.json');

// Função para ler o arquivo JSON
async function getScore() {
  try {
    const data = await fs.readFile(scoreFile, 'utf8');
    const scoreList = JSON.parse(data);
    return scoreList.reduce((acc, cur) => {
      return acc + cur.score;
    }, 0);
  } catch (err) {
    // Se arquivo não existir, retorna array vazio
    if (err.code === 'ENOENT') return 0;
    throw err;
  }
}

// Função para salvar o array de usuários no arquivo JSON
async function addScore(ethAddr, score) {
  try {
    const data = await fs.readFile(scoreFile, 'utf8');
    const scoreList = JSON.parse(data);
    scoreList.push({ ethAddr, score });
    await saveScore(scoreList);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    await fs.writeFile(scoreFile, JSON.stringify(
      [{ethAddr, score}],
      null,
      2,
    ));
  }
}

// Função para salvar o array de usuários no arquivo JSON
async function saveScore(scoreList) {
  await fs.writeFile(scoreFile, JSON.stringify(scoreList, null, 2));
}

module.exports = {
  addScore,
  getScore,
  saveScore,
};
