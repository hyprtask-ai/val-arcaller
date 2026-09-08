# Val — enable all OSS feature flags

One-shot script to turn on **every product setting** Dograh OSS supports via `.env` and org-level Platform Settings preferences.

**Run on the Val server** (not on your laptop):

```bash
ssh root@159.65.175.242
cd /opt/dograh
git pull --ff-only origin production   # after this script is merged
chmod +x scripts/enable_val_production_features.sh
./scripts/enable_val_production_features.sh
```

Use `--skip-restart` to preview `.env` / DB changes without restarting.

---

## What the script enables automatically

On deploy, the fork also **auto-enables org UI toggles** on the next login
(`external_pbx_integrations_enabled`, `disposition_mapping_enabled`) via
organization bootstrap — you do not need the script for those if you are on a
recent `production` build. The script is still useful for `.env` flags and
one-shot upgrades on an existing server.

### `.env` (server)

| Setting | Value | Purpose |
|---------|-------|---------|
| `ENABLE_SIGNUP` | `false` | Invite-only (already set on Val) |
| `ENVIRONMENT` | `production` | Production mode |
| `ENABLE_COTURN` | `true` | WebRTC TURN |
| `ENABLE_ARI_MANAGER` | `true` | Asterisk ARI bridge |
| `ENABLE_CAMPAIGN_ORCHESTRATOR` | `true` | Outbound campaigns |
| `ENABLE_CALL_RECORDING_UPLOAD` | `true` | Store call audio in MinIO |
| `FASTAPI_WORKERS` | `2` | API workers (4 vCPU droplet) |
| `LOG_LEVEL` | `INFO` | Production logging |
| `SERIALIZE_LOG_OUTPUT` | `true` | JSON logs |
| `DEFAULT_ORG_CONCURRENCY_LIMIT` | `10` | Campaign concurrency cap |
| `TELEPHONY_WS_TOKEN_SECRET` | generated if missing | Sign telephony media WebSockets |
| `TELEPHONY_WS_TOKEN_ENFORCE` | `true` | Reject unsigned media sockets |

Existing secrets (`OSS_JWT_SECRET`, `POSTGRES_PASSWORD`, `TURN_SECRET`, etc.) are **not** overwritten.

### Organization preferences (Postgres, org id `1` by default)

| Toggle | Value |
|--------|-------|
| External PBX integrations | on |
| Disposition mapping | on |

Configure mapping rules later under **Platform Settings → Preferences**.

---

## What you still add manually (needs your API keys)

These are **features in the product**, but Dograh cannot invent credentials:

| Item | Where |
|------|--------|
| LLM / STT / TTS keys | **Models** |
| Telephony carrier | **Telephony** |
| Langfuse tracing | **Platform Settings → Telemetry** or `.env` `LANGFUSE_*` |
| Sentry errors | `.env` `SENTRY_DSN` |
| Superadmin user | `UPDATE users SET is_superuser = true WHERE email = '...'` |
| New teammates | `docker compose exec -T api python ...` (manual user script) |

---

## Optional flags

```bash
# Different org id
./scripts/enable_val_production_features.sh --org-id 2

# Set telephony WS secret but do not enforce yet (safer first rollout)
./scripts/enable_val_production_features.sh --no-telephony-enforce
```

---

## Verify

```bash
grep -E '^(ENABLE_|TELEPHONY_WS|FASTAPI)' .env
curl -s https://val.hyprtask.ai/api/v1/health
```

In UI: **Platform Settings → Preferences** — External PBX and Disposition mapping switches should be on.

---

## Troubleshooting deploy builds (exit 137)

If `./remote_up.sh --build` fails with `exit code: 137` during `npm run build`
(usually at “Linting and checking validity of types”), the UI Docker build ran
out of memory. The fork’s `remote_up.sh` builds **api then ui sequentially**
to avoid that on 8 GB droplets.

If it still fails, add swap on the server:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Then re-run `./remote_up.sh --build`.

See also [val-production.md](val-production.md).
