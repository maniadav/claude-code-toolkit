#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 Installing CTK Scoped Agent & Skill System globally..."

node "$SCRIPT_DIR/scripts/ctk-cli.js" install
