# Hyprtask — Dograh self-hosting (internal dev docs)

Internal planning and deployment notes for running **our Dograh fork** on Hyprtask infrastructure. These docs are not part of the public Mintlify site under `docs/`.

## Production domain

**Val (AR Caller)** is live at **`https://val.hyprtask.ai`**.

| Setting | Value |
|---------|-------|
| Public URL | `https://val.hyprtask.ai` |
| `PUBLIC_HOST` | `val.hyprtask.ai` |
| `PUBLIC_BASE_URL` | `https://val.hyprtask.ai` |
| Server IP | `159.65.175.242` |
| Install path | `/opt/dograh` |
| Deploy branch | `production` (via [CI/CD](ci-cd.md)) |

---

## Repository strategy

```text
dograh-hq/dograh
        │
        │ upstream (local dev machines only)
        ▼
hyprtask-ai/val-arcaller
        │
        │ origin
        ▼
Local clone  →  push production  →  Val server
```

| Remote | Points to | Where |
|--------|-----------|--------|
| `origin` | `hyprtask-ai/val-arcaller` | Local + Val server |
| `upstream` | `dograh-hq/dograh` | **Local only** — see [git-remotes.md](git-remotes.md) |

Production deploys **our fork**, not `dograh-hq/dograh` directly.

---

## Deployment flow

```text
feature → PR → master
                │
                │ merge when ready to release
                ▼
           production  ──push──►  GitHub Actions
                                      │
                                      ▼ SSH
                                 /opt/dograh
                                      │
                                      ▼
                            ./remote_up.sh --build
                                      │
                                      ▼
                            https://val.hyprtask.ai
```

---

## Documents

| Doc | Contents |
|-----|----------|
| [val-production.md](val-production.md) | Live Val server: IP, firewall, stack, checklist |
| [ci-cd.md](ci-cd.md) | GitHub Actions deploy, secrets, branch strategy |
| [git-remotes.md](git-remotes.md) | Local `upstream` setup; server remotes |
| [tools-server.md](tools-server.md) | Tools Server discovery (Plane co-hosted) |
| [deployment-plan.md](deployment-plan.md) | Planning, architecture options, port/proxy strategy |

---

## Discovery script

Re-run read-only inspection on the Tools Server (safe alongside Plane):

```bash
bash scripts/tools-server-discovery.sh 2>&1 | tee /tmp/tools-server-discovery.txt
```

Script: [`scripts/tools-server-discovery.sh`](../scripts/tools-server-discovery.sh)

---

## Planned Hyprtask AI hosts

| Hostname | Product |
|----------|---------|
| `val.hyprtask.ai` | AR Caller (Dograh) — **live** |
| `ivy.hyprtask.ai` | EV (Laravel) — planned |
| `ara.hyprtask.ai` | AR Analyst (Laravel) — planned |
| `sam.hyprtask.ai` | Watchdog — planned |

---

## Local secrets

Store server `.env` secrets in `dev/keys.txt` locally — that file is **gitignored**. Never commit it.
