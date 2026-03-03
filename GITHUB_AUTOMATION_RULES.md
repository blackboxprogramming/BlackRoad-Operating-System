# 🤖 GITHUB AUTOMATION RULES

> **BlackRoad Operating System — Phase Q**
> **Purpose**: Define all automation rules for PR management
> **Owner**: Operator Alexa (Cadillac)
> **Last Updated**: 2025-11-18

---

## Table of Contents

1. [Overview](#overview)
2. [Labeling Rules](#labeling-rules)
3. [Auto-Approval Rules](#auto-approval-rules)
4. [Auto-Merge Rules](#auto-merge-rules)
5. [Branch Protection Rules](#branch-protection-rules)
6. [Workflow Trigger Rules](#workflow-trigger-rules)
7. [Notification Rules](#notification-rules)
8. [Exception Handling](#exception-handling)

---

## Overview

This document defines **all automation rules** for the BlackRoad GitHub organization. These rules govern:

- **When** PRs are automatically labeled
- **Which** PRs can be auto-approved
- **What** conditions trigger auto-merge
- **How** workflows are triggered
- **Who** gets notified about what

**Guiding Principles**:
1. **Safety First** — When in doubt, require human review
2. **Progressive Enhancement** — Start conservative, expand as confidence grows
3. **Transparency** — All automation actions are logged and visible
4. **Escape Hatches** — Humans can always override automation
5. **Fail Safe** — Errors block automation, don't proceed blindly

---

## Labeling Rules

### Automatic Labels

Applied by `.github/labeler.yml` action on PR open/update.

#### File-Based Labels

| Label | Applied When | Purpose |
|-------|--------------|---------|
| `docs` | `docs/**/*`, `*.md`, `README.*` changed | Documentation changes |
| `backend` | `backend/**/*` changed | Backend code changes |
| `frontend` | `blackroad-os/**/*`, `backend/static/**/*` changed | Frontend/UI changes |
| `agents` | `agents/**/*` changed | AI agent changes |
| `infra` | `.github/**/*`, `infra/**/*`, `ops/**/*` changed | Infrastructure changes |
| `sdk-python` | `sdk/python/**/*` changed | Python SDK changes |
| `sdk-typescript` | `sdk/typescript/**/*` changed | TypeScript SDK changes |
| `tests` | `**/tests/**/*`, `**/*test*.py`, `**/*.test.js` changed | Test changes |
| `dependencies` | `requirements.txt`, `package*.json` changed | Dependency updates |

#### Size-Based Labels

| Label | Applied When | Purpose |
|-------|--------------|---------|
| `size-xs` | 0-10 lines changed | Tiny change |
| `size-s` | 11-50 lines changed | Small change |
| `size-m` | 51-200 lines changed | Medium change |
| `size-l` | 201-500 lines changed | Large change |
| `size-xl` | 500+ lines changed | Extra large change |

**Implementation**:
```yaml
# .github/workflows/label-size.yml
- name: Label PR by size
  uses: codelytv/pr-size-labeler@v1
  with:
    xs_max_size: 10
    s_max_size: 50
    m_max_size: 200
    l_max_size: 500
```

#### Author-Based Labels

| Label | Applied When | Purpose |
|-------|--------------|---------|
| `copilot-auto` | Branch starts with `copilot/` | Copilot-generated PR |
| `lucidia-auto` | Branch starts with `lucidia/` | Lucidia-generated PR |
| `owner-auto` | Author is `blackboxprogramming` | Owner-generated PR |
| `dependabot` | Author is `dependabot[bot]` | Dependency update PR |

**Implementation**:
```yaml
# .github/workflows/label-author.yml
- name: Label Copilot PRs
  if: startsWith(github.head_ref, 'copilot/')
  run: gh pr edit ${{ github.event.pull_request.number }} --add-label "copilot-auto"
```

### Manual Labels

Applied by humans or specialized bots.

| Label | Applied By | Purpose | Auto-Merge? |
|-------|------------|---------|-------------|
| `merge-ready` | Human reviewer | Explicitly approved for merge | ✅ Yes |
| `auto-merge` | Human or bot | Enable auto-merge | ✅ Yes |
| `needs-review` | Human | Requires human attention | ❌ No |
| `breaking-change` | Human or CI check | Breaking API change | ❌ No |
| `security` | Human or security scan | Security-related change | ❌ No |
| `critical` | Human | Urgent fix, expedite review | ⚠️ Conditional |
| `wip` | Human | Work in progress | ❌ No |
| `do-not-merge` | Human | Explicitly blocked | ❌ No |
| `needs-rebase` | Bot | Conflicts with main | ❌ No |

---

## Auto-Approval Rules

### When to Auto-Approve

A PR is **automatically approved** if it meets **ALL** of these criteria:

#### Tier 1: Docs-Only (Safest)

✅ **Condition**: Only documentation files changed
- Paths: `docs/**/*`, `*.md` (excluding `SECURITY.md`)
- Max size: Any
- Required checks: Markdown linting passes

✅ **Action**: Auto-approve immediately
✅ **Approver**: `docs-bot` (GitHub App)

**Implementation**:
```yaml
# .github/workflows/auto-approve-docs.yml
name: Auto-Approve Docs
on:
  pull_request:
    paths:
      - 'docs/**'
      - '*.md'

jobs:
  approve:
    if: |
      !contains(github.event.pull_request.labels.*.name, 'security') &&
      !contains(github.event.pull_request.labels.*.name, 'breaking-change')
    runs-on: ubuntu-latest
    steps:
      - uses: hmarr/auto-approve-action@v3
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Tier 2: Tests-Only

✅ **Condition**: Only test files changed
- Paths: `**/tests/**/*`, `**/*test*.py`, `**/*.test.js`
- Max size: Any
- Required checks: All tests pass (including new ones)

✅ **Action**: Auto-approve after tests pass
✅ **Approver**: `test-bot`

#### Tier 3: Scaffold/Stubs

✅ **Condition**: New files with minimal logic
- Indicators: Mostly comments, TODOs, type stubs
- Max size: 200 lines
- Required checks: Linting passes

✅ **Action**: Auto-approve with human notification
✅ **Approver**: `scaffold-bot`

#### Tier 4: Self-Hosted AI / Copilot Generated

✅ **Condition**: PR from Copilot, Lucidia, or owner
- Labels: `copilot-auto`, `lucidia-auto`, or `owner-auto`
- Required checks: **All** CI checks pass
- Max size: 500 lines (larger needs human review)
- No `breaking-change` or `security` labels

✅ **Action**: Auto-approve after all checks pass
✅ **Approver**: `ai-review-bot`

**Implementation**:
```yaml
# .github/workflows/auto-approve-ai.yml
name: Auto-Approve AI PRs
on:
  status: {}  # Triggered when checks complete

jobs:
  approve:
    if: |
      contains(github.event.pull_request.labels.*.name, 'copilot-auto') &&
      github.event.state == 'success' &&
      !contains(github.event.pull_request.labels.*.name, 'breaking-change')
    runs-on: ubuntu-latest
    steps:
      - name: Check PR size
        id: size
        run: |
          ADDITIONS=$(jq -r '.pull_request.additions' $GITHUB_EVENT_PATH)
          DELETIONS=$(jq -r '.pull_request.deletions' $GITHUB_EVENT_PATH)
          TOTAL=$((ADDITIONS + DELETIONS))
          if [ $TOTAL -gt 500 ]; then
            echo "Too large for auto-approval: $TOTAL lines"
            exit 1
          fi
      - uses: hmarr/auto-approve-action@v3
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Tier 5: Dependency Updates

✅ **Condition**: Dependabot PR
- Author: `dependabot[bot]`
- Type: Patch or minor version bump (not major)
- Required checks: Security scan passes, tests pass

✅ **Action**: Auto-approve patch/minor, require review for major
✅ **Approver**: `dependabot-auto-approve`

### When NOT to Auto-Approve

❌ **NEVER** auto-approve if:
- Contains `breaking-change` label
- Contains `security` label
- Contains `needs-review` label
- Contains `do-not-merge` label
- Changes `.github/workflows/` (workflow changes need human review)
- Changes `infra/` (infrastructure changes need human review)
- Changes CODEOWNERS (ownership changes need human review)
- Changes Dockerfile or docker-compose.yml (container changes need review)
- PR author is not recognized (unknown bot or user)
- Any required check fails
- PR has conflicts with main branch

---

## Auto-Merge Rules

### When to Auto-Merge

A PR is **automatically merged** if it meets **ALL** of these criteria:

#### Required Conditions (All Tiers)

1. ✅ **Approved**: At least 1 approval (can be auto-approval bot)
2. ✅ **Checks Passing**: All required status checks pass
3. ✅ **Up to Date**: Branch is current (or in merge queue)
4. ✅ **No Conflicts**: No merge conflicts
5. ✅ **Labeled**: Has one of: `auto-merge`, `copilot-auto`, `lucidia-auto`, `owner-auto`, `docs-only`, `merge-ready`
6. ✅ **Not Blocked**: No `do-not-merge`, `wip`, `needs-review` labels

#### Tier-Specific Conditions

**Docs-Only PRs**:
- ✅ Auto-approve + auto-merge enabled
- ✅ Markdown linting passes
- ⏱️ Merge immediately

**Test-Only PRs**:
- ✅ Auto-approve + auto-merge enabled
- ✅ All tests pass (including new tests)
- ⏱️ Merge immediately

**Self-Hosted AI / Copilot PRs** (`copilot-auto`, `lucidia-auto`, `owner-auto`):
- ✅ Auto-approve + auto-merge enabled
- ✅ **All** CI checks pass (backend, frontend, security)
- ✅ No `breaking-change` label
- ⏱️ Merge after 5-minute soak time (allows human override)

**Infrastructure PRs**:
- ⚠️ **Manual merge required** (even if approved)
- Rationale: High-risk changes need human verification

**Breaking Changes**:
- ❌ **Never auto-merge**
- Rationale: API changes need human coordination

### Merge Method

**Default**: `squash`
- Keeps clean history
- Easy to revert
- Good commit messages

**Exceptions**:
- `merge` for feature branches with detailed history
- `rebase` for single-commit PRs (rare)

**Configuration**:
```yaml
# .github/auto-merge.yml
env:
  MERGE_METHOD: squash
  MERGE_COMMIT_MESSAGE: PR_TITLE
  MERGE_DELETE_BRANCH: true
```

### Soak Time

**Purpose**: Give humans a window to intervene before auto-merge

| PR Type | Soak Time | Rationale |
|---------|-----------|-----------|
| Docs-only | 0 min | Very low risk |
| Tests-only | 0 min | Low risk |
| Scaffolding | 5 min | Human can spot-check |
| AI-generated | 5 min | Human can review if needed |
| Dependencies | 30 min | Security review window |

**Implementation**:
```yaml
# .github/workflows/auto-merge.yml
- name: Wait soak time
  if: contains(github.event.pull_request.labels.*.name, 'copilot-auto')
  run: sleep 300  # 5 minutes
```

---

## Branch Protection Rules

### Main Branch Protection

**Branch**: `main` (production)

**Rules**:
- ✅ **Require pull request** before merging
- ✅ **Require approvals**: 1 (can be auto-approval bot)
- ✅ **Require status checks** to pass before merging
  - Backend Tests
  - Frontend Validation
  - Security Scan
  - Markdown Linting (for docs changes)
- ✅ **Require branches to be up to date** before merging
- ✅ **Require merge queue** (prevents race conditions)
- ✅ **Require conversation resolution** before merging
- ❌ **Do not allow force pushes** (even admins)
- ❌ **Do not allow deletions**

**Bypass Allowed**: Only in emergencies, with audit log

### Feature Branch Protection

**Branches**: `feature/*`, `copilot/*`, `lucidia/*`

**Rules**:
- ⚠️ No protection (development branches)
- ✅ Auto-delete after merge

---

## Workflow Trigger Rules

### Path-Based Triggers

Workflows only run when relevant files change.

**Backend CI** (`backend-ci.yml`):
```yaml
on:
  pull_request:
    paths:
      - 'backend/**'
      - 'requirements.txt'
      - 'Dockerfile'
      - 'docker-compose.yml'
  push:
    branches: [main]
    paths:
      - 'backend/**'
```

**Frontend CI** (`frontend-ci.yml`):
```yaml
on:
  pull_request:
    paths:
      - 'blackroad-os/**'
      - 'backend/static/**'
  push:
    branches: [main]
    paths:
      - 'blackroad-os/**'
      - 'backend/static/**'
```

**Docs CI** (`docs-ci.yml`):
```yaml
on:
  pull_request:
    paths:
      - 'docs/**'
      - '*.md'
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '*.md'
```

**Agents CI** (`agents-ci.yml`):
```yaml
on:
  pull_request:
    paths:
      - 'agents/**'
  push:
    branches: [main]
    paths:
      - 'agents/**'
```

**Infrastructure CI** (`infra-ci.yml`):
```yaml
on:
  pull_request:
    paths:
      - 'infra/**'
      - 'ops/**'
      - '.github/**'
      - '*.toml'
      - '*.json'
  push:
    branches: [main]
    paths:
      - 'infra/**'
      - '.github/**'
```

### Event-Based Triggers

**Auto-Merge Workflow**:
```yaml
on:
  pull_request_review:
    types: [submitted]  # Triggered when PR is approved
  status: {}            # Triggered when CI checks complete
  check_run:
    types: [completed]  # Triggered when individual check completes
```

**Auto-Labeling Workflow**:
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]  # Triggered on PR create/update
```

**Notification Workflow**:
```yaml
on:
  pull_request:
    types: [opened, closed, merged]  # Triggered on PR lifecycle events
```

---

## Notification Rules

### Who Gets Notified When

**PR Opened**:
- 📢 **CODEOWNERS** for affected paths
- 📢 **Operator Team** (via Prism Console)
- 📧 **Email** (if subscribed)

**PR Approved**:
- 📢 **PR Author**
- 📢 **Reviewers** (FYI)

**PR Auto-Merged**:
- 📢 **PR Author** (GitHub comment)
- 📢 **CODEOWNERS** (GitHub comment)
- 📢 **Operator Dashboard** (event log)
- 📧 **Daily Digest** (all auto-merges)

**PR Failed Checks**:
- 🚨 **PR Author** (GitHub comment with details)
- 📢 **Reviewers** (if already reviewing)
- 📊 **Prism Console** (failure dashboard)

**Queue Stuck**:
- 🚨 **Operator Team** (Slack alert)
- 📢 **Prism Console** (warning banner)

### Notification Channels

| Event | GitHub | Email | Slack | Prism | Urgency |
|-------|--------|-------|-------|-------|---------|
| PR opened | ✅ | ⚠️ | ❌ | ✅ | Low |
| PR approved | ✅ | ❌ | ❌ | ✅ | Low |
| PR merged | ✅ | ⚠️ | ⚠️ | ✅ | Low |
| PR failed | ✅ | ✅ | ⚠️ | ✅ | Medium |
| Queue stuck | ✅ | ✅ | ✅ | ✅ | High |
| Breaking change | ✅ | ✅ | ✅ | ✅ | High |

**Legend**:
- ✅ Always notify
- ⚠️ Notify if subscribed/configured
- ❌ Never notify

---

## Exception Handling

### What Happens When Automation Fails?

#### Auto-Approval Fails

**Causes**:
- PR does not meet criteria
- Required checks fail
- Labels indicate human review needed

**Action**:
- ⏸️ Pause automation
- 📌 Add `needs-review` label
- 📧 Notify CODEOWNERS
- 🔄 Wait for human approval

#### Auto-Merge Fails

**Causes**:
- Merge conflicts
- Queue timeout
- Checks fail after approval
- GitHub API error

**Action**:
- ⏸️ Pause automation
- 📌 Add `needs-rebase` or `needs-review` label
- 📧 Notify PR author and reviewers
- 📊 Log failure in Prism Console
- 🔄 Wait for human intervention

**Retry Logic**:
```yaml
- name: Auto-merge with retry
  uses: pascalgn/automerge-action@v0.16.2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    merge-retries: 3
    merge-retry-sleep: 60000  # 1 minute
```

#### Queue Gets Stuck

**Causes**:
- PR takes too long to run checks
- Circular dependencies
- Infrastructure outage

**Action**:
- 🚨 Alert Operator Team
- 📊 Display warning in Prism Console
- ⏱️ Wait for timeout (60 minutes default)
- 🔄 After timeout, remove PR from queue
- 📧 Notify PR author to investigate

**Manual Override**:
```bash
# Remove PR from queue (GitHub CLI)
gh pr merge <PR_NUMBER> --admin --merge
```

#### False Positive Auto-Merge

**Scenario**: A PR auto-merged that shouldn't have

**Action**:
1. 🚨 Operator notices issue
2. 🔄 Immediately revert merge
3. 📌 Add `do-not-merge` label to original PR
4. 📝 Document what went wrong
5. 🔧 Update automation rules to prevent recurrence
6. 📧 Notify team about the incident

**Prevention**:
- Conservative initial rules
- Gradual expansion of auto-merge categories
- Regular audits of auto-merged PRs
- Soak time for AI-generated PRs

---

## Escalation Path

### Level 1: Automation

- Auto-label → Auto-approve → Auto-merge
- **Duration**: 5-45 minutes
- **Human involvement**: 0%

### Level 2: Bot Review

- Automation fails a check
- Bot adds `needs-review` label
- Bot notifies CODEOWNERS
- **Duration**: 1-4 hours (human review SLA)
- **Human involvement**: 10%

### Level 3: Human Review

- Complex PR, breaking change, or security issue
- Human manually reviews and approves
- May still auto-merge after approval
- **Duration**: 4-24 hours
- **Human involvement**: 50%

### Level 4: Manual Merge

- High-risk change (infra, workflows, CODEOWNERS)
- Human approves AND manually merges
- **Duration**: 24-72 hours
- **Human involvement**: 100%

---

## Audit & Compliance

### Logging

All automation actions are logged:
- **GitHub**: Pull request timeline (comments, labels, approvals)
- **Database**: `github_events` table (via Operator)
- **Prism**: Merge queue dashboard (real-time view)

### Audit Trail

Each auto-merge includes:
```markdown
<!-- Auto-Merge Bot Comment -->
🤖 **Auto-Merge Report**

**Approved By**: docs-bot (automated)
**Merge Method**: squash
**Checks Passed**: ✅ Markdown Lint
**Labels**: docs-only, auto-merge
**Soak Time**: 0 minutes
**Merged At**: 2025-11-18 14:32:15 UTC

**Automation Rule**: Tier 1 (Docs-Only)
**Reference**: GITHUB_AUTOMATION_RULES.md#tier-1-docs-only
```

### Weekly Review

**Every Monday**:
- 📊 Review all auto-merged PRs from previous week
- 📈 Analyze metrics (success rate, failure modes)
- 🔧 Adjust rules as needed
- 📝 Document learnings

---

## Summary

**Phase Q Automation Rules** provide a **comprehensive framework** for managing PRs at scale:

- ✅ **5 Tiers of Auto-Approval** (Docs → Tests → Scaffolds → AI → Dependencies)
- ✅ **Path-Based Workflow Triggers** (Only run relevant CI)
- ✅ **Intelligent Auto-Merge** (With soak time and safety checks)
- ✅ **Comprehensive Labeling** (File-based, size-based, author-based)
- ✅ **Exception Handling** (Failures escalate gracefully)
- ✅ **Full Audit Trail** (Every action logged and traceable)

These rules enable **10x throughput** while maintaining **safety and quality**.

---

**Last Updated**: 2025-11-18
**Owner**: Operator Alexa (Cadillac)
**Related Docs**: `MERGE_QUEUE_PLAN.md`, `AUTO_MERGE_POLICY.md`
