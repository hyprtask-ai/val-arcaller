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

Val pins **pipecat** as a submodule. The app fork is `hyprtask-ai/val-arcaller`; the pipecat fork is **`hyprtask-ai/pipecat`** (fork of `dograh-hq/pipecat`). URL is in `.gitmodules`; CI and the server fetch pipecat from that fork, not from Dograh’s org.

```text
dograh-hq/pipecat          (Dograh’s pipecat fork — merge source)
        │
        │ fetch / merge on developer machines only
        ▼
hyprtask-ai/pipecat        (our pipecat fork — submodule URL)
        │
        │ push Val-specific pipecat commits here
        ▼
val-arcaller               gitlink SHA in parent repo
        │
        ▼
CI / Val server            submodule update → hyprtask-ai/pipecat
```

| Remote (inside `pipecat/`) | URL | Use |
|----------------------------|-----|-----|
| `origin` | `https://github.com/hyprtask-ai/pipecat.git` | push Val pins / Hyprtask-only fixes |
| `dograh` | `https://github.com/dograh-hq/pipecat.git` | fetch Dograh’s `main`, merge or cherry-pick |

Local setup after clone:

```bash
git submodule update --init --recursive
cd pipecat
git remote -v   # origin → hyprtask-ai; add dograh if missing:
# git remote add dograh https://github.com/dograh-hq/pipecat.git
```

After changing pipecat on your machine: **push `pipecat` to `origin` (hyprtask-ai) first**, then in the parent repo commit the updated gitlink if the SHA changed:

```bash
cd pipecat && git push origin main
cd .. && git add pipecat && git commit -m "Bump pipecat submodule"
```

CI and `./remote_up.sh --build` run `git submodule update --init --recursive` automatically.
