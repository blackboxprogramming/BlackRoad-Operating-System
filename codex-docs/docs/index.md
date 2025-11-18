# Welcome to BlackRoad OS Codex

> **Version:** 0.1.0 (Phase 2 Scaffold)
> **Last Updated:** 2025-11-18

## What is BlackRoad OS?

BlackRoad OS is a nostalgic Windows 95-inspired web-based operating system that brings together AI orchestration, blockchain technology, social media, video streaming, and gaming into a unified ecosystem.

## Key Features

- **🪟 Windows 95 UI** - Nostalgic desktop experience in your browser
- **🤖 208 AI Agents** - Autonomous agents across 10 categories
- **⛓️ RoadChain** - Tamper-evident blockchain ledger
- **⚡ Prism Console** - Admin and observability dashboard
- **🧠 Lucidia Layer** - Multi-model AI orchestration (Phase 2)
- **🌍 MetaCity** - Virtual worlds and experiences (Phase 3)

## Architecture Overview

BlackRoad OS is built on a 7-layer architecture:

```
Layer 7: User Experience (Domains & Landing Pages)
Layer 6: Application Layer (Pocket OS, Native Apps)
Layer 5: API Gateway & Routing (FastAPI)
Layer 4: Orchestration & Intelligence (Lucidia, Prism, Operator)
Layer 3: Data & State (PostgreSQL, Redis, RoadChain, Vault)
Layer 2: Compute & Infrastructure (Railway, DigitalOcean, Cloudflare Workers)
Layer 1: DNS & CDN (Cloudflare)
```

## Quick Links

- **[Architecture Guide](architecture.md)** - Understand the system design
- **[Components Overview](components.md)** - Explore each module
- **[Getting Started](dev/getting-started.md)** - Start developing
- **[API Reference](api/system.md)** - Explore the API

## Phase 2 Scaffold Status

| Module | Status | Description |
|--------|--------|-------------|
| Backend API | ✅ Complete | FastAPI with system endpoints |
| Core OS Runtime | ✅ Complete | State management and models |
| Operator Engine | ✅ Complete | Job scheduling and orchestration |
| Web Client | ✅ Enhanced | Pocket OS with Core OS client |
| Prism Console | ✅ Complete | Admin dashboard UI |
| Documentation | ✅ Complete | MkDocs-based Codex |

## Repository Structure

```
BlackRoad-Operating-System/
├── backend/              # FastAPI backend
├── core_os/              # Core OS runtime (NEW)
├── operator_engine/      # Operator engine (NEW)
├── prism-console/        # Prism admin UI (NEW)
├── web-client/           # Web client docs (NEW)
├── codex-docs/           # This documentation (NEW)
├── agents/               # 208 AI agents
├── docs/                 # Legacy docs
└── README.md
```

## Next Steps

1. **Explore the Architecture** - Read the [Architecture Guide](architecture.md)
2. **Set Up Locally** - Follow the [Local Setup Guide](dev/local-setup.md)
3. **Review Modules** - Understand each [Component](components.md)
4. **Try the API** - Check out the [API Reference](api/system.md)

## Vision

The ultimate goal is to create a complete AI-powered operating system that enables:

- **Create** - Content, code, and creative works
- **Build** - Infrastructure and applications
- **Operate** - Automated workflows and agents
- **Trade** - Digital assets and tokens
- **Govern** - Decentralized decision-making
- **Dream** - Virtual worlds and experiences
- **Explore** - Research and innovation

## Contributing

See the [Contributing Guide](dev/contributing.md) to learn how to contribute to BlackRoad OS.

## License

BlackRoad Operating System is licensed under the MIT License.

---

**Built with ❤️ by the BlackRoad OS Team**
