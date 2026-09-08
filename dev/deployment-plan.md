# Dograh deployment plan — Tools Server

Planning document for self-hosting **our Dograh fork** alongside (or separate from) Plane on Hyprtask infrastructure. Requirements are verified against this repository — see [`docs/deployment/docker.mdx`](../docs/deployment/docker.mdx) and [`docker-compose.yaml`](../docker-compose.yaml).

**Related:** [tools-server.md](tools-server.md) (discovery results)

## Production domain

Dograh will be deployed at **`https://val.hyprtask.ai`**.

| `.env` key | Value |
|------------|-------|
| `PUBLIC_HOST` | `val.hyprtask.ai` |
| `PUBLIC_BASE_URL` | `https://val.hyprtask.ai` |

DNS: **A record** for `val.hyprtask.ai` → Dograh server public IP (or Tools Server IP if co-located behind Caddy).

Health check after deploy:

```bash
curl -f https://val.hyprtask.ai/api/v1/health
```

---

## Dograh stack (from this repo)

### Documented minimum (remote deployment)

From `docs/deployment/docker.mdx`:

- **8 GB RAM**
- **4 vCPUs**
- Root access for `setup_remote.sh`
- Public IP (or reachable private IP + tunnel profile)
- Firewall: TCP 80, 443, 3478, 5349; UDP 3478, 5349, 49152–49200

### Services (`docker-compose.yaml`)

| Service | Purpose | Remote profile |
|---------|---------|----------------|
| `postgres` | pgvector PostgreSQL | Always |
| `redis` | Cache / ARQ queue | Always |
| `minio` | S3-compatible audio storage | Always |
| `api` | FastAPI backend | Always |
| `ui` | Next.js frontend | Always |
| `dograh-init` | Renders nginx/coturn config | `remote`, `local-turn` |
| `nginx` | HTTPS termination | `remote` only |
| `coturn` | WebRTC TURN relay | `remote`, `local-turn` |
| `cloudflared` | Tunnel when no public IP | `tunnel` only |

### Default published ports (compose file)

| Port | Service | Notes |
|------|---------|-------|
| 80, 443 | nginx | **Conflicts with Plane Caddy on Tools Server** |
| 3010 | ui | Can stay internal, proxied by Caddy |
| 8000 | api | Can stay internal, proxied by Caddy |
| 5432 | postgres | Bind to `127.0.0.1` only if co-located |
| 6379 | redis | Bind to `127.0.0.1` only if co-located |
| 9000, 9001 | minio | Compose binds to localhost by default |
| 3478, 5349 | coturn | TCP + UDP — required for voice |
| 49152–49200 | coturn | UDP relay range |

### Required secrets (`.env`)

At minimum: `OSS_JWT_SECRET`, `REDIS_PASSWORD`, `POSTGRES_PASSWORD`, MinIO credentials, `TURN_SECRET`, `PUBLIC_BASE_URL`, `PUBLIC_HOST`, `SERVER_IP`.

Do **not** run bare `docker compose up` on a fresh checkout — use setup scripts or a validated `.env`. See comments at the top of `docker-compose.yaml`.

### GPU

Not required when STT, LLM, and TTS use external APIs. GPU matters only for self-hosted models.

---

## Tools Server vs Dograh requirements

| Requirement | Dograh docs | Tools Server (2026-03-28) |
|-------------|-------------|---------------------------|
| RAM | 8 GB | **3.8 GB** |
| CPU | 4 vCPU | **2 vCPU** |
| Ports 80/443 | Required (default remote) | **Taken by Plane** |
| TURN UDP ports | Required for voice | **Not in UFW** |
| Disk | — | 67 GB free ✓ |
| Dedicated DB/Redis | Expected | Possible (Plane keeps theirs internal) |

**Verdict:** The current 4 GB / 2 vCPU droplet is **not suitable for production Dograh**, especially alongside Plane (~1.7 GB RAM already used, no swap).

---

## Planning answers

### 1. Can the Tools Server host Dograh?

**Not recommended on the current droplet for production.**

Plane uses ~1.7 GB; Dograh adds roughly 1.2–2.0 GB. On 3.8 GB with no swap, OOM risk is high.

Acceptable only for **light dev/testing**: `FASTAPI_WORKERS=1`, external AI APIs, no concurrent calls.

**Recommendation:** New **8 GB / 4 vCPU** droplet for Dograh, or **resize** the Tools Server before co-locating.

---

### 2. Installation location

Follow the Plane convention:

| Option | Path |
|--------|------|
| Mirror Plane layout | `/root/dograh-selfhost/dograh/` |
| Standard app path | `/opt/dograh/` |

Do not install inside the `plane-app` compose project.

---

### 3. Docker / Compose setup

**Do not run `setup_remote.sh` as-is** on the Tools Server — it binds nginx to 80/443 and conflicts with Plane.

For our fork:

1. Clone the GitHub fork to the install path.
2. `git submodule update --init --recursive`
3. Create `.env` (manually or via adapted setup).
4. Use **build mode** — `docker-compose.override.yaml` with local `build:` for `api` and `ui`.
5. Start **without** the `remote` nginx profile; terminate TLS via Plane's Caddy instead.
6. Enable **coturn** (`local-turn` or `remote` profile without nginx) for WebRTC.

Official build/update flow: [docker.mdx — Building from source](../docs/deployment/docker.mdx).

---

### 4. Safe ports

**In use:** 22, 80, 443 (Plane).

**Available for Dograh (internal + Caddy proxy):**

- UI → 3010 (Docker network / localhost)
- API → 8000 (Docker network / localhost)

**Must open in UFW for voice:**

| Port | Protocol |
|------|----------|
| 3478 | TCP + UDP |
| 5349 | TCP + UDP |
| 49152–49200 | UDP |

Do **not** bind Dograh to 80/443 on this host.

---

### 5. Reverse proxy strategy

Plane's **`plane-app-proxy-1` (Caddy)** is the host entry point. Dograh (**`val.hyprtask.ai`**) should be routed as a separate hostname behind it:

```text
<Plane domain>         →  Plane (existing)
val.hyprtask.ai        →  Dograh UI (:3010) + API (:8000)
```

Example Caddy pattern (illustrative — adapt after reading the live Caddyfile):

```caddy
val.hyprtask.ai {
    handle /api/* {
        reverse_proxy dograh-api:8000
    }
    handle {
        reverse_proxy dograh-ui:3010
    }
}
```

Also proxy `/voice-audio/*` to MinIO if exposing recordings through the same host (see `deploy/hostinger/README.md` for Traefik routing patterns — same paths apply conceptually).

**Back up** `/etc/caddy/Caddyfile` (inside the proxy container or mounted volume) before changes.

---

### 6. Dedicated PostgreSQL / Redis?

**Yes — mandatory.**

| Plane | Dograh |
|-------|--------|
| `plane-app-plane-db-1` (Postgres 15) | Own `postgres_data` volume (pgvector) |
| `plane-app-plane-redis-1` (Valkey) | Own `redis_data` volume |

Never share databases or Redis instances between stacks.

---

### 7. Additional CPU / RAM / storage?

| Resource | Action |
|----------|--------|
| RAM | Resize to **8 GB** minimum, or new droplet |
| CPU | Resize to **4 vCPU** for production |
| Disk | No action needed (67 GB free) |
| Swap | Optional 2–4 GB safety net if co-locating — not a substitute for RAM |

---

### 8. GPU necessary?

**No**, with external STT/LLM/TTS APIs (OpenAI, Deepgram, ElevenLabs, etc.).

---

### 9. Deploy without affecting Plane

**Do:**

- Separate compose project, network, and volumes.
- Route Dograh through Plane's Caddy (subdomain).
- Set `FASTAPI_WORKERS=1` on constrained hardware.
- Verify Plane still works after any Caddy change.

**Do not:**

- Run `setup_remote.sh` on the Tools Server (grabs 80/443).
- `docker system prune` or restart Plane containers.
- Share Plane Postgres/Redis/MinIO.
- Publish Dograh Postgres/Redis to `0.0.0.0`.

---

### 10. Backups, monitoring, restart policies

| Component | Approach |
|-----------|----------|
| Postgres | Scheduled `pg_dump`; store off-server |
| MinIO | Volume backup or `mc mirror` |
| `.env` | Encrypted backup (`OSS_JWT_SECRET`, `REDIS_PASSWORD`, `TURN_SECRET`, etc.) |
| Restarts | `restart: unless-stopped` (compose defaults) |
| Monitoring | `docker stats`, disk usage, health endpoints |
| Plane | Backup `/root/plane-selfhost/plane-app/` before Caddy edits |

Dograh health check: `GET /api/v1/health`

---

### 11. GitHub fork on the server

```bash
git clone git@github.com:<org>/hyprtask-val.git /opt/dograh
cd /opt/dograh
git remote add upstream https://github.com/dograh-hq/dograh.git   # if not present
git submodule update --init --recursive
```

Deploy **our fork**, not upstream directly. Merge upstream periodically.

---

### 12. CI/CD (planned)

```text
hyprtask-val (push to master)
        │
        ▼
GitHub Actions
        │ SSH deploy key
        ▼
server: cd /opt/dograh
        git pull && git submodule update --init --recursive
        docker compose build api ui
        docker compose up -d
        │
        ▼
curl -f https://val.hyprtask.ai/api/v1/health
```

Use a GitHub deploy key or Actions secret for SSH. Run Alembic migrations after API updates if schema changed.

---

## Architecture options

### Option A — Separate droplet (recommended)

```text
                 Internet
                    │
         ┌──────────┴──────────┐
         │                     │
  <Plane domain>       val.hyprtask.ai
         │                     │
   Tools Server (4GB)    Dograh Server (8GB/4vCPU)
   Plane only             Full Dograh stack
                          setup_remote.sh OK
                          Own nginx + coturn
```

- Zero risk to Plane.
- Matches Dograh documentation.
- Simplest operations.

### Option B — Same droplet after resize (8 GB / 4 vCPU)

```text
                 Internet
                    │
            Plane Caddy (:443)
              /            \
   <Plane domain>      val.hyprtask.ai
          │                    │
     plane-app stack       dograh stack
                           (no nginx profile)
                           + coturn + UFW UDP rules
```

- Requires Caddy extension and TURN firewall rules.
- Still isolate compose projects and volumes.

### Option C — Current 4 GB droplet (not recommended)

Dev-only: external AI APIs, `FASTAPI_WORKERS=1`, accept OOM risk.

---

## Target architecture (production)

```text
                 Internet
                    │
                    ▼
              Reverse Proxy
               /           \
              /             \
       Plane domain       val.hyprtask.ai
            │                  │
            ▼                  ▼
        Plane stack        Dograh stack
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                 Database   Redis    MinIO
                                      │
                              External AI APIs
                              (STT / LLM / TTS)
                                      │
                                  Telephony
                                      │
                                     PSTN
```

Telephony and AI provider credentials are configured in the Dograh UI / org settings — not baked into compose.

---

## Next steps

### Read-only (before install)

```bash
docker exec plane-app-proxy-1 cat /etc/caddy/Caddyfile
ls -la /root/plane-selfhost/plane-app/
curl -4 -s ifconfig.me; echo
```

### Decision required

Choose one:

1. **New Dograh droplet** (8 GB / 4 vCPU) — preferred.
2. **Resize Tools Server** then co-locate with Caddy routing.

### After decision

1. DNS: `val.hyprtask.ai` → server IP.
2. Clone fork; create `.env` and compose overrides.
3. Open UFW for TURN ports.
4. Extend Caddy (Option B) or run `setup_remote.sh` (Option A).
5. Verify Plane unchanged; verify Dograh `/api/v1/health`.
6. Wire GitHub Actions deploy pipeline.

---

## References

| Resource | Location |
|----------|----------|
| Docker deployment guide | [`docs/deployment/docker.mdx`](../docs/deployment/docker.mdx) |
| Custom domain / SSL | [`docs/deployment/custom-domain.mdx`](../docs/deployment/custom-domain.mdx) |
| External Traefik pattern | [`deploy/hostinger/README.md`](../deploy/hostinger/README.md) |
| Compose file | [`docker-compose.yaml`](../docker-compose.yaml) |
| Discovery script | [`scripts/tools-server-discovery.sh`](../scripts/tools-server-discovery.sh) |
| Server discovery report | [tools-server.md](tools-server.md) |
