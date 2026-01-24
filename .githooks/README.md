# BlackRoad OS Git Hooks

This directory contains Git hooks to enforce deployment safety and prevent common mistakes.

## Installation

### Option 1: Configure Git to Use These Hooks (Recommended)

```bash
# Run once in your local clone
git config core.hooksPath .githooks
```

This tells Git to use hooks from `.githooks/` instead of `.git/hooks/`.

### Option 2: Quick Setup Script

```bash
# From repository root
bash .githooks/setup.sh
```

### Option 3: Manual Symlink (Alternative)

```bash
# From repository root
ln -s ../../.githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Available Hooks

### `pre-commit`

**Purpose**: Validate deployment configuration before allowing commits.

**What it checks**:
- Runs `scripts/validate_deployment_config.py`
- Checks if `railway.toml` maintains 'temporary' marker
- Scans staged files for hardcoded monorepo Railway URLs
- Prevents accidental permanent monorepo deployment

**Bypassing** (use sparingly):
```bash
git commit --no-verify
```

**Example output**:
```
🔍 Running BlackRoad OS deployment validation...

======================================================================
Deployment Configuration Validation Results
======================================================================

⚠️  WARNINGS (2):
  • railway.toml: Monorepo is being deployed TEMPORARILY
  • Migration plan: Migration plan documentation exists

✅ PASSED (6):
  • railway.toml acknowledges temporary monorepo deployment
  • Environment files have warnings but no errors (1 checked)
  • Satellite sync configuration complete
  • Cloudflare DNS documentation is correct
  • DEPLOYMENT_ARCHITECTURE.md is complete
  • Migration plan documentation exists

======================================================================
✅ VALIDATION PASSED WITH WARNINGS

✅ Deployment validation passed!

🔍 Checking staged files for common mistakes...
✅ Staged files look good!
```

## Troubleshooting

### Hook not running

```bash
# Verify hooks path is configured
git config core.hooksPath

# Should output: .githooks

# If empty, configure it
git config core.hooksPath .githooks
```

### Hook failing unexpectedly

```bash
# Run validation script directly to see details
python3 scripts/validate_deployment_config.py

# Run hook directly to debug
bash .githooks/pre-commit
```

### Need to bypass hook temporarily

```bash
# Only do this if you understand the risks!
git commit --no-verify -m "Emergency hotfix"
```

## Hook Development

### Adding a new hook

1. Create hook file in `.githooks/`
2. Make it executable: `chmod +x .githooks/your-hook`
3. Test it: `bash .githooks/your-hook`
4. Update this README

### Testing hooks

```bash
# Test pre-commit hook
bash .githooks/pre-commit

# Test with specific staged files
git add some-file.py
bash .githooks/pre-commit
git reset HEAD some-file.py
```

## See Also

- `scripts/validate_deployment_config.py` - Main validation script
- `DEPLOYMENT_ARCHITECTURE.md` - Deployment model documentation
- `TEMPORARY_DEPLOYMENT.md` - Temporary deployment migration plan
