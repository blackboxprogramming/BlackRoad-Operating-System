## Prism Console — Merge Dashboard

**Prism** is the visual command center for BlackRoad OS operations.

The **Merge Dashboard** provides real-time visibility into:
- Active PRs across all repos
- Merge queue status
- CI/CD check results
- Auto-merge eligibility
- PR action history

### Features

- **Real-time Updates**: WebSocket integration for live status
- **Queue Management**: View and manage the merge queue
- **Action Triggers**: Manually trigger PR actions when needed
- **Logs**: View execution logs from the Operator Engine
- **Analytics**: Track merge velocity and queue metrics

### Architecture

```
prism-console/
├── modules/
│   ├── merge-dashboard.js    # Main dashboard logic
│   ├── pr-card.js             # PR status card component
│   └── action-log.js          # Action log viewer
├── pages/
│   └── merge-dashboard.html   # Dashboard UI
├── styles/
│   └── merge-dashboard.css    # Dashboard styling
└── api/
    └── prism-api.js           # API client for Operator Engine
```

### Usage

The Merge Dashboard is integrated into the BlackRoad OS desktop as the "Prism Console" application.

### API Integration

The dashboard connects to the Operator Engine via:
- `/api/operator/queue/stats` - Queue statistics
- `/api/operator/queue/pr/{owner}/{repo}/{pr_number}` - PR action history
- `/api/operator/webhooks/github` - GitHub webhook events

### Development

```bash
# Open in browser
open prism-console/pages/merge-dashboard.html

# Or access via BlackRoad OS
# Desktop > Prism Console
```
