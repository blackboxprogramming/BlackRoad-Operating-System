# BlackRoad Operating System

**The Operating System for Governed AI**

Master monorepo for BlackRoad OS — a platform that unifies identity management, AI orchestration, and quantum computing under a single governed architecture. Built with TypeScript, Python, and deployed across a sovereign Raspberry Pi fleet.

## Products

### RoadAuth — Identity & Access Management
AI-powered IAM with 4 security agents (Sentinel, Auditor, Enforcer, Provisioner). SOC 2, HIPAA, FedRAMP compliance built in. JWT + Paseto tokens, WebAuthn, OAuth2/LDAP/SAML/SCIM 2.0.

### Lucidia — AI with Memory
Conversational AI with persistent memory and multi-service orchestration. 108 local models via Ollama. Sovereign — runs on your hardware.

### Quantum Framework
State-vector quantum circuit simulator with VQE, QAOA, Grover's, QFT implementations. Visual circuit designer at circuits.blackroad.io.

## Architecture

```
┌────────────────────────────────────────────────────┐
│                   BlackRoad OS                      │
├──────────────┬──────────────┬──────────────────────┤
│   apps/      │   backend/   │   services/          │
│   web UI     │   Python API │   core-api, codex,   │
│   prism      │   FastAPI    │   analytics, aiops   │
│   console    │   alembic    │   operator engine    │
├──────────────┴──────────────┴──────────────────────┤
│   agents/        │   sdk/         │   kernel/       │
│   base classes   │   Python SDK   │   TypeScript    │
│   categories     │   TypeScript   │   core runtime  │
│   templates      │   SDK          │                 │
├──────────────────┴────────────────┴─────────────────┤
│              Infrastructure Layer                    │
│   deploy/ · infra/ · ops/ · scripts/                │
│   Docker · Railway · Cloudflare Workers             │
└─────────────────────────────────────────────────────┘
```

## Project Structure

```
├── agents/          # AI agent framework (base, categories, templates)
├── apps/            # Web applications (prism-console, web client, docs)
├── backend/         # Python API server (FastAPI, Docker, alembic)
├── blackroad-os/    # Core OS web interface and Lucidia shell
├── kernel/          # TypeScript kernel runtime
├── sdk/             # Python and TypeScript SDKs
├── services/        # Microservices (core-api, codex, analytics, aiops, operator)
├── deploy/          # Deployment configurations
├── infra/           # Infrastructure as code
├── scripts/         # Automation and deployment scripts
├── tools/           # Health checks and utilities
├── server.mjs       # Main Node.js server
├── package.json     # Node.js project configuration
└── requirements.txt # Python dependencies
```

## Quickstart

```bash
git clone https://github.com/blackboxprogramming/BlackRoad-Operating-System.git
cd BlackRoad-Operating-System

# Node.js server
npm install
npm start

# Python backend
cd backend
pip install -r requirements.txt
python run.py

# Health check
npm run check:health
```

## Services

| Service | Description |
|---------|-------------|
| `core-api` | Central API gateway |
| `codex` | AI code generation service |
| `analytics` | Usage and performance analytics |
| `aiops` | AI operations and monitoring |
| `operator` | Fleet management and orchestration |
| `public-api` | External-facing API |

## Infrastructure

- **5 Raspberry Pi 5 nodes** — WireGuard mesh network
- **52 TOPS AI acceleration** — 2x Hailo-8 accelerators
- **108 local models** — Ollama bridge on sovereign hardware
- **18 Cloudflare tunnels** — Edge routing for 48+ domains
- **Docker Swarm** — Container orchestration across fleet

## Related Repositories

| Repo | Description |
|------|-------------|
| [lucidia](https://github.com/blackboxprogramming/lucidia) | AI with persistent memory |
| [lucidia-cli](https://github.com/blackboxprogramming/lucidia-cli) | Sovereign coding CLI |
| [quantum-math-lab](https://github.com/blackboxprogramming/quantum-math-lab) | Quantum circuit simulator |
| [blackroad-api-sdks](https://github.com/blackboxprogramming/blackroad-api-sdks) | JS, Python, Go, Ruby SDKs |
| [blackroad-scripts](https://github.com/blackboxprogramming/blackroad-scripts) | 400+ automation scripts |
| [context-bridge](https://github.com/blackboxprogramming/context-bridge) | Persistent memory layer |

## Links

- [blackroad.io](https://blackroad.io)
- [docs.blackroad.io](https://docs.blackroad.io)
- [circuits.blackroad.io](https://circuits.blackroad.io)
- [simulator.blackroad.io](https://simulator.blackroad.io)

## License

Copyright 2026 BlackRoad OS, Inc. — Alexa Amundson. All rights reserved.
