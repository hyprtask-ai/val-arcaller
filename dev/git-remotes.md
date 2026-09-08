# Git remotes — fork vs upstream

How Hyprtask tracks **official Dograh** vs **our fork**, and where each remote should exist.

---

## Remotes map

```text
dograh-hq/dograh          (official upstream)
        │
        │ fetch / merge only on developer machines
        ▼
hyprtask-ai/val-arcaller  (our fork — origin)
        │
        │ push / pull; CI deploys production branch
        ▼
Local clone               D:\DEV\Hyprtask\hyprtask-val
        │
        ▼
Val server                /opt/dograh  (origin only)
```

| Remote | URL | Where |
|--------|-----|--------|
| `origin` | `git@github.com:hyprtask-ai/val-arcaller.git` | Local, server |
| `upstream` | `https://github.com/dograh-hq/dograh.git` | **Local only** |

**Never deploy `upstream` directly to production.** Merge upstream into your fork on a branch, test, then release via `production`.

---

## Local setup (developer machine)

From the repo root:

```bash
git remote -v
```

If `upstream` is missing:

```bash
git remote add upstream https://github.com/dograh-hq/dograh.git
git fetch upstream
```

Verify:

```bash
git remote -v
# origin    git@github.com:hyprtask-ai/val-arcaller.git (fetch/push)
# upstream  https://github.com/dograh-hq/dograh.git (fetch)
# upstream  DISABLE (push)   ← prevents accidental push to official Dograh
```

Optional — disable push to upstream (recommended):

```bash
git remote set-url --push upstream DISABLE
```

### Sync from official Dograh

Official default branch is **`main`**; our fork uses **`master`**.

```bash
git fetch upstream
git checkout master
git merge upstream/main
# resolve conflicts, run tests
git submodule update --init --recursive
git push origin master
```

Then release to Val when ready: merge `master` → `production` (see [ci-cd.md](ci-cd.md)).

For pipecat submodule bumps, see [merge-pipecat-upstream skill](../.agents/skills/merge-pipecat-upstream/SKILL.md) when applicable.

---

## Val server (`/opt/dograh`)

The production server should have **only `origin`**:

```bash
cd /opt/dograh
git remote -v
# origin  https://github.com/hyprtask-ai/val-arcaller.git (or git@...)
```

**Do not run** `git remote add upstream` on the server. Production pulls **our fork** branch `production` via CI or manual deploy.

If upstream was added by mistake:

```bash
git remote remove upstream
```

---

## Branch tracking

| Location | Branch | Tracks |
|----------|--------|--------|
| Local dev | `master` | `origin/master` |
| Local / CI release | `production` | `origin/production` |
| Val server | `production` | `origin/production` |

---

## Submodule (`pipecat`)

Both fork and upstream use the `pipecat` git submodule. After any upstream merge:

```bash
git submodule update --init --recursive
```

CI and `./remote_up.sh --build` on the server run this automatically.
