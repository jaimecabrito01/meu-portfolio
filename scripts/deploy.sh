#!/usr/bin/env bash
set -Eeuo pipefail

# Run from a clean checkout of the commit validated by CI.
DEPLOY_ROOT="${DEPLOY_ROOT:-$HOME/apps/portfolio}"
PORT="${PORT:-8081}"
BIND_ADDRESS="${BIND_ADDRESS:-0.0.0.0}"
SHA="$(git rev-parse HEAD)"

[[ "$DEPLOY_ROOT" = /* ]] || { echo 'DEPLOY_ROOT precisa ser um caminho absoluto.' >&2; exit 1; }
[[ "$PORT" =~ ^[0-9]{1,5}$ ]] && (( 10#$PORT > 0 && 10#$PORT <= 65535 )) || { echo 'PORT inválida.' >&2; exit 1; }
# IPv4 binding, kept deliberately simple for Compose port interpolation.
[[ "$BIND_ADDRESS" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] || { echo 'BIND_ADDRESS precisa ser um endereço IPv4.' >&2; exit 1; }

docker compose version
mkdir -p "$DEPLOY_ROOT/releases"
# Serialize manual deployments too, not just jobs in GitHub Actions.
exec 9>"$DEPLOY_ROOT/deploy.lock"
flock -n 9 || { echo 'Já existe um deploy em execução.' >&2; exit 1; }

previous=''
if [[ -L "$DEPLOY_ROOT/current" ]]; then
  previous="$(readlink -f "$DEPLOY_ROOT/current")"
fi
release="$(mktemp -d "$DEPLOY_ROOT/releases/${SHA}.XXXXXX")"
git archive "$SHA" | tar -x -C "$release"
(
  umask 077
  printf 'IMAGE_TAG=%s\nPORT=%s\nBIND_ADDRESS=%s\n' "$SHA" "$PORT" "$BIND_ADDRESS" > "$release/.env"
)

compose() {
  local directory="$1"
  shift
  # Persisted per-release configuration must win over the workflow environment.
  env -u IMAGE_TAG -u PORT -u BIND_ADDRESS docker compose \
    --project-name portfolio --env-file "$directory/.env" -f "$directory/compose.yaml" "$@"
}

compose "$release" config --quiet
# A failed build leaves the currently running version untouched.
compose "$release" build --pull

if compose "$release" up -d --no-build --pull never --wait --wait-timeout 90; then
  ln -sfn "$release" "$DEPLOY_ROOT/current"
  echo "Deploy saudável: $SHA"
else
  echo 'Falha ao iniciar a nova versão.' >&2
  compose "$release" ps >&2 || true
  compose "$release" logs --tail=80 web >&2 || true
  if [[ -n "$previous" && -f "$previous/compose.yaml" && -f "$previous/.env" ]]; then
    echo "Restaurando a versão anterior: $previous" >&2
    if ! compose "$previous" up -d --no-build --pull never --wait --wait-timeout 90; then
      echo 'Rollback falhou; intervenção no servidor necessária.' >&2
    fi
  else
    echo 'Primeiro deploy: ainda não há versão anterior para restaurar.' >&2
  fi
  exit 1
fi
