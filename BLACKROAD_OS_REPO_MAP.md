# BlackRoad OS Repository Map

> **Version:** Phase 2 Scaffold
> **Last Updated:** 2025-11-18
> **Branch:** `claude/os-phase2-scaffold-01LKeSDWFNBtXhhsV2xMbM4T`

## Overview

This document maps all Phase 2 scaffolded components within the BlackRoad-Operating-System monorepo.

## Repository Structure

All components are housed in the **single monorepo**:
- **Repo:** `blackboxprogramming/BlackRoad-Operating-System`
- **Approach:** Monorepo with modular services
- **Future:** May extract to separate repos if needed

---

## Component Map

### 1. Backend API

| Property | Value |
|----------|-------|
| **Location** | `backend/` |
| **Language** | Python (FastAPI) |
| **New Endpoints** | `/api/system/version`, `/api/system/config/public`, `/api/system/os/state` |
| **Tests** | `backend/tests/test_system.py` |
| **CI Workflow** | `.github/workflows/backend-tests.yml` |
| **Run Command** | `cd backend && uvicorn app.main:app --reload` |
| **API Docs** | `http://localhost:8000/api/docs` |

**Key Features:**
- 30+ existing API routers
- New system endpoints for OS integration
- JWT authentication
- PostgreSQL + Redis integration

**How to Run:**
```bash
cd backend
uvicorn app.main:app --reload
```

---

### 2. Core OS Runtime

| Property | Value |
|----------|-------|
| **Location** | `core_os/` |
| **Language** | Python |
| **Key Files** | `models.py`, `state.py`, `adapters/api_client.py` |
| **Tests** | `core_os/tests/` |
| **CI Workflow** | `.github/workflows/core-os-tests.yml` |
| **README** | `core_os/README.md` |

**Key Features:**
- `UserSession`, `Window`, `OSState` models
- State management functions (open_window, close_window, etc.)
- Backend API adapter for communication
- In-memory state storage (future: Redis/PostgreSQL)

**How to Run:**
```python
from core_os import get_initial_state, open_window
state = get_initial_state()
state = open_window("notepad")
```

---

### 3. Operator Engine

| Property | Value |
|----------|-------|
| **Location** | `operator_engine/` |
| **Language** | Python |
| **Key Files** | `jobs.py`, `scheduler.py`, `server.py` |
| **Tests** | `operator_engine/tests/` |
| **CI Workflow** | `.github/workflows/operator-tests.yml` |
| **Run Command** | `python -m operator_engine.server` |
| **README** | `operator_engine/README.md` |

**Key Features:**
- In-memory job registry with example jobs
- Simple interval-based scheduler
- Optional HTTP API on port 8001
- Job lifecycle management (pending, running, completed, failed)

**How to Run:**
```bash
# As a library
python -c "from operator_engine import Scheduler; print('OK')"

# As a service
python -m operator_engine.server
# Visit http://localhost:8001/docs
```

---

### 4. Web Client (Pocket OS)

| Property | Value |
|----------|-------|
| **Location** | `backend/static/` (primary), `web-client/` (docs) |
| **Language** | JavaScript (Vanilla), HTML, CSS |
| **New File** | `backend/static/js/core-os-client.js` |
| **CI Workflow** | `.github/workflows/ci.yml` (HTML/JS validation) |
| **Run Command** | Served by backend at `http://localhost:8000/` |
| **README** | `web-client/README.md` |

**Key Features:**
- Windows 95-style desktop UI
- New `CoreOSClient` class for API integration
- Event-driven architecture
- Zero dependencies

**How to Run:**
```bash
# Start backend (serves frontend at /)
cd backend
uvicorn app.main:app --reload

# Visit http://localhost:8000/
```

**New in Phase 2:**
```javascript
await window.coreOS.initialize();
const version = await window.coreOS.getVersion();
console.log('OS Version:', version.version);
```

---

### 5. Prism Console

| Property | Value |
|----------|-------|
| **Location** | `prism-console/` |
| **Language** | HTML, CSS, JavaScript |
| **Entry Point** | `prism-console/index.html` |
| **Run Command** | `cd prism-console && python -m http.server 8080` |
| **README** | `prism-console/README.md` |

**Key Features:**
- Modern dark-themed admin UI
- Multi-tab navigation (Overview, Jobs, Agents, Logs, System)
- System metrics dashboard
- Backend API integration
- Auto-refresh every 30 seconds

**How to Run:**
```bash
# Standalone
cd prism-console
python -m http.server 8080
# Visit http://localhost:8080/

# Or integrate with backend (future)
# Visit http://localhost:8000/prism
```

---

### 6. Documentation (Codex)

| Property | Value |
|----------|-------|
| **Location** | `codex-docs/` |
| **Technology** | MkDocs + Material theme |
| **Config** | `codex-docs/mkdocs.yml` |
| **Source** | `codex-docs/docs/` |
| **CI Workflow** | `.github/workflows/docs-build.yml` |
| **Run Command** | `cd codex-docs && mkdocs serve` |
| **README** | `codex-docs/README.md` |

**Key Features:**
- Complete system documentation
- Architecture guides
- Component documentation
- API reference
- Development guides

**How to Run:**
```bash
cd codex-docs
pip install mkdocs mkdocs-material mkdocstrings
mkdocs serve
# Visit http://localhost:8000
```

---

## CI/CD Workflows

All workflows in `.github/workflows/`:

| Workflow | Triggers | Tests | Artifact |
|----------|----------|-------|----------|
| `backend-tests.yml` | backend/* changes | Backend API + system endpoints | Test results |
| `core-os-tests.yml` | core_os/* changes | Core OS models + state management | Test results |
| `operator-tests.yml` | operator_engine/* changes | Operator jobs + scheduler | Test results |
| `docs-build.yml` | codex-docs/* changes | MkDocs build | Documentation site |
| `ci.yml` | HTML/JS changes | HTML/JS validation | - |

---

## Integration Flow

### User Request Flow

```
User Browser
    ↓
Web Client (Pocket OS)
    ├── core-os-client.js
    ├── Calls: GET /api/system/version
    └── Calls: GET /api/system/os/state
    ↓
Backend API (FastAPI)
    ├── /api/system/version → system.py router
    ├── /api/system/config/public → system.py router
    └── /api/system/os/state → system.py router (stub)
    ↓
Core OS Runtime (future integration)
    ├── get_current_state()
    └── Returns OSState with windows, desktop, etc.
```

### Admin/Ops Flow

```
Admin Browser
    ↓
Prism Console
    ├── prism.js
    ├── Calls: GET /api/system/version
    ├── Calls: GET /api/system/config/public
    └── Calls: GET /api/operator/jobs (future)
    ↓
Backend API
    ↓
Operator Engine (future integration)
    ├── list_jobs()
    └── execute_job(job_id)
```

---

## Request Path Examples

### Example 1: Get System Version

**Client Code:**
```javascript
const version = await window.coreOS.getVersion();
```

**HTTP Request:**
```
GET /api/system/version
```

**Backend Route:**
```python
# backend/app/routers/system.py
@router.get("/version")
async def get_version():
    return {
        "version": settings.APP_VERSION,
        "build_time": datetime.utcnow().isoformat(),
        "env": settings.ENVIRONMENT,
    }
```

**Response:**
```json
{
  "version": "1.0.0",
  "build_time": "2025-11-18T12:00:00",
  "env": "development",
  "git_sha": "abc12345"
}
```

---

### Example 2: Get Public Config

**Client Code:**
```javascript
const config = await window.coreOS.getPublicConfig();
```

**HTTP Request:**
```
GET /api/system/config/public
```

**Response:**
```json
{
  "environment": "development",
  "app_name": "BlackRoad Operating System",
  "version": "1.0.0",
  "features": {
    "blockchain_enabled": true,
    "ai_agents_enabled": true,
    "video_streaming_enabled": true
  },
  "limits": {
    "max_upload_size_mb": 100,
    "session_timeout_minutes": 60
  },
  "external_services": {
    "github_integration": true,
    "stripe_enabled": false,
    "openai_enabled": true
  }
}
```

---

### Example 3: Initialize OS (Client-side)

**Client Code:**
```javascript
const result = await window.coreOS.initialize();
console.log('Version:', result.version);
console.log('Config:', result.config);
console.log('State:', result.state);
```

**Makes 3 parallel requests:**
1. `GET /api/system/version`
2. `GET /api/system/config/public`
3. `GET /api/system/os/state`

---

## Testing Each Component

### Backend API
```bash
cd backend
pytest tests/test_system.py -v
```

### Core OS
```bash
pytest core_os/tests/ -v
```

### Operator Engine
```bash
pytest operator_engine/tests/ -v
```

### Web Client
```bash
# Start backend
cd backend && uvicorn app.main:app --reload

# Open browser: http://localhost:8000/
# Open console: Should see "Core OS Client loaded (v0.1.0)"
# Run: await window.coreOS.initialize()
```

### Prism Console
```bash
cd prism-console
python -m http.server 8080

# Visit http://localhost:8080/
# Should see system metrics dashboard
```

### Documentation
```bash
cd codex-docs
mkdocs build
# Check for errors in build output
```

---

## File Count Summary

| Component | Files Created | Tests | CI Workflows |
|-----------|--------------|-------|--------------|
| Backend API | 1 new router | 1 test file | Existing |
| Core OS | 6 files | 2 test files | 1 new workflow |
| Operator Engine | 7 files | 2 test files | 1 new workflow |
| Web Client | 2 files | Manual | Existing |
| Prism Console | 4 files | Manual | None yet |
| Documentation | 10+ files | Build test | 1 new workflow |

**Total New Files:** ~30+
**Total New Tests:** 5 test files
**Total New Workflows:** 3 CI workflows

---

## Environment Variables

All modules share these environment variables (set in `backend/.env`):

```bash
# Core
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here

# Application
APP_NAME="BlackRoad Operating System"
APP_VERSION="1.0.0"
ENVIRONMENT=development

# Operator
SCHEDULER_INTERVAL_SECONDS=60
MAX_CONCURRENT_JOBS=5

# External (optional)
GITHUB_TOKEN=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
```

---

## Next Steps (Post-PR)

1. **Merge PR** - Review and merge this scaffold
2. **Deploy to Railway** - Test in production
3. **Integrate Core OS** - Connect backend API to core_os module
4. **Enable Prism Route** - Serve Prism at `/prism` from backend
5. **Add WebSocket** - Real-time state sync
6. **Production Jobs** - Replace stub jobs with real ones
7. **Deploy Docs** - Publish Codex to GitHub Pages

---

## Troubleshooting

### Backend won't start
```bash
# Check dependencies
pip install -r backend/requirements.txt

# Check database
# Ensure DATABASE_URL is set

# Check ports
# Ensure port 8000 is available
```

### Tests failing
```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run with verbose output
pytest -v --tb=short
```

### Docs won't build
```bash
# Install MkDocs
pip install mkdocs mkdocs-material mkdocstrings

# Build with strict mode
cd codex-docs
mkdocs build --strict
```

---

## Repository Summary

**Monorepo:** `blackboxprogramming/BlackRoad-Operating-System`
**Branch:** `claude/os-phase2-scaffold-01LKeSDWFNBtXhhsV2xMbM4T`
**Components:** 6 modules (API, Core OS, Operator, Web, Prism, Docs)
**New Code:** ~3,000 lines (Python + JavaScript + HTML + Markdown)
**Tests:** 5 test suites with 15+ tests
**CI:** 3 new workflows + 4 existing
**Documentation:** 10+ pages in MkDocs

---

**Phase 2 Scaffold Complete! Ready for Alexa's review. 🚀**
