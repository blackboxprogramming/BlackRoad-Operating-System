# BlackRoad OS

**BlackRoad OS is an independent AI orchestration and compliance platform founded by Alexa Louise Amundson.**
It unifies humans, agents, and infrastructure into a single operating system for building auditable, AI-driven organizations.

> **Note:** BlackRoad OS is **not affiliated with BlackRock, Inc.** or any other asset management firm. "BlackRoad" refers exclusively to this founder-led AI ecosystem.

![Black Road OS](https://img.shields.io/badge/OS-BlackRoad-008080)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

This repository is the canonical, meta-level source of truth for BlackRoad OS. It holds shared specs, governance docs, CI standards, and lightweight tooling that orchestrate the deployable satellite services. A small placeholder Express server lives at the root to provide a standardized `/health` endpoint for ops automation; it is **not** a production application.

- **OS spec:** Machine-readable registry at [`os-spec/os-spec.json`](os-spec/os-spec.json) with a short overview in [`docs/OS_SPEC.md`](docs/OS_SPEC.md).
- **Repo unification standard:** Authoritative conventions for satellite repos in [`docs/REPO_UNIFICATION.md`](docs/REPO_UNIFICATION.md).
- **Health dashboard:** Local CLI that pings each service’s `/health` endpoint (`npm run check:health`).

## Related Repositories

The deployable services live in dedicated repositories. This repo orchestrates and documents them:

- [`blackroad-os-core`](https://github.com/blackboxprogramming/blackroad-os-core) — Core API and business logic for the OS.
- [`blackroad-os-api`](https://github.com/blackboxprogramming/blackroad-os-api) — Public API surface area for external integrations.
- [`blackroad-os-operator`](https://github.com/blackboxprogramming/blackroad-os-operator) — Agent runtime and orchestration layer.
- [`blackroad-os-prism-console`](https://github.com/blackboxprogramming/blackroad-os-prism-console) — Operational console and status visualization.
- [`blackroad-os-docs`](https://github.com/blackboxprogramming/blackroad-os-docs) — Documentation site and publishing pipeline.
- [`blackroad-os-web`](https://github.com/blackboxprogramming/blackroad-os-web) — Public marketing and experience layer.

## Deployment / Usage

This repo is documentation- and tooling-first. Do **not** deploy it directly to production. To run the local placeholder server and health check:

```bash
npm install
npm start
# Health endpoint: http://localhost:8080/health
```

Operator utilities such as `npm run check:health`, `npm run deploy:all`, and related scripts help coordinate the satellite services but should be run from a trusted workstation or CI environment.

## Core Entities

- **Alexa Louise Amundson ("Alexa", "Cadillac")**
  Founder and Operator of BlackRoad OS.

- **BlackRoad / BlackRoad OS ("BlackRoad")**
  The overall AI orchestration, compliance, and operating system ecosystem.

- **Cecilia ("Cece", "Giant")**
  Internal AI engineer persona responsible for scaffolding, refactoring, and evolving code, workflows, and infrastructure in the BlackRoad universe.

- **Lucidia**
  A human–AI orchestration language / protocol used inside BlackRoad OS to describe intent, systems, and agents in a way that is human-readable and machine-parseable.

## Overview

BlackRoad OS is a fully functional web-based operating system interface that brings together AI orchestration, blockchain technology, social media, video streaming, and gaming - all wrapped in a nostalgic Windows 95 aesthetic.

## Monorepo as the Source of Truth

All BlackRoad services, apps, and docs now live in this monorepo and sync out automatically to their mirror repositories under the `BlackRoad-OS` GitHub organization. Edit here; automation mirrors to the satellites.

> ### ⚠️ CRITICAL DEPLOYMENT WARNING ⚠️
>
> **This repository is NOT deployed to production.**
>
> - ❌ **DO NOT** add `BlackRoad-Operating-System` to Railway as a service
> - ❌ **DO NOT** deploy this monorepo to any production environment
> - ❌ **DO NOT** reference this repo in service configurations or env vars
> - ❌ **DO NOT** publish the legacy `blackroad-os` static bundle; only ship the
>   canonical UI that lives under `backend/static/`
>
> **Deploy ONLY the satellite repositories:**
> - `blackroad-os-core` (Core API)
> - `blackroad-os-api` (Public API)
> - `blackroad-os-operator` (Agent Runtime)
> - `blackroad-os-prism-console` (Status Console)
> - `blackroad-os-docs` (Documentation)
> - `blackroad-os-web` (Public Website)
> - **Never deploy `BlackRoad-Operating-System` itself** — Railway, GoDaddy, and
>   Pages should point at the satellites above, not this repo
>
> **This repo is the source of truth for code**, but **satellites are the deployable services**.
>
> **See**: `DEPLOYMENT_ARCHITECTURE.md` for complete deployment model.

### Canonical layout

- `services/core-api` → `BlackRoad-OS/blackroad-os-core`
- `services/public-api` → `BlackRoad-OS/blackroad-os-api`
- `services/operator` → `BlackRoad-OS/blackroad-os-operator`
- `apps/prism-console` → `BlackRoad-OS/blackroad-os-prism-console`
- `apps/web` → `BlackRoad-OS/blackroad-os-web`
- `docs/site` → `BlackRoad-OS/blackroad-os-docs`

The mapping is machine-readable at `infra/github/sync-config.yml`, and the sync process is documented in `docs/os/monorepo-sync.md`.

## Health dashboard (local)

Run the lightweight status CLI against all satellite services defined in the OS spec:

```bash
npm install
npm run check:health
```

The script reads `os-spec/os-spec.json` and prints a status table. It is intended for operator use; production monitoring should still live in deployed observability stacks.

## OS Control Commands

- `npm run deploy:all`
- `npm run deploy:service -- <id>`
- `npm run health:all`
- `npm run health:matrix`
- `npm run env:check`
- `npm run repair`

## Features

### 🤖 AI & Communication
- **RoadMail** - Email client for managing communications
- **BlackRoad Social** - Social network for the BlackRoad community
- **AI Assistant** - Interactive AI chat interface

### ⛓️ Blockchain Infrastructure
- **RoadChain Explorer** - View blocks, transactions, and network stats
- **RoadCoin Miner** - Mine RoadCoin cryptocurrency
- **Wallet** - Manage your RoadCoin assets

### 🎮 Gaming Ecosystem
- **Road City** - City-building simulation game
- **RoadCraft** - Voxel world building game
- **Road Life** - Life simulation game

### 🌐 Web & Tools
- **RoadView Browser** - Web browser for the information superhighway
- **BlackStream** - Decentralized video platform
- **Terminal** - Command-line interface
- **File Explorer** - File management system
- **GitHub Integration** - Repository management
- **Raspberry Pi Manager** - Connected device management

## Getting Started

### Quick Start

> 🔑 **Canonical UI entry point:** `backend/static/index.html`

The desktop interface is bundled with the FastAPI backend so it can load data
from the API without breaking features. Use the backend server (locally or in
Railway/GoDaddy) to serve the UI instead of opening the HTML file directly.

```bash
# Clone the repository
git clone https://github.com/blackboxprogramming/BlackRoad-Operating-System.git
cd BlackRoad-Operating-System

# Start the FastAPI backend (serves backend/static/index.html)
cd backend
python -m venv .venv && source .venv/bin/activate  # optional but recommended
pip install -r requirements.txt
uvicorn app.main:app --reload

# Visit the desktop UI
# -> http://localhost:8000/ serves backend/static/index.html
```

### GitHub Pages / GoDaddy Deployment

Only the static UI should be served from GitHub Pages or GoDaddy. The backend API and services continue to run on Railway so they remain isolated from the static hosting tier.

The default `Deploy to GitHub Pages` workflow now bundles the canonical front-end (everything under `backend/static` plus root-level assets such as `index.html`) into a temporary `dist/` directory before uploading it. This ensures that Pages/GoDaddy only receives the static bundle, while the backend code stays out of the artifact and continues to deploy independently to Railway.

To publish manually without the workflow:

1. Copy the contents of `backend/static/` and any required root assets into a temporary folder (e.g., `dist/`).
2. Upload that folder to your Pages or GoDaddy hosting destination.
3. Keep the backend running on Railway so the static UI can communicate with the live services.
For cloud deployments (Railway, GoDaddy, etc.), make sure that
`backend/static/index.html` is the file exposed at `/` so the UI can talk to the
API routes that live under `/api/*`.

### GitHub Pages Deployment

The GitHub Pages workflow publishes the canonical frontend from
`backend/static/`. If you customize the UI, edit
`backend/static/index.html` (and any supporting assets in that directory) so
the validation and deploy jobs keep pointing at the same file.

### Railway Secrets & Automation

- **Vercel-free deploys** – the backend ships with a Railway-native workflow
  (`Deploy to Railway`) so you can ignore Vercel entirely.
- **Single source of truth** – `backend/.env.example` enumerates every runtime
  variable and uses obvious placeholders so you can paste the file into the
  Railway variables dashboard without leaking credentials.
- **CI enforcement** – the GitHub Action `Railway Secrets & Automation Audit`
  runs `scripts/railway/validate_env_template.py` on every PR + nightly to make
  sure the template, `railway.toml`, and `railway.json` never drift from the
  FastAPI settings.
- **Manual check** – run `python scripts/railway/validate_env_template.py`
  locally to get the same assurance before pushing.

## Testing

Backend tests run against an isolated SQLite database by default. A helper
script bootstraps a virtual environment, installs dependencies, and executes
pytest with sensible defaults for local development.

```bash
# From the repo root
bash scripts/run_backend_tests.sh
```

The script exports `ENVIRONMENT=testing`, points `TEST_DATABASE_URL` to a local
`test.db` SQLite file (override it to point at Postgres if needed), and sets
`ALLOWED_ORIGINS` so CORS validation passes during the suite. To rerun tests
inside the prepared environment manually:

```bash
cd backend
source .venv-tests/bin/activate
pytest -v --maxfail=1
```

## Architecture

### Single-Page Application
BlackRoad OS is built as a single-page HTML application with embedded CSS and JavaScript:
- No build process required
- No external dependencies
- Pure HTML/CSS/JavaScript
- Works offline

### Window Management
- Draggable windows
- Minimize/Maximize/Close functionality
- Z-index management for window layering
- Taskbar integration with active window tracking

### Design Philosophy
- **Nostalgic**: Windows 95-inspired UI with authentic styling
- **Complete**: Full ecosystem of interconnected applications
- **Immersive**: Desktop icons, start menu, taskbar, and system tray
- **Interactive**: Functional window management and application switching

## Technology Stack

- **HTML5** - Structure and content
- **CSS3** - Styling with Grid and Flexbox
- **Vanilla JavaScript** - Window management and interactivity
- **No frameworks** - Pure, dependency-free code

## Components

### Desktop Environment
- Grid-based icon layout
- Double-click to launch applications
- Teal background (classic Windows 95)

### Window System
- Title bars with app icons and names
- Window controls (minimize, maximize, close)
- Menu bars and toolbars
- Content areas with custom layouts

### Taskbar
- Start button with menu
- Application switcher
- System tray icons
- Live clock

### Applications
Each application has its own custom interface:
- Email client with folders and preview pane
- Social media feed with posts and interactions
- Video platform with player and recommendations
- Blockchain explorer with live network stats
- Mining dashboard with real-time metrics
- Games with pixel art graphics

## Customization

### Adding New Applications

1. **Create the window HTML structure**:
```html
<div id="my-app" class="window" style="left: 100px; top: 100px; width: 600px; height: 400px;">
    <div class="title-bar" onmousedown="dragStart(event, 'my-app')">
        <div class="title-text">
            <span>🎨</span>
            <span>My App</span>
        </div>
        <div class="title-buttons">
            <div class="title-button" onclick="minimizeWindow('my-app')">_</div>
            <div class="title-button" onclick="maximizeWindow('my-app')">□</div>
            <div class="title-button" onclick="closeWindow('my-app')">×</div>
        </div>
    </div>
    <div class="window-content">
        <!-- Your app content here -->
    </div>
</div>
```

2. **Add desktop icon**:
```html
<div class="icon" ondblclick="openWindow('my-app')">
    <div class="icon-image">🎨</div>
    <div class="icon-label">My App</div>
</div>
```

3. **Add to start menu**:
```html
<div class="start-menu-item" onclick="openWindow('my-app'); toggleStartMenu();">
    <span style="font-size: 18px;">🎨</span>
    <span>My App</span>
</div>
```

4. **Add to taskbar titles** (in JavaScript):
```javascript
const titles = {
    // ... existing titles
    'my-app': '🎨 MyApp'
};
```

## Browser Compatibility

BlackRoad OS works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Windows 95 and the nostalgic computing era
- Built with love for the BlackRoad ecosystem
- Special thanks to the AI development community

## Project Vision

BlackRoad OS represents a complete AI-powered ecosystem:
- **1000+ AI agents** working in harmony
- **Blockchain infrastructure** with RoadChain
- **Decentralized applications** for social media and video
- **Gaming experiences** that blend creativity and strategy
- **Developer tools** for building the future

## Support

For issues, questions, or contributions, please visit:
- GitHub Issues: [Report a bug](https://github.com/blackboxprogramming/BlackRoad-Operating-System/issues)
- Discussions: Share ideas and ask questions

---

**Built with 💻 by the BlackRoad community**

*Where AI meets the open road* 🛣️
