#!/usr/bin/env bash
set -euo pipefail

# Automated helper to install backend test dependencies and execute pytest
# using a lightweight SQLite database. This is intended for local development
# and CI smoke checks.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
VENV_DIR="$BACKEND_DIR/.venv-tests"

cd "$BACKEND_DIR"

if [[ ! -d "$VENV_DIR" ]]; then
  python -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

pip install --upgrade pip
pip install -r requirements.txt

export TEST_DATABASE_URL="${TEST_DATABASE_URL:-sqlite+aiosqlite:///./test.db}"
export ENVIRONMENT="${ENVIRONMENT:-testing}"
export ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-http://localhost:3000,http://localhost:8000}"

pytest -v --maxfail=1
