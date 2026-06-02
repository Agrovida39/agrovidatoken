#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "==> Instalando dependencias del proyecto..."
cd "$CLAUDE_PROJECT_DIR"
npm install

echo "==> Instalando GitHub CLI (gh)..."
if ! command -v gh &>/dev/null; then
  apt-get install -y -qq gh
fi

echo "==> Instalando Vercel CLI..."
if ! command -v vercel &>/dev/null; then
  npm install -g vercel --silent
fi

echo "==> Listo. Herramientas disponibles: gh, vercel, git"
