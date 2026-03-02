#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/novelnest-backend"
FRONTEND_DIR="$ROOT_DIR/novelnest-frontend"
COMPOSE_FILE="$BACKEND_DIR/docker/docker-compose.yml"
BACK_PID=""
FRONT_PID=""
CLEANED_UP=0

cleanup() {
  if [[ "$CLEANED_UP" -eq 1 ]]; then
    return
  fi
  CLEANED_UP=1

  echo
  echo "[dev-up] Deteniendo procesos..."
  if [[ -n "$BACK_PID" ]]; then
    kill "$BACK_PID" 2>/dev/null || true
    wait "$BACK_PID" 2>/dev/null || true
  fi
  if [[ -n "$FRONT_PID" ]]; then
    kill "$FRONT_PID" 2>/dev/null || true
    wait "$FRONT_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT

echo "[dev-up] Levantando PostgreSQL..."
docker compose -f "$COMPOSE_FILE" up -d

echo "[dev-up] Aplicando migraciones de Prisma..."
(
  cd "$BACKEND_DIR"
  MAX_RETRIES=10
  RETRY_DELAY=2
  ATTEMPT=1
  until bun run prisma:db:push; do
    if docker compose -f "$COMPOSE_FILE" exec -T db psql -U postgres -d mydb -tAc "SELECT to_regclass('public.\"User\"')" | grep -q "User"; then
      echo "[dev-up] Prisma no pudo sincronizar, pero la tabla User ya existe. Continuando..."
      break
    fi
    if [[ "$ATTEMPT" -ge "$MAX_RETRIES" ]]; then
      echo "[dev-up] No se pudo sincronizar el esquema de Prisma después de $MAX_RETRIES intentos."
      exit 1
    fi
    echo "[dev-up] Prisma aún no conecta con la DB. Reintentando en ${RETRY_DELAY}s... (${ATTEMPT}/${MAX_RETRIES})"
    ATTEMPT=$((ATTEMPT + 1))
    sleep "$RETRY_DELAY"
  done
  bun run prisma:generate >/dev/null
)

echo "[dev-up] Iniciando backend en http://localhost:3000 ..."
(
  cd "$BACKEND_DIR"
  bun run dev
) &
BACK_PID=$!

echo "[dev-up] Iniciando frontend en http://localhost:5173 ..."
(
  cd "$FRONTEND_DIR"
  bun run dev
) &
FRONT_PID=$!

echo "[dev-up] Todo iniciado. Ctrl+C para detener backend/frontend (la DB queda arriba)."
wait "$BACK_PID" "$FRONT_PID"
