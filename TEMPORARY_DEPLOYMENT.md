# Temporary Monorepo Deployment - Migration Plan

> **Status**: ACTIVE TEMPORARY DEPLOYMENT
> **Target**: Migrate to satellite architecture
> **Timeline**: TBD based on satellite infrastructure readiness
> **Last Updated**: 2026-01-24

---

## Executive Summary

BlackRoad OS is currently deployed using a **temporary hybrid approach** where the monorepo (`BlackRoad-Operating-System`) is deployed directly to Railway to get the BR-95 desktop UI online quickly, while the satellite infrastructure is being built in parallel.

**This is explicitly a temporary state.**

---

## Current State

### What's Deployed Now

**Monorepo Deployment** (Temporary):
- **Service**: `BlackRoad-Operating-System`
- **Railway Project**: `gregarious-wonder`
- **Domain**: `app.blackroad.systems`
- **Purpose**: Serve BR-95 desktop UI quickly while satellites are being built
- **Status**: TEMPORARY - will be deprecated

**Configuration**:
```toml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
```

### Why Temporary?

The monorepo deployment was chosen for **speed to market**:
- ✅ Get BR-95 desktop UI online immediately
- ✅ Serve users while architecture is finalized
- ✅ Validate product-market fit before investing in full satellite infrastructure
- ✅ Maintain ability to iterate quickly

---

## Target State (Satellite Architecture)

### Satellite Services to Deploy

| Service | Repository | Railway Service | Domain | Status |
|---------|-----------|-----------------|--------|--------|
| Core API | `BlackRoad-OS/blackroad-os-core` | `blackroad-os-core-production` | `core.blackroad.systems` | 🟡 Planned |
| Public API | `BlackRoad-OS/blackroad-os-api` | `blackroad-os-api-production` | `api.blackroad.systems` | 🟡 Planned |
| Operator | `BlackRoad-OS/blackroad-os-operator` | `blackroad-os-operator-production` | `operator.blackroad.systems` | 🟡 Planned |
| Prism Console | `BlackRoad-OS/blackroad-os-prism-console` | `blackroad-os-prism-console-production` | `console.blackroad.systems` | ✅ Deployed (Vercel) |
| Docs | `BlackRoad-OS/blackroad-os-docs` | `blackroad-os-docs-production` | `docs.blackroad.systems` | ✅ Deployed (GitHub Pages) |
| Web | `BlackRoad-OS/blackroad-os-web` | `blackroad-os-web-production` | `blackroad.systems` | ✅ Deployed (Vercel) |

### Satellite Architecture Benefits

Once migrated:
- **Better isolation**: Each service can scale independently
- **Faster deploys**: Only changed services redeploy
- **Clearer ownership**: Each team owns a satellite
- **Reduced blast radius**: Issues in one service don't affect others
- **Easier rollbacks**: Rollback individual services vs entire monorepo

---

## Migration Plan

### Phase 1: Prepare Satellites (In Progress)

**Tasks**:
- [x] Create satellite repository structure
- [x] Set up sync workflows (monorepo → satellites)
- [ ] Configure Railway services for each satellite
- [ ] Set up production environments
- [ ] Configure environment variables
- [ ] Set up health checks and monitoring

**Status**: 40% complete

### Phase 2: Deploy Satellites (Parallel to Monorepo)

**Tasks**:
- [ ] Deploy `blackroad-os-core-production` to Railway
- [ ] Deploy `blackroad-os-api-production` to Railway
- [ ] Deploy `blackroad-os-operator-production` to Railway
- [ ] Configure Cloudflare DNS to point to satellites
- [ ] Run smoke tests on satellite infrastructure
- [ ] Monitor satellite health for 1 week

**Success Criteria**:
- All satellites pass health checks
- Response times < 200ms p95
- Zero errors in production for 48 hours
- All existing functionality works

### Phase 3: Traffic Migration

**Tasks**:
- [ ] Set up A/B testing (50/50 monorepo vs satellites)
- [ ] Monitor error rates and performance
- [ ] Gradually shift traffic (50% → 75% → 90% → 100%)
- [ ] Update all `ALLOWED_ORIGINS` to satellite URLs
- [ ] Update all service-to-service calls to use satellite endpoints

**Rollback Plan**:
- Keep monorepo deployment running as backup
- Can revert Cloudflare DNS in < 5 minutes
- Automated rollback if error rate > 1%

### Phase 4: Deprecate Monorepo Deployment

**Tasks**:
- [ ] Confirm 100% traffic on satellites for 2 weeks
- [ ] Remove monorepo Railway service
- [ ] Archive `railway.toml` in monorepo
- [ ] Update all documentation to reference satellites only
- [ ] Celebrate! 🎉

**Final State**:
- Monorepo = source of truth (code only)
- Satellites = deployable services
- Clean separation of concerns

---

## Current Risks & Mitigations

### Risk 1: Monorepo Deployment Becomes Permanent

**Risk**: Team gets comfortable with monorepo deployment and never migrates.

**Mitigation**:
- ✅ This document serves as commitment to migrate
- ✅ Validation script warns about temporary deployment
- ✅ Regular reviews to check migration progress
- 📅 Set hard deadline for Phase 2 completion

### Risk 2: Satellite Infrastructure Never Gets Built

**Risk**: Satellites remain planned but never deployed.

**Mitigation**:
- Track satellite deployment as OKR
- Allocate dedicated engineering time
- Make migration a requirement for next funding round
- Set up automated reminders if migration stalls

### Risk 3: Configuration Drift Between Monorepo and Satellites

**Risk**: Monorepo and satellites diverge, making migration harder.

**Mitigation**:
- ✅ Sync workflows keep satellites up to date
- ✅ Validation scripts catch drift
- Test satellites in staging regularly
- Document any monorepo-specific hacks that need migration

---

## Allowed Temporary Deviations

While in temporary deployment mode, the following deviations from the target architecture are **explicitly allowed**:

### ✅ Allowed (Temporary)

1. **Monorepo in Railway**
   - `BlackRoad-Operating-System` deployed as Railway service
   - Must be marked as "temporary" in `railway.toml`

2. **Monorepo URLs in ALLOWED_ORIGINS**
   - `blackroad-operating-system-production.up.railway.app` in CORS config
   - Must also include satellite URLs for future migration

3. **Monorepo Domain**
   - `app.blackroad.systems` pointing to monorepo deployment
   - Will be deprecated when satellites are live

4. **Single Service for All APIs**
   - All API endpoints served from monorepo
   - Will be split into Core API, Public API, Operator when satellites deploy

### ❌ Still Forbidden (Even During Temporary Phase)

1. **Adding Monorepo as Dependency**
   - Do NOT add `MONOREPO_URL` environment variables
   - Do NOT reference monorepo from other services

2. **Permanent Monorepo Deployment**
   - Must maintain "temporary" markers in configs
   - Must have active migration plan

3. **Skipping Satellite Infrastructure**
   - Must continue building satellites in parallel
   - Must not abandon migration plan

---

## Monitoring & Governance

### Weekly Checks

Every week, review:
- [ ] Satellite deployment progress
- [ ] Migration timeline
- [ ] Any blockers to satellite deployment

### Monthly Reviews

Every month, review:
- [ ] Update this document with progress
- [ ] Adjust timeline if needed
- [ ] Communicate status to stakeholders

### Automated Validation

```bash
# Run validation script weekly
python scripts/validate_deployment_config.py

# Should show:
# ⚠️  WARNING: Monorepo is being deployed TEMPORARILY
# ⚠️  WARNING: Migration plan exists but not complete
```

---

## FAQ

### Q: Why not just stick with monorepo deployment?

**A**: While it works now, it won't scale:
- **Performance**: Monorepo deploys are slow (30+ minutes)
- **Reliability**: Single point of failure for all services
- **Team velocity**: All changes require full deployment
- **Cost**: Can't scale individual services based on load

### Q: When will migration be complete?

**A**: Target timeline:
- Phase 1 (Prepare): 2-4 weeks
- Phase 2 (Deploy Satellites): 1-2 weeks
- Phase 3 (Traffic Migration): 2-3 weeks
- Phase 4 (Deprecate Monorepo): 1 week

**Total**: 6-10 weeks from satellite infrastructure kickoff

### Q: What if satellites never get built?

**A**: If satellites aren't feasible, we'll:
1. Document why (technical/business reasons)
2. Update DEPLOYMENT_ARCHITECTURE.md to reflect permanent monorepo approach
3. Remove "temporary" markers from configs
4. Optimize monorepo deployment for long-term use

But this should be a last resort.

### Q: Can I add new features to the monorepo?

**A**: Yes! Continue developing in the monorepo:
- Edit code in `services/core-api/`, `apps/prism-console/`, etc.
- Sync workflows will update satellites
- When satellites deploy, features will "just work"

---

## Success Metrics

Migration is successful when:
- ✅ 100% traffic on satellites
- ✅ Zero downtime during migration
- ✅ All tests passing on satellites
- ✅ Performance improved or equal to monorepo
- ✅ Monorepo Railway service deleted
- ✅ Team confident in satellite architecture

---

## Conclusion

The temporary monorepo deployment is a pragmatic choice to ship quickly while building the right architecture. This document ensures we don't lose sight of the target state and have a clear path to get there.

**Next Steps**:
1. Complete Phase 1 (prepare satellites)
2. Deploy first satellite (`blackroad-os-core-production`)
3. Run smoke tests
4. Repeat for other satellites
5. Migrate traffic
6. Deprecate monorepo deployment

---

**For Questions or Updates**:
- See `DEPLOYMENT_ARCHITECTURE.md` for target architecture
- See `docs/os/monorepo-sync.md` for sync process
- Run `python scripts/validate_deployment_config.py` for status

---

*Last updated: 2026-01-24*
*Document owner: Infrastructure Team*
*Review frequency: Monthly*
