# Prism Console - Canonical Specification

**Version**: 1.0.0
**Status**: Definition (Wire-Ready)
**Purpose**: The Operator's cockpit for BlackRoad OS

---

## What Prism Console IS

Prism Console is the **single pane of glass** for the Operator (Alexa) to see and control the entire BlackRoad OS ecosystem in real-time.

When it's wired correctly, opening Prism should feel like:

> "Here is the state of YOUR WORLD. Everything you need to know, right now, in one place."

Not a toy. Not a dashboard with fake data. The **real cockpit**.

---

## Core Sections (Tabs)

### 1. **SYSTEM** (Default Tab)

**Purpose**: Instant health snapshot of all services across all environments.

**Data Displayed**:
```
Service Grid:
┌─────────────┬────────┬────────┬──────────┐
│ Service     │ Dev    │ Staging│ Prod     │
├─────────────┼────────┼────────┼──────────┤
│ core        │ ✅ 0.4s│ ✅ 0.3s│ ✅ 0.2s  │
│ api         │ ✅ 0.5s│ ✅ 0.4s│ ✅ 0.3s  │
│ operator    │ ✅ 0.6s│ ✅ 0.5s│ ✅ 0.4s  │
│ console     │ ✅ 0.2s│ ✅ 0.2s│ ✅ 0.1s  │
│ docs        │ ✅ 0.3s│ ✅ 0.2s│ ✅ 0.2s  │
│ web         │ ❌ down│ ✅ 0.4s│ ✅ 0.3s  │
└─────────────┴────────┴────────┴──────────┘

Quick Stats:
- Total Services: 6
- Healthy: 17/18 (94%)
- Avg Response: 0.3s
- Last Check: 5s ago
```

**What Makes It Real**:
- Auto-refresh every 5 seconds (configurable)
- Click service name → opens service URL in new tab
- Click health indicator → shows last health response JSON
- Color coding: ✅ green (<500ms), ⚠️ yellow (500ms-2s), ❌ red (>2s or down)

**APIs Called**:
```
GET /health on each service in each environment
- https://core.blackroad.systems/health
- https://core-dev.blackroad.systems/health
- https://core-staging.blackroad.systems/health
(repeat for all services × environments)
```

**Minimal Data Model**:
```typescript
interface ServiceHealth {
  service: string;
  environment: 'dev' | 'staging' | 'prod';
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number; // milliseconds
  lastCheck: string; // ISO timestamp
  url: string;
  version?: string;
  commit?: string;
}
```

---

### 2. **DEPLOYMENTS**

**Purpose**: See what commits are live in each environment, and recent deployment history.

**Data Displayed**:
```
Current Deployments:
┌─────────────┬─────────┬─────────┬─────────────┬────────────┐
│ Service     │ Env     │ Commit  │ Deployed    │ Status     │
├─────────────┼─────────┼─────────┼─────────────┼────────────┤
│ core        │ prod    │ a3f2b1c │ 2h ago      │ ✅ healthy │
│ core        │ staging │ f8e9d0a │ 15m ago     │ ✅ healthy │
│ core        │ dev     │ 1b4c7e2 │ 3m ago      │ ⚠️ deploying│
│ operator    │ prod    │ 9a8b7c6 │ 1d ago      │ ✅ healthy │
└─────────────┴─────────┴─────────┴─────────────┴────────────┘

Recent Activity (last 10):
- 3m ago: core-dev deployed 1b4c7e2 (in progress)
- 15m ago: core-staging deployed f8e9d0a (success)
- 2h ago: core-prod deployed a3f2b1c (success)
- 3h ago: operator-dev deployed 5d3e1f0 (success)
```

**What Makes It Real**:
- Shows git commit SHA (short form, linkable to GitHub)
- Shows deployed timestamp
- Shows current status from Railway deployment API
- Click commit SHA → opens GitHub commit page
- Click row → expands to show deployment logs

**APIs Called**:
```
GET /version on each service (for commit SHA)
Railway API (if available):
  GET /projects/{project}/deployments
  GET /projects/{project}/services/{service}/deployments
```

**Minimal Data Model**:
```typescript
interface Deployment {
  service: string;
  environment: string;
  commit: string;
  commitUrl: string; // GitHub commit URL
  deployedAt: string; // ISO timestamp
  status: 'deploying' | 'success' | 'failed';
  railwayDeploymentId?: string;
}
```

---

### 3. **JOBS** (Operator Engine)

**Purpose**: See what the Operator Engine is doing right now and what it's scheduled to do.

**Data Displayed**:
```
Active Jobs:
┌────────────────────────┬──────────┬──────────┬──────────┐
│ Job                    │ Status   │ Started  │ Progress │
├────────────────────────┼──────────┼──────────┼──────────┤
│ PR #145 merge check    │ Running  │ 2m ago   │ 60%      │
│ Daily backup           │ Queued   │ -        │ -        │
└────────────────────────┴──────────┴──────────┴──────────┘

Recent Completions (last 10):
- 5m ago: PR #143 merged (success)
- 10m ago: Health check sweep (success)
- 15m ago: Log rotation (success)
```

**What Makes It Real**:
- Shows jobs currently executing
- Shows queued jobs
- Shows recent job history
- Click job → shows full execution log
- Auto-refresh every 10 seconds

**APIs Called**:
```
GET /api/operator/jobs?status=running
GET /api/operator/jobs?status=queued
GET /api/operator/jobs/recent?limit=10
GET /api/operator/jobs/{job_id}/logs
```

**Minimal Data Model**:
```typescript
interface Job {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt?: string;
  completedAt?: string;
  progress?: number; // 0-100
  logs?: string[];
}
```

---

### 4. **AGENTS**

**Purpose**: See available agents and their recent execution history.

**Data Displayed**:
```
Agent Categories:
├── DevOps (15 agents)
├── Engineering (12 agents)
├── Security (8 agents)
├── Finance (6 agents)
└── Creative (10 agents)

Recent Executions (last 20):
┌────────────────────┬──────────┬──────────┬──────────┐
│ Agent              │ Executed │ Duration │ Status   │
├────────────────────┼──────────┼──────────┼──────────┤
│ GitHubPRAnalyzer   │ 5m ago   │ 3.2s     │ ✅       │
│ CodeReviewer       │ 10m ago  │ 12.5s    │ ✅       │
│ TestRunner         │ 15m ago  │ 45.1s    │ ❌       │
└────────────────────┴──────────┴──────────┴──────────┘
```

**What Makes It Real**:
- Lists all available agents by category
- Shows recent execution history
- Click agent → shows agent details (description, version, last run)
- Click execution → shows execution logs

**APIs Called**:
```
GET /api/agents/categories
GET /api/agents/executions/recent?limit=20
GET /api/agents/{agent_id}
GET /api/agents/executions/{execution_id}/logs
```

**Minimal Data Model**:
```typescript
interface Agent {
  id: string;
  name: string;
  category: string;
  version: string;
  description: string;
}

interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  executedAt: string;
  duration: number; // seconds
  status: 'success' | 'failed';
  logs?: string[];
}
```

---

### 5. **LOGS** (Optional - Phase 2)

**Purpose**: Live log streaming from all services.

**Data Displayed**:
```
Live Log Stream (last 100 lines, auto-scroll):
[2026-01-26 10:45:23] [core] INFO: User authenticated: alexa@blackroad.systems
[2026-01-26 10:45:24] [api] INFO: GET /v1/users 200 0.12s
[2026-01-26 10:45:25] [operator] INFO: Starting job: PR merge check
[2026-01-26 10:45:26] [core] ERROR: Database connection timeout
```

**What Makes It Real**:
- WebSocket connection for real-time streaming
- Filter by service, log level, keyword
- Auto-scroll toggle
- Export logs button

**APIs Called**:
```
WebSocket: ws://{service}/ws/logs
GET /api/logs?service={service}&level={level}&limit=100
```

---

## Configuration Requirements

### Environment-Aware Config Module

Prism MUST have a single `config.ts` that exports:

```typescript
// config.ts
export interface ServiceConfig {
  name: string;
  urls: {
    dev: string;
    staging: string;
    prod: string;
  };
}

export const SERVICES: ServiceConfig[] = [
  {
    name: 'core',
    urls: {
      dev: 'https://core-dev.blackroad.systems',
      staging: 'https://core-staging.blackroad.systems',
      prod: 'https://core.blackroad.systems'
    }
  },
  {
    name: 'api',
    urls: {
      dev: 'https://api-dev.blackroad.systems',
      staging: 'https://api-staging.blackroad.systems',
      prod: 'https://api.blackroad.systems'
    }
  },
  {
    name: 'operator',
    urls: {
      dev: 'https://operator-dev.blackroad.systems',
      staging: 'https://operator-staging.blackroad.systems',
      prod: 'https://operator.blackroad.systems'
    }
  },
  {
    name: 'console',
    urls: {
      dev: 'https://console-dev.blackroad.systems',
      staging: 'https://console-staging.blackroad.systems',
      prod: 'https://console.blackroad.systems'
    }
  },
  {
    name: 'docs',
    urls: {
      dev: 'https://docs-dev.blackroad.systems',
      staging: 'https://docs-staging.blackroad.systems',
      prod: 'https://docs.blackroad.systems'
    }
  },
  {
    name: 'web',
    urls: {
      dev: 'https://web-dev.blackroad.systems',
      staging: 'https://web-staging.blackroad.systems',
      prod: 'https://web.blackroad.systems'
    }
  }
];

export const ENVIRONMENTS = ['dev', 'staging', 'prod'] as const;
export type Environment = typeof ENVIRONMENTS[number];
```

This is the **single source of truth** for:
- What services exist
- What URLs they have in each environment
- What to poll for health checks
- What to display in the UI

---

## What Makes Prism "Real" vs "Toy"

**Real** means:
1. **Shows actual data** - not mock data, not "Coming Soon", actual live service states
2. **Auto-refreshes** - doesn't require manual refresh to see changes
3. **Responds to interaction** - clicking things opens relevant pages/logs
4. **Has a clear data flow**:
   - Config defines services
   - Health poller hits services
   - UI renders results
   - User sees reality

**Toy** means:
- Hardcoded fake data
- "Future:" comments everywhere
- No config-driven behavior
- No auto-refresh
- Dead links

---

## Minimal Viable Wiring

To make Prism feel real, wire **ONLY** the SYSTEM tab first:

1. **Create `config.ts`** with service registry (above)
2. **Create `health-poller.ts`**:
   ```typescript
   async function pollAllServices(): Promise<ServiceHealth[]> {
     const results = [];
     for (const service of SERVICES) {
       for (const env of ENVIRONMENTS) {
         const url = service.urls[env];
         const health = await fetchHealth(url);
         results.push(health);
       }
     }
     return results;
   }
   ```
3. **Update UI** to render results
4. **Add auto-refresh** (5s interval)
5. **Add click handlers** (open service URLs)

That's it. Once SYSTEM tab shows real data, Prism instantly stops feeling like a toy.

The other tabs can come later, but **SYSTEM must be real first**.

---

## Wire-Ready Checklist

- [ ] `config.ts` exists with service registry
- [ ] SYSTEM tab polls real `/health` endpoints
- [ ] SYSTEM tab shows real response times
- [ ] SYSTEM tab auto-refreshes every 5s
- [ ] Clicking service name opens service URL
- [ ] Color coding works (green/yellow/red)
- [ ] Console itself has `/health` and `/version` endpoints
- [ ] Console can be polled by other tools (like OS dock)

Once these are checked, Prism is **wired** and feels like your cockpit.

---

## Anti-Goals

Prism Console is NOT:
- A full monitoring platform (not Grafana)
- A log aggregation system (not Datadog)
- A deployment tool (not Railway dashboard)
- A code editor (not VSCode)

Prism IS:
- **The Operator's single pane of glass**
- A real-time health dashboard
- A quick-access portal to other tools
- The thing you open first to see "what's up"

---

**End of Spec**

When Prism is wired per this spec, it will finally feel like the cockpit it's supposed to be.
