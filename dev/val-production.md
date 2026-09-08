# Val production server

Live deployment for **VAL (AR Caller)** — Dograh fork at **`https://val.hyprtask.ai`**.

---

## Summary

| Item | Value |
|------|-------|
| **Product** | Val — AR Caller (claim validation) |
| **Domain** | `https://val.hyprtask.ai` |
| **Public IP** | `159.65.175.242` |
| **Private IP (VPC)** | `10.17.0.11` (hyprtools-nyc3-vpc-01) |
| **Droplet** | `hyprtools-prod-val-ubuntu-s-4vcpu-8gb-nyc3` |
| **Size** | 4 vCPU / 8 GB RAM / ~154 GB disk |
| **Region** | NYC3 |
| **DO project** | hyprTools |
| **Firewall** | `hyprtools-val-fw` (Val droplet only) |
| **Install path** | `/opt/dograh` |
| **Compose** | Build mode (`dograh-local/dograh-api:local`, `dograh-local/dograh-ui:local`) |
| **Git remote (server)** | `origin` → `hyprtask-ai/val-arcaller` |
| **Deploy branch** | `production` |
| **Dograh version (deployed)** | 1.46.0 (at initial go-live) |

---

## DNS

| Type | Name | Value |
|------|------|-------|
| A | `val.hyprtask.ai` | `159.65.175.242` |

---

## Firewall (`hyprtools-val-fw`)

Inbound (Val droplet only):

| Port | Protocol | Purpose |
|------|----------|---------|
| 22 | TCP | SSH |
| 80 | TCP | HTTP / ACME |
| 443 | TCP | HTTPS |
| 3478 | TCP + UDP | TURN |
| 5349 | TCP + UDP | TURN TLS |
| 49152–49200 | UDP | TURN relay |

Postgres (5432) and Redis (6379) are **not** opened in the cloud firewall.

---

## Stack (Docker Compose profile `remote`)

| Service | Notes |
|---------|--------|
| `nginx_https` | TLS termination |
| `dograh-api-1` | FastAPI, 2 workers (initial) |
| `dograh-ui-1` | Next.js UI |
| `dograh-postgres-1` | pgvector PostgreSQL |
| `dograh-redis-1` | Redis |
| `minio` | Audio storage (localhost-bound ports) |
| `coturn` | WebRTC TURN |

Health check:

```bash
curl -fsS https://val.hyprtask.ai/api/v1/health
```

---

## `.env` (on server — not in git)

Key public settings:

```env
SERVER_IP=159.65.175.242
PUBLIC_HOST=val.hyprtask.ai
PUBLIC_BASE_URL=https://val.hyprtask.ai
```

Secrets (`OSS_JWT_SECRET`, `REDIS_PASSWORD`, `POSTGRES_PASSWORD`, `TURN_SECRET`, etc.) live in `/opt/dograh/.env` and in local secure storage (`dev/keys.txt` is gitignored).

SSL: Let's Encrypt via `setup_custom_domain.sh`; cert path `/opt/dograh/certs/local.crt`; auto-renewal hook installed.

---

## Deploy

**Automated:** push to `production` → [CI/CD workflow](ci-cd.md)

**Manual:**

```bash
ssh root@159.65.175.242
cd /opt/dograh
git fetch origin && git checkout production && git pull --ff-only origin production
git submodule update --init --recursive
./remote_up.sh --build
```

---

## Related Hyprtask apps (planned)

| Hostname | Product | Stack | Server |
|----------|---------|-------|--------|
| `val.hyprtask.ai` | AR Caller | Dograh | **This droplet** |
| `ivy.hyprtask.ai` | EV | Laravel | Separate (planned) |
| `ara.hyprtask.ai` | AR Analyst | Laravel | Separate (planned) |
| `sam.hyprtask.ai` | Watchdog | TBD | Separate (planned) |

Plane remains on the **Tools Server** (`104.131.15.100`) — not co-located with Val.

---

## Initial go-live checklist

- [x] Droplet provisioned (8 GB / 4 vCPU)
- [x] Docker installed
- [x] Fork cloned to `/opt/dograh`
- [x] `setup_remote.sh` (build mode)
- [x] `setup_custom_domain.sh` → `val.hyprtask.ai`
- [x] Health check passing
- [x] Cloud firewall `hyprtools-val-fw`
- [ ] GitHub Actions secrets configured
- [ ] Server on `production` branch
- [ ] AI provider keys in UI
- [ ] First browser voice test
- [ ] Telephony provider configured (when ready)
