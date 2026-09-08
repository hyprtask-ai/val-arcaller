# Tools Server — discovery report

Read-only inspection of the Hyprtask **Tools Server** before installing Dograh. Plane is already deployed on this host.

**Discovery date:** 2026-03-28  
**Host:** `ubuntu-s-2vcpu-4gb-amd-nyc3-01` (DigitalOcean Droplet)

---

## Server snapshot

| Item | Value |
|------|-------|
| **OS** | Ubuntu 24.04.3 LTS (Noble Numbat) |
| **Kernel** | 6.8.0-71-generic |
| **Virtualization** | KVM (DigitalOcean Droplet) |
| **CPU** | 2 vCPU — AMD DO-Premium-AMD @ 2.0GHz |
| **RAM** | 3.8 GiB total, ~2.0 GiB used, ~1.8 GiB available |
| **Swap** | None |
| **Disk (`/`)** | 77 GB total, 67 GB free (13% used) |
| **Inodes** | 96% free — not a concern |
| **Load average** | 0.01, 0.03, 0.02 |
| **Uptime** | 163 days |
| **Docker** | 29.3.1 |
| **Docker Compose** | v5.1.1 |
| **GPU** | None (Virtio display only; no `nvidia-smi`) |
| **Docker storage** | 5.3 GB in `/var/lib/docker` |

---

## Firewall (UFW)

Status: **active** — default deny incoming.

| Port | Action |
|------|--------|
| 22/tcp | ALLOW |
| 80/tcp | ALLOW |
| 443/tcp | ALLOW |

TURN/WebRTC ports (3478, 5349, 49152–49200 UDP) are **not** open yet.

---

## Listening ports (host)

| Port | Process | Notes |
|------|---------|-------|
| 22 | sshd | SSH |
| 80 | docker-proxy → Plane Caddy | **Taken** |
| 443 | docker-proxy → Plane Caddy | **Taken** |
| 53 | systemd-resolved | Local DNS only |

Plane's Postgres, Redis, MinIO, and RabbitMQ are **not** published to the host — internal Docker network only.

---

## Reverse proxy

Plane's entry point is **`plane-app-proxy-1`**, running **Caddy** on `0.0.0.0:80` and `0.0.0.0:443`.

Internal nginx processes also run inside some Plane frontend containers; they are not the host-level proxy.

There is no system-level nginx, Apache, or Traefik service on the host.

---

## Plane installation

### Layout

```text
Tools Server
└── /root/plane-selfhost/plane-app/
    └── docker-compose.yaml   →  Compose project: plane-app
```

### Running containers (2026-03-28)

| Container | Image | Host ports | Status |
|-----------|-------|------------|--------|
| `plane-app-proxy-1` | `plane-proxy:v1.2.3` | 80, 443 | Up 5 months |
| `plane-app-live-1` | `plane-live:v1.2.3` | (internal) | Up 5 months |
| `plane-app-admin-1` | `plane-admin:v1.2.3` | (internal) | Up 5 months (healthy) |
| `plane-app-space-1` | `plane-space:v1.2.3` | (internal) | Up 5 months (**unhealthy**) |
| `plane-app-web-1` | `plane-frontend:v1.2.3` | (internal) | Up 5 months (healthy) |
| `plane-app-beat-worker-1` | `plane-backend:v1.2.3` | (internal) | Up 5 months |
| `plane-app-worker-1` | `plane-backend:v1.2.3` | (internal) | Up 5 months |
| `plane-app-api-1` | `plane-backend:v1.2.3` | (internal) | Up 5 months |
| `plane-app-plane-db-1` | `postgres:15.7-alpine` | (internal) | Up 5 months |
| `plane-app-plane-mq-1` | `rabbitmq:3.13.6` | (internal) | Up 5 months |
| `plane-app-plane-redis-1` | `valkey:7.2.11-alpine` | (internal) | Up 5 months |
| `plane-app-plane-minio-1` | `minio/minio:latest` | (internal) | Up 5 months |

Exited: `plane-app-migrator-1` (one-shot migration, normal).

### Memory usage (Plane only)

Approximate total: **~1.7 GB** across running containers.

| Container | Memory |
|-----------|--------|
| `plane-app-worker-1` | 423 MiB |
| `plane-app-plane-minio-1` | 234 MiB |
| `plane-app-api-1` | 178 MiB |
| `plane-app-beat-worker-1` | 163 MiB |
| `plane-app-space-1` | 152 MiB |
| `plane-app-live-1` | 150 MiB |
| `plane-app-plane-mq-1` | 135 MiB |
| `plane-app-plane-db-1` | 126 MiB |
| Others | &lt; 20 MiB each |

No Docker CPU/memory limits are set on containers (`NanoCpus=0`, `Memory=0`).

### Docker resources

| Type | Count / size |
|------|----------------|
| Images | 10 (4.5 GB) |
| Containers | 13 (12 running) |
| Volumes | 27 (432 MB) |
| Compose projects | `plane-app` |

### Other paths checked

| Path | Contents |
|------|----------|
| `/opt` | `containerd`, `digitalocean` agent only |
| `/srv` | Empty |
| `/var/www` | Not present / empty |
| `/home` | Empty |

---

## Architecture diagram (current state)

```text
                 Internet
                    │
                    ▼
         plane-app-proxy-1 (Caddy)
              :80 / :443
                    │
    ┌───────────────┼───────────────┐
    │               │               │
 plane-web    plane-api      plane-live
 plane-admin  plane-worker   plane-space
    │               │               │
    └───────┬───────┴───────┬───────┘
            │               │
      plane-db (PG)   plane-redis (Valkey)
      plane-mq        plane-minio
```

---

## Open items (read-only follow-up)

Before any Dograh install, inspect Plane's Caddy config:

```bash
docker exec plane-app-proxy-1 cat /etc/caddy/Caddyfile
ls -la /root/plane-selfhost/plane-app/
curl -4 -s ifconfig.me; echo
```

Back up the Caddyfile before editing for a Dograh subdomain.

---

## Re-run discovery

```bash
bash scripts/tools-server-discovery.sh 2>&1 | tee /tmp/tools-server-discovery.txt
```
