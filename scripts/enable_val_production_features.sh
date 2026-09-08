#!/usr/bin/env bash
# Enable OSS product settings for Hyprtask Val (and similar remote installs).
#
# - Writes recommended feature flags into .env (does not overwrite existing secrets)
# - Enables org-level Platform Settings toggles in Postgres
# - Restarts the stack via remote_up.sh unless --skip-restart is passed
#
# Run on the Val server from the install directory:
#   cd /opt/dograh && sudo ./scripts/enable_val_production_features.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# shellcheck source=scripts/lib/setup_common.sh
source "$SCRIPT_DIR/lib/setup_common.sh"

ENV_FILE="${ENV_FILE:-.env}"
ORG_ID="${VAL_ORG_ID:-1}"
SKIP_RESTART=false
ENFORCE_TELEPHONY_WS=true

usage() {
    cat <<'EOF'
Usage: enable_val_production_features.sh [options]

Options:
  --env-file PATH       Path to .env (default: ./.env)
  --org-id ID           Organization id for UI preference toggles (default: 1)
  --skip-restart        Update .env and org prefs only; do not run remote_up.sh
  --no-telephony-enforce
                        Set TELEPHONY_WS_TOKEN_SECRET but leave ENFORCE=false
  -h, --help            Show this help

After running, add third-party credentials manually (not generated here):
  - AI model keys (Models page)
  - Telephony provider credentials (Telephony page)
  - Langfuse / Sentry (Platform Settings or .env)
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --env-file)
            ENV_FILE=$2
            shift 2
            ;;
        --org-id)
            ORG_ID=$2
            shift 2
            ;;
        --skip-restart)
            SKIP_RESTART=true
            shift
            ;;
        --no-telephony-enforce)
            ENFORCE_TELEPHONY_WS=false
            shift
            ;;
        -h | --help)
            usage
            exit 0
            ;;
        *)
            dograh_fail "Unknown option: $1"
            ;;
    esac
done

[[ -f "$ENV_FILE" ]] || dograh_fail "$ENV_FILE not found (run from /opt/dograh)"

generate_secret() {
    openssl rand -hex 32
}

env_value() {
    local key=$1
    if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
        grep "^${key}=" "$ENV_FILE" | head -n1 | cut -d= -f2-
    fi
}

dograh_info "Updating $ENV_FILE with Val OSS feature flags..."

# --- Auth / access (invite-only) ---
dograh_set_env_key "$ENV_FILE" ENVIRONMENT "${ENVIRONMENT:-production}"
dograh_set_env_key "$ENV_FILE" ENABLE_SIGNUP false

# --- Background workers (default on; ensure explicit) ---
dograh_set_env_key "$ENV_FILE" ENABLE_ARI_MANAGER true
dograh_set_env_key "$ENV_FILE" ENABLE_CAMPAIGN_ORCHESTRATOR true

# --- WebRTC ---
dograh_set_env_key "$ENV_FILE" ENABLE_COTURN true

# --- Recordings / campaigns / logging ---
dograh_set_env_key "$ENV_FILE" ENABLE_CALL_RECORDING_UPLOAD true
dograh_set_env_key "$ENV_FILE" DEFAULT_ORG_CONCURRENCY_LIMIT "${DEFAULT_ORG_CONCURRENCY_LIMIT:-10}"
dograh_set_env_key "$ENV_FILE" LOG_LEVEL INFO
dograh_set_env_key "$ENV_FILE" SERIALIZE_LOG_OUTPUT true

# --- API scale (4 vCPU Val droplet) ---
dograh_set_env_key "$ENV_FILE" FASTAPI_WORKERS "${FASTAPI_WORKERS:-2}"

# --- Telephony media WebSocket hardening ---
existing_ws_secret="$(env_value TELEPHONY_WS_TOKEN_SECRET)"
if [[ -z "$existing_ws_secret" ]]; then
    dograh_warn "Generating TELEPHONY_WS_TOKEN_SECRET (was unset)"
    dograh_set_env_key "$ENV_FILE" TELEPHONY_WS_TOKEN_SECRET "$(generate_secret)"
fi
if [[ "$ENFORCE_TELEPHONY_WS" == true ]]; then
    dograh_set_env_key "$ENV_FILE" TELEPHONY_WS_TOKEN_ENFORCE true
else
    dograh_set_env_key "$ENV_FILE" TELEPHONY_WS_TOKEN_ENFORCE false
    dograh_warn "TELEPHONY_WS_TOKEN_ENFORCE left false (--no-telephony-enforce)"
fi

dograh_success "Environment flags written."

dograh_info "Enabling org-level Platform Settings for organization id=${ORG_ID}..."

docker compose exec -T api python <<PY
import asyncio

from api.schemas.organization_preferences import OrganizationPreferences
from api.services.organization_preferences import (
    get_organization_preferences,
    upsert_organization_preferences,
)

ORG_ID = ${ORG_ID}

async def main() -> None:
    current = await get_organization_preferences(ORG_ID)
    updated = OrganizationPreferences(
        test_phone_number=current.test_phone_number,
        timezone=current.timezone,
        external_pbx_integrations_enabled=True,
        disposition_mapping_enabled=True,
        disposition_mapping=current.disposition_mapping,
    )
    await upsert_organization_preferences(ORG_ID, updated)
    print(
        "OK: org",
        ORG_ID,
        "external_pbx_integrations_enabled=True",
        "disposition_mapping_enabled=True",
    )

asyncio.run(main())
PY

dograh_success "Organization preferences updated."

cat <<'EOF'

Manual follow-ups (require your credentials — not auto-generated):
  - Models: add LLM / STT / TTS API keys
  - Telephony: connect a carrier (Twilio, Telnyx, etc.)
  - Platform Settings → Telemetry: Langfuse (optional)
  - .env: SENTRY_DSN=... (optional)
  - .env: LANGFUSE_* (optional org-wide tracing)

EOF

if [[ "$SKIP_RESTART" == true ]]; then
    dograh_warn "Skipping restart (--skip-restart). Run ./remote_up.sh to apply .env changes."
    exit 0
fi

dograh_info "Restarting stack..."
./remote_up.sh

dograh_success "Done. Verify: curl -s https://val.hyprtask.ai/api/v1/health"
