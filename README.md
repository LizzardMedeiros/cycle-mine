# 🧠 MVP — CycleMine Computação Distribuída com Recompensas

## 📌 Visão Geral

Este projeto é um **MVP funcional** de uma rede de computação distribuída executada via navegador. Usuários conectam suas carteiras Ethereum no navegador (MetaMask, Brave Wallet, etc), realizam tarefas computacionais reais (ex: geração de fractais, mineração de criptomoedas, Render Distribuído, Treinamento de modelos de AI, etc) e recebem recompensas proporcionais ao trabalho computado.

A arquitetura é modular, aberta para evoluir e integrar plataformas como **Render Network** (RNDR) e **BOINC** no futuro.

---

## 🔧 Tecnologias Utilizadas

| Camada        | Tecnologia                    |
| ------------- | ----------------------------- |
| Backend       | Node.js + Express             |
| Armazenamento | JSON FileDB (fácil de migrar) |
| Frontend      | HTML + Vanilla JS + WebWorker |
| Web3          | MetaMask / Ethereum           |
| Computação    | Fractal Task (Mandelbrot)     |

---

## 🔹 Funcionalidades Atuais

* Login Web3 via MetaMask.
* Registro de usuários por chave pública Ethereum.
* Execução de tarefas computacionais client-side.
* Task assíncrona em WebWorker.
* Recompensa dinâmica registrada por usuário.
* Backend modular, pronto para expansão.
* Armazenamento simples em `data/users.json`.

---

## 📁 Estrutura do Projeto

```
/cdr
│
├── index.js                     # Inicialização do servidor
├── public/                      # Frontend
│   ├── index.html               # Interface mínima
│   ├── main.js                  # Lógica de conexão + task
│   └── workers/
│       └── fractal.worker.js    # Task executada em paralelo no navegador
├── routes/
│   ├── register.route.js        # Registro/login de usuários
|   └── verify.router.js         # Verificação de trabalho
├── tasks/
|   └── TaskManager.js           # Classe que lida com as tarefas
├── utils/
|   └── prime.util.js            # Ferramentas auxiliares para números primos
├── verifiers/
│   ├── prime.verifier.js        # Validação de números primos
│   ├── fractal.verifier.js      # Validação de tarefas fractais
│   └── index.js                 # Indice de verificadores
├── db/
│   └── users.json               # Armazenamento local dos usuários
├── storage/
│   └── local.storage.js         # Interface para leitura/gravação no JSON
```

---

## ▶️ Como executar localmente

### 1. Clone o projeto

```bash
git clone https://github.com/LizzardMedeiros/cycle-mine.git
cd cycle-mine
```

### 2. Instale dependências

```bash
npm install
```

### 3. Inicie o backend

```bash
npm run debug
```

É necessário ter a extensão **MetaMask** instalada.

---

## 💡 Exemplo de Fluxo

1. Usuário acessa o site.
2. Conecta a MetaMask e registra sua carteira.
3. Inicia uma tarefa computacional (ex: fractal).
4. O resultado é validado e a recompensa é registrada no backend.

---

## 🔒 Segurança

Atualmente, o projeto **não valida a assinatura digital da carteira**.
Para produção, é recomendado utilizar:

* `eth_signMessage` no frontend.
* Verificação de assinatura no backend (usando `ethers.js`).

---

## 📊 Futuro e Expansões

* 🧹 Integração com **Render Network** para tarefas reais com recompensa em RNDR.
* 🚀 Integração com **BOINC** para computação científica real.
* 🗒️ Migração para **MongoDB** com histórico de tarefas.
* 🎮 Interface visual com jogo estilo Asteroids.
* 📊 Leaderboard e painel de progresso.

---

## 🤝 Contribuindo

Fique à vontade para abrir issues, sugestões ou pull requests.
Este projeto é aberto e visa testar o uso consciente de poder computacional para tarefas úteis e recompensadas.

---

## 👨‍🚀 Autor

**LizzardM**
Contato: \[[luis.codemaker@gmail.com](mailto:luis.codemaker@gmail.com)]
Twitter / GitHub / LinkedIn: \[@LizzardMedeiros]
