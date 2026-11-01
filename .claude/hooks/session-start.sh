#!/bin/bash
# Installs dependencies so typecheck and the design checks work in cloud sessions.
# Cloud only; synchronous so nothing runs before the install finishes.
set -euo pipefail
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
cd "$CLAUDE_PROJECT_DIR"
# npm install, not npm ci: the container's cached node_modules is reused.
npm install --no-audit --no-fund
