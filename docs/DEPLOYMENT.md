# BlackRoad OS Deployment

This repo is the *orchestrator* for all BlackRoad OS services.

## Commands

- `npm run deploy:all`  
  Deploys all services (core, api, operator, agents, console, web, docs) via Railway.

- `npm run deploy:service -- core`  
  Deploy only a single service by `id`.

- `npm run health:all`  
  Check health endpoints for all services using their public domains.

## Service Registry

All services are defined in `infra/services.json`.

To add or change a service:

1. Edit `infra/services.json` and update:
   - `id`
   - `railwayProject`
   - `railwayService`
   - `domain`
   - `healthPath`
2. Make sure the Railway project/service names match.
3. Commit and push your changes.

## GitHub Actions

The workflow `.github/workflows/deploy-all.yml` lets you:

- Trigger **Deploy BlackRoad OS** from the Actions tab.
- Optionally pass `serviceId` to deploy just one service.
