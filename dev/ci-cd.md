# CI/CD — Val production (`val.hyprtask.ai`)

Automated deploy of the Dograh fork to the Val droplet when **`production`** is updated.

**Workflow:** [`.github/workflows/deploy-val-production.yml`](../.github/workflows/deploy-val-production.yml)

---

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `master` | Day-to-day development; merge PRs here |
| `production` | **Only branch that deploys** to `https://val.hyprtask.ai` |

```text
feature → PR → master  (no auto-deploy)
                │
                │ merge / fast-forward when ready to release
                ▼
           production  →  GitHub Actions  →  /opt/dograh on Val droplet
```

Release to production:

```bash
git checkout production
git pull origin production
git merge --ff-only origin/master   # or: git merge master
git push origin production
```

Or open a PR **`master` → `production`** and merge when ready.

---

## What the workflow does

On push to `production` (or manual **Run workflow**):

1. SSH to the Val server
2. `cd /opt/dograh`
3. `git fetch` + `checkout production` + `pull --ff-only`
4. `git submodule update --init --recursive`
5. `./remote_up.sh --build`
6. `curl` health check on `https://val.hyprtask.ai/api/v1/health`

Deploy is **not** automatic from `master`.

---

## One-time GitHub setup

### 1. Create `production` branch

If it does not exist on GitHub yet:

```bash
git checkout master
git pull origin master
git checkout -b production
git push -u origin production
```

### 2. GitHub Environment (optional but recommended)

**Repo → Settings → Environments → New environment**

- Name: **`production`**
- Optional: required reviewers before deploy

The workflow uses `environment: production`.

### 3. Repository secrets

**Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|--------|
| `VAL_SSH_HOST` | `159.65.175.242` |
| `VAL_SSH_USER` | `root` |
| `VAL_SSH_PRIVATE_KEY` | Private key that can SSH to the Val droplet (full PEM, including `BEGIN`/`END` lines) |

Use a **dedicated deploy key pair** (not your personal laptop key):

```bash
ssh-keygen -t ed25519 -C "github-actions-val-deploy" -f ~/.ssh/val_deploy -N ""
```

- Add **`val_deploy.pub`** to the server: `/root/.ssh/authorized_keys`
- Put **`val_deploy`** (private) contents into `VAL_SSH_PRIVATE_KEY`

### 4. One-time server git branch

The server should track **`production`**, not `master`:

```bash
ssh root@159.65.175.242
cd /opt/dograh
git fetch origin
git checkout production
git branch -vv
```

Server must be able to **`git pull`** from `hyprtask-ai/val-arcaller` (HTTPS credential store or PAT already configured during initial clone).

**Do not add `upstream` on the server** — see [git-remotes.md](git-remotes.md).

---

## Manual deploy (without CI)

```bash
ssh root@159.65.175.242
cd /opt/dograh
git fetch origin
git checkout production
git pull origin production
git submodule update --init --recursive
./remote_up.sh --build
curl -fsS https://val.hyprtask.ai/api/v1/health
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| SSH action fails | Check `VAL_SSH_*` secrets; verify deploy pubkey in `authorized_keys` |
| `git pull` fails on server | Re-auth HTTPS (`git pull` and enter PAT) or fix credentials in `~/.git-credentials` |
| `pull access denied` for `dograh-local/*` | Normal in build mode — local images are built, not pulled |
| Health check fails after deploy | `docker compose --profile remote logs api --tail 100` on server |
| Submodule out of date | Ensure `git submodule update --init --recursive` ran after pull |

---

## Related

- [val-production.md](val-production.md) — live server details
- [git-remotes.md](git-remotes.md) — local `upstream` vs server remotes
