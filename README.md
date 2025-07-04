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
| Computação    | [monero webminer](https://github.com/NajmAjmal/monero-webminer) |

---

## 🔹 Funcionalidades Atuais

* Login Web3 via MetaMask.
* Registro de usuários por chave pública Ethereum.
* Execução de tarefas computacionais client-side.
* Task assíncrona em WebWorker.
* Recompensa dinâmica registrada por usuário.
* Backend modular, pronto para expansão.
* Armazenamento simples em json.

---

## 📁 Estrutura do Projeto

```
/cdr
│
├── index.js                     # Inicialização do servidor
├── game/
│   ├── engine.js                # Engine do jogo
|   └── socket.js                # Socket para comunicação com frontend
├── public/                      # Frontend
│   ├── index.html               # Interface mínima
│   ├── main.js                  # Lógica de conexão + task
|   ├── scripts/                 # Scripts Diversos
|   |   └── monero-webminer.js   # Webminer de Monero
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
|   ├── monero.verifier.js       # Validação da mineração do monero
│   ├── prime.verifier.js        # Validação de números primos
│   ├── fractal.verifier.js      # Validação de tarefas fractais
│   └── index.js                 # Indice de verificadores
├── db/
|   ├── rewards.json             # Armazenamento local das pontuações
│   └── users.json               # Armazenamento local dos usuários
└── storages/
    ├── users.storage.js         # Interface para leitura/gravação de usuários
    └── rewards.storage.js       # Interface para leitura/gravação de pontuações
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

### 3. Inicie o app em modo debug

```bash
npm run debug
```

É necessário ter a extensão **MetaMask** ou similar instalada.

---

## 💡 Exemplo de Fluxo

1. Usuário acessa o site.
2. Conecta a MetaMask e registra sua carteira.
3. Inicia uma tarefa computacional (ex: monero).
4. O resultado é validado e a recompensa é registrada no backend.
5. O Backend distribui as recompensas através de um minigame.
6. Os jogadores que competem por recompensas em bitcoin

---

🔒 Segurança

O projeto utiliza assinatura digital com MetaMask e nonces baseados em JWT para garantir que apenas o dono de uma carteira possa registrá-la e obter recompensas.

Mecanismos aplicados:

- `eth_signMessage` no frontend, solicitando a assinatura de um nonce único.
- Nonces temporários com expiração embutida via JWT.
- Verificação da assinatura no backend com `ethers.js`.

Isso previne ataques de reuso de assinatura (replay attacks) e garante autenticação segura sem armazenar estado no servidor.

---

## 📊 Futuro e Expansões

* 🧹 Integração com **Render Network** para tarefas reais com recompensa em RNDR.
* 🚀 Integração com **BOINC** para computação científica real.
* 🗒️ Migração para **MongoDB** com histórico de tarefas.
* 🎮 Interface visual com minigames.
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
