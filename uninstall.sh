#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🧹 Uninstalling CTK Scoped Agent & Skill System..."

node "$SCRIPT_DIR/scripts/ctk-cli.js" uninstall
