# Hyprtask — Dograh self-hosting (internal dev docs)

Internal planning and deployment notes for running **our Dograh fork** on Hyprtask infrastructure. These docs are not part of the public Mintlify site under `docs/`.

## Repository strategy

```text
dograh-hq/dograh
        │
        │ upstream
        ▼
our GitHub fork
        │
        │ origin
        ▼
D:\DEV\Hyprtask\hyprtask-val   (local working copy)
        │
        ▼
self-hosted infrastructure
```

| Remote | Points to |
|--------|-----------|
| `origin` | Our organization's GitHub fork |
| `upstream` | `dograh-hq/dograh` |

Production should deploy **our fork**, not `dograh-hq/dograh` directly. Track upstream for merges and security fixes.

## Target deployment flow

```text
hyprtask-val (local)
        │ push
        ▼
 GitHub fork
        │ CI/CD (planned)
        ▼
 Tools Server (or dedicated Dograh server)
        │
        ▼
 /opt/dograh  (or /root/dograh-selfhost/dograh/)
        │
        ▼
 Docker Compose → Dograh stack
```

## Documents

| Doc | Contents |
|-----|----------|
| [tools-server.md](tools-server.md) | Read-only discovery results for the Tools Server (Plane co-hosted) |
| [deployment-plan.md](deployment-plan.md) | Dograh requirements, architecture options, port/proxy strategy, CI/CD outline |

## Discovery script

Re-run read-only server inspection (safe alongside Plane):

```bash
bash scripts/tools-server-discovery.sh 2>&1 | tee /tmp/tools-server-discovery.txt
```

Script location: [`scripts/tools-server-discovery.sh`](../scripts/tools-server-discovery.sh)

## Safety rule

**Discovery and planning first.** Do not restart Docker, modify Plane, change firewall rules, or run Dograh `setup_remote.sh` on a host that already serves Plane on ports 80/443 until the deployment plan is approved.

## Status (2026-03-28 discovery)

- Tools Server runs **Plane** via Docker Compose at `/root/plane-selfhost/plane-app/`.
- **4 GB / 2 vCPU** droplet — below Dograh's documented minimum (8 GB / 4 vCPU).
- Ports **80/443** are owned by Plane's **Caddy** proxy.
- **Recommendation:** dedicated 8 GB / 4 vCPU droplet for Dograh, or resize before co-locating.

See [deployment-plan.md](deployment-plan.md) for full analysis and next steps.
