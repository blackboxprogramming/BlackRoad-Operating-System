# BlackRoad Operating System (Legacy Monorepo)

> **Archive notice:** This repository is preserved for historical reference only. Active development and deployments have moved to the multi-repo architecture under the [`BlackRoad-OS`](https://github.com/BlackRoad-OS) organization.

## Where to go now

Use the repositories below for current code, issues, and deployments:

- [`BlackRoad-OS/blackroad-os-core`](https://github.com/BlackRoad-OS/blackroad-os-core) — core APIs and backend services
- [`BlackRoad-OS/blackroad-os-web`](https://github.com/BlackRoad-OS/blackroad-os-web) — public/marketing web experience
- [`BlackRoad-OS/blackroad-os-docs`](https://github.com/BlackRoad-OS/blackroad-os-docs) — documentation site and specs
- [`BlackRoad-OS/blackroad-os-prism-console`](https://github.com/BlackRoad-OS/blackroad-os-prism-console) — operations and status console
- [`BlackRoad-OS/blackroad-os-operator`](https://github.com/BlackRoad-OS/blackroad-os-operator) — agent runtime and operator tooling
- [`BlackRoad-OS/demo-repository`](https://github.com/BlackRoad-OS/demo-repository) — sample workloads and reference integrations

## Migration map (legacy → multi-repo)

The table below helps translate common paths in this archive to their new canonical homes. See [docs/migration.md](docs/migration.md) for additional notes.

| Legacy path/module | Destination repo/service | Notes |
| --- | --- | --- |
| `services/core-api`, `backend/` (FastAPI backend) | [`blackroad-os-core`](https://github.com/BlackRoad-OS/blackroad-os-core) | Core APIs and backend runtime. Static assets that previously shipped with the backend now live alongside the frontend. |
| `services/public-api` | [`blackroad-os-core`](https://github.com/BlackRoad-OS/blackroad-os-core) | Public/edge API surface consolidated with the core service. |
| `services/operator`, `operator_engine/`, `blackroad-os-operator/` | [`blackroad-os-operator`](https://github.com/BlackRoad-OS/blackroad-os-operator) | Agent runtime, execution graph, and worker orchestration. |
| `apps/prism-console/`, `prism-console/` | [`blackroad-os-prism-console`](https://github.com/BlackRoad-OS/blackroad-os-prism-console) | Internal console and monitoring UI. |
| `apps/web/`, `web-client/`, `public/` | [`blackroad-os-web`](https://github.com/BlackRoad-OS/blackroad-os-web) | Marketing site and public-facing web assets. |
| `apps/docs/`, `docs/` (site content) | [`blackroad-os-docs`](https://github.com/BlackRoad-OS/blackroad-os-docs) | Documentation source, specs, and publishing pipeline. |
| `sdk/`, `templates/`, `examples/` | [`demo-repository`](https://github.com/BlackRoad-OS/demo-repository) | Reference workloads, SDK usage samples, and scaffolding. |

## Why this repo exists

This monorepo served as the original coordination point for BlackRoad OS (“v1”). It now functions solely as an archive to preserve history, decision records, and experiments. No new features, fixes, or deployments should originate here.

- ✅ Use the `BlackRoad-OS/*` repositories for any production or test deployments.
- ✅ File issues and discussions against the new repositories.
- ⚠️ Do **not** rely on CI/CD pipelines or environment templates from this archive—they are unmaintained.

## Need something from the archive?

- Browse tags and commit history here if you need to reference legacy implementations or documents.
- If you must mirror old assets, copy them into the appropriate `BlackRoad-OS/*` repository and modernize there.

For more background on the split and guidance on specific components, start with the [migration guide](docs/migration.md).
