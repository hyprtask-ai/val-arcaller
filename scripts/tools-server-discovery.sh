#!/usr/bin/env bash
# Read-only Tools Server discovery for Dograh deployment planning.
# Safe to run alongside Plane — does not modify anything.
set -uo pipefail

section() {
  echo
  echo "================================================================================"
  echo "=== $1"
  echo "================================================================================"
}

section "HOST / OS"
hostname
date -Is 2>/dev/null || date
cat /etc/os-release 2>/dev/null || true
uname -a
hostnamectl 2>/dev/null || true

section "CPU"
nproc 2>/dev/null || true
lscpu 2>/dev/null || true

section "RAM"
free -h 2>/dev/null || true

section "DISK / INODES"
df -h 2>/dev/null || true
df -ih 2>/dev/null || true
lsblk 2>/dev/null || true

section "LOAD / UPTIME"
uptime 2>/dev/null || true
if command -v htop >/dev/null 2>&1; then
  echo "(htop available — run interactively if needed)"
else
  echo "(htop not installed)"
fi
echo "--- top snapshot (batch mode) ---"
COLUMNS=200 top -b -n 1 2>/dev/null | head -n 25 || true

section "GPU"
lspci 2>/dev/null | grep -Ei "nvidia|amd|vga|3d" || echo "(no matching PCI devices or lspci unavailable)"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi 2>/dev/null || true
else
  echo "(nvidia-smi not installed)"
fi

section "DOCKER"
if command -v docker >/dev/null 2>&1; then
  docker --version
  docker compose version 2>/dev/null || docker-compose --version 2>/dev/null || echo "(compose not found)"
  docker info 2>/dev/null | sed -n '1,40p' || true
  echo "--- running containers ---"
  docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" 2>/dev/null || true
  echo "--- all containers ---"
  docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" 2>/dev/null || true
  echo "--- compose projects ---"
  docker compose ls 2>/dev/null || true
  echo "--- images (top 30) ---"
  docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" 2>/dev/null | head -n 31 || true
  echo "--- volumes ---"
  docker volume ls 2>/dev/null || true
  echo "--- networks ---"
  docker network ls 2>/dev/null || true
  echo "--- docker stats (one shot) ---"
  docker stats --no-stream 2>/dev/null || true
  echo "--- container resource limits ---"
  if [ -n "$(docker ps -q 2>/dev/null)" ]; then
    docker inspect $(docker ps -q) \
      --format '{{.Name}} CPU={{.HostConfig.NanoCpus}} MEM={{.HostConfig.Memory}}' 2>/dev/null || true
  fi
  echo "--- docker disk usage ---"
  docker system df 2>/dev/null || true
  sudo du -sh /var/lib/docker 2>/dev/null || du -sh /var/lib/docker 2>/dev/null || true
else
  echo "Docker not installed or not in PATH"
fi

section "PLANE SEARCH"
echo "--- common install roots ---"
for d in /opt /srv /var/www /home /var/opt /root; do
  [ -d "$d" ] && ls -la "$d" 2>/dev/null || true
done
echo "--- plane-related paths (depth 4) ---"
sudo find /opt /srv /var/www /home /var/opt /root -maxdepth 4 -iname "*plane*" 2>/dev/null | head -n 50 || true
echo "--- plane containers ---"
if command -v docker >/dev/null 2>&1; then
  docker ps -a --format '{{.Names}}' 2>/dev/null | grep -i plane || echo "(no container names matching 'plane')"
fi

section "LISTENING PORTS"
if command -v ss >/dev/null 2>&1; then
  sudo ss -tulpn 2>/dev/null || ss -tulpn 2>/dev/null || true
else
  sudo netstat -tulpn 2>/dev/null || netstat -tulpn 2>/dev/null || true
fi
echo "--- lsof LISTEN (first 80 lines) ---"
sudo lsof -i -P -n 2>/dev/null | grep LISTEN | head -n 80 || true

section "FIREWALL"
if command -v ufw >/dev/null 2>&1; then
  sudo ufw status verbose 2>/dev/null || ufw status verbose 2>/dev/null || true
elif command -v firewall-cmd >/dev/null 2>&1; then
  sudo firewall-cmd --state 2>/dev/null || true
  sudo firewall-cmd --list-all 2>/dev/null || true
else
  echo "(no ufw or firewalld found)"
fi

section "REVERSE PROXY"
for svc in nginx apache2 traefik caddy; do
  echo "--- systemctl $svc ---"
  systemctl status "$svc" --no-pager 2>/dev/null | head -n 12 || echo "($svc not active or not installed)"
done
echo "--- proxy processes ---"
ps aux 2>/dev/null | grep -Ei "nginx|apache|traefik|caddy" | grep -v grep || true
if command -v nginx >/dev/null 2>&1; then
  echo "--- nginx -T (first 120 lines) ---"
  sudo nginx -T 2>/dev/null | head -n 120 || true
fi
if command -v apachectl >/dev/null 2>&1; then
  echo "--- apachectl -S ---"
  sudo apachectl -S 2>/dev/null || true
fi

section "SYSTEMD DOCKER-RELATED UNITS"
systemctl list-units --type=service --all 2>/dev/null | grep -Ei "docker|nginx|plane|caddy|traefik" || true

section "SUMMARY TEMPLATE (fill from output above)"
cat <<'EOF'

--- RECORD THESE VALUES ---
OS:
CPU model:
CPU cores:
RAM total / used / available:
Disk root (/):
Available disk on /:
Inodes available:
Load average:
Docker version:
Docker Compose version:
GPU:
Running containers (count):
Plane install path:
Plane ports in use:
Reverse proxy:
Firewall:
Ports 80/443 status:
Ports 5432/6379 status:
Ports 3478/5349/49152-49200 status:
Docker /var/lib/docker size:
EOF
