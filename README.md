# 🖤 BlackRoad Operating System

> A nostalgic Windows 95–inspired web operating system powered by AI, blockchain,  
> real-time streaming, and 200+ autonomous agents.  
> Built by **Alexa Louise Amundson** and the BlackRoad OS community.

<!-- DYNAMIC BADGES – auto-updated by GitHub Actions -->
[![CI](https://github.com/blackboxprogramming/BlackRoad-Operating-System/actions/workflows/ci.yml/badge.svg)](https://github.com/blackboxprogramming/BlackRoad-Operating-System/actions/workflows/ci.yml)
[![Backend Tests](https://github.com/blackboxprogramming/BlackRoad-Operating-System/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/blackboxprogramming/BlackRoad-Operating-System/actions/workflows/backend-tests.yml)
[![Deploy to GitHub Pages](https://github.com/blackboxprogramming/BlackRoad-Operating-System/actions/workflows/deploy.yml/badge.svg)](https://github.com/blackboxprogramming/BlackRoad-Operating-System/actions/workflows/deploy.yml)
[![License](https://img.shields.io/github/license/blackboxprogramming/BlackRoad-Operating-System)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/blackboxprogramming/BlackRoad-Operating-System)](https://github.com/blackboxprogramming/BlackRoad-Operating-System/commits/main)

---

## 🚀 Live Demo

| Surface | URL |
|---------|-----|
| **OS Interface** | [blackroad.systems](https://blackroad.systems) |
| **GitHub Pages** | [blackboxprogramming.github.io/BlackRoad-Operating-System](https://blackboxprogramming.github.io/BlackRoad-Operating-System) |
| **API Docs** | [blackroad.systems/api/docs](https://blackroad.systems/api/docs) |

---

## ✨ Features

- 🖥️ **BR-95 Desktop** — retro Windows 95–style UI with a modern brand gradient
- 🤖 **200+ Autonomous Agents** across 10 categories (DevOps, Engineering, Finance, Security, …)
- 🧠 **Local Ollama LLM** — run any model locally, no cloud API key required
- ⛓️ **RoadChain Blockchain** — proof-of-origin for ideas and IP
- 🎮 **Games & Media** — video streaming, browser, games built in
- 🔐 **Identity & Auth** — JWT-based auth with wallet encryption
- 📡 **Real-time WebSocket** — live collaboration via LEITL protocol
- 🌐 **GitHub Pages** — static frontend deployed automatically on every push to `main`

---

## 🏗️ Architecture

```
Browser (Vanilla JS, zero dependencies)
        ↕ HTTP / WebSocket
FastAPI Backend  (Python 3.11, async)
        ↕
┌──────────────┬──────────────┬──────────────┐
│  PostgreSQL  │    Redis     │  Local/Cloud │
│  (primary)   │  (cache/ws)  │  LLM (Ollama)│
└──────────────┴──────────────┴──────────────┘
```

---

## 🤖 Local Ollama Setup

BlackRoad OS ships a built-in proxy for your local [Ollama](https://ollama.com) instance — no OpenAI key needed.

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull a model
ollama pull llama3

# 3. Start Ollama (default: http://localhost:11434)
ollama serve

# 4. Start the backend
cd backend && uvicorn app.main:app --reload

# 5. Chat via API
curl -X POST http://localhost:8000/api/ollama/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages": [{"role": "user", "content": "Hello from BlackRoad OS!"}]}'

# 6. Check available models
curl http://localhost:8000/api/ollama/models
```

**Environment variables** (`.env`):
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3
```

---

## ⚡ Quick Start

```bash
# Clone
git clone https://github.com/blackboxprogramming/BlackRoad-Operating-System.git
cd BlackRoad-Operating-System/backend

# Install dependencies
pip install -r requirements.txt

# Copy env template
cp .env.example .env   # edit as needed

# Run
uvicorn app.main:app --reload
# → http://localhost:8000
```

**Docker Compose** (Postgres + Redis + FastAPI):
```bash
cd backend && docker-compose up
```

---

## 🧪 Tests

```bash
cd backend
pytest tests/ -v
# 51 tests, all green ✅
```

---

## 📂 Repository Structure

| Directory | Purpose |
|-----------|---------|
| `backend/` | FastAPI server, routers, models |
| `backend/static/` | **Canonical frontend** (served at `/`) |
| `agents/` | 200+ autonomous agents |
| `kernel/` | TypeScript kernel for service orchestration |
| `sdk/` | Python & TypeScript client SDKs |
| `docs/` | Architecture documentation |
| `infra/` | DNS & infrastructure configs |

---

## 🔄 Dynamic README Status

<!-- DYNAMIC_STATS_START -->
> Stats auto-updated by the nightly workflow.
<!-- DYNAMIC_STATS_END -->

---

## 📜 License

[GNU General Public License v3.0](LICENSE) © 2025 Alexa Louise Amundson / BlackRoad OS

---

*BlackRoad OS is not affiliated with BlackRock, Inc. or any asset management firm.*

