const fs = require('fs').promises;
const path = require('path');

const usersFile = path.join(__dirname, '../db', 'users.json');

// Função para ler o arquivo JSON
async function readUsers() {
  try {
    const data = await fs.readFile(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Se arquivo não existir, retorna array vazio
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Função para salvar o array de usuários no arquivo JSON
async function saveUsers(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

// Função para buscar usuário por ethAddress
async function findUserByAddress(ethAddress) {
  const users = await readUsers();
  return users.find(u => u.ethAddress.toLowerCase() === ethAddress.toLowerCase());
}

// Função para adicionar usuário novo
async function addUser(user) {
  const users = await readUsers();
  users.push(user);
  await saveUsers(users);
}

module.exports = {
  readUsers,
  saveUsers,
  findUserByAddress,
  addUser,
};
